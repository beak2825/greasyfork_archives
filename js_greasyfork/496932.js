// ==UserScript==
// @name        Самиздат (samlib.ru) как надо
// @namespace   Azazar's Scripts
// @description Убирает рекламу, позволяет читать скрытые комментарии, постить комментарии там, где они отключены, смотреть отключенные оценки.
// @match       *://samlib.ru/*
// @version     1.03
// @grant       none
// @license     MIT
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496932/%D0%A1%D0%B0%D0%BC%D0%B8%D0%B7%D0%B4%D0%B0%D1%82%20%28samlibru%29%20%D0%BA%D0%B0%D0%BA%20%D0%BD%D0%B0%D0%B4%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/496932/%D0%A1%D0%B0%D0%BC%D0%B8%D0%B7%D0%B4%D0%B0%D1%82%20%28samlibru%29%20%D0%BA%D0%B0%D0%BA%20%D0%BD%D0%B0%D0%B4%D0%BE.meta.js
// ==/UserScript==

(function() {
    var _$;
    var A$;

    function _(s) {
        A$ = document.querySelectorAll(s);
        _$ = A$.length > 0 ? A$[0] : null;
        return _$;
    }

    function findElementByText(s, text, partialMatch) {
        if (_(s) === null) {
            return null;
        }

        text = text.trim();

        for(var i = 0; i < A$.length; i++) {
            if (partialMatch) {
                if (A$[i].innerText.indexOf(text) !== -1) {
                    return A$[i];
                }
            }
            else {
                if (text === A$[i].innerText.trim()) {
                    return A$[i];
                }
            }
        }

        return null;
    }

    function C$(tagName, attrs, parent, children) {
        var e = document.createElement(tagName);

        if (attrs === undefined) {
        }
        else if (attrs !== null && typeof attrs === "object") {
            for(var n in attrs) {
                e.setAttribute(n, attrs[n]);
            }
        }
        else {
            console.warn("Bad attrs parameter:", attrs);
        }

        if (children === undefined) {
        }
        else if (children !== null) {
            if (typeof children === "object") {
                if (children.constructor.name === "Array") {
                    children.forEach(function(c) {
                        e.appendChild(c)
                    });
                }
                else {
                    e.appendChild(children);
                }
            }
            else if (typeof children === "string") {
                e.appendChild(document.createTextNode(children));
            }
            else {
                console.warn("Bad children parameter:", children);
            }
        }

        if (parent !== null) {
            parent.appendChild(e);
        }

        return e;
    }

    function removeNode() {
        var node = arguments.length === 0 ? _$ : arguments[0];

        if (node === null || node.parentNode === null) {
            return;
        }

        node.parentNode.removeChild(node);
    }

    // Реклама всё равно сделана бестолково, и вряд ли приносит прибыль.
    // Лучше бы пожертвования собирали.
    if (_("TD[BGCOLOR='#fbfafa']") !== null) {
        console.log("Реклама боковая:", _$);
        removeNode();
    }
    else if (_("TABLE[STYLE='border: solid #8e5373 2px; margin-bottom: 3px;']")) {
        console.log("Реклама в шапке:", _$);
        removeNode();
    }

    var section = null;
    var authorLetter = null;
    var authorId = null;
    var bookId = null;

    var authorUri = null;
    var bookUri = null;

    {
        var m;

        if ((m = /^\/([A-Za-z0-9]{1,2})\/([A-Za-z0-9_-]+)\/(?:([A-Za-z0-9_-]+)\.shtml)?(?:$|\?)/.exec(location.pathname)) !== null) {
            authorLetter = m[1];
            authorId = m[2];
            bookId = m[3];

            section = bookId ? "book" : "author";

            console.log("Совпал шаблон пути:", section, authorLetter, authorId, bookId);

        }
        else if ((m = /^\/(comment)\/([A-Za-z0-9-]{1,2})\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)?(?:$|\?)/.exec(location.pathname)) !== null) {
            section = m[1];
            authorLetter = m[2];
            authorId = m[3];
            bookId = m[4];

            console.log("Совпал шаблон пути:", section, authorLetter, authorId, bookId);

        }
        else {
            console.log("Не совпал шаблон пути:", location.pathname);
        }

        if (authorId && authorLetter) {
            authorUri = "/" + authorLetter + "/" + authorId;
        }

        if (authorUri && bookId) {
            bookUri = authorUri + "/" + bookId;
        }

    }

    if ("book" === section) {
        if (_("FORM[ACTION='/cgi-bin/votecounter']") !== null) {
            if (_$.innerText === "") {
                console.log("Оценки отключены");

                _$.innerHTML = _$.innerHTML.replace(/<!--[\r\n\t ]+1/, "").replace(/1[\r\n\t ]+-->/, "");

                console.log("Но мы это исправили");
            }
            else if (/<!--[\t\r\n ]+1[\t\r\n ]+Оценка:/) {
                console.log("Отображение оценок отключено");

                _$.innerHTML = _$.innerHTML.replace(/<!--[\r\n\t ]+1/, "").replace(/1[\r\n\t ]+-->/, "");

                console.log("Но мы это исправили");
            }
        }

        if (_("UL>LI>A[HREF]") !== null) {
            var list = null;
            var addComments = true;

            for(var i = 0; i < A$.length; i++) {
                if (list === null) {
                    list = A$[i].parentNode.parentNode;
                }

                var href = A$[i].getAttribute("HREF");

                if (/^\/cgi-bin\/comment\?/.test(href)) {
                    addComments = false;
                    break;
                }
                else if (/^\/comment\//.test(href)) {
                    addComments = false;
                    break;
                }
            }

            console.log("Проверка комментов:", addComments, list);

            if (addComments) {
                console.log("Добавляем линки на комменты");
                C$("A", {"HREF": "/comment" + bookUri}, C$("LI", undefined, list), "Комментарии (отключены)");
                C$("A", {"HREF": "/cgi-bin/comment?COMMENT=" + bookUri}, C$("LI", undefined, list), "Оставить комментарий (хоть и отключены они)");
            }

            console.log("Перенос текста");

            var b = document.body;
            var s = null;
            var container = null;
            var lastComment = null;

            for(var i = 0; i < b.childNodes.length; i++) {
                var n = b.childNodes[i];

                //console.log(n);

                if (s === null) {
                    var startingComment = (n.nodeType === Node.COMMENT_NODE && n.textContent === "--------- Собственно произведение -------------");

                    if (startingComment) {
                        console.log("Стартовый коммент найден:", n);

                        container = document.createElement("DIV");
                        n.parentNode.insertBefore(container, b.childNodes[i + 1]);
                        i++;
                        s = "text";
                    }

                    continue;
                }

                if (s === "text") {
                    console.log(n);

                    if (n.nodeType === Node.COMMENT_NODE) {
                        lastComment = n;
                    }

                    var endingComment = (lastComment !== null && lastComment.nodeType === Node.COMMENT_NODE && lastComment.textContent === "-----------------------------------------------");
                    if (endingComment && n.tagName === "HR") {
                        console.log("Конец произведения найден:", n);

                        s = "end";
                        break;
                    }

                    n.parentNode.removeChild(n);
                    container.appendChild(n);
                    i--;

                    continue;
                }
            }

            if (container) {
                var style = "font-size: 2em; line-height: 1em";

                function applyStyles() {
                    var sw = window.innerWidth - 800;
                    if (sw <= 0) {
                        sw = 0;
                    }
                    var hsw = sw / 2;
                    container.setAttribute("style", style + '; padding: 0 ' + hsw + 'px 0 ' + hsw + 'px');
                }

                window.addEventListener("resize", function () {
                    applyStyles();
                });
                applyStyles();
            }

        }

        // Add download attribute for FB2 anchor
        let authorElement = _('div h3');
        let titleElement = _('center h2');
        let fb2AnchorElement = _('small ul li a[href$=".fb2.zip"]');

        if (authorElement && titleElement && fb2AnchorElement) {
            let author = authorElement.innerText.split(':')[0].trim();
            let title = titleElement.innerText.trim();
            let originalFileExtension = 'fb2.zip';

            fb2AnchorElement.setAttribute("download", `${title}. ${author}.${originalFileExtension}`);
        }

    }

    if ("comment" === section) {
        var addCommentElement = findElementByText("A", "Добавить комментарий");

        if (addCommentElement === null) {
            var addLinkBefore = findElementByText("BODY>CENTER>SMALL", "Отсортировано по:", true);

            console.log("Комменты отключены, но линк мы добавим перед этим:", addLinkBefore);

            if (addLinkBefore) {
                addLinkBefore.parentNode.insertBefore(C$("A", {"HREF": "/cgi-bin/comment?COMMENT=" + bookUri}, null, C$("B", null, null, "Добавить комментарий(они отключены как-бы)")), addLinkBefore);
            }
        }
    }

    console.log("Userscript для Самиздата отработал");
})();