var username = ""
var username2 = ""
var password = ""
var password2 = ""
var password3 = ""
var password4 = ""
var email = "";
var email2 = "";
// ==UserScript==
// @name         Auto-login McMaster Account
// @namespace    https://greasyfork.org/en/scripts/403133
// @version      1.6
// @description  Auto-login to McMaster Websites
// @author       Gavinnn Zhang 北稱
// @include      https://avenue.mcmaster.ca/?target=*
// @include      https://avenue.mcmaster.ca/?sessionExpired=*target=*
// @include      https://www.oscarplusmcmaster.ca/notLoggedIn*
// @match        https://www.childsmath.ca/childsa/forms/main_login.*
// @include      https://login.echo360.ca/login?*
// @include      https://login.pearson.com/*
// @include      https://epprd.mcmaster.ca/psp/prepprd/?cmd=login*
// @match        https://loncapa.mcmaster.ca/adm/menu
// @match        https://app.crowdmark.com/sign-in
// @match        https://avenue.mcmaster.ca/
// @match        https://www.saplinglearning.ca/ibiscms/login/
// @include      https://cap.mcmaster.ca/mcauth/login.jsp?*
// @include      https://sso.mcmaster.ca/idp/profile/SAML2/Redirect/SSO?execution=*
// @include      https://sso.mcmaster.ca/idp/profile/SAML2/Redirect/SSO;jsessionid=*
// @include      https://sso.mcmaster.ca/shibboleth-idp/profile/SAML2/Redirect/SSO?execution=*
// @match        http://pebblepad.mcmaster.ca/
// @include      https://libraryssl.lib.mcmaster.ca/libaccess/login.php*
// @include      https://login.teksavvy.com/*
// @include      https://app.pebblepad.ca/login/Login/ChooseInstall*
// @match        https://avenue.mcmaster.ca/index.html
// @grant        none
// @update 1.3   Bug fixed, add support for Pearson Mastering
// @update 1.4   Add altert for which part is running
// @update 1.4   Adapt newly updated avenue website
// @update 1.5   Add support for Sapling Learning
// @update 1.6   Add support for Pebble Pad
// @update 1.6   Add support for Mac Library Databases
// @update 1.6   Optimize code and improve stability
// @update 1.6   Add Teksevvy
// @downloadURL https://update.greasyfork.org/scripts/403133/Auto-login%20McMaster%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/403133/Auto-login%20McMaster%20Account.meta.js
// ==/UserScript==

//               alert ("a");

