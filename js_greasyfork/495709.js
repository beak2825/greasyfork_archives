// ==UserScript==
// @name        PR Branch Buttons
// @namespace   Violentmonkey Scripts
// @match       https://*bitbucket*/projects/*/repos/*/pull-requests/*
// @grant       none
// @version     1.0
// @author      Dovid Weisz
// @description Insert Buttons to copy branch-names as well as a button that generates a git-checkout script that checks out the origin branch tracking the target branch
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/495709/PR%20Branch%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/495709/PR%20Branch%20Buttons.meta.js
// ==/UserScript==
function addButton(elem){
  const content = elem.querySelector(".branch-lozenge-content, .ref-lozenge-content")
  const button = document.createElement("button");
  button.innerHTML = "Copy";
  button.onclick = copy;
  button.style.marginRight = "8px";
  button.style.fontSize = "9px";

  const input = document.createElement("input");
  input.type = "text";
  input.value = content.innerText;
  input.style.position = "absolute";
  input.style.left = "-99999em";

  function copy(){
    input.select();
    document.execCommand("copy");
  }

  elem.prepend(input);
  content.prepend(button);


}
function makeButtons(){
  const branchLozenges = document.querySelectorAll(".branch-lozenge, .ref-lozenge");
  if(branchLozenges.length > 0){
    const [from, to] = Array.from(branchLozenges).map(elem =>
      elem.querySelector(".branch-lozenge-content, .ref-lozenge-content").innerText
    );

    const command = `git fetch && git checkout ${from} && git branch -u origin/${to}`;

    const button = document.createElement("button");
    button.innerHTML = "Checkout";
    button.onclick = copy;
    button.style.marginRight = "8px";
    button.style.fontSize = "9px";

    const input = document.createElement("input");
    input.type = "text";
    input.value = command;
    input.style.position = "absolute";
    input.style.left = "-99999em";

    function copy(){
      input.select();
      document.execCommand("copy");
    }

    const metadataContainer = document.querySelector(".pull-request-metadata");

    metadataContainer.append(input);
    metadataContainer.append(button);


    for(let lozenge of branchLozenges){
      addButton(lozenge);
    }
    return true;
  }
  return false;
}

const contentPannel = document.querySelector("#content");
if(contentPannel){
  if(!makeButtons()) {
    const observer = new MutationObserver(() => {
      if(makeButtons()){
        observer.disconnect();
      }
    });
    observer.observe(contentPannel, { childList: true, subtree: true });
  }
}else{
  console.error("Content pannel not found.");
}