// ==UserScript==
// @name        repmastered.app winrate sort
// @description Improves matchup tables with sorting and grouping data
// @namespace   https://github.com/T1mL3arn
// @version     1.0.3
// @match       https://repmastered.app/map/*
// @grant       none
// @author      T1mL3arn
// @run-at      document-end
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js
// @license     WTFPL 2
// @icon        https://repmastered.app/static/img/favicon.ico
// @homepageURL https://github.com/t1ml3arn-userscript-js/repmastered.app-winrate-sorting
// @supportURL  https://github.com/t1ml3arn-userscript-js/repmastered.app-winrate-sorting/issues
// @downloadURL https://update.greasyfork.org/scripts/417840/repmasteredapp%20winrate%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/417840/repmasteredapp%20winrate%20sort.meta.js
// ==/UserScript==

// add DataTables CSS
const link = document.createElement('link')
link.rel = "stylesheet"
link.type = "text/css"
link.href = "https://cdn.datatables.net/v/dt/dt-1.10.21/datatables.min.css"
link.onload = _ => run()

document.head.appendChild(link)

// ----------------------------

class query {

    constructor() {
        this.result = []
    }

    from(data) {
        this.result = data.slice()
        return this
    }

    where(filter) {
        this.result = this.result.filter(filter)
        return this
    }

    /**
     * Group data (by only 1 column !!!)
    */
    groupBy(func) {
        // get all unique groups
        const groups = new Set(this.result.map(row => func(row)))
        // collect all values for all groups
        this.result = [...groups].map(gr => [gr, this.result.filter(i => func(i) == gr)])
        // the result now looks like:
        /*
        [
          [group_1, [ row_1, row_2, ...]],
          [group_2, [ row_3, row_5, ...]],
          ...
        ]
        */
        return this
    }

    aggregate(targetCol, func, colAlias = null) {
        this.result.forEach(row => {
            const groupData = row[1]
            const dateToAggreagate = groupData.map(obj => obj[targetCol])
            const result = func(dateToAggreagate)

            row.push({ alias: colAlias || targetCol, value: result })
        })

        /*  now results look like this
        [
          [group_1, [ row_1, row_2, ...], { alias: alias_1, value: gr_1_aggr_result }, { }, ... ],
          [group_2, [ row_3, row_5, ...], { alias: alias_1, value: gr_2_aggr_result }, { }, ... ],
          ...
        ] 
        */

        return this
    }
}

/**
 * Add <thead> if a table misses it
*/
function addThead($table) {
    $table.not(":has(thead)")     // get tables without <thead>
        .each((i, t) => {
            $(t).find("tr:first-child")   // lets suppose the first <tr> is <thead>
                .wrap("<thead>")          // wrap it with header 
                .parent()                 // then get this header
                .remove()                 // remove the header
                .prependTo(t)             // and add the header into beginning of original table
        })

    return $table
}

/** Creates textual tag for given elt. 
 * The text then should be passed into jquery 
 * to create DOM element. */
function ce(elt) {
    return `<${elt}></${elt}>`
}

// ----------------------------

// CSS fixes
// NOTE: DataTables CSS interferes with repmastered CSS,
// so it should be fixed

const STATS_TABLE_CLASS = 'stats-tbl'

const CSS_FIX = `
    
    .${STATS_TABLE_CLASS} {
        border-collapse: collapse !important;
    }
    
    .${STATS_TABLE_CLASS} td, .${STATS_TABLE_CLASS} th {
        padding: 3px !important;
    }

    .${STATS_TABLE_CLASS} th {
        padding-right: 8px !important;
        position: unset !important;
    }

    .${STATS_TABLE_CLASS} td {
        text-align: center;
    }

    .${STATS_TABLE_CLASS} tr:first-child th[colspan='1'][rowspan='1'] {
        height: 2.25em;
    }

    .${STATS_TABLE_CLASS} thead {
        position: sticky;
        top: 0;

        /* this fixes repmastered.app arrows visibility 
            over a table header */
        z-index: 1;
    }

    /* row striping */
    .${STATS_TABLE_CLASS} tr:nth-child(even) { background-color: #fff !important }
    .${STATS_TABLE_CLASS} tr:nth-child(odd) { background-color: #fff3cf !important }
    .${STATS_TABLE_CLASS} tr:hover { background-color: #ddf !important }

    .dataTables_wrapper.hidden { display: none; }

    .text--hint { color: #777; font-style: italic; font-size: 0.9em; }

    .winrate-tbl-menu { margin-top: 1em; }

    .matchup-details { 
        border-top: 1px solid #ccc; 
        margin-top: 2em;
        margin-bottom: 1em;
    }

    td.no-after::after {
        content: '';
    }
`

$('<style></style>').attr('id', 'sort-stats-css-fix').text(CSS_FIX).appendTo('head')

/**
 * Fixes css for initialized(!) DataTables.
 * @param {jQuery} $target jQeury object (list of tables)
 */
