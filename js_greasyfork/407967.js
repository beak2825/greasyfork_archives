// ==UserScript==
// @name        知乎手机网页版改进
// @namespace   https://www.zhihu.com/
// @match       https://www.zhihu.com/
// @match       https://www.zhihu.com/?*
// @match       https://www.zhihu.com/question/*
// @match       https://www.zhihu.com/zvideo/*
// @match       https://zhuanlan.zhihu.com/p/*
// @grant       none
// @version     1.6.5
// @author      nameldk
// @description 使手机网页版可以加载更多答案
// @note        2025.06.08  v1.6.5 问题答案页面添加查看全部问题链接
// @note        2025.06.07  v1.6.4 修复问题答案页面评论消失。列表页gif,图片点击处理。
// @note        2025.05.15  v1.6.3 修复问题页而gif无法播放,加载评论时动画失效
// @note        2025.05.15  v1.6.2 去掉弹窗
// @note        2025.05.12  v1.6.1 修复获取答案接口验证问题
// @note        2024.01.01  v1.6.0 显示剩余评论数量
// @note        2023.05.27  v1.5.3 修复评论接口验证问题
// @note        2023.05.04  v1.5.2 评论中的链接去除中间页直接打开；评论中的图片可预览、图片表情可显示。
// @note        2023.05.02  v1.5.1 调整回复样式；自动隐藏回复收起按钮。
// @note        2023.05.01  v1.5.0 评论使用新接口；加载子回复。修复点击图片导致评论按钮消失的问题。
// @note        2023.04.30  v1.4.3 修复加载状态条不显示的问题。
// @note        2023.03.31  v1.4.2 修改展开、收起图标。隐藏专栏悬浮按钮。
// @note        2022.10.30  v1.4.1 避免页面切换时直接替换页面内容时绑定的事件消息，所以点击标题链接时重新加载页面(简单粗暴)。
// @note        2022.09.29  v1.4.0 获取回答使用新接口。
// @note        2022.09.20  v1.3.8 隐藏VIP推荐。
// @note        2022.08.05  v1.3.7 处理页面回答折叠未显示的问题。
// @note        2022.07.17  v1.3.6 处理LinkCard点击无效的问题。添加IP信息。显示评论表情。
// @note        2022.07.13  v1.3.5 处理部分答案重复显示的问题。
// @note        2022.06.26  v1.3.4 隐藏推荐；修复链接打开失败的问题。
// @note        2022.06.25  v1.3.3 隐藏底部按钮
// @note        2022.03.30  v1.3.2 添加评论数量
// @note        2022.03.19  v1.3.1 处理回答加载不出来的问题，处理查看所有回答点击错误
// @note        2022.01.29  v1.3.0 处理回答加载不出来的问题
// @note        2021.06.24  v1.2.9 处理评论样式
// @note        2021.06.10  v1.2.8 处理视频被误删除问题
// @note        2020.12.30  v1.2.7 处理首页和视频页面
// @note        2020.12.22  v1.2.6 修复链接无法打开的问题，外部链接直接打开
// @note        2020.10.13  v1.2.5 修复蒙层偶尔不消失的问题
// @note        2020.09.14  v1.2.4 修复评论超出的问题
// @note        2020.08.14  v1.2.3 适配新版页面
// @note        2020.08.13  v1.2.2 修复已加载完的评论切换排序不显示的问题
// @note        2020.08.03  v1.2.1 处理评论加载不完全,评论作者标识,收起按钮颜色区分,一些样式调整
// @note        2020.08.02  v1.2 处理gif,视频,收起后的定位,发布时间,页面被清空的问题
// @downloadURL https://update.greasyfork.org/scripts/407967/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E6%94%B9%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/407967/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E6%94%B9%E8%BF%9B.meta.js
// ==/UserScript==

const questionNumber = (location.href.match(/\/question\/(\d+)/)||[])[1];
const inDetailPage = location.href.match(/\/question\/\d+\/answer\/\d+/);
const inHomePage = location.pathname === '/';
const inZvideo = location.pathname.indexOf('/zvideo/') > -1;
const inZhuanlan = location.href.match(/zhuanlan\.zhihu\.com\/p\/\d+/)
const fromMobile = navigator.userAgent.match(/Android|iPhone|iPod|Opera Mini|IEMobile/i);

var is_end = 0;
var is_loading_answer = 0;
var is_loading_comment = 0;
var load_answer_id_map = {};
var EMOJI_URL_MAP = null;
var elList = null;
var elLoading = null;
var viewportElCheckList = [];
var debug = 0;
var init_done = 0;
var answer_next_url = null;
var _log_counter = 0;
var log = debug ? function () {
    return console.log.apply(console, ['mylog', ++_log_counter, new Date().toLocaleTimeString().substring(0,8)
    ].concat([].slice.call(arguments)));
} : function(){};


function forEachArray(arrayLike, cb) {
    if (arrayLike) {
        Array.prototype.forEach.call(arrayLike, el => cb(el));
    }
}

function forEachBySelector(s, cb) {
    Array.prototype.forEach.call(document.querySelectorAll(s), el => cb(el));
}

function removeBySelector(s) {
    forEachBySelector(s, ele => ele.remove());
}

function hideBySelector(s) {
    forEachBySelector(s, ele => ele.style.display = "none");
}

function hideAllNextSiblings(el) {
    if (!el) return
    let nextSb = el.nextElementSibling
    while (nextSb) {
        nextSb.style.display = 'none'
        nextSb = nextSb.nextElementSibling
    }
}

function hideByAddCss(s) {
    addStyle(`<style>${s}{display:none;}</style>`)
}

function getElementHeight(el) {
    if (el) {
        // el.offsetHeight
        return parseFloat(window.getComputedStyle(el, null).height.replace("px", ""));
    }
    return 0;
}

function isElementInViewport (el) {
    // https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
    if (!el)
        return false;

    var rect = el.getBoundingClientRect();
    if (rect.top >= 0) { // ↓
        return rect.top < window.innerHeight;
    } else {
        return rect.top + rect.height > 0;
    }
}


function formatNumber(num) {
    if (num > 10000) {
        return (num / 10000).toFixed(2) + '万';
    } else {
        return num;
    }
}


function formatUrl(url, formatStr) {
    if (!formatStr)
        formatStr = 'xs';
    // s,xs,m, r
    return url.replace('{size}', formatStr);
}

function formatDate(e, t) {
    if(e.toString().length === 10) { // 秒
        e = e*1000;
    }
    e = new Date(e);
    // yyyy-MM-dd hh:mm:ss
    var n = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "h+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        S: e.getMilliseconds()
    };
    /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
    for (var r in n)
        new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 === RegExp.$1.length ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
    return t
}

function getDate(timestamp) {
    return formatDate(timestamp, 'yyyy-MM-dd');
}

function addStyle(styleStr) {
    if (styleStr) {
        document.body.insertAdjacentHTML('beforeend', styleStr);
    }
}

