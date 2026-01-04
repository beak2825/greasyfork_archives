// ==UserScript==
// @name         Neopets Read Books Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Keeps track of books read by your Neopet and removes their name from the dropdown list in inventory for reading a book if they have already read it. On the home page (https://www.neopets.com/home/index.phtml), it will remove books from the list of options when you select "Read" on a pet, and re-calculate the actual number of unread books you have in your inventory and available to read to them.
// @author       darknstormy
// @match        *://*.neopets.com/books_read.phtml?*
// @match        *://*.neopets.com/moon/books_read.phtml?*
// @match        *://*.neopets.com/inventory.phtml
// @match        *://*.neopets.com/home/index.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504166/Neopets%20Read%20Books%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/504166/Neopets%20Read%20Books%20Tracker.meta.js
// ==/UserScript==

// Home Constants
const petCareListObserver = new MutationObserver((mutations) => {
    var removedBookCount = removeReadBooksFromPetCareList()

    if (removedBookCount > 0) {
        correctUnreadBookCount(removedBookCount)
    }

    listenForReadToPetAction()
})

// Inventory Constants
const SUCCESS_TEXT = "Success"

const itemDescriptionObserver = new MutationObserver((mutations) => {
         if (hasReadToOptions()) {
             let bookTitle = $("#invItemName").text().toString()
             removeOptionsToReadBookToPetsThatHaveAlreadyRead(bookTitle)
             listenForReadActionSubmission(bookTitle)
         }
     })

const inventoryActionResultObserver = new MutationObserver((mutations) => {
     let result = $("#invResult").find("h3")[0].innerHTML

     if (result) {
         if (result.includes(SUCCESS_TEXT)) {
             let readActionSubmitted = GM_getValue("pendingReadAction", {})

             let bookTitle = readActionSubmitted.bookTitle
             let petSelectedForReading = readActionSubmitted.petName

             if (bookTitle && petSelectedForReading) {
                 onBookReadToPet(bookTitle, petSelectedForReading)
             }
         }

         GM_setValue("pendingReadAction", {})
     }
 })

// URL helper functions
function isPetsReadBookListUrl() {
   return window.location.href.includes("books_read.phtml")
}

function isInventoryUrl() {
    return window.location.href.includes("inventory.phtml")
}

function isHomeUrl() {
    return window.location.href.includes("home/index.phtml")
}

// Initialize the reading tracker code!
$(document).ready(function() {
     if (isPetsReadBookListUrl()) {
         storeReadBooks()
     } else if (isInventoryUrl()) {
         setupBookReadingTrackerForInventory()
    } else if (isHomeUrl()) {
         setupBookReadingTrackerForHomePage()
    } else {
         cleanUpUnfinalizedActions()
    }
})

// Inventory Functions
function setupBookReadingTrackerForInventory() {
     itemDescriptionObserver.observe(document.getElementById("invDesc"), {childList: true, subtree: true})
     inventoryActionResultObserver.observe(document.getElementById("invResult"), {childList: true, subtree: true})
}

function hasReadToOptions() {
    return $('#iteminfo_select_action option:contains("Read to")') != undefined
}

function listenForReadActionSubmission(title) {
   $(".invitem-submit").on("click", function () {
       let option = $("#iteminfo_select_action").find("option:selected").val()
       if (option.includes("Read")) {
           let selectedPet = option.split(" ").pop()
           GM_setValue("pendingReadAction", { bookTitle: title,
                                             petName: selectedPet })
       }
   })
}

function removeOptionsToReadBookToPetsThatHaveAlreadyRead(bookTitle) {
    let readByList = getReadBooks()[bookTitle.toLowerCase()]

    if (readByList) {
        readByList.forEach(pet => {
            $("#iteminfo_select_action option:contains(" + pet + ")").remove()
        });
    }
}

// Home Page Functions
function setupBookReadingTrackerForHomePage() {
     resetStoredValuesWhenNotReadingToPet()
     listenForReadingActionFlowTriggered()
}

