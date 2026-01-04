// ==UserScript==
// @name         华软在线影院获取真实视频地址
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @icon         http://navod.scse.com.cn/nn_cms/data/template/100000/200003/img/favicon.ico
// @description  华软在线影院获取真实视频地址，可复制当前页面视频真实下载地址到系统剪贴板，或者直接下载
// @description  我用来在播放器上播放(IINA)，避免出现flash播放视频时PPT的既视感
// @author       Nuzoul
// @match        *://navod.scse.com.cn/*&nns_video_id=*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/369599/%E5%8D%8E%E8%BD%AF%E5%9C%A8%E7%BA%BF%E5%BD%B1%E9%99%A2%E8%8E%B7%E5%8F%96%E7%9C%9F%E5%AE%9E%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/369599/%E5%8D%8E%E8%BD%AF%E5%9C%A8%E7%BA%BF%E5%BD%B1%E9%99%A2%E8%8E%B7%E5%8F%96%E7%9C%9F%E5%AE%9E%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {

    var html_add = '<li class="top_default"><a id="ncopy">复制</a></li>';
    html_add += '<li class="top_default"><a id="ndown">下载</a></li>';

    var ul_tag = document.querySelector("div.wrap > div.about > div.top_play > ul");
    if(ul_tag){
        ul_tag.id = "insert_id";
        $('#insert_id').append(html_add);
    }

    $("#ncopy").click(function(){
        GM_setClipboard(videoUtil.getVideoUrl(),"{ type: 'text', mimetype: 'text/plain'}");
    });

    $("#ndown").click(function(){
        videoUtil.download(videoUtil.getVideoUrl(),videoUtil.getVideoName());
    });

    var videoUtil = {
        //获取视频名称
        getVideoName: function () {
            var zinfo = document.getElementById("OnlinePlay");
            var zname = zinfo.innerHTML.substring(5);
            return zname;
        },

        //获取视频下载地址
        getVideoUrl: function () {
            var zhtml = document.getElementById("player_fg").getAttribute("flashvars");
            var zurl = unescape(zhtml.substring(10,zhtml.lastIndexOf('start')-3));
            return zurl;
        },

        //弹出下载框
        download: function (videoUrl, name) {
            var content = "file content!";
            var data = new Blob([content], {
                type: "text/plain;charset=UTF-8"
            });
            var downloadUrl = window.URL.createObjectURL(data);
            var anchor = document.createElement("a");
            anchor.href = videoUrl;
            anchor.download = name;
            anchor.click();
            window.URL.revokeObjectURL(data);
        }
     };

})();