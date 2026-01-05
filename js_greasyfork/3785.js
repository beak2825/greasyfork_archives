// ==UserScript==
// @name        Naver Webtoon Viewer Fix 
// @namespace   https://greasyfork.org/scripts/3785
// @description Prevents the absurd resizing of images and loads the 90% quality images
// @include     *.webtoons.com/viewer*
// @version     1.0.8
// @run-at      document-start
// @grant       GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/3785/Naver%20Webtoon%20Viewer%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/3785/Naver%20Webtoon%20Viewer%20Fix.meta.js
// ==/UserScript==

/*
var countdown = 5;

var loadScript = function(scriptName) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = scriptName.replace(/wel.data\('url'\)\);/g, "wel.data('url').replace(/\\.jpg\\?type=.../g,'.jpg'));");
        script.async = false;
        head.appendChild(script);

};

document.addEventListener('beforescriptexecute', function(e) {
  //console.log(e.target.innerHTML);
      if(!--countdown) {
        e.preventDefault();
        e.stopPropagation();       
        loadScript(e.target.innerHTML);
      }

}, true);
*/

// #_viewer {height:auto !important} .viewer_updated,.fav_area{display: inline-block !important;} body {text-align:center !important;} 
GM_addStyle("img._images { width:auto !important; height:auto !important;  display: block !important; margin-left: auto !important; margin-right: auto !important;}");