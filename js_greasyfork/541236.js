// ==UserScript==
// @name         PowderScripts - XXX Distance
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Tweaks the colour genes section of Chicken profiles to show information on the easiest way to XXX a chicken!
// @author       Aviivix
// @match        https://chicken.pet/chicken/*
// @match        https://chicken.pet/random
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chicken.pet
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541236/PowderScripts%20-%20XXX%20Distance.user.js
// @updateURL https://update.greasyfork.org/scripts/541236/PowderScripts%20-%20XXX%20Distance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // "distance" function, not to be confused with a Distance Function
    function distance(start, target) {
        return Math.min(Math.abs(start - target), 55 - Math.abs(start - target))
    }
    // The ChickenPet colour wheel as of June 16, 2025. If more colours are added I'll have to change this manually, but I doubt they will be.
    var color_wheel = ["Violet", "Amethyst", "Lavender", "Orchid", "Plum", "Fuchsia", "Wine", "Black", "Sable", "Grey", "Ash", "Silver", "Mist", "White", "Pink", "Maroon", "Rose", "Crimson", "Red", "Russet", "Brown", "Vermilion", "Bark", "Cream", "Beige", "Orange", "Honey", "Gold", "Ochre", "Yellow", "Lemon", "Lime", "Apple", "Chartreuse", "Olive", "Leaf", "Grass", "Gluppy", "Viridian", "Spring", "Mint", "Turquoise", "Teal", "Aqua", "Sea", "Cerulean", "Sky", "Sapphire", "Ultramarine", "Tumblr", "Navy", "Indigo", "Lilac", "Blurple", "Overcast"]
    // Same wheel but hex codes only. Maybe I should've made this an object, but whatever.
    // i paid xxx 50 eggs to type this out because i didnt want to
    var hex_wheel = ["8018b8", "b912db", "f098fa", "d95be3", "9c0b94", "d80c9b", "7a0a4d", "141413", "1a1918", "696562", "8a8981", "bfc9c8", "ced4d9", "f7f7f2", "f0a3ce", "870544", "fac3d2", "bd2246", "b34747", "944d3b", "a66d4c", "de552f", "5e4c3e", "f7ecdf", "d4b590", "d9952e", "ebb75b", "c49035", "c2881d", "f2de2c", "d8e38d", "c5e838", "def2ac", "799c28", "505e29", "147521", "81d136", "bddead", "258a40", "73de9a", "73debc", "21a698", "06888f", "44d4db", "047f91", "08a6d1", "15a7eb", "0277c4", "0254b3", "021a35", "1d246b", "4f2dc2", "af8ff7", "854fe3", "5c4682"]
    var black_colors = ["Pink", "Rose", "Cream", "Beige", "Orange", "Honey", "Yellow", "Lemon", "Lime", "Apple", "Grass", "Gluppy", "Spring", "Mint", "Aqua", "Cerulean", "Sky", "Lilac", "Blurple", "White", "Silver"]
    // Grabbing the first list-group class, this is the most likely thing I'll have to change if the site updates and either changes what class the colour list is OR adds another list-group element before the colour genes.
    // It's not GOOD, it just WORKS. For now.
    var color_html = document.getElementsByClassName("list-group")[0];
    var color_genes = []
    // Grabbing the colors...
    for (let n = 0; n < 3; n++) {
        color_genes.push(color_wheel.indexOf(color_html.children[n].children[0].children[0].innerHTML))
    }
    // Initializing the variables to store the closest matches
    var closests = []
    var closest = 256
    var dists = []
    for (let c = 0; c < color_wheel.length; c++) {
        // TODO: maybe add a loop here so it looks prettier idfk
        let total_distance = distance(color_genes[0], c) + distance(color_genes[1], c) + distance(color_genes[2], c)
        if (total_distance < closest) {
            closests = [c]
            closest = total_distance
            dists = [[distance(color_genes[0], c), distance(color_genes[1], c), distance(color_genes[2], c)]]
        } else if (total_distance == closest) {
            closests.push(c)
            dists.push([distance(color_genes[0], c), distance(color_genes[1], c), distance(color_genes[2], c)])
        }
    }
    // This is purposefully formatted this way - the actual genes have the color first in bold, then the descriptor. This puts the descriptor first, a colon and then the bold colour so it's distinct from the actual color genes but still visually cohesive. Hopefully.
    // I can't in my right mind not put bold or italics tags as their own elements.
    var center_div = document.createElement("div")
    // i'm so tired i know i do this again down there i dont care
    var tinycolor
    if (black_colors.indexOf(color_wheel[closests[0]]) == -1) {
        tinycolor = "white"
    } else {
        tinycolor = "black"
    }
    center_div.innerHTML = `Easiest Monotone: <b>${color_wheel[closests[0]]}</b><br><div align="center" style="opacity: 0.8; font-size: 9pt; color: ${tinycolor};">${dists[0][0]}-${dists[0][1]}-${dists[0][2]} (${closest * 300}) <img loading="lazy" class="emoji tooltipped" src="https://chicken.pet/sprites/egg_1.png" height="16px" alt="egg emoji" style="margin-right: 2px;" data-bs-title="egg" data-bs-toggle="tooltip" aria-label="egg" data-bs-original-title="egg"></div>`
    // Can you tell I don't know HTML constructor best practices?
    // It took a lot of restraint not to construct these with f-strings.
    var center_field = document.createElement("li")
    center_field.classList.add("colour")
    center_field.classList.add("list-group-item")
    center_field.style.backgroundColor = `#${hex_wheel[closests[0]]}`
    // its 4:30 am i want to go to bed
    if (black_colors.indexOf(color_wheel[closests[0]]) == -1) {
        center_field.style.color = "white"
    } else {
        center_field.style.color = "black"
    }
    center_field.appendChild(center_div)
    // Also, these are literally copied from the existing one and appended to the end, which surprised me that it worked. CJ made an impressively dynamic site!
    color_html.appendChild(center_field)
})();