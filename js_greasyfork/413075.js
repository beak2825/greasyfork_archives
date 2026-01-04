// ==UserScript==
// @name         Yang
// @version      0.3
// @description  ...
// @author       Ya
// @include      https://yang.yandex-team.ru/*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/413075/Yang.user.js
// @updateURL https://update.greasyfork.org/scripts/413075/Yang.meta.js
// ==/UserScript==

const sendNotificationHandler = options => {
    let notification = new Notification('Яндекс.Янг', {requireInteraction: true,
                                                       dir: 'auto',
                                                       icon: 'https://yastatic.net/s3/toloka/p/icon_128x128.126a2bc0464a0ffb672ebeb364b76330.png',
                                                       ...options});
    notification.onclick = function () {
        window.focus()
    }
}

const sendNotification = options => {
    if (!("Notification" in window)) {
        alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.')
    }
    // Проверим, есть ли права на отправку уведомлений
    else if (Notification.permission === "granted") {
        // Если права есть, отправим уведомление
        sendNotificationHandler(options)
    }
    // Если прав нет, пытаемся их получить
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Если права успешно получены, отправляем уведомление
            if (permission === "granted") {
                sendNotificationHandler(options)
            } else {
                alert('Вы запретили показывать уведомления') // Юзер отклонил наш запрос на показ уведомлений
            }
        })
    }
}

async function getData(){
    let res = await fetch(`https://yang.yandex-team.ru/api/i-v2/task-suite-pool-groups`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    return res.ok ? res.json() : 'err'
}

let total = 0
getData().then(data => {
    if (data === 'err') {
        sendNotification({
                    body: `Что-то пошло не так. Обновите страницу!`,
                })
        return
    }
    console.log('data old',data)
    total = data.length
    console.log('total old', total)
})

setInterval(() => {
    if (!document.querySelector('.snippets')) {
        console.log('No DOM')
        return
    } else {
        getData().then(data => {
            if (data === 'err') {
                sendNotification({
                    body: `Что-то пошло не так. Обновите страницу!`,
                })
                return
            }
            if (total !== data.length) {
                console.log(`${new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })} ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' })} \n Изменился список заданий. Обновите страницу!`)
                sendNotification({
                    body: `${new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })} ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' })} \n Изменился список заданий. Обновите страницу!`,
                })
                console.log('data new',data)
                total = data.length
                console.log('total new',total)
            } else {
                console.log(`Ничего не изменилось ${new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })} ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' })}`)
            }
        })
    }
}, 60000)
//1min 60000
//5min 300000
//10min 600000

/*
<div class="task-info"><div class="task-info__values"><span class="task-info__values-time tutorial-task-page__time">9:48</span><span class="task-info__values-separator">/</span><span class="task-info__values-reward tutorial-task-page__reward">0,01</span></div><div class="task-info__description" title="🚗Проверка качества фото ТС.">🚗Проверка качества фото ТС.</div></div>
*/