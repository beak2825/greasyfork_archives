// ==UserScript==
// @name         Bilibili Bangumi To UWP
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.2.6
// @description  Bangumi番剧/电影 添加 用UWP客户端打开按钮
// @icon         http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @author       hatn
// @copyright	 2018, hatn
// @include      *.bilibili.com/bangumi/media/md*
// @include      *.bilibili.com/bangumi/play/ep*
// @include      *.bilibili.com/bangumi/play/ss*
// @include      *.bilibili.com/video/BV*
// @include      *.bilibili.com/video/av*
// @run-at     	 document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37761/Bilibili%20Bangumi%20To%20UWP.user.js
// @updateURL https://update.greasyfork.org/scripts/37761/Bilibili%20Bangumi%20To%20UWP.meta.js
// ==/UserScript==

let bangumiObj = {
	init () {
        let s = this, maxTimes = 50, i = 1;
        let timer = setInterval(() => {
            if (i >= maxTimes) return clearInterval(timer);
            ++i;
            if (typeof jQuery == 'undefined') return;
            clearInterval(timer);
            return s.work();
        }, 200);
    },
    work() {
        let cat = /(ep|ss|bv|av|md)(\w+)/gi.exec(location.href), av_code = '', av_type = 'b';
        //console.log(cat, location.href); // test
        if (cat == null) return console.log('bangumi to uwp log: av code not found');
        let skey = cat[1].toLowerCase();
        if (skey == 'md') {
            av_code = window.__INITIAL_STATE__.mediaInfo.param.season_id ? window.__INITIAL_STATE__.mediaInfo.param.season_id : window.__INITIAL_STATE__.ssId;
            if (av_code.length < 1) return console.log('bangumi to uwp log: av code not found');
        } else {
            if (['ss', 'ep'].includes(skey)) {
                av_code = window.bvid ? window.bvid : window.aid;
            } else {
                av_code = cat[2];
                av_type = 'a';
            }
            //console.log(av_type); // test
        }
        let bc_html = '';
        if (skey != 'md') {
            let bv_str = skey == 'bv' ? 'BV' : '';
            bc_html = `bilibili://video/${bv_str}${av_code}`;
        } else {
            bc_html = `bilibili://bangumi/season/${av_code}`;
        }

        if (skey == 'md') {
            $('#app .media-tab-nav .clearfix').append(`<li onclick="location.href = '${bc_html}'; return false;" >客户端观看</li>`);
        } else {
            let style_str = `position: absolute; cursor: pointer; border: 2px solid #00a1d6; margin: 10px; padding: 8px; background-color: transparent; border-radius: 3px;`;
            setTimeout(() => {
                if (av_type == 'a') {
                    $('#app').prepend(`<button onclick="location.href = '${bc_html}';" style="${style_str}"><i class="van-icon-videodetails_usemo"></i> 客户端观看</button>`);
                } else {
                    $('body').after(`<button onclick="location.href = '${bc_html}'" style="${style_str} top: 55px;"><i class="iconfont icon-play"></i><span> 客户端观看</span></button>`);
                }
            }, 10);
        }
        console.log('bangumi to uwp log: uwp btn done !');
    }
};

bangumiObj.init();