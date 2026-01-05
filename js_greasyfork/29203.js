// ==UserScript==
// @name        Markdown-A-Textarea
// @namespace   wdssmq
// @version     1.0.3
// @author      沉冰浮水
// @description 在需要的地方启用 MarkDown 语法，添加格式帮助链接及 Markdown 工具栏
// @link        https://greasyfork.org/zh-CN/scripts/29203
// @null     ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null     ----------------------------
// @link     https://github.com/wdssmq/userscript
// @link     https://afdian.net/@wdssmq
// @link     https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null     ----------------------------
// @contributor JixunMoe
// @contributor wOxxOm
// @license     MIT License
// @include     https://*
// @include     http://*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29203/Markdown-A-Textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/29203/Markdown-A-Textarea.meta.js
// ==/UserScript==

/* eslint no-useless-escape: 0 */
/* global GM_addStyle */
/* jshint multistr:true */
function $n(e) {
  return document.querySelector(e);
}
function $na(e) {
  return document.querySelectorAll(e);
}

function xml2md(xml) {
  var md = xml;
  if (xml.indexOf("isXML") > -1) {
    // 移除isXML
    md = md.replace(/\n?<!--isXML-->/g, "");
    // 行内

    // 链接
    md = md.replace(/<a href="([^"]+)" title="([^"]+)"\s*([^>]*)>(.+)<\/a>/g,"[$4]($1 \"$2\"){$3}");
    // 图片
    md = md.replace(/<img src="([^"]+)" alt="([^"]+)"[^>]*>/g,"![$2]($1)");
    // 段落
    md = md.replace(/<p>/g, "");
    md = md.replace(/<\/p>/g, "\n\n");
    // h1-h6
    md = md.replace(/<h6>(.+?)<\/h6>/g, "###### $1\n\n");
    md = md.replace(/<h5>(.+?)<\/h5>/g, "##### $1\n\n");
    md = md.replace(/<h4>(.+?)<\/h4>/g, "#### $1\n\n");
    md = md.replace(/<h3>(.+?)<\/h3>/g, "### $1\n\n");
    md = md.replace(/<h2>(.+?)<\/h2>/g, "## $1\n\n");
    md = md.replace(/<h1>(.+?)<\/h1>/g, "# $1\n\n");
    // 格式化换行
    md = md.replace(/\n\n+/g, "\n\n");
    md = md.replace(/\n+$/g, "");
    // 修正
    md = md.replace(/\){}/g, ")");
  }
  return md;
}

