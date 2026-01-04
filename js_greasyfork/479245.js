// ==UserScript==
// @name        Github 高速下载，文件加速下载（不限于Github，可根据需要修改match）
// @namespace   Violentmonkey Scripts
// @match       *://github.com/*
// @description 文件高速下载，可用于各种因为网络问题而下载慢的文件(不限于github)，鼠标箭头悬停在下载链接0.5秒，即可显示高速下载按钮。
// @grant       none
// @version     1.1.3
// @author      -
// @license MIT
// @description 2023/11/10 11:42:51
// @downloadURL https://update.greasyfork.org/scripts/479245/Github%20%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%96%87%E4%BB%B6%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%B8%8D%E9%99%90%E4%BA%8EGithub%EF%BC%8C%E5%8F%AF%E6%A0%B9%E6%8D%AE%E9%9C%80%E8%A6%81%E4%BF%AE%E6%94%B9match%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479245/Github%20%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%96%87%E4%BB%B6%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%B8%8D%E9%99%90%E4%BA%8EGithub%EF%BC%8C%E5%8F%AF%E6%A0%B9%E6%8D%AE%E9%9C%80%E8%A6%81%E4%BF%AE%E6%94%B9match%EF%BC%89.meta.js
// ==/UserScript==

(function(){
  function get_href_url(url, href_str) {
    const u = new URL(url)
    if (href_str.match(/^https?:\/\//i)) {
      return href_str
    } else if (href_str.startsWith('/')) {
        return u.origin + href_str
    } else {
        return u.origin + (u.pathname == "/" ? "" : u.pathname) + "/" + href_str
    }
  }

let active_link_ele = null


  function DownloadTip() {
    // 创建一个DIV元素
    var div = document.createElement('div');

    div.style.position = 'absolute';

    // div.style.backgroundColor = '#333';
    div.style.fontSize = '12px';
    // div.style.transform = "0.5"
    // 创建一个超链接元素
    var link = document.createElement('a');
    link.textContent = '高速下载';
    link.id = "download_tip"
    link.setAttribute("target","_blank")
    // 将超链接元素添加到DIV中
    div.appendChild(link);

    // 设置DIV的样式
    div.style.position = 'absolute';
    const thisobj = this
    // 监听DIV的mouseout事件
    link.addEventListener('mouseout', function() {
      console.log("inactive")
      thisobj.hide()
    });
    link.addEventListener('mouseover', function(){
        thisobj.active = true
        console.log("active")
    })
    // 将DIV添加到文档的body中
    document.body.appendChild(div);
    this.show = function(url, x, y, height, ele){

      setTimeout(function(){
          if(ele != active_link_ele){
            return
          }

          const listener = function(){
            console.log("ele out")
            ele.removeEventListener("mouseout", listener)
            setTimeout(function(){
                console.log("active", thisobj.active)
                if(!thisobj.active && active_link_ele != ele){
                  thisobj.hide()
                }
            },400)
        }
        ele.addEventListener("mouseout", listener)
        div.style.display = 'block';
        div.style.left = x + 'px';
        div.style.top = parseInt(y) - height  + 'px';
        link.href = "https://doget.nocsdn.com/?url=" + encodeURIComponent(url)
        this.is_show = true
      }, 500)


    }

    this.is_show = false
    this.active = false

    this.hide = function(){
        div.style.display = 'none';
        this.is_show = false
        this.active = false
    }
  }

const download_tip = new DownloadTip()

document.body.addEventListener("mouseover", (e)=>{
  let target = e.target
  active_link_ele = target
  while(target && (target.tagName != "A" && target.tagName != "BODY")){
    target = target.parentElement
  }
  if(target && target.tagName == 'A' && target.id != "download_tip"){
          const href = target.getAttribute("href");
          if(href && href.trim() != ""){
              const target_url = get_href_url(location.href, href)
              active_link_ele = target
              console.log(target_url, e.pageX, e.pageY)
              const rect = target.getClientRects()[0]
              download_tip.show(target_url, e.pageX, rect.top + window.scrollY, rect.height, target)
          }
   }
},true)
})()