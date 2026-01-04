// ==UserScript==
// @name         pm全局修改
// @namespace    http://shenchaohuang.net/
// @version      0.4
// @description  七禾公司内部使用，严禁外泄！
// @author       沈超煌
// @match        https://poshmark.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397566/pm%E5%85%A8%E5%B1%80%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/397566/pm%E5%85%A8%E5%B1%80%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

//css
GM_addStyle ( `


a{color:#000 !important}

header nav.fixed .nav-content .pm-logo{width:100%;height:auto}
.header__logo{display:none}
.pm-logo{display:none}

.presentation__banner{display: none !important}

.experiences-title{display:none}
.experience-switcher__title{color:#fff}

.how-it-works{display:none !important}

.sell a{color:#fff !important}

/*banner*/
#closet-header-bg, #closet-header #ch-overlay{height:120px}
#closet-header .col-l2, #closet-header .col-x3{height:120px}

#closet-header #ch-overlay #ch-row .col-l22, #closet-header #ch-overlay #ch-row .col-x21{margin-bottom:0}

.closet__header__container--background{height:10px}
.closet__header__info{display:none}

.closet__header__info__user-details__actions{display:none}

.ui-l{width:120px;height:120px}

/*筛选*/
#filter-con{position:static !important}
#availability{position:absolute;top:110px;left:35%;z-index:1000;background:#fff;font-size:18px;padding:5px;border:5px solid #eee}
#department{position:absolute;top:110px;left:45%;z-index:1000;background:#fff;font-size:18px;padding:5px;border:5px solid #eee}

/*修改配色*/

.search-box .search-box-con .search-icon{background:#000}

header nav.fixed .nav-content .search-section .search-icon{background:#000}

header nav.scrollable .nav-content ul>li a{color:#000}

/*底部*/

footer{display:none}

` );