// ==UserScript==
// @name         小狐狸VIP视频免费看
// @namespace    small_fox_vip_video_free_see_2
// @version      2.9
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://xhlld24244.cyou/*
// @match        https://xhlld1000.xyz/*
// @match        https://dfsd454.xyz/*
// @match        https://dfrd1009.cyou/*
// @match        https://asf4fss265.shop/*
// @match        https://asf4fss430.shop/*
// @match        https://*.xhlld077.shop/*
// @include      /^http(s)?:\/\/ld01.xhlld\d+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/ld.xhlld\d+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/xhlld\d+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/df\S+\.(cyou|xyz)/
// @include      /^http(s)?:\/\/\S+\.(cyou|xyz|shop)/
// @icon         https://06.xhlld080.shop/favicon.ico
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
// @require      https://scriptcat.org/lib/5007/1.0.1/supabaseClientLibrary.js#sha384=An/EKSp9xaz4YGHGLWUZYfW1950+SEeQhsmfjbbAfh8GOY8dHA7ZMuwEhnEq4gVJ
// @require      https://scriptcat.org/lib/5008/1.0.3/chatRoomLibrary.js#sha384=Rot5TRczD6A15DdM28xrwncuNdle1gd2ChGSanpvMRNQZiF62lgbqhdVI9bRYOMz
// @require      https://scriptcat.org/lib/637/1.4.4/ajaxHooker.js#sha256=Z7PdIQgpK714/oDPnY2r8pcK60MLuSZYewpVtBFEJAc=
// @downloadURL https://update.greasyfork.org/scripts/481765/%E5%B0%8F%E7%8B%90%E7%8B%B8VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481765/%E5%B0%8F%E7%8B%90%E7%8B%B8VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('小狐狸破解VIP视频免费看');

    // 初始化
    const user_id = await SbCLi.init();
    GM_log('用户ID:', user_id);

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(10);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { chatRoom.addMsgCard(msg) });
    }

    //2025年9月18日
    //最新地址发布页： https://xhlyj702.shop/#/index?tag=yjdi
    //最新跳转地址: https://xhlld044.shop/#/index?tag=yjdi
    //2025年12月10日 https://06.xhlld080.shop/#/index?tag=yjdi

    // 2.获取视频地址
    ajaxHooker.protect();
    ajaxHooker.filter([
        { type: 'xhr', url: '/view/getVideoInfo/', method: 'POST', async: true },//小狐狸
        { type: 'xhr', url: '/view/getLikeVideoList/', method: 'POST', async: true },//小狐狸
    ]);
    ajaxHooker.hook(request => {
        if (request.url.indexOf('/view/getVideoInfo/') > -1) {
            request.response = async res => {
                let jsonobj = JSON.parse(res.responseText);
                //console.log("hooked!!! getVideoInfo ====>",jsonobj);
                let tmp = jsonobj.data.coverUrl.split('/');
                window.m3u8_id = tmp[3] + '/' + tmp[4]; //"20240504/59kS6tea"
                window.mediaInfo = jsonobj.data;
                console.log("hooked1!!! window.m3u8_id ====>", jsonobj, window.m3u8_id);
            };
        } else if (request.url.indexOf('/view/getLikeVideoList/') > -1) {
            request.response = async res => {
                let jsonobj = JSON.parse(res.responseText);
                //console.log("hooked!!! getLikeVideoList ====>",jsonobj);

                let m3u8_prefix = jsonobj.data.map(item => {
                    let tmp = item.playUrl.split('/')[2];
                    return tmp;
                });
                //console.log("hooked!!! m3u8_prefix ====>",m3u8_prefix);

                window.m3u8_prefix = Array.from(new Set(m3u8_prefix));
                console.log("hooked2!!! window.m3u8_prefix ====>", jsonobj, window.m3u8_prefix);
                //ajaxHooker.unhook();
            };
        }
    });

    function check_circle() {
        if (window.m3u8_prefix?.length && window.m3u8_id) {
            const url = `https://${window.m3u8_prefix[0]}/${window.m3u8_id}/index.m3u8`;
            window.m3u8_prefix = null;
            window.m3u8_id = null;
            const videoInfo = {
                url: window.location.href,
                content: window.mediaInfo.title,
                video_url: url,
                image_url: window.mediaInfo.coverUrl,
            };
            // 加载卡片
            chatRoom.addMsgCard(videoInfo);
            // 发送消息
            const res = SbCLi.sendMessage(videoInfo);
            GM_log('发送消息的响应:', res);
        }
    }

    setInterval(check_circle, 2000);
})();