async function addTextInput(configuration) {
  let {
    categoryName,
    settingName,
    labelText,
    labelTooltip = undefined,
    currentSetting = undefined,
    defaultSetting = '',
    callbackFunction = undefined,
  } = configuration;

  const header = await _addCategoryHeader(categoryName);
  if (currentSetting === undefined) {
    currentSetting = await GM.getValue(settingName, defaultSetting);
  }

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.name = settingName;
  textInput.value = currentSetting;

  const label = _createLabel(labelText);
  _formatLabel(label, labelTooltip);
  _addBelowHeader(header, label);

  const inputElement = _createInput(textInput);
  label.insertAdjacentElement('afterend', inputElement);

  if (callbackFunction) {
    _addCallback(() => callbackFunction(settingName, textInput.value));
  } else {
    _addCallback(async () => await GM.setValue(settingName, textInput.value));
  }
}

async function addNumberInput(configuration) {
  let {
    categoryName,
    settingName,
    labelText,
    labelTooltip = undefined,
    min = 0,
    max = 100,
    step = 1,
    currentSetting = undefined,
    defaultSetting = 0,
    callbackFunction = undefined
  } = configuration;

  const header = await _addCategoryHeader(categoryName);
  if (currentSetting === undefined) {
    currentSetting = await GM.getValue(settingName, defaultSetting);
  }

  const numberInput = document.createElement('input');
  numberInput.type = 'number';
  numberInput.name = settingName;
  numberInput.value = currentSetting;
  numberInput.min = min;
  numberInput.max = max;
  numberInput.step = step;

  const label = _createLabel(labelText);
  _formatLabel(label, labelTooltip);
  _addBelowHeader(header, label);

  const inputElement = _createInput(numberInput);
  label.insertAdjacentElement('afterend', inputElement);

  if (callbackFunction) {
    _addCallback(() => callbackFunction(settingName, numberInput.value));
  } else {
    _addCallback(async () => await GM.setValue(settingName, numberInput.value));
  }
}

async function addCheckboxInput(configuration) {
  let {
    categoryName,
    settingName,
    labelText,
    labelTooltip = undefined,
    currentSetting = undefined,
    defaultSetting = false,
    callbackFunction = undefined
  } = configuration;

  const header = await _addCategoryHeader(categoryName);
  if (currentSetting === undefined) {
    currentSetting = await GM.getValue(settingName, defaultSetting);
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = settingName;
  checkbox.checked = currentSetting;

  const label = _createLabel(labelText);
  _formatLabel(label, labelTooltip);
  _addBelowHeader(header, label);

  const inputElement = _createInput(checkbox);
  label.insertAdjacentElement('afterend', inputElement);

  if (callbackFunction) {
    _addCallback(() => callbackFunction(settingName, checkbox.checked));
  } else {
    _addCallback(async () => await GM.setValue(settingName, checkbox.checked));
  }
}

async function addDropdown(configuration) {
  let {
    categoryName,
    settingName,
    labelText,
    labelTooltip = undefined,
    options, // [{ value: 'value', text: 'text', ... }]
    currentSetting = undefined,
    defaultSetting = undefined,
    callbackFunction = undefined
  } = configuration;

  const header = await _addCategoryHeader(categoryName);
  if (currentSetting === undefined) {
    currentSetting = await GM.getValue(settingName, defaultSetting);
  }

  const select = document.createElement('select');
  select.name = settingName;
  select.classList.add('form-control');

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    if (option.value === currentSetting) {
      optionElement.selected = true;
    }
    select.appendChild(optionElement);
  });

  const label = _createLabel(labelText);
  _formatLabel(label, labelTooltip);
  _addBelowHeader(header, label);

  const inputElement = _createInput(select);
  label.insertAdjacentElement('afterend', inputElement);

  if (callbackFunction) {
    _addCallback(() => callbackFunction(settingName, select.value));
  } else {
    _addCallback(async () => await GM.setValue(settingName, select.value));
  }
}

function _formatLabel(label, labelTooltip) {
  if (labelTooltip) {
    const info = document.createElement('sup');
    info.textContent = ' ⓘ';
    label.appendChild(info);

    const showTooltip = () => {
      const tooltip = document.getElementById('universal-userscript-tooltip');
      const hideTooltip = () => {
        tooltip.style.display = 'None';
      };

      const closeButton = `<a href="#" id="tooltip-close" style="display: flex; justify-content: center; color: var(--link_color); margin-top: 0.5rem;">Close Tooltip</a>`;
      tooltip.innerHTML = labelTooltip + closeButton;
      tooltip.style.display = 'block';

      tooltip.querySelector('#tooltip-close').addEventListener('click', (event) => {
        event.preventDefault();
        hideTooltip();
      });
    };

    label.addEventListener('click', (event) => {
      showTooltip(event);
    });
  }
  const colon = document.createTextNode('\u00A0:');
  label.appendChild(colon);
}

