// ==UserScript==
// @name         论坛显色
// @namespace    wj
// @version      2.0
// @description  论坛显色1
// @author       zhumeiling
// @match        http://admin.bbs3839.5054399.com/bbs/*
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-topic.html
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-reply.html
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-comment.html
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-topic.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-topic.html?req%5Breason_id%5D=0&req%5Bstatus%5D=0&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-reply.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-reply.html?req%5Breason_id%5D=0&req%5Bstatus%5D=0&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-comment.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Brid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude	 http://admin.bbs3839.5054399.com/bbs/report-comment.html?req%5Breason_id%5D=0&req%5Bstatus%5D=0&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Brid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445978/%E8%AE%BA%E5%9D%9B%E6%98%BE%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/445978/%E8%AE%BA%E5%9D%9B%E6%98%BE%E8%89%B2.meta.js
// ==/UserScript==

let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="465px"
Container.style.top="10px"
Container.style['z-index']="999999"
Container.innerHTML =`<input type="text" class="search" placeholder="ID" id="neirong" size="2"><input type="button" value="搜用户" id="haha"><input type="button" value="搜主帖ID" id="hahaha"><input type="button" value="搜回帖ID" id="hahaht"><input type="button" value="搜回复ID" id="hahahf">



`
document.body.appendChild(Container);

let btn=document.getElementById('haha'),
    btn1=document.getElementById('hahaha'),
    btnht=document.getElementById('hahaht'),
    btnhf=document.getElementById('hahahf'),

    textArea=document.getElementById('neirong');


btn.onclick=function(){
    if(textArea.value){
        let x = textArea.value;


        window.open("http://admin.bbs3839.5054399.com/bbs/topic-hasAudit.html?req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bself%5D=0&req%5Btag%5D=0&req%5Bstatus%5D=0&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bis_solve%5D=0&req%5Breply_status%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");//已审核帖子
        window.open("http://admin.bbs3839.5054399.com/bbs/reply-hasAudit.html?req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bis_top%5D=0&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");//已审核回帖
        window.open("http://admin.bbs3839.5054399.com/bbs/comment-hasAudit.html?req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Breply_id%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");//已审核回复
        //window.open("http://admin.bbs3839.5054399.com/bbs/topic-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Bid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Btag%5D=0&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=");//待审核帖子
        //window.open("http://admin.bbs3839.5054399.com/bbs/reply-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回帖
        //window.open("http://admin.bbs3839.5054399.com/bbs/comment-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Breply_id%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回复
    }else{
        alert("你尚未输入信息,请重新输入")
    }
}
btn1.onclick=function(){
    if(textArea.value){
        let x = textArea.value;


        window.open("http://admin.bbs3839.5054399.com/bbs/topic-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D=&req%5Bid%5D="+x+"&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bself%5D=0&req%5Btag%5D=0&req%5Bstatus%5D=0&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bis_solve%5D=0&req%5Breply_status%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");
        window.open("http://admin.bbs3839.5054399.com/bbs/reply-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D=&req%5Btid%5D="+x+"&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bis_top%5D=0&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");
        window.open("http://admin.bbs3839.5054399.com/bbs/comment-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D=&req%5Breply_id%5D=&req%5Btid%5D="+x+"&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");
        //window.open("http://admin.bbs3839.5054399.com/bbs/topic-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Bid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Btag%5D=0&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=");//待审核帖子
        //window.open("http://admin.bbs3839.5054399.com/bbs/reply-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回帖
        //window.open("http://admin.bbs3839.5054399.com/bbs/comment-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Breply_id%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回复
    }else{
        alert("你尚未输入信息,请重新输入")
    }
}

btnht.onclick=function(){
    if(textArea.value){
        let x = textArea.value;

        window.open("http://admin.bbs3839.5054399.com/bbs/reply-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Bid%5D="+x+"&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bis_top%5D=0&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");
        window.open("http://admin.bbs3839.5054399.com/bbs/comment-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D=&req%5Breply_id%5D="+x+"&req%5Btid%5D=&req%5Bid%5D=&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");
        //window.open("http://admin.bbs3839.5054399.com/bbs/topic-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Bid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Btag%5D=0&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=");//待审核帖子
        //window.open("http://admin.bbs3839.5054399.com/bbs/reply-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回帖
        //window.open("http://admin.bbs3839.5054399.com/bbs/comment-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Breply_id%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回复
    }else{
        alert("你尚未输入信息,请重新输入")
    }
}

