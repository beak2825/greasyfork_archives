// ==UserScript==
// @name        FetLife Newest Discussions
// @namespace   https://fetlife.com/users/3846707
// @description Redirect group landing pages so that "newest discussions" is the default sort rather than "newest comments".
// @include     /^https://fetlife\.com/groups/[0-9]+$/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29395/FetLife%20Newest%20Discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/29395/FetLife%20Newest%20Discussions.meta.js
// ==/UserScript==
window.location.replace(content.document.location + '?order=discussions');
