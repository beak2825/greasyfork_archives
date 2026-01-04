// ==UserScript==
// @name     Metal Archives - Redirect
// @description  Redirect from the search results page to a band/album/etc. page.
// @version  1.3
// @include	 /^https?://www\.metal-archives\.com/search.*$/
// @grant	 none
// @license	 Unlicense
// @namespace	 https://github.com/quaepoena/MA-redirect
// @downloadURL https://update.greasyfork.org/scripts/510440/Metal%20Archives%20-%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/510440/Metal%20Archives%20-%20Redirect.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /* Return nested dictionaries with redirect information. This could be
       expanded upon for any category MA allows you to search for. */
  	function redirects() {
      	return {"band_name":
        	    {"Absu": "https://www.metal-archives.com/bands/Absu/41",
                 "Burzum": "https://www.metal-archives.com/bands/Burzum/88",
                 "Death": "https://www.metal-archives.com/bands/Death/141",
                 "Immortal": "https://www.metal-archives.com/bands/Immortal/75",
                 "Slayer": "https://www.metal-archives.com/bands/Slayer/72"
                },
				"album_title":
            	{"Heartwork": "https://www.metal-archives.com/albums/Carcass/Heartwork/451600",
                 "Master of Puppets": "https://www.metal-archives.com/albums/Metallica/Master_of_Puppets/547"}};
    }

    /* Parse the URL parameters and return them as a dictionary with
       [key]=value. HT to Bakudan, adapted from
       https://stackoverflow.com/a/5448595. */
  	function parse_params(s) {
      	let params = {};
      	let kv = [];

      	s.split("&")
      	    .forEach(function(param) {
    			kv = param.split("=");
          		params[kv[0]] = decodeURIComponent(kv[1]);
            });

      	return params;
    }

  	window.addEventListener("load", function start() {
      	let params = parse_params(window.location.search.substr(1));
      	let type = params["type"], search = params["searchString"];
      	let url = redirects()[type][search];

      	if (url) {
        	window.location.replace(url);
        };
    });
})();