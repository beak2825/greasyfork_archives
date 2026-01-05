// ==UserScript==
// @name        Фильтры для ficbook.net
// @namespace   ficbook.net.uo1.net
// @description Позоляет убрать раздражающих авторов и прозведения. Фильтровать мелочь и фики с низком количеством лайков. Всё настраивается.
// @include     /^https?:\/\/ficbook.net(/.*|)$/
// @version     1.21
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/24257/%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D1%8B%20%D0%B4%D0%BB%D1%8F%20ficbooknet.user.js
// @updateURL https://update.greasyfork.org/scripts/24257/%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D1%8B%20%D0%B4%D0%BB%D1%8F%20ficbooknet.meta.js
// ==/UserScript==

var personalInfoValues = null;
var banPrefix = "Убрал пейсателей: ";
var banDelim = ", фики: ";
var banRegex = /Убрал пейсателей: ((?:,?\d+)*)?, фики: ((?:,?\d+)*)?/;

var previouslySerialized = null;

function storeBansInProfile(authors, fics) {
    if (personalInfoValues === null) {
        console.error("Can't store bans in profile, it's not loaded");
        return;
    }

    if (!authors) {
        authors = localStorage.getItem('_userscript_banned_authors');
    }
    if (!fics) {
        fics = localStorage.getItem('_userscript_banned_fics');
    }

    if (typeof authors === 'object') {
        authors = authors.join(',');
    }

    if (typeof fics === 'object') {
        fics = fics.join(',');
    }

    var serialized = banPrefix + authors + banDelim + fics;

    if (previouslySerialized === serialized) {
        previouslySerialized = serialized;
        return;
    }

    if (banRegex.test(personalInfoValues.about_myself)) {
        personalInfoValues.about_myself = personalInfoValues.about_myself.replace(banRegex, serialized);
    }
    else {
        personalInfoValues.about_myself += serialized;
    }

    $.post('https://ficbook.net/home/personal_info', personalInfoValues);
}

