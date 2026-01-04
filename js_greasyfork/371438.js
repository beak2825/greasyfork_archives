// ==UserScript==
//Видит Бог, как же я заебался, но оно работает, удивительно, для нашей страны. Скрипт для лолза
// @name           lolz
// @description    Хайд 19.08.2018
// @author         Busido
// @version        0.2
// @include        https://lolzteam.net/threads/*
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace https://greasyfork.org/users/206642
// @downloadURL https://update.greasyfork.org/scripts/371438/lolz.user.js
// @updateURL https://update.greasyfork.org/scripts/371438/lolz.meta.js
// ==/UserScript==
(

    function() {
    'use strict';
/////////////////////////////////////////////////////
        function addEvent(elem, evType, fn) {
//    elem["on" + evType] = fn;
  if (elem.addEventListener) {
    elem.addEventListener(evType, fn, false);
  }
  else if (elem.attachEvent) {
    elem.attachEvent("on" + evType, fn);
  }
  else {
    elem["on" + evType] = fn;
  }
}

function $(id) { return document.querySelector(id); }
/////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////


var elem = document.getElementsByClassName('privateControls');
//alert( "Из BODY: " +elem.length);

var username = []
var articleDiv = document.getElementsByClassName("nickStatus");
        //alert("qwe " +articleDiv.length);
        for (var l=0; l!=articleDiv.length; l++)
        {

var nodes = articleDiv[l].childNodes;
            //alert("qwe " +nodes.length);
var lenght = nodes.length;
for (var g=0; g!=lenght; g++) if (nodes[g].nodeName == 'A') var A = g;

var nod = nodes[A].childNodes;
username[l]=nod[0].innerText;
            //alert("" +username[1])
        };
///////////////////////////////////////////////////////////
   function lol0() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[0] + ", [USERS=" + username[0] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol1() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[1] + ", [USERS=" + username[1] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol2() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[2] + ", [USERS=" + username[2] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol3() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[3] + ", [USERS=" + username[3] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol4() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[4] + ", [USERS=" + username[4] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol5() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[5] + ", [USERS=" + username[5] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol6() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[6] + ", [USERS=" + username[6] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol7() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[7] + ", [USERS=" + username[7] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol8() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[8] + ", [USERS=" + username[8] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol9() {
                   var el= document.createElement("p");
        el.innerHTML = "@" + username[9] + ", [USERS=" + username[9] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol10() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[10] + ", [USERS=" + username[10] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol11() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[11] + ", [USERS=" + username[11] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol12() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[12] + ", [USERS=" + username[12] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el)
       window.scrollTo(0,document.body.scrollHeight);;

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol13() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[13] + ", [USERS=" + username[13] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol14() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[14] + ", [USERS=" + username[14] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol15() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[15] + ", [USERS=" + username[15] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol16() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[16] + ", [USERS=" + username[16] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol17() {
                     var el= document.createElement("p");
        el.innerHTML = "@" + username[17] + ", [USERS=" + username[17] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol18() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[18] + ", [USERS=" + username[18] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
   function lol19() {
                    var el= document.createElement("p");
        el.innerHTML = "@" + username[19] + ", [USERS=" + username[19] + "][/USERS]";
        var com = document.getElementsByTagName('iframe')[0];
        var com2 = com.contentWindow.document.body;
        com2.appendChild(el);
       window.scrollTo(0,document.body.scrollHeight);

com.contentWindow.document.body.value = "<font color= 'white' ></font>";};
///////////////////////////////////////////////////////////
for (var i=0; i!=+elem.length; i++)
{
    var p = document.createElement('a');
        p.href = 'javascript:void(0)';
        p.title = 'Дать хайд по нику';
        p.id = 'Haid' + i;
p.innerHTML = '<a class="OverlayTrigger item control report" ";>Хайд</a>';
    elem[i].appendChild(p);

};

        addEvent($("#Haid0"), "click", lol0);
        addEvent($("#Haid1"), "click", lol1);
        addEvent($("#Haid2"), "click", lol2);
        addEvent($("#Haid3"), "click", lol3);
        addEvent($("#Haid4"), "click", lol4);
        addEvent($("#Haid5"), "click", lol5);
        addEvent($("#Haid6"), "click", lol6);
        addEvent($("#Haid7"), "click", lol7);
        addEvent($("#Haid8"), "click", lol8);
        addEvent($("#Haid9"), "click", lol9);
        addEvent($("#Haid10"), "click", lol10);
        addEvent($("#Haid11"), "click", lol11);
        addEvent($("#Haid12"), "click", lol12);
        addEvent($("#Haid13"), "click", lol13);
        addEvent($("#Haid14"), "click", lol14);
        addEvent($("#Haid15"), "click", lol15);
        addEvent($("#Haid16"), "click", lol16);
        addEvent($("#Haid17"), "click", lol17);
        addEvent($("#Haid18"), "click", lol18);
        addEvent($("#Haid19"), "click", lol19);

//}


       


})();