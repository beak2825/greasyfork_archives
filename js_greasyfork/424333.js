// ==UserScript==
// @name         我們的浮游城 多開
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  浮游城多開
// @author       ItisCaleb
// @match        https://ourfloatingcastle.com/profile
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424333/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E5%A4%9A%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/424333/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E5%A4%9A%E9%96%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var storage
var select
var addAccount
var mainPage
var main
var profiles = {}
var lock = false

function setDOM() {
    setPage()
    for (let id in profiles) {
        let newdiv = document.createElement("div")
        mainPage.append(newdiv)
        newdiv.innerHTML = newPage(profiles[id])
        setAction(newdiv, profiles[id].token)
        if (profiles[id].actionStatus !== '閒置') lockBtn(newdiv, true)
        else lockBtn(newdiv, false)
        if (profiles[id].actionUntil) {
            newdiv.getElementsByClassName('time')[0]
                .textContent = new Date(profiles[id].actionUntil).toLocaleString('zh-tw')
            calComplete(id, Math.max(profiles[id].actionUntil - Date.now(), 0))
        } else {
            newdiv.getElementsByClassName('time')[0]
                .textContent = ""
        }
    }
    changeAccount()

}

function setAction(ele, token) {
    let btn = ele.getElementsByClassName('chakra-button')
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', () => {
            action(token, btn[i].dataset.action, btn[i].dataset.dur, btn[i].dataset.tar)
        })
    }
    ele.getElementsByClassName('complete')[0].addEventListener('click', () => {
        action(token, 'complete')
    })
}

function lockBtn(ele, mode) {
    let btn = ele.getElementsByClassName('chakra-button')
    for (let i = 0; i < btn.length; i++) {
        btn[i].disabled = mode
    }
}

function changeAccount() {
    document.getElementById(main).hidden = true
    for (let key in profiles) {
        document.getElementById(key).hidden = true
    }
    document.getElementById(select.value).hidden = false
}

function getAccount(token) {
    return fetch("https://api.ourfloatingcastle.com/api/profile", {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "token": token,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
        },
        "referrer": "https://ourfloatingcastle.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error();
        }
    }).then(res => Object.assign(res, {token: token}))
}

function action(token, action, duration, target) {
    let body
    let headers = {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "token": token
        },
        "referrer": "https://ourfloatingcastle.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "",
        "method": "POST",
        "mode": "cors"
    }
    switch (action) {
        case 'mining':
            body = {targetId: target, durationId: duration}
            body = JSON.stringify(body)
            headers.body = body
            break
        case 'adventure':
        case 'rest':
            body = {durationId: duration}
            body = JSON.stringify(body)
            headers.body = body
            break
        case 'complete':
            body = ""
            delete headers.headers["content-type"]
    }

    fetch(`https://api.ourfloatingcastle.com/api/actions/${action}`, headers)
        .then(res => res.json())
        .then(async res => {
            if (action !== 'complete') {
                profiles[res.nickname] = Object.assign(res, {token: token})
                document.getElementById(res.nickname).outerHTML = newPage(profiles[res.nickname])
                lockBtn(document.getElementById(res.nickname), true)
                document.getElementById(res.nickname)
                    .getElementsByClassName('time')[0]
                    .textContent = new Date(res.actionUntil).toLocaleString('zh-tw')
            } else {
                let profile = await getAccount(token)
                profiles[profile.nickname] = profile
                document.getElementById(profile.nickname).outerHTML = newPage(profile)
                let com = document.getElementById(profile.nickname).getElementsByClassName('complete')
                if (com) com[0].hidden = true
                lockBtn(document.getElementById(profile.nickname), false)
                document.getElementById(profile.nickname)
                    .getElementsByClassName('time')[0]
                    .textContent = ""
            }
        })

}

function delay(num) {
    return new Promise(resolve => setTimeout(resolve(), num))
}

