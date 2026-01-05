// ==UserScript==
// @name         Namejs on chrome
// @namespace    https://greasyfork.org/en/users/28033-expiorer
// @version      0.11
// @description  enter something useful
// @author       You
// @match        http://namejs.jelgava.lv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22177/Namejs%20on%20chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/22177/Namejs%20on%20chrome.meta.js
// ==/UserScript==

function sclPost2( adrese )
{
    //window.location.href=adrese;
    window.open(adrese);
}
function OpenChildWindow(adrese)
{
    //window.location.href=adrese;
    window.open(adrese);
}

    function popupCenter(url, title, w, h) {
      var left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2);
      return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    }

function OpenSearchWindow(nosaukums,adrese)
{
    //window.open(adrese);
    //var para = document.getElementById("fraDownload");
    //para.setAttribute("src", adrese);
    //para.setAttribute("width", "100%");
    //para.setAttribute("height", "100%");
    //para.setAttribute("style", "");
    
    var h=600;
    var w=600;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    window.open(adrese, nosaukums, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
   
    //var element = document.getElementById("div1");
    //var child = document.getElementById("p1");
    //element.insertBefore(para,child);
    
    //document.getElementById("iframea").src=websel;
}

//addJS_Node (sclPost2);
addJS_Node (OpenChildWindow);//atverot dokumentu
addJS_Node (OpenSearchWindow);//atverot meklētāja logu

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}
