// ==UserScript==
// @name         Clorthax Script
// @namespace    https://greasyfork.org/en/scripts/446975-clorthax-script
// @version      2.0.0
// @description  Script for Clorthax's Summer Sale Quest 2022
// @author       duongoku
// @source       https://gist.github.com/duongoku/f8257fb783250e85e34f1ae9d1b30aec
// @license      GNU GPLv3
// @match        https://store.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/446975/Clorthax%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/446975/Clorthax%20Script.meta.js
// ==/UserScript==

async function do_quest() {
    console.log("Doing quest . . .");

    // Scroll to bottom to find some buttons
    window.scrollTo(0, document.body.scrollHeight);

    // Wait for the quest page to load
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (document.querySelector("#application_config")) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    // Get quest data elements
    let application_config = document.querySelector("#application_config");
    let data_capsuleinsert = JSON.parse(
        application_config.attributes["data-capsuleinsert"].textContent
    );
    let data_community = JSON.parse(
        application_config.attributes["data-community"].textContent
    );
    let data_userinfo = JSON.parse(
        application_config.attributes["data-userinfo"].textContent
    );

    if (
        data_capsuleinsert == null ||
        data_community == null ||
        data_userinfo == null
    ) {
        return;
    }

    // Extract quest data
    let datarecord = data_capsuleinsert.datarecord;
    let door_index = data_capsuleinsert.payload;
    let clan_accountid = data_community.CLANACCOUNTID;
    let authwgtoken = data_userinfo.authwgtoken;

    // Map document cookie to an object
    let cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
    }, {});

    // Extract session cookie
    let sessionid = cookies.sessionid;

    // Send request to complete quest
    await fetch("https://store.steampowered.com/saleaction/ajaxopendoor", {
        headers: {
            "content-type":
                "multipart/form-data; boundary=----WebKitFormBoundaryLMAO",
        },
        body:
            `------WebKitFormBoundaryLMAO\r\nContent-Disposition: form-data; name="sessionid"\r\n\r\n${sessionid}\r\n` +
            `------WebKitFormBoundaryLMAO\r\nContent-Disposition: form-data; name="authwgtoken"\r\n\r\n${authwgtoken}\r\n` +
            `------WebKitFormBoundaryLMAO\r\nContent-Disposition: form-data; name="datarecord"\r\n\r\n${datarecord}\r\n` +
            `------WebKitFormBoundaryLMAO\r\nContent-Disposition: form-data; name="door_index"\r\n\r\n${door_index}\r\n` +
            `------WebKitFormBoundaryLMAO\r\nContent-Disposition: form-data; name="clan_accountid"\r\n\r\n${clan_accountid}\r\n` +
            `------WebKitFormBoundaryLMAO--\r\n`,
        method: "POST",
        mode: "cors",
        credentials: "include",
    });

    window.location = "https://store.steampowered.com/sale/clorthax_quest";
}

async function go_to_quest() {
    console.log("Going to quest page . . .");

    // Scroll to bottom to find some buttons
    window.scrollTo(0, document.body.scrollHeight);

    // Wait for the quest page to load
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (
                Array.from(document.querySelectorAll(".LinkButton")).length > 1
            ) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    let button_click_me = document.querySelector(".Secondary.Focusable");
    if (button_click_me) {
        button_click_me.click();
        go_to_quest();
        return;
    }

    let button_go_to_quest = Array.from(
        document.querySelectorAll(".LinkButton")
    ).slice(-1)[0];

    if (button_go_to_quest.textContent.trim().toLowerCase() != "your profile") {
        console.log(button_go_to_quest.textContent.trim().toLowerCase());
        button_go_to_quest.click();
    } else {
        alert("YOUR QUEST IS FINISHED!");
        document.querySelector(".SummerSale2022_Header").firstChild.innerText =
            "YOUR QUEST IS FINISHED! THANKS FOR USING MY SCRIPT <3";
        document
            .querySelector(".SummerSale2022_Header")
            .parentElement.parentElement.scrollIntoView();
    }
}

if (
    `${window.location.origin}${window.location.pathname}`.startsWith(
        "https://store.steampowered.com/sale/clorthax_quest"
    )
) {
    document.onreadystatechange = go_to_quest;
}

let quest_list = [
    "https://store.steampowered.com/category/arcade_rhythm",
    "https://store.steampowered.com/category/arcade_rhythm/",
    "https://store.steampowered.com/category/casual",
    "https://store.steampowered.com/category/casual/",
    "https://store.steampowered.com/category/horror",
    "https://store.steampowered.com/category/horror/",
    "https://store.steampowered.com/category/multiplayer_coop",
    "https://store.steampowered.com/category/multiplayer_coop/",
    "https://store.steampowered.com/category/rpg",
    "https://store.steampowered.com/category/rpg/",
    "https://store.steampowered.com/category/simulation",
    "https://store.steampowered.com/category/simulation/",
    "https://store.steampowered.com/category/sports",
    "https://store.steampowered.com/category/sports/",
    "https://store.steampowered.com/category/strategy",
    "https://store.steampowered.com/category/strategy/",
    "https://store.steampowered.com/category/strategy_cities_settlements",
    "https://store.steampowered.com/category/strategy_cities_settlements/",
    "https://store.steampowered.com/vr",
    "https://store.steampowered.com/vr/",
];

if (
    quest_list.includes(`${window.location.origin}${window.location.pathname}`)
) {
    document.onreadystatechange = do_quest;
}
