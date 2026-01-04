// ==UserScript==
// @name         v2ex一键屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.7.3.2
// @description  try to take over the world!
// @author       xianmua
// @match        https://*.v2ex.com/#;
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab*
// @match        https://*.v2ex.com/go/*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/391996/v2ex%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/391996/v2ex%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
//本脚本介绍贴：https://www.v2ex.com/t/924308，
//5.16--修复鼠标快速划过头像，注册时间悬浮窗不会消失的问题...
//5.16--鼠标在头像处悬停，会自动获取并显示此id的注册时间。辅助判断一个id是否需要被屏蔽。
//5.15--修复topic id特殊情况未成功获取的问题
//3.25--修复屏蔽帖子频繁失败的问题（实测连续屏蔽两个帖子 间隔10秒钟以上成功率最高）；修复"v2ex.com/#;"不生效的问题。
//3.21--新增忽略帖子按钮，调用官方接口隐藏帖子（即忽略主题功能）。屏蔽id影响大些，但是又不再想看见这个帖子，可以点击屏蔽id按钮 右侧的小眼睛，即可“忽略主题”，彻底屏蔽这个帖子。
//3.20--新增实验性功能=>><共享黑名单>，可打开脚本菜单自行开关此功能
//统计数据仅供参考。可在代码第215行左右 自定义提醒阈值以及标识颜色（目前默认设置是被屏蔽2-4次，回收标志变橘黄色；被屏蔽5次及以上，回收标志变红色）

let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";//将supabase的js文件嵌入页面中
document.documentElement.appendChild(script);


unsafeWindow.hidefast=function(buton){//调用v2自带的隐藏元素函数
    const o=buton.getAttribute("num");
    $("#r_" + o).slideUp('fast');
}
//urecord
unsafeWindow.urecord=function(buton){
    unsafeWindow.test(buton)
    urecord2(buton)
}
async function urecord2(buton){
    let now=new Date();
    let nowtime=now.getTime();
    if(typeof(GM_getValue("lasttime"))==="undefined"){GM_setValue("lasttime",1669247489014)}
    let interval_min=Math.floor((nowtime-GM_getValue("lasttime"))/1000/60)
    if (interval_min<5){return;}
    //if (true){return;}
    else{
        let { data: blocklist, error } = await unsafeWindow.supaclient.from('blocklist').upsert([{blocked_id:buton.getAttribute("memid")}])
        GM_setValue("lasttime",nowtime)
    }
}
unsafeWindow.hide_topic=function(buton){
    const o=buton.getAttribute("num");
    $("#r_" + o).slideUp('fast');
    unsafeWindow.fetchOnce().then(gen_topic_url);
    function gen_topic_url(result){
        const ignore_url=buton.getAttribute("origin")+"/ignore/topic/"+buton.getAttribute("topicid")+"?once="+result
        blockme(ignore_url)
    }
}

unsafeWindow.test=function(add)
{
    let origin=add.getAttribute("origin");
    let memurl=origin+add.getAttribute("link")
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', memurl, false);
    httpRequest.send();
    let html=httpRequest.responseText
    let pipei=html.match(/location.href = '\/block([\s|\S]*)';/)[1]
    let blocklink=origin+"/block"+pipei
    blockme(blocklink)
}

function blockme(blocklink){
    let httpRequest2 = new XMLHttpRequest();
    httpRequest2.open('GET', blocklink, true);
    httpRequest2.send();
}

