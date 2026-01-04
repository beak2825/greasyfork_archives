// ==UserScript==
// @name        Infinite Craft FastCheat
// @namespace   ICFASTCHEAT
// @match       https://neal.fun/infinite-craft/
// @grant       none
// @version     1.75
// @author      elepsie
// @description Adds a menu on the top left corner.
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/487847/Infinite%20Craft%20FastCheat.user.js
// @updateURL https://update.greasyfork.org/scripts/487847/Infinite%20Craft%20FastCheat.meta.js
// ==/UserScript==

setTimeout(function() {
    var style = `
    .dark-mode-icon {
        display: none;
    }
    .circle {
        border-radius: 50%;
    }
    .container[data-v-2fdee52a] {
        --background-color: #fff;
        --item-bg: #fff;
        --border-color: #c8c8c8;
        --text-color: #000;
        --instance-bg-hover: linear-gradient(0deg,#d6fcff,#fff 90%);
    }
    `
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

    let windowA = document.createElement('div');
    windowA.id = 'windowA';
    windowA.style.backgroundColor = '#2e2e2e';
    windowA.style.width = '250px';
    windowA.style.height = '250px';
    windowA.style.position = 'relative';
    windowA.style.top = '50px';
    windowA.style.left = '200px';
    windowA.style.border = '2px solid #070614';
    windowA.style.borderRadius = '5px';
    windowA.style.padding = '8px';
    windowA.style.display = 'none';

    let themeA = document.createElement('button');
    themeA.id = 'themelight';
    themeA.classList.add('circle');
    themeA.style.width = '50px';
    themeA.style.height = '50px';
    themeA.style.borderColor = '#999999';
    themeA.style.backgroundColor = '#fff';
    themeA.style.position = 'absolute';

    let themeAn = document.createElement('text');
    themeAn.id = 'themelighttxt';
    themeAn.innerHTML = 'Light';
    themeAn.style.color = '#fff';
    themeAn.style.position = 'absolute';
    themeAn.style.top = '55px';
    themeAn.style.left = '15px';

    let themeB = document.createElement('button');
    themeB.id = 'themedark';
    themeB.classList.add('circle');
    themeB.style.width = '50px';
    themeB.style.height = '50px';
    themeB.style.borderColor = '#999999';
    themeB.style.backgroundColor = '#a5a5a5';
    themeB.style.position = 'absolute';
    themeB.style.left = '100px';

    let themeBn = document.createElement('text');
    themeBn.id = 'themedarktxt';
    themeBn.innerHTML = 'Dark';
    themeBn.style.color = '#fff';
    themeBn.style.position = 'absolute';
    themeBn.style.top = '55px';
    themeBn.style.left = '107px';

    let themeC = document.createElement('button');
    themeC.id = 'themedark';
    themeC.classList.add('circle');
    themeC.style.width = '50px';
    themeC.style.height = '50px';
    themeC.style.borderColor = '#999999';
    themeC.style.backgroundColor = '#d5efff';
    themeC.style.position = 'absolute';
    themeC.style.left = '190px';

    let themeCn = document.createElement('text');
    themeCn.id = 'themedarktxt';
    themeCn.innerHTML = 'Pastel';
    themeCn.style.color = '#fff';
    themeCn.style.position = 'absolute';
    themeCn.style.top = '55px';
    themeCn.style.left = '192px';

    let themeD = document.createElement('button');
    themeD.id = 'themecode';
    themeD.classList.add('circle');
    themeD.style.width = '50px';
    themeD.style.height = '50px';
    themeD.style.borderColor = '#999999';
    themeD.style.backgroundColor = '#00c400';
    themeD.style.position = 'absolute';
    themeD.style.top = '100px';

    let themeDn = document.createElement('text');
    themeDn.id = 'themecodetxt';
    themeDn.innerHTML = 'Code';
    themeDn.style.color = '#fff';
    themeDn.style.position = 'absolute';
    themeDn.style.top = '145px';
    themeDn.style.left = '15px';

    let themeE = document.createElement('button');
    themeE.id = 'themespooky';
    themeE.classList.add('circle');
    themeE.style.width = '50px';
    themeE.style.height = '50px';
    themeE.style.borderColor = '#999999';
    themeE.style.backgroundColor = '#ff9e00';
    themeE.style.position = 'absolute';
    themeE.style.top = '100px';
    themeE.style.left = '100px';

    let themeEn = document.createElement('text');
    themeEn.id = 'themespookytxt';
    themeEn.innerHTML = 'Spooky';
    themeEn.style.color = '#fff';
    themeEn.style.position = 'absolute';
    themeEn.style.top = '145px';
    themeEn.style.left = '98px';

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

    let paveBtn = document.createElement('button');
    paveBtn.id = 'paveBtn';
    paveBtn.innerHTML = "Themes";
    paveBtn.style.padding = '8px';
    paveBtn.style.borderRadius = '5px';
    paveBtn.style.backgroundColor = '#2e2e2e';
    paveBtn.style.color = '#ffffff';
    paveBtn.style.border = '2px solid #070614';
    paveBtn.style.cursor = 'pointer';
    paveBtn.style.fontSize = '15.4px';
    paveBtn.style.fontFamily = 'Fira Sans, sans-serif';
    paveBtn.style.position = 'absolute';
    paveBtn.style.top = '250px';
    paveBtn.style.left = '10px';
    paveBtn.style.zIndex = '10000';

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

    let togglep = false;

    paveBtn.addEventListener('click', function() {
        if (togglep) {
            togglep = false;
            windowA.style.display = 'none';
        } else {
            togglep = true;
            windowA.style.display = 'block';
        }
    });

    var newstyle = ''

    themeA.addEventListener('click', function() {
        localStorage.setItem('THEME','LIGHT');
        themeAselect()
    });

    themeB.addEventListener('click', function() {
        localStorage.setItem('THEME','DARK');
        themeBselect()
    });

    themeC.addEventListener('click', function() {
        localStorage.setItem('THEME','PASTEL');
        themeCselect()
    });

    themeD.addEventListener('click', function() {
        localStorage.setItem('THEME','CODE');
        themeDselect()
    });

    themeE.addEventListener('click', function() {
        localStorage.setItem('THEME','SPOOKY');
        themeEselect()
    });

    function themeAselect() {
        newstyle = `
        .container[data-v-2fdee52a] {
        --background-color: #fff;
        --item-bg: #fff;
        --border-color: #c8c8c8;
        --text-color: #000;
        --instance-bg-hover: linear-gradient(0deg,#d6fcff,#fff 90%);
        --sidebar-bg: #fff;
        --instance-bg: linear-gradient(0deg,#f7feff,#fff 70%);
        }
        .logo[data-v-2fdee52a], .site-title[data-v-2fdee52a], .particles[data-v-2fdee52a], .side-controls[data-v-2fdee52a] {
            filter: invert(0);
        }
        .item[data-v-2fdee52a] {
            font-family: Roboto;
            color: #000;
        }
        `
        var newstyleobj = document.createElement('style');
        newstyleobj.innerText = newstyle;
        document.head.appendChild(newstyleobj);
    }

    function themeBselect() {
        newstyle = `
        .container[data-v-2fdee52a] {
        --background-color: #000;
        --item-bg: #000;
        --border-color: #c8c8c8;
        --text-color: #fff;
        --instance-bg-hover: linear-gradient(180deg,#3d4249,#000 80%);
        --sidebar-bg: #000;
        --instance-bg: linear-gradient(180deg,#22252b,#000 80%);
        }
        .logo[data-v-2fdee52a], .site-title[data-v-2fdee52a], .particles[data-v-2fdee52a], .side-controls[data-v-2fdee52a] {
            filter: invert(1);
        }
        .item[data-v-2fdee52a] {
            font-family: Roboto;
            color: #fff;
        }
        `
        var newstyleobj = document.createElement('style');
        newstyleobj.innerText = newstyle;
        document.head.appendChild(newstyleobj);
    }

    function themeCselect() {
        newstyle = `
        .container[data-v-2fdee52a] {
        --background-color: #d5efff;
        --item-bg: #fdd5ff;
        --border-color: #c8c8c8;
        --text-color: #002437;
        --instance-bg-hover: linear-gradient(0deg,#ecf9ff,#fdd5ff 90%);
        --sidebar-bg: #d5efff;
        --instance-bg: #fdd5ff;
        }
        .logo[data-v-2fdee52a], .site-title[data-v-2fdee52a], .particles[data-v-2fdee52a], .side-controls[data-v-2fdee52a] {
            filter: invert(0);
        }
        .item[data-v-2fdee52a] {
            font-family: Roboto;
            color: #000;
        }
        `
        var newstyleobj = document.createElement('style');
        newstyleobj.innerText = newstyle;
        document.head.appendChild(newstyleobj);
    }

    function themeDselect() {
        newstyle = `
        .container[data-v-2fdee52a] {
        --background-color: #000;
        --item-bg: linear-gradient(180deg,#004100,#000 80%);;
        --border-color: #c8c8c8;
        --text-color: #fff;
        --instance-bg-hover: linear-gradient(180deg,#008e00,#000 80%);
        --sidebar-bg: linear-gradient(0deg,#008e00,#000 50%);
        --instance-bg: linear-gradient(180deg,#004100,#000 80%);
        }
        .logo[data-v-2fdee52a], .site-title[data-v-2fdee52a], .particles[data-v-2fdee52a], .side-controls[data-v-2fdee52a] {
            filter: invert(58%) sepia(54%) saturate(3722%) hue-rotate(81deg) brightness(119%) contrast(120%);
            color: #00ff00;
        }
        .item[data-v-2fdee52a] {
            font-family: monospace;
            color: #00ff00;
        }
        `
        var newstyleobj = document.createElement('style');
        newstyleobj.innerText = newstyle;
        document.head.appendChild(newstyleobj);
    }

    function themeEselect() {
        newstyle = `
        .container[data-v-2fdee52a] {
        --background-color: #3c096c;
        --item-bg: #ff9e00;
        --border-color: #c8c8c8;
        --text-color: #000;
        --instance-bg-hover: linear-gradient(180deg,#ffcd7c,#ff9e00 90%);
        --sidebar-bg: #3c096c;
        --instance-bg: #ff9e00;
        }
        .logo[data-v-2fdee52a], .site-title[data-v-2fdee52a], .particles[data-v-2fdee52a], .side-controls[data-v-2fdee52a] {
            filter: invert(61%) sepia(92%) saturate(2511%) hue-rotate(2deg) brightness(109%) contrast(103%);
        }
        .item[data-v-2fdee52a] {
            font-family: Roboto;
            color: #000;
        }
        `
        var newstyleobj = document.createElement('style');
        newstyleobj.innerText = newstyle;
        document.head.appendChild(newstyleobj);
    }
    setTimeout(function() {
        if (localStorage.getItem('THEME') == null || localStorage.getItem('THEME') === 0) {
            localStorage.setItem('THEME','LIGHT');
        } else if (localStorage.getItem('THEME') == 'LIGHT') {
            themeAselect()
        } else if (localStorage.getItem('THEME') == 'DARK') {
            themeBselect()
        } else if (localStorage.getItem('THEME') == 'PASTEL') {
                themeCselect()
        } else if (localStorage.getItem('THEME') == 'CODE') {
            themeDselect()
        } else if (localStorage.getItem('THEME') == 'SPOOKY') {
            themeEselect()
        }
    }, 100);

    container.appendChild(rrsaveBtn);
    container.appendChild(ssaveBtn);
    container.appendChild(sssaveBtn);
    container.appendChild(specs);
    container.appendChild(sspecs);
    container.appendChild(paveBtn);
    container.appendChild(windowA);
    windowA.appendChild(themeA);
    windowA.appendChild(themeAn);
    windowA.appendChild(themeB);
    windowA.appendChild(themeBn);
    windowA.appendChild(themeC);
    windowA.appendChild(themeCn);
    windowA.appendChild(themeD);
    windowA.appendChild(themeDn);
    windowA.appendChild(themeE);
    windowA.appendChild(themeEn);
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
}, 500);