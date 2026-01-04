// ==UserScript==
// @name         Mitacs Excel
// @namespace    mitacsExcel
// @version      0.3
// @description  Mitacs Projects Excel
// @author       John 5G
// @match        https://globalink.mitacs.ca/#/student/application/projects
// @icon         https://www.google.com/s2/favicons?domain=mitacs.ca
// @grant        none
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/432610/Mitacs%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/432610/Mitacs%20Excel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function waitForElement(selector) {
        return new Promise(function(resolve, reject) {
            var element = document.querySelector(selector);

            if(element) {
                resolve(element);
                return;
            }

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    var nodes = Array.from(mutation.addedNodes);
                    for(var node of nodes) {
                        if(node.matches && node.matches(selector)) {
                            observer.disconnect();
                            resolve(node);
                            return;
                        }
                    };
                });
            });

            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    }


    const extractExcelInfo = (event) => {
        const projectDetails = {
           projectId: 'Empty',
           projectName: 'Empty',
           skills: 'Empty',
           role: 'Empty',
           startDate: '1991',
           flexible: 'Empty',
           province: 'Empty'
        }
        const project = event.target.parentElement;

        projectDetails.projectId = project.querySelector('.ui-grid-row > p').innerHTML.replace('Project ID ', '');

        const projectDesc = project.querySelector('div.ui-grid-col-9').children;
        projectDetails.projectName = projectDesc[0].innerHTML;
      
        let projectSnapshots = Array.from(project.querySelectorAll('.projectPageDetailsSnapshot'));
        projectSnapshots = projectSnapshots.filter(element => element.nodeType == 1);
      
        projectDetails.province = projectSnapshots[1].children[1].innerHTML;

      
        projectDetails.startDate = projectSnapshots[4].children[1].innerHTML.split(' ')[0];
        const projectExcelFormat = Object.values(projectDetails).join('\t');
        GM_setClipboard(projectExcelFormat, "text");
    }

    const injectCopyButtons = (grid) => {
        for (let project of grid.childNodes) {
            if (project.nodeType == 1) {
                const copyButton = document.createElement('button');
                copyButton.setAttribute('id', 'copy-btn');
                const buttonText = document.createTextNode("Copy");
                copyButton.addEventListener('click', extractExcelInfo)
                copyButton.appendChild(buttonText);
                project.appendChild(copyButton);
            }
        }
    }
    setInterval(() => {
      sleep(2000).then(() => {
          const injectedButtons = document.querySelectorAll('#copy-btn');
          if (injectedButtons.length === 0) {
            waitForElement('.p-grid').then((grid)=>{
                injectCopyButtons(grid)
            })
          }
      });
    }, 500)
})();