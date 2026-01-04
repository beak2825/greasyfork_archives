// ==UserScript==
// @name         Wanikani Forums: Koichifier
// @namespace    Wanikani Forums: Koichifier
// @version      1.7.
// @description  Makes everyone Koichi
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37807/Wanikani%20Forums%3A%20Koichifier.user.js
// @updateURL https://update.greasyfork.org/scripts/37807/Wanikani%20Forums%3A%20Koichifier.meta.js
// ==/UserScript==

var userList = ''
var userName = ''
var userID = ''
var subscription = ''
var subColor = ''
var subBackground = '#fff'
;(function () {
    'use strict'

    // get list of users to flair
    userList = localStorage.getItem('WKFKoichify')
    if (userList === null || userList === '') {
        userList = []
    } else {
        userList = $.parseJSON(userList)
    }
    console.log('Koichified users: ' + userList)

    // Triggers
    // when you load the window
    window.addEventListener('load', initKoichi)

    // when navigating
    ;(function (history) {
        var pushState = history.pushState
        history.pushState = function (state) {
            initKoichi()
            return pushState.apply(history, arguments)
        }
    })(window.history)

    // back and forward buttons
    window.addEventListener('popstate', initKoichi)
})()

function initKoichi() {
    waitForKeyElements('#topic-bottom', function () {
        $('.posts-wrapper').on('click', '.trigger-user-card', addButton)
        $(userList).each(function (e, i) {
            if (i % 2 == 0) {
                koichify(String(this), userName)
            } else {
                userName = String(this)
            }
        })
    })
}

function addButton() {
    waitForKeyElements('.usercard-controls', function () {
        userName = $('#user-card h1 a').text().trim()
        userID = $('.trigger-user-card[href="/u/' + userName + '"]')
            .closest('article')
            .attr('data-user-id')
        $('.usercard-controls').append(
            '<li><button onclick="toggleKoichi(\'' +
                userName +
                "', " +
                userID +
                ")\" class='btn koichiButton' title='Toggle flair for this user'>Toggle Koichi!</button></li>",
        )
        //Koichify in usercard
        if (userList.includes(userName)) {
            koichify(userID, userName)
        }
    })
}

toggleKoichi = function (userName, userID) {
    if (userList.includes(userID)) {
        userList.splice(userList.indexOf(userName), 2)
        unkoichify(userID, userName)
    } else {
        userList.push(userName, userID)
        koichify(userID, userName)
    }
    localStorage.setItem('WKFKoichify', JSON.stringify(userList))
}

function koichify(userID, userName) {
    if ($('head style[user-id="' + userID + '"]').length == 0) {
        $('head').append(
            '<style user-id="' +
                userID +
                '">' +
                '   [href="/u/' +
                userName.toLowerCase() +
                '"] img.avatar,' +
                '	[data-user-id="' +
                userID +
                '"] img.avatar {' +
                '       content: url("https://discourse-cdn-sjc1.com/business2/user_avatar/community.wanikani.com/vanilla/45/111900_1.png");' +
                '	}' +
                '   [href="/u/' +
                userName +
                '"] .avatar-flair::after,' +
                '   [data-user-id="' +
                userID +
                '"] .avatar-flair::after {' +
                '       content: "∞" !important;' +
                '	}' +
                '   [href="/u/' +
                userName +
                '"] .avatar-flair,' +
                '   [data-user-id="' +
                userID +
                '"] .avatar-flair {' +
                '       color: white;' +
                '       background: #dd0093 !important;' +
                '	}' +
                '   .names .username [href="/u/' +
                userName +
                '"] {' +
                '       width: 40px;' +
                '       display: flex;' +
                '   }' +
                '   .names .username [href="/u/' +
                userName +
                '"]::before {' +
                '       content: "koichi";' +
                '   }' +
                '</style>',
        )
        $('#user-card .avatar-flair').css({ background: '#dd0093' })
    }
}

function unkoichify(userID) {
    $('head style[user-id="' + userID + '"]').remove()
    //unkoichify usercard
    subscription = $('#user-card .avatar-flair').attr('class')
    if (subscription.includes('admins')) {
        subBackground = '#dd0093'
    } else if (subscription.includes('60')) {
        subBackground = '#fbc042'
    } else if (subscription.includes('lifetime')) {
        subBackground = '#d580ff'
    } else if (subscription.includes('paid')) {
        subBackground = '#89d5ff'
    } else {
        subColor = '#000'
        subBackground = '#f1f3f5'
    }
    $('#user-card .avatar-flair').css({ color: subColor, background: subBackground })
}
