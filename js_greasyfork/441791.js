// ==UserScript==
// @name         XXX自认证校园网
// @namespace    http://waahah.github.io/
// @version      0.1.2
// @description  免去重复登陆校园网的烦恼，解放双手
// @author       waahah
// @license      Apache License 2.0
// @require      https://unpkg.com/tesseract.js@2.1.4/dist/tesseract.min.js
// @match        *://172.24.13.5/*
// @grant        GM_openInTab
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441791/XXX%E8%87%AA%E8%AE%A4%E8%AF%81%E6%A0%A1%E5%9B%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/441791/XXX%E8%87%AA%E8%AE%A4%E8%AF%81%E6%A0%A1%E5%9B%AD%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(interval) {
        return new Promise(resolve => {
          setTimeout(resolve, interval);
        })
      }

    setTimeout(closewin,400);
    const list = {
        "name" : '202601080204',
        "pwd" : "206033"
    }
	document.querySelectorAll('[readonly]').forEach(ro => {
        ro.removeAttribute('readonly');
  });

    async function closewin(){
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
        window.location.href='https://www.bing.com/?mkt=zh-CN';
        await sleep(1000);
        window.close();
    } else {
        window.opener = null;
        window.open("", "_self");
        await sleep(1000);
        window.close();
    }
}

    setTimeout("document.getElementById('validImage').click();const link = document.getElementById('validImage').getAttribute('src');console.log('第一'+link);",700)

    const user = document.getElementById('username');
	const core = document.getElementById('pwd');
	const ipt = document.querySelector('#validCode');
	const block = ipt.getAttribute('style').indexOf('block');
	const btn = document.querySelector('#loginLink');


    //setTimeout("console.log('链接：'+document.getElementById('validImage').getAttribute('src'));",200);

setTimeout(
	function enter(){
		if (user.value == '' && core.value == '') {
			user.value = list.name;
            user.blur();
            $("#pwd_tip").hide();
            $("#pwd").show();
			core.value = list.pwd;
		}
		else if(user.value !==list.name || core.value !==list.pwd){
			user.value = list.name;
            user.blur();
            $("#pwd_tip").hide();
            $("#pwd").show();
			core.value = list.pwd;
		}
		$("#xiaoruihelpDiv").show();
		$("#isAutoLogin").show();
        btn.click();
	},300)


  setTimeout(
	function auth(){
        console.log(link);
		if (link !== null) {//undefined
			let sc = document.createElement("script");
			sc.setAttribute('src','https://unpkg.com/tesseract.js@2.1.4/dist/tesseract.min.js');
			document.head.appendChild(sc);
			const exampleImage = link;
            console.log("exampleImage"+exampleImage);

			const worker = Tesseract.createWorker({
			    logger: m => console.log(m)
			});
			Tesseract.setLogging(true);
			work();

			async function work() {
			    await worker.load();
			    await worker.loadLanguage('eng');
			    await worker.initialize('eng');

			    let result = await worker.recognize(exampleImage);
			    console.log(result.data);

			    await worker.terminate();
                $("#validCode_tip").hide();
                $("#validCode").show();
                ipt.value = result.data.text;
                btn.click();
			    }
		}
	}
        ,800);

})();