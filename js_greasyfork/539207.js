// ==UserScript==
// @name         Exalted Guild Market Search
// @namespace    http://tampermonkey.net/
// @version      2.3.62
// @description  Adds a button that highlights market listings by your guild members. Setting extra members is now available.
// @author       Cascade + Ryaaahs
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539207/Exalted%20Guild%20Market%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/539207/Exalted%20Guild%20Market%20Search.meta.js
// ==/UserScript==

// config //
const userSearch = false; //keep in mind user search is not compatible with Pancake-Scripts. in the process of working it out with pancake.
const customTextColor = '';
const LOG = false;

// code //
const mobileScreenSize = 750;
const maxDisplayedListingsCount = 250;
var guildBtn;
var guildBtnState = "null";
var currentTab = "null";
var backdropState = "null";
var userSearchbar; //if userSearch is on
var guildJson = [];
var getGuildDataTime = 1000 * 5;
var inGuild = false;

window['gms set main group color'] = function(color) {
    console.log('old main group color: ' + safeColor());
    if(CSS.supports('color', color))
        localStorage.setItem('gms main group color', color);
    else {
        localStorage.removeItem('gms main group color');
        console.warn('invalid color "' + color + '". resetting to default')
    }
    console.log('set main group color to: ' + safeColor())
}

window['gms get main group color'] = function(color) {
    console.log('main group color: ' + safeColor());
}

window['gms see members'] = function() {
    console.log('guild members:');
    console.log(JSON.parse(localStorage.getItem('gms guild members')))
}

window['gms see extra members'] = function() {
    console.log('extra members:');
    console.log(JSON.parse(localStorage.getItem('gms extra members')))
}

window['gms clear extra members'] = function() {
    window['gms see extra members']();
    console.log('clearing extra members');
    localStorage.removeItem('gms extra members')
}

//input is array of [group, memberList, color]
window['gms set extra members'] = function(inputObj) {
    const transformedArray = inputObj.map(([group, data, color]) => {
        if(CSS.supports('color', color))
            return { group, data, color };
        else {
            console.warn('invalid color "' + color + '", for more details see this page https://www.w3schools.com/colors/colors_names.asp, or use a hex code like #263849')
            return null;
        }
    });
    localStorage.setItem('gms extra members', JSON.stringify(transformedArray));
    window['gms see extra members']();
}

window['gms help'] =
function() {
    console.log(
    `    members are saved from the guild automatically when you enter the guild page.

    extra members are for guilds that are a composite of multiple guilds.
    to add them, use window['gms set extra members']([['group name', ["Member1", "Member2", "Member3"], 'red']]).
    each guild in the composite guild should be a group, inputted as 'group name'.
    the actual member list is next, inputted as ["Member1", "Member2", "Member3"]
    it should also have a color, inputted as 'red'. this could be any color here https://www.w3schools.com/colors/colors_names.asp
    example with multiple groups: window['gms set extra members']([['Red Group', ["Member1", "Member2"], 'red'], ['Green Group', ["MemberA", "MemberB"], 'green'], ['Blue Group', ["User1", "User2"], '#2e698b']])

    you can also set the color of the main group, which is the guild you are in, with window['gms set main group color']('#2e698b'), or any other color.

    the members and extra members are stored in localStorage.

    to see what actions you can do, type window['gms and it will autocomplete with your options.
    make sure to put the brackets at the end () so it calls the function.

    if you want to copy members from a composite guild easily:
    you can click on the "Members" title in the members section of the guild, which will copy to the clipboard.

    WHEN ADDING MEMBERS, DO CHECK EACH LETTER IS THE CORRECT CASE`
    );}


//jCreate import
function C(t){try{let e=parse(t),s=document.createElement(e.element);return e.parentSelector?document.querySelectorAll(e.parentSelector)[0].appendChild(s):document.body.appendChild(s),e.textContent&&(s.textContent=e.textContent),e.id&&(s.id=e.id),e.style&&(s.style=e.style),e.classes&&e.classes.split(" ").forEach(t=>{s.classList.add(t)}),e.attributes&&e.attributes.split(",").forEach(t=>{let e=t.split(":"),r=e[0].trim(),l=e[1].trim();s.setAttribute(r,l)}),s}catch(r){console.error("Error creating element: "+r)}}const sub=(t,e)=>t.split("").find(t=>e.includes(t))?t.split("").slice(0,t.split("").findIndex(t=>e.includes(t))).join(""):t;function parse(t){let e={"@":"parentSelector","#":"id",":":"textContent","*":"style","%":"classes","&":"attributes"},s={};return s.element=sub(t,Object.keys(e)).trim(),Object.entries(e).forEach(([e,r])=>{let l=RegExp(`\\${e}<([^>]*)>`),n=t.match(l);n&&(s[r]=n[1])}),s}

