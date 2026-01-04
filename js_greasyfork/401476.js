// ==UserScript==
// @name         查找历史微博
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用
// @author       海军
// @match        http://peachring.com/weibo/user/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401476/%E6%9F%A5%E6%89%BE%E5%8E%86%E5%8F%B2%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/401476/%E6%9F%A5%E6%89%BE%E5%8E%86%E5%8F%B2%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var findDate = window.sessionStorage.getItem('findDate') || '';

    window.onload = function(){
      if (!findDate) {
          layerOpen({
              title: '',
              content: '<p><input type="text" placeholder="请输入日期" id="mydate"/></p>',
              btn: ['确定', '取消'],
              event: [function(){
                  var value = document.getElementById('mydate').value;
                  if (/20\d{2}-\d{2}/.test(value)) {
                      findDate = value;
                      window.sessionStorage.setItem('findDate', findDate);

                      startFindDate();
                  }
              }],
              shadeClose: true,
              style: {
                  content: 'color: red; bold: 900;padding: 10px;'
              }
          });
      } else {
          startFindDate();
      }

    };

    function startFindDate() {
        var items = document.querySelectorAll('.wb-item > .wb-from');
        var finded = false
        for (var i = 0, j = items.length; i < j; i++) {
            if (items[i].querySelector('a').innerText.indexOf(findDate) !== -1) {
                finded = true;
                window.sessionStorage.removeItem('findDate');
                break;
            }
        }
        if (finded === false) {
            setTimeout(goNextPage, 2000);
        }
    }

    function goNextPage() {
      document.querySelector('a.next').click()
    }

    function layerOpen(n) {
      if(!n || !n.content) {
        return
      }
      var k = document.createElement("div");
      k.setAttribute("id", "layer_root");
      k.setAttribute("class", "layer_root opacityIn");
      var j;
      var l = 'class="layer_title"';
      if(n.style && n.style.title) {
        l += " style='" + n.style.title + "'"
      }
      if(n.title == null) {
        j = "<div " + l + ">温馨提示:</div>"
      } else {
        if(n.title == "") {
          j = ""
        } else {
          j = "<div " + l + ">" + n.title + "</div>"
        }
      }
      var d = "";
      var g = 'id="layer_btns" class="layer_btns"';
      if(n.style && n.style.btn != null) {
        g += " style='" + n.style.btn + "'"
      }
      if(n.btn) {
        var m = n.btn.length;
        if(m == 1) {
          d = "<table " + g + '><tr><td id="0" class="layer_btn_single">' + n.btn[0] + "</td></tr></table>"
        } else {
          if(m == 2) {
            d = "<table " + g + '><tr><td id="0" class="layer_btn_left">' + n.btn[0] + '</td><td id="1" class="layer_btn_right">' + n.btn[1] + "</td></tr></table>"
          } else {
            if(m > 2) {
              for(var e = 0; e < m; e++) {
                if(e == 0) {
                  d += '<td id="0" class="layer_btn_left">' + n.btn[e] + "</td>"
                } else {
                  if(e < m - 1) {
                    d += '<td id="' + e + '" class="layer_btn_middle">' + n.btn[e] + "</td>"
                  } else {
                    d += '<td id="' + e + '" class="layer_btn_right">' + n.btn[e] + "</td>"
                  }
                }
              }
              d = "<table " + g + "><tr>" + d + "</tr></table>"
            }
          }
        }
      }
      var b = 'class="layer_content"';
      if(n.style && n.style.content != null) {
        b = " style='" + n.style.content + "'"
      }
      var f = '<div class="layer_main scaleIn opacityIn" id="layer_main">' + j + "<div " + b + ">" + n.content + "</div>" + d + "</div>";
      k.innerHTML = f;
      document.body.appendChild(k);
      if(d) {
        var a = document.getElementById("layer_btns");
        if(a) {
          a.addEventListener("click", function(q) {
            var o = q.target.getAttribute("id");
            if(o) {
              var i = Number(o);
              if(n.event && n.event.length > i) {
                var p = n.event[i];
                if(p && p()) {
                  return
                }
              }
              layerClose(n.closeEvent)
            }
          })
        }
      }
      var c = document.getElementById("layer_main");
      c.addEventListener("click", function(i) {
        i.stopPropagation()
      });
      if(n.shadeClose) {
        k.addEventListener("click", function() {
          layerClose(n.closeEvent)
        })
      }
    }
    var androidBackEvent;

    function layerClose(c) {
      var b = document.getElementById("layer_root");
      if(b) {
        var a = document.getElementById("layer_main");
        a.classList.add("scaleOut");
        a.classList.add("opacityOut");
        b.classList.add("opacityOut");
        setTimeout(function() {
          document.body.removeChild(b)
        }, 300)
      }
      c && c();
      androidBackEvent && androidBackEvent()
    };

    GM_addStyle(".layer_root{width:100%;height:100%;text-align:center;position:fixed;top:0;z-index:99999;background-color:rgba(0,0,0,0.5);font-size:15px}.layer_root:before{content:'';display:inline-block;height:100%;vertical-align:middle}.layer_main{max-width:80%;display:inline-block;vertical-align:middle;background-color:#fff;border-radius:8px;text-align:left}.layer_title{padding:10px;border-bottom:1px solid #ebebeb}.layer_content{padding:10px}.layer_btns{width:100%;text-align:center;border-top:1px solid #ebebeb}.layer_btns td{padding:10px}.layer_btns td:active{background-color:#f0f0f0}.layer_btn_single{border-bottom-left-radius:8px;border-bottom-right-radius:8px}.layer_btn_left{border-bottom-left-radius:8px;border-right:1px solid #ebebeb;cursor: pointer;}.layer_btn_middle{border-right:1px solid #ebebeb;cursor: pointer;}.layer_btn_right{border-bottom-right-radius:8px;cursor: pointer;}.scaleIn{animation:scaleIn .32s;-webkit-animation:scaleIn .32s}@-webkit-keyframes scaleIn{from{transform:scale(.5);-webkit-transform:scale(.5)}to{transform:scale(1);-webkit-transform:scale(1)}}.scaleOut{-webkit-animation:scaleOut .32s}@-webkit-keyframes scaleOut{from{transform:scale(1);-webkit-transform:scale(1)}to{transform:scale(.5);-webkit-transform:scale(.5)}}.opacityIn{-webkit-animation:opacityIn .32s}@-webkit-keyframes opacityIn{from{opacity:0}to{opacity:1}}.opacityOut{-webkit-animation:opacityOut .32s}@-webkit-keyframes opacityOut{from{opacity:1}to{opacity:0}}");
    window.layerOpen = layerOpen, window.layerClose = layerClose;
})();