// ==UserScript==
// @name              B站哔哩哔哩使用增强，全网VIP视频免费破解去广告，知乎使用增强，搜索引擎导航等
// @name:zh-CN        B站哔哩哔哩使用增强，全网VIP视频免费破解去广告，知乎使用增强，搜索引擎导航等
// @namespace         dogdoggo235_xyz
// @version            1.1.4
// @description        功能可选择性打开：1、B站使用增强：支持视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、自动签到、描述文本网址转链接等；2、全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析(支持自定义解析接口)；3、知乎使用助手：内容种类标识、问答显示优化、视频下载等；4、搜索引擎功能增强,百度添加网址显示，google结果新标签页打开灯,导航可自定义网址【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @description:zh-CN  功能可选择性打开：1、B站使用增强：支持视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、自动签到、描述文本网址转链接等；2、全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析(支持自定义解析接口)；3、知乎使用助手：内容种类标识、问答显示优化、视频下载等；4、搜索引擎功能增强,百度添加网址显示，google结果新标签页打开灯,导航可自定义网址【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @author            dogdoggo235
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAa5JREFUWEfdl01ywjAMha12X6YnKqzgJnALyC3gJrCCnqhD90WdZyJGmMQ842baKSsmkawv+reEX/4JY/9jthi/btcHRrZUhgI4TucqIRxedpsJa+A4W6yC6vIkMsnBUwCf0/leQxizEGY8woo0o+161QdOAUCZhSgxHvlYlyIPnlT3rVJnOEqN3wBEIyGMc1Ci+mbvVeTd/uM5wmSA/l16ng/JxQPmYtYjVXIuLyLAleuqTi5QbiEkNY5Mz7mvwES3qOrSXqBEbwBGuw2dmI/AXIVapBH/gK3zRwybjvc47BUBoEpwUK6z3ZOhAawkreysxACQa69o295DPqdQfjRArjJKAC59op0lNEDa+VAZpxDiRLw3GaMRtFnXnGwm0AA4YIgxXARQk+19uv8PoDRM1R7AAUiuL5EmTk60VpEGCfqsusTzXJJWA/jhdanxtr8znfRHALoSjA3FYABsxfw9AN/x8BVDj+N0bzxvRMkAYd1ZK4ePjQCpF2oPpvRtJfOLwtXwoE4pF0Kp+l7Ru34x94Cc+XT16rsdZfc/3/XujeAuGNPP3SkHXUCZAH0Dalukgx27c3gAAAAASUVORK5CYII=
// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/resource/pcw/play/*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://*.baofeng.com/play/*
// @include           *://vip.pptv.com/show/*
// @include           *://v.pptv.com/show/*
// @include           *://www.le.com/ptv/vplay/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.1905.com/video/*
// @include           *://*.1905.com/play/*
// @include           *://*.1905.com/*/play/*
// @include           *://www.miguvideo.com/mgs/*
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/v_*
// @include           *://m.iqiyi.com/w_*
// @include           *://m.iqiyi.com/a_*
// @include           *://m.youku.com/alipay_video/*
// @include           *://m.youku.com/video/id_*
// @include           *://m.mgtv.com/b/*
// @include           *://m.tv.sohu.com/v/*
// @include           *://m.film.sohu.com/album/*
// @include           *://m.le.com/ptv/vplay/*
// @include           *://m.pptv.com/show/*
// @include           *://m.acfun.cn/v/*
// @include           *://m.wasu.cn/Play/show/*
// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://www.sogou.com/sogou*
// @include           *://cn.bing.com/search*
// @include           *://www.bing.com/search*
// @include           *://www4.bing.com/search*
// @include           *://so.toutiao.com/search*
// @include           *://www.google.com/search*
// @include           *://www.google.com.hk/search*
// @include           *://duckduckgo.com*
// @include	   	      *://www.bilibili.com/**
// @include           *://search.bilibili.com/**
// @include           *://space.bilibili.com/**
// @include           *://www.bilibili.com/read/**
// @include      	  *://*.zhihu.com/*
// @connect           bilibili.com
// @connect           staticj.top
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_download
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_addElement
// @license           AGPL License
// @charset		      UTF-8
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/546489/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%AF%BC%E8%88%AA%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546489/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%9F%A5%E4%B9%8E%E4%BD%BF%E7%94%A8%E5%A2%9E%E5%BC%BA%EF%BC%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%AF%BC%E8%88%AA%E7%AD%89.meta.js
// ==/UserScript==
/**
 * findAndReplaceDOMText v 0.4.6
 * @author James Padolsey http://james.padolsey.com
 * @license http://unlicense.org/UNLICENSE
 *
 * Matches the text of a DOM node against a regular expression
 * and replaces each match (or node-separated portions of the match)
 * in the specified element.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    // Node/CommonJS
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.findAndReplaceDOMText = factory();
  }
})(this, function factory() {
  var PORTION_MODE_RETAIN = "retain";
  var PORTION_MODE_FIRST = "first";

  var doc = document;
  var hasOwn = {}.hasOwnProperty;

  function escapeRegExp(s) {
    return String(s).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
  }

  function exposed() {
    // Try deprecated arg signature first:
    return (
      deprecated.apply(null, arguments) ||
      findAndReplaceDOMText.apply(null, arguments)
    );
  }

  function deprecated(regex, node, replacement, captureGroup, elFilter) {
    if (node && !node.nodeType && arguments.length <= 2) {
      return false;
    }
    var isReplacementFunction = typeof replacement == "function";

    if (isReplacementFunction) {
      replacement = (function (original) {
        return function (portion, match) {
          return original(portion.text, match.startIndex);
        };
      })(replacement);
    }

    // Awkward support for deprecated argument signature (<0.4.0)
    var instance = findAndReplaceDOMText(node, {
      find: regex,

      wrap: isReplacementFunction ? null : replacement,
      replace: isReplacementFunction
        ? replacement
        : "$" + (captureGroup || "&"),

      prepMatch: function (m, mi) {
        // Support captureGroup (a deprecated feature)

        if (!m[0])
          throw "findAndReplaceDOMText cannot handle zero-length matches";

        if (captureGroup > 0) {
          var cg = m[captureGroup];
          m.index += m[0].indexOf(cg);
          m[0] = cg;
        }

        m.endIndex = m.index + m[0].length;
        m.startIndex = m.index;
        m.index = mi;

        return m;
      },
      filterElements: elFilter,
    });

    exposed.revert = function () {
      return instance.revert();
    };

    return true;
  }

  /**
   * findAndReplaceDOMText
   *
   * Locates matches and replaces with replacementNode
   *
   * @param {Node} node Element or Text node to search within
   * @param {RegExp} options.find The regular expression to match
   * @param {String|Element} [options.wrap] A NodeName, or a Node to clone
   * @param {String} [options.wrapClass] A classname to append to the wrapping element
   * @param {String|Function} [options.replace=''] What to replace each match with
   * @param {Function} [options.filterElements] A Function to be called to check whether to
   *	process an element. (returning true = process element,
   *	returning false = avoid element)
   */
  function findAndReplaceDOMText(node, options) {
    return new Finder(node, options);
  }

  exposed.NON_PROSE_ELEMENTS = {
    br: 1,
    hr: 1,
    // Media / Source elements:
    script: 1,
    style: 1,
    img: 1,
    video: 1,
    audio: 1,
    canvas: 1,
    svg: 1,
    map: 1,
    object: 1,
    // Input elements
    input: 1,
    textarea: 1,
    select: 1,
    option: 1,
    optgroup: 1,
    button: 1,
  };

  exposed.NON_CONTIGUOUS_PROSE_ELEMENTS = {
    // Elements that will not contain prose or block elements where we don't
    // want prose to be matches across element borders:

    // Block Elements
    address: 1,
    article: 1,
    aside: 1,
    blockquote: 1,
    dd: 1,
    div: 1,
    dl: 1,
    fieldset: 1,
    figcaption: 1,
    figure: 1,
    footer: 1,
    form: 1,
    h1: 1,
    h2: 1,
    h3: 1,
    h4: 1,
    h5: 1,
    h6: 1,
    header: 1,
    hgroup: 1,
    hr: 1,
    main: 1,
    nav: 1,
    noscript: 1,
    ol: 1,
    output: 1,
    p: 1,
    pre: 1,
    section: 1,
    ul: 1,
    // Other misc. elements that are not part of continuous inline prose:
    br: 1,
    li: 1,
    summary: 1,
    dt: 1,
    details: 1,
    rp: 1,
    rt: 1,
    rtc: 1,
    // Media / Source elements:
    script: 1,
    style: 1,
    img: 1,
    video: 1,
    audio: 1,
    canvas: 1,
    svg: 1,
    map: 1,
    object: 1,
    // Input elements
    input: 1,
    textarea: 1,
    select: 1,
    option: 1,
    optgroup: 1,
    button: 1,
    // Table related elements:
    table: 1,
    tbody: 1,
    thead: 1,
    th: 1,
    tr: 1,
    td: 1,
    caption: 1,
    col: 1,
    tfoot: 1,
    colgroup: 1,
  };

  exposed.NON_INLINE_PROSE = function (el) {
    return hasOwn.call(
      exposed.NON_CONTIGUOUS_PROSE_ELEMENTS,
      el.nodeName.toLowerCase()
    );
  };

  // Presets accessed via `options.preset` when calling findAndReplaceDOMText():
  exposed.PRESETS = {
    prose: {
      forceContext: exposed.NON_INLINE_PROSE,
      filterElements: function (el) {
        return !hasOwn.call(
          exposed.NON_PROSE_ELEMENTS,
          el.nodeName.toLowerCase()
        );
      },
    },
  };

  exposed.Finder = Finder;

  /**
   * Finder -- encapsulates logic to find and replace.
   */
  function Finder(node, options) {
    var preset = options.preset && exposed.PRESETS[options.preset];

    options.portionMode = options.portionMode || PORTION_MODE_RETAIN;

    if (preset) {
      for (var i in preset) {
        if (hasOwn.call(preset, i) && !hasOwn.call(options, i)) {
          options[i] = preset[i];
        }
      }
    }

    this.node = node;
    this.options = options;

    // Enable match-preparation method to be passed as option:
    this.prepMatch = options.prepMatch || this.prepMatch;

    this.reverts = [];

    this.matches = this.search();

    if (this.matches.length) {
      this.processMatches();
    }
  }

  Finder.prototype = {
    /**
     * Searches for all matches that comply with the instance's 'match' option
     */
    search: function () {
      var match;
      var matchIndex = 0;
      var offset = 0;
      var regex = this.options.find;
      var textAggregation = this.getAggregateText();
      var matches = [];
      var self = this;

      regex =
        typeof regex === "string" ? RegExp(escapeRegExp(regex), "g") : regex;

      matchAggregation(textAggregation);

      function matchAggregation(textAggregation) {
        for (var i = 0, l = textAggregation.length; i < l; ++i) {
          var text = textAggregation[i];

          if (typeof text !== "string") {
            // Deal with nested contexts: (recursive)
            matchAggregation(text);
            continue;
          }

          if (regex.global) {
            while ((match = regex.exec(text))) {
              matches.push(self.prepMatch(match, matchIndex++, offset));
            }
          } else {
            if ((match = text.match(regex))) {
              matches.push(self.prepMatch(match, 0, offset));
            }
          }

          offset += text.length;
        }
      }

      return matches;
    },

    /**
     * Prepares a single match with useful meta info:
     */
    prepMatch: function (match, matchIndex, characterOffset) {
      if (!match[0]) {
        throw new Error(
          "findAndReplaceDOMText cannot handle zero-length matches"
        );
      }

      match.endIndex = characterOffset + match.index + match[0].length;
      match.startIndex = characterOffset + match.index;
      match.index = matchIndex;

      return match;
    },

    /**
     * Gets aggregate text within subject node
     */
    getAggregateText: function () {
      var elementFilter = this.options.filterElements;
      var forceContext = this.options.forceContext;

      return getText(this.node);

      /**
       * Gets aggregate text of a node without resorting
       * to broken innerText/textContent
       */
      function getText(node) {
        if (node == null) {
          return [];
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return [node.data];
        }

        if (elementFilter && !elementFilter(node)) {
          return [];
        }

        var txt = [""];
        var i = 0;

        if ((node = node.firstChild))
          do {
            if (node.nodeType === Node.TEXT_NODE) {
              txt[i] += node.data;
              continue;
            }

            var innerText = getText(node);

            if (
              forceContext &&
              node.nodeType === Node.ELEMENT_NODE &&
              (forceContext === true || forceContext(node))
            ) {
              txt[++i] = innerText;
              txt[++i] = "";
            } else {
              if (typeof innerText[0] === "string") {
                // Bridge nested text-node data so that they're
                // not considered their own contexts:
                // I.e. ['some', ['thing']] -> ['something']
                txt[i] += innerText.shift();
              }
              if (innerText.length) {
                txt[++i] = innerText;
                txt[++i] = "";
              }
            }
          } while ((node = node.nextSibling));

        return txt;
      }
    },

    /**
     * Steps through the target node, looking for matches, and
     * calling replaceFn when a match is found.
     */
    processMatches: function () {
      var matches = this.matches;
      var node = this.node;
      var elementFilter = this.options.filterElements;

      var startPortion,
        endPortion,
        innerPortions = [],
        curNode = node,
        match = matches.shift(),
        atIndex = 0, // i.e. nodeAtIndex
        matchIndex = 0,
        portionIndex = 0,
        doAvoidNode,
        nodeStack = [node];

      out: while (true) {
        if (curNode.nodeType === Node.TEXT_NODE) {
          if (!endPortion && curNode.length + atIndex >= match.endIndex) {
            // We've found the ending
            // (Note that, in the case of a single portion, it'll be an
            // endPortion, not a startPortion.)
            endPortion = {
              node: curNode,
              index: portionIndex++,
              text: curNode.data.substring(
                match.startIndex - atIndex,
                match.endIndex - atIndex
              ),

              // If it's the first match (atIndex==0) we should just return 0
              indexInMatch: atIndex === 0 ? 0 : atIndex - match.startIndex,

              indexInNode: match.startIndex - atIndex,
              endIndexInNode: match.endIndex - atIndex,
              isEnd: true,
            };
          } else if (startPortion) {
            // Intersecting node
            innerPortions.push({
              node: curNode,
              index: portionIndex++,
              text: curNode.data,
              indexInMatch: atIndex - match.startIndex,
              indexInNode: 0, // always zero for inner-portions
            });
          }

          if (!startPortion && curNode.length + atIndex > match.startIndex) {
            // We've found the match start
            startPortion = {
              node: curNode,
              index: portionIndex++,
              indexInMatch: 0,
              indexInNode: match.startIndex - atIndex,
              endIndexInNode: match.endIndex - atIndex,
              text: curNode.data.substring(
                match.startIndex - atIndex,
                match.endIndex - atIndex
              ),
            };
          }

          atIndex += curNode.data.length;
        }

        doAvoidNode =
          curNode.nodeType === Node.ELEMENT_NODE &&
          elementFilter &&
          !elementFilter(curNode);

        if (startPortion && endPortion) {
          curNode = this.replaceMatch(
            match,
            startPortion,
            innerPortions,
            endPortion
          );

          // processMatches has to return the node that replaced the endNode
          // and then we step back so we can continue from the end of the
          // match:

          atIndex -= endPortion.node.data.length - endPortion.endIndexInNode;

          startPortion = null;
          endPortion = null;
          innerPortions = [];
          match = matches.shift();
          portionIndex = 0;
          matchIndex++;

          if (!match) {
            break; // no more matches
          }
        } else if (
          !doAvoidNode &&
          (curNode.firstChild || curNode.nextSibling)
        ) {
          // Move down or forward:
          if (curNode.firstChild) {
            nodeStack.push(curNode);
            curNode = curNode.firstChild;
          } else {
            curNode = curNode.nextSibling;
          }
          continue;
        }

        // Move forward or up:
        while (true) {
          if (curNode.nextSibling) {
            curNode = curNode.nextSibling;
            break;
          }
          curNode = nodeStack.pop();
          if (curNode === node) {
            break out;
          }
        }
      }
    },

    /**
     * Reverts ... TODO
     */
    revert: function () {
      // Reversion occurs backwards so as to avoid nodes subsequently
      // replaced during the matching phase (a forward process):
      for (var l = this.reverts.length; l--; ) {
        this.reverts[l]();
      }
      this.reverts = [];
    },

    prepareReplacementString: function (string, portion, match) {
      var portionMode = this.options.portionMode;
      if (portionMode === PORTION_MODE_FIRST && portion.indexInMatch > 0) {
        return "";
      }
      string = string.replace(/\$(\d+|&|`|')/g, function ($0, t) {
        var replacement;
        switch (t) {
          case "&":
            replacement = match[0];
            break;
          case "`":
            replacement = match.input.substring(0, match.startIndex);
            break;
          case "'":
            replacement = match.input.substring(match.endIndex);
            break;
          default:
            replacement = match[+t] || "";
        }
        return replacement;
      });

      if (portionMode === PORTION_MODE_FIRST) {
        return string;
      }

      if (portion.isEnd) {
        return string.substring(portion.indexInMatch);
      }

      return string.substring(
        portion.indexInMatch,
        portion.indexInMatch + portion.text.length
      );
    },

    getPortionReplacementNode: function (portion, match) {
      var replacement = this.options.replace || "";
      var wrapper = this.options.wrap;
      var wrapperClass = this.options.wrapClass;

      if (wrapper && wrapper.nodeType) {
        // Wrapper has been provided as a stencil-node for us to clone:
        var clone = doc.createElement("div");
        clone.innerHTML =
          wrapper.outerHTML || new XMLSerializer().serializeToString(wrapper);
        wrapper = clone.firstChild;
      }

      if (typeof replacement == "function") {
        replacement = replacement(portion, match);
        if (replacement && replacement.nodeType) {
          return replacement;
        }
        return doc.createTextNode(String(replacement));
      }

      var el =
        typeof wrapper == "string" ? doc.createElement(wrapper) : wrapper;

      if (el && wrapperClass) {
        el.className = wrapperClass;
      }

      replacement = doc.createTextNode(
        this.prepareReplacementString(replacement, portion, match)
      );

      if (!replacement.data) {
        return replacement;
      }

      if (!el) {
        return replacement;
      }

      el.appendChild(replacement);

      return el;
    },

    replaceMatch: function (match, startPortion, innerPortions, endPortion) {
      var matchStartNode = startPortion.node;
      var matchEndNode = endPortion.node;

      var precedingTextNode;
      var followingTextNode;

      if (matchStartNode === matchEndNode) {
        var node = matchStartNode;

        if (startPortion.indexInNode > 0) {
          // Add `before` text node (before the match)
          precedingTextNode = doc.createTextNode(
            node.data.substring(0, startPortion.indexInNode)
          );
          node.parentNode.insertBefore(precedingTextNode, node);
        }

        // Create the replacement node:
        var newNode = this.getPortionReplacementNode(endPortion, match);

        node.parentNode.insertBefore(newNode, node);

        if (endPortion.endIndexInNode < node.length) {
          // ?????
          // Add `after` text node (after the match)
          followingTextNode = doc.createTextNode(
            node.data.substring(endPortion.endIndexInNode)
          );
          node.parentNode.insertBefore(followingTextNode, node);
        }

        node.parentNode.removeChild(node);

        this.reverts.push(function () {
          if (precedingTextNode === newNode.previousSibling) {
            precedingTextNode.parentNode.removeChild(precedingTextNode);
          }
          if (followingTextNode === newNode.nextSibling) {
            followingTextNode.parentNode.removeChild(followingTextNode);
          }
          newNode.parentNode.replaceChild(node, newNode);
        });

        return newNode;
      } else {
        // Replace matchStartNode -> [innerMatchNodes...] -> matchEndNode (in that order)

        precedingTextNode = doc.createTextNode(
          matchStartNode.data.substring(0, startPortion.indexInNode)
        );

        followingTextNode = doc.createTextNode(
          matchEndNode.data.substring(endPortion.endIndexInNode)
        );

        var firstNode = this.getPortionReplacementNode(startPortion, match);

        var innerNodes = [];

        for (var i = 0, l = innerPortions.length; i < l; ++i) {
          var portion = innerPortions[i];
          var innerNode = this.getPortionReplacementNode(portion, match);
          portion.node.parentNode.replaceChild(innerNode, portion.node);
          this.reverts.push(
            (function (portion, innerNode) {
              return function () {
                innerNode.parentNode.replaceChild(portion.node, innerNode);
              };
            })(portion, innerNode)
          );
          innerNodes.push(innerNode);
        }

        var lastNode = this.getPortionReplacementNode(endPortion, match);

        matchStartNode.parentNode.insertBefore(
          precedingTextNode,
          matchStartNode
        );
        matchStartNode.parentNode.insertBefore(firstNode, matchStartNode);
        matchStartNode.parentNode.removeChild(matchStartNode);

        matchEndNode.parentNode.insertBefore(lastNode, matchEndNode);
        matchEndNode.parentNode.insertBefore(followingTextNode, matchEndNode);
        matchEndNode.parentNode.removeChild(matchEndNode);

        this.reverts.push(function () {
          precedingTextNode.parentNode.removeChild(precedingTextNode);
          firstNode.parentNode.replaceChild(matchStartNode, firstNode);
          followingTextNode.parentNode.removeChild(followingTextNode);
          lastNode.parentNode.replaceChild(matchEndNode, lastNode);
        });

        return lastNode;
      }
    },
  };

  return exposed;
});

