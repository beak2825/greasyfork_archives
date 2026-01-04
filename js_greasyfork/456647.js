// ==UserScript==
// @name         bbs7070增强开发版
// @namespace    https://bbs7070.com/
// @version      1.3
// @description  增强论坛用户体验
// @author       viewtheard
// @license      GPL-3.0
// @match        https://qq9090.com/thread-*
// @match        https://yy9090.top/thread-*
// @match        https://yy7070.top/thread-*
// @match        https://bbs7070.net/thread-*
// @match        https://bbs7070.com/thread-*
// @match        https://154.17.228.98/thread-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bbs7070.com
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/456647/bbs7070%E5%A2%9E%E5%BC%BA%E5%BC%80%E5%8F%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/456647/bbs7070%E5%A2%9E%E5%BC%BA%E5%BC%80%E5%8F%91%E7%89%88.meta.js
// ==/UserScript==

// ====  Tips =====
// 建议搭配使用我的stylus里的bbs7070绿色版获得最佳体验
// https://userstyles.world/style/7069/bbs7070
// 您自行修改的代码会在更新的时候被覆盖，建议您备份您修改的内容
// 遇到问题请立即反馈
// === 更新日志 ===
// 2025.6.4 - 1.3
// 增加了多个域名支持。
// 修正了简讯窗口未加载标记为蓝色用户的bug。
// === 更新日志 ===
// 2025.6.4 - 1.2
// 修正了论坛更新后脚本失效的问题。
// === 更新日志 ===
// 2022.12.21 - 1.1
// 1、完善简约统计模式，给各类用户做颜色分类标识
// 2、修复快速查看帖子未生效的bug
// 2022.11.16 - 1.0
// 提供了3大功能：
// 1、登录用户（就是你）的头像会增加图形边框装饰。
// 2、指定用户的头像提供模糊处理的能力。
// 3、主题贴进行回复统计的功能。对三大类用户（红[模糊处理的用户]，
// 蓝[未做处理的用户]，绿[我]）提供了两种模式，一种是简约模式(对3
// 类用户回复数的最多人的统计)，另一种是完整统计。
// ================

'use strict';
var statisticsSwitch=false;

//查找身份
var o=document.getElementsByClassName("vwmy")[0];
var k=o.children[0];
var myHref=k.href;//https://bbs7070.com/home.php?mod=space&uid=9795
//var myShortHref=myHref.substr(19,myHref.length);
var lastSlashIndex = myHref.lastIndexOf('/');
var myShortHref = lastSlashIndex !== -1 ? myHref.substr(lastSlashIndex + 1) : '';

var mysHref=[].concat(myShortHref);
console.log(myShortHref);//home.php?mod=space&uid=9795

//给自己头像加装饰边框
var myImg=document.querySelector("#um .avt.y.t9_img_360 img");
myImg.style.borderImage="url(https://www.w3school.com.cn/i/css/border.png) 11 round" ;

//获取楼层中的某个用户名
var storeyUser=document.getElementsByClassName(".xw1");

//获取总楼层
var totalStorey;
totalStorey=document.querySelectorAll(".pls.t9_pls .authi");
console.log("总楼层数是"+totalStorey.length);
//初始化总楼层超链接集合
var totalStoreyA;
totalStoreyA=document.querySelectorAll(".pls.t9_pls .authi a");
var shortTotalStoreyURL;
var sTotalStoreyURL=[];

let storeyUsers=[];

let UserAssembly;
//读取存储的统计图状态
if(GM_getValue('saveStatisticsSwitch'))
{
    statisticsSwitch=GM_getValue('saveStatisticsSwitch');
}
//读取存储的用户名
if(GM_getValue('saveStoreyUsers'))
{
    storeyUsers=GM_getValue('saveStoreyUsers');
}
let i;
let mynum=0;
//处理头像
function handleImage(){
    let btnID=document
    alert("点击了handleImage！");
    console.log('点击了按钮');
}

