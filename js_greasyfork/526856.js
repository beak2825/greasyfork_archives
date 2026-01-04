// ==UserScript==
// @name         GGn Custom Request Vote
// @namespace    none
// @version      1
// @description  Vote on requests with custom amount from the list page
// @author       ingts
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://gazellegames.net/requests.php*
// @exclude      https://gazellegames.net/requests.php?action=view&id=*
// @exclude      https://gazellegames.net/requests.php?action=new*
// @downloadURL https://update.greasyfork.org/scripts/526856/GGn%20Custom%20Request%20Vote.user.js
// @updateURL https://update.greasyfork.org/scripts/526856/GGn%20Custom%20Request%20Vote.meta.js
// ==/UserScript==
const submit = document.querySelector('input[type=submit]')
const rows = document.querySelectorAll("#requests_list > tbody > tr:not(.colhead_dark)")

submit.insertAdjacentHTML('afterend', `
<div>Custom vote amount:
<input type="number" id="goldVote" placeholder="Gold" style="width: 90px;">
<input type="number" id="uploadVote" placeholder="Upload (GB)" style="width: 90px;">
`
    )

const goldVote = document.getElementById('goldVote')
const uploadVote = document.getElementById('uploadVote')

goldVote.onblur = setAmount
uploadVote.onblur = setAmount
let goldPrev, uploadPrev

if (GM_getValue('gold_vote')) {
    goldVote.value = GM_getValue('gold_vote')
    goldVote.dispatchEvent(new Event('blur'))
}
if (GM_getValue('upload_vote')) {
    uploadVote.value = GM_getValue('upload_vote')
    uploadVote.dispatchEvent(new Event('blur'))
}

function setAmount() {
    const goldVal = goldVote.value
    const uploadVal = uploadVote.value
    GM_setValue('gold_vote', goldVal)
    GM_setValue('upload_vote', uploadVal)
    const s = IndexVote.toString()
    unsafeWindow.IndexVote = Function ('requestid', 'type', s
        .replace(/^function[^{]+\{|}$/g, '') // if not it'll be a function inside another
        .replace(uploadPrev ? uploadPrev : '20 * 1024 * 1024', `${uploadVal * 1073741824 || 20 * 1024 * 1024}`) // convert to bytes
        .replace(goldPrev ? `amount = ${goldPrev}` : 'amount = 20;', `amount = ${goldVal || 20};`)
    )
    goldPrev = goldVal
    uploadPrev = uploadVal
}
