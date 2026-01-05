// ==UserScript==
// @name        twitter_img_orig
// @namespace   http://catherine.v0cyc1pp.com/twitter_img_orig.user.js
// @match       https://twitter.com/*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     0.3
// @require     http://code.jquery.com/jquery-3.2.0.min.js
// @grant       none
// @description ツイッターの画像リンクを:orig#.jpgに張り替える。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/28618/twitter_img_orig.user.js
// @updateURL https://update.greasyfork.org/scripts/28618/twitter_img_orig.meta.js
// ==/UserScript==
 
 
this.$ = this.jQuery = jQuery.noConflict(true);
 
 
 
//console.log("twitter_img_orig start");
 
function main() {
    var hostname = location.hostname;
    $(".tweet, .Gallery").find("img").each( function() {
        //console.log("this.text=" + $(this).text() );
        var src = $(this).attr("src");
        if ( src === null || src === undefined || src === "" ) {
            return;
        }
 
 
        // メディア画像以外のアイコンなどは無視する
        if ( src.indexOf( "pbs.twimg.com/media/" ) === -1 ) {
            return;
        }
 
        if ( src.indexOf( ":orig#." ) !== -1 ) {
            return;
        }
 
        src = src.replace( /:(small|large|orig).*$/, "");
 
        var ext = src.substr( src.length - 3, 3);
 
 
        var newsrc = src + ":orig#." + ext;
 
        $(this).attr("src", newsrc);
    });
}
 
main();
 
var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});
 
var config = { attributes: false, childList: true, characterData: false, subtree:true };
 
observer.observe( document, config);

