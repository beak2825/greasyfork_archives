// ==UserScript==
// @name         chameleon-helper
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  变色龙素材导入助手
// @author       huangxin
// @match        https://data.bytedance.net/pugna/ranking*
// @match        http://sgali-admin.bytedance.net/aweme/op*
// @match        https://mvaali-admin.bytedance.net/aweme/op*
// @grant        GM_xmlhttpRequest
//
// @downloadURL https://update.greasyfork.org/scripts/375755/chameleon-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375755/chameleon-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var debug = true;
    debug && console.log("we got here");
    function $(aSelector, aNode) {
        return (aNode ? aNode : document).querySelector(aSelector);
    }

    function $$(aSelector, aNode) {
        return (aNode ? aNode : document).querySelectorAll(aSelector);
    }

    function insertBefore(aNode, aSibling, aParent) {
        return aParent.insertBefore(aNode, aSibling);
    }

    const APP_MAPS = {
        "Muse&Tiktok": 1233,
        "Helo": 1342,
        "Vigo": 1257,
    };

    const TT_REGIONS = ["ID","VN","PH","TH","KR","JP","MY","TW","HK"];
    function notify(msg) {
        console.log("notify", msg);
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert(msg);// fallback for people who does not have notification API; show alert box instead
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(msg);
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(msg);
                }
            });
        }
        else if (Notification.permission == "denied") {
            alert(msg);
        }
        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them any more.
    }
    var pugnaHandler = function (a) {
        var renderinfos = $$('div .renderinfo');
        // debug && console.log("renderinfos", renderinfos);
        if (renderinfos.length <= 0) return;
        var gid = undefined;
        for (var idx = 0; idx < renderinfos.length; idx++) {
            var renderinfo = renderinfos[idx];
            debug && console.log("renderinfo", renderinfo);
            if (renderinfo && renderinfo.children) {
                for (var i = 0; i < renderinfo.children.length; i++) {
                    var child = renderinfo.children[i];
                    // debug && console.log("child", child);
                    if (child && child.className == 'lizard') return;
                }

                var username = $('.anticon-user').nextSibling.data;

                var renderinfoinfo = $('.renderinfo-info', renderinfo);
                debug && console.log("renderinfoinfo", renderinfoinfo);
                if (!gid && renderinfoinfo && renderinfoinfo.innerText && renderinfoinfo.innerText.trim().length == 19) {
                        gid = renderinfoinfo.innerText.trim();
                }
                if (!gid || gid.length != 19) continue;

                var region = $('.mt-region-selector .ant-select-selection-selected-value').getAttribute('title').substr(-2);
                var language = "";
                var app = $('.ant-select-selection-selected-value').getAttribute('title');
                var appId = APP_MAPS[app];
                if (!appId) {
                    alert(`unsupported app: ${app}`);
                }
                if (appId == 1233) {
                    if (TT_REGIONS.includes(region)) {
                        appId = 1180
                    }
                }
                var params = `gid=${gid}&username=${username}&region=${region}&language=${language}&app_id=${appId}`;

                debug && console.log("renderinfo", renderinfo, gid);
                var div = insertBefore(document.createElement("div"), renderinfoinfo.nextSibling, renderinfo);
                div.setAttribute("class", "lizard");
                var uacButton = div.appendChild(document.createElement("button"));
                uacButton.className = "lizardbutton";
                uacButton.appendChild(lizardButton(params + "&ad_platform=google", 'UAC候选'));
                var fbButton = div.appendChild(document.createElement("button"));
                fbButton.className = "lizardbutton";
                fbButton.appendChild(lizardButton(params + "&ad_platform=facebook", 'FB候选'));
            }
        }
    };
    var awemeOpAdminHandler = function(a) {
        debug && console.log("handle", a);
        var videoCards = $$('.ivu-card-body', a);
        if (a && a.className == "video-card") {
            videoCards = [a];
        }
        else if (videoCards.length == 0) {
            videoCards = $$('.video-card');
        }
        debug && console.log("video cards", videoCards);
        if (videoCards.length <= 0) return;
        for (var idx = 0; idx < videoCards.length; idx++) {
            var card = videoCards[idx];
            if (card) {
                var cardinfo = $('.cardinfo', card) || $('.card-base-info', card);
                debug && console.log("card info", cardinfo);
                var gid = undefined;
                for (var i = 0; i < cardinfo.children.length; i++) {
                    var child = cardinfo.children[i];
                    debug && console.log("child", child);
                    var link = $('a', child);
                    if (!gid && link && link.innerText && link.innerText.trim().length == 19) {
                        gid = link.innerText.trim();
                    }
                    if (child && child.className === 'lizard') return;
                }

                var region = ($('.country-wrap', card) || $('.wrapper .tag')).innerText;
                var language = "";
                var username = $('div.ivu-dropdown button span').innerText;

                var appId = 1180;
                var location = window.location.href;
                if (location.includes("sgali-admin")) {
                    appId = 1180;
                } else if (location.includes("mvaali-admin")) {
                    appId = 1233;
                }

                var params = `gid=${gid}&username=${username}&region=${region}&language=${language}&app_id=${appId}`;
                debug && console.log("params", params);
                if (!gid) return;

                var div = insertBefore(document.createElement("div"), $('div', cardinfo), cardinfo);
                div.setAttribute("class", "lizard");
                var uacButton = div.appendChild(document.createElement("button"));
                uacButton.className = "lizardbutton";
                uacButton.appendChild(lizardButton(params + "&ad_platform=google", 'UAC候选'));
                var fbButton = div.appendChild(document.createElement("button"));
                fbButton.className = "lizardbutton";
                fbButton.appendChild(lizardButton(params + "&ad_platform=facebook", 'FB候选'));
            }
        }
    };
    var pageHandler = function(a) {
        var location = window.location.href;
        if (location.includes("data.bytedance.net/pugna/ranking")) {
            pugnaHandler(a);
        }
        else if (location.includes("sgali-admin.bytedance.net/aweme/op") ||
                location.includes("mvaali-admin.bytedance.net/aweme/op")) {
            awemeOpAdminHandler(a);
        }
    };
    var checkNewNodes = function (mutations) {
        debug && console.log('State:', document.readyState);
        if (mutations.target) {
            checkAttribute(mutations);
        } else {
            mutations.forEach && mutations.forEach(checkAttribute);
        }
    };
    var checkAttribute = function (mutation) {
        var target = mutation.target;
        if (target && target.className) {
            pageHandler(target);
        }
    };

    debug && console.log('MutationEvent: true');
    document.addEventListener('DOMAttrModified', checkAttribute, false);
    document.addEventListener('DOMNodeInserted', checkNewNodes, false);

    var lizardButtonStyle = document.createElement('style')
    lizardButtonStyle.innerHTML = ".lizardbutton {margin: 2px; padding: 3px;}";
    document.body.appendChild(lizardButtonStyle);

    function lizardButton(aURL, aLabel) {
        debug && console.log("creating lizard button");
        var link = document.createElement("a");
        // link.href = "https://i-admin.bytedance.net/growth/tce/adsource/import?" + aURL;
        // link.href = "http://localhost:8723/growth/tce/adsource/import?" + aURL;
        link.onclick = function() {
            var ret = GM_xmlhttpRequest({
                method: "GET",
                headers: {"Accept": "application/json"},
                url: "https://i-admin.bytedance.net/growth/tce/adsource/import?" + aURL,
                onload: function(res) {
                    // Lets assume we get JSON back...
                    var data = JSON.parse(res.response);
                    console.log("response data", data);
                    notify(data.message);
                }
            });
            return false;
        };
        //link.target = "_blank";
        link.innerHTML = '<img src="'
            + 'https://api.flattr.com/button/flattr-badge-small.png"'
            + ' style="width: 12px; height: 12px;'
            + ' vertical-align: -1px; margin-right: .5em; "/>' + aLabel;
        return link;
  }
})();