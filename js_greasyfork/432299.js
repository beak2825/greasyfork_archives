// ==UserScript==
// @name       mod loader for moomoo.ioe
// @version    1
// @description escape (esc) to open menu
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @grant    none
// @namespace https://greasyfork.org/users/812938
// @downloadURL https://update.greasyfork.org/scripts/432299/mod%20loader%20for%20moomooioe.user.js
// @updateURL https://update.greasyfork.org/scripts/432299/mod%20loader%20for%20moomooioe.meta.js
// ==/UserScript==

if(localStorage.mods == undefined || localStorage.mods == "undefined") localStorage.mods = JSON.stringify([{ name: "jesus mod", url: "https://justgamersmoomooscripts.glitch.me/mods/Jesusmod.txt" }, { name: "Potato mod bots", url: "https://justgamersmoomooscripts.glitch.me/mods/potato13withbots.txt" }]);

function codeSrc(src) {
    var sc = document.createElement("script");
    sc.setAttribute("type", "text/javascript");
    sc.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(sc)
}

window.runMod = codeSrc;

if (localStorage.runModTemp == undefined || localStorage.runModTemp == "undefined") {
    const mods = JSON.parse(localStorage.mods);
    var modMenu = document.createElement("div");


    modMenu.innerHTML = `
    <h2 style='color:black;margin:10px;margin-left:200px;font-weight:bold;'>Mods</h2><br>
    <input type="text" style="display: inline-block; color: cornflowerblue; margin: 15px; background-color: darkgreen; border-radius: 10px;" placeholder="https://urfavmod.com/" id="addmodurl">
    <input type="text" style="display: inline-block; color: cornflowerblue; margin: 15px; background-color: darkgreen; border-radius: 10px;" placeholder="ur fav mod name" id="addmodname">
    <button type="button" id="addmodbtn" style="display: inline-block; color: cornflowerblue; margin: 15px; background-color: darkgreen; border-radius: 25px;">Add new mod</button>
    `

    modMenu.style = `
    display:none;
    position:absolute;
    border-radius:75px;
    background-color:#416600;
    top:50%;
    left:50%;
    margin-top:-200px;
    margin-left:-350px;
    border:5px solid white;
    width:500px;
    height:300px;
    overflow:auto;
    `;

    document.body.prepend(modMenu);

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
            modMenu.style.display = (modMenu.style.display == "block" ? "none" : "block");
        }
    });

    for (let i = 0; i < mods.length; i++) {
        const index = mods[i];
        modMenu.innerHTML += `
        <div></div>
        <a href="${index.url}" target="_blank" style=" display: inline-block; margin: 15px;">${index.name}</a>
        `
        modMenu.innerHTML += `
        <button type="button" id="modbutton${i}" style="display: inline-block; color: cornflowerblue; margin: 15px; background-color: darkgreen; border-radius: 25px;">Load mod</button>
        `
    }

    for (let i = 0; i < mods.length; i++) {
        const index = mods[i];
        document.getElementById(`modbutton${i}`).onclick = function () {
            console.log(`loading ${index.name} from ${index.url}`);
            localStorage.runModTemp = index.url;
            location.reload();
            //codeSrc(index.url);
        }
    }

    var addMod = document.getElementById("addmodbtn");
    var addModU = document.getElementById("addmodurl");
    var addModN = document.getElementById("addmodname");
    addMod.onclick = function(){
if(addModU.value == "" || addModN.value == ""){
    window.alert("Cannot add mod without a link or name! Make sure the link is https and not http.");
} else {
    var temp = JSON.parse(localStorage.mods);
    temp.push({name: addModN.value, url: addModU.value});
    localStorage.mods = JSON.stringify(temp);
}
    }
} else {
    codeSrc(localStorage.runModTemp);
    localStorage.runModTemp = undefined;
}