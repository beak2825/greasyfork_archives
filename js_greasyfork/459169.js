// ==UserScript==
// @name         Pikabu User Posts Fast Stoplist Button
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  On the posts pages of the site pikabu.ru displays a button for quickly adding posts of the author of the post to the ignore list
// @author       You
// @match        https://pikabu.ru/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459169/Pikabu%20User%20Posts%20Fast%20Stoplist%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/459169/Pikabu%20User%20Posts%20Fast%20Stoplist%20Button.meta.js
// ==/UserScript==

const userNick = document.querySelector('.story__user-link.user__nick')
const storyLeft = document.querySelector('div.story__left')
const stoplistButtonWrapper = document.createElement('div')
const profileUrl = userNick.href
const sleepTime = 500

stoplistButtonWrapper.className = "story__scroll"
stoplistButtonWrapper.style = "top:400px; position:fixed;"
stoplistButtonWrapper.innerHTML = '<a class="button stoplist-button">🛇</a>'

storyLeft.appendChild(stoplistButtonWrapper)
const stoplistButton = document.querySelector('.stoplist-button')
stoplistButton.style = "font-size:24px; padding:0; display:inline-block; width:35px;"

stoplistButton.onclick = putInStoplist

function putInStoplist(){
    const profilePage = document.createElement('iframe')
    profilePage.setAttribute("src", profileUrl)
    profilePage.style = "width:640px; height:480px; display:none;"
    document.body.appendChild(profilePage)

    profilePage.onload = async () => {
        const iframeBody = profilePage.contentDocument.body
        try {
            if (!iframeBody){
                throw new Error()
            }
            const buttonDot = iframeBody.querySelector('.profile__user-button .button_dot')
            if (!buttonDot){
                throw new Error()
            }
            buttonDot.click()
            stoplistButton.innerHTML = "3"
            await sleep(sleepTime)

            const ignorePostsButton = iframeBody.querySelector('div[data-role="ignore"]')
            if (!ignorePostsButton){
                throw new Error()
            }
            ignorePostsButton.click()
            stoplistButton.innerHTML = "2"
            await sleep(sleepTime)

            const submitButton = iframeBody.querySelector('.popup__footer > .button_success')
            if (!submitButton){
                throw new Error()
            }
            submitButton.click()
            stoplistButton.innerHTML = "1"
            await sleep(sleepTime)

            const readyMessage = iframeBody.querySelector('.header__messages .toast__content')
            if(!readyMessage || readyMessage.innerText != "Готово! Настройки скрытия успешно сохранены!"){
                throw new Error()
            }

            stoplistButton.innerHTML = "✔"
            profilePage.remove()
        } catch (e) {
            stoplistButton.innerHTML = "✖"
            profilePage.remove()
            return
        }
    }
}

function sleep(ms){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
