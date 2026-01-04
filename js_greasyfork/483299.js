// ==UserScript==
// @name         Christmas Town Helper
// @namespace    hardy.ct.helper
// @version      2.3.3
// @description  Christmas Town Helper. Highlights Items, Chests, NPCs. And Games Cheat
// @author       Hardy [2131687]
// @match        https://www.torn.com/christmas_town.php*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/483299/Christmas%20Town%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/483299/Christmas%20Town%20Helper.meta.js
// ==/UserScript==
const unsafeWindow = window;
(function() {
    const unsafeWindow = window;
    'use strict';
    let version = "2.3.3";
    // Thanks to xedx for Dark Mode support
    // Thanks Kafia for beep effect
    //Thanks to Ahab and Helcostr for the list of words and all the help.
    let listofWords = ["elf","eve","fir","ham","icy","ivy","joy","pie","toy","gift","gold","list","love","nice","sled","star","wish","wrap","xmas","yule","angel","bells","cider","elves","goose","holly","jesus","merry","myrrh","party","skate","visit","candle","creche","cookie","eggnog","family","frosty","icicle","joyful","manger","season","spirit","tinsel","turkey","unwrap","wonder","winter","wreath","charity","chimney","festive","holiday","krampus","mittens","naughty","package","pageant","rejoice","rudolph","scrooge","snowman","sweater","tidings","firewood","nativity","reindeer","shopping","snowball","stocking","toboggan","trimming","vacation","wise men","workshop","yuletide","chestnuts","christmas","fruitcake","greetings","mince pie","mistletoe","ornaments","snowflake","tradition","candy cane","decoration","ice skates","jack frost","north pole","nutcracker","saint nick","yule log","card","jolly","hope","scarf","candy","sleigh","parade","snowy","wassail","blizzard","noel","partridge","give","carols","tree","fireplace","socks","lights","kings","goodwill","sugarplum","bonus","coal","snow","happy","presents","pinecone"];
    let hideDrn = true;
    let settings = {"count": 0, "spawn": 0, "speed": 0};
    let lastSoundChirp;
    let mobile = false;
    initiate();
    let chirp = new Audio("https://www.torn.com/js/chat/sounds/Chirp_1.mp3");
    var hangmanArray = [];
    var hangmanCharactersArray = [];
    var wordFixerStart = false;
    var typeGameStart = false;
    var hangmanStart = false;
    let typoCD;
    window.addEventListener("hashchange", addBox);
    let original_fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (url, init) => {
        let response = await original_fetch(url, init)
        let respo = response.clone();
        respo.json().then((data) => {
            if (url.includes("christmas_town.php")) {
                if (init.body) {
                    var body = JSON.parse(init.body);
                }
                if (url.includes("q=move")|| url.includes("q=initMap")) {
                    if (url.includes("q=move")) {
                        if (wordFixerStart || hangmanStart || typeGameStart) {
                            wordFixerStart = false;
                            hangmanStart = false;
                            typeGameStart = false;
                            clearInterval(typoCD);
                            stopGame();
                        }
                    }
                    if (data.mapData) {
                        if (data.mapData.inventory && (settings.spawn === 1 || settings.speed === 1)) {
                            let obj = {};
                            obj.modifier = 0;
                            obj.speedModifier = 0;
                            for (const ornament of data.mapData.inventory) {
                                if (ornament.category == "ornaments") {
                                    if (ornament.modifierType == 'itemSpawn') {
                                        obj.modifier += ornament.modifier;
                                    } else if (ornament.modifierType == 'speed') {
                                        obj.speedModifier += ornament.modifier;
                                    } else {
                                        console.debug('CT: Unknown ornament modifier "' + ornament.modifierType + '"');
                                    }
                                }
                            }
                            GM_setValue("spawn", obj.modifier);
                            GM_setValue("speed", obj.speedModifier);
                            setTimeout(updateSpawnRate, 3000);
                            settings.spawn = 0;
                            settings.speed = 0;
                        }
                        if (data.mapData.items) {
                            let items = data.mapData.items;
                            if (items.length > 0) {
                                settings.count = 1;
                                let itemArray = [];
                                let chestArray = [];
                                for (const item of items) {
                                    let image = item.image.url;
                                    let position = item.position;
                                    let info = ctHelperGetInfo(image);
                                    if (info.type == "chests"||info.type == "combinationChest") {
                                        chestArray.push([info.name, position.x, position.y, info.index]);
                                        if(isChecked('sound_notif_helper', 2)){
                                            beep();
                                        }
                                    } else {
                                        itemArray.push([info.name, position.x, position.y]);
                                        if(isChecked('sound_notif_helper', 2)){
                                            beep();
                                        }
                                    }
                                }
                                chestArray.sort(function(a, b) {
                                    return a[3] - b[3];
                                });
                                ctHelperChangeHTML(itemArray, "hardyNearbyItems");
                                ctHelperChangeHTML(chestArray, "hardyNearbyChests");
                            } else {
                                if (settings.count == 1) {
                                    document.querySelector(".hardyNearbyChests").innerHTML = '<label>Nearby Chests(0)</label><div class="content"></div>';
                                    document.querySelector(".hardyNearbyItems").innerHTML = '<label>Nearby Items(0)</label><div class="content"></div>';
                                    settings.count = 0;
                                }
                            }
                        }
                        if (data.mapData.users) {
                            let users = data.mapData.users;
                            if (users.length > 0) {
                                checkForNPC();
                            }
                        }
                        if (data.mapData && data.mapData.trigger && data.mapData.trigger.item) {
                            let trigger = data.mapData.trigger;
                            settings.spawn = 1;
                            settings.speed = 1;
                            if (trigger.message.includes("You find")) {
                                let itemUrl = trigger.item.image.url;
                                let reg = /\/images\/items\/([0-9]+)\/large\.png/g;
                                if (reg.test(itemUrl)) {
                                    let itemId = itemUrl.split("/")[3];
                                    let savedData = getSaveData();
                                    if (savedData.items[itemId]) {
                                        savedData.items[itemId] += 1;
                                    } else {
                                        savedData.items[itemId] = 1;
                                    }
                                    localStorage.setItem("ctHelperFound", JSON.stringify(savedData));
                                }
                            }
                        }
                    }
                } else if (url.includes("q=miniGameAction")) {
                    if (body && body.action && body.action === "complete" && typeGameStart) {
                        typeGameStart = false;
                        clearInterval(typoCD);
                        stopGame();
                    }
                    if (wordFixerStart) {
                        if (data.finished) {
                            stopGame();
                            wordFixerStart = false;
                        } else {
                            if (data.progress && data.progress.word) {
                                wordSolver(data.progress.word);
                            }
                        }
                    } else if (hangmanStart) {
                        if (data.mistakes === 6 || data.message.startsWith("Congratulations")) {
                            hangmanStart = false;
                            stopGame();
                        } else {
                            hangmanCharactersArray.push(body.result.character.toUpperCase());
                            if (data.positions.length === 0) {
                                let array = [];
                                let letter = body.result.character.toUpperCase();
                                for (const word of hangmanArray) {
                                    if (word.indexOf(letter) === -1) {
                                        array.push(word);
                                    }
                                }
                                hangmanArray = array;
                                hangmanMain();
                            } else {

                                let array = [];
                                let letter = body.result.character.toUpperCase();
                                let positions = data.positions;
                                let length = positions.length;
                                for (const word of hangmanArray) {
                                    var index = 0;
                                    for (const position of positions) {
                                        if (word[position] === letter) {
                                            index += 1;
                                        }
                                    }
                                    if (index === length && countLetter(word, letter) == length) {
                                        array.push(word);
                                    }
                                }
                                hangmanArray = getUnique(array);
                                hangmanMain();
                            }
                        }
                    } else if (typeGameStart) {
                        console.log("nothing");
                    }
                    if (body && body.action && body.action === "start") {
                        if(body.gameType) {
                            let gameType = body.gameType;
                            if (gameType == "gameWordFixer" && isChecked('word_fixer_helper', 2)) {
                                wordFixerStart = true;
                                startGame("Word Fixer");
                                wordSolver(data.progress.word);

                            } else if (gameType === "gameHangman" && isChecked('hangman_helper', 2)) {
                                hangmanStart = true;
                                startGame("Hangman");
                                hangmanArray = [];
                                hangmanCharactersArray = [];
                                let words = data.progress.words;
                                if (words.length > 1) {
                                    hangmanStartingFunction(words[0], words[1]);
                                } else {
                                    hangmanStartingFunction(words[0], 0);
                                }
                            } else if (gameType === "gameTypocalypse" && isChecked('typocalypsehelper', 2)) {

                                if (!typeGameStart) {
                                    typeGameStart = true;
                                    startGame("Typocalypse Helper");
                                    document.querySelector(".hardyGameBoxContent").addEventListener("click", (e)=> {
                                        let target = e.target;
                                        if (target.className === "hardyCTTypoAnswer") {
                                            let input = document.querySelector("div[class^='game'] div[class^='board'] input");
                                            if (input) {
                                                input.value = target.getAttribute("hardy");//the answer that has to be typed
                                                let event = new Event('input', { bubbles: true });
                                                let tracker = input._valueTracker;
                                                if (tracker) {
                                                    tracker.setValue('');
                                                }
                                                input.dispatchEvent(event);
                                            }
                                        }
                                    });
                                    startTypo();
                                }
                            }
                        }
                    }
                }
                if (data.prizes) {
                    settings.spawn = 1;
                    settings.speed = 1;
                    if (data.prizes.length > 0) {
                        let savedData = getSaveData();
                        for (const prize of data.prizes) {
                            if (prize.category === "tornItems") {
                                let itemId = prize.type;
                                if (savedData.items[itemId]) {
                                    savedData.items[itemId] += 1;
                                } else {
                                    savedData.items[itemId] = 1;
                                }
                            }
                        }
                        localStorage.setItem("ctHelperFound", JSON.stringify(savedData));
                    }
                }
                if (data.mapData && data.mapData.cellEvent && data.mapData.cellEvent.prizes) {
                    let prizes = data.mapData.cellEvent.prizes;
                    settings.spawn = 1;
                    settings.speed = 1;
                    if (prizes.length > 0) {
                        let savedData = getSaveData();
                        for (const prize of prizes) {
                            if (prize.category === "tornItems") {
                                let itemId = prize.type;
                                if (savedData.items[itemId]) {
                                    savedData.items[itemId] += 1;
                                } else {
                                    savedData.items[itemId] = 1;
                                }
                            }
                        }
                        localStorage.setItem("ctHelperFound", JSON.stringify(savedData));
                    }
                }

            }
        });
        return response;
    };
    function addBox() {
        if (!document.querySelector(".hardyCTBox")) {
            if (document.querySelector("#christmastownroot div[class^='appCTContainer']")) {
                let newBox = document.createElement("div");
                let pcHTML =
                    `<div class="hardyCTHeader hardyCTShadow">Christmas Town Helper</div>
                <div class="hardyCTContent hardyCTShadow"><br>
                    <div style="display: flex; align-items: flex-start;">
                        <div class="hardyNearbyItems""><label>Nearby Items(0)</label>
                            <div class="content"></div>
                        </div>
                        <div style="align-self: center; width: 70%;">
                	        <div style="margin-bottom: 20px;">
                                <p><a href="#/cthelper" class="ctRecordLink">Settings</a><br></p>
                            </div>
                	        <p class="ctHelperSpawnRate ctHelperSuccess">&nbsp;</p>
                            <p class="ctHelperSpeedRate ctHelperSuccess">&nbsp;</p>
                        </div>
                        <div class="hardyNearbyChests""><label>Nearby Chests(0)</label>
                            <div class="content"></div>
                        </div>
                    </div>
                </div>`;
                let mobileHTML = '<div class="hardyCTHeader hardyCTShadow">Christmas Town Helper</div><div class="hardyCTContent hardyCTShadow"><br><a href="#/cthelper" class="ctRecordLink">Settings</a><br><br><p class="ctHelperSpawnRate ctHelperSuccess">&nbsp;</p><p class="ctHelperSpeedRate ctHelperSuccess">&nbsp;</p><div class="hardyNearbyItems" style="float: left;"><label>Nearby Items(0)</label><div class="content"></div></div><div class="hardyNearbyChests" style="float:right;"><label>Nearby Chests(0)</label><div class="content"></div></div></div>';
                if (mobile) {
                    newBox.innerHTML = mobileHTML
                } else {
                    newBox.innerHTML = pcHTML;
                }
                newBox.className = 'hardyCTBox';
                let doc = document.querySelector("#christmastownroot div[class^='appCTContainer']");
                doc.insertBefore(newBox, doc.firstChild.nextSibling);
                if (timedFunction) {
                    clearInterval(timedFunction);
                }
                settings.spawn = 1;
                settings.speed = 1;
            } else {
                var timedFunction = setInterval(addBox, 1000);
            }
        }
        let pageUrl = window.location.href;
        if (pageUrl.includes("mapeditor") || pageUrl.includes("parametereditor") || pageUrl.includes("mymaps")) {
            document.querySelector(".hardyCTBox").style.display = "none";
            let node = document.querySelector(".hardyCTBox2");
            if (node) {
                node.style.display = "none";
            }
        } else if (pageUrl.includes("cthelper")) {
            document.querySelector(".hardyCTBox").style.display = "none";
            createTable();
            let node = document.querySelector(".hardyCTBox2");
            if (node) {
                node.style.display = "block";
            }
        } else {
            let box = document.querySelector(".hardyCTBox")
            if (box) {
                box.style.display = "block";
            }
            let node = document.querySelector(".hardyCTBox2");
            if (node) {
                node.style.display = "none";
            }
        }
        hideDoctorn();
    }
    function checkForNPC() {
        let npcList = document.querySelectorAll(".ct-user.npc");
        if (npcList.length > 0) {
            for (const npc of npcList) {
                if (npc.querySelector("svg").getAttribute("fill").toUpperCase() === "#FA5B27") {
                    npc.setAttribute("npcType", "santa");
                } else {
                    npc.setAttribute("npcType", "other");
                }
            }
        }
    }
    function ctHelperGetInfo(link) {
        let obj = {};
        obj.type = "item";
        let array = ["/keys/", "/chests/", "/combinationChest/"];
        for (const category of array) {
            if (link.indexOf(category) !== -1) {
                obj.type = category.replace(/\//g, "");
            }
        }
        if (obj.type === "keys") {
            if (link.includes("bronze")) {
                obj.name = "Bronze Key";
            } else if (link.includes("gold")) {
                obj.name = "Golden Key";
            } else if (link.includes("silver")) {
                obj.name = "Silver Key";
            }
        } else if (obj.type == "chests") {
            if (link.includes("1.gif")) {
                obj.name = "Gold Chest";
                obj.index = 0;
            } else if (link.includes("2.gif")) {
                obj.name = "Silver Chest";
                obj.index = 1;
            } else if (link.includes("3.gif")) {
                obj.name = "Bronze Chest";
                obj.index = 3;
            }
        } else if (obj.type == "combinationChest") {
            obj.name = "Combination Chest";
            obj.index = 2;
        } else if (obj.type == "item") {
            obj.name = "Mystery Gift";
        }
        return obj;
    }
    function ctHelperChangeHTML(array, selector) {
        let length = array.length;
        if (length > 0) {
            let newArray = [];
            for (const element of array) {
                newArray.push(`<p>${element[0]} at ${element[1]}, ${element[2]}&nbsp;</p>`);
            }
            if (selector == "hardyNearbyItems") {
                document.querySelector("."+selector).innerHTML = `<label>Nearby Items(${length})</label><div class="content">${newArray.join("")}</div>`;
            } else {
                document.querySelector("."+selector).innerHTML = `<label>Nearby Chests(${length})</label><div class="content">${newArray.join("")}</div>`;
            }
        } else {
            if (selector == "hardyNearbyItems") {
                document.querySelector("."+selector).innerHTML = `<label>Nearby Items(0)</label><div class="content"></div>`;
            } else {
                document.querySelector("."+selector).innerHTML = `<label>Nearby Chests(0)</label><div class="content"></div>`;
            }
        }
    }
    function applyCSS() {
        if (isChecked('santa_clawz_helper', 2)) {
            GM_addStyle(`[class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADuy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADu4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADms'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADjr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADSx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADPy'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADOx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADLx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADKq'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAADCS'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAD03'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACun'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACnk'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACmg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACSe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAACGL'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC1U'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAC0w'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAByX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAADAFBMVEUAAAB7g'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAACzVBMVEUAAACTM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAADlw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAAD67'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC9FBMVEUAAACnR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADy2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADrw'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADlt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADl5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgp'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADgo'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADak'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADKx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAADJn'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD57'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAD16'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAClR'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAACdN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAAC0R'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC91BMVEUAAABxW'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC8VBMVEUAAADKc'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC7lBMVEUAAACXN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADw7'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADvz'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADu6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADsx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADrx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADr1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADpv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADnt'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADe6'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADc2'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADVg'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADOv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADLh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADFV'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAADEx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD68'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAD28'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACup'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAACQN'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0p'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAC0l'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABsX'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAABpe'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB2V'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC/VBMVEUAAAB/e'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADy1'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADt5'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADj4'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADf0'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADcr'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADal'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADLv'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAADJx'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAD9+'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACnl'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACWM'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAACMh'], [class^='cell'] img[src^='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAC+lBMVEUAAAC+Y'] {opacity: .2;}`);
        }
        if (isChecked('snowball_shooter_helper', 2)) {
            GM_addStyle(`[class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABHwAAAB5'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGAAAABu'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABG4AAABm'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABFIAAAB5'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwIAAAB6'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA9QAAABu'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA44AAAB4'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA0gAAABm'], [class^='moving-block'] [style*='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+IAAABm'] {opacity: .2;}`);
        }
        if (isChecked('christmas_wreath_helper', 2)) {
            GM_addStyle(`img[alt='christmas wreath'] {display: none;}`);
        }
        if (isChecked("accessibility_helper", 2)) {
            GM_addStyle('@keyframes pulse {0% {box-shadow: 0 0 0 60px;}50% {box-shadow: 0 0 0 60px;}100% {box-shadow: 0 0 0 60px;}}');
            if (isChecked("santa_helper", 2)) {
                GM_addStyle(`div[npcType="santa"] { border-radius: 50%; color:  #a80a0a6e; animation: pulse 2s ease-out infinite; }`);
            }
            if (isChecked("item_helper", 2)) {
                GM_addStyle(`.items-layer .ct-item img  { color: rgba(145, 135, 77, .66); border-radius: 50% ;animation: pulse 2s ease-in-out infinite; }`);
            }
            if (isChecked("npc_helper", 2)) {
                GM_addStyle(`div[npcType="other"] { border-radius: 50%; color: #0051ff87; animation: pulse 2s ease-out infinite;}`);
            }
        } else {
            GM_addStyle('@keyframes pulse {0% {box-shadow: 0 0 0 0px;}50% {box-shadow: 0 0 0 60px;}100% {box-shadow: 0 0 0 0px;}}');
            if (isChecked("santa_helper", 2)) {
                GM_addStyle(`div[npcType="santa"] { border-radius: 50%; color: #ff00006e; animation: pulse 2s ease-out infinite; }`);
            }
            if (isChecked("item_helper", 2)) {
                GM_addStyle(`.items-layer .ct-item img  { color:rgba(244, 226, 130, .66); border-radius: 50% ;animation: pulse 2s ease-in-out infinite; }`);
            }
            if (isChecked("npc_helper", 2)) {
                GM_addStyle(`div[npcType="other"] { border-radius: 50%; color: #0051ff87; animation: pulse 2s ease-out infinite;}`);
            }
        }
    }
    function sortWord(word) {
        let array = word.toUpperCase().split("");
        array.sort();
        return array.join("");
    }
    function wordSolver(jumbled) {
        var wordSolution = 'whereiscrimes2.0';
        for (const word of listofWords) {
            if (sortWord(word) === sortWord(jumbled)) {
                wordSolution = word.toUpperCase();
            }
        }
        if (wordSolution === 'whereiscrimes2.0') {
            updateGame('<label class="ctHelperError">Sorry! couldn\'t find the solution. ):</label>');
        } else {
            updateGame(`<label class="ctHelperSuccess">${wordSolution}</label>`);
        }
    }
    function getPrices() {
        var last_update = GM_getValue('last');
        if (last_update === null || typeof last_update == "undefined") {
            last_update = 0;
        }
        if (Date.now()/1000 - last_update > 14400) {
            GM_xmlhttpRequest({
                method: 'GET',
                timeout: 20000,
                url: 'https://script.google.com/macros/s/AKfycbyRfg1Cx2Jm3IuCWASUu8czKeP3wm5jKsie4T4bxwZHzXTmPbaw4ybPRA/exec?key=getItems',
                onload: function(e) {
                    try {
                        let data = JSON.parse(e.responseText);
                        if (data.items) {
                            let items = data.items;
                            let obj = {};
                            obj.items = {};
                            for (var pp = 0; pp < items.length; pp++) {
                                let id = items[pp][0];
                                obj.items[id] = {};
                                obj.items[id].name = items[pp][1];
                                obj.items[id].value = items[pp][2];
                            }
                            localStorage.setItem('ctHelperItemInfo', JSON.stringify(obj));
                            GM_setValue('last', Date.now()/1000);
                            console.log("Price data received");
                        }
                    } catch (error) {
                        console.log("Error updating prices: "+error.message);
                    }
                }
            });
        }
    }
    function getSaveData() {
        let savedFinds = localStorage.getItem("ctHelperFound");
        var saved;
        if (typeof savedFinds == "undefined" || savedFinds === null) {
            saved = {};
            saved.items = {};
        } else {
            saved = JSON.parse(savedFinds);
        }
        return saved;
    }
    function createTable() {
        if (!document.querySelector(".hardyCTBox2")) {
            let node = document.createElement("div");
            node.className = "hardyCTBox2";
            document.querySelector(".content-wrapper").appendChild(node);
            document.querySelector(".hardyCTBox2").addEventListener("click", (e) => {
                if (e.target.id === "hardyctHelperSave") {
                    let checkboxes = document.querySelectorAll(".hardyCTHelperCheckbox");
                    for (const checkbox of checkboxes) {
                        if (checkbox.checked) {
                            GM_setValue(checkbox.id, "yes");
                        } else {
                            GM_setValue(checkbox.id, "no");
                        }
                    }
                    location.reload();
                } else if (e.target.id == "hardyctHelperdelete") {
                    document.querySelector(".hardyCTtextBox").innerHTML = '<p>Are you sure you want to delete the finds data?</p><button id="hardyCTConfirmDelete">Yes</button><button id="hardyCTNoDelete">No</button>';
                } else if (e.target.id == "hardyCTConfirmDelete") {
                    let obj = {"items": {}};
                    localStorage.setItem("ctHelperFound", JSON.stringify(obj));
                    document.querySelector(".hardyCTtextBox").innerHTML = '<label class="ctHelperSuccess"Data deleted!</label>';
                    document.querySelector(".hardyCTTable").innerHTML = '';
                } else if (e.target.id == "hardyCTNoDelete") {
                    document.querySelector(".hardyCTtextBox").innerHTML = '';
                }
            });
        }
        document.querySelector(".hardyCTBox2").innerHTML = '<div class="hardyCTHeader">Christmas Town Helper</div><div class="hardyCTTableBox"><div class="hardyCTbuttonBox" style="margin-top: 8px;"><input type="checkbox" class="hardyCTHelperCheckbox" id="santa_helper"  value="yes"'+isChecked('santa_helper', 1)+'><label for="santa_helper">Highlight Santa</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="npc_helper"  value="yes"'+isChecked('npc_helper', 1)+'><label for="npc_helper">Highlight other NPCs</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="typocalypsehelper" value="yes"'+isChecked("typocalypsehelper", 1)+'><label for="typocalypsehelper">Typoclypse Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="item_helper"  value="yes"'+isChecked('item_helper', 1)+'><label for="item_helper">Highlight Chest and Items</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="christmas_wreath_helper"  value="yes"'+isChecked('christmas_wreath_helper', 1)+'><label for="christmas_wreath_helper">Christmas Wreath Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="snowball_shooter_helper"  value="yes"'+isChecked('snowball_shooter_helper', 1)+'><label for="snowball_shooter_helper">Snowball Shooter Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="santa_clawz_helper" value="yes"'+isChecked('santa_clawz_helper', 1)+'><label for="santa_clawz_helper">Santa Clawz Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="word_fixer_helper" value="yes"'+isChecked('word_fixer_helper', 1)+'><label for="word_fixer_helper">Word Fixer Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="hangman_helper" value="yes"'+isChecked('hangman_helper', 1)+'><label for="hangman_helper">Hangman Helper</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="accessibility_helper"  value="yes"'+isChecked('accessibility_helper', 1)+'><label for="accessibility_helper">Accessibility (Dims the highlighter and removes the blinking, for users facing discomfort due to bright color of highlighter)</label><br><input type="checkbox" class="hardyCTHelperCheckbox" id="sound_notif_helper" value="yes"'+isChecked('sound_notif_helper', 1)+'><label for="sound_notif_helper">Sound Notification on Item Find</label><br><a href="#/" class="ctRecordLink" style="display:inline;">Go back</a><button id="hardyctHelperSave">Save Settings</button><button id="hardyctHelperdelete">Delete Finds</button></div><div class="hardyCTtextBox"></div><br><hr><br><div class="hardyCTTable" style="overflow-x:auto;"></div></div>';
        let itemData = localStorage.getItem("ctHelperItemInfo");
        var marketValueData;
        if (typeof itemData == "undefined" || itemData === null) {
            marketValueData = "ched";
        } else {
            marketValueData = JSON.parse(itemData);
        }
        if (marketValueData == "ched") {
            document.querySelector(".hardyCTTableBox").innerHTML = '<label class="ctHelperError">Unable to get data from the spreadsheet. Kindly refresh the page. Contact Father [2131687] if the problem persists</label>';
        } else {
            let savedData = getSaveData();
            let obj = {"items": {}};

            if (savedData == obj) {
                document.querySelector(".hardyCTTableBox").innerHTML = '<label class="ctHelperError">You haven\'t found any items yet. Try again later!</label>';
            } else {
                let calc = {};
                calc.totalValue = 0;
                calc.count = 0;
                let tableArray = [];
                let array = [];
                for (var mp in savedData.items) {
                    let count = savedData.items[mp];
                    let item = marketValueData.items[mp];
                    let name = item.name;
                    let value = item.value;
                    let price = count * value
                    calc.count += parseInt(count);
                    calc.totalValue += parseInt(price);
                    array.push([mp, name, count, value, price]);
                }
                array.sort(function(a, b) {
                    return b[4] - a[4];
                });
                for (const row of array) {
                    tableArray.push(`<tr><td><img src="/images/items/${row[0]}/medium.png", alt = "${row[1]}"></td><td>${row[1]}</td><td>${row[2]}</td><td>$${formatNumber(row[3])}</td><td>$${formatNumber(row[4])}</td></tr>`);
                }
                document.querySelector(".hardyCTTable").innerHTML = '<table><tr><th>Image</th><th>Item Name</th><th>Amount</th><th>Price</th><th>Total</th></tr>'+tableArray.join("")+`</table><p>Total value: $${formatNumber(calc.totalValue)}</p><p> No. of Items: ${calc.count}</p><p>Average value of an item: $${formatNumber(Math.round(calc.totalValue/calc.count))}</p>`;

            }
        }

    }
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function isChecked(element, returnType) {
        let value = GM_getValue(element);
        if (typeof value == "undefined" || value === null || value === "no") {
            if (returnType == 1) {
                return "";
            } else {
                return false;
            }
        } else {
            if (returnType == 1) {
                return " checked";
            } else {
                return true;
            }
        }
    }
    function firstRun () {
        if (!isChecked("firstRun", 2)) {
            GM_setValue("christmas_wreath_helper", "yes");
            GM_setValue("typocalypsehelper", "yes");
            GM_setValue("snowball_shooter_helper", "yes");
            GM_setValue("santa_clawz_helper", "yes");
            GM_setValue("word_fixer_helper", "yes");
            GM_setValue("hangman_helper", "yes");
            GM_setValue("santa_helper", "yes");
            GM_setValue("npc_helper", "yes");
            GM_setValue("item_helper", "yes");
            GM_setValue("firstRun", "blah");
            GM_setValue("version", version);
            GM_setValue("month", Date.now());
        }
    }
    function deleteOldData() {
        let now = new Date(Date.now());
        if (now.getMonth == 11) {
            if (new Date(GM_getValue("month")).getFullYear() != now.getFullYear()) {
                let obj = {"items": {}};
                localStorage.setItem("ctHelperFound", JSON.stringify(obj));
                GM_setValue("month", Date.now());
            }
        }
    }
    function stopGame() {
        let node = document.querySelector(".ctHelperGameBox");
        if (node) {
            node.remove();
        }
    }
    function startGame(gameName) {
        if (!document.querySelector(".ctHelperGameBox")) {
            let node = document.createElement("div");
            node.className = "ctHelperGameBox";
            let reference = document.querySelector(".ct-wrap");
            reference.parentNode.insertBefore(node, reference);
        }
        document.querySelector(".ctHelperGameBox").innerHTML = '<div class="hardyCTHeader">'+gameName+' Helper</div><div class="hardyGameBoxContent"></div>'
    }
    function updateGame(content) {
        let node = document.querySelector(".hardyGameBoxContent");
        if (node) {
            node.innerHTML = content;
        }
    }
    function hangmanStartingFunction(letters1, letters2) {
        if (letters2 == 0) {
            let totalLength = letters1;
            for (const word of listofWords) {
                if (word.length === letters1 && !word.split(" ")[1]) {
                    hangmanArray.push(word.toUpperCase());
                }
            }
        } else {
            let totalLength = letters1 + letters2 + 1;
            for (const word of listofWords) {
                if (word.length === totalLength) {
                    if (word.split(" ")[1] && word.split(" ")[0].length == letters1 && word.split(" ")[1].length == letters2) {
                        hangmanArray.push(word.toUpperCase());
                    }
                }
            }
        }
        hangmanMain();
    }
    function hangmanMain() {
        let array = [];
        let obj = {};
        let html1 = '<p style="font-weight: bold; font-size: 16px; margin: 8px; text-align: center;">Possible Solutions</p><p class="ctHelperSuccess">';
        for (const word of hangmanArray) {
            array.push(word.toUpperCase());
            let letters = getUniqueLetter(word.replace(/\s/g, "").split(""));
            for (const letter of letters) {
                if (obj[letter]) {
                    obj[letter] += 1;
                } else {
                    obj[letter] = 1;
                }
            }
        }
        let sortable = [];
        for (const key in obj) {
            sortable.push([key, obj[key], String(+((obj[key]/hangmanArray.length)*100).toFixed(2))+"% chance"]);
        }
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        let lettersArray = [];
        let limit = {};
        limit.limit = 5;
        let length = sortable.length;
        if (length > 5) {
            limit.limit = 5;
        } else {
            limit.limit = length;
        }
        for (var mkl = 0; mkl < limit.limit; mkl++) {
            let letter = sortable[mkl];
            lettersArray.push(`${letter[0].toUpperCase()} <label class="helcostrDoesntLikeGreenCommas">(${letter[2]})</label>`);
        }
        updateGame(html1+array.join('<label class="helcostrDoesntLikeGreenCommas">, </label>')+'</p><p style="font-weight: bold; font-size: 16px; margin: 8px; text-align: center;">Suggested Letters</p><p class="ctHelperSuccess">'+lettersArray.join('<label class="helcostrDoesntLikeGreenCommas">, </label>')+'</p>');
    }

    function getUnique(array) {
        let newArray = [];
        for (var mn = 0; mn < array.length; mn++) {
            if (newArray.indexOf(array[mn]) == -1) {
                newArray.push(array[mn]);
            }
        }
        return newArray;
    }
    function countLetter(string, letter) {
        let array = string.split("");
        let obj = {};
        obj.count = 0;
        for (const a of array) {
            if (a === letter) {
                obj.count += 1;
            }
        }
        return obj.count;
    }
    function hideDoctorn() {
        if (hideDrn) {
            GM_addStyle(`.doctorn-widget {display: none;}`);
        }
    }
    function getUniqueLetter(argArray) {
        let newArray = [];
        let array = getUnique(argArray);
        for (const letter of array) {
            if (hangmanCharactersArray.indexOf(letter) === -1) {
                newArray.push(letter);
            }
        }
        return newArray;
    }
    function updateSpawnRate() {
        let spawn = GM_getValue("spawn");
        let speed = GM_getValue("speed");
        if (typeof spawn == "undefined" || spawn === null) {
            settings.spawn = 1;
        } else {
            document.querySelector(".ctHelperSpawnRate").innerHTML = `You have a spawn rate bonus of ${spawn}%.`;
        }
        if (typeof speed == "undefined" || speed === null) {
            settings.spawn = 1;
        } else {
            document.querySelector(".ctHelperSpeedRate").innerHTML = `You have a speed rate bonus of ${speed}%.`;
        }
    }
    function checkVersion() {
        let current_version = GM_getValue('version');
        if (current_version === null|| typeof current_version == "undefined" || current_version != version) {
            enableNewFeatures();
            GM_setValue('version', version);
        }
    }
    function enableNewFeatures() {
        console.log("No feature to be enabled by default");
    }
    function initiate() {
        firstRun();
        let innerWidth = window.innerWidth;
        mobile = innerWidth <= 600;
        addBox();
        checkVersion();
        applyCSS();
        getPrices()
        deleteOldData();
        let lastSound = GM_getValue("lastSound");
        if (typeof lastSound === "undefined" || lastSound === null) {
            GM_setValue("lastSound", "0");
            lastSoundChirp = 0;
        } else {
            lastSoundChirp = lastSound;
        }
    }
    function startTypo() {
        typoCD = setInterval(()=> {
            let boxes = document.querySelectorAll("div[class^='game'] div[class^='board'] div[class^='gift']");
            let length = boxes.length;
            let array = [];
            if (length > 0) {
                for (const gift of boxes) {
                    let phrase = gift.innerText;
                    array.push(`<button class="hardyCTTypoAnswer" hardy="${phrase}">${phrase}</button>`);
                }
                array.reverse();
            }
            updateGame(array.join(""));
        }, 500);
    }
    function beep() {
        let now = parseInt(Date.now()/1000);
        let diff = now - lastSoundChirp;
        if (diff >= 60) {
            GM_setValue("lastSound", now);
            lastSoundChirp = now;
            chirp.play();
        }
    }
    GM_addStyle(`
#hardyctHelperSave {background-color: #2da651;}
#hardyctHelperSave:hover {background-color: #2da651c4;}
#hardyctHelperdelete {background-color: #f03b10;}
#hardyctHelperdelete:hover {background-color: #f03b10bd;}
.ctRecordLink:hover {background-color: #53a3d7;}
.ct-user-wrap .user-map:before {display:none;}
body.dark-mode .hardyCTShadow { box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64);}
body.dark-mode .hardyCTHeader { background-color: #454545; border-radius: 0.5em 0.5em 0 0; text-align: center; text-indent: 0.5em; font-size: 16px; color: #b5bbbb; padding: 5px 0px 5px 0px;}
body:not(.dark-mode) .hardyCTHeader { background-color: #0d0d0d; border: 2px solid #000; border-radius: 0.5em 0.5em 0 0; text-align: center; text-indent: 0.5em; font-size: 16px; color: #b5bbbb; padding: 5px 0px 5px 0px;}
body:not(.dark-mode) .hardyCTContent, body:not(.dark-mode) .hardyCTTableBox, body:not(.dark-mode) .hardyGameBoxContent { border-radius: 0px 0px 8px 8px; background-color: rgb(242, 242, 242); color: black; box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding: 5px 8px; overflow: auto; }
.hardyCTBox, .hardyCTBox2, .ctHelperGameBox {margin-bottom: 18px;}
.hardyCTBox2 table { color: #333; font-family: Helvetica, Arial, sans-serif; width: 640px; border: 2px #808080 solid; margin: 20px; }
.hardyCTBox2 td, th { border: 1px solid rgba(0, 0, 0, .55); height: 30px; transition: all 0.3s; }
.hardyCTBox2 th { background: #868282; font-weight: bold; text-align: center; }
.hardyCTBox2 td { background: #c6c4c4; text-align: center;}
.hardyCTBox2 tr:nth-child(even) td { background: #F1F1F1; }
.hardyCTBox2 tr:nth-child(odd) td { background: #c6c4c4; }
.hardyCTBox2 tr td:hover { background: #666; color: #FFF; }
.hardyCTTable { padding: 5px; }
table:not([cellpadding]) td {vertical-align: middle;}
.hardyCTHelperCheckbox { margin: 8px; margin-left: 18px; }
.hardyCTtextBox { text-align: center; }
.hardyCTtextBox button { background-color: rgba(240, 60, 17, .91); }
.hardyCTBox2 button { padding: 8px 5px 8px 5px; border-radius: 4px; color: white; margin: 9px; font-weight: bold;}
.ctHelperError { color: #ff000091; margin: 5px; }
.body:not(.dark-mode) .ctHelperSuccess { color: #38a333; margin: 5px; font-weight: bold; font-size: 16px; line-height: 1.3;}
body.dark-mode .ctHelperSuccess { color: #b5bbbb; margin: 5px; font-weight: bold; font-size: 16px; line-height: 1.3;}
.hardyCTBox2 p { margin: 15px; font-weight: bold; font-family: Helvetica; }
.hardyNearbyItems label, .hardyNearbyChests label { font-weight: bold; }
.hardyCTBox p { margin-top: 9px; font-family: Helvetica; }
body:not(.dark-mode) .helcostrDoesntLikeGreenCommas {color: #333;}
body.dark-mode .helcostrDoesntLikeGreenCommas {color: #919191;}
.ctHelperSpawnRate, .ctHelperSpeedRate {text-align: center; font-size: 14px}
label[for='accessibility_helper'] {line-height: 1.6; margin-left: 8px;}
.hardyCTTypoAnswer {padding: 5px 6px; background-color: #4a9f33; color: white; margin: 5px; border-radius: 5px;}
.hardyCTTypoAnswer:hover, .hardyCTTypoAnswer:focus {color: white;}
`+(mobile ? ` .ctRecordLink { margin: 18px 9px 18px 18px; padding:10px 5px 10px 5px; background-color: #4294f2; border-radius: 4px; color: #fdfcfc; text-decoration: none; font-weight: bold;} body.dark-mode .hardyCTContent, body.dark-mode .hardyCTTableBox, body.dark-mode .hardyGameBoxContent { border-radius: 0px 0px 8px 8px; background-color: #27292d; color: #b5bbbb; box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding: 5px 8px; overflow: auto; } .hardyNearbyItems, .hardyNearbyChests { padding: 4px; display: inline; } .hardyCTContent .content {overflow-y: auto; height: 60px; margin-right: 3px; margin-top: 3px;}`: ` .ctRecordLink { margin: 18px 9px 18px 180px; padding:10px 15px 10px 15px; background-color: #4294f2; border-radius: 4px; color: #fdfcfc; text-decoration: none; font-weight: bold;} body.dark-mode .hardyCTContent, body.dark-mode .hardyCTTableBox, body.dark-mode .hardyGameBoxContent {  height: 140px; border-radius: 0px 0px 8px 8px; background-color: #27292d; color: #b5bbbb; box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -moz-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); -webkit-box-shadow: 0px 4px 9px 3px rgba(119, 119, 119, 0.64); padding: 5px 8px; overflow: auto; } .hardyNearbyItems, .hardyNearbyChests { padding: 4px; display: inline; margin-top: 0px; width: 30%; } .hardyCTContent .content {overflow-y: auto; height: 100px; margin-right: 3px; margin-top: 3px;}`));
})();