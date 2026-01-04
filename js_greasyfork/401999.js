// ==UserScript==
// @name         PropertyPalAtron
// @namespace    PropertyPalAtron
// @version      0.11
// @description  Turns the "favourite" button into a "don't show me this house again" button
// @author       TonyJayBoy
// @match        https://www.propertypal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401999/PropertyPalAtron.user.js
// @updateURL https://update.greasyfork.org/scripts/401999/PropertyPalAtron.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function observeDOM(callback){
        var mutationObserver = new MutationObserver(function(mutations) { //https://davidwalsh.name/mutationobserver-api
            mutations.forEach(function(mutation) {
                callback(mutation)
            });
        });
        // Keep an eye on the DOM for changes
        mutationObserver.observe(document.body, { //https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ["class"] // We're really only interested in stuff that has a className
        });
    }
function run(){
    console.log("This is running...");
    // get all li
    var the_list = document.getElementsByClassName('boxlist')[3];
    the_list.setAttribute("id", "list_of_houses");
    var all_entries = the_list.getElementsByTagName("li");

    console.log("Finding all entries...");

    var list_of_items_to_delete = [];

    for (let i=0; i < all_entries.length; i++ ){

        var current_a_links = all_entries[i].getElementsByTagName('a');
        if(current_a_links.length >= 1){
            all_entries[i].classList.add("is_a_house_ok");
            console.log("link below:");
            console.log(current_a_links[0]);
            if(current_a_links[0].classList.contains('is-fav')){
                console.log("FOUND ONE!");
                var parentParentElement = current_a_links[0].parentElement.parentElement;
                var the_id = "to_delete_"+i;
                parentParentElement.setAttribute("id", the_id)
                console.log(the_id);
                list_of_items_to_delete.push(parentParentElement.id);
            }
        }
    }
    for (let i = 0; i < list_of_items_to_delete.length; i++) {
            document.getElementById(list_of_items_to_delete[i]).remove();
        }

    var target_area = document.getElementsByClassName('pgheader-currentpage')[0];
    var no_in_list = the_list.querySelectorAll(".is_a_house_ok").length;
    target_area.getElementsByTagName("em")[0].innerHTML = no_in_list;
}

    observeDOM(doDomStuff);
    function doDomStuff(mutation){
        if (mutation.target.className.includes("sr-widecol") || mutation.target.className.includes("fav")){
            console.log("Notice mutation");
            run();
        }

    }
    run();
})();