// ==UserScript==
// @name        ExHentai/E-Hentai - Remove Post Limit In Watched
// @description Removes post limit when browsing watched tag posts
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/watched
// @match       https://e-hentai.org/watched
// @version     1.2
// @author      shlsdv
// @icon        https://e-hentai.org/favicon.ico
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @homepageURL https://greasyfork.org/en/scripts/484821-exhentai-e-hentai-free-tagsets
// @downloadURL https://update.greasyfork.org/scripts/491183/ExHentaiE-Hentai%20-%20Remove%20Post%20Limit%20In%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/491183/ExHentaiE-Hentai%20-%20Remove%20Post%20Limit%20In%20Watched.meta.js
// ==/UserScript==

// -- Configuration -----------------------------------------------------------------

class Config {
  constructor(configDefinitions = {}) {
    // The configDefinitions object defines the initial value and label for each key.
    // Example:
    // {
    //   autoJump: { default: false, label: "Auto Jump" },
    //   autoJumpLimit: { default: 20, label: "Auto Jump Limit" }
    // }
    this.configDefinitions = { ...configDefinitions };
    this.data = {};

    Object.keys(this.configDefinitions).forEach((key) => {
      this.data[key] = this.configDefinitions[key].default;
    });
    this.load();
    this.registerMenuCommand();
  }

  load() {
    for (const key in this.configDefinitions) {
      if (Object.prototype.hasOwnProperty.call(this.configDefinitions, key)) {
        const storedValue = GM_getValue(key);
        if (typeof storedValue !== 'undefined') {
          this.data[key] = storedValue;
        }
      }
    }

    Object.keys(this.configDefinitions).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => this.data[key],
        set: (newValue) => {
          this.data[key] = newValue;
          this.save();
        },
        configurable: true,
        enumerable: true
      });
    });
  }

  save() {
    for (const key in this.data) {
      if (!Object.prototype.hasOwnProperty.call(this.data, key)) continue;
      if (this.data[key] !== this.configDefinitions[key].default) {
        GM_setValue(key, this.data[key]);
      } else {
        GM_deleteValue(key);
      }
    }
  }

  showUI() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = 1000000;
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const configContainer = document.createElement("div");
    configContainer.style.padding = "1em";
    configContainer.style.backgroundColor = "#333";
    configContainer.style.color = "#fff";
    configContainer.style.border = "1px solid #555";
    configContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
    configContainer.style.width = "400px";
    configContainer.style.borderRadius = "4px";
    configContainer.style.fontFamily = "Arial, sans-serif";

    const form = document.createElement("form");

    Object.keys(this.configDefinitions).forEach((key) => {
      const value = this.data[key];
      const { label } = this.configDefinitions[key];
      const fieldWrapper = document.createElement("div");
      fieldWrapper.style.marginBottom = "0.75em";
      fieldWrapper.style.display = "flex";
      fieldWrapper.style.alignItems = "center";

      const labelElement = document.createElement("label");
      labelElement.textContent = label || key;
      labelElement.htmlFor = `config-${key}`;
      labelElement.style.width = "150px";
      labelElement.style.marginRight = "0.5em";
      labelElement.style.fontWeight = "bold";

      let input;
      if (typeof value === "boolean") {
        input = document.createElement("input");
        input.id = `config-${key}`;
        input.type = "checkbox";
        input.checked = value;
        input.style.transform = "scale(1.2)";
      } else if (typeof value === "number") {
        input = document.createElement("input");
        input.id = `config-${key}`;
        input.type = "number";
        input.value = value;
        input.style.flexGrow = "1";
        input.style.padding = "0.3em";
        input.style.border = "1px solid #777";
        input.style.borderRadius = "2px";
        input.style.backgroundColor = "#555";
        input.style.color = "#fff";
      } else {
        input = document.createElement("input");
        input.id = `config-${key}`;
        input.type = "text";
        input.value = value;
        input.style.flexGrow = "1";
        input.style.padding = "0.3em";
        input.style.border = "1px solid #777";
        input.style.borderRadius = "2px";
        input.style.backgroundColor = "#555";
        input.style.color = "#fff";
      }

      fieldWrapper.appendChild(labelElement);
      fieldWrapper.appendChild(input);
      form.appendChild(fieldWrapper);
    });

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.style.textAlign = "right";

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Config";
    saveButton.type = "submit";
    saveButton.style.marginRight = "0.5em";
    saveButton.style.padding = "0.5em 1em";
    saveButton.style.backgroundColor = "#4CAF50";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "3px";
    saveButton.style.color = "#fff";
    saveButton.style.cursor = "pointer";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.style.padding = "0.5em 1em";
    cancelButton.style.backgroundColor = "#f44336";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "3px";
    cancelButton.style.color = "#fff";
    cancelButton.style.cursor = "pointer";
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    buttonsWrapper.appendChild(saveButton);
    buttonsWrapper.appendChild(cancelButton);
    form.appendChild(buttonsWrapper);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Object.keys(this.configDefinitions).forEach((key) => {
        const input = form.querySelector(`#config-${key}`);
        if (!input) return;
        let newValue;
        if (input.type === "checkbox") {
          newValue = input.checked;
        } else if (input.type === "number") {
          newValue = input.valueAsNumber;
          if (isNaN(newValue)) {
            newValue = this.data[key];
          }
        } else {
          newValue = input.value;
        }
        this.data[key] = newValue;
      });
      this.save();
      document.body.removeChild(overlay);
    });

    configContainer.appendChild(form);
    overlay.appendChild(configContainer);
    document.body.appendChild(overlay);
  }

  registerMenuCommand(name = "Configuration") {
    GM_registerMenuCommand(name, () => this.showUI());
  }
}

