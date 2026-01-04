// ==UserScript==
// @name        ys-torna 接口生成
// @namespace   Violentmonkey Scripts
// @match       http://192.168.110.20:7700/#/view/*
// @grant       none
// @version     1.0.3
// @author      -
// @description 2023/9/23 13:48:20
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js
// @require     https://cdn.bootcdn.net/ajax/libs/vue/2.7.14/vue.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/vuejs-storage/3.1.1/vuejs-storage.umd.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/highlight.js/11.8.0/highlight.min.js
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476151/ys-torna%20%E6%8E%A5%E5%8F%A3%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/476151/ys-torna%20%E6%8E%A5%E5%8F%A3%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==
GM_addStyle(
  ".group-copy-interface,.group-copy-request{display:none;position:absolute;margin-top:-2px}"
);
GM_addStyle(".group-copy-interface{right: 0;}");
GM_addStyle(".group-copy-request{right: 30px}");
GM_addStyle(
  ".el-tree-node__content:hover .group-copy-request{display:inline-block}"
);
GM_addStyle(
  ".el-tree-node__content:hover .group-copy-interface{display:inline-block}"
);
GM_addStyle(".el-notification__content p{white-space: pre}");
GM_addStyle(".el-notification{width: 430px}");
GM_addStyle(
  "@import url('https://cdn.bootcdn.net/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css');"
);

const data = {};
const isInit = false;
const nestData = false;
let settingsVm
const observer = new MutationObserver(insertButton);
observer.observe(document.querySelector("body"), {
  attributes: true,
  childList: false,
  subtree: false,
});
function insertButton() {
  if (document.querySelector(".copy-request")) {
    return;
  }

  // 标题后按钮
  const requestParams = $(".doc-descr");
  requestParams[0].style = `display:flex;align-items:center;`;
  requestParams.append(
    '<button class="copy-request el-button el-button--primary el-button--mini" style="margin-left:10px;">req</button>'
  );
  requestParams.append(
    '<button class="cppy-interface el-button el-button--primary el-button--mini" style="margin-left:10px;">ts</button>'
  );
  document
    .querySelector(".copy-request")
    .addEventListener("click", () => copyRequest());
  document
    .querySelector(".cppy-interface")
    .addEventListener("click", () => copyInterface());

  // Body Parameter 按钮
  const bodyParameter = $("h5:contains('Body Parameter')");
  bodyParameter.append(
    '<button class="body-parameter-copy-request el-button el-button--primary el-button--mini" style="margin-left:10px;">ts</button>'
  );
  document
    .querySelector(".body-parameter-copy-request")
    .addEventListener("click", copyBodyParameterInterface);

  // query Parameter 按钮
  const queryParameter = $("h5:contains('Query Parameter')");
  queryParameter.append(
    '<button class="query-parameter-copy-request el-button el-button--primary el-button--mini" style="margin-left:10px;">ts</button>'
  );
  document
    .querySelector(".query-parameter-copy-request")
    .addEventListener("click", copyQueryParameterInterface);

  // response Parameter 按钮
  const responseParameter = $("h4:contains('响应参数')");
  responseParameter.append(
    '<button class="response-parameter-copy-request el-button el-button--primary el-button--mini" style="margin-left:10px;">ts</button>'
  );
  document
    .querySelector(".response-parameter-copy-request")
    .addEventListener("click", copyResponseParameterInterface);

  _.once(function () {
    observer.observe(document.querySelector(".app-main"), {
      attributes: true,
      childList: true,
      subtree: false,
    });
  })();
}

// 左侧导航文件夹按钮
setTimeout(() => {
  insertTreeButton();
  $(".el-tree-node").on("click", ".group-copy-request", copyGroupRequest);
  $(".el-tree-node").on("click", ".group-copy-interface", copyGroupInterface);
  const observerTree = new MutationObserver(insertTreeButton);
  observerTree.observe(document.querySelector(".el-tree"), {
    attributes: true,
    childList: true,
    subtree: true,
  });
}, 500);
const insertTreeButton = _.debounce(function () {
  const folder = $(".el-icon-folder,.el-icon-box")
    .parent()
    .filter(":not(.has-button)");
  folder.addClass("has-button");
  folder.append(
    '<button class="group-copy-request el-button el-button--primary el-button--mini" style="margin-left:10px;padding: 3px 6px;">req</button>'
  );
  folder.append(
    '<button class="group-copy-interface el-button el-button--primary el-button--mini" style="margin-left:10px;padding: 3px 6px;">ts</button>'
  );
}, 300);

