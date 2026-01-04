// ==UserScript==
// @name         Adam script
// @namespace    https://greasyfork.org/users/144229
// @version      1.1
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *amazonaws*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/39593/Adam%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39593/Adam%20script.meta.js
// ==/UserScript==

if (document.querySelector(`[type="radio"]`).length === 0) return;
if ($( 'body:contains(sexual or erotic content)' ).length) { _sanity(); }
document.body.insertAdjacentHTML(
    `afterbegin`,

    `<div style="background-color: lightblue;">` +
    `<label style="color: black; margin-left: 10px;">Adam script</label>` +
    `<span style="margin-left: 3px;cursor:help" title="Press 0 through 9 or z through / to select the radio you want. (0 is 10th) \n\nPress Enter to submit the HIT. \n\n\Check Focus Next to focus and scroll to the next radio. \n\nCheck auto submit to have the HIT submit after you press your keybind.">&#10068;</span>` +

    `<label style="color: black; float: right; margin-right: 10px;">Auto Submit: ` +
    `<input id="autosubmit" type="checkbox" ${GM_getValue(`autosubmit`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="color: black; float: right; margin-right: 10px;">Focus Next: ` +
    `<input id="focusnext" type="checkbox" ${GM_getValue(`focusnext`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="color: black; float: right; margin-right: 10px;">Use [z-/]: ` +
    `<input id="letters" type="checkbox" ${GM_getValue(`letters`) ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="color: black; float: right; margin-right: 10px;">Use [0-9]: ` +
    `<input id="numbers" type="checkbox" ${GM_getValue(`numbers`) ? `checked` : ``}></input>` +
    `</label>` +

    `</div>`
);

const names = [];
const numbers = document.getElementById(`numbers`);
const letters = document.getElementById(`letters`);
const focusnext = document.getElementById(`focusnext`);
const autosubmit = document.getElementById(`autosubmit`);

for (const el of document.querySelectorAll(`[type="radio"]`)) {
    if (names.indexOf(el.name) === -1) {
        names.push(el.name);
    }
}

numbers.addEventListener(`change`, e => GM_setValue(`numbers`, numbers.checked));
letters.addEventListener(`change`, e => GM_setValue(`letters`, letters.checked));
focusnext.addEventListener(`change`, e => GM_setValue(`focusnext`, focusnext.checked));
autosubmit.addEventListener(`change`, e => GM_setValue(`autosubmit`, autosubmit.checked));

document.addEventListener(`keydown`, e => {
    const key = e.key;

    if (key.length === 1) {
        if (numbers.checked && key.match(/[0-9]/)) {
            const radio = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`)[key !== 0 ? key - 1 : 9];

            if (radio) {
                radio.click();
                names.shift();
            }

            if (names.length) {
                if (focusnext) {
                    const next = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`);
                    next[next.length - 1].focus();
                    next[0].scrollIntoView();
                }
            }
            else if (autosubmit.checked) {
                document.querySelector(`[type="submit"]`).click();
            }
        }

        if (letters.checked && key.match(/z|x|c|v|b|n|m|,|\.|\//)) {
            const convert = { 'z': 0, 'x': 1, 'c': 2, 'v': 3, 'b': 4, 'n': 5, 'm': 6, ',': 7, '.': 8, '/': 9 };
            const radio = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`)[convert[key]];

            if (radio) {
                radio.click();
                names.shift();
            }

            if (names.length) {
                if (focusnext) {
                    const next = document.querySelectorAll(`[type="radio"][name="${names[0]}"]`);
                    next[next.length - 1].focus();
                    next[0].scrollIntoView();
                }
            }
            else if (autosubmit.checked) {
                document.querySelector(`[type="submit"]`).click();
            }
        }
    }

    if (key.match(/Enter/) && !names.length) {
        document.querySelector(`[type="submit"]`).click();
    }
});

window.focus();

function _sanity() {
    $(document).ready(function(){
        var anum = 1;
        $( 'div.row' ).css('display', 'none');
        $( 'div.row' ).eq(anum).css('display', 'block');
        $(document).keydown(function(e){
            $( 'div.row' ).eq(anum).css('display', 'none');
            anum++;
            $( 'div.row' ).eq(anum).css('display', 'block');
        });
        var num = 1;
        for(i=0;i<24;i++){
            var dum = `<p>${num}</p>`;
            $('label.btn.btn-default').eq(i).prepend(dum);
            num++;
            if(num>8){
                num=1;
            }
        }
    });
}