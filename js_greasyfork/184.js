// ==UserScript==
// @name        osu! select code block
// @namespace   s4nji
// @description Highlights Code Blocks
// @include     https://osu.ppy.sh/forum/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/184/osu%21%20select%20code%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/184/osu%21%20select%20code%20block.meta.js
// ==/UserScript==

/*\
 * Creates a selection around the node
\*/

window.onload = function() {

  // Select Node | Credits to Álvaro G. Vicario- http://stackoverflow.com/a/4012861
  function selectNode(myNode){
      // Create a range
      try{ // FF
          var myRange = document.createRange();
      }catch(e){
          try{ // IE
              var myRange = document.body.createTextRange();
          }catch(e){
              return;
          }
      }

      // Asign text to range
      try{ // FF
          myRange.selectNode(myNode);
      }catch(e){
          try{ // IE
              myRange.moveToElementText(myNode);
          }catch(e){
              return;
          }
      }

      // Select the range
      try{ // FF
          var mySelection = window.getSelection();
          mySelection.removeAllRanges(); // Undo current selection
          mySelection.addRange(myRange);
      }catch(e){
          try{ // IE
              myRange.select();
          }catch(e){
              return;
          }
      }
  }

  // Add select code links/buttons next to code titles
  var el = " <a href='#' class='select-code'>[Select Code]</a>";
  jQuery('.codetitle').append(el);

  // Select Code Block near clicked select code links/buttons
  jQuery('.select-code').click( function(e) {
      e.preventDefault();
      selectNode( jQuery(this).parent().next()[0] );
  });

};