for (i = 0; i < totalStorey.length; i++) {
    //获得总楼层url集合
    let totalStoreyURL=totalStoreyA[i].href;
    //shortTotalStoreyURL=totalStoreyURL.substr(19,totalStoreyURL.length);
    let lastSlashIndex = totalStoreyURL.lastIndexOf('/');
    let shortTotalStoreyURL = lastSlashIndex !== -1 ? totalStoreyURL.substr(lastSlashIndex + 1) : '';
    sTotalStoreyURL.push(shortTotalStoreyURL);
    //console.log(shortTotalStoreyURL);
    //生成按钮
    let btn=document.createElement('button');
    btn.innerText='模糊';
    btn.setAttribute('class','hideBtn'+i);
    //注入样式
    let style=document.createElement('style');
    style.innerText='.hideBtn'+i+'{border:1px solid #FFEBCD;height:20px;padding:0px;}';
    btn.appendChild(style);

    //document.querySelectorAll(".pls.t9_pls .authi")[i].appendChild(btn);


    //插入按钮的位置
    let insertPlace=document.querySelectorAll(".pls.t9_pls .xl.xl2.o.cl")[i];

    if (insertPlace!=null)
    {
        insertPlace.appendChild(btn);
        document.querySelector('.hideBtn'+i).addEventListener('click', (el)=>{
            let storeyUsername=el.srcElement.parentNode.parentNode.querySelector(".xw1").text;
            let storeyUserlink=el.srcElement.parentNode.parentNode.querySelector(".xw1").href;
            //let shortUserlink=storeyUserlink.substr(19,storeyUserlink.length);
            let lastSlashIndex = storeyUserlink.lastIndexOf('/');
            let shortUserlink = lastSlashIndex !== -1 ? storeyUserlink.substr(lastSlashIndex + 1) : '';
            let storeyUserImg=el.srcElement.parentNode.parentNode.querySelector(".avtm>img");


            //获取点击楼层的头像
            //alert(storeyUserImg);
            console.log(storeyUserImg);
            //为楼层的头像注入样式

            //filter: grayscale(90%);-webkit-filter: grayscale(90%);-moz-filter: grayscale(90%);-ms-filter: grayscale(90%);-o-filter: grayscale(90%);filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=0.9);-webkit-filter: grayscale(0.9);

            //检查是否保存过
            var isSave=new Boolean(false);
            for(let j = 0; j < storeyUsers.length; j++)
            {
                if (storeyUsers[j]==shortUserlink)
                {
                    isSave=true;
                    storeyUserImg.style.filter="blur(0px)";
                    //去掉点击的项目
                    storeyUsers.splice(j,1);
                    console.log('保存过');
                    //console.log(storeyUsers);
                    break;
                }
            }
            if(isSave==false)
            {
                //保存楼层用户数组
                storeyUserImg.style.filter="blur(10px)";
                storeyUsers.push(shortUserlink);
            }
            //存储短链接
            GM_setValue('saveStoreyUsers',storeyUsers);

            console.log(storeyUserImg.parentNode);
            //获取点击的楼层用户名
            console.log(storeyUsername);
            //获取点击的楼层用户个人空间超链接
            console.log(storeyUserlink);

            //alert(el.srcElement.parentNode.parentNode.id);
            console.log(el.target);
            console.log(el.target.className);
            //获取点击的楼层用户ID
            console.log(el.srcElement.parentNode.parentNode);
        })
    }
    else
    {
        mynum++;//获取我回复的数量
        console.log('不能插入按钮'+i);
    }
}
console.log('我回复了:'+mynum+'次');
//处理我回复楼层的头像边框
let myStoreys;
for(i=0;i<mynum;i++)
{
    myStoreys= document.querySelectorAll(".pls.t9_pls .avtm[href='"+myShortHref+"']");
    console.log("myStoreys"+i);
    let myImg=myStoreys[i].firstChild;
    myImg.style.borderImage="url(https://www.w3school.com.cn/i/css/border.png) 11 round" ;
    console.log(myStoreys);
}



