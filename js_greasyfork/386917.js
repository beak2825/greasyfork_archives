// ==UserScript==
// @name         拷贝微信音频地址脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  微信公众号->素材管理->语音 外链拷贝工具
// @author       awebzl
// @match        https://mp.weixin.qq.com/cgi-bin/filepage*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/386917/%E6%8B%B7%E8%B4%9D%E5%BE%AE%E4%BF%A1%E9%9F%B3%E9%A2%91%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/386917/%E6%8B%B7%E8%B4%9D%E5%BE%AE%E4%BF%A1%E9%9F%B3%E9%A2%91%E5%9C%B0%E5%9D%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".copy-btn{border:1px solid #aaa;margin-right: 20px;padding: 2px 17px;transition: all .1s ease-in; border-radius: 5px;position: relative;bottom: -2px;}")
    GM_addStyle(".copy-btn:hover{background:#aaa; color: white;}")
    const VOICE_URL = 'https://res.wx.qq.com/voice/getvoice?mediaid=';
    window.copyTextToClipboard = (text) => {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    window.getElements = () => {
        return $(".weui-desktop-audio-card__title")
    }
    window.getList = () => {
        return wx.cgiData.file_item;
    }
    // 获取mediaID
    window.getMediaId = (file_name) => {
        let list = getList();
        for(let e of list) {
            if (e.name == file_name) {
                return e.voice_encode_fileid
            }
        }
        return false;
    }
    window.drawBtn = () => {
        let list = getElements();
        for (let i=0; i<list.length;i++){
            let e = list[i]
            let btn = $("<a href='javascript:void(0)' target=\"_blank\" class='copy-btn'>拷贝</a>");
            let mediaId = getMediaId(e.innerHTML)
            btn.on("click", (e) => {
                // 因为click后页面会滚动到最下面，这里记录滚动条位置
                let sTop=document.body.scrollTop+document.documentElement.scrollTop;
                let url = VOICE_URL + mediaId
                copyTextToClipboard(url)
                Vue.prototype.$tipsSuc("复制完成！")
                window.scrollTo(0,sTop);
                return false;
            })
            btn.insertBefore(e)
        }
    }
    drawBtn()
})();