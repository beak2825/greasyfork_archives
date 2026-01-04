// ==UserScript==
// @name         sylu教学网密码填充
// @namespace    http://tampermonkey.net/
// @version      1.33
// @description  auto fill password
// @author       xiaosheng
// @include      *
// @grant        none
// @run-at        document-body 
// @downloadURL https://update.greasyfork.org/scripts/433713/sylu%E6%95%99%E5%AD%A6%E7%BD%91%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/433713/sylu%E6%95%99%E5%AD%A6%E7%BD%91%E5%AF%86%E7%A0%81%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    console.log("auto fill code is running------------")
    if(location.href.includes("xtgl/login_slogin")){
    try {
    var enPassword = "18641553630Ll"
    var account = "1802050116"
    $("#yhm").val(account);
    $("#mm").val(enPassword);
    setTimeout(function(){
    $(".btn").click()
    console.log("success")
    alert("success")
    }, 1000);
} catch (error){
alert(error.message);
}}
})();
