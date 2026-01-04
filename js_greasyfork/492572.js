// ==UserScript==
// @name         PassWall2 批量URL测试
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  针对PassWall2 v1.28以上版本，添加批量URL测试的按钮，需要先选择测试的节点，然后点击"批量URL测试"的按钮
// @author       iamhaiwei@gmail.com
// @match        *://*/*passwall2/node_list
// @icon        https://s21.ax1x.com/2024/04/15/pFvIb9S.png
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492572/PassWall2%20%E6%89%B9%E9%87%8FURL%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/492572/PassWall2%20%E6%89%B9%E9%87%8FURL%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function url_test_select_nodes(){
        var clickAttriId = '';
        var doms = document.getElementById("cbi-passwall2-nodes").getElementsByClassName("nodes_select");
        if (doms && doms.length > 0) {
            for (var i = 0 ; i < doms.length; i++) {
                if (doms[i].checked) {
                    clickAttriId = "cbi-passwall2-" + doms[i].getAttribute("cbid") + "-_url_test";

                    if(document.getElementById(clickAttriId)){
                        document.getElementById(clickAttriId).getElementsByTagName("a")[0].click()
                    }
                }
            }
        }
    }

    var input_url_test = document.createElement("input");
    input_url_test.setAttribute("id","btn_urltest_select_node");
    input_url_test.setAttribute("type","button");
    input_url_test.setAttribute("class","btn cbi-button");
    input_url_test.setAttribute("value","批量URL测试");
    input_url_test.addEventListener("click", url_test_select_nodes) //触发按钮点击事件

    var cbi_apply = document.getElementsByName("cbi.apply")[0];
    var parent_node = cbi_apply.parentNode;
    parent_node.insertBefore(input_url_test, cbi_apply);

})();