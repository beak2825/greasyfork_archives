// ==UserScript==
// @name         Kanji Koohii Quick Add
// @namespace    https://www.fiverr.com/josefandersson0
// @version      1.0
// @description  Add a 'Quick Add' button
// @author       Josef Andersson
// @match        https://kanji.koohii.com/study/kanji/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406536/Kanji%20Koohii%20Quick%20Add.user.js
// @updateURL https://update.greasyfork.org/scripts/406536/Kanji%20Koohii%20Quick%20Add.meta.js
// ==/UserScript==

const menuBtn = document.querySelector('.JsEditFlashcard');

let ucs;

try {
    ucs = JSON.parse(menuBtn.dataset.param).ucs;
} catch (e) {
    console.warn('Invalid ucs!');
}

if (ucs) {
    const quickBtn = Object.assign(document.createElement('a'), {
        className:'uiGUI btn btn-success is-0', innerHTML:'<i class="fa fa-plus"></i>Quick Add', href:'javascript:void(0);' });
    quickBtn.style.marginLeft = '5px';
    
    let busy = false;
    
    quickBtn.addEventListener('click', ev => {
        ev.preventDefault();
        if (busy) return;
        busy = true;

        console.log('Quick adding...');

        fetch('/flashcards/dialog', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `ucs=${ucs}&menu=add`
        }).then(r => r.json()).then(json => {
            if (json.status === 2) {
                menuBtn.parentElement.innerHTML = json.html;
            } else {
                console.warn('Unknown response:', json);
            }
        }).catch(err => {
            console.error(err);
            busy = false;
        });
    });

    menuBtn.parentElement.insertBefore(quickBtn, menuBtn);
    menuBtn.parentElement.insertBefore(menuBtn, quickBtn);
}