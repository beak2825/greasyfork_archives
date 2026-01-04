// ==UserScript==
// @name         Nexus Mods - Improved Download History Filters
// @description  Adds more filtering options to the Table on the Download History page. Allows filtering for mods with updates, filtering by game and more.
// @namespace    NetroScript
// @match        https://www.nexusmods.com/users/myaccount?tab=download+history*
// @match        https://www.nexusmods.com/*/users/myaccount?tab=download+history*
// @supportURL   https://github.com/NetroScript/nexus-mods-download-history-enhancer/issues
// @grant        none
// @version      1.0.0
// @author       NetroScript
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498613/Nexus%20Mods%20-%20Improved%20Download%20History%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/498613/Nexus%20Mods%20-%20Improved%20Download%20History%20Filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const initializeFilters = () => {
        let datatable = $('.datatable').DataTable();

        const setupFilters = () => {
            const filterContainer = $('<div class="filter-container"></div>');
            filterContainer.insertBefore(datatable.table().container());

            const outdatedFilter = $('<div class="outdated-filter"><strong>Filter by Status:</strong><input type="checkbox" class="outdated-downloads-checkbox" id="outdated-downloads-checkbox"/> <label for="outdated-downloads-checkbox" class="outdated-downloads-label">Show Outdated Downloads Only</label></div>');
            filterContainer.append(outdatedFilter);

            const games = {};
            datatable.data().each(function(d) {
                games[d[9]] = games[d[9]] || {};
                games[d[9]][d[4]] = (games[d[9]][d[4]] || 0) + 1;
            });

            const gameFilters = $('<div class="game-filters"><strong>Filter by Game and Category:</strong><div class="game-categories"></div></div>');
            filterContainer.append(gameFilters);

            for (let game in games) {
                const gameSection = $(`
                    <div class="game-category-section is-closed">
                        <div class="game-category-header-container">
                            <div class="game-category-header">
                                <div class="game-category-title">${game}</div>
                                <div class="game-category-count"> - (${Object.keys(games[game]).length} categories, click to expand)</div>
                                <div class="game-category-active-count" id="game-category-active-count-${game}"> - <strong>${Object.keys(games[game]).length}</strong> categories shown</div>
                            </div>
                            <button type="button" class="toggle-current-categories btn">Toggle All</button>
                        </div>
                        
                        <div class="game-category-checkboxes"></div>
                    </div>
                `);
                gameFilters.find('.game-categories').append(gameSection);

                for (let category in games[game]) {
                    const checkbox = $(`
                        <div class="individual-category-checkbox">
                            <label for="toggle-${game}-${category}">
                                <input type="checkbox" class="category-checkbox" checked name="${game}-${category}" id="toggle-${game}-${category}"/> 
                                ${category}
                            </label>
                        </div>
                    `);
                    gameSection.find('.game-category-checkboxes').append(checkbox);
                }
            }

            // Add a button after all games and category to toggle all categories of all games
            const toggleAllCategories = $('<button type="button" class="toggle-all-categories btn">Toggle All Categories</button>');
            filterContainer.append(toggleAllCategories);

            filterContainer.on('change', 'input[type="checkbox"]', function() {
                applyFilters();
            });

            filterContainer.on('click', '.toggle-current-categories', function(event) {
                // Prevent propagation to the parent div
                event.stopPropagation();
                const checkboxes = $(this).parent().siblings('.game-category-checkboxes').find('.category-checkbox');
                checkboxes.prop('checked', !checkboxes.first().prop('checked'));
                applyFilters();
            });

            filterContainer.on('click', '.toggle-all-categories', function() {
                const checkboxes = $('.category-checkbox');
                checkboxes.prop('checked', !checkboxes.first().prop('checked'));
                applyFilters();
            });

            // If there are multiple games, allow the user to toggle the categories for each game
            if (Object.keys(games).length > 1) {
                $('.game-category-section .game-category-header-container').on('click', function(event) {
                    // If the element clicked is the button, ignore the click
                    if ($(event.target).is('button')) {
                        return;
                    }
                    $(this).parent().toggleClass('is-closed');
                });
            } else {
                // Otherwise, remove the is-closed class, hide the toggle all button, and hide the text hint for toggling
                $('.game-category-section').removeClass('is-closed');
                $('.toggle-all-categories').hide();
                $('.game-category-count').hide();
                // Rename the filter by game and category to just filter by category
                $('.game-filters>strong').text('Filter by Category:');
            }


            
        };

        const applyFilters = () => {
            // Update the count of active categories for each game
            $('.game-category-section').each(function() {
                const game = $(this).find('.game-category-title').text();
                const activeCategories = $(this).find('.category-checkbox:checked').length;
                $(this).find('.game-category-active-count').html(` - <strong>${activeCategories}</strong> categories shown`);
            });
            datatable.draw();
        };

        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                const outdatedOnly = $('.outdated-downloads-checkbox').is(':checked');
                const lastDownload = parseInt(data[2]);
                const lastUpdate = parseInt(data[5]);

                if (outdatedOnly && lastDownload >= lastUpdate) {
                    return false;
                }

                let categoryAllowed = false;
                $('.category-checkbox:checked').each(function() {
                    const [game, category] = $(this).attr('name').split('-');
                    if (data[9] === game && data[4] === category) {
                        categoryAllowed = true;
                    }
                });

                return categoryAllowed;
            }
        );

        setupFilters();
    };

    const checkReady = () => {
        const el = $('.datatable');
        if (el.DataTable == undefined || el.DataTable().data().length == 0) {
            setTimeout(checkReady, 100);
        } else {
            initializeFilters();
        }
    };

    const insertCustomStyles = () => {
        const style = `
            .filter-container {
                margin-bottom: 20px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                display: flex;
                gap: 12px;
                flex-direction: column;
            }

            .toggle-current-categories, .toggle-all-categories {
                background: gray;
                float: right;
            }

            .game-category-checkboxes {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                grid-gap: 10px;
                padding: 5px;
            }

            input.category-checkbox {
                margin-right: 5px;
            }

            .individual-category-checkbox {
                display: flex;
                align-items: center;
                text-transform: uppercase;
            }

            .individual-category-checkbox label {
                cursor: pointer;
            }

            .game-category-section .game-category-header {
                cursor: pointer;
                margin: 10px 0;
                display: flex;
                align-items: center;
            }

            .game-category-section .game-category-title {
                font-weight: bold;
                text-transform: uppercase;
            }

            .game-category-section .game-category-count {
                opacity: 0.75;
            }

            .filter-container > div > strong {
                margin-bottom: 10px;
                display: block;
                font-size: 125%;
            }

            .game-category-header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0, 0, 0, 0.1);
                padding: 1px 16px;
                margin: 6px 0px;
                user-select: none;   
            }

            .game-category-section.is-closed .game-category-checkboxes {
                display: none;
            }

            .game-category-section.is-closed .game-category-title::before {
                content: '+ ';
            }

            .game-category-section .game-category-title::before {
                content: '- ';
            }

            .outdated-filter label {
                cursor: pointer;
            }

            .game-category-active-count {
                padding-left: 5px;
            }

        `;
        $('<style>').text(style).appendTo('head');
    };

    insertCustomStyles();
    checkReady();
})();