(function() {
    'use strict';
    var url=window.location.href;

    //Click login btn to enter login page
    // test which web is opened and click login - a2l-1
    if(url.indexOf("https://avenue.mcmaster.ca/?target=") > -1)
    {document.getElementById("login_button").click();
     console.log("a2l-1");}

    // test which web is opened and click login - a2l-2
    if(url.indexOf("https://avenue.mcmaster.ca/?sessionExpired=") > -1)
    {document.getElementById("login_button").click();
     console.log("a2l-2");}

    // test which web is opened and click login - a2l-new-version
    if(url.indexOf("https://avenue.mcmaster.ca/") > -1)
    {document.getElementById("login_button").click();
     console.log("a2l-new-version");}

    // test which web is opened and click login - a2l-new-version2
    if(url.indexOf("https://avenue.mcmaster.ca/index.html") > -1)
    {document.getElementById("login_button").click();
     console.log("a2l-new-version2");}

    // test which web is opened and click login - childmath
    if(url.indexOf("https://www.childsmath.ca/childsa/forms/main_login.php?") > -1)
    {document.getElementById("submit").click();
     console.log("childmath");}

    // test which web is opened and click login - Pebble Pad Choose
    if(url.indexOf("https://app.pebblepad.ca/login/Login/ChooseInstall") > -1)
    {document.getElementById("organisationpicker").value = "mcmaster";
     document.getElementsByClassName("loginbutton loginorgbutton")[0].click();
     console.log("Pebble Pad Choose");}





    var run = 0
    // Fill form and click login
    // test which web is opened and click login - echo 360
    if(url.indexOf("https://login.echo360.ca/login?") > -1 )
    {document.getElementById("email").value=email;
     document.getElementById("submitBtn").click();
     console.log("echo 360");}

    // test which web is opened and click login - Mosaic
    if(url.indexOf("https://epprd.mcmaster.ca/psp/prepprd/?cmd=login") > -1 && run == 0)
    {document.getElementById("userid").value=username;
     document.getElementById("pwd").value=password;
     document.getElementsByClassName("ps-button")[0].click();
     console.log("Mosaic");
     run = 1}

    // test which web is opened and click login - LON-CAPA
    if(url.indexOf("https://loncapa.mcmaster.ca/adm/menu") > -1 && run == 0)
    {document.getElementById("uname").value=username;
     var intput1 = document.getElementsByTagName('input');
     for(var i=0;i<intput1.length;i++)
     {if(intput1[i].type.toUpperCase()=='PASSWORD')
     {intput1[i].value = password;}
     }

     var intput2 = document.getElementsByTagName('input');
     for(var j=0;j<intput2.length;j++)
     {if(intput2[j].type.toUpperCase()=='SUBMIT')
     {intput2[j].click();}}
     console.log("LON-CAPA");
     run = 1}

    // test which web is opened and click login - OSCAR plus
    if(url.indexOf("https://www.oscarplusmcmaster.ca/notLoggedIn") > -1 && run == 0)
    {var intput3 = document.getElementsByTagName('a');
     for(var k=0;k<intput3.length;k++)
     {
         if(intput3[k].text =='Student/Alumni Login')
         {intput3[k].click();}
     }
     console.log("OSCAR plus");
     run = 1}

    // test which web is opened and click login - Crowdmark
    if(url.indexOf("https://app.crowdmark.com/sign-in") > -1 && run == 0)
    {document.getElementById("user_email").value=email;
     document.getElementById("user_password").value=password4;
     document.getElementsByClassName("button u-right")[0].click()
     console.log("Crowdmark");
     run = 1}

    // test which web is opened and click login - Pearson Master
    if(url.indexOf("https://login.pearson.com") > -1 && run == 0)
    {document.getElementById("username").value=username2;
     document.getElementById("password").value=password2;
     document.getElementsByClassName("pe-btn__cta--btn_xlarge full-width ng-binding ng-scope")[0].click();
     console.log("Pearson Master");
     run = 1}

    // test which web is opened and click login - Sapling Learning
    if(url.indexOf("https://www.saplinglearning.ca/ibiscms/login/") > -1 && run == 0)
    {document.getElementById("username").value=email;
     document.getElementById("password").value=password3;
     document.getElementsByClassName("button primary")[0].click();
     console.log("Sapling Learning");
     run = 1}

    // test which web is opened and click login - Pebble Pad
    if(url.indexOf("http://pebblepad.mcmaster.ca/") > -1 && run == 0)
    {document.getElementsByClassName("btn btn-default navbar-btn pull-right")[2].click();
     console.log("Pebble Pad");
     run = 1}

    // test which web is opened and click login - Mac Library Databases
    if(url.indexOf("https://libraryssl.lib.mcmaster.ca/libaccess/login.php") > -1 && run == 0)
    {document.getElementById("user").value=username;
     document.getElementById("pass").value=password;
     document.getElementsByClassName("btn btn-primary")[0].click();
     console.log("Mac Library Databases");
     run = 1}

    // test which web is opened and click login - Teksevvy
    if(url.indexOf("https://login.teksavvy.com/") > -1 && run == 0)
    {document.getElementById("inputEmail").value=email2;
     document.getElementById("inputPassword").value=password2;
     document.getElementsByClassName("card__body__button card__body__button--sign-in")[0].click();
     console.log("Teksevvy");
     run = 1}



    // General entry for mac login page
    // BUGGGGGGGG HERE with one entry - not affect performance, fix it later
    // auto fill and login entry 1
    if(url.indexOf("https://cap.mcmaster.ca/mcauth/login.jsp?") > -1)
    {
        if (username !== undefined)
        {
            document.getElementById("user_id").value = username;
            document.getElementById("pin").value = password;
            document.getElementsByClassName("btn btn-primary btn-arrow")[0].click();
            console.log("auto fill and login entry 1");
        }
    }

    // auto fill and login entry 2
    if(url.indexOf("https://sso.mcmaster.ca/idp/profile/SAML2/Redirect/SSO?execution=") > -1 )
    {
        if (username !== undefined)
        {
            document.getElementById("username").value = username;
            document.getElementById("password").value = password;
            document.getElementsByClassName("btn btn-primary btn-arrow")[0].click();
            console.log("auto fill and login entry 2");
        }
    }

    // auto fill and login entry 3
    if(url.indexOf("https://sso.mcmaster.ca/idp/profile/SAML2/Redirect/SSO;jsessionid=") > -1 )
    {
        if (username !== undefined)
        {
            document.getElementById("username").value = username;
            document.getElementById("password").value = password;
            document.getElementsByClassName("btn btn-primary btn-arrow")[0].click();
            console.log("auto fill and login entry 3");
        }
    }

    // auto fill and login entry 4
    if(url.indexOf("https://sso.mcmaster.ca/shibboleth-idp/profile/SAML2/Redirect/SSO?execution=") > -1 )
    {
        if (username !== undefined)
        {
            document.getElementById("username").value = username;
            document.getElementById("password").value = password;
            document.getElementsByClassName("btn btn-primary btn-arrow")[0].click();
            console.log("auto fill and login entry 4");
        }
    }
})();