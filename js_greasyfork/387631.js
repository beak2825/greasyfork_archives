// ==UserScript==
// @name         ForumLive
// @namespace    ForumLive
// @version      0.1.7
// @license      MIT
// @description  Outil pour faciliter l'actualisation de la liste des topics sur les forums de Jeuxvideo.com
// @author       Me
// @match        http://*.jeuxvideo.com/forums/0-*
// @match        https://*.jeuxvideo.com/forums/0-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387631/ForumLive.user.js
// @updateURL https://update.greasyfork.org/scripts/387631/ForumLive.meta.js
// ==/UserScript==

let forumUrl = undefined;
let initialized = false;
let intervalId = undefined;
let timeoutId = undefined;
let displayedPage = 0;
let currentMode = "classic";
let currentConnected = undefined;
let nbMps = undefined;
let nbNotifs = undefined;
let currentlyDisplayedTopics = undefined;
let dataTopics = {};
let requestsCounter = 0;
let topicsDOM = [];
let topicsLength = undefined;
let isOver = false;

function addCss() {
    let rules = `
        #forum-live-mode {
        }

        #forum-live-button {
            min-width: 4.5rem;
            margin-left: -75px;
        }

        .forum-live-activated .bloc-pagi-default {
            height: 28px;
        }

        .forum-live-activated .forum-live-tempo {
            border-color: blue;
        }

        .forum-live-activated .conteneur-topic-pagi:hover .topic-list {
            border-color: red;
        }

        .forum-live-hide {
            display: none!important;
        }

        .forum-live-hide-pagi-before .pagi-debut-actif,
        .forum-live-hide-pagi-before .pagi-precedent-actif {
            display: none;
        }

        .forum-live-hide-pagi-after .pagi-suivant-actif {
            display: none;
        }

        .forum-live-activated #forum-live-button {
            border: 0.0625rem solid #c28507;
            background: #f0a100;
            color: #fff;
        }

        .forum-live-new-topic-1 {
            animation-duration:0.8s;
            animation-name: slidein-1;
        }

        .forum-live-new-topic-2 {
            animation-duration:0.8s;
            animation-name: slidein-2;
        }

        @keyframes slidein-1 {
            from {
              opacity: 0.1;
            }
            to {
              opacity: 1;
            }
        }

        @keyframes slidein-2 {
            from {
              opacity: 0.1;
            }
            to {
              opacity: 1;
            }
        }
    `;
    let css = `<style type="text/css" id="forum-live-css">${rules}</style>`;
    document.head.insertAdjacentHTML("beforeend", css);
}

function normalizeForumURL(url) {
    let regex = /^.*?\/\d+-(\d+)-\d+-\d+-\d+-\d+-\d+-(.*?)\.htm.*$/i;
    let [_, num, name] = url.match(regex);
    return `https://www.jeuxvideo.com/forums/0-${num}-0-1-0-1-0-${name}.htm`;
};

function process(dom, init) {
    requestsCounter++;
    let results = parseForum(dom);
    populateTopics(results);

    if (init) {
        display(currentMode, false, true);
        return;
    }

    if (isOver) {
        return;
    }

    let topicListClasses = document.getElementsByClassName("topic-list")[0].classList;
    topicListClasses.add("forum-live-tempo");

    timeoutId = setTimeout(function () {
        topicListClasses.remove("forum-live-tempo");
        display(currentMode, true, true);
    }, 1000);

};

function updateForum() {
    // Ensure that if "Live" button is clicked/unclicked, older request does not conflict with new one
    let currentId = intervalId;

    request(forumUrl, function (response) {
        if (currentId !== intervalId) {
            return;
        }
        process(response, false);
    });
};

function request(url, callback) {
    let xhr = new XMLHttpRequest();

    xhr.ontimeout = function () {
        console.error(`La délai d'attente de la requête a expiré`);
    };

    xhr.onerror = function () {
        console.error(`La requête a échoué (${xhr.status}): ${xhr.statusText}`);
    };

    xhr.onabort = function () {
        console.error(`La requête a été interrompue pour une raison inconnue`);
    };

    xhr.onload = function () {
        if (xhr.status !== 200) {
            console.error(`La requête a retourné une erreur (${xhr.status}): ${xhr.statusText}`);
            return;
        }
        callback(xhr.response);
    };

    xhr.responseType = "document";
    xhr.timeout = 5000;

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    xhr.send();
};

