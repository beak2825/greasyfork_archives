// ==UserScript==
// @name         B站番剧/电影/电视剧/纪录片/综艺索引页面已看标记
// @version      1.3.3
// @description  获取看过列表，标记已经看过的番剧/电影/电视剧/纪录片/综艺，在索引页增加不透明度方便区别未看过。
// @author       判官喵
// @namespace    https://space.bilibili.com/6693935
// @match        https://www.bilibili.com/movie/index/*
// @match        https://www.bilibili.com/tv/index/*
// @match        https://www.bilibili.com/documentary/index/*
// @match        https://www.bilibili.com/variety/index/*
// @match        https://www.bilibili.com/anime/index/*
// @match        https://www.bilibili.com/guochuang/index/*
// @match        https://api.bilibili.com/x/space/bangumi/*
// @match        https://e.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/452831/B%E7%AB%99%E7%95%AA%E5%89%A7%E7%94%B5%E5%BD%B1%E7%94%B5%E8%A7%86%E5%89%A7%E7%BA%AA%E5%BD%95%E7%89%87%E7%BB%BC%E8%89%BA%E7%B4%A2%E5%BC%95%E9%A1%B5%E9%9D%A2%E5%B7%B2%E7%9C%8B%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/452831/B%E7%AB%99%E7%95%AA%E5%89%A7%E7%94%B5%E5%BD%B1%E7%94%B5%E8%A7%86%E5%89%A7%E7%BA%AA%E5%BD%95%E7%89%87%E7%BB%BC%E8%89%BA%E7%B4%A2%E5%BC%95%E9%A1%B5%E9%9D%A2%E5%B7%B2%E7%9C%8B%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
//正式脚本执行内容
 
//设定延时等待两秒
var waittime = 2000;
//设定周期检测时间5秒
var elsewaittime = 5000;
 
//获取本页影片数量
var mslit = document.getElementsByClassName("cover-wrapper").length;
mslit = mslit-1;
var mssduibi01 = 0;
var mssduibi02 = 0;
 
//判断在那个页面分别执行相应单元
var winhref = window.location.href.split(".com")[0];
var nedhrefA = "https://api.bilibili";
var nedhrefB = "https://www.bilibili";
var nedhrefC = "https://e.bilibili";
//判断番剧国创
var winhrefT = window.location.href.split("/index")[0];
var nedhrefY = "https://www.bilibili.com/anime";
var nedhrefZ = "https://www.bilibili.com/guochuang";
 
//页面加载完成后执行检测
window.onload = function () {
    if(winhref==nedhrefB){
            reloadPage();
            setTimeout(function(){
                huoqukanguo(); 
            },5000)
            xunhuanPage();
    }
    if(winhref==nedhrefA){
        setTimeout(function(){
            console.log("加载3秒不要慌~");
            xunhuanhuoqumsid();
            },1000)
        }
    if(winhref==nedhrefC){
        setTimeout(function(){
            GM_deleteValue("bangumis");
            GM_deleteValue("bilims");
            alert("已清理完成！");
            window.open("about:blank","_self")
            window.close();
            },3000)
    }
    }
 
if(winhref==nedhrefB){
//点击筛选执行检测
$(".filter-item").unbind('click').click(function(){
    // console.log("侧边筛选!");
    reloadPage();
    xunhuanPage();
    });
//点击筛选执行检测
$(".sort-item").unbind('click').click(function(){
    // console.log("顶部筛选!");
    reloadPage();
    xunhuanPage();
    });  
}
 
