// ==UserScript==
// @name         HLTV Forum Enhancements
// @namespace    plennhar-hltv-forum-enhancements
// @version      0.1.1
// @description  Adds a few additional features to the HLTV forums such as extended forums sidebar or sorting of the sidebar by comments or creation date.
// @author       Plennhar
// @match        https://www.hltv.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/504452/HLTV%20Forum%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/504452/HLTV%20Forum%20Enhancements.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2024 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(function() {
    'use strict';

    console.log("Initializing script");

    const forums = {
        'https://www.hltv.org/forums/offtopic': 'red',
        'https://www.hltv.org/forums/counterstrike': '#ffae00',
        'https://www.hltv.org/forums/fantasy': '#633da0',
        'https://www.hltv.org/forums/betting': 'darkgreen',
        'https://www.hltv.org/forums/hardware': 'silver',
        'https://www.hltv.org/forums/bugs': '#3d6ea0'
    };

    function fetchPosts(url) {
        console.log(`Requesting data from ${url}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    console.log(`Received response from ${url}`);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    resolve({ doc, url });
                },
                onerror: function(error) {
                    console.error(`Failed to fetch data from ${url}`, error);
                    reject(error);
                }
            });
        });
    }

function addPostsToSidebar(doc, url) {
    console.log(`Processing document for ${url}`);
    const threads = $(doc).find('.forumthreads tr.tablerow').toArray();
    console.log(`Found ${threads.length} threads on ${url}`);

    const boxShadowColor = forums[url] || '#ffae00'; // Default color

    threads.forEach(thread => {
        const threadLink = $(thread).find('.name a');
        const threadHref = threadLink.attr('href');
        const threadTitle = threadLink.text();
        const threadReplies = $(thread).find('.replies').text();
        const threadId = threadHref.split('/').pop();

        const existingThread = $(`a[href="${threadHref}"]`);
        if (existingThread.length === 0) {
            console.log(`Adding thread ${threadId} to the sidebar`);
            $('.activitylist').append(
                `<a href="${threadHref}" class="col-box activity a-reset" style="box-shadow: inset 2px 0 0 0 ${boxShadowColor};"><span class="topic a-default">${threadTitle}</span>${threadReplies}</a>`
            );
        } else {
            // If a match is found, change the border color to the one defined in forums
            console.log(`Thread ${threadId} is already in the sidebar, updating border color.`);
            existingThread.css('box-shadow', `inset 2px 0 0 0 ${boxShadowColor}`);
        }
    });
}

    function checkForSidebar() {
        console.log("Checking for sidebar...");
        const sidebar = document.querySelector('.activitylist');
        if (sidebar) {
            console.log("Sidebar found");
            return sidebar;
        } else {
            console.log("Sidebar not found, retrying...");
            return null;
        }
    }

    function waitForSidebar() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const sidebar = checkForSidebar();
                if (sidebar) {
                    clearInterval(interval);
                    resolve(sidebar);
                }
            }, 300);
        });
    }

    function updateCheckboxStates(checkboxes) {
        const selectedCount = checkboxes.find('input:checked').length;
        checkboxes.find('input').each(function() {
            if (selectedCount >= 2 && !$(this).is(':checked')) {
                $(this).prop('disabled', true).closest('label').css('color', '#999');
            } else {
                $(this).prop('disabled', false).closest('label').css('color', '');
            }
        });
    }

    function createPreferencesModal() {
        const modal = $('<div>').addClass('preferences-modal').css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#333',
            padding: '20px',
            zIndex: '10000',
            display: 'none',
            color: 'white',
            borderRadius: '5px'
        });

        const title = $('<h2>').text('Fetch extra forum threads to sidebar').css({
            marginBottom: '10px',
            fontSize: '18px'
        });

        const checkboxes = $('<div>').css({
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '10px'
        });

        Object.keys(forums).forEach(url => {
            const label = $('<label>').text(url.split('/').pop().replace(/-/g, ' ')).css({
                cursor: 'pointer'
            });

            const checkbox = $('<input>')
                .attr('type', 'checkbox')
                .attr('value', url)
                .css({
                    marginRight: '5px'
                });

            label.prepend(checkbox);
            checkboxes.append(label);
        });

        checkboxes.on('change', 'input', function() {
            updateCheckboxStates(checkboxes);
        });

        const saveButton = $('<button>').text('Save').css({
            marginTop: '15px',
            padding: '5px 10px',
            backgroundColor: '#ffae00',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
        }).on('click', async () => {
            const selectedForums = [];
            checkboxes.find('input:checked').each(function() {
                selectedForums.push($(this).val());
            });

            await GM.setValue('selectedForums', selectedForums);
            const removeNewsMatches = $('#removeNewsMatches').prop('checked');
            const changeUpvoteStyle = $('#changeUpvoteStyle').prop('checked');

            await GM.setValue('removeNewsMatches', removeNewsMatches);
            await GM.setValue('changeUpvoteStyle', changeUpvoteStyle);

            modal.fadeOut();
            console.log("Preferences saved:", selectedForums);

            applyEnhancements(removeNewsMatches, changeUpvoteStyle);

            location.reload();
        });

        const enhancementsSection = $('<div>').css({
            marginTop: '20px'
        });

        const enhancementsTitle = $('<div>').text('Enhancements').css({
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px'
        });

        const removeNewsMatchesCheckbox = $('<div>').css({
            marginBottom: '10px'
        }).append(
            $('<input type="checkbox" id="removeNewsMatches">').prop('checked', true),
            $('<label for="removeNewsMatches">Remove news and matches from sidebar</label>')
        );

        const changeUpvoteStyleCheckbox = $('<div>').append(
            $('<input type="checkbox" id="changeUpvoteStyle">').prop('checked', true),
            $('<label for="changeUpvoteStyle">Change +1 of upvoted comments to green</label>')
        );

        enhancementsSection.append(enhancementsTitle, removeNewsMatchesCheckbox, changeUpvoteStyleCheckbox);

        modal.append(title, checkboxes, enhancementsSection, saveButton);
        $('body').append(modal);

        GM.getValue('selectedForums', []).then(selectedForums => {
            checkboxes.find('input').each(function() {
                if (selectedForums.includes($(this).val())) {
                    $(this).prop('checked', true);
                }
            });
            updateCheckboxStates(checkboxes);
        });

        GM.getValue('removeNewsMatches', true).then(savedRemoveNewsMatches => {
            $('#removeNewsMatches').prop('checked', savedRemoveNewsMatches);
            applyEnhancements(savedRemoveNewsMatches);
        });

        GM.getValue('changeUpvoteStyle', true).then(savedChangeUpvoteStyle => {
            $('#changeUpvoteStyle').prop('checked', savedChangeUpvoteStyle);
            applyEnhancements(undefined, savedChangeUpvoteStyle);
        });

        return modal;
    }

    function applyEnhancements(removeNewsMatches, changeUpvoteStyle) {
        if (removeNewsMatches) {
            removeNewsMatchesScript();
        }

        if (changeUpvoteStyle) {
            changeUpvoteStyleScript();
        }
    }

    function removeNewsMatchesScript() {
        (function() {
            'use strict';

            function cleanRecentActivity() {
                const recentActivityLinks = document.querySelectorAll('.activitylist a');
                recentActivityLinks.forEach(link => {
                    if (link.href.match(/\/matches\/|\/news\//)) {
                        link.style.display = 'none';
                    }
                });
            }

            window.addEventListener('load', cleanRecentActivity);
            const observer = new MutationObserver(cleanRecentActivity);
            observer.observe(document.querySelector('.activitylist'), { childList: true, subtree: true });
        })();
    }

    function changeUpvoteStyleScript() {
        (function() {
            'use strict';
            let styledElements = new Set();
            function changeStyles() {
                let elements = document.querySelectorAll('.plus-button.active');
                elements.forEach(element => {
                    if (!styledElements.has(element)) {
                        element.style.backgroundColor = 'darkgreen';
                        element.style.color = 'lightgreen';
                        element.style.fontWeight = 'bold';
                        styledElements.add(element);
                    }
                });

                styledElements.forEach(element => {
                    if (!element.classList.contains('active')) {
                        element.style.backgroundColor = '';
                        element.style.color = '';
                        element.style.fontWeight = '';
                        styledElements.delete(element);
                    }
                });
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        changeStyles();
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });

            window.addEventListener('load', changeStyles);
        })();
    }

    function createCogwheel() {
        const cogwheel = $('<div>').addClass('nav-cogwheel').css({
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
            marginLeft: '20px',
            color: '#ffae00'
        }).html('<i class="fa fa-cog"></i>');

        cogwheel.on('click', () => {
            $('.preferences-modal').fadeIn();
        });

        $('#navBarContainerFull .user-wrap').append(cogwheel);

        $(document).on('click', function(event) {
            const modal = $('.preferences-modal');
            if (!$(event.target).closest(modal).length && !$(event.target).closest(cogwheel).length) {
                modal.fadeOut();
            }
        });

        const closeButton = $('<span>').html('&times;').css({
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '20px',
            color: '#fff',
            cursor: 'pointer'
        }).on('click', function() {
            $('.preferences-modal').fadeOut();
        });

        $('.preferences-modal').prepend(closeButton);
    }

    async function main() {
        console.log("Starting main function");

        const preferencesModal = createPreferencesModal();
        createCogwheel();

        await waitForSidebar();
        console.log("Sidebar is available, fetching posts...");

        const selectedForums = await GM.getValue('selectedForums', []);
        for (const forum of selectedForums) {
            const { doc, url } = await fetchPosts(forum);
            addPostsToSidebar(doc, url);
        }
    }

    main();

  (function() {
    'use strict';

    function sortForums(order) {
        let forumContainer = document.querySelector('.col-box-con .activitylist');
        if (!forumContainer) return;

        let forums = Array.from(forumContainer.querySelectorAll('a'));

        if (order === 'type') {
            forums.sort((a, b) => {
                let typeA = a.getAttribute('href').split('/')[1];
                let typeB = b.getAttribute('href').split('/')[1];
                let numA = parseInt(a.getAttribute('href').match(/\d+/)[0]);
                let numB = parseInt(b.getAttribute('href').match(/\d+/)[0]);

                if (typeA === typeB) {
                    return numB - numA;
                } else {
                    let typeOrder = { 'news': 1, 'matches': 2, 'forums': 3 };
                    return typeOrder[typeA] - typeOrder[typeB];
                }
            });
        } else {
            forums.sort((a, b) => {
                let commentsA = extractCommentCount(a);
                let commentsB = extractCommentCount(b);
                return commentsB - commentsA;
            });
        }

        forumContainer.innerHTML = '';
        forums.forEach(forum => forumContainer.appendChild(forum));
    }

    function extractCommentCount(element) {
        let text = element.innerHTML.trim();
        let match = text.match(/<\/span>(\d+)$/);
        return match ? parseInt(match[1]) : 0;
    }

    function resetForums() {
        location.reload();
    }

    function createToggleButton() {
        let recentActivityTitle = document.querySelector('.recent-activity h1');
        if (!recentActivityTitle) return;

        let toggleButton = document.createElement('button');
        toggleButton.style.marginRight = '10px';
        toggleButton.style.border = 'none';
        toggleButton.style.background = 'none';
        toggleButton.style.cursor = 'pointer';
        toggleButton.title = 'Sort order: Default';

        let icon = document.createElement('span');
        icon.innerHTML = '💬';
        icon.style.color = '';
        toggleButton.appendChild(icon);

        let currentState = localStorage.getItem('forumSortOrder') || 'default';
        updateButtonIcon(currentState, icon);

        toggleButton.addEventListener('click', () => {
            let newState;
            if (currentState === 'default') {
                newState = 'high';
            } else if (currentState === 'high') {
                newState = 'type';
            } else {
                newState = 'default';
            }
            currentState = newState;
            localStorage.setItem('forumSortOrder', newState);
            updateButtonIcon(newState, icon);

            setTimeout(() => {
                if (newState === 'high') {
                    sortForums('high');
                } else if (newState === 'type') {
                    sortForums('type');
                } else {
                    resetForums();
                }
            }, 500);
        });

        recentActivityTitle.insertBefore(toggleButton, recentActivityTitle.firstChild);
    }

    function updateButtonIcon(state, icon) {
        if (state === 'high') {
            icon.innerHTML = '🔽';
            icon.style.color = '';
            icon.title = 'Sort order: High to Low';
        } else if (state === 'type') {
            icon.innerHTML = '📅';
            icon.style.color = '';
            icon.title = 'Sort order: Creation Time (New to Old)';
        } else {
            icon.innerHTML = '💬';
            icon.style.color = '';
            icon.title = 'Sort order: Default (Posts with New Comments First)';
        }
    }

    window.addEventListener('load', () => {
        createToggleButton();
        let savedOrder = localStorage.getItem('forumSortOrder');
        setTimeout(() => {
            if (savedOrder === 'high') {
                sortForums('high');
            } else if (savedOrder === 'type') {
                sortForums('type');
            }
        }, 1000);
    });

    document.addEventListener('click', (event) => {
        let modal = document.querySelector('.forum-preferences-modal');
        let menuWrap = document.querySelector('.forum-preferences-menu-wrap');
        if (modal && !modal.contains(event.target) && !menuWrap.contains(event.target)) {
            modal.classList.add('hidden');
        }
    });
})();
})();