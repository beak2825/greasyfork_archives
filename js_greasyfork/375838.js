// ==UserScript==
// @name         Greasy Fork 日均安装量
// @version      0.02
// @description  在 Greasy Fork 页面中新增显示日均安装量
// @match        *://greasyfork.org/zh-CN/scripts/*
// @grant        无
// @author       太史子义慈
// @namespace    qs93313@sina.cn
// @downloadURL https://update.greasyfork.org/scripts/375838/Greasy%20Fork%20%E6%97%A5%E5%9D%87%E5%AE%89%E8%A3%85%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/375838/Greasy%20Fork%20%E6%97%A5%E5%9D%87%E5%AE%89%E8%A3%85%E9%87%8F.meta.js
// ==/UserScript==

!(function() {
	gadi(0);
})();

function gadi() {
	var find = (document.querySelector("#script-stats") !== null);
	if(find) {
        var ssdi = document.getElementsByClassName("script-show-daily-installs")[1].children[0].innerHTML.replace(',', '');
		var ssti = document.getElementsByClassName("script-show-total-installs")[1].children[0].innerHTML.replace(',', '');
		var sscd = document.getElementsByClassName("script-show-created-date")[1].children[0].children[0].getAttribute('datetime');
		var sscd_t = Date.parse(new Date(sscd));
		var myDate = Date.parse(new Date());
		var txc = (myDate - sscd_t) / 86400000;
        var ti = 0;
        if(txc > 1){
            ti = Math.round(ssti / txc);
        }else{
            ti = ssdi;
        }
		var new_dt = document.createElement('dt');
		new_dt.setAttribute("class", "script-show-gadi");
		var new_dt_span = document.createElement('span');
		new_dt_span.innerHTML = "日均安装";
		new_dt.appendChild(new_dt_span);
		var new_dd = document.createElement('dd');
		new_dd.setAttribute("class", "script-show-gadi");
		var new_dd_span = document.createElement('span');
		new_dd_span.innerHTML = ti;
		new_dd.appendChild(new_dd_span);
		var father = document.getElementById("script-stats");
        var bro = document.getElementsByClassName("script-list-ratings")[0];
        father.insertBefore(new_dt, bro);
        father.insertBefore(new_dd, bro);
	}
}