// ==UserScript==
// @name         SongCompetitionSaver
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Save song, artist and link from song competitions by clicking a button before the game
// @author       semihM (aka rhinoooo_)
// @source       https://github.com/semihM/TamperMonkeyScripts/blob/main/SongCompetitionSaver
// @supportURL   https://github.com/semihM/TamperMonkeyScripts/issues
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?song\-competition\.live/.*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438885/SongCompetitionSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/438885/SongCompetitionSaver.meta.js
// ==/UserScript==

document.saveSongsToFile = async function(){
    let anchor = document.getElementById("save_anchor");
    let rows = await document.getSongTexts();

    if(rows == null) return;

    anchor.href = "data:text/plain;charset=UTF-8," + rows;
    console.log(anchor);
    anchor.click();
}

document.getSongTexts = async function() {
    let rows;
    let viewButton;
    let infoButton;
    let container = document.getElementsByClassName("v-data-table__wrapper")[0];
    let beta = location.href.startsWith("https://beta");
    if (container == null)
    {
        if (beta)
        {
            for(let e of document.querySelectorAll("[class='v-list-item__title']")){
                if(e.textContent == "Songs")
                {
                    viewButton = e.parentElement.parentElement;
                }
                else if (e.textContent == "Info")
                {
                    infoButton = e.parentElement.parentElement;
                }
            }
        }
        else viewButton = document.getElementsByClassName("mb-2 mr-2 v-btn v-btn--icon v-btn--round theme--dark v-size--default")[0];

        viewButton.click();
        await new Promise(resolve => setTimeout(resolve, 150));
        container = document.getElementsByClassName("v-data-table__wrapper")[0];
        rows = container.children[0].children[2].children;

    }
    else rows = container.children[0].children[2].children;

    let save = "";

    console.log(rows)
    if (rows.length == 1 && rows[0].textContent == "No data available")
    {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (rows.length == 1 && rows[0].textContent == "No data available")
        {
            alert("No songs submitted yet!!!");

            if (infoButton != null) infoButton.click();
            else viewButton.click();

            return null;
        }
    }

    for(let t of rows) {
        if (t.textContent == 'No Songs found.')
        {
            alert("No songs submitted yet!");

            if (infoButton != null) infoButton.click();
            else viewButton.click();

            return null;
        }
        console.log(t);

        if(beta)
        {
            if (t.children[0].innerHTML.indexOf("https://i.ytimg.com") > 0) save += t.children[1].textContent.replace("\n","").trim() + " (" + t.children[2].textContent.replace("\n","").trim() + ") (https://www.youtube.com/watch?v=" + t.children[0].children[0].children[0].children[0].src.split("/")[4] + ")\n";
            else save += t.children[1].textContent.replace("\n","").trim() + " (" + t.children[2].textContent.replace("\n","").trim() + ")\n";
        }
        else save += t.children[1].textContent + " (" + t.children[5].children[0].children[1].href + ")\n";
    }

    if (infoButton != null) infoButton.click();
    else viewButton.click();

    return save;
}

document.buttonAdder = function() {
    let title;
    let beta = location.href.startsWith("https://beta");
    if (beta) title = document.getElementsByClassName("cardTop v-card v-sheet theme--dark")[0];
    else title = document.getElementsByClassName("v-card__title")[0];

    if (!beta && (title == null || title.textContent != "Game Info")) setTimeout(document.buttonAdder,1500);
    else if (beta && (title == null || !title.textContent.endsWith("Start"))) setTimeout(document.buttonAdder,1500);
    else title.innerHTML += `<br><button style="color:purple;border: 2px solid purple;padding:3px" id="save_songs_button" onclick="document.saveSongsToFile()">Save Current Song Links</button><a style="display:none" id="save_anchor" href="data:text/plain;charset=utf-8" download="songs.txt"></a>`
}
setTimeout(document.buttonAdder, 1500);