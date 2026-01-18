// ==UserScript==
// @name KI-Hécate-MinichatPlus
// @description Améliore le minichat de Kraland
// @match http://www.kraland.org/*
// @version 4.0.4
// @author Somin (formerly Gyeongeun)
// @license GPL-3.0-or-later
// @namespace Gyeongeun_31399
// @grant none
// @exclude http://www.kraland.org/map.php*
// @exclude http://www.kraland.org/help.php*
// @exclude http://www.kraland.org/report.php*
// @exclude http://www.kraland.org/order.php*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/393295/KI-H%C3%A9cate-MinichatPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/393295/KI-H%C3%A9cate-MinichatPlus.meta.js
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

//+------------ Options par défaut --------------+

const Blacklist = {};
// Rajoutez les id entre les crochets ci-dessus au format id:"nom",
// exemple : {1:"redstar", 644:"krabot", 31399:"gyeongri"}
// Vous pouvez mettre le nom entre guillemet comme bon vous semble, seule l'id est prise en compte.

const Anonymes = true;
// false pour supprimer les messages d'anonymes.

const SmileysNormaux = false;
// true pour taille normale, false petite taille,

const EpinglerLesMenus = false;
// true pour épingler les menus de Kraland

var tailleMinichat = 420;
// longueur du minichat en pixels (par défaut : 420)

const HecatePlus = "";
// Entête du minichat : "kpop", "PandiPanda", "RyckoHub"

var HecateTV = "";
// "kpopTV", "PandiPandaTV", "RyckoHubTV" ou "myTV" pour afficher une miniTV !

var HecateMyTV = "";
// Entrez l'url youtube de votre propre playlist

//+------------ Paramétrages du Script --------------+

//--- Variables Globales
var kdocument=document;
var idTimeout,csstyle,param={},initp;

//--- Initialisation
Melinoe();
function Melinoe(){
    if(window.location.href=="http://www.kraland.org/"){
        location.replace("http://www.kraland.org/main.php");
    }
    //--- accès aux paramètres sauvegardés
    if(localStorage.hecateparam){
        param=JSON.parse(localStorage.hecateparam);
    }else{
        opReset();
    }
    csstyle=parseInt(kdocument.head.querySelector('link').href.split('/')[4]);
}

//+------------ Exécution de Hécate --------------+
HecateOurania()

//+------------ Hécate Plus Plus --------------+
function HecateOurania(){
switch(param.hecateTV){
  case "kpopTV" : HecateMedia("PLtp7_6Uhd19fn0_Xvi6uzGIzaa253hrBf");
  break;

  case "RyckoHubTV" : HecateMedia("PLtp7_6Uhd19eeGfewW-Mk7xnqGwlJxRyc");
  break;

  case "PandiPandaTV" : HecateMedia("PLtp7_6Uhd19fQpoVHoc8StL4u9rjbwYqy");
  break;

  case "myTV" : HecateMedia(param.hecateMyTV);
  break;

  default:
        EnoDisplay();
        Soteira();
        PhosphorosLite();
        if(param.pinup){Aenaos();}
}}

function EnoDisplay(){
switch(param.hecatePlus){
    case "kpop" : Enodia("https://www.youtube-nocookie.com/embed/videoseries?list=PLtp7_6Uhd19fn0_Xvi6uzGIzaa253hrBf", "♬ ♫ ♪ ♩ Kpop ♩ ♪ ♫ ♬");
    break;

    case "RyckoHub" : Enodia("https://www.youtube-nocookie.com/embed/videoseries?list=PLtp7_6Uhd19eeGfewW-Mk7xnqGwlJxRyc", "🍑🍆RyckoHub🍆🍑");
    break;

    case "PandiPanda" : Enodia("https://www.youtube-nocookie.com/embed/videoseries?list=PLtp7_6Uhd19fQpoVHoc8StL4u9rjbwYqy", "♫ ♪ Pandi Panda ♪ ♫<br>♩ Techno🐼Remix ♩");
    break;

    default: var miniH=kdocument.getElementById('miniHeader');
        if(miniH){miniH.parentNode.removeChild(miniH);}
}}

function Enodia(aLink, aText){
    var aUL = kdocument.createElement('UL');
    var aLI = kdocument.createElement('LI');
    var kpop = kdocument.createElement('A');
    aUL.appendChild(aLI);
    aLI.appendChild(kpop);

    aUL.className = 'right-boxminichat-list';
    aUL.id = 'miniHeader';
    kpop.href = aLink;
    kpop.target ='_blank';
    kpop.style.textAlign = "center";
    kpop.innerHTML = aText;

    var lilist = kdocument.querySelector('#minichat').parentNode;
    lilist.insertBefore(aUL, lilist.firstElementChild);
}

//+------------Hécate Maxichat--------------+

