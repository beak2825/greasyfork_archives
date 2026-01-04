// ==UserScript==
// @name     Xenforo minimize threads
// @version  1
// @grant    Uvigz
// @description Adds a button to minimize thread forums
// @match *://forums.spacebattles.com/forums/*/page*
// @match *://forums.spacebattles.com/forums/*/?*
// @match *://forums.spacebattles.com/forums/*/
// @match *://forums.sufficientvelocity.com/forums/*/page*
// @match *://forums.sufficientvelocity.com/forums/*/?*
// @match *://forums.sufficientvelocity.com/forums/*/
// @namespace https://greasyfork.org/users/42312
// @downloadURL https://update.greasyfork.org/scripts/394327/Xenforo%20minimize%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/394327/Xenforo%20minimize%20threads.meta.js
// ==/UserScript==

// if container's elements should be hidden.
var hidden = function(el, className) {
    console.log('hidden');
    // prepare button
    var button;
    // then for every children
    [...el.children].forEach(element => {
         // check if its title
        if (element.classList.contains('structItem-cell--main')) { 
                // if yes should leave title alone and deal with button, check all of its children
            [...element.children].forEach(element2 => {
                // check if its hide button
                if (element2.classList.contains('hide-container')) {
                    // if yes, save its reference.
                    button = element2;
                }
                // check if its title
                else if (element2.classList.contains('structItem-title')){
                    // if its title, then add code for better design
                    element2.style.display = 'inline-block';
                } else {
                    // if no, then hide it
                    element2.style.display = 'none';
                }
            });
            // then deal with button
            console.log(el, element)
            dealWithButtom('unhide', unhide, el, element, className, button);
        } else {
            console.log(element);
            // if no, then hide it
            element.style.display = 'none';
        }
    });
}


// if you want to hide element
var hide = function(el, className) {
    // do all the thinks as if element was hidden
    hidden(el, className);
    // then add elements key to hidden elements list
    hiddenList.push(className);
    // and then store the list in local storage
    localStorage.setItem(hostname + "hiddenList", JSON.stringify(hiddenList));
}

// if you want to unhide element
var unhide = function(el, className) {
    // do all the thinks as if element was unhidden
    unhidden(el, className);
    // then remnove elements key from hidden elements array
    // (this actually creanes new filtered array without 
    //  elements key, then overwrites the array, but practically, 
    // it should be the same as deleting elements key from array 
    // but it's easier to read)
    hiddenList = hiddenList.filter(e => e !== className)
    // and then store the list in local storage
    localStorage.setItem(hostname + "hiddenList", JSON.stringify(hiddenList));
}

// if container's elements should be unhidden.
var unhidden = function(el, className) {
    console.log('unhidden');
    // prepare button
    var button;
    // then for every children
    [...el.children].forEach(element => {
         // check if its title
        if (element.classList.contains('structItem-cell--main')) { 
                // if yes should leave title alone and deal with button, check all of its children
            [...element.children].forEach(element2 => {
                // check if its hide button
                if (element2.classList.contains('hide-container')) {
                    // if yes, save its reference.
                    button = element2;
                }
                // check if its title
                else if (element2.classList.contains('structItem-title')){
                    // if its title, then add code for better design
                    element2.style.display = 'initial';
                } else {
                    // if no, then hide it
                    element2.style.display = 'initial';
                }
            });
            // then deal with button
            console.log(el, element)
            dealWithButtom('hide', hide, el, element, className, button);
        } else {
            console.log(element);
            // if no, then hide it
            element.style.display = 'table-cell';
        }
    });
}

dealWithButtom = function(text, functionReference, el, container, className, button) {
    if (!button) {
        button = document.createElement ('div');
        button.className = 'hide-container button--cta button';
        button.innerHTML = text;
        button.onclick = () => {functionReference(el, className)}; 
        // and add it to container
        container.appendChild(button);
        } else {
        // if there was, edit it in place
        button.innerHTML =text;
        button.onclick = () => {functionReference(el, className)}; 
    }
}

// on page load: get hidden elements list from local storage, 
// or if there's nothing in localstorage, create new array
var hostname = window.location.hostname;
var hiddenList = JSON.parse(localStorage.getItem(hostname + 'hiddenList')) || [];
// select all threads
document.querySelectorAll(".structItem--thread.js-inlineModContainer").forEach(el =>{
    // get threads class key
    var className = el.className.match(/js-threadListItem-\d+/);
    if(className){
        className = className[0];
    }

    // then check if it should be hidden
    if (hiddenList.filter(e => e === className).length > 0){
        // if yes, hide it
        hidden(el, className);
    } else {
        // if no, then create hide button
        unhidden(el, className);
    };
});

var style = document.createElement('style');
  style.innerHTML = `
  .hide-container {
    float: right;
  }
  `;
  document.head.appendChild(style);