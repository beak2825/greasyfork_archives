// ==UserScript==
// @name        Wykop - scroll to unread comment
// @description Scrolls window to first/next/prev unread comment @ wykop.pl
// @namespace   Wykop scripts
// @include     http://www.wykop.pl/link/*
// @version     1.5
// @license     MIT License
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1989/Wykop%20-%20scroll%20to%20unread%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/1989/Wykop%20-%20scroll%20to%20unread%20comment.meta.js
// ==/UserScript==

var offsetFix = 0; /* poeksperymentowac, jesli przewija za mało lub za duzo */

if(document.getElementsByClassName('nav fix-b-border')[0].getElementsByTagName('ul')[0]
    .getElementsByTagName('a')[document.getElementsByClassName('nav fix-b-border')[0].getElementsByTagName('ul')[0]
        .getElementsByTagName('a').length-1]
    && document.getElementsByClassName('nav fix-b-border')[0].getElementsByTagName('ul')[0]
    .getElementsByTagName('a')[document.getElementsByClassName('nav fix-b-border')[0].getElementsByTagName('ul')[0]
        .getElementsByTagName('a').length-1].href.indexOf('/unreadCommentsToggle/')>0)
{
    var nowe_komcie = document.getElementsByClassName('wblock lcontrast dC  newComment');
    var ile_nowych = nowe_komcie.length;
    var aktual_poz = -1;   
    
    function dodaj_button(komcie_node, ii)
    {
        if (!ile_nowych) return;
        var button_node = document.createElement('button');
        if (ii < ile_nowych - 1)
        {
                button_node.innerHTML = 'NEXT';
                button_node.val = ii + 1;
                button_node.onclick = function() {
                    nowe_komcie[this.val].scrollIntoView(true);
                    window.scrollBy(0, offsetFix);
                    aktual_poz = ii + 1;
                }; /*    button_node.onclick = function(){nowe_komcie[ii+1].scrollIntoView(true);};*/
        }
        else
        {
            button_node.onclick = function() {
                nowe_komcie[0].scrollIntoView(true);
                window.scrollBy(0, offsetFix);
                aktual_poz = 0;
            };
            button_node.innerHTML = 'FIRST';
        }
        komcie_node.appendChild(button_node);
    }
    for (var i = 0; i < ile_nowych; ++i)
    {
        dodaj_button(nowe_komcie[i], i);
    }
    var button_node = document.createElement('button');
    button_node.innerHTML = 'FIRST';
    button_node.onclick = function () {
        nowe_komcie[0].scrollIntoView(true);
        window.scrollBy(0, offsetFix);
        aktual_poz = 0;
    }; /*  document.getElementById('comments-list-entry').appendChild(button_node);*/
    document.getElementById('itemsStream').insertBefore(button_node, document.getElementById('itemsStream').firstChild);
    function nastepny(e)
    {
      e = e || window.event;
      if (e.keyCode == '220' && !e.shiftKey)
      {
           aktual_poz = (aktual_poz+1)%ile_nowych;
      }
      else if (e.keyCode == '220' && e.shiftKey)
      { /* z shiftem jedziemy wstecz */
           if(aktual_poz==-1)
               aktual_poz = ile_nowych - 1;
           else
               aktual_poz = (ile_nowych+aktual_poz-1) % ile_nowych;
      }
      else
          return;
      nowe_komcie[aktual_poz].scrollIntoView(true);
      window.scrollBy(0, offsetFix);
    }

    document.onkeydown = nastepny;
}
void 0;
