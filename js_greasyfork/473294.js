// ==UserScript==
// @name         FUCKADS/广告标记去除
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  标记去处sb广告和丑不拉几不想看到的网页元素
// @author       Gwen
// @license      MIT
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-body
// @homepageURL  https://greasyfork.org/zh-CN/scripts/473294-ads-%E5%B9%BF%E5%91%8A%E6%A0%87%E8%AE%B0%E5%8E%BB%E9%99%A4
// @downloadURL https://update.greasyfork.org/scripts/473294/FUCKADS%E5%B9%BF%E5%91%8A%E6%A0%87%E8%AE%B0%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/473294/FUCKADS%E5%B9%BF%E5%91%8A%E6%A0%87%E8%AE%B0%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.fuck = function(content) {
    console.log('%c' + content, 'color:blue')
  }
  var savedRules = []
  var isSelected = false
  var isMaskShow = true
  var lastSelectedElement = null
  loadRules()
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999999999999';
  document.body.append(overlay);
  const notice = document.createElement('div')
  notice.innerText = '点击网页元素进行选择'
  notice.style.position = 'fixed';
  notice.style.bottom = '50px';
  notice.style.left = '20px';
  notice.style.zIndex = '1000000999999';
  notice.style.fontSize = '18px';
  notice.style.fontWeight = '550';
  notice.style.color = 'rgb(245, 245, 245)'
  notice.style.pointerEvents = 'none';
  document.body.append(notice)
  const tools = document.createElement('div')
  tools.style.position = 'fixed';
  tools.style.bottom = '0';
  tools.style.left = '20px';
  tools.style.zIndex = '1000000999999';
  const buttonStyle = `background-color: #4CAF50;border: none;color: white;padding: 10px 20px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;border-radius: 4px;`;
  const selectParentButton = createButton("选择父元素", e => {
    if (!lastSelectedElement) {
      alert('请先点击一个网页元素')
      return
    }
    if (!lastSelectedElement.parentElement || lastSelectedElement.parentElement == document.body) {
      alert('父元素不存在')
      return
    }
    clearRectangles()
    draw(lastSelectedElement.parentElement)
    console.log('选择', lastSelectedElement.parentElement)
    lastSelectedElement = lastSelectedElement.parentElement
  });
  const toggleButton = createButton("隐藏/显示", e => {
    if (!lastSelectedElement) {
      alert('请先点击一个网页元素')
      return
    }
    let sameClassElements = []
    if (lastSelectedElement.className) {
      sameClassElements = document.getElementsByClassName(lastSelectedElement.className)
    }
    if (!lastSelectedElement.style.display || lastSelectedElement.style.display != 'none') { //隐藏元素
      lastSelectedElement.style.display = 'none'
      for (let elem of sameClassElements) {
        elem.style.display = 'none'
      }
    } else { //显示元素
      let originalDisplayType = lastSelectedElement.getAttribute('display-type')
      lastSelectedElement.style.display = originalDisplayType
      for (let elem of sameClassElements) {
        elem.style.display = originalDisplayType
      }
    }
  });
  const removeButton = createButton("移除", e => {
    if (!lastSelectedElement) {
      alert('请先点击一个网页元素')
      return
    }
    let record = confirm('下次进入页面是否阻止其显示？\nSelector: ' + getSelectorPath(lastSelectedElement))
    if (record) {
      savedRules.push(getSelectorPath(lastSelectedElement))
      saveRules()
    }
    if (lastSelectedElement.className) {
      let sameClassElements = document.querySelectorAll(getSelectorPath(lastSelectedElement))
      for (let sameClassElement of sameClassElements) {
        sameClassElement.remove()
      }
    } else {
      lastSelectedElement.remove();
    }
    clearRectangles();
  });
  const showRuleBoxButton = createButton("已记录元素", e => {
    if (ruleBox.style.display != 'none') {
      ruleBox.style.display = 'none'
    } else {
      ruleBox.style.display = 'block'
    }
  })
  const exitButton = createButton("退出", e => {
    overlay.style.display = 'none';notice.style.display = 'none';tools.style.display = 'none';ruleBox.style.display = 'none';
    menuButton.style.display = 'block';
    clearRectangles()
    lastSelectedElement = null
  });
  tools.append(selectParentButton)
  tools.append(toggleButton)
  tools.append(removeButton)
  tools.append(showRuleBoxButton)
  tools.append(exitButton)
  document.body.append(tools)
  function createButton(text, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    button.style = buttonStyle
    return button;
  }

  const ruleBox = document.createElement('div')
  ruleBox.style = "position:fixed;bottom:60px;right:10px;z-index:1000000999999;max-height:200px;overflow:auto;"
  ruleBox.title = '已存储的广告元素标识'
  document.body.append(ruleBox)
  function createRuleItem(rule) {
    const ruleItem = document.createElement("div");
    ruleItem.style = 'background-color:rgba(241,241,241,0.4);padding:5px;margin-bottom:5px;display:flex;align-items:center;width:200px;';
    const ruleText = document.createElement("span");
    ruleText.style = 'flex-grow:1;word-break:break-all;color:aquamarine';
    ruleText.textContent = rule;
    ruleItem.appendChild(ruleText);
    const deleteButton = document.createElement("button");
    deleteButton.style = 'width:20px;height:20px;line-height:20px;text-align:center;background-color:#ccc;color:#fff;border:none;cursor:pointer;';
    deleteButton.className = "delete-button";
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => {
      if (!confirm('是否删除该条规则？')) {
        return
      }
      const index = savedRules.indexOf(rule);
      if (index !== -1) {
        savedRules.splice(index, 1);
        ruleItem.remove();
        saveRules()
      }
    });
    ruleItem.appendChild(deleteButton);
    return ruleItem;
  }

  function renderRuleBox() {
    ruleBox.innerHTML = "";
    savedRules.forEach(rule => {
      const ruleItem = createRuleItem(rule);
      ruleBox.appendChild(ruleItem);
    });
  }
  renderRuleBox();

  const menuButton = document.createElement('div')
  menuButton.style = 'position:fixed;z-index:100000000000;right:0;top:150px;width:40px;height:40px;line-height:40px;text-align:center;border-radius:50%;background:red;color:white;font-weight:550;cursor:pointer'
  menuButton.textContent = '去广告'
  menuButton.addEventListener('click', e => {
    overlay.style.display = 'block';notice.style.display = 'block';tools.style.display = 'block';ruleBox.style.display = 'block';
    menuButton.style.display = 'none'
  })
  document.body.append(menuButton)
  overlay.style.display = 'none';notice.style.display = 'none';tools.style.display = 'none';ruleBox.style.display = 'none';
  menuButton.style.display = 'block'

  const highlightedRectangles = [];
  function loadRules() {
    let storage = localStorage.getItem('fuckads')
    if (storage) {
      savedRules = JSON.parse(storage)
    }
  }
  function saveRules() {
    localStorage.setItem('fuckads', JSON.stringify(savedRules))
  }

  function getSelectorPath(element) {
    if (!(element instanceof Element)) return;
    const originalElement = element
    const path = [];
    let className = element.className
    while (element.parentNode) {
      let selector = element.tagName.toLowerCase();
      if (element.id && isNaN(element.id)) {
        selector += `#${element.id}`;
        path.unshift(selector);
        break;
      } else if (element.className && element.className.trim().length != 0) {
        let elementClassName = element.className.trim()
        if (elementClassName.indexOf('[') != -1 && className) {
          const siblings = Array.from(element.parentNode.children);
          const index = siblings.indexOf(element) + 1;
          selector += `:nth-child(${index})`;
          path.unshift(selector);
        } else {
          if (element == originalElement) { //如果是目标元素，有class就赶紧记录他的class
            selector += '.' + elementClassName.replace(/\s+/g, '.')
            path.unshift(selector);
          } else if (elementClassName.indexOf(' ') == -1) { //不是目标元素，class太复杂就不要了
            selector += `.${elementClassName}`;
            path.unshift(selector);
          }
        }
      } else if (!className) {
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element) + 1;
        selector += `:nth-child(${index})`;
        path.unshift(selector);
      }
      element = element.parentNode;
    }
    return path.join(' ');
  }

  function getElementLeft(element){
　　var actualLeft = element.offsetLeft;
　　var current = element.offsetParent;

　　while (current !== null){
　　　　actualLeft += current.offsetLeft;
　　　　current = current.offsetParent;
　　}

    return actualLeft;
  }

