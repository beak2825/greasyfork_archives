// ==UserScript==
// @name         SimpleMMO Collect, Store and Sell Button        
// @namespace    SimpleMMO Quality of Life Addon
// @version      2.0.0
// @copyright    none
// @license      MIT
// @description  SimpleAddon for SimpleMMO, Takes the Collect, Store and Sell Button Out of Dropdown
// @author       Cheshire
// @match        https://web.simple-mmo.com/*
// @match        http://web.simple-mmo.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438071/SimpleMMO%20Collect%2C%20Store%20and%20Sell%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/438071/SimpleMMO%20Collect%2C%20Store%20and%20Sell%20Button.meta.js
// ==/UserScript==

var pointer = {
    'invetoryList' : 'body > div.h-screen > div.flex > main > div.web-app-container > div > div:nth-child(2) > div > div > table > tbody'
};

(function loop() {
    addCollect()
})();

function addCollect() {
    try {
        var invList = document.querySelector(pointer.invetoryList)
        for (var i=0 ; i<invList.children.length; i++) {

            var buttonTemplate = invList.children[i].querySelector('tr > td > div > div:nth-child(2) > div:nth-child(5) > span > a > button')

            var overf = document.querySelector('body > div.h-screen > div.flex > main > div.web-app-container > div > div:nth-child(2) > div > div').className
            overf = overf.substring(0, overf.lastIndexOf(" "))
            if(document.body.clientWidth>=1280){
                document.querySelector('body > div.h-screen > div.flex > main > div.web-app-container > div > div:nth-child(2) > div > div').className = overf
            }

            if(buttonTemplate != null){
            var buttonClone = buttonTemplate.cloneNode(true)
            var buttonClone2 = buttonTemplate.cloneNode(true)
            var buttonClone3 = buttonTemplate.cloneNode(true)

            var sellPrice = invList.children[i].querySelector('tr > td  > div > div:nth-child(2) > div:nth-child(3)')

            var ahrefTemplate = invList.children[i].querySelector('tr > td > div > div:nth-child(2) > div:nth-child(5) > span > span > div > div > a:nth-child(7)')
            var ahrefClone

            var ahrefTemplate2 = invList.children[i].querySelector('tr > td > div > div:nth-child(2) > div:nth-child(5) > span > span > div > div > a:nth-child(6)')
            var ahrefClone2

            var ahrefTemplate3 = invList.children[i].querySelector('tr > td > div > div:nth-child(2) > div:nth-child(5) > span > span > div > div > a:nth-child(3)')
            var ahrefClone3

            var destination = invList.children[i].querySelector('tr > td > div > div:nth-child(2) > div:nth-child(5) > span')
            var destination2 = invList.children[i].querySelector('tr > td:nth-child(6) > span')

            buttonClone3.innerHTML = sellPrice.innerText + ' G'
            var newClass = buttonClone3.className.replace('rounded-l-md', 'rounded-md')
            buttonClone3.setAttribute('class', newClass)

                if(ahrefTemplate3 != null){
                    ahrefClone3 = ahrefTemplate3.cloneNode(true)
                    ahrefClone3.setAttribute('class', ' ')
                    ahrefClone3.innerHTML = ''
                    ahrefClone3.appendChild(buttonClone3)
                }

            if(document.body.clientWidth<1280){
                destination.insertBefore(ahrefClone3, destination.firstChild);
            }
            if(document.body.clientWidth>=1280){
                destination2.insertBefore(ahrefClone3, destination2.firstChild);
            }

                buttonClone.innerHTML = 'Collect'
                buttonClone.setAttribute('class', newClass)
                buttonClone2.innerHTML = 'Store'
                buttonClone2.setAttribute('class', newClass)

                 if(ahrefTemplate != null){
                     ahrefClone = ahrefTemplate.cloneNode(true)
                     ahrefClone2 = ahrefTemplate2.cloneNode(true)

                     ahrefClone.setAttribute('class', ' ')
                     ahrefClone.innerHTML = ''
                     ahrefClone2.setAttribute('class', ' ')
                     ahrefClone2.innerHTML = ''

                     ahrefClone.appendChild(buttonClone)
                     ahrefClone2.appendChild(buttonClone2)

                     if(document.body.clientWidth<1280){
                         destination.insertBefore(ahrefClone2, destination.firstChild);
                     }
                     if(document.body.clientWidth>=1280){
                         destination2.insertBefore(ahrefClone2, destination2.firstChild);
                     }


                     var x = invList.children[i].querySelector('tr > td > div > div:nth-child(2) > div:nth-child(2)').innerText
                     if(getLastWord(x)=='Weapon' ||
                        getLastWord(x)=='Armour' ||
                        getLastWord(x)=='Amulet' ||
                        getLastWord(x)=='Boots' ||
                        getLastWord(x)=='Helmet' ||
                        getLastWord(x)=='Shield' ||
                        getLastWord(x)=='Greaves' ||
                        getLastWord(x)=='Pet' ||
                        getLastWord(x)=='Special'){
                         if(document.body.clientWidth<1280){
                             destination.insertBefore(ahrefClone, destination.firstChild);
                         }
                         if(document.body.clientWidth>=1280){
                             destination2.insertBefore(ahrefClone, destination2.firstChild);
                         }
                     }
                 }
            }
        }
    } catch(err) {
        console.log(err)
    }

}

function getLastWord(words) {
			var n = words.split(" ");
			return n[n.length - 1];
		}

