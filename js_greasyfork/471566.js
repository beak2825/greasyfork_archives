// ==UserScript==
// @name         gm论坛每日魔改
// @description  右下角有小菜单栏速通签到日志投票，一键批量送勋章，延时回帖
// @version      0.4.1
// @license      GNU General Public License v3.0
// @match        https://www.gamemale.com/*
// @grant        GM_log
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://code.jquery.com/jquery-2.1.4.min.js

// @namespace https://greasyfork.org/users/1134596
// @downloadURL https://update.greasyfork.org/scripts/471566/gm%E8%AE%BA%E5%9D%9B%E6%AF%8F%E6%97%A5%E9%AD%94%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/471566/gm%E8%AE%BA%E5%9D%9B%E6%AF%8F%E6%97%A5%E9%AD%94%E6%94%B9.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';
    button();
    if (origin == getdata_gm("gm_origin")) {
        console.log("位于gm网站");

        if (getdata_gm("mode") == "running") {        //检查运行模式
            let todo = getdata_gm("functionTodo")
            if (todo != "null") {
                if (todo == "executeVote") {
                    $("div.player").remove();                    //如果有播放器先移除
                }
                console.log("【运行模式】待办为：", getdata_gm("functionTodo"), "开始执行");
                setTimeout(function () {
                    executeTodo();
                }, 1500);
            }
            else {
                console.log("【运行模式】待办为空");
            }
        }
        else if (getdata_gm("mode") == "stop") {
            console.log("【关闭模式】不执行todo");
        }
        else {
        }
    }
})();
function executeTodo() {//一次只执行一个
    let todo = getdata_gm("functionTodo")
    if (todo == "signInTodo") {
        signInTodo();
    }
    if (todo == "log") {
        log();
    }
    else if (todo == "findLog") {
        findLog();
    }else if (todo == "visitSpace") {
        visitSpace();
    }else if (todo == "expressLog") {
        expressLog();
    }
    else if (todo == "getSearchVoteUrlBegin") {
        getSearchVoteUrlBegin();
    } else if (todo == "getSearchVoteUrlOnGoing") {
        getSearchVoteUrlOnGoing();
    } else if (todo == "getSearchVoteUrl") {
        getSearchVoteUrl();
    }
    if (todo == "vote") {
        vote();
    }
    else if (todo == "findVotePost") {
        findVotePost();
    }
    else if (todo == "executeVote") {
        executeVote();
    } else if (todo == "executeMedal") {
        executeMedal();
    } else if (todo == "endMedal") {
        endMedal();
    }
    else if (todo == "executeVoteFinished") {
        executeVoteFinished();
    }
    else {
        console.log("executeTodo error");
    }
}



//只在4个按钮点击的时候触发
function dataInit() {
    console.log("=====初始化数据======");
    var gm_origin = "https://www.gamemale.com";
    var gm_log = "https://www.gamemale.com/home.php?mod=space&do=blog&view=all&catid=14&page=";
    // var urlVote = "https://www.gamemale.com/search.php?mod=forum&searchid=622&orderby=dateline&ascdesc=desc&searchsubmit=yes&page=";//searchid是会变的，后续会更新这个值
    let gm_search = "https://www.gamemale.com/search.php?mod=forum&adv=yes";
    let spacelist1 = "https://www.gamemale.com/space-uid-610657.html"
    let spacelist2 = "https://www.gamemale.com/space-uid-710261.html"
    let spacelist3 = "https://www.gamemale.com/space-uid-710380.html"
    let url_ipproxy = "https://www.croxyproxy.com/_zh";
    let visitChecked = 1
    setdata_gm("visitChecked", visitChecked);
    setdata_gm("spacelist1", spacelist1);
    setdata_gm("spacelist2", spacelist2);
    setdata_gm("spacelist3", spacelist3);
    setdata_gm("gm_origin", gm_origin)
    setdata_gm("gm_log", gm_log)
    // setdata_gm("gm_vote", urlVote)
    setdata_gm("gm_search", gm_search)
    setdata_gm("mode", "stop")
    setdata_gm("functionTodo", "null");
    // setdata_gm("Quickpass", "false");//只在点击的时候触发改变true/flase

}
function setdata_gm(key, value) {
    GM_setValue(key, value);
}
function getdata_gm(key) {
    return GM_getValue(key);
}

