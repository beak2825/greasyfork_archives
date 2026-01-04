// ==UserScript==
// @name         rutracker-eng
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  partially translates rutracker interface
// @author       bblvd@ops
// @match        https://rutracker.org/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469325/rutracker-eng.user.js
// @updateURL https://update.greasyfork.org/scripts/469325/rutracker-eng.meta.js
// ==/UserScript==

function replaceTextContentsMap(elements, map) {
    const map_ = new Map(Object.entries(map));

    for (const element of elements) {
        if (map_.has(element.textContent.valueOf())) {
            element.textContent = map_.get(element.textContent);
        }
    }
}

function replaceValueMap(elements, map) {
    const map_ = new Map(Object.entries(map));

    for (const element of elements) {
        if (map_.has(element.value.valueOf())) {
            element.value = map_.get(element.value);
        }
    }
}

function replaceTextContentsOrdered(elements, iterable) {
    const array = Array.from(iterable);

    var counter = 0;
    for (const element of elements) {
        element.textContent = array[counter];
        counter = counter + 1;

        if (counter >= array.length) {
            break;
        }
    }
}

function replaceNodeValuesOrdered(elements, iterable, accessor) {
    const elements_ = Array.from(elements);
    const array_ = Array.from(iterable);

    var counter = 0;
    for (const element of elements_) {
        accessor(element).nodeValue = array_[counter];
        counter = counter + 1;

        if (counter >= array_.length) {
            break;
        }
    }
}

function translateDate(string) {
    return string
        .replace("года", "years")
        .replace("год", "year")
        .replace("лет", "years")
        .replace("месяцев", "months")
        .replace("месяца", "months")
        .replace("месяц", "month")
        .replace("день", "day")
        .replace("дней", "days")
        .replace("часов", "hours")
        .replace("часа", "hours")
        .replace("час", "hour")
        .replace("минута", "minute")
        .replace("минуту", "minute")
        .replace("минуты", "minutes")
        .replace("минут", "minutes")
        .replace("мин.", "min.")
        .replace("секунды", "seconds")
        .replace("секунда", "second")
        .replace("секунд", "seconds");
}

function translateShortDate(string) {
    return string
        .replace("Янв", "Jan")
        .replace("Фев", "Feb")
        .replace("Мар", "Mar")
        .replace("Апр", "Apr")
        .replace("Май", "May")
        .replace("Июн", "Jun")
        .replace("Июл", "Jul")
        .replace("Авг", "Aug")
        .replace("Сен", "Sep")
        .replace("Окт", "Oct")
        .replace("Ноя", "Nov")
        .replace("Дек", "Dec")
        .replace("спустя", "after")
        .replace("ред.", "edited")
        .replace("назад", "ago")
}

