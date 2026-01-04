// ==UserScript==
// @name          Like icon highlighter for SkyScraperCity
// @description   Tells whether you have liked given post already or not.
// @description:pl Pokazuje czy zalajkowałeś dany post.
// @version       1
// @namespace     https://github.com/skalee/ssc-grease
// @author        me
// @license       Unlicense
// @homepageURL   https://github.com/skalee/ssc-grease
// @supportURL    https://www.skyscrapercity.com/showthread.php?t=2017475
// @grant         none
// @run-at        document-end
// @include       https://www.skyscrapercity.com/showthread.php?*
// @include       https://www.skyscrapercity.com/showpost.php?*
// @downloadURL https://update.greasyfork.org/scripts/373389/Like%20icon%20highlighter%20for%20SkyScraperCity.user.js
// @updateURL https://update.greasyfork.org/scripts/373389/Like%20icon%20highlighter%20for%20SkyScraperCity.meta.js
// ==/UserScript==

(function() {
  let SSC_BLUE = "#5c7099" // Primary color in SSC theme, rgb(92, 112, 153)

  // Following icon in SSC Blue:
  // https://www.iconsdb.com/custom-color/x-mark-icon.html
  let X_MARK_PNG_BLUE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAA" +
    "AQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA9klEQVQ4jYXTTWvCQBDG8V9CKP" +
    "1wfTlYQcEeiodc/Si5SvHUgIK1B+unEw89OMLGbNKBwLI7/2c2s88UsFitK3zit23qHyOxWK" +
    "3f8Ixl29SXIuAvzHDBvG3q7xF4iwo7vJdReRY5FbaROAYLZlPigHOS2xPJwILZF5HwFEIPSc" +
    "IF81jn4Enb1KciqTIkYgiGIjkYEkmjA/cE/hHpwVBmqjwO7Jdx1on7X8h1O42eT9Im5uBcEz" +
    "si5Qh8xjS+QZ8UY3Db1Mco8IK9jE9K18HIvfPxthHrSeYmryWWroORwp2nCpHTncgOHzcrV9" +
    "hgn4PTCJ9MxTj/AQSUdpuLRjejAAAAAElFTkSuQmCC"

  let SELECTOR_REPLY = "table[id^='post']"
  let SELECTOR_REPLY_WRAPPER = "div[id^='edit']"
  let SELECTOR_USER_LINK = "a[href^='member.php']"
  let SELECTOR_LOGOUT_LINK = ".vbmenu_control a[href^='login.php?do=logout']"
  let SELECTOR_LIKE_IMG = ".dbtech-thanks-button-control img"

  function is_post_liked_by_user(post_node, user_name) {
    for (like_elem of post_node.querySelectorAll(SELECTOR_USER_LINK)) {
      if (like_elem.text === user_name) { return true }
    }
    return false
  }

  /* Feel free to apply your own styles.  Several ideas are presented in
   * function body, just uncomment them to see.
   */
  function color_post(post_node) {
    let image = post_node.querySelector(SELECTOR_LIKE_IMG)

    // Make like icon red
    // (see https://codepen.io/stilllife00/pen/avXpgJ for more examples)
    image.style = `filter: grayscale(100%) brightness(75%)` +
      `sepia(100%) hue-rotate(-50deg) saturate(400%) contrast(2)`

    // Or, add some blue shadow to "like" icon
    // image.style = `filter: drop-shadow(0 0 5px ${SSC_BLUE});`

    // Or, add solid blue circle in a background
    // image.style = `border: 2px solid ${SSC_BLUE};` +
    //   `border-radius: 10px;` +
    //  `background-color: ${SSC_BLUE};`

    // Or, flip the icon (effectively thumb down)
    // image.style = `transform: scaleY(-1);`

    // Or, make the icon gray
    // image.style = `filter: grayscale(100%);`

    // Or, replace it with an "X" mark
    // image.src = X_MARK_PNG_BLUE
  }

  async function grease_post(post_node) {
    if (is_post_liked_by_user(post_node, current_user())) {
      color_post(post_node)
    }
  }

  function current_user() {
    let welcome_elem = document.querySelector(SELECTOR_USER_LINK)
    return welcome_elem ? welcome_elem.text : null
  }

  function is_logged_in() {
    let logout_link = document.querySelector(SELECTOR_LOGOUT_LINK)
    return !!logout_link
  }

  function find_posts_in(elem) {
    return elem.querySelectorAll(SELECTOR_REPLY)
  }

  function observe_for_post_replacements(callback) {
    function on_dom_mutation(mutations_list) {
      for (mutation of mutations_list) {
        for (node of mutation.addedNodes) {
          if (node.matches(SELECTOR_REPLY)) { callback(node) }
        }
      }
    }

    let observer = new MutationObserver(on_dom_mutation)
    let observer_config = { childList: true }

    for (reply_wrapper of document.querySelectorAll(SELECTOR_REPLY_WRAPPER)) {
      observer.observe(reply_wrapper, observer_config)
    }
  }

  function grease() {
    if (!is_logged_in()) { return }

    for (post of find_posts_in(document)) {
      grease_post(post)
    }

    observe_for_post_replacements(grease_post)

    console.log("loaded")
  }

  grease()
})();
