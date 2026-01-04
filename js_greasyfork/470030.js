// ==UserScript==
// @name         B漫接口文档类型自动获取
// @namespace    mimiko/bilibili-manga-api-doc
// @version      0.0.12
// @description  吧啦吧啦
// @author       Mimiko
// @license      MIT
// @match        *://comic.bilibili.co/api-doc/*
// @grant        GM.addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/470030/B%E6%BC%AB%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/470030/B%E6%BC%AB%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/470030-b%E6%BC%AB%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96
"use strict";
(() => {
  if (window.top !== window.self) return;
  // variables
  const regexOptional = new RegExp(
    ["不传", "不填", "可选", "选传", "选填", "非必传", "非必填"].join("|"),
  );
  // functions
  /** 将字符串转为小驼峰 */ const camelCase = (input) =>
    input
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase(),
      )
      .replace(/\s+/g, "");
  /** 复制到剪贴板 */ const copy = (content) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  /** 格式化；核心方法 */ const format = (input) =>
    input // [{ ... }] -> { ... }[]
      .replace(/: \[{/g, ": {")
      .replace(/}],/g, "}[],") // {} -> Record<string, never>
      .replace(/{}/g, "Record<string, never>") // bool -> boolean
      .replace(/false, \/\/ type<bool>/g, "boolean //") // i32 -> number
      .replace(/0, \/\/ type<int32>/g, "number //") // i64 -> `${bigint}`
      .replace(/"0", \/\/ type<int64>/g, "`${bigint}` //") // double -> number
      .replace(/0.0, \/\/ type<double>/g, "number //") // float -> number
      .replace(/0.0, \/\/ type<float>/g, "number //") // string -> string
      .replace(/"", \/\/ type<string>/g, "string //") // i32[] -> number[]
      .replace(/\[0], \/\/ list<int32>/g, "number[] //") // i64[] -> `${bigint}`[]
      .replace(/\["0"], \/\/ list<int64>/g, "`${bigint}`[] //") // string[] -> string[]
      .replace(/\[""], \/\/ list<string>/g, "string[] //") // UNKNOWN -> unknown
      .replace(/UNKNOWN, \/\/ type<>/g, "unknown //") // {"0": false} -> Record<string, boolean>
      .replace(
        /: {(.*?)\n(\s*)"0": false\n\s*}/g,
        ": $1\n$2Record<string, boolean>",
      ) // {"": ""} -> Record<string, string>
      .replace(/: {(.*?)\n(\s*)"": ""\n\s*}/g, ": $1\n$2Record<string, string>") // {"0": {}} -> Record<string, {}>
      .replace(/: {(.*?)\n(\s*)"0": {/g, ": $1\n$2Record<string, {") // {"0": 0} -> Record<string, number>
      .replace(/: {(.*?)\n(\s*)"0": 0\n\s*}/g, ": $1\n$2Record<string, number>")
      .replace(/}\n\s*},/g, "}>") // remove useless comma
      .replace(/},\n/g, "}\n")
      .replace(/>,\n/g, ">\n") // remove useless comment
      .replace(/\/\/ list<.*/g, "")
      .replace(/\/\/ map<.*/g, "")
      .replace(/}, \/\/ type<.*/g, "},") // remove empty inline comment
      .replace(/\s*\/\/\s*$/gm, "") // '// xxx' -> /** xxx */
      .replace(/\/\/\s*(.*?)\n/g, "/** $1 */\n") // */\n/** -> *
      .replace(/\*\/\n(\s*)\/\*\*/g, "\n$1 *") // replace 4 spaces with 2 spaces
      .replace(/ {4}/g, "  ") // optional parameters
      .replace(/\/\*\*.+?\*\/\n.+?:/g, (text) => {
        if (regexOptional.test(text)) text = text.replace(/:$/, "?:");
        return text;
      });
  /** 生成代码 */ const getContent = (btn) => {
    const data = pick(btn);
    if (!data) return;
    const name = upperFirst(camelCase(data.name.split("/").pop() ?? ""));
    if (!name) return;
    const { description, url } = data;
    const request = format(data.request);
    const response = format(data.response);
    const head = `
/**
 * ${data.name}
 * @description ${description}
 * @see ${url}
 */`;
    return `
${head}
export type Request${name} = ${request}
${head}
export type Response${name} = ${response}
    `;
  };
  /** 注入按钮 */ const inject = (callback) => {
    // h1
    document.querySelectorAll("h1").forEach((h1) => {
      const btn = document.createElement("button");
      btn.addEventListener("click", onClickAll);
      btn.classList.add("btn", "btn-primary");
      btn.innerText = "复制全部类型";
      btn.style.marginLeft = "10px";
      h1.appendChild(btn);
    });
    // h2
    document.querySelectorAll("h2").forEach((h2, i) => {
      h2.dataset.name = h2.textContent?.trim() ?? "";
      const btn = document.createElement("button");
      btn.addEventListener("click", () => onClick(btn));
      btn.classList.add("btn", "btn-primary");
      btn.innerText = "复制类型";
      btn.style.marginLeft = "10px";
      btn.dataset.index = i.toString();
      h2.appendChild(btn);
    });
    // .sourceCode
    document.querySelectorAll(".sourceCode").forEach((div) => {
      div.dataset.code = div.textContent?.trim() ?? "";
    });
    // callback
    callback();
  };
  /** 主函数 */ const main = () => {
    GM.addStyle(".sourceCode { pointer-events: none; }");
    window.addEventListener("load", () =>
      inject(() => GM.addStyle(".sourceCode { pointer-events: auto; }")),
    );
  };
  /** “复制类型” */ const onClick = (btn) => {
    const content = getContent(btn);
    if (!content) {
      alert("获取类型失败");
      return;
    }
    copy(content);
  };
  /** “复制全部类型” */ const onClickAll = () => {
    const content = [...document.querySelectorAll("h2 button")]
      .map(getContent)
      .join("");
    copy(content);
  };
  /** 获取页面文本 */ const pick = (btn) => {
    const h2 = btn.parentElement;
    if (!h2) return;
    const { name } = h2.dataset;
    if (!name) return;
    const url = [
      window.location.origin,
      window.location.pathname,
      "#",
      name.toLowerCase().replace(/\./g, "").replace(/\//g, ""),
    ].join("");
    const p = h2.nextElementSibling;
    if (!p) return;
    const description = p.textContent?.trim();
    if (!description) return;
    const { index } = btn.dataset;
    if (!index) return;
    const i = parseInt(index);
    const divReq = document.getElementById(`cb${1 + i * 2}`);
    if (!divReq) return;
    const request = divReq.dataset.code;
    if (!request) return;
    const divRes = document.getElementById(`cb${2 + i * 2}`);
    if (!divRes) return;
    const response = divRes.dataset.code;
    if (!response) return;
    return {
      description,
      name,
      request,
      response,
      url,
    };
  };
  /** 首字母大写 */ const upperFirst = (input) =>
    input.charAt(0).toUpperCase() + input.slice(1);
  // execute
  main();
})();