function handleUserProfile(root = null) {
    if (root === null) {
        root = document.querySelector("table.user_profile")
    }

    const h1 = document.querySelector("#main_content_wrap h1 span");
    if (h1 !== null) {
        h1.textContent = "User profile:";
    }

    const h1Link = document.querySelector("#main_content_wrap h1 span a");
    if (h1Link !== null) {
        if (h1Link.textContent == "Настройки / Изменить профиль") {
            h1Link.textContent = "Settings / Edit profile";
        }
    }

    root.querySelector("tbody tr th.thHead")
        .textContent = "User profile";

    const userclassMap = new Map(Object.entries({
        "Пользователь": "User",
        "Модератор": "Moderator",
        "Администратор": "Administrator"
    }));

    const genderMap = new Map(Object.entries({
        "Мужской": "Male",
        "Женский": "Female",
    }));

    const restrictionsMap = new Map(Object.entries({
        "отвечать в темах": "reply in topics",
    }));

    const title = root.querySelectorAll("tbody tr td.row1.vTop.tCenter.w30 div.med.mrg_4")[1];
    title.childNodes[0].textContent =
        title.childNodes[0].textContent
        .replace("Звание", "Title")
        .replace("нет", "none");

    root.querySelector("tbody tr td h4").textContent
        = "Contacts";

    for (const row of root.querySelectorAll("tbody tr td #user-contacts tbody tr")) {
        if (row.children[0].textContent === "Личное сообщ.:") {
            row.children[0].textContent = "Private message:";

            replaceTextContentsOrdered(
                row.querySelectorAll("a.txtb"),
                ["Compose new",
                 "Incoming",
                 "Sent"]
            );
        }
        if (row.children[0].textContent === "Посл. активность:") {
            row.children[0].textContent = "Last seen:";
            row.children[1].childNodes[2].textContent =
                row.children[1].childNodes[2].textContent
                .replace("сегодня", "today")
                .replace("вчера", "yesterday");
        }
    }

    const restrictedBox = document.getElementById("user-opt");
    if (restrictedBox !== null) {
        if (restrictedBox.childElementCount === 2) {
            restrictedBox.querySelector("legend").childNodes[0].textContent = "It is ";
            restrictedBox.querySelector("legend").childNodes[1].textContent = "FORBIDDEN";
            restrictedBox.querySelector("legend").append(" for this user to");

            for (const restriction of restrictedBox.querySelectorAll("li")) {
                if (restrictionsMap.has(restriction.textContent)) {
                    restriction.textContent = restrictionsMap.get(restriction.textContent);
                }
            }
        }
    }

    for (const row of root.querySelectorAll("table.user_details tbody tr")) {
        if (row.children[0].textContent === "Сессии:") {
            row.children[0].textContent = "Login sessions:";
            row.children[1].childNodes[1].textContent = "Terminate all sessions";
        }

        if (row.children[0].textContent === "Роль:") {
            row.children[0].textContent = "Userclass:";

            if (userclassMap.has(row.children[1].children[0].textContent)) {
                row.children[1].children[0].textContent =
                    userclassMap.get(row.children[1].children[0].textContent);
            }
        }
        if (row.children[0].textContent === "Стаж:") {
            row.children[0].textContent = "Tenure:";

            row.children[1].children[0].textContent =
                translateDate(row.children[1].children[0].textContent);

        }
        if (row.children[0].textContent === "Зарегистрирован:") {
            row.children[0].textContent = "Joined:";
        }
        if (row.children[0].textContent === "Раздачи:") {
            row.children[0].textContent = "Uploads:";

            const uploadsWord = row.children[1].childNodes[1].children[0].childNodes[1].childNodes[1];
            uploadsWord.textContent = " uploads ";

            for (const elem of row.children[1].querySelectorAll("ul li span")) {
                if (elem.title === "Подписка на фиды") {
                    elem.title = "RSS Subscription";
                    elem.childNodes[2].textContent = elem.childNodes[2].textContent.replace("Подписка", "RSS Feed");
                }
            }
        }
        if (row.children[0].textContent === "Сообщения:") {
            row.children[0].textContent = "Forum posts:";

            const noMessages = row.querySelector("#posts");
            if (noMessages !== null) {
                if (noMessages.textContent === "\nНет\n") {
                    noMessages.textContent = "\nNone\n";
                }
            }
            const links = row.querySelectorAll("#posts a");
            if (links !== null) {
                if (links.length !== 0) {
                    links[0].childNodes[1].textContent = " posts";
                    links[1].textContent = "Replies";
                    links[2].textContent = "Topics started";
                    links[3].textContent = "Replies in topics started";
                }
            }
        }
        if (row.children[0].textContent === "Статистика отключена:") {
            row.children[0].textContent = "Seeding stats (off):";

            row.children[1].querySelector("a i").textContent = "how to turn on";
        }
        if (row.children[0].textContent === "Статистика отданного:") {
            row.children[0].textContent = "Seeding stats:";

            const showStats = row.querySelector("#load-traf-stat-btn span");
            if (showStats !== null) {
                showStats.textContent = "show";
            }

            replaceTextContentsMap(
                document.getElementById("main_content_wrap")
                .querySelectorAll("table.user_details #traf-stats-tbl th"),
                {"Сегодня": "Today",
                 "Вчера": "Yesterday",
                 "Всего": "Total"}
            );

            replaceTextContentsMap(
                document.getElementById("main_content_wrap")
                .querySelectorAll("table.user_details #traf-stats-tbl td"),
                {"Отдано": "Uploaded",
                 "На редких": "On low-seeded"}
            );
        }
        if (row.children[0].textContent === "Пол:") {
            row.children[0].textContent = "Gender:";

            if (genderMap.has(row.children[1].textContent)) {
                row.children[1].textContent = genderMap.get(row.children[1].textContent);
            }
        }
        if (row.children[0].textContent === "Интересы:") {
            row.children[0].textContent = "Interests:";
        }
        if (row.children[0].textContent === "Откуда:") {
            row.children[0].textContent = "From:";
        }
        if (row.children[0].textContent.includes("Статистика отданного")) {
            row.children[0].textContent = row.children[0].textContent.replace("Статистика отданного", "Seeding stats");

            if (row.querySelector("#load-traf-stat-btn span") !== null) {
                row.querySelector("#load-traf-stat-btn span").textContent = "show";
            }
        }
    }

    for (const elem of document.querySelectorAll("#traf-stats-tbl tbody tr th")) {
        if (elem.textContent == "Сегодня") {
            elem.textContent = "Today";
        }
        if (elem.textContent == "Вчера") {
            elem.textContent = "Yesterday";
        }
        if (elem.textContent == "Всего") {
            elem.textContent = "Total";
        }
    }

    for (const elem of document.querySelectorAll("#traf-stats-tbl tbody tr td")) {
        if (elem.textContent == "Отдано") {
            elem.textContent = "Seeded";
        }
        if (elem.textContent == "На редких") {
            elem.textContent = "Rare";
        }
    }

    const seedingCaption = document.getElementById("main_content_wrap").querySelector("div h1.pagetitle.tCenter");
    if (seedingCaption !== null) {
        seedingCaption.childNodes[0].textContent = "Seeding: ";
        if (seedingCaption.childNodes[1].textContent === "нет") {
            seedingCaption.childNodes[1].textContent = "nothing";
        }
        if (seedingCaption.childNodes[1].textContent === "[ показать ]") {
            seedingCaption.childNodes[1].children[0].textContent = "show";
        }
    }
}