function _addBelowHeader(header, label) {
  let nextHeader = header.nextElementSibling;
  while (nextHeader && !nextHeader.matches('.header')) {
    nextHeader = nextHeader.nextElementSibling;
  }
  if (!nextHeader) {
    nextHeader = document.querySelector('#universal-userscript-preferences>.market_grid.profile.prefs.margin-auto>.footer.small-gap');
  }
  nextHeader.insertAdjacentElement('beforebegin', label);
}

function _addSettingsLink() {
  const existingNav = document.querySelector('nav.center.margin-1');

  if (existingNav) {
    const newNav = document.createElement('nav');
    newNav.classList.add('center', 'margin-1');
    newNav.id = 'universal-userscript-navigation';

    const newLink = document.createElement('a');
    newLink.href = '/help/userscripts/';
    newLink.textContent = 'Userscript Preferences';

    newNav.appendChild(newLink);

    existingNav.after(newNav);
  } else {
    console.error('Existing navigation element not found.');
  }
}

function _createLabel(labelText) {
  const labelContainer = document.createElement('div');
  labelContainer.classList.add('data', 'left');

  const label = document.createElement('span');
  label.textContent = labelText;
  labelContainer.appendChild(label);
  return labelContainer;
}

function _createInput(input) {
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('data', 'flex-column', 'right');
  inputContainer.appendChild(input);
  return inputContainer;
}

function _addCallback(callbackFunction) {
  document.getElementById('universal-userscript-update').addEventListener('click', callbackFunction);
}

async function _addCategoryHeader(categoryName) {
  if (!window.location.href.includes('/help/userscripts/')) throw Error('Attempted to add setting outside of settings page.');
  await _checkSettingsSetup();
  const settings = document.querySelector('.market_grid.profile.prefs.margin-auto');
  const footer = document.querySelector('#universal-userscript-preferences>.market_grid.profile.prefs.margin-auto>.footer.small-gap');
  if (!settings) {
    console.error('Settings not found.');
    return;
  }

  const headers = Array.from(settings.querySelectorAll('.header'));
  let header = headers.find(header => header.textContent.trim() === categoryName);

  if (!header) {
    header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `<strong>${categoryName}</strong>`;

    const insertionPoint = headers.find(existingHeader => existingHeader.textContent.trim().localeCompare(categoryName) > 0);

    if (insertionPoint) {
      insertionPoint.insertAdjacentElement('beforebegin', header);
    } else {
      footer.insertAdjacentElement('beforebegin', header);
    }
  }

  return header;
}

function _replaceBannerImage() {
  const bannerImage = document.getElementById('top-header-image');
  if (bannerImage) {
    bannerImage.src = 'https://grundoscafe.b-cdn.net/misc/banners/userinfo.gif';
  } else {
    console.error('Banner image not found.');
  }
}

function _setupUniversalSettings() {
  const helpPages = /\/help\/(?:profile|siteprefs|sidebar|randomevents)\/|\/discord\//;
  const settings = window.location.href.includes('/help/userscripts/');
  const help = helpPages.test(window.location.href);
  if (help) {
    _addSettingsLink();
  } else if (settings) {
    document.title = `Grundo's Cafe - Userscript Preferences`;
    _replaceBannerImage();
    const element = document.querySelector('main');
    if (element) {
      element.id = 'universal-userscript-preferences';
      element.innerHTML = `
        <h1>Userscript Preferences</h1>
        <nav class="center margin-1">
            <a href="/help/profile/">Edit Profile</a> |
            <a href="/help/siteprefs/">Site Preferences</a> |
            <a href="/help/sidebar/">Edit Sidebar</a> |
            <a href="/discord/">Discord</a> |
            <a href="/help/randomevents/">Random Event Log</a>
        </nav>
        <nav class="center margin-1" id="universal-userscript-navigation"><a href="/help/userscripts/">Userscript Preferences</a></nav>
        <p>Adjust settings for participating userscripts here.<br>Click on settings with an ⓘ for more details.</p>
        <div id="universal-userscript-tooltip" style="display: none; background-color: var(--grid_odd); padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); z-index: 1000; margin-bottom: 1rem; border: 1px solid var(--grid_head);"></div>
        <div class="market_grid profile prefs margin-auto">
            <div class="footer small-gap">
                <input class="form-control half-width" type="submit" value="Update Preferences" id="universal-userscript-update">
            </div>
        </div>
        `;
      document.getElementById('universal-userscript-update').addEventListener('click', () => {
        const button = document.getElementById('universal-userscript-update');

        button.disabled = true;

        const originalText = button.value;
        button.value = 'Preferences Updated!';

        setTimeout(() => {
          button.disabled = false;
          button.value = originalText;
        }, 2000);
      });
    }
  }
}

async function _checkSettingsSetup() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (document.getElementById('universal-userscript-preferences') !== null) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(true);
      }
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Timeout: universal-userscript-preferences element not found within 10 seconds'));
    }, 10000);
  });
}

if (!document.getElementById('universal-userscript-navigation')) {
  _setupUniversalSettings();
}