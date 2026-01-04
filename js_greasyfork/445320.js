// ==UserScript==
// @name         LolzR
// @namespace    https://lolz.guru/
// @version      1
// @description  Выдача баллов за 3.1 - 3.14.
// @author       Shiny
// @match        https://lolz.guru/reports/*
// @icon         https://lolz.guru/favicon.ico
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445320/LolzR.user.js
// @updateURL https://update.greasyfork.org/scripts/445320/LolzR.meta.js
// ==/UserScript==

function injectStyle(style) {
    $(document.head).append($(`<style>${style}</style>`));
}

(function() {
    const buttons = {
        8: {
            name: '3.1-3.14',
            title: "Вы получили 2 балла за нарушение правил 3.1-3.14",
        },
    }
    const _xfToken = document.querySelector('input[name="_xfToken"]').value;

    async function postData(url = '', formData) {
        return await fetch(url, { method: 'POST', body: formData });
    }


    const blocks = document.querySelectorAll('.mainContent .sectionFooter');
    for(let block of blocks) {
        for(let key in buttons) {
            let name = buttons[key].name;
            let title = buttons[key].title;
            let message = buttons[key].message;
            let span = document.createElement('a');
            span.innerText = name;
            span.setAttribute('style', 'font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; margin-top: 10px; line-height: 26px;')
            span.onclick = function() {
                let formData = new FormData();
                formData.append("content_action", "delete_content")
                formData.append("delete_reason", '')
                formData.append("conversation_locked", 1)
                formData.append("warning_definition_id", key)
                formData.append("filled_warning_definition_id", key)
                formData.append("notes", "")
                formData.append("content_type", "post")
                formData.append("conversation_title", title)
                formData.append("conversation_message", `Ваше сообщение ([url=${window.location.origin + '/' + document.querySelector('.mainContent .sectionFooter a:first-child').getAttribute('href')}]${document.querySelector('.titleBar h1').innerText.substring(document.querySelector('.titleBar h1').innerText.indexOf('"'))}[/url]) содержит нарушение:
[quote]${document.querySelector('.mainContent .messageText').innerText}[/quote]

3.0. Мошенничество на форуме запрещено. Мошенничество на других площадках (в т.ч. и мессенджерах) с учетных записей, идентифицирующих вас как пользователя этого форума (одинаковые контакты) запрещено. Будет наложена блокировка до возврата средств истцу.
3.1. Название темы в торговом разделе должно раскрывать суть содержания темы.
3.2. Цена товара/услуги должна обязательно быть указана в теме.
3.3. В теме должно присутствовать описание товара или услуги. Если вы продаете товар, должна идти ссылка на профиль и (или) несколько скриншотов профиля/инвентаря. Указывайте происхождение вещей (брут/личный).
3.4. Запрещены темы по продаже услуг пробива (государственного, мобильного и т.д.).
3.5. Если у человека под аватаркой есть блок "Команда форума", значит, он имеет право проверить ваш товар. Отказ от проверки будет расценен как мошенничество. На момент проверки проверяющий закрывает тему, после - открывает и пишет отзыв о товаре/услуге.
3.6. Занимаясь коммерческой деятельностью на форуме, вы автоматически соглашаетесь на проведение любых сделок через гаранта этого сайта и систему "Безопасная сделка".
3.7. Продавать любые способы, мануалы, обучение за деньги, контакты поставщиков, скупщиков (и им подобных) запрещено, это относится и к магазинам, размещенным на этом форуме.
3.8. Пользователи с группой Новорег, Местный не имеют права размещать темы с продажей услуг/товаров в разделах: "Логи", "Приватный софт", "Скрипты, сайты", "Шип, рефанд", "Вещи, техника", "Прием смс", а также размещать магазины в разделе "Торговля" и его подразделах. Нарушители будут наказаны, а их тема будет удалена. Чтобы получить такую возможность, нужно купить селлера или суприма или прокачать свой аккаунт до группы Постоялец.
3.9 Запрещены темы с услугами о взломе почт, страниц, о продаже ПО для проведения Ddos атак, ботнетов, ддос панелей (стрессеров).
3.10. Запрещены темы, связанные с документами граждан любой страны (продажа сканов, удостоверений, отрисовка поддельных документов).
3.11. Запрещена торговля аккаунтами, гифтами, балансами банков, paypal, amazon, ebay, walmart (а также, кредитными картами), запрещены темы про **** чего-либо с аккаунтов, карт, запрещена продажа товаров, полученных через "****".
3.12. Запрещена продажа/покупка/обмен баланса маркета. Исключение - отсутствие технической возможности вывести средства на QIWI.
3.13. Запрещено продавать паки баз, заточек, АП, т.д и т.п. Исключения - дампы сайтов или разрешение со стороны Администрации форума.
3.14. Темы с продажами профилей от сторонних форумов запрещены.
3.15. Отзыв о товаре или услуге должен содержать доказательства ваших слов: скриншоты переписки, чеки переводов, фотографии выполненных работ. Бездоказательный положительный отзыв будет сразу удален, отрицательный будет висеть до рассмотрения в разделе "Жалобы".

Просим вас в дальнейшем не нарушать текущие правила форума:
[url=http://lolz.guru/rules]http://lolz.guru/rules[/url]

Платное снятие предупреждений:
https://lolz.guru/threads/2611473/

[COLOR=#f13838][B]Не отвечайте на это уведомление[/B][/COLOR]`)
                formData.append("content_id", document.querySelector('.mainContent .sectionFooter a:first-child').getAttribute('href').split('/')[1])
                formData.append("redirect", window.location.href);
                formData.append("_xfToken", _xfToken);
                let username_path = document.querySelector('.secondaryContent .username a').getAttribute('href');
                postData(`/${(username_path.endsWith('/') ? username_path.substring(0, username_path.length - 1): username_path)}/warn`, formData)
                .then(() => window.location = window.location.origin + '/reports/random')
            }
            block.append(span)
        }
    }
})();