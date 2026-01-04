// ==UserScript==
// @name         Deface ur enemies
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Поменять никнейм и куклу персонажа в бою и в личной информации. Ники персов в коде
// @author       Something begins
// @license     none
// @match       https://www.heroeswm.ru/*
// @match       https://my.lordswm.com/*
// @match       https://www.lordswm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/483253/Deface%20ur%20enemies.user.js
// @updateURL https://update.greasyfork.org/scripts/483253/Deface%20ur%20enemies.meta.js
// ==/UserScript==
const nbsp = '\u00A0';
const creatureImageSubstitute = "https://cdn.discordapp.com/emojis/1061075162717487145.webp?size=128&quality=lossless";
const achievementImageSubstitute = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Dildo.png/800px-Dildo.png";
const names = {
    "Something begins": { name: "повелитель клитора", imgLink: 'https://i.mycdn.me/videoPreview?id=227376106025&type=32&idx=3&tkn=PvHXgc_MjLK8ZXllPZlVPC8AwKQ&fn=external_7', BM: "нет" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
    "сюда оригинальный ник": { name: "сюда ник на который поменять", imgLink: 'сюда ссылку на пикчу, без пикчи оставлять эту переменную пустой, вот так: imgLink: ""', BM: "тут `да` или `нет`, чтобы заменить ачивки и существа в личной информации" },
}
for (const key of Object.keys(names)){
    names[key.replace(/ /g, nbsp)] = names[key];
}
function getImgLink(nickname) {
    if (Object.keys(names).includes(nickname)) return names[nickname].imgLink;
    for (const dict of Object.values(names)) {
        if (dict.name === nickname) return dict.imgLink;
    }
    return false;
}

function getRandomChoice(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
let replaceName = (string, name) => {
    if (!string) return "";
    const pattern = /\*(.*)\*/;
    const botName = string.match(pattern);
    if (!botName) return string;
    else {
        string = string.replace(botName[1], name);
        return string;
    }
}
const namesDict = {};

function changeNames() {
    for (const cre of Object.values(stage.pole.obj)) {
        if (cre.hero !== 1 || !Object.keys(names).includes(cre.nametxt)) continue;
        console.log(cre.nametxt);
        inf[cre.obj_index] = inf[cre.obj_index].replace(cre.nametxt, names[cre.nametxt].name);
        cre.nametxt = cre.nametxt.replace(cre.nametxt, names[cre.nametxt].name);
        if (cre.command)
            cre.command = cre.command.replace(lordName, switchToName);
        if (cre.command_new)
            cre.command_new = cre.command_new.replace(lordName, switchToName);
    }
}

function stringIncludesArrEle(string, arr) {
    for (const ele of arr) {
        if (string.includes(ele)) return true;
    }
    return false;
}

function handlePLInfo() {
    const allB = document.querySelectorAll("b");
    const allH1 = document.querySelectorAll("h1");
    const allFont = document.querySelectorAll("font");
    const combinedArray = [...allB, ...allH1, ...allFont];
    const nickEles = combinedArray.filter(ele => { return stringIncludesArrEle(ele.textContent.trim(), Object.keys(names)) });
    const nickKeys = combinedArray.filter(ele => { return Object.keys(names).includes(ele.textContent.trim()) });
    let nickKey;
    if (nickKeys.length === 0) return;
    else nickKey = nickKeys[0].textContent;
    console.log(nickKey);
    console.log(nickEles);
    // const nickKey = nickEles[0].textContent.trim();
    const allImgs = document.querySelectorAll("img");
    const kuklaImgs = Array.from(allImgs).filter(img => { return img.src.includes("kukla_png") });
    for (const img of kuklaImgs) {
        img.src = names[nickKey].imgLink;
    }
    for (const ele of nickEles) {
        console.log("before", ele.textContent, ele);
        ele.textContent = ele.textContent.replace(nickKey, names[nickKey].name);
        console.log(ele.textContent, ele);
    }
    // kuklaEle.src = names[nickKey].imgLink;
    if (names[nickKey].BM === "да") {
        const allTables = document.querySelectorAll("table");
        const creTables = Array.from(allTables).filter(table => { return table.querySelector("tbody > tr > td > b") && table.querySelector("tbody > tr > td > b").textContent.includes("Гильдии Лидеров") });
        const achievementsTables = Array.from(allTables).filter(table => { return table.querySelector("tbody > tr > td > b") && table.querySelector("tbody > tr > td > b").textContent.includes("Достижения") });
        if (creTables.length !== 0) {
            console.log(creTables[0])
            const allCre = creTables[0].querySelectorAll(".cre_mon_image1");
            for (const img of allCre) {
                img.src = creatureImageSubstitute;
            }
        }
        if (achievementsTables.length !== 0) {
            console.log(achievementsTables[0])

            for (const img of achievementsTables[0].querySelectorAll(".cre_mon_image2")) {
                img.src = achievementImageSubstitute;
            }
        }
    }
}

function monitorFonts() {
    for (const font of document.querySelectorAll("font")) {
        // font.textContent
        if (Object.keys(names).includes(font.textContent)) {
            font.textContent = names[font.textContent].name;
        }
    }
    for (const div of document.querySelectorAll(".window_relative")) {
        if (div.style.display === "none") continue;
        //console.log(div);
        let name = div.querySelector(".info_head_name > a");
        //console.log(name);
        if (!name) continue;
        name = name.textContent;
        const imgLink = getImgLink(name);
        if (!imgLink) continue;
        //console.log(imgLink);
        const imgElement = div.querySelector("#inv_kukla");
        //console.log(imgElement);
        if (!imgElement) continue;
        if (imgElement.src === imgLink || imgLink === "") continue;
        imgElement.src = imgLink;
    }
}
if (location.pathname.startsWith("/war")) {
    setInterval(monitorFonts, 300);
    let settings_interval = setInterval(() => {
        if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
            clearInterval(settings_interval);
            changeNames();
        }
    }, 300)
    } else if (location.pathname.startsWith("/pl_")) {
        handlePLInfo();
    }