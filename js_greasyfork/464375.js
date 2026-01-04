// ==UserScript==
// @name         WATCHIT STATMENT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Watch any videos without Ads & Log videos URLs with some meta data like type (HLS or DASH), codecs and encryptionn status (DRM OR NOT)
// @author       Mahmoud Khudairi
// @match        https://www.watchit.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=watchit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464375/WATCHIT%20STATMENT.user.js
// @updateURL https://update.greasyfork.org/scripts/464375/WATCHIT%20STATMENT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.XMLHttpRequest = new Proxy(window.XMLHttpRequest, {
        construct(target, args) {
            const xhr = new target(...args);
            xhr.open = new Proxy(xhr.open, {
                apply(target, arg, args) {
                    if (/accounts\/\d+\/videos\/ref/i.test(args[1])) {
                        const url = new URL(args[1], location.href);
                        url.searchParams.delete("ad_config_id");
                        args[1] = url.toString();
                        xhr.addEventListener("load", function () {
                            const data = JSON.parse(this.responseText);
                            if (!data.sources) return;
                            let msg = "[WATCHIT_STATMENT]\nSources:";
                            for (const source of data.sources) {
                                const sourceMeta = [];
                                sourceMeta.push(`type=${encodeURIComponent(source.type.includes("mpegURL") ? "hls" : "dash")}`);
                                sourceMeta.push(`drm=${encodeURIComponent("key_systems" in source ? "yes" : "no")}`);
                                if ("key_systems" in source) {
                                    const keySystems = source.key_systems;
                                    for (const [keySystemName, keySystem] of Object.entries(keySystems)) {
                                        const name = keySystemName.match(/(?:widevine|playready)/);
                                        if (name) {
                                            sourceMeta.push(`${name}_license=${encodeURIComponent(keySystem.license_url)}`);
                                        } else {
                                            sourceMeta.push(`fairplay_key=${encodeURIComponent(keySystem.certificate_url)}`);
                                            sourceMeta.push(`fairplay_cert=${encodeURIComponent(keySystem.key_request_url)}`);
                                        }
                                    }
                                }
                                sourceMeta.push(`ads=${encodeURIComponent("vmap" in source ? "yes" : "no")}`);
                                sourceMeta.push(`codecs=${encodeURIComponent(source.codecs)}`);
                                sourceMeta.push(`src=${encodeURIComponent(source.src)}`);
                                console.log("[WATCHIT_STATMENT::STREAMS]:", Object.fromEntries(sourceMeta.map((param) => param.split("=").map((c, i) => i ? decodeURIComponent(c) : c))));
                                msg += `\n  ${sourceMeta.join("&")}`;
                            }
                            console.log(msg);
                        }, {once: 1});
                    }
                    return target.apply(arg, args);
                }
            });
            return xhr;
        }
    });
})();