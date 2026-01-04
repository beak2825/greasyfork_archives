// ==UserScript==
// @name         IdlePixel Lag Free Raids
// @namespace    http://tampermonkey.net/
// @version      1.3.37
// @description  Preloads raid images to prevent lag
// @author       Pizza1337
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @require      https://update.greasyfork.org/scripts/441206/1112539/IdlePixel%2B.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525760/IdlePixel%20Lag%20Free%20Raids.user.js
// @updateURL https://update.greasyfork.org/scripts/525760/IdlePixel%20Lag%20Free%20Raids.meta.js
// ==/UserScript==

const imagesToPreload = [
    'projectile_1.png', 'projectile_2.png', 'projectile_3_normal.png', 'projectile_4_heal.png', 'projectile_4_strong.png',
    'projectile_heal.png', 'projectile_skull.png', 'undead_blood_pool.png', 'undead_defence_staff.png', 'undead_final_leader.png',
    'undead_fire_icon.png', 'undead_leader.png', 'undead_leader_2.png', 'undead_leader_full_death.png', 'undead_leader_full_death_1.png',
    'undead_leader_full_death_2.png', 'undead_leader_full_death_3.png', 'undead_leader_full_death_4.png', 'undead_leader_full_heal.png',
    'undead_leader_full_heal_1.png', 'undead_leader_full_heal_2.png', 'undead_leader_full_heal_3.png', 'undead_leader_full_heal_4.png',
    'undead_leader_heal.png', 'undead_leader_normal.png', 'undead_mana_staff.png', 'undead_roaming_ghost_monster_attack_0.png',
    'undead_roaming_ghost_monster_idle_0.png', 'undead_skeleton_monster_idle_0.png', 'undead_skeleton_zombie.png', 'undead_spike_skeleton.png',
    'undead_spike_skeleton_monster_attack_0.png', 'undead_spike_skeleton_monster_idle_0.png', 'undead_spike_skeleton_monster_idle_1.png',
    'undead_spiked_skeleton_monster_attack_0.png', 'undead_spiked_skeleton_monster_idle_0.png', 'undead_spiked_skeleton_monster_idle_1.png',
    'undead_staff.png', 'undead_staff_spirit.png', 'undead_yeti_monster_idle_0.png', 'undead_yeti_monster_idle_1.png', 'undead_zombie.png',
    'undead_zombie_flying_monster_idle_0.png', 'undead_zombie_flying_monster_idle_1.png', 'undead_zombie_monster_idle_0.png',
    'undead_zombie_monster_idle_1.png', 'red_ice_cube.png', 'ice_cube.png', 'roaming_ghost.png',
    'toy_cute_monster_idle_0.png', 'toy_cute_monster_idle_1.png', 'toy_dwarf_monster_idle_0.png', 'toy_dwarf_monster_idle_1.png',
    'toy_slingshot.png', 'toy_slinky_monster_idle_0.png', 'toy_slinky_monster_idle_1.png', 'toy_teddy_monster_happy_0.png',
    'toy_teddy_monster_idle_0.png', 'toy_teddy_monster_mad_0.png', 'toy_ball.png', 'raids_2_button.png',
    'raids_2_fighting_background.png', 'gold_bar.png', 'gold.png', 'reaper_eyes.png', 'raids_1_fighting_background_3.png',
    'obelisk_side.png', 'obelisk.png'
];

class LagFreeRaids extends IdlePixelPlusPlugin {
    constructor() {
        super("Lag Free Raids", {
            about: {
                name: GM_info.script.name,
                version: GM_info.script.version,
                author: GM_info.script.author,
                description: GM_info.script.description
            }
        });
    }

    onGameReady() {
        //console.log("Game is ready! Preloading images...");
        this.preloadImages();
    }

    preloadImages() {
        const baseUrls = [
            'https://d1xsc8x7nc5q8t.cloudfront.net/images/',
            'https://cdn.idle-pixel.com/images/'
        ];

        imagesToPreload.forEach(image => {
            baseUrls.forEach(baseUrl => {
                const img = new Image();
                img.src = baseUrl + image;

                img.onload = () => {
                    localStorage.setItem(image, 'cached');
                    updatePreloadButton();
                };

                img.onerror = () => {
                    //console.error(`Failed to load image: ${image} from ${baseUrl}`);
                };
            });
        });

        setTimeout(updatePreloadButton, 2000);
    }
}

// Register the plugin
IdlePixelPlus.registerPlugin(new LagFreeRaids());

// Ensure the preload happens immediately on page load
window.onload = function() {
    //console.log("Page loaded! Preloading images...");
    const plugin = new LagFreeRaids();
    plugin.preloadImages();
};

// Function to check if all images are cached
function allImagesCached() {
    return imagesToPreload.every(img => localStorage.getItem(img) === 'cached');
}

// Function to update the button state
function updatePreloadButton() {
    const button = document.getElementById("preload-raids-btn");
    if (!button) return;

    if (allImagesCached()) {
        button.innerHTML = `
            <div class="center mt-1">
                <img src="https://cdn.idle-pixel.com/images/check.png" width="32">
            </div>
            <div class="center mt-2 color-white">Raid Images Preloaded</div>
        `;
    } else {
        button.innerHTML = `
            <div class="center mt-1">
                <img src="https://cdn.idle-pixel.com/images/download_white.png" width="32">
            </div>
            <div class="center mt-2 color-white">Preload Raid Images</div>
        `;
    }
}

// Function to add the preload button inside the correct section
function addPreloadButton() {
    const parentContainer = document.getElementById("game-panels-combat-raids");
    if (!parentContainer) {
        //console.log("Waiting for #game-panels-combat-raids to load...");
        return;
    }

    // Find the specific .itembox-rings inside this section
    const referenceElement = parentContainer.querySelector('.itembox-rings');
    if (!referenceElement) {
        //console.log("Waiting for .itembox-rings inside #game-panels-combat-raids...");
        return;
    }

    // Create the new button
    const newButton = document.createElement('div');
    newButton.className = "itembox-rings hover";
    newButton.id = "preload-raids-btn";
    newButton.style.marginLeft = "10px";
    newButton.onclick = () => {
        const plugin = new LagFreeRaids();
        plugin.preloadImages();
    };

    // Insert the button next to the found .itembox-rings
    referenceElement.parentNode.insertBefore(newButton, referenceElement.nextSibling);

    updatePreloadButton(); // Ensure the correct state when it's added
}

// **Wait for elements to appear instead of using a fixed delay**
const observer = new MutationObserver(() => {
    if (document.getElementById("game-panels-combat-raids")?.querySelector(".itembox-rings")) {
        //console.log("Adding preload button...");
        addPreloadButton();
        observer.disconnect(); // Stop observing once the button is added
    }
});

// Start observing for changes
observer.observe(document.body, { childList: true, subtree: true });

// **Auto-check every 5 seconds if images get uncached**
setInterval(() => {
    updatePreloadButton();
}, 5000);