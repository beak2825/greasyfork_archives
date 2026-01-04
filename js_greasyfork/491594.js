// ==UserScript==
// @name        Infinite Craft FastCheat
// @namespace   New Version!
// @match       https://neal.fun/infinite-craft/*
// @grant       none
// @version     1.5
// @author      BlackMarket
// @license GNU General Public License v3.0
// @description Adds a menu on the top left corner for fast access to cheats.
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/491594/Infinite%20Craft%20FastCheat.user.js
// @updateURL https://update.greasyfork.org/scripts/491594/Infinite%20Craft%20FastCheat.meta.js
// ==/UserScript==
 
console.log("Script loaded");
 
// Add a delay of 1 second (1000 milliseconds) before executing the script
setTimeout(function() {
    let container = document.querySelector('.container');
 
    if (!container) {
        console.error('Container not found');
        return;
    }
    console.log("Container found:", container);
 
    let specs = document.createElement('p');
    specs.id = 'specs';
    specs.innerHTML = "I.C. Fast Cheat";
    specs.style.padding = '8px';
    specs.style.borderRadius = '5px';
    specs.style.backgroundColor = '#2e2e2e';
    specs.style.color = '#B9B9B9';
    specs.style.border = '2px solid #070614';
    specs.style.fontSize = '15.4px';
    specs.style.fontFamily = 'Fira Sans, sans-serif';
    specs.style.position = 'absolute';
    specs.style.top = '50px';
    specs.style.left = '10px';
    specs.style.zIndex = '10000';
 
    let sspecs = document.createElement('p');
    sspecs.id = 'specs';
    sspecs.innerHTML = `v${GM.info.script.version}`;
    sspecs.style.padding = '8px';
    sspecs.style.borderRadius = '5px';
    sspecs.style.backgroundColor = '#2e2e2e';
    sspecs.style.color = '#B9B9B9';
    sspecs.style.border = '2px solid #070614';
    sspecs.style.fontSize = '15.4px';
    sspecs.style.fontFamily = 'Fira Sans, sans-serif';
    sspecs.style.position = 'absolute';
    sspecs.style.top = '50px';
    sspecs.style.left = '140px';
    sspecs.style.zIndex = '10000';
 
    let rrsaveBtn = document.createElement('button');
    rrsaveBtn.id = 'rrsaveBtn';
    rrsaveBtn.innerHTML = "Add Item";
    rrsaveBtn.style.padding = '8px';
    rrsaveBtn.style.borderRadius = '5px';
    rrsaveBtn.style.backgroundColor = '#2e2e2e';
    rrsaveBtn.style.color = '#ffffff';
    rrsaveBtn.style.border = '2px solid #070614';
    rrsaveBtn.style.cursor = 'pointer';
    rrsaveBtn.style.fontSize = '15.4px';
    rrsaveBtn.style.fontFamily = 'Fira Sans, sans-serif';
    rrsaveBtn.style.position = 'absolute';
    rrsaveBtn.style.top = '100px';
    rrsaveBtn.style.left = '10px';
    rrsaveBtn.style.zIndex = '10000';
 
    let sssaveBtn = document.createElement('button');
    sssaveBtn.id = 'sssaveBtn';
    sssaveBtn.innerHTML = "Only Item Challenge";
    sssaveBtn.style.padding = '8px';
    sssaveBtn.style.borderRadius = '5px';
    sssaveBtn.style.backgroundColor = '#2e2e2e';
    sssaveBtn.style.color = '#ffffff';
    sssaveBtn.style.border = '2px solid #070614';
    sssaveBtn.style.cursor = 'pointer';
    sssaveBtn.style.fontSize = '15.4px';
    sssaveBtn.style.fontFamily = 'Fira Sans, sans-serif';
    sssaveBtn.style.position = 'absolute';
    sssaveBtn.style.top = '150px';
    sssaveBtn.style.left = '10px';
    sssaveBtn.style.zIndex = '10000';
 
    let ssaveBtn = document.createElement('button');
    ssaveBtn.id = 'ssaveBtn';
    ssaveBtn.innerHTML = "Starter Pack";
    ssaveBtn.style.padding = '8px';
    ssaveBtn.style.borderRadius = '5px';
    ssaveBtn.style.backgroundColor = '#2e2e2e';
    ssaveBtn.style.color = '#ffffff';
    ssaveBtn.style.border = '2px solid #070614';
    ssaveBtn.style.cursor = 'pointer';
    ssaveBtn.style.fontSize = '15.4px';
    ssaveBtn.style.fontFamily = 'Fira Sans, sans-serif';
    ssaveBtn.style.position = 'absolute';
    ssaveBtn.style.top = '200px';
    ssaveBtn.style.left = '10px';
    ssaveBtn.style.zIndex = '10000';
 
    let laveBtn = document.createElement('button');
    laveBtn.id = 'laveBtn';
    laveBtn.innerHTML = "GreasyFork";
    laveBtn.style.padding = '8px';
    laveBtn.style.borderRadius = '5px';
    laveBtn.style.backgroundColor = '#2e2e2e';
    laveBtn.style.color = '#ffffff';
    laveBtn.style.border = '2px solid #070614';
    laveBtn.style.cursor = 'pointer';
    laveBtn.style.fontSize = '15.4px';
    laveBtn.style.fontFamily = 'Fira Sans, sans-serif';
    laveBtn.style.position = 'absolute';
    laveBtn.style.top = '1200px';
    laveBtn.style.left = '10px';
    laveBtn.style.zIndex = '10000';
 
    let llaveBtn = document.createElement('button');
    llaveBtn.id = 'llaveBtn';
    llaveBtn.innerHTML = "Discord";
    llaveBtn.style.padding = '8px';
    llaveBtn.style.borderRadius = '5px';
    llaveBtn.style.backgroundColor = '#2e2e2e';
    llaveBtn.style.color = '#ffffff';
    llaveBtn.style.border = '2px solid #070614';
    llaveBtn.style.cursor = 'pointer';
    llaveBtn.style.fontSize = '15.4px';
    llaveBtn.style.fontFamily = 'Fira Sans, sans-serif';
    llaveBtn.style.position = 'absolute';
    llaveBtn.style.top = '1150px';
    llaveBtn.style.left = '10px';
    llaveBtn.style.zIndex = '10000';
 
    ssaveBtn.addEventListener('click', function() {
        console.log("Button clicked");
        const conform = confirm("Are you sure you want to do this? It will reset your progress!");
        if (conform == false) {
            return;
        }
        localStorage.removeItem("infinite-craft-data");
        var doesExists = localStorage.getItem("infinite-craft-data");
        var confirmed;
        var replace = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}';
 
        if (doesExists == null) {
            localStorage.setItem("infinite-craft-data", replace);
        }
 
        var initial = localStorage.getItem("infinite-craft-data");
        var array = JSON.parse(initial).elements;
        var text = "Hitler"
 
        if (text === null) {
            return;
        }
 
        var emoji = "👑"
 
        if (emoji === null) {
            return;
        }
 
        var discovered = false
        var ItemsToAdd = {
            text: text,
            emoji: emoji,
            discovered: discovered
        };
 
        array.push(ItemsToAdd);
        var newItem = {
            elements: array
        };
 
        array = JSON.stringify(newItem);
        localStorage.setItem("infinite-craft-data", array);
        function additem(txt,emoj) {
            doesExists = localStorage.getItem("infinite-craft-data");
            confirmed;
            replace = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}';
 
            if (doesExists == null) {
                localStorage.setItem("infinite-craft-data", replace);
            }
 
            initial = localStorage.getItem("infinite-craft-data");
            array = JSON.parse(initial).elements;
            text = txt
 
            if (text === null) {
                return;
            }
 
            emoji = emoj
 
            if (emoji === null) {
                return;
            }
 
            discovered = false
            ItemsToAdd = {
                text: text,
                emoji: emoji,
                discovered: discovered
            };
 
            array.push(ItemsToAdd);
            newItem = {
                elements: array
            };
 
            array = JSON.stringify(newItem);
            localStorage.setItem("infinite-craft-data", array);
        }
        additem("","+")
        additem("","=")
        additem("","x2 =")
        additem("Obama","🐻")
        additem("Trump","💩")
        additem("Infinite Craft","🌌")
        additem("Anime Hitler","👹")
        window.location.reload();
        console.log("DONE");
    });
 
    rrsaveBtn.addEventListener('click', function() {
        console.log("Button clicked");
        let doesExists = localStorage.getItem("infinite-craft-data");
        let confirmed;
        let replace = '{"elements":[{"text":"Water","emoji":"💧","discovered":false},{"text":"Fire","emoji":"🔥","discovered":false},{"text":"Wind","emoji":"🌬️","discovered":false},{"text":"Earth","emoji":"🌍","discovered":false}]}';
 
        if (doesExists == null) {
            localStorage.setItem("infinite-craft-data", replace);
        }
 
        let initial = localStorage.getItem("infinite-craft-data");
        let array = JSON.parse(initial).elements;
        let text = prompt("Item name.");
 
        if (text === null) {
            return;
        }
 
        let emoji = prompt("Emoji. Press Windows+.");
 
        if (emoji === null) {
            return;
        }
 
        let discovered = confirm("FD?");
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
 
    var initialZIndex = 0;
    var toggledonoroff = true; // assuming it's defined somewhere
 
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey) {
            console.log("Toggle button clicked");
            toggledonoroff = !toggledonoroff;
            specs.style.display = toggledonoroff ? 'block' : 'none';
            sspecs.style.display = toggledonoroff ? 'block' : 'none';
            ssaveBtn.style.display = toggledonoroff ? 'block' : 'none';
            sssaveBtn.style.display = toggledonoroff ? 'block' : 'none';
            rrsaveBtn.style.display = toggledonoroff ? 'block' : 'none';
            console.log("rsaveBtn display:", rsaveBtn.style.display);
        }
        if (event.key === "Tab") {
            console.log("Toggle button clicked");
            toggledonoroff = !toggledonoroff;
            specs.style.display = toggledonoroff ? 'block' : 'none';
            sspecs.style.display = toggledonoroff ? 'block' : 'none';
            ssaveBtn.style.display = toggledonoroff ? 'block' : 'none';
            sssaveBtn.style.display = toggledonoroff ? 'block' : 'none';
            rrsaveBtn.style.display = toggledonoroff ? 'block' : 'none';
            console.log("rsaveBtn display:", rsaveBtn.style.display);
        }
    });
 
 
 
    sssaveBtn.addEventListener('click', function() {
        console.log("Button clicked");
        const confarm = confirm("Are you sure you want to do this? It will reset your progress!");
        if (confarm == false) {
            return;
        }
        let doesExists = localStorage.getItem("infinite-craft-data");
        let confirmed;
        let replace = '{"elements":[]}';
        localStorage.setItem("infinite-craft-data", replace);
 
        if (doesExists == null) {
            localStorage.setItem("infinite-craft-data", replace);
        }
 
        let initial = localStorage.getItem("infinite-craft-data");
        let array = JSON.parse(initial).elements;
        let text = prompt("Item name.");
 
        if (text === null) {
            return;
        }
 
        let emoji = prompt("Emoji. Press Windows+.");
 
        if (emoji === null) {
            return;
        }
 
        let discovered = confirm("Discovered?");
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
 
    laveBtn.addEventListener('click', function() {
        console.log("Button clicked");
        window.location.href = "https://greasyfork.org/en/scripts/487847-infinite-craft-fastcheat";
        console.log("DONE");
    });
 
    llaveBtn.addEventListener('click', function() {
        console.log("Button clicked");
        window.location.href = "https://discord.gg/Y479KdAUS3";
        console.log("DONE");
    });
 
    container.appendChild(rrsaveBtn);
    container.appendChild(ssaveBtn);
    container.appendChild(laveBtn);
    container.appendChild(llaveBtn);
    container.appendChild(sssaveBtn);
    container.appendChild(specs);
    container.appendChild(sspecs);
    console.log("Button added to container");
}, 100); // 1000 milliseconds = 1 second