function Soteira(){
//---variables générales
var mc=kdocument.getElementById('minichat');
var mcp=kdocument.getElementById('minichat').parentNode;
var mcpp=kdocument.getElementById('minichat').parentNode.parentNode;

kdocument.getElementById('right-img').style.zIndex=-1;

//---suppression de la barre de défilement
if(navigator.userAgent.includes('Firefox')){
    mcp.style.scrollbarWidth = 'none';
    mcpp.querySelector('.right-box-message').style.scrollbarWidth = 'none';
}else{
    var wbk=kdocument.createElement('STYLE');
    wbk.type="text/css";
    wbk.innerHTML=('.mcbox::-webkit-scrollbar{display:none;} .right-box-message::-webkit-scrollbar{display:none;}')
    mcpp.appendChild(wbk);
}

//---Retrait du nom grisé
var greyInput=kdocument.querySelector('.fl');
greyInput.parentNode.removeChild(greyInput);

//---taille du minichat
var minichatSize = parseInt(param.minichatSize);
Indalimos(minichatSize);

//---Mise en span du mini-Header
var mTitle=kdocument.querySelector('#right .right-box-header');
mTitle.id="mTitle";
mTitle.innerHTML="";
let mhspan=kdocument.createElement('SPAN');
mTitle.appendChild(mhspan);

//---sélection Header
var topHead=kdocument.getElementById('header');

//---couleur de fond du minichat selon l'interface
switch(csstyle){
    //- thème kraland
  case 0:
        setBgColor(mcp,'#F5F2F8');
        setButton('123px','16px', '14px');
        kdocument.querySelector('#right textarea').style.width='122px';
        //- setbox
        mcpp.style.backgroundColor="#FFFFFF";
        mcpp.style.width = '125px';
        mcpp.style.paddingLeft = '5px';
        mcpp.style.marginLeft = '10px';
        mcpp.style.boxShadow='2px 2px 2px #3B0D0E';
        //- header
        headerBgImg(kdocument.body);
        //-mTitle
        kdocument.querySelector('#right .right-box-header').style.padding='15px 0px 7px 7px';
        Kleidukos("20px","#595959");
        setpForm("3px 0px 0px -2px");
  break;

  //- thème médiéval
  case 1: setBgImg(mcpp);
        mcpp.style.width='129px';
        mcpp.style.borderLeft='4px ridge grey';
        mcpp.style.borderBottom='4px groove grey';
        mcpp.style.borderRight='2px groove grey';
        mcpp.style.borderRadius='0px 0px 9px 9px';
        mcpp.style.paddingLeft = '5px';
        mcpp.style.marginLeft = '5px';
        setButton('118px','12px');
        kdocument.querySelector('#right textarea').style.width='120px';
        Kleidukos("20px","#333333");
  break;

  //- thème gris
  case 2:
        setBgImg(mcp);
        setBgColor(mcp,'#F9F9F9');
        setBgColor(mcpp,'#FFFFFF');
        kdocument.querySelector('#right textarea').style.width='125px';
        //- bordure
        setBox('2px solid #DEDEDE', '131px');
        mcpp.style.paddingLeft = '6px';
        mcpp.style.marginLeft = '5px';
        mcpp.style.borderTop='none';
        mcp.style.borderLeft='2px double #F9F9F9';
        mcp.style.borderRight='4px double #F9F9F9';
        Kleidukos("22px","#595959");
        setpForm("2px 0px 0px -1px");
        //- header
        setBgColor(topHead,'#FFFFFF');
  break;

  //- thème standard
  case 3:
        setBgColor(mcp,"#F9F9F9");
        setBgColor(mcpp, "#F0F1EB");
        setBox('none','128px');
        mcpp.style.paddingLeft = '8px';
        mcpp.style.marginLeft = '6px';
        mcpp.style.borderRight='1px solid #DEDED2';
        mcpp.style.borderLeft='1px solid #DEDED2';
        mcpp.style.borderBottom='1px solid #DEDED2';
        kdocument.querySelector('#right textarea').style.width='128px';
        Kleidukos("22px","#595959");
        setpForm("2px 0px 0px -5px");
  break;

  //- thème Moderne
  case 4: {setBgColor(mcp,'#F5F2F8');
        setBgColor(mcpp, "#FCFBFA");
        mcpp.style.marginLeft='-1px';
        mcpp.style.borderRight='1px solid #C8C8C7';
        mcpp.style.borderLeft='1px solid #C8C8C7';
        mcpp.style.borderBottom='1px solid #C8C8C7';
        kdocument.querySelector('#right textarea').style.width='122px';
        Kleidukos("22px","#595959");
        //-mini-header
        kdocument.querySelector('#right .right-box-header').style.height='20px';
        kdocument.querySelector('#right .right-box-header').style.lineHeight='26px';
        //- header
        topHead.style.padding='0px';
        kdocument.getElementById('framemenu').style.top='65px';
        kdocument.getElementById('header-left').style.margin='12px';
        kdocument.querySelectorAll('#divmenu .menu').forEach(upperm);
        function upperm(subm){subm.style.marginTop='-22px';}
        //-- main
        kdocument.getElementById('central-content').style.marginTop='0px';
        kdocument.getElementById('left').style.paddingTop='0px';
        kdocument.getElementById('right').style.paddingTop='0px';
        kdocument.getElementById('right').style.overflow='visible';
  break;}

  default: setBgColor(mcp,'#F5F2F8');
}

//---image de fond minichat
function setBgImg(aNode){
    var bgleft = kdocument.getElementById('left');
    var bgimg = window.getComputedStyle(bgleft).backgroundImage;
    aNode.style.backgroundImage=bgimg;
    aNode.style.backgroundRepeat='repeat-y';
}

//---image de fond header
function headerBgImg(aNode){
    let topHead=kdocument.getElementById('header');
    var bgimg = window.getComputedStyle(aNode).backgroundImage;
    topHead.style.backgroundImage=bgimg;
    topHead.style.backgroundRepeat='repeat-x';
}

//---ajustement des boutons
function setButton(w, h, s){
    var rfb=kdocument.querySelectorAll('#right .right-box-button img');
    rfb.forEach(imgBorder);
    function imgBorder(bimg){
        bimg.style.height=s;
        bimg.style.width=s;
    }
    var rfp=kdocument.querySelector('#right .right-box-button').parentNode;
    rfp.style.width=w;
    rfp.style.height=h;
}

//---mise en forme du cadre
function setBox(bparam, rbSize){
    mcpp.style.width = rbSize;
    mcpp.style.border = bparam;
}}

//--- <li><a>color Kraland
function aColor(oneColor){
    kdocument.getElementById('minichat').querySelectorAll('A').forEach(lColor);
    function lColor(alink){alink.style.color=oneColor;}
}

//---couleur de fond
function setBgColor(aNode,aColor){
  aNode.style.backgroundColor=aColor;
}

//---<li>title Moderne
function lititle(){
    var ali=kdocument.querySelectorAll('#right .right-box-title');
    ali[0].style.height='5px';
    ali[0].style.lineHeight='5px';
    ali[0].style.margin='0px';
    for(let i=1;i<ali.length;i++){
        ali[i].style.height='5px';
        ali[i].style.lineHeight='5px';
        ali[i].style.margin='5px 0px 0px 0px';
    }
}

//---<li><a>rp Moderne
function lirp(ULchat){
    var alirp=ULchat.querySelectorAll('li');
    for(let i=0;i<alirp.length;i++){
        alirp[i].style.padding='0px 3px 2px 3px';
    }
}

function setpForm(marginSizes){
    //--- p formulaire
    let formp=kdocument.getElementsByName('minichatform')[0].querySelectorAll('p');
    if(formp!=null){for(let i=0;i<formp.length;i++){formp[i].style.margin=marginSizes;}}
}

//--- réglage taille minichat
function Indalimos(nmSize){
    var mc=kdocument.getElementById('minichat');
    var mcp=kdocument.getElementById('minichat').parentNode;
    var mcpp=kdocument.getElementById('minichat').parentNode.parentNode;

    if(param.hecateTV!="" && initp!=undefined){
        nmSize-=initp[1];
        nmSize-=initp[6];
    }
    if(nmSize<210){nmSize=210;}
    let logz=nmSize-67;
    if(csstyle==1){logz+=4;}

    var theMaxHeight = logz.toString()+"px";
    mcp.style.maxHeight = theMaxHeight;
    mc.style.maxHeight = theMaxHeight;

    var theHeight = logz.toString()+"px";
    mcp.style.height = theHeight;
    mc.style.height = theHeight;

    mcpp.style.maxHeight=nmSize+'px';
    mcpp.style.height=nmSize+'px';
}

//+------------ Epingler les menus ---------------+
function Aenaos(){
if(param.pinup){
//---Epingler des menus
    let topd=kdocument.querySelector('#header').getBoundingClientRect().top;
    let rightd=kdocument.getElementById('right').getBoundingClientRect().top;
    let aMargin=rightd-topd;
    kdocument.getElementById('right').style.top=aMargin+'px';
    kdocument.getElementById('left').style.top=aMargin+'px';

    kdocument.getElementById('header').style.position='fixed';
    kdocument.getElementById('framemenu').style.position='fixed';
    kdocument.getElementById('right').style.position='fixed';
    kdocument.getElementById('left').style.position='fixed';
    kdocument.getElementById('divmenu').style.position='fixed';

    kdocument.getElementById('divmenu').style.zIndex='4';
    kdocument.getElementById('header').style.zIndex='4';
    kdocument.getElementById('framemenu').style.zIndex='4';

    if(param.hecateTV!=''){
        Propylaia();
        kdocument.removeEventListener("scroll", Propylaia);
    }
}else{
    kdocument.getElementById('header').style.position='absolute';
    kdocument.getElementById('framemenu').style.position='absolute';
    kdocument.getElementById('divmenu').style.position='absolute';
    kdocument.getElementById('right').style.position='absolute';
    kdocument.getElementById('left').style.position='absolute';
    kdocument.getElementById('right').style.top='0px';
    kdocument.getElementById('left').style.top='0px';

    if(param.hecateTV!=''){
        Propylaia();
        kdocument.addEventListener("scroll", Propylaia);
    }
}}

