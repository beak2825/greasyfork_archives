// ==UserScript==
// @name            Mws Script Utils
// @namespace       https://rachpt.cn/
// @description     Custom Functions for Mws Scripts
// @version    	    1.0.3
// @author          rachpt (https://github.com/rachpt)
// @license         MIT
// @grant           none
// ==/UserScript==

var mws = new (class {
  sleep(milliseconds) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }
  async _Step(selector, callback, need_content, timeout, milliseconds) {
    while (timeout--) {
      if (document.querySelector(selector) === null) {
        await this.sleep(milliseconds);
        continue;
      } else {
        if (need_content) {
          if (document.querySelector(selector).innerText.length == 0) {
            await this.sleep(milliseconds);
            continue;
          }
        }
      }
      break;
    }

    callback(selector);
  }
  wait(selector, timeout = Infinity, milliseconds = 300, need_content = false) {
    return new Promise(resolve => {
      this._Step(
        selector,
        function (selector) {
          resolve(document.querySelector(selector));
        },
        need_content,
        timeout,
        milliseconds,
      );
    });
  }

  _ReadFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async _Img2Base64(url) {
    try {
      const imgBlob = await fetch(url).then(res => res.blob());
      return await this._ReadFileAsync(imgBlob);
    } catch (error) {
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj4gPHBhdGggZmlsbD0iIzRFNTA1NSIgZD0iTTIyNCAxMzZWMEgyNEMxMC43IDAgMCAxMC43IDAgMjR2NDY0YzAgMTMuMyAxMC43IDI0IDI0IDI0aDMzNmMxMy4zIDAgMjQtMTAuNyAyNC0yNFYxNjBIMjQ4Yy0xMy4yIDAtMjQtMTAuOC0yNC0yNHptMTYwLTE0LjF2Ni4xSDI1NlYwaDYuMWM2LjQgMCAxMi41IDIuNSAxNyA3bDk3LjkgOThjNC41IDQuNSA3IDEwLjYgNyAxNi45eiI+PC9wYXRoPiA8L3N2Zz4=';
    }
  }
  /**
   * 生成带 Badge 的网站 Icon
   * @param {string} url Icon 地址
   * @param {string} env 环境文字
   * @param {string} color 文字颜色, 默认黑色
   * @param {string} bgColor Badge背景色, 默认金色
   * @returns
   */
  async genBadgedFavicon(url, env, color = '#fff', bgColor = '#ff9800') {
    const img = await this._Img2Base64(url);
    return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <foreignObject x="0" y="0" width="100%" height="100%">
        <body xmlns="http://www.w3.org/1999/xhtml">
            <style>
                html,
                body {
                    height: 100%;
                    margin: 0;
                    text-align: center;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                strong {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    text-transform: uppercase;
                    background-color: ${bgColor};
                    color: ${color};
                    padding: 0px 1px;
                    border-radius: 2px;
                    font-size: 11px;
                    box-sizing: border-box;
                    max-width: 100%;
                    width: max-content;
                    height: 16px;
                    line-height: 16px;
                    word-break: break-all;
                    overflow: hidden;
                }
            </style>
            <strong>${env}</strong>
            <img src='${img}'></img>
        </body>
      </foreignObject>
    </svg>`
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      .replace(/#/g, '%23');
  }
})();
