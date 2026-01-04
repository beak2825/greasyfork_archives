// ==UserScript==
// @name            naughty-blog-torrent-links
// @namespace       https://gitlab.com/aspootarya
// @version         2023.03.17
// @description  Add search links to naughty blog posts
// @author          aspootarya
// @match           http://www.naughtyblog.org/*
// @match           https://www.naughtyblog.org/*
// @grant           none
// @require         https://cdnjs.cloudflare.com/ajax/libs/lockr/0.8.4/lockr.min.js
// @description Add search links to naughty blog posts
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/406954/naughty-blog-torrent-links.user.js
// @updateURL https://update.greasyfork.org/scripts/406954/naughty-blog-torrent-links.meta.js
// ==/UserScript==

Lockr.prefix = "naughty-blog-torrent-links-";
const seenPosfix = "seen";
const selectedPosfix = "selected";
const SEPARATOR = "-";
const buttonStyle = "color: #444444; background: #F3F3F3; border: 1px #DADADA solid; padding: 5px 10px; border-radius: 2px; font-weight: bold; font-size: 9pt; outline: none;";

measurePerformance(addSearchLinksToPosts);

function measurePerformance(fn) {
    console.group("naughty-blog-torrent-links");
    const t0 = performance.now();
    try {
        fn();
    } catch (err) {
        console.error("There was error(s)", err);
    }
    const t1 = performance.now();
    console.log(`naughty-blog-torrent-links version ${GM_info.script.version} took ${t1 - t0} milliseconds to run.`);
    console.groupEnd();
}

function addSearchLinksToPosts() {
    const posts = Array.from(document.querySelectorAll(".post"));
    console.debug(`Found ${posts.length} posts to add links`);
    posts.map(addSearchLinksToPost);

    const insertionElement = document.querySelector("#recentposts");
    if (!insertionElement) {
        console.log("Não foi encontrado elemento de inserção. Verifique se os botoes de visualizar e apagar BD estão presentes");
    } else {
        addViewDB(insertionElement);
        addCleanDB(insertionElement);
        insertionElement.remove();
    }
}

function addViewDB(insertionElement) {
    const viewButton = document.createElement("button");
    viewButton.innerHTML = "View DB";
    viewButton.style = buttonStyle;
    viewButton.addEventListener("click", viewDB, true);
    insertionElement.insertAdjacentElement('beforebegin', viewButton);
}

function addCleanDB(insertionElement) {
    const cleanButton = document.createElement("button");
    cleanButton.innerHTML = "Clean Viewed History";
    cleanButton.style = buttonStyle;
    cleanButton.addEventListener("click", cleanDB, true);
    insertionElement.insertAdjacentElement('afterend', cleanButton);
}

function addSearchLinksToPost(postElem) {
    const post = getPostFromElement(postElem);
    console.debug(post);
    if (!post) return;

    const header = postElem.querySelector(".post-header-overview");
    if (!header) return;

    addStatusCheckbox(header, post);

    if (post.actress) {
        const sanitizedTitleForActress = post.title
            .replace(/[^a-zA-Z0-9]/g, "")
            .split(" ")
            .join("")
            .trim();
        const titleActress = `${sanitizedTitleForActress} ${post.actress}`
        header.appendChild(createSearchLink(titleActress, post));
        header.appendChild(createSearchLink(post.actress, post));
    } else {
        const sanitizedTitle = post.title
            .replace(/[^a-zA-Z0-9]/g, " ")
            .replace("#", "")
            .trim();
        header.appendChild(createSearchLink(sanitizedTitle, post));
    }
    header.appendChild(createSearchLink(post.content, post));
}

function getPostFromElement(postElem) {
    const { id } = postElem;
    const titleElem = postElem.querySelector(".post-title");
    if (!titleElem) {
        console.error(`Could not find element ${postElem}`);
        return;
    }

    const titleText = titleElem.textContent.trim();
    const hasActress = titleText.includes(SEPARATOR);
    const [title, actress] = hasActress
        ? titleText.split(` ${SEPARATOR} `)
        : [titleText, undefined];

    const contentElem = postElem.querySelector("strong");
    if (!contentElem) {
        return { title, actress, date: undefined, content: undefined };
    }
    const contentText = contentElem.textContent.trim();
    const content = contentText.includes(SEPARATOR)
        ? contentText.split(` ${SEPARATOR} `)[1]
        : contentText;

    const dateElem = postElem.querySelector(".post-date");
    const date = dateElem ? dateElem.textContent.trim() : undefined;

    return { id, title, actress, date, content };
}

