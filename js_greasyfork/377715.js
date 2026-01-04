// ==UserScript==
// @name         800-分分快三-跟龙
// @namespace    http://tampermonkey.net/
// @version      3.2
// @note         2.0以上版本发现“分分快三位置调整”
//@note          0.7投注单例
// @note         0.6 每隔1.5小时，restartwork
// @note         0.5 优化统计倍率模块
// @note         0.4 反压成功，初始连输时还是有bug，漏加倍
// @note         0.3 代码重构
// @note         0.2 跟完计划，再反押计划
// @note         0.1 跟计划，输了翻倍
// @description  快三_自动化
// @author       blankii
// @match        https://8001909.com/*
// @match        https://www.baidu.com/
// @include      https://8001909.com/#/chatRoom
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/377715/800-%E5%88%86%E5%88%86%E5%BF%AB%E4%B8%89-%E8%B7%9F%E9%BE%99.user.js
// @updateURL https://update.greasyfork.org/scripts/377715/800-%E5%88%86%E5%88%86%E5%BF%AB%E4%B8%89-%E8%B7%9F%E9%BE%99.meta.js
// ==/UserScript==
/* jshint -W097 */
//https://8001198.com/#/noticeDetail/21 分分快三-历史界面
//https://8001198.com/#/buyLottery/21   分分快三-投注界面
//"https://8001198.com/#/chatRoom"
//1.标签页空白，聊天菜单not found 循环过滤20期
// Your code here...
//地址常量
var hash_chatRoom = "chatRoom"
var hash_lottery = "buyLottery"
var chatRoomUrl = "https://8001909.com/#/chatRoom"
var buyLotteryUrl = "https://8001909.com/#/buyLottery/21"
//系统变量
var betting_index    //当前待开期数
var init = true        //初始化标志
var betting_last_index  //上次待开期数
var isFollow        //反跟计划 true跟计划，false反计划
var chooseTag = 0       //投注页面大小，单双项角标


var roundCount = 0
var winning_index = 2 //上次开奖序号
var betting_type
var winning_type

//test变量
var one_show_count = 0      //倍率一倍出现次数
var two_show_count = 0      //倍率二倍出现次数
var three_show_count = 0    //三倍
var four_show_count = 0     //四倍
var five_show_count = 0     //五倍
var six_show_count = 0      //六倍
var seven_show_count = 0    //七倍
var eight_show_count = 0    //八倍
var more_show_count = 0     //more

//智能分析变量
var anlCount = 20
var data_times = 1
var last_follow_abs = 0
var last_sb_abs = 0
var anlBaseNum=5
var last_betting_last_rate=1
var last_isTouzhu=false

//配置变量
var timeTag = 1.2           //时间参数比例，与网速有关
var flashTime = 1000 * 15    //每*分种开奖，刷新历史界面
var manyUnit = 2           //0元 1角 2分
var baseJin = 1             //单价
var isTest = false          //测试中，true不会提交订单，false投订单
//投注1角
var BASE_JIN=1
var MANY_UNIT=1


//2.02计划
var lastModelName="null"
var curModelName="null"
var betting_last_rate=1
var lastChooseTag=-1
var resArray
var res = "a8+b5\n" +
    "a8+b2\n" +
    "a5+a3\n" +
    "b1+a4\n" +
    "a8+a6\n" +
    "a1+a2\n" +
    "a4+b7\n" +
    "a3+a6\n" +
    "a3+a3\n" +
    "b7+b8\n" +
    "b7+b7\n" +
    "b7+b6\n" +
    "b7+b4\n" +
    "b7+a2\n" +
    "b7+a3\n" +
    "b7+a8\n" +
    "b7+a7\n" +
    "a1+b6\n" +
    "a1+b5\n" +
    "a2+a5\n" +
    "a2+a1\n" +
    "a2+b8\n" +
    "a2+b5\n" +
    "a3+b1\n" +
    "a3+b3\n" +
    "a3+b4\n" +
    "a3+b6\n" +
    "a3+b7\n" +
    "b5+b7\n" +
    "b5+b3\n" +
    "a7+b4\n" +
    "a7+b6\n" +
    "a7+a8\n" +
    "b8+b7\n" +
    "b3+b5\n" +
    "b3+b4\n" +
    "b2+b5\n" +
    "a6+a7\n" +
    "b2+a5\n" +
    "b2+a4\n" +
    "b2+a1\n" +
    "b4+b7\n" +
    "b4+b6\n" +
    "b4+b2\n" +
    "b4+b1\n" +
    "b1+b3\n" +
    "b1+b2\n" +
    "b3+a5\n" +
    "b3+a7\n" +
    "b5+a3\n" +
    "b5+a4\n" +
    "b5+a1\n" +
    "b1+b7"