function parseForum(document) {
    let connected = document.getElementsByClassName("nb-connect-fofo")[0];
    if (connected) {
        connected = parseInt(connected.textContent.trim());
    }
    let mps = document.getElementsByClassName("headerAccount__pm")[0];
    if (mps) {
        mps = parseInt(mps.getAttribute("data-val"));
    }
    let notifs = document.getElementsByClassName("headerAccount__notif")[0];
    if (notifs) {
        notifs = parseInt(notifs.getAttribute("data-val"));
    }
    let topicList = document.getElementsByClassName("topic-list")[0];
    let topics = [];
    for (let li of topicList.children) {
        if (!li.hasAttribute("data-id")) {
            continue;
        }
        let dataId = li.getAttribute("data-id");
        let topicImg = li.getElementsByClassName("topic-img")[0];
        let type = topicImg.title;
        let iconClasses = topicImg.className;
        let topicTitle = li.getElementsByClassName("topic-title")[0];
        let title = topicTitle.title;
        let href = topicTitle.href;
        let topicAuthor = li.getElementsByClassName("topic-author")[0];
        let author = topicAuthor.textContent.trim();
        let authorClass = topicAuthor.className;
        let count = parseInt(li.getElementsByClassName("topic-count")[0].textContent.trim());
        let date = li.getElementsByClassName("topic-date")[0].textContent.trim();
        topics.push({ type: type, iconClasses: iconClasses, title: title, href: href, author: author, authorClass: authorClass, count: count, date: date, dataId: dataId });
    }
    return { connected: connected, topics: topics, mps: mps, notifs: notifs };
};

function update(element, topic) {
    let authorLink;
    if (topic.author === "Pseudo supprimé") {
        authorLink = `<span class="topic-author" style="font-style: italic;">Pseudo supprimé</span>`;
    } else {
        authorLink = `<a href="https://www.jeuxvideo.com/profil/${topic.author.toLowerCase()}?mode=infos" target="_blank" class="${topic.authorClass}">${topic.author}</a>`;
    }

    let lastPage = parseInt(topic.count / 20) + 1;
    let urlLastPage = topic.href.replace("-1-0-1-0-", `-${lastPage}-0-1-0-`);

    element.setAttribute("data-id", topic.dataId);
    let topicImg = element.getElementsByClassName("topic-img")[0];
    topicImg.className = topic.iconClasses;
    topicImg.alt = topic.type;
    topicImg.title = topic.type;
    let topicTitle = element.getElementsByClassName("topic-title")[0];
    topicTitle.href = topic.href;
    topicTitle.title = topic.title;
    topicTitle.innerHTML = topic.title;
    element.getElementsByClassName("topic-author")[0].outerHTML = authorLink;
    element.getElementsByClassName("topic-count")[0].innerHTML = topic.count;
    let date = element.getElementsByClassName("topic-date")[0].getElementsByTagName("a")[0];
    date.href = urlLastPage;
    date.innerHTML = topic.date;
};

function populateTopics(results) {
    currentConnected = results.connected;
    nbMps = results.mps;
    nbNotifs = results.notifs;
    let topicsListIndex = 0;

    for (let topic of results.topics) {
        if (!dataTopics.hasOwnProperty(topic.dataId)) {
            let creationIndex = -1;
            if (topic.count <= 1) {
                creationIndex = requestsCounter + 1.0 / (topicsListIndex + 2);
            }
            dataTopic = { topic: topic, counts: [[requestsCounter, topic.count]], requestsCounter: requestsCounter, topicsListIndex: topicsListIndex, creationIndex: creationIndex, isNew: true };
            dataTopics[topic.dataId] = dataTopic;
        } else {
            dataTopic = dataTopics[topic.dataId];
            while (dataTopic.counts.length > 1 && requestsCounter - dataTopic.counts[0][0] > 60) {
                dataTopic.counts.shift();
            }
            dataTopic.isNew = false;
            dataTopic.topic = topic;
            dataTopic.counts.push([requestsCounter, topic.count]);
            dataTopic.requestsCounter = requestsCounter;
            dataTopic.topicsListIndex = topicsListIndex;
        }

        topicsListIndex++;
    }
};

