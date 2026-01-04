// ==UserScript==
// @name            图片全局模糊
// @namespace       https://greasyfork.org/zh-CN/users/1361855-fourth-master
// @version         1.0.1
// @description     一个用于给网站图片添加模糊效果的油猴脚本
// @author          Fourth_Master
// @match           *://*/*
// @require         https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/arrive/2.4.1/arrive.min.js
// @require         https://greasyfork.org/scripts/403716-gm-config-cn/code/GM_config_CN.js
// @grant           GM_info
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @run-at          document-start
// @noframes
// @license         GNU General Public License v3.0 or later
// @namespace       https://greasyfork.org/scripts/531690
// @supportURL      https://greasyfork.org/scripts/531690
// @homepageURL     https://greasyfork.org/scripts/531690
// @downloadURL https://update.greasyfork.org/scripts/531690/%E5%9B%BE%E7%89%87%E5%85%A8%E5%B1%80%E6%A8%A1%E7%B3%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/531690/%E5%9B%BE%E7%89%87%E5%85%A8%E5%B1%80%E6%A8%A1%E7%B3%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 获取更新时间
  function getUpdateTime(timestamp) {
    return timestamp ? (' (更新于: ' + new Date(timestamp).toLocaleDateString() + ')') : '';
  }

  const style = {
    // 设置面板样式
    settings: `
#myGoodBoyConfig {
  --primary: #4A90E2;
  --text: #333;
  --bg: #FFF;
  --border: #E0E0E0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

#myGoodBoyConfig .section_header {
  padding: 1rem;
  background: var(--primary);
  border-radius: 0.4rem;
}

#myGoodBoyConfig input[type="checkbox"] {
  width: 1.2em;
  height: 1.2em;
}

#myGoodBoyConfig button {
  padding: 0.6em 1.2em;
  border-radius: 0.4em;
  transition: opacity 0.2s;
}

#myGoodBoyConfig button:hover {
  opacity: 0.9;
}
`,
  };

  // 初始化配置
  GM_config.init({
      'id': 'myGoodBoyConfig',
      'title': GM_config.create('a', {
        'textContent': '图片全局模糊-设置 ver.' + GM_info.script.version,
        'title': '点击跳转到脚本页面' + getUpdateTime(GM_info.script.lastModified),
        'target': '_blank',
        'href': 'https://sleazyfork.org/zh-CN/scripts/531690',
      }),
      'skin': 'tab',
      'css': style.settings,
      'frameStyle': {
        'width': '400px',
        'height': '350px',
      },
      'fields': {
          'blurEnable': {
            'section': GM_config.create('a', {
              textContent: '作者: Fourth_Master',
              title: '点击反馈问题',
              target: '_blank',
              href: 'https://blog.soeg.cn/',
            }),
              'label': '启用图片模糊效果',
              'type': 'checkbox',
              'default': false
          },
          'blurRadius': {
              'label': '模糊半径',
              'type': 'int',
              'min': 1,
              'max': 20,
              'default': 10
          }
      }
  });

  // 添加模糊效果
  function applyBlurEffect() {
      if (!GM_config.get('blurEnable')) return;

      const blurRadius = GM_config.get('blurRadius');
      const style = `
          img {
              filter: blur(${blurRadius}px);
              transition: filter 0.3s;
          }
          img:hover {
              filter: blur(0);
          }
      `;

      GM_addStyle(style);
  }

  // 注册菜单命令
  GM_registerMenuCommand('图片全局模糊 - 设置', () => GM_config.open());

  // 初始化
  applyBlurEffect();
})();