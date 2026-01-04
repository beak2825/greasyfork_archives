// ==UserScript==
// @name        Mastodon status2html
// @namespace   https://blog.bgme.me
// @match       https://*/web/*
// @match       https://bgme.me/*
// @match       https://bgme.bid/*
// @match       https://c.bgme.bid/*
// @grant       none
// @run-at      document-end
// @version     1.0.2
// @author      bgme
// @description Save status to a html file.
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/416569/Mastodon%20status2html.user.js
// @updateURL https://update.greasyfork.org/scripts/416569/Mastodon%20status2html.meta.js
// ==/UserScript==


/* eslint-disable @typescript-eslint/explicit-member-accessibility */
class Status {
    token = JSON.parse(document.querySelector('#initial-state').text).meta.access_token;

    constructor(domain, statusID, sortbytime = false) {
        this.API = {
            'status': `https://${domain}/api/v1/statuses/${statusID}`,
            'context': `https://${domain}/api/v1/statuses/${statusID}/context`
        };
        this.sortbytime = sortbytime;
    }

    async init() {
        const status = await this.request(this.API.status);
        const context = await this.request(this.API.context);

        const statusList = [];
        const statusMap = new Map();
        const statusIndents = new Map();

        if (context.ancestors.length) {
            for (const obj of context.ancestors) {
                spush(obj)
            }
        }
        spush(status);
        if (context.descendants.length) {
            for (const obj of context.descendants) {
                spush(obj);
            }
        }
        if (this.sortbytime) {
            statusList.sort((a, b) => ((new Date(a.created_at)) - (new Date(b.created_at))));
        }
        this.statusList = statusList;

        statusList.forEach(obj => {
            let k = obj.id;
            statusIndents.set(k, getIndent(k));
        })
        this.statusIndents = statusIndents;

        function spush(obj) {
            statusList.push(obj);
            if (obj.in_reply_to_id) {
                statusMap.set(obj.id, obj.in_reply_to_id);
            }
        }
        function getIndent(id) {
            if (statusMap.get(id)) {
                return 1 + getIndent(statusMap.get(id))
            } else {
                return 0
            }
        }
    }

