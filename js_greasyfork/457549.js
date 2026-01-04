// ==UserScript==
// @name         快 捷 圈 子 2
// @namespace    https://greasyfork.org/users/904812
// @version      0.1
// @description  北京学生综合素质评价发圈子一次性完成
// @author       2222234
// @match        https://zhsz.bjedu.cn/web/index/index
// @grant        none
// @license      GNU Affero General Public License v3.0

// @downloadURL https://update.greasyfork.org/scripts/457549/%E5%BF%AB%20%E6%8D%B7%20%E5%9C%88%20%E5%AD%90%202.user.js
// @updateURL https://update.greasyfork.org/scripts/457549/%E5%BF%AB%20%E6%8D%B7%20%E5%9C%88%20%E5%AD%90%202.meta.js
// ==/UserScript==

$(function(){
    var h = document.documentElement.clientHeight;

    var Data = vmMomentsData;

    var open = document.createElement("div");
    window.document.body.append(open);
    open.id="open";
    open.innerHTML=">";
    open.style.left = "0px";
    open.style.top="40%";
    open.style.width = "30px";
    open.style.height = "30px";
    open.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    open.style.position = "fixed";
    open.style.zIndex = "114514";
    open.style.fontSize="25px";
    open.style.lineHeight="30px";
    open.style.textAlign="center";
    var o = false;

    var send = document.createElement("div");
    window.document.body.append(send);
    send.id="send";
    send.style.left = "-250px";
    send.style.top="0px";
    send.style.width = "250px";
    send.style.height = "100%";
    send.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    send.style.position = "fixed";
    send.style.zIndex = "114514";
    send.style.visibility="hidden";

    var moments = document.createElement("form");
    send.append(moments);
    moments.id="moments";
    moments.style.left = "25px";
    moments.style.top="65px";
    moments.style.width = "200px";
    moments.style.height = 0.6*h+"px";
    moments.style.overflow = "auto";
    moments.style.overflowX = "hidden";
    moments.style.position = "fixed";

    var tagList = Data.tagList;

    for(var tag = 0;tag<tagList.length;tag++){
        var moment = document.createElement("input");
        moment.name="ms";
        moment.style.width="100px";
        moment.style.backgroundColor="rgba(255, 255, 255, 0.5)";
        moments.innerHTML=moments.innerHTML+" "+tagList[tag].name+"<br>";
        moments.append(moment);
        moments.innerHTML=moments.innerHTML+"<br>";
    }

    var write = document.createElement("button");
    send.append(write);
    write.id="write";
    write.innerHTML="发表";
    write.style.left = "25px";
    write.style.top=0.6*h+90+"px";
    write.style.width = "150px";
    write.style.height = "50px";
    write.style.backgroundColor = "rgba(255,255,255,1)";
    write.style.position = "fixed";
    write.style.fontSize="25px";
    write.style.lineHeight="50px";
    write.style.textAlign="center";

    var memberList = Data.curClassMemberList;

    write.onclick=function(){
        var ms = document.getElementsByName('ms');
        if(confirm("使用？")){
            for(var i=0;i<tagList.length;i++){
                for(var i1 = 0;i1<ms[i].value;i1++){
                    $.ajax({
                        url: "/web/moments/addmoments",
                        type: 'POST',
                        data:{"content":function(){
                            var text = "";
                            for(var t = 0;t<20;t++){
                                text+="同学们表现得都非常棒！";
                            }
                            return text;
                        },
                              "at_uids":function(){
                                  var ats = [];
                                  for(var mem = 0;mem<memberList.length;mem++){
                                      ats[mem]=memberList[mem].uid;
                                  }
                                  return ats;
                              },
                              "class_id":Data.curClass.id,
                              "tag_id":tagList[i].id,
                              "tag":tagList[i].name,
                              "is_group":1
                             },
                        dataType: 'json',
                    });
                }
            }
        }
    }

    window.onresize=function(){
        h = document.documentElement.clientHeight;
        moments.style.height = 0.6*h+"px";
        write.style.top=0.6*h+90+"px";
    }

    open.onmouseover=function(){
        open.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    }
    open.onmouseout=function(){
        open.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    }

    open.onclick=function(){
        if(!o){
            open.style.left = "250px";
            open.innerHTML="<";
            send.style.left = "0px";
            send.style.visibility ="visible";
            o=true;
        }else{
            open.style.left = "0px";
            open.innerHTML=">";
            send.style.visibility ="hidden";
            o=false;
        }
    }
});