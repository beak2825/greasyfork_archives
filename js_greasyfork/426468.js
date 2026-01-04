// ==UserScript==
// @name         OBTS Usable Index
// @namespace    https://support.obtsnetworks.com/
// @version      1
// @description  Better OBTS Index Updating
// @author       Andrew
// @match        https://support.obtsnetworks.com/admin/index*
// @icon         https://www.google.com/s2/favicons?domain=obtsnetworks.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426468/OBTS%20Usable%20Index.user.js
// @updateURL https://update.greasyfork.org/scripts/426468/OBTS%20Usable%20Index.meta.js
// ==/UserScript==

(function() {
  const agentStatusDiv = document.querySelector('#agentstatus')
  const openTicketsDiv = document.querySelector('#opentickets')
  const ticketStatusDiv = document.querySelector('#ticketstatus')
  const calendarDiv = document.querySelector('#calendar')
  const currentACDDiv = document.querySelector('#currentacd')

  // The Below is a hack to clear the timeout and interval timers embedded into the HTML. Could break more than intended.
  // Begin Hack
  const clearTimers = function() {
    const highestIntervalId = window.setInterval(function() {}, 0);
    const highestTimeoutId = window.setTimeout(function() {}, 0);
    for (let i = 0 ; i <= highestIntervalId || i <= highestTimeoutId ; i++) {
      window.clearInterval(i);
      window.clearTimeout(i);
    }
  }
  // End Hack

  const textWithoutMetaTag = (text) => {
    const match = /<meta.+>/
    return text.replace(match, '')
  }

  const fetchOBTSElement = (elementName) => {
    return new Promise((resolve, reject) => {
      try {
        let status = fetch(`https://support.obtsnetworks.com/admin/${elementName}.php`).then(res=>res.text())
        resolve(status)
      }
      catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }

  const setStatus = async (statusType, text='fetch') => {
    let status;
    if (text === 'fetch') status = await fetchOBTSElement(statusType)
    else status = text

    switch (statusType) {
      case 'agentstatus':
        agentStatusDiv.innerHTML = status
        break;
      case 'opentickets':
        openTicketsDiv.innerHTML = status
        break;
      case 'tstatus':
        status = textWithoutMetaTag(status)
        ticketStatusDiv.innerHTML = status
        break;
      case 'supportcalendar':
        calendarDiv.innerHTML = status
        break;
      case 'currentacd':
        currentACDDiv.innerHTML = status
        break;
      default:
        console.log(`Invalid status type parameter on setStatus(). ${statusType}`);
        break;
    }
  }

  const updateStatus = async function(statusType) {
    let status = await fetchOBTSElement(statusType)
    switch (statusType) {
      case 'agentstatus':
        if (status === agentStatusDiv.innerHTML) break;
        setStatus('agentstatus', status)
        break;
      case 'opentickets':
        if (status === openTicketsDiv.innerHTML) break;
        setStatus('opentickets', status)
        break;
      case 'tstatus':
        status = textWithoutMetaTag(status)
        if (status === ticketStatusDiv.innerHTML) break;
        setStatus('tstatus', status)
        break;
      case 'supportcalendar':
        if (status === calendarDiv.innerHTML) break;
        setStatus('supportcalendar', status)
        break;
      case 'currentacd':
        if (status === currentACDDiv.innerHTML) break;
        setStatus('currentacd', status)
        break;
      default:
        console.log(`Invalid status type parameter on updateStatus(). Status Type: ${statusType}`);
        break;
    }
  }

  const clearIndexElementContent = function () {
    if (agentStatusDiv) agentStatusDiv.innerHTML = ''
    if (ticketStatusDiv) ticketStatusDiv.innerHTML = ''
    if (openTicketsDiv) openTicketsDiv.innerHTML = ''
    if (calendarDiv) calendarDiv.innerHTML = ''
    if (currentACDDiv) currentACDDiv.innerHTML = ''
  }

  const firstLoadInit = async function () {
    if (agentStatusDiv) setStatus('agentstatus')
    if (ticketStatusDiv) setStatus('opentickets')
    if (openTicketsDiv) setStatus('tstatus')
    if (calendarDiv) setStatus('supportcalendar')
    if (currentACDDiv) setStatus('currentacd')
  }

  const setUpdateTimers = async function (interval) {
    let agentUpdateTimer, openTicketUpdateTimer, ticketStatusUpdateTimer, calendarUpdateTimer, currentACDUpdateTimer;
    if (agentStatusDiv) agentUpdateTimer = setInterval(updateStatus, Math.floor(interval/2), 'agentstatus')
    if (ticketStatusDiv) openTicketUpdateTimer = setInterval(updateStatus, interval, 'opentickets')
    if (openTicketsDiv) ticketStatusUpdateTimer = setInterval(updateStatus, interval, 'tstatus')
    if (calendarDiv) calendarUpdateTimer = setInterval(updateStatus, interval, 'supportcalendar')
    if (currentACDDiv) currentACDUpdateTimer = setInterval(updateStatus, interval, 'currentacd')
  }

  clearTimers()
  clearIndexElementContent()
  firstLoadInit()
  setUpdateTimers(10000)
})();