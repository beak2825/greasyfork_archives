// ==UserScript==
// @name         Clouddrive批量获取下载地址
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  这个脚本是作者自己为了偷懒而写的
// @author       沈闲
// @match        *://192.168.8.188:9798/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438465/Clouddrive%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/438465/Clouddrive%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

$(document).ready(function() {
		$(document).keydown(function(event){//调用键盘编码，按了键盘回调keydown里的function(event)函数，event就是你按的那个按键的code码
             //判断是否正在输入文本，如果是的话，就不触发
            //按D触发
            if (event.keyCode == 68){
               var urls = new Array();
                root_url = window.location.href
                root_url = root_url.replace('?a=1','/')
                url_value = root_url.split('#/')
                now_url = url_value[0] + 'static/' + url_value[0].replace('http://','http/') + 'False/' + url_value[1].replaceAll('/','%2F')
            $('.row').children('div').each(function(){
                console.log($(this).attr('id'));
                //如果出现未定义说明是分隔符，也就说明之前的都是文件夹，那就直接删除urls里的内容
                if (typeof($(this).attr('id')) =="undefined")
                {
                urls.length = 0
                return true;
                }
                title = $(this).attr('id').replace('ID_','')
                url = now_url + encodeURI(title)
                urls.push(url)
  });
                //urls.reverse();
                const elem = document.createElement('textarea');
                elem.value = urls.join('\n');
                document.body.appendChild(elem);
                elem.select();
                document.execCommand('copy');
                document.body.removeChild(elem);
                alert('地址获取成功.')
            };
        });
});