// ==UserScript==
// @name         ConvertMunzeeEasily
// @namespace    VirtualMunzee
// @version      0.5
// @description  Show the virtual munzee names on the 'convert' page
// @author       CzPeet
// @match        https://www.munzee.com/m/*/*/admin/convert*
// @update       https://greasyfork.org/en/scripts/373533-showvirtualmunzeename
// @icon         https://banner2.cleanpng.com/20180320/avw/kisspng-trademark-brand-aqua-clip-art-iconvert-5ab08819d90e45.4369185715215186178891.jpg
// @downloadURL https://update.greasyfork.org/scripts/373533/ConvertMunzeeEasily.user.js
// @updateURL https://update.greasyfork.org/scripts/373533/ConvertMunzeeEasily.meta.js
// ==/UserScript==

function ConvertMunzeeEasily()
{
    var possibleTypes = document.querySelectorAll('.pin-grid');

    var newName = "";

    for (var p=0; p<possibleTypes.length; p++)
    {
        newName = possibleTypes[p].children[0].getAttribute("aria-label");
        newName = newName.replace('virtual ','').replace(' garden hedge','').replace(' garden flamingo','').replace(' gnome','');

        possibleTypes[p].children[1].innerText = newName;
        possibleTypes[p].children[1].style.fontSize = 'small';
    }
}

var DOMLoaded = false;
var doc = "";
var equalCounter = 0;

async function delayedLoop() {
    while (!DOMLoaded)
    {
        if (doc == document)
        {
            equalCounter++;
        }
        else
        {
            doc = document;
            equalCounter = 0;
        }

        if (equalCounter == 10)
        {
            DOMLoaded = true;
        }

        await new Promise(resolve => setTimeout(resolve, 333));
    }

    ConvertMunzeeEasily();
}

delayedLoop();