const config = new Config({
  autoJump: { default: false, label: "Auto Jump" },
  autoJumpLimit: { default: 20, label: "Auto Jump Limit" },
});


// ----------------------------------------------------------------------------------

const fullTag = {
  a: 'artist',
  c: 'character',
  char: 'character',
  cos: 'cosplayer',
  f: 'female',
  g: 'group',
  circle: 'group',
  l: 'language',
  lang: 'language',
  m: 'male',
  x: 'mixed',
  o: 'other',
  p: 'parody',
  series: 'parody',
  r: 'reclass'
};

function addFilterButton() {
  const fsearch = document.getElementById('f_search');
  if (!fsearch) return;

  const inputButton = document.createElement('input');
  inputButton.type = 'button';
  inputButton.value = 'Filter';

  inputButton.addEventListener('click', function() {
    sessionStorage.setItem('searchFilter', fsearch.value);
    applyFilter();
  });

  const searchBtn = fsearch.parentNode.querySelector('input[value="Search"]');
  searchBtn.addEventListener('mousedown', function() {
    sessionStorage.setItem('searchFilter', '');
  });

  const clearBtn = fsearch.parentNode.querySelector('input[value="Clear"]');
  clearBtn.addEventListener('mousedown', function() {
    sessionStorage.setItem('searchFilter', '');
  });

  fsearch.parentNode.appendChild(inputButton);
}

