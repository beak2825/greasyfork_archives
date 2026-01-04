// ==UserScript==
// @name            titan-the-pirate no ads
// @author          NullString1
// @include         *://titan-the-pirate.com/*
// @include         *://dood.tld/*
// @include         *://piratestreamtv.com/*
// @icon            https://www.google.com/s2/favicons?domain=titan-the-pirate.com
// @description     Blocks ads
// @run-at          document-end
// @version         1.1
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @namespace       https://greasyfork.org/users/830440
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/434692/titan-the-pirate%20no%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/434692/titan-the-pirate%20no%20ads.meta.js
// ==/UserScript==
var frame = document.createElement('div');
document.body.appendChild(frame);
GM_config.init(
{
  'id': 'Config', // The id used for this instance of GM_config
  'fields': // Fields object
  {
    'ds': // This is the id of the field
    {
      'label': 'Prefer', // Appears next to field
      'type': 'select', // Makes this setting a text field
      'options': ['DoodStream', 'PirateStream'],
      'default': 'DoodStream' // Default value if user doesn't change it
    }
  },
  'frame': frame,
  'css': '#Config {height: 150px !important; width: 600px !important; z-index: 99999 !important}'
});
if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("Open Settings Menu", function () {
        GM_config.open()
    })}
if (location.host.search("titan") != -1){
    (function() {
        var list = document.getElementById("playeroptionsul");
        if (GM_config.get("ds") == list.children[0].children[1].innerText) {
            var id = 0
        } else {
            var id = 1
        }
        var item = list.children[id];
        var post = item.getAttribute("data-post");
        var nume = item.getAttribute("data-nume");
        var type = item.getAttribute("data-type");
        jQuery.getJSON("https://titan-the-pirate.com/ttv/wp-json/dooplayer/v2/"+post+"/"+type+"/"+nume, function(r){
            if (r.embed_url.search("iframe") != -1){
                var parser = new DOMParser();
                var doc = parser.parseFromString(r.embed_url, "text/html");
                var url = doc.body.firstChild.src;
            } else {
                var url = r.embed_url;
            }
            location.replace(url);
        });
    })();
}