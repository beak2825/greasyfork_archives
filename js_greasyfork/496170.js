// ==UserScript==
// @name New music player (Fixed)
// @namespace http://tampermonkey.net/
// @version 4.1
// @description Music player for io flash games
// @author You
// @match *://arras.io/*
// @match *://*.moomoo.io/*
// @match *://moomoo.io/*
// @match *://sandbox.moomoo.io/*
// @match *://splix.io/*
// @match *://paper-io.com/*
// @match *://moomoo.io/*
// @match *://starblast.io/*
// @match *://narwhale.io/*
// @match *://surviv.io/*
// @match *://agar.io/*
// @match *://greasyfork.org/*
// @grant none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496170/New%20music%20player%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496170/New%20music%20player%20%28Fixed%29.meta.js
// ==/UserScript==
//YT: https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A

// WIP @match         https://www.roblox.com/home
// WIP @match        *://slither.io/*
console.warn(started=performance.now())
var llength='RDJsG8fl0VfkQ'.length;
var default_s
window.default_list='RDJsG8fl0VfkQ'
function setplayer_(e){var src=e.src;var old=setElement(new Player(src).set);var list=src.split('list')[1];return [old,list,src]
                      }
function getP(url){var n=url.split('&'),o=n[0],p=n[1],q=n[2];return p?p.split('=')[1]:window.default_list}
function getlink(url){
    var vid=setElement(url)
    var list=getP(url)
    return setup(vid,list)
}
function setup(url,list){if(!url){return}if(!list){return}return`https://www.youtube.com/watch?v=${url}?wmode=opaque&autohide=1&autoplay=1&enablejsapi=1&list=${list}`}
function setplayer(e){e.src=setup(setElement(new Player(e.src).set),e.src.split('list')[1]);}
function makeid(length) {var result           = '';var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';var charactersLength = characters.length;for ( var i = 0; i < length; i++ ) {result += characters.charAt(Math.floor(Math.random() * charactersLength));}return result;}
setElement = function(url) {var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;var match = String(url).match(regExp);console.log(match);return(match&&match[7].length==11)? match[7]: false;};
Player = function(oldurl){if(!oldurl){return}var newpid=makeid(length);var newurl=setElement(oldurl);var p=setup(newurl,newpid);this.set=p}
var isalready=eval(localStorage.getItem('isplayer'))==null?true:eval(localStorage.getItem('isplayer'))
isalready=isalready==false
window.onunload=function(){
    localStorage.setItem('isplayer',false);
}
if(isalready){
    localStorage.setItem('isplayer',true);
    iframe='<iframe id="msc" src="https://www.youtube.com/embed/${id}?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
    function toggled(e){var is2=[e.style.display=='none',e.style.display=='block'];if(!is2[0]&&!is2[1]){e.style.display='block'}var is=[e.style.display=='none',e.style.display=='block'];console.log(is);if(is[0]){e.style.display='block'};if(is[1]){e.style.display='none'};return e.style.display;};
    ta=document.getElementsByTagName('*');
    var toadd=[];
    var allEqual = (arr,a) => arr.every( v => {console.log(v === a);return v === a} );
    var allEqual2 = (arr) => arr.every( v => v === arr[0] );
    ta.list=function(id,classname,tag){
        var res=[];
        var put={};
        var array=[];
        todo=document.getElementsByTagName((tag||'*'));
        todo.forEach=[].forEach;
        todo.forEach(e=>{
            array=[];
            if(typeof id=='string'){
                put.i=id==e.id;
            }else{put.i=true}
            if(typeof classname=='string'){
                put.c=classname==e.className;
            }else{put.c=true}
            array=[put.c,put.i];
            array=allEqual(array,true);
            if(array){res.push(e);console.count();}
        })
        console.countReset();
        return res;
    };
    function isHidden(el) {
        if(el){
            return (el.offsetParent === null)
        }
    }
    id=function(id){return document.getElementById(id)}
    dd=function (names) {let unique = {};names.forEach(function(i) {if(!unique[i]) {unique[i] = true;}});return Object.keys(unique);};
    clas=function(classname){return document.getElementsByClassName(classname)};
    var vcent=location.href.includes('moomoo')?false:
    location.href.includes('narwhale')?false:
    location.href.includes('starblast')?false:
    location.href.includes('surviv')?false:
    location.href.includes('roblox')?false:
    document.domain.includes('slither')?true:
    document.domain.includes('greasyfork')?false:
    document.domain.includes('agar')?true:
    document.domain.includes('paper-io')?true:
    document.domain.includes('splix')?true:0;
    var canclear,pendto;
    idlenght='-Mypt378fkc'.length;
    CE=function(tag,id,classname){var e=document.createElement(tag);e.classname=classname;if(id){if(id.length){e.id=id;};};return e;}
    setElement(URL);
    playlist=function(url,...list){
        console.log('1',getlink(url))
        var id=setElement(url);
        if(id&&idlenght==id.length)null
        else {id=false;console.log('id','does','not','match','length')}
        if(!id)id=localStorage.getItem('lid');
        if(list &&llength==list.length)null
        else{list =false;console.log('list','does','not','match','length')}
        if(!list)list=localStorage.getItem('list');
        music_frame.src=setup(id,list);
    }
    function imsub(){playlist()};
    ;fix=URL=>{URL=setElement(URL);document['YTID']=URL;return "https://www.youtube.com/embed/"+URL+"?wmode=opaque&autohide=1&autoplay=1&enablejsapi=1&list=RDJsG8fl0VfkQ";};
    function fix2(item,val){return localStorage.getItem(item)?[true,localStorage.getItem(item)]:[false,localStorage.setItem(item,val)]};hh=function(item,val){localStorage.setItem(item,val)};jj=function(item){return localStorage.getItem(item)};frame=CE('iframe','music_frame');inputm=CE('input','insert');frame.value;inputm.onsubmit=imsub;inputm.onkeyup=function(e){
        function getP(url){var n=url.split('&'),o=n[0],p=n[1],q=n[2];return p?p.split('=')[1]:window.default_list}
        function getlink(url){
            var vid=setElement(url)
            var list=getP(url)
            return setup(vid,list)
        }
        function setup(url,list){if(!url){return}if(!list){return}return `https://www.youtube.com/embed/${url}?list=${list}`;/*`https://www.youtube.com/watch?v=${url}?wmode=opaque&autohide=1&autoplay=1&enablejsapi=1&list=${list}`}*/}
        var new_url=getlink(e.target.value)
        console.log(new_url);
        localStorage.setItem('LP',new_url)
        frame.src=new_url
    };
    if(!eval(fix2('test4',true))[0]){inputm.placeholder=fix('://www.youtube.com/watch?v=-Mypt378fkc');alert('test');frame.src=localStorage.getItem('LP')||inputm.placeholder;}else{fix2('RS','https://www.youtube.com/watch?v=-Mypt378fkc');frame.src=fix(jj('RS'));};var br=CE('br');if(canclear){pendto.innerHTML=''};listn=CE('input','list');listn.placeholder='enter Plist id'
    var hb=CE('button','H_B');
    fix2('list','RDJsG8fl0VfkQ')
    fix2('lid','-Mypt378fkc')
    var hb2=CE('button','H_B2');
    hb2.innerText='New player list'
    frame.setAttribute('controls',1);
    hb.innerText='Toggle player';
    set=function(a,b,c){a.setAttribute(b,c);};
    var test3=[
        {site:location.href.includes('greasyfork'),cent:true,clear:false,parent:function(){return (document.getElementById('home-top-sites')||document.getElementById('script-list-sort')||document.getElementById('script-links')).parentNode}},
        {site:location.href.includes('moomoo'),cent:false,clear:true,parent:function(){setTimeout(function(){setTimeout(function(){
            document.getElementById('nameInput').placeholder = "𝗚𝗶𝘃𝗲 𝗵𝗶𝗺 ▶ 🐳 a name";
            document.getElementById('desktopInstructions').remove();
            document.getElementById('youtuberOf').remove();
            document.getElementById('diedText').innerHTML = '❌ΣLIMIΠΔTΣD❌';
            $('#diedText').css({'background-color': 'rgba(0, 0, 0, 0.74)'});
            $('#diedText').css({'color': 'rgba(212, 32, 32, 1)'});
            document.getElementById('enterGame').innerHTML = '🎮𝐏𝐋𝐀𝐘🎮';

            $('#gameName').css({'color': '#000000',
                                'text-shadow': '0 1px 0 rgba(60, 100, 231, 1), 0 2px 0 rgba(60, 100, 231, 1), 0 3px 0 rgba(60, 100, 231, 1), 0 4px 0 rgba(60, 100, 231, 1), 0 5px 0 rgba(57, 149, 171, 1), 0 6px 0 rgba(57, 149, 171, 1), 0 7px 0 rgba(57, 149, 171, 1), 0 8px 0 rgba(57, 149, 171, 1), 0 9px 0 rgba(57, 149, 171, 1)',
                                'text-align': 'center',
                                'font-size': '156px',
                                'margin-bottom': '-30px'});

            var moomooVer = $('#linksContainer2 .menuLink').html(),
                hideSelectors = ['#mobileDownloadButtonContainer',
                                 '#followText',
                                 '#smallLinks',
                                 '#linksContainer1',
                                 '#twitterFollow',
                                 '#youtubeFollow',
                                 '#cdm-zone-02',
                                 '#youtuberOf',
                                 '#promoImg',
                                 '#downloadButtonContainer',
                                 '.menuHeader',
                                 '.menuLink',
                                 '.menuHeader:nth-child(5)',
                                 '.menuHeader:nth-child(6)',
                                 '.menuText'
                                ],

                css = '#rightCardHolder {display: block!important}',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            /*var Buy={acc:[],hat:[]}
changeStoreIndex(1)
var items2=document.getElementsByClassName('storeItem')
items2.forEach=[].forEach
items2.forEach(e=>{
try{Buy.acc.push({buy:e.getElementsByClassName('joinAlBtn')[0],price:e.getElementsByClassName('itemPrice')[0].innerText*1})}catch(err){Buy.acc.push({buy:e.getElementsByClassName('joinAlBtn')[0],price:e.getElementsByClassName('itemPrice')[0]})})
});
changeStoreIndex(0)
var items2=document.getElementsByClassName('storeItem')
items2.forEach=[].forEach
items2.forEach(e=>{
try{Buy.hat.push({buy:e.getElementsByClassName('joinAlBtn')[0],price:e.getElementsByClassName('itemPrice')[0].innerText})}catch(e){Buy.hat.push({buy:e.getElementsByClassName('joinAlBtn')[0],price:0})}
})*/

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            promoImgHolder.remove();
            (function() {var css = [
                "  #twitterFollow, ",
                "  #youtubeFollow, ",
                "  #downloadButtonContainer, ",
                "  #followText, ",
                "  #promoImg {",
                "    display: none;",
                "  }",
                "",
                "  #featuredYoutube > a.ytLink, ",
                "  a {",
                "    color: #FFFF00 !important;",
                "    font-size: 20px;",
                "    margin-top: 0px;",
                "    transition: 0.5s;",
                "  }",
                "  a:hover {",
                "    color: #51FF00 !important;",
                "  }",
                "",
                "  #featuredYoutube {",
                "  margin-top: 30px;",
                "  }",
                "",
                "  #linksContainer2, ",
                "  .partyWrap {",
                "    background: rgba(0,0,0,0.6);",
                "    border: 3px solid rgba(0,0,0,0.9);",
                "    border-radius: 10px;",
                "    padding: 10px;",
                "    font-size: 20px;",
                "    position: absolute;",
                "    color: #fff;",
                "  }",
                "",
                "  .partyWrap {",
                "    min-height: 80px;",
                "    min-width: 160px;",
                "    top: 10px;",
                "    right: 10px;",
                "  }",
                "",
                "  #followText {",
                "    min-height: 200px;",
                "    bottom: 10px;",
                "    left: 10px;",
                "  }",
                "",
                "  #linksContainer2 {",
                "    bottom: 10px;",
                "    right: 10px;",
                "    color: transparent;",
                "  }",
                "",
                "  .menuCard {",
                "    background: rgba(0,0,0,0.6);",
                "    border-radius: 10px;",
                "    border: 10px solid rgba(0,0,0,0.9);",
                "    box-shadow: none;",
                "    overflow:auto;",
                "    height:180px;",
                "  }",
                "",
                "  ::-webkit-scrollbar {",
                "    width: 10px;",
                "    border-right: 2px solid #ec0e0ed6;",
                "  }",
                "",
                "  ::-webkit-scrollbar-thumb {",
                "    border: 2px solid #ffeb3b;",
                "  }",
                "",
                "  ::-webkit-scrollbar-thumb:hover {",
                "    background: #ec0e0ed6;",
                "  }",
                "",
                "  ::-webkit-scrollbar-thumb:active {",
                "    background: black;",
                "    border: 2px solid #000000;",
                "  }",
                "",
                "  .menuHeader {",
                "    font-size: 24px;",
                "    color: #eeeeee;",
                "    margin-bottom: 3px;",
                "    border-bottom: 3px solid #eee;",
                "  }",
                "",
                "  .menuHeader:first-child {",
                "    margin-bottom: 30px;",
                "  }",
                "",
                "  .menuText {",
                "    font-size: 18px;",
                "    color: #ccc;",
                "    margin-bottom: 10px;",
                "  }",
                "",
                "  .ytLink {",
                "    color: #FF8C00;",
                "    font-size: 24px;",
                "    text-decoration: none;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  .menuButton {",
                "    color: #fff;",
                "    background-color: transparent;",
                "    border: 5px solid #ffe600;",
                "    position: relative;",
                "    display: inline-flex;",
                "    padding: 0px 70px;",
                "    font-family: fantasy;",
                "    transition: color .5s;",
                "    overflow: hidden;",
                "    width: 100%;",
                "    justify-content: center;",
                "  }",
                "",
                "  .menuButton:hover {",
                "    font-family: monospace;",
                "    color: #FFFFFF !important;",
                "    border: 5px solid #ff0000;",
                "    cursor: pointer;",
                "    background-color: transparent;",
                "  }",
                "",
                "  .menuButton:before {",
                "    content: \'\';",
                "    position: absolute;",
                "    top: 0;",
                "    left: 0;",
                "    width: 130%; ",
                "    height: 10000%;",
                "    background: #2dff00;",
                "    border-right: 20px solid #FF0000;",
                "    z-index: -1;",
                "    transform-origin:0 0 ;",
                "    transform:translateX(-112%) skewX(45deg);",
                "    transition: transform .5s;",
                "  }",
                "",
                "  .menuButton:hover:before {",
                "    color: #FFFFFF !important;",
                "    transform: translateX(-20%) skewX(45deg);",
                "  }",
                "",
                "  .menuCard span {",
                "    margin: 10px;",
                "  }",
                "",
                "  #promoHolderImg > img {",
                "    width: 300px;",
                "    height: 94px;",
                "  }",
                "",
                "  #guideCard {",
                "    max-height: 282px;",
                "  }",
                "",
                "  .skinColorItem {",
                "    transition: 1s;",
                "    width: 23px;",
                "    height: 23px;",
                "    border: 3px solid #000;",
                "  }",
                "",
                "  select {",
                "    background: #000000;",
                "    border-radius: 5px;",
                "    border: 3px solid #006EC4;",
                "    margin-bottom: 10px;",
                "    color: #fff;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  select:hover {",
                "    background: #ff8007;",
                "    border: 3px solid #B20E0E;",
                "  }",
                "",
                "  #pre-content-container {",
                "    display: none!important;",
                "  }",
                "",
                "  .actionBarItem {",
                "    background-color: rgba(0,0,0,0.6) !important;",
                "    border: 3px solid rgba(255,235,59,1);",
                "    border-radius: 15px !important;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  .actionBarItem:hover {",
                "    background-color: rgba(0,0,0,0.5) !important;",
                "    border: 3px solid rgba(255,136,0,1);",
                "    border-radius: 50px !important;",
                "  }",
                "",
                "  .uiElement {",
                "    background-color: rgba(0,0,0,0.6) !important;",
                "    border: 3px solid rgba(234,0,255,1);",
                "    border-radius: 50px !important;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  .uiElement:hover {",
                "    background-color: rgba(0,0,0,0.5) !important;",
                "    border: 3px solid rgba(0,95,255,1);",
                "    border-radius: 0px !important;",
                "  }",
                "",
                "  .resourceDisplay {",
                "    background-color: rgba(0,0,0,0.6) !important;",
                "    border: 3px solid rgba(255,255,0,0.9);",
                "    border-radius: 50px !important;",
                "    color: #A200FF;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  #topInfoHolder, #itemInfoHolder, #mapDisplay, #chatBox  { ",
                "    background-color: rgba(0,0,0,0.6) !important;",
                "    border: 3px solid rgba(0,0,0,0.9);",
                "    border-radius: 10px !important;",
                "    color: #FF0000;",
                "  }",
                "",
                "  #itemInfoHolder { ",
                "    -webkit-text-stroke: transparent;",
                "  }",
                "",
                "  .material-icons { ",
                "    color: #000000;",
                "    font-size: 31px;",
                "    -webkit-text-stroke: 0.3px #fff;",
                "  }",
                "",
                "  #altServer > a > i {",
                "    font-size: 30px !important;",
                "    -webkit-text-stroke: transparent !important;",
                "  }",
                "",
                "  #ageBarBody {",
                "    background: url('https://ak.picdn.net/shutterstock/videos/822988/thumb/3.jpg');",
                "    border: 1px solid #fff",
                "  }",
                "",
                "  #ageBar {",
                "    background-color: rgba(0,0,0,0.6) !important;",
                "    border: 1px solid rgba(0,0,0,0.9);",
                "    height: 5px;",
                "    padding-bottom: 10px;",
                "  }",
                "",
                "  .actionBarItem {",
                "    width: 65px;",
                "    height: 65px;",
                "    background-position: center; ",
                "    background-size: 55px 55px;",
                "  }",
                "",
                "  #aBox {",
                "    color: #FF8C00!important;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  #chatBox::placeholder {",
                "    color: #17FF00!important;",
                "  }",
                "",
                "  #chatBox:hover {",
                "    background: rgba(0,0,0,0.5)!important;",
                "  }",
                "",
                "  #chatBox:hover::placeholder {",
                "    color: #00FFFF!important;",
                "  }",
                "",
                "  .ytLink:hover {",
                "    color: #cc0000;",
                "  }",
                "",
                "  #nameInput {",
                "    background: #fff;",
                "    border: 5px solid #00FF9E;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  #nameInput::placeholder {",
                "    color: #00FF9E;",
                "    transition: 0.5s;",
                "  }",
                "",
                "  #nameInput:hover {",
                "    background: #4ACA1A;",
                "    color: #fff;",
                "  }",
                "",
                "  #nameInput:hover::placeholder {",
                "    background: #4ACA1A;",
                "    color: #fff;",
                "  }",
                "",
                "  #linksContainer2 {",
                "    max-height: 500px;",
                "    width: 250px;",
                "  }",
                "",
                "  #linksContainer2 > * {",
                "    display:table-cell;",
                "    vertical-align:middle;",
                "    text-align: center;",
                "    width:700px;",
                "  }",
                "  ",
                "  .storeTab, ",
                "  #storeHolder, ",
                "  #allianceHolder, ",
                "  #allianceInput, ",
                "  .allianceButtonM {",
                "    background: rgba(0,0,0,0.6);",
                "    border: 3px solid rgba(0,0,0,0.9);",
                "  }",
                "",
                "  .storeItem, ",
                "  .storeTab, ",
                "  .allianceButtonM, ",
                "  #allianceInput::placeholder, ",
                "  .allianceItem {",
                "    color: #FF8C00 !important;",
                "  }",
                "",
                "  .storeItem, ",
                "  .storeTab, ",
                "  .allianceButtonM, ",
                "  #allianceInput::placeholder, ",
                "  .allianceItem, ",
                "  .joinAlBtn {",
                "    color: #FFF700 !important;",
                "  }",
                "",
                "  .storeItem:hover, ",
                "  .storeTab:hover, ",
                "  .allianceButtonM:hover,",
                "  .allianceItem:hover, ",
                "  .joinAlBtn:hover {",
                "    color: #F1F41D !important;",
                "  }",
                "",
                "  #allianceInput, ",
                "    color: #FF8C00;",
                "  }",
                "  ",
                "  #allianceInput:hover {",
                "    background: rgba(0,0,0,0.5);",
                "    color: #fc9f9f;",
                "  }",
                "",
                "  #allianceInput:hover::placeholder{",
                "    color: #fc9f9f;",
                "  }",
                "",
                "  #linksContainer2 > *:first-child {",
                "    border-bottom: 3px solid #8B00FF;",
                "  }",
                "",
                "  #moddedMenu {",
                "    position: absolute;",
                "    top: 30.25%;",
                "    left: 0px;",
                "    width: 3%;",
                "    height: 45.0%;",
                "    background: url(https://i.pinimg.com/originals/30/b8/17/30b8174c6f1a07e0af9bcf41fec3a5f5.gif);",
                "    border: 3px solid rgba(100,0,255,0.9);",
                "    border-top-right-radius: 30px;",
                "    border-bottom-right-radius: 0px;",
                "    transition: 1s;",
                "    z-index: 999;",
                "  }",
                "",
                "  #moddedMenu:hover {",
                "    width: 22%;",
                "  }",
                "",
                "  .titleMM {",
                "    color: #A20000;",
                "    border-bottom: 3px solid #0030ff;",
                "    font-size: 32px;",
                "    transform: rotate(90deg);",
                "    white-space: nowrap;",
                "    margin-top: 250%;",
                "    transition: 1s;",
                "  }",
                "",
                "  #moddedMenu:hover > .titleMM {",
                "    transform: rotate(0deg) translate(0,-1580%)",
                "  }",
                "",
                "",
                "  .text {",
                "    bottom: 76%;",
                "    position: absolute;",
                "    color: #eee;",
                "    font-size: 20px;",
                "    left: 0%;",
                "    display: none;",
                "    transition: 1s;",
                "  }",
                "",
                "  .text > b { ",
                "    font-size: 20px;",
                "    color: #ff6500;",
                "  }",
                "",
                "  b:hover { ",
                "    color: #ff0000;",
                "  }",
                "",
                "  .one > .text {",
                "    top: 5.5%;",
                "  }",
                "",
                "  .two > .text {",
                "    top: 10.7%;",
                "  }",
                "",
                "  .three > .text {",
                "    top: 37.5%;",
                "  }",
                "",
                "  .four > .text {",
                "    top: 47.5%;",
                "  }",
                "",
                "  .five > .text {",
                "    top: 57.5%;",
                "  }",
                "",
                "  .six > .text {",
                "    top: 67.5%;",
                "  }",
                "",
                "  .seven > .text {",
                "    top: 77.5%;",
                "  }",
                "",
                "  .eight > .text {",
                "    top: 87.5%;",
                "  }",
                "",
                "",
                "",
                "  #moddedMenu:hover .switch {",
                "    opacity: 1;",
                "  }",
                "",
                "  #moddedMenu:hover .text {",
                "    display: block;",
                "  }",
                "",
                "",
                "  .slider {",
                "    position: absolute;",
                "    cursor: pointer;",
                "    background-color: #888;",
                "    -webkit-transition: .4s;",
                "    transition: .4s;",
                "  }",
                "",
                "  .slider:before {",
                "    position: absolute;",
                "    background-color: orange;",
                "    -webkit-transition: .4s;",
                "    transition: .4s;",
                "  }",
                "",
                "  input:checked + .slider {",
                "    background-color: #FF8C00;",
                "  }",
                "  ",
                "  input:focus + .slider {",
                "    box-shadow: 0 0 1px #FF8C00;",
                "  }",
                "",
                "  input:checked + .slider:before {",
                "    -webkit-transform: translateX(26px);",
                "    -ms-transform: translateX(26px);",
                "    transform: translateX(10px);",
                "  }",
                "",
                "  .slider.round {",
                "    border-radius: 34px;",
                "  }",
                "",
                "  .slider.round:before {",
                "    border-radius: 50%;",
                "  }"
            ].join("\n");
                         if (typeof GM_addStyle != "undefined") {
                             GM_addStyle(css);
                         } else if (typeof PRO_addStyle != "undefined") {
                             PRO_addStyle(css);
                         } else if (typeof addStyle != "undefined") {
                             addStyle(css);
                         } else {
                             var node = document.createElement("style");
                             node.type = "text/css";
                             node.appendChild(document.createTextNode(css));
                             var heads = document.getElementsByTagName("head");
                             if (heads.length > 0) {
                                 heads[0].appendChild(node);
                             } else {
                                 document.documentElement.appendChild(node);
                             }
                         }
                        })();
        },100)},1000);return id('adCard');},css:[['#adCard','background-color', 'rgba(0,0,0,0)'],['#insert','background-color', 'rgba(0,0,0,0)'],['#H_B','color', 'red'],['#serverBrowser','background-color','rgba(0,0,0,0)'],['#guideCard','background-color','rgba(0,0,0,0)'],['#setupCard','background-color','rgba(0,0,0,0)'],['#nameInput','background-color','rgba(0,0,0,0)'],['#nameInput','color','rgb(254, 28, 73)']]},
        {site:location.href.includes('slither'),cent:true,clear:true,parent:function(){return id('login')}},
        {site:location.href.includes('narwhale'),cent:false,clear:false,parent:function(){return id('adZone')}},
        {site:location.href.includes('starblast'),cent:false,clear:false,parent:function(){return id('content')}},
        {site:location.href.includes('surviv'),cent:true,clear:true,parent:function(){return id('ad-block-left')},css:[['#H_B','background-color', 'rgba(0,0,0,0)'],['#insert','background-color', 'rgba(0,0,0,0)'],['#H_B','color', 'red'],['#ad-block-left','background-color','rgba(0,0,0,0)']]},
        {site:location.href.includes('roblox'),cent:false,clear:false,parent:function(){return clas('home-header')[0]}},
        {site:location.href.includes('agar'),cent:true,clear:true,parent:function(){return id('mainui-ads')}},
        {site:location.href.includes('paper-io'),cent:true,clear:true,parent:function(){return id('bottom')}},
        {site:location.href.includes('splix'),cent:true,clear:true,parent:function(){return id('newsboxContent')}},
        {site:location.href.includes('arras'),cent:true,clear:true,parent:function(){id('ad-spawn').remove();id('arras-io_336x280').remove();return document.getElementsByClassName('referral')[0]}},
    ];
    var a
    window.br=document.createElement('br')
    hb.onclick=function(){var ei;try{toggled(centy2);}catch(e){console.log('Failed',2,e)};try{toggled(centy)}catch(e){console.log('Failed',1,e)}}
    hb2.onclick=setup2
    function add_styles(){
        insert.className='script'
        H_B.className='script'
        H_B2.className='script'
        frame.className='script'
        frame.after(br)
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
            addStyle(css);
        } else {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(`
iframe.script {
border: 2px solid red;
border-radius: 8px;
border-style: solid;
border-width: medium;
}
button.script{
border: 2px solid red;
border-radius: 8px;
border-style: solid;
border-width: medium;
background:black;
color:white
}
input.script::placeholder{color:red}
input.script{
border: 2px solid red;
border-radius: 8px;
border-style: solid;
border-width: medium;
border-width:0px;
color:black;
background: rgba(0, 0, 0, 0)
}`));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
    }
    function style(a,b,c){$(a).css(b,c);};
    function setup2(){var info=setplayer_(music_frame);document.getElementById('insert').value=info[0];imsub();}
    function place(a,b){try{a.placeholder=b}catch(err){}}
    window.setup3=function setup3(css){
        set(frame,'allow','autoplay; encrypted-media')
        set(frame,'frameborder','0')
        var bf=pendto
        var xcent=CE('center','centy3');
        if(canclear){pendto.innerHTML='';}
        if(vcent){
            clearInterval(a);
            a=setInterval(function(){
                console.log('waiting')
                try{
                    if(pendto){
                        clearInterval(a);
                        var p2=pendto
                        frame.src=localStorage.getItem('LP')
                        window.onunload=function(e){localStorage.setItem('LP',frame.src)}
                        console.log(pendto)
                        var cent=CE('center','centy');
                        pendto.appendChild(cent);
                        pendto=centy;
                        pendto.appendChild(br);
                        pendto.appendChild(frame);
                        pendto.appendChild(br);
                        pendto.appendChild(br);
                        pendto.appendChild(inputm);
                        pendto.appendChild(br);
                        pendto.appendChild(br);
                        clearInterval(a);
                        xcent.appendChild(br);
                        xcent.appendChild(hb)
                        xcent.appendChild(br)
                        xcent.appendChild(hb2)
                        p2.appendChild(xcent)
                        console.log('Done setting up')
                        console.log(started-performance.now())
                        add_styles()
                    }
                }catch(e){console.error(e);}
            },0)
        }
        else{
            clearInterval(a);
            a=setInterval(function(){
                try{
                    if(pendto){
                        clearInterval(a);
                        var div=pendto;
                        pendto=CE('div','centy2');
                        pendto.appendChild(br);
                        pendto.appendChild(frame);
                        frame.src=localStorage.getItem('LP')
                        window.onunload=function(e){localStorage.setItem('LP',frame.src)}
                        pendto.appendChild(br);
                        pendto.appendChild(br);
                        pendto.appendChild(inputm);
                        div.appendChild(pendto)
                        div.appendChild(br);
                        div.appendChild(hb);
                        div.appendChild(br)
                        div.appendChild(hb2)
                        console.log('Done setting up')
                        alert('done')
                        console.log(started-performance.now());
                        add_styles();
                    }
                }catch(e){console.error(e)}
            },0)
        }

        setTimeout(function(){
            if(css){
                css.forEach(e=>{
                    style(e[0],e[1],e[2])
                });
            }
            place(id('insert'),'insert song here');
        },1000)};
    test3.forEach(e=>{
        if(e.site){
            pendto=window.pendto=e.parent();
            vcent=window.vcent=e.cent
            canclear=window.canclear=e.clear
            console.log(e)
            if(e.css){setup3(e.css);console.log('w/o')}else{setTimeout(window.setup3,100);console.log('found')};
        }
    });
}