// ==UserScript==
// @name         改变淘宝搜索的的CSS
// @namespace    https://www.taobao.com
// @version      0.1
// @include      https://*.taobao.com*
// @description  现在的淘宝电脑端搜索的的界面不舒服，尤其是那个圆角，强制更改CSS!
// @author       qufudj
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474492/%E6%94%B9%E5%8F%98%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E7%9A%84%E7%9A%84CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/474492/%E6%94%B9%E5%8F%98%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E7%9A%84%E7%9A%84CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

GM_addStyle(`
@media (min-width:1446px) {
	.LeftLay--leftWrap--xBQipVc {
		width: 1446px
	}

	.Card--doubleCardWrapper--L2XFE73,.Card--doubleCardWrapperMall--uPmo5Bz,.Card--doubleCardWrapperNone--N8KMGpq {
		width: 350px;
		height: 500px
	}

	.LeftLay--leftWrap--xBQipVc {
		width: 1600px
	}

	.Content--contentInner--QVTcU0M {
		width: 1560px
	}

	.MainPic--mainPic--rcLNaCv {
		width: 350px;
		height: 350px
	}
}

.PageContent--contentWrap--mep7AEm {
	margin: 0 auto;
	border-radius: 0
}
.MainPic--listMainPicWrapper--lxNvm5P,.MainPic--mainPicWrapper--iv9Yv90 {
	width: 350px;
	height: 350px;
	border-radius: 0
}

.Card--doubleCardWrapper--L2XFE73,.Card--doubleCardWrapperMall--uPmo5Bz {
	width: 380px;
	height: 495px;
	border-radius: 0
}

.Card--doubleCardWrapper--L2XFE73:hover {
	border: 1px solid #ff5000;
	border-radius: 0;
	background-color: #fff9f5
}

.Card--doubleCardWrapperMall--uPmo5Bz:hover {
	border: 1px solid #fe0137;
	border-radius: 0;
	background-color: #fff8f6
}


.search-suggest,.templet-1d2e76b .item:hover {
	border-radius: 0
}

.templet-1d2e76b .templet[data-width="296"] .item-list .item {
	width: 230px
}

.templet-1d2e76b .item-list .item {
	margin-top: 5px
}

.templet-1d2e76b .item .imglink {
	border-radius: 0
}

    `);