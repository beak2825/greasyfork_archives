// ==UserScript==
// @name         Bilibili BV2AV
// @namespace    https://konge.pw/
// @supportURL   https://github.com/zkonge/bv2av/issues
// @homepage     https://github.com/zkonge/bv2av
// @version      0.1.2
// @description  使用 AV 号替换 Bilibili 视频地址中的 BV 号。直接解码 BV，无刷新，保留所有URL原始参数（分P正常工作）。
// @author       zkonge
// @include      *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398571/Bilibili%20BV2AV.user.js
// @updateURL https://update.greasyfork.org/scripts/398571/Bilibili%20BV2AV.meta.js
// ==/UserScript==

(function () {
    // From https://github.com/Coxxs/bvid

    let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
    let tr = {}
    for (let i = 0; i < 58; i++) {
        tr[table[i]] = i
    }
    let s = [11, 10, 3, 8, 4, 6, 2, 9, 5, 7]
    let xor = BigInt('177451812')
    let add = BigInt('100618342136696320')

    function decode(x) {
        let r = BigInt(0)
        for (let i = 0; i < 10; i++) {
            r += BigInt(tr[x[s[i]]]) * (BigInt(58) ** BigInt(i))
        }
        r = ((r - add) ^ xor)
        return r > 0 && r < 1e9 ? r : null
    }

    const regex = /video\/(?<BV>[Bb][Vv][^\?]*)\?*/;

    let path = location.toString();
    const check = regex.exec(path);
    if (check) {
        const AV = decode(check.groups.BV);
        path = path.replace(check.groups.BV, 'av' + AV);
        history.replaceState(history.state, '', path);
    }
})();
