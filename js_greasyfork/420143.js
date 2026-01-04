// ==UserScript==
// @name KI-Andromeda
// @description Améliore l'expérience de Kraland
// @match http://www.kraland.org/*
// @version 1.5.6
// @author Gyeongeun
// @namespace http://www.kraland.org/main.php?p=5_2_0_306385_1
// @grant none
// @license CC-BY-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/420143/KI-Andromeda.user.js
// @updateURL https://update.greasyfork.org/scripts/420143/KI-Andromeda.meta.js
// ==/UserScript==

//+------------ Options par défaut --------------+

var tailleDesAvatarsForum = 110;
var tailleDesAvatarsJeu = 40;
var tailleDesAvatarsPopup= 110;
//Taille en pixel (défaut: 110 forum ; 50 jeu)

var tailleMaxImgRapportPrivé = 99;
var tailleMaxImgForum = 100;
var tailleMaxImgEvenement = 100;
// Taille en % du cadre (défaut: 100)

var PoliceDeCaracteres = "" ;
// mettez la police de votre choix entre les guillemets. (Par défaut : "")

var pageAccueil = [2,1,0];
// 2=Cybermonde, 1=Forum, 0=Bienvenue
// Mettez les cadres dans l'ordre de vos préférences

var Goupil=false;
// true pour désactiver les smileys Poule, false sinon

var maxCache=5;
// nombre de posts en cours de rédaction sauvegardé

//--- Paramètres de gestion du rapport d'évènements
var actionsParPage=250;
var filtreEmpire="Tous les empires + provinces et villes";
var filtreAction=1;
var imagesIncluses=true;
var réseauxSociaux=false;

//+------------ Paramétrages du Script --------------+

//--- Variables Globales
var kdocument=document;
var theUrl=window.location.href;

var aparam={
    avaFora: tailleDesAvatarsForum,
    avaIg: tailleDesAvatarsJeu,
    avaOrder: tailleDesAvatarsPopup,
    imgRP: tailleMaxImgRapportPrivé,
    imgFora: tailleMaxImgForum,
    imgRE: tailleMaxImgEvenement,
    fontFam: PoliceDeCaracteres,
    colorL: -1,
    tCache: maxCache,
    goupil: Goupil,
    motd: pageAccueil,
    erlite: true,
    avaItem: 32,
    evNb: actionsParPage,
    evEmpire: filtreEmpire,
    evAction: filtreAction,
    evImg: imagesIncluses,
    evRs: réseauxSociaux,
}

var savedTxtData=[];

//--- Initialisation
Euryphaessa();
function Euryphaessa(){
    //--- redirection vers le site sans frame
    if(window.location.href=="http://www.kraland.org/" || window.location.href.startsWith("http://kraland.org/")){
        location.replace("http://www.kraland.org/main.php");
    }

    //--- accès aux paramètres sauvegardés
    if(localStorage.aparam){
		aparam=JSON.parse(localStorage.aparam);
    }

    if(localStorage.std){
        savedTxtData=JSON.parse(localStorage.std);
    }

    //--- accès aux options
    var nowUrl=window.location.href.toString();
    var opId= new RegExp("p=8_4");
    if(opId.test(nowUrl)){
        AndroButton();
    }

    gImgRsz();
    AvatarRsz();
    ezSpoiler();
    colorless();
    if(aparam.goupil){goupil();}
    eventLoader();
    Hestia();
    ERLite();
    setArea();
}

//+------------ Réarrangement Page d'accueil --------------+
function Hestia(){
    var triptyque=kdocument.querySelectorAll('#central-text .bx-left');
    if(triptyque.length>0){
        var centralText=kdocument.getElementById('central-text');
        centralText.innerHTML="";
        var order=aparam.motd;
        var newOrder=[3];
        for(let i=0;i<order.length;i++){
            if(order[i]!=-1){
                var j=order[i];
                newOrder[i]=kdocument.createElement('div');
                newOrder[i].classList.add("bx-left");
                newOrder[i].innerHTML=triptyque[j].innerHTML;
            }else{
                newOrder[i]=null;
            }
            if(newOrder[i]!=null){centralText.appendChild(newOrder[i]);}
        }
    }
}

//+------------ Taille maximum des images --------------+
function gImgRsz(){
    var impc=aparam.imgFora;
    var css=".rimg > img{max-width: 100% !important;} .limg > img{max-width: 100% !important;}";
    if(theUrl.search("4_4")==34){
        impc=aparam.imgRE;
        css+="td.ev_normal img{max-width: "+impc+"%;}";
        css+="td.ev_normal {word-break: break-word;}";
    }else{
        css+= "td.forum-message img{max-width: "+impc+"%;} ";
        css+= "td.forum-message {word-break: break-word;}";
    }
    css+=".rimg{max-width: "+impc+"%;}.limg{max-width: "+impc+"%;} ";
    css+="#report img{max-width: "+aparam.imgRP+"%;} ";
    css+="#report .forum tr{word-break: break-word;}";
    css+=".op img{max-width: "+aparam.imgRP+"%;} ";
    css+="div {font-family: "+aparam.fontFam+";}";


    var style = kdocument.createElement("style");
    style.id="andromedaStyle";
    style.type = "text/css";
    style.appendChild(kdocument.createTextNode(css));
    kdocument.head.appendChild(style);
}

//+------------ Redimensionnement des avatars --------------+
function AvatarRsz(){
    var theUrl=window.location.href;

    if(aparam.avaFora!=null){
        var avatarsForum = kdocument.querySelectorAll(".forum-cartouche img[alt=avatar]");
        for(let i=0; i<avatarsForum.length; i++) {
            avatarsForum[i].width = aparam.avaFora;
            avatarsForum[i].height = aparam.avaFora;
        }
    }


    if(aparam.avaItem!=null && aparam.avaItem>32){
    var avatarsItem = kdocument.querySelectorAll(".tdbc img");
    for(let j=0; j<avatarsItem.length; j++) {
        if(!avatarsItem[j].src.includes("http://img.kraland.org/2/cyb")) {
            avatarsItem[j].width = aparam.avaItem;
            avatarsItem[j].height = aparam.avaItem;
        }
    }}else

        if(aparam.avaIg!=null && kdocument.querySelector(".on a")!=null && kdocument.querySelector(".on a").innerHTML=="Se Déplacer"){
    var avatarsJeu = kdocument.querySelectorAll(".left-frame .tdbc img");
    for(let j=0; j<avatarsJeu.length; j++) {
        if(!avatarsJeu[j].src.includes("http://img.kraland.org/2/cyb")) {
            avatarsJeu[j].width = aparam.avaIg;
            avatarsJeu[j].height = aparam.avaIg;
        }
    }}

    if(aparam.avaOrder!=null && theUrl.search("3000")==36){
        var avatarOrderPopup=kdocument.querySelector("div.oc div.opc div.op div.rimg img");
        avatarOrderPopup.width = aparam.avaOrder;
        avatarOrderPopup.height = aparam.avaOrder;
    }

}


//+------------ Assassin de la Poulice --------------+
function goupil(){
    var icones = ["6A","6B","6C","6D","6E","6F","70","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E"];
    var icones2 = ["0F","12","08","19","3B","3C","3A","3D","29","31","10","37","5D","18","23","36","5F","5B","64","2D","27"];
    var url = ["http://img.kraland.org/s/","http://img.kraland.org/s2/"];

    kdocument.querySelectorAll('img[src*="http://img.kraland.org/s/"]').forEach(noPoulet);
    kdocument.querySelectorAll('img[src*="http://img.kraland.org/s2/"]').forEach(noPoulet);

    function noPoulet(item){
        for(var i=0;i<icones.length;i++){
      if(item.src.endsWith(icones[i]+".gif")){
          item.src=item.src.replace(icones[i], icones2[i]);
          item.setAttribute('alt', ' ');
      }}
    }

    var toolframe=kdocument.getElementsByName('tools_frame')[0];
    if(toolframe!=null){
        var tfDoc=toolframe.contentDocument;
        if(tfDoc.querySelector('a[href="post.php?p0=2&p1=6&p2="]')!=null){
            tfDoc.querySelector('a[href="post.php?p0=2&p1=6&p2="]').remove();
        }else if(tfDoc.querySelector('a[href="post.php?p0=2&p1=6&p2=1"]')!=null){
            tfDoc.querySelector('a[href="post.php?p0=2&p1=6&p2=1"]').remove();
        }
    }
}


//+------------ Décoloration des grands messages --------------+
function colorless(){
    if(aparam.colorL>=0){
    var fontc=kdocument.getElementsByTagName('FONT');
    for(let i=0;i<fontc.length;i++){
        if(fontc[i].innerHTML.length>aparam.colorL){
            fontc[i].removeAttribute("color");
        }
    }
}}


//+------------ Ergonomie des Spoiler --------------+
function ezSpoiler(){
    var allspoiler=kdocument.querySelectorAll(".pre-spoiler");
    for(let i=0;i<allspoiler.length;i++){
        allspoiler[i].addEventListener("click",displayB,false);
    }
}

function displayB(){
    this.parentNode.querySelector(".spoiler").style.display="";
    this.removeEventListener("click", displayB);
    this.addEventListener("click",displayN,false);
}

function displayN(){
    this.parentNode.querySelector(".spoiler").style.display="none";
    this.removeEventListener("click",displayN);
    this.addEventListener("click",displayB,false);
}

//+------------ Ergonomie du Rapport d'Evènement --------------+
function ERLite(){
    if(kdocument.querySelector('.ev_normal')!=null){
        var centralText=kdocument.getElementById('central-text');
        var ERHelp=centralText.querySelector('.forum-c2');
        ERHelp.parentNode.removeChild(ERHelp);
        if(aparam.erlite==true){
        var selectEv=centralText.getElementsByClassName('forum-top')[1];
        selectEv.style.display="none";
        centralText.getElementsByClassName('forum-top')[0].style.cursor="pointer";
        centralText.getElementsByClassName('forum-top')[0].addEventListener("click",function(){
            if(selectEv.style.display=="none"){selectEv.style.display="block";}else{selectEv.style.display="none";}
        },false);
    }}
}

