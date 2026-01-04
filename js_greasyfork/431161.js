// ==UserScript==
// @name         Show/hide only comments by fic author (AO3)
// @author       Tombaugh Regio
// @version      1.2
// @description  Adds a button to toggle if commenters other than the author are visible
// @namespace    https://greasyfork.org/users/780470
// @match        https://archiveofourown.org/works/*
// @match        https://archiveofourown.org/comments/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431161/Showhide%20only%20comments%20by%20fic%20author%20%28AO3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431161/Showhide%20only%20comments%20by%20fic%20author%20%28AO3%29.meta.js
// ==/UserScript==

const ALL_BUTTONS = [document.querySelector("#show_comments_link_top"), document.querySelector("#show_comments_link")]
const authorNames = []
let count = 0

function showOnlyAuthorComments() {
  const URL = document.URL
  
  if (document.querySelector("#comments_placeholder")) {
    document.querySelector("#comments_placeholder").classList.add("comments-show")
  }
  
  const commentsContainer = document.querySelector(".comments-show")
  
  //Get the authors' names
  if(/\/works\//.test(URL) && authorNames.length == 0) {
    for (const name of document.querySelectorAll('a[rel="author"]')) {
      authorNames.push(name.textContent.trim())
    }
  }
  if(/\/comments\//.test(URL) && authorNames.length == 0) {
    const workURL = document.querySelector("h3.heading a").href
    
    if (/\/works\//.test(workURL)) {
      GM.xmlHttpRequest({
        method: "GET",
        url: workURL,
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/xml"
        },
        onload: function(response) {
          let responseXML = null;

          if (!response.responseXML) {
            responseXML = new DOMParser()
              .parseFromString(response.responseText, "text/xml");
          }

          const htmlElement = document.createElement("HTML")
          htmlElement.innerHTML = response.responseText

          authorNames.push(htmlElement.querySelector(".byline.heading").textContent.trim())

          htmlElement.remove()
          showOnlyAuthorComments()
        }
      })
      
      //If the comments thread is for an admin post, stop everything
    } else return false
  }
  
  //Replace Anonymous with Anonymous Creator
  for (const author of authorNames) {
    if (author == "Anonymous") author = "Anonymous Creator"
  }

  const allComments = commentsContainer.querySelectorAll(".comment.group")

  if (allComments.length > 0 && !document.querySelector("[data-hidden]")) {    
    for (const comment of allComments) { 
      let commenterName   
      //Logged-in user
      if (comment.querySelector(".heading.byline a")) {
        commenterName = comment.querySelector("a").textContent.trim()
      }
      //Guest user
      else if (comment.querySelector(".heading.byline")) {
        commenterName = comment.querySelector(".heading.byline").childNodes[0].textContent.trim()
      }
      
      //Adds a hidden dataset attribute
      comment.setAttribute("data-hidden", "")

      //If the name matches the author, remove the hidden dataset
      if (authorNames.length > 0) {
        for (const authorName of authorNames) {
          if (commenterName == authorName) comment.removeAttribute("data-hidden")
        }
      }
    }
    
    //Add click function to pagination buttons
    for (const nav of document.querySelectorAll("ol.pagination a")) {
      ALL_BUTTONS.push(nav)
    }
    setClickFunction(showOnlyAuthorComments)
    
    //Adds a button to toggle hiding
    if (!document.querySelector("[data-toggler]")) {
      const hideToggler = document.createElement("button")
      hideToggler.textContent = "Hide non-author comments"
      hideToggler.setAttribute("data-toggler", "toggle")

      const wrapper = document.createElement("div")
      wrapper.style.margin = "1em auto 0"
      wrapper.style.textAlign = "center"
      wrapper.append(hideToggler)

      hideToggler.onclick = function() {
        const nonAuthorComments = document.querySelectorAll("[data-hidden]")
        const isHidden = !nonAuthorComments[0].dataset.hidden.length > 0

        for (const selected of nonAuthorComments) {
          selected.style.display = isHidden ? "none" : "block"
          selected.dataset.hidden = isHidden ? "hidden" : ""
        }

        hideToggler.textContent = (isHidden ? "Show" : "Hide") + " non-author comments"
      }

      document.querySelector(".comments-show").prepend(wrapper)
    }
    
  } else {
    //Refresh if the comments haven't loaded yet
    if (count < 100)  {
      window.setTimeout(showOnlyAuthorComments, 100)
      count++
    }
  }
  
  return true
} 

function setClickFunction(yourFunction) {  
  for (const element of ALL_BUTTONS) {
    if (element) {
      element.removeAttribute("onclick")
      element.onclick = (function (onclick) {
        return function(oEvent) {
          //Reference to event to pass argument properly
          oEvent  = oEvent || event
          if (onclick) onclick(oEvent)

          //Clean up ALL_BUTTONS and count, and run your function
          ALL_BUTTONS.length = 0
          ALL_BUTTONS.push(...ALL_BUTTONS.filter(e=> e.offsetParent != null))
          count = 0   
          yourFunction()
        }
      })(element.onclick)
    }
  }  
}

//Show comments if they're already visible on page load
if (document.querySelector(".thread")) showOnlyAuthorComments()

//Add click functions to every applicable button
setClickFunction(showOnlyAuthorComments)