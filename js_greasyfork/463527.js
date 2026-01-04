// ==UserScript==
// @name         apifox-openapi-transformer
// @namespace    https://github.com/zenonux
// @version      1.5.1
// @description  transform apifox openapi format provided by `http://127.0.0.1:4523/export/openapi/` into typescript api flie.
// @author       换个头像心好累
// @license      GPL-3.0 License
// @match        *://127.0.0.1:4523/export/openapi/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NzUzLCAyMDIxLzAyLzE1LTExOjUyOjEzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDQtMDhUMTY6NTc6MjIrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA0LTA4VDE2OjU5OjMwKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA0LTA4VDE2OjU5OjMwKzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmRjODg1M2Q4LTI4MjEt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
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463527/apifox-openapi-transformer.user.js
// @updateURL https://update.greasyfork.org/scripts/463527/apifox-openapi-transformer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.onload = _init;

  async function _init() {
    let dataString = await getApiDataString()
    const jsonData = JSON.parse(dataString);
    const apis = [];
    Object.keys(jsonData.paths).forEach((url) => {
      if (jsonData.paths[url].get) {
        apis.push(_buildApi(url, "get", jsonData.paths[url].get));
      }
      if (jsonData.paths[url].post) {
        apis.push(_buildApi(url, "post", jsonData.paths[url].post));
      }
      if (jsonData.paths[url].put) {
        apis.push(_buildApi(url, "put", jsonData.paths[url].put));
      }
      if (jsonData.paths[url].delete) {
        apis.push(_buildApi(url, "delete", jsonData.paths[url].delete));
      }
    });
    if (apis.length > 0) {
      let apiStr = apis.join("");
      _showExportButton(apiStr);
    }
  }


  function getApiDataString() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: window.location.href,
        onload: function (response) {
          if (response.status === 200) {
            resolve(response.responseText)
          } else {
            reject()
          }
        },
        onerror: function (error) {
          reject(error)
        }
      });

    })
  }

  function _buildApi(url, method, info) {
    let { summary, parameters, requestBody, responses } = info;
    let ParamsType = "{}";
    if (parameters && parameters.length > 0) {
      ParamsType = _parseParam(parameters);
    }
    let DataType = "{}";
    if (requestBody) {
      let body = requestBody.content["application/json"].schema;
      DataType = _parseBodyOrResponse(body.properties, body.required);
    }
    let ResponseType = "{}";
    let responseData = responses["200"].content["application/json"].schema;
    ResponseType = _parseBodyOrResponse(
      responseData.properties,
      responseData.required
    );

    return `\n
      // ${summary}
      ${method}(payloads:{
        params${_isEmptyObjectStr(ParamsType) ? "?" : ""}:${ParamsType};
        data${_isEmptyObjectStr(DataType) ? "?" : ""}:${DataType};
    }): Promise<${ResponseType}>{
        return request({
            url:"${url}",
            method:"${method}",
            ${_isEmptyObjectStr(ParamsType) ? "" : "params:payloads.params,"}
            ${_isEmptyObjectStr(DataType) ? "" : "data:payloads.data,"}
        })
    },
    \n`;
  }
  function _parseParam(parameters) {
    let query = "{";
    parameters.forEach((v) => {
      // ignore in path
      if (v.in.indexOf("query") !== -1) {
        query += `${[v.name]}${v.required ? "" : "?"}:${v.schema.type};`;
      }
    });
    query += "}";
    return _replaceInteger2Number(query);
  }
  function _parseBodyOrResponse(properties, required = []) {
    if (!properties) {
      return '{}'
    }
    let data = "{";
    Object.keys(properties).forEach((v) => {
      let isRequired = required.some((k) => v === k);
      let type = properties[v].type;
      if (type === "object") {
        data += `${v}:`;
        data += _parseBodyOrResponse(
          properties[v].properties,
          properties[v].required
        );
        data += `;`;
      } else if (type === "array") {
        data += `${v}:`;
        data += _parseBodyOrResponse(
          properties[v].items.properties,
          properties[v].items.required
        );
        data += `[];`;
      } else {
        data += `${[v]}${isRequired ? "" : "?"}:${type};`;
      }
    });
    data += "}";
    return _replaceInteger2Number(data);
  }
  function _isEmptyObjectStr(obj) {
    return obj === "{}";
  }
  function _showExportButton(apiStr) {
    let btn = document.createElement("button");
    btn.innerText = "复制接口";
    btn.style =
      "position:fixed;top:16%;left:50%;transform:translate(-50%,0);z-index:10000;background:#888;padding:10px 14px;border:none;color:#fff;cursor:pointer;";
    btn.addEventListener("click", () => {
      _copyToClipboard(apiStr).then(() => {
        _showToast("复制成功");
      });
    });
    document.body.appendChild(btn);
  }
  function _replaceInteger2Number(text) {
    return text.replace(/integer/g, "number");
  }
  function _showToast(msg) {
    let toast = document.createElement("div");
    toast.innerText = msg;
    toast.style =
      "position:fixed;top:16%;left:50%;transform:translate(-50%,-24%);z-index:20000;background:#67C23A;padding:30px 45px;border-radius:4px;color:#fff;";
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 1000);
  }
  function _copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }
})();
