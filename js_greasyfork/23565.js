// ==UserScript==
// @name         显示QQ相册文件名
// @namespace    https://greasyfork.org/zh-CN/users/41249-tantiancai
// @version      0.5
// @description  显示QQ相册的文件名
// @author       Tantiancai
// @match        http://qun.qzone.qq.com/group#!/*/photo
// @grant        none
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/23565/%E6%98%BE%E7%A4%BAQQ%E7%9B%B8%E5%86%8C%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/23565/%E6%98%BE%E7%A4%BAQQ%E7%9B%B8%E5%86%8C%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var g_tk = '957550476';
    var picKey='V3tzB4tEG5pGViMgDcj';
    var topicId='271392460_V10127MM2Vb51c';
    var isFirst = 1;
    var offset = 0;


    function area_test_jsonp(url){
        jQuery.ajax({
            url: url,
            dataType: 'jsonp',
            type: 'get',
            jsonpCallback: 'viewer_Callback',
            success: function(obj) {
                console.log('ok');
                if(obj.data.first){
                    isFirst = 0;
                }
                for(var i = 0; i < obj.data.photos.length; i++){
                    var photo = obj.data.photos[i];
                    picKey = photo.picKey;
                    //console.log(photo.name + '|' + photo.exif.originalTime);
                    console.log(photo.name + '|' + photo.url);
                }
                setTimeout(getPhoto,2000);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error');
                console.log(XMLHttpRequest.responseText);
            }
        });
    }
    function getPhoto(){
        var url = 'http://h5.qzone.qq.com/proxy/domain/u.photo.qzone.qq.com/cgi-bin/upp/qun_floatview_photo?g_tk=$g_tk$&callback=viewer_Callback&t=931789420&topicId=$topicId$&picKey=$picKey$&shootTime=&cmtOrder=1&fupdate=1&plat=qzone&source=qzone&cmtNum=10&likeNum=5&inCharset=utf-8&outCharset=utf-8&callbackFun=viewer&offset=$offset$&number=20&uin=229547798&appid=421&isFirst=$First$&hostUin=229547798&sortOrder=3&showMode=1&prevNum=0&postNum=20&_=1474211990808';  
        url = url.replace('$g_tk$', g_tk);
        url = url.replace('$picKey$',picKey );
        url = url.replace('$topicId$', topicId);
        url = url.replace('$First$', isFirst);
        url = url.replace('$offset$', offset);
        area_test_jsonp(url);
    }
    getPhoto();
})();