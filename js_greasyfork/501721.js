// ==UserScript==
// @name        [GC] Cooking Pot MP Tiers
// @namespace   hanso
// @match       https://www.grundos.cafe/island/cookingpot/*
// @match       https://grundos.cafe/island/cookingpot/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      hanso
// @description Adds morphing potion tiers and improved sorting to Grundo's Cafe cooking pot.
// @downloadURL https://update.greasyfork.org/scripts/501721/%5BGC%5D%20Cooking%20Pot%20MP%20Tiers.user.js
// @updateURL https://update.greasyfork.org/scripts/501721/%5BGC%5D%20Cooking%20Pot%20MP%20Tiers.meta.js
// ==/UserScript==

const basicSpecies = ['Acara', 'Aisha', 'Blumaroo', 'Bori', 'Bruce', 'Buzz', 'Chia', 'Elephante', 'Eyrie', 'Flotsam', 'Gelert', 'Gnorbu', 'Grarrl', 'Ixi',
    'JubJub', 'Kacheek', 'Kau', 'Korbat', 'Kougra', 'Kyrii', 'Lenny', 'Lupe', 'Meerca', 'Moehog', 'Mynci', 'Nimmo', 'Ogrin', 'Peophin', 'Pteri', 'Quiggle',
    'Ruki', 'Scorchio', 'Shoyru', 'Skeith', 'Techo', 'Tuskaninny', 'Uni', 'Usul', 'Wocky', 'Xweetok', 'Yurble', 'Zafara'
];
const basicColors = ['Blue', 'Green', 'Red', 'Yellow'];
const tierDisplayColors = {
    1: '#f7b7b7',
    2: '#d4edda'
};

//2024 Oct 3rd - update to work with new onchange javascript
const original_updateSelectOptions = updateSelectOptions;
updateSelectOptions = function() {
  original_updateSelectOptions();
  doWork();
}

function updateMpOption(option, tier) {
    if (option) {
        if(!option.textContent.match(/ \(Tier [12]\)$/))
            option.textContent += ` (Tier ${tier})`;
        option.style.backgroundColor = tierDisplayColors[tier];
    }
}

function getMpTier(itemName) {
    const [color, species] = itemName.split(" ");
    return basicColors.includes(color) && basicSpecies.includes(species) ? 1 : 2;
}

function getSortOrder(itemName) {
    if (itemName.match(/^Select (first|second|third) item$/))
        return 1;
    else if (itemName.match(/ Morphing Potion$| \(Tier [12]\)$/))
        return getMpTier(itemName) + 1;
    else
        return 4;
}

function doWork() {
  for (let i = 1; i <= 3; i++) {
    const select = document.querySelector(`select[name="item${i}"]`);
    const options = Array.from(select.options);
    options.sort((a, b) => getSortOrder(a.textContent) - getSortOrder(b.textContent));

    select.innerHTML = '';
    options.forEach(function(opt) {
        if (opt.textContent.match(/ Morphing Potion$| \(Tier [12]\)$/)) {
            let mpTier = getMpTier(opt.textContent);
            updateMpOption(opt, mpTier);
        }
        select.appendChild(opt);
    });
}
}

doWork();