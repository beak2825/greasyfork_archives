// ==UserScript==
// @name        AcWing content to markdown
// @namespace   acwing
// @match       https://www.acwing.com/*
// @grant       GM_setClipboard
// @version     1.4
// @author      -
// @description 将AcWing上的内容转换为markdown
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/turndown/7.1.1/turndown.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441750/AcWing%20content%20to%20markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/441750/AcWing%20content%20to%20markdown.meta.js
// ==/UserScript==

let debug = false; // whether to enable on editor

let turndownService = new TurndownService();

turndownService.keep(['del']);

// code block
turndownService.addRule('pre', {
  filter: 'pre',
  replacement: function (content, node) {
    let t = $(node).attr("class").split(/\s+/).slice(-1);
    if (t == "hljs") t = "";
    return "```" + t + "\n" + content.trim() + "\n```";
  }
});

// remove <script> math
turndownService.addRule('remove-script', {
  filter: function (node, options) {
    return node.tagName.toLowerCase() == "script" && node.type.startsWith("math/tex");
  },
  replacement: function (content, node) {
    return "";
  }
});

// inline math
turndownService.addRule('inline-math', {
  filter: function (node, options) {
    return node.tagName.toLowerCase() == "span" && node.className == "MathJax";
  },
  replacement: function (content, node) {
    return "$ " + $(node).next().text() + " $";
  }
});

// block math
turndownService.addRule('block-math', {
  filter: function (node, options) {
    return node.tagName.toLowerCase() == "div" && node.className == "MathJax_Display";
  },
  replacement: function (content, node) {
    return "\n$$\n" + $(node).next().text() + "\n$$\n";
  }
});

// add buttons
$("div[data-tab='preview-tab-content']").each(function() {
  if (debug || $(this).prev().attr('data-tab') != "editor-tab-content")
    $(this).before(
      "<div> <button class='html2md-view'>显示markdown</button> <button class='html2md-cb'>复制markdown到剪贴板</button> </div>"
    );
});

$(".html2md-cb").click(function() {
  let target = $(this).parent().next().get(0);
  if (!target.markdown)
    target.markdown = turndownService.turndown($(target).html());
  GM_setClipboard(target.markdown);
  // console.log(markdown);
  $(this).text("已复制到剪贴板");
});

$(".html2md-view").click(function() {
  let target = $(this).parent().next().get(0);
  if (target.viewmd) {
    target.viewmd = false;
    $(this).text("显示markdown");
    $(target).html(target.original_html);
  } else {
    target.viewmd = true;
    if (!target.original_html)
      target.original_html = $(target).html();
    if (!target.markdown)
      target.markdown = turndownService.turndown($(target).html());
    $(this).text("显示原始内容");
    $(target).html(`<textarea oninput="$(this).parent().get(0).markdown=this.value;" style="width:100%; height:400px;"> ${target.markdown} </textarea>`);
  }
});