btnhf.onclick=function(){
    if(textArea.value){
        let x = textArea.value;
        window.open("http://admin.bbs3839.5054399.com/bbs/comment-hasAudit.html?req%5Buid%5D=&req%5Bsid%5D=&req%5Breply_id%5D=&req%5Btid%5D=&req%5Bid%5D="+x+"&req%5Brisk_level%5D=-1&req%5Brisk_type%5D=-1&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bis_essence%5D=0&req%5Bself%5D=0&req%5Bstatus%5D=0&req%5Bpass_time%5D%5Bfrom%5D=&req%5Bpass_time%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bmin_word_length%5D=&req%5Bmax_word_length%5D=&req%5Bfrom_client%5D=0&req%5Bip%5D=");


        //window.open("http://admin.bbs3839.5054399.com/bbs/topic-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Bid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Btag%5D=0&req%5Bkeyword%5D=&req%5Btype%5D=0&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bis_official%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=");//待审核帖子
        //window.open("http://admin.bbs3839.5054399.com/bbs/reply-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回帖
        //window.open("http://admin.bbs3839.5054399.com/bbs/comment-waitAudit.html?req%5Bself%5D=0&req%5Buid%5D="+x+"&req%5Bsid%5D=&req%5Btid%5D=&req%5Breply_id%5D=&req%5Bid%5D=&req%5Bkeyword%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=&req%5Bexact_keyword%5D=&req%5Bsection_group_id%5D=0&req%5Bfrom_client%5D=0&req%5Bip%5D=")//待审核回复
    }else{
        alert("你尚未输入信息,请重新输入")
    }
}

//=====================================================================================================================================================
var zhutielan=["论坛：现代战舰","论坛：未来之役","论坛：APEX英雄手游","论坛：零号任务","论坛：地下城与勇士M","论坛：王者荣耀-Honor of Kings","论坛：王者荣耀-HOK​测试服","论坛：彩虹六号 M"],
    zhutiehuang=["论坛：终末阵线:伊诺贝塔","论坛：暗黑破坏神","论坛：代号:ATLAS",
                 "论坛：王者荣耀-先锋服","论坛：闪耀暖暖","论坛：乌托邦:起源(创造与魔法先锋服)","论坛：明日之后-先锋服","论坛：剑灵:革命(国际版)","论坛：刺激战场",
                 "论坛：公主连结(先行服)","论坛：超凡先锋-先锋服","论坛：英雄联盟手游-先锋服","论坛：天堂2M","论坛：Apex英雄-先锋服","论坛：哈利波特:魔法觉醒(繁中版)","论坛：野境重生","论坛：黑色沙漠(先锋服)",
                 "论坛：战双帕弥什(日服)","论坛：最终幻想7:THE FIRST SOLDIER","论坛：使命召唤手游(先锋服)"],
    zhutiehong=["84991007","72185407","78748131","79778522","83041416","84462063","84906564","17964974","57511484","57395395",
                "54671232","57879560","27211103","57884634","88898629","84135884","77300506","77323051","84448335","86150915",
                "88764027","88780007","62613352","90185333","51220993","86994458"],//18
    zhutiezise=["100019"];


if((document.location.href.indexOf("admin.bbs3839.5054399.com/bbs/topic") !== -1) || (document.location.href.indexOf("admin.bbs3839.5054399.com/bbs/shumei-topic") !== -1)){
    top1:for (let p=2;p<252;p=p+=5) {//主帖
        let z = document.querySelector("#table_list > tbody > tr:nth-child("+p+") > td:nth-child(3)");
        if(z){
            let str = z.innerText;
            for(let p3=0;p3<zhutiehong.length;p3++){
                if(str.indexOf(zhutiehong[p3]) !== -1){
                    z.style="background-color:#FD3A3A";
                    continue top1;
                }
            }
            for(let p4=0;p4<zhutiezise.length;p4++){
                if(str.indexOf(zhutiezise[p4]) !== -1){
                    z.style="background-color:#B505EB";
                    continue top1;
                }
            }
            for(let p1=0;p1<zhutielan.length;p1++){
                if(str.indexOf(zhutielan[p1]) !== -1){
                    z.style="background-color:#a7d2f0";
                    continue top1;
                }
            }for(let p2=0;p2<zhutiehuang.length;p2++){
                if(str.indexOf(zhutiehuang[p2]) !== -1){
                    z.style="background-color:#F6FAAB";
                    continue top1;
                }
            }
        }else if(z != true){
            break;
        }


    }
}

