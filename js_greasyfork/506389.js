// ==UserScript==
// @name         Old Roblox Layout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ool
// @author       You
// @match        https://*.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506389/Old%20Roblox%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/506389/Old%20Roblox%20Layout.meta.js
// ==/UserScript==

// Replace Class

(function ($) {
    $.fn.replaceClass = function (pFromClass, pToClass) {
        return this.removeClass(pFromClass).addClass(pToClass);
    };
}(jQuery));

(function() {
    'use strict';
    // Originally made in normal js, rewritten in jquery to make coding easier.
    // Remove code keeping old layout css to appear
    $('body').removeClass('gotham-font');
    // Using if and else to make code only work if it isnt the sign up page
    if ($('body').attr('data-internal-page-name') == 'Landing') {
    } else {
        $('body').removeClass('light-theme');
        var wrap = $('#wrap');
        // Header
        var header = $('#header');
        wrap.prepend(header);// Takes out header to where it originally was and also removes most of the new css
        var hnav = $('#header > .container-fluid > .rbx-navbar:nth-of-type(1)');
        hnav.replaceClass('col-md-5','col-md-4');// Change to old class name (makes the header links have less space.)
        hnav.replaceClass('col-lg-4','col-lg-3');
        // Changes links to old names
        var games = $('.nav-menu-title[href="/discover"]');
        games.attr('href','/games'); // Gotta be very thorough...
        games.attr('class','nav-menu-title');
        games.html('Games');
        var catalog = $('.nav-menu-title[href="/catalog"]');
        catalog.attr('class','nav-menu-title');
        catalog.html('Catalog');
        var develop = $('.nav-menu-title[href="/develop"]');
        develop.attr('class','nav-menu-title');
        develop.html('Develop');
        var robux = $('.nav-menu-title[href="/robux?ctx-nav"]');
        robux.attr('class','buy-robux nav-menu-title');
        robux.html('ROBUX');
        // Search
        $(".icon-common-search-sm").attr('class','icon-nav-search');
        // Right
        if ($(".icon-common-notification-bell")) {
            $(".icon-common-notification-bell").attr('class','icon-nav-notification-stream');
        };
        if ($("#nav-robux")) {
            $("#nav-robux").attr('class','icon-nav-robux');
        };

        // Sidebar
        var left = $("#left-navigation-container");
        wrap.prepend(left);// Takes out sidebar to where it originally was and also removes all of the new css
        wrap.prepend(header);// Brings header back to top
        $("#upgrade-now-button").html('Upgrade Now');// Changes Premium(BC) button to old text.

        // Fixes for More Button
        window.addEventListener('load', function () {
            setTimeout(function(){
                const mb = document.querySelectorAll('.btn-more');
                Array.from(mb).forEach((element, index) => {
                    element.classList.remove('see-all-link-icon');
                    element.classList.add('btn-fixed-width');
                });
            }, 1000);
        })
    }
})();

