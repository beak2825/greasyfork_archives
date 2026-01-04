// ==UserScript==
// @name         Automate Arcanum
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates the game arcanum by allowing autoclicking and autocasting
// @author       You
// @match        https://mathiashjelm.gitlab.io/arcanum/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galaxy.click
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475080/Automate%20Arcanum.user.js
// @updateURL https://update.greasyfork.org/scripts/475080/Automate%20Arcanum.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const customStyles = `
  .timeInput {
    width: 6rem;
    background-color: #181818;
    border-color: #646464;
    color: #D7DADC;
    text-align: center;
    padding: var(--sm-gap);
    margin: var(--sm-gap);
  }
  .checkbox {
    position: relative;
    display: inline-block;
    width: 1.25em;
    height: 1.25em;
    background-color: transparent;
    border: 1px solid #000;
  }
  .autoCheck {
    margin-left: -1.75em;
    margin-top: 1.35em;
  }
  .quickslotTimer {
    width: 3rem;
    background-color: #181818;
    border-color: #646464;
    color: #D7DADC;
    text-align: center;
    padding: var(--sm-gap);
    margin: var(--sm-gap);
    height: 2rem;
  }
  .quickbar {
  flex-direction: column;
  flex-wrap: wrap;
   justify-content: center;
   align-items: center;
  }
