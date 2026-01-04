// ==UserScript==
// @name         Anivn Navigation Episode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.anivn.com/xem-phim/*/*
// @require https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374942/Anivn%20Navigation%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/374942/Anivn%20Navigation%20Episode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    String.prototype.format=function(args){
        return this.replace(/\{(\w+)\}/g,function(g0,g1){
            return args[g1];
        });
    }
    let ngvEpisode=$(
        '<div style="position:fixed;left:0px;bottom:0px;z-index:9999;">'+
        '<div class="btnToggleNag" style="padding:16px;color:white;background-color:green">Episode</div>'+
        '<div class="ngvEpisode" style="color:white;background-color:green;max-width:200px;display:none">'+
        '<div class="btnNextEp btn" style="padding:16px;width:100%">Next Episode</div>'+
        '<div class="btnPreEp btn" style="padding:16px;width:100%">Previous Episode</div>'+
        '<div style="display:inline-block;padding:16px"><select class="cbxEpisode" style="width:100%"></select></div>'+
        '</div></div>'
    );
    $('body').append(ngvEpisode);
    $(".btnToggleNag").on("click",function(){
        $(".ngvEpisode").slideToggle(1000);
    });
    let episodes=Array.from(document.querySelectorAll(".episodelist a"));
    episodes.forEach(x=>{
        $(".ngvEpisode .cbxEpisode").append('<option value="{0}"{2}>{1}</option>'.format([x.href,x.title,(x.href==window.location.href?" selected":"")]));
    });
    function change(pre=false){
        currentEpisode=currentEpisode[0];
        let currentIndex=episodes.indexOf(currentEpisode);
        if (currentIndex!=-1){
            let nextEp=episodes[currentIndex+1];
            let preEp=episodes[currentIndex-1];
            if (!pre){
                window.location.href=nextEp.href;
            }
            else{
                window.location.href=preEp.href;
            }
        }
    }
    $(".ngvEpisode .btnNextEp").on("click",function(){
        change();
    });
    $(".ngvEpisode .btnPreEp").on("click",function(){
        change(true);
    });
    let currentEpisode=episodes.filter(x=>x.href==window.location.href);
    if (currentEpisode.length){

    }
    $(".ngvEpisode .cbxEpisode").on("change",function(){
        let href=$(this).val();
        window.location.href=href;
    });
    $(document).on("keydown",function(e){
        if (e.keyCode==78){
            change();
        }
        else if (e.keyCode==80){
            change(true);
        }
        else if (e.keyCode==70){
            document.querySelector("video").webkitRequestFullScreen();
        }
    });
})();