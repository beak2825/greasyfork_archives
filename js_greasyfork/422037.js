// ==UserScript==
// @name         Carbon - Copy As HTML
// @namespace    https://github.com/Arriv9l/Scripts/tree/main/Carbon-Copy-As-HTML/
// @version      1.0.0
// @description  add support for Copy As HTML
// @author       Arriv9l
// @match        https://carbon.now.sh/*
// @grant        none
// @icon         https://carbon.now.sh/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/422037/Carbon%20-%20Copy%20As%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/422037/Carbon%20-%20Copy%20As%20HTML.meta.js
// ==/UserScript==

(() => {
  const AddWindowControl = false;
  const AddBorderColor = false;

  const copyRichText = (text) => {
    const listener = (ev) => {
      ev.preventDefault();
      ev.clipboardData.setData('text/html', text); // 先以 HTML 的格式保存到剪贴板
      // 但此时按下 Win+V，只会由格式问题而显示空白，让你不知道复制了什么
      ev.clipboardData.setData('text/plain', text); // 因此再以 Plain 的格式保存到剪贴板，而此时并不会覆盖 HTML 格式
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  };

  const setLineCodeP = (outerDiv, config) => {
    document.querySelectorAll('.CodeMirror-line').forEach((cmLine) => {
      const lineCodeP = document.createElement('p');
      const span = cmLine.firstChild;
      lineCodeP.innerHTML = span.innerHTML.replace(
        /class="(cm-.+?)"( style="(.+?)")?/gm,
        (match, p1, p2, p3) =>
          `style="color: ${config.tokenColors[p1]}; ${p3 || ''}"`
      );
      lineCodeP.style.margin = '0px'; // 使得 Word 段落设置中的 段前段后间距 都为 0 行
      lineCodeP.style.backgroundColor = config.backgroundColor;
      if (AddBorderColor) {
        lineCodeP.style.border = `${config.paddingHorizontal} solid ${config.borderColor}`;
      }
      outerDiv.append(lineCodeP);
    });
  };

  const addLineNumberSpan = (outerDiv, { firstLineNumber }) => {
    const maxLineNumber = parseInt(firstLineNumber, 10) + outerDiv.childNodes.length;
    const maxLength = String(maxLineNumber).length;
    outerDiv.childNodes.forEach((innerDiv, index) => {
      const lineNumberSpan = document.createElement('span');
      const lineNumberString = String(parseInt(firstLineNumber, 10) + index);
      lineNumberSpan.innerText = lineNumberString.padStart(maxLength, `\u00a0`).concat(`\u00a0`);
      lineNumberSpan.style.color = getComputedStyle(document.querySelector('.CodeMirror-code .CodeMirror-linenumber')).color;
      innerDiv.prepend(lineNumberSpan);
    });
  };

  const addWindowControl = (outerDiv, config) => {
    const svg = document.createElement('p');
    svg.style.border = `${config.paddingHorizontal} solid ${config.borderColor}`;
    svg.style.backgroundColor = config.backgroundColor;
    svg.innerText = '🟠🟡🟢';
    outerDiv.prepend(svg);
  };

  const replaceSpace = (outerDiv) => {
    outerDiv.innerHTML = outerDiv.innerHTML.replace(/ ( +|&nbsp;)/gm, (match) =>
      match.includes('&nbsp;') ? '&nbsp;&nbsp;' : '&nbsp;'.repeat(match.length)
    );
  };

  const setDivHTML = (outerDiv, config) => {
    setLineCodeP(outerDiv, config);
    if (config.lineNumbers) {
      addLineNumberSpan(outerDiv, config);
    }
    if (AddWindowControl && config.windowControls) {
      addWindowControl(outerDiv, config);
    }
    replaceSpace(outerDiv);
  };

  const getPlatform = () => {
    const { userAgent } = window.navigator;
    const isWindows = userAgent.indexOf('Windows') >= 0;
    const isMacintosh = userAgent.indexOf('Macintosh') >= 0;
    const isLinux = userAgent.indexOf('Linux') >= 0;
    return { isWindows, isMacintosh, isLinux };
  };

  const setDivStyle = (outerDiv, { fontSize }) => {
    const DEFAULT_WINDOWS_FONT_FAMILY = `Consolas, 'Courier New', monospace`;
    const DEFAULT_MAC_FONT_FAMILY = `Menlo, Monaco, 'Courier New', monospace`;
    const DEFAULT_LINUX_FONT_FAMILY = `Droid Sans Mono', 'monospace', monospace, 'Droid Sans Fallback'`;
    const platform = getPlatform();
    const fontFamily = platform.isMacintosh ? DEFAULT_MAC_FONT_FAMILY : (platform.isLinux ? DEFAULT_LINUX_FONT_FAMILY : DEFAULT_WINDOWS_FONT_FAMILY);
    outerDiv.style.fontFamily = fontFamily;
    outerDiv.style.fontSize = fontSize;
  };

  const getTokenColors = () => {
    const tokenColors = {};
    document.querySelectorAll(`[class^=cm-]`).forEach((token) => {
      const { className } = token;
      if (!tokenColors[className]) {
        tokenColors[className] = getComputedStyle(token).color;
      }
    });
    return tokenColors;
  };

  const getConfig = () => {
    const searchParams = new URLSearchParams(window.location.search); // 不需要用 .substring(1) 去掉 ?，因为 URLSearchParams 会自动去掉 ?
    return {
      tokenColors: getTokenColors(),
      borderColor: searchParams.get('bg') || getComputedStyle(document.querySelector('.bg')).backgroundColor,
      paddingHorizontal: searchParams.get('ph') || getComputedStyle(document.querySelector('.container')).paddingTop,
      fontSize: searchParams.get('fs') || getComputedStyle(document.querySelector('.CodeMirror')).fontSize,
      lineNumbers: searchParams.get('ln') === 'true' || document.querySelectorAll('.CodeMirror-code .CodeMirror-linenumber').length > 0, // bool
      firstLineNumber: searchParams.get('fl') || document.querySelector('.CodeMirror-code .CodeMirror-linenumber').innerText,
      windowControls: searchParams.get('wc') === 'true' || document.querySelectorAll('.window-controls').length > 0, // bool
      backgroundColor: getComputedStyle(document.querySelector('.CodeMirror')).backgroundColor,
    };
  };

  const copyAsHTML = ({ target }) => {
    const outerDiv = document.createElement('div');
    const config = getConfig();
    setDivHTML(outerDiv, config);
    setDivStyle(outerDiv, config);
    copyRichText(outerDiv.outerHTML);

    const originText = target.innerText;
    target.innerText = 'Copied!';
    setTimeout(() => {
      target.innerText = originText;
    }, 1000);
  };

  const getPopOut = (targetNode) =>
    new Promise((resolve) => {
      new MutationObserver((mutationsList, self) => {
        mutationsList.forEach(({ addedNodes }) => {
          addedNodes.forEach((node) => {
            if (node.className.includes('popout')) {
              self.disconnect();
              resolve(node);
            }
          });
        });
      }).observe(targetNode, { childList: true });
    });

  const copyMenuContainer = document.querySelector('.copy-menu-container');
  copyMenuContainer.querySelector('button').onclick = async () => {
    if (!copyMenuContainer.querySelector('.popout')) {
      const popOut = await getPopOut(copyMenuContainer);
      const copyRow = popOut.querySelector('.copy-row');
      const htmlButton = copyRow.lastChild.cloneNode();
      htmlButton.innerText = 'HTML';
      htmlButton.onclick = copyAsHTML;
      copyRow.append(htmlButton);
    }
  };
})();
