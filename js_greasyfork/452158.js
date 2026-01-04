// ==UserScript==
// @name         Ответы kompege | КЕГЭ
// @namespace    https://greasyfork.org/users/843419
// @version      1.1
// @description  Добавляет кнопку "Ответы" рядом с количеством введенных ответов.
// @author       Zgoly
// @match        https://kompege.ru/variant*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kompege.ru
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452158/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20kompege%20%7C%20%D0%9A%D0%95%D0%93%D0%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/452158/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20kompege%20%7C%20%D0%9A%D0%95%D0%93%D0%AD.meta.js
// ==/UserScript==

// Диалоговое окно
let modal = document.createElement('dialog')
document.body.appendChild(modal)
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close()
    }
})

// Функция для создания кнопки
const createButton = (text, action) => {
    let button = document.createElement('button')
    button.textContent = text
    button.className = 'button'
    button.addEventListener('click', action)
    return button
}

// Кнопки
let generateAnswersButton = createButton('Открыть страницу с ответами', () => {
    modal.close()
    let kimData = JSON.parse(window.localStorage.getItem('kimData'))
    let newDocument = open().document
    let newBody = newDocument.body

    let title = document.createElement('title')
    title.innerText = document.title + ' Ответы'
    newBody.appendChild(title)

    newBody.style.fontFamily = 'sans-serif'

    let mainTitle = document.createElement('h1')
    mainTitle.innerText = document.title + ' Ответы'
    newBody.appendChild(mainTitle)

    kimData.tasks.forEach(task => {
        let taskTitle = document.createElement('h2')
        taskTitle.innerText = 'Задание #' + task.number
        newBody.appendChild(taskTitle)

        newBody.innerHTML += task.text

        let answerTitle = document.createElement('h3')
        answerTitle.innerText = 'Ответ:' + task.key
        newBody.appendChild(answerTitle)

        newBody.appendChild(document.createElement('br'))
    })
})

let fillAnswersButton = createButton('Заполнить все ответы', () => {
    modal.close()
    let kimData = JSON.parse(window.localStorage.getItem('kimData'))
    kimData.tasks.forEach(task => task.answer = task.key)
    window.localStorage.setItem('kimData', JSON.stringify(kimData))
    window.location.reload()
})

let deleteAnswersButton = createButton('Удалить все ответы', () => {
    modal.close()
    let kimData = JSON.parse(window.localStorage.getItem('kimData'))
    kimData.tasks.forEach(task => task.answer = '')
    window.localStorage.setItem('kimData', JSON.stringify(kimData))
    window.location.reload()
})

let debugInfoButton = createButton('Отладочная информация', () => {
    modal.close()
    console.log(JSON.parse(window.localStorage.getItem('kimData')))
})

// Добавление кнопок в диалоговое окно
modal.appendChild(generateAnswersButton)
modal.appendChild(fillAnswersButton)
modal.appendChild(deleteAnswersButton)
modal.appendChild(debugInfoButton)

// Наблюдатель за изменениями в DOM
let observer = new MutationObserver(() => {
    let anscount = document.querySelector('.anscount')
    if (anscount) {
        observer.disconnect()
        let button = document.createElement('button')
        button.innerText = 'Ответы'
        button.className = 'button'
        button.addEventListener('click', () => {
            modal.showModal()
        })
        anscount.parentElement.appendChild(button)
    }
})
observer.observe(document.body, { childList: true, subtree: true })

// Стили
GM_addStyle(`
.button {
    background: #1e325a;
    color: #fff;
    transition: 0.2s;
    cursor: pointer;
    font-size: 16px;
    padding: 10px;
    border-radius: 5px;
    border: none;
    display: block;
    margin: 10px auto;
}
.button:hover {
    opacity: 0.75;
}
` );
