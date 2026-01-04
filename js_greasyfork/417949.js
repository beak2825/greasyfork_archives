// ==UserScript==
// @name         浏览器工具—打开工具
// @name:zh	 浏览器工具—打开工具
// @version      1.0.0
// @namespace    http://tampermonkey.net/
// @description  打开工具，快捷键Alt+A打开图标栏，页首、页尾、刷新、后退、前进、上一页、下一页，鼠标移至图标自动响应
// @author       lyscop
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/417949/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E6%89%93%E5%BC%80%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/417949/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%B7%A5%E5%85%B7%E2%80%94%E6%89%93%E5%BC%80%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';





    var iconArray = [

        {
            name: '页首',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {
                window.scrollTo(0,0);
            }
        },
        {
            name: '页尾',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {
                window.scrollTo(0,document.body.scrollHeight);
            }
        },
        {
            name: '刷新',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {
                location.reload();
            }
        },
        {
            name: '后退',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {
                window.history.back();
            }
        },
       {
            name: '前进',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {
                window.history.forward();

            }
        },
       {
            name: '上一页',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {
                (function() {
   var flag=0;

   
(function() {
    var checked = false;
    var delay = false;
    var next = {};
    var previous = {};
    // 下一页链接里的文字
    next.texts      = [ 'next',
                        'next page',
                        'old',
                        'older',
                        'earlier',
                        '下页',
                        '下頁',
                        '下一页',
                        '下一頁',
                        '后一页',
                        '后一頁',
                        '翻下页',
                        '翻下頁',
                        '后页',
                        '后頁',
                        '下翻',
                        '下一个',
                        '下一张',
                        '下一幅',
                        '下一节',
                        '下一章',
                        '下一篇',
                        '后一章',
                        '后一篇'
                      ];
    // 上一页链接里的文字
    previous.texts  = [ 'previous',
                        'prev',
                        'previous page',
                        'new',
                        'newer',
                        'later',
                        '上页',
                        '上頁',
                        '上一页',
                        '上一頁',
                        '前一页',
                        '前一頁',
                        '翻上页',
                        '翻上頁',
                        '前页',
                        '前頁',
                        '上翻',
                        '上一个',
                        '上一张',
                        '上一幅',
                        '上一节',
                        '上一章',
                        '上一篇',
                        '前一章',
                        '前一篇'
                      ];
    // 可能会误判的关键词
    next.miswords   = { "下一章": 30,
                        "下一篇": 30,
                        "后一章": 30,
                        "后一篇": 30,
                        "下一节": 30,
                        ">>": 2000,
                        "»": 2000
                      }
    previous.miswords = { "上一章": 30,
                          "上一篇": 30,
                          "前一章": 30,
                          "前一篇": 30,
                          "上一节": 30,
                          "<<": 2000,
                          "«": 2000
                        }

    // 最后添加一些论坛使用的翻页符号
    next.texts.push(">>");
    next.texts.push(">");
    next.texts.push("»");
    next.texts.push("›");
    previous.texts.push("<<");
    previous.texts.push("<");
    previous.texts.push("«");
    previous.texts.push("‹");

    // 翻页文字的前面和后面可能包含的字符（正则表达式）
    var preRegexp  = '(^\\s*(?:[<‹«]*|[>›»]*|[\\(\\[『「［【]?)\\s*)';
    var nextRegexp = '(\\s*(?:[>›»]*|[\\)\\]』」］】]?)\\s*$)';

    function checkLinks() {
      var link, text, ldnc, lnc, ldpc, lpc, num, digCurFound, linkNumber, found, tmpNode;
      var regexp = new RegExp();
      // 查找相应的链接
      var links = document.getElementsByTagName('A');
      for (var i = 0; i < links.length; i++) {
        link = links[i];

        // 跳过不起作用的链接
        if (!link.offsetParent || link.offsetWidth == 0 || link.offsetHeight == 0 || !link.hasAttribute("href") && !link.hasAttribute("onclick"))
          continue;
        // 跳过日历
        if (/(?:^|\s)(?:monthlink|weekday|day|day[\-_]\S+)(?:\s|$)/i.test(link.className))
          continue;

        if (/^nextlink/i.test(link.id) || /^linknext/i.test(link.id) ||
            /(^|\s)nextlink/i.test(link.className) || /(^|\s)linknext/i.test(link.className))
          next.link = link;
        if (/^prev(ious)?link/i.test(link.id) || /^linkprev(ious)?/i.test(link.id) ||
            /(^|\s)prev(ious)?link/i.test(link.className) || /(^|\s)linkprev(ious)?/i.test(link.className))
          previous.link = link;

        text = link.textContent;
        if (!text) {
          // 若链接中没有文字，则检查图片的alt属性、链接或图片的title
          for (var img in link.childNodes) {
            if (img.localName == "IMG") {
              text = img.alt || link.title || img.title;
              if (text) break;
            }
          }
          if (!text) continue;
        }
        text = text.toLowerCase().replace(/^\s+|\s+$/g, "");
        if (!text) continue;

        // 纯数字链接
        if (isDigital(text)) {
          if (digCurFound) continue;
          linkNumber = parseInt(RegExp.$1);

          // 检测下一个位置是否是当前页面的页数
          if ((tmpNode = getCurrentPageNode(link, linkNumber, 1)) && tmpNode) {
            digCurFound = true;
            previous.link = link;
            previous.found = true;
            previous.pos = i;
            // 再检测下下一个位置是否是“下一页”的链接
            if (getNextLink(tmpNode, linkNumber+2, true))
              break;
            // 设置往后的30个位置以内为“下一页”的可能链接，以提高检测速度。
            ldnc = i + 30;
          }
          // 检测上一个位置是否是当前页面的页数
          else if (getCurrentPageNode(link, linkNumber, -1)) {
            digCurFound = true;
            next.link = link;
            next.found = true;
            next.pos = i;
            ldpc = i + 30;
            continue;
          }
          // 检测自身是否是当前页面的页数
          else if (getCurrentPageNode(link, linkNumber, 0)) {
            digCurFound = true;
            // 再检测下一个位置是否是“下一页”的链接
            if (getNextLink(link, linkNumber+1, true)) {
              next.pos = i;
              ldpc = i + 30;
              continue;
            }
            // 设置往后的30个位置以内为“下一页”的可能链接，以提高检测速度。
            ldnc = i + 30;
          }
          continue;
        }
        else {
          found = false;
          if (!next.found && !(lnc < i) && !(ldnc < i)) {
            for (var j = 0; j < next.texts.length; j++) {
              regexp.compile(preRegexp + next.texts[j] + nextRegexp, 'i');
              if (regexp.test(text)) {
                // 检测到“下一页”的链接
                found = true;
                next.link = link;
                num = next.miswords[next.texts[j]];
                // 若“下一页”的词语有可能会误判时，最多再检测预定个数的链接。
                (num == null) ? next.found = true : lnc = i + num;
                break;
              }
            }
          }
          if (!next.digital && lnc < i) next.found = true;

          if (!found && !previous.found && !(lpc < i) && !(ldpc < i)) {
            for (var j = 0; j < previous.texts.length; j++) {
              regexp.compile(preRegexp + previous.texts[j] + nextRegexp, 'i');
              if (regexp.test(text)) {
                // 检测到“上一页”的链接
                previous.link = link;
                num = previous.miswords[previous.texts[j]];
                // 若“上一页”的词语有可能会误判时，最多再检测预定个数的链接。
                (num == null) ? previous.found = true : lpc = i + num;
                break;
              }
            }
          }
          if (lpc < i) previous.found = true;
          // 重新设置纯数字链接未被检查
          digCurFound = null;
        }

        // 找到“上一页”和“下一页”的链接或找到其中一个而另一个超过规定范围没找到，将不再查找。
        if (next.found && previous.found ||
            next.found && i > next.pos + 30 ||
            previous.found && i > previous.pos + 30)
          break;
      }
      // 通过以上方法没有找到“下一页”的，把第一次检测出来的数字1的链接作为当前页，2作为“下一页”。
      if (!next.found /*&& !next.link*/ && next.digital)
        next.link = next.digital;

      if (next.link) next.found = true;
      if (previous.link) previous.found = true;

      if (!next.found && !previous.found)
        checkButtons();
    }

    // 检查翻页按钮
    function checkButtons() {
      var but, text, found;
      var regexp = new RegExp();
      var buts = document.getElementsByTagName('INPUT');
      for (var i = 0; i < buts.length; i++) {
        but = buts[i];
        if (but.hasAttribute("disabled") || !(/^button$/i.test(but.type) && but.getAttribute("onclick"))) continue;

        text = but.value;
        found = false;
        if (!next.found) {
          for (var j = 0; j < next.texts.length; j++) {
            regexp.compile(preRegexp + next.texts[j] + nextRegexp, 'i');
            if (regexp.test(text)) {
              // 检测到“下一页”的按钮
              next.link = but;
              next.found = found = true;
              break;
            }
          }
        }

        if (!found && !previous.found) {
          for (var j = 0; j < previous.texts.length; j++) {
            regexp.compile(preRegexp + previous.texts[j] + nextRegexp, 'i');
            if (regexp.test(text)) {
              // 检测到“上一页”的按钮
              previous.link = but;
              previous.found = true;
              break;
            }
          }
        }
        if (next.found && previous.found) break;
      }
    }

    // 取得相邻的纯数字节点，type: 1 下一个；-1 上一个
    function getSiblingNode(node, type) {
      if (!node) return null;
      node = getSibling(node, type);
      while (node && (node.nodeName == "#coment" ||
            (/^\s*[\]］】]?[,\|]?\s*[\[［【]?\s*$/.test(node.textContent))))
        node = getSibling(node, type);
      return node;
    }
    function getSibling(aNode, type) {
      if (!aNode) return null;
      if (isOnlyNode(aNode)) {
        try {
          aNode = (type == 1 ? aNode.parentNode.nextSibling : aNode.parentNode.previousSibling);
          if (skipNode(aNode))
            aNode = (type == 1 ? aNode.nextSibling : aNode.previousSibling);
          aNode = aNode.childNodes[0];
          if (skipNode(aNode))
            aNode = aNode.nextSibling;
        }
        catch (e) {return null;}
      }
      else {
        aNode = (type == 1 ? aNode.nextSibling : aNode.previousSibling);
      }
      return aNode;
    }
    function isOnlyNode(n) {
      return !n.nextSibling && !n.previousSibling ||
             !n.nextSibling && skipNode(n.previousSibling) && !n.previousSibling.previousSibling ||
             !n.previousSibling && skipNode(n.nextSibling) && !n.nextSibling.nextSibling ||
             skipNode(n.previousSibling) && !n.previousSibling.previousSibling &&
             skipNode(n.nextSibling) && !n.nextSibling.nextSibling;
    }
    function skipNode(sNode) {
      return sNode && /*sNode.nodeName == "#text" &&*/ (/^\s*$/.test(sNode.textContent));
    }

    // 检测是否有下一页的纯数字链接，number:页数
    function getNextLink(node, number, set) {
      var tNode = getSiblingNode(node, 1);
      if (tNode && tNode.nodeName == "A" && isDigital(tNode.textContent)) {
        if (RegExp.$1 == number) {
          // 找到纯数字链接
          if (set) {
            next.link = tNode;
            next.found = true;
          }
          return tNode;
        }
      }
      return null;
    }

    function isDigital(str, t) {
      str = str.replace(/^\s+|\s+$/g, "");
      if (t == -1)
        str = str.split(/\s+/).pop();
      else if (t == 1)
        str = str.split(/\s+/)[0];
      return (/^(\d+)$/.test(str)) ||
             (/^\[\s?(\d+)\s?\]$/.test(str)) ||
             (/^【\s?(\d+)\s?】$/.test(str)) ||
             (/^［\s?(\d+)\s?］$/.test(str)) ||
             (/^<\s?(\d+)\s?>$/.test(str));
    }

    // 判断是否是当前页面的数字，type:-1,0,1 分别是要判别的上一个、当前、下一个节点
    function getCurrentPageNode(node, linkNum, type) {
      var tNode;
      if (type == 0) {
        tNode = getSiblingNode(node, 1) || getSiblingNode(node, -1);
        if (!tNode) return null;
        if (!node.hasAttribute("onclick") && node.href != tNode.href &&
            (!node.hasAttribute("href") && isDigital(node.textContent, type) ||
            !(/\/#[^\/]+$/.test(node.href)) && node.href == location.href && isDigital(node.textContent, type))) {
          if (linkNum > 0 && RegExp.$1 == linkNum) return node;
        }
        // 某些论坛处在第一页时，实际链接和当前页链接不符，只有和其余纯数字链接的结构或颜色不同时，
        // 才使用纯数字的“2”作为“下一页”的链接。
        else if (!next.digital && (/^\s*[\[［【]?1[\]］】]?\s*$/.test(node.textContent))) {
          var two = getNextLink(node, 2);
          if (two && difDigital(node, two))
            next.digital = two;
        }
      }
      else {
        tNode = getSiblingNode(node, type);
        if (!tNode) return null;
        if (tNode.nodeName != "A" && isDigital(tNode.textContent, type) ||
            tNode.nodeName == "A" && !tNode.hasAttribute("onclick") && node.href != tNode.href &&
            (!tNode.hasAttribute("href") && isDigital(tNode.textContent, type) ||
            !(/\/#[^\/]+$/.test(tNode.href)) && tNode.href == location.href && isDigital(tNode.textContent, type))) {
          var n = linkNum + type;
          if (n > 0 && RegExp.$1 == n) {
            if (next.digital) next.digital = null;
            return tNode;
          }
        }
      }
      return null;
    }

    function difDigital(node1, node2) {
      if (getStructure(node1) == getStructure(node2) && getStyleColor(node1) == getStyleColor(node2))
        return false;
      return true;
    }
    function getStructure(aNode) {
      return aNode.innerHTML.replace(/\d+/, "");
    }
    function getStyleColor(aNode) {
      return document.defaultView.getComputedStyle(aNode, null).getPropertyValue("color");
    }

    function openLink(linkNode) {
      if (!linkNode) return;
      var hf = linkNode.getAttribute("href");
      if (!linkNode.hasAttribute("onclick") && hf && !(/^#/.test(hf)) && linkNode.href != location.href) {
        cleanVars();
        location.assign(linkNode.href);
      }
      else {
        // 有些4D鼠标摆动一下滚轮会触发多下的方向键，故增设一个延迟参数，使它只翻一页。
        delay = true;
        setTimeout(cleanVars, 300);
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", 1, 1, window, 1, 0,0,0,0,0,0,0,0,0, linkNode);
        linkNode.dispatchEvent(e);
      }
    }
    function cleanVars() {
      try {
        checked = false;
        delay = false;
        next.link = next.found = next.digital = null;
        previous.link = previous.found = previous.digital = null;
        delete next.pos;
        delete previous.pos;
      } catch(e) {}
    }

    // 检查过且没有发现上一页或下一页的连接，则退出
    if (checked && !next.found && !previous.found)
      return;

    if (!checked) {
      checkLinks();
      checked = true;
    }

    openLink(previous.link);
})();
       
})();
            }
        },
                {
            name: '下一页',
            image: 'https://i.ibb.co/R0bq3jm/icons8-delete-512-1.png',
            host: [''],
            popup: function () {


(function() {
   var flag=0;

(function() {
    var checked = false;
    var delay = false;
    var next = {};
    var previous = {};
    // 下一页链接里的文字
    next.texts      = [ 'next',
                        'next page',
                        'old',
                        'older',
                        'earlier',
                        '下页',
                        '下頁',
                        '下一页',
                        '下一頁',
                        '后一页',
                        '后一頁',
                        '翻下页',
                        '翻下頁',
                        '后页',
                        '后頁',
                        '下翻',
                        '下一个',
                        '下一张',
                        '下一幅',
                        '下一节',
                        '下一章',
                        '下一篇',
                        '后一章',
                        '后一篇'
                      ];
    // 上一页链接里的文字
    previous.texts  = [ 'previous',
                        'prev',
                        'previous page',
                        'new',
                        'newer',
                        'later',
                        '上页',
                        '上頁',
                        '上一页',
                        '上一頁',
                        '前一页',
                        '前一頁',
                        '翻上页',
                        '翻上頁',
                        '前页',
                        '前頁',
                        '上翻',
                        '上一个',
                        '上一张',
                        '上一幅',
                        '上一节',
                        '上一章',
                        '上一篇',
                        '前一章',
                        '前一篇'
                      ];
    // 可能会误判的关键词
    next.miswords   = { "下一章": 30,
                        "下一篇": 30,
                        "后一章": 30,
                        "后一篇": 30,
                        "下一节": 30,
                        ">>": 2000,
                        "»": 2000
                      }
    previous.miswords = { "上一章": 30,
                          "上一篇": 30,
                          "前一章": 30,
                          "前一篇": 30,
                          "上一节": 30,
                          "<<": 2000,
                          "«": 2000
                        }

    // 最后添加一些论坛使用的翻页符号
    next.texts.push(">>");
    next.texts.push(">");
    next.texts.push("»");
    next.texts.push("›");
    next.texts.push("❯");

    previous.texts.push("<<");
    previous.texts.push("<");
    previous.texts.push("«");
    previous.texts.push("‹");
    previous.texts.push("❮");

    // 翻页文字的前面和后面可能包含的字符（正则表达式）
    var preRegexp  = '(^\\s*(?:[<‹«]*|[>›»]*|[\\(\\[『「［【]?)\\s*)';
    var nextRegexp = '(\\s*(?:[>›»]*|[\\)\\]』」］】]?)\\s*$)';

    function checkLinks() {
      var link, text, ldnc, lnc, ldpc, lpc, num, digCurFound, linkNumber, found, tmpNode;
      var regexp = new RegExp();
      // 查找相应的链接
      var links = document.getElementsByTagName('A');
      for (var i = 0; i < links.length; i++) {
        link = links[i];

        // 跳过不起作用的链接
        if (!link.offsetParent || link.offsetWidth == 0 || link.offsetHeight == 0 || !link.hasAttribute("href") && !link.hasAttribute("onclick"))
          continue;
        // 跳过日历
        if (/(?:^|\s)(?:monthlink|weekday|day|day[\-_]\S+)(?:\s|$)/i.test(link.className))
          continue;

        if (/^nextlink/i.test(link.id) || /^linknext/i.test(link.id) ||
            /(^|\s)nextlink/i.test(link.className) || /(^|\s)linknext/i.test(link.className))
          next.link = link;
        if (/^prev(ious)?link/i.test(link.id) || /^linkprev(ious)?/i.test(link.id) ||
            /(^|\s)prev(ious)?link/i.test(link.className) || /(^|\s)linkprev(ious)?/i.test(link.className))
          previous.link = link;

        text = link.textContent;
        if (!text) {
          // 若链接中没有文字，则检查图片的alt属性、链接或图片的title
          for (var img in link.childNodes) {
            if (img.localName == "IMG") {
              text = img.alt || link.title || img.title;
              if (text) break;
            }
          }
          if (!text) continue;
        }
        text = text.toLowerCase().replace(/^\s+|\s+$/g, "");
        if (!text) continue;

        // 纯数字链接
        if (isDigital(text)) {
          if (digCurFound) continue;
          linkNumber = parseInt(RegExp.$1);

          // 检测下一个位置是否是当前页面的页数
          if ((tmpNode = getCurrentPageNode(link, linkNumber, 1)) && tmpNode) {
            digCurFound = true;
            previous.link = link;
            previous.found = true;
            previous.pos = i;
            // 再检测下下一个位置是否是“下一页”的链接
            if (getNextLink(tmpNode, linkNumber+2, true))
              break;
            // 设置往后的30个位置以内为“下一页”的可能链接，以提高检测速度。
            ldnc = i + 30;
          }
          // 检测上一个位置是否是当前页面的页数
          else if (getCurrentPageNode(link, linkNumber, -1)) {
            digCurFound = true;
            next.link = link;
            next.found = true;
            next.pos = i;
            ldpc = i + 30;
            continue;
          }
          // 检测自身是否是当前页面的页数
          else if (getCurrentPageNode(link, linkNumber, 0)) {
            digCurFound = true;
            // 再检测下一个位置是否是“下一页”的链接
            if (getNextLink(link, linkNumber+1, true)) {
              next.pos = i;
              ldpc = i + 30;
              continue;
            }
            // 设置往后的30个位置以内为“下一页”的可能链接，以提高检测速度。
            ldnc = i + 30;
          }
          continue;
        }
        else {
          found = false;
          if (!next.found && !(lnc < i) && !(ldnc < i)) {
            for (var j = 0; j < next.texts.length; j++) {
              regexp.compile(preRegexp + next.texts[j] + nextRegexp, 'i');
              if (regexp.test(text)) {
                // 检测到“下一页”的链接
                found = true;
                next.link = link;
                num = next.miswords[next.texts[j]];
                // 若“下一页”的词语有可能会误判时，最多再检测预定个数的链接。
                (num == null) ? next.found = true : lnc = i + num;
                break;
              }
            }
          }
          if (!next.digital && lnc < i) next.found = true;

          if (!found && !previous.found && !(lpc < i) && !(ldpc < i)) {
            for (var j = 0; j < previous.texts.length; j++) {
              regexp.compile(preRegexp + previous.texts[j] + nextRegexp, 'i');
              if (regexp.test(text)) {
                // 检测到“上一页”的链接
                previous.link = link;
                num = previous.miswords[previous.texts[j]];
                // 若“上一页”的词语有可能会误判时，最多再检测预定个数的链接。
                (num == null) ? previous.found = true : lpc = i + num;
                break;
              }
            }
          }
          if (lpc < i) previous.found = true;
          // 重新设置纯数字链接未被检查
          digCurFound = null;
        }

        // 找到“上一页”和“下一页”的链接或找到其中一个而另一个超过规定范围没找到，将不再查找。
        if (next.found && previous.found ||
            next.found && i > next.pos + 30 ||
            previous.found && i > previous.pos + 30)
          break;
      }
      // 通过以上方法没有找到“下一页”的，把第一次检测出来的数字1的链接作为当前页，2作为“下一页”。
      if (!next.found /*&& !next.link*/ && next.digital)
        next.link = next.digital;

      if (next.link) next.found = true;
      if (previous.link) previous.found = true;

      if (!next.found && !previous.found)
        checkButtons();
    }

    // 检查翻页按钮
    function checkButtons() {
      var but, text, found;
      var regexp = new RegExp();
      var buts = document.getElementsByTagName('INPUT');
      for (var i = 0; i < buts.length; i++) {
        but = buts[i];
        if (but.hasAttribute("disabled") || !(/^button$/i.test(but.type) && but.getAttribute("onclick"))) continue;

        text = but.value;
        found = false;
        if (!next.found) {
          for (var j = 0; j < next.texts.length; j++) {
            regexp.compile(preRegexp + next.texts[j] + nextRegexp, 'i');
            if (regexp.test(text)) {
              // 检测到“下一页”的按钮
              next.link = but;
              next.found = found = true;
              break;
            }
          }
        }

        if (!found && !previous.found) {
          for (var j = 0; j < previous.texts.length; j++) {
            regexp.compile(preRegexp + previous.texts[j] + nextRegexp, 'i');
            if (regexp.test(text)) {
              // 检测到“上一页”的按钮
              previous.link = but;
              previous.found = true;
              break;
            }
          }
        }
        if (next.found && previous.found) break;
      }
    }

    // 取得相邻的纯数字节点，type: 1 下一个；-1 上一个
    function getSiblingNode(node, type) {
      if (!node) return null;
      node = getSibling(node, type);
      while (node && (node.nodeName == "#coment" ||
            (/^\s*[\]］】]?[,\|]?\s*[\[［【]?\s*$/.test(node.textContent))))
        node = getSibling(node, type);
      return node;
    }
    function getSibling(aNode, type) {
      if (!aNode) return null;
      if (isOnlyNode(aNode)) {
        try {
          aNode = (type == 1 ? aNode.parentNode.nextSibling : aNode.parentNode.previousSibling);
          if (skipNode(aNode))
            aNode = (type == 1 ? aNode.nextSibling : aNode.previousSibling);
          aNode = aNode.childNodes[0];
          if (skipNode(aNode))
            aNode = aNode.nextSibling;
        }
        catch (e) {return null;}
      }
      else {
        aNode = (type == 1 ? aNode.nextSibling : aNode.previousSibling);
      }
      return aNode;
    }
    function isOnlyNode(n) {
      return !n.nextSibling && !n.previousSibling ||
             !n.nextSibling && skipNode(n.previousSibling) && !n.previousSibling.previousSibling ||
             !n.previousSibling && skipNode(n.nextSibling) && !n.nextSibling.nextSibling ||
             skipNode(n.previousSibling) && !n.previousSibling.previousSibling &&
             skipNode(n.nextSibling) && !n.nextSibling.nextSibling;
    }
    function skipNode(sNode) {
      return sNode && /*sNode.nodeName == "#text" &&*/ (/^\s*$/.test(sNode.textContent));
    }

    // 检测是否有下一页的纯数字链接，number:页数
    function getNextLink(node, number, set) {
      var tNode = getSiblingNode(node, 1);
      if (tNode && tNode.nodeName == "A" && isDigital(tNode.textContent)) {
        if (RegExp.$1 == number) {
          // 找到纯数字链接
          if (set) {
            next.link = tNode;
            next.found = true;
          }
          return tNode;
        }
      }
      return null;
    }

    function isDigital(str, t) {
      str = str.replace(/^\s+|\s+$/g, "");
      if (t == -1)
        str = str.split(/\s+/).pop();
      else if (t == 1)
        str = str.split(/\s+/)[0];
      return (/^(\d+)$/.test(str)) ||
             (/^\[\s?(\d+)\s?\]$/.test(str)) ||
             (/^【\s?(\d+)\s?】$/.test(str)) ||
             (/^［\s?(\d+)\s?］$/.test(str)) ||
             (/^<\s?(\d+)\s?>$/.test(str));
    }

    // 判断是否是当前页面的数字，type:-1,0,1 分别是要判别的上一个、当前、下一个节点
    function getCurrentPageNode(node, linkNum, type) {
      var tNode;
      if (type == 0) {
        tNode = getSiblingNode(node, 1) || getSiblingNode(node, -1);
        if (!tNode) return null;
        if (!node.hasAttribute("onclick") && node.href != tNode.href &&
            (!node.hasAttribute("href") && isDigital(node.textContent, type) ||
            !(/\/#[^\/]+$/.test(node.href)) && node.href == location.href && isDigital(node.textContent, type))) {
          if (linkNum > 0 && RegExp.$1 == linkNum) return node;
        }
        // 某些论坛处在第一页时，实际链接和当前页链接不符，只有和其余纯数字链接的结构或颜色不同时，
        // 才使用纯数字的“2”作为“下一页”的链接。
        else if (!next.digital && (/^\s*[\[［【]?1[\]］】]?\s*$/.test(node.textContent))) {
          var two = getNextLink(node, 2);
          if (two && difDigital(node, two))
            next.digital = two;
        }
      }
      else {
        tNode = getSiblingNode(node, type);
        if (!tNode) return null;
        if (tNode.nodeName != "A" && isDigital(tNode.textContent, type) ||
            tNode.nodeName == "A" && !tNode.hasAttribute("onclick") && node.href != tNode.href &&
            (!tNode.hasAttribute("href") && isDigital(tNode.textContent, type) ||
            !(/\/#[^\/]+$/.test(tNode.href)) && tNode.href == location.href && isDigital(tNode.textContent, type))) {
          var n = linkNum + type;
          if (n > 0 && RegExp.$1 == n) {
            if (next.digital) next.digital = null;
            return tNode;
          }
        }
      }
      return null;
    }

    function difDigital(node1, node2) {
      if (getStructure(node1) == getStructure(node2) && getStyleColor(node1) == getStyleColor(node2))
        return false;
      return true;
    }
    function getStructure(aNode) {
      return aNode.innerHTML.replace(/\d+/, "");
    }
    function getStyleColor(aNode) {
      return document.defaultView.getComputedStyle(aNode, null).getPropertyValue("color");
    }

    function openLink(linkNode) {
      if (!linkNode) return;
      var hf = linkNode.getAttribute("href");
      if (!linkNode.hasAttribute("onclick") && hf && !(/^#/.test(hf)) && linkNode.href != location.href) {
        cleanVars();
        location.assign(linkNode.href);
      }
      else {
        // 有些4D鼠标摆动一下滚轮会触发多下的方向键，故增设一个延迟参数，使它只翻一页。
        delay = true;
        setTimeout(cleanVars, 300);
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", 1, 1, window, 1, 0,0,0,0,0,0,0,0,0, linkNode);
        linkNode.dispatchEvent(e);
      }
    }
    function cleanVars() {
      try {
        checked = false;
        delay = false;
        next.link = next.found = next.digital = null;
        previous.link = previous.found = previous.digital = null;
        delete next.pos;
        delete previous.pos;
      } catch(e) {}
    }

    // 检查过且没有发现上一页或下一页的连接，则退出
    if (checked && !next.found && !previous.found)
      return;

    if (!checked) {
      checkLinks();
      checked = true;
    }

    openLink(next.link);
})();

})();
            }
        },





    ],


    hostCustomMap = {};
    iconArray.forEach(function (obj) {
        obj.host.forEach(function (host) {// 赋值DOM加载后的自定义方法Map
            hostCustomMap[host] = obj.custom;
        });
    });

    var icon = document.createElement('div');
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseover', obj.popup );//鼠标在图片上响应open函数
//        img.addEventListener('mousemove', obj.popup );//鼠标在图片上响应open函数

        img.setAttribute('style', '' +
            'cursor:pointer!important;' +
            'display:inline-block!important;' +
            'width:24px!important;' +//图标尺寸设置
            'height:24px!important;' +
            'border:0!important;' +
            'background-color:rgba(255,255,255,0.3)!important;' +//透明度
            'padding:0!important;' +
            'margin:0!important;' +
            'margin-right:3px!important;' +//图标间距
            '');
        icon.appendChild(img);
    });
    icon.setAttribute('style', '' +
        'display:none!important;' +
//        'width:720px!important;' +//宽度换行
        'position:absolute!important;' +
        'padding:0!important;' +
        'margin:0!important;' +
        'font-size:13px!important;' +
        'text-align:left!important;' +
        'border:0!important;' +
        'background:transparent!important;' +
        'z-index:2147483647!important;' +
//        'white-space:normal;'+
        //'overflow:hidden;'+
        '');
    // 添加到 DOM
    document.documentElement.appendChild(icon);

    var timer;


    let mouseEvent = null;

    document.addEventListener('mousemove', event => {
        // console.log('mousemove', e)
        mouseEvent = event;
//        console.log(event.keyCode)
    });


    document.addEventListener('keydown',event => {

        var keynum;
        if(window.event) // IE
        {
            keynum = event.keyCode;

        }
        else if(event.which) // Netscape/Firefox/Opera
        {
            keynum = event.which;
        }


        if(document.activeElement.tagName.toLowerCase() !== 'iframe'){
              if(keynum==65&&event.altKey){
                icon.style.top = mouseEvent.pageY -20 + 'px';//设置文字下方距离
                if(mouseEvent.pageX -70<10)
                    icon.style.left='10px';
                else
                    icon.style.left = mouseEvent.pageX -70 + 'px';




                fadeIn(icon);

                clearTimeout(timer);

                timer = window.setTimeout(TimeOutHide, 6000);
            }

        }
    });



    var TimeOutHide;
    var ismouseenter = false;


    //延时消失
    TimeOutHide = function () {
        if (ismouseenter == false) {
            return fadeOut(icon);
            console.log("doSomethingOk");
        }
   };
    //鼠标在图标栏 清除定时器 不自动关闭
    icon.onmouseenter = function(e){

        console.log("ismouseenter");

        if(timer){ //定时器
            clearTimeout(timer);
        }
    }
    //鼠标移开图标栏 清除定时器 自动关闭
    icon.onmouseleave = function(){

        console.log("ismouseleave");

        if(timer){ //定时器
            clearTimeout(timer);
        }
        timer = window.setTimeout(function(){fadeOut(icon);}, 6000);
    };

    //鼠标滚动 图标栏消失
    document.addEventListener('scroll', function(e){
//        icon.style.display='none';
        fadeOut(icon);
    });

    // fade out 渐出

    function fadeOut(el){
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    // fade in 渐入

    function fadeIn(el, display){
        el.style.opacity = 0;
        el.style.display = "block";

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }




    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }



})();