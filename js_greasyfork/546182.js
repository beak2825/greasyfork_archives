// ==UserScript==
// @name         艾薇社区破解VIP视频免费看
// @namespace    aiwei_vip_video_free_see
// @version      1.6
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://avjb.com/*
// @match        https://avjb.cc/*
// @match        https://bav51.cc/*
// @match        https://bav52.cc/*
// @license      MIT
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @connect      supabase.co
// @require      https://unpkg.com/@supabase/supabase-js@2.49.3/dist/umd/supabase.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @require      https://scriptcat.org/lib/5007/1.0.4/supabaseClientLibrary.js#sha384=UVgc6octvKJ1F7mziyZvq8As2JOFlBP67kH/AOywBSXFrlKuyXMJCViIiNfbAjgu
// @require      https://scriptcat.org/lib/5008/1.0.6/chatRoomLibrary.js#sha384=K75aUnIAOk8+4AgNJhFH/4Z5ouseZgL0DZxQjyMkXf8+ZLZdI2dsPWsQBEbwSptw
// @downloadURL https://update.greasyfork.org/scripts/529208/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529208/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 初始化
    await SbCLi.init('avjb');
    const chatRoom = await ChatRoomLibrary.initUI();

    // 2.获取视频地址
    //const url = "https://r22.jb-aiwei.cc/contents/videos/76000/76444/index.m3u8";
    function check_circle() {

        const prefix = document.querySelector(".player-holder img")?.src;
        const tmp = prefix?.split('/');
        if (prefix) {
            //https://avjb.com/video/106169/fc2-ppv-4729813%20(11)/
            //https://stat.avstatic.com/cdn1/contents/videos_screenshots/106000/106169/385x233/4.jpg
            //https://avjb.com/get_file/4/8c34ef9daea4c5ac97a3b68c4188a8fc603ecdc5b2/106000/106169/106169_preview.mp4/  //302重定向到下方
            //https://r22.jb-aiwei.cc/videos/106000/106169/106169_preview.mp4 //去掉_preview 404
            //https://line6.jb-aiwei.cc/13TTX3VMB7D3U-tdduJwieACYYFp9AIZ-dqZmdTvnCr-I3C_zjDXJnglWuYRAAjCflKlYxcl9Q9wvO0M9jSwZpowkdsJk0BNhV-TrzQbJMd_clu1-9x_uPuHo0ID-SD0/videos/106000/106169/index.m3u8 //线路4
            //https://r22.jb-aiwei.cc/13TTX3VMB7D3U-tdduJwieACYYFp9AIZ-dqZmdTvnCr-I3C_zjDXJnglWuYRAAjCflKlYxcl9Q9wvO0M9jSwZpowkdsJk0BNhV-TrzQbJMd_clu1-9x_uPuHo0ID-SD0/videos/106000/106169/index.m3u8  //线路1
            //https://88newline.jb-aiwei.cc/videos/106000/106169/index.m3u8  //线路3 ok
            //this.currentVideoURL = "function/0/https://avjb.com/get_file/4/a9eaf539d565b797783c1246d8cd1a97d15cbe838f/106000/106169/106169_2160p.mp4/"; //404
            /*
            result.basePath = "/13TTX3VMB7D3U-tdduJwieACYYFp9AIZ-dqZmdTvnCr-I3C_zjDXJnglWuYRAAjCflKlYxcl9Q9wvO0M9jSwZpowkdsJk0BNhV-TrzQbJMd_clu1-9x_uPuHo0ID-SD0/videos/106000/" + this.videoID + "/index.m3u8";
            result.basePath = "/13TTX3VMB7D3U-tdduJwifMcHh7_6sjFRQmVF0zuV_C63gsUThwJR56-vaTOFvX56vxSFLG_NZhjJRp7gA-7kmWyfHI7LCucDV_3KB4LBCDVUO3ySR0JbGME69zEA04s/videos/99000/" + this.videoID + "/index.m3u8";
                            result.line1BaseURL = 'https://r22.jb-aiwei.cc';

                            // 线路3配置
                            if (this.videoID > 18400 && this.videoID < 92803) {
                                result.line3BaseURL = 'https://99newline.jb-aiwei.cc';
                            }
                            else if (this.videoID >= 92803) {
                                result.line3BaseURL = 'https://88newline.jb-aiwei.cc';
                            }

                            if (this.videoID > 80000) {
                                result.line4BaseURL = 'https://line6.jb-aiwei.cc';
                            }
            */
            //const url = `https://r22.jb-aiwei.cc/contents/videos/${tmp[6]}/${tmp[7]}/index.m3u8`;

            let line3BaseURL = 'https://99newline.jb-aiwei.cc';
            if (tmp[7] >= 92803) {
                line3BaseURL = 'https://88newline.jb-aiwei.cc';
            }
            const url = `${line3BaseURL}/videos/${tmp[6]}/${tmp[7]}/index.m3u8`;

            const videoInfo = {
                url: window.location.href,
                content: document.title,
                video_url: url,
                image_url: prefix,
            };
            // 加载卡片
            chatRoom.addMsgCard(videoInfo);
            // 发送消息
            const res = SbCLi.sendMessage(videoInfo);
            GM_log('发送消息的响应:', res);

            clearInterval(my_timer);
        }
    }

    let my_timer = setInterval(check_circle, 2000);

})();