// ==UserScript==
// @name         劲舞团一键签到&领奖2.0.1
// @version      2.0.1
// @description  对抗狗游的反人类设计
// @license      rNabbit
// @match        https://shop.9you.com/*
// @match        http://shop.9you.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9you.com
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @namespace https://greasyfork.org/users/1269143
// @downloadURL https://update.greasyfork.org/scripts/488767/%E5%8A%B2%E8%88%9E%E5%9B%A2%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0%E9%A2%86%E5%A5%96201.user.js
// @updateURL https://update.greasyfork.org/scripts/488767/%E5%8A%B2%E8%88%9E%E5%9B%A2%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0%E9%A2%86%E5%A5%96201.meta.js
// ==/UserScript==

//大区 1：华东一 2：华北一
var daqu = 2 ;

//页面刷新间隔
var freezetime = 5000;

var $ = window.jQuery;
var res;
var itemcode;
var myitem;
var tmp;

var daqulist = Object.freeze({ //大区列表
    [1]:"华东一区（电信）",
    [3]:"华南一区（广东）",
    [5]:"四川(天府热线）",
    [7]:"陕西（湖北胜天）",
    [12]:"江苏浪淘沙",
    [16]:"浙江华数（华东二区）",
    [17]:"西南一区(西南二区) ",
    [48]:"劲舞家族（汉江公园）",
    [2]:"华北一区（黑龙江）大区",
    [18]:"全国网通（华中天空双线）",
    [21]:"山东万佳(河北网通)",
    [39]:"华北二区(浓情蜜意)",
});
var itemlist1 = Object.freeze({ //全民夺宝奖励列表
    [99]:"领取所有",
    [2]:"男YY",
    [5]:"蓝结吉祥",
    [6]:"灰考拉",
    [7]:"尼玛(雷雷)",
    [8]:"铃铛鹿鹿",
    [9]:"字母盾",
    [10]:"翅膀1",
    [11]:"翅膀2",
    [12]:"吉他",
    [13]:"背包",
    [14]:"DJ台",
});
var itemlist2 = Object.freeze({ //抽奖活动奖励列表
});

//添加button
$('body').prepend("<div><button class='floating' id='setting' type='button'>插件设定</button></div>");

//添加签到天数
if ($('.query-btn').length > 0){
    var LoginRecodes =$('script').text().match(/<p>/g).length;
    $('body').prepend("<div><button class='floating' id='recodes' type='button'>已签到：\n" + LoginRecodes + "天</button></div>");
};

//添加要素css
$('.floating').css({'position': 'fixed','cursor':'pointer'});
$('#setting').css({'background':' linear-gradient(to top, rgba(217, 175, 217, 0.7) 0%, rgba(151, 217, 225, 0.7) 80%)',
                    'border':'2px solid red','border-radius':'5px','border-bottom':'3px solid #9f000c','border-right':'3px solid #9f000c',
                    'opacity':'.7','z-index':'99'});
$('#recodes').css({'background':' linear-gradient(to top, rgba(176,176,176,0.7) 0%, rgba(151, 217, 225, 0.7) 80%)',
                    'border':'2px solid white','border-radius':'5px','border-bottom':'3px solid #7c7c7c','border-right':'3px solid #7c7c7c',
                    'opacity':'.7','z-index':'99'});

$('#setting').css({'top':'10px','left':'10px','width':'55px','height':'55px','margin':'10px','padding':'10px','font-size':'12px','font-weight':'bold'});
$('#recodes').css({'top':'10px','left':'70px','width':'75px','height':'55px','margin':'10px','padding':'10px','font-size':'12px','font-weight':'bold'});

//主程序
(function () {
//button点击事件
    $(document).on("click", "#setting" , function() {
        itemcode = localStorage.getItem("key");
        if ( itemcode == null || itemcode == "" ){
            res = confirm("* * * * * * * * * * 插 件 设 定 * * * * * * * * * * \n\n大区选择：" + daqulist[daqu] +
                          "\n\n奖励选择：未设定\n\n/ / / / / / 设定初始化请点击【取消】 / / / / / / ");
        } else {
            res = confirm("* * * * * * * * * * 插 件 设 定 * * * * * * * * * * \n\n大区选择：" + daqulist[daqu] +
                          "\n\n奖励选择：" + itemlist1[itemcode] + "\n\n/ / / / / / 设定初始化请点击【取消】 / / / / / /");
        };
        //confirm分歧处理
        if (res == true){
            location.reload(); //确定：重新加载
        } else {
            localStorage.clear(); //取消：设定初始化
        };
    });

    $(document).on("click", "#recodes" , function() {
        $(".query-btn").trigger("click");
    });
//以下为领奖页面相关
    var cnt1 = $('body').text().indexOf('抽奖奖励领取');

    if( cnt1 >= 0 ){
        //读取本地存储
        myitem = localStorage.getItem("key");
        itemcode = localStorage.getItem("passcode");

        if ( itemcode == "99" ){

            tmp = $('input:radio[name="itemcode"]').val();
            myitem = tmp.replace("draw_","");
            //存储至本地
            localStorage.setItem("key",myitem);
            localStorage.setItem("passcode",itemcode);

        } else {

            setTimeout(function(){ //无法领取奖励时停止运行
                if ( $("#show-message").text().indexOf("请选择") >= 0 ){
                    //localStorage.clear();
                    itemcode = prompt('当前奖励已领完，请重新选取奖励:\n99：自动领取当前页面所有奖励\n' +
                                      '\n* * * * * * * * * * 全 民 夺 宝 * * * * * * * * * *\n' +
                                      '5：蓝结吉祥 / 6：灰考拉 / 7：尼玛(雷雷) / 8：铃铛鹿鹿 / 9：字母盾\n' +
                                      '10：翅膀一 / 11：翅膀二 / 12:吉他 / 13：背包 / 14：DJ台\n\n' +
                                      '* * * * * * * * * * 抽 奖 活 动 * * * * * * * * * *\n' +
                                      '待补全');
                    if ( itemcode == "0" || itemcode == null || itemcode == "" ){
                        return;
                    } else if ( itemcode == "99" ){
                        var tmp;
                        tmp = $('input:radio[name="itemcode"]').val();
                        myitem = tmp.replace("draw_","");
                        localStorage.setItem("key",myitem);
                        localStorage.setItem("passcode",itemcode);
                    } else {
                        localStorage.setItem("key",itemcode);
                        localStorage.setItem("passcode",itemcode);
                    }
                }; //end if
            },1000);
        };

        $('input:radio[name="itemcode"]').val(["draw_" + myitem]); //物品选择
        $("input[name='server_id']").val(daqu); //大区选择
        $('#tj').trigger('click'); //提交

        setTimeout(function(){
            location.reload();
        },freezetime); //等待网页反应，重新加载网页
    }; // end if
})();

//各种签到，自动选区
$('body').click(function() {
    $("input[name='area1']").val(daqu);
    $("input[name='server_id']").val(daqu);
});

//sleep函数
function sleep(waitMsec) {
  var startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}