function handleUserSettings(root = null) {
    if (root == null) {
        root = document.querySelector("table.forumline");
    }

    document.getElementById("main_content_wrap")
            .querySelector("h1.pagetitle")
            .textContent = "Edit profile";

    const table = root;

    for (const title of table.querySelectorAll("th")) {
        title.textContent =
            title.textContent
            .replace("Регистрационная информация", "General info")
            .replace("Персональная информация", "Personal info")
            .replace("Личные настройки", "Personal settings")
            .replace("Закачки", "Download settings")
            .replace("Управление аватарой", "Avatar settings")
    }

    for (const row of table.querySelectorAll("tr")) {
        if (row.children[0].textContent === "Имя: *") {
            row.children[0].textContent = "Username: *";
        }

        if (row.children[0].textContent === "Текущий пароль: *") {
            row.children[0].textContent = "Current password: *";

            row.children[1].querySelector("h6").textContent = "Enter current password if you wish to change password or email";
        }

        if (row.children[0].textContent === "Новый пароль: *") {
            row.children[0].textContent = "New password: *";

            row.children[1].querySelector("h6").textContent = "Enter new password if you wish to change password";
            row.children[1].querySelector("h6 i").childNodes[0].textContent = "(max ";
            row.children[1].querySelector("h6 i").childNodes[2].textContent = " symbols)";
        }

        if (row.children[0].textContent === "Род занятий:") {
            row.children[0].textContent = "Profession:";
        }
        if (row.children[0].textContent === "Интересы:") {
            row.children[0].textContent = "Interests:";
        }
        if (row.children[0].textContent === "Откуда:") {
            row.children[0].textContent = "From:";
        }
        if (row.children[0].textContent === "Часовой пояс:") {
            row.children[0].textContent = "Timezone:";
        }
        if (row.children[0].textContent === "Род занятий:") {
            row.children[0].textContent = "Username:";
        }
        if (row.children[0].textContent === "Пол:") {
            row.children[0].textContent = "Gender:";
            replaceTextContentsMap(
                table.querySelectorAll("#user_gender_id option"),
                {" Засекречен ": " Won't tell ",
                 " Женский ": " Female ",
                 " Мужской ": " Male "}
            );
        }
        if (row.children[0].textContent === "Подпись:") {
            row.children[0].textContent = "Signature:";
        }
        if (row.children[0].textContent === "Отключить получение и отправку ЛС:") {
            row.children[0].textContent = "Disable private messages:";
        }
        if (row.children[0].textContent === "Включить учет отданного:") {
            row.children[0].textContent = "Keep upload statistics:";
        }
        if (row.children[0].textContent === "Скрывать список активных раздач:") {
            row.children[0].textContent = "Hide list of seeding torrents:";
        }
        if (row.children[0].textContent === "Добавлять ретрекер в торрент-файлы:") {
            row.children[0].textContent = "Add retracker to .torrent files:";
        }
        if (row.children[0].textContent === "Добавлять название темы в имя скачиваемого торрент-файла:") {
            row.children[0].textContent = "Add topic name to name of .torrent file when downloading:";
        }
        if (row.children[0].textContent === "Отключить анимацию иконок:") {
            row.children[0].textContent = "Disable icon animation:";
        }
        if (row.children[0].textContent === "Доменное имя для трекера:") {
            row.children[0].textContent = "Tracker domain name:";
        }
    }

    for (const label of table.querySelectorAll("td label")) {
        label.childNodes[1].textContent = label.childNodes[1].textContent.replace("Да", "Yes").replace("Нет", "No").replace("Удалить изображение", "Remove image");
    }

    table.querySelector("td.catBottom input").value = "I accept";
    table.querySelector("tr td").textContent = "Fields denoted by * are required";
}

function handleRegistration(root = null) {
    if (root == null) {
        root = document.querySelector("table.forumline");
    }
    const table = root;

    for (const title of table.querySelectorAll("th")) {
        title.textContent =
            title.textContent
            .replace("Условия регистрации", "Registration conditions")
            .replace("Регистрационная информация", "General info")
    }

    const button = table.querySelector("input.bold.x-long");
    if (button !== null) {
        if (button.value === "Я согласен с этими правилами") {
            button.value = "I agree to these conditions";
        }
    }

    for (const row of table.querySelectorAll("tr")) {
        if (row.children[0].textContent === "Имя: *") {
            row.children[0].textContent = "Username: *";
        }
        if (row.children[0].textContent === " Пароль: *") {
            row.children[0].textContent = "Password: *";
            row.children[1].children[1].children[0].textContent = "(20 symbols max)";
            row.children[1].children[3].textContent = "show password";
        }
        if (row.children[0].textContent === "Код подтверждения: *") {
            row.children[0].textContent = "Confirmation code: *";
        }
        if (row.children[0].textContent === "Откуда:") {
            row.children[0].textContent = "From:";
            row.querySelector("select option").textContent = " » Select country (in Russian) ";
            replaceTextContentsMap(
                row.querySelectorAll("span.a-like"),
                {"Россия": "Russia",
                 "Украина": "Ukraine",
                 "Беларусь": "Belarus"}
            );
        }
        if (row.children[0].textContent === "Часовой пояс:") {
            row.children[0].textContent = "Timezone:";
        }
        if (row.children[0].textContent === "Пол:") {
            row.children[0].textContent = "Gender:";
            replaceTextContentsMap(
                table.querySelectorAll("#user_gender_id option"),
                {" Засекречен ": " Won't tell ",
                 " Женский ": " Female ",
                 " Мужской ": " Male "}
            );
        }
    }
    table.querySelector("#reg-confirm-agreement").value = "I accept";
    table.querySelector("tr td").textContent = "Fields denoted by * are required";
    table.querySelector("div.infobox legend").textContent = "To continue registration you are required to accept our USER AGREEMENT";
}

function handlePagination(root) {
    if (root !== null) {
        if (root.childElementCount === 0) {
            root.textContent = root.textContent.replace("Страницы", "Pages");
        } else {
            root.children[0].childNodes[0].textContent = "Pages";
            if (root.children[1].childNodes[0].textContent === "Пред.") {
                root.children[1].childNodes[0].textContent = "Prev.";
            }
            const last = root.children[root.children.length - 1];
            if (last.textContent === "След.") {
                last.textContent = "Next";
            }
        }
    }
}

