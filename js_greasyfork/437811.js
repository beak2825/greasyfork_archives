// ==UserScript==
// @name         ImageFap - Fix endless scrolling
// @namespace    imagefap_endless_scroll
// @version      1.1
// @license      GNU AGPLv3
// @description  ImageFap - Fix ImageFap endless scrolling to not load same posts multiple times. 
// @author       marp
// @homepageURL  https://greasyfork.org/en/users/204542-marp
// @grant        none
// @match        https://www.imagefap.com/newsfeed.php*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/437811/ImageFap%20-%20Fix%20endless%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/437811/ImageFap%20-%20Fix%20endless%20scrolling.meta.js
// ==/UserScript==


// This function will be injected and executed in the context of the page.
// As such it uses the same script libraries as thew page - for example the VERY old jQuery 1.4.2
function injectThis() {
  $(window).unbind("scroll");
  var oldts = Number.MAX_VALUE;
  $(window).scroll(function() {
    if ($(document).height() - $(window).height() - $(window).scrollTop() < 100)
    {
      if (oldts > ts) {
        oldts = ts;
        $('div#loadmoreajaxloader').show();
        $.ajax( {
          url: "/ajax/newsdata.php?userid=XXXuseridXXX&status=XXXstatusXXX&galleries=XXXgalleriesXXX&comments=XXXcommentsXXX&ts=" + ts + "",
          success: function(html)
          {
            if (html)
            {
              $("#postswrapper").append(html);
              $('div#loadmoreajaxloader').hide();
            } else {
              $('div#loadmoreajaxloader').html('<center>No more posts to show.</center>');
            }
          }
        });
      }  
    }
  });
}


// Get the nummerical UserID from the navigation header
var singlematch = document.evaluate("//div[@class='blk_header']//a[contains(@href,'usergallery.php?userid=')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
var singlenode = singlematch.singleNodeValue;

if (singlenode) {
  var userid = singlenode.getAttribute("href").substring(8 + singlenode.getAttribute("href").search(/\?userid\=/i));
//console.info("userid: ", userid);

  // Get the selected newsfeed categories (and use defaults to be on the safe side)
  // ImageFap ignores this after the first "page", but I'll still pass the correct params...
  //   ...maybe the site owners will repair it one day...
  var comments = "1";
  var galleries = "1";
  var status = "1";
  singlenode = document.getElementById('status');
  if (singlenode) {
    status = (!singlenode.checked ? "no" : "1");
  }
  singlenode = document.getElementById('galleries');
  if (singlenode) {
    galleries = (!singlenode.checked ? "no" : "1");
  }
  singlenode = document.getElementById('comments');
  if (singlenode) {
    comments = (!singlenode.checked ? "no" : "1");
  }
//console.info("status: ", status);
//console.info("galleries: ", galleries);
//console.info("comments: ", comments);

  var injectString = injectThis.toString();
  injectString = injectString.replaceAll("XXXuseridXXX", userid);
  injectString = injectString.replaceAll("XXXstatusXXX", status);
  injectString = injectString.replaceAll("XXXgalleriesXXX", galleries);
  injectString = injectString.replaceAll("XXXcommentsXXX", comments);
//console.info("function-to-string: ", injectString);

  var scriptnode = document.createElement("script");
  scriptnode.setAttribute("type", "text/javascript");
  scriptnode.textContent = "(" + injectString + ")()";
  document.body.appendChild(scriptnode);
}
