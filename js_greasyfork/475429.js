// ==UserScript==
// @name         GGn Trump and Dupe Helper
// @namespace    none
// @description  Adds TP button on torrents for quick reporting
// @version      6
// @grant        GM_getValue
// @grant        GM_setValue
// @author       ZeDoCaixao, ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @downloadURL https://update.greasyfork.org/scripts/475429/GGn%20Trump%20and%20Dupe%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475429/GGn%20Trump%20and%20Dupe%20Helper.meta.js
// ==/UserScript==

if (typeof GM_getValue('refresh_after_submit') === 'undefined')
    GM_setValue('refresh_after_submit', false)
if (typeof GM_getValue('default_comment') === 'undefined')
    GM_setValue('default_comment', 'New version')
if (typeof GM_getValue('comment_presets') === 'undefined')
    GM_setValue('comment_presets', [
        ["Goodies", "Updated goodies"],
        ["3 latest", "New version (3 latest builds)"],
        ["OST caps", "Properly capitalised tracks"],
    ])

const commentPresets = GM_getValue('comment_presets')

function handlePlClick(e) {
    e.preventDefault()
    e.currentTarget.classList.toggle("tp_good")
    e.currentTarget.style.removeProperty('color')
    document.querySelectorAll('.tp_good').forEach(link => {
        link.style.color = "red"
    })
    let urls = ""
    document.querySelectorAll('.tp_good').forEach(link => {
        urls += " https://gazellegames.net/" + link.getAttribute("href")
    })
    document.querySelector("#tp_helper [name=sitelink]").value = urls
}

const allPermalinks = document.querySelectorAll('a[title="Permalink"]')

document.querySelectorAll('a[title="Report"]').forEach(rp => {
    const torrent_id = /&id=([0-9]+)/.exec(rp.href)[1]
    rp.insertAdjacentHTML('afterend', ` | <a href="javascript:;" title="Trump" id="tp_${torrent_id}">TP`)

    document.querySelector(`#tp_${torrent_id}`).addEventListener('click', e => {
        const tp_helper = document.getElementById('tp_helper')
        if (tp_helper) {
            tp_helper.remove()
            allPermalinks.forEach(pl => {
                pl.removeEventListener('click', handlePlClick)
                pl.classList.remove('tp_good')
                pl.style.removeProperty('color')
            })
        }

        const closestTr = e.currentTarget.closest("tr")
        closestTr.insertAdjacentHTML('afterend', //language=html
            `
                <tr id="tp_helper">
                    <td>
                        ${commentPresets.length > 0 ? '<div style="margin: 0 auto 5px auto; width: 97%;display:flex;gap: 2px;" id="tp_helper_presets"></div>' : ''}
                        <form action="reportsv2.php?action=takereport" enctype="multipart/form-data" method="post">
                            <div style="margin: 0 auto 2px 9px">
                                <label style="text-align:center;">
                                    <input type="radio" name="type" value="trump" style="margin-top: 0;" checked>
                                    Trump
                                </label>
                                <label>
                                    <input type="radio" name="type" value="dupe" style="margin-top: 0;">
                                    Dupe
                                </label>
                            </div>
                            <input type="hidden" name="submit" value="true">
                            <input type="hidden" name="torrentid" value="${torrent_id}">
                            <input type="hidden" name="categoryid" value="1">
                            <input type="hidden" name="sitelink" size="70" value="">
                            <input type="hidden" name="id_token" value="${new Date().getTime()}">
                            <textarea rows="3" cols="60" name="extra"></textarea>
                            <input type="submit" value="Submit report">
                        </form>
                    <td>
                </tr>`)

        const textarea = document.querySelector('textarea[name=extra]')
        textarea.value = GM_getValue('default_comment')
        const presetsContainer = document.getElementById('tp_helper_presets')
        commentPresets.forEach(preset => {
            const button = document.createElement('button')
            button.type = 'button'
            button.textContent = preset[0]
            button.onclick = () => textarea.value = preset[1]
            presetsContainer.append(button)
        })

        const form = document.querySelector('#tp_helper form')

        if (!GM_getValue('refresh_after_submit')) {
            form.addEventListener('submit', e => {
                e.preventDefault()
                const button = form.querySelector('input[type=submit]')
                button.disabled = true
                button.value = 'Submitting'

                const title = closestTr.firstElementChild.lastElementChild
                fetch(form.action, {method: 'post', body: new FormData(form)})
                    .then(r => {
                        if (!(r.ok && r.redirected))
                            throw Error()
                        title.insertAdjacentHTML('afterend', `<span style="color: lightgreen;"> TPed</span>`)
                        button.value = 'Submitted'
                    })
                    .catch(() => {
                        title.insertAdjacentHTML('afterend', `<span style="color: red;"> TP failed</span>`)
                        button.disabled = false
                        button.value = 'Submit'
                    })
            })
        }

        allPermalinks.forEach(pl => {
            pl.addEventListener('click', handlePlClick)
        })
    })
})
