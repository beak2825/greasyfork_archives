// ==UserScript==
// @name         融优学堂
// @namespace    https://www.livedu.com.cn/
// @version      0.4
// @description  融优学堂自动刷课
// @author       th1nk
// @match        *://*.livedu.com.cn/*/queryAllZjByKcdm.do
// @match        *://livedu.com.cn/*/queryAllZjByKcdm.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livedu.com.cn
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/452043/%E8%9E%8D%E4%BC%98%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/452043/%E8%9E%8D%E4%BC%98%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let _table_content = document.getElementsByClassName('curr-b-list')
    let current_studying = 0
    let table_content_text = []
    let table_content_onclick = []
    let postInfo = {
        'kcdm': document.getElementsByName('kcdm')[0].value,
        'zjdm': document.getElementsByName('zjdm')[0].value,
        'bjdm': document.getElementsByName('bjdm')[0].value,
        'spdm': ''
    }
    window.onload = function () {
        document.onkeydown = function () {
            var e = window.event || arguments[0];
            if (e.keyCode == 123) {
                return true;
            } else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
                return false;
            } else if ((e.ctrlKey) && (e.keyCode == 85)) {
                return true;
            }
        };

        document.oncontextmenu = function () {
            return true;
        }
    };
    function getTableContent() {
        //console.log("getTableContent");
        for (const _element of _table_content) {
            let _content_tmp = _element.getElementsByTagName('dd')
            for (const _dd of _content_tmp) {
                let _content_a_template = _dd.getElementsByTagName('a')
                for (const _a_template of _content_a_template) {
                    table_content_text.push(_a_template.innerText)
                    table_content_onclick.push(_a_template)
                }
            }
        }
    }
    function getCurrentChapter() {
        //console.log("getCurrentChapter");
        for (let index = 0; index < (table_content_text.length > table_content_onclick.length ? table_content_onclick.length : table_content_text.length); index++) {
            if (table_content_onclick[index].nextElementSibling.style.float == 'right' && table_content_onclick[index].nextElementSibling.outerText == '正在学习') {
                current_studying = index
            }
        }
    }

    function nextChapter() {
        //console.log("nextChapter");
        if (table_content_onclick.length - 1 > current_studying) {
            current_studying++
            table_content_onclick[current_studying].onclick.call()
        }
        setTimeout(() => {
            checkStatus()
        }, 3000);
    }
    function checkStatus() {
        //console.log("checkStatus");
        let _sp = document.getElementById('zwshow').contentWindow.document.getElementById('sp_index_1')
        //console.log('_sp', _sp);
        if (_sp == null || _sp.outerText == '已完成') {
            nextChapter()
        } else if (_sp.outerText == '未完成') {
            startPlay()
        }
    }
    function startPlay() {
        //console.log("startPlay");
        let _vi = document.getElementById('zwshow').contentWindow.document.getElementById('myVideo_1')
        console.log("_vi", _vi);
        if (_vi != null) {
            _vi.muted = true
            postInfo.spdm = _vi.getAttribute('spdm');
            $.post("/ispace4.0/moocxsxx/initKcspSq", postInfo);
            _vi.nextElementSibling.remove();
            console.log(_vi.nextElementSibling);
            console.log("currentTime", _vi.currentTime);
            console.log("duration", _vi.duration);
            setTimeout(() => {
                let _interval = setInterval(function () {
                    console.log(`${table_content_text[current_studying]} 当前进度${_vi.currentTime}/${_vi.duration}`);
                    if (_vi.duration - _vi.currentTime < 1.5) {
                        //console.log("清除定时器");
                        clearInterval(_interval)
                        setTimeout(() => {
                            _vi.play()
                            nextChapter()
                        }, 2000);
                    } else {
                        _vi.play()
                    }
                    const _vi_tmp = document.getElementById('zwshow').contentWindow.document.getElementById('myVideo_1')
                    if (_vi_tmp != null && _vi_tmp != _vi) {
                        _vi = _vi_tmp
                    }
                }, 1000)
            }, 3000);
        }
    }
    getTableContent()
    getCurrentChapter()
    checkStatus()
})();