    async request(url) {
        console.log(`正在请求：${url}`);
        const resp = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            method: 'GET',
        });
        return await resp.json();
    }

    html(anonymity_list = []) {
        const HTMLTemplate = `<html>
        <head>
            <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.7/dist/semantic.min.css" integrity="sha256-2+dssJtgusl/DZZZ8gF9ayAgRzcewXQsaP86E4Ul+ss=" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fancybox@3.0.1/dist/css/jquery.fancybox.css" integrity="sha256-iK+zjGHeeTQux1laFiGc4EZWPacH5acc6CnZBGji1ns=" crossorigin="anonymous">
            <style>
                .ui.feed > .event > .content .user > img {
                    max-height: 1.5em;
                    padding-left: 0.2em;
                }
                .emojione {
                    max-height: 1.5em;
                }
                .ui.feed > .event > .content .meta {
                    padding-left: 0.5em;
                }
                .ui.feed > .event > .content .meta > button {
                    position: relative;
                    top: -1.1em;
                }
                .ui.feed > .event.hidden {
                    display: none;
                }
                body {
                    overflow-x: scroll;
                }
            </style>
        </header>
        <body>
            <main id="main">
                <div id="main-content" class="ui text container">
                    <div class="ui large feed" id="main-feed"></div>
                </div>
            </main>

            <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.7/dist/semantic.min.js" integrity="sha256-yibQd6vg4YwSTFUcgd+MwPALTUAVCKTjh4jMON4j+Gk=" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/fancybox@3.0.1/dist/js/jquery.fancybox.pack.js" integrity="sha256-VRL0AMrD+7H9+7Apie0Jj4iir1puS6PYigObxCHqf/4=" crossorigin="anonymous"></script>    <script>
                $(document).ready(function() {
                    $('.image-reference').fancybox();
                    document.querySelectorAll('.ui.feed > .event > .content .meta > button.jump')
                        .forEach(button => {
                            button.addEventListener('click', function() {
                                    const pid = this.parentElement.parentElement.parentElement.getAttribute('pid');
                                    document.location.hash = pid;
                                }
                            );
                        }
                    );
                    document.querySelectorAll('.ui.feed > .event > .content .meta > button.stream')
                        .forEach(button => {
                            button.addEventListener('click', function() {
                                    const event = this.parentElement.parentElement.parentElement;
                                    const id = event.id;

                                    document.querySelectorAll('.ui.feed > .event').forEach(e => e.classList.add('hidden'));
                                    displayAncestor(id);
                                    displayDescendant(id);

                                    document.location.hash = id;

                                    function displayAncestor(id) {
                                        const event = document.getElementById(id);
                                        event.classList.remove('hidden');
                                          
                                        if (event.getAttribute('pid')) {
                                            return displayAncestor(event.getAttribute('pid'));
                                        } else {
                                            return
                                        }
                                    }
                                    function displayDescendant(id) {
                                        const event = document.getElementById(id);
                                        event.classList.remove('hidden');
                                        
                                        const s = '.event[pid="' + id + '"]'
                                        const descendants = document.querySelectorAll(s);
                                        if (descendants.length) {
                                            return descendants.forEach(event => displayDescendant(event.id));
                                        } else {
                                            return
                                        }
                                    }
                                }
                            );
                        }
                    );
                    document.querySelectorAll('.ui.feed > .event > .content .meta > button.show-all')
                        .forEach(button => {
                            button.addEventListener('click', function() {
                                    const event = this.parentElement.parentElement.parentElement;
                                    const id = event.id;

                                    document.querySelectorAll('.ui.feed > .event.hidden').forEach(e => e.classList.remove('hidden'));

                                    document.location.hash = id;
                                }
                            );
                        }
                    );
                });
            </script>
        </body>
        </html>`;
        const HTML = new DOMParser().parseFromString(HTMLTemplate, "text/html");
        const feeds = HTML.getElementById('main-feed');

        for (const obj of this.statusList) {
            let feed;
            if (anonymity_list.includes(obj.account.acct)) {
                feed = this.feed(obj, true);
            } else {
                feed = this.feed(obj);
            }
            feeds.append(feed);
        }

        return HTML.documentElement.outerHTML
    }

    feed(obj, anonymity = false) {
        let feedHtml;
        let content = obj.content;
        if (obj.emojis) {
            for (const emoji of obj.emojis) {
                content = content.replace(`:${emoji.shortcode}:`, `<img src="${emoji.url}" alt=":${emoji.shortcode}:" class="emojione">`);
            }
        }

        let displayName;
        if (obj.account.display_name) {
            displayName = obj.account.display_name;
            for (const emoji of obj.account.emojis) {
                displayName = displayName.replace(`:${emoji.shortcode}:`, `<img src="${emoji.url}" alt=":${emoji.shortcode}:" class="emojione">`);
            }
        } else {
            displayName = obj.account.username;
        }

        if (anonymity) {
            feedHtml = `<div class="event">
            <div class="label">
                <img src="https://bgme.me/avatars/original/missing.png">
            </div>
            <div class="content">
                <div class="user">Anonymity</div>
                <div class="content">${content}</div>
                <span class="date">${obj.created_at.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')}</span>
            </div>
            </div>`
        } else {
            feedHtml = `<div class="event">
            <div class="label">
                <a href="${obj.account.url}" rel="noopener noreferrer" target="_blank">
                    <img src="${obj.account.avatar}">
                </a>
            </div>
            <div class="content">
                <div class="user">${(displayName)}</div>
                <div class="content">${content}</div>
                <a href="${obj.url}" rel="noopener noreferrer" target="_blank" class="date">${obj.created_at.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')}</a>
            </div>
            </div>`
        }
        const feed = (new DOMParser().parseFromString(feedHtml, "text/html")).documentElement.querySelector('.event');

        feed.id = obj.id;
        feed.classList.add(`child-${this.statusIndents.get(obj.id)}`);
        if (this.statusIndents.get(obj.id) && !this.sortbytime) {
            feed.style = `margin-left: ${this.statusIndents.get(obj.id)}em;`
        }
        if (obj.in_reply_to_id) {
            feed.setAttribute('pid', obj.in_reply_to_id);
        }

        if (obj.media_attachments.length) {
            const images = document.createElement('div');
            images.className = 'extra images';
            for (const media_attachment of obj.media_attachments) {
                const img = document.createElement('img');
                img.src = media_attachment.preview_url;
                if (media_attachment.description) {
                    img.alt = media_attachment.description;
                }

                const a = document.createElement('a');
                a.href = media_attachment.url;
                a.className = 'image-reference';

                a.append(img);
                images.append(a);
                feed.querySelector('.date').before(images);
            }
        }

        const button0 = genButton('jump', 'arrow up');
        const button1 = genButton('stream', 'stream');
        const button2 = genButton('show-all', 'globe');

        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `层级${this.statusIndents.get(obj.id)}`;
        if (this.statusIndents.get(obj.id)) {
            meta.append(button0);
            meta.append(button1);
        }
        meta.append(button2);
        feed.querySelector('.date').after(meta);

        return feed

        function genButton(className, iconName) {
            const button = document.createElement('button');
            button.className = `mini ui icon tertiary button ${className}`;
            const icon = document.createElement('i');
            icon.className = `${iconName} icon`;
            button.append(icon);
            return button
        }
    }
}

