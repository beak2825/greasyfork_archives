// ==UserScript==
// @name         m-team封面预览图调整
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  调整预览图位置，防止遮挡预览小图
// @author       woodj
// @license      MIT
// @include        *.m-team.cc/*adult.php*
// @include        *.m-team.cc/*torrents.php*
// @include        *.m-team.cc/*movie.php*
// @icon           https://tp.m-team.cc/logo.png
// @downloadURL https://update.greasyfork.org/scripts/40020/m-team%E5%B0%81%E9%9D%A2%E9%A2%84%E8%A7%88%E5%9B%BE%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/40020/m-team%E5%B0%81%E9%9D%A2%E9%A2%84%E8%A7%88%E5%9B%BE%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  function showmenu2(obj, objname, url) {
    for (var rowname in ShowDivList) {
      $(rowname).style.display = 'none';
    }
    if (!url) return false;

    if (!$(objname)) {
      var objdiv = document.createElement("div");
      objdiv.id = objname;
    }
    else {
      var objdiv = $(objname);
    }
    var target = obj;
    var pos = new CPos(target.offsetLeft, target.offsetTop);

    var target = target.offsetParent;
    while (target) {
      pos.x += target.offsetLeft;
      pos.y += target.offsetTop;

      target = target.offsetParent
    }
    objdiv.style.display = 'block';
    objdiv.onmousemove = function () {
      setmenutime();
    };
    objdiv.onmouseout = function () {
      hiddmenu(objname);
    };
    objdiv.onclick = function () {
      objdiv.style.display = 'none';
    };

    objdiv.style.position = 'absolute';
    objdiv.style.left = (pos.x + 75) + 'px';
    var top = pos.y + 25;
    var max_top = document.body.scrollHeight - 800;
    top = Math.min(top, max_top);
    objdiv.style.top = top + 'px';
    if (!$(objname + '_img')) {
      objdiv.innerHTML = '';
      var picdiv = document.createElement("img");
      picdiv.setAttribute('src', url);
      picdiv.setAttribute('id', objname + '_img');
      //picdiv.style.display = 'none';
      picdiv.onload = function () {
        //picdiv.style.display = '';
        resource_drawimage(objname + '_img', 650, 800);
      };
      objdiv.appendChild(picdiv);
    }
    document.body.appendChild(objdiv);
    ShowDivList[objname] = 1;
    MenuOutTime = 1;

    return false;
  }

  function change() {
    showmenu = showmenu2;
  }
  change();
  console.log("wood");

})();