//解析出所有存储的用户URL
let d=0;//平衡去掉的数组项下标
let currentHandleUser=[].concat(storeyUsers);//当前页面中所有处理过保存的图像初始化赋值
let sUsersLength=storeyUsers.length;
for (let i = 0; i < sUsersLength; i++) {
    let storeyUserURL=storeyUsers[i];
    //获取当前页面当前取出用户URL的数量
    //let storeyUserURL=document.evaluate("//*[text()='将单车骑到年底']",document,null,XPathResult.ANY_TYPE,null).iterateNext().href;

    //let pageStoreUserNum=document.querySelectorAll("a.xw1[href='home.php?mod=space&uid=129']").length;
    let pageStoreUser=document.querySelectorAll("a.xw1[href='"+storeyUserURL+"']");
    let pageStoreUserNum=pageStoreUser.length;

    //将所有存储的用户头像做处理
    let storeyUserImg;
    for (let j=0;j<pageStoreUserNum;j++)
    {
        storeyUserImg=pageStoreUser[j].parentNode.parentNode.parentNode.querySelector(".avtm>img");
        //console.log(storeyUserImg);
        storeyUserImg.style.filter="blur(10px)";
    }
    if (pageStoreUserNum==0)
    {
        currentHandleUser.splice(i-d,1);//当前页面中所有处理过保存的图像
        d++;
        console.log('删除数组项'+i+storeyUserURL);
    }


    //document.querySelectorAll("a.xw1")[i].text;
}
////计算当前用户回帖数量
//console.log('当前处理过的用户头像集合:'+currentHandleUser);
//statistical(currentHandleUser,10,'red');

////获取未处理的回复用户数组
let nohandleUser=[];
let TotalUserlist=[].concat(repeatHandle(sTotalStoreyURL));
//console.log('总用户列表'+TotalUserlist);

nohandleUser=compNohanderUserList(TotalUserlist,currentHandleUser);
//去除我的元素
RemoveGroupOne(nohandleUser,myShortHref);


////对未处理过回复的用户计算每人回帖次数

//计算当前页面所有用户数无重复

var userCount;
if(mynum>0)
{

    userCount=currentHandleUser.length+nohandleUser.length+1;
}
else
{
    userCount=currentHandleUser.length+nohandleUser.length;
}




////统计最外窗口容器
let bd=document.getElementsByTagName('body')[0];
let bdLastChild=bd.childNodes[19];
let w_div=document.createElement('div');

w_div.setAttribute('class','sdiv');
w_div.innerText='w_div!!';
let style=document.createElement('style');
const wWidth=userCount*50;
//w_div.innerHTML='<div id="sdiv" style="border:5px solid rgb(199, 209, 148);width:350px;height:150px;position:fixed;zindex:99;margin-Left:950px;margin-Top:-12211px;">test</div>';
style.innerText='.sdiv{border:3px solid rgb(199, 209, 148);width:'+wWidth+';height:110px;position:fixed;zindex:99;float:right;top:363px;right:45px;}';
w_div.appendChild(style);
bd.insertBefore(w_div,bdLastChild);

//绘制绘图板
w_div.innerHTML='<canvas id="userCont" width="'+wWidth+'" height="180px" style="border:3px solid #aaa;position:fixed;z-index:99;float:right;top:363px;right:45px;">请换个浏览器再试！</canvas>';

//简讯统计窗口
var brif_group=new Map();//简讯统计用户
//计算单列统计条宽度
let lineWidth=(wWidth-20)/(userCount);
//绘图初始位置X
let X=10+lineWidth*currentHandleUser.length;

console.log('当前处理过的用户头像集合:'+currentHandleUser);
statistical(currentHandleUser,10,'red');
console.log('获取未处理的回复用户数组'+nohandleUser);
statistical(nohandleUser,X,'blue');
X=X+lineWidth*nohandleUser.length;
statistical(mysHref,X,'green');


let brif_string="";
let brif_num=brif_group.size;
brif_group.forEach((value,key,map)=>{
    brif_string+=key+'：'+value+'次<br>';
})

let brief_div=document.createElement('div');
brief_div.setAttribute('class','briefdiv');
brief_div.innerHTML=brif_string;
let brief_style=document.createElement('style');
brief_style.innerText='.briefdiv{box-shadow:5px 5px 10px gray;border-radius: 5px;font-size:11px;border:1px solid rgb(199, 209, 148);background:linear-gradient(to right,rgb(199, 209, 149), #d7edff); color:#5f84a8;width:120px;height:'+10*brif_num+';position:fixed;z-index:3;float:right;top:283px;right:15px;}'
if(statisticsSwitch==false)
{
    w_div.style.display='none';
}
else
{
    w_div.style.display='block';
}

