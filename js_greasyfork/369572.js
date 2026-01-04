// ==UserScript==
// @name         Sets price indicator
// @version      0.4
// @description  Telling you if the price of the sets is between the lower price and your maximum price by coloring the gems price (Green is ok, red isn't).
// @author       Zeper
// @match        https://steamlvlup.com/levelup*
// @grant        none
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/369572/Sets%20price%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/369572/Sets%20price%20indicator.meta.js
// ==/UserScript==

///////////////////////////////////
// WHERE THE ACTUAL MAGIC HAPPEN //
///////////////////////////////////
var sets = document.getElementById('calc_sets');
var gems = document.getElementById("calc_gems");
var minprice = 160;
if(localStorage.minprice === undefined) {localStorage.setItem("minprice", minprice);} else {minprice = parseInt(localStorage.getItem("minprice"));}
var maxprice = 200;
if(localStorage.maxprice === undefined) {localStorage.setItem("maxprice", maxprice);} else {maxprice = parseInt(localStorage.getItem("maxprice"));}

function check() {
    var setsvalue = sets.innerHTML;
    var setsprice = Math.round(gems.innerHTML/setsvalue);
    if (setsprice > 0)
    {
        if (setsprice >= minprice && setsprice <= maxprice)
        {
            gems.style = "color: green !important;";
        }
        else
        {
            gems.style = "color: red !important;";
        }
        gems.title = setsprice + " gems per Sets" ;
    } else
    {
        gems.style = "";
    }
}

new MutationObserver(check).observe(sets, { attributes: false, childList: true, subtree: false });

///////////////////////
// BORING GUI STUFF //
//////////////////////
var hf_count_min = document.createElement("INPUT");
hf_count_min.setAttribute("id", "min_price");
hf_count_min.setAttribute("class", "hf_count_title hf_count level_input input_disabled hf_count");
hf_count_min.setAttribute("readonly", "");
hf_count_min.setAttribute("title", "MINIMUM PRICE\nIt's the lowest price of available sets on the website.\n\nDON'T edit this if you don't know what you're doing !\nIf you change it to a wrong value it will cause issue to the script.\n\nIf you still realy want to edit this make an right click on it.\n\nDefault value: 160");
hf_count_min.setAttribute("placeholder", "MIN PRICE");

var hf_count_max = document.createElement("INPUT");
hf_count_max.setAttribute("id", "max_price");
hf_count_max.setAttribute("class", "hf_count_title hf_count level_input hf_count");
hf_count_max.setAttribute("placeholder", "MAX PRICE");
hf_count_max.setAttribute("title", "MAXIMUM PRICE");

var head_frame_count = document.createElement("DIV");
head_frame_count.setAttribute("class", "head_frame_count");
head_frame_count.setAttribute("style", "width: auto;display: inline-flex;");
head_frame_count.appendChild(hf_count_min);
head_frame_count.appendChild(hf_count_max);
document.getElementsByClassName("head_frame_line")[1].appendChild(head_frame_count);

var min_price = document.getElementById("min_price");
var max_price = document.getElementById("max_price");

min_price.value = minprice;
max_price.value = maxprice;

function update() {
    if (parseInt(min_price.value) > 0 && parseInt(max_price.value) >= parseInt(min_price.value)){
        minprice = parseInt(min_price.value);
        localStorage.setItem("minprice", minprice);
        maxprice = parseInt(max_price.value);
        localStorage.setItem("maxprice", maxprice);
        check();
    } else {
        console.warn("Error:\n Min: "+escape(min_price.value)+" \n Max: "+escape(max_price.value)+"\nOne of these value is not a valid number.");
        min_price.value = minprice;
        max_price.value = maxprice;
        alert("Error - Look the console log for more info.");
    }
}

min_price.addEventListener("change", update);
max_price.addEventListener("change", update);

min_price.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    min_price.setAttribute("class", "hf_count_title hf_count level_input hf_count");
    min_price.removeAttribute("readonly");
    return false;
}, false);