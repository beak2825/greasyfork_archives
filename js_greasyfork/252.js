// ==UserScript==
// @name        Inoreader: enlarge images
// @namespace   https://greasyfork.org/users/130-joshg253
// @description Replaces small Blogger, Flickr, Tumblr, and NASA Earth Observatory feed images with larger ones in Inoreader.
// @include     http*://*.inoreader.com/*
// @exclude     none
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4724/Inoreader%3A%20enlarge%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/4724/Inoreader%3A%20enlarge%20images.meta.js
// ==/UserScript==

document.getElementById('reader_pane').addEventListener('DOMNodeInserted', function(e) {
	if(e.target.tagName && e.target.tagName == 'DIV' && /article_content/.test(e.target.className)) {
		var imgs = e.target.getElementsByTagName('img');
		for(var x in imgs) {
			var i = imgs[x];

			//------
			//Tumblr
			//------
			if(/https?:\/\/.+\.tumblr\.com\/.*_500\.\w+/.test(i.src)) {
				console.log("found small Tumblr image: " + i.src);
				//i.src = i.src.replace("_500.jpg", "_1280.jpg");
				i.src = i.src.replace(/_500\.(\w+)$/, "_1280.$1");
				i.onerror = function () {
					this.src = this.src.replace(/_1280\.(\w+)$/, "_500.$1");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}

			//------
			//Flickr
			//------
				// square: _s, _q; thumbnail: _t;  small: [none], _n; med: _m, _z, _c; large: _b, _h; orig: _o;
			else if(/https?:\/\/(.+)\.staticflickr\.com\/.*_m\.\w+/.test(i.src)) {
				console.log("found small Flickr image: " + i.src);
        //i.style.width = i.style.height = "inherit";
        i.src = i.src.replace(/_m\.(\w+)$/, "_b.$1");
				i.onerror = function () {
					this.src = this.src.replace(/_b\.(\w+)$/, "_m.$1");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}
			else if(/https?:\/\/(.+)\.staticflickr\.com\/.*_z\.\w+/.test(i.src)) {
				console.log("found medium Flickr image: " + i.src);
        //i.style.width = i.style.height = "inherit";
        i.src = i.src.replace(/_z\.(\w+)$/, "_b.$1");
				i.onerror = function () {
					this.src = this.src.replace(/_b\.(\w+)$/, "_z.$1");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}
			else if(/https?:\/\/(.+)\.staticflickr\.com\/.*_n\.\w+/.test(i.src)) {
				console.log("found small Flickr image: " + i.src);
        //i.style.width = i.style.height = "inherit";
        i.src = i.src.replace(/_n\.(\w+)$/, "_b.$1");
				i.onerror = function () {
					this.src = this.src.replace(/_b\.(\w+)$/, "_n.$1");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}

			//--------
			//Blogspot
			//--------
			else if(/https?:\/\/.+\.blogspot\.com\/.*\/s320\/.*\.\w+/.test(i.src)) {
				console.log("found small Blogspot image: " + i.src);
				i.src = i.src.replace("s320", "s1600");
				i.onerror = function () {
					this.src = this.src.replace("s1600", "s320");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}
			else if(/https?:\/\/.+\.blogspot\.com\/.*\/s400\/.*\.\w+/.test(i.src)) {
				console.log("found small Blogspot image: " + i.src);
				i.src = i.src.replace("s400", "s1600");
				i.onerror = function () {
					this.src = this.src.replace("s1600", "s400");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}
			else if(/https?:\/\/.+\.blogspot\.com\/.*\/s1600\/.*\.\w+/.test(i.src)) {
				console.log("found large Blogspot image: " + i.src);
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}

			//----------------------
			//NASA Earth Observatory
			//----------------------
			else if(/.*eoimages\.gsfc\.nasa\.gov.*_tn\.\w+$/.test(i.src)) {
				console.log("found small NASA EO image: " + i.src);
				i.src = i.src.replace(/_tn\.(\w+)$/, ".$1");
				i.onerror = function () {
					this.src = this.src.replace(/\.(\w+)$/, "_tn\.$1");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}
			else if(/.*eoimages\.gsfc\.nasa\.gov.*_th\.\w+$/.test(i.src)) {
				console.log("found small NASA EO image: " + i.src);
				i.src = i.src.replace(/_th\.(\w+)$/, ".$1");
				i.onerror = function () {
					this.src = this.src.replace(/\.(\w+)$/, "_th\.$1");
				}
				i.style.maxWidth = '100%';
				i.style.width = 'auto';
			}
		}
	}
}, false);