function saveFile(data, filename, type) {
    const file = new Blob([data], { type: type });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function chromeClickChecker(event) {
    return (
        event.target.tagName.toLowerCase() === 'i' &&
        event.target.classList.contains('fa-ellipsis-h') &&
        document.querySelector('div.dropdown-menu') === null
    );
}

function firefoxClickChecker(event) {
    return (
        event.target.tagName.toLowerCase() === 'button' &&
        event.target.classList.contains('icon-button') &&
        document.querySelector('div.dropdown-menu') === null
    );
}

function activate() {
    document.querySelector('body').addEventListener('click', function (event) {
        if (chromeClickChecker(event) || firefoxClickChecker(event)) {
            // Get the status for this event
            let status = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
            if (status.className.match('detailed-status__wrapper')) {
                addLink(status);
            }
        };
    }, false);
}

function addLink(status) {
    setTimeout(function () {
        const url = status.querySelector('.detailed-status__link').getAttribute('href');
        const id = url.match(/\/(\d+)\//)[1];

        const dropdown = document.querySelector('div.dropdown-menu ul');
        const separator = dropdown.querySelector('li.dropdown-menu__separator');

        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-menu__item');
        listItem.classList.add('mastodon__lottery');

        const link = document.createElement('a');
        link.setAttribute('href', '#');
        link.setAttribute('target', '_blank');
        link.textContent = 'Save as HTML';

        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (!window.Running) {
                window.Running = true;
                link.textContent = 'Saving, please wait……';
                run(id)
                    .then(() => { window.Running = false; })
                    .catch(e => {
                        window.Running = false;
                        throw e;
                    });
            }
        }, false);

        listItem.appendChild(link);
        dropdown.insertBefore(listItem, separator);
    }, 100);
}

function run(id) {
    const domain = document.location.host;

    const s1 = new Status(domain, id, false);
    s1.init().then(() => {
        const html = s1.html();
        saveFile(html, `${id}.html`, 'text/plain; charset=utf-8');
    });

    const s2 = new Status(domain, id, true);
    s2.init().then(() => {
        const html = s2.html();
        saveFile(html, `${id}-time.html`, 'text/plain; charset=utf-8');
    });
}


window.addEventListener('load', function () {
    activate();
}, false)