//+------------ New Buttons ---------------+
function Kleidukos(fSize,color){
    var mchatform = kdocument.getElementsByName('minichatform')[0];
    mchatform.setAttribute('id','mchatf');
    mchatform.querySelector('.right-box-button').setAttribute('id','mrefresh');
    mchatform.querySelector('.right-box-button').setAttribute('title','actualiser');
    mchatform.getElementsByClassName('right-box-button')[1].setAttribute('id','msend');
    mchatform.getElementsByClassName('right-box-button')[1].setAttribute('title','envoyer');
    mchatform.querySelectorAll('.right-box-button').forEach(removeOnc);
    function removeOnc(item){
        item.style.cursor="pointer";
        item.removeAttribute("onclick");
    }

    var lbutton = kdocument.createElement("BUTTON");
    lbutton.setAttribute('id','loadc');
    lbutton.setAttribute('class','new-box-button');
    lbutton.setAttribute('type','button');
    lbutton.setAttribute('title',"charger l'archive");
    lbutton.innerHTML="↶";
    lbutton.style.lineHeight="7px";

    var smenu = kdocument.createElement("BUTTON");
    smenu.setAttribute('id','bmenu');
    smenu.setAttribute('class','new-box-button');
    smenu.setAttribute('type','button');
    smenu.setAttribute('title','options');
    smenu.innerHTML="≡";
    smenu.style.lineHeight="12px";
    smenu.addEventListener('click',Enitharmon,false);

    var sbutton = kdocument.createElement("BUTTON");
    sbutton.setAttribute('id','sbutton');
    sbutton.setAttribute('class','new-box-button');
    sbutton.setAttribute('type','button');
    sbutton.innerHTML="🗗";
    sbutton.style.lineHeight="12px";
    sbutton.addEventListener('click',Phosphoros,false);

    mchatform.querySelectorAll('p')[1].style.textAlign='right';
    mchatform.querySelectorAll('p')[1].appendChild(lbutton);
    mchatform.querySelectorAll('p')[1].appendChild(sbutton);
    mchatform.querySelectorAll('p')[1].appendChild(smenu);

    mchatform.querySelectorAll('.new-box-button').forEach(cssb);
    function cssb(item){
        item.style.display='table-cell';
        item.style.padding='0px';
        item.style.fontSize=fSize;
        item.style.verticalAlign="top";
        item.style.color=color;
        item.style.marginLeft='2px';
        item.style.marginRight='2px';
        item.style.cursor="pointer";
    }
}

function sendMsgChat(){
  var msgArea = kdocument.querySelector('#right .right-box-message');
  if(msgArea.value!=""){
      var requested;
      var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      requested = this.responseText;
    }};

      var msgUrl = "minichat.php?p1=" + encodeURIComponent(msgArea.name) + "&message=" + encodeURIComponent(msgArea.value);
      xhttp.open("GET", msgUrl, true);
      xhttp.overrideMimeType('text/html');
      xhttp.send(null);
    }
    msgArea.value = "";
    HecateOnclick();
}

//+------------ Hécate Blacklist --------------+
function Atropaia(){
//---filtre basique mini-chat
let i;
for(i=0;i<param.blacklist.length;i++){
    var dalist = kdocument.getElementById('minichat').getElementsByTagName('A');
    let j = dalist.length;
    while(j--){
        var orilink = dalist[j].getAttribute('href');
        if((orilink==param.blacklist[i] && orilink!=null) || (orilink==null && !param.anonymes && dalist[j].id!="return")){
            var first=dalist[j].parentNode.nextSibling;
            var second=dalist[j].parentNode;
            first.parentNode.removeChild(first);
            second.parentNode.removeChild(second);
        }
    }
}

//---filtre archives mini-chat
var anelement=kdocument.getElementById('central-text').firstElementChild.nextSibling;
if(anelement.innerHTML=="Archives du Mini-Chat"){
    let dalogs= kdocument.getElementById('central-text').getElementsByTagName('TR');
    let k = dalogs.length;
    while(k--){
      if(dalogs[k].firstElementChild.tagName!="TH"){
          var urLink=dalogs[k].children[1].getElementsByTagName('A')[0];
          if((typeof urLink !== 'undefined' && param.blacklist.includes(urLink.getAttribute('href'))) || (typeof urLink == 'undefined' && !param.anonymes)){
              dalogs[k].parentNode.removeChild(dalogs[k]);
          }
      }}
}}

//+------------ Hécate Reloaded ---------------+
function Hecate(){
    sessionStorage.removeItem('mcount');
  var nbMsg=20;
  if(typeof(sessionStorage.lilogs)=='undefined'){
      loadChat(nbMsg);
      Chthonia(nbMsg);
  }else{
      Chthonia(nbMsg);
      idTimeout=setTimeout(function(){loadChat(nbMsg);Chthonia(nbMsg);}, 5000);
  }
}

function HecateOnclick(){
    sessionStorage.removeItem('mcount');

    var nbMsg=20;
    loadChat(nbMsg);
    Chthonia(nbMsg);
}

function Propolos(){
    var nbMsg;
    if(sessionStorage.mcount){
        nbMsg=Number(sessionStorage.mcount)+20;
    }else{
      nbMsg=40;
    }
    sessionStorage.mcount=nbMsg;
    var lilines=JSON.parse(sessionStorage.lilogs);
    if(lilines.length<nbMsg){
        loadChat(nbMsg);
    }
    Chthonia(nbMsg);
}

//--- Assemble et injecte les logs
function Chthonia(nbMsg){
    var lilines=JSON.parse(sessionStorage.lilogs);
    var dachat=[];
    for(let i=0;i<nbMsg;i++){
        dachat[i]=lilines[i];
    }

    dachat.unshift('<li class="right-box-title" id="mtop">'+sessionStorage.lastd+'</li>');
    dachat.push('<li class="note" id="mbottom"><a id="return">⇞ revenir au début</a></li><li class="note">Hécate Minichat Plus 4.0</li>');
    var ULchat=kdocument.querySelector('#minichat UL');
    ULchat.innerHTML=dachat.join('');

  //---<li>title moderne
    if(csstyle==4){lititle();}
    if(csstyle==0){aColor('#FFFFFF');}
  //---
    Ariane();
}

//--- Remplace le lien Archives
function Ariane(){
  var anA=kdocument.querySelector('#mbottom');
    anA.addEventListener('click',arTop,false);
    anA.style.cursor='pointer';
  function arTop(){
    var lilist = kdocument.querySelector('#minichat').parentNode;
      lilist.scrollTop=0;
  }
}

