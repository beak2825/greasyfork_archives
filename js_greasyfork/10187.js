// ==UserScript==
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @name        GameMOEs
// @namespace   https://thelolilulelo.wordpress.com/
// @description Makes Twitter boards considerably cuter to browse. 
// @include     https://twitter.com/*
// @version     3.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10187/GameMOEs.user.js
// @updateURL https://update.greasyfork.org/scripts/10187/GameMOEs.meta.js
// ==/UserScript==

GM_addStyle("body { height: auto; !important; }");

var backgroundImg = ['http://i.imgur.com/UuLjqxG.png', 'http://i.imgur.com/7lzlqMa.png', 'http://i.imgur.com/rSs5UMN.png', 'http://i.imgur.com/nJjbD2t.png', 'http://i.imgur.com/eu6MbXc.png', 'http://i.imgur.com/iUPT0ok.png', 'http://i.imgur.com/5FBRmkE.png', 'http://i.imgur.com/ZOdB9Ma.png', 'http://i.imgur.com/jdglvDH.png', 'http://i.imgur.com/ogJZJ4Z.png', 'http://i.imgur.com/zAbf4C2.png', 'http://i.imgur.com/DFd6Nlc.png', 'http://i.imgur.com/gnGoOql.png', 'http://i.imgur.com/Rt3lPsX.png', 'http://i.imgur.com/nxt08fM.png', 'http://i.imgur.com/ipNWahH.gif', 'http://i.imgur.com/8u71INM.png', 'http://i.imgur.com/68THNyh.png', 'http://i.imgur.com/pmGl2Xc.png', 'http://i.imgur.com/l7C81sZ.png', 'http://i.imgur.com/EKjvQek.png', 'http://i.imgur.com/JQHY64R.png', 'http://i.imgur.com/m5avf7F.png', 'http://i.imgur.com/v9JmPIa.png', 'http://i.imgur.com/1rpmdjW.png', 'http://i.imgur.com/YD1B7sZ.png', 'http://i.imgur.com/1sl50Uq.png', 'http://i.imgur.com/EUsBMAy.png', 'http://i.imgur.com/nXLt3Nn.png', 'http://i.imgur.com/L7iTVUB.png', 'http://i.imgur.com/42L39MN.png', 'http://i.imgur.com/RUoEvjg.png', 'http://i.imgur.com/ZMTi1jL.png', 'http://i.imgur.com/dex6f1z.png', 'http://i.imgur.com/81BfGwR.png', 'http://i.imgur.com/v7fjjaT.png', 'http://i.imgur.com/8PgFPA5.png', 'http://i.imgur.com/4P8JHBT.png', 'http://i.imgur.com/ZGAPyJ8.png', 'http://i.imgur.com/lyHtmSe.png', 'http://i.imgur.com/Lh2QP8J.png', 'http://i.imgur.com/DnZbRwX.png', 'http://i.imgur.com/8Nk4tJo.png', 'http://i.imgur.com/g2KWK9i.png', 'http://i.imgur.com/1WDBVUZ.png', 'http://i.imgur.com/UejbCm0.png', 'http://i.imgur.com/Zpv7IiM.png', 'http://i.imgur.com/2Jg9xvK.png', 'http://i.imgur.com/4gJPU3U.png', 'http://i.imgur.com/x3pHd2F.png', 'http://i.imgur.com/vphI4Va.png', 'http://i.imgur.com/fgo1LUU.png', 'http://i.imgur.com/P5SxAG5.png', 'http://i.imgur.com/xHMm6Tm.png', 'http://i.imgur.com/oGaod4I.png', 'http://i.imgur.com/wJGVndt.png', 'http://i.imgur.com/UQH3kIj.png', 'http://i.imgur.com/XnBOai2.png', 'http://i.imgur.com/ZX2ytHJ.png', 'http://i.imgur.com/yuRKWtY.png', 'http://i.imgur.com/DaopUbS.png', 'http://i.imgur.com/OOt5hGN.png', 'http://i.imgur.com/srDvU7K.png', 'http://i.imgur.com/3RpDEpe.png', 'http://i.imgur.com/ftqV9Eg.png', 'http://i.imgur.com/Ckgwjqs.png', 'http://i.imgur.com/fkHR1b2.png', 'http://i.imgur.com/uDMymiB.png', 'http://i.imgur.com/sOx8QGI.png', 'http://i.imgur.com/qtIuTA9.png', 'http://i.imgur.com/eKzxyRX.png', 'http://i.imgur.com/ItwZPwH.png', 'http://i.imgur.com/qkqBNx7.png', 'http://i.imgur.com/YI8yyhv.png', 'http://i.imgur.com/5S3Y1WH.png', 'http://i.imgur.com/PlWMjE6.png', 'http://i.imgur.com/JHqAobi.png', 'http://i.imgur.com/gfVW8YU.png', 'http://i.imgur.com/WZVKTK6.png'];
var backgroundImg = backgroundImg[Math.floor(Math.random() * backgroundImg.length)];

var bodyStyle = document.getElementsByTagName("body")[0].style;
bodyStyle.backgroundImage = "url('" + backgroundImg + "')";
bodyStyle.backgroundRepeat = "no-repeat";
bodyStyle.backgroundAttachment = "fixed";
bodyStyle.backgroundPosition = "top";