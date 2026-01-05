// ==UserScript==
// @name        BvS Workshop: Select for Distillation
// @namespace   BvS
// @description Select an item directly from the distillation list.
// @include     http://*animecubed.com/billy/bvs/workshop.html
// @license     http://wtfpl.org/
// @version     1.0.1
// @history     1.0.1 [Medin] Updated with license information
// @history     1.0.0 [Medin] Initial version
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4836/BvS%20Workshop%3A%20Select%20for%20Distillation.user.js
// @updateURL https://update.greasyfork.org/scripts/4836/BvS%20Workshop%3A%20Select%20for%20Distillation.meta.js
// ==/UserScript==

(function(){
  "use strict";
  try {
    // auxiliary DOM-tree-constructor function
    var cE = function(name) {
      var elem = document.createElement(name);
      for (var i = 1; i < arguments.length; ++i)
        elem.appendChild(arguments[i]);
      return elem;
    }

    // The distillation form.
    var form = document.forms.reduc;
    
    // The table as a whole.
    var dt = form.getElementsByClassName("stats2")[0];
    
    // The relevant rows. (No header, no footer, no locked items.)
    var rows = Array.prototype.slice.call(dt.getElementsByTagName("tr"), 2, -3)
         .filter(function(n) { return !n.textContent.match(/ \(Locked\)$/); });
    
    // The dropdown, numeric input field, and action-submission link.
    var selector = document.forms.reduc.elements.crackitem;
    var counter = document.forms.reduc.elements.amount;
    var submitLink = document.forms.reduc.getElementsByTagName("a")[0]

    // The modifying action.
    rows.forEach(function(row, index) {
      var num = parseInt(row.children[0].textContent.trim())
      var name = row.children[1].textContent.trim();

      if (selector[index].textContent != name) {
        throw ["Name mismatch", row, index, name];
      }
      var f = function() {
        selector.selectedIndex = index;
        counter.value = num;
        submitLink.focus();
      }
      
      // Create the tree-fragment.
      var span, Ldiv, Rdiv, link;
      span = cE("span",
                Ldiv = cE("div"),
                Rdiv = cE("div",
                          link = cE("a")
                          )
                );
      Ldiv.style.cssFloat = "left";
      Rdiv.style.cssFloat = "right";
      Rdiv.style.textAlign = "right";
      link.appendChild(document.createTextNode("Select"));
      link.href = "javascript:;";
      link.onclick = f;

      // Splice in the constructed tree.
      var textTD = row.children[1];
      while (textTD.firstChild)
        Ldiv.appendChild(textTD.firstChild);
      textTD.appendChild(span);
    });

  } catch (e) {
    // report and give up
    console.log(e);
  }
})();