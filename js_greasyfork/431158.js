// ==UserScript==
// @name         Font Override for mobile
// @version      0.1.1
// @description  This will change your font for mobile
// @author       Sungmin KIM
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/135360
// @downloadURL https://update.greasyfork.org/scripts/431158/Font%20Override%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/431158/Font%20Override%20for%20mobile.meta.js
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
    font-weight: 45 920;
	font-style: normal;
	font-display: swap;
	src: local('Pretendard Variable'), url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/woff2/PretendardVariable.woff2') format('woff2-variations');
}
`);