function newPage(profile) {
    switch (location.pathname) {
        case '/profile':
            return `<div class="chakra-container css-gr7vu6" id="${profile.nickname}">
    <div class="css-1ig3841">
        <div class="chakra-stack css-1bx3rpa">
            <h2 class="css-14g9y4z">角色資訊</h2>
            <div class="css-70qvj9">
                <div class="css-o6917l">暱稱</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.nickname}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">職業</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.role}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">副職</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.role2 || "無"}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">金錢</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.money}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">體力</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.hp} / ${profile.fullHp}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">狀態</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">
                    <div class="chakra-wrap css-0">
                        <ul class="chakra-wrap__list css-1s64hm1">${profile.actionStatus}<span class="css-0 time"></span></ul>
                    </div>
                </div>
            </div>
             <button type="button" data-action="complete" hidden style="background: green;color white" class="complete">完成行動</button>        
        </div>
        <div class="chakra-stack css-126jxkz"><h2 class="chakra-heading css-14g9y4z">技能熟練度</h2>
            <div class="css-70qvj9">
                <div class="css-o6917l">戰鬥</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.fightExp}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">鍛造</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.forgeExp}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">挖礦</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.mineExp}</div>
            </div>
            <hr role="separator" aria-orientation="horizontal" class="chakra-divider css-1sgqsby">
            <div class="css-70qvj9">
                <div class="css-o6917l">擊殺</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.kill}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">死亡</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.death}</div>
            </div>
            <div class="css-70qvj9">
                <div class="css-o6917l">被殺</div>
                <div class="css-ttfprq">
                    <hr role="separator" aria-orientation="vertical" class="chakra-divider css-dzdrzt">
                </div>
                <div class="css-0">${profile.killed}</div>
            </div>
        </div>
    </div>
    <div class="chakra-tabs__tab-panels css-8atqhb">
            <div class="chakra-stack css-12oio12">
                <div class="css-acwcvw"><h2 class="chakra-heading css-4pqeap">冒險</h2>
                    <div class="css-0">
                        <button type="button" data-action="adventure" data-dur="0" data-tar="0" class="chakra-button css-16yte7e">10 分鐘</button>
                        <button type="button" data-action="adventure" data-dur="1" data-tar="0" class="chakra-button css-16yte7e">50 分鐘</button>
                        <button type="button" data-action="adventure" data-dur="2" data-tar="0" class="chakra-button css-16yte7e">2 小時</button>
                        <button type="button" data-action="adventure" data-dur="3" data-tar="0" class="chakra-button css-16yte7e">5 小時</button>
                    </div>
                </div>
                <div class="css-acwcvw"><h2 class="chakra-heading css-4pqeap">鐵礦山外部</h2>
                    <div class="css-0">
                        <button type="button" data-action="mining" data-dur="0" data-tar="1" class="chakra-button css-16yte7e">20 分鐘</button>
                        <button type="button" data-action="mining" data-dur="1" data-tar="1" class="chakra-button css-16yte7e">50 分鐘</button>
                        <button type="button" data-action="mining" data-dur="2" data-tar="1" class="chakra-button css-16yte7e">2 小時</button>
                        <button type="button" data-action="mining" data-dur="3" data-tar="1" class="chakra-button css-16yte7e">4 小時</button>
                    </div>
                </div>
                <div class="css-acwcvw"><h2 class="chakra-heading css-4pqeap">鐵礦山深處</h2>
                    <div class="css-0">
                        <button type="button" data-action="mining" data-dur="0" data-tar="2" class="chakra-button css-16yte7e">1 小時</button>
                        <button type="button" data-action="mining" data-dur="1" data-tar="2" class="chakra-button css-16yte7e">2 小時</button>
                        <button type="button" data-action="mining" data-dur="2" data-tar="2" class="chakra-button css-16yte7e">5 小時</button>
                        <button type="button" data-action="mining" data-dur="3" data-tar="2" class="chakra-button css-16yte7e">7 小時</button>
                    </div>
                </div>
                <div class="css-acwcvw"><h2 class="chakra-heading css-4pqeap">雪山地區</h2>
                    <div class="css-0">
                        <button type="button" data-action="mining" data-dur="0" data-tar="3" class="chakra-button css-16yte7e">3 小時</button>
                        <button type="button" data-action="mining" data-dur="1" data-tar="3" class="chakra-button css-16yte7e">5 小時</button>
                        <button type="button" data-action="mining" data-dur="2" data-tar="3" class="chakra-button css-16yte7e">7 小時</button>
                        <button type="button" data-action="mining" data-dur="3" data-tar="3" class="chakra-button css-16yte7e">8 小時</button>
                    </div>
                </div>
                <div class="css-acwcvw"><h2 class="chakra-heading css-4pqeap">阿嬤的寶石山</h2>
                    <div" class="css-0">
                        <button type="button" data-action="mining" data-dur="0" data-tar="4" class="chakra-button css-16yte7e">4 小時</button>
                        <button type="button" data-action="mining" data-dur="1" data-tar="4" class="chakra-button css-16yte7e">5 小時</button>
                        <button type="button" data-action="mining" data-dur="2" data-tar="4" class="chakra-button css-16yte7e">6 小時</button>
                        <button type="button" data-action="mining" data-dur="3" data-tar="4" class="chakra-button css-16yte7e">7 小時</button>
                    </div>
                </div>
                <div class="css-acwcvw"><h2 class="chakra-heading css-4pqeap">魔山</h2>
                    <div class="css-0">
                        <button type="button" data-action="mining" data-dur="0" data-tar="5" class="chakra-button css-16yte7e">5 小時</button>
                        <button type="button" data-action="mining" data-dur="1" data-tar="5" class="chakra-button css-16yte7e">6 小時</button>
                        <button type="button" data-action="mining" data-dur="2" data-tar="5" class="chakra-button css-16yte7e">8 小時</button>
                        <button type="button" data-action="mining" data-dur="3" data-tar="5" class="chakra-button css-16yte7e">9 小時</button>
                    </div>
                </div>
                <div class="css-acwcvw"><h2 class="chakra-heading css-1hm1kf2">休息</h2>
                    <div class="css-0">
                        <button type="button" data-action="rest" data-dur="0" class="chakra-button css-4g7wkz">10 分鐘</button>
                        <button type="button" data-action="rest" data-dur="1" class="chakra-button css-4g7wkz">30 分鐘</button>
                        <button type="button" data-action="rest" data-dur="2" class="chakra-button css-4g7wkz">1 小時</button>
                        <button type="button" data-action="rest" data-dur="3" class="chakra-button css-4g7wkz">3 小時</button>
                    </div>
                </div>
            </div>
        </div>
</div></div>`
        case '/item':
    }

}

