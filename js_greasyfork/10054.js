// ==UserScript==
// @name        Furaffinity nested messages
// @description Groups the message center by message source
// @namespace   binarte.com.famessages
// @include     http*://*furaffinity.net/msg/others*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10054/Furaffinity%20nested%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/10054/Furaffinity%20nested%20messages.meta.js
// ==/UserScript==
try {
  //console.log(journals);
  function compactItems(journals, linkidx) {
    journals = journals.getElementsByClassName('message-stream') [0];
    var newjournals = document.createElement('div');
    journals.parentNode.insertBefore(newjournals, journals);
    var journalDivs = {
    };
    var cur = journals.firstChild;
    while (cur) {
      console.log(cur);
      var next = cur.nextSibling;
      if (cur.nodeName === 'LI') {
        if (cur.className === 'section-controls') {
          cur = next;
          continue;
        }
        var user
        if (linkidx) {
          //console.log(cur.getElementsByTagName('a'));
          user = cur.getElementsByTagName('a') [linkidx].href;
        } else {
          user = cur.getElementsByTagName('a');
          user = user[0].href;
        }
        var jdiv = journalDivs[user];
        if (typeof jdiv == 'undefined') {
          jdiv = journalDivs[user] = document.createElement('ul');
          jdiv.style.overflow = 'hidden';
          jdiv.style.marginTop = '0';
          jdiv.style.marginBottom = '0';
          jdiv.className = 'message-stream';
          newjournals.appendChild(jdiv);
        } else if (!jdiv.ExpandButton) {
          var btn = document.createElement('span');
          jdiv.Counter = document.createElement('span');
          jdiv.Counter.textContent = '(2)';
          jdiv.Count = 2;
          var ref = jdiv.firstChild.getElementsByClassName('popup_date') [0];
          ref.parentNode.appendChild(jdiv.Counter);
          jdiv.ExpandButton = btn;
          btn.innerHTML = '⨁';
          btn.title = 'Expand';
          btn.style.display = 'block';
          btn.style.position = 'absolute';
          btn.style.zIndex = '10';
          btn.style.cursor = 'pointer';
          btn.style.marginLeft = '-1em';
          btn.Div = jdiv;
          btn.Collapsed = true;
          btn.CollapsedHeight = '' + cur.offsetHeight + 'px';
          btn.onclick = function () {
            if (this.Collapsed) {
              this.Div.style.maxHeight = '';
              if (this.Div.Counter) {
                this.Div.Counter.style.display = 'none';
              }
              this.Collapsed = false;
              this.innerHTML = '⨀';
              this.title = 'Collapse';
            } else {
              this.Div.style.maxHeight = this.CollapsedHeight;
              if (this.Div.Counter) {
                this.Div.Counter.style.display = '';
              }
              this.Collapsed = true;
              this.innerHTML = '⨁';
              this.title = 'Expand';
            }
          }
          var checkbox = jdiv.getElementsByTagName('input') [0];
          console.log(checkbox);
          checkbox.ExpandButton = btn;
          checkbox.Div = jdiv;
          checkbox.onchange = function () {
            if (this.ExpandButton.Collapsed) {
              var inputs = this.Div.getElementsByTagName('input');
              for (var i = 1; i < inputs.length; i++) {
                var cur = inputs[i];
                cur.checked = this.checked;
                cur = cur.nextSibling;
              }
            }
          }
          jdiv.style.maxHeight = btn.CollapsedHeight;
          jdiv.insertBefore(btn, jdiv.firstChild);
          jdiv.HR = document.createElement('HR');
          jdiv.appendChild(jdiv.HR);
        } else {
          jdiv.Counter.textContent = ' (' + (++jdiv.Count) + ')';
        }
        console.log(jdiv.HR);
        
       
        jdiv.appendChild(cur);
         if (jdiv.HR){
          jdiv.appendChild(jdiv.HR);
        }
      }
      cur = next;
    }
    newjournals.id = journals.id;
    journals.parentNode.appendChild(journals);
  }
  var journals = document.getElementById('messages-journals');
  if (journals) {
    compactItems(journals, 1);
  }
  var types = [
    'shouts',
    'submission_comments',
    'user_favorites',
    'character_comments',
    'journal_comments'
  ];
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    var shouts = document.getElementById(type);
    if (shouts) {
      compactItems(shouts, false);
    }
  }
} catch (ex) {
  console.log(ex);
}
