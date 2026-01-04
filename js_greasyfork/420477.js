// ==UserScript==
// @name         Idlescape_Foodinfo
// @version      0.1.4
// @description  Food Descriptions
// @author       Holychikenz
// @namespace    Holychikenz
// @match        idlescape.com/*
// @match        https://www.idlescape.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/420477/Idlescape_Foodinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/420477/Idlescape_Foodinfo.meta.js
// ==/UserScript==

function setupObserver(promise) {

    promise = promise || new Promise(() => {});
    let success = false;
    // Hmm, looks like tooltips are outside the game container, otherwise I would use:
    // const targetNodeHolder = document.getElementsByClassName("game-container");
    // We want to wait for the game-container to come alive though so:
    const gameContainer = document.getElementsByClassName("game-container");
    //const targetNodeHolder = document.getElementsByTagName("body")[0];
    if(gameContainer.length > 0) {
        promise.then();
    }
    else {
        setTimeout(function(){setupObserver(promise);
                             }, 1000 );
        return false;
    }
    const targetNode = document.body;
    const config = {attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if(mutation.type === 'attributes'){
                document.querySelectorAll(".item-tooltip").forEach(
                    e=>{
                        let name = e.getElementsByTagName("span")[1].innerHTML.toLowerCase();
                        let statblock = e.getElementsByClassName("item-stat-block")[0];
                        if( statblock.innerHTML.includes("Ingredient") && !(statblock.innerHTML.includes("Size")) ){
                            let foodEntry = foods[name];
                            statblock.innerHTML += "<br/>Size: " + foodEntry.size +"<br/>Tags:";
                            for(let key in foodEntry){
                                if( key != "size" && foodEntry[key]==1 ){
                                    statblock.innerHTML += " " + key.charAt(0).toUpperCase() +key.slice(1) + ","
                                }
                            }
                            // Drop the last comma
                            statblock.innerHTML = statblock.innerHTML.slice(0, -1);
                            if( foodEntry.buff != "" ){
                                let buffwords = foodEntry.buff.split(" ");
                                for( let bi=0; bi<buffwords.length; bi++ )
                                {
                                    buffwords[bi] = buffwords[bi].charAt(0).toUpperCase() + buffwords[bi].slice(1);
                                }
                                statblock.innerHTML += "<br/>Buff: <b class='enchanted-text'>" + buffwords.join(" ") + "</b>"
                            }
                        }
                    });
                break;
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

}
const foods = {
    "milk": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 1,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "egg": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 1,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw anchovy": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw shrimp": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "shrimp lord",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "banana": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "gathering",
        "fruit": 1,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 1,
        "preservative": 0
    },
    "wildberry": {
        "exp": 10,
        "size": 1,
        "heat": 5,
        "buff": "",
        "fruit": 1,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 1,
        "preservative": 0
    },
    "sageberry": {
        "exp": 25,
        "size": 1,
        "heat": 25,
        "buff": "intuition",
        "fruit": 1,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 1,
        "preservative": 0
    },
    "wheat": {
        "exp": 10,
        "size": 1,
        "heat": 5,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 1,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "ichor": {
        "exp": 20,
        "size": 1,
        "heat": 5,
        "buff": "demon skin",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 1,
        "spice": 1,
        "sweetener": 0,
        "preservative": 0
    },
    "pepper": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "inferno",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 1,
        "sweetener": 0,
        "preservative": 0
    },
    "salt": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "cooking",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 1,
        "sweetener": 0,
        "preservative": 1
    },
    "sugar": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "efficiency",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 1,
        "sweetener": 1,
        "preservative": 0
    },
    "carrot": {
        "exp": 5,
        "size": 1,
        "heat": 5,
        "buff": "",
        "fruit": 0,
        "vegetable": 1,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "mushroom": {
        "exp": 15,
        "size": 1,
        "heat": 5,
        "buff": "nature",
        "fruit": 0,
        "vegetable": 1,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw salmon": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw trout": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "apple": {
        "exp": 5,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 1,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 1,
        "preservative": 0
    },
    "tomato": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 1,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "rice": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 1,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw beef": {
        "exp": 5,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 1,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw chicken": {
        "exp": 5,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 1,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "goblin brain": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "runecrafting",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 1,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "chili pepper": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "superheated",
        "fruit": 0,
        "vegetable": 1,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "potato": {
        "exp": 10,
        "size": 2,
        "heat": 10,
        "buff": "",
        "fruit": 0,
        "vegetable": 1,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "butter": {
        "exp": 15,
        "size": 3,
        "heat": 15,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 1,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw lobster": {
        "exp": 15,
        "size": 3,
        "heat": 15,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw tuna": {
        "exp": 15,
        "size": 3,
        "heat": 20,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "ashes": {
        "exp": 15,
        "size": 3,
        "heat": 15,
        "buff": "pyromancy",
        "fruit": 0,
        "vegetable": 0,
        "grain": 1,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 1,
        "sweetener": 0,
        "preservative": 0
    },
    "honey": {
        "exp": 15,
        "size": 3,
        "heat": 15,
        "buff": "fishing",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 1,
        "sweetener": 1,
        "preservative": 0
    },
    "pumpkin": {
        "exp": 15,
        "size": 3,
        "heat": 15,
        "buff": "",
        "fruit": 0,
        "vegetable": 1,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 0,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "raw shark": {
        "exp": 20,
        "size": 4,
        "heat": 20,
        "buff": "",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 1,
        "monster": 0,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    },
    "spider legs": {
        "exp": 20,
        "size": 4,
        "heat": 20,
        "buff": "nimble",
        "fruit": 0,
        "vegetable": 0,
        "grain": 0,
        "dairy": 0,
        "egg": 0,
        "meat": 1,
        "beast": 0,
        "poultry": 0,
        "fish": 0,
        "monster": 1,
        "spice": 0,
        "sweetener": 0,
        "preservative": 0
    }
}
const recipes = {
    "2100": {
        "Ingredients": [
        ],
        "HP": 1,
        "Name": "Questionable Food"
    },
    "2101": {
        "Ingredients": [
            "monster"
        ],
        "HP": 1,
        "Name": "Monster Surprise"
    },
    "2102": {
        "Ingredients": [
            "beast"
        ],
        "HP": 1,
        "Name": "Seared Steak"
    },
    "2103": {
        "Ingredients": [
            "fish"
        ],
        "HP": 1,
        "Name": "Seared fish"
    },
    "2104": {
        "Ingredients": [
            "poultry"
        ],
        "HP": 1,
        "Name": "Seared poultry"
    },
    "2123": {
        "Ingredients": [
            "fruit"
        ],
        "HP": 1,
        "Name": "Fried fruit"
    },
    "2124": {
        "Ingredients": [
            "vegetable"
        ],
        "HP": 1,
        "Name": "Grilled Veggies"
    },
    "2116": {
        "Ingredients": [
            "egg"
        ],
        "HP": 2,
        "Name": "Omelette"
    },
    "2126": {
        "Ingredients": [
            "fruit",
            "sweetener"
        ],
        "HP": 2,
        "Name": "Candied fruit"
    },
    "2105": {
        "Ingredients": [
            "poultry",
            "grain"
        ],
        "HP": 3,
        "Name": "Birdie Pasta"
    },
    "2106": {
        "Ingredients": [
            "beast",
            "grain"
        ],
        "HP": 3,
        "Name": "Spaghetti & Meat"
    },
    "2107": {
        "Ingredients": [
            "fish",
            "grain"
        ],
        "HP": 3,
        "Name": "Sushi"
    },
    "2112": {
        "Ingredients": [
            "monster",
            "grain",
            "sweetener"
        ],
        "HP": 3,
        "Name": "Demon Cake"
    },
    "2115": {
        "Ingredients": [
            "grain",
            "sweetener"
        ],
        "HP": 3,
        "Name": "Grain Cake"
    },
    "2117": {
        "Ingredients": [
            "egg",
            "monster"
        ],
        "HP": 3,
        "Name": "Monster Omelette"
    },
    "2118": {
        "Ingredients": [
            "egg",
            "beast"
        ],
        "HP": 3,
        "Name": "Meaty Omelette"
    },
    "2119": {
        "Ingredients": [
            "egg",
            "vegetable"
        ],
        "HP": 3,
        "Name": "Veggie Crepe"
    },
    "2120": {
        "Ingredients": [
            "egg",
            "fruit"
        ],
        "HP": 3,
        "Name": "Fruity Crepe"
    },
    "2121": {
        "Ingredients": [
            "egg",
            "dairy"
        ],
        "HP": 3,
        "Name": "Eggnog"
    },
    "2125": {
        "Ingredients": [
            "meat",
            "vegetable"
        ],
        "HP": 3,
        "Name": "Kebabs"
    },
    "2128": {
        "Ingredients": [
            "dairy",
            "vegetable"
        ],
        "HP": 3,
        "Name": "Vegetable Stew"
    },
    "2129": {
        "Ingredients": [
            "dairy",
            "meat"
        ],
        "HP": 3,
        "Name": "Meaty Stew"
    },
    "2130": {
        "Ingredients": [
            "dairy",
            "monster"
        ],
        "HP": 3,
        "Name": "Monster Stew"
    },
    "2131": {
        "Ingredients": [
            "meat",
            "preservative"
        ],
        "HP": 3,
        "Name": "Jerky"
    },
    "2133": {
        "Ingredients": [
            "dairy",
            "sweetener"
        ],
        "HP": 3,
        "Name": "Ice Cream"
    },
    "2108": {
        "Ingredients": [
            "poultry",
            "grain",
            "dairy"
        ],
        "HP": 4,
        "Name": "Birdie Pie"
    },
    "2109": {
        "Ingredients": [
            "beast",
            "grain",
            "dairy"
        ],
        "HP": 4,
        "Name": "Cottage Pie"
    },
    "2110": {
        "Ingredients": [
            "fish",
            "grain",
            "dairy"
        ],
        "HP": 4,
        "Name": "Fisherman's Pie"
    },
    "2111": {
        "Ingredients": [
            "fruit",
            "grain",
            "dairy"
        ],
        "HP": 4,
        "Name": "Fruit Pie"
    },
    "2113": {
        "Ingredients": [
            "dairy",
            "grain",
            "sweetener"
        ],
        "HP": 4,
        "Name": "Cake"
    },
    "2114": {
        "Ingredients": [
            "fruit",
            "grain",
            "sweetener"
        ],
        "HP": 4,
        "Name": "Fruit Cake"
    },
    "2122": {
        "Ingredients": [
            "beast",
            "fish",
            "poultry"
        ],
        "HP": 4,
        "Name": "Meat Roast"
    },
    "2127": {
        "Ingredients": [
            "fruit",
            "sweetener",
            "dairy"
        ],
        "HP": 4,
        "Name": "Milkshake"
    },
    "2132": {
        "Ingredients": [
            "egg",
            "dairy",
            "sweetener"
        ],
        "HP": 4,
        "Name": "Pudding"
    },
    "2134": {
        "Ingredients": [
            "monster",
            "grain",
            "spice"
        ],
        "HP": 4,
        "Name": "Monster Curry"
    },
    "2135": {
        "Ingredients": [
            "poultry",
            "grain",
            "spice"
        ],
        "HP": 4,
        "Name": "Birdie Curry"
    },
    "2136": {
        "Ingredients": [
            "beast",
            "grain",
            "spice"
        ],
        "HP": 4,
        "Name": "Beast Curry"
    },
    "2137": {
        "Ingredients": [
            "fish",
            "grain",
            "spice"
        ],
        "HP": 4,
        "Name": "Seafood Curry"
    },
    "2138": {
        "Ingredients": [
            "monster",
            "dairy",
            "egg"
        ],
        "HP": 4,
        "Name": "Monster Gelato"
    }
}
setupObserver()