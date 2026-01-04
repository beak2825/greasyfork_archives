// ==UserScript==
// @name        Sharty Fixes Gemerald
// @namespace   soyjak.party
// @match       http*://soyjak.party/*
// @match       http*://www.soyjak.party/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     *
// @license MIT
// @version     1.063
// @author      Sharty Fixes by Xyl, continued by Doughy and also thanks to whoever created post filters.
// @description The Gemmiest Enhancements for the 'ty
// @downloadURL https://update.greasyfork.org/scripts/456980/Sharty%20Fixes%20Gemerald.user.js
// @updateURL https://update.greasyfork.org/scripts/456980/Sharty%20Fixes%20Gemerald.meta.js
// ==/UserScript==

const version = "v1.063";
console.log(`Sharty Fixes Gemerald ${version}`);

const namespace = "ShartyFixes.";
function setValue(key, value) {
  if (key == "hiddenthreads" || key == "hiddenimages") {
    if (typeof GM_setValue == "function") {
      GM_setValue(key, value);
    }
    localStorage.setItem(key, value);
  } else {
    if (typeof GM_setValue == "function") {
      GM_setValue(namespace + key, value);
    } else {
      localStorage.setItem(namespace + key, value);
    }
  }
}

function getValue(key) {
  if (key == "hiddenthreads" || key == "hiddenimages") {
    if (typeof GM_getValue == "function" && GM_getValue(key)) {
      localStorage.setItem(key, GM_getValue(key).toString());
    }
    return localStorage.getItem(key);
  }
  if (typeof GM_getValue == "function") {
    return GM_getValue(namespace + key);
  } else {
    return localStorage.getItem(namespace + key);
  }
}

function isEnabled(key) {
  let value = getValue(key);
  if (value == null) {
    value = optionsEntries[key][2];
    setValue(key, value);
  }
  return value.toString() == "true";
}

function getNumber(key) {
  let value = parseInt(getValue(key));
  if (Number.isNaN(value)) {
    value = 0;
  }
  return value;
}

function getJson(key) {
  let value = getValue(key);
  if (value == null) {
    value = "{}";
  }
  return JSON.parse(value);
}

function addToJson(key, jsonKey, value) {
  let json = getJson(key);
  let parent = json;
  jsonKey.split(".").forEach((e, index, array) => {
    if (index < array.length - 1) {
      if (!parent.hasOwnProperty(e)) {
        parent[e] = {};
      }
      parent = parent[e];
    } else {
      parent[e] = value;
    }
  });
  setValue(key, JSON.stringify(json));
  return json;
}

function removeFromJson(key, jsonKey) {
  let json = getJson(key);
  let parent = json;
  jsonKey.split(".").forEach((e, index, array) => {
    if (index < array.length - 1) {
      parent = parent[e];
    } else {
      delete parent[e];
    }
  });
  setValue(key, JSON.stringify(json));
  return json;
}

function customAlert(a) {
    document.body.insertAdjacentHTML("beforeend", `
<div id="alert_handler">
  <div id="alert_background" onclick="this.parentNode.remove()"></div>
  <div id="alert_div">
    <a id='alert_close' href="javascript:void(0)" onclick="this.parentNode.parentNode.remove()"><i class='fa fa-times'></i></a>
    <div id="alert_message">${a}</div>
    <button class="button alert_button" onclick="this.parentNode.parentNode.remove()">OK</button>
  </div>
</div>`);
}

const fileToMime = {
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "jfif": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "avif": "image/avif",
  "bmp": "image/bmp",
  "tif": "image/tiff",
  "tiff": "image/tiff",
  "webp": "image/webp",
  "aac": "audio/aac",
  "flac": "audio/flac",
  "mid": "audio/midi",
  "midi": "audio/midi",
  "mp3": "audio/mpeg",
  "ogg": "audio/ogg",
  "opus": "audio/opus",
  "wav": "audio/wav",
  "weba": "audio/webm",
  "mp4": "video/mp4",
  "webm": "video/webm",
  "pdf": "application/pdf"
}

const optionsEntries = {
  "autofill-captcha": ["checkbox", "Autofill text captcha when in use (recommended, only disable if causing issues)", true],
  "bypass-filter": ["checkbox", "Try to bypass word filter when posting", true],
  "partysover": ["checkbox", "Disable Party Hats", true],
  "bannerhide": ["checkbox", "Disable the Banner", false],
  "classic": ["checkbox", "Green 'Chud' Name", true],
  "sageicon": ["checkbox", "Disable Sage Indicator", false],
  "annhide": ["checkbox", "Automatically hide the Blotter", false],
  "gemcursor": ["checkbox", "Use a custom 'Sharty Cursor", false],
  // "restore-filtered": ["checkbox", "Try to restore filtered words", false],
  "show-quote-button": ["checkbox", "Show quick quote button", true],
  "mass-reply-quote": ["checkbox", "Enable mass reply and mass quote buttons", false],
  "anonymise": ["checkbox", "Anonymise name and tripfags", false],
  "hover-images": ["checkbox", "Popup image on hover", true],
  "hover-on-catalog": ["checkbox", "Show image hover on the catalog", true],
  "hide-blotter": ["checkbox", "Always hide blotter", false],
  "truncate-long-posts": ["checkbox", "Truncate line spam", false],
  "disable-submit-on-cooldown": ["checkbox", "Disable submit button on cooldown", false],
  "desktop-triple-click": ["checkbox", "Enable triple click to hide catalog thread on desktop", false],
  "force-exact-time": ["checkbox", "Show exact time", false],
  "hide-sage-images": ["checkbox", "Hide sage images by default (help mitigate gross spam)", false],
  "catalog-navigation": ["checkbox", "Board list links to catalogs when on catalog", true]
}






let options = Options.add_tab("sharty-fixes", "gear", "Sharty Fixes Gemerald").content[0];


let optionsHTML = `<span style="display: block; text-align: center">${version}</span>`;
optionsHTML += `<a style="display: block; text-align: center" href="https://greasyfork.org/en/scripts/458480-sharty-themes">Also try Sharty Themes!</a><br>`;
optionsHTML += `<span style="display: block; text-align: center"><h1></h1></span>`;
for ([optKey, optValue] of Object.entries(optionsEntries)) {
  optionsHTML += `<input type="${optValue[0]}" id="${optKey}" name="${optKey}"><label for="${optKey}">${optValue[1]}</label><br>`;
}
options.insertAdjacentHTML("beforeend", optionsHTML);

options.querySelectorAll("input[type=checkbox]").forEach(e => {
  e.checked = isEnabled(e.id);
  e.addEventListener("change", e => {
    setValue(e.target.id, e.target.checked);
  });
});



// redirect
if (location.origin.match(/(http:|\/www)/g)) {
  location.replace(`https://soyjak.party${location.pathname}${location.hash}`);
}

const board = window.location.pathname.split("/")[1];

// post fixes
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
if (document.body.classList.contains("active-thread")) {
  const updateObserver = new MutationObserver(list => {
    const evt = new CustomEvent("post_update", {
      detail: list
    });
    document.dispatchEvent(evt);
  });
  updateObserver.observe(document.querySelector(".thread"), {
    childList: true
  });
}

