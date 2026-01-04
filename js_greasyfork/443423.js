// ==UserScript==
// @name         FMARandomPlayer
// @license      Apache-2.0 License
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  freemusicarchive random player genre list. Please press the "Random Play" button, url e.g. https://freemusicarchive.org/genre/Blues
// @author       bestcondition
// @match        https://freemusicarchive.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freemusicarchive.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443423/FMARandomPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/443423/FMARandomPlayer.meta.js
// ==/UserScript==


function sum(arr) {
    return arr.reduce((a, b) => a + b, 0)
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


function rand_int(begin, end) {
    return Math.round(Math.random() * (end - begin) + begin)
}

function get_music_time(time_str) {
    time_str = time_str.replaceAll(" ", "")
    let split_array = time_str.split(":")
    let minute_str = split_array[0]
    let minute = parseInt(minute_str)
    let second_str = split_array[1]
    let second = parseInt(second_str)
    return minute * 60 + second
}


const elem_factory = {
    elem_num: 0,
    width: 150,
    height: 50,

    get_step: () => Math.ceil(elem_factory.height * 1.1),

    get_px: (px_num) => px_num + "px",
    get_width: () => elem_factory.get_px(elem_factory.width),
    get_height: () => elem_factory.get_px(elem_factory.height),
    get_top: () => elem_factory.get_px((elem_factory.elem_num + 1) * elem_factory.get_step()),
    create_elem: (tag_name = "button", click_func = null, text = null, type = null) => {
        let elem = document.createElement(tag_name)
        if (text) {
            elem.innerText = text
        }
        if (click_func) {
            elem.onclick = click_func
        }
        if (type) {
            elem.type = type
        }
        elem.style.cssText = "position: fixed; top: 100px; right: 100px; width: 100px; height: 100px; z-index: 9999999999;"
        elem.style.height = elem_factory.get_height()
        elem.style.width = elem_factory.get_width()
        elem.style.top = elem_factory.get_top()
        elem_factory.elem_num += 1
        document.body.appendChild(elem)
        return elem
    },
}

function FMARandomPlayer() {
    this.PAGE_SIZE_NAME = "pageSize"
    this.DEFAULT_PAGE_SIZE = 20
    this.INDEX_NAME = "frp_index"
    this.PAGE_NAME = "page"
    this.POLLING_TIME = 100

    this.get_next_music = () => {
        const music_index = rand_int(0, this.count)
        const page = 1 + Math.floor(music_index / this.page_size)
        const index = music_index % this.page_size
        return {page: page, index: index}
    }

    this.to_music = (music) => {
        this.url.searchParams.set(this.PAGE_NAME, music.page)
        this.url.searchParams.set(this.INDEX_NAME, music.index)
        window.location.href = this.url.toString()
    }

    this.next = () => {
        const music = this.get_next_music()
        this.to_music(music)
    }

    this.listen = async () => {
        let verify_array = new Array(4).fill(0)

        while (true) {
            let progress_text = document.querySelector("body > div.c-player-container > div > div > div.c-player__time")
            if (progress_text) {
                progress_text = progress_text.innerText
                progress_text = progress_text.replaceAll(" ", "")
                let split_array = progress_text.split('/')
                let begin = split_array[0]
                begin = get_music_time(begin)
                let end = split_array[1]
                end = get_music_time(end)
                if (end > 0) {
                    for (let i = 0; i < verify_array.length; i++) {
                        if (begin + i === end) {
                            verify_array[i] = 1
                        }
                    }
                }
                if (begin === 0 && sum(verify_array) > 0) {
                    this.next()
                    break
                }
            }
            await sleep(this.POLLING_TIME)
        }
    }


    this.url = new URL(window.location.href)

    const count_el = document.querySelector("span.lf>b:nth-child(3)")
    this.count = parseInt(count_el.innerText)

    this.page_size = 0
    const maybe_page_size = this.url.searchParams.get(this.PAGE_SIZE_NAME)
    if (maybe_page_size) {
        this.page_size = maybe_page_size
    } else {
        this.page_size = this.DEFAULT_PAGE_SIZE
        this.url.searchParams.set(this.PAGE_SIZE_NAME, this.page_size)
    }

    this.play_bt = elem_factory.create_elem("button", this.next, "Random Play", null)

    let maybe_index = this.url.searchParams.get(this.INDEX_NAME)
    if (maybe_index) {
        maybe_index = parseInt(maybe_index)
        const all_bt = document.querySelectorAll("a.playbtn")
        all_bt[maybe_index].click()
    }

}

const frp = new FMARandomPlayer()
frp.listen()