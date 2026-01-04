// ==UserScript==
// @name         【自用】各网页广告屏蔽、样式优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一个乱七八遭的自用脚本
// @author       dksong
// @include      *
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449106/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E5%90%84%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E3%80%81%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/449106/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E5%90%84%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E3%80%81%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    const url = location.href
    const blockSite = [
        'qzone', // 空间
        // 'twitter', // 推特
        'weibo.com', // 微博
    ]

    // 对应站点重定向回 bing 首页
    blockSite.forEach((item) => {
        if (url.indexOf(item) > -1) {
            alert('回去看书')
            location.href = 'http://www.bing.com'
        }
    })

    // 添加样式文件
    const injectCss = (css) => {
        const style = document.createElement('style')
        style.innerText = css
        document.head.appendChild(style)
    }

    // bing 页面样式优化
    const bing = () => {
        // 隐藏 bing 聊天机器人
        if (url.includes('bing'))
            injectCss(
                `
                  #ev_talkbox_wrapper{ display:none }
                  #est_switch{ opacity: 0} 
                  #est_switch:hover{ opacity: 1} 
                  .header,.footer{ display:none } 
                  .mc_caro{bottom:0 !important} 
									.hpl.hp_cont {
										display: flex;
										justify-content: center;
									}
                  .sbox{ margin:auto; top:25% }
                  #sb_form, #sw_as .sa_hv{ background:rgba(255,255,255,.2); font-size:22px}
                  .icon_text,.leftNav,.rightNav{ background:rgba(255,255,255,.2) !important }
                `,
            )
    }

    // 隐藏 mongoose 中文文档广告大图
    const hideMongoAdPic = () => {
        if (url.includes('mongoose'))
            injectCss('img[alt="vip课程"]{ display:none } pre{ font-size: 16px}')
    }

    /**
     * 调用方法
     */
    bing()
    hideMongoAdPic()
})()
