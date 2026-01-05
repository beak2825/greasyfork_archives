// ==UserScript==
// @name         WaterlooWorksNow
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Waterloo Works script to add more features. Adds new tab functionality to listings and an expiring-soon indicator.
// @author       jyntran
// @match        https://waterlooworks.uwaterloo.ca/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29916/WaterlooWorksNow.user.js
// @updateURL https://update.greasyfork.org/scripts/29916/WaterlooWorksNow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var wwn = window.wwn = {};

    wwn.openTab = function(fn){
        var newTab = window.open(window.location.href);
        var fnBody = fn.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1].trim();
        localStorage.setItem("wwnJobOpener", 'window.' + fnBody.toString());
        
        newTab.window.onload = function() {
            var loadingIconElem = document.createElement('span');
            var loadingElem = document.createElement('div');
            loadingIconElem.setAttribute('class', 'icon-cog icon-spin');
            loadingIconElem.setAttribute('style', 'font-size: 1000%; color: white;');
            loadingElem.setAttribute('id', 'wwnLoading');
            loadingElem.setAttribute('style', 'position: absolute; background: black; background: rgba(0,0,0,0.5); width: 100%; height: 100%; top: 0; left: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;');
            loadingElem.appendChild(loadingIconElem);
            newTab.window.document.body.appendChild(loadingElem);
            
            newTab.window.eval(localStorage.wwnJobOpener);
        };
    };
    
    function renderExpiring() {
        $('.isAboutToExpire td:nth-child(' + 4 + ')').append(function() {
            var expiringElem = $('<span></span>');
            expiringElem.attr({
                'class': 'icon-exclamation-sign wwn-expiring',
                'style': 'color: #c00; margin: auto 4px',
                'title': 'Deadline today'
            });
            return expiringElem;
        });
    }
    
    function renderNewTabButtons() {
        // append button to listing
        $('.searchResult td:nth-child(' + 4 + ')').append(function(){
            var linkElem = $(this).find('a').get(0);
            var onclickContents = linkElem.onclick;
            var newTabSpanElem = $('<span></span>');
            newTabSpanElem.attr({
                'class': 'icon-external-link'
            });
            var newTabElem = $('<button></button>');
            newTabElem.attr({
                'class': 'btn btn-mini wwn-newtab',
                'style': 'margin: auto 4px',
                'title': 'Open in new tab',
                'onclick': 'wwn.openTab('+ onclickContents +');'
            });
            newTabElem.append(newTabSpanElem);
            return newTabElem;
        });
        
        // remove br element after job title link
        $('.searchResult td:nth-child(' + 4 + ') br').remove();
    }
    
    function renderWWN() {
        if (!$('.wwn-expiring').length) {
            renderExpiring();
        }
        if (!$('.wwn-newtab').length) {
            renderNewTabButtons();
        }
        
        $('#postingsTable').on('click', function() {
            setTimeout(renderWWN, 200);
        });
    }
    
    $(document).ready(renderWWN);
    

})();
