// ==UserScript==
// @name         WK Reading challenge progress updater
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Update your progress in the seasonal reading every day challenge automatically.
// @author       Gorbit99
// @match        https://community.wanikani.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442810/WK%20Reading%20challenge%20progress%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/442810/WK%20Reading%20challenge%20progress%20updater.meta.js
// ==/UserScript==
(function() {
  "use strict";

  let template =
    window.localStorage.getItem("reading-challenge-updater.template") ??
    `Day $$dayNum$$ / [Calendar]($$homePost$$)
    $$month$$
    $$shortMonth$$
    $$dayOfMonth$$
`;

  const knownReadingChallenges = [
    "t/read-every-day-challenge-summer-2021/51713",
    "t/read-every-day-challenge-fallautumn-2021/53285",
    "t/read-every-day-challenge-winter-2022/54948",
    "t/read-every-day-challenge-spring-2022/56375",
    "t/read-every-day-challenge-winter-2024/64212",
  ];

  const observerConfig = {
    subtree: true,
    childList: true,
  };

  const observer = new MutationObserver(addButton);

  function addButton() {
    if (!knownReadingChallenges.some((challenge) =>
      location.href.includes(challenge)
    )) {
      return;
    }

    const footerButtons = document.querySelector(".topic-footer-main-buttons");

    if (footerButtons !== null
      && footerButtons.querySelector(".reading-challenge-btn") === null) {

      const addDayButton = document.createElement("button");
      addDayButton.title = "complete the current day";
      addDayButton.classList.add("btn-default");
      addDayButton.classList.add("create");
      addDayButton.classList.add("btn");
      addDayButton.classList.add("btn-icon-text");
      addDayButton.classList.add("ember-view");
      addDayButton.classList.add("reading-challenge-btn");
      addDayButton.innerHTML = `
        <svg 
          class="fa d-icon d-icon-reply svg-icon svg-string" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="#calendar-day"></use>
        </svg>
        <span class="d-button-label">Add Day</span>
      `;

      addDayButton.addEventListener("click", addDay);

      footerButtons.append(addDayButton);

      observer.takeRecords();
    }

    const editBoxButtons = document.querySelector(".d-editor-button-bar");

    if (editBoxButtons
      && editBoxButtons.querySelector(".reading-challenge-template") === null) {

      const saveTemplateButton = document.createElement("a");
      saveTemplateButton.classList.add("cancel");
      saveTemplateButton.classList.add("reading-challenge-template");
      saveTemplateButton.innerHTML = "save template";
      saveTemplateButton.style.marginLeft = "auto";
      saveTemplateButton.style.marginRight = "15px";

      editBoxButtons.append(saveTemplateButton);

      saveTemplateButton.addEventListener("click", saveTemplate);

      observer.takeRecords();
    }
  }

  observer.observe(document.querySelector("#main"), observerConfig);

  async function addDay() {
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;

    function updatePost(postId, postContent) {
      const url = "https://community.wanikani.com/posts/" + postId;
      const encodedPost = encodeURI(("post[raw]=" + postContent)
        .replace(/ /g, "+"));

      const config = {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-csrf-token": csrfToken,
          "x-requested-with": "XMLHttpRequest",
        },
        "method": "PUT",
        "body": encodedPost,
      };

      fetch(url, config).then();
    }

    const threadURL =
      `${window.location.href.match(/https:\/\/[^/]+\/t\/[^/]+\/\d+/)[0]}.json`;
    const threadData = await (await fetch(threadURL)).json();

    const username = document.querySelector("#current-user .icon").title;

    const progressPostID = threadData.post_stream.stream[1];
    const progressPostURL =
      `https://community.wanikani.com/posts/${progressPostID}.json`;
    const progressPost = await (await fetch(progressPostURL)).json();

    const userProgressRegex =
      new RegExp(`(\\|\\[?${username}[^|]*\\|[^|]+\\|)(\\d+)\\|?`, "i");

    const updatedProgressPost =
      progressPost.raw.replace(userProgressRegex, (_, head, tail) => {
        return `${head}${parseInt(tail) + 1}|`;
      });

    updatePost(progressPostID, updatedProgressPost);

    const userHomePostRegex = new RegExp(`${username}.*\\(([^)]+)\\)`, "i");
    const userHomePostURL = progressPost.raw.match(userHomePostRegex)?.[1];

    let curDayNum = 0;

    if (userHomePostURL !== undefined) {
      const postIndex = userHomePostURL
        .match(/https:\/\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/(\d+)/)[1];
      const postId = threadData.post_stream.stream[postIndex - 1];
      const homePostURL =
        `https://community.wanikani.com/posts/${parseInt(postId)}.json`;
      const homePost = await (await fetch(homePostURL)).json();

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      const monthName = monthNames[new Date().getMonth()];
      const dayNum = new Date().getDate();
      const paddedDayNum = dayNum.toString().padStart(2, "0");

      const xPlacerRegex =
        new RegExp(`(${monthName}.+?${paddedDayNum})\\[\\]`, "s");
      const updatedHomePost = homePost.raw.replace(xPlacerRegex, "$1[X]");

      const dayCounterRegex =
        new RegExp(`^.*${monthName}.*?${paddedDayNum}\\[X?\\]`, "gs");

      updatePost(postId, updatedHomePost);

      curDayNum =
        (updatedHomePost.match(dayCounterRegex)[0].match(/\[X?\]/g) || [])
          .length;
    }

    document.querySelector("button.create:not(.reply)").click();
    const interval = setInterval(async function() {
      const editor = document.querySelector("textarea.d-editor-input");
      if (editor) {
        editor.value = handleTemplate(template, curDayNum, userHomePostURL);
        clearInterval(interval);
      }
    }, 100);
  }

  function saveTemplate() {
    const textbox = document.querySelector(".d-editor-input");
    template = textbox.value;
    window.localStorage.setItem("reading-challenge-updater.template", template);
  }

  function handleTemplate(template, curDay, homePost) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const shortMonthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let interpolated = template;
    interpolated = interpolated.replaceAll(/\$\$([^$]+)\$\$/g, (_, name) => {
      switch (name) {
      case "dayNum":
        return curDay;
      case "homePost":
        return homePost;
      case "month":
        return monthNames[new Date().getMonth()];
      case "shortMonth":
        return shortMonthNames[new Date().getMonth()];
      case "dayOfMonth":
        return new Date().getDate();
      default:
        return `$$${name}$$`;
      }
    });

    return interpolated;
  }
})();
