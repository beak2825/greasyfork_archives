// ==UserScript==
// @name         xxlJob support
// @namespace    f6
// @version      0.1
// @description  mark xxlJob easier!
// @author       rain
// @match        http://*.f6yc.com/xxl-job-admin/*
// @match        http://*.f6car.org/xxl-job-admin/*
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at       document-idle
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_download
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/438791/xxlJob%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/438791/xxlJob%20support.meta.js
// ==/UserScript==

setTimeout(() => {
    addExecutorSearch()
}, 200)

function addExecutorSearch() {
    const addExecutorSearch = $("#rain-input")
    if (addExecutorSearch.length == 0) {
        $(".content .row").find('div').eq(0).append('<input id="rain-input" style="width: 200px" type="text"' +
            ' placeholder="请输入执行器名称">')
        // 输入的时候 搜索下拉框
        let options = $('#jobGroup option');

        let $rainInput = $('#rain-input');
        $rainInput.on('keyup', function () {
            let inputValue = $rainInput.val();
            if (inputValue.length) {
                console.log(inputValue)
                //  回车后将数据填入下拉框
                if (event.keyCode == "13") {
                    let oldHref = location.href;
                    let prefix = oldHref.split('?')[0];

                    let hasNoOption = true;
                    for (let i = 0; i < options.length; i++) {
                        if (inputValue == options[i].text) {
                            location.href = prefix + '?jobGroup=' + options[i].value;
                            hasNoOption = false;
                            break;
                        }
                    }
                    if (hasNoOption) {
                        alert("没有名字为：" + inputValue + " 的执行器");
                    }
                }
            }
        })

    }
}