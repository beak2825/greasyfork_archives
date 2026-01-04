// ==UserScript==
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBNTlBOEI1NDc1REExMUU2OTM4MkI1QjIwMkY4Nzg2MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMEQ2QzQwMURCRjQxMUU4QUEwMkUxQkU3Q0REQTE2OSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMEQ2QzQwMERCRjQxMUU4QUEwMkUxQkU3Q0REQTE2OSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmI2ODI5YTYzLWNmYTMtYWM0ZS04ZjBhLWIzMjJkOGJmMGZjMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNTlBOEI1NDc1REExMUU2OTM4MkI1QjIwMkY4Nzg2MyIvPiA8L3Jk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
// @name         ZFDev-百度网盘 - 去除分享链接推广提示
// @namespace    https://zfdev.com/
// @version      0.1.0.3
// @description  再也不要看到这句话了：“复制这段内容后打开百度网盘手机App，操作更方便哦”
// @author       greendev
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374100/ZFDev-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E5%8E%BB%E9%99%A4%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%8E%A8%E5%B9%BF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374100/ZFDev-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E5%8E%BB%E9%99%A4%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%8E%A8%E5%B9%BF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let t = " ", e = "text", o = "去除小尾巴失败o(╥﹏╥)o", a = "body", l = "copy";
    document.querySelector(a).addEventListener(l, function(a) {
        try {
            let l = a.target.value;
            l = l.split(t).filter((t, e) => e < 4).join(t), a.clipboardData.setData(e, l), 
            a.preventDefault();
        } catch (a) {
            console.log(o);
        }
    });

})();