function stopPropagation(el) {
    if (el) {
        el.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
}

function observerAddNodes(targetNode, cb) {
    if (!targetNode || !cb)
        return;
    const config = { childList:true, subtree: true };
    const callback = function(mutationsList) {
        for(const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                log('got_addNode', mutation.addedNodes.length, mutation.addedNodes);
                forEachArray(mutation.addedNodes, el => cb(el));
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

function observerNodeAttributes(targetNode, cb) {
    if (!targetNode || !cb)
        return;
    const config = {attributes: true};
    const callback = function (mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                cb(mutation)
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

function getEmojiImg(e) {
    if (!EMOJI_URL_MAP) {
        makeEmojiMap();
    }
    var t = EMOJI_URL_MAP[e];
    return t ? '<img data-zhihu-emoticon="'.concat(e, '" src="').concat(t, '" alt="').concat(e, '" />') : e;
}

function makeEmojiMap() {
    const EMOTICON_EMOJI = [{"static_image_url":"https://pic2.zhimg.com/v2-6fe2283baa639ae1d7c024487f1d68c7.png","title":"谢邀","placeholder":"[谢邀]"},{"static_image_url":"https://pic2.zhimg.com/v2-419a1a3ed02b7cfadc20af558aabc897.png","title":"赞同","placeholder":"[赞同]"},{"static_image_url":"https://pic4.zhimg.com/v2-66e5de3da039ac969d3b9d4dc5ef3536.png","title":"蹲","placeholder":"[蹲]"},{"static_image_url":"https://pic1.zhimg.com/v2-0942128ebfe78f000e84339fbb745611.png","title":"爱","placeholder":"[爱]"},{"static_image_url":"https://pic4.zhimg.com/v2-52f8c87376792e927b6cf0896b726f06.png","title":"害羞","placeholder":"[害羞]"},{"static_image_url":"https://pic2.zhimg.com/v2-72b9696632f66e05faaca12f1f1e614b.png","title":"好奇","placeholder":"[好奇]"},{"static_image_url":"https://pic4.zhimg.com/v2-bffb2bf11422c5ef7d8949788114c2ab.png","title":"思考","placeholder":"[思考]"},{"static_image_url":"https://pic4.zhimg.com/v2-c96dd18b15beb196b2daba95d26d9b1c.png","title":"酷","placeholder":"[酷]"},{"static_image_url":"https://pic1.zhimg.com/v2-3ac403672728e5e91f5b2d3c095e415a.png","title":"大笑","placeholder":"[大笑]"},{"static_image_url":"https://pic1.zhimg.com/v2-3700cc07f14a49c6db94a82e989d4548.png","title":"微笑","placeholder":"[微笑]"},{"static_image_url":"https://pic1.zhimg.com/v2-b62e608e405aeb33cd52830218f561ea.png","title":"捂脸","placeholder":"[捂脸]"},{"static_image_url":"https://pic4.zhimg.com/v2-0e26b4bbbd86a0b74543d7898fab9f6a.png","title":"捂嘴","placeholder":"[捂嘴]"},{"static_image_url":"https://pic4.zhimg.com/v2-3bb879be3497db9051c1953cdf98def6.png","title":"飙泪笑","placeholder":"[飙泪笑]"},{"static_image_url":"https://pic2.zhimg.com/v2-f3b3b8756af8b42bd3cb534cbfdbe741.png","title":"耶","placeholder":"[耶]"},{"static_image_url":"https://pic1.zhimg.com/v2-aa15ce4a2bfe1ca54c8bb6cc3ea6627b.png","title":"可怜","placeholder":"[可怜]"},{"static_image_url":"https://pic2.zhimg.com/v2-3846906ea3ded1fabbf1a98c891527fb.png","title":"惊喜","placeholder":"[惊喜]"},{"static_image_url":"https://pic4.zhimg.com/v2-dd613c7c81599bcc3085fc855c752950.png","title":"流泪","placeholder":"[流泪]"},{"static_image_url":"https://pic1.zhimg.com/v2-41f74f3795489083630fa29fde6c1c4d.png","title":"大哭","placeholder":"[大哭]"},{"static_image_url":"https://pic4.zhimg.com/v2-6a976b21fd50b9535ab3e5b17c17adc7.png","title":"生气","placeholder":"[生气]"},{"static_image_url":"https://pic4.zhimg.com/v2-0d9811a7961c96d84ee6946692a37469.png","title":"惊讶","placeholder":"[惊讶]"},{"static_image_url":"https://pic1.zhimg.com/v2-76c864a7fd5ddc110965657078812811.png","title":"调皮","placeholder":"[调皮]"},{"static_image_url":"https://pic1.zhimg.com/v2-d6d4d1689c2ce59e710aa40ab81c8f10.png","title":"衰","placeholder":"[衰]"},{"static_image_url":"https://pic2.zhimg.com/v2-7f09d05d34f03eab99e820014c393070.png","title":"发呆","placeholder":"[发呆]"},{"static_image_url":"https://pic1.zhimg.com/v2-4e025a75f219cf79f6d1fda7726e297f.png","title":"机智","placeholder":"[机智]"},{"static_image_url":"https://pic4.zhimg.com/v2-f80e1dc872d68d4f0b9ac76e8525d402.png","title":"嘘","placeholder":"[嘘]"},{"static_image_url":"https://pic3.zhimg.com/v2-b779f7eb3eac05cce39cc33e12774890.png","title":"尴尬","placeholder":"[尴尬]"},{"static_image_url":"https://pic1.zhimg.com/v2-c65aaaa25730c59f5097aca04e606d88.png","title":"小情绪","placeholder":"[小情绪]"},{"static_image_url":"https://pic1.zhimg.com/v2-132ab52908934f6c3cd9166e51b99f47.png","title":"为难","placeholder":"[为难]"},{"static_image_url":"https://pic4.zhimg.com/v2-74ecc4b114fce67b6b42b7f602c3b1d6.png","title":"吃瓜","placeholder":"[吃瓜]"},{"static_image_url":"https://pic2.zhimg.com/v2-58e3ec448b58054fde642914ebb850f9.png","title":"语塞","placeholder":"[语塞]"},{"static_image_url":"https://pic3.zhimg.com/v2-4e4870fc6e57bb76e7e5924375cb20b6.png","title":"看看你","placeholder":"[看看你]"},{"static_image_url":"https://pic2.zhimg.com/v2-1043b00a7b5776e2e6e1b0af2ab7445d.png","title":"撇嘴","placeholder":"[撇嘴]"},{"static_image_url":"https://pic2.zhimg.com/v2-e6270881e74c90fc01994e8cd072bd3a.png","title":"魔性笑","placeholder":"[魔性笑]"},{"static_image_url":"https://pic1.zhimg.com/v2-99bb6a605b136b95e442f5b69efa2ccc.png","title":"潜水","placeholder":"[潜水]"},{"static_image_url":"https://pic4.zhimg.com/v2-6551348276afd1eaf836551b93a94636.png","title":"口罩","placeholder":"[口罩]"},{"static_image_url":"https://pic2.zhimg.com/v2-c99cdc3629ff004f83ff44a952e5b716.png","title":"开心","placeholder":"[开心]"},{"static_image_url":"https://pic4.zhimg.com/v2-8a8f1403a93ddd0a458bed730bebe19b.png","title":"滑稽","placeholder":"[滑稽]","id":"1114211774655778817"},{"static_image_url":"https://pic4.zhimg.com/v2-ca0015e8ed8462cfce839fba518df585.png","title":"笑哭","placeholder":"[笑哭]"},{"static_image_url":"https://pic2.zhimg.com/v2-d4f78d92922632516769d3f2ce055324.png","title":"白眼","placeholder":"[白眼]"},{"static_image_url":"https://pic2.zhimg.com/v2-9ab384e3947547851cb45765e6fc1ea8.png","title":"红心","placeholder":"[红心]"},{"static_image_url":"https://pic4.zhimg.com/v2-a8f46a21217d58d2b4cdabc4568fde15.png","title":"柠檬","placeholder":"[柠檬]"},{"static_image_url":"https://pic2.zhimg.com/v2-3e36d546a9454c8964fbc218f0db1ff8.png","title":"拜托","placeholder":"[拜托]"},{"static_image_url":"https://pic2.zhimg.com/v2-f5aa165e86b5c9ed3b7bee821da59365.png","title":"握手","placeholder":"[握手]"},{"static_image_url":"https://pic1.zhimg.com/v2-c71427010ca7866f9b08c37ec20672e0.png","title":"赞","placeholder":"[赞]"},{"static_image_url":"https://pic1.zhimg.com/v2-d5c0ed511a09bf5ceb633387178e0d30.png","title":"发火","placeholder":"[发火]"},{"static_image_url":"https://pic4.zhimg.com/v2-395d272d5635143119b1dbc0b51e05e4.png","title":"不抬杠","placeholder":"[不抬杠]"},{"static_image_url":"https://pic2.zhimg.com/v2-cb191a92f1296e33308b2aa16f61bfb9.png","title":"种草","placeholder":"[种草]"},{"static_image_url":"https://pic2.zhimg.com/v2-b2e3fa9e0b6f431bd18d4a9d5d3c6596.png","title":"抱抱","placeholder":"[抱抱]"},{"static_image_url":"https://pic4.zhimg.com/v2-501ff2e1fb7cf3f9326ec5348dc8d84f.png","title":"doge","placeholder":"[doge]"},{"static_image_url":"https://pic3.zhimg.com/v2-35808905e85664eda2125a334fc7dff8.png","title":"666","placeholder":"[666]"},{"static_image_url":"https://pic1.zhimg.com/v2-1b6c8a81fe19f2ceda77241733aadf8b.png","title":"闭嘴","placeholder":"[闭嘴]"},{"static_image_url":"https://pic1.zhimg.com/v2-36ee7432e619319d858b202015a80d3f.png","title":"吃瓜中","placeholder":"[吃瓜中]"},{"static_image_url":"https://pic4.zhimg.com/v2-bb0c68fefe47605ebc91c55b7f0a167d.png","title":"打脸","placeholder":"[打脸]"},{"static_image_url":"https://pic1.zhimg.com/v2-4779ff07dfe6b722cacfcf3c5185357d.png","title":"蹲","placeholder":"[蹲]"},{"static_image_url":"https://pic1.zhimg.com/v2-e39d5eebfef8b0ac6065ad156cb05e66.png","title":"感谢","placeholder":"[感谢]"},{"static_image_url":"https://pic1.zhimg.com/v2-ffb16dd9ff04470d4efc37130ec82542.png","title":"哈士奇","placeholder":"[哈士奇]"},{"static_image_url":"https://pic1.zhimg.com/v2-13d3fcb823a2d323704cd74e48260627.png","title":"加油","placeholder":"[加油]"},{"static_image_url":"https://pic1.zhimg.com/v2-57502a494dceb07009c68de3f98f7c73.png","title":"纠结","placeholder":"[纠结]"},{"static_image_url":"https://pic2.zhimg.com/v2-5507bf46889ec156eb781f60859ae415.png","title":"哭","placeholder":"[哭]"},{"static_image_url":"https://pic2.zhimg.com/v2-43496a438dbde374d53c3e09dafde6c8.png","title":"流口水","placeholder":"[流口水]"},{"static_image_url":"https://pic2.zhimg.com/v2-43496a438dbde374d53c3e09dafde6c8.png","title":"社会人","placeholder":"[社会人]"},{"static_image_url":"https://pic2.zhimg.com/v2-76230e3ed1edcc8d3cb7047a5b78ba0e.png","title":"生气了","placeholder":"[生气了]"},{"static_image_url":"https://pic1.zhimg.com/v2-9de57d1821502441814913e963f502c7.png","title":"思考中","placeholder":"[思考中]"},{"static_image_url":"https://pic1.zhimg.com/v2-d53a13cbc6dac54eb406b47652fc66b8.png","title":"酸了","placeholder":"[酸了]"},{"static_image_url":"https://pic1.zhimg.com/v2-a31cd513ddc2b487587805d17629d570.png","title":"偷看","placeholder":"[偷看]"},{"static_image_url":"https://pic2.zhimg.com/v2-0e52bbdc84106d8a64edd043b53e8775.png","title":"头秃","placeholder":"[头秃]"},{"static_image_url":"https://pic1.zhimg.com/v2-e9df774ecb65c03f359eadff6872ce02.png","title":"吐血","placeholder":"[吐血]"},{"static_image_url":"https://pic1.zhimg.com/v2-70c38b608df613d862ee0140dcb26465.png","title":"哇","placeholder":"[哇]"},{"static_image_url":"https://pic4.zhimg.com/v2-56873671e39c80904f745a895d93d0b8.png","title":"旺柴","placeholder":"[旺柴]"},{"static_image_url":"https://pic4.zhimg.com/v2-0b0cabfad4695a46347ea494034b2c9c.png","title":"学到了","placeholder":"[学到了]"},{"static_image_url":"https://pic4.zhimg.com/v2-57d961f9da6b0601c0f48686cbc848aa.png","title":"疑问","placeholder":"[疑问]"},{"static_image_url":"https://pic4.zhimg.com/v2-34af8e9abc783c171bb47496a7773e89.png","title":"晕","placeholder":"[晕]"},{"static_image_url":"https://pic1.zhimg.com/v2-5533319c4f5740bd45897429c1ad3553.png","title":"裂开","placeholder":"[裂开]"}];

    EMOJI_URL_MAP = {};
    EMOTICON_EMOJI.forEach(e => {
        EMOJI_URL_MAP[e.placeholder] = e.static_image_url;
    });
}

function debounce(fn, delay) {
    let timer
    return function () {
        const context = this;
        const args = arguments;
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay);
    };
}

function md5(s) {
    function f1(t, e, n) {
        var r;
        !function (o) {
            "use strict";

            function i(t, e) {
                var n = (65535 & t) + (65535 & e);
                return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
            }

            function a(t, e, n, r, o, a) {
                return i((u = i(i(e, t), i(r, a))) << (c = o) | u >>> 32 - c, n);
                var u, c
            }

            function u(t, e, n, r, o, i, u) {
                return a(e & n | ~e & r, t, e, o, i, u)
            }

            function c(t, e, n, r, o, i, u) {
                return a(e & r | n & ~r, t, e, o, i, u)
            }

            function s(t, e, n, r, o, i, u) {
                return a(e ^ n ^ r, t, e, o, i, u)
            }

            function l(t, e, n, r, o, i, u) {
                return a(n ^ (e | ~r), t, e, o, i, u)
            }

            function f(t, e) {
                var n, r, o, a, f;
                t[e >> 5] |= 128 << e % 32,
                    t[14 + (e + 64 >>> 9 << 4)] = e;
                var d = 1732584193
                    , p = -271733879
                    , h = -1732584194
                    , v = 271733878;
                for (n = 0; n < t.length; n += 16)
                    r = d,
                        o = p,
                        a = h,
                        f = v,
                        d = u(d, p, h, v, t[n], 7, -680876936),
                        v = u(v, d, p, h, t[n + 1], 12, -389564586),
                        h = u(h, v, d, p, t[n + 2], 17, 606105819),
                        p = u(p, h, v, d, t[n + 3], 22, -1044525330),
                        d = u(d, p, h, v, t[n + 4], 7, -176418897),
                        v = u(v, d, p, h, t[n + 5], 12, 1200080426),
                        h = u(h, v, d, p, t[n + 6], 17, -1473231341),
                        p = u(p, h, v, d, t[n + 7], 22, -45705983),
                        d = u(d, p, h, v, t[n + 8], 7, 1770035416),
                        v = u(v, d, p, h, t[n + 9], 12, -1958414417),
                        h = u(h, v, d, p, t[n + 10], 17, -42063),
                        p = u(p, h, v, d, t[n + 11], 22, -1990404162),
                        d = u(d, p, h, v, t[n + 12], 7, 1804603682),
                        v = u(v, d, p, h, t[n + 13], 12, -40341101),
                        h = u(h, v, d, p, t[n + 14], 17, -1502002290),
                        d = c(d, p = u(p, h, v, d, t[n + 15], 22, 1236535329), h, v, t[n + 1], 5, -165796510),
                        v = c(v, d, p, h, t[n + 6], 9, -1069501632),
                        h = c(h, v, d, p, t[n + 11], 14, 643717713),
                        p = c(p, h, v, d, t[n], 20, -373897302),
                        d = c(d, p, h, v, t[n + 5], 5, -701558691),
                        v = c(v, d, p, h, t[n + 10], 9, 38016083),
                        h = c(h, v, d, p, t[n + 15], 14, -660478335),
                        p = c(p, h, v, d, t[n + 4], 20, -405537848),
                        d = c(d, p, h, v, t[n + 9], 5, 568446438),
                        v = c(v, d, p, h, t[n + 14], 9, -1019803690),
                        h = c(h, v, d, p, t[n + 3], 14, -187363961),
                        p = c(p, h, v, d, t[n + 8], 20, 1163531501),
                        d = c(d, p, h, v, t[n + 13], 5, -1444681467),
                        v = c(v, d, p, h, t[n + 2], 9, -51403784),
                        h = c(h, v, d, p, t[n + 7], 14, 1735328473),
                        d = s(d, p = c(p, h, v, d, t[n + 12], 20, -1926607734), h, v, t[n + 5], 4, -378558),
                        v = s(v, d, p, h, t[n + 8], 11, -2022574463),
                        h = s(h, v, d, p, t[n + 11], 16, 1839030562),
                        p = s(p, h, v, d, t[n + 14], 23, -35309556),
                        d = s(d, p, h, v, t[n + 1], 4, -1530992060),
                        v = s(v, d, p, h, t[n + 4], 11, 1272893353),
                        h = s(h, v, d, p, t[n + 7], 16, -155497632),
                        p = s(p, h, v, d, t[n + 10], 23, -1094730640),
                        d = s(d, p, h, v, t[n + 13], 4, 681279174),
                        v = s(v, d, p, h, t[n], 11, -358537222),
                        h = s(h, v, d, p, t[n + 3], 16, -722521979),
                        p = s(p, h, v, d, t[n + 6], 23, 76029189),
                        d = s(d, p, h, v, t[n + 9], 4, -640364487),
                        v = s(v, d, p, h, t[n + 12], 11, -421815835),
                        h = s(h, v, d, p, t[n + 15], 16, 530742520),
                        d = l(d, p = s(p, h, v, d, t[n + 2], 23, -995338651), h, v, t[n], 6, -198630844),
                        v = l(v, d, p, h, t[n + 7], 10, 1126891415),
                        h = l(h, v, d, p, t[n + 14], 15, -1416354905),
                        p = l(p, h, v, d, t[n + 5], 21, -57434055),
                        d = l(d, p, h, v, t[n + 12], 6, 1700485571),
                        v = l(v, d, p, h, t[n + 3], 10, -1894986606),
                        h = l(h, v, d, p, t[n + 10], 15, -1051523),
                        p = l(p, h, v, d, t[n + 1], 21, -2054922799),
                        d = l(d, p, h, v, t[n + 8], 6, 1873313359),
                        v = l(v, d, p, h, t[n + 15], 10, -30611744),
                        h = l(h, v, d, p, t[n + 6], 15, -1560198380),
                        p = l(p, h, v, d, t[n + 13], 21, 1309151649),
                        d = l(d, p, h, v, t[n + 4], 6, -145523070),
                        v = l(v, d, p, h, t[n + 11], 10, -1120210379),
                        h = l(h, v, d, p, t[n + 2], 15, 718787259),
                        p = l(p, h, v, d, t[n + 9], 21, -343485551),
                        d = i(d, r),
                        p = i(p, o),
                        h = i(h, a),
                        v = i(v, f);
                return [d, p, h, v]
            }

            function d(t) {
                var e, n = "", r = 32 * t.length;
                for (e = 0; e < r; e += 8)
                    n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
                return n
            }

            function p(t) {
                var e, n = [];
                for (n[(t.length >> 2) - 1] = void 0,
                         e = 0; e < n.length; e += 1)
                    n[e] = 0;
                var r = 8 * t.length;
                for (e = 0; e < r; e += 8)
                    n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
                return n
            }

            function h(t) {
                var e, n, r = "0123456789abcdef", o = "";
                for (n = 0; n < t.length; n += 1)
                    e = t.charCodeAt(n),
                        o += r.charAt(e >>> 4 & 15) + r.charAt(15 & e);
                return o
            }

            function v(t) {
                return unescape(encodeURIComponent(t))
            }

            function A(t) {
                return function (t) {
                    return d(f(p(t), 8 * t.length))
                }(v(t))
            }

            function m(t, e) {
                return function (t, e) {
                    var n, r, o = p(t), i = [], a = [];
                    for (i[15] = a[15] = void 0,
                         o.length > 16 && (o = f(o, 8 * t.length)),
                             n = 0; n < 16; n += 1)
                        i[n] = 909522486 ^ o[n],
                            a[n] = 1549556828 ^ o[n];
                    return r = f(i.concat(p(e)), 512 + 8 * e.length),
                        d(f(a.concat(r), 640))
                }(v(t), v(e))
            }

            function g(t, e, n) {
                return e ? n ? m(e, t) : h(m(e, t)) : n ? A(t) : h(A(t))
            }

            void 0 === (r = function () {
                return g
            }
                .call(e, n, e, t)) || (t.exports = r)
        }()
    }
    var o = {}
    f1(o);
    return o.exports(s)
}
function zhihu_enc(s) {
    function f1(__unused_webpack_module, exports) {
        "use strict";
        var __webpack_unused_export__;

        function o(t) {
            return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.A ? function (t) {
                        return typeof t
                    }
                    : function (t) {
                        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                    }
            )(t)
        }

        function x(e) {
            return C(e) || s(e) || t()
        }

        function C(t) {
            if (Array.isArray(t)) {
                for (var e = 0, n = new Array(t.length); e < t.length; e++)
                    n[e] = t[e];
                return n
            }
        }

        function s(t) {
            if (Symbol.A in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t))
                return Array.from(t)
        }

        function t() {
            throw new TypeError("Invalid attempt to spread non-iterable instance")
        }

        __webpack_unused_export__ = {
            value: !0
        };
        var A = "3.0", S = "undefined" != typeof window ? window : {}, h;

        function i(t, e, n) {
            e[n] = 255 & t >>> 24,
                e[n + 1] = 255 & t >>> 16,
                e[n + 2] = 255 & t >>> 8,
                e[n + 3] = 255 & t
        }

        function B(t, e) {
            return (255 & t[e]) << 24 | (255 & t[e + 1]) << 16 | (255 & t[e + 2]) << 8 | 255 & t[e + 3]
        }

        function Q(t, e) {
            return (4294967295 & t) << e | t >>> 32 - e
        }

        function G(t) {
            var e = new Array(4)
                , n = new Array(4);
            i(t, e, 0),
                n[0] = h.zb[255 & e[0]],
                n[1] = h.zb[255 & e[1]],
                n[2] = h.zb[255 & e[2]],
                n[3] = h.zb[255 & e[3]];
            var r = B(n, 0);
            return r ^ Q(r, 2) ^ Q(r, 10) ^ Q(r, 18) ^ Q(r, 24)
        }

        var __g = {
            x: function (t, e) {
                for (var n = [], r = t.length, o = 0; 0 < r; r -= 16) {
                    for (var i = t.slice(16 * o, 16 * (o + 1)), a = new Array(16), u = 0; u < 16; u++)
                        a[u] = i[u] ^ e[u];
                    e = __g.r(a),
                        n = n.concat(e),
                        o++
                }
                return n
            },
            r: function (t) {
                var e = new Array(16)
                    , n = new Array(36);
                n[0] = B(t, 0),
                    n[1] = B(t, 4),
                    n[2] = B(t, 8),
                    n[3] = B(t, 12);
                for (var r = 0; r < 32; r++) {
                    var o = G(n[r + 1] ^ n[r + 2] ^ n[r + 3] ^ h.zk[r]);
                    n[r + 4] = n[r] ^ o
                }
                return i(n[35], e, 0),
                    i(n[34], e, 4),
                    i(n[33], e, 8),
                    i(n[32], e, 12),
                    e
            }
        };

        function l() {
            this.C = [0, 0, 0, 0],
                this.s = +[],
                this.t = [],
                this.S = [],
                this.h = [],
                this.i = [],
                this.B = [],
                this.Q = !1,
                this.G = [],
                this.D = [],
                this.w = 1024,
                this.g = null,
                this.a = Date.now(),
                this.e = +[],
                this.T = 255,
                this.V = null,
                this.U = Date.now,
                this.M = new Array(32)
        }

        l.prototype.O = function (A, C, s) {
            for (var t, S, h, i, B, Q, G, D, w, g, a, e, E, T, r, V, U, M, O, c, I; this.T < this.w;)
                try {
                    switch (this.T) {
                        case 27:
                            this.C[this.c] = this.C[this.I] >> this.C[this.F],
                                this.M[12] = 35,
                                this.T = this.T * (this.C.length + (this.M[13] ? 3 : 9)) + 1;
                            break;
                        case 34:
                            this.C[this.c] = this.C[this.I] & this.C[this.F],
                                this.T = this.T * (this.M[15] - 6) + 12;
                            break;
                        case 41:
                            this.C[this.c] = this.C[this.I] <= this.C[this.F],
                                this.T = 8 * this.T + 27;
                            break;
                        case 48:
                            this.C[this.c] = !this.C[this.I],
                                this.T = 7 * this.T + 16;
                            break;
                        case 50:
                            this.C[this.c] = this.C[this.I] | this.C[this.F],
                                this.T = 6 * this.T + 52;
                            break;
                        case 57:
                            this.C[this.c] = this.C[this.I] >>> this.C[this.F],
                                this.T = 7 * this.T - 47;
                            break;
                        case 64:
                            this.C[this.c] = this.C[this.I] << this.C[this.F],
                                this.T = 5 * this.T + 32;
                            break;
                        case 71:
                            this.C[this.c] = this.C[this.I] ^ this.C[this.F],
                                this.T = 6 * this.T - 74;
                            break;
                        case 78:
                            this.C[this.c] = this.C[this.I] & this.C[this.F],
                                this.T = 4 * this.T + 40;
                            break;
                        case 80:
                            this.C[this.c] = this.C[this.I] < this.C[this.F],
                                this.T = 5 * this.T - 48;
                            break;
                        case 87:
                            this.C[this.c] = -this.C[this.I],
                                this.T = 3 * this.T + 91;
                            break;
                        case 94:
                            this.C[this.c] = this.C[this.I] > this.C[this.F],
                                this.T = 4 * this.T - 24;
                            break;
                        case 101:
                            this.C[this.c] = this.C[this.I] in this.C[this.F],
                                this.T = 3 * this.T + 49;
                            break;
                        case 108:
                            this.C[this.c] = o(this.C[this.I]),
                                this.T = 2 * this.T + 136;
                            break;
                        case 110:
                            this.C[this.c] = this.C[this.I] !== this.C[this.F],
                                this.T += 242;
                            break;
                        case 117:
                            this.C[this.c] = this.C[this.I] && this.C[this.F],
                                this.T = 3 * this.T + 1;
                            break;
                        case 124:
                            this.C[this.c] = this.C[this.I] || this.C[this.F],
                                this.T += 228;
                            break;
                        case 131:
                            this.C[this.c] = this.C[this.I] >= this.C[this.F],
                                this.T = 3 * this.T - 41;
                            break;
                        case 138:
                            this.C[this.c] = this.C[this.I] == this.C[this.F],
                                this.T = 2 * this.T + 76;
                            break;
                        case 140:
                            this.C[this.c] = this.C[this.I] % this.C[this.F],
                                this.T += 212;
                            break;
                        case 147:
                            this.C[this.c] = this.C[this.I] / this.C[this.F],
                                this.T += 205;
                            break;
                        case 154:
                            this.C[this.c] = this.C[this.I] * this.C[this.F],
                                this.T += 198;
                            break;
                        case 161:
                            this.C[this.c] = this.C[this.I] - this.C[this.F],
                                this.T += 191;
                            break;
                        case 168:
                            this.C[this.c] = this.C[this.I] + this.C[this.F],
                                this.T = 2 * this.T + 16;
                            break;
                        case 254:
                            this.C[this.c] = eval(i),
                                this.T += 20 < this.M[11] ? 98 : 89;
                            break;
                        case 255:
                            this.s = C || 0,
                                this.M[26] = 52,
                                this.T += this.M[13] ? 8 : 6;
                            break;
                        case 258:
                            g = {};
                            for (var F = 0; F < this.k; F++)
                                e = this.i.pop(),
                                    a = this.i.pop(),
                                    g[a] = e;
                            this.C[this.W] = g,
                                this.T += 94;
                            break;
                        case 261:
                            this.D = s || [],
                                this.M[11] = 68,
                                this.T += this.M[26] ? 3 : 5;
                            break;
                        case 264:
                            this.M[15] = 16,
                                this.T = "string" == typeof A ? 331 : 336;
                            break;
                        case 266:
                            this.C[this.I][i] = this.i.pop(),
                                this.T += 86;
                            break;
                        case 278:
                            this.C[this.c] = this.C[this.I][i],
                                this.T += this.M[22] ? 63 : 74;
                            break;
                        case 283:
                            this.C[this.c] = eval(String.fromCharCode(this.C[this.I]));
                            break;
                        case 300:
                            S = this.U(),
                                this.M[0] = 66,
                                this.T += this.M[11];
                            break;
                        case 331:
                            D = atob(A),
                                w = D.charCodeAt(0) << 16 | D.charCodeAt(1) << 8 | D.charCodeAt(2);
                            for (var k = 3; k < w + 3; k += 3)
                                this.G.push(D.charCodeAt(k) << 16 | D.charCodeAt(k + 1) << 8 | D.charCodeAt(k + 2));
                            for (V = w + 3; V < D.length;)
                                E = D.charCodeAt(V) << 8 | D.charCodeAt(V + 1),
                                    T = D.slice(V + 2, V + 2 + E),
                                    this.D.push(T),
                                    V += E + 2;
                            this.M[21] = 8,
                                this.T += 1e3 < V ? 21 : 35;
                            break;
                        case 336:
                            this.G = A,
                                this.D = s,
                                this.M[18] = 134,
                                this.T += this.M[15];
                            break;
                        case 344:
                            this.T = 3 * this.T - 8;
                            break;
                        case 350:
                            U = 66,
                                M = [],
                                I = this.D[this.k];
                            for (var W = 0; W < I.length; W++)
                                M.push(String.fromCharCode(24 ^ I.charCodeAt(W) ^ U)),
                                    U = 24 ^ I.charCodeAt(W) ^ U;
                            r = parseInt(M.join("").split("|")[1]),
                                this.C[this.W] = this.i.slice(this.i.length - r),
                                this.i = this.i.slice(0, this.i.length - r),
                                this.T += 2;
                            break;
                        case 352:
                            this.e = this.G[this.s++],
                                this.T -= this.M[26];
                            break;
                        case 360:
                            this.a = S,
                                this.T += this.M[0];
                            break;
                        case 368:
                            this.T -= 500 < S - this.a ? 24 : 8;
                            break;
                        case 380:
                            this.i.push(16383 & this.e),
                                this.T -= 28;
                            break;
                        case 400:
                            this.i.push(this.S[16383 & this.e]),
                                this.T -= 48;
                            break;
                        case 408:
                            this.T -= 64;
                            break;
                        case 413:
                            this.C[this.e >> 15 & 7] = (this.e >> 18 & 1) == +[] ? 32767 & this.e : this.S[32767 & this.e],
                                this.T -= 61;
                            break;
                        case 418:
                            this.S[65535 & this.e] = this.C[this.e >> 16 & 7],
                                this.T -= this.e >> 16 < 20 ? 66 : 80;
                            break;
                        case 423:
                            this.c = this.e >> 16 & 7,
                                this.I = this.e >> 13 & 7,
                                this.F = this.e >> 10 & 7,
                                this.J = 1023 & this.e,
                                this.T -= 255 + 6 * this.J + this.J % 5;
                            break;
                        case 426:
                            this.T += 5 * (this.e >> 19) - 18;
                            break;
                        case 428:
                            this.W = this.e >> 16 & 7,
                                this.k = 65535 & this.e,
                                this.t.push(this.s),
                                this.h.push(this.S),
                                this.s = this.C[this.W],
                                this.S = [];
                            for (var J = 0; J < this.k; J++)
                                this.S.unshift(this.i.pop());
                            this.B.push(this.i),
                                this.i = [],
                                this.T -= 76;
                            break;
                        case 433:
                            this.s = this.t.pop(),
                                this.S = this.h.pop(),
                                this.i = this.B.pop(),
                                this.T -= 81;
                            break;
                        case 438:
                            this.Q = this.C[this.e >> 16 & 7],
                                this.T -= 86;
                            break;
                        case 440:
                            U = 66,
                                M = [],
                                I = this.D[16383 & this.e];
                            for (var b = 0; b < I.length; b++)
                                M.push(String.fromCharCode(24 ^ I.charCodeAt(b) ^ U)),
                                    U = 24 ^ I.charCodeAt(b) ^ U;
                            M = M.join("").split("|"),
                                O = parseInt(M.shift()),
                                this.i.push(O === +[] ? M.join("|") : O === +!+[] ? -1 !== M.join().indexOf(".") ? parseInt(M.join()) : parseFloat(M.join()) : O === !+[] + !+[] ? eval(M.join()) : 3 === O ? null : void 0),
                                this.T -= 88;
                            break;
                        case 443:
                            this.b = this.e >> 2 & 65535,
                                this.J = 3 & this.e,
                                this.J === +[] ? this.s = this.b : this.J === +!+[] ? !!this.Q && (this.s = this.b) : 2 === this.J ? !this.Q && (this.s = this.b) : this.s = this.b,
                                this.g = null,
                                this.T -= 91;
                            break;
                        case 445:
                            this.i.push(this.C[this.e >> 14 & 7]),
                                this.T -= 93;
                            break;
                        case 448:
                            this.W = this.e >> 16 & 7,
                                this.k = this.e >> 2 & 4095,
                                this.J = 3 & this.e,
                                Q = this.J === +!+[] && this.i.pop(),
                                G = this.i.slice(this.i.length - this.k, this.i.length),
                                this.i = this.i.slice(0, this.i.length - this.k),
                                c = 2 < G.length ? 3 : G.length,
                                this.T += 6 * this.J + 1 + 10 * c;
                            break;
                        case 449:
                            this.C[3] = this.C[this.W](),
                                this.T -= 97 - G.length;
                            break;
                        case 455:
                            this.C[3] = this.C[this.W][Q](),
                                this.T -= 103 + G.length;
                            break;
                        case 453:
                            B = this.e >> 17 & 3,
                                this.T = B === +[] ? 445 : B === +!+[] ? 380 : B === !+[] + !+[] ? 400 : 440;
                            break;
                        case 458:
                            this.J = this.e >> 17 & 3,
                                this.c = this.e >> 14 & 7,
                                this.I = this.e >> 11 & 7,
                                i = this.i.pop(),
                                this.T -= 12 * this.J + 180;
                            break;
                        case 459:
                            this.C[3] = this.C[this.W](G[+[]]),
                                this.T -= 100 + 7 * G.length;
                            break;
                        case 461:
                            this.C[3] = new this.C[this.W],
                                this.T -= 109 - G.length;
                            break;
                        case 463:
                            U = 66,
                                M = [],
                                I = this.D[65535 & this.e];
                            for (var n = 0; n < I.length; n++)
                                M.push(String.fromCharCode(24 ^ I.charCodeAt(n) ^ U)),
                                    U = 24 ^ I.charCodeAt(n) ^ U;
                            M = M.join("").split("|"),
                                O = parseInt(M.shift()),
                                this.T += 10 * O + 3;
                            break;
                        case 465:
                            this.C[3] = this.C[this.W][Q](G[+[]]),
                                this.T -= 13 * G.length + 100;
                            break;
                        case 466:
                            this.C[this.e >> 16 & 7] = M.join("|"),
                                this.T -= 114 * M.length;
                            break;
                        case 468:
                            this.g = 65535 & this.e,
                                this.T -= 116;
                            break;
                        case 469:
                            this.C[3] = this.C[this.W](G[+[]], G[1]),
                                this.T -= 119 - G.length;
                            break;
                        case 471:
                            this.C[3] = new this.C[this.W](G[+[]]),
                                this.T -= 118 + G.length;
                            break;
                        case 473:
                            throw this.C[this.e >> 16 & 7];
                        case 475:
                            this.C[3] = this.C[this.W][Q](G[+[]], G[1]),
                                this.T -= 123;
                            break;
                        case 476:
                            this.C[this.e >> 16 & 7] = -1 !== M.join().indexOf(".") ? parseInt(M.join()) : parseFloat(M.join()),
                                this.T -= this.M[21] < 10 ? 124 : 126;
                            break;
                        case 478:
                            t = [0].concat(x(this.S)),
                                this.V = 65535 & this.e,
                                h = this,
                                this.C[3] = function (e) {
                                    var n = new l;
                                    return n.S = t,
                                        n.S[0] = e,
                                        n.O(h.G, h.V, h.D),
                                        n.C[3]
                                }
                                ,
                                this.T -= 50 < this.M[3] ? 120 : 126;
                            break;
                        case 479:
                            this.C[3] = this.C[this.W].apply(null, G),
                                this.M[3] = 168,
                                this.T -= this.M[9] ? 127 : 128;
                            break;
                        case 481:
                            this.C[3] = new this.C[this.W](G[+[]], G[1]),
                                this.T -= 10 * G.length + 109;
                            break;
                        case 483:
                            this.J = this.e >> 15 & 15,
                                this.W = this.e >> 12 & 7,
                                this.k = 4095 & this.e,
                                this.T = 0 === this.J ? 258 : 350;
                            break;
                        case 485:
                            this.C[3] = this.C[this.W][Q].apply(null, G),
                                this.T -= this.M[15] % 2 == 1 ? 143 : 133;
                            break;
                        case 486:
                            this.C[this.e >> 16 & 7] = eval(M.join()),
                                this.T -= this.M[18];
                            break;
                        case 491:
                            this.C[3] = new this.C[this.W].apply(null, G),
                                this.T -= this.M[8] / this.M[1] < 10 ? 139 : 130;
                            break;
                        case 496:
                            this.C[this.e >> 16 & 7] = null,
                                this.T -= 10 < this.M[5] - this.M[3] ? 160 : 144;
                            break;
                        case 506:
                            this.C[this.e >> 16 & 7] = void 0,
                                this.T -= this.M[18] % this.M[12] == 1 ? 154 : 145;
                            break;
                        default:
                            this.T = this.w
                    }
                } catch (A) {
                    this.g && (this.s = this.g),
                        this.T -= 114
                }
        }
            ,
        "undefined" != typeof window && (S.__ZH__ = S.__ZH__ || {},
            h = S.__ZH__.zse = S.__ZH__.zse || {},
            (new l).O("ABt7CAAUSAAACADfSAAACAD1SAAACAAHSAAACAD4SAAACAACSAAACADCSAAACADRSAAACABXSAAACAAGSAAACADjSAAACAD9SAAACADwSAAACACASAAACADeSAAACABbSAAACADtSAAACAAJSAAACAB9SAAACACdSAAACADmSAAACABdSAAACAD8SAAACADNSAAACABaSAAACABPSAAACACQSAAACADHSAAACACfSAAACADFSAAACAC6SAAACACnSAAACAAnSAAACAAlSAAACACcSAAACADGSAAACAAmSAAACAAqSAAACAArSAAACACoSAAACADZSAAACACZSAAACAAPSAAACABnSAAACABQSAAACAC9SAAACABHSAAACAC/SAAACABhSAAACABUSAAACAD3SAAACABfSAAACAAkSAAACABFSAAACAAOSAAACAAjSAAACAAMSAAACACrSAAACAAcSAAACABySAAACACySAAACACUSAAACABWSAAACAC2SAAACAAgSAAACABTSAAACACeSAAACABtSAAACAAWSAAACAD/SAAACABeSAAACADuSAAACACXSAAACABVSAAACABNSAAACAB8SAAACAD+SAAACAASSAAACAAESAAACAAaSAAACAB7SAAACACwSAAACADoSAAACADBSAAACACDSAAACACsSAAACACPSAAACACOSAAACACWSAAACAAeSAAACAAKSAAACACSSAAACACiSAAACAA+SAAACADgSAAACADaSAAACADESAAACADlSAAACAABSAAACADASAAACADVSAAACAAbSAAACABuSAAACAA4SAAACADnSAAACAC0SAAACACKSAAACABrSAAACADySAAACAC7SAAACAA2SAAACAB4SAAACAATSAAACAAsSAAACAB1SAAACADkSAAACADXSAAACADLSAAACAA1SAAACADvSAAACAD7SAAACAB/SAAACABRSAAACAALSAAACACFSAAACABgSAAACADMSAAACACESAAACAApSAAACABzSAAACABJSAAACAA3SAAACAD5SAAACACTSAAACABmSAAACAAwSAAACAB6SAAACACRSAAACABqSAAACAB2SAAACABKSAAACAC+SAAACAAdSAAACAAQSAAACACuSAAACAAFSAAACACxSAAACACBSAAACAA/SAAACABxSAAACABjSAAACAAfSAAACAChSAAACABMSAAACAD2SAAACAAiSAAACADTSAAACAANSAAACAA8SAAACABESAAACADPSAAACACgSAAACABBSAAACABvSAAACABSSAAACAClSAAACABDSAAACACpSAAACADhSAAACAA5SAAACABwSAAACAD0SAAACACbSAAACAAzSAAACADsSAAACADISAAACADpSAAACAA6SAAACAA9SAAACAAvSAAACABkSAAACACJSAAACAC5SAAACABASAAACAARSAAACABGSAAACADqSAAACACjSAAACADbSAAACABsSAAACACqSAAACACmSAAACAA7SAAACACVSAAACAA0SAAACABpSAAACAAYSAAACADUSAAACABOSAAACACtSAAACAAtSAAACAAASAAACAB0SAAACADiSAAACAB3SAAACACISAAACADOSAAACACHSAAACACvSAAACADDSAAACAAZSAAACABcSAAACAB5SAAACADQSAAACAB+SAAACACLSAAACAADSAAACABLSAAACACNSAAACAAVSAAACACCSAAACABiSAAACADxSAAACAAoSAAACACaSAAACABCSAAACAC4SAAACAAxSAAACAC1SAAACAAuSAAACADzSAAACABYSAAACABlSAAACAC3SAAACAAISAAACAAXSAAACABISAAACAC8SAAACABoSAAACACzSAAACADSSAAACACGSAAACAD6SAAACADJSAAACACkSAAACABZSAAACADYSAAACADKSAAACADcSAAACAAySAAACADdSAAACACYSAAACACMSAAACAAhSAAACADrSAAACADWSAAAeIAAEAAACAB4SAAACAAySAAACABiSAAACABlSAAACABjSAAACABiSAAACAB3SAAACABkSAAACABnSAAACABrSAAACABjSAAACAB3SAAACABhSAAACABjSAAACABuSAAACABvSAAAeIABEAABCABkSAAACAAzSAAACABkSAAACAAySAAACABlSAAACAA3SAAACAAySAAACAA2SAAACABmSAAACAA1SAAACAAwSAAACABkSAAACAA0SAAACAAxSAAACAAwSAAACAAxSAAAeIABEAACCAAgSAAATgACVAAAQAAGEwADDAADSAAADAACSAAADAAASAAACANcIAADDAADSAAASAAATgADVAAATgAEUAAATgAFUAAATgAGUgAADAAASAAASAAATgADVAAATgAEUAAATgAFUAAATgAHUgAADAABSAAASAAATgADVAAATgAEUAAATgAFUAAATgAIUgAAcAgUSMAATgAJVAAATgAKUgAAAAAADAABSAAADAAAUAAACID/GwQPCAAYG2AREwAGDAABCIABGwQASMAADAAAUAAACID/GwQPCAAQG2AREwAHDAABCIACGwQASMAADAAAUAAACID/GwQPCAAIG2AREwAIDAABCIADGwQASMAADAAAUAAACID/GwQPEwAJDYAGDAAHG2ATDAAIG2ATDAAJG2ATKAAACAD/DIAACQAYGygSGwwPSMAASMAADAACSAAADAABUgAACAD/DIAACQAQGygSGwwPSMAASMAADAACCIABGwQASMAADAABUgAACAD/DIAACQAIGygSGwwPSMAASMAADAACCIACGwQASMAADAABUgAACAD/DIAAGwQPSMAASMAADAACCIADGwQASMAADAABUgAAKAAACAAgDIABGwQBEwANDAAAWQALGwQPDAABG2AREwAODAAODIAADQANGygSGwwTEwAPDYAPKAAACAAESAAATgACVAAAQAAGEwAQCAAESAAATgACVAAAQAAGEwAFDAAASAAADAAQSAAACAAASAAACAKsIAADCAAASAAADAAQUAAACID/GwQPSMAADAABUAAASAAASAAACAAASAAADAAFUgAACAABSAAADAAQUAAACID/GwQPSMAADAABUAAASAAASAAACAABSAAADAAFUgAACAACSAAADAAQUAAACID/GwQPSMAADAABUAAASAAASAAACAACSAAADAAFUgAACAADSAAADAAQUAAACID/GwQPSMAADAABUAAASAAASAAACAADSAAADAAFUgAADAAFSAAACAAASAAACAJ8IAACEwARDAARSAAACAANSAAACALdIAACEwASDAARSAAACAAXSAAACALdIAACEwATDAARDIASGwQQDAATG2AQEwAUDYAUKAAAWAAMSAAAWAANSAAAWAAOSAAAWAAPSAAAWAAQSAAAWAARSAAAWAASSAAAWAATSAAAWAAUSAAAWAAVSAAAWAAWSAAAWAAXSAAAWAAYSAAAWAAZSAAAWAAaSAAAWAAbSAAAWAAcSAAAWAAdSAAAWAAeSAAAWAAfSAAAWAAgSAAAWAAhSAAAWAAiSAAAWAAjSAAAWAAkSAAAWAAlSAAAWAAmSAAAWAAnSAAAWAAoSAAAWAApSAAAWAAqSAAAWAArSAAAeIAsEAAXWAAtSAAAWAAuSAAAWAAvSAAAWAAwSAAAeIAxEAAYCAAESAAATgACVAAAQAAGEwAZCAAkSAAATgACVAAAQAAGEwAaDAABSAAACAAASAAACAJ8IAACSMAASMAACAAASAAADAAZUgAADAABSAAACAAESAAACAJ8IAACSMAASMAACAABSAAADAAZUgAADAABSAAACAAISAAACAJ8IAACSMAASMAACAACSAAADAAZUgAADAABSAAACAAMSAAACAJ8IAACSMAASMAACAADSAAADAAZUgAACAAASAAADAAZUAAACIAASEAADIAYUEgAGwQQSMAASMAACAAASAAADAAaUgAACAABSAAADAAZUAAACIABSEAADIAYUEgAGwQQSMAASMAACAABSAAADAAaUgAACAACSAAADAAZUAAACIACSEAADIAYUEgAGwQQSMAASMAACAACSAAADAAaUgAACAADSAAADAAZUAAACIADSEAADIAYUEgAGwQQSMAASMAACAADSAAADAAaUgAACAAAEAAJDAAJCIAgGwQOMwAGOBG2DAAJCIABGwQASMAADAAaUAAAEAAbDAAJCIACGwQASMAADAAaUAAAEAAcDAAJCIADGwQASMAADAAaUAAAEAAdDAAbDIAcGwQQDAAdG2AQDAAJSAAADAAXUAAAG2AQEwAeDAAeSAAADAACSAAACALvIAACEwAfDAAJSAAADAAaUAAADIAfGwQQSMAASMAADAAJCIAEGwQASMAADAAaUgAADAAJCIAEGwQASMAADAAaUAAASAAASAAADAAJSAAADAAAUgAADAAJCIABGQQAEQAJOBCIKAAADAABTgAyUAAACIAQGwQEEwAVCAAQDIAVGwQBEwAKCAAAEAAhDAAhDIAKGwQOMwAGOBImDAAKSAAADAABTgAzQAAFDAAhCIABGQQAEQAhOBHoCAAASAAACAAQSAAADAABTgA0QAAJEwAiCAAQSAAATgACVAAAQAAGEwAjCAAAEAALDAALCIAQGwQOMwAGOBLSDAALSAAADAAiUAAADIALSEAADIAAUEgAGwQQCAAqG2AQSMAASMAADAALSAAADAAjUgAA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"));
        var D = function (t) {
            return __g._encrypt(encodeURIComponent(t))
        };
        exports.XL = A,
            exports.ZP = D
    }

    var o = {};
    f1(void 0, o)
    return o.ZP(s)
}


function genCommentHeader(url) {
    function K() {
        var t = (new RegExp("d_c0=([^;]+)")).exec(document.cookie);
        return t && t[1]
    }

    var z = function(t) {
        var e = new URL(t,"https://www.zhihu.com");
        return "" + e.pathname + e.search
    };
    var
        S = function (t, e, n, r) {
        var o = n.zse93
            , i = n.dc0
            , a = n.xZst81
            , u = z(t)
            , c = ""
            , s = [o, u, i, "", a].filter(Boolean).join("+")
        ;
        return {
            source: s,
            signature: zhihu_enc(md5(s))
        }
    }(url, void 0, {
        zse93: '101_3_3.0',
        dc0: K(),
        xZst81: null
    })

    return {
        "x-zse-93": "101_3_3.0",
        "x-zse-96": "2.0_" + S.signature
    }
}

// ---biz---


// --- common biz ---

function processContinue() {
    document.body.classList.remove('ModalWrap-body');
    document.body.style.overflow = "auto";
    // question
    removeBySelector('div.Card.AnswersNavWrapper div.ModalWrap');
    // zvideo
    removeBySelector('#root > div > main > article > div.ModalWrap');
}

function addCommonStyle() {
    let style = `<style>
.CommentsForOia, #div-gpt-ad-bannerAd,div.Card.AnswersNavWrapper div.ModalWrap, .MobileModal-backdrop,
        .MobileModal--plain.ConfirmModal,.AdBelowMoreAnswers,div.Card.HotQuestions, button.OpenInAppButton.OpenInApp,
        .DownloadGuide-inner, .DownloadGuide, div.OpenInAppButton, div.Card.RelatedReadings, button.ContentItem-rightButton, 
        div.MobileModal-wrapper,.MBannerAd, .oia-action-bar {
        display: none;
    }
.CommentItemV2 {
    position: relative;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding: 10px 5px;
    font-size: 15px
}
.CommentItemV2-footer {
    box-sizing: border-box;
    display: flex;
}
.CommentItemV2-time {
    font-size: 13px;
    color: #8590a6;
    flex: 1 1 auto;
}
.CommentItemV2-content {
    margin-bottom: 6px;
    line-height: 25px;
}
.CommentItemV2-reply, .CommentItemV2-roleInfo, html[data-theme=dark] .CommentItemV2-reply, html[data-theme=dark] .CommentItemV2-roleInfo {
    color: #8590a6;
}
.NestComment .NestComment--child {
    position: relative;
    padding-left: 33px;
}
.CommentRichText img[data-zhihu-emoticon] {
    height: 1.4em;
    width: 1.4em;
    vertical-align: bottom;
}
</style>`;
    addStyle(style);
}

function removeCommonBlock() {
    removeBySelector('button.OpenInAppButton');
    removeBySelector('.CommentsForOia');
}

function skipOpenApp() {
    log('run:skipOpenApp');
    // .ContentItem.AnswerItem
    // .RichContent.is-collapsed.RichContent--unescapable
    Array.prototype.forEach.call(document.querySelectorAll('.ContentItem.AnswerItem'), function (ele) {
        let elRichContentInner = ele.querySelector('.RichContent-inner');
        let elRichContent = ele.querySelector('.RichContent');
        let button = ele.querySelector('button');

        if (button) {
            button.style.display = 'none';
        }
        if (elRichContentInner && elRichContent) {
            let elMTimeMeta = ele.querySelector('meta[itemprop="dateModified"]');
            let elCTimeMeta = ele.querySelector('meta[itemprop="dateCreated"]');

            if (elMTimeMeta && elCTimeMeta) {
                let mTime = elMTimeMeta.getAttribute('content').toString().split('T')[0];
                let cTime = elCTimeMeta.getAttribute('content').toString().split('T')[0];
                let elATime = ele.querySelector('.ContentItem-time');
                let url = elCTimeMeta.previousElementSibling.getAttribute('content');
                let mHtml = '';

                if (mTime !== cTime) {
                    mHtml = `<span class="my-updated-time">编辑于 ${mTime}</span>`;
                }
                let tmpHtml = `<div>
            <div class="ContentItem-time">
                <a target="_blank" href="${url}">
                    <span class="my-created-time">发布于 ${cTime}</span>${mHtml}
                </a>
            </div>
            </div>`;
                if (elATime) {
                    elATime.remove();
                }
                elRichContentInner.insertAdjacentHTML('afterend', tmpHtml);
            }

            setTimeout(function () {
                if (!elRichContent.classList.contains('is-collapsed') && !inDetailPage) {
                    return;
                }
                if (inDetailPage) {
                    // fix .ContentItem-actions missing

                    hideAllNextSiblings(elRichContent)

                    let el_upvoteCount = ele.querySelector('meta[itemprop="upvoteCount"]');
                    let el_commentCount = ele.querySelector('meta[itemprop="commentCount"]');
                    let commentBar = genCommentBar({
                        "voteup_count": el_upvoteCount && el_upvoteCount.getAttribute('content') || 0,
                        "comment_count": el_commentCount && el_commentCount.getAttribute('content') || 0,
                    })
                    elRichContent.insertAdjacentHTML('afterend', commentBar);
                    bindClickComment(ele)
                }

                log('process:is-collapsed');
                ele.classList.add('my-fold');
                elRichContentInner.insertAdjacentHTML('afterend', `<span class="my-more-btn down-img"></span><span class="my-less-btn up-img"></span>`);
                elRichContent.classList.remove('is-collapsed');
                elRichContent.classList.add('my-original');
                elRichContentInner.setAttribute("style", "");
                processFold(elRichContent);
            }, 1000);

            // process gif & img
            forEachArray(elRichContentInner.querySelectorAll('figure img'), el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation()
                    if (el.parentElement.classList.contains('GifPlayer')) {
                        let elImg = el.parentElement.querySelector('img'),
                            elIcon = el.parentElement.querySelector('svg'),
                            url = elImg.getAttribute('src').toString().replace('.jpg', '.webp');
                        if (elIcon) {
                            elImg.setAttribute('src', url);
                            elIcon.remove();
                        }
                    } else {
                        if (el.src) {
                            window.open(el.src, "_blank")
                        }
                    }
                });
            });

            // avatar click
            forEachArray(ele.querySelectorAll('img.Avatar'), el => {
                el.addEventListener('click', (e) => {
                    let elUrl = el.parentElement.querySelector('meta[itemprop="url"]')
                    if (elUrl) {
                        let url = elUrl.getAttribute('content')
                        if (url) {
                            window.open(url, '_blank')
                        }
                    }
                });
            });

            let eleVoteButton = ele.querySelector('.VoteButton--up');
            if (eleVoteButton) {
                eleVoteButton.style = null;
            }

        } else {
            log('RichContent not found')
        }


        ele.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (elRichContentInner) {
                elRichContentInner.setAttribute("style", "");
            }
        });

        bindClickComment(ele.parentElement);
    });


    if (inDetailPage) {
        let elCard = document.querySelector('div.Card.AnswerCard');
        if (elCard) {
            hideAllNextSiblings(elCard)
        }
    }
}

