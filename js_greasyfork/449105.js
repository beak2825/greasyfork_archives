// ==UserScript==
// @name         高亮B站视频同传弹幕
// @version      1.0.1
// @description  根据规则高亮显示B站视频中的同传弹幕
// @author       blmds
// @license      MIT
// @match        https://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/xhook@1.5.2/dist/xhook.min.js
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @require      https://greasyfork.org/scripts/408096-bilibili-proto-js/code/bilibiliprotojs.js?version=833352
// @grant        none
// @namespace https://greasyfork.org/users/943808
// @downloadURL https://update.greasyfork.org/scripts/449105/%E9%AB%98%E4%BA%AEB%E7%AB%99%E8%A7%86%E9%A2%91%E5%90%8C%E4%BC%A0%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/449105/%E9%AB%98%E4%BA%AEB%E7%AB%99%E8%A7%86%E9%A2%91%E5%90%8C%E4%BC%A0%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var CONFIG = {

        "TranslationDelay": 0,                    // 同传弹幕延迟秒数（小于0为提前，大于0为延后）
        "ToReplaceTranslation": true,             // 是否替换同传弹幕内容

        // 同传弹幕样式
        // 具体含义见：https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/danmaku/danmaku_proto.md
        "TranslationSize": 32,                    // 弹幕字号
        "TranslationColor": "66CCFF",             // 弹幕颜色
        "TranslationMode": 4,                     // 弹幕类型
        "TranslationWeight": 11,                  // 弹幕云屏蔽权重（范围1-11，数字越小越容易被屏蔽，根据设置的云屏蔽等级过滤）
        "TranslationPool": 1,                     // 弹幕池

        // 其他设置
        "TranslationInclusionRegex": /^(.*?)【+(.*?)】*$/,     // 高亮同传弹幕规则
        "TranslationExclusionRegex": /【】/,                   // 非同传弹幕规则（从上面规则的匹配结果中去除）
        "TranslationReplacementFunc": function (_, p1, p2) {   // 同传弹幕内容替换规则
            return p1 ? p1 + "：" + p2 : p2;
        },

        "DanmakuURL": /api\.bilibili\.com\/x\/v2\/dm\/wbi\/web\/seg\.so\?(type=1|.*&type=1)/,
    };


    xhook.after(function(request, response) {

        // 当载入新弹幕时
        if (request.url.match(CONFIG.DanmakuURL)) {
            var danmaku = decode(response.data);

            danmaku.elems.forEach(function(e) {
                if (isTranslation(e))
                    applyDanmakuStyle(e);
            });

            response.data = encode(danmaku);
        }
    });


    // 辅助函数
    var protoSeg = protobuf.roots.default.DmSegMobileReply;

    function decode(buffer) {
        var danmaku = protoSeg.decode(new Uint8Array(buffer));
        return danmaku;
    }

    function encode(danmaku) {
        var buffer = protoSeg.encode(danmaku).finish();
        return buffer;
    }


    function isTranslation(e) {
        return !e.content.match(CONFIG.TranslationExclusionRegex) &&
            e.content.match(CONFIG.TranslationInclusionRegex);
    }

    function applyDanmakuStyle(e) {
        e.progress += CONFIG.TranslationDelay * 1e3;
        e.mode = CONFIG.TranslationMode;
        e.fontsize = CONFIG.TranslationSize;
        e.color = parseInt(CONFIG.TranslationColor, 16);
        e.weight = CONFIG.TranslationWeight;
        e.pool = CONFIG.TranslationPool;
        if (CONFIG.ToReplaceTranslation) {
            e.content = e.content.replace(CONFIG.TranslationInclusionRegex,
                                          CONFIG.TranslationReplacementFunc);
        }
    }
})();