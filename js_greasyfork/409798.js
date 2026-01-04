'use strict';

// ==UserScript==
// @name              Bilibili UP主透明黑名单
// @namespace         http://space.bilibili.com/13127303/transparentBlacklist
// @version           1.0.0
// @description       在照顾到狗屎们自尊心的前提下屏蔽狗屎们的干扰
// @author            阿布相机手册
// @supportURL        http://space.bilibili.com/13127303
// @match             http*://*.bilibili.com/*
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/409798/Bilibili%20UP%E4%B8%BB%E9%80%8F%E6%98%8E%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/409798/Bilibili%20UP%E4%B8%BB%E9%80%8F%E6%98%8E%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

let pageStyles = 'div.list-item.blacklisted > div.con > div.user,div.list-item.blacklisted > div.con > p.text'
+',div.reply-item.blacklisted'
+'{ opacity: 0.1 !important; }';

let $ = jQuery;
let tbl = (window.localStorage.tbl || '').split(';');

function inBlacklist(id) {
	return tbl.includes(id);
}

let blackListActions = [
    //[查找的容器，容器内对比id的元素，元素进一步的操作]
    ['div.comment-list div.list-item','div.user a.name', (e) => $(e).data('usercard-mid').toString()],
    ['div.comment-list div.reply-item','a.reply-face', (e) => $(e).data('usercard-mid').toString()],
];
function hideBlacklists() {

    blackListActions.forEach((action)=>{
        let [container,idItem,idProcessor] = action;
        $(container).each((i,c)=>{
            let item = idItem ? $(idItem,c) : $(c);
            if(item && item.length > 0){
                let id = idProcessor(item.get(0));
                if(inBlacklist(id)){
                    $(c).addClass('blacklisted');
                }
            }
        })
    })
}

function unique(a) {
	return a.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});
}

let waitJquery = setInterval(function (_) {
	if ($) {
		clearInterval(waitJquery);

        //install styles
		let styleElem = $('<style>');
		styleElem.text(pageStyles);
		$(document.body).append(styleElem);
		$(document.body).addClass('jquery-ready');

		hideBlacklists();
        setInterval(function (_) {
            hideBlacklists()
		}, 1000);

        //register blacklist
		$(document.body).on('click', 'a.name', function (e) {
			if (e.shiftKey) {
				let id = $(e.currentTarget).data('usercard-mid').toString();

				if (id && confirm('\u6DFB\u52A0 ' + id + ' \u5230\u9ED1\u540D\u5355\uFF1F')) {
					e.preventDefault();
					tbl.push(id);
					window.localStorage.tbl = unique(tbl).join(';');
					hideBlacklists();
				}
			}
		});
	}
}, 1000);