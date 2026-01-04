// ==UserScript==
// @name         LOLZ Inline Assistant
// @namespace    http://tampermonkey.net/
// @namespace    http://tampermonkey.net/
// @author       @umikud
// @version      1.2
// @description  inline
// @match        https://*.lolz.live/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534947/LOLZ%20Inline%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/534947/LOLZ%20Inline%20Assistant.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sectionsDict = {
    "Android": "https://lolz.live/forums/437/",
    "Apex Legends": "https://lolz.live/forums/apex-legends/",
    "Battle.net": "https://lolz.live/forums/688/",
    "Battlefield": "https://lolz.live/forums/battlefield-all/",
    "Battlefield 1": "https://lolz.live/forums/759/",
    "Battlefield 2042": "https://lolz.live/forums/920/",
    "Battlefield V": "https://lolz.live/forums/821/",
    "C#": "https://lolz.live/forums/97/",
    "C/C++": "https://lolz.live/forums/96/",
    "Call of Duty": "https://lolz.live/forums/418/",
    "Counter-Strike 2": "https://lolz.live/forums/cs2/",
    "CrackME / UnpackME": "https://lolz.live/forums/872/",
    "DayZ": "https://lolz.live/forums/998/",
    "Deadlock": "https://lolz.live/forums/deadlock/",
    "Discord": "https://lolz.live/forums/898/",
    "Dota 2": "https://lolz.live/forums/dota2/",
    "EFT: Arena": "https://lolz.live/forums/1000/",
    "Escape from Tarkov": "https://lolz.live/forums/857/",
    "FIFA": "https://lolz.live/forums/946/",
    "Fortnite": "https://lolz.live/forums/790/",
    "Fortnite, Epic Games": "https://lolz.live/forums/800/",
    "GTA": "https://lolz.live/forums/981/",
    "GTA SAMP": "https://lolz.live/forums/139/",
    "GTA V": "https://lolz.live/forums/141/",
    "GTA V MODS": "https://lolz.live/forums/669/",
    "Genshin Impact": "https://lolz.live/forums/genshin-impact/",
    "Go": "https://lolz.live/forums/1016/",
    "HTML шаблоны, лендинги": "https://lolz.live/forums/694/",
    "HTML, CSS, Javascript": "https://lolz.live/forums/820/",
    "Hash": "https://lolz.live/forums/hash/",
    "Honkai Star Rail": "https://lolz.live/forums/honkai-star-rail/",
    "Kali  Linux": "https://lolz.live/forums/713/",
    "League of Legends": "https://lolz.live/forums/130/",
    "Linux": "https://lolz.live/forums/588/",
    "Malware": "https://lolz.live/forums/343/",
    "Minecraft": "https://lolz.live/forums/729/",
    "Node.js": "https://lolz.live/forums/867/",
    "Origin (EA)": "https://lolz.live/forums/origin/",
    "Overwatch 2": "https://lolz.live/forums/967/",
    "P2P обмены": "https://lolz.live/forums/1001/",
    "PHP, MySQL": "https://lolz.live/forums/510/",
    "PSN": "https://lolz.live/forums/psn/",
    "PUBG": "https://lolz.live/forums/767/",
    "Private Keeper, BAS, OB": "https://lolz.live/forums/818/",
    "Python": "https://lolz.live/forums/830/",
    "Rainbow Six Siege": "https://lolz.live/forums/1036/",
    "Roblox": "https://lolz.live/forums/1019/",
    "Roblox Studio": "https://lolz.live/forums/1034/",
    "Rocket League": "https://lolz.live/forums/869/",
    "Rust": "https://lolz.live/forums/rust/",
    "S.T.A.L.K.E.R.": "https://lolz.live/forums/560/",
    "S.T.A.L.K.E.R. 2": "https://lolz.live/forums/1032/",
    "SAMP": "https://lolz.live/forums/690/",
    "SEO, продвижение": "https://lolz.live/forums/95/",
    "SMM": "https://lolz.live/forums/746/",
    "SMM Instagram": "https://lolz.live/forums/748/",
    "SMM ВКонтакте": "https://lolz.live/forums/747/",
    "SQLI, Dork Parsers": "https://lolz.live/forums/sqli/",
    "Social Club": "https://lolz.live/forums/720/",
    "Steam": "https://lolz.live/forums/steam/",
    "Supercell": "https://lolz.live/forums/892/",
    "Team Fortress 2": "https://lolz.live/forums/983/",
    "The Finals": "https://lolz.live/forums/982/",
    "Uplay": "https://lolz.live/forums/uplay/",
    "VR игры": "https://lolz.live/forums/944/",
    "Valorant": "https://lolz.live/forums/914/",
    "War Thunder": "https://lolz.live/forums/1037/",
    "Warface": "https://lolz.live/forums/warface/",
    "Wi-Fi": "https://lolz.live/forums/749/",
    "Windows": "https://lolz.live/forums/109/",
    "World of Tanks": "https://lolz.live/forums/689/",
    "YouTube, Twitch": "https://lolz.live/forums/839/",
    "Zenless Zone Zero": "https://lolz.live/forums/zenless-zone-zero/",
    "iOS": "https://lolz.live/forums/436/",
    "macOS": "https://lolz.live/forums/794/",
    "miHoYo": "https://lolz.live/forums/990/",
    "osu!": "https://lolz.live/forums/870/",
    "Авто, мото": "https://lolz.live/forums/961/",
    "Автореггеры": "https://lolz.live/forums/267/",
    "Авторские курсы": "https://lolz.live/forums/906/",
    "Акки с балансом, бонусами": "https://lolz.live/forums/806/",
    "Аниме": "https://lolz.live/forums/835/",
    "Анонимность": "https://lolz.live/forums/311/",
    "Арбитраж": "https://lolz.live/forums/arbitrage/",
    "Баги Warface": "https://lolz.live/forums/536/",
    "Баги, скрипты Apex Legends": "https://lolz.live/forums/934/",
    "Баги, скрипты для Dota 2": "https://lolz.live/forums/227/",
    "Базы, запросы с почт": "https://lolz.live/forums/431/",
    "Безопасность": "https://lolz.live/forums/745/",
    "Бесплатная графика": "https://lolz.live/forums/833/",
    "Бесплатная накрутка": "https://lolz.live/forums/851/",
    "Бесплатная разработка": "https://lolz.live/forums/1039/",
    "Брут, чекеры": "https://lolz.live/forums/110/",
    "Буст аккаунтов": "https://lolz.live/forums/664/",
    "Валюта Escape from  Tarkov": "https://lolz.live/forums/919/",
    "Ваше творчество": "https://lolz.live/forums/845/",
    "Ваши истории": "https://lolz.live/forums/819/",
    "Ваши работы": "https://lolz.live/forums/372/",
    "Ваши сайты": "https://lolz.live/forums/838/",
    "Веб уязвимости": "https://lolz.live/forums/392/",
    "Веб-разработка": "https://lolz.live/forums/85/",
    "Вещи, техника": "https://lolz.live/forums/912/",
    "Видео Battlefield 1": "https://lolz.live/forums/924/",
    "Видео Battlefield 2042": "https://lolz.live/forums/922/",
    "Видео Battlefield V": "https://lolz.live/forums/923/",
    "Видео DeadLock": "https://lolz.live/forums/1030/",
    "Видео GTA V": "https://lolz.live/forums/175/",
    "Видео League of Legends": "https://lolz.live/forums/219/",
    "Видео Minecraft": "https://lolz.live/forums/204/",
    "Видео Rocket League": "https://lolz.live/forums/973/",
    "Видео SAMP": "https://lolz.live/forums/171/",
    "Видео Valorant": "https://lolz.live/forums/978/",
    "Видео Warface": "https://lolz.live/forums/77/",
    "Видео World of Tanks": "https://lolz.live/forums/215/",
    "Вирусология": "https://lolz.live/forums/752/",
    "Вопрос - Ответ": "https://lolz.live/forums/899/",
    "Воркеры": "https://lolz.live/forums/workers_deleted/",
    "Вторичка": "https://lolz.live/forums/913/",
    "Вторичка дедиков, хостингов": "https://lolz.live/forums/932/",
    "Вторичка софта": "https://lolz.live/forums/671/",
    "Вторичка читов": "https://lolz.live/forums/929/",
    "Вязка каналов": "https://lolz.live/forums/948/",
    "Гайды Apex Legends": "https://lolz.live/forums/878/",
    "Гайды Battlefield 1": "https://lolz.live/forums/887/",
    "Гайды Battlefield 2042": "https://lolz.live/forums/921/",
    "Гайды Battlefield V": "https://lolz.live/forums/886/",
    "Гайды CS2": "https://lolz.live/forums/36/",
    "Гайды Call of Duty": "https://lolz.live/forums/881/",
    "Гайды DayZ": "https://lolz.live/forums/1020/",
    "Гайды DeadLock": "https://lolz.live/forums/1031/",
    "Гайды Escape from Tarkov": "https://lolz.live/forums/885/",
    "Гайды FIFA": "https://lolz.live/forums/970/",
    "Гайды Fortnite": "https://lolz.live/forums/792/",
    "Гайды Genshin Impact": "https://lolz.live/forums/891/",
    "Гайды Honkai Star Rail": "https://lolz.live/forums/994/",
    "Гайды Overwatch 2": "https://lolz.live/forums/968/",
    "Гайды PUBG": "https://lolz.live/forums/768/",
    "Гайды Rocket League": "https://lolz.live/forums/888/",
    "Гайды Rust": "https://lolz.live/forums/883/",
    "Гайды SAMP": "https://lolz.live/forums/170/",
    "Гайды Supercell": "https://lolz.live/forums/893/",
    "Гайды Valorant": "https://lolz.live/forums/917/",
    "Гайды Warface": "https://lolz.live/forums/76/",
    "Гайды World of Tanks": "https://lolz.live/forums/214/",
    "Гайды Zenless Zone Zero": "https://lolz.live/forums/1005/",
    "Гайды osu!": "https://lolz.live/forums/877/",
    "Гайды по VR играм": "https://lolz.live/forums/959/",
    "Гайды по форуму": "https://lolz.live/forums/7/",
    "Гайды, рецепты Minecraft": "https://lolz.live/forums/201/",
    "Гайды, тактики по Dota 2": "https://lolz.live/forums/228/",
    "Гайды, тактики по GTA V": "https://lolz.live/forums/176/",
    "Гайды, тактики по LoL": "https://lolz.live/forums/218/",
    "Гифты, ключи, балансы Steam": "https://lolz.live/forums/728/",
    "Графика": "https://lolz.live/forums/88/",
    "Движки, фреймворки": "https://lolz.live/forums/93/",
    "Девайсы": "https://lolz.live/forums/837/",
    "Дедики, хостинги": "https://lolz.live/forums/763/",
    "Дизайн": "https://lolz.live/forums/design/",
    "Дополнения": "https://lolz.live/forums/976/",
    "Другие игры": "https://lolz.live/forums/816/",
    "Другое": "https://lolz.live/forums/815/",
    "Жалобы": "https://lolz.live/forums/801/",
    "Жизнь форума": "https://lolz.live/forums/4/",
    "Завершенные P2P обмены": "https://lolz.live/forums/1013/",
    "Завершенные розыгрыши": "https://lolz.live/forums/771/",
    "Задания за деньги": "https://lolz.live/forums/834/",
    "Игры": "https://lolz.live/forums/682/",
    "Инвентарь Steam": "https://lolz.live/forums/726/",
    "Инсталлы, крипт": "https://lolz.live/forums/595/",
    "Интервью": "https://lolz.live/forums/interviews/",
    "Исходники": "https://lolz.live/forums/696/",
    "Ищу работу": "https://lolz.live/forums/832/",
    "Ищу софт": "https://lolz.live/forums/718/",
    "Карты и скины osu!": "https://lolz.live/forums/905/",
    "Кино и мультфильмы": "https://lolz.live/forums/873/",
    "Кисти, текстуры, градиенты": "https://lolz.live/forums/698/",
    "Компьютеры": "https://lolz.live/forums/587/",
    "Конкурсы и турниры": "https://lolz.live/forums/107/",
    "Конфиги CS2": "https://lolz.live/forums/38/",
    "Кошельки, верификация": "https://lolz.live/forums/817/",
    "Криптовалюты": "https://lolz.live/forums/780/",
    "Крипторы": "https://lolz.live/forums/347/",
    "Кулинария": "https://lolz.live/forums/cookery/",
    "Логи": "https://lolz.live/forums/810/",
    "Модификации World of Tanks": "https://lolz.live/forums/213/",
    "Моды SAMP": "https://lolz.live/forums/722/",
    "Моды, текстуры для Minecraft": "https://lolz.live/forums/202/",
    "Музыкальные утечки": "https://lolz.live/forums/862/",
    "Накрутка в соц. сетях": "https://lolz.live/forums/593/",
    "Недочеты": "https://lolz.live/forums/bugs/",
    "Нейросети": "https://lolz.live/forums/neural-networks/",
    "Неоплаченные претензии": "https://lolz.live/forums/918/",
    "Новости сайта": "https://lolz.live/forums/265/",
    "Обмен средств": "https://lolz.live/forums/805/",
    "Озвучка": "https://lolz.live/forums/863/",
    "Остальные игры": "https://lolz.live/forums/760/",
    "Ответы ЕГЭ и ОГЭ, ЗНО 2025": "https://lolz.live/forums/otvety-ege-oge-25/",
    "Оценка товара": "https://lolz.live/forums/381/",
    "Палата №8 (Оффтоп)": "https://lolz.live/forums/8/",
    "Парсеры": "https://lolz.live/forums/275/",
    "Плагины и сборки Minecraft": "https://lolz.live/forums/251/",
    "Платные обжалования": "https://lolz.live/forums/paid-appeals/",
    "Подарки в соц. сетях": "https://lolz.live/forums/840/",
    "Поиск исполнителей": "https://lolz.live/forums/975/",
    "Поиск отработчиков": "https://lolz.live/forums/1007/",
    "Полезное ПО": "https://lolz.live/forums/1044/",
    "Пополнение баланса": "https://lolz.live/forums/1014/",
    "Почты": "https://lolz.live/forums/814/",
    "Предложения": "https://lolz.live/forums/suggestions/",
    "Приватные читы": "https://lolz.live/forums/263/",
    "Приватный софт": "https://lolz.live/forums/345/",
    "Приём смс": "https://lolz.live/forums/925/",
    "Проблемы с VR играми": "https://lolz.live/forums/960/",
    "Проблемы с загрузкой аккаунтов": "https://lolz.live/forums/account-upload-issues/",
    "Проблемы с игрой Apex Legends": "https://lolz.live/forums/933/",
    "Проблемы с игрой Call of Duty": "https://lolz.live/forums/958/",
    "Проблемы с игрой DayZ": "https://lolz.live/forums/1029/",
    "Проблемы с игрой Escape from Tarkov": "https://lolz.live/forums/941/",
    "Проблемы с игрой FIFA": "https://lolz.live/forums/971/",
    "Проблемы с игрой Fortnite": "https://lolz.live/forums/987/",
    "Проблемы с игрой GTA V": "https://lolz.live/forums/179/",
    "Проблемы с игрой Genshin Impact": "https://lolz.live/forums/939/",
    "Проблемы с игрой Honkai Star Rail": "https://lolz.live/forums/995/",
    "Проблемы с игрой League of Legends": "https://lolz.live/forums/221/",
    "Проблемы с игрой Minecraft": "https://lolz.live/forums/205/",
    "Проблемы с игрой Rust": "https://lolz.live/forums/942/",
    "Проблемы с игрой SAMP": "https://lolz.live/forums/172/",
    "Проблемы с игрой Valorant": "https://lolz.live/forums/980/",
    "Проблемы с игрой Warface": "https://lolz.live/forums/79/",
    "Проблемы с игрой Zenless Zone Zero": "https://lolz.live/forums/1006/",
    "Проблемы с игрой osu!": "https://lolz.live/forums/945/",
    "Программирование": "https://lolz.live/forums/733/",
    "Прокси чекеры": "https://lolz.live/forums/278/",
    "Прокси-серверы": "https://lolz.live/forums/1003/",
    "Промокоды": "https://lolz.live/forums/897/",
    "Прошивки": "https://lolz.live/forums/1047/",
    "Психология": "https://lolz.live/forums/903/",
    "Работа и услуги": "https://lolz.live/forums/105/",
    "Работа с базами": "https://lolz.live/forums/277/",
    "Работа с видео": "https://lolz.live/forums/91/",
    "Работа с дедиками": "https://lolz.live/forums/374/",
    "Работа с логами": "https://lolz.live/forums/926/",
    "Работа с текстом": "https://lolz.live/forums/391/",
    "Работа с хэшами": "https://lolz.live/forums/586/",
    "Раздачи аккаунтов, ключей": "https://lolz.live/forums/21/",
    "Раздачи баз": "https://lolz.live/forums/444/",
    "Раздачи вещей Steam": "https://lolz.live/forums/849/",
    "Раздачи дедиков": "https://lolz.live/forums/762/",
    "Раздачи логов": "https://lolz.live/forums/848/",
    "Раздачи прокси": "https://lolz.live/forums/566/",
    "Раздел для кураторов": "https://lolz.live/forums/911/",
    "Рассмотренные вопросы": "https://lolz.live/forums/902/",
    "Рассмотренные недочеты": "https://lolz.live/forums/827/",
    "Рассмотренные предложения": "https://lolz.live/forums/809/",
    "Реверсинг / Assembler": "https://lolz.live/forums/584/",
    "Реклама": "https://lolz.live/forums/962/",
    "Ресурсы": "https://lolz.live/forums/608/",
    "Решенные жалобы": "https://lolz.live/forums/803/",
    "Решенные претензии": "https://lolz.live/forums/774/",
    "Розыгрыши": "https://lolz.live/forums/contests/",
    "Серверы Minecraft": "https://lolz.live/forums/203/",
    "Сигны": "https://lolz.live/forums/868/",
    "Скрипты сайтов": "https://lolz.live/forums/650/",
    "Скрипты, боты": "https://lolz.live/forums/685/",
    "Слив фотографий 18+": "https://lolz.live/forums/media-leaks18/",
    "Софт": "https://lolz.live/forums/607/",
    "Софт для графики": "https://lolz.live/forums/92/",
    "Соц. сети": "https://lolz.live/forums/683/",
    "Социальная инженерия": "https://lolz.live/forums/743/",
    "Социальные сети": "https://lolz.live/forums/757/",
    "Спамеры, бомберы": "https://lolz.live/forums/276/",
    "Спорт": "https://lolz.live/forums/904/",
    "Способы заработка": "https://lolz.live/forums/363/",
    "Спроси у ChatGPT": "https://lolz.live/forums/ask-chatgpt/",
    "Сталкер: Зов припяти": "https://lolz.live/forums/561/",
    "Сталкер: Тень Чернобыля": "https://lolz.live/forums/562/",
    "Сталкер: Чистое Небо": "https://lolz.live/forums/563/",
    "Статьи": "https://lolz.live/forums/421/",
    "Телефоны": "https://lolz.live/forums/435/",
    "Тематические вопросы": "https://lolz.live/forums/585/",
    "Тестовый раздел": "https://lolz.live/forums/test-forum/",
    "Торговля": "https://lolz.live/forums/104/",
    "Трафферы": "https://lolz.live/forums/936/",
    "Уроки": "https://lolz.live/forums/823/",
    "Уроки по анимациям": "https://lolz.live/forums/393/",
    "Уроки реверсинга": "https://lolz.live/forums/601/",
    "Учеба": "https://lolz.live/forums/853/",
    "Фишинг": "https://lolz.live/forums/855/",
    "Халява": "https://lolz.live/forums/9/",
    "Хостинг, аренда магазина": "https://lolz.live/forums/596/",
    "Чек игрового инвентаря": "https://lolz.live/forums/909/",
    "Чек криптовалюты": "https://lolz.live/forums/908/",
    "Чек логов, баз": "https://lolz.live/forums/597/",
    "Читы Apex Legends": "https://lolz.live/forums/828/",
    "Читы CS2": "https://lolz.live/forums/785/",
    "Читы Call of Duty": "https://lolz.live/forums/901/",
    "Читы DayZ": "https://lolz.live/forums/1028/",
    "Читы Dota 2": "https://lolz.live/forums/858/",
    "Читы Escape from Tarkov": "https://lolz.live/forums/884/",
    "Читы Fortnite": "https://lolz.live/forums/791/",
    "Читы PUBG": "https://lolz.live/forums/784/",
    "Читы Rust": "https://lolz.live/forums/900/",
    "Читы SAMP": "https://lolz.live/forums/518/",
    "Читы Valorant": "https://lolz.live/forums/916/",
    "Читы Warface": "https://lolz.live/forums/75/",
    "Читы для Android игр": "https://lolz.live/forums/783/",
    "Читы для игр miHoYo": "https://lolz.live/forums/966/",
    "Читы, баги Minecraft": "https://lolz.live/forums/200/",
    "Читы, баги для GTA V": "https://lolz.live/forums/177/",
    "Читы, баги для League of Legends": "https://lolz.live/forums/217/",
    "Шип, рефанд": "https://lolz.live/forums/841/",
    "Шрифты": "https://lolz.live/forums/697/",
    "Юмор": "https://lolz.live/forums/874/",
};

    const cryptoSymbols = {
    btc: 'bitcoin',
    eth: 'ethereum',
    ton: 'the-open-network',
    usdt: 'tether',
    usdc: 'usd-coin',
    bnb: 'binancecoin',
    sol: 'solana',
    xrp: 'ripple',
    doge: 'dogecoin',
    ada: 'cardano',
    avax: 'avalanche-2',
    trx: 'tron',
    shib: 'shiba-inu',
    dot: 'polkadot',
    matic: 'matic-network',
    dai: 'dai',
    ltc: 'litecoin',
    link: 'chainlink',
    op: 'optimism',
    arb: 'arbitrum',
    near: 'near'
    };
    const priceCache = {};
    const CACHE_TTL = 60000;
    let popup = null;
    let editor = null;
    let debounceTimer = null;

    function getCaretPositionRect() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return null;
        const range = sel.getRangeAt(0).cloneRange();
        const rects = range.getClientRects();
        return rects.length ? rects[0] : null;
    }

    function createPopupIfNeeded() {
        if (popup) return;
        popup = document.createElement('div');
        popup.className = 'fr-popup fr-desktop fr-ltr fe-acPopup fr-above fr-active';
        popup.style.zIndex = 9999;
        popup.style.position = 'absolute';
        popup.style.maxWidth = '350px';

        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'scroll-wrapper fe-ac fe-ac-user';
        scrollWrapper.style.position = 'relative';

        const scrollContent = document.createElement('div');
        scrollContent.className = 'fe-ac fe-ac-user scroll-content';
        scrollContent.style.maxHeight = '132px';

        scrollWrapper.appendChild(scrollContent);
        popup.appendChild(scrollWrapper);
        document.body.appendChild(popup);
        const style = document.createElement('style');
        style.textContent = `
          .guarantor_block_card_payment {
          padding: 4px 8px;
          font-weight: bold;
          border-radius: 6px;
          font-size: 13px;
          font-family: -apple-system,BlinkMacSystemFont,'Open Sans','Helvetica Neue',sans-serif;
          display: inline-block;
          margin-right: 8px;
        }

         .guarantor_block_card_payment.btc_color  { color: #D1AC40; background-color: #413D31; }
.guarantor_block_card_payment.eth_color  { color: #4093D6; background-color: #313A41; }
.guarantor_block_card_payment.ton_color  { color: #40c0d6; background-color: #36474c; }
.guarantor_block_card_payment.usdt_color { color: #26A17B; background-color: #222; }
.guarantor_block_card_payment.usdc_color { color: #2775CA; background-color: #1E1E1E; }
.guarantor_block_card_payment.bnb_color  { color: #F3BA2F; background-color: #1E1E1E; }
.guarantor_block_card_payment.sol_color  { color: #66F9A1; background-color: #2A2A2A; }
.guarantor_block_card_payment.xrp_color  { color: #00AAE4; background-color: #1C1C1C; }
.guarantor_block_card_payment.doge_color { color: #C2A633; background-color: #3A3A3A; }
.guarantor_block_card_payment.ada_color  { color: #0033AD; background-color: #202020; }
.guarantor_block_card_payment.avax_color { color: #E84142; background-color: #1F1F1F; }
.guarantor_block_card_payment.trx_color  { color: #EF0027; background-color: #191919; }
.guarantor_block_card_payment.shib_color { color: #F55C44; background-color: #2C2C2C; }
.guarantor_block_card_payment.dot_color  { color: #E6007A; background-color: #242424; }
.guarantor_block_card_payment.matic_color{ color: #8247E5; background-color: #282828; }
.guarantor_block_card_payment.dai_color  { color: #F4B731; background-color: #292929; }
.guarantor_block_card_payment.ltc_color  { color: #BEBEBE; background-color: #2E2E2E; }
.guarantor_block_card_payment.link_color { color: #2A5ADA; background-color: #303030; }
.guarantor_block_card_payment.op_color   { color: #FF0420; background-color: #1B1B1B; }
.guarantor_block_card_payment.arb_color  { color: #28A0F0; background-color: #1D1D1D; }
.guarantor_block_card_payment.near_color { color: #000000; background-color: #F8F8F8; }

       `;
        popup.appendChild(style);

    }

    function updatePopup(results, insertCallback, position) {
        createPopupIfNeeded();
        popup.style.left = `${position.left}px`;
        popup.style.top = `${position.top + 20}px`;

        const scrollContent = popup.querySelector('.scroll-content');
        scrollContent.innerHTML = '';

        results.forEach(r => {
            const div = document.createElement('div');
            div.className = 'fe-ac-user-result fe-ac-result';
            div.innerHTML = r.isHtml
    ? r.title
    : `<span class="username"><span class="style2">${r.title}</span></span><span class="item">${r.subtitle}</span>`;

            div.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                insertCallback(r.insertText);
                hidePopup();
            });
            scrollContent.appendChild(div);
        });
    }

    function hidePopup() {
        if (popup) popup.remove();
        popup = null;
    }

    async function fetchSuggestions(query) {
        const results = [];
        console.log(query)

        const calcMatch = query.match(/^([a-z]{2,5})\s*([\*\+\/\-])\s*(\d+(\.\d+)?%?)$/i);
        if (calcMatch) {
            const [, symbolKey, operator, valueRaw] = calcMatch;
            const coinId = cryptoSymbols[symbolKey];
            if (coinId) {
                const now = Date.now();
                let price;

                const cacheEntry = priceCache[symbolKey];
                if (cacheEntry && now - cacheEntry.timestamp < CACHE_TTL) {
                    price = cacheEntry.price;
                } else {
                    try {
                        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
                        const data = await res.json();
                        price = data[coinId]?.usd;
                        if (!price) throw new Error();
                        priceCache[symbolKey] = { price, timestamp: now };
                    } catch (e) {
                        console.error('Ошибка получения курс:', e);
                    }
                }

                if (price) {
                    const isPercent = valueRaw.endsWith('%');
                    const value = parseFloat(valueRaw.replace('%', ''));
                    let result;

                    switch (operator) {
                        case '*': result = price * value; break;
                        case '/': result = price / value; break;
                        case '+': result = isPercent ? price * (1 + value / 100) : price + value; break;
                        case '-': result = isPercent ? price * (1 - value / 100) : price - value; break;
                    }

                    const rounded = result.toFixed(2);
                    results.push({
                        title: `<span class="guarantor_block_card_payment ${symbolKey}_color">${symbolKey.toUpperCase()} → ${rounded} USD</span>`,
                        subtitle: '',
                        insertText: `${symbolKey.toUpperCase()}: ${rounded} USD`,
                        isHtml: true
                    });
                }
                return results;
            }
        }


        if (cryptoSymbols[query]) {
            const coinId = cryptoSymbols[query];
            const now = Date.now();
            let price;

            const cacheEntry = priceCache[query];
            if (cacheEntry && now - cacheEntry.timestamp < CACHE_TTL) {
                price = cacheEntry.price;
            } else {
                try {
                    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
                    const data = await res.json();
                    price = data[coinId]?.usd;
                    if (!price) throw new Error();
                    priceCache[query] = { price, timestamp: now };
                } catch (e) {
                    console.error('Ошибка получения курса:', e);
                }
            }

            if (price) {
                const symbol = query.toUpperCase();
                const html = `<span class="guarantor_block_card_payment ${query}_color">${symbol} ${price} USD</span>`;
                results.push({
                    title: html,
                    subtitle: '',
                    insertText: `${symbol}: ${price} USD`,
                    isHtml: true
                });
            }
        }

        for (const [key, url] of Object.entries(sectionsDict)) {
            if (key.toLowerCase().includes(query.toLowerCase())) {
                const urlParts = url.split("/");
                const last = urlParts.filter(Boolean).pop();
                const nodeId = last.match(/^\d+$/) ? `node${last}` : `node_${last}`;
                const html = `<span class="internalNodeLink ${nodeId}"><a href="${url}" class="internalLink internalNodeLink ${nodeId}">${key}</a></span>`;
                results.push({
                    title: html,
                    subtitle: '',
                    insertText: `${url}`,
                    isHtml: true
                });
            }

        }


        return results;
    }

    function insertTextAtCursor(oldTrigger, newText) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const node = sel.anchorNode;
        if (!node || !node.textContent) return;

        const text = node.textContent;
        const replaced = text.replace(oldTrigger, newText + ' ');
        node.textContent = replaced;

        const range = document.createRange();
        range.setStart(node, replaced.length);
        range.setEnd(node, replaced.length);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function handleKeyup(e) {
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {
            const sel = window.getSelection();
            if (!sel.rangeCount) return;
            const node = sel.anchorNode;
            if (!node || !node.textContent) return;

            const text = node.textContent;
            const match = text.match(/!([\p{L}\p{N}\s\-\+\*\/%.,]{2,40})$/u);
            if (match) {
                const query = match[1].toLowerCase();
                const caretRect = getCaretPositionRect();
                if (!caretRect) return;
                const suggestions = await fetchSuggestions(query);
                if (suggestions.length) {
                    updatePopup(suggestions, (txt) => insertTextAtCursor('!' + query, txt), caretRect);
                } else {
                    hidePopup();
                }
            } else {
                hidePopup();
            }
        }, 250); 
    }

    function setup() {
        if (editor) return; 
        editor = document.querySelector('.fr-element[contenteditable="true"]');
        if (editor) {
            editor.addEventListener('keyup', handleKeyup);
        }
    }

    const observer = new MutationObserver(() => setup());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', setup);
})();
