// ==UserScript==
// @name         chaoxing
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://mooc1-1.chaoxing.com/mycourse/studentstudy?chapterId*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399523/chaoxing.user.js
// @updateURL https://update.greasyfork.org/scripts/399523/chaoxing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function next(){
            var v = $('iframe').contents().find('iframe').contents().find('#video_html5_api');
            if(v.length != 0){
                let video = v.get(0);
                video.muted = 'muted';
                video.autoplay = 'autoplay';
                video.play();
                v.on('ended',function(e){
                    console.log('1')
                    setTimeout(function(){
                        console.log('2')
                        $('.orientationright').click();
                    }, 1500)
                })
            }else{
                console.log('没有找到video');
                $('.orientationright').click();
            }
    }
    $(document).ready(()=>{//setInterval(next, 15000)};
        $('.orientationright').on('click',()=>{setTimeout(next,4000)});
        $('#coursetree').on('click',()=>{setTimeout(next,4000)});
        setTimeout(next,4000)})
})();