// ==UserScript==
// @name        Add star rating buttons to list page
// @namespace   https://rateyourmusic.com
// @match       https://rateyourmusic.com/lists/new_item*
// @license     MIT
// @version     1.1
// @author      AnotherBubblebath
// @description Allows for ratings to pop into the textbox with manual customization.
// @downloadURL https://update.greasyfork.org/scripts/546575/Add%20star%20rating%20buttons%20to%20list%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/546575/Add%20star%20rating%20buttons%20to%20list%20page.meta.js
// ==/UserScript==

(function(){
 'use scrict';

 window.addEventListener("load", function () {
   var starButtons = document.createElement('div')

   if (document.querySelector('#infobox > tbody > tr > td > #album') != null){
     document.querySelector('#infobox > tbody > tr > td > #album').after(starButtons);
   }
   else if (document.querySelector('#infobox > tbody > tr > td > .album') != null){
     document.querySelector('#infobox > tbody > tr > td > .album').after(starButtons);
   }
   else if (document.querySelectorAll('#infobox > tbody > tr > td')[1].querySelector('.album') != null){
      document.querySelectorAll('#infobox > tbody > tr > td')[1].querySelector('.album').after(starButtons);
   }
   let starButton = document.createElement('div')
   starButton.innerHTML = '<button id="starButton" class="scoreButtons" type="button">' + '★</button>' + '<button id="halfButton" class="scoreButtons" type="button">' + '½</button>' //Replace ★ and ½ with any symbol or statement you want
   starButtons.appendChild(starButton)

   document.getElementById("starButton").addEventListener("click", addStarClickAction, false)
   document.getElementById("halfButton").addEventListener("click", addHalfClickAction, false)

   starButton.style.marginTop = '1vh'
   starButton.style.marginLeft = '0.1vw'
   var scoreButtons = document.querySelectorAll('.scoreButtons')[0]
   scoreButtons.style.color = 'gold'
   scoreButtons.style.fontSize = '22px'
   scoreButtons.style.padding = '0.8vh 0.8vw 0.8vh 0.8vw'
   scoreButtons.style.marginRight = '0.5vw'
   scoreButtons.style.borderColor = 'white'
   scoreButtons.style.backgroundColor = 'black'
   scoreButtons.style.borderRadius = '5px'
   var scoreButtons = document.querySelectorAll('.scoreButtons')[1]
   scoreButtons.style.color = 'gold'
   scoreButtons.style.padding = '0.8vh 0.8vw 0.8vh 0.8vw'
   scoreButtons.style.fontSize = '22px'
   scoreButtons.style.borderColor = 'white'
   scoreButtons.style.backgroundColor = 'black'
   scoreButtons.style.borderRadius = '5px'

   //Customize stars:
   function addStarClickAction (zEvent){
     const textbox = document.getElementById("item_description");
     textbox.value = textbox.value + '★'; //Replace ★ with any symbol you want pasted into your list
     textbox.focus()
   }
   function addHalfClickAction (zEvent){
     const textbox = document.getElementById("item_description");
     textbox.value = textbox.value + '½'; //Replace ½ with any symbol you want pasted into your list
     textbox.focus()
   }
  }, false)
})();