// ==UserScript==
// @name        N1bot inputs
// @description Convenience script for using the N1 bot.
// @namespace   yichizhng@gmail.com
// @include     http://www.animecubed.com/billy/bvs/numberone.html
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18136/N1bot%20inputs.user.js
// @updateURL https://update.greasyfork.org/scripts/18136/N1bot%20inputs.meta.js
// ==/UserScript==

function N1Bot() {
    var matches = document.maction.querySelectorAll("td");
    txts = "";
    for (var i = 0; i < matches.length; i++) {
        var selector = matches[i].querySelector("select");
        if (!selector) continue;
        // console.log(selector ? selector.name : "");
        //var powahs = matches[i].querySelectorAll("img");
        var txt = selector.name + matches[i].textContent;
        txt = txt.slice(0, txt.search("Your Action:"));
        txt = txt.slice(txt.search("HP"));
        txt = txt.replace(/\n/g, " ");
        //console.log(txt);
        txts += txt;
    }
    // console.log(txts);
    
   // document.body.innerHTML = document.body.innerHTML.replace(/<b>Your In-Progress Matches<\/b>/g, '<p>' + txts + "</p>");
    var copyText = document.createElement("p");
    copyText.textContent = txts;
    document.maction.parentElement.insertBefore(copyText, document.maction);
   // txts.onclick = function() {
        window.getSelection().selectAllChildren(copyText);
   // }
    
    var n1input = document.createElement("input");
    document.maction.parentElement.insertBefore(n1input, document.maction);
  var action_map = {
    "Reload": "1^0",
    "Block": "2^0",
    "Fire 1": "3^1",
    "Fire 2": "3^2",
    "Fire 3": "3^3",
    "Fire 4": "3^4",
    "Fire 5": "3^5",
    "Fire 6": "3^6"
  };
  var selectors = document.maction.querySelectorAll("select");
  
    n1input.addEventListener("paste", function(e) {
      e.preventDefault();
      var myRegExp = /\: +(?:Autoload! )?(.+)/g; // the only thing this doesn't parse is "Reload (Game is already over)", which is a reload
      var text = e.clipboardData.getData('text/plain');
      //console.log(text);
      var i = 0;
      while (match = myRegExp.exec(text)) {
        if (i >= selectors.length) break;
        
        selectors[i++].value = action_map[match[1]] || "1^0";
        // console.log(match[1]);
      } 
      //console.log( e.clipboardData.getData('text/plain'));
    }, false);
}

N1Bot();