// ==UserScript==
// @name        リンク短縮してクリップボードにコピーする拡張機能
// @namespace   https://x.com/Shion_BFV
// @match       *://*/*
// @grant       GM_setClipboard
// @version     1.6
// @author      Hinata
// @description LLiL Url Shortener
// @license     WTFPL
// @homepageURL https://greasyfork.org/ja/scripts/479620-%E3%83%AA%E3%83%B3%E3%82%AF%E7%9F%AD%E7%B8%AE%E3%81%97%E3%81%A6%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E3%81%AB%E3%82%B3%E3%83%94%E3%83%BC%E3%81%99%E3%82%8B%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD
// @downloadURL https://update.greasyfork.org/scripts/479620/%E3%83%AA%E3%83%B3%E3%82%AF%E7%9F%AD%E7%B8%AE%E3%81%97%E3%81%A6%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E3%81%AB%E3%82%B3%E3%83%94%E3%83%BC%E3%81%99%E3%82%8B%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479620/%E3%83%AA%E3%83%B3%E3%82%AF%E7%9F%AD%E7%B8%AE%E3%81%97%E3%81%A6%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E3%81%AB%E3%82%B3%E3%83%94%E3%83%BC%E3%81%99%E3%82%8B%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
	function copyToClipboard(text) {
		var dummyElement = document.createElement("textarea");
		document.body.appendChild(dummyElement);
		dummyElement.value = text;
		dummyElement.select();
		document.execCommand("copy");
		document.body.removeChild(dummyElement);
	}

    function setToClipboard(text) {
        if (typeof GM_setClipboard != 'function') console.log("GM_setClipboard not support");
        GM_setClipboard(text, "text");
    }

	async function main() {
		var button = document.querySelector(".url-short-button");
		button.disabled = true;
		button.style.cursor = "wait";

		var currentUrl = window.location.href;
		console.log(currentUrl);
        if (currentUrl.includes("twitter.com") || currentUrl.includes("x.com")) {
            if (currentUrl.length >= 40) {
                var twitterUrl = currentUrl.replaceAll("twitter.com", "vxtwitter.com");
                twitterUrl = twitterUrl.replaceAll("x.com", "vxtwitter.com");
                setToClipboard(twitterUrl);
                console.log(twitterUrl);
                button.style.cursor = "default";
                button.innerText = "Copied!";
                button.disabled = false;
                return;
            }
        }
		var newUrl = currentUrl.replaceAll("?", "%3F");
		newUrl = newUrl.replaceAll("&", "%26");
		var xhr = new XMLHttpRequest();
		var url = "https://llil.jp/s/?x-key=freeKey1&x-target=" + newUrl;
		console.log(url);
		xhr.open('GET', url, true);
		xhr.setRequestHeader("X-Key", "freeKey1");
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var response = xhr.responseText;
					var textToCopy = response;
					setToClipboard(response);
					console.log(response);
					button.style.cursor = "default";
					button.innerText = "Copied!";
					button.disabled = false;
				} else {
					console.error("リクエストエラー: ステータスコード " + xhr.status);
				}
			}
		};
		xhr.send();
	}

    async function copy() {
		var button = document.querySelector(".url-copy-button");
		button.disabled = true;
		button.style.cursor = "wait";
		setToClipboard(button.innerText);
		button.innerText = "Copied!";
        var origin = window.location.href.replaceAll("https://llil.jp/s/?x-key=freeKey1&x-target=", "");
        window.location.href = origin;
	}

	function addCopyButton(text) {
		const button = document.createElement("button");
		button.innerText = text;
		button.classList.add("url-copy-button");
		button.style.background = "#fc4d50";
		button.style.color = '#ffffff';
		button.style.borderRadius = '20px';
		button.style.padding = '10px 15px';
		button.style.border = 'none';
		button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
		button.style.cursor = 'pointer';
		button.style.position = 'fixed';
		button.style.bottom = '40px';
		button.style.right = '10px';
		button.style.zIndex = '1000';
		button.addEventListener('mouseover', () => {
			button.style.background = '#ff6669';
		});
		button.addEventListener('mouseout', () => {
			button.style.background = '#fc4d50';
		});
		button.onclick = copy;
		document.body.appendChild(button);
	}
  function addButton() {
		const button = document.createElement("button");
		button.innerText = " ";
		button.classList.add("url-short-button");
		button.style.background = "#fc4d50";
		button.style.color = '#ffffff';
		button.style.borderRadius = '10px';
		button.style.padding = '60px 15px';
		button.style.border = 'none';
		button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
		button.style.cursor = 'pointer';
		button.style.position = 'fixed';
		button.style.bottom = '50px';
		button.style.right = '-10px';
		button.style.zIndex = '1000';
		button.addEventListener('mouseover', () => {
			button.style.background = '#ff6669';
      button.innerText = "リンク短縮してコピー";
      button.style.right = '0px';
		  button.style.padding = '50px 15px';
		  button.style.cursor = 'pointer';
		});
		button.addEventListener('mouseout', () => {
			button.style.background = '#fc4d50';
      button.innerText = " ";
      button.style.right = '-10px';
		  button.style.padding = '60px 15px';
      button.style.cursor = "default";
		});
		button.onclick = main;
		document.body.appendChild(button);
	}
	if (!window.location.href.includes("llil.jp")){
		addButton();
	} else {
        if (window.location.href.includes("x-key")){
            var response = document.body.innerHTML;
//	        addCopyButton(response);
            setToClipboard(response);
            var origin = window.location.href.replaceAll("https://llil.jp/s/?x-key=freeKey1&x-target=", "");
            window.location.href = origin;
        }
    }


    document.addEventListener("securitypolicyviolation", (e) => {
        if (e.violatedDirective === "connect-src"){
            if (e.blockedURI.includes('x-key')) {
                var button = document.querySelector(".url-short-button");
                window.location.href = e.blockedURI;
//        button.disabled = true;
//        button.style.cursor = "default";
//        button.innerText = "このページでは使えません";
            }
        }
    });

})();