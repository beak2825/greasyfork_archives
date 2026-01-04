// ==UserScript==
// @name         Copy on click real
// @version      0.1
// @description  Copy on click most common identifiers: ticket ID, ASIN, Merchant ID...
// @match        https://t.corp.amazon.com/*
// @author       ntorcarl
// @license      GNU General Public License v3.0
// @namespace https://greasyfork.org/users/936414
// @downloadURL https://update.greasyfork.org/scripts/447996/Copy%20on%20click%20real.user.js
// @updateURL https://update.greasyfork.org/scripts/447996/Copy%20on%20click%20real.meta.js
// ==/UserScript==


// @require tampermonkey://vendor/jquery.js
/* // TRIGGER EVENTS ANYTIME USER OPENS TICKET OR CHANGES TAB

BEST SOLUTION:
var oldHref = document.location.href;

window.onload = function() {
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                // Changed ! your code here
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
};












var initialLocation = document.location.pathname;
window.addEventListener("click", function() {
  if (document.location.pathname !== initialLocation) {
    console.log("User switched tab, from " + initialLocation.slice(-(initialLocation.length - 12)) + " to " + document.location.pathname.slice(-(document.location.pathname.length - 12)));
    initialLocation = document.location.pathname;
    tabSpecificTasks();
  }
}, false);

waitForElement() > Do your things only on window load. Among them, define variables that will be generally used such as ASIN, sellerID (empty, but fillable), links (to Provenance, for instance), functions, etc. Also, check the current tab and run the function for that tab.

function tabSpecificTasks() { // Now choose the tasks depending on the tab
  if (document.location.pathname.endsWith("overview")) {
    overviewTabTasks();
  }
  if (document.location.pathname.endsWith("vendor-information")) {
    sellerInfoTabTasks();
  }
  if (document.location.pathname.endsWith("communication")) {
    communicationTabTasks();
  }
  ...
}

function overviewTabTasks() {
  // waitForElement() > Do your thing
}

function sellerInfoTabTasks() {
  // waitForElement() > Do your thing
}

function overviewTabTasks() {
  // communicationTabTasks() > Do your thing
}

*/

/*
Detectar si tiene que ser soft pull o hard pull.
Avisar si se ha suspendido y tenía que ser soft, o si no se ha suspendido y tenía que ser hard.
*/