function handleTrackerSearchPage(root = null) {
    if (root == null) {
        root = document.getElementById("tr-form");
    }

    const searchTitle1 = root.querySelector("table tbody tr th.thHead");
    if (searchTitle1 !== null) {
        searchTitle1.textContent = "Search uploads";
    }

    const searchTitle2 = root.querySelector("table tbody tr td div.tCenter input");
    if (searchTitle2 !== null) {
        searchTitle2.value = "Search";
    }

    document.querySelector("#main_content_wrap h1.maintitle").textContent = "Torrents";

    const numresults = document.querySelector("#main_content_wrap p.med.bold");
    if (numresults !== null) {
        numresults.textContent = numresults.textContent.replace("Результатов поиска", "Search results");
    }

    replaceTextContentsOrdered(
        root.querySelectorAll("fieldset:not(#fs) legend"),
        ["Sort by", // Упорядочить по
         "Torrents dated", // Торренты за
         "Show only", // Показывать только
         "Uploader", // Автор раздачи
         "Title contains", // Название содержит
         "Links"] // Ссылки
    );

    for (const row of root.querySelectorAll("fieldset:not(#fs)")) {
        if (row.children[0].textContent === "Uploader") {
            row.children[1].children[0].childNodes[5].textContent = "My uploads";
        }
    }

    replaceTextContentsOrdered(
        document.getElementById("o").options,
        [" Time added ", // Зарегистрирован
         " Title ", // Название темы
         " Snatched ", // Количество скачиваний
         " Seeders ", // Количество сидов
         " Leechers ", // Количество личей
         " Size "] // Размер
    );

    replaceNodeValuesOrdered(
        root.querySelectorAll("tbody fieldset .radio label"),
        ["\n ascending\n",
         "\n descending\n"],
        (elem) => elem.childNodes[2]
    );

    replaceNodeValuesOrdered(
        root.querySelectorAll("tbody fieldset .chbox label"),
        [" Only active uploads ", // Только открытые раздачи
         " New messages since last visit ", // Новые с посл. посещения
         " Hide contents { ... } "], // Скрыть содержимое {...}
        (elem) => elem.childNodes[elem.childNodes.length - 1]
    );

    replaceTextContentsOrdered(
        document.getElementById("tm").options,
        [" all time ", // за все время
         " today ", // за сегодня
         " last 3 days ", // последние 3 дня
         " last week ", // посл. неделю
         " last 2 weeks ", // посл. недели
         " last month "] // последний месяц
    );

    const notFound = document.getElementById("tor-tbl").querySelector("tbody tr td");
    if (notFound !== null) {
        if (notFound.textContent === "\nНе найдено ") {
            notFound.textContent = "\nNot found ";
        }
    }

    const topPagination = document.querySelector("#main_content_wrap p.small");
    handlePagination(topPagination);

    const bottomPageIndicator = document.querySelectorAll("#main_content_wrap div.bottom_info div.nav p")[0];
    if (bottomPageIndicator !== null) {
        bottomPageIndicator.childNodes[0].textContent =
            bottomPageIndicator.childNodes[0].textContent
            .replace("Страница", "Page");

        bottomPageIndicator.childNodes[2].textContent =
            bottomPageIndicator.childNodes[2].textContent
            .replace("из", "of");
    }

    const bottomPagination = document.querySelectorAll("#main_content_wrap div.bottom_info div.nav p")[1];
    handlePagination(bottomPagination);
}

function handleForumView() {
    const paginationTop = document.querySelector("#main_content_wrap div.small b");
    if (paginationTop !== null) {
        handlePagination(paginationTop);
    }
    const paginationBottom = document.querySelectorAll("#pagination p")[1];
    if (paginationBottom !== null) {
        handlePagination(paginationBottom);
    }
    const bottomPageIndicator = document.querySelectorAll("#main_content_wrap div.bottom_info div.nav p")[0];
    if (bottomPageIndicator !== null) {
        bottomPageIndicator.childNodes[0].textContent =
            bottomPageIndicator.childNodes[0].textContent
            .replace("Страница", "Page");

        bottomPageIndicator.childNodes[2].textContent =
            bottomPageIndicator.childNodes[2].textContent
            .replace("из", "of");
    }

    const search = document.querySelector("#search-f-form");
    if (search !== null) {
        replaceValueMap(
            search.querySelectorAll("input"),
            {"по разделу": "search in this subforum",
             "по подразд.": "search in its subforums"}
        )
    }

    const links = document.querySelector("table.forumline tr td");
    if (links !== null) {
        replaceTextContentsMap(
            links.querySelectorAll("li a"),
            {"Подписка": "RSS Feed",
             "Мои сообщения": "My posts",
             "Начатые темы": "My topics",
             "Опции показа": "Display options"}
        )
    }
}

