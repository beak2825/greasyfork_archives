// ==UserScript==
// @name         Juju工具-胖胖的百宝箱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  淘宝商品右上角展示当前商品所有规格价格信息!
// @author       jushi
// @match        https://item.taobao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447554/Juju%E5%B7%A5%E5%85%B7-%E8%83%96%E8%83%96%E7%9A%84%E7%99%BE%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/447554/Juju%E5%B7%A5%E5%85%B7-%E8%83%96%E8%83%96%E7%9A%84%E7%99%BE%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let projList = document.querySelectorAll('#J_isku > div > dl.J_Prop.tb-prop.tb-clear.J_Prop_Color > dd > ul li')
    let projArr = []
    console.log('projList', projList)
    //projList[1].querySelector('a').click

    projList.forEach(li => {
        // if(li.className !== 'tb-txt'){
            setTimeout(()=>{
                let a = li.querySelector('a')
                a.click()
                let projObj = {}
                projObj.name = a.querySelector('span').innerText
                projObj.price = document.querySelector('#J_StrPrice > em.tb-rmb-num').innerText
                projObj.taobaoPrice = document.querySelector('#J_PromoPriceNum') ? document.querySelector('#J_PromoPriceNum').innerText : ''
                projObj.img = document.querySelector('#J_ImgBooth').src
                projArr.push(projObj)
            },500)
        // }
    })

    setTimeout(()=>{
        console.log(projArr)
        let div = document.createElement('div')
        div.style = 'position: fixed; background-color: rgb(227, 227, 227); top: 1px; right: 1px; z-index: 999999999; padding: 10px;'
        document.body.appendChild(div)
        let tableStr = '<table>'
        tableStr += '<tr><td>名称</td><td>价格</td><td>淘宝价</td><td>图片</td></tr>'
        projArr.forEach(proj => {
            tableStr += '<tr>'
                + '<td>' + proj.name + '</td>'
                + '<td>' + proj.price + '</td>'
                + '<td>' + proj.taobaoPrice + '</td>'
                + '<td><img style="width: 100px; height: 60px;" src="' + proj.img + '" alt=""></td>'
                + '</tr>'
        })
        tableStr += '</table>'
        div.innerHTML=tableStr
        document.body.appendChild(div)
    }, 500 * projList.length + 100)

})();