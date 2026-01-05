// ==UserScript==
// @author            Hunlongyu
// @name              『净网卫士』 吾爱破解论坛
// @namespace         https://github.com/Hunlongyu
// @icon              https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description       移除广告，精简页面。新增论坛后台自动签到。
// @version           0.3.3
// @include           *://*.52pojie.cn/*
// @grant             GM_addStyle
// @run-at            document-start
// @supportURL        https://gist.github.com/Hunlongyu/5eef950d53b733dd67abda224ebed238
// @note              2019/06/27 新增自动签到。
// @downloadURL https://update.greasyfork.org/scripts/25466/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/25466/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%20%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    const css = `
      /* 页面背景 */
      body{ background: none !important }

      /* 顶部工具条 */
      #toptb{ display: none !important; }

      /* 版规 */
      .bml{ display: none; }

      /* 帖内广告：水平 + 竖直 */
      .dnch_eo_pt, .dnch_eo_pr{ display: none !important; }

      /* 用户签名 + 签名下的提示 */
      .sign, .dnch_eo_pb{ display: none !important; }

      /* 底部免责声明 */
      .res-footer-note{ display: none !important; }

      /* 底部广告 */
      .dnch_eo_f{ display: none !important; }

      /* 回帖框背景图 */
      #f_pst #fastpostmessage{ background: none !important }

    `

    try {
      GM_addStyle(css)
    } catch(e) {
      console.log('脚本失效，刷新后重试。', e)
    }
    
    const p = {
        befor: 'qds.png',
        after: 'wbs.png',
        afterImg: '<img src="https://www.52pojie.cn/static/image/common/wbs.png" class="qq_bind" align="absmiddle" alt="">',
        ajax: 'home.php?mod=task&do=apply&id=2',
        hide: `.qq_bind{ display: none }`,
        show: `.qq_bind{ display: inline-block }`,
        repeat: '本期您已申请过此任务',
        success: '任务已完成'
    }
    window.onload = function() {
        const imgDom = document.querySelector('.qq_bind')
        const img = imgDom.src.substring(imgDom.src.length - 7)
        if (img === p.after) {
            console.log('『净网卫士』 已经签到完毕！')
            return false;
        }

        if (img === p.befor) {
            console.log('『净网卫士』 尝试自动签到中……')
            GM_addStyle(p.hide)
            const a = new Ajax()
            a.getHTML(p.ajax, function(res) {
                if (res.indexOf(p.success) > 0 || res.indexOf(p.repeat) > 0) {
                    imgDom.parentNode.outerHTML = p.afterImg
                    GM_addStyle(p.show)
                    console.log('『净网卫士』 自动签到成功！')
                } else {
                    console.log('『净网卫士』 自动签到失败，请手动签到！')
                }
            })
        }
    }
})();