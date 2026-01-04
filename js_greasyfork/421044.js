// ==UserScript==
// @name         Ranta femp
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  try to take over the world!
// @author       You
// @match        http://femp.qima-inc.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421044/Ranta%20femp.user.js
// @updateURL https://update.greasyfork.org/scripts/421044/Ranta%20femp.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function init() {
    const $body = $('body');
    const $div = $('<div id="monkey-view"></div>');
    $div.css({
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
    });
    const $textarea = $('<textarea id="local"></textarea>');
    $textarea.css({
      display: 'none',
      width: '50vw',
      height: '50vh',
      'overflow-y': 'auto',
    });
    const $btn1 = $('<button id="update-button">修改远端配置</button>');
    $btn1.css({
      width: '100px',
      height: '50px',
      'text-align': 'center',
    });
    $btn1.click(updateConfig);
    const $btn2 = $('<button id="config-button">toggle配置面板</button>');
    $btn2.css({
      width: '120px',
      height: '50px',
      'text-align': 'center',
      'margin-left': '10px',
    });
    $btn2.click(toggleTextarea);
    $div.append($btn1).append($btn2).append($textarea);
    $body.append($div);
  }

  function getLatestExtensionId(moduleId) {
    return fetch(
      'http://femp.qima-inc.com/api/extension/' + encodeURIComponent(moduleId),
      {
        headers: {
          contentType: 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          const { type, name: moduleId, extensionHistory = [] } =
            res.data || {};
          const { id: extensionId, semVersion: version, content } =
            extensionHistory[0] || {};
          const { source } = JSON.parse(content);
          return {
            type,
            source,
            version,
            moduleId,
            extensionId,
          };
        }
        throw new Error(`获取${moduleId}远端配置异常`);
      });
  }

  function toggleTextarea() {
    $('#local').toggle();
  }

  function updateConfig() {
    const $textarea = $('#local');
    const localConfigStr = $textarea.val();
    const localConfig = JSON.parse(localConfigStr);
    const localExtensions = localConfig.extensions.filter(
      (extension) => extension.name === extension.extensionId
    );
    const localModules = localConfig.modules.filter(
      (module) => module.moduleId === module.extensionId
    );
    Promise.all(
      localModules.map((module) => getLatestExtensionId(module.moduleId))
    ).then((resArr) => {
      resArr.forEach((res) => {
        const { source, type, version, moduleId, extensionId } = res;
        const curModule = localModules.find(
          (module) => module.moduleId === moduleId
        );
        const curExtension = localExtensions.find(
          (extension) => extension.name === moduleId
        );

        curModule.extensionId = extensionId;
        curExtension.version = version;
        curExtension.extensionId = extensionId;
        curExtension.source = source;
        if (type === 'TEE') {
          curExtension.bundle = '';
        }
      });

      $textarea.val(JSON.stringify(localConfig, null, 2));
      alert('更新成功');
    });
  }

  init();
})();
