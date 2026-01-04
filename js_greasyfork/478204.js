// ==UserScript==
// @name         加载本地弹幕
// @namespace    https://greasyfork.org/zh-CN/users/1202577-%E5%AD%90%E5%9F%9F
// @supportURL   https://greasyfork.org/zh-CN/users/1202577-%E5%AD%90%E5%9F%9F
// @version      0.2
// @description  在哔哩哔哩网页加载本地xml弹幕
// @author       子域
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/list/watchlater?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478204/%E5%8A%A0%E8%BD%BD%E6%9C%AC%E5%9C%B0%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478204/%E5%8A%A0%E8%BD%BD%E6%9C%AC%E5%9C%B0%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

/* globals jQuery,$*/
function init(){
    function hookLoadHistory(){
        Object.defineProperty(Object.prototype,"allHistory",{
            set(v){
                delete Object.prototype.allHistory;
                let that =this;
                this.allHistory=v;
                this.allHistory=new Proxy(this.allHistory,{
                    get(target,prop){
                        that.dmListStore.basList=[];
                        $("div.bas-danmaku",that.nodes.basDanmaku).html("");
                        if(prop!=="0"){
                            return target[prop];
                        }else{
                            let decodeMsg=$("#localDmFile").data("decodeMsg");
                            if(decodeMsg){
                                return Promise.resolve(decodeMsg);
                            }else{
                                return target[prop];
                            }
                        }
                    },
                });
            },
            get(){
                return this._allHistory;
            },
            configurable:true,
        });
        return;
    }
    function loadDatePicker(){
        let task={};
        let ob=new MutationObserver(function(recode){
            getElement(task);
        });
        function getElement({selector,context=$(document),callback}){
            let elem=context.find(selector).eq(0);
            if(elem.length){
                callback(elem);
            }
        }
        return new Promise(resolve=>{
            task.selector="#danmukuBox";
            task.callback=resolve;
            getElement(task);
        }).then(danmukuBox=>new Promise(resolve=>{
            ob.disconnect();
            ob.observe(
                danmukuBox[0],
                {"childList":true,"subtree":true}
            );
            task.selector="div.bui-collapse-wrap";
            task.context=danmukuBox;
            task.callback=resolve;
            getElement(task);
        })).then(collapseWrap=>new Promise(resolve=>{
            if(collapseWrap.hasClass("bui-collapse-wrap-folded")){
                collapseWrap.find("div.bui-collapse-header").click();
            }
            task.selector="div.bpx-player-dm-btn-history";
            task.context=collapseWrap;
            task.callback=resolve;
            getElement(task);
        })).then(datePickerBtn=>new Promise(resolve=>{
            ob.disconnect();
            ob.observe(
                datePickerBtn[0],
                {"attributes":true,
                 "childList":true,
                 "subtree":true,}
            );
            setTimeout(datePickerBtn.click.bind(datePickerBtn));
            task.selector="div.bpx-player-date-picker.bpx-player-show";
            task.context=datePickerBtn;
            task.callback=resolve;
            getElement(task);
        })).then(datePicker=>{
            datePicker.closest("div.bpx-player-dm-btn-history").click();
        }).finally(()=>{
            ob.disconnect();
        });
    }
    function insertInputBtn(){
        let input=$(document.createElement('input'));
        input.attr({
            "type":"file",
            "id":"localDmFile",
            "style":"display:block;position:fixed;bottom:10px;left:10px;z-index:100;border:solid 2px #9e9e9e;background-color:white;width:160px;opacity:0.8;",
        });
        input.on("click",function(e){
            this.value=null;
            e.stopPropagation();
        });
        input.on("change",function(){
            try{
                if(!this.files.length){
                    return;
                }
                let file=this.files[0];
                let reader=new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = loadDmFromFile;
            }catch(e){
                throw new Error("读取文件错误\n"+e.stack);
            }
        });
        input.on("mouseenter",function(){
            $(this).fadeTo(100,1);
        });
        input.on("mouseleave",function(){
            $(this).fadeTo("slow",0.5,"swing");
        });
        $(document.body).append(input);
        function loadDmFromFile(){
            let result;
            if(this.result instanceof window.ArrayBuffer){
                result=new TextDecoder("utf-8").decode(this.result);
            }else if(typeof this.result ==="string"){
                result=this.result;
            }else{
                throw Error(`未知类型\n${Error().stack}`);
            }
            const xml = new DOMParser().parseFromString(result,"text/xml");
            let decodeMsg=[];
            let stimeOffset=parseInt(prompt("弹幕时间偏移(单位:毫秒)\n(正数延迟出现,负数反之,默认为0)",0));
            for (let value of xml.querySelectorAll("d")){
                let [stime,mode,size,color,date,weight,uhash,dmid]=value.getAttribute('p').split(',');
                decodeMsg.push({
                    "stime":+stime*1e3+stimeOffset,//出现时间
                    "mode":+mode,//弹幕类型:1:滚动,4:底部,5:顶部,6:逆向,7:高级(字幕),8:代码,9:BAS
                    "size":+size,//字号
                    "color":+color,//颜色
                    "date":+date,//时间戳(秒)
                    "weight":+weight,//智能屏蔽等级
                    "uhash":uhash,//用户hash
                    "dmid":dmid,//弹幕id
                    "text":value.textContent.replace(/[\/\\]n/g,"\n"),//弹幕内容
                    "pool":({7:1,8:2,9:2}[mode])||0,//弹幕池类型,0=普通,1=高级(字幕),2=代码
                    "attr":2,//attr<0时带拇指点赞图标
                    "asNormal":false
                });
            }
            $("#localDmFile").data('decodeMsg',decodeMsg);
            let datePickerSelector="#danmukuBox div.bpx-player-dm-btn-history div.bpx-player-date-picker";
            let fakeElement=$(datePickerSelector)
            .find("div.bpx-player-date-picker-day-content span.bpx-player-date-picker-day")
            .eq(0)
            .clone()
            .attr({
                "data-timestamp": new Date().setHours(0,0,0,0)/1e3,
                "data-action": "changeDay",
            })[0];
            let fakeEvent=new MouseEvent("click");
            Object.defineProperty(fakeEvent,"target",{value:fakeElement});
            $(datePickerSelector)[0].dispatchEvent(fakeEvent);
        }
    }

    hookLoadHistory();
    $(document).ready(function(){
        loadDatePicker()
            .then(insertInputBtn)
            .catch(e=>{
            throw new Error("初始化失败\n"+e.stack);
        });
    });
    return;
}

(function(){
    "use strict";
    try{
        init();
    }catch(e){
        alert(`运行异常:${e.message},请刷新重试`);
    }
})();