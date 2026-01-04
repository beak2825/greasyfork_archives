// ==UserScript==
// @name         Job Spot Checker
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Checks the amount of open employee spots in companies.
// @author       tophd7
// @match        https://www.torn.com/joblist.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue

// @downloadURL https://update.greasyfork.org/scripts/533595/Job%20Spot%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/533595/Job%20Spot%20Checker.meta.js
// ==/UserScript==
// PLEASE REMEMBER THAT YOU ARE LIMITED TO 100 API CALLS PER MINUTE.


//Allows the script to work between job pages without needing to refresh.
window.addEventListener("load", preFunc);
window.addEventListener("hashchange", preFunc);


function displayYellowSquare() {
    const yellowSquare = document.createElement('div');
    yellowSquare.id = 'yellowSquare';
    yellowSquare.style.position = 'fixed';
    yellowSquare.style.left = '0';
    yellowSquare.style.top = '0';
    yellowSquare.style.width = '100px';
    yellowSquare.style.height = '100px';
    yellowSquare.style.backgroundColor = 'yellow';
    yellowSquare.style.zIndex = '99999999';
    yellowSquare.style.display = 'flex'; // Use flexbox for centering
    yellowSquare.style.cursor = 'pointer'; // Change cursor to pointer

    // Create a container div for centered text
    const textContainer = document.createElement('div');
    textContainer.style.margin = 'auto'; // Center horizontally
    textContainer.style.textAlign = 'center'; // Center text
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column'; // Center vertically

    // Create text nodes for the yellow square with a line break
    const yellowTextNode0 = document.createTextNode('Company Checker');
    const lineBreak = document.createElement('br');
    const yellowTextNode1 = document.createTextNode('Click here to');
    const lineBreak2 = document.createElement('br');
    const yellowTextNode2 = document.createTextNode('supply API key');


    // Append the text nodes and line break to the text container
    textContainer.style.color = "black";
    textContainer.appendChild(yellowTextNode0);
    textContainer.appendChild(lineBreak);
    textContainer.appendChild(yellowTextNode1);
    textContainer.appendChild(lineBreak2);
    textContainer.appendChild(yellowTextNode2);

    // Append the text container to the yellow square
    yellowSquare.appendChild(textContainer);

    // Append the yellow square to the body (if it's not already added)
    if (!document.getElementById('yellowSquare')) {
        document.body.appendChild(yellowSquare);
    }

    // Add a click event listener to the yellow square
    yellowSquare.addEventListener('click', () => {
        const APIKEY = prompt('Enter your API key (public):');
        if (APIKEY) {
            // Store the API key with GM_setValue
            GM_setValue('company-check', APIKEY);
            yellowSquare.remove(); // Remove the yellow square after entering the API key
        }
    });
}

function preFunc() {
    setTimeout(func, 1000);
};



//Adds a button to trigger the calls.
function func() {
    'use strict';
    let addBtn = document.querySelector("div.gallery-wrapper"); //Adds the button after the top number bar.
    let btn = document.createElement('BUTTON');
    btn.id = "employ";
    btn.innerHTML = 'SHOW EMPLOYMENT';
    btn.type = "button";
    btn.className = 'torn-btn';
    addBtn.insertAdjacentElement('afterend', btn);
    document.getElementById("employ").addEventListener("click", buttonFunc);
};


async function getDirectorAction(id) {
    const APIKEY = GM_getValue('company-check');
    const dirRes = await fetch(`https://api.torn.com/user/${id}?selections=profile&key=${APIKEY}`);
    const dirData = await dirRes.json();
    return dirData;
}

// If the API key is not stored, display the yellow square
async function buttonFunc() {
    'use strict';
    let listIds = [];
    if (document.location.href.includes("p=corp")) {
        listIds = Array.from(document.querySelectorAll("a[href*='corpinfo&ID']")).map(e => e.href.split("ID=")[1]);
    };
    //Prepares the page to be edited after the API calls resolve.
    var temp = document.getElementsByClassName('company t-overflow');
    let companyName = [];
    for (let x = 0; x < temp.length; x++) {
        companyName.push(temp[x]);
    };
    var temp = document.getElementsByClassName('director');
    let directors = [];
    for (let x = 0; x < temp.length; x++) {
        directors.push(temp[x]);
    }
    const APIKEY = GM_getValue('company-check', '');

    //Makes the API calls then puts the information on the page.
    companyName.splice(0, 1); // Your current job is always added the the list at index 0. This removes it to reduce API calls.
    directors.splice(0, 1);
    for (let i = 0; i < listIds.length; i++) {
        let tempName = companyName[i].innerHTML.toLowerCase();

        let hiring = (tempName.includes("hiring") && !tempName.includes("not")) || tempName.includes("pm") || tempName.includes("dm");

        companyName[i].id = `corpList-${i}`;
        if (!APIKEY) {
            displayYellowSquare();
            break;
        }
        const res = await fetch('https://api.torn.com/company/' + listIds[i] + '?selections=&key=' + APIKEY);
        const data = await res.json();
        if (data.error) {
            if (data.error.error != "Too many requests") {
                alert("Invalid API key.");
                GM_deleteValue('company-check');
                displayYellowSquare();
                break;
            }
            else {
                alert("Too many requests! Try again in a few seconds")
                break;
            }
        } else {
            let hired = data.company.employees_hired;
            let capacity = data.company.employees_capacity;
            let statusText = "";
            if (hired < capacity) {
                hiring = true;
            }

            if (hired >= capacity && !hiring) {
                statusText = ` <span style="color: rgb(255, 0, 0);">Full</span>`;
            } else if (hiring && hired === capacity) {
                statusText = ` <span style="color: rgb(255, 204, 0); font-weight: 900;">Hiring</span>`
                const dirData = await getDirectorAction(directors[i].innerHTML.split("XID=")[1].split(">")[0]);
                if (dirData.error) {
                    if (dirData.error.error != "Too many requests") {
                        alert("Invalid API key.");
                        GM_deleteValue('company-check');
                        displayYellowSquare();
                        break;
                    }
                    else {
                        alert("Too many requests! Try again in a few seconds")
                        break;
                    }
                }
                if (dirData.last_action.relative === "0 minutes ago") {
                    directors[i].innerHTML += ` <span style="color: rgb(119, 166, 64); font-weight: 900;">Online</span>`
                } else {
                    directors[i].innerHTML += ` <span style="color: rgb(255, 204, 0); font-weight: 900;">${dirData.last_action.relative}</span>`;
                }
            }
            else {
                statusText = ` <span style="color: rgb(119, 166, 64); font-weight: 900;">Open</span>`;
                const dirData = await getDirectorAction(directors[i].innerHTML.split("XID=")[1].split(">")[0]);
                if (dirData.error) {
                    if (dirData.error.error != "Too many requests") {
                        alert("Invalid API key.");
                        GM_deleteValue('company-check');
                        displayYellowSquare();
                        break;
                    }
                    else {
                        alert("Too many requests! Try again in a few seconds")
                        break;
                    }
                }
                if (dirData.last_action.relative === "0 minutes ago") {
                    directors[i].innerHTML += ` <span style="color: rgb(119, 166, 64); font-weight: 900;">Online</span>`
                } else {
                    directors[i].innerHTML += ` <span style="color: rgb(119, 166, 64); font-weight: 900;">${dirData.last_action.relative}</span>`;
                }
            }

            companyName[i].innerHTML += ` |${hired}/${capacity}|${statusText}`;
        };

        //Throws a message if the API key is invalid.
    };
};
