// ==UserScript==
// @name         Quoted
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  affiche toutes les citations qui découlent d'un message, avec un lien pour y accéder
// @author       Dereliction
// @match        https://www.jeuxvideo.com/forums/*
// @icon         https://i.imgur.com/81NbMHq.png
// @license      Exclusive Copyrigth
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/442484/Quoted.user.js
// @updateURL https://update.greasyfork.org/scripts/442484/Quoted.meta.js
// ==/UserScript==
//todo : indiquer s'il y a des citations non lues dans la série quand on actualise
class Params{
    static devMode = false; //si le script est en mode dev pour le debbuging
    static pageLimit = 20; //nombre max de pages que le script va scanner en une seule fois
    static cacheLifespan = 600; //temps pendant lequel le topic est gardé en cache en seconde
    static hideAlreadySeenMessages = false; //cache les messages déjà vus via les citations sur la page courante
    static nbLoadedPages = 0; // nombre de pages chargées
    static hideEveryMessages = true; //cache les messages déjà vu aussi sur les autres pages
    static nbHiddenMessages = 0; //nombre de messages cachés sur la page

    static save(){
        let toBeStored = { pageLimit : Params.pageLimit, hideAlreadySeenMessages : Params.hideAlreadySeenMessages }
        localStorage.setItem('quoted', JSON.stringify(toBeStored));
    }

    static load(){
        let params = localStorage.getItem('quoted');
        if(params){
            let obj = JSON.parse(params);
            Params.pageLimit = !isNaN(parseInt(obj.pageLimit))? parseInt(obj.pageLimit) : 20;
            Params.hideAlreadySeenMessages = obj.hideAlreadySeenMessages;
        }
    }
}

//classe qui contient des méthodes pour le debug/l'affichage
class Helper{
    static timeStart = Date.now();

    static debug(name, ...values){
        if(!Params.devMode) return;
        console.log('___________________________________________________________________ START DEBUG : '+name+'___________________________________________________________________');
        values.forEach(value=>{
            console.log(value);
        });
        console.log('******************************************************************* END DEBUG : '+name+'*******************************************************************');
    }

    static getTime(name){
        console.log(`time for ${name} : ` + (Date.now() - Helper.timeStart)/1000+'s');
    }

    static dateFromTimestamp(ts){
        var date = new Date(ts);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var day = '0'+date.getDate();
        var month = '0'+(1+date.getMonth());
        var year = 1900+date.getYear();

        var formattedTime = day.substring(0,2)+'/'+month.substring(0,2)+'/'+year+ ' ' + hours + ':' + minutes.substring(0,2) + ':' + seconds.substring(0,2);

        return formattedTime;
    }

    static HTMLFromString(string){
        let div = document.createElement('div');
        div.innerHTML = string;
        return div.firstChild;
    }

    //merci à Rand0max pour cette fonction :ange:
    static decryptJvCare(jvCareClass) {
        let base16 = '0A12B34C56D78E9F', url = '', s = jvCareClass.split(' ')[1];
        for (let i = 0; i < s.length; i += 2) {
            url += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
        }
        return url;
    }

    //et pour celle là aussi d'ailleurs :noel:
    static fixMessageJvCare(messageElement) {
        const avatar = messageElement.querySelector('.user-avatar-msg');
        if (avatar && avatar.hasAttribute('data-src') && avatar.hasAttribute('src')) {
            avatar.setAttribute('src', avatar.getAttribute('data-src'));
            avatar.removeAttribute('data-src');
        }
        messageElement.querySelectorAll('.JvCare').forEach(function (m) {
            let anchor = document.createElement('a');
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('href', Helper.decryptJvCare(m.getAttribute('class')));
            anchor.className = m.className.split(' ').splice(2).join(' ');
            anchor.innerHTML = m.innerHTML;
            m.outerHTML = anchor.outerHTML;
        });
        return messageElement;
    }

}

