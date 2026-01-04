// ==UserScript==
// @name         12306cal
// @namespace    http://github.com/w1ndy/12306.cal
// @version      1.1
// @description  用户可借助此脚本将他们在12306网站上订购的车票添加到Google日历中。脚本在12306网站的“本人车票”页面上生效。
// @author       w1ndy
// @match        https://kyfw.12306.cn/otn/view/personal_travel.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381971/12306cal.user.js
// @updateURL https://update.greasyfork.org/scripts/381971/12306cal.meta.js
// ==/UserScript==

(function() {
    'use strict'

    function attachButton() {
        document.querySelectorAll('.order-item-bd:not(.cal-injected)')
        .forEach(async el => {
            const noticePrintBtn = el.querySelector('#notice_print')
            if (!noticePrintBtn || noticePrintBtn.classList.contains('btn-disabled')) {
                return
            }
            el.classList.add('cal-injected')

            const ticketId = /\?(.*)/.exec(noticePrintBtn.href)[1]
            const resp = await fetch('https://kyfw.12306.cn/otn/psr/getItineraryNotice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `ext_ticket_no=${ticketId}`
            })
            const itinerary = await resp.json()

            const fromStation = itinerary.data.itinerary_notice.psr.from_station_name
            const toStation = itinerary.data.itinerary_notice.psr.to_station_name
            const train = itinerary.data.itinerary_notice.psr.board_train_code
            const date = itinerary.data.itinerary_notice.psr.start_date
            const startTime = itinerary.data.itinerary_notice.psr.start_time
            const endTime = itinerary.data.itinerary_notice.psr.arrive_time
            const startDate = new Date(`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}T${startTime.slice(0,2)}:${startTime.slice(2,4)}Z`)
            const endDate = new Date(`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}T${endTime.slice(0,2)}:${endTime.slice(2,4)}Z`)
            const seat = `${itinerary.data.itinerary_notice.psr.coach_name}车${itinerary.data.itinerary_notice.psr.seat_name}`
            const platform = itinerary.data.platform

            // Convert to UTC
            startDate.setTime(startDate.getTime() - 8*60*60*1000)
            endDate.setTime(endDate.getTime() - 8*60*60*1000)

            const startDateString = startDate.toISOString().replace(/[:\-]|(\.000)/g, '')
            const endDateString = endDate.toISOString().replace(/[:\-]|(\.000)/g, '')

            const button = document.createElement('a')
            button.className = 'btn add_to_calendar'
            button.target = '_blank'
            button.href = encodeURI(`https://www.google.com/calendar/render?action=TEMPLATE&text=乘坐 ${train} 从${fromStation}到${toStation}&location=${fromStation}火车站 ${platform} 检票口&dates=${startDateString}/${endDateString}&details=座位：${seat}`)
            button.appendChild(document.createTextNode('添加到 Google 日历'))
            el.querySelector('.btn-right').prepend(button)
        })
    }

    const xhrOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', attachButton)
        xhrOpen.apply(this, arguments)
    }
})();
