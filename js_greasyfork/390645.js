// ==UserScript==
// @name         短会答辅助
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  编辑界面辅助工具
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        *
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/390645/%E7%9F%AD%E4%BC%9A%E7%AD%94%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/390645/%E7%9F%AD%E4%BC%9A%E7%AD%94%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

function getUtdata(){
    let v = {
        ea: [],
        ma: []
    };
    let j = {};
    let d = +new Date;
    let g = {};
    let w = +new Date;
    let p = false;
    let l = 0;

    function s(t) {
        for (var e = [], n = {}, o = w % 100, i = 0, u = t.length; u > i; i++) {
            var r = t.charCodeAt(i) ^ o;
            e.push(r),
            n[r] || (n[r] = []),
                n[r].push(i)
        }
        return e
    }

    function u() {
        var t = v.ma.length;
        if (t > 0) {
            var e = v.ma[t - 1];
            return e[e.length - 1]
        }
    }

    function r() {
        let t = v.ea.concat();
        let e = t.length;
        return e > 10 && (t = t.splice(e - 10, 10)),
            t.join(",")
    }

    function _getUtdata() {
        jQuery.each(v.ea, function (t, e) {
            v.ea[t] = j[e]
        });
        var t = [u(), r(), (new Date).getTime() - d, [screen.width, screen.height].join(",")].join("	");
        return g.c = s(t) + "," + w + l,
            p = true,
            g
    }
    return _getUtdata().c;
}

getUtdata();


