// ==UserScript==
// @name        Go Module 导入包添加跳转链接 - github.com
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/go.mod
// @grant       none
// @version     1.0.4
// @author      DeltaX
// @description 2020/9/1 下午11:58:28
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/410444/Go%20Module%20%E5%AF%BC%E5%85%A5%E5%8C%85%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%20-%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/410444/Go%20Module%20%E5%AF%BC%E5%85%A5%E5%8C%85%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%20-%20githubcom.meta.js
// ==/UserScript==

let goModPkgRequireUrlPattern = /<span.*>(\w+(?:\.\w+)*(?:\/\w[-\.\w]*)*)<.*>(?:v\d+(?:[\+\.-]\w*)*)/;
let goModPkgReplaceUrlPattern = /<span.*>(\w+(?:\.\w+)*(?:\/\w[-\.\w]*)*)<.*> =&gt; <.*>(\w+(?:\.\w+)*(?:\/\w[-\.\w]*)*)<.*>(?:v\d+(?:[\+\.-]\w*)*)<.*>/;
let goModPkgReplaceUrlBeforeSubpattern = /(\w+(?:\.\w+)*(?:\/\w[-\.\w]*)*) =&gt;/;
let goModPkgReplaceUrlAfterSubpattern = /=&gt; (\w+(?:\.\w+)*(?:\/\w[-\.\w]*)*)/;

document.querySelectorAll('.blob-code-inner').forEach(node => {
  let matchs = goModPkgReplaceUrlPattern.exec(node.innerHTML);
  if (matchs !== null) {
    docTag = `<a href="https://pkg.go.dev/${matchs[1]}?tab=overview">${matchs[1]}</a>`;
    node.innerHTML = node.innerHTML.replace(goModPkgReplaceUrlBeforeSubpattern, docTag + ' =>');
    docTag = `<a href="https://pkg.go.dev/${matchs[2]}?tab=overview">${matchs[2]}</a>`;
    node.innerHTML = node.innerHTML.replace(goModPkgReplaceUrlAfterSubpattern, '=> ' + docTag);
  } else {
    let matchs = goModPkgRequireUrlPattern.exec(node.innerHTML);
    if (matchs !== null) {
      docTag = `<a href="https://pkg.go.dev/${matchs[1]}?tab=overview">${matchs[1]}</a>`;
      node.innerHTML = node.innerHTML.replace(matchs[1], docTag);
    }
  }
});
