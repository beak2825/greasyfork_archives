// ==UserScript==
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_info

// @run-at         document-start
// @name:en        Bypass Wait, Code & Login on Websites
// @name           跳过网站等待、验证码及登录
// @name:zh-CN     跳过网站等待、验证码及登录
// @name:zh-TW     繞過站點等待、識別碼及登錄

// @description       This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @description:zh-CN 移除各类网站验证码、登录、倒计时及更多!
// @description:zh-TW 移除各類站點識別碼、登錄、倒計時及更多!
// @description:en    Remove verify code, login requirement, counting down... and more!


// @copyright      2014+, Yulei, Mod by Jixun.
////               Based on [Crack Url Wait Code Login] By Yulei

// 避免 Source Map 文件找不到的错误

/// CryptoJS 相关库

/// 非同步枚举

/// 兼容 GM 1.x, 2.x

/// Aria2 RPC

// @author         Jixun.Moe<Yellow Yoshi>
// @namespace      http://jixun.org/
// @version        3.0.546.1

// 尝试使用脚本生成匹配规则

// @include http://d.119g.com/*
// @include http://123564.com/*
// @include http://m.123564.com/*
// @include http://7958.com/*
// @include http://*.7958.com/*
// @include http://qjwm.com/*
// @include http://*.qjwm.com/*
// @include http://www.9pan.net/*
// @include http://*.www.9pan.net/*
// @include http://yun.baidu.com/*
// @include http://*.yun.baidu.com/*
// @include http://pan.baidu.com/*
// @include http://*.pan.baidu.com/*
// @include http://bx0635.com/*
// @include http://*.bx0635.com/*
// @include http://colayun.com/*
// @include http://*.colayun.com/*
// @include http://colafile.com/*
// @include http://*.colafile.com/*
// @include http://coladrive.com/*
// @include http://*.coladrive.com/*
// @include http://400gb.com/*
// @include http://*.400gb.com/*
// @include http://ctdisk.com/*
// @include http://*.ctdisk.com/*
// @include http://pipipan.com/*
// @include http://*.pipipan.com/*
// @include http://bego.cc/*
// @include http://*.bego.cc/*
// @include http://ctfile.com/*
// @include http://*.ctfile.com/*
// @include http://t00y.com/*
// @include http://*.t00y.com/*
// @include http://dlkoo.com/*
// @include http://*.dlkoo.com/*
// @include http://howfile.com/*
// @include http://*.howfile.com/*
// @include http://www.lepan.cc/*
// @include http://www.sx566.com/*
// @include http://rayfile.com/*
// @include http://*.rayfile.com/*
// @include http://sudupan.com/*
// @include http://*.sudupan.com/*
// @include http://vdisk.cn/*
// @include http://*.vdisk.cn/*
// @include http://yimuhe.com/*
// @include http://*.yimuhe.com/*
// @include http://douban.fm/*
// @include http://jing.fm/*
// @include http://moe.fm/*
// @include http://fm.qq.com/*
// @include http://music.163.com/*
// @include http://www.1ting.com/*
// @include http://www.565656.com/*
// @include http://5sing.com/*
// @include http://*.5sing.com/*
// @include http://5sing.kugou.com/*
// @include http://*.5sing.kugou.com/*
// @include http://www.9ku.com/*
// @include http://music.baidu.com/*
// @include http://play.baidu.com/*
// @include http://*.play.baidu.com/*
// @include http://yinyueyun.baidu.com/*
// @include http://www.djcc.com/*
// @include http://www.djkk.com/*
// @include http://www.djye.com/*
// @include http://music.douban.com/*
// @include http://www.duole.com/*
// @include http://ear.duomi.com/*
// @include http://web.kugou.com/*
// @include http://kugou.com/*
// @include http://www.kugou.com/*
// @include http://oyinyue.com/*
// @include http://*.oyinyue.com/*
// @include http://y.qq.com/*
// @include http://*.y.qq.com/*
// @include http://i.y.qq.com/*
// @include http://*.i.y.qq.com/*
// @include http://fm.qq.com/*
// @include http://*.fm.qq.com/*
// @include http://y.qq.com/*
// @include http://soso.music.qq.com/*
// @include http://songtaste.com/*
// @include http://*.songtaste.com/*
// @include http://www.xiami.com/*
// @include http://yinyuetai.com/*
// @include http://*.yinyuetai.com/*
// @include http://79pan.com/*
// @include http://*.79pan.com/*
// @include http://03xg.com/*
// @include http://*.03xg.com/*
// @include http://7mv.cc/*
// @include http://*.7mv.cc/*
// @include http://pan.52zz.org/*
// @include http://*.pan.52zz.org/*
// @include http://258pan.com/*
// @include http://*.258pan.com/*
// @include http://huimeiku.com/*
// @include http://*.huimeiku.com/*
// @include http://wpan.cc/*
// @include http://*.wpan.cc/*
// @include http://ypan.cc/*
// @include http://*.ypan.cc/*
// @include http://azpan.com/*
// @include http://*.azpan.com/*
// @include http://gxdisk.com/*
// @include http://*.gxdisk.com/*
// @include http://2kuai.com/*
// @include http://*.2kuai.com/*
// @include http://1wp.me/*
// @include http://*.1wp.me/*
// @include http://77pan.cc/*
// @include http://*.77pan.cc/*
// @include http://vvpan.com/*
// @include http://*.vvpan.com/*
// @include http://fmdisk.com/*
// @include http://*.fmdisk.com/*
// @include http://bx0635.com/*
// @include http://*.bx0635.com/*
// @include http://10pan.cc/*
// @include http://*.10pan.cc/*
// @include https://jixunmoe.github.io/cuwcl4c/config/

// GM_xmlHttpRequest 远端服务器列表
// @connect http://down.lepan.cc/*
// @connect http://music.baidu.com/*
// @connect http://yinyueyun.baidu.com/*
// @connect http://media.store.kugou.com/*
// @connect http://trackercdn.kugou.com/*
// @connect http://www.yinyuetai.com/*

// @downloadURL https://update.greasyfork.org/scripts/18123/%E8%B7%B3%E8%BF%87%E7%BD%91%E7%AB%99%E7%AD%89%E5%BE%85%E3%80%81%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8F%8A%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/18123/%E8%B7%B3%E8%BF%87%E7%BD%91%E7%AB%99%E7%AD%89%E5%BE%85%E3%80%81%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8F%8A%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
