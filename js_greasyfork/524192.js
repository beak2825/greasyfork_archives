// ==UserScript==
// @name         巴哈姆特 Now!樣式修改
// @description  修改Now的樣式，讓他在網頁版從無法直視變得勉強可看
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.2.7
// @homepage     https://home.gamer.com.tw/profile/index_creation.php?owner=nathan60107&folder=425332
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://now.gamer.com.tw/chat_list.php*
// @icon         https://ani.gamer.com.tw/apple-touch-icon-144.jpg
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/524192/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20Now%21%E6%A8%A3%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/524192/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20Now%21%E6%A8%A3%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

GM_addStyle(`
  .now_chatroom-container .chatroom .msg_container {
    margin-top: 12px !important;
    margin-bottom: 12px !important;
  }
  .now_chatroom-container.is-bpage {
    height: 90vh !important;
  }
  div.user-runes {
    display: none !important;
  }
  .chatroom {
    overscroll-behavior: contain;
  }
`)

function handleLayout() {
  const elements = document.querySelectorAll(".msg_container")

  for (let i = 0; i < elements.length - 2; i++) {
    const current = elements[i]
    const next = elements[i + 1]
    const nowUserInfo = next.querySelector(".now_user-info")
    const userHeadshot = next.querySelector(".user-headshot")

    // 如果當前元素和下一個元素的 data-uid 相同，隱藏名字和頭貼
    if (current.dataset.uid === next.dataset.uid) {
      nowUserInfo && (nowUserInfo.style.display = "none")
      userHeadshot && (userHeadshot.style.visibility = "hidden")
      userHeadshot && (userHeadshot.style.height = 0)
    } else {
      nowUserInfo && (nowUserInfo.style.display = "")
      userHeadshot && (userHeadshot.style.visibility = "")
      userHeadshot && (userHeadshot.style.height = "")
    }
  }

  const photos = document.querySelectorAll(".message.is-photo")
  photos.forEach((photo) => {
    const a = photo.querySelector("a")
    const img = a?.querySelector("img")
    if (a && img && img.src) {
      a.href = img.src
      a.onclick = (e) => e.preventDefault()
    }
  })
}

;(async function () {
  const observer = new MutationObserver(handleLayout)

  observer.observe(
    document.querySelector("#BH-slave, .now_chatroom-container"),
    { childList: true, subtree: true }
  )

  document.addEventListener("focus", function () {
    if (document.hidden) return
    document.getElementById("msg_input")?.focus()
  })
})()

/* Ref:
 * https://stackoverflow.com/a/19392142
 */
