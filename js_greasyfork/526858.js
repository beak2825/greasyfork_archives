// ==UserScript==
// @name        hacker news - scroll to next most outer post
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/item*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @description 14/02/2025, 4:56:16 pm
// @downloadURL https://update.greasyfork.org/scripts/526858/hacker%20news%20-%20scroll%20to%20next%20most%20outer%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/526858/hacker%20news%20-%20scroll%20to%20next%20most%20outer%20post.meta.js
// ==/UserScript==

const { register } = VM.shortcut;

const viewportHeight = window.innerHeight
const outerMostCommentElements = Array.from(document.querySelectorAll(".comment-tree>tbody>tr:has(td[indent='0'])"))

VM.shortcut.register('n', () => {
  if(document.activeElement.type === 'textarea'){
    // Is this hackey? maybe.
    document.activeElement.value+="n"
    return
  }


  const scrollY = window.scrollY || window.pageYOffset;
  const buffer = 50; // Buffer for invisible padding

    // Find the next element below viewport
  const nextElement = outerMostCommentElements.find(elem => {
    const elemTop = elem.getBoundingClientRect().top;
    return elemTop >= (viewportHeight - buffer);
  });

  if (nextElement) {
    nextElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // else {
  //   // If no next element found, scroll to the last element
  //   const lastElement = outerMostCommentElements[outerMostCommentElements.length - 1];
  //   if (lastElement && lastElement.getBoundingClientRect().top < (viewportHeight - buffer)) {
  //     lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }

//   for (const elem of outerMostCommentElements){
//     const elemYPosition = elem.getBoundingClientRect().top
//     // -50 to give it a bit of a buffer as there is invisible padding and stuff.
//     const elemIsBelowBottomViewport = elemYPosition >= (document.body.scrollTop + (viewportHeight - 50))

//     console.log(elemIsBelowBottomViewport)
//     console.log(elem.getAttribute("id"))

//     if(elemIsBelowBottomViewport){
//       elem.scrollIntoView({behavior:"smooth", block:"center"})
//       break
//     }
//   }

});