// methods
function requestName(item) {
  return _.camelCase(
    item.url
      .replace(/\{(.*)\}$/, "_by_$1")
      .replaceAll("/", "_")
      .replace(/^_/, "")
      .replace(/_$/, "")
  )
}
function paramsDto(item) {
  return _.upperFirst(requestName(item)) + 'ParamsDto'
}
function dataDto(item) {
  return _.upperFirst(requestName(item)) + 'DataDto'
}
function copyRequest(item) {
  const data = item || document.querySelector(".doc-view").__vue__.item;
  const name = requestName(data)
  let arg = "";
  let argType = "";
  if (_.size(data.queryParams)) {
    arg = "params";
    argType = ": " + (settingsVm.anyType ? 'any' : paramsDto(data));
  }
  if (_.size(data.requestParams)) {
    arg = "data";
    argType = ": " + (settingsVm.anyType ? 'any' : dataDto(data));
  }
  let pathArg = "";
  if (_.size(data.pathParams)) {
    data.pathParams.forEach((item) => {
      pathArg += `${item.name}: ${convertType(item.type)},`;
    });
  }
  const responseDto = settingsVm.anyType ? 'any' : (_.upperFirst(name) + 'ResponseDto')
  const text = ` // ${data.description}  作者: ${data.author
    } http://192.168.110.20:7700/#/view/${data.id}
  export function ${name}(${pathArg}${arg}${argType}): ${responseDto} {
    return defHttp.${_.toLower(data.httpMethod)}({
      url: \`${data.url.replaceAll("{", "${")}\`,
      ${arg}
    })
  }
  `;
  if (item) {
    return text;
  } else {
    copy(text);
  }
}
function copyInterface(item) {
  const data = item || document.querySelector(".doc-view").__vue__.item;
  const name = requestName(data)
  let treeResponseParams = data.responseParams;
  let rootType = ''
  if (settingsVm.extractData) {
    const dataField = treeResponseParams.find(
      (item) => item.name === "data"
    )
    if (dataField?.children) {
      treeResponseParams = dataField.children
    }
    if (dataField?.type === 'array') {
      rootType = '[]'
    }
  }
  let text = `// ${data.description} 作者: ${data.autho}  http://192.168.110.20:7700/#/view/${data.id}`;
  let text1 = ''
  let text2 = ''
  if (data.queryParams.length) {
    const treeBodyParams = data.queryParams;
    const params = treeBodyParams.map(transformField);
    text1 = `declare type ${paramsDto(data)} = {${params.join("")}}`
  }
  if (data.requestParams.length) {
    const treeBodyParams = data.requestParams;
    const body = treeBodyParams.map(transformField);
    text2 = `declare type ${dataDto(data)} = {${body.join("")}}`
  }
  const response = treeResponseParams.map(
    transformField
  );
  text3 = `declare type ${_.upperFirst(name)}ResponseDto = Promise<{${response.join("")}${rootType}}>`

  result = _.compact([text, text1, text2, text3]).join('\n')
  if (item) {
    return result;
  } else {
    copy(result);
  }
}