//classe qui gère le cache
class CacheManager {
    static init(){
        CacheManager.refresh();
        if(Params.devMode) CacheManager.list();
    }

    //stock sous la forme {key:#, content:#, lifespan:#}
    static save(key, object, lifespan){
        GM_setValue(key, {'key':key, 'content':object, 'date':Date.now() ,'lifespan':lifespan});
    }

    //parcoure les valeurs stockées dans le cache et les supprime si elles ont dépassé leur date d'expiration
    static refresh(){
        GM_listValues().forEach(key=>{
            let data = GM_getValue(key);
            if((data.date + data.lifespan*1000) <= Date.now()) {
                GM_deleteValue(key);
                Helper.debug('expirations',key + ' expired');
            }
        });
    }

    static deleteAll(){
        GM_listValues().forEach(key => {
            GM_deleteValue(key);
        })
        Helper.debug('cache','cache cleared');
    }

    static delete(key){
        if(GM_getValue(key))
            GM_deleteValue(key);
        else
            Helper.debug('cache','CACHE : rien à supprimer pour la clé ' + key);
    }

    static get(key){
        return GM_getValue(key);
    }

    static list(){
        GM_listValues().forEach(key=>{
            let data = GM_getValue(key);
            Helper.debug('CACHED '+ key, {'key':data.key}, {'content':data.content}, {'date_creation':Helper.dateFromTimestamp(data.date)}, {'lifespan':data.lifespan+'s'}, {'remaining_time': (data.date+data.lifespan*1000 - Date.now())/1000+'s'});
        });
    }
}

//récupère les infos du topic et ses messages
class Topic{

    static pageNumber = 1;
    static currentPage = 1;
    static id = '';
    static messages = [];
    static pagesScanned = 0;
    static lastMessageId = 0;

    static async init(){

        //mise à jour du cache
        CacheManager.init();

        //récupération des paramètres de l'utilisateur
        Params.load();

        //test de la page
        if(!document.querySelector('.conteneur-messages-pagi')) {
            Display.appendCSS();
            Display.modalButton();
            return;
        }

        //les infos du topic
        Topic.id = window.location.href.split('-')[2];

        if (Topic.is410()){
            CacheManager.delete(Topic.id);
            CacheManager.delete('hide_'+Topic.id);
            return;
        }

        Topic.pageNumber = Math.max(...Array.prototype.slice.call(document.querySelectorAll('.bloc-liste-num-page span')).map(ele => parseInt(ele.textContent)).filter(ele=>!isNaN(ele)));
        Topic.currentPage = parseInt(window.location.href.split('-')[3]);

        Display.init();

        //récupération des messages
        await Topic.load();

        //traitement des messages
        RelationMaker.generate(Topic.messages);

        Display.appendCitations();
        Display.removeLoading();
        //Display.displayAllMessagesFromSameAuthor();

        console.log('Quoted loaded');

        //mise en cache du topic
        Topic.save();

    }


    static async load(){

        //on check d'abord le cache, si le topic est déjà dedans alors on récupère les messages en cache
        if(CacheManager.get(Topic.id)){
            let cached = CacheManager.get(Topic.id).content;
            let tempMessages = [...cached.messages];
            //les messages qui sont au format string sont retransformés en HTML
            tempMessages.forEach(msg => {
                Topic.messages.push(Helper.HTMLFromString(msg));
            });
            Helper.debug('cache',tempMessages.length + ' messages loaded from cache');
            //maintenant on relance un scan à partir de la dernière page à laquelle on s'était arrêté en prenant en compte l'id du dernier message enregistré
            //await Topic.scan(cached.pagesScanned, Topic.pageNumber, cached.lastMessageId);
            await Topic.scan(cached.pagesScanned, Topic.currentPage + Params.pageLimit, cached.lastMessageId);
            let newMessagesNumber = Topic.messages.length - cached.messages.length;
            Helper.debug('Load',newMessagesNumber + ' nouveaux messages');
        }
        else await Topic.scan(Topic.currentPage);

        //on récupère le premier message de la page, s'il n'est pas dans le cache, on le régénère (ça veut dire que le user est revenu une ou plusieurs pages en arrière et que celles ci n'étaient pas dans le cache)
        let firstPageMessage = document.querySelector('.bloc-message-forum');
        let hasFirstPageMessage = [...Topic.messages].map(msg=>RelationMaker.getId(msg)).indexOf(RelationMaker.getId(firstPageMessage)) !== -1;
        if(!hasFirstPageMessage){
            Helper.debug('reload','missing messages... page(s) reloaded');
            Topic.messages = [];
            Topic.lastMessageId = 0;
            CacheManager.delete(Topic.id);
            await Topic.scan(Topic.currentPage);
        }
    }