function safeColor(){
    let itm = localStorage.getItem('gms main group color');
    if(itm && itm != null){
        return itm;
    } else return 'seagreen'
}

async function getGuildData() {
    const url = "https://ryaaahs.github.io/exalted_api/guild.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        getGuildDataTime = (1000 * 60 * 60 * 6) // 6 hours
        guildJson = json;
    } catch (error) {
        console.error(error.message);
    } finally {
        setTimeout(getGuildData, getGuildDataTime)
    }
}

function handleNavigation() {
    if (window.location.href.indexOf("market") != -1){
        enterMarket();
    }
    if (window.location.href.indexOf("guild") != -1){
        enterGuild();
    } else {
        inGuild = false;
    }
}

function enterMarket(onlyOnce = false){
    if($('#GMS-Tab').length > 0) return;

    let Q = $('market-listings-component').find('button:Contains("Date")').first().closest('div');
    if(Q.length <= 0){
        if(onlyOnce) return;
        wait(50).then(enterMarket);
        return;
    }
    let dateTab = $('market-listings-component').find('button:Contains("Date")').first()[0];
    let cont = Q[0];
    //guildBtn = document.createElement('button');
    //guildBtn.textContent = "Guild";
    //guildBtn.id = 'GMS-Tab'

    guildBtn = C('button #<GMS-Tab> :<Guild>')
    guildBtn.toggleAttribute(yoinkGameAttributeName(dateTab));
    guildBtn.addEventListener('click', guildFilterClicked);

    //When you clear search with button, sync guild filter
    $('market-listings-component').find('button.clear-button').first()[0].removeEventListener('click', clearGuildFilter);
    $('market-listings-component').find('button.clear-button').first()[0].addEventListener('click', clearGuildFilter);

    //When you make a search, sync guild filter
    $('market-listings-component').find('input[placeholder*="Search listings"]').first()[0].removeEventListener('input', clearGuildFilter);
    $('market-listings-component').find('input[placeholder*="Search listings"]').first()[0].addEventListener('input', clearGuildFilter);

    //When you switch tabs from buy/orders/listings, sync guild filter
    $('market-listings-component').find('div.tabs').first().find('button').toArray().forEach((elem) => {
        elem.removeEventListener('click', clearGuildFilter)
        elem.addEventListener('click', clearGuildFilter)
    });

    //When you switch tabs from date/item/price, and listings are over 250, sync guild filter
    Q.find('button').toArray().forEach((elem) => elem.addEventListener('click',
    () => {
        if(listingsCount() > maxDisplayedListingsCount){
            clearGuildFilter();
        }
    }));

    cont.appendChild(guildBtn);

    var sort_container = $('market-listings-component').find('div.container')[0];
    if ($(window).width() < mobileScreenSize) {
        sort_container.style.display = "block";
        if ($(window).width() <= 399) {
            sort_container.style.width = "40%";
            sort_container.style.flex = "";
        } else {
            sort_container.style.width = "20%";
        }

        for (let i = 0; i < sort_container.children.length; i++) {
            sort_container.children[i].style.margin = "0";
            sort_container.children[i].style.flexGrow = "0";
            sort_container.children[i].style.minWidth = "100%";
            if (i != 0) {
                sort_container.children[i].style.borderTop = "1px solid #263849"
            }
        }
    }

    //? C('button @<div.container> #<submitButton> :<Submit> *<display: flex;> %<myButton myClass> &<name:Button,disabled:true>');
    if(userSearch){
        userSearchbar = C(`input
                              @<div.search>
                              *<text-align:right; padding-right:20px; max-width: 200px; border-left: 1px solid #263849>
                              #<GMS-Usersearch>
                              &<type:text,placeholder:Search users,autocomplete:off,autocorrect:off,autocapitalize:off,spellcheck:false>`)
        userSearchbar.toggleAttribute(yoinkGameAttributeName(dateTab));
        userSearchbar.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                userSearchCheck();
                event.preventDefault();
            }
        });
    }
}

