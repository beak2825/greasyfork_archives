// ==UserScript==
// @name         批量删除QQ群成员
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量删除无备注群昵称的成员或全部成员
// @author       delfino
// @match        https://qun.qq.com/member.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454067/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4QQ%E7%BE%A4%E6%88%90%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/454067/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4QQ%E7%BE%A4%E6%88%90%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var limit='nonickname';
	function checkItems(limit) {
		if (!document.querySelector(".del-member.disabled")){
			return false
        }
		document.querySelector(".del-member.disabled").removeAttribute("disabled");
		document.querySelector(".del-member.disabled").className = "del-member";
        var trs=document.querySelectorAll("#groupMember tr")
        if(limit=='nonickname'){
            for(let n=2;n<trs.length;n++){
                if(trs[n].querySelector('td.td-card input').value==""){
                    let td=trs[n].querySelector('.mb .check-input');
                    td.setAttribute('checked', 'checked');
                }
            }
        }else{
            //var items = document.querySelectorAll('.mb .check-input');
            for (let n = 2; n < 22; n++) {
                let td1=trs[n].querySelector('.mb .check-input');
                    td1.setAttribute('checked', 'checked');
            }
        }
	}
	window.addEventListener('scroll', function () {
		checkItems(limit);
	});
	document.querySelector('.select-result .submit').addEventListener('click', function () {
		setTimeout(function () {
			checkItems(limit);
		}, 1000);
	}, false);
})();