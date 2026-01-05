// ==UserScript==
// @name         YouTube Modern Channel Design
// @version      1.3.0
// @namespace    sapkra
// @description  Generate a full width Channel Design on YouTube
// @match        *://*.youtube.com/user/*
// @match        *://*.youtube.com/channel/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5337/YouTube%20Modern%20Channel%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/5337/YouTube%20Modern%20Channel%20Design.meta.js
// ==/UserScript==

//Content Area
document.getElementById('content').setAttribute( 'style', 'width: 100%;' );


//Thumbnails
function setStylesForClass(matchClasses, matchTag, styles) {
    var classes = matchClasses.split( ', ' );
    var elems = document.getElementsByClassName( classes[0] );
    
    for (var i = 0; i < elems.length; i++) {
        if(matchTag == 'multipleClasses') {
            elems[i].getElementsByClassName( classes[1] )[0].setAttribute( 'style', styles );
        }
        else if(matchTag != '') {
            elems[i].getElementsByTagName( matchTag )[0].setAttribute( 'style', styles );
        }
        else {
            elems[i].setAttribute( 'style', styles );
        }
    }
}

setStylesForClass( 'yt-shelf-grid-item', '', 'width: 300px;' );
setStylesForClass( 'yt-thumb-196', '', 'width: 300px;' );
setStylesForClass( 'yt-lockup-title', '' , 'max-width: 300px;' );
setStylesForClass( 'expanded-shelf-content-item fluid yt-lockup-tile, yt-lockup-thumbnail', 'multipleClasses' , 'width: 300px;' );
setStylesForClass( 'yt-lockup clearfix  yt-lockup-video yt-lockup-grid', 'img' , 'width: 300px;' );
setStylesForClass( 'yt-lockup clearfix  yt-lockup-playlist yt-lockup-grid', 'img' , 'width: 300px;' );
setStylesForClass( 'yt-lockup-thumbnail', '' , 'width: 300px;' );
setStylesForClass( 'yt-thumb-default', 'img' , 'width: 300px;' );
setStylesForClass( 'yt-thumb-fluid', 'img' , 'width: 100%;' );

//Banner
function banner_width() {
	var banner_width = document.documentElement.offsetWidth / 320 * 53;
	document.getElementById('c4-header-bg-container').setAttribute('style', 'height: ' + banner_width + 'px;');
}

banner_width();

window.onresize = function(event) {
    banner_width();
};