// ==UserScript==

// @name        Tools UEO knife4j-menu */doc.html
// @description ...
// @include     */doc.html
// @author      AD
// @version     0.1
// @namespace   aboutdev
// @icon        data:image/png;base64,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

// @downloadURL https://update.greasyfork.org/scripts/433171/Tools%20UEO%20knife4j-menu%20%2Adochtml.user.js
// @updateURL https://update.greasyfork.org/scripts/433171/Tools%20UEO%20knife4j-menu%20%2Adochtml.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    async function getJSON() {
        let url = location.href.substr(0,location.href.indexOf('doc.html')-1)+'/v3/api-docs'
        try {
            let response = await fetch(url)
            return await response.json()
        } catch (error) {
            console.log('Request Failed', error)
        }
    }
    const jsonStr = getJSON()
    console.log(jsonStr,' await OK')

   /**
    * search key by value in json
    */
    function search(json, target) {
        let jsonObj = json
        let subJson = jsonObj.paths
        let find = Object.keys(subJson).filter((item)=>{
            let subItem = subJson[item]
            return (subItem.get && subItem.get.operationId === target) || (subItem.post && subItem.post.operationId === target)|| (subItem.put && subItem.put.operationId === target)
        })
        return find[0]
    }

    function process(){
       // 显示 接口名称
       document.querySelectorAll("#app > div > section > aside > div > div.knife4j-menu > ul > li.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open > ul > li").forEach(function(el) {
            let hrefSplit   = el.children[0].href.split('/')
            let operationId = hrefSplit[hrefSplit.length-1]
            jsonStr.then((out)=>{
                let newInnerHtml = search(out, operationId)

                let projectUrl        = location.href.substr(0,location.href.indexOf('doc.html')-1)
                let projectNameLength = projectUrl.substr(projectUrl.lastIndexOf('/')+1).length
                newInnerHtml     = newInnerHtml.substring(projectNameLength+2,newInnerHtml.length)
                newInnerHtml     = el.children[0].innerHTML+"   <span style='color:#1890ff'>" +newInnerHtml +"</span>"
                if (el.children[0].innerHTML.indexOf('color:#1890ff') != -1) {
                    return
                } else {
                    el.children[0].innerHTML = newInnerHtml
                }
            })
        })
        // 增宽菜单
        document.querySelector("#app > div > section > aside").style = "flex: 0 0 480px;max-width: 480px;min-width: 480px;width: 480px;background: rgb(30, 40, 44);"
    }
    window.setInterval(function() {
        process();
    },1000);
})();