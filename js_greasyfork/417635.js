// ==UserScript==
// @name         SwaggerUI tool
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       CGod
// @include      */swagger-ui.html*
// @match        https://www.tampermonkey.net/scripts.php
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @resource     toast_css https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/417635/SwaggerUI%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/417635/SwaggerUI%20tool.meta.js
// ==/UserScript==

(function () {
  "use strict";
console.log('setInterval')
  const timer = setInterval(() => {
    if (document.getElementById("resources")) {
      setTimeout(init, 100);
      clearInterval(timer);
    }
  }, 10);

  function init() {
    $(".operation").each((i, operation) => {
      let $operation = $(operation);
      let $method = $operation.find(".http_method");
      let $copy = $(`<span class="copy_api_code">复制API代码<span>`);
      $copy.on("click", () => {
        copyApiCode(operation);
      });
      $method.before($copy);
    });
  }

  function copyApiCode(operation) {
    let $operation = $(operation);
    let url = $operation.find(".path a").text();
    let method = $operation.find(".http_method a").text();
    let markdown = $operation.find(".options .markdown p:eq(0)").text();
    let paramTypes = $operation
      .find(".operation-params tr td:nth-child(4)")
      .map((i, t) => $(t).text())
      .toArray();

    let paramsMap = {};

    $operation.find(".operation-params tr").map((i, tr) => {
      let $tr = $(tr);
      let key = $tr.find("td:eq(0) label").text();
      let val = $tr.find("td:eq(1)").text();
      let desc = $tr.find("td:eq(2) p").text();
      let type = $tr.find("td:eq(3)").text();
      let dType = $tr.find("td:eq(4)").text();
      paramsMap[key] = { key, val, desc, type, dType };
    });

    let hasData = paramTypes.indexOf("formData") !== -1 || paramTypes.indexOf("body") !== -1;
    let hasParams = paramTypes.indexOf("query") !== -1;

    let reqOpts = [];
    let fnOpts = [];
    let noteParams = [];
    let apiName = `api${up(method)}`;
    url = url.replace(/\{\w+\}/g, s => {
      let key = s.substring(1, s.length - 1);
      fnOpts.push(key);
      let p = paramsMap[key];
      noteParams.push(`@param {${p.dType}} ${key} ${p.desc}`);
      return "$" + s;
    });

    if (method.toLowerCase() !== "get") {
      reqOpts.push(`method: '${method}'`);
    }
    if (hasData) {
      fnOpts.push("data");
      reqOpts.push("data");
    }
    if (hasParams) {
      fnOpts.push("params");
      reqOpts.push("params");
    }
    let reqOptsStr = reqOpts.length ? `, {\n        ${reqOpts.join(",\n        ")}\n    }` : "";

    let notesStr = noteParams.length ? `\n * ${noteParams.join("\n * ")}` : "";

    let api = `/**\n * ${markdown}${notesStr}\n */\nexport function ${apiName}(${fnOpts.join(", ")}) {\n    return request(\`/api-${url}\`${reqOptsStr});\n}`;
    console.log(api);
    GM_setClipboard(api, "text");
    $.toast({
      text: "代码已复制到剪切板",
      loader: false
    });
  }
  function up(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
  }
  GM_addStyle(GM_getResourceText("toast_css"));
  GM_addStyle(
    `.copy_api_code{position:absolute;left:-123px;line-height:26px;height:28px;background:#fff;display:block;width:120px;text-align:center;border:1px dashed #4daaff;box-sizing:border-box;cursor:pointer;transition:all .3s}
    .copy_api_code:hover{background-color:#e6f3ff;border-radius:20px;font-size:90%}
    .swagger-section .swagger-ui-wrap ul#resources li.resource ul.endpoints li.endpoint ul.operations li.operation{overflow:inherit;position:relative}`
  );
})();