function compareClassic(a, b) {
    if (a.requestsCounter > b.requestsCounter) {
        return -1;
    }
    if (a.requestsCounter < b.requestsCounter) {
        return 1;
    }
    if (a.topicsListIndex < b.topicsListIndex) {
        return -1;
    }
    if (a.topicsListIndex > b.topicsListIndex) {
        return 1;
    }
    return 0;
};

function compareNew(a, b) {
    if (a.creationIndex > b.creationIndex) {
        return -1;
    }
    if (a.creationIndex < b.creationIndex) {
        return 1;
    }
    if (a.topic.dataId > b.topic.dataId) {
        return -1;
    }
    if (a.topic.dataId < b.topic.dataId) {
        return 1;
    }
    return 0;
};

function compareHot(a, b) {
    let lenA = a.counts.length;
    let lenB = b.counts.length;

    let minA = a.counts[lenA - 1][1];
    let minB = b.counts[lenB - 1][1];
    let maxA = minA;
    let maxB = minB;

    for (let i = lenA - 2; i >= 0; i--) {
        let count = a.counts[i];
        if (requestsCounter - count[0] > 60) {
            break;
        }
        if (count[1] < minA) {
            minA = count[1];
        } else if (count[1] > maxA) {
            maxA = count[1];
        }
    }

    for (let i = lenB - 2; i >= 0; i--) {
        let count = b.counts[i];
        if (requestsCounter - count[0] > 60) {
            break;
        }
        if (count[1] < minB) {
            minB = count[1];
        } else if (count[1] > maxB) {
            maxB = count[1];
        }
    }

    let diffA = maxA - minA;
    let diffB = maxB - minB;


    if (diffA > diffB) {
        return -1;
    }
    if (diffB > diffA) {
        return 1;
    }

    let lastA = a.counts[lenA - 1][0];
    let lastB = b.counts[lenB - 1][0];

    if (lastA > lastB) {
        return -1;
    }
    if (lastB > lastA) {
        return 1;
    }

    if (a.topic.count > b.topic.count) {
        return -1;
    }
    if (b.topic.count > a.topic.count) {
        return 1;
    }
    return 0;
};

function slideIn(elem) {
    if (elem.classList.contains("forum-live-new-topic-1")) {
        elem.classList.remove("forum-live-new-topic-1");
        elem.classList.add("forum-live-new-topic-2");
    } else {
        elem.classList.remove("forum-live-new-topic-2");
        elem.classList.add("forum-live-new-topic-1");
    }
};

