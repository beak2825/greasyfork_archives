// ==UserScript==
// @name         0-main
// @namespace    http://tampermonkey.net/
// @version      0.1513200012
// @author       You
// @license      AGPL
// @match        http://49.72.111.82:8081/*

// 00-公共函数
// @require      https://greasyfork.org/scripts/469866-00-%E5%85%AC%E5%85%B1%E5%87%BD%E6%95%B0/code/00-%E5%85%AC%E5%85%B1%E5%87%BD%E6%95%B0.js
// 2.1-切换用户
// @require      https://greasyfork.org/scripts/469164-2-1-%E5%88%87%E6%8D%A2%E7%94%A8%E6%88%B7/code/21-%E5%88%87%E6%8D%A2%E7%94%A8%E6%88%B7.js
// 2.2-订单管理
// @require     https://greasyfork.org/scripts/468378-2-2-%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86/code/22-%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86.js
// 2.3-测序样品
// @require      https://greasyfork.org/scripts/469913-2-3-%E6%B5%8B%E5%BA%8F%E6%A0%B7%E5%93%81/code/23-%E6%B5%8B%E5%BA%8F%E6%A0%B7%E5%93%81.js
// 2.4-课题组管理
// @require     https://greasyfork.org/scripts/470658-2-4-%E8%AF%BE%E9%A2%98%E7%BB%84%E7%AE%A1%E7%90%86/code/24-%E8%AF%BE%E9%A2%98%E7%BB%84%E7%AE%A1%E7%90%86.js
// 2.5-自备引物
// @require      https://greasyfork.org/scripts/470833-2-5-%E8%87%AA%E5%A4%87%E5%BC%95%E7%89%A9/code/25-%E8%87%AA%E5%A4%87%E5%BC%95%E7%89%A9.js
// 2.6-合成订单
// @require      https://greasyfork.org/scripts/470835-2-6-%E5%90%88%E6%88%90%E8%AE%A2%E5%8D%95/code/26-%E5%90%88%E6%88%90%E8%AE%A2%E5%8D%95.js
// 2.7-合成样品
// @require      https://greasyfork.org/scripts/470847-2-7-%E5%90%88%E6%88%90%E6%A0%B7%E5%93%81/code/27-%E5%90%88%E6%88%90%E6%A0%B7%E5%93%81.js
//2.8-客户管理
// @require      https://greasyfork.org/scripts/474889-2-8-%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86/code/28-%E5%AE%A2%E6%88%B7%E7%AE%A1%E7%90%86.js
// 2.9-测序文件
// @require      https://greasyfork.org/scripts/470210-2-9-%E6%B5%8B%E5%BA%8F%E6%96%87%E4%BB%B6/code/29-%E6%B5%8B%E5%BA%8F%E6%96%87%E4%BB%B6.js
//2.10-基因返还
// @require      https://greasyfork.org/scripts/470972-2-10-%E5%9F%BA%E5%9B%A0%E8%BF%94%E8%BF%98/code/210-%E5%9F%BA%E5%9B%A0%E8%BF%94%E8%BF%98.js
//2.11-基因QC
// @require      https://greasyfork.org/scripts/470974-2-11-%E5%9F%BA%E5%9B%A0qc/code/211-%E5%9F%BA%E5%9B%A0QC.js
//2.12-基因新订单
// @require      https://greasyfork.org/scripts/471218-2-12-%E5%9F%BA%E5%9B%A0%E6%96%B0%E8%AE%A2%E5%8D%95/code/212-%E5%9F%BA%E5%9B%A0%E6%96%B0%E8%AE%A2%E5%8D%95.js
//2.13-安排合成
// @require      https://greasyfork.org/scripts/471357-2-13-%E5%AE%89%E6%8E%92%E5%90%88%E6%88%90/code/213-%E5%AE%89%E6%8E%92%E5%90%88%E6%88%90.js
//2.14-反应生产
// @require      https://update.greasyfork.org/scripts/471392/1488907/214-%E5%8F%8D%E5%BA%94%E7%94%9F%E4%BA%A7.js
//2.15-测序入财务
// @require      https://greasyfork.org/scripts/471398-2-15-%E6%B5%8B%E5%BA%8F%E5%85%A5%E8%B4%A2%E5%8A%A1/code/215-%E6%B5%8B%E5%BA%8F%E5%85%A5%E8%B4%A2%E5%8A%A1.js
//2.16-模板生产
// @require      https://greasyfork.org/scripts/471857-2-16-%E6%A8%A1%E6%9D%BF%E7%94%9F%E4%BA%A7/code/216-%E6%A8%A1%E6%9D%BF%E7%94%9F%E4%BA%A7.js
//2.17-模板浏览  
// @require      https://update.greasyfork.org/scripts/490727/2-17-%E6%A8%A1%E6%9D%BF%E6%B5%8F%E8%A7%88.js
//2.18-样品补送
// @require      https://update.greasyfork.org/scripts/496569/218-%E6%A0%B7%E5%93%81%E8%A1%A5%E9%80%81.js
//2.20-模板排版
// @require      https://update.greasyfork.org/scripts/502255/220-%E6%A8%A1%E6%9D%BF%E6%8E%92%E7%89%88.js
//2.21-合成费用
// @require      https://update.greasyfork.org/scripts/503739/221-%E5%90%88%E6%88%90%E8%B4%B9%E7%94%A8.js
//2.22-合成订单完成
// @require      https://update.greasyfork.org/scripts/503810/222-%E5%90%88%E6%88%90%E8%AE%A2%E5%8D%95%E5%AE%8C%E6%88%90.js
//2.23-合成入财务
// @require      https://update.greasyfork.org/scripts/503817/223-%E5%90%88%E6%88%90%E5%85%A5%E8%B4%A2%E5%8A%A1.js
//2.24-库存管理
// @require      https://update.greasyfork.org/scripts/512084/224-%E5%BA%93%E5%AD%98%E7%AE%A1%E7%90%86.js

// 2-后台
// @require      https://greasyfork.org/scripts/469149-2-%E5%90%8E%E5%8F%B0/code/2-%E5%90%8E%E5%8F%B0.js

// @grant        none
// @description main
// @downloadURL https://update.greasyfork.org/scripts/468361/0-main.user.js
// @updateURL https://update.greasyfork.org/scripts/468361/0-main.meta.js
// ==/UserScript==

//================================自动运行  CNAS的订单都加急==================================//

(function(window) {
    $(document).ready(function(){
		//入口函数
		sgt_main()
    });
	//入口函数
    function sgt_main(){//不能删此函数
    	//判断当前网址，如果是登录界面或者是已经登录成功的界面
    	base_url="http://49.72.111.82:8081"
    	url = window.location.href;
    	if(url.indexOf('default.aspx')!==-1){
    		sgt_login_bg()
    	}else{
			sgt_login()
		}
    }
	
})(window);