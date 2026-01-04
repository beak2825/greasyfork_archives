// ==UserScript==
// @name         Киберконтроль
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Скрипт добавляет новый визуальный трофей - Киберконтроль, который учитывает одобренные репорты и записывает их, выдаётся трофей за 10k одобренных репортов
// @author       Растение
// @match        https://zelenka.guru/*
// @icon         https://imgur.com/pnmESme
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463687/%D0%9A%D0%B8%D0%B1%D0%B5%D1%80%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/463687/%D0%9A%D0%B8%D0%B1%D0%B5%D1%80%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C.meta.js
// ==/UserScript==

var domain = 'zelenka.guru'

var trophey_image = 'https://imgur.com/algQIQt.png';
function add_trophy() {
    if(document.getElementById("trophies")) {
        const trophyElement = document.querySelector("#trophies #trophy-custom-reporter");
        if (!trophyElement) {
            const trophyHtml = `
    <div class="trophy" id="trophy-custom-reporter">
      <div class="trophy-icon" style="background-image: url(${trophey_image})"></div>
      <div class="info">
        <h3 class="title">Киберконтроль</h3>
        <p class="description">Тебе заняться больше нечем?</p>
        <div class="trophyProgress pollBlock">
          <div class="pollResults">
            <div class="pollResult">
              <div class="barCell">
                <span class="barContainer">
                  <div class="bar" style="width: ${localStorage.yesreports/10000 * 100}%"></div>
                  <div class="count">${localStorage.yesreports}</div>
                </span>
              </div>
              <div class="percentage">10000 одобренных жалоб</div>
            </div>
          </div>
          <div class="muted bold">
            Еще ${10000-localStorage.yesreports} одобренных жалоб.
          </div>
        </div>
      </div>
    </div>`;

            const trophiesEl = document.querySelector("#trophies > div > ol:nth-child(2)");
            if(trophiesEl) {
                trophiesEl.insertAdjacentHTML('afterbegin', trophyHtml); // Change made here
            }
        }
    }
}
setInterval(add_trophy)


async function get_max_page() {
    try {
        const response = await fetch(`https://zelenka.guru/account/alerts?page=1`);
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, 'text/html');
        const notificationElement = htmlDocument.querySelector('#content > div > div > div > div.mainContentBlock.section.sectionMain.insideSidebar > div > div > nav > a:nth-child(5)');
        const maxPageAlerts = parseInt(notificationElement.textContent);
        console.log(`Max page alerts: ${maxPageAlerts}`);


        if (!parseInt(localStorage.getItem('max_page_alerts'))) { // Если это первая "установка" и ранее скрипт не был установлен
            console.log("Script is being run for the first time.");
            if (maxPageAlerts > 5) {
                localStorage.setItem('max_page_alerts', (maxPageAlerts-5))
            } else {
            localStorage.setItem('max_page_alerts', (maxPageAlerts-maxPageAlerts))
            }
        }

        const savedMaxPage = parseInt(localStorage.getItem('max_page_alerts'));
        console.log(savedMaxPage)

        if (savedMaxPage && maxPageAlerts > savedMaxPage) {
            const pagesToProcess = maxPageAlerts - savedMaxPage;
            console.log(`New pages: ${pagesToProcess}`);
            localStorage.setItem('max_page_alerts', maxPageAlerts);
            for (let i = savedMaxPage + 1; i <= maxPageAlerts; i++) {
                const notifications = await get_notifications(maxPageAlerts-i+2);
                if (notifications.length > 0) {
                    // Получаем текущее значение yesreports из localStorage или устанавливаем его в 0, если такой записи еще нет
                    let yesreports = parseInt(localStorage.getItem("yesreports")) || 0;
                    // Добавляем к значению yesreports количество новых уведомлений на странице
                    yesreports += notifications.length;
                    // Сохраняем обновленное значение yesreports в localStorage
                    localStorage.setItem("yesreports", yesreports);
                    // Выводим сообщение в консоль
                    console.log(`New notifications on page ${maxPageAlerts - i + 2}: ${notifications.length}. Total yesreports: ${yesreports}`);
                    const lastProcessedElement = notifications[notifications.length - 1];
                    //console.log(lastProcessedElement);
                    localStorage.setItem('lastProcessedElementId', lastProcessedElement.id);
                } else {
                    console.log(`No new notifications on page ${maxPageAlerts-i+2}.`);
                }
            }

        } else {
            const notifications = await get_notifications();
            if (notifications.length > 0) {
                // Получаем текущее значение yesreports из localStorage или устанавливаем его в 0, если такой записи еще нет
                let yesreports = parseInt(localStorage.getItem("yesreports")) || 0;
                // Добавляем к значению yesreports количество новых уведомлений на странице
                yesreports += notifications.length;
                // Сохраняем обновленное значение yesreports в localStorage
                localStorage.setItem("yesreports", yesreports);
                // Выводим сообщение в консоль
                console.log(`New notifications on page 1: ${notifications.length}. Total yesreports: ${yesreports}`);
                const lastProcessedElement = notifications[notifications.length - 1];
                //console.log(lastProcessedElement);
                localStorage.setItem('lastProcessedElementId', lastProcessedElement.id);
            } else {
                console.log('No new notifications on page 1.');
            }
        }

    } catch (error) {
        console.error(error.message);
    }
}

async function get_notifications(page = 1) {
    try {
        const lastProcessedElementId = localStorage.getItem('lastProcessedElementId');
        const response = await fetch(`https://zelenka.guru/account/alerts?page=${page}`);
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, 'text/html');

        let alertElements = Array.from(htmlDocument.querySelectorAll('li.Alert')).reverse();
        let processedElements = [];

        for (let i = 0; i < alertElements.length; i++) {
            const element = alertElements[i];
            if (element.textContent.includes('Жалоба обработана') && element.querySelector('.report_resolved')) {
                if (lastProcessedElementId && element.id <= lastProcessedElementId) {
                    // Skip elements that were already processed.
                    continue;
                }
                processedElements.push(element);
            }
        }

        return processedElements;

    } catch (error) {
        console.error(error.message);
        return [];
    }
}

let profileLink = document.querySelector("#AccountMenu > ul > li:nth-child(1) > a").getAttribute("href").split(`${domain}`)[1];

if (!localStorage.getItem('yesreports')) {
    localStorage.setItem('yesreports', 0);
}

setInterval(get_max_page, 15000);