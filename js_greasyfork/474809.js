// ==UserScript==
// @name     foreverblog.cn首页直接显示各博客地址
// @grant    none
// @description  首页直接展示信息，无需点进详情页
// @author       Damon
// @match       *://*.foreverblog.cn/*
// @namespace  *://*.foreverblog.cn/*
// @license MIT
// @version 1.0.0 
// @downloadURL https://update.greasyfork.org/scripts/474809/foreverblogcn%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%90%84%E5%8D%9A%E5%AE%A2%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/474809/foreverblogcn%E9%A6%96%E9%A1%B5%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%90%84%E5%8D%9A%E5%AE%A2%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==


(function() {
   if (window.location.href.indexOf("foreverblog.cn") != -1){
     var box = {};
     var count = 0;

   function fetchData(url,aElement) {
        fetch(url).then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text()
        }).then(data =>{
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const element = (doc.querySelectorAll('.linkbtn')[0]).parentNode;
            doc.querySelectorAll('.linkbtn')[0].innerText = element.href;
            if (element) {
                const innerHTML = element.innerHTML;
                var newElement = document.createElement('div');
                newElement.setAttribute("style","border-radius:10px;padding:2px;font-size:14px");
                newElement.appendChild(element);
                aElement.parentNode.setAttribute("style", "flex-wrap: wrap;display: inline-flex;align-content: flex-end;margin: inherit;margin-top:10px;");
                aElement.insertAdjacentElement("afterend", newElement)

            } else {
                console.log('Element with id "pangu" not found.')
            }
        }).
        catch(error =>{
            console.error('Error:', error)
        })
    }

    	setInterval(function(){

           	 var aElements = document.querySelectorAll('.item');
       			 if (count >= aElements.length){
               return;
             }
        		count = aElements.length;

            // document.head.insertAdjacentHTML("beforeend", csss); // 将HTML代码追加到目标节点的结尾
            aElements.forEach(function(aElement) {
                var href = aElement.getAttribute('href');
              	if (box[href] == undefined ){
                	box[href] = 1;
                  var url = href;
                  console.log(url);
                  fetchData(url,aElement);
                }

            });


      }, 1000);





   }

})();