function btnClickReset() {
    dataInit();
    setdata_gm("Quickpass", "false");
    alert("数据已初始化/停止执行");
}

function btnClickAll() {
    dataInit()
    setdata_gm("Quickpass", "true");
    let numLogInput
    let numVoteInput
    let pageLog
    let pageVote
    let numLogbegin
    let numVotebegin
    let input = prompt("确认速通一键签到日志投票吗？\n默认从第1页第1个开始执行12次日志表态，\n从第1页第1个投票贴开始执行10次投票（遇到已投票的帖子不会执行），\n需要请修改数字", "日志表态：第1页第1个执行12次；投票：第1页第1个执行10次");
    if (input == "") {
        pageLog = "1"
        pageVote = "1"
        numLogbegin = "1"
        numVotebegin = "1"
        numLogInput = "12";
        numVoteInput = "10"
    } else {
        //控制台监控无法查看数组，需要log
        // var str = " mm -4193 1 with words"
        // let s1=str.match(/\d+/g) // ["4193", "1"]
        // let s2= str.match(/\d+/)
        let re = /\d+/g//g：查询多次，而不是查询第一个符合
        let numbers = input.match(re);
        pageLog = numbers[0]
        numLogbegin = numbers[1]
        numLogInput = numbers[2]
        pageVote = numbers[3]
        numVotebegin = numbers[4]
        numVoteInput = numbers[5]
    }
    setdata_gm("pageLog", pageLog);
    setdata_gm("pageVote", pageVote);
    setdata_gm("numLogInput", numLogInput);
    setdata_gm("numLogCheckedPerPage", Number(numLogbegin) - 1);//当前已经检查日志个数=起始个数-1
    setdata_gm("numVotePostCheckedPerPage", Number(numVotebegin) - 1);//当前已经检查投票贴个数
    setdata_gm("numVoteInput", numVoteInput);

    signIn();
}



function btnClickSign() {
    dataInit();


    if (confirm("确认一键签到吗？")) {
        signIn();
    }
    else {
        alert("已取消。");
    }
}

function btnClickLog() {
    if (getdata_gm("Quickpass") != "true") {
        dataInit();
        let numLogInput
        let pageLog
        let numLogbegin

        let input = prompt("确认一键日志吗？\n默认从第1页的第1个日志开始执行12次日志表态，\n需要请修改数字",
            "日志表态：第1页第1个执行12次");
        if (input == "") {
            pageLog = "1"
            numLogbegin = "1"
            numLogInput = "12";
        } else {
            let re = /\d+/g//g：查询多次，而不是查询第一个符合
            let numbers = input.match(re);
            pageLog = numbers[0]
            numLogbegin = numbers[1]
            numLogInput = numbers[2]
        }
        setdata_gm("pageLog", pageLog);
        setdata_gm("pageLog", pageLog);
        setdata_gm("numLogInput", numLogInput);
        setdata_gm("numLogCheckedPerPage", Number(numLogbegin) - 1);//当前已经检查日志个数
    }

    log();
}

