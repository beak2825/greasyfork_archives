// ==UserScript==
// @name Safebooru helper for redditors
// @namespace https://www.reddit.com/u/DemonicSavage
// @author DemonicSavage
// @description Repost checker, waifu2x linker, etc.
// @version 3
// @match https://safebooru.org/index.php?page=post*
// @grant none
// @require http://code.jquery.com/jquery-1.9.1.min.js
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/370797/Safebooru%20helper%20for%20redditors.user.js
// @updateURL https://update.greasyfork.org/scripts/370797/Safebooru%20helper%20for%20redditors.meta.js
// ==/UserScript==

var j = jQuery.noConflict();

var url = j('#image').attr('src')
if (url.includes("sample")){
    url = url.replace("samples", "images")
    url = url.replace("sample_", "")
}
url = url.replace("//safebooru.org", "https://safebooru.org")

var helper_view = j("<div/>", {id: 'sb-helper', class: 'status-notice'}).prependTo('#post-view')
var a_href = "<a href='https://waifu2x.booru.pics/Home/fromlink?url=" + url + "&denoise=1&scale=2&submit=' target='_blank'>Waifu2x this</a>. "
var status_repost = "Checking if it's already posted..."

helper_view.html(a_href + status_repost)

var rb_request = j.getJSON("https://redditbooru.com/images/", {imageUri: url, sources: "49,60,66,42,40,73,45,56,57,44,50,53,51,1,72,78,25,61,39,38,9,65,36,79,24,28,43,21,47,13,52,41,26,27,20,7,75,58,46,48,8,15,54,29,62,68,33,74,76,64,30,2,17,14,70,77,80,22,55,35,69,37,19,32,34,23,63,71,67,11"}, function(result){
  var rb_json = result.results
  var subs = []
  var print_subs = ""
  for (var i=0; i<rb_json.length; i++){
    if (rb_json[i].distance <= 0.05 && !subs.includes(rb_json[i].sourceName)){
      subs.push(rb_json[i].sourceName)
      print_subs += rb_json[i].sourceName + ", "
    }
  }
  if(subs.length > 0){
    status_repost = "Posted in: " + print_subs.slice(0, print_subs.length-2)
  }else{
    status_repost = "Not yet posted."
  }
  helper_view.html(a_href + status_repost)
})