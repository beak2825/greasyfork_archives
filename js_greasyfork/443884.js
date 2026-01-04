// ==UserScript==
// @name         Json2Typescript
// @namespace    https://github.com/codeshareman/tookit.git
// @version      0.2
// @description  yapi接口Json转typescript
// @author       codeshareman
// @match        *://*/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443884/Json2Typescript.user.js
// @updateURL https://update.greasyfork.org/scripts/443884/Json2Typescript.meta.js
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
      let body_ts = {};

      function loop(body) {
        const properties = body.properties;
        const requiredList = body.required || [];
        let cloneData = {};
        const fieldList =
          properties !== undefined ? Object.keys(properties) : [];
        fieldList.forEach((_field, index) => {
          const fieldData = properties[_field];
          const type = fieldData.type;
          const isRequired = requiredList.includes(_field);
          const field = `${_field}${isRequired ? "" : "?"}`;

          if (!["array", "object"].includes(type)) {
            cloneData[field] = TYPE_MAP[type];
          } else {
            if (type === "array") {
              const fieldType = fieldData.items.type;
              const fieldProperties = fieldData.items.properties;
              // 非array或object
              if (fieldProperties === undefined) {
                cloneData[field] = `${TYPE_MAP[fieldType]}[]`;
              } else {
                const childData = loop(fieldData.items);
                cloneData[field] = [childData];
              }
            }
            if (type === "object") {
              const fieldProperties = fieldData.properties;
              const fieldList = Object.keys(fieldProperties);
              cloneData[field] =
                fieldList.length > 0 ? loop(fieldData) : "Object";
            }
          }
        });
        return cloneData;
      }

      if (bodyJson !== undefined) {
        body_ts = loop(bodyJson);
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

    function generateTypescriptElement(target, content) {
      // 清除旧节点
      const oldEle = document.querySelector(".code-typescript");
      oldEle && oldEle.remove();

      if (target === undefined || target === null) return;

      const $ele_ts_wrapper = document.createElement("pre");
      const $ele_copy = document.createElement("a");
      $ele_ts_wrapper.className = "code-typescript";
      css($ele_ts_wrapper, {
        position: "relative",
        margin: "8px 0",
        padding: "12px 0 12px 4px",
        background: "#f9f9f9",
        border: "1px solid #ebe7e7",
        boxShadow: "0px 0px 12px #eee",
      });
      $ele_ts_wrapper.innerHTML = content;

      $ele_copy.innerText = "复制(copy)";
      css($ele_copy, {
        position: "absolute",
        top: "12px",
        right: "12px",
        color: "#f00",
      });
      let copied = false;
      $ele_copy.addEventListener("click", () => {
        if (copied) return;
        copyText(content, () => {
          copied = true;
          $ele_copy.innerText = "已复制";
          const $ele_a = document.createElement("a");
          $ele_a.href = "http://json2ts.com/";
          $ele_a.target = "_blank";
          $ele_a.click();
          $ele_a.remove();
          setTimeout(() => {
            copied = false;
            $ele_copy.innerText = "复制(copy)";
          }, 3000);
        });
      });
      $ele_ts_wrapper.appendChild($ele_copy);
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
              const $ele_body = document.querySelector(".caseContainer");

              generateTypescriptElement(
                $ele_query,
                JSON.stringify(query_ts, null, 4)
              );

              const body_ts = transBody2Typescript(body);
              generateTypescriptElement(
                $ele_body,
                JSON.stringify(body_ts, null, 4)
              );
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
