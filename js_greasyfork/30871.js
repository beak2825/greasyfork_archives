// ==UserScript==
// @name         Font Override
// @version      0.3
// @description  This will change your font to NanumBarunGothic
// @author       Sungmin KIM
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/135360
// @downloadURL https://update.greasyfork.org/scripts/30871/Font%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/30871/Font%20Override.meta.js
// ==/UserScript==

GM_addStyle(`
@font-face {
    font-family: "돋움";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "돋움";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "돋움체";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "돋움체";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: Dotum;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: Dotum;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: DotumChe;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: DotumChe;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "굴림";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "굴림";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "굴림체";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "굴림체";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: Gulim;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: Gulim;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: GulimChe;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: GulimChe;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "바탕";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "바탕";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "바탕체";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "바탕체";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: Batang;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: Batang;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: BatangChe;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: BatangChe;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "궁서";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "궁서";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "궁서체";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "궁서체";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: Gungsuh;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: Gungsuh;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: GungsuhChe;
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: GungsuhChe;
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "Malgun Gothic";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "Malgun Gothic";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "맑은 고딕";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "맑은 고딕";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "Open Sans";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "Open Sans";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "YouTube Noto";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "YouTube Noto";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "Noto Sans KR";
    src: local("NanumBarunGothic");
}
@font-face {
    font-family: "Noto Sans KR";
    src: local("NanumBarunGothic");
    font-weight: bold;
}
@font-face {
    font-family: "Apple SD Gothic Neo";
    src: local("Noto Sans CJK KR");
}
@font-face {
    font-family: "Apple SD Gothic Neo";
    src: local("Noto Sans CJK KR");
    font-weight: bold;
}
@font-face {
    font-family: "새바탕";
    src: local("Noto Serif CJK KR");
}
@font-face {
    font-family: "새바탕";
    src: local("Noto Serif CJK KR");
    font-weight: bold;
}
@font-face {
    font-family: "새굴림";
    src: local("Noto Sans CJK KR");
}
@font-face {
    font-family: "새굴림";
    src: local("Noto Sans CJK KR");
    font-weight: bold;
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

if (window.location.href.match('http.*://dict.naver.com/.*')) {
	GM_addStyle(`
	.hanja_search {
	    font-family: "Noto Sans CJK KR" !important;
	}
	.jp {
		font-family: "Noto Sans CJK KR" !important;
	}
	.cndic_search {
	    font-family: "Noto Sans CJK KR" !important;
	}
	.search_result dl dd {
	    font-family: "Noto Sans CJK KR" !important;
	}
	`);
}

if (window.location.href.match('http.*://.*\\.clien\\.net/.*')) {
	GM_addStyle(`
	@font-face {
		font-family: "Noto Sans KR";
		src: local("NanumBarunGothic");
	}
	 @font-face {
		font-family: "Noto Sans KR";
		src: local("NanumBarunGothic");
		font-weight: bold;
	}
	@font-face {
		font-family: "Noto Sans KR";
		src: local("NanumBarunGothic Bold");
		font-weight: 500;
	}
	@font-face {
		font-family: "Roboto";
		src: local("NanumBarunGothic");
	}
	@font-face {
		font-family: "Roboto";
		src: local("NanumBarunGothic");
		font-weight: bold;
	}
	 @font-face {
		font-family: "Roboto";
		src: local("NanumBarunGothic Bold");
		font-weight: 500;
	}
	`);
}

if (window.location.href.match('http.*://.*\\.twitch\\.tv/.*')) {
	GM_addStyle(`
	@font-face {
		font-family: "Helvetica Neue";
		src: local("NanumBarunGothic");
	}
	@font-face {
		font-family: "Helvetica Neue";
		src: local("NanumBarunGothic");
		font-weight: bold;
	}
	.chat-line__message, .vod-message {
		font-size: 17px !important;
		font-family: "NanumBarunGothic";
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