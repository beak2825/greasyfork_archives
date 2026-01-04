// ==UserScript==
// @name        提取HTML内容
// @namespace   LiuZhengdong's Script
// @match       https://*/*// ==UserScript==
// @name        提取HTML内容
// @namespace   LiuZhengdong's Script
// @match       https://*/*
// @license     MIT
// @grant       none
// @version     1.4
// @author      Liu
// @run-at      document-body
// @description 利用此插件只需要按住alt/option键即可提取html元素 2022/8/19 15:35:23
// 
// @downloadURL https://update.greasyfork.org/scripts/449825/%E6%8F%90%E5%8F%96HTML%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/449825/%E6%8F%90%E5%8F%96HTML%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(() => {

  /**
   * 设置选取框的背景颜色
   */
  let backgroundColor = "rgba(255,0,0,0.5)"
  /**
   * 设置选取框的边框颜色
   */
  let borderColor = "rgba(255,0,0,0.9)"
  /**
   * 设置复制文本的前缀
   */
  let preffix = `Come from [${document.title}](${window.location.href});\n`

  /**
   * 此方法用于自定义html的净化方法
   */
  function purifyHTML(purehtml) {
    let purifiedhtml = purehtml
    return purifiedhtml;
  }

  /**
   * 此方法自定义最终的HTML如何处理
   */
  function handleHTML(finalhtml) {
    navigator.clipboard.writeText(finalhtml).then(() => {
      l("截取HTML成功")
    })
  }

  let selectBox = CreateSelectBox();
  window.onmousemove = (ev) => {
    /**
     * 如果没有按住alt/option键的话
     */
    if (!ev.altKey) {
      HideSelectBox(selectBox);
      return;
    }
    selectBox.style.display = ""


    let element = document.elementsFromPoint(ev.clientX, ev.clientY)[1];

    let eleRect = element.getBoundingClientRect();
    let clientX = eleRect.left;
    let clientY = eleRect.top;
    let margin = 5;

    /**
     * Box的点击事件
     */
    selectBox.onclick = () => {
      let purehtml = element.outerHTML;
      let purifiedhtml = purifyHTML(purehtml)
      let finalhtml = preffix + purifiedhtml
      // let finalhtml = ExtraPureText(element)
      handleHTML(finalhtml)
    }
    //console.log(clientX,clientY,window.scrollY)

    //console.log(eleRect.left - margin)


    selectBox.style.position = "absolute";
    selectBox.style.left = window.scrollX + clientX - margin + 'px';

    //console.log(eleRect)
    //console.log(selectBox)
    selectBox.style.top = window.scrollY + clientY - margin + 'px';
    selectBox.style.width = eleRect.width + 2 * margin + 'px';
    selectBox.style.height = eleRect.height + 2 * margin + 'px';
    selectBox.style.zIndex = "99"

    //console.log(selectBox)

  }




  function l(elements) {
    console.log(elements)
    return elements
  }

  /**
   * 初始化一个盒子
   */
  function CreateSelectBox() {
    let selectBox = document.createElement("div");
    selectBox.style.backgroundColor = backgroundColor
    selectBox.style.borderStyle = "dashed";
    selectBox.style.borderWidth = "5px";
    selectBox.style.borderRadius = "5px";
    selectBox.style.borderColor = borderColor;
    selectBox.style.opacity = "0.5";
    selectBox.style.transitionProperty = "all"
    selectBox.style.transitionDuration = "0.5s"
    document.body.appendChild(selectBox);
    return selectBox;
  }

  /**
   * 隐藏选择框
   */
  function HideSelectBox(selectBox) {
    selectBox.style.display = "none";
  }




  String.prototype.removeBlankLines = function () {

    return this.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
  }


  class htmlTools {
    /**
   * 获取纯文本
   */
    ExtraPureText(node) {
      let queue = []
      let output = ""
      function ExtraNode(node) {
        if (node.hasChildNodes()) {
          node.childNodes.forEach((childnode) => {
            let nodeName = childnode.nodeName.toLowerCase()
            if (nodeName == "a" || nodeName == "#text" || nodeName == "#comment") {
              queue.push(childnode)
            } else {
              ExtraNode(childnode)
            }
          })
        }
      }
      ExtraNode(node)

      queue.forEach((node) => {
        //l(node.nodeName)
        if (node.nodeName.toLowerCase() == "a") {
          output += `[${node.innerText}](${node.getAttribute("href")})`;
        } else if (node.nodeName == "#text") {
          output += node.nodeValue
        }
      })

      return output.removeBlankLines()
    }
  }

})()

// @grant       none
// @version     1.2
// @author      Liu
// @license     MIT
// @run-at      document-body
// @description 利用此插件只需要按住alt/option键即可提取html元素 2022/8/19 15:35:23
// 
// ==/UserScript==

(() => {

  /**
   * 设置选取框的背景颜色
   */
  let backgroundColor = "rgba(255,0,0,0.5)"
  /**
   * 设置选取框的边框颜色
   */
  let borderColor = "rgba(255,0,0,0.9)"
  /**
   * 设置复制文本的前缀
   */
  let preffix = `Come from [${document.title}](${window.location.href});\n`

  /**
   * 此方法用于自定义html的净化方法
   */
  function purifyHTML(purehtml) {
    let purifiedhtml = purehtml
    return purifiedhtml;
  }

  /**
   * 此方法自定义最终的HTML如何处理
   */
  function handleHTML(finalhtml) {
    navigator.clipboard.writeText(finalhtml).then(() => {
      l("截取HTML成功")
    })
  }

  let selectBox = CreateSelectBox();
  window.onmousemove = (ev) => {
    /**
     * 如果没有按住alt/option键的话
     */
    if (!ev.altKey) {
      HideSelectBox(selectBox);
      return;
    }
    selectBox.style.display = ""


    let element = document.elementsFromPoint(ev.clientX, ev.clientY)[2];
    let eleRect = element.getBoundingClientRect();
    let clientX = eleRect.left;
    let clientY = eleRect.top;
    let margin = 5;

    /**
     * Box的点击事件
     */
    selectBox.onclick = () => {
      let purehtml = element.outerHTML;
      let purifiedhtml = purifyHTML(purehtml)
      let finalhtml = preffix + purifiedhtml;
      handleHTML(finalhtml)
    }
    //console.log(clientX,clientY,window.scrollY)

    //console.log(eleRect.left - margin)


    selectBox.style.position = "absolute";
    selectBox.style.left = window.scrollX + clientX - margin + 'px';

    //console.log(eleRect)
    //console.log(selectBox)
    selectBox.style.top = window.scrollY + clientY - margin + 'px';
    selectBox.style.width = eleRect.width + 2 * margin + 'px';
    selectBox.style.height = eleRect.height + 2 * margin + 'px';
    selectBox.style.zIndex = "99"

    //console.log(selectBox)

  }




  function l(elements) {
    console.log(elements)
    return elements
  }

  /**
   * 初始化一个盒子
   */
  function CreateSelectBox() {
    let selectBox = document.createElement("div");
    selectBox.style.backgroundColor = backgroundColor
    selectBox.style.borderStyle = "dashed";
    selectBox.style.borderWidth = "5px";
    selectBox.style.borderRadius = "5px";
    selectBox.style.borderColor = borderColor;
    selectBox.style.opacity = "0.5";
    selectBox.style.transitionProperty = "all"
    selectBox.style.transitionDuration = "0.5s"
    document.body.appendChild(selectBox);
    return selectBox;
  }


  function HideSelectBox(selectBox) {
    selectBox.style.display = "none";
  }





})()
