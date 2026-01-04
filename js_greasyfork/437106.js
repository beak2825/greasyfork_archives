// ==UserScript==
// @name         NUAA 南京航空航天大学（南航）教务处懒人自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  南航教务处懒人登录，懒得多点两下
// @author       You
// @match        http://aao-eas.nuaa.edu.cn/eams/login.action
// @match        https://authserver.nuaa.edu.cn/authserver/login?service=*
// @icon         https://www.google.com/s2/favicons?domain=nuaa.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437106/NUAA%20%E5%8D%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%8D%97%E8%88%AA%EF%BC%89%E6%95%99%E5%8A%A1%E5%A4%84%E6%87%92%E4%BA%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437106/NUAA%20%E5%8D%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%8D%97%E8%88%AA%EF%BC%89%E6%95%99%E5%8A%A1%E5%A4%84%E6%87%92%E4%BA%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    try{
        document.querySelector("#login2 > table > tbody > tr:nth-child(2) > td > a").click()
    }
    catch
    {
        //autofill
        setInterval(clickLogin,500)
    }

})();
//function autoFill(){
    //document.querySelector("#password").value=""
    //document.querySelector("#password").value=""
//}
function clickLogin(){
    if(document.querySelector("#password").value)
    {
        document.querySelector("#login_submit").click()
    }
}
