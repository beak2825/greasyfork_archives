// ==UserScript==
// @name         Image Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require https://code.jquery.com/jquery-3.3.1.js
// @match        https://mrcong.com/*
// @downloadURL https://update.greasyfork.org/scripts/375378/Image%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/375378/Image%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var imgWeb={
        "mrcong.com":{
            getPages:function(){
                return Array.from(document.querySelectorAll(".page-link")[0].childNodes).filter(x=>x.nodeName=="A");
            },
            getImages:function(url,onSuccess){
                $.ajax({
                    method:"GET",
                    url:url,
                    success:function(data){
                        onSuccess($(data).find(".entry img").toArray());
                    }
                });
            },
            getViewContext:function(){
                if (document.querySelectorAll(".entry .il-image-container").length==0){
                    let imgContainer=$(`<div class="il-image-container"></div>`);
                    imgContainer.append($(".entry img"));
                    $(".entry").append(imgContainer);
                    return imgContainer;
                }
                else{
                    return document.querySelector(".entry .il-image-container");
                }
            },

            getOffsetHeight:function(){
                return this.getViewContext().offsetHeight;
            },

            scrollValid(curr,max){
                if (curr>=max-window.innerHeight/2){
                    return true;
                }
                return false;
            }
        }
    };

    function ImageContext(host){
        this.host=host;
        let instance=imgWeb[host];
        this.currentIndex=-1;
        this.percReading=80;
        this.viewContent=instance.getViewContext();
        Object.defineProperty(this,"scrollPosition",{
            get:function(){
                return instance.getOffsetHeight()/100*this.percReading;
            }
        });
        this.pages=instance.getPages();
        this.loadState={};
        this.isComplete=false;
        this.loading=false;
        this.alertComplete=false;
        for (let x of this.pages){
            this.loadState[this.pages[x]]=false;
        }
        this.cPageUrl=this.pages.filter(x=>x==window.location.href);
        if (this.cPageUrl.length){
            this.cPageUrl=this.cPageUrl[0];
        }
        else{
            this.cPageUrl=null;
        }
        this.currentIndex=this.pages.indexOf(this.cPageUrl);
        this.currentScrollPosition=-1;
        this.loadNextPage=function(){
            if (!this.loading && !this.isComplete){
                this.loading=true;
                if (window.location.href==this.pages[this.pages.length-1]){
                    this.isComplete=true;
                    return;
                }
                this.currentIndex+=1;
                let viewContent=this.viewContent;
                let nPage=this.pages[this.currentIndex];
                let loadState=this.loadState;
                let ctx=this;
                let currentScrollPosition=this.currentScrollPosition;
                if (nPage){
                    instance.getImages(nPage,function(data){
                        window.history.pushState("","",nPage);
                        if (!loadState[nPage]){
                            data.forEach(x=>{
                                $(viewContent).append(x);
                            });
                            loadState[nPage]=true;
                            ctx.loading=false;
                        }
                    });
                }
            }
            else{
            }
        };
        this.scrollValid=function(curr,max){
            this.currentScrollPosition=curr;
            return instance.scrollValid(curr,max);
        };
    };
    $(document).ready(function(){
        var ctx=new ImageContext(window.location.host);
        $(document).on("scroll",function(){
            if (ctx.scrollValid(window.pageYOffset,ctx.scrollPosition)){
                ctx.loadNextPage();
            }
        });
    });
})();