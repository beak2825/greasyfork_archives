// ==UserScript==
// @name         Bilibili评论区添加复制按钮
// @namespace    myitian.bili.comm-add-copy-btn
// @version      3.0
// @license      MIT
// @description  向评论-操作列表（评论右下的三个点打开的菜单）添加复制按钮
// @author       Myitian
// @match        *://*.bilibili.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/425851/Bilibili%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/425851/Bilibili%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

window.onmousedown = function addCopyBtn() {
    var href = window.location.href;
    var replies = document.querySelectorAll('.reply-wrap')
    //var oprLst = document.getElementsByClassName('opera-list'); // 获取目标元素
    if (replies.length != 0) {

        var reg_t = /^https:\/\/t\.bilibili\.com(((\/[^\d])|(\?|\#))\S*|\/)?$/;
        var reg_s = /^https:\/\/space\.bilibili\.com\S*$/;
        var reg_l = /^https:\/\/live\.bilibili\.com\S*$/;
        var noLinkCopy = (reg_t.test(href) || reg_s.test(href) || reg_l.test(href));

        for (var i = 0; i < replies.length; i++) {
            if (!replies[i].hasAttribute('data-changed')) { // 判断是否已被更改，若否，则继续

                let operaList = replies[i].querySelector(".opera-list");

                if (!noLinkCopy) { // 排除动态首页、个人空间、直播页

                    let clipBoardContent_Link = href + '#reply' + replies[i].getAttribute('data-id');

                    let copyLink = document.createElement('li');
                    copyLink.className = 'myitian-copybtn';
                    copyLink.setAttribute('data-copycontent', clipBoardContent_Link);
                    copyLink.onclick = function (event) { var obj = document.elementFromPoint(event.clientX, event.clientY); GM_setClipboard(obj.getAttribute('data-copycontent')); };
                    copyLink.innerText = '复制链接';
                    operaList.firstChild.appendChild(copyLink);
                }

                let authorName = replies[i].querySelector(".name");

                let clipBoardContent_Text = '';
                let clipBoardContent_TextWithAuthor = authorName.innerText + ' [UID:' + authorName.getAttribute('data-usercard-mid') + ']\n';

                let text = replies[i].querySelector(".text")
                if (text) { // 判断是否为子评论
                    text = text.childNodes;
                } else {
                    text = replies[i].querySelector(".text-con").childNodes;
                }

                for (var j = 0; j < text.length; j++) {
                    switch (text[j].nodeName) {
                        case '#text':
                            clipBoardContent_Text += text[j].textContent;
                            break;
                        case 'A':
                            var href_a = text[j].href;
                            var reg_av = /\/\/www\.bilibili\.com\/video\/av\d+\S*/i;
                            var reg_av2 = /av\d+/i;
                            var reg_bv = /\/\/www\.bilibili\.com\/video\/[Bb][Vv][1-9a-km-zA-HJ-NP-Z]{10}\S*/;
                            var reg_bv2 = /[Bb][Vv][1-9a-km-zA-HJ-NP-Z]{10}/;
                            var reg_cv = /\/\/www\.bilibili\.com\/read\/cv\d+\S*/i;
                            var reg_cv2 = /cv\d+/i;
                            var reg_b23av = /https:\/\/b23\.tv\/av\d+\S*/i;
                            var reg_b23bv = /https:\/\/b23\.tv\/[Bb][Vv][1-9a-km-zA-HJ-NP-Z]{10}\S*/;
                            var reg_b23 = /https:\/\/b23\.tv\/\S*/i;
                            var reg_note = /https:\/\/www\.bilibili\.com\/h5\/note-app\/view\?cvid=\d+(&[\S\s]+)?/i;
                            var reg_note2 = /cvid=\d+/i;
                            if (reg_av.test(href_a)) {
                                clipBoardContent_Text += reg_av2.exec(href_a)[0];//www.bilibili.com,av
                            } else if (reg_bv.test(href_a)) {
                                clipBoardContent_Text += reg_bv2.exec(href_a)[0];//www.bilibili.com,bv
                            } else if (reg_cv.test(href_a)) {
                                clipBoardContent_Text += reg_cv2.exec(href_a)[0];//www.bilibili.com,cv
                            } else if (reg_b23av.test(href_a)) {
                                clipBoardContent_Text += reg_av2.exec(href_a)[0];//b23.tv,av
                            } else if (reg_b23bv.test(href_a)) {
                                clipBoardContent_Text += reg_bv2.exec(href_a)[0];//b23.tv,bv
                            } else if (reg_b23.test(href_a)) {
                                clipBoardContent_Text += href_a.substring(8);//b23.tv,other
                            } else if (reg_note.test(href_a)) {
                                clipBoardContent_Text += '[笔记|cv' + reg_note2.exec(href_a)[0].split('=')[1] + ']';//note(cv)
                            } else {
                                clipBoardContent_Text += text[j].textContent;//other,@xxx
                            }
                            break;
                        case 'BR':
                            clipBoardContent_Text += '\n';//换行
                            break;
                        case 'IMG':
                            var alt = text[j].getAttribute('alt');//表情包带alt
                            if (alt != null) {
                                clipBoardContent_Text += alt;
                            }
                            break;
                        case 'SPAN':
                            clipBoardContent_Text += '[' + text[j].textContent + ']';//置顶
                            break;
                        default:
                            clipBoardContent_Text += text[j].textContent;
                            break;
                    }
                }
                clipBoardContent_TextWithAuthor += clipBoardContent_Text;

                var copyText = document.createElement('li');
                copyText.className = 'myitian-copybtn';
                copyText.setAttribute('data-copycontent', clipBoardContent_Text);
                copyText.onclick = function (event) { var obj = document.elementFromPoint(event.clientX, event.clientY); GM_setClipboard(obj.getAttribute('data-copycontent')); };
                copyText.innerText = '复制文字';
                operaList.firstChild.appendChild(copyText);

                var copyTextWithAuthor = document.createElement('li');
                copyTextWithAuthor.className = 'myitian-copybtn';
                copyTextWithAuthor.setAttribute('data-copycontent', clipBoardContent_TextWithAuthor);
                copyTextWithAuthor.onclick = function (event) { var obj = document.elementFromPoint(event.clientX, event.clientY); GM_setClipboard(obj.getAttribute('data-copycontent')); };
                copyTextWithAuthor.innerText = '复制(带作者)';
                operaList.firstChild.appendChild(copyTextWithAuthor);

                replies[i].setAttribute('data-changed', 'true');
            }
        }
    }
};