let intervals = {};
function fixPost(post) {
  let timeElement = post.querySelector("[datetime]");
  let time = new Date(Date.parse(timeElement.getAttribute("datetime")));
  let isOwnPost;
  let postNumber = post.getElementsByClassName("post_no")[1];
  let postText = postNumber.textContent;

  if (email = post.querySelector("a.email")) {
    if (isEnabled("hide-sage-images") && !post.classList.contains("image-hide-processed") && email.href.match(/mailto:sage$/i)) {
      let localStorageBackup = localStorage.getItem("hiddenimages");
      let interval = setInterval(() => {
        if (document.querySelector(`[id*="${postText}"] .hide-image-link`)) {
          post.classList.add("image-hide-processed");
          clearInterval(interval);
          document.querySelector(`[id*="${postText}"] .files`).querySelectorAll(".hide-image-link:not([style*='none'])").forEach(e => e.click());
          localStorage.setItem("hiddenimages", localStorageBackup);
        }
      }, 50);
    }
  }
  try { isOwnPost = JSON.parse(localStorage.getItem("own_posts"))[board].includes(post.querySelector(".post_no[onclick*=cite]").innerText) } catch { isOwnPost = false };
  if (isOwnPost && getNumber("lastTime") < time.getTime()) {
    setValue("lastTime", time.getTime());
  }
  timeElement.outerHTML = `<span datetime=${timeElement.getAttribute("datetime")}>${timeElement.innerText}</span>`;
  post.querySelector(".intro").insertAdjacentHTML("beforeend", `<span class="quote-buttons"></span>`);
  if (isEnabled("show-quote-button")) {
    post.querySelector(".quote-buttons").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" class="quick-quote">[>]</a>`);
    post.querySelector(".quote-buttons").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" class="quick-orange">[<]</a>`);
  }
  if (isEnabled("mass-reply-quote") && post.classList.contains("op") && post.closest(".active-thread")) {
    document.querySelector(".quote-buttons").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" id="mass-reply">[Mass Reply]</a><a href="javascript:void(0);" id="mass-quote">[Mass Quote]</a><a href="javascript:void(0);" id="mass-orange">[Mass Orange]</a>`);
  }
  let body = post.querySelector(".body");
  body.childNodes.forEach(e => {
    if (e.nodeType == 3) {
      let span = document.createElement("span");
      span.innerText = e.textContent;
      e.parentNode.replaceChild(span, e);
    }
  });
  if (document.body.classList.contains("active-thread")) {
    postNumber.href = `#q${postNumber.textContent}`;
    postNumber.setAttribute("onclick", `$(window).trigger('cite', [${postNumber.textContent, null}]);`);
    postNumber.addEventListener("click", () => {
      let selection = window.getSelection().toString();
      document.querySelectorAll("textarea[name=body]").forEach(e => {
        e.value += `>>${postNumber.textContent}\n${selection != "" ? selection.replace(/(\r\n|\r|\n|^)/g, "$1>") : ""}`;
      });
    });
  }
  if (isEnabled("anonymise")) {
    post.querySelector(".name").textContent = "Chud";
    if (trip = post.querySelector(".trip")) {
      trip.remove();
    }
  }
  post.querySelectorAll("a").forEach(a => {
    a.href = decodeURIComponent(a.href.replace("https://jump.kolyma.net/?", ""));
  });
  undoFilter(post);
}

function addExpandos() {
  if (isEnabled("truncate-long-posts")) {
    document.querySelectorAll(".post").forEach(e => {
      let body = e.querySelector(".body");
      e.classList.add("sf-cutoff");
      if (body.scrollHeight > body.offsetHeight) {
        if (!e.querySelector(".sf-expander")) {
          body.insertAdjacentHTML("afterend", `<br><a href="javascript:void(0)" class="sf-expander"></a>`);
        }
        if (e.getAttribute("manual-cutoff") == "false" || (window.location.hash.includes(e.id.split("_")[1]) && !e.getAttribute("manual-cutoff"))) {
          e.classList.remove("sf-cutoff");
        }
      } else if (body.scrollHeight == body.offsetHeight) {
        if (expander = e.querySelector(".sf-expander")) {
          expander.remove();
        }
        e.classList.remove("sf-cutoff");
      }
    });
  }
}

window.addEventListener("resize", () => addExpandos());


function fixTime() {
  document.querySelectorAll(".post").forEach(e => {
    let timeElement = e.querySelector("[datetime]");
    let time = new Date(Date.parse(timeElement.getAttribute("datetime")));
    let exactTime = `${("0" + (time.getMonth() + 1)).slice(-2)}/${("0" + time.getDate()).slice(-2)}/${time.getYear().toString().slice(-2)} (${weekdays[time.getDay()]}) ${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`;
    let relativeTime;
    let difference = (Date.now() - time.getTime()) / 1000;
    if (difference < 10) {
      relativeTime = "Just now";
    } else if (difference < 60) {
      relativeTime = `${Math.floor(difference)} seconds ago`;
    } else if (difference < 120) {
      relativeTime = `1 minute ago`;
    } else if (difference < 3600) {
      relativeTime = `${Math.floor(difference/60)} minutes ago`;
    } else if (difference < 7200) {
      relativeTime = `1 hour ago`;
    } else if (difference < 86400) {
      relativeTime = `${Math.floor(difference/3600)} hours ago`;
    } else if (difference < 172800) {
      relativeTime = `1 day ago`;
    } else if (difference < 2678400) {
      relativeTime = `${Math.floor(difference/86400)} days ago`;
    } else if (difference < 5356800) {
      relativeTime = `1 month ago`;
    } else if (difference < 31536000) {
      relativeTime = `${Math.floor(difference/2678400)} months ago`;
    } else if (difference < 63072000) {
      relativeTime = `1 year ago`;
    } else {
      relativeTime = `${Math.floor(difference/31536000)} years ago`;
    }
    if (isEnabled("force-exact-time")) {
      timeElement.innerText = exactTime;
      timeElement.setAttribute("title", relativeTime);
    } else {
      timeElement.innerText = relativeTime;
      timeElement.setAttribute("title", exactTime);
    }
  });
}

function initFixes() {
  document.querySelectorAll("form[name=post] th").forEach(e => {
    if (e.innerText == "Comment") {
      e.insertAdjacentHTML("beforeend", `<sup title="Formatting help" class="sf-formatting-help">?</sup><br><div class="comment-quotes"><a href="javascript:void(0);" class="comment-quote">[>]</a><a href="javascript:void(0);" class="comment-orange">[<]</a></div>`);
    }
  });
  if (typeof GM_xmlhttpRequest == "function") {
    let fileSelectionInterval = setInterval(() => {
      if (select = document.querySelector("#upload_selection")) {
        select.childNodes[0].insertAdjacentHTML('afterend', ` / <a href="javascript:void(0)" id="sf-file-url"></a>`);
        clearInterval(fileSelectionInterval);
      }
    }, 100);
  }
  document.addEventListener("dyn_update", e => {
    e.detail.forEach(e => fixPost(e));
    fixTime();
    addExpandos();
  });

  document.addEventListener("post_update", e => {
    e.detail.forEach(node => {
      if (node.addedNodes[0].nodeName == "DIV") {
        fixPost(node.addedNodes[0]);
      }
    });
    fixTime();
    addExpandos();
  });
  [...document.getElementsByClassName("post")].forEach(e => {
    fixPost(e);
  });
  fixTime();
  addExpandos();
}

// undo filter
function undoFilter(post) {
  // if (isEnabled("restore-filtered")) {
  //   post.querySelectorAll(".body, .body *, .replies, .replies *").forEach(e => {
  //     e.childNodes.forEach(e => {
  //       if (e.nodeName == "#text") {
  //         e.nodeValue = e.nodeValue.replaceAll("im trans btw", "kuz");
  //       }
  //     });
  //   });
  // }
}

// catalog fixes
document.querySelectorAll("#Grid > div").forEach(e => {
  let threadTime = new Date(parseInt(e.getAttribute("data-time")) * 1000);
  e.getElementsByClassName("thread-image")[0].setAttribute("title", `${months[threadTime.getMonth()]} ${("0" + threadTime.getDate()).slice(-2)}` +
    ` ${("0" + threadTime.getHours()).slice(-2)}:${("0" + threadTime.getMinutes()).slice(-2)}`);
  e.querySelectorAll("a").forEach(a => {
    a.href = decodeURIComponent(a.href.replace("https://jump.kolyma.net/?", ""));
  });
  undoFilter(e);
});

// overboard reporting
if (document.body.classList.contains("active-ukko")) {
  const overboardObserver = new MutationObserver(list => {
    const evt = new CustomEvent("overboard_load", {
      detail: list
    });
    document.dispatchEvent(evt);
  });
  overboardObserver.observe(document.querySelector("form[name=postcontrols]"), {
    childList: true,
    subtree: true
  });

  let fixOverboardReport = node => {
    node.setAttribute("action", "/post.php");
    node.lastChild.value = node.closest(".thread").getAttribute("data-board");
  };

  document.addEventListener("overboard_load", e => {
    e.detail.forEach(mut => {
      if (mut.addedNodes.length == 1) {
        let node = mut.addedNodes[0];
        if (node.classList && node.classList.contains("post-actions")) {
          fixOverboardReport(node);
        }
      }
    });
  });
  [...document.getElementsByClassName("post-actions")].forEach(e => {
    fixOverboardReport(e);
  });
}

// ctrl + enter to post
window.addEventListener("keydown", e => {
  if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
    if (form = e.target.closest("form[name=post]")) {
      form.querySelector("input[type=submit]").click();
    }
  }
});

// autofocus textarea
if ((textarea = document.querySelector("textarea[name=body]")) && document.documentElement.classList.contains("desktop-style") && window.location.hash[1] != "q") {
  textarea.focus({
    preventScroll: true
  });
}

