// ==UserScript==
// @name        DGG Auto Image Embed (Actively Maintained + Growing list of Img Hosts)
// @namespace   boofus
// @description Preview images linked in destiny.gg chat. NSFW blur, hide-link, sticky autoscroll, optional 4chan block. Stable de-duplication + Imgur page/album resolver.
// @match       https://www.destiny.gg/embed/chat*
// @icon        https://cdn.destiny.gg/2.49.0/emotes/6296cf7e8ccd0.png
// @version     10.3.5
// @author      boofus (credits: legolas, vyneer)
// @license     MIT
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @connect     discordapp.net
// @connect     discordapp.com
// @connect     pbs.twimg.com
// @connect     polecat.me
// @connect     imgur.com
// @connect     i.imgur.com
// @connect     gyazo.com
// @connect     redd.it
// @connect     i.redd.it
// @connect     files.catbox.moe
// @connect     catbox.moe
// @connect     i.4cdn.org
// @connect     i.kym-cdn.com
// @downloadURL https://update.greasyfork.org/scripts/547316/DGG%20Auto%20Image%20Embed%20%28Actively%20Maintained%20%2B%20Growing%20list%20of%20Img%20Hosts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547316/DGG%20Auto%20Image%20Embed%20%28Actively%20Maintained%20%2B%20Growing%20list%20of%20Img%20Hosts%29.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // No 'g' flag; .test must be stateless
    var directImageRegex = /https?:\/\/(?:i\.redd\.it|redd\.it|pbs\.twimg\.com|(?:media|cdn)\.discordapp\.(?:net|com)|i\.imgur\.com|imgur\.com|gyazo\.com|polecat\.me|(?:files\.)?catbox\.moe|i\.4cdn\.org|i\.kym-cdn\.com)\/[^\s"'<>]+?\.(?:png|jpe?g|gif|gifv|webp)(?:\?[^\s"'<>]*)?$/i;
    // Imgur page (album/gallery/single) — no file extension
    var imgurPageRegex = /^https?:\/\/(?:www\.)?imgur\.com\/(a|gallery)\/[A-Za-z0-9]+(?:[/?#].*)?$/i;
    var imgurSinglePageRegex = /^https?:\/\/(?:www\.)?imgur\.com\/(?!a\/|gallery\/)[A-Za-z0-9]+(?:[/?#].*)?$/i;

    var overlay;

    // ---------------- settings ----------------
    function ConfigItem(keyName, defaultValue){ this.keyName = keyName; this.defaultValue = defaultValue; }
    var configItems = {
        BlurNSFW : new ConfigItem("BlurNSFW", true),
        HideLink : new ConfigItem("HideLink", true),
        Block4cdn: new ConfigItem("Block4cdn", true)
    };
    function Config(items, prefix){
        this._prefix = prefix;
        for (var key in items){
            (function(self, key, item){
                var priv = "#" + item.keyName;
                Object.defineProperty(self, key, {
                    set: function(v){
                        self[priv] = v;
                        unsafeWindow.localStorage.setItem(prefix + item.keyName, JSON.stringify(v));
                    },
                    get: function(){
                        if (typeof self[priv] === "undefined"){
                            var raw = unsafeWindow.localStorage.getItem(prefix + item.keyName);
                            self[priv] = raw != null ? JSON.parse(raw) : item.defaultValue;
                        }
                        return self[priv];
                    }
                });
            })(this, key, items[key]);
        }
    }
    var config = new Config(configItems, "img-util.");

    // ---------------- helpers ----------------
    var shouldStickToBottom = true;

    function getChatEl(){ return unsafeWindow.document.getElementsByClassName("chat-lines")[0]; }
    function isAtBottom(el, threshold){ if (!threshold) threshold = 2; return (el.scrollHeight - el.scrollTop - el.clientHeight) <= threshold; }
    function scrollToBottom(el){ requestAnimationFrame(function(){ el.scrollTop = el.scrollHeight; }); }

    function waitForElm(selector){
        return new Promise(function(resolve){
            var found = unsafeWindow.document.querySelector(selector);
            if (found) return resolve(found);
            var obs = new MutationObserver(function(){
                var el = unsafeWindow.document.querySelector(selector);
                if (el){ obs.disconnect(); resolve(el); }
            });
            obs.observe(unsafeWindow.document.body, { childList:true, subtree:true });
        });
    }

    function addSettings(){
        var area = document.querySelector("#chat-settings-form");
        if (!area){ console.warn("[DGG Img Preview] settings form not found"); return; }
        var title = document.createElement("h4"); title.textContent = "D.GG Img Preview Settings";
        function mk(labelText, keyName){
            var wrap = document.createElement("div"); wrap.className = "form-group checkbox";
            var label = document.createElement("label"); label.textContent = labelText;
            var input = document.createElement("input"); input.type = "checkbox"; input.name = keyName; input.checked = !!config[keyName];
            input.addEventListener("change", function(){ config[keyName] = input.checked; });
            label.prepend(input); wrap.appendChild(label); return wrap;
        }
        area.appendChild(title);
        area.appendChild(mk("Blur nsfw/nsfl images", "BlurNSFW"));
        area.appendChild(mk("Hide link after preview", "HideLink"));
        area.appendChild(mk("Disable 4chan (i.4cdn.org) auto-embeds", "Block4cdn"));
        console.log("[DGG Img Preview] Settings Added");
    }

    // Find message container (direct child of .chat-lines)
    function findMessageContainer(node){
        var chatEl = getChatEl();
        var cur = node;
        while (cur && cur.parentNode && cur.parentNode !== chatEl){ cur = cur.parentNode; }
        if (cur && cur.parentNode === chatEl) return cur;
        return node.parentNode || node;
    }

    // Build stable key so remounts don’t double-embed
    function getMessageKey(container){
        var ts = "", user = "", fallback = "";
        var timeEl = null;
        if (container && container.querySelector) timeEl = container.querySelector('time[data-unixtimestamp]');
        if (timeEl && timeEl.getAttribute) ts = timeEl.getAttribute('data-unixtimestamp') || "";
        if (container && container.getAttribute) user = container.getAttribute('data-username') || "";
        if (!user && container && container.querySelector){
            var uEl = container.querySelector('[data-username]');
            if (uEl && uEl.getAttribute) user = uEl.getAttribute('data-username') || "";
        }
        if (!ts && !user){
            var txt = (container && container.textContent) ? container.textContent : "";
            fallback = txt.slice(0, 64);
        }
        return ts + "|" + user + "|" + fallback;
    }

    function hasPreviewForHref(container, href){
        if (!container || !container.querySelectorAll) return false;
        var imgs = container.querySelectorAll('img[data-dgg-preview-src], img.__dggPreview');
        for (var i=0; i<imgs.length; i++){
            var a = imgs[i].getAttribute('data-dgg-preview-src');
            if (a === href) return true;
        }
        return false;
    }

    // --------- global de-dupe ---------
    var processedKeys = new Set();
    var inFlight = new WeakSet();

    // --------- resolvers ---------
    function isDirectImageUrl(u){ return directImageRegex.test(u); }
    function isImgurPage(u){ return imgurPageRegex.test(u) || imgurSinglePageRegex.test(u); }

    // Resolve Imgur page -> direct i.imgur.com image using og:image
    function resolveImgurToDirect(u, onSuccess, onFail){
        GM_xmlhttpRequest({
            method: "GET",
            url: u,
            responseType: "text",
            onload: function(res){
                try{
                    var html = res.responseText || "";
                    var doc = new DOMParser().parseFromString(html, "text/html");
                    var meta = null;
                    if (doc && doc.querySelector){
                        meta = doc.querySelector('meta[property="og:image"]');
                        if (!meta) meta = doc.querySelector('meta[name="twitter:image"]');
                    }
                    var direct = meta && meta.getAttribute ? meta.getAttribute('content') : "";
                    if (direct && /^https?:\/\//i.test(direct)) {
                        onSuccess(direct);
                    } else {
                        if (onFail) onFail();
                    }
                } catch(e){
                    if (onFail) onFail();
                }
            },
            onerror: function(){ if (onFail) onFail(); }
        });
    }

    function isTwitterMediaUrl(u) {
        try {
            var url = new URL(u);
            if (url.hostname !== "pbs.twimg.com") return false;
            if (!/^\/media\//.test(url.pathname)) return false;
            var fmt = (url.searchParams.get("format") || "").toLowerCase();
            return /^(png|jpg|jpeg|gif|webp)$/.test(fmt);
        } catch (e) {
            return false;
        }
    }

    // Fetch an image as base64 and append preview
    function fetchAndAppend(el, fetchUrl, originalHref){
        GM_xmlhttpRequest({
            method: "GET",
            url: fetchUrl,
            responseType: "blob",
            onload: function(res){
                var reader = new FileReader();
                reader.readAsDataURL(res.response);
                reader.onloadend = function(){
                    var base64 = reader.result;

                    var container = findMessageContainer(el);
                    // Re-check existence just before append (covers fast remounts)
                    if (hasPreviewForHref(container, originalHref)){
                        if (config.HideLink && el.parentNode) el.parentNode.removeChild(el);
                        inFlight.delete(el);
                        return;
                    }

                    var img = unsafeWindow.document.createElement("img");
                    img.src = base64;
                    img.setAttribute("data-dgg-preview-src", originalHref); // key by the original link
                    img.className = "__dggPreview";
                    img.style.maxHeight = "300px";
                    img.style.maxWidth  = "300px";
                    img.style.marginLeft = "5px";
                    img.style.marginBottom= "10px";
                    img.style.marginTop   = "10px";
                    img.style.display     = "block";
                    img.style.cursor      = "pointer";

                    var blurred = false;
                    if (config.BlurNSFW && ((el.className && el.className.indexOf("nsfw") !== -1) || (el.className && el.className.indexOf("nsfl") !== -1))){
                        img.style.filter = "blur(15px)";
                        blurred = true;
                    }

                    img.onclick = function(){
                        if (blurred){
                            img.style.filter = "blur(0px)";
                            blurred = false;
                        } else {
                            overlay.style.display = "flex";
                            var full = unsafeWindow.document.createElement("img");
                            full.src = base64;
                            full.style.maxHeight = "70%";
                            full.style.maxWidth  = "70%";
                            full.style.display   = "block";
                            full.style.position  = "relative";
                            overlay.appendChild(full);

                            var open = document.createElement("a");
                            open.href = fetchUrl; // open the resolved direct file
                            open.textContent = "Open Original";
                            open.target = "_blank";
                            open.style.marginTop = "5px";
                            open.style.color = "#999";
                            overlay.appendChild(open);
                        }
                    };

                    var chatEl = getChatEl();
                    function onReady(){
                        if (shouldStickToBottom){
                            requestAnimationFrame(function(){ chatEl.scrollTop = chatEl.scrollHeight; });
                        }
                    }

                    if (typeof img.decode === "function"){
                        img.decode().then(onReady).catch(onReady);
                    } else {
                        img.addEventListener("load", onReady, { once:true });
                        img.addEventListener("error", onReady, { once:true });
                    }

                    if (el.parentNode){
                        el.parentNode.appendChild(img);
                        if (config.HideLink) el.parentNode.removeChild(el);
                    }
                    inFlight.delete(el);
                };
            }
        });
    }

    function handleLink(el){
        // Block 4cdn if configured
        if (config.Block4cdn && /https?:\/\/i\.4cdn\.org\//i.test(el.href)) return;

        var container = findMessageContainer(el);
        var msgKey = getMessageKey(container);
        var globalKey = msgKey + "|" + el.href;

        // Stable global de-dupe (message, href)
        if (processedKeys.has(globalKey)) return;
        processedKeys.add(globalKey);

        // If this message already has a preview tied to this href, skip
        if (hasPreviewForHref(container, el.href)){
            if (config.HideLink && el.parentNode) el.parentNode.removeChild(el);
            return;
        }

        // Per-link guards
        if (el.dataset && el.dataset.dggPreviewed === "1") return;
        if (inFlight.has(el)) return;
        if (el.dataset) el.dataset.dggPreviewed = "1";
        inFlight.add(el);

        // Direct image → fetch blob
        if (isDirectImageUrl(el.href)){
            fetchAndAppend(el, el.href, el.href);
            return;
        }

        // Imgur album/single page → resolve og:image then fetch
        if (isImgurPage(el.href)){
            resolveImgurToDirect(el.href, function(directUrl){
                fetchAndAppend(el, directUrl, el.href);
            }, function(){
                // Couldn’t resolve — just stop gracefully
                inFlight.delete(el);
            });
            return;
        }

        // Twitter media with ?format=... (no file extension in path)
        if (isTwitterMediaUrl(el.href)) {
            fetchAndAppend(el, el.href, el.href);
            return;
        }

        // Other non-direct pages (e.g., gyazo.com/<id>) could be added similarly:
        // - implement a gyazo resolver using og:image if needed
        inFlight.delete(el);
    }

    var chatObserver = new MutationObserver(function(mutations){
        for (var mi=0; mi<mutations.length; mi++){
            var m = mutations[mi];
            for (var ni=0; ni<m.addedNodes.length; ni++){
                var n = m.addedNodes[ni];
                if (!n || n.nodeType !== 1) continue; // ELEMENT_NODE
                if (!n.querySelectorAll) continue;
                var links = n.querySelectorAll('.externallink:not([data-dgg-previewed="1"])');
                for (var i=0; i<links.length; i++){
                    handleLink(links[i]);
                }
            }
        }
    });

    // ---- bootstrap ----
    console.log("[DGG Img Preview] Connecting");
    waitForElm(".chat-lines").then(function(chatEl){
        // Overlay
        overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.inset = "0px";
        overlay.style.margin = "0px";
        overlay.style.background = "rgba(0,0,0,0.85)";
        overlay.style.zIndex = "999";
        overlay.style.height = "100%";
        overlay.style.width = "100%";
        overlay.style.display = "none";
        overlay.style.flexDirection = "column";
        overlay.onclick = function(){ overlay.style.display = "none"; overlay.innerHTML = ""; };
        document.body.appendChild(overlay);

        // Sticky-bottom engine
        shouldStickToBottom = isAtBottom(chatEl);
        chatEl.addEventListener("scroll", function(){ shouldStickToBottom = isAtBottom(chatEl); }, { passive:true });

        var ro = new ResizeObserver(function(){ if (shouldStickToBottom) scrollToBottom(chatEl); });
        ro.observe(chatEl);

        chatObserver.observe(chatEl, { attributes:false, childList:true, characterData:false, subtree:true });

        console.log("[DGG Img Preview] Connected");
        console.log("[DGG Img Preview] Adding Settings");
        addSettings();
    });
})();
