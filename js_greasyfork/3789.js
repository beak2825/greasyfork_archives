// ==UserScript==
// @name       GitHubSourceTree
// @namespace  http://really-serious.biz/
// @version    1.1.4
// @description  Adds a "Clone in SourceTree" button to github pages
// @respository  https://github.com/jamesgarfield/GitHubSourceTree
// @match https://github.com/*
// @match https://*.github.com/*
// @grant none
// @licence MIT(3)
// @copyright  2014+, James Garfield
// @downloadURL https://update.greasyfork.org/scripts/3789/GitHubSourceTree.user.js
// @updateURL https://update.greasyfork.org/scripts/3789/GitHubSourceTree.meta.js
// ==/UserScript==

//Firefox/GreaseMonkey apppears to not like IIFEs, so use of a named function is required
ghst();
function ghst(){
    const $ = document.querySelectorAll.bind(document);
    
    //Defining constants
    const sourceTreeUrlPrefix = "sourcetree://cloneRepo/"

    //GitHub's "Clone in Desktop" Button
    const gitHubNode = $(".clone-options + a")[0]
    const parentNode = gitHubNode.parentNode;

    //Insert our button between the GitHub Clone button and whatever is after it.
    const insertBeforeNode = gitHubNode.nextSibling;

    var sourceTreeNode = gitHubNode.cloneNode();
    sourceTreeNode.href = sourceTreeUrlPrefix + getSelectedCloneUrl();
    sourceTreeNode.innerHTML = '<span class="octicon octicon-device-desktop"></span>&nbsp;Clone in SourceTree';
    
    parentNode.insertBefore(sourceTreeNode, insertBeforeNode);
    
    //Implement dynamic button link update on schema selection
    const allProtoSwitchButtons = $("button.js-clone-selector");
    for(var i = 0; i < allProtoSwitchButtons.length; ++i) {
      allProtoSwitchButtons[i].addEventListener("click", function(e) {
        //Run update after all other GitHub handlers were executed (so url was updated).
        setTimeout(function() {
          sourceTreeNode.href = sourceTreeUrlPrefix + getSelectedCloneUrl();
        }, 0);
      });
    }

    //Function returns currently selected clone url
    function getSelectedCloneUrl() {
        return $("div.js-clone-url.open")[0].querySelector(".js-url-field").value;
    }
}

