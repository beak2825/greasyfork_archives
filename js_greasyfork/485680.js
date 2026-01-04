// ==UserScript==
// @name         [Neopets] Codestone Linker Revamped
// @namespace    https://greasyfork.org/en/scripts/485680
// @version      2.01
// @description  Simple script that adds a link to the SDB, and SW/SSW to the codestone and dubloon training list.
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/island/training.phtml?type=status
// @match        http*://www.neopets.com/pirates/academy.phtml?type=status
// @match        http*://www.neopets.com/island/fight_training.phtml?type=status
// @icon         https://www.google.com/s2/favicons?domain=neopets.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485680/%5BNeopets%5D%20Codestone%20Linker%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/485680/%5BNeopets%5D%20Codestone%20Linker%20Revamped.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wizardLink = (it) => {
        window.open(`https://www.neopets.com/shops/wizard.phtml?string=${it.replaceAll(" ","+")}`, '_blank');
    }

    let sswBtn = (it) => {
        document.querySelector('#sswmenu .bar-button-selected').click();
        document.querySelector('#sswmenu #searchstr').value = it;
    }

    window.addEventListener('load', () => {
        let cat = window.location.href.includes('island') ? 2 : 3;
                document.querySelectorAll('.content td p').forEach((s) => { //content td p
            let p = s.previousElementSibling.parentNode;
            if (!p.innerText.includes("Course Finished!") && !p.innerText.includes("Time till course finishes : ")) {
                p.innerHTML = `<br><strong>Click <a href="https://www.neopets.com/safetydeposit.phtml?category=${cat}" target="_blank">HERE</a> to check your SDB.</strong><br><br>${p.innerHTML}`;
            }
        });

        //loop through the codestones
        document.querySelectorAll('#content img[src^="//images.neopets.com/items/"]').forEach((c) => {
            let prn = c.parentNode;
            let item = window.location.href.includes('training') ? c.previousElementSibling.innerText : c.parentNode.nextElementSibling.innerText;
            let csc = document.createElement('div');
            csc.style.display = 'flex';
            csc.style.gap = '0.5em';

            let itn = document.createElement('strong');
            itn.textContent = item;
            itn.style.margin = 'auto';

            let swb = document.createElement('button');
            swb.innerText = "SW";
            swb.style.width = '40px'; swb.style.height = '40px';
            swb.style.margin = 'auto';
            swb.addEventListener('click', () => {wizardLink(item)});

            csc.append(itn, swb);

            if (document.getElementById('superfooter') != null) {
                let sswb = document.createElement('button');
                sswb.innerText = "SSW";
                sswb.style.width = '40px'; sswb.style.height = '40px';
                sswb.style.margin = 'auto';
                sswb.addEventListener('click', () => {sswBtn(item)});
                csc.append(sswb);
            }

            let csi = document.createElement('img');
            csi.src = c.src;
            csi.style.width = '48px'; csi.style.height = 'auto';
            csi.style.margin = 'auto';

            // Put it all together.
            csc.append(csi);
            prn.prepend(csc);

            // Remove original codestone and surrounding linebreaks, lol. Would be better with jQuery, but this works.
            if (window.location.href.includes('training')) {
                c.previousElementSibling.remove();
                c.nextElementSibling.remove();
                c.remove();
            } else {
                c.parentNode.nextElementSibling.remove();
                c.remove();
            }

        });
    });
})();