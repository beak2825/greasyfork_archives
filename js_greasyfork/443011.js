// ==UserScript==
// @name         Emojis for old reddit
// @namespace    mailto:auxermen@gmail.com
// @version      1.5
// @description  Enables subreddit specific emoji display on old reddit.
// @author       Auxermen
// @match        https://old.reddit.com/r/*/comments/*
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443011/Emojis%20for%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/443011/Emojis%20for%20old%20reddit.meta.js
// ==/UserScript==

// TODOs:
// - does not work with comments that are loaded when clicking 'load more comments' button since original JSON doesn't contain info about them
//   it is possible (but a lot more work) to add it by loading a new JSON: https://www.reddit.com/r/sub/comments/threadID/threadTitle/commentID/.json
// - show emojis on user profile

/* jshint esversion: 6 */

(async function() {

/*
 * Convert html encoded string to normal text.
 */
function decodeHtml(html) {
  var txt = document.createElement("textarea")
  txt.innerHTML = html
  return txt.value
}

/*
 * Recursively extract comments from json and put them in dictionary.
 */
function fillCommentsDict(json, commentsDict) {
  if (json.kind !== "Listing" || !json.data || !json.data.children) {
    return
  }

  for (const child of json.data.children) {
    // child.kind = "more" is for load more comments button
    if (child.kind === "more") {
      return
    }
    let data = child.data
    commentsDict[data.name] = {"html": decodeHtml(data.body_html), "media_metadata": data.media_metadata}
    fillCommentsDict(data.replies, commentsDict)
  }
}

let commentsDict = {} // key: comment ID, value: {"html": x, "media_metadata": y}

let jsonURL = document.URL.split("?")[0] + ".json"
let commentsJson = await (await (fetch(jsonURL))).json()
fillCommentsDict(commentsJson[1], commentsDict)

// function for non-blocking wait if the comments aren't in HTML yet
function replaceCommentHtml(commentID, html) {
  if (!document.querySelector('div[data-fullname="' + commentID + '"] > * div.usertext-body')) {
    setTimeout(function(){replaceCommentHtml(commentID, html)}, 100);
  }
  else {
    document.querySelector('div[data-fullname="' + commentID + '"] > * div.usertext-body').innerHTML = html
  }
}

for (const [commentID, commentData] of Object.entries(commentsDict)) {
  if (!commentData.media_metadata) {
    // no emojis in comment
    continue
  }

  for (const [emojiID, emoji] of Object.entries(commentData.media_metadata)) {
    let emojiIDArr = emojiID.split('|')

    if (emojiIDArr.length == 1) {
        // reddit img/gif
        // replace img link text with <span><img> with max 200px height
        let url = emoji.s.u;
        if (!url) {
            url = emoji.s.gif;
        }
        var pcs = commentData.html.split(url)
        var lastPc = pcs.pop()
        commentData.html = pcs.join((url)) + `<span style="display: inline-block; vertical-align: middle; line-height: 100%; margin: 0 2px;"><img src="${(url)}" max-height="${Math.min(emoji.s.y, 200)}"; /></span>` + lastPc
        continue
    } else if (emojiIDArr[0] !== "emote" || emojiIDArr[1] == "free_emotes_pack") {
        // not a subreddit emoji (gifs are already displayed on old reddit)
        continue
    }

    commentData.html = commentData.html.replaceAll(
        `:${emojiIDArr[2]}:`,
        `<span style="display: inline-block; vertical-align: middle; line-height: 100%; margin: 0 2px;">
         <img src="${emoji.s.u}" width="${emoji.s.x}" height="${emoji.s.y}" title=":${emojiIDArr[2]}:" /></span>`
    )
  }

  replaceCommentHtml(commentID, commentData.html)
}

})()