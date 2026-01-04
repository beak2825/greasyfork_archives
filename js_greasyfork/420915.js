// ==UserScript==
// @name         称赞你的主播/bilibili自动弹幕跟风/天选助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动弹幕跟风/称赞你的主播/天选助手，称赞频率低一点，否则会被主播禁言的
// @author       你一定会牛气冲天
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420915/%E7%A7%B0%E8%B5%9E%E4%BD%A0%E7%9A%84%E4%B8%BB%E6%92%ADbilibili%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E8%B7%9F%E9%A3%8E%E5%A4%A9%E9%80%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420915/%E7%A7%B0%E8%B5%9E%E4%BD%A0%E7%9A%84%E4%B8%BB%E6%92%ADbilibili%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E8%B7%9F%E9%A3%8E%E5%A4%A9%E9%80%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
let chengyu=`
-成语-

才思敏捷,过目不忘,十年寒窗,博学多才,见多识广,才高八斗,学富五车,大公无私,
一鸣惊人,长相骏雅,身付异秉,才思敏捷,过目不忘,十年寒窗,博学多才,见多识广,
才高八斗,学富五车,文武双全,雄韬伟略,谈吐不凡,谈笑风声,高谈阔论,眉飞色舞,
运筹帷幄,言简意赅,完美无缺,一针见血,远见卓识,义正词严,一气呵成,大显神通,
出口成章,出类拔萃,出神入化,万古流芳,一本正经,一箭双雕,长篇大论,功德无量,
力排众议,力挽狂澜,气贯长虹,气势磅礴,气吞山河,坚韧不拔,身体力行,空前绝后,
视死如归,英姿焕发,奉公守法,艰苦奋斗,忠贞不渝,舍己为人,大公无私,一尘不染,
一鸣惊人,叱诧风云,排山倒海,惊涛骇浪,雷霆万钧,惊心动魄,横扫千军,惊天动地,
见缝插针,无孔不入,千篇一律,口诛笔伐,文从字顺,十全十美,无懈可击,无与伦比,
励精图治,壮志凌云,高瞻远瞩,忍辱负重,盖世无双,龙飞凤舞,一丝不苟,身兼数职,
日理万机,明察秋毫,英明果断,分身有术,孜孜不倦,花容月貌,如花似玉,相貌堂堂,
落落大方,眉清目秀,闭月羞花,鹤发童颜,沉鱼落雁,气宇轩昂,威风凛凛,字迹工整,
文笔极佳,才思敏捷,过目不忘,十年寒窗,博学多才,见多识广,才高八斗,学富五车,
文武双全,雄韬伟略,谈吐不凡,谈笑风声,高谈阔论,眉飞色舞,运筹帷幄,言简意赅,
完美无缺,一针见血,远见卓识,义正词严,一气呵成,大显神通,出口成章,出类拔萃,
出神入化,万古流芳,一本正经,一箭双雕,长篇大论,功德无量,力排众议,力挽狂澜,
气贯长虹,气势磅礴,气吞山河,坚韧不拔,身体力行,空前绝后,视死如归,英姿焕发,
奉公守法,艰苦奋斗,忠贞不渝,舍己为人,大公无私,一尘不染,一鸣惊人,叱诧风云,
排山倒海,惊涛骇浪,雷霆万钧,惊心动魄,横扫千军,惊天动地,见缝插针,无孔不入,
千篇一律,口诛笔伐,文从字顺,十全十美,无懈可击,无与伦比,励精图治,壮志凌云,
高瞻远瞩,忍辱负重,盖世无双,龙飞凤舞,一丝不苟,身兼数职,日理万机,明察秋毫,
英明果断,分身有术

-句子-
越有内涵的人越虚怀若谷,虽然你没有一簇樱唇两排贝齿,谈吐高雅脱俗,娉婷婉约的风姿,
妩媚得体的举止,优雅大方的谈吐,一开始就令我刮目相看, 你头脑精灵,作事不托泥戴水,
知道随机应变,懂团结,做事有条有理，那均匀的身段,使人想起秀美的柳枝,那亮晶晶的眼睛,
像映在溪水里的星星,那双鸽子般的眼睛,伶俐到像要立刻和人说话，波浪起伏，金光闪闪
`;
let shei=["你","","","","翠花"]
let enableWind=true;
let chengzanF=15;
let windF=1;