function removeAds() {
    log('run:removeAds');
    Array.prototype.forEach.call(document.querySelectorAll('.MBannerAd'), function (ele) {
        ele.parentNode.removeChild(ele)
    });
}

function removeBlock() {
    log('run:removeBlock');
    removeBySelector('.MobileModal-backdrop');
    removeBySelector('.MobileModal--plain.ConfirmModal');
    removeBySelector('.AdBelowMoreAnswers');
    removeBySelector('div.Card.HotQuestions');
    removeBySelector('div.KfeCollection-VipRecommendCard');
    hideBySelector('div.ModalWrap');

    let counter = 3;
    let interval = null;
    interval = setInterval(function () {
        forEachBySelector('iframe', ele => {
            if (!ele.getAttribute('src').toString().match(/^https?:\/\/[a-zA-Z0-9]+?\.?zhihu.com\//)) {
                ele.remove();
            }
        });
        counter--;
        if (counter < 0) {
            clearInterval(interval);
        }
    }, 1000);
}


function processContent(content) {
    if (!content)
        return '';
    var r = /<img src="data:image.+?"(.+?)data-actualsrc="(.+?)"\/>/g;
    return content.replace(r, '<img src="$2"$1/>');
}

function loadContent(url) {
    // let myHeaders = new Headers();
    let myHeaders = new Headers(genCommentHeader(url));
    const myInit = {
        method: 'GET',
        headers: myHeaders,
    };

    return fetch(url, myInit).then(response => response.json());
}

function genCommentBar(data) {
    return `<div class="ContentItem-actions">
                <span>
                    <button aria-label="赞同 ${formatNumber(data.voteup_count)}" type="button" class="Button VoteButton VoteButton--up">
                        <span style="display: inline-flex; align-items: center;">&#8203;
                            <svg class="Zi Zi--TriangleUp VoteButton-TriangleUp" fill="currentColor" viewBox="0 0 24 24"
                                 width="10" height="10">
                            <path d="M2 18.242c0-.326.088-.532.237-.896l7.98-13.203C10.572 3.57 11.086 3 12 3c.915 0 1.429.571 1.784 1.143l7.98 13.203c.15.364.236.57.236.896 0 1.386-.875 1.9-1.955 1.9H3.955c-1.08 0-1.955-.517-1.955-1.9z"
                                  fill-rule="evenodd"></path></svg>
                        </span>赞同 ${formatNumber(data.voteup_count)}
                    </button>
                    <button aria-label="反对" type="button"
                            class="Button VoteButton VoteButton--down VoteButton--mobileDown">
                        <span style="display: inline-flex; align-items: center;">&#8203;
                        <svg class="Zi Zi--TriangleDown" fill="currentColor" viewBox="0 0 24 24" width="10" height="10"><path
                                d="M20.044 3H3.956C2.876 3 2 3.517 2 4.9c0 .326.087.533.236.896L10.216 19c.355.571.87 1.143 1.784 1.143s1.429-.572 1.784-1.143l7.98-13.204c.149-.363.236-.57.236-.896 0-1.386-.876-1.9-1.956-1.9z"
                                fill-rule="evenodd"></path></svg>
                    </span>
                    </button>
                </span>
                <button type="button" class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel">
                    <span style="display: inline-flex; align-items: center;">&#8203;
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Comment Button-zi t2ntD6J1DemdOdvh5FB4" fill="currentColor"><path fill-rule="evenodd" d="M12 2.75a9.25 9.25 0 1 0 4.737 17.197l2.643.817a1 1 0 0 0 1.25-1.25l-.8-2.588A9.25 9.25 0 0 0 12 2.75Z" clip-rule="evenodd"></path></svg>
                    </span>评论 ${formatNumber(data.comment_count)}
                </button>
            </div>`
}


function genAnswerItemHtml(data) {
    var content = processContent(data.content);
    let upTimeHtml = '';
    if (getDate(data.created_time) !== getDate(data.updated_time)) {
        upTimeHtml = `<span class="my-updated-time">编辑于 ${formatDate(data.updated_time, 'yyyy-MM-dd')}</span>`;
    }
    let headline = data.author.headline ||
        data.author.badge_v2 && data.author.badge_v2.detail_badges[0] && data.author.badge_v2.detail_badges[0].description ||
        data.author.badge && data.author.badge[0] && data.author.badge[0].description || '';

    var html = `<div class="List-item" tabindex="0" id="answer-${data.id}">
    <div class="ContentItem AnswerItem my-fold" data-za-index="0">
        <div class="ContentItem-meta">
            <div class="AuthorInfo AnswerItem-authorInfo AnswerItem-authorInfo--related" itemprop="author" itemscope=""
                 itemtype="http://schema.org/Person">
                <span class="UserLink AuthorInfo-avatarWrapper">
                    <a class="UserLink-link"
                       target="_blank"
                       href="//www.zhihu.com/people/${data.author.url_token}">
                        <img class="Avatar AuthorInfo-avatar" width="38" height="38"
                             src="${data.author.avatar_url_template}"
                             alt="">
                    </a>
                </span>
                <div class="AuthorInfo-content">
                    <div class="AuthorInfo-head">
                        <span class="UserLink AuthorInfo-name">
                        <a class="UserLink-link"
                           target="_blank"
                           href="//www.zhihu.com/people/${data.author.url_token}">${data.author.name}</a>
                        </span>
                    </div>
                    <div class="AuthorInfo-detail">
                        <div class="AuthorInfo-badge">
                            <div class="ztext AuthorInfo-badgeText">${headline}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <meta itemprop="image">
        <meta itemprop="upvoteCount" content="${data.voteup_count}">
        <meta itemprop="url" content="https://www.zhihu.com/question/${questionNumber}/answer/${data.id}">
        <meta itemprop="dateCreated" content="${formatDate(data.created_time, 'yyyy-MM-ddThh:mm:ss')}.000Z">
        <meta itemprop="dateModified" content="${formatDate(data.updated_time, 'yyyy-MM-ddThh:mm:ss')}.000Z">
        <meta itemprop="commentCount" content="${data.comment_count}">
        <div class="RichContent RichContent--unescapable">
            <div class="RichContent-inner RichContent-inner--collapsed">
                <span class="RichText ztext CopyrightRichText-richText" itemprop="text">
                ${content}
                </span>
            </div>
            <div>
            <div class="ContentItem-time">
                <a target="_blank" href="//www.zhihu.com/question/${questionNumber}/answer/${data.id}">
                    <span class="my-created-time">发布于 ${formatDate(data.created_time, 'yyyy-MM-dd')}</span>${upTimeHtml}
                </a>
            </div>
            </div>

            <span class="my-more-btn down-img"></span>
            <span class="my-less-btn up-img"></span>

            ${genCommentBar(data)}
            
        </div>
    </div>
</div>`;
    return html;
}


function genVideoHtml(videoId) {
    if (!videoId)
        return '';

    var html = `<div class="RichText-video" data-za-detail-view-path-module="VideoItem" data-za-extra-module="{&quot;card&quot;:{&quot;content&quot;:{&quot;type&quot;:&quot;Video&quot;,&quot;sub_type&quot;:&quot;SelfHosted&quot;,&quot;video_id&quot;:&quot;${videoId}&quot;,&quot;is_playable&quot;:true}}}">
    <div class="VideoCard VideoCard--interactive VideoCard--mobile">
        <div class="VideoCard-layout">
            <div class="VideoCard-video">
                <div class="VideoCard-video-content">
                    <div class="VideoCard-player"><iframe frameborder="0" allowfullscreen="" src="https://www.zhihu.com/video/${videoId}?autoplay=false&amp;useMSE="></iframe></div>
                </div>
            </div>
        </div>
        <div class="VideoCard-mask"></div>
    </div>
</div>
`;
    return html;
}

function processVideo(elAncestor) {
    if (elAncestor && elAncestor.querySelectorAll) {
        forEachArray(elAncestor.querySelectorAll('a.video-box'), el => {
            let videoId = el.dataset.lensId;
            if (videoId) {
                let html = genVideoHtml(videoId);
                let div = document.createElement('div');
                div.innerHTML = html;
                el.insertAdjacentElement('afterend', div);
                el.parentElement.removeChild(el);
            }
        });
    }
}

function getListWrap() {
    if (!elList) {
        elList = document.querySelectorAll('.Question-main .List');
        if (elList)
            elList = elList[elList.length - 1];
    }
    return elList;
}

function loadAnswer() {
    if (is_end || is_loading_answer) {
        return;
    }
    if (elLoading) {
        elLoading.classList.remove('hide');
    }
    is_loading_answer = 1;

    if (answer_next_url === null) {
        let elInit = document.querySelector('#js-initialData');
        if (!elInit) {
            return console.error('js-initialData not found.')
        }

        try {
            let jsonInit = JSON.parse(elInit.innerText);
            let answer = jsonInit.initialState.question.answers[questionNumber];
            answer_next_url = answer['next'];
        } catch (e) {
            return console.error(e);
        }
    }

    loadContent(answer_next_url).then(function (data) {
        if (!answer_next_url) {
            console.error('next_url empty');
            return
        }
        if (elLoading) {
            elLoading.classList.add('hide');
        }
        log('get data:', answer_next_url);
        if (data.paging.is_end) {
            is_end = 1;
        }
        answer_next_url = data.paging.next;
        let elListWrap = getListWrap();
        if (elListWrap) {
            processLinkCard(elListWrap);
            data.data.forEach(function (item) {
                if (item.target_type !== 'answer') {
                    return log('not_answer:', item);
                }

                if (!load_answer_id_map[item.target.id]) {
                    load_answer_id_map[item.target.id] = 1;
                    let elListItemWrap = document.createElement('div');
                    elListItemWrap.innerHTML = genAnswerItemHtml(item.target);
                    elListWrap.insertAdjacentElement("beforeend", elListItemWrap);
                    processFold(elListItemWrap.querySelector('.RichContent'));
                    bindClickComment(elListItemWrap);
                    processAHref(elListItemWrap);
                    processVideo(elListItemWrap);
                } else {
                    log('duplicate answer', item.target.id)
                }
            });
            if (is_end) {
                let html = '<div style="text-align: center; padding: 10px;">全部回答已加载完成...</div>'
                elListWrap.insertAdjacentHTML("beforeend", html);
            }
        } else {
            console.warn('elListWrap empty');
        }
    }).catch(function (err) {
        console.error('load failed', err)
    }).then(function () {
        is_loading_answer = 0;
        log('loading finish')
    })
}


function addViewportCheckList(elListItem) {
    if (elListItem) {
        viewportElCheckList.push(elListItem);
    }
}

function removeViewportCheckList(elListItem) {
    viewportElCheckList.forEach(function (v, i) {
        if (v === elListItem) {
            viewportElCheckList.splice(i, 1);
        }
    })
}

function processFold(elRichContent) {
    var elMoreBtn = elRichContent.querySelector('.my-more-btn');
    var elLessBtn = elRichContent.querySelector('.my-less-btn');
    var elContentItem = elLessBtn.closest('.ContentItem');
    if (elMoreBtn && elLessBtn && elContentItem) {
        let height = getElementHeight(elRichContent);
        if (height > 0 && height < 400 && elRichContent.querySelectorAll('img').length < 2) {
            elContentItem.classList.remove('my-fold');
            elMoreBtn.remove();
            elLessBtn.remove();
        } else {
            elMoreBtn.addEventListener('click', function (e) {
                elContentItem.classList.add('my-unfold');
                elContentItem.classList.remove('my-fold');
                addViewportCheckList(elContentItem);
            });
            elLessBtn.addEventListener('click', function (e) {
                elContentItem.classList.add('my-fold');
                elContentItem.classList.remove('my-unfold');

                removeViewportCheckList(elContentItem);
                window.scrollTo(0, elContentItem.closest('.List-item').offsetTop);
            });
        }
    }
}

function bindLoadData() {
    log('run:bindLoadData');
    var el;
    if (inDetailPage) {
        let elRoot = document.getElementById('root')
        if (!elRoot) {
            return;
        }
        elRoot.insertAdjacentHTML('afterend', '<div style="text-align: center;"><a class="QuestionMainAction ViewAll-QuestionMainAction" href="'+location.href.replace(/\/answer.+/,'')+'">查看所有回答<a></div>');
        return;
    }
    document.querySelectorAll('.Question-main .Card').forEach(function (elCard) {
        if (!el && elCard.classList && elCard.classList.length === 1) {
            el = elCard;
        }
    });
    if (!el) {
        console.warn('bindLoadData failed');
        return;
    }
    el.insertAdjacentHTML('afterend', `<div id="my-loading" class="hide"><div class="loadingio-spinner-dual-ring-41hxycfuw5t"><div class="ldio-4crll70kj">
<div></div><div><div></div></div>
</div></div></div>`);

    elLoading = document.getElementById('my-loading');
    window.onscroll = function() {
        if (is_end) {
            return;
        }
        if ((window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight) {
            log('reach bottom');
            loadAnswer();
        }
    };
}

function bindProcessViewport() {
    log('run:bindProcessViewport');
    var interval;
    document.addEventListener('scroll', function () {
        if (interval) {
            clearTimeout(interval);
        }
        interval = setTimeout(function () {
            // log('scroll-view:', viewportElCheckList.length);
            if (viewportElCheckList.length) {
                viewportElCheckList.forEach(function (elListItem) {
                    var elLessBtn = elListItem.querySelector('.my-less-btn');
                    if (isElementInViewport(elListItem)) {
                        elLessBtn.classList.remove('hide');
                    } else {
                        elLessBtn.classList.add('hide');
                    }
                });
            }
        }, 100);
    }, false);
}

function loadCommentData(answerId, offset, isReverse) {
    if (!answerId) {
        return;
    }
    let url = `https://www.zhihu.com/api/v4/comment_v5/answers/${answerId}/root_comment?order_by=score&limit=20&offset=${offset}`;
    if (isReverse)
        url = `https://www.zhihu.com/api/v4/comment_v5/answers/${answerId}/root_comment?order_by=ts&limit=20&offset=${offset}`;
    let myHeaders = new Headers(genCommentHeader(url));
    const myInit = {
        method: 'GET',
        headers: myHeaders,
    };
    return fetch(url, myInit).then(response => response.json());
}

function loadChildCommentData(rootCommentId, offset) {
    let url = `https://www.zhihu.com/api/v4/comment_v5/comment/${rootCommentId}/child_comment?order_by=ts&limit=20&offset=${offset}`
    let myHeaders = new Headers(genCommentHeader(url));
    const myInit = {
        method: 'GET',
        headers: myHeaders,
    };
    return fetch(url, myInit).then(response => response.json());
}

function getOffsetFromUrl(url) {
    let m = url.toString().match(/offset=(\w+)&?/);
    return m ? m[1] : '';
}

function processChildComment(elButton) {
    if (!elButton) {
        return;
    }
    let elWrap = elButton.parentElement.previousElementSibling,
        elLoading = elButton.previousElementSibling,
        rootId = elButton.dataset.rootId,
        skipIds = elButton.dataset.skipIds.toString().split(','),
        offset = elButton.dataset.offset || '',
        loading = elButton.dataset.loading || '',
        childCommentCount = elButton.dataset.childCommentCount || '',
        remainCount = elButton.dataset.remainCount || '',
        end = 0,
        loadingTimer;

    if (elButton.classList.contains('hide')) {
        return;
    }
    elButton.classList.add('hide');
    loadingTimer = setTimeout(() => elLoading.classList.remove('hide'), 500);
    loadChildCommentData(rootId, offset).then(function (json) {
        let html = '';
        json.data.forEach(function (v) {
            if (skipIds.indexOf(v.id) === -1) {
                html += genCommentItemHtml(v, 'child');
                if (remainCount) {
                    remainCount -= 1;
                }
            }
        });

        if (json.paging.is_end) {
            // html += '<div class="my-center">子回复已全部加载完成...</div>'
            end = 1;
        } else {
            elButton.dataset.offset = getOffsetFromUrl(json.paging.next);
        }

        elWrap.insertAdjacentHTML('beforeend', html)
    }).finally(function () {
        loadingTimer && clearTimeout(loadingTimer);
        elLoading.classList.add('hide');
        if (!end) {
            elButton.classList.remove('hide');
            if (childCommentCount) {
                elButton.dataset.remainCount = remainCount;
                elButton.innerText = `查看回复 ${remainCount} / ${childCommentCount}`;
            }
        }
    })
}

function bindClickComment(elListItem) {
    if (!elListItem)
        return;
    let elButton = elListItem.querySelector('button.ContentItem-action.Button--withLabel');
    let elComment = elListItem.querySelector('.Comments-container');

    if (!elButton) {
        let elContentItemActions = elListItem.querySelector('.ContentItem-actions');
        if (!elContentItemActions) {
            console.warn('bindClickComment failed');
            return;
        }
        let metaComment = elContentItemActions.parentElement.previousElementSibling.parentElement.querySelector('meta[itemprop="commentCount"]');
        let commentCount = metaComment && metaComment.getAttribute('content') || '';
        elButton = document.createElement('span');
        elButton.innerHTML = `<button type="button" class="Button ContentItem-action Button--plain Button--withIcon Button--withLabel"><span style="display: inline-flex; align-items: center;">&ZeroWidthSpace;<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Comment Button-zi t2ntD6J1DemdOdvh5FB4" fill="currentColor"><path fill-rule="evenodd" d="M12 2.75a9.25 9.25 0 1 0 4.737 17.197l2.643.817a1 1 0 0 0 1.25-1.25l-.8-2.588A9.25 9.25 0 0 0 12 2.75Z" clip-rule="evenodd"></path></svg></span>评论 ${commentCount}</button>`;
        elContentItemActions.appendChild(elButton);
    }

    let fnFoldToggle = debounce(function () {
        let elCommentWrap = elButton.elCommentWrap,
            elCommentFold = elButton.elCommentFold;
        if (!elCommentWrap || !elCommentFold) {
            return
        }
        let rect = elCommentWrap.getBoundingClientRect()
        if (rect.top > -200 && rect.top < 600) {
            elCommentFold.classList.remove('hide')
        } else {
            elCommentFold.classList.add('hide')
        }
    }, 100);

    elButton.addEventListener('click', function () {
        let bindFold = () => document.addEventListener('scroll', fnFoldToggle, false);
        let unbindFold = () => document.removeEventListener('scroll', fnFoldToggle, false);

        if (elComment) {
            elComment.classList.toggle('hide');
            if (elComment.classList.contains('hide')) {
                unbindFold();
            } else {
                bindFold();
            }
        } else {
            let answerId = (elListItem.querySelector('.ContentItem-meta ~ meta[itemprop="url"]').getAttribute('content').match(/\/answer\/(\d+)/) || [])[1];
            elComment = addCommentWrap(elListItem, answerId);

            let elCommentWrap = elComment.querySelector('.CommentListV2');
            let elSwitchBtn = elComment.querySelector('div.Topbar-options > button');
            let elCommentFold = elComment.querySelector('a.comment-fold');

            elComment.dataset.answerId = answerId;
            elComment.dataset.offset = "";

            elButton.elCommentWrap = elCommentWrap; // bind data
            elButton.elCommentFold = elCommentFold;

            processComment(elComment, elCommentWrap);

            elCommentWrap.addEventListener('scroll', function(){
                if (elCommentWrap.scrollTop + elCommentWrap.offsetHeight + 100 > elCommentWrap.scrollHeight) {
                    processComment(elComment, elCommentWrap);
                }
            }, false);

            elCommentWrap.addEventListener('click', function(event){
                if (event.target.closest('button.btn-child-comment')) {
                    processChildComment(event.target)
                }
            }, false);


            elSwitchBtn.addEventListener('click', function(){
                if (elSwitchBtn.innerText.replace(/[\s​]+/, '') === '切换为时间排序') {
                    elSwitchBtn.innerText = '切换为默认排序';
                    elComment.dataset.isReverse = "1";
                } else {
                    elSwitchBtn.innerText = '切换为时间排序';
                    elComment.dataset.isReverse = "0";
                }
                elComment.dataset.offset = "";
                elComment.dataset.isEnd = "0";
                elCommentWrap.innerHTML = '';
                processComment(elComment, elCommentWrap);
            });

            elCommentFold.addEventListener('click', function(){
                elComment.classList.add('hide');
                unbindFold();
            });

            bindFold();
        }
    });
}

function addCommentWrap(elListItem, answerId) {
    if (!elListItem)
        return;
    var commentCount = elListItem.querySelector('meta[itemprop="commentCount"]').getAttribute('content');
    let html = `<div class="Comments-container" id="comment-block-${answerId}">
    <div class="CommentsV2 CommentsV2--withEditor">
        <div class="Topbar CommentTopbar">
            <div class="Topbar-title"><h2 class="CommentTopbar-title">${commentCount} 条评论</h2></div>
            <div class="Topbar-options">
                <button type="button" class="Button Button--plain Button--withIcon Button--withLabel">
                    <span style="display: inline-flex; align-items: center;">&#8203;
                        <svg class="Zi Zi--Switch Button-zi" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em">
                            <path d="M13.004 7V4.232c0-.405.35-.733.781-.733.183 0 .36.06.501.17l6.437 5.033c.331.26.376.722.1 1.033a.803.803 0 0 1-.601.264H2.75a.75.75 0 0 1-.75-.75V7.75A.75.75 0 0 1 2.75 7h10.254zm-1.997 9.999v2.768c0 .405-.35.733-.782.733a.814.814 0 0 1-.5-.17l-6.437-5.034a.702.702 0 0 1-.1-1.032.803.803 0 0 1 .6-.264H21.25a.75.75 0 0 1 .75.75v1.499a.75.75 0 0 1-.75.75H11.007z" fill-rule="evenodd"></path></svg>
                    </span>切换为时间排序
                </button>
            </div>
        </div>
        <a class="comment-fold up-img"></a>
        <div class="CommentListV2">
        </div>
    </div>
</div>`;
    elListItem.insertAdjacentHTML("beforeend", html);
    return elListItem.querySelector('.Comments-container');
}

function genCommentHtml(dataList) {
    if (!dataList || !dataList.length)
        return '';
    let html = '';
    dataList.forEach(function(data) {
        let liClass = data.child_comment_count ? 'rootComment' : 'rootCommentNoChild';
        let tmp = genCommentItemHtml(data, liClass);
        if (data.child_comment_count) {
            let skipIds = [];
            data.child_comments.forEach(function (v) {
                skipIds.push(v.id)
                tmp += genCommentItemHtml(v, 'child');
            });
            if (data.child_comment_count > data.child_comments.length) {
                let remain_count = data.child_comment_count - data.child_comments.length;
                tmp += '<div class="child-comment-wrap"></div><div class="my-center"><span class="hide">加载中...</span>'
                tmp += `<button data-root-id="${data.id}" data-skip-ids="${skipIds.join(',')}" data-child-comment-count="${data.child_comment_count}" data-remain-count="${remain_count}" type="button" class="btn-child-comment Button Button--secondary Button--grey css-1p04wnp">查看回复 ${remain_count} / ${data.child_comment_count}<span style="display: inline-flex; align-items: center;">&ZeroWidthSpace;<svg width="24" height="24" viewBox="0 0 24 24" class="ZDI ZDI--ArrowRightSmall24" fill="currentColor"><path fill-rule="evenodd" d="m13.248 12-4.025 3.78a.684.684 0 0 0 0 1.01.796.796 0 0 0 1.075 0l4.42-4.15a.867.867 0 0 0 0-1.28l-4.42-4.15a.796.796 0 0 0-1.075 0 .684.684 0 0 0 0 1.01L13.248 12Z" clip-rule="evenodd"></path></svg></span></button>`
                tmp += '</div>'
            }
        }
        html += `<ul class="NestComment">${tmp}</ul>`;
    });
    return html;
}


function genCommentItemHtml(item, liClass) {
    var replyHtml = '';
    let authorTagHtml = '';
    if (item.author_tag && item.author_tag.length) {
        if (item.author_tag.filter(v => v.type === 'content_author')[0]) {
            authorTagHtml = '<span class="author-tag">作者</span>'
        }
    }
    if (item.reply_to_author) {
        let tagHtml = ''
        if (item.reply_author_tag && item.reply_author_tag.length) {
            if (item.reply_author_tag.filter(v => v.type === 'content_author')[0]) {
                tagHtml = `<span class="CommentItemV2-roleInfo author-tag">作者</span>`;
            }
        }
        replyHtml += `
<svg width="12" height="12" viewBox="0 0 16 16" class="ZDI ZDI--ArrowRightAlt16 css-gx7lzm" fill="currentColor"><path d="M10.727 7.48a.63.63 0 0 1 0 1.039l-4.299 2.88c-.399.268-.926-.028-.926-.519V5.12c0-.491.527-.787.926-.52l4.299 2.881Z"></path></svg>
<span class="UserLink">
    <a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank"
    href="//www.zhihu.com/people/${item.reply_to_author.url_token}">${item.reply_to_author.name}</a>${tagHtml}
</span>`;
    }
    let ip_info = item.comment_tag.filter(v => v.type === 'ip_info')[0];
    let author_top = item.comment_tag.filter(v => v.type === 'author_top')[0];
    let dot = ' · ';
    let address_text = ip_info && ip_info['text'] ? ip_info['text']
        .replace('IP 属地', '').replace('未知', '') + dot : '';
    let hot = item.hot ? `<span>${dot}热评</span>` : '';
    let pin = author_top ? `<span>${dot}置顶</span>` : '';
    let content = item.content.replace(/\[.{1,8}?\]/g, getEmojiImg)
        .replace(/<a([^<>]+?>)/g, function (match, p1) {
            let res = '';
            if (match.indexOf('href') > -1) { // open in new tab
                if (p1.indexOf('target=') === -1) {
                    res = '<a target="_blank" '+ p1;
                } else {
                    res = match.replace(/target=['"][^'"]*['"]/, 'target="_blank"');
                }
            } else {
                res = match;
            }
            return res.replace(/href=['"]https?:\/\/link.zhihu.com\/\?target=([^'"]+)['"]/, function (_, p1) {
                return 'href="'+decodeURIComponent(p1)+'"'
            });
        })
        .replace(/<a.+?class="comment_sticker".+?>(.+?)<\/a>/, function (match, p1) {
            let m = match.match(/href="(https?:\/\/[^'"]+\.[a-zA-Z]+)"/);
            if (m) {
                let url = m[1].replace(/_[a-z]+\./, '_xld\.');
                return `<div class="comment_sticker"><img src="${url}" alt="${p1}" /></div>`;
            }
            return match;
        })
        .replace(/<a.+?class="comment_img".+?>\s*查看图片\s*<\/a>/, function (match) {
            let m = match.match(/href="(https?:\/\/[^'"]+\.[a-zA-Z]+)"/);
            if (m) {
                let url = m[1].replace(/_[a-z]+\./, '_xld\.');
                return `<div class="comment_img"><a target="_blank" href="${m[1]}"><img src="${url}" alt="查看图片" /></a></div>`;
            }
            return match;
        });
    var html = `<li class="NestComment--${liClass}">
        <div class="CommentItemV2">
            <div class="comment-item-wrap">
                <div class="CommentItemV2-meta">
                    <span class="UserLink CommentItemV2-avatar">
                        <a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank"
                           href="//www.zhihu.com/people/${item.author.url_token}">
                            <img class="Avatar UserLink-avatar"
                                 width="30" height="30"
                                 src="${formatUrl(item.author.avatar_url_template, 's')}"
                                 srcset="${formatUrl(item.author.avatar_url_template, 'xs')} 2x"
                                 alt="${item.author.name}">
                        </a>
                    </span>
                </div>
                <div class="CommentItemV2-metaSibling">
                    <span class="UserLink">
                        <a class="UserLink-link" data-za-detail-view-element_name="User"
                           target="_blank" href="//www.zhihu.com/people/${item.author.url_token}">${item.author.name}
                        </a>
                        ${authorTagHtml}
                    </span>${replyHtml}
                    <div class="CommentRichText CommentItemV2-content">
                        <div class="RichText ztext">${content}</div>
                    </div>
                    <div class="CommentItemV2-footer">
                        <span class="CommentItemV2-time">${address_text}${getDate(item.created_time)}${hot}${pin}</span>
                        <button type="button" class="Button CommentItemV2-likeBtn Button--plain"><span
                                style="display: inline-flex; align-items: center;">&#8203;<svg
                                class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16"
                                height="16" style="margin-right: 5px;"><path
                                d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z"
                                fill-rule="evenodd"></path></svg></span>${item.like_count}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </li>`;
    return html;
}