function handleTopicView() {
    const topButtons = document.querySelector("#t-top-user-buttons");
    if (topButtons !== null) {
        replaceTextContentsMap(
            topButtons.querySelectorAll("a"),
            {"Избранное": "Bookmarks",
             "Мои сообщения": "My messages in this topic",
             "В разделе": "My messages in this subforum",
             "Опции показа": "Display options"}
        );
    }

    const paginationTop = document.querySelector("#main_content_wrap div.small.hide-for-print b");
    if (paginationTop !== null) {
        handlePagination(paginationTop);
    }
    const paginationBottom = document.querySelector("#pagination p.hide-for-print");
    if (paginationBottom !== null) {
        handlePagination(paginationBottom);
    }

    const addBookmark = topButtons.querySelector("span span");
    if (addBookmark !== null) {
        addBookmark.textContent = "add";
    }

    const topicOptions = document.querySelector("#topic-options");
    if (topicOptions !== null) {
        replaceTextContentsMap(
            topicOptions.querySelectorAll("legend"),
            {"Не показывать": "Do not show",
             "Показывать": "Show"}
        )
        for (const input of topicOptions.querySelectorAll("input")) {
            if (input.nextSibling !== null) {
                input.nextSibling.textContent =
                    input.nextSibling.textContent
                    .replace("флаги", "flags")
                    .replace("аватары", "avatars")
                    .replace("картинки в званиях", "user group images")
                    .replace("картинки в сообщениях", "images in posts")
                    .replace("смайлики", "emoticons")
                    .replace("подписи", "forum signatures")
                    .replace("спойлер открытым", "expand spoilers");
            }
        }
    }

    const stats = document.querySelector("#t-tor-stats");
    if (stats !== null) {
        stats.querySelector("td.catTitle div").textContent = "Torrent statistics";

        for (const stat of stats.querySelector("td.borderless.bCenter").childNodes) {
            stat.textContent = stat.textContent
                .replace("Размер", "Size")
                .replace("Зарегистрирован", "Registered for")
                .replace(".torrent скачан", ".torrent file downloaded")
                .replace(" раза", " times")
                .replace(" раз", " times");
            stat.textContent = translateDate(stat.textContent);
        }

        const seeds = stats.querySelector("span.seed")
        if (seeds !== null) {
            seeds.childNodes[0].textContent = seeds.childNodes[0].textContent
                .replace("Сиды", "Seeders");
        }
        const leeches = stats.querySelector("span.leech")
        if (leeches !== null) {
            leeches.childNodes[0].textContent = leeches.childNodes[0].textContent
                .replace("Личи", "Leechers");
        }
    }

    const torrentDownloadLink = document.querySelector("#main_content_wrap td.message table a.dl-link");
    if (torrentDownloadLink !== null) {
        torrentDownloadLink.childNodes[torrentDownloadLink.childNodes.length - 1].textContent = "Download .torrent";
    }

    for (const post of document.querySelectorAll("#main_content_wrap td.message table.attach")) {
        const pLink = post.querySelector("a.p-link");
        if (pLink !== null) {
            pLink.textContent = translateDate(translateShortDate(pLink.textContent));
        }
        const postedSince = post.querySelector("span.posted_since");
        if (postedSince !== null) {
            postedSince.textContent = translateDate(translateShortDate(postedSince.textContent));
        }
    }

    const showFileList = document.getElementById("tor-filelist-btn");
    if (showFileList !== null) {
        showFileList.value = "File list";
    }

    const fileListControls = document.getElementById("tor-fl-controls");
    if (fileListControls !== null) {
        replaceTextContentsMap(
            fileListControls.querySelectorAll("li"),
            {"Свернуть": "Collapse",
             "Развернуть": "Expand",
             "Переключить": "Toggle",
             "Имя ↓": "Name ↓",
             "Размер ↓": "Size ↓",
             "Сравнить с др. раздачей": "Compare with another upload",
             "Увел./умен. окно": "Toggle window size",}
        )
    }

    const thanksButton = document.getElementById("thx-btn");
    if (thanksButton !== null) {
        thanksButton.value = "Say \"Thanks\""
    }

    const posterInfos = document.querySelectorAll("#main_content_wrap td.poster_info");
    if (posterInfos !== null) {
        for (const posterInfo of posterInfos) {
            const joined = posterInfo.querySelector("p.joined");
            if (joined !== null) {
                joined.childNodes[0].textContent = "Tenure:";
                joined.childNodes[1].textContent = translateDate(joined.childNodes[1].textContent);
            }

            const postsN = posterInfo.querySelector("p.posts");
            if (postsN !== null) {
                postsN.childNodes[0].textContent = "Forum posts:";
            }
        }
    }
    const posterButtons = document.querySelectorAll("#main_content_wrap td.poster_btn a.txtb");
    if (posterButtons !== null) {
        for (const posterButton of posterButtons) {
            replaceTextContentsMap(
                posterButtons,
                {"[Профиль]": "[Profile]",
                 "[ЛС]": "[PM]"}
            );
        }
    }

    const posts = document.querySelectorAll("#main_content_wrap td.message");
    if (posts !== null) {
        for (const post of posts) {
            const pLink = post.querySelector("p.post-time a.p-link");
            if (pLink !== null) {
                pLink.textContent = translateDate(translateShortDate(pLink.textContent));
            }

            const postedSince = post.querySelector("span.posted_since");
            if (postedSince !== null) {
                postedSince.textContent = translateDate(translateShortDate(postedSince.textContent));
            }

            const buttons = post.querySelectorAll("ul.t-post-buttons li .txtb");
            if (buttons !== null) {
                replaceTextContentsMap(
                    buttons,
                    {"[Цитировать]": "[Quote]",
                     "[Изменить]": "[Edit]",
                     "[Код]": "[Show code]",
                     "[Добавить опрос]": "[Add poll]"}
                );
            }
        }
    }

    for (const post of document.querySelectorAll("#main_content_wrap p.post-time")) {
        const pLink = post.querySelector("a.p-link");
        if (pLink !== null) {
            pLink.textContent = translateDate(translateShortDate(pLink.textContent));
        }

        const postedSince = post.querySelector("span.posted_since");
        if (postedSince !== null) {
            postedSince.textContent = translateDate(translateShortDate(postedSince.textContent));
        }
    }

    const uploadTable = document.querySelector("#topic_main table.attach.bordered.med");
    if (uploadTable !== null) {
        for (const td of uploadTable.querySelectorAll("td")) {
            if (td.childElementCount === 0) {
                td.textContent = td.textContent
                    .replace("Зарегистрирован", "Registered on")
                    .replace("Тип:", "Upload type:")
                    .replace("Статус:", "Status:")
                    .replace("Размер:", "Size:")
                    .replace("обычная", "regular")
            }
        }

        const magnetLink = uploadTable.querySelector("a.magnet-link");
        if (magnetLink !== null) {
            magnetLink.childNodes[2].textContent = "Download using magnet link\n";
        }

        for (const elem of uploadTable.querySelectorAll("ul.inlined.middot-separated li")) {
            if (elem.childElementCount === 0) {
                elem.textContent = elem.textContent.replace("Скачан", "Downloaded").replace("раза", "times").replace("раз", "times");
                elem.textContent = translateShortDate(elem.textContent);
            }
        }
    }

    const status = document.getElementById("tor-status-resp");
    if (status !== null) {
        replaceTextContentsMap(
            status.querySelectorAll("a b"),
            {"проверено": "approved",
             "сомнительно": "questionable quality",
             "поглощено": "trumped",
             "временная": "temporary",
             "не проверено": "not checked",
             "недооформлено": "description needs editing",
             "не оформлено": "bad description",
             "повтор": "dupe",
             "закрыто": "closed",
             "премодерация": "premoderation",}
        );

        for (const node of status.childNodes) {
            if (node.nodeName === "I") {
                node.textContent = translateDate(translateShortDate(node.textContent));
            }
            if (node.nodeName === "#text") {
                node.textContent = node.textContent.replace("назад", "ago");
            }
        }
    }
}

