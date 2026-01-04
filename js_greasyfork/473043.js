// ==UserScript==
// @name         抽奖记录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  scboy论坛，一键抽奖
// @author       芦荟
// @match        https://www.scboy.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scboy.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473043/%E6%8A%BD%E5%A5%96%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/473043/%E6%8A%BD%E5%A5%96%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {

    'use strict';
     function updateRollThreads() {
         var titleElement = document.querySelector('head > title');
            var titleText = titleElement.textContent;

        var existingRollThreads = localStorage.getItem('rollthreads');

        if (!existingRollThreads) {
            localStorage.setItem('rollthreads',window.location.href);
              localStorage.setItem(currentURL,titleText)

        } else {
            existingRollThreads += ',' + currentURL;
            localStorage.setItem('rollthreads', existingRollThreads);
            localStorage.setItem(currentURL,titleText)
        }
    }

 function deleteRollThreads() {

    var existingRollThreads = localStorage.getItem('rollthreads');
    if (existingRollThreads) {
        var currentURL = window.location.href;
        var urls = existingRollThreads.split(',');
        var updatedUrls = urls.filter(function(url) {
            return url !== currentURL;
        });
        localStorage.removeItem(currentURL)
        localStorage.setItem('rollthreads', updatedUrls.join(','));
    }
}


    var isCollected = false;
    function toggleCollection(){
        isCollected = !isCollected
    }
    function updatelist(begin, end ,newDiv){
            var olElement = document.createElement('ol');
            var existingRollThreads = localStorage.getItem('rollthreads');
            var urls = existingRollThreads.split(',');
            if(begin >= 0 && begin < urls.length ){
                end = end > urls.length ? urls.length :end
              for (var i = begin; i < end; i++) {
               var liElement = document.createElement('li');
               var title = localStorage.getItem(urls[i])
               var aElement = document.createElement('a');
               aElement.href = urls[i];
               aElement.textContent = title;
               liElement.appendChild(aElement);
               olElement.appendChild(liElement);
           }
            }
return olElement
    }

    var currentURL = window.location.href;
    if (currentURL.includes('?forum-')){
        var targetElement = document.querySelector('#body > div > div > div.col-lg-3.d-none.d-lg-block.aside');

        if (targetElement) {
            var newDiv = document.createElement('div');
            newDiv.id = 'rollboard';
            newDiv.className = 'card';
            var h5Element = document.createElement('h5');
            h5Element.textContent = '参与的抽奖:';
            newDiv.appendChild(h5Element);
            var begin = 0;
            newDiv.appendChild( updatelist(begin, begin + 10, newDiv))
            var clearbutton = document.createElement('button');
             clearbutton.className = 'btn btn-danger';
             clearbutton.textContent = '清除全部收藏';
             clearbutton.addEventListener('click', function(){
                 localStorage.clear()

             })

            var backbutton = document.createElement('button');
             backbutton.className = 'btn btn-primary'; // Change to red
             backbutton.textContent = '上一页';
             backbutton.addEventListener('click', function(){
                 if(begin - 10 >= 0){
                    begin = begin - 10;
                    var olElement =newDiv.querySelector('ol')
                    newDiv.replaceChild(updatelist(begin, begin + 10, newDiv), olElement);
                 }


             })

             var nextbutton = document.createElement('button');
             nextbutton.className = 'btn btn-primary'; // Change to red
             nextbutton.textContent = '下一页';
             nextbutton.addEventListener('click', function(){
                   var existingRollThreads = localStorage.getItem('rollthreads');
                   var urls = existingRollThreads.split(',');
                   if(begin + 10 < urls.length){
                     begin = begin + 10;
                    var olElement =newDiv.querySelector('ol')
                    newDiv.replaceChild(updatelist(begin, begin + 10, newDiv), olElement);
                  }
             })
            newDiv.appendChild(backbutton);
            newDiv.appendChild(nextbutton);
            newDiv.appendChild(clearbutton);
            // Insert the new <div> element inside the target element
            targetElement.appendChild(newDiv);
        }
    }
    else if (currentURL.includes('?thread-')){
        var threadTargetElement = document.querySelector('#body > div > div > div.col-lg-9.main > div.card.card-thread > div > div.media > div > h4 ');
        if (threadTargetElement) {
            var buttonDiv = document.createElement('div');
            buttonDiv.className = 'my-button-div'; // Add your custom class for styling
            // Create a <button> element with Bootstrap classes
            var buttonElement = document.createElement('button');
            var store = localStorage.getItem('rollthreads');
            if (store && store.split(',').includes(currentURL)) {
                buttonElement.className = 'btn btn-danger'; // Change to red
                    buttonElement.textContent = '取消收藏'; // Change text
                    isCollected = true
            }else{ buttonElement.className = 'btn btn-primary'; // Use Bootstrap classes
            buttonElement.textContent = '自动回复参与抽奖'; // Set button text
                 }
            buttonElement.addEventListener('click', function() {
                // 切换按钮状态和样式
                toggleCollection();
                if (isCollected) {
                    buttonElement.className = 'btn btn-danger'; // Change to red
                    buttonElement.textContent = '取消收藏'; // Change text
                    var tid=window.location.href.slice(window.location.href.indexOf("thread")+7,window.location.href.indexOf(".htm"))
                   $.post("?post-create-"+tid+"-1.htm",{
                       'doctype':1,
                       'return_html':0,
                       'quotepid':0,
                       'message':'[png:sb:1]' //

                   }, function(data, status) {
                       // ... 在请求完成后的回调函数中处理响应
                       location.reload()

                    });
                } else {
                    buttonElement.className = 'btn btn-primary'; // Change back to default
                    buttonElement.textContent = '自动回复参与抽奖'; // Change text

                }
                if (isCollected) {
                    updateRollThreads();
                } else {
                  deleteRollThreads();
                }
            });

            // Append the button element to the button <div>
            buttonDiv.appendChild(buttonElement);
            // Insert the button <div> inside the thread target element
            threadTargetElement.appendChild(buttonDiv);
        }
    }
})();
