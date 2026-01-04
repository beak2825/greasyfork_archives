// ==UserScript==
// @name         passwall批量可用性测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在节点列表页面添加批量可用性测试按钮，对于勾选的多节点可以进行批量可用性测试
// @author       wangqianyang@126.com
// @match        *://*/*passwall/node_list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467368/passwall%E6%89%B9%E9%87%8F%E5%8F%AF%E7%94%A8%E6%80%A7%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/467368/passwall%E6%89%B9%E9%87%8F%E5%8F%AF%E7%94%A8%E6%80%A7%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    GM_log("开始运行脚本...");
      function url_test_select_nodes(){
        GM_log("开始执行 function url_test_select_nodes");
		var input_id = '';
		var doms = document.getElementById("cbi-passwall-nodes").getElementsByClassName("nodes_select");
		if (doms && doms.length > 0) {
			for (var i = 0 ; i < doms.length; i++) {
				if (doms[i].checked) {
					input_id = "cbid.passwall." + doms[i].getAttribute("cbid") + "._url_test";

                    if(document.getElementById(input_id)){
                        GM_log("进行节点可用性测试：" + input_id);
                        document.getElementById(input_id).click();
                    }
				}
			}
		}
        GM_log("执行结束 function url_test_select_nodes");
	}

    GM_log("声明完成 function url_test_select_nodes");

    var input_url_test = document.createElement("input"); //创建一个按钮
	input_url_test.setAttribute("id","btn_urltest_select_node");
	input_url_test.setAttribute("type","button");
	input_url_test.setAttribute("class","btn cbi-button");
	input_url_test.setAttribute("value","批量可用性测试");
    input_url_test.addEventListener("click", url_test_select_nodes) //监听按钮点击事件

    GM_log("创建完成按钮");

    var cbi_apply = document.getElementsByName("cbi.apply")[0];
    GM_log(cbi_apply.name);
    var parent_node = cbi_apply.parentNode;
    parent_node.insertBefore(input_url_test, cbi_apply);

    GM_log("脚本执行结束...");

    
})();