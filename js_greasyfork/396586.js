// ==UserScript==
// @name        Nexus No Wait (Legacy Fork)
// @description [Temporary fork] Download from Nexusmods.com without wait and redirect (support Manual/Vortex)
// @namespace   NexusNoWait
// @include     https://www.nexusmods.com/*/mods/*
// @run-at      document-idle
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @version     1.5
// @downloadURL https://update.greasyfork.org/scripts/396586/Nexus%20No%20Wait%20%28Legacy%20Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/396586/Nexus%20No%20Wait%20%28Legacy%20Fork%29.meta.js
// ==/UserScript==

(function() {
    var ajax_request_raw;
    
    if (typeof(GM_xmlhttpRequest) !== "undefined") {
		ajax_request_raw = GM_xmlhttpRequest;
	} else if (typeof(GM) !== "undefined" && typeof(GM.xmlHttpRequest) !== "undefined") {
		ajax_request_raw = GM.xmlHttpRequest;
	}
    
    var ajax_request = function(obj) {
        if (!ajax_request_raw) {
            console.log("Unable to request", obj);
            return;
        }
        
        var requestobj = {
            url: obj.url,
            method: obj.type,
            data: obj.data,
            headers: obj.headers,
        };
        
        var loadcb = function(result) {
            if (result.readyState !== 4)
                return;
            
            if (result.status !== 200) {
                return obj.error(result);
            } else {
                return obj.success(result.responseText);
            }
        };
        
        requestobj.onload = loadcb;
        requestobj.onerror = loadcb;
        
        ajax_request_raw(requestobj);
    };
    
    var btnError = function(button) {
        button.style.color = "red";
        button.innerText = 'ERROR';
    };

    var btnSuccess = function(button) {
        button.style.color = "green";
        button.innerText = 'LOADING';
    };
    
    var click_listener = function(event) {
        var href = this.href;
        if (/[?&]file_id=/.test(href)) {
            event.preventDefault();
            
            var button = this;

            button.style.color = "yellow";
            button.innerText = 'WAIT';

            var game_id = document.getElementById("section").dataset.gameId;
            var search_params = new URL(href).searchParams;
            
            var file_id = search_params.get("file_id");
            if (!file_id)
                file_id = search_params.get("id"); // for ModRequirementsPopUp

            if (!/[?&]nmm=/.test(href)) {
                ajax_request({
                    type: "POST",
                    url: "/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl",
                    data: "fid=" + file_id + "&game_id=" + game_id,
                    headers: {
                        Origin: "https://www.nexusmods.com",
                        Referer: href,
                        "Sec-Fetch-Site": "same-origin",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    success: function(data) {
                        if (data) {
                            try {
                                data = JSON.parse(data);

                                if (data.url) {
                                    console.log('Success', data.url);
                                    btnSuccess(button);
                                    document.location.href = data.url;
                                    return;
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        }
                        
                        btnError(button);
                    },
                    error: function() {
                        btnError(button);
                    }
                });
            } else {
                ajax_request({
                    type: "GET",
                    url: href,
                    headers: {
                        Origin: "https://www.nexusmods.com",
                        Referer: document.location.href,
                        "Sec-Fetch-Site": "same-origin",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success: function(data) {
                        if (data) {
                            var xml = new DOMParser().parseFromString(data, "text/html");
                            var slow = xml.getElementById("slowDownloadButton");
                            var downloadUrl = slow.getAttribute("data-download-url");
                            console.log('Success', downloadUrl);
                            btnSuccess(button);
                            document.location.href = downloadUrl;
                            return;
                        }
                        
                        btnError(button);
                    },
                    error: function(ajaxContext) {
                        console.log(ajaxContext.responseText);
                        btnError(button);
                    }
                });
            }

            var popup = $(this).parent();
            if (popup.hasClass('popup')) {
                popup.children("button").click();
            }
            
            return false;
        }
    };
    
    var add_click_listener = function(el) {
        el.addEventListener("click", click_listener, true);
    };
    
    var add_click_listeners = function(els) {
         for (var i = 0; i < els.length; i++) {
            add_click_listener(els[i]);
        }
    };
    
    add_click_listeners(document.querySelectorAll("a.btn"));

    var observer = new MutationObserver(function(mutations, observer) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes) {
                for (var x = 0; x < mutations[i].addedNodes.length; x++) {
                    var node = mutations[i].addedNodes[x];
                    
                    if (node.tagName === "A" && node.classList.contains("btn")) {
                        add_click_listener(node);
                    } else if (node.children && node.children.length > 0) {
                        add_click_listeners(node.querySelectorAll("a.btn"));
                    }
                }
            }
        }
    });
    observer.observe(document, {childList: true, subtree: true});
})();