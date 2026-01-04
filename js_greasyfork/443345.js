// ==UserScript==
// @name           jira-issue-navigate
// @author         Amin Yahyaabadi
// @description    Go to the next/prev issue using buttons
// @grant          none
// @homepage       https://github.com/aminya/jira-issue-navigate
// @match          https://*.atlassian.net/browse/*
// @match          https://*.atlassian.net/jira/software/projects/*
// @namespace      AminYa
// @run-at         document-end
// @version        0.6.0
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/443345/jira-issue-navigate.user.js
// @updateURL https://update.greasyfork.org/scripts/443345/jira-issue-navigate.meta.js
// ==/UserScript==
function $56b6afb9bd394bc1$var$createButton(company,middle,project,issueNumber,queriesString,direction){var a;let targetIssueNumber;// create a button to go to the next issue
let button=document.createElement("a");button.id=`${direction}-issue-btn`,button.setAttribute("aria-label",`Go to ${direction} issue`),button.setAttribute("aria-expanded","false"),button.setAttribute("aria-haspopup","true"),button.setAttribute("type","button"),button.style.borderRadius="2px",button.style.alignSelf="center",button.style.padding="7px";let buttonIcon=document.createElement("div");buttonIcon.innerHTML=(a=$0120275cbb8e29b4$exports)&&a.__esModule?a.default:a,button.style.background="none",button.style.border="none","prev"===direction&&(buttonIcon.style.transform="rotate(180deg) translate(0px, 3px)"),// attach the icon
button.appendChild(buttonIcon);// set the the button class
let likeButtonSelector="#jira-issue-header-actions > div > div > div:nth-child(4)",likeButton=document.querySelector(likeButtonSelector);null!==likeButton&&(console.debug(`${likeButtonSelector} was not found`),button.className=likeButton.className),targetIssueNumber="next"===direction?issueNumber+1:issueNumber-1;// create the next issue url
let issueURL=`${company}.atlassian.net/${middle}/${project}-${targetIssueNumber}${queriesString}`;return(// navigate to the next issue on click
button.setAttribute("href",issueURL),// create a tooltip for the button that shows "Go to next issue" on hover
function(button,direction="next"){// create a tooltip for the button that shows "Go to next issue" on hover
let buttonTooltip=document.createElement("div");buttonTooltip.id=`${direction}-issue-btn-tooltip`,buttonTooltip.setAttribute("style","position: relative;");let buttonTooltipText=document.createElement("div");buttonTooltipText.innerHTML=direction[0].toUpperCase()+direction.slice(1),buttonTooltipText.setAttribute("style",`width: 50px;
     text-align: center;
     border-radius: 4px;
     padding: 1px 0;
     font-size: small;
     background: #172B4D;
     color: white;

     position: absolute;
     z-index: 1;
     bottom: 100%;
     left: 50%;
     margin-left: -30px;
     margin-bottom: 15px;
     `),buttonTooltipText.style.visibility="hidden",buttonTooltip.prepend(buttonTooltipText),button.addEventListener("mouseover",()=>{button.style.background="#091e4214",buttonTooltipText.style.visibility="visible"}),button.addEventListener("mouseleave",()=>{button.style.background="none",buttonTooltipText.style.visibility="hidden"}),button.prepend(buttonTooltip)}(button,direction),button)}var $0120275cbb8e29b4$exports={};$0120275cbb8e29b4$exports='<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20.633 20.633" style="enable-background:new 0 0 20.633 20.633" xml:space="preserve"><path d="M15.621 9.844 5.971.195A.652.652 0 0 0 5.5 0a.664.664 0 0 0-.473.195l-.013.012a.677.677 0 0 0-.197.475v4.682c0 .178.071.348.197.471l4.481 4.482-4.481 4.479a.667.667 0 0 0-.197.475v4.68c0 .18.071.354.197.475l.013.01a.664.664 0 0 0 .947 0l9.647-9.646a.671.671 0 0 0 0-.946z"/></svg>',setTimeout(function(){let parseResult=function(){let currentURL=window.location.href,res=/(.*)\.atlassian\.net\/(browse|jira\/software\/projects)\/(.*)-(\d*)(\?.*)?/.exec(currentURL);// if the url doesn't match return
if(null===res)return null;let[,company,middle,project,issue,queries]=res;return{company:company,middle:middle,project:project,issueNumber:parseInt(issue,10),queriesString:queries??""}}();if(null===parseResult)return;let{company:company,middle:middle,project:project,issueNumber:issueNumber,queriesString:queriesString}=parseResult,nextButton=$56b6afb9bd394bc1$var$createButton(company,middle,project,issueNumber,queriesString,"next"),prevButton=$56b6afb9bd394bc1$var$createButton(company,middle,project,issueNumber,queriesString,"prev"),toolbarSelector="#jira-issue-header-actions > div > div",toolbar=document.querySelector(toolbarSelector);if(null===toolbar){console.debug(`${toolbarSelector} was not found`);return}// attach the button to the toolbar
toolbar.prepend(prevButton),toolbar.prepend(nextButton)},2e3);//# sourceMappingURL=jira-issue-navigate.js.map

//# sourceMappingURL=jira-issue-navigate.js.map