function setSelect(profile) {
    let option = document.createElement("option")
    let text = document.createTextNode(profile.nickname)
    option.appendChild(text)
    select.appendChild(option)
}

function setPage() {
    document.getElementsByClassName("css-ipwc1n")[0].appendChild(select)
    document.getElementsByClassName("chakra-wrap__list")[0].appendChild(addAccount)
    mainPage = document.getElementsByClassName('css-dvxtzn')[0]
    document.getElementsByClassName("chakra-container")[0].setAttribute('id', main)
}

function calComplete(id, time) {
    setTimeout(() => {
        let com = document.getElementById(id).getElementsByClassName('complete')
        if (com) com[0].hidden = false
    }, time)
}

async function init() {
    storage = localStorage.getItem("accounts")
    select = document.createElement('select')
    select.addEventListener('change', changeAccount)
    select.style.color = "blue"
    addAccount = document.createElement('div')
    addAccount.addEventListener('click', () => {
        let account = prompt("請輸入token")
        if(!account) return
        if (!localStorage.getItem("accounts")) {
            localStorage.setItem('accounts', JSON.stringify([account]))
            location.reload()
        } else {
            let array = JSON.parse(localStorage.getItem("accounts"))
            array.push(account)
            localStorage.setItem('accounts', JSON.stringify(array))
            location.reload()
        }
    })
    addAccount.innerHTML = '增加帳號'
    addAccount.classList.add('css-18aizri')
    const mainProfile = await getAccount(localStorage.getItem("token2"))
    setSelect(mainProfile)
    main = mainProfile.nickname
    await delay(100)
    if (!storage) return
    try {
        const accounts = JSON.parse(storage);
        for (let i in accounts) {
            await getAccount(accounts[i])
                .then(async profile => {
                    await delay(150)
                    setSelect(profile)
                    profiles = Object.assign(profiles, {[profile.nickname]: profile})
                })
                .catch(() => {
                    accounts.pop()
                    localStorage.setItem('accounts', JSON.stringify(accounts))
                })
        }
    } catch (err) {

    }
}

setTimeout(() => {
    init().then(() => {
        setInterval(() => {
            if (location.pathname === '/profile' && !lock) {
                lock = true
                setDOM()
            } else if (location.pathname !== '/profile') {
                lock = false
            }
        }, 20)
    })
}, 1500)


})();