function handleTopMenu() {
    const header = document.getElementById("main-nav");
    if (header !== null) {
        replaceTextContentsMap(
            document.getElementById("main-nav")
            .querySelectorAll("ul li a b"),
            {"Главная": "Home",
             "Трекер": "Torrents",
             "Поиск": "Search",
             "Группы": "User Groups",
             "Правила": "Rules"}
        );
    }

    const topMenu = document.querySelector("div.topmenu");

    const searchMenu = topMenu.querySelector("#search-menu");
    if (searchMenu !== null) {
        replaceTextContentsOrdered(
            searchMenu.options,
            [" uploads", // раздачи
             " all topics", // все темы
             " google",
             " duckduckgo",
             " wiki",
             " info_hash"]
        );
        document.getElementById("search-submit").value = "Search"
    }

    const linksBold = topMenu.querySelectorAll("div > a > b");
    if (linksBold !== null) {
        replaceTextContentsMap(
            linksBold,
            {"Регистрация": "Register",
             "Вход": "Log in"}
        );
    }
    const links = topMenu.querySelectorAll("div > a");
    if (links !== null) {
        replaceTextContentsMap(
            links,
            {"Забыли имя или пароль?": "Password recovery"}
        );
    }

    const guestSearch = document
        .getElementById("quick-search-guest");
    if (guestSearch !== null) {
        const searchButton = guestSearch.querySelector("input:not(#search-text-guest)")
        if (searchButton !== null) {
            searchButton.value = "search";
        }
    }

    const usernameInput = document.getElementById("top-login-uname");
    if (usernameInput !== null) {
        usernameInput.placeholder = "username";
    }
    const passwordInput = document.getElementById("top-login-pwd");
    if (passwordInput !== null) {
        passwordInput.placeholder = "password";
    }
    const loginButton = document.getElementById("top-login-btn");
    if (loginButton !== null) {
        loginButton.value = "log in";
    }

    const personalMenu = topMenu
            .querySelectorAll("table tbody tr td ul li span a:not(.menu-root)");
    if (personalMenu !== null) {
        replaceTextContentsOrdered(
            personalMenu,
            ["Private messages ✉",
             "Profile",
             "My activity"]
        );

        const messagesMenu = document.getElementById("pms-menu");
        if (messagesMenu !== null) {
            replaceTextContentsMap(
                messagesMenu.querySelectorAll("a.med"),
                {"Входящие": "Inbox",
                 "Исходящие": "Outgoing",
                 "Отправленные": "Sent",
                 "Сохранённые": "Saved"}
            );
        }

        const profileMenu = document.getElementById("profile-menu");
        if (profileMenu !== null) {
            replaceTextContentsMap(
                profileMenu.querySelectorAll("a.med"),
                {"Настройки": "Settings",
                 "Будущие закачки": "Future downloads",
                 "Избранное": "Bookmarks"}
            );
        }

        const postsMenu = document.getElementById("my-posts-menu");
        if (postsMenu !== null) {
            replaceTextContentsMap(
                postsMenu.querySelectorAll("a.med"),
                {"Мои раздачи": "My uploads",
                 "Начатые темы": "My topics",
                 "Ответы в начатых темах": "Replies in my topics"}
            );
        }
    }
}

function handleMessages() {
    const messageBoxes = {"Входящие": "Inbox",
                          "Исходящие": "Outgoing",
                          "Отправленные": "Sent",
                          "Сохранённые": "Saved"};

    const navigation = document.querySelector("#main_content table.pm_nav");
    if (navigation !== null) {
        replaceTextContentsMap(
            navigation.querySelectorAll("td a"),
            messageBoxes
        );
        for (const elem of navigation.querySelectorAll("td")) {
            if (elem.children.length == 0) {
                replaceTextContentsMap([elem], messageBoxes);
            }
        }
    }

    const forumline = document.querySelector("#main_content table.forumline");
    if (forumline !== null) {
        replaceTextContentsMap(
            forumline.querySelector("#main_content tr").querySelectorAll("th"),
            {"Тема": "Subject",
             "От": "From",
             "Кому": "To",
             "Дата": "Date"}
        );

        const noMessagesElement = forumline.querySelector("#main_content tr td.tCenter");
        if (noMessagesElement !== null) {
            noMessagesElement.textContent = "This folder doesn't have any messages";
        }

        const buttons = forumline.querySelectorAll("input.lite");
        if (buttons !== null) {
            replaceValueMap(
                buttons,
                {"Удалить все (очистить папку)": "Delete all (clear folder)",
                 "Удалить отмеченное": "Delete selected",
                 "Сохранить сообщение": "Save message",
                 "Удалить сообщение": "Delete message"}
            );
        }

        const tds = forumline.querySelectorAll("thead td");
        if (tds !== null) {
            replaceTextContentsMap(
                tds,
                {"От: ": "From: ",
                 "Кому: ": "To: ",
                 "Добавлено: ": "Sent: ",
                 "Тема: ": "Subject: "}
            );
        }

        const textButtons = forumline.querySelectorAll("td a.txtb");
        if (textButtons !== null) {
            replaceTextContentsMap(
                textButtons,
                {"[Цитировать]": "[Quote]",
                 "[Входящие]": "[Inbox]",
                 "[Отправленные]": "[Sent]",
                 "[Редактировать]": "[Edit]"}
            );
        }
    }

    if (/\?folder=outbox[&.*]?/.test(location.search)) {
        const emptyMessage = document.querySelector("#main_content p.small");
        if (emptyMessage !== null) {

            emptyMessage.textContent = "\"Outgoing\" folder contains messages that have not yet been read by the recepient. You can edit or delete them.";
        }
    }

    const messagesKept = document.querySelector("#main_content table.w100 td.tRight div");
    if (messagesKept !== null) {
        if (messagesKept.childNodes[0].textContent === "Срок хранения ЛС - 730 дней") {
            messagesKept.childNodes[0].textContent = "Messages are kept for 730 days";
        }
    }

    const spanLinks = document.querySelectorAll("#main_content span.a-like");
    if (spanLinks !== null) {
        replaceTextContentsMap(
            spanLinks,
            {"Удалить отмеченное": "Delete selected",
             "Отметить / Переключить": "Select / Toggle"}
        );
    }

    const folderFull = document.querySelector("#main_content td.tRight.nowrap.small div");
    if (folderFull !== null) {
        if (folderFull.childNodes[0].textContent.startsWith("Папка заполнена на ")) {
            folderFull.childNodes[0].textContent = "Folder is ";
            const newNode = document.createTextNode(" full");
            folderFull.appendChild(newNode);
        }
    }
}

