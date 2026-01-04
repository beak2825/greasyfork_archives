// ==UserScript==
// @name                    fCSDNck
// @name:zh                 fCSDNck
// @name:zh-CN              fCSDNck
// @name:zh-TW              fCSDNck
// @namespace               https://github.com/tempestLXC/fCSDNck
// @version                 0.0.6
// @description             屏蔽百度搜索结果中 CSDN 相关搜索结果
// @description:zh          屏蔽百度搜索结果中 CSDN 相关搜索结果
// @description:zh-CN       屏蔽百度搜索结果中 CSDN 相关搜索结果
// @description:zh-TW       屏蔽百度搜索结果中 CSDN 相关搜索结果
// @author                  tempestlxc
// @match                   *://www.baidu.com/*
// @grant                   none
// @license                 MIT
// @downloadURL https://update.greasyfork.org/scripts/440541/fCSDNck.user.js
// @updateURL https://update.greasyfork.org/scripts/440541/fCSDNck.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var CSDN = '-(csdn)';
    var button = document.createElement('button');
    button.id = 'bdIndexButton';
    button.className = 'btn self-btn bg s_btn';
    button.textContent = 'fCSDNck';
    button.style.background = '#e33e33';
    button.style.display = 'none';
    button.addEventListener('click', clickBotton);

    function clickBotton() {
        var kw = document.getElementById('kw');
        if (!isEmpty(kw.value) && !kw.value.includes(CSDN)) {
            kw.value = kw.value + ' ' + CSDN;
        }
    }


    function getTargetElement() {

        var targetElement = document.getElementById('su');
        return targetElement;
    }

    var like_comment = getTargetElement();


    if (!isEmpty(like_comment)) {

        var span = like_comment.parentElement;

        span.onmouseover = function() {
            button.style.display = 'block';
        };

        span.onmouseout = function() {
            button.style.display = 'none';
        };

        span.appendChild(button);
    }


    function isEmpty(obj) {
        if (typeof obj == 'undefined' || obj == null || obj == '') {
            return true;
        } else {
            return false;
        }
    }
})();