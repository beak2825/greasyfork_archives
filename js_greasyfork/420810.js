// ==UserScript==
// @name         css changes
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  css for telgram web
// @author       You
// @match        https://web.telegram.org/
// @grant        GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/420810/css%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/420810/css%20changes.meta.js
// ==/UserScript==

GM_addStyle ( `
body.non_osx {
    font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
    font-size: 15px;
}
.im_content_message_wrap.im_message_in{
float: right;
border-radius: 10px;
padding: 10px;
background-color:white;
max-width: 70%;
}
.im_content_message_wrap.im_message_in:after  {
	content: '';
	position: absolute;
	right: 0;
	top: 20px;
	width: 0;
	height: 0;
	border: 13px solid transparent;
	border-left-color: white;
	border-right: 0;
	border-top: 0;
	margin-top: -6.5px;
	margin-right: 18px;
}
.im_content_message_wrap.im_message_out{
float: left;
border-radius: 10px;
padding: 10px;
background-color:#DCF8C6;
margin-right:10px;
max-width: 70%;
}
.im_content_message_wrap.im_message_out:after {
	content: '';
	position: absolute;
	left: 0;
	bottom: 13px;
	width: 0;
	height: 0;
	border: 13px solid transparent;
	border-right-color: #DCF8C6;
	border-left: 0;
	border-bottom: 0;
	margin-top: -6.5px;
	margin-left: 22px;
}
.im_history_col_wrap.noselect.im_history_loaded{
background-image:url("https://external-preview.redd.it/rEwFriCkfAtjOb5b-23b4tGGVcuvfaBqamYNJrgxnLM.png?auto=webp&s=f3bf0b5c90e4c5fda12ff2139781c854554fd198");
background-color:#E5DDD5;
}
.im_bottom_panel_wrap{
background-color:#eae1da;
border-top:1px solid #f2f2f2;
}
.im_page_wrap,.tg_head_split{
max-width: 90% !important;
}

.im_dialog_wrap{
border-bottom:1px solid #f2f2f2;
}

.composer_rich_textarea{
font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
font-size: 15px;
background-color:white;
}
.im_message_wrap {
    max-width: 90% !important;
}
.im_message_reply {
    background-color: #eaede8;
    padding: 5px;
    border-radius: 5px;
    font-size:12px;
}
.im_message_date_split_text{
color:#7c8284;
background-color:#E0F1FB;
padding:4px;
border-radius:5px;
}
` );



















