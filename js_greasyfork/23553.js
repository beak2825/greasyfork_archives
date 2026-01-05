// ==UserScript==
// @name       Download MP3 Youtube
// @namespace  http://smartbloggg.blogspot.com
// @version    1.1
// @description  Adds a MP3 Download button next to the subscribe button, thanks to youtubeinmp3 for their simple download service (http://youtubeinmp3.com/api/). Based off magnus's youtube2mp3 code. Just used something different as it wont open another tab.
// @match         https*://www.youtube.com/channel/UC2-NPQ3Sgl3yaUvSf1nlx7A*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  2014+, Soulweaver
// @downloadURL https://update.greasyfork.org/scripts/23553/Download%20MP3%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/23553/Download%20MP3%20Youtube.meta.js
// ==/UserScript==
start();

function start() {
    var pagecontainer=document.getElementById('page-container');
    if (!pagecontainer) return;
    if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
    var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
    var logocontainer=document.getElementById('logo-container');
    if (logocontainer && !isAjax) { // fix for blocked videos
        isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
    }
    var content=document.getElementById('content');
    if (isAjax && content) { // Ajax UI
        var mo=window.MutationObserver||window.WebKitMutationObserver;
        if(typeof mo!=='undefined') {
            var observer=new mo(function(mutations) {
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes!==null) {
                        for (var i=0; i<mutation.addedNodes.length; i++) {
                            if (mutation.addedNodes[i].id=='watch7-container' ||
                                mutation.addedNodes[i].id=='watch7-main-container') { // old value: movie_player
                                run();
                                break;
                            }
                        }
                    }
                });
            });
            observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
        } else { // MutationObserver fallback for old browsers
            pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
        }
    }
}

function onNodeInserted(e) {
    if (e && e.target && (e.target.id=='watch7-container' ||
                          e.target.id=='watch7-main-container')) { // old value: movie_player
        run();
    }
}

function finalButton(){

    var buttonIframeDownload = document.createElement("iframe");
    buttonIframeDownload.src = '//www.youtubeinmp3.com/widget/button/?color=ba1717&amp;video=' + window.location.href;
    buttonIframeDownload.scrolling = "no";
    buttonIframeDownload.id = "buttonIframe";
    buttonIframeDownload.style = "width:100%;height:60px;padding-top:20px;padding-bottom:20px;";

    document.getElementById("watch-header").appendChild(buttonIframeDownload);

}

function run(){

    if(!document.getElementById("parentButton") && window.location.href.substring(0, 25).indexOf("youtube.com") > -1 && window.location.href.indexOf("watch?") > -1){

        var parentButton = document.createElement("div");

        parentButton.className = "yt-uix-button yt-uix-button-default";
        parentButton.id = "parentButton";
        parentButton.style = "height: 23px;margin-left: 28px;padding-bottom:1px;";

        parentButton.onclick = function () {

            this.style = "display:none";
            finalButton();

        };

        document.getElementById("watch7-user-header").appendChild(parentButton);

        var childButton = document.createElement("span");

        childButton.appendChild(document.createTextNode("Download MP3"));

        childButton.className = "yt-uix-button-content";
        childButton.style = "line-height: 25px;font-size: 12px;";

        parentButton.appendChild(childButton);

    }

}

        var linkPath ='http://youtubeinmp3.com/fetch/?video='+encodeURIComponent(document.URL)+"&hq=1";
        $(  '<a id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px; /* background-color: #e62117; */"><img src="http://youtubeinmp3.com/icon/download.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; /* font-variant: small-caps; */ font-size: 12px; /* color: #fefefe; */">MP3 Download</span></a>').insertAfter( "#watch7-subscription-container" );   