let chengyus=chengyu.split(/-.*?-/g);
let ci=[];
ci=chengyus.map(it=>{
   return it.trim().split(",")
})
ci=[].concat.apply([], ci);
let sendMsg=function(msg){
    console.log("发送-》",msg);
    // document.querySelector('textarea.chat-input').value=msg;
    document.querySelector('#control-panel-ctnr-box').__vue__.chatInput=msg;
    document.querySelector('#control-panel-ctnr-box > div.bottom-actions.p-relative > div > button').click()
}
let fl=document.createElement("div");
let wd=document.createElement("div");
let cz=document.createElement("div");
let tx=document.createElement("span");
let lastFive=[]
let timer=null;
let goWithWind=(s,l)=>{
    if(!enableWind) return;
    //s为匹配的长度，l为要分析相似的长度
    let its=document.querySelectorAll('#chat-items .danmaku-item');
    its=Array.prototype.slice.call(its);
    if(!its||its.length<s) return
    if(lastFive.length<s) lastFive=its.slice(-s);
    let pos=getNewDanPos(lastFive,its);
    switch(pos){
        case undefined: return;
        case its.length-1: return;
        default:
            if((its.length-1-pos)<l) return;
            else {
                lastFive=its.slice(-s);
                let words=getWindWord();
                if(words)
                sendMsg(words);
            }
    }
}
let getWindWord=()=>{
    //猜最新弹幕是否有共同意思
    let lastFiveWords=lastFive.map(x=>x.getAttribute("data-danmaku"));
    let couple=0;
    let word=""
    lastFiveWords.forEach((x,i)=>{
        lastFiveWords.forEach((y,j)=>{
            if(i>=j) return;
            if(x.indexOf(y)>-1||y.indexOf(x)>-1) {
                couple++;
                word=y;
            }
        })
    })
    if(couple>2) return word;
}
let getNewDanPos=(a,b)=>{
    for(let i=b.length-1;i--;i>=0){
        if(damMatch(b[i],a[a.length-1])){
            let isI=true
            a.forEach((e,j) => {
                if(!damMatch(e,b[i-a.length+1+j])) isI=false;
            });
            if(isI) return i;
        }
    }
}
let damMatch=(a,b)=>{
    if(a==b) return true;
    let aid=a.getAttribute("data-uid");
    let bid=b.getAttribute("data-uid");
    if(aid!=bid) return false;
    let aword=a.getAttribute("data-danmaku");
    let bword=b.getAttribute("data-danmaku");
    if(aid==bid&&aword==bword) return true;
    return false;
}
let moveAble=function(dv,clickFun){
    var x = 0;
    var y = 0;
    var l = 0;
    var t = 0;
    var isDown = false;
    var moved=false;
    //鼠标按下事件
    dv.onmousedown = function(e) {
        //获取x坐标和y坐标
        x = e.clientX;
        y = e.clientY;

        //获取左部和顶部的偏移量
        l = dv.offsetLeft;
        t = dv.offsetTop;
        //开关打开
        isDown = true;
        //设置样式
        dv.style.cursor = 'move';
    }
    //鼠标移动
    window.onmousemove = function(e) {
        if (isDown == false) {
            return;
        }
        //获取x和y
        var nx = e.clientX;
        var ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        var nl = nx - (x - l);
        var nt = ny - (y - t);
        moved=true;
        dv.style.left = nl + 'px';
        dv.style.top = nt + 'px';
    }
    //鼠标抬起事件
    dv.onmouseup = function() {
        if(moved) {
            moved=false;
        }else if(clickFun){
            clickFun();
        }
        //开关关闭
        isDown = false;
        dv.style.cursor = 'default';
    }
}
function getNumberInNormalDistribution(mean,std_dev){
    return mean+(randomNormalDistribution()*std_dev);
}
function randomNormalDistribution(){
    var u=0.0, v=0.0, w=0.0, c=0.0;
    do{
        //获得两个（-1,1）的独立随机变量
        u=Math.random()*2-1.0;
        v=Math.random()*2-1.0;
        w=u*u+v*v;
    }while(w==0.0||w>=1.0)
    //这里就是 Box-Muller转换
    c=Math.sqrt((-2*Math.log(w))/w);
    //返回2个标准正态分布的随机数，封装进一个数组返回
    //当然，因为这个函数运行较快，也可以扔掉一个
    //return [u*c,v*c];
    return u*c;
}
let go=false;

