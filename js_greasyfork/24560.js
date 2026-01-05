// ==UserScript==
// @name        Twitter_original_image_link
// @author      f1238762001
// @include     *://pbs.twimg.com/media/*
// @include     *://twitter.com/*
// @exclude     *://pbs.twimg.com/media/*name=orig*
// @author      f1238762001
// @license     GPL 3.0
// @version     3.0
// @grant       none
// @run-at      document-end
// @description Create links of original imgages and redirect twimg to original image.
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/24560/Twitter_original_image_link.user.js
// @updateURL https://update.greasyfork.org/scripts/24560/Twitter_original_image_link.meta.js
// ==/UserScript==

(function () {
	var local_url = content.document.location + "";

	if (local_url.match(/(http|https):\/\/pbs\./) != null) {
		img_url = local_url.match(/.*pbs\.twimg\.com\/media.*\?format=.*\&/) + "name=orig";
		window.location.replace(img_url);
	} else if (local_url.match(/\/status\/.*$/) != null) {
		// 應對 twitter 是 ajax 載入內容，改為手動點及再產生連結
	    let button = document.createElement("a");
	    let target = document.getElementsByTagName("header")[0].childNodes[1].childNodes[0].childNodes[0];

	    button.innerHTML = 'ShowOrigImage';
	    button.addEventListener("click", addOrigImageLink_new);
	    target.appendChild(button);
	}

    function addOrigImageLink_new() {
        let articles = document.getElementsByTagName("article");
        let img_count = 0;

        if (articles[0] == null) {
        	console.log("Articles not found.");
        	return;
        }

    	for (let i = 0; i < articles.length; i++) {
    		let current_article = articles[i];
    		let all_img = current_article.getElementsByTagName("img");

    		if (all_img[0] == null) {
	        	console.log("Images not found.");
	        	return;
        	}

        	if (isHasLink(current_article)) {
        		return;
        	}

        	
    		for (let j = 0; j < all_img.length; j++) {
                let img_url = all_img[j].getAttribute("src");
                img_url = img_url.match(/.*pbs\.twimg\.com\/media.*\?format=.*\&/);

                if (img_url != null) {
                    img_url += "name=orig";
                    createLink(img_count, img_url, current_article);
                    img_count ++;
                }
            }
    	}
    }

    function createLink(number, img_url, parent) {
        let orig_image_link = document.createElement("a");
        orig_image_link.target = "_blank";
        orig_image_link.href = img_url;
        orig_image_link.className = "orig_image";
        orig_image_link.innerHTML = "OrigImg" + number + "<br/>";

        let targetNode = parent.childNodes[0].childNodes[2];
        targetNode.appendChild(orig_image_link);
    }

    function isHasLink(node) {
    	let orig_image_link = node.getElementsByClassName("orig_image")[0];
    	if (orig_image_link != undefined) {
    		return true;
    	}
    	return false;
    }
	
})();
