// ==UserScript==
// @name         MangaDex Update Hider
// @namespace    MDHider
// @version      1.0
// @description  Allows the user to hide specific titles from the mangadex update page permanently by clicking the icon to the right of the title.
// @author       MadHatter
// @match        https://mangadex.org/updates*
// @grant       GM_setValue
// @grant       GM_getValue
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/408447/MangaDex%20Update%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/408447/MangaDex%20Update%20Hider.meta.js
// ==/UserScript==

const KEY = 'MD_FILTER_KEY';

(function() {
    'use strict';
    addIcons();
    filterPage();
})();

function addIcons() {
    let titles = document.getElementsByClassName("manga_title");
    for(const title of titles){
        title.parentElement.append(createBanIcon());
    }
}

function filterPage() {
    let titles = GM_getValue(KEY, []);
    for (const title of titles) {
        hideMe(title);
    }
}

function createBanIcon(){
    let ban = document.createElement("span");
    ban.className = "fas fa-ban";
    ban.style = "margin-left: 5px;"
    ban.onclick = () => {
        let title = ban.previousElementSibling.title;
        hideMe(title);
        addBanToStorage(title);
    };
    return ban;
}

function addBanToStorage(title){
    let titles = GM_getValue(KEY, []);
    if(title){
        titles.push(title);
        GM_setValue(KEY, titles);
        console.log(`${title} has been saved to storage`);
    }
}

function hideMe(title){
    let parent_row = $('[title="'+title+'"]').parentsUntil('tbody','tr');
    let rows = parent_row.nextAll();
    let found = false;
    let row;
    let child;
    $(parent_row).hide();
    for(row of rows){
        for(child of $(row).children()){
            if($(child).find("div").attr('class')=='medium_logo rounded'){
                found = true;
                break;
            }
        }
        if(found){
            break;
        }
        $(row).hide();
    }
}