(function () {
	'use strict';
	/**
 * 脚本遵循AGPL License开源协议；在协议允许的范围类，可以自由修改
 * 开完万岁！！
 */
	//共有方法，全局共享
function CommonFunction(){
	this.GMgetValue = function (name, value=null) {
		let storageValue = value;
		if (typeof GM_getValue === "function") {
			storageValue = GM_getValue(name, value);
		} else if(typeof GM.setValue === "function"){
			storageValue = GM.getValue(name, value);
		}else{
			var arr = window.localStorage.getItem(name);
			if(arr != null){
				storageValue = arr
			}
		}
		return storageValue;
	};
	this.GMsetValue = function(name, value){
		if (typeof GM_setValue === "function") {
			GM_setValue(name, value);
		} else if(typeof GM.setValue === "function"){
			GM.setValue(name, value);
		}else{
			window.localStorage.setItem(name, value)
		}
	};
	this.GMaddStyle = function(css){
		var myStyle = document.createElement('style');
		myStyle.textContent = css;
		var doc = document.head || document.documentElement;
		doc.appendChild(myStyle);
	};
	this.GMopenInTab = function(url, options={"active":true, "insert":true, "setParent":true}){
		if (typeof GM_openInTab === "function") {
			GM_openInTab(url, options);
		} else {
			GM.openInTab(url, options);
		}
	};
	this.addScript = function(url){
		var s = document.createElement('script');
		s.setAttribute('src',url);
		document.body.appendChild(s);
	};
	this.randomNumber = function(){
		return Math.ceil(Math.random()*100000000);
	};
	this.request=function(method, url, param, headers={"Content-Type": "application/json;charset=UTF-8"}){
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: url,
				method: method,
				data:param,
				headers:headers,
				onload: function(response) {
					var status = response.status;
					var playurl = "";
					if(status==200||status=='200'){
						var responseText = response.responseText;
						resolve({"result":"success", "data":responseText});
					}else{
						reject({"result":"error", "data":null});
					}
				}
			});
		})
	};
	this.crossRequest=function(method, url, param){
		if(!method){
			method = "get";
		}
		if(!url){
			return new Promise(function(resolve, reject){
				reject({"result":"error", "data":null});
			});
		}
		if(!param){
			param = {};
		}
		method = method.toUpperCase();
	    let config = {
	        method: method
	    };
	    if (method === 'POST') {
	        config.headers['Content-Type'] = 'application/json';
	        config.body = JSON.stringify(param);
	    }
		return new Promise(function(resolve, reject){
			fetch(url, config).then(response => response.text()).then(text => {
				resolve({"result":"success", "data":text});
			}).catch(error => {
				reject({"result":"error", "data":null});
			});
		});
	};
	this.addCommonHtmlCss = function(){
		var cssText = 
			`
			@keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-webkit-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-moz-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-o-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-ms-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-webkit-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-moz-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-o-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-ms-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			.web-toast-kkli9{
				position: fixed;
				background: rgba(0, 0, 0, 0.7);
				color: #fff;
				font-size: 14px;
				line-height: 1;
				padding:10px;
				border-radius: 3px;
				left: 50%;
				transform: translateX(-50%);
				-webkit-transform: translateX(-50%);
				-moz-transform: translateX(-50%);
				-o-transform: translateX(-50%);
				-ms-transform: translateX(-50%);
				z-index: 2147483648;
				white-space: nowrap;
			}
			.fadeOut{
				animation: fadeOut .5s;
			}
			.fadeIn{
				animation:fadeIn .5s;
			}
			`;
		this.GMaddStyle(cssText);
	};
	this.webToast = function(params) {	//小提示框
		var time = params.time;
		var background = params.background;
		var color = params.color;
		var position = params.position;  //center-top, center-bottom
		var defaultMarginValue = 50;
		
		if(time == undefined || time == ''){
			time = 1500;
		}
		
		var el = document.createElement("div");
		el.setAttribute("class", "web-toast-kkli9");
		el.innerHTML = params.message;
		//背景颜色
		if(background!=undefined && background!=''){
			el.style.backgroundColor=background;
		}
		//字体颜色
		if(color!=undefined && color!=''){
			el.style.color=color;
		}
		
		//显示位置
		if(position==undefined || position==''){
			position = "center-bottom";
		}
		
		//设置显示位置，当前有种两种形式
		if(position==="center-bottom"){
			el.style.bottom = defaultMarginValue+"px"; 
		}else{
			el.style.top = defaultMarginValue+"px"; 
		}
		el.style.zIndex=999999;
		
		document.body.appendChild(el);
		el.classList.add("fadeIn");
		setTimeout(function () {
			el.classList.remove("fadeIn");
			el.classList.add("fadeOut");
			/*监听动画结束，移除提示信息元素*/
			el.addEventListener("animationend", function () {
				document.body.removeChild(el);
			});
			el.addEventListener("webkitAnimationEnd", function () {
				document.body.removeChild(el);
			});
		}, time);
	};
	this.filterStr = function(str){
		if(!str) return "";
		str = str.replace(/\t/g,"");
		str = str.replace(/\r/g,"");
		return encodeURIComponent(str)
	};
	this.getParamterQueryUrl = function(text, tag) { //查询GET请求url中的参数
		if(text.indexOf("?")!=-1){ //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
			var textArray = text.split("?");
			text = "?"+textArray[textArray.length-1];
		}
		var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
		var a = text.substr(1).match(t);
		if (a != null){
			return a[2];
		}
		return "";
	};
	this.getEndHtmlIdByUrl = function(url) { //获得以html结束的ID
		if(url.indexOf("?")!=-1){
			url = url.split("?")[0]
		}
		if(url.indexOf("#")!=-1){
			url = url.split("#")[0]
		}
		var splitText = url.split("/");
		var idText = splitText[splitText.length-1];
		idText = idText.replace(".html","");
		return idText;
	};
	this.suningParameter=function(url){
		const regex = /product\.suning\.com\/(\d+\/\d+)\.html/;
		const match = url.match(regex);
		if(match){
			return match[1].replace(/\//g, '-');
		}
		return null;
	};
	this.getEcommercePlatform=function(host = window.location.host){
		let platform = "";
		if(host.indexOf(".taobao.")!=-1 || host.indexOf(".liangxinyao.")!=-1){
			platform = "taobao";
		}else if(host.indexOf(".tmall.")!=-1){
			platform = "tmall";
		}else if(host.indexOf(".jd.")!=-1 || host.indexOf(".yiyaojd.")!=-1 || host.indexOf(".jkcsjd.")!=-1 || host.indexOf(".jingdonghealth.")!=-1){
			platform = "jd";
		}else if(host.indexOf(".vip.")!=-1 || host.indexOf(".vipglobal.")!=-1){
			platform = "vpinhui";
		}else if(host.indexOf(".suning.")!=-1){
			platform = "suning";
		}
		return platform;
	}
	this.isPC = function(){
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	};
	this.getBilibiliBV=function(){
		var pathname = window.location.pathname;
		var bv = pathname.replace("/video/","").replace("/","");
		return bv;
	};
	this.getSystemOS=function(){
		var u = navigator.userAgent;
		if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
			return 'windows';
		} else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
			return 'macOS';
		} else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
			return 'ios';
		} else if (!!u.match(/android/i)) {
			return 'android';
		} else {
			return 'other';
		}
	};
	this.RPCDownloadFile = function(fileName, url, savePath="D:/", RPCURL="ws://localhost:16800/jsonrpc", RPCToken="") {		
		const self = this;
		if(!savePath){
			savePath = "D:/";
		}
		if(!RPCURL){
			RPCURL = "ws://localhost:16800/jsonrpc";
		}
		let options = { //下载配置文件
			"dir":savePath,
			"max-connection-per-server": "16",
			"header":["User-Agent:"+navigator.userAgent+"", "Cookie:"+document.cookie+"", "Referer:"+window.location.href+""]
		}
		if(!!fileName) {
			options.out = fileName;
		}
		let jsonRPC = {
			"jsonrpc": "2.0",
			"id": "huahuacat",
			"method": "aria2.addUri",
			"params": [[url], options],
		}
		if (!!RPCToken) {
			jsonRPC.params.unshift("token:" + RPCToken); // 必须要加在第一个
		}
		return new Promise(function(resolve, reject) {
			var webSocket = new WebSocket(RPCURL);
			webSocket.onerror = function(event) {
				console.log("webSocket.onerror", event);
				reject("Aria2连接错误，请打开Aria2和检查RPC设置！");
			}
			webSocket.onopen = function(){
				webSocket.send(JSON.stringify(jsonRPC));
			}
			webSocket.onmessage = function(event){
				let result = JSON.parse(event.data);
				switch (result.method) {
					case "aria2.onDownloadStart":
						resolve("Aria2 开始下载【"+fileName+"】");
						webSocket.close();
						break;
					case "aria2.onDownloadComplete":
						break;
					default:
						break;
				}
			}
		});
	};
	this.getElementObject = function(selector, target=document.body, allowEmpty = true, delay=10, maxDelay=10 * 1000){
		return new Promise((resolve,reject) =>{
			if (selector.toUpperCase() === "BODY") {
				resolve(document.body);
				return;
			}
			if (selector.toUpperCase() === "HTML") {
				resolve(document.html);
				return;
			}
			let totalDelay = 0;
			
			let element = target.querySelector(selector);
			let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
			if(result){
				resolve(element);
			}
			
			const elementInterval = setInterval(()=>{
				if(totalDelay >= maxDelay){
					clearInterval(elementInterval);
					resolve(null);
				}
				element = target.querySelector(selector);
				result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
				if(result){
					clearInterval(elementInterval);
					resolve(element);
				}else{
					totalDelay += delay;
				}
			}, delay);
		});
	};
	/**
	 * @param {Object} time
	 * @param {Object} format
	 * 时间格式化
	 * DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss")
	 */
	this.DateFormat = function(time, format) {
		var o = {
			"M+": time.getMonth() + 1, //月份 
			"d+": time.getDate(), //日 
			"h+": time.getHours(), //小时 
			"m+": time.getMinutes(), //分 
			"s+": time.getSeconds(), //秒 
			"q+": Math.floor((time.getMonth() + 3) / 3), //季度 
			"S": time.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(format)){
			format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o){
			if(new RegExp("(" + k + ")").test(format)){
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	};
	this.decryptStr=function(str){
		let result = atob(str);
		return result.split('').reverse().join('');
	};
	this.encryptStr=function(str){
		let result = str.split('').reverse().join('');
		return btoa(result);
	};
}
//全局弹窗对象
const dialog = (function(){
	class Dialog {
		constructor() {
			this.mask = document.createElement('div');
			this.dialogStyle = document.createElement('style');
			
			this.setStyle(this.mask, {
				"width": '100%',
				"height": '100%',
				"backgroundColor": 'rgba(0, 0, 0, .6)',
				"position": 'fixed',
				"left": "0px",
				"top": "0px",
				"bottom":"0px",
				"right":"0px",
				"z-index":"2147483647"
			});
			
			this.content = document.createElement('div');
			this.setStyle(this.content, {
				"max-width": '450px',
				"width":"100%",
				"max-height": '600px',
				"backgroundColor": '#fff',
				"boxShadow": '0 0 2px #999',
				"position": 'absolute',
				"left": '50%',
				"top": '50%',
				"transform": 'translate(-50%,-50%)',
				"borderRadius": '5px'
			})
			this.mask.appendChild(this.content);
		}
		middleBox(param) {
			// 先清空中间小div的内容 - 防止调用多次，出现混乱
			this.content.innerHTML = '';
			
			let title = '默认标题内容';
			if({}.toString.call(param) === '[object String]') {
				title = param;
			} else if({}.toString.call(param) === '[object Object]') {
				title = param.title;
			}

			document.body.appendChild(this.mask);
			this.title = document.createElement('div');
			this.setStyle(this.title, {
				"width": '100%',
				"height": '40px',
				"lineHeight": '40px',
				"boxSizing": 'border-box',
				"background-color":"#dedede",
				"color": '#000',
				"text-align": 'center',
				"font-weight":"700",
				"font-size":"17px",
				"border-radius": "4px 4px 0px 0px"
			});
			
			this.title.innerText = title;
			this.content.appendChild(this.title);

			this.closeBtn = document.createElement('div');
			this.closeBtn.innerText = '×';
			
			this.setStyle(this.closeBtn, {
				"textDecoration": 'none',
				"color": '#000',
				"position": 'absolute',
				"right": '10px',
				"top": '0px',
				"fontSize": '25px',
				"display":"inline-block",
				"cursor":"pointer"
			})
			this.title.appendChild(this.closeBtn);
			
			const self = this;
			this.closeBtn.onclick = function(){
				self.close();
				if(param.onClose && (typeof param.onClose)==="function"){
					param.onClose();
				}
			}
		}
		showMake(param) {
			//添加公用样式表
			if(param.hasOwnProperty("styleSheet")){
				this.dialogStyle.textContent = param.styleSheet;
			}
			document.querySelector("head").appendChild(this.dialogStyle);
			
			this.middleBox(param);
			this.dialogContent = document.createElement('div');
			this.setStyle(this.dialogContent,{
				"padding":"15px",
				"max-height":"400px"
			});
			this.dialogContent.innerHTML = param.content;
			this.content.appendChild(this.dialogContent);
			param.onContentReady(this);
		}
		close() {
			document.body.removeChild(this.mask);
			document.querySelector("head").removeChild(this.dialogStyle);
		}
		setStyle(ele, styleObj) {
			for(let attr in styleObj){
				ele.style[attr] = styleObj[attr];
			}
		}
	}
	let dialog = null;
	return (function() {
		if(!dialog) {
			dialog = new Dialog()
		}
		return dialog;
	})()
})();
	
//全局统一方法对象
const commonFunctionObject = new CommonFunction(); 
commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加
let functionController = null;
	
	//相关功能关闭控制
functionController = commonFunctionObject.GMgetValue("setingData");
if(!functionController){
	functionController={
		"bilibiliHelper":true,
		"superVideoHelper":true,
		"searchEnginesNavigation":true,
		"zhihuHelper":true,
	}
}	
//用户功能设置函数
function usersSeting(){
	var bilibiliHelper=true,
		superVideoHelper=true, 
		searchEnginesNavigation=true, 
		zhihuHelper=true;
	var isUpdateStorage = false;
	
	if(!functionController.hasOwnProperty("bilibiliHelper")){
		functionController.bilibiliHelper = true;
		isUpdateStorage = true;
	}else{
		bilibiliHelper = functionController.bilibiliHelper;
	}
	if(!functionController.hasOwnProperty("superVideoHelper")){
		functionController.superVideoHelper = true;
		isUpdateStorage = true;
	}else{
		superVideoHelper = functionController.superVideoHelper;
	}
	if(!functionController.hasOwnProperty("searchEnginesNavigation")){
		functionController.searchEnginesNavigation = true;
		isUpdateStorage = true;
	}else{
		searchEnginesNavigation = functionController.searchEnginesNavigation;
	}
	if(!functionController.hasOwnProperty("zhihuHelper")){
		functionController.zhihuHelper = true;
		isUpdateStorage = true;
	}else{
		zhihuHelper = functionController.zhihuHelper;
	}
	if(isUpdateStorage){
		commonFunctionObject.GMsetValue("setingData",functionController);
	}
	var setingData=[
		{"tag":"bilibiliHelper", "name":"B站使用加强(视频下载支持批量、浏览记录、一键三连)", "checked":bilibiliHelper},
		{"tag":"zhihuHelper", "name":"知乎使用加强(内容标识、问答显示优化、视频下载等)", "checked":zhihuHelper},
		{"tag":"superVideoHelper", "name":"全网VIP视频解析(支持爱奇艺、腾讯视频、B站番剧等)", "checked":superVideoHelper},
		{"tag":"searchEnginesNavigation", "name":"搜索引擎使用加强(适配百度、360、搜狗、必应、Google等)", "checked":searchEnginesNavigation},
	]
	var content = "";
	for(var i=0; i<setingData.length;i++){
		var one = setingData[i];
		content += `
			<div style="padding: 5px 0px;">
				<input style="display:inline-block;width: 15px;height: 15px;display: inline-block;vertical-align: middle; -webkit-appearance:checkbox;margin-bottom: 3px;cursor: pointer;" name="Checkbox" type="checkbox" data-tag="`+one.tag+`" `+(one.checked ? "checked" : "")+`>
				<label style="display:inline-block;font-size: 14px;margin:3px 0;vertical-align: middle;font-weight:500;color:#000;">`+one.name+`</label>
			</div>
		`
	}
	dialog.showMake({
		"title":"功能开关",
		"content":content,
		"onClose":function(){
			location.reload();
		},
		"onContentReady":function($that){
			$that.dialogContent.querySelectorAll("input[type='checkbox']").forEach(function(checkbox){
				checkbox.addEventListener("click", function(e){
					var tag = e.target.getAttribute("data-tag");
					var checked = e.target.checked;
					functionController[tag] = checked;
					commonFunctionObject.GMsetValue("setingData",functionController);
					commonFunctionObject.webToast({"message":"操作成功", "background":"#FF4D40"});
				});
			})
		}
	});
}

// 菜单按钮弹框
if(commonFunctionObject.isPC()){
	GM_registerMenuCommand("功能开关",()=>usersSeting());
}else{
	functionController.bilibiliHelper = false;
	functionController.searchEnginesNavigation = false;
	functionController.zhihuHelper = false;
}
	//VIP视频解析接口可自定义；请严格按照格式添加
//showType=1(仅PC), showType=2(仅mobile), showType=3(同时显示)
const originalInterfaceList = [

];

function SuperVideoHelper(originalInterfaceList) {
  this.originalInterfaceList = originalInterfaceList;
  this.elementId = Math.ceil(Math.random() * 100000000) + "mmx";
  this.customInterfaceKey = "custom_interface_key_dddsdxxa";
  this.quicklyInterfaceKey = "custom_quickly_interface_key_dddsdxxa";
  this.defaultQuicklyInterfaceIndex = 1;
  this.isRun = function() { //判断是否运行
    const host = window.location.host;
    const urls = ["www.iqiyi.com", "v.qq.com", "youku.com", "www.le.com", "mgtv.com", "sohu.com", "acfun.cn", "bilibili.com",
      "baofeng.com", "pptv.com", "1905.com", "miguvideo.com", "sports.iqiyi.com"
    ];
    let result = false;
    if (!host.startsWith("m.")) { //不是移动端执行
      for (let i = 0; i < urls.length; i++) {
        if (window.location.host.includes("bilibili.com")) {
          if (window.location.href.includes("www.bilibili.com/bangumi/play")) {
            result = true;
            break;
          }
        } else {
          if (window.location.host.includes(urls[i])) {
            result = true;
            break;
          }
        }
      }
    }
    return result;
  };
  this.showPlayerWindow = function(playObject) { //显示播放窗口
    const url = playObject.url + window.location.href;
    commonFunctionObject.GMopenInTab(url);
  };
  this.analysisCustomInterface = function() { //自定义接口解析
    const customInterface = commonFunctionObject.GMgetValue(this.customInterfaceKey, "");
    if (customInterface) {
      try {
        const customizeInterfaceList = [];
        const analysisArray = customInterface.split("\n");
        for (let i = 0; i < analysisArray.length; i++) {
          const onePiece = analysisArray[i];
          if (onePiece && onePiece.includes(",")) {
            const onePieceArray = onePiece.split(",");
            if (onePieceArray.length === 2 && onePieceArray[0] && /(http|https):\/\/\S*/.test(onePieceArray[1])) {
              customizeInterfaceList.push({
                "name": "" + onePieceArray[0] + "",
                "url": "" + onePieceArray[1] + "",
                "showType": 1
              });
            }
          }
        }
        this.originalInterfaceList = customizeInterfaceList.concat(this.originalInterfaceList);
      } catch (e) {}
    }
  };
  this.getQuicklyInterfaceIndex = function() {
    const quicklyInterfaceIndexString = commonFunctionObject.GMgetValue(this.quicklyInterfaceKey, "") + "";
    let quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
    if (quicklyInterfaceIndexString) {
      quicklyInterfaceIndex = parseInt(quicklyInterfaceIndexString);
    }
    if (this.originalInterfaceList.length - 1 < quicklyInterfaceIndex) {
      quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
    }
    return quicklyInterfaceIndex;
  };
  this.addHtmlElements = function() { //添加HTML
    const vipVideoImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=";
	const quicklyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAv1JREFUWEfFl02IVWUYx39/EDdKoCiCGYquxNw404QL+wA/wIUfA5luMotk0jGoiDQFv1oMqCCOFkYQtopczKxMGsUUF2bNKsWFKBroJtLI2qjwl+dy7uV47jnnnntnygcOF97nfd7/777nfZ7nPeIZm8Zb3/ZsYBEwE5gFzAGmAX8lz9/AA0l7QnvcAGwvBd4E1gOTK/yxvQExZgDbbwHvAq9UEE1POSzpwzEB2D4KbG1TuD79G0nvdAxg+2egp0PxCBuS1NsRgG2PQbgeelbS0rYBbJ8DXisAuAdcB2Ykp7+M8ztJGyoD2H4J+AxYU7DqoKQP6j7b24AjJQQDknaUAtieDvQmz/KSxUYkNfltx07FjuVZv6RjhQC21wIHgHkV3vc2SZERTWb7d+CFHFevpKFcANvvA19UEK5PWSnphwKAS8DLGd8/wIuSbjcB2I4SubsN8Zj6iaSDBQB/AlMzvq8lvRdjTwEk5XSkTfHadEl5fyYOYRzGrC2TdOYpANvdwC+diKditgNXkxRcBSzLWe+CpFfr4w1q21eABZmAx8DFkrzvhHejpG/zAPqSbhaCtUfSv7YHgE87UcqJOSapPz1eqRDZ/h54Y4wQlyVls6H6fcD2r0BXpxB5h7QpC1otbjtq/ZRW8zL+nyS9XhTTqhR3SRpNB9u+k1y3qnAMS4qKWmhFlXAlsC/Z8lvAifodLlayPQysrkDQI6k0tfOKx0TgGjA3I7BO0sn6mO1DwEclED9KWtEKMg/gOLA5J/CupOczryN2aUlBneiTFGuVWrYUR6pFyhVZd86ZeARMyATcABZL+qMygO043eeBhQVBo5KiXDfM9iQgOlvWaq22lXj406X4c2BnQdDNaCqSTmUA4h2fzsRskfRlFfEGgO35QPTt53ICv0rEH2Z9tvcDu1LjtY+NquJpgLh8xCUkbb8B+9MnPwcgfUFttNhOANILxbfbIHBI0v2yxWx/DGwC3pYUpbptq52B5BYUPTryP2638fu/WKVu+F+SPAG7l/wh4NsJOQAAAABJRU5ErkJggg==";
	const currentHost = window.location.host;

    const quicklyInterfaceIndex = this.getQuicklyInterfaceIndex();
    let currentQuicklyInterfaceObject = null;

    let category_1_html = "";
    this.originalInterfaceList.forEach((item, index) => {
      if (item.showType !== 2) {
        let selected = "";
        if (index === quicklyInterfaceIndex) {
          selected = "selected";
          currentQuicklyInterfaceObject = item;
        }
        category_1_html += `<span title="${item.name}" data-index="${index}" class="${selected}">${item.name}</span>`;
      }
    });

    let left = 0;
    let top = 120;
    const position = commonFunctionObject.GMgetValue("Position_" + currentHost);
    if (position) {
      left = position.left;
      top = position.top;
    }
    let color = "#FF4D40";
    let hoverColor = "#000000";
    if (currentHost.includes("bilibili.com")) {
      color = "#fb7299";
      hoverColor = "#00B0E1";
    }

    const cssMould = `#vip_movie_box${this.elementId}{cursor:pointer; position:fixed; top:${top}px; left:${left}px; width:0px; z-index:99999999; font-size:16px; text-align:left;}
        #vip_movie_box${this.elementId} .img_box${this.elementId}{width:24px; height:32px;line-height:32px;text-align:center;background-color:${color};}
        #vip_movie_box${this.elementId} .img_box${this.elementId}:hover{
            background: linear-gradient(30deg, #2a66ff 40%, ${color});
        }
        #vip_movie_box${this.elementId} .img_box${this.elementId}>img {width:20px; display:inline-block; vertical-align:middle;}
        #vip_movie_box${this.elementId} .showhide_box${this.elementId}{display:none;padding-left:5px;position: absolute;left: 24px;top: 0;}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii{width:380px; max-height:400px; overflow-y:auto;background-color:rgba(241,241,241);}
        #vip_movie_box${this.elementId} .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
        #vip_movie_box${this.elementId} .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
        #vip_movie_box${this.elementId} .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId}{margin-bottom:10px;}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId}:last-child{margin-bottom:0px;}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId} > .title${this.elementId}{font-size:14px; text-align:left;color:#000000;font-weight:600;margin:5px 3px;}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId} > .interface_box${this.elementId}{}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId} > .interface_box${this.elementId} > span{border-radius:3px;border-top:3px solid ${color}; border-bottom:3px solid ${color};display:inline-block;width:calc(25% - 6px);width:-moz-calc(25% - 6px);width: -webkit-calc(25% - 6px);height:20px;line-height:20px;background-color:${color};color:#FFF;cursor:pointer;margin:3px;text-align:center;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;font-size:12px!important;box-sizing:content-box!important;}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId} > .interface_box${this.elementId} > span:hover{border-top:3px solid ${hoverColor}; border-bottom:3px solid ${hoverColor};}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId} > .interface_box${this.elementId} > span.selected{border-top:3px solid ${hoverColor}; border-bottom:3px solid ${hoverColor};}
        #vip_movie_box${this.elementId} .vip_mod_box_action_687ii > .item_box${this.elementId} > .content${this.elementId}{font-size:12px;color:#000000;margin-left:3px;}
        `;
    commonFunctionObject.GMaddStyle(cssMould);

    const htmlMould = `<div id='vip_movie_box${this.elementId}'>
        <div class='plugin_inner_${this.elementId}'>
            <div class='img_box${this.elementId}' id='img_box_jump_6667897iio'><img src='${vipVideoImageBase64}' title='选择解析线路'/></div>
            <div class='showhide_box${this.elementId}'>
                <div class='vip_mod_box_action_687ii default-scrollbar-55678'>
                    <div class='item_box${this.elementId}'>
                        <div class='title${this.elementId}'><b>接口添加</b></div>
                        <div class='content${this.elementId}'>
                            对现有接口不满意？可添加自定义接口哟~<span id='img_set_6667897iio' style='display:inline-block;border-radius:2px;margin-left:5px;padding:3px 5px;background-color:#CCC;cursor:pointer;'>添加接口</span>
                        </div>
                        <div class='title${this.elementId}'>
                            <a style='font-size:13px;color:blue;' href='javascript:void(0);' target='_blank'>接口请自行添加~</a>
                        </div>
                    </div>
                    <div class='item_box${this.elementId}' style='min-height:80px;border:1px dashed #000;'>
                        <div class='interface_box${this.elementId}'>
                            ${category_1_html}
                        </div>
                    </div>
                    <div class='item_box${this.elementId}' style='padding:10px 0px;'>
                        <div class='title${this.elementId}'><b>免责声明：</b></div>
                        <div class='content${this.elementId}'>
                            1、<b style='color:red;'>需要使用VIP视频解析的，请自行添加接口</b>，版权问题请联系相关解析接口所有者，脚本不承担相关责任！"<br>
                            2、为创造良好的创作氛围，请大家支持正版！<br>
                            3、脚本仅限个人学习交流，使用即已代表您已经充分了解相关问题，否则后果自负，特此声明！<br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='img_box${this.elementId}' id='img_quickly_6667897iio'><img src='`+quicklyBase64+`' title='快速开始(当前所选接口：${currentQuicklyInterfaceObject ? currentQuicklyInterfaceObject.name : '无'})'/></div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', htmlMould);
  };
  this.runEvent = function() { //事件运行
    const that = this;
    const vipMovieBox = document.getElementById(`vip_movie_box${this.elementId}`);
    const pluginInner = vipMovieBox.querySelector(`.plugin_inner_${this.elementId}`);
    const showhideBox = vipMovieBox.querySelector(`.showhide_box${this.elementId}`);
    const interfaceBox = vipMovieBox.querySelector(`.interface_box${this.elementId}`);
    const imgSetBtn = document.getElementById('img_set_6667897iio');
    const imgQuicklyBtn = document.getElementById('img_quickly_6667897iio');
    const quicklyImg = imgQuicklyBtn.querySelector('img');

    pluginInner.addEventListener("mouseover", () => {
      showhideBox.style.display = 'block';
    });
    pluginInner.addEventListener("mouseout", () => {
      showhideBox.style.display = 'none';
    });

    interfaceBox.addEventListener("click", function(event) {
      if (event.target.tagName === 'SPAN') {
        const span = event.target;
        const index = parseInt(span.dataset.index);
        const playObject = that.originalInterfaceList[index];
        that.showPlayerWindow(playObject);

        const allSpans = this.querySelectorAll('span');
        allSpans.forEach(s => s.classList.remove("selected"));
        span.classList.add("selected");
        commonFunctionObject.GMsetValue(that.quicklyInterfaceKey, index);

        quicklyImg.title = `快速开始(当前所选接口：${playObject.name})`;
      }
    });

    imgSetBtn.addEventListener("click", () => {
      that.showSetingDialog();
    });

    imgQuicklyBtn.addEventListener("click", () => {
      const quicklyInterfaceIndex = that.getQuicklyInterfaceIndex();
      const playObject = that.originalInterfaceList[quicklyInterfaceIndex];
      that.showPlayerWindow(playObject);
    });

    //右键移动位置
    vipMovieBox.addEventListener('mousedown', function(e) {
      if (e.which === 3) {
        e.preventDefault();
        vipMovieBox.style.cursor = "move";
        const positionDiv = this.getBoundingClientRect();
        const distenceX = e.pageX - positionDiv.left;
        const distenceY = e.pageY - positionDiv.top;

        const mouseMoveHandler = function(e) {
          let x = e.pageX - distenceX;
          let y = e.pageY - distenceY;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          if (x < 0) {
            x = 0;
          } else if (x > windowWidth - vipMovieBox.offsetWidth - 100) {
            x = windowWidth - vipMovieBox.offsetWidth - 100;
          }

          if (y < 0) {
            y = 0;
          } else if (y > windowHeight - vipMovieBox.offsetHeight) {
            y = windowHeight - vipMovieBox.offsetHeight;
          }

          vipMovieBox.style.left = `${x}px`;
          vipMovieBox.style.top = `${y}px`;
          commonFunctionObject.GMsetValue("Position_" + window.location.host, {
            "left": x,
            "top": y
          });
        };

        const mouseUpHandler = function() {
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
          vipMovieBox.style.cursor = "pointer";
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        document.addEventListener('contextmenu', e => e.preventDefault());
      }
    });
  };
  this.removeVideoAdBlock_iqiyi = function() {

  };
  this.removeVideoAdBlock_vqq = function() {

  };
  this.removeVideoAdBlock_youku = function() {

  };
  this.removeVideoAdBlock_mgtv = function() {

  };
  this.removeVideoAdBlock_sohu = function() {

  };
  this.removeVideoAdBlock = function() {
    const currentHost = window.location.host;
    if (currentHost.includes("www.iqiyi.com")) {
      this.removeVideoAdBlock_iqiyi();
    } else if (currentHost.includes("v.qq.com")) {
      this.removeVideoAdBlock_vqq();
    } else if (currentHost.includes("v.youku.com")) {
      this.removeVideoAdBlock_youku();
    } else if (currentHost.includes("www.mgtv.com")) {
      this.removeVideoAdBlock_mgtv();
    } else if (currentHost.includes("tv.sohu.com")) {
      this.removeVideoAdBlock_sohu();
    }
  };
  this.showSetingDialog = function() {
    const that = this;
    const customInterfaceKey = that.customInterfaceKey;
    const customInterface = commonFunctionObject.GMgetValue(customInterfaceKey, "");

    const content = `
      <div>
        <div style="font-size:14px;font-weight:700;color:#000;">自定义解析接口</div>
        <div style="font-size:13px;color:red;">
          数据格式：[名字] + [,] + [接口地址]<br>
          例如：就是名字而已,https://xxxxxx?url=<br>
          注：一行一个
        </div>
        <div style="margin-top:5px;height:200px;width:100%;">
          <textarea
            placeholder="请严格按照格式填写，否则不生效"
            class="custom-interface-textarea"
            style="color:#000;font-size:14px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;padding:5px;height:100%;width:100%;Overflow:auto;border:1px solid #ccc;resize:none;background-color:#FFF;outline:none;">${customInterface}</textarea>
        </div>
        <div style="text-align:center;margin-top:15px;">
          <button class="save-custom-interface-btn" style="color:#000;cursor:pointer;">保存自定义接口</button>
        </div>
      </div>
    `;

    dialog.showMake({
      "title": "解析接口添加",
      "content": content,
      "onContentReady": function($that) {
        const saveCustomInterfaceBtn = $that.dialogContent.querySelector(".save-custom-interface-btn");
        saveCustomInterfaceBtn.addEventListener("click", function() {
          const customInterfaceTextarea = $that.dialogContent.querySelector(".custom-interface-textarea");
          const content = customInterfaceTextarea.value;
          commonFunctionObject.GMsetValue(customInterfaceKey, content);
          commonFunctionObject.webToast({
            "message": "自定义接口保存成功",
            "background": "#FF4D40"
          });
        });
      }
    });
  };
  this.start = function() {
    let delayTimeMs = 0;
    if (window.location.host.includes("www.bilibili.com")) {
      delayTimeMs = 2200;
    }
    setTimeout(() => {
      try {
        this.removeVideoAdBlock();
      } catch (e) {}
      try {
        this.analysisCustomInterface();
        this.addHtmlElements();
        this.runEvent();
      } catch (e) {}
    }, delayTimeMs);
  };
}

/**
 * 移动端VIP解析
 * @param {Object} originalInterfaceList
 */
function SuperVideoHelperMobile(originalInterfaceList) {
  this.originalInterfaceList = originalInterfaceList;
  this.elementId = Math.ceil(Math.random() * 100000000) + "mmx";
  this.quicklyInterfaceKey = "custom_mobile_quickly_interface_key_dddsdxxa";
  this.defaultQuicklyInterfaceIndex = 2;
  this.playerNodes = [{
    "url": "m.iqiyi.com",
    "showNode": ".m-video-player-wrap",
    "color": "#05B03B"
  }, {
    "url": "m.v.qq.com",
    "showNode": ".mod_player",
    "color": "#F99D39"
  }, {
    "url": "m.youku.com",
    "showNode": ".h5-detail-player",
    "color": "#08BAFD"
  }, {
    "url": "m.mgtv.com",
    "showNode": ".video-area",
    "color": "#E95904"
  }];
  this.isRun = function() { //判断是否运行
    const host = window.location.host;
    const urls = ["m.iqiyi.com", "m.v.qq.com", "m.youku.com", "m.mgtv.com", "m.bilibili.com"];
    let result = false;
    if (host.startsWith("m.")) { //是移动端执行
      for (let i = 0; i < urls.length; i++) {
        if (host.includes(urls[i])) {
          result = true;
          break;
        }
      }
    }
    return result;
  };
  this.getwindowElement = function() {
    let nodeObject = null;
    for (let i in this.playerNodes) { //获得窗口ID
      if (this.playerNodes[i].url === window.location.host) {
        nodeObject = this.playerNodes[i];
        break;
      }
    }
    return nodeObject;
  };
  this.getQuicklyInterfaceIndex = function() {
    const quicklyInterfaceIndexString = commonFunctionObject.GMgetValue(this.quicklyInterfaceKey, "") + "";
    let quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
    if (quicklyInterfaceIndexString) {
      quicklyInterfaceIndex = parseInt(quicklyInterfaceIndexString);
    }
    if (this.originalInterfaceList.length - 1 < quicklyInterfaceIndex) {
      quicklyInterfaceIndex = this.defaultQuicklyInterfaceIndex;
    }
    return quicklyInterfaceIndex;
  };
  this.addHtmlElements = function() {
    const nodeObject = this.getwindowElement();
    const quicklyInterfaceIndex = this.getQuicklyInterfaceIndex();
    if (!nodeObject) return;
    return new Promise((resolve, reject) => {
      const elementInterval = setInterval(() => {
        const nodeElementObject = document.querySelector(nodeObject.showNode);
        const themeColor = nodeObject.color;

        if (!nodeElementObject) return;
        clearInterval(elementInterval);

        let category_1_html = "";
        this.originalInterfaceList.forEach((item, index) => {
          if (item.showType !== 1) {
            const selected = index === quicklyInterfaceIndex ? "selected" : "";
            category_1_html += `<option value='${item.url}' index='${index}' ${selected}>${item.name}</option>`;
          }
        });

        const htmlMould = `
          <div style="margin:15px 15px 50px 15px;padding:10px;background-color:${themeColor};border-radius:4px;cursor:pointer;z-index: 999999999999999999999;color:#FFF;">
            <div style="font-weight:700;font-size:14px;text-align:center;">
              <span>选择解析接口</span>
              <select id="interface_selection_${this.elementId}" style="background-color:#FFF;padding: 0px 10px;">
                ${category_1_html}
              </select>
            </div>
            <div style="text-align:center;">
              <a href="javascript:void(0);" id="start_analysis_outer_${this.elementId}" style="box-sizing:border-box;margin:10px 0px;display:inline-block;padding:10px 0px;width:100%;border-radius:4px;color:#FFF;background-color:#F2503F;font-size:14px;">站外解析</a>
            </div>
            <div style="text-align:left;font-size:10px;">
              <div>
                免责申明：1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者！
                2、为创造良好的创作氛围，请大家支持正版！
                3、脚本仅限个人学习交流，切勿用于任何商业等其它用途！
                4、继续使用，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险脚本不承担任何责任！
              </div>
            </div>
          </div>
        `;
        nodeElementObject.insertAdjacentHTML('afterend', htmlMould);
        resolve("ok");
      }, 100);
    });
  };
  this.getPlayObjectBySelect = function() {
    const selectElement = document.getElementById(`interface_selection_${this.elementId}`);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const indexString = selectedOption.getAttribute("index");
    const index = indexString ? parseInt(indexString) : 0;
    return this.originalInterfaceList[index];
  };
  this.runEvent = function() { //事件运行
    const self = this;
    const startAnalysisBtn = document.getElementById(`start_analysis_outer_${self.elementId}`);
    const interfaceSelection = document.getElementById(`interface_selection_${self.elementId}`);

    const playObject = self.getPlayObjectBySelect();
    startAnalysisBtn.href = playObject.url + window.location.href;

    startAnalysisBtn.addEventListener('click', function(e) {
      if (commonFunctionObject.GMgetValue("copyright_video_remind_mobile_outer", null) === "true") {
        return;
      }
      const r = confirm(
        "脚本运行提醒！！！\u000d" +
        "使用站外解析功能，视频解析时脚本跳出本页面，如不同意此脚本行为，请点击【取消】按钮！！"
      );
      if (r === false) {
        e.preventDefault();
      } else {
        commonFunctionObject.GMsetValue("copyright_video_remind_mobile_outer", "true");
      }
    });

    interfaceSelection.addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      const value = selectedOption.value;
      const index = parseInt(selectedOption.getAttribute("index"));
      startAnalysisBtn.href = value + window.location.href;
      commonFunctionObject.GMsetValue(self.quicklyInterfaceKey, index);
    });
  };
  this.start = function() {
    const self = this;
    if (this.isRun()) {
      this.addHtmlElements().then(() => {
        self.runEvent();
      });
    }
  };
}

try {
  let newOriginalInterfaceList = originalInterfaceList;
  if (!functionController || functionController.superVideoHelper) {
    const superVideoHelperObject = new SuperVideoHelper(newOriginalInterfaceList);
    if (superVideoHelperObject.isRun()) {
      if (commonFunctionObject.GMgetValue("copyright_video_remind", null) === "true") {
        superVideoHelperObject.start();
      } else {
        const r = confirm(
          "脚本运行提醒！！！\u000d" +
          "1、VIP视频解析中所用到的解析接口全部收集自互联网（源码可见），版权问题请联系相关解析接口所有者！\u000d" +
          "2、为创造良好的创作氛围，请大家支持正版！\u000d" +
          "3、脚本仅限个人学习交流，切勿用于任何商业等其它用途！\u000d" +
          "4、继续使用，即表明你已经明确使用脚本可能带来的风险，且愿意自行承担相关风险，对于风险脚本不承担任何责任！\u000d" +
          "5、此提醒只弹出一次，确认后，后续将不在弹出，请知悉！"
        );
        if (r === true) {
          commonFunctionObject.GMsetValue("copyright_video_remind", "true");
          superVideoHelperObject.start();
        }
      }
    }
    (new SuperVideoHelperMobile(newOriginalInterfaceList)).start();
  }
} catch (e) {
  console.log("全网VIP解析：error：" + e);
}
	/**
 * B站相关功能：视频多P下载，一键三联，浏览记录等
 */
function BilibiliHelper() {
  this.isRun = function() {
    return window.location.host.indexOf("bilibili.com") !== -1;
  };
  this.baseFunction = function() {
    /**
     * B站基本功能，一件三连、视频解析、视频下载
     */
    function baseFunctionObject() {
      this.elementId = Math.ceil(Math.random() * 100000000) + "mmx";
      this.downloadSettingKey = "download_setting_key";
      this.downloadResutError = function(btnElement) {
        btnElement.textContent = "下载视频";
        btnElement.removeAttribute("disabled");
      };
      this.downloadResutSuccess = function(btnElement) {
        btnElement.textContent = "下载视频";
        btnElement.removeAttribute("disabled");
      };
      this.getDownloadPages = function() {
        return new Promise(function(resolve, reject) {
          const pathname = window.location.pathname;
          let bv = null;
          if (pathname.indexOf("/medialist/play/watchlater/") !== -1) {
            bv = pathname.replace("/medialist/play/watchlater/", "").replace("/", "");
          } else {
            bv = pathname.replace("/video/", "").replace("/", "");
          }
          if (!bv) {
            resolve({
              "status": "bv_null"
            });
            return;
          }
          commonFunctionObject.request("get", "https://api.bilibili.com/x/web-interface/view?bvid=" + bv, null).then((resultData) => {
            const dataJson = JSON.parse(resultData.data);
            if (!dataJson || dataJson.code !== 0 || !dataJson.data) {
              resolve({
                "status": "request_error"
              });
              return;
            }
            const data = dataJson.data;
            if (!data) {
              resolve({
                "status": "aid_null"
              });
              return;
            }
            const aid = data.aid;
            const pic = data.pic;
            const title = data.title;
            if (!aid) {
              resolve({
                "status": "aid_null"
              });
              return;
            }
            commonFunctionObject.request("get", "https://api.bilibili.com/x/web-interface/view?aid=" + aid, null).then((resultData2) => {
              const dataJson2 = JSON.parse(resultData2.data);
              if (!dataJson2 || dataJson2.code !== 0 || !dataJson2.data) {
                resolve({
                  "status": "request_error"
                });
                return;
              }
              const downloadData = dataJson2.data;
              const {
                aid,
                bvid
              } = downloadData;
              const items = [];
              if (downloadData.hasOwnProperty("ugc_season") && downloadData.ugc_season.hasOwnProperty("sections")) {
                const sections = downloadData.ugc_season.sections;
                let page = 1;
                for (let i = 0; i < sections.length; i++) {
                  const section = sections[i];
                  if (section.hasOwnProperty("episodes")) {
                    for (let j = 0; j < section.episodes.length; j++) {
                      const episode = section.episodes[j];
                      items.push({
                        "cover": "",
                        "page": page,
                        "title": episode.title,
                        "cid": episode.cid,
                        "aid": episode.aid
                      });
                      page++;
                    }
                  }
                }
              } else {
                for (let i = 0; i < downloadData.pages.length; i++) {
                  const pageData = downloadData.pages[i];
                  items.push({
                    "cover": pageData.first_frame,
                    "page": pageData.page,
                    "title": pageData.part,
                    "cid": pageData.cid,
                    "aid": aid
                  });
                }
              }
              resolve({
                "status": "success",
                "downloadData": {
                  "items": items,
                  "pic": pic,
                  "title": title
                }
              });
            }).catch((errorData) => {
              resolve({
                "status": "request_error"
              });
            });
          }).catch((errorData) => {
            resolve({
              "status": "request_error"
            });
          });
        });
      };
      this.startDownloadFile = function(options) {
        let aid = options.aid,
          cid = options.cid,
          fileName = options.fileName,
          savePath = options.savePath,
          RPCURL = options.RPCURL,
          RPCToken = options.RPCToken;
        let isByPRC = options.isByPRC;

        commonFunctionObject.request("get", "https://api.bilibili.com/x/player/playurl?avid=" + aid + "&cid=" + cid + "&qn=112", null).then((resultData3) => {
          if (!fileName) {
            fileName = (new Date()).getTime() + "";
          }
          fileName = fileName.replace(/[\ |\~|\`|\=|\||\\|\;|\:|\"|\'|\,|\.|\>|\/]/g, "");
          fileName = fileName.substring(0, 50);
          fileName = fileName + ".mp4";

          const dataJson3 = JSON.parse(resultData3.data);
          if (!!dataJson3 && dataJson3.code === 0 && !!dataJson3.data) {
            const downloadUrl = dataJson3.data.durl[0].url;
            if (isByPRC) {
              commonFunctionObject.RPCDownloadFile(fileName, downloadUrl, savePath, RPCURL).then((data) => {
                commonFunctionObject.webToast({
                  "message": data,
                  "time": 3000
                });
              }).catch((data) => {
                commonFunctionObject.webToast({
                  "message": data,
                  "time": 3000
                });
              });
            } else {
              window.open(downloadUrl);
            }
          } else {
            commonFunctionObject.webToast({
              "message": "获取下载链接失败",
              "background": "#FF4D40"
            });
          }
        }).catch((errorData) => {
          commonFunctionObject.webToast({
            "message": "获取下载链接失败",
            "background": "#FF4D40"
          });
        });
      };
      this.createModals = function() {
        const css = `
          .modal-mask-${this.elementId}{
            position:fixed;
            top:0;
            left:0;
            z-index:999;
            width:100%;
            height:100%;
            display:none;
            background-color:#000;
            opacity:0.3;
            overflow:hidden;
          }
          .modal-body-${this.elementId}{
            position:fixed;
            border-radius:5px;
            background-color: #FFFFFF;
            top:10%;
            width:600px;
            max-width:90%;
            max-height:80%;
            z-index:1000;
            left: 50%;
            transform: translateX(-50%);
            display:none;
            padding: 10px;
            overflow-y: auto;
          }
          .modal-body-${this.elementId} >.page-header{
            height:30px;
            line-height:30px;
            position:relative;
          }
          .modal-body-${this.elementId} >.page-header >span{
            display:inline-block;
          }
          .modal-body-${this.elementId} >.page-header >span:nth-child(1) {
            font-size:18px;
            font-weight:bold;
            position:absolute;
            left:10px;
          }
          .modal-body-${this.elementId} >.page-header >span:nth-child(2) {
            font-size:28px;
            font-weight:bold;
            position:absolute;
            right:10px;
            cursor:pointer;
          }
          .modal-body-${this.elementId} >.page-container{
            max-height: 500px;
            overflow-y: auto;
          }
          .modal-body-${this.elementId} .page-wrap{
            display: flex;
            flex-wrap: wrap;
            margin-top:5px;
          }
          .modal-body-${this.elementId} .page-wrap >.board-item{
            display: block;
            width: calc(50% - 10px);
            background-color: #6A5F60;
            margin: 5px;
            background-color:#FB7299;
            color:#FFFFFF;
            cursor: pointer;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
          }
          .modal-body-${this.elementId} .page-wrap >.board-item >input{
            width: 14px;
            height: 14px;
            vertical-align: middle;
            margin-right:5px;
          }
          .modal-body-${this.elementId} .page-wrap >.board-item >span{
            vertical-align: middle;
          }
          .modal-body-${this.elementId} .modal-btn-wrap{
            text-align: center;
            margin-top: 10px;
            cursor: pointer;
          }
          .modal-body-${this.elementId} .aria2-setting{
            border:1px dashed #F1F1F1;
            border-radius:4px;
            margin-top:10px;
          }
          .modal-body-${this.elementId} .aria2-setting >.setting-item{
            text-align: center;
            font-size:14px;
            margin:10px 0px;
          }
          .modal-body-${this.elementId} .aria2-setting >.setting-item .topic-name{
            display:inline-block;
            width:80px;
            text-align:left;
          }
          .modal-body-${this.elementId} .aria2-setting >.setting-item> input{
            width:300px;
            padding-left:10px;
            border:1px solid #888;
            outline:none;
            border-radius:3px;
          }
          .modal-body-${this.elementId} .modal-btn-wrap >span{
            border:1px solid #ccc;
            display:inline-block;
            padding:3px 5px;
            margin:0px 5px;
            border-radius:3px;
          }
          .modal-body-${this.elementId} .tip-wrap{
            margin-top: 10px;
            font-size:12px;
          }
          .modal-body-${this.elementId} .tip-wrap >.title{
            font-size:16px;
            font-weight:bold;
          }
          .modal-body-${this.elementId} .tip-wrap >.content >ul >li{
            margin-top:5px;
          }
        `;

        const html = `
          <div class='modal-mask-${this.elementId}'></div>
          <div class='modal-body-${this.elementId}'>
            <div class="page-header">
              <span>视频下载(可批量)</span>
              <span class="close">×</span>
            </div>
            <div class="page-container">
              <label style="color:red;">注：此功能会调用bilibili的API，脚本仅用于个人交流，切勿用于商业用途，否则后果自负，特此申明！</label>
              <div class="page-wrap">
              </div>
              <div class="aria2-setting">
                <div class="setting-item">
                  <span><input type="radio" name="downloadWay" value="Motrix">Motrix下载</span>&nbsp;&nbsp;&nbsp;
                  <span><input type="radio" name="downloadWay" value="AriaNgGUI">AriaNgGUI下载</span>
                </div>
                <div class="setting-item">
                  <label class="topic-name">配置RPC:</label><input type="text" name="RPCURL" value="" placeholder="请准确输入RPC对应软件的地址，默认：Motrix">
                </div>
                <div class="setting-item">
                  <label class="topic-name">配置Token:</label><input type="text" name="RPCToken" value="" placeholder="默认无需填写">
                </div>
                <div class="setting-item">
                  <label class="topic-name">保存路径:</label><input type="text" name="savePath" value="" placeholder="请准确输入文件保存路径">
                  <div style="font-size:12px;color:#888;">最好自定义下载地址，默认地址可能不满足需要</div>
                </div>
              </div>
              <div class="modal-btn-wrap">
                <span name="selectall">全选</span>
                <span name="removeSelect">取消选择</span>
                <span name="downloadAll">批量下载</span>
              </div>
              <div class="tip-wrap">
                <div class="title">关于单P下载：</div>
                <div class="content"><span>点击弹框单个选集，即可下载单集视频！PS:单P下载，推荐大家使用BBDown下载，此工具功能很强大，具体查看：<a target="_blank" href="https://github.com/nilaoda/BBDown">https://github.com/nilaoda/BBDown</a></span></div>
              </div>
              <div class="tip-wrap">
                <div class="title">关于批量下载：</div>
                <div class="content">
                  <ul>
                    <li>
                      <b>1、批量下载需要第三方软件的支持，脚本推荐使用：Motrix</b>
                      <ul>
                        <li>Motrix下载地址：<a href="https://motrix.app/zh-CN/" target="_blank">https://motrix.app/zh-CN/</a></li>
                        <li>AriaNgGUI下载地址：<a href="https://github.com/Xmader/aria-ng-gui" target="_blank">https://github.com/Xmader/aria-ng-gui</a></li>
                      </ul>
                    </li>
                    <li>
                      <b>2、在批量下载前需要提前打开软件，本教程以Motrix为准</b>
                      <ul>
                        <li>(1)、如果全部按照默认配置，只需要打开软件即可</li>
                        <li>(2)、如果想自定义RPC地址和文件保存路径，可更改上面输入框的内容（此数据非常重要，请准确填写）</li>
                        <li>
                        (3)、Motrix运行图片
                        <img src="https://pic.rmb.bdstatic.com/bjh/8912582c0416119405ec37ea27d12376.jpeg" width="100%" />
                        </li>
                      </ui>
                    </li>
                    <li>
                      <b>3、默认RPC默认地址</b>
                      <ul>
                        <li>(1)、Motrix RPC默认地址：ws://localhost:16800/jsonrpc</li>
                        <li>(2)、Aria2 RPC默认地址：ws://localhost:6800/jsonrpc</li>
                        <li>(3)点击“批量下载会自动保存当前下载设置”</li>
                      </ul>
                    </li>
                    <li>
                      <b>4、如使用AriaNgGUI，使用方式类似，大家可以自行研究</b>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tip-wrap">
                <div class="title">必要说明：</div>
                <div class="content">
                  申明：本功能仅能作为学习交流使用，且不可用于其它用途，否则后果自负。请大家重视版权，尊重创作者，切勿搬运抄袭。请大家多用[一键三连]为创作者投币~，小破站牛掰！
                </div>
              </div>
            </div>
          </div>
        `;
        commonFunctionObject.GMaddStyle(css);
        document.body.insertAdjacentHTML('beforeend', html);
      };
      this.hideModals = function() {
        document.querySelector(`.modal-body-${this.elementId}`).style.display = 'none';
        document.querySelector(`.modal-mask-${this.elementId}`).style.display = 'none';
      };
      this.showModals = function(pageHtml) {
        const self = this;
        const downloadSettingKey = self.downloadSettingKey;

        document.querySelector(`.modal-body-${self.elementId}`).style.display = 'block';
        document.querySelector(`.modal-mask-${self.elementId}`).style.display = 'block';
        document.querySelector(`.modal-body-${self.elementId} .page-wrap`).innerHTML = pageHtml;

        let savePath = "D:/";
        if ("macOS" === commonFunctionObject.getSystemOS()) {
          savePath = "";
        }
        const downloadSetting = commonFunctionObject.GMgetValue(this.downloadSettingKey, {
          "RPCURL": "ws://localhost:16800/jsonrpc",
          "savePath": savePath,
          "RPCToken": '',
          "downloadWay": "Motrix"
        });
        const isMotrix = downloadSetting.downloadWay === "Motrix";

        document.querySelector(`.modal-body-${self.elementId} input[name='RPCURL']`).value = downloadSetting.RPCURL;
        document.querySelector(`.modal-body-${self.elementId} input[name='savePath']`).value = downloadSetting.savePath;
        document.querySelector(`.modal-body-${self.elementId} input[name='RPCToken']`).value = downloadSetting.RPCToken;

        const downloadWayRadios = document.querySelectorAll(`.modal-body-${self.elementId} input[name='downloadWay']`);
        downloadWayRadios.forEach(radio => radio.removeAttribute('checked'));
        if (isMotrix) {
          document.querySelector(`.modal-body-${self.elementId} input[value='Motrix']`).setAttribute('checked', 'true');
        } else {
          document.querySelector(`.modal-body-${self.elementId} input[value='AriaNgGUI']`).setAttribute('checked', 'true');
        }

        const boardItems = document.querySelectorAll(`.modal-body-${self.elementId} .page-wrap >.board-item >span`);
        boardItems.forEach(item => {
          item.removeEventListener("click", self.handleDownloadClick);
          self.handleDownloadClick = function() {
            this.style.backgroundColor = "#ccc";
            const downloadOptions = {
              "aid": this.dataset.aid,
              "cid": this.dataset.cid,
              "isByPRC": false
            };
            self.startDownloadFile(downloadOptions);
          };
          item.addEventListener("click", self.handleDownloadClick);
        });

        document.querySelector(`.modal-body-${self.elementId} .page-header >span.close`).addEventListener("click", () => {
          self.hideModals();
        });

        document.querySelector(`.modal-body-${self.elementId} .modal-btn-wrap >span[name='selectall']`).addEventListener("click", () => {
          document.querySelectorAll(`.modal-body-${self.elementId} .page-wrap input[type='checkbox']`).forEach(checkbox => {
            checkbox.checked = true;
          });
        });

        document.querySelectorAll(`.modal-body-${self.elementId} input[name='downloadWay']`).forEach(radio => {
          radio.removeEventListener("change", self.handleDownloadWayChange);
          self.handleDownloadWayChange = function() {
            if (this.value === "Motrix") {
              document.querySelector(`.modal-body-${self.elementId} input[name='RPCURL']`).value = "ws://localhost:16800/jsonrpc";
            } else {
              document.querySelector(`.modal-body-${self.elementId} input[name='RPCURL']`).value = "ws://localhost:6800/jsonrpc";
            }
          };
          radio.addEventListener("change", self.handleDownloadWayChange);
        });

        document.querySelector(`.modal-body-${self.elementId} .modal-btn-wrap >span[name='removeSelect']`).addEventListener("click", () => {
          document.querySelectorAll(`.modal-body-${self.elementId} .page-wrap input[type='checkbox']`).forEach(checkbox => {
            checkbox.checked = false;
          });
        });

        document.querySelector(`.modal-body-${self.elementId} .modal-btn-wrap >span[name='downloadAll']`).addEventListener("click", () => {
          const RPCURL = document.querySelector(`.modal-body-${self.elementId} input[name='RPCURL']`).value;
          const savePath = document.querySelector(`.modal-body-${self.elementId} input[name='savePath']`).value;
          const RPCToken = document.querySelector(`.modal-body-${self.elementId} input[name='RPCToken']`).value;
          const downloadWay = document.querySelector(`.modal-body-${self.elementId} input[name='downloadWay']:checked`).value;

          commonFunctionObject.GMsetValue(downloadSettingKey, {
            "RPCURL": RPCURL,
            "savePath": savePath,
            "RPCToken": RPCToken,
            "downloadWay": downloadWay
          });

          const inputElements = document.querySelectorAll(`.modal-body-${self.elementId} .page-wrap input[type='checkbox']:checked`);
          if (inputElements.length === 0) {
            commonFunctionObject.webToast({
              "message": "至少需要选中1P",
              "background": "#FF4D40"
            });
            return;
          }

          if (!savePath) {
            commonFunctionObject.webToast({
              "message": "保存路径不能为空",
              "background": "#FF4D40"
            });
            return;
          }
          if (!RPCURL) {
            commonFunctionObject.webToast({
              "message": "PRC地址不能为空",
              "background": "#FF4D40"
            });
            return;
          }

          const downloadOptions = {
            "aid": "",
            "cid": "",
            "isByPRC": true,
            "fileName": "",
            "savePath": savePath,
            "RPCURL": RPCURL,
            "RPCToken": RPCToken
          };

          inputElements.forEach((element, index) => {
            setTimeout(() => {
              const aid = element.dataset.aid;
              const cid = element.dataset.cid;
              const fileName = element.getAttribute("title");
              downloadOptions.aid = aid;
              downloadOptions.cid = cid;
              downloadOptions.fileName = fileName;
              self.startDownloadFile(downloadOptions);
            }, 1000 * index);
          });
        });
      };
      this.createElementHtml = async function() {
        const existingElement = document.getElementById("bilibili_exti_9787fjfh12j");
        if (existingElement) {
          existingElement.remove();
        }

        const randomNumber = this.elementId;
        const self = this;
        const cssText = `
          #bilibili_exti_9787fjfh12j{
            position:fixed;
            left:-30px;
            top:250px;
            opacity:0.6;
            transition: 0.3s;
          }
          #bilibili_exti_9787fjfh12j >.self_s_btn{
            background-color:#FB7299;
            color:#FFF;
            font-size:10px;
            border-radius:3px;
            cursor:pointer;
            margin:10px 0px;
            width:60px;
            height:20px;
            text-align:center;
            line-height:20px;
          }
        `;
        const htmlText = `
          <div id="bilibili_exti_9787fjfh12j">
            <div class="self_s_btn" id="download_s_${randomNumber}">下载视频</div>
            <div class="self_s_btn" id="focus_s_${randomNumber}">一键三连</div>
          </div>
        `;

        commonFunctionObject.GMaddStyle(cssText);
        document.body.insertAdjacentHTML('beforeend', htmlText);

        this.createModals();

        const bilibiliExti = document.getElementById("bilibili_exti_9787fjfh12j");
        bilibiliExti.addEventListener("mouseenter", function() {
          this.style.left = "0px";
          this.style.opacity = 1;
        });
        bilibiliExti.addEventListener("mouseleave", function() {
          this.style.left = (0 - this.offsetWidth) / 2 + "px";
          this.style.opacity = 0.6;
        });

        document.body.addEventListener("click", function(event) {
          if (event.target && event.target.id === `download_s_${randomNumber}`) {
            const btnElement = event.target;
            btnElement.setAttribute("disabled", "disabled");
            btnElement.textContent = "准备中~";
            self.getDownloadPages().then((resule) => {
              if (resule.status === "success") {
                const {
                  items,
                  pic,
                  title
                } = resule.downloadData;
                let itemHtml = "";
                itemHtml += `<div style='width:100%;'><a href='${pic}' target='_blank'>标题：${title}（点我跳转封面）</a></div>`;
                for (let i = 0; i < items.length; i++) {
                  const currentTitle = `【P${items[i].page}】${items[i].title}`;
                  itemHtml += `<div class='board-item'>`;
                  itemHtml += `<input data-aid='${items[i].aid}' data-cid='${items[i].cid}' title='${currentTitle}' type='checkbox'>`;
                  itemHtml += `<span data-aid='${items[i].aid}' data-cid='${items[i].cid}' title='${currentTitle}'>${currentTitle}</span>`;
                  itemHtml += `</div>`;
                }
                self.showModals(itemHtml);
                self.downloadResutSuccess(btnElement);
              } else {
                self.downloadResutError(btnElement);
              }
            }).catch((error) => {
              self.downloadResutError(btnElement);
            });
          }
          if (event.target && event.target.id === `focus_s_${randomNumber}`) {
            document.querySelector("#arc_toolbar_report .video-like")?.click();
            document.querySelector("#arc_toolbar_report .video-coin")?.click();
          }
        });
      };
      this.start = function() {
        const locationHost = window.location.host;
        const locationPathname = window.location.pathname;
        if (locationHost === "www.bilibili.com" && (locationPathname.indexOf("/video") !== -1 || locationPathname.indexOf("/watchlater") !== -1)) {
          this.createElementHtml();
        }
      };
    }
    try {
      (new baseFunctionObject()).start();
    } catch (e) {
      console.log("baseFunctionObject new error", e);
    }
  };
  /**
   * 浏览历史记录提醒
   */
  this.recordViewFunction = function() {
    function recordViewObject() {
      this.localCacheName = "bilibili_video_record";
      this.recordOneVideo = function() {
        return new Promise((resolve, reject) => {
          const bv = commonFunctionObject.getBilibiliBV();
          let cacheText = commonFunctionObject.GMgetValue(this.localCacheName);
          cacheText = cacheText ? cacheText : "";
          const maxLength = 12 * 500;
          const currentLength = cacheText.length;
          if (currentLength > maxLength) {
            cacheText = cacheText.substring(12 * 100, currentLength);
          }

          if (cacheText.indexOf(bv) === -1) {
            cacheText += bv;
            commonFunctionObject.GMsetValue(this.localCacheName, cacheText);
          }
          resolve({
            "result": "success"
          });
        });
      };
      this.searchPageRemindHtml = function(element, top = 8, right = 8) {
        if (!element.querySelector("div[name='marklooked']")) {
          element.style.position = "relative";
          const div = document.createElement("div");
          div.setAttribute("name", "marklooked");
          div.style.cssText = `z-index: 100;position:absolute; top:${top}px; right:${right}px; background-color: rgba(251,123,159,1); border-radius:3px; font-size:10px; color:#FFF;padding:0px 2px;`;
          div.textContent = "已看";
          element.appendChild(div);
        }
      };
      this.searchPageRemind = function() {
        const self = this;
        const elementArray = [
          {"node": ".bili-video-card", "top": 8, "right": 12},
          {"node": "#page-index .small-item", "top": 12, "right": 12},
          {"node": "#submit-video-list .small-item", "top": 12, "right": 12},
          {"node": "#page-series-detail .small-item.fakeDanmu-item", "top": 12, "right": 12},
        ];
        setInterval(function() {
          const cacheText = commonFunctionObject.GMgetValue(self.localCacheName) || "";
          elementArray.forEach(elementObj => {
            document.querySelectorAll(elementObj.node).forEach(element => {
              if (element.getAttribute("dealxll") !== "true") {
                const videoLink = element.querySelector("a[href^='//www.bilibili.com/video']");
                if (videoLink) {
                  const videourl = videoLink.getAttribute("href");
                  const bvs = videourl.match(/(\/BV(.*?)\/)/g);
                  if (bvs && bvs.length === 1) {
                    const bv = bvs[0].replace(/\//g, "");
                    if (cacheText.indexOf(bv) !== -1) {
                      self.searchPageRemindHtml(element, elementObj.top, elementObj.right);
                    }
                    element.addEventListener("click", () => {
                      self.searchPageRemindHtml(element, elementObj.top, elementObj.right);
                    });
                  }
                  element.setAttribute("dealxll", "true");
                }
              }
            });
          });
        }, 500);
      };
      this.start = function() {
        const self = this;
        if (window.location.pathname.indexOf("/video") !== -1 && window.location.host === "www.bilibili.com") {
          let currentHref = "";
          setInterval(() => {
            if (window.location.href !== currentHref) {
              this.recordOneVideo();
              currentHref = window.location.href;
            }
          }, 500);
        }
        if (window.location.host.indexOf("bilibili.com") !== -1) {
          this.searchPageRemind();
          GM_registerMenuCommand("清空B站浏览记录", function() {
            if (confirm('是否要清空B站浏览记录？清空后将不可恢复...')) {
              commonFunctionObject.GMsetValue(self.localCacheName, "");
            }
          });
        }
      };
    }
    try {
      (new recordViewObject()).start();
    } catch (e) {
      console.log("recordViewObject new error", e);
    }
  };
  /**
   * 视频描述文本转链接
   */
  this.textToLinkFunction = function() {
    function textToLinkObject() {
      this.link = function(selector) {
        const textToLinkArea = document.querySelector(selector);
        if (!textToLinkArea) {
          return;
        }
        findAndReplaceDOMText(textToLinkArea, {
          find: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g,
          replace: function(e, t) {
            const text = e.text;
            let element = null;
            if (text.indexOf("bilibili.com") === -1 && /^(http|ftp|https)/i.test(text)) {
              element = document.createElement("a");
              element.setAttribute("href", text);
              element.setAttribute("target", "_blank");
              element.style.color = "#00AEEC";
            } else {
              element = document.createElement("span");
            }
            element.innerText = text;
            return element;
          },
          preset: "prose"
        });
      };
      this.start = function() {
        const selector = "#v_desc";
        this.link(selector);

        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const bodyMutationObserver = new MutationObserver(() => {
          this.link(selector);
        });

        const element = document.querySelector(selector);
        if (element) {
          bodyMutationObserver.observe(element, {
            "characterData": true,
            "attributes": true,
            "childList": true
          });
        }
      };
    }
    try {
      (new textToLinkObject()).start();
    } catch (e) {
      console.log("textToLinkObject new error", e);
    }
  };
  this.signIn = async function() {};
  this.start = function() {
    if (this.isRun()) {
      this.baseFunction();
      this.recordViewFunction();
      this.textToLinkFunction();
      this.signIn();
    }
  };
}

