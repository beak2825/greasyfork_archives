// ==UserScript==
// @name         Torn Themes
// @namespace    nao.torn-theme.zero
// @version      1.6
// @description  change background
// @author       nao
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512850/Torn%20Themes.user.js
// @updateURL https://update.greasyfork.org/scripts/512850/Torn%20Themes.meta.js
// ==/UserScript==

let uploadedImage;
let opacity = localStorage.bgOpactiy || 0.1;
let changeBackground = localStorage.changeBg || "true";
let coverStyle = localStorage.coverBg || "cover";
function apply(){

    let ilink = localStorage.backgroundImage || "https://profileimages.torn.com/0795a2db-c84c-4ec4-b289-a55456dd0d4d-2669774.jpg?v=1940629196397";

    GM_addStyle(`




    body {
    background: url(${ilink}) !important;
    background-size: ${coverStyle} !important;
    background-attachment: fixed !important;

    }





    `);

    if (changeBackground == "true"){
        GM_addStyle(`
            div:not(#tcLogo,
            [class^='progress-line_'],
            .progressbar-wrap, .progressbar-wrap *,
            .bar, .bar *,
            [class^="crime_"],
            [class^="crime_"] *,
            [class^="chat-app"] *,
            .header-wrap *,
            [class^="buttonContainer"] *,
            #profile-mini-root *,
            [class^="snippet_"] *,
            [class^="leadImageWrap_"] *,
            [class^="levelBar_"] *,
            div > a *,
            [class^="hand"] *,
            [class^="card"] *,
            [class^="cell"] *
        )
            {
              background: rgba(0, 0, 0, ${opacity}) !important;
            }

    .configbutton{
        border: 1px solid green !important;
        background: rgba(0,0,200, 0.4) !important;
        border-radius: 10% !important;
        margin-right: 10px !important;
        padding: 5px !important;
     }








    `);
    }
}

function personalSettings(){
    let settingWindow = `
    <div id="settingsConainer">
        <label for="bgOpacity">Opacity: </label>
        <input type="range" id="bgOpacity" class="settingSlider" min="0" max="1" value="${opacity}" step="0.05">
        <label for="chBg">Change Background: </label>
        <input type="button" id="chBg" value="${changeBackground}" class="configbutton">
        <label for="coverBg">Background Type: </label>
        <select name="coverType" id="coverBg">
        <option value=""></option>
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>

    </div>
    `;


    $(".main-wrap").html(settingWindow);
    $(".settingSlider").on("input", () => {
        console.log("SLiding");
        opacity = $("#bgOpacity").attr("value");
        localStorage.bgOpactiy = opacity;

    });

    $("#coverBg").on("input", () => {

        coverStyle = $("#coverBg").attr("value") || "cover";
        localStorage.coverBg = coverStyle;

    });

    $("#chBg").on("click",function(){
        if (localStorage.changeBg == "false"){
            localStorage.changeBg = true;
            changeBackground=true;
            $("#chBg").attr("value", "true");


        }
        else{
            localStorage.changeBg = false;
            changeBackground=false;
            $("#chBg").attr("value", "false");


        }
        apply();

    });
}
function config(){
    if ($(".content-title").length == 0){
        setTimeout(config, 1000);
        return;
    }
    let body = `<div>
    <input type="file" id="image-input" accept="image/*">
        <input id="urllink" type="text" placeholder="URL">
        <button id="configUpdate" class="configbutton">Update</button>
        </div>`;
    $(".content-title").html(body);
    $("#configUpdate").on("click", ()=>{
        let ur = $("#urllink").attr("value");
        if (uploadedImage){
            localStorage.setItem('backgroundImage', uploadedImage);
        }
        if (ur){
            localStorage.backgroundImage = ur;
        }

        alert("Done! " + ur);
        window.location.reload();

    });
    document.getElementById("image-input").addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            uploadedImage = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    personalSettings();
}
if (window.location.href.includes("config")){
    document.title= "Torn Themes";
    config();
}
apply();