function btnClickVote() {
    if (getdata_gm("Quickpass") != "true") {
        dataInit();
        let numVoteInput
        let pageVote
        let numVotebegin
        let input = prompt("确认一键投票吗？默认从第1页的第1个投票贴开始执行10次投票（遇到已投票的帖子不会执行），需要请修改数字",
            "投票：第1页第1个执行10次");
        if (input == "") {
            pageVote = "1"
            numVotebegin = "1"
            numVoteInput = "10"
        } else {
            let re = /\d+/g//g：查询多次，而不是查询第一个符合
            let numbers = input.match(re);
            pageVote = numbers[0]
            numVotebegin = numbers[1]
            numVoteInput = numbers[2]

        }
        setdata_gm("pageVote", pageVote);
        setdata_gm("numVoteInput", numVoteInput);
        setdata_gm("numVotePostCheckedPerPage", Number(numVotebegin) - 1);//当前已经检查投票贴个数

    }
    getSearchVoteUrlBegin()
}
function btnClickMedal() {
    if (getdata_gm("Quickpass") != "true") {
        dataInit();
    }
    // setdata_gm("mode", "running");
    // setdata_gm("functionTodo", 'executeMedal')
    // window.location.href = "https://www.gamemale.com/forum.php?mod=viewthread&tid=100890&highlight=%E5%8B%8B%E7%AB%A0";
    myWindow = window.open('');
    myWindow.document.write(getHtmlText());
    myWindow.focus();
}
function executeMedal() {
    // setdata_gm("functionTodo", 'endMedal')
    // document.querySelector("#postmessage_1260270 > input[type=button]:nth-child(30)").click()

}

function endMedal() {
    // setdata_gm("functionTodo", 'null')
}



/**jq .click()模拟鼠标点击,触发html的onclick
 * $(function(){
            $("#btn1").click(function(){
                //alert($("#form1 :input").size());
                //alert($("#form1 :input").length);
                alert($("#form1 input").size());
            });
      });
 *
 */
function signIn() {
    setdata_gm("mode", "running");
    console.log("signin任务开始执行");
    setdata_gm("functionTodo", "signInTodo")


    self.location.href = "https://www.gamemale.com/forum.php"
}

function signInTodo() {
    console.log("signin的todo任务开始执行");
    console.log("signin的todo任务执行结束");
    if (getdata_gm("Quickpass") == "true") {
        setdata_gm("functionTodo", "log")
    } else {
        setdata_gm("functionTodo", "null")
    }

    self.location.href = $("div#midaben_sign").children().children().attr("href");

}



function log() {
    let numLogInput = Number(getdata_gm("numLogInput"));
    if (numLogInput > 0) {
        setdata_gm("mode", "running");
        // setdata_gm("pageLog", "1");//    当前页//执行前已初始化
        setdata_gm("numLogToCheckPerPage", "10");//每页日志个数
        // setdata_gm("numLogCheckedPerPage", "0");//当前已经检查日志个数。为0从第一个开始检查 //执行前已初始化
        setdata_gm("SumLogchecked", "0");//总共已完成日志数
        setdata_gm("SumLogToCheck", getdata_gm("numLogInput"));//需要完成日志数
        /**Log结束
        Todo找日志存入待办
        Todofunction=findLog */
        setdata_gm("functionTodo", "findLog");
        self.location.href = getdata_gm("gm_log") + getdata_gm("pageLog");
    }

}


function findLog() {
    //
    console.log("findlog开始");
    //可以直接在元素上悬浮查看筛选器
    // $("p.intro") 选取所有 class="intro" 的 <p> 元素。
    //// eq(1)【符合筛选器的第二个元素】将id为test的元素的第二个子元素样式设置为’display’:‘inline-block’
    // $('#test').children().eq(1).css({'display':'inline-block'});
    //children()是一个集合！在里面添加p.intro来筛选
    let numLogToCheckPerPage = $("div.xlda.xlda").children("dl").length;//获取子代个数
    let numLogCheckedPerPage = getdata_gm("numLogCheckedPerPage");
    let urlToVisit = $("dt.xs2").children().eq(numLogCheckedPerPage).attr("href");

    setdata_gm("numLogToCheckPerPage", numLogToCheckPerPage);
    console.log("【findLog】当前页共有", numLogToCheckPerPage, "个日志。正在访问当前页面的第", Number(numLogCheckedPerPage) + 1, "个日志：", urlToVisit);//第一个孩子：0，第二个孩子：1
    setdata_gm("functionTodo", "expressLog");

    console.log("【findLog】findlog结束，即将开始expresslog");
    self.location.href = urlToVisit;
}
function visitSpace() {
    //
    console.log("visitSpace开始");
    setdata_gm("visitChecked",getdata_gm("visitChecked")+1)
    console.log("visitSpace结束");
    setdata_gm("functionTodo", "findLog");
    self.location.href = getdata_gm("gm_log") + String( getdata_gm("pageLog"))

}


