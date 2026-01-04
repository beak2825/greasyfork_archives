// ==UserScript==
// @name               LoadAll
// @name:zh-CN         加载所有页
// @description        Load all the pages.
// @description:zh-CN  加载所有页面内容。
// @namespace          https://github.com/HaleShaw
// @version            1.0.0
// @author             HaleShaw
// @copyright          2021+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-LoadAll
// @supportURL         https://github.com/HaleShaw/TM-LoadAll/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqpJREFUWEfNV91x2kAQ3tUg4C2kgigz1klvgQpMKjCpAFKBoYKYCuJUgKnAdgUmFQS/SacX0oH8hhhG61mNjjkrEpLCz5gXodP+fLf73e4eQsWfZVmdZrN5jYhhFEXz1WoVsqpt2yNE/JGamUgpHyqaTMSwqrAQ4g8AdFP5uZRy5LquFccxr3fS9XCz2XxW4KrYrgOANIMvUsqO67r9OI6fdEdE1AuCYCmEGBDRJSIupZTzIjC5AGzb7iLiFRE9sjFWdhxnwQb5PxH9CoJgnF1HxN++7/cdxxkT0U/N6VRKeZMH4h8AmbCGhmH0PM9bMQdardYojuMwCII7ZUyt87vv+7f8zKSLl0Ip5ceqAN6E1TCMr57nLarkU8kIIZiIV5rOs5RS8eeNqdwUCCE47F8AoFBxH6A0hQz6AwC8EFFfpTKrV0hCTgWHvs7OdVlOTbvd7q7X64RDpmneI2IfAJZE9F0B2gG4uLi4bDQafw9xWgTWtu2n1LkS4ZPR29UB27ZvEfGayaJI9787z9MTQuhHOBFRxzWJgJZzfv1Wt5qVgRVCcCo/ZeuIHgEupzM+x1EUDepUsjLn/D1LSgAYqU1WroRVHO2TUaQEgJXOs7MBYHBp6Z4BgAUAd5vNZnI2ADmNi4m4QG6nADAEgElRsTg0/CnRuReotr0zieqIqEZyDGd5NnIaVCLGALixDNPqtGsyxwaSDjRcFfXjOD0bB3hDDMI0zRtEtIjogbvqWQHkRfX9AOBmtN1un49dBcu4lERAY+ijlHJQpnTM76oZsdN7fdY7ppN9tnYcYIaeOvx5Q877IeG5Qp71U3Qv4AlpeIrpqA6AkWEY3UNmRL4dlU1XJ+UAT0JlHbYygLSZzIhomjVaxVERx+oCWBiGMc7elHjoJKJB2W7zQLwCw2dToqZ5g1sAAAAASUVORK5CYII=
// @match              https://wenku.baidu.com/view/*
// @match              https://www.renrendoc.com/paper/*
// @compatible	       Chrome
// @grant              GM_addStyle
// @grant              GM_info
// @downloadURL https://update.greasyfork.org/scripts/440325/LoadAll.user.js
// @updateURL https://update.greasyfork.org/scripts/440325/LoadAll.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==
(function () {
  ("use strict");

  // 每次加载更多时的间隔时间（毫秒）
  const delayInterval = 2000;

  const selectorMap = {
    "wenku.baidu.com": "span.read-all.pay",
    "www.renrendoc.com": "span.moreBtn.goBtn",
  };

  main();

  function main() {
    logInfo(GM_info.script.name, GM_info.script.version);
    const selector = getSelector();
    loadAll(selector);
  }

  /**
   * Get the selector of the button reading more.
   * @returns selector string.
   */
  function getSelector() {
    const domain = document.domain;
    return selectorMap[domain];
  }

  function loadAll(selector) {
    let readMore = document.querySelector(selector);
    if (readMore) {
      readMore.click();
      setTimeout(() => {
        loadAll(selector);
      }, delayInterval);
    }
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = "color:white;background-color:#606060";
    const versionStyle = "color:white;background-color:#1475b2";
    const logTitle = " " + title + " ";
    const logVersion = " " + version + " ";
    console.log("%c" + logTitle + "%c" + logVersion, titleStyle, versionStyle);
  }
})();
