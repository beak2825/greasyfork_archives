// ==UserScript==
// @name:ko           네이버 SE
// @name              Naver SE

// @description:ko    네이버 미니멀디자인 메인 페이지
// @description       Minimal design for Naver.com

// @namespace         https://ndaesik.tistory.com/
// @version           2025.11.18.1042
// @author            ndaesik
// @icon              https://www.naver.com/favicon.ico
// @match             https://www.naver.com/
// @match             https://m.naver.com/

// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/437550/Naver%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/437550/Naver%20SE.meta.js
// ==/UserScript==
let styleSheet = document.createElement("style")
styleSheet.innerText = `
html {overflow: hidden;}
#wrap {
background: url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Naver_Logotype.svg/1200px-Naver_Logotype.svg.png)no-repeat;
border-top: 2px solid #00c73c;
background-size: 350px 69px;
background-attachment: fixed;
background-position: 50% 38vh;
min-width:unset;
height:100vh;}
#header {width:unset;}

#root > :not(:nth-child(2)),
#right-content-area > div > :not(:nth-child(1)),
#right-content-area > :nth-child(2),
#footer,
#special-logo,
#search-right-banner,
#shortcutArea,
#topAsideArea,
#timeboard-ex {display:none;}
#header .header_inner .search_area {top:50vh;}
#right-content-area {position:fixed; right:0; top:3px; z-index: 9999;}

/* mobile */
#MM_search_container,
#MM_search_container ~ .main_footer,
#sb-kh-shortents-wrap {display:none;}
`.replaceAll(';','!important;')

document.head.appendChild(styleSheet)