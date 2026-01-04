// ==UserScript==
// @name         800-分分快三-数据记录版
// @namespace    http://tampermonkey.net/
//@note          0.7投注单例
// @note         0.6 每隔1.5小时，restartwork
// @note         0.5 优化统计倍率模块
// @note         0.4 反压成功，初始连输时还是有bug，漏加倍
// @note         0.3 代码重构
// @note         0.2 跟完计划，再反押计划
// @note         0.1 跟计划，输了翻倍
// @description  快三_自动化
// @author       blankii
// @match        https://8001198.com/*
// @match        https://www.baidu.com/
// @include      https://8001198.com/#/chatRoom
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/380706-blankiijs/code/blankiiJS.js?version=689593
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
// @version 0.0.1.20190430144504
// @downloadURL https://update.greasyfork.org/scripts/382396/800-%E5%88%86%E5%88%86%E5%BF%AB%E4%B8%89-%E6%95%B0%E6%8D%AE%E8%AE%B0%E5%BD%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/382396/800-%E5%88%86%E5%88%86%E5%BF%AB%E4%B8%89-%E6%95%B0%E6%8D%AE%E8%AE%B0%E5%BD%95%E7%89%88.meta.js
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
var chatRoomUrl = "https://8001198.com/#/chatRoom"
var buyLotteryUrl = "https://8001198.com/#/buyLottery/21"
//系统变量
var betting_index    //当前待开期数
var init = true        //初始化标志
var betting_last_index  //上次待开期数
var isFollow        //反跟计划 true跟计划，false反计划
var chooseTag = 0       //投注页面大小，单双项角标
var winning_win_index   //距离上次赢的
var haveOrderCount = 0     //投注项目个数
var filter990Tag = true     //过滤990-999段位
var roundCount = 0
var winning_index = 2 //上次开奖序号
var betting_type
var winning_view

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
var betting_last_rate = 0
var last_follow_abs = 0
var last_sb_abs = 0
var anlShockCount = 0
var anlProbIndex = ""
var anlMap = {}
var anlBaseNum=5
//本地存储
var l_no,l_plan_value,l_real_value,l_rate,l_anl_model,l_isFollow,l_time,l_result_value,l_win

//配置变量
var timeTag = 1.2           //时间参数比例，与网速有关
var flashTime = 1000 * 8    //每*分种开奖，刷新历史界面
var manyUnit = 2            //0元 1角 2分
var baseJin = 1             //单价
var isTest = false            //测试中，true不会提交订单，false投订单
var isAnlShock = false      //智能分析震荡

//***************************当你凝视深渊的时候，深渊也在凝视你****************************
//***************************当你凝视深渊的时候，深渊也在凝视你****************************
//***************************当你凝视深渊的时候，深渊也在凝视你****************************
//***************************当你凝视深渊的时候，深渊也在凝视你****************************
console.log("js is ready")
//view是否初始化
function isExist(view,isShow, viewName) {
    if (!view) {
        if(isShow){
            console.log(viewName + "is not found")
        }
        return false
    } else {
        return true
    }
}
//字符串包含
function isContains(parentStr, substr) {
    return parentStr.indexOf(substr) >= 0;
}

//翻倍超过预设值，停止脚本工作
function stopWork() {
    console.log("stop----work---")
    location.replace("http://baidu.com")
}

