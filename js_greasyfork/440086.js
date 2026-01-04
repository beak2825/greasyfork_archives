// ==UserScript==
// @name         javlib信息复制
// @description  复制javlib页面的影片信息
// @match        *://www.e59f.com/*
// @grant        GM_setClipboard
// @version 0.0.1.30220215161130
// @namespace https://greasyfork.org/users/857018
// @downloadURL https://update.greasyfork.org/scripts/440086/javlib%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440086/javlib%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.querySelectorAll('h3.post-title.text').forEach(element => {

        let btn = document.createElement('button')
        btn.innerText = '复制'
        element.before(btn)
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        tr.appendChild(btn);
        tr.appendChild(td);
        td.innerText = element.innerText


        element.before(tr)
        element.remove()
        btn.addEventListener('click',(e)=>{
        e.preventDefault()
        GM_setClipboard(element.innerText)
        })

      });
})();

(function() {
    'use strict';
    document.querySelectorAll('div.id').forEach(element => {

        let btn = document.createElement('button')
        btn.innerText = '复制'
        element.before(btn)
          var tr = document.createElement("tr");
          var td = document.createElement("td");
          tr.appendChild(td);
          td.innerText = element.innerText
          tr.appendChild(btn);

        element.before(tr)
        element.remove()
        btn.addEventListener('click',(e)=>{
          e.preventDefault()
          GM_setClipboard(element.innerText)
        })

      });
})();


(function() {
    'use strict';
    let element = document.querySelectorAll('.item .text')

        let btn = document.createElement('button')
        btn.innerText = '复制'
        element[0].before(btn)

      btn.addEventListener('click',(e)=>{
        e.preventDefault()
        GM_setClipboard(element[0].innerText)

    });

})();

(function() {
    'use strict';
    let element = document.querySelectorAll('.item .text')

        let btn = document.createElement('button')
        btn.innerText = '复制'
        let x = element.length
        element[x-1].before(btn)

      btn.addEventListener('click',(e)=>{
        e.preventDefault()
        GM_setClipboard(element[x-1].innerText)

    });

})();



(function() {
    'use strict';
    let element = document.querySelectorAll('.item .text')

      let btn = document.createElement('button')
      btn.innerText = '搜索'
      element[0].after(btn)

      btn.addEventListener('click',(e)=>{
        e.preventDefault()
//        GM_setClipboard(element.innerText)
        let movieid = element[0].innerText;
          var website = "https://btsow.rest/search/"
        let fulllink = website+movieid
        window.open(fulllink)

    });


})();