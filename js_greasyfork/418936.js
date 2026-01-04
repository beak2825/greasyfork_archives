// ==UserScript==
// @name            IMDb Sort Episodes by Rating
// @description     This script adds a button to sort tv show episodes by rating on IMDB. 
// @version         1
// @match           *://www.imdb.com/title/tt*
// @grant           none
// @namespace https://greasyfork.org/users/719286
// @downloadURL https://update.greasyfork.org/scripts/418936/IMDb%20Sort%20Episodes%20by%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/418936/IMDb%20Sort%20Episodes%20by%20Rating.meta.js
// ==/UserScript==


(function(){

  	window.addEventListener('load', () => {
      addButton('Sort by Rating', sortByRating)
      setInterval(checkButtonWasNotDeleted, 2000);
    })

    function checkButtonWasNotDeleted() {
      if(!document.getElementById("Sort by Rating")){
        addButton('Sort by Rating', sortByRating)
      }
    }
  
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {"float":"right", "margin-right":"1em", "font-size": "0.50em", 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.getElementById("episode_top").appendChild(button)
        button.innerHTML = text
      	button.id = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }

    function sortByRating() {
        parent = document.getElementsByClassName('list detail eplist')[0]
      
      	for(var cardChild=parent.firstChild; cardChild!==null; cardChild=cardChild.nextSibling) {
          if(!cardChild.className){
            continue;
          }
          cardChild.cardValue = getDescendantWithClass(cardChild,"ipl-rating-star__rating").textContent;
          console.log(cardChild);
          console.log(cardChild.cardValue);
        }
      
      [...parent.children]
      .sort((a,b)=>a.cardValue<b.cardValue?1:-1)
      .forEach(node=>parent.appendChild(node));
    }
  
    function getDescendantWithClass(element, clName) {
        var children = element.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].className &&
                children[i].className.split(' ').indexOf(clName) >= 0) {
                return children[i];
             }
         }
         for (var i = 0; i < children.length; i++) {
             var match = getDescendantWithClass(children[i], clName);
             if (match !== null) {
                 return match;
             }
         }
         return null;
    }
}())