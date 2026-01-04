// ==UserScript==
// @name         OneJav to MissAv Jumper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      MIT
// @description  Add a green button to the left of each title with the formatted video ID
// @author       Your Name
// @match        *://onejav.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529327/OneJav%20to%20MissAv%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/529327/OneJav%20to%20MissAv%20Jumper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format the video ID (仿照 wip.js 的 Common.getAvCode)
    function getAvCode(avid) {
        if (!avid || typeof avid !== 'string') return 'Unknown';
        if (avid.match(/-[^0]/g)) return avid;
        if (avid.match(/^[0-9-_]+$/g)) return avid;
        if (avid.match(/^(crazyasia|sm|video_|BrazzersExxtra)+/gi)) return avid;
        if (avid.match(/^fc2-ppv-\d+$/i)) return avid.toLowerCase(); // 保留 fc2-ppv- 格式並轉小寫
        if (avid.match(/^FC2PPV\d+$/i)) { // 處理 FC2PPV 格式
            let numMatch = avid.match(/\d+$/);
            let num = numMatch ? numMatch[0] : '000';
            return "FC2-PPV-" + num;
        }
        avid = avid.replace(/\b(FC2+)/gi, "");
        // 提取最後的字母序列，避免數字開頭的情況
        let letterMatch = avid.match(/[a-zA-Z]+(?=\d+$)/);
        let letter = letterMatch ? letterMatch[0] : 'ID';
        let numMatch = avid.match(/\d+$/);
        let num = numMatch ? numMatch[0] : '000';
        if (num.length > 3) {
            num = num.replace(/^0+/, ""); // 移除開頭的 0
            if (num.length < 3) {
                num = ("000" + num).slice(-3); // 補零至三位
            }
        }
        return letter + "-" + num;
    }

    // Function to create and insert a button next to each title
    function addButtons() {
        const titles = document.querySelectorAll('.title.is-4.is-spaced');
        if (titles.length === 0) {
            return;
        }

        titles.forEach(title => {
            let avid = title.querySelector('a').textContent ? title.querySelector('a').textContent.replace(/[ ]/g, "").replace(/[\r\n]/g, "") : 'Unknown';
            if (!(/(-)/g).test(avid)) {
                avid = getAvCode(avid);
            }

            // Create a container for both buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.alignItems = 'center';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginBottom = '10px'; // Add space below the buttons

            const button = document.createElement('button');
            button.innerText = avid;
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '8px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '24px';
            button.onclick = () => window.open(`https://missav.ws/${avid}`, '_blank');
            buttonContainer.appendChild(button);

            const javdbButton = document.createElement('button');
            javdbButton.innerText = avid;
            javdbButton.style.backgroundColor = 'blue';
            javdbButton.style.color = 'white';
            javdbButton.style.border = 'none';
            javdbButton.style.borderRadius = '8px';
            javdbButton.style.cursor = 'pointer';
            javdbButton.style.fontSize = '24px';
            javdbButton.onclick = () => window.open(`https://javdb.com/search?q=${avid}`, '_blank');
            buttonContainer.appendChild(javdbButton);

            // Insert the button container before the title
            title.parentNode.insertBefore(buttonContainer, title);
        });
    }

    window.addEventListener('load', addButtons);
})();