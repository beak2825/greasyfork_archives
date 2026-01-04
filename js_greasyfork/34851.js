// ==UserScript==
// @name          tumblr - No Hate Edition
// @description	  fix the garbage zone.
// @author        tonyjsmaker
// @copyright     2017, tony (https://openuserjs.org/users/tonyjsmaker)
// @license       MIT
// @homepage      https://userstyles.org/styles/129060
// @include       https://tumblr.com/*
// @include       https://*.tumblr.com/*
// @include       https://www.tumblr.com/dashboard
// @grant         GM_addStyle
// @version       1.1.0
// @namespace     https://greasyfork.org/users/158252
// @downloadURL https://update.greasyfork.org/scripts/34851/tumblr%20-%20No%20Hate%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/34851/tumblr%20-%20No%20Hate%20Edition.meta.js
// ==/UserScript==
var fascists = ["mutant-aesthetic","this-is-cthulhu-privilege","lostsoup","fash-metal","awhiffofcavendish",
               "traumatizedchildhood", "inniodal", "tropic-depression"];
var pedophiles = ["2814werewolf"];
var terfs = ["an-angry-lesbian"];
var cssT = ".reblog-list-item{position:relative;}.reblog-list-item .reblog-header{position:static;}";
cssT += ".reblog-list-item .reblog-avatar, .reblog-list-item .reblog-avatar .reblog-avatar-image-thumb{left:19px;}";
cssT += ".peepr-body .indash_header_wrapper .navigation{z-index:99;}"


for( i = 0; i < fascists.length; i++ )
{
 //cssT += "a[href*=\"" + fascists[i] + "\"]:not(.reblog-avatar):not(.post_avatar_link):not(.blog_name):after";
 //cssT += "div.indash_tumblelog_compact[data-tumblelog-url*=\"" + fascists[i] "\"] .blog_name::after"
 cssT += "a[href*=\"" + fascists[i] + "\"] > span.full_url:after,";
 cssT += ".reblog-tumblelog-name[href*=\"" + fascists[i] + ".tumblr.com\"]::after,";
 cssT += ".reblog_source .post_info_link[title*=\"" + fascists[i] + "\"]:after";
 if( i != fascists.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{color:#f66;font-weight:bold;content:\' is a Nazi, do not engage.\';}"
].join("\n");


for( i = 0; i < pedophiles.length; i++ )
{
 cssT += "a[href*=\"" + pedophiles[i] + "\"] > span.full_url:after,";
 cssT += ".reblog-tumblelog-name[href*=\"" + pedophiles[i] + ".tumblr.com\"]::after,";
 cssT += ".reblog_source .post_info_link[title*=\"" + pedophiles[i] + "\"]:after";
 if( i != pedophiles.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{color:#dd6;font-weight:bold;content:\' pedophile.\';}"
].join("\n");


for( i = 0; i < terfs.length; i++ )
{
 cssT += "a[href*=\"" + terfs[i] + "\"] > span.full_url:after,";
 cssT += ".reblog-tumblelog-name[href*=\"" + terfs[i] + ".tumblr.com\"]::after,";
 cssT += ".reblog_source .post_info_link[title*=\"" + terfs[i] + "\"]:after";
 if( i != terfs.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{color:#fa6;font-weight:bold;content:\' terf.\';}"
].join("\n");



// tumblelogs n stuff
for( i = 0; i < fascists.length; i++ )
{
 cssT += ".indash_blog.indash_tumblelog_compact.fade_in[data-tumblelog-url*=\"" + fascists[i] + "\"]::before,";
 cssT += ".indash_header_wrapper.tumblelog_name_" + fascists[i] + "::before,";
 cssT += ".recent_posts > div[data-tumblelog*=\"" + fascists[i] + "\"]::before,";
 cssT += ".name[href*=\"" + fascists[i] + "\"]::before,";
 cssT += ".reblog-tumblelog-name[href*=\"" + fascists[i] + ".tumblr.com\"]::after";
 if( i != fascists.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{display:block;position: absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;",
 "background: #c33;text-align:center;color:#000;content:\"Nazi blog blocked\";z-index:89;cursor: default;}"
].join("\n");

for( i = 0; i < pedophiles.length; i++ )
{
 cssT += ".indash_blog.indash_tumblelog_compact.fade_in[data-tumblelog-url*=\"" + pedophiles[i] + "\"]::before,";
 cssT += ".indash_header_wrapper.tumblelog_name_" + pedophiles[i] + "::before,";
 cssT += ".recent_posts > div[data-tumblelog*=\"" + pedophiles[i] + "\"]::before,";
 cssT += ".name[href*=\"" + pedophiles[i] + "\"]::before,";
 cssT += ".reblog-tumblelog-name[href*=\"" + pedophiles[i] + ".tumblr.com\"]::after";
 if( i != pedophiles.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{display:block;position: absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;",
 "background: #bb3;text-align:center;color:#000;content:\"Pedophile blog blocked\";z-index:89;cursor: default;}"
].join("\n");

for( i = 0; i < terfs.length; i++ )
{
 cssT += ".indash_blog.indash_tumblelog_compact.fade_in[data-tumblelog-url*=\"" + terfs[i] + "\"]::before,";
 cssT += ".indash_header_wrapper.tumblelog_name_" + terfs[i] + "::before,";
 cssT += ".recent_posts > div[data-tumblelog*=\"" + terfs[i] + "\"]::before,";
 cssT += ".name[href*=\"" + terfs[i] + "\"]::before,";
 cssT += ".reblog-tumblelog-name[href*=\"" + terfs[i] + ".tumblr.com\"]::after";
 if( i != terfs.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{display:block;position: absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;",
 "background: #c83;text-align:center;color:#000;content:\"Terf blog blocked\";z-index:89;cursor: default;}"
].join("\n");

/* Avatar overwrite */
// tumblelogs n stuff
for( i = 0; i < fascists.length; i++ )
{
 cssT += ".avatar > a[href*=\"" + fascists[i] + "\"]::before";
 if( i != fascists.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{position:absolute;width:40px;height:40px;",
 "background: #c33;text-align:center;color:#000;content:\" \";z-index:89;cursor: default;}"
].join("\n");

for( i = 0; i < pedophiles.length; i++ )
{
 cssT += ".avatar > a[href*=\"" + pedophiles[i] + "\"]::before";
 if( i != pedophiles.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{position:absolute;width:40px;height:40px;",
 "background: #bb3;text-align:center;color:#000;content:\" \";z-index:89;cursor: default;}"
].join("\n");

for( i = 0; i < terfs.length; i++ )
{
 cssT += ".avatar > a[href*=\"" + terfs[i] + "\"]::before";
 if( i != terfs.length - 1 )
 {
  cssT += ",";
 }
}
cssT += [
 "{position:absolute;width:40px;height:40px;",
 "background: #c83;text-align:center;color:#000;content:\" \";z-index:89;cursor: default;}"
].join("\n");

// Follow button & display:none
for( i = 0; i < pedophiles.length; i++ )
{
 cssT += ".reblog_follow_button[href=\"/follow/" + pedophiles[i] + "\"],";
}
for( i = 0; i < terfs.length; i++ )
{
 cssT += ".reblog_follow_button[href=\"/follow/" + terfs[i] + "\"],";
}
for( i = 0; i < fascists.length; i++ )
{
 cssT += ".reblog_follow_button[href=\"/follow/" + fascists[i] + "\"]";
 if( i != fascists.length - 1 )
 {
  cssT += ",";
 }
}
cssT += "{display:none}";
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = cssT;
document.body.appendChild(css);