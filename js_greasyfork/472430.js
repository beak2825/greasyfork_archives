// ==UserScript==
// @name         Цыганский перевод LZT
// @namespace    https://zelenka.guru/m0nesy/
// @version      0.1
// @description  Заменяет русский язык на цыганский перевод. (не закончено до конца)
// @author       m0NESY
// @match        *://zelenka.guru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472430/%D0%A6%D1%8B%D0%B3%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/472430/%D0%A6%D1%8B%D0%B3%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var replacements = [
        { original: 'Создать тему', replacement: 'Кэрэс тэ обсэндякирибэн' },
        { original: 'Все обсуждения', replacement: 'Уса обсэндякирибэн' },
        { original: 'Мои темы', replacement: 'Мирэ обсэндякирибэн' },
        { original: 'Прочитанные темы', replacement: 'Рят гинэс тэ обсэндякирибэн' },
        { original: 'Закладки', replacement: 'Из-лэс те' },
        { original: 'Создать вкладку', replacement: 'Кэрэс тэ патрин' },
        { original: 'Маркет', replacement: 'Бандза' },
        { original: 'Статьи', replacement: 'Роспхэныбэн' },
        { original: 'Гарант', replacement: 'Ракхибэн ром' },
        { original: 'Соц. сети', replacement: 'Кхэтаныбэн' },
        { original: 'Другое', replacement: 'Вавир' },
        { original: 'Халява', replacement: 'Бигасталя' },
        { original: 'Торговля', replacement: 'Бикныбэн' },
        { original: 'Работа и услуги', replacement: 'Буты тэ миштыпэн кэрибэн' },
        { original: 'Арбитраж', replacement: 'Сэндо' },
        { original: 'Наш канал в Telegram', replacement: 'Аморо кхэтаныбэн в Telegram' },
        { original: 'Общий чат в Telegram', replacement: 'Кхэтано обкхэтаныбэн в Telegram' },
        { original: 'Группа ВКонтакте', replacement: 'Кхэтаныбын ВКонтакте' },
        { original: 'Наш Discord сервер', replacement: 'Аморо Discord кхэтаныбэн' },
        { original: 'Не пришли деньги?', replacement: 'На долэс тэ гасталя?' },
        { original: 'Нужна помощь', replacement: 'Чебима рикирибэн' },
        { original: 'Правила форума', replacement: 'Чебима кэрибэн форум' },
        { original: 'Пользователи', replacement: 'LOLZTEAM рома' },
        { original: 'Заблокированные', replacement: 'Фуипэн рома LOLZTEAM' },
        { original: 'Основной раздел', replacement: 'Шаранд розлэс тэ' },
        { original: 'Тематический раздел', replacement: 'Лэскиро тема розлэс тэ' },
        { original: 'Обсуждение игр и читы', replacement: 'Обсэндякирибэн кхэлэс тэ читы' },
        { original: 'Общий раздел', replacement: 'Кхэтано розлэс тэ' },
        { original: 'Тематические вопросы', replacement: 'Лэскиро тема пчухибэн' },
        { original: 'Спроси у ChatGPT', replacement: 'Пчухэс тэ у ChatGPT' },
        { original: 'Остальные игры', replacement: 'Вавир кхэлэс' },
        { original: 'Оффтопик', replacement: 'Би-тема розлэс тэ' },
        { original: 'Веб-разработка', replacement: 'Веб-розбутякирибэн' },
        { original: 'Жизнь форума', replacement: 'Форума джиибэн' },
        { original: 'Тестовый раздел', replacement: 'Пропатякирибэн розлэс тэ' },
        { original: 'Остальные', replacement: 'Явир' },
        { original: 'Все', replacement: 'Уса' },
        { original: 'назад', replacement: 'палэ' },
        { original: 'Главный дизайнер', replacement: 'Шэруно дизайнер' },
        { original: 'Арбитр', replacement: 'Сэндари' },
        { original: 'Модератор', replacement: 'Ракхибэн ром' },
        { original: 'Главный модератор', replacement: 'Шэруно ракхибэн ром' },
        { original: 'Администратор', replacement: 'Шэруно на форум' },
        { original: 'Прочее', replacement: 'Вавир' },
        { original: 'О нас', replacement: 'О амэнгэ' },
        { original: 'Связаться с нами', replacement: 'Спхандэс тэ с амэнгэ' },
        { original: 'Почта для жалоб:', replacement: 'Дромитко для холы:' },
        { original: 'Показать все переписки', replacement: 'Дыкхэс тэ уса обсэндякирибэн' },
        { original: 'Меценат форума', replacement: 'Рикирибэн ром форума' },
        { original: 'Набери еще', replacement: 'Долэс тэ инка' },
        { original: 'симпатий, и ты сможешь', replacement: 'симпатий, тэ могинэс тэ' },
        { original: 'Платное повышение прав', replacement: 'Долэс тэ права за гасталя' },
        { original: 'Следующая группа:', replacement: 'Следующий обкхэтаныбэн' },
        { original: 'Только что', replacement: 'Акакана' },
        { original: 'Автор темы', replacement: 'Тема чиныбнари' },
        { original: 'Подписаться на тему', replacement: 'Прикхэтанякирэспэ тэ на тема' },
        { original: 'Поиск', replacement: 'Родыбэн' },
        { original: 'Тема в разделе', replacement: 'Тема в розлэс тэ' },
        { original: 'создана пользователем', replacement: 'кэрэс тэ ром' },
        { original: 'просмотр', replacement: 'продыкхибэн' },
        { original: 'просмотра', replacement: 'продыкхибэна' },
        { original: 'просмотров', replacement: 'продыкхибэна' },
        { original: 'Вчера', replacement: 'Атася' },
        { original: 'Сегодня', replacement: 'Ададывэс' },
        { original: 'Пожаловаться', replacement: 'Поракирэс тэ фуипэн' },
        { original: 'Розыгрыши', replacement: 'Выдэс тэ гасталя' },
        { original: 'Раздачи баз', replacement: 'Выдэс тэ базы' },
        { original: 'Раздачи аккаунтов, ключей', replacement: 'Выдэс тэ аккаунты, клыдына' },
        { original: 'Раздачи вещей Steam', replacement: 'Выдэс тэ Steam вещи' },
        { original: 'Раздачи прокси', replacement: 'Выдэс тэ прокси' },
        { original: 'Раздачи логов', replacement: 'Выдэс тэ логи' },
        { original: 'Раздачи дедиков', replacement: 'Выдэс тэ дедики' },
        { original: 'Подарки, стикеры ВК', replacement: 'Дарискирэс, стикеры ВК' },
        { original: 'Бесплатная накрутка', replacement: 'Накрутка би-гасталя' },
        { original: 'Игры', replacement: 'Кхэлыбэна' },
        { original: 'Кошельки, верификация', replacement: 'Траминэнгирэ, верификация' },
        { original: 'Задания за деньги', replacement: 'Кэрэс тэ за гасталя' },
        { original: 'Ищу работу', replacement: 'Родыбэн буты' },
        { original: 'Выйти', replacement: 'Уджас тэ' },
        { original: 'Ваши истории', replacement: 'Тумарэ роспхэныбэн' },
        { original: 'Ваши сайты', replacement: 'Тумарэ сайты' },
        { original: 'Просматривают тему', replacement: 'Тема дыкхэс тэ' },
        { original: 'эту тему за месяц', replacement: 'ада тема за шён' },
        /* почему то не работает
        { original: 'Причина жалобы:', replacement: 'Шаранд поракирэс тэ фуипэн:' },
        { original: 'Флуд / Оффтоп / Спам / Бесполезная тема', replacement: 'Флуд / Оффтоп / Спам / Тема бимишто' },
        { original: 'Просьба личного в теме', replacement: 'Мангипэн муй в теме' },
        { original: 'Неправильное поднятие темы', replacement: 'На отдымо поднятие темы' },
        { original: 'Неправильное оформление темы', replacement: 'На отдымо вид темы' },
        { original: 'Создание темы в несоответствующем разделе', replacement: 'Кэрэс тэ тема в на отпхэнэс тэ розлэс тэ' },
        { original: 'Выпрашивание симпатий', replacement: 'Симпатий мангипэн' },
        { original: 'Неуважительное поведение к пользователю', replacement: 'На патыв джаибэн к рому' },
        { original: 'Попрошайничество', replacement: 'Фуипэн мангипэн' },
        */
        { original: 'Изменено', replacement: 'Спаруибэн' },
        { original: 'Редактировать', replacement: 'Пирипарувэс тэ' },
        { original: 'Скрытый контент.', replacement: 'На дычёс тэ контент.' },
        { original: 'Заголовок:', replacement: 'Кхарибэн:' },
        { original: 'Сформулируйте в нескольких словах о чем ваша тема', replacement: 'Выдуминэс тэ в вари-кицы лава соскэ тумари тема' },
        { original: 'Несколько тегов могут быть разделены запятыми.', replacement: 'Вари-кицы теги могинэс тэ розмарэслэ тэ нанглорэ.' },
        { original: 'Могут отвечать в теме:', replacement: 'Могинэс тэ отпхэнэс тэ в теме:' },
        { original: 'Если выбрано "Никто", то в теме смогут отвечать только вы и команда форума'
         , replacement: 'Коли выкэдэно "Након", то в теме могинэс тэ отпхэнэс тэ только тумэ тэ обкхэтаныбэн форума' },
        { original: 'Никто', replacement: 'Након' },
        { original: 'и выше', replacement: 'и учедыр' },
        { original: 'Разрешить комментировать сообщения, если нет прав писать сообщения'
         , replacement: 'Дэс воля отпхэнэс тэ лава, коли нат прав чинэс тэ лава' },
        { original: 'Для просмотра информации необходимо', replacement: 'Для продыкхибен лава чебима' },
    ];

    function replaceTextInNode(node) {
        let text = node.textContent;
        for (const replacement of replacements) {
            const regex = new RegExp(replacement.original, 'g');
            text = text.replace(regex, replacement.replacement);
        }
        node.textContent = text;
    }

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            replaceTextInNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const childNode of node.childNodes) {
                traverseNodes(childNode);
            }
        }
    }

    traverseNodes(document.body);

    var newBackgroundImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_the_Romani_people.svg/1599px-Flag_of_the_Romani_people.svg.png';
    var bodyElement = document.querySelector('body');
    bodyElement.style.backgroundImage = 'url(' + newBackgroundImage + ')';

    window.addEventListener('load', function(){var button = document.createElement('div');
    button.innerHTML='<a class="button primary full">Обновить перевод</a>';
    button.style.float = 'right';
    button.style.marginTop = '-40px';
    document.querySelector('.pageWidth.withSearch').appendChild(button);
    button.addEventListener('click', function() {
        traverseNodes(document.body);
    });});
})();
