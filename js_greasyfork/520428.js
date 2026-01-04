// ==UserScript==
// @name        Sharty Fixes 2025
// @namespace   soyjak.party
// @match       https://soyjak.party/*
// @match       https://soyjak.st/*
// @version     1.152
// @author      Xyl (Currently Maintained by Swedewin)
// @license     MIT
// @description Fixes/Enhancements for the 'party
// @downloadURL https://update.greasyfork.org/scripts/520428/Sharty%20Fixes%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/520428/Sharty%20Fixes%202025.meta.js
// ==/UserScript==

const version = "v1.152";
console.log(`Sharty fixes ${version}`);

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

const optionsEntries = {
  "show-quote-button": ["checkbox", "Show quick quote button", false],
  "mass-reply-quote": ["checkbox", "Enable mass reply and mass quote buttons", true],
  "anonymise": ["checkbox", "Anonymise name and tripfags", false],
  "hide-blotter": ["checkbox", "Always hide blotter", false],
  "truncate-long-posts": ["checkbox", "Truncate line spam", true],
  "disable-submit-on-cooldown": ["checkbox", "Disable submit button on cooldown", false],
  "force-exact-time": ["checkbox", "Show exact time", false],
  "hide-sage-images": ["checkbox", "Hide sage images by default (help mitigate gross spam)", false],
  "catalog-navigation": ["checkbox", "Board list links to catalogs when on catalog", true]
}
let options = Options.add_tab("sharty-fixes", "gear", "Sharty Fixes").content[0];
let optionsHTML = `<span style="display: block; text-align: center">${version}</span>`;
optionsHTML += `<a style="display: block; text-align: center" href="https://booru.soyjak.st/post/list/variant%3Aimpish_soyak_ears/">#Impishgang</a><br>`;
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

// redirect (for some reason breaks hidden threads if removed)
if (location.origin.match(/(http:|\/www)/g)) {
  location.replace(`https://soyjak.party${location.pathname}${location.hash}`);
}

const board = window.location.pathname.split("/")[1];

// post fixes
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Update observer for active thread
if (document.body.classList.contains("active-thread")) {
  const updateObserver = new MutationObserver(list => {
    const evt = new CustomEvent("post_update", { detail: list });
    document.dispatchEvent(evt);
  });
  updateObserver.observe(document.querySelector(".thread"), { childList: true });
}

let intervals = {};

