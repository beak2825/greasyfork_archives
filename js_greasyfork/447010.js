// ==UserScript==
// @name         DCD Searchscript
// @namespace    https://github.com/markus-leben/DCD-Chrome-Advanced-Search/
// @version      1.0.1
// @description  A script designed to be used with Chrome Site Search to allow you to use the full Diamond Comics advanced search from your address bar
// @author       Markus Leben
// @match        https://retailerservices.diamondcomics.com/Reorder/Reorder?start=tabContentItemSearch?tmpayload=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diamondcomics.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447010/DCD%20Searchscript.user.js
// @updateURL https://update.greasyfork.org/scripts/447010/DCD%20Searchscript.meta.js
// ==/UserScript==

let cururl = window.location.href;
let payload = decodeURIComponent(cururl.replace("https://retailerservices.diamondcomics.com/Reorder/Reorder?start=tabContentItemSearch?tmpayload=", "")).split("+");
let search_dict = {};

const term_dict = { //might've gone a little hog wild with the term shortening. Scryfall card golf might've given me a brain worm.
    "artist":"a",
    "coverartist":"ca",
    "writer":"w",
    "batch":"bat",
    "previews":"bat",
    "category":"cat",
    "brand":"bra",
    "genre":"gen",
    "before":"bef",
    "beforedate":"bef",
    "after":"aft",
    "afterdate":"aft",
}

const search_term_id_dict = { //used for setting the functional parts of filling each bit of the forms
    //search words
    "searchwords":{"action":"set", "locator":"getElementById", "element_trait":"SearchWords"},
    //category
    "cat":{"action":"checkbox", "locator":"getElementsByName", "element_trait":"Category"},
    //batch (i.e. previews it was in)
    "bat":{"action":"dropdown","locator":"getElementById", "element_trait":"SelectedBatch"}, //apparently batch codes are case insensitive, maybe I won't have to do text manip at all
    //vendor
    "v":{"action":"set", "locator":"getElementById", "element_trait":"VendorName"},
    //vendor item no-- TBH I have no idea what this is or where vendors would list their internal item numbers
    "vno":{"action":"set", "locator":"getElementById", "element_trait":"VendorIdNo"},
    //brand code, TODO: Build serious translation dictionaries for brand code search terms
    "bra":{"action":"dropdown","locator":"getElementById", "element_trait":"ddlEnteredFamily"},
    //genre code, TODO: Build serious translation dictionaries for genre code search terms T-T
    "gen":{"action":"dropdown","locator":"getElementById", "element_trait":"ddlGenreCode"},
    //date stuff goes here
    "aft":{"action":"date","locator":"getElementById", "element_trait":"ReleasedAfterDate"},
    "bef":{"action":"date","locator":"getElementById", "element_trait":"ReleasedBeforeDate"},
    //note: separating artist, writer, and cover into 3 separate creater fields here. possible TODO: come up with more complex way to parse creators
    //artist, but really just creator 1
    "a":{"action":"set", "locator":"getElementById", "element_trait":"CreatorName"},
    //cover artist, but really just creator 2
    "ca":{"action":"set", "locator":"getElementById", "element_trait":"CreatorName2"},
    //writer, but really just creator 3
    "w":{"action":"set", "locator":"getElementById", "element_trait":"CreatorName3"}, //shame on them for not counting by zero
};

const cat_dict = {
    "all": [],
    "comics": [],
    "graphic novels/trade paperbacks": [
        "graphic novels", "gns", "trade paperbacks", "tps"],
    "magazines": ["zines"],
    "books": [
        "light novels", "lns"],
    "games": [
        "board games", "puzzles", "rpgs"],
    "trading cards": [
        "card games", "cards", "tcgs", "ccgs", "sports cards", "collectible cards"],
    "novelties: comic": [], //might wanna put things into both of the novelties arrs in the future
    "novelties: non-comic": [],
    "apparel": [
        "clothes", "shirts", "hats", "clothing"],
    "toys and models": [
        "afs", "action figures", "models", "toys", "figs", "statues", "dolls"],
    "supplies: cards": [
        "sleeves", "deckboxes"],
    "supplies: comics": [],
    "retailer sales tools": [
        "fcbd", "previews"],
    "diamond publications": [],
    "posters": [],
    "audio/visual products": [],
}