function createSearchLink(query, post) {
    const search = document.createElement("p");
    const rarbglink = document.createElement("a");
    rarbglink.href = `https://rarbg.is/torrents.php?search=${query}&category%5B%5D=4`;
    rarbglink.target = '_blank';
    rarbglink.dataset.post = JSON.stringify(post);
    rarbglink.style = 'text-decoration: underline;';
    rarbglink.innerText = 'RARBG';
    const leetxlink = document.createElement("a");
    leetxlink.href = `https://1337xx.to/sort-search/${query}/time/desc/1/`;
    leetxlink.target = '_blank';
    leetxlink.dataset.post = JSON.stringify(post);
    leetxlink.style = 'text-decoration: underline;';
    leetxlink.innerText = '1337x';

    search.appendChild(rarbglink);
    search.innerHTML += "&nbsp;";
    search.appendChild(leetxlink);
    search.innerHTML += `&nbsp;${query}`;
    return search;
}

function addStatusCheckbox(elem, post) {
    const form = document.createElement("form");

    const checkSeen = document.createElement("input");
    checkSeen.setAttribute("type", "checkbox");
    checkSeen.setAttribute("id", `check-seen-${post.id}`);
    checkSeen.checked = Lockr.sismember(seenPosfix, JSON.stringify(post));
    if (!Lockr.sismember(seenPosfix, JSON.stringify(post))) {
        checkSeen.disabled = true;
        Lockr.sadd(seenPosfix, JSON.stringify(post));
    }
    checkSeen.dataset.post = JSON.stringify(post);
    checkSeen.style = "padding: 5px";
    checkSeen.addEventListener("click", toggleSeen);

    const labelSeen = document.createElement("label");
    const textSeen = document.createTextNode("Viewed");
    labelSeen.setAttribute("for", `check-seen-${post.id}`);
    labelSeen.style = "padding: 5px";
    labelSeen.appendChild(textSeen);

    const checkSelected = document.createElement("input");
    checkSelected.setAttribute("type", "checkbox");
    checkSelected.setAttribute("id", `check-selected-${post.id}`);
    checkSelected.checked = Lockr.sismember(selectedPosfix, JSON.stringify(post));
    checkSelected.dataset.post = JSON.stringify(post);
    checkSelected.style = "padding: 5px";
    checkSelected.addEventListener("click", toggleSelected);

    const labelSelected = document.createElement("label");
    const textSelected = document.createTextNode("Selected");
    labelSelected.setAttribute("for", `check-selected-${post.id}`);
    labelSelected.style = "padding: 5px";
    labelSelected.appendChild(textSelected);

    form.appendChild(checkSeen);
    form.appendChild(labelSeen);

    form.appendChild(checkSelected);
    form.appendChild(labelSelected);

    elem.appendChild(form);
}

function toggleSeen(event) {
    const post = event.target.dataset.post;
    if (event.target.checked && !Lockr.sismember(seenPosfix, JSON.stringify(post))) {
        Lockr.sadd(seenPosfix, post);
    } else {
        Lockr.srem(seenPosfix, post);
    }
}

function toggleSelected(event) {
    const post = event.target.dataset.post;
    if (event.target.checked) {
        Lockr.sadd(selectedPosfix, post);
    } else {
        Lockr.srem(selectedPosfix, post);
    }
}

function viewDB() {
    const localSeenStorageKey = Lockr.prefix + seenPosfix;
    if (!localStorage[localSeenStorageKey]) {
        console.log("Nothing seen yet!");
        return;
    }
    const storageSeen = JSON.parse(localStorage[localSeenStorageKey]);
    const parsedSeenStorage = storageSeen.data.map(JSON.parse);
    console.log("Viewed items:");
    console.table(parsedSeenStorage);

    const localSelectedStorageKey = Lockr.prefix + selectedPosfix;
    if (!localStorage[localSelectedStorageKey]) {
        console.log("Nothing selected yet!");
        return;
    }
    const storageSelected = JSON.parse(localStorage[localSelectedStorageKey]);
    const parsedSelectedStorage = storageSelected.data.map(JSON.parse);
    console.log("Selected items:");
    console.table(parsedSelectedStorage);
}

function cleanDB() {
    console.log("History cleaned!!");
    Lockr.flush();
}
