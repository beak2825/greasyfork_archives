// ==UserScript==
// @name         知乎加宽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将知乎的页面内容变宽
// @author       Peter Chan
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464072/%E7%9F%A5%E4%B9%8E%E5%8A%A0%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/464072/%E7%9F%A5%E4%B9%8E%E5%8A%A0%E5%AE%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const css = `

:root {
  --width-main-column: 65rem;
  --width-side-column: 17rem;
  --gap: 2rem;
  --width-container: calc(var(--width-main-column) + var(--width-side-column) + var(--gap));
}


/*首页*/
.Topstory-container{
	width: var(--width-container);
}
.Topstory-mainColumn{
	width: var(--width-main-column);
}
/*.Modal--fullPage{*/
/*	width: var(--width-container);*/
/*}*/


/*问题页面*/
.Question-main{
	width: var(--width-container);
}
.Question-mainColumn{
	width: var(--width-main-column);
}
.Question-sideColumn{

}
.QuestionHeader-content{
	width: var(--width-container);
}

/*搜索结果页面*/
.Search-container{
	width: var(--width-container);
}
.SearchMain{
	width: var(--width-main-column);
}


/*个人页面*/
.Profile-main{
	width: var(--width-container);
}
.Profile-mainColumn{
	width: var(--width-main-column);
}
.ProfileHeader{
	width: var(--width-container);
}

/*个人收藏*/
.CollectionsDetailPage-mainColumn{
	width: var(--width-main-column);
}

.CollectionsDetailPage{
	width: var(--width-container);
}


.QuestionWaiting{
	width: var(--width-container);
}
.QuestionWaiting-mainColumn{
	width: var(--width-main-column);
}
.Collections-container{
	width: var(--width-container);
}
.Collections-mainColumn{
	width: var(--width-main-column);
}



/*知乎专栏*/
.Post-NormalMain .Post-Header{
	width: var(--width-main-column);
}

.Post-NormalMain>div, .Post-NormalSub>div{
	width: var(--width-main-column);
}

.Post-SideActions{
	right: calc(40vw - 495px);
}


/*文章内容*/
.origin_image{
	max-width: 90% !important;
}
.AuthorInfo{
	max-width: var(--width-main-column);
}

`;

    GM_addStyle(css);


})();