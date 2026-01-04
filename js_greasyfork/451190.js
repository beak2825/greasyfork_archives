// ==UserScript==
// @name        明星美足网vip破解 meizutuku.com
// @namespace   xiaobaozheng
// @version     1.0.2
// @author      xiaobaozheng
// @description 不需要任何操作，只需安装该脚本就可以无限制的查看明星美足网的所有图片
// @match       *://www.meizutuku.com/*
// @match       http://btxiazai.cc/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451190/%E6%98%8E%E6%98%9F%E7%BE%8E%E8%B6%B3%E7%BD%91vip%E7%A0%B4%E8%A7%A3%20meizutukucom.user.js
// @updateURL https://update.greasyfork.org/scripts/451190/%E6%98%8E%E6%98%9F%E7%BE%8E%E8%B6%B3%E7%BD%91vip%E7%A0%B4%E8%A7%A3%20meizutukucom.meta.js
// ==/UserScript==
(function () {
  var imgs = document.getElementsByTagName("img");
    var destPath = "";
  for (var i = 0; i < imgs.length; i++) {
    var elem = imgs[i];
    if (elem.parentElement.tagName.toLowerCase() == "div") {
      try {
        var regDate = /yl\/(\d+)/;
        var regDate1 = /upload\/image/;
        if (regDate.test(elem.src) || regDate1.test(elem.src)) {
          console.log(i)
          let newSrc = elem.src.substring(0, elem.src.indexOf("?"));
          let _path = new URL(elem.src);
          newSrc = newSrc.replace(
            _path.pathname.substring(0, _path.pathname.lastIndexOf("/") + 1),
            destPath
          );
          elem.class = "";
          var linkElem = document.getElementsByClassName("article-content");
          var _newElem = document.createElement('img');
          _newElem.src = newSrc;
          linkElem[0].appendChild(_newElem);
          console.log(i)
        } else {
          // console.log('hi'+elem.src);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      // console.log(elem.parentElement);
    }
    if (elem.src.indexOf("?") > -1) {
      elem.src = elem.src.substring(0, elem.src.indexOf("?"));
      let _path = new URL(elem.src);
      if(destPath==''){
        destPath = _path.pathname.substring(
          0,
          _path.pathname.lastIndexOf("/") + 1
        );
      }
    }
    // console.log(elem.src)
  }
})();