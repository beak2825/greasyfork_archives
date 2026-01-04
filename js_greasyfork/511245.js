// ==UserScript==
// @name         Movable & Resizable Menu Script
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  A movable, resizable menu on a webpage.
// @author       You
// @match        *://*/*
// @grant        none
// @license      MrSticker23
// @downloadURL https://update.greasyfork.org/scripts/511245/Movable%20%20Resizable%20Menu%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/511245/Movable%20%20Resizable%20Menu%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to get React's stateNode
    function getStateNode() {
        return Object.values((function react(r = document.querySelector("body>div")) { 
            return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div"));
        })())[1].children[0]._owner.stateNode;
    }

    // Cheat definitions
    const Cheats = {
        global: {
            name: "Global",
            img: "https://media.blooket.com/image/upload/v1661496291/Media/uiTest/Games_Played_2.svg",
            cheats: [
                {
                    name: "Auto Answer",
                    description: "Toggles auto answer on",
                    type: "toggle",
                    enabled: false,
                    data: null,
                    run: function () {
                        if (!this.enabled) {
                            this.enabled = true;
                            this.data = setInterval(() => {
                                const stateNode = getStateNode();
                                const Question = stateNode.state.question || stateNode.props.client.question;
                                if (stateNode.state.question.qType != "typing") {
                                    if (stateNode.state.stage != "feedback" && !stateNode.state.feedback) {
                                        let ind;
                                        for (ind = 0; ind < Question.answers.length; ind++) {
                                            let found = false;
                                            for (let j = 0; j < Question.correctAnswers.length; j++)
                                                if (Question.answers[ind] == Question.correctAnswers[j]) {
                                                    found = true;
                                                    break;
                                                }
                                            if (found) break;
                                        }
                                        document.querySelectorAll("[class*='answerContainer']")[ind].click();
                                    } else document.querySelector("[class*='feedback'], [id*='feedback']").firstChild.click();
                                } else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(Question.answers[0]);
                            }, 50);
                        } else {
                            this.enabled = false;
                            clearInterval(this.data);
                            this.data = null;
                        }
                    }
                },
            ]
        }
    };

    // Create menu container
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '100px';
    menu.style.left = '100px';
    menu.style.width = '500px';
    menu.style.height = '400px';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    menu.style.color = 'white';
    menu.style.display = 'flex';
    menu.style.borderRadius = '10px';
    menu.style.zIndex = '1000';
    menu.style.cursor = 'move';

    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.style.width = '120px';
    sidebar.style.backgroundColor = '#333';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';
    sidebar.style.padding = '10px';
    sidebar.style.borderRight = '2px solid #555';

    // Create content container (main menu area)
    const contentContainer = document.createElement('div');
    contentContainer.style.flexGrow = '1';
    contentContainer.style.padding = '20px';

    // Sections for the content area
    const section1 = document.createElement('div');
    section1.innerHTML = '<h3>Section 1</h3><p>This is the content for section 1.</p>';

    const section2 = document.createElement('div');
    section2.innerHTML = '<h3>Section 2</h3><p>This is the content for section 2.</p>';

    const sectionCheats = document.createElement('div');
    sectionCheats.innerHTML = '<h3>Cheats</h3><p>Use cheats like Auto Answer below.</p>';

    // Auto Answer toggle button
    const autoAnswerButton = document.createElement('button');
    autoAnswerButton.textContent = 'Toggle Auto Answer';
    autoAnswerButton.onclick = function() {
        Cheats.global.cheats[0].run();
        alert(`Auto Answer is now ${Cheats.global.cheats[0].enabled ? 'enabled' : 'disabled'}.`);
    };
    sectionCheats.appendChild(autoAnswerButton);

    // Display the first section initially
    contentContainer.appendChild(section1);

    // Function to switch sections
    function showSection(section) {
        contentContainer.innerHTML = '';
        contentContainer.appendChild(section);
    }

    // Sidebar buttons
    const btn1 = document.createElement('button');
    btn1.textContent = 'Section 1';
    btn1.style.marginBottom = '10px';
    btn1.onclick = function() {
        showSection(section1);
    };
    sidebar.appendChild(btn1);

    const btn2 = document.createElement('button');
    btn2.textContent = 'Section 2';
    btn2.style.marginBottom = '10px';
    btn2.onclick = function() {
        showSection(section2);
    };
    sidebar.appendChild(btn2);

    const btnCheats = document.createElement('button');
    btnCheats.textContent = 'Cheats';
    btnCheats.onclick = function() {
        showSection(sectionCheats);
    };
    sidebar.appendChild(btnCheats);

    // Append sidebar and content container to the menu
    menu.appendChild(sidebar);
    menu.appendChild(contentContainer);

    // Make the menu draggable
    let isDragging = false;
    let offsetX, offsetY;

    menu.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - parseInt(menu.style.left);
        offsetY = e.clientY - parseInt(menu.style.top);
        menu.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        menu.style.cursor = 'move';
    });

    // Append the menu to the body
    document.body.appendChild(menu);

})();