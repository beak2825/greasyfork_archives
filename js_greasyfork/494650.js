// ==UserScript==
// @name         仓库新旧版本联动
// @namespace    http://wcx19911123.org/
// @version      0.2
// @description  智能回转库新旧版本联动!
// @author       wcx19911123
// @match        http://192.168.100.201:9902/*.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100.201
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494650/%E4%BB%93%E5%BA%93%E6%96%B0%E6%97%A7%E7%89%88%E6%9C%AC%E8%81%94%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494650/%E4%BB%93%E5%BA%93%E6%96%B0%E6%97%A7%E7%89%88%E6%9C%AC%E8%81%94%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ip = '192.168.100.222';
    //let ip = '127.0.0.1';
    let debug = false;
    let urlMenu = new URLSearchParams(window.location.search).get('menu');
    if(urlMenu){
        localStorage.setItem('openedPage', urlMenu);
    }
    let newList = '添加入库单，入库单管理，添加出库单，出库单管理，产品库存台账，物料库存台账，物料管理，产品管理'.split('，');
    let eventId = setInterval(function(){
        debug && console.log('interval start');
        let menu = document.querySelectorAll('#sideMenu a[menu-title]');
        if(menu && menu.length > 6){
            debug && console.log('find menu list, clear interval');
            clearInterval(eventId);
            let openedPage = localStorage.getItem('openedPage');
            for(let i = 0; i < menu.length; i++){
                let name = menu[i].getAttribute('menu-title');
                if(newList.includes(name)){
                    debug && console.log('fix menu click');
                    menu[i].onclick = function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        if(window.opener){
                            window.opener.postMessage(`http://${ip}:9902/index.html?menu=`+encodeURI(name), '*');
                        }else{
                            location.href = `http://${ip}:9902/parent.html`;
                        }
                        return false;
                    };
                }
                if(name == openedPage){
                    menu[i].click();
                }
            }
        }
    }, 100);
})();