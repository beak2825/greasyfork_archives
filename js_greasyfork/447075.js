// ==UserScript==
// @name         Tabbed AtCoder Editorial
// @version      0.10
// @description  display atcoder editorial in tabs
// @match        https://atcoder.jp/contests/*/editorial
// @match        https://atcoder.jp/contests/*/editorial?*
// @namespace https://greasyfork.org/users/808669
// @downloadURL https://update.greasyfork.org/scripts/447075/Tabbed%20AtCoder%20Editorial.user.js
// @updateURL https://update.greasyfork.org/scripts/447075/Tabbed%20AtCoder%20Editorial.meta.js
// ==/UserScript==

/* jshint esversion:8 */
(async function () {
  "use strict";

  const katexoption = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "code", "option"],
    ignoredClasses: ["prettyprint", "source-code-for-copy"],
    throwOnError: false
  };

  async function addScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.onload = resolve;
      document.getElementsByTagName("head")[0].appendChild(script);
    });
  }

  async function addLink(href) {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      document.getElementsByTagName("head")[0].appendChild(link);
    });
  }

  async function getEditorial(link) {
    return new Promise((resolve) => {
      const parser = new DOMParser();
      const parse = s => parser.parseFromString(s, "text/html").body.firstChild;
      const labelNode = parse(`<label class="--editorial-title" editorial-content-state="hidden"></label>`);
      const handleNode = parse(`<div class="--editorial-content-handle"></div>`);
      const parent = link.parentNode;
      labelNode.replaceChildren(...parent.children);
      parent.appendChild(labelNode);
      const xhr = new XMLHttpRequest();
      xhr.responseType = "document";
      xhr.onload = (response) => {
        const contentNode = response.target.responseXML.querySelector("#main-container > div.row > div:nth-child(2) > div");
        if (contentNode) {
          renderMathInElement(contentNode, katexoption);
          contentNode.classList.add("--editorial-content");
          parent.appendChild(contentNode);
          parent.appendChild(handleNode);
          labelNode.addEventListener("click", () => {
            const state = labelNode.getAttribute("editorial-content-state");
            const nextState = state === "max" ? "hidden" : "max";
            const nextHeight = nextState === "max" ? contentNode.scrollHeight : 0;
            contentNode.style.setProperty("--editorial-content-height", `${nextHeight}px`);
            labelNode.setAttribute("editorial-content-state", nextState);
          });
          {
            let posY = 0;
            const resize = event => {
              const state = labelNode.getAttribute("editorial-content-state");
              const height = state === "max" ? contentNode.scrollHeight : state === "hidden" ? 0 : Number(contentNode.style.getPropertyValue("--editorial-content-height").replace("px", ""));
              const moveY = event.pageY - posY;
              let nextHeight = Math.min(Math.max(0, height + moveY), contentNode.scrollHeight);
              let nextState = "show";
              if (nextHeight >= contentNode.scrollHeight) nextState = "max";
              if (nextHeight === 0) nextState = "hidden";
              contentNode.style.setProperty("--editorial-content-height", `${nextHeight}px`);
              labelNode.setAttribute("editorial-content-state", nextState);
              if (moveY < 0) contentNode.scrollTop = Math.max(0, contentNode.scrollTop + moveY);
              posY = event.pageY;
            };
            handleNode.addEventListener("mousedown", event => {
              posY = event.pageY;
              event.preventDefault();
              document.addEventListener("mousemove", resize);
            });
            document.addEventListener("mouseup", () => document.removeEventListener("mousemove", resize));
            contentNode.__set_editorial_content_open = () => {
              contentNode.style.setProperty("--editorial-content-height", `${contentNode.scrollHeight}px`);
              labelNode.setAttribute("editorial-content-state", "max");
            };
            contentNode.__set_editorial_content_close = () => {
              contentNode.style.setProperty("--editorial-content-height", `0px`);
              labelNode.setAttribute("editorial-content-state", "hidden");
            };
            if (window.localStorage.getItem("tabbed-atCoder-editorial-default-open") === "1") {
              contentNode.__set_editorial_content_open();
            } else {
              contentNode.__set_editorial_content_close();
            }
          }
        }
        resolve();
      };
      xhr.open("GET", link.href);
      xhr.send();
    });
  }

  async function getTextResponse(href) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = (response) => {
        resolve(response.target.responseText);
      };
      xhr.open("GET", href);
      xhr.overrideMimeType("text/plain; charset=Shift_JIS");
      xhr.send();
    });
  }

  async function typical90(id) {
    const editorial = { "005": 3, "011": 2, "017": 3, "023": 4, "029": 2, "035": 3, "041": 3, "047": 2, "053": 4, "059": 3, "065": 3, "071": 3, "077": 3, "083": 4, "084": 2, "085": 2, "086": 2, "087": 2, "088": 2, "089": 4, "090": 6 };
    const source = { "005": "005-03", "011": "011-03", "017": "017-03", "023": "023-04b", "029": "029-03", "035": "035-04", "041": "041-03", "047": "047-02", "053": "053-04", "059": "059-02", "061": "061-02", "065": "065-03", "071": "071-03", "077": "077-04b", "083": "083-02a", "084": "084-02", "089": "089-05", "090": "090-07b" };
    let content = `<a href="https://github.com/E869120/kyopro_educational_90/blob/main/problem" rel="nofollow">問題文</a>
      <img src="https://raw.githubusercontent.com/E869120/kyopro_educational_90/main/problem/${id}.jpg" style="max-width: 100%;">
      <hr><a href="https://github.com/E869120/kyopro_educational_90/blob/main/editorial" rel="nofollow">公式解説</a>
    `;
    if (editorial[id] === undefined) {
      content += `<img src="https://raw.githubusercontent.com/E869120/kyopro_educational_90/main/editorial/${id}.jpg" style="max-width: 100%;">`;
    } else {
      for (let i = 1; i <= editorial[id]; i++) {
        content += `<img src="https://raw.githubusercontent.com/E869120/kyopro_educational_90/main/editorial/${id}-${String(i).padStart(2, "0")}.jpg" style="max-width: 100%;">`;
      }
    }
    const code = await getTextResponse(`https://raw.githubusercontent.com/E869120/kyopro_educational_90/main/sol/${source[id] === undefined ? id : source[id]}.cpp`);
    content += `<hr><a href="https://github.com/E869120/kyopro_educational_90/tree/main/sol" rel="nofollow">想定ソースコード</a><pre class="prettyprint linenums"><code class="language-cpp">${code}</code></pre>`;
    return `<ul><li>${content}</li></ul>`;
  }

  async function createTab() {
    const parser = new DOMParser();
    const parse = s => parser.parseFromString(s, "text/html").body.firstChild;
    const nav = document.querySelector("#main-container > div.row > div:nth-child(2)");
    const dummy = document.createElement("div");
    const navul = parse(`<ul class="nav nav-tabs" role="tablist"></ul>`);
    const navdiv = parse(`<div class="tab-content"></div>`);

    let previd = "dummy";
    let isactive = true;
    let activeid;
    let prevhead = -1;
    let kaisetsu = -1;

    while (nav.children.length > 0) {
      const e = nav.firstChild;
      const summary = e.textContent.trimStart().split(/\s+/)[0];
      if (e.tagName === "DIV" && summary === "解説") {
        kaisetsu = dummy.children.length;
        dummy.appendChild(e);
      } else if (e.tagName === "DIV" || e.tagName === "H3") {
        const cond = e.textContent === "コンテスト全体の解説";
        const name = cond ? "全体" : summary;
        const id = cond ? "all" : summary;
        const li = parse(`<li role="presentation", id="--editorial-presentation-${id}">
            <a href="#--editorial-${id}" aria-controls="--editorial-${id}" role="tab" data-toggle="tab">${name}</a>
          </li>`);
        li.addEventListener("click", () => {
          Promise.all(
            Array.prototype.filter.call(
              document.querySelectorAll(`#--editorial-${id} li>a`),
              e => e.href.match(/https:\/\/atcoder\.jp\/contests\/.*\/editorial\//)
            ).map(e => getEditorial(e))
          ).then(() => { if (PR) PR.prettyPrint(); });
        }, { once: true });
        if (isactive) {
          li.classList.add("active");
          activeid = `--editorial-presentation-${id}`;
        }
        navul.appendChild(li);
        previd = id;
        prevhead = dummy.children.length;
        dummy.appendChild(e);
      } else if (e.tagName === "UL" || e.tagName == "P") {
        if (e.tagName === "UL") {
          for (let i = e.children.length; i-- > 0; i) {
            const ch = e.children[i];
            if (ch.tagName == "LI") {
              const link = dummy.children[prevhead].querySelector("a");
              if (link) {
                const found = link.href.match(/https:\/\/atcoder\.jp\/contests\/(.+)\/tasks\/(.+)/);
                if (found) {
                  const contest = found[1];
                  const task = found[2];
                  const user = ch.querySelector("a.username").textContent;
                  const a = parse(`<a href="/contests/${contest}/submissions?f.Task=${task}&f.Status=AC&f.User=${user}">
                  <span aria-hidden="true" data-html="true" data-toggle="tooltip" title="${user}さんの提出を見る" class="glyphicon glyphicon-search black"></span>
                  </a>`);
                  ch.appendChild(a);
                }
              } else {
                const found = location.href.match(/https:\/\/atcoder\.jp\/contests\/([^/]+)\//);
                if (found) {
                  const contest = found[1];
                  const user = ch.querySelector("a.username").textContent;
                  const a = parse(`<a href="/contests/${contest}/submissions?f.Status=AC&f.User=${user}">
                  <span aria-hidden="true" data-html="true" data-toggle="tooltip" title="${user}さんの提出を見る" class="glyphicon glyphicon-search black"></span>
                  </a>`);
                  ch.appendChild(a);
                }
              }
            }
            e.insertBefore(document.createElement("hr"), ch);
          }
        }
        const div = document.createElement("div");
        div.role = "tabpanel";
        div.classList.add("tab-pane");
        if (isactive) div.classList.add("active");
        div.id = "--editorial-" + previd;
        div.appendChild(dummy.children[prevhead]);
        if (location.href.match(/https:\/\/atcoder\.jp\/contests\/typical90\/tasks\/.*\/editorial/) && 1 <= Number(previd) && Number(previd) <= 90) {
          div.appendChild(parse(await typical90(previd)));
          if (e.textContent !== "解説がまだありません。") {
            div.appendChild(e);
          } else {
            dummy.appendChild(e);
          }
        } else {
          div.appendChild(e);
        }
        navdiv.appendChild(div);
        isactive = false;
      } else {
        dummy.appendChild(e);
      }
    }

    const frexDirection = window.localStorage.getItem("tabbed-atCoder-editorial-default-open") === "1" ? "column-reverse" : "column";
    const li = parse(`<li role="presentation", id="--editorial-open-presentation">
        <a href="#" style="display:flex;flex-direction:${frexDirection};padding:5px 10px;">
          <span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
          <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
        </a>
      </li>`);
    li.addEventListener("click", () => {
      const a = li.querySelector("a");
      const contents = document.querySelectorAll(".--editorial-content");
      if (a.style.getPropertyValue("flex-direction") === "column") {
        window.localStorage.setItem("tabbed-atCoder-editorial-default-open", "1");
        [...contents].forEach(content => content.__set_editorial_content_open());
        a.style.setProperty("flex-direction", "column-reverse");
      } else {
        window.localStorage.setItem("tabbed-atCoder-editorial-default-open", "0");
        [...contents].forEach(content => content.__set_editorial_content_close());
        a.style.setProperty("flex-direction", "column");
      }
    });
    navul.appendChild(li);

    if (kaisetsu >= 0) nav.appendChild(dummy.children[kaisetsu]);
    nav.appendChild(navul);
    nav.appendChild(navdiv);
    if (activeid) document.querySelector(`#${activeid}`).click();
    const css = `
pre code {
  tab-size: 4;
}

#main-container {
  overflow: hidden;
}

.--editorial-title {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  border: solid 1px #ccc;
  cursor: pointer;
  padding: .5em;
  display: block;
  font-weight: normal;
  text-align: -webkit-match-parent
}

.--editorial-title > *::before {
  content: " ";
}

.--editorial-title::after,
.--editorial-title::before {
  content: "";
  position: absolute;
  right: 1em;
  top: 1em;
  width: 2px;
  height: 0.75em;
  background-color: #999;
}

.--editorial-title::after {
  transform: rotate(90deg);
}

.--editorial-content {
  --editorial-content-height: 0px;
  max-height: var(--editorial-content-height);
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.--editorial-content::-webkit-scrollbar {
  display: none;
}

label[editorial-content-state="max"]::before {
  background-color: transparent;
}

label[editorial-content-state="hidden"]+.--editorial-content {
  max-height: 0;
}

label[editorial-content-state="show"]+.--editorial-content {
  max-height: var(--editorial-content-height);
}

label[editorial-content-state="max"]+.--editorial-content {
  max-height: max-content;
}

.--editorial-content-handle {
  content: "";
  width: 100%;
  border-top: solid 1px #ccc;
  border-bottom: solid 1px #ccc;
  padding: 1px;
}

.--editorial-content-handle {
  cursor: row-resize;
}`;
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  await addLink("https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css");
  await addScript("https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js");
  await addScript("https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js");
  await addScript("https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js");
  await createTab();
})();