function buttonStyle(add,o,link,tgt,a2,home,topicid){
    if (cloudBlacklist){var z="hidefast(this);urecord(this)"}else{ z="hidefast(this);test(this)"}
    let part1=`<button onmouseover="this.style.color='#89c403'" onmouseout="this.style.color='#777777'" num="${o}" origin="${a2.origin}" link="${link}" memid="${link.slice(8)}" onclick="${z}" style="border: none; background: none; font-size: 14px; width: 18px;color:#777777;">♻</button>`
    let part2=`<div style="width: 8px;opacity: 0;display:inline-block;"></div><img onmouseover="this.style.opacity=0.5" onmouseout="this.style.opacity=1" topicid="${topicid}" origin="${a2.origin}" num="${o}" onclick="hide_topic(this)" style="display:inline-block;vertical-align: -1px;" width="14px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAAAXNSR0IArs4c6QAABJhJREFUWEfFWF1oXEUU/s7sJZKAgsWSUEXxQYUUG6FgWkWpEPRFabFGhKIoikUwQszmzt0N1C3kZ2YSEYwVW6GiiEJjFUtQUIsU/C19SUtQaEGjSALigyDpKrtzZJa9y93tbnZuTerAssve73znu2fOnJk5hMSIomgXM78I4HZmftsYU0g+X+t3FEXXWmt7hBDd1tplIlrRWv/pa78WjpIPpZRfAtgV/8fMB5sJdS9jrR0kojuZuZuIugF0NHF0kZlXiGiZmeeFEHNKqQtphTeKfAvAk0mSWGgul7vbWrsHwG4At6R1lMCfBPAxEX3qK7hOZC6X67XWHgOwNSmCiBaYue8/CGtlOr66ujo+Ozv7t/d0O2AroRsgMKb83lo7Pj09Pd/KR10kY1BV6LcArtlAcXXUrfLfgZqKDMPwGBENXimB7RbqJSL/L4FrCa0TGUXRODOPpY2gmyoA54MgODc5OXk2n89vK5VKfUQ0AOCJy+Dba4z5MLariazm4XcArk5B+hMR3b9WKZFSPgfgZQCdvrxEdEopVavXNZFSyjcA7PclapdHjTxSyiUAN/ryE9F+pdSR2sKRUt4L4JQvQSPOTbcQYtFa209E2wH8QERnlFJHY2wURduZ+UwKH4udnZ07CoXCX5VISik/ALA3BcEKgB4P/Hta630xLgzDw0T0rIddDBnTWk9SNpvtz2QyLhe9hxDC7d2HGnemFgSPa63frQbjMQDvezsCftZa30xhGBaI6KUUhqe11v1uoTHzHDP3trH9Smt9j8Pk8/nucrnsZsF7ENGjJKX8DcAWbyvgFa21O84hDMOHieh4G9tftNY3JaZ8gYi2+fpzgXAiTwB4yNcIwHGt9SMOPzIycl0QBL+3s9VaJ6vIHwA2tbOJn7tF6aZ7HxFVcsZnuLOhUqoW+XY7FDMfMcZUSpuU8i4AX/v4iTFCiK00PDy8qaOjYwHADb7GzLzTGFNZbNlsdmcmk/mmla0Q4tDU1NTzVZEuTVxh9xpEdEIptbsyDVEUjTKz8bJ0pxKieaVULUWq147DAG5txsHMBWPMQSnlWXc18fXDzAPGmJMVkUNDQ1d1dXW5yNzhS+BWnVJqLsYXCoWOYrG4hZndlB4AcFuSi4i+cE59+QEc1Vo/7fC1hA7D8Ckiqu0QPmTlcrlvZmbGRadurMPBuQhgh9bapWH9eVJK+TmANG/rOEwQBK9OTEy4UlYb1Tr6CTPXyo/Pi1cxRmstY3zjRczlmStJacdFIjrPzBeY+RyAXiJyRb7uruRJ+mMQBAPJl77k0Ds6OvqMEOJNT8L1hrmr7x5jzOm6fG7mRUqZqlSsk9IiMz/oVnMjX9M7jgNV9/ThK3QZW2TmA8nTeNtIxoDqKnVRrZSCjRpENKWUyrfibxnJpIGU8oFqZ8N1L7yvAWu81D+NbRlmHjLGvNbMxktkIrKbmXmQmd0B476UkXVdincAfCSEWGrslDDzr8aYpteLVCIb6uBma61rWPW4hpX7WGvj5pU7M7rPsvt2HTal1GcN9nUtneRBxHvhpIzSZcHHxsauL5VKLxDRklLq9VYk/wLaR/1wQ5Z+uQAAAABJRU5ErkJggg==">`
    if(home){tgt.parentNode.innerHTML+=part1+part2}else{tgt.parentNode.innerHTML+=part1}
}
//0.7.2新增
unsafeWindow.regTime=async function(avatar){//查询注册时间
    //let memid=avatar.parentNode.getAttribute("href").slice(8)//成员id
    let host=new URL(document.URL)
    let memid=avatar.getAttribute("alt")
    let memInfoUrl=host.origin+"/api/members/show.json?username="+memid//获取注册时间的接口
    let res=await window.fetch(memInfoUrl)
    let resjson=await res.json()
    let regtime=resjson.created
    if(!regtime){console.log("something wrong");return}//极少数id通过此接口获取不到注册时间
    //console.log(regtime["created"])
    let date=await new Date(regtime*1000)
    let year = date.getFullYear(),month = date.getMonth() + 1,day = date.getDate();
    genTooltip(`${year}.${month}.${day}`,avatar)
}
function genTooltip(content,avatar){//生成注册时间提示
    let tooltip = document.createElement("div");
    document.body.appendChild(tooltip);
    tooltip.textContent = content
    tooltip.setAttribute("style",`
        	position: absolute;
			display: none;
			background-color: #333;
			color: #fff;
			padding: 1px;
			border-radius: 5px;
			font-size: 8px;
			font-family: sans-serif;
			opacity: 0.8;
        `)
    tooltip.style.display = 'block';
    tooltip.style.left = avatar.getBoundingClientRect().left + document.documentElement.scrollLeft-70 + 'px';
    tooltip.style.top = avatar.getBoundingClientRect().top + document.documentElement.scrollTop +'px'
    setTimeout(()=>{tooltip.style.display = 'none'},1000)//加入延时自动消失，防止鼠标快速划过头像，导致悬浮窗不会消失...
    avatar.onmouseout = function() {
        tooltip.style.display = 'none';
    };
}

