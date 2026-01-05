// ==UserScript==
// @name           Stack Overflow: StackPrinter
// @namespace      http://userscripts.org/users/gangsta75
// @description    Add Printer-Friendly button to question. This script is forked from http://userscripts-mirror.org/scripts/show/77298 and it add supports for HTTPs
// @include        http*://stackoverflow.com/questions/*
// @include        http*://serverfault.com/questions/*
// @include        http*://superuser.com/questions/*
// @include        http*://stackapps.com/questions/*
// @include        http*://meta.stackoverflow.com/questions/*
// @include        http*://*.stackexchange.com/questions/*
// @include        http*://askubuntu.com/questions/*
// @include        http*://answers.onstartups.com/questions/*
// @include        http*://meta.mathoverflow.net/questions/*
// @include        http*://mathoverflow.net/questions/*
// @version        4.0
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/12350/Stack%20Overflow%3A%20StackPrinter.user.js
// @updateURL https://update.greasyfork.org/scripts/12350/Stack%20Overflow%3A%20StackPrinter.meta.js
// ==/UserScript==

function ScriptContent () {
  var re = new RegExp('^http[s]*://(.*?).(com|net|org)');
  var group = re.exec(window.location.href);
  var service = group[1];
  var question = document.getElementById("question").dataset.questionid;

  var url = 'http://www.stackprinter.com/export?format=HTML&service=' + service + '&question=' + question;

  function openUrl() {
    if(!window.open(url)) {
      location.href=url;
    }
  }

  var printDiv = document.createElement('div');
  printDiv.id = 'PrinterFriendly';
  printDiv.style.marginTop = '8px';

  var linkAnchor = document.createElement('a');
  linkAnchor.title = 'Printer-Friendly';
  linkAnchor.addEventListener('click', openUrl, false);

  var image = document.createElement('img');
  image.style.width = '33px';
  image.style.height = '33px';
  image.src = 'data:image/gif;base64,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'
    
  linkAnchor.appendChild(image);
  printDiv.appendChild(linkAnchor);

  var elementQuestion = document.getElementById('question');
  var elementVote = document.getElementsByClassName('votecell')[0];
  elementVote.appendChild(printDiv);
}

function AddScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = ScriptContent.toString() + 'ScriptContent();';
  document.body.appendChild(script);
}

AddScript();
