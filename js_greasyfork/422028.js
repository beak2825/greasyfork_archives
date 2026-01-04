// ==UserScript==
// @name          ManyAnswers PollMaker
// @description   Create Polls with many answers easier by just pasting a text with one answer per line
// @namespace     https://github.com/victornpb/many-answers-poll-maker
// @version       1.0
// @match         https://www.poll-maker.com/
// @homepageURL   https://github.com/victornpb/many-answers-poll-maker
// @supportURL    https://github.com/victornpb/many-answers-poll-maker/issues
// @contributionURL https://www.buymeacoffee.com/vitim
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/422028/ManyAnswers%20PollMaker.user.js
// @updateURL https://update.greasyfork.org/scripts/422028/ManyAnswers%20PollMaker.meta.js
// ==/UserScript==

function createUI(){
    var html = /**/`
      <div style="background: #3d5ba0;border-radius: 3px;padding: 5px;margin-bottom: 1em;">
      <h2>Anwsers</h2>
        <textarea placeholder="Type one answer per line" style="width: 100%; height: 25em; box-sizing: border-box; white-space: nowrap;" autofocus></textarea>
        <div style="display: flex; margin: 3px;">
          <a>ManyAnswers</a>
          <span style="flex-grow: 1;"></span>  
          <button class="readFromPage">Refresh</button>
          <button class="writeToPage">Set answers</button>  
        </div>
    </div>
    `;
    var d = document.createElement("div");
    d.innerHTML = html;
    var textarea = d.querySelector("textarea");
    
    const parent = document.querySelector('.tab-page.tab-1');

    parent.insertBefore(d, document.querySelector('#qp-ans-b'));
    
    textarea.focus();

    d.querySelector(".readFromPage").onclick = readFromPage;
    d.querySelector(".writeToPage").onclick = writeToPage;
    
    function readFromPage(obj) {
        var arr = read();
        textarea.value = arr.join("\n");
        textarea.select();
    }

    function writeToPage() {
        var str = textarea.value;
        var arr;
        arr = str.split(/\n\r|\n/).map(line=>line.trim()).filter(Boolean);
        if (arr) write(arr);
    }

}

createUI();

function read() {
    return Array.from(document.querySelectorAll("#qp-ans-b input"))
        .map(el => el.value)
        .filter(Boolean);
}

async function write(entries) {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    async function type(el, value) {
        const ev = (el, type) =>{
            var e = new Event(type);
            e.key = "Enter";
            e.keyCode = 13;
            e.which = e.keyCode;
            e.altKey = false;
            e.ctrlKey = false;
            e.shiftKey = false;
            e.metaKey = false;
            e.bubbles = true;
            el.dispatchEvent(e);
        };

        el.focus();
        el.value = value;
        ev(el, 'keydown');
        ev(el, 'keyup');
        ev(el, 'keypress');
        ev(el, 'input');
        await delay(10);
    }

    try {
        const container = document.querySelector("#qp-ans-b");

        for (let i = 0; i < entries.length; i++) {
            const inputs = container.querySelectorAll("input");      
            await type(inputs[i], entries[i]);
        }

        const inputs = container.querySelectorAll("input"); 
        if (inputs.length> entries.length) {
            for (let i = entries.length; i < inputs.length; i++) {
                await type(inputs[i], "");
            }
        }

        await delay(10);

    } catch (err) {
        alert("Something went wrong! Please refresh to discard changes!\n" + err);
        console.error(err);
        debugger;
    }
}
