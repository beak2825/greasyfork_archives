// ==UserScript==
// @name 新版微博字体
// @description 替换部分字体
// @author Sign_Up
// @version 0.1.6
// @license CC-BY-NC-ND-4.0
// @namespace https://greasyfork.org/users/662341
// @grant GM_addStyle
// @run-at document-start
// @include *weibo.com/*

// @downloadURL https://update.greasyfork.org/scripts/418570/%E6%96%B0%E7%89%88%E5%BE%AE%E5%8D%9A%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/418570/%E6%96%B0%E7%89%88%E5%BE%AE%E5%8D%9A%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
(function() {
    let css="";
    if (location.href.startsWith("")) {
        css +=`
        html { font-family: Roboto, Source Han sans sc, sans-serif !important;}
        .Frame_content_3XrxZ { max-width: 100%; margin: auto;} /* 总内容宽度 */
        .Main_full_1dfQX { width: 750px; } /* 主中间宽度 */
        .Main_side_i7Vti { width: 280px; } .Side_sideBox_2G3FX { width: 100%;}/* 主右侧宽度 */
        .Frame_side_3G0Bf { width: 250px; } /* 左侧边宽度 */
        .detail_ogText_2Z1Q8, .detail_nick_u-ffy, .detail_reText_30vF1  { font-size: 17px !important; line-height: 1.5 !important; text-align: justify;}
        :root {
            --feed-title-width: 14px;
            --feed-title-height: 14px;
            --feed-title-font-size: 13px;
            --feed-title-line-height: 17px;
            --feed-head-fast-line-height: 18px;
            --feed-head-info-font-size: 13px;
            --w-like-font-size: 14px; --feed-toolbar-height: 45px;
            --feed-head-nick-font-size: 17px; --feed-head-nick-line-height: 1; --feed-detail-og-font-size: 17px; --feed-detail-og-line-height: 1.5; --feed-detail-re-font-size: 17px; --feed-detail-re-line-height: 1.5;
            font-weight:400 !important;
            --w-main: #000;
        }
        .wbpro-list { font-size: 16px; line-height: 1.5;} /* 字体大小 */
        .wbpro-side .f12 { font-size: 15px; line-height: 1.5; } /* 右侧边字体大小 */
        .NavItem_text_3Z0D7 { font-size: 15px; line-height: 1.5;} /* 左侧边字体大小 */
        .toolbar_num_JXZul { font-size: 14px;} /*点赞等字体大小*/
        .ProfileHeader_con3_Bg19p { font-size: 14px; } /*个人档案字体大小*/
        .head-info_info_2AspQ { font-size: 14px !important; line-height: 2 !important; }  /*用户名下方信息字体*/
        .NavItem_icon_1tzN0 { margin-right: 5px;} /*分组列表符号右侧空白*/
        `;
    }
    if (typeof GM_addStyle !=="undefined") {
        GM_addStyle(css);
    }
    else {
        let styleNode=document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
}

)();