/**
 * 转换成字符串：
 * age = String(age);
 * 转换成数字：
 * a = Number(a);
 */
function expressLog() {
    console.log("expressLog开始");
    // let urlToVisit=$("tbody").children().children().children().attr("href");
    let pageLog = Number(getdata_gm("pageLog"));
    let SumLogToCheck = Number(getdata_gm("SumLogToCheck"));
    let numLogToCheckPerPage = Number(getdata_gm("numLogToCheckPerPage"));
    $("tbody").children().children().children().click();
    //当前页完成数和总完成数+1
    let numLogCheckedPerPage = Number(getdata_gm("numLogCheckedPerPage")) + 1;
    let SumLogchecked = Number(getdata_gm("SumLogchecked")) + 1;
    setdata_gm("numLogCheckedPerPage", String(numLogCheckedPerPage));
    setdata_gm("SumLogchecked", String(SumLogchecked));
    //判断是否全部完成

    if (SumLogchecked == SumLogToCheck) {
        console.log("【expressLog】日志表态全部已完成，待办清空。================");
        if (getdata_gm("Quickpass") == "true") {
            btnClickVote();
        } else {
            setdata_gm("functionTodo", "null");
            alert("【expressLog】已结束，请确认是否有遗漏")
            self.location.href = "https://www.gamemale.com/home.php?mod=spacecp&ac=credit&op=log&suboperation=creditrulelog"
        }
    } else {
        //判断是否需要前往下一页
        if (numLogCheckedPerPage == numLogToCheckPerPage) {//当页已全部完成
            numLogCheckedPerPage = 0;
            pageLog = pageLog + 1;
            setdata_gm("numLogCheckedPerPage", String(numLogCheckedPerPage));
            setdata_gm("pageLog", String(pageLog));
        }

        console.log("【expressLog】结束，即将前往第", pageLog, "页日志执行findLog");
        switch (getdata_gm("visitChecked")) {
            case 1:
                setdata_gm("functionTodo", "visitSpace");
                self.location.href = getdata_gm("spacelist1")
                break;

            case 2:
                setdata_gm("functionTodo", "visitSpace");
                self.location.href = getdata_gm("spacelist2")
                break;

            case 3:
                setdata_gm("functionTodo", "visitSpace");
                self.location.href = getdata_gm("spacelist3")
                break;
            default:
                setdata_gm("functionTodo", "findLog");
                self.location.href = getdata_gm("gm_log") + String(pageLog);
        }


    }
    // console.log("expressLog结束，待办清空");
    // setdata_gm("functionTodo", "null");
}

//获取每日的搜索url
function getSearchVoteUrlBegin() {
    setdata_gm("mode", "running");
    GM_setValue("functionTodo", "getSearchVoteUrlOnGoing");
    self.location.href = GM_getValue("gm_search");
    //页面跳转
}
function getSearchVoteUrlOnGoing() {
    //设置搜索条件
    document.querySelector("#ct > div > div > div.bm_c > form > table > tbody > tr:nth-child(4) > td > label:nth-child(1) > input").checked = true;
    document.querySelector("#orderby1").value = "dateline";

    //页面跳转
    GM_setValue("functionTodo", "getSearchVoteUrl");
    document.querySelector("#ct > div > div > div.bm_c > form > table > tbody > tr:nth-child(8) > td > button").click();
}

function getSearchVoteUrl() {
    let url = self.location.href;
    let re = /\d+/;
    let searchid = url.match(re);
    url = "https://www.gamemale.com/search.php?mod=forum&searchid=" + searchid[0] + "&orderby=dateline&ascdesc=desc&searchsubmit=yes&page=";
    GM_setValue("gm_vote", url);
    //获取最新地址任务结束
    GM_setValue("functionTodo", "vote");
    console.log("searchid更新");
    //两个操作整合
    vote();
}
/**
 * @description: 初始化数据，然后跳转到搜索投票贴页面，
 * @return {*}
 */