function fixCss($target, width = '80%') {
    $target.addClass(['display'])
    $target.parent().css('width', width)
    $target.parent().find('.dataTables_filter').css('margin-bottom', '.5em')
    return $target
}

/** Removes markup from text extracted from matchup coulumn */
function getMatchup(txt) {
    txt = txt.slice(txt.indexOf('>')+1)
    return txt.slice(0, txt.indexOf('<'))
}

/**
 * Fills background of a given cell with linear gradient.
 * @param {jQuery} cell table cell (jquery object)
 * @param {Number} fill Percent value for linear-gradient()
 */
function addProgressBar(cell, fill = 0) {
    cell.css('background', `linear-gradient(to right,#fd0 ${fill}%,#ccc ${fill}%)`)
}

/** 
 * Creates menu to control what table to show - 
 * detailed stats or grouped by race composition.
 * @param {jQuery} srcTable Source detailed table (jquery DOM object)
 * @param {jQuery} groupTableWrap Grouped table's wrapper (jquery DOM object)
*/
function createGroupCtrlMenu(srcTable, groupTableWrap) {

    const check = $(ce('input')).attr({type: "checkbox"}).get(0)
    check.dataset.srcId = srcTable.parent().attr('id')
    check.dataset.targetId = groupTableWrap.attr('id')
    $(check).change(e => {
        srcTable.parent().toggleClass('hidden')
        groupTableWrap.toggleClass('hidden')
    })

    const div = $(ce('div')).addClass('winrate-tbl-menu')
    div.insertBefore(srcTable.parent())
    
    $(ce('label')).append(check)
        .append($(ce('span')).text('Group by race combination'))
        .appendTo(div)

    $(ce('p')).text('NOTE: Grouped data exclude mirror matchups')
        .addClass('text--hint')
        .appendTo(div)

    $(ce('p')).text('HINT: shift-click a column for multiple-column ordering')
        .addClass('text--hint')
        .appendTo(div)
}

/** Mimics original popup behavior when a user clicks on a matchup cell */
function showMatchup2Popup(e) {
    // save original text
    const cell = e.currentTarget
    const srcText = cell.textContent
    
    // restore full matchup name
    cell.textContent = $(cell).parent().prev().text() + 'v' + srcText
    
    // call method how it should be called
    showPopup('matchup2', cell)
    
    // restore original text
    cell.textContent = srcText
}

/** Add shared title attribute to both matchup cells 
 * (they were splitted before) */
function setMatchupTitle(td, d, row) {
    $(td).attr('title', `${row[0]}v${getMatchup(row[1])}`)
}

// ----------------------------