function copyFromAnyTab () {
    const simtitle = document.getElementById("sim-title");
    /*
    // Define ASIN
    if (simtitle.innerText.search(/\bB\w{9}\b/g) > 0) {
        const ASIN = simtitle.innerText.match(/\bB\w{9}\b/g)[0].toString();
    } else if (simtitle.innerText.search(/\bX00\w{7}\b/g) > 0) {
        const ASIN = simtitle.innerText.match(/\bX00\w{7}\b/g)[0].toString();
    } else {
        const ASIN = simtitle.innerText.slice(-10);
    }*/
    const ASIN = simtitle.innerText.match(/\bB\w{9}\b/g)[0].toString(); // OR document.body.innerText.match(/\bB\w{9}\b/g)[1].toString(); // \b indica un límite (es decir, no empieza a coincidir en medio de una palabra). \w{9} indica un caracter alfanumérico del alfabeto latino básico, nueve veces. \b indica otro límite (es decir, no termina la coincidencia en medio de una palabra). Another approach: simtitle.innerText.slice(-10);
    const ticketType = window.location.href.substr(window.location.href.lastIndexOf("amazon.com")+11).substring(0,1);
    // let FNSKU = document.body.innerText.match(/\bX\w{9}\b/g)[0].toString(); // Pending: add to sidebar if found. It can be in Overview tab or in the title. Also, consider using regular expressions for the other info items: seller ID, etc.
    // const checkedBin = document.body.innerText.match(/\bP-\w{1}-\w{8}\b/g)[0].toString(); // Pending: add to sidebar if found. It can be in Overview tab or in the title.

    // If SIM title contains an ASIN, copy ASIN
    if (simtitle.innerText.search(/\bB\w{9}\b/g) > 0) { // if (ticketType === "V" && simtitle.innerText.indexOf("Bin Check Request") < 0) {
        simtitle.onclick = function() {
            document.execCommand("copy");
        }
        simtitle.addEventListener("copy", function(event) {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", ASIN);
                console.log(event.clipboardData.getData("text"))
            }
        });
        // Sidebar: add ASIN // Doesn't work here: V592132192, V591302183 // SIDEBAR IDEA: when there is SellerID, TicketID and ASIN, give feedbcack, to know when I will be able to copy with Ctrl+Q.
        var sidebarASIN = document.createElement("span");
        sidebarASIN.innerHTML = '<span class="copySidebarAsin">&nbsp;<b style="color: #797b7e;">ASIN:</b> ' + ASIN + '<br>';
        sidebarASIN.style = "overflow: hidden;	text-overflow: ellipsis;	white-space: nowrap;"

        var copySidebarAsinFS = document.createElement("span");
        copySidebarAsinFS.innerHTML = '<svg width="9" height="9" class="copySidebarAsinFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
        copySidebarAsinFS.style = "opacity: 0";

        document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarAsinFS); // Improvement idea: place it on top of the sidebar (append it as the second node).
        document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarASIN);

        sidebarASIN.addEventListener("mouseenter", function(event) {
            document.addEventListener("mousemove", function(e) {
                copySidebarAsinFS.style.opacity = "1";
            }, false);
        }, false);
        sidebarASIN.addEventListener("mouseleave", function(event) {
            document.addEventListener("mousemove", function(e) {
                copySidebarAsinFS.style.opacity = "0";
            }, false);
        }, false);

        sidebarASIN.onclick = function() {
            document.execCommand("copy");
        }
        sidebarASIN.addEventListener("copy", function(event) {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", ASIN);
                console.log(event.clipboardData.getData("text"))
            }
        });
    }

    // If it's a BC ticket, copy FC + link
    if (simtitle.innerText.indexOf("Bin Check Request") >= 0) { // if (ticketType === "D" || simtitle.innerText.indexOf("Bin Check Request") >= 0) {
        const FC = simtitle.innerText.match(/\b\w{3}\d{1}\b/g)[0].toString(); // const FC = simtitle.innerText.slice(-5).substring(0,4);
        const FCandURL = FC + " " + window.location.href.slice(0,35);
        simtitle.onclick = function() {
            document.execCommand("copy");
        }
        simtitle.addEventListener("copy", function(event) {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", FCandURL);
                console.log(event.clipboardData.getData("text"))
            }
        });
        // Sidebar: add FC
        var sidebarFC = document.createElement("span");
        sidebarFC.innerHTML = '<span class="FC">&nbsp;<b>FC:</b> ' + FC + '<br>';
        sidebarFC.style = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"

        var copySidebarFCFS = document.createElement("span");
        copySidebarFCFS.innerHTML = '<svg width="9" height="9" class="copySidebarFCFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
        copySidebarFCFS.style = "opacity: 0";

        document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarFCFS);
        document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarFC);

        sidebarFC.addEventListener("mouseenter", function(event) {
            document.addEventListener("mousemove", function(e) {
                copySidebarFCFS.style.opacity = "1";
            }, false);
        }, false);
        sidebarFC.addEventListener("mouseleave", function(event) {
            document.addEventListener("mousemove", function(e) {
                copySidebarFCFS.style.opacity = "0";
            }, false);
        }, false);

        sidebarFC.onclick = function() {
            document.execCommand("copy");
        }
        sidebarFC.addEventListener("copy", function(event) {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", FC);
                console.log(event.clipboardData.getData("text"))
            }
        });
    }

    // Add feedback Icon that appears on hover (simtitle) // A simpler feedback idea: simtitle.style.cursor = "copy";
    // Create the Icon
    const simtitleContainer = document.getElementsByClassName("title-container")[0];
    const copyASINFeedbackIcon = document.createElement("p");
    copyASINFeedbackIcon.innerHTML = '<svg width="20" height="9"><g><rect height="6" width="6" y="0.5" x="13.6" stroke="#000" fill="#fff"/><rect height="6" width="6" y="2.3" x="11.8" stroke="#000" fill="#fff"/></g></svg>';
    copyASINFeedbackIcon.style = "opacity: 0";
    simtitleContainer.appendChild(copyASINFeedbackIcon);

    //  When mouse is over SIM title, turn opacity to 1. On leave, turn opacity to 0 again.
    simtitle.addEventListener("mouseenter", function(event) {
        document.addEventListener("mousemove", function(e) {
            copyASINFeedbackIcon.style.opacity = "1";
        }, false);
    }, false);
    simtitle.addEventListener("mouseleave", function(event) {
        document.addEventListener("mousemove", function(e) {
            copyASINFeedbackIcon.style.opacity = "0";
        }, false);
    }, false);

    // Copy shortTicketId from any tab
    // Copy it
    const shortTicketIdNoTab = document.getElementsByClassName("ticket-id")[0];
    shortTicketIdNoTab.onclick = function() {
        document.execCommand("copy");
    }
    shortTicketIdNoTab.addEventListener("copy", function(event) {
        event.preventDefault();
        if (event.clipboardData) {
            event.clipboardData.setData("text/plain", shortTicketIdNoTab.innerText.replace(/\s/g,''));
            console.log(event.clipboardData.getData("text"))
        }
    });

    // Add feedback Icon that appears on hover
    const shortTicketIdNoTabIcon = document.getElementsByClassName("lock-status")[0];
    const copyShortTicketIdNoTabFeedbackIcon = '<svg height="18" class="copySellerIdFS" width="18"><rect height="10.8" width="10.8" y="1" x="3.69" stroke="#000" fill="#fff"></rect><rect height="10.8" width="10.8" y="3.69" x="1" stroke="#000" fill="#fff"></rect></svg>';
    const lockIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path class="stroke-linejoin-round" d="M2 7h12v7H2z"></path><path d="M11.874 4A4 4 0 0 0 4 5v2"></path></svg>';
    const wip = '<span class="wip"><awsui-button><button class="awsui-button awsui-button-variant-normal awsui-hover-child-icons awsui-color-blue-300" type="button" style="padding: 1px 6px 0px; font-size: xx-small; position: absolute; top: 0px; left: 160px; letter-spacing: 0px; width: max-content;"><span><span><span>W.I.P</span></span></span></button></awsui-button></span>'

    shortTicketIdNoTab.addEventListener("mouseenter", function(event) {
        document.addEventListener("mousemove", function(e) {
            shortTicketIdNoTabIcon.innerHTML = copyShortTicketIdNoTabFeedbackIcon + wip;
        }, false);
    }, false);
    shortTicketIdNoTab.addEventListener("mouseleave", function(event) {
        document.addEventListener("mousemove", function(e) {
            shortTicketIdNoTabIcon.innerHTML = lockIcon + wip;
        }, false);
    }, false);

    // FC without bins to check reminder
    if (simtitle.textContent.includes("CDG7" || "BCN2")) {
        alert("Please do not raise Bin Check Requests to this FC. This FC does not have bins to check.");
    }

    // On the sidebar, create a button that copies all available data
    var copyAllButton = document.createElement("span");
    copyAllButton.innerHTML = '<button class="awsui-button awsui-button-variant-normal awsui-hover-child-icons awsui-color-blue-300" type="button" style="padding: 1px 6px 0px; font-size: xx-small; letter-spacing: 0px; width: max-content;"><span class="awsui_content_vjswe_108wz_3"><span>Copy</span></span></button>';
    copyAllButton.style.display = "none";
    document.getElementsByClassName("ticket-details")[0].appendChild(copyAllButton);
    copyAllButton.addEventListener("click", copyAll);

    // Add a Custom Notes textarea, for FNSKUs, for example
    var previousDiv = document.getElementsByClassName("side-section ticket-container")[0];
    var wrap = document.createElement("div");
    var ticketId = document.getElementsByClassName("ticket-id")[0].innerText.replace(" ", "");
    var cacheItemName = "notes" + ticketId;

    wrap.style.padding = "0 2rem 1rem 2rem";
    wrap.style.backgroundColor = "var(--color-background-container-header-g9rg0j,#fafafa)";
    var customNotes = document.createElement("p");
    customNotes.style.border = "1px solid #fafafa";
    customNotes.style.backgroundColor = "#fafafa";
    customNotes.style.padding = "0 1rem";
    customNotes.style.outline = "currentcolor none medium";
    customNotes.style.borderRadius = "0.4rem";
    customNotes.style.margin = "-1rem 0";
    customNotes.contentEditable = "false";
    customNotes.spellcheck = "false";
    customNotes.innerText = localStorage[cacheItemName] || "Custom notes";

    var counter = 0;
    customNotes.addEventListener("click", (e) => {
        counter++;
        e.target.contentEditable = counter % 3 === 0 ? "false" : "true";
        if (e.target.contentEditable === "true") {
            customNotes.style.border = "1px solid #0073bb";
            customNotes.style.backgroundColor = "white";
            customNotes.style.fontStyle = "italic";
        } else {
            leave(customNotes);
        }
    });
    customNotes.addEventListener("focusout", (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            counter = 0;
            leave(customNotes);
        }
    });

    function leave(element) {
        localStorage[cacheItemName] = customNotes.innerText;
        element.style.border = "1px solid #fafafa";
        element.style.backgroundColor = "#fafafa";
        element.style.fontStyle = "normal";
    }

    /*var title = document.createElement("span");
    title.innerHTML = "<b>FNSKU:</b>";

    var copysidebarFNSKU = document.createElement("span");
    copysidebarFNSKU.innerHTML = '<svg width="9" height="9" class="copysidebarFNSKU"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
    copysidebarFNSKU.style = "opacity: 0";

    title.addEventListener("mouseenter", function(event) {
        document.addEventListener("mousemove", function(e) {
            copysidebarFNSKU.style.opacity = "1";
        }, false);
    }, false);
    title.addEventListener("mouseleave", function(event) {
        document.addEventListener("mousemove", function(e) {
            copysidebarFNSKU.style.opacity = "0";
        }, false);
    }, false);

    title.onclick = function() {
        document.execCommand("copy");
        localStorage[cacheItemName] = customNotes.innerText;
    }
    title.addEventListener("copy", function(event) {
        event.preventDefault();
        if (event.clipboardData) {
            event.clipboardData.setData("text/plain", localStorage[cacheItemName]);
            console.log(event.clipboardData.getData("text"))
        }
    });


    wrap.appendChild(copysidebarFNSKU);
    wrap.appendChild(title);*/
    wrap.appendChild(customNotes);
    previousDiv.parentNode.insertBefore(wrap, previousDiv.nextSibling);
};

// Run functions 7 seconds after the page is loaded.
setTimeout(copyFromAnyTab, 7000);

