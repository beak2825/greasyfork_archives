// ==UserScript==
// @name         Powerbee bypass vip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Query electricity consumption without vip
// @author       tgalpha
// @match        http://im.zg118.com/static/weixin/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459531/Powerbee%20bypass%20vip.user.js
// @updateURL https://update.greasyfork.org/scripts/459531/Powerbee%20bypass%20vip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Replace query function
    unsafeWindow.isalipay = function () {
        $("#alipaybutton").prop("disabled", "disabled");
        //查询用电记录
        $.ajax({
            url: urladd + '/api/client/vip/expiry?uid=' + uid + '&token=' + token,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.Data != null) {
                    $("#alipaybutton").removeAttr("disabled");
                    var d = dialog({
                        title: '查询更多',
                        width: window.innerWidth - 40,
                        content: "<p style='font-size: 12px; text-align:center; margin-bottom: 25px;'><input type='text' id='beginTime' placeholder='开始时间' style='width: 80%'  class='imput-data-txt' readonly required></p><p style='font-size: 12px; text-align:center; margin-bottom: 25px;'><input type='text' id='endTime' placeholder='结束时间' class='imput-data-txt' style='width: 80%'  readonly required></p><p style='font-size: 15px; margin-bottom:15px; text-align:center;'><input type='button' style='width: 80%' value='查&nbsp;&nbsp;询' class='sub-data-btn' style=' margin-left:5px;' onclick='getReport(1)'></p><p style='font-size: 15px; margin-bottom:15px; text-align:center;'><input type='button' value='取&nbsp;&nbsp;消' style='width: 80%' class='sub-no-data-btn' onclick='dialogclose()'></p>"
                    });
                    d.showModal();
                    $('#beginTime').datepicker({ format: 'yyyy-mm-dd' });
                    $('#endTime').datepicker({ format: 'yyyy-mm-dd' });
                } else {
                    showMessage(data.Message);
                }
            },
            error: function () {
                showMessage("错误！");
            }
        });
    }
})();