async function copyGroupRequest(event) {
  const nodeData = event.delegateTarget.__vue__.node.data;
  const token = localStorage.getItem("torna.token");
  const flatList = toFlat(nodeData.children);
  let text = ``;
  for (const item of flatList.filter((item) => item.type === 3)) {
    const { data } = await fetch(`/doc/view/detail?id=${item.id}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((res) => res.json());
    text += copyRequest(data);
  }
  copy(text);
}

async function copyGroupInterface(event) {
  const nodeData = event.delegateTarget.__vue__.node.data;
  const token = localStorage.getItem("torna.token");

  const flatList = toFlat(nodeData.children);
  let text = ``;
  for (const item of flatList.filter((item) => item.type === 3)) {
    const { data } = await fetch(`/doc/view/detail?id=${item.id}`, {
      headers: { Authorization: "Bearer " + token },
    }).then((res) => res.json());
    transformRawResponse(data);
    text += copyInterface(data);
  }
  copy(text);
}

function copyBodyParameterInterface() {
  const data = document.querySelector(".doc-view").__vue__.item;
  const treeBodyParams = data.requestParams;
  const body = treeBodyParams.map(transformField);
  const text = `// ${data.description} body 作者: ${data.author}
${settingsVm.noExportString ? '' : 'export interface Todo '}{${body.join("")}
}
`;
  copy(text);
}

function copyQueryParameterInterface() {
  const data = document.querySelector(".doc-view").__vue__.item;
  const treeQueryParams = data.queryParams;
  const body = treeQueryParams.map(transformField);
  const text = `// ${data.description} body 作者: ${data.author}
${settingsVm.noExportString ? '' : 'export interface Todo '}{${body.join("")}
}
`;
  copy(text);
}

function copyResponseParameterInterface() {
  const data = document.querySelector(".doc-view").__vue__.item;
  let treeResponseParams = data.responseParams;
  if (settingsVm.extractData) {
    const dataField = treeResponseParams.find(
      (item) => item.name === "data"
    )
    if (dataField?.children) {
      treeResponseParams = dataField.children
    }
  }
  const body = treeResponseParams.map(transformField);
  const text = `// ${data.description} body 作者: ${data.author}
${settingsVm.noExportString ? '' : 'export interface Todo '}{${body.join("")}
}
`;
  copy(text);
}

// utils
function convertType(type) {
  return (
    {
      int32: "number",
      int64: "number",
    }[type] || type
  );
}
function transformField(item) {
  let result = "";
  function c(item) {
    if (!item.children || item.children.length === 0) {
      let type = convertType(item.type);
      if (/Time$/i.test(item.name) && item.type === "object") {
        type = "string";
      }
      result += `
      /** ${item.description} 示例值：${item.example} */
      ${item.name}${item.required ? "" : "?"}: ${type}`;
    } else {
      result += `
      /** ${item.description} */
      ${item.name}: {`;
      item.children.forEach(c);
      result +=
        `
      }` + (item.type === "array" ? "[]" : "");
    }
  }
  c(item);
  return result;
}

function toFlat(treeData) {
  const result = [];
  const c = (list) => {
    list.forEach((item) => {
      result.push(item);
      if (item.children) {
        c(item.children);
      }
    });
  };
  c(treeData);
  return result;
}

function toTree(flatData) {
  const hash = {};
  flatData.forEach((item) => {
    hash[item.id] = item;
  });
  flatData.forEach((item) => {
    if (item.parentId) {
      const parent = hash[item.parentId];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
  });
  return flatData.filter((item) => !item.parentId);
}

function transformRawResponse(data) {
  data.responseParams = toTree(data.responseParams);
}
function copy(text) {
  document.querySelector("#app").__vue__.$notify({
    title: "复制成功",
    dangerouslyUseHTMLString: true,
    message: hljs.highlight(text, { language: "typescript" }).value,
    type: "success",
  });
  GM_setClipboard(text);
}

function addSettings() {
  const html = `
  <div id="custom-settings" style="position: absolute;top: 180px;right: 15px;height: 200px; z-index: 1;">
    <div style="color:#666">
      <div style="display:flex;flex-direction:column;gap: 5px">
        <label style="font-weight: normal">
          <input type="checkbox" v-model="anyType"></input>
          <span>使用 any 参数</span>
        </label>
        <label style="font-weight: normal">
          <input type="checkbox" v-model="extractData"></input>
          <span>从响应体中提取 data</span>
        </label>
        <label style="font-weight: normal">
          <input type="checkbox" v-model="noExportString"></input>
          <span>生成的 interface 不要 export</span>
        </label>
      </div>
    </div>
  </div>
  `;
  $("body").append(html);
  Vue.use(vuejsStorage)
  settingsVm = new Vue({
    el: "#custom-settings",
    data: {
      extractData: true,
      anyType: false,
      noExportString: true
    },
    storage: {
      keys: ['extractData', 'anyType', 'noExportString'],
      //keep data.count in localStorage
      namespace: 'torna-ts'
    }
  })
}
addSettings()