function vote() {
    let numVoteInput = Number(getdata_gm("numVoteInput"));
    if (numVoteInput > 0) {
        setdata_gm("mode", "running");
        // setdata_gm("pageVote", "1");//    当前页，执行前已初始化
        setdata_gm("numVotePostToCheckPerPage", "30");//每页投票贴个数
        // setdata_gm("numVotePostCheckedPerPage", "0");//当前已经检查投票贴个数//执行前已初始化
        setdata_gm("SumVotePostChecked", "0");//总共已完成投票贴数
        setdata_gm("SumVotePostToCheck", getdata_gm("numVoteInput"));//需要完成投票贴数
        /**vote结束
        Todo找投票贴存入待办
        Todofunction=findVotePost */
        setdata_gm("functionTodo", "findVotePost");
        self.location.href = getdata_gm("gm_vote") + getdata_gm("pageVote");
    } else {
        alert("设置的投票次数为0")
    }
}



/**
 * @description: 在搜索结果页面寻找投票贴
 * @return {*}
 */
function findVotePost() {
    ////直接右键元素复制js路径。js的document的child从1开始计数，jQuery从0开始
    console.log("findVotePost");
    let numVotePostToCheckPerPage = $("#threadlist").children().children().length;//获取帖子列表个数,30
    let numVotePostCheckedPerPage = getdata_gm("numVotePostCheckedPerPage");//获取当页已点过的帖子个数
    let urlToVisit = $(".xs3").eq(Number(numVotePostCheckedPerPage)).children().attr("href");//获取下一个要访问的帖子链接(xst类的第二个元素) #\31 06414 > h3 > a
    let maxPageNumVote = getMaxPageNumVote();
    setdata_gm("maxPageNumVote", maxPageNumVote)//最大页数
    setdata_gm("numVotePostToCheckPerPage", numVotePostToCheckPerPage);////存储帖子列表个数
    console.log("【findVotePost】当前页共有", numVotePostToCheckPerPage, "个。正在访问当前页面的第", Number(numVotePostCheckedPerPage) + 1, "个投票贴：", urlToVisit);//第一个孩子：0，第二个孩子：1
    setdata_gm("functionTodo", "executeVote");

    console.log("【findVotePost】结束，即将开始executeVote");
    self.location.href = urlToVisit;
    // window.open(urlToVisit);
}
/**
 * @description: 在查询页使用，获取搜索结果的个数
 * @return {*}
 */
function getMaxPageNumVote() {
    //判断当前页数是否已经是最后一页
    // let str =document.querySelector("#ct > div > div > div.pgs.cl.mbm > div > label > span").innerText //dom方法innerText
    let str = $(".nxt").siblings("label").children("span").text();//jq方法text
    let re = /\d+/
    let numbers = str.match(re);
    return numbers[0]
}

/**
 * @description: 在投票帖内执行投票，然后返回搜索页
 * @return {*}
 */
function executeVote() {
    console.log("executeVote开始");

    let SumVotePostChecked = Number(getdata_gm("SumVotePostChecked"));

    //如果投票可用：总共检查数+1
    if ($("input#option_1.pr").length != 0) {
        console.log("【executeVote】此贴可投票。执行中。");
        //获取勾选框设置为真,提交forum
        /**
         * 然后会自动刷新页面，相当于页面跳转。刷新后再执行下面内容
         */
        SumVotePostChecked = SumVotePostChecked + 1;
        setdata_gm("SumVotePostChecked", String(SumVotePostChecked));
        setdata_gm("functionTodo","executeVoteFinished");
        $("input#option_1.pr").click();
        $('form#poll').submit();
        
    } else {
        console.log("【executeVote】此贴不可投票，正在返回");
        executeVoteFinished();
    }
    
    // console.log("expressLog结束，待办清空");
    // setdata_gm("functionTodo", "null");
}

