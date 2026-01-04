// ==UserScript==
// @name         洛谷题目难度屏蔽
// @namespace    https://www.luogu.com.cn/user/249294
// @version      2.3.1
// @description  用于洛谷题目难度屏蔽
// @author       Gensokyo_Alice
// @match        *://www.luogu.com.cn/problem*
// @match        *://www.luogu.com.cn/training*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419043/%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%9A%BE%E5%BA%A6%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/419043/%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%9A%BE%E5%BA%A6%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function() {setTimeout( function () {
        function updata() {
            console.log('pushState');
            //移除难度tag
            var lst = document.querySelector(".row-wrap");
            //console.log(lst)
            if (lst != null) {
                var elementList = lst.querySelectorAll(".row");
                elementList.forEach(function(element) {
                    var domList = element.querySelectorAll(".lfe-caption")
                    //console.log(element);
                    var len = domList.length;
                    domList[len-1].style.display = "none"
                    //console.log(dom)
                });
            }
            // 移除"难度"
            var dif = document.querySelector(".header-wrap");
            if (dif != null) {
                var diff = dif.querySelector(".difficulty");
                dif = diff.querySelector(".lfe-caption");
                //console.log(dif);
                dif.style.display = "none";
            }
            // 移除 "显示标签"
            var tag = document.querySelector(".header-wrap");
            //console.log(tag);
            if (tag != null) {
                var tag2 = document.querySelector(".tag");
                //console.log(tag2);
                tag2.querySelector("a").style.display = "none";
            }
            // other...
        }
        updata(); var flag = 0;
        var _wr = function(type) {
            var orig = history[type];
            return function() {
                var rv = orig.apply(this, arguments);
                var e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');
        window.addEventListener('pushState', function(e) {
            setTimeout(updata, 300); // 如果依旧能看到难度tag，请尝试修改后面的数字，单位：毫秒。
        });
        window.addEventListener('popstate', function(e) {
            setTimeout(updata, 250);
            //console.log("kk");
        });
        window.addEventListemner('replaceState', function(e) {
            setTimeout(updata, 250);
            console.log("cz");
        });
    }, 500)})
})();