const text_manip_dict = { //dictionary of terms to do text manipulation on prior to feeding in
}

for (const i of payload){ //not sure how loops affect scope, not looking to mess around right now
    var keyval = i.split(":");
    if (keyval.length == 1){
        keyval = ["searchwords",keyval[0]];
    }
    else if(keyval[0].toLowerCase() in term_dict){ //possible I should sanitize this in general, unsure rn
        keyval[0] = term_dict[keyval[0]];
    }

    if (!(keyval[0] in search_dict)){
        search_dict[keyval[0]] = keyval[1];
    }
    else{
        search_dict[keyval[0]] = search_dict[keyval[0]] + " " + keyval[1];
    }
}
console.log(JSON.stringify(search_dict))

//clear fields
document.getElementsByClassName("clearSearchFields")[0].click();


for (const key in search_term_id_dict){
    if (key in search_dict){
        console.log(JSON.stringify(search_term_id_dict[key].action))
        if (search_term_id_dict[key].action == "set"){
            console.log(JSON.stringify(search_term_id_dict[key].locator));
            console.log(JSON.stringify(search_dict[key]));
            document[search_term_id_dict[key].locator](search_term_id_dict[key].element_trait).value = search_dict[key];
        }
        if (search_term_id_dict[key].action == "dropdown"){
            let kid = document[search_term_id_dict[key].locator](search_term_id_dict[key].element_trait).children.item(0);
            console.log(JSON.stringify(kid));
            let repl_content = kid.textContent
            let repl_value = kid.value
            kid.textContent = search_dict[key];
            kid.value = search_dict[key].toUpperCase();
            var option = document.createElement("option");
            option.textContent = repl_content
            option.value = repl_value
            kid.parentElement.insertBefore(option, kid)

        }
        if (search_term_id_dict[key].action == "date"){
            let date = search_dict[key]
            date = date.split("/") //should I make dash separated dates work too? e.g. 9-24-93
            if (date[0].length < 2){
                date[0] = "0" + date[0]
            }
            if (date[1].length < 2){
                date[1] = "0" + date[1]
            }
            if (date[2].length < 4){
                if (parseInt(date[2]) < 95){ //the earliest diamond code you can look up is in 1995, hence this border
                    date[2] = "20" + date[2] //if you're still using this code in 2095, my grandchildren will come beat you up
                }
                else {
                    date[2] = "19" + date[2]
                }
            }
            date = date.join("/")
            console.log(JSON.stringify(search_term_id_dict[key].locator));
            console.log(JSON.stringify(search_dict[key]));
            document[search_term_id_dict[key].locator](search_term_id_dict[key].element_trait).value = date;
        }
        if (search_term_id_dict[key].action == "checkbox"){
            let boxes = document[search_term_id_dict[key].locator](search_term_id_dict[key].element_trait);
            boxes[0].click();
            for (const box of boxes){
                console.log(JSON.stringify(box.nextElementSibling.textContent.toLowerCase()));
                console.log(JSON.stringify(cat_dict[box.nextElementSibling.textContent.toLowerCase()]));
                if (box.nextElementSibling.textContent.toLowerCase() == search_dict[key].toLowerCase()||
                    box.nextElementSibling.textContent.toLowerCase() == search_dict[key].toLowerCase()+'s'||
                    cat_dict[box.nextElementSibling.textContent.toLowerCase()].includes(search_dict[key].toLowerCase())||
                    cat_dict[box.nextElementSibling.textContent.toLowerCase()].includes(search_dict[key].toLowerCase() + 's')){

                    box.click();
                }
            }
        }
    }
};

//click search button
document.getElementById("btnSearch").click();
