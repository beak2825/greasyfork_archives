// ==UserScript==
// @name VM detector
// @name:en VM detector
// @name:zh-CN 暴力猴嗅探器
// @namespace https://violentmonkey.github.io
// @description Detector installation status for scripts on Violentmonkey.
// @description:en Detector installation status for scripts on Violentmonkey.
// @description:zh-CN 检测脚本在暴力猴上的安装状态。
// @version 1.0.1
// @author Gerald <i@gerald.top>
// @match https://greasyfork.org/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/418696/VM%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/418696/VM%20detector.meta.js
// ==/UserScript==

initialize();

function initialize() {
  if (!check()) return;

  const $ = selector => document.querySelector(selector);
  const button = $('.install-link');
  if (!button) return;

  const name = button.dataset.scriptName;
  const namespace = button.dataset.scriptNamespace;
  const version = button.dataset.scriptVersion;
  external.Violentmonkey.isInstalled(name, namespace)
  .then(result => {
    if (result) {
      const compare = compareVersions(result, version);
      if (compare < 0) {
        button.textContent = button.dataset.updateLabel;
      } else if (compare > 0) {
        button.textContent = button.dataset.downgradeLabel;
      } else {
        button.textContent = button.dataset.reinstallLabel;
      }
    }
  });
}

function check() {
  const warn = message => {
    console.warn('[VM detector]', message);
  };
  if (GM_info.scriptHandler !== 'Violentmonkey') {
    warn('This script only works for Violentmonkey.');
    return false;
  }
  if (!external.Violentmonkey) {
    warn('This script requires Violentmonkey 2.6.4+.');
    return false;
  }
  return true;
}

function compareVersions(a, b) {
  const va = a.split('.').map(i => +i);
  const vb = b.split('.').map(i => +i);
  for (let i = 0; i < va.length || i < vb.length; i++) {
    const ua = va[i];
    const ub = vb[i];
    if ((ua || ub) && (ua !== ub)) {
      return ua && (!ub || ua > ub) ? 1 : -1;
    }
  }
  return 0;
}
