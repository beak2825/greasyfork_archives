// ==UserScript==
// @name        ExHentai/E-Hentai - Free Tagsets
// @description Unlimited locally stored tagsets for free
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/mytags
// @match       https://e-hentai.org/mytags
// @version     1.3
// @author      shlsdv
// @icon        https://e-hentai.org/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @homepageURL https://greasyfork.org/en/scripts/484821-exhentai-e-hentai-free-tagsets
// @downloadURL https://update.greasyfork.org/scripts/484821/ExHentaiE-Hentai%20-%20Free%20Tagsets.user.js
// @updateURL https://update.greasyfork.org/scripts/484821/ExHentaiE-Hentai%20-%20Free%20Tagsets.meta.js
// ==/UserScript==

var tagsets = {};
var newSelect;
var pendingSaves = new Set();

function usertagSave(a) {
  let id = a;
  pendingSaves.add(id);
  void 0 == usertag_xhr &&
    (usertag_xhr = new XMLHttpRequest,
      a = {
        method: 'setusertag',
        apiuid,
        apikey,
        tagid: a,
        tagwatch: document.getElementById('tagwatch_' + a).checked ? 1 : 0,
        taghide: document.getElementById('taghide_' + a).checked ? 1 : 0,
        tagcolor: document.getElementById('tagcolor_' + a).value,
        tagweight: document.getElementById('tagweight_' + a).value
      },
      api_call(usertag_xhr, a, () => usertagCallback(id))
    )
}

function usertagCallback(id) {
  var a = api_response(usertag_xhr);
  0 != a &&
    (void 0 != a.error
      ? alert('Could not save tag: ' + a.error)
      : document.getElementById('selector_' + a.tagid).innerHTML =
      '<label class="lc"><input type="checkbox" name="modify_usertags[]" value="' +
      a.tagid + '" /><span></span></label>',
      usertag_xhr = void 0
    )
  pendingSaves.delete(id);
}

function getTagVals(div) {
  const tagpreviewDiv = div.querySelector('div[id*="tagpreview"]');
  const tagwatchInput = div.querySelector('input[id*="tagwatch"]');
  const taghideInput = div.querySelector('input[id*="taghide"]');
  const tagweightInput = div.querySelector('input[id*="tagweight"]');
  const tagcolorInput = div.querySelector('input[id*="tagcolor"]');

  const dict = {}
  const title = tagpreviewDiv ? tagpreviewDiv.getAttribute('title') : '';
  const id = div.id.split('_').length > 1 ? parseInt(div.id.split('_')[1]) : 0;
  dict['watched'] = tagwatchInput ? tagwatchInput.checked : false;
  dict['hidden'] = taghideInput ? taghideInput.checked : false;
  dict['weight'] = tagweightInput ? parseInt(tagweightInput.value) || 0 : 0;
  dict['color'] = tagcolorInput ? tagcolorInput.value : '';

  const inputs = [tagwatchInput, taghideInput, tagcolorInput, tagweightInput];
  return [title, id, dict, inputs];
}

function getCurrentSet() {
  const dataDict = {};
  document.querySelectorAll('div[id*="usertag"]').forEach(usertagDiv => {
    const [title, id, vals, _] = getTagVals(usertagDiv);
    if (title != '') {
      dataDict[title] = vals;
    }
  });
  return dataDict;
}

function saveCurrentSet(name) {
  if (!name) {
    return;
  }
  const dict = getCurrentSet();
  tagsets[name] = dict;
  GM_setValue('tagsets', tagsets);
  populateSelect();
  newSelect.value = name;
  createNotification(`Saved tagset '${name}' to script storage`);
}

function copyCurrentSet() {
  const dict = getCurrentSet();
  var result = '';
  for (var key in dict) {
    if (dict[key]['watched']) {
      result += ` +${key}`;
    }
    else if (dict[key]['hidden']) {
      result += ` -${key}`;
    }
  }
  navigator.clipboard.writeText(result);
  createNotification('Copied selection to clipboard');
}

function createNotification(text, duration = 3) {
  const existingNotification = document.getElementById('freeTagsetNotification');
  if (existingNotification) {
    existingNotification.remove();
  }
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'freeTagsetNotification';
  notificationContainer.style.position = 'fixed';
  notificationContainer.style.bottom = '30px';
  notificationContainer.style.right = '40px';
  const notificationButton = document.createElement('input');
  notificationButton.type = 'button';
  notificationButton.value = text;
  notificationButton.style.padding = '10px';
  notificationButton.style.fontSize = '16px';
  notificationContainer.appendChild(notificationButton);
  document.body.appendChild(notificationContainer);

  if (duration != -1) {
    setTimeout(() => {
      if (notificationContainer.parentElement) {
        notificationContainer.parentElement.removeChild(notificationContainer);
      }
    }, duration * 1000);
  }

  return notificationButton;
}

