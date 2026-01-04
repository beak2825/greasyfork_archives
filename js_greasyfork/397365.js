// ==UserScript==
// @name         京东抢购助手
// @version      0.0.5
// @namespace    京东
// @description  京东抢购助手，可以抢购任何商品，比如小米9、IQOO等，超强直接下单！
// @require http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        *://item.jd.com/*.html*
// @match        *://*.m.jd.com/*
// @match        *://m.jd.com/*
// @match        *://wqs.jd.com/*
// @match        *://wq.jd.com/*
// @match        *://wqdeal.jd.com/*
// @grant        GM_xmlhttpRequest
// @connect      jd.com
// @downloadURL https://update.greasyfork.org/scripts/397365/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397365/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var host = window.location.host;
var start_time;//抢购开始时间
var bwtime;//前置时间
var delayTime;//请求时间
var item =1;//提交次数
var Attribute_tag='';
var remaining_time=0;//剩余等待时间
var current_time;//当前时间
var aside_btn="展开";//侧边栏名称
var mod_aside_v2=true;//侧边栏收起
var Interval;//抢购等待定时循环任务
var Timeout=false;
var title = $("title").text();//获取页面标题

//侧边栏CSS样式
function menusCss(){
    var confirmCss='<style type="text/css">.mod_aside_v2{position:fixed;margin-bottom:constant(safe-area-inset-bottom);margin-bottom:env(safe-area-inset-bottom);left:0}.mod_aside_v2.unfold .mod_aside_v2_mask{display:none}.mod_aside_v2.anim .mod_aside_v2_mask{opacity:0}.mod_aside_v2.anim .mod_aside_v2_nav_btn::before{-webkit-transform:rotate(-180deg);transform:rotate(-180deg)}.mod_aside_v2.anim .mod_aside_v2_nav{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.mod_aside_v2_mask{position:fixed;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,.3);opacity:1;-webkit-transition:opacity .3s;transition:opacity .3s}.mod_aside_v2_nav{position:absolute;bottom:0;right:0;width:260px;padding:15px 0 5px;background:#fff;border-radius:4px 0 0 4px;min-height:80px;z-index:1;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}.mod_aside_v2_nav_item span{display: inline-block; padding: 0 5px; min-width: 10px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; height: 30px; line-height: 30px; float: left; text-align: center; margin-left: 5px; margin-bottom: 5px; border-radius: 4px; color: #333; background-color: #f7f7f7; font-size: 9pt;}.mod_aside_v2_nav_btn{width:45px;height:40px;background:rgba(0,0,0,.7);position:absolute;right:-45px;top:50%;margin-top:-20px;border-radius:4px 0 0 4px}.mod_aside_v2_nav_btn:before{content:"";position:absolute;left:2px;top:50%;width:20px;height:20px;margin-top:-10px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA5UExURUdwTP///////////////////////////////////////////////////////////////////////308lk0AAAATdFJOUwBJVIgXCSghN2h25abRt9vGffS7coOoAAAArUlEQVQ4y+3TSw7DIAwE0GCCsfmT+x82rYqzy6jLVopXLJ6AMWbbnvqXCj7ZMu4IzuLNMYKplbiccLh3Opp8ViwCHNXh1n5OwMGuV12OXLx3kvsKsivJveOcS1hOgYv9aJcjEKQedV0/TQXuBYv1chJ6kpgPi5LQFd+hs1poZSRd7tZuJTgQ1IdcDUd5Nq1tPQg7gXKOsttQMJS++WAy4gEvNuEMB/f7r/DUb9QJXqoEvlc8Su4AAAAASUVORK5CYII=) no-repeat 0 0;background-size:100%}.mod_aside_v2_nav_btn i{color:#fff;font-size:10px;width:2.2em;line-height:1.3em;position:absolute;top:50%;left:20px;-webkit-transform:translateY(-50%);transform:translateY(-50%)} .fromTime{margin-bottom:10px;height:30px;margin-left: 10px}.fromTime input{border-style: solid;border-color: #f7f7f7;margin-left: 10px;width: 160px;height: 20px;} #btnStart{width:200px;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 14px;cursor: pointer;background-color: #f44336;margin: 0 30px;margin-bottom: 10px;}</style> '
    $("body").append(confirmCss)
}
//时间-侧边栏html代码
function setTimeHtml() {
    var setTime = '<div class="mod_aside_v2 unfold anim" style="bottom: 60px;z-index:500"><div class="mod_aside_v2_mask"></div> <div class="mod_aside_v2_nav"><div class="mod_aside_v2_nav_btn" data-tag="openNav"><i data-tag="openNav">抢购</i></div><div class="TimeData"> <div class="fromTime"><label>抢购时间:</label><input type="datetime-local" name="startTime" id="datetime-local" value="" /></div><div class="fromTime"><label>提前时间:</label><input type="text" name="bwtime" value="0"/></div><button id="btnStart">开始抢购</button></div></div></div>';
    $("body").append(setTime);
}

