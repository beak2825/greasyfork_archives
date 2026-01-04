// ==UserScript==
// @name         LZTClown
// @namespace    https://zelenka.guru/urmom/
// @version      1.3
// @description  Персональный список клоунов на форуме LolzTeam
// @author       Интерпол
// @icon         https://zelenka.guru/favicon.ico
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484700/LZTClown.user.js
// @updateURL https://update.greasyfork.org/scripts/484700/LZTClown.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // *********** Настройки ***********

  const emojiIcon = "🤡" // эмодзи возле ника
  const clownButton = "https://i.imgur.com/Wyqq6g5.png" // URL картинки для назначения клоуна (PNG)
  const showButton = true // false скрыть кнопку, true показать

  const clownAdded = "объявлен клоуном" // уведомление при назначении
  const clownDelete = "больше не является клоуном" // уведомление при выносе

  const clownStyle = true // изменять ли аватарку и ник пользователя
  const hideMessagesFromClowns = true // нужно ли скрывать сообщения от клоунов, последние 5 в учет
  const clownAvatar = "https://i.imgur.com/MBDKn9l.png" // URL новой аватарки
  const clownName = "Клоун" // новый ник для пользователя - не работает пока что!!!

  // *********** Настройки ***********

  let blacklist = GM_getValue("blacklist", {})

  function getUserIdFromAvatarUrl(url) {
    const urlParts = url.split("/")
    const lastPart = urlParts[urlParts.length - 1]
    return lastPart.split(".")[0]
  }

  function getBlacklistUserIds() {
    const avatars = GM_getValue("originalAvatars", {})
    // console.log("user avatars: ", avatars);
    const allUserIds = Object.values(avatars)
      .map((url) => getUserIdFromAvatarUrl(url))
      .filter((id) => id)
    const userIds = allUserIds.slice(-5)
    // console.log("last 5 user IDs in blacklist: ", userIds);
    return userIds
  }

  function addMessageSendHandler() {
    const button = document.querySelector("button.lzt-fe-se-sendMessageButton")
    const div = document.querySelector(
      "div.fr-element.fr-view.fr-element-scroll-visible"
    )
    if (button && div) {
      button.addEventListener("click", function () {
        const userIds = getBlacklistUserIds()
        if (userIds.length > 0) {
          const elements = []
          const childElements = div.children
          for (var i = 0; i < childElements.length; i++) {
            elements.push(childElements[i].outerHTML)
          }
          if (elements.length !== 0) {
            div.innerHTML =
              `[exceptids=${userIds.join(",")}]` +
              elements.join("<br>") +
              "[/exceptids]"
          }
          setTimeout(function () {
            div.innerHTML = ``
          }, 1)
        }
      })
    }
  }
  function initMessageHandler() {
    const userIds = getBlacklistUserIds()
    if (userIds.length > 0 && hideMessagesFromClowns) {
      addMessageSendHandler()
    }
  }

  function getOriginalAvatar(username) {
    const avatars = GM_getValue("originalAvatars", {})
    return avatars[username]
  }

  function setOriginalAvatar(username, url) {
    const avatars = GM_getValue("originalAvatars", {})
    avatars[username] = url
    GM_setValue("originalAvatars", avatars)
  }

  function updateClownAppearance(username, add) {
    if (!clownStyle) return

    document.querySelectorAll("li.message").forEach((messageElem) => {
      if (messageElem.getAttribute("data-author") === username) {
        const avatarElem = messageElem.querySelector(".avatar span.img")
        if (avatarElem) {
          if (add) {
            if (!getOriginalAvatar(username)) {
              setOriginalAvatar(username, avatarElem.style.backgroundImage)
            }
            avatarElem.style.backgroundImage = `url('${clownAvatar}')`
            avatarElem.style.backgroundSize = "cover"
            avatarElem.style.backgroundPosition = "center"
            avatarElem.style.backgroundRepeat = "no-repeat"
          } else {
            const originalAvatar = getOriginalAvatar(username)
            if (originalAvatar) {
              avatarElem.style.backgroundImage = originalAvatar
            }
          }
        }
      }
    })
  }

  function updateClownAppearanceOnLoad() {
    document.querySelectorAll("li.message").forEach((messageElem) => {
      const author = messageElem.getAttribute("data-author")
      const avatarElem = messageElem.querySelector(".avatar span.img")
      if (avatarElem && blacklist.hasOwnProperty(author) && clownStyle) {
        avatarElem.style.backgroundImage = `url('${clownAvatar}')`
        avatarElem.style.backgroundSize = "cover"
        avatarElem.style.backgroundPosition = "center"
        avatarElem.style.backgroundRepeat = "no-repeat"
      }
    })
  }

  function lztClown() {
    document.querySelectorAll(".username").forEach((elem) => {
      let username = elem.textContent.trim()
      let isBlacklisted = blacklist.hasOwnProperty(username)
      let nextSiblingIsIcon =
        elem.nextElementSibling &&
        elem.nextElementSibling.classList.contains("blacklist-icon")

      if (isBlacklisted && !nextSiblingIsIcon) {
        const blacklistIcon = document.createElement("span")
        blacklistIcon.textContent = ` ${emojiIcon}`
        blacklistIcon.className = "blacklist-icon"
        blacklistIcon.style.cursor = "pointer"
        blacklistIcon.title = blacklist[username]
        elem.parentNode.insertBefore(blacklistIcon, elem.nextSibling)
      } else if (!isBlacklisted && nextSiblingIsIcon) {
        elem.nextElementSibling.remove()
      }
      elem.classList.toggle("blacklisted-user", isBlacklisted)
    })
  }

  function addClown(username, reason) {
    blacklist[username] = reason
    GM_setValue("blacklist", blacklist)
    lztClown()
    updateClownAppearance(username, true)
    XenForo.alert(`Пользователь ${username} ${clownAdded}`, "LZTClown", 2000)
  }

  function removeClown(username) {
    delete blacklist[username]
    lztClown()
    updateClownAppearance(username, false)
    const avatars = GM_getValue("originalAvatars", {})
    if (avatars[username]) {
      delete avatars[username]
      GM_setValue("originalAvatars", avatars)
    }
    GM_setValue("blacklist", blacklist)
    XenForo.alert(`Пользователь ${username} ${clownDelete}`, "LZTClown", 2000)
  }

  function createBlacklistModal() {
    const blacklistModal = document.createElement("div")
    blacklistModal.id = "blacklistModal"
    blacklistModal.className = "modal fade in"
    blacklistModal.style = "z-index: 10003; padding-right: 15px; outline: none;"
    blacklistModal.tabIndex = -1

    let blacklistContent = "<ul>"
    for (let user in blacklist) {
      blacklistContent += `<li>${user} - ${blacklist[user]}</li>`
    }
    blacklistContent += "</ul>"

    blacklistModal.innerHTML = `
<div class="xenOverlay" style="top: 10%;">
    <div class="errorOverlay">
        <a class="close OverlayCloser"></a>
        <h2 class="heading">Список клоунов</h2>
        <div class="baseHtml errorDetails">
            <div class="modalContent">
                <div class="blacklistContent">${blacklistContent}</div>
                <div class="centerButton">
                    <button class="button primary" id="closeBlacklistModal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</div>

    `
    document.body.appendChild(blacklistModal)

    setTimeout(() => {
      blacklistModal.style.opacity = 1
    }, 10)

    document
      .getElementById("closeBlacklistModal")
      .addEventListener("click", function () {
        blacklistModal.style.opacity = 0
        setTimeout(() => {
          blacklistModal.parentNode.removeChild(blacklistModal)
        }, 500)
      })
  }

  function createModal(username) {
    const existingModal = document.getElementById("blacklistModalWrapper")
    if (existingModal) {
      existingModal.remove()
    }

    const modalWrapper = document.createElement("div")
    modalWrapper.id = "blacklistModalWrapper"
    modalWrapper.className = "modal fade in"
    modalWrapper.style = "z-index: 10002; padding-right: 15px; outline: none;"
    modalWrapper.tabIndex = -1
    modalWrapper.innerHTML = `
            <div class="xenOverlay" style="top: 10%;">
                <div class="errorOverlay">
                    <a class="close OverlayCloser"></a>
                    <h2 class="heading">LZTClown > Добавить</h2>
                    <div class="baseHtml errorDetails">
                        <div style="display: flex; flex-direction: column; align-items: center; margin: auto;">
                            <p>Введите причину по которой ${username} является клоуном</p>
                            <input type="text" id="blacklistReason" class="textCtrl" placeholder="Причина" autocomplete="off" style="width: 60%;">
                            <button id="addClownButton" class="button primary" style="margin-top: 1rem;">Добавить</button>
                            <button id="showBlacklistButton" class="button" style="margin-top: 1rem;">Показать список</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    document.body.appendChild(modalWrapper)

    setTimeout(() => {
      modalWrapper.style.opacity = 1
    }, 10)

    const addClownButton = document.getElementById("addClownButton")
    const clownReasonInput = document.getElementById("blacklistReason")

    addClownButton.addEventListener("click", function () {
      let reason = clownReasonInput.value
      addClown(username, reason)
      closeModal()
    })

    document
      .getElementById("showBlacklistButton")
      .addEventListener("click", function () {
        createBlacklistModal()
      })

    clownReasonInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        let reason = clownReasonInput.value
        addClown(username, reason)
        closeModal()
      }
    })

    const overlayCloser = modalWrapper.querySelector(".OverlayCloser")
    overlayCloser.addEventListener("click", function () {
      closeModal()
    })

    modalWrapper.addEventListener("click", function (event) {
      if (event.target === modalWrapper) {
        closeModal()
      }
    })
  }

  function closeModal() {
    const modalWrapper = document.getElementById("blacklistModalWrapper")
    if (modalWrapper) {
      modalWrapper.style.opacity = 0
      setTimeout(() => {
        modalWrapper.parentNode.removeChild(modalWrapper)
      }, 500)
    }
  }

  function promptClown(username) {
    createModal(username)
  }

  function init() {
    document.body.addEventListener("click", function (event) {
      if (event.target.classList.contains("blacklist-icon")) {
        let username = event.target.previousElementSibling.textContent.trim()
        removeClown(username)
      } else if (event.target.classList.contains("blacklist-button")) {
        let username = event.target
          .closest(".message")
          .querySelector("a.username")
          .textContent.trim()
        promptClown(username)
      }
    })

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          lztClown()
          addClownButtonToCommentContainers()
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
    lztClown()
    addClownButtonToCommentContainers()
    initMessageHandler()
    updateClownAppearance()
    updateClownAppearanceOnLoad()
  }

  function tippyInit() {
    document.querySelectorAll(".blacklist-icon").forEach((icon) => {
      const iconTitle = icon.getAttribute("title")
      icon.removeAttribute("title")
      tippy(icon, {
        content: iconTitle,
        arrow: true,
      })
    })
  }

  function addClownButtonToCommentContainers() {
    document
      .querySelectorAll(".message .publicControls:not(.blacklist-button-added)")
      .forEach((commentContainer) => {
        if (showButton) {
          const img = document.createElement("img")
          img.src = clownButton
          img.className = "item control blacklist-button"
          img.style.cursor = "pointer"
          img.title = "Назначить клоуном"
          img.style.width = "22px"
          img.style.height = "22px"
          img.addEventListener("click", function () {
            const username = commentContainer
              .closest(".message")
              .querySelector(".username")
              .textContent.trim()
            promptClown(username)
          })
          commentContainer.appendChild(img)
        }
        commentContainer.classList.add("blacklist-button-added")
      })

    tippyInit()
  }

  GM_addStyle(`
    .blacklisted-user {
        // text-decoration: underline red;
    }
    .blacklist-icon {
        margin-left: 5px;
        color: red;
    }
    .blacklist-button {
        display: inline-block;
        margin-left: 5px;
        color: red;
    }
    #blacklistModalWrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modalContent {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin: auto;
    }

    .blacklistContent {
        align-self: flex-start;
        margin-bottom: 1rem;
    }

    .centerButton {
        display: flex;
        justify-content: center;
        width: 100%;
    }
`)

  init()
})()
