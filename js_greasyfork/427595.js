// ==UserScript==
// @name         Neopets Quicklinks
// @version      1.3
// @author       Sebastian Paaske Tørholm, Tombaugh Regio
// @namespace    https://greasyfork.org/users/780470
// @include      *://www.neopets.com/*
// @include      *://neopets.com/*
// @license      MIT
// @description  Adds quick links to Neopets. Works on both the old and new layout. Forked from Eckankar's Neopets Sidebar Quicklinks.
// @downloadURL https://update.greasyfork.org/scripts/427595/Neopets%20Quicklinks.user.js
// @updateURL https://update.greasyfork.org/scripts/427595/Neopets%20Quicklinks.meta.js
// ==/UserScript==

const quicklinks = new Array(
    {name: "Inventory", link: "http://www.neopets.com/quickstock.phtml"},
    {name: "Safety Deposit Box", link: "http://www.neopets.com/safetydeposit.phtml"},
    {name: "Item Lookup", link: "https://items.jellyneo.net/search/?name_type=3&sort=5"},
    {name: "Shop Wizard", link: "http://www.neopets.com/shops/wizard.phtml"},
    {name: "Bank", link: "http://www.neopets.com/bank.phtml"},
    {name: "My Shop", link: "http://www.neopets.com/market.phtml?type=your"},
    {name: "Auction Bids", link: "http://www.neopets.com/auctions.phtml?type=leading"},
    {name: "Trading Post", link: "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=20"},
    {name: "Battledome", link: "http://www.neopets.com/dome/neopets.phtml"}
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