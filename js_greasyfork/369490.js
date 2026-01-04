// ==UserScript==
// @name         keyvalue buttons
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  try to take over the world!
// @author       You
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/helpdeskmessage/*
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/helpdeskmessage/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369490/keyvalue%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/369490/keyvalue%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest ({
        method:     "GET",
        url:        "https://codepen.io/alanwork100/pen/aRPWBB.css", //RubyButtons
        onload:     function (response){
            GM_addStyle (response.responseText);
            console.log(response);
        }
    });
    GM_xmlhttpRequest ({
        method:     "GET",
        url:        "https://codepen.io/alanwork100/pen/LgMyZy.css", //otherSupportButtons
        onload:     function (response){
            GM_addStyle (response.responseText);
            console.log(response);
        }
    });

    var bakTestStorageLnk = "http://bakeacakeserver.milamit.cz/bakeacake/admin/bakeacakeios/keyvalue/zzzzzzzzzzz_2FStorage.qtbin/";
    var bakKeyvalLnk;
    if(window.location.href.match(/http:\/\/bakeacakeserver\.milamit\.cz\/bakeacake(-qa)?\/admin\/bakeacakeios\/helpdeskmessage\//) != null){
        if(window.location.href.match(/http:\/\/bakeacakeserver\.milamit\.cz\/bakeacake(-qa)?\/admin\/bakeacakeios\/helpdeskmessage\//)[1] == "-qa"){
            bakKeyvalLnk = "http://bakeacakeserver.milamit.cz/bakeacake-qa/admin/bakeacakeios/keyvalue/?q=";
        }
        else {
            bakKeyvalLnk = "http://bakeacakeserver.milamit.cz/bakeacake/admin/bakeacakeios/keyvalue/?q=";
        }
    }

    var MLTestStorageLnk = "http://matchlandserver.milamit.cz/matchland/admin/matchlandios/keyvalue/xxxxxx_2FStorage.qtbin/"
    var MLKeyvalLnk;
    if(window.location.href.match(/http:\/\/matchlandserver\.milamit\.cz\/matchland(-qa)?\/admin\/matchlandios\/helpdeskmessage\//) != null){
        if(window.location.href.match(/http:\/\/matchlandserver\.milamit\.cz\/matchland(-qa)?\/admin\/matchlandios\/helpdeskmessage\//)[1] == "-qa"){
            MLKeyvalLnk = "http://matchlandserver.milamit.cz/matchland-qa/admin/matchlandios/keyvalue/?q="
        }
        else {
        MLKeyvalLnk = "http://matchlandserver.milamit.cz/matchland/admin/matchlandios/keyvalue/?q="
        }
    }

    var bakPlayerDBLnk = "http://bakeacakeserver.milamit.cz/bakeacake/admin/bakeacakeios/player/?q="
    var MLPlayerDBLnk = "http://matchlandserver.milamit.cz/matchland/admin/matchlandios/player/?q="

    function addingButtons(lnk1, lnk2, lnk3){
        //Adding buttons
        var coreDiv = document.createElement("div");
        coreDiv.id = "keyvalButtsWrapper";

        //button1
        var butt1 = document.createElement("div");
        butt1.id = "keyButtTest";
        butt1.className = "keyButt";

        var ahref = document.createElement("a");
        ahref.innerHTML = "Test keyvalue"
        var attr1 = document.createAttribute("href");
        attr1.value = lnk1;
        var attr2 = document.createAttribute("target");
        attr2.value = "_blank";

        butt1.appendChild(ahref);
        coreDiv.appendChild(butt1);
        ahref.setAttributeNode(attr1);
        ahref.setAttributeNode(attr2);

        //button2
        var butt2 = document.createElement("div");
        butt2.id = "keyButtDevId";
        butt2.className = "keyButt";

        var ahref2 = document.createElement("a");
        ahref2.innerHTML = "ID keyvalue"
        var attr3 = document.createAttribute("href");
        attr3.value = lnk2 + document.getElementById("id_username").value;
        var attr4 = document.createAttribute("target");
        attr4.value = "_blank";

        butt2.appendChild(ahref2);
        coreDiv.appendChild(butt2);
        ahref2.setAttributeNode(attr3);
        ahref2.setAttributeNode(attr4);

        //button3
        var butt3 = document.createElement("div");
        butt3.id = "copyID";
        butt3.className = "keyButt";
        butt3.innerHTML = "copyDeviceID";
        coreDiv.appendChild(butt3);

        //button4
        var butt4 = document.createElement("div");
        butt4.id = "openP"
        butt4.className = "keyButt";
        var ahref3 = document.createElement("a");
        ahref3.setAttribute("href", lnk3);
        ahref3.setAttribute("target", "_blank");
        ahref3.innerHTML = "openPlayer";
        butt4.appendChild(ahref3);
        coreDiv.appendChild(butt4);
        document.getElementById("id_body").after(coreDiv);

        var playerUID = /(User Name\s*)(.*)/.exec(document.querySelectorAll("#id_body")[0].value)[2]
        if (playerUID == "NotFacebookUser" || playerUID == "NotFb" || playerUID.match(/Social Id/) != null) {
            playerUID = /Device Id\s*(\S*)/.exec(document.querySelectorAll("#id_body")[0].value)[1];
        }
        var newHref = document.querySelectorAll("#openP>a")[0].getAttribute("href") + playerUID;
        document.querySelectorAll("#openP>a")[0].setAttribute("href", newHref);
    }

    if (window.location.href.includes("?_changelist_filters=q") && window.location.href.includes("http://bakeacakeserver.milamit.cz/bakeacake")){
        addingButtons(bakTestStorageLnk,bakKeyvalLnk,bakPlayerDBLnk);
    }
    else if (window.location.href.includes("?_changelist_filters=q") && window.location.href.includes("http://matchlandserver.milamit.cz/matchland")){
        addingButtons(MLTestStorageLnk,MLKeyvalLnk,MLPlayerDBLnk);
    }

    (function($) { //Django wrapper
        $( "#copyID" ).click(function() {
            var txtar = document.createElement("textarea");
            txtar.value = /Device Id\s*(\S*)/.exec(document.querySelectorAll("#id_body")[0].value)[1];
            document.querySelectorAll("#keyvalButtsWrapper")[0].appendChild(txtar);
            txtar.select();
            document.execCommand('copy');
            txtar.remove();
            console.log("tik");
        });
    })(django.jQuery);


})();