    static async scan(from=1, to=Topic.pageNumber, lastId=Topic.lastMessageId){
        //on limite le nombre de pages max à scanner
        to = Math.min(from + Params.pageLimit, to);
        //on récupère les urls
        let pagesUrls = Topic.getPagesUrls(from, to);
        Helper.debug('urls', from, to);
        let proms = [];
        for(let pageUrl of pagesUrls){
            let prom = fetch(pageUrl);
            prom.then(()=>{
                Params.nbLoadedPages++;
            });
            proms.push(prom);
        }

        await Promise.all(proms).then(responses =>
               Promise.all(responses.map(res => res.text()))).then(pages => {
            let parser = new DOMParser();
            for(let page of pages){
                let pageD = parser.parseFromString(page, 'text/html');
                Topic.getMessages(pageD).forEach(message => {
                    if(parseInt(message.getAttribute('data-id'))>lastId)
                        Topic.messages.push(message);
                });
            }
        })

        Topic.pagesScanned = to;
        Topic.lastMessageId = Topic.messages[Topic.messages.length - 1].getAttribute('data-id');
    }

    //renvoie un tableau des urls dans l'intervalle  spécifié
    static getPagesUrls(from=1, to=Topic.pageNumber){
        let urls = [window.location.href];// on recharge toujours la page courante
        for(let i = from; i<=to; i++){
            let url = window.location.href.split('-');
            url[3] = i;
            if(i <= Topic.pageNumber && i != window.location.href.split('-')[3])
                urls.push(url.join('-'));
        }
        return urls;
    }

    static save(){
        //il faut d'abord convertir les messages en texte sinon ça marche pas
        let messagesTexte = [...Topic.messages].map(msg=>msg.outerHTML);
        //on stocke dans le cache à l'id du topic le nombre de pages scannées et la liste des messages, de cette manière on sait quelles pages recharger quand on retourne sur le topic
        CacheManager.save(Topic.id, {pagesScanned : Topic.pagesScanned , messages : messagesTexte, lastMessageId : Topic.lastMessageId}, Params.cacheLifespan);
    }

    static getMessages(page=document){
        return Array.prototype.slice.call(page.querySelectorAll('.bloc-message-forum:not(.quoted_ignored)'));
    }

    static is410() {
        if (document.querySelector('.img-erreur')) return true;
        return false;
    }

    static async fetchPage(url){
        let content = (await fetch(url)).text();
        Params.nbLoadedPages++;
        return content;
    }
}

//Algo pour mettre en relation les messages en fonction des citations
class RelationMaker{
    static messages = [];
    static relationMap = new Map();

    static generate(messages){
        RelationMaker.messages = [...messages];

        //map de la forme message=>[dates des messages cités]
        let messagesQuotedDates = new Map();
        //map de la forme date=>[messages]
        let messagesIndexedByDates = new Map();

        messages.forEach(message=>{
            let quotedDates = RelationMaker.getQuotedDates(message);
            if (quotedDates.length)
                messagesQuotedDates.set(message, quotedDates);
            if(messagesIndexedByDates.has(RelationMaker.getDate(message))){
                let temp = messagesIndexedByDates.get(RelationMaker.getDate(message)).concat(message);
                messagesIndexedByDates.set(RelationMaker.getDate(message),temp);
            }
            else{
                messagesIndexedByDates.set(RelationMaker.getDate(message),[message]);
            }

        });

        RelationMaker.relationMap = RelationMaker.makeRelations(messagesIndexedByDates, messagesQuotedDates);

    }

