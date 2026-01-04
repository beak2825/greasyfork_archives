// ==UserScript==
// @name						RequirementEasyJump
// @description					Turn plain requirement text URLs into clickable links
// @description:zh				把需求文字链接转换为可点击链接
// @author						chiyuan666
// @namespace					chiyuan666
// @version						1.0
// @license						AGPL
// @include						*gates.nsn-net.net/*
// @exclude						*pan.baidu.com/*
// @exclude						*renren.com/*
// @exclude						*exhentai.org/*
// @exclude						*music.google.com/*
// @exclude						*play.google.com/music/*
// @exclude						*mail.google.com/*
// @exclude						*docs.google.com/*
// @exclude						*www.google.*
// @exclude						*acid3.acidtests.org/*
// @exclude						*.163.com/*
// @exclude						*.alipay.com/*
// @run-at						document-end
// @grant						unsafeWindow
// @charset						UTF-8
// @downloadURL https://update.greasyfork.org/scripts/454768/RequirementEasyJump.user.js
// @updateURL https://update.greasyfork.org/scripts/454768/RequirementEasyJump.meta.js
// ==/UserScript==

"use strict";
;
var clearLink, excludedTags, linkFilter, linkMixInit, linkPack, linkify, observePage, observer, setLink, urlPrefixes, xPath;
var url_regexp_CP_Entity_Architecture_and_Algorithms;
var url_regexp_CP_External_Interface_Network;
var url_regexp_CP_External_Interface_RRC;
var url_regexp_CP_System_Level_Dual_Connectivity;
var url_regexp_CP_System_Level_Mobility_Management;
var url_regexp_5G_CP_System_Level_Node_Configuration;
var url_regexp_CP_System_Level_Others;
var url_regexp_Entity_Level;
var url_regexp_L3_Entity_Level_Flows;
var url_regexp_L3_Interfaces;


//url_regexp = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/=]|\w([\w._-])+@\w[\w\._-]+\.(com|cn|org|net|info|tv|cc|gov|edu)|(\w[\w._-]+\.(com|cn|org|net|info|tv|cc|gov|edu))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=)/gi;
url_regexp_CP_Entity_Architecture_and_Algorithms = /(5G_CP_ARC_ALG_\d+)/gi
url_regexp_CP_External_Interface_Network = /(5G_CP_IF_NTW_\d+)/gi
url_regexp_CP_External_Interface_RRC = /(5G_CP_IF_RRC_\d+)/gi
url_regexp_CP_System_Level_Dual_Connectivity = /(5G_CP_DC_\d+)/gi
url_regexp_CP_System_Level_Mobility_Management = /(5G_CP_MM_\d+)/gi
url_regexp_5G_CP_System_Level_Node_Configuration = /(5G_CP_CONF_\d+)/gi
url_regexp_CP_System_Level_Others = /(5G_CP_OTH_\d+)/gi
url_regexp_Entity_Level = /(5G_L3_\d+)/gi
url_regexp_L3_Entity_Level_Flows = /(5G_L3_FLOW_\d+)/gi
url_regexp_L3_Interfaces = /(5G_L3_IF_\d+)/gi



urlPrefixes = ['http://', 'https://', 'ftp://', 'thunder://', 'ed2k://', 'mailto://', 'file://'];

clearLink = function (event) {
  var j, len, link, prefix, ref, ref1, url;
  link = (ref = event.originalTarget) != null ? ref : event.target;
  if (!(link != null && link.localName === "a" && ((ref1 = link.className) != null ? ref1.indexOf("textToLink") : void 0) !== -1)) {
    return;
  }
  url = link.getAttribute("href");
  //console.log url
  for (j = 0, len = urlPrefixes.length; j < len; j++) {
    prefix = urlPrefixes[j];
    if (url.indexOf(prefix) === 0) {
      return;
    }
  }
  if (url.indexOf('@') !== -1) {
    return link.setAttribute("href", "mailto://" + url);
  } else {
    return link.setAttribute("href", "http://" + url);
  }
};

document.addEventListener("mouseover", clearLink);

