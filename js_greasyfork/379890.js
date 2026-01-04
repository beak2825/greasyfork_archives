// ==UserScript==
// @name            Azrubel-自动转存百度网盘分享
// @namespace       moe.jixun.baidu.auto.save
// @version         0.1
// @description     自動轉存當前文件至上次轉存路徑。Modified from AC:https://greasyfork.org/scripts/38591 from Jixun:https://greasyfork.org/zh-CN/scripts/19864
// @author          Jixun & modified by AC & modified by Azrubel
// @include         /https\:\/\/(pan|yun)\.baidu\.com\/s\/[\S]+/
// @include         /http?://(pan|yun).baidu.com/share/link*/
// @note            V0.1 完善转存请求，修复自动转存功能
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/379890/Azrubel-%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%AD%98%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/379890/Azrubel-%E8%87%AA%E5%8A%A8%E8%BD%AC%E5%AD%98%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var errors = {
        0: '成功',
        5: '自己的文件',
        12: '已经保存过了',
        111: '另一保存任务进行中',
        '-33': '需要会员 (?)',
        120: '需要会员 (?)',
        130: '需要超级会员 (?)'
    };

    (function (tip, c) {
        var key = yunData.MYNAME.replace(/@/g, "") + "_transfer_save_path";
        var _recent_path = localStorage.getItem(key);
        if (!_recent_path) _recent_path = '/';
        else _recent_path = _recent_path.replace(/\?\d+/, '');

        var $ = require("base:widget/libs/jquery-1.12.4.js");
        $(".g-button[title='保存到网盘'] .text").html("设置保存路径")
        $.ajax({
            type: 'POST',
            url: '/share/transfer?shareid=' + yunData.SHARE_ID + '&from=' + yunData.SHARE_UK,
            data: {
                fsidlist: JSON.stringify(yunData.FILEINFO.map(function(f){ return f.fs_id; })),
                path: _recent_path
            },
            dataType: 'json',
            success: function (data) {
                var raw = typeof data == 'string' ? $.parseJSON(data) : data;
                var err = data.errno;

                var errMsg = '';
                if (err in errors) {
                    errMsg += errors[err] + ' (' + err + ')';
                } else {
                    errMsg += '未知状态 (' + err + ')';
                }

                var msg = '保存至: ' + _recent_path + ', 状态: ' + errMsg;
                document.title = errMsg + ' - ' + document.title;

                tip.hide();
                tip.show({
                    mode: err === 0 ? 'success' : 'caution',
                    msg: msg,
                    hasClose: true,
                    autoClose: false,
                    vipType: 'svip'
                });
            }
        });

        tip.show({
            mode: 'loading',
            msg: "正在转存文件，请稍后...",
            hasClose: false,
            autoClose: false
        });
    })(
        /*tip: */require("system-core:system/uiService/tip/tip.js")
    );
})();