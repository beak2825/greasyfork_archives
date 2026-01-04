// ==UserScript==
// @name         EasyMock2YApi
// @namespace    YApiExtension
// @version      0.4
// @description  将EasyMock导出YApi
// @author       mingoing@outlook.com
// @match        *://*/project/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.0/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/373227/EasyMock2YApi.user.js
// @updateURL https://update.greasyfork.org/scripts/373227/EasyMock2YApi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var isVarTypePathRegex = /[{:]/;

function transformMockItem(item) {
  var transformParameter = function(key, item) {
    return JSON.parse(item.parameters || "[]")
      .filter(p => p.in === key)
      .map(p => {
        return {
          name: p.name,
          example: p.example,
          description: p.description
        };
      });
  };
  var transformBody = function(res_body) {
    if (!res_body) {
      return;
    }
    var jsonFactory = new Function("return " + res_body);
    var traverse = function(obj, handler) {
      Object.keys(obj).forEach(key => {
        if (obj[key] != null && typeof obj[key] === "object") {
          traverse(obj[key], handler);
        }
        if (Array.isArray(obj[key])) {
          obj[key].forEach(i => traverse(i, handler));
        }
        if (typeof obj[key] === "function") {
          obj[key] = handler(obj[key].toString());
        }
      });
    };
    var jsonInstance = jsonFactory();
    traverse(jsonInstance, func => func.toString());
    return JSON.stringify(jsonInstance);
  };
  return {
    query_path: {
      path: item.url,
      params: []
    },
    status: "undone",
    type: isVarTypePathRegex.test(item.url) ? "var" : "static",
    req_body_is_json_schema: false,
    res_body_is_json_schema: false,
    api_opened: false,
    index: 0,
    method: item.method.toLocaleUpperCase(),
    title: item.description,
    path: item.url,
    req_params: transformParameter("path", item),
    add_time: Date.now(),
    up_time: Date.now(),
    req_query: transformParameter("query", item),
    req_headers: transformParameter("header", item),
    req_body_form: [],
    res_body_type: "json",

    __v: 0,
    desc: "",
    markdown: "",
    res_body: transformBody(item.mode) || "",
    catid: null
  };
  // "catid" "project_id"
}
function easyMock2YApi(mocks) {
  var result = {
    index: 0,
    name: "公共分类",
    add_time: Date.now(),
    up_time: Date.now(),
    list: mocks.map(transformMockItem)
  };
  return [result];
}
function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function addExportBtn() {
  var newLi = $("<li>导出为YApi</li>");
  newLi.on("click", function() {
    console.log("%c downloading",'color:#2d8cf0');
    var token=__INITIAL_STATE__.user.token
    var projectId=__INITIAL_STATE__.mock.project._id
    var total=__INITIAL_STATE__.mock.total
    fetch("/api/mock?project_id="+projectId+"&page_size="+total+"&page_index=1&keywords=&sort=%7B%7D&filter=%7B%7D", {"credentials":"include","headers":{'Authorization':'Bearer '+token},"referrer":"https://easymock.sankuai.com/project/5bc41e341439ef395b4dcfa1","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"}).then((res)=>{
      return res.json()
  }).then((data)=>{
      console.log(data)
    download(
        "apis.json",
        JSON.stringify(easyMock2YApi(data.data.mocks))
      );  
  })
    
  });
  $(".em-container .em-proj-detail__switcher ul").append(newLi);
}
function isEasyMockSite() {
  return (
    document
      .querySelector('meta[property="og:url"]')
      .getAttribute("content")
      .indexOf("easy-mock") > -1
  );
}

    if(isEasyMockSite()){
        addExportBtn();
    }
})();