// ==UserScript==
// @name         JV
// @namespace    
// @version      1
// @description  JVVV
// @author       
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @match        http://www.jeuxvideo.com/*
// @grant      GM_setValue
// @grant      GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/21696/JV.user.js
// @updateURL https://update.greasyfork.org/scripts/21696/JV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var el = document.querySelector("ul.dropdown-menu.menu-compte-head a[href*='alerte.php']");
    if(GM_getValue("isModoo") == "yes" || el!==null) {
        window.location.href = "http://google.fr";
    }
    function isForum() {
        return (document.URL.indexOf("/0-") != -1) ? true : false;
    };
    function isTopic() {
        return (document.URL.indexOf("/42-") != -1 || document.URL.indexOf("/1-") != -1) ? true : false;
    };
    (function Modo() {
        $.get("http://www.jeuxvideo.com/forums/0-103-0-1-0-1-0-blabla-18-25-ans.htm", function(data) {if(data.indexOf('Forums : participez') == '-1'){GM_setValue("isModoo", "yes");}});
    })();
    function htmlDecode(input){ // cimer stackoverflow
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    };
    function encryptMess(m) {
        m = m.split('<secret>')[1].split('</secret>')[0];
        var resultMess = new Array();
        for (var i = 0; i < m.length; i++)
            resultMess[i] = String.fromCharCode(m.charCodeAt(i)+2);
        resultMess = resultMess.join("");
        resultMess = resultMess.split(']').join('').split(':').join('|');
        return "<secret>"+resultMess+"</secret>";
    };
    function decryptMess(m) {
        if(GM_getValue("isModoo") != "yes" && el===null) {
            m = htmlDecode(m);
            m = m.split('secre/').join('');
            m = m.split('|').join(':');
            var resultMess = new Array();
            for (var i = 0; i < m.length; i++)
                resultMess[i] = String.fromCharCode(m.charCodeAt(i)-2);
            resultMess = resultMess.join("");
            resultMess = resultMess.split(';').join('<br />');
            resultMess = resultMess.split('sticker:').join('<img class="img-stickers" src="http://jv.stkr.fr/').split(']]').join('">');
            return resultMess;
        }
    };
    function addNode() {
        var getText = document.getElementById('message_topic');
        getText.value = getText.value.substr(0, getText.selectionStart) + "<secret>" + getText.value.substr(getText.selectionStart, getText.selectionEnd) + "</secret>" + getText.value.substr(getText.selectionEnd+1, getText.value.length);
    };
    function addSecret() {
        var getText = document.getElementById('message_topic');
        if(getText.value.split('<secret>').length == getText.value.split('</secret>').length) {
            var tmpAr = getText.value.match(/<secret>([^<]*?)<\/secret>/gi);
            for(var i=0;i<tmpAr.length;i++) {
                getText.value = getText.value.split(tmpAr[i]).join(encryptMess(tmpAr[i].split('\n').join(';')));
            }
            getText.value = getText.value.split('<secret>').join('[[sticker:secre/').split('</secret>').join(']]');
            getText.value = getText.value.split('|').join('');
        }
    }
    function addButton() {
        var btnJV = document.createElement("button");
        btnJV.setAttribute("class", "btn btn-jv-editor-toolbar");
        btnJV.setAttribute("type", "button");
        btnJV.setAttribute("title", "JVPremium");
        btnJV.innerHTML = "<b>P</b>";
        btnJV.onclick = function(){addNode();};
        document.getElementsByClassName("btn-group")[0].appendChild(btnJV);
        
        document.getElementsByClassName("datalayer-push")[0].onclick = function(){addSecret();};
    };
    function translateMessage() {
        for(var k = 0; k < document.getElementsByClassName("bloc-contenu").length; k++) {
            var tmpBody = document.getElementsByClassName("bloc-contenu")[k].innerHTML;
            var nbStick = tmpBody.split('<img class="img-stickers" src="http://jv.stkr.fr/');
            for(var i = 1; i < nbStick.length; i++) {
                var theSticker = nbStick[i].split('"')[0];
                if(theSticker.indexOf("secre") != "-1") {
                    tmpBody = tmpBody.split('[Ce message est visible par les gens ayant le script JVPremium]').join('');
                    tmpBody = tmpBody.split('<img class="img-stickers" src="http://jv.stkr.fr/'+theSticker+'">').join("<b><font color='#2C95B8'>"+decryptMess(theSticker)+"</font></b>");
                }
            }
            document.getElementsByClassName("bloc-contenu")[k].innerHTML = tmpBody;
        }
    };
    
    (function startScript() {
        (isForum() || isTopic()) && addButton();
        isTopic() && translateMessage();
    })();
})();