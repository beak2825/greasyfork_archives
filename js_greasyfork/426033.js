// ==UserScript==
// @name         Font Override
// @version      0.2
// @description  This will change your font to Pretendard
// @author       Sungmin KIM
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/397149
// @downloadURL https://update.greasyfork.org/scripts/426033/Font%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/426033/Font%20Override.meta.js
// ==/UserScript==

GM_addStyle(`
@font-face {
    font-family: "돋움";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "돋움체";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: Dotum;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: DotumChe;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "굴림";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "굴림체";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: Gulim;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: GulimChe;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "바탕";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "바탕체";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: Batang;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: BatangChe;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "궁서";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "궁서체";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: Gungsuh;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: GungsuhChe;
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "Malgun Gothic";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "맑은 고딕";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "Open Sans";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "YouTube Noto";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "Noto Sans KR";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "Apple SD Gothic Neo";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "새바탕";
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
@font-face {
    font-family: "MS Pgothic";
    src: local("Meiryo");
}
@font-face {
    font-family: "MS Pgothic";
    src: local("Meiryo");
    font-weight: bold;
}
`);

if (window.location.href.match('http.*://.*\\.clien\\.net/.*')) {
    GM_addStyle(`
    @font-face {
        font-family: "Noto Sans KR";
        font-weight: 45 920;
        font-style: normal;
        font-display: swap;
        src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
    }
    @font-face {
        font-family: "Roboto";
        font-weight: 45 920;
        font-style: normal;
        font-display: swap;
        src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
    }
    `);
}

if (window.location.href.match('http.*://.*\\.twitch\\.tv/.*')) {
    GM_addStyle(`
    @font-face {
        font-family: "Helvetica Neue";
        font-weight: 45 920;
        font-style: normal;
        font-display: swap;
        src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
    }
    .chat-line__message, .vod-message {
        font-size: 17px !important;
        font-family: "Pretendard";
    }
    .chat-author__display-name, .video-chat__message-author {
        font-size: 60%;
    }
    .chat-line__message span:nth-of-type(3)::after {
        content: "\\A";
        white-space: pre;
    }
    .chat-author__intl-login, .chat-line__message span:nth-of-type(3), div.video-chat__message.inline span.pd-x-05:nth-of-type(1) {
        font-size: 0px;
    }
    `);
}