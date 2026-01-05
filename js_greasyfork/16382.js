// ==UserScript==
// @name         StackOverflow Hide Jerky
// @namespace    https://gist.github.com/zmwangx/eb968f3f9e5ce8d0c4e4
// @version      0.1.1
// @description  Hide jerky usernames and avatars on StackOverflow
// @author       Zhiming Wang
// @match        *://stackoverflow.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/16382/StackOverflow%20Hide%20Jerky.user.js
// @updateURL https://update.greasyfork.org/scripts/16382/StackOverflow%20Hide%20Jerky.meta.js
// ==/UserScript==

// Jerks are everywhere, StackOverflow is no exception. There are idiots who
// wear their political badges everywhere, who take to their SO USERNAMES and
// AVATARS to deliver their crappy political propagenda, and in some cases they
// succeed in distracting me from the programming questions I'm looking at. (I
// don't give a s**t to profiles. It's fine as long as it's out of my way.)
//
// SO moderators keep saying you should report instead of finding a way to
// blacklist. I call bullshit. First, there's no consensus on whether political
// propaganda should or should not be allowed in SO usernames and
// avatars. Secondly, what *I* find annoying or distracting might not be so to
// others, and certainly may not be violating community guidelines (re no
// consensus). Thirdly, arguing with moderators is time consuming, and who
// knows if reporting sensitive matters would lead to retaliation or
// not. Therefore, the perfect solution is to exercise power and judgement on
// the client side, at the cost of some CPU cycles and memory.
//
// This script hides the usernames and avatars of users of your choice from all
// questions, answers, edits, and comments. All content about programming is
// left untouched, so it has minimal side effects on things that you actually
// care about.
//
// This script uses feross/standard style: https://github.com/feross/standard.
//
// This script is licensed under WTFPL v2.

// List of numeric user IDs (strings).
//
// As an example, putting '1' in this array will hide Jeff from
// http://stackoverflow.com/a/25486. This script is broken if it doesn't, and
// in that case please email zmwangx@gmail.com (I don't get notified of
// comments on Gists).
const userIds = []

const $ = window.$

$.each(userIds, function (index, userId) {
  // The string we don't want to see in hrefs
  var taboo = '/users/' + userId + '/'
  // Deal with signatures of questions/answers/edits
  $('.user-info').each(function (i, e) {
    if (e.innerHTML.indexOf(taboo) !== -1) {
      // Remove username
      $(e).find('.user-details').remove()
      // Remove avatar
      $(e).find('.user-gravatar32').remove()
    }
  })
  // Deal with comments
  $('.comment-user').each(function (i, e) {
    if (e.href.indexOf(taboo) !== -1) {
      $(e).remove()
    }
  })
})