//检测执行单元，重新检测本页电影列表并标记看过电影
var reloadPage =  function(){
    setTimeout(function (){
        //提取缓存中已看列表
        var fanjufou;
        if(winhrefT==nedhrefY){
            fanjufou=1;
        }else if(winhrefT==nedhrefZ){
            fanjufou=1;
        }else{
            fanjufou=0;
        }
        var mslist = GM_listValues();
        var tiqu_ss_id = []
        //如果文件存在则转换缓存的字符串为数组，如果不存在则赋值一个空数组
        if(mslist != 0 ){
            //判断在番剧国创页面还是在其他页面
            var tiqustr;
            if(fanjufou==1){
                tiqustr= GM_getValue("bangumis");
            }else if(fanjufou==0){
                tiqustr= GM_getValue("bilims");
            }
            //判断提取的内容是否为空
            if(tiqustr==undefined){
                alert("请获取看过列表");
            }else{
                //将提取的id转换为数组
                tiqu_ss_id = tiqustr.split(",");
            }
        }else{
            alert("请获取看过列表");
        }
 
        var mssleng = document.getElementsByClassName("cover-wrapper").length;
        for (var i = 0; i < mssleng; i++) {
            //逐个获取电影链接的数字id
            var mss = document.getElementsByClassName("cover-wrapper")[i].href.split("/ss")[1];
            var ssleng = tiqu_ss_id.length;
            for (var x = 0; x < ssleng; x++) {
                var mcss = tiqu_ss_id[x]
                //判断看过电影则添加不透明度
                if (mss == mcss) {
                    document.getElementsByClassName("cover-wrapper")[i].style.opacity = "0.2";
                    }
                }
            }
        //延时等待执行
        }, waittime);
    }
//循环检测单元，每5秒循环检测本页面是否有变化（翻页点击检测无法实现的无奈之举）
var xunhuanPage =  function(){
    //记录单元,记录页面标记后的电影id
    var mslit = document.getElementsByClassName("cover-wrapper").length;
    mslit = mslit-1;
    //记录此页首个电影与末尾电影id
    var mssduibi01 = document.getElementsByClassName("cover-wrapper")[0].href.split("/ss")[1];
    var mssduibi02 = document.getElementsByClassName("cover-wrapper")[mslit].href.split("/ss")[1];
    //每5秒对比一次
    setInterval(function (){
        //判断此页是否有缺位，少于20项则不具备翻页条件
        var mslit = document.getElementsByClassName("cover-wrapper").length;
        if(mslit==20){
            //重新检测页面电影首尾id并做对比
            var mssduibi = document.getElementsByClassName("cover-wrapper")[0].href.split("/ss")[1];
            var mssduibiend = document.getElementsByClassName("cover-wrapper")[19].href.split("/ss")[1];
            if(mssduibi != mssduibi01){
                mssduibi01 = mssduibi;
                reloadPage();
            }
            else if(mssduibiend != mssduibi02){
                mssduibi02 = mssduibiend;
                reloadPage();
            }
        }
        else{
            reloadPage();
        }
    }, elsewaittime);
}    
 
 
//获取看过电影列表单元
//创建一个a标签 
var huoqukanguo =  function(){
    var para = document.createElement("a");
    var node = document.createTextNode("获取看过列表");
    para.appendChild(node);
    //获取uid
    var biliuid = document.getElementsByClassName("header-entry-avatar")[0].href.split("com/")[1];
    //获取时间戳
    var nowdate = Date.now();
    var apihref
    //判断在那个页面并组合成api链接
    if(winhrefT==nedhrefY){
        apihref = "https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=3&pn=1&ps=30&vmid="+biliuid+"&ts="+nowdate;
    }else if(winhrefT==nedhrefZ){
        apihref = "https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=3&pn=1&ps=30&vmid="+biliuid+"&ts="+nowdate;
    }else{
        //在其他页面
        apihref = "https://api.bilibili.com/x/space/bangumi/follow/list?type=2&follow_status=3&pn=1&ps=30&vmid="+biliuid+"&ts="+nowdate;
    }
    //往a标签里写入链接和新页面打开
    para.href = apihref;
    para.className = "sort-item";
    //获取筛选条再往后面加上这个a标签
    var element = document.querySelector(".sort-banner");
    element.appendChild(para);
    //清除缓存列表
    var parb = document.createElement("a");
    var nodeb = document.createTextNode("清除缓存内列表");
    parb.appendChild(nodeb);
    var jszhixin = "https://e.bilibili.com/case/wuling.html";
    parb.href = jszhixin;
    parb.className = "sort-item";
    element.appendChild(parb);
}   
 
 
 
