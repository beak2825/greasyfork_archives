// ==UserScript==
// @name         HOOK 所有已知加解密函数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  HOOK 所有已知加解密函数，用于爬虫破解
// @author       jflmao
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.js
// @resource          swalStyle https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.css
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/486116/HOOK%20%E6%89%80%E6%9C%89%E5%B7%B2%E7%9F%A5%E5%8A%A0%E8%A7%A3%E5%AF%86%E5%87%BD%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/486116/HOOK%20%E6%89%80%E6%9C%89%E5%B7%B2%E7%9F%A5%E5%8A%A0%E8%A7%A3%E5%AF%86%E5%87%BD%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var enable_day = GM_getValue('enable_day');
	var date = new Date(enable_day);
	var year = date.getFullYear();
	var month = date.getMonth()
	var day = date.getDate();

	var dateN = new Date();
	var yearN = dateN.getFullYear();
	var monthN = dateN.getMonth()
	var dayN = dateN.getDate();
	if (day != dayN || month != monthN || yearN != year) {
		GM_setValue('enable_day', dateN.getTime());
		GM_setValue('setting_Enable', false);
	}
	console.log(GM_getValue('setting_Enable'));
	function addStyle(id, tag, css) {
		tag = tag || 'style';
		let doc = document, styleDom = doc.getElementById(id);
		if (styleDom) return;
		let style = doc.createElement(tag);
		style.rel = 'stylesheet';
		style.id = id;
		tag === 'style' ? style.innerHTML = css : style.href = css;
		doc.getElementsByTagName('head')[0].appendChild(style);
	}
	addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
	GM_registerMenuCommand('设置', () => {
		let html = `<div style="font-size: 1em;"><label class="panai-setting-label">启用 HOOK<input type="checkbox" id="Enable" ${GM_getValue('setting_Enable') ? 'checked' : ''} class="panai-setting-checkbox"></label></div>`;
		Swal.fire({
			title: '设置',
			html,
			icon: 'info',
			footer: '<div style="text-align: center;font-size: 1em;">BY <a href="https://www.52pojie.cn/home.php?mod=space&uid=311050" target="_blank">jflmao@吾爱破解</a></div>',
			showCloseButton: true,
			confirmButtonText: '保存'
		}).then((res) => {
			res.isConfirmed && history.go(0);
		});

		document.getElementById('Enable').addEventListener('change', (e) => {
			GM_setValue('setting_Enable', e.currentTarget.checked);
		});
	});


    var source = ['DeCode','EnCode','decodeData','base64decode','md5','decode','btoa','MD5','RSA','AES','CryptoJS','encrypt','strdecode',"encode",'decodeURIComponent','_t','JSON.stringify','String.fromCharCode','fromCharCode'];
    
    let realCtx, realName;
    function getRealCtx(ctx, funcName) {
        let parts = funcName.split(".");
        let realCtx = ctx;
        for(let i = 0; i < parts.length - 1; i++) {
            realCtx = realCtx[parts[i]];
        }
        return realCtx;
    }
    function getRealName(funcName) {
        let parts = funcName.split(".");
        return parts[parts.length - 1];
    }
    function hook(ctx, funcName, originFunc) {
        ctx[funcName] = function(a){
			console.log('***********************************************');
            console.log('检测到加解密函数："' + funcName + '"，传入参数：[' + typeof(a) + ']', a);
            console.log('函数定义：' + originFunc.toString());
            console.log(originFunc.toString);
			let ret = originFunc(a);
			console.log('返回数据：[' + typeof(ret) + ']',ret);
            debugger;
            return ret;
        };
    }
    function test(ctx) {
        for(let i = 0; i < source.length; i++) {
            let f = source[i];
            let realCtx = getRealCtx(ctx, f);
            let realName = getRealName(f);
            let chars = realCtx[realName];
            hook(realCtx, realName, chars);
        }
    }
	if(GM_getValue('setting_Enable')){
		console.log("开始测试是否有解密函数");
		test(window);
	}
})();