// Fix individual post
function fixPost(post) {
  let timeElement = post.querySelector("[datetime]");
  let time = new Date(Date.parse(timeElement.getAttribute("datetime")));
  let postNumber = post.getElementsByClassName("post_no")[1];
  let postText = postNumber.textContent;

  // Hide images for sage posts
  if (email = post.querySelector("a.email")) {
    if (isEnabled("hide-sage-images") && !post.classList.contains("image-hide-processed") && email.href.match(/mailto:sage$/i)) {
      let localStorageBackup = localStorage.getItem("hiddenimages");
      let interval = setInterval(() => {
        if (document.querySelector(`[id*="${postText}"] .hide-image-link`)) {
          post.classList.add("image-hide-processed");
          clearInterval(interval);
          document.querySelector(`[id*="${postText}"] .files`)
            .querySelectorAll(".hide-image-link:not([style*='none'])")
            .forEach(e => e.click());
          localStorage.setItem("hiddenimages", localStorageBackup);
        }
      }, 50);
    }
  }

  // Check if post is own post
  let isOwnPost = false;
  try {
    isOwnPost = JSON.parse(localStorage.getItem("own_posts"))[board].includes(post.querySelector(".post_no[onclick*=cite]").innerText);
  } catch { }

  if (isOwnPost && getNumber("lastTime") < time.getTime()) {
    setValue("lastTime", time.getTime());
  }

  // Format time
  timeElement.outerHTML = `<span datetime=${timeElement.getAttribute("datetime")}>${timeElement.innerText}</span>`;
  post.querySelector(".intro").insertAdjacentHTML("beforeend", `<span class="quote-buttons"></span>`);

  // Add quote buttons if enabled
  if (isEnabled("show-quote-button")) {
    post.querySelector(".quote-buttons").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" class="quick-quote">[>]</a>`);
    post.querySelector(".quote-buttons").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" class="quick-orange">[<]</a>`);
  }

  // Mass reply/quote options for OP posts
  if (isEnabled("mass-reply-quote") && post.classList.contains("op") && post.closest(".active-thread")) {
    document.querySelector(".quote-buttons").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" id="mass-reply">[Mass Reply]</a><a href="javascript:void(0);" id="mass-quote">[Mass Quote]</a><a href="javascript:void(0);" id="mass-orange">[Mass Orange]</a>`);
  }

  // Handle post text formatting
  let body = post.querySelector(".body");
  body.childNodes.forEach(e => {
    if (e.nodeType === 3) {
      let span = document.createElement("span");
      span.innerText = e.textContent;
      e.parentNode.replaceChild(span, e);
    }
  });

  // Format post number and add click event for citations
  if (document.body.classList.contains("active-thread")) {
    postNumber.href = `#q${postNumber.textContent}`;
    postNumber.setAttribute("onclick", `$(window).trigger('cite', [${postNumber.textContent}, null]);`);
    postNumber.addEventListener("click", () => {
      let selection = window.getSelection().toString();
      document.querySelectorAll("textarea[name=body]").forEach(e => {
        e.value += `>>${postNumber.textContent}\n${selection !== "" ? selection.replace(/(\r\n|\r|\n|^)/g, "$1>") : ""}`;
      });
    });
  }

  // Anonymize post if enabled
  if (isEnabled("anonymise")) {
    post.querySelector(".name").textContent = "Chud";
    if (trip = post.querySelector(".trip")) {
      trip.remove();
    }
  }

  // DO NOT REMOVE THIS, IT WILL BREAK THE SCRIPT.
  undoFilter(post);
}

// Add expandos for truncating long posts
function addExpandos() {
  if (isEnabled("truncate-long-posts")) {
    document.querySelectorAll(".post").forEach(e => {
      let body = e.querySelector(".body");
      e.classList.add("sf-cutoff");

      if (body.scrollHeight > body.offsetHeight) {
        if (!e.querySelector(".sf-expander")) {
          body.insertAdjacentHTML("afterend", `<br><a href="javascript:void(0)" class="sf-expander"></a>`);
        }
        if (e.getAttribute("manual-cutoff") === "false" || (window.location.hash.includes(e.id.split("_")[1]) && !e.getAttribute("manual-cutoff"))) {
          e.classList.remove("sf-cutoff");
        }
      } else if (body.scrollHeight === body.offsetHeight) {
        if (expander = e.querySelector(".sf-expander")) {
          expander.remove();
        }
        e.classList.remove("sf-cutoff");
      }
    });
  }
}

window.addEventListener("resize", () => addExpandos());

// Function to modify the report form (File label, Urgent label, and Reason box)
function modifyReportForm(form) {
    // Skip modification if the form has already been modified
    if (form.dataset.modified === 'true') return;

    // Modify the "File" label and checkbox
    const fileLabel = form.querySelector('label[for^="delete_file_"]');
    if (fileLabel) {
        fileLabel.textContent = '[ File only ]';  // Modify the label text
        const fileCheckbox = form.querySelector('input[type="checkbox"][name="file"]');
        if (fileCheckbox) {
            // Move the checkbox inside the label
            fileLabel.insertBefore(fileCheckbox, fileLabel.firstChild);
        }
    }

    // Modify the "Urgent report" label and checkbox
    const urgentCheckbox = form.querySelector('#urgent-checkbox');
    if (urgentCheckbox) {
        const urgentLabel = form.querySelector('label[for="urgent-checkbox"]');
        if (urgentLabel) {
            urgentLabel.textContent = 'Urgent';  // Modify the label text
            // Move the checkbox inside the label
            urgentLabel.parentNode.insertBefore(urgentCheckbox, urgentLabel);
        }
    }

    // Set Reason input width equal to Password input width
    const passwordInput = form.querySelector('input[type="password"][name="password"]');
    const reasonInput = form.querySelector('input[type="text"][name="reason"]');
    if (passwordInput && reasonInput) {
        // Set the Reason input size equal to Password input's size
        reasonInput.setAttribute('size', passwordInput.getAttribute('size'));
    }

    // Mark the form as modified using a dataset attribute to prevent re-modification
    form.dataset.modified = 'true';
}

