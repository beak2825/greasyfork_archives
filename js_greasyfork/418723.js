// ==UserScript==
// @name         ContinueLeveling
// @namespace    com.nightcorex.dh3
// @version      1.1.2
// @description  Continue leveling past lvl 100
// @author       Nightcorex
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418723/ContinueLeveling.user.js
// @updateURL https://update.greasyfork.org/scripts/418723/ContinueLeveling.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Contains the xp values for the levels 101-228. This should satisfy all needs considering the highest someone has
     * after nearly 200 days of playtime is 100M points in one particular skill.
     *
     * Values are precalculated by the formula {@code (long) Math.ceil(Math.pow(level, 3 + level / 200d))}
     *
     * Keep in mind that because double only offers limited precision these values may be off by as much as 4 xp 
     * (in reality the values where the xp may be off by 4 xp are the very last in this list thus the actual offset 
     * players have to worry about is at most 2 xp which should be okay considering it's only around 0,000002%)
     */
    const levelArray = [10596109, 11225007, 11888385, 12588018, 13325769, 14103591, 14923534, 15787745, 16698480,
        17658103, 18669092, 19734048, 20855695, 22036891, 23280633, 24590061, 25968468, 27419303, 28946185, 30552904,
        32243432, 34021934, 35892771, 37860514, 39929953, 42106106, 44394230, 46799832, 49328680, 51986818, 54780575,
        57716580, 60801776, 64043434, 67449169, 71026953, 74785137, 78732462, 82878082, 87231579, 91802988, 96602810,
        101642042, 106932193, 112485310, 118314005, 124431474, 130851534, 137588640, 144657922, 152075215, 159857086,
        168020874, 176584719, 185567605, 194989391, 204870858, 215233744, 226100794, 237495801, 249443654, 261970390,
        275103244, 288870704, 303302568, 318430001, 334285599, 350903453, 368319218, 386570179, 405695328, 425735441,
        446733159, 468733066, 491781785, 515928063, 541222870, 567719497, 595473660, 624543611, 654990250, 686877242,
        720271145, 755241535, 791861146, 830206006, 870355588, 912392962, 956404955, 1002482324, 1050719924, 1101216895,
        1154076853, 1209408086, 1267323769, 1327942175, 1391386904, 1457787122, 1527277805, 1600000000, 1676101096,
        1755735101, 1839062938, 1926252756, 2017480245, 2112928972, 2212790733, 2317265914, 2426563873, 2540903338,
        2660512822, 2785631055, 2916507436, 3053402505, 3196588438, 3346349555, 3502982864, 3666798617, 3838120896,
        4017288221, 4204654193, 4400588151, 4605475873, 4819720297, 5043742279, 5277981380, 5522896691, 5778967694];

    function init() {
        if (!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        const skills = ["combat", "magic", "mining", "crafting", "woodcutting", "farming", "brewing", "fishing", "cooking"];

        //JQUERY LINKS

        const progressBar = {
            combat: $("#xp-bar-combat-inner"),
            magic: $("#xp-bar-magic-inner"),
            mining: $("#xp-bar-mining-inner"),
            crafting: $("#xp-bar-crafting-inner"),
            woodcutting: $("#xp-bar-woodcutting-inner"),
            farming: $("#xp-bar-farming-inner"),
            brewing: $("#xp-bar-brewing-inner"),
            fishing: $("#xp-bar-fishing-inner"),
            cooking: $("#xp-bar-cooking-inner")
        }

        const level = {
            combat: $("#span-topBar-combatLevel"),
            magic: $("#span-topBar-magicLevel"),
            mining: $("#span-topBar-miningLevel"),
            crafting: $("#span-topBar-craftingLevel"),
            woodcutting: $("#span-topBar-woodcuttingLevel"),
            farming: $("#span-topBar-farmingLevel"),
            brewing: $("#span-topBar-brewingLevel"),
            fishing: $("#span-topBar-fishingLevel"),
            cooking: $("#span-topBar-cookingLevel")
        }

        const globalLevel = $("#span-topBar-globalLevel");
        const customGlobalLevel = createElement('span', "span-tobBar-customGlobalLevel");
        customGlobalLevel.style.color = "orange";
        customGlobalLevel.style.fontSize = "16pt";
        globalLevel.after(customGlobalLevel);


        //DYNAMICAL SETUP


        const origGetLevel = window.getLevel;
        window.getLevel = function (xp) {
            //Returns the level for a given xp value. Can handle levels up to 200.

            //We do not necessarily want to call the old function here
            if (xp < levelArray[0])
                return origGetLevel.apply(this, arguments);

            //binary search
            let low = 0, high = levelArray.length - 1;
            while (low <= high) {
                let mid = (low + high) >> 1;
                if (xp < levelArray[mid])
                    high = mid - 1;
                else if (xp > levelArray[mid])
                    low = mid + 1;
                else {
                    return mid + 100;
                }
            }
            return low + 100;
        }

        const origGetGlobalLevel = window.getGlobalLevel;
        window.getGlobalLevel = function () {
            //save all skill level values - for readability
            const skillsLevel = skills.map(v => getSkillLevel(v));

            //update the global level
            const max100GlobalLevel = skillsLevel.map(v => v < 100 ? v : 100).reduce((a, b) => a + b);
            customGlobalLevel.innerText = ' (' + max100GlobalLevel + ')';

            //return the old value at the end to have a displayable value for the main field
            return origGetGlobalLevel.apply(this, arguments);
        }


        const origRefreshTopSkillBar = window.refreshTopSkillBar;
        window.refreshTopSkillBar = function () {
            origRefreshTopSkillBar.apply(this, arguments);

            skills.forEach(key => {
                refreshXpBarAnimation(key);

                progressBar[key].width(window.percentageDecimalXpBarWidth * 100 + '%');
            });
        }
    }

    /**
     *
     * @returns {HTMLSpanElement} With the given parameters. If no parameters (or undefined) are given then an empty <span> element is returned.
     */
    function createElement(tagName, id, className, src, onClick, style) {
        const notification = document.createElement(tagName || 'span');
        if (id !== undefined)
            notification.id = id;
        if (className !== undefined)
            notification.className = className;
        if (src !== undefined)
            notification.src = src;
        if (onClick !== undefined)
            notification.onclick = onClick;

        return notification;
    }

    $(init);
})
();