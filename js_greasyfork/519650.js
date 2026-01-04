// ==UserScript==
// @name         Workflowy Todo Progress
// @namespace    https://gist.github.com/
// @version      2024.12.03.001
// @description  待办任务进度显示器
// @author       YYYYang
// @match        https://workflowy.com/*
// @match        https://*.workflowy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519650/Workflowy%20Todo%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/519650/Workflowy%20Todo%20Progress.meta.js
// ==/UserScript==

(function(){const style=document.createElement('style');style.textContent=`
    .bullet-counter {
        position: absolute;
        left: -56px;
        font-family: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace;
        font-size: 10px;
        color: #777;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        display: inline-flex;
        align-items: right;
        justify-content: flex-end;
        background: rgba(0,0,0,0.03);
        border: 1px solid rgba(0,0,0,0.04);
        border-radius: 3px;
        padding: 0 4px;
        height: 15px;
        line-height: 15px;
        white-space: nowrap;
        transform: translateY(7px);
    }

    .bullet-counter.has-content {
        opacity: 0.7;
    }

    .bullet-counter .todonums {
        color: #666;
        font-weight: 600;
    }

    .project {
        position: relative !important;
    }
`;document.head.appendChild(style);function getSubtasks(item){if(!item)return{todoTypeNums:0};const SubNodes=item.getChildren();if(!SubNodes||SubNodes.length===0){return{todoTypeNums:0};}
function countTodoType(groups){let count=0;let done=0;groups.forEach(group=>{if(group.data.layoutMode==="todo"){count++;if(group.data.isCompleted===true){done++;}}});return{done,count};}
const result=countTodoType(SubNodes);const todoneNums=result.done;const todoTypeNums=result.count;return{todoneNums,todoTypeNums};}
function updateCounter(bullet){if(!bullet||bullet.querySelector('.bullet-counter'))return;const content=bullet.querySelector('.content, .name');if(!content)return;const counter=document.createElement('span');counter.className='bullet-counter';bullet.style.position='relative';bullet.insertBefore(counter,bullet.firstChild);if(window.WF&&window.WF.getItemById){try{let itemId=bullet.getAttribute('projectid')||content.getAttribute('projectid')||bullet.getAttribute('data-projectid')||content.getAttribute('data-projectid');if(!itemId){const item=window.WF.currentItem();if(item){itemId=item.getId();}}
if(itemId){const item=window.WF.getItemById(itemId);if(item){const counts=getSubtasks(item);if(counts.todoTypeNums>0){counter.innerHTML=`${counts.todoneNums}/<span class="todonums">${counts.todoTypeNums}</span>`;counter.classList.add('has-content');}else{counter.textContent='';}}}}catch(e){console.error('Error updating counter:',e);}}}
function updateAllCounters(){const bullets=document.querySelectorAll('.project');bullets.forEach(updateCounter);}
function waitForWF(){return new Promise((resolve)=>{const check=()=>{if(window.WF&&window.WF.rootItem&&window.WF.getItemById){resolve();}else{setTimeout(check,100);}};check();});}
async function init(){await waitForWF();console.log('🍵 WF initialized, starting counter...');const observer=new MutationObserver((mutations)=>{let shouldUpdate=false;mutations.forEach(mutation=>{if(mutation.type==='childList'||(mutation.type==='attributes'&&mutation.attributeName==='class')){shouldUpdate=true;}});if(shouldUpdate){requestAnimationFrame(updateAllCounters);}});observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','projectid','data-projectid']});updateAllCounters();}
if(document.readyState==='complete'){init();}else{window.addEventListener('load',init);}
setTimeout(init(),1000);})();