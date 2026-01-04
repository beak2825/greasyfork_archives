// ==UserScript==
// @name         网上大学右键弹出复制
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  先选择文字，然后单击鼠标右键，即可复制选择的文字，成功无提示，失败则有提示!
// @description:zh    更新为全网通用http
// @description:zh    更新为全网通用https
// @author       You
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391276/%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E5%8F%B3%E9%94%AE%E5%BC%B9%E5%87%BA%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/391276/%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6%E5%8F%B3%E9%94%AE%E5%BC%B9%E5%87%BA%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.onmousedown = function(e){
        var e2 = e || window.event
        if(e2.button == "2"){
            //alert(selectText());
            var oInput = document.createElement('input');
            // 把文字放进input中，供复制
            oInput.value = selectText();
            document.body.appendChild(oInput);
            // 选中创建的input
            oInput.select();
            // 执行复制方法， 该方法返回bool类型的结果，告诉我们是否复制成功
            var copyResult = document.execCommand('copy')
            // 操作中完成后 从Dom中删除创建的input
            document.body.removeChild(oInput)
            // 根据返回的复制结果 给用户不同的提示
            if (copyResult) {
               //alert('DDL已复制到粘贴板')
            } else {
                alert('复制失败')
            }
        }
    }
	function selectText(){
		if(document.Selection){
			//ie浏览器
			return document.selection.createRange().text;
		}else{
			//标准浏览器
			return window.getSelection().toString();
		}
	}
})();