// ==UserScript==
// @name         Factory Idle Per Second
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Shows factory idle income in seconds. Also adds a favicon to the site.
// @author       Meow
// @match        http://factoryidle.com/
// @match        http://factoryidle.com
// @match        https://factoryidle.com/
// @match        https://factoryidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402748/Factory%20Idle%20Per%20Second.user.js
// @updateURL https://update.greasyfork.org/scripts/402748/Factory%20Idle%20Per%20Second.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let main = function() {
        let ticks = 0
        let moneyIncome = 0
        let researchIncome = 0
        let researchUnlocked = document.getElementById("researchIncome") ? true : false

        setInterval(function() {
            ticks = Number((document.getElementById("ticks") || {}).innerHTML) || 0
            moneyIncome = Number((document.getElementById("income") || {}).innerHTML) || 0
            researchUnlocked = document.getElementById("researchIncome") ? true : false
            if(researchUnlocked) researchIncome = Number(document.getElementById("researchIncome").innerHTML) || 0
        })

        let overview = document.querySelector(".overviewBox")
        let moneyRef = document.querySelector('.money.smallText').nextElementSibling.nextElementSibling

        function insertAfter(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        let moneyIncomeTitle = document.createElement('span')
        moneyIncomeTitle.className = "miniText"
        moneyIncomeTitle.innerHTML = "Income: "
        moneyIncomeTitle.style.visibility = "hidden"
        insertAfter(moneyRef, moneyIncomeTitle)

        let moneyIncomeSpan = document.createElement('span')
        moneyIncomeSpan.className = "money smallText"
        moneyIncomeSpan.innerHTML = `$<span id="money-per-second">0</span>`
        insertAfter(moneyIncomeTitle, moneyIncomeSpan)

        let moneyIncomeAfter = document.createElement('span')
        moneyIncomeAfter.className = "smallText"
        moneyIncomeAfter.innerHTML = "/second (avg)"
        insertAfter(moneyIncomeSpan, moneyIncomeAfter)

        if(researchUnlocked) {
            let researchRef = document.querySelector('.research.smallText').nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling

            let researchIncomeTitle = document.createElement('span')
            researchIncomeTitle.className = "miniText"
            researchIncomeTitle.innerHTML = "Income: "
            researchIncomeTitle.style.visibility = "hidden"
            insertAfter(researchRef, researchIncomeTitle)

            let researchIncomeSpan = document.createElement('span')
            researchIncomeSpan.className = "research smallText"
            researchIncomeSpan.innerHTML = `<span id="research-per-second">0</span>`
            insertAfter(researchIncomeTitle, researchIncomeSpan)

            let researchIncomeAfter = document.createElement('span')
            researchIncomeAfter.className = "smallText"
            researchIncomeAfter.innerHTML = "/second (avg)"
            insertAfter(researchIncomeSpan, researchIncomeAfter)

            insertAfter(researchIncomeAfter, document.createElement('br'))
        }

        setInterval(function() {
            (document.getElementById('money-per-second') || {}).innerHTML = Math.round(10 * ((moneyIncome * ticks) || 0)) / 10;
            if(researchUnlocked) (document.getElementById('research-per-second') || {}).innerHTML = Math.round(10 * ((researchIncome * ticks) || 0)) / 10;
        }, 100)
    }

    let int = setInterval(function() {
        if(document.getElementById('money-per-second')) return;
        if(!document.getElementById('makeScreenShotButton')) return;
        main()
    }, 10)

    let icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAZlBMVEUAAAAEBwgEBwcEBgc+Rlk/R1rLyrs+Rlg/Rllfco3///9fcY1fcY4FBwhgco5hco/NybvLybs9RVjKybpeco9hcY7//v7MyrxecI1fcYxgcI1dcYwFBwfKyrs9R1k/RlpecIzLyb0v7Ub4AAAAAXRSTlMAQObYZgAAAAFiS0dECmjQ9FYAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAHdElNRQfkChERHzVlGdiVAAAAAW9yTlQBz6J3mgAAAKFJREFUCNdNT1luQzEIfAYXU8+E1HGzdE1y/0sWR61UftCsiG17TBHd/o/WJ1ORP1i0+XM3cPeLq1fEvltzXUF9GYfKiJjN4zUZMRtEEH7gkdlT5mnOxfg4dy5HoFuAbhfylA5BvNHC8wqARfA9dTjBPS8lr2Q+0AjLHWU5Uv/AmHOMR+SzOmowMLp92er4rlf35rih3+f6R0RVdCcqRWX7AWXPB/+UJY2iAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTEwLTE3VDE3OjMxOjUzKzAwOjAw/PCQagAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMC0xN1QxNzozMTo1MyswMDowMI2tKNYAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAAAAElFTkSuQmCC";
    document.head.appendChild(icon);
})();