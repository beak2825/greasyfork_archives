// ==UserScript==
// @name         AWBW Custom Army Importer - Beta 2.4
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  [Client Side] Allows users to fetch custom army sprites and use them in game!
// @author       Vesper
// @match        https://awbw.amarriner.com/prevmaps.php*
// @match        https://awbw.amarriner.com/editmap.php*
// @match        https://awbw.amarriner.com/game.php*
// @icon         https://awbw.amarriner.com/terrain/aw1/bluestar.gif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521087/AWBW%20Custom%20Army%20Importer%20-%20Beta%2024.user.js
// @updateURL https://update.greasyfork.org/scripts/521087/AWBW%20Custom%20Army%20Importer%20-%20Beta%2024.meta.js
// ==/UserScript==
debugger;

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function getKeyByValue(obj, value) {
    const entry = Object.entries(obj).find(([key, val]) => val === value);
    return entry ? entry[0] : null; // Return the key or null if not found
}

function convertToRaw(url) {
  return url
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/tree/", "/refs/heads/")
    .replace("/blob/", "/");
}

function extractCountryAndPath(spritePath) {
    let countryDict = {}
    let countries = []
    for (let c of Object.keys(BaseInfo.countries)) {
        let flatname = getFlatName(c);
        if (flatname == undefined) continue;

        countryDict[flatname] = c;
        countries.push(flatname);
    }

    for (let c of countries) {
        if (spritePath.includes(c)) {
            let path = spritePath.slice(spritePath.indexOf(c));
            path = path.replace(c, "");
            let country = countryDict[c];

            return { country, path };
        }
    }

    let match = spritePath.match(/terrain\/ani\/(gs_)?([a-zA-Z]{2})(.*)/);
    if (match) {
        const country = match[2]; // Extracts the 2-letter country code
        if (!BaseInfo.countries[country]) return null;

        let path = match[3]; // Extracts everything after the country code
        if (path.includes("?v=")) {
            let versionIndex = path.indexOf("?v=");
            path = path.slice(0, versionIndex);
        }
        return { country, path, gs: spritePath.includes("/ani/gs_")};
    }

    // Case 2: Check for "aw2/movement" paths with the country in the folder name
    match = spritePath.match(/terrain\/aw2\/movement\/([a-zA-Z]{2})\/(.*)/);
    if (match) {
        const country = match[1]; // Extracts the 2-letter country code
        let path = match[2]; // Extracts everything after the country folder

        // Remove the country code prefix from the path (if it starts with the country code)
        if (path.startsWith(country)) {
            path = path.slice(country.length); // Remove the country code prefix
        }

        return { country, path };
    }


    return null; // Return null if the format doesn't match

}

// Country_Code: [githubURL]
let countryReplacementMap = {};
let countriesDisabled = [];
window.countryReplacementMap = countryReplacementMap;
window.countriesDisabled = countriesDisabled;

class CustomArmy {
    name = "Custom Army";
    color = "grey";
    desc = "";
    author = "";
    github = "";
    logo = "";

    // Sprites from an Army will be loaded onto this and refered to when
    sprites = new Map();

    async checkSpritesExist(spriteNames, isBuilding) {
        const allChecks = [];

        let baseURL = this.github;
        const checks = spriteNames.map(spriteName => {
            const url = baseURL + spriteName;
            return fetch(url, { method: "HEAD" })
                .then(response => ({ spriteName, baseURL: baseURL, exists: response.ok }))
                .catch(() => ({ spriteName, exists: false })); // Handle fetch errors
        });
        for (let check of checks) allChecks.push(check);

        // Wait for all checks to complete
        const results = await Promise.all(allChecks);
        return results;
    }

    async preload() {
        if (!this.github) return;
        const spriteArray = unitSpriteMap;

        let results = await this.checkSpritesExist(spriteArray);
        // Process the results
        results.forEach(({ spriteName, baseURL, exists }) => {
            if (exists) {
                this.sprites.set(spriteName, baseURL + spriteName);
                console.log(`Cached Unit: ${spriteName} for ${this.author}'s ${this.name}`);
            } else {
                // console.log(`Not found: ${spriteName}`);
            }
        });

        const buildingArray = buildingSpriteMap;
        results = await this.checkSpritesExist(buildingArray, true);

        // Process the results
        results.forEach(({ spriteName, baseURL, exists }) => {
            if (exists) {
                this.sprites.set(spriteName, baseURL + spriteName);
                console.log(`Cached Building: ${spriteName} for ${this.author}'s ${this.name}`);
            } else {
                // console.log(`Not found: ${spriteName}`);
            }
        });

        // Logo Fetch
        let logoURL = this.github + "logo.gif";
        fetch(logoURL, { method: "HEAD" })
            .then(response => {
            if (response.ok) {
                this.logo = logoURL;
            } else {
                if (this.github.includes("replace-")) {
                    this.logo = "terrain/ani/" + this.github.slice(this.github.indexOf("replace-")).replace("replace-", "").replace("/", "") + "logo.gif"
                }
            }
        })
        .catch(() => {
            console.warn("Logo not found for: ", logoURL);
        });
        console.log(`Sprites for ${this.author}'s ${this.name} have been preloaded!`);
    }

