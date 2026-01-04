// ==UserScript==
// @name          Paticik Mavi Balina
// @description   Mali balina temasi.
// @author        toggie
// @include       http*://*.paticik.com/*
// @version       1.0
// @namespace https://greasyfork.org/en/users/266369
// @downloadURL https://update.greasyfork.org/scripts/380001/Paticik%20Mavi%20Balina.user.js
// @updateURL https://update.greasyfork.org/scripts/380001/Paticik%20Mavi%20Balina.meta.js
// ==/UserScript==
(function() {var css = ["body, .ipsTabs, .content-wrapper, #ipsfocus .cPost.ipsComment_highlighted:not(.ipsComment_selected):not(.ipsModerated):before, #ipsfocus .cPost.ipsComment_highlighted.ipsComment:not(.ipsComment_selected):not(.ipsModerated) .cAuthorPane_mobile, #ipsfocus .ipsComment_highlighted.ipsComment:not(.ipsComment_selected):not(.ipsModerated) .ipsComment_header, .ipsApp #header, .content-wrapper, .ipsApp .ipsNavBar_primary > ul > li[data-active] > a, .ipsApp .ipsBreadcrumb, .ipsItemStatus.ipsItemStatus_large, .ipsItemStatus.ipsItemStatus_large.ipsItemStatus_read, .ipsWidget.ipsWidget_vertical .ipsWidget_title, .ipsWidget.ipsWidget_horizontal .ipsWidget_title, .ipsApp .ipsButton_important, .ipsApp .ipsButton_primary, .ipsButtonBar, .cPost:before, #ipsLayout_body .cAuthorPane_mobile, .ipsType_sectionTitle, img[src*='default_photo'], .ipsPagination.ipsPagination_mini a {",
"    background-color: #5CAFE2 !important;",
"}",
"",
".ipsCommentUnreadSeperator{",
"    background: #f0903f;",
"}",
"",
".ipsApp .ipsNavBar_primary > ul > li[data-active] > a {",
"    color: #5CAFE2;",
"}",
"",
".ipsType_sectionTitle {",
"    border: 1px solid rgba(0,0,0,0.1);",
"    font-size: 1.3rem;",
"    font-weight: bold;",
"    padding: 10px 10px;",
"}",
"",
".cForumList .ipsDataItem_main > *:not(:first-child) {",
"    margin-top: 5px;",
"    color: #a1a1a1;",
"}",
"",
"#header:before {",
"    background-image: none !important;",
"}"
].join("\n");
if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever
 document.documentElement.appendChild(node);
 }
}})();