// ==UserScript==
// @name         B站收藏夹收藏时间具体显示
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  bilibili收藏夹收藏时间具体显示，精确到分钟。
// @author       Kesdiael Ken
// @license      MIT
// @match        https://space.bilibili.com/*
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/472946/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%94%B6%E8%97%8F%E6%97%B6%E9%97%B4%E5%85%B7%E4%BD%93%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/472946/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%94%B6%E8%97%8F%E6%97%B6%E9%97%B4%E5%85%B7%E4%BD%93%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
    'use strict';
    $(()=>{
        function List(media_id,pn,ps,keyword,order,type,tid,platform){
            this.media_id=media_id;this.pn=pn;this.ps=ps;
            this.keyword=keyword;this.order=order;this.type=type;
            this.tid=tid;this.platform=platform;
            this.get=()=>{
                return new Promise(res=>{
                    GM_xmlhttpRequest({
                        method:"GET",
                        url:"https://api.bilibili.com/x/v3/fav/resource/list?"
                            +"media_id="+this.media_id
                            +"&pn="+this.pn
                            +"&ps="+this.ps
                            +"&keyword="+this.keyword
                            +"&order="+this.order
                            +"&type="+this.type
                            +"&tid="+this.tid
                            +"&platform="+this.platform,
                        onload:(r)=>{
                            res(JSON.parse(r.response).data.medias);
                        }
                    });
                });
            }
        }
        function getOrder(){
            let text=$($(".be-dropdown.filter-item")[1]).find("span")[0].textContent;//console.log("Order",text);
            if(text.match("最近收藏"))return "mtime";
            if(text.match("最多播放"))return "view";
            return "pubtime";
        }
        function getUid(){
            return $(".header-entry-mini").attr("href").match(/space\.bilibili\.com\/(\d*)/)[1];
        }
        function Partition(tid,name){
            this.tid=tid;
            this.name=name;
        }
        let tid_list=[];
        let infav=true;
        function getMediaId(){
            let href=$(".fav-item.cur>a")[0].href;
            if(href.match(/ftype=(\w*)/)&&href.match(/ftype=(\w*)/)[1]=="collect"){infav=false;return false;}
            if(!href.match(/fid=\d*/)){infav=false;return false;}
            infav=true;return href.match(/fid=(\d*)/)[1];
        }
        function theWorld(){
            console.log("theWorld");
            return new Promise(res=>{
                setTimeout(()=>{res();},250);
            })
        }
        async function requestTid(){
            if(!infav)await theWorld();
            console.log("Requesting tid list.");
            if(!await wait(".header-entry-mini"))return;let up_mid=getUid();
            if(!await wait(".fav-item.cur"))return;let media_id=getMediaId();if(!media_id)return;//console.log("media_id",media_id);
            GM_xmlhttpRequest({
                method:"GET",
                url:"https://api.bilibili.com/x/v3/fav/resource/partition?"
                    +"up_mid="+up_mid
                    +"&media_id="+media_id,
                onload:(r)=>{
                    tid_list=[];
                    let data=JSON.parse(r.response).data;
                    if(!data){console.log("Tid list acquired.");return;}
                    data.forEach(ele=>{
                        tid_list.push(new Partition(ele.tid,ele.name));
                    });
                    console.log("Tid list acquired:",tid_list);
                }
            });
        }
        function getTid(){
            // let text=$($(".be-dropdown.filter-item")[1]).find("span")[0].textContent;
            // let tid=0;//console.log("Tid",text);
            // tid_list.forEach(ele=>{
            //     if(text.match(ele.name))tid=ele.tid;
            // });
            // return tid;
            return 0;
        }
        function wait(identifier){
            return new Promise(res=>{
                if($(identifier).length){res(true);return;}
                let cnt=100;
                let itv=setInterval(()=>{
                    if($(identifier).length){
                        clearInterval(itv);
                        res(true);
                    }
                    cnt--;
                    if(!cnt){
                        clearInterval(itv);
                        res(false);
                    }
                },50);
            })
        }
        function getKeyword(){
            if(!$(".search-fav-input").length)return "";
            return $(".search-fav-input")[0].value;
        }
        function getType(){
            if(!$(".filter-item .be-dropdown>div").length)return 0;
            return $(".filter-item .be-dropdown>div")[0].textContent.match("当前")?0:1;
        }
        async function requestList(){
            if(!await wait(".fav-item.cur"))return false;let media_id=getMediaId();if(!media_id)return false;//console.log("media_id",media_id);
            if(!await wait(".be-pager-item-active a"))return false;let pn=$(".be-pager-item-active a").text();//console.log("pn");
            let ps=20;
            if(!await wait(".search-fav-input"))return false;let keyword=getKeyword();//console.log("keyword",keyword);
            if(keyword==""&&!await wait(".be-dropdown.filter-item"))return false;let order=(keyword==""?getOrder():0);//console.log("order",order);
            if(!await wait(".filter-item .be-dropdown>div"))return false;let type=getType();//console.log("type");
            if(keyword==""&&!await wait(".be-dropdown.filter-item"))return false;let tid=(keyword==""?getTid():0);//console.log("tid",tid);
            let platform="web";
            let listItem=new List(media_id,pn,ps,keyword,order,type,tid,platform);console.log("Requesting media list.")
            return await listItem.get();
        }
        function extend(num){
            if(num==0)return "00";
            if(num<10)return "0"+num;
            return num;
        }

        function setLeft(ele,menu){
            menu.style.left=`${ele.getBoundingClientRect().right-menu.offsetWidth}px`;
        }
        function setYPosition(ele,menu){
            if(ele.getBoundingClientRect().bottom+menu.offsetHeight<=$(window).height()){
                menu.style.top=`${ele.getBoundingClientRect().bottom}px`;
            }
            else{
                menu.style.top=`${ele.getBoundingClientRect().top-menu.offsetHeight}px`
            }
        }
        function setPosition(ele,menu){
            setLeft(ele,menu);
            setYPosition(ele,menu);
        }
        if(!GM_getValue("display_mode"))GM_setValue("display_mode","m");
        let time_display_type=GM_getValue("display_mode");
        async function addDropdownMenu(){
            if(!infav)await theWorld();
            if(!await wait(".filter-item.do-batch span"))return;
            if($("div.filter-time-precision").length)return;
            console.log("Adding dropdown menu.")
            $(".filter-item.do-batch").after(`
                <div class="be-dropdown filter-item filter-time-precision">
                    <span></span>
                    <ul class="be-dropdown-menu filter-time-precision menu-align-" style="left: 0px; top: 0px; display: none; text-align:left">
                        <li class="be-dropdown-item" style="text-align:left" id="m">收藏时间显示到分钟</li>
                        <li class="be-dropdown-item" style="text-align:left" id="d">收藏时间显示到天</li>
                    </ul>
                </div>
            `);
            $("div.filter-time-precision span").html(`收藏时间显示到${time_display_type=="m"?"分钟":"天"}<i class="icon icon-arrow"></i>`);
            $("div.filter-time-precision").click(()=>{
                $("ul.filter-time-precision")[0].style.display=
                    $("ul.filter-time-precision")[0].style.display=="none"?"block":"none";
                setPosition($("div.filter-time-precision")[0],$("ul.filter-time-precision")[0]);
            });
            $(window).scroll(()=>{setPosition($("div.filter-time-precision")[0],$("ul.filter-time-precision")[0]);});
            $(document).click((e)=>{
                if(!$.contains($("div.filter-time-precision")[0],e.target)&&$("div.filter-time-precision")[0]!=e.target){
                    $("ul.filter-time-precision")[0].style.display="none";
                }
            });
            $("#m").click(()=>{
                if(time_display_type==$("#m").attr("id"))return;
                $("div.filter-time-precision span").html(`收藏时间显示到分钟<i class="icon icon-arrow"></i>`);
                $(".fav-content").addClass("loading");
                time_display_type="m";
                GM_setValue("display_mode","m");
                setTimeout(switchFavTime,50);
            });
            $("#d").click(()=>{
                if(time_display_type==$("#d").attr("id"))return;
                $("div.filter-time-precision span").html(`收藏时间显示到天<i class="icon icon-arrow"></i>`);
                $(".fav-content").addClass("loading");
                time_display_type="d";
                GM_setValue("display_mode","d");
                setTimeout(switchFavTime,50);
            });
        }
        
        function obliterateJudge(unix_timestamp){
            return Math.abs(unix_timestamp/1000-1594050000)<=30000;
        }
        function switchFavTime(){
            $(".small-item>.pubdate").each((ind,ele)=>{
                let unix_timestamp=Number($(ele).attr("pubdate_updated"));
                let fav_date=new Date(unix_timestamp);
                let year=fav_date.getFullYear(),month=fav_date.getMonth()+1,day=fav_date.getDate();
                let hour=extend(fav_date.getHours()),minute=extend(fav_date.getMinutes());
                if(!obliterateJudge(unix_timestamp)){
                    $(ele).html("收藏于："+(time_display_type=="m"?"":" ")
                    +`${year}-${month}-${day}&nbsp;&nbsp;`
                    +(time_display_type=="m"?`${hour}:${minute}`:""));
                }
                else{
                    $(ele).html("收藏于：obliterated");
                }
            });
            $(".fav-content").removeClass("loading");
        }
        function updateFavTime(list){
            $(".small-item>.pubdate").each((ind,ele)=>{
                if($(ele).attr("pubdate_updated"))return;
                let unix_timestamp=list[ind].fav_time*1000;
                let fav_date=new Date(unix_timestamp);
                let year=fav_date.getFullYear(),month=fav_date.getMonth()+1,day=fav_date.getDate();
                let hour=extend(fav_date.getHours()),minute=extend(fav_date.getMinutes());
                if(!obliterateJudge(unix_timestamp)){
                    $(ele).html("收藏于："+(time_display_type=="m"?"":" ")
                    +`${year}-${month}-${day}&nbsp;&nbsp;`
                    +(time_display_type=="m"?`${hour}:${minute}`:""));
                }
                else{
                    $(ele).html("收藏于：obliterated");
                }
                $(ele).attr("pubdate_updated",list[ind].fav_time*1000);
            });
        }
        async function cleanPanel(){
            if(!await wait(".fav-item.cur"))return;let media_id=getMediaId();if(!media_id)return;
            $(".small-item>.pubdate").each((ind,ele)=>{
                if($(ele).attr("pubdate_updated"))return;
                $(ele).html("loading...")
            });
        }
        async function seekUpdate(){
            if(!infav)await theWorld();
            console.log("Function seekUpdate executed.");
            if(!$(".fav-content.loading").length){cleanPanel();}
            let cnt_=100;
            let itv_=setInterval(()=>{
                if(!$(".fav-content.loading").length){
                    cleanPanel();
                    clearInterval(itv_);
                }
                cnt_--;
                if(!cnt_)clearInterval(itv_);
            },50);//防止显示旧日期，无需异步
            let list=await requestList();if(!list)return;
            console.log("List result received");
            if(!$(".fav-content.loading").length){updateFavTime(list);return;}
            let cnt=100;
            let itv=setInterval(()=>{
                if(!$(".fav-content.loading").length){
                    updateFavTime(list);
                    clearInterval(itv);
                }
                cnt--;
                if(!cnt)clearInterval(itv);
            },50);
        }
        function setEvent(identifier){
            let itv=setInterval(()=>{
                if($(identifier).length){
                    if(identifier==".be-pager"){$(identifier).on("click",seekUpdate);}
                    if(identifier==".fav-sidenav"){
                        $(identifier).on("click",seekUpdate);
                        $(identifier).on("click",requestTid);
                        $(identifier).on("click",addDropdownMenu);
                    }
                    if(identifier==".fav-header"){
                        $(identifier).on("click",seekUpdate);
                        $(identifier).on("click",addDropdownMenu);
                        $(identifier).on("click",()=>{
                            if($(".be-dropdown.filter-item").length<2){
                                console.log("Dropdown menu removed.");
                                $("div.filter-time-precision").remove();
                            }
                        });
                        $(identifier).on("keydown",(event)=>{
                            if (event.keyCode==13){
                                seekUpdate();
                                console.log("Dropdown menu removed.");
                                $("div.filter-time-precision").remove();
                                setEvent(".back-to-info.icon");
                            }
                        });
                    }
                    clearInterval(itv);
                }
            },300);
        }

        function init(){
            addDropdownMenu();
            requestTid();
            seekUpdate();
            setEvent(".fav-header");
            setEvent(".be-pager");
            setEvent(".fav-sidenav");
        }
        let itv=setInterval(()=>{
            if($(".n-favlist").length){
                init();
                $(".n-favlist").on("click",()=>{
                    init();
                });
                clearInterval(itv);
            }
        },200);
        $(document).on("click",()=>{
            if($(".geetest_widget .geetest_panel").length){
                seekUpdate();
                requestTid();
            }
        });
    });
})();