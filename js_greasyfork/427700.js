// ==UserScript==
// @name         Keylol置顶回复和通知增强
// @namespace    https://greasyfork.org/users/34380
// @version      20231210
// @description  Keylol 置顶热门回复，预览通知回复和点评内容。
// @match        https://keylol.com/t*
// @match        https://keylol.com/forum.php?mod=viewthread*
// @match        https://keylol.com/home.php?mod=space&do=notice*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427700/Keylol%E7%BD%AE%E9%A1%B6%E5%9B%9E%E5%A4%8D%E5%92%8C%E9%80%9A%E7%9F%A5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/427700/Keylol%E7%BD%AE%E9%A1%B6%E5%9B%9E%E5%A4%8D%E5%92%8C%E9%80%9A%E7%9F%A5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

	// 关闭功能true改false
	var isStickyOn = true;
	var isNoticeOn = true;
    var loc = window.location.href;

    if (isNoticeOn && loc.match(/https:\/\/keylol\.com\/home\.php\?mod=space&do=notice/)) {
        var all_lits = document.querySelectorAll('.lit');
        for (var lit of all_lits) {
            lit.parentNode.insertAdjacentHTML('afterend', `<details><summary data-href="${lit.href}" data-load="false">查看详情</summary></details>`);
			if ( lit.parentNode.style.fontWeight=='bold' ) {
				lit.parentNode.parentNode.querySelector('details').setAttribute('open','');
				updateDetail(lit.parentNode.parentNode.querySelector('details > summary'));
			}
        }

        // for if size bond updateDetail
        document.querySelector('.nts').addEventListener('click', function (e) {
            var tar = e.target;
            if (tar.nodeName == 'SUMMARY' && tar.getAttribute('data-load') == "false") {
                updateDetail(tar);
            }
        });

        function updateDetail(tar) {
            var href = tar.getAttribute('data-href');
            var ids = href.match(/pid=(\d+)&ptid=(\d+)/);
            fetch(href).then(res => res.text()).then(text => {
                var post = (new DOMParser()).parseFromString(text, 'text/html').querySelector(`#post_${ids[1]} .pcb`);
				if (post){
					tar.insertAdjacentElement('afterend', post);
					post.querySelectorAll('img').forEach((node)=>{
						node.setAttribute('src',node.getAttribute('file'));
					});
				} else {
					tar.insertAdjacentHTML('afterend', `* 失效不能查看。`);
				}
                tar.setAttribute('data-load', true);
            })
        }

        document.querySelector('head').insertAdjacentHTML('beforeend',`<style>.nts .ratl img { height:24px;} .psth.xs1 { background-color:#76c6ea; } .cl > details { background-color: #ccc }.cl > details > summary { background-color: #76c6ea }</style>`);

    } else if (isStickyOn && document.querySelector('.steamcn_phr')){
        var phr = document.querySelector('.steamcn_phr');
        var links = phr.querySelectorAll('.phr_quick_jump.phr_blue');
        for (var i = 0; i < links.length; i++) {
            var href = links[i].href;
            var pid = href.replace(/.*pid=(\d+)/, "$1");
            var num = links[i].innerText.replace('来自 #', '');
            if (num > 30) {
                insertPost(href, pid);
            } else {
                var post = document.querySelector('#post_' + pid);
                phr.parentNode.insertAdjacentElement('afterend', post);
            }
        }

        function insertPost(link, pid) {
            fetch(link).then(res => res.text()).then(text => {
                var post = (new DOMParser()).parseFromString(text, 'text/html').querySelector('#post_' + pid);
                phr.parentNode.insertAdjacentElement('afterend', post);
            })
        }
    }
})();