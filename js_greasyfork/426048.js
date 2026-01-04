// ==UserScript==
// @name         Spectrum Auto Login
// @name:zh-CN   Spectrum自动登录
// @name:zh-TW   Spectrum自动登录
// @name:id      Spectrum Log masuk automatik
// @name:ms      Spectrum Log masuk automatik
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @license      MIT
// @description  This code is designed to help users automatically log into the University of Malaya's SPeCTRUM system.
// @description:zh-CN  此代码是为了帮助用户自动登录马来亚大学的SPeCTRUM系统
// @description:zh-TW  此代码是为了帮助用户自动登录马来亚大学的SPeCTRUM系统
// @description:ms  Kod ini direka untuk membantu pengguna masuk ke sistem SPeCTRUM Universiti Malaya secara automatik.
// @description:id  Kod ini direka untuk membantu pengguna masuk ke sistem SPeCTRUM Universiti Malaya secara automatik.
// @author       Koukotsukan Neo
// @match        https://sso.um.edu.my/cas/*
// @match        https://spectrum.um.edu.my
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/426048/Spectrum%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/426048/Spectrum%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    const curURL = window.location.href;
    const match = (...patterns) => patterns.some(p => curURL.includes(p));
    if (match("https://sso.um.edu.my/cas/loginAllType?service=https://spectrum.um.edu.my/login/index.php")){
        GM_deleteValue('method');
        GM_deleteValue('uname');
        GM_deleteValue("pwd");
        var z= document.createElement('a');
        z.setAttribute("href","javascript:void(0);");
        z.setAttribute("id","helper");
        z.innerText='Problems with Autofill?';
        document.querySelectorAll("div[class=\"form-group\"]")[0].appendChild(z);
        document.querySelector ("#helper").addEventListener("click", doEd, false);
        if (!document.querySelector("div[class='error']")){
            location.href="https://sso.um.edu.my/cas/loginAllType?service=https%3A%2F%2Fspectrum.um.edu.my%2Flogin%2Findex.php";
        }
    };
    if(match("https://sso.um.edu.my/cas/loginAllType?service=https%3A%2F%2Fspectrum.um.edu.my%2Flogin%2Findex.php")){
        $(document).ready(function(){
            var x=document.getElementById("domain");
            x.innerHTML="<select name=\"domain\" id=\"domain\"><option selected=\"\" value=\"@perdana.um.edu.my\">Student</option><option value=\"@um.edu.my\">Staff</option><option value=\"\">External</option></select>";
            var z= document.createElement('a');
            z.setAttribute("href","javascript:void(0);");
            z.setAttribute("id","helper");
            z.innerText='Problems with Autofill?';
            document.querySelectorAll("div[class=\"form-group\"]")[0].appendChild(z);
            document.querySelector ("#helper").addEventListener("click", doAnother, false);
            if (!GM_getValue('method')){
                $(document).ready(function(){
                    document.querySelector("button[type=submit]").click();
                });
            }else if (GM_getValue('method')== 1){
                $(document).ready(function(){
                    document.querySelector("input[name='uname']").value=GM_getValue('uname');
                    document.querySelector("input[name='password']").value=GM_getValue('pwd');
                    document.querySelector("button[type=submit]").click();
                });
            }
        });
    }else if (match("https://spectrum.um.edu.my")) {
        document.querySelector("span.login").querySelector("a").click();
    }

    function doAnother(se){
        if(!GM_getValue('method')){
            var uname = prompt("Username", "");
            var password = prompt("Password","");
            GM_setValue('uname',uname);
            GM_setValue("pwd", password);
            GM_setValue("method","1");
            location.reload();
        }else if (GM_getValue('method') == 1){
            GM_deleteValue('method');
        };
        if (se == 1){
            location.reload();
        }else if (se == 0){

        }
    };
        function doEd(){
        if(!GM_getValue('method')){
            var uname = prompt("Username", "");
            var password = prompt("Password","");
            GM_setValue('uname',uname);
            GM_setValue("pwd", password);
            GM_setValue("method","1");
            location.href="https://sso.um.edu.my/cas/loginAllType?service=https%3A%2F%2Fspectrum.um.edu.my%2Flogin%2Findex.php";
        }else if (GM_getValue('method') == 1){
            GM_deleteValue('method');
            document.querySelector("button[type=submit]").click();
        };
    };
}
)();