//属性选择-侧边栏html代码
function chooseAttrsHtml() {
    var btn = '<div class="mod_aside_v2 unfold anim" style="bottom: 60px;z-index:107"> <div class="mod_aside_v2_mask"></div> <div class="mod_aside_v2_nav"> <div class="mod_aside_v2_nav_btn" data-tag="openNav"> <i data-tag="openNav">预下单</i> </div> <div id="sideNavItems"  style="max-height: 400px; overflow: auto; height: 600px;"> </div><div class="fromTime"><label>抢购时间:</label><input type="datetime-local" name="startTime" id="datetime-local" value="" /></div><button id="btnStart">开始抢购</button></div> </div> </div>';
   // var btn = '<div class="mod_aside_v2 unfold anim" style="bottom: 60px;z-index:107"> <div class="mod_aside_v2_mask"></div> <div class="mod_aside_v2_nav"> <div class="mod_aside_v2_nav_btn" data-tag="openNav"> <i data-tag="openNav">预下单</i> </div> <div id="sideNavItems"  style="max-height: 400px; overflow: auto; "> </div></div> </div> </div>';
    $("body").append(btn);
}

//给微信付款按钮添加span提供点击事件.
function btnPayOnLineHtml(){
    var html='<span id="btnPay">支付订单</span>'
    $(".mod_btn.bg_wx:last").append(html);
}

function getJdTime(){

}

//加载侧边栏CSS样式
menusCss();

//提交订单
if (title == "确认订单") {
    $(function () {
        btnPayOnLineHtml();
        console.log('开始抢购');
        $("#btnPay").trigger("click");
        Interval = setInterval (function () {
            if($("#btnPay").length && ("#btnPay").length>0 && item < 20){
                $("#btnPay").trigger("click");
                item++;
                console.log('第'+item+'提交')

            }else{
                clearInterval(Interval);
            }
        },200);
    })
}


//预约下单
if (host == "item.m.jd.com") {
    aside_btn="预下单";
    chooseAttrsHtml();
    $(function () {

        //侧边栏展开收起事件
        $(".mod_aside_v2_nav_btn").click(function(e){
            if(mod_aside_v2){
                $(".mod_aside_v2.unfold.anim").toggleClass("unfold anim");
                $("i[data-tag='openNav']").text("收起");
                mod_aside_v2=false;
            }else{
                $(".mod_aside_v2").addClass("unfold anim");
                $("i[data-tag='openNav']").text(aside_btn);
                mod_aside_v2=true;
            }
        });

        var href_sku = window.location.pathname.replace(/[^0-9]/ig, "");
        var skuIds = _itemOnly.item;
        // console.log(skuIds.newColorSize);
        $.each(skuIds.newColorSize, function (i, s) {
            var banben = s['1'] + s['2'] + s['3'];
            if(banben==''){
                banben='默认';
            }
            var sku = s.skuId;
            // var checked = href_sku + '' == sku + '' ? "checked" : "";
            //var html ='<a href="https://wqdeal.jd.com/deal/confirmorder/main?sceneval=2&bid=&wdref=https://item.m.jd.com/product/'+sku+'.html?sceneval=2&scene=jd&isCanEdit=1&EncryptInfo=&Token=&commlist='+sku+',,1,'+sku+',1,0,0&locationid=22-1930-49324&type=0&lg=0&supm=0#wechat_redirect" class="mod_aside_v2_nav_item"> <span>'+banben+'</span></a>'
            if(i==1){
               Attribute_tag='<label><input name="Attrs" type="radio" value="'+sku+'" checked="checked" />'+banben+' </label> '
            }else{
                Attribute_tag='<label><input name="Attrs" type="radio" value="'+sku+'" />'+banben+' </label> '
            }
            $("#sideNavItems").append(Attribute_tag);
        });

        $("#btnStart").click(function () {
            if($("input[name='startTime']").val() =='' ){
                    alert("请输入抢购时间");
            }else{
                var btnClikTime = new Date().getTime();
                GM_xmlhttpRequest({
                    url: "https://a.jd.com//ajax/queryServerData.html" ,
                    method: 'GET',
                    timeout: 10000,
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded'
                    },onload: function(res){
                        if(res.status==200 && jQuery.parseJSON(res.responseText).hasOwnProperty('serverTime')){
                            delayTime = new Date().getTime()- btnClikTime;
                            var JdTime= jQuery.parseJSON(res.responseText).serverTime +delayTime/2
                            bwtime = new Date().getTime() - JdTime;
                            start_time = new Date($("input[name='startTime']").val()).getTime() -Math.floor(bwtime);
                            Interval = setInterval (function () {
                                current_time = new Date().getTime();
                                remaining_time = start_time-current_time;
                                console.log('等待开始,剩余时间：'+remaining_time/1000+'秒');
                                if(remaining_time<101){
                                    clearInterval(Interval);
                                    var Timeout=setTimeout(function(){
                                        console.log('开始抢购');
                                        $("#buyBtn1").click();
                                    },remaining_time);
                                }
                            }, 50);
                        }else{
                             console.log('获取服务器时间失败');

                        }

                    },onerror : function(err){
                        console.log('获取服务器时间失败');
                    }
                });
            }
        });

    })
}