// ==UserScript==
// @name         bilibili-ep
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @version      0.1.1
// @description  B站免费番剧下载,只能下载免费番剧,付费番剧请自行开通官方权限后下载
// @icon         data:image/png;base64,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
// @author       wj
// @license      CC
// @match        https://www.bilibili.com/bangumi/play/ep*
// @downloadURL https://update.greasyfork.org/scripts/500166/bilibili-ep.user.js
// @updateURL https://update.greasyfork.org/scripts/500166/bilibili-ep.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.pathname.indexOf("/bangumi/play/ss") == 0) {
        var piepid = __playinfo__?.result.view_info?.report.ep_id;
        var ndepid = __NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries[0]?.state?.data?.result?.play_view_business_info?.episode_info?.ep_id;
        var pnepid = piepid == undefined ? ndepid : piepid;
        location.href = "https://www.bilibili.com/bangumi/play/ep" + pnepid;
    }
    //var pathepid = location.pathname.split('/')[3].substring(2);
    var epaid = __playinfo__?.result?.play_view_business_info?.episode_info?.aid;
    var epcid = __playinfo__?.result?.play_view_business_info?.episode_info?.cid;
    var ndaid = __NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries[0]?.state?.data?.result?.play_view_business_info?.episode_info?.aid;
    var ndcid = __NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries[0]?.state?.data?.result?.play_view_business_info?.episode_info?.cid;
    if (epaid == undefined) { epaid = ndaid; }
    if (epcid == undefined) { epcid = ndcid; }
    var baseapi = `https://api.bilibili.com/pgc/player/web/v2/playurl?avid=${epaid}&cid=${epcid}&fnval=1&qn=120&fourk=1&fnver=0`;
    var bapi = baseapi;
    fetch(bapi).then(res => { return res.json() })
        .then(respn => {
            var vdnf = respn?.result?.video_info;
            var vurl = vdnf?.durls[0]?.durl[0]?.url || vdnf?.durl[0]?.url;
            var qlty = vdnf?.durls[0]?.quality || vdnf?.quality;
            console.log(vurl, qlty);
            var qltydsc = '';
            switch (qlty) {
                case 120:
                    qltydsc = "4K超清";
                    break;
                case 112:
                    qltydsc = "1080P 高码率";
                    break;
                case 80:
                    qltydsc = "1080P 高清";
                    break;
                case 64:
                    qltydsc = "720P 高清";
                    break;
                case 32:
                    qltydsc = "480P 高清";
                    break;
                case 16:
                    qltydsc = "360P 高清";
                    break;
                default:
                    qltydsc = "未知";
            }
            var tips = document.createElement('a');
            tips.id = "videourl";
            tips.style.position = "fixed";
            tips.style.top = "90%";
            tips.style.right = "0";
            tips.style.color = "#055";
            tips.style.fontSize = "2vw";
            tips.href = `${vurl}`;
            tips.textContent = qltydsc;
            tips.title = "右键保存,点击无效";
            tips.onclick = () => { window.prompt(`清晰度:${qltydsc}`, `${vurl}`); }
            document.body.append(tips);
        })
})();