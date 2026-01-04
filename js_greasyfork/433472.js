// ==UserScript==
// @name        jvarchive
// @namespace   https://www.jeuxvideo.com/
// @match       https://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @grant       GM.xmlHttpRequest
// @version     1.0
// @description Permet de voir les sujets supprimés de jvarchive
// @downloadURL https://update.greasyfork.org/scripts/433472/jvarchive.user.js
// @updateURL https://update.greasyfork.org/scripts/433472/jvarchive.meta.js
// ==/UserScript==

var style = `/* Style the tab */

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  display: none;
}`;

document.head.appendChild(document.createElement("style")).innerHTML = style;

var topics = document.querySelector("#forum-main-col > div.conteneur-topic-pagi > ul");

var tab = document.createElement("div");
tab.className = "tab";

var tablinks = document.createElement("div");
tablinks.id = "tablinks";

var tabcontents = document.createElement("div");
tabcontents.id = "tabcontents";

tab.append(...[tablinks, tabcontents]);
topics.before(tab);

addTab("Topics", showTopics);
addTab("JVArchive 24h", jvArchive24);
addTab("JVArchive 7j", jvArchive7d);

function addTab(name, action) {
    var btn = document.createElement("button");
    btn.innerText = name;
    name = name.replace(/\s/g, '');
    btn.className = "tablink";
    var index = tablinks.children.length;
    btn.addEventListener('click', (event) => openTab(event, index, action));
    tablinks.appendChild(btn);
    var wrapper = document.createElement('div');
    wrapper.className = "tabcontent";
    tabcontents.appendChild(wrapper);
    if (index == 0)
        btn.click();
}

function showTopics(index) {
    var e = tabcontents.children[index];
    if (e.hasChildNodes())
        return;
    e.appendChild(topics);
}

function jvArchive(index, link) {
    var e = tabcontents.children[index];
    if (e.hasChildNodes())
        return;
    var ul = document.createElement('ul');
    ul.classList.add('topic-list', 'topic-list-admin');
    ul.innerHTML = `<li class="topic-head">
        <span class="topic-subject">Sujet</span>
        <span class="topic-author">Auteur</span>
        <span class="topic-count">Nb</span>
        <span class="topic-date">SUPPRESSION</span>
    </li>`;
    GM.xmlHttpRequest({
        method: "GET",
        url: link,
        onload: function (response) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.responseText, 'text/html');
            var rows = doc.querySelectorAll("div.card-body.position-relative.p-0 > div:nth-child(1) > ul > li");
            rows.forEach(row => {

                var link = row.querySelector("a").href.replace("https://www.jeuxvideo.com/", "https://jvarchive.com/");
                var title = row.querySelector("a").innerText;
                title = title.substr(0, title.indexOf('\n'));
                var profileLink = row.querySelector("a:last-child").href;
                var author = row.querySelector("a:last-child").innerText;
                var count = row.querySelector("div:nth-child(3)").innerText;
                var date = row.querySelector(".ml-auto").innerText;
                ul.innerHTML += jvArchiveCreateRow(link, title, profileLink, author, count, date);
            });
        },
        onerror: function (error) {
            console.log(error);
        }
    });
    e.appendChild(ul);
}

function jvArchive24(index) {
    jvArchive(index, 'https://jvarchive.com/top?topicState=deleted&timeInterval=day');
}

function jvArchive7d(index) {
    jvArchive(index, 'https://jvarchive.com/top?topicState=deleted&timeInterval=week&page=1');
}

function jvArchiveCreateRow(link, title, profileLink, author, count, date) {
    return `<li>
        <span class="topic-subject">
            <img src="/img/forums/topic-dossier${count < 20 ? '1.png" alt="Topic" title="Topic' : '2.png" alt="Topic hot" title="Topic hot'}" class="topic-img">
            <a class="lien-jv topic-title"
                href="${link}"
                title="${title}">${title}
            </a>
        </span>
        <a href="${profileLink}" target="_blank"
            class="xXx text-user topic-author">
            ${author}
        </a>
        <span class="topic-count">
            ${count}
        </span>
        <span class="topic-date">      
            ${date}
        </span>
    </li>`;
}

function openTab(evt, index, action) {
    action(index);
    var i;

    for (i = 0; i < tabcontents.children.length; i++) {
        tabcontents.children[i].style.display = "none";
    }

    for (i = 0; i < tablinks.children.length; i++) {
        tablinks.children[i].className = tablinks.children[i].className.replace(" active", "");
    }

    tabcontents.children[index].style.display = "block";
    evt.currentTarget.className += " active";
}