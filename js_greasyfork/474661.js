// ==UserScript==
// @name         V2EX.AT
// @namespace    http://tampermonkey.net/
// @version      0.1.6.1
// @description  快速查看@的回复
// @author       cinhoo
// @license      GPL-3.0 License
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @require      https://unpkg.com/axios@1.4.0/dist/axios.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474661/V2EXAT.user.js
// @updateURL https://update.greasyfork.org/scripts/474661/V2EXAT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 重写回复函数,给@后面增加楼层数
    replyOne = function (username) {
        setReplyBoxSticky();
        const replyContent = document.getElementById("reply_content");
        const oldContent = replyContent.value;
        const prefix = `@${username} #${event.target.offsetParent.querySelector(".no").textContent} `;
        let newContent = '';
        if (oldContent.length > 0) {
            if (oldContent != prefix) {
                newContent = `${oldContent}\n${prefix}`;
            }
        } else {
            newContent = prefix;
        }
        replyContent.focus();
        replyContent.value = newContent;
        moveEnd(replyContent);
    }

    GM_addStyle(`
#myDialog {
  display: none;
  position: absolute;
  min-width: 30vw;
  max-width: 60vw;
  padding: 20px;
  background-color: var(--box-background-color);
  border: 1px solid var(--box-border-color);
  box-shadow: 2px 2px 1px var(--box-border-color);
}
#myDialog strong a,
#myDialog .thank {
  font-size: 14px;
}
`);

    let myDialog = `<div id="myDialog"></div>`;
    document.body.insertAdjacentHTML("beforeend", myDialog);
    let dialog = document.querySelector("#myDialog");

    let closeDialogId;
    let closeDialog = (e) => {
        closeDialogId = setTimeout(() => {
            dialog.style.display = "none";
        }, 300);
    };

    let openDialog = (e, atMember, anchor, innerHTML) => {
        clearTimeout(closeDialogId);

        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;

        let layerX = e.layerX || e.clientX + scrollX;
        let layerY = e.layerY || e.clientX + scrollX;

        let atMemberRect = atMember.getBoundingClientRect();
        let offsetLeft = layerX - (atMemberRect.left + scrollX);
        let offsetTop = layerY - (atMemberRect.top + scrollY);
        let offsetRight = (atMemberRect.right + scrollX) - layerX;
        let offsetBottom = (atMemberRect.bottom + scrollY) - layerY;

        dialog.innerHTML = innerHTML;
        dialog.style.display = "block";
        let dialogRect = dialog.getBoundingClientRect();
        if (e.clientY >= dialogRect.height + 5) {
            dialog.style.left = `${e.pageX + offsetRight}px`;
            dialog.style.top = `${e.pageY - offsetTop - dialogRect.height - 5}px`;
        } else {
            dialog.style.left = `${e.pageX + offsetRight}px`;
            dialog.style.top = `${e.pageY + offsetBottom + 5}px`;
        }
        dialog.querySelector(".no").onclick = () => window.location.href = anchor;
    };

    dialog.onmouseenter = (e) => clearTimeout(closeDialogId);
    dialog.onmouseleave = (e) => closeDialog(e);

    let allCells = [];

    let linkReply = async (doc, atMembers, page) => {
        let cells = [...doc.querySelectorAll("div.cell[id^='r_']")].reverse();
        allCells.push(...cells.flatMap(cell => ({ page: page, cell: cell })));

        atMembers = atMembers.filter(atMember => {
            let cell;
            if (atMember.atNo) {
                cell = cells.find(cell => atMember.atNo == +cell.querySelector(".no").textContent && cell.querySelector("strong a").textContent == atMember.atMember.textContent);
            } else {
                cell = cells.find(cell => atMember.no > +cell.querySelector(".no").textContent && cell.querySelector("strong a").textContent == atMember.atMember.textContent);
            }
            if (!cell) return true;

            let anchor = atMember.page != page ? `?p=${page}#${cell.id}` : `#${cell.id}`;

            atMember.atMember.onmouseenter = (e) => openDialog(e, atMember.atMember, anchor, cell.innerHTML);
            atMember.atMember.onmouseleave = (e) => closeDialog(e);

            return false;
        });

        if (atMembers.length > 0) {
            if (page == 1) {
                atMembers.forEach(atMember => {
                    let item = allCells.find(item => {
                        return atMember.no > +item.cell.querySelector(".no").textContent && item.cell.querySelector("strong a").textContent == atMember.atMember.textContent
                    });
                    if (item) {
                        let anchor = atMember.page != item.page ? `?p=${item.page}#${item.cell.id}` : `#${item.cell.id}`;

                        atMember.atMember.onmouseenter = (e) => openDialog(e, atMember.atMember, anchor, item.cell.innerHTML);
                        atMember.atMember.onmouseleave = (e) => closeDialog(e);
                    }
                });

                allCells.length = 0;
            } else {
                let prevPage = doc.querySelector(`a[href^="?p=${page - 1}"]`);
                if (!prevPage) return;

                page = +prevPage.textContent;

                let resp = await axios.get(prevPage.href)
                let template = doc.createElement("template");
                template.innerHTML = resp.data;

                linkReply(template.content, atMembers, page);
            }
        }
    };

    let currentPage = document.querySelector("a.page_current");
    let page = currentPage && +currentPage.textContent || 1

    let cells = [...document.querySelectorAll("div.cell[id^='r_']")].reverse();
    let atMembers = cells.flatMap(cell => [...cell.querySelectorAll(".reply_content a")]
        .filter(atMember => atMember.getAttribute("href").startsWith("/member/"))
        .map(atMember => {
            let atNo = cell.textContent.match(new RegExp(`@${atMember.textContent} #(\\d+)`));
            return {
                atMember: atMember,
                atNo: atNo && +atNo[1],
                no: +cell.querySelector(".no").textContent,
                page: page
            };
        }));

    linkReply(document, atMembers, page);
})();