//***************************当你凝视深渊的时候，深渊也在凝视你****************************
//***************************当你凝视深渊的时候，深渊也在凝视你****************************
//***************************当你凝视深渊的时候，深渊也在凝视你****************************
//***************************当你凝视深渊的时候，深渊也在凝视你****************************
log("程序准备运行")
//view是否初始化
function isExist(view,isShow, viewName) {
    if (!view) {
        if(isShow){
            log(viewName + "is not found")
        }
        return false
    } else {
        return true
    }
}

function splitRes(){
    resArray= res.split("\n")
    //for(var i=0;i<resArray.length;i++){
    //    console.log("s:"+resArray[i])
    //}
}
splitRes()
//字符串包含
function isContains(parentStr, substr) {
    return parentStr.indexOf(substr) >= 0;
}
function log(str){
    if(isTest){
        console.log(str)
    }
}


//翻倍超过预设值，停止脚本工作
function stopWork() {
    log("stop----work---")
    location.replace("http://baidu.com")
}

function reStartWork(tag) {
    log( "==restart work ==" + tag)
    setTimeout(function() {
        location.replace(chatRoomUrl)
        setTimeout(function() {
            location.reload()
        }, 2000)
    }, 4000)
}

function parseNum(str) {
    if (isNaN(parseInt(str))) {
        return 0
    } else {
        return parseInt(str)
    }
}




//数据倍率统计
function showDataResult() {
    var sumOne = one_show_count - two_show_count
    var sumTwo = two_show_count - three_show_count
    var sumThree = three_show_count - four_show_count
    var sumFour = four_show_count - five_show_count
    var sumFive = five_show_count - six_show_count
    var sumSix = six_show_count - seven_show_count
    var sumSeven = seven_show_count - more_show_count
    // var sumEight=eight_show_count-more_show_count
    var sumMore = more_show_count

    var sumCount = sumOne + sumTwo + sumThree + sumFour + sumFive + sumSix + sumSeven
    log("***总数： " + sumCount + "***")
    //log("***一倍率： "+one_show_count+" ***")
    // log("***二倍率： "+two_show_count+" ***")
    //log("***三倍率： "+three_show_count+" ***")
    // log("***四倍率： "+four_show_count+" ***")
    // log("***五倍率： "+five_show_count+" ***")
    //  log("***六倍率： "+six_show_count+" ***")
    //  log("***MORE倍率： "+sumMore+" ***")
    var rOne=sumOne / sumCount
    var rTwo=sumTwo / sumCount
    var rThree=sumThree / sumCount
    var rFour=sumFour / sumCount
    var rFive=sumFive / sumCount
    var rSix=sumSix / sumCount
    var rSeven=sumSeven / sumCount
    var rMore=sumMore / sumCount

    log("***一倍率： " + sumOne + " ,占比: " + rOne.toFixed(2) + " ***")
    log("***二倍率： " + sumTwo + " ,占比: " + rTwo.toFixed(2) + " ***")
    log("***三倍率： " + sumThree + " ,占比: " + rThree.toFixed(2) + " ***")
    log("***四倍率： " + sumFour + " ,占比: " + rFour.toFixed(2) + " ***")
    log("***五倍率： " + sumFive + " ,占比: " + rFive.toFixed(2) + " ***")
    log("***六倍率： " + sumSix + " ,占比: " + rSix.toFixed(2) + " ***")
    log("***七倍率： " + sumSeven + " ,占比: " + rSeven.toFixed(2) + " ***")
    log("***MORE倍率： " + sumMore + " ,占比: " + rMore.toFixed(2) + " ***")
}
var fleshCount2=0
//PROCESS 1 从聊天室打开快三计划
var myOpenQ3Act=function(){
    //打开菜单按钮
    setTimeout(function(){
        var menuBtn=$('[class="tg-lottery"]')[0]
        if(isExist(menuBtn,"聊天室-菜单"))
        {
            menuBtn.click()
        }
        setTimeout(function(){
            var q3Btn=$('[class="pcdd-tab"]').find("li").eq(0)
            if(isExist(q3Btn,"聊天室-快三计划按钮"))
            {
                q3Btn.click()
            }else{
                console.log("--聊天室-快三计划按钮--异常--")
            }
            myChatRoomDataAnalysis()
        },400*timeTag)//快三按钮组件时间
    },1000*timeTag)
}

