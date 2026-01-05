// ==UserScript==
// @name         JVPrenium remplacement
// @namespace    
// @version      4
// @description  JuifV Premium est là :bave:
// @author       
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21685/JVPrenium%20remplacement.user.js
// @updateURL https://update.greasyfork.org/scripts/21685/JVPrenium%20remplacement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function isForum() {
        return (document.URL.indexOf("/0-") != -1) ? true : false;
    };
    function isTopic() {
        return (document.URL.indexOf("/42-") != -1 || document.URL.indexOf("/1-") != -1) ? true : false;
    };
    function htmlDecode(input){ // cimer stackoverflow
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    };
    function encryptMess(m) {
        m = m.split('<juif>')[1].split('</juif>')[0];
        var resultMess = new Array();
        for (var i = 0; i < m.length; i++)
            resultMess[i] = String.fromCharCode(m.charCodeAt(i)+1);
        resultMess = resultMess.join("");
        resultMess = resultMess.split(']').join('').split(':').join('|');
        return "<juif>"+resultMess+"</juif>";
    };
    function decryptMess(m) {
        m = htmlDecode(m);
        m = m.split('juif/').join('');
        m = m.split('|').join(':');
        var resultMess = new Array();
        for (var i = 0; i < m.length; i++)
            resultMess[i] = String.fromCharCode(m.charCodeAt(i)-1);
        resultMess = resultMess.join("");
        resultMess = resultMess.split(';').join('<br />');
        return resultMess;
    };
    function addNode() {
        var getText = document.getElementById('message_topic');
        getText.value = getText.value.substr(0, getText.selectionStart) + "<juif>" + getText.value.substr(getText.selectionStart, getText.selectionEnd) + "</juif>" + getText.value.substr(getText.selectionEnd+1, getText.value.length);
    };
    function addjuif() {
        var getText = document.getElementById('message_topic');
        if(getText.value.split('<juif>').length == getText.value.split('</juif>').length) {
            var tmpAr = getText.value.match(/<juif>([^<]*?)<\/juif>/gi);
            for(var i=0;i<tmpAr.length;i++) {
                getText.value = getText.value.split(tmpAr[i]).join(encryptMess(tmpAr[i].split('\n').join(';')));
            }
            getText.value = getText.value.split('<juif>').join('[[sticker:juif/').split('</juif>').join(']]');
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
        
        document.getElementsByClassName("datalayer-push")[0].onclick = function(){addjuif();};
    };
    function translateMessage() {
        for(var k = 0; k < document.getElementsByClassName("bloc-contenu").length; k++) {
            var tmpBody = document.getElementsByClassName("bloc-contenu")[k].innerHTML;
            var nbStick = tmpBody.split('<img class="img-stickers" src="http://jv.stkr.fr/');
            for(var i = 1; i < nbStick.length; i++) {
                var theSticker = nbStick[i].split('"')[0];
                if(theSticker.indexOf("juif") != "-1") {
                    tmpBody = tmpBody.split('[Ce message est visible par les gens ayant le script JVPremium]').join('');
                    tmpBody = tmpBody.split('<img class="img-stickers" src="http://jv.stkr.fr/'+theSticker+'">').join("<font color='#2C95B8'>"+decryptMess(theSticker)+"</font>");
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