`;
    const loadClass = "load-message"
    let hasLoaded = false;
    let actionInterval = 0;
    let autocastInterval = 0;
    let offMain = false;
    let intervalId;
    let autoKey;
    let quickslotTimers = [];

    function beginAutoAction() {
        clearInterval(intervalId);
        intervalId = setInterval(function() {
            const button = document.querySelector(`[data-key="${autoKey}"]`);
            if (button) {
                button.click();
                console.log(`Timer is currently ${actionInterval} and it is clicking ${autoKey}`);
            }
        }, actionInterval);
    }

    function stopAutoAction() {
        clearInterval(intervalId);
    }

    function beginAutoQuickslot(timer, index) {
        clearInterval(quickslotTimers[index]);
        quickslotTimers[index] = setInterval(function() {
            const quickslot = document.querySelector(`#slot${index}`);
            if (quickslot && quickslot.checked) {
                const quickslot = document.getElementsByClassName("quickslot")[index];
                quickslot.children[0].click();
                console.log(`Clicking the quickslot number ${parseInt(index+1)}`)
            }
        }, timer * 1000);
    }

    function stopAutoQuickSlot(index) {
        clearInterval(quickslotTimers[index]);
    }

    function checkOnlyOne(id, n){
        const checkboxes = document.getElementsByName(n);
        Array.prototype.forEach.call(checkboxes,function(e){
            if (e != id) {
                e.checked = false;
            }
        });
    }

    function pageUpdate() {

        const taskList = document.querySelector(".task-list")
        if (hasLoaded) {
            console.log("Page updated, checking if changes need to be made..");
        }

        let buttons = taskList.querySelectorAll(".task-btn");
        let filteredBtns = Array.from(buttons).filter(button => !button.classList.contains("locked"));
        let lockedBtns = Array.from(buttons).filter(button => button.classList.contains("locked"));
        let i = 0;
        let quickslots = document.querySelector(".quickbar").querySelectorAll(".quickslot").forEach(quickslot => {
            if (document.getElementById("slot"+i)) {
                return
            }

            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", "quickslot");
            checkbox.classList.add("quickCheck");
            checkbox.classList.add("checkbox");
            checkbox.id = "slot"+i;
            checkbox.addEventListener("change", function () {
                const checkboxIndex = parseInt(this.id.replace("slot", ""));
                if (this.checked) {
                    beginAutoQuickslot(document.getElementById("timer"+checkboxIndex).value, checkboxIndex);
                } else {
                    stopAutoQuickSlot(checkboxIndex, checkboxIndex);
                }
            });

            const timer = document.createElement("input");
            timer.setAttribute("placeholder", "(s)");
            timer.addEventListener("input", function(e) {
                const inputValue = e.target.value;
                const cleanedValue = inputValue
                .replace(/[^0-9]+/g, '') // Remove non-numeric and non-dot characters
                .replace(/(\..*?)\..*/g, '$1') // Remove multiple dots
                .replace(/^0[^.]/, '0'); // Remove leading zero before a non-dot character

                if (inputValue !== cleanedValue) {
                    // If the value was changed, update the input field
                    e.target.value = cleanedValue;
                }

                if (e.target.id == "actionTimer") {
                    actionInterval = e.target.value;
                    beginAutoAction();
                }

                if (document.querySelector(`#slot${e.target.id.replace("timer", "")}`).checked) {
                    console.log(`The current timer value is ${e.target.value}`);
                    beginAutoQuickslot(e.target.value, e.target.id.replace("timer", ""));
                }
            });
            timer.classList.add("quickslotTimer")
            timer.setAttribute("type", "text");
            timer.id = `timer${i}`;

            quickslot.insertAdjacentElement("afterend", timer);
            quickslot.insertAdjacentElement('beforeend', checkbox);
            i++;
        });

        filteredBtns.forEach(button => {
            const dataKey = button.getAttribute("data-key")
            if (document.getElementById(dataKey)) {
                return
            }
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", "task");
            checkbox.classList.add("autoCheck");
            checkbox.classList.add("checkbox");
            checkbox.addEventListener("change", function() {
                if (this.checked && actionInterval != 0) {
                    autoKey = dataKey;
                    beginAutoAction();
                } else {
                    stopAutoAction();
                }
            });
            checkbox.id = dataKey
            button.insertAdjacentElement('afterend', checkbox);
        });

        lockedBtns.forEach(button => {
            const dataKey = button.getAttribute("data-key");
            const checkbox = document.getElementById(dataKey);
            if (checkbox) {
                checkbox.parentNode.removeChild(checkbox);
            }
        });
    }

    function handleDivAppeared(mutationsList) {
        for (const mutation of mutationsList) {
            if(mutation.type === "childList") {
                const addedNodes = Array.from(mutation.addedNodes);
                for (const addedNode of addedNodes) {
                    if (addedNode.classList && addedNode.classList.contains("main-tasks")) {
                        if (document.querySelector(".main-tasks")) {
                            offMain = false;
                            pageUpdate();
                        }
                    }
                }

            }
        }

    }

    function handleDivDisappeared(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const removedNodes = Array.from(mutation.removedNodes);
                for (const removedNode of removedNodes) {
                    if (removedNode.classList && removedNode.classList.contains("main-task")){
                        offMain = true;
                    }
                    if (removedNode.classList && removedNode.classList.contains(loadClass)) {
                        // Save loaded, run script
                        console.log(`Page loaded, beginning automation.`);
                        // Inject the custom CSS styles into the page
                        GM_addStyle(customStyles);
                        hasLoaded = true;
                        const timer = document.createElement("input");
                        timer.classList.add("timeInput");
                        timer.setAttribute("type", "text");
                        timer.id = "actionTimer";
                        const label = document.createElement("label");
                        label.setAttribute("for", "actionTimer")
                        label.innerHTML="Action interval (ms):"
                        document.querySelector(".load-opts").appendChild(timer);
                        document.querySelector(".load-opts").insertBefore(label, document.getElementById("actionTimer"));
                        timer.addEventListener("input", function(e) {
                            const inputValue = e.target.value;
                            const cleanedValue = inputValue
                            .replace(/[^0-9]+/g, '') // Remove non-numeric and non-dot characters
                            .replace(/(\..*?)\..*/g, '$1') // Remove multiple dots
                            .replace(/^0[^.]/, '0'); // Remove leading zero before a non-dot character

                            if (inputValue !== cleanedValue) {
                                // If the value was changed, update the input field
                                e.target.value = cleanedValue;
                            }

                            if (e.target.id == "actionTimer") {
                                actionInterval = e.target.value;
                                beginAutoAction();
                            }
                        });

                        pageUpdate();

                        startClassObserver();
                    }
                }
            }
        }
    }

    function startClassObserver() {
        const classObserver = new MutationObserver((mutationsList, classObserver) => {
            // Handle class attribute changes here
            pageUpdate();
        });

        const classConfig = { attributes: true, attributeFilter: ['class'] };

        // Start observing class attribute changes
        classObserver.observe(document, classConfig);
    }

    // Create a MutationObserver that watches for changes in the DOM
    const observer = new MutationObserver(handleDivDisappeared);
    const observer2 = new MutationObserver(handleDivAppeared);
    const config = { childList: true, subtree: true };

    // Start observing the DOM
    observer.observe(document, config);
    observer2.observe(document, config);

    document.addEventListener("click", function(e) {
        if(e.target.classList.contains("autoCheck")){
            checkOnlyOne(e.target, e.target.getAttribute("name"));
        }
    });

})();