// Function to observe changes to the page (to handle dynamic form rendering)
function observeFormChanges() {
    // Find all forms on the page that are for reporting
    const forms = document.querySelectorAll('form.post-actions');

    forms.forEach(form => {
        modifyReportForm(form);  // Apply modification to the form
    });
}

// Initial run when the page loads
window.addEventListener('load', function() {
    // Apply changes to any forms already present on the page
    observeFormChanges();

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check for changes to form elements
                observeFormChanges();
            }
        }
    });

    // Observe the body of the page for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Listen for any changes to checkboxes to ensure modifications are reapplied dynamically
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('delete')) {
        // When the checkbox is clicked, check for changes in the form
        const form = event.target.closest('form.post-actions');
        if (form) {
            modifyReportForm(form);
        }
    }
});

// Custom CSS for .deadlink class
const style = `<style>
.deadlink {
  text-decoration: line-through !important;
  color: #789922;
}
</style>`;
document.head.innerHTML += style;

// Modify quote links to be styled as dead links
const quote = document.querySelectorAll('.quote');

quote.forEach(elem => {
  if (/^&gt;&gt;[1-9]+[0-9]*$/.test(elem.innerHTML)) {
    const postNum = elem.innerHTML;
    elem.outerHTML = `<span class="deadlink">${postNum}</span>`;
  }
});

// Fix post times (relative and exact)
function fixTime() {
  document.querySelectorAll(".post").forEach(e => {
    let timeElement = e.querySelector("[datetime]");
    let time = new Date(Date.parse(timeElement.getAttribute("datetime")));
    let exactTime = `${("0" + (time.getMonth() + 1)).slice(-2)}/${("0" + time.getDate()).slice(-2)}/${time.getYear().toString().slice(-2)} (${weekdays[time.getDay()]}) ${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)}:${("0" + time.getSeconds()).slice(-2)}`;
    let relativeTime;
    let difference = (Date.now() - time.getTime()) / 1000;

    if (difference < 10) relativeTime = "Just now";
    else if (difference < 60) relativeTime = `${Math.floor(difference)} seconds ago`;
    else if (difference < 120) relativeTime = `1 minute ago`;
    else if (difference < 3600) relativeTime = `${Math.floor(difference / 60)} minutes ago`;
    else if (difference < 7200) relativeTime = `1 hour ago`;
    else if (difference < 86400) relativeTime = `${Math.floor(difference / 3600)} hours ago`;
    else if (difference < 172800) relativeTime = `1 day ago`;
    else if (difference < 2678400) relativeTime = `${Math.floor(difference / 86400)} days ago`;
    else if (difference < 5356800) relativeTime = `1 month ago`;
    else if (difference < 31536000) relativeTime = `${Math.floor(difference / 2678400)} months ago`;
    else if (difference < 63072000) relativeTime = `1 year ago`;
    else relativeTime = `${Math.floor(difference / 31536000)} years ago`;

    if (isEnabled("force-exact-time")) {
      timeElement.innerText = exactTime;
      timeElement.setAttribute("title", relativeTime);
    } else {
      timeElement.innerText = relativeTime;
      timeElement.setAttribute("title", exactTime);
    }
  });
}

