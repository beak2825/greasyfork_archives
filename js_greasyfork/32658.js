// ==UserScript==
// @name        HackintoshShop.com unlock
// @namespace   StephenP
// @description Unlock HackintoshShop.com website if you're browsing with an ad-block and you see just a blue page with a 3 dots loader or an orange page with a circular loader. It also skips the "Download Terms" confirmation dialogue window that appears before you actually get to the real download buttons. By the way, I would rather avoid downloading hacked software form such a greedy site.
// @match https://*.hackintoshshop.com/*
// @match https://hackintoshshop.com/*
// @match http://*.hackintoshshop.com/*
// @match http://hackintoshshop.com/*
// @version     3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32658/HackintoshShopcom%20unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/32658/HackintoshShopcom%20unlock.meta.js
// ==/UserScript==
(function(){
  if(document.location.href.includes("/files/file/")){
    const dlButtons=document.getElementsByClassName("download_button");
    for(var i=0;i<dlButtons.length;i++){
      dlButtons[i].parentNode.href=dlButtons[i].parentNode.href+"&confirm=1";
    }
  }
  //try{
    if((document.body.children[0].children[0].children.length==3)||(document.body.children[0].children[0].children.length==6)){
      document.body.children[0].remove();
    }
  //}
  /*catch(err){      //for possible future use, if the wall is loaded dinamically
    console.log(err);
    const targetNode = document.body;
    const config = { attributes: false, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if(document.body.children[0].children[0].children.length==3){
                  document.body.children[0].remove();
                  observer.disconnect();
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }*/
}());