//+------------Récup des archives---------------+
function loadChat(nb){
    sessionStorage.removeItem('lilogs');
    var mArchives=loadPage('http://www.kraland.org/main.php?p=6_6');
    var aLast=parseInt(mArchives.querySelector('#central-text P A.forum-selpage').innerHTML);
    //--- récupération de lastd
    var allD=mArchives.querySelectorAll('#central-text TH.c');
    let fd=allD.length-1;
    sessionStorage.lastd=allD[fd].innerHTML;

    //---charge la première page
    var mLogs=mArchives.querySelectorAll('#central-text TR');
    var FDatas=mFilter(mLogs);
    mLogs=FDatas[0];
    var t=FDatas[1];
    //---charge de nouvelles pages
    if(t<nb){
        var n=1;
        while(t<nb){
            let p=aLast-n;
            if(p<1){break;}
            let address=mURL(p);
            mArchives=loadPage(address);
            var newLogs=mArchives.querySelectorAll('#central-text TR');
            FDatas=mFilter(newLogs);
            newLogs=FDatas[0];
            t=t+FDatas[1];
            mLogs=mLogs.concat(newLogs);
            n++;
        }}

    mLogs.forEach(parseToLi);
    function parseToLi(item,index,arr){
        if(!param.smSize){item.querySelectorAll('img').forEach(cssimg);
        function cssimg(animg){
            animg.width=12;
            animg.height=12;
            animg.border=0;
            animg.align='middle';
        }}

        if(item.firstElementChild.tagName!='TH'){
            var dualTD=item.querySelectorAll('TD');
            var lheure='<span class="hour">&nbsp;'+dualTD[1].innerHTML.match(/\([0-2][0-9]\:[0-5][0-9]\)/i)+'</span> ';
            dualTD[1].innerHTML=dualTD[1].innerHTML.replace(/\([0-2][0-9]\:[0-5][0-9]\)/i,"");

            var fprofil=lheure+dualTD[1].querySelector('A').innerHTML;
            dualTD[1].querySelector('A').innerHTML=fprofil;
            arr[index]='<li>'+dualTD[1].innerHTML+'</li><li>'+dualTD[2].innerHTML+'</li>';
      }else{
          arr[index]='<li class="right-box-title">'+item.querySelector('TH.c').innerHTML+'</li>';
      }
  }
    sessionStorage.setItem("lilogs", JSON.stringify(mLogs));
    return mLogs;
}

//---Filtre
function mFilter(TrNodes){
    //var TrList=Array.prototype.slice.call(TrNodes);
    var TrList=Array.from(TrNodes);
    TrList.reverse();
    var k = TrList.length;
    var countTh=0;
    var cached;
    while(k--){
        if(TrList[k].firstElementChild.tagName!="TH"){
            var urLink=TrList[k].children[1].getElementsByTagName('A')[0];
            if((typeof urLink !== 'undefined' && param.blacklist.includes(urLink.getAttribute('href'))) || (typeof urLink == 'undefined' && !param.anonymes)){
                TrList.splice(k,1);
            }else if(typeof urLink == 'undefined' && param.anonymes){
                TrList[k].children[1].innerHTML="<a>"+TrList[k].children[1].innerHTML+"</a>";
            }
        }else{
            if(countTh==0){
                cached=TrList[k].querySelector('TH.c').innerHTML
            }else{
                let secondCache=TrList[k].querySelector('TH.c').innerHTML;
                TrList[k].querySelector('TH.c').innerHTML=cached;
                cached=secondCache;
            }
            countTh++;
        }}
    k=TrList.length;
    var t=k-countTh;
    TrList.pop();

    var TrDatas=[TrList,t];
    return TrDatas;
}

//---GET request
function loadPage(theURL){
    var requested;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      requested = this.responseText;
    }
  };
  xhttp.open("GET", theURL, false);
  xhttp.overrideMimeType('text/html; charset=iso-8859-1');
  xhttp.withCredentials;
  xhttp.send(null);

    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(requested, "text/html");
    return htmlDoc;
}

//---Convertis en url des archives
function mURL(n){
    let aLink='http://www.kraland.org/main.php?p=6_6_0_'+n;
    return aLink;
}

//+------------ Switch to Report ---------------+
function Phosphoros(){
    var mp=kdocument.getElementById('minichat');
    //var rStatus=kdocument.querySelector('#report');
    if(param.hecateTV!=""){
        kdocument.querySelector('#yVolume').parentNode.style.display="none";
        setTimeout(function(){Trimorphe(3);}, 1000);}
    clearTimeout(idTimeout);
    if(param.isreport){
        kdocument.getElementById('msend').removeEventListener('click',Omilia,false);
        kdocument.getElementById('mrefresh').removeEventListener('click',PerseisLite,false);
        kdocument.getElementById('loadc').removeEventListener('click',Skotia,false);
        kdocument.getElementById('loadc').removeEventListener("dblclick", function(){location.href="http://www.kraland.org/report.php?p2=2";},false);

        Trimorphe(0);
        param.isreport=false;
        kdocument.getElementById('loadc').addEventListener('click',Propolos,false);
        kdocument.getElementById('loadc').addEventListener("dblclick", function(){location.href="http://www.kraland.org/main.php?p=6_6";},false);
        HecateOnclick();
        kdocument.getElementById('msend').addEventListener('click',sendMsgChat,false);
        kdocument.getElementById('mrefresh').addEventListener('click',HecateOnclick,false);
        kdocument.getElementById('sbutton').setAttribute('title','rapport privé');
    }else{
        kdocument.getElementById('msend').removeEventListener('click',sendMsgChat,false);
        kdocument.getElementById('loadc').removeEventListener('click',Propolos,false);
        kdocument.getElementById('loadc').removeEventListener("dblclick", function(){location.href="http://www.kraland.org/main.php?p=6_6";},false);
        kdocument.getElementById('mrefresh').removeEventListener('click',HecateOnclick,false);

        Trimorphe(1);
        param.isreport=true;
        kdocument.getElementById('loadc').addEventListener('click',Skotia,false);
        kdocument.getElementById('loadc').addEventListener("dblclick", function(){location.href="http://www.kraland.org/report.php?p2=2";},false);
        Perseis(0);
        kdocument.getElementById('msend').addEventListener('click',Omilia,false);
        kdocument.getElementById('mrefresh').addEventListener('click',PerseisLite,false);
        kdocument.getElementById('sbutton').setAttribute('title','minichat');
    }
    localStorage.hecateparam=JSON.stringify(param);
}

function PhosphorosLite(){
    Atropaia();
    //var rStatus=kdocument.querySelector('#report');
    if(param.isreport){
        Trimorphe(1);
        kdocument.getElementById('loadc').addEventListener('click',Skotia,false);
        kdocument.getElementById('loadc').addEventListener("dblclick", function(){location.href="http://www.kraland.org/report.php?p2=2";},false);
        Circe();
        kdocument.getElementById('msend').addEventListener('click',Omilia,false);
        kdocument.getElementById('mrefresh').addEventListener('click',PerseisLite,false);
        kdocument.getElementById('sbutton').setAttribute('title','minichat');
    }else{
        Trimorphe(0);
        kdocument.getElementById('loadc').addEventListener('click',Propolos,false);
        kdocument.getElementById('loadc').addEventListener("dblclick", function(){location.href="http://www.kraland.org/main.php?p=6_6";},false);
        Hecate();
        kdocument.getElementById('msend').addEventListener('click',sendMsgChat,false);
        kdocument.getElementById('mrefresh').addEventListener('click',HecateOnclick,false);
        kdocument.getElementById('sbutton').setAttribute('title','rapport privé');
    }
}