// Initialize post fixes
function initFixes() {
  // Add formatting help to comment section
  document.querySelectorAll("form[name=post] th").forEach(e => {
    if (e.innerText === "Comment") {
      e.insertAdjacentHTML("beforeend", `<sup title="Formatting help" class="sf-formatting-help">?</sup><br><div class="comment-quotes"><a href="javascript:void(0);" class="comment-quote">[>]</a><a href="javascript:void(0);" class="comment-orange">[<]</a></div>`);
    }
  });

// Add the formatting help next to "Email" column header with a new class
document.querySelectorAll("form[name=post] th").forEach(e => {
  if (e.innerText === "Email") {
    // Insert the formatting help button next to the "Email" header with a new class
    e.insertAdjacentHTML("beforeend", `<sup title="Formatting help for Email" class="sf-formatting-help-email">?</sup>`);
  }
});

// Handle the click event for the new "sf-formatting-help-email" button
document.addEventListener('click', function(event) {
  let t = event.target;

  // Check if the clicked element is the "sf-formatting-help-email" button (for "Email")
  if (t.classList.contains("sf-formatting-help-email")) {
    // Trigger the site's existing popup system (if it exists, e.g., customAlert)
    customAlert(`
      <h1>Email Field</h1>
      <p>bump</p>
      <p>sage</p>
      <p>supersage</p>
      <p>anonymous</p>
      <p>anonymous sage</p>
      <p>flag</p>
      <p>flag sage</p>
    `);  // Show the custom message with multiple lines inside the existing popup
  }
});

  // Add file selection URL input if GM_xmlhttpRequest is available (i don't think this is needed anymore, removing or keeping it doesn't break anything though.)
  if (typeof GM_xmlhttpRequest === "function") {
    let fileSelectionInterval = setInterval(() => {
      if (select = document.querySelector("#upload_selection")) {
        select.childNodes[0].insertAdjacentHTML('afterend', ` / <a href="javascript:void(0)" id="sf-file-url"></a>`);
        clearInterval(fileSelectionInterval);
      }
    }, 100);
  }

  // Handle dynamic updates
  document.addEventListener("dyn_update", e => {
    e.detail.forEach(e => fixPost(e));
    fixTime();
    addExpandos();
  });

  // Handle post updates
  document.addEventListener("post_update", e => {
    e.detail.forEach(node => {
      if (node.addedNodes[0].nodeName === "DIV") {
        fixPost(node.addedNodes[0]);
      }
    });
    fixTime();
    addExpandos();
  });

  // Apply fixes to existing posts
  [...document.getElementsByClassName("post")].forEach(e => {
    fixPost(e);
  });
  fixTime();
  addExpandos();
}

// DONT REMOVE THIS PART, IT WILL BREAK THE SCRIPT
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


// Catalog Fixes: Adjust thread timestamps & undo filters
document.querySelectorAll("#Grid > div").forEach(e => {
  let threadTime = new Date(parseInt(e.getAttribute("data-time")) * 1000);
  e.getElementsByClassName("thread-image")[0].setAttribute("title", `${months[threadTime.getMonth()]} ${("0" + threadTime.getDate()).slice(-2)}` +
    ` ${("0" + threadTime.getHours()).slice(-2)}:${("0" + threadTime.getMinutes()).slice(-2)}`);
  undoFilter(e);
});

// Keyboard Shortcuts
window.addEventListener("keydown", e => {
  if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
    if (form = e.target.closest("form[name=post]")) {
      form.querySelector("input[type=submit]").click();
    }
  }
});


// Autofocus Textarea on Certain Pages
if ((textarea = document.querySelector("textarea[name=body]")) && document.documentElement.classList.contains("desktop-style") && window.location.hash[1] != "q") {
  textarea.focus({
    preventScroll: true
  });
}

    // --- Character Counter Feature ---
    const observer = new MutationObserver(() => {
        const commentHeader = Array.from(document.querySelectorAll('th')).find(el => el.textContent.includes('Comment'));

        if (commentHeader) {
            // Stop observing once the Comment header is found
            observer.disconnect();

            // Create the character counter container under the "Comment" heading
            const counterContainer = document.createElement('div');
            counterContainer.style.marginTop = '10px';

            const counterText = document.createElement('span');
            counterText.setAttribute('id', 'char-count');
            counterText.textContent = '0 / 24000';

            counterContainer.appendChild(counterText);
            commentHeader.appendChild(counterContainer);

            // Find the textarea for the comment
            const textArea = document.querySelector('textarea[name="body"]');
            if (textArea) {
                // Update character count as the user types
                textArea.addEventListener('input', function() {
                    const currentLength = textArea.value.length;
                    const maxLength = 24000;

                    // Update the counter
                    counterText.textContent = `${currentLength} / ${maxLength}`;
                });
            }
        }
    });

    // Start observing the DOM for changes in the body element
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