function handleSendMessageBox(box = null) {
    const header = document.querySelector("table.forumline th");
    if (header !== null) {
        header.textContent = header.textContent
            .replace("Сообщение", "Message")
            .replace("Отправлено", "Sent")
            .replace("Входящие", "Inbox")
            .replace("Сохранено", "Saved")
            .replace("Исходящие", "Outgoing")
            .replace("Предв. просмотр", "Preview");
    }

    const messageBoxHeader = document.querySelector("#post-msg-form table tbody tr th");
    if (messageBoxHeader !== null) {
        messageBoxHeader.textContent = messageBoxHeader.textContent
            .replace("Быстрый ответ", "Fast reply")
            .replace("Отправить личное сообщение", "Send a private message")
            .replace("Редактировать сообщение", "Edit forum post")
            .replace("Редактировать личное сообщение", "Edit private message")
            .replace("Начать новую тему", "Start new topic")
            .replace("Ответить", "Reply");
    }

    const captionsLeftColumn = document.querySelectorAll("#post-msg-form table td b");
    if (captionsLeftColumn !== null) {

        replaceTextContentsMap(
        document.querySelectorAll("#post-msg-form table td b"),
            {"Имя": "Username", // Имя
             "Заголовок": "Subject", // Заголовок
             "Сообщение": "Message body"} // Сообщение
        );
    }

    if (box === null) {
        box = document.querySelector("#post-msg-form table");
        if (box === null) {
            return;
        }
        box = box.children[box.childElementCount - 1];
    }

    const privateToSubject = box.querySelector("td.td2.row2.tCenter.pad_6");
    if (privateToSubject !== null) {
        replaceTextContentsMap(
            privateToSubject.querySelectorAll("b"),
            {"Кому:": "To:",
             "Тема:": "Subject:"}
        );
    }

    replaceTextContentsMap(
        box.querySelectorAll("div.ped-buttons-row select option"),
        {"Шрифт:": "Font:",
         "Цвет шрифта:": "Font colour:",
         " Тёмно-красный": " Dark red",
         " Коричневый": " Brown",
         " Оранжевый": " Orange",
         " Красный": " Red",
         " Фиолетовый": " Purple",
         " Зелёный": " Green",
         " Тёмно-Зелёный": " Dark green",
         " Серый": " Grey",
         " Оливковый": " Olive",
         " Синий": " Blue",
         " Тёмно-синий": " Dark blue",
         " Индиго": " Indigo",
         " Тёмно-Голубой": " Blue sky",
         "Размер:": "Font size:",
         "Маленький": "Small",
         "Обычный": "Regular size",
         "Большой": "Large",
         "Огромный": "X-Large",
         "Выравнивание: ": "Align:",
         "По левому краю": "Left",
         "По центру": "Center",
         "По правому краю": "Right",
         "По ширине": "Justify",
         "Картинка: ": "Image:",
         "Слева": "On the left",
         "Справа": "On the right",
         "10% экрана": "10% screen",
         "По высоте строки": "1em",
        }
    );

    replaceValueMap(
        box.querySelectorAll("div.ped-buttons-row input"),
        {"Цитата": "Quote",
         "Картинка": "Image",
         "Ссылка": "URL",
         "Список": "List",
         "Код": "Code",
         "Спойлер": "Spoiler",
         "Цитир. выделен.": "Quote selected"}
    )

    const loadPicBtn = box.querySelector("div.ped-submit-buttons #load-pic-btn");
    if (loadPicBtn !== null) {
        loadPicBtn.value = "Upload image";
    }
    const extPreviewBtn = box.querySelector("div.ped-submit-buttons #p-ext-preview-btn");
    if (extPreviewBtn !== null) {
        extPreviewBtn.value = "Preview message";
    }
    const postSubmitBtn = box.querySelector("div.ped-submit-buttons #post-submit-btn");
    if (postSubmitBtn !== null) {
        postSubmitBtn.value = "Send message";
    }
    const quickPreviewBtn = box.querySelector("div.ped-submit-buttons #p-quick-preview-btn");
    if (quickPreviewBtn !== null) {
        quickPreviewBtn.value = "Quick preview";
    }
}

function handleInboxMessage(root = null) {
    if (root === null) {
        root = document.querySelector("table.forumline");
    }

    const header = root.querySelector("th");
    if (header !== null) {
        header.textContent = header.textContent
            .replace("Сообщение", "Message")
            .replace("Отправлено", "Sent")
            .replace("Входящие", "Inbox")
            .replace("Сохранено", "Saved")
            .replace("Исходящие", "Outgoing")
    }

    const fastResponse = document.getElementById("post-msg-form");
    if (fastResponse !== null) {
        handleSendMessageBox(fastResponse);
    }
}

