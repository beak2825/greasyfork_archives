// ==UserScript==
// @name         cc_log_tool
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  曹操出行日志格式转换工具
// @author       GengFei
// @match        https://nelk.caocaokeji.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caocaokeji.cn
// @require      https://cdn.jsdelivr.net/npm/@textea/json-viewer@3
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519258/cc_log_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/519258/cc_log_tool.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let list = [];

  setInterval(() => {
    const list_new = document.querySelectorAll('.kbnDocViewer__value');

    if (list.length !== list_new.length) {
      list = list_new;
      const r = [];
      list.forEach((item, i) => {
        if (
          document.querySelectorAll('.kbnDocViewer__field .euiToolTipAnchor')[i]
            .innerText === 'message'
        ) {
          r.push(item);
        }
      });

      r.forEach((item) => {
        const all = item.innerText;

        if (
          all.indexOf('req: ') > -1 &&
          item.getAttribute('cc-log-json-result') !== '1'
        ) {
          item.setAttribute('cc-log-json-result', '1');

          const [baseInfo, p1] = all
            .replace(/(\r\n|\n|\r)/gm, '')
            .split(', req: ');
          const [req, p2] = p1.split(', res: ');
          const [res, cost] = p2.split(', cost ');

          const id = 'json_' + Date.now();

          item.innerHTML =
            '<div style="display: flex;">' +
            '<div style="flex: 2; flex-shrink: 0; padding-right: 12px">' +
            all +
            '</div>' +
            '<div style="flex: 3; flex-shrink: 0;" id=' +
            id +
            '>' +
            '</div>';
          +'</div>';

          try {
            // JsonViewer 配置文档，有需要的可以自行修改，https://viewer.textea.io/apis
            new JsonViewer({
              value: {
                baseInfo,
                cost,
                req: JSON.parse(req),
                res: JSON.parse(res),
              },
              displayDataTypes: false,
              enableClipboard: true,
              objectSortKeys: true,
              maxDisplayLength: 300,
              collapseStringsAfterLength: 500,
            }).render('#' + id);
          } catch (error) {}
        }
      });
    }
  }, 100);
})();
