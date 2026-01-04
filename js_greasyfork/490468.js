// ==UserScript==
// @name         ROBLOX 2016 Sign Up Page (Continue) V2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Test Description 
// @author       You
// @match        http://www.roblox.com
// @match        https://www.roblox.com
// @match        http://www.roblox.com/?returnUrl*
// @match        http://www.roblox.com/?ReturnUrl*
// @match        https://www.roblox.com/?returnUrl*
// @match        https://www.roblox.com/?ReturnUrl*
// @match        http://www.roblox.com/
// @match        http://www.roblox.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490468/ROBLOX%202016%20Sign%20Up%20Page%20%28Continue%29%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/490468/ROBLOX%202016%20Sign%20Up%20Page%20%28Continue%29%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';


document.title = "ROBLOX.com"
document.logo - "https://web.archive.org/web/20160503151052/http://images.rbxcdn.com/e870a0b9bcd987fbe7f730c8002f8faa.png"
document.querySelector("#signup-username").setAttribute("placeholder", "Username (length 3-20, _ is allowed)");
document.querySelector("#signup-password").setAttribute("placeholder", "Password (minimum length 8)");
document.querySelector("#action-bar-container").id = "navbar"
const navbar = document.querySelector("#navbar")
navbar.innerHTML = [ `<div id="navbar" class="navbar navbar-landing navbar-fixed-top" role="navigation" style="background-color: rgba(0, 0, 0, 0.35);">
    <div class="container">
        <div class="row">
            <div class="navbar-header col-md-6">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#LandingNavbar">
                    Log In
                </button>
                <div class="navbar-brand hidden-xs"><img alt="Roblox Logo" class="robloxLogo" src="https://web.archive.org/web/20160503151052im_/http://images.rbxcdn.com/e870a0b9bcd987fbe7f730c8002f8faa.png"></div>
                <ul id="TopLeftNavLinks" class="nav navbar-nav">
                    <li id="PlayLink" class="pull-left"><a href="#RollerContainer" onclick="return scrollTo(1, '#RollerContainer');">Play</a></li>
                    <li id="AboutLink" class="pull-left"><a href="#WhatsRobloxContainer" onclick="return scrollTo(2, '#WhatsRobloxContainer');">About</a></li>
                    <li id="PlatformLink" class="pull-left"><a href="#RobloxDeviceText" onclick="return scrollTo(3, '#RobloxDeviceText');">Platforms</a></li>
                    <li id="magic-line" style="left: 41px; width: 61px;"></li>
                </ul>
            </div>


<div class="collapse navbar-collapse col-sm-6 ng-scope" id="LandingNavbar" ng-modules="roblox.formEvents">
    <form name="loginForm" action="https://www.roblox.com/login" id="LogInForm" class="navbar-form form-inline navbar-right ng-pristine ng-valid" method="post" role="form" rbx-form-context="" context="RollerCoaster" novalidate="">
        <div class="form-group" id="LoginUsernameParent">
            <input id="LoginUsername" type="text" placeholder="Username" class="form-control" name="username" rbx-form-interaction="">
        </div>
        <div class="form-group" id="LoginPasswordParent">
            <input id="LoginPassword" type="password" placeholder="Password" class="form-control" name="password" rbx-form-interaction="">
        </div>
        <div class="form-group">
            <input type="submit" id="LoginButton" class="form-control" value="Log In" rbx-form-interaction="" name="submitLogin">
        </div>
        <a id="HeaderForgotPassword" class="navbar-link" href="https://www.roblox.com/login/forgot-password-or-username">Forgot Username/Password?</a>
        <input id="ReturnUrl" name="ReturnUrl" type="hidden" value="">
    </form>
</div>
        </div>
    </div>
</div>` ];
})();