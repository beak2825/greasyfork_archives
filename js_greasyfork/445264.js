// ==UserScript==
// @name        美团开店宝-超时自动回复插件-医美版-dianping.com
// @namespace   1933987037@qq.com
// @include     https://g.dianping.com/app/gfe-common-pc-im-merchant/index.html
// @license MIT
// @grant       no
// @version     1.7
// @run-at      document-end
// @description 这是一个刷自动回复率的工具，如果超过指定时间，没有其他客服回复，插件会自动回复指定内容
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/445264/%E7%BE%8E%E5%9B%A2%E5%BC%80%E5%BA%97%E5%AE%9D-%E8%B6%85%E6%97%B6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B6-%E5%8C%BB%E7%BE%8E%E7%89%88-dianpingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/445264/%E7%BE%8E%E5%9B%A2%E5%BC%80%E5%BA%97%E5%AE%9D-%E8%B6%85%E6%97%B6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B6-%E5%8C%BB%E7%BE%8E%E7%89%88-dianpingcom.meta.js
// ==/UserScript==

(function () {

    var shijian=1;//当前对话回复时间默认为1
    var shijians=1;//新对话回复时间默认为1
    var sx=1;//每隔半个小时刷新页面

    xh(shijian,shijians,sx)

    //循环函数
    function xh(shijian,shijians,sx){
        setTimeout(function(){//延迟器
            if(($(".now>div>div").children("div").last().attr("class")!="right")&&($(".now>div>div").children("div").last().attr("class")!="time-content")&&($(".now>div>div").children("div").children("div").last().attr("class")!="right")){//当已读状态下，如果未回同样执行自增
                    shijian=shijian+5;
            }else{
                shijian=1;
            }

            if(document.getElementsByClassName("cue-number")[0]){//判断是否有未读
                shijians=shijians+5;//未读秒数循环自增
                var aa=$('.cue-number').parent().index();
            }else{
                shijians=1;
            }

            sx=sx+5;


            if(shijian>120){//当时间大于120秒执行
                shijian=1;
                    dj();//执行点击回复函数

            }//当时间大于120秒执行

            var tjDate = new Date();
            if(tjDate.getHours()<8||tjDate.getHours()>24){//执行时间
                if(shijian>15){//当时间大于120秒执行
                shijian=1;
                    dj();//执行点击回复函数

            }
            }

            if(aa==''){
                aa=0;
            }

            if(shijian==1&&shijians>80){//当时间大于120秒执行
                document.getElementsByClassName("item-content")[aa].click();//点击查看消息
                shijian=80;

            }//当时间大于120秒执行

            if(shijian==1&&shijians==1&&sx>1800){
                sx=1;
                location.reload()
            }


             xh(shijian,shijians,sx);//递归循环
            $('.shop-name span').html(shijian+'-'+shijians+'-'+sx);
         },5000)
    }

    //回复函数
    function dj(){

         var zhuantai=$(".now>div>div").children("div").last().attr("class");//获取当前状态,right为已回，其他未回
                if(zhuantai!="right"){
                    var myDate = new Date();
                    if(myDate.getHours()<8||myDate.getHours()>21){//执行时间
                        $("#iconInput").html('您好，夜间客服不在线，如需预约可提供姓名+电话+项目+方便接听电话时段，我们将会在指定时间与您联系。');//输入框改变
                    }else{
                        $("#iconInput").html('您好，客服正忙，请稍等片刻。');
                    }
                    document.getElementsByClassName("send-button")[0].click(); //提交回复
                }

    }



})();
