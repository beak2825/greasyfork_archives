// ==UserScript==
// @name         哈哈漫画
// @namespace    https://greasyfork.org/zh-CN/scripts/390626
// @version      0.4
// @description  哈哈漫画破解，收费的直接点购买就行了，点击后会直接破解，不用给钱
// @author       qq327100395
// @match        *hhmh8.com/style.html*
// @include      *hhmh8.com/style.html*
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397133/%E5%93%88%E5%93%88%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/397133/%E5%93%88%E5%93%88%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').on('click','.payBtn',function(){
        function isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if(regPos.test(val) || regNeg.test(val)) {
                return true;
            } else {
                return false;
            }
        }
        $('.payNav').remove();
        $('.unpayCover').remove();
        $('.reader-download-notification').remove();
        var img = $('.charpetBox').find('img:last');
        var imgUrl = img.attr('src');
        var urlArr = imgUrl.split('/');
        var endUrlArr = urlArr[urlArr.length-1].split('.');
        urlArr.length = urlArr.length-1;
        imgUrl = urlArr.join('/')+'/';
        var indexArr = endUrlArr[0].split('_');
        var index = 2;
        for(var i=0,len=indexArr.length;i<len;i++){
            if(isNumber(indexArr[i])){
                index = parseInt(indexArr[i]);
                break;
            }
        }
        var _index = index+1;
        console.log(index,_index);
        var addImg = function(res){
              if(res.status == 200){
                  var img = document.createElement("img");
                  img.onload = function(e) {
                    window.URL.revokeObjectURL(img.src);
                  };
                  img.style = 'width:100%';
                  img.src = window.URL.createObjectURL(res.response);
                  $('.charpetBox').append(img);
                  _index++;
                  GM_xmlhttpRequest({
                      method: 'GET',
                      url: imgUrl + endUrlArr[0].replace(index, _index) + '.' + endUrlArr[1],
                      responseType: 'blob',
                      onload: addImg
                  });
                  return;
              }
             console.log('error',indexArr,index,_index);
        }
        console.log(imgUrl + endUrlArr[0].replace(index, _index) + '.' + endUrlArr[1]);
        GM_xmlhttpRequest({
          method: 'GET',
          url: imgUrl + endUrlArr[0].replace(index, _index) + '.' + endUrlArr[1],
          responseType: 'blob',
          onload: addImg
        });
        return false;
    });
})();