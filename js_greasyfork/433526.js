// ==UserScript==
// @name         All The Flavors - DIY Flavor Safety
// @namespace    https://alltheflavors.com/
// @version      0.1
// @description  On the All The Flavors website, this will add warning badges to any flavors listed in the DIY Flavor Safety database.
// @author       Kayla Colflesh
// @match        *://alltheflavors.com/*
// @icon         https://alltheflavors.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433526/All%20The%20Flavors%20-%20DIY%20Flavor%20Safety.user.js
// @updateURL https://update.greasyfork.org/scripts/433526/All%20The%20Flavors%20-%20DIY%20Flavor%20Safety.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

window.flavorSafetyList = [];

(async function() {
    'use strict';

    console.log('atfhelpers: started');

    await getFlavorSafetyList();

    var observer = new MutationObserver(function(mutations, observer) {
        console.log('afthelpers: debug: mutation');
        let recipes = dom_getRecipesOnPage();
        for (let recipe of recipes) {
            let flavors = dom_getFlavorsFromRecipe(recipe);
            for (let flavor of flavors) {
                if (flavor.children.length === 5) {
                    // There's no warning element here.
                    // Let's check if there needs to be a warning, then add it.
                    let vendor = flavor.children[2].innerText;
                    let name = flavor.children[3].innerText;
                    let safetyMetadata = searchForFlavorInSafetyList(flavorSafetyList, vendor, name);
                    if (safetyMetadata) {
                        let linkVendor = vendor.toLowerCase().replaceAll(/\(|\)/g, '');
                        let linkName = name.toLowerCase().replaceAll(/\(|\)/g, '').replaceAll(/ +/g, '-');
                        let warningDom = document.createElement('td');
                        let link = document.createElement('a');
                        warningDom.appendChild(link);
                        warningDom.onclick = function () { link.click(); };
                        link.target = '_blank';
                        link.href = 'https://safety.diyejuice.org/flavor/' + linkVendor + '-' + linkName;
                        link.style.color = 'white';
                        warningDom.style.cursor = 'pointer';
                        warningDom.style['font-weight'] = 'bold';
                        warningDom.style['text-align'] = 'center';
                        warningDom.style['text-decoration'] = 'underline';
                        warningDom.style['text-transform'] = 'lowercase';
                        if (safetyMetadata === 'Avoid') {
                            warningDom.style.background = 'red';
                            link.innerText = safetyMetadata;
                        } else if (safetyMetadata === 'Caution') {
                            warningDom.style.background = 'yellow';
                            link.innerText = safetyMetadata;
                        } else if (safetyMetadata === 'Research') {
                            warningDom.style.background = 'blue';
                            link.innerText = safetyMetadata;
                        } else {
                            warningDom.style.background = 'black';
                            link.innerText = 'ERROR';
                        }
                        flavor.appendChild(warningDom);
                    }
                }
                console.log(flavor.children.length);
            }
        }
    });
    observer.observe(document, {
        subtree: true,
        attributes: true
        //...
    });

})();

function searchForFlavorInSafetyList (safetyList, checkVendor, checkName) {
    let cleanRegex = /[^a-zA-Z0-9]/ig;
    checkVendor = checkVendor.trim().toLowerCase().replaceAll(cleanRegex, '');
    checkName = checkName.trim().toLowerCase().replaceAll(cleanRegex, '');
    for (let flavorSafety of safetyList) {
        let vendor = flavorSafety.vendor.trim().toLowerCase().replaceAll(cleanRegex, '');
        let name = flavorSafety.name.trim().toLowerCase().replaceAll(cleanRegex, '');
        if (vendor === checkVendor && name === checkName) {
            return flavorSafety.category;
        }
    }
    return false;
}

function dom_getRecipesOnPage () {
    let recipes = document.querySelectorAll('.recipe_lines .recipe-line-panel');
    return recipes;
}

function dom_getFlavorsFromRecipe (recipeElement) {
    let flavors = recipeElement.querySelectorAll('.flavors tr[class]');
    return flavors;
}

async function getFlavorSafetyList () {
    if (typeof window.localStorage.flavorSafetyList === 'string') {
        const result = JSON.parse(window.localStorage.flavorSafetyList);
        window.flavorSafetyList = result;
        return result;
    }
    const result = [];
    const raw = await $.get('https://raw.githubusercontent.com/diy-ejuice/diy-flavor-safety/master/data/flavors.json');
    const json = JSON.parse(raw);
    for (var i = 0; i < json.length; i++) {
        let flavor = json[i];

        let handled = false;
        for (var j = 0; j < result.length; j++) {
            if (result[j].name === flavor.name && result[j].vendor === flavor.vendor) {
                if (flavor.category === 'Avoid') {
                    result[j].category = 'Avoid';
                } else if (flavor.category === 'Caution') {
                    if (result[j].category !== 'Avoid') {
                        flavor.category = 'Caution';
                    }
                }
                handled = true;
            }
        }

        if (!handled) {
            result.push({ name: flavor.name, vendor: flavor.vendor, category: flavor.category });
        }
    }
    window.localStorage.flavorSafetyList = JSON.stringify(result);
    window.flavorSafetyList = result;
    return result;
}

async function populateFlavorSafetyList() {

}