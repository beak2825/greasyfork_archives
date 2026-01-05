// ==UserScript==
// @name           pomf_restore
// @namespace      de.moep.private.pomf
// @author         moep
// @description    Redirect a.pomf.se links to their closest (timewise) wayback machine result
// @version        0.1.4
// @license        CC0 1.0 Public Domain - https://creativecommons.org/publicdomain/zero/1.0/
// @match          http://*/*
// @match          https://*/*
// @exclude        http://*archive.org/*
// @exclude        https://*archive.org/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at         document-end
// @noframes
// @grant          none
// @icon           data:image/x-icon;base64,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
// @downloadURL https://update.greasyfork.org/scripts/10734/pomf_restore.user.js
// @updateURL https://update.greasyfork.org/scripts/10734/pomf_restore.meta.js
// ==/UserScript==

// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt CC0 1.0 Public Domain
var pomfVM = this;
pomfVM.$ = pomfVM.jQuery = jQuery.noConflict(true);

function pomf_restore() {
    // check if we are on pomf and replace the location
    if (window.location.hostname === 'a.pomf.se') {
        getAlternativeUrl(window.location.href, function(alternativeUrl) {
            window.location.href = alternativeUrl;
        });
        return;
    }
    
    // cache urls for multi-use on single page
    var urlCache = {},
        urlImageNotFound = 'https://i.imgur.com/BCpndNT.png',
        urlVideoNotFound = 'https://d.maxfile.ro/dzftnanord.webm';

    // fetch all pomf links and images
    var links = pomfVM.$('[href*="a.pomf.se"]'),
        images = pomfVM.$('[src*="a.pomf.se"]');
    
    checkLinks(links);
    checkImages(images);
    
    // create observer for new links and images
    var target = document.body,
        observer = new MutationObserver(handleMutations),
        config = { attributes: false, characterData: false, childList: true, subtree: true};
    
    observer.observe(target, config);
    
    
    
    
    // helper functions
    function handleMutations(mutations) {
        pomfVM.$(mutations).each(function(index, mutation) {
            if (typeof mutation.addedNodes === 'undefined') { return; }
            pomfVM.$(mutation.addedNodes).each(function(index, addedNode) {
                var links = pomfVM.$('[href*="a.pomf.se"]', pomfVM.$(addedNode)),
                    images = pomfVM.$('[src*="a.pomf.se"]', pomfVM.$(addedNode));
                
                checkLinks(links);
                checkImages(images);
            });
        });
    }
    
    function getAlternativeUrl(sourceLink, callback, retry) {
        // check in cache
        if (typeof urlCache[sourceLink] !== 'undefined') {
            callback(urlCache[sourceLink]);
            return;
        }
        
        var client = new XMLHttpRequest();
        client.open('GET', 'https://allow-any-origin.appspot.com/' + encodeURIComponent('https://archive.org/wayback/available?url=' + encodeURIComponent(sourceLink)), true);
        // client.open('GET', 'https://alloworigin.com/get?url=' + encodeURIComponent('https://archive.org/wayback/available?url=' + encodeURIComponent(sourceLink)), true);
        client.onreadystatechange = function() {
            if (client.readyState !== 4) {
                return;
            }
            
            if (client.status !== 200) {
                if (retry === true) {
                    urlCache[sourceLink] = urlImageNotFound;
                    callback(urlImageNotFound);
                    return;
                }
                
                getAlternativeUrl(sourceLink, callback, true);
                return;
            }
            
            var archiveResponse = JSON.parse(client.response);
            if (typeof archiveResponse.archived_snapshots !== 'undefined' &&
                typeof archiveResponse.archived_snapshots.closest !== 'undefined' &&
                typeof archiveResponse.archived_snapshots.closest.url !== 'undefined') {
                
                var urlResponse = getSecureLink(archiveResponse.archived_snapshots.closest.url);
                urlCache[sourceLink] = urlResponse;
                callback(urlResponse);
            } else {
                urlCache[sourceLink] = urlImageNotFound;
                callback(urlImageNotFound);
            }
        };
        client.send(null);
    }
    
    function getHostName(link) {
        var a = document.createElement('a');
        a.href = link;
        return a.hostname;
    }
    
    function getSecureLink(link) {
        var secureA = document.createElement('a');
        secureA.href = link;
        secureA.protocol = 'https:';
        return secureA.href;
    }
    
    function checkLinks(links) {
        links.each(function(index, item) {
            if (getHostName(pomfVM.$(item).attr('href')) === 'a.pomf.se') {
                getAlternativeUrl(pomfVM.$(item).attr('href'), function(alternativeUrl) {
                    pomfVM.$(item).attr('href', alternativeUrl);
                });
            }
        });
    }
    
    function checkImages(images) {
        images.each(function(index, item) {
            if (getHostName(pomfVM.$(item).attr('src')) === 'a.pomf.se') {
                getAlternativeUrl(pomfVM.$(item).attr('src'), function(alternativeUrl) {
                    if (alternativeUrl === urlImageNotFound) {
                        if (!pomfVM.$(item).is('img')) {
                            alternativeUrl = urlVideoNotFound;
                            if (pomfVM.$(item).parent().is('video')) {
                                pomfVM.$(item).parent().attr('src', alternativeUrl);
                            }
                        }
                    }
                    
                    pomfVM.$(item).attr('src', alternativeUrl);
                });
            }
        });
    }
}

if (document.body) {
    pomf_restore();
}
// @license-end
