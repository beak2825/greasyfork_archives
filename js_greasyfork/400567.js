// ==UserScript==
// @name        新浪微博PC版手机版相互跳转
// @namespace   https://blog.bgme.me
// @match       https://m.weibo.cn/status/*
// @match       https://m.weibo.cn/detail/*
// @match       https://weibo.com/*/*
// @exclude     https://weibo.com/u/*
// @exclude     https://weibo.com/p/*
// @exclude     https://weibo.com/*/p/*
// @exclude     https://weibo.com/tv/*
// @exclude     https://weibo.com/signup/*
// @grant       none
// @run-at      document-end
// @version     1.1.3
// @author      bgme
// @description 点击右上角按钮，跳转至当前微博电脑版/手机版
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @icon        https://weibo.com/favicon.ico
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/400567/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9APC%E7%89%88%E6%89%8B%E6%9C%BA%E7%89%88%E7%9B%B8%E4%BA%92%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/400567/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9APC%E7%89%88%E6%89%8B%E6%9C%BA%E7%89%88%E7%9B%B8%E4%BA%92%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    addButton();
    setTimeout(testPage, 500);
})


function addButton() {
    let img = document.createElement('img');
    img.src = 'data:image/png;base64,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'
    img.style.cssText = 'height: 35px;	width: 25px;';

    let button = document.createElement('button');
    button.id = 'weibo-pc-mobile-switch';
    button.className = 'icon';
    button.style.cssText = `position: fixed;
                            top: 15%;
                            right: 5%;
                            z-index: 99;
                            border-style: none;
                            text-align:center;
                            vertical-align:baseline;
                            background-color: #fafafa;
                            border-radius: 50%;`
    button.onclick = function () {
        jump();
    };
    button.appendChild(img);
    document.body.appendChild(button);
}

function getWebUri() {
    let script;
    for (let s of document.querySelectorAll('body script')) {
        if (s.innerText.length && !s.hasAttribute('src')) {
            script = s;
            break;
        }
    }
    eval(script.innerText);
    const juid = $render_data.status.user.id;
    const jmid = $render_data.status.mid;

    let uid = juid;
    let mid = jmid;
    if (document.querySelector('a.m-img-box')) {
        const duid = document.querySelector('a.m-img-box').href.match(/\/(\d+)$/)[1];
        if (duid != juid) { uid = duid; }
    }
    if (document.URL.match(/^.*m\.weibo\.cn\/(status|detail)\/(\d+)\??.*$/i)) {
        const dmid = document.URL.match(/^.*m\.weibo\.cn\/(status|detail)\/(\d+)\??.*$/i)[2];
        if (dmid != jmid) { mid = dmid; }
    }

    let id = "";
    if (document.URL.match(/^.*m\.weibo\.cn\/(status|detail)\/(\w+)\??.*$/i) && !/^\d+$/.test(RegExp.$2)) {
        id = RegExp.$2;
    } else {
        id = WeiboUtil.mid2url(mid);
    }

    const href = `https://weibo.com/${uid}/${id}`;
    return href;
}

function getMobileUri() {
    const id = document.URL.split('?')[0].split('/')[4];

    let mid = "";
    if (document.querySelector('div.WB_cardwrap.WB_feed_type')) {
        mid = document.querySelector('div.WB_cardwrap.WB_feed_type').getAttribute('mid');
    } else {
        mid = WeiboUtil.url2mid(id);
    }

    const href = `https://m.weibo.cn/status/${mid}`;
    return href;
}

function getUrl() {
    let host = (new URL(document.URL)).host;
    switch (host) {
        case 'm.weibo.cn': {
            let webUri = getWebUri();
            return webUri;
        }
        case 'weibo.com': {
            let mobileUri = getMobileUri();
            return mobileUri;
        }
    }
}

function testPage() {
    try {
        getUrl();
    } catch (error) {
        console.error(error);
        document.querySelector('#weibo-pc-mobile-switch').style.setProperty('display', 'none');
    }
}

function jump() {
    let url = getUrl();
    console.log(url);
    window.open(url);
}

/**
 * 新浪微博mid与url互转实用工具
 * 作者: XiNGRZ (http://weibo.com/xingrz)
 * gist: https://gist.github.com/fengmk2/1844413
 */

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
WeiboUtil.str62to10 = function (str62) {
    var i10 = 0;
    for (var i = 0; i < str62.length; i++) {
        var n = str62.length - i - 1;
        var s = str62[i];
        i10 += this.str62keys.indexOf(s) * Math.pow(62, n);
    }
    return String(i10);
};

/**
 * 10进制值转换为62进制
 * @param {String} int10 10进制值
 * @return {String} 62进制值
 */
WeiboUtil.int10to62 = function (int10) {
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
 * @param {String} url 微博URL字符，如 "wr4mOFqpbO"
 * @return {String} 微博mid，如 "201110410216293360"
 */
WeiboUtil.url2mid = function (url) {
    var mid = '';

    for (var i = url.length - 4; i > -4; i = i - 4)	//从最后往前以4字节为一组读取URL字符
    {
        var offset1 = i < 0 ? 0 : i;
        var offset2 = i + 4;
        var str = url.substring(offset1, offset2);

        str = this.str62to10(str);
        if (offset1 > 0)	//若不是第一组，则不足7位补0
        {
            while (str.length < 7) {
                str = '0' + str;
            }
        }

        mid = str + mid;
    }

    return mid;
};

/**
 * mid转换为URL字符
 * @param {String} mid 微博mid，如 "201110410216293360"
 * @return {String} 微博URL字符，如 "wr4mOFqpbO"
 */
WeiboUtil.mid2url = function (mid) {
    if (!mid) {
        return mid;
    }
    mid = String(mid); //mid数值较大，必须为字符串！
    if (!/^\d+$/.test(mid)) { return mid; }
    var url = '';

    for (var i = mid.length - 7; i > -7; i = i - 7)	//从最后往前以7字节为一组读取mid
    {
        var offset1 = i < 0 ? 0 : i;
        var offset2 = i + 7;
        var num = mid.substring(offset1, offset2);

        num = this.int10to62(num);
        if (offset1 > 0) //若不是第一组，则不足4位补0
        {
            while (num.length < 4) {
                num = '0' + num;
            }
        }
        url = num + url;
    }

    return url;
};