// On Ctrl + Enter, post comment (if comment textarea is focused) or submit info in Edit Status Details pop-up. Other shortcuts
document.onkeyup = function(e) {
    if (e.ctrlKey) {
        if (e.key === 'Enter' && document.getElementById("sim-communicationActions--createComment") === document.activeElement) { //                                Ctrl + Enter to post a comment.
            document.getElementsByClassName("sim-communicationActions--addCommentButton")[0].click();
        } else if (e.key === 'Enter' && document.getElementById("markdown-editor") === document.activeElement && window.location.href.indexOf("create") != -1) { // Ctrl + Enter to create a BC.
            document.getElementsByClassName("sim-create--submit awsui_button_vjswe_108wz_7 awsui_variant-primary_vjswe_108wz_111")[0].click();
        } else if (e.key === 'Enter' && document.getElementById("sim-vendorInformationCard--physicalLocationInput") === document.activeElement ) { //               Ctrl + Enter to save Vendor Information tab inputs.
            document.getElementsByClassName("sim-vendorInformationCard--saveButton awsui_button_vjswe_108wz_7 awsui_variant-primary_vjswe_108wz_111")[0].click();
        } else if (e.key === 'Enter') { //                                                                                                                          Ctrl + Enter to resolve a case.
            document.getElementsByClassName("sim-statusDetailsForm--resolveButton")[0].click();
        }

        else if (e.key === "y") { //                                                                                                                                Ctrl + Y to copy all. (Works with AHK MultiClipboard, that on Ctrl+Q copies all with this shortcut, Ctrl+Y, and pastes data separatedly into numpad keys). TO DO: ADD FEEDBACK MESSAGE WHEN COPIED. SOMETHING LIKE THIS: https://stackoverflow.com/questions/61092432/display-success-message-after-copying-url-to-clipboard
            copyAll();
        }
    }
}

// Define function to copy all, and trigger it by Control+Y.
function copyAll () {
    var textToCopy = "ASIN" +
        document.getElementsByClassName("copySidebarAsin")[0].innerText.slice(7,
                                                                              document.getElementsByClassName("copySidebarAsin")[0].innerText.length - 1) +
        "SellerId" +
        document.getElementsByClassName("sidebarSellerId")[0].innerText.slice(12,
                                                                              document.getElementsByClassName("sidebarSellerId")[0].innerText.length - 1) +
        "ShortTicketId" +
        document.getElementsByClassName("ticket-id")[0].innerText.slice(0,
                                                                        document.getElementsByClassName("ticket-id")[0].innerText.length).replace(" ","") +
        "LongTicketId" +
        document.getElementsByClassName("sidebarLongTicketId")[0].className.slice(20,
                                                                                  document.getElementsByClassName("sidebarLongTicketId")[0].className.length)
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy)
    } else {
        console.log('Browser Not compatible')
    }
}

