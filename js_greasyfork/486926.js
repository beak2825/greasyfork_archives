// ==UserScript==
// @name         Toggle Replies & Reposts
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Toggle Replies & Reposts for 6parkbbs
// @author       wecode
// @license      MIT
// @match        https://web.6parkbbs.com/*
// @match        https://club.6parkbbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=6parkbbs.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486926/Toggle%20Replies%20%20Reposts.user.js
// @updateURL https://update.greasyfork.org/scripts/486926/Toggle%20Replies%20%20Reposts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let totalMainPost = 0;
    let totalReplies = [];
    let mainPostEl = [];
    let spanFlag = [];

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'myCheckbox';
    checkbox.style.marginLeft = '10px';

    let label = document.createElement('label');
    label.htmlFor = 'myCheckbox';
    label.appendChild(document.createTextNode('只看主帖'));

    let container = document.createElement('div');
    container.id = 'checkboxContainer';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '3px';

    container.appendChild(checkbox);
    container.appendChild(label);

    let checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.id = 'myCheckbox1';
    checkbox1.style.marginLeft = '10px';

    let label1 = document.createElement('label');
    label1.htmlFor = 'myCheckbox1';
    label1.appendChild(document.createTextNode('只看原创'));

    container.appendChild(checkbox1);
    container.appendChild(label1);

    let pageContainer = document.getElementById('d_list_page');
    if (!pageContainer) return;

    pageContainer.insertAdjacentElement('afterend', container);

    checkbox.addEventListener('click', function() {
        const currentUrl = window.location.href;

        if (checkbox.checked) {
            totalMainPost = 0;
            totalReplies = [];
            mainPostEl = [];

            if (currentUrl.includes('club.6parkbbs.com')) {
                hideNonMatchingChildrenClub();
            } else {
                hideNonMatchingChildrenWeb();
            }
        } else {
           if (currentUrl.includes('club.6parkbbs.com')) {
               showAllChildrenClub();
           } else {
               showAllChildrenWeb();
           }
        }
        
        GM_setValue("6parkbbs_replies", checkbox.checked);
    });

    checkbox1.addEventListener('click', function() {
        const currentUrl = window.location.href;

        if (checkbox1.checked) {
            if (currentUrl.includes('club.6parkbbs.com')) {
                hideNonMatchingChildrenClub1();
            } else {
                hideNonMatchingChildrenWeb1();
            }
        } else {
           if (currentUrl.includes('club.6parkbbs.com')) {
               showAllChildrenClub1();
           } else {
               showAllChildrenWeb1();
           }
        }
        
        GM_setValue("6parkbbs_reposts", checkbox1.checked);
    });

    function setMainPostTotalReplies() {
       for (let j = 0; j < mainPostEl.length; j++) {
           let span = mainPostEl[j].querySelector('span');
           if (!spanFlag[j]) {
               spanFlag[j] = 1;

               let str = span.textContent.slice(0, -1) + ', ';
               span.textContent = str + totalReplies[j] + ' replies)';
           }
       }
    }

    function hideNonMatchingChildrenClub() {
        let ulElement = document.querySelector('#d_list > ul');
        let liElements = ulElement.querySelectorAll(':scope > li');
        for (let i = 0; i < liElements.length; i++) {
            let child = liElements[i];
            child.style.marginBottom = '18px';
            let ulElementChild = child.querySelector('ul');
            ulElementChild.style.display = 'none';

            mainPostEl[totalMainPost] = child;
            totalReplies[totalMainPost] = ulElementChild.querySelectorAll("li").length;
            totalMainPost++;
        }

        setMainPostTotalReplies();
    }

    function hideNonMatchingChildrenWeb() {
        let parent = document.querySelector('.repl-body');
        let className = 'repl-list-one';
        let cnt = 0;
        for (let i = 0; i < parent.children.length; i++) {
            let child = parent.children[i];
            let hasClass = child.classList.contains(className);
            if (!hasClass) {
                child.style.display = 'none';
                cnt++;
            } else {
                if (mainPostEl[totalMainPost]) {
                    totalReplies[totalMainPost] = cnt;
                    totalMainPost++;
                }

                mainPostEl[totalMainPost] = child;
                cnt = 0;
            }
        }
        totalReplies[totalMainPost] = cnt;

        setMainPostTotalReplies();
    }

    function showAllChildrenClub() {
        let ulElement = document.querySelector('#d_list > ul');
        let liElements = ulElement.querySelectorAll(':scope > li');
        for (let i = 0; i < liElements.length; i++) {
            let child = liElements[i];
            child.style.marginBottom = '';
            let ulElementChild = child.querySelector('ul');
            ulElementChild.style.display = '';
        }
    }

     function showAllChildrenWeb() {
        let parent = document.querySelector('.repl-body');
        for (let i = 0; i < parent.children.length; i++) {
            let child = parent.children[i];
            child.style.display = '';
        }

         if (checkbox1.checked) {
             hideNonMatchingChildrenWeb1();
         }
    }

    function hideNonMatchingChildrenClub1() {
        let ulElement = document.querySelector('#d_list > ul');
        let liElements = ulElement.querySelectorAll(':scope > li');
        for (let i = 0; i < liElements.length; i++) {
            let child = liElements[i];
            child.style.marginBottom = '18px';

           let spans = child.querySelectorAll(':scope > span');
           if (spans.length == 1) {
               child.style.display = 'none';
           }
        }
    }

    function hideNonMatchingChildrenWeb1() {
        let index = 0;
        let main = [];
        let parent = document.querySelector('.repl-body');
        let className = 'repl-list-one';

        for (let i = 0; i < parent.children.length; i++) {
            let child = parent.children[i];
            let hasClass = child.classList.contains(className);
            if (!hasClass) {
                main[index].push(child);
            } else {
                if (main[index]) {
                    index++;
                }

                main[index] = [];
                main[index].push(child);
            }
        }

        for (let i = 0; i < main.length; i++) {
           let child = main[i][0];
           let spans = child.querySelectorAll(':scope > span');
           if (spans.length == 1) {
               child.style.display = 'none';

               for (let j = 1; j < main[i].length; j++) {
                   main[i][j].style.display = 'none';
               }
           } else {
               if (checkbox.checked) {
                   for (let j = 1; j < main[i].length; j++) {
                       main[i][j].style.display = 'none';
                   }
               }
           }
        }
    }

    function showAllChildrenClub1() {
        let ulElement = document.querySelector('#d_list > ul');
        let liElements = ulElement.querySelectorAll(':scope > li');
        for (let i = 0; i < liElements.length; i++) {
            let child = liElements[i];
            if (!checkbox.checked) {
                child.style.marginBottom = '';
            }

           let spans = child.querySelectorAll(':scope > span');
           if (spans.length == 1) {
               child.style.display = '';
           }
        }
    }

    function showAllChildrenWeb1() {
        let index = 0;
        let main = [];
        let parent = document.querySelector('.repl-body');
        let className = 'repl-list-one';

        for (let i = 0; i < parent.children.length; i++) {
            let child = parent.children[i];
            let hasClass = child.classList.contains(className);
            if (!hasClass) {
                main[index].push(child);
            } else {
                if (main[index]) {
                    index++;
                }

                main[index] = [];
                main[index].push(child);
            }
        }

        for (let i = 0; i < main.length; i++) {
           let child = main[i][0];
           let spans = child.querySelectorAll(':scope > span');
           if (spans.length == 1) {
               child.style.display = '';

               if (!checkbox.checked) {
                   for (let j = 1; j < main[i].length; j++) {
                       main[i][j].style.display = '';
                   }
               }
           } else {
               if (!checkbox.checked) {
                   for (let j = 1; j < main[i].length; j++) {
                       main[i][j].style.display = '';
                   }
               }
           }
        }
    }
    

    let replies_checked = GM_getValue("6parkbbs_replies", false);
    let reposts_checked = GM_getValue("6parkbbs_reposts", false);
    if (replies_checked) checkbox.click();
    if (reposts_checked) checkbox1.click();


})();