function Trimorphe(aTitle){
    var mTitle=kdocument.querySelector('#right .right-box-header');
    var sTitle=mTitle.querySelector('SPAN');
    var nTitle;
    switch(aTitle){
        case 0 : nTitle="MINI-CHAT";
            sTitle.textContent=nTitle;
            sTitle.style.display="inline";
            break;
        case 1 :
            nTitle="Rapport Privé";
            if(csstyle==3){nTitle="RAPPORT";}
            sTitle.textContent=nTitle;
            sTitle.style.display="inline";
            break;
        case 2 :
            sTitle.style.display="none";
            EnodiaCtrl(mTitle);
            break;
        case 3 :
            sTitle.style.display="none";
            kdocument.querySelector('#yVolume').parentNode.style.display="inline";
            break;
        default: return;
    }
}

//+------------ Injection du rapport privé ---------------+
function Perseis(n){
    var rArchive=loadPage('http://www.kraland.org/report.php?p2='+n);
    let oneURL=rArchive.querySelectorAll(".on")[0].firstChild.getAttribute("href");
    param.playerId=oneURL.replace("report.php?p=0&p1=","");

    //--- traitement image
    var allImg=rArchive.getElementsByTagName('IMG');
    for(let i=0;i<allImg.length;i++){
        allImg[i].style.maxWidth='130px';
    }

    //--- filtre et préparation à la mise en forme
    var actionList=rArchive.querySelectorAll('#report .forum')[0].getElementsByTagName('TR');
    for(var j=0;j<actionList.length;j++){
        var action=actionList[j].getElementsByTagName('TD')[1].innerHTML;

        //--- filtres
        /* rfilters */

        //--- traitement texte
        var theAction=" "+action;
        var remain=null;
        if(action.indexOf(" : ")>0){
            action=action.split(" : ");
            theAction=" "+action.shift()+" : ";
            remain=action.join(" : ");
        }
        actionList[j].getElementsByTagName('TD')[0].innerHTML+=theAction;
        actionList[j].getElementsByTagName('TD')[1].innerHTML=remain;
    }

    var aLogs=Array.from(actionList);
    aLogs.forEach(parseToLi);
    function parseToLi(item,index,arr){
        var descrp=item.getElementsByTagName('TD')[0];
        var acting=item.getElementsByTagName('TD')[1];
        arr[index]='<li><a class="rp">'+descrp.innerHTML+'</a></li><li>'+acting.innerHTML+'</li>';
    }
    //--- formatage
    aLogs.push('<li class="note" id="mbottom"><a id="return">⇞ revenir au début</a></li><li class="note">Hécate Minichat Plus 4.0</li>');
    var ULchat=kdocument.querySelector('#minichat UL');
    ULchat.innerHTML=aLogs.join('');
    sessionStorage.setItem("rlilogs", JSON.stringify(aLogs));
    Ariane();
    //---kraland & moderne
    if(csstyle==0){aColor('#F5F2F8');}
    if(csstyle==4){lirp(ULchat);}
}

//--- Récupération du rapport étendu
function Skotia(){
    Perseis(1);
    kdocument.getElementById('loadc').addEventListener('click',SkotiaPlus,false);
}

function SkotiaPlus(){
    Perseis(2);
}

function PerseisLite(){
    Perseis(0);
}

//--- Rapport en cache
function Circe(){
  if(typeof(sessionStorage.rlilogs)=='undefined'){
      Perseis(0);
  }else{
      var aLogs=JSON.parse(sessionStorage.getItem("rlilogs"));
      var ULchat=kdocument.querySelector('#minichat UL');
      ULchat.innerHTML=aLogs.join('');
      Ariane();
      idTimeout=setTimeout(function(){Perseis(0);}, 2000);
      if(csstyle==0){aColor('#F5F2F8');}
      if(csstyle==4){lirp(ULchat);}
  }
}

//+------------ S'adresser à tous ---------------+

//--- Envoi du message
function Omilia(){
    let hfFrame=kdocument.createElement('iframe');
    hfFrame.id='hfframe';
    hfFrame.name='hfframe';
    hfFrame.style.display='none';
    kdocument.body.appendChild(hfFrame);

    let hiddenForm=kdocument.createElement('form');
    hiddenForm.style.display='none';
    hiddenForm.name='order300204';
    hiddenForm.id='hFid';
    hiddenForm.action='main.php';
    hiddenForm.method="POST";

    var cBlock=kdocument.getElementById("central-text");
    var seDepLink=cBlock.querySelector('a[href="main.php?p=2_2"]');
    if(seDepLink==null){
        hiddenForm.target='hfframe';
    }else if(seDepLink.parentNode.className!="on"){
        hiddenForm.target='hfframe';
    }
    kdocument.body.appendChild(hiddenForm);

    function addHiddenField(name, value) {
        let input=kdocument.createElement('input');
        input.type='hidden';
        input.name=name;
        input.value=value;
        hiddenForm.appendChild(input);
    }

    let oParam = tha();
    let t = oParam[0];
    let n = oParam[1];
    let p2 = oParam[2];
    let p = '2_2';
    let msgArea = kdocument.querySelector('#right .right-box-message');
    let msg = msgArea.value;

    addHiddenField('p', p);
    addHiddenField('a', 1);
    addHiddenField('t', t);
    addHiddenField('n', n);
    addHiddenField('p1', 300204);
    addHiddenField('p2', p2);
    addHiddenField('p3', 2);
    addHiddenField('message', msg);
    addHiddenField('p12', 1);

    hiddenForm.submit();

    msgArea.value = "";
    Perseis(0);
    hfFrame.remove();
    hiddenForm.remove();
}

//--- Récupération des données
function tha(){
    let leftf=loadPage('http://www.kraland.org/main.php?p=2_2');
    var mygroup=leftf.querySelector('.thb').querySelector('a[href^="order.php?p1=3002&p2="]');
    if(!mygroup){ mygroup=leftf.querySelectorAll('.thb')[1].querySelector('a[href^="order.php?p1=3002&p2="]');}
    var mygid=mygroup.href.replace("http://www.kraland.org/order.php?p1=3002&p2=","");
    var PageOrders=loadPage(mygroup.href);
    var oParam=[];
    oParam[0]=PageOrders.getElementById("order300204").querySelector("input[name='t']").value;
    oParam[1]=PageOrders.getElementById("order300204").querySelector("input[name='n']").value;
    oParam[2]=mygid;
    return oParam;
}

//+------------ Options Minichat ---------------+
function opReset(){
    var ytid=null;
    if(isValidHttpUrl(HecateMyTV)){
        let ytparams = new URL(HecateMyTV).searchParams;
        ytid = ytparams.get('list');
    }
    if(ytid!=null){
        param.hecateMyTV = ytid;
    }else if(ytid==null){
        param.hecateMyTV = '';
    }

    param = {
        nameList: Object.assign({}, Blacklist),
        anonymes: Anonymes,
        minichatSize : tailleMinichat,
        smSize: SmileysNormaux,
        hecatePlus: HecatePlus,
        hecateTV: HecateTV,
        hecateMyTV: ytid,
        pinup: EpinglerLesMenus,
        isreport: param.isreport,
        //rfilter: param.filter
    };

  //--- mise en forme des IDs
    var provList=[];
    for(var anid in param.nameList){
        if(!provList.includes("main.php?p=6_1&p1="+anid)){
            provList.push("main.php?p=6_1&p1="+anid);
    }}
    param.blacklist=provList;
  //--- sauvegarder
  localStorage.hecateparam=JSON.stringify(param);
}

