// ==UserScript==
// @name         ao-to-mail
// @description  arthur online to email interface
// @version      1.0.5
// @author       yuze
// @namespace    yuze
// @include      https://system.arthuronline.co.uk/*
// @include      https://mail.google.com/*
// @include      https://mail.one.com/*
// @connect      arthuronline.co.uk
// @connect      ea-api.yuze.now.sh
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396322/ao-to-mail.user.js
// @updateURL https://update.greasyfork.org/scripts/396322/ao-to-mail.meta.js
// ==/UserScript==

/* eslint-env jquery, greasemonkey */

let target = {}

window.addEventListener('load', function () {
    if (window.location.href.includes('system.arthuronline.co.uk')) {
        arthur()
    }
    if (window.location.href.includes('mail.google.com')) {
        init_gmail()
    }
    if (window.location.href.includes('mail.one.com')) {
        init_webmail()
    }
}
)

function init_gmail() {
    console.log('init_gmail')

    target.email = () => $('.wO.nr textarea')
    target.subject = () => $('input[name="subjectbox"]')
    target.body = () => $('div[aria-label="Message Body"]')

    mail()
}

function init_webmail() {
    console.log('init_webmail')

    target.email = () => $('#to')
    target.subject = () => $('in-place-editor #subject')
    target.body = () => $('.rte-frame iframe').contents().find('body')

    mail()
}

