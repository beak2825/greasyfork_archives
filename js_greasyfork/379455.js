// ==UserScript==
// @name VnLinks Bulk Download
// @namespace Violentmonkey Scripts
// @description Bulk Download VnLinks
// @icon https://vnlinks.net/img/favicon.ico
// @run-at document-start
// @match *://vnlinks.net/**
// @grant none
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/379455/VnLinks%20Bulk%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/379455/VnLinks%20Bulk%20Download.meta.js
// ==/UserScript==

var slinks = '';
function inputLink(i) {
    if (i >= slinks.length) return false;

    $('#input-params-link').scope().params.link = slinks[i];
    $('#input-params-link').scope().getLink();

    return true;
}

document.addEventListener("DOMContentLoaded", function(event) {
  $('#step-3').append('<button id="bulkDownload" type="button" class="btn btn-lg btn-info m-b-5">Download hàng loạt</button>');
  $('#bulkDownload').click(function() {
    slinks = prompt("Links:").split(" ");

    if (slinks) {
        inputLink(0);
    }
  });
  
  // Select the node that will be observed for mutations
  var targetNode = document.getElementById('input-results-downloadLink');

  // Options for the observer (which mutations to observe)
  var config = { attributes: true, childList: true, subtree: true };

  var links = [];

  var i = 0;

  // Callback function to execute when mutations are observed
  var callback = function(mutationsList, observer) {
      for(var mutation in mutationsList) {
          if (mutationsList[mutation].type == 'attributes') {
              var link= document.getElementById('input-results-downloadLink').value;
              if (links.indexOf(link) === -1 && link) {
                  links.push(link);
                  if (!inputLink(++i)) {
                      console.log('wget -bcq ' + links.join(" &\nwget -bcq "));
                      observer.disconnect();
                  }
              }
          }
      }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
