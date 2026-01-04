// ==UserScript==
// @name         EXH预加载脚本
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  用于对ex站预加载，看本更流畅（滑稽
// @author       Mmx
// @match        https://exhentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395763/EXH%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/395763/EXH%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var imgg = document.getElementById('img');
  var next = document.getElementById('next');
  if (window.frames.length == parent.frames.length) { //母页
    //初始化提示信息
    var load_data = document.createElement('div');
    load_data.setAttribute("style", "position: absolute; width: 100%; z-index: 998; margin-top: 90px;");
    load_data.innerHTML = '<a>预加载已开始 :: </a><a id="data2">已加载好0页 :: </a><a id="data3">第N页已载入</a>';
    var temp = document.getElementById('i2').getElementsByTagName('div')[2];
    document.styleSheets[0].insertRule('#i2>.sn+div{margin-bottom:' + (temp.offsetHeight + 2) + 'px;}', 0);
    load_data.style.marginTop = (temp.offsetHeight + temp.offsetTop + 1) + 'px';
    document.body.insertBefore(load_data, document.getElementById('i1'));

    //创建iframe
    window["preload_count"] = 0; //预加载计数
    var newi = document.createElement("iframe");
    newi.hidden = "hidden";
    newi.src = next.href;
    if (window.complete) document.body.appendChild(newi);
    else window.addEventListener("load", () => {
      document.body.appendChild(newi)
    });

    //更新提示通道
    window["preload_count"] = 0; // 计数
    window["preload_message"] = (page) => {
      preload_count++;
      document.getElementById("data2").innerHTML = "已加载好" + preload_count + "页 :: ";
      document.getElementById("data3").innerHTML = "第" + page + "页已载入";
    }

    //图片强制缓存机制
    window["preload_imgs"] = []; //图片信息
    window["preload_force"] = (id) => { //强制缓存
      temp = document.createElement("img");
      temp.hidden = "hidden";
      temp.src = preload_imgs[id];
      document.body.appendChild(temp);
    }

  } else { //子页
    var NextButton = document.getElementById("next");

    function NextPage() {
      if (location.href.split('?')[0] == NextButton.href.split('?')[0]) { //加载完毕

        return
      }
      window["_load_image"] = (e, f, d) => { //解除加载频率限制
        return true;
      }
      NextButton.click();
      window["load_image_dispatch"] = () => { //回调
        var a = api_response(dispatch_xhr);
        if (a != false) {
          if (a.error != undefined) {
            document.location = document.location + ""
          } else {
            history.replaceState({
              page: a.p,
              imgkey: a.k,
              json: a,
              expire: get_unixtime() + 300
            }, document.title, base_url + a.s);
            apply_json_state(a)
            work();
          }
          dispatch_xhr = undefined
        }
      }
    }

    window["work"] = () => {
      var this_page = location.pathname.split("-")[1];
      var imgg = document.getElementById('img');
      parent.preload_imgs[this_page] = imgg.src;
      parent.preload_force(this_page);
      parent.preload_message(this_page);
      if (imgg.complete) NextPage();
      else imgg.addEventListener("load", NextPage);
    }
    work();
  }
})();