function secondsFormat( s ) { 
    s=parseInt(s)
    var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整 
    var hour = Math.floor( (s - day*24*3600) / 3600); 
    var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 ); 
    var second = s - day*24*3600 - hour*3600 - minute*60; 
    if(day!==0) return day + "天"  + hour + "时" + minute + "分" + second + "秒"; 
    if(hour!==0) return hour + "时" + minute + "分" + second + "秒"; 
    if(minute!==0) return minute + "分" + second + "秒"; 
    return second + "秒"; 
}
function lapseIndicator(s){
    try{
        clearInterval(timer);
    }catch(err){

    }
    timer=setInterval(()=>{
        tx.innerText=secondsFormat(s)+"后"
        if(s--<0) clearInterval(timer)
    },1000)
}
let chengzan=(t)=>{
    let rt=t*getNumberInNormalDistribution(0,1);
    rt=Math.abs(rt);
    console.log("下次称赞：",secondsFormat(rt/1000)+"后")
    lapseIndicator(rt/1000)
    setTimeout(()=>{
        if(go){
            let idx=parseInt(Math.random()*ci.length);
            let msg=shei[parseInt(Math.random()*shei.length)]+ci[idx];
            msg=msg.replace(/[\r*?\n*?\s*?]/g,"");
            sendMsg(msg);
            chengzan(t)
        }
    },rt)
}
let ac1=()=>{
    if(go==false) {
        tx.innerHTML="开始了";
        fl.style.backgroundColor="rgba(122, 122, 234, 0.4)";
        go=true
        chengzan(chengzanF*60*1000)
    }else {
        tx.innerHTML="停止了";
        clearInterval(timer)
        fl.style.backgroundColor="rgba(234, 122,122 , 0.4)";
        go=false
    }
}

function start(){
    fl.append(wd)
    fl.append(cz)
    fl.append(tx)
    tx.append("未开始")
    wd.append("风")
    cz.append("夸")
    fl.setAttribute("style","user-select:none;z-index: 99999;color: #666;box-shadow: 3px 3px 20px #aaa;cursor: pointer; text-align: center;height: 100px;width: 100px;font-size: 20px;position: fixed;top:400px;left: 400px;background-color: rgba(122, 122, 122, 0.4);border-radius: 100px;")
    wd.setAttribute("style","color: #666;box-shadow: 3px 3px 20px #aaa;cursor: pointer; text-align: center; line-height: 30px;height: 30px;width: 30px;font-size: 10px;position: relative;top:20px;left: 5px;background-color: rgba(122, 234,122 , 0.4);border-radius: 100px;")
    cz.setAttribute("style","color: #666;box-shadow: 3px 3px 20px #aaa;cursor: pointer; text-align: center; line-height: 30px;height: 30px;width: 30px;font-size: 10px;position: relative;top:-10px;left: 60px;background-color: rgba(122, 122, 122, 0.2);border-radius: 100px;")
    cz.onmouseover=function(){
        cz.style.backgroundColor="rgba(177, 188, 166, 0.4)"
    }
    cz.onmouseout=function(){
        cz.style.backgroundColor="rgba(122, 122, 122, 0.4)"
    }
    wd.onclick=function(){
        if(enableWind) {
            enableWind=false;
            wd.style.backgroundColor="rgba(122, 122, 122, 0.4)"
            tx.innerHTML="跟风停止";
        }
        else {
            enableWind=true;
            wd.style.backgroundColor="rgba(122, 234,122 , 0.4)"
            tx.innerHTML="跟风开启";
        }
    }
    cz.onclick=ac1;
    fl.style.fontSize="17px";
    document.body.append(fl);
    moveAble(fl);
    setInterval(() => {
        goWithWind(8,6);
    }, windF*1000);
}
start();
})();