function guildFilterClicked(){
    if(guildBtn.classList.contains('sort-active')){
        clearGuildFilter()
        guildBtnState = ""
        localStorage.setItem('guildButtonState', "") //save member list to public local storage, encrypted
    } else {
        guildBtn.classList.add('sort-active');
        guildBtnState = "active";
        localStorage.setItem('guildButtonState', "active")
        // add member highlights
        syncFilter();
    }
}

function clearGuildFilter(){
    getListingElems().forEach((elem) => {
        if (elem.classList.contains('guildListing')) {
            let name_ele = "";

            elem.classList.remove('guildListing');
            
            name_ele = elem.getElementsByClassName("name")[0];
            if (name_ele.innerText.includes(":")) {
                name_ele.innerText = name_ele.innerText.substring(name_ele.innerText.indexOf(":") + 2);
            }
        }
    })
    guildBtn.classList.remove('sort-active');

    if(userSearch){
        if(userSearchbar.value.length > 0){
            userSearchbar.value = "";
            userSearchCheck();
        }
    }
}

async function userSearchCheck(){
    let searched = userSearchbar.value.toLowerCase();
    let accurate = false;
    let searchedSelf = (searched === "@");

    if(searched.charAt(0) === "@") {
        searched = searched.substr(1);
        accurate = true;
    }

    let listingBtns = getListingElems();
    for (const listingBtn of listingBtns) {
        if(listingBtn.disabled){
            listingBtn.style = searchedSelf ? "display: flex !important;" : "display: none !important;";
            continue;
        } else {
            if(searchedSelf) {
                listingBtn.style = "display: none !important;";
                continue;
            }
        }
        listingBtn.click();
        let name = await eachListing();
        if(!accurate) {
            listingBtn.style = !searched.includes(name.toLowerCase()) && (searched) ? "display: none !important;" : "display: flex !important;";
        }
        if(accurate) {
            listingBtn.style = searched != name.toLowerCase() && (searched) ? "display: none !important;" : "display: flex !important;";
        }
    }
    let query = $('market-listings-component').find('div.sticky').first().find('button.close');
    if(query.length > 0)
        query[0].click();

}

function findGroupByMember(groupMap, member) {
    for (let [group, [memberSet, color]] of groupMap) {
        if (memberSet.has(member)) {
            return {group: group, color: color}; // the group & color
        }
    }
    return null; // the member is not found in any group
}

async function syncFilter() {
    let listingBtns = getListingElems();
    let memberGroups = getMembers();

    const map = new Map();
    memberGroups.forEach(({ group, data, color }) => {
        map.set(group, [new Set(data), color]);
    });

    for (const listingBtn of listingBtns) {
        let button_disabled_state = false;

        if (listingBtn.disabled){
            listingBtn.disabled = false;
            button_disabled_state = true;
        }

        listingBtn.click();
        let name = await eachListing();
        let info = findGroupByMember(map, name);

        if (info) { //member is in a group
            let name_ele = "";
            let gname = "";

            if (!listingBtn.classList.contains('guildListing')) listingBtn.classList.add('guildListing');
            listingBtn.style = "--gmsbackgroundColor: " + info.color;

            name_ele = listingBtn.getElementsByClassName("name")[0];
            if (!name_ele.innerText.includes(name)) {
                switch(info.group) {
                    case "Rift":
                        gname = "(R)";
                    break;
                    case "ExaltedCrafts":
                        gname = "(EC)";
                    break;
                    case "ExaltedCats":
                        gname = "(ECat)";
                    break;
                    case "ExaltedPizza":
                        gname = "(EP)";
                    break;
                    case "Flipper":
                        gname = "(F)";
                    break;
                }

                if ($(window).width() < mobileScreenSize) {
                    name_ele.innerHTML = `${gname}[<strong style=\"color:orange\">${name}</strong>] ` + name_ele.innerText;
                } else {
                    name_ele.innerHTML = `<span class="gms-prefix-name">${gname}[<strong style=\"color:orange\">${name}</strong>]</span><span class="gms-prefix-amount">${name_ele.innerText}</span>`;
                }

                name_ele.style.color = "white";
            }
        } else {
            let name_ele = "";

            name_ele = listingBtn.getElementsByClassName("name")[0];

            if (!name_ele.innerText.includes(name)) {
                if ($(window).width() < mobileScreenSize) {
                    name_ele.innerHTML = `[<strong style=\"color:orange\">${name}</strong>] ` + name_ele.innerText;
                } else {
                    name_ele.innerHTML = `<span class="gms-prefix-name">[<strong style=\"color:orange\">${name}</strong>]</span><span class="gms-prefix-amount">${name_ele.innerText}</span>`;
                }

                name_ele.style.color = "white";
            }
        }

        if (button_disabled_state){
            listingBtn.disabled = true;
            button_disabled_state = false;
        }
    }


    if ($(window).width() < mobileScreenSize) {
        if($('market-listings-component').find('div.wrapper').length == 1) {
            $('market-listings-component').find('div.wrapper').first().find('button.close')[0].click();
        }
    } else {
        if ($('market-listings-component').find('div.preview').length == 1) {
            $('market-listings-component').find('div.preview').find('button.close')[0].click();
        }
    }

}

