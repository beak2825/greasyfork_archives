// ==UserScript==
// @name         KI-Athena
// @description  Assister la modération du forum
// @match        http://www.kraland.org/main.php*
// @version      1.3.2
// @author       Somin (formerly Gyeongeun)
// @namespace    Secret Weapon
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kraland.org
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/503890/KI-Athena.user.js
// @updateURL https://update.greasyfork.org/scripts/503890/KI-Athena.meta.js
// ==/UserScript==

/* Note : Licence GNU GPL v3 ou plus. Le texte complet de la licence se trouve après le code, ou sur https://spdx.org/licenses/GPL-3.0-or-later.html

Avis de licence : Ce programme est un logiciel libre ;
vous pouvez le redistribuer ou le modifier suivant les termes de la GNU General Public License telle que publiée par la Free Software Foundation ;
soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.

Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE GARANTIE ;
sans même la garantie tacite de QUALITÉ MARCHANDE ou d'ADÉQUATION à UN BUT PARTICULIER.
Consultez la GNU General Public License pour plus de détails.

Vous devez avoir reçu une copie de la GNU General Public License en même temps que ce programme ;
si ce n'est pas le cas, consultez <http://www.gnu.org/licenses>.

--- DISCLAIMER ---
Ce script est une extension indépendante développée par Somin.
Il n'est en aucun cas affilié, approuvé ou lié à redstar et l'administration officielle de kraland.org.
L'utilisation de ce script se fait sous votre propre responsabilité.
------------------ */

