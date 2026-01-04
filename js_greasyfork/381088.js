// ==UserScript==
// @name         VersionOne Super Title Always on Cards
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://your/instance/TeamRoom.mvc/Show/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.countdown/2.2.0/jquery.countdown.js
// @downloadURL https://update.greasyfork.org/scripts/381088/VersionOne%20Super%20Title%20Always%20on%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/381088/VersionOne%20Super%20Title%20Always%20on%20Cards.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const v1Instance = 'instance';
    GM_addStyle(`
/*
 *
 * Team Room Top Bar(s)
 *
 */

.teamroom #top-bar, /* main navigation */
.teamroom .scroll, /* Panels */
.teamroom .caption, /* Storyboard refresh */
.teamroom .hide-header, /* collapse */
.teamroom .filter-by-anything, /* filters */
.teamroom .KanbanBoard .titlebar, /* Highlight owner */
.teamroom .navigation
{
    display:none !important;
}

/* teammebers and charts */
.teamroom .collapsed-header + .header {
    height: 0;
    overflow: hidden;
}

/* storyboard position */
.teamroom .panel-wrapper {
	top: 0 !important;
    margin-left: 42px;
}

/* sticky header position */
.teamroom .sticky-group-by-header.position-absolute {
}

/* gap */
.teamroom .board {
    margin: 0 !important;
}

/* easy S-1234 select */
.teamroom .number {
    user-select: all;
    cursor: pointer;
}

body.ultimate,
.teamroom table,
.teamroom .window {
   background-color: #162228 !important;
}

.teamroom .taskboard table {
    border-spacing: 4px !important;
}
/* Column */
.teamroom .status,
.rollup-status {
    background: #263238 !important
}

.rollup-status {
    height: 12px !important;
}

/* Add icon at bottom of column */
.teamroom .cell-add {
    background-image: none !important;
}
.teamroom .cell-add:before {
	content: '+';
    color: #eceff1;
    font-size: 3rem;
    cursor: pointer;
}

/* swimlanes */
.teamroom .sticky-group-by-header {
    border-color: #162228 !important;
}
/* swimlanes */
.teamroom .group-by-header td {
    background-color: #162228 !important;
    border-top-color: #162228 !important;
    color: white !important;
}

/*
 *
 * Card
 *
 */
.more-links {
    display: flex;
    align-items: center;
}

.more-links > *, .more-links img {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
}

.more-links > * {
 	margin: 5px;
}

.teamroom .story-card-container {
    margin-bottom: 15px !important;
    position: relative;
}

.teamroom .story-card {
    box-shadow: none !important;
    border-bottom: none !important;
    background-color: #37474f !important;
}

.teamroom .story-card  + .bottom-card-tab {

    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    margin: 0 !important;
    padding: 0 !important;
    height: 2px;
}

.teamroom .story-card + .bottom-card-tab .multibar {
    width: 100%;
    height: 2px;
    border-radius: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
}

.teamroom .story-card  + .bottom-card-tab img {
	width: 100% !important;
    height: 2px;
    position: absolute;
    top: 0;
}

.teamroom .story-card .asset-hover,
.teamroom .story-card .bottom-card-tab,
.teamroom .group-by-header td,
.teamroom .story-card .tag-holder a,
.teamroom .story-card .story-card-actions,
.teamroom .story-card .aging {
    color: #eceff1 !important;
}

.teamroom .story-card + .bottom-card-tab {
    background-color: #37474f !important;
    border-bottom: none !important;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12) !important;
}

.teamroom .story-card .identity-right,
.teamroom .story-card .identity-left .number {
    background-color: #162228 !important;
}

.teamroom .story-card .identity-left .number:before,
.teamroom .story-card .identity-right:before {
    border-color: #162228 #162228 transparent transparent !important;
}

.teamroom .story-card .identity-left .number:after {
 	border-color: #162228 transparent transparent #162228 !important;
}

.teamroom .story-card .tag-holder {
    background-color: #263238 !important;
}
/*
 *
 * Details Modal
 *
 */

/* reposition details modal */
.inline-asset-detail {
    top: 0;
    bottom: 0;
    left: 50px;
    right: 0;
}

.inline-asset-detail .toolbar {
    height: 0px;
    overflow: hidden;
}

.inline-asset-edit .toolbar .title-id {
	position: fixed;
    top: 0px;
    left: 76px;
    z-index: 2;
    color: black !important;
}

.asset-summary .toolbar h2 {
	user-select: all !important;
}

.asset-summary .toolbar .icon {
	visibility: hidden !important;
}

.side-panel {
    top: 0 !important;
}

/* color action dropdon */
.inline-asset-detail .asset-actions.tab-button {
    padding: 0 !important;
    background-color: #00a9e0 !important;
}

/* quick action "edit" button */
.inline-asset-detail .tab-buttons .quick-action-text {
    display: none;
}

.inline-asset-detail .action-menu-button {
    width: 100%;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Unwanted fields */
.inline-asset-detail .custom-fields,
.inline-asset-detail .layout-left .other-extended-fields,
.inline-asset-detail .tabbar .tabs {
    display: none !important;
}

/* open in tab link */
.inline-asset-detail .pop-out {
    position: fixed;
    bottom: 0;
    left: 50px;
    width: 42px;
    height: 42px;
    margin: 0;
    z-index: 2;
    background-size: auto;
    background-position: center;
    background-color: darkslategrey;
}

/*Grid*/
.grid .gridtable [_v1_updater="Test.Name"],
.grid .gridtable [_v1_updater="Story.Name"],
.grid .gridtable [_v1_updater="Epic.Name"]
{
    width: 35em !important;
}

/* shift board over to show team members */
.teamroom .window {
   width: calc(100% - 42px) !important;
}

/* All members filter */
.teamroom .mascot-wrapper {
 	position: fixed;
    left: 4px;
    top: 24px;
    width: 32px !important;
    height: 32px !important;
}

/* single member filter */
.teamroom .mascot-wrapper img {
    width: 32px !important;
    height: 32px !important;
}

.teamroom .persona-filters .owner-list ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 42px;
    margin: 0;
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    z-index: 100;
    overflow: hidden;
}

.teamroom .persona-filters .owner-list ul:hover {
 	overflow: auto !important;
}

.teamroom .persona-filters .owner-list ul li {
	margin-right: 0 !important;
}

/* scollbars */
.teamroom .board {
    height: 100vh !important;
}

.teamroom .window::-webkit-scrollbar,
.teamroom .persona-filters .owner-list ul::-webkit-scrollbar {
    width: 4px;
    height: 0;
}

.teamroom .panel-wrapper::-webkit-scrollbar {
 	height: 4px;
}

.teamroom .panel-wrapper::-webkit-scrollbar-thumb,
.teamroom .window::-webkit-scrollbar-thumb,
.teamroom .persona-filters .owner-list ul::-webkit-scrollbar-thumb {
    background-color: #eceff1;
}

.teamroom .persona-filters .owner-list ul .name {
    display: none !important;
}

.teamroom .panel-wrapper .panels ol li {
 	border: none !important;
}


/*
 * No data state
*/
.teamroom .no-results {
    color: white;
    background: #162228;
    height: 100vh;
    top: -28px;
    position: absolute;
    right: 0;
    left: 0;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
}


/**

**/
.taskboard {
    table-layout: fixed;
}

.rollup-status {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
}

/**
Toggle between list view and board view
**/

.list-view {
    width: 100%;
    position: fixed;
    top: 0;
    left: 45px;
    right: 0;
    bottom: 0;
    background: #162228;
    z-index: 9999;
    color: white;
    overflow-y: scroll;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.flex-column {
    display: flex;
    flex-direction: column;
}

.list-view-item {
    border-bottom: 1px solid white;
}

.list-view-item .icon {
 	width: 32px;
    height: 32px;
    margin: 8px;
    margin-top: 0;
}

.list-view-item .icon.Story {
    background: green;
}

.list-view-item .icon.Defect {
    background: red;
}

.list-view a {
    color: white !important;
}

.list-view > * {
    padding: 8px;
}

.list-view .number {
    user-select: all;
    cursor: pointer;
}

.toggleListView {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99999999;
    background: green;
    border-radius: 50%;
    width: 30px;
    height: 30px;
}

.release-info {
    margin-left: auto;
    margin-right: auto;
    padding: 8px;
    border-color: black;
    text-align: center;
    font-weight: bold;
}

.release-info span {
    background-color: yellow;
    padding: 8px;
    border-color: yellow;
}`);
    const paperIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Computer_icon_for_Dropbox_Paper_app.png/480px-Computer_icon_for_Dropbox_Paper_app.png';

    const queryV1 = `/${v1Instance}/query.v1`;

    $(document).arrive('.taskboard.sticky-header', function() {
        const taskboard = $(this);
        const query =`
                from: Milestone
                select:
                - Name
                - Date
                - Description
                where:
                 Scope.Name: VersionOne
                sort:
                - -Date
                page:
                 start: 0
                 size: 1`;
        try {
            axios.post(queryV1, query).then(resp => {
                const milestone = resp.data[0][0];
                const desc = milestone.Description;
                const releaseDate = moment(milestone.Date).format("MM/DD/YYYY");
                const releaseInfo = `${desc} ${milestone.Name}: <span id='release-counter'></span>`;
                taskboard.parent().prepend(`<div class='release-info'><span>${releaseInfo}</span></div>`);
                $('#release-counter').countdown(releaseDate).on('update.countdown', function(event) {
                    var $this = $(this).html(event.strftime(''
                                                            + '<span>%-w</span> week%!w '
                                                            + '<span>%-d</span> day%!d '
                                                            + '<span>%H</span> hr '
                                                            + '<span>%M</span> min '
                                                            + '<span>%S</span> sec'));
                });
            });
        } catch (e) {
        }
    });

    $(document).arrive(".story-card", function() {
        const story = $(this);
        const numberEl = story.find('.number');
        const number = numberEl.text().trim();
        axios.post(queryV1, {
            "from": "Workitem",
            "where": {
                "Number": number
            },
            "select": [
                "Super.Name",
                "Super.Number",
                {
                    "from": "Super.Attachments",
                    "where": {
                        "Name": "Avatar"
                    },
                    "select": [
                        "Filename"
                    ]
                },
                {
                    "from": "Super.Links",
                    "where": {
                        "Name": "Paper Doc"
                    },
                    "select": ["URL"]
                }
            ]
        })
        .then(function (response) {
            const resp = response.data[0][0];
            let superName = resp['Super.Name'];
            let superNumber = resp['Super.Number'];
            let img = '';
            let dblink = '';
            let paperUrl;
            try {
                const avatar = resp['Super.Attachments'][0];
                const attachmentId = avatar._oid.substring("Attachment:".length);
                const filename = avatar.Filename;
                var url = `/${v1Instance}/attachment.img/${attachmentId}/${filename}`;
                img = `<a href='/${v1Instance}/assetdetail.v1?Number=${superNumber}' target='_blank'><img src='${url}' title='${superName}' /></a>`;
            } catch (e) {
            }
            try {
                const link = resp['Super.Links'][0];
                paperUrl = link.URL;
            } catch(e) {
            }
            var paperLink = paperUrl ? `<a href='${paperUrl}' target='_blank'><img src='${paperIcon}' /></a>` : "";
            story.append(`<div class="more-links">${img}${paperLink}</div>`);
        })
        .catch(function (error) {
            console.log(error);
        });
    });

    var columnSelector = 'td.row-cell'
    var columnHeaderSelector = '.KanbanBoard .rollup-status';

    $(document).arrive(columnHeaderSelector, function() {
        const $headers = $(columnHeaderSelector);
        const isCollapsedByIndex = {};
        $headers.each((index, columnHeader) => {
            var $columnHeader = $(columnHeader);
            isCollapsedByIndex[index] = false;
            $columnHeader.on('click', function() {
                const nextState = !isCollapsedByIndex[index];
                isCollapsedByIndex[index] = nextState;

                var expandedCount = Object.keys(isCollapsedByIndex).reduce((acc, next) => {
                   return acc + (next ? 1 : 0)
                }, 0);

                var collapsedCount = Object.keys(isCollapsedByIndex).length - expandedCount;

                var collapsedColumnPercentage = 2;
                var remainingPrecentage = 100 - (collapsedCount * collapsedColumnPercentage);

                var newWidthPercentage = remainingPrecentage/expandedCount;

                $(`.taskboard .row-cell:nth-child(${index + 1}) *`).css('opacity', nextState ? 0 : 1);

                $('.taskboard colgroup col').each((jndex, col) => {
                    var $col = $(col);
                    $col.width(isCollapsedByIndex[jndex] ? `${collapsedColumnPercentage}%` : `${newWidthPercentage}%`)
                });
            });
        });
    });

    var swimlaneSelector = '.group-by-header';
    $(document).arrive(swimlaneSelector, function() {
        var $swimlanes = $(swimlaneSelector);

        var isCollapsedByIndex = {};
        $swimlanes.each((index, element) => {
            var $swimlaneHeader = $(element);
            isCollapsedByIndex[index] = false;

            $swimlaneHeader.on('click', function(event) {
                var $swimlane = $swimlaneHeader.next();

                var nextState = !isCollapsedByIndex[index];
                isCollapsedByIndex[index] = nextState;

                $swimlane.children().css('display', nextState ? 'none' : 'table-cell');
            })
        });
    });

    $(document).arrive('.KanbanBoard', function() {
        var typeAttr = '_v1_type';
        var rankAttr = '_v1_rank';
        var oidAttr = '_v1_asset';

        var $cards = $('.story-card-container');

        var cards = [];

        $cards.each((index, card) => {
            var $card = $(card);
            var type = $card.attr(typeAttr);
            var rank = $card.attr(rankAttr);
            var oid = $card.attr(oidAttr);
            var title = $card.find('.title').html();
            var number = $card.find('.number').html();

            cards.push({
                type: type,
                rank: rank,
                oid: oid,
                title: title,
                number: number,
            });
        });

        var sortedCards = cards.sort((prev, next) => prev.rank > next.rank);


        var lis = sortedCards.reduce((acc, next) => {
            return acc + `<div class="list-view-item flex-row">
<div class="icon ${next.type}"></div>
  <div class="flex-column">
    <div>
     <span class="number">${next.oid}</span>
     <span class="number">${next.number}</span>
    </div>
  <div>${next.title}</div>
</div>
</div>`
        }, '');

        $(document.body).append(`<div class="list-view hidden">${lis}</div>`);

        $(document.body).append('<div class="toggleListView"></div>');

        $('.toggleListView').on('click', function() {
            $('.list-view').toggleClass('hidden');
        });

    });
})();
