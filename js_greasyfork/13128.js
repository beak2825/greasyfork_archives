// ==UserScript==
// @name         Tirkx Popup Video Player
// @namespace    http://your.homepage/
// @version      0.10
// @description  Popup Video Player for tirkx.com
// @author       Soginal
// @match        http://*.tirkx.com/main/showthread.php?*
// @grant        none
// @local        en
// @downloadURL https://update.greasyfork.org/scripts/13128/Tirkx%20Popup%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/13128/Tirkx%20Popup%20Video%20Player.meta.js
// ==/UserScript==
var process = function(){
    $('head').append('<script src="https://releases.flowplayer.org/6.0.3/flowplayer.min.js"></script>');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://releases.flowplayer.org/6.0.3/skin/minimalist.css">');
    $(document.body).on('click', '.dl_chapter a',function(e){
        if (e.ctrlKey || e.altKey || e.shiftKey) return;
        closeVideo();
        var videoPath = $(this).attr('href');
        var videoType = videoPath.substr(videoPath.lastIndexOf('.') + 1).toLowerCase();
        var html = '<div style="z-index:1000000;position:fixed;left:0px; top:0px;width:800px;background-color:black;padding-left:10px;padding-right:10px;padding-bottom:35px;boxing-size:border-box;">' +
            '<div style="position:relative;font-size:20px;color:white;padding:3px;height:20px;"><span style="font-size:12px;display:inline-block;margin-top:4px;">' + $(this).text() + '</span>' +
            '<div style="position:absolute;right:6px;top:1px;cursor:pointer;font-weight:bolder;" onclick="closeVideo()">X</div> </div>' +
            '<div id="videoplayer" class="flowplayer fixed-controls" data-ratio="0.4167"></div>' +
            '</div>';
        var div = $(html);
        window.videoElement = div;
        div.css({
            left: $(document).width()/2-div.width()/2,
            top: 50
        });
        $(document.body).append(div);
        
        switch(videoType){
            case 'mkv': videoType = 'video/webm';break;
            default: videoType = 'video/' + videoType;break;
        }
        window.player = flowplayer("#videoplayer", {
            autoplay: true,
            //ratio: 5/12,
            mouseoutTimeout: 2000,
            clip: {
                sources: [
                    { type: videoType,  src: videoPath  }
                ]
            },
            embed: {
                skin: "https://releases.flowplayer.org/6.0.3/skin/minimalist.css"
            }
        });
        div.find('a[href=http\\:\\/\\/flowplayer\\.org]').hide();
        div.find('.fp-embed').hide();
        div.find('.fp-fullscreen').css({top:-26, right:30, height:20});
        return false;
    });
};


window.closeVideo = function(){
    if (window.player){
        player.stop();
        player.shutdown();
    }
    if (window.videoElement) {
        videoElement.hide();
        var video = videoElement.find('video').attr('src', '');
        if (video.length)
            video[0].load();
        videoElement.remove();
    }
    window.videoElement = null;
    window.player = null;
};

$(document).ready(process);