    // Example Link: https://raw.githubusercontent.com/ShinyDeagle/My-Custom-Army/refs/heads/main/ab-rework/
    static fromLink(link) {
        let after = link.replace("https://raw.githubusercontent.com/", "").replace(" ", "");
        let splits = after.split("/");

        if (splits[splits.length - 1] == "") {
            splits.splice(splits.length - 1, 1);
        }

        if (splits.length <= 2) {
            return null;
        }

        let army = new CustomArmy();
        army.name = splits[1].replace("-", " ");
        army.author = splits[0];

        if (splits[splits.length - 1] != "contents") {
            army.name = army.name = splits[splits.length - 1].replace("-", " ");
        }

        army.desc = `${army.name} by ${army.author}.`;
        army.github = link;
        if (!army.github.endsWith("/")) army.github += "/";

        return army
    }

    // Example Link: https://github.com/ShinyDeagle/My-Custom-Army/tree/main/ab-rework
    static importLink(link) {
        if (link.includes("raw.github")) return CustomArmy.fromLink(link);
        let after = link.replace("https://github.com/", "").replace(" ", "");
        let splits = after.split("/");

        if (splits[splits.length - 1] == "") {
            splits.splice(splits.length - 1, 1);
        }

        if (splits.length <= 2) {
            return null;
        }

        let army = new CustomArmy();
        army.name = splits[1].replace("-", " ");
        army.author = splits[0];

        if (splits[splits.length - 1] != "contents") {
            army.name = splits[splits.length - 1].replace("-", " ");
        }

        army.desc = `${army.name} by ${army.author}.`;
        army.github = convertToRaw(link);
        if (!army.github.endsWith("/")) army.github += "/";

        return army
    }

    static fromJson(data) {
        let army = new CustomArmy();
        army.name = data.name;
        army.desc = data.desc;
        army.author = data.author;
        army.github = data.github;

        return army
    }

    toJson() {
        return {
            name: this.name,
            desc: this.desc,
            author: this.author,
            github: this.github,
        }
    }
}
let customArmies = [];
window.customArmies = customArmies;
// Each Army can be mapped to a Country
// Replaces the ReplacementMaps thing I used to have.
let countryToArmy = new Map();
window.countryToArmy = countryToArmy;

