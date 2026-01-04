// ==UserScript==
// @name        Scroll To Top
// @namespace   Back top top of the document
// @description When user scrolled down of page then it will make easy to get back to top of the page.
// @include     *
// @version     1
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant       GM_addStyle
//
// @downloadURL https://update.greasyfork.org/scripts/32267/Scroll%20To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/32267/Scroll%20To%20Top.meta.js
// ==/UserScript==
GM_addStyle ("[data-scroll]{height: 50px;width: 200px;font-size: 18px;line-height: 50px;text-transform: uppercase;text-align: center;background-color: rgba(255, 99, 71, 0.4);color: white;cursor: pointer;position: fixed;bottom: 10px;right: 10px;dispaly: none;z-index:999999;}[data-scroll]:hover {background-color: #ff6347;}");
$(function()
 {
  scroll_btn=$("<div />");
  scroll_btn.attr("data-scroll",'0');
  scroll_btn.html("▲Back to Top▲");
  scroll_btn.hide();
  $("body").append(scroll_btn);
  $(window).scroll(function()
  {
    var window_height=$(window).height();
    var scroll_height=$(document).scrollTop();
    if(scroll_height>0)
      {
         scroll_btn.show(100);
      }
    else
      scroll_btn.hide(100);
  });
  scroll_btn.click(function(e)
  {
    e.preventDefault();
    $(window).scrollTop(0);
  });
});