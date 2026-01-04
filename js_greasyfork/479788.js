// ==UserScript==
// @name         Classic Google Top Bar fixer
// @namespace    https://discord.gg/DNeMsgXaz6
// @version      8.0.0
// @description  Brings back the old black top bar from 2011 - 2014.
// @author       Default
// @match        https://www.google.com/
// @match        https://www.google.com/?*
// @match        https://www.google.com/search*
// @match        https://www.google.com/imghp*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479788/Classic%20Google%20Top%20Bar%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/479788/Classic%20Google%20Top%20Bar%20fixer.meta.js
// ==/UserScript==

var topBar

function detectURL() {
    if (window.location.href.includes('imghp') || window.location.href.includes('tbm=isch')) {
        return 1
    } else if (window.location.href.includes('tbm=nws')) {
        return 5
    } else {
        return 0
    }
}

function toggleMore() {
    event.preventDefault()
    if (!topBar.querySelector('div.tbLeftItems li.tbDropdown a.tbDropdown').classList.contains('tbOpen')) {
        topBar.querySelector('div.tbLeftItems li.tbDropdown a.tbDropdown').classList.add('tbOpen')
        topBar.querySelector('div.tbLeftItems li.tbDropdown div.tbMoreMenu').classList.add('tbOpen')
    } else if (topBar.querySelector('div.tbLeftItems li.tbDropdown a.tbDropdown').classList.contains('tbOpen')) {
        topBar.querySelector('div.tbLeftItems li.tbDropdown a.tbDropdown').classList.remove('tbOpen')
        topBar.querySelector('div.tbLeftItems li.tbDropdown div.tbMoreMenu').classList.remove('tbOpen')
    }
}

function toggleAccount() {
    event.preventDefault()
    if (!topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu').classList.contains('tbOpen')) {
        topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu').classList.add('tbOpen')
    } else if (topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu').classList.contains('tbOpen')) {
        topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu').classList.remove('tbOpen')
    }
}

function getEmail() {
    const emailAddress = document.querySelectorAll('div.gb_Cb')[0];
    if (emailAddress) {
        return emailAddress
    } else {
        return 'Sign in'
    }
}

function createtopBar() {
    /* Create the full html element */
    topBar = document.createElement("div");
    topBar.classList.add('topBar')
    topBar.innerHTML =
    `<div class="tbLeftItems">
        <a href="https://www.google.com">Search</a>
        <a href="https://www.google.com/imghp">Images</a>
        <a href="https://maps.google.com">Maps</a>
        <a href="https://play.google.com">Play</a>
        <a href="https://www.youtube.com">YouTube</a>
        <a href="https://news.google.com">News</a>
        <a href="https://mail.google.com">Gmail</a>
        <a href="https://drive.google.com">Drive</a>
        <li class="tbDropdown">
            <a class="tbDropdown" onClick="toggleMore()" href="https://about.google/intl/en/products/">More</a>
            <div class="tbMoreMenu">
                <a href="https://calendar.google.com">Calendar</a>
                <a href="https://translate.google.com">Translate</a>
                <a href="https://store.google.com/category/phones">Mobile</a>
                <a href="https://books.google.com">Books</a>
                <a href="https://pay.google.com">Offers</a>
                <a href="https://wallet.google.com">Wallet</a>
                <a href="https://shopping.google.com">Shopping</a>
                <a href="https://www.blogger.com">Blogger</a>
                <a href="https://web.archive.org/web/20130801001727id_/http://www.google.com/reader/about/">Reader</a>
                <a href="https://www.google.com/finance/">Finance</a>
                <a href="https://photos.google.com">Photos</a>
                <a href="http://www.google.com/videohp">Videos</a>
                <div class="tbSeperator"></div>
                <a href="https://about.google/intl/en/products/">Even more »</a>
            </div>
        </li>
    </div>
    <div class="tbRightItems">
        <li class="tbDropdown tbRight">
            <a class="tbRight" href="https://accounts.google.com/">Sign in</a>
            <div class="tbAccountMenu">
                <div class="row main">
                    <img id="tbProfilePic"></img>
                    <div class="column">
                        <span id="tbName">Your Name</span>
                        <span id="tbEmail">example@gmail.com</span>
                        <div class="row">
                            <a href="https://myaccount.google.com">Account</a>
                            <div id="tbSep"></div>
                            <a href="https://policies.google.com/privacy">Privacy</a>
                        </div>
                    </div>
                </div>
                <a id="tbSwitch" href="https://accounts.google.com/SignOutOptions?hl=en&continue=https://www.google.com">Switch Accounts</a>
            </div>
        </li>
        <div class="tbSeperator"></div>
        <a class="tbSettings" href="https://www.google.com/preferences"></>
    </div>`
    /* Detect URL and make sure the correct item is selected */
    topBar.querySelector('div.tbLeftItems').children[detectURL()].classList.add('tbSelected')

    /* Listen for when the more button is clicked and call the toggle function */
    topBar.querySelector('div.tbLeftItems li.tbDropdown a.tbDropdown').addEventListener("click", toggleMore);

    /* Call the function to detect if the user is signed in and display their email address */
    setTimeout(function() {
        if (getEmail()) {
            const accountButton = topBar.querySelector('div.tbRightItems li.tbDropdown a')
            const email = getEmail()
            accountButton.textContent = email.nextSibling.textContent
            accountButton.classList.add('tbDropdown')

            topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu div.row img#tbProfilePic').src = document.querySelectorAll('img.gb_n.gbii')[0].src.replace('=s32', '=s256')
            topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu div.row div.column span#tbName').textContent = email.textContent
            topBar.querySelector('div.tbRightItems li.tbDropdown div.tbAccountMenu div.row div.column span#tbEmail').textContent = email.nextSibling.textContent

            /* Listen for when the account button is clicked and call the toggle function */
            accountButton.addEventListener("click", toggleAccount);
        }
    }, 2000);
    document.body.insertBefore(topBar, document.body.firstChild);
}

createtopBar()