function listenForReadingActionFlowTriggered() {
     $("#petCareLinkRead").on("click", function() {
        petCareListObserver.observe(document.getElementById("petCareList"), {childList: true, subtree: true})
     })
}

function resetStoredValuesWhenNotReadingToPet() {
    $("div.petCare-buttons").children().not("#petCareLinkRead").each(function() {
        // Disconnect from observing, so that the on-click isn't performed for non-read actions
        $(this).on("click", function() {
            GM_setValue("selectedUnreadBook", {})
            petCareListObserver.disconnect()
        })
    })
}

function correctUnreadBookCount(removedBookCount) {
     let itemCount = $("div.petCare-itemcount")

     if (itemCount) {
         let unreadBookCountTextHtml = itemCount.text()
         let bookCountBeforeRemoval = unreadBookCountTextHtml.match(/\d+$/)
         let actualUnreadCount = Number(bookCountBeforeRemoval) - Number(removedBookCount)
         let replacementText = unreadBookCountTextHtml.replace(/\d+$/, actualUnreadCount)
         itemCount.html(replacementText)
     }
}

function listenForReadToPetAction() {
   // Start by storing any selected book that is clicked from the Read list
   $('div.petCare-itemgrid').find('[data-action~="Read"]').each(function () {
       $(this).on("click", function() {
           let title = $(this).data("itemname")
           let selectedPet = $(this).data("action").split(" ").pop()
           GM_setValue("selectedUnreadBook", {
               bookTitle: title,
               petName: selectedPet })
       })
   })

   // Listen for clicks on the action button
   $("#petCareUseItem").on("click", function () {
       let selectedUnreadBook = GM_getValue("selectedUnreadBook", {})
       let bookTitle = selectedUnreadBook.bookTitle
       let petName = selectedUnreadBook.petName

       if (bookTitle && petName) {
           onBookReadToPet(bookTitle, petName)
       }

       GM_setValue("selectedUnreadBook", {})
   })
}

function removeReadBooksFromPetCareList() {
    var countRemovedBooks = 0

    $('[data-action~="Read"]').each(function() {
        var bookTitle = $(this).data("itemname")

        if (bookTitle) {
            bookTitle = bookTitle.toString()

            let petName = $(this).data("action").toString().split(" ").pop()

            if (petHasAlreadyReadBook(petName, bookTitle)) {
                $(this).remove()
                countRemovedBooks++
            }
        }
    })

    return countRemovedBooks
}

// Clean Up Functions
function cleanUpUnfinalizedActions() {
    GM_setValue("pendingReadAction", {})
    GM_setValue("selectedUnreadBook", {})
}

// Storage Functions (this is how we track what has been read so far)
function onBookReadToPet(bookTitle, petName) {
    // This shouldn't ever happen but if it does, we'll short-circuit here
    if (petHasAlreadyReadBook(petName, bookTitle)) {
       return
    }

    let bookTitleSanitized = bookTitle.toLowerCase()
    var bookList = getReadBooks()

    var readPetList = bookList[bookTitleSanitized]

    if (readPetList) {
        readPetList.push(petName)
    } else {
        readPetList = [petName]
    }

    bookList[bookTitleSanitized] = readPetList
    GM_setValue("readBooks", bookList)
}

function petHasAlreadyReadBook(petName, bookTitle) {
    let readByList = getReadBooks()[bookTitle.toLowerCase()]
    return readByList && readByList.includes(petName)
}

function getReadBooks() {
    return GM_getValue("readBooks", {})
}

function storeReadBooks() {
    let pet = new URLSearchParams(window.location.search).get('pet_name')

    let bookList = getReadBooks()

    $("td.content").find("td:nth-child(2)").each(function(i) {
        // Skip the first tr because it is the table "header" of the read books list
        if (i == 0) {
            return
        }

       let bookTitle = $(this).html().match(/(?:(?!:).)*/).toString()
       onBookReadToPet(bookTitle, pet)
    })
}
