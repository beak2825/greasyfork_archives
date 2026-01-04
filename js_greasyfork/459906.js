// ==UserScript==
// @name               通用_网页链接修改
// @name:zh-CN         通用_网页链接修改
// @name:en-US         Uni_URI Modify
// @description        自动替换对应域名的关键内容。此脚本受 https://greasyfork.org/zh-CN/scripts/2312 启发。
// @version            1.0.3
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/liulipack
// @match              *://*/*
// @supportURL         https://gitlab.com/liulipack/UserScript
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/459906/%E9%80%9A%E7%94%A8_%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/459906/%E9%80%9A%E7%94%A8_%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

/*
{
    "remark": "备注",
    "host": "^域名正则$",
    "param": ["待替换内容或待移除内容", "被替换内容"],
    "param": () => {
        // 自定义代码
    }
},
{
    "remark": "remarks",
    "host": "^host RegExp$",
    "param": ["Waiting to replace or remove content", "Replaced content"]
    "param": () => {
        // Custom Codes
    }
},
*/

'use strict';

// 定义参数(cfg)变量
let cfg = [
    { "remark": "最优图片_新浪微博", "host": "^((ww|wx|ws|tvax|tva)\\d|wxt|wt).sinaimg.cn$", "param": ["(bmiddle|default|mw1024|mw2000|mw600|mw690|nmw690|orj1080|orj360|orj480|small|square|thumb150|thumb180|thumb300|thumbnail|wap720|webp720|woriginal)", "large"] },
    { "remark": "最优图片_哔哩哔哩", "host": /^\w+.hdslb.com$/, "param": ["@"] },
    { "remark": "最优图片_Youtube", "host": "^i.ytimg.com|img.youtube.com$", "param": ["(mq|hq|sd)?default", "maxresdefault"] },
    { "remark": "最优图片_网易云音乐", "host": /^p\d.music.126.net$/, "param": [/\?/] },
]

// 遍历配置
cfg.forEach(data => {
    // 如果域名匹配且不存在替换后内容，就替换页面
    if(RegExp(data.host).test(location.host)) {
        if(typeof data.param === "function") {
            // 如果为自定义命令，就执行
            data.param();
        }else if(data.param.length === 2 && location.href.search(data.param[1]) === -1) {
            // 如果为替换链接且被替换内容不存在，就替换
            open(location.href.replace(RegExp(data.param[0]), data.param[1]), "_self");
        }else if(data.param.length === 1 && location.href.search(data.param[0]) !== -1) {
            // 如果为移除链接且待移除内容不存在，就移除
            open(location.href.split(data.param[0])[0], "_self");
        }
    }
})