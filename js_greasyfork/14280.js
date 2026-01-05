// ==UserScript==
// @name		Tumblr Despammer
// @namespace	http://keelanrosa.tumblr.com
// @version		0.3.0
// @description	Get spammy posts out of the Tumblr tags
// @include		*://www.tumblr.com/tagged/*
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/14280/Tumblr%20Despammer.user.js
// @updateURL https://update.greasyfork.org/scripts/14280/Tumblr%20Despammer.meta.js
// ==/UserScript==

var spamTags = 10; // number of tags before a link post is considered spam post
var spamExterminate = true; // change to false if you want to be able flag/block spamblogs, keep true if you want them completely invisible

// Nb while blogs which post links with many tags are generally spam-blogs, there is no guarantee every heavily-tagged link is spam; please be certain before flagging!

var spamResults = document.evaluate("//div[contains(@class,'is_link') or contains(@class,'post_media')]//a[contains(@class,'has-thumbnail') or contains(@class,'no-thumbnail') or contains(@class,'post_media_photo_anchor')]",
     document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = spamResults.snapshotLength - 1; i >=0; i--) {
  var spamPost = spamResults.snapshotItem(i).parentNode.parentNode.parentNode.parentNode;
  var spamClass = 'spam' + i;
  $(spamPost).addClass(spamClass);
  var spamTagged = document.evaluate("//div[contains(@class,'" + spamClass + "')]//a[contains(@class,'post_tag')]",
       document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var spamTagCount = spamTagged.snapshotLength + 1;
  if (spamExterminate == true && spamTagCount >= spamTags) {
    $(spamPost.parentNode.parentNode).empty();
  } else if (spamExterminate == false && spamTagCount >= spamTags) {
  spamPost.innerHTML = '<div class="post_content"><div class="post_content_inner"><div class="post_body" style="padding-bottom:30px;"><strong>Spam Detected:</strong> Link with ' + (spamTagCount) + ' tags removed</div></div></div>';
  };
};