// automatically load text captcha
if (script = document.querySelector("td > script")) {
  console.log("Loading captcha...");
  let variables = Array.from(script.textContent.matchAll(/(?<=")[^",]*(?=")/g), m => m[0]);
  actually_load_captcha(variables[0], variables[1]);
}

// text captcha solver
function solveCaptcha() {
  let bodyColour = window.getComputedStyle(document.body).getPropertyValue("color");
  let captcha = document.querySelector(".captcha_html > div");
  let captchaBox = captcha.getBoundingClientRect();
  let rotationDict = {
    "ɐ": "a",
    "ə": "e",
    "b": "q",
    "d": "p",
    "n": "u",
    "p": "d",
    "q": "b",
    "u": "n",
    6: 9,
    9: 6,
  };
  let chars = [];
  document.querySelectorAll(".captcha_html div").forEach(e => {
    let charBox = e.getBoundingClientRect();
    let charStyle = window.getComputedStyle(e);
    if (e.innerText.length == 1 &&
        charBox.left > captchaBox.left - 5 &&
        charBox.right < captchaBox.right + 5 &&
        charBox.top > captchaBox.top - 5 &&
        charBox.bottom < captchaBox.bottom + 5 &&
        parseInt(charStyle.getPropertyValue("font-size")) > 15 &&
        parseInt(charStyle.getPropertyValue("height")) > 5 &&
        charStyle.getPropertyValue("overflow") != "hidden" &&
        charStyle.getPropertyValue("color") == bodyColour) {
      let character = e.innerText;
      if (charStyle.getPropertyValue("transform").match(/\(-/)) {
        if (rotationDict[e.innerText]) {
          character = rotationDict[e.innerText];
        }
      }
      chars.push([character, charBox.left]);
    }
  });
  if (chars.length == 3) {
    chars.sort((a, b) => (a[1] > b[1]) ? 1 : -1);
    document.querySelectorAll(".captcha_text").forEach(e => {
      e.value = `${chars[0][0]}${chars[1][0]}${chars[2][0]}`;
    });
  } else {
    console.log(`Failed to solve captcha, got ${chars.length} characters instead of 3.`);
    captcha.parentElement.click();
  }
}

if (passwordBox = document.querySelector("form[name=post] input[name=password]")) {
  passwordBox.setAttribute("type", "password");
  passwordBox.insertAdjacentHTML("afterend", `<input type="button" name="toggle-password" value="Show">`);
}

document.querySelectorAll("form[name=post] input[type=submit]").forEach(e => {
  e.setAttribute("og-value", e.getAttribute("value"));
});
setInterval(() => {
  let lastTime = getNumber("lastTime");
  let difference = 11 - Math.ceil((Date.now() - lastTime) / 1000);
  let buttons = document.querySelectorAll("form[name=post] input[type=submit]");
  if ([...buttons].find(e => e.value.includes("Post"))) {
    return;
  } else if (difference > 0) {
    let disableButton = isEnabled("disable-submit-on-cooldown");
    buttons.forEach(e => {
      e.value = `${e.getAttribute("og-value")} (${difference})`;
      if (disableButton) {
        e.setAttribute("disabled", "disabled");
      }
    });
  } else {
    buttons.forEach(e => {
      e.value = e.getAttribute("og-value");
      e.removeAttribute("disabled");
    });
  }
}, 100);

function areHiddenThreads() {
  console.log("poopy");
  let threadGrid = document.getElementById("Grid");
  if (document.querySelector(".catty-thread.hidden")) {
    if (!document.getElementById("toggle-hidden")) {
      document.querySelector(".desktop-style #image_size, .mobile-style header").insertAdjacentHTML("afterend", `<span id="toggle-hidden"></span>`);
    }
  } else if (toggleButton = document.getElementById("toggle-hidden")) {
    toggleButton.remove();
    document.body.classList.remove("showing-hidden");
  }
}

if (document.body.classList.contains("active-catalog")) {
  if (isEnabled("catalog-navigation")) {
    document.querySelectorAll(".boardlist a[href*='index.html']").forEach(e => e.href = e.href.replace("index.html", "catalog.html"));
  }
  document.querySelector("#image_size").insertAdjacentHTML("afterend", `
    <form style="display: inline-block; margin-bottom: 0px;" action="/search.php">
      <p>
        <input type="text" name="search" placeholder="${board} search">
        <input type="hidden" name="board" value="${board}">
        <input type="submit" value="Search">
      </p>
    </form>
  `);
  let hiddenThreads = getJson("hiddenthreads");
  let hasThreads = hiddenThreads.hasOwnProperty(board);
  document.querySelectorAll(".mix").forEach(e => {
    e.classList.replace("mix", "catty-thread");
    if (hasThreads && hiddenThreads[board].hasOwnProperty(e.getAttribute("data-id"))) {
      e.classList.add("hidden");
      delete hiddenThreads[board][e.getAttribute("data-id")];
    }
    if (e.getAttribute("data-sticky") == "true") {
      e.parentNode.prepend(e);
    }
  });

  if (hasThreads) {
    Object.keys(hiddenThreads[board]).forEach(e => {
      removeFromJson("hiddenthreads", `${board}.${e}`);
    });
  }
  areHiddenThreads();
}

document.addEventListener("click", e => {
  let t = e.target;
  if (t.matches("form[name=post] input[type=submit]")) {
    t.value = t.getAttribute("og-value");
    if (isEnabled("bypass-filter")) {
      let textbox = t.closest("tbody").querySelector("textarea[name=body]");
      textbox.value = textbox.value.replaceAll(/(discord)/ig, str => {
        let arr = [];
        while (!arr.includes("​")) {
          arr = [];
          [...str].forEach((c, i) => {
            if (Math.random() < 0.5 && i != 0) {
              arr.push("​");
            }
            arr.push(c);
            if (Math.random() > 0.5 && i != str.length - 1) {
              arr.push("​");
            }
          });
        }
        return arr.join("");
      });
    }
  } else if (t.matches("input[name=toggle-password]")) {
    if (passwordBox.getAttribute("type") == "password") {
      passwordBox.setAttribute("type", "text");
      t.value = "Hide";
    } else {
      passwordBox.setAttribute("type", "password");
      t.value = "Show";
    }
  } else if (t.id == "mass-reply") {
    let massReply = "";
    document.querySelectorAll("[href*='#q']").forEach(e => {
      massReply += `>>${e.textContent}\n`;
    });
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value += massReply;
      e.focus();
    });
  } else if (t.id == "mass-quote" || t.id == "mass-orange") {
    document.body.classList.add("hide-quote-buttons");
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(document.body);
    selection.removeAllRanges();
    selection.addRange(range);
    let massQuote = window.getSelection().toString().replace(/(\r\n|\r|\n|^)/g, t.id == "mass-quote" ? "$1>" : "$1<") + "\n";
    selection.removeAllRanges();
    document.body.classList.remove("hide-quote-buttons");
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value += massQuote;
      e.focus();
    });
  } else if (t.classList.contains("quick-quote") || t.classList.contains("quick-orange")) {
    let quote = t.closest(".post").querySelector(".body").innerText.replace(/(\r\n|\r|\n|^)/g, t.classList.contains("quick-quote") ? "$1>" : "$1<") + "\n";
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value += quote;
      e.focus();
    });
  } else if (t.classList.contains("comment-quote") || t.classList.contains("comment-orange")) {
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value = e.value.replace(/(\r\n|\r|\n|^)/g, t.classList.contains("comment-quote") ? "$1>" : "$1<");
      e.focus();
    });
  } else if ((e.shiftKey || (e.detail == 3 && (document.documentElement.matches(".mobile-style") || isEnabled("desktop-triple-click")))) &&
             t.matches(".active-catalog .catty-thread *, .active-catalog .catty-thread")) {
    e.preventDefault();
    let thread = t.closest(".catty-thread");
    thread.classList.toggle("hidden");
    if (thread.classList.contains("hidden")) {
      addToJson("hiddenthreads", `${board}.${thread.getAttribute("data-id")}`, Math.floor(Date.now() / 1000));
    } else {
      removeFromJson("hiddenthreads", `${board}.${thread.getAttribute("data-id")}`);
    }
    areHiddenThreads();
  } else if (t.id == "toggle-hidden") {
    document.body.classList.toggle("showing-hidden");
  } else if (t.classList.contains("hide-thread-link") || t.classList.contains("unhide-thread-link")) {
    setValue("hiddenthreads", localStorage.getItem("hiddenthreads"));
  } else if (t.classList.contains("hide-blotter")) {
    setValue("hidden-blotter", document.querySelector(".blotter").innerText);
    document.body.classList.add("hidden-blotter");
  } else if (t.classList.contains("sf-expander")) {
    t.closest(".post").setAttribute("manual-cutoff", t.closest(".post").classList.toggle("sf-cutoff"));
  } else if (t.classList.contains("sf-formatting-help")) {
    let help = `
      <span class="quote">&gt;greentext</span><br>
      <span class="quote2">&lt;orangetext</span><br>
      <span class="heading">==redtext==</span><br>
      <span class="heading2">--bluetext--</span><br>
      <span class="spoiler">**spoiler**</span><br>
      <em>''italics''</em><br>
      <b>'''bold'''</b><br>
    `;
    customAlert(help)
  } else if (t.id == "sf-file-url" && !t.classList.contains("sf-loading")) {
    let url = window.prompt("Enter a URL: ");
    if (!url) return;
    t.classList.add("sf-loading");
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      responseType: "blob",
      onload: response => {
        if (response.status != 200) {
          customAlert("Can't read file");
          t.classList.remove("sf-loading");
          return;
        }
        if (!(response.response instanceof Blob)) {
          customAlert("Something went wrong. Using AdGuard as your userscript manager? This feature is currently broken due to its GM_xmlhttpRequest implementation returning the wrong data type.");
          return;
        }
        let responseHeaders = {};
        response.responseHeaders.trim().split("\r\n").forEach(e => {
          let split = e.split(":", 2);
          responseHeaders[split[0].toLowerCase()] = split[1].trim();
        });
        let contentType = responseHeaders["content-type"];
        let validMime = contentType != "application/octet-stream";
        let headerFilename = responseHeaders["content-disposition"]?.match(/(?<=filename=").*(?=")/);
        let filename = headerFilename ? headerFilename[0] : url.split("/").pop().split("?")[0];
        let fileExt = filename?.match(/(?<=\.)[a-zA-Z0-9]{2,4}$/);
        if (!validMime && fileExt) {
          let mime = fileToMime[fileExt[0]];
          if (mime) {
            contentType = mime;
          } else {
           customAlert("Warning: could not guess MIME type.")
          }
        }
        if (!fileExt) {
          if (validMime) {
            filename += `.${contentType.split("/")[1]}`;
          } else {
            customAlert("Failure: could not guess file extension.");
            return;
          }
        }
        let file = new File([response.response], filename, {lastModified: Date.now(), type: contentType})
        let dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        document.dispatchEvent(new DragEvent("drop", {"dataTransfer": dataTransfer}));
        t.classList.remove("sf-loading");
      }
    });
  }
});

