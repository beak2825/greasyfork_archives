// ==UserScript==
// @name     好看视频下载插件
// @namespace com.hao123.haokan
// @description 方便好看视频下载
// @author icexmoon@qq.com
// @version  1
// @grant    none
// @include        *//haokan.hao123.com/v?vid=*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422629/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/422629/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
function run(){
  var videoName = $("h1.videoinfo-title").html()+".mp4";
  var videoHref = $("div#mse").find("video").attr("src");
//   console.log($("div#mse").find("video").attr("src"));
  if($("a#video_download").length==0){
  	$("h1.videoinfo-title").append("<h1><a id='video_download' href='"+videoHref+"' download='"+videoName+"'>"+videoName+"</a><h1>");
  }
  window.navigator.clipboard.writeText(videoName);
}
// $("div#mse").mouseover(function(){
//   run();
// });
// window.onload = function(){
//   run();
// }
$(document).ready(function(){
	window.setTimeout(run, 500);
});