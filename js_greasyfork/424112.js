// ==UserScript==
// @name        Inline quote links arch.b4k.co
// @namespace   Zero_G@4d7d460c-0424-11eb-adc1-0242ac120002
// @description Clicking quote links will inline expand the quoted post
// @include     *://arch.b4k.co/*/thread/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/424112/Inline%20quote%20links%20archb4kco.user.js
// @updateURL https://update.greasyfork.org/scripts/424112/Inline%20quote%20links%20archb4kco.meta.js
// ==/UserScript==

(function(){
  // Wait for document to load
  $( document ).ready(function() {
    // Create event listeners
    const backlinks = document.getElementsByClassName('backlink');
    createEventListeners(backlinks);
  });
  
  function createEventListeners(classArray){
    Array.from(classArray).forEach(element => {
      // Disable normal behaviour of click
      element.onclick = function(){return false};
      // Add inline behaviour
      element.addEventListener('click', inlineQuote, false);
    });
  }
  
  function inlineQuote(event){
    // Get id of target quote
    var quoteID = event.target.href;
    quoteID = quoteID.substring(quoteID.indexOf('#')+1) // can also be done with dataset.post
    
    // Get id of current post
    var currentPostId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // Check if quote is already inlined
    var post_wrapper = event.target.parentNode.parentNode.parentNode;
    var inlineQuote = post_wrapper.querySelector('#inline' + quoteID);
    
    if(inlineQuote){
      // Inline exists, remove it and its childs, restore original posts
      let quotelinks = event.target.parentNode.getElementsByClassName('backlink');
      
      // Get all sub inline posts (if there are any)
      var subInlineQuotes = inlineQuote.querySelectorAll('[id^=inline]');
      subInlineQuotes = Array.from(subInlineQuotes);
      subInlineQuotes.push(inlineQuote); // add current for the next processing
      
      // Remove and show originals
      subInlineQuotes.forEach(element => {
        let id = element.id;
        id = id.replace('inline', ''); // remove inline from id to get original id
        // Show original post
        document.getElementById(id).style.display = 'block';
        // delete inline node
        element.remove();
        
        // Restore quote link color
        Array.from(quotelinks).forEach(link => {
           if(link.dataset.post === id) link.style.color = '#81a2be';
        });
      });
      
    } else{
      // Inline does NOT exist, hide original post, put inline in current post
      
      // Get quote and clone it
      var quote = document.getElementById(quoteID);
      var quoteClone = quote.cloneNode(true);

      // Set new id for cloned node
      quoteClone.id = 'inline' + quoteID;
      // If quote was already inlined in another post set it visible
      quoteClone.style.display = 'block';

      // Set event listeners for cloned node
      var cloneBackLinks = quoteClone.getElementsByClassName('backlink');
      cloneBackLinks = Array.from(cloneBackLinks);
      // Don't add event listner to link back to post
      for (i = 0; i < cloneBackLinks.length; i++) {
        if(cloneBackLinks[i].dataset.post === currentPostId){
          cloneBackLinks[i].onclick = function(){return false}; // disable link
          cloneBackLinks.splice(i, 1); // remove from array
          i--; // balance fori for element removed
        }
      } 
      createEventListeners(cloneBackLinks);

      // Hide original quote
      quote.style.display = 'none'; // block is default

      // Get div in post to insert inline
      var textNode = null;
      Array.from(post_wrapper.childNodes).forEach(element => {
        if(element.className === 'text') textNode = element;
      });

      // Insert inline quote
      textNode.insertBefore(quoteClone, textNode.firstChild)
      
      // Set link to quote to darker color
      event.target.style.color = '#4d5f6e';
    }
  }
})()