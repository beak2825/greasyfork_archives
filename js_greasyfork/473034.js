// ==UserScript==
// @name         B站已观看视频标记
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  bilibili已观看视频标记。无需手动标记。只对从安装脚本时间三个月前起的历史记录起效。
// @author       Kesdiael Ken
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://t.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/473034/B%E7%AB%99%E5%B7%B2%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/473034/B%E7%AB%99%E5%B7%B2%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(() => {
    'use strict';
    $(()=>{
        GM_addStyle(`
            .viewed-notice{
                z-index:9999;
                display:block;
                position:absolute;
                top:0px;
                left:0px;
                padding:3px 6px 3px 5px;
                background-color:rgba(0,0,0,.6);
                text-align:center;
                border-radius:0 0 10% 0
            }
            .viewed-notice span{
                color:white;
            }
        `);//已观看角标样式调整


        let url=location.href;
        let key=null;

        function checkurl()
        {
            if(url.match(/https:\/\/www\.bilibili\.com\/video/)){
                let bv=url.match(/(BV\w+)/)[1];
                GM_setValue(bv,true);
            }
        }//已观看视频url记录

        checkurl();

        $(document).on("click",()=>{
            let cnt=30;
            let offset=setInterval(()=>{
                if(url!=location.href){
                    url=location.href;
                    console.log("new url: "+url);
                    checkurl();
                    clearInterval(offset);
                }
                cnt--;
                if(!cnt)clearInterval(offset);
            },150);
        })//点击时检查是否观看了新视频

        function Img_hover(me,ml,mq,tg,itv,once1,once2,self){
            this.me=me;
            this.ml=ml;
            this.mq=mq;
            this.tg=tg;
            this.itv=itv;
            this.once1=once1;
            this.once2=once2;
            this.self=self;
        }

        function append_notice(ind,ele,linkplace,imgplace){
            if($(ele).find(".viewed-notice").length)return;
            let link=$(ele).find(linkplace);
            if(!link.length)return;
            link=link.attr("href");
            let bv=link.match(/(BV\w+)/)[1];
            if(GM_getValue(bv)){
                let img=$(ele).find(imgplace);
                if(!img.length)return;
                img.append(`
                    <div class="viewed-notice" id="${bv}">
                        <span> 已观看 </span>
                    </div>
                `);
                let me,ml,mq=1;
                let self=$(ele).find(`#${bv}`);
                let tot1=200,tot2=100;
                let itv=10,tg=0.7;
                tot1/=2;tot2/=2;
                let once1=(1-tg)/(tot1/itv),once2=(1-tg)/(tot2/itv);
                let imgobj=new Img_hover(me,ml,mq,tg,itv,once1,once2,self);
                img.mouseenter(()=>{
                    clearInterval(imgobj.me);clearInterval(imgobj.ml);
                    imgobj.me=setInterval(()=>{
                        if(imgobj.mq-imgobj.tg<0.001)clearInterval(imgobj.me);
                        else{
                            imgobj.self.fadeTo(imgobj.itv,imgobj.mq-imgobj.once1);
                            imgobj.mq-=imgobj.once1;
                        }
                    },imgobj.itv);
                });
                img.mouseleave(()=>{
                    clearInterval(imgobj.me);clearInterval(imgobj.ml);
                    imgobj.ml=setInterval(()=>{
                        if(1-imgobj.mq<0.001)clearInterval(imgobj.ml);
                        else{
                            imgobj.self.fadeTo(imgobj.itv,imgobj.mq+imgobj.once2);
                            imgobj.mq+=imgobj.once2;
                        }
                    },imgobj.itv);
                });
            }
        }//为视频预览加上已观看角标

        function render(){
            key=null;
            if($("ul .video-item").length)key=$("ul .video-item").eq(0).find("a.img-anchor").attr("href");
            if($(".rec-list .video-page-card").length)key=$(".rec-list .video-page-card").eq(0).find(".info>a").attr("href");
            $("ul .video-item").each((ind,ele)=>{
                append_notice(ind,ele,"a.img-anchor",".b-img");
                append_notice(ind,ele,"a.img-anchor",".lazy-img");
            });
            $(".rec-list .video-page-card").each((ind,ele)=>{
                append_notice(ind,ele,".info>a",".b-img");
                append_notice(ind,ele,".info>a",".lazy-img");
            });
        }//寻找所有已观看视频并加上角标
        req(0,0,"");
        render();
        let rendering=false;
        function render_when_load()
        {
            if(rendering)return;
            rendering=true;
            let cnt=40;
            let offset=setInterval(()=>{
                if($("ul .video-item").length && $("ul .video-item").eq(0).find("a.img-anchor").attr("href")!=key)
                {
                    render();
                    clearInterval(offset);
                    rendering=false;
                }
                if($(".rec-list .video-page-card").length && $(".rec-list .video-page-card").eq(0).find(".info>a").attr("href")!=key)
                {
                    render();
                    clearInterval(offset);
                    rendering=false;
                }
                cnt--;
                if(!cnt){
                    clearInterval(offset);
                    rendering=false;
                }
            },200);
        }//加载延迟执行
        $("input#search-keyword").on("keydown",(event)=>{
            if (event.keyCode==13)render_when_load();
        })//回车执行
        $(document).on("click",render_when_load);
        $(".rec-footer").on("click",()=>{
            setTimeout(render,200);
        })//视频推荐列表展开执行
        let scrolling=false;
        $(document).on("scroll",()=>{
            if(location.href.match(/https:\/\/www\.bilibili\.com\/video/)&&!scrolling){
                scrolling=true;
                render();
                setTimeout(()=>{scrolling=false;},100);
                console.log("scrolling detected");
            }
        });

        function wait(url){
            return new Promise(res=>{
                GM_xmlhttpRequest({
                    method:"GET",
                    url:url,
                    onload:(r)=>{
                        res(JSON.parse(r.response));
                    }
                });
            })
        }//请求20条历史记录
        async function req(max,view_at,business){
            let res=await wait(`https://api.bilibili.com/x/web-interface/history/cursor?max=${max}&view_at=${view_at}&business=${business}`);
            let data=res.data;
            max=data.cursor.max;
            view_at=data.cursor.view_at;
            business=data.cursor.business;
            console.log(data);

            let tf=false;
            data.list.forEach(ele => {
                let bv=ele.history.bvid;
                tf|=!GM_getValue(bv);
                GM_setValue(bv,true);
            });

            if(max&&tf)req(max,view_at,business);
            return;
        }//请求所有历史记录

        $(document).on("click",()=>{req(0,0,"");});

        setInterval(()=>{
            req(0,0,"");
            render();
        },20000);//每20秒更新一次

    });
})();