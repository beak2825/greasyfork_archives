// ==UserScript==
// @name         CSGOCLICKER - AUTO MISSIONS
// @namespace    http://Xingy.xyz/
// @version      1.1
// @description  Makes life ez on csgoclicker.net
// @author       XingyCoderXYZ
// @match        https://csgoclicker.net/missions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463848/CSGOCLICKER%20-%20AUTO%20MISSIONS.user.js
// @updateURL https://update.greasyfork.org/scripts/463848/CSGOCLICKER%20-%20AUTO%20MISSIONS.meta.js
// ==/UserScript==


(function () {

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }



    async function Main() {
        function removeMissions(missionType, numToRemove) {
            for (let i = 0; i < numToRemove; i++) {
                try {
                    document.querySelector(`.mission.${missionType}`).remove();
                } catch (error) {
                    // Error handling
                }
            }
        }

        function alwaysKeepThreeMissions() {
            const amountRecruit = document.getElementsByClassName("recruit").length;
            const amountRegular = document.getElementsByClassName("regular").length;
            const amountVeteran = document.getElementsByClassName("veteran").length;
            const amountExpert = document.getElementsByClassName("expert").length;
            const amountSpecialOps = document.getElementsByClassName("specialOps").length;

            let missionsLeft = 3;
            let recruitToRemove = 0;
            let regularToRemove = 0;
            let veteranToRemove = 0;
            let expertToRemove = 0;
            let specialOpsToRemove = 0;


            if (amountRecruit >= missionsLeft) {
                recruitToRemove = amountRecruit - missionsLeft;
                missionsLeft = 0;
            } else {
                recruitToRemove = 0;
                missionsLeft -= amountRecruit;
            }



            if (amountRegular >= missionsLeft) {
                regularToRemove = amountRegular - missionsLeft;
                missionsLeft = 0;
            } else {
                regularToRemove = 0;
                missionsLeft -= amountRegular;
            }



            if (amountVeteran >= missionsLeft) {
                veteranToRemove = amountVeteran - missionsLeft;
                missionsLeft = 0;
            } else {
                veteranToRemove = 0;
                missionsLeft -= amountVeteran;
            }



            if (amountExpert >= missionsLeft) {
                expertToRemove = amountExpert - missionsLeft;
                missionsLeft = 0;
            } else {
                expertToRemove = 0;
                missionsLeft -= amountExpert;
            }



            if (amountSpecialOps >= missionsLeft) {
                specialOpsToRemove = amountSpecialOps - missionsLeft;
            } else {
                specialOpsToRemove = 0;
            }


            removeMissions("recruit", recruitToRemove);
            removeMissions("regular", regularToRemove);
            removeMissions("veteran", veteranToRemove);
            removeMissions("expert", expertToRemove);
            removeMissions("specialOps", specialOpsToRemove);
        }

        alwaysKeepThreeMissions();


        const startReedemMission = async () => {
            const redeemButtons = document.querySelectorAll('.btn:not(.locked)');
            const startElements = document.getElementsByClassName("startOverlay");
            for (let i = redeemButtons.length - 1; i >= 0; i--) {
                redeemButtons[i].click();
                await delay(1000);
            }
            for (let i = startElements.length - 1; i >= 0; i--) {
                startElements[i].click();
                await delay(1000);
            }
            if (redeemButtons.length === 0 && startElements.length === 0) {
                await delay(1000);
            }
            startReedemMission();
        };

        startReedemMission();
    }

    setTimeout(async function () {
        Main();
        console.log("Mission Script Loaded");
    }, 5000);



    setTimeout(function () {
        location.reload();
    }, 300000);

})();