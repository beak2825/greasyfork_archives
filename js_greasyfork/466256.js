// ==UserScript==
// @name         ybt杂项优化
// @namespace    https://www.luogu.com.cn/user/545986
// @version      3.2
// @description  (重制ybt图标) & 链接形态美化 & 提交信息颜色多样化 & 按钮与输入框美化 & 移除浏览器聚焦 & 鼠标悬停阴影 & SPJ字体大小修复
// @author       Jerrycyx & ChatGPT
// @match        http://ybt.ssoier.cn:8088/*
// @match        http://oj.woj.ac.cn:8088/*
// @match        http://bas.ssoier.cn:8086/*
// @match        http://woj.ssoier.cn:8087/*
// @match        http://pj.ssoier.cn:8087/*
// @match        http://tg.ssoier.cn:8087/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ybt.ssoier.cn:8088/
// @grant        GM_addStyle
// @license      Mozilla
// @downloadURL https://update.greasyfork.org/scripts/466256/ybt%E6%9D%82%E9%A1%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/466256/ybt%E6%9D%82%E9%A1%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
GM_addStyle(`
    .ac {color: Green   !important;}
    .wa {color: Red     !important;}
    .tle{color: DarkBlue!important;}
    .ce {color: Yellow  !important;}
    .re {color: Purple  !important;}
    .ole, .mle {color: Black!important;}
    #showpp font[size="4"][color="blue"] {
        color: Green;
        font-size: 125%;
    }

    html,body * {
        outline: none;
    }

    a{
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline !important;
    }

    .xxbox, pre, code {
        transition: box-shadow 0.3s;
    }
    .xxbox:hover, pre:hover, code:hover {
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3) !important;
    }

    input[type="submit"], input[type="reset"], input[type="button"] {
	      background: transparent;
	      border-radius: 3px;
	      border: none;
	      text-align: center;
	      display: inline-block;
	      margin: 4px 2px;
	      -webkit-transition-duration: 0.4s; /* Safari */
	      transition-duration: 0.4s;
	      cursor: pointer;
	      text-decoration: none;
          border: 1.5px solid Gray;
	}
    input[type="submit"], input[type="reset"], input[type="button"] {
    }
	/* 悬停样式 */
	input[type="submit"]:hover, input[type="reset"]:hover, input[type="button"]:hover {
	      background-color: Gray;
	      color: white;
	}

    input[type="text"], input[type="password"] {
        background: transparent;
        border: none;
        border-bottom: 1.5px solid Gray;
    }

    input[readonly] {
        cursor: not-allowed;
        border: none;
        background: transparent;
    }

    .xxbox p, .pcontent h3, .pcontent h3 font {
        font-size: medium;
    }
`);
(function() {
    'use strict';
    /*
    var oldpic = document.getElementsByName("banner")[0];
    var newpicHTML = '<img src="https://s1.ax1x.com/2023/08/22/pPJA2Ux.png" height="141px">';
    oldpic.parentNode.innerHTML = newpicHTML;
    */
})();
