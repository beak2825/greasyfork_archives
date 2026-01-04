// ==UserScript==
// @name         Discord Toggle Channels List
// @namespace    https://discordapp.com
// @version      1.12.1
// @description  Adds show/hide channels sidebar button to Discord Web App
// @author       Github mindovermiles262
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380613/Discord%20Toggle%20Channels%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/380613/Discord%20Toggle%20Channels%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Classes of DIVs you want to be able to toggle sidebar 
    const toggleButtons = [
        "children-3xh0VB",
        "toggleChannelsBtn"
    ];
    const columnToHide = "sidebar-1tnWFu"                       // Sidebar column that will be hidden
    const showHideSidebarButtonParentClass = "scroller-3X7KbA"; // Small sidebar with all your Discords
    const roomDivClass = "channelName-3KPsGw";                  // The class of the room names, used to autohide sidebar
    const unreadClass = "unread-36eUEm";                        // Unread messages are assigned a class, used in chevron colorization
    const channelsWidth = "240px";

    function sleep(ms) {
        // Sets timeout for inital page elements to load
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function pageload() {
        // Wait 5 seconds for page to load
        await sleep(5000);
        main()
    }

    const toggleVisibility = function() {
        // Changes the width of the rooms sidebar
        let sidebar = document.getElementsByClassName(columnToHide)[0];
        if (sidebar.style.width == "1px") {
            sidebar.style.width = channelsWidth;
        } else {
            sidebar.style.width = "1px";
        }
    }

    let cheveronDirection = function() {
        const sidebar = document.getElementsByClassName(columnToHide)[0]
        const btn = document.getElementById("dtcb-cheverons")
        if (sidebar.style.width == "1px") {
            btn.innerText = ">>";
        } else {
            btn.innerText = "<<";
        }
    }

    const createSidebarButton = function() {
        let btnDiv = document.createElement("div")
        btnDiv.setAttribute("class", "toggleChannelsBtn")
        btnDiv.setAttribute("id", "toggleChannelsBtn")
        btnDiv.style.width = "70px"
        btnDiv.style.textAlign = "center"
        btnDiv.style.color = "#43b581" // Discord Green
        btnDiv.style.position = "absolute"
        btnDiv.style.bottom = "25px"
        let btn = document.createElement("p")
        btn.setAttribute("id", "dtcb-cheverons")
        btn.innerText = "<<"
        btn.style.margin = "0"
        btn.style.fontWeight = "bold"
        btn.style.fontSize = "200%"
        btnDiv.appendChild(btn)
        return btnDiv
    }

    const addListenersToToggleButtons = function() {
        toggleButtons.forEach(function(elem) {
            document.getElementsByClassName(elem)[0].addEventListener('click', function() {
                toggleVisibility();
                cheveronDirection();
            })
        });
    } 

    const autohideSidebar = function() {
      	// Auto-colapses sidebar when you click on a room
        const roomDivs = document.getElementsByClassName(roomDivClass)
        Array.from(roomDivs).forEach(function(room) {
            room.addEventListener('click', function() {
                toggleVisibility();
                cheveronDirection();
            })
        })
    }

    const colorizeButtonIfUnread = function() {
        const btn = document.getElementById("toggleChannelsBtn");
        const interval = setInterval(function() {
            const unreads = document.getElementsByClassName(unreadClass).length
            if (unreads > 0) {
                btn.style.color = "#f04747"; // Discord Red
            } else {
                btn.style.color = "#43b581"; // Discord Green
            }
        }, 1000)
    }

    const main = function() {
        console.log("[*] Loading Discord Toggle Channenels Bar Userscript");
        const newBtn = createSidebarButton()
        document.getElementsByClassName(showHideSidebarButtonParentClass)[0].appendChild(newBtn)
        addListenersToToggleButtons();
        autohideSidebar();
        colorizeButtonIfUnread();
    }

    pageload();
})();
