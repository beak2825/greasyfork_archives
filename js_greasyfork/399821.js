// ==UserScript==
// @name         npm_plus
// @namespace    npm_plus
// @description  增强 npm 的搜索体验, 添加下载和 github 直链, 使用 npms.io 的数据替换 npm 评分
// @version      1.0.0
// @author       roojay
// @license      http://opensource.org/licenses/MIT

// @include      *://*npmjs.com/search*
// @run-at       document-end

// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest

// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @noframes
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/399821/npm_plus.user.js
// @updateURL https://update.greasyfork.org/scripts/399821/npm_plus.meta.js
// ==/UserScript==

GM_addStyle(`
  .github-icon {
    width: 12px;
    height: 12px;
    fill: rgba(0, 0, 0, 0.45);
  }
  .download-number {
    color: #d14;
    font-size: 12px;
    font-weight: normal;
    font-family: Arial;
    font-style: italic;
  }
  .download-icon {
    width: 8px;
    height: 12px;
    fill: rgba(0, 0, 0, 0.45);
  }
  .npm-plus-title-wrap {
    position: relative;
    flex: 1;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
  }
  .npm-plus-title-wrap > span {
    margin-left: 8px;
  }
  .score-number-wrap {
    position: relative;
  }
  .score-icon {
    position: relative;
    width: 26px;
    height: 26px;
    float: left;
    cursor: default;
    fill: rgb(95, 149, 122);
    overflow: hidden;
  }
  .score-number {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 12px;
    font-weight: 900;
    align-items: center;
    font-family: Arial;
  }
`);

$(function() {
  // 包列表
  const DOM_PACKAGE_LIST = 'div.ph3.pt2-ns';
  // 单个包
  const DOM_PACKAGE_ITEM = 'section.flex.pl1-ns';
  // 包信息
  const DOM_PACKAGE_INFO = 'div.w-80';
  // 包评分
  const DOM_PACKAGE_SCORE = 'div.w-20';
  // 包名容器
  const DOM_PACKAGE_TITLE_WRAP = '.flex.flex-row.items-end.pr3'
  // 包名链接
  const DOM_PACKAGE_LINK = '.flex-row a';

  const API_NPMS = 'https://api.npms.io/v2'
  const API_NPM_REGISTRY = 'https://registry.npmjs.org';

  const ICON_SCORE = '<svg class="score-icon" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 212 212"> <polygon points="106 9 128 0 145 17 169 18 177 41 199 51 197 75 212 93 201 114 208 137 189 152 186 176 162 182 150 202 126 198 106 212 86 198 63 202 50 182 27 176 24 152 5 137 11 114 0 93 16 75 14 51 35 41 43 18 67 17 84 0 106 9"></polygon> </svg>';
  const ICON_DOWNLOAD = '<svg class="download-icon" viewBox="0 0 7.22 11.76"><title>Downloads</title><g><polygon points="4.59 4.94 4.59 0 2.62 0 2.62 4.94 0 4.94 3.28 9.53 7.22 4.94 4.59 4.94"></polygon><rect x="0.11" y="10.76" width="7" height="1"></rect></g></svg>';
  const ICON_GITHUB = '<svg class="github-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57 4.801-1.574 8.236-6.074 8.236-11.369 0-6.627-5.373-12-12-12"/></svg>';

  function initScript() {
    const observer = new MutationObserver((mutations, observer) => runAll());
    observer.observe(document.querySelector(DOM_PACKAGE_LIST), {
      childList: true, // 子节点的变动
      attributes: false, // 属性的变动
      characterData: true, // 节点内容或节点文本的变动
      subtree: false // 是否将该观察器应用于该节点的所有后代节点
    });
    runAll();
  }

  const renderGithub = (_githubUrl) => `
    <span>
      <a href="${_githubUrl}" target="_blank">${ICON_GITHUB}</a>
    </span>
  `;
  const renderDownload = (_downloadUrl, _downloadNumber) => `
    <span>
      <a href="${_downloadUrl}">${ICON_DOWNLOAD}</a>
      <span class="download-number">${_downloadNumber}</span>
    </span>
  `;
  const renderScore = (_score) => `
    <span class="score-number-wrap"> ${ICON_SCORE}
      <span class="score-number">${_score}</span>
    </span>
  `;

  /**
   * 获取包的详细信息
   * @param {string} packageUrl
   * @param {jQuery object} titleWrap
   */
  async function getPackageDetails(packageUrl, titleWrap) {
    const fullName = packageUrl.replace('/package/', '');
    const _url = `${API_NPMS}/package/${encodeURIComponent(fullName)}`;
    const name = fullName.split('/').slice(-1)[0];
    GM_xmlhttpRequest({
      url: _url,
      method: 'get',
      onload: function(xhr) {
        try {
          const res = JSON.parse(xhr.response);
          const downNum = res.collected.npm.downloads.slice(-1)[0].count;
          const scoreNum = ~~(res.score.final * 100);
          const version = res.collected.metadata.version;
          const githubUrl = res.collected.metadata.links.repository;
          const downLoadUrl = `${API_NPM_REGISTRY}/${fullName}/-/${name}-${version}.tgz`;

          const toolWrap = `
            <span class="npm-plus-title-wrap">
              ${githubUrl ? renderGithub(githubUrl) : ''}
              ${renderDownload(downLoadUrl, downNum)}
              ${renderScore(scoreNum)}
            </span>
          `;
          titleWrap.append(toolWrap);
        } catch (e) {
          console.log('getPackageDetails -> e', e);
        }
      }
    });
  }
  // 执行所有替换方法
  async function runAll() {
    const promises = $(DOM_PACKAGE_ITEM).map((index, val) => {
      const $this = $(val);
      // 去掉右侧原有评分
      $this.find(DOM_PACKAGE_SCORE).remove();
      $this.find(DOM_PACKAGE_INFO).removeClass('w-80').addClass('w-100');
      const packageUrl = $this.find(DOM_PACKAGE_LINK).attr('href');
      const titleWrap = $this.find(DOM_PACKAGE_TITLE_WRAP);
      return getPackageDetails(packageUrl, titleWrap);
    });
    Promise.all(promises);
  }

  initScript();
});
