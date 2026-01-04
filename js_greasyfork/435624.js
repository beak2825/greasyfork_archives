// ==UserScript==
// @name         sucem_yhgl_enhance
// @namespace    http://esclt.net/
// @version      0.1
// @description  增强用户管理页面的功能
// @author       janken.wang@hotmail.com
// @match        http://10.0.0.205/sl/s_yggl.jsp
// @icon         https://www.google.com/s2/favicons?domain=0.205
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435624/sucem_yhgl_enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/435624/sucem_yhgl_enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    /** 获取用户工号列的数据
     **/
    const gatherFirstColumnData = () => {
        return document.querySelector('#tjtable').querySelectorAll('td:first-child');
    }

    /** 只有工号大于100和小于900的才是合法的用户
    **/
    const isLegalUser = (userNumber) => {
        return userNumber >= 100 && userNumber < 900
    }

    /** 将表格第一列的工号数据转换成数字数组
    **/
    const getUsedNumbers = (firstColumnDatas) => {
        return _(firstColumnDatas)
            .map(d => Number(d.innerText))
            .dropWhile(_.isNaN)
            .remove(isLegalUser)
            .value()
    }

    const findUnusedNumber = (usedNumber) => {
        return _.difference(_.range(100, 900), usedNumber)
    }

    const unusedNumber = findUnusedNumber(getUsedNumbers(gatherFirstColumnData()))
    // console.log(unusedNumber);

    const contentComp = document.createElement('div')
    contentComp.style.position = 'fixed'
    contentComp.style.right = '10rem'
    contentComp.style.top = '3rem'
    contentComp.style.bottom = '3rem'
    contentComp.style.backgroundColor = 'rgba(0,0,0,0.4)'
    contentComp.style.padding = '.2rem'
    contentComp.style.width = '20rem'
    contentComp.style.overflowY = 'scroll'
    contentComp.style.overflowX = 'hidden'
    document.body.appendChild(contentComp)

    const listComp = document.createElement('ul')
    listComp.style.listStyleType = "square"
    listComp.style.color = "white"
    listComp.style.listStylePosition = "inside"
    listComp.style.width = '100%'
    listComp.style.display = 'flex'
    listComp.style.flexFlow = 'row wrap'

    contentComp.appendChild(listComp)

    unusedNumber.forEach(n => {
        const liComp = document.createElement('li')
        liComp.appendChild(document.createTextNode(n))
        liComp.style.flex = '0 0 20%'
        listComp.appendChild(liComp)
    })
})();