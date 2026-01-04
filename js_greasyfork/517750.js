// ==UserScript==
// @name         YuketangAuto
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  yuketang auto play!
// @author       You
// @match        https://www.yuketang.cn/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517750/YuketangAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/517750/YuketangAuto.meta.js
// ==/UserScript==

(function() {
    if(typeof(localStorage.all_lst)=='undefined')
    {
        localStorage.all_lst="[]";
    }

    window.onload = function() {
        if(window.location.pathname.search("v2/web/xcloud/video-student")!=-1)
        {
            setTimeout(() => {
                console.log("autoplay");
                let mute=document.getElementsByClassName("xt_video_player_volume xt_video_player_common fr")[0];
                mute.children[0].click();
                document.querySelector("video").muted=document.querySelector("video").defaultMuted=true;
                document.querySelector("video").play();
                //playbut.dispatchEvent(clickEvent);
            }, 1500);}
    }
    /*const scriptContent = `
        window.onload = function() {
            setTimeout(() => {
                console.log("autoplay");
                do {
                    var butlst = document.getElementsByClassName("xt_video_player_play_btn fl");
                } while (butlst.length == 0);
                const playbut = butlst[0];
                const clickEvent = new Event("pointerdown", { bubbles: true, cancelable: true });
                console.log(playbut.dispatchEvent(clickEvent));
            }, 2000);
        }
    `;

    // 创建一个script标签并插入页面
    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.body.appendChild(script);*/
    'use strict';
    let original_XHR = window.XMLHttpRequest;
    class XMLHttpRequestHijacked extends original_XHR
    {
        isList=false;
        override=false;
        hijack=false;
        currID=0;
        currChap=0;
        new_val={}
        set response(new_val)
        {
            this.override=true;
            this.new_val=new_val;
        }
        get responseText()
        {
            //console.log("reading text");
            if(this.override)
            {
                return JSON.stringify(this.new_val);
            }
            else if(this.isList)
            {
                let all_lst=[];
                let lst=JSON.parse(super.response).data;
                console.log(lst);
                for(let i of lst.course_chapter)
                {
                    for(let j of i.section_leaf_list)
                    {
                        if("leaf_list" in j)
                        {
                            for(let k of j.leaf_list)
                            {
                                if("leaf_type" in k && k.leaf_type==0)
                                {
                                    all_lst.push(k.id)
                                }
                            }
                        }
                        else if("leaf_type" in j && j.leaf_type==0)
                        {
                            all_lst.push(j.id);
                        }
                    }
                }
                console.log(all_lst);
                localStorage.all_lst=JSON.stringify(all_lst);
                return super.responseText;
            }
            else if(this.hijack)
            {

                let res=JSON.parse(super.response);
                //console.log(res.data[this.currID].completed);

                if(!res.data[this.currID] ||!("completed" in res.data[this.currID]))
                {
                    console.log("not a interest req");
                    return super.responseText;
                }
                if(res.data[this.currID].completed)
                {
                    let all_lst=JSON.parse(localStorage.all_lst);
                    let newID=all_lst[all_lst.indexOf(this.currID)+1]
                    let newUrl=window.location.href.replace(this.currID,newID);
                    console.log("redirect to next video",newUrl);
                    window.location.assign(newUrl);
                }
                else
                {
                    console.log("not finished");
                    return super.responseText;
                }
            }
            else
            {
                return super.responseText;
            }
        }
        open(method, url, async=true, username, password)
        {
            if(url.search("mooc-api/v1/lms/learn/course/chapter")!=-1)
            {
                this.isList=true;
            }
            if(url.search("get_video_watch_progress")!=-1)
            {
                let currPath=window.location.pathname;
                this.currID=parseInt(currPath.substring(currPath.lastIndexOf('/')+1));
                currPath.replace("/"+this.currID,"");
                this.currChap=parseInt(currPath.substring(currPath.lastIndexOf('/')+1));
                console.log("progress get detected!");
                console.log("current id:",this.currID);
                console.log("current chap:",this.currChap);
                this.hijack=true;
            }
            /*
            if(url.search("track")!=-1)
            {
                do
                {
                    var butlst=document.getElementsByClassName("xt_video_player_play_btn fl");
                }while(butlst.length==0);
                let playbut=butlst[0];
                let clickEvent = new Event("pointerdown",{ bubbles: true, cancelable: true,composed:true });
                console.log(playbut.dispatchEvent(clickEvent));
            }*/
            let rescnt = super.open(method, url, async, username, password);
            return rescnt;
        }
    }

    window.XMLHttpRequest = XMLHttpRequestHijacked;
    // Your code here...
})();