// When browser tab is open...
if (!document.hidden) {

    // Every 2 seconds, run function "copyFromOverviewTab"
    setInterval(function copyFromOverviewTab () {

        // If URL includes "overview", or has 36 or 37 characters...
        if (window.location.href.indexOf("overview") != -1 || location.href.length === 36 || 37) {

            // Copy the short ticket ID on click:
            const shortticketid = document.getElementsByClassName("ticket-id-list-item")[0]; // Alternative way to get it, from URL: const shortticketid = window.location.href.substr(window.location.href.lastIndexOf('amazon.com')+11).substring(0,10);
            shortticketid.onclick = function() {
                document.execCommand("copy");}
            shortticketid.addEventListener("copy", function(event) {
                event.preventDefault();
                if (event.clipboardData) {
                    event.clipboardData.setData("text/plain", shortticketid.textContent);
                    console.log(event.clipboardData.getData("text"))}});

            //Copy the long ticket ID on click:
            const longTicketId = document.getElementsByClassName("ticket-id-list-item")[1];
            longTicketId.onclick = function() {
                document.execCommand("copy");}
            longTicketId.addEventListener("copy", function(event) {
                event.preventDefault();
                if (event.clipboardData) {
                    event.clipboardData.setData("text/plain", longTicketId.textContent);
                    console.log(event.clipboardData.getData("text"))}});

            // Sidebar: add LongTicketId
            if (document.getElementsByClassName("sidebarLongTicketId").length < 1) {
                var sidebarLongTicketId = document.createElement("span");
                sidebarLongTicketId.innerHTML = '<span class="sidebarLongTicketId ' + longTicketId.innerText + '">&nbsp;<b>Ticket ID:</b> ' + longTicketId.innerText.slice(0,8) + '...<br>';
                sidebarLongTicketId.style = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"

                var copySidebarLongTicketIdFS = document.createElement("span");
                copySidebarLongTicketIdFS.innerHTML = '<svg width="9" height="9" class="copySidebarLongTicketIdFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
                copySidebarLongTicketIdFS.style = "opacity: 0";

                document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarLongTicketIdFS);
                document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarLongTicketId);

                sidebarLongTicketId.addEventListener("mouseenter", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySidebarLongTicketIdFS.style.opacity = "1";
                    }, false);
                }, false);
                sidebarLongTicketId.addEventListener("mouseleave", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySidebarLongTicketIdFS.style.opacity = "0";
                    }, false);
                }, false);

                sidebarLongTicketId.onclick = function() {
                    document.execCommand("copy");
                }
                sidebarLongTicketId.addEventListener("copy", function(event) {
                    event.preventDefault();
                    if (event.clipboardData) {
                        event.clipboardData.setData("text/plain", longTicketId.innerText);
                        console.log(event.clipboardData.getData("text"))
                    }
                });}

            // Add feedback Icon that appears on hover (shortticketid and longTicketId)
            // Create the Icon
            const tickedIdContainer = document.getElementsByClassName("ticket-id-list-wrapper")[0];
            tickedIdContainer.style = "max-height: 12px;"; // Prevent the hole wrapper from getting bigger because of the feedback Icon.
            const copyTicketIdFeedbackIcon = document.createElement("p");
            copyTicketIdFeedbackIcon.innerHTML = '<svg class="copyTicketIdFeedbackIcon" width="20" height="9"><g><rect height="6" width="6" y="0.5" x="13.6" stroke="#000" fill="#fff"/><rect height="6" width="6" y="2.3" x="11.8" stroke="#000" fill="#fff"/></g></svg>';
            copyTicketIdFeedbackIcon.style = "opacity: 0; margin-top: -9px";

            // If there are less than 1 Icons, add one.
            if (document.getElementsByClassName("copyTicketIdFeedbackIcon").length < 1) {
                tickedIdContainer.appendChild(copyTicketIdFeedbackIcon);}

            //  When mouse is over shortticketid, turn opacity to 1. On leave, turn opacity to 0 again.
            shortticketid.addEventListener("mouseenter", function(event) {
                document.addEventListener("mousemove", function(e) {
                    copyTicketIdFeedbackIcon.style.opacity = "1";
                }, false);
            }, false);
            shortticketid.addEventListener("mouseleave", function(event) {
                document.addEventListener("mousemove", function(e) {
                    copyTicketIdFeedbackIcon.style.opacity = "0";
                }, false);
            }, false);

            //  When mouse is over longTicketId, turn opacity to 1. On leave, turn opacity to 0 again.
            longTicketId.addEventListener("mouseenter", function(event) {
                document.addEventListener("mousemove", function(e) {
                    copyTicketIdFeedbackIcon.style.opacity = "1";
                }, false);
            }, false);
            longTicketId.addEventListener("mouseleave", function(event) {
                document.addEventListener("mousemove", function(e) {
                    copyTicketIdFeedbackIcon.style.opacity = "0";
                }, false);
            }, false);

            var textBox = document.getElementsByClassName("plain-text-display")[0].innerHTML;
            // Copy the seller ID on click
            if (document.getElementsByClassName("sellerId").length < 1) {

                // Define variables if it's a manual pull (ID appears after "MerchantId:")
                if (textBox.search("MerchantId:") != -1) {
                    var position1 = textBox.search("MerchantId:") + 12;
                    var position2 = textBox.slice(position1, textBox.length).search(" ") + position1;
                }
                // Define variables if it's a CS_ANDON or High Value Listing (ID appears after "Merchant ID:")...
                if (textBox.search("Merchant ID:") != -1) {
                    var position1 = textBox.search("Merchant ID:") + 13;
                    var position2 = textBox.slice(position1, textBox.length).search(" ") + position1;
                }
                // Define variables if it's an Apollo (ID appears after "Merchant Customer ID:")...
                if (textBox.search("Merchant Customer ID:") != -1) {
                    var position1 = textBox.search("Merchant Customer ID:") + 22;
                    var position2 = textBox.slice(position1, textBox.length).search("\n") + position1;
                }
                var sellerId = textBox.slice(position1, position2);
                var preSellerId = textBox.slice(0, position1);
                var postSellerId = textBox.slice(position2, textBox.length);

                // Create a new Span that identifies the Seller ID. In the process, create the Feedback icon
                document.getElementsByClassName("plain-text-display")[0].innerHTML = preSellerId + '<span class="sellerId">' + sellerId + '<svg class="copySellerIdFeedbackIcon" width="20" height="9"><g><rect height="6" width="6" y="0.5" x="13.6" stroke="#000" fill="#fff"/><rect height="6" width="6" y="2.3" x="11.8" stroke="#000" fill="#fff"/></g></svg></span>' + postSellerId
                var sellerIdSpan = document.getElementsByClassName("sellerId")[0];

                // At last, copy SellerId on click
                sellerIdSpan.onclick = function() {
                    document.execCommand("copy");
                }
                sellerIdSpan.addEventListener("copy", function(event) {
                    event.preventDefault();
                    if (event.clipboardData) {
                        event.clipboardData.setData("text/plain", sellerIdSpan.textContent);
                        console.log(event.clipboardData.getData("text"))
                    }
                });

                var copySellerIdFeedbackIcon = document.getElementsByClassName("copySellerIdFeedbackIcon")[0];
                copySellerIdFeedbackIcon.style = "opacity: 0; margin-top: -9px";

                //  When mouse is over sellerIdSpan, turn opacity of copySellerIdFeedbackIcon to 1. On leave, turn opacity to 0 again.
                sellerIdSpan.addEventListener("mouseenter", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySellerIdFeedbackIcon.style.opacity = "1";
                    }, false);
                }, false);
                sellerIdSpan.addEventListener("mouseleave", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySellerIdFeedbackIcon.style.opacity = "0";
                    }, false);
                }, false);

                // Sidebar: add SellerId
                if (document.getElementsByClassName("sidebarSellerId").length < 1 && sellerIdSpan.innerText.length < 20) {
                    var sidebarSellerId = document.createElement("span");
                    sidebarSellerId.innerHTML = '<span class="sidebarSellerId">&nbsp;<b>Seller ID:</b> ' + sellerIdSpan.innerText + '<br>';
                    sidebarSellerId.style = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"

                    var copySidebarSellerIdFS = document.createElement("span");
                    copySidebarSellerIdFS.innerHTML = '<svg width="9" height="9" class="copySidebarSellerIdFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
                    copySidebarSellerIdFS.style = "opacity: 0";

                    document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarSellerIdFS);
                    document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarSellerId);

                    sidebarSellerId.addEventListener("mouseenter", function(event) {
                        document.addEventListener("mousemove", function(e) {
                            copySidebarSellerIdFS.style.opacity = "1";
                        }, false);
                    }, false);
                    sidebarSellerId.addEventListener("mouseleave", function(event) {
                        document.addEventListener("mousemove", function(e) {
                            copySidebarSellerIdFS.style.opacity = "0";
                        }, false);
                    }, false);

                    sidebarSellerId.onclick = function() {
                        document.execCommand("copy");
                    }
                    sidebarSellerId.addEventListener("copy", function(event) {
                        event.preventDefault();
                        if (event.clipboardData) {
                            event.clipboardData.setData("text/plain", sellerIdSpan.innerText);
                            console.log(event.clipboardData.getData("text"))
                        }
                    });
                }

                /*// Sidebar: add editable area for FNSKUs
                if (document.getElementsByClassName("sidebarFNSKU").length < 1) {
                    // Add a Custom Notes textarea for FNSKUs
                    var ticketId = document.getElementsByClassName("ticket-id")[0].innerText.replace(" ", "");
                    var cacheItemName = "notes" + ticketId;

                    var customNotesFNSKU = document.createElement("p");
                    customNotesFNSKU.style.backgroundColor = "#fafafa";
                    customNotesFNSKU.style.padding = "0 .4rem";
                    customNotesFNSKU.style.outline = "currentcolor none medium";
                    customNotesFNSKU.style.display = "inline-block";
                    customNotesFNSKU.contentEditable = "true";
                    customNotesFNSKU.spellcheck = "false";
                    customNotesFNSKU.innerText = localStorage[cacheItemName] || "Custom notes";

                    var sidebarFNSKU = document.createElement("span");
                    sidebarFNSKU.innerHTML = '<span class="sidebarFNSKU">&nbsp;<b>FNSKU:</b>'
                    sidebarFNSKU.appendChild(customNotesFNSKU);
                    sidebarFNSKU.innerHTML += '<br>';

                    sidebarFNSKU.style = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"

                    var copysidebarFNSKU = document.createElement("span");
                    copysidebarFNSKU.innerHTML = '<svg width="9" height="9" class="copysidebarFNSKU"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
                    copysidebarFNSKU.style = "opacity: 0";

                    document.getElementsByClassName("side-section ticket-container")[0].appendChild(copysidebarFNSKU);
                    document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarFNSKU);

                    sidebarFNSKU.addEventListener("mouseenter", function(event) {
                        document.addEventListener("mousemove", function(e) {
                            copysidebarFNSKU.style.opacity = "1";
                        }, false);
                    }, false);
                    sidebarFNSKU.addEventListener("mouseleave", function(event) {
                        document.addEventListener("mousemove", function(e) {
                            copysidebarFNSKU.style.opacity = "0";
                        }, false);
                    }, false);

                    sidebarFNSKU.querySelector("span").onclick = function() {
                        document.execCommand("copy");
                        localStorage[cacheItemName] = customNotesFNSKU.innerText;
                    }
                    sidebarFNSKU.querySelector("span").addEventListener("copy", function(event) {
                        event.preventDefault();
                        if (event.clipboardData) {
                            event.clipboardData.setData("text/plain", localStorage[cacheItemName]);
                            console.log(event.clipboardData.getData("text"))
                        }
                    });
                }*/

                // Sidebar: if it's an Apollo case, add FC and, on click, copy the sentence for BCs ("For FC ..., defect already confirmed in bin location ..., please also review this specific location.")
                if (document.getElementsByClassName("copySidebarCheckedBins").length < 1 && document.getElementById("sim-title").innerText.search("Apollo") > 0) {
                    var FC = textBox.slice(textBox.search("FCs:") + 5, textBox.search("FCs:") + 9);
                    var checkedBin1 = textBox.match(/\bP-\w{1}-\w{8}\b/g)[0].toString();
                    var BCsentenceGrammNum = textBox.match(/\bP-\w{1}-\w{8}\b/g).length === 1 ? "this specific location." : "these specific locations.";
                    var BCsentence = "For FC " + FC + ", defect already confirmed in bin location " + textBox.match(/\bP-\w{1}-\w{8}\b/g).join(", ").replace(/, ([^,]*)$/, ' and $1') + ", please also review " + BCsentenceGrammNum;

                    var sidebarCheckedBins = document.createElement("span");
                    sidebarCheckedBins.innerHTML = '<span class="copySidebarCheckedBins">&nbsp;<b>FC:</b> ' + FC + '</span><br>';
                    sidebarCheckedBins.style = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"

                    var copySidebarCheckedBinsFS = document.createElement("span");
                    copySidebarCheckedBinsFS.innerHTML = '<svg width="9" height="9" class="copySidebarCheckedBinsFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
                    copySidebarCheckedBinsFS.style = "opacity: 0";

                    document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarCheckedBinsFS);
                    document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarCheckedBins);

                    sidebarCheckedBins.addEventListener("mouseenter", function(event) {
                        document.addEventListener("mousemove", function(e) {
                            copySidebarCheckedBinsFS.style.opacity = "1";
                        }, false);
                    }, false);
                    sidebarCheckedBins.addEventListener("mouseleave", function(event) {
                        document.addEventListener("mousemove", function(e) {
                            copySidebarCheckedBinsFS.style.opacity = "0";
                        }, false);
                    }, false);

                    sidebarCheckedBins.onclick = function() {
                        document.execCommand("copy");
                    }
                    sidebarCheckedBins.addEventListener("copy", function(event) {
                        event.preventDefault();
                        if (event.clipboardData) {
                            event.clipboardData.setData("text/plain", BCsentence);
                            console.log(event.clipboardData.getData("text"))
                        }
                    });
                }
            }

            // Hide unnecessary links
            document.getElementById("VDBLink").style.display="none";
            document.getElementById("InvLookupLink").style.display="none";
            document.getElementById("CSILink").style.display="none";
            document.body.innerText.replace(/\|  \|/g, "|");

            // Create a reminder to avoid leaving the Status in Assigned
            // var ticketStatus = document.getElementsByClassName("display-mode is-editable")[0];
            var issueSummary = document.getElementsByClassName("properties")[0].innerText;
            var ticketStatus = document.getElementsByClassName("subheader awsui_root_18wu0_b23hx_3 awsui_box_18wu0_b23hx_17 awsui_h3-variant_18wu0_b23hx_21 awsui_p-top-s_18wu0_b23hx_316 awsui_p-left-m_18wu0_b23hx_355 awsui_color-default_18wu0_b23hx_17 awsui_font-size-heading-xs_18wu0_b23hx_159 awsui_font-weight-bold_18wu0_b23hx_194")[0];
            if ((document.getElementsByClassName("user-name")[0].innerHTML == "ntorcarl" && document.getElementsByClassName("info-value")[0].innerText == "Assigned") || (issueSummary.includes("Resolved") && !issueSummary.includes("Successful"))) {
                if (ticketStatus.innerHTML.indexOf("⚠️") == -1) {
                    ticketStatus.innerHTML = ticketStatus.innerHTML += '<span>&nbsp&nbsp⚠️</span>';
                }
                /*if (document.getElementById("reminderBanner") == null) {
                    var reminderBanner = document.createElement('div');
                    reminderBanner.innerHTML = 'Reminder: please change the Status to Pending';
                    reminderBanner.style="position: fixed; bottom: 0px; left: 0px; right: 0px; background-color: rgb(0, 115, 187); color: rgb(255, 255, 255); padding: 30px; text-align: center; font-family: Amazon Ember; z-index: 1;"
                    reminderBanner.onclick = function() {
                        document.body.removeChild(this);
                    };
                    reminderBanner.setAttribute('id','reminderBanner');
                    document.body.appendChild(reminderBanner);
                }*/
            } else if (ticketStatus.innerHTML.indexOf("⚠️") > 0) {
                ticketStatus.innerHTML = ticketStatus.innerHTML.replace("<span>&nbsp&nbsp⚠️</span>","");
            }
        }
    }, 2000);
}

