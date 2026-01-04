// ==UserScript==
// @name         【聊天室图床白名单篡改】
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自定义你的聊天室客户端图床白名单。在脚本存储的"whitelist"一项里面进行自定义。请注意：这会覆盖原本的白名单设置。
// @author       You
// @match        hack.chat/?*
// @match        crosst.chat/?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/456067/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%9B%BE%E5%BA%8A%E7%99%BD%E5%90%8D%E5%8D%95%E7%AF%A1%E6%94%B9%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456067/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%9B%BE%E5%BA%8A%E7%99%BD%E5%90%8D%E5%8D%95%E7%AF%A1%E6%94%B9%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!GM_getValue('whitelist')) {
        GM_setValue('whitelist',[
            'i.imgur.com',
            'imgur.com',
            'share.lyka.pro',
            'cdn.discordapp.com',
            'i.gyazo.com',
            'img.thz.cool',
            'bed-1254016670.cos.ap-guangzhou.myqcloud.com',
            'i.loli.net', 's2.loli.net',	//SM-MS图床
            's1.ax1x.com', 's2.ax1x.com', 'z3.ax1x.com', 's4.ax1x.com',		//路过图床
            'i.postimg.cc',		//postimages图床
            'mrpig.eu.org',		//慕容猪的图床
            'gimg2.baidu.com',	//百度
        ])
    }
    unsafeWindow.imgHostWhitelist = GM_getValue('whitelist')
})();