document.addEventListener("input", e => {
  let t = e.target;
  if (t.matches("input[name=search]") && document.querySelector(".sf-catty, .active-catalog")) {
    document.querySelectorAll(".catty-thread").forEach(e => {
      if (e.innerText.toLowerCase().includes(t.value.toLowerCase())) {
        e.classList.remove("sf-filtered");
      } else {
        e.classList.add("sf-filtered");
      }
    });
  }
});

window.addEventListener("load", () => {
  if (isEnabled("autofill-captcha") && document.querySelector(".captcha_html")) {
    const captchaObserver = new MutationObserver(list => {
      const evt = new CustomEvent("captcha_load", {
        detail: list
      });
      document.dispatchEvent(evt);
    });
    captchaObserver.observe(document.querySelector(".captcha_html"), {
      childList: true
    });

    if (document.querySelector(".captcha_html > div")) {
      console.log("Captcha already exists, solving.");
      solveCaptcha();
    }
    document.addEventListener("captcha_load", () => {
      solveCaptcha();
    });
  }
});

if (getValue("hover-images") && document.documentElement.matches(".desktop-style")) {
  let adjustHoverPos = (hover, x, y) => {
    if (!document.querySelector(".post-image:hover, .thread-image:hover")) {
      hover.remove();
    }
    if (x > document.documentElement.clientWidth / 2) {
      hover.style.maxWidth = `${x - 5}px`;
      hover.style.left = "";
      hover.style.right = `${document.documentElement.clientWidth - x + 5}px`
    } else {
      hover.style.left = `${x + 5}px`
      hover.style.right = "";
      hover.style.maxWidth = `${document.documentElement.clientWidth - x + 5}px`;
    }
    hover.style.maxHeight = `${document.documentElement.clientHeight}px`;
    if (hover.naturalHeight > document.documentElement.clientHeight) {
      hover.style.top = "0px";
    } else {
      if (y < hover.naturalHeight / 2) {
        hover.style.top = `0px`;
      } else if (document.documentElement.clientHeight - y < hover.naturalHeight / 2) {
        hover.style.top = `${document.documentElement.clientHeight - (hover.naturalHeight)}px`;
      } else {
        hover.style.top = `${y - (hover.naturalHeight / 2)}px`;
      }
    }
  }

  document.addEventListener("mouseover", e => {
    let t = e.target;
    if (((!document.body.classList.contains("active-catalog") && !document.querySelector("#dyn-content.theme-catalog")) || isEnabled("hover-on-catalog")) &&
        t.matches(".post-image, .thread-image") && !t.closest(".image-hidden") && !document.querySelector("#sharty-hover")) {
      let srcImg = t.getAttribute("src").replace("thumb", "src");
      if (srcImg.match("spoiler") && !document.body.classList.contains("active-catalog")) {
        srcImg = t.closest("#dyn-content.theme-catalog") ? t.parentNode.getAttribute("file-source") : t.parentNode.href;
      } else if (srcImg.match("deleted") || srcImg.match("spoiler")) {
        return;
      }
      document.body.insertAdjacentHTML("beforeend", `<img id="sharty-hover" onerror="this.style.display='none'" src=${srcImg}>`);
      let hover = document.getElementById("sharty-hover");
      let poll = setInterval(() => {
        if (hover.naturalWidth && hover.naturalHeight) {
          clearInterval(poll);
          adjustHoverPos(hover, e.x, e.y);
        }
      }, 10);
    }
  });

  document.addEventListener("mousemove", e => {
    if (hover = document.querySelector("#sharty-hover")) {
      adjustHoverPos(hover, e.x, e.y);
    }
  });

  document.addEventListener("mouseout", e => {
    let t = e.target;
    if ((hover = document.querySelector("#sharty-hover")) && t.matches(".post-image, .thread-image")) {
      hover.remove();
    }
  });
}

if (blotter = document.querySelector(".blotter")) {
  blotter.insertAdjacentHTML("beforebegin", `<a class="hide-blotter" href="javascript:void(0)">[–]</a>`);
  if (blotter.innerText == getValue("hidden-blotter") || isEnabled("hide-blotter")) {
    document.body.classList.add("hidden-blotter");
  }
}

const partysoverOptional = isEnabled("partysover") ? `
  img src="s.4cdn.org/image/xmashat.gif" {
     display: none;
  }`
  : "";

