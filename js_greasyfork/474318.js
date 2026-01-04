// ==UserScript==
// @name        煎蛋树洞屏蔽脚本
// @namespace   无
// @author      阿了个乐
// @description 屏蔽煎蛋某些用户的树洞
// @include     *://jandan.net/treehole*
// @version     1.1.3
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474318/%E7%85%8E%E8%9B%8B%E6%A0%91%E6%B4%9E%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474318/%E7%85%8E%E8%9B%8B%E6%A0%91%E6%B4%9E%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var userToCheck = ['俱舍莲帝'];//想屏蔽的ID, 新增ID记得加引号,多个ID要用英文半角逗号隔开
    var disagree = 1;//是否给想屏蔽的ID点XX, 不想点XX就改成 = 0
    var contextToCheck = ['莲帝','莲弟'];//想屏蔽树洞内容的关键字,如何新增见上面
	var divContext = document.querySelectorAll('div.text');
	divContext.forEach(
		function (context){
			var textContent = context.textContent || context.innerText;
			if(contextToCheck.some(function(item) {
			  return textContent.includes(item);
			})){
				var liElement = context.closest('li');
				if (liElement) {
					liElement.style.display = 'none';
				}
			}
		}
	);
    var divAuthors = document.querySelectorAll('div.author');
    divAuthors.forEach(
        function (divAuthor) {
            var authorText = divAuthor.textContent.trim();
            userToCheck.forEach(
                function (keyword) {
                    if (authorText.includes(keyword)) {
                        var liElement = divAuthor.closest('li');
                        if (liElement) {
                            liElement.style.display = 'none';
                            var linkButton = liElement.querySelector('a[title="叉叉/反对"]');
                            if (linkButton && disagree == 1) {
                                linkButton.click();
                            }
                        }
                    }
                });
        });
})();