// Sign Up Page
(function() {
    'use strict';
    if ($('body').attr('data-internal-page-name') == 'Landing') {
        $('body').removeClass('dark-theme');
        $('body').removeClass('rbx-body');
        // Navbar
        var nav = $('<div class="navbar navbar-landing navbar-fixed-top" role="navigation" style="background-color: rgba(0, 0, 0, 0.35);">' +
                     '<div class="container">' +
                      '<div class="row">' +
                       '<div class="navbar-header col-md-6">' +
                        '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#LandingNavbar">' +
                         'Log In' +
                        '</button>' +
                        '<div class="navbar-brand hidden-xs"><img alt="Roblox Logo" class="robloxLogo" src="https://images.rbxcdn.com/e870a0b9bcd987fbe7f730c8002f8faa.png"></div>' +
                         '<ul id="TopLeftNavLinks" class="nav navbar-nav">' +
                          '<li id="PlayLink" class="pull-left"><a href="#RollerContainer" onclick="return scrollTo(1, &apos;#RollerContainer&apos;);">Play</a></li>' +
                          '<li id="AboutLink" class="pull-left"><a href="#WhatsRobloxContainer" onclick="return scrollTo(2, &apos;#WhatsRobloxContainer&apos;);">About</a></li>' +
                          '<li id="PlatformLink" class="pull-left"><a href="#RobloxDeviceText" onclick="return scrollTo(3, &apos;#RobloxDeviceText&apos;);">Platforms</a></li>' +
                          '<li id="magic-line" style="left: 41px; width: 61px;"></li>' +
                         '</ul>' +
                        '</div>' +
                        '<div class="collapse navbar-collapse col-sm-6 ng-scope" id="LandingNavbar" ng-modules="roblox.formEvents">' +
                         '<form name="loginForm" action="https://www.roblox.com/newlogin" id="LogInForm" class="navbar-form form-inline navbar-right ng-pristine ng-valid" method="post" role="form" rbx-form-context="" context="RollerCoaster" novalidate="">' +
                          '<div class="form-group" id="LoginUsernameParent">' +
                           '<input id="LoginUsername" type="text" placeholder="Username" class="form-control" name="username" rbx-form-interaction="">' +
                          '</div>&nbsp;' +
                          '<div class="form-group" id="LoginPasswordParent">' +
                           '<input id="LoginPassword" type="password" placeholder="Password" class="form-control" name="password" rbx-form-interaction="">' +
                          '</div>&nbsp;' +
                          '<div class="form-group">' +
                           '<input type="submit" id="LoginButton" class="form-control" value="Log In" rbx-form-interaction="" name="submitLogin">' +
                          '</div>' +
                          '<a id="HeaderForgotPassword" class="navbar-link" href="https://www.roblox.com/Login/ResetPasswordRequest.aspx">Forgot Username/Password?</a>' +
                          '<input id="ReturnUrl" name="ReturnUrl" type="hidden" value="">' +
                         '</form>' +
                        '</div>' +
                       '</div>' +
                      '</div>' +
                     '</div>');
        $(nav).insertBefore($('#react-landing-container'));
        // Main
        $('#react-landing-container > div').attr('class','container-fluid');
        $('#react-landing-container > div').removeAttr('id');
        $('#react-landing-container > div').insertAfter($(nav));
        $('#react-landing-container').remove();

        // Sign up
        $('<!--Roller Coaster-->').insertBefore($('#RollerContainer')); // Gotta be very thourough...
        $('#RollerContainer').removeClass('rollercoaster-background');
        $('#RollerContainer').append($('<div class="attribution hidden-xs"><span class="notranslate">Game: ROBLOX Point</span><br>Developer: <span class="notranslate">StarMarine614</span></div>'));
        $('#action-bar-container').remove();
        $('.lower-logo-container').attr('id','MainCenterContainer');
        $('.lower-logo-container').attr('class','row');
        $('#app-stores-container').remove();
        // Logo
        var logo = $('<div class="col-xs-12 col-md-6">' +
                      '<div id="MainLogo" class="text-right">' +
                       '<div id="LogoAndSlogan" class="text-center">' +
                        '<img id="MainLogoImage" title="ROBLOX" class="center-block img-responsive" src="https://images.rbxcdn.com/39ae3ca577c8488487ef492031b8e264.png">' +
                        '<div class="clearfix"></div>' +
                        '<h1>Powering Imagination<span> ™ </span></h1>' +
                       '</div>' +
                      '</div>' +
                     '</div>');
        $('#MainCenterContainer').prepend($(logo));
        // Main
        $('#signup-container').attr('class','col-xs-12 col-md-6');
        $('#signup-container').removeAttr('id');
        $('#signup-header-container').remove();
        $('.signup-container').attr('id','SignUpFormContainer');
        $('.signup-container').attr('data-return-url','');
        $('.signup-container').removeAttr('class');
        var s = $('#signup');
        $('#signup').attr('class','');
        $('#signup').attr('data-parent-url','');
        $('#signup').attr('data-is-from-studio','false');
        $('#signup').attr('data-is-facebook-button-shown','false');
        $('#signup').removeAttr('id');
        $('body').append($('<div class="rbx-login-partial-legacy"></div>'));
        $('.rbx-login-partial-legacy').append($(s).contents());
        s.append($('.rbx-login-partial-legacy'));
        $('.signup-or-log-in #SignUpFormContainer').attr('class','signup-container ng-scope');
        $('.signup-or-log-in #SignUpFormContainer').attr('ng-controller','SignupController');
        $('.signup-or-log-in #SignUpFormContainer').attr('ng-show','isSectionShown');
        $('.signup-or-log-in #SignUpFormContainer').removeAttr('id');
        $('.signup-or-log-in #SignUpFormContainer').removeAttr('data-return-url');
        $('.signup-input-area label').remove();
        // Username
        $('input#signup-username').attr('placeholder',"Username (don't use your real name)");
        // Password
        $('input#signup-password').attr('placeholder','Password (minimum length 8)');
        // Birthday
        $('.birthday-container').insertBefore($('.gender-container'));
        $('.birthday-container .birthday-select-group').prepend($('<label class="birthday-label">Birthday</label>'));
        $('.birthday-select-group').addClass('fake-input-lg');
        // Gender
        $('.gender-container .form-control').prepend($('<label>Gender</label>'));

        // My Favorite Part
        $('<!--What is Roblox-->').insertAfter($('#RollerContainer'));
        var wr = $('<section class="row full-height-section" id="WhatsRobloxContainer">' +
                    '<div class="col-md-12 inner-full-height-section">' +
                     '<div class="row" id="InnerWhatsRobloxContainer1">' +
                      '<div id="WhatIsRobloxTextBg" class="col-sm-5 col-sm-offset-6 col-xs-8 col-xs-offset-2">' +
                       '<h1 class="text-center">WHAT IS ROBLOX?</h1>' +
                       '<p class="lead text-justify">' +
                        'ROBLOX is the best place to Imagine with Friends™. With the largest user-generated online gaming platform, and over 15 million games created by users, ROBLOX is the #1 gaming site for kids and teens (comScore). Every day, virtual explorers come to ROBLOX to create adventures, play games, role play, and learn with their friends in a family-friendly, immersive, 3D environment.' +
                       '</p>' +
                      '</div>' +
                     '</div>' +
                     '<div class="row" id="InnerWhatsRobloxContainer2">' +
                      '<div id="GameImage1" class="col-sm-4 col-xs-12 game-image"></div>' +
                      '<div id="GameImage2" class="hidden-xs col-sm-4 game-image"></div>' +
                      '<div id="GameImage3" class="col-sm-4 hidden-xs game-image"></div>' +
                     '</div>' +
                    '</div>' +
                   '</section>');
        $('.container-fluid').append(wr);
        $('.container-fluid').append($('<div class="clearfix"></div>'));
        $('.container-fluid').append($('<!--Roblox on your device-->'));
        var device = $('<section id="DeviceSection">' +
                        '<div class="row" id="RobloxDeviceText">' +
                         '<div class="col-md-6 col-md-offset-3 text-center">' +
                          '<h2>ROBLOX ON YOUR DEVICE</h2>' +
                          '<p class="lead center-block">' +
                           'You can access ROBLOX on PC, Mac, iOS, Android, Amazon Devices, and Xbox One. ROBLOX adventures are accessible from any device, so players can imagine with their friends regardless of where they are.' +
                          '</p>' +
                         '</div>' +
                        '</div>' +
                        '<div class="row" id="DeviceImageContainer">' +
                         '<div class="col-md-12">' +
                          '<div class="row text-center">' +
                           '<img id="ComputerImgSmall" class="center-block img-responsive hidden-lg ComputerImg" src="https://images.rbxcdn.com/0ad1ae4bf929fb82cad6f30fdf03b6db.png">' +
                           '<img class="center-block img-responsive visible-lg-block ComputerImg" src="https://images.rbxcdn.com/9edeef823842e76479587a57c05cb5bc.png">' +
                          '</div>' +
                         '</div>' +
                        '</div>' +
                        '<ul id="AppStoreContainer" class="row text-center app-store-container row-five">' +
                         '<li>' +
                          '<a href="https://itunes.apple.com/us/app/roblox-mobile/id431946152" target="_blank" class="app-store-link-apple">' +
                           '<img class="app-store-logo" src="https://images.rbxcdn.com/9819a104fc46fb90d183387ba81065a0.png" title="ROBLOX on App Store">' +
                          '</a>' +
                         '</li>' +
                         '<li>' +
                          '<a href="https://play.google.com/store/apps/details?id=com.roblox.client&amp;hl=en" target="_blank" class="app-store-link-android">' +
                           '<img class="app-store-logo" src="https://images.rbxcdn.com/75ba3866ee59c113220b369c2432c7f9.png" title="ROBLOX on Google Play">' +
                          '</a>' +
                         '</li>' +
                         '<li>' +
                          '<a href="http://amzn.com/B00NUF4YOA" target="_blank" class="app-store-link-amazon">' +
                           '<img class="app-store-logo" src="https://images.rbxcdn.com/29d56f5d7a8c1d6d4a267b28134e221d.png" title="ROBLOX on Amazon Store">' +
                          '</a>' +
                         '</li>' +
                         '<li>' +
                          '<a href="http://store.xbox.com/en-US/Xbox-One/Games/ROBLOX/c79323fd-00f8-462a-a97a-39a0eb61791e" target="_blank" class="app-store-link-xbox">' +
                           '<img class="app-store-logo" src="https://images.rbxcdn.com/cfbff08ccdfe3e51898dfecf5635dc2a.png" title="ROBLOX on Xbox Store">' +
                          '</a>' +
                         '</li>' +
                         '<li>' +
                          '<a href="https://www.microsoft.com/en-us/store/games/roblox/9nblgggzm6wm" target="_blank" class="app-store-link-windows10">' +
                           '<img class="app-store-logo" src="https://images.rbxcdn.com/6e6e44a25ac2fc28a678880c2fec24a9.png" title="ROBLOX on Windows Store">' +
                          '</a>' +
                         '</li>' +
                        '</ul>' +
                       '</section>');
        $('.container-fluid').append(device);
        var footer = $('<footer class="container-footer">' +
                        '<div class="footer">' +
                         '<ul class="row footer-links">' +
                          '<li class="col-4 col-xs-1 footer-link">' +
                           '<a href="http://corp.roblox.com/" class="text-footer-nav roblox-interstitial" target="_blank">' +
                            'About Us' +
                           '</a>' +
                          '</li>' +
                          '<li class="col-4 col-xs-1 footer-link">' +
                           '<a href="http://corp.roblox.com/jobs" class="text-footer-nav roblox-interstitial" target="_blank">' +
                            'Jobs' +
                          '</a>' +
                         '</li>' +
                         '<li class="col-4 col-xs-1 footer-link">' +
                          '<a href="http://blog.roblox.com/" class="text-footer-nav" target="_blank">' +
                           'Blog' +
                          '</a>' +
                         '</li>' +
                         '<li class="col-4 col-xs-1 footer-link">' +
                          '<a href="http://corp.roblox.com/parents" class="text-footer-nav roblox-interstitial" target="_blank">' +
                           'Parents' +
                          '</a>' +
                         '</li>' +
                         '<li class="col-4 col-xs-1 footer-link">' +
                          '<a href="http://en.help.roblox.com/" class="text-footer-nav roblox-interstitial" target="_blank">' +
                           'Help' +
                          '</a>' +
                         '</li>' +
                         '<li class="col-4 col-xs-1 footer-link">' +
                          '<a href="https://www.roblox.com/Info/terms-of-service" class="text-footer-nav" target="_blank">' +
                           'Terms' +
                          '</a>' +
                         '</li>' +
                         '<li class="col-4 col-xs-1 footer-link">' +
                          '<a href="https://www.roblox.com/Info/Privacy.aspx" class="text-footer-nav privacy" target="_blank">' +
                           'Privacy' +
                          '</a>' +
                         '</li>' +
                        '</ul>' +
                        '<!-- NOTE: "ROBLOX Corporation" is a healthcheck; be careful when updating! -->' +
                        '<p class="text-footer footer-note">' +
                         '©2016 ROBLOX Corporation' +
                         '<br>' +
                         '<span class="footer-kid-safe-logo">' +
                          '<a href="https://www.kidsafeseal.com/certifiedproducts/roblox.html" target="_blank">' +
                           '<img alt="Roblox.com (under-13 user experience) is certified by the kidSAFE Seal Program." src="https://www.kidsafeseal.com/sealimage/20308902961041304386/roblox_medium_darktm.png" width="130" height="50" border="0">' +
                          '</a>' +
                         '</span>' +
                        '</p>' +
                       '</div>' +
                       '</footer>');
        $('.container-fluid').append(footer);
        $('.dark-theme').remove();
    }
})();

