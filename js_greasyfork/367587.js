// ==UserScript==
// @name        Wikipedia_prettfy
// @description prettfy wikipedia move toc to side,etc make it easier to read
// @namespace   https://github.com/willowj/readable-wikipedia
// @include     http*://*.wikipedia.org/**
// @include     http*://*.wikinews.org/**
// @include     http*://*.wikisource.org/**
// @version     1.2
// @grant       Adam willow
// modified from https://greasyfork.org/zh-CN/scripts/35198-readable-wikipedia/code v1
// @downloadURL https://update.greasyfork.org/scripts/367587/Wikipedia_prettfy.user.js
// @updateURL https://update.greasyfork.org/scripts/367587/Wikipedia_prettfy.meta.js
// ==/UserScript==

function GM_addStyle_from_string(str) {
   var node = document.createElement('style');
   node.innerHTML = str;
   document.body.appendChild(node);
}

//var cssSrc = GM_getResourceText ("readableWikipediaCss");

var cssSrc = `
/* Base Wikipedia Enhancement */

#firstHeading {
    font-weight: bolder !important;
    padding: 0.6em !important;
    font-size: xx-large !important;
  }


body{
    background: none !important;
}

a:visited {
  color: #948af5 !important;
}

a {
  color: #063b92;
}
.toc>ul a {
    color: black;
}
.reference {
/*  display: none !important;*/
}

.internal {
  /*display: none !important;*/
}




#mw-head-base {
  background-image: none !important;
}


.infobox th {
  background-color: #e6e0c8 !important;
  /*font-weight: normal !imporant;*/
}

/*.infobox th a {
  color: white !important;
  font-weight: normal !imporant;
}*/

table.infobox {
    border-spacing: 3px;
    text-align: left;
    font-size: small;
    line-height: 1.5em;
    border-collapse: collapse;

}
.wikitable{
    margin: auto !important;
}

#simpleSearch{
   border :0px !important;
}

/*vectorTabs*/
div.vectorTabs span{
   display: block !important;
   background-image: unset !important;
}
div.vectorTabs{
   background-image: unset !important;
}
div#mw-head div.vectorMenu h3{
   background-image: unset !important;
}
div.vectorTabs ul li{
   background-image: unset !important;
}
div.vectorTabs ul{
   background-image: unset !important;
}
/*vectorTabs*/

#siteNotice {
    text-align: right;
    font-size: 6px;
    margin-left: 50%;
    position: absolute;

}

h2 {
  margin-top: 2em !important;
}

dl>dd{
    border-bottom-style: groove;
}

#mw-page-base {
  height: auto !important;
}

#siteSub {
  display: none !important;
}

.metadata {
  display: none !important;
}

.catlinks {
  /*display: none !important;*/
}

.Template-Fact {
  display: none !important;
}

div#content a.external {
  background: none !important;
}

.topicon {
  display: none !important;
  right: 9999px !important;
}

.icone_de_titre {
  display: none !important;
}

#coordinates {
  display: none !important;
}


#left-navigation {
    margin-left: 20%;
    margin-top: 0px;
    font-size: 8px !important;
}

#right-navigation {
  margin-top: 2em !important;
}

#p-views {
  display: none !important;
}

#mw-panel {
    font-size: inherit;
    position: unset;
    top: 0;
    width: 10em;
    left: 0;
}


#mw-body {
  margin-left: 0px !important;
}

.mw-body-content h2 {
    /* font-size: 1.5em; */
    margin-top: 1em;
    border-left-style: inset;
    border-left-width: 0.6em;
    border-left-color: lightskyblue;
        padding-left: 0.3em;
}

.mw-body-content p,ul {
    line-height: inherit;
    margin: 0.5em 0;
    padding-left: 4% !important;
}

.mw-parser-output li {
    padding-bottom: 0.6em !important;
}



p {
  font-size: 1em !important;
  margin-top: 1em !important;
}

.mw-parser-output>p {
    letter-spacing: 1px;
    text-align: justify;
}
.mw-parser-output>dl{
    padding-left: 3em;
}
.mw-parser-output>ol{
    padding-left: 5em;
}
.mw-parser-output>h3~ol{
    padding-left: 1em;
}
h2~h3 {
    padding-left: 0.5em;
}
h3~h4 {
    padding-left: 1em;
}
h4~h5 {
    padding-left: 2em;
}


#protected-icon {
  display: none !important;
}

.dablink {
  display: none !important;
}

#mw-articlefeedback {
  display: none !important;
}

.editsection {
  display: none !important;
}

#footer {
  text-align: center !important;
  border-top: 1px solid grey !important;
}

#footer-places {
  display: none !important;
}

#footer img {
  display: none !important;
}

.tleft {
  margin: 1.5em 1.4em 1.3em 0 !important;
}

/* I'm really not sure about this change,
 * Eventually I'd like the TOC accessible
 * via a side menu, for now this is experimental
 * and might change
*/

div#toc {
    position: fixed;
    margin-left: 0px;
    font-size: 13px;
    top: 0%;
    overflow: auto;
    height: 100%;
    display: inline-block;
    z-index: 1;
    background: beige ;
    border: 0px;
    font-size :0.9em;
}
.toc ul ul {
    margin: 0 0 0 1em;
}
div#toc>ul li:focus{
    border-right-style: solid;
    border-right-color: wheat;
    font-weight: bolder;
}


.toc>ul{
    margin-bottom: 2em;
    margin-left:5%;
}

.tocnumber, .toctext {
    display: table-cell;
    text-decoration: blink;
}

/* Reading Enhacements */

* {
  line-height: 1.7em !important;
}


/* File Enhancements */


/*#file img {
  width: 100% !important;
  height: auto !important;
}*/

.fullMedia, .sharedUploadNotice, #mw-imagepage-section-linkstoimage, #filelinks, #mw-imagepage-section-filehistory, #filehistory, #mw-imagepage-section-globalusage, #globalusage, #mw-imagepage-content, #template-picture-of-the-day, #metadata, .mw-imagepage-section-metadata, .mw-filepage-resolutioninfo {
  display: none !important;
}

/* Scripted in styles */
#logo {
  margin: .5em auto auto 1em;
}

.visible-link {
  color: #2B77BD !important;
}



#enhancement_credit {
  font-size: 12px !important;
}

.mw-editsection {
  display: none !important;
}

.mobile {
  display: none !important;
}

/* Responsive breakpoints */
@media screen and (min-width: 1200px) {

    div#content{
        margin-left: 15% !important;
        width: 70% !important;
        padding-left: 5em !important;
        padding-right: 7em !important;

    }
    .toc{
        width: 13%;
    }
    #p-personal {
        display: inherit !important;
        padding-right: 7em !important;
    }
    #right-navigation{
        padding-right: 8% !important;
            font-size: 8px !important;
    }
    #siteNotice{
        padding-right: 10em !important;
    }
    .infobox {
        margin-left: 2em !important;
        float: right !important;
        min-width: auto !important;
        clear: unset !important;
    }
}
@media screen and (max-width: 1200px) {
  div#content {
    width: 72% !important;
    margin-left: 20%;
  }

  div#toc{
     width: 15%;
  }
  .thumb, .tright, .left {
    display: block !important;
 /*   float: none !important;*/
  }
  #mw-articlefeedbackv5 {
    display: none !important;
 }
 .infobox {
        margin-left: 2em !important;
        float: right !important;
        min-width: auto !important;
        clear: unset !important;
    }

}


@media screen and (max-width: 650px) {
  div#content {
    margin-left: 2%;
    width: 90% !important;
    padding-top: 1em !important
    background: none !important;
    padding: 4.25em 1.5em 1.5em 1.5em !important;
    border: none !important;
  }
  table.infobox{
    width:90% !important;
  }
  .toc{
    width: 90% !important;
    position : relative !important;
    height : auto !important;
    margin-left: 5% !important;
    top : 5em !important
  }
  #mw-panel{
    display :none !important;

  }

  .desktop {
    display: none !important;
  }

  .mobile {
    display: block !important;
  }

  .infobox {
    display: block !important;
    float: none !important;
    margin: 1em auto !important;
   }
}

/* MY CODE */


div#content {
   padding-top: 1em !important;
   margin-top: 3em;
   border: none;
}

.toc::-webkit-scrollbar{
    width: 0px;
    height: 8px;
}

/* 设置滚动条的滑轨 */
.toc::-webkit-scrollbar-track {
      /*background-color: #ddd;*/
}

/* 滑块 */
/*.toc::-webkit-scrollbar-thumb {
    background-color: #54595d;
    border-radius: 4px;
}*/

 /* 滑轨两头的监听按钮 */
.toc::-webkit-scrollbar-button {
    background-color: #888;
    display: none;
`;

