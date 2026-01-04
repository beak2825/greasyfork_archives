// ==UserScript==
// @name         시청자가 지켜보고 있다
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  케인아 방송켜라, 시청자가 지켜보고 있잖니?
// @author       지나가는 -3000딩쟁이
// @match        https://cafe.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498604/%EC%8B%9C%EC%B2%AD%EC%9E%90%EA%B0%80%20%EC%A7%80%EC%BC%9C%EB%B3%B4%EA%B3%A0%20%EC%9E%88%EB%8B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/498604/%EC%8B%9C%EC%B2%AD%EC%9E%90%EA%B0%80%20%EC%A7%80%EC%BC%9C%EB%B3%B4%EA%B3%A0%20%EC%9E%88%EB%8B%A4.meta.js
// ==/UserScript==

(async function() {
    let soopInfo = {succeed: false,title: "",viewer: 0}
    let dokkomiInfo = {succeed: false,title: "",viewer: 0}
    let chzzkInfo = {succeed: false,title: "",viewer: 0}

    // 숲 방송 정보 가져오기(2024.10.16 아프리카 -> 숲 업데이트)
    async function getSoopInfo() {
        const res = await fetch(`https://chapi.sooplive.co.kr/api/udkn/station`)
        if (res.status != 200) return console.error("괘씸한 코쟁이의 방송 정보 조회에 실패했습니다.")
        const data = await res.json()

        if (data.broad) {
            soopInfo = {succeed: true,title: data.broad.broad_title,viewer: data.broad.current_sum_viewer}
        }
    }

    // 도꼬미 방송 정보 가져오기
    async function getDokkomiInfo() {
        const res = await fetch(`https://chapi.sooplive.co.kr/api/1675rt/station`)
        if (res.status != 200) return console.error("도꼬미미님의 방송 정보 조회에 실패했습니다.")
        const data = await res.json()

        if (data.broad) {
            dokkomiInfo = {succeed: true,title: data.broad.broad_title,viewer: data.broad.current_sum_viewer}
        }
    }

    // 치지직와썩!!!(치지직 정보 조회)
    async function getChzzkInfo() {
        // 요청 서버를 무한대로 우려먹는 나 를! 알까? 흐헤헤 흐헤헤
        const res = await fetch("https://svelte-white-board-server.onrender.com/chzzkgalgirl")
        if (res.status != 200) return console.error("괘씸한 코쟁이의 치지직 방송 정보 조회에 실패했습니다.")
        const data = await res.json()

        if (data?.live) {
            chzzkInfo = {succeed: true,title: data?.title,viewer: data?.userCount}
        }
    }

    await getSoopInfo()
    await getDokkomiInfo()
    await getChzzkInfo()

    // https://stackoverflow.com/questions/1535404/how-to-exclude-iframe-in-greasemonkey-or-tampermonkey
    const parent = (window.top != window.self) ? document : document.querySelector("#cafe_main")?.contentWindow?.document
    // 버튼 부착할 selector가 뭉탱이로 있다가 유링게슝 아이그냥
    const targets = [
        "#sub-tit > div.title_area > div", // 전체글 및 게시판
        "#app > section > div.BoardHeader > div > div > div", // 인기글

    ]

    // document에 LIVE 버튼 추가 시도하기
    function tryAddInfo() {
        // 숲 버튼
        if (soopInfo.succeed) {
            for (let target of targets) {
                const element = parent?.querySelector(target)
                if (!element) continue
                if (element.querySelector("#live-element")) continue // 안 하면 무한 루프 걸림

                const liveElement = document.createElement("a")
                liveElement.style.cssText = `color: white; padding: 5px; text-align: center; width: 40px; background-color: crimson; border-radius: 5px; margin-left: 10px; font-size: 15px; text-decoration: none;`
                liveElement.innerText = `LIVE`
                liveElement.href = "https://play.sooplive.co.kr/udkn"
                liveElement.title = `${soopInfo.title}(시청자 ${soopInfo.viewer}명)`
                liveElement.target = "_blank"
                liveElement.id = `live-element`

                element.style.cssText = `display: flex; align-items: center;`

                element.appendChild(liveElement)

                // 북마크 표시 있는 경우 margin-left 추가(위에 있는 flex 때문에 왼쪽으로 붙음)
                if (element.querySelector("#favorite")) {
                    element.querySelector("#favorite").style.marginLeft = `5px`
                }
            }
        }

        // 도꼬미 버튼
        if (dokkomiInfo.succeed) {
            for (let target of targets) {
                const element = parent?.querySelector(target)
                if (!element) continue
                if (element.querySelector("#dokkomi-live-element")) continue // 안 하면 무한 루프 걸림

                const liveElement = document.createElement("a")
                liveElement.style.cssText = `color: white; padding: 5px; text-align: center; width: 40px; background-color: #0C61E1; border-radius: 5px; margin-left: 10px; font-size: 15px; text-decoration: none;`
                liveElement.innerText = `LIVE`
                liveElement.href = "https://play.sooplive.co.kr/1675rt"
                liveElement.title = `${dokkomiInfo.title}(시청자 ${dokkomiInfo.viewer}명)`
                liveElement.target = "_blank"
                liveElement.id = `dokkomi-live-element`

                element.style.cssText = `display: flex; align-items: center;`

                element.appendChild(liveElement)

                // 북마크 표시 있는 경우 margin-left 추가(위에 있는 flex 때문에 왼쪽으로 붙음)
                if (element.querySelector("#favorite")) {
                    element.querySelector("#favorite").style.marginLeft = `5px`
                }
            }
        }

        // 치지직 버튼
        if (chzzkInfo.succeed) {
            for (let target of targets) {
                const element = parent?.querySelector(target)
                if (!element) continue
                if (element.querySelector("#chzzk-live-element")) continue // 안 하면 무한 루프 걸림

                const liveElement = document.createElement("a")
                liveElement.style.cssText = `color: white; padding: 5px; text-align: center; width: 40px; background-color: #1dad42; border-radius: 5px; margin-left: 10px; font-size: 15px; text-decoration: none;`
                liveElement.innerText = `LIVE`
                liveElement.href = "https://chzzk.naver.com/live/7b1acb37b35928ff690d011296a9e5ab"
                liveElement.title = `${chzzkInfo.title}(시청자 ${chzzkInfo.viewer}명)`
                liveElement.target = "_blank"
                liveElement.id = `chzzk-live-element`

                element.style.cssText = `display: flex; align-items: center;`

                element.appendChild(liveElement)

                // 북마크 표시 있는 경우 margin-left 추가(위에 있는 flex 때문에 왼쪽으로 붙음)
                if (element.querySelector("#favorite")) {
                    element.querySelector("#favorite").style.marginLeft = `5px`
                }
            }
        }
    }

    // 게시판 바뀔때마다 LIVE 버튼 다시 달아놓는 용도의 옵저버
    const config = { attributes: true, childList: true, subtree: true }

    const callback = (mutationList, observer) => {
        tryAddInfo()
    };

    const observer = new MutationObserver(callback)

    observer.observe(document.body, config)

    // 최초 로딩 시에는 observer가 인식 안 함. 에이씨 나쁜놈!
    tryAddInfo()
})();