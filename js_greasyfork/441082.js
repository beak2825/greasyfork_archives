// ==UserScript==
// @name         豆瓣批量已读工具
// @namespace    https://douban.com/
// @version      0.1
// @description  在豆瓣列表页面快速标注已读收藏
// @author       不能放过孩子
// @license MIT
// @match        *.douban.com/typerank*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441082/%E8%B1%86%E7%93%A3%E6%89%B9%E9%87%8F%E5%B7%B2%E8%AF%BB%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/441082/%E8%B1%86%E7%93%A3%E6%89%B9%E9%87%8F%E5%B7%B2%E8%AF%BB%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(".collection_add{position:  absolute;right:  0;bottom: 0;}"));
style.appendChild(document.createTextNode(".collection_remove{position:  absolute;right:  0;bottom: 0;}"));
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);
    function collection_add(_film_id){
        return function(){
             console.log("_film_id:"+_film_id);
             //delete(this.parentNode.parentNode.id);
             var action_url = 'https://movie.douban.com/j/subject/'+_film_id+'/interest';
             var post_data = new FormData();
             post_data.append('ck','BjvI');
             post_data.append('interest','collect');
             post_data.append('foldcollect','F') ;
             post_data.append('tags','');
             post_data.append('comment','');
             post_data.append('private',false) ;
             var XHR = new XMLHttpRequest();
             var FD  = new FormData();

             // 把我们的数据添加到这个FormData对象中
             //for(name in data) {
             //    FD.append(name, data[name]);
             // }

             // 定义数据成功发送并返回后执行的操作
             XHR.addEventListener('load', function(event) {
                 console.log('Yeah! 已发送数据并加载响应。');
                 console.log(event);
                 var btn_id = 'collection_'+_film_id;
                 var btn = document.getElementById(btn_id);
                btn.innerHTML= "取消收藏："+_film_id;
                btn.onclick =collection_remove (_film_id);
             });

             // 定义发生错误时执行的操作
             XHR.addEventListener('error', function(event) {
                 alert('Oops! 出错了。');
             });

             // 设置请求地址和方法
             XHR.open('POST',action_url);

             // 发送这个formData对象,HTTP请求头会自动设置
             XHR.send(post_data);
        }

    }

    function collection_remove(_film_id){
        return function(){
             console.log("_film_id:"+_film_id);
             //delete(this.parentNode.parentNode.id);
            // var action_url = 'https://movie.douban.com/j/subject/'+_film_id+'/interest';
             var action_url = 'https://movie.douban.com/subject/'+_film_id+'/remove';

             var post_data = new FormData();
             post_data.append('ck','BjvI');
             //post_data.append('interest','collect');
             //post_data.append('foldcollect','F') ;
             //post_data.append('tags','');
             //post_data.append('comment','');
             //post_data.append('private',false) ;
             var XHR = new XMLHttpRequest();
             var FD  = new FormData();

             // 把我们的数据添加到这个FormData对象中
             //for(name in data) {
             //    FD.append(name, data[name]);
             // }

             // 定义数据成功发送并返回后执行的操作
             XHR.addEventListener('load', function(event) {
                 console.log('Yeah! 已发送数据并加载响应。');
                 console.log(event);
                   var btn_id = 'collection_'+_film_id;
                 var btn = document.getElementById(btn_id);
                 btn.innerHTML= "点击收藏："+_film_id;
                 btn.onclick =collection_add (_film_id);
             });

             // 定义发生错误时执行的操作
             XHR.addEventListener('error', function(event) {
                 alert('Oops! 出错了。');
             });

             // 设置请求地址和方法
             XHR.open('POST',action_url);

             // 发送这个formData对象,HTTP请求头会自动设置
             XHR.send(post_data);
        }

    }

    setTimeout(function(){
        var listDomByClass = document.getElementsByClassName('pictext');
        var listDom = listDomByClass[0];
        var film_id_arr = [];
        var domChildNodes = listDom.childNodes;

        for(var i = 0; i < domChildNodes.length;i++){
            var _film_url = domChildNodes[i].getElementsByTagName("a")[0].href;
            var _film_id =_film_url.match(/[0-9]+/)[0];
            var btn =document.createElement("button");
            btn.id  = 'collection_'+_film_id;
            if(domChildNodes[i].className.indexOf('unwatched')== -1){
                btn.innerHTML= "取消收藏："+_film_id;
                btn.onclick =collection_remove (_film_id);
                btn.className  = 'collection_remove';
            }else{
                btn.innerHTML= "点击收藏："+_film_id;
                btn.onclick =collection_add (_film_id);
                btn.className  = 'collection_add';

            }
            domChildNodes[i].appendChild(btn);
        }


        // Your code here...
    },3000);

})();