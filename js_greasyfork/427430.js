// ==UserScript==
// @name         Roblox Role Dropdown
// @description  A simple tool that adds a dropdown menu to change the role of your group members directly from the group wall.
// @author       HotDog6400
// @copyright    Copyright (c) 2021, 2025 HotDog640
// @namespace    https://www.roblox.com/users/694999148/
// @license      MIT
// @version      0.9.6
// @match        https://*.roblox.com/groups/*
// @match        https://*.roblox.com/communities/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427430/Roblox%20Role%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/427430/Roblox%20Role%20Dropdown.meta.js
// ==/UserScript==

/* eslint-disable curly, no-multi-spaces, no-undef */
// @ts-check

// *******************
// * Editable config *
// *******************
const RRDConfig = {
    enabled: true,              // Set this to false if you want to disable RRD.
    dropdown_width: '12rem'     // The width of dropdown. Can be any CSS length.
};

// *********************************************************************
// * Don't edit beyond this point! (unless you know what you're doing) *
// *********************************************************************
if (
    window.location.href.match(/roblox\.com\/(groups|communities)\/\d/) && RRDConfig.enabled
) (async () => {
    'use strict';
    /** @typedef {{ id: number; name: string; rank: number; }[]} Roles */

    console.log('RRD: Starting Roblox Role Dropdown');

    const groupId = window.location.href.split('/')[4];

    /** @type {Roles} */
    const roles = (await $.ajax(`https://groups.roblox.com/v1/groups/${groupId}/roles`)).roles;
    const currentUser = await $.ajax(`https://groups.roblox.com/v1/groups/${groupId}/membership`);

    if (!roles || !currentUser)
        return console.error('RRD: Error: Could not load the required resources');
    if (currentUser.permissions.groupMembershipPermissions.changeRank === false)
        return console.log('RRD: Exiting: Authenticated user can\'t change roles in this group');

    ///////////////////////////////////////////////////////////////////////////

    let RBXAlertTimeout;

    /**
     * @param {string} message
     * @param {boolean} [success]
     */
    const RBXAlert = (message, success = true) => {
        const alertClasses = ['alert-warning', 'alert-success'];
        const alertBox = $('.alert')[0];
        const alertContent = $('.alert-content')[0];

        const resetAlert = () => {
            alertBox.classList.remove('on');
            alertBox.classList.add('alert-success');
        }
        resetAlert()

        clearTimeout(RBXAlertTimeout);

        setTimeout(() => {
            alertBox.classList.remove(alertClasses[success ? 0 : 1]);
            alertBox.classList.add(alertClasses[success ? 1 : 0]);
            alertBox.classList.add('on');
            alertContent.innerText = message;
            RBXAlertTimeout = setTimeout(resetAlert, 5000);
        }, 100);
    }

    /** Global function for the dropdowns to access
     * @param {HTMLAnchorElement} anchor
     * @param {number} userId
     * @param {number} roleId
     * @param {string} roleName
     */
    // @ts-ignore
    window.changeRole = async (anchor, userId, roleId, roleName) => {
        $.ajax({
            method:'PATCH',
            url: `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`,
            data: { roleId }
        }).done(() => {
            const button = $(anchor.parentElement.parentElement.parentElement).find('.input-dropdown-btn')[0];
            button.title = $(button).find('.rbx-selection-label')[0].innerHTML = roleName;
            RBXAlert('Successfully changed role.');
        }).fail(res => {
            RBXAlert(res.responseJSON.errors[0].userFacingMessage, false);
        });
    }

    const allowedRoles = roles.filter(role =>
        role.rank !== 0 && role.rank < currentUser.userRole.role.rank
    );

    /**
     * @param {string} currentRole
     * @param {string} userId
     * @param {boolean} disabled
     * @returns {ChildNode}
     */
    const generateDropdown = (currentRole, userId, disabled) => {
        const template = document.createElement('template');
        template.innerHTML =
            `<div class="input-group-btn">
                <button class="input-dropdown-btn" data-toggle="dropdown" title="${currentRole}" ${disabled ? 'disabled: "disabled"' : ''}>
                    <span class="rbx-selection-label">${currentRole}</span>
                    <span class="icon-down-16x16"></span>
                </button>
                <ul class="dropdown-menu" data-toggle="dropdown-menu" role="menu">
                    ${allowedRoles.map(role =>
                        `<li title="${role.name}">
                            <a onClick="changeRole(this, ${userId}, ${role.id}, '${role.name}')">
                                <span class="text-overflow">${role.name}</span>
                            </a>
                        </li>`
                    ).join('')}
                </ul>
            </div>`;
        return template.content.firstChild;
    }

    /**
     * @param {JQuery<Node>} $post
     */
    // TODO: Make the dropdown disabled if the target's role is the same or higher than the auth'd user
    const putDropdown = ($post) => {
        const userId = /** @type {HTMLAnchorElement} */ ($post.find(
            '.avatar-headshot .avatar-card-link'
        )[0]).href.split('/')[4];
        const footer = $post.find('.text-caption-medium')[0];
        const content = $post.find('.list-body .list-content')[0];

        const footerArr = footer.innerText.split('|');
        const date = footerArr.splice(footerArr.length - 2, 2).join('|').trim();
        const currentRole = footerArr.join('|').trim();

        // const currentRole = footer.innerText.split('|')[0].trim();

        const disabled = false;

        const dropdown = generateDropdown(currentRole, userId, disabled);

        content.style.margin = '0 0 6px';
        footer.style.display = 'inline-grid';
        footer.style.gridTemplateColumns = `${RRDConfig.dropdown_width} auto`;
        footer.style.gridColumnGap = '8px';
        footer.style.alignItems = 'center';

        footer.innerHTML = date;
        footer.prepend(dropdown);
    }

    /**
     * @param {Element} posts
     */
    const createObserver = (posts) => {
        const observer = new MutationObserver(mutationsList =>
            mutationsList.forEach(mutation => {
                const $post = $(mutation.addedNodes[0]);
                if ($post.hasClass('comment'))
                    putDropdown($post);
            })
        );
        observer.observe(posts, { childList: true });
    }

    const posts = document.querySelector('.group-comments');
    if (posts) createObserver(posts);
    else {
        // Wait for posts to exist
        const observer = new MutationObserver(() => {
            const posts = document.querySelector('.group-comments');
            if (posts) {
                createObserver(posts);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
