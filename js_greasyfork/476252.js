// ==UserScript==
// @name         via浏览器本地密码填充
// @namespace    https://viayoo.com/
// @version      0.1.1
// @description  让via浏览器有一个自动填充的功能
// @author       佚名
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476252/via%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%AC%E5%9C%B0%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/476252/via%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%AC%E5%9C%B0%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function () {

    var ask = true; 
    /*true改为false默认记住不询问*/

    var counter = 0;

    whenReady(go);

    function go() {

        
        if (!document.querySelector("input[type=password]")) {
            if (counter > 10) return;
            counter++; /*删掉此行保持函数始终活跃，应对一些登录界面不在新页面重新加载的网站，不能使用的情况下可以试一试*/
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
                if (confirm("是否需要记住本站密码？")) {
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
        
        setTimeout(function () { 
            if ((name.value != localStorage.xxM_name) || (pass.value != localStorage.xxM_pass)) {
                name.value = localStorage.xxM_name;
                pass.value = localStorage.xxM_pass;
            }
        }, 500);
       

    }

function whenReady(func){if(document.readyState==="interactive"||document.readyState==="complete"){func();}else{document.addEventListener("DOMContentLoaded",func);}}

})();