// ==UserScript==
// @name          阿里云网盘面包屑文字选择
// @description   解决阿里云网盘面包屑文字不能选择复制。
// @version       1.0.1
// @namespace     阿里云网盘面包屑文字选择
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//www.aliyundrive.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @require       https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @require       https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469443/%E9%98%BF%E9%87%8C%E4%BA%91%E7%BD%91%E7%9B%98%E9%9D%A2%E5%8C%85%E5%B1%91%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/469443/%E9%98%BF%E9%87%8C%E4%BA%91%E7%BD%91%E7%9B%98%E9%9D%A2%E5%8C%85%E5%B1%91%E6%96%87%E5%AD%97%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
    var dynamicLoading = {
        css: function(path){
            if(!path || path.length === 0){
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        js: function(path){
            if(!path || path.length === 0){
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);
        }
    }

    dynamicLoading.css('https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css');

    $(document).on('click', '.breadcrumb-item-link--M-p4b', function(){
        var obj = $(this);

        const clipboard = navigator.clipboard;
        navigator.clipboard.writeText(obj.text());

        toastr.success(obj.text(), "已经复制");

    });
}