// Sign Up Page
(function() {
    'use strict';
    if ($('body').attr('data-internal-page-name') == 'Login') {
        $('.login-header').replaceWith($('<h2 class="login-header">' + $('.login-header').html() + '</h2>'));
        $('#login-base').append($('.login-section .text-center:last-child'));

    }
})();

// Profile page
(function() {
    let profile = document.querySelector('body[data-internal-page-name="Profile"]');
    if (profile) {
        let icon = document.querySelector("div.avatar-card-link");
        icon.className = 'avatar avatar-headshot-lg card-plain profile-avatar-image';
    }
})();

// Gets code if user has premium or not

function GetPremium() {
    let UserElement = document.getElementsByName("user-data")[0];
    if (UserElement) {
        return UserElement.getAttribute("data-ispremiumuser");
    }
    return "N/A";
}

// BC page
(function() {
    let bc = document.querySelector('body[data-internal-page-name="PremiumSubscriptions"]');
    if (bc) {
        // Get 2014 Style Layout
        document.body.style = 'background-color:white;';
        let main = document.querySelector("#wrap");
        main.classList.replace('wrap','nav-container');
        main.removeAttribute("id");
        let mi = document.createElement("div");
        mi.id = 'navContent';
        mi.className = 'nav-content';
        mi.innerHTML = '<div class="nav-content-inner">' +
             '<div id="MasterContainer">' +
              '<div>' +
               '<div id="BodyWrapper" class="">' +
                '<div id="RepositionBody">' +
                '</div>' +
               '</div>' +
              '</div>' +
             '</div>' +
            '</div>';
        main.insertBefore(mi,document.querySelector("#container-main"));
        document.querySelector("#MasterContainer > div").appendChild(document.querySelector("#footer-container"));
        let body = document.querySelector(".content");
        body.id = 'Body';
        body.className = 'body-width';
        document.querySelector("#RepositionBody").appendChild(body);
        let bpage = document.querySelector(".premium-landing-page");
        bpage.id = 'BCPageContainer';
        bpage.removeAttribute("class");
        let bclear = document.createElement("div");
        bclear.style = 'clear:both;';
        body.appendChild(bclear);
        document.querySelector("#subscription-container-base").remove();
        // Head
        let head = document.createElement("div");
        head.className = 'header';
        head.innerHTML = '<span><h1>Upgrade to ROBLOX Builders Club</h1></span>';
        bpage.appendChild(head);
        // Left
        let left = document.createElement("div");
        left.className = 'left-column';
        left.innerHTML = '<table cellspacing="0" border="0">' +
             '<thead class="product-title">' +
              '<tr>' +
               '<td class="center-bold">' +
                '<h2 class="product-space">Free</h2>' +
                '<img data-attribute="free" src="https://images.rbxcdn.com/77add140640c3388e6c9603bc5983846.png" alt="free">' +
               '</td>' +
               '<td class="center-bold">' +
                '<h2 class="product-space">Classic</h2>' +
                '<img data-attribute="classic" src="https://images.rbxcdn.com/ba707f47bb20a1f4804da461fb5d3c31.png" alt=" bc">' +
               '</td>' +
               '<td class="center-bold">' +
                '<h2 class="product-space">Turbo</h2>' +
                '<img data-attribute="turbo" src="https://images.rbxcdn.com/d7eb3ed186e351d99ce8c11503675721.png" alt="tbc">' +
               '</td>' +
               '<td class="center-bold">' +
                '<h2 class="product-space">Outrageous</h2>' +
                '<img data-attribute="outrageous" src="https://images.rbxcdn.com/ca1d0aef06c5fc06a2d8b23aea5e20d2.png" alt="obc">' +
               '</td>' +
              '</tr>' +
             '</thead>' +
             '<tbody class="product-summary summary-big"><tr>' +
              '<td class="divider-top">' +
               '<span class="product-description">Monthly ROBUX</span>' +
               '<span class="nbc-product">No</span>' +
              '</td>' +
              '<td class="divider-top bc-product ">' +
               'R$450' +
              '</td>' +
              '<td class="divider-top tbc-product emphasis">' +
               'R$1,000' +
              '</td>' +
              '<td class="divider-top obc-product emphasis">' +
               'R$2,200' +
              '</td>' +
             '</tr>' +
             '<tr>' +
              '<td class="divider-top">' +
               '<span class="product-description">Join Groups</span>' +
               '<span class="nbc-product">5</span>' +
              '</td>' +
              '<td class="divider-top bc-product ">' +
               '10' +
              '</td>' +
              '<td class="divider-top tbc-product ">' +
               '20' +
              '</td>' +
              '<td class="divider-top obc-product ">' +
               '100!' +
              '</td>' +
             '</tr>' +
             '<tr>' +
              '<td class="divider-top">' +
               '<span class="product-description">Create Groups</span>' +
               '<span class="nbc-product">No</span>' +
              '</td>' +
              '<td class="divider-top bc-product ">' +
               '10' +
              '</td>' +
              '<td class="divider-top tbc-product ">' +
               '20' +
              '</td>' +
              '<td class="divider-top obc-product ">' +
               '100!' +
              '</td>' +
             '</tr>' +
             '<tr>' +
              '<td class="divider-top">' +
               '<span class="product-description">Signing Bonus*</span>' +
               '<span class="nbc-product">No</span>' +
              '</td>' +
              '<td class="divider-top bc-product ">' +
               'R$450' +
              '</td>' +
              '<td class="divider-top tbc-product ">' +
               'R$1,000' +
              '</td>' +
              '<td class="divider-top obc-product ">' +
               'R$2,200' +
              '</td>' +
             '</tr>' +
             '<tr>' +
              '<td class="divider-top">' +
               '<span class="product-description">Paid Access</span>' +
               '<span class="nbc-product">10%</span>' +
              '</td>' +
              '<td class="divider-top bc-product ">' +
               '70%' +
              '</td>' +
              '<td class="divider-top tbc-product ">' +
               '70%' +
              '</td>' +
              '<td class="divider-top obc-product ">' +
               '70%' +
              '</td>' +
             '</tr>' +
             '<tr>' +
              '<td colspan="4">* Signing bonus is for first time membership purchase only.</td>' +
             '</tr>' +
            '</tbody>' +
            '<tbody class="product-grid"><tr>' +
             '<td class="product-cell divider-left">' +
              '<div class="product-nbc divider-bottom"></div>' +
             '</td>' +
             '<td class="product-cell divider-left">' +
              '<div class="product-cell">' +
               '<div class="product-text">' +
                '<h3>Monthly</h3>' +
               '</div>' +
               '<a data-pid="1" data-rank="BC" data-duration="Monthly" href="https://www.roblox.com/upgrades/paymentmethods?ap=480" class="btn-medium btn-primary product-button">$4.99</a>' +
              '</div>' +
             '</td>' +
             '<td class="product-cell divider-left">' +
              '<div class="product-cell">' +
               '<div class="product-text">' +
                '<h3>Monthly</h3>' +
               '</div>' +
               '<a data-pid="34" data-rank="TBC" data-duration="Monthly" href="https://www.roblox.com/upgrades/paymentmethods?ap=481" class="btn-medium btn-primary product-button">$9.99</a>' +
              '</div>' +
             '</td>' +
             '<td class="product-cell divider-left">' +
              '<div class="product-cell">' +
               '<div class="product-text">' +
                '<h3>Monthly</h3>' +
               '</div>' +
               '<a data-pid="28" data-rank="OBC" data-duration="Monthly" href="https://www.roblox.com/upgrades/paymentmethods?ap=482" class="btn-medium btn-primary product-button">$19.99</a>' +
              '</div>' +
             '</td>' +
            '</tr>' +
            '</tbody>' +
            '<tbody class="product-summary summary-small"><tr>' +
             '<td class="divider-top">' +
              '<span class="product-description">Ad Free</span>' +
              '<span class="nbc-product">No</span>' +
             '</td>' +
             '<td class="divider-top bc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top tbc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top obc-product emphasis">' +
              '✔' +
             '</td>' +
            '</tr>' +
            '<tr>' +
             '<td class="divider-top">' +
              '<span class="product-description">Sell Stuff</span>' +
              '<span class="nbc-product">No</span>' +
             '</td>' +
             '<td class="divider-top bc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top tbc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top obc-product emphasis">' +
              '✔' +
             '</td>' +
            '</tr>' +
			'<tr>' +
             '<td class="divider-top">' +
              '<span class="product-description">Virtual Hat</span>' +
              '<span class="nbc-product">No</span>'+
             '</td>' +
             '<td class="divider-top bc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top tbc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top obc-product emphasis">' +
              '✔' +
             '</td>' +
            '</tr>' +
            '<tr>' +
             '<td class="divider-top">' +
              '<span class="product-description">Bonus Gear</span>' +
              '<span class="nbc-product">No</span>' +
             '</td>' +
             '<td class="divider-top bc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top tbc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top obc-product emphasis">' +
              '✔' +
             '</td>' +
            '</tr>' +
            '<tr>' +
             '<td class="divider-top">' +
              '<span class="product-description">BC Beta Features</span>' +
              '<span class="nbc-product">No</span>' +
             '</td>' +
             '<td class="divider-top bc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top tbc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top obc-product emphasis">' +
              '✔' +
             '</td>' +
			'</tr>' +
			'<tr>' +
             '<td class="divider-top">' +
              '<span class="product-description">Trade System</span>' +
              '<span class="nbc-product">No</span>' +
             '</td>' +
             '<td class="divider-top bc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top tbc-product emphasis">' +
              '✔' +
             '</td>' +
             '<td class="divider-top obc-product emphasis">' +
              '✔' +
             '</td>' +
			'</tr>' +
            '</tbody>' +
		'</table>';
        bpage.appendChild(left);
        // Right
        let right = document.createElement("div");
        right.className = 'right-column';
        right.innerHTML = '<div id="RightColumnWrapper">' +
             '<div class="cell cellDivider">' +
              'For billing and payment questions: <span class="SL_swap" id="CsEmailLink"><a href="mailto:info@roblox.com">info@roblox.com</a></span>' +
             '</div>' +
             '<div class="cell cellDivider">' +
              '<h3>Buy ROBUX</h3>' +
              '<p>ROBUX is the virtual currency used in many of our online games. You can also use ROBUX for finding a great look for your avatar. Get cool gear to take into multiplayer battles. Buy Limited items to sell and trade. You’ll need ROBUX to make it all happen. What are you waiting for?</p>' +
              '<p>' +
               '<a href="https://www.roblox.com/upgrades/robux?ctx=upgrade" class="btn-medium btn-primary">Buy ROBUX</a>' +
              '</p>' +
              '<h3>Buy ROBUX with</h3><br><br>' +
              '<a href="https://www.roblox.com/rixtypin"><img src="https://images.rbxcdn.com/028e16231452041ab6d702ea467e96dd.png" alt="rixty"></a><br><br>' +
              '<a href="http://itunes.apple.com/us/app/roblox-mobile/id431946152?mt=8"><img src="https://images.rbxcdn.com/70deff83e869746b0bbc41a86f420844.png" alt="itunes"></a>' +
             '</div>' +
             '<div class="cell cellDivider">' +
              '<h3>Game Cards</h3>' +
              '<a href="https://www.roblox.com/gamecards"><img alt="ROBLOX Gamecards" src="https://images.rbxcdn.com/39d5509393cc40c6d055a15922acf40c.png"></a>' +
              '<div class="gameCardControls">' +
               '<div class="gameCardButton">' +
                '<a href="https://www.roblox.com/gamecards" class="btn-small btn-primary">Where to Buy</a>' +
               '</div>' +
               '<div><a href="https://www.roblox.com/gamecard" class="redeemLink">Redeem Card</a></div>' +
               '<div style="clear: both"></div>' +
              '</div>' +
             '</div>' +
             '<div class="cell">' +
              '<h3>Parents</h3>' +
              '<p>Learn more about Builders Club and how we help <a href="http://corp.roblox.com/parents" class="roblox-interstitial">keep kids safe.</a></p>' +
              '<h3>Cancellation</h3>' +
              '<p>You can turn off membership auto renewal at any time before the renewal date and you will continue to receive Builders Club privileges for the remainder of the currently paid period. To turn off membership auto renewal, please click the &apos;Cancel Membership Renewal button&apos; on the <a href="https://www.roblox.com/my/account#!/billing">Billing</a> tab of the Settings page and confirm the cancellation.</p>' +
             '</div>' +
            '</div>';
        bpage.appendChild(right);
    }
})();

