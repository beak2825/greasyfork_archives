// ==UserScript==
// @name         lads-verda-extension
// @version      1.1.0
// @description  LADS Verda Extension
// @author       Busung Kim
// @match        https://verda2.linecorp.com/projects/*/servers/**
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_addElement
// @license      MIT

// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/495957/lads-verda-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/495957/lads-verda-extension.meta.js
// ==/UserScript==
(function() {
  'use strict';

  setInterval(() => {
    if (document.getElementById('custom-rebuild-button')) {
      return;
    }

    const buttonGroupElement = document.getElementsByClassName('btns-wrap right-type')[0];
    const dataKey = buttonGroupElement.children[0].children[0].getAttributeNames()[0];
    const liElement = GM_addElement('li', {});
    buttonGroupElement.insertBefore(liElement, buttonGroupElement.firstChild);

    const buttonElement = GM_addElement(liElement, 'button', {
      type: 'button',
      class: 'vk-button vk-button--el-button vk-button--danger vk-button--small',
      [dataKey]: ''
    });

    if (window.location.href.includes('/servers/physical-instances')) {
      buttonElement.onclick = async () => {
        await rebuildPMs(getCheckedServerNames());
      };
    } else if (window.location.href.includes('/servers/instances')) {
      buttonElement.onclick = async () => {
        await rebuildVMs(getCheckedInstanceIds());
      };
    }

    const spanElement = GM_addElement(buttonElement, 'span', {
      id: 'custom-rebuild-button',
      class: 'vk-button__text',
      textContent: 'Rebuild to Rocky 8.9',
      [dataKey]: ''
    });
  }, 1_000);
})();

function getCheckedServerNames() {
  return Array.from(document.getElementsByClassName('vk-table__row'))
    .filter(row => row.children[0].querySelector('td > div > input').checked)
    .map(row => row.children[1].querySelector('td > div > a').innerText.trimRight())
}

async function rebuildPMs(targetServerNames = []) {
  const sortedTargetServerNames = targetServerNames.toSorted();

  if (!confirm(`Are you sure to rebuild ${sortedTargetServerNames.length} servers?\n${sortedTargetServerNames.join('\n')}`)) {
    return;
  }

  const authToken = sessionStorage.getItem("Verda-session/vrd_prod_token");
  const allDone = await Promise.all(sortedTargetServerNames.map((serverName) =>
    fetch(`/api/servers/v1/pm/instances/${serverName}/action?vbq_region=tokyo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken
      },
      body: '{"type":"reinstall","os":"Rocky Linux 8.9"}'
    })));
  console.log('Done. Please refresh the page.', allDone);
  location.reload();
}

function getCheckedInstanceIds() {
  return Array.from(document.getElementsByClassName('vk-table__row'))
    .filter(row => row.children[0].querySelector('td > div > input').checked)
    .map(row => row.children[1].querySelector('td > div > a').getAttribute('href'))
    .map(href => href.split('/'))
    .map(tokens => tokens[tokens.length-1]);
}

async function rebuildVMs(targetInstanceIds = []) {
  if (!confirm(`Are you sure to rebuild ${targetInstanceIds.length} instances?\n${targetInstanceIds.join('\n')}`)) {
    return;
  }

  const authToken = sessionStorage.getItem("Verda-session/vrd_prod_token");
  const allDone = await Promise.all(targetInstanceIds.map((instanceId) =>
    fetch(`/api/servers/v1/vm/instances/${instanceId}/action?vbq_region=tokyo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken
      },
      body: '{"rebuild":{"imageRef":"ebfca000-fba1-4cc7-a9b2-8034f9c4d9ed"}}'
    })));
  console.log('Done. Please refresh the page.', allDone);
  location.reload();
}

/*
async function showAllPMsInfo(targetServerNames = []) {
  const sortedTargetServerNames = targetServerNames.toSorted();

  if (!confirm(`Are you sure to show ${sortedTargetServerNames.length} servers?\n${sortedTargetServerNames.join('\n')}`)) {
    return;
  }

  const authToken = sessionStorage.getItem("Verda-session/vrd_prod_token");
  const allDone = await Promise.all(sortedTargetServerNames.map((serverName) =>
    fetch(`/api/servers/v1/pm/instances/${serverName}?vbq_region=tokyo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken
      },
    })));
  console.log('Done. Please refresh the page.', allDone);
}
*/