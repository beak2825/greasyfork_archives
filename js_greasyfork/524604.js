// ==UserScript==
// @name         脚本插件测试
// @namespace    shenchanran
// @version      0.0.1
// @description  测试脚本插件是否正常运行的脚本，安装后请访问：https://greasyfork.cn/post/6
// @author       申禅姌
// @match        https://greasyfork.cn/post/6
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524604/%E8%84%9A%E6%9C%AC%E6%8F%92%E4%BB%B6%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/524604/%E8%84%9A%E6%9C%AC%E6%8F%92%E4%BB%B6%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    if(unsafeWindow['hivcef']){
        unsafeWindow['hivcef']='7'
    }else{
        unsafeWindow['hivcef']='6'
    }
    let r =  setInterval(()=>{
        let h3s = document.querySelectorAll('h3')
        for(let h3 of h3s){
            if(h3.innerHTML.includes('▶')){
                clearInterval(r)
                if(unsafeWindow['hivcef']=='7'){
                    h3.innerHTML = '▶▶▶请不要同时运行多个脚本插件，或者同时装多个同类型脚本◀◀◀'
                    h3.style.color = 'red'
                }else{
                    h3.innerHTML = '▶▶▶您的脚本插件正常运行◀◀◀'
                    h3.style.color = 'green'
                }
                
            }
        }
    },1000)
})();