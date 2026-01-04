// ==UserScript==
// @name         Jira Enhance
// @namespace    https://github.com/codeshareman/useful-scripts.git
// @version      2025-05-11
// @description  Enhance Jira Features: Copy Commit Message
// @author       zz_captain_zz
// @match        // TODO: match your jira issue link
// @include      // TODO: match your jira issue link
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAHXRFWHRqaXJhLXN5c3RlbS1pbWFnZS10eXBlAGF2YXRhcuQCGmEAAAT1SURBVHja7Vj7U1R1FPevSBNQJMCSSHkoOmZOWtlMU2mvGWd0QlkhGZCXUmrAIpSigwiRmRmgJCK+ISRQWBgVSwFXWFNEIclYaJNdiKWFZTndc5u1/d5z9+6rH2zmnpkzs7Nz7rnn8/2ex+fcKfA/lykyABmADEAGIAOQAcgAniQAV5rvgDKrgtHcfZUwOTnptNPR0THI+vwk8aPV6h/bDA2NQlV1C3y26xQkbymBxJRiyMyugNNnf4JHj/50H8ANdQ94+UbDU17rH6uX7wZo73jgtNOaH9qY51HDF30MRqMJxsbMkJtXCf7PxREbq870/wjSM4/z9i4DMJsnYPkKJXG6c/dppwHExn9Dnk9XloPJZAZFzH6Y6r3ebvC2uur93TA8POp6DeQXVhNni5ZsA4vFcRoZhowQNC+ReXaqdxSob/bA/q9r+d/OBG/VNA64VPaKAui6pwVf/42Mo6d9FFx6dTsEUFunJkG8/GoGf5IhC7Yw/3vPioaMHcf59Lzb1QcHDtaC3+xYxiYwKB60/XrXAFgsFv76hIFgkTmSuIRD5Lm8/CpQt/8C02duYP7fllZGmkPx4QZyS7UX1K630SPfNdJCXJgqmUZ6wwi8EJbM3twMBfT0DICqSUPS6uqPncRH/4ABvARAS482uQ6gr28QAufEExDXW+/ZdVZ38Saxf+udXTzothvd3A0oGADXrncRHwO/G/iuZ+vjfE2b6wDwatcpCklAn2Ycs+tsU9K3xL74sOqf4jYYITgkSdDZzhAf5RWXmRSaFRjL36Bbk7jq+xYSUChXiNjLSffhApwXvpkUqe1QytlzhgnON2AjV7h10Kcd5E/+xMlmeDZ4E+MjIblIcohKAtDrRyA4NJmAaL5Kc/difTuxW7uugLH5yzTOzYGvYJpPFKkTYdrgrMD0wxg84kI44oWBpW4tJXYJKUUkgLPnroHYoMS0mvFMjGT/x/Y64s4kFsqlK7eJ87nhKTzf+ZfXGCFkPps+AXPiRAPAbrTwxa0OBxgOQ2ypExMWzwBgoBEiL8RArFLf0EHoAeauUCq5mvLxiyHps3R5Gry0LI2kEWo2RwqlQDhFp3dknyCOMbWskrSZTbNp3NRubLrF+NDphgnFwJvQ3OrlA0T99eEfsPK9HIGvKKiuafUMgEbTS6YjFjfSA54iCNInNIJ2qoOHLjA207mTx7khFJ1uCILmJpJZgrXjNoDx8Ql45fVMcgs44htUHaSrKLkCFMoHq3MZmwWLPxFtx2KNAweq7S7h1kZW8OV5AgBpMy4j7O4QzU9doURwAdvavf1ujt137eW4kzCNfr790DMAD3p1hIzh0MFuI2SeYkUXxvEoW7vFS7fzpFFMtqeXkULvvPubZwCQz4gxVKHmf1Et+vybq3Yydn4cRbjTSYNC8CveyHKaUru01CMrlAoeqQHyejHZk3uOTurIAn43tj2kklIVaRhWQugxABzrwj5uqyu5vLbHW+5390OAyB687DUl7N1XBUUlDRAde4BPFyHtxkX/P/usEinCUK2KO4SU4MYlDNCRRkYVgslOt3ILADJUsb0WWx3uEFKCt4M1InWLtlxq9Zo8GPSUzIlRi9nPx4uelLPS0nof1nyYT7qaVcMiUrmUqufmj/nJ/jKHNaVq1EBZ+SUoOaLi2St2Jlc+osnfRmUAMgAZgAxABiADkAF4IH8DHJ9HZXOkDL4AAAAASUVORK5CYII=
// @grant        GM.setClipboard
// @grant        GM.addStyle
// @run-at       document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/535644/Jira%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/535644/Jira%20Enhance.meta.js
// ==/UserScript==

const DELAY_MILLI_SECONDS = 1000;