function executeVoteFinished(){
    let pageVote = Number(getdata_gm("pageVote"));
    let SumVotePostToCheck = Number(getdata_gm("SumVotePostToCheck"));
    let numVotePostToCheckPerPage = Number(getdata_gm("numVotePostToCheckPerPage"));
    let numVotePostCheckedPerPage = Number(getdata_gm("numVotePostCheckedPerPage"));
    let SumVotePostChecked = Number(getdata_gm("SumVotePostChecked"));

    //当页检查数+1
    numVotePostCheckedPerPage = numVotePostCheckedPerPage + 1;
    setdata_gm("SumVotePostChecked", String(SumVotePostChecked));
    setdata_gm("numVotePostCheckedPerPage", String(numVotePostCheckedPerPage));
    // //判断是否全部完成
    if (SumVotePostChecked == SumVotePostToCheck) {
        console.log("【executeVote】投票全部已完成，待办清空。================");
        setdata_gm("functionTodo", "null");
        if (getdata_gm("Quickpass" == "true")) {
            setdata_gm("Quickpass", "false");
            console.log("【executeVote】速通模式已结束");
        }
        setTimeout(() => {
            alert("【executeVote】已结束，请确认是否有遗漏")
            self.location.href = "https://www.gamemale.com/home.php?mod=spacecp&ac=credit&op=log&suboperation=creditrulelog"

        }, 1500);

    } else {
        //判断是否需要前往下一页
        if (numVotePostCheckedPerPage == numVotePostToCheckPerPage) {//当页已全部完成
            numVotePostCheckedPerPage = 0;
            pageVote = pageVote + 1;
            setdata_gm("numVotePostCheckedPerPage", String(numVotePostCheckedPerPage));
            setdata_gm("pageVote", String(pageVote));

            //判断是否最后一页
            if (Number(getdata_gm("maxPageNumVote")) < pageVote) {
                alert("【executeVote】已到最后一页，投票任务提前结束")
                setdata_gm("functionTodo", "null");
                setTimeout(() => {
                    self.location.href = "https://www.gamemale.com/home.php?mod=spacecp&ac=credit&op=log&suboperation=creditrulelog"
                }, 2000);
            }
        }
        console.log("【executeVote】已完成,总共投票个数：", SumVotePostChecked, ",即将前往第", pageVote, "页投票贴列表执行findVotePost");
        setdata_gm("functionTodo", "findVotePost");
        setTimeout(() => {
            self.location.href = getdata_gm("gm_vote") + String(pageVote);
        }, 2000);
    }
}


/**
 * @description: 关闭标签页
 * @return {*}
 */
function closeWebPage() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        } else {
            window.open('', '_top');
            window.top.close();
        }
    } else if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0) {
        window.location.href = "about:blank";
        window.close();
    } else {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}

/**
 * @description: 回帖，若失败则每分钟尝试1次直到成功
 * @return {*}
 */
function replyPost() {
    console.log("尝试回帖");
    document.querySelector("#fastpostsubmit").click();
    setTimeout(() => {    //3秒后检查结果
        if (checkReply() == true) {
            closeWebPage();
        } else {
            let t = setInterval(() => {    //每分钟尝试点击一次，直到：
                console.log("再次尝试回帖");
                document.querySelector("#fastpostsubmit").click();
                setTimeout(() => {
                    if (checkReply() == true) {
                        clearInterval(t);
                        console.log("回帖成功准备关闭帖子")
                        closeWebPage();
                    }
                }, 3000);
            }, 60000);
        }
    }, 3000);
}

/**
 * @description: 检查回帖是否成功，返回true/false
 * @return {*}
 */
function checkReply() {
    let len = document.querySelector("#postlistreply").childNodes.length;
    if (len == 1) {
        return false;
    } else {
        return true;
    }
}

function btnClickVP(){
    //初始化相关数据

    //弹窗询问次数

    //执行visitPromotion
}


/**
 * @description: 访问推广任务：在个人空间点击，获取uid，跳转到代理网站
 * @return {*}
 */



function visitPromotion() {
    let uid = getUidInSpace();
    setdata_gm("uid", uid);



    setdata_gm("functionTodo","executeVisit")
    window.location.href = "https://www.croxyproxy.com/_zh"
}

/**
 * @description: 执行访问推广：复制链接https://www.gamemale.com/?fromuid=678481，点击访问，循环10次
 * @return {*}
 */
