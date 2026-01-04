// ==UserScript==
// @name         Sync Twitter To Flomo
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  create a flomo note of current twitter thread, need flomo api
// @author       fankaidev
// @match        https://x.com/*
// @match        https://twitter.com/*
// @connect      flomoapp.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497677/Sync%20Twitter%20To%20Flomo.user.js
// @updateURL https://update.greasyfork.org/scripts/497677/Sync%20Twitter%20To%20Flomo.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let mainUser = "";
  let mainDate = "";
  let title = "";

  function getTweetUser(tweet) {
    let div = tweet.querySelector('div[data-testid="User-Name"]');
    if (!div) {
      return "";
    }
    return div.textContent.split("·")[0].split("@");
  }

  function getTweetText(tweet) {
    let tweetText = tweet.querySelector('div[data-testid="tweetText"]');
    if (!tweetText) {
      return "";
    }
    return tweetText.textContent;
  }

  function getTweetTime(tweet) {
    let divs = tweet.getElementsByTagName("time");
    for (let div of divs) {
      if (div.textContent.length > 8) {
        return div.textContent;
      }
    }
    return "";
  }

  function quoteText(inputString) {
    let lines = inputString.split("\n");
    let modifiedLines = lines.map((line) => "> " + line);
    let result = modifiedLines.join("\n");
    return result;
  }

  function getTweetContent(tweetDiv) {
    // console.log(tweetDiv);
    let tweetContent = "";
    let tweetLinks = [];
    if (tweetDiv) {
      let user = getTweetUser(tweetDiv);
      if (!user) {
        return { content: tweetContent, links: tweetLinks };
      }
      let txt = getTweetText(tweetDiv);
      let ts = getTweetTime(tweetDiv);
      tweetContent += `${user[0].trim()} @${user[1]}\n`;
      if (ts) {
        tweetContent += `${ts}\n`;
        if (!mainDate) {
          mainDate = ts;
          mainUser = user[0];
          title = _.truncate(txt, {'length': 120, 'omission': '...' });
        }
      }
      tweetContent += `---\n${txt}\n`;
      let linkDivs = tweetDiv.querySelectorAll('div[role="link"]');
      let subLinks = [];
      let subContents = [];
      for (let linkDiv of linkDivs) {
        const { content, links } = getTweetContent(linkDiv);
        subLinks.push(...links);
        subContents.push(content);
      }
      let imgs = tweetDiv.getElementsByTagName("img");
      for (let img of imgs) {
        if (img.src.includes("twimg.com/media") && !subLinks.includes(img.src)) {
          tweetLinks.push(img.src);
          tweetContent += `${img.src}\n`;
        }
      }
      for (let content of subContents) {
        if (content.trim()) {
          tweetContent += `\n${quoteText(content)}\n`;
        }
      }
    }
    // console.log("links", tweetLinks)
    return { content: tweetContent, links: tweetLinks };
  }

  function getFullContent() {
    mainUser = "";
    mainDate = "";
    title = "";
    var fullContent = "";
    const primaryColumn = document.querySelector('div[data-testid="primaryColumn"]');
    if (!primaryColumn) {
      console.log("primaryColumn not found");
      return "";
    }
    const postsSection = primaryColumn.firstChild.getElementsByTagName("section")[0];
    if (!postsSection) {
      console.log("missing posts");
      return "";
    }
    // console.log("section", postsSection)
    // console.log("section", postsSection.getElementsByTagName('div')[0].firstChild)
    const postDivs = postsSection.getElementsByTagName("div")[0].firstChild.children;
    if (postDivs.length === 0) {
      console.log("missing posts");
      return "";
    }
    // console.log("len of posts:", postDivs.length);
    for (let postDiv of postDivs) {
      if (postDiv.textContent === "More Tweets" || postDiv.textContent.startsWith("Discover more")) {
        break;
      }
      if (Array.from(postDiv.getElementsByTagName("span")).some(span => span.innerText.trim() === "Ad")) {
        console.log("skip ad block", postDiv);
        continue;
      }
      let tweetDiv = postDiv.getElementsByTagName("article")[0];
      let { content } = getTweetContent(tweetDiv);
      if (content) {
        fullContent += `======\n${content}\n`;
      }
    }
    fullContent = `#twitter\n${mainUser}: ${title}\n${window.location.href}\n` + fullContent;

    console.log("full content:\n", fullContent);
    return fullContent;
  }

  function createFlomoButton(flomoApi, fullContent) {
    const img = document.createElement("img");

    img.style.cursor = "pointer";
    img.style.width = "32px";
    img.style.height = "32px";

    img.onclick = function () {
      GM_xmlhttpRequest({
        method: "POST",
        url: flomoApi,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ content: fullContent }),
        onload: function (response) {
          console.log("Success:", response.status);
        },
        onerror: function (response) {
          console.log("Error:", response.statusText);
        },
      });
      img.style.width = "36px";
      img.style.height = "36px";
      setTimeout(function () {
        img.style.width = "32px";
        img.style.height = "32px";
      }, 200);
    };

    GM_xmlhttpRequest({
      method: "GET",
      url: "https://flomoapp.com/images/logo-192x192.png",
      responseType: "blob",
      onload: function (response) {
        img.src = URL.createObjectURL(response.response);
      },
    });

    const div = document.createElement("div");
    div.appendChild(img);
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.width = "36px";
    div.style.marginLeft = "50px";

    return div;
  }

  function fetchFlomoApi() {
    let flomoApi = localStorage.getItem("flomo_api");
    if (!flomoApi) {
      flomoApi = prompt("Please enter the flomo_api from https://v.flomoapp.com/mine/?source=incoming_webhook");
      if (flomoApi) {
        localStorage.setItem("flomo_api", flomoApi);
        alert("flomo_api has been saved.");
      } else {
        alert("No key entered. flomo_api was not saved.");
        return false;
      }
    }
    return flomoApi;
  }

  // Function to insert text into the sidebar
  function process() {
    console.log("try process");
    const fullContent = getFullContent();
    if (!fullContent) {
      return false;
    }
    const flomoApi = fetchFlomoApi();
    if (!flomoApi) {
      return true;
    }
    const flomoButton = createFlomoButton(flomoApi, fullContent);
    const buttons = document.querySelector('div[role="group"]');
    buttons.appendChild(flomoButton);

    return true;
  }

  let processing = false;
  function tryProcess() {
    if (processing) {
      console.log("already processing, skip");
      return;
    }
    if (!window.location.href.includes("status")) {
      console.log("skip process url:", window.location.href);
      return;
    }
    var interval = setInterval(function () {
      try {
        processing = true;
        if (process()) {
          clearInterval(interval);
          processing = false;
        }
      } catch (error) {
        console.log(error);
        clearInterval(interval);
        processing = false;
      }
    }, 500);
  }

  (function (history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function (state, title, url) {
      const result = pushState.apply(history, arguments);
      window.dispatchEvent(new Event("pushstate"));
      window.dispatchEvent(new Event("locationchange"));
      return result;
    };
    history.replaceState = function (state, title, url) {
      const result = replaceState.apply(history, arguments);
      window.dispatchEvent(new Event("replacestate"));
      window.dispatchEvent(new Event("locationchange"));
      return result;
    };
    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("locationchange"));
    });
  })(window.history);

  window.addEventListener("locationchange", () => {
    console.log("URL changed to:", window.location.href);
    setTimeout(tryProcess, 1000);
  });
})();
