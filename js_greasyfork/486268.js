// ==UserScript==
// @name           屏蔽Chiphell特定用户主题、回帖、点评
// @namespace discuz
// @description 屏蔽Chiphell特定用户主题、回帖、点评。使用方式：在 “bls” 列表里加入想屏蔽的 ID, 用英文引号包围，英文逗号区隔。
// @description:zh Discuz 论坛在浏览器端屏蔽特定 ID 发言，用在其他论坛上可能需要修改。基于他人工作成果制作，上一版来自loewez与HamsterReserved。使用方式：在 “bls” 列表里加入想屏蔽的 ID, 用英文引号包围，英文逗号区隔。
// @include        https://*.chiphell.com/*
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/486268/%E5%B1%8F%E8%94%BDChiphell%E7%89%B9%E5%AE%9A%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A2%98%E3%80%81%E5%9B%9E%E5%B8%96%E3%80%81%E7%82%B9%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/486268/%E5%B1%8F%E8%94%BDChiphell%E7%89%B9%E5%AE%9A%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A2%98%E3%80%81%E5%9B%9E%E5%B8%96%E3%80%81%E7%82%B9%E8%AF%84.meta.js
// ==/UserScript==
var bls = new Array("kasaya", "timtu", "", "");

// 主题列表页
for (var x in bls) {
        bl = document.evaluate('//table/tbody[tr[1]/td[2]//cite/a[text()="' + bls[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (bl.snapshotLength) {
                for (var i = 0, c = ""; i < bl.snapshotLength; i++) {
            bl.snapshotItem(i).innerHTML = c;
                }
        }
}

// 内容页
for (var x in bls) {
        bl = document.evaluate('//table/tbody[tr[1]/td[1]//a[text()="' + bls[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (bl.snapshotLength) {
                for (var i = 0, c = ""; i < bl.snapshotLength; i++) {
                        c = bl.snapshotItem(i).firstChild.childNodes[3].textContent.replace(/\s*/g, "").slice(0, 2);
                        c = (Number(c) > 9) ? c + "楼" : c;
            bl.snapshotItem(i).innerHTML = c;
                }
        }
}

for (var x in bls) {
        bl = document.evaluate('//table/tbody[tr[1]/td[1]/div[1]//font[text()="' + bls[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (bl.snapshotLength) {
                for (var i = 0, c = ""; i < bl.snapshotLength; i++) {
                        c = String(bl.snapshotItem(i).firstChild.childNodes[3].textContent.match(/\d+#/)).replace(/#/, "楼");
                        bl.snapshotItem(i).innerHTML = c;
                }
        }
}

//点评
for (var x in bls) {
        bl = document.evaluate('//table/tbody/tr[1]/td[2]/div[2]/div[1]//a[text()="' + bls[x] + '"]/../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (bl.snapshotLength) {
                for (var i = 0; i < bl.snapshotLength; i++) {
                  bl.snapshotItem(i).innerHTML = "";
                }
        }
}