function executeVisit(uid) {
    let url="https://www.gamemale.com/?fromuid="+getdata_gm("uid")
    //如果访问满次数：弹窗结束
    //设置待办：goBackProxyWeb
    //点击go按钮跳转
}

function goBackProxyWeb(uid) {
    //设置待办：executeVisit
    //点击home返回代理网站
}

//DOM.style.cssText = 'aaa: xxx;'
/**
 * @description: 生成7个按钮
 * @return {*}
 */
function button() {
    let body = document.querySelector('body');
    let div = document.createElement('div');
    let stylebutton = 'z-index:999;fontsize:14px;position: fixed;cursor: pointer;right:10px;margin:10px;bottom:'
    let right = 10;
    div.style.cssText = stylebutton + right + 'px';
    for (i = 1; i <= 7; i++) {
        let btn = document.createElement('button');
        btn.style.cssText = stylebutton + (right + (i - 1) * 40) + 'px';
        switch (i) {
            case 1:
                btn.textContent = '延时回复';
                btn.addEventListener('click', () => {
                    replyPost()
                });
                break;

            case 2:
                btn.textContent = '重置/中断执行';
                btn.addEventListener('click', () => {
                    btnClickReset()
                });
                break;

            case 3:
                btn.textContent = '勋章赠送';
                btn.addEventListener('click', () => {
                    btnClickMedal()
                });
                break;

            case 4:
                btn.textContent = '投票';
                btn.addEventListener('click', () => {
                    btnClickVote()
                });
                break;
            case 5:
                btn.textContent = '日志';
                btn.addEventListener('click', () => {
                    btnClickLog()
                });
                break;
            case 6:
                btn.textContent = '签到';
                btn.addEventListener('click', () => {
                    btnClickSign()
                });
                break;
            case 7:
                btn.textContent = '速通';
                btn.addEventListener('click', () => {
                    btnClickAll()
                });
                break;
            default:
                console.log("error");
                break;
        }
        div.appendChild(btn);
    }
    body.appendChild(div);
    // console.log(getHtmlText());
}
/**
 * @description: 从当前url获取uid，若没有返回空
 * @return {*}
 */
function getUidInSpace() {
    let url = window.location.href
    let re = /\d+/g//g：查询多次，而不是查询第一个符合
    let res = url.match(re);
    if (res != null) {
        if (res[0].length != 6) {
            return '';
        } else {
            return res[0];
        }
    }

    // document.getElementById("zs_uid").value=uid;

}

//注意！html文本里的脚本不能有双斜杠注释，否则转为文本后会把后面全注释掉
/**
 * @description: 返回html字符串
 * @return {*}
 */
