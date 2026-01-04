// ==UserScript==
// @name         谷歌免翻qiang inspect调试
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       Tate
// @match        chrome://inspect/#devices*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/396862/%E8%B0%B7%E6%AD%8C%E5%85%8D%E7%BF%BBqiang%20inspect%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/396862/%E8%B0%B7%E6%AD%8C%E5%85%8D%E7%BF%BBqiang%20inspect%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

/* 打开chrome://inspect/#devices ，按f12，复制以下代码在console控制台粘贴执行 */

function populateRemoteTargets(devices) {
  if (!devices) {
    return;
  }

  if ($('config-dialog').open) {
    window.holdDevices = devices;
    return;
  }

  function browserCompare(a, b) {
    if (a.adbBrowserName != b.adbBrowserName) {
      return a.adbBrowserName < b.adbBrowserName;
    }
    if (a.adbBrowserVersion != b.adbBrowserVersion) {
      return a.adbBrowserVersion < b.adbBrowserVersion;
    }
    return a.id < b.id;
  }

  function insertBrowser(browserList, browser) {
    for (let sibling = browserList.firstElementChild; sibling;
         sibling = sibling.nextElementSibling) {
      if (browserCompare(browser, sibling)) {
        browserList.insertBefore(browser, sibling);
        return;
      }
    }
    browserList.appendChild(browser);
  }

  const deviceList = $('devices-list');
  if (alreadyDisplayed(deviceList, devices)) {
    return;
  }

  function removeObsolete(validIds, section) {
    if (validIds.indexOf(section.id) < 0) {
      section.remove();
    }
  }

  const newDeviceIds = devices.map(function(d) {
    return d.id;
  });
  Array.prototype.forEach.call(
      deviceList.querySelectorAll('.device'),
      removeObsolete.bind(null, newDeviceIds));

  $('devices-help').hidden = !!devices.length;

  for (let d = 0; d < devices.length; d++) {
    const device = devices[d];

    let deviceSection = $(device.id);
    if (!deviceSection) {
      deviceSection = document.createElement('div');
      deviceSection.id = device.id;
      deviceSection.className = 'device';
      deviceList.appendChild(deviceSection);

      const deviceHeader = document.createElement('div');
      deviceHeader.className = 'device-header';
      deviceSection.appendChild(deviceHeader);

      const deviceName = document.createElement('div');
      deviceName.className = 'device-name';
      deviceHeader.appendChild(deviceName);

      const deviceSerial = document.createElement('div');
      deviceSerial.className = 'device-serial';
      const serial = device.adbSerial.toUpperCase();
      deviceSerial.textContent = '#' + serial;
      deviceHeader.appendChild(deviceSerial);

      if (serial === WEBRTC_SERIAL) {
        deviceHeader.classList.add('hidden');
      }

      const devicePorts = document.createElement('div');
      devicePorts.className = 'device-ports';
      deviceHeader.appendChild(devicePorts);

      const browserList = document.createElement('div');
      browserList.className = 'browsers';
      deviceSection.appendChild(browserList);

      const authenticating = document.createElement('div');
      authenticating.className = 'device-auth';
      deviceSection.appendChild(authenticating);
    }

    if (alreadyDisplayed(deviceSection, device)) {
      continue;
    }

    deviceSection.querySelector('.device-name').textContent = device.adbModel;
    deviceSection.querySelector('.device-auth').textContent =
        device.adbConnected ? '' :
                              'Pending authentication: please accept ' +
            'debugging session on the device.';

    const browserList = deviceSection.querySelector('.browsers');
    const newBrowserIds = device.browsers.map(function(b) {
      return b.id;
    });
    Array.prototype.forEach.call(
        browserList.querySelectorAll('.browser'),
        removeObsolete.bind(null, newBrowserIds));

    for (let b = 0; b < device.browsers.length; b++) {
      const browser = device.browsers[b];
      const majorChromeVersion = browser.adbBrowserChromeVersion;
      let pageList;
      let browserSection = $(browser.id);
      const browserNeedsFallback =
          isVersionNewerThanHost(browser.adbBrowserVersion);
      if (browserSection) {
        pageList = browserSection.querySelector('.pages');
      } else {
        browserSection = document.createElement('div');
        browserSection.id = browser.id;
        browserSection.className = 'browser';
        insertBrowser(browserList, browserSection);

        const browserHeader = document.createElement('div');
        browserHeader.className = 'browser-header';

        const browserName = document.createElement('div');
        browserName.className = 'browser-name';
        browserHeader.appendChild(browserName);
        browserName.textContent = browser.adbBrowserName;
        if (browser.adbBrowserVersion) {
          browserName.textContent += ' (' + browser.adbBrowserVersion + ')';
        }
        if (browser.adbBrowserUser) {
          const browserUser = document.createElement('div');
          browserUser.className = 'browser-user';
          browserUser.textContent = browser.adbBrowserUser;
          browserHeader.appendChild(browserUser);
        }
        browserSection.appendChild(browserHeader);

        if (browserNeedsFallback) {
          const browserFallbackNote = document.createElement('div');
          browserFallbackNote.className = 'browser-fallback-note';
          browserFallbackNote.textContent =
              '\u26A0 Remote browser is newer than client browser. ' +
              'Try `inspect fallback` if inspection fails.';
          browserSection.appendChild(browserFallbackNote);
        }

        if (majorChromeVersion >= MIN_VERSION_NEW_TAB) {
          const newPage = document.createElement('div');
          newPage.className = 'open';

          const newPageUrl = document.createElement('input');
          newPageUrl.type = 'text';
          newPageUrl.placeholder = 'Open tab with url';
          newPage.appendChild(newPageUrl);

          const openHandler = function(sourceId, browserId, input) {
            sendCommand(
                'open', sourceId, browserId, input.value || 'about:blank');
            input.value = '';
          }.bind(null, browser.source, browser.id, newPageUrl);
          newPageUrl.addEventListener('keyup', function(handler, event) {
            if (event.key == 'Enter' && event.target.value) {
              handler();
            }
          }.bind(null, openHandler), true);

          const newPageButton = document.createElement('button');
          newPageButton.textContent = 'Open';
          newPage.appendChild(newPageButton);
          newPageButton.addEventListener('click', openHandler, true);

          browserHeader.appendChild(newPage);
        }

        const portForwardingInfo = document.createElement('div');
        portForwardingInfo.className = 'used-for-port-forwarding';
        portForwardingInfo.hidden = true;
        portForwardingInfo.title = 'This browser is used for port ' +
            'forwarding. Closing it will drop current connections.';
        browserHeader.appendChild(portForwardingInfo);

        if (browserInspector) {
          const link = document.createElement('span');
          link.classList.add('action');
          link.setAttribute('tabindex', 1);
          link.textContent = browserInspectorTitle;
          browserHeader.appendChild(link);
          link.addEventListener(
              'click',
              sendCommand.bind(
                  null, 'inspect-browser', browser.source, browser.id,
                  browserInspector),
              false);
        }

        pageList = document.createElement('div');
        pageList.className = 'list pages';
        browserSection.appendChild(pageList);
      }

      if (!alreadyDisplayed(browserSection, browser)) {
        pageList.textContent = '';
        for (let p = 0; p < browser.pages.length; p++) {
          const page = browser.pages[p];
          // Attached targets have no unique id until Chrome 26. For such
          // targets it is impossible to activate existing DevTools window.
          page.hasNoUniqueId = page.attached && majorChromeVersion &&
              majorChromeVersion < MIN_VERSION_TARGET_ID;
          const row = addTargetToList(page, pageList, ['name', 'url']);
          if (page['description']) {
            addWebViewDetails(row, page);
          } else {
            addFavicon(row, page);
          }
          if (majorChromeVersion >= MIN_VERSION_TAB_ACTIVATE) {
            addActionLink(
                row, 'focus tab',
                sendTargetCommand.bind(null, 'activate', page), false);
          }
          if (majorChromeVersion) {
            addActionLink(
                row, 'reload', sendTargetCommand.bind(null, 'reload', page),
                page.attached);
          }
          if (majorChromeVersion >= MIN_VERSION_TAB_CLOSE) {
            addActionLink(
                row, 'close', sendTargetCommand.bind(null, 'close', page),
                false);
          }
          if (browserNeedsFallback || true) {
            addActionLink(
                row, '免翻墙inspect',
                sendTargetCommand.bind(null, 'inspect-fallback', page),
                page.hasNoUniqueId || page.adbAttachedForeign);
          }
        }
      }
      updateBrowserVisibility(browserSection);
    }
    updateUsernameVisibility(deviceSection);
  }
}