    static makeRelations(messagesIndexedByDates, messagesQuotedDates){
        let relations = new Map();
        messagesQuotedDates.forEach((dates, MQD) => {
            for(let date of dates){
                if(messagesIndexedByDates.has(date)){
                    let messageSet = messagesIndexedByDates.get(date);
                    for (let MID of messageSet){
                        let id_MID = RelationMaker.getId(MID);
                        //s'il y a plus d'un message indexé par la même date, alors c'est qu'il y a un pemt et il faut tester
                        if(messageSet.length == 1 || (messageSet.length > 1 && RelationMaker.compare(MID, MQD))){
                            if(relations.has(id_MID)){
                                let temp = relations.get(id_MID).concat(MQD);
                                relations.set(id_MID,temp);
                            }
                            else
                                relations.set(id_MID, [MQD]);
                        }
                    }
                };
            }
        });
        return relations;
    }

    //compare le contenu du message MID avec celui de la citation dans MQD pour éviter les pemts
    static compare(MID, MQD){
        let MQDTxt = Array.prototype.slice.call(MQD.querySelectorAll('.txt-msg > blockquote > p')).map((ele) => ele.textContent).reduce((next, current) => current + " " + next, '');
        let MIDTxt = RelationMaker.getDate(MID) + ' :' + Array.prototype.slice.call(MID.querySelectorAll('.txt-msg>p')).map((ele) => ele.textContent).reduce((next, current) => current + " " + next, '');
        MQDTxt = MQDTxt.replace(/\s/gm, "").replace(/(Le)?\d{2}\w+\d{4}à\d{2}:\d{2}:\d{2}:?(.*aécrit:)?/gm, "").replace(/⭐/gm, '').replace(/ouvrir/gm, '');
        MIDTxt = MIDTxt.replace(/\s/gm, "").replace(/(Le)?\d{2}\w+\d{4}à\d{2}:\d{2}:\d{2}:?(.*aécrit:)?/gm, "").replace(/⭐/gm, '').replace(/ouvrir/gm, '');
        if (MQDTxt === '') return MIDTxt === '';
        if (MIDTxt === '') return MQDTxt === '';
        return (MIDTxt.includes(MQDTxt) || MQDTxt.includes(MIDTxt));
    }

    static getId(message){
        return message.getAttribute('data-id');
    }

    static getDate(message){
        return message.querySelector('.bloc-date-msg').textContent.trim();
    }

    static getAuthor(message){
        return message.querySelector('.bloc-pseudo-msg').textContent.trim();
    }

    static getRelations(message){
        return RelationMaker.relationMap.get(RelationMaker.getId(message));
    }

    static getQuotedDates(message){
        let dates = [];
        let blockQuotes = Array.prototype.slice.call(message.querySelectorAll('.txt-msg > .blockquote-jv'));
        let regFilters = [/\[\d{2}:\d{2}:\d{2}\]\s<.*>/gm,
                          /\d{2}\s[é|û|\w]+\s\d{4}\sà\s\d{2}:\d{2}:\d{2}/gm];
        blockQuotes.forEach(bq => {
            let bqDateBlock = bq.querySelector('p');
            if(!bqDateBlock) {
                let result = [...bq.textContent.matchAll(regFilters[1])][0];
                if(result) dates.push(...result);}
            else{
                if(bqDateBlock.textContent.match(regFilters[1])){
                    dates.push(bqDateBlock.textContent.match(regFilters[1])[0]);
                }
                else if (bqDateBlock.textContent.match(regFilters[0])){
                    let toBeFormated = bqDateBlock.textContent.match(regFilters[0])[0];
                    let formatedDate = RelationMaker.HMSAToStandard(toBeFormated);
                    dates.push(formatedDate);
                }
            }
        });
        return dates;
    }

