// ==UserScript==
// @name         打点监控后台优化
// @namespace    超超
// @version      0.4
// @description  来自东方的神秘力量！！！！
// @author       超超
// @match        https://*.dtekt.com/*
// @exclude      https://tech-support.dtekt.com/applog/keycheck
// @icon         https://inews.gtimg.com/newsapp_bt/0/8919919242/641
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453466/%E6%89%93%E7%82%B9%E7%9B%91%E6%8E%A7%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453466/%E6%89%93%E7%82%B9%E7%9B%91%E6%8E%A7%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//======添加自动刷新并跳转的按钮==========//
function AddModifiedDiv()
{
    if(GetCookieByName("autoRefresh")==null)
    {
        SetCookieByNameAndValue("autoRefresh","false");
    }

    if(!alreadyExist){
        var parent = document.getElementsByTagName("div")[document.getElementsByTagName("div").length-1];
        //var parent = document.getElementById("ddiv");
        var divModi = document.createElement("div");
        divModi.setAttribute("id", "DivModi");
        divModi.innerHTML = "<input type=\"button\" id=\"AutoRefreshBtn\" style=\"color:blue;height:30px;width:200px;\" value=\"每10秒自动刷新并跳到最后\" hash=\"btnAR\">\n";
        parent.appendChild(divModi);
        alreadyExist=true;

        //======拿到按钮，并且优先判断前次设置的按钮的状态，如果在刷新，那么就自动跳转到最下方并且修改按钮文本==========//
        AutoRefreshBtnObj = document.getElementById("AutoRefreshBtn");
        if((GetCookieByName("autoRefresh")=="true"))
        {
            document.getElementById("ddiv").scrollTop = document.getElementById("ddiv").scrollHeight; //跳转到列表最下面
            //document.documentElement.scrollIntoView({ block: 'end' });
            AutoRefreshBtnObj.value="停止刷新";
        }

        //绑定点击事件
        AutoRefreshBtnObj.onclick=function ARContent(){
            if(GetCookieByName("autoRefresh")=="false"){
                SetCookieByNameAndValue("autoRefresh","true");
                AutoRefreshBtnObj.value="停止刷新";
                AutoClickRefresh();
            }
            else
            {
                SetCookieByNameAndValue("autoRefresh","false");
                AutoRefreshBtnObj.value="每10秒自动刷新并跳到最后";
            }
        }
    }
}


function AutoClickRefresh()
{
    var btnGetData=document.getElementById("getdata");
    btnGetData.click();
}
//====================匹配打点名并转为中文============================//
function ReplacePointNameToChinese()
{
    var tableData = document.getElementsByTagName("table")[document.getElementsByTagName("table").length-1];
    for(var itemsNum=0;itemsNum<tableData.rows.length;itemsNum++)
    {
        tableData.rows[itemsNum].cells[6].innerHTML = tableData.rows[itemsNum].cells[6].innerHTML +" - " + MatchPoint(tableData.rows[itemsNum].cells[6].innerHTML);
    }
}


