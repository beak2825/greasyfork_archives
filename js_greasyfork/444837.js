// ==UserScript==
// @name:zh-tw      GitLab CI/CD 部署站別分辨 - AngPao
// @name            GitLab CI/CD Deployment Site Identifier - AngPao
// @namespace       com.sherryyue.lulagitlabciloginfo
// @version         0.11
// @description:zh-tw 此腳本增強了 GitLab CI/CD 中 AngPao 專案的構建日誌，通過懸浮窗口顯示部署環境和站別訊息，使得更容易識別和區分不同的部署階段。
// @description       This script enhances the build logs in GitLab CI/CD for the AngPao project by listing log messages on a floating table that indicate the deployment environment and site. This makes it easier to identify and differentiate between various deployment stages.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           http://gitlab.lulainno.com/RedRuby/AngPao/*
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @require         https://code.jquery.com/jquery-3.6.0.js
// @require         https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444837/GitLab%20CICD%20Deployment%20Site%20Identifier%20-%20AngPao.user.js
// @updateURL https://update.greasyfork.org/scripts/444837/GitLab%20CICD%20Deployment%20Site%20Identifier%20-%20AngPao.meta.js
// ==/UserScript==

(function () {
  var variableStartLine = 0, variableEndLine = 0;
  var CI_variables = {};
  var isRaw = false;

  function translateCIVariable(key) {
    if (key === 'DEPLOY') {
      let env = '';
      if (CI_variables[key].startsWith('PROD')) env = '正式站';
      else if (CI_variables[key].startsWith('RTM')) env = 'RTM';
      else if (CI_variables[key] === 'QA') env = '測試站';
      else if (CI_variables[key] === 'RD') env = '開發站';
      else env = CI_variables[key];
      return ['環境', env];
    } else if (key === 'NAMESPACE') {
      let country = '';
      if (CI_variables[key].endsWith('thb')) country = '泰國';
      else if (CI_variables[key].endsWith('php')) country = '菲律賓';

      if (CI_variables['DEPLOY'].endsWith('TH')) country = '泰國';
      else if (CI_variables['DEPLOY'].endsWith('PHP')) country = '菲律賓';

      if (!country) country = '緬甸';
      return ['市場', country];
    } else if (key === 'NO_HOTUPDATE') {
      let icon = '';
      if (CI_variables[key] === 'true') icon = '❌'
      else icon = '✅'
      return ['熱更新', icon];
    } else if (key === 'COMMIT BRANCH') {
      let isLongString = CI_variables[key].length > 11;
      let marquee = `<marquee scrolldelay="90" scrollamount="2">${CI_variables[key]}</marquee>`;
      return ['分支', isLongString ? marquee : CI_variables[key]];
    } else if (key === 'COMMIT SHORT SHA') {
      return ['COMMIT SHA', CI_variables[key]];
    } else if (key === 'BUILD_FAILED') {
      let icon = '';
      if (CI_variables[key] === true) icon = '❌'
      else icon = '✅'
      return ['任務完成', icon];
    } else {
      return [null, null];
    }
  }

  function injectPanel(el) {
    if (document.querySelector('#yue_console')) {
      document.querySelector('#yue_console').innerHTML = '';
    }

    let html = `
<div id="yue_console"></div>
<style>
#yue_console {
  position: fixed;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  left: calc(100% - 17em);
  margin: .3rem;
  background-color: rgba(255, 255, 255, 0.6);
  font-size: .8rem;
  border: 3px solid aliceblue;
  border-radius: .5rem;
  opacity: 0;
  z-index: 999;
  transition: opacity 0.3s 0s;
}

#yue_console .line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin: .2rem;
  border-bottom: 2px solid gray;
}
#yue_console .line .key {
  width: 8em;
  padding: 0 0 0 .5rem;
  overflow-x: hidden;
  white-space: nowrap;
}
#yue_console .line .val {
  width: 6em;
  padding: 0 .5rem 0 .5rem;
  overflow-x: hidden;
  white-space: nowrap;
}
</style>
`;
    if (el.insertAdjacentHTML) {
      el.insertAdjacentHTML("beforebegin", html);
    } else {
      let range = document.createRange();
      let frag = range.createContextualFragment(html);
      el.parentNode.insertBefore(frag, el);
    }
    let panel = document.querySelector('#yue_console');
    for (let key in CI_variables) {
      let $line = document.createElement("div");
      $line.className = 'line';

      let [_key, _val] = translateCIVariable(key);
      if (_key === null) continue;
      let $key = document.createElement("div");
      $key.className = 'key';
      $key.innerText = _key;
      let $val = document.createElement("div");
      $val.className = 'val';
      $val.innerHTML = _val;
      $line.appendChild($key);
      $line.appendChild($val);
      panel.appendChild($line);
      setTimeout(() => {
        panel.style.opacity = 1;
        panel.style.top = `calc(100% - ${2 * Object.keys(CI_variables).length + 1}em)`;
      }, 10);
    }
    // log過多，此頁未載明，需要開啟raw log
    if (Object.keys(CI_variables).length === 1 || Object.keys(CI_variables).length === 2) {
      let $line = document.createElement("div");
      $line.className = 'line';
      let $key = document.createElement("div");
      $key.className = 'key';
      $key.innerText = '需要開啟raw';
      let $val = document.createElement("div");
      $val.className = 'val';
      let $link = document.createElement("a");
      $link.innerHTML = '點擊前往';
      $link.href = window.location.href + '/raw';
      $link.style.color = 'black';
      $val.appendChild($link);
      $line.appendChild($key);
      $line.appendChild($val);
      panel.appendChild($line);
      setTimeout(() => {
        panel.style.opacity = 1;
        panel.style.top = `calc(100% - ${2 * Object.keys(CI_variables).length + 5}em)`;
      }, 10);
    }
  }

  function main() {
    if (
      !document.querySelector('.build-trace-container>code') &&
      !document.querySelector('body>pre')
    ) return;
    // find whoami and variables below
    let fullLog;
    if (isRaw === true) {
      fullLog = document.querySelector('body>pre').innerHTML.split('\n');
    } else {
      fullLog = document.querySelectorAll('.build-trace-container>code .js-line.log-line');
    }
    for (let i = 0; i < fullLog.length; i++) {
      let lineTxt;
      if (isRaw === true) {
        lineTxt = fullLog[i];
      } else {
        lineTxt = fullLog[i].querySelector('span').innerText
      }
      if (lineTxt.indexOf('whoami') != -1) {
        variableStartLine = i + 2;
        break;
      }
    }
    // parse
    for (let i = variableStartLine; i < fullLog.length; i++) {
      let lineTxt;
      if (isRaw === true) {
        lineTxt = fullLog[i];
      } else {
        lineTxt = fullLog[i].querySelector('span').innerText;
      }
      let lineAnaylze = lineTxt.match(/(.+)\: (.*)/);
      if (lineAnaylze != null) {
        let key = lineAnaylze[1];
        let val = lineAnaylze[2];
        CI_variables[key] = val;
      } else {
        variableEndLine = i;
        break;
      }
    }
    // succeeded or failed
    let lastLine;
    if (isRaw === true) {
      lastLine = fullLog[fullLog.length - 1];
    } else {
      lastLine = fullLog[fullLog.length - 1].querySelector('span').innerText;
    }
    if (lastLine.indexOf('Job failed') != -1) {
      CI_variables.BUILD_FAILED = true;
    } else if (lastLine.indexOf('Job succeeded') != -1) {
      CI_variables.BUILD_FAILED = false;
    }

    injectPanel(document.body);
    $("#yue_console").draggable();
  }

  let observer = new MutationObserver((mutations, obs) => {
    if (!document.querySelector(".build-trace-container>code .js-line.log-line")) return;
    main();
    observer.disconnect();
  });

  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true
  });

  if (window.location.href.endsWith('/raw')) {
    isRaw = true;
    main();
  }

  document.getElementsByTagName('head')[0].append(
    '<link '
    + 'href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css" '
    + ' type="text/css">'
  );
})();