function genCommentLoding() {
    var html = `
<style>
.css-1t6pvna {
    box-sizing: border-box;
    padding: 10px 20px 14px;
}
.css-w2vj5n {
    position: relative;
    overflow: hidden;
    background: rgb(248, 248, 250);
    color: rgb(255, 255, 255);
}
.css-1mkvfwo {
    position: absolute;
    width: 200%;
    height: 100%;
    background: linear-gradient(to right, rgb(248, 248, 250) 0%, rgb(235, 236, 237) 20%, rgb(248, 248, 250) 40%, rgb(248, 248, 250) 100%);
    animation: 1s linear 1ms infinite normal forwards running animation-1pjzrtc;
}
.css-doegi0 {
    position: relative;
    min-width: 100%;
    vertical-align: top;
    box-sizing: border-box;
}
@keyframes animation-1pjzrtc {
  0% { transform: translateX(-56%); }
  100% { transform: translateX(56%); }
}
</style>
<div class="css-1t6pvna"><div class="css-w2vj5n"><div class="css-1mkvfwo"></div><svg width="656" height="44" viewBox="0 0 656 44" class="css-doegi0"><path d="M0 0h656v44H0V0zm0 0h480v12H0V0zm0 32h238v12H0V32z" fill="currentColor" fill-rule="evenodd"></path></svg></div></div>`;
    var el = document.createElement('div');
    el.innerHTML = html;
    return el;
}

