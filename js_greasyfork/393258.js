// ==UserScript==
// @icon
// @name            视频画中画模式
// @namespace       Je
// @author          Je
// @description     使用画中画模式观看视频
// @match           *
// @include         *
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.1.1
// @downloadURL https://update.greasyfork.org/scripts/393258/%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393258/%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let video=null
    $(function () {
        //查找video
        let findVideo=function(DOM=document.body){
            video = DOM.querySelector("video")
            if (video){
                loadButton(video)
                return
            }
            DOM.querySelectorAll("iframe").forEach(function(iframe){
                //console.log(iframe)
                //console.log(iframe.contentWindow)
                iframe.contentWindow.onload = function() {
                    findVideo(iframe.contentDocument.body)
                }
            })

        }
        let resizeBt=function(){
            let right=$(video).offset().left+$(video).width()-180
            let top = $(video).offset().top+40
            $('#HZHBtn').css('left',right)
            $('#HZHBtn').css('top',top)
        }
        let loadButton=function(){
            let button = '<div id="HZHBtn" title="画中画" draggable="true"  style="width: 65px;height: 32px;z-index:999;opacity:0;;position: absolute;cursor: pointer;text-align: right;font-size: 14px;line-height: 34px;color: rgb(255, 255, 255);transition-property: opacity;transition-duration: 0.5s;transition-timing-function: ease;transition-delay: 0s;background-color: rgba(34, 34, 34, 0.8);background-size: 20px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA5ElEQVRYR+1XWxECMRBLHOAACeCAwwEo4ByABHCAAw4F4ABwABJwgIMwe3PH+6PDdOd+dn/b2aRpN5MSHRc7xkcQeCggaQlgDqDnfC03AGuSK8OpCUgqAWycgT/bT0nuWwIVgFmz4+RMZNT035IsWwJHAPUCSdeHKUntQUkWQSAUCAX+VkCSOeYg0TMuJM0BzfTyjKGkAsAhkcCYpHlNEAgFQoGsCgwt2SSO4YLkOesYJgJ/bctmRLkJvEay2rEcyxzU6i2STQDsHEF/tX6G0uZxWCy3dNx3JnIFUJE0vPgZhQK4A22k8SHey2dyAAAAAElFTkSuQmCC);border-radius: 16px;background-repeat: no-repeat;background-position: left 8px top 6px;padding: 0px 8px !important;">画中画</div>';
            let body = $("body");
            if (body) {
                body.append(button);
                resizeBt()
                $(video).hover(function(){
                    $('#HZHBtn').css('opacity','1')
                },function(){
                    $('#HZHBtn').css('opacity','0')
                })
                $('#HZHBtn').hover(function(){
                    $('#HZHBtn').css('opacity','1')
                    $('#HZHBtn').css('background-color','rgb(253, 76, 91)')
                },function(){
                    $('#HZHBtn').css('opacity','0')
                    $('#HZHBtn').css('background-color','rgba(34, 34, 34, 0.8)')
                })
                $(window).resize(function(){
                    resizeBt()
                });
            }
        }

        findVideo()
        $("#HZHBtn").click(function () {
            //获取播放器（video）对象
            var btn=$('#HZHBtn')[0]
            if (video !== document.pictureInPictureElement) {
                // 尝试进入画中画模式
                video.requestPictureInPicture();
            } else {
                // 退出画中画
                document.exitPictureInPicture();
            }
        });
    });

})();