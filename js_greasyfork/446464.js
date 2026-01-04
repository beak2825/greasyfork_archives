// ==UserScript==
// @name         Amuzeshyar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Amuzeshyar Arzeshyabi Ostad!
// @author       You
// @match        http://stdn.iau.ac.ir/Student/studentProffEvaluation*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.ir
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446464/Amuzeshyar.user.js
// @updateURL https://update.greasyfork.org/scripts/446464/Amuzeshyar.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function f() {
        let table = document.querySelectorAll('#requestForm > div > table > tbody > tr')

        table.forEach(element => {
            try {
                element.children[8].children[0].click()
            } catch (e) {
                console.log(e)
            }
        })

        document.querySelector('#requestForm > span:nth-child(7) > input').click()
    }


    function createButton() {
        let button = document.createElement('button')
        button.innerText = 'Bibidi Babidi Boo'
        button.onclick = f
        return button
    }


    function main() {
        let a = document.querySelector('#requestForm > div > b')
        a.append(createButton())
    }

    main()
})();
