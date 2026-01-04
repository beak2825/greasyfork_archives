// ==UserScript==
// @name         举报2.0
// @namespace    wjddd
// @version      5.2
// @description  打开网址
// @author       wangjia
// @match        http://admin.bbs3839.5054399.com/bbs/report-topic.html*
// @match        http://admin.bbs3839.5054399.com/bbs/report-reply.html*
// @match        http://admin.bbs3839.5054399.com/bbs/report-comment.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445267/%E4%B8%BE%E6%8A%A520.user.js
// @updateURL https://update.greasyfork.org/scripts/445267/%E4%B8%BE%E6%8A%A520.meta.js
// ==/UserScript==


let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="465px"
Container.style.top="10px"
Container.style['z-index']="999999"
Container.innerHTML =`<input type="text" class="search" placeholder="ID" id="neirong" size="2"><input type="button" value="搜用户" id="haha"><input type="button" value="搜主帖ID" id="hahaha"><input type="button" value="搜回帖ID" id="hahaht"><input type="button" value="搜回复ID" id="hahahf">
---<input type="button" value="批量打开待审核举报" id="hahajubao">


`
document.body.appendChild(Container);

let btn=document.getElementById('haha'),
    btn1=document.getElementById('hahaha'),
    btnht=document.getElementById('hahaht'),
    btnhf=document.getElementById('hahahf'),
    btn2=document.getElementById('hahajubao'),
    textArea=document.getElementById('neirong');

btn2.onclick=function(){
    window.open("http://admin.bbs3839.5054399.com/bbs/report-topic.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=");
    window.open("http://admin.bbs3839.5054399.com/bbs/report-reply.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=");
    window.open("http://admin.bbs3839.5054399.com/bbs/report-comment.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Brid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=");
}
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




//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------以下-举报--------
const shuzuZ={
    "光·遇":"background-color:#F07B98",
    "萤火突击":"background-color:#F07B98",
    "逃跑吧!少年":"background-color:#5FC4FF"
}
const shuzuH={
    "光·遇":"background-color:#F07B98",
    "萤火突击":"background-color:#F07B98",
    "原神":"background-color:#7EFA99",
    "崩坏3":"background-color:#7EFA99",
    "崩坏学园2":"background-color:#7EFA99",
    "崩坏: 星穹铁道":"background-color:#7EFA99",
    "未定事件簿":"background-color:#7EFA99",
    "人工桌面":"background-color:#7EFA99",
    "米游社":"background-color:#7EFA99",
    "绝区零":"background-color:#7EFA99",
}
const shuzuF={
    "光·遇":"background-color:#F07B98",
    "萤火突击":"background-color:#F07B98",
}
const tongID={
    "84448335":"background-color:#F07B98",
    "86150915":"background-color:#F07B98",
    "88764027":"background-color:#F07B98",
    "88780007":"background-color:#F07B98",
    "62613352":"background-color:#F07B98",
    "90185333":"background-color:#F07B98",
    "51220993":"background-color:#F07B98",
    "86994458":"background-color:#F07B98",
    "100019":"background-color:#BD52FF",
}
if(document.location.href.indexOf('topic')!==-1){
    for (let i=2;i<252;i=i+5) {//主帖
        let x = document.querySelector("#table_list > tbody > tr:nth-child("+i+") > td:nth-child(4)");
        let y = document.querySelector("#table_list > tbody > tr:nth-child("+i+") > td:nth-child(7)");
        if(x){
            let str = x.innerText;
            for(let a in shuzuZ){

                if(str.indexOf(a) !== -1){
                    x.style=shuzuZ[a];
                    break;
                }
            }
            let strID=y.innerText;
            for(let a in tongID){
                if(strID.indexOf(a) !== -1){
                    y.style=tongID[a];
                    break;
                }
            }
        }else if(x != true){
            break;
        }
        x ="";
    }
}
else if(document.location.href.indexOf('reply')!==-1){
    for (let o=2;o<202;o=o+=4) {//回帖
        let x = document.querySelector("#table_list > tbody > tr:nth-child("+o+") > td:nth-child(4)");
        let y = document.querySelector("#table_list > tbody > tr:nth-child("+o+") > td:nth-child(7)");
        if(x){
            let str = x.innerText;
            for(let a in shuzuH){

                if(str.indexOf(a) !== -1){
                    x.style=shuzuH[a];
                    break;
                }
            }
            let strID=y.innerText;
            for(let a in tongID){
                if(strID.indexOf(a) !== -1){
                    y.style=tongID[a];
                    break;
                }
            }
        }else if(x != true){
            break;
        }
        x ="";
    }
}
else if(document.location.href.indexOf('comment')!==-1){
    for (let p=2;p<102;p=p+=2) {//回复
        let x = document.querySelector("#table_list > tbody > tr:nth-child("+p+") > td:nth-child(4)");
        let y = document.querySelector("#table_list > tbody > tr:nth-child("+p+") > td:nth-child(7)");
        if(x){
            let str = x.innerText;
            for(let a in shuzuF){

                if(str.indexOf(a) !== -1){
                    x.style=shuzuF[a];
                    break;
                }
            }
            let strID=y.innerText;
            for(let a in tongID){
                if(strID.indexOf(a) !== -1){
                    y.style=tongID[a];
                    break;
                }
            }
        }else if(x != true){
            break;
        }
        x ="";
    }
}



