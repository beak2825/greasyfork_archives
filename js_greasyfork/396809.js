// ==UserScript==
// @name         CSDN 净化
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去除CSDN多余的广告侧边栏信息，阅读全文自动展开
// @author       贺墨于
// @match        *://*.csdn.net/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/396809/CSDN%20%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396809/CSDN%20%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


var CSDNPluify = {
    gList: [],
    $(obj){
        var elem = document.querySelectorAll(obj)
        elem.css = function(propertyName, value){
            for(var i = 0, len = elem.length; i < len; i++){
                elem[i].style[propertyName] = value
            }
        }
        elem.cssText = function(value){
            for(var i = 0, len = elem.length; i < len; i++){
                elem[i].style.cssText = value
            }
        }
        elem.remove = function(){
            for(var i = 0, len = elem.length; i < len; i++){
                elem[i].remove()
            }
        }
        return elem
    },
    fitContent(){
        this.$('.hide-article-box').remove();
        this.$('#mainBox').css('width','100%');
        this.$('#mainBox main').cssText('width:100% !important');
        this.$('#article_content').css('height','auto');
        setTimeout(function(){
            this.$('.tool-box.vertical').css('right', '33px');
            this.$('div.csdn-side-toolbar').css('right', '33px');
        }, 1000);
    },
    execHidden(){
        for(var i = 0; i < this.gList.length; i++){
            this.hidden(this.gList[i]);
        }
    },
    push(content){
        this.gList.push(content);
    },
    log(msg){
        console.log(msg);
    },
    hidden(obj){
        if(typeof(obj)=== 'string'){
            obj = this.$(obj);
        }
        //obj.remove()
        obj.css('display', 'none')
    },
    init(){
        this.push('.aside-box');
        this.push('.recommend-box');
        this.push('.template-box');
        this.push('.recommend-right');
        this.execHidden();
        this.fitContent();
    }
}

CSDNPluify.init()