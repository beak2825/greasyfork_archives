// ==UserScript==
// @name           Stop Overzealous Embedding
// @namespace	   https://greasyfork.org/en/scripts/370-stop-overzealous-embedding
// @description    Tries to turn embedded Youtube videos into links
// @include        *
// @exclude	   *.youtube.com/*
// @version	   5
// @downloadURL https://update.greasyfork.org/scripts/370/Stop%20Overzealous%20Embedding.user.js
// @updateURL https://update.greasyfork.org/scripts/370/Stop%20Overzealous%20Embedding.meta.js
// ==/UserScript==

// Original namespace was http://userscripts.org/scripts/show/113484
var risky_tags = ["object", "embed", "iframe"];

function init(risky_elements) {
        var i, j, k, index;
        var video_id, video_url, video_link;
        var risky_attributes, risky_node;

        var bad_elements = [];
        var bad_ids = [];

        if (risky_elements === null) {
                risky_elements = document.querySelectorAll(risky_tags.join(", "));
        }
        
        for (j = 0; j < risky_elements.length; j++) {
                if (risky_tags.indexOf(risky_elements[j].nodeName.toLowerCase()) == -1) {
                        continue;
                }
                
		index = 0;
		risky_attributes = risky_elements[j].attributes;
		for (k = 0; k < risky_attributes.length; k++) {
			risky_node = risky_attributes[k].nodeValue;
			if ((risky_node.indexOf("youtube.com") >= 0) || (risky_node.indexOf("ytimg.com") >= 0) || (risky_node.indexOf("youtube-nocookie.com") >= 0)) {
				risky_elements[j].style.display = "none";
				if (risky_node.indexOf("/v/") >= 0) {
					index = risky_node.indexOf("/v/") + 3;
				} else if (risky_node.indexOf("?v=") >= 0) {
					index = risky_node.indexOf("?v=") + 3;
				} else if (risky_node.indexOf("/embed/") >= 0) {
					index = risky_node.indexOf("/embed/") + 7;
				}
				if (index > 0) {
					video_id = risky_node.substring(index, index + 11);
					bad_elements.push(risky_elements[j]);
					bad_ids.push(video_id);
				}
				break;
			}
		}
	}
        
        for (i = 0; i < bad_ids.length; i++) {
                video_id = bad_ids[i];
                video_url = "http://www.youtube.com/watch?v=" + video_id;
                video_link = document.createElement("a");
                video_link.innerHTML = video_url;
                video_link.setAttribute("href", video_url);
                bad_elements[i].parentNode.replaceChild(video_link, bad_elements[i]);
        }
}

var init_callback = function (mutations) {
        if (init_callback.timer) return;
        var i, j;

        for (i = 0; i < mutations.length; i++) {
                risky_elements = [];
                mutation_nodes = mutations[i].addedNodes;
                if (!mutation_nodes) {
                        continue;
                }
                
                for (j = 0; j < mutation_nodes.length; j++) {
                        if (mutation_nodes[j].nodeName && risky_tags.indexOf(mutation_nodes[j].nodeName.toLowerCase()) !== -1) {
                                risky_elements.push(mutation_nodes[j]);
                        }
                }
                
                init_callback.timer = setTimeout(init, 200, risky_elements);
        }
        init_callback.timer = false;
};

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
observer = new MutationObserver(init_callback);
observer.observe(document.body, {childList: true, subtree: true, attributes: false, characterData: false});
init(null);
