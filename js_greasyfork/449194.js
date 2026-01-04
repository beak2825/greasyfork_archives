// ==UserScript==
// @name         异次元优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  异次元样式优化
// @author       Gavin
// @match        https://www.iplaysoft.com/*
// @icon         https://cdn.iplaysoft.com/ips/icon/apple-v8/180.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449194/%E5%BC%82%E6%AC%A1%E5%85%83%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/449194/%E5%BC%82%E6%AC%A1%E5%85%83%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
var $ = $ || window.$;
$("<style></style>").text(`
#section_hot,#sidebar,#section_postbanner,#rbox_b,#rbox_t,#show_post_side,.post_wechat_qr,.donate,.entry-recommend-posts,#link1111,.entry-meta.clear,#respond{
    display:none;
}
#section_show_post,#section_info{
    width:auto !important;
}
#section_show_post .rbox_c,#section_info .rbox_c{
    background-image:none;
    padding:0 !important;
}
#show_post_entry,.entry,.pagenavi-button,.pagenavi,.entry-banner,.entry-banner img,#content,.entry-dl-area,.imglist{
    width: 980px !important;
}
.entry-banner,.entry-banner img{
    height: 190px !important;
}
.entry-mixed .entry-container {
    width: 752px;
}
div[style="margin:26px auto 26px auto;width:336px;height:280px;"],div[style="margin:40px auto 50px auto;overflow:hidden;"],div[style="margin:-10px 0 0 0;overflow:hidden"]{
    display:none;
}
`).appendTo(document.head);