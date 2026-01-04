// ==UserScript==
// @name         KI-Athena
// @description  Assister la modération du forum
// @match        http://www.kraland.org/main.php*
// @version      1.3
// @author       gyeongeun
// @namespace    Secret Weapon
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kraland.org
// @grant        none
// @license      CC-BY-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/503890/KI-Athena.user.js
// @updateURL https://update.greasyfork.org/scripts/503890/KI-Athena.meta.js
// ==/UserScript==

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