// ==UserScript==
// @name         网易邮箱净化-标签页
// @namespace    https://greasyfork.org/users/158180
// @version      0.4
// @description  净化网易系邮箱标签页的广告标签
// @author       Shiyunjin
// @match        http*://mail.163.com/js6/main.jsp*
// @match        http*://mail.126.com/js6/main.jsp*
// @match        http*://mail.yeah.net/js6/main.jsp*
// @match        http*://hw.mail.163.com/js6/main.jsp*
// @match        http*://hw.mail.126.com/js6/main.jsp*
// @match        http*://hw.mail.yeah.net/js6/main.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390895/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%87%80%E5%8C%96-%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/390895/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%87%80%E5%8C%96-%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==


(function() {
    window.$G.set = function(a,b,c){
        if(a=="multiTabConf"){
            var n = [];
            for(var d in b) {
                switch(b[d]["tabid"]){
                    case "t0":
                    case "t1":
                    case "t2":
                    case "t3":
                        n.push(b[d]);
                        break;
                    default:
                }
            }
            b=n;
        }
        this._conf[a] = c ? b: $.Object.isArray(b) ? $.Array.union(this._conf[a] || [], b) : $.Object.extend(this._conf[a], b)
    }

    window.$.Object.extend = function(a, b, c) {
        a = a || {},
            b = b || {};
        for (var d in b){
            if(d=="set" && a[d]) return;
            "prototype" !== d && (c && a.hasOwnProperty(d) || (a[d] = b[d]));
        }
        try {
            c || b.toString === b.constructor.prototype.toString || (a.toString = b.toString)
        } catch(e) {}
        return a
    }

    $("a[title='点击关闭标签']").click();
})();