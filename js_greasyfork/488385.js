// ==UserScript==
// @name            巴蜀OJ自动发信机+自动删信机
// @name:en         Auto mail sender + deleter for BSOJ
// @namespace       https://greasyfork.org/users/1265383
// @version         3.8.0.1
// @description     自动向指定用户发送n条消息，1秒250条。自动删除当前页码上的所有信息，瞬间删完。自动删除所有信息，几秒删完。
// @description:en  Automatically send n messages to the specified user, 250 message every second.Automatically deletes all information on the current page number in an instant.Automatically deletes all information quickly.
// @author          123asdf123(luogu 576074)
// @match           https://oj.bashu.com.cn/*/mail.*
// @icon            https://oj.bashu.com.cn/favicon.ico
// @license         SATA
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/488385/%E5%B7%B4%E8%9C%80OJ%E8%87%AA%E5%8A%A8%E5%8F%91%E4%BF%A1%E6%9C%BA%2B%E8%87%AA%E5%8A%A8%E5%88%A0%E4%BF%A1%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488385/%E5%B7%B4%E8%9C%80OJ%E8%87%AA%E5%8A%A8%E5%8F%91%E4%BF%A1%E6%9C%BA%2B%E8%87%AA%E5%8A%A8%E5%88%A0%E4%BF%A1%E6%9C%BA.meta.js
// ==/UserScript==
var autosendb=document.createElement("span"),delb=document.createElement("span"),clearb=document.createElement("span"),automail=document.createElement("div"),now;
function insertAfter(newElement, targetElement) {
    let parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
function tot(){
    document.body.children[0].innerHTML="<center><h1>"+now+" sent.</h1></center>"
}
function send(user,title,content){
    document.getElementById("sendnew").click();
    document.getElementById("to_input").value=user;
    document.getElementById("title_input").value=title;
    document.getElementById("detail_input").value=content;
    let d=$('#send_form').serialize();
    while(document.body.children.length){
        document.body.children[0].remove();
    }
    window.document.body.appendChild(document.createElement("div"))
    now=0;
    while(localStorage["auto-send-remain"]!=0){
        localStorage["auto-send-remain"]--;
        $.ajax({
            type:"POST",
            url:"ajax_mailfunc.php?op=send",
            data:d,
            success:function(data){console.log(data);now++},
        });
    }
    setInterval(tot,20);
}
function sendmessage(){
    localStorage["auto-send-remain"]=parseInt(prompt("Times?","1"));
    if(isNaN(localStorage["auto-send-remain"])){
        localStorage["auto-send-remain"]=0;
        return;
    }
    localStorage["auto-send-user"]=document.getElementById("to_input").value;
    localStorage["auto-send-title"]=document.getElementById("title_input").value;
    localStorage["auto-send-content"]=document.getElementById("detail_input").value;
    location.reload();
}
function delmessage(){
    let need=document.querySelectorAll(".mail-item");
    for(let i=0;i<need.length;i++){
//        console.log(need[i].id);
        $.ajax('ajax_mailfunc.php?op=delete&mail_id='+need[i].id.substr(4));
    }
    return need.length;
}
function del(){
    delmessage();
    location.reload();
}
function clearmessage(){
    let x=confirm("Are you sure?");
    if(x==true){
        localStorage["auto-clear"]=1;
        location.reload();
    }
}
(function() {
    'use strict';
    autosendb.innerHTML="Auto-Send";
    autosendb.className="btn btn-info";
    autosendb.onclick=sendmessage;
    delb.innerHTML="<i class=\"icon-trash\"></i> Delete all messages on this page";
    delb.className="btn btn-small";
    delb.setAttribute("style","margin:5px");
    delb.onclick=del;
    clearb.innerHTML="<i class=\"icon-warning-sign\"></i> Clear all";
    clearb.className="btn btn-small";
    clearb.setAttribute("style","margin:5px");
    clearb.onclick=clearmessage;
    document.getElementById("sendnew").parentNode.appendChild(autosendb);
    document.getElementById("sendnew").parentNode.appendChild(delb);
    document.getElementById("sendnew").parentNode.appendChild(clearb);
    insertAfter(autosendb,document.getElementById("MailModal").children[2].children[0]);
    document.getElementById("MailModal").parentNode.appendChild(automail);
    if(localStorage["auto-send-done"]==1){
        localStorage["auto-send-done"]=0;
        var done=document.createElement("div");
        done.innerHTML="Done.";
        done.className="alert alert-success center alert-popup";
        document.body.appendChild(done);
    }
    if(localStorage.getItem("auto-clear")==null){
        localStorage["auto-clear"]=0;
    }
    if(localStorage["auto-clear"]==1){
        if(delmessage()==0){
            localStorage["auto-clear"]=0;
        }
        location.reload();
    }
    if(localStorage.getItem("auto-send-remain")==null){
        localStorage["auto-send-remain"]=0;
    }
    if(localStorage["auto-send-remain"]!=0){
        send(localStorage["auto-send-user"],localStorage["auto-send-title"],localStorage["auto-send-content"]);
        localStorage["auto-send-done"]=1;
        //location.reload();
    }
})();