function Enitharmon(){
    var mp=kdocument.getElementById('minichat');
    var EniStatus=kdocument.querySelector('#opBoard');

  if(EniStatus){
    mp.innerHTML='<div word-wrap: break-word;><ul class="right-boxminichat-list"></ul></div>';
    if(param.isreport){Perseis(0);}else{HecateOnclick();}
  }else{
    var lilines=mp.innerHTML;
    mp.innerHTML=opBoard();

      var opm=kdocument.getElementById('opBoard');
      opm.style.textAlign='left';
      opm.style.fontSize='9px';
      opm.style.height='274px';
      opm.style.paddingLeft='5px';
      opm.style.paddingTop='10px';
      opm.style.paddingBottom='10px';
      opm.scrollTo(0,opm.scrollHeight);

      opm.querySelector('#rbutton').addEventListener('click',opResetM,false);
      opm.querySelector('#mSz').addEventListener('input',LampadephorosLite,false);
      opm.addEventListener('submit',opValidate,false);

    //--- fréquentations du minichat
      var parser = new DOMParser();
      lilines = parser.parseFromString(lilines, "text/html");
      var pLink = lilines.querySelectorAll('a[href*="main.php?p=6_1&p1="]');
      var pList={};
      for(var i=0; i<pLink.length; i++){
          pLink[i].removeChild(pLink[i].firstChild);
          var oneID=pLink[i].href.replace('http://www.kraland.org/main.php?p=6_1&p1=','');
          if(!(oneID in pList)){pList[oneID]=pLink[i].innerHTML;}
      }
      var pSelect='<option value="" selected></option>';
      for(var Id in pList){
          pSelect+='<option value="'+Id+'">'+pList[Id]+'</option>';
      }
      kdocument.getElementById('ablist').innerHTML=pSelect;

      opSetValue();
  }

  function opBoard(){
        var Bform=`<form id="opBoard">HécateTV :<br>
         <select id="opHTV">
                <option value="">Aucune</option>
                  <option value="kpopTV">kpop</option>
                  <option value="RyckoHubTV">RyckoHub</option>
                  <option value="PandiPandaTV">Pandi Panda</option>
                  <option value="myTV">MyTV</option>
         </select><br><input type="text" id="urlTV" placeholder="URL de la playlist">
         <br><br>Entête :<br>
         <select id="opHPlus">
                <option value="">Aucun</option>
                  <option value="kpop">kpop</option>
                  <option value="RyckoHub">RyckoHub</option>
                  <option value="PandiPanda">Pandi Panda</option>
        </select><br><br>Taille Minichat :<br>
                <input type="number" id="mSz" title="Taille du minichat en px" placeholder=""><br>
                <input type="checkbox" id="smileySz"><label for="smileySz">Smileys normaux</label><br>
                <input type="checkbox" id="bPinup"><label for="bPinup">Epingler les menus</label><br>
                <input type="checkbox" id="bNymes"><label for="bNymes">Anonymes</label><br>
        <br>
        Retirer de la blacklist :
        <select id="rblist">

        </select><br>
                Ajouter à la blacklist :
        <select id="ablist">

        </select><br><br>
        <input type="submit" value="Valider" id="vbutton"> <input type="button" value="Reset" id="rbutton">
      </form>
            <style>#opBoard input{height:auto; Max-Width:114px;}
             #opBoard select{width:120px;}
            </style>`;

    return Bform;
  }
}

//---wysiwyg taille du minichat
function LampadephorosLite(){
    let nmSize=Lampadephoros();
    Indalimos(nmSize);
}
function Lampadephoros(){
    let nszv=kdocument.getElementById('mSz').value;
    var nmSize = parseInt(nszv);
    // hauteur du minichat en pixels.

    //--first check
    if(nmSize == null || nmSize == "" || !Number.isInteger(nmSize)){
        nmSize=parseInt(tailleMinichat);
    }

    let mcpp=kdocument.getElementById('minichat').parentNode.parentNode;
    var botspace = window.innerHeight+kdocument.querySelector('#header').getBoundingClientRect().top-mcpp.getBoundingClientRect().top;
    if(param.hecateTV!="" && initp!=undefined){
        botspace+=initp[1];
        botspace+=initp[6];
    }

    var edges=mcpp.offsetHeight-mcpp.clientHeight;
    var fmcSize=nmSize+edges;
    if(fmcSize>botspace){
        nmSize=botspace-edges;
    }

    //--mini check
    if(nmSize<210){nmSize=210}
    nmSize=Math.round(nmSize);
    return nmSize;
}

function isValidHttpUrl(string){
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        //return url.protocol === "http:" || url.protocol === "https:";
        return true;
}

function opResetM(){
    var exHTV=param.hecateTV;
    var miniH=kdocument.getElementById('miniHeader');
    if(miniH){miniH.parentNode.removeChild(miniH);}
    opReset();
    opSetValue();
    HecateOurania();
    if(param.hecateTV!=exHTV){
        window.location.reload();
    }
}

function opValidate(){
    event.preventDefault();
    param.minichatSize = Lampadephoros();
    var exHTV=param.hecateTV;
    var exList=param.hecateMyTV;
    var nowHTV=kdocument.getElementById('opHTV').value;
    param.hecateTV = nowHTV;
    param.hecatePlus = kdocument.getElementById('opHPlus').value;
    param.smSize = kdocument.getElementById('smileySz').checked;
    param.pinup = kdocument.getElementById('bPinup').checked;
    param.anonymes = kdocument.getElementById('bNymes').checked;

    //---myTV
    let ytURL = kdocument.getElementById('urlTV').value;
    var ytid=null;
    if(isValidHttpUrl(ytURL)){
        let ytparams = new URL(ytURL).searchParams;
        ytid = ytparams.get('list');
    }
    if(ytid!=null){
        param.hecateMyTV = ytid;
    }else if(ytid==null && ytURL!=exList){
        param.hecateMyTV = '';
    }

    //--- black list
    var removeB=kdocument.getElementById('rblist');
    if(removeB.value!=""){
        delete param.nameList[removeB.value];
      var index = param.blacklist.indexOf("main.php?p=6_1&p1="+removeB.value);
        if(index > -1) {param.blacklist.splice(index, 1);}
        removeB.remove(removeB.selectedIndex);
    }

    var addN=kdocument.getElementById('ablist');
    if(addN.value!=""){
      param.blacklist.push('main.php?p=6_1&p1='+addN.value);
      if(!(addN.value in param.nameList)){param.nameList[addN.value]=readText('ablist');}
      addN.remove(addN.selectedIndex);
    }
    opSetValue();
    //--- sauvegarder
    localStorage.hecateparam=JSON.stringify(param);

    var miniH=kdocument.getElementById('miniHeader');
    if(miniH){miniH.parentNode.removeChild(miniH);}
    EnoDisplay();

    if(nowHTV!=exHTV){
        //param.hecatePlus=kdocument.getElementById('opHTV').value.replace('TV','');
        window.location.reload();
    }else if(ytid!=null && ytURL!=exList){
        window.location.reload();
    }
    Atropaia();
    Aenaos();
}

function readText(anID){
    var o=kdocument.getElementById(anID);
    var txt= o.options[o.selectedIndex].text;
    return txt;
}

