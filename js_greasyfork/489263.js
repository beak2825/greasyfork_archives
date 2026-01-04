// ==UserScript==
// @name         煎蛋本地收藏工具
// @namespace    jandan favorite tool
// @version      0.0.2
// @description  localStorage favorite shudong、pic and more
// @license      MIT
// @author       Dover
// @match        *://jandan.net/*
// @exclude      *://jandan.net/bbs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489263/%E7%85%8E%E8%9B%8B%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/489263/%E7%85%8E%E8%9B%8B%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //add favorite btn
    const _ELList = $('.commentlist li')
    const DB_Name = 'JanDan'
    let UPDATE_LIST = false
    for(let i = 0; i < _ELList.length; i++) {
      const _ELItem = _ELList[i]
      const id = $(_ELItem).find('.righttext a').text()
      const FavoriteBtn = $('<span class="favorite" style="font-size:14px;color:#ffaaaa;cursor:pointer;">❤️</span>')
      FavoriteBtn.on('click',function(){
        saveId(id)
      })
      $(_ELItem).find('.righttext').append(FavoriteBtn)
    }
    function saveId(id){
       const Favorite_List = db.get('favorite',[])
       let remark = prompt("填写备注信息(可选)");
       Favorite_List.push({
         id: id,
         time: new Date().getTime(),
         remark:remark
       })
       db.save('favorite',Favorite_List)
       UPDATE_LIST = true
       alert('收藏成功！')
    }

    const db = {
      save(key,value) {
        localStorage.setItem(DB_Name + '_' + key, JSON.stringify(value))
      },
      get(key, defaultValue = {}) {
        try {
         return (JSON.parse(localStorage.getItem(DB_Name+ '_' + key)) || defaultValue)
        }catch(err) {
           return defaultValue
        }
      },
    }

    //add showlist win
    let Favorite_List_Show = false
    $('.nav').css({"position":"relative"})
    const Favorite_List_Win = $('<div id="favoriteList" style="width:400px;height:400px;overflow:auto; display:none;position: absolute;right: 0px;background: rgb(255, 255, 255);border: 1px solid rgb(204, 204, 204);z-index: 2;" ><table style="width:100%;border-collapse: collapse;" ><thead><tr><th>时间</th><th>编号</th><th>链接</th><th>备注</th></tr></thead><tbody>'+ writeList() +'</tbody></table></div>')
    $('.nav').append(Favorite_List_Win)

    function writeList () {
      const Favorite_List = db.get('favorite',[])
      let List_Html = ''
      for(let i = Favorite_List.length-1; i>=0; i--) {
        const item = Favorite_List[i]
        List_Html += `<tr style="border-bottom:1px solid #ccc" ><td>${new Date(item.time).toLocaleDateString()()}</td><td>${item.id}</td><td><a target="_blank" href="https://jandan.net/t/${item.id}" >跳转</a></td><td>${item.remark}</td></tr>`
      }
        return List_Html
    }

    //add showlist btn
    const Member_Btn = $('a[href="/member"]');
    const Favorite_List_Btn = $('<li class="nav-item" style="float:right;cursor:pointer;" ><a class="nav-link">收藏列表</a></li>');
    Favorite_List_Btn.on('click',function(){
     if(Favorite_List_Show) {
       $('#favoriteList').hide()
     } else {
       if(UPDATE_LIST) {
         $('#favoriteList tbody').html(writeList())
         UPDATE_LIST = false
       }
       $('#favoriteList').show()
     }
     Favorite_List_Show = !Favorite_List_Show
    })
    Member_Btn.parent().before(Favorite_List_Btn);

})();