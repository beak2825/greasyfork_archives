// ==UserScript==
// @name Farmerama - Multi
// @namespace scriptomatika
// @version 1.0
// @description Big game container
// @author mouse-karaganda
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.farmerama.com/?action=internalGameUnity*
// @match https://www.farmerama.com/?action=internalGamePreUnity*
// @match https://www.farmerama.com/index.php?action=externalLogout*
// @downloadURL https://update.greasyfork.org/scripts/497291/Farmerama%20-%20Multi.user.js
// @updateURL https://update.greasyfork.org/scripts/497291/Farmerama%20-%20Multi.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.farmerama.com/?action=internalGameUnity") || location.href.startsWith("https://www.farmerama.com/?action=internalGamePreUnity") || location.href.startsWith("https://www.farmerama.com/index.php?action=externalLogout")) {
  css += `
  :root {
      --multi: calc(726 / 600);
  }
  body #wrapper #gameContent,
  #unity-container,
  #unity-container canvas,
  .webgl-content .progressLogo,
  body #faIframeContent {
      width: calc(996px * var(--multi)) !important;
      height: calc(600px * var(--multi)) !important;
  }
  .webgl-content .progressLogo {
  	background-size: calc(996px * var(--multi)) calc(600px * var(--multi));
  }
  body #wrapper {
      width: auto;
      min-height: calc(1000px * var(--multi));
      background-size: calc(1790px * var(--multi)) calc(1378px * var(--multi));
  }
  body #wrapper .logo {
  	width: calc(499px * var(--multi));
  	height: calc(172px * var(--multi));
  	margin-left: calc(-250px * var(--multi));
      background-size: calc(499px * var(--multi)) calc(172px * var(--multi));
  }
  body #wrapper .switchClient {
  	width: calc(204px * var(--multi));
  	height: calc(122px * var(--multi));
  	margin-left: calc(260px * var(--multi));
  	top: calc(40px * var(--multi));
      background-size: calc(204px * var(--multi)) calc(122px * var(--multi));
  }
  body #wrapper .switchClient div {
  	font-size: 16px;
  	width: calc(183px * var(--multi));
  	left: calc(10px * var(--multi));
  	top: calc(84px * var(--multi));
  }
  body #wrapper .socialWrapper {
  	width: calc(136px * var(--multi));
  	height: calc(140px * var(--multi));
  	margin-left: calc(-500px * var(--multi));
  	top: calc(2px * var(--multi));
  }
  body #wrapper .socialWrapper a {
      width: calc(35px * var(--multi));
      height: calc(35px * var(--multi));
      background-size: calc(170px * var(--multi)) calc(45px * var(--multi));
  }
  body #wrapper .socialWrapper a.ico_fb {
  	top: calc(93px * var(--multi));
  	left: calc(22px * var(--multi));
  	background-position-x: calc(-2px * var(--multi));
  }
  body #wrapper .socialWrapper a.ico_tw {
  	top: calc(89px * var(--multi));
  	left: calc(58px * var(--multi));
  	background-position-x: calc(-45px * var(--multi));
  }
  body #wrapper .socialWrapper a.ico_yt {
  	top: calc(85px * var(--multi));
  	left: calc(96px * var(--multi));
  	background-position-x: calc(-90px * var(--multi));
  }
  body #wrapper #gameContent {
  	top: calc(177px * var(--multi));
  }
  body #wrapper .userinfo {
  	top: calc(190px * var(--multi));
  }
  body #gl_footer {
  	top: calc(240px * var(--multi));
  }
  #ad-skyscraper-1,
  #adInfo,
  #gameContent #logout .adbox {
      position: fixed;
      left: -10000px;
      top: -10000px;
  }
  #layer-downloadUnity {
  	width: calc(560px * var(--multi));
  	height: calc(596px * var(--multi));
  	top: calc(180px * var(--multi));
  	margin-left: calc(-280px * var(--multi));
      background-size: calc(560px * var(--multi)) calc(596px * var(--multi));
  }
  #layer-downloadUnity-button {
  	top: calc(533px * var(--multi));
  	left: calc(158px * var(--multi));
  	width: calc(240px * var(--multi));
  	height: calc(44px * var(--multi));
      padding-top: calc(16px * var(--multi));
      background-position-y: calc(-60px * var(--multi));
      background-size: calc(285px * var(--multi)) calc(119px * var(--multi));
  }
  #layer-downloadUnity-text {
  	top: calc(240px * var(--multi));
  	left: calc(60px * var(--multi));
  	width: calc(425px * var(--multi));
  	height: calc(200px * var(--multi));
  }
  #layer-downloadUnity-close {
  	right: calc(14px * var(--multi));
  	width: calc(38px * var(--multi));
  	height: calc(36px * var(--multi));
      background-size: calc(38px * var(--multi)) calc(36px * var(--multi));
  }
  body #faLayerContentBox {
  	width: calc(996px * var(--multi));
  	top: calc(150px * var(--multi));
  	margin-left: calc(-498px * var(--multi));
  }
  #fa_duHeader {
  	top: calc(-67px * var(--multi));
  	left: calc(-65px * var(--multi));
  	width: calc(1132px * var(--multi));
  	height: calc(95px * var(--multi));
      background-size: calc(1132px * var(--multi)) calc(95px * var(--multi));
  }
  #fa_duEfeuLi {
  	top: calc(50px * var(--multi));
  	left: calc(-64px * var(--multi));
  	width: calc(47px * var(--multi));
  	height: calc(144px * var(--multi));
      background-size: calc(47px * var(--multi)) calc(144px * var(--multi));
  }
  #fa_duefeuRe {
  	top: calc(555px * var(--multi));
  	left: calc(909px * var(--multi));
  	width: calc(142px * var(--multi));
  	height: calc(107px * var(--multi));
      background-size: calc(142px * var(--multi)) calc(107px * var(--multi));
  }
  #fa_duPayment {
  	top: calc(-95px * var(--multi));
  	left: calc(-88px * var(--multi));
  	width: calc(170px * var(--multi));
  	height: calc(170px * var(--multi));
      background-size: calc(170px * var(--multi)) calc(170px * var(--multi));
  }
  #fa_du_close {
  	top: calc(-50px * var(--multi));
  	left: calc(980px * var(--multi));
  	width: calc(58px * var(--multi));
  	height: calc(45px * var(--multi));
  }
  `;
}
if (location.href.startsWith("https://www.farmerama.com/index.php?action=externalLogout")) {
  css += `
  body #wrapper #gameContent {
      width: calc(998px * var(--multi)) !important;
      height: calc(621px * var(--multi)) !important;
      margin-left: calc(-498px * var(--multi));
      top: calc(170px * var(--multi));
      background-size: calc(998px * var(--multi)) calc(621px * var(--multi));
  }
  #gameContent #logout .logoutTriviaText {
      margin-bottom: calc(20px * var(--multi));
      margin-left: calc(30px * var(--multi));
      width: calc(700px * var(--multi));
  }
  #gameContent .logoutContainer .logoutBoxLeft,
  #gameContent .logoutContainer .logoutBoxRight {
      right: calc(65px * var(--multi));
      top: calc(100px * var(--multi));
      height: calc(35px * var(--multi));
      width: calc(155px * var(--multi));
      background-size: calc(164px * var(--multi)) calc(42px * var(--multi));
  }
  #gameContent .logoutContainer .logoutBoxRight {
      top: calc(160px * var(--multi));
  }
  #gameContent .logoutContainer .logoutBoxLeft input,
  #gameContent .logoutContainer .logoutBoxRight input {
      height: calc(32px * var(--multi));
  }
  body #gl_footer {
      top: calc(910px * var(--multi));
      line-height: 40px;
      font-weight: bold;
      font-size: 14px;
  }
  body #gl_footer span,
  body #gl_footer a {
      display: inline-block;
      vertical-align: middle;
      text-shadow: 1px 1px 1px white, 0 0 1px white, 0 0 1px white;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
