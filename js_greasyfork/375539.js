// ==UserScript==
// @name         rule34.xxx Improved
// @namespace    Hentiedup
// @version      0.1
// @description  Bunch of improvements for rule34.xxx
// @author       Hentiedup
// @match        https://rule34.xxx/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375539/rule34xxx%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/375539/rule34xxx%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //=======================================================//
    /**///================  Settings  ===================///**/
    /**/                                                   /**/
    /**/                  var autoplayVideos = true;       /**/
    /**/              var defaultVideoVolume = 1;          /**/
    /**/      var useViewportDependentHeight = true;       /**/
    /**/         var ViewportDependentHeight = 70;         /**/
    /**/                   var stretchImgVid = false;      /**/
    /**/                   var trueVideoSize = true;       /**/
    /**/                                                   /**/
    /**///===============================================///**/
    //=======================================================//
    /*

    Settings explained

    -autoplayVideos: (true/false)
    -defaultVideoVolume: (0-1) 0=mute, 0.5=50%, 1=100%, etc.
    -useViewportDependentHeight: (true/false) Makes the max-height of all images and videos X% of the viewport (inner window of the browser) height.
    -ViewportDependentHeight: (1-100) the size used by above. (in %)
    -stretchImgVid: (true/false) Makes image and video height follow the ViewportDependentHeight regardless of true size. i.e. will stretch if needed.
    -trueVideoSize: (true/false) Resizes videos to their true size (unless overriden by stretchImgVid)

    */
    //Don't touch anything else unless you know what you're doing



    var viewPDepenCSS = "";
    if(useViewportDependentHeight) {
        viewPDepenCSS = (stretchImgVid ? `
		#gelcomVideoContainer {
		width: auto !important;
		max-width: 100% !important;
		height: ` + ViewportDependentHeight + `vh !important;
		}
		` : "") + `
		#image {
		width: auto !important;
		max-width: 100% !important;
		` + (stretchImgVid ? "" : "max-") + `height: ` + ViewportDependentHeight + `vh !important;
		}
		`;
    }


    addGlobalStyle(`
		#content > #post-view > #right-col > div > img.custom-button {
		cursor: pointer;
		width: 35px;
		padding: 3px;
		margin: 0;
		border-radius: 20px;
		}
		.custom-button:hover {
		background-color: rgba(255,255,255,.5);
		}
		.custom-button:active {
		background-color: rgba(255,255,255,1);
		}

		` + viewPDepenCSS + `

	`);

    $("#gelcomVideoPlayer").prop("volume", defaultVideoVolume);
    if(autoplayVideos)
        $("#gelcomVideoPlayer").prop("autoplay", true);

    if(!stretchImgVid && trueVideoSize) {
        $("#gelcomVideoContainer").prop("style", "width: " + ($("#stats > ul > li:contains('Size: ')").text().split(": ")[1].split("x")[0]) + "px; max-width: 100%; height: " + ($("#stats > ul > li:contains('Size: ')").text().split("x")[1]) + "px;");
    }

    $("#edit_form").prev().before('<img id="like-butt" class="custom-button" src="https://i.imgur.com/Kh1HzGr.png" alt="like"><img id="favorite-butt" class="custom-button" src="https://i.imgur.com/dTpBrIj.png" alt="favorite">');
    $("#like-butt").click(function() {
        $("#stats > ul > li:contains('(vote up)') > a:contains('up')").click();
    });
    $("#favorite-butt").click(function() {
        $("#stats + div > ul > li > a:contains('Add to favorites')").click();
    });

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();