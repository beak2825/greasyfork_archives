// ==UserScript==
// @name         Neopets Shortcuts on Steroids
// @version      1.1
// @description  The Neopets' site navigation is pretty unintuitive. This streamlines and gives you quick access to the most important things in all the new pages.
// @author       darknstormy
// @match        *://*.neopets.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1328929
// @downloadURL https://update.greasyfork.org/scripts/501384/Neopets%20Shortcuts%20on%20Steroids.user.js
// @updateURL https://update.greasyfork.org/scripts/501384/Neopets%20Shortcuts%20on%20Steroids.meta.js
// ==/UserScript==

function createShortcutIcon(link, iconUrl, cssClasses) {
    var htmlForIcon = "<div style=\"display: inline-block;\"><img style=\"height: 30px; width: 30px;\" class=\"" + cssClasses + "\" src=\"" + iconUrl + "\"/></div>"

    var addedIcon = document.createElement('a')
    addedIcon.href = link
    addedIcon.innerHTML = htmlForIcon

    return addedIcon
}


function createMenuLink(link,icon,text) {
   return "<a href=\"/" + link + "\"><li data-url=\"/" + link + "\"><div style=\"display: flex; align-items: center;\"><img style=\"height: 35px; width: 40px; margin-right:12px;\" src=\"" + icon + "\"/>" + text +"</div></li></a>"
}


function replaceDrawerMenu() {
    var petsHome = createMenuLink("home/index.phtml", "https://images.neopets.com/themes/h5/constellations/images/mypets-icon.svg", "My Pets");
    var quickRef = createMenuLink("quickref.phtml", "https://images.neopets.com/themes/h5/constellations/images/profile-icon.svg", "Quick Ref");
    var custom = createMenuLink("customise.phtml", "https://images.neopets.com/themes/h5/constellations/images/customise-icon.svg", "Customization");
    var stylingChamber = createMenuLink("stylingchamber", "https://images.neopets.com/themes/h5/constellations/images/chamber-icon.svg", "Styling Chamber");
    var createPet = createMenuLink("reg/page4.phtml", "https://images.neopets.com/themes/h5/constellations/images/createpet-icon.svg", "Create a Pet");
    var adopt = createMenuLink("pound", "https://images.neopets.com/themes/h5/constellations/images/adoptpet-icon.svg", "Adopt a Pet");
    var signOut = createMenuLink("logout.phtml", "https://images.neopets.com/themes/h5/constellations/images/signout-icon.svg", "Sign Out")

    // optional: if you wanted to add other links...

    // var sdb = createMenuLink("safetydeposit.phtml", "https://images.neopets.com/themes/h5/constellations/images/safetydeposit-icon.svg", "Safety Deposit Box");
    // var quickStock = createMenuLink("quickstock.phtml", "https://images.neopets.com/themes/h5/constellations/images/quickstock-icon.svg", "Quick Stock");
    // newMenuHtml += sdb;
    // newMenuHtml += quickStock;

    var newMenuHtml = petsHome + quickRef + custom + stylingChamber + createPet + adopt + signOut

    var clock = document.getElementsByClassName("nav-profile-dropdown-clock__2020")[0]

    if (clock != null) {

        var newMenu = document.createElement('ul');
        newMenu.innerHTML = newMenuHtml;
        clock.parentNode.insertBefore(newMenu, clock.nextSibling);

        // Nix the old menu items. They're just bloating the page.
        $("#navprofiledropdown__2020 ul:last").hide()
    }
}

function addCss() {
       document.head.appendChild(document.createElement("style")).innerHTML = `
        .shortcut {
            margin-left: 8px;
        }`

}

function addLinks() {
    addCss()

    var shortcutToolbar = document.getElementsByClassName("navsub-left__2020")[0]

    if (shortcutToolbar) {
        // Create an icon for inventory for the quick links in the top bar
        shortcutToolbar.appendChild(createShortcutIcon("https://www.neopets.com/inventory.phtml", "https://images.neopets.com/themes/h5/hauntedwoods/images/inventory-icon.svg", "shortcut"))

        // Do the same for SDB
        shortcutToolbar.appendChild(createShortcutIcon("https://www.neopets.com/safetydeposit.phtml", "https://images.neopets.com/themes/h5/constellations/images/safetydeposit-icon.svg", "shortcut"))

        // Last is Quick Stock
        shortcutToolbar.appendChild(createShortcutIcon("https://www.neopets.com/quickstock.phtml", "https://images.neopets.com/themes/h5/constellations/images/quickstock-icon.svg", "shortcut"))
    }
}

addLinks()
replaceDrawerMenu()