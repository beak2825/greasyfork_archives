// ==UserScript==
// @name         试客巴折扣试用直接兑换
// @namespace    http://ziyuand.cn
// @version      0.3
// @description  折扣试用直接兑换
// @author       SJHERWIN
// @match        https://wx.shike8888.com/user/discountDetail?aid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430725/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E7%9B%B4%E6%8E%A5%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/430725/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E7%9B%B4%E6%8E%A5%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>')
$('.goods_name').after('<p style="width:200px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="qianggou" >一键抢购</p>');
     //get参数获取程序
    function getUrlParam (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };
 if (typeof(aid) == "undefined"){
        var aid=getUrlParam('aid');
    }
    $('#qianggou').on("tap",function(event){
            $.ajax({
                url: '/discount/receive',
                data: {actId: aid},
                type: 'get',
                dataType: 'json',
                success: function(res){
                    if(res.code === 1){
                        mui.toast('抢购成功！',function(){
                            window.location.href = '/tryUse/newTrialTask?type=2';
                        })

                    }else{
                        mui.toast(res.msg||'抢购失败，请重试');
                    }
                },
                error: function(){
                    mui.toast('抢购失败，请重试');
                }
            })
    });
    //点击价格复制aid
    $('.order_amount').on("tap",function(event){
        new Clipboard(this, {
            text: function() {
                 mui.toast('复制ID成功',{ duration:'short', type:'div' });
                return aid;
            }
        });
    });


     $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(res){

            $('#qianggou').after('<br><p style="text-align:center;"><a id="tiaozhuan" style="font-size:0.4rem;color:#f10180;z-index:999;" href="'+res.activityDto['product_link']+'" target="_blank"><b>【点我打开链接】</b></a></p>');


            $("#tiaozhuan").off().on('tap',function(){
                console.log(this);
                window.location.href=product_link;

            });

        },'json');

    // Your code here...
})();