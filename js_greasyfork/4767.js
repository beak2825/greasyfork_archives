// ==UserScript==
// @name           UF Login
// @namespace      Tevi
// @description	   Auto logs into website with saved passwords
// @include        https://login.ufl.edu/idp/Authn/UserPassword
// @include        https://lss.at.ufl.edu/logout/
// @include        https://elearning2.courses.ufl.edu/portal/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version        1
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/4767/UF%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/4767/UF%20Login.meta.js
// ==/UserScript==
//alert(window.location.origin);
//var TargetLink = $("a:contains('Login')")
//alert(document.URL);
//alert(document.URL=="https://login.ufl.edu/idp/Authn/UserPassword");
if(document.URL=="https://login.ufl.edu/idp/Authn/UserPassword"){
    //alert('yes');
document.querySelectorAll(".submit")[0].click();
}
loginLink1 = document.getElementById("loginLink1");
//alert(loginLink1);
if(document.URL=="https://lss.at.ufl.edu/logout/"){
    window.location = "https://elearning2.courses.ufl.edu/";
}
if(window.location.href=="https://elearning2.courses.ufl.edu/portal"){
    //alert("yes");
    //alert(document.getElementById("loginLink1"));
}