// When browser tab is open...
if (!document.hidden) {

    // Every 2 seconds, run function "copyFromVITab"
    setInterval(function copyFromVITab () {

        // If URL includes "vendor-information", then...
        if (window.location.href.indexOf("vendor-information") != -1) {

            // Copy the seller ID on click:
            var sellerIdVITab = document.getElementsByClassName("sim-vendorInformationCard--vendorIdDisplay sim-vendorInformationCard--displayField")[0];
            sellerIdVITab.onclick = function() {
                document.execCommand("copy");
            }
            sellerIdVITab.addEventListener("copy", function(event) {
                event.preventDefault();
                if (event.clipboardData) {
                    event.clipboardData.setData("text/plain", sellerIdVITab.textContent);
                    console.log(event.clipboardData.getData("text"))
                }
            });

            // Copy the physical location code on click:
            var physicalLocation = document.getElementsByClassName("sim-vendorInformationCard--physicalLocationDisplay sim-vendorInformationCard--displayField")[0];
            physicalLocation.onclick = function() {
                document.execCommand("copy");
            }
            physicalLocation.addEventListener("copy", function(event) {
                event.preventDefault();
                if (event.clipboardData) {
                    event.clipboardData.setData("text/plain", physicalLocation.textContent);
                    console.log(event.clipboardData.getData("text"))}});

            // Add feedback Icon that appears on hover (sellerIdVITab)
            // Create the Icon
            const copySellerIdVITabFeedbackIcon = document.createElement("span");
            copySellerIdVITabFeedbackIcon.innerHTML = '<svg class="copySellerIdVITabFeedbackIcon" width="20" height="9"><g><rect height="6" width="6" y="0.5" x="13.6" stroke="#000" fill="#fff"/><rect height="6" width="6" y="2.3" x="11.8" stroke="#000" fill="#fff"/></g></svg>';
            copySellerIdVITabFeedbackIcon.style = "opacity: 0";

            // If there are less than 1 Icons, add one.
            if (document.getElementsByClassName("copySellerIdVITabFeedbackIcon").length < 1) {
                sellerIdVITab.appendChild(copySellerIdVITabFeedbackIcon);}

            //  When mouse is over sellerIdVITab, turn opacity to 1. On leave, turn opacity to 0 again.
            sellerIdVITab.addEventListener("mouseenter", function(event) {
                document.addEventListener("mousemove", function(e) {
                    copySellerIdVITabFeedbackIcon.style.opacity = "1";
                }, false);
            }, false);
            sellerIdVITab.addEventListener("mouseleave", function(event) {
                document.addEventListener("mousemove", function(e) {
                    copySellerIdVITabFeedbackIcon.style.opacity = "0";
                }, false);
            }, false);

            // Add feedback Icon that appears on hover (physicalLocation)
            // Create the Icon
            const physicalLocationFeedbackIcon = document.createElement("span");
            physicalLocationFeedbackIcon.innerHTML = '<svg class="physicalLocationFeedbackIcon" width="20" height="9"><g><rect height="6" width="6" y="0.5" x="13.6" stroke="#000" fill="#fff"/><rect height="6" width="6" y="2.3" x="11.8" stroke="#000" fill="#fff"/></g></svg>';
            physicalLocationFeedbackIcon.style = "opacity: 0";

            // If there are less than 1 Icons, add one.
            if (document.getElementsByClassName("physicalLocationFeedbackIcon").length < 1) {
                physicalLocation.appendChild(physicalLocationFeedbackIcon);}

            //  When mouse is over physicalLocation, turn opacity to 1. On leave, turn opacity to 0 again.
            physicalLocation.addEventListener("mouseenter", function(event) {
                document.addEventListener("mousemove", function(e) {
                    physicalLocationFeedbackIcon.style.opacity = "1";
                }, false);
            }, false);
            physicalLocation.addEventListener("mouseleave", function(event) {
                document.addEventListener("mousemove", function(e) {
                    physicalLocationFeedbackIcon.style.opacity = "0";
                }, false);
            }, false);

            /*
            In VITab fill fields it automatically.
            1. Check if all necessary fields are fulfilled.
            2. If not, click on "Edit".
            3. Fill empty fields, taking info from Sidebar (for seller ID) and Ticket Summary (for location).
               var sellerIdInput = document.querySelectorAll("input")[1];
               var locationInput = document.querySelectorAll("input")[12]
               if (sellerIdInput is empty and sellerId is in Sidebar) {sellerIdInput.value = ...};
               if (locationInput is empty and location is in ticket summary) {locationInput.value = ...}
            4. Click on "Save".

            Another approach: (both have good things, mix them):

            var vendorIDDisplay = document.getElementsByClassName("sim-vendorInformationCard--vendorIdDisplay")[0].innerText;
            var physicalLocationDisplay = document.getElementsByClassName("sim-vendorInformationCard--physicalLocationDisplay")[0].innerText;

            // if (vendorIDDisplay or physicalLocationDisplay are empty) {
            // if (there are variables sellerID and countryCode fulfilled) {
            var editButton = document.getElementsByClassName("sim-vendorInformationCard--editButton")[0];
            var saveButton = document.getElementsByClassName("sim-vendorInformationCard--saveButton")[0];
            editButton.click();
            var vendorIDField = document.getElementById("sim-vendorInformationCard--vendorIdInput");
            var physicalLocationField = document.getElementById("sim-vendorInformationCard--physicalLocationInput");
            vendorIDField.value = sellerID;
            physicalLocationField.value = countryCode;
            saveButton.click();
            // } else { show banner saying that fields could not be fulfilled }
            // }
            */

        }
    }, 2000);
}