function md2xml(md) {
  var xml = md;
  if (md.indexOf("isXML") == -1) {
    // 格式化换行
    xml = xml.replace(/\n\n+/g, "\n\n");
    xml = xml.replace(/\n+$/g, "");
    // h1-h6
    xml = xml.replace(/(^|\n)######\s*([^\n]+)/g, "$1<h6>$2</h6>");
    xml = xml.replace(/(^|\n)#####\s*([^\n]+)/g, "$1<h5>$2</h5>");
    xml = xml.replace(/(^|\n)####\s*([^\n]+)/g, "$1<h4>$2</h4>");
    xml = xml.replace(/(^|\n)###\s*([^\n]+)/g, "$1<h3>$2</h3>");
    xml = xml.replace(/(^|\n)##\s*([^\n]+)/g, "$1<h2>$2</h2>");
    xml = xml.replace(/(^|\n)#\s*([^\n]+)/g, "$1<h1>$2</h1>");
    // 段落
    xml = xml.replace(/^(?!(<h|<p|<div))/g, "<p>");
    xml = xml.replace(/\n+(<h|<p|<div)/g, "</p>\n$1");
    xml = xml.replace(/\n\n/g, "</p>\n<p>");
    xml = xml.replace(/(p>|h\d>|div>)<\/p>/g, "$1");
    xml = xml.replace(/<p>$/g, "");
    xml = xml.replace(/<p>(?!<\/p>)(.+)$/g, "<p>$1</p>");
    // 行内标记
    xml = xml.replace(/([^\*]*)\*\*(.*)\*\*/g, "$1<b>$2</b>");
    xml = xml.replace(/([^\*]*)\*(.*)\*/g, "$1<i>$2</i>");
    // 图片
    xml = xml.replace(/!\[([^\]]+)\]\(([^\s\)]+)[^\)]*\)/g, "<img src=\"$2\" alt=\"$1\" title=\"$1\">");
    console.log(xml);
    // 链接
    xml = xml.replace(/\[(.+)\]\(([^\s\)]+)\s*"?([^"]+)*"?\)(?:{([^}]+)})?/g, "<a href=\"$2\" title=\"$3\" $4>$1</a>");
    xml = xml.replace(/title=""/g,"title=\"点击链接查看\"");
    // xml = xml.replace(/\[(.+)\]\(([^\s\)]+)\)/g, '<a href="$2">$1</a>');

    // 修正
    xml = xml.replace(/\s>/g,">");
    xml = xml.replace(/2xml/g,"");
    // 添加 isXML
    xml += "\n<!--isXML-->";
  }
  return xml;
}

window.addEventListener("load", function (e) {
  var domTxa = $n("textarea.md-needed");

  if (!domTxa){
    return;
  }
  console.log(1);
  domTxa.addEventListener("keyup", function () {
    if(domTxa.value.indexOf("2xml") > -1){
      domTxa.value = md2xml(domTxa.value);
    }
  });
  $n("input[type=submit]").addEventListener("mouseenter", function () {
    domTxa.value = md2xml(domTxa.value);
  });
  $n("input[type=submit]").addEventListener("mouseout", function () {
    domTxa.value = xml2md(domTxa.value);
  });
  $n(".md-toolbar").innerHTML = "<i style=\"clear:both;display: table;\"></i>";

  // 添加工具栏
  addFeatures(domTxa);

  GM_addStyle("\
.md-button {\
display: inline-block;\
cursor: pointer;\
margin: 0 1px;\
font-size: 12px;\
line-height: 1;\
font-weight: bold;\
padding: 4px 6px;\
background: #eee;\
border: 1px solid #999;\
border-radius: 2px;\
white-space: nowrap;\
text-shadow: 0px 1px 0px #FFF;\
box-shadow: 0px 1px 0px #FFF inset, 0px -1px 2px #BBB inset;\
color: #333;}\
.md-toolbar {\
clear: both;\
padding: 0;\
margin: 1px 1px 3px;\
}");
});

function addFeatures(n) {
  if (!n){
    return;
  }
  // add buttons
  // btnMake(n, '<b>Test</b>', "test", function (e) {
  // n.value = md2xml(n.value)
  // });
  btnMake(n, "<b>" + __("B") + "</b>", __("Bold"), "**");
  btnMake(n, "<i>" + __("I") + "</i>", __("Italic"), "*");
  btnMake(n, "<u>" + __("U") + "</u>", __("Underline"), "<u>", "</u>");
  btnMake(n, "<s>" + __("S") + "</s>", __("Strikethrough"), "<s>", "</s>");
  btnMake(n, "&lt;br&gt;", __("Force line break"), "<br>", "", true);
  btnMake(n, "---", __("Horizontal line"), "\n\n---\n\n", "", true);
  btnMake(n, __("URL"), __("Add URL to selected text"),
          function (e) {
    try {
      edWrapInTag("[", "](" + prompt(__("URL") + ":") + ")", edInit(e.target));
    } catch (ex) {
      console.log(ex);
    }
  });
  btnMake(n, __("Image (https)"), __("Convert selected https://url to inline image"), "![" + __("image") + "](", ")");
  btnMake(n, __("Table"), __("Insert table template"), __("\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n"), "", true);
  btnMake(n, __("Code"), __("Apply CODE markdown to selected text"),
          function (e) {
    var ed = edInit(e.target);
    if (ed.sel.indexOf("\n") < 0){
      edWrapInTag("`", "`", ed);
    }
    else{
      edWrapInTag(((ed.sel1 === 0) || (ed.text.charAt(ed.sel1 - 1) == "\n") ? "" : "\n") + "```" + (ed.sel.charAt(0) == "\n" ? "" : "\n"),
                  (ed.sel.substr(-1) == "\n" ? "" : "\n") + "```" + (ed.text.substr(ed.sel2, 1) == "\n" ? "" : "\n"),
                  ed);}
  });
}

function btnMake(elTxa, label, title, tag1_or_cb, tag2, noWrap) {
  var a = document.createElement("a");
  a.className = "md-button";
  a.innerHTML = label;
  a.title = title;
  a.style.setProperty("float", "right");
  a.addEventListener("click",
                     typeof(tag1_or_cb) == "function" ? tag1_or_cb
                     : noWrap ? function (e) {
    edInsertText(tag1_or_cb, edInit(e.target));
  }
                     : function (e) {
    edWrapInTag(tag1_or_cb, tag2, edInit(e.target));
  });
  var elToolbar = elTxa.parentNode.querySelector(".md-toolbar");
  // console.log(elToolbar);
  a.textAreaNode = elTxa;
  elToolbar.insertBefore(a, elToolbar.firstElementChild);
}

function edInit(btn) {
  var ed = {
    node: btn.textAreaNode,
  };
  ed.sel1 = ed.node.selectionStart;
  ed.sel2 = ed.node.selectionEnd;
    ed.text = ed.node.value;
  ed.sel = ed.text.substring(ed.sel1, ed.sel2);
  return ed;
}

function edWrapInTag(tag1, tag2, ed) {
  ed.node.value = ed.text.substr(0, ed.sel1) + tag1 + ed.sel + (tag2 ? tag2 : tag1) + ed.text.substr(ed.sel2);
  ed.node.setSelectionRange(ed.sel1 + tag1.length, ed.sel1 + tag1.length + ed.sel.length);
  ed.node.focus();
}

function edInsertText(text, ed) {
  ed.node.value = ed.text.substr(0, ed.sel2) + text + ed.text.substr(ed.sel2);
  ed.node.setSelectionRange(ed.sel2 + text.length, ed.sel2 + text.length);
  ed.node.focus();
}

var __ = (function (l, langs) {
  var lang = langs[l] || langs[l.replace(/-.+/, "")];
  return lang ? function (text) {
    return lang[text] || text;
  }
  : function (text) {
    return text;
  }; // No matching language, fallback to english
})("zh-CN", {
  // Can be full name, or just the beginning part.
  "zh-CN": {
    "Bold": "粗体",
    "Italic": "斜体",
    "Underline": "下划线",
    "Strikethrough": "删除线",
    "Force line break": "强制换行",
    "Horizontal line": "水平分割线",
    "URL": "链接",
    "Add URL to selected text": "为所选文字添加链接",
    "Image (https)": "图片 (https)",
    "Convert selected https://url to inline image": "将所选地址转换为行内图片",
    "image": "图片描述", // Default image alt value
    "Table": "表格",
    "Insert table template": "插入表格模板",
    "Code": "代码",
    "Apply CODE markdown to selected text": "将选中代码围起来",

    "\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n":
    "\n| 表头 1 | 表头 2 |\n|-------|-------|\n| 表格 1 | 表格 2 |\n| 表格 3 | 表格 4 |\n",
  },
  "ru": {
    "B": "Ж",
    "I": "К",
    "U": "Ч",
    "S": "П",
    "Bold": "Жирный",
    "Italic": "Курсив",
    "Underline": "Подчеркнутый",
    "Strikethrough": "Перечеркнутый",
    "Force line break": "Новая строка",
    "Horizontal line": "Горизонтальная линия",
    "URL": "ссылка",
    "Add URL to selected text": "Добавить ссылку к выделенному тексту",
    "Image (https)": "Картинка (https)",
    "Convert selected https://url to inline image": "Преобразовать выделенный https:// адрес в картинку",
    "image": "картинка", // Default image alt value
    "Table": "Таблица",
    "Insert table template": "Вставить шаблон таблицы",
    "Code": "Код",
    "Apply CODE markdown to selected text": "Пометить выделенный фрагмент как программный код",

    "\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n":
    "\n| заголовок1 | заголовок2 |\n|-------|-------|\n| ячейка1 | ячейка2 |\n| ячейка3 | ячейка4 |\n",
  },
  "fr": {
    "B": "G",
    "I": "I",
    "U": "S",
    "S": "B",
    "Bold": "Gras",
    "Italic": "Italique",
    "Underline": "Souligné",
    "Strikethrough": "Barré",
    "Force line break": "Forcer le saut de ligne",
    "Horizontal line": "Ligne horizontale",
    "URL": "URL",
    "Add URL to selected text": "Ajouter URL au texte sélectionné",
    "Image (https)": "Image (https)",
    "Convert selected https://url to inline image": "Convertir https://url sélectionnés en images",
    "image": "image", // Default image alt value
    "Table": "Tableau",
    "Insert table template": "Insérer un modèle de table",
    "Code": "Code",
    "Apply CODE markdown to selected text": "Appliquer CODE markdown au texte sélectionné",

    "\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n":
    "\n| En-tête 1 | En-tête 2 |\n|-------|-------|\n| cellule 1 | cellule 2 |\n| cellule 3 | cellule 4 |\n",
  },
});
