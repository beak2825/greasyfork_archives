// ==UserScript==
// @name         Audiences 媒体信息帮助程序一键发种
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  通过JQuery 完成对发布页面的一键填写 杜绝手工填写各种错误的可能性;
// @author       eveloki
// @supportURL   https://audiences.me/contactstaff.php
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @include      *://audiences.me/upload.php
// @include      *://*.audiences.me/upload.php
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @run-at       ddocument-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436992/Audiences%20%E5%AA%92%E4%BD%93%E4%BF%A1%E6%81%AF%E5%B8%AE%E5%8A%A9%E7%A8%8B%E5%BA%8F%E4%B8%80%E9%94%AE%E5%8F%91%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/436992/Audiences%20%E5%AA%92%E4%BD%93%E4%BF%A1%E6%81%AF%E5%B8%AE%E5%8A%A9%E7%A8%8B%E5%BA%8F%E4%B8%80%E9%94%AE%E5%8F%91%E7%A7%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var jq3v= jQuery.noConflict();
    console.info(jQuery.fn.jquery);
    var TTMtick = "AD_" + new Date().getTime();
    var tdhtml = "<tr> "
        + "<td class=\"rowhead nowrap\" valign=\"top\" align=\"right\">额外功能（BETA）</td> "
        + "<td class=\"rowfollow\" valign=\"top\" align=\"left\"> "
        + '<font class="medium">此功能区由《Audiences 媒体信息帮助程序》自动生成</font></br>'
        //+ "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_copy\" class=\"btn AD_copy\" value=\"通过剪切板导入\"> "
        //+ "<font class=\"medium\">此功能将从您的剪切板读取内容</font></br>"
        + "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_txt\" class=\"btn AD_txt\" value=\"通过文本导入\"> "
        + "<font class=\"medium\">&emsp;此功能将会弹出一个文本框 您需要将软件生成的内容复制进去</font></br>"
        + "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_api\" class=\"btn AD_api\" value=\"一键导入\"> "
        + "<font class=\"medium\">&emsp;&emsp;&emsp;此功能将尝试与本机软件进行通讯 获取信息</font></br>"
        + "</td> "
        + "</tr> ";
    jq3v.getScript('https://cdn.staticfile.org/layer/3.1.1/layer.js', function () {
        jq3v("#compose table tr").eq(0).after(tdhtml);
        layer.msg("脚本加载成功", { icon: 6, skin: 'layui-layer-lan' });
        //直接读取剪切板
        jq3v("#" + TTMtick + "_copy").click(function () {
        })
        //弹出文本框
        jq3v("#" + TTMtick + "_txt").click(function () {
            let TTK = "AD_" + new Date().getTime() + "_remark";
            let layerindex = layer.open({
                title: '输入软件生成内容',
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['420px', '260px'], //宽高
                content: '<div><textarea name="txt_remark" id="' + TTK + '" style="width:96%;height:172px;"></textarea></div>',
                btn: ['确认', '取消'],
                yes: function () {
                    var rk = jq3v("#" + TTK).val();
                    console.info("yes");
                    LoadData(rk);
                    layer.close(layerindex);

                },
                no: function () {
                    console.info("no");
                    layer.close(layerindex);
                }
            });
        })
        //与本软件通讯
        jq3v("#" + TTMtick + "_api").click(function () {
             jq3v.ajax({
                type: 'POST',
                url: 'http://localhost:37926/api/getdata',
                dataType: 'JSON',
                beforeSend: function () {
                        layer.load(2);
                    },
                async: true,
                success: function (data) {
                    layer.closeAll('loading');
                    console.info(data);
                    LoadData(data.data);
                },
                error: function (data) {
                    layer.closeAll('loading');
                    layer.msg("与软件通讯故障", { icon: 5, skin: 'layui-layer-lan' });
                }
            });
        })
    });
    function LoadData(datastring) {
        console.info("尝试解析内容");
        console.info(datastring);
        var zzzstring = Base64.decode(datastring);
        var dataOBJ = JSON.parse(zzzstring);;
        console.info(dataOBJ);
        if(dataOBJ==null||dataOBJ==undefined)
        {
           layer.msg("解析失败", { icon: 5, skin: 'layui-layer-lan' });
           return;
        }
        //jq3v("#name").val("测试名称");
        //副标题
        jq3v("input[name='small_descr']").val(dataOBJ.small_descr);
        //IMDb链接
        jq3v("input[name='url']").val(dataOBJ.url);
        //豆瓣ID/链接
        jq3v("input[name='douban_id']").val(dataOBJ.douban_id);
        //简介
        jq3v("textarea[name='descr']").val(dataOBJ.descr);
        //选择类型
        jq3v("#browsecat").val(dataOBJ.browsecat);
        //选择媒介
        jq3v("select[name='medium_sel']").val(dataOBJ.medium_sel);
        //选择编码
        jq3v("select[name='codec_sel']").val(dataOBJ.codec_sel);
        //选择音频编码
        jq3v("select[name='audiocodec_sel']").val(dataOBJ.audiocodec_sel);
        //选择分辨率
        jq3v("select[name='standard_sel']").val(dataOBJ.standard_sel);
        //选择制作组
        jq3v("select[name='team_sel']").val(dataOBJ.team_sel);
        //选择HDR
        jq3v("input[name='hr']").prop("checked", dataOBJ.hr);
        //选择匿名发布
        jq3v("input[name='uplver']").prop("checked", dataOBJ.uplver);
        //选择我确认本资源为官方资源
        jq3v("input[name='officialteam']").prop("checked", dataOBJ.officialteam);
        //选择标签 官方
        jq3v("input[value='gf']").prop("checked", dataOBJ.gf);
        //选择标签 原创
        jq3v("input[value='yc']").prop("checked", dataOBJ.yc);
        //选择标签 国语
        jq3v("input[value='gy']").prop("checked", dataOBJ.gy);
        //选择标签 粤语
        jq3v("input[value='yy']").prop("checked", dataOBJ.yy);
        //选择标签 官字
        jq3v("input[value='gz']").prop("checked", dataOBJ.gz);
        //选择标签 中字
        jq3v("input[value='zz']").prop("checked", dataOBJ.zz);
        //选择标签 DOLBY VISION
        jq3v("input[value='db']").prop("checked", dataOBJ.db);
        //选择标签 HDR10
        jq3v("input[value='hdr10']").prop("checked", dataOBJ.hdr10);
        //选择标签 HDR10+
        jq3v("input[value='hdrm']").prop("checked", dataOBJ.hdrm);
        //选择标签 禁转
        jq3v("input[value='jz']").prop("checked", dataOBJ.jz);
        //选择标签 限转
        jq3v("input[value='xz']").prop("checked", dataOBJ.xz);
        //选择标签 DIY
        jq3v("input[value='diy']").prop("checked", dataOBJ.diy);
        //选择标签 首发
        jq3v("input[value='sf']").prop("checked", dataOBJ.sf);
        //选择标签 应求
        jq3v("input[value='yq']").prop("checked", dataOBJ.yq);
        //选择标签 动画
        jq3v("input[value='dh']").prop("checked", dataOBJ.dh);
        console.info("done");
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        document.getElementById('browsecat').dispatchEvent(evt);
        layer.msg("解析成功 页面内容已经填入", { icon: 6, skin: 'layui-layer-lan' });
    }
})();


