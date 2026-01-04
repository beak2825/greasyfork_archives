// ==UserScript==
// @name         Change Notion.so NP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display a small panel to let you change the language back to avoid NP styling for every pages in notion.so
// @author       Felix Zhong
// @match        https://www.notion.so/*
// @grant        none
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/415994/Change%20Notionso%20NP.user.js
// @updateURL https://update.greasyfork.org/scripts/415994/Change%20Notionso%20NP.meta.js
// ==/UserScript==


var currentPath = '';
var inited = false;
var switherId = 'lang-switcher';
var availableLangs = ['en','zh-CN','jp']; // Change this if you want a different language.

debugger


function run() {

    function setLang(lang) {
        document.getElementsByTagName("html")[0].setAttribute("lang", lang);
        var path = window.location.pathname;
        langs[path] = lang;

        var panel = document.getElementById(switherId);
        if (!panel) return;

        var items = Array.from(panel.children)

        items.forEach(function(item){
            item.style.background = 'transparent';

            if( item.innerHTML === lang) {
                item.style.background = '#ccc';
            }

        })
    }

    function createPanel() {
        var parent = document.getElementsByClassName('notion-topbar')[0];
        if (!parent) return;


        var panel = document.createElement("div");
        panel.id = switherId;
        panel.style.background = '#eee';
        panel.style.position = 'absolute';
        panel.style.right = '300px';
        panel.style.padding= '0.2em 0';
        panel.style.borderRadius = '0 0 3px 3px';


        availableLangs.forEach(function(lang){
            var item = document.createElement("span");

            item.innerHTML = lang;
            item.style.margin= '0.2em 0.2em';
            item.style.padding ='0.1em 0.4em';
            item.style.cursor = 'pointer';
            item.style.borderRadius = '3px';

            item.addEventListener('click', function(event){
                setLang(event.target.innerHTML)
                saveLangs();
            })
            panel.appendChild(item)
        })

        parent.appendChild(panel);
        inited = true;
    }

    function saveLangs() {
        localStorage.setItem('customlangs',JSON.stringify(langs) );
    }


    var defaultLang = 'en'
    var langs = JSON.parse(localStorage.getItem('customlangs')) || {};
    var path = window.location.pathname;
    var currentLang = langs[path] || defaultLang;

    if (!inited) {
        createPanel();
    }
    setLang(currentLang);

}


// create an observer instance
var observer = new MutationObserver(function() {
    var path = window.location.pathname;
    if (currentPath !== path || !inited) {
        currentPath = path;
        setTimeout(run, 0)
    }
});

var config = { characterData: true, attributes: false, childList: true, subtree: true };
var mutgt = document.body;
observer.observe(mutgt, config);
