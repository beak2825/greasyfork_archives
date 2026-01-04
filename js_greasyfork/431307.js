// ==UserScript==
// @name        Daily Stormer Comments
// @namespace   Violentmonkey Scripts
// @match       https://dailystormer.su/*
// @grant       GM.xmlHttpRequest
// @grant       GM.notification
// @grant       unsafeWindow
// @version     1.1
// @author      perception
// @description 9/01/2021, 11:35:12 AM
// @downloadURL https://update.greasyfork.org/scripts/431307/Daily%20Stormer%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/431307/Daily%20Stormer%20Comments.meta.js
// ==/UserScript==

function get(url, fn) {
  const method = 'GET'
  return GM.xmlHttpRequest({
    method,
    url,
    onload: fn
  })
}

function getArticlesForum(fn) {
  const url = 'https://gameruprising.to/index.php?forums/articles.5/'
  return get(url, fn)
}

function escape(s) {
  return s.replace(/\$/g, '\\$')
}

// Get Title of Article
const metaTitle = document.querySelector('head meta[property="og:title"]')
if (metaTitle) {
  const title = metaTitle.content.replace(/ - Daily Stormer/, '')
  const re    = new RegExp(escape(title), 'i')

  // Convert to XenForo Slug
  const xenforoTitle = encodeURIComponent(title.toLocaleLowerCase().replace(/\s+/g, '-'))
  console.log({title, xenforoTitle})
  //GM.notification(title, xenforoTitle)

  // Search for Forum Post for Article
  getArticlesForum(function(res) {
    unsafeWindow.res = res
    const $forum = jQuery(res.responseText)
    const $threads = $forum.find('div.structItem-title a').filter(function(i) {
      const content = jQuery(this).text().trim()
      console.log({title, content, equal: title === content })
      return !!content.match(re)
    })
    unsafeWindow.$forum = $forum
    unsafeWindow.$threads = $threads

    //   If found, scrape thread for comments
    if ($threads.length > 0) {
      const a = $threads[0]
      const threadUrl = `https://gameruprising.to${a.pathname}${a.search}`
      get(threadUrl, function(res) {
        const $thread = jQuery(res.responseText)
        unsafeWindow.$thread = $thread
        const $posts = $thread.find('article.message:not(:first)')
        $posts.each(function(i, p) {
          const $p = jQuery(p)
          const $a = $p.find('a.avatar')
          $a.attr('href', `https://gameruprising.to${$a.attr('href')}`)
          const $img = $a.find('img')
          $img.attr('src', `https://gameruprising.to${$img.attr('src')}`)
          if ($img.attr('srcset')) {
            // Some profiles don't have srcset for their avatar image.
            $img.attr('srcset', `https://gameruprising.to${$img.attr('srcset')}`)
          }
          const $name = $p.find('.message-name a.username')
          $name.attr('href', `https://gameruprising.to${$name.attr('href')}`)
          const $timestamp = $p.find('.message-attribution-main a')
          $timestamp.attr('href', `https://gameruprising.to${$timestamp.attr('href')}`)
          const $postNumber = $p.find('.message-attribution-opposite a:nth(1)')
          $postNumber.attr('href', `https://gameruprising.to${$postNumber.attr('href')}`)
          const $reactions = $p.find('a.reactionsBar-link')
          $reactions.attr('href', `https://gameruprising.to${$reactions.attr('href')}`)
        })
        unsafeWindow.$posts = $posts
        //   Insert comments onto current page
        jQuery('article.post-listing').append($posts)
      })
    }
  })
}

// Add CSS
var css = `
.reaction--small.reaction--1 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px 0px;
  background-size: 100%;
}
.reaction--small.reaction--2 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px -16px;
  background-size: 100%;
}
.reaction--small.reaction--3 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px -32px;
  background-size: 100%;
}
.reaction--small.reaction--4 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px -48px;
  background-size: 100%;
}
.reaction--small.reaction--5 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px -64px;
  background-size: 100%;
}
.reaction--small.reaction--6 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px -80px;
  background-size: 100%;
}
.reaction--small.reaction--7 .reaction-sprite {
  width: 16px;
  height: 16px;
  background: url(https://gameruprising.to/styles/default/xenforo/reactions/emojione/sprite_sheet_emojione.png) no-repeat 0px -96px;
  background-size: 100%;
}

article.message {
  margin: 0.5em;
  padding: 1em;
  border-top: 2px solid #000;
}
article.message .bbCodeBlock-expandLink {
  display: none;
}
`;
if (typeof GM_addStyle != "undefined") {
  GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
  PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
  addStyle(css);
} else {
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    heads[0].appendChild(node);
  } else {
    // no head yet, stick it whereever
    document.documentElement.appendChild(node);
  }
}
