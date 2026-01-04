// ==UserScript==
// @name         version-notes-auto-fill
// @namespace    cyzeng
// @version      1.0
// @description  gitlab-helper
// @author       You
// @match        https://code.int.ankerjiedian.com/*tags/new
// @match        https://code.int.jiediankeji.com/*tags/new
// @match        https://gitlab.int.zhumanggroup.com/*tags/new
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454564/version-notes-auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/454564/version-notes-auto-fill.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /**
   * @description 自动填充版本号
   * @author cyzeng
   * @date 09/11/2022
   * @param {*} e iteration为大版本+1，patch为小版本+1
   */
  function autoWrite(e) {
    const {
      data: { type, version },
    } = e;

    // 目前项目有2种格式：
    // 1、2.32.0
    // 2、5.340
    let resultVersion = '';
    switch (version.split('.').length) {
      case 2:
        const temporary = version.match(/\d+/g);
        const middle = temporary[1].split('');
        const final = middle.pop();
        let standard = [];
        if (type === 'iteration') {
          standard = [
            getNextVersion([temporary[0], middle.join('')].join('.'), 100),
            0,
          ].join('.');
        } else {
          standard = getNextVersion(
            [temporary[0], middle.join(''), final].join('.'),
            10
          );
        }
        const config = standard.split('.');

        // 针对于v5.340的情况，如果是v5.99.0，99+1的情况，getNextVersion只会返回一个0，所以
        // 需要自主补0
        let validateValue = [
          config.shift(),
          config.join('') === '00' ? '000' : config.join(''),
        ].join('.');

        resultVersion = validateValue;
        break;
      case 3:
        if (type === 'iteration') {
          // 大版本迭代，除去末尾版本号
          const temporary = version.match(/\d+/g);
          temporary.pop();
          resultVersion = [getNextVersion(temporary.join('.'), 100), 0].join(
            '.'
          );
        } else {
          resultVersion = getNextVersion(version, 10);
        }
        break;
      default:
        alert(`请检查版本号，获取版本号为:${versionClone}`);
        break;
    }

    $('#tag_name').val(`v${resultVersion}`).trigger('change');
  }

  /**
   * @description  版本号自增
   * @author cyzeng
   * @date 10/11/2022
   * @param {*} version
   * @param {*} level 表示按照100进位还是按照10进位
   * @return {*}
   */
  function getNextVersion(version, level) {
    // 目前项目有2种格式：
    // 1、2.32.0
    // 2、5.340
    const versionList = version.match(/\d+/g);

    const next = parseInt(versionList.pop()) + 1;
    if (next === level) {
      return [getNextVersion(versionList.join('.'), 100), 0].join('.');
    } else {
      versionList.push(next);
      return versionList.join('.');
    }
  }

  fetch(location.href.split('/new')[0])
    .then((response) => response.text())
    .then((text) => {
      /**
       * @description 版本号自增功能
       * @author cyzeng
       * @date 11/11/2022
       */
      // step1：提取第一个版本号的text
      const html = text.match(/<a class="item-title ref-name".*<\/a>/)[0];

      // step2：去掉样式代码，获取标签内容
      const content = html.replace(/<[^>]+>/g, '');

      function versionFunction() {
        // step3：根据不同项目初始化版本号
        const version = content.replace(/[^\d\.]/gi, '');

        // step4：在页面中生成按钮并绑定事件
        const buttonGroup = `
            <span class="btn btn-success new-tag-btn" id="iteration">大版本</span>
            <span class="btn btn-success new-tag-btn" id="patch">小版本</span>
            <span class="btn btn-success new-tag-btn" id="weapp">微信后缀</span>
            <span class="btn btn-success new-tag-btn" id="alipay">支付宝后缀</span>
            <span class="btn btn-success new-tag-btn" id="all">all</span>`;
        const temporary = document.createElement('div');
        temporary.innerHTML = buttonGroup;

        $('.page-title').after(temporary);
        $('#iteration').on('click', { type: 'iteration', version }, autoWrite);
        $('#patch').on('click', { type: 'patch', version }, autoWrite);
        $('#weapp').on('click', () => {
          $('#tag_name')
            .val(`${$('#tag_name').val()}-weapp`)
            .trigger('change');
        });
        $('#alipay').on('click', () => {
          $('#tag_name')
            .val(`${$('#tag_name').val()}-alipay`)
            .trigger('change');
        });
        $('#all').on('click', () => {
          $('#tag_name')
            .val(`${$('#tag_name').val()}-all`)
            .trigger('change');
        });
      }

      fetch(`${location.href.split('/new')[0]}/${content}`)
        .then((response) => response.text())
        .then((text) => {
          /**
           * @description Release notes自动带入功能
           * @author cyzeng
           * @date 11/11/2022
           */
          function tipsFunction() {
            // step1：提取Release notes
            const notes = text
              .match(/<ul data-sourcepos.*<\/ul>/)[0]
              .trim()
              .split('&#x000A;');
            notes.pop();
            notes.shift();

            // step2：提取nodes的关键信息，并且分组
            let list = [];
            for (let i = 0; i < notes.length; i++) {
              const href = notes[i].match(/(?<=href=").*?(?=")/)[0];
              const child = notes[i].replace(/<[^>]+>/g, 'tt').split('tt');
              child[1] = child[1].slice(0, -1);
              child[3] = child[3].slice(1);
              list.push(`- ${child[1]}【[${child[2]}](${href})】${child[3]}`);
            }
            // step3：merge list中的信息
            const result = list.join('\n');

            // step4：自动填充
            $('#release_description').val(result).trigger('change');
          }

          tipsFunction();
        });

      versionFunction();
    });
})();
