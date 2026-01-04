// ==UserScript==
// @name         ID Please! Rockstar Edition
// @version      1.1
// @description  Shows some nifty info on a member's Social Club profile page
// @author       Jeremias
// @match        https://socialclub.rockstargames.com/member/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/509946/ID%20Please%21%20Rockstar%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/509946/ID%20Please%21%20Rockstar%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(e) {
        for (var t = e + "=", r = decodeURIComponent(document.cookie).split(";"), o = 0; o < r.length; o++) {
            var n = r[o].trim();
            if (n.indexOf(t) === 0) return n.substring(t.length, n.length);
        }
        return "";
    }

    var path = window.location.pathname;
    if (path[path.length-1] !== '/') path += '/';
    var username = /^\/member\/([\w\W]+)\//.exec(path)[1];

    $('head').append(`
        <style>
            .hover-color-change {
                color: black;
                transition: color 0.3s ease;
            }

            .hover-color-change:hover {
                color: #3498db; /* Subtle color change on hover */
            }

            .modern-box {
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.2s ease;
            }

            .modern-box:hover {
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
            }

            .tooltip-content-modern {
                display: none;
                position: absolute;
                background-color: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                top: 40px;
                left: 0;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .fade {
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            .fade-out {
                opacity: 0;
            }

            .rotate-icon {
                transition: transform 0.3s ease;
            }

            .slide {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease-in-out;
            }

            .slide-open {
                max-height: 300px;
            }

            /* Fix for dropdown rotation issue */
            select {
                flex-shrink: 0;
                border: 1px solid gray;
                border-radius: 4px;
                padding: 0 5px;
                /* No rotation effect on the dropdown */
            }
        </style>
    `);

    setTimeout(function() {
        $.ajax({
            method: 'GET',
            url: 'https://scapi.rockstargames.com/profile/getprofile?nickname=' + username + '&maxFriends=3',
            beforeSend: function(request) {
                request.setRequestHeader('Authorization', 'Bearer ' + getCookie('BearerToken'));
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
        })
        .done(function(data) {
            var account = data.accounts[0].rockstarAccount;
            var crews = data.accounts[0].crews || [];
            var hasCrew = crews.length > 0 && account.primaryClanId !== 0;

            var $profileHeaderName = $('.ProfileHeader__name__RpdUA');
            $profileHeaderName.css('padding-top', '5px');
            $profileHeaderName.append(`
                <div id="rockstarID" class="hover-color-change modern-box" style="margin-left: 10px; display: inline-block;">
                    <span style="font-size: 14px; font-weight: bold; color: black; background-color: #ffffff; padding: 3px 5px; border-radius: 4px; border: 1px solid #d3d3d3;">Rockstar ID: ${account.rockstarId}</span>
                </div>
            `);

            if (hasCrew) {
                var primaryCrew = crews.find(crew => crew.isPrimary) || crews[0];

                function getCrewEmblemUrl(crewId) {
                    return `https://prod.cloud.rockstargames.com/crews/sc/3965/${crewId}/publish/emblem/emblem_128.png`;
                }

                var $userCrewTag = $('.ProfileHeader__crewTag__ayHAX .UI__CrewTag__tag');
                var $userCrewRank = $('.ProfileHeader__crewTag__ayHAX .UI__CrewTag__rank div');
                var $crewLink = $('.ProfileHeader__crewTag__ayHAX .UI__CrewTag__crewTag');

                function updateCrewTagAndRank(crew) {
                    $userCrewTag.text(crew.crewTag);

                    $userCrewRank.each(function(index) {
                        if (index < 5 - crew.rankOrder) {
                            $(this).css('background-color', crew.crewColour);
                        } else {
                            $(this).css('background-color', 'transparent');
                        }
                    });

                    var crewLinkUrl = `/crew/${crew.crewName.replace(/\s+/g, '_').toLowerCase()}`;
                    $crewLink.attr('href', crewLinkUrl).off('click').on('click', function(e) {
                        e.preventDefault();
                        window.location.href = crewLinkUrl;
                    });

                    $('#crewEmblem').attr('src', getCrewEmblemUrl(crew.crewId));
                }

                var $crewTagContainer = $('.ProfileHeader__crewTag__ayHAX');
                $crewTagContainer.css('display', 'flex').css('flex-wrap', 'nowrap').css('align-items', 'center').append(`
                    <div class="modern-box" style="flex-grow: 1; display: flex; align-items: center; font-size: 14px; font-weight: bold; color: black; background-color: #ffffff; padding: 3px; border-radius: 4px; border: 1px solid #d3d3d3; margin-left: 10px; position: relative;">
                        <img id="crewEmblem" src="${getCrewEmblemUrl(primaryCrew.crewId)}" alt="${primaryCrew.crewName} emblem" width="30" height="30" style="margin-right: 10px; border-radius: 5px; border: 1px solid #d3d3d3;">
                        <div id="crewInfo" class="crew-tooltip hover-color-change" style="margin-right: 10px;">
                            ${primaryCrew.crewName} (ID: ${primaryCrew.crewId}) - Created: ${new Date(primaryCrew.createdAt).toLocaleDateString()}
                            <div class="tooltip-content-modern">
                                <strong>Members:</strong> ${primaryCrew.memberCount}<br>
                                <strong>Motto:</strong> '${primaryCrew.crewMotto}'
                            </div>
                        </div>
                        <select id="crewSelector">
                            ${crews.map(crew => `<option value="${crew.crewId}" ${crew.isPrimary ? 'selected' : ''}>${crew.crewName}</option>`).join('')}
                        </select>
                    </div>
                `);

                $('#crewEmblem').hover(function() {
                    var currentCrewId = $('#crewSelector').val();
                    var currentCrew = crews.find(crew => crew.crewId.toString() === currentCrewId);

                    var tooltipHtml = `<div id="emblemTooltip" class="modern-box" style="position: absolute; top: -100px; left: 40px; z-index: 9999; background-color: #fff; border-radius: 10px; padding: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);">
                        <img src="${getCrewEmblemUrl(currentCrew.crewId)}" alt="${currentCrew.crewName} emblem" width="80" height="80" style="border-radius: 5px;">
                    </div>`;
                    $(this).parent().append(tooltipHtml);
                }, function() {

                    $('#emblemTooltip').remove();
                });

                $('#crewInfo').hover(function() {
                    $(this).find('.tooltip-content-modern').css('opacity', 1).show();
                }, function() {
                    $(this).find('.tooltip-content-modern').css('opacity', 0).hide();
                });

                $('#crewSelector').change(function() {
                    var selectedCrew = crews.find(crew => crew.crewId.toString() === this.value);
                    $('#crewInfo').html(`${selectedCrew.crewName} (ID: ${selectedCrew.crewId}) - Created: ${new Date(selectedCrew.createdAt).toLocaleDateString()} <div class="tooltip-content-modern">
                        <strong>Members:</strong> ${selectedCrew.memberCount}<br>
                        <strong>Motto:</strong> '${selectedCrew.crewMotto}'
                    </div>`);

                    updateCrewTagAndRank(selectedCrew);

                    $('#crewEmblem').attr('src', getCrewEmblemUrl(selectedCrew.crewId));
                });

            } else {
                $profileHeaderName.append(`
                    <div class="modern-box" style="margin-left: 10px; display: inline-block;">
                        <span style="font-size: 14px; font-weight: bold; color: black; background-color: #ffffff; padding: 3px 5px; border-radius: 4px; border: 1px solid #d3d3d3;">No Crew Information</span>
                    </div>
                `);
            }

            var gamesOwned = account.gamesOwned ? account.gamesOwned.map(game => `Game: ${game.name}, Platform: ${game.platform}, Last Seen: ${new Date(game.lastSeen).toLocaleString()}`).join('<br>') : 'No Games';
            var $infoContainer = hasCrew ? $('.ProfileHeader__crewTag__ayHAX') : $profileHeaderName;
            $infoContainer.after(`
                ${gamesOwned ? `
                <div class="modern-box" style="font-size: 13px; margin-top: 5px; font-weight: bold; color: black; background-color: #e8e8e8; padding: 3px 5px; border-radius: 4px; margin-left: 0; display: inline-block; width: auto; white-space: normal; word-wrap: break-word; margin-bottom: 20px;">
                    Games Owned: ${gamesOwned}
                </div>` : ''}
                <div class="modern-box" style="font-size: 13px; margin-top: 5px; font-weight: bold; color: black; background-color: #e8e8e8; padding: 3px 5px; border-radius: 4px; margin-left: 10px; display: inline-block; width: auto; white-space: normal; word-wrap: break-word; margin-bottom: 20px;">
                    Friends: ${account.friendCount}
                </div>
            `);
        });
    }, 1000);
})();