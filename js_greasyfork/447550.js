// ==UserScript==
// @name         Highlight lists
// @namespace    http://tampermonkey.net/
// @version      1.1.8
// @description  Mettre en évidence (via couleurs) certaines listes dans trello
// @author       You
// @match        https://trello.com/b/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447550/Highlight%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/447550/Highlight%20lists.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentList = null;

    var listenForListOptions = function(){
        waitForElm('.pop-over.is-shown .pop-over-content.js-pop-over-content.u-fancy-scrollbar.js-tab-parent .pop-over-list li .js-move-list').then((elm) => {

            if(document.querySelector('.bebold-highlight') == null){
                var toggleTrigger = document.createElement('li');
                toggleTrigger.innerHTML ='<a href="#" class="bebold-highlight">Mettre en évidence la liste...</a>';
                toggleTrigger.addEventListener('click', highlightList);
                elm.parentElement.parentNode.insertBefore(toggleTrigger, elm.parentElement.nextSibling);
            }

        });
    }

    var mainFunction = function() {


        waitForElm('a.list-header-extras-menu.dark-hover.js-open-list-menu.icon-sm.icon-overflow-menu-horizontal,a.list-header-extras-menu.js-open-list-menu.icon-sm.icon-overflow-menu-horizontal').then((elm) => {
            console.log("mainFunction Highlight lists");

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === "attributes") {
                        var isCorrectPopup = document.querySelector('.pop-over.is-shown .pop-over-content.js-pop-over-content.u-fancy-scrollbar.js-tab-parent .pop-over-list li .js-move-list');
                        if(isCorrectPopup != null && document.querySelector('.bebold-highlight') == null){
                            var toggleTrigger = document.createElement('li');
                            toggleTrigger.innerHTML ='<a href="#" class="bebold-highlight">Mettre en évidence la liste...</a>';
                            toggleTrigger.addEventListener('click', highlightList);
                            isCorrectPopup.parentElement.parentNode.insertBefore(toggleTrigger, isCorrectPopup.parentElement.nextSibling);

                        }
                    }
                });
            });

            observer.observe(document.querySelector('.window-overlay ~ .pop-over'), {
                attributes: true //configure it to listen to attribute changes
            });

            var highlightedColor = Cookies.get('bebold-highlight-list-highlight-color');
            var ListColor = Cookies.get('bebold-highlight-list-default-color');
            var ListFontColor = Cookies.get('bebold-highlight-list-highlight-font-color');
            var DefaultListFontColor = Cookies.get('bebold-highlight-list-default-font-color');
            if(!highlightedColor){
                highlightedColor = "#ebecf0";
                Cookies.set('bebold-highlight-list-highlight-color', highlightedColor, { expires: 365, path: '' });
            }
            if(!ListColor){
                ListColor = "#3e3e3e4f";
                Cookies.set('bebold-highlight-list-default-color', ListColor, { expires: 365, path: '' });
            }
            if(!ListFontColor){
                ListFontColor = "#172b4d";
                Cookies.set('bebold-highlight-list-highlight-font-color', ListFontColor, { expires: 365, path: '' });
            }
            if(!DefaultListFontColor){
                DefaultListFontColor = "#ffffff";
                Cookies.set('bebold-highlight-list-default-font-color', DefaultListFontColor, { expires: 365, path: '' });
            }
            var highlightedLists = Cookies.get('bebold-highlight-list');
            const style = document.createElement('style');
            style.textContent = `
                            .list.js-list-content:not(.bebold-highlighted){
                                background:`+ListColor+` !important;
                            }
                            .list.js-list-content:not(.bebold-highlighted), .list.js-list-content:not(.bebold-highlighted) .list-header-name, .list.js-list-content:not(.bebold-highlighted) .cc-controls a{
                                color:`+DefaultListFontColor+` !important;
                            }
                            .list.js-list-content:not(.bebold-highlighted) p.list-header-num-cards.hide.js-num-cards,.list.js-list-content:not(.bebold-highlighted) .card-composer-container,.list.js-list-content:not(.bebold-highlighted) .card-composer-container span,.list.js-list-content:not(.bebold-highlighted) .list-header-extras-menu,.list.js-list-content:not(.bebold-highlighted) .list-header-num-cards{
                                color:`+DefaultListFontColor+`80 !important;
                            }`;
            document.head.append(style);
            if(highlightedLists){
                const stylehighlighted = document.createElement('style');
                stylehighlighted.textContent = `
                            .bebold-highlighted{
                                background:`+highlightedColor+` !important;
                            }
                            .bebold-highlighted, .bebold-highlighted .list-header-name, .bebold-highlighted .cc-controls a{
                                color:`+ListFontColor+` !important;
                            }
                            .bebold-highlighted p.list-header-num-cards.hide.js-num-cards,.bebold-highlighted .card-composer-container,.bebold-highlighted .card-composer-container span,.bebold-highlighted .list-header-extras-menu,.bebold-highlighted .list-header-num-cards{
                                color:`+ListFontColor+`b0 !important;
                            }`;
                document.head.append(stylehighlighted);
                var listsToHighlight = highlightedLists.split('9G4F28');
                listsToHighlight.forEach(function(listText) {
                    //var list = document.evaluate("//textarea[matches(., '"+listText+"')]", document, null, XPathResult.ANY_TYPE, null );{
                    var list = document.evaluate("//textarea[./text()='"+listText+"']", document, null, XPathResult.ANY_TYPE, null );
                    list = list.iterateNext();
                    if(list){
                        list.parentElement.parentElement.classList.add('bebold-highlighted');
                    }
                });
            }


            document.querySelectorAll('a.list-header-extras-menu.dark-hover.js-open-list-menu.icon-sm.icon-overflow-menu-horizontal').forEach(function(listOption) {
                listOption.addEventListener('click', function(){
                    currentList = this.parentElement.parentElement.querySelector('textarea.list-header-name.mod-list-name.js-list-name-input').textContent;
                });
            });
        });

    };

    // basically wait for DOM ready
    waitForElm('.board-header').then((elm) => {
        mainFunction();
    });

    function highlightList(e) {

        var highlightedLists = Cookies.get('bebold-highlight-list');
        if(!highlightedLists) highlightedLists = '';
        else highlightedLists += '9G4F28';
        highlightedLists += currentList;
        Cookies.set('bebold-highlight-list', highlightedLists, { expires: 365, path: '' });

        var list = document.evaluate("//textarea[contains(., '"+currentList+"')]", document, null, XPathResult.ANY_TYPE, null );
        list = list.iterateNext();
        if(list){
            list.parentElement.parentElement.classList.add('bebold-highlighted');
            document.querySelector('a.pop-over-header-close-btn.icon-sm.icon-close').click();
        }

    }
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    /*! js-cookie v3.0.1 | MIT */
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o}}())}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}return function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}));


})();