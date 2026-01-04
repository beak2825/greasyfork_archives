// ==UserScript==
// @name         Preview paranoia
// @namespace    yay :^)
// @version      0.3
// @description  Adds "preview paranoia" button to your profile
// @author       Sapphire
// @match        https://passthepopcorn.me/user.php?id=*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403341/Preview%20paranoia.user.js
// @updateURL https://update.greasyfork.org/scripts/403341/Preview%20paranoia.meta.js
// ==/UserScript==

function isItMe() { // Check if you're on your own page
    if ($('.user-info-bar__link[href^="user.php?id="]').text().toLowerCase() === $('.page__title').text().toLowerCase()) {
        return true;
    } else {
        return false;
    }
}

function getParanoiaLevel() {
    var paranoiaLevel
    GM.xmlHttpRequest({ // Requests the "Edit" link to get the paranoia level set by the user
        	method: 'GET',
          	url: 'https://passthepopcorn.me/' + $('.user-info-bar__link[href^="user.php?action=edit&userid="]').attr('href'),
          	onload: function (response) {
                var doc = new DOMParser().parseFromString(response.response, 'text/html');
            	paranoiaLevel = parseInt(doc.querySelector('#paranoia option[selected="selected"]').textContent.split(" - ")[0])
                applyParanoia(paranoiaLevel)
            }
        });
    return false;
}

function hidePersonalAndTabs() {
    document.querySelector('.panel[panelName="personal"] ul').children[2].style.display = 'none'; // These lines
    document.querySelector('.panel[panelName="personal"] ul').children[3].style.display = 'none'; // hide your
    document.querySelector('.panel[panelName="personal"] ul').children[4].style.display = 'none'; // personal
    document.querySelector('.panel[panelName="personal"] ul').children[5].style.display = 'none'; // informations
    document.querySelectorAll('.main-column > .tabs > .tabs__bar > .tabs__bar__list > li')[3].style.display = 'none'; // There lines
    document.querySelectorAll('.main-column > .tabs > .tabs__bar > .tabs__bar__list > li')[4].style.display = 'none'; // hide "BP transfer", "purchase history"
    document.querySelectorAll('.main-column > .tabs > .tabs__bar > .tabs__bar__list > li')[5].style.display = 'none'; // and "Stats" tab at the top of the page
}

function applyParanoia(levelOfParanoia) {
    var sidePanels = document.querySelectorAll('.sidebar .panel');
    for (let sidePanel of sidePanels) { // Some node variables to use them easily later
        var title = sidePanel.querySelector('.panel__heading__title').textContent;
        if (title === 'Avatar') {
            sidePanel.setAttribute("panelname", "avatar")
        } else if (title === 'Stats') {
            sidePanel.setAttribute("panelname", "stats")
        } else if (title === 'Next Userclass') {
            sidePanel.setAttribute("panelname", "nextuserclass")
        } else if (title === 'Profile Film') {
            sidePanel.setAttribute("panelname", "profilefilm")
        } else if (title === 'Percentile Rankings (Hover for values)') {
            sidePanel.setAttribute("panelname", "percentile")
        } else if (title === 'Personal') {
            sidePanel.setAttribute("panelname", "personal")
        } else if (title === 'Community') {
            sidePanel.setAttribute("panelname", "community")
        }
    }

    switch (levelOfParanoia) {
        case 0:
            hidePersonalAndTabs()
            break;
        case 1:
            applyParanoia(0)
            document.querySelector('.panel[panelname="stats"] ul').children[6].style.display = 'none'; // Stats panel: HnRs
            document.querySelector('.panel[panelname="community"] ul').children[9].style.display = 'none'; // Community panel: Seeding
            document.querySelector('.panel[panelname="community"] ul').children[10].style.display = 'none'; // Community panel: Seeding Size
            document.querySelector('.panel[panelname="community"] ul').children[11].style.display = 'none'; // Community panel: Average seed time
            document.querySelector('.panel[panelname="community"] ul').children[12].style.display = 'none'; // Community panel: Leeching
            document.querySelector('.panel[panelname="community"] ul').children[16].style.display = 'none'; // Community panel: Bookmarked
            break;
        case 2:
            applyParanoia(1)
            document.querySelector('.panel[panelname="community"] ul').children[13].style.display = 'none'; // Community panel: Snatched
            document.querySelector('.panel[panelname="community"] ul').children[14].style.display = 'none'; // Community panel: Downloaded
            document.querySelectorAll('#user-view > div > div')[1].style.display = 'none'; // Recent snatches panel
            break;
        case 3:
            applyParanoia(2)
            document.querySelector('.panel[panelname="community"] ul').children[5].style.display = 'none'; // Community panel: Requests filled
            document.querySelector('.panel[panelname="community"] ul').children[6].style.display = 'none'; // Community panel: Requests voted
            document.querySelector('.panel[panelname="community"] ul').children[7].style.display = 'none'; // Community panel: Uploaded
            document.querySelector('.panel[panelname="community"] ul').children[8].style.display = 'none'; // Community panel: Snatches from uploads
            document.querySelector('.panel[panelname="percentile"] ul').children[2].title = "Hidden"; // Percentile Rankings: Torrents uploaded
            document.querySelector('.panel[panelname="percentile"] ul').children[3].title = "Hidden"; // Percentile Rankings: Requests filled
            document.querySelector('.panel[panelname="percentile"] ul').children[4].title = "Hidden"; // Percentile Rankings: Bounty spent
			document.querySelector('.panel[panelname="nextuserclass"]').style.display = 'none'; // Hide "Next Userclass" panel if the latter script is enabled
            document.querySelectorAll('#user-view > div > div')[2].style.display = 'none'; // Recent uploads panel
            break;
        case 4:
            applyParanoia(3)
            document.querySelector('.panel[panelname="stats"] ul').children[2].style.display = 'none'; // Stats panel: Uploaded
            document.querySelector('.panel[panelname="stats"] ul').children[3].style.display = 'none'; // Stats panel: Downloaded
            document.querySelector('.panel[panelname="stats"] ul').children[4].style.display = 'none'; // Stats panel: Ratio
            document.querySelector('.panel[panelname="stats"] ul').children[5].style.display = 'none'; // Stats panel: Average seed time
            document.querySelector('.panel[panelname="stats"] ul').children[7].style.display = 'none'; // Stats panel: Points
            document.querySelector('.panel[panelname="stats"] ul').children[8].style.display = 'none'; // Stats panel: Points per hour
            document.querySelector('.panel[panelname="stats"] ul').children[9].style.display = 'none'; // Stats panel: Required ratio
            document.querySelector('.panel[panelname="percentile"] ul').children[0].title = "Hidden"; // Percentile Rankings: Data uploaded
            document.querySelector('.panel[panelname="percentile"] ul').children[1].title = "Hidden"; // Percentile Rankings: Data downloaded
            break;
        case 5:
            applyParanoia(4)
            document.querySelector('.panel[panelname="stats"] ul').children[1].style.display = 'none'; // Stats panel: Last seen
            document.querySelector('.panel[panelname="percentile"]').style.display = "none"; // Hide "Percentile Rankings" panel
            break;
    }
}

(function() {
    'use strict';

    if (isItMe()) {
        $('.linkbox').append('<a href="#" id="preview_paranoia_linkbox" class="brackets">[Preview paranoia]</a>') // Appends the "[Preview paranoia]" link
        $('#preview_paranoia_linkbox').on("click", function() { // When clicking on the link,
            event.preventDefault() // we stop the "change url" event, else url hash will change and "Tag colors" script will not work anymore
            getParanoiaLevel() // we call the function to get Paranoia level settings
        })
    }
})();