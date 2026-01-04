// ==UserScript==
// @name         HenterVerse Clutter One-Click Seller
// @namespace    hvcluttersell
// @version      0.1.7
// @description  Sell all the clutter in The Market with one single click!
// @author       Retr#000
// @match        https://*hentaiverse.org/*?s=Bazaar&ss=mk*
// @icon         data:image/png;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @license      CC BY-NC 3.0
// @downloadURL https://update.greasyfork.org/scripts/461967/HenterVerse%20Clutter%20One-Click%20Seller.user.js
// @updateURL https://update.greasyfork.org/scripts/461967/HenterVerse%20Clutter%20One-Click%20Seller.meta.js
// ==/UserScript==

(function () {
    'use strict';

    ///////// Config /////////

    const HVCConfig_default = {
        "Settings": {
            HVCdelay: 500,
        },
        "Item List": [
            { name: 'ManBearPig Tail', sell_as_clutter: true, min_undercut: false, id: 30016, type: 'Trophy', desc: 'No longer will MBP spread havoc, destruction, and melted polar ice caps. [Tier 2]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Holy Hand Grenade of Antioch', sell_as_clutter: true, min_undercut: false, id: 30017, type: 'Trophy', desc: 'You found this item in the lair of a White Bunneh. It appears to be a dud. [Tier 2]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Mithra\'s Flower', sell_as_clutter: true, min_undercut: false, id: 30018, type: 'Trophy', desc: 'A Lilac flower given to you by a Mithra when you defeated her. Apparently, this type was her favorite. [Tier 2]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Dalek Voicebox', sell_as_clutter: true, min_undercut: false, id: 30019, type: 'Trophy', desc: 'Taken from the destroyed remains of a Dalek shell. [Tier 2]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Lock of Blue Hair', sell_as_clutter: true, min_undercut: false, id: 30020, type: 'Trophy', desc: 'Given to you by Konata when you defeated her. It smells of Timotei. [Tier 2]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Bunny-Girl Costume', sell_as_clutter: true, min_undercut: false, id: 30021, type: 'Trophy', desc: 'Given to you by Mikuru when you defeated her. If you wear it, keep it to yourself. [Tier 3]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Hinamatsuri Doll', sell_as_clutter: true, min_undercut: false, id: 30022, type: 'Trophy', desc: 'Given to you by Ryouko when you defeated her. You decided to name it Achakura, for no particular reason. [Tier 3]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Broken Glasses', sell_as_clutter: true, min_undercut: false, id: 30023, type: 'Trophy', desc: 'Given to you by Yuki when you defeated her. She looked better without them anyway. [Tier 3]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Black T-Shirt', sell_as_clutter: true, min_undercut: false, id: 30024, type: 'Trophy', desc: 'A plain black 100% cotton T-Shirt. On the front, an inscription in white letters reads\: \"I defeated Real Life, and all I got was this lousy T-Shirt\" [Tier 4]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Sapling', sell_as_clutter: true, min_undercut: false, id: 30030, type: 'Trophy', desc: 'A sapling from Yggdrasil, the World Tree. [Tier 4]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Unicorn Horn', sell_as_clutter: true, min_undercut: false, id: 30031, type: 'Trophy', desc: 'An Invisible Pink Unicorn Horn taken from the Invisible Pink Unicorn. It doesn\'t weigh anything and has the consistency of air, but you\'re quite sure it\'s real. [Tier 5]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Noodly Appendage', sell_as_clutter: true, min_undercut: false, id: 30032, type: 'Trophy', desc: 'A nutritious pasta-based appendage from the Flying Spaghetti Monster. [Tier 6]', isekai: { sell_as_clutter: true, min_undercut: false } },
            { name: 'Precursor Artifact', sell_as_clutter: false, min_undercut: false, id: 20001, type: 'Artifact', desc: 'An advanced technological artifact from an ancient and long-lost civilization. Handing these in at the Shrine of Snowflake will grant you a reward.' },
            { name: 'Energy Drink', sell_as_clutter: false, min_undercut: false, id: 11401, type: 'Consumable', desc: 'Restores 10 points of Stamina, up to the maximum of 99. When used in battle, also boosts Overcharge and Spirit by 10% for ten turns.' },
            { name: 'Low-Grade Cloth', sell_as_clutter: false, min_undercut: false, id: 60001, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade cloth armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Mid-Grade Cloth', sell_as_clutter: false, min_undercut: false, id: 60002, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade cloth armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'High-Grade Cloth', sell_as_clutter: false, min_undercut: false, id: 60003, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade cloth armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Low-Grade Leather', sell_as_clutter: false, min_undercut: false, id: 60004, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade light armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Mid-Grade Leather', sell_as_clutter: false, min_undercut: false, id: 60005, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade light armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'High-Grade Leather', sell_as_clutter: false, min_undercut: false, id: 60006, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade light armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Low-Grade Metals', sell_as_clutter: false, min_undercut: false, id: 60007, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade heavy armor and weapons.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Mid-Grade Metals', sell_as_clutter: false, min_undercut: false, id: 60008, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade heavy armor and weapons.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'High-Grade Metals', sell_as_clutter: false, min_undercut: false, id: 60009, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade heavy armor and weapons.' },
            { name: 'Low-Grade Wood', sell_as_clutter: false, min_undercut: false, id: 60010, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade staffs and shields.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Mid-Grade Wood', sell_as_clutter: false, min_undercut: false, id: 60011, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade staffs and shields.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'High-Grade Wood', sell_as_clutter: false, min_undercut: false, id: 60012, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge and upgrade staffs and shields.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scrap Cloth', sell_as_clutter: false, min_undercut: false, id: 60051, type: 'Material', desc: 'Various bits and pieces of scrap cloth. These can be used to mend the condition of an equipment piece.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scrap Leather', sell_as_clutter: false, min_undercut: false, id: 60052, type: 'Material', desc: 'Various bits and pieces of scrap leather. These can be used to mend the condition of an equipment piece.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scrap Metal', sell_as_clutter: false, min_undercut: false, id: 60053, type: 'Material', desc: 'Various bits and pieces of scrap metal. These can be used to mend the condition of an equipment piece.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scrap Wood', sell_as_clutter: false, min_undercut: false, id: 60054, type: 'Material', desc: 'Various bits and pieces of scrap wood. These can be used to mend the condition of an equipment piece.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Energy Cell', sell_as_clutter: false, min_undercut: false, id: 60071, type: 'Material', desc: 'A cylindrical object filled to the brim with arcano-technological energy.<br>Required to restore advanced armor and shields to full condition.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Crystallized Phazon', sell_as_clutter: false, min_undercut: false, id: 60101, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Phase Armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Shade Fragment', sell_as_clutter: false, min_undercut: false, id: 60102, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Shade Armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Repurposed Actuator', sell_as_clutter: false, min_undercut: false, id: 60104, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Power Armor.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Defense Matrix Modulator', sell_as_clutter: false, min_undercut: false, id: 60105, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to reforge Force Shields.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Binding of Slaughter', sell_as_clutter: false, min_undercut: false, id: 60201, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Base Damage.' },
            { name: 'Binding of Balance', sell_as_clutter: false, min_undercut: false, id: 60202, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Hit Chance.' },
            { name: 'Binding of Destruction', sell_as_clutter: false, min_undercut: false, id: 60203, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Base Damage.' },
            { name: 'Binding of Focus', sell_as_clutter: false, min_undercut: false, id: 60204, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Hit Chance.' },
            { name: 'Binding of Protection', sell_as_clutter: false, min_undercut: false, id: 60205, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Defense.' },
            { name: 'Binding of the Fleet', sell_as_clutter: false, min_undercut: false, id: 60206, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Evade Chance.' },
            { name: 'Binding of the Barrier', sell_as_clutter: false, min_undercut: false, id: 60207, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Block Chance.' },
            { name: 'Binding of the Nimble', sell_as_clutter: false, min_undercut: false, id: 60208, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Parry Chance.' },
            { name: 'Binding of the Elementalist', sell_as_clutter: false, min_undercut: false, id: 60209, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Elemental Magic Proficiency.' },
            { name: 'Binding of the Heaven-sent', sell_as_clutter: false, min_undercut: false, id: 60210, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Divine Magic Proficiency.' },
            { name: 'Binding of the Demon-fiend', sell_as_clutter: false, min_undercut: false, id: 60211, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Forbidden Magic Proficiency.' },
            { name: 'Binding of the Curse-weaver', sell_as_clutter: false, min_undercut: false, id: 60212, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Depreciating Magic Proficiency.' },
            { name: 'Binding of the Earth-walker', sell_as_clutter: false, min_undercut: false, id: 60213, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Supportive Magic Proficiency.' },
            { name: 'Binding of Surtr', sell_as_clutter: false, min_undercut: false, id: 60215, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Fire Spell Damage.' },
            { name: 'Binding of Niflheim', sell_as_clutter: false, min_undercut: false, id: 60216, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Cold Spell Damage.' },
            { name: 'Binding of Mjolnir', sell_as_clutter: false, min_undercut: false, id: 60217, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Elec Spell Damage.' },
            { name: 'Binding of Freyr', sell_as_clutter: false, min_undercut: false, id: 60218, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Wind Spell Damage.' },
            { name: 'Binding of Heimdall', sell_as_clutter: false, min_undercut: false, id: 60219, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Holy Spell Damage.' },
            { name: 'Binding of Fenrir', sell_as_clutter: false, min_undercut: false, id: 60220, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Dark Spell Damage.' },
            { name: 'Binding of Dampening', sell_as_clutter: false, min_undercut: false, id: 60221, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Crushing Mitigation.' },
            { name: 'Binding of Stoneskin', sell_as_clutter: false, min_undercut: false, id: 60222, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Slashing Mitigation.' },
            { name: 'Binding of Deflection', sell_as_clutter: false, min_undercut: false, id: 60223, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Piercing Mitigation.' },
            { name: 'Binding of the Fire-eater', sell_as_clutter: false, min_undercut: false, id: 60224, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Fire Mitigation.' },
            { name: 'Binding of the Frost-born', sell_as_clutter: false, min_undercut: false, id: 60225, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Cold Mitigation.' },
            { name: 'Binding of the Thunder-child', sell_as_clutter: false, min_undercut: false, id: 60226, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Elec Mitigation.' },
            { name: 'Binding of the Wind-waker', sell_as_clutter: false, min_undercut: false, id: 60227, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Wind Mitigation.' },
            { name: 'Binding of the Thrice-blessed', sell_as_clutter: false, min_undercut: false, id: 60228, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Holy Mitigation.' },
            { name: 'Binding of the Spirit-ward', sell_as_clutter: false, min_undercut: false, id: 60229, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Dark Mitigation.' },
            { name: 'Binding of the Ox', sell_as_clutter: false, min_undercut: false, id: 60230, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Strength.' },
            { name: 'Binding of the Raccoon', sell_as_clutter: false, min_undercut: false, id: 60231, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Dexterity.' },
            { name: 'Binding of the Cheetah', sell_as_clutter: false, min_undercut: false, id: 60232, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Agility.' },
            { name: 'Binding of the Turtle', sell_as_clutter: false, min_undercut: false, id: 60233, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Endurance.' },
            { name: 'Binding of the Fox', sell_as_clutter: false, min_undercut: false, id: 60234, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Intelligence.' },
            { name: 'Binding of the Owl', sell_as_clutter: false, min_undercut: false, id: 60235, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Wisdom.' },
            { name: 'Binding of Warding', sell_as_clutter: false, min_undercut: false, id: 60236, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Mitigation.' },
            { name: 'Binding of Negation', sell_as_clutter: false, min_undercut: false, id: 60237, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Resist Chance.' },
            { name: 'Binding of Isaac', sell_as_clutter: false, min_undercut: false, id: 60238, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Physical Crit Chance.' },
            { name: 'Binding of Friendship', sell_as_clutter: false, min_undercut: false, id: 60239, type: 'Material', desc: 'Some materials scavenged from fallen adventurers by a monster.<br>Required to upgrade equipment bonuses to Magical Crit Chance.' },
            { name: 'Legendary Weapon Core', sell_as_clutter: false, min_undercut: false, id: 60402, type: 'Material', desc: 'The core of a legendary weapon. Contains the power to improve a weapon beyond its original potential.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Legendary Staff Core', sell_as_clutter: false, min_undercut: false, id: 60412, type: 'Material', desc: 'The core of a legendary staff. Contains the power to improve a staff beyond its original potential.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Legendary Armor Core', sell_as_clutter: false, min_undercut: false, id: 60422, type: 'Material', desc: 'The core of a legendary armor. Contains the power to improve an armor piece or shield beyond its original potential.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Voidseeker Shard', sell_as_clutter: false, min_undercut: false, id: 61001, type: 'Material', desc: 'When used with an equipment piece, this shard will temporarily imbue it with the Voidseeker\'s Blessing enchantment. (Weapon\'s damage type is changed to void, and a +50% physical accuracy bonus. No stack for DW.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Aether Shard', sell_as_clutter: false, min_undercut: false, id: 61101, type: 'Material', desc: 'When used with an equipment piece, this shard will temporarily imbue it with the Suffused Aether enchantment. (Gives +10% mana conservation bonus and a +50% magic accuracy bonus. No stack for DW.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Featherweight Shard', sell_as_clutter: false, min_undercut: false, id: 61501, type: 'Consumable', desc: 'When used with an equipment piece, this shard will temporarily imbue it with the Featherweight Charm enchantment. (Burden and interference by 7 or 50%, whichever is higher.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Amnesia Shard', sell_as_clutter: false, min_undercut: false, id: 65001, type: 'Consumable', desc: 'Can be used to reset the unlocked potencies and experience of an equipment piece.', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Infusion of Flames', sell_as_clutter: false, min_undercut: false, id: 12101, type: 'Consumable', desc: 'You gain +25% resistance to Fire elemental attacks and do 25% more damage with Fire magicks. (50 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Infusion of Frost', sell_as_clutter: false, min_undercut: false, id: 12201, type: 'Consumable', desc: 'You gain +25% resistance to Cold elemental attacks and do 25% more damage with Cold magicks. (50 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Infusion of Lightning', sell_as_clutter: false, min_undercut: false, id: 12301, type: 'Consumable', desc: 'You gain +25% resistance to Elec elemental attacks and do 25% more damage with Elec magicks. (50 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Infusion of Storms', sell_as_clutter: false, min_undercut: false, id: 12401, type: 'Consumable', desc: 'You gain +25% resistance to Wind elemental attacks and do 25% more damage with Wind magicks. (50 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Infusion of Divinity', sell_as_clutter: false, min_undercut: false, id: 12501, type: 'Consumable', desc: 'You gain +25% resistance to Holy elemental attacks and do 25% more damage with Holy magicks. (50 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Infusion of Darkness', sell_as_clutter: false, min_undercut: false, id: 12601, type: 'Consumable', desc: 'You gain +25% resistance to Dark elemental attacks and do 25% more damage with Dark magicks. (50 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of Swiftness', sell_as_clutter: false, min_undercut: false, id: 13101, type: 'Consumable', desc: 'Grants the Haste effect.<br>(Increases Action Speed by 60% than ≤ 50% by spell for 100 turns.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of Protection', sell_as_clutter: false, min_undercut: false, id: 13111, type: 'Consumable', desc: 'Grants the Protection effect.<br>(Absorbs all damage taken by 50% than ≤ 30% by spell for 100 turns.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of the Avatar', sell_as_clutter: false, min_undercut: false, id: 13199, type: 'Consumable', desc: 'Grants the Haste and Protection effects with twice the normal duration.<br>(= Scroll of Swiftness + Protection for 200 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of Absorption', sell_as_clutter: false, min_undercut: false, id: 13201, type: 'Consumable', desc: 'Grants the Absorb effect.<br>(Absorption Chance is 100% than ≤ 90% by spell.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of Shadows', sell_as_clutter: false, min_undercut: false, id: 13211, type: 'Consumable', desc: 'Grants the Shadow Veil effect.<br>(Increases evasion by 30% than ≤ 25% by spell for 100 turns.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of Life', sell_as_clutter: false, min_undercut: false, id: 13221, type: 'Consumable', desc: 'Grants the Spark of Life effect.<br>(100 turns, alive HP is 50% than 2 by spell, consumes 25% base SP than 50% by spell.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Scroll of the Gods', sell_as_clutter: false, min_undercut: false, id: 13299, type: 'Consumable', desc: 'Grants the Absorb, Shadow Veil and Spark of Life effects with twice the normal duration.<br>(= Scroll of Absorb + Shadow Veil + Spark of Life for 200 turns)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Flower Vase', sell_as_clutter: false, min_undercut: false, id: 19111, type: 'Consumable', desc: 'There are three flowers in a vase. The third flower is green.<br>(Sleeper Imprint: Your attack/magic damage, attack/magic hit/crit chance, and evade/resist chance increases significantly for a short time.)', isekai: { sell_as_clutter: false, min_undercut: false } },
            { name: 'Bubble-Gum', sell_as_clutter: false, min_undercut: false, id: 19131, type: 'Consumable', desc: 'It is time to kick ass and chew bubble-gum... and here is some gum.<br>(Kicking Ass: Your attacks and spells deal twice as much damage for a short time, will always hit, and will always land critical hits.)', isekai: { sell_as_clutter: false, min_undercut: false } },
        ],
    };

    //////// Image Data //////////
    const configButtonImg = 'data:image/png;base64,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';

    const configButton_Img = 'data:image/png;base64,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';

    ////////// Code ///////////

    if (GM_getValue('Configurations') == undefined) { // initialization
        GM_setValue('Configurations', HVCConfig_default);
    }
    const HVCConfig = GM_getValue('Configurations'); // load configurations

    const inIsekai = location.pathname == '/isekai/';
    const itemList = HVCConfig["Item List"];

    function getItemNum() { // get isekai items number
        var itemNum = [];
        if (inIsekai) {
            for (let i = 0, j = 0; i < itemList.length; i++) {
                if (itemList[i].isekai) {
                    itemNum[j] = i;
                    j++;
                }
            }
        } else {
            for (let i = 0; i < itemList.length; i++) {
                itemNum[i] = i;
            }
        }
        return itemNum;
    }

    // common functions
    function cE(name) { // create element shortcut
        return document.createElement(name);
    }
    function qS(name) { // selector
        return document.querySelector(name);
    }
    function delay(ms) { // function to delay
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function crtText(textContent, id, style) { // create text element
        const text = cE('text');
        text.textContent = textContent;
        if (id) text.id = id;
        if (style) text.style = style;
        return text;
    }
    function crtInput(type, id, className, style) { // create input element
        const input = cE('input');
        input.type = type;
        if (id) input.id = id;
        if (className) input.className = className;
        if (style) input.style = style;
        return input;
    }

    function gE(ele, mode, parent) { // get element
        if (typeof ele === 'object') {
            return ele;
        } if (mode === undefined && parent === undefined) {
            return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
        } if (mode === 'all') {
            return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
        } if (typeof mode === 'object' && parent === undefined) {
            return mode.querySelector(ele);
        }
    }

    function configButton() { // clutter configuration button
        const configButton = cE("div");
        configButton.id = 'hvcConfig';
        configButton.innerHTML = [
            '<button id="hvcConfig" style="border-width: 0px; padding: 0px; background: rgb(237, 235, 223); position: relative; top: -20px;">',
            '  <img src="',
            `${configButtonImg}`,
            '" alt="hvcConfig.png"></button>',
        ].join('');
        const left_up = qS('#market_xfer > div:nth-child(1)');
        left_up.parentElement.insertBefore(configButton, left_up);
        const balance_cur = qS('#market_xfer > div[class="credit_balance"]');
        balance_cur.style = 'position: relative; margin-top: -15px;';

        configButton.onclick = function () { // config chain buttom
            // styles
            const align_style = 'text-align: center; position: relative; left: 10px; top: 5px;';

            const globalStyle = gE('head').appendChild(cE('style'));
            const cssContent = [
                '#hvc_table{user-select:none}',
                '#hvc_table{flex-grow: 1;flex-shrink:1;overflow:auto}',
                '#hvc_table>table{min-width:800px;text-align: center;margin:auto;font-family:verdana;font-size:10pt;font-weight:bold;border-collapse:separate;border-spacing:0}',
                '#hvc_table tr:hover:not(:first-child),.market_itemorders tr[onclick]:hover{color:#9B4E03;background:linear-gradient(to right,#605A5A00 0%, #605A5A0A 5%, #605A5A0A 95%,#605A5A00 100%)}',
                '#hvc_table th{border-bottom:1px solid #5C0D11;padding:10px 0 10px 20px;position:sticky;top:0;background:#EDEBDF;z-index:1;font-size:18px;}',
                '#hvc_table th:first-child{min-width:200px}',
                '#hvc_table td{height:30px;border-bottom:1px solid #5C0D1136}',
                '#hvc_table td:nth-child(2), #hvc_table td:nth-child(3){padding-right:20px}',
                '#hvc_table td:last-child,#hvc_table th:last-child{padding-right:20px}',
                '#hvc_table td:not(:first-child){font-weight:normal}',
                '#hvc_table>p{font-size:9pt;font-style:italic;padding:10px}',
                '#hvc_table tr[data-orderdisabled="1"]{color:#e63e3e}',
                '.hvcCheckBox{width: 15px; height: 15px;}', // checkbox style
                '#hvcTitle{font-size: 20pt; font-family: verdana; font-weight: bold;}', // title style
            ].join('');
            globalStyle.textContent += cssContent;

            // clear right screen and remove old button
            var market_right, hvcgui, hvcTable_, hvcTable;
            market_right = qS('#market_right')
            market_right.innerHTML = '';
            configButton.remove();

            // config ui
            hvcgui = market_right.appendChild(cE('table'));
            hvcgui.id = 'hvcgui';

            // title universal
            const title1_ = hvcgui.insertRow().insertCell();
            title1_.style = align_style
            const title1 = crtText('Universal', 'hvcTitle');
            title1_.appendChild(title1);

            // HVCdelay
            const input_ = hvcgui.insertRow().insertCell();
            input_.style = align_style;
            input_.id = 'inputbox';
            const input = cE('input');
            input.type = 'text';
            input.value = HVCConfig["Settings"].HVCdelay;
            input.style = 'width: 50px; height: 12px; margin-bottom: 10px;';
            const input_desc = crtText('ms delay between each order', null, 'margin-left: 5px; font-size: 10pt;');
            input_.appendChild(input);
            input_.appendChild(input_desc);

            // item table
            hvcTable_ = market_right.appendChild(cE('div'));
            hvcTable_.id = 'hvc_table';
            hvcTable = hvcTable_.appendChild(cE('table'));

            const header = hvcTable.insertRow();
            const header1 = cE('th');
            header1.textContent = inIsekai ? 'Isekai Items' : 'Persistent Items';
            const header2 = cE('th');
            header2.textContent = 'Sell as Clutter';
            const header3 = cE('th');
            header3.textContent = 'Min Undercut';
            header.append(header1, header2, header3);

            function item_row(table, item) { // use for create new content row
                const config = inIsekai ? item.isekai : item; // differ config scope
                const row = table.insertRow();

                // name
                const cell_name = row.insertCell();
                const item_name = crtText(item.name, 'item_name');
                cell_name.appendChild(item_name);
                item_name.setAttribute('onmouseover', `common.show_popup_box(10,-40,398,82,\'hvc_table\',this,\'right\','${item.name.replace(/\'/g, '\\\'')}','${item.desc.replace(/\'/g, '\\\'')}','${item.type}')`);
                item_name.setAttribute('onmouseout', 'common.hide_popup_box()');

                // sell as clutter
                const cell_sell = row.insertCell();
                const checkbox_sell = crtInput('checkbox', 'sell_as_clutter', 'hvcCheckBox');
                checkbox_sell.checked = config.sell_as_clutter;
                cell_sell.appendChild(checkbox_sell);

                // min undercut
                const cell_minundercut = row.insertCell();
                const checkbox_minundercut = crtInput('checkbox', 'min_undercut', 'hvcCheckBox');
                checkbox_minundercut.checked = config.min_undercut;
                cell_minundercut.appendChild(checkbox_minundercut);
            }

            const itemNum = getItemNum(); // get number

            for (let i = 0; i < itemNum.length; i++) {
                var item = itemList[itemNum[i]];
                item_row(hvcTable, item);
            }

            // new style button to save config
            const configButton_ = cE("div");
            configButton_.id = 'hvcConfig_';
            configButton_.innerHTML = [
                '<button id="hvcConfig" style="border-width: 0px; padding: 0px; background: rgb(237, 235, 223); position: relative; top: -20px;">',
                '  <img src="',
                `${configButton_Img}`,
                '" alt="hvcConfig.png"></button>',
            ].join('');
            const left_up = qS('#market_xfer > div:nth-child(1)');
            left_up.parentElement.insertBefore(configButton_, left_up);

            function saveTable(config, checkSell, checkMinU) {
                config = inIsekai ? config.isekai : config;
                config.sell_as_clutter = checkSell.checked;
                config.min_undercut = checkMinU.checked;
            }

            configButton_.onclick = function () { // save config
                HVCConfig.Settings.HVCdelay = input.value;
                const checkSellAll = hvcTable.querySelectorAll('input[id="sell_as_clutter"]');
                const checkMinUcAll = hvcTable.querySelectorAll('input[id="min_undercut"]');
                for (let i = 0; i < itemNum.length; i++) {
                    saveTable(itemList[itemNum[i]], checkSellAll[i], checkMinUcAll[i]);
                }
                GM_setValue('Configurations', HVCConfig);
                window.location.href = window.location;
            };
        };
    } configButton();

    function sellClutterButton() { // sell clutter button
        const sellButton = cE("div");
        sellButton.innerHTML = [
            '<input',
            ' name="sell_clutter"',
            ' type="submit"',
            ' value="Sell Clutter"',
            ' style="font-size:10pt;border-radius:16px;">',
        ].join('');
        const market_left = qS('#market_left > div:nth-child(7)');
        market_left.parentElement.insertBefore(sellButton, market_left);

        // blank to adjust position
        const blank = cE("div");
        blank.style.paddingTop = "16px";
        const sellButton_ = qS('#market_left > div:nth-child(7)');
        sellButton_.parentElement.insertBefore(blank, sellButton_);

        // const selector strings
        const selector_sell_str = '#sellorder_update';
        const selector_stock_str = '#sell_order_stock_field > span';
        const selector_minundercut_str = '#market_itemsell > div:nth-child(1) > form > table > tbody > tr:nth-child(5) > td';
        const selector_0order_str = '#market_itembuy > div.market_itemorders > p';
        const input_price_str = '#sellorder_batchprice';

        async function sellClutter() { // traverse links and sell trophies
            const itemNum = getItemNum(); // get item number

            const iframe_ = document.createElement('iframe');
            iframe_.id = 'hvciframe';
            iframe_.hidden = true;
            document.querySelector('body').appendChild(iframe_);
            const iframe = document.querySelector('#hvciframe');

            async function clutterClick(item, ms) { // click buttons
                const config = inIsekai ? item.isekai : item; // differ config scope
                if (!config.sell_as_clutter) return 0;

                qS('#hvcselling').innerHTML = `---------------------- Selling now ----------------------<br><br>\> ${item.name} \<<br><br>------------------- ⚠ Click to stop ⚠ -------------------`;

                function getType(type) {
                    switch (type) {
                        case 'Trophy':
                            return 'tr';
                        case 'Material':
                            return 'ma';
                        case 'Consumable':
                            return 'co';
                        case 'Artifact':
                            return 'ar';
                    }
                }

                iframe.src = `https://hentaiverse.org/${inIsekai ? 'isekai/' : ''}?s=Bazaar&ss=mk&screen=browseitems&filter=${getType(item.type)}&itemid=${item.id}`;

                await new Promise(resolve => iframe.addEventListener('load', resolve)); // wait for iframe to load completely # by OpenAI ChatGPT

                var iframeDoc = iframe.contentWindow.document;

                // selectors
                const selector_sell = iframeDoc.querySelector(selector_sell_str);
                const selector_stock = iframeDoc.querySelector(selector_stock_str);
                const selector_minundercut = iframeDoc.querySelector(selector_minundercut_str);
                const input_price = iframeDoc.querySelector(input_price_str);
                const selector_0order = iframeDoc.querySelector(selector_0order_str);
                if (selector_stock.textContent.match(/^0.*/) || selector_0order) { // contine the next iteration if there is no stock or no order
                    iframe.src = "";
                    return 0;
                } else {
                    if (config.min_undercut) {
                        selector_minundercut.click();
                        await delay(1);
                        selector_stock.click();
                        await delay(1);
                        selector_sell.click();
                    } else {
                        input_price.value = 10;
                        await delay(1);
                        selector_stock.click();
                        await delay(1);
                        selector_sell.click();
                    }
                    await new Promise(resolve => iframe.addEventListener('load', resolve)); // wait for iframe to load completely # by OpenAI ChatGPT
                    iframeDoc = iframe.contentWindow.document; // since the page refresh, old iframDoc was cleared, new iframeDoc must be selected again
                }
                while ((iframeDoc.querySelector(selector_stock_str) && !(iframeDoc.querySelector(selector_stock_str).textContent.match(/^0.*/))) | !iframeDoc.querySelector(selector_stock_str)) {
                    await delay(10); // loop until the sell finished
                    if (iframeDoc.querySelector('#messagebox_inner > p[class="messagebox_error"]')) {
                        iframe.src = "";
                        return 1;
                    }
                }
                await delay(ms); // prevent too fast
                iframe.src = "";
                return 0;
            }

            for (let i = 0; i < itemNum.length; i++) {
                const item = itemList[itemNum[i]];
                while (await clutterClick(item, HVCConfig.Settings.HVCdelay) == 1) {
                    await clutterClick(item, HVCConfig.Settings.HVCdelay);
                }
            }
        }

        function startPopup() { // processing notification
            let popup_ = cE("div");
            popup_.innerHTML = [
                '<div id="messagebox_outer" onclick="{window.location.href = window.location;}">',
                '  <div id="messagebox_inner" style="overflow-y:auto">',
                `    <p class="messagebox_error" style="color:red" id="hvcselling">---------------------- Selling now ----------------------<br><br><br><br>------------------- ⚠ Click to stop ⚠ -------------------</p></div></div>`,
            ].join('');
            let market_outer = qS('#market_outer');
            market_outer.parentElement.insertBefore(popup_, market_outer);
        }
        function endPopup() { // finish notification
            qS('#messagebox_outer').remove();
            qS('#hvciframe').remove();
            let popup = cE("div");
            popup.innerHTML = [
                '<div id="messagebox_outer" onclick="{window.location.href = window.location;}">',
                '  <div id="messagebox_inner" style="overflow-y:auto">',
                '    <p class="messagebox_error" style="color:green">Clutter have been sold</p></div></div>',
            ].join('');
            let market_outer = qS('#market_outer');
            market_outer.parentElement.insertBefore(popup, market_outer);
        }
        sellButton.onclick = async function () { // sell clutter
            startPopup();
            await sellClutter();
            endPopup();
        }
    } sellClutterButton();

})();