// ==UserScript==
// @name VK slaps
// @namespace https://greasyfork.org/en/users/159342-cleresd
// @description It slaps everyone who are online on vk.com by typing '@here' or '*here' and press Ctrl button. It slaps everyone who are online, without who are on mobile now, on vk.com by typing '@herem' or '*herem' and press Ctrl button.
// @version 1.06
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @match https://vk.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/35187/VK%20slaps.user.js
// @updateURL https://update.greasyfork.org/scripts/35187/VK%20slaps.meta.js
// ==/UserScript==

// add callback when '@here' or '*here' is typed and Ctrl key it pressed
let $inputMessage = $("div.im_editable.im-chat-input--text._im_text");
$inputMessage.on("keyup", (e) => {
    if (e.which === 17 && (e.target.textContent === '@here' || e.target.textContent === '*here')) {
        let predicateForMembersOnline = (_, el) => $(el).text() === 'online';
        my.setOnlineMembers(predicateForMembersOnline);
    }
    if (e.which === 17 && (e.target.textContent === '@herem' || e.target.textContent === '*herem')) {
        let predicateForMembersOnlineAndNotMobile = (_, el) => $(el).text() === 'online' && !$(el).children().length;
        my.setOnlineMembers(predicateForMembersOnlineAndNotMobile);
    }
});

window.my = {
    setOnlineMembers: function (predicateForMembers) {
        let onlineMembers = [];

        // open members list
        $('button._im_chat_members.im-page--members').click();

        // wait until list loaded
        let checkExist = setInterval(() => {
            if ($('div.im-member-item--left > div.im-member-iterm--status').length) {
                clearInterval(checkExist);
                setOnlineMembers(predicateForMembers);
            }
        }, 500);

        function setOnlineMembers(predicateForMembers) {
            // get all online members
            let $onlineMembersElements = $('div.im-member-item--left > div.im-member-iterm--status')
                .filter(predicateForMembers)
                .prev()
                .children();

            let onlineMembersElementIds = $onlineMembersElements.map((_, el) => $(el).attr('href').replace('/', '@'));
            let onlineMembersElementNames = $onlineMembersElements.map((_, el) => '(' + $(el).text().split(' ')[0] + ')');

            // get array of final string with online members
            let theCallerPersonId = $('#top_profile_link').attr('href').replace('/', '@');
            for (let i = 0; i < onlineMembersElementIds.length; i++) {
                if (onlineMembersElementIds[i] !== theCallerPersonId)
                    onlineMembers.push(onlineMembersElementIds[i] + ' ' + onlineMembersElementNames[i]);
            }

            // close members list
            $('div.box_x_button').click();

            // add online members to input field
            $('div.im_editable.im-chat-input--text._im_text').click().text(onlineMembers.join(' ')).click();
        }
    }
};
