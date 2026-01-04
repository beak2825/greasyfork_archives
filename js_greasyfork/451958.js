// ==UserScript==
// @name Downloadable Flash Games | NewGrounds.com | ArmorGames.com | Kongregate.com and more!
// @namespace -
// @version 1.3.0
// @description creates download button for flash games websites. (If game isn't flash game or game file doesn't found, then downloading will not work)
// @author NotYou
// @match *://www.newgrounds.com/portal/view/*
// @match *://armorgames.com/play/*
// @match *://*.y8.com/games/*
// @match *://www.kongregate.com/games/*/*
// @match *://www.silvergames.com/*/*
// @match *://www.nitrome.com/games/*
// @match *://www.miniplay.com/game/*
// @match *://frivez.com/*
// @match *://www.twoplayergames.org/game/*
// @run-at document-end
// @license GPL-3.0-or-later
// @icon data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QBCRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAkAAAAMAAAABAAAAAEABAAEAAAABAAAAAAAAAAAAAP/bAEMACwkJBwkJBwkJCQkLCQkJCQkJCwkLCwwLCwsMDRAMEQ4NDgwSGRIlGh0lHRkfHCkpFiU3NTYaKjI+LSkwGTshE//bAEMBBwgICwkLFQsLFSwdGR0sLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLP/AABEIAdoB2gMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AMu6ZvtEvP8Ac7D+4Kh3P6/oKlu/+PiX/gH/AKAKgrwnuftUPhQ7c/r+go3P6/oKbRSLHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FG5/X9BTaKAHbn9f0FP3P6/oKip9A0SXf/HxL/wD/wBAFQVPd/8AHxL/AMA/9AFQU3uZw+FBRRRSLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACn0yn0DRJd/8fEv/AP/AEAVBU93/wAfEv8AwD/0AVBTe5nD4UFFFFIsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKfTKfQNEl3/x8S/8A/8AQBUFT3f/AB8S/wDAP/QBUFN7mcPhQUUUUiwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAp9Mp9A0SXf/HxL/wD/wBAFQVPd/8AHxL/AMA/9AFQU3uZw+FBRRRSLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo+v600yRL96RB9WFMmUlH4nYdRURubUdZk/A5pv2u0/56r+tPll2MHiqC3mvvRPRRRUnQFFFFAwooooAKKKKACiiigAooooAKfTKfQNEl3/x8S/8A/8AQBUFT3f/AB8S/wDAP/QBUFN7mcPhQUUUUiwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKgmuoIeCdz/wB1eT+JppN6Iyq1oUY89R2RPUck8EX35FB9Op/IVly3txLkA7F9F6/iarV0RofzHzeJ4gjHShG/m/8AL/hjSfUlGRHGT7ucD8hVZ727fo4UeiDH61WordU4roeDWzTFVt5temn5Dmklb7zufqxptFFWefKTk7ydwoHUfUfzooHUfUfzpiW50I6L9B/KigdF+g/lRXln6utgooooGFFFFABRRRQAUUUUAFFFFABT6ZT6Boku/wDj4l/4B/6AKgqe7/4+Jf8AgH/oAqCm9zOHwoKKKKRYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUjukalnYKo7mo5544F3Ock/dUdWNZE08s7bnPH8KjotbU6bnr0PHzDNKeDXKtZ9u3qWLi+kkysWUTuf4jVKiiuyMVFWR8PiMTVxMueq7hRRRVHOFFFFABRRRQAUDqPqP50UDqPqP50AtzoR0X6D+VFA6L9B/KivLP1dbBRRRQMKKKKACiiigAooooAKKKKACn0yn0DRJd/8AHxL/AMA/9AFQVPd/8fEv/AP/AEAVBTe5nD4UFFFFIsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqG4uEt0yeXP3F9fc06eZIELt16KO7GsWSR5XZ3OSfyA9BW1OnzavY8PNczWEj7On8b/AA8/8hJJHlYu5yx/IewptFFdux8JKTk3KTu2FFFFMQUUUUAFFFFABRRRQAUDqPqP50UDqPqP50AtzoR0X6D+VFA6L9B/KivLP1dbBRRRQMKKKKACiiigAooooAKKKKACn0yn0DRJd/8AHxL/AMA/9AFQVPd/8fEv/AP/AEAVBTe5nD4UFFFFIsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkZlRWdjhVGSaWsu+uPMbykPyIfmx/E3/ANatIQ53Y4MfjI4Ok6j36LzK887zyFzwo4RfQVFRRXelZWR+c1Kkqs3Obu2FFFFMgKKKKACiiigAooooAKKfHFLKcRoWPt0H1NXI9OkP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QAUUUUAFFFFABRRRQAUUUUAFWLL/AI+Yf+BfyNV6sWX/AB8w/wDAv5Gon8LOvA/7zT/xL8zZooorzj9NCiiigAooooAKKKKACiiigAooooAKKKKACiiigAp9Mp9A0SXf/HxL/wAA/wDQBUFT3f8Ax8S/8A/9AFQU3uZw+FBRRRSLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiioLubyYWIPzv8AKn1Pemld2RlWqxo03UnsjOvZvNmIB+SP5F+vc1Woor0YrlVkfmVetKvUlVluwoooqjEKKKKACiiigAoq/BYpJEkjsylskAY6dql/s2D/AJ6SfpWTqxTsevTyfF1Iqajo/My6K1P7Ng/56SfpR/ZsH/PST9KXtoF/2HjOy+9GXRWp/ZsH/PST9KP7Ng/56SfpR7aAf2HjOy+9GXRWp/ZsH/PST9KP7Ng/56SfpR7aAf2HjOy+9GXViy/4+Yf+BfyNXP7Ng/56SfpT4rKKGRZFdyVzgHGOeKmVWLTR0YXJ8VTrQnJKyae/mWqKKK4z7YKKKKACiiigAooooAKKKKACiiigAooooAKKKKACn0yn0DRJd/8AHxL/AMA/9AFQVPd/8fEv/AP/AEAVBTe5nD4UFFFFIsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKxbufzpSR9xPlT/Grt/cbE8lT87j5sdl/+vWXXXRh9pnx+e47mf1aD0W/r2Ciiiuk+XCiiigAooooAKkhjMsscY/iPP0HWo60tOiwrzEct8qfQdTWdSXLG53ZfhvrWIjT6bv0L4AAAHQAAfQUUUV55+khRRRQMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAp9Mp9A0SXf/HxL/wD/wBAFQVPd/8AHxL/AMA/9AFQU3uZw+FBRRRSLCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKjnmWCMu3Xoo9TT3dI1Z3OFUZJrFuJ2ncseFHCL6CtadPnfkeRmeYLB07R+N7f5kbu0jM7HLMcmm0UV3H5+25O73CiiimIKKKKACiiigByI0joi9WIAreRFjREXooAH4VQ06H707D/ZT+prQrjrSu7H2+RYT2VH20t5fl/wf8gooornPoQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAp9Mp9A0SXf/HxL/wAA/wDQBUFT3f8Ax8S/8A/9AFQU3uZw+FBRRRSLCiiigAooooAKKKKACiiigAooooAKKKKACiiigApHdEUu5AUckmmyzRQruc49B3J9hWRcXMlw3PCD7qjoPc+9a06bn6HlZhmVPBxtvLov8xbm5a4bjIjU/Kvr7mq9FFdySSsj4GtWnXm6lR3bCiiimZBRRRQAUUUUAFOjjaV0jXqxx9B3NNrTsINqmZh8zjCey+v41E5cqud2AwjxddU+nX0LqIsaIi/dUACloorzz9IjFRVlsFFFFIoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKfTKfQNEl3/x8S/8AAP8A0AVBU93/AMfEv/AP/QBUFN7mcPhQUUUUiwooooAKKKKACiiigAooooAKKKKACimPLDH9+RV+p5/KqsmoxLkRqXPqeF/xq4wlLZHJXxlDDr95NL8/uLtU576OPKxYd/X+EVQluZ5vvthf7q8LUNdEKFtZHzOMz6Uvdw6t5vf5IdJJJKxd2LMfXt9KbRRXRsfMyk5Pmk7sKKKKYgooooAKKKKACiilVWZlVRlmOAPegEm3ZE1rAZ5Qv8C8ufb0raAAAAGABgD2qK3hWCMIPvHlz6mpa4Kk+Zn6FleB+qUfe+J7/wCXyCiiisj1gooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKfTKfQNEl3/wAfEv8AwD/0AVBU93/x8S/8A/8AQBUFN7mcPhQUUUUiwooooAKKKKACiiigAooooAbISI5COCFYj8qwzNOw+aSQ/VjW5L/q5f8Acb+VYFdVBaM+R4hnKMoJPowooorqPlQooooAKKKKACiiigAooooAKKKKACtSytvLAlkHzsPlB/hU1DZWu4iaQfKOUU/xH1Nadctap9lH1uS5ba2Jqr0X6/5feFFFFcp9WFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU+mU+gaJLv8A4+Jf+Af+gCoKnu/+PiX/AIB/6AKgpvczh8KCiiikWFFFFABRRRQAUUUUAFFFFADZf9XL/uN/KsCt+X/Vy/7jfyrArrw+zPj+Ivjp+j/QKKKK6T5cKKKKACiiigAooooAKKKKACrtpZmTEsoxGOVU9W/+tT7Wx+7JOPdU/q1aNc1Sr0ifU5Xk7bVbELTov8/8g+nSiiiuQ+uCiiigYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABT6ZT6Boku/8Aj4l/4B/6AKgqe7/4+Jf+Af8AoAqCm9zOHwoKKKKRYUUUUAFFFFABRRRQAUUUUANl/wBXL/uN/KsCt+X/AFcv+438qwK68Psz4/iL46fo/wBAooorpPlwooooAKKKKACinJHJIcRqWPsP5mr8OndGnb/gC/1NRKcY7nZhsDXxT/dx079ClFDLM22NSfU9h9TWpb2ccOGb55PU9B9BVhVRFCooVR0Apa5J1XLRH2OByelhbTn70vwXoFFFFYnthRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU+mU+gaJLv/j4l/wCAf+gCoKnu/wDj4l/4B/6AKgpvczh8KCiiikWFFFFABRRRQAUUUUAFFFFADZf9XL/uN/KsCugYBlZT0YEfnVP+zrf+/J+ldFKainc+ezjAVsXKDpLa/Uy6K1hp9qOu8/8AAsfyp4srMf8ALPP+8Sa19vE8eOQYp7tL5/8AAManrFM/3I3b6A1trDAn3YkH/AR/Wn1DxHZHZT4d/wCflT7l/X5GSmn3LY3bUHucn8hVuPT7dMFyXPvwv5CrdFZSqyZ61DJ8LR15bvz1/wCAIqqowqhR6AYFLRRWR6ySSsgooooGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU+mU+gaJLv/j4l/4B/wCgCoKnu/8Aj4l/4B/6AKgpvczh8KCiiikWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFPplPoGiS7/4+Jf+Af8AoAqCp7v/AI+Jf+Af+gCoKb3M4fCgooopFhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABT6ZT6Boku/+PiX/gH/AKAKgqe7/wCPiX/gH/oAqCm9zOHwoKKKKRYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU+mU+gaJLv/j4l/4B/wCgCoKnu/8Aj4l/4B/6AKgpvczh8KCiiikWFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFPplPoGiS7/4+Jf+Af8AoAqCtfW/+Qvq/wD1+T/+hVn1UlZswoy5qcZd0iCip6KRqQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQUVPRQBBRU9FAEFFT0UAQU+pK2of9VD/wBc0/kKajcxrVvZJO1z/9k=
// @grant GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451958/Downloadable%20Flash%20Games%20%7C%20NewGroundscom%20%7C%20ArmorGamescom%20%7C%20Kongregatecom%20and%20more%21.user.js
// @updateURL https://update.greasyfork.org/scripts/451958/Downloadable%20Flash%20Games%20%7C%20NewGroundscom%20%7C%20ArmorGamescom%20%7C%20Kongregatecom%20and%20more%21.meta.js
// ==/UserScript==

