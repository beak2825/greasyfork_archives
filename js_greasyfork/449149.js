// ==UserScript==
// @name         复制粘贴代码净化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  代码剪贴板净化，解决复制代码旁边出现序号的问题
// @author       Stu-Van
// @match        *://*.zhihu.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.nowcoder.com/*
// @match        *://*.juejin.im/*
// @match        *://*.juejin.cn/*
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/449149/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E4%BB%A3%E7%A0%81%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/449149/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E4%BB%A3%E7%A0%81%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
               function clearText() {
            var clipPromise = navigator.clipboard.readText();
            var aa = [];
            clipPromise.then(function (clipText) {
                var lines = clipText.split("\n");
                var num = lines.length.toString().length;
                for (var index = 0; index < lines.length; index++) {
                    var element = lines[index];
                    var indexof = element.indexOf((index + 1));
                    if (indexof != -1) {
                        aa[index] = element.substring(num, element.length);
                    }else{
                        aa[index]=element;
                    }
                }
            }).then(function (data) {
                writecontent(aa.join("\n"))
            });
        }
        function writecontent(aa){
            navigator.clipboard.writeText(aa).then(() => {
                    console.log('复制成功')
                }).catch(() => {
                    const e = document.createElement('textarea')
                    document.body.appendChild(e)
                    e.innerHTML = aa;
                    e.select();
                    if (document.execCommand('copy')) {
                        document.execCommand('copy');
                    }
                    document.body.removeChild(e)
                    console.log('复制成功')
                })
        }

    document.addEventListener('copy',clearText)
})();