function loadSavedSet(key, save = true) {
  if (!(key in tagsets)) {
    return;
  }
  const dict = tagsets[key];

  const usertagDivs = document.querySelectorAll('div[id*="usertag"]');
  (async () => {
    for (const usertagDiv of usertagDivs) {
      const [title, id, _, inputs] = getTagVals(usertagDiv);
      const [tagwatchInput, taghideInput, tagcolorInput, tagweightInput] = inputs;

      if (!id || !(title in dict)) {
        continue;
      }

      const [watch, hide, color, weight] = [dict[title]['watched'], dict[title]['hidden'], dict[title]['color'], dict[title]['weight']];
      const vals1 = [tagwatchInput.checked, taghideInput.checked, tagcolorInput.value, parseInt(tagweightInput.value)];
      const changed = ![watch, hide, color, weight].every((x, i) => x === vals1[i]);
      const saveInput = usertagDiv.querySelector('input[id*="tagsave"]');

      if (!changed && !saveInput) {
        continue;
      }

      while (pendingSaves.size > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      tagwatchInput.click();
      tagwatchInput.click();
      tagwatchInput.checked = watch;
      taghideInput.checked = hide;
      tagcolorInput.value = color;
      update_tagcolor(id, tagcolorInput.value, color.replace(/^#*/, ""));
      tagweightInput.value = weight;
      if (save) {
        usertagSave(id);
      }
    }
    if (save) {
      setTimeout(() => createNotification(`Loaded ${key}`), 150);
    }
  })();
}

function deleteTagset(key) {
  if (!(key in tagsets)) {
    return;
  }
  delete tagsets[key];
  GM_setValue('tagsets', tagsets);
  populateSelect();
  newSelect.value = 'None';
  createNotification(`Deleted ${key}`)
}

function populateSelect() {
  newSelect.innerHTML = '';
  for (const key in tagsets) {
    const option = document.createElement('option');
    option.value = key;
    option.text = key;
    newSelect.appendChild(option);
  }
}

async function saveAllPending() {
  const notification = createNotification('Please wait..', -1);
  const usertagDivs = document.querySelectorAll('div[id*="usertag"]');
  let didSomething = false;
  let doneCount = 0;

  const totalSaves = Array.from(usertagDivs).filter(div => {
    const [, id] = getTagVals(div);
    return id && div.querySelector('input[id*="tagsave"]');
  }).length;

  for (const usertagDiv of usertagDivs) {
    const [title, id, ,] = getTagVals(usertagDiv);
    if (!id) continue;
    const saveInput = usertagDiv.querySelector('input[id*="tagsave"]');
    if (saveInput) {
      didSomething = true;
      while (pendingSaves.size > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      usertagSave(id);
      doneCount++;
      notification.value = `Applying (${doneCount}/${totalSaves})`;
    }
  }

  while (pendingSaves.size > 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  createNotification(didSomething ? `Done!` : `Nothing to save!`);
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 === null || typeof obj1 !== 'object' ||
      obj2 === null || typeof obj2 !== 'object') {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

function determineCurrentTagset() {
  const current = getCurrentSet();
  for (const key in tagsets) {
    const saved = tagsets[key];
    const intersection = Object.keys(saved).filter(prop => current.hasOwnProperty(prop));
    if (intersection.every(prop => deepEqual(saved[prop], current[prop]))) {
      return key;
    }
  }
  return null;
}

function initFreeTagsets() {
  tagsets = GM_getValue('tagsets');
  const newDiv = document.createElement('div');
  newDiv.style.paddingLeft = '196px';
  newDiv.style.paddingRight = '15px';
  newDiv.style.paddingTop = '8px';
  newDiv.style.display = 'flex';
  newDiv.style.alignItems = 'center';
  newDiv.style.marginTop = '5px';
  newDiv.style.paddingBottom = '8px';
  newDiv.style.backgroundColor = '#43464ede';

  const newButton = document.createElement('input');
  newButton.type = 'button';
  newButton.value = '➕ New';
  newButton.title = 'Save the current selection as a new tagset';
  newButton.addEventListener('click', () => saveCurrentSet(prompt("Enter tagset name:")));
  newDiv.appendChild(newButton);

  const inputButton = document.createElement('input');
  inputButton.type = 'button';
  inputButton.value = '💾 Save';
  inputButton.title = 'Overwrite selected tagset with current selection';
  inputButton.addEventListener('click', () => {
    let userInput = newSelect.value;
    if (userInput && userInput in tagsets) {
      if (!confirm(`Overwrite tagset "${userInput}"?`)) {
        return;
      }
    }
    if (!userInput) {
      userInput = prompt("Enter tagset name:");
      if (!userInput) return;
    }
    saveCurrentSet(userInput);
  });
  newDiv.appendChild(inputButton);

  const delBtn = document.createElement('input');
  delBtn.type = 'button';
  delBtn.value = '🗑️ Delete';
  delBtn.title = 'Delete selected tagset';
  delBtn.addEventListener('click', () => {
    if (newSelect.value in tagsets) {
      if (confirm(`Are you sure you want to delete the tagset "${newSelect.value}"?`)) {
        deleteTagset(newSelect.value);
      }
    } else {
      alert("Please select a valid tagset to delete.");
    }
  });
  newDiv.appendChild(delBtn);

  newSelect = document.createElement('select');
  populateSelect();
  newSelect.value = 'None';
  newSelect.style.height = '31px';
  newSelect.style.minWidth = '155px';
  newSelect.style.backgroundColor = 'rgb(71, 71, 110)';
  newSelect.addEventListener('change', () => loadSavedSet(newSelect.value, false));
  newDiv.appendChild(newSelect);

  const copyButton = document.createElement('input');
  copyButton.type = 'button';
  copyButton.value = '📋 Copy Filters';
  copyButton.style.marginLeft = 'auto';
  copyButton.title = 'Copy current selection as search string filters to clipboard';
  copyButton.addEventListener('click', () => copyCurrentSet());
  // newDiv.appendChild(copyButton);

  const saveAllButton = document.createElement('input');
  saveAllButton.type = 'button';
  saveAllButton.value = 'Save All';
  saveAllButton.style.marginLeft = 'auto';
  saveAllButton.addEventListener('click', () => saveAllPending());
  newDiv.appendChild(saveAllButton);

  const tagsetForm = document.getElementById('tagset_form');
  tagsetForm.insertAdjacentElement('afterend', newDiv);

  setTimeout(() => {
    const currentKey = determineCurrentTagset();
    if (currentKey !== null) {
      newSelect.value = currentKey;
    }
  }, 50);
}


(function () {
  initFreeTagsets();
})();