async function arthur() {

    let id = $('.text-logo span').text().toLowerCase()
    if (!id) return;

    init()
    function init() {

        appendCSS()
        function appendCSS() {

            const magicButton = `.magicBtn {
                                    margin-top: 8px;
                                    padding: 5px;
                                    transition: 250ms;
                                    position: absolute;
                                    box-sizing: border-box;
                                    background: #e91e63;
                                    height: 48px;
                                    width: 48px;
                                    border-radius: 6px;
                                    color: white;
                                    user-select: none;
                                }
                                .magicBtn:hover {
                                    filter: brightness(125%);
                                }
                                .magicBtn:active {
                                    filter: brightness(75%);
                                }
                                .magicAnim {
                                    transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
                                    padding: 5px 5px 0 5px;
                                }
                                .magicFlip {
                                    transform: rotateY(180deg);
                                }
                                .magicToast {
                                    padding: 4px;
                                    font-size: 14px;
                                    position: absolute;
                                    color: #e91e63;
                                    font-weight: bold;
                                    top: 50px;
                                    left: 0;
                                }
                                .magicSnail{
                                    font-size: 1em;
                                    display: inline-block;
                                    animation: snail 4.75s  infinite;
                                    animation-timing-function: linear;
                                }
                                @-webkit-keyframes snail {
                                    0% {
                                        -webkit-transform: translateX(0) rotateY(90deg)
                                    }
                                    5% {
                                        -webkit-transform: translateX(0) rotateY(0deg)
                                    }
                                    45% {
                                        -webkit-transform: translateX(100px) rotateY(0deg)
                                    }
                                    55% {
                                        -webkit-transform: translateX(100px) rotateY(180deg)
                                    }
                                    95% {
                                        -webkit-transform: translateX(0) rotateY(180deg)
                                    }
                                    100% {
                                    -webkit-transform: translateX(0) rotateY(90deg)
                                    }
                                }`

            const style = ` <style>
                                ${magicButton}
                            </style>`

            $('head').append(style)
        }

        tokenCheck()
        async function tokenCheck() {
            let token = await GM.getValue(`${id}-ao-token`)
            if (!token) {
                console.log('No token exists, getting token from DB')
                tokenProvider()
            }
        }

        checkLocation()

    }

    let data = {}
    let response;
    let savedLoc;

    $('body').on('click', checkLocation)
    $(window).on('focus', checkLocation)

    async function checkLocation() {
        await wait(100)
        if (/tenancies\/view\/\d{6}/.test(window.location.href)) {
            if (!($('.magicBtn').length)) {
                new Promise(function (resolve) {
                    waitForExistance('.identifier-icon', resolve)
                }).then(() => {
                    magicBtn()
                })
            }
        } else {
            $('.magicBtn').remove()
        }
    }

    function magicBtn() {
        append()
        function append() {
            const html = `<div class="magicBtn"><div class="magicAnim"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"></path>
                                </svg></div></div>`

            $('.identifier-icon').append(html)
            $('.magicAnim').on('click', anim)
            $('.magicBtn').on('click', getData)
        }

        function anim() {
            $(this).toggleClass('magicFlip')
            setTimeout(() => $(this).toggleClass('magicFlip'), 512)
        }
    }

    async function getData() {
        disableAccess('<b style="font-size: 1.5em;">Please wait <div class="magicSnail">🐌</div>&emsp;🥬</b><br>Gathering leafy greens...')

        // wipe data on entry
        GM.setValue('ao-data', '')

        savedLoc = window.location.href;

        let extractId = savedLoc.match(/(?!tenancies\/view\/)\d{6}/)[0]
        let url = `https://api.arthuronline.co.uk/v2/tenancies/${extractId}`

        let token = await GM.getValue(`${id}-ao-token`)
        let xEntityId = await GM.getValue(`${id}-ao-xEntityId`)

        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-EntityID': `${xEntityId}`,
            },
            onload: function (xhr) {
                response = JSON.parse(xhr.responseText);
                if (response.error) {
                    console.log('error')
                    tokenProvider(true)
                } else {
                    console.log('success')
                    assignData(response.data)
                }
            }
        })
    }

    async function assignData(response) {

        data['id'] = id
        data['ref'] = response.ref
        data['startDate'] = response.start_date
        data['property'] = $('.identifier-detail .sub-title a')[0].innerHTML.replace(' - ', ' ').split(',')[0].replace(' Room', ', Room')
        data['names'] = []
        data['emails'] = []
        data['total'] = $('.overdue .number').text()

        for (let i = 0; i < response.tenants.length; i++) {
            data['names'].push((response.tenants[i].first_name + ' ' + response.tenants[i].last_name).replace(/ {2}/g, ' '))
            data['emails'].push(response.tenants[i].email)
        }
        let mode = GM.getValue('mode')

        if (await mode == 'overdue') {
            getArrears()
        } else {
            saveToLocalStorage()
        }
    }

    function getArrears() {
        $('.nav.nav-tabs [href^="#tab-transactions"]')[0].click()

        new Promise(function (resolve) {
            waitForExistance('.transactions tbody', resolve)
        }).then(() => {
            $('#genOverdueBtn')[0].click()
            data['arrears'] = $('#genOverdueText')[0].value.split('\n').join('<br>')
            $('#genOverdueText').css('display', 'none')
            saveToLocalStorage()
            returnToSavedLocation()
        })
    }

    function returnToSavedLocation() {
        if (/tenancies\/view\/\d{6}\/ident:Datatable.{5}$/.test(savedLoc)) {
            setTimeout(async () => {
                $(`.nav.nav-tabs [href^="#tab-summary"]`)[0].click()
                await wait(512)
                checkLocation()
            }, 1)
        } else if (/tenancies\/view\/\d{6}\/ident:Datatable.{5}#tab-.+-/.test(savedLoc)) {
            let match = savedLoc.match(/tab-.+(?=-)/)[0]
            setTimeout(async () => {
                $(`.nav.nav-tabs [href^="#${match}"]`)[0].click()
                await wait(512)
                checkLocation()
            }, 1)
        }
    }

    function saveToLocalStorage() {
        GM.setValue('ao-data', JSON.stringify(data))

        data = {}
        disableAccess('', true)
    }

    function disableAccess(desc, remove) {

        if (remove) {
            removeDisableAccess()
            return;
        }
        if ($('#disableAccess').length) return;

        $('body').append(`  <div id="disableAccess">
                                <div id="disableDesc">${desc}</div>
                            </div>`)

        $('#disableAccess').hide().fadeIn(618)

        setTimeout(() => {
            if ($('#disableAccess').length) {
                $('#disableDesc').append('<br><div class="btn" style="transform: scale(1.75,1.75); margin-top: 48px" id="disableExit">This is taking too long! Get me out of here. 😠</div>')
                $('#disableExit').hide().fadeIn(1024)
                $('#disableExit').on('click', function () {
                    removeDisableAccess()
                })
            }
        }, 5500)

        $('#disableClickCover').on('mousedown keydown', disableAccess)
        function disableAccess(e) {
            e.preventDefault()
            return;
        }

        function removeDisableAccess() {
            $('#disableAccess').off('mousedown keydown scroll', disableAccess)
            $('#disableAccess').fadeOut(314, function () {
                $('#disableAccess').remove()
            })
        }

    }

    function tokenProvider(retry) {

        GM.xmlHttpRequest({
            method: "POST",
            url: 'https://ea-api.yuze.now.sh/api/refresh-token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `for=${id}_ao`,
            onload: function (res) {
                let json = (JSON.parse(res.response))
                GM.setValue(`${id}-ao-token`, json.token)
                GM.setValue(`${id}-ao-xEntityId`, json.xEntityId)
                console.log(json.note)

                if (retry) {
                    console.log('retrying')
                    getData()
                }
            }
        })

    }
}