// BC page
(function() {
    let rbx = document.querySelector('body[data-internal-page-name="PremiumRobux"]');
    if (rbx) {
        let main = document.querySelector("#robux-page");
        main.id = 'RobuxContainer';
        main.className = 'row robux-container';
        // Header
        let head = document.createElement("div");
        head.className = 'robux-header';
        head.innerHTML = '<h2>Buy ROBUX</h2>&nbsp;' +
            '<h3>™</h3>' +
            '<br>' +
            '<h4 class="caption-mobile">Buy ROBUX to customize your character and get items in game!</h4>';
        main.prepend(head);
        // Robux
        let robux = document.createElement("div");
        robux.className = 'robux-containter-updated';
        robux.innerHTML = '<div class="magic-wand-image">' +
             '<span class="icon-robux-white"></span>' +
             '<img src="https://web.archive.org/web/20161021205518im_/https://www.roblox.com/Images/Upgrades/Robux/img_richman.png" alt="Robux Curreny Man" class="robux-man">' +
             '<div class="robux-text">Get ROBUX to purchase upgrades for your avatar or to buy special abilities in games.</div>' +
            '</div>' +
            '<div class="robux-list">' +
             '<ul class="grid robux-grid ">' +
              '<li class="product-item">' +
               '<h3 class="robux-value">Starter Kit</h3>' +
               '<div class="cell-content section-content">' +
                '<div class="robux-buy-container">' +
                 '<div class="robux-title">' +
                  '<span class="icon-robux"></span>' +
                  '<h1 class="text-robux">400</h1>' +
                 '</div>' +
                 '<div class="banner-wrap">' +
                  '<a href="https://www.roblox.com/Upgrades/PaymentMethods?ap=42&amp;page=grid" class="btn-primary-md robux-product-price robux-buy">Buy for $4.99</a>' +
                 '</div>' +
                '</div>' +
                '<div class="robux-bonus-footer">' +
                 '<div class="robux-bonus-nbc text-footer small">' +
                  'Want to get <span class="robux-bonus"><span class="font-bold">50</span> Bonus ROBUX</span> ?' +
                  '<a href="https://www.roblox.com/premium/membership?ap=42&amp;page=grid" class="text-name"> Join Builders Club</a>' +
                 '</div>' +
                '</div>' +
               '</div>' +
              '</li>' +
              '<li class="product-item">' +
               '<div class="cell-content section-content">' +
                '<div class="robux-buy-container">' +
                 '<div class="robux-title">' +
                  '<span class="icon-robux"></span>' +
                  '<h1 class="text-robux">800</h1>' +
                 '</div>' +
                 '<div class="banner-wrap">' +
                  '<a href="https://www.roblox.com/Upgrades/PaymentMethods?ap=45&amp;page=grid" class="btn-primary-md robux-product-price robux-buy">Buy for $9.99</a>' +
                 '</div>' +
                '</div>' +
                '<div class="robux-bonus-footer">' +
                 '<div class="robux-bonus-nbc text-footer small">' +
                  'Want to get <span class="robux-bonus"><span class="font-bold">200</span> Bonus ROBUX</span> ?' +
                  '<a href="https://www.roblox.com/premium/membership?ap=45&amp;page=grid" class="text-name"> Join Builders Club</a>' +
                 '</div>' +
                '</div>' +
               '</div>' +
              '</li>' +
              '<li class="product-item">' +
               '<div class="cell-content section-content">' +
                '<div class="robux-buy-container">' +
                 '<div class="robux-title">' +
                  '<span class="icon-robux"></span>' +
                  '<h1 class="text-robux">1,700</h1>' +
                 '</div>' +
                 '<div class="banner-wrap">' +
                  '<a href="https://www.roblox.com/Upgrades/PaymentMethods?ap=10&amp;page=grid" class="btn-primary-md robux-product-price robux-buy">Buy for $19.99</a>' +
                 '</div>' +
                '</div>' +
                '<div class="robux-bonus-footer">' +
                 '<div class="robux-bonus-nbc text-footer small">' +
                  'Want to get <span class="robux-bonus"><span class="font-bold">500</span> Bonus ROBUX</span> ?' +
                  '<a href="https://www.roblox.com/premium/membership?ap=10&amp;page=grid" class="text-name"> Join Builders Club</a>' +
                 '</div>' +
                '</div>' +
               '</div>' +
              '</li>' +
              '<li class="product-item">' +
               '<h3 class="robux-value">Super Value</h3>' +
               '<div class="cell-content section-content">' +
                '<div class="robux-buy-container">' +
                 '<div class="robux-title">' +
                  '<span class="icon-robux"></span>' +
                  '<h1 class="text-robux">4,500</h1>' +
                 '</div>' +
                 '<div class="banner-wrap">' +
                  '<a href="https://www.roblox.com/Upgrades/PaymentMethods?ap=46&amp;page=grid" class="btn-primary-md robux-product-price robux-buy">Buy for $49.99</a>' +
                  '<div class="red-banner"><span class="banner-percent xsmall"><span class="font-bold">10</span>%<br>more</span></div>' +
                 '</div>' +
                '</div>' +
                '<div class="robux-bonus-footer">' +
                 '<div class="robux-bonus-nbc text-footer small">' +
                  'Want to get <span class="robux-bonus"><span class="font-bold">1,500</span> Bonus ROBUX</span> ?' +
                  '<a href="https://www.roblox.com/premium/membership?ap=46&amp;page=grid" class="text-name"> Join Builders Club</a>' +
                 '</div>' +
                '</div>' +
               '</div>' +
              '</li>' +
              '<li class="product-item">' +
               '<div class="cell-content section-content">' +
                '<div class="robux-buy-container">' +
                 '<div class="robux-title">' +
                  '<span class="icon-robux"></span>' +
                  '<h1 class="text-robux">10,000</h1>' +
                 '</div>' +
                 '<div class="banner-wrap">' +
                  '<a href="https://www.roblox.com/Upgrades/PaymentMethods?ap=19&amp;page=grid" class="btn-primary-md robux-product-price robux-buy">Buy for $99.99</a>' +
                  '<div class="red-banner"><span class="banner-percent xsmall"><span class="font-bold">19</span>%<br>more</span></div>' +
                 '</div>' +
                '</div>' +
                '<div class="robux-bonus-footer">' +
                 '<div class="robux-bonus-nbc text-footer small">' +
                  'Want to get <span class="robux-bonus"><span class="font-bold">5,000</span> Bonus ROBUX</span> ?' +
                  '<a href="https://www.roblox.com/premium/membership?ap=19&amp;page=grid" class="text-name"> Join Builders Club</a>' +
                 '</div>' +
                '</div>' +
               '</div>' +
              '</li>' +
              '<li class="product-item">' +
               '<div class="cell-content section-content">' +
                '<div class="robux-buy-container">' +
                 '<div class="robux-title">' +
                  '<span class="icon-robux"></span>' +
                  '<h1 class="text-robux">22,500</h1>' +
                 '</div>' +
                 '<div class="banner-wrap">' +
                  '<a href="https://www.roblox.com/Upgrades/PaymentMethods?ap=21&amp;page=grid" class="btn-primary-md robux-product-price robux-buy">Buy for $199.99</a>' +
                  '<div class="red-banner"><span class="banner-percent xsmall"><span class="font-bold">29</span>%<br>more</span></div>' +
                 '</div>' +
                '</div>' +
                '<div class="robux-bonus-footer">' +
                 '<div class="robux-bonus-nbc text-footer small">' +
                  'Want to get <span class="robux-bonus"><span class="font-bold">12,500</span> Bonus ROBUX</span> ?' +
                  '<a href="https://www.roblox.com/premium/membership?ap=21&amp;page=grid" class="text-name"> Join Builders Club</a>' +
                 '</div>' +
                '</div>' +
               '</div>' +
              '</li>' +
             '</ul>' +
            '</div>';
        main.prepend(robux);
        main.prepend(head);
    }
})();

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "M+", "B+","T+"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

