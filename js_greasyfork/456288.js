// ==UserScript==
// @name         FIRST Volunteer Management System Improvements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Making the user experience for VCs, including those relying on screen readers, just a little bit better
// @author       Brad Thompson <bthompson@firstindianarobotics.org>
// @match        https://my.firstinspires.org/VMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firstinspires.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456288/FIRST%20Volunteer%20Management%20System%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/456288/FIRST%20Volunteer%20Management%20System%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.pathname == '/VMS/Default.aspx') {

        $('#MainContent_EventGroupingsP').remove()

        let $container = $('<div class="ImprovedList"></div>')
        $container.insertBefore($('#MainContent_ProgramGroupDiv'))

        $('table[id*="EventsTable"]').each( (i, table) => {
            let $table = $(table)
            let program = $($table.find('tr')[1]).find('td')[3].innerHTML

            $container.append(`<h2><u>${program}</u></h2>`)

            $table.find('tr').each ( (j, row) => {
                if(row.classList.length != 0) { return }
                let $row = $(row)
                let ev = $container.append('<article></article>')
                ev.append(`<h3>${$($row.children()[0]).find('a').context.outerHTML} - ${$row.children()[1].innerHTML}</h3>`)
                ev.append(`<p>${$($row.children()[5]).text()} of ${$($row.children()[4]).text()} assigned, ${$($row.children()[7]).text()} unassigned</p>`)
            })
        })

        $('#MainContent_ProgramGroupDiv').remove()
    }

    if(window.location.pathname == '/VMS/Events/EventDetails.aspx') {

        let $dashboardRow = $('<section class="row"></div>')
        let $rolesBox = $('<section class="col-md-8"></div>')
        $('#CurrentEvents').append($dashboardRow)
        $('#CurrentEvents > div').each( (i, e) => {
            let x = $(e).detach();
            $rolesBox.append(x)
        })
        $dashboardRow.append($rolesBox)
        let $betterList = $('<div id="BetterList"><h2>Role Assignments</h2></div>')
        $rolesBox.prepend($betterList)

        let $reportBox = $('<div class="col-md-4"></div>')
        $reportBox.append('<h2>Reports</h2>')
        $dashboardRow.append($reportBox)

        let nullRoles = []

        $('#EventDetailTabs > li:nth-child(2)').remove()

        $('#CurrentEvents table[id*="EventDetailTable"] tr, #CurrentEvents a.grouping').each( (i, row) => {
            if(row.tagName === 'A') {
                $betterList.append(`<h3><strong>${$(row).text()}</strong></h3>`)
            } else {
                let $row = $(row)
                let targetNumber = parseInt($($row.children()[2]).text())
                if($row.children()[3].tagName === 'TH') { return }
                let assignment = `${$($row.children()[0]).find('a')[0].outerHTML}: ${$($row.children()[3]).text()} of ${targetNumber}`

                let additional = ''
                if(parseInt($($row.children()[4]).text()) > 0) {
                    additional += `${$($row.children()[4]).text()} Tentative`
                }
                if(parseInt($($row.children()[5]).text()) > 0) {
                    if(additional.length > 0) { additional += ', ' }
                    additional += `${parseInt($($row.children()[5]).text())} Unassigned`
                }

                let $para = $('<p></p>')
                $($para).html(assignment)
                if(additional.length > 0) {
                    $($para).append(', ')
                    $($para).append(additional)
                }

                if(targetNumber > 0) {
                $betterList.append($para)
                } else {
                    nullRoles.push($para)
                }

            }
        })

        if(nullRoles.length > 0) {
            $betterList.append('<h3><strong>Unneeded Roles</strong></h3>')
            nullRoles.forEach( e => { $betterList.append(e) })
        }

        $('#CurrentEvents div[id*="group"]').remove()

        $('#ReportTable tr').each( (i, row) => {
            if(row.children[0].tagName === 'TH') { return }
            let $para = $('<p></p>')
            $para.append(row.children[0].children[0])
            $para.append(':')
            $para.append(row.children[1].textContent)
            $reportBox.append($para)
        })
    }

    if(window.location.pathname == '/VMS/Roles/RoleScheduling.aspx') {
        $('<style>').text(".cellInfoDiv:empty:before{content:'Click to Assign'}").appendTo(document.head)
    }
})();