document.head.insertAdjacentHTML("beforeend", `
<style>
  .hide-blotter {
    float: left;
  }

  .hidden-blotter .blotter,
  .hidden-blotter .blotter + hr,
  .hidden-blotter .hide-blotter,
  .catty-thread.hidden,
  .showing-hidden .catty-thread,
  .mobile-style .g-recaptcha-bubble-arrow,
  .catty-thread.sf-filtered,
  .showing-hidden .catty-thread.hidden.sf-filtered,
  .hide-quote-buttons .quote-buttons {
    display: none !important;
  }

  .reply .sf-expander {
    margin-left: 1.8em;
    padding-right: 3em;
    padding-bottom: 0.3em;
  }

  .sf-expander::after {
    content: "[Hide Full Text]";
  }

  .sf-cutoff .sf-expander::after {
    content: "[Show Full Text]";
  }

  #sf-file-url::after {
    content: "URL";
  }

  #sf-file-url.sf-loading::after {
    content: "Loading...";
  }

  #sharty-hover {
    pointer-events: none;
    position: fixed;
    z-index: 500;
  }

  .catty-thread, .showing-hidden .catty-thread.hidden {
    display: inline-block !important;
  }

  #toggle-hidden {
    text-decoration: underline;
    color: #34345C;
    cursor: pointer;
    user-select: none;
  }

  #toggle-hidden::before {
    content: "[Show Hidden]";
  }

  .showing-hidden #toggle-hidden::before {
    content: "[Hide Hidden]";
  }

  #image_size + #toggle-hidden {
    display: inline-block;
    padding-left: 5px;
  }

  header + #toggle-hidden {
    display: block;
    margin: 1em auto;
    width: fit-content;
  }

  .mobile-style .g-recaptcha-bubble-arrow + div {
    position: fixed !important;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
  }

  input[name=toggle-password] {
    margin-left: 2px;
  }

  .sf-formatting-help {
    text-decoration: underline;
    cursor: pointer;
  }

  .comment-quotes {
    text-align: center;
  }
${isEnabled("sageicon") ? `
  a[href^='mailto:sage']::after {
  content: ' SAGE!';
  text-decoration: none;
  display: none;
}` : ""}

${isEnabled("classic") ? `
.intro span.name {
  color: #117743;
  font-weight: bold;
}

.intro span.trip {
  color: #228854;
 font-weight: normal;
}` : ""}



${isEnabled("partysover") ? `
    img[src*="https://s.kncdn.org/image/hat2.gif"] {
       display: none;
    }` : ""}

${isEnabled("bannerhide") ? `
    img[src*="https://soyjak.party/static/banner/"] {
       display: none;
    }` : ""}

${isEnabled("gemcursor") ? `
.pointer         { cursor: pointer; }

body{
cursor: url(https://soyjak.download/f.php?h=3lw8JxqV&p=1), auto;

    }


a{
cursor: url(https://soyjak.download/f.php?h=0g5R7FrI&p=1), auto;
}` : ""}




  ${isEnabled("truncate-long-posts") ? `
  .sf-cutoff:not(.post-hover) .body {
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    min-width: min-content;
    -webkit-line-clamp: 20;
    -webkit-box-orient: vertical;
  }

  .sf-cutoff.post-hover .sf-expander {
    display: none !important;
  }

  div.post.reply.sf-cutoff div.body {
    margin-bottom: 0.3em;
    padding-bottom: unset;
  }` : ""};
</style>
`);

if (isEnabled("annhide")) {
document.body.classList.add("hidden-blotter");
}

/*
 * post-menu.js - adds dropdown menu to posts
 *
 * Creates a global Menu object with four public methods:
 *
 *   Menu.onclick(fnc)
 *     registers a function to be executed after button click, before the menu is displayed
 *   Menu.add_item(id, text[, title])
 *     adds an item to the top level of menu
 *   Menu.add_submenu(id, text)
 *     creates and returns a List object through which to manipulate the content of the submenu
 *   Menu.get_submenu(id)
 *     returns the submenu with the specified id from the top level menu
 *
 *   The List object contains all the methods from Menu except onclick()
 *
 *   Example usage:
 *     Menu.add_item('filter-menu-hide', 'Hide post');
 *     Menu.add_item('filter-menu-unhide', 'Unhide post');
 *
 *     submenu = Menu.add_submenu('filter-menu-add', 'Add filter');
 *         submenu.add_item('filter-add-post-plus', 'Post +', 'Hide post and all replies');
 *         submenu.add_item('filter-add-id', 'ID');
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/post-menu.js';
 */
$(document).ready(function () {

var List = function (menuId, text) {
	this.id = menuId;
	this.text = text;
	this.items = [];

	this.add_item = function (itemId, text, title) {
		this.items.push(new Item(itemId, text, title));
	};
	this.list_items = function () {
		var array = [];
		var i, length, obj, $ele;

		if ($.isEmptyObject(this.items))
			return;

		length = this.items.length;
		for (i = 0; i < length; i++) {
			obj = this.items[i];

			$ele = $('<li>', {id: obj.id}).text(obj.text);
			if ('title' in obj) $ele.attr('title', obj.title);

			if (obj instanceof Item) {
				$ele.addClass('post-item');
			} else {
				$ele.addClass('post-submenu');

				$ele.prepend(obj.list_items());
				$ele.append($('<span>', {class: 'post-menu-arrow'}).text('»'));
			}

			array.push($ele);
		}

		return $('<ul>').append(array);
	};
	this.add_submenu = function (menuId, text) {
		var ele = new List(menuId, text);
		this.items.push(ele);
		return ele;
	};
	this.get_submenu = function (menuId) {
		for (var i = 0; i < this.items.length; i++) {
			if ((this.items[i] instanceof Item) || this.items[i].id != menuId) continue;
			return this.items[i];
		}
	};
};

var Item = function (itemId, text, title) {
	this.id = itemId;
	this.text = text;

	// optional
	if (typeof title != 'undefined') this.title = title;
};

function buildMenu(e) {
	var pos = $(e.target).offset();
	var i, length;

	var $menu = $('<div class="post-menu"></div>').append(mainMenu.list_items());

	//  execute registered click handlers
	length = onclick_callbacks.length;
	for (i = 0; i < length; i++) {
		onclick_callbacks[i](e, $menu);
	}

	//  set menu position and append to page
	 $menu.css({top: pos.top, left: pos.left + 20});
	 $('body').append($menu);
}

function addButton(post) {
	var $ele = $(post);
	$ele.find('input.delete').after(
		$('<a>', {href: '#', class: 'post-btn', title: 'Post menu'}).text('▶')
	);
}


/* * * * * * * * * *
    Public methods
 * * * * * * * * * */
var Menu = {};
var mainMenu = new List();
var onclick_callbacks = [];

Menu.onclick = function (fnc) {
	onclick_callbacks.push(fnc);
};

Menu.add_item = function (itemId, text, title) {
	mainMenu.add_item(itemId, text, title);
};

Menu.add_submenu = function (menuId, text) {
	return mainMenu.add_submenu(menuId, text);
};

Menu.get_submenu = function (id) {
	return mainMenu.get_submenu(id);
};

window.Menu = Menu;


/* * * * * * * *
    Initialize
 * * * * * * * */

/*  Styling
 */
var $ele, cssStyle, cssString;

$ele = $('<div>').addClass('post reply').hide().appendTo('body');
cssStyle = $ele.css(['border-top-color']);
cssStyle.hoverBg = $('body').css('background-color');
$ele.remove();

cssString =
	'\n/*** Generated by post-menu ***/\n' +
	'.post-menu {position: absolute; font-size: 12px; line-height: 1.3em;}\n' +
	'.post-menu ul {\n' +
	'    background-color: '+ cssStyle['border-top-color'] +'; border: 1px solid #666;\n' +
	'    list-style: none; padding: 0; margin: 0; white-space: nowrap;\n}\n' +
	'.post-menu .post-submenu{white-space: normal; width: 90px;}' +
	'.post-menu .post-submenu>ul{white-space: nowrap; width: auto;}' +
	'.post-menu li {cursor: pointer; position: relative; padding: 4px 4px; vertical-align: middle;}\n' +
	'.post-menu li:hover {background-color: '+ cssStyle.hoverBg +';}\n' +
	'.post-menu ul ul {display: none; position: absolute;}\n' +
	'.post-menu li:hover>ul {display: block; left: 100%; margin-top: -3px;}\n' +
	'.post-menu-arrow {float: right; margin-left: 10px;}\n' +
	'.post-menu.hidden, .post-menu .hidden {display: none;}\n' +
	'.post-btn {transition: transform 0.1s; width: 15px; text-align: center; font-size: 10pt; opacity: 0.8; text-decoration: none; margin: -6px 0px 0px -5px !important; display: inline-block;}\n' +
	'.post-btn:hover {opacity: 1;}\n' +
	'.post-btn-open {transform: rotate(90deg);}\n';

if (!$('style.generated-css').length) $('<style class="generated-css">').appendTo('head');
$('style.generated-css').html($('style.generated-css').html() + cssString);

/*  Add buttons
 */
$('.reply:not(.hidden), .thread>.op').each(function () {
	addButton(this);
 });

 /*  event handlers
  */
$('form[name=postcontrols]').on('click', '.post-btn', function (e) {
	e.preventDefault();
	var post = e.target.parentElement.parentElement;
	$('.post-menu').remove();

	if ($(e.target).hasClass('post-btn-open')) {
		$('.post-btn-open').removeClass('post-btn-open');
	} else {
		//  close previous button
		$('.post-btn-open').removeClass('post-btn-open');
		$(post).find('.post-btn').addClass('post-btn-open');

		buildMenu(e);
	}
});

$(document).on('click', function (e){
	if ($(e.target).hasClass('post-btn') || $(e.target).hasClass('post-submenu'))
		return;

	$('.post-menu').remove();
	$('.post-btn-open').removeClass('post-btn-open');
});

// on new posts
$(document).on('new_post', function (e, post) {
	addButton(post);
});

$(document).trigger('menu_ready');
});


// Post Filters
if (active_page === 'thread' || active_page === 'index' || active_page === 'catalog' || active_page === 'ukko') {
	$(document).on('menu_ready', function () {
		'use strict';

		// returns blacklist object from storage
		function getList() {
			return JSON.parse(localStorage.postFilter);
		}

		// stores blacklist into storage and reruns the filter
		function setList(blacklist) {
			localStorage.postFilter = JSON.stringify(blacklist);
			$(document).trigger('filter_page');
		}

		// unit: seconds
		function timestamp() {
			return Math.floor((new Date()).getTime() / 1000);
		}

		function initList(list, boardId, threadId) {
			if (typeof list.postFilter[boardId] == 'undefined') {
				list.postFilter[boardId] = {};
				list.nextPurge[boardId] = {};
			}
			if (typeof list.postFilter[boardId][threadId] == 'undefined') {
				list.postFilter[boardId][threadId] = [];
			}
			list.nextPurge[boardId][threadId] = {timestamp: timestamp(), interval: 86400};  // 86400 seconds == 1 day
		}

		function addFilter(type, value, useRegex) {
			var list = getList();
			var filter = list.generalFilter;
			var obj = {
				type: type,
				value: value,
				regex: useRegex
			};

			for (var i=0; i<filter.length; i++) {
				if (filter[i].type == type && filter[i].value == value && filter[i].regex == useRegex)
					return;
			}

			filter.push(obj);
			setList(list);
			drawFilterList();
		}

		function removeFilter(type, value, useRegex) {
			var list = getList();
			var filter = list.generalFilter;

			for (var i=0; i<filter.length; i++) {
				if (filter[i].type == type && filter[i].value == value && filter[i].regex == useRegex) {
					filter.splice(i, 1);
					break;
				}
			}

			setList(list);
			drawFilterList();
		}

		function nameSpanToString(el) {
			var s = '';

			$.each($(el).contents(), function(k,v) {
				if (v.nodeName === 'IMG')
					s=s+$(v).attr('alt')

				if (v.nodeName === '#text')
					s=s+v.nodeValue
			});
			return s.trim();
		}

		var blacklist = {
			add: {
				post: function (boardId, threadId, postId, hideReplies) {
					var list = getList();
					var filter = list.postFilter;

					initList(list, boardId, threadId);

					for (var i in filter[boardId][threadId]) {
						if (filter[boardId][threadId][i].post == postId) return;
					}
					filter[boardId][threadId].push({
						post: postId,
						hideReplies: hideReplies
					});
					setList(list);
				},
				uid: function (boardId, threadId, uniqueId, hideReplies) {
					var list = getList();
					var filter = list.postFilter;

					initList(list, boardId, threadId);

					for (var i in filter[boardId][threadId]) {
						if (filter[boardId][threadId][i].uid == uniqueId) return;
					}
					filter[boardId][threadId].push({
						uid: uniqueId,
						hideReplies: hideReplies
					});
					setList(list);
				}
			},
			remove: {
				post: function (boardId, threadId, postId) {
					var list = getList();
					var filter = list.postFilter;

					// thread already pruned
					if (typeof filter[boardId] == 'undefined' || typeof filter[boardId][threadId] == 'undefined')
						return;

					for (var i=0; i<filter[boardId][threadId].length; i++) {
						if (filter[boardId][threadId][i].post == postId) {
							filter[boardId][threadId].splice(i, 1);
							break;
						}
					}

					if ($.isEmptyObject(filter[boardId][threadId])) {
						delete filter[boardId][threadId];
						delete list.nextPurge[boardId][threadId];

						if ($.isEmptyObject(filter[boardId])) {
							delete filter[boardId];
							delete list.nextPurge[boardId];
						}
					}
					setList(list);
				},
				uid: function (boardId, threadId, uniqueId) {
					var list = getList();
					var filter = list.postFilter;

					// thread already pruned
					if (typeof filter[boardId] == 'undefined' || typeof filter[boardId][threadId] == 'undefined')
						return;

					for (var i=0; i<filter[boardId][threadId].length; i++) {
						if (filter[boardId][threadId][i].uid == uniqueId) {
							filter[boardId][threadId].splice(i, 1);
							break;
						}
					}

					if ($.isEmptyObject(filter[boardId][threadId])) {
						delete filter[boardId][threadId];
						delete list.nextPurge[boardId][threadId];

						if ($.isEmptyObject(filter[boardId])) {
							delete filter[boardId];
							delete list.nextPurge[boardId];
						}
					}
					setList(list);
				}
			}
		};

		/*
		 *  hide/show the specified thread/post
		 */
		function hide(ele) {
			var $ele = $(ele);

			if ($(ele).data('hidden'))
				return;

			$(ele).data('hidden', true);
			if ($ele.hasClass('op')) {
				$ele.parent().find('.body, .files, .video-container').not($ele.children('.reply').children()).hide();

				// hide thread replies on index view
				if (active_page == 'index' || active_page == 'ukko') $ele.parent().find('.omitted, .reply:not(.hidden), post_no, .mentioned, br').hide();
			} else {
				// normal posts
				$ele.children('.body, .files, .video-container').hide();
			}
		}
		function show(ele) {
			var $ele = $(ele);

			$(ele).data('hidden', false);
			if ($ele.hasClass('op')) {
				$ele.parent().find('.body, .files, .video-container').show();
				if (active_page == 'index') $ele.parent().find('.omitted, .reply:not(.hidden), post_no, .mentioned, br').show();
			} else {
				// normal posts
				$ele.children('.body, .files, .video-container').show();
			}
		}

		/*
		 *  create filter menu when the button is clicked
		 */
		function initPostMenu(pageData) {
			var Menu = window.Menu;
			var submenu;
			Menu.add_item('filter-menu-hide', _('Hide post'));
			Menu.add_item('filter-menu-unhide', _('Unhide post'));

			submenu = Menu.add_submenu('filter-menu-add', _('Add filter'));
				submenu.add_item('filter-add-post-plus', _('Post +'), _('Hide post and all replies'));
				submenu.add_item('filter-add-id', _('ID'));
				submenu.add_item('filter-add-id-plus', _('ID +'), _('Hide ID and all replies'));
				submenu.add_item('filter-add-name', _('Name'));
				submenu.add_item('filter-add-trip', _('Tripcode'));

			submenu = Menu.add_submenu('filter-menu-remove', _('Remove filter'));
				submenu.add_item('filter-remove-id', _('ID'));
				submenu.add_item('filter-remove-name', _('Name'));
				submenu.add_item('filter-remove-trip', _('Tripcode'));

			Menu.onclick(function (e, $buffer) {
				var ele = e.target.parentElement.parentElement;
				var $ele = $(ele);

				var threadId = $ele.parent().attr('id').replace('thread_', '');
				var boardId = $ele.parent().data('board');
				var postId = $ele.find('.post_no').not('[id]').text();
				if (pageData.hasUID) {
					var postUid = $ele.find('.poster_id').text();
				}

				var postName;
				var postTrip = '';
				if (!pageData.forcedAnon) {
					postName = (typeof $ele.find('.name').contents()[0] == 'undefined') ? '' : nameSpanToString($ele.find('.name')[0]);
					postTrip = $ele.find('.trip').text();
				}

				/*  display logic and bind click handlers
				 */

				 // unhide button
				if ($ele.data('hidden')) {
					$buffer.find('#filter-menu-unhide').click(function () {
						//  if hidden due to post id, remove it from blacklist
						//  otherwise just show this post
						blacklist.remove.post(boardId, threadId, postId);
						show(ele);
					});
					$buffer.find('#filter-menu-hide').addClass('hidden');
				} else {
					$buffer.find('#filter-menu-unhide').addClass('hidden');
					$buffer.find('#filter-menu-hide').click(function () {
						blacklist.add.post(boardId, threadId, postId, false);
					});
				}

				//  post id
				if (!$ele.data('hiddenByPost')) {
					$buffer.find('#filter-add-post-plus').click(function () {
						blacklist.add.post(boardId, threadId, postId, true);
					});
				} else {
					$buffer.find('#filter-add-post-plus').addClass('hidden');
				}

				// UID
				if (pageData.hasUID && !$ele.data('hiddenByUid')) {
					$buffer.find('#filter-add-id').click(function () {
						blacklist.add.uid(boardId, threadId, postUid, false);
					});
					$buffer.find('#filter-add-id-plus').click(function () {
						blacklist.add.uid(boardId, threadId, postUid, true);
					});

					$buffer.find('#filter-remove-id').addClass('hidden');
				} else if (pageData.hasUID) {
					$buffer.find('#filter-remove-id').click(function () {
						blacklist.remove.uid(boardId, threadId, postUid);
					});

					$buffer.find('#filter-add-id').addClass('hidden');
					$buffer.find('#filter-add-id-plus').addClass('hidden');
				} else {
					// board doesn't use UID
					$buffer.find('#filter-add-id').addClass('hidden');
					$buffer.find('#filter-add-id-plus').addClass('hidden');
					$buffer.find('#filter-remove-id').addClass('hidden');
				}

				//  name
				if (!pageData.forcedAnon && !$ele.data('hiddenByName')) {
					$buffer.find('#filter-add-name').click(function () {
						addFilter('name', postName, false);
					});

					$buffer.find('#filter-remove-name').addClass('hidden');
				} else if (!pageData.forcedAnon) {
					$buffer.find('#filter-remove-name').click(function () {
						removeFilter('name', postName, false);
					});

					$buffer.find('#filter-add-name').addClass('hidden');
				} else {
					// board has forced anon
					$buffer.find('#filter-remove-name').addClass('hidden');
					$buffer.find('#filter-add-name').addClass('hidden');
				}

				//  tripcode
				if (!pageData.forcedAnon && !$ele.data('hiddenByTrip') && postTrip !== '') {
					$buffer.find('#filter-add-trip').click(function () {
						addFilter('trip', postTrip, false);
					});

					$buffer.find('#filter-remove-trip').addClass('hidden');
				} else if (!pageData.forcedAnon && postTrip !== '') {
					$buffer.find('#filter-remove-trip').click(function () {
						removeFilter('trip', postTrip, false);
					});

					$buffer.find('#filter-add-trip').addClass('hidden');
				} else {
					// board has forced anon
					$buffer.find('#filter-remove-trip').addClass('hidden');
					$buffer.find('#filter-add-trip').addClass('hidden');
				}

				/*  hide sub menus if all items are hidden
				 */
				if (!$buffer.find('#filter-menu-remove > ul').children().not('.hidden').length) {
					$buffer.find('#filter-menu-remove').addClass('hidden');
				}
				if (!$buffer.find('#filter-menu-add > ul').children().not('.hidden').length) {
					$buffer.find('#filter-menu-add').addClass('hidden');
				}
			});
		}

		/*
		 *  hide/unhide thread on index view
		 */
		function quickToggle(ele, threadId, pageData) {
			/*if ($(ele).find('.hide-thread-link').length)
				$('.hide-thread-link').remove();*/

			if ($(ele).hasClass('op') && !$(ele).find('.hide-thread-link').length) {
				$('<a class="hide-thread-link" style="float:left;margin-right:5px" href="javascript:void(0)">[' + ($(ele).data('hidden') ? '+' : '–') + ']</a>')
					.insertBefore($(ele).find(':not(h2,h2 *):first'))
					.click(function() {
						var postId = $(ele).find('.post_no').not('[id]').text();
						var hidden = $(ele).data('hidden');
						var boardId = $(ele).parents('.thread').data('board');

						if (hidden) {
							blacklist.remove.post(boardId, threadId, postId, false);
							$(this).html('[–]');
						} else {
							blacklist.add.post(boardId, threadId, postId, false);
							$(this).text('[+]');
						}
					});
			}
		}

		/*
		 *  determine whether the reply post should be hidden
		 *   - applies to all posts on page load or filtering rule change
		 *   - apply to new posts on thread updates
		 *   - must explicitly set the state of each attributes because filter will reapply to all posts after filtering rule change
		 */
		function filter(post, threadId, pageData) {
			var $post = $(post);

			var list = getList();
			var postId = $post.find('.post_no').not('[id]').text();
			var name, trip, uid, subject, comment;
			var i, length, array, rule, pattern;  // temp variables

			var boardId	      = $post.data('board');
			if (!boardId) boardId = $post.parents('.thread').data('board');

			var localList   = pageData.localList;
			var noReplyList = pageData.noReplyList;
			var hasUID      = pageData.hasUID;
			var forcedAnon  = pageData.forcedAnon;

			var hasTrip = ($post.find('.trip').length > 0);
			var hasSub = ($post.find('.subject').length > 0);

			$post.data('hidden', false);
			$post.data('hiddenByUid', false);
			$post.data('hiddenByPost', false);
			$post.data('hiddenByName', false);
			$post.data('hiddenByTrip', false);
			$post.data('hiddenBySubject', false);
			$post.data('hiddenByComment', false);

			// add post with matched UID to localList
			if (hasUID &&
				typeof list.postFilter[boardId] != 'undefined' &&
				typeof list.postFilter[boardId][threadId] != 'undefined') {
				uid = $post.find('.poster_id').text();
				array = list.postFilter[boardId][threadId];

				for (i=0; i<array.length; i++) {
					if (array[i].uid == uid) {
						$post.data('hiddenByUid', true);
						localList.push(postId);
						if (array[i].hideReplies) noReplyList.push(postId);
						break;
					}
				}
			}

			// match localList
			if (localList.length) {
				if ($.inArray(postId, localList) != -1) {
					if ($post.data('hiddenByUid') !== true) $post.data('hiddenByPost', true);
					hide(post);
				}
			}

			// matches generalFilter
			if (!forcedAnon)
				name = (typeof $post.find('.name').contents()[0] == 'undefined') ? '' : nameSpanToString($post.find('.name')[0]);
			if (!forcedAnon && hasTrip)
				trip = $post.find('.trip').text();
			if (hasSub)
				subject = $post.find('.subject').text();

			array = $post.find('.body').contents().filter(function () {if ($(this).text() !== '') return true;}).toArray();
			array = $.map(array, function (ele) {
				return $(ele).text().trim();
			});
			comment = array.join(' ');


			for (i = 0, length = list.generalFilter.length; i < length; i++) {
				rule = list.generalFilter[i];

				if (rule.regex) {
					pattern = new RegExp(rule.value);
					switch (rule.type) {
						case 'name':
							if (!forcedAnon && pattern.test(name)) {
								$post.data('hiddenByName', true);
								hide(post);
							}
							break;
						case 'trip':
							if (!forcedAnon && hasTrip && pattern.test(trip)) {
								$post.data('hiddenByTrip', true);
								hide(post);
							}
							break;
						case 'sub':
							if (hasSub && pattern.test(subject)) {
								$post.data('hiddenBySubject', true);
								hide(post);
							}
							break;
						case 'com':
							if (pattern.test(comment)) {
								$post.data('hiddenByComment', true);
								hide(post);
							}
							break;
					}
				} else {
					switch (rule.type) {
						case 'name':
							if (!forcedAnon && rule.value == name) {
								$post.data('hiddenByName', true);
								hide(post);
							}
							break;
						case 'trip':
							if (!forcedAnon && hasTrip && rule.value == trip) {
								$post.data('hiddenByTrip', true);
								hide(post);
							}
							break;
						case 'sub':
							pattern = new RegExp('\\b'+ rule.value+ '\\b');
							if (hasSub && pattern.test(subject)) {
								$post.data('hiddenBySubject', true);
								hide(post);
							}
							break;
						case 'com':
							pattern = new RegExp('\\b'+ rule.value+ '\\b');
							if (pattern.test(comment)) {
								$post.data('hiddenByComment', true);
								hide(post);
							}
							break;
					}
				}
			}

			// check for link to filtered posts
			$post.find('.body a').not('[rel="nofollow"]').each(function () {
				var replyId = $(this).text().match(/^>>(\d+)$/);

				if (!replyId)
					return;

				replyId = replyId[1];
				if ($.inArray(replyId, noReplyList) != -1) {
					hide(post);
				}
			});

			// post didn't match any filters
			if (!$post.data('hidden')) {
				show(post);
			}
		}

		/*  (re)runs the filter on the entire page
		 */
		 function filterPage(pageData) {
			var list = getList();

			if (active_page != 'catalog') {

				// empty the local and no-reply list
				pageData.localList = [];
				pageData.noReplyList = [];

				$('.thread').each(function () {
					var $thread = $(this);
					// disregard the hidden threads constructed by post-hover.js
					if ($thread.css('display') == 'none')
						return;

					var threadId = $thread.attr('id').replace('thread_', '');
					var boardId = $thread.data('board');
					var op = $thread.children('.op')[0];
					var i, array;  // temp variables

					// add posts to localList and noReplyList
					if (typeof list.postFilter[boardId] != 'undefined' && typeof list.postFilter[boardId][threadId] != 'undefined') {
						array = list.postFilter[boardId][threadId];
						for (i=0; i<array.length; i++) {
							if ( typeof array[i].post == 'undefined')
								continue;

							pageData.localList.push(array[i].post);
							if (array[i].hideReplies) pageData.noReplyList.push(array[i].post);
						}
					}
					// run filter on OP
					filter(op, threadId, pageData);
					quickToggle(op, threadId, pageData);

					// iterate filter over each post
					if (!$(op).data('hidden') || active_page == 'thread') {
						$thread.find('.reply').not('.hidden').each(function () {
							filter(this, threadId, pageData);
						});
					}

				});
			} else {
				var postFilter = list.postFilter[pageData.boardId];
				var $collection = $('.mix');

				if ($.isEmptyObject(postFilter))
					return;

				// for each thread that has filtering rules
				// check if filter contains thread OP and remove the thread from catalog
				$.each(postFilter, function (key, thread) {
					var threadId = key;
					$.each(thread, function () {
						if (this.post == threadId) {
							$collection.filter('[data-id='+ threadId +']').remove();
						}
					});
				});
			}
		 }

		function initStyle() {
			var $ele, cssStyle, cssString;

			$ele = $('<div>').addClass('post reply').hide().appendTo('body');
			cssStyle = $ele.css(['background-color', 'border-color']);
			cssStyle.hoverBg = $('body').css('background-color');
			$ele.remove();

			cssString = '\n/*** Generated by post-filter ***/\n' +
				'#filter-control input[type=text] {width: 130px;}' +
				'#filter-control input[type=checkbox] {vertical-align: middle;}' +
				'#filter-control #clear {float: right;}\n' +
				'#filter-container {margin-top: 20px; border: 1px solid; height: 270px; overflow: auto;}\n' +
				'#filter-list {width: 100%; border-collapse: collapse;}\n' +
				'#filter-list th {text-align: center; height: 20px; font-size: 14px; border-bottom: 1px solid;}\n' +
				'#filter-list th:nth-child(1) {text-align: center; width: 70px;}\n' +
				'#filter-list th:nth-child(2) {text-align: left;}\n' +
				'#filter-list th:nth-child(3) {text-align: center; width: 58px;}\n' +
				'#filter-list tr:not(#header) {height: 22px;}\n' +
				'#filter-list tr:nth-child(even) {background-color:rgba(255, 255, 255, 0.5);}\n' +
				'#filter-list td:nth-child(1) {text-align: center; width: 70px;}\n' +
				'#filter-list td:nth-child(3) {text-align: center; width: 58px;}\n' +
				'#confirm {text-align: right; margin-bottom: -18px; padding-top: 2px; font-size: 14px; color: #FF0000;}';

			if (!$('style.generated-css').length) $('<style class="generated-css">').appendTo('head');
			$('style.generated-css').html($('style.generated-css').html() + cssString);
		}

		function drawFilterList() {
			var list = getList().generalFilter;
			var $ele = $('#filter-list');
			var $row, i, length, obj, val;

			var typeName = {
				name: 'name',
				trip: 'tripcode',
				sub: 'subject',
				com: 'comment'
			};

			$ele.empty();

			$ele.append('<tr id="header"><th>Type</th><th>Content</th><th>Remove</th></tr>');
			for (i = 0, length = list.length; i < length; i++) {
				obj = list[i];

				// display formatting
				val = (obj.regex) ? '/'+ obj.value +'/' : obj.value;

				$row = $('<tr>');
				$row.append(
					'<td>'+ typeName[obj.type] +'</td>',
					'<td>'+ val +'</td>',
					$('<td>').append(
						$('<a>').html('X')
							.addClass('del-btn')
							.attr('href', '#')
							.data('type', obj.type)
							.data('val', obj.value)
							.data('useRegex', obj.regex)
					)
				);
				$ele.append($row);
			}
		}

		function initOptionsPanel() {
			if (window.Options && !Options.get_tab('filter')) {
				Options.add_tab('filter', 'list', _('Filters'));
				Options.extend_tab('filter',
					'<div id="filter-control">' +
						'<select>' +
							'<option value="name">'+_('Name')+'</option>' +
							'<option value="trip">'+_('Tripcode')+'</option>' +
							'<option value="sub">'+_('Subject')+'</option>' +
							'<option value="com">'+_('Comment')+'</option>' +
						'</select>' +
						'<input type="text">' +
						'<input type="checkbox">' +
						'regex ' +
						'<button id="set-filter">'+_('Add')+'</button>' +
						'<button id="clear">'+_('Clear all filters')+'</button>' +
						'<div id="confirm" class="hidden">' +
							_('This will clear all filtering rules including hidden posts.')+' <a id="confirm-y" href="#">'+_('yes')+'</a> | <a id="confirm-n" href="#">'+_('no')+'</a>' +
						'</div>' +
					'</div>' +
					'<div id="filter-container"><table id="filter-list"></table></div>'
				);
				drawFilterList();

				// control buttons
				$('#filter-control').on('click', '#set-filter', function () {
					var type = $('#filter-control select option:selected').val();
					var value = $('#filter-control input[type=text]').val();
					var useRegex = $('#filter-control input[type=checkbox]').prop('checked');

					//clear the input form
					$('#filter-control input[type=text]').val('');

					addFilter(type, value, useRegex);
					drawFilterList();
				});
				$('#filter-control').on('click', '#clear', function () {
					$('#filter-control #clear').addClass('hidden');
					$('#filter-control #confirm').removeClass('hidden');
				});
				$('#filter-control').on('click', '#confirm-y', function (e) {
					e.preventDefault();

					$('#filter-control #clear').removeClass('hidden');
					$('#filter-control #confirm').addClass('hidden');
					setList({
						generalFilter: [],
						postFilter: {},
						nextPurge: {},
						lastPurge: timestamp()
					});
					drawFilterList();
				});
				$('#filter-control').on('click', '#confirm-n', function (e) {
					e.preventDefault();

					$('#filter-control #clear').removeClass('hidden');
					$('#filter-control #confirm').addClass('hidden');
				});


				// remove button
				$('#filter-list').on('click', '.del-btn', function (e) {
					e.preventDefault();

					var $ele = $(e.target);
					var type = $ele.data('type');
					var val = $ele.data('val');
					var useRegex = $ele.data('useRegex');

					removeFilter(type, val, useRegex);
				});
			}
		}

		/*
		 *  clear out pruned threads
		 */
		function purge() {
			var list = getList();
			var board, thread, boardId, threadId;
			var deferred;
			var requestArray = [];

			var successHandler = function (boardId, threadId) {
				return function () {
					// thread still alive, keep it in the list and increase the time between checks.
					var list = getList();
					var thread = list.nextPurge[boardId][threadId];

					thread.timestamp = timestamp();
					thread.interval = Math.floor(thread.interval * 1.5);
					setList(list);
				};
			};
			var errorHandler = function (boardId, threadId) {
				return function (xhr) {
					if (xhr.status == 404) {
						var list = getList();

						delete list.nextPurge[boardId][threadId];
						delete list.postFilter[boardId][threadId];
						if ($.isEmptyObject(list.nextPurge[boardId])) delete list.nextPurge[boardId];
						if ($.isEmptyObject(list.postFilter[boardId])) delete list.postFilter[boardId];
						setList(list);
					}
				};
			};

			if ((timestamp() - list.lastPurge) < 86400)  // less than 1 day
				return;

			for (boardId in list.nextPurge) {
				board = list.nextPurge[boardId];
				for (threadId in board) {
					thread = board[threadId];
					if (timestamp() > (thread.timestamp + thread.interval)) {
						// check if thread is pruned
						deferred = $.ajax({
							cache: false,
							url: '/'+ boardId +'/res/'+ threadId +'.json',
							success: successHandler(boardId, threadId),
							error: errorHandler(boardId, threadId)
						});
						requestArray.push(deferred);
					}
				}
			}

			// when all requests complete
			$.when.apply($, requestArray).always(function () {
				var list = getList();
				list.lastPurge = timestamp();
				setList(list);
			});
		}

		function init() {
			if (typeof localStorage.postFilter === 'undefined') {
				localStorage.postFilter = JSON.stringify({
					generalFilter: [],
					postFilter: {},
					nextPurge: {},
					lastPurge: timestamp()
				});
			}

			var pageData = {
				boardId: board_name,  // get the id from the global variable
				localList: [],  // all the blacklisted post IDs or UIDs that apply to the current page
				noReplyList: [],  // any posts that replies to the contents of this list shall be hidden
				hasUID: (document.getElementsByClassName('poster_id').length > 0),
				forcedAnon: ($('th:contains(Name)').length === 0)  // tests by looking for the Name label on the reply form
			};

			initStyle();
			initOptionsPanel();
			initPostMenu(pageData);
			filterPage(pageData);

			// on new posts
			$(document).on('new_post', function (e, post) {
				var threadId;

				if ($(post).hasClass('reply')) {
					threadId = $(post).parents('.thread').attr('id').replace('thread_', '');
				} else {
					threadId = $(post).attr('id').replace('thread_', '');
					post = $(post).children('.op')[0];
				}

				filter(post, threadId, pageData);
				quickToggle(post, threadId, pageData);
			});

			$(document).on('filter_page', function () {
				filterPage(pageData);
			});

			// shift+click on catalog to hide thread
			if (active_page == 'catalog') {
				$(document).on('click', '.mix', function(e) {
					if (e.shiftKey) {
						var threadId = $(this).data('id').toString();
						var postId = threadId;
						blacklist.add.post(pageData.boardId, threadId, postId, false);
					}
				});
			}

			// clear out the old threads
			purge();
		}
		init();
	});

	if (typeof window.Menu !== "undefined") {
		$(document).trigger('menu_ready');
	}
}


initFixes();

