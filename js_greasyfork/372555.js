// ==UserScript==
// @name            人人都是产品经理作家工具箱
// @namespace       [url=mailto:603085386@qq.com]603085386@qq.com[/url]
// @author          三爷
// @match           http://www.woshipm.com/me/posts/
// @match           http://www.woshipm.com/u/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require	    http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @version         1.3.4
// @description 阅读量人性化显示
// @downloadURL https://update.greasyfork.org/scripts/372555/%E4%BA%BA%E4%BA%BA%E9%83%BD%E6%98%AF%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%E4%BD%9C%E5%AE%B6%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/372555/%E4%BA%BA%E4%BA%BA%E9%83%BD%E6%98%AF%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86%E4%BD%9C%E5%AE%B6%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

//全局定义
var click = [];
var clicks = 0;
var pages = 0;
//title数据存储
var titleData = [];
//篇均订阅量
var avgPeople = 0;
//篇点赞
var avgLike = 0;
//篇阅读
var avgPage = 0;

//获取当前地址，并正则匹配所有字母”httpwwwwoshipmcomu“
var sign = 0;
//如果相等就是进入了作家主页
if(window.location.href.replace(/[^a-z]/ig,"") == "httpwwwwoshipmcomu"){
    sign = 1;
    homePage();
}
else{
    backPage();
}




//任意作家个人主页的相关信息：篇均值计算
function homePage() {

    $("div.container.u-width800.u-clearfix").children("span").each(function (i, son) {

        //处理订阅量，目前只能处理上限为万的订阅量
        if (i == 1) {
            //个人主页字符不一样先将“9.8万总阅读”化为“9.8万”
            var originalData = $(son).text().substring(0, $(son).text().length - 3);
            var sub = originalData.substring(originalData.length, originalData.length - 1);
            //处理过的数据
            var original = originalData;
            //处理过万的阅读量数据
            if (sub == "万") {
                original = parseInt(originalData.substring(0, originalData.length - 1)) * 10000;
                //通过识别小数点，将如：1.9万翻译成 1*10000+9*1000=19000
                if (originalData.substring(originalData.length - 2, originalData.length - 3) == ".") {
                    original = original + originalData.substring(originalData.length - 1, originalData.length - 2) * 1000
                }
            }
            //处理过百万的阅读量数据
            else if (sub == "m"){
                original = parseInt(originalData.substring(0, originalData.length - 1)) * 1000000;
                //通过识别小数点，将如：1.9m翻译成 1*1000000+9*100000=1900000
                if (originalData.substring(originalData.length - 2, originalData.length - 3) == ".") {
                    original = original + originalData.substring(originalData.length - 1, originalData.length - 2) * 100000
                }
            }
            titleData[i] = original;
        }
        else {
            //parseInt可将字符串中数字提取出来
            //垃圾网站前端，代码布局写错了
            //i=0代表总篇数；1代表总阅读量；3代表总被赞；2代表总订阅量
            titleData[i] = parseInt($(son).text());
        }
    });
    avgPeople = (titleData[2] / titleData[0]).toFixed(0);
    avgLike = (titleData[3] / titleData[0]).toFixed(0);
    avgPage = (titleData[1] / titleData[0]).toFixed(0);
    $("div.description").append("<p style='font-weight: bold;'>" + "篇均订阅量：" + avgPeople + "人；篇均点赞量：" + avgLike + "个；篇均阅读量：" + avgPage + "次" + "</p>")
    //console.log(titleData[3]+"-"+avgLike+"-"+avgPage);
}

