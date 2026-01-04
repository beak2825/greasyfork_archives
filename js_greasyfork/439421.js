// ==UserScript==
// @name        byggahus.se
// @namespace   Violentmonkey Scripts
// @match       https://www.byggahus.se/*
// @grant       GM_addStyle
// @version     1.0
// @license MIT
// @author      -
// @description 1/31/2022, 3:35:17 PM
// @downloadURL https://update.greasyfork.org/scripts/439421/byggahusse.user.js
// @updateURL https://update.greasyfork.org/scripts/439421/byggahusse.meta.js
// ==/UserScript==

GM_addStyle ( `
.main-container-forum,.main-container{
max-width:100%!important;
}

.header-nav-bottom{
display:block!important;
}

article.full, .content-comments{
max-width:90%!important;
}

@Media (min-width: 992px){
.header-proxy{
height:92px!important;
}

body.sidebar-navigation-visible .floatNavigation, body.sidebar-navigation-visible .header-mover{
padding-left:20px!important;
}
}
#navigation-menu{
display:none!important;
}
 ` )