function opSetValue(){
    kdocument.getElementById('opHTV').value = param.hecateTV;
    kdocument.getElementById('opHPlus').value = param.hecatePlus;
    kdocument.getElementById('smileySz').checked = param.smSize;
    kdocument.getElementById('bPinup').checked = param.pinup;
    kdocument.getElementById('bNymes').checked = param.anonymes;
    kdocument.getElementById('mSz').placeholder=tailleMinichat;
    kdocument.getElementById('urlTV').value=param.hecateMyTV;
    if(param.minichatSize!=tailleMinichat){
        kdocument.getElementById('mSz').value=param.minichatSize;
    }

    //--- blacklist
    var dropNames='<option value="" selected></option>';
    for(var idName in param.nameList){
      dropNames+='<option value="'+idName+'">'+param.nameList[idName]+'</option>';
    }
    kdocument.getElementById('rblist').innerHTML=dropNames;
}

//+------------ Hecate Media Player --------------+

function HecateMedia(playlistId){
if(document.getElementById('krabox')==null){
    //---Installation de KI dans iframe
    document.body.innerHTML='';
    document.head.innerHTML=`<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <style type="text/css">body{overflow:hidden;}</style>`;

    var krabox=document.createElement('IFRAME');
    krabox.id="krabox";
    krabox.src=(window.location.href);
    krabox.style.width="100%";
    krabox.style.height="100%";
    krabox.style.position='absolute';
    krabox.style.border='none';
    krabox.style.zIndex="1";
    krabox.frameBorder="0";
    krabox.display="block";

    document.body.style.width='100%';
    document.body.style.height='100%';
    document.body.style.margin='0px';
    document.body.style.padding='0px';
    document.body.appendChild(krabox);

    //--- boot des fonctions Hécate
    document.querySelector("#krabox").addEventListener("load", function() {
        //--- Global frame variable
        kdocument=document.getElementById('krabox').contentDocument;
        csstyle=parseInt(kdocument.head.querySelector('link').href.split('/')[4]);
        var stateObj = { foo: "bar" };
        history.replaceState(stateObj, kdocument.title, document.getElementById('krabox').contentWindow.location.href);

            //--- gestion des styles
        switch(csstyle){
            //- thème kraland
            case 0: initp=[247,55,10,130,73,0,0];
                break;

                //- thème médiéval
            case 1: initp=[262,70,6,138,78,1,5];
                break;

                //- thème gris
            case 2: initp=[258,69,5,140,79,0,0];
                break;

                //- thème standard
            case 3: initp=[260,78,6,138,78,0,7];
                break;

                //- thème Moderne
            case 4: initp=[262,60,10,128,72,0,0];
                break;
            default: ;
        }
        //--- Exécution de Hécate
        Soteira();
        PhosphorosLite();
        Trimorphe(2);
        EnoDisplay();
        if(document.getElementById('player')==null){
            //---Installation du lecteur (new)
            var nPlayer=document.createElement('DIV');
            nPlayer.id="player";
            nPlayer.style.zIndex="10";
            nPlayer.style.position="absolute";

            var divTV=document.createElement('DIV');
            divTV.id="hecateTV";
            divTV.style.width="0px";
            divTV.style.height="0px";
            divTV.style.textAlign="right";
            divTV.style.zIndex="9";
            divTV.appendChild(nPlayer);
            document.body.appendChild(divTV);

            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        if(document.getElementById('yScript')){
            document.getElementById('yScript').remove();
        }
            //--- YT API
            var yScript = document.createElement('script');
            yScript.id="yScript";
            yScript.innerHTML=ytFunctions(playlistId);
            document.head.appendChild(yScript);
                function ytFunctions(ytId){
     var yCode=`
      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
	  function onYouTubePlayerAPIReady() {
        player = new YT.Player('player',
        {
          height: '${initp[4]}',
          width: '${initp[3]}',
          playerVars:
          {
            listType:'playlist',
            list:'${ytId}',
            autoplay:1,
            mute: 1,
            controls:0,
            enablejsapi:1,
            iv_load_policy:3,
            showinfo:0,
            modestbranding:1,
            fs:1,
            cc_load_policy:0
          },
          events: {
            'onReady': onPlayerReady
          }
        });
		}

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        event.target.setLoop(true);
        if(localStorage.getItem('yvValue')){
         let yvv=localStorage.getItem('yvValue');
         event.target.setVolume(yvv);
        }else{event.target.setVolume(50);}
      }

      var krabox=document.getElementById('krabox').contentDocument;
      krabox.getElementById('play').addEventListener('click',popVideo,false);
      function popVideo(){
        if(player.isMuted()){
           player.unMute();
        }else{
           let pStatus=player.getPlayerState();
           if(pStatus!=1){player.playVideo();}else{player.pauseVideo();}
        }
      }

      krabox.getElementById('playLast').addEventListener('click',previousVideo,false);
      function previousVideo(){
        let ranv=sessionStorage.getItem("ranv");
        if(ranv!=1){
          player.previousVideo();
        }else{
          let rnum=Math.floor(Math.random() * player.getPlaylist().length);
          player.playVideoAt(rnum);
         }
      }

      krabox.getElementById('playNext').addEventListener('click',nextVideo,false);
      function nextVideo(){
        let ranv=sessionStorage.getItem("ranv");
        if(ranv!=1){
          player.nextVideo();
        }else{
          let rnum=Math.floor(Math.random() * player.getPlaylist().length);
          player.playVideoAt(rnum);
        }
      }

      krabox.getElementById('goRng').addEventListener('click',shuffle,false);
      sessionStorage.setItem("ranv",0);
      function shuffle(){
        let ranv=sessionStorage.getItem("ranv");
        if(ranv!=1){
          player.setShuffle(true);
          sessionStorage.setItem("ranv",1);

          let rnum=Math.floor(Math.random() * player.getPlaylist().length);
          player.playVideoAt(rnum);

          this.innerHTML="➡&#xFE0E;";
          this.title="mode normal";
        }else{
          player.setShuffle(0);
          sessionStorage.setItem("ranv",false);

          this.innerHTML="<b>⤨&#xFE0E;</b>";
          this.title="mode aléatoire";
      }}


      var yvlm = localStorage.getItem('yvValue');
      var vRange = krabox.getElementById('yVolume');
      if(yvlm){
         setRangeValue(yvlm);
      }else{
         setRangeValue(50);
      }
      function setRangeValue(ytsv){
         vRange.setAttribute("value",ytsv);
         vRange.setAttribute("title",ytsv);
      }

      vRange.addEventListener('input',setVolume,false);
      function setVolume(){
        let yvv = vRange.value;
        player.setVolume(yvv);
        localStorage.setItem('yvValue',yvv);
        vRange.setAttribute("title",yvv);
      }
      vRange.addEventListener('click',function(){player.unMute();},false);
      `;
        return yCode;
    }

    //---repositionnements
        Propylaia();
        kdocument.addEventListener("scroll", Propylaia);
        if(!navigator.userAgent.includes('Firefox')){
            window.addEventListener("resize", Propylaia);
        }
        Aenaos();
    });
}}

//---repositionnements
function Propylaia(){
    var daplyer=document.getElementById('player');
    daplyer.style.width=initp[3]+"px";
    daplyer.style.height=initp[4]+"px";

    var fullmc=kdocument.querySelector('#right .right-bigbox');
    fullmc.style.position="relative";
    fullmc.style.top=initp[1]+"px";

    var pLeft=initp[2];
    daplyer.style.right=initp[2]+"px";
    if(!navigator.userAgent.includes('Firefox')){
        pLeft=kdocument.getElementById('minichat').parentNode.parentNode.getBoundingClientRect().left;
        daplyer.style.left=pLeft+initp[5]+"px";
    }

    var kscroll=0;
    if(!param.pinup){kscroll=kdocument.querySelector('#header').getBoundingClientRect().top;}
    var tp=initp[0]+kscroll;
    daplyer.style.top=tp+'px';

    if(csstyle==0){
        daplyer.style.boxShadow='2px 1px 2px #3B0D0E';
        daplyer.style.borderRight='none';
        daplyer.style.borderLeft='none';
    }else if(csstyle==4){
        daplyer.style.boxShadow='none';
        daplyer.style.borderRight='1px solid #C5C5C4';
        daplyer.style.borderLeft='1px solid #C5C5C4';
    }else{
        daplyer.style.boxShadow='none';
        daplyer.style.borderRight='none';
        daplyer.style.borderLeft='none';
    }
}

//--- Installation du Panneau de contrôle vidéo
function EnodiaCtrl(mTitle){
    var playLast = kdocument.createElement("BUTTON");
    playLast.setAttribute('id','playLast');
    playLast.setAttribute('type','button');
    playLast.setAttribute('class','pButtons');
    playLast.innerHTML="⏮&#xFE0E;";

    var play = kdocument.createElement("BUTTON");
    play.setAttribute('id','play');
    play.setAttribute('type','button');
    play.setAttribute('class','pButtons');
    play.setAttribute('role','play');
    play.innerHTML="⏯&#xFE0E;";

    var playNext = kdocument.createElement("BUTTON");
    playNext.setAttribute('id','playNext');
    playNext.setAttribute('type','button');
    playNext.setAttribute('class','pButtons');
    playNext.innerHTML="⏭&#xFE0E;";

    var schuffle = kdocument.createElement("BUTTON");
    schuffle.setAttribute('id','goRng');
    schuffle.setAttribute('type','button');
    schuffle.setAttribute('class','pButtons');
    schuffle.setAttribute('title','mode aléatoire');
    schuffle.innerHTML="<b>⤨&#xFE0E;</b>";

    var volume = kdocument.createElement("INPUT");
    volume.setAttribute('type','range');
    volume.setAttribute('id','yVolume');
    volume.setAttribute('name','yVolume');
    volume.setAttribute('min','0');
    volume.setAttribute('max','100');

    var br = kdocument.createElement("BR");

    var board = kdocument.createElement("SPAN");

    board.appendChild(playLast);
    board.appendChild(play);
    board.appendChild(playNext);
    board.appendChild(schuffle);

    board.appendChild(br);
    board.appendChild(volume);

    mTitle.appendChild(board);

    //--- EnodiaCtrlStyle
    var pButtons=kdocument.querySelectorAll('.pButtons');
    var cssRange;
    switch(csstyle){
    //- thème kraland
    case 0: {pButtons.forEach(bStyle);
             function bStyle(eachOne){
                 eachOne.style.fontWeight="normal";
                 eachOne.style.fontSize="13px";
                 eachOne.style.marginTop="-3px";
                 eachOne.style.width="21px";
                 eachOne.style.color="#FABC1A";
                 eachOne.style.cursor="pointer";
             }
             cssRange=`
           #yVolume{
  -webkit-appearance: none;
  width: 105px;
  height: 4px;
  background: #FABC1A;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  margin: 3px 0px 0px 0px;
}

#yVolume{
  opacity: 1;
}

#yVolume::-moz-range-thumb{
  width: 7px;
  height: 7px;
  background: #B9282D;
  cursor: pointer;
}

#yVolume::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 7px;
  background: #B9282D;
  cursor: pointer;
}
               `;
            break;}

  //- thème médiéval
  case 1: {pButtons.forEach(bStyle);
            function bStyle(eachOne){
                eachOne.style.fontWeight="normal";
                eachOne.style.fontSize="13px";
                eachOne.style.marginTop="-5px";
                eachOne.style.width="20px";
                eachOne.style.color="#CC7766";
                eachOne.style.cursor="pointer";
            }
           let mcp=kdocument.getElementById('minichat').parentNode;
           mcp.style.marginTop='10px';

           cssRange=`
           #yVolume{
  -webkit-appearance: none;
  width: 120px;
  height: 2px;
  background: #681717;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  margin: 5px 0px 2px -37px;
}

#yVolume{
  opacity: 1;
}

#yVolume::-moz-range-thumb{
  width: 10px;
  height: 5px;
  background: #833F38;
  cursor: pointer;
}

#yVolume::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 5px;
  background: #833F38;
  cursor: pointer;
}
               `;
            break;}

  //- thème gris
  case 2: {pButtons.forEach(bStyle);
            function bStyle(eachOne){
                eachOne.style.fontWeight="normal";
                eachOne.style.fontSize="13px";
                eachOne.style.marginTop="-5px";
                eachOne.style.width="21px";
                eachOne.style.color="#333333";
                eachOne.style.cursor="pointer";
            }
           cssRange=`
           #yVolume{
  -webkit-appearance: none;
  width: 120px;
  height: 2px;
  background: #E9DACD;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

#yVolume{
  opacity: 1;
}

#yVolume::-moz-range-thumb{
  width: 7px;
  height: 7px;
  background: #8F5757;
  cursor: pointer;
}

#yVolume::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 7px;
  height: 7px;
  background: #8F5757;
  cursor: pointer;
}
               `;
           break;}

  //- thème standard
  case 3: {pButtons.forEach(bStyle);
            function bStyle(eachOne){
                eachOne.style.fontWeight="normal";
                eachOne.style.fontSize="13px";
                eachOne.style.marginTop="-3px";
                eachOne.style.width="20px";
                eachOne.style.color="#665533";
                eachOne.style.cursor="pointer";
            }
           mTitle.style.height="22px";
           mTitle.style.width="auto";
           cssRange=`
           #yVolume{
  -webkit-appearance: none;
  width: 120px;
  height: 2px;
  background: #A89B5E;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  margin: 3px 0px 0px -30px;
}

#yVolume{
  opacity: 1;
}

#yVolume::-moz-range-thumb{
  width: 10px;
  height: 5px;
  background: #665533;
  cursor: pointer;
}

#yVolume::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 5px;
  background: #665533;
  cursor: pointer;
}
               `;

            break;}

  //- thème Moderne
  case 4: {pButtons.forEach(bStyle);
            function bStyle(eachOne){
                eachOne.style.fontWeight="normal";
                eachOne.style.fontSize="15px";
                eachOne.style.marginTop="-5px";
                eachOne.style.width="21px";
                eachOne.style.color="#3B3B3B";
                eachOne.style.cursor="pointer";
            }
           mTitle.parentNode.parentNode.style.paddingTop='1px';
           cssRange=`
           #yVolume{
  -webkit-appearance: none;
  width: 120px;
  height: 2px;
  background: #3B3B3B;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

#yVolume{
  opacity: 1;
}

#yVolume::-moz-range-thumb{
  width: 10px;
  height: 5px;
  background: #3B3B3B;
  cursor: pointer;
}

#yVolume::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 5px;
  background: #3B3B3B;
  cursor: pointer;
}
               `;
           break;}
        default: return;
    }
    //--- ytvRangeSetting(cssRange);
    var vRange=kdocument.getElementById('yVolume');
    let vRangeButtonStyle=kdocument.createElement('style');
    vRangeButtonStyle.type="text/css";
    vRangeButtonStyle.appendChild(kdocument.createTextNode(cssRange));
    vRange.parentNode.appendChild(vRangeButtonStyle);
}


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