　function getElementTop(element){
　　var actualTop = element.offsetTop;
　　var current = element.offsetParent;

　　while (current !== null){
　　　actualTop += current.offsetTop;
　　　current = current.offsetParent;
　　}
　　return actualTop;
　}

  function draw(element) {
    drawRectangle(element)
    if (element.className) {
      let sameClassElements = document.querySelectorAll(getSelectorPath(element))
      for (let sameClassElement of sameClassElements) {
        if (element == sameClassElement)
          continue
        drawRectangle(sameClassElement, 'yellow')
      }
    }
  }

  function drawRectangle(element, color = 'skyblue') {
    element.setAttribute('display-type', element.style.display)
    const rect = element.getBoundingClientRect();
    const rectangle = document.createElement('div');
    let elementPosition = getComputedStyle(element).position
    if (elementPosition == 'fixed') {
      rectangle.style.position = 'fixed'
    } else {
      rectangle.style.position = 'absolute'
    }
    rectangle.style.zIndex = '999999'
    rectangle.style.boxShadow = color + ' 0 0 5px 5px'
    rectangle.style.boxSizing = 'border-box';
    rectangle.style.top =  getElementTop(element) + 'px';
    rectangle.style.left = getElementLeft(element) + 'px';
    rectangle.style.width = element.offsetWidth + 'px';
    rectangle.style.height = element.offsetHeight + 'px';
    rectangle.style.background = 'rgba(0,255,0,0.3)'
    rectangle.style.pointerEvents = 'none'
    document.body.append(rectangle);
    highlightedRectangles.push(rectangle);
  }

  function clearRectangles() {
    for (const rectangle of highlightedRectangles) {
        rectangle.remove();
    }
    highlightedRectangles.length = 0;
  }

  overlay.addEventListener('click', event => {
    event = event || window.event;
    event.preventDefault ? event.preventDefault() : (event.retrunValue = false) ;
    event.stopPropragation ? event.stopPropragation() : (event.cancelBubble = true)
    const x = event.clientX;
    const y = event.clientY;
    overlay.style.pointerEvents = 'none'
    const element = document.elementFromPoint(x, y);
    overlay.style.pointerEvents = 'all'
    if (element && element !== overlay) {
      console.fuck(getSelectorPath(element))
      if (element != lastSelectedElement) {
        clearRectangles()
        draw(element)
        lastSelectedElement = element
      }
    }
  })

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const isAdElement = savedRules.some(selector => node.matches(selector));
            if (isAdElement) {
              console.log('发现广告元素:', node);
              node.remove()
            }
          }
        });
      }
    }
  });
  const observerConfig = { childList: true, subtree: true };
  observer.observe(document.documentElement, observerConfig);

  // function fuckEmAll(number) {
  //   if (number <= 0)
  //     return
  //   for (let rule of savedRules) {
  //     try {
  //       let elems = document.querySelectorAll(rule)
  //       for (let elem of elems) {
  //         elem.remove()
  //       }
  //     } catch(err) {
  //       console.error(err)
  //     }
  //   }
  //   setTimeout(fuckEmAll(number - 1), 100)
  // }
  // setInterval
  window.onload = function(e) {
    for (let rule of savedRules) {
      try {
        let elems = document.querySelectorAll(rule)
        for (let elem of elems) {
          elem.remove()
        }
      } catch(err) {
        console.error(err)
      }
    }
  }
  // fuckEmAll(100)
})();
