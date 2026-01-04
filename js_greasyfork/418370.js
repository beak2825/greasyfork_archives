// ==UserScript==
// @name         CRMQuickFind
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于CRM系统select标签搜索（高级查找，业务规则配置），ctrl+click 或 command + click 触发搜索
// @author       Rick-ZhuQiu
// @match        http://*/*advancedfind*
// @match        http://*/*businessRulesDesigner.aspx*
// @match        https://*/*businessRulesDesigner.aspx*
// @match        https://*/*advancedfind*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418370/CRMQuickFind.user.js
// @updateURL https://update.greasyfork.org/scripts/418370/CRMQuickFind.meta.js
// ==/UserScript==

(function() {
    if(document.body.children.length > 10) return
    function getTheParentTag(startTag,theTag) {
        if (!(startTag instanceof HTMLElement)) return console.error('receive only HTMLElement');
        if ('BODY' !== startTag.parentNode.nodeName) {
            console.log(startTag.parentNode.nodeName)
            if(startTag.parentNode.nodeName === theTag) {
                return startTag.parentNode
            } else {
                return getTheParentTag(startTag.parentNode,theTag)
            }
        }
        else return null
    }
    function quickFind () {
        let isMultiple = false
        let isLoad = false
        return function(e) {
            let target = e.target || e.srcElement;
            if(target.nodeName !== 'SELECT') {
                return
            }
            if(!(e.ctrlKey || e.metaKey)) return
            if(!isMultiple && !isLoad) {
                isMultiple = window.confirm("是否开启多项匹配？");
            }
            isLoad = true
            let theText = prompt('请输入搜索文本','')
            if(theText && theText !== '') {
                let theAarry = []
                let options = target.querySelectorAll('option[value]')
                if(isMultiple) {
                    options.forEach((item)=>{
                        if(item.outerText.replace(/\s*/g,"").indexOf(theText) !== -1) {
                            theAarry.push(item)
                        }
                    })
                    if (theAarry.length > 1) {
                        let isSelected = false
                        let moreStr = theAarry.reduce((prev,cur)=>{
                            return prev + cur.outerText.replace(/\s*/g,"")+"\r\n"
                        },'')
                        let moreText = prompt('查找到多个匹配项，请选择一项输入：\r\n\r\n' + moreStr,'')
                        theAarry.forEach((item)=>{
                            if(item.outerText.replace(/\s*/g,"") === moreText) {
                                item.selected = moreText
                                let evt = document.createEvent("HTMLEvents");
                                evt.initEvent("change", true, false);
                                getTheParentTag(item,'SELECT').dispatchEvent(evt)
                                isSelected = true
                            }
                        })
                        if(moreText && !isSelected) {
                            alert('无效的输入')
                        }
                    } else if(theAarry.length === 1) {
                        theAarry[0].selected = theText
                        let evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", true, false);
                        getTheParentTag(theAarry[0],'SELECT').dispatchEvent(evt)
                    } else {
                        alert('没有找到匹配项')
                    }
                } else {
                    let isSelected = false
                    options.forEach((item)=>{
                        if(item.outerText.replace(/\s*/g,"") === theText) {
                            item.selected = theText
                            let evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", true, false);
                            getTheParentTag(item,'SELECT').dispatchEvent(evt)
                            isSelected = true
                        }
                    })
                    if(!isSelected) {
                        alert('未找到匹配项')
                    }
                }
            }
        }
    }
    document.body.addEventListener('click', quickFind())
})();