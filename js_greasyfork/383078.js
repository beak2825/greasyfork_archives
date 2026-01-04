// ==UserScript==
// @name         Steffes Group Website Admin Utilities
// @namespace    https://github.com/DannyG72
// @version      4.1
// @description  Adds a few quick-link buttons to the Steffes Group website for quick assistance and admin purposes. Quickly Search Bidders, Launch the Auction Backend, and edit an auction's lots.
// @author       Daniel Glynn
// @match        https://steffesgroup.com/*
// @match        https://steffesapi.nextlot.com/login/login
// @homepage     https://raw.githubusercontent.com/DannyG72/SteffesWebsite/master/SteffesUtilities.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383078/Steffes%20Group%20Website%20Admin%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/383078/Steffes%20Group%20Website%20Admin%20Utilities.meta.js
// ==/UserScript==
(function() {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.custom-button-for-stuff{' +
    'background: #da291c;' +
    'color: #fff;' +
    'border-radius: 10px;' +
    'border: none;' +
    'box-shadow: none;' +
    'cursor: pointer;' +
    'padding-left: 5px;' +
    'margin-right: 5px;' +
    'padding-right: 5px;' +
    'height: 30px;' +
    'font-size: 18px;' +
    'z-index: 1034;' +
    'outline: none;' +
    'display: inline-block;' +
    'min-width: 40px;' +
    '}' +
    '.custom-button-for-stuff:hover{' +
    'background: #fff;' +
    'color: #000;' +
    '}' +
    '.auctionDropDown{' +
    'position: relative;' +
    'display: inline-block;' +
    '}' +
    '.dropdown-content{' +
    'display: none;' +
    'position: absolute;' +
    'background-color: #f6f6f6;' +
    'min-width: 210px;' +
    'overflow: auto;' +
    'border: 1px solid #ddd;' +
    '}' +
    '.filtered-auction{' +
    'border-top: 8px solid #cccccc !important;' +
    'border-bottom: 8px solid #cccccc !important;' +
    'border-left: 1px solid #cccccc !important;' +
    'border-right: 1px solid #cccccc !important;' +
    'padding: 10px 15px 0px;' +
    'position: relative;' +
    'top: -29px;' +
    '}' +
    '.filtered-auction .heading{' +
    'color: #cc0000;' +
    'font-size: 18px;' +
    'font-weight: bold;' +
    '}' +
    '.countdownText{' +
    'background: #da291c;' +
    'color: #fff;' +
    'border-radius: 10px;' +
    'border: none;' +
    'box-shadow: none;' +
    'cursor: pointer;' +
    'padding-left: 5px;' +
    'margin-right: 5px;' +
    'padding-right: 5px;' +
    'height: 30px;' +
    'font-size: 18px;' +
    'z-index: 1034;' +
    'outline: none;' +
    'display: inline-block;' +
    'min-width: 40px;' +
    '}' +
    '.custom-div-parent{' +
    'display: inline-flex;' +
    'align-items: center;' +
    'justify-content: center;' +
    'position: fixed;' +
    'width: 955px;' +
    'height: 60px;' +
    'top: 0;' +
    'left: 50%;' +
    'transform: translate(-50%, 0);' +
    'z-index: 1032;' +
    'background: #da291c;' +
    '}' +
    '.custom-div-grandParent{' +
    'display: inline-flex;' +
    'align-items: center;' +
    'justify-content: center;' +
    'position: fixed;' +
    'width: 100%;' +
    'height: 60px;' +
    'top: 0;' +
    'left: 50%;' +
    'transform: translate(-50%, 0);' +
    'z-index: 1031;' +
    'background: #da291c;' +
    '}' +
    '.custom-left-side{' +
    'position: fixed;' +
    'width: 65%;' +
    'height: 100%;' +
    'display: flex;' +
    'transform: translate(-28%, 0);' +
    'z-index: 1033;' +
    'align-items: center;' +
    'justify-content: flex-start;' +
    '}' +
    '.custom-right-side{' +
    'position: fixed;' +
    'width: 45%;' +
    'height: 100%;' +
    'transform: translate(67%, 0);' +
    'display: flex;' +
    'z-index: 1033;' +
    'align-items: center;' +
    'justify-content: flex-end;' +
    '}' +
    '.custom-admin-button{' +
    'justify-self: center;' +
    'min-width: 113px; !important' +
    'z-index: 1034;' +
    'padding-left: 10px;' +
    'display: inline-block;' +
    '}' +
    '.custom-search-input{' +
    'height: 30px;' +
    'width: 170px;' +
    'z-index: 1034;' +
    'border-radius: 10px;' +
    'outline: none;' +
    'border: none;' +
    'box-shadow: none;' +
    'padding-left: 10px;' +
    'margin-right: 5px;' +
    'font-size: 18px;' +
    '}' +
    '.custom-select-input{' +
    'width: 100px;' +
    'height: 30px;' +
    'font-size: 18px;' +
    'outline: none;' +
    'z-index: 1034;' +
    'margin-right: 5px;' +
    'border-radius: 10px;' +
    '}'

    document.getElementsByTagName('head')[0].appendChild(style);

    'use strict';

    //Gets the current page url and strips the auction ID from it
    let currentPageUrl = window.location.href;
    let AuctionID = ((currentPageUrl.split("").reverse().join("").split("-"))[0]).split("").reverse().join("");
    let nextLotBidderButton = document.createElement("Button");

    let grandParent = document.createElement('div');
    grandParent.className = 'custom-div-grandParent';
    document.body.appendChild(grandParent)

    let parent = document.createElement('div');
    parent.className = 'custom-div-parent';
    grandParent.appendChild(parent);


    let leftSide = document.createElement('div');
    leftSide.className = 'custom-left-side';
    parent.appendChild(leftSide);

    let rightSide = document.createElement('div');
    rightSide.className = 'custom-right-side';
    parent.appendChild(rightSide);

    let loginButton = document.getElementsByClassName("loginButton")[0]
    let steffesLogo = document.createElement("IMG");
    steffesLogo.id = "SteffesLogo";
    steffesLogo.style.marginRight = '5px';
    steffesLogo.setAttribute("src", "https://i.imgur.com/5UVVBEC.png");
    //steffesLogo.onmouseover="" style="cursor: pointer"
    steffesLogo.style.cursor = "pointer";
    leftSide.appendChild(steffesLogo);

    if (currentPageUrl.startsWith('https://steffesapi.nextlot.com/login/login')) {
        //let nextLotLoginButton = document.getElementsByClassName("btn btn-primary")[0]
        //rightSide.appendChild(nextLotLoginButton)
        let countdown = document.createElement('div');
        countdown.id = "countdown";
        countdown.className = 'countdownText';
        countdown.style.width = '600px'
        countdown.style.zIndex = '1035'
        countdown.style.marginTop = "-12px"
        parent.appendChild(countdown)
        var timeleft = 25;
        var downloadTimer = setInterval(function() {
            document.getElementById("countdown").innerHTML = "If you are already signed into NextLot, ignore this webpage. It will automatically close in " + timeleft + " seconds. Please sign in below if NextLot pages are not working.";
            timeleft -= 1;
            if (timeleft < 0) {
                clearInterval(downloadTimer);
                document.getElementById("countdown").innerHTML = "Finished"
            }
        }, 1000);
        setTimeout(window.close, 26000)
    }



    //Hides mobile site indicators/changes header color if present
    let div = document.getElementById("mobileSiteDiv");
    if (div) {
        div.parentNode.removeChild(div)
    }; // Hides it
    $('img[src="https://cdn.steffesgroup.com/static-files/images/interior/Steffes-Auctioneers-logo.png"]').hide();
    let oldHeader = document.getElementById('header-content')
    oldHeader.style.background = "#da291c"
    let oldHeaderBackground = document.getElementById('header-bg')
    oldHeaderBackground.style.background = "#da291c"

    steffesLogo.onclick = function(event) {
        window.location.href = 'https://steffesgroup.com';
    };
    try {
        loginButton.style.marginTop = "0px"
        rightSide.appendChild(loginButton)
    } catch (err) {

        if ((currentPageUrl.startsWith('https://steffesgroup.com/Home/Auctions')) || (currentPageUrl.startsWith('https://steffesgroup.com/Auction/AllAuctions')) || (currentPageUrl.startsWith('https://steffesgroup.com/Auction/ArchivedAuctions'))) {
            if (currentPageUrl.includes('?Filter=')) {
                let auctionSearchString = currentPageUrl.split('?Filter=')[1]
                auctionSearchString = auctionSearchString.replace('%20', ' ')
                console.log(auctionSearchString)
                if (auctionSearchString.length > 0) {
                    filterAuctions(auctionSearchString)
                }
            } else {
                if (currentPageUrl.includes('&Filter=')) {
                    let auctionSearchString = currentPageUrl.split('&Filter=')[1]
                    auctionSearchString = auctionSearchString.replace('%20', ' ')
                    console.log(auctionSearchString)
                    if (auctionSearchString.length > 0) {
                        filterAuctions(auctionSearchString)
                    }
                }
            }

            //Creates a search bar for searching auctions.
            let auctionSearch = document.createElement("INPUT");

            auctionSearch.id = "auctionSearch";

            auctionSearch.onclick = function(event) {
                console.log('yeet');
            };
            auctionSearch.className = 'custom-search-input';

            if (currentPageUrl.includes('?Filter=')) {
                let auctionSearchString = currentPageUrl.split('?Filter=')[1]
                auctionSearchString = auctionSearchString.replace('%20', ' ')
                auctionSearch.defaultValue = auctionSearchString
            }

            if (currentPageUrl.includes('&Filter=')) {
                let auctionSearchString = currentPageUrl.split('&Filter=')[1]
                auctionSearchString = auctionSearchString.replace('%20', ' ')
                auctionSearch.defaultValue = auctionSearchString
            }



            auctionSearch.setAttribute("type", "text");
            auctionSearch.placeholder = "Search Auctions...";
            auctionSearch.style.width = '155px';

            //Creates a go button for activating the auction search bar.
            let auctionSearchCurrentGo = document.createElement("Button");
            auctionSearchCurrentGo.id = "auctionSearchCurrentGo";
            auctionSearchCurrentGo.innerHTML = "Current";
            auctionSearchCurrentGo.className = 'custom-button-for-stuff'
            auctionSearchCurrentGo.style.width = '77px';
            auctionSearchCurrentGo.addEventListener("click", function() {
                let auctionString = document.getElementById("auctionSearch").value;
                auctionString = auctionString.replace(/ /g, '%20');
                if (((currentPageUrl.includes('?Filter=')) && ((currentPageUrl.endsWith('?Filter=')) == false)) || (((currentPageUrl.includes('ArchivedAuctions')) == false) && ((currentPageUrl.endsWith('Filter=')) == false) && (((currentPageUrl.endsWith('Auctions')) == false)))) {
                    // auctionSearchString = currentPageUrl.split('?Filter=')[1]
                    // auctionSearchString = auctionSearchString.replace('%20',' ')
                    window.location.href = 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString;
                } else {
                    if ((auctionString.length > 0) && (currentPageUrl.endsWith('Auctions'))) {
                        filterAuctions(auctionString)
                        history.pushState({}, null, 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString);
                        currentPageUrl = 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString
                    } else {
                        window.location.href = 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString;

                    }
                }


            })

            auctionSearch.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    let auctionString = document.getElementById("auctionSearch").value;
                    auctionString = auctionString.replace(/ /g, '%20');
                    if (((currentPageUrl.includes('?Filter=')) && ((currentPageUrl.endsWith('?Filter=')) == false)) || (((currentPageUrl.endsWith('Filter=')) == false) && (((currentPageUrl.endsWith('Auctions')) == false)))) {
                        // auctionSearchString = currentPageUrl.split('?Filter=')[1]
                        // auctionSearchString = auctionSearchString.replace('%20',' ')
                        window.location.href = 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString;
                    } else if (currentPageUrl.includes('ArchivedAuctions')) {
                        window.location.href = 'https://steffesgroup.com/Auction/ArchivedAuctions?&Sort=Name&PageSize=200&Page=1&Filter=' + auctionString;


                    }
                    else {
                        if ((auctionString.length > 0) && (currentPageUrl.endsWith('Auctions'))) {
                            filterAuctions(auctionString)
                            history.pushState({}, null, 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString);
                            currentPageUrl = 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString
                        } else {
                            window.location.href = 'https://steffesgroup.com/Auction/AllAuctions?Filter=' + auctionString;

                        }
                    }
                }
            });


            //Creates a go button for activating the search bar.
            let auctionSearchArchivedGo = document.createElement("Button");
            auctionSearchArchivedGo.id = "auctionSearchArchivedGo";
            auctionSearchArchivedGo.innerHTML = "Archived";
            auctionSearchArchivedGo.className = 'custom-button-for-stuff'
            auctionSearchArchivedGo.style.width = '84px';
            auctionSearchArchivedGo.addEventListener("click", function() {
                let auctionString = document.getElementById("auctionSearch").value;
                auctionString = auctionString.replace(/ /g, '%20');
                if ((currentPageUrl.includes('&Filter=')) && ((currentPageUrl.endsWith('&Filter=')) == false)) {
                    let auctionSearchString = currentPageUrl.split('&Filter=')[1]
                    auctionSearchString = auctionSearchString.replace('%20', ' ')
                    window.location.href = 'https://steffesgroup.com/Auction/ArchivedAuctions?&Sort=Name&PageSize=200&Page=1&Filter=' + auctionString;
                } else {
                    window.location.href = 'https://steffesgroup.com/Auction/ArchivedAuctions?&Sort=Name&PageSize=200&Page=1&Filter=' + auctionString
                    currentPageUrl = 'https://steffesgroup.com/Auction/ArchivedAuctions?&Sort=Name&PageSize=200&Page=1&Filter=' + auctionString
                }
            })


            rightSide.appendChild(auctionSearch)
            rightSide.appendChild(auctionSearchCurrentGo)
            rightSide.appendChild(auctionSearchArchivedGo)
        }

        //Creates a search bar for searching bidders.
        let bidderSearch = document.createElement("INPUT");
        bidderSearch.id = "bidderSearch";
        bidderSearch.className = 'custom-search-input';
        bidderSearch.setAttribute("type", "text");
        bidderSearch.placeholder = "Search Bidders...";

        //Creates a go button for activating the search bar.
        let bidderButton = document.createElement("Button");
        bidderButton.id = "bidderButton";
        bidderButton.innerHTML = "Search";
        bidderButton.className = 'custom-button-for-stuff'
        bidderButton.style.width = '70px';

        if (currentPageUrl.startsWith('https://steffesgroup.com/Admin/SearchBidder')) {
            bidderButton.addEventListener("click", function() {
                let bidderString = document.getElementById("bidderSearch").value;
                bidderString = bidderString.replace(/ /g, '%20');
                window.location.href = 'https://steffesgroup.com/Admin/SearchBidders?SearchText=' + bidderString;
            });

            bidderSearch.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    let bidderString = document.getElementById("bidderSearch").value;
                    bidderString = bidderString.replace(/ /g, '%20');
                    window.location.href = 'https://steffesgroup.com/Admin/SearchBidders?SearchText=' + bidderString;;
                }
            });


            console.log('creating nextlotBidderbutton')
            nextLotBidderButton.id = "nextLotBidderButton";
            nextLotBidderButton.className = 'custom-button-for-stuff'
            nextLotBidderButton.innerHTML = "Search NextLot";
            try {
                let oldSearch = currentPageUrl.split('SearchText=')[1]
                oldSearch = oldSearch.replace('%20', ' ')
                oldSearch = toTitleCase(oldSearch)
                bidderSearch.defaultValue = oldSearch
            } catch (err) {}
            nextLotBidderButton.style.width = '140px'
            nextLotBidderButton.addEventListener("click", function() {
                let bidderString = document.getElementById("bidderSearch").value;
                bidderString = bidderString.replace(/ /g, '%20');
                openInNewTab('https://steffesapi.nextlot.com/login/login')
                sleep(2000)
                openInNewTab('https://steffesapi.nextlot.com/admin/new#/users?q=' + bidderString);
            })
        } else {
            bidderSearch.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    let bidderString = document.getElementById("bidderSearch").value;
                    bidderString = bidderString.replace(/ /g, '%20');
                    openInNewTab('https://steffesgroup.com/Admin/SearchBidders?SearchText=' + bidderString);;
                }
            });

            bidderButton.addEventListener("click", function() {

                let bidderString = document.getElementById("bidderSearch").value;
                bidderString = bidderString.replace(/ /g,'%20');
                openInNewTab('https://steffesgroup.com/Admin/SearchBidders?SearchText='+bidderString);
            });
        }

        //Creates a button to open the SteffesGroup admin portal.
        if (currentPageUrl.includes('Admin')) {} else {
            let adminButton = document.createElement("Button");
            adminButton.innerHTML = "Admin Portal";
            adminButton.id = "adminButton";
            adminButton.className = 'custom-button-for-stuff'
            adminButton.style.width = '120px'
            adminButton.addEventListener("click", function() {
                openInNewTab('https://steffesgroup.com/Admin/Auctions');
            });
            leftSide.appendChild(adminButton);
        }

        leftSide.appendChild(bidderSearch);
        leftSide.appendChild(bidderButton);
        if (currentPageUrl.includes('https://steffesgroup.com/Admin/SearchBidders?SearchText=')) {
            leftSide.appendChild(nextLotBidderButton)
        }

        //Checks to see if the current page is an auction page, if so, append auction specific buttons.
        if (currentPageUrl.startsWith('https://steffesgroup.com/Auction/AuctionDetails?Name=')) {
            //Creates the backend button for an auction page.
            let backendButton = document.createElement("Button");
            backendButton.innerHTML = "Backend Page";
            backendButton.id = "backendButton";
            backendButton.className = 'custom-button-for-stuff custom-admin-button'
            backendButton.addEventListener("click", function() {
                //openInNewTab('https://steffesgroup.com/Admin/AuctionDetails?auctionId=' + AuctionID);
                window.location.href = 'https://steffesgroup.com/Admin/AuctionDetails?auctionId=' + AuctionID
            });

            let html = content.innerHTML;
            //try {
            let absenteeBids = document.createElement("Button");
            absenteeBids.innerHTML = "NextLot Page";
            absenteeBids.id = "absenteeBids";
            absenteeBids.className = 'custom-button-for-stuff custom-admin-button'
            absenteeBids.style.width = '130px'
            absenteeBids.style.minWidth = '130px'

            try {
                let tmpListNextLotBackendId = (html.split('data-sale-id="'))[1]
                let nextLotBackendId = (tmpListNextLotBackendId.split('"'))[0]
                absenteeBids.addEventListener("click", function() {
                    //openInNewTab('https://steffesapi.nextlot.com/login/login')
                    openInNewTab('https://steffesapi.nextlot.com/admin_lot?association=lots&parent_scaffold=admin_sale&sale_id=' + nextLotBackendId + '&adapter=_list_inline_adapter');
                });
            } catch (err) {}
            //}
            //catch(err){
            //}






            try {
                let nextLotBackendButton = document.createElement("Button");
                nextLotBackendButton.innerHTML = "NextLot Page";
                nextLotBackendButton.id = "nextLotBackendButton";
                nextLotBackendButton.className = 'custom-button-for-stuff custom-admin-button'
                let html = content.innerHTML;
                let tmpListNextLotBackendId = (html.split('data-sale-id="'))[1]
                let nextLotBackendId = (tmpListNextLotBackendId.split('"'))[0]
                console.log(nextLotBackendId)
                nextLotBackendButton.addEventListener("click", function() {
                    openInNewTab('https://steffesapi.nextlot.com/public/sales/' + nextLotBackendId);
                });
            } catch (err) {}

            let lotBackendGo = document.createElement("Button");
            lotBackendGo.innerHTML = "Go";
            lotBackendGo.id = "lotBackendGo";
            lotBackendGo.className = 'custom-button-for-stuff'
            lotBackendGo.addEventListener("click", function() {
                let selected = selectList.selectedOptions[0].value;
                if (selected == 'View All') {
                    if (currentPageUrl.includes('&')) {
                        let lotViewAllUrl = currentPageUrl.split('&')
                        window.location.href = lotViewAllUrl[0] + '&PageSize=500'
                    } else {
                        window.location.href = currentPageUrl + '&PageSize=500'
                    }
                } else {
                    let html = content.outerHTML;
                    let splitHTML = (html.split(selected))[0];
                    let splitLots = splitHTML.split('datatablestart-lot-');
                    let currentAuc = splitLots.pop();
                    let foundLotID = currentAuc.split('" style="')[0];
                    let backendLotLink = 'https://steffesgroup.com/Admin/LotDetails?lotId=' + foundLotID;
                    openInNewTab(backendLotLink);
                }
            });
            if ((html.includes('<img src="https://cdn.steffesgroup.com/static-files/images/interior/viewWebcastButton.png" alt="View webcast button">')) || (html.includes('<img src="https://cdn.steffesgroup.com/static-files/images/interior/webcast-available-icon.png" alt="View webcast button">'))) {
                rightSide.appendChild(absenteeBids)
            }
            rightSide.appendChild(backendButton);
            try {
                rightSide.appendChild(nextLotBackendButton);
            } catch (err) {}
            //Takes the lotIDS letiable from the SteffesGroup website and splits it into a array to be used for the options in the selection list
            let lotIDS = lotids.split('-');
            lotIDS.pop();
            let arrayOpts = lotIDS;

            //Creates the selectList object for the auction lots.
            let selectList = document.createElement("SELECT");
            selectList.className = 'custom-select-input';
            selectList.id = "mySelect";
            if (arrayOpts.length > 0) rightSide.appendChild(selectList);

            //Create and append the options to the select list.
            try {
                let option = document.createElement("option");
                option.value = 'View All';
                option.text = 'View All';
                selectList.appendChild(option)
                for (let i = 0; i < arrayOpts.length; i++) {
                    let option = document.createElement("option");
                    let lotIDHTML = document.getElementById('lot-container-' + arrayOpts[i]);
                    let lotNumber = lotIDHTML.querySelector(`[id*='Lot-']`).outerHTML;
                    let tmpStr = lotNumber;
                    let tmpListCurrentLot = tmpStr.split('<span id="');
                    let tmpStrCurrentLot = tmpListCurrentLot.slice(1);
                    let currentLotlist = tmpStrCurrentLot.pop(0);
                    let tmpListCurrentLot2 = currentLotlist.split('" class="lot-number-heading');
                    let currentLot = tmpListCurrentLot2[0];

                    option.value = currentLot;
                    option.text = currentLot;
                    if (arrayOpts.length > 0) selectList.appendChild(option);
                }

                //Create and append the Go button for the lot listing
                if (arrayOpts.length > 0) rightSide.appendChild(lotBackendGo);
            } catch (err) {
                rightSide.removeChild(selectList)
            }
            $(".advancedSearchBtn").hide();
        }
    }


})();

//Opens a url in a new tab
function openInNewTab(url) {
    let win = window.open(url, '_blank');
    win.focus();
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}


function filterAuctions(searchString) {

    var auctions = document.getElementsByClassName("auction-left")
    let modifiedAuctions = []
    for (let i = 0; i < auctions.length; i++) {
        let auction = auctions[i]
        let parentDIV = auction.parentElement.parentElement.parentElement.parentElement.parentElement
        parentDIV.setAttribute("id", "auction--" + i.toString() + '--');
        parentDIV.setAttribute('class','filtered-auction')
        let auctionHTML = auction.outerHTML.toLowerCase()
        let searchText = searchString.toLowerCase()
        if (auctionHTML.includes(searchText)) {} else {
            modifiedAuctions.push(parentDIV.id)
        }
    }
    modifiedAuctions.forEach(function(auctionID) {
        var element = document.getElementById(auctionID);
        element.parentNode.removeChild(element);
    })


}
