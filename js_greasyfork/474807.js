// ==UserScript==
// @name     dalao.net首页帖子摘要显示
// @version  1
// @grant    none
// @description  首页直接展示信息，无需点进详情页
// @author       Damon
// @match       *://dalao.net/*
// @namespace  *://dalao.net/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474807/dalaonet%E9%A6%96%E9%A1%B5%E5%B8%96%E5%AD%90%E6%91%98%E8%A6%81%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/474807/dalaonet%E9%A6%96%E9%A1%B5%E5%B8%96%E5%AD%90%E6%91%98%E8%A6%81%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


(function() {
   if (window.location.href.indexOf("dalao.net") != -1){
   function fetchData(url,liElement) {
        fetch(url).then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text()
        }).then(data =>{
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const element = doc.getElementById('pangu');
            if (element) {
                const innerHTML = element.innerHTML;
                var newElement = document.createElement('div');
                var subElement = document.createElement('div');
                subElement.innerHTML = innerHTML; // 设置新元素节点的内容
                newElement.appendChild(subElement);
                // 设置div元素的样式
                // newElement.style.border = "5px solid black";
                liElement.setAttribute("style","border-bottom:1px dashed #7b8adf;border-top:1px solid #7b8adf;border-left:1px solid #7b8adf;border-right:1px solid #7b8adf;padding:5px;border-radius:5px 5px 0px 0px");
                newElement.setAttribute("style","border-bottom:1px solid #7b8adf;border-left:1px solid #7b8adf;border-right:1px solid #7b8adf;margin-bottom:20px;padding:5px;max-height:450px;overflow:hidden;border-radius:0px 0px 5px 5px");
                liElement.insertAdjacentElement("afterend", newElement)

            } else {
                console.log('Element with id "pangu" not found.')
            }
        }).
        catch(error =>{
            console.error('Error:', error)
        })
    }

    var liElements = document.querySelectorAll('li.media.thread.tap');
    // document.head.insertAdjacentHTML("beforeend", csss); // 将HTML代码追加到目标节点的结尾
    liElements.forEach(function(liElement) {
        var href = liElement.getAttribute('data-href');
        var url = "https://dalao.net/" + href;
        console.log(url);
        fetchData(url,liElement);
    });

   }

})();