function eventLoader(){
    if(aparam.evSelector<1){return;}
    var link4=kdocument.querySelector('#menu4 a[href="main.php?p=4_4"]');
    if(link4){link4.addEventListener('click',loadSelectedEvents);}
    function loadSelectedEvents(event){
        event.preventDefault();

        if(!sessionStorage.getItem('evToken')){
            sessionStorage.setItem('evToken','true');}
        else{
            window.location.href="http://www.kraland.org/main.php?p=4_4";
            return;
        }

        let evFrame=kdocument.createElement('iframe');
        evFrame.id='evFrame';
        evFrame.name='evFrame';
        evFrame.style.display='none';
        evFrame.src="http://www.kraland.org/main.php?p=4_4";
        kdocument.body.appendChild(evFrame);

        kdocument.querySelector('#evFrame').addEventListener("load", function(){
            var evForm=kdocument.querySelector('#evFrame').contentDocument.querySelector('#central-text').querySelector('form');
            evForm.target="_top";
            evForm.querySelector('textarea[name="p7"]').value=aparam.evEmpire;
            evForm.querySelector('select[name="p3"]').value=aparam.evAction;
            evForm.querySelector('select[name="p1"]').value=aparam.evNb;
            evForm.querySelector('input[name="p2"]').checked=aparam.evImg;
            evForm.querySelector('input[name="p4"]').checked=aparam.evRs;
            evForm.submit();
        });
    }
}

//+------------ Textearea cache --------------+
function setArea(){
    var amsga=kdocument.getElementsByName('message');
    var hautforum=kdocument.getElementsByClassName('forum-top')[0];
    if(hautforum!=null){
        sortTextData();
        let msgts=kdocument.getElementsByClassName('forum-message')[0].getElementsByTagName('textarea')[0];
        msgts.addEventListener("keyup",savetxt,false);
        var selecTxt=kdocument.createElement("SELECT");
        selecTxt.id="slc";
        for(let i=0;i<savedTxtData.length;i++){
            let opSelecTxt=kdocument.createElement("OPTION");
            opSelecTxt.value=i;
            opSelecTxt.innerHTML=i;
            selecTxt.appendChild(opSelecTxt);
        }
        hautforum.appendChild(selecTxt);
        selecTxt.style.cssFloat="right";
        selecTxt.addEventListener("change",retrieveTxt,false);
    }else if(amsga[0]!=null && window.location.href.search("order")==23){
        sortTextData();
        let inputp12=kdocument.getElementsByName('p12');
        for(let i=0; i<amsga.length;i++){
            amsga[i].addEventListener("keyup",savetxt,false);
            inputp12[i].parentNode.appendChild(kdocument.createTextNode(" "));
            let selectxt=kdocument.createElement("SELECT");
            selectxt.id="slc"+i;
            for(let i=0;i<savedTxtData.length;i++){
                let opSelecTxt=kdocument.createElement("OPTION");
                opSelecTxt.value=i;
                opSelecTxt.innerHTML=i;
                selectxt.appendChild(opSelecTxt);
            }
            inputp12[i].parentNode.appendChild(selectxt);
            selectxt.addEventListener("change",function(){retrieveTxtO(i);},false);
        }
    }
}

function sortTextData(){
    savedTxtData.unshift('');
    if(savedTxtData.length>aparam.tCache){
        savedTxtData.pop();
    }
}

function savetxt(){
    savedTxtData[0]=this.value;
    localStorage.std=JSON.stringify(savedTxtData);
}

function retrieveTxt(){
    var msgts=kdocument.getElementsByClassName('forum-message')[0].getElementsByTagName('textarea')[0];
    var nbv=parseInt(this.value);
    let oneTxt=savedTxtData[nbv];
    msgts.value=oneTxt;
}

function retrieveTxtO(i){
    let id="slc"+i;
    var nbv=parseInt(kdocument.getElementById(id).value);
    let oneTxt=savedTxtData[nbv];
    kdocument.getElementsByName('message')[i].value=oneTxt;

}

//+------------ flèches pour navigation --------------+
try{
    arrowsHead();
}catch(err){
    console.log(err);
}

