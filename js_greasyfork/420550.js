// ==UserScript==
// @name            Remove ads fb
// @namespace       Remove ads fb
// @version         1.0
// @description     Một đoạn mã nhỏ giúp loại bỏ quảng cáo trên facebook web.
// @author          Nguyen Khong
// @include         https://www.facebook.com/*
// @grant           unsafeWindow
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/420550/Remove%20ads%20fb.user.js
// @updateURL https://update.greasyfork.org/scripts/420550/Remove%20ads%20fb.meta.js
// ==/UserScript==

var oldXMLHttpRequest = unsafeWindow.XMLHttpRequest;
function ProxyXHR() {
	var _xmlHttpRequest = new oldXMLHttpRequest();
	var _self = this;
	function proxy(name) {
		try {
			if ((typeof _xmlHttpRequest[name]) == 'function') {
				_self[name] = function() {
					return _xmlHttpRequest[name].apply(_xmlHttpRequest, arguments);
				};
			} else {
                let property = {};
                if (name === "responseText"){
                    property.get = function() {
                        // Block ads in videos
                        let responseText = _xmlHttpRequest.responseText;
                        if (_xmlHttpRequest.responseURL.indexOf("https://www.facebook.com/api/graphql") > -1 &&
                            responseText && responseText.substr(0, 100).indexOf("video_ad") > -1){
                            return "{}";
                        }
                        return responseText;
                    }
                } else {
                    property.get = function() { return _xmlHttpRequest[name]; }
                }
                property.set = function(value) { _xmlHttpRequest[name] = value; }
				Object.defineProperty(_self, name, property);
            }
		}
		catch (e) {}
	}

	// FIX onreadystatechange is not enumerable [Opera]
	proxy('onreadystatechange');

	for (let n in _xmlHttpRequest){
        if (n === "onreadystatechange") continue;
		proxy(n);
    }
}

unsafeWindow.XMLHttpRequest = ProxyXHR;

unsafeWindow.document.addEventListener('DOMContentLoaded', function(){
    function processNode(node){
        if (node && node.getAttribute("role") === "feed" ){
            let childrens = node.children;
            for(let i = childrens.length-1; i >= 0; --i){
                if(childrens[i].getAttribute("scanned")) break;
                if(childrens[i].getAttribute("data-pagelet")){
                    if (childrens[i].textContent.substr(0, 512).indexOf("Được tài trợ") > -1){
                        console.log("remove node");
                        childrens[i].remove();
                    }else{
                        childrens[i].setAttribute("scanned", "true");
                    }
                }
            }
        }
    }

    (function injectMutationObserver () {
        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                switch (mutation.type) {
                    case "childList":
                        processNode(mutation.target);
                        return;
                }
            });
        });
        mutationObserver.observe(document.body, {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: true,
            attributeOldValue: false,
            characterDataOldValue: false
        });
    })();
});