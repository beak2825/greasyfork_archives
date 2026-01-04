// ==UserScript==
// @name        [WM] Companies House
// @description n/a
// @version     22.11.04.0
// @author      Folky
// @namespace   https://github.com/folktroll/
// @license     MIT
// @icon        https://nilgam.edu.eu/wp-content/uploads/2020/07/comphouse_logo3.png
// @match       https://find-and-update.company-information.service.gov.uk/officers/*/appointments
// @match       https://find-and-update.company-information.service.gov.uk/officers/*/appointments/
// @run-at      document-idle
// @grant       GM_notification
// @grant       GM_setClipboard
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/439517/%5BWM%5D%20Companies%20House.user.js
// @updateURL https://update.greasyfork.org/scripts/439517/%5BWM%5D%20Companies%20House.meta.js
// ==/UserScript==

/*
Next Rule: #next-page
Page Element Rule: #content-container > div.appointments > *

Demo pages:
  https://find-and-update.company-information.service.gov.uk/officers/w41r7XTfPUTRP2w9n4pcOtntQW0/appointments
  https://find-and-update.company-information.service.gov.uk/officers/9vQQqyMsDVjGAuRcoPr4wfwfyz0/appointments
  https://find-and-update.company-information.service.gov.uk/officers/RUO-raH1bGUrnlm74RbqSKuxXiU/appointments 2 pages
  https://find-and-update.company-information.service.gov.uk/officers/_vNu2AcmmiELqq4F1-Ag_sR-Goo/appointments
  https://find-and-update.company-information.service.gov.uk/officers/066HCNop53jXuJwci43EqE8jCAU/appointments
  https://find-and-update.company-information.service.gov.uk/officers/6nl2e9IPvJ32DvZkUH7CZ_RXtwA/appointments 1 page
  https://find-and-update.company-information.service.gov.uk/officers/P651lHK_fLu4o4270se4z_JmoKo/appointments 3 pages
  https://find-and-update.company-information.service.gov.uk/officers/pY4zQNXmOG9IpENb1s2zoT0y5PY/appointments 3 pages
  https://find-and-update.company-information.service.gov.uk/officers/l9CqsdpSJoLXSNbbnaZQ8teaujM/appointments 5 pages
  https://find-and-update.company-information.service.gov.uk/officers/cQfRXQMNk-MJhhk9xTLTOEMlQQ0/appointments 401 positions
  https://find-and-update.company-information.service.gov.uk/officers/ZeEJtdj_Xm41mxvjyEcNUZDf9s0/appointments 300+ positions
  https://find-and-update.company-information.service.gov.uk/officers/fx-7biuknvGDDwmvqQ3wovhGFbI/appointments 3 pages + co sec
  https://find-and-update.company-information.service.gov.uk/officers/rNLL8_6GSRajsUYXSAzums22-2U/appointments 350 positions
*/

let isDone = 0
const total = parseInt(document.querySelector("#personal-appointments").innerText.split(' ').pop())
let currLen = 0

const dictionary = {
    "Secretary": "Company Secretary",
    "Uk": "UK",
    "Usa": "USA",
    "Llp": "LLP",
}

String.prototype.toProperCase = function() {
  return this.toLowerCase().replaceAll('_', ' ').replaceAll(/(^\w|[\s\(]\w)/g, firstCharOfWord => firstCharOfWord.toUpperCase());
  //return this.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

let output = ''
let objOtherPos = {}
let objPrevPos = {}
let otherPos = 'Other positions:\r\n'
let prevPos = 'Previous positions:\r\n'

const main = () => {
    if(isDone === 1)
        return

    let appointment = document.querySelectorAll('div[class*="appointment-"]')
    currLen = appointment.length
    console.log(total, currLen)
    if(currLen === total) {
      appointment.forEach((e, index) => {
        var innerIndex = parseInt(e.className.split('-').pop())
        let position = e.querySelector(`#appointment-type-value${innerIndex}`).innerText.trim()
        let company = e.querySelector(`#company-name-${innerIndex} > a`).innerText.trim()
        let companyStatus = e.querySelector(`#company-status-value-${innerIndex}`).innerText.trim().toLowerCase()
        let status = e.querySelector(`#appointment-type-field-${innerIndex}`).innerText.trim().toLowerCase().replace('role ', '')
        let replace = ` (${e.querySelector(`#company-name-${innerIndex} > a`).href.split('/').pop()})`
        company = company.replace(replace, '').toProperCase()

        if(companyStatus === 'active') {
            if(status === 'active') {
                if (objOtherPos[company] && objOtherPos[company].indexOf(position) === -1) {
                    objOtherPos[company].push(position)
                } else {
                    objOtherPos[company] = [position]
                }
            } else {
                if (objPrevPos[company] && objPrevPos[company].indexOf(position) === -1) {
                    objPrevPos[company].push(position)
                } else {
                    objPrevPos[company] = [position]
                }
            }
        }
      })


      //console.log("objOtherPos", Object.keys(objOtherPos).length, objOtherPos)
      if(Object.keys(objOtherPos).length > 0) {
        Object.entries(objOtherPos).forEach(([k, v]) => { otherPos += '- ' + k + ', ' + v.join(', ') + '\r\n' })
        output += otherPos + '\r\n'
      }

      //console.log("objPrevPos", Object.keys(objPrevPos).length, objPrevPos)
      if(Object.keys(objPrevPos).length > 0) {
        Object.entries(objPrevPos).forEach(([k, v]) => { prevPos += '- ' + k + ', ' + v.join(', ') + '\r\n' })
        output += prevPos + '\r\n'
      }

      Object.entries(dictionary).forEach(([k, v]) => { output = output.replaceAll(k, v) })

      console.log(output)
      isDone = 1
      window.scrollTo(0, 0)

      GM_notification({
        title: GM_info.script.name,
        image: GM_info.script.icon,
        text: 'Your text is ready. Click to copy.',
        onclick: () => {
          GM_setClipboard(output)
          console.log("Your text is ready. Click to copy.")
        },
      })
    } else {
	      //window.scrollTo(0, document.body.scrollHeight)
        document.querySelector('ul.pager').scrollIntoView({behavior: "smooth", block: "end"})
    }
}

let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if(node.nodeType === 1 && node.nodeName === 'DIV') {
                main(node)
            } else {
                //window.scrollTo(0, document.body.scrollHeight)
                document.querySelector('ul.pager').scrollIntoView({behavior: "smooth", block: "end"})
            }
        })
    })
})
observer.observe(document.body, { subtree: true, childList: true })

main(document.body)
