// ==UserScript==
// @name         jav01 markList
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add marklist for jav01 by javdb
// @author       moonwizard
// @match        https://www.av01.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=av01.tv
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439372/jav01%20markList.user.js
// @updateURL https://update.greasyfork.org/scripts/439372/jav01%20markList.meta.js
// ==/UserScript==

(function () {
	'use strict';


	let fanHao = document.getElementById('id_list').children[5].innerHTML;
	console.log(fanHao);
	let myUrl = "https://javdb.com/search?q=" + fanHao;
    let trueUrl = "";

    console.log('我的脚本加载了');
	var button = document.createElement("button"); //创建一个input对象（提示框按钮）
	button.id = "mark";
	button.textContent = "收藏";


    GM_xmlhttpRequest({
      method: "GET",
      url: myUrl,
      onload: function (res) {

          let domNew = new DOMParser().parseFromString(res.responseText, "text/html");
          let tempUrl = domNew.getElementsByClassName('box')[0] + "";
          console.log(tempUrl);
          trueUrl = "https://javdb.com/v" + tempUrl.substring(tempUrl.lastIndexOf('/'),tempUrl.length);
          console.log('lalalall' + trueUrl);

      },
    });


	//绑定按键点击功能
	button.onclick = function (){
        console.log('open:' + trueUrl)
		window.open(trueUrl);
		return;
	};

    var x = document.getElementsByClassName('info_row')[0];
	x.appendChild(button);

})();