//PROCESS 2 统计投注记录，分析倍率，投注大小
function myChatRoomDataAnalysis() {
    setTimeout(function() {

        betting_index = $('[class="tab-menu posRel"]').find("table").find("tr").eq(1).find("td").eq(0).text()
        var winning_view = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index).find("td").eq(2).find('[class="circle active"]')[0]
        winning_type = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index).find("td").eq(1).find("span").eq(0).text()
        betting_type = $('[class="tab-menu posRel"]').find("table").find("tr").eq(1).find("td").eq(2).find("span").eq(0).text()
        //检验是否同期
        if (!init) { //非初始化
            //var lastVal=betting_last_index+1
            if(isNaN(parseInt(betting_index))||!isExist(betting_index)){
                reStartWork("betting_index is NaN")
            }
            if (betting_last_index== betting_index) {
                log("待刷新")
                return
            }
            log("当前期数："+betting_index)
            //log("判断赢否：isFollow："+isFollow+",isExist(winning_view):"+isExist(winning_view))
            //log("lastBettingType:"+lastChooseTag+",winning_type:"+winning_type)
            log("last_isTouzhu:"+last_isTouzhu)
            if(lastChooseTag!=-1){//上一次没有投注，不判定结果
                if (lastChooseTag==1&&isContains(winning_type,"大")||lastChooseTag==0&&isContains(winning_type,"小")) {
                    //winning_win_index = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index).find("td").eq(0).text()
                    betting_last_rate = 1
                    if(last_isTouzhu) {
                        last_betting_last_rate=1
                    }
                    log("--中奖期数： " + betting_last_index + "--")

                }else{
                    log("谢谢惠顾")
                    if(last_isTouzhu) {
                        if(last_betting_last_rate<7){
                            last_betting_last_rate++//没有到达最大倍率时输了递增
                        }else{
                            last_betting_last_rate=1//到达最大倍率归1
                        }
                    }
                }
            }
            //保留这个投注序号，避免重复刷进来
            betting_last_index = betting_index
        } else { //初始化

            //刷新参数，有新开的奖项
            betting_last_index = betting_index
            log("init:" + betting_last_index)
            init = false
            return
        }

        //默认不投注
        chooseTag=-1
        lastChooseTag=-1
        //开始分析投注
        myAnlStartWork()
        var canTouzhu=false
        var curTit=lastModelName+"+"+curModelName
        for(var i=0;i<resArray.length;i++){
            if(resArray[i]==curTit){
                canTouzhu=true
            }
        }
        log("当前模式："+curTit+"是否投注："+canTouzhu)
        lastModelName=curModelName
        //如果上次投注了，则停止投注
        if(last_isTouzhu){
           canTouzhu=false
        }
        if(!canTouzhu){
            //last_betting_last_rate=betting_last_rate
            baseJin=1
            manyUnit=2
            betting_last_rate=1
            last_isTouzhu=false
        }else{
            baseJin=BASE_JIN
            manyUnit=MANY_UNIT
            betting_last_rate=last_betting_last_rate
            last_isTouzhu=true
        }

        //统计大小
        // var betting_type=$('[class="tab-menu posRel"]').find("table").find("tr").eq(1).find("td").eq(2).find('[class="circle"]').eq(0).text()//待开项
        var touzhuType = ""
        switch (chooseTag) {
            case 0:
                touzhuType = "小"
                break
            case 1:
                touzhuType = "大"
                break
            default:
                console.log("存在bug！！001")
                break
        }
        lastChooseTag=chooseTag
        log(betting_index + "期投注：" + touzhuType + ","+",基础金额："+baseJin+"," + betting_last_rate + "倍 ，投注模式:"+curTit)
        //倍率统计
        switch (betting_last_rate) {
            case 0:
                log("=======异常：倍率为0，检查逻辑======")
                break
            case 1:
                data_times = 1
                one_show_count++
                break
            case 2:
                data_times = 3
                two_show_count++
                break
            case 3:
                data_times = 8
                three_show_count++
                break
            case 4:
                data_times = 24
                four_show_count++
                break
            case 5:
                data_times = 72
                five_show_count++
                break
            case 6:
                data_times = 216
                six_show_count++
                break
            case 7:
                data_times = 648
                seven_show_count++
                break
            default:
                more_show_count++
                console.log("有bug！！倍率异常 002")
                //log("=====倍率异常，betting_last_rate:"+betting_last_rate+"===")
                //stopWork()
                //reStartWork("倍率异常")
                //reStartWork("=======倍率异常=======")
                break
        }

        myReadyAndStartJumpToLottery()
    }, 2200 * timeTag) //计划列表组件时间
}

