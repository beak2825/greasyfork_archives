// ==UserScript==
// @name         Twitter One-Click Block Button
// @namespace    https://gist.github.com/toxicwind
// @version      1.2
// @description  Adds a block button to every tweet in order to quickly block people.
// @author       toxicwind
// @license      MIT
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447841/Twitter%20One-Click%20Block%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/447841/Twitter%20One-Click%20Block%20Button.meta.js
// ==/UserScript==

const css = `
    a.block-button {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    a.block-button svg {
        width: 1em;
        height: 1em;
        fill: currentcolor;
    }

    a.block-button {
        transition: color 0.5s;
    }

    a.block-button:hover {
        color: red;
    }

    @keyframes wide {
        0% {
            width: 0%
        }
        100% {
            width: 60%;
        }
    }`;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

(async () => {
  let fetchToken = async () => {
    let mainUrl = null;
    for (let script of document.body.querySelectorAll("script[src]"))
      if (/\/main\.[^\/]*\.js$/.test(script.src)) mainUrl = script.src;
    if (!mainUrl) return null;

    let response = await fetch(mainUrl);
    let mainSource = await response.text();
    let result = /\"AAAAAAA[^"]+\"/.exec(mainSource);
    if (!result || result.length != 1) return null;

    return JSON.parse(result[0]);
  };

  let authToken = await fetchToken();

  let getCookie = (cname) => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  let blockUser = async (userName) => {
    return await fetch("https://api.twitter.com/1.1/blocks/create.json", {
      credentials: "include",
      referrer: "https://api.twitter.com/1.1/blocks/create.json",
      body: `screen_name=${userName}`,
      method: "POST",
      mode: "cors",
      headers: {
        "x-twitter-auth-type": "OAuth2Session",
        "x-twitter-client-language": "en",
        "x-twitter-active-user": "yes",
        "x-csrf-token": getCookie("ct0"),
        authorization: `Bearer ${authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };

  let buttonClick = async (e) => {
    let userName = e.currentTarget.dataset.blockUser;
    let blockResult = await blockUser(userName);
    if (blockResult.status === 200) {
      $("article")
        .find("a[data-block-user=" + userName + "]")
        .parents("article[data-testid=tweet]")
        .slideUp(200);
      //alert("User blocked successfully.");
    } else {
      alert(
        "The block operation failed, see the network tab for detailes of the failure."
      );
    }
  };

  const icon = `<span>&nbsp;·&nbsp;</span><svg xmlns="http://www.w3.org/2000/svg" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m17.069 6.546 2.684-2.359c.143-.125.32-.187.497-.187.418 0 .75.34.75.75 0 .207-.086.414-.254.562l-16.5 14.501c-.142.126-.319.187-.496.187-.415 0-.75-.334-.75-.75 0-.207.086-.414.253-.562l2.438-2.143c-1.414-1.132-2.627-2.552-3.547-4.028-.096-.159-.144-.338-.144-.517s.049-.358.145-.517c2.111-3.39 5.775-6.483 9.853-6.483 1.815 0 3.536.593 5.071 1.546zm2.318 1.83c.967.943 1.804 2.013 2.475 3.117.092.156.138.332.138.507s-.046.351-.138.507c-2.068 3.403-5.721 6.493-9.864 6.493-1.298 0-2.553-.313-3.73-.849l2.624-2.307c.352.102.724.156 1.108.156 2.208 0 4-1.792 4-4 0-.206-.016-.408-.046-.606zm-4.932.467c-.678-.528-1.53-.843-2.455-.843-2.208 0-4 1.792-4 4 0 .741.202 1.435.553 2.03l1.16-1.019c-.137-.31-.213-.651-.213-1.011 0-1.38 1.12-2.5 2.5-2.5.474 0 .918.132 1.296.362z" fill-rule="nonzero"/>`;

  let observer;

  const interval = setInterval(init, 500);

  function init() {
    const el = document.querySelectorAll(
      'div[data-testid="primaryColumn"] section article'
    );

    if (el && el.length > 0) {
      clearInterval(interval);
      debug("articles found");
      //add links to already exisiting articles
      observer = new MutationObserver(newTweets);
      observer.observe(document.body, {
        childList: true,
        attributes: false,
        subtree: true,
        characterData: false,
      });

      el.forEach((article) => {
        createLink(article);
      });
    }
  }

  function newTweets(mutationList, observer) {
    mutationList.forEach((mut) => {
      if (mut.addedNodes.length > 0) {
        mut.addedNodes.forEach((node) => {
          if (node.innerHTML && node.innerHTML.indexOf("<article ") > -1) {
            createLink(node.querySelector("article"));
          }
        });
      }
    });
  }

  function createLink(t) {
    if (!t.querySelector("a[block-button]")) {
      const profileName = t
        .querySelector("div[data-testid=User-Names]")
        .querySelector("a")
        .pathname.substr(1);

      const time = t.querySelector('a[href*="/status/"] time[datetime]');
      if (!time) return;
      const statuslink = time.parentNode;

      const block_link = document.createElement("a");
      block_link.setAttribute("class", "block-button");
      block_link.setAttribute("data-block-user", profileName);
      block_link.innerHTML = icon;
      statuslink.insertAdjacentElement("afterend", block_link);

      block_link.title = "Block User: " + profileName;
      block_link.onclick = buttonClick;
    }
  }
})();
