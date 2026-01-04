// ==UserScript==
// @name         LZT Support Tickets Addon
// @namespace    https://lolz.live/
// @version      0.1
// @description  Добавление кнопок для ответов и выдачи баллов в тикете
// @author       cursedplayer1g
// @match        https://lolz.guru/support-tickets/*
// @match        https://zelenka.guru/support-tickets/*
// @match        https://lolz.live/support-tickets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @downloadURL https://update.greasyfork.org/scripts/541433/LZT%20Support%20Tickets%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/541433/LZT%20Support%20Tickets%20Addon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const buttons = [
        {
            name: 'Закрыть',
            ru_text: `Благодарим за ваше обращение! Если текущая задача требует дополнительных уточнений, остались нерешенные моменты или возникнут новые вопросы в будущем — будем рады помочь. Не стесняйтесь обращаться в любое время — мы всегда на связи.`,
            en_text: `Thank you for contacting us! If the current task requires additional clarification, there are unresolved issues, or new questions arise in the future — we'll be happy to help. Don't hesitate to reach out at any time — we're always here for you.`
        },
        {
            name: 'подозр операции',
            ru_text: `Здравствуйте, пересоздайте тикет в правильной категории - https://lolz.live/support-tickets/open?department_id=13`,
            en_text: `Hello, please recreate the ticket in the correct category - https://lolz.live/support-tickets/open?department_id=13`
        },
{
            name: 'Валюта',
            ru_text: `Здравствуйте, смена валюты происходит на маркете (lzt.market).
                      <br><br> С пк: верхний правый угол. </br></br>
                      <br><br> С телефона: нажмите на "панель управления", пролистайте чуть ниже - там будет строчка с изменением валюты.</br></br>`,
            en_text: `Hello, currency exchange takes place on the market (lzt.market).
                      <br><br> From the PC: upper right corner. </br></br>
                      <br><br> From your phone: tap on "control panel" and scroll down to the currency change option.</br></br>`
        },
        {
            name: 'Проблемы (оплата)',
            ru_text: `Здравствуйте! По вопросам, связанным с пополнением баланса, обращайтесь по ссылке:
                     <br><br> https://lolz.live/payment/balance/deposit/problem </br></br>`,
            en_text: `Hello! For issues related to balance deposit, please visit:
                     <br><br> https://lolz.live/payment/balance/deposit/problem </br></br>`
        },
        {
            name: 'Капча',
            ru_text: `Здравствуйте!
Вот несколько советов для решения проблемы:

· Включите VPN.
· Используйте качественные прокси.

· Попробуйте сменить браузер.
· Очистите cookies в браузере.

· Попробуйте перезагрузить WiFi.
· Смените провайдера.`,
            en_text: `Hello!
Here are some tips to solve the problem:

· Enable VPN.
· Use high-quality proxies.

· Try switching browsers.
· Clear browser cookies.

· Try restarting your WiFi.
· Change your internet provider.`
        },
        {
            name: 'Неполадки',
            ru_text: `Здравствуйте, в настоящее время у нас возникли технические неполадки, которые могут повлиять на доступ к некоторым услугам. Мы рекомендуем вам проявить терпение и попробовать выполнить ваш запрос позже, когда проблема будет устранена.
                     <br><br> Мы приносим извинения за доставленные неудобства, и благодарим вас за понимание и терпение в данной ситуации. Наша команда работает на исправлением проблемы, чтобы обеспечить вам качественное обслуживание в ближайшее время. </br></br>
                     <br><br> Спасибо за ваше терпение. </br></br>`,
            en_text: `Hello, we are currently experiencing technical issues that may affect access to some services. We recommend that you be patient and try to fulfill your request later, when the problem is resolved.
                     <br><br> We apologize for the inconvenience, and thank you for your understanding and patience in this situation. Our team is working on fixing the issue to provide you with quality service as soon as possible. </br></br>
                     <br><br> Thank you for your patience. </br></br>`
        },
        {
            name: 'Почта',
            ru_text: `Здравствуйте! Пожалуйста, попробуйте повторить попытку немного позже.
                     <br><br> Если проблема не исчезнет, рекомендуем изменить почту. Для этого создайте тикет в категории «Смена почты на форумном аккаунте» </br></br>
                     <br><br> Приносим извинения за возможные неудобства. Спасибо за понимание! </br></br>`,
            en_text: `Hello! Please try again a little later.
                     <br><br> If the problem persists, we recommend that you change your email address. </br></br>
                     <br><br> To do this, create a ticket in the category "Mail change on the forum account" </br></br>
                     <br><br> We apologize for any inconvenience. Thank you for understanding! </br></br>`
        },
        {
            name: 'Секретка',
            ru_text: 'Здравствуйте, для ознакомления с FAQ по секретной фразе, вы можете перейти на данную страницу - https://lolz.live/account/secret-answer. Чтобы сменить секретную фразу, перейдите на ту же страницу и нажмите кнопку "Сменить секретный вопрос". Данный процесс ускорить - нельзя.',
            en_text: 'Hello, for the secret phrase FAQ, you can go to this page - https://lolz.live/account/secret-answer. To change the secret phrase, go to the same page and click "Change secret question" button. This process cannot be accelerated.'
        },
        {
            name: 'Недочеты',
            ru_text: 'Здравствуйте, создайте тему в разделе "Недочеты" https://lolz.live/forums/bugs/create-thread',
            en_text: 'Hello, please create a topic in the "Shortcomings" section https://lolz.live/forums/bugs/create-thread'
        },
        {
            name: 'Арбитраж',
            ru_text: `Здравствуйте! На странице купленного Вами товара присутствует кнопка (через ''троеточие'')  «Открыть денежный спор», нажмите на нее, укажите все доказательства, опишите проблему и создайте спор.`,
            en_text: `Hello! On the page of the product you bought there is a button (through the ''triplet'') "Open a money dispute", click on it, indicate all the evidence, describe the problem and create a dispute.`
        },
        {
            name: 'Забыли пароль',
            ru_text: `Здравствуйте! Зайдите на форум с инкогнито или чистого браузера, нажмите "Войти" и там будет зеленым "Забыли пароль?" Нажмите туда и смените пароль`,
            en_text: `Hello! Go to the forum from an incognito or clean browser, click "Login" and there will be a green "Forgot Password?" box. Click there and change your password.`
        },
        {
            name: 'Продать аккаунт',
            ru_text: `Здравствуйте! Зайдите на страницу маркета, сверху слева будет "Продать аккаунт" (на моб. версии сразу вверху)`,
            en_text: `Hello! Go to the marketplace page, at the top left will be "Sell account" (on the mobile version right at the top)`
        },
        {
            name: 'Ожидание арбитраж',
            ru_text: `Здравствуйте. Заявки на возврат/обжалование/жалобу рассматриваются в зависимости от загруженности раздела (чем больше страниц - тем дольше). Имейте терпение.`,
            en_text: `Hello. Refund/complaint/complaint requests are processed depending on the workload of the section (the more pages - the longer it takes). Please be patient.`
        },
        {
            name: 'ХелпБот',
            ru_text: `Здравствуйте!<br>Для решения вашего вопроса обратитесь в бота t.me/lolz_help_bot`,
            en_text: `Hello!<br>Contact the bot to resolve your issue t.me/lolz_help_bot`
        },
        {
            name: 'Удаление',
            ru_text: `Здравствуйте, это платная услуга.<br>1) Через t.me/hash257 <br> 2) Через t.me/casherino<br>`,
            en_text: `Hello, this is a paid service.<br>1) Via t.me/hash257 <br> 2) Via t.me/casherino<br>`
        },
        {
            "name": "Пополнение",
            "ru_text": "https://lzt.market/payment/balance/deposit<br><br>Все доступные методы пополнения перечислены на странице<br>Нет подходящего способа оплаты?<br>Воспользуйтесь P2P обменом в разделе Обмен средств.<br>Обмен средств происходит между участниками форума.<br>https://lzt.market/forums/1001/<br>[spoiler=Как пользоваться разделом P2P?;align=left][B][SIZE=4]Как пользоваться разделом [URL='https://lolz.live/forums/1001/']P2P[/URL]?[/SIZE][/B]<br><br>[COLOR=rgb(148, 148, 148)]Рассмотрим ситуацию:[/COLOR]<br>У Вас имеется 500 ₽ на банковской карте, но вам нужно пополнить маркет на 500 ₽.<br><br>Вам необходимо перейти в раздел [URL='https://lolz.live/forums/1001/'][B]P2P обменов[/B][/URL]:<br>[spoiler=Скриншот;align=left][IMG=align=left;alt=%5BIMG%5D]https://nztcdn.com/files/6f30b6b0-e6a1-46e7-9ede-4cbb8be62874.webp[/IMG][/spoiler]<br><br>Далее, к примеру, Вы находите тему с заголовком: Заголовок: [500 RUB > 500 RUB] Маркет > СБП.<br>То что нужно! Открываем тему!<br>[spoiler=Скриншот;align=left][IMG=align=left;alt=%5BIMG%5D]https://nztcdn.com/files/2ec66644-caaf-4846-bc9d-4647bc293dd7.webp[/IMG][/spoiler]<br><br>Переходим в тему и наблюдаем, что данный пользователь хочет продать баланс Маркета в размере 500 ₽ в обмен на перевод 500 ₽ по системе СБП (Система Быстрых Платежей).<br>[spoiler=Информация о обмене;align=left]Сумма: 500 RUB → 500 RUB<br>Направление: Маркет(откуда) → СБП(куда)[/spoiler]<br><br>Вас устраивает данное предложение, но перед началом обмена Вам необходимо ознакомиться с важными темами, для того чтобы не попасться в руки мошенникам:<br>[URL]https://lolz.live/threads/7566033/[/URL]<br>[URL]https://lolz.live/threads/7622071/[/URL]<br><br>Также Вам необходимо прочитать правила P2P раздела:<br>[URL]https://lolz.live/threads/7018468/[/URL]<br><br>После прочтения важной информации нажимайте на кнопку «Обменяться»:<br>[spoiler=Скриншот;align=left][IMG=align=left;alt=%5BIMG%5D]https://nztcdn.com/files/3251dee3-032f-448d-bdd1-632531b02f65.webp[/IMG][/spoiler]<br><br>После нажатия на кнопку у вас появится на экране форма отправки сообщения:<br>[spoiler=Скриншот;align=left][IMG=align=left;alt=%5BIMG%5D]https://nztcdn.com/files/6aefb1c7-a4dd-435a-a527-8aeaa9d6a662.webp[/IMG][/spoiler]<br><br>Читаете ваше сообщение, если всё верно — нажимаете кнопку «Отправить», и у Вас открывается диалог с пользователем, который продаёт баланс маркета.<br><br>После пользователь, который создал заявку на обмен, отправляет вам реквизиты для оплаты, в Вашем случае это номер телефона и название банка для перевода по СБП.<br><br>Когда вы отправите средства — предоставьте скриншот чека пользователю, с которым совершали обмен, и вы получите свои средства на маркет.<br><br><br><br>[B][SIZE=4]Что делать если нет подходящих для вас предложений в [URL='https://lolz.live/forums/1001/'][SIZE=4]P2P разделе[/SIZE][/URL]?[/SIZE][/B]<br><br>В таком случае - Вам необходимо создать тему в данном разделе:<br>[UNFURL]https://lolz.live/forums/1001/create-thread[/UNFURL]<br>[spoiler=Скриншот;align=left][IMG=align=left;alt=%5BIMG%5D]https://nztcdn.com/files/a443fb0d-be25-433b-896e-58c6e047bc45.webp[/IMG][/spoiler]<br><br>Внимательно ознакомьтесь со всей страницей, и корректно заполните заявку!<br>[/spoiler]",
            "en_text": "https://lzt.market/payment/balance/deposit<br><br>All available deposit methods are listed on the <br> pageIs there no suitable payment method?<br>Use the P2P exchange in the Funds Exchange section.<br>The exchange of funds takes place between the participants of the forum."
        },
        {
            name: 'КакПополнить',
            ru_text: `Здравствуйте.
                     <br><br> Все доступные методы пополнения указаны на странице – https://lzt.market/balance/deposit. </br></br>
                     <br><br> Если у Вас не получается воспользоваться определенным методом – попробуйте позже или используйте другой метод.</br></br>`,
            en_text: `Hello.
                     <br><br> All available methods of replenishment are specified on the page - https://lzt.market/balance/deposit. </br></br>
                     <br><br> If you are unable to use a certain method - try later or use another method.</br></br>`
        },
        {
            name: 'Обжалование',
            ru_text: `Здравствуйте! Для того чтобы обжаловать блокировку, вам нужно купить платное обжалование.
                      <br> Напишите его в данном разделе - lolz.live/forums/paid-appeals/ </br>
                      <br> По шаблону обжалования - lolz.live/threads/1784938/ </br>`,
            en_text: `Hello! You bought an appeal against the ban.
                      <br> Write it in this section - lolz.live/forums/paid-appeals/ </br>
                      <br> According to the appeal template - lolz.live/threads/1784938/ </br>`
        },
         {
            name: 'VK?',
            ru_text: `Здравствуйте.
                      <br><br> Продажа аккаунтов VK на маркете была закрыта еще 9 марта, подробнее: https://lolz.live/threads/6746777/ </br></br>
                      <br><br> Вы можете найти их у пользователей в данном разделе "Торговля" - "Соц. Сети": https://lolz.live/forums/683/ </br></br>`,
            en_text: `Hello.
                      <br><br> The sale of VK accounts on the marketplace was closed back on March 9, more details: https://lolz.live/threads/6746777/.</br></br>
                      <br><br> You can find them from users in this section "Trade" - "Social Networks": https://lolz.live/forums/683/ </br></br>`
        },
        {
            name: 'ПроксиФорт',
            ru_text: `Здравствуйте.
                      <br> <br> К сожалению, загрузить Fortnite / Epic Games без загрузки своих прокси - нельзя. Для загрузки прокси, перейдите по данной ссылке, и загрузите свои прокси в "Прокси-серверы:" - https://lolz.live/account/market </br> </br>
                      <br> <br> Принимаются только HTTPS IPv4 прокси, мы советуем использовать приватные прокси-сервера. Вы можете купить их здесь: proxyleet.com, proxy.house, o2proxy.com или на другом удобном вам сайте. </br> </br>`,
            en_text: `Hello.
                      <br> <br> Unfortunately, it is not possible to download Fortnite / Epic Games without uploading your proxies. To download proxies, follow this link, and upload your proxies in "Proxy Servers:" - https://lolz.live/account/market.  </br> </br>
                      <br> <br> Only HTTPS IPv4 proxies are accepted, we advise you to use private proxy servers. You can buy them here: proxyleet.com, proxy.house, o2proxy.com or on any other site you like. </br> </br>`
        }
    ];

    // Определение стилей
    const styles = `
   .customBlock {
       background: rgb(39, 39, 39);
       padding: 15px;
   }
   .ticketButton {
       font-weight: bold;
       padding: 3px 10px;
       background: #7c4f4f;
       border-radius: 150px;
       margin-right: 5px;
       line-height: 32px;
       cursor: pointer;
   }
   .pageNavLinkGroup .linkGroup{
       justify-content: normal;
   }
`;

    // Создание элемента <style> и добавление его в <head>
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    function initializeElements() {
        return {
            contentElement: document.getElementById('content'),
            olElement: document.querySelector('#messageList'),
            readToggleButton: document.querySelector('.ReadToggle'),
            submitterNameElement: document.querySelector('.submitterName a'),
            formElement: document.querySelector('.section.statsList form.brstsQuickEdit'),
        };
    }

    function appendCustomButtons(olElement, buttons, xf, ticketId) {
        const newBlock = document.createElement('div');
        newBlock.className = 'customBlock';

        buttons.forEach((button, index) => {
            const newSpan = document.createElement('span');
            newSpan.className = 'ticketButton';
            newSpan.textContent = button.name;

            newSpan.addEventListener('click', (event) => {
                const messageHtml = `[LANG=ru]${button.ru_text}[/LANG][LANG=en]${button.en_text}[/LANG]`;
                const formData = new FormData();
                formData.append('message_html', messageHtml);
                formData.append("_xfResponseType", "json");
                formData.append('_xfToken', xf);

                fetch(`https://lolz.live/support-tickets/${ticketId}/insert-reply`, {
                    method: 'POST',
                    body: formData,
                    redirect: 'manual'
                })
                    .then((response) => {
                        if (response.ok) {
                            XenForo.alert('Ответ отправлен', '', 5000);
                            if (event.ctrlKey || event.altKey) closeTicket(event, xf, ticketId);
                        }
                    })
                    .catch(error => console.error('Ошибка:', error));
            });

            newBlock.appendChild(newSpan);

            if (index % 8 === 6) newBlock.appendChild(document.createElement('br'));
        });

        olElement.parentNode.insertBefore(newBlock, olElement.nextSibling);
    }

    function closeTicket(event, xf, ticketId) {
        const closeFormData = new FormData();
        closeFormData.append('_xfToken', xf);
        closeFormData.append('_xfConfirm', '1');
        if (event.altKey) closeFormData.append('is_primary_close', '1');

        fetch(`https://lolz.live/support-tickets/${ticketId}/close`, {
            method: 'POST',
            body: closeFormData,
            redirect: 'manual'
        })
            .then(response => {
                if (response.ok) XenForo.alert('Тикет закрыт', '', 5000);
            })
            .catch(error => console.error('Ошибка:', error));
    }

    function createAndInsertWarnButton(readToggleButton, xf, userId) {
        const warnButton = document.createElement('a');
        warnButton.href = '';
        warnButton.className = 'button';
        warnButton.textContent = 'Выдать баллы';

        warnButton.addEventListener('click', (event) => {
            event.preventDefault();
            warnUser(xf, userId);
        });

        readToggleButton.parentNode.insertBefore(warnButton, readToggleButton.nextSibling);
    }


    function warnUser(xf, userId) {
        const formData = new FormData();
        formData.append('warning_definition_id', 55);
        formData.append('expiry_enable', 1);
        formData.append('expiry_value', 1);
        formData.append('expiry_unit', 'weeks');
        formData.append('notes', '');
        formData.append('conversation_title', 'Абуз тикетов');
        formData.append('conversation_message', 'Уважаемый пользователь, вам были выданы баллы за абуз тикетов. Данное предупреждение будет автоматически снято с вашего аккаунта спустя 7 дней с момента выдачи.');
        formData.append('content_type', 'user');
        formData.append('content_id', userId);
        formData.append('filled_warning_definition_id', 55);
        formData.append('_xfToken', xf);

        fetch(`https://lolz.live/members/${userId}/warn`, {
            method: 'POST',
            body: formData,
            redirect: 'manual'
        })
            .then(response => {
                XenForo.alert('Баллы успешно выданы', '', 3000);
            })
            .catch(error => console.error('Ошибка:', error));
    }

    const elements = initializeElements();

    if (!elements.contentElement || !elements.contentElement.classList.contains('BRSTS_support_ticket_view')) return;

    const userIdMatch = elements.submitterNameElement.href.match(/members\/(\d+)\//);
    if (!userIdMatch) return;

    const userId = userIdMatch[1];
    const action = elements.formElement && elements.formElement.action;
    const ticketId = action && action.split('/').slice(-2, -1)[0];
    const xf = XenForo._csrfToken;

    appendCustomButtons(elements.olElement, buttons, xf, ticketId);
    createAndInsertWarnButton(elements.readToggleButton, xf, userId);

    let closeTicketButton = document.querySelector('.pageNavLinkGroup .linkGroup .callToAction');
    if (!closeTicketButton) return;

    let readToggleButton = document.querySelector('.pageNavLinkGroup .linkGroup .ReadToggle');
    if (!readToggleButton) return;

    readToggleButton.parentNode.insertBefore(closeTicketButton, readToggleButton.nextSibling);

    let parentOfCloseTicketButton = closeTicketButton.closest('.pageNavLinkGroup');
    XenForo.activate($(parentOfCloseTicketButton));

})();