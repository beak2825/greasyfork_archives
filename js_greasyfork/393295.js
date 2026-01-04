// ==UserScript==
// @name KI-Hécate-MinichatPlus
// @description Améliore le minichat de Kraland
// @match http://www.kraland.org/*
// @version 4.0.2
// @author Gyeongeun
// @license  CC-BY-SA-4.0
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