//读取看过电影列表并存储到缓存单元
var xunhuanhuoqumsid = function(){
    alert("正在获取看过列表id，如果一直不动请刷新一下~ 请勿关闭此页面！");
    setInterval(function (){
        //防止不跳转页面，循环检测3次
        for(var wtime=0; wtime<3; wtime++){
        //获取当前执行的第几页
        var msspn = window.location.href.split("pn=")[1];
        msspn = msspn.charAt(0);
        //执行id提取存放单元
        //获取json字符串
        var pretxt = document.getElementsByTagName("pre")[0];
        pretxt = pretxt.textContent;
        //格式化json并循环逐个放入数组中
        var txt = pretxt;
        var mcss = JSON.parse(txt);
        var ss_id=new Array();
        //获取本页id个数
        var mcsslen = mcss.data.list.length;
        for(var i=0;i<mcsslen;i++)
        {
        ss_id[i]=mcss.data.list[i].season_id;
        }
 
        //列出缓存文件
        var mslist = GM_listValues();
        var tiqu_ss_id = []
        //如果文件存在则转换缓存的字符串为数组，如果不存在则赋值一个空数组
        var apifanjufou = window.location.href.split("list?type=")[1];
        apifanjufou = Number(apifanjufou.charAt(0));
        var fanjufou;
        if(apifanjufou==1){
            fanjufou=1;
        }else if(apifanjufou==2){
            fanjufou=0;
        }
        if(mslist != 0 ){
            var tiqustr;
            if(fanjufou==1){
                tiqustr= GM_getValue("bangumis");
            }else if(fanjufou==0){
                tiqustr= GM_getValue("bilims");
            }
            //判断提取的内容是否为空
            if(tiqustr==undefined){
                alert("请获取看过列表");
            }else{
                //将提取的id转换为数组
                tiqu_ss_id = tiqustr.split(",");
            }
        }
 
        //查重，避免重复录入
        //设定h/j计数器，设定k为提取数组长度/l为获取的json数组长度
        var h = 0;
        var k = tiqu_ss_id.length;
        var l = ss_id.length;
        var zancunrugm = tiqu_ss_id;
        //如果A等于B则跳过当前循环
        //如果A不等于b则进入下个循环，如果下个循环还没有则加入数组，如果下个循环等于，则跳过当前循环进入下个循环
        if(k==0){
            console.log("无缓存id，将全部录入缓存文件中");
            for(var j=0; j<l; j++){
                zancunrugm.push(ss_id[j]);
            }
        }else{
            for(j=0; j<l; j++){
                for(h=0; h<k; h++){
                    //如果缓存的id和页面的id相同则跳出当前循环
                    if(tiqu_ss_id[h] == ss_id[j]){
                        // console.log(ss_id[j]+"已存在");
                        break;
                    }else{
                        //如果缓存的id和页面的id不同则跳过这个循环
                        continue;
                    }
                }
                if(h==k){
                    //如果循环个数超出缓存个数则没有存储，将此个id存储进缓存
                    zancunrugm.push(ss_id[j]);
                }
            }
        }
        
        //将数组转换为字符串
        let cunrugm = zancunrugm.toString();
        if(fanjufou==1){
            //存放提取的番剧
            GM_setValue("bangumis",cunrugm);
        }else if(fanjufou==0){
            //存放提取的电影电视剧综艺纪录片
            GM_setValue("bilims",cunrugm);
        }
        //如果满足30条全部，将自动执行翻页操作，进行下页json读取
        //不满足30条，则提示获取完成并关闭页面
        if(mcsslen == 30){
            //5秒后自动翻页
            var msspnq = window.location.href.split("pn="+msspn)[0];
            var msspnh = window.location.href.split("pn="+msspn)[1];
            msspn = Number(msspn)+1;
            msspn = msspnq+"pn="+msspn+msspnh;
            setTimeout(function(){
                window.location.href = msspn
            },2000)
            
        }else{
            if(fanjufou==1){
                tiqustr= GM_getValue("bangumis");
            }else if(fanjufou==0){
                tiqustr= GM_getValue("bilims");
            }
            //判断提取的内容是否为空
            if(tiqustr==undefined){
                alert("请获取看过列表");
            }else{
                //将提取的id转换为数组
                tiqu_ss_id = tiqustr.split(",");
            }
            //将提取的id转换为数组
            tiqu_ss_id = tiqustr.split(",");
            if(fanjufou==1){
                alert("已完成全部已看番剧id获取，共计看过"+tiqu_ss_id.length+"部番剧/国创，请关闭此页面！");
            }else if(fanjufou==0){
                alert("已完成全部已看影片id获取，共计看过"+tiqu_ss_id.length+"部电影/电视剧/纪录片/综艺，请关闭此页面！");
            }
                setTimeout(function(){
                window.open("about:blank","_self")
                window.close();
            },2000)
        }
    }
    }, elsewaittime);
    
}
 
 
})();