async function mail() {

    $(window).on('focus', processData)

    async function processData() {

        let data = await GM.getValue('ao-data')
        let mode = await GM.getValue('mode')

        let email = target.email()
        let subject = target.subject()
        let body = target.body()

        if (!data) return;

        data = JSON.parse(data)

        // EMAIL

        // does email field contain content already?
        let replyExisting = $('.oL.aDm span').text()
        if (replyExisting.includes('barrons') || replyExisting.includes('mayfields') || replyExisting === '') {

            email.val(data['emails'].join(', '))
            email.trigger('change')

        }

        // SUBJECT
        subject.val(subject.val() + ` (${data['property']})`)
        subject.trigger('change')

        // BODY --> name
        let firstNames = []
        for (let i = 0; i < data['names'].length; i++) {
            firstNames.push(data['names'][i].split(' ')[0])
        }
        if (data['names'].length > 2) {
            firstNames = firstNames.join(', ').replace(/(,)(?!.+\1)/, ' and')
        } else {
            firstNames = firstNames.join(' and ')
        }

        // BODY --> due-date
        let dueDate = ''
        if (await mode == 'overdue') {
            dueDate = data['arrears'].split('<br>')

            for (let i = 0; i <= dueDate.length; i++) {

                if (!dueDate[i] && i === 0) {
                    break;
                } else if (i == dueDate.length - 1) {
                    try {
                        dueDate = dueDate[0].match(/\((\d.+)-/)[1].trim()
                        break;
                    } catch (err) {
                        dueDate = dueDate[0].match(/\((\d.+)\)/)[1].trim()
                        break;
                    }

                } else if (dueDate[i].includes('Outstanding')) {
                    dueDate = dueDate[i].match(/\((.+)-/)[1].trim()
                    break;
                }
            }
            GM.setValue('mode', '')
        }

        body.html(
            body.html()
                .replace('{name}', firstNames)
                .replace('{ref}', data['ref'])
                .replace('{property}', data['property'])
                .replace('{arrears}', data['arrears'])
                .replace('{due-date}', dueDate)
                .replace('{total}', data['total'])
        )

        if (data['arrears']) {
            body.html(body.html().replace(/(Total to be paid: £\d.?\d+\.\d{1,2})/, '<b><u>$1</u></b>'))
        }

        // CONCLUDE
        GM.setValue('ao-data', '')
    }

    btnListeners()
    async function btnListeners() {

        await wait(1024)

        $('#template-overdue').on('click', function () {
            GM.setValue('mode', 'overdue')
        })

    }

}

async function waitForExistance(elem, resolve) {

    if ($(elem).length) {
        resolve()
    }

    let interval;
    if (!$(elem).length) {
        interval = setInterval(() => checkExistance(), 150)
    }
    function checkExistance() {
        if ($(elem).length) {
            clearInterval(interval)
            resolve()
        }
    }
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => { resolve() }, ms);
    });
}