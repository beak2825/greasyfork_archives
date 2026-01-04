// ==UserScript==
// @name         记住阅读进度
// @namespace    http://tampermonkey.net/
// @version      4.4.0
// @description  记住页面阅读进度，即使对于单页面，也能很好的工作！
// @match      *://*/*
// @exclude  http://127.0.0.1*
// @exclude  http://localhost*
// @exclude  http://192.168.*
// @author       zhuangjie
// @icon         data:image/png;base64,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
// @license MIT

// @grant        GM_setValue
// @grant        GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/452142/%E8%AE%B0%E4%BD%8F%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/452142/%E8%AE%B0%E4%BD%8F%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==


(function() {
   'use strict';
    // Your code here...
    // 编写脚本学习教程：http://www.ttlsa.com/docs/greasemonkey/#pattern.addcss
    // 解决广工商学校选课网无法显示左边栏：原因是脚本中加了 window.onload 有关
    // 上一个重要版本：https://cdn.jsdelivr.net/gh/18476305640/typora@master/images/2022/10/21/recoverHistorySchedule.js
    // https://cdn.jsdelivr.net/gh/18476305640/typora@master/images/2022/10/26/f.txt

    // 初始化事件容器-页面活跃与否事件(节省性能而使用)
    (function () {
         window.onblur = function () {
              window.events.onblur.trigger();
          }

        window.onfocus = function () {
            window.events.onfocus.trigger();
        }
        window.events = {
           onblur: {
              monitors: [],
              add(fun) {
                 this.monitors.push(fun)
              },
              trigger() {
                  for(let i = 0; i < this.monitors.length; i++) {
                     this.monitors[i]();
                  }
              }
           },
            onfocus: {
              monitors: [],
              add(fun) {
                 this.monitors.push(fun)
              },
              trigger() {
                  for(let i = 0; i < this.monitors.length; i++) {
                     this.monitors[i]();
                  }
              }
           }
        }

    })();
     // 【url改变监听器】
    function onUrlChange(fun) {
        let initUrl = window.location.href.split("#")[0];
        function urlChange() {
            let currentUrl = window.location.href.split("#")[0];
            if(initUrl != currentUrl) {
               // 新的=>旧的
               initUrl = currentUrl;
               fun();
               initUrl = currentUrl;
            }
        }
        let si = setInterval(urlChange,460)
        window.onblur = function() {
            clearInterval(si);
        }
        window.onfocus = function() {
            si = setInterval(urlChange,460)
        }
    }
    // 全局url事件
    window.urlChangeListener = {
       events:[],
       add(event) {
          this.events.push(event)
       },
       trigger (){
          for(let event of this.events) {
              event()
          }
       }
    }
    onUrlChange(function(){window.urlChangeListener.trigger()})

    // 防抖函数
    function debounce(fn, wait) {
        var timeout = null;
        return function() {
            if(timeout != null ) clearTimeout(timeout);
            timeout= setTimeout (fn, wait);
        }
    }
    // 节流函数
    const throttle = (fn, Intervals, ...args) => {
        let timeNo;
        return (...params) => {
            if(timeNo) return;
            timeNo = setTimeout(() => {
                fn(...args,...params)
                clearTimeout(timeNo);
                timeNo = null;
            }, Intervals);
        }
    }
    // 多iframe 屏障
    function iframeParclose(name) {
        if(name == null) {
            name = Date.now();
        }
        return {
            set(timeout = 2000) {
                const value = cache.get(name);
                if(value && parseInt(value) > Date.now()) return false;
                cache.set(name,Date.now() + timeout);
                return true;
            },
            remove() {
                cache.remove(name);
            }
        }
    }
    async function iframeParcloseWrapper(name,fun) {
        const parclose = iframeParclose(name);
        const timeout = 1200;
        if(!parclose.set(timeout)) return;
        try {
            await fun();
        }finally {
            setTimeout(()=>parclose.remove(),timeout)
        }
    }


    // 数据缓存器
    let cache = {
        get(key) {
            return GM_getValue(key);
        },
        set(key,value) {
            GM_setValue(key,value);
        },
        remove(key) {
            GM_deleteValue(key)
        }
    }

    let rpcCache; rpcCache = getRPC();
    function setRPC(config) {
        if(config == null) return;
        cache.set("ReadingProgressConfig",rpcCache = config)
    }
    function getRPC() {
        let result = cache.get("ReadingProgressConfig")
        if(result == null) {
            // 默认数据
            result = {
               // URL规则（满足应用）
               ruleList: [
                   "**",
                  "https://www.cnblogs.com/**/p/**",
                  "https://blog.csdn.net/**"
               ],
               heightThreshold: 2000, // 高度阈值
               isShowSchedule: true // 是否显示进度控制
            }
            // 保存初始配置
            setRPC(result);
        }
        return result;
    }

    GM_registerMenuCommand("开/关进度显示",function() {
        iframeParcloseWrapper("ProgressDisplayStatusChange",function() {
            return new Promise((resolve,reject)=>{
                const rpc = getRPC();
                rpc.isShowSchedule = !rpc.isShowSchedule;
                setRPC(rpc)
                alert(`┌(｀▽′)╭ 进度显示已${rpc.isShowSchedule?"开启":"关闭"}`)
                resolve();
            })
        })
    });
    GM_registerMenuCommand("配置规则",function() {
        showConfigView();
    });

    // 显示配置规则视图
    function showConfigView() {
        // 后面可能会修改配置，刷新配置缓存，防止其它页面的修改导致当前页面的数据不一致
        rpcCache = getRPC();
        // 显示视图
        var configViewContainer = document.createElement("div");
        configViewContainer.style=`
            width:300px; background:pink;
            position: fixed;right: 0px; top: 0px;
            z-index:10000;
            padding: 20px;
            border-radius: 14px;
        `
        configViewContainer.innerHTML = `
           <p id="rpc_close">X</p>
           <p class="rpc_config_title">URL规则：</p>
           <textarea id="rpc_urlTextarea" ></textarea>
           <p class="rpc_config_title">高度阈值：</p>
           <input id="rpc_heightInput" />
           <div id="rpc_controller">
               <button id="rpc_save" >保存</button>
               <span id="rpc_tis" title="规则与高度阈值都满足脚本才会生效！">一┗|｀O′|┛ 说明 ~ </span>
           </div>
        `;

        // 设置样式
        document.body.appendChild(configViewContainer)
        document.getElementById("rpc_close").style="color: red;font-weight: bold;font-size: 14px;cursor: pointer; position: absolute;right: 10px; top: 10px;margin: 0;";
        Array.from(document.getElementsByClassName("rpc_config_title")).forEach(item => {
            item.style = "font-size:14px;margin:7px 0 5px;color: black;";
        });
        document.getElementById("rpc_urlTextarea").style="width:100%;height:150px;border: 4px solid rgb(245, 245, 245);box-sizing: border-box;";
        document.getElementById("rpc_heightInput").style="width:100%;border: 2px solid rgb(245, 245, 245);box-sizing: border-box;";
        document.getElementById("rpc_controller").style="width:100%; margin-top:20px;";
        document.getElementById("rpc_save").style="width:30%; border:none;border-radius:3px;padding:3px;";
        document.getElementById("rpc_tis").style="color:#f5f5f5;display:block;text-align: center;float: right;cursor: pointer;";
        // 回显
        document.getElementById("rpc_urlTextarea").value = rpcCache.ruleList.join("\n")
        document.getElementById("rpc_heightInput").value = rpcCache.heightThreshold
        // 保存
        document.getElementById("rpc_save").onclick=function() {
            // 保存到对象
            rpcCache.ruleList = document.getElementById("rpc_urlTextarea").value.split("\n")
            rpcCache.heightThreshold = document.getElementById("rpc_heightInput").value
           // 持久化
           setRPC(rpcCache)

           // 清除视图
           configViewContainer.remove();
           alert("保存配置成功！")
        }
        // 关闭
        document.getElementById("rpc_close").onclick = ()=> configViewContainer.remove();
    }
    // 检查量下满足开启脚本条件
    function checkIsSatisfyEnableCondition() {
        let heightThreshold = rpcCache.heightThreshold;
        let ruleList = rpcCache.ruleList;
        // 判断高度是否满足
        let isSatisfyHeight = getDocumentHeight() >= heightThreshold;
        // 判断是否满足规则
        let isSatisfyURL = seeSatisfyURL();
        return isSatisfyHeight && isSatisfyURL;

    }
    // 看下是否满足开启脚本条件-根据URL规则
    function seeSatisfyURL () {
        let currentUrl = window.location.href;
        let ruleList = rpcCache.ruleList;
        // 当规则为空时，直接返回false
        if(ruleList == null || ruleList.length == 0) return false;
        for(let rule of ruleList) {
            rule = rule.trim();
            if(rule.indexOf("**") < 0 ) {
               if(currentUrl== rule) return true;
               continue;
            }
            // 满足泛匹配
            let isOk = (function(){
               let ruleChilds = rule.split("**")
               if(ruleChilds == null || ruleChilds.length == 0) return false;
               for(let block of ruleChilds) {
                   if(currentUrl.indexOf(block) < 0) {
                       // 表示当前测试的这个规则不满足
                       return false;
                   }
               }
               return true;
            })();
            if(isOk) return true;
        }
        // 当规则不为空时，且不通过上面的匹配时，返回false
        return false;
    }

    // 【何时开始脚本】
    // 获取滚动历史高度
    let item_content = localStorage.getItem(getCurrentUrl())
    let history_high = item_content == null?0:parseFloat(item_content);
    // 是否已经初始化
    let isInit = false;
    // 初始化程序
    do {
        if(history_high <= getDocumentHeight() || document.readyState == "complete") {
           setTimeout(()=>{init()},50)
           break;
        }
    }while(history_high <= getDocumentHeight() || document.readyState == "complete");


    // 【主程序】
    function init() {
        // 判断当前页面是否满足开启阅读进度
        if(!checkIsSatisfyEnableCondition() && !isInit) {
           // 当页面不满足初始化时，添加再次初始化器，当页面url改变时，会再次尝试
           window.urlChangeListener.add(function() {
               setTimeout(()=>{init() },1500)
           })
           return;
        };
        // 标记为已初始化
        isInit = true;
        // 初始化还原器
        recoverMonitor();
        // 初始化进度显示视图
        initView();
        // 初始化记录器
        initRecorder();
    }



    //【函数库】
    //有动画地滚动， 这里不用，因为要直接恢复，而不浪费滚动的时间
    let st = null; //保证多次执行 scrollTo 函数不会相互影响
    function scrollTo(scroll, top) {
        if(st != null ) {
            //关闭上一次未执行完成的滚动
            clearInterval(st);
        }
        //每次移动的跨度
        let span = 5;
        // 最长滚动时间
        let timeout = false;
        let timeout_time = 5000;
        let timer = setTimeout(()=>{timeout=true},timeout_time);
        st = setInterval(function () {
            let currentTop = getCurrentTop();
            //当在跨度内时，直接到达, 如果不在指定时间内滚动到，那将直接到达
            if ((currentTop >= top - span && currentTop <= top + span) || timeout ) {
                clearTimeout(timer);
                timeout = false;
                setTop(top);
                // $(scroll).scrollTop(top);
                //让st为null，让关闭定时器
                let tmp_st = st;
                st = null;
                //关闭定时器（下一次不会再执行，但本次还会执行下去），再return;
                clearInterval(tmp_st);
                // console.log("滚动完成",top+"<is>"+ getCurrentTop() )
                return;
            }
            //如果不在跨度内时，根据当前的位置与目的位置进行上下移动指定跨度
            if (currentTop < top) {
                setTop(currentTop + span)
            } else {
                setTop(currentTop - span)
            }
            span++
        }, 20)
    }

    // 获取url，url经过了处理
    function getCurrentUrl() {
       return window.location.href.split("#")[0]
    }
    // 获取存储标记，用于存储滚动“责任人”
    function getCurrentPageWhoRoll() {
        return getCurrentUrl()+"<and>WhoRoll";
    }
    // 获取当前滚动的高度
    function getCurrentTop() {
       return document.documentElement.scrollTop || document.body.scrollTop;
    }
    // 获取文档高度
    function getDocumentHeight() {
       // 获取最大高度
       return (document.documentElement.scrollHeight > document.body.scrollHeight?document.documentElement.scrollHeight:document.body.scrollHeight)
    }
    // 到达指定高度
    function setTop(h,isCheck = true) {
        let whoRoll = localStorage.getItem(getCurrentPageWhoRoll())
        if(!isCheck) {
            document.documentElement.scrollTop = h;
            document.body.scrollTop = h;
            return;
        }
        if(whoRoll == "document") {
            if(getDocumentHeight() >= h ) {
                document.documentElement.scrollTop = h;
            }
        }else {
            if(getDocumentHeight() >= h ) {
                document.body.scrollTop = h;
            }
        }


    }

    // 判断是否在滚动
    function onNotScrolling(callback,ScrollingCallback) {
       // 如果不在滚动调用回调
       let h1 = parseInt(getCurrentTop());
       setTimeout(function() {
          let h2 = parseInt(getCurrentTop());
          if(h1 == h2) {
             callback();
          }else {
             ScrollingCallback();
          }
       },50)
    }
    // 检查是否到达指定位置
    function checkIsArriveHeight(time,expectHeight = 0,callback,flag = true) {
       setTimeout(function() {
           let top_down_scope = 200/2;
           let currentHiehgt = getCurrentTop();
           if(!(expectHeight >= currentHiehgt-top_down_scope && expectHeight <= currentHiehgt+top_down_scope)) {
              // 不管当前是否在滚动，都进行失败回调
              callback();
           }else {
               // 只有到达了且不在滚动了才算成功，否则调用失败回调
              onNotScrolling(function() {
              },callback)
           }
       },time)
       return null;
    }
    //【初始化视图显示】
    function initView () {
        const viewHtml = `
            <div id='progress_container'>
                <span class='progress_text'>helloworld</span>
                <div class='progress_view'></div>
            </div>
            <style>
               #progress_container {
                 display:none;
                 height: 35px;
                 line-height: 35px;
                 font-size: 15px;
                 position: fixed;
                 right: 20px;
                 top: 20px;
                 z-index: 10000;
                 padding: 0px 10px;
                 background: #333333;
                 color: #fff;
                 overflow: hidden;
               }
               #progress_container .progress_text {
                 z-index: 0;
               }
               #progress_container .progress_view {
                 height: 100%;
                 background: rgba(26, 173, 25,0.5);
                 position: absolute;
                 left: 0px;
                 top: 0;
                 z-index: 1;
               }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', viewHtml);
        let container, progressText, progressView;
        requestAnimationFrame(() => {
          container = document.querySelector('#progress_container');
          progressText = document.querySelector('#progress_container .progress_text');
          progressView = document.querySelector('#progress_container .progress_view');
        });
        // 显示容器
        function showSchedule() {
            if(!rpcCache.isShowSchedule || container == null) return;
            // 是否要显示/隐藏
            container.style.display= rpcCache.isShowSchedule?"block":"none";
            // 将 当前进度/ 总进度 放在显示容器中
            const curr = parseInt(getCurrentTop()), sum = parseInt(getDocumentHeight() - window.innerHeight);
            progressText.innerHTML = `${curr} / ${sum}`;
            progressView.style.width = container.clientWidth * (curr/sum) + "px";
            // 防抖关闭显示视图容器 -- 在上面的闭包中的监听了滚动
        }
        // 进度显示防抖关闭函数
        function showScheduleDebounce(fn, wait) {
            let timer = null;
            return function() {
                showSchedule();
                // 关闭定时器的
                if(timer != null ) clearTimeout(timer);
                timer= setTimeout (fn,wait);
            }
        }
        // 隐藏容器-处理函数
        function hideSchedule() {
            // 关闭容器
            container.style.display="none";
        }
        window.addEventListener('scroll', showScheduleDebounce(hideSchedule,460));

    }
    // 【初始化记录器】
    function initRecorder() {
        // 位置保存
        // 处理函数
        function handle() {

            // console.log(document.documentElement.scrollTop , document.body.scrollTop )
            let current_top = getCurrentTop();
            let current_url = getCurrentUrl()
            if(document.documentElement.scrollTop > document.body.scrollTop ) {
                localStorage.setItem(getCurrentPageWhoRoll(),"document")
            }else {
                localStorage.setItem(getCurrentPageWhoRoll(),"body")
            }
            if(current_top <= 10) return;
            // console.log("[记住历史进度]拿着小本本记着：",current_url,current_top+"px");
            // console.log(">>> 滚动责任：",localStorage.getItem(getCurrentPageWhoRoll()));
            localStorage.setItem(current_url,""+current_top)
        }
        // 滚动事件
        window.addEventListener('scroll',debounce(handle, 460));
    }

    // 【还原监听器】
    function recoverMonitor() {
        // 位置还原
        function recover() {
            let item_content = localStorage.getItem(getCurrentUrl())
            // 有记录
            if (item_content == null) return;
            // 获取历史高度
            let history_high = parseFloat(item_content);
            // 现在文档的高度
            let current_height = getDocumentHeight();
            // 如果没有历史高度，且高度不大于10就不还原
            if(history_high != null && history_high >= 10 ) {
                // 直接还原到历史位置
                setTop(history_high);
                // 检查是否恢复成功
                //let fun = null;
                //checkIsArriveHeight(500,history_high, function() {
                    // 如果失败，重试
                    //setTop(history_high,false);
                //});
            }
        }
        recover(); // 进入页面时还原
        window.urlChangeListener.add(recover)
    }
})();