// ==UserScript==
// @name        Download medical claims onpatient.com
// @namespace   Violentmonkey Scripts
// @match       https://www.onpatient.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.download
// @version     1.3
// @author      -
// @description Script to download newer medical claims.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489666/Download%20medical%20claims%20onpatientcom.user.js
// @updateURL https://update.greasyfork.org/scripts/489666/Download%20medical%20claims%20onpatientcom.meta.js
// ==/UserScript==

const messages = {};

// const accept_filename = filename => filename.includes("HCFA");
const accept_filename = filename => true;
const detail_link_selector = 'a[ng-href]';
const detail_pane_selector = '.ng-scope td.ng-binding';
const message_list_selector = 'tr.ng-scope td[ng-bind="message.sender"]';

let newMessageButton;
let state = "not ready";

function add_populated_UI() {
  console.log("populating UI");
  state = "populating";

  for (const {msgid, td, filename, checked} of Object.values(messages)) {
    // Create a checkbox for the row if the filename says it is a medical insurance form.
    if (!accept_filename(filename))
      continue;

    const tr = td.parentElement;
    const [trash_span] = tr.getElementsByClassName("fa-trash");
    const next_td = mkdom("td");
    const id = "ck-" + msgid;
    if (document.getElementById(id))
      continue;
    const config = {type: 'checkbox', id};
    if (checked) {
      config.checked = undefined;
    }
    const check = mkdom("input", config);
    check.classList = ["medclck"];
    next_td.appendChild(check);
    trash_span.parentElement.after(next_td);
    check.addEventListener('change', ev => {
      messages[msgid].checked = check.checked;
    });
    check.after(document.createTextNode(filename));
  }

  // Create "Download All" button.
  const button = make_button("Download All", "dlall", ev => {
    button.innerText = "...wait...";
    for (let { detail, filename, downfile } of Object.values(messages)) {
      // Medical insurance forms only.
      if (accept_filename(filename)) {
        GM.download({ url: detail, name: downfile, onload() { button.innerText = "Download All"; } });
      }
    }
  });
  newMessageButton.after(button);

  // Create "Download Selected" button.
  const selbutton = make_button("Download Selected", "dlsel", ev => {
    selbutton.innerText = "...wait...";
    for (let { detail, filename, downfile, checked } of Object.values(messages)) {
      // Medical insurance forms only.
      if (checked && accept_filename(filename)) {
        GM.download({ url: detail, name: downfile, onload() { selbutton.innerText = "Download Selected"; } });
      }
    }
  });
  newMessageButton.after(selbutton);

  state = "ready";
}

async function getAllDetail() {
  // Note: this does not handle new messages appearing. (The messages
  // object will get updated, but this locks in the set of keys when
  // Object.keys is called.)
  for (const msgid of Object.keys(messages)) {
    let {td, detail} = messages[msgid]; // Get latest data.
    if (detail) continue;

    // Click on a detail link. Grab the resulting download URL and filename.
    td.click();
    const elt = await waitForElement(detail_link_selector, {single: true});
    detail = elt.getAttribute("ng-href");
    messages[msgid].detail = detail;
    const filename = elt.innerText;
    messages[msgid].filename = filename;
    const m = filename.match(/(\d\d)-(\d\d)-(\d\d\d\d)/);
    let downfile = filename;
    if (m) {
      downfile = `${m[3]}-${m[1]}-${m[2]} ${filename}.pdf`;
    }
    messages[msgid].downfile = downfile;
    console.log("Grabbed detail and filename", detail, filename, "Going back");

    // Go back.
    history.back();
    await waitForElement(detail_pane_selector);
  }

  console.log("Captured all download URLs and filenames, populating checkboxes");
  add_populated_UI();
}

function mkdom(tag, attrs={}) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    node.setAttribute(name, value);
  }
  return node;
}

function make_button(label, id, command) {
  let existing = document.getElementById(id);
  if (existing) return existing;

  const button = mkdom("button", {id});
  button.classList = ["btn-primary"];
  button.innerText = label;
  if (command) {
    button.onclick = command;
  }

  return button;
}

const stalkQueries = [];

const watcher = new MutationObserver((mutations, observer) => {
  // Re-scan the message list and find all of the .fa-trash elements.
  for (const trash_span of document.getElementsByClassName('fa-trash')) {
    if (trash_span.getAttribute("data-msgid"))
      continue;
    const trash_td = trash_span.parentElement;
    const tr = trash_td.parentElement;
    let msgid;
    for (const td of tr.querySelectorAll("td[href]")) {
      const href = td.getAttribute("href");
      const m = href.match(/\d+/);
      if (!m) continue;

      // Refresh the td elements in all unprocessed messages (for the case
      // where we went to the detail screen and came back, rewriting the DOM.)
      msgid = m[0];
      messages[msgid] ||= { msgid }; // This might be updating an existing.
      messages[msgid].href = href;
      messages[msgid].td = td;
      break; // Done with this trash_span, move to the next.
    }
    trash_span.setAttribute("data-msgid", msgid);
  }

  for (const {query, resolve, options} of stalkQueries) {
    const nodes = document.querySelectorAll(query);
    if (nodes.length == 0) continue;
    console.log(`element ${query} has appeared, n=${nodes.length}`);
    if (options.single) {
      if (nodes.length > 1) {
        console.error(nodes.length + " nodes found for query " + query);
        continue;
      } else {
        resolve(nodes[0]);
      }
    } else {
      resolve(nodes);
    }
  }

  if (state == "ready" && document.querySelector(message_list_selector) && !document.getElementsByClassName("medclck").length) {
    add_populated_UI();
  }

  return false; // Do not disconnect observer.
});

// Create a Promise for the given CSS selector query that
// resolves with the matching element or list of elements (depending on options.single)
// when at least one match appears in the DOM.
function waitForElement(query, options={}) {
  let stalker;
  return new Promise(resolve => {
    stalker = {query, resolve, options};
    stalkQueries.push(stalker);
  }).then(results => {
    const idx = stalkQueries.indexOf(stalker);
    stalkQueries.splice(idx, 1);
    return results;
  });
}

function init() {
  newMessageButton = document.querySelector(".btn");
  console.log("newMessageButton", newMessageButton);

  watcher.observe(document.body, {
    subtree: true,
    childList: true,
  });

  GM.registerMenuCommand('Prepare Download', ev => {
    console.log(" ------ running command ------");
    // GM.getValue/setValue currently unused.
    GM.getValue('info').then(info => {
      getAllDetail().then(() => GM.setValue('info', info));
    });
  });

  const button = make_button("Prepare Download", "preppie", ev => {
    button.remove();
    getAllDetail();
  });
  newMessageButton.after(button);
}

// I could not figure out how to monitor the URL. popstate event doesn't work for whatever is
// "navigating" within this page. I did not see any submit events. Fall back to polling.
//
// Note that I could just use this URL in the @match, but then I would need to navigate
// to the page and reload before the script manager would activate this user script.
let checker = setInterval(() => {
  if (window.location.href.includes("/messaging/list/inbox/")) {
    init();
    clearInterval(checker);
    checker = null;
  }
}, 500);

console.log("User script init complete.");
