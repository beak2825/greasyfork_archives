// ==UserScript==
// @name         任天堂eshop抓取信息助手
// @namespace    http://xhbuding.cf/
// @version      1.0
// @description  获取任天堂Switch最新发售游戏列表
// @author       xhbuding
// @match        https://www.nintendo.com/store/*
// @match        https://www.nintendo.co.jp/schedule/index.html
// @match        https://www.nintendo.co.jp/software/switch/index.html*
// @icon         data:image/ico;base64,AAABAAIAEBAAAAEACABoBQAAJgAAACAgAAABAAgAqAgAAI4FAAAoAAAAEAAAACAAAAABAAgAAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAGQD8ABJvaAAApv8A////AAAAAAAAAAAAAAAAAAAAAAAAAAAAIIbiAAgE5QDcOwAAAwAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAQEBAQQEBAQBAQEBBAQEBAQBAQEEBAQEAQEBBAQEBAQEBAAAAAQEAAAABAQEBAQEAgIAAAAAAAAAAAICBAQEBAICAgAAAAAAAAICAgQEBAQCAgEAAgAAAgABAgIEBAQEAQEBAQAAAAABAQEBBAQEBAQBAQEAAQEAAQEBBAQEBAQEBAEBAAEBAQQEBAQEBAQEBAQEAgICAgICAgQEBAQEBAQBAQICAgIBAQEBBAQEBAQEAQIBAQICAgECAgIEBAQEBAECAQICAgECAgIEBAQEBAQEAQEBAgIBAgQEBAQEBAQEBAAAAAAAAAAAAAQEBAQEBAQEAAAAAAAEBAQEBATDwwAA48cAAPGPAADAAwAAwAMAAMADAADAAwAA4AcAAPA/AAD4DwAA4AcAAOADAADgBwAA8B8AAPAHAAD4PwAAKAAAACAAAABAAAAAAQAIAAAAAACABAAAAAAAAAAAAAAAAAAAAAAAABJvaAAZAPwAAKb/AP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEAAAAAAAAAAAEBAQEBAQEBAAAAAAAAAAABAQEBAQEBAQAAAAAAAAAAAQEBAQEBAQEAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAABAQEBAQEBAQAAAAAAAAEBAQEBAQEBAQEBAQAAAAAAAAEBAQEBAQEBAAAAAAAAAQEBAQEBAQEBAQEBAQEAQEBAQEBBAQEBAEBAQEBAQQEBAQEBAQEBAQEBAQEBAQBAQEBAQEEBAQEAQEBAQEBBAQEBAQEBAQEBAQEAgICAgEBAQEBAQEBAQEBAQEBAQECAgICBAQEBAQEBAQCAgICAQEBAQEBAQEBAQEBAQEBAQICAgIEBAQEBAQEBAICAgICAgEBAQEBAQEBAQEBAQICAgICAgQEBAQEBAQEAgICAgICAQEBAQEBAQEBAQEBAgICAgICBAQEBAQEBAQCAgICAAABAQICAQEBAQICAQEAAAICAgIEBAQEBAQEBAICAgIAAAEBAgIBAQEBAgIBAQAAAgICAgQEBAQEBAQEAAAAAAAAAAABAQEBAQEBAQAAAAAAAAAABAQEBAQEBAQAAAAAAAAAAAEBAQEBAQEBAAAAAAAAAAAEBAQEBAQEBAQEAAAAAAAAAQEAAAAAAQEAAAAAAAAEBAQEBAQEBAQEBAQAAAAAAAABAQAAAAABAQAAAAAAAAQEBAQEBAQEBAQEBAQEAAAAAAEBAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAQEAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAgICAgICAgICAgICAgIEBAQEBAQEBAQEBAQEBAQEBAQCAgICAgICAgICAgICAgQEBAQEBAQEBAQEBAQEAAAAAAICAgICAgICAAAAAAAAAAAEBAQEBAQEBAQEBAQAAAAAAgICAgICAgIAAAAAAAAAAAQEBAQEBAQEBAQEBAAAAgIAAAAAAgICAgICAAACAgICAgIEBAQEBAQEBAQEAAACAgAAAAACAgICAgIAAAICAgICAgQEBAQEBAQEBAQAAAICAAACAgICAgIAAAICAgICAgQEBAQEBAQEBAQEBAAAAgIAAAICAgICAgAAAgICAgICBAQEBAQEBAQEBAQEBAQAAAAAAAACAgICAAACAgQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAICAgIAAAICBAQEBAQEBAQEBAQEBAQEBAQEAQEBAQEBAQEBAQEBAQEBAQEBBAQEBAQEBAQEBAQEBAQBAQEBAQEBAQEBAQEBAQEBAQEEBAQEBAQEBAQEBAQEBAQEAQEBAQEBAQEBAQQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBAQEBAQEBAQEBBAQEBAQEBAQEBAQE8A/wD/AP8A/8D/A//A/wP/8DwP//A8D/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/8AAA//AAAP/8AD///AA///8AA///AAP/8AAA//AAAP/wAAA/8AAAP/AAAP/wAAD//AAP//wAD//8AAD//AAA//8AP///AD/8=
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450440/%E4%BB%BB%E5%A4%A9%E5%A0%82eshop%E6%8A%93%E5%8F%96%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/450440/%E4%BB%BB%E5%A4%A9%E5%A0%82eshop%E6%8A%93%E5%8F%96%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 对象声明
    // 页面DOM对象：目标DOM对象 表格DOM对象 输出窗口DOM对象
    var hookDom,resultsGridDom,outWindow
    // 文本对象：游戏名称 链接地址
    var gameNameText,urlText,dateText
    // 自定义DOM对象
    var dom1,dom2,dom3
    // 美服eshop游戏列表添加导出按钮
    hookDom = document.getElementsByClassName('SelectWithLabelstyles__SelectWrapper-sc-96z10l-0')
    if(hookDom.length != 0) { // 判断页面中是否存在目标DOM对象
        // 初始化按钮
        dom1 = document.createElement('button')
        dom1.style = 'margin-left: 1.5rem;background-color: rgb(57, 70, 160);border-color: rgb(57, 70, 160);color: rgb(255, 255, 255);border: unset;cursor: pointer;height: 3rem;width: 5rem;font-weight: 700;'
        dom1.addEventListener('click', function(){outButtonEvent('main')})
        dom2 = document.createElement('span')
        dom2.innerHTML = '导出'
        dom1.appendChild(dom2)
        // 将按钮DOM添加到页面
        hookDom[0].appendChild(dom1)
    }
    // 日服eshop游戏发售时间表添加导出按钮
    hookDom = document.getElementsByClassName('local-schedule__switcherInner')
    if(hookDom.length != 0) { // 判断页面中是否存在目标DOM对象
        // 初始化按钮
        dom1 = document.createElement('button')
        dom1.style = 'position: absolute;margin-left: 12rem;background-color: #e60012;color: #fff;border: none;padding: 14px;line-height: 1;font-weight: bold;cursor: pointer;'
        dom1.innerHTML = '导出'
        dom1.addEventListener('click', function(){outButtonEvent('local-schedule__monthArea is-active')})
        // 将按钮DOM添加到页面
        hookDom[0].insertBefore(dom1, hookDom[0].children[0])
    }
    // 日服eshop游戏列表添加导出按钮
    hookDom = document.getElementsByClassName('nc3-c-borderHeader nc3-c-borderHeader--2 soft-sectionHeader')
    if(hookDom.length != 0) { // 判断页面中是否存在目标DOM对象
        dom1 = document.createElement('button')
        dom1.style = 'position: absolute;margin-left: 12rem;background-color: #e60012;color: #fff;border: none;padding: 14px;line-height: 1;font-weight: bold;cursor: pointer;'
        dom1.innerHTML = '导出'
        dom1.addEventListener('click', function(){outButtonEvent('nc3-as-result__listContainer nc3-l-grid__inner')})
        // 将按钮DOM添加到页面
        hookDom[0].insertBefore(dom1, hookDom[0].children[1])
    }
    // 港服eshop游戏列表添加导出按钮
    hookDom = document.getElementsByClassName('SelectWithLabelstyles__SelectWrapper-sc-96z10l-0')
    if(hookDom.length != 0) { // 判断页面中是否存在目标DOM对象
    }
    // 导出按钮事件
    function outButtonEvent(domTarget){
        gameNameText = ''
        urlText = ''
        dateText = ''
        switch(domTarget) {
            case 'main':
                resultsGridDom = document.getElementById(domTarget).children[6].children[2].children[1].children[1].getElementsByTagName('a')
                for(let item in resultsGridDom){
                    if(!isNaN(item)) {
                        gameNameText += resultsGridDom[item].getElementsByTagName('h3')[0].innerText + '<br>'
                        urlText += (resultsGridDom[item].href.match(/(\S*)\?sid/) != null ? resultsGridDom[item].href.match(/(\S*)\?sid/)[1] : resultsGridDom[item].href) + '<br>'
                    }
                }
                break
            case 'local-schedule__monthArea is-active':
                resultsGridDom = document.getElementsByClassName(domTarget)[0].getElementsByTagName('a')
                for(let item in resultsGridDom){
                    if(!isNaN(item)) {
                        if(resultsGridDom[item].children[2].children.length != 0) {
                            gameNameText += resultsGridDom[item].children[2].children[1].children[0].innerText + '<br>'
                        }else{
                            gameNameText += resultsGridDom[item].children[1].innerText + '<br>'
                        }
                        urlText += resultsGridDom[item].href + '<br>'
                    }
                }
                break
            case 'nc3-as-result__listContainer nc3-l-grid__inner':
                resultsGridDom = document.getElementsByClassName(domTarget)[0].getElementsByTagName('a')
                for(let item in resultsGridDom){
                    if(!isNaN(item)) {
                        gameNameText += resultsGridDom[item].children[3].children[0].children[0].innerText + '<br>'
                        urlText += resultsGridDom[item].href + '<br>'
                        dateText += resultsGridDom[item].children[4].children[1].children[0].innerText.match(/(\S*) /)[1] + '<br>'
                    }
                }
                break
        }
        outWindow=window.open()
        outWindow.document.write('<html><head><title>共' + resultsGridDom.length + '条数据</title></head><body>' + gameNameText + urlText + dateText + '</body></html>')
    }
})();