async function eachListing(){
    let Q = "";
    if ($(window).width() < mobileScreenSize) {
        Q = $('market-listings-component').find('div.wrapper').first().find('span:contains("Seller")').closest('div')[0];
    } else {
        Q = $('market-listings-component').find('div.sticky').first().find('span:contains("Seller")').closest('div')[0];
    }


    if(Q){
        return Q.childNodes[1].textContent.trim();
    } else {
        let P = "";
        if ($(window).width() < mobileScreenSize) {
            P = $('market-listings-component').find('div.wrapper').first().find('span:contains("Buyer")').closest('div')[0];
        } else {
            P = $('market-listings-component').find('div.sticky').first().find('span:contains("Buyer")').closest('div')[0];
        }

        if(P){
            return P.childNodes[1].textContent.trim();
        } else {
            if(LOG){
                console.warn('[Guild Market Search] Cannot find seller or buyer, searching again in 10ms');
            }
            await sleep(10);
            return eachListing();
        }
    }

}

async function copyGuildMembers(){
    let q = $('guild-page').find('div.name:contains("Members")').first().closest('div.card').find('button.row').find('div.name').find('div:first').toArray();
    if(q.length <= 0) return;

    await navigator.clipboard.writeText(`['${q.map((d) => d.textContent).join("', '")}']`);
    $('guild-page').find('div.name:contains("Members")').first()[0].textContent = "Members [Copied]";
}

function listingsCount(){
    let countText = $('market-listings-component')
    .find('div.card')
    .first()
    .find('div.count:first')
    .text()
    .trim();

    // Extract numeric value from "1.9K Listings" or "1,936 Listings"
    let count;
    if (countText.includes('K')) {
        let match = countText.match(/(\d+(\.\d+)?)/);
        count = match ? parseFloat(match[1]) * 1000 : 0;
    } else {
        let match = countText.match(/[\d,]+/);
        count = match ? parseInt(match[0].replace(/,/g, '')) : 0;
    }

    if(countText.includes('/')) {
        return "null";
    }

    return count;
}

function getListingElems(){
    return $('market-listings-component').find('div.card').first().closest('div.card').find('button.row').toArray();
}

function enterGuild(){
    //for copying members
    let Q = $('guild-page').find('div.name:contains("Members")').first();
    if(Q.length > 0){
        Q[0].removeEventListener('click', copyGuildMembers);
        Q[0].addEventListener('click', copyGuildMembers);
    }

    if(inGuild === true) {return;}
    else inGuild = true;

    let membersQ = $('guild-page').find('div.name:contains("Members")').first().closest('div.card').find('button.row').find('div.name').find('div:first').toArray();
    if(membersQ.length <= 0){
        inGuild = false;
        wait(50).then(enterGuild);
        return;
    }
    let membersArray = membersQ.map((d) => d.textContent);


    localStorage.setItem('gms guild members', JSON.stringify(membersArray)) //save member list to public local storage, encrypted
    if(LOG){
        console.log('[Guild Market Search] Guild member list saved: ' + JSON.stringify(membersArray))
    }

}

function getMembers(){
    let g = localStorage.getItem('gms guild members'); //get member list from localStorage
    let e = guildJson;

    if(g){
        let p;
        if(e){
            let main = {group: 'main', data: JSON.parse(g), color: safeColor()};
            let additional = e;
            additional.push(main);
            p = additional; // all groups
        }
        else p = [{group: 'main', data: JSON.parse(g), color: safeColor()}]; // else just an array with the main group
        if(LOG){
            console.log('[Guild Market Search] Successfully obtained member list.');
            console.log(p);
        }
        return p;
    } else {
        if(LOG)
            console.warn('[Guild Market Search] Member list was not found');
        return [];
    };
}

