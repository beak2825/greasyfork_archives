// ==UserScript==
// @name        QuickSend
// @version     0.1.1
// @author      Loafoant
// @license     MIT
// @description	Adds UI for quick send messages
// @match       https://www.heroeswm.ru/sms-create.php*
// @match       https://www.lordswm.com/sms-create.php*
// @grant       unsafeWindow
// @run-at      document-end
// @namespace https://greasyfork.org/users/853482
// @downloadURL https://update.greasyfork.org/scripts/480889/QuickSend.user.js
// @updateURL https://update.greasyfork.org/scripts/480889/QuickSend.meta.js
// ==/UserScript==

let script = document.createElement("script");


const BASE_SCRIPT = `
function h(el, attrs = {}, ...children) {
  let element = document.createElement(el);
  Object.entries(attrs).forEach(([key, value]) => {
    element[key] = value;
  });
  if (children.length > 0) {
    element.append(...children);
  }
  return element;
}

function set(key, value, opts = {}) {
  localStorage.setItem(
    key,
    JSON.stringify({
      createdOn: Date.now(),
      value,
      ttl: Number.MAX_SAFE_INTEGER,
      shouldPersist: false,
      ...opts,
    })
  );
}

function getInternal(key) {
  try {
    var item = JSON.parse(localStorage.getItem(key));
    var isExpired = Date.now() >= item.createdOn + item.ttl;
    return isExpired ? remove(key) : item;
  } catch (error) {
    return null;
  }
}

function get(key, defaultValue = null) {
  var item = getInternal(key);
  return item ? item.value : defaultValue;
}

function remove(key) {
  localStorage.removeItem(key);
}

function forEach(cb) {
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var item = getInternal(key);

    if (item) {
      cb(key, item);
    }
  }
}

function clear(removeAll = false) {
  if (removeAll) {
    var _perishedItems = getSnapshot();

    localStorage.clear();
    return _perishedItems;
  }

  var keysToDelete = [];
  var perishedItems = {};
  forEach(function (key, item) {
    if (!item.shouldPersist) {
      keysToDelete.push(key);
      perishedItems = { ...perishedItems, [key]: item.value };
    }
  });
  keysToDelete.forEach(remove);
  return perishedItems;
}

function getSnapshot() {
  var items = {};
  forEach(function (key, item) {
    items = { ...items, [key]: item.value };
    return items;
  });
}

var pandora = {
  set: set,
  get: get,
  remove: remove,
  clear: clear,
  getSnapshot: getSnapshot,
};
`;

const MAIN_SCRIPT = `
/** @type {HTMLElement} */
let mailActions = document.querySelector('input[type="submit"]').parentElement;

/** @type {HTMLElement} */
let savePresetBtn = h("button", {
  type: "button",
  textContent: "Save as Preset",
});
savePresetBtn.style.marginRight = "1em";
savePresetBtn.addEventListener("click", savePreset);

mailActions.prepend(savePresetBtn);

function savePreset(event) {
  let subject = document.querySelector('input[name="subject"]')?.value;
  let message = document.querySelector('textarea[name="msg"]')?.value;
  let preset = pandora.get("lwm_GM_quick_send", {});
  preset[subject] = { subject, message };
  pandora.set("lwm_GM_quick_send", preset);
  showPreset();
}

function deletePreset(subject) {
  let preset = pandora.get("lwm_GM_quick_send", {});
  delete preset[subject];
  pandora.set("lwm_GM_quick_send", preset);
  showPreset();
}

function quickSend(subject) {
  let preset = pandora.get("lwm_GM_quick_send", {});
  let { message } = preset[subject];
  document.querySelector('input[name="subject"]').value = subject;
  document.querySelector('textarea[name="msg"]').value = message;
  let form = document.querySelector('form[action="sms-create.php"]');
  form.submit();
}

function showPreset() {
  let preset = pandora.get("lwm_GM_quick_send", {});
  if (Object.keys(preset).length > 0) {
    let form = document.querySelector('form[action="sms-create.php"]');
    let savedPresets = h(
      "ul",
      { className: "lwm_GM_quick_send_dialog wblight" },
      ...Object.entries(preset).map(([key, value]) => {
        return h(
          "li",
          {},
          h("div", { textContent: value.subject }),
          h("input", { type: "text", value: value.message }),
          h("button", {
            type: "button",
            textContent: "Send",
            onclick: () => quickSend(key),
          }),
          h("button", {
            type: "button",
            textContent: "Delete Preset",
            onclick: () => deletePreset(key),
          })
        );
      })
    );
    form.appendChild(savedPresets);
    form.style.display = "inline-flex";
  }
}

showPreset();
`;

script.innerHTML = `
${BASE_SCRIPT}
${MAIN_SCRIPT}
`;

let style = document.createElement("style");
style.innerText = `
.lwm_GM_quick_send_dialog {
  display: flex;
  flex-direction: column;
  padding: 2em;
  margin: 0 1em;
}

.lwm_GM_quick_send_dialog > li {
  border: 1px solid;
  padding: 1em;
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(2, 125px);
}

.lwm_GM_quick_send_dialog input {
  background: none;
  border: none;
  text-overflow: ellipsis;
}
`;

document.head.appendChild(style);
document.body.appendChild(script);
