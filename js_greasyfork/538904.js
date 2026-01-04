// ==UserScript==
// @name         tp cowgam stratums
// @namespace    http://tampermonkey.net/
// @version      2025-06-09
// @description  lol I found a script in this discord server then I added more things https://discord.gg/3UGE2qHVXM
// @author       You
// @match        *://*.moomoo.io/*
// @match        *://moo.ks-bio.pl/*
// @run-at       document-start
// @icon         https://static.wikia.nocookie.net/stratumsio/images/e/e6/Site-logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538904/tp%20cowgam%20stratums.user.js
// @updateURL https://update.greasyfork.org/scripts/538904/tp%20cowgam%20stratums.meta.js
// ==/UserScript==

// ⚠️ PLEASE READ THIS BEFORE USING THIS SCRIPT ⚠️
//
// ---
//
// 🎨 Hey game artists! If you want to improve this script, let's collaborate!
// I'm looking to enhance the texture pack, so feel free to tweak it.
// ✨ If you modify links or improve something, share it with me—even if you move away from Stratum's textures.
//
// 📜 This script uses images from the Stratum.io wiki.
// 🚨 Be aware that if the wiki is ever deleted, this script will stop working!
// 🛠 Since anyone can edit the wiki, images can be removed at any time.
//
// 🔗 To preserve the images, I recommend downloading them and hosting them on a stable platform like **Imgur**.
// ❌ Avoid Discord's CDN, as links expire after a while.
//
// ---

