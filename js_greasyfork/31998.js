// ==UserScript==
// @name        QQ客服中心消息提醒
// @author      rjw
// @description 显示视频下载链接
// @namespace   com.uestc.rjw
// @icon        http://mat1.gtimg.com/www/icon/favicon2.ico
// @license     Apache Licence V2
// @encoding    utf-8
// @date        20/08/2015
// @modified    20/08/2015
// @include     http://chong.qq.com/pc/seller/v2/index.html
// @include     https://chong.qq.com/pc/seller/v2/index.html
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_notification
// @grant unsafeWindow
// @run-at      document-end
// @version     1.1.0
// @downloadURL https://update.greasyfork.org/scripts/31998/QQ%E5%AE%A2%E6%9C%8D%E4%B8%AD%E5%BF%83%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/31998/QQ%E5%AE%A2%E6%9C%8D%E4%B8%AD%E5%BF%83%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==


/*
 * === 说明 ===
 *@作者:rjw
 *@Email:babyrjw@163.com
 * */
unsafeWindow.document.title = "【　　　】";
var isusing = false;
var newMessageRemind={
    _step: 0,
    _title: document.title,
    _timer: null,
    _msg: "NEW",
    //显示新消息提示
    _show:function(){
        newMessageRemind._timer = setTimeout(function() {
           newMessageRemind._show();
        }, 800);
        newMessageRemind._step++;
        if (newMessageRemind._step == 3) { newMessageRemind._step = 1;}
        if (newMessageRemind._step == 1) { document.title = "【　　　】" + newMessageRemind._msg;}
        if (newMessageRemind._step == 2) { document.title = "【新消息】" + newMessageRemind._msg;}
    },
    show:function(){
        console.log(newMessageRemind._timer);
        if(newMessageRemind._timer !== null)return;
        newMessageRemind._show();
        return [newMessageRemind._timer, newMessageRemind._title];
    },
    //取消新消息提示
    clear: function(){
        clearTimeout(newMessageRemind._timer);
        newMessageRemind._timer = null;
        unsafeWindow.document.title = newMessageRemind._title;
    }
};

function playSound(isPlay){
    if(isPlay){
        audio.play();
    }else{
        audio.pause();
    }
 }
var audio = new Audio("http://dx.sc.chinaz.com/Files/DownLoad/sound1/201409/4942.mp3");

unsafeWindow.document.onclick=function(event){
    event = event || window.event;
    var isone ="";
    if(!document.all){
        isone = event.target.id.toUpperCase();
    }
    else{
        isone = event.srcElement.id.toUpperCase();
    }
    if(isone!=="TEST"){
        isusing = false;
        newMessageRemind.clear();
    }
};

/*
var url_un_bind = "http://chong.qq.com/php/index.php?d=provider&c=main&dc=kf_data&a=getKfList&kfType=&orderType=&emergency=&orderDesc=&orderState=1&personal=&searchStartTime=2017-7-28&searchEndTime=&searchIsp=&searchProvince=&searchSellerUin=&searchOrderId=&searchDealId=&searchMobile=";
var url_un_hand = "http://chong.qq.com/php/index.php?d=provider&c=main&dc=kf_data&a=getKfList&kfType=&orderType=&emergency=&orderDesc=&orderState=7&personal=&searchStartTime=2017-7-28&searchEndTime=&searchIsp=&searchProvince=&searchSellerUin=&searchOrderId=&searchDealId=&searchMobile=";
var url_handle = "http://chong.qq.com/php/index.php?d=provider&c=main&dc=kf_data&a=getKfList&kfType=&orderType=&emergency=&orderDesc=&orderState=6&personal=&searchStartTime=2017-7-28&searchEndTime=&searchIsp=&searchProvince=&searchSellerUin=&searchOrderId=&searchDealId=&searchMobile=";
setInterval(function(){
    $.get(url_un_bind, function(data){
        data = JSON.parse(data);
        if(data.retCode === 0 && data.retMsg.length > 0){
            GM_notification({text:"您有一条新的未认领客服消息需要处理", title:"未认领消息", timeout:30000});
        }
    });
    $.get(url_un_hand, function(data){
        data = JSON.parse(data);
        if(data.retCode === 0 && data.retMsg.length > 0){
             newMessageRemind.show();
             GM_notification({text:"您有一条新的未解决客服消息需要处理", title:"已处理(未解决)消息",timeout:30000});
        }
    });
},5000);
*/

Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
};
var now = new Date();
now.setDate(now.getDate() - 30);
var startDate = now.Format('yyyy-MM-dd');
now.setDate(now.getDate() + 32);
var endDate = now.Format('yyyy-MM-dd');
var url_un_bind = 'https://chong.qq.com/php/index.php?d=providerV3&c=main&dc=kf_data&a=getKfList&kfType=&orderType=&emergency=&orderDesc=&orderState=1&personal=&searchStartTime='+startDate+'&searchEndTime='+endDate+'&searchIsp=&searchProvince=&searchSellerUin=&searchOrderId=&searchDealId=&searchMobile=&pageSize=50&curPage=1';
var url_un_hand = 'https://chong.qq.com/php/index.php?d=providerV3&c=main&dc=kf_data&a=getKfList&kfType=&orderType=&emergency=&orderDesc=&orderState=2&personal=&searchStartTime='+startDate+'&searchEndTime='+endDate+'&searchIsp=&searchProvince=&searchSellerUin=&searchOrderId=&searchDealId=&searchMobile=&pageSize=50&curPage=1';
var url_handle =  'https://chong.qq.com/php/index.php?d=providerV3&c=main&dc=kf_data&a=getKfList&kfType=&orderType=&emergency=&orderDesc=&orderState=5&personal=&searchStartTime=='+startDate+'&searchEndTime='+endDate+'&searchIsp=&searchProvince=&searchSellerUin=&searchOrderId=&searchDealId=&searchMobile=&pageSize=50&curPage=1';
setInterval(function(){
    $.get(url_un_bind, function(data){
        //data = JSON.parse(data);
        if(data.retCode === 0 && data.retMsg.length > 0){
            GM_notification({text:"您有一条新的待认领客服消息需要处理", title:"待认领消息", timeout:30000});
            playSound(true);
        }else{
            playSound(false);
        }
    });
    $.get(url_un_hand, function(data){
        //data = JSON.parse(data);
        if(data.retCode === 0 && data.retMsg.length > 0){
            newMessageRemind.show();
            GM_notification({text:"您有一条新的未处理客服消息需要处理", title:"未处理消息",timeout:30000});
            playSound(true);
        }else{
            playSound(false);
        }
    });
},5000);
setTimeout(function(){
    window.location.reload();
}, 3600000);