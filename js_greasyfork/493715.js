// ==UserScript==
// @name         AutoComplete Course
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Mask as done all your Udemy's classes. Will be shown a blue button to complete the opened course.
// @author       Marcello Cavazza
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493715/AutoComplete%20Course.user.js
// @updateURL https://update.greasyfork.org/scripts/493715/AutoComplete%20Course.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement('button');

    button.textContent = 'Complete course';
    button.style.zIndex = '99999999';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.background = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    button.addEventListener('click', function() {
        try{
            const mainContentList = document.getElementById("ct-sidebar-scroll-container");
            if(mainContentList != undefined && mainContentList.childNodes.length > 0){
                let chapters = mainContentList.children[0].children[0].childNodes;
                if(chapters != undefined) {
                    //marking as complete each class
                    chapters.forEach((child) => {
                        const isChapterOpen = child.children[0].dataset.checked === "checked";
                        if(!isChapterOpen) {
                            child.children[1].click();
                        }
                        const canIFindContentForThisChapter = child.children[child.childNodes.length-1].children[0].childNodes.length > 0;
                        if(canIFindContentForThisChapter){
                            const classesOfCurrentChapter = child.children[child.childNodes.length-1].children[0].children[0].childNodes;
                            if(classesOfCurrentChapter != undefined){
                                classesOfCurrentChapter.forEach((classOfChapter)=>{
                                    const buttonToConcludeClass = classOfChapter.children[0].children[0].children[0];
                                    const isAlreadyChecked = buttonToConcludeClass.childNodes[0].checked;

                                    if(!isAlreadyChecked){
                                        buttonToConcludeClass.click();
                                    }
                                });
                            }
                        }
                    });
                    //now it will enter on the last class and make udemy identify as completed the course
                    const lastChapter = chapters[chapters.length-1];
                    const isChapterOpen = lastChapter.children[0].dataset.checked === "checked";
                    if(!isChapterOpen) {
                        lastChapter.children[1].click();
                    }
                    const amountOfClasses = lastChapter.children[lastChapter.childNodes.length-1].children[0].children[0].childNodes.length;
                    const canIFindContentForThisChapter = amountOfClasses > 0;
                    if(canIFindContentForThisChapter){
                        const classOfCurrentChapter = lastChapter.children[lastChapter.childNodes.length-1].children[0].children[0].childNodes[amountOfClasses - 1];
                        classOfCurrentChapter.click();
                    }

                    window.alert("Completed all course!\nPage will be refreshed!\nIf doesn't complete everything, just click the button again.");
                    location.reload(true)
                }
            }
        }catch(ex){
            console.error(ex);
        }
    });
})();