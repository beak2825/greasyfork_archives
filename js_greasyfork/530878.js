// ==UserScript==
// @name        Jegged-Tooltips
// @description Adds tooltips to Jegged game gudies.
// @version 1.4
// @license GPL-3.0-or-later
// @include http://jegged.com/*
// @include https://jegged.com/*
// @run-at document-end
// @namespace https://greasyfork.org/users/115055
// @downloadURL https://update.greasyfork.org/scripts/530878/Jegged-Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/530878/Jegged-Tooltips.meta.js
// ==/UserScript==

let HOLD_TOOLTIP = false;
let CURRENT_LINK_TARGET = null;

function showCardTooltip(card, elem, x, y) {
    removeCardTooltip();
    
    let tooltip = document.createElement("div");
    const margin = 10;
    const maxWidth = 650;
    
    let left = x;
    let top = y + window.scrollY;
       
    tooltip.id = "JeggedTooltip";
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = 500;

    tooltip.style.maxWidth = `${maxWidth}px`;
    tooltip.style.marginTop = `${margin}px`;
    tooltip.style.marginBottom = `${margin}px`;
    tooltip.style.marginRight = `${margin}px`;
    tooltip.style.marginLeft = `${margin}px`;
            
    card.style.marginTop = 0;
    card.style.marginBottom = 0;
       
    tooltip.append(card); 
    document.body.append(tooltip);
  
    const elemRect = elem.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let headerHeight;
    
    const headerElem = document.getElementById("header");
    if (headerElem !== null) {
        headerHeight = headerElem.getBoundingClientRect().height;
    } else {
        headerHeight = 0;
    }
    
    // if destination position goes beyond viewport width, clamp position
    // within viewport or at 0
    if (x + tooltipRect.width + (margin*2) > window.innerWidth) {
        left = Math.max(window.innerWidth - tooltipRect.width - (margin*2), 0)
    }

    // never cover target element with tooltip
    if (y < elemRect.top + elemRect.height + window.scrollY) {
        top = elemRect.top + elemRect.height + window.scrollY;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    
    // if destination position goes beyond viewport height, 
    // and tooltip fits above elem, display above elem
    if (top + tooltipRect.height + (margin*2) > window.scrollY + window.innerHeight) {
        if (elemRect.top - tooltipRect.height - (margin*2) - headerHeight >= 0) {
            top = window.scrollY + elemRect.top - tooltipRect.height - (margin*2);
        }    
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function removeCardTooltip() {
    const tooltip = document.getElementById("JeggedTooltip");
    if (tooltip) {
        tooltip.remove();        
    }
}

async function onMouseEnterLink(event) {
    CURRENT_LINK_TARGET = event.target;
    const href = event.target.href;
    const url = URL.parse(href);
    
    if (url.origin !== window.location.origin) {
        // only follow same-origin links
        return;
    }
    
    if (url.hash === "") {
        // only follow anchor links 
        return;   
    }
    
    
    let x = event.x;
    let y = event.y;
    
    const onMouseMove = (e) => {
        x = e.x;
        y = e.y;
    }
    
    // keep latest cursor position for when tooltip content is ready
    document.addEventListener("mousemove", onMouseMove);
    
    try {
        const r = await fetch(url)
        if (!r.ok) {
          throw new Error(`Response status: ${r.status}`);
        }

        const text = await r.text();

        const parser = new DOMParser();
        const page = parser.parseFromString(text, "text/html");

        const destination = page.getElementById(url.hash.slice(1));
        if (destination === null) {
            throw new Error(`Destination anchor not found on linked page.`)
        }

        let card; 
        if (destination.closest(".alert") !== null) {
            // if destination belongs to a card-style alert, use this
            card = destination.closest(".alert");
        } else if (destination.closest("tr") !== null) {
            // if destination belongs to a table, use nearest row
            card = document.createElement("div");
            card.innerHTML = destination.closest("tr").innerHTML;
            card.classList = "alert alert-secondary";
        } else {
            // element does not have associated card, do not display tooltip
            return;
        };
        
        // double check target after fetch has returned
        if (event.target === CURRENT_LINK_TARGET) {
            showCardTooltip(card, event.target, x, y);            
        }
    } finally {
        document.removeEventListener("mousemove", onMouseMove);
    }
}

function onMouseLeaveLink() {
    if (HOLD_TOOLTIP === false) {
        CURRENT_LINK_TARGET = null;
        removeCardTooltip();        
    }
}

function onKeyDown(e) {
    if (e.key === "Shift") {
        HOLD_TOOLTIP = !HOLD_TOOLTIP;
        
        if (!HOLD_TOOLTIP) {
            removeCardTooltip();
        }
    } else if (e.key === "Escape") {
        removeCardTooltip();
    }
}

function onScroll(e) {
    if (!HOLD_TOOLTIP) {
        removeCardTooltip();
    }
}

function addEventListenersToLinks() {
    const links = document.getElementsByTagName("a");
    
    for (const l of links) {
        l.addEventListener("mouseenter", onMouseEnterLink);
        l.addEventListener("mouseleave", onMouseLeaveLink);
    }
    
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("scroll", onScroll);
}

(() => {
    addEventListenersToLinks();
})();