function reStartWork(tag) {
    console.log("==restart work ==" + tag)
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

function showAnlMap() {
    var sum = anlMap["sum"]
    console.log("anl:sum:" + sum)
    for (var key in anlMap) {
        if(key=="sum"){
            continue
        }
        var fixedNum=anlMap[key] / sum
        console.log("anl:" + key + ":" + anlMap[key] + ",比例：" + fixedNum.toFixed(2))
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
    console.log("***总数： " + sumCount + "***")
    //console.log("***一倍率： "+one_show_count+" ***")
    // console.log("***二倍率： "+two_show_count+" ***")
    //console.log("***三倍率： "+three_show_count+" ***")
    // console.log("***四倍率： "+four_show_count+" ***")
    // console.log("***五倍率： "+five_show_count+" ***")
    //  console.log("***六倍率： "+six_show_count+" ***")
    //  console.log("***MORE倍率： "+sumMore+" ***")
    var rOne=sumOne / sumCount
    var rTwo=sumTwo / sumCount
    var rThree=sumThree / sumCount
    var rFour=sumFour / sumCount
    var rFive=sumFive / sumCount
    var rSix=sumSix / sumCount
    var rSeven=sumSeven / sumCount
    var rMore=sumMore / sumCount
    console.log("***一倍率： " + sumOne + " ,占比: " + rOne.toFixed(2) + " ***")
    console.log("***二倍率： " + sumTwo + " ,占比: " + rTwo.toFixed(2) + " ***")
    console.log("***三倍率： " + sumThree + " ,占比: " + rThree.toFixed(2) + " ***")
    console.log("***四倍率： " + sumFour + " ,占比: " + rFour.toFixed(2) + " ***")
    console.log("***五倍率： " + sumFive + " ,占比: " + rFive.toFixed(2) + " ***")
    console.log("***六倍率： " + sumSix + " ,占比: " + rSix.toFixed(2) + " ***")
    console.log("***七倍率： " + sumSeven + " ,占比: " + rSeven.toFixed(2) + " ***")
    console.log("***MORE倍率： " + sumMore + " ,占比: " + rMore.toFixed(2) + " ***")
}

//PROCESS 1 从聊天室打开快三计划
var myOpenQ3Act = function() {
    //roundCount++
    //console.log("round:"+roundCount)
    //打开菜单按钮
    setTimeout(function() {
        var menuBtn = $('[class="tg-lottery"]')[0]
        if (isExist(menuBtn, false,"聊天室-菜单")) {
            menuBtn.click()
        } else {
            return
        }
        setTimeout(function() {
            var q3Btn = $('[class="pcdd-tab"]').find("li").eq(0)
            if (isExist(q3Btn, true,"聊天室-快三计划按钮")) {
                q3Btn.click()
            } else {
                console.log("--聊天室-快三计划按钮--异常--")
                return
            }
            myChatRoomDataAnalysis()
        }, 2000 * timeTag) //快三按钮组件时间
    }, 3300 * timeTag)
}
var round=0
//PROCESS 2 统计投注记录，分析倍率，投注大小
function myChatRoomDataAnalysis() {
    setTimeout(function() {

        betting_index = $('[class="tab-menu posRel"]').find("table").find("tr").eq(1).find("td").eq(0).text()
        if(init){ //初始化
            winning_win_index = parseInt(betting_index)
            //刷新参数，有新开的奖项
            betting_last_index = parseInt(betting_index)
            console.log("init:" + betting_last_index)
            if (isExist(winning_view,false)) { //若上一次开奖是跟计划，则跳发计划
                isFollow = false
            } else {
                isFollow = true
            }
            init = false
            return
        }else if (parseInt(betting_last_index) >= parseInt(betting_index)) {
            console.log(betting_index+"期刷新中")
            return
        }
        round++
        console.log("round:"+round)
        //存储上一个信息
        if(!init){
            winning_view = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index).find("td").eq(2).find('[class="circle active"]')[0]
            //判断胜负
            if(isExist(winning_view)&&l_isFollow||!l_isFollow&&!isExist(winning_view)){//胜利
                l_win=true
            }else{
                l_win=false
            }
            if(l_win){
                l_result_value=l_real_value
            }else{
                if(isExist(l_real_value,'大')){
                    l_result_value='小'
                }else{
                    l_result_value='大'
                }
            }
            if(betting_index!= undefined){
                startLocalAdd()
            }
        }


        //期数拼接，20190416119
        l_no=blankii.getDateStr()+betting_index
        betting_type = $('[class="tab-menu posRel"]').find("table").find("tr").eq(1).find("td").eq(2).find("span").eq(0).text()
        if(isContains(betting_type,'大')){
            l_plan_value='大'
        }else{
            l_plan_value='小'
        }
        //检验是否同期
        if (!init) { //非初始化
            //var lastVal=betting_last_index+1
            if (betting_index == 21) {
                reStartWork("=======21期开始========")
                return
            }

            if(isNaN(parseInt(betting_index))||!isExist(betting_index)){
                reStartWork("betting_index is NaN")
            }
            if (betting_index <= anlCount + 1) {
                console.error("=======过滤0-21期数=========")

                return
            }
            if (betting_index >= 990 && filter990Tag == true) {
                console.error("=========过滤990期数===========")
                return
            } else {
                filter990Tag = false

            }

            //console.log("判断赢否：isFollow："+isFollow+",isExist(winning_view):"+isExist(winning_view))
            if (isFollow && isExist(winning_view,false) || !isFollow && !isExist(winning_view,false)) {
                winning_win_index = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index).find("td").eq(0).text()
                betting_last_rate = 0
                console.error("--中奖期数： " + winning_win_index + "--")
                if (betting_index >= 990) { //过滤990-999分段，避免bug
                    filter990Tag = true

                    betting_last_index=0
                    // betting_last_index=21
                    return
                }
            } else {
                //未中 分析概率
                if (anlProbIndex != "") {

                    var value = parseNum(anlMap[anlProbIndex])
                    value++
                    anlMap[anlProbIndex] = value

                    //分析-总数
                    anlProbIndex = "sum"
                    var anlValue = parseNum(anlMap[anlProbIndex])
                    anlValue++
                    anlMap[anlProbIndex] = anlValue
                }
            }
            showAnlMap()

            if (betting_index == 21) {
                winning_win_index = 21
            }

            if (anlShockCount <= 1 && isAnlShock) {
                anlShockCount++
                isFollow = true
                anlProbIndex = "dShock"
            } else {
                //智能分析
                myAnlStartWork()
                anlShockCount = 0
            }

        }
        //参与投注的期数
        haveOrderCount++

        //刷新参数，有新开的奖项
        betting_last_index = parseInt(betting_index)
        //统计倍率
        betting_last_rate = parseInt(betting_index) - parseInt(winning_win_index) //倍率

        if (winning_win_index == 999) {
            betting_last_rate = 1
        }
        //console.log("betting_index:"+betting_index+"winning_win_index:"+winning_win_index)
        //统计大小
        // var betting_type=$('[class="tab-menu posRel"]').find("table").find("tr").eq(1).find("td").eq(2).find('[class="circle"]').eq(0).text()//待开项
        if (isFollow) {
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
        var touzhuType = ""
        switch (chooseTag) {
            case 0:
            touzhuType = "小"
            break
            case 1:
            touzhuType = "大"
            break
        }
        l_isFollow=isFollow
        l_real_value=touzhuType
        l_rate=betting_last_rate
        console.log(betting_index + "期投注：" + touzhuType + "," + betting_last_rate + "倍")

        //倍率统计
        switch (betting_last_rate) {
            case 0:
            console.error("=======异常：倍率为0，检查逻辑======")
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
                //  case 8:
                //      data_times=1200
                //      eight_show_count++
                //      break
                default:
                more_show_count++
                //console.log("=====倍率异常，betting_last_rate:"+betting_last_rate+"===")
                //stopWork()
                //reStartWork("倍率异常")
                reStartWork("=======倍率异常=======")
                break
            }


            //myReadyAndStartJumpToLottery()
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

    var anl1 = myAnlCollectWork(0, anlBaseNum)
    var anl2 = myAnlCollectWork(anlBaseNum, 2*anlBaseNum)
    var anl3 = myAnlCollectWork(2*anlBaseNum, 3*anlBaseNum)

    var pm_f_1 = isBoolean(anl1.fc - anl1.nc)
    var pm_f_2 = isBoolean(anl2.fc - anl2.nc)
    var pm_f_3 = isBoolean(anl3.fc - anl3.nc)

    var pm_t_1 = isBoolean(anl1.bc - anl1.sc)
    var pm_t_2 = isBoolean(anl2.bc - anl2.sc)
    var pm_t_3 = isBoolean(anl3.bc - anl3.sc)

    //A计划：当 跟与不跟 的差值大于等于 大与小的差值时 采用跟与不跟判断
    //B计划：反正采用 大与小判断
    //C计划：波动不明显分析不足以判断，遂固定为跟龙

    if (Math.abs(anl.fc - anl.nc) - Math.abs(anl.bc - anl.sc) >= 0) { //A计划
        //console.log("=====分析：A计划=====")
        if (pm_f_1 == true && pm_f_2 == true && pm_f_3 == true) { //+++ +

            myAnlChildFun(false, "a111")
        } else if (pm_f_1 == false && pm_f_2 == true && pm_f_3 == true) { //-++ -

            myAnlChildFun(false, "a011")
        } else if (pm_f_1 == false && pm_f_2 == false && pm_f_3 == true) { //--+ -

            myAnlChildFun(false, "a001")
        } else if (pm_f_1 == false && pm_f_2 == false && pm_f_3 == false) { //--- -

            myAnlChildFun(true, "a000")
        } else if (pm_f_1 == true && pm_f_2 == false && pm_f_3 == false) { //+-- +

            myAnlChildFun(true, "a100")
        } else if (pm_f_1 == true && pm_f_2 == true && pm_f_3 == false) { //++- +

            myAnlChildFun(true, "a110")
        } else if (pm_f_1 == true && pm_f_2 == false && pm_f_3 == true) { //+-+ -

            myAnlChildFun(true, "a101")
        }
        else if (pm_f_1 == false && pm_f_2 == true && pm_f_3 == false) { //-+- +

            myAnlChildFun(true, "a010")
        }
    } else { //B计划
        //console.log("=====分析：B计划=====")
        if (pm_t_1 == true && pm_t_2 == true && pm_t_3 == true) { //+++ +

            myAnlChildFun(false, "b111")
        } else if (pm_t_1 == false && pm_t_2 == true && pm_t_3 == true) { //-++ -

            myAnlChildFun(false, "b011")
        } else if (pm_t_1 == false && pm_t_2 == false && pm_t_3 == true) { //--+ -

            myAnlChildFun(false, "b001")
        } else if (pm_t_1 == false && pm_t_2 == false && pm_t_3 == false) { //--- -

            myAnlChildFun(true, "b000")
        } else if (pm_t_1 == true && pm_t_2 == false && pm_t_3 == false) { //+-- +

            myAnlChildFun(true, "b100")
        } else if (pm_t_1 == true && pm_t_2 == true && pm_t_3 == false) { //++- +

            myAnlChildFun(true, "b110")
        } else if (pm_t_1 == true && pm_t_2 == false && pm_t_3 == true) { //+-+ -

            myAnlChildFun(true, "b101")
        } else if (pm_t_1 == false && pm_t_2 == true && pm_t_3 == false) { //-+- +

            myAnlChildFun(true, "b010")
        }
        if (isContains(betting_type, "小") && isFollow == false || isContains(betting_type, "大") && isFollow == true) { //真实是小
            isFollow = true
        } else {
            isFollow = false
        }
    }
    //console.log(betting_index + "期分析结果：" + anlProbIndex+",follow:"+isFollow)
}

function myAnlChildFun(isFollowTag, probIndexTag) {

    if(isContains(probIndexTag,"000")||isContains(probIndexTag,"111")||isContains(probIndexTag,"001")||isContains(probIndexTag,"110")){
        isFollow=!isFollow
    }else{
        isFollow = isFollowTag
    }
    //isFollow = isFollowTag
    anlProbIndex = probIndexTag
    l_anl_model= probIndexTag
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

    for (var i = sIndex; i < eIndex; i++) {
        var anl_index = $('[class="tab-menu posRel"]').find("table").find("tr").eq(winning_index + i).find("td").eq(0).text()
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
        //console.log("分析中："+anl_index+"期，跟计划："+isExist(anl_awardView)+",type:"+anl_real_text)
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
    //  console.log("分析期数：" + sIndex + "-" + eIndex)
    //console.log("分析中：" + "跟计划数：" + anl_follow_count + "不跟数：" + anl_no_follow_count + ",gap:" + anl_follow_gap + ",正负：" + anl_follow_pm)
    // console.log("分析中：" + "大个数：" + anl_big_count + ",小个数：" + anl_small_count + ",gap:" + anl_sb_gap + ",正负：" + anl_sb_pm)
    //console.log("分析中：" + "跟龙数：" + anl_genlong_count + ",花龙数：" + anl_hualong_count + ",gap:" + anl_long_gap)

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
                    // console.log("===============分===================")
                } else {
                    console.log("---投注页——分---异常")
                    return
                }
            }

            var count = 2
            while (count < data_times * baseJin) {
            var plusBtn = $('[class="plus icon-m-p lf"]').eq(0) //加注
            if (isExist(plusBtn, true,"投注页-加注")) {
                plusBtn.click()
            } else {
                console.log("--投注页——加注---异常---")
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
        //console.log("***投注说明***")
        //var data_type=chooseTag==0?"小":"大"
        //var showFollow=isFollow==true?"是":"否"
        //console.log("***     "+betting_index+" 期投注 ***")
        //console.log("***    选择 "+data_type+"    ***")
        //console.log("***    计划 "+showFollow+"    ***")
        //console.log("***    倍数 "+data_times+"    ***")
        //console.log("***    投入 "+data_times*baseJin+unit+"  ***")
        //console.log("*********倍率评率**********")
        // showDataResult()

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
    }, 2000 * timeTag)
}


//PROCESS 4-2 投注页面-提交订单
function myClickSumbitOrder() {
    setTimeout(function() {

        if (!isTest) {
            var orderBtn = $('[class="order"]')[0]
            orderBtn.click()
            l_time=dateFtt("yyyy-MM-dd hh:mm:ss",new Date())
            console.log("*******完成投注*********")
        }

        myLotteryBackToChatRoom()
    }, 2800 * timeTag) //延迟投注
}

//PROCESS 4-2-1跳转回聊天室
function myLotteryBackToChatRoom() {
    setTimeout(function() {
        location.replace(chatRoomUrl)

        //myOpenQ3Act()
    }, 1000 * 3 * timeTag) //延迟跳转会聊天室
}

//本地存储
/**************************************时间格式化处理************************************/
function dateFtt(fmt,date)
{ //author: meizz
    var o = {
        "M+" : date.getMonth()+1,     //月份
        "d+" : date.getDate(),     //日
        "h+" : date.getHours(),     //小时
        "m+" : date.getMinutes(),     //分
        "s+" : date.getSeconds(),     //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S" : date.getMilliseconds()    //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }


    var DB_NAME = 'indexedDB-test', VERSION = 1, db;
    var request = indexedDB.open(DB_NAME, VERSION);
    request.onsuccess = function(event) {
        db = event.target.result;
    // console.log(event.target === request); // true
    db.onsuccess = function(event) {
        console.log('数据库操作成功!');
    };
    db.onerror = function(event) {
        console.error('数据库操作发生错误！', event.target.errorCode);
    };
    console.log('打开数据库成功!');
};
request.onerror = function(event) {
    console.error('创建数据库出错');
    console.error('error code:', event.target.errorCode);
};


request.onupgradeneeded = function(event) {
    // 更新对象存储空间和索引 ....
    console.log("onupgradeneeded")
    var database = event.target.result;
    var objectStore
    if (!database.objectStoreNames.contains('800w')) {
        objectStore = database.createObjectStore("800w",{ autoIncrement: true });
        objectStore.createIndex('no', 'no', { unique: false });
        objectStore.createIndex('plan_value', 'plan_value', { unique: false });
        objectStore.createIndex('real_value', 'real_value', { unique: false });
        objectStore.createIndex('result_value', 'result_value', { unique: false });
        objectStore.createIndex('win', 'win', { unique: false });
        objectStore.createIndex('rate', 'rate', { unique: false });
        objectStore.createIndex('anl_model', '', { unique: false });
        objectStore.createIndex('isFollow', 'isFollow', { unique: false });
        objectStore.createIndex('time', 'time', { unique: false });
       // fc: anl_follow_count,
       // nc: anl_no_follow_count,
       // bc: anl_big_count,
       // sc: anl_small_count

       // objectStore.createIndex('isFollow', 'isFollow', { unique: false });
   }
};

function startLocalAdd(){
    // 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
    var transaction = db.transaction('800w', 'readwrite');

    // 通过事务来获取IDBObjectStore
    var store = transaction.objectStore('800w');
    var addPersonRequest = store.add({
        no: l_no,//期数
        plan_value:l_plan_value,//计划
        real_value: l_real_value,//实际投注

        rate:l_rate,//投注倍率
        anl_model:l_anl_model,//分析结果
        isFollow:l_isFollow,//是否跟计划
        time:l_time,//时间

        result_value:l_result_value,//实际结果
        win:l_win//是否赢
    });
    // 监听添加成功事件
    addPersonRequest.onsuccess = function(e) {
        console.log("sql add success:"+e.target.result); // 打印添加成功数据的 主键（id）
    };

    // 监听失败事件
    addPersonRequest.onerror = function(e) {
        console.log("sql add fail:"+e.target.error);
    };

}

var isLotteryRefresh
//start
var startWork = setInterval(function() {
    var webHash = location.hash
    //console.log(webHash)
    if (isContains(webHash, hash_chatRoom)) {
        //console.log("----chatroom刷新----")
        myOpenQ3Act()
        //  clearTimeout(isLotteryRefresh)
    } else if (isContains(webHash, hash_lottery)) { //跳转再刷新
        //console.log("---lottery---")
        //location.replace(chatRoomUrl)
        //isLotteryRefresh=setTimeout(function(){
        //    reStartWork("心跳异常")
        // },1000*60*5)
    }
}, flashTime)