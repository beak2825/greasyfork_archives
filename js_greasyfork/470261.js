// ==UserScript==
// @name         Copy a Gerrit link for querying CR And add a button to browse branch code
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  快捷浏览分支代码，快捷拷贝查询CR的链接，快捷选择cherry-pick的分支
// @author       Jackie
// @match        https://gerrit.mot.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mot.com
// @run-at       document-end
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.log
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/470261/Copy%20a%20Gerrit%20link%20for%20querying%20CR%20And%20add%20a%20button%20to%20browse%20branch%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/470261/Copy%20a%20Gerrit%20link%20for%20querying%20CR%20And%20add%20a%20button%20to%20browse%20branch%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let action = ()=>{
        sleep(100).then(()=>{
            addButtons();
        });
    }
    //action();
    sleep(1000).then(()=>{
        let c = document.getElementById("gerrit_header");
        observeDOM(c, /*onAdd*/ action, /*onRemove*/ action);
    });
})();

const KEY_SUGGEST_BRANCH = "suggested_branches_";
let allSuggestBranches = ["mt-r1/bt", "mt-r2/bt", "mt-r3/bt"];

function addButtons() {
    console.log(`=======================addButtons`)
    if(document.getElementById('btn_cp_link')) return;
    let btnCopyCrQueryLink = createButton("CopyQueryLink");
    btnCopyCrQueryLink.id = 'btn_cp_link';
    btnCopyCrQueryLink.onclick = () => {
        let msg = "CR not found!"
        let link = getQueryLink();
        navigator.clipboard.writeText(link);
        showSnackbar(link ? `Copied: ${link}` : 'CR not found!');
    }
    let btnOpenCrQueryLink = createButton("OpenQueryLink");
    btnOpenCrQueryLink.onclick = () => {
        let msg = "CR not found!"
        let link = getQueryLink();
        if(!link) {
            showSnackbar('CR not found!')
        } else {
            GM.openInTab(link, { active: true });
        }
    }
    let parent = document.getElementsByClassName("com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-idAndStatus")[0];
    if(parent) {
        parent.classList.add('com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-headerButtons');
        parent.appendChild(btnCopyCrQueryLink);
        parent.appendChild(btnOpenCrQueryLink);
    }

    let btnBrowseBranch = createElement({
        name:"a",
        class:"com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-projectSettings",
        innerHTML: "Browse Branch"
    });
    btnBrowseBranch.target = `_blank`;

    let branchTd = document.querySelector('#change_infoTable > tbody > tr:nth-of-type(7) > td:nth-of-type(1)');
    let branchName = branchTd.firstChild.text;
    btnBrowseBranch.href = `https://gerrit.mot.com/plugins/gitiles/${getProjectName()}/+/refs/heads/${branchName}`;
    branchTd.appendChild(btnBrowseBranch);

    GM.getValue(KEY_SUGGEST_BRANCH + getProjectName(), []).then((it)=>{
        GM.log(`allSuggestBranches: ${it}`);
        allSuggestBranches = it;
    });
    let addSuggestBranchAction = ()=>{
        sleep(100).then(addSuggestBranchButtons);
    }
    observeDOM(document.body, /*onAdd*/ addSuggestBranchAction);
}

function getQueryLink() {
    let link = null;
    let crDiv = document.getElementsByClassName("com-google-gerrit-client-change-CommitBox_BinderImpl_GenCss_style-text")[0];
    if(crDiv && crDiv.firstElementChild){
        link = "https://gerrit.mot.com/#/q/" + crDiv.firstElementChild.text;
    }
    return link;
}

function addSuggestBranchButtons(readd){
    GM.addStyle(`.com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-label_user{
        margin: 3px;
    }`);
    let parent = getSuggestBranchParent(readd);
    if(parent){
        for (let branch of allSuggestBranches) {
            createBranchSuggestButton(branch, parent);
        }
        createAddSuggestButton(parent);
    }
}

function getSuggestBranchParent(readd) {
    let parent = document.querySelector('.gwt-DialogBox.commentedActionDialog .smallHeading');
    if(parent && parent.textContent && parent.textContent.startsWith('Cherry Pick to')){
        let div = document.getElementById('suggested_branches');
        if(div && readd){
            div.parentElement.removeChild(div);
        }
        if(!div){
            div = document.createElement('div');
            div.id = "suggested_branches";
            parent.appendChild(div);
        }
        return div;
    }
    return null;
}