/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.6.2";
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa && typeof global.btoa == 'function'
        ? function(b){ return global.btoa(b) } : function(b) {
        if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function(u) {
        return btoa(utob(String(u)));
    };
    var mkUriSafe = function (b64) {
        return b64.replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encode = function(u, urisafe) {
        return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
    };
    var encodeURI = function(u) { return encode(u, true) };
    var fromUint8Array;
    if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
        // return btoa(fromCharCode.apply(null, a));
        var b64 = '';
        for (var i = 0, l = a.length; i < l; i += 3) {
            var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
            var ord = a0 << 16 | a1 << 8 | a2;
            b64 +=    b64chars.charAt( ord >>> 18)
                +     b64chars.charAt((ord >>> 12) & 63)
                + ( typeof a1 != 'undefined'
                    ? b64chars.charAt((ord >>>  6) & 63) : '=')
                + ( typeof a2 != 'undefined'
                    ? b64chars.charAt( ord         & 63) : '=');
        }
        return urisafe ? mkUriSafe(b64) : b64;
    };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob && typeof global.atob == 'function'
        ? function(a){ return global.atob(a) } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = function(a) { return btou(_atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) {
                return m0 == '-' ? '+' : '/'
            }).replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var toUint8Array;
    if (global.Uint8Array) toUint8Array = function(a) {
        return Uint8Array.from(atob(a), function(c) {
            return c.charCodeAt(0);
        });
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));