function handleServiceMessage(forumMessageHeader = null) {
    if (forumMessageHeader !== null) {
        if (forumMessageHeader.textContent == "Информация") {
            forumMessageHeader.textContent = "Information";
        }

        if (forumMessageHeader.textContent == "Восстановление забытого пароля") {
            forumMessageHeader.textContent = "Password recovery";

            handleRecovery();
        }


        const forumMessage = document.querySelector("#main_content_wrap table.message tbody tr td div");
        if (forumMessage !== null) {

            if (forumMessage.textContent == "Подходящих тем или сообщений не найдено") {
                forumMessage.textContent = "Topics/posts not found";

                document.querySelector("table.message a").textContent = "Back to main page";
            }

            if (forumMessage.textContent == "Сессия устарела") {
                forumMessage.textContent = "Session expired";
            }

            if (forumMessage.childNodes[0].textContent === "\nСпасибо за регистрацию, ваша учётная запись была создана") {
                forumMessage.childNodes[0].textContent = "\nThank you for registration, your account has been created";
                forumMessage.childNodes[3].textContent = "\nYou can login with username ";
                forumMessage.childNodes[5].textContent = " and password\n[\n";

                forumMessage.querySelector("span").textContent = "show password";

                document.querySelector("table.message a").textContent = "Back to main page";
            }


            if (forumMessage.childNodes[0].textContent === "Ваше сообщение было отправлено") {
                forumMessage.childNodes[0].textContent = "Your message has been sent";

                forumMessage.childNodes[3].textContent = "Go to folder:";
                replaceTextContentsMap(
                    forumMessage.querySelectorAll("a b"),
                    {"Входящие": "Inbox",
                     "Отправленные": "Outgoing",
                     "Исходящие": "Sent",
                     "Сохраненные": "Saved"}
                );
                replaceTextContentsMap(
                    forumMessage.querySelectorAll("a"),
                    {"Вернуться к списку форумов": "Return to list of forums"}
                );
            }

            if (forumMessage.childNodes[0].textContent === "Вы еще не можете отправить сообщение.") {
                forumMessage.childNodes[0].textContent = "You cannot send a message yet.";

                forumMessage.childNodes[3].textContent = "Try later";
            }

        }

        if (forumMessageHeader.textContent == "Подтвердите") {
            forumMessageHeader.textContent = "Confirmation request";

            const questionH4 = document.querySelector("#main_content_wrap table.message tbody tr h4.mcp-confirm-question");
            if (questionH4 !== null) {
                if (questionH4.textContent === "Вы уверены, что хотите удалить эти сообщения?") {

                    questionH4.textContent = "Are you sure you wish to delete these messages?";
                }
            }

            const yesButton = forumMessage.querySelector("input");
            if (yesButton !== null) {
                if (yesButton.value === "Да") {
                    yesButton.value = "Yes";
                }
            }
        }
    }
}

function handleFooter() {
    const footerInfoLinks = document.querySelectorAll("#footer-info-links a");
    if (footerInfoLinks !== null) {
        replaceTextContentsMap(
            footerInfoLinks,
            {"Условия использования": "Terms and conditions",
             "Реклама на сайте": "Advertisements",
             "Для правообладателей": "For copyright holders",
             "Для прессы": "For press",
             "Для провайдеров": "For ISPs",
             "Торрентопедия": "Torrentopedia",
             "Правила": "Rules",
             "Кому задать вопрос": "Where to ask questions",
             "Авторские раздачи": "Uploaded by authors",
             "Конкурсы": "Contests",
             "Новости \"Хранителей\" и \"Антикваров\"": "News from \"Keepers\" and \"Antiquarians\"",
             "Случайная раздача": "Random upload"}
        )
    }

    const footerBottomLinks = document.querySelectorAll("div.footer-bottom-links a");
    if (footerBottomLinks !== null) {
        replaceTextContentsMap(
            footerBottomLinks,
            {"Администрация": "Administrators",
             "Модераторы": "Moderators",
             "Тех. помощь": "Technical support",
             "Telegram-канал": "Telegram channel"}
        )
    }
}


function translateTableHeader() {
    const tableSorter = document.querySelectorAll("table.tablesorter thead th");
    if (tableSorter !== null) {
        replaceTextContentsMap(
            tableSorter,
            {"Форум": "Forum",
             "Тема": "Topic",
             "Пиры": "Peers",
             "Автор": "User",
             "Отв.": "Replies",
             "Посл. сообщение": "Last reply",
             "Размер": "Size",
             "Добавлен": "Date"}
        );
    }

    const tableBody = document.querySelector("table.tablesorter tbody");
    if (tableBody !== null) {
        for (const row of tableBody.querySelectorAll('tr')) {
            if (row.childElementCount == 10) {
                row.childNodes[19].textContent = translateShortDate(row.childNodes[19].textContent);
            }
        }
    }
}

function handleRecovery() {
    const main = document.querySelector("#main_content_wrap table.forumline");
    if (main !== null) {
        const header = main.querySelector("tbody tr th");
        if (header !== null) {
            if (header.textContent === "Восстановление забытого пароля") {
                header.textContent = "Password recovery";
            }
        }

        const captions = main.querySelectorAll("td.tRight");
        if (captions !== null) {
            replaceTextContentsMap(
                captions,
                {"Адрес e-mail:": "E-mail address:",
                 "Код подтверждения:": "Confirmation code:"}
            )
        }

        const emailInput = main.querySelector("input.post");
        if (emailInput !== null) {
            emailInput.placeholder = "Enter your email";
        }

        const submit = main.querySelector("input.bold.long");
        if (submit !== null) {
            submit.value = "Send";
        }
    }
}

(function() {
    'use strict';

    // every page

    handleTopMenu();
    handleFooter();

    translateTableHeader();

    const forumMessageHeader = document.querySelector("#main_content_wrap table.message tbody tr th");
    if (forumMessageHeader !== null) {
        handleServiceMessage(forumMessageHeader);
    }

    if (/forum\/profile.php/.test(location.pathname) && /\?mode.viewprofile&u=[0-9]{1,20}/.test(location.search)) {
        handleUserProfile();
    }

    if (/forum\/profile.php/.test(location.pathname) && /\?mode.editprofile/.test(location.search)) {
        handleUserSettings();
    }

    if (/forum\/profile.php/.test(location.pathname) && /\?mode=register/.test(location.search)) {
        handleRegistration();
    }

    if (/forum\/tracker.php/.test(location.pathname)) {
        handleTrackerSearchPage();
    }

    if (/forum\/privmsg.php/.test(location.pathname)) {
        handleMessages();
    }

    if (/forum\/privmsg.php/.test(location.pathname) && /\?mode=[post]|[edit].*/.test(location.search)) {
        handleSendMessageBox();
    }

    if (/forum\/posting.php/.test(location.pathname) && /\?mode=[editpost]|[newtopic].*/.test(location.search)) {
        handleSendMessageBox();
    }

    if (/forum\/viewforum.php/.test(location.pathname)) {
        handleForumView();
    }

    if (/forum\/viewtopic.php/.test(location.pathname)) {
        handleTopicView();
    }

    if (/forum\/privmsg.php/.test(location.pathname) && /.*mode=read.*/.test(location.search)) {
        handleSendMessageBox();
    }

    if (/forum\/profile.php/.test(location.pathname) && /\?mode=sendpassword/.test(location.search)) {
        handleRecovery();
    }

})();