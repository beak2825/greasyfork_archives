// ==UserScript==
// @name         ChatGPT Conversation Lister
// @namespace    https://moukaeritai.work/chatgpt-conversation-lister
// @version      0.8.3.20231006
// @description  Retrieves the titles and unique identifiers of conversations in ChatGPT's web interface. Intended for listing and organization purposes only.
// @author       Takashi SASAKI https://twitter.com/TakashiSasaki
// @match        https://chat.openai.com/
// @match        https://chat.openai.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472814/ChatGPT%20Conversation%20Lister.user.js
// @updateURL https://update.greasyfork.org/scripts/472814/ChatGPT%20Conversation%20Lister.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const hostDiv = document.createElement('div');
    //container.id = "tampermonkeyDialogDiv";
    document.body.appendChild(hostDiv);
    const shadowRoot = hostDiv.attachShadow({mode: 'open'});
    const containerDiv = document.createElement("div");
    containerDiv.id = "containerDiv";
    shadowRoot.appendChild(containerDiv);

    document.addEventListener('keydown', function(e) {
        console.log(e);
        if (e.key === 'Escape') {
            while(containerDiv.firstChild){
                containerDiv.removeChild(containerDiv.firstChild);
            }//while
        }//if
    });

    function createDialogDiv(){
        // ダイアログ要素を作成
        const dialogDiv = document.createElement('div');
        dialogDiv.id = "dialogDiv";
        dialogDiv.style.cssText = `
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  max-height:80%;
  background: white;
  padding: 10px;
  border: 1px solid black;
  z-index: 10000;
  border-radius: 15px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  overflow: auto;
  line-height: 1.7em;
`;
        dialogDiv.innerHTML = `<style>
a:link, a:visited a{
  color: inherit;
  text-decoration: none;
  background-color: #d9ffaf;
  margin-left : 0.5em;
  margin-right: 0.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  border-radius: 10px;
  padding: 1px;
  padding-left: 6px;
  padding-right: 6px;
  box-shadow: 2px 2px 3px rgba(0,0,0,0.4);
</style>`;

        containerDiv.appendChild(dialogDiv);
        return dialogDiv;
    }//createDialogDiv

    function createTextarea(){
        var textarea = document.createElement('textarea');
        textarea.setAttribute("readonly", "readonly");
        textarea.style.cssText = `
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  max-height:80%;
  background: white;
  padding: 10px;
  border: 1px solid black;
  z-index: 10000;
  border-radius: 15px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  overflow: auto;
`;
        textarea.addEventListener("dblclick", (event)=>{
            event.target.select();
            document.execCommand('copy');
        });
        containerDiv.appendChild(textarea);
        return textarea;
    }//createTextarea

    const selector20230827 = "#__next > div > div > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div > div > div > div > nav > div.flex-col > div > div";
    const selector20230828 = "#__next > div > div > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div > div > div > div > nav > div.flex-col.overflow-y-auto";
    const selector20230829 = "#__next > div.overflow-hidden.w-full.h-full > div > div > div > div > nav > div.overflow-y-auto";
    const conversationListDivErrorMessage = "Unable to retrieve the conversation list. This may be due to changes in the DOM structure of ChatGPT. Please await updates to the ChatGPT Conversation Lister.";
    const conversationListDiv = selector20230829;

    var lastScrollTop = 0;
    var originalScrollHeight = 0;
    var observer = null;
    GM_registerMenuCommand("Continuous scrolling on conversation list", ()=>{
        const div = document.querySelector(conversationListDiv);
        if(!div){
            alert(conversationListDivErrorMessage);
            return;
        }//if
        const style = window.getComputedStyle(div);
        console.log(style);
        if(style.overflowY === 'auto'|| style.overflowY === 'visible') {
            console.log(style.overflowY);
            if(!observer) {
                observer = new MutationObserver((mutationList, observer)=>{
                    mutationList.forEach(mutation=>{
                        //if(mutation.target !== div) return;
                        //console.log(mutation.target);
                        if(lastScrollTop != div.scrollTop) {
                            console.log("lastScrollTop", lastScrollTop, "scrollTop", div.scrollTop);
                            lastScrollTop = div.scrollTop;
                            setTimeout(()=> {div.scrollTop = div.scrollHeight}, 500);
                            setTimeout(()=> {div.scrollTop = div.scrollHeight}, 1000);
                            setTimeout(()=> {div.scrollTop = div.scrollHeight}, 2000);
                            setTimeout(()=> {div.scrollTop = div.scrollHeight}, 4000);
                            setTimeout(()=> {div.scrollTop = div.scrollHeight}, 8000);
                            updateConversationList();
                        }//if
                    });//forEach
                });//MutationObserver
            }//if
            observer.observe(div, {
                childList : true,
                attributes: true,
                subtree: true
            });
            originalScrollHeight = div.scrollHeight;
            console.log("originalScrollHeight", originalScrollHeight);
            setTimeout(()=> {div.scrollTop = div.scrollHeight * 2}, 200);
            setTimeout(()=> {div.scrollTop = div.scrollHeight * 3}, 300);
            setTimeout(()=> {div.scrollTop = div.scrollHeight * 4}, 400);
        }//if
    });//GM_registerMenuCommand

    GM_registerMenuCommand("Search in titles of conversations", searchForTitle);

    const searchForTitleButton = document.createElement("img");
    searchForTitleButton.setAttribute("src", "https://moukaeritai-static.glitch.me/svg/search-in-title-icon.svg");
    searchForTitleButton.style.background="lightyellow";
    searchForTitleButton.addEventListener("click", searchForTitle);
    document.querySelector("nav a.flex").insertAdjacentElement("afterend", searchForTitleButton);

    function searchForTitle (){
        updateConversationList();
        const dialogDiv = createDialogDiv();
        const input = document.createElement("input");
        //input.style.position = "absolute";
        input.addEventListener("keyup", event => {
            setTimeout(()=>{
                const nodeList = dialogDiv.querySelectorAll("a");
                for(var i=0; i<nodeList.length; ++i){
                    if(nodeList[i].textContent.toLowerCase().indexOf(input.value.toLowerCase()) == -1){
                        nodeList[i].style.display = "none";
                    } else {
                        nodeList[i].style.display = "";
                    }//if
                }//for
            }, 0); //setTimeout
        }); //addEventListener
        dialogDiv.appendChild(input);

        const idArray = GM_listValues();
        const objects = idArray.map( id=>GM_getValue(id));
        objects.sort( (a,b) => a.projectionId - b.projectionId);
        objects.forEach( object =>{
            const a = document.createElement("a");
            a.setAttribute("href", "https://chat.openai.com/c/" + object.id);
            a.innerText = object.title;
            dialogDiv.appendChild(a);
        });//forEach
    }//searchForTitle

    GM_registerMenuCommand("List conversations in TSV", ()=>{
        updateConversationList();
        const textarea = createTextarea();
        const idArray = GM_listValues();
        const tsv = idArray.map( id =>{
            const conversation = GM_getValue(id);
            return [conversation.id, conversation.title, conversation.projectionId];
        });//map
        const tsvSorted = tsv.sort( (a,b) => {
            return parseInt(a[2] - parseInt(b[2]));
        }//sort
                                  );
        const tsvJoined = tsvSorted.map((x)=> x.join("\t"));
        textarea.value = tsvJoined.join("\n");
    });//GM_registerMenuCommand

    function updateConversationList(){
        //const div = document.querySelector("#__next div nav div div");
        //const div = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.flex-shrink-0.overflow-x-hidden > div > div > div > nav > div.flex-col > div > div");
        //const selector20230810 = "#__next > div.overflow-hidden.w-full.h-full.relative.flex > div.dark.flex-shrink-0.overflow-x-hidden > div > div > div > nav > div.overflow-y-auto";
        const div = document.querySelector(conversationListDiv);
        if(!div){
            alert(conversationListDivErrorMessage);
            return;
        }
        const liNodes = div.querySelectorAll("li");
        console.log(liNodes);
        liNodes.forEach((li)=>{
            console.log(li);
            for (var key in li) {
                if (key.startsWith('__reactProps')) {
                    const id = li[key].children.props.id;
                    const title = li[key].children.props.title;
                    const projectionId = li.dataset.projectionId;
                    console.log(id, title,projectionId);
                    if(!id) continue;
                    if(!title) continue;
                    GM_setValue(id, {id:id, title:title, projectionId:projectionId});
                }//if
            }//for
        });//forEach
    }//updateConversationList
    // Your code here...
})();