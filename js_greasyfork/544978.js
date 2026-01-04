// ==UserScript==
// @name         Neopets - Karla's TVW Auto Volunteer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      1.0.0
// @description  Automatically sends your pets to volunteer
// @author       Karla
// @match        *://*.neopets.com/hospital/volunteer*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/544978/Neopets%20-%20Karla%27s%20TVW%20Auto%20Volunteer.user.js
// @updateURL https://update.greasyfork.org/scripts/544978/Neopets%20-%20Karla%27s%20TVW%20Auto%20Volunteer.meta.js
// ==/UserScript==

const sleep = (time) =>
new Promise((resolve) => setTimeout(resolve, time));

const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

function parseTimeToMs(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
}

function parseMsToTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes}:${seconds}`;
}

async function getPets(fightId) {
    const formData = new FormData();
    formData.append("_ref_ck", getCK());
    formData.append("fight_id", fightId);

    return fetch("/np-templates/ajax/plots/hospital/get-pets.php", {
        method: "POST",
        headers: {"x-requested-with": "XMLHttpRequest"},
        body: formData,
    }).then((res) => res.json());
}



async function loop(battlePet) {
    while (document.querySelector('[onclick="completeShift(this)"]')) {
        await sleep(random_in_range(1000, 1500));
        document.querySelector('[onclick="completeShift(this)"]').click();
        await sleep(random_in_range(1000, 1500));
        while (document.querySelector('#VolunteerFinishPopup').style.display !== 'block') {
            await sleep(500);
        }
        console.log("Finishing volunteer");
        document.querySelector('#VolunteerFinishPopup .popup-exit').click();
        await sleep(random_in_range(500, 1000));
    }

    console.log("Choosing fight");
    await sleep(random_in_range(1000, 1500));
    const volunteerButtons = Array.from(document.querySelectorAll('[onclick^="selectFight"]'));
    while (volunteerButtons.length > 0) {
        const volunteerButton = volunteerButtons.pop();
        const fightId = volunteerButton.getAttribute('onclick').replace('selectFight(', '').replace(')', '');
        console.log("fight", fightId);
        const { pets } = await getPets(fightId);
        const pet = pets.find((p) => !p.disabled && p.name !== battlePet);
        if (!pet) {
            console.log("No available pets");
            break;
        } else {
            console.log(pet.name)
            const joinVolunteerButton = document.createElement('div');
            joinVolunteerButton.innerHTML = `<button tabindex="0" id="VolunteerJoinButton" class="button-default__2020 button-yellow__2020 btn-single__2020 plot-button" data-fight="${fightId}" data-pet="${pet.name}" onclick="startShift(this)">Join Volunteer Team</button>`;
            joinVolunteerButton.style.display = 'none';
            document.querySelector('body').append(joinVolunteerButton);
            joinVolunteerButton.querySelector('button').click();
        }

        await sleep(random_in_range(1000, 1500));
        if (!document.querySelector('.vc-fight .vc-tooltip-icon.premium-icon')) {
            // no premium, page will reload
            return;
        }
        if (document.querySelector('#VolunteerJoinedPopup').style.display === 'block') {
            document.querySelector('#VolunteerJoinedPopup .popup-exit').click();
            await sleep(random_in_range(1000, 1500));
        }
    }

    console.log("All fights used");

    const statusEls = document.querySelectorAll('.vc-fight-timer');
    let maxTime = 0;
    for (let i = 0; i < statusEls.length; i += 1) {
        if (statusEls[i].querySelector('.vc-status').textContent === 'Time Remaining: ') {
            const time = statusEls[i].querySelector('.vc-fight-time').textContent.split('\t')[0];
            maxTime = Math.max(parseTimeToMs(time), maxTime);
        }
    }
    setInterval(function() {
        document.querySelector('#auto_volunteer').innerHTML = `Waiting: ${parseMsToTime(maxTime)}`;
        maxTime -= 1000;
        if (maxTime <= 0) {
            window.location.reload();
        }
    }, 1000);
}

(async function() {
    'use strict';

    // Your code here...
    const autoplay = GM_getValue("auto_volunteer");
    let battlePet = GM_getValue("battle_pet") || '';
    try {
        if (document.querySelector('#VolunteerFightInfo')) {
            document.querySelector('#VolunteerJoinButton').id = '#VolunteerJoinButtonOld';
            while (document.querySelector('.vc-act.minimize .vc-pane-btn')) {
                document.querySelector('.vc-act.minimize .vc-pane-btn').click();
                await sleep(random_in_range(100, 150));
            }
            const button = document.createElement('button');
            button.id = 'auto_volunteer';
            button.innerHTML = autoplay ? 'Sending Pets' : 'Send All Pets';
            button.className = 'button-default__2020 button-yellow__2020 btn-single__2020 plot-button vc-button';
            const ignoreEl = document.createElement('div');
            ignoreEl.style.textAlign = 'center';
            ignoreEl.innerHTML = '<label>Battle Pet Name: <input id="k-ignore" /></label>';
            document.querySelector('#VolunteerFightInfo').prepend(ignoreEl);
            document.querySelector('#VolunteerFightInfo').prepend(button);
            document.querySelector('#k-ignore').addEventListener('change', function(evt) {
                battlePet = evt.target.value;
                GM_setValue("battle_pet", battlePet);
            });
            if (battlePet) {
                document.querySelector('#k-ignore').value = battlePet;
            }

            button.addEventListener('click', function() {
                if (autoplay) {
                    button.innerHTML = 'Send All Pets';
                    GM_setValue("auto_volunteer", false);
                    window.location.reload();
                } else {
                    button.innerHTML = 'Sending Pets';
                    GM_setValue("auto_volunteer", true);
                    loop(battlePet);
                }
            });
            if (autoplay) {
                loop(battlePet);
            }
        }
    } catch (e) {
        console.log(e);
    }
})();