else if((document.location.href.indexOf("admin.bbs3839.5054399.com/bbs/reply") !== -1)||(document.location.href.indexOf("admin.bbs3839.5054399.com/bbs/shumei-reply") !== -1)){

    top2:for(let i=2;i<150;i=i+=3) {//回帖
        let x = document.querySelector("#table_list > tbody > tr:nth-child("+i+") > td:nth-child(3)");
        if(x){
            let str = x.innerText;
            for(let p3=0;p3<zhutiehong.length;p3++){
                if(str.indexOf(zhutiehong[p3]) !== -1){
                    x.style="background-color:#FD3A3A";
                    continue top2;
                }
            }
            for(let p4=0;p4<zhutiezise.length;p4++){
                if(str.indexOf(zhutiezise[p4]) !== -1){
                    x.style="background-color:#B505EB";
                    continue top2;
                }
            }
            for(let p1=0;p1<zhutielan.length;p1++){
                if(str.indexOf(zhutielan[p1]) !== -1){
                    x.style="background-color:#a7d2f0";
                    continue top2;
                }
            }for(let p2=0;p2<zhutiehuang.length;p2++){
                if(str.indexOf(zhutiehuang[p2]) !== -1){
                    x.style="background-color:#F6FAAB";
/*                     if(str.indexOf("论坛：暗黑破坏神") !== -1){
                        x.style="background-color:#F6FAAB";
                        let HTjiance=document.querySelector("#table_list > tbody > tr:nth-child("+i+") > td:nth-child(6) > div")
                        let HTjiancetxt=HTjiance.innerText;
                        if(str.indexOf("17659592") == -1 && (HTjiancetxt.indexOf("沉浸于标志性的暗黑魔幻美学世界，冒险的足迹从宁静的沃桑小镇，到无人的遗忘高塔") !== -1 || HTjiancetxt.indexOf("收集并搭配更多的装备技能组合，缔造属于自己的流派策略。各具特色的六大职业") !== -1)){
                            HTjiance.style="background-color:#F6FAAB";
                        }
                    } */
                    continue top2;
                }
            }
        }
        else if(x != true){
            break;
        }

}
}

else if((document.location.href.indexOf("admin.bbs3839.5054399.com/bbs/comment") !== -1)||(document.location.href.indexOf("admin.bbs3839.5054399.com/bbs/shumei-comment") !== -1)){

    top3:for(let o=2;o<102;o=o+=2){//回复
        let y = document.querySelector("#table_list > tbody > tr:nth-child("+o+") > td:nth-child(3)");
        if(y){
            let str = y.innerText;
            for(let p3=0;p3<zhutiehong.length;p3++){
                if(str.indexOf(zhutiehong[p3]) !== -1){
                    y.style="background-color:#FD3A3A";
                    continue top3;
                }
            }
            for(let p4=0;p4<zhutiezise.length;p4++){
                if(str.indexOf(zhutiezise[p4]) !== -1){
                    y.style="background-color:#B505EB";
                    continue top3;
                }
            }
            for(let p1=0;p1<zhutielan.length;p1++){
                if(str.indexOf(zhutielan[p1]) !== -1){
                    y.style="background-color:#a7d2f0";
                    continue top3;
                }
            }for(let p2=0;p2<zhutiehuang.length;p2++){
                if(str.indexOf(zhutiehuang[p2]) !== -1){
                    y.style="background-color:#F6FAAB";
                    continue top3;
                }
            }
        }
        else if(y != true){
            break;
        }

    }
}