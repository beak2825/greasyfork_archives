// ==UserScript==
// @name         Leetcode Points
// @license      MIT
// @namespace    https://github.com/pk2sd
// @version      0.3
// @description  see monthly progress of leetcode points
// @author       https://leetcode.com/pK2015/
// @match        https://leetcode.com/store/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445401/Leetcode%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/445401/Leetcode%20Points.meta.js
// ==/UserScript==

$('document').ready(() => {
    $.ajax({
        url: 'https://leetcode.com/points/api/'
    }).done((response) => {
        parseDataAndAddSummary(response)
    })

    let toTable = (map) => {
        let mapToTr = (totr) => {
            return Array.from(totr).sort((a, b) => {
                return parseInt(b[1]) - parseInt(a[1])
            }).map((entry) => {
                let key = entry[0]
                let value = entry[1]
                return '<tr>'
                    + '<td style="padding-right: 2px">'
                    +  key
                    + '</td>'
                    + '<td>'
                    +  value
                    + '</td>'
                    + '</tr>'
            }).reduce((prev, cur) => prev + cur, '')

        }
        return '<table>'
            + '<thead>'
            + '<tr>'
            + '<th>'
            +  'Activity'
            + '</th>'
            + '<th>'
            +  'Points'
            + '</th>'
            + '</tr>'
            + '</thead>'
            + '<tbody>'
            + mapToTr(map)
            + '</tbody>'
            + '</table>'


    }
    const curmonth = new Date().getMonth()
    const curyear = new Date().getFullYear()
    let  points = null
    let construct = () => {
        const year = $('#years').find(":selected").attr('value') || curyear
        const month = $('#months').find(":selected").attr('value') || curmonth
        const npoints = points.scores.map(point => {
            return {...point, date: new Date(Date.parse(point.date))}
        }).filter(p => p.date.getMonth() == month && p.date.getFullYear() == year)
        const total = npoints.map(p => p.score).reduce((x,y) => x+y,0);
        const activityToPointsMap = npoints.reduce((map, curPoint) => {
            if(map.has(curPoint.description)){
                map.set(curPoint.description, map.get(curPoint.description) + curPoint.score)
            } else {
                map.set(curPoint.description, curPoint.score)
            }
            return map
        }, new Map())

        $('#points_p').html('<h4> Total points: ' + total + '</h4><br/>' + (activityToPointsMap.size > 0 ? toTable(activityToPointsMap): ''))
    }

    let parseDataAndAddSummary = (pointss) => {
        const months = [0,1,2,3,4,5,6,7,8,9,10,11]
        const years = Array.from(new Set(pointss.scores.map(point => new Date(Date.parse(point.date)).getFullYear())))

        $('<p>', {id: 'points_p'}).prependTo('body')
        $('#points_p').css('display', 'flex')
        $('#points_p').css('align-items', 'center')
        $('#points_p').css('justify-content', 'center')

        $('body').prepend(`<div id = "options_div">
          <label for="months"> Month </label>
          <select id="months">
          </select>
          <label for="years"> Year </label>
          <select id="years">
          </select>
        </div>`)


        months.forEach((m) => {
            let selected = m === curmonth
            $('#months').append(`
            <option value="${m}" ${selected ? "selected" : ""}>
            ${m + 1}
            </option>
            `
            )
        })

        years.forEach((y) => {
            let selected = y === curyear
            $('#years').append(`
            <option value="${y}" ${selected ? "selected" : ""}>
            ${y}
            </option>
            `
            )
        })
        $('#months').change(construct)
        $('#years').change(construct)
        points = pointss
        construct()

    }
    })