function MatchPoint(origin)
{
    switch(origin)
    {
        case "T0Q_P":
            return "达到最早付费等级";
            break;
        case "STRONG":
            return "点击\"我要变强\"";
            break;
        case "VOID_EXPLORE_ACT":
            return "虚空探索操作";
            break;
        case "VOID_EXPLORE_IN":
            return "虚空探索进入";
            break;
        case "ROAR_BATTLE_02_ACT":
            return "试炼深渊";
            break;
        case "ROAR_BATTLE_02_IN":
            return "嘶吼深渊进入";
            break;
        case "T0Q400":
            return "用户等级达到400级";
            break;
        case "T0Q390":
            return "用户等级达到390级";
            break;
        case "T0Q380":
            return "用户等级达到380级";
            break;
        case "T0Q370":
            return "用户等级达到370级";
            break;
        case "T0Q360":
            return "用户等级达到360级";
            break;
        case "T0Q350":
            return "用户等级达到350级";
            break;
        case "T0Q340":
            return "用户等级达到340级";
            break;
        case "T0Q330":
            return "用户等级达到330级";
            break;
        case "T0Q320":
            return "用户等级达到320级";
            break;
        case "T0Q310":
            return "用户等级达到310级";
            break;
        case "T0Q300":
            return "用户等级达到300级";
            break;
        case "T0Q290":
            return "用户等级达到290级";
            break;
        case "T0Q280":
            return "用户等级达到280级 ";
            break;
        case "T0Q270":
            return "用户等级达到270级";
            break;
        case "T0Q260":
            return "用户等级达到260级";
            break;
        case "T0Q250":
            return "用户等级达到250级";
            break;
        case "T0Q240":
            return "用户等级达到240级";
            break;
        case "T0Q230":
            return "用户等级达到230级";
            break;
        case "T0Q220":
            return "用户等级达到220级";
            break;
        case "T0Q210":
            return "用户等级达到210级";
            break;
        case "T0Q200":
            return "用户等级达到200级";
            break;
        case "T0Q190":
            return "用户等级达到190级";
            break;
        case "T0Q180":
            return "用户等级达到180级";
            break;
        case "T0Q170":
            return "用户等级达到170级";
            break;
        case "T0Q160":
            return "用户等级达到160级";
            break;
        case "T0Q150":
            return "用户等级达到150级";
            break;
        case "T0Q140":
            return "用户等级达到140级";
            break;
        case "T0Q130":
            return "用户等级达到130级";
            break;
        case "T0Q120":
            return "用户等级达到120级";
            break;
        case "T0Q110":
            return "用户等级达到110级";
            break;
        case "T0Q100":
            return "用户等级达到100级";
            break;
        case "T0Q90":
            return "用户等级达到90级";
            break;
        case "T0Q80":
            return "用户等级达到80级";
            break;
        case "T0Q_P":
            return "达到最早付费等级";
            break;
        case "T0Q_E":
            return "达到新手保护结束等级";
            break;
        case "T0Q10":
            return "用户等级达到10级";
            break;
        case "T0Q9":
            return "用户等级达到9级";
            break;
        case "T0Q8":
            return "用户等级达到8级";
            break;
        case "T0Q7":
            return "用户等级达到7级";
            break;
        case "T0Q6":
            return "用户等级达到6级";
            break;
        case "T0Q5":
            return "用户等级达到5级";
            break;
        case "T0Q4":
            return "用户等级达到4级";
            break;
        case "T0Q3":
            return "用户等级达到3级";
            break;
        case "T0Q2":
            return "用户等级达到2级";
            break;
        case "T0Q1":
            return "用户等级达到1级";
            break;
        case "T09":
            return "关卡或主题确认结束";
            break;
        case "T08":
            return "关卡或主题确认开始";
            break;
        case "T0Q20":
            return "用户等级达到20级";
            break;
        case "T0Q30":
            return "用户等级达到30级";
            break;
        case "T0Q40":
            return "用户等级达到40级";
            break;
        case "T0Q50":
            return "用户等级达到50级";
            break;
        case "T0Q60":
            return "用户等级达到60级";
            break;
        case "T0Q70":
            return "用户等级达到70级";
            break;
        case "T09_ClimbTower":
            return "用户爬塔战斗结束";
            break;
        case "STAR_RISE":
            return "玩家选择/切换英雄，或者当前英雄升星";
            break;
        case "T0F_F":
            return "登陆失败";
            break;
        case "GET_5STAR_HERO":
            return "用户首次获得任意5星英雄时上报";
            break;
        case "SERVERS_ERROR":
            return "服务器错误";
            break;
        case "T0H1":
            return "礼券变动";
            break;
        case "GET_7STAR_HERO":
            return "用户首次获得任意7星英雄时上报";
            break;
        case "GET_6STAR_HERO":
            return "用户首次获得任意6星英雄时上报";
            break;
        case "GET_2HERO":
            return "用户首次获得以下任意两个英雄(备注)";
            break;
        case "T0CARD":
            return "卡片变动";
            break;
        case "T0Q":
            return "等级变动";
            break;
        case "T0H":
            return "物品变动";
            break;
        case "T0G":
            return "货币变动";
            break;
        case "T04":
            return "新主题下载";
            break;
        case "AOGPLAYER":
            return "玩家领取转服奖励";
            break;
        case "VIPLEVELUP":
            return "VIP等级变动";
            break;
        case "T0P_BagLimit":
            return "限时礼包弹窗";
            break;
        case "T0Close":
            return "窗口关闭或者页面切换";
            break;
        case "T0P_Voucher":
            return "购买礼包礼券不足，触发礼券购买弹窗";
            break;
        case "Item_purchase":
            return "关闭道具资源购买弹窗";
            break;
        case "CONSORTIA":
            return "用户参与公会";
            break;
        case "FRIEND":
            return "好友变动";
            break;
        case "Mainline_GET":
            return "玩家通关指定主线章节领取奖励(在成长礼包中)时上报";
            break;
        case "EVENT_GET":
            return "玩家完成任务领取奖励上报";
            break;
        case "TASK_RATE":
            return "任务进度变动";
            break;
        case "TASK_GET":
            return "玩家完成任务领取奖励上报";
            break;
        case "Dispatch":
            return "寻宝探险派遣开始";
            break;
        case "WISH_LIST":
            return "心愿单选择完成";
            break;
        case "BOX":
            return "开启宝箱";
            break;
        case "MODEL_UNLOCK":
            return "模式解锁";
            break;
        case "T06":
            return "点击图标";
            break;
        case "CARD":
            return "抽卡完成";
            break;
        case "HEROExchange":
            return "魂晶兑换英雄";
            break;
        case "T06_lineup":
            return "打开阵容推荐界面";
            break;
        case "Dispatch_refresh":
            return "寻宝探险派遣中刷新探索目标";
            break;
        case "7DAYS_7":
            return "领取7日送第7天奖励";
            break;
        case "7DAYS_6":
            return "领取7日送第6天奖励";
            break;
        case "7DAYS_5":
            return "领取7日送第5天奖励";
            break;
        case "7DAYS_4":
            return "领取7日送第4天奖励";
            break;
        case "7DAYS_3":
            return "领取7日送第3天奖励";
            break;
        case "7DAYS_2":
            return "领取7日送第2天奖励";
            break;
        case "7DAYS_1":
            return "领取7日送第1天奖励";
            break;
        case "T0OFFLINE_GET":
            return "领取离线奖励";
            break;
        case "FIRST_PAY":
            return "用户首冲";
            break;
        case "T9999":
            return "单笔充值99.99";
            break;
        case "T4999":
            return "单笔充值49.99";
            break;
        case "T2999":
            return "单笔充值29.99";
            break;
        case "T1999":
            return "单笔充值19.99";
            break;
        case "T1499":
            return "单笔充值14.99";
            break;
        case "T999":
            return "单笔充值9.99";
            break;
        case "T499":
            return "单笔充值4.99";
            break;
        case "T0E10":
            return "本次付费大于99.99";
            break;
        case "T0E9":
            return "本次付费介于79.99至89.99";
            break;
        case "T0E8":
            return "本次付费介于69.99至79.99";
            break;
        case "T0E7":
            return "本次付费介于59.99至69.99";
            break;
        case "T0E6":
            return "本次付费介于49.99至59.99";
            break;
        case "T0E5":
            return "本次付费介于39.99至49.99";
            break;
        case "T0E4":
            return "本次付费介于29.99至39.99";
            break;
        case "T0E3":
            return "本次付费介于19.99至29.99";
            break;
        case "T0E2":
            return "本次付费介于9.99至19.99";
            break;
        case "T0E1":
            return "本次付费<=9.99$";
            break;
        case "T0C5":
            return "商城停留至少45秒";
            break;
        case "T0C4":
            return "商城停留至少30秒";
            break;
        case "T0C3":
            return "商城停留至少15秒";
            break;
        case "T0C1":
            return "几秒内退出";
            break;
        case "T0E":
            return "付费成功";
            break;
        case "T0C":
            return "进入商城";
            break;
        case "T0D":
            return "点击付费商品";
            break;
        case "T0REC":
            return "用户重新连接时";
            break;
        case "T0OFF":
            return "用户断开连接弹窗时";
            break;
        case "T013":
            return "加载资源异常信息";
            break;
        case "T011F":
            return "下载资源开始";
            break;
        case "T012":
            return "加载资源结束";
            break;
        case "T011E":
            return "加载100%";
            break;
        case "T011D":
            return "加载80%";
            break;
        case "T011C":
            return "加载60%";
            break;
        case "T011B":
            return "加载40%";
            break;
        case "T011A":
            return "加载20%";
            break;
        case "T011":
            return "加载资源确认开始";
            break;
        case "T02_S":
            return "客户端向服务器请求时长";
            break;
        case "T02":
            return "游戏前台时长";
            break;
        case "T_PB":
            return "累计付费达到19.99$";
            break;
        case "T_PA":
            return "首次任意付费";
            break;
        case "T_PPB":
            return "首次在商店中停留时间>=30秒";
            break;
        case "T_PPA":
            return "首次在商店中停留时间>=15秒";
            break;
        case "T_LoginB":
            return "累计登陆次数达到5次";
            break;
        case "T_LoginA":
            return "累计登陆次数达到1次";
            break;
        case "T_AdsB":
            return "累计广告展示次数达到8次";
            break;
        case "T_AdsA":
            return "累计广告展示次数达到1次";
            break;
        case "T0O":
            return "激励视频入口点击";
            break;
        case "T0R":
            return "激励视频入口展现";
            break;
        case "T0K":
            return "推送通知点击";
            break;
        case "T0J":
            return "推送通知收到";
            break;
        case "T0I":
            return "推送通知注册";
            break;
        case "T0B":
            return "用户破产";
            break;
        case "T0F":
            return "成功登录";
            break;
        case "T03":
            return "点击登录";
            break;
        case "T01":
            return "打开APP";
            break;
        case "T0A_F":
            return "新手引导完成";
            break;
        case "T0A":
            return "新手引导";
            break;
        default:
            return "暂无该点位匹配，<a href=\"dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=sunchaocn\">反馈一哈</a>"
            break;
    }
}

//========初始事件=========//
function StartEventFunc()
{
    AddModifiedDiv();
    ReplacePointNameToChinese();
}

//============通用事件调用===============//
function SetCookieByNameAndValue(name,valueSet)
{
    document.cookie = name+"="+valueSet+";";
}



function GetCookieByName(name){
    var str = document.cookie;
    //将值切割成数组
    var arr = str.split(";");
    var valueReturn;
    //遍历数组
    for(var i=0;i<arr.length;i++){
        var value = arr[i].split("=");
        if(value[0] == name){
            valueReturn = value[1];
        }
    }
    return(valueReturn);
}

function CheckOpenState(){
    if(AutoRefreshBtnObj.value=="停止刷新")
    {
        AutoClickRefresh();
    }
}
//==========初始配置区==========//
var alreadyExist=false;
var expires;

var AutoRefreshBtnObj;
//==========默认调用区==========//
onload=StartEventFunc();


//==========定时器配置==========//
//setInterval(CheckOpenState(),"5000")
setTimeout(() => {
    CheckOpenState();
}, 10000);