    //methode qui prend en parametre une chaine au format '[HH:MM:SS] <AUTHOR>' et va chercher la date du message correspondant, puis la return au format standard de jvc
    static HMSAToStandard(HMSA){
        let regHMS = /[\[|\]]/gm;
        let regA = /[<|>]/gm;
        let HMS = HMSA.split(' ')[0].replace(regHMS, '').trim();
        let author = HMSA.split(' ')[1].replace(regA, '').trim();
        for(let message of RelationMaker.messages){
            let messageDate = RelationMaker.getDate(message);
            if(RelationMaker.getAuthor(message) === author && messageDate.includes(HMS)){
                return messageDate;
            }
        };
    }
}

//Pour l'affichage
class Display{

    static init(){
        Display.appendCSS();
        Display.modalButton();
        Display.displayLoading();

    }

    //experimental
    static appendAllMessages(){

        let lastPageMessage=Topic.getMessages()[Topic.getMessages().length-1];

        for(let msg of Topic.messages){
            if(!RelationMaker.relationMap.has(RelationMaker.getId(msg))){
                if(RelationMaker.getId(msg)>RelationMaker.getId(lastPageMessage)){
                    lastPageMessage.parentElement.insertBefore(Helper.fixMessageJvCare(msg), lastPageMessage.nextSibling);
                    lastPageMessage = msg;
                }
            }
        }
    }

    //expérimental
    static displayAllMessagesFromSameAuthor(){
        Topic.getMessages().forEach(message => {
            let button = Helper.HTMLFromString(`<button>Voir tous les messages de ce pseudo</button>`);
            message.append(button);
            let author = RelationMaker.getAuthor(message);
            let first = document.querySelector('.bloc-pagi-default');
            let messagesFromAuthor = [...Topic.messages].filter(msg => RelationMaker.getAuthor(msg) == author);
            button.addEventListener('click', ()=>{
                for(let msg of document.querySelectorAll('.conteneur-messages-pagi > .bloc-message-forum')){
                    msg.style.display = 'none';
                }
                for(let msgQ of document.querySelectorAll('.conteneur-messages-pagi > .quoted_msg-container')){
                    msgQ.style.display = 'none';
                }
                for(let msg of messagesFromAuthor.reverse()){
                    document.querySelector('.conteneur-messages-pagi').insertBefore(Helper.fixMessageJvCare(msg), first.nextSibling);
                }
            });
        });
    }

    static appendCitations(){
        //Display.appendAllMessages();
        Topic.getMessages().forEach((message)=>{
            if(Display.isQuoted(message)){
                let citationNumber = RelationMaker.getRelations(message).length;
                //Display.createModalButton(message, citationNumber);
                Display.buttonMaker(message);
            }
        });
        if(Params.hideEveryMessages && Params.hideAlreadySeenMessages) Display.hideEveryMessages();
    }

    static displayLoading(){
        for (let message of Topic.getMessages()){
            let loader = Helper.HTMLFromString(`<em class="quoted_loading">Chargement des citations, 0 pages chargées</em>`)
            message.append(loader);
            setInterval(()=>{loader.innerHTML = `Chargement des citations, ${Params.nbLoadedPages} pages chargées`; },1000);
        }
    }

