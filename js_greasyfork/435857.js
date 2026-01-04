// ==UserScript==
// @name                m755
// @name:zh-CN          GitHub汉化
// @namespace           https://m755.com/
// @version             0.12
// @description         meta755
// @author              m755
// @match               https://github.com/*
// @match               https://gist.github.com/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getResourceText
// @resource            zh-CN https://haidony.gitee.io/m755-githubcn/cn.json
// @require             https://cdn.staticfile.org/timeago.js/4.0.2/timeago.min.js
// @require             https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435857/m755.user.js
// @updateURL https://update.greasyfork.org/scripts/435857/m755.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SUPPORT_LANG = ["zh-CN"];
  const lang = (navigator.language || navigator.userLanguage);
  const locales = getLocales(lang)

  translateByCssSelector();
  traverseElement(document.body);
  watchUpdate();

  // 翻译描述
  if(window.location.pathname.split('/').length == 3) {
    translateDesc(".repository-content .f4"); //仓库简介翻译
    translateDesc(".gist-content [itemprop='about']"); // Gist 简介翻译
  }


  function getLocales(lang) {
    if(lang.startsWith("zh")) { // zh zh-TW --> zh-CN
      lang = "zh-CN";
    }
    if(SUPPORT_LANG.includes(lang)) {
      return JSON.parse(GM_getResourceText(lang));
    }
    return {
      css: [],
      dict: {}
    };
  }

  function translateRelativeTimeEl(el) {
    const datetime = $(el).attr('datetime');
    //$(el).text(timeago.format(datetime, lang.replace('-', '_')));
  }

  function translateElement(el) {
    // Get the text field name
    let k;
    if(el.tagName === "INPUT") {
      if (el.type === 'button' || el.type === 'submit') {
        k = 'value';
      } else {
        k = 'placeholder';
      }
    } else {
      k = 'data';
    }

    if (isNaN(el[k])){
      const txtSrc = el[k].trim();
      const key = txtSrc.toLowerCase()
        .replace(/\xa0/g, ' ') // replace '&nbsp;'
        .replace(/\s{2,}/g, ' ');
      if (locales.dict[key]) {
        el[k] = el[k].replace(txtSrc, locales.dict[key])
      }
    }
    translateElementAriaLabel(el)
  }

  function translateElementAriaLabel(el) {
    if (el.ariaLabel) {
      const k = 'ariaLabel'
      const txtSrc = el[k].trim();
      const key = txtSrc.toLowerCase()
        .replace(/\xa0/g, ' ') // replace '&nbsp;'
        .replace(/\s{2,}/g, ' ');
      if (locales.dict[key]) {
        el[k] = el[k].replace(txtSrc, locales.dict[key])
      }
    }
  }

  function shouldTranslateEl(el) {
    const blockIds = ["readme"];
    const blockClass = [
      "CodeMirror",
      "js-navigation-container", // 过滤文件目录
      "blob-code",
      "topic-tag", // 过滤标签,
      // "text-normal", // 过滤repo name, 复现：https://github.com/search?q=explore
      "repo-list",//过滤搜索结果项目,解决"text-normal"导致的有些文字不翻译的问题,搜索结果以后可以考虑单独翻译
      "js-path-segment","final-path", //过滤目录,文件位置栏
      "markdown-body" // 过滤wiki页面
    ];
    const blockTags = ["CODE", "SCRIPT", "LINK", "IMG", "svg", "TABLE", "ARTICLE", "PRE"];
    const blockItemprops = ["name"];

    if (blockTags.includes(el.tagName)) {
      return false;
    }

    if (el.id && blockIds.includes(el.id)) {
      return false;
    }

    if (el.classList) {
      for (let clazz of blockClass) {
        if (el.classList.contains(clazz)) {
          return false;
        }
      }
    }

    if (el.getAttribute) {
      let itemprops = el.getAttribute("itemprop");
      if (itemprops) {
        itemprops = itemprops.split(" ");
        for (let itemprop of itemprops) {
          if (blockItemprops.includes(itemprop)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  function traverseElement(el) {
    translateElementAriaLabel(el)
    if (!shouldTranslateEl(el)) {
      return
    }

    if (el.childNodes.length === 0) {
      if (el.nodeType === Node.TEXT_NODE) {
        translateElement(el);
        return;
      }
      else if(el.nodeType === Node.ELEMENT_NODE) {
        if (el.tagName === "INPUT") {
          translateElement(el);
          return;
        }
      }
    }

    for (const child of el.childNodes) {
      if (["RELATIVE-TIME", "TIME-AGO"].includes(el.tagName)) {
        translateRelativeTimeEl(el);
        return;
      }

      if (child.nodeType === Node.TEXT_NODE) {
        translateElement(child);
      }
      else if(child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "INPUT") {
          translateElement(child);
        } else {
          traverseElement(child);
        }
      } else {
        // pass
      }
    }
  }

  function watchUpdate() {
    const m = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new m(function (mutations, observer) {
      var reTrans = false;
      for(let mutationRecord of mutations) {
        if (mutationRecord.addedNodes || mutationRecord.type === 'attributes') {
          reTrans = true;
          // traverseElement(mutationRecord.target);
        }
      }
      if(reTrans) {
          traverseElement(document.body);
      }
    });

    observer.observe(document.body, {
      subtree: true,
      characterData: true,
      childList: true,
      attributeFilter: ['value', 'placeholder', 'aria-label', 'data', 'data-confirm'], // 仅观察特定属性变化(试验测试阶段，有问题再恢复)
    });
  }

  // translate "about"
  function translateDesc(el) {
    $(el).append("<br/>");
    $(el).append("<a id='translate-me' href='#' style='color:rgb(27, 149, 224);font-size: small'>翻译</a>");
    $("#translate-me").click(function() {
      // get description text
      const desc = $(el)
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();

      if(!desc) {
        return;
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.githubs.cn/translate?q=`+ encodeURIComponent(desc),
        onload: function(res) {
          if (res.status === 200) {
            $("#translate-me").hide();
            // render result
            const text = res.responseText;
            $(el).append("<span style='font-size: small'>由 <a target='_blank' style='color:rgb(27, 149, 224);' href='https://www.githubs.cn'>GitHub中文社区</a> 翻译👇</span>");
            $(el).append("<br/>");
            $(el).append(text);
          } else {
            alert("翻译失败");
          }
        }
      });
    });
  }

  function translateByCssSelector() {
    if(locales.css) {
      for(var css of locales.css) {
        if($(css.selector).length > 0) {
          if(css.key === '!html') {
            $(css.selector).html(css.replacement);
          } else {
            $(css.selector).attr(css.key, css.replacement);
          }
        }
      }
    }
  }
})();
