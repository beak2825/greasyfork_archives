// ==UserScript==
// @name         移除访问记录
// @version      0.7.2
// @include      https://www.mcbbs.net/home.php?mod=space&do=friend&view=trace*
// @include      https://www.mcbbs.net/home.php?mod=space&uid=*&do=friend&view=trace&page=*
// @author       xmdhs
// @description  移除访问记录。
// @namespace    xmdhs
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/idb-keyval/6.1.0/umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/445945/%E7%A7%BB%E9%99%A4%E8%AE%BF%E9%97%AE%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445945/%E7%A7%BB%E9%99%A4%E8%AE%BF%E9%97%AE%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
(async function () {
    const l = document.querySelectorAll("ul.buddy h4 > a")
    const customStore = idbKeyval.createStore('removeview-db-name', 'removeview-store-name');

    for (const v of l) {
        const u = new URL(v.href)
        const uid = u.searchParams.get("uid")
        if (!uid) continue;
        const vv = await idbKeyval.get(uid, customStore)
        if (vv == "1") continue;
        try {
            const r = await fetch(`https://www.mcbbs.net/home.php?mod=space&uid=${uid}&do=index&additional=removevlog`)
            const t = await r.text()
            if (t.includes("的隐私设置，您不能访问当前内容")) {
                await idbKeyval.set(uid, "1", customStore)
                continue
            }
            console.log(uid + " success")
        } catch (e) {
            console.log(e)
        }
    }

})();

