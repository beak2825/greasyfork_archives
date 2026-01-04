// ==UserScript==
// @name         UAV Editor Kalender entfernen
// @namespace    hhttps://app.uaveditor.com
// @version      0.1
// @description  Falls man die neue Kalender Funktion nicht braucht nimmt sie wertvollen Platz weg. Hiermit kann man die Funktion entfernen.
// @author       drone42pilot@gmail.com
// @match        https://app.uaveditor.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/446196/UAV%20Editor%20Kalender%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/446196/UAV%20Editor%20Kalender%20entfernen.meta.js
// ==/UserScript==

'use strict';
setTimeout(removeCalendar,2000);

function removeElementsByClassName(className) {
    console.log(`removeElementByClassName(${className})`);
    let elements = document.getElementsByClassName(className);
    console.log(elements);
    if (elements != null)
    {
        for (let i=0;i<elements.length;i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }
}

function removeCalendar() {
    removeElementsByClassName('tui-calendar-react-root');
    removeElementsByClassName('col-sm-4 col-6');
}
