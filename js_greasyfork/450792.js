// ==UserScript==
// @name         CC98 Tools - Topic Preview
// @version      1.0.1
// @description  CC98 tools for previewing topic.
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    https://www.cc98.org/user/name/ml98
// @license      MIT

// @match        https://www.cc98.org/*
// @match        https://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450792/CC98%20Tools%20-%20Topic%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/450792/CC98%20Tools%20-%20Topic%20Preview.meta.js
// ==/UserScript==

/* eslint-env jquery */

(async function () {
    if (typeof $ === 'undefined') {
        return;
    }

    const boardsInfo = JSON.parse(localStorage.boardsInfo?.slice(4) || "[]");
    const boards = Object.fromEntries(
        boardsInfo
        .map((i) => i.boards)
        .flat()
        .map((i) => [i.id, i.name])
    );

    init();

    function init() {
        const fragment = html(`
<div id="topic-preview-container" class="hide">
  <style></style>
  <header id="topic-preview-header">
    <a id="topic-preview-title" target="_blank"></a>
    <a id="topic-preview-board" target="_blank"></a>
  </header>
  <div id="topic-preview-body"></div>
  <footer id="topic-preview-footer">
    <button id="topic-preview-more" class="ant-btn ant-btn-primary">more</button>
  </footer>
</div>
`);
        document.documentElement.append(fragment);
        const container = document.querySelector("#topic-preview-container");
        const button = container.querySelector("#topic-preview-more");
        $(button).on("click", more);

        let timer1_id = 0;
        let timer2_id = 0;
        let timer3_id = 0;
        $(document.body)
            .on("mouseenter", "a", function (e) {
            if (this.href?.match(/topic\/\d+/)) {
                clearTimeout(timer2_id);
                clearTimeout(timer3_id);
                timer1_id = setTimeout(() => {
                    container.classList.remove("hide");
                    const topicId = this.href.match(/topic\/(\d+)/)[1];
                    preview(topicId);
                }, 1000);
            }
        })
            .on("mouseleave", "a", function (e) {
            if (this.href?.match(/topic\/\d+/)) {
                clearTimeout(timer1_id);
                timer2_id = setTimeout(() => {
                    container.classList.add("hide");
                }, 1500);
            }
        });

        $(container)
            .on("mouseenter", function (e) {
            clearTimeout(timer2_id);
            clearTimeout(timer3_id);
        })
            .on("mouseleave", function (e) {
            timer3_id = setTimeout(() => {
                container.classList.add("hide");
            }, 1500);
        });

        if(true) {
            container.querySelector("style").innerHTML = `
.focus-topic-title {
  width: fit-content;
  min-width: 1em;
}

/* container */
#topic-preview-container {
  /*
  left: 20%;
  right: 20%;
  top: 5%;
  bottom: 15%;
  border-radius: 12px;
  transform: translateY(0%);
  transition: 0.25s ease;
  */
  left: 55%;
  right: 0%;
  top: 0%;
  bottom: 0%;
  border-radius: 12px 0 0 12px;
  transform: translateX(0%);
  transition: 0.25s ease;

  position: fixed;
  z-index: 10000000;
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 12px 2px #0008;
  display: flex;
  flex-direction: column;
}

#topic-preview-container.hide {
  /*
  transform: translateY(-110%);
  */
  transform: translateX(110%);
}

/* header */
#topic-preview-header {
  display: flex;
  margin-bottom: 10px;
  font-size: 1.25rem;
}
#topic-preview-title {
  flex: 1;
}
#topic-preview-board {
  margin-left: 10px;
  display: flex;
  align-items: center;
}

/* body */
#topic-preview-body {
  margin-bottom: 10px;
  flex: 1;
  overflow: auto;
  overscroll-behavior: none;
}

.topic-preview-post {
  margin: 10px;
  border-bottom: 3px dashed #0004;
}
.topic-preview-postInfo {
  display: flex;
  font-size: large;
  margin-bottom: 10px;
}
.topic-preview-userName {
  flex: 1;
  margin-left: 0.5em;
}

.topic-preview-content {
  display: block;
  line-height: normal;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
.topic-preview-content * {
  max-width: 100%;
}
.topic-preview-content img {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 0 5px 0px #0008;
}
.topic-preview-content img.topic-preview-emoji {
  display: inline-block;
  box-shadow: none;
}
.topic-preview-content blockquote {
  padding-left: 1em;
  max-height: 20em;
  overflow: auto;
}
.topic-preview-content>blockquote>blockquote>blockquote>blockquote {
  visibility: hidden;
  height: 2rem;
}
.topic-preview-content>blockquote>blockquote>blockquote>blockquote:before {
  visibility: visible;
  content: '...';
}
.topic-preview-content iframe {
  border: none;
}
.topic-preview-awards {
  font-size: 0.5rem;
  text-align: center;
}

.topic-preview-like {
  display: flex;
  justify-content: flex-end;
}
.topic-preview-like > div {
  margin: 10px;
}

/* footer */
#topic-preview-footer {
  margin: auto;
}

/* webkit-scrollbar */
#topic-preview-body::-webkit-scrollbar
{
  width: auto;
  height: auto;
}
#topic-preview-body::-webkit-scrollbar-track
{
  background-color: #0001;
}
#topic-preview-body::-webkit-scrollbar-thumb
{
  background-color: #8888;
  border-radius: 100vw;
  border: 5px solid #0000;
  background-clip: content-box;
}
#topic-preview-body::-webkit-scrollbar-thumb:hover
{
  background-color: #888;
}
#topic-preview-body::-webkit-scrollbar-thumb:active
{
  background-color: #666;
}
`;
        }
    }

    async function preview(topicId) {
        const container = document.querySelector("#topic-preview-container");
        if (topicId == container.topicId) {
            return;
        }
        container.topicId = topicId;
        container.page = 0;
        const postContainer = container.querySelector("#topic-preview-body");
        const title = container.querySelector("#topic-preview-title");
        const board = container.querySelector("#topic-preview-board");

        postContainer.innerHTML = "";
        title.textContent = "";
        board.textContent = "";

        const topic = await getTopic(topicId);
        const posts = await getTopic(topicId, 0);

        title.href = "/topic/" + topicId;
        title.textContent = topic.title;
        board.href = "/board/" + topic.boardId;
        board.textContent = boards[topic.boardId];

        // console.log(posts.length);
        if (posts.length == 10) {
            container.page++;
        }
        for (const post of posts) {
            postContainer.append(parsePost(post));
        }
    }

    async function more() {
        const container = document.querySelector("#topic-preview-container");
        const postContainer = container.querySelector("#topic-preview-body");
        const posts = await getTopic(container.topicId, container.page);
        // console.log(container.page, posts.length);
        if (posts.length == 10) {
            container.page++;
        }
        while (postContainer.children.length % 10) {
            postContainer.removeChild(postContainer.lastChild);
        }
        for (const post of posts) {
            postContainer.append(parsePost(post));
        }
    }

    function parsePost(post) {
        const userName =
              (post.isAnonymous
               ? "匿名" + post.userName.toUpperCase()
               : post.userName) + (post.isLZ ? " (LZ)" : "");
        const page = Math.floor((post.floor - 1) / 10) + 1, floor = post.floor % 10;
        const content = parseUbb(post.content) + parseAwards(post.awards);
        const firstTime = parseTime(post.time);
        const lastTime = parseTime(post.lastUpdateTime);
        const time = firstTime + (lastTime ? " | " + lastTime : "");
        return html(`
<div class="topic-preview-post">
  <div class="topic-preview-postInfo">
    <div class="topic-preview-floor">
      <a href="/topic/${post.topicId}/${page}#${floor}" target="_blank">#${post.floor}</a>
    </div>
    <div class="topic-preview-userName">
      ${post.isAnonymous
                    ? `${userName}`
                    : `<a href="/user/id/${post.userId}" target="_blank">${userName}</a>`
                    }
    </div>
    <div class="topic-preview-time">${time}</div>
  </div>
  <article class="topic-preview-content">${content}</article>
  <div class="topic-preview-like">
    <div><i title="赞" class="fa fa-thumbs-o-up"></i> ${post.likeCount}</div>
    <div><i title="踩" class="fa fa-thumbs-o-down"></i> ${post.dislikeCount}</div>
  </div>
</div>
`);
    }

    function parseTime(time) {
        if (!time) {
            return "";
        }
        const t = new Date(time), now = new Date();
        return t.toLocaleDateString() == now.toLocaleDateString() ?
            t.toLocaleTimeString() : t.toLocaleString();
    }

    function parseUbb(text) {
        if (!text) {
            return "";
        }
        const emoji_base = '<img class="topic-preview-emoji" src="/static/images';
        return text
            .replace(/\[ac(\d+)\]/gi, emoji_base + '/ac-dark/$1.png">')
            .replace(/\[a:(\d+)\]/gi, emoji_base + '/mahjong/animal2017/$1.png">')
            .replace(/\[c:(018|049|096)\]/gi, emoji_base + '/mahjong/carton2017/$1.gif">')
            .replace(/\[c:(\d+)\]/gi, emoji_base + '/mahjong/carton2017/$1.png">')
            .replace(/\[f:(004|009|056|061|062|087|115|120|137|168|169|175|206)\]/gi,
                     emoji_base + '/mahjong/face2017/$1.gif">')
            .replace(/\[f:(\d+)\]/gi, emoji_base + '/mahjong/face2017/$1.png">')
            .replace(/\[(ms|tb)(\d+)\]/gi, emoji_base + '/$1/$1$2.png">')
            .replace(/\[cc98(1[5-9]|2\d|3[067])\]/gi, emoji_base + '/cc98/cc98$1.png">')
            .replace(/\[(em|cc98)(\d+)\]/gi, emoji_base + '/$1/$1$2.gif">')
            .replace(/\[img(=\d)?\](.+?)\[\/img\]/gi, '<img src="$2">')
            .replace(/\[url\](.+?)\[\/url\]/gi, '<a href="$1" target="_blank">$1</a>')
            .replace(/\[url=([^\]]+?)\]\[\/url\]/gi, '<a href="$1" target="_blank">$1</a>')
            .replace(/\[url=([^\]]+?)\](.+?)\[\/url\]/gi, '<a href="$1" target="_blank">$2</a>')
            .replace(/\[video\](.+?)\[\/video\]/gi, '<video controls src="$1"></video>')
            .replace(/\[audio\](.+?)\[\/audio\]/gi, '<audio controls src="$1"></audio>')
            .replace(/\[upload(=[^\]]+?)?\](.+?)\[\/upload\]/gi, '<a href="$2" target="_blank">$2</a>')
            .replace(/\[bili(=\d+)?\](https:\/\/www.bilibili.com\/video\/)?(BV.+?)\[\/bili\]/gi,
                     '<iframe width="640" height="480" allowfullscreen ' +
                     'src="https://player.bilibili.com/player.html?bvid=$3&page$1"></iframe>')
            .replace(/\[size=(\d)\]/gi, '<span style="font-size:calc($1rem/3);">')
            .replace(/\[color=([^\]]+?)\]/gi, '<span style="color:$1;">')
            .replace(/\[font=([^\]]+?)\]/gi, '<span style=\'font-family:$1;\'>')
            .replace(/\[align=(left|center|right)\]/gi, '<span style="text-align:$1;display:block;">')
            .replace(/\[(left|center|right)\]/gi, '<span style="text-align:$1;display:block;">')
            .replace(/\[\/(size|color|font|align|left|center|right)\]/gi, '</span>')
            .replace(/\[(\/?)(u|b|i|del|code|table|thead|tbody|th|tr|td)\]/gi, '<$1$2>')
            .replace(/\[line\]/gi, '<br>')
            .replace(/\[(\/?)noubb\]/gi, '<$1code>')
            .replace(/\[(\/?)quotex?\]/gi, '<$1blockquote>');
    }

    function parseAwards(awards) {
        if (!awards?.length) {
            return "";
        }
        return `<br>
<table class="topic-preview-awards">
  <thead>
    <tr>
      <th>用户</th>
      <th>时间</th>
      <th>操作</th>
      <th>理由</th>
    </tr>
  </thead>
  <tbody>${awards.map(award=>`
    <tr>
      <td>${award.operatorName}</td>
      <td>${award.time.replace('T', ' ').split('.')[0]}</td>
      <td>${award.content}</td>
      <td>${award.reason}</td>
    </tr>`).join('')}
  </tbody>
</table>`;
    }

    async function cc98fetch(url, data) {
        await sleep(500);
        try {
            const resp = await fetch("https://api-v2.cc98.org" + url, {
                ...data,
                headers: {
                    authorization: localStorage.accessToken?.slice(4) || "",
                },
            });
            const json = await resp.json();
            return json;
        }
        catch {
            return {};
        }
    }

    async function getTopic(topicId, page) {
        if (page === undefined) {
            return await cc98fetch(`/topic/${topicId}`);
        }
        return await cc98fetch(`/topic/${topicId}/post?from=${page * 10}&size=10`);
    }

    async function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    function html(s) {
        const t = document.createElement("template");
        t.innerHTML = s.trim();
        return sanitize(t.content);
    }

    function sanitize(fragment) {
        fragment.querySelectorAll("script").forEach((node) => node.remove());
        fragment.querySelectorAll("*").forEach(function (node) {
            node.getAttributeNames()
                .filter((attr) => attr.startsWith("on"))
                .forEach((attr) => node.removeAttribute(attr));
        });
        return fragment;
    }
})();