// Game page
(function() {
    let game = document.querySelector('body[data-internal-page-name="GameDetail"]');
    if (game) {
        document.querySelector(".game-main-content").classList.remove("follow-button-enabled");
        let title = document.createElement("h2");
        title.className = 'game-name';
        title.title = '';
        document.querySelector(".game-title-container").prepend(title);
        title.title = document.querySelector("h1.game-name").title;
        title.innerHTML = document.querySelector("h1.game-name").title;
        document.querySelector("h1.game-name").remove();
        var timer = setInterval(function() {
            if (title.style = 'display: flex; align-items: center;') {
                title.removeAttribute("style");
                clearInterval(timer);
            }
        }, 200);
        document.querySelector("#game-age-recommendation-container").remove();
        // Play
        let play = document.querySelector("#game-details-play-button-container");
        play.className = 'game-play-buttons';
        play.removeAttribute("id");
        var timer2 = setInterval(function() {
            if (document.querySelector(".btn-common-play-game-lg")) {
                document.querySelector(".btn-common-play-game-lg").innerHTML = 'Play';
                document.querySelector(".btn-common-play-game-lg").className = 'btn-primary-lg';
                clearInterval(timer2);
            }
        }, 200);
        // Bottom
        document.querySelector(".favorite-follow-vote-share").className = 'share-rate-favorite';
        // Favorite
        let favorite = document.querySelector(".game-favorite-button-container");
        favorite.className = 'favorite-button-container';
        let fc = document.querySelector("#game-favorite-icon-label");
        fc.id = 'results';
        fc.className = 'text-favorite favoriteCount';
        document.querySelector("#toggle-game-favorite").prepend(fc);
        var timer3 = setInterval(function() {
            if (document.querySelector(".game-favorite-count")) {
                fc.classList.add(document.querySelector(".game-favorite-count").innerHTML);
                fc.title = document.querySelector(".game-favorite-count").innerHTML;
                var n = $('.game-favorite-count').html();
                function convert(val) {
                    // thousands, millions, billions etc..
                    var s = ["", "k", "m", "b", "t"];
                    // dividing the value by 3.
                    var sNum = Math.floor(("" + val).length / 3);
                    // calculating the precised value.
                    var sVal = parseFloat((
                        sNum != 0 ? (val / Math.pow(1000, sNum)) : val).toPrecision(2));
                    if (sVal % 1 != 0) {
                        sVal = sVal.toFixed(1);
                    }
                    // appending the letter to precised val.
                    return sVal + s[sNum];
                }
                function GFG_Fun() {
                    fc.html(convert(n));
                }
                let a = document.querySelector(".game-favorite-count").innerHTML;
                fc.innerHTML = abbreviateNumber(a);
                document.querySelector(".game-stat:nth-child(2)").remove();
                clearInterval(timer3);
            }
        }, 200);
        // Follow
        document.querySelector(".game-follow-button-container").remove();
        // Desc
        var timer5 = setInterval(function() {
            if (document.querySelector("#game-age-recommendation-details")) {
                document.querySelector("#game-age-recommendation-details").remove();
                clearInterval(timer5);
            }
        }, 200);
        // Bottom
        $('.game-stat').removeClass('game-stat-width');
        if (document.querySelector(".game-copylocked-footnote")) {
            document.querySelector(".game-copylocked-footnote").remove();
        } else {
            let cl = document.createElement("span");
            cl.className = 'text-pastname game-copylocked-footnote';
            cl.innerHTML = 'This game is copylocked';
            document.querySelector(".game-stat-footer").prepend(cl);
        }
        // VIP Servers
        document.querySelector("#rbx-private-servers h2").innerHTML = 'VIP Servers';
        document.querySelector(".rbx-private-server-create-button").innerHTML = 'Create VIP Server';
        // Games
        var games = $('#recommended-games-container');
        games.attr('id','my-recommended-games');
        games.attr('class','col-xs-12 container-list games-detail');
        var ghead = '<div class="container-header"><h3>Recommended Games</h3></div>';
        games.prepend(ghead);
        /*var timer6 = setInterval(function() {
            if (document.querySelector(".game-carousel")) {
                $('#my-recommended-games > h2').remove();
                $('.game-carousel').replaceWith('<ul class="hlist game-cards game-cards-sm">' + $('.game-carousel').html() +'</ul>');
            }
            if (document.querySelector(".game-card-container:nth-child(6)")) {
                $('.game-card-container:nth-child(1)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(1)').html() +'</li>');
                $('.game-card-container:nth-child(2)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(2)').html() +'</li>');
                $('.game-card-container:nth-child(3)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(2)').html() +'</li>');
                $('.game-card-container:nth-child(4)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(3)').html() +'</li>');
                $('.game-card-container:nth-child(5)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(4)').html() +'</li>');
                $('.game-card-container:nth-child(6)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(5)').html() +'</li>');
                $('.game-card-container:nth-child(7)').replaceWith('<li class="list-item game-card">' + $('.game-card-container:nth-child(6)').html() +'</li>');
                clearInterval(timer6);
            }
        }, 200);*/
        // Code to change 'experience' to 'game'
        var timer4 = setInterval(function() {
            if (document.querySelector(".game-play-buttons .error-message")) {
                if($('span.error-message').text().indexOf('Sorry, this experience is private.') >= 0) {
                    $('span.error-message').text('Sorry, this game is private.');
                };
                clearInterval(timer4);
            }
        }, 200);
    }
})();