try {
  if (!functionController || functionController.bilibiliHelper) {
    new BilibiliHelper().start();
  }
} catch (e) {
  console.log("B站视频下载：error：" + e);
}
	/**
 * 知乎助手开始
 */
function ZhihuHelper() {
  this.markArticleOrQuestion = function() {
    const questionsCss = `
			.AnswerItem .ContentItem-title a::before {
				content: '问题';
				color: #f68b83;
				background-color: #f68b8333;
				font-weight: bold;
				font-size: 13px;
				padding: 1px 4px 0px;
				border-radius: 2px;
				display: inline-block;
				vertical-align: middle;
				margin: 0px 4px 0px 0px;
			}
			.ArticleItem .ContentItem-title a::before {
				content: '文章';
				color: #0066FF;
				background-color: #E5EFFF;
				font-weight: bold;
				font-size: 13px;
				padding: 1px 4px 0;
				border-radius: 2px;
				display: inline-block;
				vertical-align: middle;
				margin: 0px 4px 0px 0px;
			}
			.ZvideoItem .ContentItem-title a::before {
				content:'视频';
				color: #00BCD4;
				background-color: #00BCD433;
				font-weight: bold;
				font-size: 13px;
				padding: 1px 4px 0;
				border-radius: 2px;
				display: inline-block;
				vertical-align: middle;
				margin: 0px 4px 0px 0px;
			}
			.TopstoryItem--advertCard{
				text-decoration:line-through;
			}
		`;
    commonFunctionObject.GMaddStyle(questionsCss);
  };
  this.autoJumpTarget = function() {
    const regexResult = location.search.match(/target=(.+?)(&|$)/);
    if (regexResult && regexResult.length === 3) {
      location.href = decodeURIComponent(regexResult[1]);
    }
  };
  // 为问题本身添加时间
  this.addDateQuestion = function() {
    const title = document.querySelector(".QuestionPage");
    if (title) {
      const dateCreatedEl = title.querySelector("[itemprop~=dateCreated][content]");
      const dateModifiedEl = title.querySelector("[itemprop~=dateModified][content]");
      
      if (!dateCreatedEl || !dateModifiedEl) return;
      
      const dateCreated = dateCreatedEl.content;
      const dateModified = dateModifiedEl.content;
      const createDate = commonFunctionObject.DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
      const editDate = commonFunctionObject.DateFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");

      const side = title.querySelector(".QuestionHeader-side");
      const timeDiv = document.createElement('div');
      timeDiv.innerHTML = `<p>创建于:&nbsp;${createDate}</p><p>编辑于:&nbsp;${editDate}</p>`;
      timeDiv.style.cssText = 'color:#6f6f6f;font-size:13px;';
      side.appendChild(timeDiv);
    }
  };
  // 为回答添加时间
  this.addTimeAnswerItems = function() {
    const list = document.querySelectorAll(".AnswerItem:not(div[zh_date_mk='true'])");
    let isComplete = true;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.getAttribute('zh_date_mk') === 'true') {
        continue;
      }
      item.setAttribute("zh_date_mk", "true");
      try {
        const dateCreatedEl = item.querySelector("[itemprop~=dateCreated][content]");
        const dateModifiedEl = item.querySelector("[itemprop~=dateModified][content]");
        
        if (!dateCreatedEl || !dateModifiedEl) {
          isComplete = false;
          continue;
        }

        const dateCreated = dateCreatedEl.content;
        const dateModified = dateModifiedEl.content;
        const createDate = commonFunctionObject.DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
        const editDate = commonFunctionObject.DateFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");

        const sideItem = item.querySelector(".ContentItem-meta");
        const timeDiv = document.createElement('div');
        timeDiv.innerHTML = `创建于:&nbsp;${createDate}&nbsp;&nbsp;&nbsp;修改于:&nbsp;${editDate}`;
        timeDiv.className = "Voters";
        timeDiv.style.cssText = 'color:#6f6f6f;font-size:13px;display:block;padding:5px 0px;';
        sideItem.appendChild(timeDiv);
      } catch (e) {
        console.error("Error adding date to answer item:", e);
        isComplete = false;
      }
    }
    return isComplete;
  };
  // 提问者标识出来
  this.showQuestionAuthor = function() {
    //此处代码借鉴自 - 知乎增强
    //原作者：X.I.U
    //https://greasyfork.org/zh-CN/scripts/419081-%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA
    if (document.querySelector('.SpecialQuestionAuthor-Wrapper, .SpecialQuestionAuthor')) {
      return;
    }
    const jsData = document.querySelector('#js-initialData');
    if (!jsData) return;
    
    const qJson = JSON.parse(jsData.textContent).initialState.entities.questions[/\d+/.exec(location.pathname)[0]].author;
    const html = `<div class="BrandQuestionSymbol"><a class="BrandQuestionSymbol-brandLink" href="/people/${qJson.urlToken}"><img role="presentation" src="${qJson.avatarUrl}" class="BrandQuestionSymbol-logo" alt=""><span class="BrandQuestionSymbol-name">${qJson.name}</span></a><div class="BrandQuestionSymbol-divider" style="margin-left: 5px;margin-right: 10px;"></div></div>`;
    const questionTopics = document.querySelector('.QuestionHeader-topics');
    if (questionTopics) {
      questionTopics.insertAdjacentHTML('beforebegin', html);
    }
  };
  this.startDealwithQuestion = function() {
    let isMarkComplete = true;
    setInterval(() => {
      if (isMarkComplete) {
        isMarkComplete = false;
        isMarkComplete = this.addTimeAnswerItems();
      }
    }, 2500);
    this.showQuestionAuthor();
    this.addDateQuestion();
  };
  this.downloadVideo = function() {
    let isMarkComplete = true;

    function addDownloadButton() {
      if (!isMarkComplete) return;
      isMarkComplete = false;

      const itemArray = document.querySelectorAll("._1tg8oir:not(span[zh_date_mk='true'])");
      if (itemArray.length === 0) {
        isMarkComplete = true;
        return;
      }

      for (let i = 0; i < itemArray.length; i++) {
        const item = itemArray[i];
        if (item.getAttribute('zh_date_mk') === 'true') {
          continue;
        }

        if (item.innerText.trim() !== "倍速") {
          continue;
        }

        const playButLi = item.parentNode.parentNode;
        if (!playButLi) continue;
        const downloadBut = playButLi.cloneNode(true);
        if (!downloadBut.querySelector('._1tg8oir')) continue;

        const downloadButChildren = Array.from(downloadBut.children);
        for (let j = 0; j < downloadButChildren.length; j++) {
          if (downloadButChildren[j].nodeName !== "BUTTON") {
            downloadBut.removeChild(downloadButChildren[j]);
          }
        }
        
        downloadBut.setAttribute("zh_date_mk", "true");
        downloadBut.querySelector('._1tg8oir').innerText = '下载';
        playButLi.before(downloadBut);

        downloadBut.addEventListener("click", function() {
          const href = window.location.href;
          let findClassName = ".ZVideoItem-video";
          if (href.includes("www.zhihu.com/search")) {
            findClassName = ".List-item";
          } else if (href.includes("www.zhihu.com/zvideo/")) {
            findClassName = ".ZVideo-player";
          } else if (href.includes("https://video.zhihu.com/video")) {
            findClassName = "#player";
          }
          if (!findClassName) return;

          const container = downloadBut.closest(findClassName);
          if (!container) return;
          
          const videoElement = container.querySelector("video");
          if (videoElement && videoElement.src) {
            commonFunctionObject.GMopenInTab(videoElement.src);
          }
        });
      }
      isMarkComplete = true;
    }

    setInterval(addDownloadButton, 1499);
  };
  this.start = function() {
    const host = window.location.host;
    if (host === "link.zhihu.com") {
      this.autoJumpTarget();
    }
    if (host.includes("zhihu.com")) {
      this.markArticleOrQuestion();
      if (window.location.href.includes("www.zhihu.com/question/")) {
        this.startDealwithQuestion();
      }
      this.downloadVideo();
    }
  };
}