function processComment(elComment, elCommentWrap) {
    if (!elComment || !elCommentWrap || is_loading_comment) {
        return;
    }
    let offset = elComment.dataset.offset,
        answerId = elComment.dataset.answerId,
        isReverse = +elComment.dataset.isReverse,
        isEnd = +elComment.dataset.isEnd
    ;
    if (!answerId || isEnd) {
        return;
    }

    log('beginLoadComment', offset);
    is_loading_comment = 1;
    let elLoading = genCommentLoding();
    elCommentWrap.appendChild(elLoading);
    loadCommentData(answerId, offset, isReverse).then(function (json) {
        log('getCommentData', offset);
        elComment.dataset.offset = getOffsetFromUrl(json.paging.next);
        elCommentWrap.removeChild(elLoading);
        elLoading = null;
        let html = genCommentHtml(json.data);
        if (json.paging.is_end) {
            elComment.dataset.isEnd = "1";
            html += '<div style="text-align: center; padding: 10px;">全部评论已加载完成...</div>'
        }
        elCommentWrap.insertAdjacentHTML('beforeend', html);
        processAHref(elCommentWrap);
    }).catch(function (err) {
        console.warn('load comment failed', err);
    }).then(function () {
        is_loading_comment = 0;
        elLoading = null;
    });
}

