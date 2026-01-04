// ==UserScript==
// @name         Neopets: Trading post filter
// @author       Tombaugh Regio
// @version      1.0
// @description  What it says on the tin
// @namespace    https://greasyfork.org/users/780470
// @match        http://www.neopets.com/island/tradingpost.phtml
// @exclude      http://www.neopets.com/island/tradingpost.phtml?type=view
// @exclude      http://www.neopets.com/island/tradingpost.phtml?type=viewmyoffers
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431670/Neopets%3A%20Trading%20post%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/431670/Neopets%3A%20Trading%20post%20filter.meta.js
// ==/UserScript==

//================================================

//Enter exact usernames to filter out. Capitalizaton matters!
const EXCLUDED_USERS = []

//Enter terms to filter out. Partial terms work too. Capitalization doesn't matter.
const FILTER_TERMS = ["res"]

//================================================

if (document.querySelector(".content tbody tbody").querySelectorAll("tr").length > 3) {
  const tradingPostContainer = document.querySelector(".content tbody tbody").querySelectorAll("tr")[3].querySelector("td")

  const TRADING_POSTS = new Array()
  let tempPost = []

  //Separate posts into array
  for (const node of tradingPostContainer.childNodes) {
    tempPost.push(node)

    if (node.nodeName == "HR") {
      TRADING_POSTS.push(tempPost)
      tempPost = []
    }
  }

  for (const [i, post] of TRADING_POSTS.entries()) {

    function hideNodes() {
      for (const node of TRADING_POSTS[i]) {
        if (node.style) node.style.display = "none"
        if (node.nodeName == "#text") node.textContent = ""
      }
    }

    let owner = "", wishlist = ""

    //Get details from selected post
    for (const selected of post) {
      if (selected.nodeName == "A" 
          && selected.textContent.length > 0
          && selected.textContent != "Report this lot"
         ) {
        owner = selected.textContent
      }
      if (selected.nodeName == "P"
         && selected.textContent.length > 0
         ) {
        wishlist = selected.childNodes[1].textContent
      }
    }

    //Filter out excluded users
    for (const name of EXCLUDED_USERS) {
      if (owner == name) hideNodes()
    }

    //Filter out filter terms
    for (const term of FILTER_TERMS) {
      if (wishlist.toLowerCase().includes(term.toLowerCase())) hideNodes()
    }
  }
}