GM_addStyle_from_string(cssSrc);
//document.getElementById("References").parentNode.nextSibling.nextSibling.style.display = "none";
var toc = document.querySelector('div#toc');
if (toc == null) {
   var toc = document.createElement('div');
   toc.setAttribute('id', 'toc');
   toc.setAttribute('class', 'toc');
}
document.body.insertBefore(toc, document.body.firstElementChild);

var pg = document.querySelector('#mw-panel');
document.querySelector('#toc').appendChild(pg);


/*toc toggle*/
if (!document.querySelector("#toc .toctoggle")) {
   var tog = document.createElement('span');
   document.querySelector("#toc .toctitle").appendChild(tog);
   if (document.URL.indexOf('//en.wiki') >= 0) {
      var hide = 'hide';
   } else {
      var hide = '隐藏';
   }
   tog.outerHTML = '<span class="toctoggle">&nbsp;[<a role="button" tabindex="0" class="togglelink">' + hide + '</a>]&nbsp;</span>';
}

/*toc show toogle*/
var togglelink = document.querySelector("#toc .toctitle .togglelink");
var ul = document.querySelector("#toc>ul");
togglelink.addEventListener("click", function() {
   if (ul.style.display === 'none') {
      ul.style.display = 'block';
   } else {
      ul.style.display = 'none';
   }

   var tog_ = {
      "hide": "show",
      "show": "hide",
      "隐藏": "显示",
      "显示": '隐藏'
   };
   togglelink.text = tog_[togglelink.text];
});

