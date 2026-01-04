// ==UserScript==
// @name              鼠标取词获取翻译
// @namespace         https://greasyfork.org/zh-CN/users/323663
// @version           1.0.9
// @description       应用于国际化非标项目，实现鼠标取词获取starling平台上对应的key。
// @match             *://ads.tiktok.com/int*
// @match             test-ads.tiktok.com/int*
// @match             dev.ads.tiktok.com/int*
// @connect           starling.snssdk.com
// @grant             GM_xmlhttpRequest
// @author            zhoubingling
// @supportURL        https://code.byted.org/zhoubingling.3365/findid-helper
// @downloadURL https://update.greasyfork.org/scripts/388204/%E9%BC%A0%E6%A0%87%E5%8F%96%E8%AF%8D%E8%8E%B7%E5%8F%96%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/388204/%E9%BC%A0%E6%A0%87%E5%8F%96%E8%AF%8D%E8%8E%B7%E5%8F%96%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
(function() {
  var res = {
    '中': null,
    '日': null,
    '英': null
  };
  var handleContainer = {
    timer: null,
    currDom: [],
    messageList: [],
    createContainer: function() {
      const container = document.createElement("div");
      container.setAttribute(
        "style",
        "" +
          "position:absolute!important;" +
          "font-size:13px!important;" +
          "overflow:auto!important;" +
          "background:#fff!important;" +
          "font-family:sans-serif,Arial!important;" +
          "font-weight:normal!important;" +
          "text-align:left!important;" +
          "color:#000!important;" +
          "padding:0.5em 1em!important;" +
          "line-height:1.5em!important;" +
          "border-radius:5px!important;" +
          "border:1px solid #ccc!important;" +
          "box-shadow:4px 4px 8px #888!important;" +
          "max-width:280px!important;" +
          "max-height:216px!important;" +
          "z-index:2147483647!important;" +
          ""
      );
      this.currDom.push(container);
      return container;
    },
    destroyContainer: function() {
      if (this.currDom.length) {
        this.currDom.forEach((el) => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        })
        this.currDom = [];
      }
    }
  };
  function findReact(dom) {
    let key = Object.keys(dom).find(key =>
      key.startsWith("__reactInternalInstance$")
    );
    let internalInstance = dom[key];
    if (internalInstance == null) return null;

    if (internalInstance.return) {
      // react 16+
      return internalInstance._debugOwner
        ? internalInstance._debugOwner.stateNode
        : internalInstance.return.stateNode;
    } else {
      // react <16
      return internalInstance._currentElement._owner._instance;
    }
  }
  function ajax(url, method, headers) {
    if (!!!method) method = "GET";
    // >>>因为Tampermonkey跨域访问(a.com)时会自动携带对应域名(a.com)的对应cookie
    // 不会携带当前域名的cookie
    // 所以，GM_xmlhttpRequest【不存在】cookie跨域访问安全性问题
    // 以下设置默认headers不起作用<<<
    if (!!!headers) headers = { cookie: "" };
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: headers,
        onload: function(res) {
          return resolve(res.responseText);
        },
        onerror: function(res) {
          alert("连接Starling失败，请检查是否已连接内网，或刷新页面重试");
          reject("连接Starling失败");
        }
      });
    });
  }

  window.onload = () => {
    if (!handleContainer.messageList.length) {
        const starlingUrlList = [
          "https://starling.snssdk.com/text/7de818a0398f11e9bcb4d1ecac621e3e/index/zh",
          "https://starling.snssdk.com/text/7de818a0398f11e9bcb4d1ecac621e3e/index/ja",
          "https://starling.snssdk.com/text/7de818a0398f11e9bcb4d1ecac621e3e/index/en"
        ];
        for (let i=0; i<starlingUrlList.length; i++) {
          ajax(starlingUrlList[i]).then(resText => {
            let trs = JSON.parse(resText);
            let checkLang = starlingUrlList[i].split('/').pop();
            if (checkLang === 'zh') {
              res['中'] = trs;
            } else if (checkLang === 'ja') {
              res['日'] = trs;
            } else {
              res['英'] = trs;
            }
            handleContainer.messageList.push(trs);
          });
        };
      }
  }

  document.onmouseout = (e) => {
    if (handleContainer.currDom.length) {
      const len = handleContainer.currDom.length;
      if (e.target == handleContainer.currDom[len-1] || (e.target.parentNode && e.target.parentNode == handleContainer.currDom[len-1])) {// 点击弹窗
        e.preventDefault();
        return;
      }
      handleContainer.timer = setTimeout(() => {
        handleContainer.destroyContainer();
      }, 500);
    }
  };
  
  document.onmouseover = e => {
    const len = handleContainer.currDom.length;
    if ((len && handleContainer.currDom[len-1] == e.target) || (e.target.parentNode && e.target.parentNode == handleContainer.currDom[len-1])) {
      e.preventDefault();
      while (len > 1) {
        handleContainer.currDom.shift();
        --len;
      }
      clearTimeout(handleContainer.timer);
      return;
    }
    if (len > 0) {
      handleContainer.destroyContainer();
    }
    let obj = findReact(e.target);
    let id = "";
    let text = "";

    if (obj && obj.props && obj.props.id) {
      id = obj.props.id;
      let url = "https://starling.bytedance.net/application/33/brand_international_fe?searchType=keyText&searchValue=";
      url += id;
      text = `<a target='_blank' href=${url}>${id}</a><br />`;
      let container = handleContainer.createContainer();
      container.style.top = e.pageY + "px";
      if (e.pageX + 280 <= document.body.clientWidth) {
        container.style.left = e.pageX + "px";
      } else container.style.left = document.body.clientWidth - 270 + "px";

      for (let key in res) {
        text += '<p>' + key +': ' + res[key].message[id] + '</p>';
      }
      container.innerHTML = text;
      document.body.appendChild(container);
    }
  };
})();