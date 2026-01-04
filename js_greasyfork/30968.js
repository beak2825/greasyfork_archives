// ==UserScript==
// @name         PlayStore to Appbrain
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show apps on appbrain
// @author       Yassine Nacer AKA YassineLinX
// @match        https://play.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30968/PlayStore%20to%20Appbrain.user.js
// @updateURL https://update.greasyfork.org/scripts/30968/PlayStore%20to%20Appbrain.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function () {

function AddButton()
    {
        var btn = document.createElement("BUTTON");
        var btn_txt = document.createTextNode("GET INFOS");
        btn.appendChild(btn_txt);
        document.body.appendChild(btn);
        //var elements = document.getElementsByClassName('details-actionse');
        //var requiredElement = elements[0];
        //window.console.log(elements);
        //requiredElement.appendChild(btn);
        btn.style.position = "fixed";
        btn.style.top = "110px";
        btn.style.right = "10px";
        btn.setAttribute("onclick", "test()");
        btn.style.color = 'red';
        btn.style.fontWeight='bold';
        btn.style.fontSize = '18px';
    }
AddButton();
window.test = function()
{
    // var app_url = window.prompt("Enter a new score");
    var app_url = window.location.href;
    //window.alert(app_url);
    //window.location = 'http://www.appbrain.com/search?q=' + app_url;
    var url_goto = app_url.split('details?id=')[1];
    //window.open('http://www.appbrain.com/search?q=' + url_goto, '_blank');
    window.open('http://www.appbrain.com/app/' + url_goto, '_blank');

};

})();