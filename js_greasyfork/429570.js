// ==UserScript==
// @name         NoSerg121
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Скрывает активность Serg121
// @author       S30N1K
// @match        https://dota2.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429570/NoSerg121.user.js
// @updateURL https://update.greasyfork.org/scripts/429570/NoSerg121.meta.js
// ==/UserScript==

(() => {
    let banned = JSON.parse(localStorage.getItem("banned")) || ["Serg121"]

    const removeUser = (li, find) => {
        for (const j of $(li)) {
            const $j = $(j)
            const userNick = $j.find(find).html().split("<")[0].trim()
            if (banned.includes(userNick)) {
                $j.remove()
            }
        }
    }

    const index = () => {
        removeUser(".index__left-bar > .forum.component-block.component-block__hide-after-12 > ul > li", ".component-text-grey-11")
    }

    const members = () => {
        const $userNick = $(".forum-profile__head > div > h3")
        const userNick = $userNick.html().trim()
        let isIgnored = banned.includes(userNick)

        const banBtn = $(document.createElement("div")).css({
            color: "#499062",
            display: "inline-block",
            border: "1px solid",
            borderRadius: "5px",
            padding: "3px 10px",
            fontSize: "small",
            margin: 0,
            cursor: "pointer",
        }).html(isIgnored ? "Удалить из игнора" : "Закинуть в игнор").click(() => {
            if (isIgnored){
                banned = banned.filter(e => e !== userNick)
            } else {
                banned.push(userNick)
            }
            localStorage.setItem("banned", JSON.stringify(banned))

            isIgnored = !isIgnored
            banBtn.html(isIgnored ? "Удалить из игнора" : "Закинуть в игнор")
        })

        $userNick.append(banBtn)
    }

    const notifications = () => {

    }

    const forums = () => {
        removeUser(".forum-section__list > li:not(.forum-section__item--first)", ".forum-section__name > a")
    }

    const threads = () => {
        removeUser(".forum-theme__list > li", ".forum-theme__item-left-mob > a")
    }


    const pages = {
        "^\/$": index,
        "\/forum\/members\/(.+?)\/": members,
        "\/forum\/notifications\/": notifications,
        "\/forum\/threads\/": threads,
        "\/forum\/forums\/(.+?)\/": forums,
    }

    for (const e of Object.keys(pages)) {
        if (new RegExp(e).test(window.location.pathname)) {
            pages[e]()
        }
    }
})()