//主线
let a=document.URL
let a2=new URL(a)//当前页面链接

let fetchRegTime=GM_getValue("fetchRegTime",false),
    cloudBlacklist=GM_getValue("cloudBlacklist",true)
//判断当前页面
if(document.querySelectorAll(".cell:has(.topic_info)")){
    let obj=document.querySelectorAll(".topic_info")
    for(let o=0;o<obj.length;o++){
        let tgt=obj[o].querySelector("strong a")// /member/**
        let link=tgt.getAttribute("href")
        let topicid=obj[o].parentNode.querySelector(".topic-link").href.match(/(?<=\/t\/)\d+/)//新增传递topicid
        let add=document.createElement("button")
        buttonStyle(add,o,link,tgt,a2,true,topicid)
    }
    //主页节点添加 id
    let nodes=document.querySelectorAll(".cell:has(.topic-link)")
    for(let n=0;n<nodes.length;n++){
        let rid="r_"+String(n)
        nodes[n].setAttribute("id",rid)
    }
}
//内容页
if(document.querySelectorAll(".cell:has(.reply_content)")){
    let obj2=document.querySelectorAll(".cell:has(.reply_content)")
    for(let o2=0;o2<obj2.length;o2++){
        let id=obj2[o2].getAttribute("id")//筛选出真正的回复,tk是reply id
        let tgt2=obj2[o2].querySelector("strong a")
        let link2=tgt2.getAttribute("href")
        let add2=document.createElement("button")
        let o3=id.substring(2)//去掉reply id前面的‘r_’
        buttonStyle(add2,o3,link2,tgt2,a2,false,false)
    }
}
//new feature=>cloud blacklist
let str1="aHR0cHM6Ly9pbnl2aWt3dHhkc2FjaHJtYmhyaS5zdXBhYmFzZS5jbw==",str2="ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1sdWVYWnBhM2QwZUdSellXTm9jbTFpYUhKcElpd2ljbTlzWlNJNkltRnViMjRpTENKcFl",str3="YUWlPakUyTnpreE1qUTRPVE1zSW1WNGNDSTZNVGs1TkRjd01EZzVNMzAuTUtlbnVRaHJQN2FVY0VObXFhMVlyR29TUEVaZE8ySlpOamJCdWN6LVpSbw=="
function fetch(){
    window.onload=function(){
        unsafeWindow.fetchOnce()//在这里初始化
        unsafeWindow.supaclient =new supabase.SupabaseClient(atob(str1), atob(str2+str3));//初始化supabase
        let e=document.documentElement.innerHTML,match,str=""
        let regex=/memid=\"([a-zA-Z\d]+)\"/g
        while(match=regex.exec(e)){
            if (!str.includes(match[1])){
                str += match[1] + ","
            }
        }
        str = "(" + str.slice(0,-1) + ")"
        //console.log(str)//memid合集字符串
        fetch_record(str)
        async function fetch_record(d){
            let { data: blocklist, error } =await unsafeWindow.supaclient.from('blocklist').select("blocked_id,score").filter('blocked_id', 'in', str)//查询是否有被屏蔽次数较多的id
            //console.log(blocklist)//block id of this page
            if(blocklist.length!=0){
                function letmesee(d){
                    for (let t=0;t<d.length;t++){
                        let g=document.querySelectorAll("[memid='"+d[t].blocked_id+"']");//定位被多人屏蔽的id的位置
                        if(g.length>1){//同一页内一个id多个内容
                            for (let l=0;l<g.length;l++){
                                let r=d[t].score
                                if (r>1&&r<5){g[l].style.color="#ffcc00";g[l].setAttribute("onMouseOut","this.style.color='#ffcc00'")}else if(r>=5){g[l].style.color="#c00";g[l].setAttribute("onMouseOut","this.style.color='#c00'")}
                            }
                        }else {
                            let r=d[t].score
                            //console.log(r)
                            //被其他人屏蔽2--4次，会生成黄色提醒按钮；被屏蔽5次及以上，会生成红色提醒按钮。可以在这里自定义阈值 以及标识颜色
                            if (r>1&&r<5){g[0].style.color="#ffcc00";g[0].setAttribute("onMouseOut","this.style.color='#ffcc00'")}else if(r>=5){g[0].style.color="#c00";g[0].setAttribute("onMouseOut","this.style.color='#c00'")}
                        }}
                }
                letmesee(blocklist)
            }
        }
    }}
//相关选项注册
function toggle_cloudBlacklist(){GM_setValue("cloudBlacklist",!cloudBlacklist);window.location.reload()}
function toggle_fetchRegTime(){GM_setValue("fetchRegTime",!fetchRegTime);window.location.reload()}
GM_registerMenuCommand(cloudBlacklist?"✅共享黑名单已开启":"❌共享黑名单已关闭",toggle_cloudBlacklist);
GM_registerMenuCommand(fetchRegTime?"✅悬停头像显示注册时间":"❌悬停头像显示注册时间",toggle_fetchRegTime);

if(cloudBlacklist){
    fetch()
}
if(fetchRegTime){
    let avatars=document.querySelectorAll(".cell:has(.topic_info) .avatar,.cell:has(.reply_content) .avatar")//帖子列表的id头像元素
    avatars.forEach(function(element) {
        element.onmouseover = function() {
            unsafeWindow.regTime(this);
        };
    });
}
//自动签到
/*
if(document.querySelector(".fa-gift")){
    unsafeWindow.fetchOnce().then(
        function(result){
            let checkin_url=new URL(document.URL).origin+"/mission/daily/redeem?once="+result
            blockme(checkin_url)
        }
    )
}
*/