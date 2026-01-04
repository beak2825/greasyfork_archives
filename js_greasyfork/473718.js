// ==UserScript==
// @name         禁漫
// @namespace    yqsphp.com
// @version      0.9
// @description  禁漫的一些改动
// @author       You
// @match        *://jm-comic1.club/*
// @match        *://jm-comic2.club/*
// @match        *://jm-comic.vip/*
// @match        *://18comic.vip/*
// @match        *://jmcomic.me/*
// @match        *://18-comicblade.vip/*
// @match        *://18comic-erdtree.cc/*
// @match        *://18comic-erdtree.org/*
// @match        *://jmcomic1.me/*
// @match        *://jmcomic1.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473718/%E7%A6%81%E6%BC%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/473718/%E7%A6%81%E6%BC%AB.meta.js
// ==/UserScript==
(function () {
  var path = location.pathname;
  function getId(id) {
    return document.getElementById(id);
  }
  function getClass(cls, doc) {
    if (doc) {
      return doc.getElementsByClassName(cls);
    }
    return document.getElementsByClassName(cls);
  }
  function getTag(tag, doc) {
    if (doc) {
      return doc.getElementsByTagName(tag);
    }
    return document.getElementsByTagName(tag);
  }
  if (path.search("photo") == -1) {
    var create = ["script", "div", "a", "img", "ins", "span", "iframe"];
    var _create = document.createElement;
    document.createElement = function (tag, flag) {
      console.log("create创建的节点:" + tag, flag);
      if (flag) {
        return _create.apply(this, arguments);
      } else if (create.indexOf(tag) != -1) {
        console.log("create阻止的节点:" + tag);
        return _create.apply(null, arguments);
      } else {
        return _create.apply(this, arguments);
      }
    };
  }
  var ele = [
    { name: "bot-per", type: 2 },
    { name: "modal-backdrop", type: 2 },
    { name: "col-lg-12", type: 2 },
    { name: "e8c78e-4_b", type: 2 },
    { name: "a35c7-1_4", type: 2 },
    { name: "billboard-modal", type: 1 },
    { name: "guide-modal", type: 1 }
  ];
  var deleteChild = function (ele, type) {
    var e, c;
    if (type == 1) {
      e = getId(ele);
      c = e.lastElementChild;
      while (c) {
        e.removeChild(c);
        c = e.lastElementChild;
      }
      e.parentElement.removeChild(e);
    } else if (type == 2) {
      e = getClass(ele);
      for (var i = 0; i < e.length; i++) {
        c = e[i].lastElementChild;
        e[i].parentElement.removeChild(e[i]);
      }
    }
  };
  //小屏图片修改
  var chl = document.createElement("style");
  chl.textContent="@media screen and (min-width: 375px){.thumb-overlay-albums{min-width:auto !important;}}";
  getTag("head")[0].appendChild(chl);
  
  var search = null;
  var group = null;
  var a = {};
  setInterval(function () {
    if (search == null) {
      search = getClass("navbar-header")[0];
      console.log(search);
      getClass("dropdown", search)[0].onclick = function (e) {
        if (this.classList.contains("open")) {
          this.classList.remove("open");
        } else {
          this.classList.add("open");
          console.log(this.classList);
        }
        e.stopPropagation();
      };
      var form = getId("search_form_m");
      getClass("form-control", form)[0].onclick = function (e) {
        e.stopPropagation();
      };
    }
    ele.forEach(function (item) {
      try {
        deleteChild(item.name, item.type);
      } catch (e) {}
    });
    group = getClass("btn-group");
    for (var i = 0; i < group.length; i++) {
      group[i].onclick = function (e) {
        if (this.classList.contains("open")) {
          this.classList.remove("open");
        } else {
          this.classList.add("open");
        }
        e.stopPropagation();
      };
    }
    var lists = getClass("list-col");
    var lengt = lists.length;
    for (var j = 0; j < lengt; j++) {
      lists[j].style = "padding-left:0;padding-right:0";
      if (lists[j].classList.contains("col-xs-6")) {
        lists[j].classList.remove("col-xs-6");
      }
      if (lists[j].classList.contains("col-sm-6")) {
        lists[j].classList.remove("col-sm-6");
      }
      if (!lists[j].classList.contains("col-xs-4")) {
        lists[j].classList.add("col-xs-4");
      }
      if (path.search("photo") == -1) {
        var img = getTag("img", lists[j]);
        var len = img.length;
        for (var k = 0; k < len; k++) {
          var src = img[k].getAttribute("data-original");
          if (src) {
            img[k].setAttribute("src", src);
          }
        }
      }
    }
    var c = getId("wrapper");
    var b = getTag("a",c);
    if(b.length == a.length){
      for(var q = 0; q < b.length; q++){
        if(b[q].getAttribute("target") == "_blank"){
          continue;
        }
		b[q].setAttribute("target","_blank");
	  }
    }else{
      a = b;
    }
  }, 1000);
})();
