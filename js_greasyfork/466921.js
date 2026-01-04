// ==UserScript==
// @name         记住账号密码(全网通用完美版)【来自APP版神器提取】
// @version      0.2
// @description  通用
// @match        *://*/*
// @grant        none
// @namespace    none
// @downloadURL https://update.greasyfork.org/scripts/466921/%E8%AE%B0%E4%BD%8F%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%28%E5%85%A8%E7%BD%91%E9%80%9A%E7%94%A8%E5%AE%8C%E7%BE%8E%E7%89%88%29%E3%80%90%E6%9D%A5%E8%87%AAAPP%E7%89%88%E7%A5%9E%E5%99%A8%E6%8F%90%E5%8F%96%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/466921/%E8%AE%B0%E4%BD%8F%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%28%E5%85%A8%E7%BD%91%E9%80%9A%E7%94%A8%E5%AE%8C%E7%BE%8E%E7%89%88%29%E3%80%90%E6%9D%A5%E8%87%AAAPP%E7%89%88%E7%A5%9E%E5%99%A8%E6%8F%90%E5%8F%96%E3%80%91.meta.js
// ==/UserScript==

(function () {
    var ask = false; /*true改为false默认记住不询问*/
    var counter = 0;
    whenReady(go);

    function go() {
        if (!document.querySelector("input[type=password]")) {
            if (counter > 10) return;
            counter++;/*删掉此行保持函数始终活跃，应对一些登录界面不在新页面重新加载的网站，不能使用的情况下可以试一试*/
            setTimeout(go, 100);
            return;
        }

        var allInput = document.querySelectorAll("input");
        var allShownInput = [];
        var name;
        var pass;
        for (var i = 0; i < allInput.length; i++) {
            if (allInput[i].offsetWidth != 0) {
                if (allInput[i].hasAttribute("type")) {
                    if ((allInput[i].getAttribute("type") == "password") || (allInput[i].getAttribute("type") == "text")) allShownInput.push(allInput[i]);
                } else {
                    allShownInput.push(allInput[i]);
                }
            }
        }
        for (i = 1; i < allShownInput.length; i++) {
            if (allShownInput[i].type == "password") {
                pass = allShownInput[i];
                name = allShownInput[i - 1];
            }
        }
        if ((!pass) || (!name)) {
            if (counter > 20) return;
            counter++;
            setTimeout(go, 200);
            return;
        }

        if (ask) {
            if (!localStorage.xxM_ifrm) {
                if (confirm("记住本站密码吗？")) { /*这里可以更改询问语句*/
                    localStorage.setItem("xxM_ifrm", "true");
                    localStorage.xxM_ifrm = "true";
                } else {
                    localStorage.setItem("xxM_ifrm", "false");
                    return;
                }
            }
            if (localStorage.xxM_ifrm == "false") {
                return;
            }
        }

        if (!localStorage.xxM_name) {
            localStorage.setItem("xxM_name", "");
            localStorage.setItem("xxM_pass", "");
        }
        name.value = localStorage.xxM_name;
        pass.value = localStorage.xxM_pass;
        name.addEventListener("input", function () {
            localStorage.xxM_name = name.value;
        });
        pass.addEventListener("input", function () {
            localStorage.xxM_pass = pass.value;
        });

/*此段是半秒后检查一遍，如影响使用，可以删除*/
        setTimeout(function () { 
            if ((name.value != localStorage.xxM_name) || (pass.value != localStorage.xxM_pass)) {
                name.value = localStorage.xxM_name;
                pass.value = localStorage.xxM_pass;
            }
        }, 500);/*到这里*/
    }

    function whenReady(func){
      if(document.readyState==="interactive"||document.readyState==="complete"){
          func();
      }else{
          document.addEventListener("DOMContentLoaded",func);
      }
    }
})();
