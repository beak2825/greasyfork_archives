// ==UserScript==
// @name            Thumblr Seen
// @name:en         Thumblr Seen
// @namespace       https://gitlab.com/xaxim
// @version         0.3.0
// @description:en  Marks posts already seen on thumblr
// @author          Xaxim
// @match           https://www.tumblr.com/dashboard
// @match           https://www.tumblr.com/dashboard/*
// @grant           none
// @require         https://cdnjs.cloudflare.com/ajax/libs/lockr/0.8.4/lockr.min.js
// @description     Marks posts already seen on thumblr
// @downloadURL https://update.greasyfork.org/scripts/30674/Thumblr%20Seen.user.js
// @updateURL https://update.greasyfork.org/scripts/30674/Thumblr%20Seen.meta.js
// ==/UserScript==

Lockr.prefix = "thumblrseen_";
const seenPosfix = "seen";

measurePerformance(markAlreadySeenPosts);

function measurePerformance(fn) {
    console.clear();
    const t0 = performance.now();
    try {
        fn();
    } catch (err) {
        console.error("There was error(s)", err);
    }
    const t1 = performance.now();
    console.log(
        `thumblrseen version ${GM_info.script.version}: It took ${t1 -
        t0} milliseconds.`
    );
}

function markAlreadySeenPosts() {
    const posts = Array.from(document.querySelectorAll(".post_container"));
    posts.forEach(markAlreadySeenPost);
    const hook = document.querySelector("#post_controls_avatar");
    if(hook) {
        addCleanDB(hook, 'afterend');
        addViewDB(hook, 'afterend');
    }
}

function markAlreadySeenPost(article) {
    const { pageable } = article.dataset;
    if (Lockr.sismember(seenPosfix, pageable)) {
        article.prepend(createAlreadySeen(pageable));
    } else {
        Lockr.sadd(seenPosfix, pageable);
    }
}

function createAlreadySeen(post) {
    const seen = document.createElement("p");
    const mark = document.createElement("mark");
    mark.textContent = "ALREADY SEEN";
    mark.dataset.post = JSON.stringify(post);
    mark.addEventListener("click", viewPost, true);
    mark.style.padding = "3px 3px 3px 3px";
    mark.style.margin = "2px 2px 2px 2px";
    seen.appendChild(mark);
    const button = document.createElement("button");
    button.textContent = "mark as unread";
    button.dataset.post = JSON.stringify(post);
    button.addEventListener("click", removePost, true);
    button.style.backgroundColor = "#FFF";
    button.style.padding = "2px 3px 2px 3px";
    button.style.margin = "2px 2px 2px 2px";
    seen.appendChild(button);
    return seen;
}

function viewPost(event) {
    console.log(JSON.parse(event.target.dataset.post));
}

function removePost(event) {
    const post = event.target.dataset.post;
    Lockr.srem(seenPosfix, post);
    console.log("removed", JSON.parse(post));
}

function addViewDB(hook, where) {
    const viewButton = document.createElement("button");
    viewButton.innerHTML = "View";
    viewButton.addEventListener("click", viewDB, true);
    viewButton.style.backgroundColor = "#FFF";
    viewButton.style.padding = "2px 3px 2px 3px";
    viewButton.style.margin = "2px 2px 2px 2px";
    hook.insertAdjacentElement(where, viewButton);
}

function viewDB() {
    if (!localStorage.thumblrseen_seen) {
        console.log("Nothing to see here!");
        return;
    }
    const storage = JSON.parse(localStorage.thumblrseen_seen);
    storage.data.map((item, i) => console.log(i, item));
}

function addCleanDB(hook, where) {
    const cleanButton = document.createElement("button");
    cleanButton.innerHTML = "Clean";
    cleanButton.addEventListener("click", cleanDB, true);
    cleanButton.style.backgroundColor = "#FFF";
    cleanButton.style.padding = "2px 3px 2px 3px";
    cleanButton.style.margin = "2px 2px 2px 2px";
    hook.insertAdjacentElement(where, cleanButton);
}

function cleanDB() {
    console.log("History cleaned!!");
    Lockr.flush();
}
