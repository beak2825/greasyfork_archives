// ==UserScript==
// @name         金山文档文件批量下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用于金山文档文件批量下载
// @author       chic1018
// @match        *://www.kdocs.cn/mine/*
// @downloadURL https://update.greasyfork.org/scripts/435643/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435643/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

"use strict";


!function(){
    document.querySelector('.nav-action-folder ul').innerHTML = '<li><span><span class="components-icons-box"><i class="components-icons components-icons-nav-download"></i></span><span>简易批量下载</span></span></li>' + document.querySelector('.nav-action-folder ul').innerHTML
    let totalNum
    !function(){
        let scrollHeight
        const fun = setInterval(function(){
            if (scrollHeight != document.querySelector('.yun-list').scrollHeight){
                scrollHeight = document.querySelector('.yun-list').scrollHeight
                document.querySelector('.yun-list').scrollTo(0,scrollHeight)
            }
            else {
                clearInterval(fun)
                totalNum = parseInt(document.querySelector('.yun-list__item:last-child').outerHTML.slice(12,14))+1
                document.querySelector('.yun-list').scrollTo(0,0)
            }
        },50)
    }()
    setTimeout(function(){
        document.querySelector('.nav-action-folder ul li:nth-child(1)').onclick = function(){
            let count = 0
            const downloadFiles = function(){
                if (count>=totalNum){
                    return
                }
                let elemNumber = document.querySelector('.yun-list__content').children.length - 1
                let i = 0
                let download
                let elem0
                let selected = false
                const loop = function(){
                    if (i>=elemNumber || count>=totalNum){
                        document.querySelector('.yun-list').scrollBy(0,66*elemNumber)
                        document.querySelectorAll('.el-message[style]').forEach((e)=>{
                            e.remove()
                        })
                        return
                    }
                    if (download){
                        download.click()
                        elem0.click()
                        download = null
                        selected = false
                        i++
                        count++
                    }
                    else {
                        elemNumber = document.querySelector('.yun-list__content').children.length - 1
                        let str0='.yun-list__content div[index="'+count+'"] .yun-list__checkbox';
                        elem0 = document.querySelector(str0)
                        if (elem0 && !selected){
                            elem0.click()
                            selected = true
                        }
                        else if (!elem0){
                            document.querySelector('.yun-list').scrollBy(0,66*elemNumber)
                        }
                        download = document.querySelector('.nav-action-selected li:nth-child(4)')
                    }
                    setTimeout(loop,0)
                }
                loop()
                setTimeout(downloadFiles,2000)
            }
            downloadFiles()
        }
    },0)
}()