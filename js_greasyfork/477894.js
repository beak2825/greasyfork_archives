// ==UserScript==
// @name         Neopets Quicklinks
// @version      3.3
// @author       (FORKED FROM) Sebastian Paaske Tørholm, Tombaugh Regio
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/*
// @include      *://neopets.com/*
// @license      MIT
// @description  Adds quick links to Neopets. Works on both the old and new layout. Forked from Eckankar's Neopets Sidebar Quicklinks.
// @downloadURL https://update.greasyfork.org/scripts/477894/Neopets%20Quicklinks.user.js
// @updateURL https://update.greasyfork.org/scripts/477894/Neopets%20Quicklinks.meta.js
// ==/UserScript==

const quicklinks = new Array(
    {name: "Bets", link: "https://www.neopets.com/pirates/foodclub.phtml?type=collect"},
    {name: "Trudy", link: "https://www.neopets.com/trudys_surprise.phtml"},
    {name: "Wish", link: "https://www.neopets.com/wishing.phtml"},
    {name: "Train", link: "https://www.neopets.com/pirates/academy.phtml?type=status"},
    {name: "Bank Interest", link: "https://www.neopets.com/bank.phtml"},
    {name: "Plushie", link: "https://www.neopets.com/faerieland/tdmbgpop.phtml"},
    {name: "Coltzan", link: "https://www.neopets.com/desert/shrine.phtml"},
    {name: "Slorg", link: "https://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes"},
    {name: "Shore", link: "https://www.neopets.com/pirates/forgottenshore.phtml"},
    {name: "Fruit Machine", link: "https://www.neopets.com/desert/fruit/index.phtml"},
    {name: "Wheel of Med", link: "https://www.neopets.com/prehistoric/mediocrity.phtml"},
    {name: "Healing Springs", link: "https://www.neopets.com/faerieland/springs.phtml"},
    {name: "Anchor", link: "https://www.neopets.com/pirates/anchormanagement.phtml"},
    {name: "Danger", link: "https://www.neopets.com/halloween/gravedanger"},
    {name: "Tombola", link: "https://www.neopets.com/island/tombola.phtml"},
    {name: "Puzzle", link: "https://www.neopets.com/community"},
    {name: "Omelette", link: "https://www.neopets.com/prehistoric/omelette.phtml"},
    {name: "Jelly", link: "https://www.neopets.com/jelly/jelly.phtml"},
    {name: "Rubbish", link: "https://www.neopets.com/medieval/rubbishdump.phtml"},
    {name: "Wise King", link: "https://www.neopets.com/medieval/wiseking.phtml"},
    {name: "Grumpy King", link: "https://www.neopets.com/medieval/grumpyking.phtml"},
    {name: "Negg Cave", link: "https://www.neopets.com/shenkuu/neggcave"},
    {name: "Kads", link: "https://www.neopets.com/games/kadoatery/index.phtml"},
    {name: "Kass", link: "https://www.neopets.com/games/game.phtml?game_id=381"},
    {name: "Fash", link: "https://www.neopets.com/games/game.phtml?game_id=805"},
    {name: "Quests", link: "https://www.neopets.com/quests.phtml"},
    {name: "Shop Till", link: "https://www.neopets.com/market.phtml?type=till"},
    {name: "Shop Wizard", link: "https://www.neopets.com/shops/wizard.phtml"}
)

//New layout
if (document.getElementsByClassName("nav-top__2020").length) {
    const sidebarContainer = document.querySelector("#navprofiledropdown__2020")

    //Remove the old sidebar
    sidebarContainer.querySelector("ul").remove()

    //Create new sidebar and copy the styling of the old sidebar
    const newMenu = document.createElement("ul")

    //For each of the quicklinks, create a new list item
    // and append it to the list
    for(const qlink of quicklinks) {
        const newLink = document.createElement("a")
        const newListItem = document.createElement("li")
        const newListTitle = document.createElement("h3")

        newLink.href = qlink.link
        newListTitle.appendChild(document.createTextNode(qlink.name))
        newListItem.appendChild(newListTitle)
        newLink.appendChild(newListItem)
        newMenu.appendChild(newLink)
    }

    //Append the list to the sidebar
    sidebarContainer.appendChild(newMenu)

} else {
    //Old layout

    //Checks for the sidebar with Neofriends
    const nfbox = document.evaluate('//div[contains(@class,"sidebarModule") and descendant::a[contains(@href,"neofriends")]]',
                                    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    //If the sidebar exists, create a new module
    if (nfbox) {
        const qlbox = document.createElement("div")

        qlbox.className = "sidebarModule"

        //Create a new table inside and copy the styling of the existing modules
        const qlboxtable = document.createElement("table")
        const q1tablebody = document.createElement("tbody")

        qlboxtable.border = 0
        qlboxtable.className = "sidebarTable"
        qlboxtable.width = 158
        qlboxtable.cellPadding = 3
        qlboxtable.cellSpacing = 0

        //Table header
        const headertr = document.createElement("tr")
        const headertd = document.createElement("td")

        headertd.className = "sidebarHeader medText"
        headertd.vAlign = "middle"
        headertd.appendChild(document.createTextNode("Quicklinks"))
        headertr.appendChild(headertd)
        q1tablebody.appendChild(headertr)

        // For each of the quicklinks, create a new cell
        // and append it to the body of the table
        for(const qlink of quicklinks) {
            const linkrow = document.createElement("tr")
            const linkcell = document.createElement("td")
            const linka = document.createElement("a")

            linkcell.className = "activePet sf"
            linkcell.align = "center"
            linka.href =  qlink.link
            linka.appendChild(document.createTextNode(qlink.name))
            linkcell.appendChild(linka)
            linkrow.appendChild(linkcell)
            q1tablebody.appendChild(linkrow)
        }

        //Append the table to the module
        qlboxtable.appendChild(q1tablebody)
        qlbox.appendChild(qlboxtable)

        //Append the module to the sidebar
        nfbox.parentNode.insertBefore(qlbox,nfbox.nextSibling)
    }
}