    static removeLoading(){
        for (let loadingMessage of document.querySelectorAll('.quoted_loading')){
            loadingMessage.remove();
        }
        // Get a reference to the last interval + 1
        const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

        // Clear any timeout/interval up to that id
        for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }
    }

    static buttonMaker(message, parentElement = document.querySelector('.conteneur-messages-pagi')){
        //append le bouton comme pour l'autre méthode
        let citationNumber = RelationMaker.getRelations(message).length;
        let button = Helper.HTMLFromString(`<button class="quoted_btn-container">Quoted (cité ${citationNumber} fois)</button>`);

        let divContainerMessage =Helper.HTMLFromString(`<div class="quoted_msg-container mx-2 mx-lg-0" id="bloc-quoted_message-${RelationMaker.getId(message)}"></div>`);
        parentElement.insertBefore(divContainerMessage,message);
        divContainerMessage.append(message,button);

        button.addEventListener('click',()=>{
            const container = button.parentElement.querySelector('.quoted_container');
            if(!container) {
                Display.containerMaker(message);
                button.innerHTML += ' ▼';
            }
            else {
                container.remove();
                button.innerHTML = button.innerHTML.replace('▼','');
            }
            let divHidden = document.querySelector('.quoted_hidden-display');
            divHidden.innerHTML = Params.nbHiddenMessages;
            if(Params.nbHiddenMessages > 0) divHidden.style.display = 'block';
        });

        //CSS
        message.classList.remove('mx-2', 'mx-lg-0');
        message.style.marginBottom = 0;
    }

    //crée le conteneur pour les messages en citation et y ajoute les messages
    static containerMaker(message){
        const container = Helper.HTMLFromString(`<div class="quoted_container"></div>`);
        message.parentElement.append(container);
        let citations = RelationMaker.getRelations(message).map(msg=>{Display.removeQuote(msg);msg.classList.add('quoted_ignored'); return Helper.fixMessageJvCare(msg.cloneNode(true))});
        container.append(...citations);

        if(Params.hideAlreadySeenMessages) Display.hideMessages(citations);

        if(Params.hideEveryMessages && Params.hideAlreadySeenMessages) Display.cacheHiddenMessages(citations);

        citations.forEach(cit => {
            if(cit.clientWidth<200) cit.querySelector('.bloc-date-msg').remove();
            Display.addURLButton(cit);
            Fix.buttons(cit);

            if(Display.isQuoted(cit)) Display.buttonMaker(cit, container);
        });

        //CSS
        message.parentElement.style.position = "relative";

    }

    static cacheHiddenMessages(citations){
        let temp = [...citations].map(cit => RelationMaker.getId(cit));
        let cache = CacheManager.get('hide_'+Topic.id)?.content;
        if(cache){
            cache = [...new Set(cache.concat(temp))];
            CacheManager.save('hide_'+Topic.id, cache, Params.cacheLifespan);
        }
        else CacheManager.save('hide_'+Topic.id, temp, Params.cacheLifespan);
        Params.nbHiddenMessages = Display.onCurrentPage(CacheManager.get('hide_'+Topic.id)?.content);
    }

    static hideMessages(messages, fromCache=false){
        messages.forEach(msg=>{
            let id = fromCache ? msg : RelationMaker.getId(msg);
            Topic.getMessages().forEach(pageMsg=>{
                if (RelationMaker.getId(pageMsg) == id && pageMsg.parentElement.classList.contains('conteneur-messages-pagi')) {Display.cacheHiddenMessages([pageMsg]) ; pageMsg.style.display = 'none';}
                else if (RelationMaker.getId(pageMsg) == id && pageMsg.parentElement.parentElement.classList.contains('conteneur-messages-pagi')) {Display.cacheHiddenMessages([pageMsg]) ; pageMsg.parentElement.style.display = 'none';}
            })
        });
    }


    static hideEveryMessages(){
        let messagesToBeHidden = CacheManager.get('hide_'+Topic.id)?.content; // liste des id des messages à cacher
        if(messagesToBeHidden) Display.hideMessages(messagesToBeHidden, true);
    }

    //ajoute le bouton de redirection vers le message
    static async addURLButton(message){
        // test si le bouton est déjà présent
        if(message.querySelector('.quoted_redirection')) return;

        let url = await Display.getMessageUrl(message);
        if(!url) return;
        let page = url.split('-')[3]
        const link = Helper.HTMLFromString(`<a href="${url}" class="quoted_redirection">Aller (page ${page})</a>`);
        message.append(link);
    }

    static isQuoted(message){
        return RelationMaker.relationMap.has(RelationMaker.getId(message));
    }

    static removeQuote(message){
        let quotes = message.querySelectorAll('.txt-msg > .blockquote-jv');
        //on retire la quote que si elle est unique, sinon on la laisse pour éviter la confusion si plusieurs messages sont cités
        if(quotes.length == 1){
            for(let quote of quotes){
                quote.style.display = 'none';
            }
        }
    }

    //renvoie le nombre de messages de la liste qui sont présents sur la page courante
    static onCurrentPage(messages){
        if (!messages) return 0;
        let count = 0;
        messages.forEach(message => {
            if ([...Topic.getMessages()].map(msg => RelationMaker.getId(msg)).includes(message)) count++;
        });
        return count;
    }

    static async getMessageUrl(message){
        let messagePageLien = message.querySelector('.bloc-date-msg a')?.getAttribute('href');
        if (!messagePageLien) return null;
        let messagePage = await Topic.fetchPage(messagePageLien);
        let parser = new DOMParser();
        let messagePageParsed = parser.parseFromString(messagePage, 'text/html');
        let messageUrl = messagePageParsed.querySelector('.bloc-return-topic a')?.getAttribute('href');
        return messageUrl;
    }

    static modalButton(){
        Params.nbHiddenMessages = Display.onCurrentPage(CacheManager.get('hide_'+Topic.id)?.content) ?? 0;
        const options = document.querySelector('.spreadContainer.spreadContainer--rowLayout');
        const icon = Helper.HTMLFromString(`<span class="quoted_icon">Q</span>`);
        options.append(icon);
        if(Params.hideAlreadySeenMessages) {
            let divHidden = Helper.HTMLFromString(`<div class="quoted_hidden-display">${Params.nbHiddenMessages}</div>`);
            icon.append(divHidden);
            if(Params.nbHiddenMessages == 0) divHidden.style.display = 'none';
        }
        icon.addEventListener('click', ()=>{
            const modal = document.querySelector('.quoted_options');
            if(!modal)
                options.append(Display.modalOptions());
            else
                modal.remove();
        });
    }

    static modalOptions(){
        const modal = Helper.HTMLFromString(`<div class="quoted_options"></div>`);
        const title = Helper.HTMLFromString(`<h3>Options</h3>`);
        const numPageLabel = Helper.HTMLFromString(`<label for="quoted_numPage">Nombre de pages à scanner: </label>`);
        const numPageInput = Helper.HTMLFromString(`<input id="quoted_numPage" type="number" min="1" value="${Params.pageLimit}"/>`);
        const hideMessagesLabel = Helper.HTMLFromString(`<label for="quoted_hideMessages">Cacher les messages déjà vus: </label>`);
        const hideMessagesInput = Helper.HTMLFromString(`<input id="quoted_hideMessages" type="checkbox" ${Params.hideAlreadySeenMessages? 'checked' : ''}/>`);
        const emptyCacheBtn = Helper.HTMLFromString(`<button>Vider le cache</button>`);
        const ValiderBtn = Helper.HTMLFromString(`<button>Valider</button>`);

        const numPageDiv = Helper.HTMLFromString(`<div class="quoted_options-element"></div>`);
        numPageDiv.append(numPageLabel, numPageInput);

        const hideMessagesDiv = Helper.HTMLFromString(`<div class="quoted_options-element"></div>`);
        hideMessagesDiv.append(hideMessagesLabel, hideMessagesInput);

        const buttonsDiv = Helper.HTMLFromString(`<div class=""></div>`);
        buttonsDiv.append(emptyCacheBtn, ValiderBtn);

        const elementsDiv = Helper.HTMLFromString(`<div class="quoted_options-elements"></div>`);
        elementsDiv.append(numPageDiv, hideMessagesDiv);

        if(Params.hideAlreadySeenMessages) elementsDiv.append(Helper.HTMLFromString(`<p class="quoted_hidden">(${Params.nbHiddenMessages} messages cachés)<p>`));

        elementsDiv.append(buttonsDiv);

        modal.append(title, elementsDiv);

        ValiderBtn.addEventListener('click', ()=>{
            let nPages = numPageInput.value;
            if(isNaN(parseInt(nPages)) || nPages < 1) return;
            Params.pageLimit = nPages;
            let hide = hideMessagesInput.checked;
            Params.hideAlreadySeenMessages = hide;
            Params.save();
            elementsDiv.innerHTML = `Changements enregistrés.<br><br> Veuillez recharger la page pour qu'ils soient appliqués.`
            setTimeout(()=>{modal.remove()},5000);
        });

        emptyCacheBtn.addEventListener('click', ()=>{
            CacheManager.deleteAll();
            alert('le cache a été vidé');
        });

        return modal;
    }


    static appendCSS(){

        if(document.querySelectorAll('.bloc-liste-num-page').length) document.querySelectorAll('.bloc-liste-num-page')[1].style.marginTop = '0.9375rem';

        var css = `
        html{ scroll-behavior : smooth; }
        .quoted_hidden-display{ position: absolute; top: -8px; right: -7px; background: #ff4800; padding: 0 0.25rem; border-radius: 4px; }
        .quoted_hidden{ margin: 0; font-style: italic; }
        .spreadContainer.spreadContainer--rowLayout{ position:relative; }
        .quoted_options{ background:#485783; position:absolute; top:25px; z-index:10; color:white; padding: 1rem; padding-bottom: 2rem; min-height: 150px; display: flex; flex-direction: column; justify-content: space-around; user-select: none; border-radius: 10px; border: 1px solid white;}
        .quoted_options-elements{ display: flex; flex-direction: column; justify-content: space-between; height: 85px; }
        .quoted_options-element{ display: flex; justify-content: space-between; align-items:center; }
        .quoted_options-element label{ margin-right: 1rem; }
        .quoted_options-element input{ width:75px; }
        .quoted_options h3{ text-align: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid; font-size: 1.25rem; }
        .quoted_loading{ color:#485783; margin-left:1rem; }
        .quoted_btn-container{ width:100%; border:none; transform:translateY(-1px); background:#485783}
        .quoted_container{ margin-left: 1rem; border-left: 2px #485783 dashed; }
        .quoted_redirection{ margin-left: 0.5rem;}
        .quoted_icon{ background: #485783; color: white; padding: 0.25rem 0.5rem; border-radius: 5px; cursor:pointer; font-weight: bold; position: relative; }
        .quoted_icon:hover{ background: #3c5fc5; }
        .bloc-message-forum{ margin-bottom: 0; margin-top: 0.9375rem;}
        `;
        var style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    }

}

//pour faire fonctionner les scripts de jvc qui ne sont pas récupérés lors de la copie des messages
class Fix {

    static buttons(message){
        let parent = message.querySelector('.bloc-options-msg');
        let buttons = ['quote','tronche'];

        buttons.forEach(button =>{
            let messageBtn = message.querySelector('.picto-msg-'+button);
            let firstMessageBtn = document.querySelector('.picto-msg-'+button+':not(.deboucled-blacklist-jvc-button)');
            let firstMsg = firstMessageBtn.parentElement;
            let firstBtnNext = firstMessageBtn.nextSibling;

            messageBtn.addEventListener('click', function(){

                let temp = firstMessageBtn.getAttribute('data-id-alias');
                if(temp) firstMessageBtn.setAttribute('data-id-alias',messageBtn.getAttribute('data-id-alias'));

                parent.insertBefore(firstMessageBtn, messageBtn);
                firstMsg.insertBefore(messageBtn, firstBtnNext);

                firstMessageBtn.click();

                parent.insertBefore(messageBtn, firstMessageBtn);
                firstMsg.insertBefore(firstMessageBtn, firstBtnNext);

                if(temp) firstMessageBtn.setAttribute('data-id-alias',temp);
            })
        });

    }

}


Topic.init();