function getHtmlText() {
    let texts = ['<!-- 批量赠送勋章之单人可多选版 -->',
        '<!DOCTYPE html>',
        '<html lang="Zh-hans">',
        '<head>',
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '    <meta http-equiv="X-UA-Compatible" content="ie=edge,chorme">',
        '    <title>批量赠送勋章之单人可多选版</title>',
        '    <script type="text/javascript">',
        '        (function () {',
        '            setChekedValueByClass(\'Cost-effective\', true);',
        '            let btns = document.getElementsByTagName("button");',
        '            for (i = 0; i < btns.length; i++) {',
        '                btns[i].style = "cursor: pointer;";',
        '            }',
        '    ',
        '        })();',
        '    ',
        '        function send() {',
        '            var url = "https://www.gamemale.com/plugin.php?id=wodexunzhang:showxunzhang&action=zengsongAction&medalid=";',
        '            var uid = document.getElementById("zs_uid").value;',
        '            var str = document.getElementsByName("Checkbox[]");',
        '            var objarray = str.length;',
        '            var sum;',
        '            for (z = 0; z < objarray; z++) {',
        '                if (str[z].checked == true) {',
        '                    sum = url + str[z].value + "&zs_uid=" + uid + "&checkUID=" + uid;',
        '                    window.open(sum);',
        '                }',
        '            }',
        '        }',
        '        function setChekedValueByClass(className, boolenValue) {',
        '            if (className == "all") {',
        '                setChekedValueByClass("magic", boolenValue);',
        '                setChekedValueByClass("coin", boolenValue);',
        '            } else {',
        '                let boxes1 = document.getElementsByClassName(className);',
        '                for (i = 0; i < boxes1.length; i++) {',
        '                    boxes1[i].checked = boolenValue;',
        '                }',
        '            }',
        '        }',
        '        function setChekedValue(obj) {',
        '            if (obj.previousElementSibling.checked == true) {',
        '                obj.previousElementSibling.checked = false;',
        '            } else {',
        '                obj.previousElementSibling.checked = true;',
        '            }',
        '        }',
        '    </script>',
        '</head>',
        '<span style="cursor: pointer;">',
        '    金币勋章：',
        '    <button type="button" onclick="setChekedValueByClass(\'coin\',true)">全选</button><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective coin" name="Checkbox[]" value="143" /><span',
        '            onclick="setChekedValue(this)">萨赫的蛋糕</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective coin" name="Checkbox[]" value="150" /><span',
        '            onclick="setChekedValue(this)">神秘商店贵宾卡</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective coin" name="Checkbox[]" value="19" /><span',
        '            onclick="setChekedValue(this)">送情书</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective coin" name="Checkbox[]" value="46" /><span',
        '            onclick="setChekedValue(this)">灵光补脑剂</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="coin" name="Checkbox[]" value="20" /><span',
        '            onclick="setChekedValue(this)">丢肥皂</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="coin" name="Checkbox[]" value="45" /><span',
        '            onclick="setChekedValue(this)">千杯不醉</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="coin" name="Checkbox[]" value="174" /><span',
        '            onclick="setChekedValue(this)">变骚喷雾</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="coin" name="Checkbox[]" value="195" /><span',
        '            onclick="setChekedValue(this)">没有梦想的咸鱼</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="coin" name="Checkbox[]" value="104" /><span',
        '            onclick="setChekedValue(this)">遗忘之水</span>',
        '    </span><br><br>',
        '</span>',
        '咒术勋章：',
        '<span style="cursor: pointer;">',
        '    <button type="button" onclick="setChekedValueByClass(\'magic\',true)">全选</button><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective magic" name="Checkbox[]" value="119" /><span',
        '            onclick="setChekedValue(this)">霍格沃茨五日游</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective magic" name="Checkbox[]" value="44" /><span',
        '            onclick="setChekedValue(this)">召唤古代战士</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective magic" name="Checkbox[]" value="186" /><span',
        '            onclick="setChekedValue(this)">石肤术</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="Cost-effective magic" name="Checkbox[]" value="14" /><span',
        '            onclick="setChekedValue(this)">炼金之心</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="43" /><span',
        '            onclick="setChekedValue(this)">水泡术</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="61" /><span',
        '            onclick="setChekedValue(this)">祈祷术</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="100" /><span',
        '            onclick="setChekedValue(this)">咆哮诅咒</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="455" /><span',
        '            onclick="setChekedValue(this)">闪光糖果盒</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="456" /><span',
        '            onclick="setChekedValue(this)">茉莉啤酒</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="457" /><span',
        '            onclick="setChekedValue(this)">雷霆晶球</span>',
        '    </span><br>',
        '    <span>',
        '        <input type="checkbox" class="magic" name="Checkbox[]" value="458" /><span',
        '            onclick="setChekedValue(this)">思绪骤聚</span>',
        '    </span>',
        '</span>',
        '<br>',
        '<br>',
        '<button type="button" onclick="setChekedValueByClass(\'all\',false)">清空选择</button>',
        '<button type="button" onclick="setChekedValueByClass(\'Cost-effective\',true)">选择常用</button><br><br>',
        '对方的用户ID: <input type="text" id="zs_uid" value=730438>&nbsp&nbsp',
        '<button type="button" onclick="send()">点击赠送</button><br>',
        '<span><b>多选时会一次性弹出多个窗口，注意关闭浏览器拦截，否则只能送1个</b></span>',
        '</body>',
        '</html>'].join("");
    return texts;
}