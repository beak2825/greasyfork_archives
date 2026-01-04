// ==UserScript==
// @name         百度搜索拉黑指定网站
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自由拉黑搜索结果，避免垃圾网站
// @author       ChuckRay
// @match        https://www.baidu.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/458160/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8B%89%E9%BB%91%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/458160/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8B%89%E9%BB%91%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function debounce(fn,wait){
        var timer = null;
        return function(){
            if(timer !== null){
                clearTimeout(timer);
            }
            timer = setTimeout(fn,wait);
        }
    }
    const addBlackList = (url,dom)=>{
        const _url = prompt('拉黑含有以下字符的网站',url )
        if(!_url) return;
        const listStr = (localStorage.getItem('blackList')|| '').replace(/[\[\]]/g,'');
        const list = listStr? Array.from(new Set(listStr.split(','))):[];
        list.push(url);
        dom.remove();
        // console.log(list);
        localStorage.setItem('blackList',list.join(','))
    }
    const build = (url,dom)=>{
        const a = document.createElement('span');
        a.addEventListener("click", ()=>{
            addBlackList(url,dom);
        });
        a.innerText = ('拉黑');
        a.style.color = 'orange';
        a.className = 'addBlackBtn';
        return a;
    }
    const renderBtn = ()=>{
        console.log('renderBtn start');
        document.querySelectorAll(".addBlackBtn").forEach(v=>v.remove());
        const listDom = document.querySelector("#content_left");
        const listListDom = listDom.children;
        const listStr = (localStorage.getItem('blackList')|| '').replace(/[\[\]]/g,'');
        const blackList = listStr? Array.from(new Set(listStr.split(','))):[];
        for(let i=0;i<=listListDom.length;i++){
            let v = listListDom[i];
            if(!v) return;
            const mu = v.getAttribute('mu');
            if(!mu){
             v.remove();
            }
            v.append(build(mu,v));
            blackList.forEach(blaickUrl=>{
                if(blaickUrl.includes(mu)){
                    v.remove();
                    i--;
                }
            })
        }
    };
    var _wr = function(type) {
        var orig = history[type];
        return function() {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    const delayRenderBtn = ()=>{
        console.log('renderBtn ->');
        setTimeout(()=>{ console.log('renderBtn time'); renderBtn();},2000);
        setTimeout(()=>{ console.log('renderBtn time'); renderBtn();},5000);
    }
    window.addEventListener('hashchange',()=>{
        delayRenderBtn();
    });
    window.addEventListener('popstate',()=>{
        delayRenderBtn();
    })
    window.addEventListener('replaceState', ()=>{
        delayRenderBtn();
    });
    window.addEventListener('pushState', ()=>{
        delayRenderBtn();
    });
    window.onload=()=>{renderBtn();}

})();