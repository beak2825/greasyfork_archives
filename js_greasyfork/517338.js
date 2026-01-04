// ==UserScript==
// @name         onlineexambuilder Score Replace
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Experimental Script - Use it on your own risk!
// @author       SomeLoad2
// @match        https://www.onlineexambuilder.com/index.php?r=exam/ranking*
// @run-at       document-start
// @grant        none
// @license      Proprietary. All rights reserved. No modification or redistribution allowed.
// @downloadURL https://update.greasyfork.org/scripts/517338/onlineexambuilder%20Score%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/517338/onlineexambuilder%20Score%20Replace.meta.js
// ==/UserScript==

// Copyright 2024 Arturas Zemaitinis
// All rights reserved. No modification or redistribution allowed.

var Procentu = 0;
var Uzduociu = 0;









// Do not change anything below or script will break!

window.stop(); var score = (Procentu / 100) * Uzduociu, result = Procentu < 50 ? "Failed" : "Passed"; document.documentElement.innerHTML = '<html dir="ltr" lang="en"><head><link rel="stylesheet" type="text/css" href="https://assets.easy-lms.com/d4d9f64372f66a477ee1e45fc0cf2975f29b3d49/a/main/css/animations.css"><link rel="stylesheet" type="text/css" href="https://assets.easy-lms.com/d4d9f64372f66a477ee1e45fc0cf2975f29b3d49/a/main/css/bowlingbear/light.css"><style type="text/css">@import url(\'https://fonts.easy-lms.com/css?family=Arial:400,700&display=swap\');@import url(\'https://fonts.easy-lms.com/css?family=Arial:400,700&display=swap\');:root{--theme-header-font-family:Arial,Helvetica Neue,Helvetica,sans-serif;--theme-body-font-family:Arial,Helvetica Neue,Helvetica,sans-serif;--theme-question-font-size:28px;--theme-answer-font-size:13px;--theme-question-text-align:center;--theme-background-image:url("https://assets.easy-lms.com/d4d9f64372f66a477ee1e45fc0cf2975f29b3d49/a/main/images/defaultquizbg.jpg");}</style><script type="text/javascript" src="https://assets.easy-lms.com/d4d9f64372f66a477ee1e45fc0cf2975f29b3d49/b/old/js/page/style-helper.min.js"></script><title>Lietuva tarpukariu</title></head><body class="page_leaderboard"><div class="wrapper" data-content-wrapper=""><main class="container"><div class="contentcontainer"><div class="row"><div class="col12"><div class="contentbox"><header class="text-center"><h1>Jūsų rezultatas yra <span>' + Procentu + '%</span></h1></header><p class="center">Atlikote egzaminą. Surinkote ' + score.toFixed(2) + ' iš ' + Uzduociu + '.00 taškų.<strong class="heading_h3 center examscorecattitle">' + result + '</strong></p></div></div></div></div><div class="row footer"><footer><div><a href="https://www.onlineexambuilder.com/lt/">Internetinio Egzamino kūrėjas</a> dalis <a href="https://www.easy-lms.com">Easy LMS</a></div></footer></div></main></div></body></html>';