function isBoolean(num) {
    if (num >= 0) {
        return true
    } else {
        return false
    }
}

function myAnlStartWork() {

    var anl = myAnlCollectWork(0, 3*anlBaseNum)

    var anl1 = myAnlCollectWork(2*anlBaseNum, 3*anlBaseNum)
    var anl2 = myAnlCollectWork(anlBaseNum, 2*anlBaseNum)
    var anl3 = myAnlCollectWork(0, anlBaseNum)

    var pm_f_1 = isBoolean(anl1.fc - anl1.nc)
    var pm_f_2 = isBoolean(anl2.fc - anl2.nc)
    var pm_f_3 = isBoolean(anl3.fc - anl3.nc)

    var pm_t_1 = isBoolean(anl1.bc - anl1.sc)
    var pm_t_2 = isBoolean(anl2.bc - anl2.sc)
    var pm_t_3 = isBoolean(anl3.bc - anl3.sc)

    //A计划：当 跟与不跟 的差值大于等于 大与小的差值时 采用跟与不跟判断
    //B计划：反正采用 大与小判断
    //C计划：波动不明显分析不足以判断，遂固定为跟龙

    if (Math.abs(anl.fc - anl.nc) - Math.abs(anl.bc - anl.sc) >= 1) { //A计划

        //log("=====分析：A计划=====")
        if (pm_f_1 == true && pm_f_2 == true && pm_f_3 == true) { //+++ +

            myAnlChildFun(false, "a1")

        } else if (pm_f_1 == true && pm_f_2 == true && pm_f_3 == false) { //-++ -

            myAnlChildFun(false, "a2")

        } else if (pm_f_1 == true && pm_f_2 == false && pm_f_3 == true) { //--+ - todo blankii 应该是--+ +考虑？？？

            myAnlChildFun(true, "a3")

        } else if (pm_f_1 == false && pm_f_2 == true && pm_f_3 == true) { //--- -

            myAnlChildFun(true, "a4")

        } else if (pm_f_1 == true && pm_f_2 == false && pm_f_3 == false) { //+-- +

            myAnlChildFun(true, "a5")

        } else if (pm_f_1 == false && pm_f_2 == false && pm_f_3 == true) { //++- +

            myAnlChildFun(true, "a6")

        } else if (pm_f_1 == false && pm_f_2 == true && pm_f_3 == false) { //+-+ -

            myAnlChildFun(true,"a7")
        }
        else if (pm_f_1 == false && pm_f_2 == false && pm_f_3 == false) { //-+- +

            myAnlChildFun(false, "a8")
        }else{
            log("what'up ???")
        }
    } else { //B计划

        //log("=====分析：B计划=====")
        if (pm_t_1 == true && pm_t_2 == true && pm_t_3 == true) { //+++ +

            myAnlChildFun(false, "b1")
        } else if (pm_t_1 == true && pm_t_2 == true && pm_t_3 == false) { //-++ -

            myAnlChildFun(false, "b2")
        } else if (pm_t_1 == true && pm_t_2 == false && pm_t_3 == true) { //--+ -

            myAnlChildFun(true, "b3")
        } else if (pm_t_1 == false && pm_t_2 == true && pm_t_3 == true) { //--- -

            myAnlChildFun(true, "b4")
        } else if (pm_t_1 == true && pm_t_2 == false && pm_t_3 == false) { //+-- +

            myAnlChildFun(true, "b5")
        } else if (pm_t_1 == false && pm_t_2 == false && pm_t_3 == true) { //++- +

            myAnlChildFun(true, "b6")
        } else if (pm_t_1 == false && pm_t_2 == true && pm_t_3 == false) { //+-+ -

            myAnlChildFun(true, "b7")
        } else if (pm_t_1 == false && pm_t_2 == false && pm_t_3 == false) { //-+- +

            myAnlChildFun(false, "b8")
        }else{
            log("what'up ???")
        }

    }
    //log(betting_index + "期分析结果：" +",follow:"+isFollow)
}
var mAnlModelName=""
function myAnlChildFun(isFollowTag, anlModelName) {

    curModelName=anlModelName
    if(isContains(anlModelName,"b")){//分析走b计划

        if (isFollowTag) {
            chooseTag=1
        }else{
            chooseTag=0
        }
    }else{//分析走a计划

        if (isFollowTag) {//a计划的话再在这里判断一次，b计划的话，在分析的的时候直接给chooseTag赋值
            if (isContains(betting_type, "小")) {
                chooseTag = 0
            } else {
                chooseTag = 1
            }
        } else {
            if (isContains(betting_type, "小")) {
                chooseTag = 1
            } else {
                chooseTag = 0
            }
        }

    }
    //isFollow = isFollowTag

}