const style = `
  #jira-enhance-copy-button {
    position: relative;
    color: var(--jira-issue-status-default-color);
    background-color: var(--jira-issue-status-default-bgcolor);
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px 12px;
    margin-top: 10px;
    border-radius: 3.01px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

 #jira-enhance-copy-button:hover {
    background-color: var(--jira-issue-status-hover-default-bgcolor);
 }

 #jira-enhance-copy-button-message {
    position: absolute;
    padding: 4px 8px;
    border-radius: 3px;
    bottom: -100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #e6e6e6;
    font-size: 12px;
    color: var(--jira-issue-status-default-color);
    z-index: 1000;
    color: var(--jira-issue-status-default-color);;
    opacity: 0;
    transition: opacity 0.3s ease;
 }
 #jira-enhance-copy-button-message.active {
    opacity: 1;
 }
 #jira-enhance-copy-button-message::before {
    content: "";
    position: absolute;
    top: -5px;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid#e6e6e6;
    transform: translateX(-50%);
 }
`;

GM.addStyle(style);

(function () {
  "use strict";

  function runScript(
    config = {
      summaryId: "#summary-val",
      issueKeyId: "#key-val",
      toolbarPrimaryId:
        "#stalker > div > div.command-bar > div > div > div > div.aui-toolbar2-primary",
    }
  ) {
    try {
      // Your code here...
      const $summary = document.querySelector(config.summaryId);
      const $issue_key = document.querySelector(config.issueKeyId);
      const $toolbar_primary = document.querySelector(config.toolbarPrimaryId);

      const metadata = {
        issue_key: $issue_key.textContent,
        summary: $summary.textContent,
      };

      /**
       * Git Enhance
       */
      const git = {
        generateCommitMsg(issueKey, summary, options = { prefix: "fix:" }) {
          const { prefix } = options;
          const commitMsg = `${prefix} [${issueKey}] ${summary}`;
          return commitMsg;
        },
      };

      /**
       * Jira Enhance
       */
      const jira = {
        getIssueInfo(metadata) {
          return {
            issue_key: metadata.issue_key,
            summary: metadata.summary,
            commit_msg: git.generateCommitMsg(
              metadata.issue_key,
              metadata.summary
            ),
          };
        },
        logIssueInfo(info) {
          group("=== Jira Enhance Message ===");
          Object.entries(info).forEach(([key, value]) => {
            log("info")(key, value);
          });
          groupEnd();
        },
      };

      const issueInfo = jira.getIssueInfo(metadata);

      // 添加复制按钮
      appendCopyButton($toolbar_primary, issueInfo.commit_msg);

      // 打印issue信息
      jira.logIssueInfo(issueInfo);
    } catch (error) {
      log("error")(error);
    }
  }

  window.addEventListener("load", () => {
    runScript();
  });
})();

// DOM
function appendCopyButton(target, copyText = "") {
  if (!target) {
    throw new Error("target is required");
  }
  const $button = createToolbarButton({
    onClick: () => {
      GM.setClipboard(JSON.stringify(copyText));
      const $message = $button.querySelector(
        "#jira-enhance-copy-button-message"
      );
      $message.classList.add("active");
      setTimeout(() => {
        $message.classList.remove("active");
      }, DELAY_MILLI_SECONDS);
      log("info")("Copy to clipboard");
    },
  });
  appendToolbarButton(target, $button);
}

function createToolbarButton(buttonProperties) {
  const defaultProperties = {
    id: "jira-enhance-copy-button",
    icon: "fa-solid fa-clipboard",
    text: "复制提交信息",
    onClick: () => {},
  };
  const { id, icon, text, onClick } = {
    ...defaultProperties,
    ...buttonProperties,
  };
  const $button = document.createElement("div");
  const $message = document.createElement("div");
  $button.id = id;
  $button.innerHTML = `<i class="${icon}"></i> ${text}`;
  $button.addEventListener("click", onClick);
  $message.id = `${id}-message`;
  $message.innerHTML = `Copied`;
  $button.appendChild($message);
  return $button;
}

function appendToolbarButton(target, button) {
  if (!target) {
    throw new Error("target is required");
  }
  if (!button) {
    throw new Error("button is required");
  }
  const isCopyButtonExist = target.querySelector(`#${button.id}`);
  if (isCopyButtonExist) return;
  target.appendChild(button);
}

/**
 * Common Utils
 */
function debounce(
  fn,
  options = { delay: DELAY_MILLI_SECONDS, immediate: false }
) {
  const { delay, immediate } = options;
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    if (immediate && !timer) {
      fn.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

function throttle(
  fn,
  options = { delay: DELAY_MILLI_SECONDS, immediate: false }
) {
  const { delay, immediate } = options;
  let timer = null;
  let isFirst = true;
  return function (...args) {
    if (timer) return;
    if (immediate && isFirst) {
      fn.apply(this, args);
      isFirst = false;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * Console Utils
 */
function log(type) {
  const typeColor = {
    info: "#0000FF",
    warn: "#FFA500",
    error: "#FF0000",
  };
  return function (...args) {
    const color = typeColor[type] || "#000";
    const style = `background-color: ${color}; color: #fff;`;
    console.error(`%c[${type}]`, style, ...args);
  };
}

function group(...args) {
  const style = `background-color:#cf1fdc; color: #fff;`;
  console.group.call(console, `%c${args[0]}`, style, ...args.slice(1));
}

function groupEnd(...args) {
  console.groupEnd.call(console, ...args);
}