function parseFilterString(input) {
  if (!input) return {};
  let split = input.match(/([-]\b\w*:\s*"[^"]+"|[-]\b\w*:\s*\w+|-[^"]\w*\b(?=\s|$)|\b\w*:\s*"[^"]+"|\b\w*:\s*\w+|[^"]\w*\b(?=\s|$))/g);
  let result = { content: [] };
  split.forEach(item => {
    let kv = item.trim().split(/:(.+)/);
    if (kv.length >= 2) {
      let x = kv[0].startsWith('-') ? kv[0].substring(1) : kv[0];
      if (x in fullTag) {
        kv[0] = (kv[0].startsWith('-') ? '-' : '') + fullTag[x];
      }
      result[kv[0]] = kv[1].trim().replace(/["$]/g, '');
    } else {
      result['content'].push(kv[0]);
    }
  });
  result.content = result.content.join(' ');
  return result;
}

function setSearchBarToFilter() {
  let search = sessionStorage.getItem('searchFilter');
  if (search) {
    document.getElementById('f_search').value = search;
  }
}

async function applyFilter() {
  let search = sessionStorage.getItem('searchFilter');
  let dict = parseFilterString(search);

  let elems = document.querySelectorAll('.glname');
  let foundAny = false;
  elems.forEach(elem => {
    let ancestor = elem.closest('tr') || elem.closest('.gl1t');
    if (!ancestor) return;
    // Default to visible.
    ancestor.style.display = '';

    let matches = true;
    for (let key in dict) {
      if (key === 'content') {
        if (ancestor.innerHTML.toLowerCase().indexOf(dict[key].toLowerCase()) === -1) {
          matches = false;
          break;
        }
      } else {
        let negation = key.startsWith('-');
        let adjustedKey = negation ? key.substring(1) : key;
        let query = (adjustedKey + ':' + dict[key]).toLowerCase();
        let containsKeyValue = ancestor.innerHTML.toLowerCase().includes(query);
        if ((negation && containsKeyValue) || (!negation && !containsKeyValue)) {
          matches = false;
          break;
        }
      }
    }
    if (!matches) {
      ancestor.style.display = 'none';
    } else {
      foundAny = true;
    }
  });

  // If content is visible, remove the auto jump flag.
  if (foundAny) {
    await GM_deleteValue('shouldAutoJump');
    await GM_deleteValue('autoJumpCount');
  }
}

function getDomain() {
  return window.location.href.includes('exhentai') ? 'exhentai.org' : 'e-hentai.org';
}

function getEarliestPostId() {
  const regex = new RegExp(`https://${getDomain()}/g/(\\d+)/.*`);
  const elements = document.querySelectorAll('a');
  for (let i = elements.length - 1; i >= 0; i--) {
    const match = elements[i].href.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Helper function to create a jump link element with proper event listener.
function createJumpLink(nextUrl) {
  const jumpLink = document.createElement('a');
  jumpLink.id = "unext";
  jumpLink.href = nextUrl;
  jumpLink.innerText = "Jump >";
  jumpLink.addEventListener('click', async function(e) {
    e.preventDefault();
    await GM_setValue('shouldAutoJump', true);
    window.location.href = nextUrl;
  });
  return jumpLink;
}

async function initInfinitePages2() {
  const unext = document.querySelector('#unext');
  if (unext === null) {
    console.log('Infinite pages: unext does not exist in document (first page is probably empty).');
    return;
  }

  if (unext.tagName.toLowerCase() === 'span') {
    let id = getEarliestPostId();
    let nextUrl = '';
    let jump = 1;

    if (window.location.href.includes('&jump=')) {
      const urlParams = new URLSearchParams(window.location.search);
      jump = parseInt(urlParams.get('jump').replace(/\D/g, '')) + 1;
    }

    if (!window.location.href.includes('?next=') && id === null) {
      console.log("Infinite pages: url does not contain '?next=' and no post exists in document");
      return;
    } else if (id === null) {
      nextUrl = window.location.href.split('&jump=')[0];
      nextUrl += '&jump=' + jump;
    } else {
      id = parseInt(id);
      nextUrl = `https://${getDomain()}/watched?next=${id}&jump=${jump}`;
    }

    console.log("Next URL:", nextUrl);

    // Check if we should auto jump.
    if (config.autoJump) {
      const shouldAutoJump = await GM_getValue('shouldAutoJump', false);
      if (shouldAutoJump) {
        // Use GM storage to track how many auto jumps have occured.
        let autoJumpCount = await GM_getValue('autoJumpCount', 0);
        autoJumpCount++;

        if (autoJumpCount >= config.autoJumpLimit) {
          // Reached the limit - ask for confirmation.
          if (!confirm(`Automatic jump limit of ${config.autoJumpLimit} reached. Continue jumping?`)) {
            // If user cancels then don't auto jump.
            await GM_setValue('autoJumpCount', autoJumpCount);
            return; // Stop further auto jumping.
          }
          // Else reset the counter if user accepts.
          autoJumpCount = 0;
        }

        await GM_setValue('autoJumpCount', autoJumpCount);

        // Check if no visible gallery items are present.
        let visibleItems = document.querySelectorAll('.glname:not([style*="display: none"])');
        if (visibleItems.length === 0) {
          console.log("Auto-jumping: no visible gallery items, the auto jump flag is set, and count is", autoJumpCount);
          window.location.href = nextUrl;
          return;
        }
      }
    }

    // Replace #unext with a new jump link.
    const jumpLink = createJumpLink(nextUrl);
    const unextParent = document.querySelector('#unext').parentNode;
    unextParent.innerHTML = "";
    unextParent.appendChild(jumpLink);

    // Ensure dnext gets its own jump link with identical functionality.
    const dnextElem = document.querySelector('#dnext');
    if (dnextElem && dnextElem.parentNode) {
      const dnextParent = dnextElem.parentNode;
      dnextParent.innerHTML = "";
      dnextParent.appendChild(createJumpLink(nextUrl));
    }
  }
}

(async function() {
  await initInfinitePages2();
  addFilterButton();
  await applyFilter();
  setSearchBarToFilter();
})();
