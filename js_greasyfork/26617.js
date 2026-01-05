// ==UserScript==
// @name         Hubspot - Download Calls - Company Engagement
// @version      0.1
// @description  Enable downloading of Hubspot calls from company engagement list
// @author       Paul Fleming
// @match        https://app.hubspot.com/*
// @namespace https://greasyfork.org/users/95626
// @downloadURL https://update.greasyfork.org/scripts/26617/Hubspot%20-%20Download%20Calls%20-%20Company%20Engagement.user.js
// @updateURL https://update.greasyfork.org/scripts/26617/Hubspot%20-%20Download%20Calls%20-%20Company%20Engagement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function loadData(response) {        
        var data = {};
        try { data = JSON.parse(response); } catch (err) { return; }                

        if (!data || !data.events || !data.events.length)
            return;
        
        var results = [];

        for (var i = 0; i < data.events.length; i++) {
            var ev = data.events[i];

            if (!ev.eventData || !ev.eventData.metadata || !ev.eventData.metadata.recordingUrl)
                continue;

            var result = {
                id: ev.id,
                url: ev.eventData.metadata.recordingUrl,
                selector: '.timeline-card-section-bottom-border.section-call-recording[data-reactid*="' + ev.id + '"]',
                get element() { return document.querySelector(this.selector); }
            };

            results.push(result);
        }
        
        return results;
    }
    
    function applyDownloadLinks(results) {
        var className = 'pf-download-link';
        var notFound = false;
        
        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            
            if (!item.element) {
                notFound = true;
                continue;
            }
            
            var link = document.querySelector(item.selector + ' .' + className);
            
            if (!link) {
                link = document.createElement('a');            
                link.className = className;
                link.setAttribute('title', '* Injected by Paul Fleming\'s Super Script!');
                link.setAttribute('download', '');
                link.innerText = 'Download';
                item.element.appendChild(link);
            }
            
            link.setAttribute('href', item.url);
        }
        
        if (notFound)
            window.setTimeout(function() {applyDownloadLinks(results); }, 100);
    }

    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if (!this.responseURL)
                    return;
                
                if (!this.responseURL.match(/timeline\/v2\/companies/i))
                    return;
                
                if (!this.response)
                    return;
                
                var results = loadData(this.response);
                
                if (results && results.length)
                    applyDownloadLinks(results);
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();