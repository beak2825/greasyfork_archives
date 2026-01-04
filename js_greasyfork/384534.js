// ==UserScript==
// @name         WoltLab Suite - New Topics
// @author       ardiman
// @namespace    http://openuserjs.org/users/ardiman
// @description  Generates button which opens all new topics of woltlab-boards in tabs
// @description:de-DE Erstellt in woltlab-Foren eine Schaltfläche, die alle neuen Posts in Tabs öffnet.
// @grant        GM_openInTab
// @homepage     https://github.com/ardiman/userscripts/tree/master/woltlabsuitenewtopics
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      https://www.camp-firefox.de/forum/forum/*
// @license      CC-BY-NC-SA-3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.0.1
// @date         2019-06-05
// @downloadURL https://update.greasyfork.org/scripts/384534/WoltLab%20Suite%20-%20New%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/384534/WoltLab%20Suite%20-%20New%20Topics.meta.js
// ==/UserScript==

(function (){

// Konfiguration
var maxlnks = 0; // 0=open all new threads, 10=open first 10 new threads
var showBtnIf = 1; // 0=button will always be shown, 5=show only, if there are more than 4 new threads
var useTimeout = true; // don't attempt delay on thread-read cookie setting - YMMV - the timeout delay didn't work for me, so =false
var tOut = 800; // set timeout in milliseconds for opening (cookies won't be stored if too low!)
var oMode = true; // =true: show first *unread* post, =false: show first post/beginning of thread
// Ende der Konfiguration

/* x-browser event register */
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) { elm.addEventListener(evType, fn, useCapture); return true; }
    else if (elm.attachEvent) { var r = elm.attachEvent('on' + evType, fn); return r; }
    else { elm['on' + evType] = fn; }
}

/* x-browser open tab */
function openTab(url) {
    if (typeof GM_openInTab != 'undefined') GM_openInTab(url); // for tampermonkey or greasemonkey
    else if (typeof PRO_openInTab != 'undefined') PRO_openInTab(url,2); // for ie7pro
    else window.open(url);
}

var f = 0;
var newposts = [];
// alle Links zu neuen Beitraegen finden
// var lnks = document.evaluate(".//ol[@class='tabularListColumns messageGroup wbbThread jsClipboardObject new']//li[@class='columnSubject']//h3//a", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE , null);
var lnks = document.evaluate(".//ol[contains(@class,'new')]//li[@class='columnSubject']//h3//a", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE , null);
var thisnode;

for (var i=0; i < lnks.snapshotLength; i++) {
  thisnode = lnks.snapshotItem(i);
  if (oMode) {
    newposts.push(thisnode.href); // den direkten Link zum ungelesen Beitrag speichern
   } else {
    newposts.push(thisnode.href.replace(/\?action=firstNew/, "")); // (bereinigten) Link zum Thread speichern
  }
  f++;
  // falls nur die ersten x neuen Beitraege geoeffnet werden sollen, dann raus hier:
  if (f+1 > maxlnks && maxlnks > 0) break;
}

// Button generieren, sofern noetig
if (f >= showBtnIf) {
  // Zieldiv finden
  var targetnode = document.evaluate("//nav[@class='contentHeaderNavigation']//ul", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  // normalerweise ist erster nav-Abschnitt mit class=contentHeaderNavigation {snapshotItem(0)} derjenige mit dem Button "NeuesThema" -> da soll's also hin
  var targetitem = targetnode.snapshotItem(0).appendChild(document.createElement('li'));
  var btn = targetitem.appendChild(document.createElement('a'));
  if (f > 1) {
    btn.innerHTML = "<span class='icon icon16 fa-rocket'></span><span> &Ouml;ffne " + f + " neue Beitr&auml;ge </span>";
   } else {
    btn.innerHTML = "<span class='icon icon16 fa-rocket'></span><span> &Ouml;ffne neuen Beitrag</span>";
  }
  btn.href="#";
  btn.setAttribute("class","button");
  addEvent(btn, "click",
    function(e) {
      if (maxlnks===0) this.style.display = 'none';
      if (e && e.target) e.preventDefault();
      else window.event.returnValue = false;
      if (useTimeout) {
        var i = -1;
        function inner() {
          if(++i < f) openTab(newposts[i]);
          else clearInterval(timer);
        }
        var timer = setInterval(inner, tOut);
      } else {
        var n=0;
        for (n < newposts.length; n++;) {
          openTab(newposts[n]);
        }
      }
    }
  , false);
  }
})();