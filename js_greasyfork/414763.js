// ==UserScript==
// @name         b站空间页面链接收集器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  (只是打印出来到控制台）
// @author       Zszen
// @match        https://space.bilibili.com/*/vide*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414763/b%E7%AB%99%E7%A9%BA%E9%97%B4%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/414763/b%E7%AB%99%E7%A9%BA%E9%97%B4%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('===抓取所有link z===');
    var tryTimes = 10;
    setTimeout(initMe,500);
    function initMe() {
        var arr = findTags('li', null, 'small-item fakeDanmu-item', null);
        if(arr.length==0 && tryTimes-->0){
            setTimeout(initMe , 500);
            return;
        }
        var links = [];
        for(const unit in arr){
            var a = findTag('a',null,null,null,arr[unit]);
            if(a==null) continue;
            links.push(a.href);
        }
        console.log(links);
    }


    function findTags(tagName,id,className,properties, _parent){
        let pool = [];
        if(_parent==null){
            _parent = document;
        }
        let tags = _parent.getElementsByTagName(tagName)
        for (const unit of tags) {
            if(id!=null && unit.id!=id){
                continue;
            }
            if(className!=null && unit.className!=className){
                continue;
            }
            //console.log(unit.className);
            if(properties!=null){
                let isPass = true;
                for (const key in properties) {
                    if(!unit.hasAttribute(key)){
                        isPass = false;
                        break;
                    }else if(properties[key] && unit.getAttribute(key)!=properties[key]){
                        isPass = false;
                        break;
                    }
                }
                if(!isPass){
                    continue;
                }
            }
            pool.push(unit);
        }
        return pool;
    }

    function findTag(tagName,id,className,properties, _parent){
        // let pool = [];
        if(_parent==null){
            _parent = document;
        }
        //console.log(_parent);
        let tags = null;
        try{
            tags = _parent.getElementsByTagName(tagName)
        }catch(err){
                return tags;
        }
        for (const unit of tags) {
            if(id!=null && unit.id!=id){
                continue;
            }
            if(className!=null && unit.className!=className){
                continue;
            }
            if(properties){
                let isPass = true;
                for (const key in properties) {
                    if(!unit.hasAttribute(key)){
                        isPass = false;
                        break;
                    }else if(properties[key] && unit.getAttribute(key)!=properties[key]){
                        isPass = false;
                        break;
                    }
                }
                if(!isPass){
                    continue;
                }
            }
            return unit;
            // pool.push(unit);
        }
        // return pool;
    }
    // Your code here...
})();