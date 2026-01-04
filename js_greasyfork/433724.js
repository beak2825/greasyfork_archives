// ==UserScript==
// @name        sort:score Button
// @namespace   Violentmonkey Scripts
// @match       *://rule34.xxx/*
// @grant       none
// @version     1.3
// @author      -
// @description 11.10.2021, 12:35:31
// @require     https://code.jquery.com/jquery-3.5.1.min.js 
// @downloadURL https://update.greasyfork.org/scripts/433724/sort%3Ascore%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/433724/sort%3Ascore%20Button.meta.js
// ==/UserScript==

// this function get exicuted when the document is ready so all the elements on the page are loaded and we can access everything we need for the scipt
// first and only thing i just form the jquery libary but it has so many more things that are just nice to have (that we install with the  @require     https://code.jquery.com/jquery-3.5.1.min.js line)
// libary = is basical a colection of code that you can use if you import the libary into the program
$("document").ready(function() {
  // now that we are sure that everything is set up the real fun begins 

  // FIRST off we need to grab everything that we need into some variables variables can hold anything from numbers to text to in this case Page elements 
  // if you want to get a page element you can just the inspect page tool to look up which one you need and what the name, id, or classname is
  
  // here we grab the searchField because we want to know which tags we have to search for. We stor the reference in the searchField variabl
  var searchField = document.getElementsByName("tags")[0];
  // we do the same for the seachButton because that is the button we need to press if we want to research with the "sort:score" added at the end
  var searchButton = document.getElementsByName("commit")[0];
  
  // now to create a new element we need the createElement Methond that lives in the document Object
  // we can just tell it okay create a new button element and store the reference to that in the new vaible newButton
  var newButton = document.createElement("Button");
      // now we just specify what we want the button to do First of all it needs the text to say "sort:score" you could do all kind of stuf here but i let you figure that out
      newButton.innerHTML = "sort:score";
      // when you mose over it the cursor changes to a pointer
      newButton.style.cursor = "pointer";
  
      // now for the importen part what does the button do when it is clicked i encurage you to look in to the button onclick on google i used an inline function here but you could go for a function refernce just as well
      newButton.onclick = (e) => {
          // now in here we tell the script what to do
          // first we grap the seachField varible from earlier and tell add the "sort:score" at the end of the tags that are already in there
          // for adding something on to an existing value we can use += if we wanted to override the value that is alread in it we just use =
          // in this case we want "already existing tags" + "sort:score" tho
          searchField.value += " sort:score"
          // now that we have the search term all we need to to is press the searchButton we can just grap the refreance from early and call the click methond with the "()"
          searchButton.click();
      };
      // perfect now the button is well specifyed and all we need to do is get it on the page for that we need to get a "parent"Element that will hold the new button
      // we grap all Elements form the page with the class name "awesomplete"and then we use the first index of that array and call the appendChild function in the "()" we pass it the element is should append
      document.getElementsByClassName("awesomplete")[0].appendChild(newButton);
})