function myAnlCollectWork(sIndex, eIndex) {

    var last_longType = false //false 花龙， true 跟龙
    var anl_follow_count = 0 //跟计划
    var anl_no_follow_count = 0 //不跟计划
    var anl_small_count = 0 //小
    var anl_big_count = 0 //大数
    var anl_hualong_count = 0 //花龙数
    var anl_genlong_count = 0 //跟龙数
    var anl_long_gap = 0 // >0  花龙大 ， <0 跟龙大
    var anl_sb_gap = 0 // >0 大多， <0 小多
    var anl_follow_gap // >0 跟计划， <0 反计划
    //log(">>>>分析期数<<<")
    for (var i = sIndex; i < eIndex; i++) {
        var anl_index = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index + i).find("td").eq(0).text()
        //log("分析期数：" + anl_index)
        var anl_real_text = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index + i).find("td").eq(1).find("span").eq(0).text()
        var anl_awardView = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index + i).find("td").eq(2).find('[class="circle active"]')[0]
        var currentType = isExist(anl_awardView,false)
        if (i > 0 && currentType == last_longType) { //过滤最上一个awardView
            anl_genlong_count++
        } else {
            anl_hualong_count++
        }
        if (currentType) {
            anl_follow_count++
            last_longType = true
        } else {
            anl_no_follow_count++
            last_longType = false
        }
        if (isContains(anl_real_text, "小")) {
            anl_small_count++
        } else {
            anl_big_count++
        }
        //log("分析中："+anl_index+"期，跟计划："+isExist(anl_awardView)+",type:"+anl_real_text)
    }
    //anl_long_gap=anl_genlong_count-anl_hualong_count
    anl_sb_gap = anl_big_count - anl_small_count
    anl_follow_gap = anl_follow_count - anl_no_follow_count
    var resultType = 0  //投注 0 小 ，1 大

    var anl_long_abs = Math.abs(anl_long_gap)
    var anl_sb_abs = Math.abs(anl_sb_gap)
    var anl_follow_abs = Math.abs(anl_follow_gap)
    var anl_follow_pm = isBoolean(anl_follow_count - anl_no_follow_count)
    var anl_sb_pm = isBoolean(anl_big_count - anl_small_count)

    //log("分析中：" + "跟计划数：" + anl_follow_count + "不跟数：" + anl_no_follow_count + ",gap:" + anl_follow_gap + ",正负：" + anl_follow_pm)
    // log("分析中：" + "大个数：" + anl_big_count + ",小个数：" + anl_small_count + ",gap:" + anl_sb_gap + ",正负：" + anl_sb_pm)
    //log("分析中：" + "跟龙数：" + anl_genlong_count + ",花龙数：" + anl_hualong_count + ",gap:" + anl_long_gap)

    return {
        fc: anl_follow_count,
        nc: anl_no_follow_count,
        bc: anl_big_count,
        sc: anl_small_count
    }
}


