// ==UserScript==
// @name Redirect old Nexus Mods links
// @description Redirects old and broken links from Nexus Mods to the new links
// @version 0.2.2
// @namespace Violentmonkey Scripts
// @match https://*.nexusmods.com/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/377574/Redirect%20old%20Nexus%20Mods%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/377574/Redirect%20old%20Nexus%20Mods%20links.meta.js
// ==/UserScript==

(function() {
    var href = document.location.href;
    var oldhref = href;
    
    function replacelink(href) {
        var match;
        // http://www.newvegasnexus.com/downloads/file.php?id=36902
        match = href.match(/:\/\/(?:www\.)?([a-z0-9]+)nexus\.com\//);
        if (match) {
            href = href.replace(/:\/\/[^/]*\//, "://" + match[1] + ".nexusmods.com/");
        }

        match = href.match(/:\/\/([a-z0-9]+)\.nexusmods\.com\/mods\//);
        if (match) {
            // https://staticdelivery.nexusmods.com/mods/110/images/98548/98548-1562953001-1271923712.jpeg
            if (match[1].startsWith("static"))
                return href;
            href = href.replace(/:\/\/[^/]*\/mods\//, "://www.nexusmods.com/" + match[1] + "/mods/");
        }
        match = href.match(/:\/\/([a-z0-9]+)\.nexusmods\.com\/downloads\/+file\.php.*?[?^]id=([0-9]+)/);
        if (match) {
            href = href.replace(/:\/\/[^/]*\/.*/, "://www.nexusmods.com/" + match[1] + "/mods/" + match[2]);
        }
        match = href.match(/(:\/\/(?:www\.)?nexusmods\.com\/[^/]*)\/+downloads\/+file\.php.*?[?^]id=([0-9]+)/);
        if (match) {
            href = href.replace(/:\/\/[^/]*\/.*/, match[1] + "/mods/" + match[2] + "?tab=files");
        }
        
        return href;
    }
    
    href = replacelink(href);
    if (href !== oldhref) {
        document.location = href;
        return;
    }
    
    function onload(cb) {
        if (document.readyState === "complete") {
            cb();
        } else {
            var state_cb = function() {
                if (document.readyState === "complete") {
                    cb();

                    document.removeEventListener("readystatechange", state_cb);
                }
            };

            document.addEventListener("readystatechange", state_cb);
        }
    }
    
    onload(function() {
        // Replace all links too (newvegasnexus etc. is auto-redirected, so the links themselves have to be modified)
        function replaceel(el) {
            if (!el)
                return;
            
            if (el.href && typeof el.href === "string") {
                var href = replacelink(el.href);
                if (href !== el.href)
                    el.href = href;
            }

            if (!el.childNodes || el.childNodes.length === 0) {
                var html;
                if ("innerHTML" in el) {
                    html = el.innerHTML;
                } else if ("data" in el) {
                    html = el.nodeValue;
                } else {
                    return;
                }

                var changed = false;
                var match = html.match(/(https?:\/\/[^\s"'<>]*)/g);
                if (!match)
                    return;
                for (var i = 0; i < match.length; i++) {
                    var newhref = replacelink(match[i]);
                    if (newhref !== match[i]) {
                        html = html.split(match[i]).join(newhref);
                        changed = true;
                    }
                }
                
                if (changed) {
                    if ("innerHTML" in el) {
                        el.innerHTML = html;
                    } else if ("data" in el) {
                        el.nodeValue = html;
                    }
                }
            } else if (el.childNodes && el.childNodes.length > 0) {
                for (var i = 0; i < el.childNodes.length; i++) {
                    if (el.childNodes[i].nodeName === "#text") {
                        replaceel(el.childNodes[i]);
                    }
                }
            }
        }
        
        var els = document.querySelectorAll("*");
        for (var i = 0; i < els.length; i++) {
            replaceel(els[i]);
        }
        
        var observer = new MutationObserver(function(mutations, observer) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes) {
                    for (var x = 0; x < mutations[i].addedNodes.length; x++) {
                        replaceel(mutations[i].addedNodes[x]);
                    }
                }
            }
        });
        observer.observe(document, {childList: true, subtree: true});
    });
})();