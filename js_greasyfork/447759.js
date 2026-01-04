// ==UserScript==
// @name         禅道开源版批量创建子任务
// @namespace    https://github.com/iquyi
// @version      0.2
// @description  禅道-地盘-我的任务-批量创建子任务-去除disabled
// @author       water
// @match        http://*/zentao/my-work-task.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447759/%E7%A6%85%E9%81%93%E5%BC%80%E6%BA%90%E7%89%88%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E5%AD%90%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/447759/%E7%A6%85%E9%81%93%E5%BC%80%E6%BA%90%E7%89%88%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E5%AD%90%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function bindClose (e){
        e.target.removeEventListener('click', bindClose, false)
        setTimeout(()=>{
            var ifel = document.getElementById('iframe-triggerModal')
            if(!ifel) return;
            var closebtn = ifel.contentDocument.getElementById('closeModal')
            if(!closebtn) {
                var timer = setInterval(()=>{
                    closebtn = ifel.contentDocument.getElementById('closeModal')
                    if(closebtn) {
                        clearInterval(timer)
                        closebtn.addEventListener('click', closeOnClick, false)
                    }
                }, 500)
                } else closebtn.addEventListener('click', closeOnClick, false)
            function closeOnClick (){
                closebtn.removeEventListener('click', closeOnClick, false)
                setTimeout(()=>{
                    deteleDisabled()
                },1000)
            }

        },1000)
    }

    function deteleDisabled(){
        var elsitem = document.querySelectorAll('a[title="子任务"]');
        var els = document.querySelectorAll('td.c-actions')
        var nodes = Array.from(els)
        if(!nodes.length) return;
        nodes.forEach((i,idx)=>{
            if(i){
                elsitem[idx].removeAttribute('disabled')
                i.addEventListener('click', bindClose, false)
                nodes = []
            }
        })
    };

    deteleDisabled()
})();