//PROCESS 3 准备-开始跳转到投注页面
function myReadyAndStartJumpToLottery() {

    //跳转页面
    setTimeout(function() {
        location.replace(buyLotteryUrl)
        myLotteryViewUpdate()
    }, 1500 * timeTag) //在聊天室待*秒跳转
}

//PROCESS 4 跳转到投注页面-控制组件
function myLotteryViewUpdate() {
    setTimeout(function() {
        //part 1 //大小
        switch (chooseTag) {
            case 0: //小
                var sBtn = $('[class="all-balls"]').find("i").eq(1)
                sBtn.click()
                break
            case 1: //大
                var bBtn = $('[class="all-balls"]').find("i").eq(0)
                bBtn.click()
                break
        }

        var unit
        //part 2 单位
        switch (manyUnit) {
            case 0: //元
                unit = "元"
                break
            case 1: //角
                unit = "角"
                var unitBtn_jiao = $('[class="company lf"]').find("span").eq(1)
                unitBtn_jiao.click()
                break

            case 2: //分
                unit = "分"
                var unitBtn_fen = $('[class="company lf"]').find("span").eq(2)
                if (isExist(unitBtn_fen, true,"投注页-分")) {
                    unitBtn_fen.click()
                    // log("===============分===================")
                } else {
                    log("---投注页——分---异常")
                    return
                }
        }

        var count = 2
        while (count < data_times * baseJin) {
            var plusBtn = $('[class="plus icon-m-p lf"]').eq(0) //加注
            if (isExist(plusBtn, true,"投注页-加注")) {
                plusBtn.click()
            } else {
                log("--投注页——加注---异常---")
                stopWork()
                break
            }
            count++
        }
        if (data_times * baseJin == 1) {
            var minusBtn = $('[class="minus icon-m-p lf"]').eq(0) //减注
            if (isExist(minusBtn, true,"减注页-加注")) {
                minusBtn.click()
            }
        }
        //技术统计
        //log("***投注说明***")
        //var data_type=chooseTag==0?"小":"大"
        //var showFollow=isFollow==true?"是":"否"
        //log("***     "+betting_index+" 期投注 ***")
        //log("***    选择 "+data_type+"    ***")
        //log("***    计划 "+showFollow+"    ***")
        //log("***    倍数 "+data_times+"    ***")
        //log("***    投入 "+data_times*baseJin+unit+"  ***")
        //log("*********倍率评率**********")
        showDataResult()

        myClickBetBtn()
        myClickSumbitOrder()
    }, 7400 * timeTag) //跳转投注页面，组件准备时间
}

//PROCESS 4-1 投注页面-下注按钮
function myClickBetBtn() {
    setTimeout(function() {
        var singleOrderBtn = $('[class="add-note lf"]')[0]
        if (isExist(singleOrderBtn,true,"singleOrderBtn")) {
            singleOrderBtn.click()
        } else {
            reStartWork("singleOrderBtn异常")
        }
    }, 3000 * timeTag)
}


//PROCESS 4-2 投注页面-提交订单
function myClickSumbitOrder() {
    setTimeout(function() {

        if (!isTest) {
            var orderBtn = $('[class="order"]')[0]
            orderBtn.click()
            log("*******完成投注*********")
        }

        myLotteryBackToChatRoom()
    }, 4000 * timeTag) //延迟投注
}

//PROCESS 4-2-1跳转回聊天室
function myLotteryBackToChatRoom() {
    setTimeout(function() {
        location.replace(chatRoomUrl)

        //myOpenQ3Act()
    }, 1000 * 3 * timeTag) //延迟跳转会聊天室
}

var isLotteryRefresh
//start

var fleshCount=0
var startWork = setInterval(function() {
    var webHash = location.hash
    if(fleshCount>4||fleshCount2>4){
        reStartWork()
    }

    if (isContains(webHash, hash_chatRoom)) {
        //log("----chatroom刷新----")
        myOpenQ3Act()
        fleshCount=0
        //  clearTimeout(isLotteryRefresh)
    } else if (isContains(webHash, hash_lottery)) { //跳转再刷新
        fleshCount++
    }
}, flashTime)