function applyFicBookFiltering() {
    function eraseCookie(name) {
        var expires = '';

        var date = new Date();
        date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();

        document.cookie = name + '=' + expires + '; path=/';
    }

    function writeStorage(name, value, days) {

        if (typeof window.localStorage !== 'undefined') {
            localStorage.setItem(name, value);

            eraseCookie(name);

            storeBansInProfile();

            return;
        }

        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        } else {
            expires = '';
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    function createStorageWriteCode(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        } else {
            expires = '';
        }

        var code;

        code = "{\n"
            + "\tk = " + JSON.stringify(name) + ";\n"
            + "\tv = " + JSON.stringify(value) + ";\n"
            + "\tif(typeof window.localStorage !== 'undefined') {\n"
            + "\t\tlocalStorage.setItem(k, v);\n"
            + "\t} else {\n"
            + "\t\tdocument.cookie = k + '=' + v + '" + expires + "; path=/';\n"
            + "\t}\n"
            + "}\n";

        return code;
    }

    function readStorage(name) {

        if (typeof window.localStorage !== 'undefined') {
            var value = localStorage.getItem(name);

            if (value !== null) {
                return value;
            }
        }

        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var value = 0; value < ca.length; value++) {
            var c = ca[value];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    var cookiePrefix = "_userscript_";

    var bannedAuthorsCookieName = cookiePrefix + "banned_authors";
    //eraseCookie(bannedAuthorsCookieName);
    var bannedAuthors = {};
    var bannedAuthorsCookie = readStorage(bannedAuthorsCookieName);

    if (bannedAuthorsCookie !== null) {
        bannedAuthorsCookie.split(",").forEach(function (id) {
            bannedAuthors[id] = true;
        });
    }

    console.log("Banned authors:", bannedAuthors);

    var bannedFicsCookieName = cookiePrefix + "banned_fics";
    //eraseCookie(bannedFicsCookieName);
    var bannedFics = {};
    var bannedFicsCookie = readStorage(bannedFicsCookieName);

    if (bannedFicsCookie !== null) {
        bannedFicsCookie.split(",").forEach(function (id) {
            bannedFics[id] = true;
        });
    }

    console.log("Banned fics:", bannedFics);

    function banAuthor(id) {
        if (bannedAuthors[id]) {
            return;
        }

        bannedAuthors[id] = true;
        if (bannedAuthorsCookie === null) {
            bannedAuthorsCookie = id;
        } else {
            bannedAuthorsCookie += "," + id;
        }

        writeStorage(bannedAuthorsCookieName, bannedAuthorsCookie, 365 * 20);
    }

    function unbanAuthor(id) {
        if (!bannedAuthors[id]) {
            return;
        }

        delete bannedAuthors[id];
        if (bannedAuthorsCookie !== null) {
            bannedAuthorsCookie = Object.keys(bannedAuthors).join(',');
        }

        writeStorage(bannedAuthorsCookieName, bannedAuthorsCookie, 365 * 20);
    }

    function banFic(id) {
        if (bannedFics[id]) {
            return;
        }

        bannedFics[id] = true;
        if (bannedFicsCookie === null) {
            bannedFicsCookie = id;
        } else {
            bannedFicsCookie += "," + id;
        }

        writeStorage(bannedFicsCookieName, bannedFicsCookie, 365 * 20);
    }

    function exportCookieData() {
        return createStorageWriteCode(bannedAuthorsCookieName, bannedAuthorsCookie, 365 * 20) + "\n" + createStorageWriteCode(bannedFicsCookieName, bannedFicsCookie, 365 * 20) + "\n";
    }

    var keepVisible = false;

    if (location.pathname.startsWith("/authors/") || "/home/collections" === location.pathname) {
        keepVisible = true;
    }

    function findBlockRoot(element) {
        while (element !== null && element !== document) {
            if (element.classList.contains('fanfic-inline')) {
                if (element.parentNode === null) {
                    console.log("Orphan node found:", element);
                    return element;
                }

                if (element.parentNode.tagName === 'DIV' && element.parentNode.classList.contains('top-item-row')) {
                    return element.parentNode;
                }

                if (element.parentNode.tagName === 'SECTION')
                {
                    if (element.parentNode.parentNode.tagName === 'TD') {
                        //console.log("FOUND: ", element, "P:", element.parentNode, "PP:", element.parentNode.parentNode); return null;
                        return element.parentNode.parentNode.parentNode;
                    }

                    if (element.parentNode.querySelectorAll(".fanfic-inline").length > 1) {
                        return element;
                    }

                    return element.parentNode;
                }

                if (element.parentNode.tagName === "TD") {
                    return element.parentNode.parentNode;
                }

                return element;
            }

            element = element.parentNode;
        }

        return null;
    }

    var deleted = 0;

    function deleteBanned(element) {
        if (keepVisible) {
            return;
        }

        console.log("Removing HTML section for", element);
        var rootElement = findBlockRoot(element);

        if (rootElement === null) {
            console.log("Can't delete section for ", element);
            return false;
        }

        console.log("Root:", rootElement);
        $(rootElement).remove();
        console.log("Block Removed:", rootElement);

        deleted++;

        return true;
    }

    var nextId = 0;

    function isFilteredPage() {
        return location.pathname !== "/home/favourites" && location.pathname !== "/home/collections" && location.pathname !== "/home/liked_fanfics" && !/^\/collections\/\d+$/.test(location.pathname);
    }

    function htmlApplyBans(addButtons) {
        //var links = document.links;
        var links = document.querySelectorAll("A[HREF]");

        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (/^\/authors\/\d+$/.test(href)) {
                if (link.innerText === "Мой профиль") {
                    continue;
                }

                var authorId = href.substring("/authors/".length);

                if (bannedAuthors[authorId]) {
                    console.log("Banned:", authorId);
                    if (isFilteredPage()) {
                        if (deleteBanned(link, authorId)) {
                            continue;
                        }
                    }
                }

                if (addButtons) {
                    if (link.children.length > 0 && link.children.item(0).nodeType === Node.ELEMENT_NODE && link.children.item(0).tagName === "IMG") {
                        continue;
                    }

                    if (link.buttons) {
                        link.buttons.remove();
                    }

                    if (bannedAuthors[authorId]) {
                        link.buttons = $("<span> </span><small>(в топке)</small>").insertAfter($(link)).click({ author: authorId, link: link }, function (event) {
                            if (confirm("Точно вернуть?")) {
                                unbanAuthor(event.data.author);
                                location.reload();
                            }
                            event.preventDefault();
                            return false;
                        }
                        );
                    }
                    else {
                        link.buttons = $("<span> </span><small>(<a href=\"#\">в топку</a>)</small>")
                            .click({ author: authorId, link: link }, function (event) {
                                if (confirm("Точно?")) {
                                    banAuthor(event.data.author);
                                    //deleteBanned(ev.data.link);
                                    htmlApplyBans(false);
                                }
                                event.preventDefault();
                                return false;
                            })
                            .insertAfter($(link));
                    }

                    //console.log("Author ban link added: " + authorId);
                }
            }
            else if (/^\/readfic\/\d+$/.test(href)) {
                var ficId = href.substring("/readfic/".length);

                if (bannedFics[ficId]) {
                    if (isFilteredPage()) {
                        console.log("Banned fic:", ficId);
                        deleteBanned(link);
                        continue;
                    }
                }

                if (addButtons) {

                    var id = "_usid_" + ++nextId;

                    if (link.buttons) {
                        link.buttons.remove();
                    }

                    link.buttons = $("<span> </span><small>(<span id='" + id + "'></span>)</small>").insertAfter($(link));

                    $("<a href=\"#\">в топку</a>")
                        .click({ fic: ficId, link: link }, function (ev) {
                            if (confirm("Точно?")) {
                                banFic(ev.data.fic);
                                //deleteBanned(ev.data.link);
                                htmlApplyBans(false);
                            }
                            ev.preventDefault();
                            return false;
                        })
                        .appendTo($("#" + id));

                    //                    $("<span> </span>").appendTo($("#" + id));
                    //                    $("<a href=\"#\">задвинуть</a>")
                    //                    .click({fic: ficId, link: link}, function (ev) {
                    //                        deleteBanned(ev.data.link);
                    //                        ev.preventDefault();
                    //                    })
                    //                    .appendTo($("#" + id));

                    console.log("Fic ban link added:", link);
                }

            }
        }

    }
    htmlApplyBans(true);

    var searchMinPages = document.querySelector("input[name='pages_min']");
    var searchMinLikes = document.querySelector("input[name='likes_min']");

    var minSizeCookieName = cookiePrefix + "filterMinSize";
    var minLikesCookieName = cookiePrefix + "filterMinLikes";

    if (searchMinPages !== null && searchMinPages.value !== '') {
        writeStorage(minSizeCookieName, searchMinPages.value);
    }
    if (searchMinLikes !== null && searchMinLikes.value !== '') {
        writeStorage(minLikesCookieName, searchMinLikes.value);
    }

    var minSize = parseInt(readStorage(minSizeCookieName));
    if (isNaN(minSize)) {
        minSize = 0;
    }

    var minLikes = parseInt(readStorage(minLikesCookieName));
    if (isNaN(minLikes)) {
        minLikes = 0;
    }

    var filtered = 0;
    var onFiltersApplied = function () { };

    var left = 0;

    function applyFilters() {
        if (!isFilteredPage()) {
            return;
        }

        var links = document.querySelectorAll("A[HREF]");

        var visible = 0, hidden = 0, insertAfter = null, insertIntoNode = null;

        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var href = link.getAttribute("href");

            if (/^\/readfic\/\d+$/.test(href)) {
                var block = findBlockRoot(link);

                if (block === null) {
                    continue;
                }

                if (insertAfter === null) {
                    insertAfter = $(block).prev();
                    insertIntoNode = block.parentNode;
                }

                if (minLikes > 0) {
                    var countEl = block.querySelector(".count");
                    if (countEl !== null) {
                        var count = countEl.innerText;
                        if (count.substring(0, 1) === "+") {
                            count = count.substring(1);
                        }
                        try {
                            count = parseInt(count);

                            if (count < minLikes) {
                                $(block).hide();
                                hidden++;
                                continue;
                            } else {
                                $(block).show();
                            }
                        } catch (e) {
                            console.log("Error:", e);
                        }
                    }
                }

                if (minSize > 0) {
                    var text = block.innerText;
                    var matches = /[ \t\r\n](\d+) страниц/.exec(text);

                    if (matches !== null && matches.length > 0) {
                        var pages = parseInt(matches[1]);

                        console.log(pages);

                        if (pages < minSize) {
                            $(block).hide();
                            hidden++;
                            continue;
                        } else {
                            $(block).show();
                        }

                    } else {
                        console.log("No page count in text", text);
                    }
                }

                visible++;
            }
        }

        if (hidden > 0 && visible === 0 && insertAfter !== null) {
            if ($("#_userscript_allfiltered").length === 0) {
                var htmlSel = $("<div class='block' style='color:red' id='_userscript_allfiltered'>Всё зафильтровано. Может на другой странице найдётся что-то подходящее...</div>");
                if (insertAfter.length === 0) {
                    htmlSel.appendTo(insertIntoNode);
                }
                else {
                    htmlSel.insertAfter(insertAfter);
                }
            }
        }
        else {
            $("#_userscript_allfiltered").remove();
        }

        left = visible;

        filtered = hidden;
        onFiltersApplied();
    }

    var cpDiv = $("<div><h2>Дополнительные фильтры</h2></div>");
    /*
    $("<A STYLE='display:block; text-decoration: none; float:right; background-color: black; color: white; border-radius: 0.25em; width: 1.85em; height: 1.85em; text-align: center' HREF='#'>x</A>").appendTo($(cpDiv)).click(function (event) {
        $(cpDiv).hide();
        event.preventDefault();
    });
    */
    $("<BR>").appendTo($(cpDiv));
    var statsDiv = $("<DIV></DIV>");
    statsDiv.appendTo(cpDiv);

    var loadingSearchPage = false;
    var loadingUrl = null;

    function loadSearchPage() {
        if (loadingSearchPage) {
            console.log('loading page already');
            return;
        }

        if (location.pathname !== '/find') {
            console.log('not a serp');
            return;
        }

        var ib = document.querySelector('#yandex_rtb_2');
        if (ib === null) {
            var ah = document.querySelectorAll('.pagination-holder');
            ib = ah.length > 0 ? ah[ah.length - 1] : null;
        }

        if (ib === null) {
            console.log('unable to find insert location');
        }

        var a_ = document.querySelectorAll("li:not(.disabled) a>.icon-arrow-right");
        var a = a_[0];
        if (a === null) {
            console.log('no next page');
        }
        a = a.parentNode;
        if (a.tagName === 'A' && a.hasAttribute("href")) {
            var nextLink = a.href;

            if (loadingUrl === nextLink) {
                return;
            }

            for (var i = 0; i < a_.length; i++) {
                var a = a_[i].parentNode;
                a.setAttribute('original-href', a.getAttribute('href'));
                a.removeAttribute('href');
            }

            console.log('Loading extra blocks from', nextLink);

            loadingUrl = nextLink;

            $.get(nextLink, null, function (data, textStatus, jqXHR) {
                var d = new DOMParser().parseFromString(data, "text/html");

                console.log('insert before:', ib, 'in:', ib.parentNode);

                var bs = d.querySelectorAll('.fanfic-thumb-block');

                console.log('blocks on page:', bs.length);

                var scrollY = window.scrollY;

                try {
                    var cc = document.createElement('div');
                    for (var i = 0; i < bs.length; i++) {
                        var b = bs[i];
                        cc.innerHTML = b.outerHTML;
                        var b = cc.childNodes[0];
                        cc.removeChild(b);
                        $(b.outerHTML).insertBefore($(ib));
                        //var n = ib.parentNode.insertBefore(b, ib);
                        console.log('Block added');
                    }

                    window.scrollY = scrollY;
                } catch (e) {
                    loadingSearchPage = false;
                    console.error(e);
                    throw e;
                }

                var nextLink = d.querySelector('li:not(.disabled) a>.icon-arrow-right');
                if (nextLink !== null) {
                    nextLink = nextLink.parentNode;
                }

                a_ = document.querySelectorAll('li:not(.disabled) a>.icon-arrow-right');
                if (a_ !== null && a_.length > 0 && nextLink !== null) {
                    for (var i = 0; i < a_.length; i++) {
                        var a = a_[i].parentNode;
                        a.setAttribute('href', nextLink.getAttribute('href'));
                    }
                }
                else {
                    console.log('Last page');
                    a_ = document.querySelectorAll('li > a > .icon-arrow-right');
                    if (nextLink !== null) {
                        for (var i = 0; i < a_.length; i++) {
                            var a = a_[i].parentNode;
                            nextLink.parentNode.parentNode.setAttribute('class', 'disabled');
                        }
                    }
                }

                htmlApplyBans(true);
                applyFilters();
            });
        }
        loadingSearchPage = false;
    }

    statsDiv.html("-");
    onFiltersApplied = function () {
        statsDiv.html("<div style='padding: 0.5em 0.5em 1.5em 0.5em'>Топка: " + deleted + "<br>Фильтр: " + filtered);

        if (left < 15 && location.pathname === '/find' && document.querySelector('.fanfic-thumb-block') !== null) {
            loadSearchPage();
        }
    };

    var filtersNode = null;

    function addFilterInput(initialValue, onValueChanged, textLabel) {
        if (filtersNode === null) {
            filtersNode = $("<div style='border-left: 5px solid #cab39e; background-color: #eae2d1; padding: 5px 15px;'>");
            filtersNode.appendTo(cpDiv);
        }
        var group = $("<div class='form-group form-group-sm'><label>" + textLabel + "</label><div class='form-inline'><input style='width: 5em' class='form-control short-number-input' id='minLinksFilter' type=number value='" + initialValue + "'>");
        var input = group.find('input');
        //$("<label for='minLinksFilter'>" + textLabel + ":</label>").appendTo(cpDiv);
        group.appendTo(filtersNode);
        input.on("input", function (event) {
            var value;
            try {
                value = parseInt(input.val());

                if (isNaN(value)) {
                    value = 0;
                }
            } catch (e) {
                value = 0;
            }

            onValueChanged(value);

            applyFilters();
        });

        return input;
    }

    var showPanel = !/^\/readfic\/\d+(?:\/\d+)?$/.test(location.pathname);

    if (showPanel && "/home/collections" === location.pathname) {
        showPanel = false;
    }

    if (showPanel) {

        var searchMinPages = document.querySelector("input[name='pages_min']");
        var searchMinLikes = document.querySelector("input[name='likes_min']");

        if (searchMinPages !== null && searchMinLikes !== null) {

            searchMinPages.addEventListener('input', function () {
                minSize = parseInt(searchMinPages.value);
                writeStorage(minSizeCookieName, minSize, 365 * 10);
                applyFilters();
            });

            searchMinLikes.addEventListener('input', function () {
                minLikes = parseInt(searchMinLikes.value);
                writeStorage(minLikesCookieName, minLikes, 365 * 10);
                applyFilters();
            });

        }
        else {
            addFilterInput(minSize, function (value) {
                minSize = value;
                writeStorage(minSizeCookieName, value, 365 * 10);
            }, "Размер");
            addFilterInput(minLikes, function (value) {
                minLikes = value;
                writeStorage(minLikesCookieName, value, 365 * 10);
            }, "Лайки");
        }

        var exportBtn = $("<input type='button' class='btn btn-default btn-block' value='Экспорт'>");
        exportBtn.click(function () {
            exportCookieData();
            exportBtn.hide();
            $('<textarea readonly></textarea>').insertAfter(exportBtn).text(exportCookieData());
        });
        cpDiv.append("<br>");
        exportBtn.appendTo(cpDiv);

        //cpDiv.appendTo("body");
        //cpDiv.attr('style', 'position: fixed; top: 0; right: 0; z-index: 999; background-color: #fff; padding: 0.5em 0.5em 0.5em 0.5em; border-radius: 1em');
        cpDiv.appendTo("#main .content-section");

        /*
        if (location.pathname === "/find") {
            cpDiv.append($("<button>Load</button>").click(function() {
                loadSearchPage();
            }));
        }
        */

    }

    var atBottom = null;
    var bottomResistance = 0;

    if (location.pathname === "/find") {
        window.addEventListener('scroll', function (ev) {
            atBottom = ((window.innerHeight + window.scrollY) >= document.body.offsetHeight);
            if (!atBottom) {
                bottomResistance = 5;
            }
        });

        window.addEventListener('mousewheel', function (ev) {
            //console.log('wheel:', ev);

            if (ev.deltaY <= 0) {
                bottomResistance = 5;
            }

            if (atBottom) {
                bottomResistance--;

                if (bottomResistance <= 0) {
                    bottomResistance = 5;
                    loadSearchPage();
                }
            }
        });
    }

    $('.fanfic-thumb-block-premium').hide();


    applyFilters();

    console.log('My ficbook.net userscript executed, f:', isFilteredPage());
}

/*$.get("https://ficbook.net/home/personal_info", null, function (data, textStatus, jqXHR) {
    var d = new DOMParser().parseFromString(data, "text/html");

    personalInfoValues = {
        'about_myself': d.querySelector('#aboutInput').value,
        'do_save': 'Сохранить+изменения',
        'www': d.querySelector('#wwwInput').value,
        'email': d.querySelector('#emailInput').value,
        'show_email': 'on',
        'icq': d.querySelector('#icqInput').value,
        'support_me': d.querySelector('#supportInput').value,
        'skype': d.querySelector('#skypeInput').value,
    };

    if (!d.querySelector("input[name='show_email']").checked) {
        delete personalInfoValues['show_email'];
    }

    var matches = banRegex.exec(personalInfoValues['about_myself']);

    if (matches) {
        localStorage.setItem('_userscript_banned_authors', matches[1]);
        localStorage.setItem('_userscript_banned_fics', matches[2]);
    }

    console.log('Профиль: ', personalInfoValues);

    setTimeout(applyFicBookFiltering, 1);
}, "text");*/

applyFicBookFiltering();
