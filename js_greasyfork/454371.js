// ==UserScript==
// @name         B站观看内容统计-我的时间都去哪了
// @version      0.3.4
// @description  在b站网页首页、播放页、历史记录页显示观看视频、直播、专栏等数量时长统计信息。适合重度b站用户，提醒自己避免刷视频耗费过多时间。
// @author       判官喵
// @namespace    https://space.bilibili.com/6693935
// @match        https://www.bilibili.com/account/history
// @match        https://www.bilibili.com/*
// @match        https://api.bilibili.com/x/web-interface/history/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/454371/B%E7%AB%99%E8%A7%82%E7%9C%8B%E5%86%85%E5%AE%B9%E7%BB%9F%E8%AE%A1-%E6%88%91%E7%9A%84%E6%97%B6%E9%97%B4%E9%83%BD%E5%8E%BB%E5%93%AA%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454371/B%E7%AB%99%E8%A7%82%E7%9C%8B%E5%86%85%E5%AE%B9%E7%BB%9F%E8%AE%A1-%E6%88%91%E7%9A%84%E6%97%B6%E9%97%B4%E9%83%BD%E5%8E%BB%E5%93%AA%E4%BA%86.meta.js
// ==/UserScript==
//GM_deleteValue("lishijilulist");
//

(function() {

    //判断在那个页面分别执行相应单元
    var winhref = window.location.href.split(".com")[0];
    var winhrefvd = window.location.href.substring(0,30);
    var winhrefzhuye = window.location.href.substring(0,26);
    var winhreflishi = window.location.href.substring(0,40);
    var winhrefapi = window.location.href.substring(0,81);
    var winhrefqita = window.location.href.length;
    var nedhrefA = "https://api.bilibili";
    var nedhrefB = "https://www.bilibili";
    var nedhrefC = "https://www.bilibili.com/video";
    var nedhrefD = "https://www.bilibili.com/account/history";
    var nedhrefE = "https://www.bilibili.com/?";
    var nedhrefF = "https://api.bilibili.com/x/web-interface/history/cursor?max=0&view_at=0&business="

    //页面加载完成后再执行
    window.onload = function () {
        //判断地址栏网址执行不同模块
        //b站页面显示提示信息
        if(winhref==nedhrefB){
            if(winhrefvd==nedhrefC){
                //播放页面显示提示信息
                setTimeout(function(){
                    //延时8秒执行
                    bofanyemian();
                    console.log("播放页提示");
                },8000);
            }else if(winhreflishi == nedhrefD){
                //历史记录页面显示信息
                lishijiluyemian();
                console.log("历史页提示");
            }else if(winhrefqita == 25){
                //b站主页显示信息
                zhuyetishixinxi();
                console.log("主页提示不带参数");
            }else if(winhrefzhuye == nedhrefE){
                //b站主页显示信息,兼容带参数链接
                zhuyetishixinxi();
                console.log("主页提示带参数");
            }else{
                //其他页面不做展示
                console.log("其他页面提示");
                console.log(window.location.href);
            }
        }else if(winhref==nedhrefA){
            //在b站历史记录api栏记录信息
            cunchuliebiao();
        }
    }
    
    //防止api页面无法工作，备用的延时启动
    if(winhref==nedhrefA){
        setTimeout(function(){
            if(winhref==nedhrefA){
                //在b站历史记录api栏记录信息
                cunchuliebiao();
            }
        },15000);
    }
    
    //播放页面执行模块
    var bofanyemian =  function(){
        //读取缓存模块，返回缓存内容
        var tiquhuancunjson = GMgetmylist();
        var changetime; //时间格式化传入
        var geshihuatimeav; //时间格式化返回
        var geshihuatimegk; //时间格式化返回
        var para;
        var node;
        //执行数量时长计算模块 返回计算结果
        var nmbertimejsjg = nmbertime_jishuan(tiquhuancunjson);
        changetime = nmbertimejsjg[0].avtime;
        geshihuatimeav = shijiangeshihua(changetime);
        changetime = nmbertimejsjg[0].gktime
        geshihuatimegk = shijiangeshihua(changetime);

        para = document.createElement("p");
        node = document.createTextNode("今天已看"+nmbertimejsjg[0].av+"个视频，"+nmbertimejsjg[0].live+"个直播间，"+nmbertimejsjg[0].cv+"篇专栏，总视频时长："+geshihuatimeav+",总观看时长："+geshihuatimegk);
        para.appendChild(node);
        var element = document.querySelector(".video-data");
        element.appendChild(para);
        dingshijiancha(tiquhuancunjson);
    }

    //历史页面执行模块
    var lishijiluyemian =  function(){
        //TODO
    }

    //主页执行模块
    var zhuyetishixinxi =  function(){
        //读取缓存模块，返回缓存内容
        var tiquhuancunjson = GMgetmylist();
        
        //计数用
        var pdiv;
        var pid;
        var paraid;
        var nodeshow;
        var para;
        var node;
        var changetime; //时间格式化传入
        var geshihuatime; //时间格式化返回
        paraid = "tongjixianshi";
        //添加一个显示区域在分区导航下方
        para = document.createElement("div");
        para.className = "bili-header__channel";
        para.id = "tongjixianshi";
        //显示区域分割分割7部分 
        var parastyle = "display: grid; grid-template-columns: auto auto auto auto auto auto auto; grid-gap: 10px; text-align: center;"
        para.setAttribute('style',parastyle);
        var element = document.querySelector(".bili-header");
        element.appendChild(para);
        for(pdiv = 1; pdiv < 8; pdiv++){
            para = document.createElement("div");
            para.id = paraid+pdiv;
            element = document.querySelector("#tongjixianshi");
            element.appendChild(para); 
        }
        if(tiquhuancunjson != undefined){
            //执行数量时长计算模块 返回计算结果
            var nmbertimejsjg = nmbertime_jishuan(tiquhuancunjson);   
            for(pid = 1; pid < 7; pid++){
                if(pid ==1){nodeshow = "今天";}
                else if(pid == 2){nodeshow = "昨天";}
                else if(pid == 3){nodeshow = "7天";}
                else if(pid == 4){nodeshow = "本月";}
                else if(pid == 5){nodeshow = "上月";}
                else if(pid == 6){nodeshow = "自统计以来";}
                para = document.createElement("p");
                node = document.createTextNode(nodeshow);
                para.appendChild(node);
                element = document.querySelector("#"+paraid+pid);
                element.appendChild(para);

                para = document.createElement("p");
                node = document.createTextNode("共计观看"+nmbertimejsjg[pid-1].av+"个视频");
                para.appendChild(node);
                element = document.querySelector("#"+paraid+pid);
                element.appendChild(para);

                para = document.createElement("p");
                node = document.createTextNode("共计观看"+nmbertimejsjg[pid-1].live+"个直播间");
                para.appendChild(node);
                element = document.querySelector("#"+paraid+pid);
                element.appendChild(para);

                para = document.createElement("p");
                node = document.createTextNode("共计观看"+nmbertimejsjg[pid-1].cv+"篇专栏");
                para.appendChild(node);
                element = document.querySelector("#"+paraid+pid);
                element.appendChild(para);

                changetime = nmbertimejsjg[pid-1].avtime;
                geshihuatime = shijiangeshihua(changetime);
                para = document.createElement("p");
                node = document.createTextNode("视频总时长"+geshihuatime);
                para.appendChild(node);
                element = document.querySelector("#"+paraid+pid);
                element.appendChild(para);

                changetime = nmbertimejsjg[pid-1].gktime
                geshihuatime = shijiangeshihua(changetime);
                para = document.createElement("p");
                node = document.createTextNode("总计观看"+geshihuatime);
                para.appendChild(node);
                element = document.querySelector("#"+paraid+pid);
                element.appendChild(para);
            }
        }else{
            alert("首次使用B站观看内容统计脚本，请先获取数据！")
        }
        //设置获取历史记录按钮
        var para5a = document.createElement("a");
        var node5a = document.createTextNode("点击获取历史记录");
        para5a.href = "https://api.bilibili.com/x/web-interface/history/cursor?max=0&view_at=0&business=";
        para5a.id = "kanjige";
        para5a.target = "_blank";
        para5a.appendChild(node5a);
        element = document.querySelector("#tongjixianshi7");
        element.appendChild(para5a);
        dingshijiancha(tiquhuancunjson);
    }

    //api页面执行模块
    var cunchuliebiao =  function(){
        //获取api页面json模块
        var prejson;
        prejson = APIhuoqulist();
        //json和缓存逻辑判断模块，刷新页面会重复执行
        //读取缓存模块，返回缓存内容
        var tiquhuancunjson
        tiquhuancunjson = GMgetmylist();
        //存储列表json,将提取缓存内容添加到存储列表
        var cunchulist=new Array();
        cunchulist = tiquhuancunjson;
        //首次缓存标记，1有效，0无效
        var firstcunchu;
        //根据返回页面状态 1有效，0无效不进行下页获取
        var shifou_next_yemian =0;
        //判断缓存是否存在
        if(tiquhuancunjson == undefined){
            //不存在则执行以下
            //将首次缓存标记为1有效
            firstcunchu = 1;
            cunchulist=new Array();
            console.log(cunchulist);
        }else{
            firstcunchu = 0;
        }
        //执行 标头存储模块，并传入首次缓存标记，提取api页面json数据，缓存存储列表内容 返回存储列表
        cunchulist = biaotoucunchu(firstcunchu, prejson, cunchulist);
        //执行 页面json数据加入存储列表模块  返回是否执行下一页状态
        shifou_next_yemian = jsontocunchulist(prejson, cunchulist);
        //根据返回页面状态判断是否进行下页获取
        if(shifou_next_yemian == 1){
            //执行打开下一页模块
            daikai_nextpage(prejson);
        }else{
            //执行本次任务计数模块
            var bencicunchu_len = bencicunchujishu();
            //打印提示存储了多少数据
            alert("本次一共获取了"+bencicunchu_len+"条数据");
            setTimeout(function(){
                //延时5秒执行，跳转首页
                window.open("https://www.bilibili.com/","_self")
            },5000);
        }
    }

    //获取api页面json模块 返回 json格式化数据
    function APIhuoqulist() {
        //获取页面数据字符串
        var pretxt = document.getElementsByTagName("pre")[0];
        pretxt = pretxt.textContent;
        //将字符串json格式化并返回
        var prejson  = JSON.parse(pretxt);
        return prejson;
    }

    //读取缓存模块 返回 json格式化缓存内容
    var GMgetmylist =  function(){
        //提取缓存字符串
        var tiqustr;
        //提取缓存json
        var tiquhuancunjson;
        tiqustr= GM_getValue("lishijilulist");
        //判断是否存在缓存
        if(tiqustr == undefined){
            tiquhuancunjson = tiqustr;
        }else{
            //将字符串json格式化并返回
            tiquhuancunjson = JSON.parse(tiqustr);
        }
        return tiquhuancunjson;
    }

    //存储缓存列表模块
    var GMsetmylist =  function(cunchulist){
        var lishijilulist = JSON.stringify(cunchulist);
        GM_setValue("lishijilulist",lishijilulist);
    }

    //标头存储模块
    var biaotoucunchu =  function(firstcunchu, prejson, cunchulist){
        //提取最后观看数据项oid和观看时间
        var tiquoid;
        var tiquview_at;
        var prejsonlistlen;
        prejsonlistlen = prejson.data.list.length;
        if(prejsonlistlen != 0){
            //判断是否有apijson数据
            tiquoid = prejson.data.list[0].history.oid;
            tiquview_at = prejson.data.list[0].view_at;
        }
        //判断是否为首次缓存
        if(firstcunchu == 1){
            if(cunchulist.length == 0){
                alert("首次获取数据时间较长请耐心等待！")
                //是首次缓存则 添加标头项首次缓存标记，最后观看oid和时间数据，返回存储列表
                cunchulist[0] = ({firstcunchu: firstcunchu, last_oid: tiquoid, last_view_at: tiquview_at, bencicunchu_len: 0})
            }
            return cunchulist;
        }else{
            //非首次缓存存储最后观看数据项
            //判断网页是否为api默认页面
            if(winhrefapi == nedhrefF){
                //是则 把此页最后观看数据添加到标头项备用栏，返回存储列表
                cunchulist[0].beiyong_last_oid = tiquoid;
                cunchulist[0].beiyong_last_view_at= tiquview_at;
                cunchulist[0].bencicunchu_len= 0;
                return cunchulist;
            }else{
                //如果不是api默认页面则 不做任何操作，直接返回存储列表
                return cunchulist;
            }
        }
    }

    //页面json数据加入存储列表模块
    var jsontocunchulist =  function(prejson, cunchulist){
        //提取首次存储标记
        var firstcunchu = cunchulist[0].firstcunchu;
        //提取json数据列表长度
        var prejsonlistlen = prejson.data.list.length;
        //提取记录的最后一个观看时间
        var last_view_at = cunchulist[0].last_view_at
        //提取记录的备用最后一个观看时间
        var beiyong_last_view_at = cunchulist[0].beiyong_last_view_at
        var beiyong_last_oid = cunchulist[0].beiyong_last_oid;
        //列表执行计数
        var i;
        //获取时间戳
        var tistime = Date.now();
        //判断数据长度是否为0
        if(prejsonlistlen == 0){
            //如果没有数据则是提取到最后一页，将首次存储状态改为0无效，并存储 返回下页状态为0
            cunchulist[0].firstcunchu =  0;
            cunchulist[0].last_jiancha_time = tistime;
            GMsetmylist(cunchulist);
            console.log("最后一条");
            return 0;
            //返回状态0不再进行下个页面获取
        }else{
            //有数据则判断是否为首次缓存
            if(firstcunchu == 1){
                //首次缓存直接循环执行 api页面json数据添加到存储列表模块
                for (i = 0; i < prejsonlistlen; i++) {
                    cunchulist = prejsontocunchulist(prejson,i,cunchulist);
                }
                GMsetmylist(cunchulist);
                //返回状态1继续进行下个页面获取
                return 1;
            }else{
                //非首次缓存则，判断缓存最后一个观看时间记录能否比页面数据的观看时间记录更小
                //对比缓存的最后一个观看时间与记录列表时间大小
                for (i = 0; i < prejsonlistlen; i++) {
                    if(last_view_at < prejson.data.list[i].view_at){
                        //如果时间小于列表时间则加入存储列表
                        cunchulist = prejsontocunchulist(prejson,i,cunchulist);
                    }else if(last_view_at == prejson.data.list[i].view_at){
                        //如果时间等于列表时间则停止获取，将备用最后时间添加到存储列表的最后时间，直接存储已有列表
                        cunchulist[0].last_view_at =  beiyong_last_view_at;
                        cunchulist[0].last_oid = beiyong_last_oid;
                        cunchulist[0].last_jiancha_time = tistime;
                        GMsetmylist(cunchulist);
                        return 0;
                        //返回状态0不再进行下个页面获取
                    }else{
                        //如果时间大于列表时间则停止获取，将备用最后时间添加到存储列表的最后时间，直接存储已有列表
                        cunchulist[0].last_view_at =  beiyong_last_view_at;
                        cunchulist[0].last_oid = beiyong_last_oid;
                        cunchulist[0].last_jiancha_time = tistime;
                        GMsetmylist(cunchulist);
                        return 0;
                        //返回状态0不再进行下个页面获取
                    }
                }
                //整页获取完后存储，返回状态1继续进行下个页面获取
                GMsetmylist(cunchulist);
                return 1;
            }
        }
    }

    //api页面json数据添加到存储列表模块
    function prejsontocunchulist(prejson,i,cunchulist){
        //每个视频bvid 每个视频时长 每个视频观看时长 每个视频观看时间
        var every_oid;  //视频是av号，专栏是cv号，直播是直播间号
        var every_author_mid;  //up主uid
        var every_author_name;  //up主名字
        var every_badge;  //此条记录的类型
        var every_title;  //标题
        var every_duration;  //视频时长
        var every_progress;  //观看时长
        var every_view_at;  //观看时间
        every_oid = prejson.data.list[i].history.oid;
        every_author_mid = prejson.data.list[i].author_mid;
        every_author_name = prejson.data.list[i].author_name;
        every_badge = prejson.data.list[i].badge;
        every_title = prejson.data.list[i].title;
        every_duration = prejson.data.list[i].duration;
        every_progress = prejson.data.list[i].progress;
        every_view_at = prejson.data.list[i].view_at;
        //判断是否有重复内容
        //寻找相同观看时间内容
        var shifouyou =cunchulist.find(i => i.view_at === every_view_at);
        //获取本次存储计数
        var bencicunchu_len =  cunchulist[0].bencicunchu_len;
        //如果没有找到则 添加数据后返回存储列表
        if(shifouyou == undefined){
            cunchulist.push({oid: every_oid, author_mid: every_author_mid, author_name: every_author_name, badge: every_badge, title: every_title ,duration: every_duration, progress: every_progress, view_at: every_view_at});
            cunchulist[0].bencicunchu_len = bencicunchu_len+1;
            return cunchulist;
        }else{
            //有找到则 不做处理直接返回存储列表
            return cunchulist;
        }
    }

    //打开下一页模块
    var daikai_nextpage =  function(prejson){
        //标头信息maxid 时间戳id 标头信息id
        var max_id;
        var view_at_id;
        var business_id;
        //获取标头信息maxid
        max_id = prejson.data.cursor.max;
        //获取时间戳id
        view_at_id = prejson.data.cursor.view_at;
        //获取标头信息id
        business_id = prejson.data.cursor.business;
        setTimeout(function(){
            //延时3秒执行，新建一个a标签赋值链接并用新标签页打开
            var apara = document.createElement("a");
            apara.href = "https://api.bilibili.com/x/web-interface/history/cursor?max="+max_id+"&view_at="+view_at_id+"&business="+business_id;
            apara.target = "_blank";
            apara.click();
        },3000);
        setTimeout(function(){
            //延时10秒执行，关闭此页面
            window.open("about:blank","_self")
            window.close();
        },10000);
    }

    //本次任务计数模块
    var bencicunchujishu =  function(){
        //执行读取缓存模块，返回缓存内容
        var tiquhuancunjson
        tiquhuancunjson = GMgetmylist();
        //获取计数模块，并返回
        var bencicunchu_len = tiquhuancunjson[0].bencicunchu_len;
        return bencicunchu_len;
    }

    //数量时长计算模块
    var nmbertime_jishuan =  function(tiquhuancunjson){
        //获取时间戳
        var nowtime = new Date();
        //获取年份
        var thisyear =  nowtime.getFullYear();
        //获取当月的月份
        var thismonth = nowtime.getMonth()+1;
        var lastmonth = nowtime.getMonth();
       //获取当前日期
        var today =  nowtime.getDate();
        //当天0点时间戳
        var todaytime = (new Date(thisyear+"-"+thismonth+"-"+today) / 1000);
        //前一天0点时间戳
        var yesterdaytime = (new Date(thisyear+"-"+thismonth+"-"+today) / 1000)-24*60*60
        //6天前的时间戳
        var weektime = (new Date(thisyear+"-"+thismonth+"-"+today) / 1000)-24*60*60*6;
        //本月1号的时间戳
        var thismonthtime = (new Date(thisyear+"-"+thismonth+"-"+1) / 1000);
        //上月1号的时间戳
        var lastmonthtime = (new Date(thisyear+"-"+lastmonth+"-"+1) / 1000);
        //计算结果
        var jishuanjieguo =new Array();
        var panduantime; //判断时间状态，5统计所有，4统计上月，3统计本月，2统计7天，1统计昨天，0统计今天
        var every_badge;  //此条记录的类型
        var every_duration;  //视频时长
        var every_progress;  //观看时长
        var every_view_at;  //观看时间
        //获取数据长度
        var tiquhuancunjsonlen = tiquhuancunjson.length;
        //计数用
        var ntjs;
        //逐个统计计算
        for(ntjs = 1; ntjs < tiquhuancunjsonlen; ntjs++){
            //逐个获取数据
            every_badge = tiquhuancunjson[ntjs].badge;
            every_duration = tiquhuancunjson[ntjs].duration;
            every_progress = tiquhuancunjson[ntjs].progress;
            every_view_at = tiquhuancunjson[ntjs].view_at;
            //计入统计所有
            panduantime = 5;
            //执行集中统计模块 返回统计结果
            jishuanjieguo = jizhontongji(every_badge, every_duration, every_progress, panduantime, jishuanjieguo);
            if(lastmonthtime < every_view_at && every_view_at < thismonthtime){
                //判断时间是否在上月范围内 
                panduantime = 4;
                //是则执行集中统计模块 返回统计结果
                jishuanjieguo = jizhontongji(every_badge, every_duration, every_progress, panduantime, jishuanjieguo);
            }
            if(thismonthtime < every_view_at){
                //判断时间是否在本月范围内 
                panduantime = 3;
                //是则执行集中统计模块 返回统计结果
                jishuanjieguo = jizhontongji(every_badge, every_duration, every_progress, panduantime, jishuanjieguo);
            }
            if(weektime < every_view_at){
                //判断时间是否在7天范围内 
                panduantime = 2;
                //是则执行集中统计模块 返回统计结果
                jishuanjieguo = jizhontongji(every_badge, every_duration, every_progress, panduantime, jishuanjieguo);
            }
            if(yesterdaytime < every_view_at && every_view_at < todaytime){
                //判断时间是否在昨天范围内 
                panduantime = 1;
                //是则执行集中统计模块 返回统计结果
                jishuanjieguo = jizhontongji(every_badge, every_duration, every_progress, panduantime, jishuanjieguo);
            }
            if(todaytime < every_view_at){
                //判断时间是否在今天范围内 
                panduantime = 0;
                //是则执行集中统计模块 返回统计结果
                jishuanjieguo = jizhontongji(every_badge, every_duration, every_progress, panduantime, jishuanjieguo);
            }
        }
        return jishuanjieguo;
    }

    //集中统计模块
    var jizhontongji =  function(every_badge, every_duration, every_progress, panduantime, jishuanjieguo){
        //判断是否属于视频
        if(every_badge == "" || every_badge == "综艺" || every_badge == "电影" || every_badge == "番剧" || every_badge == "纪录片" || every_badge == "电视剧" || every_badge == "国创"){
            if(jishuanjieguo.length == 0){
                //赋值初始内容
                for(var j=0; j<6; j++){
                    jishuanjieguo[j] = ({av: 0, cv: 0, live: 0, avtime: 0, gktime: 0});
                }
            }
            //属于视频则添加计数，并加总视频时长和观看时长
            jishuanjieguo[panduantime].av = jishuanjieguo[panduantime].av+1;
            jishuanjieguo[panduantime].avtime = jishuanjieguo[panduantime].avtime+every_duration;
            //如果every_duration是-1值，则说明看完了此视频
            if(every_progress == -1){
                every_progress = every_duration;
            }
            jishuanjieguo[panduantime].gktime = jishuanjieguo[panduantime].gktime+every_progress;
        }else if(every_badge == "专栏" || every_badge == "笔记"){
            //判断是否属于专栏
            jishuanjieguo[panduantime].cv = jishuanjieguo[panduantime].cv+1;
        }else if(every_badge == "未开播" || every_badge == "直播中"){
            //判断是否属于直播
            jishuanjieguo[panduantime].live = jishuanjieguo[panduantime].live+1;
        }
        //返回统计结果
        return jishuanjieguo;
    }

    //时分秒格式化模块
    var shijiangeshihua =  function(changetime){
        var hh = parseInt(changetime/3600);
        if(hh<10) hh = "0" + hh;
        var mm = parseInt((changetime-hh*3600)/60);
        if(mm<10) mm = "0" + mm;
        var ss = parseInt((changetime-hh*3600)%60);
        if(ss<10) ss = "0" + ss;
        var geshihuatime = hh + ":" + mm + ":" + ss;
        if(changetime>0){
        return geshihuatime;
        }else{
        return "NaN";
        }
    }

    //定时执行检查模块
    var dingshijiancha =  function(tiquhuancunjson){
        //获取时间戳
        var tistime =Date.now();
        //判断数据内是否有时间戳项
        if(tiquhuancunjson[0].hasOwnProperty("last_jiancha_time")){
            var last_time = tiquhuancunjson[0].last_jiancha_time;
            var shifouzhixin = tistime-last_time;
            console.log("相差时间"+shifouzhixin/1000);
            //对比已有时间戳
            //如果大于已有时间戳1小时 3600000，则自动打开获取历史记录
            if(shifouzhixin > 3600000){
                setTimeout(function(){
                    //延时3秒执行，新建一个a标签赋值链接并用新标签页打开
                    var apara = document.createElement("a");
                    apara.href = "https://api.bilibili.com/x/web-interface/history/cursor?max=0&view_at=0&business=";
                    apara.target = "_blank";
                    apara.click();
                },3000);
            }
        }else{
            tiquhuancunjson[0].last_jiancha_time = tistime;
            GMsetmylist(tiquhuancunjson);
        }
    }
})();