// Password Box Toggle (Show/Hide Password)
if (passwordBox = document.querySelector("form[name=post] input[name=password]")) {
  passwordBox.setAttribute("type", "password");
  passwordBox.insertAdjacentHTML("afterend", `<input type="button" name="toggle-password" value="Show">`);
}


// Form Submit Cooldown
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


// Thread Hiding Logic
function areHiddenThreads() {
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


// Catalog Navigation and Search Form
if (document.body.classList.contains("active-catalog")) {
  if (isEnabled("catalog-navigation")) {
    document.querySelectorAll(".boardlist a[href*='index.html']").forEach(e => e.href = e.href.replace("index.html", "catalog.html"));
  }

  document.querySelector("#image_size").insertAdjacentHTML("afterend", `
    <form style="display: inline-block; margin-bottom: 0px; height: 10px;" action="/search.php">
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


// Event Listeners for Clicks and Inputs
document.addEventListener("click", e => {
  let t = e.target;

  // Submit button in post form
  if (t.matches("form[name=post] input[type=submit]")) {
    t.value = t.getAttribute("og-value");

    // Bypass filter and modify text
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
  }
  // Toggle password visibility
  else if (t.matches("input[name=toggle-password]")) {
    if (passwordBox.getAttribute("type") == "password") {
      passwordBox.setAttribute("type", "text");
      t.value = "Hide";
    } else {
      passwordBox.setAttribute("type", "password");
      t.value = "Show";
    }
  }

  // Mass reply functionality
  else if (t.id == "mass-reply") {
    let massReply = "";
    document.querySelectorAll("[href*='#q']").forEach(e => {
      massReply += `>>${e.textContent}\n`;
    });
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value += massReply;
      e.focus();
    });
  }

  // Mass quote or mass orange functionality
  else if (t.id == "mass-quote" || t.id == "mass-orange") {
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
  }

  // Quick quote or quick orange functionality
  else if (t.classList.contains("quick-quote") || t.classList.contains("quick-orange")) {
    let quote = t.closest(".post").querySelector(".body").innerText.replace(/(\r\n|\r|\n|^)/g, t.classList.contains("quick-quote") ? "$1>" : "$1<") + "\n";
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value += quote;
      e.focus();
    });
  }

  // Comment quote or comment orange functionality
  else if (t.classList.contains("comment-quote") || t.classList.contains("comment-orange")) {
    document.querySelectorAll("textarea[name=body]").forEach(e => {
      e.value = e.value.replace(/(\r\n|\r|\n|^)/g, t.classList.contains("comment-quote") ? "$1>" : "$1<");
      e.focus();
    });
  }

  // Toggle visibility of threads
  else if ((e.shiftKey || (e.detail == 3 && (document.documentElement.matches(".mobile-style") || isEnabled("desktop-triple-click")))) &&
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
  }

  // Toggle hidden threads visibility
  else if (t.id == "toggle-hidden") {
    document.body.classList.toggle("showing-hidden");
  }

  // Hide/unhide thread link functionality
  else if (t.classList.contains("hide-thread-link") || t.classList.contains("unhide-thread-link")) {
    setValue("hiddenthreads", localStorage.getItem("hiddenthreads"));
  }

  // Hide blotter functionality
  else if (t.classList.contains("hide-blotter")) {
    setValue("hidden-blotter", document.querySelector(".blotter").innerText);
    document.body.classList.add("hidden-blotter");
  }

  // SF-expander button functionality (manual cutoff)
  else if (t.classList.contains("sf-expander")) {
    t.closest(".post").setAttribute("manual-cutoff", t.closest(".post").classList.toggle("sf-cutoff"));
  }

  // Formatting help popup
  else if (t.classList.contains("sf-formatting-help")) {
    let help = `
      <h1>Comment Field</h1>
      <span class="heading">Font Guide</span><br>
      <span class="spoiler">**Spoiler**</span><br>
      <em>''Italics''</em><br>
      <b>'''Bold'''</b><br>
      <code>\`\`\`Codetext\`\`\`</code><br>
      <u>__Underline__</u><br>
      <s>~~Strikethrough~~</s><br>
      <big>+=Bigtext=+</big><br>
      <span class="rotate">##Spintext##</span><small><sup> (disabled)</sup></small><br>
      <span class="quote">&gt;Greentext</span><br>
      <span class="quote2">&lt;Orangetext</span><br>
      <span class="quote3" style="color: #6577E6;">^Bluetext</span><br>
      <span class="heading">==Redtext==</span><br>
      <span class="heading2">--Bluetext--</span><br>
      <font color="FD3D98"><b>-~-Pinktext-~-</b></font><br>
      <span class="glow">%%Glowtext%%</span><br>
      <span style="text-shadow:0px 0px 40px #36d7f7, 0px 0px 2px #36d7f7">;;Blueglowtext;;</span><br>
      <span style="text-shadow:0px 0px 40px #fffb00, 0px 0px 2px #fffb00">::Yellowglowtext::</span><br>
      <span style="text-shadow:0px 0px 40px #ff0000, 0px 0px 2px #ff0000">!!Redglowtext!!</span><small><sup> (put after each word)</sup></small><br>
      <span style="background: linear-gradient(to left, red, orange , yellow, green, cyan, blue, violet);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">~-~Rainbowtext~-~</span><br>
      <span class="glow"><span style="background: linear-gradient(to left, red, orange , yellow, green, cyan, blue, violet);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">%%~-~Gemeraldtext~-~%%</span></span><br>
      <span style="background:#faf8f8;color:#3060a8">(((Zionisttext)))</span><br>
      <br>
      <span class="heading">Linking</span><br>
      Link to a post on the current board<br>
      >>1234<br>
      Link to another board<br>
      >>>/soy/<br>
      Link to a post on another board<br>
      >>>/soy/1234<br>
      <br>
      <span class="heading">Wordfilters</span><br>
      See <a href="https://wiki.soyjak.st/Wordfilter" target="_blank">https://wiki.soyjak.st/Wordfilter</a><br>
    `;
    customAlert(help);
  }
});

