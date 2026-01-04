// ==UserScript==
// @name        Rllmuk Put Edit Link Under Your Own Posts
// @description Replace the Quote link under your own posts with an Edit link
// @namespace   https://github.com/insin/greasemonkey/
// @version     5
// @match       https://rllmukforum.com/index.php?/topic/*
// @match       https://www.rllmukforum.com/index.php?/topic/*
// @downloadURL https://update.greasyfork.org/scripts/424250/Rllmuk%20Put%20Edit%20Link%20Under%20Your%20Own%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/424250/Rllmuk%20Put%20Edit%20Link%20Under%20Your%20Own%20Posts.meta.js
// ==/UserScript==

void function TopicPage() {
  let $loggedInUserLink = document.querySelector('#elUserNav a.ipsUserPhoto')
  if (!$loggedInUserLink) {
    return
  }

  const POST_SELECTOR = 'article.ipsComment'
  const USER_ID_RE = /profile\/(\d+)/

  let currentUserId = USER_ID_RE.exec($loggedInUserLink.href)[1]

  function processPost($post) {
    let $userLink = $post.querySelector('.cAuthorPane_author a')
    let userId = USER_ID_RE.exec($userLink.href)[1]
    if (userId !== currentUserId) {
      return
    }
    let $quoteLink = $post.querySelector('a[data-action="quoteComment"]')
    let $editLink = $post.querySelector('a[data-action="editComment"], a[href$="&do=edit"]')
    $quoteLink.replaceWith($editLink.cloneNode(true))
  }

  function processPosts(context = document) {
    context.querySelectorAll(POST_SELECTOR).forEach(processPost)
  }

  // Process initial posts
  processPosts()

  // Watch for posts being replaced when paging
  new MutationObserver(mutations =>
    mutations.forEach(mutation => {
      if (mutation.oldValue == 'true') {
        processPosts()
      }
    })
  ).observe(document.querySelector('div.cTopic'), {
    attributes: true,
    attributeFilter: ['animating'],
    attributeOldValue: true,
  })

  // Watch for new posts being loaded into the current page
  new MutationObserver(mutations => {
    mutations.forEach(mutation =>
      mutation.addedNodes.forEach($addedNode => {
        if ($addedNode.matches(POST_SELECTOR)) {
          processPost($addedNode)
        }
      })
    )
  }).observe(document.querySelector('#elPostFeed > form'), {
    childList: true,
  })
}()