// When browser tab is open...
if (!document.hidden) {

    // Every 2 seconds, run function "copyFromCommunicationTab"
    setInterval(function copyFromCommunicationTab () {

        // If URL includes "communication", then...
        if (window.location.href.indexOf("communication") != -1) {


            /*// Add a button after Comments textbox that, on click, alerts if the comment is unfinished
            const commentTextArea = document.getElementById("sim-communicationActions--createComment");
            const checkButton = document.createElement("div");

            // Button value, that appears disabled if commentTextArea is empty (en pruebas, si no, usar: checkButton.innerHTML = '<div style="margin-right: var(--space-s-3g7GuV,12px); min-width: 1px;"><button class="awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27 awsui_disabled_vjswe_108wz_103"><span class="awsui_content_vjswe_108wz_3"><span>Check Comment</span></span></button></div>';
            if (commentTextArea.value.length === 0) {
                checkButton.innerHTML = '<div style=\"margin-right: var(--space-s-3g7GuV,12px); min-width: 1px;\"><button class=\"awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27 awsui_disabled_vjswe_108wz_103\"><span class=\"awsui_content_vjswe_108wz_3\"><span>Check Comment</span></span></button></div>';
            } else {
                checkButton.innerHTML = '<div style=\"margin-right: var(--space-s-3g7GuV,12px); min-width: 1px;\"><button class=\"awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27\"><span class=\"awsui_content_vjswe_108wz_3\"><span>Check Comment</span></span></button></div>';
            }

            if (!checkButton.classList.contains("awsui_disabled_vjswe_108wz_103")) { // This is intended to only enable the button function when it's activated. But somehow doesn't work.
                checkButton.addEventListener("click", function() {
                    if (document.getElementById("sim-communicationActions--createComment").value.split("[").length - 1 > 0 ||
                        document.getElementById("sim-communicationActions--createComment").value.split("]").length - 1 > 0 ||
                        document.getElementById("sim-communicationActions--createComment").value.split("{").length - 1 > 0 ||
                        document.getElementById("sim-communicationActions--createComment").value.split("}").length - 1 > 0 ||
                        document.getElementById("sim-communicationActions--createComment").value.split("...").length - 1 > 0 ||
                        document.getElementById("sim-communicationActions--createComment").value.split("Y/N").length - 1 > 0) {
                        alert('This comment is unfinished. Please review it.\n\n(Found too many characters like "[", "Y/N", "...", or so.)'); // Improvement idea: in the alert, show exactly what's wrong. I. e.: '"]" character found'. Or '"[" and "..." characters were found.'
                    } else {
                        alert('Everything seems to be in place. 😊');
                    }
                });
            }

            // If there are less than 1 buttons (there are 21 or more items with class "awsui_button_vjswe_108wz_7"), add one.
            if (document.getElementsByClassName("awsui_button_vjswe_108wz_7").length < 21) {
                document.getElementsByClassName("editor-confirm-buttons")[0].prepend(checkButton);}

            // Toggle activation/deactivation of button depending on if commentTextArea is empty or not
            var checkButtonReal = document.getElementsByClassName("awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27")[3];
            var removeDraftButton = document.getElementsByClassName("awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27")[4];

            commentTextArea.addEventListener('input', disableCheckButton);
            function disableCheckButton(e) {
                if (commentTextArea.value.length === 0) {
                    checkButton.innerHTML = '<div style=\"margin-right: var(--space-s-3g7GuV,12px); min-width: 1px;\"><button class=\"awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27 awsui_disabled_vjswe_108wz_103\"><span class=\"awsui_content_vjswe_108wz_3\"><span>Check Comment</span></span></button></div>';
                } else {
                    checkButton.innerHTML = '<div style=\"margin-right: var(--space-s-3g7GuV,12px); min-width: 1px;\"><button class=\"awsui_button_vjswe_108wz_7 awsui_variant-normal_vjswe_108wz_27\"><span class=\"awsui_content_vjswe_108wz_3\"><span>Check Comment</span></span></button></div>';
                }
            }*/
            // Sidebar: add ParagonCaseId
            const comments = document.getElementsByClassName("sim-infiniteScrollDOMList sim-infiniteScrollDOMList--commentList sim-infiniteCommentList")[0].innerText;
            if (document.getElementsByClassName("sidebarParagonCaseId").length < 1 && document.body.innerText.search("Initial blurb Case ID Link") > 0) {

                var position1 = comments.search("Initial blurb Case ID Link") + comments.slice(comments.search("Initial blurb Case ID Link"),comments.length).search(/https:\/\/paragon-\w{2}.amazon.com\//);
                var hyperlinkEndingPoint = [comments.slice(position1, comments.length).search(" ") + position1, comments.slice(position1, comments.length).search("\n") + position1]
                var position2 = Math.min(...hyperlinkEndingPoint)
                var paragonCaseLink = comments.slice(position1, position2);
                var paragonCaseId = comments.slice(position1 + 45, position2);

                // if (position1 > 30) {
                var sidebarParagonCaseId = document.createElement("span");
                sidebarParagonCaseId.innerHTML = '<span class="sidebarParagonCaseId">&nbsp;<b>Paragon:</b> ' + paragonCaseId + ' ';
                sidebarParagonCaseId.style = "overflow: hidden;	text-overflow: ellipsis; white-space: nowrap;"

                var copySidebarParagonCaseIdFS = document.createElement("span");
                copySidebarParagonCaseIdFS.innerHTML = '<svg width="9" height="9" class="copySidebarParagonCaseIdFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
                copySidebarParagonCaseIdFS.style = "opacity: 0";

                var sidebarParagonCaseIdLink = document.createElement("span");
                sidebarParagonCaseIdLink.innerHTML = '<svg /*version="1.1" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg"*/ width="20px" height="20px" style="margin: -6px;"><a target="_blank" rel="noopener noreferrer" xlink:href="' + paragonCaseLink + '" stroke="#000" fill="#fff"><path d="m587.82 524.83v-290.9c0-5.043 0.09375-10.082 0.09375-15.125 0-20.258-11.191-39.68-29.508-48.84-7.8164-3.8867-16.234-5.875-24.973-5.875-1.5273 0-3.0508 0.09375-4.625 0.09375l-308.11 0.003906c-1.2969 0-2.543-0.09375-3.8398-0.09375-13.457 0.37109-26.27 5.7344-35.98 14.984-11.422 10.871-16.695 25.715-16.695 41.211v307.92c0 1.6641-0.09375 3.375-0.09375 5.043 0 8 1.6641 15.633 4.8555 22.938 8.5547 19.426 28.676 31.633 49.672 31.68 4.8086 0 9.6211-0.09375 14.43-0.09375h301.21c13.367-0.18359 26.129-5.1328 36.074-14.059 10.035-9.0195 15.77-21.551 17.297-34.777 0.50781-4.6289 0.18359-9.4375 0.18359-14.109zm-101.75-137.82c0 10.359-8.4648 18.035-18.5 18.5-9.9883 0.46094-18.5-8.832-18.5-18.5v-57.809l-36.629 36.582c-17.621 17.621-35.289 35.242-52.906 52.863-14.566 14.566-29.137 29.137-43.703 43.703l-13.688 13.688c-1.5273 1.5273-3.0508 3.0078-4.5312 4.5312-7.3086 7.3984-18.777 6.7969-26.176 0-0.09375-0.09375-0.23047-0.18359-0.32422-0.32422-0.27734-0.27734-0.55469-0.55469-0.78516-0.83203-0.14062-0.14062-0.23047-0.27734-0.37109-0.41797 0 0-0.046875-0.046876-0.046875-0.046876-0.09375-0.09375-0.18359-0.23047-0.23047-0.32422l-0.046876-0.046875c0-0.09375-0.14062-0.23047-0.23047-0.32422h-0.046875-0.046875-0.046875s-0.046875-0.046875-0.046875-0.09375v-0.046875-0.09375-0.09375-0.046875c-0.046875-0.046875-0.046875-0.09375 0-0.14062v-0.046875-0.046875c-0.09375-0.046875-0.18359-0.046875-0.23047-0.09375-0.046875 0-0.046875-0.046875-0.09375-0.09375 0 0-0.046875 0-0.046875-0.046875-0.046875-0.046875-0.09375-0.09375-0.09375-0.14062s0.046875-0.09375 0-0.09375c-0.09375-0.14062-0.23047-0.32422-0.32422-0.46094-0.09375-0.14063-0.14062-0.23047-0.23047-0.37109-0.046874-0.14062-0.14062-0.27734-0.18359-0.41797 0-0.046875-0.046875-0.09375-0.09375-0.14062s-0.046875-0.09375-0.09375-0.14062h-0.046875v-0.046875c0-0.09375-0.09375-0.14062-0.14062-0.23047 0 0 0-0.046875-0.046875-0.046875v-0.046875c0-0.046875-0.046875-0.09375-0.046875-0.14062-0.046875-0.046875-0.046875-0.09375-0.09375-0.14062-0.046875-0.09375-0.046875-0.14062-0.09375-0.23047-0.046875-0.09375-0.046875-0.18359-0.046875-0.27734v-0.14062c0-0.23047-0.09375-0.41797-0.18359-0.60156-0.046875-0.09375-0.09375-0.23047-0.14062-0.32422s-0.09375-0.18359-0.14062-0.32422c-0.27734-0.97266-0.50781-2.0352-0.60156-3.0508-0.046876-0.27734-0.046876-0.60156-0.09375-0.87891-0.37109-5.3633 1.4805-10.914 5.2734-14.707l0.27734-0.32422c7.3086-7.4922 14.801-14.801 22.199-22.199l45.691-45.691c17.621-17.621 35.242-35.289 52.863-52.906 10.082-10.082 20.211-20.164 30.293-30.34h-57.809c-10.359 0-18.035-8.4648-18.5-18.5-0.46094-9.9883 8.832-18.5 18.5-18.5h102.44c4.0234 0 7.7695 1.4336 10.867 3.6992l0.14062 0.14062s0.046875 0.046875 0.09375 0.046875 0.046875 0.046875 0.09375 0.046875c0.046875 0.046875 0.14062 0.09375 0.18359 0.14062 0.60156 0.41797 1.2031 0.92578 1.7578 1.4336 0.87891 0.83203 1.6641 1.7109 2.3594 2.6836 0.09375 0.14062 0.18359 0.27734 0.27734 0.41797 0.09375 0.14063 0.23047 0.32422 0.32422 0.46094 0.27734 0.41797 0.50781 0.87891 0.73828 1.3398 0.69531 1.4336 1.1562 2.9141 1.3398 4.4844 0.09375 0.50781 0.14062 1.0156 0.18359 1.5273 0.14062 0.69531 0.27734 1.4336 0.27734 2.1289l0.011719 102.46z" fill="#797b7e"></path></svg><br>'; // Longer, more accurate last path (arrow): <path transform="rotate(45, 7.38418, 2.59833)" d="m5.13322,2.59101l2.25021,-2.24265l2.25021,2.24265l-1.1251,0l0,2.25344l-2.25021,0l0,-2.25344l-1.1251,0z" stroke="#000" fill="#000000"></path>

                document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarParagonCaseIdFS);
                document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarParagonCaseId);
                document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarParagonCaseIdLink);

                sidebarParagonCaseId.addEventListener("mouseenter", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySidebarParagonCaseIdFS.style.opacity = "1";
                    }, false);
                }, false);
                sidebarParagonCaseId.addEventListener("mouseleave", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySidebarParagonCaseIdFS.style.opacity = "0";
                    }, false);
                }, false);

                sidebarParagonCaseId.onclick = function() {
                    document.execCommand("copy");
                }
                sidebarParagonCaseId.addEventListener("copy", function(event) {
                    event.preventDefault();
                    if (event.clipboardData) {
                        event.clipboardData.setData("text/plain", paragonCaseLink);
                        console.log(event.clipboardData.getData("text"))
                    }
                });

            }
            /*// Sidebar: add Suspended Offers
            if (document.getElementById("sim-title").innerText.indexOf("Manual") > 0 && document.getElementsByClassName("sidebarSuspendedOffers").length < 1 && document.body.innerText.search("Suspension Confirmation") > 0) {

                var position1SO = comments.search("Suspended Offers") + comments.slice(comments.search("Suspended Offers"), comments.length).search(/[0-9]+/);
                var suspensionConfirmationSO = comments.slice(position1SO, comments.length).search("Suspension Confirmation") + position1SO
                var position2SO = comments.slice(position1SO, suspensionConfirmationSO).lastIndexOf("\n") + position1SO;
                var suspendedOffers = comments.slice(position1SO, position2SO);
                suspendedOffers;

                var sidebarSuspendedOffers = document.createElement("span");
                sidebarSuspendedOffers.innerHTML = '<span class="sidebarSuspendedOffers">&nbsp;<b>Suspended:</b> ' + suspendedOffers.slice(0,8) + '...<br>';
                sidebarSuspendedOffers.style = "overflow: hidden;	text-overflow: ellipsis;	white-space: nowrap;"

                var copySidebarSuspendedOffersFS = document.createElement("span");
                copySidebarSuspendedOffersFS.innerHTML = '<svg width="9" height="9" class="copySidebarSuspendedOffersFS"><rect height="6" width="6" y="0.5" x="2.3" stroke="#000" fill="#fff"></rect><rect height="6" width="6" y="2.3" x="0.5" stroke="#000" fill="#fff"></rect></svg>';
                copySidebarSuspendedOffersFS.style = "opacity: 0";

                document.getElementsByClassName("side-section ticket-container")[0].appendChild(copySidebarSuspendedOffersFS);
                document.getElementsByClassName("side-section ticket-container")[0].appendChild(sidebarSuspendedOffers);

                sidebarSuspendedOffers.addEventListener("mouseenter", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySidebarSuspendedOffersFS.style.opacity = "1";
                    }, false);
                }, false);
                sidebarSuspendedOffers.addEventListener("mouseleave", function(event) {
                    document.addEventListener("mousemove", function(e) {
                        copySidebarSuspendedOffersFS.style.opacity = "0";
                    }, false);
                }, false);

                sidebarSuspendedOffers.onclick = function() {
                    document.execCommand("copy");
                }
                sidebarSuspendedOffers.addEventListener("copy", function(event) {
                    event.preventDefault();
                    if (event.clipboardData) {
                        event.clipboardData.setData("text/plain", suspendedOffers);
                        console.log(event.clipboardData.getData("text"))
                    }
                });
            }*/

            // In every comment, add a button to copy it, removing all content under "ACTION" section if there is one
            if (document.getElementsByClassName("copyCommentButton").length < 1) {

                // Create a button in every comment
                var commentTimestamps = document.getElementsByClassName("sim-commentCardPrimary--timestamps");
                var copyCommentButton = document.createElement("span");
                copyCommentButton.innerHTML = '<svg class="copyCommentButton" width="20" height="9"><g><rect height="6" width="6" y="0.5" x="13.6" stroke="#545b64" fill="#fff"/><rect height="6" width="6" y="2.3" x="11.8" stroke="#545b64" fill="#fff"/></g></svg>';
                for (let i = 0; i < commentTimestamps.length; i++) {
                    commentTimestamps[i].appendChild(copyCommentButton.cloneNode(true));
                }

                // On button click, copy the comment
                var buttons = document.getElementsByClassName("copyCommentButton");
                for (var i = 0; i < buttons.length; i++) {
                    (function(index) {
                        buttons[index].addEventListener("click", function() {
                            var fullComment = document.getElementsByClassName("plain-text-display")[index].innerText;

                            // (But remove text under "ACTIONS" if there is such section)
                            if (fullComment.search(/ACTIONS-*/) > 0) {
                                var position1 = fullComment.search(/ACTIONS-*/);
                                var position3 = fullComment.search(/PENDING-*/);
                                var position2 = position1 + fullComment.slice(position1, position3).search("\n");
                                var textToCopy = fullComment.slice(0, position2) + "\n\n\n" + fullComment.slice(position3, fullComment.length);
                            } else {
                                var textToCopy = fullComment;
                            }

                            navigator.clipboard.writeText(textToCopy);
                        })
                    })(i);
                }

                /* DISABLED DUE TO REDUNDANCY WITH SCRIPT "SIM - Add Paragon Case URL"
                // Turn the paragon ID into a link
                var allComments = document.querySelectorAll(".sim-commentCardPrimary");
                var lastComment = allComments[allComments.length - 1];
                var paragonID = lastComment.innerHTML.match(/\d{9,}/)[0];
                var paragonLink = '<a href="https://paragon-eu.amazon.com/hz/case?caseId=' + paragonID + '">' + paragonID + '</a>';
                var commentWithLink = lastComment.innerHTML.replace(paragonID, paragonLink);
                lastComment.innerHTML = commentWithLink;
                */


                // Add the number of touch to every comment made by a human
                const absoluteDates = false; // true = absolute dates are enabled in SIM Settings (done), false = relative dates (still to do)
                if (absoluteDates) {
                    function countWeekendDays(d0, d1) {
                        var ndays = 1 + Math.round((d1.getTime() - d0.getTime()) / (24 * 3600 * 1000));
                        var nsaturdays = Math.floor((d0.getDay() + ndays) / 7);
                        return 2 * nsaturdays + (d0.getDay() == 0) - (d1.getDay() == 6);
                    }

                    if (document.getElementsByClassName("touch-number").length == 0) {
                        var humanIndicatorAll = document.getElementsByClassName("sim-userPopover--name");
                        var firstHumanIndicator = humanIndicatorAll[humanIndicatorAll.length - 1];
                        var firstHumanComment = firstHumanIndicator.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        var firstDateString = firstHumanComment.getElementsByClassName("sim-timestampFormatSwitcher--presentation")[0].innerText;
                        var firstDateStringShort = firstDateString.substring(0, firstDateString.indexOf(' '));
                        var firstDate = new Date(firstDateStringShort);

                        for (var i = 0; i < humanIndicatorAll.length; i++) {
                            var currHumanComment = humanIndicatorAll[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                            var currDateString = currHumanComment.getElementsByClassName("sim-timestampFormatSwitcher--presentation")[0].innerText;
                            var currDateStringShort = currDateString.substring(0, currDateString.indexOf(' '));
                            var currDate = new Date(currDateStringShort);

                            var currTouchNum = parseInt((currDate - firstDate) / (1000 * 60 * 60 * 24), 10) + 1 - countWeekendDays(firstDate, currDate);

                            var touchNumDisplay = document.createElement("span");
                            touchNumDisplay.innerHTML = currTouchNum;
                            touchNumDisplay.style = "border-radius: 1rem;width: 3rem;height: 2rem;background-color: #0073bb;text-align: center;color: white;font-size: small;font-weight: bolder;"
                            touchNumDisplay.classList.add("touch-number");
                            var appendHere = currHumanComment.getElementsByClassName("sim-commentCardPrimary--author")[0];
                            appendHere.appendChild(touchNumDisplay);
                        }
                    }
                }
            }
        }
    }, 4000);
}

/*
GET SELLERID FROM OVERVIEW:
const textBox = document.getElementsByClassName("plain-text-display")[0].innerText;
const position1 = textBox.search("MerchantId:")+12;
const position2 = textBox.slice(position1, textBox.length).search(" ")+position1;
const sellerId = textBox.slice(position1, position2);

COPY ON CLICK SELLERID FROM VENDOR INFORMATION:



ON VENDOR INFORMATION TAB, CLICK HEADER Vendor Information details = CLICK edit
Header class="awsui_header_14iqq_1dn1p_37 awsui_with-paddings_14iqq_1dn1p_64 awsui_with-divider_14iqq_1dn1p_54"

*/

// For Merchant ID, use Search with value "Merchant ID:", as explained here: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_search2
// Consider replacing SetTimeout by MutationObserver as stated here: https://superuser.com/questions/1582227/same-code-work-with-chrome-devtools-console-but-doesnt-work-with-tampermonkey. Or use "ajaxStop": $('html').ajaxStop(function);

