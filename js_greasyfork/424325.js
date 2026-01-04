// ==UserScript==
// @name         BeterSpellen Answer Script [1]
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Easily answer every answer right!
// @author       Yurki
// @match        https://www.beterspellen.nl/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424325/BeterSpellen%20Answer%20Script%20%5B1%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/424325/BeterSpellen%20Answer%20Script%20%5B1%5D.meta.js
// ==/UserScript==


// Functions for script
function getAnswers() {
    let inputs = [
        document.getElementById('aw11'),
        document.getElementById('aw21'),
        document.getElementById('aw31'),
        document.getElementById('aw41'),
    ]


    inputs.forEach(f => { f.click() });


    GM_setValue('1', '1')
    GM_setValue('2', '1')
    GM_setValue('3', '1')
    GM_setValue('4', '1')
    GM_setValue('clicked', 'true')

    document.getElementsByName('submit')[0].click()
}

function savAnswers() {
    let divs = [
        document.getElementsByClassName('tekstvakdiv')[2],
        document.getElementsByClassName('tekstvakdiv')[3],
        document.getElementsByClassName('tekstvakdiv')[4],
        document.getElementsByClassName('tekstvakdiv')[5],
    ]
    let answerText = []

    let i = 1
    let j = 2

    divs.forEach(f => {
        if(f.innerText.includes('Goed!')) {
            GM_setValue(i, '1')
            console.log('Got one')
        } else {
            console.log('Fout');
            GM_setValue(i, document.getElementsByClassName('tekstvakdiv')[j].getElementsByClassName('uitlegdiv')[0].getElementsByTagName('b')[1].innerText)
            answerText.push({ i: document.getElementsByClassName('tekstvakdiv')[j].getElementsByClassName('uitlegdiv')[0].getElementsByTagName('b')[1].innerText })
        }
        i++
        j++
    })

    GM_setValue('clicked', 'false')
    console.log(answerText)
}

function putAnswers() {
    let i = 1
    let array = [ '1', '2', '3', '4' ]

    array.forEach(f => {
        if(document.getElementById(`aw${f}${GM_getValue(i)}`)){
            document.getElementById(`aw${f}${GM_getValue(i)}`).click()
            console.log(`answered question ${i}`)
        } else {
            for (const a of document.querySelectorAll("label")) {
                if (a.textContent === GM_getValue(i)) {
                    console.log(a.textContent)
                    console.log(a)
                    a.control.click()
                }
            }
        }

        console.log(document.getElementById(`aw${f}${GM_getValue(i)}`))
        i++
    })

}


// Key handler
function handleKey(evt) {
    if(evt.keyCode == '40'){ if(confirm('Do you want to answer all questions wrong and fetch the answers?')){ getAnswers() } };
    if(evt.keyCode == '38'){ if(confirm('Do you want to insert the last saved answers (DOESNT WORK IF IN INCOGNITO)')){ putAnswers() } }
}


// Inserting div for instructions
var div = document.createElement('div');
var t1 = document.createElement('p');
var t2 = document.createElement('p');
var t3 = document.createElement('p');

t1.innerText += 'Pijltje omhoog > Goede antwoorden inzenden [MAIN]';
t1.style.color = '#ffffff';
t1.style.margin = "10px 20px 20px";

t2.innerText += 'Pijltje omlaag > Fout antwoorden en opslaan [ALT]';
t2.style.color = '#ffffff';
t2.style.margin = "10px 20px 20px";

t3.innerText += `Account : ${document.getElementsByClassName('bovenbalk')[3].innerText.split('\n')[3]}`;
t3.style.color = '#ffffff';
t3.style.margin = '10px 20px 20px';

div.id = 'INJECT'
div.style.position = 'fixed';
div.style.top = 0;
div.style.right = 0;
div.style.backgroundColor = '#000000';

document.body.appendChild(div);
document.getElementById('INJECT').appendChild(t1);
document.getElementById('INJECT').appendChild(t2);
document.getElementById('INJECT').appendChild(t3);


// Key event listener
document.addEventListener('keydown', handleKey, true);


// Check if clicked
if(GM_getValue('clicked') == 'true') { savAnswers() }