// ==UserScript==
// @name               SUP 網上教科書預訂：匯出書單
// @description        增加一顆用於匯出網上教科書預訂書單的按鈕。
// @icon               https://wsrv.nl/?url=https://tb.supretail.com.hk/web/images/icon/Icon-72@2x.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://tb.supretail.com.hk/web/order.html
// @run-at             document-end
// @grant              GM.registerMenuCommand
// @grant              GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/498950/SUP%20%E7%B6%B2%E4%B8%8A%E6%95%99%E7%A7%91%E6%9B%B8%E9%A0%90%E8%A8%82%EF%BC%9A%E5%8C%AF%E5%87%BA%E6%9B%B8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/498950/SUP%20%E7%B6%B2%E4%B8%8A%E6%95%99%E7%A7%91%E6%9B%B8%E9%A0%90%E8%A8%82%EF%BC%9A%E5%8C%AF%E5%87%BA%E6%9B%B8%E5%96%AE.meta.js
// ==/UserScript==

GM.registerMenuCommand("匯出書單", () =>
{
    setTimeout(async () =>
    {
        const response = await fetch("https://tb.supretail.com.hk/orderform_checkout", { method: "POST" });

        const booklist = (await response.json()).content.order_template_list
            .map(({ booklist_sequence, book, book_name, list_price, net_price }) => `${booklist_sequence}\t${book}\t${book_name}\t${list_price}\t${net_price}`)
            .join("\n");

        GM.setClipboard(booklist, "text/plain");
        alert("已匯出書單到剪貼簿。");
    }, 0);
});
