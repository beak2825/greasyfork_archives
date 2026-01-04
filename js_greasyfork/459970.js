// ==UserScript==
// @name         Persistent Invidious Settings
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  Makes Invidious settings persist across instances and in private browsing.
// @author       Veeno
// @license      GPLv3
// @connect      api.invidious.io
// @match        https://*/*
// @icon         https://invidious.io/invidious-colored-vector.svg
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459970/Persistent%20Invidious%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/459970/Persistent%20Invidious%20Settings.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(() => {
    'use strict';

    if(window.self !== window.top) return;

    function execute(domainUpToDate){
        const domain = location.hostname;

        if(!Object.hasOwn(domainUpToDate, domain)) return;

        function validateCurrentDomain(){
            domainUpToDate[domain] = true;
            GM_setValue("Invidious_DomainUpToDate", domainUpToDate);
        }

        function invalidateOtherDomains(){
            Object.keys(domainUpToDate).forEach(key => { domainUpToDate[key] = false; });
            validateCurrentDomain();
        }

        const storedSettings = GM_getValue(
            "Invidious_Settings",
            encodeURIComponent(JSON.stringify({
                annotations:                 false,
                annotations_subscribed:      false,
                autoplay:                    true,
                automatic_instance_redirect: false,
                captions:                    ["", "", ""],
                comments:                    ["youtube", ""],
                continue:                    false,
                continue_autoplay:           true,
                dark_mode:                   "",
                latest_only:                 false,
                listen:                      false,
                local:                       false,
                watch_history:               false,
                vr_mode:                     true,
                show_nick:                   false,
                locale:                      "en-US",
                region:                      "US",
                max_results:                 40,
                notifications_only:          false,
                player_style:                "invidious",
                quality:                     "hd720",
                quality_dash:                "auto",
                default_home:                "Popular",
                feed_menu:                   ["Popular", "Trending"],
                related_videos:              true,
                sort:                        "published",
                speed:                       1,
                thin_mode:                   false,
                unseen_only:                 false,
                video_loop:                  false,
                extend_desc:                 false,
                volume:                      100,
                save_player_pos:             false
            }))
        );

        const cookieSettings = document.cookie
                                       .split("; ")
                                       .find(entry => entry.startsWith("PREFS="))
                                       ?.slice(6);

        if(cookieSettings && domainUpToDate[domain]){
            if(cookieSettings !== storedSettings){
                GM_setValue("Invidious_Settings", cookieSettings);
                invalidateOtherDomains();
            }
        } else{
            const date = new Date();
            date.setFullYear(date.getFullYear() + 2);
            document.cookie = "PREFS=" + storedSettings + "; domain=" + domain + "; path=/; expires=" + date.toGMTString() + "; Secure; SameSite=Lax";
            validateCurrentDomain();
            location.reload();
        }
    }

    const now = (new Date()).getTime();

    if(now - GM_getValue("Invidious_InstancesUpdatedAt", 0) > 172800000){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.invidious.io/instances.json",
            responseType: "json",
            onload: function(response){
                execute((() => {
                    const storedDomainUpToDate = GM_getValue("Invidious_DomainUpToDate", {});
                    try{
                        const domainUpToDate = Object.fromEntries(
                            response.response
                                    .filter(instance => instance[1].type === "https")
                                    .map(instance => [instance[0], storedDomainUpToDate[instance[0]] || false])
                        );
                        GM_setValue("Invidious_DomainUpToDate", domainUpToDate);
                        GM_setValue("Invidious_InstancesUpdatedAt", now);
                        return domainUpToDate;
                    } catch(e){
                        console.error("Error parsing Invidious instances", e, response);
                        return storedDomainUpToDate;
                    }
                })());
            },
            onerror: function(response){
                console.error("Error loading Invidious instances", response);
            }
        });
    } else{
        execute(GM_getValue("Invidious_DomainUpToDate", {}));
    }
})();