// Search Input Filter for Catalog Threads
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


// Blotter Hide/Show Button
if (blotter = document.querySelector(".blotter")) {
  blotter.insertAdjacentHTML("beforebegin", `<a class="hide-blotter" href="javascript:void(0)">[–]</a>`);
  if (blotter.innerText == getValue("hidden-blotter") || isEnabled("hide-blotter")) {
    document.body.classList.add("hidden-blotter");
  }
}

document.head.insertAdjacentHTML("beforeend", `
  <style>
    /* Hide elements in specific conditions */
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

    /* Styling for expander button in replies */
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

    /* File URL input styling */
    #sf-file-url::after {
      content: "URL";
    }

    #sf-file-url.sf-loading::after {
      content: "Loading...";
    }

    /* Hover styling for sharty */
    #sharty-hover {
      pointer-events: none;
      position: fixed;
      z-index: 500;
    }

    /* Display adjustments for threads */
    .catty-thread,
    .showing-hidden .catty-thread.hidden {
      display: inline-block !important;
    }

    /* Toggle hidden threads button styling */
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

    /* Recaptcha bubble styling on mobile */
    .mobile-style .g-recaptcha-bubble-arrow + div {
      position: fixed !important;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
    }

    /* Password input field adjustments */
    input[name=toggle-password] {
      margin-left: 2px;
    }

    /* Formatting help link styling */
    .sf-formatting-help {
      cursor: pointer;
    }

    /* Formatting email link styling */
    .sf-formatting-help-email {
      cursor: pointer;
    }

    /* Comment quote button styling */
    .comment-quotes {
      text-align: center;
    }

    /* Truncate long posts styling (conditionally enabled) */
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
      }
    ` : ""}
  </style>
`);

// Initialize additional fixes
initFixes();
