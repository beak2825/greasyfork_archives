// ==UserScript==
// @name         JsonSchema2Typescript
// @namespace    https://github.com/codeshareman/tookit.git
// @version      0.3
// @description  yapi接口JsonSchema转typescript
// @author       codeshareman
// @match        *://*/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443883/JsonSchema2Typescript.user.js
// @updateURL https://update.greasyfork.org/scripts/443883/JsonSchema2Typescript.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const TYPE_MAP = {
    string: "string",
    integer: "number",
    boolean: "boolean",
    object: "Object",
    "object []": "array",
  };
  const SCHEMA_TRANS_SITE = "https://app.quicktype.io";

  var _wr = function (type) {
    var orig = history[type];
    return function () {
      var rv = orig.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _wr("pushState");
  history.replaceState = _wr("replaceState");

  window.onload = () => {
    function transQuery2Typescript(query) {
      if (query === undefined || query === null) return {};
      return query.reduce((pre, item, index) => {
        const name = item.name;
        pre[name] = "string";
        return pre;
      }, {});
    }

    function transBody2Typescript(body) {
      if (body === undefined || body === null) return {};
      const bodyJson = JSON.parse(body);
      let body_ts = { ...bodyJson };

      function loop(body, preName) {
        const properties = body.properties;
        const fields = properties !== undefined ? Object.keys(properties) : [];
        let transData = {};
        
        if (body.type && !["array"].includes(body.type)) {
          body.title = `${preName}Data`;
        }

        fields.forEach((name) => {
          let fieldData = properties[name];
          const type = fieldData.type;
          if (!["array", "object"].includes(type)) {
            delete fieldData.title;
            transData[name] = fieldData;
          } else {
            const pascalName = name.replace(/^\S/, (s) => s.toUpperCase());
            fieldData.title = preName ? `${preName}${pascalName}` : name;
            transData[name] = fieldData;
            if (type === "array") {
              transData[name].items.properties = loop(fieldData.items, name);
            } else {
              transData[name].properties = loop(fieldData, name);
            }
          }
        });
        return transData;
      }

      if (bodyJson !== undefined) {
        body_ts.properties = loop(bodyJson);
      }

      return body_ts;
    }

    function css(target, style) {
      for (const property in style) {
        target.style[property] = style[property];
      }
    }

    function copyText(text, onSuccess) {
      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(text).then(onSuccess);
      } else {
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = "fixed";
        textarea.style.clip = "rect(0 0 0 0)";
        textarea.style.top = "10px";
        // 赋值
        textarea.value = text;
        // 选中
        textarea.select();
        // 复制
        document.execCommand("copy", true);
        // 移除输入框
        document.body.removeChild(textarea);
        onSuccess();
      }
    }

    function generateTypescriptElement(target, originContent) {
      const content = JSON.stringify(originContent, null, 2);

      // 清除旧节点
      const oldEle = document.querySelector(".code-typescript");
      oldEle && oldEle.remove();

      if (target === undefined || target === null) return;

      const $ele_ts_wrapper = document.createElement("div");
      const $ele_header = document.createElement("div");
      const $ele_copy = document.createElement("a");
      const $ele_code = document.createElement("pre");

      $ele_header.innerHTML = `请将复制的内容粘贴到 ${SCHEMA_TRANS_SITE} 的左侧源内容区，SourceType选择JSON Schema，即可将schema转换为typescript`;
      $ele_ts_wrapper.className = "code-typescript";
      css($ele_ts_wrapper, {
        position: "relative",
        margin: "8px 0",
        padding: "30px 12px 12px 4px",
        background: "#f9f9f9",
        border: "1px solid #ebe7e7",
        boxShadow: "0px 0px 12px #eee",
      });
      css($ele_header, {
        position: "absolute",
        width: "100%",
        top: 0,
        left: 0,
        background: "#e3e3e3",
        padding: "4px 12px",
      });
      css($ele_code, {
        height: "500px",
        overflowY: "auto",
      });
      $ele_ts_wrapper.appendChild($ele_header);
      $ele_ts_wrapper.appendChild($ele_code);
      $ele_code.innerText = content;
      $ele_copy.innerText = "复制(copy)";

      css($ele_copy, {
        position: "absolute",
        right: "0px",
        top: "0px",
        height: "27px",
        lineHeight: "27px",
        background: "#d93326",
        padding: "0 8px",
        color: "#fff",
      });

      let copied = false;
      $ele_copy.addEventListener("click", () => {
        if (copied) return;
        copyText(content, () => {
          copied = true;
          $ele_copy.innerText = "已复制";
          const $ele_a = document.createElement("a");
          $ele_a.href = SCHEMA_TRANS_SITE;
          $ele_a.target = "_blank";
          $ele_a.click();
          $ele_a.remove();
          setTimeout(() => {
            copied = false;
            $ele_copy.innerText = "复制(copy)";
          }, 1000);
        });
      });
      $ele_header.appendChild($ele_copy);
      target.appendChild($ele_ts_wrapper);
    }

    function transApi2Typescript() {
      const ORIGIN = location.origin;
      const API_ID = location.pathname.split("/").pop();
      const url = `${ORIGIN}/api/interface/get?id=${API_ID}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data !== undefined) {
            const errCode = data.errcode;
            if (errCode === 0) {
              const resData = data.data;
              const query = resData.req_query;
              const body = resData.res_body;

              const query_ts = transQuery2Typescript(query);
              const $ele_query = document.querySelector(".colQuery");
              generateTypescriptElement($ele_query, query_ts);

              const body_ts = transBody2Typescript(body);
              const $ele_body = document.querySelector(".caseContainer");
              generateTypescriptElement($ele_body, body_ts);
            }
          }
        });
    }

    transApi2Typescript();

    window.addEventListener("popstate", function (event) {
      transApi2Typescript();
    });

    window.addEventListener("pushState", function (e) {
      transApi2Typescript();
    });

    window.addEventListener("replaceState", function (e) {
      transApi2Typescript();
    });
  };
})();
