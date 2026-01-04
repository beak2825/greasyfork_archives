// ==UserScript==
// @name        Display Toc On kernel.org[JS|UI]
// @namespace   https://github.com/rikacelery
// @match       https://lore.kernel.org/*
// @grant       none
// @license     MIT
// @compatible  chrome
// @grant GM_addStyle
// @license MIT
// @version     0.0.3
// @author      RikaCelery
// @supportURL  https://github.com/RikaCelery/UserScriptSupport/issues
// @description 10/25/2024, 9:59:16 AM
// @downloadURL https://update.greasyfork.org/scripts/513979/Display%20Toc%20On%20kernelorg%5BJS%7CUI%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/513979/Display%20Toc%20On%20kernelorg%5BJS%7CUI%5D.meta.js
// ==/UserScript==
GM_addStyle(`
*{
  background: unset !important;
}
*.q {
  display: block;
  background: rgb(227, 249, 255)!important;
  width: fit-content;
  border-radius: 10px;
  padding: 10px;
  position: relative;
}
*.q::before{
  content: '';
  position: absolute;
  left: 5px;
  top: calc(10px);
  height: calc(100% - 2 * 10px);
  width: 5px;
  border-radius: 5px;
  background-color: rgb(166, 220, 228);
}

ul,body > form + pre {
  position: relative;
  background-color: rgba(200, 224, 228, 0.11)!important;
  width: fit-content!important;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  /* border: solid 1px rgba(39, 182, 175, 0.418); */
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.089);
}
body > form + pre {
  padding-left: 10px;
  padding-right: 10px;
}
ul li {
  background: transparent!important;
  width: fit-content!important;
}
ul::after{
  content: '';
  position: absolute;
  left: 0px;
  top: calc(3px);
  height: calc(100% - 2 * 3px);
  width: 2px;
  border-radius: 5px;
  background-color: rgba(65, 104, 101, 0.432);
}
body {
  display: flex;
  flex-direction: column;
}
body > pre.toc{
  position: fixed;
  top: 0;
  right: 0;
  width: fit-content;
  align-self: flex-end;
  z-index: 100;
  padding-left: 10px;
  padding-right: 10px;
}
body > pre.toc .container{
  /* display: flex;/ */
  /* flex-direction: column; */
}
body > pre.toc .container .item{
  white-space: pre;
  margin: 0;
  padding: 0;
  height: 1em;
  /* display: inline-block; */

  /* max-width:200px!important; */
  /* overflow: hidden; */
}`)
window.onload = () => {
  document.querySelectorAll("*.q").forEach((el) => {
    el.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        // console.log(child.textContent);
        //   child.textContent = child.textContent.replace(/^>\n\[\.\.\.\]/gm, "> [...]");
        // child.textContent = child.textContent.replace(/^>( |$)/gm, " ");
      }
      // if (child.nodeType === Node.ELEMENT_NODE) console.log(child.innerHTML);
    });
  });
  let pre = document.querySelectorAll("body > pre")[1];
  pre.remove();
  pre.classList.add("toc");
  document.body.insertBefore(pre, document.querySelector("body > form"));
  let tmp = [];
  /**
   * @type {{date:string,linkNode:ChildNode}[]}
   */
  let strucured = [];
  let parse = false;
  let toc = document.querySelector("pre.toc")
  toc.childNodes.forEach((node) => {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.textContent.indexOf(
        "-- links below jump to the message on this page --"
      ) != -1
    ) {
      parse = true;
      let idx =
        node.textContent.indexOf(
          "-- links below jump to the message on this page --"
        ) + "-- links below jump to the message on this page --".length;
      let tmpNode = document.createTextNode(node.textContent.substring(0, idx));
      tmp.push(tmpNode);
      node = document.createTextNode(node.textContent.substring(idx));
      console.log(idx, node.textContent, tmpNode.textContent);
    } else {
      if (!parse) tmp.push(node);
    }
    console.log(parse, node);
    if (parse) {
      if (node.nodeType === Node.TEXT_NODE) {
        let content = node.textContent.trim();
        if (!content) return;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(content)) {
          let match = /^\s*(.*)\s*(\d{4}-\d{2}-\d{2} +\d+:\d+.*)/gs.exec(content);
          console.log(content, match);
          content = match[2];
          strucured.push({
            date: content,
            linkNode: match[1],
          });
        } else
          strucured.push({
            date: content,
            linkNode: null,
          });
      } else {
        if (typeof strucured[strucured.length - 1].linkNode ==="string") {
            strucured[strucured.length - 1].linkNode.textContent += strucured[strucured.length - 1].linkNode;
        }
        strucured[strucured.length - 1].linkNode = node;
      }
    }
  });
  console.log(tmp);
  console.log(strucured);
  toc.innerHTML=""
  tmp.forEach(node=>toc.appendChild(node))
  let tocContainer = document.createElement("div")
  tocContainer.classList.add("container")
  strucured.forEach(item=>{
    let el = document.createElement("div")
    el.classList.add("item")
    el.innerHTML = `
    ${item.date}<a href="${item.linkNode.href}" id="${item.linkNode.id}">${item.linkNode.textContent}</a>
    `
    tocContainer.appendChild(el)
  })
  toc.appendChild(tocContainer)
};
