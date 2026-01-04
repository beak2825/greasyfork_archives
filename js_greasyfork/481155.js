// ==UserScript==
// @name         Transsion Ucenter Menu Injector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include        /^https?:\/\/admin(-test)?\.shalltry\.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shalltry.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js
// @resource     BOOT_CSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481155/Transsion%20Ucenter%20Menu%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/481155/Transsion%20Ucenter%20Menu%20Injector.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var hash = document.location.hash  // '#/project/set?appId=？'
    var mp = /#\/project\/.*?appId=(\d+)/.exec(hash)
    if(!mp)return
    var appId = mp[1]
    var token = Cookies.get('UCenter-Token')

    console.log('menus >>', menus)

    var menus;
    async function fetchMenus(){
      var res = await fetch(`menu/index?appId=${appId}&page=1&limit=10&sort=-id`, {headers: {
        'X-Token': token
      }})
      var {data: {items}} = await res.json()
      menus = items
      return items
    }
    function findDesp(name){
      return menus.find(v => v.menu_name_zh === name)
    }

    await fetchMenus()
    var myCss = GM_getResourceText("BOOT_CSS");
    GM_addStyle(myCss);



    var modalTemp = $(`<div class="modal fade" id="injectMenuModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">菜单导入</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
  <label for="injectMenuModalText" class="form-label">YAML菜单格式：</label>
  <textarea class="form-control" id="injectMenuModalText" rows="3"></textarea>
</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary submit">确认</button>
      </div>
    </div>
  </div>
</div>`)

    async function postMenu(data, parent){
        if(typeof data === 'string'){
            if(!parent) {
              var guessName = /(.+)=>.+/.exec(data)
              if(!guessName) return
              parent = parent || findDesp(guessName)
            }
            addMenu(data, parent)
        } else if(data.splice){
            for(var fr of data){
                var oldMenu = findDesp(fr)
                if(!oldMenu) await addMenu(fr, parent)
                await fetchMenus()
                var _newMenu = findDesp(fr)
                postMenu(data[fr], _newMenu)
            }
        } else {
            for(var fr in data){
                var oldMenu = findDesp(fr)
                if(!oldMenu) await addMenu(fr, parent)
                await fetchMenus()
                var _newMenu = findDesp(fr)
                postMenu(data[fr], _newMenu)
            }
        }
    }
    async function addMenu(name, parent){
      await addRoute(name)
      var res = await fetch(`menu/save`, {headers: {
        'X-Token': token,
        'content-type': 'application/json;charset=UTF-8'
      },
      'method': 'post',
        body: JSON.stringify({
            "id":"",
            "app_id":appId,
            "menu_name_zh":name,
            "menu_name_en":"",
            "menu_parent_id":parent && parent.id || 0,
            "menu_sort":0,
            "menu_icon":"",
            "menu_redirect":name
        })})
      return res
    }
    async function addRoute(name){
      var res = await fetch(`route/save`, {headers: {
        'X-Token': token,
        'content-type': 'application/json;charset=UTF-8'
      },
      'method': 'post',
        body: JSON.stringify({
            "id":"",
            "app_id":appId,
            "route_name":name,
            "route_path":name
        })})
      return res
    }

    function initHtml(){
        var target = $('span:contains("添加一级菜单")')
        if(target.length){
            target.parent().before(`<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#injectMenuModal">
  菜单导入
</button>`)
            $(document.body).append(modalTemp)
            modalTemp.on('click','.submit',function(){
              var text = modalTemp.find('#injectMenuModalText').val()
              var config = jsyaml.load(text)
              postMenu(config)
            })
            clearInterval(cancelItv)
        }

    }

    var cancelItv = setInterval(initHtml, 1000)



    // Your code here...
})();