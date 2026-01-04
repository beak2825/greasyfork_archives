// ==UserScript==
// @name               通用_反超链接拦截
// @name:zh-CN         通用_反超链接拦截
// @name:en-US         Uni_Anti URL-Blocker
// @description        自动完成超链接跳转。
// @version            2.2.2
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/458504/%E9%80%9A%E7%94%A8_%E5%8F%8D%E8%B6%85%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/458504/%E9%80%9A%E7%94%A8_%E5%8F%8D%E8%B6%85%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

/* 配置示范 / Config demo
{
    "remark": "备注",
    "regexp": "域名加路径正则",
    "mode": "解析模式：0 即链接净化、1 即元素文本、2 即元素点击",
    "get": "网页参数键或元素选择器"
},
{
    "remark": "Remark",
    "regexp": "RegExp match path & query",
    "mode": "Parse Mode: 0 is URI purify, 1 is Element text, 2 is Click element",
    "get": "URL param Key or Element selector"
}
*/

'use strict';

// 定义清单(list)变量和快捷选择器($)函数。
let list = [
    {"remark": "Pixiv", "regexp": "^www.pixiv.net/jump.php$", "mode": 2, "get": "a"},
    {"remark": "谷歌搜索", "regexp": "^www.google.com/url$", "mode": 0, "get": "url"},
    {"remark": "Gitee", "regexp": "^gitee.com/link$", "mode": 0, "get": "target"},
    {"remark": "知乎", "regexp": "^link.zhihu.com/$", "mode": 0, "get": "target"},
    {"remark": "天眼查", "regexp": "^www.tianyancha.com/security$", "mode": 0, "get": "target"},
    {"remark": "掘金", "regexp": "^link.juejin.cn/$", "mode": 0, "get": "target"},
    {"remark": "百度百科", "regexp": "^baike.baidu.com/reference/[0-9]./*", "mode": 2, "get": "a.link"},
    {"remark": "B站维基", "regexp": "^game.bilibili.com/linkfilter/$", "mode": 0, "get": "url"},
    {"remark": "ACG 盒子", "regexp": "^www.acgbox.link/go/$", "mode": 0, "get": "url"},
    {"remark": "好搜(360 搜索)", "regexp": "^www.so.com/link$", "mode": 0, "get": "m"},
    //{"remark": "CSDN", "regexp": "^link.csdn.net/$", "mode": 0, "get": "target"}, 经复查，拦截暂时被去除
    {"remark": "简书", "regexp": "^www.jianshu.com/go-wild$", "mode": 0, "get": "url"},
    {"remark": "腾讯文档", "regexp": "^docs.qq.com/scenario/link.html$", "mode": 0, "get": "url"},
    {"remark": "QQ邮箱", "regexp": "^mail.qq.com/cgi-bin/readtemplate$", "mode": 0, "get": "url"},
    {"remark": "Epic Games", "regexp": "^redirect.epicgames.com/$", "mode": 0, "get": "redirectTo"},
    {"remark": "爱发电", "regexp": "^afdian.net/link$", "mode": 0, "get": "target"},
    {"remark": "Youtube", "regexp": "^www.youtube.com/redirect$", "mode": 0, "get": "q"},
    {"remark": "少数派", "regexp": "^sspai.com/link$", "mode": 0, "get": "target"},
    {"remark": "SoundCloud", "regexp": "^gate.sc/$", "mode": 0, "get": "url"},
],
    $ = ele => document.querySelector(ele);

// 遍历清单
list.forEach(data => {
    // 如果域名加路径匹配
    if(RegExp(data.regexp).test(location.host + location.pathname)) {
        if(data.mode === 0) {
            // 如果是“链接参数”模式，就定义超链接(URL)变量并访问
            let URL = (data.get.split('|').length === 1) ? location.search.split(`${data.get}=`)[1].split('&')[0] : location.search.split(data.get.split('|')[0])[1].split(data.get.split('|')[1])[0] ;

            (/^http/.test(URL)) ? open(decodeURIComponent(URL), '_self') : open(atob(URL), '_self') ;
        }else if(data.mode === 1) {
            // 如果是“元素文本”模式，就获取文本并访问
            open($(data.get).textContent, '_self');
        }else if(data.mode === 2) {
            // 如果是“元素点击”模式，就点击元素
            $(data.get).click();
        }
    }
})

// 监听点击事件、遍历列表
addEventListener('click', ele => {
    // 如果点击的是链接，就遍历清单。如果匹配，就阻止点击、定义超链接(URL)变量并在新标签页访问
    if(ele.target.localName === 'a') {
        list.forEach(data => {
            if(RegExp(data.regexp).test(ele.target.href.replace(/^http(s)?:\/\//, '').split('?')[0]) && data.mode === 0) {
                ele.preventDefault();
                let URL = (data.get.split('|').length === 1) ? ele.target.href.split(`${data.get}=`)[1].split('&')[0] : ele.target.href.split(data.get.split('|')[0])[1].split(data.get.split('|')[1])[0] ;

                (/^http/.test(URL)) ? open(decodeURIComponent(URL), '_blank') : open(atob(URL), '_blank') ;
            }
        })
    }
})