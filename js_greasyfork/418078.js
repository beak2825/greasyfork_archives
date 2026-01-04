// ==UserScript==
// @name         QQ邮箱复制通讯录好友列表
// @namespace    https://www.zhxlp.com
// @version      0.1
// @description  通过QQ邮箱复制通讯录好友列表
// @author       Zhxlp
// @match        https://mail.qq.com/cgi-bin/laddr_list*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_log
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/418078/QQ%E9%82%AE%E7%AE%B1%E5%A4%8D%E5%88%B6%E9%80%9A%E8%AE%AF%E5%BD%95%E5%A5%BD%E5%8F%8B%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418078/QQ%E9%82%AE%E7%AE%B1%E5%A4%8D%E5%88%B6%E9%80%9A%E8%AE%AF%E5%BD%95%E5%A5%BD%E5%8F%8B%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

/* global jQuery */

// 复制按钮1
const copyUserListBtn1 = () => {
    if(jQuery('#out #bar .nav_list .tool').length <= 0) return false;
    let copyBtn = document.querySelector("#copy-user-list1");
    if(!copyBtn){
        jQuery('#out #bar .nav_list .tool').append('<a id="copy-user-list1" href="javascript:;" class="btn_gray btn_space">复制列表</a>');
    }
}

// 复制按钮2
const copyUserListBtn2 = () => {
    if(jQuery('#out #bar .nav_list .tool').length <= 0) return false;
    let copyBtn = document.querySelector("#copy-user-list2");
    if(!copyBtn){
        jQuery('#out #bar .nav_list .tool').append('<a id="copy-user-list2" href="javascript:;" class="btn_gray btn_space">复制列表(格式化)</a>');
    }
}

const copyUserList = (event) => {
  let list = []
  jQuery("#out #list ul li").each((_index, elem) => {
    let row = []
    jQuery(elem).children('span').each((_index2, elem2) => {
        const col = jQuery(elem2).text();
        row.push(col);
    });
    list.push(row);
  });
  const sList = formatList(list,event.data);
  GM_log(sList);
  GM_setClipboard(sList,'text');
  window.alert('复制成功');
}
const formatList = (li,fill) => {
    let list = li;
    if(fill == true){
        list = formatList2(li);
    }
	let formatStr = '';
	for(let i = 0; i < list.length; i += 1) {
		formatStr += '| ';
		for(let j = 0; j < list[i].length; j += 1) {
			formatStr += list[i][j];
            if(j != list[i].length -1){
                formatStr += ' | ';
            }
		}
		formatStr += ' |\r\n';
	}
	return formatStr;
}

const formatList2 = (list) => {
    let list2 = [];
	let maxLength = [];
	for(let i = 0; i < list.length; i += 1) {
		for(let j = 0; j < list[i].length; j += 1) {
			if (i == 0 ) {
				maxLength[j] = byteLength(list[i][j]);
			} else {
				if (maxLength[j] < byteLength(list[i][j])) {
					maxLength[j] = byteLength(list[i][j]);
				}
			}
		}
	}
	for(let i = 0; i < list.length; i += 1) {
	    let col = [];
		for(let j = 0; j < list[i].length; j += 1) {
            const cStr = fillStr(list[i][j], maxLength[j]);
			col.push(cStr);
		}
		list2.push(col);
	}
	return list2;
}

const fillStr = (str, len) => {
	const len1 = Math.floor((len - byteLength(str)) / 2);
	const len2 = Math.ceil((len - byteLength(str)) / 2);
	let s = '';
	for(let i = 0; i < len1; i += 1) {
		s += ' ';
	}
	s += str;
	for(let i = 0; i < len2; i += 1) {
		s += ' ';
	}
	return s;
}

const byteLength = (str) => {
    let b = 0;
    const len = str.length;
    if(len) {
        for(let i = 0; i < len; i ++) {
            const c = str.charCodeAt(i);
            if((c >= 1 && c <= 10000)) {
                b += 1;
            }else {
                b += 2;
            }
        }
        return b;
    } else {
        return 0;
    }
}

(function() {
    'use strict';
    // Your code here...
    GM_log('init');
    copyUserListBtn1();
    copyUserListBtn2();
    jQuery('#copy-user-list1').off("click").on("click", copyUserList);
    jQuery('#copy-user-list2').off("click").on("click", true,copyUserList);
})();