function display(mode, slidingIn, refresh) {
    document.getElementsByClassName("nb-connect-fofo")[0].innerHTML = `${currentConnected} connecté(s)`;

    if (nbMps !== undefined) {
        let mps = document.getElementsByClassName("headerAccount__pm")[0];
        if (mps && parseInt(mps.getAttribute("data-val")) !== nbMps) {
            if (nbMps === 0) {
                mps.classList.remove("has-notif");
            } else {
                mps.classList.add("has-notif");
            }
            mps.setAttribute("data-val", nbMps);
        }
    }

    if (nbNotifs !== undefined) {
        let notifs = document.getElementsByClassName("headerAccount__notif")[0];
        if (notifs && parseInt(notifs.getAttribute("data-val")) !== nbNotifs) {
            if (nbNotifs === 0) {
                notifs.classList.remove("has-notif");
            } else {
                notifs.classList.add("has-notif");
            }
            notifs.setAttribute("data-val", nbNotifs);
        }
    }

    let topics;

    if (refresh) {
        topics = Object.values(dataTopics);
        currentlyDisplayedTopics = JSON.parse(JSON.stringify(topics));
    } else {
        topics = currentlyDisplayedTopics;
    }

    if (mode == "classic") {
        topics.sort(compareClassic);
    } else if (mode == "new") {
        topics.sort(compareNew);
    } else if (mode == "hot") {
        topics.sort(compareHot);
    }

    let maxPage = parseInt((topics.length - 1) / topicsLength);
    let mainClasses = document.getElementById("forum-main-col").classList;

    if (displayedPage === 0) {
        mainClasses.add("forum-live-hide-pagi-before");
    } else {
        mainClasses.remove("forum-live-hide-pagi-before");
    }

    if (displayedPage === maxPage) {
        mainClasses.add("forum-live-hide-pagi-after");
    } else {
        mainClasses.remove("forum-live-hide-pagi-after");
    }

    let displayedTopics = topics.slice(displayedPage * topicsLength, (displayedPage + 1) * topicsLength);

    let changed = false;

    for (let i = displayedTopics.length - 1; i >= 0; i--) {
        let topic = displayedTopics[i];
        let elem = topicsDOM[i];
        elem.classList.remove("forum-live-hide");
        if (slidingIn) {
            let len = topic.counts.length;
            if (mode === "classic") {
                if (!changed && (len < 2 || (topic.counts[len - 1][1] > topic.counts[len - 2][1]))) {
                    changed = true;
                }
                if (changed && requestsCounter > 1 && topic.topic.type !== "Topic épinglé") {
                    slideIn(elem)
                }
            } else if (mode === "new") {
                if (topic.isNew && topic.creationIndex !== -1) {
                    topic.isNew = false;
                    slideIn(elem);
                }
            } else if (mode === "hot") {
                if (elem.getAttribute("data-id") !== topic.topic.dataId) {
                    slideIn(elem);
                }
            }
        } else {
            elem.classList.remove("forum-live-new-topic-1");
            elem.classList.remove("forum-live-new-topic-2");
        }

        update(elem, topic.topic);
    }

    for (let i = displayedTopics.length; i < topicsLength; i++) {
        topicsDOM[i].classList.add("forum-live-hide");
    }

    if (document.activeElement.classList.contains("lien-jv")) {
        document.activeElement.blur();
    }
};

function addForumLiveButton() {
    let button = `<button id="forum-live-button" class="btn btn-actu-new-list-forum btn-actualiser-forum">Live</button>`;
    let blocPreRight = document.getElementsByClassName("bloc-pre-right")[0];
    if (!blocPreRight) {
        console.error("Could not find 'Actualiser' button");
        return;
    }
    blocPreRight.insertAdjacentHTML("afterbegin", button);
}

function addForumLiveSelect() {
    let select = `
    <div class="forum-live-hide" id="forum-live-mode">
        <select id="forum-live-select" title="Choisir le critère de tri des topics">
            <option value="classic">Classique</option>
            <option value="new">Nouveau</option>
            <option value="hot">Tendance</option>
        </select>
    </div>
    `;
    let pagiBefore = document.getElementsByClassName("pagi-before-list-topic")[0];
    if (!pagiBefore) {
        console.error("Could not find 'pagi-before-list-topic' button");
        return;
    }
    pagiBefore.insertAdjacentHTML("afterend", select);
}

function bindForumLiveSelect() {
    let select = document.getElementById("forum-live-select");
    select.addEventListener("change", changeMode);
}

function changeMode(event) {
    currentMode = event.target.value;
    display(currentMode, false, false);
};

function bindForumLiveButton() {
    let button = document.getElementById("forum-live-button");
    button.addEventListener("click", toggleForumLive);
}

function isActivated() {
    return document.getElementById("forum-main-col").classList.contains("forum-live-activated");
}