//作家登录后，进入的发文章页面
function backPage() {
    //计算篇均订阅量，获取title区域数据进行计算
    $("div.setting-page-user-meta").children("span").each(function(i, son){
        //parseInt可将字符串中数字提取出来
        //i=0代表总篇数；1代表总阅读量；2代表总订阅量
        titleData[i] = parseInt($(son).text());
    });
    avgPeople = (titleData[2] / titleData[0]).toFixed(0);

    //由于需要排除草稿文章，所以each中的索引就比正常的文章多一个因此重新使用新的索引
    var index = 0;
    $("div.u-floatRight.meta").each(function(i, son){
        //判断是不是草稿文章，是的话不计入综述
         var pageTag = ($($(son).parent()[0]).children("span").text());
         if("【草稿】" == pageTag||"【待审核】" == pageTag){}
         else{
                //原始数据
                var originalData = $.trim($(son).text()).split(' ')[0];
                var sub=originalData.substring(originalData.length,originalData.length-1);
                //处理过的数据
                var original = originalData;
                //处理过万的阅读量数据
                if(sub=="万"){
                    original = parseInt(originalData.substring(0,originalData.length-1))*10000;
                    //通过识别小数点，将如：1.9万翻译成 1*10000+9*1000=19000
                    if(originalData.substring(originalData.length-2,originalData.length-3)=="."){
                        original = original + originalData.substring(originalData.length-1,originalData.length-2)*1000
                    }
                }
                //处理过百万的阅读量数据
                else if (sub == "m"){
                    original = parseInt(originalData.substring(0, originalData.length - 1)) * 1000000;
                    //通过识别小数点，将如：1.9m翻译成 1*1000000+9*100000=1900000
                    if (originalData.substring(originalData.length - 2, originalData.length - 3) == ".") {
                        original = original + originalData.substring(originalData.length - 1, originalData.length - 2) * 100000
                    }
                }
                 //处理好的每篇文章点击量
                click[index] = original;
                //总文章点击量
                //console.log(parseInt(click[i])+"\n");
                clicks = clicks + parseInt(click[index]);
                pages = index + 1;
                index = index + 1;
         }
    });
    var now = new Date();
    var tempMinutes = now.getMinutes();
    var minutes = tempMinutes;
    var tempSeconds = now.getSeconds();
    var seconds = tempSeconds;
    if(tempMinutes<10)
    {
        minutes = "0"+tempMinutes //分数前加个0
    }
    if(tempSeconds<10){seconds = "0"+tempSeconds}   //分数前加个0

    var rDate = ("<p>" + "上次阅读量变化时间：" + now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getHours() + ":" + minutes + ":" + seconds + "    篇均订阅量：" + avgPeople + "人" + "</p>");
    var nDate = ("<p>" + "本次阅读量变化时间：" + now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getHours() + ":" + minutes + ":" + seconds + "</p>");

    //判断是否有添加cookie
    if($.cookie('lastClicks')==null){
        //设置有效期为15天
        $.cookie('lastClicks',clicks , { expires: 15 });
        $.cookie('rDate',rDate , { expires: 15 });
        $("div.setting-page-user-meta").append(rDate)
        $("span.uc-tab-item.current").html("总阅读量："+clicks+" 平均阅读："+(clicks/pages).toFixed(2));

        document.title = "总:" + clicks + " 均:" + (clicks/pages).toFixed(0);

        click.forEach(function(val,index){
            $.cookie(index,val, { expires: 15 });
        });
    }
    else{
        $("div.setting-page-user-meta").append($.cookie('rDate'))
        //为零时不显示，不更新cookie，增加用户体验
        if((clicks - parseInt($.cookie('lastClicks')))==0){
            //顶栏显示
            document.title = "总:" + clicks + " 均:" + (clicks/pages).toFixed(0);

            $("span.uc-tab-item.current").html("总阅读量："+clicks+" 平均阅读："+(clicks/pages).toFixed(2));
            $("span.u-colorBlue").each(function(i, son){
                $(son).html("【无新增】");
            });
        }
        else{
            $("div.setting-page-user-meta").append(nDate)
            $("span.uc-tab-item.current").html("总阅读量(+"+ (clicks - parseInt($.cookie('lastClicks'))) + ")："+clicks+" 平均阅读："+(clicks/pages).toFixed(2))
            document.title = "总:" + clicks + "(+"+ (clicks - parseInt($.cookie('lastClicks'))) + ")" + " 均:" + (clicks/pages).toFixed(0) + "(+" + (clicks - parseInt($.cookie('lastClicks'))) + ")";

            //不删除原HTML，追加HTML
            //遍历页面元素，并使用此时的计数器i同时进行cookie计算
            $("span.u-colorBlue").each(function(i, son){
                //使用最新的数据减去cookie的记录，如果差不为零说明本项变化
                if((click[i] - parseInt($.cookie(String(i)))!=0)){
                    $(son).append("+" + (parseInt(click[i]) - parseInt($.cookie(String(i)))));
                }
            });

            //将最新阅读量，日期数据存贮至cookie中
            $.cookie('rDate',rDate , { expires: 15 });
            $.cookie('lastClicks',clicks , { expires: 15 });
            click.forEach(function(val,index){
                $.cookie(index,val, { expires: 15 });
            });
        }
    }
}