setLink = function (candidate) {
  var ref, ref1, ref2, span, text;
  if (candidate == null || ((ref = candidate.parentNode) != null ? (ref1 = ref.className) != null ? typeof ref1.indexOf === "function" ? ref1.indexOf("textToLink") : void 0 : void 0 : void 0) !== -1 || candidate.nodeName === "#cdata-section") {
    return;
  }
  if(candidate.textContent.match(url_regexp_CP_Entity_Architecture_and_Algorithms))
  {
      text = candidate.textContent.replace(url_regexp_CP_Entity_Architecture_and_Algorithms, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_CP_External_Interface_Network))
  {
      text = candidate.textContent.replace(url_regexp_CP_External_Interface_Network, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_CP_External_Interface_RRC))
  {
      text = candidate.textContent.replace(url_regexp_CP_External_Interface_RRC, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_CP_System_Level_Dual_Connectivity))
  {
      text = candidate.textContent.replace(url_regexp_CP_System_Level_Dual_Connectivity, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_CP_System_Level_Mobility_Management))
  {
      text = candidate.textContent.replace(url_regexp_CP_System_Level_Mobility_Management, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
   else if(candidate.textContent.match(url_regexp_5G_CP_System_Level_Node_Configuration))
  {
      text = candidate.textContent.replace(url_regexp_5G_CP_System_Level_Node_Configuration, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_CP_System_Level_Others))
  {
      text = candidate.textContent.replace(url_regexp_CP_System_Level_Others, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_Entity_Level))
  {
      text = candidate.textContent.replace(url_regexp_Entity_Level, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else if(candidate.textContent.match(url_regexp_L3_Entity_Level_Flows))
  {
      text = candidate.textContent.replace(url_regexp_L3_Entity_Level_Flows, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }
  else
  {
      text = candidate.textContent.replace(url_regexp_L3_Interfaces, '<a href="https://gates.nsn-net.net/requirement/$1", target="_blank" class="textToLink">$1</a>');
  }

  if (((ref2 = candidate.textContent) != null ? ref2.length : void 0) === text.length) {
    return;
  }
  console.log("hello")
  console.log(candidate.textContent)

  span = document.createElement("span");
  span.innerHTML = text;
  return candidate.parentNode.replaceChild(span, candidate);
};

excludedTags = "a,svg,canvas,applet,input,button,area,pre,embed,frame,frameset,head,iframe,img,option,map,meta,noscript,object,script,style,textarea,code".split(",");

xPath = `//text()[not(ancestor::${excludedTags.join(') and not(ancestor::')})]`;

linkPack = function (result, start) {
  var i, j, k, ref, ref1, ref2, ref3, startTime;
  startTime = Date.now();
  while (start + 10000 < result.snapshotLength) {
    for (i = j = ref = start, ref1 = start + 10000; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      setLink(result.snapshotItem(i));
    }
    start += 10000;
    if (Date.now() - startTime > 2500) {
      return;
    }
  }
  console.log("linkPack")
  console.log("snapshotLength:",result.snapshotLength)
  console.log("start:",start)
  for (i = k = ref2 = start, ref3 = result.snapshotLength; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
      console.log("i:",i)
    setLink(result.snapshotItem(i));
  }
};

linkify = function (node) {
  var result;
  result = document.evaluate(xPath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  return linkPack(result, 0);
};

linkFilter = function (node) {
  var j, len, tag;
  for (j = 0, len = excludedTags.length; j < len; j++) {
    tag = excludedTags[j];
    if (tag === node.parentNode.localName.toLowerCase()) {
      return NodeFilter.FILTER_REJECT;
    }
  }
  return NodeFilter.FILTER_ACCEPT;
};

observePage = function (root) {
  var tW;
  tW = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { //+ NodeFilter.SHOW_ELEMENT,
    acceptNode: linkFilter
  }, false);
  while (tW.nextNode()) {
    setLink(tW.currentNode);
  }
};

observer = new window.MutationObserver(function (mutations) {
  var Node, j, k, len, len1, mutation, ref;
  for (j = 0, len = mutations.length; j < len; j++) {
    mutation = mutations[j];
    if (mutation.type === "childList") {
      ref = mutation.addedNodes;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        Node = ref[k];
        observePage(Node);
      }
    }
  }
});

linkMixInit = function () {
  if (window !== window.top || window.document.title === "") {
    return;
  }
  //console.time('a')
  linkify(document.body);
  //console.timeEnd('a')
  return observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

setTimeout(linkMixInit, 3000);