function toggleForumLive(event) {
    event.stopImmediatePropagation()

    if (!initialized) {
        initialized = true;

        // TamperMonkey / Chrome bug: https://github.com/Tampermonkey/tampermonkey/issues/705#issuecomment-493895776
        if (window) {
            if (window.clearTimeout) {
                window.clearTimeout = window.clearTimeout.bind(window);
            }
            if (window.clearInterval) {
                window.clearInterval = window.clearInterval.bind(window);
            }
            if (window.setTimeout) {
                window.setTimeout = window.setTimeout.bind(window);
            }
            if (window.setInterval) {
                window.setInterval = window.setInterval.bind(window);
            }
        }

        for (let elem of document.getElementsByClassName("topic-list")[0].children) {
            if (!elem.hasAttribute("data-id")) {
                continue;
            }
            elem.className = "";  // Remove blue overlay for deleted topic
            topicsDOM.push(elem);
        }
        topicsLength = topicsDOM.length;

        forumUrl = normalizeForumURL(document.URL);

        addForumLiveSelect();
        bindForumLiveSelect();

        document.getElementsByClassName("conteneur-topic-pagi")[0].addEventListener("mouseenter", function (event) {
            isOver = true;
            clearTimeout(timeoutId);
            document.getElementsByClassName("topic-list")[0].classList.remove("forum-live-tempo");
            timeoutId = undefined;
        })

        document.getElementsByClassName("conteneur-topic-pagi")[0].addEventListener("mouseleave", function (event) {
            isOver = false;
        });

        for (let bloc of document.getElementsByClassName("bloc-pagi-default")) {
            let pagiPrevious = bloc.getElementsByClassName("pagi-before-list-topic")[0];
            pagiPrevious.innerHTML = `<span><a href="${forumUrl}" class="pagi-debut-actif icon-back2"><span>Début</span></a></span><span><a href="${forumUrl}" class="pagi-precedent-actif icon-back"><span>Page précédente</span></a></span>`;

            let pagiNext = bloc.getElementsByClassName("pagi-before-list-topic")[1];
            pagiNext.innerHTML = `<span><a href="${forumUrl.replace("-1-0-1-0-", "-1-0-26-0-")}" class="pagi-suivant-actif icon-next4"><span>Page suivante</span></a></span>`;
        }


        function pageDebut(event) {
            if (!isActivated()) {
                return;
            }
            event.preventDefault();
            displayedPage = 0;
            display(currentMode, false, false);
        };

        function pagePrecedent(event) {
            if (!isActivated()) {
                return;
            }
            event.preventDefault();
            displayedPage--;
            display(currentMode, false, false);
        };

        function pageSuivant(event) {
            if (!isActivated()) {
                return;
            }
            event.preventDefault();
            displayedPage++;
            display(currentMode, false, false);
        }

        for (let elem of document.getElementsByClassName("pagi-debut-actif")) {
            elem.addEventListener("click", pageDebut);
        }

        for (let elem of document.getElementsByClassName("pagi-precedent-actif")) {
            elem.addEventListener("click", pagePrecedent);
        }

        for (let elem of document.getElementsByClassName("pagi-suivant-actif")) {
            elem.addEventListener("click", pageSuivant);
        }

    }

    document.getElementById("forum-main-col").classList.toggle("forum-live-activated");
    let mode = document.getElementById("forum-live-mode");
    mode.classList.toggle("forum-live-hide");

    if (isActivated()) {
        for (let topic of topicsDOM) {
            for (let link of topic.getElementsByClassName("lien-jv")) {
                link.setAttribute("target", "_blank");
            }
        }
        process(document, true);
        intervalId = setInterval(updateForum, 5000);
    } else {
        clearTimeout(intervalId);
        intervalId = undefined;
        displayedPage = 0;
        display("classic", false, true);
        dataTopics = {};
        requestsCounter = 0;
        document.getElementById("forum-main-col").classList.remove("forum-live-hide-pagi-after");
        document.getElementById("forum-main-col").classList.add("forum-live-hide-pagi-before");
        document.getElementsByClassName("topic-list")[0].classList.remove("forum-live-tempo");
        for (let topic of topicsDOM) {
            for (let link of topic.getElementsByClassName("lien-jv")) {
                link.removeAttribute("target");
            }
        }
    }
}

function main() {
    addCss();
    addForumLiveButton();
    bindForumLiveButton();
}

main();
