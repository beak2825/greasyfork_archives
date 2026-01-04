// ==UserScript==
// @name         Linkedin Connect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Connect every possible user with your message
// @include     https://www.linkedin.com/search/results/people/*hiring*
// @include     https://www.linkedin.com/search/results/people/*Hiring*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/396105/Linkedin%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/396105/Linkedin%20Connect.meta.js
// ==/UserScript==




const msg = "Hi, I’m a Master’s student at Carnegie Mellon University. We are going to build a mobile app that makes the hiring process more efficient. Do you mind taking a quick survey so we can learn more about the hiring process? Thank you!\nThe survey link: https://forms.gle/NydUPcn8XzrSHoX2A"

const styles = `
.fixedElement {
background-color: white;
position:fixed;
top:0;
right:0;
width:40vw;
z-index:100;
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

var div
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function startConnect() {
    await sleep(1000);
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(2000);
    const allButtons = document.querySelectorAll('button')
    const buttons = []
    for (const button of allButtons)
        if (button.innerText === 'Connect') buttons.push(button);
    while (buttons.length !== 0) {
        const button = buttons.pop()
        const parent = button.parentNode.parentNode.parentNode
        console.log(parent.querySelector('a').href)
        let b = document.createElement("p");
        b.innerText = parent.querySelector('a').href;
        //div.appendChild(b);
        button.click()
        await sleep(500);
        const addNoteButton = document.querySelector('[aria-label="Add a note"]');
        console.log(addNoteButton)
        addNoteButton.click()
        await sleep(500);
        const textareaMsg = document.querySelector("textarea")
        textareaMsg.value = msg
        var evt = document.createEvent("Events");
        evt.initEvent("change", true, true);
        textareaMsg.dispatchEvent(evt);
        await sleep(100)
        const doneButton = document.querySelector('[aria-label="Done"]')?document.querySelector('[aria-label="Done"]'):document.querySelector('[aria-label="Send invitation"]');
        if (doneButton.disabled) {
            document.querySelector('[aria-label="Dismiss"]').click();
            await sleep(1000)
        }
        doneButton.click()
        await sleep(1000)
        console.log("first finished")

    }
    const previousButton = document.querySelector('[aria-label="Next"]');
    previousButton.click()
}
var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    const re = new RegExp("https://www.linkedin.com/search/results/people/.*hiring.*")
    if (document.URL.toLowerCase().match(re))
        startConnect()
};
window.addEventListener('load', ()=>{
    div = document.createElement("div");
    div.classList.add("fixedElement");
    document.body.appendChild(div);
    startConnect()
}, false);