// ==UserScript==
// @name         Quick Copy and Auto Working/Ready
// @name:zh-CN   快速复制，自动working/ready
// @namespace    http://tampermonkey.net/
// @description  Add buttons for copying the id/summary/link and for auto working/ready
// @description:zh-cn 快速复制id/summary/link，自动working/ready
// @author       Jackie
// @version      0.15
// @match        https://idart.mot.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mot.com
// @run-at       document-start
// @grant        GM.addStyle
// @grant        GM.log
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/470515/Quick%20Copy%20and%20Auto%20WorkingReady.user.js
// @updateURL https://update.greasyfork.org/scripts/470515/Quick%20Copy%20and%20Auto%20WorkingReady.meta.js
// ==/UserScript==

(function () {
    'use strict';
    loop(2000, addButtons)
})();

function loop(delay, action) {
    setTimeout(()=>{
        action();
        loop(delay, action);
    }, delay);
}

function addButtons() {
    if(!document.getElementById('stalker') || document.getElementById('copy_id')) return
    GM.log(`======addButtons`);
    addWorkingButton();
    addReadyButton();
    addOpenOtherCrButton();
    addCopyButtons();
}

function addOpenOtherCrButton() {
    let parent = document.querySelector('#stalker .aui-page-header-main');
    let div = document.getElementById("open_other_cr");
    if(!parent || div) return;
    div = document.createElement("div");
    div.id = "open_other_cr";
    let input = document.createElement("input");
    input.placeholder = "CR number"
    div.appendChild(input);

    let button = document.createElement("button");
    button.innerText = "Open"
    div.appendChild(button);
    parent.appendChild(div);

    let done = ()=>{
        let crPreLink = 'https://idart.mot.com/browse/'
        GM.log(`input: ${input.value}`);
        let str = input.value.toLowerCase();
        if(str.startsWith('iksw')){
            str = crPreLink + str
        } else if(str == ''){
            str = 'https://idart.mot.com/issues/?filter=-1';
        } else if(!isNaN(Number(str, 10))) {
            str = crPreLink + document.URL.substr(document.URL.indexOf('IKSW'),6) + str;
        } else {
            str = null;
        }
        if(str){
            GM.openInTab(str, { active: true })
        } else {
            showSnackbar("Invalid CR!");
        }
    }
    input.onkeypress=(event)=>{
        if(event.which == 13){
            done();
        }

    }
    button.onclick = done;
}

