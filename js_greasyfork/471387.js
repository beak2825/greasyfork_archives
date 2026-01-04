// ==UserScript==
// @name         天天基金数据抽取-去除估值
// @namespace    http://tampermonkey.net/
// @version      2.0.10
// @description  用以快捷显示累计净值,任期回报,平均回报,一年前累计净值,月高点,月低点
// @author       aotmd
// @match        *://fund.eastmoney.com/*
// @match        *://*.eastmoney.com/*
// @exclude      *://fund.eastmoney.com/manager/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471387/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E6%95%B0%E6%8D%AE%E6%8A%BD%E5%8F%96-%E5%8E%BB%E9%99%A4%E4%BC%B0%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/471387/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E6%95%B0%E6%8D%AE%E6%8A%BD%E5%8F%96-%E5%8E%BB%E9%99%A4%E4%BC%B0%E5%80%BC.meta.js
// ==/UserScript==
const setting = {
    是否查看近一年净值: true,//批量查看时防止卡顿,建议关闭
    自动关闭不满5年基金: false,//自动关闭基金经理任期低于5年的基金,选指数基金时关闭
    自动关闭平均回报过低基金: false,//自动关闭业绩不好的基金
    指数基金年化代替为成立以来年化: false,//用来选指数基金
    指数用成立时间不满5年则关闭: false,//用来选指数基金
    有历史记录则关闭:false,//用来关闭已有本地记录的基金,不明白请不要开启
    满五年日期常量: "2017-12-01",
    回报率常量: 19,
};
//GM_setValue对象,通过6位数代码取出
let STATIC = {
    max: -99999.9,//近20个交易日最大值累计净值
    maxDate: '',//最大值的日期
    min: 99999.9,//近20个交易日最小值累计净值
    minDate: '',//最小值的日期
    yearAgo: 0.0,//一年前的累计净值
    yearAgoDate: '',//累计净值的日期
    average:-99999.9,//近20个交易日平均数
};
//装净值信息
let list = [];
(function () {
    addLoadEvent(() => {
        //window.scrollTo(0,2150);
        //window.setTimeout(()=>{document.querySelector("#body > div:nth-child(15) > div > div > div.quotationItem_left.quotationItem_left02 > div.fund_item.funhalf_left.popTab > div.item_title.hd > div:nth-child(3)").click();},1000);

        const url = window.location.href;
        //主页面
        const str = /fund\.eastmoney\.com\/(\d{6})\.html/i;
        //净值页面
        const str2 = /.+\.eastmoney\.com\/jjjz_(\d{6}).html/i;

        if (str.test(url)) {//为主页面
            //视图元素生成
            //基金名称
            let divElement1 = document.createElement('div');
            divElement1.className = "gs1";
            document.body.appendChild(divElement1);
            divElement1.style = "top: calc( 15% - 42px );font-size: 16px;";

            //基金基本涨跌
            let divElement2 = document.createElement('div');
            divElement2.className = "gs1";
            document.body.appendChild(divElement2);

            divElement2.title='右键复制';
            divElement2.oncontextmenu=(e)=>{
                e.preventDefault();//阻止浏览器的默认事件
                let s=累计净值+'|'+STATIC.yearAgo+'|'+任期回报;
                copyString(s);
                //添加描边表示生效反馈
                divElement2.style="box-shadow: 0 0 5px 0 rgb(18 80 18 / 50%), 0 0 0 2px rgb(0 0 0 / 60%);";
            };

            //基金短期区间位
            let divElement3 = document.createElement('div');
            divElement3.className = "gs1";
            document.body.appendChild(divElement3);
            divElement3.style = "top: calc( 15% + 190px );";

            divElement3.title='右键复制';
            divElement3.oncontextmenu=(e)=>{
                e.preventDefault();//阻止浏览器的默认事件
                let s=STATIC.maxDate+'|'+STATIC.max+'|'+STATIC.minDate+'|'+STATIC.min+'|'+STATIC.average;
                copyString(s);
                //添加描边表示生效反馈
                divElement3.style="top: calc( 15% + 190px );box-shadow: 0 0 5px 0 rgb(18 80 18 / 50%), 0 0 0 2px rgb(0 0 0 / 60%);";
            };


            //显示基金名称,名称面板
            const 基金名称 = document.querySelector("#body > div:nth-child(8) > div > div > a:nth-child(7)").innerText;
            divElement1.innerHTML = 基金名称;

            //基本数据处理与抓取
            const 任期回报 = (document.querySelector("tr.noBorder > td.td04.bold").innerText.replace("%", "") / 100).toFixed(4);
            const 任职时间 = document.querySelector("tr.noBorder > td.td01").innerText.replace("~至今", "");
            let temp=document.querySelector("dl.dataItem03 > dd.dataNums > span");
            if(temp==null||isNaN(parseFloat(document.querySelector("dl.dataItem03 > dd.dataNums > span").innerText))){
                temp=document.querySelector("dl.dataItem02 > dd.dataNums > span");
            }
            const 累计净值 =temp.innerText
            const 净值时间 = document.querySelector("dl.dataItem01 > dt > p").innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0];
            const 基金代码 = window.location.pathname.match(/(\d{6})/i)[1];
            let 平均回报率 = ((Math.pow(Number(任期回报) + 1, 1 / (getNumberOfDays(new Date(), 任职时间) / 365)) - 1) * 100).toFixed(2);
            const 成立时间 = document.querySelector("div.infoOfFund > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.replace("成 立 日：", "");

            /**-------------------------------------设置项判断---------------------------------------- **/
            //指数基金年化代替,平均回报计算为成立以来年化
            if (setting.指数基金年化代替为成立以来年化) {
                平均回报率 = ((Math.pow(累计净值, 1 / (getNumberOfDays(new Date(), 成立时间) / 365)) - 1) * 100).toFixed(2);
            }
            //指数成立时间不满5年则关闭
            if (setting.指数用成立时间不满5年则关闭 && getNumberOfDays(成立时间, setting.满五年日期常量)>0) {
                window.close();
                return;
            }
            //不满五年判断
            if (setting.自动关闭不满5年基金 && getNumberOfDays(任职时间, setting.满五年日期常量)>0) {
                window.close();
                return;
            }
            //回报率判断
            if (setting.自动关闭平均回报过低基金 && Number(平均回报率) < setting.回报率常量) {
                window.close();
                return;
            }
            //若有本地记录则关闭
            if (setting.有历史记录则关闭){
               if (GM_getValue(基金代码) !== undefined) {
                    window.close();
                    return;
                }
            }
            //打开新窗口,获取净值
            if (setting.是否查看近一年净值) {
                const 净值网址 = document.querySelector("#Div2 > div.item_title.hd > div.item_more > a").href;
                window.setTimeout(() => {
                    打开子窗口(净值网址 + "?ref=" + 基金代码, 10000, true,100, () => {
                        //更新完毕后立即执行
                        主要信息渲染();
                    });
                }, 500);
            }


            /**-----------------------------------设置项判断结束-------------------------------------- **/
            function 主要信息渲染() {
                //如果信息没有更新则不运行
                if (JSON.stringify(STATIC) === JSON.stringify(GM_getValue(基金代码))) return;
                //如果数据存在则更新
                if (GM_getValue(基金代码) !== undefined) {
                    STATIC = GM_getValue(基金代码);
                    次要信息渲染(true);
                }
                const 近一年 = ((累计净值 / STATIC.yearAgo - 1) * 100).toFixed(2) + "%";
                divElement2.innerHTML =
                    "近一年:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 近一年 +
                    "<br>净值时间:                        " + 净值时间 +
                    "<br>累计净值:&nbsp;&nbsp;&nbsp;&nbsp;" + 累计净值 +
                    "<br>取值时间:                        " + STATIC.yearAgoDate +
                    "<br>累计净值:&nbsp;&nbsp;&nbsp;&nbsp;" + STATIC.yearAgo +
                    "<br>任职时间:                        " + 任职时间 +
                    "<br>任期回报:&nbsp;&nbsp;&nbsp;&nbsp;" + 任期回报 +
                    "<br>平均回报:&nbsp;&nbsp;&nbsp;&nbsp;" + 平均回报率 + "%";
            }

            let flag = 0.0;

            function 次要信息渲染(f) {
                let 当前估值;
                try{
                    当前估值 = parseFloat((document.querySelector("#gz_gszzl").innerText.replace("%", "") / 100).toFixed(4));
                }catch{
                    当前估值 =0;
                }

                //若估值不变,且不由主要信息渲染调用则停止函数执行
                if (flag === 当前估值 && f !== true) {
                    return;
                }

                flag = 当前估值;
                //---最大值
                const 与月高点的差距 = 1 - 累计净值 * (1 + (当前估值)) / STATIC.max;
                //---最小值
                const 与月低点的差距 = 累计净值 * (1 + (当前估值)) / STATIC.min - 1;

                divElement3.innerHTML =
                    "当前估值:&nbsp;&nbsp;&nbsp;&nbsp;" + (当前估值 * 100).toFixed(2) + "%" +
                    "<br>近一个月最大累计净值:" +
                    "<br>取值时间:" + STATIC.maxDate +
                    "<br>累计净值:&nbsp;&nbsp;&nbsp;&nbsp;" + STATIC.max +
                    "<br>与月高点的差距:" + (与月高点的差距 * 100).toFixed(2) + "%" +
                    "<br>近一个月最小累计净值:" +
                    "<br>取值时间:" + STATIC.minDate +
                    "<br>累计净值:&nbsp;&nbsp;&nbsp;&nbsp;" + STATIC.min +
                    "<br>与月低点的差距:" + (与月低点的差距 * 100).toFixed(2) + "%" +
                    "<br>均累计净值:&nbsp;" + STATIC.average ;
            }

            //持续监听变化
            window.setInterval(() => {
                主要信息渲染();
                次要信息渲染();
            }, 500);
            //立即执行
            主要信息渲染();
            次要信息渲染();
        } else if (str2.test(url) && getQueryString("ref") != null) {
            //为净值页面且由本程序打开.
            const 基金代码 = getQueryString("ref");

            //找到近20个交易日累计净值的最大值
            净值收集(() => {
                //取最大值,最小值,总数
                let sum = 0.0;
                //数组原大小
                let count=list.length;
                list.forEach((value) => {
                    if (value["累计净值"] > STATIC.max) {
                        STATIC.max = value["累计净值"];
                        STATIC.maxDate = value["净值日期"];
                    }
                    if (value["累计净值"] < STATIC.min) {
                        STATIC.min = value["累计净值"];
                        STATIC.minDate = value["净值日期"];
                    }
                    //如果为NaN,即没有累计净值,则该值不计入平均值内
                    if (Object.is(value["累计净值"], NaN)){
                        count--;
                    }else {
                        sum += value["累计净值"];
                    }
                });
                //平均数
                STATIC.average = Number((sum / count).toFixed(4));

                //找一年前的累计净值,从12页开始找
                document.querySelector("#pagebar > div.pagebtns > input.pnum").value = 12;
                document.querySelector("#pagebar > div.pagebtns > input.pgo").click();

                //清空数组内容
                list.length = 0;

                //一年前的准确时间
                let date = new Date();
                date.setFullYear((date.getFullYear() - 1));
                净值收集(function 回调1() {
                    for (let i = 0; i < list.length; i++) {
                        if (new Date(list[i]["净值日期"]) < date && !Object.is(list[i]["累计净值"], NaN)) {
                            STATIC.yearAgo = list[i]["累计净值"];
                            STATIC.yearAgoDate = list[i]["净值日期"];
                            break;
                        }
                    }
                    //如果没有找到数据
                    if (STATIC.yearAgoDate.length === 0) {
                        //清空数组内容
                        list.length = 0;
                        //翻页
                        try{
                        document.querySelector("#pagebar > div.pagebtns > label:nth-child(9)").click();
                        }catch{
                        document.querySelector("#pagebar > div.pagebtns > label:last-of-type").click();
                        }
                        //重新收集数据
                        净值收集(回调1);
                    } else {
                        //取得数据,程序出口
                        //设置数据
                        GM_setValue(基金代码, STATIC);
                        //关闭网页
                        window.close();
                    }
                });
            });
        }
    });


    addStyle(`
    .gs1 {
        padding: 5px 5px;
        font-size: 14px;
        color: snow;
        position: fixed;
        text-align: left;
        cursor: copy;
        border-radius: 10px;
        background-color: rgba(135, 134, 241, 0.84);
        right: 5px;
        top: 15%;
        z-index: 999999;
        //box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.4), 0 0 0 1px rgba(0,0,0,0.3);
        min-width: 144px;
    }`);

    /**
     * 净值数据收集
     */
    function 净值收集(func) {
        //处理数据,获取不到数据时等待100ms后继续获取.
        let trList = document.querySelectorAll("#jztable > table > tbody > tr");
        if (trList === undefined || trList.length !== 20 || trList.length === 0) {
            setTimeout(() => 净值收集(func), 100);
            return;
        }
        for (let i = 0; i < trList.length; i++) {
            let 净值日期, 单位净值, 累计净值;
            deleteRedundantEmptyTextNodes(trList[i]);
            净值日期 = trList[i].childNodes[0].innerText;
            单位净值 = trList[i].childNodes[1].innerText;
            累计净值 = trList[i].childNodes[2].innerText;
            let temp = {净值日期: '', 单位净值: 1.0, 累计净值: 1.0};
            temp["净值日期"] = 净值日期;
            temp["单位净值"] = parseFloat(单位净值);
            temp["累计净值"] = parseFloat(累计净值);
            //添加到数组
            list.push(temp);
        }
        func();
    }

    /**-------------------------------------------其他函数---------------------------------------------**/

    /**
     * 添加浏览器执行事件
     * @param func 无参匿名函数
     */
    function addLoadEvent(func) {
        let oldOnload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                try {
                    oldOnload();
                } catch (e) {
                    console.log(e);
                } finally {
                    func();
                }
            }
        }
    }

    /**
     * 获取网页参数
     * @param name 参数名称
     * @returns {string|null}
     */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }

    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    /**
     * 两个时间相减,返回天数
     * @param date1 较大的日期
     * @param date2 较小的日期
     * @returns {number}
     */
    function getNumberOfDays(date1, date2) { //获得天数
        var a1 = Date.parse(new Date(date1));
        var a2 = Date.parse(new Date(date2));
        var day = parseInt((a1 - a2) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
        return day
    }

    /**
     * 新窗口打开子窗口,为隐藏模式
     * @param url url
     * @param timeout 超时时间(ms)
     * @param reopen 超时是否自动重开
     * @param reopenLimit 重开次数上限
     * @param func 回调函数,窗口关闭后回调
     */
    function 打开子窗口(url, timeout, reopen, reopenLimit, func) {
        let son = window.open(url, '_blank', "height=100,width=100,top=" +
            window.screen.height + ",left=" + window.screen.width +
            ",location=0,menubar=0,status=0,titlebar=0,toolbar=0");
        let start = new Date().getTime();//子窗口打开时的时间
        let count = 0;
        //检测超时
        const winTimer = window.setInterval(() => {
            let end;
            end = new Date().getTime();//现在的时间
            if (end - start > timeout* Math.pow(1.5,count)) {//超时
                son.close();//关闭窗口
                if (reopen && count < reopenLimit) {//如果需要重开,且重开次数没有达到上限
                    son = window.open(url, '_blank', "height=100,width=100,top=" +
                        window.screen.height + ",left=" + window.screen.width +
                        ",location=0,menubar=0,status=0,titlebar=0,toolbar=0");
                    start = new Date().getTime();//重新设置开始时间
                    count++;//重开次数
                }
            }
            //如果子窗体已关闭
            if (son.closed) {
                //结束这个定时函数,指这次运行后不再运行
                window.clearInterval(winTimer);
                if (func !== undefined) {
                    func();
                }
            }
        }, 100);
    }

    /**
     * 删除多余的空文本节点,为nextSibling,等节点操作一致性做准备
     * @param elem 要优化的父节点
     */
    function deleteRedundantEmptyTextNodes(elem) {
        let elemList = elem.childNodes;
        for (let i = 0; i < elemList.length; i++) {
            /*当为文本节点并且为不可见字符时删除节点*/
            if (elemList[i].nodeName === "#text" && /^\s+$/.test(elemList[i].nodeValue)) {
                elem.removeChild(elemList[i])
            }
        }
    }
    /**
     * 不带格式复制
     * @param string 要复制的值
     */
    function copyString(string) {
        let target = document.createElement('textarea');
        target.value=string;
        document.body.appendChild(target);
        window.getSelection().removeAllRanges();
        target.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        target.remove();
    }
})();