function yoinkGameAttributeName(elem){for (let i = 0; i < elem.attributes.length; i++){if(elem.attributes[i].nodeName.includes('_ngcontent-')){return elem.attributes[i].nodeName;}}}

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))}

function wait(delay) {  return new Promise((resolve, reject) => {    setTimeout(() => {      resolve();    }, delay);  });}

getGuildData();

wait(1000).then(() => {
    $('div.scroll.custom-scrollbar').find('div.name:contains("Market")').closest('button')[0].addEventListener('click', handleNavigation);
    $('div.scroll.custom-scrollbar').find('div.name:contains("Guild")').closest('button')[0].addEventListener('click', handleNavigation);
})
// window.navigation found dead in a ditch

setInterval(handleNavigation,1000);

setInterval(() => {
    var limit_warning = document.getElementsByClassName("market-listing-limit-warning")[0];
    if (limit_warning != null) {
        if(limit_warning.width != 0) {
            limit_warning.width = 0;
        }
    }
}, 500)

setInterval(() => {
    //check if the guild filter exists
    if(window.location.href.indexOf("market") != -1 && !document.getElementById('GMS-Tab')){
        //if not, recreate the UI and stuff
        enterMarket(true);
    }
}, 2000)

// Phone UI updates
setInterval(() => {
    var sort_container = $('market-listings-component').find('div.container')[0];
    var listings = $('market-listings-component').find('button.right').first()[0];
    var active = $('market-listings-component').find('button.tab-active').first()[0];
    var backdrop = $('market-listings-component').find('div.backdrop').first()[0];

    // When we change tabs on mobile
    if (currentTab == "null" && active) {
        currentTab = active.innerText;
    }

    if (guildBtnState == "null") {
        guildBtnState = localStorage.getItem('guildButtonState');
    }

    // When we open an item on mobile
    if (backdropState == "null" && backdrop != undefined) {
        backdropState = true;
    }

    if(window.location.href.indexOf("market") != -1) {
        // Sort Container
        if(listingsCount() > maxDisplayedListingsCount && listings.classList.contains("tab-active") != true) {
            if ($(window).width() < mobileScreenSize) {
                sort_container.style.display = "block";
                if ($(window).width() <= 399) {
                    sort_container.style.width = "40%";
                    sort_container.style.flex = "none";
                } else {
                    sort_container.style.width = "20%";
                }

                for (let i = 0; i < sort_container.children.length; i++) {
                    sort_container.children[i].style.margin = "0";
                    sort_container.children[i].style.flexGrow = "0";
                    sort_container.children[i].style.minWidth = "100%";
                    if (i != 0) {
                        sort_container.children[i].style.borderTop = "1px solid #263849"
                    }
                }
            }
        } else if(listingsCount() != 0) {
            if ($(window).width() < mobileScreenSize) {
                sort_container.style = "";

                for (const children of sort_container.children) {
                    children.style = "";
                }
            }
        }

        // Guild Toggle
        if(guildBtn) {
            // If we switch tabs or open the backdrop, we need to reapply the css to the items
            if ($(window).width() < mobileScreenSize && (guildBtnState == "active" && guildBtn.classList[0] == "sort-active")) {
                if (currentTab != active.innerText || backdropState && backdrop == undefined) {
                    guildBtn.className = "";
                    currentTab = active.innerText;
                    backdropState = false;
                }
            }

            if ((guildBtnState == "active" && guildBtn.classList[0] != "sort-active") && listingsCount() != "null") {
                setTimeout(() => {
                    guildFilterClicked();
                }, 350);
            }
        }
    }
}, 500)

setTimeout(function() {
  //super dark #061a2e
  //dark #0d2234
  //regular #162b3c
  //light #1c2f40
    var css = `
       :root {
          --gmscustomTextColor: "";
       }
        .guildListing{
           background-color: var(--gmsbackgroundColor);
           color: var(--gmscustomTextColor);
           transition: 0.1s ease;
        }
        .guildListing:hover{
           background-color: color-mix(in srgb, var(--gmsbackgroundColor) 50%, #0d2234 50%);
           color: inherit;
        }

        .gms-prefix-name {
           display: inline-block;
           width: 200px;        /* adjust until aligned */
           white-space: nowrap;
        }

        .gms-prefix-amount {
           display: inline-block;
           width: 275px;        /* adjust until aligned */
           white-space: nowrap;
        }
        `;

    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(style);
}, 0);