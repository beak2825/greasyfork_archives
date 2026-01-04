// ==UserScript==
// @name         为什么不问问神奇海螺呢？
// @namespace    http://www.yhdm.io/
// @version      0.3
// @description  阿巴阿巴阿巴
// @author       null
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do?*
// @match        https://study.enaea.edu.cn/viewerforccvideo.do?*
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439240/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E9%97%AE%E9%97%AE%E7%A5%9E%E5%A5%87%E6%B5%B7%E8%9E%BA%E5%91%A2%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/439240/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E9%97%AE%E9%97%AE%E7%A5%9E%E5%A5%87%E6%B5%B7%E8%9E%BA%E5%91%A2%EF%BC%9F.meta.js
// ==/UserScript==
//

console.warn("=================准备开始=================\n");
var state = 0;
var weburl=unsafeWindow.location.href;
console.warn(weburl);

//*******************主界面检测*******************
(function main() {
console.warn("主界面检测");
if(weburl.indexOf('study.enaea.edu.cn/circleIndexRedirect.do?')!=-1){







    if(parseInt(xpath_single('/html/body/div[4]/div[2]/div/div/div[1]/div/p[1]').singleNodeValue.innerHTML.slice(3,-2))
    > parseInt(xpath_single('/html/body/div[4]/div[2]/div/div/div[1]/div/p[2]').singleNodeValue.innerHTML.slice(3,-2))){
        //切换导航卡
    setTimeout(()=>{
        xpath_single('/html/body/div[4]/div[2]/div/div/ul/li[2]').singleNodeValue.click();
        xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/div[2]/div[1]/label/div/menu/li[2]').singleNodeValue.click();
    },3000)
    setTimeout(()=>{
        //获得全部视频数
        console.warn("=================开始学习=======================\n");
        var list_len = parseInt(xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/div[2]/div[2]').singleNodeValue.innerHTML.slice(1,-1));
        console.warn("list_len" + list_len);
        if(list_len!=0){
            list_len += 10;
            var first_s = 1;
            var newvideo = [];
            for(;first_s<=list_len;first_s++){
                if(xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/table/tbody/tr['+ first_s +']/td[4]/span').singleNodeValue != null){
                    var strget = xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/table/tbody/tr['+ first_s +']/td[4]/span').singleNodeValue.innerHTML;
                    if(strget == "-"){
                        newvideo.push(first_s);
                    }
                }
            }
            if(newvideo.length != 0){
            for(let a = 1;a<=newvideo.length;a++){
                setTimeout(()=>{
                    console.warn("第一次点击第"+ a +"个视频"+ newvideo[a-1]);
                    xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/table/tbody/tr[' + newvideo[a-1] + ']/td[6]/a').singleNodeValue.click();
                },a*5000);
            }
            }

            var timeall_list = [];
            var timenumlist = [];
            var curtime = 0;
            var ti = 1;
            for(;ti<=list_len;ti++){
                if(xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/table/tbody/tr['+ ti +']/td[2]/span').singleNodeValue != null){
                    var timeget = xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/table/tbody/tr['+ ti +']/td[2]/span').singleNodeValue.innerHTML.split(":");
                    var getsecondtime = (parseInt(timeget[0])*3600 + parseInt(timeget[1])*60 + parseInt(timeget[2]))*1000 + 300000;
                    timenumlist.push(ti);
                    timeall_list.push(curtime);
                    curtime += getsecondtime;
                }
            }
            console.warn("timeall_list: " + timeall_list);
            timeall_list[0] = 300000;
            for(let t = 1;t<=timeall_list.length;t++){
                setTimeout(()=>{
                    console.warn("切换第"+ t +"个视频时间"+ timeall_list[t-1]);
                    xpath_single('/html/body/div[4]/div[2]/div/div/div[3]/div/table/tbody/tr[' + timenumlist[t-1] + ']/td[6]/a').singleNodeValue.click();
                },timeall_list[t-1]);
            }
        }
        },7000);
    }else{
      alert("恭喜！学完啦！请检查有无遗漏部分");
    }
}
   // setInterval(main,600000);
})();



//*******************进入视频界面*******************
if(weburl.indexOf('study.enaea.edu.cn/viewerforccvideo.do?')!=-1){
console.warn("看视频");

setTimeout(()=>{
    var vedio_len = parseInt(xpath_single('/html/body/div[2]/div/div[2]/div[1]/div/ul/li[1]/span').singleNodeValue.innerHTML);
    console.warn("vedio_len" + vedio_len);
var i = 1;
var time_all = 0;   //总时间，到点关闭
var nowtime = 0;    //当前位置时间
var switch_list =[];    //切换时刻表
var click_list =[];    //点击时刻表
    //计算时刻表
for(;i<=vedio_len;i++){
    console.warn("我进来了" + i);
    var timelist = xpath_single('/html/body/div[2]/div/div[2]/div[1]/ul/li[1]/div[2]/ul/li[' + i + ']/div/div[1]').singleNodeValue.innerHTML.split(":");
    var secondtime = (parseInt(timelist[0])*3600 + parseInt(timelist[1])*60 + parseInt(timelist[2]))*1000;
    var maxtime = secondtime + 30000;
    time_all += maxtime;
    var numtime = parseInt(secondtime/1200000);    //点击次数
    var lefttine = secondtime%1200000 + 10000;    //最后剩余时间
    console.warn("算完了"+ i);
    switch_list.push(nowtime);
    //判断20min
    if(secondtime>1200000){  //大于20
        var j = 0;
        for(;j<=numtime;j++){
            if(j!=numtime){
                nowtime += 1210000;//20min点击弹出
                click_list.push(nowtime);

            }else{
                nowtime += lefttine;
                nowtime += 60000;
            }
        }
    }else{
        //小于20min直接定时关闭
        nowtime += maxtime;
    }
}

    switch_list[0]=3000;
 console.warn("switch_list" + switch_list);
 console.warn("click_list" + click_list);
//关闭页面
setTimeout(()=>{
var closed = unsafeWindow.open("about:blank","_self");
    console.warn("关闭时间" + time_all);
       closed.close();
},time_all);

//发布播放任务
for(let x = 1;x<=switch_list.length;x++){
setTimeout(()=>{
    if(x==1){
    setTimeout(()=>{
    var video = document.getElementsByTagName("video");
    console.warn("从头开始");
    video.currentTime = '0';
    },10000);
    }
    console.warn("播放第"+ x +"次时间"+ switch_list[x-1]);
        xpath_single('/html/body/div[2]/div/div[2]/div[1]/ul/li[1]/div[2]/ul/li['+ x + ']').singleNodeValue.click();
    },switch_list[x-1]);
}
//发布按钮任务
for(let y = 0;y<click_list.length;y++){
setTimeout(()=>{
    console.warn("点击第"+ y +"次时间"+ click_list[y-1]);
        xpath_single('/html/body/div[6]/table/tbody/tr[2]/td[2]/div[3]/button').singleNodeValue.click();
    },click_list[y]);
}
},3000);
}

//xpath查找元素
function xpath_single(query) {
    return document.evaluate(query, document, null,
        XPathResult.FIRST_ORDERED_NODE_TYPE , null);
}










