// ==UserScript==
// @name        GMail Intensifies - google.com
// @namespace   meyerk.com
// @match       https://mail.google.com/mail/u/0/
// @grant       none
// @version     1.0
// @author      MeyerK
// @description Larger font sizes for GMail
// @downloadURL https://update.greasyfork.org/scripts/403459/GMail%20Intensifies%20-%20googlecom.user.js
// @updateURL https://update.greasyfork.org/scripts/403459/GMail%20Intensifies%20-%20googlecom.meta.js
// ==/UserScript==

class GMailI
{  
  patch(ev)
  {
    var elems = null;
    
    // index
    elems = document.querySelectorAll('div.yW');
    this.setSize(elems, 'large');

    elems = document.querySelectorAll('div.xS');
    this.setSize(elems, 'large');
    
    // overview mail thread items
    elems = document.querySelectorAll('div.a3s.aXjCH');
    this.setSize(elems, 'larger');

    // expanded overview mail thred items
    elems = document.querySelectorAll('div.iA.g6');
    this.setSize(elems, 'larger');
    
    // compose areas
    elems = document.querySelector('div.Am.Al.editable.LW-avf.tS-tW[aria-label="Inhalt der Nachricht"]');      
    this.setSize(elems, 'larger');
  }
  
  setSize(nodes, newFontSize)
  {
    if (NodeList.prototype.isPrototypeOf(nodes))
    {
      if (nodes.length > 0)
      {
        for (var i=0; i<nodes.length; i++)
        {
          if (nodes[i].style.fontSize != newFontSize)
          {
            nodes[i].style.fontSize = newFontSize;    
          }
        }
      } 
    }
    else
    {
      if (
          (nodes != null) &&
          (nodes.style.fontSize != newFontSize)
         )
      { 
        nodes.style.fontSize = newFontSize;
      }      
    }
  }
};

var gi = new GMailI();
document.querySelector('body').addEventListener('DOMSubtreeModified', gi.patch.bind(gi));

