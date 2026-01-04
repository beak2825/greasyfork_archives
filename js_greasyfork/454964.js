/*
 * @Author: chenguanjiang chenguanjiang@miyaem.com
 * @Date: 2022-11-16 17:37:00
 * @LastEditors: chenguanjiang chenguanjiang@miyaem.com
 * @LastEditTime: 2022-11-17 14:29:54
 * @FilePath: \adminc:\.chenguanjiang\.code\代码备份\新建文件夹\test.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// ==UserScript==
// @name         图片点击展示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  适用于各网页，自动隐藏图片，点击图片展示/隐藏，只需改变代码中的@match 地址，默认地址为百度贴吧
// @author       You
// @match        *://bbs.mihoyo.com/*
// @match        *://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @license        MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454964/%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/454964/%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

;(function (window, document) {
    'use strict'

    let imgList
    let imgObj = {}
    const baseImg =
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-4o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F267f9e2f070828383b5f1d77b999a9014c08f107.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1671183854&t=0be6c5d7bae44b66ec769d780faccaf5'
    function handleImg() {
        imgList.forEach((ele, index) => {
            imgObj[index] = ele.src
            ele.src = baseImg
            ele.style.border = '1px solid #eee'
            ele.addEventListener('click', function (e) {
                if (e.target.src === imgObj[index]) {
                    ele.src = baseImg
                    // ele.style.background = '#eee'
                    ele.style.border = '1px solid #eee'
                } else {
                    e.target.src = imgObj[index]
                    ele.style.border = 'none'
                }
            })
        })
    }

    function disposeImg(list) {
        let subImgObj = {}
        list.forEach((item, index) => {
            if (item.src !== baseImg) {
                subImgObj[index] = item.src
                item.src = baseImg
                item.style.border = '1px solid #eee'
                item.addEventListener('click', function (e) {
                    if (e.target.src === subImgObj[index]) {
                        item.src = baseImg
                        item.style.border = '1px solid #eee'
                    } else {
                        e.target.src = subImgObj[index]
                        item.style.border = 'none'
                    }
                })
            }
        })
    }

    imgList = document.querySelectorAll('img')
    if (imgList.length) {
        handleImg()
    } else {
        setTimeout(() => {
            imgList = document.querySelectorAll('img')
            handleImg()
        }, 1000)
    }

    document.addEventListener('wheel', () => {
        console.log(111)
        let list = document.querySelectorAll('img')
        if (list.length > imgList.length) {
            disposeImg(list)
        }
    })
})(window, document)