function createAddSuggestButton(parent) {
    if(document.getElementById('addSuggestBranch')) return;
    let span = document.createElement('span');
    span.role = "listitem";
    span.id = 'addSuggestBranch';
    span.title = "Add Suggest branch";
    span.className="com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-label_user";
    span.innerText = '+';
    span.onclick = ()=>{
        let branchName = prompt('Branch Name', '');
        if(branchName){
            getBranchInput().value = branchName;
            addSuggestBranch(branchName);
            span.before(createBranchSuggestButton(branchName));
        }
    }
    parent.appendChild(span);
}

function removeSuggestBranch(branchName) {
    allSuggestBranches.removeByValue(branchName);
    GM.setValue(KEY_SUGGEST_BRANCH + getProjectName(), allSuggestBranches);
}

function addSuggestBranch(branchName) {
    allSuggestBranches.push(branchName);
    GM.setValue(KEY_SUGGEST_BRANCH + getProjectName(), allSuggestBranches);
}

function getProjectName(){
    return document.querySelector('#change_infoTable > tbody > tr:nth-of-type(6) > td:nth-of-type(1)').firstChild.text;
}

function createBranchSuggestButton(branchName, parent) {
    if(document.getElementById(branchName)) return;
    let span = document.createElement('span');
    span.role = "listitem";
    span.title = "Suggested branch";
    span.id = branchName;
    span.className="com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-label_user";
    span.innerText = branchName;
    span.onclick = ()=>{
        let branchInput = getBranchInput();
        branchInput.value = branchName;
    }
    let deleteButton = document.createElement('button');
    deleteButton.title = "Remove suggested branch"
    deleteButton.innerText = 'X';
    deleteButton.onclick = ()=>{
        removeSuggestBranch(branchName);
        GM.setValue(KEY_SUGGEST_BRANCH, allSuggestBranches);
        span.parentElement.removeChild(span);
    }
    span.appendChild(deleteButton);
    if(parent){
        parent.appendChild(span);
    }
    return span;
}

function getBranchInput() {
    return document.querySelector('.gwt-SuggestBox');
}

function showSnackbar(msg) {
    msg = msg ? msg : "Copied succesfully";
    let snackbar = getSnackbar(msg);
    snackbar.innerHTML = msg;
    snackbar.className = "show";
    setTimeout(function(){
        snackbar.className = snackbar.className.replace("show", "");
    }, 1500);
}

function getSnackbar() {
    let snackbar = document.getElementById('snackbar');
    if(!snackbar) {
        snackbar = document.createElement("div");
        snackbar.id="snackbar";
        document.getElementsByClassName('screen')[0].appendChild(snackbar);
    }
    GM.addStyle(`
      #snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 50px;
  font-size: 17px;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 50px; opacity: 1;}
}

@keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 50px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {top: 50px; opacity: 1;}
  to {top: 0; opacity: 0;}
}

@keyframes fadeout {
  from {top: 50px; opacity: 1;}
  to {top: 0; opacity: 0;}
}
    `);
    return snackbar;
}

function createButton(text) {
    let button = createElement(
        {
            name:"button",
            class:"com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-highlight",
        }
    );
    button.type = "button";
    button.title = text;
    let div = document.createElement('div');
    div.innerHTML=text;
    button.appendChild(div);
    return button;
}

function createElement(info) {
    if(!info.name) return undefined;
    let element = document.createElement(info.name);
    if(info.innerHTML) element.innerHTML = info.innerHTML;
    if(info.class) {
        element.className = info.class;
    }
    return element;
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

const observeDOM = (function () {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let eventListenerSupported = window.addEventListener;

    return function (obj, onAddCallback, onRemoveCallback) {
        if (MutationObserver) {
            // define a new observer
            let mutationObserver = new MutationObserver(function (mutations, observer) {
                // if (mutations[0].addedNodes.length && onAddCallback != undefined) {
                onAddCallback();
                // }
            });
            // have the observer observe foo for changes in children
            mutationObserver.observe(obj, { attributes: true, childList: true, subtree: true });
        } else if (eventListenerSupported) {
            obj.addEventListener('DOMNodeInserted', onAddCallback, false);
        }
    };
})();