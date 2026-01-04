// ==UserScript==
// @name         ID Please! Rockstar Edition
// @version      6.22
// @description  Shows ID, crew, games, friends, and GTA Online character info on Social Club profiles on hover
// @match        https://socialclub.rockstargames.com/member/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530261/ID%20Please%21%20Rockstar%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/530261/ID%20Please%21%20Rockstar%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getCookie = (name) => {
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArr = decodedCookie.split(';');
        for (let cookie of cookieArr) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return '';
    };

    const injectStyles = () => {
        const style = `
            .rsc-info-panel {
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 6px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 12px;
                min-width: 260px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                display: none;
                flex-direction: column;
                gap: 10px;
                z-index: 9999;
                font-size: 13px;
                color: #333;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                transition: opacity 0.2s ease, transform 0.2s ease;
                opacity: 0;
                transform: translateY(5px);
            }

            .rsc-info-panel.show {
                display: flex;
                opacity: 1;
                transform: translateY(0);
            }

            .rsc-section {
                border-top: 1px solid #eee;
                padding-top: 8px;
            }

            .rsc-section:first-child {
                border-top: none;
                padding-top: 0;
            }

            .rsc-section strong {
                display: block;
                margin-bottom: 2px;
                font-weight: bold;
            }

            .rsc-no-data {
                font-style: italic;
                color: #666;
            }

            .rsc-games-list div {
                margin-bottom: 6px;
            }

            .rsc-game-details {
                display: flex;
                align-items: center;
                gap: 10px;
                justify-content: space-between;
            }

            .rsc-character-img {
                width: 24px;
                height: 24px;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                object-fit: cover;
            }

            .rsc-character-img-large {
                display: block;
                object-fit: cover;
                border-radius: 4px;
                border: 1px solid #ddd;
                max-width: 120px;
                max-height: 120px;
            }

            .rsc-character-img-container {
                background: #333;
                padding: 5px;
                border-radius: 4px;
                display: inline-block;
            }

            .rsc-character-img-error {
                display: none;
            }

            .rsc-inferred-game {
                color: #666;
                font-size: 12px;
                margin-left: 4px;
            }

            .rsc-crew-block {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .rsc-crew-header {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .rsc-crew-header img {
                border: 1px solid #ddd;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                cursor: pointer;
            }

            .rsc-crew-selector {
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 13px;
            }

            .rsc-tooltip {
                display: none;
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: #fff;
                padding: 10px;
                border-radius: 6px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                font-size: 12px;
                z-index: 10000;
                white-space: nowrap;
            }

            .rsc-crew-emblem-large {
                width: 80px;
                height: 80px;
                border-radius: 4px;
                border: 1px solid #ddd;
                display: block;
            }

            .rsc-crew-details {
                margin-top: 8px;
                font-size: 12px;
                line-height: 1.4em;
                color: #444;
            }

            .rsc-crew-detail-line {
                margin-bottom: 6px;
            }

            .rsc-crew-color-box {
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 1px solid #ccc;
                margin-left: 5px;
                vertical-align: middle;
            }
        `;
        $('head').append(`<style>${style}</style>`);
    };

    const getUsername = () => {
        let path = window.location.pathname;
        if (!path.endsWith('/')) path += '/';
        const match = /^\/member\/([\w\W]+)\//.exec(path);
        return match ? match[1] : null;
    };

    const fetchProfileData = (username) => {
        return $.ajax({
            method: 'GET',
            url: `https://scapi.rockstargames.com/profile/getprofile?nickname=${encodeURIComponent(username)}&maxFriends=3`,
            beforeSend: (request) => {
                request.setRequestHeader('Authorization', `Bearer ${getCookie('BearerToken')}`);
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        });
    };

    const fetchUserSearchData = (username) => {
        return $.ajax({
            method: 'GET',
            url: `https://scapi.rockstargames.com/search/user?includeCommentCount=true&searchTerm=${encodeURIComponent(username)}`,
            beforeSend: (request) => {
                request.setRequestHeader('Authorization', `Bearer ${getCookie('BearerToken')}`);
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        });
    };

    const fetchCrewSearchData = (crewName) => {
        return $.ajax({
            method: 'GET',
            url: `https://scapi.rockstargames.com/search/crew?sort=&crewtype=all&includeCommentCount=true&pageSize=30&searchTerm=${encodeURIComponent(crewName)}`,
            beforeSend: (request) => {
                request.setRequestHeader('Authorization', `Bearer ${getCookie('BearerToken')}`);
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        });
    };

    const fetchCrewFeedData = (crewId) => {
        return $.ajax({
            method: 'GET',
            url: `https://scapi.rockstargames.com/feed/crew?crewId=${crewId}&offset=0&limit=15`,
            beforeSend: (request) => {
                request.setRequestHeader('Authorization', `Bearer ${getCookie('BearerToken')}`);
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        });
    };

    const checkCharacterImageExists = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
        });
    };

    const getCrewEmblemUrl = (crewId) => {
        return `https://prod.cloud.rockstargames.com/crews/sc/3965/${crewId}/publish/emblem/emblem_128.png`;
    };

    const getCharacterImageUrl = (rockstarId, slot) => {
        return `https://prod.cloud.rockstargames.com/members/sc/6266/${rockstarId}/publish/gta5/mpchars/${slot}.png`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "0001-01-01T00:00:00.000Z") return 'Not Available';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Not Available';
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    const createIDPanel = async (account) => {
        const ra = account.rockstarAccount;
        let gamesOwned = ra.gamesOwned || [];

        if (!gamesOwned.some(game => game.name.toLowerCase() === 'gtav') && (ra.profileHidden || gamesOwned.length === 0) && ra.rockstarId) {
            const characterImgUrl = getCharacterImageUrl(ra.rockstarId, 0);
            const imageExists = await checkCharacterImageExists(characterImgUrl);
            if (imageExists) {
                gamesOwned = [...gamesOwned, { name: 'GTAV', lastSeen: null, inferred: true }];
            }
        }

        const idSection = `
            <div class="rsc-section">
                <strong>Rockstar ID</strong>
                <div>${ra.rockstarId || 'Not Available'}</div>
            </div>
        `;

        let gamesHTML;
        if (ra.profileHidden && gamesOwned.length === 0) {
            gamesHTML = `
                <div class="rsc-section">
                    <strong>Games Owned</strong>
                    <div class="rsc-no-data">hidden</div>
                </div>
            `;
        } else if (gamesOwned.length > 0) {
            const gamesList = gamesOwned.map(game => {
                let extraContent = '';
                if (game.name.toLowerCase() === 'gtav') {
                    const rockstarId = ra.rockstarId;
                    if (!rockstarId) {
                        extraContent = `
                            <
                            <div>
                                <span style="font-weight: bold;">${game.name}</span><br>
                                <span style="font-size:12px;color:#666;">Last Seen: ${game.lastSeen ? new Date(game.lastSeen).toLocaleString() : 'Unknown'}</span>
                            </div>
                        `;
                    } else {
                        const characterImgUrl = getCharacterImageUrl(rockstarId, 0);
                        const inferredTag = game.inferred ? '<span class="rsc-inferred-game">*</span>' : '';
                        const platform = game.platform ? `(${game.platform})` : '';
                        extraContent = `
                            <div class="rsc-game-details">
                                <div>
                                    <span style="font-weight: bold;">${game.name}${inferredTag} ${platform}</span><br>
                                    <span style="font-size:12px;color:#666;">Last Seen: ${game.lastSeen ? new Date(game.lastSeen).toLocaleString() : 'Unknown'}</span>
                                </div>
                                <img class="rsc-character-img" src="${characterImgUrl}" alt="GTA V Character" onerror="this.className='rsc-character-img-error';">
                            </div>
                        `;
                    }
                } else {
                    extraContent = `
                        <div>
                            <span style="font-weight: bold;">${game.name}</span> (${game.platform})<br>
                            <span style="font-size:12px;color:#666;">Last Seen: ${game.lastSeen ? new Date(game.lastSeen).toLocaleString() : 'Unknown'}</span>
                        </div>
                    `;
                }
                return extraContent;
            }).join('');
            gamesHTML = `
                <div class="rsc-section">
                    <strong>Games Owned</strong>
                    <div class="rsc-games-list">${gamesList}</div>
                </div>
            `;
        } else {
            const text = ra.profileHidden ? 'hidden' : 'Not Available';
            gamesHTML = `
                <div class="rsc-section">
                    <strong>Games Owned</strong>
                    <div class="rsc-no-data">${text}</div>
                </div>
            `;
        }

        let friendsDisplay;
        if (ra.friendsHidden && ra.friendCount > 0) {
            friendsDisplay = `<div>${ra.friendCount}</div>`;
        } else if (ra.friendsHidden) {
            friendsDisplay = `<div class="rsc-no-data">hidden</div>`;
        } else {
            friendsDisplay = `<div>${ra.friendCount || '0'}</div>`;
        }

        const friendsHTML = `
            <div class="rsc-section">
                <strong>Friends</strong>
                ${friendsDisplay}
            </div>
        `;

        const $panel = $(`
            <div class="rsc-info-panel rsc-id-panel">
                ${idSection}
                ${gamesHTML}
                ${friendsHTML}
            </div>
        `);

        const $characterImg = $panel.find('.rsc-character-img');
        let $tooltip;
        $characterImg.hover(
            function() {
                if ($(this).hasClass('rsc-character-img-error')) return;
                $tooltip = $(`
                    <div class="rsc-tooltip">
                        <div class="rsc-character-img-container">
                            <img class="rsc-character-img-large" src="${$(this).attr('src')}" alt="GTA V Character Large" onerror="this.style.display='none';">
                        </div>
                    </div>
                `).appendTo('body');

                const offset = $(this).offset();
                $tooltip.css({
                    top: offset.top - $tooltip.outerHeight() - 10 + 'px',
                    left: offset.left + 'px'
                }).fadeIn(150);
            },
            function() {
                if ($tooltip) $tooltip.fadeOut(150, () => $tooltip.remove());
            }
        );

        return $panel;
    };

    const createCrewPanel = (account, enhancedCrewData) => {
        let crews = account.crews || [];
        if (crews.length === 0 && enhancedCrewData) {
            crews = [enhancedCrewData];
        }

        if (crews.length === 0) {
            return $(`
                <div class="rsc-info-panel rsc-crew-panel">
                    <div class="rsc-section">
                        <strong>Crew</strong>
                        <div class="rsc-no-data">No Crew Information</div>
                    </div>
                </div>
            `);
        }

        const primaryCrew = crews.find(c => c.isPrimary) || crews[0];
        const emblemUrl = getCrewEmblemUrl(primaryCrew.crewId);
        const crewOptions = crews.map(c => `<option value="${c.crewId}" ${c.isPrimary ? 'selected' : ''}>${c.crewName}</option>`).join('');

        const $panel = $(`
            <div class="rsc-info-panel rsc-crew-panel">
                <div class="rsc-section">
                    <strong>Crew</strong>
                    <div class="rsc-crew-block">
                        <div class="rsc-crew-header">
                            <img class="rsc-crew-emblem" src="${emblemUrl}" alt="${primaryCrew.crewName} emblem">
                            <span class="rsc-crew-name">${primaryCrew.crewName} [${primaryCrew.crewTag}]</span>
                        </div>
                        <select class="rsc-crew-selector">${crewOptions}</select>
                        <div class="rsc-crew-details"></div>
                    </div>
                </div>
            </div>
        `);

        return $panel;
    };

    const updateCrewTagAndRank = (crew, $userCrewTag, $userCrewRank, $crewLink) => {
        if (!$userCrewTag || !$userCrewRank || !$crewLink || $userCrewTag.length === 0) return;

        $userCrewTag.text(crew.crewTag.toUpperCase());

        const coloredBoxes = 5 - (crew.rankOrder || 0);
        $userCrewRank.each(function(index) {
            if (index < coloredBoxes) {
                $(this).css('background-color', crew.crewColour || '#ccc');
            } else {
                $(this).css('background-color', 'transparent');
            }
        });

        const crewLinkUrl = '/crew/' + crew.crewName.replace(/\s+/g, '_').toLowerCase();
        $crewLink.attr('href', crewLinkUrl).off('click').on('click', function(e) {
            e.preventDefault();
            window.location.href = crewLinkUrl;
        });
    };

    const updateCrewDetails = (crew, $details) => {
        const motto = crew.crewMotto || 'Not Available';
        const memberCount = crew.memberCount != null ? crew.memberCount : 'Not Available';
        const created = formatDate(crew.createdAt);
        const privacy = crew.isPrivate ? 'Private' : 'Public';
        const isOpen = crew.isOpen ? 'Yes' : 'No';
        const division = crew.division || 'Not Available';
        const color = crew.crewColour || 'Not Available';
        const rank = crew.rankOrder != null ? crew.rankOrder : 'Unknown';

        const colorBox = color !== 'Not Available' ? `<span class="rsc-crew-color-box" style="background:${color}"></span>` : '';

        const html = `
            <div class="rsc-crew-detail-line"><strong>Crew ID:</strong> ${crew.crewId}</div>
            <div class="rsc-crew-detail-line"><strong>Motto:</strong> ${motto}</div>
            <div class="rsc-crew-detail-line"><strong>Members:</strong> ${memberCount}</div>
            <div class="rsc-crew-detail-line"><strong>Created:</strong> ${created}</div>
            <div class="rsc-crew-detail-line"><strong>Privacy:</strong> ${privacy}</div>
            <div class="rsc-crew-detail-line"><strong>Open:</strong> ${isOpen}</div>
            <div class="rsc-crew-detail-line"><strong>Division:</strong> ${division}</div>
            <div class="rsc-crew-detail-line"><strong>Color:</strong> ${color} ${colorBox}</div>
            <div class="rsc-crew-detail-line"><strong>Rank:</strong> ${rank}</div>
        `;
        $details.html(html);
    };

    const setupCrewInteractions = (crews, $panel, $crewTagContainer) => {
        if (!crews || crews.length === 0) return;

        const $crewSelector = $panel.find('.rsc-crew-selector');
        const $crewName = $panel.find('.rsc-crew-name');
        const $emblem = $panel.find('.rsc-crew-emblem');
        const $details = $panel.find('.rsc-crew-details');
        const $userCrewTag = $crewTagContainer.find('.UI__CrewTag__tag');
        const $userCrewRank = $crewTagContainer.find('.UI__CrewTag__rank div');
        const $crewLink = $crewTagContainer.find('.UI__CrewTag__crewTag');

        const initialCrew = crews.find(c => c.isPrimary) || crews[0];
        updateCrewDetails(initialCrew, $details);

        const updateCrewUI = (crew) => {
            $emblem.attr('src', getCrewEmblemUrl(crew.crewId));
            $crewName.html(`${crew.crewName} [${crew.crewTag}]`);
            updateCrewTagAndRank(crew, $userCrewTag, $userCrewRank, $crewLink);
            updateCrewDetails(crew, $details);
        };

        $crewSelector.change(function() {
            const selectedCrew = crews.find(c => c.crewId.toString() === this.value);
            if (selectedCrew) updateCrewUI(selectedCrew);
        });

        let $tooltip;
        $emblem.hover(
            function() {
                const currentCrewId = $crewSelector.val();
                const currentCrew = crews.find(c => c.crewId.toString() === currentCrewId);
                $tooltip = $(`
                    <div class="rsc-tooltip">
                        <img class="rsc-crew-emblem-large" src="${getCrewEmblemUrl(currentCrew.crewId)}" alt="${currentCrew.crewName} Emblem">
                    </div>
                `).appendTo('body');

                const offset = $emblem.offset();
                $tooltip.css({
                    top: offset.top - $tooltip.outerHeight() - 10 + 'px',
                    left: offset.left + 'px'
                }).fadeIn(150);
            },
            function() {
                if ($tooltip) $tooltip.fadeOut(150, () => $tooltip.remove());
            }
        );

        updateCrewUI(initialCrew);
    };

    const hoverDropdown = ($trigger, $panel) => {
        if (!$trigger || $trigger.length === 0) return;

        $trigger.on('mouseenter', () => {
            const offset = $trigger.offset();
            $panel.css({
                top: (offset.top + $trigger.outerHeight()) + 'px',
                left: offset.left + 'px'
            });
            $panel.stop(true, true).fadeIn(150, () => {
                $panel.addClass('show');
            });
        });

        let hideTimeout;
        const hidePanel = () => {
            hideTimeout = setTimeout(() => {
                $panel.removeClass('show').fadeOut(150);
            }, 200);
        };

        const clearHideTimeout = () => {
            clearTimeout(hideTimeout);
        };

        $trigger.on('mouseleave', hidePanel);
        $panel.on('mouseenter', clearHideTimeout);
        $panel.on('mouseleave', hidePanel);
    };

    const init = () => {
        const username = getUsername();
        if (!username) return;

        fetchProfileData(username).done(async (data) => {
            const account = data.accounts && data.accounts[0];
            if (!account || !account.rockstarAccount) return;

            const ra = account.rockstarAccount;
            let searchCrewData = null;
            if (!account.crews || account.crews.length === 0) {
                try {
                    const userSearchData = await fetchUserSearchData(username);
                    const matchingAccount = userSearchData.accounts.find(acc => acc.rockstarId === ra.rockstarId);
                    if (matchingAccount && matchingAccount.crew) {
                        searchCrewData = matchingAccount.crew;
                    }
                } catch (error) {}
            }

            let enhancedCrewData = null;
            if (searchCrewData) {
                try {
                    const crewSearchData = await fetchCrewSearchData(searchCrewData.name);
                    const crewDetails = crewSearchData.crews.find(c => c.crewId === searchCrewData.id);
                    if (crewDetails) {
                        enhancedCrewData = {
                            crewId: crewDetails.crewId,
                            crewName: crewDetails.crewName,
                            crewTag: crewDetails.crewTag,
                            crewMotto: crewDetails.crewMotto,
                            memberCount: crewDetails.memberCount,
                            isPrivate: crewDetails.isPrivate,
                            rankOrder: searchCrewData.rankOrder,
                            crewColour: crewDetails.crewColour,
                            division: crewDetails.division,
                            isOpen: crewDetails.isOpen,
                            createdAt: crewDetails.createdAt,
                            isPrimary: true
                        };

                        const crewFeedData = await fetchCrewFeedData(searchCrewData.id);
                        const activityWithRank = crewFeedData.activities.find(activity => 
                            activity.actor.id === ra.rockstarId.toString() && activity.actor.rank
                        );
                        if (activityWithRank && activityWithRank.actor.rank && activityWithRank.actor.rank.rankOrder != null) {
                            enhancedCrewData.rankName = activityWithRank.actor.rank.rankName;
                        }
                    }
                } catch (error) {
                    enhancedCrewData = {
                        crewId: searchCrewData.id,
                        crewName: searchCrewData.name,
                        crewTag: searchCrewData.tag,
                        crewColour: searchCrewData.color,
                        rankOrder: searchCrewData.rankOrder,
                        isPrimary: true
                    };
                }
            }

            const $profileHeaderName = $('.ProfileHeader__name__RpdUA');
            if ($profileHeaderName.length === 0) return;

            const $crewTagContainer = $('.ProfileHeader__crewTag__ayHAX');
            const $idPanel = await createIDPanel(account);
            $('body').append($idPanel);
            hoverDropdown($profileHeaderName, $idPanel);

            const hasCrewData = (account.crews && account.crews.length > 0) || enhancedCrewData;
            if (!hasCrewData) return;

            const $crewPanel = createCrewPanel(account, enhancedCrewData);
            $('body').append($crewPanel);

            if ($crewTagContainer.length === 0) {
                const initialCrew = enhancedCrewData || (account.crews && account.crews.find(c => c.isPrimary) || account.crews[0]);
                if (initialCrew) {
                    const crewTag = initialCrew.crewTag.toUpperCase();
                    const crewName = initialCrew.crewName.replace(/\s+/g, '_').toLowerCase();
                    const rankOrder = initialCrew.rankOrder || 0;
                    const crewColour = initialCrew.crewColour || '#ccc';
                    const coloredBoxes = 5 - rankOrder;
                    const rankBars = Array(5).fill().map((_, index) => `<div style="background-color: ${index < coloredBoxes ? crewColour : 'transparent'};"></div>`).join('');

                    const $customCrewTag = $(`
                        <div class="ProfileHeader__crewTag__ayHAX">
                            <a class="UI__CrewTag__crewTag" href="/crew/${crewName}">
                                <span class="UI__CrewTag__tag">${crewTag}</span>
                                <div class="UI__CrewTag__rank">
                                    ${rankBars}
                                </div>
                            </a>
                        </div>
                    `);
                    $profileHeaderName.after($customCrewTag);

                    setupCrewInteractions(account.crews || (enhancedCrewData ? [enhancedCrewData] : []), $crewPanel, $customCrewTag);
                    hoverDropdown($customCrewTag, $crewPanel);
                }
            } else {
                setupCrewInteractions(account.crews || (enhancedCrewData ? [enhancedCrewData] : []), $crewPanel, $crewTagContainer);
                hoverDropdown($crewTagContainer, $crewPanel);
            }
        }).fail(() => {});
    };

    const signature = 'SmVyZW1pYXM=';

    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
        if ($('.ProfileHeader__name__RpdUA').length > 0) {
            clearInterval(interval);
            injectStyles();
            init();
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }
    }, 500);
})();