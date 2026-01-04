// ==UserScript==
// @name         douban delete follower
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  add button to douban to delete follower
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.douban.com/contacts/rlist**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368379/douban%20delete%20follower.user.js
// @updateURL https://update.greasyfork.org/scripts/368379/douban%20delete%20follower.meta.js
// ==/UserScript==


var i=0;
var button;
var ck="";
var url_ban="/j/contact/addtoblacklist";
var url_unban="/j/contact/unban";

//time delay
var interval=2000;
var interval_id;

var mode="serial";//do unfollow one by one

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

var user_list=[];
var name_map={};
var node_map={};
var href_map={};
var button_list=[];
var cur=0;

function prepare(){
    var userlist_nodes=document.querySelectorAll("div#wrapper div#content div.grid-16-8.clearfix ul.user-list li.clearfix");
	for(let i=0;i<userlist_nodes.length;i++){
		var t=userlist_nodes[i];
		var id=t.id.replace("u","");
        var name=t.childNodes[1].title;
        var href=t.childNodes[1].href;
        user_list.push(id);
        name_map[id]=name;
        node_map[id]=t;
        href_map[id]=href;
        var b=document.createElement('a');
        b.class="a-btn-add mr10 add_contact";
        b.id=id;
        b.innerHTML='取消对我的关注';
        b.onclick=click_unfollow;
        b.style="align:right;";
        button_list.push(b);
        var x=t.querySelector("div.info");
        x.append(b);
    }
}

function click_unfollow(e){
    var id=e.target.id;
    var name=name_map[id];
    var node=node_map[id];
    var href=href_map[id];
    var asyn=true;
    if(asyn){
        ban(id,name,node,href,true);
    }else{
        ban(id,name,node,href,false);
        unban(id,name,node,href,false);
        after(id,name,node,href);
    }
}

function do_ban_and_unban(){
    if(cur>=button_list.length){
        interval_id=window.clearInterval(interval_id);
        return;
    }
    button_list[cur].click();

    cur++;
}

function ban(userid,name,node,href,asyn) {
    var xmlhttp=new XMLHttpRequest();
    var url=url_ban;
    var data="people="+userid+"&ck="+ck;
    console.log('ban:',data);
    node.innerHTML="<a href='"+href+"'>正在ban:"+name+"</a>";
    xmlhttp.open("POST",url,asyn);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    if(asyn){
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
                unban(userid,name,node,asyn);
            }
        };
    }
    xmlhttp.send(data);
}

function unban(userid,name,node,asyn){
    var xmlhttp=new XMLHttpRequest();
    var url=url_unban;
    var data="people="+userid+"&ck="+ck;
    console.log("ban success:"+data);
    console.log('unban:',data);
    node.children[0].innerHTML="正在unban:"+name;
    xmlhttp.open("POST",url,asyn);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    if(asyn){
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
                after(userid,name,node);
            }
        };
    }
    xmlhttp.send(data);
}

function after(userid,name,node){
    console.log("unban success:"+userid);
    node.children[0].innerHTML="已取消"+name+"对你的关注";
}

(function() {
    'use strict';
    ck=getCookie("ck");
    var x=document.querySelector("div#wrapper div#content");
    var y1=document.querySelector("div#wrapper div#content h1");
    var y2=document.querySelector("div#wrapper div#content div.grid-16-8.clearfix");
    var userlist_container=document.querySelector("div#wrapper div#content div.grid-16-8.clearfix ul.user-list");
    if(!x || !y1 || !y2 ){
        return;
    }
    button=document.createElement('button');
    button.innerHTML='一键取消本页用户对我的关注';
    prepare();
    button.onclick=(e)=>{
        interval_id= window.setInterval(do_ban_and_unban,interval);
    };
    userlist_container.prepend(button);
})();