//--- naviguer avec les flèches
function arrowsHead(){
    let currentP=document.getElementById('central-text').querySelector('.forum-selpage');
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

//+------------ GUI pour paramétrer Andromeda --------------+

//--- Affichage de la GUI
function AndroMenu(){
    kdocument.querySelector('.on').classList.remove('on');
    kdocument.getElementById('aMenu').classList.add('on');
    var cContent=kdocument.getElementById('central-text');
    cContent.innerHTML=AndromedaBoard();
    opMenuSetValue();

    var lsb=kdocument.querySelectorAll('.localSave');
    for(let i=0;i<lsb.length;i++){
        lsb[i].addEventListener('click',opSetAndromeda,false);
    }

    var addbtns=kdocument.querySelectorAll('.addbtn');
    for(let i=0;i<addbtns.length;i++){
        addbtns[i].addEventListener('click',addLocation,false);
    }
}

function addLocation(){
    var lvalue=kdocument.getElementById(this.name).value;
    var textarea = document.getElementById('inputp7');

    if(lvalue){
        if(textarea.value!==""){
            textarea.value+=" ; "+lvalue;
        }else{
            textarea.value=lvalue;
        }
    }
}

function AndromedaBoard(){
    var aForm=`<form id="gForm">
               <h2>Site</h2>
               <div id="divers" class="rbx">
                    <p><label for="cadre1">Page d'accueil :</label>
                    <select id="cadre1" class="fdm">
                        <option value="2">Cybermonde</option>
        	            <option value="1">Forum</option>
        	            <option value="0">Bienvenue</option>
                        <option value="-1">Rien</option>
                     </select>
                     <select id="cadre2" class="fdm">
     	                <option value="1">Forum</option>
                        <option value="2">Cybermonde</option>
        	            <option value="0">Bienvenue</option>
                        <option value="-1">Rien</option>
                     </select>
                     <select id="cadre3" class="fdm">
                        <option value="-1">Rien</option>
                        <option value="0">Bienvenue</option>
                        <option value="2">Cybermonde</option>
        	            <option value="1">Forum</option>
                     </select>
                     </p>
                     <p><input class="localSave" type="button" value="Sauvegarder"></p>
                     </div>
               <p>Changez l'ordre des cadres de la page d'accueil selon vos préférences. Mettez "rien" pour supprimer.</p><br>
               <div class="hr"><hr></div>
                     <h2>Rapport d'évènements</h2>
               <div class="rbx"><table class="t"><tbody>
                    <tr>
                    <td style="text-align:justify;"><label><input id="input10" type="checkbox" class="styled" checked>Cliquer pour afficher le formulaire des Événements.</label></td>
                    </tr>
                    <tr>
                    <td style="text-align:justify;"><label><input id="input11" type="checkbox" class="styled" disabled="disabled" checked>Supprimer l'aide des Événements.</label></td>
                    </tr>
               </tbody></table>
<table class="forum"><tbody><tr class="forum-top"><b>Sélection</b></tr>
<tr class="forum-top" style="display: block;"><td>
<textarea id="inputp7" name="p7" cols="21" rows="8" style="width:190px;height:100px;">${aparam.evEmpire}</textarea></td>
<td style="width: 100%; text-align: center;"><ul style="list-style: none; padding-left: 0;">
<li><input type="button" value="+" name="l1" class="addbtn" id="al1">
<select id="l1"><option value="">Ajouter un empire</option>
<option value="République de Kraland" class="c1">République de Kraland</option>
<option value="République de Kraland + provinces" class="c1">République de Kraland + provinces</option>
<option value="République de Kraland + provinces et villes" class="c1">République de Kraland + provinces et villes</option>
<option value="Empire Brun" class="c2">Empire Brun</option>
<option value="Empire Brun + provinces" class="c2">Empire Brun + provinces</option>
<option value="Empire Brun + provinces et villes" class="c2">Empire Brun + provinces et villes</option>
<option value="Palladium Corporation" class="c3">Palladium Corporation</option>
<option value="Palladium Corporation + provinces" class="c3">Palladium Corporation + provinces</option>
<option value="Palladium Corporation + provinces et villes" class="c3">Palladium Corporation + provinces et villes</option>
<option value="Théocratie Seelienne" class="c4">Théocratie Seelienne</option>
<option value="Théocratie Seelienne + provinces" class="c4">Théocratie Seelienne + provinces</option>
<option value="Théocratie Seelienne + provinces et villes" class="c4">Théocratie Seelienne + provinces et villes</option>
<option value="Paradigme Vert" class="c5">Paradigme Vert</option>
<option value="Paradigme Vert + provinces" class="c5">Paradigme Vert + provinces</option>
<option value="Paradigme Vert + provinces et villes" class="c5">Paradigme Vert + provinces et villes</option>
<option value="Khanat Elmérien" class="c6">Khanat Elmérien</option>
<option value="Khanat Elmérien + provinces" class="c6">Khanat Elmérien + provinces</option>
<option value="Khanat Elmérien + provinces et villes" class="c6">Khanat Elmérien + provinces et villes</option>
<option value="Confédération Libre" class="c7">Confédération Libre</option>
<option value="Confédération Libre + provinces" class="c7">Confédération Libre + provinces</option>
<option value="Confédération Libre + provinces et villes" class="c7">Confédération Libre + provinces et villes</option>
<option value="Royaume de Ruthvénie" class="c8">Royaume de Ruthvénie</option>
<option value="Royaume de Ruthvénie + provinces" class="c8">Royaume de Ruthvénie + provinces</option>
<option value="Royaume de Ruthvénie + provinces et villes" class="c8">Royaume de Ruthvénie + provinces et villes</option>
<option value="Provinces Indépendantes" class="c9">Provinces Indépendantes</option>
<option value="Provinces Indépendantes + provinces" class="c9">Provinces Indépendantes + provinces</option>
<option value="Provinces Indépendantes + provinces et villes" class="c9">Provinces Indépendantes + provinces et villes</option>
<option value="Tous les empires">Tous les empires</option>
<option value="Tous les empires + provinces">Tous les empires + provinces</option>
<option value="Tous les empires + provinces et villes">Tous les empires + provinces et villes</option>
</select></li>
<li><input type="button" value="+" name="l2" class="addbtn" id="al2"> <select id="l2"><option value="">Ajouter une province</option>
<option value="Accalmie" class="c5">Accalmie</option>
<option value="Accalmie + villes" class="c5">Accalmie + villes</option>
<option value="Acropole" class="c6">Acropole</option>
<option value="Acropole + villes" class="c6">Acropole + villes</option>
<option value="Andalousie" class="c9">Andalousie</option>
<option value="Andalousie + villes" class="c9">Andalousie + villes</option>
<option value="Atasie" class="c6">Atasie</option>
<option value="Atasie + villes" class="c6">Atasie + villes</option>
<option value="Australine" class="c9">Australine</option>
<option value="Australine + villes" class="c9">Australine + villes</option>
<option value="Bananie" class="c6">Bananie</option>
<option value="Bananie + villes" class="c6">Bananie + villes</option>
<option value="Boskovo" class="c2">Boskovo</option>
<option value="Boskovo + villes" class="c2">Boskovo + villes</option>
<option value="Bouletie" class="c6">Bouletie</option>
<option value="Bouletie + villes" class="c6">Bouletie + villes</option>
<option value="Calissie" class="c8">Calissie</option>
<option value="Calissie + villes" class="c8">Calissie + villes</option>
<option value="Capsulie" class="c6">Capsulie</option>
<option value="Capsulie + villes" class="c6">Capsulie + villes</option>
<option value="Caraïbes" class="c2">Caraïbes</option>
<option value="Caraïbes + villes" class="c2">Caraïbes + villes</option>
<option value="Cinq Pics" class="c9">Cinq Pics</option>
<option value="Cinq Pics + villes" class="c9">Cinq Pics + villes</option>
<option value="Crab Key" class="c8">Crab Key</option>
<option value="Crab Key + villes" class="c8">Crab Key + villes</option>
<option value="Désert Démoniaque" class="c5">Désert Démoniaque</option>
<option value="Désert Démoniaque + villes" class="c5">Désert Démoniaque + villes</option>
<option value="Dogma" class="c4">Dogma</option>
<option value="Dogma + villes" class="c4">Dogma + villes</option>
<option value="Écrin de Jade" class="c5">Écrin de Jade</option>
<option value="Écrin de Jade + villes" class="c5">Écrin de Jade + villes</option>
<option value="Elmérie" class="c6">Elmérie</option>
<option value="Elmérie + villes" class="c6">Elmérie + villes</option>
<option value="Elmérie Inférieure" class="c6">Elmérie Inférieure</option>
<option value="Elmérie Inférieure + villes" class="c6">Elmérie Inférieure + villes</option>
<option value="Géofront" class="c8">Géofront</option>
<option value="Géofront + villes" class="c8">Géofront + villes</option>
<option value="Gradistan" class="c5">Gradistan</option>
<option value="Gradistan + villes" class="c5">Gradistan + villes</option>
<option value="Grand Jardin" class="c5">Grand Jardin</option>
<option value="Grand Jardin + villes" class="c5">Grand Jardin + villes</option>
<option value="Hélénie" class="c9">Hélénie</option>
<option value="Hélénie + villes" class="c9">Hélénie + villes</option>
<option value="Iglooland" class="c6">Iglooland</option>
<option value="Iglooland + villes" class="c6">Iglooland + villes</option>
<option value="Île aux Kanards" class="c5">Île aux Kanards</option>
<option value="Île aux Kanards + villes" class="c5">Île aux Kanards + villes</option>
<option value="Irendol" class="c5">Irendol</option>
<option value="Irendol + villes" class="c5">Irendol + villes</option>
<option value="Justiciat" class="c6">Justiciat</option>
<option value="Justiciat + villes" class="c6">Justiciat + villes</option>
<option value="Karénie" class="c2">Karénie</option>
<option value="Karénie + villes" class="c2">Karénie + villes</option>
<option value="Kraland" class="c6">Kraland</option>
<option value="Kraland + villes" class="c6">Kraland + villes</option>
<option value="Krapathes" class="c5">Krapathes</option>
<option value="Krapathes + villes" class="c5">Krapathes + villes</option>
<option value="Lantenac" class="c8">Lantenac</option>
<option value="Lantenac + villes" class="c8">Lantenac + villes</option>
<option value="Lexpagie" class="c9">Lexpagie</option>
<option value="Lexpagie + villes" class="c9">Lexpagie + villes</option>
<option value="Mer Blanche" class="c8">Mer Blanche</option>
<option value="Mer Blanche + villes" class="c8">Mer Blanche + villes</option>
<option value="Mer Brune" class="c2">Mer Brune</option>
<option value="Mer Brune + villes" class="c2">Mer Brune + villes</option>
<option value="Mer des Noyés" class="c9">Mer des Noyés</option>
<option value="Mer des Noyés + villes" class="c9">Mer des Noyés + villes</option>
<option value="Mer Impériale" class="c2">Mer Impériale</option>
<option value="Mer Impériale + villes" class="c2">Mer Impériale + villes</option>
<option value="Mer Noire" class="c9">Mer Noire</option>
<option value="Mer Noire + villes" class="c9">Mer Noire + villes</option>
<option value="Mer Rose" class="c9">Mer Rose</option>
<option value="Mer Rose + villes" class="c9">Mer Rose + villes</option>
<option value="Mer Verte" class="c2">Mer Verte</option>
<option value="Mer Verte + villes" class="c2">Mer Verte + villes</option>
<option value="Moldavie" class="c5">Moldavie</option>
<option value="Moldavie + villes" class="c5">Moldavie + villes</option>
<option value="Musulmanie" class="c2">Musulmanie</option>
<option value="Musulmanie + villes" class="c2">Musulmanie + villes</option>
<option value="Mystisie" class="c2">Mystisie</option>
<option value="Mystisie + villes" class="c2">Mystisie + villes</option>
<option value="Nablacie" class="c6">Nablacie</option>
<option value="Nablacie + villes" class="c6">Nablacie + villes</option>
<option value="Négaverse" class="c8">Négaverse</option>
<option value="Négaverse + villes" class="c8">Négaverse + villes</option>
<option value="Niarkalistan" class="c2">Niarkalistan</option>
<option value="Niarkalistan + villes" class="c2">Niarkalistan + villes</option>
<option value="Palladium-City" class="c2">Palladium-City</option>
<option value="Palladium-City + villes" class="c2">Palladium-City + villes</option>
<option value="Panaguam" class="c2">Panaguam</option>
<option value="Panaguam + villes" class="c2">Panaguam + villes</option>
<option value="Parc à Bishônens" class="c8">Parc à Bishônens</option>
<option value="Parc à Bishônens + villes" class="c8">Parc à Bishônens + villes</option>
<option value="Pédestrie" class="c5">Pédestrie</option>
<option value="Pédestrie + villes" class="c5">Pédestrie + villes</option>
<option value="Plaine Irradiée" class="c9">Plaine Irradiée</option>
<option value="Plaine Irradiée + villes" class="c9">Plaine Irradiée + villes</option>
<option value="Poulpistan" class="c8">Poulpistan</option>
<option value="Poulpistan + villes" class="c8">Poulpistan + villes</option>
<option value="Refuge" class="c9">Refuge</option>
<option value="Refuge + villes" class="c9">Refuge + villes</option>
<option value="Ruthvénie" class="c8">Ruthvénie</option>
<option value="Ruthvénie + villes" class="c8">Ruthvénie + villes</option>
<option value="Sakrista" class="c2">Sakrista</option>
<option value="Sakrista + villes" class="c2">Sakrista + villes</option>
<option value="Sanctuaire" class="c8">Sanctuaire</option>
<option value="Sanctuaire + villes" class="c8">Sanctuaire + villes</option>
<option value="Santa Banana" class="c2">Santa Banana</option>
<option value="Santa Banana + villes" class="c2">Santa Banana + villes</option>
<option value="Sibéria" class="c5">Sibéria</option>
<option value="Sibéria + villes" class="c5">Sibéria + villes</option>
<option value="Sicilia" class="c2">Sicilia</option>
<option value="Sicilia + villes" class="c2">Sicilia + villes</option>
<option value="Slavonie" class="c2">Slavonie</option>
<option value="Slavonie + villes" class="c2">Slavonie + villes</option>
<option value="Structurie" class="c5">Structurie</option>
<option value="Structurie + villes" class="c5">Structurie + villes</option>
<option value="Tokyo-3" class="c8">Tokyo-3</option>
<option value="Tokyo-3 + villes" class="c8">Tokyo-3 + villes</option>
<option value="Underground" class="c6">Underground</option>
<option value="Underground + villes" class="c6">Underground + villes</option>
<option value="Valégro" class="c8">Valégro</option>
<option value="Valégro + villes" class="c8">Valégro + villes</option>
<option value="Vallée Pourpre" class="c6">Vallée Pourpre</option>
<option value="Vallée Pourpre + villes" class="c6">Vallée Pourpre + villes</option>
<option value="Vodkalie" class="c9">Vodkalie</option>
<option value="Vodkalie + villes" class="c9">Vodkalie + villes</option>
</select></li>
<li><input type="button" value="+" name="l3" class="addbtn" id="al3"><select id="l3"><option value="">Ajouter une ville</option>
<option value="Abandon" class="c5">Abandon</option>
<option value="Adalbograd" class="c5">Adalbograd</option>
<option value="Adam" class="c4">Adam</option>
<option value="Altheim-Neufra" class="c2">Altheim-Neufra</option>
<option value="Ambition" class="c8">Ambition</option>
<option value="Astrakran" class="c5">Astrakran</option>
<option value="Bamboutopia" class="c5">Bamboutopia</option>
<option value="Bauhaus" class="c2">Bauhaus</option>
<option value="Bisouville" class="c9">Bisouville</option>
<option value="Bottine" class="c2">Bottine</option>
<option value="Camp des Bagnards" class="c9">Camp des Bagnards</option>
<option value="Champs de Patates" class="c5">Champs de Patates</option>
<option value="Coeur givré" class="c6">Coeur givré</option>
<option value="Confluence" class="c2">Confluence</option>
<option value="Crab Creek" class="c8">Crab Creek</option>
<option value="Déstructural" class="c5">Déstructural</option>
<option value="Diocèse Tutélaire" class="c8">Diocèse Tutélaire</option>
<option value="Distillerie" class="c6">Distillerie</option>
<option value="Dograde" class="c8">Dograde</option>
<option value="Forum" class="c6">Forum</option>
<option value="Greffe" class="c6">Greffe</option>
<option value="Gueule du Lézard" class="c6">Gueule du Lézard</option>
<option value="Gynerak" class="c2">Gynerak</option>
<option value="Île aux Cigares" class="c2">Île aux Cigares</option>
<option value="Île Privée de Kezeki" class="c8">Île Privée de Kezeki</option>
<option value="Jardin des Roses" class="c5">Jardin des Roses</option>
<option value="Koukouroukoukou" class="c2">Koukouroukoukou</option>
<option value="Krakov" class="c5">Krakov</option>
<option value="Léprosie" class="c2">Léprosie</option>
<option value="Les Îles Sandwich" class="c2">Les Îles Sandwich</option>
<option value="Little Accalmie" class="c5">Little Accalmie</option>
<option value="Montagne Rouge" class="c6">Montagne Rouge</option>
<option value="Monte-Oktavio" class="c8">Monte-Oktavio</option>
<option value="Ni-Ni" class="c9">Ni-Ni</option>
<option value="Nouvelle Volupté" class="c8">Nouvelle Volupté</option>
<option value="Passe à poisson" class="c5">Passe à poisson</option>
<option value="Pirée" class="c6">Pirée</option>
<option value="Plateforme Offshore" class="c2">Plateforme Offshore</option>
<option value="Portail de l'Enfer" class="c2">Portail de l'Enfer</option>
<option value="Pourproville" class="c6">Pourproville</option>
<option value="Quartier Suprême" class="c6">Quartier Suprême</option>
<option value="Quartier sur les Eaux" class="c6">Quartier sur les Eaux</option>
<option value="Quasar" class="c6">Quasar</option>
<option value="Requiem" class="c2">Requiem</option>
<option value="Ruthvenville" class="c8">Ruthvenville</option>
<option value="Santa Banana City" class="c2">Santa Banana City</option>
<option value="Sbleunatérak" class="c6">Sbleunatérak</option>
<option value="Secteur Portuaire" class="c2">Secteur Portuaire</option>
<option value="Secteur Restreint" class="c2">Secteur Restreint</option>
<option value="Structural" class="c5">Structural</option>
<option value="Trésorville" class="c2">Trésorville</option>
<option value="Triangle d'Or" class="c6">Triangle d'Or</option>
<option value="Tribunal Cybermondial" class="c6">Tribunal Cybermondial</option>
</select></li>
</ul></td></tr>
<tr class="forum-top" style="display: block;"><td id="report-col2">
<ul><li><select id="inputp3" name="p3"><option value="1">Toutes les actions</option>
<option value="-1">Événements divers &amp; animation</option>
<optgroup label="Ordres de Déplacements"><option value="200001">Se Déplacer</option>
<option value="200002">Changer de Pièce</option>
<option value="200003">Sortir</option>
<option value="200004">Fermer/Ouvrir</option>
<option value="200011">Bâtir</option>
<option value="200012">Bombarder</option>
<option value="200013">Bâtir/Détruire Route/Arbre/Fleurs</option>
<option value="200014">Dresser Tente</option>
<option value="200015">Arracher Arbre/Fleurs</option>
<option value="200016">Pilonner</option>
<option value="200021">Chasser</option>
<option value="200022">Explorer</option>
<option value="200023">Pêcher</option>
<option value="200024">Rejoindre la Côte</option>
</optgroup><optgroup label="Matériel"><option value="200101">Ramasser</option>
<option value="200102">Effraction</option>
<option value="200103">Siphonner</option>
<option value="200111">Arracher du Sol</option>
</optgroup><optgroup label="Articles"><option value="200200">Construire</option>
<option value="200201">Extraire</option>
<option value="200202">Produire</option>
<option value="200203">Acheter</option>
<option value="200204">Vendre</option>
<option value="200205">Consommer</option>
<option value="200206">Donner</option>
<option value="200207">Voler</option>
<option value="200208">Détruire</option>
<option value="200209">Prendre</option>
<option value="200210">Gestion</option>
<option value="200211">Convertir UE</option>
<option value="200212">Démolir</option>
<option value="200213">Voyager</option>
<option value="200214">Casser</option>
<option value="200215">Ramasser</option>
<option value="200216">Achat d'Énergie</option>
<option value="200221">Saboter</option>
</optgroup><optgroup label="Installation"><option value="200301">Retirer</option>
<option value="200302">Voler</option>
<option value="200303">Détruire</option>
<option value="200304">Utiliser</option>
<option value="200305">Intervertir</option>
<option value="200306">Mettre en Vente</option>
<option value="200307">Acheter</option>
<option value="200311">Ouvrir/Fermer</option>
<option value="200312">Mettre/Retirer</option>
<option value="200313">Forcer</option>
<option value="200315">Pirater</option>
<option value="200321">Expertiser</option>
<option value="200322">Réserver/Autoriser</option>
</optgroup><optgroup label="Caisse"><option value="200401">Verser</option>
<option value="200402">Prélever</option>
<option value="200403">Voler</option>
<option value="200404">Fixer salaire</option>
<option value="200405">Fraude Fiscale</option>
<option value="200411">Détournement</option>
<option value="200412">Transférer</option>
<option value="200413">Transfert Réseau</option>
<option value="200421">Augmentation</option>
</optgroup><optgroup label="État du Bâtiment"><option value="200501">Réparer</option>
<option value="200502">Graffiti</option>
<option value="200503">Vandalisme</option>
<option value="200504">Attentat</option>
<option value="200509">Piller</option>
<option value="200539">Affaiblissement de Structure</option>
<option value="200540">Renforcement de Structure</option>
</optgroup><optgroup label="Bâtiment"><option value="201101">Changer le Nom</option>
<option value="201102">Annonce</option>
<option value="201103">Changer le Type</option>
<option value="201104">Abandonner</option>
<option value="201105">Démonter la Cabane</option>
<option value="201106">Construction</option>
<option value="201107">Sécurité</option>
<option value="201111">Changer la Serrure</option>
<option value="201112">Locataire</option>
<option value="201120">Appeler</option>
<option value="201121">Cambrioler</option>
<option value="201122">Défoncer</option>
<option value="201123">Épier</option>
<option value="201129">Désamorcer</option>
<option value="201131">Occuper</option>
<option value="201132">Libérer</option>
<option value="201142">Déplacer</option>
</optgroup><optgroup label="Pouvoirs Spéciaux"><option value="201211">Débauche</option>
<option value="201212">Dispensaire Médical</option>
<option value="201213">Ambiance Hostile</option>
<option value="201214">Alerte à la Bombe</option>
<option value="201215">Blocage Informatique</option>
<option value="201216">Déblocage Informatique</option>
<option value="201217">Paresse</option>
<option value="201218">Entrain au Travail</option>
<option value="201219">Grève</option>
<option value="201220">Installer un Piège</option>
<option value="201221">Fausse Clef</option>
<option value="201222">Fausse Déclaration</option>
<option value="201223">Zone Autonome</option>
<option value="201224">Zone de Non-Droit</option>
<option value="201225">Rétablir l'Ordre</option>
<option value="201226">Ambiance de Fête</option>
<option value="201227">Zone Fanatisée</option>
<option value="201228">Adhésion Populaire</option>
<option value="201229">Affaiblissement de Structure</option>
<option value="201230">Art Maudit</option>
<option value="201231">Production Maudite</option>
<option value="201232">Recherche Maudite</option>
<option value="201233">Lutte contre le Fanatisme</option>
<option value="201234">Caution Morale</option>
<option value="201235">Justification</option>
<option value="201236">Lourdeur Administrative</option>
<option value="201237">Chaîne de Production</option>
<option value="201238">Filon</option>
<option value="201239">École de Magie</option>
<option value="201240">École du Crime</option>
</optgroup><optgroup label="Hôtel de Ville"><option value="221111">Voter</option>
<option value="221112">Frauder</option>
<option value="221113">Incendier</option>
<option value="221114">Sondage</option>
<option value="221115">Candidature</option>
<option value="221116">Meeting</option>
<option value="221117">Se retirer</option>
<option value="221118">Acheter des Voix</option>
<option value="221121">Voter</option>
<option value="221122">Frauder</option>
<option value="221123">Incendier</option>
<option value="221124">Sondage</option>
<option value="221125">Candidature</option>
<option value="221126">Meeting</option>
<option value="221127">Se retirer</option>
<option value="221128">Acheter des Voix</option>
<option value="221131">Voter</option>
<option value="221132">Frauder</option>
<option value="221133">Incendier</option>
<option value="221134">Sondage</option>
<option value="221135">Candidature</option>
<option value="221136">Meeting</option>
<option value="221137">Se retirer</option>
<option value="221138">Acheter des Voix</option>
<option value="221141">Déclaration</option>
<option value="221142">Soutien/Critique</option>
<option value="221143">Manifestation</option>
<option value="221145">Émeute</option>
<option value="221146">Contre-Manifestation</option>
<option value="221147">Mains Propres</option>
<option value="221148">Soutien Légitimiste</option>
<option value="221149">Téléphoner</option>
<option value="221151">Mettre en Vente</option>
<option value="221152">Acheter</option>
<option value="221161">Demander/Annuler</option>
<option value="221162">Accepter/Refuser</option>
<option value="221163">Divorcer</option>
<option value="221171">Désaveu</option>
<option value="221181">Se Domicilier</option>
<option value="221182">Naturalisation</option>
<option value="221183">Devenir Apatride</option>
<option value="221184">Agent</option>
<option value="221185">Rejoindre/Annuler</option>
<option value="221190">Conjonction</option>
<option value="221191">Prendre Fonction</option>
<option value="221192">Convention Collective</option>
<option value="221193">Feu d'Artifice</option>
<option value="221194">Réclamation</option>
<option value="221195">Efficacité Administrative</option>
<option value="221196">Interruption de Fête</option>
<option value="221197">Prolongation de Fête</option>
<option value="221198">Ligue de Vertu</option>
<option value="221199">Laxisme Électoral</option>
</optgroup><optgroup label="Caserne"><option value="221211">Espionnage Militaire Ville</option>
</optgroup><optgroup label="Prison"><option value="221304">Scier</option>
<option value="221305">Creuser</option>
<option value="221306">Distraire</option>
<option value="221307">Soudoyer</option>
<option value="221308">Émeute Carcérale</option>
<option value="221309">Évasion</option>
<option value="221310">Se Livrer</option>
<option value="221311">Allègement</option>
<option value="221312">Caution</option>
<option value="221313">Donner Nourriture</option>
<option value="221314">Parler</option>
<option value="221315">Acheter</option>
<option value="221316">Scier</option>
<option value="221317">Creuser</option>
<option value="221318">Protester</option>
<option value="221319">Réclamer</option>
<option value="221321">Caution</option>
<option value="221322">Libération Anticipée</option>
<option value="221323">Danger Public</option>
<option value="221324">Donner Discrètement Objet</option>
<option value="221325">Amnistie</option>
<option value="221326">Fausse Preuve</option>
<option value="221327">Protection contre l'Arbitraire</option>
<option value="221328">Confort des Prisons</option>
<option value="221329">Laxisme Judiciaire</option>
<option value="221341">Caution</option>
<option value="221342">Complainte</option>
<option value="221343">Graffiti</option>
</optgroup><optgroup label="Commissariat"><option value="221911">Gêne</option>
<option value="221912">Aide</option>
<option value="221914">Pirater Fichiers Commissariat</option>
<option value="221921">Porter Plainte</option>
<option value="221922">Gêner Enquête</option>
<option value="221929">Preuves de l'Hérésie</option>
</optgroup><optgroup label="Palais du Gouverneur"><option value="223131">Insurrection</option>
<option value="223132">Révolution</option>
<option value="223133">Conquête</option>
<option value="223134">Loyauté</option>
<option value="223191">Prendre Fonction</option>
<option value="223192">Appel à la Révolution</option>
<option value="223194">Réclamation</option>
<option value="223195">Efficacité Administrative</option>
</optgroup><optgroup label="Base Militaire"><option value="223211">Espionnage Militaire Province</option>
<option value="223214">Positions Militaires</option>
</optgroup><optgroup label="Palais du Gouverneur"><option value="227191">Prendre Fonction</option>
</optgroup><optgroup label="Port"><option value="231111">Mener la Pêche</option>
</optgroup><optgroup label="Cimetière"><option value="231501">Hommage</option>
<option value="231502">Profaner</option>
<option value="231511">Registres</option>
</optgroup><optgroup label="Fontaine"><option value="231601">Boire</option>
<option value="231602">Vœu</option>
</optgroup><optgroup label="Drapeau"><option value="232101">Hisser un Drapeau</option>
</optgroup><optgroup label="Statue"><option value="233101">Ordre Vide</option>
</optgroup><optgroup label="Portail Vide-Ordures"><option value="235101">Jeter des Déchets</option>
</optgroup><optgroup label="Portail"><option value="235301">Emprunter le Portail</option>
</optgroup><optgroup label="Portail Démoniaque"><option value="235401">Recruter un Démon</option>
</optgroup><optgroup label="Fontaine de Cailloux"><option value="235601">Prendre un Caillou</option>
</optgroup><optgroup label="Mausolée d'Elmer Caps"><option value="235701">Hommage</option>
</optgroup><optgroup label="Sous-Sols"><option value="235801">S'aventurer dans les Sous-Sols</option>
</optgroup><optgroup label="Porte des Étoiles"><option value="235901">Prendre la Porte des Étoiles</option>
</optgroup><optgroup label="Auberge"><option value="240201">Rumeur</option>
<option value="240202">Tournée Générale</option>
<option value="240211">Localisation</option>
<option value="240212">Objet/Relique</option>
<option value="240213">Fausse Piste</option>
<option value="240216">Valse Krakovienne</option>
<option value="240217">Danse des Kanards</option>
<option value="240221">Engager</option>
<option value="240222">Contrat</option>
<option value="240231">Spectacle</option>
<option value="240232">Repérage des Criminels</option>
<option value="240233">Repérage des Monstres</option>
<option value="240234">Trouver un Objet Rare</option>
<option value="240235">Objet Illégal</option>
<option value="240236">Repérage des Drogués</option>
<option value="240237">Recrutement Massif</option>
<option value="240238">Prohibition</option>
<option value="240239">Tripot</option>
</optgroup><optgroup label="Garage"><option value="240721">Bons Tuyaux</option>
</optgroup><optgroup label="Hôpital"><option value="240901">Modifier une Caractéristique</option>
<option value="240902">Points de Vie</option>
<option value="240903">Changer de Sexe</option>
</optgroup><optgroup label="École"><option value="241101">Espionner</option>
<option value="241102">Athéisme</option>
<option value="241111">Recherche</option>
<option value="241121">Pirater</option>
<option value="241122">Vol de Technologie</option>
<option value="241123">Perte Technologique</option>
</optgroup><optgroup label="Banque"><option value="241201">Déposer/Retirer</option>
<option value="241203">Pirater</option>
<option value="241204">Dérober l'Épargne</option>
<option value="241211">Versement</option>
<option value="241221">Acheter Bons / PC</option>
<option value="241222">Vendre Bons / PC</option>
<option value="241223">Acheter Actions</option>
<option value="241224">Vendre Actions</option>
<option value="241241">Emprunter</option>
<option value="241242">Rembourser</option>
<option value="241271">Modifier Taux</option>
</optgroup><optgroup label="Temple"><option value="242101">Conversion</option>
<option value="242102">Méditation</option>
<option value="242109">Mariage</option>
<option value="242111">Aide Divine</option>
<option value="242112">Intervention Divine</option>
<option value="242113">Emplacement Relique</option>
<option value="242114">Celui qui Guide</option>
<option value="242115">Hacker le Réseau</option>
<option value="242121">Lutter contre le Paganisme</option>
<option value="242122">Cérémonie</option>
<option value="242123">Lieu d'Asile</option>
<option value="242124">Registre des Fidèles</option>
<option value="242125">Repérer les Infidèles</option>
<option value="242126">Guerre Sainte</option>
<option value="242127">École Religieuse</option>
</optgroup><optgroup label="Marché"><option value="249901">Fermer le Marché</option>
</optgroup><optgroup label="Tente"><option value="250901">Démonter</option>
<option value="250911">Marché</option>
</optgroup><optgroup label="Actions de Rencontre"><option value="300001">Donner</option>
<option value="300002">Transférer</option>
<option value="300003">Voler</option>
<option value="300004">Faire Consommer</option>
<option value="300007">Utiliser un Parchemin</option>
<option value="300010">Soigner</option>
<option value="300011">Mendier</option>
<option value="300012">Surveiller</option>
<option value="300013">Charmer</option>
<option value="300014">Coup Monté</option>
<option value="300015">Entarter</option>
<option value="300016">Parler</option>
<option value="300017">Recourir</option>
<option value="300018">Câlin</option>
<option value="300019">Campagne</option>
<option value="300020">Groupe</option>
<option value="300021">Capturer</option>
<option value="300022">Libérer</option>
<option value="300023">Ligoter</option>
<option value="300024">Délier</option>
<option value="300025">Dresser</option>
<option value="300026">Relâcher</option>
<option value="300027">Livrer</option>
<option value="300028">Missions</option>
<option value="300029">Présence</option>
<option value="300030">Naturalisation</option>
<option value="300031">Dépecer</option>
<option value="300040">Pouvoir</option>
<option value="300042">Abandonner Religion</option>
<option value="300043">Démission</option>
<option value="300044">Concours de Boisson</option>
<option value="300045">Vindicte</option>
<option value="300046">Sens Tactique</option>
<option value="300047">Lapider</option>
<option value="300048">Horoscope</option>
<option value="300049">Bras de Fer</option>
<option value="300050">Aide Logistique</option>
<option value="300051">Peur</option>
<option value="300052">Sens du Pouvoir</option>
<option value="300053">Théologie</option>
<option value="300054">Réparer</option>
<option value="300055">Traiter une Maladie</option>
<option value="300056">Détection des Flux Magiques</option>
<option value="300057">Recommander</option>
<option value="300058">Se Faire Payer un Verre</option>
<option value="300059">Se faire payer un repas</option>
<option value="300061">Vente Forcée</option>
<option value="300062">Conseil Juridique</option>
<option value="300063">Informations sur la Fortune</option>
<option value="300064">Discussion de Geek</option>
<option value="300065">Faux Signalement</option>
<option value="300066">Contact Milieu</option>
<option value="300067">Commander</option>
<option value="300068">Faire Avouer</option>
<option value="300069">Évacuer</option>
<option value="300070">Réengager</option>
<option value="300071">Insurrection</option>
<option value="300072">Assassiner</option>
<option value="300073">Confesser</option>
<option value="300074">Convertir</option>
<option value="300075">Détection de la Magie</option>
<option value="300078">Concilier</option>
<option value="300079">Séduire</option>
<option value="300080">Divertir</option>
<option value="300081">Espionner</option>
<option value="300082">Escroquerie</option>
<option value="300083">Esclavage</option>
<option value="300084">Dealer</option>
<option value="300085">Saboter</option>
<option value="300086">Coup Monté Fonctionnaire</option>
<option value="300087">Vol Précis</option>
<option value="300088">Excommunier</option>
<option value="300089">Imposer un Régime</option>
<option value="300090">Maudire</option>
<option value="300091">Examiner Armes</option>
<option value="300092">Rançon</option>
<option value="300093">Prêcher</option>
<option value="300094">Respect de la Loi</option>
<option value="300095">Disperser</option>
<option value="300096">Importuner</option>
<option value="300097">Bavarder</option>
<option value="300098">Pacifier</option>
<option value="300099">Bravoure</option>
</optgroup><optgroup label="Actions à Distance"><option value="300129">Présence</option>
</optgroup><optgroup label="Actions de Groupe"><option value="300201">Se Cacher</option>
<option value="300202">Quitter la Cache</option>
<option value="300203">Fouiller</option>
<option value="300204">Parler</option>
<option value="300205">Combattre</option>
<option value="300206">Bagarre</option>
<option value="300211">Disperser</option>
<option value="300212">Interrompre un Combat</option>
</optgroup><optgroup label="Véhicules du Groupe"><option value="300401">Sortir du Véhicule</option>
<option value="300402">Recharger</option>
<option value="300411">Bidouiller</option>
</optgroup><optgroup label="Actions de Combat"><option value="300501">Combat</option>
</optgroup><optgroup label="Actions en Combat"><option value="300601">Fuir</option>
<option value="300602">Se Rendre</option>
<option value="300603">Parlementer</option>
<option value="300604">Rançon en Combat</option>
<option value="300605">Appel au Secours</option>
<option value="300606">Calmer Monstre</option>
<option value="300607">Abordage</option>
<option value="300608">Ralliement</option>
</optgroup><optgroup label="PNJ Conteur"><option value="300701">Discuter</option>
</optgroup><optgroup label="Organisation"><option value="400001">Créer une Organisation</option>
<option value="400002">Profil</option>
<option value="400003">Rangs</option>
<option value="400004">Site</option>
<option value="400005">Transférer Siège</option>
<option value="400006">Supprimer Siège</option>
<option value="400007">Dissoudre</option>
<option value="400008">Rejoindre/Annuler</option>
<option value="400009">Quitter</option>
<option value="400010">Message</option>
<option value="400011">Boîte Kramail</option>
<option value="400012">Signature</option>
<option value="400013">Fouiller Dossiers</option>
<option value="400014">Empire</option>
<option value="400015">Nom</option>
</optgroup><optgroup label="Organisation"><option value="400101">Accepter/Refuser une candidature</option>
<option value="400102">Modifier le Rang</option>
<option value="400103">Céder la Direction</option>
</optgroup><optgroup label="Pouvoirs Spéciaux"><option value="400211">Appui/Pression</option>
<option value="400212">Influence Provinciale</option>
<option value="400221">Campagne de Presse</option>
<option value="400222">Nouvelle Édition</option>
<option value="400241">Soutien</option>
<option value="400242">Remettre le Ruban</option>
<option value="400251">Évasion</option>
</optgroup><optgroup label="Organisation"><option value="410001">Quitter</option>
</optgroup><optgroup label="Bourgmestre"><option value="521101">Démissionner</option>
<option value="521102">Déclaration</option>
<option value="521104">Usurper</option>
<option value="521105">Description</option>
<option value="521106">Fête de la Ville</option>
<option value="521109">Prêter Allégeance</option>
<option value="521111">Nommer</option>
<option value="521112">Verser</option>
<option value="521113">Prélever</option>
<option value="521114">Élections Anticipées</option>
<option value="521115">Élections Repoussées</option>
<option value="521121">Prime</option>
<option value="521131">Couvre-Feu</option>
<option value="521132">Surveiller les Élections</option>
<option value="521141">Taxe Foncière</option>
<option value="521142">Immobilier</option>
<option value="521143">Domestiques</option>
<option value="521144">Sexe</option>
<option value="521145">Air</option>
<option value="521146">Maladies</option>
<option value="521147">Groupes</option>
<option value="521148">Goinfrerie</option>
<option value="521149">Taxes</option>
<option value="521151">Détruire/Exproprier</option>
<option value="521161">Verser</option>
<option value="521162">Prélever</option>
</optgroup><optgroup label="Sergent"><option value="521201">Démissionner</option>
<option value="521202">Déclaration</option>
<option value="521204">Usurper</option>
<option value="521209">Prêter Allégeance</option>
<option value="521221">Défilé Militaire</option>
<option value="521226">Instruction Militaire</option>
<option value="521241">Rétablir l'Ordre</option>
<option value="521242">Investir</option>
<option value="521291">Engager</option>
<option value="521292">Clone</option>
</optgroup><optgroup label="Juge"><option value="521301">Démissionner</option>
<option value="521302">Déclaration</option>
<option value="521304">Usurper</option>
<option value="521309">Prêter Allégeance</option>
<option value="521311">Barreaux</option>
<option value="521312">Tunnel</option>
<option value="521314">Confort</option>
<option value="521315">Retirer Confort</option>
<option value="521322">Remise de Peine</option>
<option value="521323">Prolonger la Peine</option>
<option value="521324">Torturer</option>
<option value="521327">Esclave</option>
<option value="521332">Amende</option>
</optgroup><optgroup label="Commissaire de Police"><option value="521901">Démissionner</option>
<option value="521902">Déclaration</option>
<option value="521904">Usurper</option>
<option value="521909">Prêter Allégeance</option>
<option value="521921">Campagne de Sécurité</option>
<option value="521931">Indicateur</option>
<option value="521932">Enquête</option>
<option value="521933">Surveiller</option>
<option value="521934">Contravention</option>
<option value="521935">Retirer</option>
<option value="521936">Présence</option>
<option value="521941">Perquisition</option>
<option value="521942">Recherche d'Indices</option>
<option value="521943">Briser une Grève</option>
<option value="521944">Prohibition</option>
<option value="521945">Sécuriser</option>
<option value="521991">Engager</option>
</optgroup><optgroup label="Général"><option value="522201">Démissionner</option>
<option value="522202">Déclaration</option>
<option value="522209">Prêter Allégeance</option>
<option value="522211">Envoyer un Missile</option>
<option value="522212">Nucléaire</option>
<option value="522221">Défilé Militaire</option>
<option value="522291">Engager</option>
<option value="522292">Clone</option>
</optgroup><optgroup label="Ambassadeur"><option value="522401">Démissionner</option>
<option value="522402">Déclaration</option>
<option value="522405">Réception</option>
<option value="522409">Prêter Allégeance</option>
<option value="522421">Relations</option>
<option value="522425">Amitié</option>
<option value="522426">Mise en Garde</option>
<option value="522427">Tribut</option>
</optgroup><optgroup label="Prérogatives"><option value="522501">Démissionner</option>
<option value="522502">Déclaration</option>
<option value="522504">Usurper</option>
<option value="522509">Prêter Allégeance</option>
<option value="522511">Autorisation</option>
<option value="522512">Contrôle Fiscal</option>
<option value="522521">Enquête Fiscale</option>
<option value="522522">Redressement Fiscal</option>
<option value="522523">Contrôle Fiscal</option>
</optgroup><optgroup label="Gouverneur"><option value="523101">Démissionner</option>
<option value="523102">Déclaration</option>
<option value="523103">Déclaration à l'Empire</option>
<option value="523104">Usurper</option>
<option value="523105">Description</option>
<option value="523106">État d'Urgence</option>
<option value="523109">Prêter Allégeance</option>
<option value="523111">Nommer</option>
<option value="523112">Verser</option>
<option value="523113">Prélever</option>
<option value="523114">Élections Anticipées</option>
<option value="523115">Élections Repoussées</option>
<option value="523121">Récompense</option>
<option value="523131">Surveiller les Élections</option>
<option value="523132">Fuir en Hélicoptère</option>
<option value="523141">Verser</option>
<option value="523142">Prélever</option>
<option value="523151">Nommer</option>
<option value="523152">Verser</option>
<option value="523161">Fonder une Ville</option>
<option value="523171">Sécession</option>
<option value="523181">Réunir le Conseil des Khans</option>
<option value="523182">Vote pour élire le Grand Khan</option>
<option value="523183">Successeur</option>
<option value="523185">Tournoi de Ping-Pong</option>
<option value="523186">Escamoter les Villes</option>
<option value="523191">Engager</option>
</optgroup><optgroup label="Capitaine"><option value="523201">Démissionner</option>
<option value="523202">Déclaration</option>
<option value="523204">Usurper</option>
<option value="523209">Prêter Allégeance</option>
<option value="523211">Envoyer un Missile</option>
<option value="523212">Nucléaire</option>
<option value="523221">Défilé Militaire</option>
<option value="523291">Engager</option>
<option value="523292">Clone</option>
</optgroup><optgroup label="Procureur"><option value="523301">Démissionner</option>
<option value="523302">Déclaration</option>
<option value="523304">Usurper</option>
<option value="523309">Prêter Allégeance</option>
<option value="523311">Caution</option>
<option value="523326">Transférer</option>
<option value="523332">Amende</option>
<option value="523333">Avis de Recherche</option>
<option value="523334">Arbitraire</option>
<option value="523335">Transmettre</option>
</optgroup><optgroup label="Intendant"><option value="523501">Démissionner</option>
<option value="523502">Déclaration</option>
<option value="523504">Usurper</option>
<option value="523509">Prêter Allégeance</option>
<option value="523511">Salaires</option>
<option value="523512">Or</option>
<option value="523513">Vente</option>
<option value="523514">Évasion Fiscale</option>
<option value="523515">Évasion Fiscale</option>
<option value="523516">Objets</option>
<option value="523517">Signes de Richesse</option>
<option value="523518">Redevance</option>
<option value="523519">Redistribution</option>
<option value="523521">Prime</option>
<option value="523531">Encourager la Production</option>
</optgroup><optgroup label="Préfet de Police"><option value="523901">Démissionner</option>
<option value="523902">Déclaration</option>
<option value="523904">Usurper</option>
<option value="523909">Prêter Allégeance</option>
<option value="523921">Campagne de Sécurité</option>
<option value="523931">Cellule d'Enquête</option>
<option value="523932">Détruire le Dossier</option>
<option value="523933">Surveiller</option>
<option value="523934">Retirer</option>
<option value="523935">Présence</option>
<option value="523991">Engager</option>
</optgroup><optgroup label="Chef du Gouvernement"><option value="525101">Démissionner</option>
<option value="525102">Déclaration</option>
<option value="525103">Déclaration Cybermondiale</option>
<option value="525106">État d'Urgence</option>
<option value="525109">Prêter Allégeance</option>
<option value="525111">Nommer</option>
<option value="525112">Innocenter</option>
<option value="525121">Successeur</option>
<option value="525122">Parti Unique</option>
<option value="525131">Médaille</option>
<option value="525151">Adhésion/Retrait</option>
<option value="525152">Nommer</option>
<option value="525161">Budget</option>
<option value="525191">Engager</option>
</optgroup><optgroup label="Ministre de la Guerre"><option value="525201">Démissionner</option>
<option value="525202">Déclaration</option>
<option value="525204">Usurper</option>
<option value="525209">Prêter Allégeance</option>
<option value="525211">Commando</option>
<option value="525221">Nommer</option>
<option value="525222">Changer Nom</option>
<option value="525223">Détruire une Armée</option>
<option value="525224">Créer une Nouvelle Armée</option>
<option value="525231">Bombe du Bonheur</option>
<option value="525232">Légions Démoniaques</option>
<option value="525233">Ruine Économique</option>
<option value="525234">Lumière Aveuglante</option>
<option value="525235">Famine</option>
<option value="525236">Bombe Débilitante</option>
<option value="525237">Rayon Pacifique</option>
<option value="525238">Démoralisation</option>
<option value="525241">Croix de Guerre</option>
<option value="525291">Engager</option>
</optgroup><optgroup label="Ministre de la Justice"><option value="525301">Démissionner</option>
<option value="525302">Déclaration</option>
<option value="525304">Usurper</option>
<option value="525309">Prêter Allégeance</option>
<option value="525312">Régime Carcéral</option>
<option value="525313">Torture</option>
<option value="525321">Annuler Peine Politique</option>
<option value="525322">Annuler Peine Droit Commun</option>
<option value="525325">Australine</option>
<option value="525326">Transférer</option>
<option value="525332">Amende</option>
<option value="525333">Avis de Recherche</option>
<option value="525334">Arbitraire</option>
<option value="525335">Transmettre</option>
<option value="525341">Annuler les Poursuites</option>
<option value="525342">Prime</option>
<option value="525351">Accusation</option>
<option value="525391">Engager</option>
</optgroup><optgroup label="Ministre des Affaires Étrangères"><option value="525401">Démissionner</option>
<option value="525402">Déclaration</option>
<option value="525403">Déclaration Cybermondiale</option>
<option value="525404">Usurper</option>
<option value="525409">Prêter Allégeance</option>
<option value="525421">Relations</option>
<option value="525422">Ambassadeur</option>
<option value="525423">Ambassade</option>
<option value="525424">Déclaration</option>
<option value="525425">Approuver</option>
<option value="525426">Condamner</option>
<option value="525427">Tribut</option>
<option value="525428">Cession</option>
<option value="525432">Élections en Province</option>
<option value="525433">Élections en Ville</option>
<option value="525491">Engager</option>
</optgroup><optgroup label="Ministre de l'Économie"><option value="525501">Démissionner</option>
<option value="525502">Déclaration</option>
<option value="525504">Usurper</option>
<option value="525509">Prêter Allégeance</option>
<option value="525511">Subvention</option>
<option value="525521">Subvention</option>
<option value="525522">Taux</option>
<option value="525531">Impôt</option>
<option value="525532">Fortune</option>
<option value="525535">Organisations</option>
<option value="525536">Infidèles</option>
<option value="525541">Prime</option>
<option value="525542">Enquête Fiscale</option>
<option value="525543">Redressement Fiscal</option>
<option value="525550">Redistribution</option>
<option value="525552">Dévaluation</option>
<option value="525554">Sanctions</option>
<option value="525555">Déposer</option>
<option value="525556">Retirer</option>
<option value="525557">Épargne</option>
<option value="525558">Taux</option>
<option value="525559">Taux max</option>
<option value="525561">Émettre</option>
<option value="525562">Distribution</option>
<option value="525571">Modifer les Prix Maximums</option>
<option value="525581">Subvention</option>
<option value="525591">Engager</option>
<option value="525592">Nommer</option>
</optgroup><optgroup label="Ministre de la Recherche"><option value="525601">Démissionner</option>
<option value="525602">Déclaration</option>
<option value="525604">Usurper</option>
<option value="525609">Prêter Allégeance</option>
<option value="525611">Lancer/Arrêter</option>
<option value="525612">Donner</option>
<option value="525613">Livrer</option>
<option value="525614">Modifier</option>
<option value="525615">Stratégique</option>
<option value="525621">Bons d'État/Actions PC</option>
<option value="525623">Loterie</option>
<option value="525624">Chef du Gouvernement</option>
<option value="525625">Gouverneur</option>
<option value="525626">Bourgmestre</option>
<option value="525627">Citoyen</option>
<option value="525631">Rayon</option>
<option value="525641">Salaire</option>
<option value="525651">Entretien des Écoles</option>
<option value="525652">Illettrisme</option>
<option value="525661">Entretien des Hôpitaux</option>
<option value="525691">Engager</option>
</optgroup><optgroup label="Ministre de l'Intérieur"><option value="525701">Démissionner</option>
<option value="525702">Déclaration</option>
<option value="525704">Usurper</option>
<option value="525709">Prêter Allégeance</option>
<option value="525711">Campagne Sécurité</option>
<option value="525712">Surveiller Élections</option>
<option value="525713">Duels</option>
<option value="525714">Chasse</option>
<option value="525715">Nourrir Monstres</option>
<option value="525716">Matériel</option>
<option value="525717">Couvre-Feu</option>
<option value="525718">Surveiller Réseau</option>
<option value="525721">Nommer</option>
<option value="525722">Élections en Province</option>
<option value="525723">Élections en Ville</option>
<option value="525731">Accepter/Refuser</option>
<option value="525732">Prime/Taxe</option>
<option value="525733">Accepter/Refuser</option>
<option value="525791">Engager</option>
</optgroup><optgroup label="Ministre de l'Information"><option value="525801">Démissionner</option>
<option value="525802">Déclaration</option>
<option value="525803">Rumeur (=Rumeur normale)</option>
<option value="525804">Usurper</option>
<option value="525805">Page d'Accueil</option>
<option value="525806">Fête/Deuil</option>
<option value="525809">Prêter Allégeance</option>
<option value="525811">Émission</option>
<option value="525812">Motivation</option>
<option value="525821">Enquête</option>
<option value="525831">Musées</option>
<option value="525832">Cultes</option>
<option value="525833">Intérêt Public</option>
<option value="525891">Engager</option>
</optgroup><optgroup label="Directeur des Services Secrets"><option value="525901">Démissionner</option>
<option value="525902">Déclaration</option>
<option value="525903">Rumeur (=Rumeur normale)</option>
<option value="525904">Usurper</option>
<option value="525909">Prêter Allégeance</option>
<option value="525911">Naturalisations</option>
<option value="525921">Accepter/Refuser</option>
<option value="525922">Renvoyer</option>
<option value="525923">Prime</option>
<option value="525924">Évasion</option>
<option value="525931">Surveiller</option>
<option value="525932">Contre-Espionnage</option>
<option value="525933">Coup Monté</option>
<option value="525942">Élections en Province</option>
<option value="525943">Élections en Ville</option>
<option value="525991">Engager</option>
</optgroup><optgroup label="Ministre du Travail"><option value="526001">Démissionner</option>
<option value="526002">Déclaration</option>
<option value="526004">Usurper</option>
<option value="526009">Prêter Allégeance</option>
<option value="526011">Temps de Travail</option>
<option value="526012">Salaire</option>
<option value="526013">Esclave</option>
<option value="526021">Couverture</option>
<option value="526022">Chômage</option>
<option value="526023">Solidarité</option>
<option value="526024">Famille</option>
<option value="526025">Isolés</option>
<option value="526026">Jeunesse</option>
<option value="526027">Frais Médicaux</option>
<option value="526028">Production</option>
<option value="526031">Pauvreté</option>
<option value="526032">Logement</option>
<option value="526072">Établir le Plan de Production</option>
<option value="526091">Engager</option>
</optgroup><optgroup label="Commissaire du Bonheur"><option value="536101">Démissionner</option>
<option value="536102">Déclaration</option>
<option value="536109">Prêter Allégeance</option>
<option value="536111">Pastille du Bonheur</option>
<option value="536112">Communion</option>
<option value="536113">Condamnation</option>
</optgroup><optgroup label="Maître du Nexus"><option value="536201">Démissionner</option>
<option value="536202">Déclaration</option>
<option value="536209">Prêter Allégeance</option>
<option value="536211">Carré Magique</option>
<option value="536212">Opposition Magique</option>
</optgroup><optgroup label="Directeur de la Banque Cybermondiale"><option value="536301">Démissionner</option>
<option value="536302">Déclaration</option>
<option value="536309">Prêter Allégeance</option>
<option value="536311">Mini-Lingot d'Or</option>
<option value="536313">Inquiétude</option>
<option value="536321">Bloquer/Débloquer</option>
</optgroup><optgroup label="Directeur de l'Observatoire"><option value="536401">Démissionner</option>
<option value="536402">Déclaration</option>
<option value="536409">Prêter Allégeance</option>
<option value="536411">Prix Clafoutis</option>
<option value="536412">Conférence Scientifique</option>
<option value="536413">Technologie Interdite</option>
<option value="536414">Technologie Autorisée</option>
</optgroup><optgroup label="Inspecteur Écologique"><option value="536501">Démissionner</option>
<option value="536502">Déclaration</option>
<option value="536509">Prêter Allégeance</option>
<option value="536511">Badge Ami de la Nature</option>
<option value="536512">Atmosphère</option>
<option value="536513">Inspection</option>
</optgroup><optgroup label="Directeur du Comité Olympique"><option value="536601">Démissionner</option>
<option value="536602">Déclaration</option>
<option value="536609">Prêter Allégeance</option>
<option value="536611">Coupe Olympique</option>
</optgroup><optgroup label="Juge du Tribunal Cybermondial"><option value="536701">Démissionner</option>
<option value="536702">Déclaration</option>
<option value="536709">Prêter Allégeance</option>
<option value="536711">Prix Fragile de la Paix</option>
<option value="536712">Avis de Recherche</option>
<option value="536713">Tribunal Pénal</option>
</optgroup><optgroup label="Arbitre des Élégances"><option value="536801">Démissionner</option>
<option value="536802">Déclaration</option>
<option value="536809">Prêter Allégeance</option>
<option value="536811">Médaille des Bonnes Manières</option>
</optgroup></select></li></ul>
</td><td id="report-col3">
<ul><li>Afficher <select id="inputp1" name="p1"><option value="25">25</option>
<option value="50">50</option>
<option value="100">100</option>
<option value="250" selected="">250</option>
</select> actions/page</li>
<li>&nbsp;</li>
<li><input id="inputp2" name="p2" type="checkbox" class="ncheckbox" checked=""> images incluses</li>
<li><input id="inputp4" name="p4" type="checkbox" class="ncheckbox"> réseaux sociaux</li>
</ul></td></tr>
</tbody></table>
               <p><input class="localSave" type="button" value="Sauvegarder"></p>
               </div>
               <p>Andromeda vous configure le rapport d'évènement par défaut sur "Tous les empires + provinces et villes" et 250 actions par page.<br><br>
               L'interface vous permet de sélectionner d'autres options, puis cliquez sur Sauvegarder.
               Votre sélection est conservée dans le cache de votre navigateur.</p>
               <div class="hr"><hr></div>
               <h2>Forum et Messages</h2>
               <div id="fetm" class="rbx">
               <p><label for="input16">Police de caractères : </label><input id="input16" type="text" placeholder="Entrer le nom."></p>
               <p><label for="input12">Textearea Cache : </label><input id="input12" type="text"></p>
               <p><label for="input13">Colorless : </label><input id="input13" type="text"></p>
               <table class="t"><tbody>
                    <tr>
                    <td style="text-align:justify;"><label><input id="input7" type="checkbox" class="styled">Goupil</label></td>
                    </tr>
                    <tr>
                    <td style="text-align:justify;"><label><input id="input9" type="checkbox" class="styled" disabled="disabled" checked>Easy Spoiler</label></td>
                    </tr>
               </tbody></table>
               <p><input class="localSave" type="button" value="Sauvegarder"></p>
               </div>
               <p><b>Le changement de police s'opère après actualisation de la page.</b></p><br>
               <p><b>Textearea Cache</b> sauvegarde automatiquement vos messages en cours de rédaction.
                     Entrez le nombre de message que vous souhaitez garder en mémoire. Maximum 20.</p><br>
               <p><b>Colorless</b> désactive la couleur des messages trop grand. Entrez le nombre de caractères.
                                     Mettez -1 ou rien pour désactiver la fonction.</p><br>
               <p><b>Goupil</b> remplace les smileys Poule par des normaux. Assassin de la poulice !</p><br>
               <p><b>Easy spoiler</b> vous permet de révéler le contenu en cliquant n'importe où sur le bandeau.</p>
               <div class="hr"><hr></div>
               <h2>Taille des avatars</h2>
               <div id="tailleAvatar" class="rbx">
                    <p><label for="input1">Forum : </label><input type="text" id="input1"><br></p>
                    <p><label for="input2">En jeu : </label><input type="text" id="input2"><br></p>
                    <p><label for="input3">Page Ordre : </label><input type="text" id="input3"><br></p>
                    <p><input class="localSave" type="button" value="Sauvegarder"></p>
               </div>
               <p>Vous pouvez ajuster la taille des avatars sur le site. Taille en pixels.</p>
               <div class="hr"><hr></div>
               <h2>Taille des images</h2>
               <div id="tailleImages" class="rbx">
                    <p><label for="input4">Rapport privé : </label><input type="text" id="input4"><br></p>
                    <p><label for="input5">Forum : </label><input type="text" id="input5"><br></p>
                    <p><label for="input6">Rapport d'évènements : </label><input type="text" id="input6"><br></p>
                    <p><input class="localSave" type="button" value="Sauvegarder"></p>
               </div>
               <p>Vous pouvez régler la taille maximum des images sur le site. Taille en % du cadre.</p>
               <div class="hr"><hr></div>
               <h2>Illustrations</h2>
               <div id="tailleIllustr" class="rbx">
                    <p><label for="input14">Objets : </label><input type="text" id="input14"><br></p>
                    <p><label for="input15">Bâtiments : </label><input type="text" id="input15"><br></p>
                    <p><input class="localSave" type="button" value="Sauvegarder"></p>
               </div>
               <p>Vous pouvez ajuster la taille des illustrations. Taille en pixels.</p>
               <div class="hr"><hr></div>
               </form>`;
    return aForm;
}

//--- création du bouton dans les options du profil
function AndroButton(){
    var mLeft=kdocument.getElementById('left');

    var nsMenuB=kdocument.createElement('LI');
    nsMenuB.id="aMenu";
    var fakeLink=kdocument.createElement('A');
    fakeLink.href='#';
    fakeLink.innerHTML="Andromeda Script";

    var submenu= mLeft.querySelector('.submenu UL');
    nsMenuB.appendChild(fakeLink);
    submenu.appendChild(nsMenuB);

    nsMenuB.addEventListener('click',AndroMenu,false);
}

function opSetAndromeda(){
    var motd=[3];
    motd[0]=kdocument.getElementById('cadre1').value;
    motd[1]=kdocument.getElementById('cadre2').value;
    motd[2]=kdocument.getElementById('cadre3').value;
    aparam.motd=motd;

    //--- gestion du rapport d'évènement
    aparam.erlite = kdocument.getElementById('input10').checked;
    aparam.evEmpire = kdocument.getElementById('inputp7').value;
    aparam.evAction = kdocument.getElementById('inputp3').value;
    aparam.evNb = kdocument.getElementById('inputp1').value;
    aparam.evImg = kdocument.getElementById('inputp2').checked;
    aparam.evRs = kdocument.getElementById('inputp4').checked;
    if(sessionStorage.getItem('evToken')){sessionStorage.removeItem('evToken');}

    //---
    aparam.avaFora = kdocument.getElementById('input1').value;
    aparam.avaIg = kdocument.getElementById('input2').value;
    aparam.avaOrder = kdocument.getElementById('input3').value;
    aparam.avaItem = kdocument.getElementById('input14').value;
    aparam.imgRP = kdocument.getElementById('input4').value;
    aparam.imgFora = kdocument.getElementById('input5').value;
    aparam.imgRE = kdocument.getElementById('input6').value;
    aparam.fontFam = kdocument.getElementById('input16').value;
    let maxTxtCache=parseInt(kdocument.getElementById('input12').value);
    if(maxTxtCache>20){maxTxtCache=20}
    aparam.tCache = maxTxtCache+1;
    aparam.colorL = kdocument.getElementById('input13').value;
    aparam.goupil = kdocument.getElementById('input7').checked;

    //--- sauvegarder
    localStorage.aparam=JSON.stringify(aparam);

    //---réinitialiser txtarea
    localStorage.removeItem("std");
}

function opMenuSetValue(){
    var motd=aparam.motd;
    kdocument.getElementById('cadre1').value= motd[0];
    kdocument.getElementById('cadre2').value= motd[1];
    kdocument.getElementById('cadre3').value= motd[2];

    //--- gestion du rapport d'évènement
    kdocument.getElementById('input10').checked=aparam.erlite;
    kdocument.getElementById('inputp7').value=aparam.evEmpire;
    kdocument.getElementById('inputp3').value=aparam.evAction;
    kdocument.getElementById('inputp1').value=aparam.evNb;
    kdocument.getElementById('inputp2').checked=aparam.evImg;
    kdocument.getElementById('inputp4').checked=aparam.evRs;

    //---
    kdocument.getElementById('input1').value=aparam.avaFora;
    kdocument.getElementById('input2').value=aparam.avaIg;
    kdocument.getElementById('input3').value=aparam.avaOrder;
    kdocument.getElementById('input14').value=aparam.avaItem;
    kdocument.getElementById('input4').value=aparam.imgRP;
    kdocument.getElementById('input5').value=aparam.imgFora;
    kdocument.getElementById('input6').value=aparam.imgRE;
    kdocument.getElementById('input16').value=aparam.fontFam;
    kdocument.getElementById('input12').value=aparam.tCache-1;
    kdocument.getElementById('input13').value=aparam.colorL;
    kdocument.getElementById('input7').checked=aparam.goupil;
}