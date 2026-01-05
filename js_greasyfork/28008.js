// ==UserScript==
// @name         Bilibili视频地址获取
// @namespace    zhihaofans
// @version      0.1
// @description  try to take over the world!
// @author       zhihaofans
// @match        http://www.bilibili.com/video/*/
// @grant        none
// @require      //cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @require      //cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/28008/Bilibili%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/28008/Bilibili%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
$(document).ready(function(){
    var avid='av'+aid;
    var avid_mn=aid;
    var page=pageno;
    var type='flv';
    var downUrlList=[];
    var tokenB=getToken(avid);
    $.ajax({
        url: 'https://api.bilibili.com/playurl?aid='+avid_mn+'&page='+page+'&platform=html5&quality=4&vtype='+type+'&type=jsonp&token='+tokenB,
        jsonp: "callback",
        dataType: "jsonp",
        success: function( response ) {
            console.log( response );
            var downData=response;
            var mainUrl=downData['durl'][0]['url'];
            var backupUrl=downData['durl'][0]['backup_url'];
            var downUrlList=[];
            downUrlList.push(mainUrl);
            for(var a=0;a<backupUrl.length;a++){
                downUrlList.push(backupUrl[a]);
            }
            console.log(downUrlList);
            addHtmlSth(downUrlList);
        },
        error : function() {
            console.log('getDownUrl:fail');
            addHtmlSth(null);
        }
    });
    console.log('downUrlList:'+downUrlList);
});
function getToken(avId){
    var pcWebS=$('body').html().indexOf('var token = \"')+14;
    if(token!==undefined){
        console.log('token(1):'+token);
        return token;
    }else if(pcWebS>=0){
        var pcWebE=$('body').html().indexOf('\"',pcWebS);
        var tokenA=data.substr(pcWebS,pcWebE-pcWebS);
        console.log('token(2):'+tokenA);
        return tokenA;
    }else{
        var mUrl='/mobile/video/'+avId+'.html';
        $.get(mUrl, function(data) {
            var mWebS=data.indexOf('var token = \'')+14;
            var mWebE=data.indexOf('\'',mWebS);
            var tokenA=data.substr(mWebS,mWebE-mWebS);
            console.log('token(3):'+tokenA);
            return tokenA;
        });
        console.log('token(3):'+null);
        return null;
    }
}
function addHtmlSth(downUrlList){
    $('#app_qrcode_box .t-right-top').html('下载视频');
    $('#app_qrcode_box .t-right-bottom').html('辣鸡B站在线看卡死了');
    if(downUrlList!==null){
        if(downUrlList.length===0){
            $('.qr-info-head').text('找不到下载地址');
        }else{
            $('.qr-info-head').text('共有'+String(downUrlList.length)+'个下载地址');
            $('.qr-bottom').text('手机扫描二维码即可直接下载视频');
            $('#qr_description').html('');
            for(var b=0;b<downUrlList.length;b++){
                $('#qr_description').append('<br><a target="_blank" href="'+downUrlList[b]+'" class="b-btn f">这是下载地址'+String(b+1)+'</div>');
            }
            $('#qr_code > canvas').remove();
            $('#qr_code').qrcode({width: 100,height: 100,text: downUrlList[0]});
        }
    }else{
        $('.qr-info-head').text('获取下载地址失败');
    }
}