function addCopyButtons() {
    // hide comment button
    GM.addStyle(`
        #opsbar-comment-issue_container{display: none;}
    `);
    let anchor = document.getElementById("copy_id");
    if(anchor) return;
    const container = document.getElementById('stalker');
    const issueKey = document.getElementById("key-val");
    const issueName = document.getElementById("summary-val");
    if(!container) return;

    const newElement = document.createElement("li");
    const idE = document.createElement("a");
    idE.innerHTML="Copy id";
    idE.className="aui-button aui-button-primary aui-style";
    idE.id="copy_id";
    idE.onclick= (e) => {
        navigator.clipboard.writeText(issueKey.childNodes[0].data);
        showSnackbar();
    };
    newElement.appendChild(idE);
    issueKey.parentNode.parentNode.appendChild(newElement);

    const newElement2 = document.createElement("li");
    const summaryE = document.createElement("a");
    summaryE.className="aui-button aui-button-primary aui-style";
    summaryE.innerHTML="Copy summary";
    summaryE.id="copy_summary";
    summaryE.onclick= (e) => {
        navigator.clipboard.writeText(issueName.childNodes[0].data);
        showSnackbar();
    };

    newElement2.appendChild(summaryE);
    issueKey.parentNode.parentNode.appendChild(newElement2);

    const newElement3 = document.createElement("li");
    const linkE = document.createElement("a");
    linkE.className="aui-button aui-button-primary aui-style";
    linkE.innerHTML="Copy link";
    linkE.id="copy_link";
    linkE.onclick= (e) => {
        navigator.clipboard.writeText("https://idart.mot.com/browse/" + issueKey.childNodes[0].data);
        showSnackbar();
    };

    newElement3.appendChild(linkE);
    issueKey.parentNode.parentNode.appendChild(newElement3);

    const newElement4 = document.createElement("li");
    const idSummaryE = document.createElement("a");
    idSummaryE.className="aui-button aui-button-primary aui-style";
    idSummaryE.innerHTML="Copy as git title";
    idSummaryE.id="copy_id_summary";
    idSummaryE.onclick= (e) => {
        navigator.clipboard.writeText(issueKey.childNodes[0].data + " " + issueName.childNodes[0].data);
        showSnackbar();
    };

    newElement4.appendChild(idSummaryE);
    issueKey.parentNode.parentNode.appendChild(newElement4);
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
        document.getElementById('stalker').appendChild(snackbar);
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

function addWorkingButton() {
    let selectorList = document.querySelectorAll('#stalker .aui-toolbar2-primary a');
    let oriWorkingBtn = null;
    for(let a of selectorList) {
        if(a.text.toLowerCase() == 'working') {
            oriWorkingBtn = a;
            break;
        }
    }
    let autoWorkingBtn = document.querySelector('#auto_working');
    if(!oriWorkingBtn || autoWorkingBtn) return;
    autoWorkingBtn = createWorkFlowButton('auto_working', 'Auto Working');
    autoWorkingBtn.onclick = ()=>{
        oriWorkingBtn.click();
        detectElementBySelector("#customfield_10572", ()=>{
            let assignToMe = document.querySelector('#assign-to-me-trigger');
            if(assignToMe) assignToMe.click();
            let targetDate = document.querySelector('#customfield_10572');
            targetDate.value = getLastDayOfCurrentMonth();
            let workingSubmit = document.querySelector('#issue-workflow-transition-submit');
            workingSubmit.click();
        });
    }
    oriWorkingBtn.parentElement.prepend(autoWorkingBtn);
}

function getLastDayOfCurrentMonth() {
    let date = new Date();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let [_,month,day,year] = lastDay.toDateString().split(' ');
    return day + '/'+month+'/'+year.substr(2,2);
}

function addReadyButton() {
    let selectorList = document.querySelectorAll('.aui-dropdown2-section .aui-dropdown2-item-group aui-item-link a');
    let oriReadyBtn = null;
    for(let a of selectorList) {
        if(a.text.toLowerCase() == 'ready') {
            oriReadyBtn = a.parentElement;
            break;
        }
    }
    if(!oriReadyBtn) return;
    let parent = addAndGetWorkFlowDiv();
    if(!parent || document.getElementById('btn_ready')) return;
    let btnReady = createWorkFlowButton('btn_ready', 'Auto Ready');
    btnReady.onclick = ()=>{
        oriReadyBtn.click();
        // observer ready dialog
        detectElementBySelector("#customfield_10867", ()=>{
            let testsExecuted = document.querySelector('#customfield_10867');
            testsExecuted.textContent = "Test good";
            let dependentCRs = document.querySelector('#customfield_10127');
            dependentCRs.value = "NA";
            let readySubmit = document.querySelector('#issue-workflow-transition-submit');
            readySubmit.click();
        });
    }

    parent.appendChild(btnReady);
}

function createWorkFlowButton(id, text){
    let btn = document.createElement('a');
    btn.id = id;
    btn.className = "aui-button toolbar-trigger issueaction-workflow-transition";
    let span = document.createElement('span');
    span.className = "trigger-label";
    span.innerHTML = text;
    btn.appendChild(span);
    return btn;
}

function addAndGetWorkFlowDiv(){
    let div = document.getElementById('auto_work_flow');
    if(div) return div;
    let parent = document.querySelector('.aui-toolbar2-primary');
    div = document.createElement('div');
    div.id = 'auto_work_flow';
    div.className = "aui-buttons pluggable-ops";
    parent.appendChild(div);
    return div;
}

function detectElementBySelector(selector, action, delay) {
    let queryAction = ()=>{
        return document.querySelector(selector);
    }

    if(queryAction()) {
        action();
    } else {
        setTimeout(()=>{
            detectElementBySelector(selector, action)
        }, delay ? delay : 200);
    }

}