function processAHref(elAncestor) {
    log('run:processAHref');
    if (elAncestor && elAncestor.querySelectorAll) {
        forEachArray(
            elAncestor.querySelectorAll('a[href^="https://link.zhihu.com/"]'),
            ele => {
                log('a_href', ele.getAttribute('href'));
                ele.setAttribute('href', decodeURIComponent(ele.getAttribute('href').replace('https://link.zhihu.com/?target=', '')));
                ele.setAttribute('target', '_blank');
                stopPropagation(ele);
            }
        );
        forEachArray(
            elAncestor.querySelectorAll('a[href^="https://"],a[href^="http://"]'),
            ele => stopPropagation(ele)
        )
    }
}

function processLinkCard(elRichContent) {
    // .RichContent-inner will be replaced, .RichContent will keep.
    observerAddNodes(elRichContent, el => {
        log(el);
        if (el.tagName === 'A' && el.href && el.href.indexOf('http') === 0) {
            processAHref(el.parentElement)
        }
    });
}

function processAllLink() {
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    processAHref(document);
    observerAddNodes(document, el => {
        if (el.tagName === 'A' && el.href && el.href.indexOf('http') === 0) {
            processAHref(el.parentElement)
        }
    });
}

function addCss() {
    log('run:addCss');
    var style = `
<style type="text/css">
    .my-fold .RichContent-inner {
        max-height: 400px;
    }
    .my-fold .my-more-btn {
        display: block;
    }
    .my-fold .my-less-btn {
        display:none;
    }
    .my-unfold .RichContent-inner {
        max-height: none;
    }
    .my-unfold .my-more-btn {
        display: none;
    }
    .my-unfold .my-less-btn {
        display: block;
    }
    
    .my-unfold .my-original .ContentItem-time {
        margin-bottom: 30px;
    }
    
    .up-img {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAXVBMVEUAAABDQz+GhIt6eX61tL25uMGko6u6ucKzsruzsbqtrLSnpq60sruzsbumpa2xsLmvrba0srusqrOko6qkoqqioKm7usO4tr+6ucK4tsC5t8Gkoqugn6a8u8K9vMT0mL20AAAAHXRSTlMABAQH0u0o7n95TyPIey6yoIxZNDEa8eHdx7JEF78gUdEAAAFLSURBVEjHrZOLcoIwEEVPgsUWsbZa+yb//5mNGYclG5YUxwwzh0SPd70KDpzHRVwu2UV4QX4Y7+Nlw6udGDVRIJHGW0tA5cNL3M3wSwZWBpiiYbSH7w7T8DNT9WEYhk+Qw5qxGdJ6oDAi0IYbjbi2YFRmGTFnjSGONrANydFRpVE4tuGVIR1UM8ocVbJhhJAw17U1VUfIcurGE7S5U5SsjEeaRjuqgCKjiS/ynDmLxj4ZDnah7NqY6mo0OsdJyXoqaaed6RpvZbiIsgPHUkYCb7kTl5lxRVN2YBkClePhMDuVQHXwAedgZAjyDo682hmC6e/TT5S9afhpB1/8BmOqHJzC+FTwkm6CytAYv88GkhPej2IY4LwNQ+gvRgM/J8Swwa4D0jahbjgPyD+5YqBQMwQ3G6w1ItZm/N9AG6uAj1wp3m641SWTny7iD6BPQB47/T0pAAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        display: inline-block;
    }
    .down-img {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAXVBMVEUAAABDQz+GhIt6eX61tL25uMGko6u6ucKzsruzsbqtrLSnpq60sruzsbumpa2xsLmvrba0srusqrOko6qkoqqioKm7usO4tr+6ucK4tsC5t8Gkoqugn6a8u8K9vMT0mL20AAAAHXRSTlMABAQH0u0o7n95TyPIey6yoIxZNDEa8eHdx7JEF78gUdEAAAFHSURBVEjHrZXtcoIwFERPgkiLVFut/Q7v/5ilcSKY1Rtwmj9LMjmzNwvc4MA5bPHZYlotikuzpGW5n/DIalnkrLOIpR5RFwksJdzdxChlIoYM+HkekKTdUCYqOHzDIND1oW+OFIn9Wx/CM8Aq/I1+TWUTTwMQItMOEpkDJvGQ9v3wGdLzhsrwCGm80IUzs+Um8RhGhH3U83nMquKmI7xPmaJH2IGnnjCv2B5hBThoQphmUCAcQOZjVLUav8v6MgPLw58IaC4Y08NzxWdLdcvDpV9ZMpB3roQj95GqlNAMrlSVt4ucEQ9tF5kPbYnQrHutKkrWk6c+SkgAkrVUJYRkbXto1kpoyJK1EkZPrhcT0FiER4joI1mNhAMlHHwMQN+ZRC60X7u1VmVffKDE3ItPQWvrvxHMJrwZsi2y1c8iRsvTTBYdTGa/Od1AHiFyP4wAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        display: inline-block;
    }
    .my-more-btn {
        float: right;
        padding: 0 10px 10px 10px;
    }
    .my-less-btn {
        position: fixed;
        top: 10%;
        right: 10px;
        padding: 0 10px 10px 10px;
        z-index: 2;
    }
    #my-loading {
        text-align: center;
        padding-bottom: 10px;
    }
    .hide, .my-less-btn.hide {
        display: none;
    }
    .CommentListV2 {
        max-height: 500px;
        overflow-y: scroll;
    }
    a.comment-fold {
        position: fixed;
        right: 10px;
        bottom: 30%;
        padding: 10px;
        z-index: 2;
    }
    .my-updated-time {
        font-size: 13px;
        margin-left: 10px;
    }
    .my-created-time {
        font-size: 13px;
    }
    .my-center {
        margin: 0 auto;
        text-align: center;
    }
    .author-tag {
        position: relative;
        padding: 0px 4px;
        height: 16px;
        line-height: 16px;
        box-sizing: border-box;
        font-size: 10px;
        color: rgb(153, 153, 153);
    }
    .author-tag::before {
        display: block;
        content: " ";
        position: absolute;
        inset: -50%;
        pointer-events: none;
        transform: scale(0.5, 0.5);
        border: 1px solid rgb(211, 211, 211);
        border-radius: 4px;
    }
    .comment-item-wrap {
        box-sizing: border-box;
        margin: 0px;
        min-width: 0px;
        display: flex;
        padding: 10px 0px 6px;
    }
    .CommentItemV2-meta {
        box-sizing: border-box;
        margin: 0px;
        min-width: 0px;
        flex: 0 0 auto;
    }
    .CommentItemV2-metaSibling {
        box-sizing: border-box;
        margin: 0px 0px 0px 10px;
        min-width: 0px;
        flex: 1 1 auto;    
    }
    img.UserLink-avatar {
        box-sizing: border-box;
        margin: 0px;
        min-width: 0px;
        max-width: 100%;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        filter: brightness(0.95);
        display: block;
        position: relative;
        background-color: rgb(246, 246, 246);
        flex: 0 0 auto;
        text-indent: -9999px;
        overflow: hidden;
    }
    .comment_sticker {
        box-sizing: border-box;
        margin: 12px 0px 0px;
        min-width: 0px;
        background-color: rgb(246, 246, 246);
        position: relative;
        border-radius: 8px;
        width: 120px;
        height: 120px;
    }
    .comment_sticker img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        cursor: zoom-in;
        object-position: unset;
    }
    .comment_img {
        box-sizing: border-box;
        margin: 12px 0px 0px;
        min-width: 0px;
        background-color: rgb(246, 246, 246);
        position: relative;
        border-radius: 8px;
        max-width: 120px;
        max-height: 200px;
    }
    .comment_img img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        cursor: zoom-in;
        object-position: center top;
        max-width: 120px;
        max-height: 200px;
    }
</style>
<style type="text/css">
@keyframes ldio-4crll70kj {
  0% { transform: rotate(0) }
  100% { transform: rotate(360deg) }
}
.ldio-4crll70kj div { box-sizing: border-box!important }
.ldio-4crll70kj > div {
  position: absolute;
  width: 76px;
  height: 76px;
  top: 12px;
  left: 12px;
  border-radius: 50%;
  border: 8px solid #000;
  border-color: #fe718d transparent #fe718d transparent;
  animation: ldio-4crll70kj 1.4925373134328357s linear infinite;
}
.ldio-4crll70kj > div:nth-child(2) { border-color: transparent }
.ldio-4crll70kj > div:nth-child(2) div {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(45deg);
}
.ldio-4crll70kj > div:nth-child(2) div:before, .ldio-4crll70kj > div:nth-child(2) div:after {
  content: "";
  display: block;
  position: absolute;
  width: 8px;
  height: 8px;
  top: -8px;
  left: 26px;
  background: #fe718d;
  border-radius: 50%;
  box-shadow: 0 68px 0 0 #fe718d;
}
.ldio-4crll70kj > div:nth-child(2) div:after {
  left: -8px;
  top: 26px;
  box-shadow: 68px 0 0 0 #fe718d;
}
.loadingio-spinner-dual-ring-41hxycfuw5t {
  width: 54px;
  height: 54px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.ldio-4crll70kj {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.54);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-4crll70kj div { box-sizing: content-box; }
/* generated by https://loading.io/ */
</style>
    `;
    addStyle(style);
}

