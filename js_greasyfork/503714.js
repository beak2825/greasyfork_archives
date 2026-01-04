// ==UserScript==
// @name         我的第一个脚本
// @version      2024-08-15
// @description  测试脚本
// @author       yanglei
// @match             *://119.84.240.6:31010/*
// @icon         http://119.84.240.6:31010/static/images/favicon.58c0a5114450.ico
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @require           https://lib.baomitu.com/layui/2.9.3/layui.min.js
// @require           https://lib.baomitu.com/limonte-sweetalert2/11.10.2/sweetalert2.all.min.js
// @require           https://lib.baomitu.com/layui/2.9.3/layui.js
// @resource          customCSS https://lib.baomitu.com/layui/2.9.3/css/layui.css
// @namespace https://greasyfork.org/users/1352092
// @downloadURL https://update.greasyfork.org/scripts/503714/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/503714/%E6%88%91%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let dom = document.querySelector('body > div.app-wrapper > div.ls-content-wrapper > div.ls-menu-header > div.ls-menu-header__context > div.ls-menu-header__context-item.ls-menu-header__context-item_right')

    dom.insertAdjacentHTML('beforeend',
                           `<span>project_id</span><input id="project_id" type="text"/><button id="test" class="ls-button ls-button_size_compact ls-button_look_primary">开始训练</button>`)
    let buttonTest = document.getElementById("test")
    buttonTest.onclick = function() {
        // alert("点击了按钮")
        let project_id = document.getElementById("project_id").value
        if (project_id == '') {
            Swal.fire("project_id不能为空")
            return
        }
        new Promise( (resolve) => {
            GM_xmlhttpRequest({
                url: "http://10.187.1.1:18013/train?project_id=" + project_id,
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                onload: function(response){
                    if(response.status === 200) {
                        Swal.fire({
                            title: "训练开始",
                            text: "开启训练中",
                            icon: "success"
                        })
                        resolve(response.responseText)
                        return
                    }else {
                        console.log("执行错误",response)
                    }
                },
                onerror: function(error) {
                    console.log(error)
                    resolve()
                }
            })
        })


    }
})();