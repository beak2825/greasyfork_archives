
// ==UserScript==
// @name         Anti Manga Rock
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      1.0.6
// @description  try to take over the world!
// @author       You
// @match        https://mangarock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381874/Anti%20Manga%20Rock.user.js
// @updateURL https://update.greasyfork.org/scripts/381874/Anti%20Manga%20Rock.meta.js
// ==/UserScript==

(function() {
    var nextChapter;
    var prevChapter;
    var remaining;
    var url;
    var currentChapter;
    var api = {
        base: "https://api.mangarockhd.com/query/web401",
        detail: function() { return this.base + "/manga_detail"},
        pages: function(chapterId) {
            return this.base + "/pages?oid=mrs-chapter-" + chapterId;
        }
    };

    var getNextChapterUrl = () => {
        var currOid = location.href.match(/mrs-serie-([^/]*)/)[1];
        var body = JSON.stringify({
            oids: {
                ['mrs-serie-' + currOid]: 0
            },
            sections: ['chapters']
        });


        fetch(api.detail(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body
        })
        .then((response) => response.json())
        .then((data) => {
            var chapters = data.data['mrs-serie-' + currOid].chapters.chapters;
            var index = chapters.findIndex(c => c.oid === 'mrs-chapter-' + currentChapter);
            remaining = (chapters.length -1) - index;

            if (index !== chapters.length - 1) {
                nextChapter = chapters[index + 1].oid;
            }

            if (chapters.length !== 1) {
                prevChapter = chapters[index - 1].oid;
            }

            onAfterGenerate();
        });
    };

    var isChapter = () => {
        url = window.location.href;
        return url.indexOf("mrs-chapter") > -1;
    };

    var cleanPage = () => {
        var title = document.querySelector("head title").innerHTML;
        window.stop();
        document.head.innerHTML = "<title>" + title + "</title>";
        document.body.innerHTML = "<div id='load'>Cargando...</div>";
        addCss();
    };

    var getPagesList = () => {
        fetch(api.pages(currentChapter))
        .then((response) => response.json())
        .then((data) => getPages(data.data));
    };

    var getPages = (pagesList) => {
        var images = new Array(pagesList.length);
        var promiseList = [];

        pagesList.forEach((url, index) => {
            var p = new Promise((resolve, reject) => {
                fetch(url)
                .then((response) => response.arrayBuffer())
                .catch((e) => reject("Error on " + index + ": " + e))
                    .then((buffer) => {
                        images[index] = decodeImage(new Uint8Array(buffer));
                        resolve();
                    });
            });

            promiseList.push(p);
        });

        Promise.all(promiseList)
        .then(() => onImagesLoaded(images))
        .catch((e) => console.error(e));
    };

    var decoder = (t) => {
        var e = function(t) {
            for (var e = [], n = 0; n < t.length; n += 32768) {
                e.push(String.fromCharCode.apply(null, t.subarray(n, n + 32768)));
            }
            return e.join("")
        }(t);
        return btoa(e);
    };

    var decodeImage = (b) => {
        if (b[0] == 69 && (b = function(b) {
            var e = new Uint8Array(b.length + 15),
                n = b.length + 7;
            e[0] = 82,
            e[1] = 73,
            e[2] = 70,
            e[3] = 70,
            e[7] = n >> 24 & 255,
            e[6] = n >> 16 & 255,
            e[5] = n >> 8 & 255,
            e[4] = 255 & n,
            e[8] = 87,
            e[9] = 69,
            e[10] = 66,
            e[11] = 80,
            e[12] = 86,
            e[13] = 80,
            e[14] = 56;
            for (var r = 0; r < b.length; r++) {
                e[r + 15] = 101 ^ b[r];
            }
            return e;
        }(b))) {
           return "data:image/webp;base64," + decoder(b);
        } else {
            return "";
        }
    };

    var onImagesLoaded = (images) => {
        var str = "";

        for (var i = 0; i < images.length; i++) {
            str += `<div><img src="${images[i]}"/></div>`;
        }

        var list = document.createElement("div");
        list.id = "list";
        list.innerHTML = str;
        document.body.appendChild(list);

        list.addEventListener("click", (e) => {
            if (e.target.tagName.toLowerCase() !== "img") {
                return;
            }

            var node = e.target;
            if (node.style.maxWidth === "100%") {
                node.style.maxWidth = "none";
            } else {
                node.style.maxWidth = "100%";
            }
        });

        var load = document.getElementById("load");
        load.parentNode.removeChild(load);
        onAfterGenerate();
    };

    var addCss = () => {
        var node = document.createElement("style");
        node.innerHTML = `
            body {
             line-height: 0;
             background: #333;
             font-family: sans-serif;
             margin: 0;
             text-align: center;
            }
            #load {
             margin-top: 20%;
             color: white;
            }
            #list {
             max-width:100%
            }
            img {
             max-width:100%;
            }
            #info {
             color: white;
             line-height: 1rem;
            }
            .chapters {
             margin: 20px 0;
             color: white;
             background: #0096d1;
             display: inline-block;
             text-decoration: none;
             padding: 10px;
             border-radius: 5px;
             text-shadow: 1px 1px 1px #00425c;
             line-height: 1rem;
            }
            .chapters.disabled {
             background: silver;
             text-shadow: 0;
            }
            #bar:after {
              content: '';
              display: block;
              clear: both;
            }
            #prev {
             float: left;
             margin-left: 20px;
            }
            #next {
             float: right;
             margin-right: 20px;
            }
            #nextInfo {
             margin-top: 30px;
             display: inline-block;
             color: #DDD;
             line-height: 1rem;
            }
@media only screen and (min-width: 1000px) {
            #prev {
              margin-left: 35%
            }
            #next {
              margin-right: 35%;
            }
}
@media only screen and (min-width: 760px) and (max-width: 1000px) {
            #prev {
              margin-left: 15%
            }
            #next {
              margin-right: 15%;
            }
}

        `;
        document.body.appendChild(node);
    };

    var generate = () => {
        currentChapter = url.split("/mrs-chapter-")[1];
        attachPopStateEvent();

        var onGenerate = () => {
            cleanPage();
            getPagesList();
            getNextChapterUrl();
        };

        if (document.body) {
            onGenerate();
            return;
        }

        var observer = new MutationObserver(function() {
            if (document.body) {
                observer.disconnect();
                onGenerate();
            }
        });
        observer.observe(document.documentElement, {childList: true});
    };

    var attachPopStateEvent = () => {
        window.onpopstate = () => {
            if (!isChapter()) {
                window.location.reload();
            }
        }
    };

    var attachPushWrapping = () => {
        var historyPushState = history.__proto__.pushState;

        history.__proto__.pushState = function() {
            historyPushState.apply(this, arguments);
            if (isChapter()) {
                generate();
            }
        }
    };


    var onAfterGenerate = () => {
        var list = document.querySelector("#list");
        if (!list || remaining === undefined) {
            return;
        }

        var urlPrev = prevChapter && location.href.split('mrs-chapter-')[0] + prevChapter;
        var urlNext = nextChapter && location.href.split('mrs-chapter-')[0] + nextChapter;
        var nextInfo = "Restantes: " + remaining;

        var getHref = val => val ? "href='" + val + "'" : "";

        var template = `<div id="bar">
            <a class="chapters ${prevChapter || 'disabled'}" id="prev" ${getHref(urlPrev)}>Prev.</a>
            <div id="nextInfo">${nextInfo}</div>
            <a class="chapters ${nextChapter || 'disabled'}" id="next" ${getHref(urlNext)}>Sig.</a>`;

        list.insertAdjacentHTML('afterbegin', template);
        list.insertAdjacentHTML('beforeend', template);

        document.addEventListener("keyup", function(e) {
            const rightArrow = "39";
            if (e.keyCode == rightArrow) {
                location.href = url;
            }
        });
    };

    var main = () => {
        if (!isChapter()) {
            attachPushWrapping();
            return;
        }

        generate();
    };

    main();
})();