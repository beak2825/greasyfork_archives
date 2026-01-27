// ==UserScript==
// @name Enhance some features of the Self-managed Gitlab
// @name:zh 强化自托管 Gitlab 能力
// @name:zh-CN 强化自托管 Gitlab 能力
// @name:zh-Hans 强化自托管 Gitlab 能力
// @name:zh-TW 強化自託管 Gitlab 能力
// @name:zh-HK 強化自託管 Gitlab 能力
// @name:zh-Hant 強化自託管 Gitlab 能力
// @namespace https://greasyfork.org/users/1133279
// @description Enhance some features of the Self-managed Gitlab, such as the CI/CD settings page, the merge request create/edit page etc.
// @description:zh 强化自托管 Gitlab 的一些功能，如 CI/CD 设置页面、合并请求创建/编辑页面等。
// @description:zh-CN 强化自托管 Gitlab 的一些功能，如 CI/CD 设置页面、合并请求创建/编辑页面等。
// @description:zh-Hans 强化自托管 Gitlab 的一些功能，如 CI/CD 设置页面、合并请求创建/编辑页面等。
// @description:zh-TW 強化自託管 Gitlab 的一些功能，如 CI/CD 設置頁面、合併請求創建/編輯頁面等。
// @description:zh-HK 強化自託管 Gitlab 的一些功能，如 CI/CD 設置頁面、合併請求創建/編輯頁面等。
// @description:zh-Hant 強化自託管 Gitlab 的一些功能，如 CI/CD 設置頁面、合併請求創建/編輯頁面等。
// @icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxXzQ0LWdpdGxhYiI+PGc+PGcgaWQ9IlhNTElEXzZfIj48Zz48Zz48cGF0aCBkPSJNNTIuNzUyLDIwNS41MDFsMjAzLjE4LDI2NC4wN2wtMjIyLjctMTY1LjI5Yy02LjExLTQuNTktOC43Mi0xMi41OC02LjM4LTE5Ljc3MWwyNS44Ny03OS4wNSAgICAgICBMNTIuNzUyLDIwNS41MDF6IiBzdHlsZT0iZmlsbDojRkNBMzI2OyIvPjwvZz48Zz48cG9seWdvbiBwb2ludHM9IjE3MS4zMDIsMjA1LjQ2MSAyNTYuMDEyLDQ2OS41NDEgMjU1LjkzMiw0NjkuNTcxIDUyLjc1MiwyMDUuNTAxIDUyLjgxMiwyMDUuNDYxICAgICAgICAgICAgICIgc3R5bGU9ImZpbGw6I0ZDNkQyNjsiLz48L2c+PGc+PHBvbHlnb24gcG9pbnRzPSIzNDAuNzMxLDIwNS40NjEgMjU2LjAyMSw0NjkuNTcxIDI1Ni4wMTIsNDY5LjU0MSAxNzEuMzAyLDIwNS40NjEgMTcxLjM5MiwyMDUuNDYxICAgICAgICAzNDAuNjQyLDIwNS40NjEgICAgICAiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjxnPjxwb2x5Z29uIHBvaW50cz0iNDU5LjI5MiwyMDUuNTAxIDI1Ni4wMjEsNDY5LjU3MSAzNDAuNzMxLDIwNS40NjEgNDU5LjIzMSwyMDUuNDYxICAgICAgIiBzdHlsZT0iZmlsbDojRkM2RDI2OyIvPjwvZz48Zz48cGF0aCBkPSJNNDg1LjE5MSwyODQuNTExYzIuMjQsNy4xOS0wLjI3LDE1LjE4MS02LjQ3LDE5Ljc3MWwtMjIyLjcsMTY1LjI5bDIwMy4yNzEtMjY0LjA3bDAuMDI5LTAuMDQgICAgICAgTDQ4NS4xOTEsMjg0LjUxMXoiIHN0eWxlPSJmaWxsOiNGQ0EzMjY7Ii8+PC9nPjxnPjxwYXRoIGQ9Ik00MDguNDcyLDQ4LjQyMWw1MC43NiwxNTcuMDRoLTExOC41aC0wLjA5bDUwLjg1LTE1Ny4wNCAgICAgICBDMzk0LjM2MSw0MC40MzEsNDA1LjY4Miw0MC40MzEsNDA4LjQ3Miw0OC40MjF6IiBzdHlsZT0iZmlsbDojRTI0MzI5OyIvPjwvZz48Zz48cGF0aCBkPSJNMTcxLjM5MiwyMDUuNDYxaC0wLjA5SDUyLjgxMmw1MC43Ni0xNTcuMDRjMi44Ny03Ljk5LDE0LjE5LTcuOTksMTYuOTgsMCAgICAgICBDMTIwLjU1Miw0OC40MjEsMTcxLjMwMiwyMDUuNDYxLDE3MS4zOTIsMjA1LjQ2MXoiIHN0eWxlPSJmaWxsOiNFMjQzMjk7Ii8+PC9nPjwvZz48L2c+PC9nPjwvZz48ZyBpZD0iTGF5ZXJfMSIvPjwvc3ZnPg==
// @version 13
// @author Arylo
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/settings\/ci_cd$/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/merge_requests\/new\b/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/.*\/-\/merge_requests\/\d+/edit\b/
// @include /^https:\/\/(git(lab)?|code)\.[^/]+\/dashboard\/merge_requests\b/
// @license MIT
// @homepage https://greasyfork.org/zh-CN/scripts/519026
// @supportURL https://greasyfork.org/zh-CN/scripts/519026/feedback
// @run-at document-end
// @grant GM_addStyle
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/519026/Enhance%20some%20features%20of%20the%20Self-managed%20Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/519026/Enhance%20some%20features%20of%20the%20Self-managed%20Gitlab.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/monkey/polyfill/GM.ts
  if (typeof window.GM === "undefined") {
    window.GM = {
      addStyle: GM_addStyle
    };
  }
  function getGMWindow() {
    return window;
  }

  // src/monkey/polyfill/GM_addStyle.ts
  var w = getGMWindow();
  if (typeof w.GM_addStyle === "undefined") {
    w.GM_addStyle = function GM_addStyle2(cssContent) {
      const head = document.getElementsByTagName("head")[0];
      if (head) {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.textContent = cssContent;
        head.appendChild(styleElement);
        return styleElement;
      }
      return null;
    };
  }
  if (typeof w.GM.addStyle === "undefined") {
    w.GM.addStyle = GM_addStyle;
  }

  // src/monkey/gitlab-enhance/settings/ci_cd.css
  var ci_cd_default = ".content-wrapper nav{max-width:100%}.content-wrapper .container-fluid{max-width:100%}.ci-variable-table table colgroup col:nth-child(3){width:100px}.ci-variable-table table colgroup col:nth-child(4){width:200px}.ci-variable-table table colgroup col:nth-child(5){width:50px}\n";

  // src/monkey/gitlab-enhance/settings/ci_cd.ts
  if (location.pathname.endsWith("/-/settings/ci_cd")) {
    setTimeout(() => GM_addStyle(ci_cd_default), 25);
  }

  // src/monkey/gitlab-enhance/dashboard/merge_requests.ts
  var hyperlinkResource = () => {
    const mergeRequests = $(".merge-request:not([hyperlinked])");
    mergeRequests.each((_, mergeRequestEle) => {
      const href = $(".js-prefetch-document", mergeRequestEle).attr("href");
      if (!href) return;
      const resourceUrl = href.replace(/\/-\/merge_requests\/\d+$/, "");
      const rawRefEle = $(".issuable-reference", mergeRequestEle);
      const rawRefName = rawRefEle.text();
      const [resourceName, number] = rawRefName.split("!");
      rawRefEle.html(`<a href="${resourceUrl}">${resourceName}</a>!${number}`);
      $(mergeRequestEle).attr("hyperlinked", "");
    });
  };
  if (location.pathname.endsWith("/dashboard/merge_requests")) {
    $(".issuable-list").on("mouseenter", hyperlinkResource);
    setTimeout(hyperlinkResource, 1e3);
  }

  // src/monkey/gitlab-enhance/utils.ts
  var getButtonElement = (text2) => {
    const classnames = "gl-font-sm! gl-ml-3 gl-button btn btn-default btn-sm";
    return $(`<a class="${classnames}">${text2}</a>`);
  };

  // packages/MdGenerator/MdTools.ts
  var INDENT_SPACE_LENGTH = 2;
  function indent(level, content = "") {
    return `${Array((level - 1) * INDENT_SPACE_LENGTH).fill(" ").join("")}${content}`;
  }
  function enter() {
    return "\n";
  }
  var header = (level) => (text2 = "") => `${Array(level).fill("#").join("")} ${text2}`.trim();
  function h1(...args) {
    return header(1)(...args);
  }
  function h2(...args) {
    return header(2)(...args);
  }
  function h3(...args) {
    return header(3)(...args);
  }
  function h4(...args) {
    return header(4)(...args);
  }
  function h5(...args) {
    return header(5)(...args);
  }
  function text(content = "") {
    return content;
  }
  function anchor(key, url) {
    return `[${key}]: ${url}`;
  }
  function hyperlink(label, url) {
    return `[${label}](${url})`;
  }
  function hyperlinkWithKey(label, key) {
    return `[${label}][${key}]`;
  }
  function image(url, alt = "") {
    return `!${hyperlink(alt, url)}`;
  }
  function imageByKey(key, alt = "") {
    return `!${hyperlinkWithKey(alt, key)}`;
  }
  function listItem(text2 = "") {
    return `- ${text2}`.trimEnd();
  }
  function taskItem(text2 = "", { selected = false } = {}) {
    return `[${selected ? "x" : " "}] ${text2}`.trimEnd();
  }

  // packages/MdGenerator/index.ts
  function getOption(options, key, defaultValue) {
    return options[key] ?? defaultValue;
  }
  function getLevelFromOptions(options = {}) {
    const { level = 1 } = options;
    return level;
  }
  function cloneDeep(value) {
    return JSON.parse(JSON.stringify(value));
  }
  var Template = class {
    constructor(text2) {
      this.anchorMap = {};
      this.templateContent = text2;
      this.headerNextUtils = {
        text: this.text.bind(this),
        image: this.image.bind(this),
        hyperlink: this.hyperlink.bind(this),
        listItem: this.listItem.bind(this),
        taskItem: this.taskItem.bind(this)
      };
      this.contentNextUtils = {
        ...this.headerNextUtils,
        end: this.emptyLine.bind(this)
      };
    }
    h1(text2) {
      this.text(h1(text2));
      this.emptyLine();
      return this.headerNextUtils;
    }
    h2(text2) {
      this.text(h2(text2));
      this.emptyLine();
      return this.headerNextUtils;
    }
    h3(text2) {
      this.text(h3(text2));
      this.emptyLine();
      return this.headerNextUtils;
    }
    h4(text2) {
      this.text(h4(text2));
      this.emptyLine();
      return this.headerNextUtils;
    }
    h5(text2) {
      this.text(h5(text2));
      this.emptyLine();
      return this.headerNextUtils;
    }
    [Symbol.toStringTag]() {
      return [
        this.templateContent,
        this.templateContent && !/\n$/.test(this.templateContent) && enter(),
        Object.keys(this.anchorMap).length && enter(),
        Object.entries(this.anchorMap).map(([key, value]) => anchor(key, value)).join(enter()),
        Object.keys(this.anchorMap).length && enter()
      ].filter(Boolean).join("").replace(/\n(\s*\n){2,}/g, "\n\n");
    }
    text(content = "", opts) {
      this.templateContent += indent(getLevelFromOptions(opts), `${text(content)}${enter()}`);
      return this.contentNextUtils;
    }
    listItem(text2 = "", opts) {
      return this.text(listItem(text2), { level: getLevelFromOptions(opts) });
    }
    taskItem(text2 = "", opts) {
      return this.listItem(taskItem(text2, { selected: getOption(opts || {}, "selected", false) }), { level: getLevelFromOptions(opts) });
    }
    hyperlink(text2, link, opts) {
      let content;
      const anchorKey = getOption(opts || {}, "anchorKey", "");
      if (typeof anchorKey === "string" && anchorKey.length) {
        anchor(anchorKey, link);
        content = hyperlinkWithKey(text2, anchorKey);
      } else {
        content = hyperlink(text2, link);
      }
      return this.text(content, { level: getLevelFromOptions(opts) });
    }
    image(url, opts) {
      let content;
      const anchorKey = getOption(opts || {}, "anchorKey", "");
      const alt = getOption(opts || {}, "alt", "");
      if (typeof anchorKey === "string" && anchorKey.length) {
        this.anchor(anchorKey, url);
        content = imageByKey(alt, anchorKey);
      } else {
        content = image(alt, url);
      }
      return this.text(content, { level: getLevelFromOptions(opts) });
    }
    table(opts) {
      const tableMap = { header: [], body: [] };
      const actionMap = {
        header: (row) => {
          row.forEach(({ key, title }) => {
            tableMap.header.push({ key, title });
          });
          return actionMap;
        },
        body: (row) => {
          tableMap.body.push(row);
          return actionMap;
        },
        end: () => {
          if (!tableMap.header.length) return "";
          const { header: header2, body } = tableMap;
          const headerContent = header2.map(({ title }) => `|${title}`).join("") + "|";
          this.text(headerContent, { level: getLevelFromOptions(opts) });
          const separator = header2.map(() => "|--").join("") + "|";
          this.text(separator, { level: getLevelFromOptions(opts) });
          body.forEach((row) => {
            const content = header2.map(({ key }) => `|${(row[key] ?? "").toString().replace(/\|/g, "|")}`).join("") + "|";
            this.text(content, { level: getLevelFromOptions(opts) });
          });
        }
      };
      return actionMap;
    }
    anchor(key, link) {
      this.anchorMap[key] = link;
    }
    emptyLine() {
      if (!this.templateContent.endsWith(enter())) {
        this.templateContent += enter();
      }
      this.templateContent += enter();
    }
    modify(callback) {
      this.templateContent = callback(cloneDeep(this.templateContent));
      return this.contentNextUtils;
    }
  };
  var genTemplate = (callback = () => {
  }) => {
    return readTemplate("", callback);
  };
  var readTemplate = (text2, callback = () => {
  }) => {
    const templateInst = new Template(cloneDeep(text2));
    callback(templateInst);
    return templateInst[Symbol.toStringTag]();
  };

  // src/monkey/gitlab-enhance/merge_requests/template.css
  var template_default = ".gl-display-flex:has([for=merge_request_description]){align-items:baseline}\n";

  // src/monkey/gitlab-enhance/merge_requests/template.ts
  var getBranchType = () => {
    const fromBranchName = $(".align-self-center code:not([data-branch-name])").text();
    const prefixBranchName = fromBranchName.split("/")[0].toLowerCase();
    switch (prefixBranchName) {
      case "feature":
      case "feat":
        return 0 /* FEATURE */;
      case "fix":
      case "bugfix":
        return 1 /* BUGFIX */;
      case "hotfix":
        return 2 /* HOTFIX */;
      case "devops":
      case "chore":
      case "test":
      case "doc":
      case "docs":
        return 3 /* TASKS */;
      default:
        return 4 /* OTHERS */;
    }
  };
  var generateTemplate = () => {
    const branchType = getBranchType();
    return genTemplate((utils) => {
      utils.h2("Type").taskItem("Feature (Story/Refactor)", { selected: branchType === 0 /* FEATURE */ }).taskItem(`Bugfix`, { selected: branchType === 1 /* BUGFIX */ }).taskItem(`Hotfix (Production Issues)`, { selected: branchType === 2 /* HOTFIX */ }).taskItem(`Tasks (DevOps / Unit Test / Document Update)`, { selected: branchType === 3 /* TASKS */ }).taskItem(`Others`, { selected: branchType === 4 /* OTHERS */ }).end();
      utils.h2("Description");
      if (branchType !== 0 /* FEATURE */) {
        utils.h3("Why (Why does this happen?)").listItem().end();
        utils.h3("How (How can we avoid or solve it?)").listItem().end();
      }
      utils.h3("What (What did you do this time?)").listItem().end();
      if (branchType !== 3 /* TASKS */) {
        utils.h3("Results (Screenshot, etc)");
        utils.h4("Before modification");
        utils.h4("After modification");
        utils.h2("Affected Zone").listItem("Affected Module(s):").listItem("Affected URL(s):").end();
      }
      utils.h2("External resources (Mention, Resolves, or Closes)");
    });
  };
  var appendTemplateButton = () => {
    GM_addStyle(template_default);
    const text2 = "Copy Template";
    const btnElement = getButtonElement(text2);
    const templateContent = generateTemplate();
    const hint = $('<span class="gl-font-sm! gl-ml-3 gl-text-secondary"></span>');
    let setTimeoutId;
    btnElement.on("click", async () => {
      hint.remove();
      setTimeoutId && clearTimeout(setTimeoutId);
      hint.text("Copying...");
      btnElement.after(hint);
      await GM_setClipboard(templateContent, "text", () => {
        hint.text("Copied!");
        setTimeoutId = setTimeout(() => hint.remove(), 3e3);
      });
    });
    $("*:has(>[for=merge_request_description])").append(btnElement);
  };

  // src/monkey/gitlab-enhance/merge_requests/new.ts
  var appendAsTitleButton = () => {
    $(".commit-content").each((_, el) => {
      const titleElements = $(".item-title", el);
      const title = titleElements.text();
      const btnElement = getButtonElement("As title");
      btnElement.on("click", () => {
        $("input[data-testid=issuable-form-title-field]").val(title);
        $("input[data-testid=issuable-form-title-field]").focus();
      });
      $(".committer", el).before(btnElement);
    });
  };
  if (location.pathname.endsWith("/-/merge_requests/new")) {
    setTimeout(() => {
      appendTemplateButton();
      appendAsTitleButton();
    }, 1e3);
  }

  // src/monkey/gitlab-enhance/merge_requests/edit.ts
  if (/\/-\/merge_requests\/\d+\/edit$/.test(location.pathname)) {
    setTimeout(() => {
      appendTemplateButton();
    }, 1e3);
  }
})();