if (document.body.offsetWidth <= 650) {
   togglelink.click();
}

/*var theurl = document.URL;
var res = theurl.replace(/zh.wikipedia.org\/wiki\//gi, "zh.wikipedia.org/zh-cn/");
if (res != theurl){
    window.location.href = (res);
}*/


/*info box right*/

/*var info_box = document.createElement("div");
info_box.id = 'info_box';
document.body.insertBefore(info_box, document.querySelector('#content'));

document.querySelectorAll('.infobox').forEach(function (item) {
    info_box.appendChild(item);
});
*/


/*a link to zn_cn */
function link_to_zh_cn() {
   if (document.URL.indexOf("zh.wikipedia.org") >= 0) {
      var nodes = document.querySelectorAll("a[href*='/wiki/']");
      for (var i = 0; i < nodes.length; i++) {
         var url = decodeURIComponent(nodes[i].href.replace(/\/wiki\//gi, "/zh-hans/"));
         nodes[i].href = url;
      }
      console.log("link to zn_cn ");
   }
}
link_to_zh_cn();

/*add space betwen cn and eng
var g1 = /(\w)([\u4e00-\u9fa5])/g;
var g2 = /([\u4e00-\u9fa5])(\w)/g;
document.querySelectorAll('p').forEach(function (item) {
    if (item.innerText) {
    item.innerText=item.innerText.replace(g1,"$1 $2").replace(g2,"$1 $2");
    }
});*/



/*menu on scroll*/
window.onscroll = function() {
   var t = document.documentElement.scrollTop || document.querySelector('#content').scrollTop; //取当前高度
   //取各个锚点的位置
   var menu = document.querySelectorAll('div#toc>ul a');
   var flag = -1;
   for (var i = 0; i < menu.length; i++) {
      var ssid = menu[i].href.split('#');
      ssid = ssid[ssid.length - 1];

      if (document.getElementById(ssid).offsetTop + 200 >= t) {
         /*menu[i].closest('li').focus();*/
         flag = i;
         break;
      }
   }


   for (var ik = 0; ik < menu.length; ik++) {
      if (flag == ik) { //找到当前浏览器固定达到的位置所对应的标题
         menu[ik].style.color = "black"; //旗下的a标签里面的内容为红色
         menu[ik].style.fontWeight = "bolder"; //旗下的a标签里面的内容为红色
         menu[ik].focus();
         menu[ik].closest('li').style.borderRightStyle = "solid";
         menu[ik].closest('li').style.borderRightColor = "wheat";
      } else { //其余标题
         //menu[ik].style.color="blue";//旗下的a标签里面的内容为蓝色
         menu[ik].style.color = "unset";
         menu[ik].style.fontWeight = "unset"; //旗下的a标签里面的内容为红色
         menu[ik].closest('li').style.borderRightStyle = "unset";
         menu[ik].closest('li').style.borderRightColor = "unset";
      }
   }
   /*    if(flag==-1){//如果没有任何一个标题碰到浏览器顶部，那么就认为是现在悬停在第一个标题
           menu[0].style.color="red";//旗下的a标签里面的内容为红色
       }*/

};