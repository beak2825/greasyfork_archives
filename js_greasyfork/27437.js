// ==UserScript==
// @name            Chan & Idol Sankaku Video Helper
// @name:ja         Chan & Idol Sankaku Video Helper
// @name:ru         Chan & Idol Sankaku Video Helper
// @namespace       http://tampermonkey.net/
// @version         1.1.2
// @description     Resize HTML5 Player's width, disable autoplay, show control panel, set volume in 1%.
// @description:ja  Resize HTML5 Player's width, disable autoplay, show control panel, set volume in 1%.
// @description:ru  Уменьшает ширину плеера до 1000, отключает автовоспроизведение, показывает панель навигации, устанавливает громкость в 1%.
// @author          MrModest
// @license         MIT
// @match           https://chan.sankakucomplex.com/*
// @match           https://idol.sankakucomplex.com/*
// @match           https://beta.sankakucomplex.com/*
// @include         https://chan.sankakucomplex.com/*
// @include         https://idol.sankakucomplex.com/*
// @include         https://beta.sankakucomplex.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/27437/Chan%20%20Idol%20Sankaku%20Video%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/27437/Chan%20%20Idol%20Sankaku%20Video%20Helper.meta.js
// ==/UserScript==

(function (window) {//normalized 'window'
    var w;
    w = window;
    // In user scripts you can insert almost any javascript-library.
    // The library code is copied directly into the user's script.
    // When including a library, you need to pass 'w' as the 'window' parameter
    // Examle: include 'jquery.min.js'
    // (function(a,b){function ci(a) ... a.jQuery=a.$=d})(w);
    
    // Without this 'if' script will running several times on page with frames 
    if (w.self != w.top) {
        return;
    }
    
    if ((/https:\/\/chan.sankakucomplex.com/.test(w.location.href)) || (/https:\/\/idol.sankakucomplex.com/.test(w.location.href))) {
        var videoTag = document.getElementById('image');
        
        if (videoTag !== null) {
            if (Number(videoTag.getAttribute('width')) > 1000){
                videoTag.setAttribute('width', '1000'); //set width for video/gif/picture (default: 1000)
                videoTag.removeAttribute('height');
            }
            if (Number(videoTag.getAttribute('height')) > 500){
                videoTag.setAttribute('height', '500'); //set heigth for video/gif/picture (default: 500)
                videoTag.removeAttribute('width');
            }
            videoTag.setAttribute('controls', '');
            videoTag.removeAttribute('autoplay'); 
            videoTag.volume = 0.01; //set volume for video (default: 1%)
        }
    }
    if(/https:\/\/beta.sankakucomplex.com/.test(w.location.href)){
        console.log("Start script..");
        
        document.addEventListener('click', function(e) {
            if (e.button !== 2) return; //if not right mouse button (for work left button click)
    
            //console.log('click');
            if (e.target.tagName === 'VIDEO') {
                console.log('stop firefox right button click');
                e.stopPropagation();
            }
        }, true);
    
        function updateVideoTags() {//check new video tags in interval
            var videoTags = document.querySelectorAll("video:not([data-be-muted])"); //don't change changed tags
            
            if (videoTags.length < 1) return;
            
            for(var i = 0; i < videoTags.length; i++){
                videoTags[i].volume=0.01;
                videoTags[i].loop = true;
                videoTags[i].setAttribute('data-be-muted', ''); //mark tag as changed
            }
            console.log("I found " + videoTags.length + " video tags!");
        }
        setInterval(updateVideoTags, 500);
    }
})(window);