function run() {

// VM tells me @require scripts are executed before the script itself
// and also the script executed on "document-end" event
// so it should be safe to just use jquery and the rest.

// set ids to matchup tables
$('h3').filter((i, elt) => {
    const match = elt.textContent.match(/(\d)v\d\smatchups/i)
    if (match) {
        const num = match[1]
        // new id for a table
        // looks like "v11" or "v44" etc
        const id = 'v' + num + num

        // find the <table> (it is sibling with <h3> parrent elt - <summary>)
        // and set its new id
        $(elt.parentNode).find('+ table')
            .attr('id', id)
            .addClass(STATS_TABLE_CLASS)
    }
})

const TBL_SELECTOR = '.'+STATS_TABLE_CLASS

// DataTables lib demands <thead> for <table>
addThead($(TBL_SELECTOR))

// remove first column with row number
$(TBL_SELECTOR).find('th:first-child, td:first-child').remove()
// delete DOWN arrow
$(TBL_SELECTOR).find('thead').find('th:contains("Games ↓")').text('Games')
// for tables all except 1v1
$(TBL_SELECTOR).not('#v11').each((i, tbl) => {

    // split matchup into 2 columns 
    $(tbl).find('tbody tr td:first-child')
        .each((i, td) => {
            const matchup = $(td).text().split('v')
            $(ce('td')).text(matchup[0]).insertBefore(td)
            $(td).find('span')
                .text(matchup[1])
                .attr('onclick', '')
                .click(showMatchup2Popup)
        })
    
    // extend table headers after matchup spliting
    // see example for colspan/rowspan there - https://jsfiddle.net/qgk5twdo/
    $(tbl).find('thead th:first-child').attr('colspan', 2)
    $(tbl).find('thead th:not(:first-child)').attr('rowspan', 2)
    $(tbl).find('thead').append('<tr></tr>')
        .find('tr:last-child')
        .append('<th>race</th>')
        .append('<th>race</th>')
})

// init tables as DataTables
const initv11 = {
    paging: false,
    order: [[4, "desc"]],
    orderMulti: true,
    columnDefs: [
        // disable ordering for some columns
        { orderable: false, targets: [3, 8, 9] }
    ],
    autoWidth: false,
}
$('#v11').DataTable(initv11)

const initArgs = {
    paging: false,
    order: [[5, "desc"]],
    orderMulti: true,
    columnDefs: [
        // disable ordering for some columns
        { orderable: false, targets: [4, 9, 10] },
        { createdCell: setMatchupTitle, targets: [0, 1] },
    ],
    autoWidth: false,
}
$('#v22, #v33, #v44').DataTable(initArgs)

// ----------------------------

// apply CSS fixes
fixCss($(TBL_SELECTOR))
$(TBL_SELECTOR).each((i, tbl) => {
    const id = tbl.id
    $(tbl).parent().parent()
        .addClass('matchup-details')
        .attr('id', `${id}-details`)
})
$(TBL_SELECTOR).not('#v11').find('tbody tr')
    .find('td:first-child, td:nth-child(2)')
    .addClass('no-after')

// ----------------------------

// build groupped data

function split_1v1_race(data) {
    return data.map(row => {
        const split = row[0].split('v')
        return [...split, ...row.slice(1)]
    })
}

function duplicateMatchupRows(data) {
    return data.concat(data.map(row => {
        const newRow = row.slice()
        newRow[5] = 100 - parseInt(newRow[5])
        newRow[0] = row[1]
        newRow[1] = row[0]
        return newRow
    }));
}

const rawData = [];

(function(){
    let data = $('#v11').DataTable().rows().data().toArray()
    data.forEach( row => row[0] = getMatchup(row[0]) )
    data = split_1v1_race(data)
    data = duplicateMatchupRows(data)
    rawData.push(data)
})();

$('#v22, #v33, #v44').each((i, tbl) => {
    let data = $(tbl).DataTable().rows().data().toArray()
    data.forEach( row => row[1] = getMatchup(row[1]) )
    // duplicate data to get all race combinations
    data = duplicateMatchupRows(data)
    rawData.push(data)
})

// filter, grouping and aggregates
const notMirror = row => row[0] != row[1] ;
const matchupGroup = row => row[0]
const sum = value => value.reduce((acc, cur) => acc + parseInt(cur), 0)
const avg = value => sum(value) / value.length
const minStr = value => value.reduce((acc, curr) => curr < acc ? curr: acc)
const maxStr = value => value.reduce((acc, curr) => curr > acc ? curr: acc)

const groupData = rawData.map(rows => {
    return new query().from(rows)
        .where(notMirror)
        .groupBy(matchupGroup)
        .aggregate(5, avg, 'winrate')
        .aggregate(2, sum, 'num games')
        .aggregate(3, sum, 'num games %')
        .aggregate(7, minStr, 'first game')
        .aggregate(8, maxStr, 'last game')
        .result;
})

// console.log(groupData);

/**
 * Creates race composition winrate table.
 * Returns jQuery object
 */
function createRCWTable(){
    return $(ce('table')).append(ce('thead'))
        .find('thead').append(ce('tr'))
        .find('tr')
            .append($(ce('th')).text('Race').attr('title', 'Race composition'))
            .append($(ce('th')).text('Winrate %'))
            .append($(ce('th')).text('Games'))
            .append($(ce('th')).text('Games %'))
            .append($(ce('th')).text('First Game'))
            .append($(ce('th')).text('Last Game'))
        .parent()   // back to <thead>
        .parent()   // back to <table>
        .addClass(STATS_TABLE_CLASS)
}

$('#v11, #v22, #v33, #v44').each((i, srcTable) => {
    // groupData[i] is an array of rows with aggregate results
    const data = groupData[i].map(row => {
        return [
            row[0],         // race composition
            row[2].value,   // winrate
            row[3].value,   // games
            row[4].value,   // games %
            row[5].value,   // first game
            row[6].value,   // last game
        ];
    })

    // calc "Games %" properly
    const sumGames = data.reduce((acc, row) => acc + row[2], 0)
    data.forEach(row => row[3] = (row[2] * 100) / sumGames )

    const initArgs = {
        paging: false,
        data: data,
        order: [[1, "desc"]],
        orderMulti: true,
        autoWidth: false,
        columnDefs: [ {
            // render percent symbol in "Games %" column
            targets: 3,
            render: val => String(Math.round(val)) + '%'
        }, {
            // render percent symbol in "Winrate %" column
            targets: 1,
            render: val => String(Math.round(val)) + '%'
        } ],
    }

    const tbl = createRCWTable()
    tbl.DataTable(initArgs)

    const tblWrap = tbl.DataTable().table().container()

    // such tables are hidden by default
    $(tblWrap).addClass('hidden')

    fixCss(tbl, '60%')
    
    // add progress bar bg for "games" and "winrate" columns
    tbl.find('tbody td:nth-child(2), tbody td:nth-child(4)')
        .each((i, td) => addProgressBar($(td), parseFloat($(td).text())) );

    // place group table after coresponding initial table
    $(srcTable).parent().after(tblWrap)

    createGroupCtrlMenu($(srcTable), $(tblWrap))
})

}
