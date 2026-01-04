// ==UserScript==
// @name         Open All Links(批量打开网页链接)
// @namespace    http://openalllinks.net/
// @version      1.62
// @description  Select and open links within a selected area using Ctrl + mouse selection, even if the area is small and does not completely contain the link element. 
//                It selects the links that intersect with the selection rectangle.
// @match        http*://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463521/Open%20All%20Links%28%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463521/Open%20All%20Links%28%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%29.meta.js
// ==/UserScript==

(function() {
  let isSelecting = false;
  let startX, startY, currentX, currentY;
  let selectionDiv;

  document.addEventListener("mousedown", (event) => {
    if (event.ctrlKey && event.button === 0) {
      isSelecting = true;
      startX = event.pageX;
      startY = event.pageY;
      currentX = startX;
      currentY = startY;
      selectionDiv = createSelectionDiv(startX, startY);
      document.body.appendChild(selectionDiv);
      event.preventDefault();
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (isSelecting) {
      currentX = event.pageX;
      currentY = event.pageY;
      updateSelectionDiv(startX, startY, currentX, currentY);

      const links = document.getElementsByTagName("a");
      const selectedLinks = [];
      const selectionRect = selectionDiv.getBoundingClientRect();
      for (let i = 0; i < links.length; i++) {
        const linkClientRects = links[i].getClientRects();
        for (let j = 0; j < linkClientRects.length; j++) {
          const linkRect = linkClientRects[j];
          if (
            linkRect.left <= selectionRect.right &&
            linkRect.right >= selectionRect.left &&
            linkRect.top <= selectionRect.bottom &&
            linkRect.bottom >= selectionRect.top
          ) {
            selectedLinks.push(links[i]);
            break;
          }
        }
      }
      highlightSelectedLinks(selectedLinks);
    }
  });

  document.addEventListener("mouseup", (event) => {
    if (isSelecting) {
      isSelecting = false;
      const selectedLinks = getSelectedLinks();
      for (let i = 0; i < selectedLinks.length; i++) {
        const link = selectedLinks[i];
        link.style.outline = "";
        window.open(link.href);
      }
      document.body.removeChild(selectionDiv);
      event.preventDefault();
    }
  });

  window.addEventListener("scroll", () => {
    if (isSelecting) {
      const { top: startTop, left: startLeft } = selectionDiv.getBoundingClientRect();
      const newTop = startTop + window.scrollY;
      const newLeft = startLeft + window.scrollX;
      selectionDiv.style.top = newTop + "px";
      selectionDiv.style.left = newLeft + "px";
    }
  });

  function createSelectionDiv(startX, startY) {
    const div = document.createElement("div");
    div.id = "selection-div";
    div.style.position = "absolute";
    div.style.border = "1px dashed black";
    div.style.background = "rgba(0, 0, 0, 0.1)";
    div.style.left = startX + "px";
    div.style.top = startY + "px";
    return div;
  }

  function updateSelectionDiv(startX, startY, currentX, currentY) {
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    selectionDiv.style.left = left + "px";
    selectionDiv.style.top = top + "px";
    selectionDiv.style.width = width + "px";
    selectionDiv.style.height = height + "px";
  }

  function highlightSelectedLinks(selectedLinks) {
    const allLinks = document.getElementsByTagName("a");
    for (let i = 0; i < allLinks.length; i++) {
      if (selectedLinks.includes(allLinks[i])) {
        allLinks[i].style.outline = "2px solid red";
      } else {
        allLinks[i].style.outline = "";
      }
    }
  }

  function getSelectedLinks() {
    const links = document.getElementsByTagName("a");
    const selectedLinks = [];
    const selectionRect = selectionDiv.getBoundingClientRect();
    for (let i = 0; i < links.length; i++) {
      const linkClientRects = links[i].getClientRects();
      for (let j = 0; j < linkClientRects.length; j++) {
        const linkRect = linkClientRects[j];
        if (
          linkRect.left <= selectionRect.right &&
          linkRect.right >= selectionRect.left &&
          linkRect.top <= selectionRect.bottom &&
          linkRect.bottom >= selectionRect.top
        ) {
          selectedLinks.push(links[i]);
          break;
        }
      }
    }
    return selectedLinks;
  }
  
  // 在菜单中添加一个选项
    GM_registerMenuCommand('打开链接', async function() {
        // 弹出输入框
        const linksInput = prompt('请输入链接，以换行分隔：', '');

        // 如果用户点击了取消按钮或者没有输入链接，则不执行后续操作
        if (!linksInput) {
            return;
        }

        // 将输入的链接以换行分隔转换成数组
        const linksArray = linksInput.split('\n');

        // 遍历链接数组，逐个打开链接
        for (const link of linksArray) {
            // 使用GM_openInTab打开链接
            GM_openInTab(link, { active: true, insert: true, setParent: true });
        }
    });
})();