// Catalog page
(function() {
    let catalog = document.querySelector('body[data-internal-page-name="Catalog"]');
    if (catalog) {
        var timer = setInterval(function() {
            if (document.querySelector(".heading a")) {
                document.querySelector(".heading a").innerHTML = 'Catalog';
                //
                document.querySelector(".search-container .input-group").prepend(document.querySelector("#search-bar-container input"));
                document.querySelector("#search-bar-container").remove();
                document.querySelector(".search-container .buy-robux").remove();
                clearInterval(timer);
            }
        }, 200);
    }
})();

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Groups page
(function() {
    let catalog = document.querySelector('body[data-internal-page-name="GroupDetails"]');
    if (catalog) {
        // Get 2014 Style Layout
        document.body.style = 'background-color:white;';
        let main = document.querySelector("#wrap");
        main.classList.replace('wrap','nav-container');
        main.removeAttribute("id");
        let mi = document.createElement("div");
        mi.id = 'navContent';
        mi.className = 'nav-content';
        mi.innerHTML = '<div class="nav-content-inner">' +
             '<div id="MasterContainer">' +
              '<div>' +
               '<div id="BodyWrapper" class="">' +
                '<div id="RepositionBody">' +
                '</div>' +
               '</div>' +
              '</div>' +
             '</div>' +
            '</div>';
        main.insertBefore(mi,document.querySelector("#container-main"));
        document.querySelector("#MasterContainer > div").appendChild(document.querySelector("#footer-container"));
        let body = document.querySelector(".content");
        body.id = 'Body';
        body.className = 'body-width';
        document.querySelector("#RepositionBody").appendChild(body);
        let gpage = document.querySelector("#group-container");
        gpage.className = 'MyRobloxContainer';
        gpage.removeAttribute("id");
        // Middle
        document.querySelector(".group-details").onload = function() {
            // Setting the timeout and visible to another element
            setTimeout(function () {
                document.querySelector(".group-details").style.display = "block" /* VISIBLE */
            }, 1000);
        }
    }
})();