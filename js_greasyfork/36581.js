// ==UserScript==
// @name         Wanikani Forums: User Tags
// @namespace    https://greasyfork.org/en/scripts/36581-wanikani-forums-user-tags
// @version      1.0.2
// @description  Makes it possible to tag users on the forums.
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36581/Wanikani%20Forums%3A%20User%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/36581/Wanikani%20Forums%3A%20User%20Tags.meta.js
// ==/UserScript==

;(function ($, wfs) {
    var userList = []
    initialiseScript()

    // Adds info to the current page
    function initialiseScript() {
        userList = getUserList()
        insertStyle()
        wfs.wait('.post-stream .topic-post', addTags)
    }

    // Retrieves the list of users and their tags
    function getUserList() {
        userList = localStorage.getItem('WKFTags')
        if (!userList) {
            userList = {}
        } else {
            userList = $.parseJSON(userList)
        }
        return userList
    }

    // Adds the tags to the posts
    function addTags() {
        $('.topic-post > article:not(.tagged)').each(function (i) {
            $(this).addClass('tagged')
            var userID = $(this).attr('data-user-id')
            var postID = $(this).attr('data-post-id')
            const userTag = userList[userID] || ''
            $(this)
                .find('>> .topic-body:not(.embedded-posts) .names')
                .append(
                '<span class="user-tag">' +
                '    <input autocomplete="off" value="' +
                userTag +
                '"></input>' +
                '</span>',
            )
            let input = $(this).find('.user-tag input')
            input.on('keydown', (e) => saveTags(userID, postID, event.target))
        })
    }

    // Saves the tag to the user
    function saveTags(userID, postID, input) {
        setTimeout((_) => {
            // Give DOM time to update the input value
            let newTag = input.value
            updateTags(userID, postID, newTag)
            userList[userID] = newTag
            localStorage.setItem('WKFTags', JSON.stringify(userList))
        }, 10)
    }

    // Updates all other posts by the same user to the new tag
    function updateTags(userID, postID, tag) {
        $('article[data-user-id="' + userID + '"]').each(function () {
            if ($(this).attr('data-post-id') != postID) $(this).find('.user-tag input').val(tag)
        })
    }

    // Adds styling to the tags
    function insertStyle() {
        $('head').append(
            '<style class="user-tag">' +
            '    .user-tag {' +
            '        flex: 1;' +
            '        padding-right: 4px;' +
            '    }' +
            '' +
            '    .user-tag input {' +
            '        background: transparent;' +
            '        border: none;' +
            '        width: 100%;' +
            '    }' +
            '' +
            '    .user-tag input:focus {' +
            '        outline-offset: -1px;' +
            '        outline-style: dashed;' +
            '        outline-color: inherit;' +
            '    }' +
            '</style>',
        )
    }
})(window.jQuery, window.wfs)
