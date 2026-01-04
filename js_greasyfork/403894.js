// ==UserScript==
// @name            Free Steam Packages Redeemer
// @version         1.0.1
// @author          Dillon Regimbal
// @namespace       https://dillonr.com
// @description     Automates sending requests to Steam. Get package list from https://steamdb.info/freepackages/
// @match           https://store.steampowered.com/account/licenses/
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/403894/Free%20Steam%20Packages%20Redeemer.user.js
// @updateURL https://update.greasyfork.org/scripts/403894/Free%20Steam%20Packages%20Redeemer.meta.js
// ==/UserScript==
// Since 2020-05-21
// https://greasyfork.org/en/scripts/403894-free-steam-packages-redeemer
// https://github.com/dregimbal/UserScripts/blob/master/SteamPackages.user.js

// To display the entire list (instead of just 50) at SteamDB, use the following style
// #freepackages.package { display: block }

/* eslint-disable no-extend-native */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
(function () {
    // Uncomment the following line, and replace the array with your package list
    // GM_setValue('steamPackages', [{ id: 0, name: 'Package 1' },{ id: 0, name: 'Package 2' }]])

    let steamPackages = GM_getValue('steamPackages', [{ id: 0, name: 'No Package' }])
    let completedPackages = GM_getValue('completedPackages', [{ id: 0, name: 'No Package' }])
    let errorPackages = GM_getValue('errorPackages', [{ id: 0, name: 'No Package' }])
    let currentPackage = GM_getValue('currentPackage', null)
    console.log(completedPackages)
    console.log(errorPackages)
    console.log(currentPackage)

    let failCount = 0

    let modal
    let modalTitle = ''
    let modalText = ''

    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000))
        return this
    }

    Date.prototype.addMinutes = function (m) {
        this.setTime(this.getTime() + (m * 60 * 1000))
        return this
    }

    Date.prototype.addSeconds = function (s) {
        this.setTime(this.getTime() + (s * 1000))
        return this
    }

    function showModal(title, text) {
        if (modal) {
            modal.Dismiss()
        }
        if (title === '') {
            title = modalTitle
        }
        if (text === '') {
            text = modalText
        }
        modal = unsafeWindow.ShowBlockingWaitDialog(title, '<br />' + text)
    }

    function callDelayed(hours, minutes, seconds, delayedFunction, param1) {
        let now = new Date()
        let next = new Date().addHours(hours).addMinutes(minutes).addSeconds(seconds)
        let difference = next - now

        let timeCount = ''
        if (hours > 0) {
            if ((minutes > 0) && (seconds > 0)) {
                timeCount = `${hours} hours, ${minutes} minutes, ${seconds} seconds`
            } else if ((minutes > 0)) {
                timeCount = `${hours} hours, ${minutes} minutes`
            } else if ((seconds > 0)) {
                timeCount = `${hours} hours,  ${seconds} seconds`
            } else {
                timeCount = `${hours} hours`
            }
        } else if (minutes > 0) {
            if (seconds > 0) {
                timeCount = `${minutes} minutes, ${seconds} seconds`
            } else {
                timeCount = `${minutes} minutes`
            }
        } else {
            timeCount = `${seconds} seconds`
        }

        // console.log('Current time: ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds())
        // console.log('Next run time: ' + next.getHours() + ':' + next.getMinutes() + ':' + next.getSeconds() + '.' + next.getMilliseconds())
        let options = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Toronto'
        }
        let datestring = next.toLocaleTimeString('en-CA', options)
        showModal('', `${modalText}<br />Next function will run in ${timeCount} at <b>${datestring}</b>.`)

        unsafeWindow.freeTimeout = unsafeWindow.setTimeout(function () {
            if (typeof param1 !== 'undefined') {
                delayedFunction(param1)
            } else {
                delayedFunction()
            }
        }, difference)
    }


    function getPackageStats() {
        let total = steamPackages.length + completedPackages.length + errorPackages.length
        let stats = ''
        if (currentPackage !== null) {
            stats = `Current ID: [${currentPackage.id}]<br />Package Name: [${currentPackage.name}]<br />`
        }
        stats += `Completed: ${completedPackages.length}<br />Errors: ${errorPackages.length}<br />Total: ${total}`

        return stats
    }

    const saveValueAndReload = () => {
        GM_setValue('currentPackage', currentPackage)
        GM_setValue('errorPackages', errorPackages)
        GM_setValue('completedPackages', completedPackages)
        GM_setValue('steamPackages', steamPackages)
        location.reload()
    }

    function fetch(steamPackage) {
        jQuery.post(
            'https://store.steampowered.com/checkout/addfreelicense/' + steamPackage.id,
            {
                ajax: true,
                sessionid: unsafeWindow.g_sessionID
            })
            .done((data, textStatus, jqXHR) => {
                modalTitle = 'Request Success'
                modalText = `${getPackageStats()}`
                showModal(modalTitle, modalText)

                completedPackages.push(steamPackage)
                GM_setValue('completedPackages', completedPackages)
                currentPackage = null
                GM_setValue('currentPackage', null)
                GM_setValue('steamPackages', steamPackages)

                callDelayed(0, 0, 2, requestNext)
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                failCount++
                modalText = `Received error on last request<br />Fails: ${failCount}<br />${jqXHR.status}: ${jqXHR.statusText}<br />${getPackageStats()}`
                if (failCount < 2) {
                    modalTitle = 'Waiting to retry package'
                    showModal(modalTitle, modalText)
                    callDelayed(0, 0, 15, fetch, steamPackage)
                } else {
                    modalTitle = 'Waiting to refresh'
                    showModal(modalTitle, modalText)

                    errorPackages.push(steamPackage)
                    GM_setValue('errorPackages', errorPackages)
                    currentPackage = null
                    GM_setValue('currentPackage', null)
                    GM_setValue('steamPackages', steamPackages)

                    callDelayed(0, 17, 0, saveValueAndReload)
                }
            })
    }

    function requestNext() {
        if (modal) {
            modal.Dismiss()
        }
        if (typeof currentPackage === 'undefined' || currentPackage === null) {
            currentPackage = steamPackages.shift()
            GM_setValue('currentPackage', currentPackage)
        }

        modalTitle = 'Executing request'
        modalText = `${getPackageStats()}`
        showModal(modalTitle, modalText)
        fetch(currentPackage)
    }

    modalTitle = 'Waiting to send requests'
    modalText = `g_sessionID: ${unsafeWindow.g_sessionID}<br />${getPackageStats()}`
    showModal(modalTitle, modalText)

    callDelayed(0, 0, 10, requestNext)
}())