(function() {
    const textureReplacements = [{
            test: "hat_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/ed/Marksman_Cap.png"
        }, {
            test: "hat_2.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/1/14/Dog_Hat.png"
        }, {
            test: "hat_6.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/70/Soldier_Helmet.png"
        }, {
            test: "hat_7.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/7f/Bull_Helmet.png"
        }, {
            test: "hat_9.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/6b/Miners_Helmet.png"
        }, {
            test: "hat_12.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/39/Booster_Hat.png"
        }, {
            test: "hat_15.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/b/b7/Snow_Gear.png"
        }, {
            test: "hat_20.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e6/Samurai_Armor.png"
        }, {
            test: "hat_21.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/0/0c/Plague_Mask.png"
        }, {
            test: "hat_22.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/ed/Emp_Helmet.png"
        }, {
            test: "hat_23.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/64/Anti_Venom_Gear.png"
        }, {
            test: "hat_26.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2b/Barbarian_Armor.png"
        }, {
            test: "hat_27.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e3/Nomad_Gear.png"
        }, {
            test: "hat_31.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/5d/Flipper_Hat.png"
        }, {
            test: "hat_32.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/96/Musketeer_Hat.png"
        }, {
            test: "hat_40.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/b/b1/Demolisher_Hat.png"
        }, {
            test: "hat_42.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/b/b2/BBG_Cap.png"
        }, {
            test: "hat_43.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/9b/No_Frost_Hat.png"
        }, {
            test: "hat_48.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/6c/Tiara.png"
        }, {
            test: "hat_50.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2e/Apple_Crown.png"
        }, {
            test: "hat_51.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/90/Giraffe_Cap.png"
        }, {
            test: "hat_52.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/b/b4/Thief_Gear.png"
        }, {
            test: "hat_55.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/0/07/Leech_Gear.png"
        }, {
            test: "hat_56.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e0/Assassin_Gear.png"
        }, {
            test: "hat_58.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/69/Dark_Knight.png"
        }, {
            test: "access_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/74/Super_Cape.png"
        }, {
            test: "access_11.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/c/cd/Monkey_Tail.png"
        }, {
            test: "access_13.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/6f/Angel_Wings.png"
        }, {
            test: "access_18.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/4/44/Blood_Wings.png"
        }, {
            test: "access_19.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/b/b0/Shadow_Wings.png"
        }, {
            test: "access_21.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/a1/Corrupt_X_Wings.png"
        }, {
            test: "cow_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/8/84/Cow.png"
        }, {
            test: "pig_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/30/Pig.png"
        }, {
            test: "chicken_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/0/00/Quack.png"
        }, {
            test: "crate_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/39/Treasure.png"
        }, {
            test: "bull_2.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/7a/Bull.png"
        }, {
            test: "bull_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/8/84/Bully.png"
        }, {
            test: "wolf_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/c/c8/Wolf.png"
        }, {
            test: "scorpion.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/ab/Scorpion.png"
        }, {
            test: "skeleton.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/23/Skeleton.png"
        }, {
            test: "wolf_2.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/93/Moofie.png"
        }, {
            test: "enemy.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/aa/Moostafa.png"
        }, {
            test: "dragon.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/c/c7/Dragon.png"
        }, {
            test: "/hammer_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/ae/Tool_hammer.png"
        }, {
            test: "/hammer_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/9a/Gold_Tool_hammer.png"
        }, {
            test: "/hammer_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/f/fb/Diamond_Tool_hammer.png"
        }, {
            test: "/hammer_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e9/Ruby_Tool_hammer.png"
        }, {
            test: "/axe_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/f/f0/Hand_axe.png"
        }, {
            test: "/axe_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/4/48/Gold_Hand_axe.png"
        }, {
            test: "/axe_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/3b/Diamond_Hand_axe.png"
        }, {
            test: "/axe_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/f/f4/Ruby_Hand_axe.png"
        }, {
            test: "sword_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/35/Short_sword.png"
        }, {
            test: "sword_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/0/04/Gold_Short_sword.png"
        }, {
            test: "sword_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2b/Diamond_Short_sword.png"
        }, {
            test: "sword_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/d/d3/Ruby_Short_sword.png"
        }, {
            test: "samurai_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e9/Katana.png"
        }, {
            test: "samurai_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/59/Gold_Katana.png"
        }, {
            test: "samurai_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/24/Diamond_Katana.png"
        }, {
            test: "samurai_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/a4/Ruby_Katana.png"
        }, {
            test: "spear_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/1/1b/Polearm.png"
        }, {
            test: "spear_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/1/1b/Gold_Polearm.png"
        }, {
            test: "spear_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/f/f9/Diamond_Polearm.png"
        }, {
            test: "spear_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/59/Ruby_Polearm.png"
        }, {
            test: "bat_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/ad/Bat.png"
        }, {
            test: "bat_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/ee/Gold_Bat.png"
        }, {
            test: "bat_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e0/Diamond_Bat.png"
        }, {
            test: "bat_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/92/Ruby_Bat.png"
        }, {
            test: "dagger_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/65/Daggers.png"
        }, {
            test: "dagger_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/0/03/Gold_Daggers.png"
        }, {
            test: "dagger_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/7d/Diamond_Daggers.png"
        }, {
            test: "dagger_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e8/Ruby_Daggers.png"
        }, {
            test: "stick_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/aa/Stick.png"
        }, {
            test: "stick_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/32/Gold_Stick.png"
        }, {
            test: "stick_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/3b/Diamond_Stick.png"
        }, {
            test: "stick_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/56/Ruby_Stick.png"
        }, {
            test: "great_axe_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/6e/Great_axe.png"
        }, {
            test: "great_axe_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2f/Gold_Great_axe.png"
        }, {
            test: "great_axe_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2e/Diamond_Great_axe.png"
        }, {
            test: "great_axe_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/0/02/Ruby_Great_axe.png"
        }, {
            test: "/bow_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/30/Hunting_bow.png"
        }, {
            test: "/bow_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/79/Gold_Hunting_bow.png"
        }, {
            test: "/bow_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/37/Diamond_Hunting_bow.png"
        }, {
            test: "/bow_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/f/ff/Ruby_Hunting_bow.png"
        }, {
            test: "crossbow_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/79/Crossbow.png"
        }, {
            test: "crossbow_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2b/Gold_Crossbow.png"
        }, {
            test: "crossbow_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/5c/Diamond_Crossbow.png"
        }, {
            test: "crossbow_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/50/Ruby_Crossbow.png"
        }, {
            test: "crossbow_2.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/8/8b/Repeater_crossbow.png"
        }, {
            test: "crossbow_2_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/d/d3/Gold_Repeater_crossbow.png"
        }, {
            test: "crossbow_2_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/5/5b/Diamond_Repeater_crossbow.png"
        }, {
            test: "crossbow_2_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/d/da/Ruby_Repeater_crossbow.png"
        }, {
            test: "musket_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/2b/Musket.png"
        }, {
            test: "musket_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/3/34/Gold_Musket.png"
        }, {
            test: "musket_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/62/Diamond_Musket.png"
        }, {
            test: "musket_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/af/Ruby_Musket.png"
        }, {
            test: "great_hammer_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/29/Great_hammer.png"
        }, {
            test: "great_hammer_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/6/6b/Gold_Great_hammer.png"
        }, {
            test: "great_hammer_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/2/21/Diamond_Great_hammer.png"
        }, {
            test: "great_hammer_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/7d/Ruby_Great_hammer.png"
        }, {
            test: "shield_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/d/db/Wooden_shield.png"
        }, {
            test: "shield_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/72/Gold_Wooden_shield.png"
        }, {
            test: "shield_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/9/97/Diamond_Wooden_shield.png"
        }, {
            test: "shield_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/a/a3/Ruby_Wooden_shield.png"
        }, {
            test: "grab_1.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/b/b9/Mc_grabby.png"
        }, {
            test: "grab_1_g.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/1/17/Gold_Mc_grabby.png"
        }, {
            test: "grab_1_d.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/7/72/Diamond_Mc_grabby.png"
        }, {
            test: "grab_1_r.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/d/d8/Ruby_Mc_grabby.png"
        }, {
            test: "favicon.png",
            replaceWith: "https://static.wikia.nocookie.net/stratumsio/images/e/e6/Site-logo.png/revision/latest?cb=20220815205510"
        }, {
            test: "crown.png",
            replaceWith: "https://web.archive.org/web/20230104142319/https://plankton-app-29vjq.ondigitalocean.app/img/icons/crown.png"
        }, {
            test: "skull.png",
            replaceWith: "https://web.archive.org/web/20230104142316/https://plankton-app-29vjq.ondigitalocean.app/img/icons/skull.png"
        }, {
            test: "food_icon.png",
            replaceWith: "https://web.archive.org/web/20230204023512/https://plankton-app-29vjq.ondigitalocean.app/img/resources/food_ico.png"
        }, {
            test: "gold_ico.png",
            replaceWith: "https://web.archive.org/web/20230204013633/https://plankton-app-29vjq.ondigitalocean.app/img/resources/gold_ico.png"
        }, {
            test: "wood_ico.png",
            replaceWith: "https://web.archive.org/web/20230204011505/https://plankton-app-29vjq.ondigitalocean.app/img/resources/wood_ico.png"
        }, {
            test: "other src",
            replaceWith: "other link"
        }

        // etc..
    ];
    const orig = Object.getOwnPropertyDescriptor(Image.prototype, "src");
    Object.defineProperty(Image.prototype, "src", {
        set(l) {
            for (const {
                    test,
                    replaceWith
                }
                of textureReplacements) {
                if (l.includes(test)) {
                    l = replaceWith;
                    break;
                }
            }
            orig.set.call(this, l);
        },
        get: orig.get,
        configurable: true
    });
})();