(function() {
    class NewGrounds {
        static init() {
            const RE_SWF = /:(\\.*?.swf)/
            const SCRIPT = document.querySelector('#outer-skin script[src] + script')
            const SWF = SCRIPT.textContent.match(RE_SWF)[1]
            const GAME_HEADER = document.querySelector('#embed_header > div span ~ span')

            if(GAME_HEADER) {
                GAME_HEADER.insertAdjacentHTML(
                    'afterend',
                    '<span><a class="icon-download" href="'+ SWF +'" title="Download" rel="nofollow noreferrer">Download</a></span>'
                )
            }
        }
    }

    class ArmorGames {
        static init() {
            const SWF = document.querySelector('[value*=".swf"]').value
            const HEADER = document.querySelector('.game-header h1')
            const LINK = document.createElement('a')

            LINK.href = SWF
            LINK.style.cssText = 'position: relative; top: 13px; left: 4px; height: 18px;'
            LINK.innerHTML = '<i style="background-image: url(../../images/sprites/sprites.png);background-position: -256px -120px;width: 19px;height: 18px;display: block;"></i>'

            HEADER.style.display = 'flex'
            HEADER.appendChild(LINK)
        }
    }

    class Y8 {
        static init() {
            let swf

            const ITEM_CONTAINER = document.querySelector('#item-container')

            if(ITEM_CONTAINER) {
                const ASYNC_CONTENT = ITEM_CONTAINER.dataset.asyncContent

                try {
                    swf = ASYNC_CONTENT.match(/src=['"](.*?\.swf)\?.*['"]/)[1]
                } catch(_) {
                    swf = document.querySelector('[value*=".swf"]').value
                }
            }


            const BTN = document.createElement('a')
            BTN.rel = 'nofollow noreferrer'
            BTN.href = swf
            BTN.className = 'button button--light-grey'
            BTN.style.marginLeft = '7px'

            const ICON = document.createElement('img')
            ICON.src = 'https://www.svgrepo.com/download/507480/arrow-down-alt.svg' // Icon licensed under "MIT License", author "scarlab"
            ICON.style.width = '16px'

            const TEXT = document.createElement('span')
            TEXT.style.marginLeft = '7px'
            TEXT.textContent = 'Download'

            BTN.appendChild(ICON)
            BTN.appendChild(TEXT)

            const BTNS_LIST = document.querySelector('#details .fav-part')
            BTNS_LIST.appendChild(BTN)
        }
    }

    class Kongregate {
        static init() {
            const DL = document.createElement('li')
            DL.id = 'quicklinks_download_block'
            DL.className = 'save lbOn'
            DL.innerHTML = '<a href="#!" style="padding: 0;"><i class="kong_ico prs">d</i><span>Download</span></a>'

            const RE_IFRAME = /iframe_url['"]:['"](.*?)['"]/
            const GAME_SCRIPT = document.querySelector('#gameiframe + script')
            const FETCH_URL = GAME_SCRIPT.textContent.match(RE_IFRAME)[1]

            const BTN_TEXT = DL.querySelector('span')
            let prevText = ''

            console.log(FETCH_URL)

            DL.addEventListener('click', () => {
                prevText = BTN_TEXT.textContent
                BTN_TEXT.textContent = 'Downloading'
                DL.style.pointerEvents = 'none'

                GM.xmlHttpRequest({
                    method: 'GET',
                    url: FETCH_URL,
                    onload: function(res) {
                        const CONTENT = res.responseText
                        const DOC = new DOMParser().parseFromString(CONTENT, 'text/html')
                        const RE_SWF = /swf_location = ['"](.*?)['"];/
                        const GAME_FRAME_SCRIPT= DOC.querySelector('#game_wrapper + script + script')
                        const SWF = GAME_FRAME_SCRIPT.textContent.match(RE_SWF)[1]

                        console.log(SWF)

                        openUrl(SWF)

                        DL.style.pointerEvents = ''
                        BTN_TEXT.textContent = prevText
                    }
                })
            })

            if(FETCH_URL.includes('konggames.com/games/')) {
                const QUICK_LINKS = document.querySelector('#quicklinks')

                QUICK_LINKS.appendChild(DL)
            }
        }
    }

    class SilverGames {
        static init() {
            const GSTAT = document.querySelector('#gstat')
            const GAME_ID = GSTAT.dataset.id
            const FETCH_URL = 'https://f.silvergames.com/emu/waffle/?id=' + GAME_ID
            const DL = document.createElement('a')

            DL.href = '#!'
            DL.style.cssText = 'margin-left: 8px;font-size: large;'
            DL.textContent = '(Download)'

            let prevText = ''

            DL.addEventListener('click', () => {
                DL.style.pointerEvents = 'none'
                prevText = DL.textContent
                DL.textContent = '(Downloading)'

                GM.xmlHttpRequest({
                    method: 'GET',
                    url: FETCH_URL,
                    onload: function(res) {
                        const CONTENT = res.responseText
                        const DOC = new DOMParser().parseFromString(CONTENT, 'text/html')
                        const RE_SWF = /swf[u|U]rl: ['"](.*?)['"]/
                        const SCRIPT = DOC.querySelector('head script')
                        const SWF = SCRIPT.textContent.match(RE_SWF)[1]

                        openUrl(SWF)

                        DL.style.pointerEvents = ''
                        DL.textContent = prevText
                    }
                })
            })

            const HEADER = document.querySelector('h2')
            HEADER.appendChild(DL)
        }
    }

    class Nitrome {
        static init() {
            const GAME = document.title.split(' - ')[0]
            const GAME_FILENAME = GAME.replace(/[\s-]/g, '_')
            const GAME_NAME = GAME.replace(/\-/g, ' ')
            const DL = document.createElement('a')
            DL.style.height = '16px'
            DL.style.display = 'inline-block'

            DL.title = `Download ${GAME}\n\nIcon licensed under Attribution 4.0 International (CC BY 4.0); https://creativecommons.org/licenses/by/4.0/`
            DL.target = '_blank'
            DL.href = `https://archive.org/download/all_nitrome_games/${encodeURIComponent(GAME_NAME)}/${encodeURIComponent(GAME_FILENAME)}.swf`
            DL.innerHTML = '<img src="https://icons.iconarchive.com/icons/famfamfam/mini/16/arrow-down-icon.png" style="position: relative;top: 2px;">'

            const TOP_BAR_BOX = document.querySelector('#top_bar_box')

            TOP_BAR_BOX.appendChild(DL)
        }
    }

    class MiniPlay {
        static init() {
            const DL = document.createElement('div')
            const GAME_HEADER = document.querySelector('h1[itemprop="name"]')
            const GAME_NAME = GAME_HEADER.textContent.toLowerCase().replace(/[^\w\d]/g, '')
            DL.innerHTML = '<a target="_blank" href="https://www.minijuegosgratis.com/flash1234/no_hotlink/' + GAME_NAME + '.swf"><span class="ic ic-mb-download"></span></a>'

            const GAME_ACTIONS_WRAPPER = document.querySelector('.game-actions-wrapper')

            GAME_ACTIONS_WRAPPER.appendChild(DL)
        }
    }

    class FrivEZ {
        static init() {
            const DL = document.createElement('button')
            DL.className = 'btn btn-link ml-3 p-0'

            const SWF = `https://frivez.com/games${location.pathname}.swf`

            DL.innerHTML = `<a target="_blank" href="${SWF}"><i class="far fa-save h5"></i></a>`

            const FLASH_IFRAME = document.querySelector('iframe[src*="flash"]')

            if(FLASH_IFRAME) {
                const LEFT_TEXT = document.querySelector('.container .text-left')

                LEFT_TEXT.appendChild(DL)
            }
        }
    }

    class TwoPlayerGames {
        static init() {
            const RE_SWF = /d['"]:['"](h.*?.swf)['"]/
            const SCRIPT = document.querySelector('script[defer] + script[src] + script')
            const SWF = SCRIPT.textContent.match(RE_SWF)[1]
            const DL = document.createElement('div')

            DL.innerHTML = `<a rel="nofollow noreferrer" target="_blank" href="${SWF}" style="display: flex;background: rgb(192, 183, 152);padding: 2px 8px 2px 5px;border-radius: 10px;"><img src="https://api.iconify.design/material-symbols:arrow-downward-rounded.svg"> Download</a>`

            const GAME_PAGE_LIKE = document.querySelector('.game-page-social')
            GAME_PAGE_LIKE.appendChild(DL)
        }
    }

    const DOMAIN_DATA = {
        NewGrounds: 'www.newgrounds.com',
        ArmorGames: 'armorgames.com',
        Y8: 'y8.com',
        Kongregate: 'www.kongregate.com',
        SilverGames: 'www.silvergames.com',
        Nitrome: 'www.nitrome.com',
        MiniPlay: 'www.miniplay.com',
        FrivEZ: 'frivez.com',
        TwoPlayerGames: 'www.twoplayergames.org'
    }

    class Main {
        static init() {
            const CLASSES = [
                NewGrounds,
                ArmorGames,
                Y8,
                Kongregate,
                SilverGames,
                Nitrome,
                MiniPlay,
                FrivEZ,
                TwoPlayerGames
            ]

            for (let i = 0; i < CLASSES.length; i++) {
                const CLASS = CLASSES[i]
                const CLASS_NAME = CLASS.name
                const DOMAIN = DOMAIN_DATA[CLASS_NAME]

                if(!DOMAIN) {
                    console.error(CLASS_NAME, 'does not have domain info!')
                    continue
                }

                if(location.host.indexOf(DOMAIN) !== -1) {
                    if(CLASS.init) {
                        try {
                            console.log(CLASS_NAME + '.init is initialized')
                            CLASS.init()
                        } catch(e) {
                            console.error(CLASS_NAME, 'has error', e)
                            continue
                        }
                    } else {
                        console.error(CLASS_NAME, 'does not have `init` method!')
                        continue
                    }
                }
            }
        }
    }

    Main.init()

    function openUrl(url) {
        const LINK = document.createElement('a')
        LINK.href = url
        LINK.rel = 'nofollow noreferrer'
        LINK.target = '_blank'

        document.body.appendChild(LINK)

        LINK.click()

        document.body.removeChild(LINK)
    }
})()