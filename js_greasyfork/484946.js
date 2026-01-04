// ==UserScript==
// @name         Tag shuffler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tag shuffler save loader for NovelAI Image gen
// @author       sllypper
// @license      MIT
// @match        http*://novelai.net/image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484946/Tag%20shuffler.user.js
// @updateURL https://update.greasyfork.org/scripts/484946/Tag%20shuffler.meta.js
// ==/UserScript==

let savedTags = ""
let tagArea = null

function saveTags() {
    tagArea = document.querySelector("[placeholder='Write your prompt here. Use tags to sculpt your outputs.']")
    savedTags = tagArea.value;
}

function restoreTags() {
    tagArea = document.querySelector("[placeholder='Write your prompt here. Use tags to sculpt your outputs.']")
    if (savedTags) tagArea.value = savedTags
}

function shuffle() {
    tagArea = document.querySelector("[placeholder='Write your prompt here. Use tags to sculpt your outputs.']")
    let tags = tagArea.value.split(",").map(t => t.trim()).filter(t => !!t)
    tags = shuffleArray(tags).join(", ").trim() + ',';
    tagArea.value = tags
}

function onReady() {
    placeButtons();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createButton(text, action, styleObj) {
    return $('<button>')
        .text(text)
        .click(action)
        .css(styleObj);
};

function btnLoadCss() {
    return {
        // 'padding': '2px',
        'color': '#333',
        'background-color': 'rgb(246, 245, 244)',
        // 'z-index': '9999999999'
        'font-size': 'small'
    }
}
function placeButtons() {
    console.log('adding button')

    let div = $("<div></div>")
        .css({
            'display': 'flex',
            'gap': '4px',
            'position': 'fixed',
            'top': 0,
            'right': 0,
            'margin': '10px 150px 0 0',
            'color': '#333',
            'z-index': '9999999999'
        });

    let btnCSS = {
        // 'padding': '2px',
        'color': '#333',
        'background-color': 'rgb(246, 245, 244)',
        // 'z-index': '9999999999'
        'font-size': 'small'
    }

    let save = createButton('Save', saveTags, btnCSS);
    let load = createButton('Load', restoreTags, btnCSS);
    let shuffleBtn = createButton('Shuffle', shuffle, btnCSS);

    let tagsText = $('<span>Tags</span>')
        .css({
            'font-size': 'xx-small',
            'color': 'white',
            'position': 'absolute',
            'top': '0',
            'left': '-22px'
        });

    tagsText.appendTo(div);
    save.appendTo(div);
    load.appendTo(div);
    shuffleBtn.appendTo(div);

    // document.body.appendChild(button)
    $('body').append(div);
}

$(onReady);