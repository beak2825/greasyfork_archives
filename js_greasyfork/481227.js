// ==UserScript==
// @name         Spoc Helper
// @namespace    Spoc Helper
// @version      1.0.0
// @description  快速完成国家安全系列课程。刷课有风险，请自行承担。
// @author       SingleDog
// @license      GPL-3.0-or-later
// @match        https://spoc.buaa.edu.cn/spoc/moocxsxx/queryAllZjByKcdm.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481227/Spoc%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/481227/Spoc%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 在iframe加载完成后执行操作
    var videoStr, str1, spdm;
    var iframe;
    var flagPara = 0;
    document.getElementById('zwshow').onload = function () {
        // 获取iframe元素
        iframe = document.getElementById('zwshow');

        // 访问iframe中的文档
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // 在iframe文档中查找id为'sp'的元素
        var para = iframeDocument.getElementById('myVideo_2');

        if (para) {
            var paraValue = para.onended;
            paraValue = paraValue.toString();
            // var startIndex = paraValue.indexOf('//');
            var regex = /'([^']+)'/g; // 匹配单引号中的内容

            var matches = paraValue.match(regex);

            videoStr = matches[0].slice(1, -1);
            str1 = matches[1].slice(1, -1);
            spdm = matches[2].slice(1, -1);
            flagPara = 1;
            // var residualLen='https://doc.spoc.buaa.edu.cn:19012//'.length;

            // 找到双斜杠后的内容
            // var startIndex = paraValue.indexOf('//');
            // var contentAfterDoubleSlash = paraValue.substring(startIndex + 2); // 加 2 是为了排除双斜杠的长度

            // console.log('双斜杠后的内容:', contentAfterDoubleSlash);

            //                 var videoStr = paraValue.substr(residualLen) // 加 2 是为了排除双斜杠的长度

            //                 console.log('VideoStr:', videoStr);
        }
        else {
            console.log('Parameters not found');
        }
    };

    // 选择具有特定ID的隐藏输入元素
    var hiddenInputElement = document.querySelector('input[type="hidden"][id="playZjdm"]');
    var hiddenKcdm = document.querySelector('input[type="hidden"][id="kcdm"]');

    // 检查是否成功选择了元素
    if (!hiddenInputElement || !hiddenKcdm) {
        console.error('not Found kcdm');
    }
    console.log("kcdm:", hiddenKcdm.value);
    console.log("zjdm:", hiddenInputElement.value);


    console.log('Waiting...');
    checkFlagAndProcess();

    function checkFlagAndProcess() {
        if (flagPara) {
            console.log("videoStr:", videoStr);
            console.log("str1:", str1);
            console.log("spdm:", spdm);
            console.log('start Processing...');
            setTimeout(() => {
                myFunction(videoStr, str1, iframe, spdm);
            }, 3000);
            console.log('Process Completed.');
            alert('如果未显示已完成，请等待10秒再刷新一次。');
        } else {
            setTimeout(checkFlagAndProcess, 100); // 每隔100毫秒检查一次flagPara
        }
    }
    function myFunction(streamName, str1, obj, spdm) {
        var zt = $(obj).parent().parent().children(":first").html();
        if (zt == "已完成") {
            return false;
        }
        var kcdm = hiddenKcdm.value;
        var zjdm = hiddenInputElement.value;
        //var str = '';
        var index = streamName.indexOf("\/");
        var str = streamName.substring(index + 1, streamName.length);
        var url = "/spoc/moocxsxx/updKcspSqzt.do";
        $.ajax({
            type: "post",
            data: { 'kcdm': kcdm, 'zjdm': zjdm, 'streamName': str, 'spdm': spdm },
            url: url,
            success: function (data) {
                if (data == "1") {
                    $('#sp_index_' + str1).attr('class', 'action');
                    $('#sp_index_' + str1).text("已完成");
                } else {
                    alert("观看视频失败！！！");
                    // myFunction(streamName,str1);
                }
            }
        });
    }

})();