function processHomePage() {
    function processBtn(objBtn) {
        if (!objBtn || objBtn.innerText.indexOf('内查看') === -1)
            return;
        let elParent = objBtn.parentNode;

        let elContentItem = objBtn.closest('.ContentItem');
        let elUrl = elContentItem && elContentItem.querySelector('meta[itemprop="url"]');
        let url = '';
        if (elUrl && elUrl.getAttribute("content")) {
            url = elUrl.getAttribute("content");
            let elNew = document.createElement('a');
            elNew.className = "Button ContentItem-more Button--plain";
            elNew.href = url;
            elNew.target="_blank";
            elNew.innerText = "打开详情";
            elParent.replaceChild(elNew, objBtn);
            stopPropagation(elNew);
        }
    }

    function processBtnAll(targetNode) {
        if (targetNode && targetNode.querySelectorAll) {
            forEachArray(
                targetNode.querySelectorAll('button.ContentItem-more'),
                el => processBtn(el)
            );
        }
    }
    processBtnAll(document);
    observerAddNodes(document.querySelector('.TopstoryMain'), el => processBtnAll(el))
}

function processDetailOrList() {
    setTimeout(function () {
        addCss();
        skipOpenApp();
        bindProcessViewport();
    }, 0);
    setTimeout(function () {
        removeAds();
        removeBlock();
        processAHref(document);

        function stopElePropagation(ele1, selector) {
            if (ele1) {
                forEachArray(ele1.querySelectorAll(selector), function (el) {
                    stopPropagation(el)
                })
            }
        }

        if (inDetailPage) {
            stopElePropagation(document.querySelector('.Question-main'), 'figure img,a')
        } else {
            // list page
            let list_item = document.querySelectorAll('.List-item');
            forEachArray(list_item, function (ele) {
                let ele1 = ele.querySelector('.AnswerItem');
                let zop = ele1 && ele1.dataset && ele1.dataset.zop;
                if (zop) {
                    try {
                        let t = JSON.parse(zop);
                        log('answer_id', t.itemId);
                        if (t.itemId) {
                            load_answer_id_map[t.itemId] = 1;
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
                processLinkCard(ele.querySelector('.RichContent'));
                stopElePropagation(ele1, 'a') // affect gifplayer: figure img, eg:https://www.zhihu.com/question/443350396
            });
        }
        bindLoadData();
    }, 0);
}

function processZvideo() {
    setTimeout(function () {
        observerAddNodes(document.querySelector('.ZVideoRecommendationList'), el => processAHref(el));
    }, 0);
}

function processCommon() {
    let elA = document.querySelector('.QuestionHeader-title a');
    if (elA) {
        stopPropagation(elA)
    }
    observerNodeAttributes(document.body, (mutation) => {
        if (mutation.target.style && mutation.target.style.overflow === 'hidden') {
            document.body.style.overflow = 'auto'
            setTimeout(() => {
                removeBySelector('.MobileModal-wrapper')
            }, 10)
        }
    })
}


function init() {
    if (init_done) {
        return;
    }
    init_done = 1;
    log('run:init');
    // init
    if (fromMobile) {
        if (questionNumber || inDetailPage) {
            processDetailOrList();
        } else if (inHomePage) {
            processHomePage();
        } else if (inZvideo) {
            processZvideo();
        } else if (inZhuanlan) {
            hideByAddCss('.OpenInAppButton,.KfeCollection-VipRecommendCard')
        }

        setTimeout(function () {
            addCommonStyle();
            processContinue();
            processCommon();
        }, 0);

        setTimeout(function () {
            removeCommonBlock();
        }, 0);
    } else {
        setTimeout(processAllLink, 0);
    }
}


document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        log('document.readyState');
        init()
    }
};
document.addEventListener("DOMContentLoaded", function() {
    log('DOMContentLoaded');
    init()
});