function StatisSW () {
    if(w_div.style.display != "none")
    {
        w_div.style.display='none';
        statisticsSwitch=false;

    }
    else
    {
        w_div.style.display='block';
        statisticsSwitch=true;
    }
    GM_setValue('saveStatisticsSwitch',statisticsSwitch);
}
brief_div.onclick = StatisSW;
brief_div.appendChild(brief_style);
bd.insertBefore(brief_div,bdLastChild);




////在返回顶部条中加入统计功能按钮
//创建span
let statisticsSpan=document.createElement('span');
//statisticsSpan.innerText='计统';
statisticsSpan.setAttribute('class','statsSpan');
//获取插入位置
let inertPlace=document.querySelector('#scrolltop');
inertPlace.appendChild(statisticsSpan);

//创建超链接
let a=document.createElement('a');
a.id='statsA';
a.innerText="统";
//a.href="http://bing.com";
a.title="用户统计";
a.setAttribute("onclick","alert('备用，待开发！');");
let innerPlace=document.querySelector('.statsSpan');
innerPlace.appendChild(a);



//去一楼广告
let css=
    `
        .a_p{
    display:none;
    }
 `
    GM_addStyle(css)

//统计每类用户组的每个用户回复数
function statistical(usersArr,startX,groupColor)
{
    var canvas=document.querySelector('#userCont');
    var ctx=canvas.getContext('2d');

    var replyNum;
    let CurrentmaxUser;
    let ReplyCurrentGroupMap=new Map();
    let ReplyCurrentGroup=[];

    for(let i=0;i<usersArr.length;i++)
    {
        let UserName;

        let UserAssembly=document.querySelectorAll("a.xw1[href='"+usersArr[i]+"']");
        replyNum=UserAssembly.length;
        if(usersArr[i]!=myShortHref)
        {
            UserName=UserAssembly[0].text;//获取用户名

        }
        else
        {
            UserName='我';
        }
        ReplyCurrentGroupMap.set(UserName,replyNum);
        //将数量写入回复量数组中
        ReplyCurrentGroup.push(replyNum);
        //console.log(ReplyCurrentGroup);
        let height=15*replyNum;
        //console.log(UserName+' 有 '+replyNum+' 次回复');
        ctx.fillStyle=groupColor;
        ctx.fillRect(startX+lineWidth*i,185-height-20,lineWidth-5,height);
        ctx.fillText(UserName,startX+lineWidth*i,185-10,lineWidth-5);
        ctx.fillStyle='gold';
        ctx.fillText(replyNum,startX+lineWidth*i+20,185-23,lineWidth-5);

        // 将所有用户添加到 brif_group
        if (replyNum > 0) {
            brif_group.set(UserName, replyNum);
        }

    }
    console.log(ReplyCurrentGroup.length);
    //对当前回复数组取出最大值

    CurrentmaxUser=Math.max(...ReplyCurrentGroup);
    console.log('对当前回复数组取出最大值'+CurrentmaxUser);
    //反查用户名
    ReplyCurrentGroupMap.forEach((value,key,map)=>
                                 {
        if (CurrentmaxUser==value)
        {
            brif_group.set(key,value);
            console.log('对当前回复数组取出最大值的用户名是：'+key);
        }
    });
}

//删除数组中一个元素
function RemoveGroupOne(arr,item){
    const index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

//取出两个数组中不同的元素
function compNohanderUserList(arr1,arr2) {
    return arr1.concat(arr2).filter(function(item,index,arr){
        return arr.indexOf(item)===arr.lastIndexOf(item);

    })
}
//为当前页中所有用户名称数组去重
function repeatHandle(arr){
    return arr.filter(function(item,index,arr){
        return arr.indexOf(item,0)===index;
    });
}

//保存头像边框
function saveCFG(){
    GM_setValue('myImgBorder','https://www.w3school.com.cn/i/css/border.png');
}
saveCFG();

//读取设置
console.log(GM_getValue('myImgBorder'));

function delAllSaveData(){
    //删除saveStoreyUsers
    GM_deleteValue('saveStoreyUsers');
    //删除click_num
    GM_deleteValue('click_num');
    //删除saveStatisticsSwitch
    GM_deleteValue('saveStatisticsSwitch');
}
//delAllSaveData();
