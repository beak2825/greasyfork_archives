// ==UserScript==
// @name         MAM User Menu
// @namespace    https://greasyfork.org/en/users/705546-yyyzzz999
// @version      1.3
// @description  Custom menu with links for MAM
// @author       Spawvn & yyyzzz999
// @match        https://www.myanonamouse.net/*
// @exclude      https://*.myanonamouse.net/pic/*
// @exclude      https://cdn.myanonamouse.net/imagebucket/*
// @exclude      https://cdn.myanonamouse.net/*
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/um64.png
// @supportURL   https://greasyfork.org/en/scripts/462593-mam-user-menu/feedback
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462593/MAM%20User%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/462593/MAM%20User%20Menu.meta.js
// ==/UserScript==

// Screenshot: https://cdn.myanonamouse.net/imagebucket/164109/mem.jpg
(function() {
    var menu = document.querySelector('#menu')
    var newMenu = document.createElement('li')
    newMenu.setAttribute('role', 'presentation')
    newMenu.style.order = '7'

    var newLink = document.createElement('a')
    newLink.setAttribute('id', 'userMenu')
    newLink.setAttribute('tabindex', '0')
    newLink.setAttribute('aria-haspopup', 'true')
    newLink.innerHTML = 'More ↓'; // Keep this short, but call it Extras, MyMenu or whatever you like

    var newList = document.createElement('ul')
    newList.setAttribute('class', 'hidden')
    newList.setAttribute('role', 'menu')
    newList.setAttribute('aria-labelledby', 'userMenu')

    function addItemToMenu(item, menu) {
        var newItem = document.createElement('li')
        newItem.setAttribute('role', 'presentation')
        var newItemLink = document.createElement('a')
        newItemLink.setAttribute('role', 'menuitem')
        newItemLink.setAttribute('tabindex', '0')
        newItemLink.setAttribute('href', item.link)
        newItemLink.innerHTML = item.name
        newItem.appendChild(newItemLink)
        menu.appendChild(newItem)
    }

//Add your custom links below copying the format of the templates here:
    var menuData = [
        {
            link: '/tor/browse.php?&tor[srchIn][narrator]=true&tor[srchIn][title]=true&tor[srchIn][author]=true&tor[cat][]=39&tor[cat][]=49&tor[cat][]=50&tor[cat][]=83&tor[cat][]=51&tor[cat][]=97' +
            '&tor[cat][]=40&tor[cat][]=41&tor[cat][]=106&tor[cat][]=42&tor[cat][]=52&tor[cat][]=98&tor[cat][]=54&tor[cat][]=55&tor[cat][]=43&tor[cat][]=99' +
            '&tor[cat][]=84&tor[cat][]=44&tor[cat][]=56&tor[cat][]=45&tor[cat][]=57&tor[cat][]=85&tor[cat][]=87&tor[cat][]=119&tor[cat][]=88&tor[cat][]=58' +
            '&tor[cat][]=59&tor[cat][]=46&tor[cat][]=47&tor[cat][]=53&tor[cat][]=89&tor[cat][]=100&tor[cat][]=108&tor[cat][]=48&tor[cat][]=111&tor[cat][]=0' +
            '&tor[sortType]=dateDesc&tor[browseFlagsHideVsShow]=1&&&tor[unit]=1',
            name: 'Audio Book Search'
        },
        {
            link: '/tags.php',
            name: 'BB Code Editor' //Also HTML, link found in main preferences, profile Info
        },
        {
            link: '/bitbucket-upload.php',
            name: 'Bit-bucket Images'
        },
        {
            link: '/tor/bookclubs.php', // Duplicate of Fun & Games menu, but this title may clarify Monthly FL list is here too
            name: 'Book Club FL List'
        },
/*         {// Carrier Grade Nat (CGN) Forum Post (Possible unconnectable client cause)
            link: '/f/t/47153/p/1',
            name: 'Carrier Grade Nat'
        }, */
        {
            link: '/f/t/66317/p/1',
            name: 'CSS How To...'
        },
        {
            link: '/f/t/71150/p/1',
            name: 'Docker VPN Guide'
        },
        {
            link: '/f/t/57795',
            name: 'Gift New Uploaders'
        },
        {
            link: '/f/t/41863/p/1',
            name: 'MAM+'
        },
        {
            link: 'https://github.com/gardenshade/mam-plus/wiki/Feature-Overview',
            name: 'MAM+ Guide'
        },
        {
            link: '/f/t/60213/p/1',
            name: 'MAM Ratio Protect'
        },
        {
            link: '/f/t/35296',
            name: 'New Uploader Points'
        },
        {
            link: '/f/t/57795',
            name: 'New Uploader FL'
        },
        {
            link: '/newUsers.php',
            name: 'New Users List'
        },
        {
            link: '/tor/browse.php?tor[minSeeders]=1&tor[maxSeeders]=1',
            name: 'Poorly Seeded List'
        },
        {
            link: '/u/&public', // Found at /f/t/56470/p/p732742#732742
            name: 'Public Profile View' //See your own profile as others see it.
        },
/*         {
            link: '/f/t/49354/p/1',
            name: 'qBittorrent 4 Guide'
        }, */
/*         {
            link: '/json/userBonusHistory.php?type[]=wedgePF',
            name: 'Recent FL History'
        },
        {
            link: '/json/userBonusHistory.php?type[]=millionaires',
            name: "Recent Millionaire's History"
        },
        {
            link: '/json/userBonusHistory.php?type[]=giftPoints',
            name: 'Recent Gift History'
        }, */
        {
            link: '/messages.php?action=viewmailbox&box=-1',
            name: 'Sent Messages'
        },
        {
            link: '/f/t/55465',
            name: 'Shoutbox BBCodes'
        },
/*  //       https://t.myanonamouse.net/json/jsonIp.php
        {
            link: '/json/jsonIp.php',
            name: 'Show My IP address'
        }, */
        {
            link: '/smilies.php',
            name: 'Smilies Text Key'
        },
        {
            link: '/funsmilies.php',
            name: 'Smilies, Fun Key'
        },
        {
            link: '/preferences/index.php?view=style',
            name: 'Style Preferences'
        },
// Default to hidden:
/*         { //Post your Shoutbox notes in Rainbow colors
            link: 'https://www.stuffbydavid.com/textcolorizer',
            name: 'Text Color BBCode'
        }, */
// This can be found at the bottom of the Friends page: https://www.myanonamouse.net/friends.php
/*         {
            link: '/users.php',
            name: 'Users A-Z'
        }, */
        {
            link: '/f/t/58463/p/1',
            name: 'User-made Goodies'
        },
//Link your fav forum post or category, like User Scripts, Apps, and Styles
        // e.g.  annyhanny's Noob Tips
/*         {
            link: '/f/b/113',
            name: 'UserScripts, Apps...'
        },
        */
        /*
        {
            link: '/f/t/69082/p/1',
            name: 'MAM Noob Quick Start Tips'
        },
        */
        /* NOT really hard to find, just renamed Start Here! in Guides
        {
            link: '/guides/?gid=72809',
            name: 'Whale Guide'
        },
        */
    ]

    for(var i=0; i<menuData.length; i++) {
        addItemToMenu(menuData[i], newList)
    }

    newMenu.appendChild(newLink)
    newMenu.appendChild(newList)
    menu.appendChild(newMenu)
})();