var BaseInfo = {};
BaseInfo.units = {
    1: {
        name: "Infantry",
        cost: 1e3,
        move_points: 3,
        move_type: "F",
        fuel: 99,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    2: {
        name: "Mech",
        cost: 3e3,
        move_points: 2,
        move_type: "B",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 3,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    3: {
        name: "Md.Tank",
        cost: 16e3,
        move_points: 5,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 8,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    4: {
        name: "Tank",
        cost: 7e3,
        move_points: 6,
        move_type: "T",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    5: {
        name: "Recon",
        cost: 4e3,
        move_points: 8,
        move_type: "W",
        fuel: 80,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    6: {
        name: "APC",
        cost: 5e3,
        move_points: 6,
        move_type: "T",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    7: {
        name: "Artillery",
        cost: 6e3,
        move_points: 5,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 2,
        long_range: 3,
        second_weapon: "N"
    },
    8: {
        name: "Rocket",
        cost: 15e3,
        move_points: 5,
        move_type: "W",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 6,
        short_range: 3,
        long_range: 5,
        second_weapon: "N"
    },
    9: {
        name: "Anti-Air",
        cost: 8e3,
        move_points: 6,
        move_type: "T",
        fuel: 60,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    10: {
        name: "Missile",
        cost: 12e3,
        move_points: 4,
        move_type: "W",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 6,
        short_range: 3,
        long_range: 5,
        second_weapon: "N"
    },
    11: {
        name: "Fighter",
        cost: 2e4,
        move_points: 9,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 5,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    12: {
        name: "Bomber",
        cost: 22e3,
        move_points: 7,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 5,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    13: {
        name: "B-Copter",
        cost: 9e3,
        move_points: 6,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 2,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    14: {
        name: "T-Copter",
        cost: 5e3,
        move_points: 6,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 2,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    15: {
        name: "Battleship",
        cost: 28e3,
        move_points: 5,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 2,
        long_range: 6,
        second_weapon: "N"
    },
    16: {
        name: "Cruiser",
        cost: 18e3,
        move_points: 6,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    17: {
        name: "Lander",
        cost: 12e3,
        move_points: 6,
        move_type: "L",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    18: {
        name: "Sub",
        cost: 2e4,
        move_points: 5,
        move_type: "S",
        fuel: 60,
        fuel_per_turn: 1,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    46: {
        name: "Neotank",
        cost: 22e3,
        move_points: 6,
        move_type: "T",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    960900: {
        name: "Piperunner",
        cost: 2e4,
        move_points: 9,
        move_type: "P",
        fuel: 99,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 2,
        long_range: 5,
        second_weapon: "Y"
    },
    968731: {
        name: "Black Bomb",
        cost: 25e3,
        move_points: 9,
        move_type: "A",
        fuel: 45,
        fuel_per_turn: 5,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    1141438: {
        name: "Mega Tank",
        cost: 28e3,
        move_points: 4,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 3,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    28: {
        name: "Black Boat",
        cost: 7500,
        move_points: 7,
        move_type: "L",
        fuel: 60,
        fuel_per_turn: 1,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    30: {
        name: "Stealth",
        cost: 24e3,
        move_points: 6,
        move_type: "A",
        fuel: 60,
        fuel_per_turn: 5,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    29: {
        name: "Carrier",
        cost: 3e4,
        move_points: 5,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 3,
        long_range: 8,
        second_weapon: "N"
    }
}
BaseInfo.countries = {
    os: {
        id: 1,
        name: "Orange Star",
        color: "181, 39, 68"
    },
    bm: {
        id: 2,
        name: "Blue Moon",
        color: "70,110,254"
    },
    ge: {
        id: 3,
        name: "Green Earth",
        color: "61, 194, 45"
    },
    yc: {
        id: 4,
        name: "Yellow Comet",
        color: "201, 189, 2"
    },
    bh: {
        id: 5,
        name: "Black Hole",
        color: "116, 89, 138"
    },
    rf: {
        id: 6,
        name: "Red Fire",
        color: "146, 50, 67"
    },
    gs: {
        id: 7,
        name: "Grey Sky",
        color: "114, 114, 114"
    },
    bd: {
        id: 8,
        name: "Brown Desert",
        color: "152, 83, 51"
    },
    ab: {
        id: 9,
        name: "Amber Blaze",
        color: "252, 163, 57"
    },
    js: {
        id: 10,
        name: "Jade Sun",
        color: "166, 182, 153"
    },
    ci: {
        id: 16,
        name: "Cobalt Ice",
        color: "11, 32, 112"
    },
    pc: {
        id: 17,
        name: "Pink Cosmos",
        color: "255, 102, 204"
    },
    tg: {
        id: 19,
        name: "Teal Galaxy",
        color: "60, 205, 193"
    },
    pl: {
        id: 20,
        name: "Purple Lightning",
        color: "111, 26, 155"
    },
    ar: {
        id: 21,
        name: "Acid Rain",
        color: "97, 124, 14"
    },
    wn: {
        id: 22,
        name: "White Nova",
        color: "205, 155, 154"
    },
    aa: {
        id: 23,
        name: "Azure Asteroid",
        color: "130, 220, 232"
    },
    ne: {
        id: 24,
        name: "Noir Eclipse",
        color: "3, 3, 3"
    },
    sc: {
        id: 25,
        name: "Silver Claw",
        color: "137, 168, 188"
    },
    uw: {
        id: 26,
        name: "Umber Wilds",
        color: "222, 139, 56"
    }
}
window.BaseInfo = BaseInfo;
Object.freeze(BaseInfo);

function getFlatName(countryCode) {
    if (BaseInfo.countries[countryCode] == undefined) return undefined
    return BaseInfo.countries[countryCode].name.toLowerCase().replace(" ", "")
}

// MutationObserver to replace sprites
const targetNode = document.querySelector('#gamemap');
if (!targetNode) return;

function initArmyImporter() {
    Vue.component("PrevMapAnalyzer", {
        template:
            `<div id='replay-misc-controls'>
                <div ref='openBtn' class='flex v-center' style='padding: 0px 12px; cursor: pointer; user-select: none;' @click='open = !open'>
                    <img src='terrain/aw1/bluestar.gif'/><b>Custom Armies</b>
                </div>
                <div v-show='open' class='flex col' :style="{ top: position.y + 'px',
                                                              right: -position.x + 'px',
                                                              zIndex: '1000',
                                                              position: 'absolute',
                                                              cursor: 'pointer',}">
                    <div class='bordertitle flex' style='color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;' draggable="true"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd">
                        <div style="font-weight: bold; display: block; float: left;">Custom Army Importer - Beta 2.4</div>
                    <div style="cursor: pointer" @click="open = false">
                    <img width='16' src="terrain/close.png"/>
                </div>
            </div>
            <div style='background: #fff; border: 1px black solid; padding: 4px; width: 384px;'>
                <div style="height: 32px; width: 95%; display: flex; gap: 16px; align-items: center; justify-content: center; padding: 8px; background: #0066cc; margin-bottom: 8px;">
                    <div @click="viewMode = 'Info'" :style="{
                        cursor: 'pointer',
                        background: viewMode == 'Info' ? '#7ebeff' : '#004d99',
                        color: 'white',
                        padding: '4px',
                        borderLeft: '2px solid rgb(0, 68, 170)',
                        borderRight: '2px solid rgb(0, 68, 170)',
                        width: '100%',
                    }">Info</div>
                    <div @click="viewMode = 'Assign'" :style="{
                        cursor: 'pointer',
                        background: viewMode == 'Assign' ? '#7ebeff' : '#004d99',
                        color: 'white',
                        padding: '4px',
                        borderLeft: '2px solid rgb(0, 68, 170)',
                        borderRight: '2px solid rgb(0, 68, 170)',
                        width: '100%',
                    }">Assign Army</div>
                    <div @click="viewMode = 'Import'" :style="{
                        cursor: 'pointer',
                        background: viewMode == 'Import' ? '#7ebeff' : '#004d99',
                        color: 'white',
                        padding: '4px',
                        borderLeft: '2px solid rgb(0, 68, 170)',
                        borderRight: '2px solid rgb(0, 68, 170)',
                        width: '100%',
                    }">Import Army</div>
                </div>
                <div v-show="viewMode == 'Info'" class='custom-army-importer-intro' style="background: #7ebeff; border: 1px black solid; padding: 4px; color: #000000; font-size: 12px">
                    <div style="display: flex; flex-direction: column; width: 100%; align-items: left; justify-content: left; margin: 0 auto;">
                        <label style='text-align: center; padding-bottom: 8px'><strong>Welcome To The Custom Army Importer!</strong></label>
                        <label style='text-align: left; padding-bottom: 4px'>This extension went through a Big 2.0 Update. Use the buttons up top to navigate everywhere.</label>
                        <label style='text-align: left; padding-bottom: 2px'>====================================================</label>
                        <label style='text-align: left; padding-bottom: 2px'>Each country available on the site can be pointed to a custom github repo or CDN.</label>
                        <label style='text-align: left; padding-bottom: 8px'>Head to 'Import Army' to add new armies via the link at the bottom.</label>
                        <label style='text-align: left; padding-bottom: 8px'>You need a valid github URL or raw URL to import the army.</label>
                        <strong style='text-align: left; padding-bottom: 2px'>Example URLs:</strong>
                        <label style='text-align: left; padding-bottom: 2px'>https://github.com/ShinyDeagle/My-Custom-Army/tree/main/ab-rework/</label>
                        <label style='text-align: left; padding-bottom: 2px'>https://raw.githubusercontent.com/ShinyDeagle/My-Custom-Army/refs/heads/main/ab-rework/</label>
                        <label style='text-align: left; padding-bottom: 2px'>====================================================</label>
                        <label style='text-align: left; padding-bottom: 2px'>You'll know if your sprites loaded if you see the custom Infantry and Mech below the url.</label>
                        <label style='text-align: left; padding-bottom: 2px'>Afterwards, Head to 'Assign Army' to pick the country and the army you want to replace it with..</label>
                        <label style='text-align: left; padding-bottom: 2px'>If the animations seem to <strong>Flicker</strong>...</label>
                        <label style='text-align: left; padding-bottom: 2px'>Reload the page with <strong>CTRL + SHIFT + R</strong> to refresh the browser cache.</label>
                        <label style='text-align: left; padding-bottom: 12px'>Refreshing the page can solve a lot of problems :p</label>
                        <label style='text-align: left; padding-bottom: 2px'>====================================================</label>
                        <label style='text-align: left; padding-bottom: 2px'>If you want to make your <strong>Own Custom Army</strong>, follow these steps at my <strong>Readme</strong> on this repo.</label>
                        <strong style='text-align: left; padding-bottom: 12px'>https://github.com/ShinyDeagle/My-Custom-Army</strong>
                        <strong style='text-align: left; padding-bottom: 2px'>Have Fun!</strong>
                    </div>
                </div>
                <div v-show="viewMode == 'Assign'" style="display: flex; flex-direction: column; width: 100%;">
					<div style="display: flex; width: 100%; align-items: center; justify-content: center; padding: 4px 0px 4px 0px;">
					   <div style="display: flex; flex-wrap: wrap; width: 100%;">
						   <img @click="editingArmy = cc" v-for='cc in countries' :style="{
								   cursor: 'pointer',
								   width: '24px',
								   height: '24px',
								   margin: '1px',
								   border: editingArmy === cc ? '4px solid cyan' : countryToArmy.has(cc) ? '4px solid orange' : '4px solid transparent',
							   }" :src='"terrain/aw1/"+ cc +"logo.gif"' :title="BaseInfo.countries[cc].name">
					   </div>
					</div>
					<hr style="width: 100%">
					<div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
						<div style='width: 100%; display: flex; flex-direction: row; align-items: center; gap: 4px;'>
							<img style='width: 24px; margin: 1px;' :src='"terrain/aw1/"+ editingArmy +"logo.gif"'>
							<strong style="font-size: 16px">{{BaseInfo.countries[editingArmy].name}}</strong>
							<img style='width: 24px; margin: 1px;' :src='"terrain/ani/"+ editingArmy +"infantry.gif"'>
							<img style='width: 24px; margin: 1px;' :src='"terrain/ani/"+ editingArmy +"mech.gif"'>
						</div>
                        <hr style="width: 100%;">
                        <div style="width: 100%; text-align: left;">Replaced With: {{ countryToArmy.has(editingArmy) ? countryToArmy.get(editingArmy).name : "None" }}</div>
						<div v-if='countryToArmy.has(editingArmy)'>
							<div style='margin-top: 4px; margin-bottom: 0px; display: flex; align-items: end;'>
								<img style='width: 24px; margin: 1px;' :src='countryToArmy.get(editingArmy).github + "xxinfantry.gif"'>
								<img style='width: 24px; margin: 1px;' :src='countryToArmy.get(editingArmy).github + "xxmech.gif"'>
								<img style='width: 24px; margin: 1px;' :src='countryToArmy.get(editingArmy).github + "xxcity.gif"'>
								<img style='width: 24px; margin: 1px;' :src='countryToArmy.get(editingArmy).github + "xxhq.gif"'>
								<img style='width: 24px; margin: 1px;' :src='countryToArmy.get(editingArmy).github + "xxlab.gif"'>
							</div>
						</div>
						<hr>
                        <div style="width: 100%; text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px; text-align: left;">Pick a Custom Army to replace this one.</div>
                        <div style="display: flex; flex-wrap: wrap; width: 100%; gap: 4px;">
                            <div @click="countryToArmy.delete(editingArmy); updateArmyMap()" :style="getArmyStyle(null)">
                              <img width="16" src="terrain/close.png" />
                              <div>None</div>
                            </div>
                            <div v-for="army in customArmies" :key="army.github" @click="setArmy(editingArmy, army);" :style="getArmyStyle(army)" :title="army.name">
                              <img :src="army.logo || 'terrain/moveplanner.gif'" style="width: 24px; height: 24px; padding: 2px; margin: 1px;">
                              <div style="word-wrap: normal; max-width: 64px; font-size: 12px;">{{ army.name }}</div>
                            </div>
                        </div>
					</div>
				</div>
                <div v-show="viewMode == 'Import'" style="display: flex; flex-direction: column; width: 100%;">
                    <div style="width: 100%; text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 4px;">Imported Custom Armies</div>
                    <div style="width: 100%; text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px;">Click on the Icon to Edit the Army</div>
                    <div style="width: 100%; text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 4px;">Import an Army if you don't see anything here.</div>
                    <div style="display: flex; flex-wrap: wrap; width: 100%; gap: 4px;">
                        <div @click="editingCustomArmy = army" v-for='army in customArmies' :title="army.name" :style="{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                cursor: 'pointer',
                                border: editingCustomArmy == army ? '2px solid cyan' : '2px solid grey',
                                borderBottom: '2px solid grey',}">
                            <img @click="editingCustomArmy = army" :style="{
                                       width: '24px',
                                       height: '24px',
                                       padding: '2px',
                                       margin: '1px',
                            }" :src="army.logo ? army.logo : 'terrain/moveplanner.gif'">
                            <div style="word-wrap: normal; max-width: 64px; font-size: 12px;">{{ army.name }}</div>
                        </div>
                    </div>
                    <hr style="width: 100%">
                    <div v-show="editingCustomArmy != null" style="display: flex; flex-direction: column; width: 100%; text-align: left;">
                        <div><span style="font-weight: bold">Name:</span> {{ editingCustomArmy?.name }}</div>
                        <div><span style="font-weight: bold">Description:</span> {{ editingCustomArmy?.desc }}</div>
                        <div><span style="font-weight: bold">Author:</span> {{ editingCustomArmy?.author }}</div>
                        <div><span style="font-weight: bold">Github:</span> {{ editingCustomArmy?.github }}</div>
                        <div style='margin-top: 4px; margin-bottom: 0px; display: flex; align-items: end;'>
                            <img style='width: 24px; margin: 1px;' :src='editingCustomArmy?.github + "xxinfantry.gif"'>
                            <img style='width: 24px; margin: 1px;' :src='editingCustomArmy?.github + "xxmech.gif"'>
                            <img style='width: 24px; margin: 1px;' :src='editingCustomArmy?.github + "xxcity.gif"'>
                            <img style='width: 24px; margin: 1px;' :src='editingCustomArmy?.github + "xxhq.gif"'>
                            <img style='width: 24px; margin: 1px;' :src='editingCustomArmy?.github + "xxlab.gif"'>
                        </div>
                        <div @click="deleteArmy(editingCustomArmy); updateArmyMap(); editingCustomArmy = null" :style="{display: 'flex',
                                  alignItems: 'center',
                                  padding: '4px',
                                  gap: '4px',
                                  cursor: 'pointer',
                                  width: 'fit-content',
                                  marginTop: '16px',
                                  color: 'black',
                                  background: 'red',}">
                              <img width="16" src="terrain/close.png" />
                              <div>Remove Army</div>
                        </div>
                    </div>
                    <hr style="width: 100%">
                    <div>
                        <div style="width: 100%; text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 4px;">Import Army Via Link</div>
                        <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
                            <div
                                style="text-align: left; font-size: 10px; margin-left: 12px; margin-right: 32px; border: 1px black solid; padding: 4px"
                                contenteditable="true"
                                @keydown.enter.prevent="importCountryURL($event)"
                            >
                                {{ "Enter Github Folder URL | EG: https://github.com/ShinyDeagle/My-Custom-Army/tree/main/ab-rework" }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        props: {
            countries: Array,
        },
        data: function() {
            return {
                viewMode: "Info",
                open: !1,
                countriesDisabled: [],
                countryReplacementMap: {}, // Now deprecated, will be used for something else instead.
                editingArmy: "os",
                editingCustomArmy: null,
                countryToArmy: new Map(),
                customArmies: [],
                position: { x: 50, y: 100 },
                offset: { x: 0, y: 0 },
            }
        },
        created() {
            this.BaseInfo = BaseInfo;
            this.countryReplacementMap = countryReplacementMap;
            this.countriesDisabled = countriesDisabled;
            // Load settings for countryReplacementMap from localStorage
            let importerSettings = localStorage.importerSettings;
            if (importerSettings) {
                let data = JSON.parse(importerSettings);
                for (let link of Object.values(data)) {
                    let army = CustomArmy.fromLink(link);
                    if (!army) continue;

                    let skip = false;
                    for (let a of customArmies) {
                        if (a.github == army.github) {
                            skip = true;
                            break;
                        };
                    }
                    if (skip) continue;

                    army.preload();
                    customArmies.push(army);
                    console.log(`Loaded: ${army.name} by ${army.author}`);
                }
            }

            let savedArmies = localStorage.customArmies;
            if (savedArmies) {
                let data = JSON.parse(savedArmies);
                for (let github of data) {
                    let army = CustomArmy.fromLink(github);
                    if (!army) continue;

                    let skip = false;
                    for (let a of customArmies) {
                        if (a.github == army.github) {
                            skip = true;
                            break;
                        };
                    }
                    if (skip) continue;

                    army.preload();
                    customArmies.push(army);
                    console.log(`Loaded: ${army.name} by ${army.author}`);
                }
            }

            let customArmySettings = localStorage.customArmySettings;
            if (customArmySettings) {
                let data = JSON.parse(customArmySettings);
                for (let country of Object.keys(data)) {
                    let github = data[country];
                    let army = null;

                    for (let a of window.customArmies) {
                        if (a.github == github) {
                            army = a;
                            break;
                        }
                    }
                    if (!army) continue;

                    countryToArmy.set(country, army);
                    console.log(`Assigned: ${army.name} by ${army.author}`);
                }
            }

            // Load settings for countriesDisabled from localStorage
            let disabledCountries = localStorage.disabledCountries;
            if (disabledCountries) {
                let data = JSON.parse(disabledCountries);
                this.countriesDisabled = data;
                window.countriesDisabled = this.countriesDisabled;
            }

            // Save settings with debounce to avoid excessive updates
            this.saveSettings = debounce(() => {
                // Save countryReplacementMap to localStorage
                localStorage.importerSettings = JSON.stringify(this.countryReplacementMap);

                // Save countriesDisabled to localStorage
                localStorage.disabledCountries = JSON.stringify(this.countriesDisabled);

                let armySettingData = {};
                for (let entry of countryToArmy.keys()) {
                    let army = countryToArmy.get(entry);
                    let github = army.github;

                    armySettingData[entry] = github;
                }
                localStorage.customArmySettings = JSON.stringify(armySettingData);

                let armyGithubs = [];
                for (let army of customArmies) {
                    armyGithubs.push(army.github);
                }
                localStorage.customArmies = JSON.stringify(armyGithubs);
            }, 1500);
            this.updateArmyMap();
        },
        methods: {
            onDragStart(event) {
                // Record the initial mouse position relative to the element
                this.offset.x = event.clientX - this.position.x;
                this.offset.y = event.clientY - this.position.y;
            },
            onDragEnd(event) {
                // Update the position of the element based on the drag
                this.position.x = event.clientX - this.offset.x;
                this.position.y = event.clientY - this.offset.y;
                this.position.x = Math.max(-600, this.position.x);
                this.position.y = Math.max(0, this.position.y);
            },
            getArmyStyle(army) {
                this.countryToArmy = countryToArmy;
                let isSelected =
                    (army === null && !this.countryToArmy.has(this.editingArmy)) ||
                    (army !== null &&
                     this.countryToArmy.has(this.editingArmy) &&
                     this.countryToArmy.get(this.editingArmy)?.github === army.github);

                return {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    gap: '4px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid cyan' : '2px solid grey',
                    borderBottom: '2px solid grey'
                };
            },
            setArmy(target, army) {
                countryToArmy.set(target, army);
                this.updateArmyMap();
                this.saveSettings();
            },
            deleteArmy(army) {
                let github = army.github;
                for (let a of countryToArmy.keys()) {
                    if (countryToArmy.get(a).github == github) {
                        countryToArmy.delete(a);
                    }
                }

                let index = customArmies.indexOf(army);
                if (index != -1) customArmies.splice(index, 1);

                this.saveSettings();
            },
            updateArmyMap() {
                // Create a new Map with the same entries to trigger Vue update
                this.countryToArmy = new Map(countryToArmy);
                this.customArmies = customArmies.slice();
            },
            preloadSprites(country) {
                window.preloadCountrySprites(country, this.countryReplacementMap);
            },
            importCountryURL(event) {
                const newContent = event.target.innerText.trim(); // Get text content
                if (!newContent) return;

                let army = CustomArmy.importLink(newContent);
                if (!army) return;

                for (let a in window.customArmies) {
                    if (a.github == army.github) return;
                }

                army.preload();
                customArmies.push(army);
                this.updateArmyMap();
                this.saveSettings();
            },
        }
    });

    let gameContainer = document.querySelector("#gamecontainer");
    if (gameContainer == undefined) return;

    let extensionPanel = document.querySelector("#vesper-extensions");
    if (extensionPanel == undefined) {
        extensionPanel = document.createElement("div");
        extensionPanel.id = "vesper-extensions";

        extensionPanel.style.background = '#98a0b8';
        extensionPanel.style.border = '2px solid #768a96';
        extensionPanel.style.display = 'flex';
        extensionPanel.style.flexDirection = 'row';
        extensionPanel.style.padding = '4px';
        extensionPanel.style.margin = '0px';
        extensionPanel.style.marginLeft = '-4px';
        extensionPanel.style.marginBottom = '8px';

        gameContainer.children[1].after(extensionPanel);
    }

    let e = document.createElement("div");
    e.id = "custom-army-importer";
    extensionPanel.append(e);

    let o = Object.keys(BaseInfo.countries).map((e => e)).sort(((e, t) => BaseInfo.countries[e].id - BaseInfo.countries[t].id));
    window.armyImporter = new Vue({
        el: "#custom-army-importer",
        template: '<PrevMapAnalyzer :countries="countries" :countriesDisabled="countriesDisabled" :countryReplacementMap="countryReplacementMap"/>',
        data: function() {
            return {
                countries: o,
                countriesDisabled: [],
                countryReplacementMap: {},
            }
        }
    })
}

// Path to your GitHub sprite folder
const githubBaseUrl = "https://raw.githubusercontent.com/ShinyDeagle/custom-army-testing/refs/heads/main/ab-rework/";
const documentFile = "config.json";
// List of possible types sprites that can be replaced.
const spriteMap = [
    "xxoo.gif",
    "gs_xxoo.gif",
    "xxoo_mside.gif",
    "xxoo_mup.gif",
    "xxoo_mdown.gif",
];
const buildingMap = [
    "xxcity.gif",
    "xxport.gif",
    "xxbase.gif",
    "xxlab.gif",
    "xxcomtower.gif",
    "xxairport.gif",
    "xxhq.gif",
];
const buildingNames = [
    "city.gif",
    "port.gif",
    "base.gif",
    "lab.gif",
    "comtower.gif",
    "airport.gif",
    "hq.gif",
];
const weatherNames = [
    "_rain.gif",
    "_snow.gif",
];

// List of all possible sprites that can be replaced.
const unitSpriteMap = [];
for (let id of Object.keys(BaseInfo.units)) {
    let name = BaseInfo.units[id].name;
    let cleanedName = name.toLowerCase().replace(" ", "");
    for (let spriteKey of spriteMap) {
        let sprite = spriteKey.replace("oo", cleanedName);
        unitSpriteMap.push(sprite);
    }
}

// Accounts for the loss of the `.` in the md.tank when using animations on the site.
unitSpriteMap.push("xxmdtank_mside.gif")
unitSpriteMap.push("xxmdtank_mup.gif")
unitSpriteMap.push("xxmdtank_mdown.gif")

let buildingSpriteMap = buildingMap.slice();
window.unitSpriteMap = unitSpriteMap;
window.buildingSpriteMap = buildingSpriteMap;

for (let building of buildingSpriteMap.slice()) {
    for (let weatherEffect of weatherNames) {
        buildingSpriteMap.push(building.replace(".gif", weatherEffect));
    }
}

function doSpriteReplacement(img) {
    const spriteName = img.src;
    if (spriteName.includes("neutral")) return;

    let result = extractCountryAndPath(spriteName)
    if (!result) {
        let c = img.getAttribute("country");
        if (c == null) return;

        result = {
            country: c,
            path: spriteName.slice(spriteName.indexOf("xx")).replace("xx", ""),
            gs: spriteName.includes("/ani/gs_") || spriteName.includes("gs_xx"),
        }
    }

    const country = result.country;
    if (countriesDisabled.includes(country)) return;
    let path = result.path;
    if (path.includes("/purplelightning")) {
        let x = 0;
    }
    let target = country + path;
    if (path.includes("/" + country) && !path.includes("lab.gif")) {
        target = result.path;
        path = path.replace(country, "/");
    }
    if (path.includes("?v=")) {
        let versionIndex = path.indexOf("?v=");
        path = path.slice(0, versionIndex);
    }
    if (target.includes("?v=")) {
        let versionIndex = target.indexOf("?v=");
        target = target.slice(0, versionIndex);
    }

    let isBuilding = false;
    for (let bName of buildingNames) {
        if (target == bName || target.replace(country, "").includes(bName.replace(".gif", ""))) {
            isBuilding = true;
            break;
        }
    }

    if (isBuilding) target = getFlatName(country) + path;

    const replacer = "xx" + path;
    const army = countryToArmy.get(country);
    const desiredSrc = army ? army.github + replacer : null;
    if (!desiredSrc) return;

    // Replace the src only if it differs and the sprite is available
    if (img.src !== desiredSrc) {
        if (army.sprites.has((result.gs ? "gs_" : "") + replacer)) {
            img.src = army.sprites.get((result.gs ? "gs_" : "") + replacer);
        } else if (img.getAttribute("weather")) {
            let weatherless = replacer;
            for (let weather of weatherNames) {
                weatherless = weatherless.replace(weather, ".gif");
            }

            if (army.sprites.has((result.gs ? "gs_" : "") + weatherless)) {
                img.src = army.sprites.get((result.gs ? "gs_" : "") + weatherless);
            } else {
                //if (isBuilding) {
                //    img.src = "terrain/ani/" + getFlatName(result.country) + "/" + target;
                //}
                //else {
                img.src = "terrain/ani/" + target;
                //}
            }
        } else {
            img.src = "terrain/ani/" + target;
        }
        //console.log(`Replaced ${spriteName} with ${img.src}`);
    }
}

let debounceTimers = new Map();
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        const img = mutation.target;
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            const img = mutation.target;
            const parent = img.parentElement;

            if (parent && parent.classList.contains("game-building") && parent.classList.contains("s")) {
                if (!img.src.includes("xx")) {
                    let result = extractCountryAndPath(img.src);
                    if (result) {
                        img.setAttribute("country", result.country);
                    }

                    let weather = false;
                    for (let weatherEffect of weatherNames) {
                        if (img.src.includes(weatherEffect)) {
                            weather = true;
                            img.setAttribute("weather", weatherEffect.replace("_", "").replace(".gif", ""));
                        }
                    }

                    if (!weather) img.setAttribute("weather", null);
                }
            }

           // Clear any existing timeout for this specific image
            if (debounceTimers.has(img)) {
                clearTimeout(debounceTimers.get(img));
            }

            // Create a new debounce timer for this image
            const timer = setTimeout(() => {
                doSpriteReplacement(img);

                // Clean up the timer once the operation is complete
                debounceTimers.delete(img);
            }, 10); // Debounce interval

            // Store the timer for this image
            debounceTimers.set(img, timer);
        }
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                // Check if the node is an element (ignores text nodes)
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Look for img elements inside the node
                    const images = node.querySelectorAll('img');
                    images.forEach((img) => {
                        if (img.getAttribute("country") == null) {
                            let result = extractCountryAndPath(img.src)
                            if (!result) return;

                            const country = result.country;
                            img.setAttribute("country", country);
                        }
                        if (img.getAttribute("country") == null) return;
                        if (img.src.includes("xx")) return;

                        doSpriteReplacement(img);
                    });
                }
            });
        }
    }
});

observer.observe(targetNode, {
    childList: true,  // Detects added or removed child nodes
    subtree: true,    // Detects nodes anywhere within the subtree
    attributes: true, // Detects changes to attributes (like `src` of images)
});
const replaceAllSprites = () => {
    let images = document.querySelectorAll('#gamemap-container img, #calculator img');
    images.forEach((img) => {
        let result = extractCountryAndPath(img.src)
        if (!result) return;

        const country = result.country;
        img.setAttribute("country", country);
    });

    images.forEach((img) => {
        if (img.getAttribute("country") == null) return;
        doSpriteReplacement(img);
    });
};

// Call replaceAllSprites to replace images on page load (or wherever appropriate)
replaceAllSprites();

const checkInterval = 500; // Check every 500ms

function checkSrcChanges() {
    let images = document.querySelectorAll('#gamemap-container img, #calculator img');
    // console.log("Periodic Src Check!");
    // console.log(images.lengthgth);

    const terrainAniPath = 'terrain/ani/'; // The part of the URL we care about
    images.forEach(img => {
        if (img.src.includes("xx")) {
            let fixed = img.src;
            let country = img.getAttribute("country");
            if (country == null) return;

            let path = fixed.slice(fixed.indexOf("xx")).replace("xx", country);

            let isBuilding = false;
            for (let bName of buildingNames) {
                if (path.replace(country, "").includes(bName.replace(".gif", ""))) {
                    isBuilding = true;
                    break;
                }
            }

            if (isBuilding) path = path.replace(country, getFlatName(country));

            if (!countryToArmy.has(country)) {
                fixed = terrainAniPath + path; // Set the new sprite path with "terrain/ani/"

                img.src = fixed;
                if (img.getAttribute("weather")) img.src + "_" + img.getAttribute("weather") + ".gif";
                // console.log(`Overridden: ${fixed}`);
                return;
            }
        }

        doSpriteReplacement(img);
    });
}
window.checkSrcChanges = checkSrcChanges;

// Call `checkSrcChanges` periodically
setInterval(checkSrcChanges, checkInterval);

async function loadThisShit() {
    try {
        if (typeof Vue === "undefined") {
            await loadScript("js/vue.js");
        }

        initArmyImporter();
    } catch (error) {
        console.error("Failed to load scripts or initialize:", error);
    }
}
window.gameMap = document.getElementById("gamemap")
loadThisShit();

console.log("Sprite replacement script with caching is running...");