(function() {
    'use strict';

//--- Paramètre globaux du script
    var position1=true;
    // réordonner les boutons de modération des sujets
    // bouton "poster un sujet" tout à droite

    var position2=true;
    // 2e jeu de boutons en bas de page des forums

    var cranDeSécurité=2;
    // nombre de jours limite pour la sélection par date
    // mettre en négatif pour supprimer la sécurité

//--- Variables globales
    var param = {
        bp1:position1,
        bp2:position2,
        sfty:cranDeSécurité,
    };

    var centralText=document.getElementById('central-text');
    var centralForm=centralText.querySelector('form');
    var pageForum=document.querySelector('title').innerHTML.includes('Forum');
    var pageProfil=document.querySelector('title').innerHTML.includes('Fiches des Membres') &&
        document.querySelector('#central-text li.on a').innerHTML.includes('Profil Membre') ||
        document.querySelector('title').innerHTML.includes('Fiches des IP') &&
        document.querySelector('#central-text li.on a').innerHTML.includes('Profil IP');

    var nsRow=0, idList=[],forumDisplay=[100,5,2];

    if(sessionStorage.mmod==undefined){
        sessionStorage.mmod=false;
    }

//--- Création du bouton Activer Mod dans le forum et de la nouvelle interface
    MUI();
    function MUI(){
        centralForm=centralText.querySelector('form');
        if(pageForum){
            var isForum=centralText.querySelector('TH');
            if(isForum && !isForum.innerHTML.includes('&nbsp;') && !document.querySelector('h4.ntnb')){
                if(
                    isForum.innerHTML === "Sujets permanents"||
                    isForum.innerHTML === "Sujets en cours"||
                    isForum.innerHTML.startsWith('Débat :')||
                    isForum.innerHTML.startsWith('Tous les sujets')||
                    isForum.innerHTML.startsWith('Sujets non-lus')
                ){
                    var boutonsHauts=centralText.querySelector('.forum-button');
                   if(centralForm){
                        //--- sauvegarde de l'affichage par défaut
                        if(sessionStorage.display==undefined){
                            let p1=centralForm.querySelector('select[name="p1"]').value;
                            let p2=centralForm.querySelector('select[name="p2"]').value;
                            let p3=centralForm.querySelector('select[name="p3"]').value;
                            let display=[p1,p2,p3];
                            sessionStorage.display=display;
                        }
                        //--- Réorganisation des boutons
                        if(param.bp1){
                            let bArray=boutonsHauts.childNodes;
                            for(let i=bArray.length-1;i>=0;i--){
                                boutonsHauts.appendChild(bArray[i]);
                            }
                        }
                        //--- dédoublement en bas du forum
                        if(param.bp2){
                            let nBoutonsBas=boutonsHauts.cloneNode(true);
                            centralForm.parentNode.insertBefore(nBoutonsBas, centralForm.nextSibling);
                        }
                    }
                    //--- Déploiement de la nouvelle interface
                    //--- nouveau bouton "Activer Mod"
                    if(param.bp1){
                        boutonsHauts.insertBefore(createModButton(),boutonsHauts.firstChild);
                        let boutonsBas=centralText.querySelectorAll('.forum-button')[1];
                        boutonsBas.insertBefore(createModButton(),boutonsBas.firstChild);
                    }else{
                        boutonsHauts.appendChild(createModButton());
                        let boutonsBas=centralText.querySelectorAll('.forum-button')[1];
                        boutonsBas.appendChild(createModButton());
                    }
                    function createModButton(){
                        let modButton=createMButton(' Activer Mod');
                        modButton.id='modf';
                        if(sessionStorage.mmod=='true'){modButton.innerHTML='Désactiver mod';}
                        modButton.addEventListener('click',setupFtoolsLite);
                        return modButton;
                    }
                    if(sessionStorage.mmod==='true'){
                        setupFtools();
                    }
                }else if(isForum.innerHTML==="Sujets détruits"){
                    setupRtools();
                }
            }else{
                var boutonsNSRM=centralText.querySelectorAll('.forum-button');
                let isTopic=centralText.querySelector('img[alt="avatar"]') && document.querySelector('h4.ntnb');
                let isModo=centralText.querySelector('input[onclick="CA();"]');
                if(isTopic){
                    setupTtools(boutonsNSRM);
                }else if(isModo){
                    isModo.id='gSelec';
                    isModo.className='gSelec';
                    isModo.removeAttribute('onclick');
                    isModo.addEventListener('click',gSelectLite);
                    setupMtools();
                }
            }
        }else if(pageProfil){
            //if(sessionStorage.pmDate && sessionStorage.oneId){swipe();}
            //todo suppression auto msg profil

            let modButton=createMButton(' Activer Mod');
            modButton.id='modp';
            modButton.addEventListener('click',setupPtoolsLite);
            document.querySelector('#central-text table.forum').previousElementSibling.appendChild(modButton);
            if(sessionStorage.mmod=='true'){
                modButton.innerHTML='Désactiver mod';
                setupPtools();
            }
        }
    }

    //--- afficher/effacer la nouvelle interface de modération
    function setupFtoolsLite(){
        if(sessionStorage.mmod=='true'){
            sessionStorage.mmod=false;
            forumdisplay(sessionStorage.display[0],sessionStorage.display[1],sessionStorage.display[2]).then(doc => {
                // Appliquer le contenu du document dans le corps de la page
                document.querySelector('#central-text').innerHTML = doc.querySelector('#central-text').innerHTML;
                // Appliquer les fonctions supplémentaires après le chargement du contenu
                MUI();
            }).catch(error => {
                // Gérer les erreurs si la promesse est rejetée
                console.error('Une erreur s\'est produite lors du traitement de la requête :', error);
            });
        }else{
            sessionStorage.mmod=true;
            forumdisplay(100,5,2).then(doc => {
                // Appliquer le contenu du document dans le corps de la page
                document.querySelector('#central-text').innerHTML = doc.querySelector('#central-text').innerHTML;
                // Appliquer les fonctions supplémentaires après le chargement du contenu
                MUI();
            }).catch(error => {
                // Gérer les erreurs si la promesse est rejetée
                console.error('Une erreur s\'est produite lors du traitement de la requête :', error);
            });
        }
    }
    //--- affichage des nouveaux outils forum
    function setupFtools(){
        var divH=createFdiv(true);
        centralText.insertBefore(divH,centralText.querySelector('form'));

        if(param.bp2){
            var divB=createFdiv(false);
            let boutonsBas=centralText.querySelectorAll('.forum-button')[1];
            boutonsBas.parentNode.insertBefore(divB,boutonsBas);
        }

        function createFdiv(r){
            let mDiv=document.createElement('div');
            mDiv.className='athBox ath';
            let mDiv1=document.createElement('div');
            let mDiv2=document.createElement('div');

            //--- Interface de modération anti-spam
            let shortcut2=createMButton(' Détruire');
            shortcut2.addEventListener('click',destroy);

            let dSpan=document.createElement('span');
            dSpan.className="dSpan";
            dSpan.style.marginRight='5px';
            dSpan.addEventListener('click',function(){removeD();});
            function removeD(){
                removeDatetime();
                makeSelection();
            }

            let aSpan=document.createElement('span');
            aSpan.className="vSpan";
            aSpan.style.marginRight='5px';
            aSpan.addEventListener('click',function(){removeGuests();});
            let nSpan=document.createElement('span');
            nSpan.className="nSpan";

            let aCocher=document.createElement('input');
            aCocher.type='checkbox';
            aCocher.title='Tout selectionner';
            aCocher.className='gSelec';
            aCocher.addEventListener('click',gSelectLite);

            let oneLabel=document.createElement('label');
            oneLabel.appendChild(aCocher);
            let oneSpan=document.createElement('span');
            oneSpan.className="oneSpan";
            styleLink(oneSpan);
            oneSpan.style.marginRight='5px';;
            oneSpan.appendChild(document.createTextNode('Tout sélectionner'));
            oneLabel.appendChild(oneSpan);

            let fLabel=document.createTextNode('- Filtrer par ');
            let aSelect=document.createElement('select');
            aSelect.style.marginRight='2px';
            aSelect.style.width='150px';
            aSelect.className='aSelect';
            aSelect.innerHTML=getAuthors();
            aSelect.addEventListener('click',achange);
            function achange(){
                let aSelect=centralText.querySelectorAll('.aSelect');
                aSelect.forEach(a=>{
                    a.value=this.value;
                });
                makeSelection();
            }

            let anoLabel=document.createElement('label');
            let anoFilter=document.createElement('input');
            anoFilter.type='checkbox';
            anoFilter.className='gcbx';
            anoFilter.title='Sélectionner les visiteurs';
            anoFilter.addEventListener('click',addGuests);
            anoLabel.appendChild(anoFilter);
            anoLabel.appendChild(document.createTextNode('visiteurs'));

            let dLabel=document.createTextNode(' - depuis ');
            let dSelect=document.createElement('input');
            dSelect.type='datetime-local';
            //dSelect.style.width='150px';
            dSelect.className='dSelec';
            dSelect.addEventListener('change',dchange);
            function dchange(){
                dchangepart(this.value);
                makeSelection();
            }
            let tLabel=document.createTextNode(' - ');
            let ndSelect=document.createElement('input');
            ndSelect.type='number';
            ndSelect.className='ndSelec';
            ndSelect.style.width='32px';
            ndSelect.style.textAlign='center';
            ndSelect.addEventListener('change',ndchange);
            function ndchange(){
                ndchangepart(this.value);
                makeSelection();
            }
            let ndLabel=document.createTextNode(' jours');

            mDiv1.appendChild(shortcut2);
            mDiv1.appendChild(document.createTextNode('à partir de : '));
            mDiv1.appendChild(dSpan);
            mDiv1.appendChild(aSpan);
            mDiv1.appendChild(nSpan);

            mDiv2.appendChild(oneLabel);
            mDiv2.appendChild(fLabel);
            mDiv2.appendChild(aSelect);
            mDiv2.appendChild(anoLabel);
            mDiv2.appendChild(dLabel);
            mDiv2.appendChild(dSelect);
            mDiv2.appendChild(tLabel);
            mDiv2.appendChild(ndSelect);
            mDiv2.appendChild(ndLabel);

            if(r){
                mDiv.appendChild(mDiv1);
                mDiv.appendChild(mDiv2);
            }else{
                mDiv.appendChild(mDiv2);
                mDiv.appendChild(mDiv1);
            }
            return mDiv;
        }

        function getAuthors(){
            //--- récupération des auteurs
            var aList={}, authList='<option value="none" selected>auteur</option>';
            var lineTr=centralText.querySelectorAll('tr');
            for(let i=0; i<lineTr.length; i++){
                let cellstd=lineTr[i].getElementsByTagName('td');
                if(cellstd.length>=6){
                    let idC=cellstd.length-2;
                    let pLink=cellstd[idC].querySelector('a[href*="main.php?p=6_1"]');
                    let params = new URLSearchParams(pLink.href);
                    let id=params.get('p1');
                    if(!(id in aList) && id!=1259){
                        aList[id]=pLink.textContent;
                    }
                }
            }

            var entries= Object.entries(aList);
            entries=entries.sort(([,a],[,b]) => a.localeCompare(b));
            for(let name of entries){
                authList+='<option value="'+name[0]+'">'+name[1]+'</option>';
            }
            return authList;
        }

        //--- cases à cocher
        var token=false;
        var sectionsForum=centralText.querySelectorAll('table');
        for(let i=0; i<sectionsForum.length; i++){
            var colonne16=sectionsForum[i].querySelector('colgroup[width="16"]');
            colonne16.width=42;
            var lignesForum=sectionsForum[i].querySelectorAll('TR');
            for(let j=0; j<lignesForum.length; j++){
                let aCocher=document.createElement('input');
                aCocher.type='checkbox';
                if(j===0 && !lignesForum[j].innerHTML.includes('Sujets permanents')){
                    if(!lignesForum[j].firstChild.innerHTML.includes('Débat')){
                        aCocher.className='gSelec ath';
                        aCocher.id='gSelec';
                        aCocher.title='Tout selectionner';
                        aCocher.addEventListener('click',gSelectLite);
                        lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
                        token=true;
                    }
                }else if(j===0){
                    aCocher.className='dpSelec ath';
                    aCocher.title='Inclure';
                    //aCocher.addEventListener('click',incPerma);
                    if(lignesForum[j].innerHTML.includes('Sujets permanents')){
                        lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
                    }else{
                        lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
                    }
                }else{
                    if(token){
                        aCocher.className='rSelec ath nTopic';
                        aCocher.addEventListener('click',selectedRow);
                    }else{
                        aCocher.className='dpSelec ath dpTopic';
                        //aCocher.addEventListener('click',selectedRow);
                        aCocher.addEventListener('click',selectedRow);
                    }
                    if(lignesForum[j].firstChild.getAttribute('rowspan')>0){
                        lignesForum[j].querySelectorAll('td')[1].insertBefore(aCocher,lignesForum[j].querySelectorAll('td')[1].childNodes[0]);
                    }else{
                        lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
                    }
                }
            }
        }

        //--- sélections filtrées
        function makeSelection(){
            //--- tout déselectionner
            var casesSujets=document.querySelector('#gSelec').parentNode.parentNode.parentNode.querySelectorAll('input[type="checkbox"]:checked');
            //--- tout désélectionner
            for(let i=0;i<casesSujets.length;i++){
                casesSujets[i].checked=false;
            }
            gSelectUncheck();
            nsRow=0;
            try{
                centralText.querySelector('#tempDiv').remove();
            }catch(error){
                //console.log('n/a');
            }

            //--- affichage date
            var dspans=centralText.querySelectorAll('.dSpan');
            var newDatetime=centralText.querySelector('.dSelec').value;
            dspans.forEach(d=>{
                d.innerHTML=newDatetime.replace('T',' ');
                d.dataset.d=newDatetime;
            });

            //--- affichage auteur
            var aspans=centralText.querySelectorAll('.nSpan');
            var aSelect=centralText.querySelector('.aSelect');
            aspans.forEach(a=>{
                if(!a.innerHTML.includes(aSelect.value) && aSelect.value!=="none"){
                var anSpan=document.createElement('span');
                    anSpan.dataset.id=aSelect.value;
                    anSpan.className='v'+aSelect.value;
                    anSpan.innerHTML=aSelect.options[aSelect.selectedIndex].text+' ; ';
                    anSpan.addEventListener('click',removA);
                    a.appendChild(anSpan);
                }
            });

            //--- sélection via filtre
            var sectionsForum=centralText.querySelectorAll('table');
            let k=sectionsForum.length-1;
            var lignesForum=sectionsForum[k].querySelectorAll('TR');
            for(let i=1;i<lignesForum.length;i++){
                var cellstd=lignesForum[i].getElementsByTagName('td');
                if(cellstd.length>=6){
                    let idC=cellstd.length-2;
                    let pLink=cellstd[idC].querySelector('a[href*="main.php?p=6_1_0_1&p1="]');
                    let params = new URLSearchParams(pLink.href);
                    let id=params.get('p1');
                    if(aspans[0].innerHTML.includes(id)){
                        lignesForum[i].querySelector('input').checked=true;
                        gSelectCheck();
                    }
                    let dateTime=cellstd[idC].querySelectorAll('p')[1].innerHTML;
                    const dateConvertie = convertirDate(dateTime);
                    if(newDatetime==''){
                        continue;
                    }else if(dateConvertie>=newDatetime && aspans[0].innerHTML.includes(id) ||
                             dateConvertie>=newDatetime && aspans[0].innerHTML==''
                            ){
                        lignesForum[i].querySelector('input').checked=true;
                        gSelectCheck();
                    }if(dateConvertie<newDatetime){
                        break;
                    }
                }
            }
        }
        //--- Inclure les permanents
        //function incPerma(){}

        //--- retirer un auteur de la liste sélectionnée
        function removA(){
            var aspans=centralText.querySelectorAll('.'+this.className);
            aspans.forEach(a=>{
                a.remove();
            });
            var aSelect=centralText.querySelectorAll('.aSelect');
            aSelect.forEach(as=>{
                as.value='none';
            })
            makeSelection();
        }
    }
    /// fin de setupFtools

    //--- tout sélectionner/déselectionner
    function gSelectLite(){
        var casesSujets=document.querySelectorAll('input[type="checkbox"].rSelec');
        if(this.checked){
            //--- tout sélectionner
            for(let i=0;i<casesSujets.length;i++){
                //nb: filtrer ici
                casesSujets[i].checked=true;
            }
            gSelectCheck();
        }else{
            //--- tout désélectionner
            for(let i=0;i<casesSujets.length;i++){
                casesSujets[i].checked=false;
            }
            gSelectUncheck();
            nsRow=0;
            let athb=centralText.querySelectorAll('.athBox');
            if(athb.length>0){
                let nSelect=centralText.querySelectorAll('.nSpan');
                nSelect.forEach(n=>{n.innerHTML='';});
                let aSelect=centralText.querySelectorAll('.aSelect');
                aSelect.forEach(as=>{as.value='none';});
                removeGuests();
                removeDatetime();
            }
            try{
                centralText.querySelector('#tempDiv').remove();
            }catch(error){
                return;
            }
        }
    }
    function gSelectCheck(){
        var gselect=centralText.querySelectorAll('.gSelec');
        gselect.forEach(function(cbx){
            cbx.checked=true;
            cbx.title='Tout déselectionner';
            if(cbx.parentNode.querySelector('span')){
                cbx.parentNode.querySelector('span').innerHTML="Tout déselectionner";
            }
        });
    }
    function gSelectUncheck(){
        var gselect=centralText.querySelectorAll('.gSelec');
            gselect.forEach(function(cbx){
                cbx.checked=false;
                cbx.title='Tout selectionner';
                if(cbx.parentNode.querySelector('span')){
                    cbx.parentNode.querySelector('span').innerHTML="Tout selectionner";
                }
            });
    }
    function removeDatetime(){
        var display=centralText.querySelectorAll('.dSpan');
        display.forEach(d=>{
            d.innerHTML='';
            d.dataset.d='';
        });
        var dSelect=centralText.querySelectorAll('.dSelec');
        dSelect.forEach(ds=>{
            ds.value='';
        })
        var ndSelect=centralText.querySelectorAll('.ndSelec');
        ndSelect.forEach(nds=>{
            nds.value='';
        })
    }

    function selectedRow(){
        //var m=centralText.querySelector('th').innerHTML.includes("Sujets détruits");
        var gselect=centralText.querySelectorAll('.gSelec');
        if(this.checked){
            gSelectCheck();
            nsRow+=1
            if(this.classList.contains('nTopic') && nsRow==1){
                let oneDiv=document.createElement('div');
                oneDiv.id='tempDiv';

                let barre=document.createElement('input');
                barre.type='text';
                barre.placeholder='Nouveau titre...';
                barre.maxLength=128;
                barre.style.MarginLeft='5px';
                barre.size=32;

                let shortcut1=createMButton(' Renommer');
                shortcut1.addEventListener('click',rename);

                var topTitle=this.parentNode.parentNode.querySelectorAll('td')[1].querySelector('p');
                oneDiv.appendChild(barre);
                oneDiv.appendChild(shortcut1);
                if(pageForum){
                    topTitle.appendChild(oneDiv);
                }else if(pageProfil){
                    topTitle.parentNode.insertBefore(oneDiv,topTitle);
                }
            }
        }else{
            nsRow-=1;
            if(nsRow<1){
                gSelectUncheck();
            }
            if(this.classList.contains('nTopic')){
                try{ centralText.querySelector('#tempDiv').remove();}catch(error){return;}
            }
        }
    }

    //--- Sélectionner les auteurs anonymes
    function addGuests(){
        var display=centralText.querySelectorAll('.vSpan');
        var anocbx=centralText.querySelectorAll('.gcbx');
        if(this.checked){
            display.forEach(s=>{
                s.innerHTML="visiteurs ;";
                s.dataset.a='true';
            });
            anocbx.forEach(e=>{e.checked=true;});
        }else{
            display.forEach(s=>{
                s.innerHTML="";
                s.dataset.a='false';
            });
            anocbx.forEach(e=>{e.checked=false;});
        }
        sessionStorage.wgm=true;
    }
    function removeGuests(){
        var display=centralText.querySelectorAll('.vSpan');
        var anocbx=centralText.querySelectorAll('.gcbx');
                display.forEach(s=>{
                s.innerHTML="";
                s.dataset.a='false';
            });
        anocbx.forEach(e=>{e.checked=false;});
        sessionStorage.removeItem("wgm");
    }

    //--- pour renommer les sujets
    async function rename(){
        let p2=document.querySelector('#tempDiv input[type="text"]').value;
        let p3=0;

        var k=0;
        if(pageProfil){k=1}
        var linkX=document.querySelector('#tempDiv').parentNode.querySelectorAll('a')[k];
        let urlX=linkX.href+'&p0=5';
        console.log(urlX);

        var mDiv=document.createElement('Div');
        mDiv.id='mDiv';
        mDiv.style.display='none';
        document.body.appendChild(mDiv);

        var mGUI = await fetchGETAny(urlX);
        var formHTML = mGUI.querySelector('#central-text form[name="list_msg"]').outerHTML;

        if(formHTML){
            mDiv.innerHTML = formHTML;
            var mForm = mDiv.querySelector('form[name="list_msg"]');
            if(mForm){
                mForm.querySelector('input[name="p2"]').value=p2;
                mForm.querySelector('select[name="p3"]').value=p3;

                let hfFrame=document.createElement('iframe');
                hfFrame.id='hfframe2';
                hfFrame.name='hfframe2';
                hfFrame.style.display='none';
                hfFrame.addEventListener('load',renamed);
                document.body.appendChild(hfFrame);
                mForm.target='hfframe2';
                mForm.submit();
            }else{
                console.error('Le formulaire n\'a pas été trouvé.');
            }
        }else{
            console.error('Le contenu HTML du formulaire n\'a pas été trouvé.');
        }

        function renamed(){
            displayMsg('Résultat','Le sujet a été renommé.');
            linkX.innerHTML=p2;
            document.getElementById('hfframe2').remove();
            document.getElementById('mDiv').remove();
        }
    }

    //--- pour détruire les sujets
    async function destroy(){
        console.log('destroyer activated');
        var allChecked=document.querySelectorAll('input[type=checkbox]:checked.rSelec');
        let authorisation;
        if(allChecked.length==0){
            alert('Aucun sujet sélectionné');
            return;
        }else if(allChecked.length==1){
            authorisation=confirm('ATTENTION - Suppression, \confirmer ?');
        }else if(allChecked.length>1){
            authorisation=confirm('ATTENTION - Suppression multiple, confirmer ?');
        }
        if(!authorisation){return;};

        var allTitles=[], results=[];
        for(let i=0; i<allChecked.length; i++){
            let tLink=allChecked[i].parentNode.parentNode.querySelectorAll('td')[1].querySelector('a[href*="main.php?p="]');
            allTitles.push(tLink.innerHTML);
            let urlX=tLink.href+'&p0=5';
            try{
                let result = await fetchData(urlX, 1);
                results.push(result);
            }catch(error){
                console.error('Erreur lors du fetch pour', urlX, ':', error);
                results.push(null);
            }
            allChecked[i].parentNode.parentNode.remove();
        }

        displayMsg('Sujets détruits','Les sujets ont été détruits. Liste envoyée par kramail.');

        //--- envoie de kramail récap
        var forumName=document.querySelector('#central-text h2').innerHTML;
        await kmDestroyed(allTitles,forumName);
        function kmDestroyed(titleList,fname){
            var tList = "";
            for(let i = 0; i < titleList.length; i++){
                tList += titleList[i] + "\n";
            }
            let msg = `
                [i]Message automatique - script Athéna[/i]

                Forum [b]${fname}[/b]
                Liste des sujets supprimés :
                [spoiler]${tList}[/spoiler]

                ___

                script Athéna`;
            let receiver = "KraDesk [mod]";
            let title = '[Modération] Sujets supprimés';
            sendKM2(receiver,title,msg);
        }
    }

    //--- interface sujet
    function setupTtools(boutonsNSRM){
        //--- Repositionnement des boutons modérer Sujet
        if(param.bp1){
            for(let i=0;i<boutonsNSRM.length;i++){
                let boutons=boutonsNSRM[i];
                let bArray=boutons.childNodes;
                const lastElement = bArray[bArray.length - 1];
                const penultimateElement = bArray[bArray.length - 2];
                boutons.insertBefore(lastElement, bArray[0]);
                boutons.insertBefore(penultimateElement, bArray[1]);

                //--- ajouter nouveaux boutons cacher et lock sujet
                let bLock=isLocked(i);
                let bHide=isHidden(i);
                // insertion des nouveaux boutons avant MNSR
                boutons.insertBefore(bHide,boutons.firstChild);
                boutons.insertBefore(bLock,boutons.firstChild);
            }
        }else{
            for(let i=0;i<boutonsNSRM.length;i++){
                //--- ajouter nouveaux boutons cacher et lock sujet
                let bLock=isLocked(i);
                let bHide=isHidden(i);
                //--- insertion des nouveaux boutons avant MNSR
                boutonsNSRM[i].appendChild(bHide);
                boutonsNSRM[i].appendChild(bLock);
            }
        }
        //--- boutons modifier signature
        let tdff=document.querySelectorAll('td.forum-footer');
        let tdfc=document.querySelectorAll('td.forum-cartouche');
        for(let i=0;i<tdff.length;i++){
            if(!tdff[i].innerHTML.includes("Signature")){
                let nbms=document.createElement('button');
                nbms.innerHTML='Signature';
                styleLink(nbms);
                nbms.dataset.nid=i;
                nbms.dataset.status=true;
                nbms.addEventListener('click',ESLite);

                let t6=document.createTextNode('- ');
                tdff[i].insertBefore(t6,tdff[i].firstChild);
                tdff[i].insertBefore(nbms,tdff[i].firstChild);
            }else{
                continue;
            }
        }

        //--- flèches pour navigation
        try{
            arrowsHead();
        }catch(err){
            console.log(err);
        }
        //---
        function isLocked(i){
            let lmsg=" Bloquer";
            let mTopic=lockTopic;
            if(boutonsNSRM[i].innerHTML.includes('\[sujet bloqué\]')){
                padlock(i);
                lmsg=" Débloquer";
                mTopic=releaseTopic;
            }
            //--- ajouter nouveaux boutons cacher et lock sujet
            let bLock=createMButton(lmsg);
            bLock.className='nmButton';
            bLock.addEventListener('click',mTopic);
            return bLock;
        }

        function isHidden(i){
            let hmsg=" Cacher";
            let mTopic=hideTopic;
            if(document.querySelector('#central-text td.forum-footer').innerHTML.includes("Citer \[caché\] - Répondre \[caché\]")){
                wysih(i);
                hmsg=" Révéler";
                mTopic=releaseTopic;
            }
            let bHide=createMButton(hmsg);
            bHide.className='nmButton';
            bHide.addEventListener('click',mTopic);
            return bHide;
        }

        async function ESLite(){
            if(this.dataset.status=='true'){
                editSignature(this);
                this.dataset.status=false;
            }else{
                closeSMform(this);
                this.dataset.status=true;
            }
        }

        async function editSignature(bes){
            let nid=bes.dataset.nid;

            let hrefp=document.querySelectorAll('#central-text td.forum-cartouche')[nid].querySelector('img').parentNode.href;
            let urlp= new URL(hrefp);

            let isfrp=document.querySelector('#left strong');
            if(isfrp.innerHTML.includes('(RP)')){
                urlp.searchParams.set("p", "6_1_0");
                urlp.searchParams.set("p4", "1");
            }else{
                urlp.searchParams.set("p4", "2");
            }

            //--- ouvrir le lien et récup le form
            let docp= await fetchGETAny(urlp);
            let subm=docp.querySelector('#central-text').querySelectorAll('input[type="submit"')[1];
            let form2=subm.closest('form');
            form2.className='fms';
            form2.target='fname';
            //--- injecter le form
            let tdfm=document.querySelectorAll('#central-text td.forum-message')[nid];
            tdfm.appendChild(form2);
            if(!document.querySelector('iframe.fname')){
                let mframe=document.createElement('iframe');
                mframe.name='fname';
                mframe.id='fname';
                mframe.style.display='none';
                mframe.src = 'about:blank';
                mframe.addEventListener('load', majs);
                tdfm.appendChild(mframe);
            }
        }

        function closeSMform(){
            let allform2=document.querySelector('#central-text').querySelectorAll('form.fms');
            for(let f of allform2){f.remove();};
        }

        async function majs(){
            let iframe = document.getElementById('fname');
            if(iframe && iframe.contentDocument){
                var displayDiv = iframe.contentDocument.querySelector('.display p').innerHTML;
                if(displayDiv){
                    alert(displayDiv);
                    window.location.reload();
                }else{
                    console.error('L\'élément .display n\'a pas été trouvé dans l\'iframe.');
                }
            }else{
                return;
            }
            console.log('ok');
        }
    }

    //--- interface modération sujet
    function setupMtools(){
        for(let i=0;i<2;i++){
            if(centralForm.querySelector('input[name="p12"]').checked){
                padlock(i);
            }
            if(centralForm.querySelector('input[name="p6"]').checked){
                wysih(i);
            }
        }

        //--- nouvelle interface
        let nmpB=createMdiv(false);
        centralForm.appendChild(nmpB);
        function createMdiv(r){
            let mp=document.createElement('p');
            mp.className='athBox ath';
            mp.id='athBox';

            let mDiv1=document.createElement('div');
            let mDiv2=document.createElement('div');

            let aCocher=document.createElement('input');
            aCocher.type='checkbox';
            aCocher.title='Tout selectionner';
            aCocher.className='gSelec';
            aCocher.addEventListener('click',gSelectLite);

            let oneLabel=document.createElement('label');
            oneLabel.appendChild(aCocher);
            let oneSpan=document.createElement('span');
            oneSpan.className="oneSpan";
            styleLink(oneSpan);
            oneSpan.style.marginRight='5px';;
            oneSpan.appendChild(document.createTextNode('Tout sélectionner'));
            oneLabel.appendChild(oneSpan);

            let dSpan=document.createElement('span');
            dSpan.className="dSpan";
            dSpan.style.marginRight='5px';
            dSpan.addEventListener('click',removeD);
            function removeD(){
                let display=centralText.querySelector('.dSpan');
                display.innerHTML='';
                display.dataset.d='';
                let dSelect=centralText.querySelector('.dSelec');
                dSelect.value='';
                let ndSelect=centralText.querySelector('.ndSelec');
                ndSelect.value='';

                makeSelectionM();
            }

            let aSpan=document.createElement('span');
            aSpan.className="vSpan";
            aSpan.style.marginRight='5px';
            aSpan.addEventListener('click',function(){removeGuests();});
            let nSpan=document.createElement('span');
            nSpan.className="nSpan";

            let fLabel=document.createTextNode('Filtrer par ');
            let aSelect=document.createElement('select');
            aSelect.style.marginRight='2px';
            aSelect.style.width='150px';
            aSelect.className='aSelect';
            aSelect.innerHTML=getPosters();
            aSelect.addEventListener('click',achange);
            function achange(){
                let aSelect=centralText.querySelector('.aSelect');
                aSelect.value=this.value;
                makeSelectionM();
            }

            let anoLabel=document.createElement('label');
            let anoFilter=document.createElement('input');
            anoFilter.type='checkbox';
            anoFilter.className='gcbx';
            anoFilter.title='Sélectionner les visiteurs';
            anoFilter.addEventListener('click',addGuests);
            anoLabel.appendChild(anoFilter);
            anoLabel.appendChild(document.createTextNode('visiteurs'));

            let dLabel=document.createTextNode(' - depuis ');
            let dSelect=document.createElement('input');
            dSelect.type='datetime-local';
            dSelect.style.marginRight='5px';
            //dSelect.style.width='150px';
            dSelect.className='dSelec';
            dSelect.addEventListener('change',dchange);
            function dchange(){
                dchangepart(this.value);
                makeSelectionM();
            }

            let tLabel=document.createTextNode('- ');
            let ndSelect=document.createElement('input');
            ndSelect.type='number';
            ndSelect.className='ndSelec';
            ndSelect.style.width='32px';
            ndSelect.style.textAlign='center';
            ndSelect.addEventListener('change',ndchange);
            function ndchange(){
                ndchangepart(this.value);
                makeSelectionM();
            }
            let ndLabel=document.createTextNode(' jours');


            mDiv1.appendChild(document.createTextNode('Sélection à partir de : '));
            mDiv1.appendChild(dSpan);
            mDiv1.appendChild(aSpan);
            mDiv1.appendChild(nSpan);

            mDiv2.appendChild(oneLabel);
            mDiv2.appendChild(fLabel);
            mDiv2.appendChild(aSelect);
            mDiv2.appendChild(anoLabel);
            mDiv2.appendChild(dLabel);
            mDiv2.appendChild(dSelect);
            mDiv2.appendChild(tLabel);
            mDiv2.appendChild(ndSelect);
            mDiv2.appendChild(ndLabel);

            let br0=document.createElement('br');
            if(r){
                mp.appendChild(br0);
                mp.appendChild(mDiv1);
                mp.appendChild(mDiv2);
            }else{
                mp.appendChild(mDiv2);
                mp.appendChild(mDiv1);
            }
            return mp;
        }
        function getPosters(){
            var aList={}, mList={}, lastm, lineTr=centralForm.querySelectorAll('tr');
            for(let i=0; i<lineTr.length-2; i++){
                let cellstd=lineTr[i].getElementsByTagName('td');
                if(cellstd.length>=6){
                    //--- nouvelle checkbox pour restauration
                    if(lineTr[i].className==='c7' && cellstd[2].innerHTML.startsWith('[Détruit par la Modération]')){
                        cellstd[1].innerHTML='';
                        let cbx=document.createElement('input');
                        cbx.type='checkbox';
                        cbx.className='rSelec ath';
                        cbx.addEventListener('click',selectedRow);
                        cellstd[1].appendChild(cbx);
                    }else if(lineTr[i].className===''){
                        try{
                            let bcbx=lineTr[i].querySelector('input[name="p1\[\]"]')
                            bcbx.className+=" rSelec";
                            bcbx.addEventListener('click',selectedRow);
                        }catch(err){
                            console.log('getPosters error : '+err);
                            console.log('i: '+i);
                            console.log('lineTr.length : '+lineTr.length);
                            console.log('innerHTML :'+lineTr[i].innerHTML);
                        }
                    }
                    let pLink=cellstd[4].querySelector('a');
                    if(pLink){
                        let pn=pLink.textContent;
                        if(!(pn in aList) && pn!="KraDesk" && pn!="Visiteur"){
                            //--- récupération des auteurs
                            aList[pn]=pLink.textContent;
                        }else if(pn==="Visiteur" && lineTr[i].querySelector('input[type="checkbox"]')){
                            lineTr[i].querySelector('input[type="checkbox"]').className+=" gcbx";
                        }
                    }
                    let mLink=cellstd[6].querySelector('a');
                    if(mLink){
                        let mn=mLink.innerHTML;
                        if(!(mn in mList) && mn!=""){
                           mList[mn]=mLink.innerHTML;
                           lastm=mLink.innerHTML;
                        }
                    }
                    if(cellstd[2].innerHTML.startsWith('[Modéré] ')){
                        lineTr[i].querySelector('input[type="checkbox"]').className+=" "+lastm;
                        lineTr[i].querySelector('input[type="checkbox"]').dataset.modo=lastm;
                    }
                }else if(lineTr[i].className==='forum-c3'){
                    let goto=scrollupButton();
                    let debut=scrolldownButton();
                    let msg=lineTr[i].querySelectorAll('th')[2];
                    msg.appendChild(goto);
                    if(i>0){
                        msg.appendChild(debut);
                    }
                }
            }
            //--- préparation et envoie de la liste de noms
            var nList='<optgroup label="auteur"><option value="" disabled selected hidden>auteur</option>';
            var entries=Object.entries(aList);
            entries=entries.sort(([,a],[,b]) => a.localeCompare(b));
            for(let name of entries){
                nList+='<option value="'+name[0]+'">'+name[1]+'</option>';
            }
            nList+='</optgroup><optgroup label="modérateur">';
            entries=Object.entries(mList);
            entries=entries.sort(([,a],[,b]) => a.localeCompare(b));
            for(let name of entries){
                nList+='<option value="'+name[0]+'">'+name[1]+'</option>';
            }
            nList+='</optgroup>';
            return nList;
        }
        /// Fin de getPoster
        let finalButton=scrolldownButton();
        finalButton.style.float='right';
        centralForm.querySelector('.forum-footer a[href="javascript:OpenHelp(\'rf\')"]').parentNode.appendChild(finalButton);

        //--- nouvelle option pour restauration
        let newOption=document.createElement('option');
        newOption.innerHTML='Restaurer les messages';
        newOption.value='3';
        centralForm.querySelector('select[name="p3"]').appendChild(newOption);
        centralForm.querySelector('select[name="p3"]').addEventListener('change', (event) => {
            if(event.target.value==3){
                let nInput=document.createElement('input');
                nInput.type='button';
                nInput.className='ath';
                nInput.id='notSubmit';
                nInput.value='Ok!';
                nInput.addEventListener('click',restoreMsg);
                centralForm.querySelector('input[type="submit"]').parentNode.appendChild(nInput);
                centralForm.querySelector('input[type="submit"]').remove();
            }else{
                if(!centralForm.querySelector('input[type="submit"]')){
                    document.querySelector('#notSubmit').parentNode.innerHTML='<input type="submit" name="Submit" value="Ok!">';
                }
            }
        });

        function makeSelectionM(){
            //--- tout déselectionner
            var casesSujets=centralForm.querySelectorAll('input[type="checkbox"].rSelec:checked');
            //--- tout désélectionner
            for(let i=0;i<casesSujets.length;i++){
                casesSujets[i].checked=false;
            }
            gSelectUncheck();

            //--- affichage date
            var dspans=centralText.querySelector('.dSpan');
            var newDatetime=centralText.querySelector('.dSelec').value;
            dspans.innerHTML=newDatetime.replace('T',' ');
            dspans.dataset.d=newDatetime;

            //--- affichage auteur
            var aspans=centralText.querySelector('.nSpan');
            var aSelect=centralText.querySelector('.aSelect');
            if(!aspans.innerHTML.includes(aSelect.value) && aSelect.value!=="none"){
                var anSpan=document.createElement('span');
                anSpan.dataset.id=aSelect.value;
                anSpan.className='v'+aSelect.value;
                anSpan.innerHTML=aSelect.options[aSelect.selectedIndex].text+' ; ';
                anSpan.addEventListener('click',removA);
                aspans.appendChild(anSpan);
            }

            //--- selection via filtre
            let allcbx=centralText.querySelectorAll('input[type="checkbox"].rSelec');
            for(let i=allcbx.length-1;i>=0;i--){
                allcbx[i].checked=false;
                let trLine=allcbx[i].parentNode.parentNode;
                let pName=trLine.querySelectorAll('td')[4].querySelector('a').textContent;
                if(aspans.innerHTML.includes(pName)){
                    allcbx[i].checked=true;
                    gSelectCheck();
                }

                if(aspans.innerHTML.includes(allcbx[i].dataset.modo)){
                    allcbx[i].checked=true;
                    gSelectCheck();
                }

                let trDate=trLine.querySelectorAll('td')[3].innerHTML;
                let dateConvertie=convertirDate(trDate);
                if(newDatetime===''){
                    continue;
                }else if(dateConvertie>=newDatetime && aspans.innerHTML.includes(pName) ||
                         dateConvertie>=newDatetime && aspans.innerHTML.includes(pName) ||
                         dateConvertie>=newDatetime && aspans.innerHTML==''
                        ){
                    allcbx[i].checked=true;
                    gSelectCheck();
                }else if(dateConvertie<newDatetime){
                    break;
                }
            }
        }
        /// Fin de makeSelectionM.
        //--- retirer un auteur de la liste sélectionnée
        function removA(){
            this.remove();
            var aSelect=centralText.querySelector('.aSelect');
            aSelect.value='none';
            makeSelectionM();
        }
    }
    /// Fin de setupMtools

    //--- Raccourcis de modération sujet
    async function hideTopic(){
        let urlX=document.querySelector('#central-text img[alt="Modérer"]').closest('div a').href;
        let res= await fetchData(urlX,6);
    }
    async function lockTopic(){
        let urlX=document.querySelector('#central-text img[alt="Modérer"]').closest('div a').href;
        let res= await fetchData(urlX,12);
    }
    async function releaseTopic(){
        let urlX=document.querySelector('#central-text img[alt="Modérer"]').closest('div a').href;
        let res= await fetchData(urlX,0);
    }
    //--- retaurer messages d'un sujet
    async function restoreMsg(){
        let results = [];
        var rcbx=document.querySelectorAll('#central-text .rSelec:checked');
        for(let cbx of rcbx){
            let atopic=cbx.parentNode.parentNode.querySelectorAll('td')[2].querySelector('a');
            let atitle=atopic.innerHTML;
            let urlX=atopic.href;
            let urlY;
            try {
                let docX= await fetchGETAny(urlX);
                urlY=docX.querySelector('#central-text .forum-footer').querySelectorAll('a')[1].href;
            }catch(err){
                console.log('restoreMsg error docX : '+err)
            }
            try{
                let docY= await fetchGETAny(urlY);
            }catch(err){
                console.log('restoreMsg error docY : '+err)
            }
            cbx.parentNode.parentNode.remove();
        }
        displayMsg('Messages restaurés','Les messages sélectionnés ont été restaurés.');
    }

    //--- interface modération depuis profil
    function setupPtoolsLite(){
        if(sessionStorage.mmod=='true'){
            sessionStorage.mmod=false;
            document.querySelector('#modp').innerHTML='<img src="http://img.kraland.org/5/kmi.gif" alt=""> Activer Mod';
            //--- wipe tools
            let allMpTools=document.querySelectorAll('.ath');
            for(let tool of allMpTools){
                tool.remove();
            }
            var sectionsForum=centralText.querySelectorAll('table.forum');
            for(let i=0; i<2;i++){
                let colonne20=sectionsForum[i].querySelector('colgroup[width="42"]');
                colonne20.width=20;
            }

        }else{
            document.querySelector('#modp').innerHTML='Désactiver mod';
            sessionStorage.mmod=true;
            setupPtools();
        }
    }
    function setupPtools(){
        let shortcut2=createMButton(' Détruire');
        shortcut2.className='ath';
        shortcut2.addEventListener('click',boombayahLite);
        document.getElementById('modp').parentNode.appendChild(shortcut2);

        let fspan=document.createElement('span');
        fspan.className='ath';
        fspan.style.fontWeight='normal';
        fspan.addEventListener('click',removeD);
        function removeD(){
            let display=centralText.querySelector('.dSpan');
            display.innerHTML='';
            display.dataset.d='';
            let dSelect=centralText.querySelector('.dSelec');
            dSelect.value='';
            let ndSelect=centralText.querySelector('.ndSelec');
            ndSelect.value='';

            makeSelectionP();
        }

        let dLabel=document.createTextNode(' - depuis ');
        let dSelect=document.createElement('input');
        dSelect.type='datetime-local';
        dSelect.style.marginRight='5px';
        //dSelect.style.width='150px';
        dSelect.id='dSelec';
        dSelect.className='dSelec ath';
        dSelect.addEventListener('change',dchange);
        function dchange(){
            dchangepart(this.value);
            makeSelectionP();
        }

        let tLabel=document.createTextNode('- ');
        let ndSelect=document.createElement('input');
        ndSelect.type='number';
        ndSelect.className='ndSelec';
        ndSelect.style.width='32px';
        ndSelect.style.textAlign='center';
        ndSelect.addEventListener('change',ndchange);
        function ndchange(){
            ndchangepart(this.value);
            makeSelectionP();
        }
        let ndLabel=document.createTextNode(' jours');

        fspan.appendChild(dLabel);
        fspan.appendChild(dSelect);
        fspan.appendChild(tLabel);
        fspan.appendChild(ndSelect);
        fspan.appendChild(ndLabel);
        document.getElementById('modp').parentNode.appendChild(fspan);


        var token=true;
        var sectionsForum=centralText.querySelectorAll('table.forum');
        for(let i=0; i<2; i++){
            var colonne20=sectionsForum[i].querySelector('colgroup[width="20"]');
            colonne20.width=42;
            var lignesForum=sectionsForum[i].querySelectorAll('TR');
            for(let j=0; j<lignesForum.length; j++){
                let aCocher=document.createElement('input');
                aCocher.type='checkbox';
                if(j===0 && i===0){
                    aCocher.className='gSelec ath';
                    aCocher.id='gSelec';
                    aCocher.title='Tout selectionner';
                    aCocher.addEventListener('click',gSelectLite);
                    lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
                    if(i>0){token=false;}
                }else{
                    if(token){
                        aCocher.className='rSelec ath nTopic';
                        aCocher.addEventListener('click',selectedRow);
                    }else{
                        aCocher.className='ath dpTopic';
                        //aCocher.addEventListener('click',selectedRow);
                        if(j===0){aCocher.className='ath dpTopic';}
                    }
                    if(lignesForum[j].firstChild.getAttribute('rowspan')>0){
                        lignesForum[j].querySelectorAll('td')[1].insertBefore(aCocher,lignesForum[j].querySelectorAll('td')[1].childNodes[0]);
                    }else{
                        lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
                    }
                }
            }
        }
    }
    function makeSelectionP(){
        let newDatetime=centralText.querySelector('#dSelec').value;
        sessionStorage.pmDate=newDatetime;
        sessionStorage.oneId=getProfilId();
        let section0=centralText.querySelector('table.forum');
        let trLines=section0.querySelectorAll('TR');
        for(let i=1; i<trLines.length;i++){
            let trLine=trLines[i];
            let trDate=trLine.querySelectorAll('td')[2].innerHTML;
            let dateConvertie=convertirDate(trDate);
            if(dateConvertie>=newDatetime){
                trLine.querySelector('input[type="checkbox"]').checked=true;
                gSelectCheck();
            }else{
                trLine.querySelector('input[type="checkbox"]').checked=false;
                gSelectCheck();
            }
        }
    }

    function boombayahLite(){
        if(true){
            boombayah();
        }else{
            swipe();
        }
    }
    //--- pour détruire les messages depuis profil + date
    async function swipe(){
        let theId=getProfilId();
        if(sessionStorage.oneId!=theId){
            sessionStorage.removeItem('pmDate');
            sessionStorage.removeItem('oneId');
            console.log('boombayahLite : mauvais profil');
            return}
        let newDatetime=sessionStorage.pmDate;
        let section0=centralText.querySelector('table.forum');
        let trLines=section0.querySelectorAll('TR');
        for(let i=1; i<trLines.length;i++){
            let trLine=trLines[i];
            let trDate=trLine.querySelectorAll('td')[2].innerHTML;
            let dateConvertie=convertirDate(trDate);
            if(dateConvertie>=newDatetime){
                let urlX=trLine.querySelectorAll('td')[1].querySelector('p.nm a').href;
                console.log('test boombayahLite : '+urlX);
                trLine.remove();
                await gbu(urlX);
            }else{
                sessionStorage.removeItem('pmDate');
                sessionStorage.removeItem('oneId');
                console.log('Fin de boombayahLite');
                return;
            }
        }
        window.location.reload();
    }
    //--- pour détruire les messages depuis profil
    async function boombayah(){
        console.log('destroyer activated');
        var allChecked=document.querySelectorAll('input[type=checkbox]:checked.rSelec');
        let authorisation=false;
        if(allChecked.length==0){
            alert('Aucun sujet sélectionné');
            return;
        }else if(allChecked.length==1){
            authorisation=confirm('ATTENTION - Suppression, \confirmer ?');
        }else if(allChecked.length>1){
            authorisation=confirm('ATTENTION - Suppression multiple, confirmer ?');
        }
        if(!authorisation){return;};

        var resX=[];
        for(let i=0; i<allChecked.length; i++){
            let tLink=allChecked[i].parentNode.parentNode.querySelectorAll('td')[1].querySelector('p.nm a');
            let urlX=tLink.href;
            try{
                let docX= await gbu(urlX);
                resX.push(docX);
                allChecked[i].parentNode.parentNode.remove();
            }catch(err){
                console.error('Erreur dans bgu() :', err);
                resX.push(null);
            }
        }

        displayMsg('Messages détruits','Les messages ont été détruits.');
        return resX;
    }
    async function gbu(urlX){
        //--- Première requête pour obtenir l'URL Y
        let responseX = await fetch(urlX);
        if (!responseX.ok) {
            throw new Error('La requête a échoué. Status Code: ' + responseX.status);
        }
        const bufferX = await responseX.arrayBuffer();
        const decoderX = new TextDecoder('iso-8859-1');
        const textX = decoderX.decode(bufferX);
        const parserX = new DOMParser();
        const docX = parserX.parseFromString(textX, "text/html");

        // Crée un objet URL à partir de la chaîne URL
        urlX = new URL(urlX);
        // Récupère l'ancre (hash) de l'URL
        let coord=urlX.hash;
        console.log(coord);

        let target=docX.querySelector('#central-text a[href$="'+coord+'"]');
        let urlY=target.parentNode.querySelector('a[onclick^="return confirm(\'"]').href;
        // Deuxième requête avec l'URL Y
        try{
            let responseY = await fetch(urlY);
            if (!responseY.ok) {
                throw new Error('La requête a échoué. Status Code: ' + responseY.status);
            }
            const bufferY = await responseY.arrayBuffer();
            const decoderY = new TextDecoder('iso-8859-1');
            const textY = decoderY.decode(bufferY);
            const parserY = new DOMParser();
            const docY = parserY.parseFromString(textY, "text/html");
            return docY;
        }catch(error){
            console.error('Erreur dans fetchData:', error);
            throw error; // Rejeter l'erreur pour la propagation à l'appelant
        }
    }

    //--- interface pour les sujets détruits
    function setupRtools(){
        //--- cases à cocher
        var lignesForum=centralText.querySelector('table').querySelectorAll('TR');
        for(let j=1; j<lignesForum.length; j++){
            let aCocher=document.createElement('input');
            aCocher.type='checkbox';
            aCocher.className='rSelec ath dTopic';
            aCocher.addEventListener('click',selectedRow);
            lignesForum[j].firstChild.insertBefore(aCocher,lignesForum[j].firstChild.childNodes[0]);
        }

        //--- style
        var nmsg=centralText.querySelectorAll('.rimg');
        nmsg.forEach((elt) => function(){elt.style.margin='0'});

        //--- nouveau bouton
        var divH=createRdiv(true);
        centralText.insertBefore(divH,centralText.querySelector('table'));

        if(param.bp2){
            var divB=createRdiv(false);
            centralText.insertBefore(divB,centralText.querySelectorAll('.rimg')[1]);
        }
        //---

        function createRdiv(r){
            let mDiv=document.createElement('div');
            mDiv.className='athBox ath';

            let shortcut2=createMButton(' Restaurer');
            shortcut2.addEventListener('click',restore);

            let secondSpan=document.createElement('span');
            secondSpan.className="dSpan";
            secondSpan.addEventListener('click',function(){removeD();});
            function removeD(){
                removeDatetime();
                makeSelectionR();
            }
            let aCocher=document.createElement('input');
            aCocher.type='checkbox';
            aCocher.title='Tout selectionner';
            aCocher.className='gSelec';
            aCocher.id='gSelec';
            aCocher.addEventListener('click',gSelectLite);

            let oneLabel=document.createElement('label');
            oneLabel.appendChild(aCocher);
            let oneSpan=document.createElement('span');
            oneSpan.className="oneSpan";
            styleLink(oneSpan);
            oneSpan.style.marginRight='5px';;
            oneSpan.appendChild(document.createTextNode('Tout sélectionner'));
            oneLabel.appendChild(oneSpan);

            let dLabel=document.createTextNode('Depuis ');
            let dSelect=document.createElement('input');
            dSelect.className='dSelec';
            dSelect.type='datetime-local';
            dSelect.style.marginRight='5px';
            dSelect.addEventListener('change',dchange);
            function dchange(){
                dchangepart(this.value);
                makeSelectionR();
            }

            let tLabel=document.createTextNode('- ');
            let ndSelect=document.createElement('input');
            ndSelect.type='number';
            ndSelect.className='ndSelec';
            ndSelect.style.width='32px';
            ndSelect.style.textAlign='center';
            ndSelect.addEventListener('change',ndchange);
            function ndchange(){
                ndchangepart(this.value);
                makeSelectionR();
            }
            let ndLabel=document.createTextNode(' jours');

            if(r){
                mDiv.appendChild(shortcut2);
                mDiv.appendChild(secondSpan);
                mDiv.appendChild(document.createElement('br'));

                mDiv.appendChild(oneLabel);
                mDiv.appendChild(dLabel);
                mDiv.appendChild(dSelect);
                mDiv.appendChild(tLabel);
                mDiv.appendChild(ndSelect);
                mDiv.appendChild(ndLabel);
            }else{
                mDiv.appendChild(oneLabel);
                mDiv.appendChild(dLabel);
                mDiv.appendChild(dSelect);
                mDiv.appendChild(tLabel);
                mDiv.appendChild(ndSelect);
                mDiv.appendChild(ndLabel);

                mDiv.appendChild(document.createElement('br'));
                mDiv.appendChild(shortcut2);
                mDiv.appendChild(secondSpan);
            }
            return mDiv;
        }

        function makeSelectionR(){
            //--- tout déselectionner
            var casesSujets=document.querySelector('#gSelec').parentNode.parentNode.parentNode.querySelectorAll('input[type="checkbox"]:checked');
            //--- tout désélectionner
            for(let i=0;i<casesSujets.length;i++){
                casesSujets[i].checked=false;
            }

            //--- affichage date
            var dspans=centralText.querySelectorAll('.dSpan');
            var newDatetime=centralText.querySelector('.dSelec').value;
            dspans.forEach(d=>{
                d.innerHTML=newDatetime.replace('T',' ');
                d.dataset.d=newDatetime;
            });

            //--- sélection via filtre
            var sectionsForum=centralText.querySelector('table');
            var lignesForum=sectionsForum.querySelectorAll('TR');
            for(let i=1;i<lignesForum.length;i++){
                var cellstd=lignesForum[i].getElementsByTagName('td');
                let dateTime=cellstd[1].innerHTML;
                const dateConvertie = convertirDate(dateTime);
                if(newDatetime==''){
                    continue;
                }else if(dateConvertie>=newDatetime){
                    lignesForum[i].querySelector('input').checked=true;
                    gSelectCheck();
                }if(dateConvertie<newDatetime){
                    break;
                }
            }
        }
    }
    //--- pour restaurer les sujets
    async function restore(){
        var rBoxes=document.querySelectorAll('#central-text input[type="checkbox"].rSelec:checked');
        for(let rbx of rBoxes){
            if(rbx.checked){
                let urlX=rbx.closest('tr').querySelector('td:nth-child(3) a').href;
                console.log(urlX);
                try{
                    let res= await fetch(urlX);
                    rbx.parentNode.parentNode.remove();
                }catch(err){
                    console.error('Erreur dans restore() fetch :', err);
                }
            }
        }
        displayMsg('Sujets restaurés','Les sujets sélectionnés ont été restaurés.');
    }

    //--- fonction générique de gestion des sujets
    //p2 : titre
    //p3 : 0= renommer/cacher/déplacer 1= detruire, 2= scinder
    //p6 : cacher
    //p5 : permanentiser
    //p12 : bloquer
    async function fetchData(urlX,pParam){
        let mDiv=document.createElement('div');
        mDiv.id="mDiv";
        mDiv.style.display="none";
        document.body.appendChild(mDiv);

        var response= await fetchGETAny(urlX);
        var formHTML = response.querySelector('#central-text form[name="list_msg"]').outerHTML;
        if(formHTML){
            let mframe=document.createElement('iframe');
            mframe.id='result';
            mframe.name='result';
            mframe.style.display='none';

            mDiv.innerHTML = formHTML;
            var mForm = mDiv.querySelector('form[name="list_msg"]');
            mForm.id='sna';

            var orangemsg=[];
            switch(pParam){
                case 0 :
                    mForm.querySelector('select[name="p3"]').value=0;
                    mForm.querySelector('input[name="p6"]').checked=false;
                    mForm.querySelector('input[name="p12"]').checked=false;
                    orangemsg=['Accès restauré','Le sujet est désormais débloqué et visible.'];
                    mframe.addEventListener('load',done);
                    break;
                case 1 :
                    var cbxp1=mForm.querySelectorAll('input[name="p1[]"]');
                    for(let cbx of cbxp1){cbx.checked=true}
                    mForm.querySelector('select[name="p3"]').value=1;
                    break;
                case 5 :
                    mForm.querySelector('input[name="p5"]').checked=true;
                    mForm.querySelector('select[name="p3"]').value=0;
                    break;
                case 6 :
                    //mForm.querySelector('input[name="p6"]').value='on';
                    mForm.querySelector('input[name="p6"]').checked=true;
                    mForm.querySelector('select[name="p3"]').value=0;
                    orangemsg=['Sujet caché','Le sujet est désormais invisible.'];
                    mframe.addEventListener('load',done);
                    break;
                case 12 :
                    //mForm.querySelector('input[name="p12"]').value='on';
                    mForm.querySelector('input[name="p12"]').checked=true;
                    mForm.querySelector('select[name="p3"]').value=0;
                    orangemsg=['Sujet bloqué','Le sujet est désormais bloqué.'];
                    mframe.addEventListener('load',done);
                    break;
                default :
                    mForm.querySelector('select[name="p3"]').value=0;
                    console.log('fetchdata : référence inconnue');
            }
            document.body.appendChild(mframe);
            mForm.target='result';
            mForm.submit();
        }else{
            console.error('Le formulaire n\'a pas été trouvé.');
        }

        async function done(){
            let docRel= await fetchGETAny(window.location.href);
            centralText.innerHTML=docRel.querySelector('#central-text').innerHTML;
            displayMsg(orangemsg[0], orangemsg[1]);
            MUI();
        }
        return true;
    }

    //--- fonction générique d'envoie de kramail
    async function sendKM2(receiver,title,msg){
        var kmDiv=document.createElement('Div');
        kmDiv.id='kmDiv';
        kmDiv.style.display='none';
        document.body.appendChild(kmDiv);

        var kmGUI = await fetchGETAny('http://www.kraland.org/main.php?p=8_1&p0=1');
        var formHTML = kmGUI.querySelector('#central-text form[name="post_msg"]').outerHTML;

        if(formHTML){
            kmDiv.innerHTML = formHTML;
            var kmForm = kmDiv.querySelector('form[name="post_msg"]');
            if(kmForm){
                console.log(kmForm.outerHTML);
                kmForm.querySelector('textarea[name="p7"]').value = receiver;
                kmForm.querySelector('input[name="p2"]').value = title;
                kmForm.querySelector('#p4_3').checked = true;
                kmForm.querySelector('textarea[name="message"]').value = msg;

                let hfFrame=document.createElement('iframe');
                hfFrame.id='hfframe';
                hfFrame.name='hfframe';
                hfFrame.style.display='none';
                document.body.appendChild(hfFrame);
                kmForm.target='hfframe';
                kmForm.submit();
            }else{
                console.error('Le formulaire n\'a pas été trouvé.');
            }
        }else{
            console.error('Le contenu HTML du formulaire n\'a pas été trouvé.');
        }
        //document.body.removeChild(document.getElementById('hfframe'));
        //document.body.removeChild(document.getElementById('kmDiv'));
    }

    //--- récupérer une page
    async function fetchGETAny(urlX){
        try {
            //--- Première requête pour obtenir l'URL Y
            let responseX = await fetch(urlX);
                if (!responseX.ok) {
                    throw new Error('La requête a échoué. Status Code: ' + responseX.status);
                }
            const bufferX = await responseX.arrayBuffer();
            const decoderX = new TextDecoder('iso-8859-1');
            const textX = decoderX.decode(bufferX);
            const parserX = new DOMParser();
            const docX = parserX.parseFromString(textX, "text/html");
            return docX;
        }catch(error){
            console.log('échec fetchMform :'+error);
            throw error;
        }
    }

    //--- fonction générique de bandeau
    function displayMsg(titre,txt){
        var hdiv, hh3, hp;
        hdiv=document.createElement('div');
        hh3=document.createElement('h3');
        hp=document.createElement('p');

        hdiv.className='display';
        hh3.innerHTML=titre;
        hp.innerHTML=txt;
        hdiv.appendChild(hh3);
        hdiv.appendChild(hp);
        document.getElementById('central-text').insertBefore(hdiv,document.getElementById('central-text').firstChild.nextSibling);
        return true;
    }

    //--- requête serveur pour affichage forum
    async function forumdisplay(p1,p2,p3=false){
        try {
            centralForm=centralText.querySelector('form');
            let p = centralForm.querySelector("input[name='p']").value;
            p = encodeURIComponent(p);
            let t = centralForm.querySelector("input[name='t']").value;
            const response = await fetch('http://www.kraland.org/main.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include',
                body: new URLSearchParams({
                    'p': p,
                    'a': 1,
                    't': t,
                    'p1': p1,
                    'p2': p2,
                    'p3': p3,
                })
            });
            if (!response.ok) {
                throw new Error('La requête a échoué. Status Code: ' + response.status);
            }
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('iso-8859-1');
            const text = decoder.decode(buffer);
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            return doc;
        } catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
    }

    //--- requête serveur pour affichage kramail
    async function kmdisplay(p5,p2){
        try {
            centralForm=centralText.querySelector('form');
            let p = centralForm.querySelector("input[name='p']").value;
            p = encodeURIComponent(p);
            let t = centralForm.querySelector("input[name='t']").value;
            const response = await fetch('http://www.kraland.org/main.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include',
                body: new URLSearchParams({
                    'p': p,
                    'a': 1,
                    't': t,
                    'p5': p5,
                    'p2': p2,
                })
            });
            if (!response.ok) {
                throw new Error('La requête a échoué. Status Code: ' + response.status);
            }
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('iso-8859-1');
            const text = decoder.decode(buffer);
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            return doc;
        } catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
    }

    async function parseKI(response){
        const buffer= await response.arrayBuffer();
        const decoder= new TextDecoder('iso-8859-1');
        const text= decoder.decode(buffer);
        const parser= new DOMParser();
        var doc= parser.parseFromString(text, 'text/html');
        return doc;
    }

    //--- naviguer avec les flèches
    function arrowsHead(){
        let currentP=centralText.querySelector('.forum-selpage');
        let currentPa=currentP.parentNode.querySelectorAll('a');
        let currentpIndex = Array.from(currentPa).findIndex(el => el.classList.contains('forum-selpage'));
        let pnb=parseInt(currentpIndex);

        let n, nlink;
        document.addEventListener('keydown', (event) => {
            const activeElement = document.activeElement;
            const isTextInput = activeElement.tagName === 'INPUT' ||
                  activeElement.tagName === 'TEXTAREA' ||
                  activeElement.isContentEditable;
            if (isTextInput) {
                return;
            }

            switch (event.key) {
                case 'ArrowLeft':
                    n=pnb-1;
                    if(n<0){n=currentPa.length-1}
                    break;
                case 'ArrowRight':
                    n=pnb+1;
                    if(n===currentPa.length){n=0}
                    break;
                default:
                    return;
            }
            nlink=currentPa[n].href;
            window.open(nlink,'_self');
        });
    }

    function getProfilId(){
        let url=centralText.querySelector('li.on a').href;
        let uParams= new URLSearchParams(url);
        let p1= uParams.get('p1');
        return p1;
    }

    //--- fonction générique de création de bouton
    function createMButton(txt){
        var nButton=document.createElement('button');
        nButton.type='button';
        styleLink(nButton);
        var exclamimg=document.createElement('IMG');
        exclamimg.src='http://img.kraland.org/5/kmi.gif';
        exclamimg.alt="";
        var textM=document.createTextNode(txt);
        nButton.appendChild(exclamimg);
        nButton.appendChild(textM);
        return nButton;
    }

    //--- fonction générique d'application de style
    function styleLink(elt){
        elt.style.color='#711';
        elt.style.fontSize='11px';
        elt.style.cursor='pointer';
        elt.onmouseover = function(){ this.style.textDecoration="underline overline";};
        elt.onmouseout= function(){ this.style.textDecoration="";};
        return;
    }

    //--- visuels sujets bloqué ou caché
    function padlock(i){
        let padlock=document.createElement('img');
        padlock.src='http://img.kraland.org/5/fc2.gif';
        padlock.alt='\[bloqué\]';
        document.querySelectorAll('#central-text h4')[i].appendChild(padlock);
    }
    function wysih(i){
        let txthidden=document.createTextNode('[caché]');
        document.querySelectorAll('#central-text h4')[i].appendChild(txthidden);
    }

    //--- boutons de navigation
    function scrollupButton(){
        let goto=document.createElement('button');
        goto.type='button';
        goto.className="goto ath";
        goto.innerHTML="↓↓↓ Aller à la fin ↓↓↓";
        goto.style.marginLeft='5px';
        goto.style.textAlign='justify';
        goto.style.marginRight='5px';
        goto.style.fontWeight='bold';
        styleLink(goto);
        goto.addEventListener('click',goToEnd);
        return goto;
    }

    function scrolldownButton(){
        let debut=document.createElement('button');
        debut.type='button';
        debut.className="goto ath";
        debut.innerHTML="↑↑↑ Retour au début ↑↑↑";
        debut.style.marginLeft='5px';
        debut.style.textAlign='justify';
        debut.style.marginRight='5px';
        debut.style.fontWeight='bold';
        styleLink(debut);
        debut.addEventListener('click',goToDebut);
        return debut;
    }

    function goToEnd(){
        let pos=centralText.scrollHeight;
        window.scrollTo(0, pos);
    }
    function goToDebut(){
        let pos=centralText.scrollHeight;
        window.scrollTo(0, 0);
    }

    //--- fonctions datation & durée
    function convertirDate(dateString){
        dateString = dateString.replace('(', '').replace(')', '');
        var [datePart, timePart] = dateString.split(' ');

        let jour, mois, annee;
        if(datePart.trim() === "Aujourd'hui"){
            ({jour, mois, annee} = adjustDate(0));
        }else if(datePart.trim() === "Hier"){
            ({jour, mois, annee} = adjustDate(-1));
        }else if(datePart.trim() === "Avant-Hier"){
            ({jour, mois, annee} = adjustDate(-2));
        }else{
            [jour, mois] = datePart.split('/').map(Number);
            annee = new Date().getFullYear();
            if (datePart.split('/').length === 3) {
                annee = '20'+datePart.split('/')[2];
            }
        }

        var [heure, minute] = timePart.split(':').map(Number);
        const pad = (num) => num.toString().padStart(2, '0');
        const isoString = `${annee}-${pad(mois)}-${pad(jour)}T${pad(heure)}:${pad(minute)}:00`;
        return isoString;
    }
    function adjustDate(daysOffset){
        let newParisDay = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
        newParisDay.setDate(newParisDay.getDate() + daysOffset);
        let jour = newParisDay.getDate();
        let mois = newParisDay.getMonth() + 1;
        let annee = newParisDay.getFullYear();
        return {jour, mois, annee};
    }
    function getAdjustedDate(daysOffset){
        let countDays=-Math.abs(daysOffset);
        let newParisDay = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
        newParisDay.setDate(newParisDay.getDate() + countDays);
        let jour = newParisDay.getDate();
        let mois = newParisDay.getMonth() + 1;
        let annee = newParisDay.getFullYear();
        let heure = newParisDay.getHours();
        let minute = newParisDay.getMinutes();
        const pad = (num) => num.toString().padStart(2, '0');
        const isoString = `${annee}-${pad(mois)}-${pad(jour)}T${pad(heure)}:${pad(minute)}`;
        return isoString;
    }

    //--- Fonction pour comparer la différence entre deux dates et une autre durée
    function getDaysDuration(date1, date2){
        const temps1 = new Date(date1).setHours(0, 0, 0, 0);
        const temps2 = new Date(date2).setHours(0, 0, 0, 0);
        const diffMillis = Math.abs(temps2 - temps1);
        const diffJours = Math.floor(diffMillis/(1000*60*60*24));
        return diffJours;
    }
    function durationFrom(date){
        let ParisToday = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
        return getDaysDuration(date, ParisToday);
    }

    function safetyDate2(diffJours){
        if(param.sfty<0){return false;}
        if(Math.abs(diffJours)>param.sfty){
            return true;
        }else if(Math.abs(diffJours)<=param.sfty){
            return false;
        }
        return true;
    }

    function dchangepart(dc){
        let numOfDays=durationFrom(dc);
        if(safetyDate2(numOfDays)){
            //alert('Date limite dépassée');
            ndchangepart(param.sfty);
            return;
        };
        let ndSelect=centralText.querySelectorAll('.ndSelec');
        ndSelect.forEach(nd=>{
            nd.value=numOfDays;
        });

        let dSelect=centralText.querySelectorAll('.dSelec');
        dSelect.forEach(d=>{
            d.value=dc;
        });
    }

    function ndchangepart(nb){
        if(safetyDate2(nb)){
            //alert('Date limite dépassée');
            nb=param.sfty;
        };
        let dSelect=centralText.querySelectorAll('.dSelec');
        dSelect.forEach(d=>{
            d.value=getAdjustedDate(nb);
        });
        let ndSelect=centralText.querySelectorAll('.ndSelec');
        ndSelect.forEach(nd=>{
            nd.value=nb;
        });
    }

    /// fin de code
})();


/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.

* =========================================================================
* LICENCE ET COPYRIGHT (COMPLET)
* =========================================================================
* Copyright (C) 2026 Somin (formerly Gyeongeun)

                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<https://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<https://www.gnu.org/licenses/why-not-lgpl.html>.

*/