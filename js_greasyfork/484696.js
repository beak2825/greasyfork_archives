// ==UserScript==
// @name         iChineseReader Cheat
// @namespace    s_ambigious
// @version      1
// @license      MIT
// @description  Anti too fast and quiz answers for iChineseReader.com
// @author       @ambigious
// @match        *://*.ichinesereader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ichinesereader.com
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/484696/iChineseReader%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/484696/iChineseReader%20Cheat.meta.js
// ==/UserScript==

function create(tag, attrs, attach, ...children) {
  const element = document.createElement(tag);

  if (attrs.events) {
    for (let [event, callback] of Object.entries(attrs.events)) {
      element.addEventListener(event, callback);
    }
  }

  if (attrs.styles) {
    for (let [style, value] of Object.entries(attrs.styles)) {
      element.style[style] = value;
    }
  }

  for (let [attr, value] of Object.entries(
    (({ events, styles, ...o }) => o)(attrs),
  )) {
    element.setAttribute(attr, value);
  }

  if (children) {
    for (let child of children) {
      if (child instanceof HTMLElement) element.appendChild(child);
      else element.appendChild(document.createTextNode(child.toString()));
    }
  }

  if (attach) attach.appendChild(element);
  else return element;
}

window.addEventListener(
  "load",
  () => {
    const { register } = VM.shortcut;

    async function answers() {
      const quiz = await (await fetch(
        performance
          .getEntries()
          .filter(e => e instanceof PerformanceResourceTiming)
          .map(e => e.name)
          .filter(e =>
            e.includes("api.ichinesereader.com/superadmin/quiz"),
          )
          .at(-1),
        {
          headers: {
            authtoken: Object.fromEntries(
              document.cookie
                .split(";")
                .map(e => e.split("=").map(e => e.trim())),
            ).nanhaiIndividualSession.concat("="),
          },
        },
      )).json();

      const data = await (await fetch(quiz.book.quizLinkUrl)).json();

      create("div", {}, window.open().document.body,
        create("style", {}, null,
          await (
            await fetch(
              "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css",
            )
          ).text(),
        ),
        create("h1", {}, null, `Quiz Answers for ${data.simp_name}`),
        create("table", {}, null,
          create("thead", {}, null,
            create("tr", {}, null,
              create("th", {}, null, "Question"),
              create("th", {}, null, "Answer"),
            ),
          ),
          create("tbody", {}, null,
            ...data.questions
              .map(e => e.answers.find(e => e.isCorrect))
              .map((e, i) =>
                create("tr", {}, null,
                  create("td", {}, null, i + 1),
                  create("td", {}, null, e.simp_answer),
                ),
              ),
          ),
        ),
      );

      /*console.log(
        data.questions.map(e =>
          e.answers
            .filter(e => e.isCorrect)
            .map((e, i) =>
              create(
                "tr",
                {},
                null,
                create("td", {}, null, i + 1),
                create("td", {}, null, e.simp_answer),
              ),
            ),
        ),
      );*/
    }

    function anti() {
      const bookFrame = document
        .querySelector("iframe").contentDocument
        .querySelector("iframe").contentWindow;

      bookFrame.userRole = "TEACHER";
    }

    GM_registerMenuCommand("Anti too fast", anti);
    register("ctrl-alt-s", anti);

    GM_registerMenuCommand("Get answers (Opens in new tab)", answers);
    register("ctrl-alt-a", answers);
  },
  false,
);