try {
  if (!functionController || functionController.zhihuHelper) {
    (new ZhihuHelper()).start();
  }
} catch (e) {
  console.log("知乎助手：error：" + e);
}
	/**
 * 搜索引擎资源提醒
 */
function SearchEnginesNavigation() {

  this.customNavigationkey = "custom-navigation-key-8898";
  this.serverNavigationkey = "server-navigation-key-8898";
  this.searchEnginesData = [{
    "host": "www.baidu.com",
    "element": "#content_right",
    "elementInput": "#kw"
  }, {
    "host": "www.so.com",
    "element": "#side",
    "elementInput": "#keyword"
  }, {
    "host": "www.sogou.com",
    "element": "#right",
    "elementInput": "#upquery"
  }, {
    "host": "cn.bing.com",
    "element": "#b_context",
    "elementInput": "#sb_form_q"
  }, {
    "host": "www.bing.com",
    "element": "#b_context",
    "elementInput": "#sb_form_q"
  }, {
    "host": "www4.bing.com",
    "element": "#b_context",
    "elementInput": "#sb_form_q"
  }, {
    "host": "so.toutiao.com",
    "element": ".s-side-list",
    "elementInput": "input[type='search']"
  }, {
    "host": "www.google.com",
    "element": "#rhs",
    "elementInput": "textarea[name='q']"
  }, {
    "host": "www.google.com.hk",
    "element": "#rhs",
    "elementInput": "textarea[name='q']"
  }, {
    "host": "duckduckgo.com",
    "element": ".react-results--sidebar",
    "elementInput": "#search_form_input"
  }, ];
  this.defaultNavigationData = [{
    "name": "资源搜索",
    "list": [{
      "name": "书签搜索 · 🔥发现",
      "url": "https://www.bookmarkearth.cn/?from=dxy"
    }, {
      "name": "百度百科",
      "url": "https://baike.baidu.com/item/@@"
    }, {
      "name": "知乎搜索",
      "url": "https://www.zhihu.com/search?type=content&q=@@"
    }, {
      "name": "B站搜索",
      "url": "https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851"
    }, {
      "name": "财经雪球",
      "url": "https://xueqiu.com/k?q=@@"
    }, {
      "name": "抖音搜索",
      "url": "https://www.douyin.com/search/@@"
    }, {
      "name": "搜狗|公众号",
      "url": "https://weixin.sogou.com/weixin?type=2&query=@@"
    }, {
      "name": "豆瓣搜索",
      "url": "https://www.douban.com/search?q=@@"
    }, {
      "name": "维基百科",
      "url": "https://en.wikipedia.org/w/index.php?search=@@"
    }, {
      "name": "法律法规",
      "url": "https://www.pkulaw.com/law/chl?Keywords=@@"
    }, {
      "name": "icon搜索",
      "url": "https://www.iconfont.cn/search/index?searchType=icon&q=@@"
    }, {
      "name": "github",
      "url": "https://github.com/search?q=@@"
    }, {
      "name": "csdn",
      "url": "https://so.csdn.net/so/search?q=@@&t=&u="
    }, {
      "name": "stackoverflow",
      "url": "https://stackoverflow.com/"
    }, {
      "name": "AI内容分析🔥",
      "url": "https://www.quzhuanpan.com/redirect/d_n?t=" + (new Date()).getTime()
    }, {
      "name": "在线工具",
      "url": "https://www.tool77.com/category/1?from=vbx"
    }, ]
  }, {
    "name": "搜索引擎",
    "list": [{
      "name": "百度",
      "url": "https://www.baidu.com/s?wd=@@"
    }, {
      "name": "必应",
      "url": "https://cn.bing.com/search?q=@@"
    }, {
      "name": "google",
      "url": "https://www.google.com/search?q=@@"
    }, {
      "name": "360搜索",
      "url": "https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@"
    }, {
      "name": "搜狗",
      "url": "https://www.sogou.com/web?query=@@"
    }, {
      "name": "头条搜索",
      "url": "https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@"
    }, {
      "name": "DuckDuckGo",
      "url": "https://duckduckgo.com/?t=h_&q=@@&ia=web"
    }, ]
  }, ];
  this.getNavigationData = async function(element, elementInput) {
    const self = this;
    let navigationData = self.defaultNavigationData;
    let finalNavigationData = null;
    try {
      const customNavigationData = commonFunctionObject.GMgetValue(self.customNavigationkey, null);
      if (customNavigationData) {
        finalNavigationData = JSON.parse(JSON.stringify(customNavigationData));
      } else {
        const currentMS = (new Date()).getTime();
        const delayMS = 1000 * 60 * 5;
        const serverNavigationData = commonFunctionObject.GMgetValue(self.serverNavigationkey, null);
        if (!serverNavigationData || (currentMS - serverNavigationData.ms) > delayMS) {
          commonFunctionObject.request("get", `https://sct.staticj.top/script/api/nav?t=${currentMS}`, null).then(serverJson => {
            const data = JSON.parse(serverJson.data);
            data.ms = currentMS;
            commonFunctionObject.GMsetValue(self.serverNavigationkey, data);
          }).catch(error => {});
        }
        if (serverNavigationData) {
          finalNavigationData = JSON.parse(serverNavigationData.list);
        } else {
          finalNavigationData = navigationData;
        }
      }
    } catch (e) {
      finalNavigationData = navigationData;
    }
    self.createHtml(element, elementInput, finalNavigationData);
  };
  this.createCss = function(elementNum) {
    const innnerCss = `
			#dsdsd99mmmjj7760011{
				margin-bottom:20px;
			}
			.tab${elementNum}{
				margin-bottom:8px;
			}
			.tab-c-titles${elementNum}{
				margin-bottom:8px;
			}
			.tab-c-links${elementNum}{
				
			}
			
			.tabs-t${elementNum}{
				display: inline-block;
				width: 80px;
				height: 28px;
				line-height: 28px;
				font-size: 15px;
				letter-spacing: 0;
				text-align: center;
				font-weight: 400;
				border-radius: 6px;
				cursor: pointer;
				background: #f8f8f8;
				color: #333;
			}
			.tabs-t-selected-ddsds1idddx90{
			    color: #315EFB!important;;
			    font-weight: 500!important;;
			    background: rgba(49, 94, 251, 0.1)!important;;
			}
			.tabs-t-small-ddsds1idddx90{
			    margin-left: 8px;
			}
			
			.tab-c-links${elementNum} a[name='navigation']{
				display:inline-block;
				text-align:center;
				margin-right:12px;
				margin-top:5px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow:ellipsis;
				box-sizing:border-box;
				line-height:20px;
				font-size:14px!important;
				text-decoration: none;
				color:#1a0dab;
			}
			.tab-c-links${elementNum} a[name='navigation']:hover{
				text-decoration: underline;
			}
			
			.bookmarks${elementNum}{
				min-height:50px;
			}
		`.trim().replace(/\s+/g, " ");
    if (!document.getElementById("plugin_css_style_dddsoo")) {
      const style = document.createElement("style");
      style.id = "plugin_css_style_dddsoo";
      style.textContent = innnerCss;
      document.head.appendChild(style);
    }
  };
  this.showSetingDialog = function() {
    const self = this;
    let customNavigationData = "";
    const customNavigation = commonFunctionObject.GMgetValue(self.customNavigationkey, null);
    if (customNavigation) {
      customNavigationData = JSON.stringify(customNavigation, null, 4);
    }
    const content = `
			<div>
				<div style="font-size:13px;color:red;">
					注意事项如下：
					<br>1、请严格按照格式添加，否则不生效
					<br>2、数据为json格式，请确保json格式正确，必要时请到<a target="_blank" href="https://www.json.cn/">https://www.json.cn/</a>校验
					<br>3、点击下面”示例“按钮，查看具体格式情况
					<br>4、链接中的搜索关键词请用”@@“代替，脚本会自动替换成当前搜索词。例如：https://www.baidu.com/s?wd=@@
					<br>5、大家可以自定义导航数据，<b>但是必须要注意数据格式，发现出现错误，可点“初始化”</b>
				</div>
				<div style="margin-top:5px;height:200px;width:100%;">
					<textarea 
						placeholder="请严格按照格式填写，否则不生效"
						class="navigation-textarea"
						style="color:#000;font-size:14px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;padding:5px;height:100%;width:100%;Overflow:auto;border:1px solid #ccc;resize:none;background-color:#FFF;outline:none;">${customNavigationData}</textarea>
				</div>
				<div style="text-align:center;margin-top:15px;">
					<button class="navigation-init" style="color:#000;cursor:pointer;">初始化</button>
					<button class="navigation-example" style="color:#000;cursor:pointer;">示例</button>
					<button class="navigation-clear" style="color:#000;cursor:pointer;">清空</button>
					<button class="navigation-save" style="color:#000;cursor:pointer;">保存自定义导航</button>
				</div>
			</div>
		`;
    dialog.showMake({
      "title": "自定义添加导航",
      "content": content,
      "onClose": function() {
        location.reload();
      },
      "onContentReady": function($that) {
        const navigationExample = $that.dialogContent.querySelector(".navigation-example");
        const navigationClear = $that.dialogContent.querySelector(".navigation-clear");
        const navigationSave = $that.dialogContent.querySelector(".navigation-save");
        const navigationInit = $that.dialogContent.querySelector(".navigation-init");
        const textarea = $that.dialogContent.querySelector(".navigation-textarea");

        navigationExample.addEventListener("click", () => {
          textarea.value = JSON.stringify(self.defaultNavigationData, null, 4);
        });
        navigationClear.addEventListener("click", () => {
          textarea.value = "";
        });
        navigationInit.addEventListener("click", () => {
          textarea.value = "";
          commonFunctionObject.GMsetValue(self.customNavigationkey, null);
        });
        navigationSave.addEventListener("click", () => {
          const content = textarea.value;
          if (!content) {
            commonFunctionObject.GMsetValue(self.customNavigationkey, null);
            commonFunctionObject.webToast({
              "message": "保存成功：数据为空",
              "background": "#FF4D40"
            });
            return;
          }
          if (content.length === 0 || content.indexOf("{") === -1 || content.indexOf("[") === -1) {
            commonFunctionObject.webToast({
              "message": "格式错误，请更正",
              "background": "#FF4D40"
            });
            return;
          }
          try {
            const contentJson = JSON.parse(content);
            if (Array.isArray(contentJson)) {
              let isOK = true;
              for (let i = 0; i < contentJson.length; i++) {
                if (Array.isArray(contentJson[i])) {
                  isOK = false;
                  break;
                }
                if (!contentJson[i].hasOwnProperty("name") || !contentJson[i].hasOwnProperty("list")) {
                  isOK = false;
                  break;
                }
                if (typeof(contentJson[i]["name"]) !== "string") {
                  isOK = false;
                  break;
                }
                if (!Array.isArray(contentJson[i]["list"])) {
                  isOK = false;
                  break;
                }
                for (let j = 0; j < contentJson[i]["list"].length; j++) {
                  if (!contentJson[i]["list"][j].hasOwnProperty("name") || !contentJson[i]["list"][j].hasOwnProperty("url")) {
                    isOK = false;
                    break;
                  }
                  if (typeof(contentJson[i]["list"][j]["name"]) !== "string" || typeof(contentJson[i]["list"][j]["url"]) !== "string") {
                    isOK = false;
                    break;
                  }
                }
                if (!isOK) {
                  break;
                }
              }
              if (isOK) {
                commonFunctionObject.GMsetValue(self.customNavigationkey, contentJson);
                commonFunctionObject.webToast({
                  "message": "保存成功",
                  "background": "#FF4D40"
                });
              } else {
                commonFunctionObject.webToast({
                  "message": "格式错误，请更正",
                  "background": "#FF4D40"
                });
              }
            } else {
              commonFunctionObject.webToast({
                "message": "格式错误，请更正",
                "background": "#FF4D40"
              });
            }
          } catch (e) {
            commonFunctionObject.webToast({
              "message": "格式错误，请更正",
              "background": "#FF4D40"
            });
          }
        });
      }
    });
  };
  this.createHtml = function(element, elementInput, navigationData) {
    const existingElement = document.getElementById("dsdsd99mmmjj7760011");
    if (existingElement) {
      existingElement.remove();
    }
    let isComplate = true;
    const self = this;
    const elementNum = commonFunctionObject.randomNumber();
    const elementInterval = setInterval(() => {
      if (isComplate) {
        const elementToPrepend = document.querySelector(element);
        const box = document.getElementById("dsdsd99mmmjj7760011");
        isComplate = false;
        if (elementToPrepend && !box) {
          const nameArray = [];
          const linkArray = [];
          for (let i = 0; i < navigationData.length; i++) {
            let name = "";
            if (i === 0) {
              name += `<span class="tabs-t${elementNum} tabs-t-selected-ddsds1idddx90" name="tab-list-xxsddddssd-${i}">${navigationData[i].name}</span>`;
            } else {
              name += `<span class="tabs-t${elementNum} tabs-t-small-ddsds1idddx90" name="tab-list-xxsddddssd-${i}">${navigationData[i].name}</span>`;
            }
            nameArray.push(name);
            let links = "";
            if (i === 0) {
              links = `<div id="tab-list-xxsddddssd-${i}">`;
            } else {
              links = `<div id="tab-list-xxsddddssd-${i}" style="display:none;">`;
            }
            for (let j = 0; j < navigationData[i].list.length; j++) {
              let url = navigationData[i].list[j].url;
              url = url.replace("${t}", (new Date()).getTime());
              const linkName = navigationData[i].list[j].name;
              links += `<a target='_blank' name='navigation' data-url='${url}' href='javascript:void(0);'>${linkName}</a>`;
            }
            links += "</div>";
            linkArray.push(links);
          }
          const html = `
						<div id="dsdsd99mmmjj7760011" style="position:relative!important;left:0px!important;">
							<div class="tab${elementNum}">
								<div class="tab-c-titles${elementNum}">${nameArray.join("")}</div>
								<div class="tab-c-links${elementNum}">${linkArray.join("")}</div>
							</div>
							<div style='margin-bottom:10px;margin-top:5px;font-size:12px;'>
								<a target='_blank' href='https://greasyfork.org/zh-CN/scripts/546489' style="color: #000;background-color: #efefef;padding: 2px 5px; border-radius: 2px;">*该数据由油猴脚本提供</a>
								&nbsp;&nbsp;
								<a href="javascript:void(0);" name="customNavigation" style="color: #000;background-color: #efefef;padding: 2px 5px; border-radius: 2px;">🔧自定义网址</a>
							</div>
						<div>
					`;
          self.createCss(elementNum);
          elementToPrepend.insertAdjacentHTML('afterbegin', html);
          document.querySelectorAll(`#dsdsd99mmmjj7760011 .tabs-t${elementNum}`).forEach(tab => {
            tab.addEventListener("click", function() {
              document.querySelectorAll("div[id^='tab-list-xxsddddssd-']").forEach(div => div.style.display = 'none');
              document.querySelectorAll(`.tabs-t${elementNum}`).forEach(span => span.classList.remove("tabs-t-selected-ddsds1idddx90"));
              document.getElementById(this.getAttribute("name")).style.display = 'block';
              this.classList.add("tabs-t-selected-ddsds1idddx90");
            });
          });
          document.querySelectorAll("#dsdsd99mmmjj7760011 a[name='navigation']").forEach(link => {
            link.addEventListener("click", function(e) {
              const url = this.dataset.url;
              const inputValue = document.querySelector(elementInput).value;
              commonFunctionObject.GMopenInTab(url.replace("@@", inputValue));
              e.preventDefault();
            });
          });
          document.querySelector("#dsdsd99mmmjj7760011 a[name='customNavigation']").addEventListener("click", function(e) {
            self.showSetingDialog();
            e.preventDefault();
          });
        }
        isComplate = true;
      }
    }, 100);
  };
  this.hookBaidu = function() {
    const items = document.querySelectorAll("#content_left>div");
    for (let item of items) {
      if (item.getAttribute("baidu_dealxx")) {
        continue;
      }
      item.setAttribute("baidu_dealxx", "--");
      const a = item.querySelector("a");
      if (!a || !a.href) {
        continue;
      }
      const OP_LOG_LINK = item.querySelector(".OP_LOG_LINK");
      if (OP_LOG_LINK && OP_LOG_LINK.innerText.search("http") !== -1) {
        continue;
      }
      const cGapBottomSmall = item.querySelector(".c-gap-bottom-small");
      if (cGapBottomSmall) {
        continue;
      }
      if (a.href.includes("www.baidu.com/link?url=")) {
        const url = item.getAttribute("mu");
        if (url && url.indexOf("http") !== -1 && !url.includes("nourl.ubs.baidu.com")) {
          a.href = url;
          item.insertAdjacentHTML('beforeend', `<div style="color:#ccc;font-size:12px;display:flex;align-items:center;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;">
										<img style="width:15px;height:15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKhJREFUOE+9k9ENwjAMBc8RA7AR7UhMQDsBszBBw0YMAAmKrBS3pM1HpOb/ne9ZjtD4pDHPEYBTB2FSU9fD21vrisEcHsF5BS0hFYCLwAhh0KkZGOZcBSATyAM4K8QNEC8Q+1yjAEhTPjeQ50+bq0KW4QRZAWxnXsBdO4euFC4AbOe1fvlijEGebrecOqeXl/gP2aiwr125g2wSvd321skfccr7363Z4Asklz4RHmdA1gAAAABJRU5ErkJggg=="/>
										<a style="color:#626675;" href="${url}" target="_blank">${url}</a>
									</div>`);
        }
      }
      const itemNews = item.querySelectorAll("[class^=single-card-wrapper] div, [class^=group-wrapper] div");
      if (!itemNews) {
        continue;
      }
      for (let itemNew of itemNews) {
        let dataUrl = null;
        const divs = itemNew.querySelectorAll("div");
        for (let div of divs) {
          dataUrl = div.getAttribute("data-url");
          if (dataUrl) {
            const innerA = itemNew.querySelector("a");
            if (innerA) {
              innerA.setAttribute("href", dataUrl);
            }
          }
        }
      }
    }
  };
  this.hookGoogle = function() {
    const items = document.querySelectorAll("#center_col a");
    for (let a of items) {
      if (!a.getAttribute("target")) {
        a.setAttribute("target", "_blank");
      }
    }
  };
  this.hooks = function() {
    const host = window.location.host;
    const self = this;
    setInterval(() => {
      if (host === "www.baidu.com") {
        self.hookBaidu();
      } else if (host === "www.google.com" || host === "www.google.com.hk") {
        self.hookGoogle();
      }
    }, 300);
  };
  this.show = function() {
    const self = this;
    const host = window.location.host;
    const href = window.location.href;
    const matches = self.searchEnginesData.some(engine => host === engine.host && href.includes(engine.host));
    if (matches) {
      let currentSearchEnginesData = null;
      for (let i = 0; i < self.searchEnginesData.length; i++) {
        if (host === self.searchEnginesData[i].host) {
          currentSearchEnginesData = self.searchEnginesData[i];
          break;
        }
      }
      if (currentSearchEnginesData) {
        self.getNavigationData(currentSearchEnginesData.element, currentSearchEnginesData.elementInput);
      }
      self.hooks();
    }
  };
  this.start = function() {
    this.show();
  };
}
try {
  if (!functionController || functionController.searchEnginesNavigation) {
    (new SearchEnginesNavigation()).start();
  }
} catch (e) {
  console.log("搜索引擎导航：error：" + e);
}
	
	
	
	
	
	
	
})();