// ==UserScript==
// @name        Infinite Craft 5 Button Cheat
// @namespace   https://whydoilike.neocities.org/cookie%20clicker/cookieclicker
// @match       https://neal.fun/infinite-craft/*
// @grant       none
// @version     2.5
// @description ads a menu button for quick cheats and access to everything
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/496489/Infinite%20Craft%205%20Button%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/496489/Infinite%20Craft%205%20Button%20Cheat.meta.js
// ==/UserScript==

console.log("Script loaded");

setTimeout(function() {
    function createButton(id, text, onClick) {
        let button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.padding = '8px';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#2e2f4d';
        button.style.color = '#a814fe';
        button.style.border = '2px solid #070614';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px'; // Smaller font size
        button.style.fontFamily = 'Fira Sans, sans-serif';
        button.addEventListener('click', onClick);
        return button;
    }

    function addItems(items) {
        let initial = localStorage.getItem("infinite-craft-data");
        let array = JSON.parse(initial).elements;

        items.forEach(item => {
            // Check if the item already exists
            if (!array.some(i => i.text === item.text && i.emoji === item.emoji)) {
                array.push(item);
            }
        });

        let updatedData = {
            elements: array
        };

        localStorage.setItem("infinite-craft-data", JSON.stringify(updatedData));
        window.location.reload();
    }

    function generateRandomElement() {
        return new Promise((resolve, reject) => {
            let emoji = String.fromCodePoint(Math.floor(Math.random() * (128567 - 128512 + 1)) + 128512); // Random emoji
            fetch('https://random-word-api.herokuapp.com/word')
                .then(response => response.json())
                .then(data => {
                    let text = data[0];
                    let discovered = Math.random() < 0.5; // 50/50 chance for true or false
                    resolve({
                        text: text,
                        emoji: emoji,
                        discovered: discovered
                    });
                })
                .catch(error => reject('Error fetching random word:', error));
        });
    }

    let container = document.querySelector('.container');

    if (!container) {
        console.error('Container not found');
        return;
    }
    console.log("Container found:", container);

    function toggleMenu() {
        console.log("Menu button clicked");
        // Toggle menu visibility
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    // Create menu toggle button
    let menuBtn = createButton('menuBtn', '', toggleMenu);
    menuBtn.style.backgroundImage = `url('https://icons.veryicon.com/png/o/miscellaneous/linear-icon-45/hamburger-menu-5.png')`;
    menuBtn.style.backgroundSize = 'cover';
    menuBtn.style.backgroundRepeat = 'no-repeat';
    menuBtn.style.width = '40px'; // Adjust width and height as needed
    menuBtn.style.height = '40px';
    menuBtn.style.border = 'none';
    menuBtn.style.cursor = 'pointer';
    menuBtn.style.backgroundColor = 'transparent'; // Set background color to transparent
    menuBtn.style.position = 'fixed';
    menuBtn.style.top = '10px';
    menuBtn.style.left = '50%';
    menuBtn.style.transform = 'translateX(-50%)';
    menuBtn.style.zIndex = '10000';

    let menu = document.createElement('div');
    menu.style.display = 'none';
    menu.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    menu.style.padding = '10px';
    menu.style.position = 'absolute';
    menu.style.borderRadius = '5px';
    menu.style.zIndex = '10001'; // Higher zIndex than buttons

    let saveBtn = createButton('saveBtn', 'Add Item', function() {
        console.log("Add Item button clicked");
        // Add Item 
        let doesExists = localStorage.getItem("infinite-craft-data");
        let replace = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}';

        if (doesExists == null) {
            localStorage.setItem("infinite-craft-data", replace);
        }

        let initial = localStorage.getItem("infinite-craft-data");
        let array = JSON.parse(initial).elements;
        let text = prompt("Item name.");

        if (!text) {
            return;
        }

        let emoji = prompt("Emoji. Press Windows+.");

        if (!emoji) {
            return;
        }

        let discovered = confirm("First Discovery? (OK for True, Cancel for False)");
        let ItemsToAdd = {
            text: text,
            emoji: emoji,
            discovered: discovered
        };

        array.push(ItemsToAdd);
        let newItem = {
            elements: array
        };

        array = JSON.stringify(newItem);
        localStorage.setItem("infinite-craft-data", array);
        window.location.reload();
        console.log("DONE");

    });

    let ssaveBtn = createButton('ssaveBtn', 'Starter Pack', function() {
        console.log("Starter Pack button clicked");
        // Starter Pack 
        const confirmAction = confirm("Are you sure you want to do this? It will reset your progress!");
        if (!confirmAction) {
            return;
        }
        localStorage.removeItem("infinite-craft-data");
        let doesExists = localStorage.getItem("infinite-craft-data");
        let replace = '{"elements":[]}';

        if (doesExists == null) {
            localStorage.setItem("infinite-craft-data", replace);
        }

        let initial = localStorage.getItem("infinite-craft-data");
        let array = JSON.parse(initial).elements;
        let starterItems = [
            { text: "Water", emoji: "💧", discovered: false },
            { text: "Fire", emoji: "🔥", discovered: false },
            { text: "Wind", emoji: "🌬️", discovered: false },
            { text: "Earth", emoji: "🌍", discovered: false },
            { text: "Obama", emoji: "🐻", discovered: false },
            { text: "Trump", emoji: "💩", discovered: false },
            { text: "Infinite Craft", emoji: "🌌", discovered: false },
            { text: "Anime Hitler", emoji: "👹", discovered: false },
            { text: "Uniwar", emoji: "👾", discovered: true },
            { text: "Gay", emoji: "🏳️‍🌈", discovered: false },
            { text: "Future", emoji: "🔮", discovered: false },
            { text: "Time", emoji: "📜", discovered: false },
            { text: "Past", emoji: "📜", discovered: false },
            { text: "Sex", emoji: "🍆", discovered: false },
            { text: "Google", emoji: "🔍", discovered: false },
            { text: "Infinity", emoji: "♾️", discovered: false },
            { text: "YouTube", emoji: "📺", discovered: false }
        ];

        addItems(starterItems);

    });

    let randomBtn = createButton('randomBtn', 'Random Element', function() {
        console.log("Random Element button clicked");
        // Random Element 
        let numElements = prompt("How many random elements do you want?");
        if (numElements) {
            numElements = parseInt(numElements);
            if (!isNaN(numElements) && numElements > 0) {
                let promises = [];
                for (let i = 0; i < numElements; i++) {
                    promises.push(generateRandomElement());
                }

                Promise.all(promises).then(generatedElements => {
                    let elementsText = generatedElements.map(el => `Text: ${el.text}, Emoji: ${el.emoji}, Discovered: ${el.discovered}`).join('\n');
                    let confirmAddition = confirm(`Generated elements:\n\n${elementsText}\n\nDo you want to add these elements?`);

                    if (confirmAddition) {
                        addItems(generatedElements);
                    } else {
                        console.log("User declined to add generated elements.");
                    }
                }).catch(error => console.error(error));
            } else {
                console.error("Invalid input. Please enter a valid number.");
            }
        } else {
            console.log("No input provided.");
        }

    });

    let copyBtn = createButton('copyBtn', 'Copy JSON', function() {
        console.log("Copy JSON button clicked");
        // Copy JSON 
        let data = localStorage.getItem("infinite-craft-data");
        navigator.clipboard.writeText(data).then(() => {
            console.log("Data copied to clipboard");
            alert("Data copied to clipboard");
        }).catch(err => {
            console.error('Error copying data to clipboard', err);
        });

    });

    let pasteBtn = createButton('pasteBtn', 'Paste JSON', function() {
        console.log("Paste JSON button clicked");
        // Paste JSON
        let jsonData = prompt("Paste your JSON data here:");
        if (jsonData) {
            try {
                let parsedData = JSON.parse(jsonData);
                localStorage.setItem("infinite-craft-data", JSON.stringify(parsedData));
                window.location.reload();
                console.log("Data pasted and updated");
            } catch (error) {
                console.error("Invalid JSON data", error);
                alert("Invalid JSON data");
            }
        }

    });

    menu.appendChild(saveBtn);
    menu.appendChild(ssaveBtn);
    menu.appendChild(randomBtn);
    menu.appendChild(copyBtn);
    menu.appendChild(pasteBtn);

    document.body.appendChild(menu);
    document.body.appendChild(menuBtn);
}, 500);
