// ==UserScript==
// @name         微博移动版(支持国际版)分享网页自动跳转PC版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  微博手机版(支持国际版)分享网页自动跳转PC版! 原版来自https://greasyfork.org/scripts/395195(不支持国际版),
// @author       coco
// @match        https://share.api.weibo.cn/*
// @match        https://weibo.com/ajax/side/cards/sideUser?*
// @match        https://m.weibo.cn/detail/*
// @match        https://m.weibo.cn/status/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444037/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%89%88%28%E6%94%AF%E6%8C%81%E5%9B%BD%E9%99%85%E7%89%88%29%E5%88%86%E4%BA%AB%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/444037/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%89%88%28%E6%94%AF%E6%8C%81%E5%9B%BD%E9%99%85%E7%89%88%29%E5%88%86%E4%BA%AB%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

var WeiboUtil = {
    // 62进制字典
    str62keys: [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],
};

/**
 * 62进制值转换为10进制
 * @param {String} str62 62进制值
 * @return {String} 10进制值
 */
WeiboUtil.str62to10 = function(str62) {
    var i10 = 0;
    for (var i = 0; i < str62.length; i++)
    {
        var n = str62.length - i - 1;
        var s = str62[i];
        i10 += this.str62keys.indexOf(s) * Math.pow(62, n);
    }
    return i10;
};

/**
 * 10进制值转换为62进制
 * @param {String} int10 10进制值
 * @return {String} 62进制值
 */
WeiboUtil.int10to62 = function(int10) {
    var s62 = '';
    var r = 0;
    while (int10 != 0 && s62.length < 100) {
        r = int10 % 62;
        s62 = this.str62keys[r] + s62;
        int10 = Math.floor(int10 / 62);
    }
    return s62;
};

/**
 * URL字符转换为mid
 * @param {String} url 微博URL字符
 * @return {String} 微博mid
 */
WeiboUtil.url2mid = function(url) {
    var mid = '';

    for (var i = url.length - 4; i > -4; i = i - 4) //从最后往前以4字节为一组读取URL字符
    {
        var offset1 = i < 0 ? 0 : i;
        var offset2 = i + 4;
        var str = url.substring(offset1, offset2);

        str = this.str62to10(str);
        if (offset1 > 0) { //若不是第一组，则不足7位补0
            while (str.length < 7)
            {
                str = '0' + str;
            }
        }

        mid = str + mid;
    }

    return mid;
};

/**
 * mid转换为URL字符
 * @param {String} mid 微博mid
 * @return {String} 微博URL字符
 */
WeiboUtil.mid2url = function(mid) {
    if(!mid) {
        return mid;
    }
    mid = String(mid); //mid数值较大，必须为字符串！
    if(!/^\d+$/.test(mid)){ return mid; }
    var url = '';

    for (var i = mid.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
    {
        var offset1 = i < 0 ? 0 : i;
        var offset2 = i + 7;
        var num = mid.substring(offset1, offset2);

        num = this.int10to62(num);
        url = num + url;
    }

    return url;
};

function replaceShareUrl2CardUrl()
{
    // 先用这个函数根据weibo id 找到对应的 用户 uid
    let ret = window.location.href.match(/weibo_id=(\d+)/);
    // let weiboMobileId = window.location.href.substring(ret.index+ret[0].length);
    let weiboMobileId = ret[1];
    let weiboPcId = WeiboUtil.mid2url(weiboMobileId);
    let ajaxUrl = `https://weibo.com/ajax/side/cards/sideUser?id=${weiboMobileId}&idType=mid`
    window.location.replace(ajaxUrl);
}

function replaceCardUrl2PcUrl()
{
    // 这里已经找到用户 uid, 和 weibo id组合起来访问PC页面
    const hrefRet = window.location.href.match(/sideUser\?id=(\d+)&/);
    const weiboMobileId = hrefRet[1];
    const docHtml = document.documentElement.innerHTML;
    const htmlRet = docHtml.match(/{"user":{"id":(\d+),/);
    const weiboUid = htmlRet[1];
    const weiboPcId = WeiboUtil.mid2url(weiboMobileId);
    const pcUrl = `https://weibo.com/${weiboUid}/${weiboPcId}`;
    window.location.replace(pcUrl);
}


function replaceNormalMobile2PcUrl()
{
    const html = document.documentElement.innerHTML
    const mid = html.match(/"mid":\s"(.*?)"/)[1]
    const uid = html.match(/https:\/\/m\.weibo\.cn\/u\/(.*?)\?/)[1];
    var id = "";
    if (document.location.href.match(/^.*m\.weibo\.cn\/(status|detail)\/(\w+)\??.*$/i) && !/^\d+$/.test(RegExp.$2)) {
        id = RegExp.$2;
    } else {
        id = WeiboUtil.mid2url(mid);
    }
    const href = `https://weibo.com/${uid}/${id}`
    window.location.replace(href);
}


try {

    if(window.location.href.match(/share.api.weibo.cn/))
    {
        replaceShareUrl2CardUrl();
    }
    else if(window.location.href.match(/weibo.com\/ajax\/side\/cards/))
    {
        replaceCardUrl2PcUrl();
    }
    else
    {
        replaceNormalMobile2PcUrl();
    }

    return;

} catch (e) {
    console.log('[WeiboPcGo] 解析 weiboPcId 失败', e)
}
})();
