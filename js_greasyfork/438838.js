// ==UserScript==
// @name         麒麟听书
// @namespace    czy
// @version      1.0.3
// @description  麒麟听书爬取具体章节信息
// @author       czy
// @icon         https://www.70ts.cc/favicon.ico
// @match        https://www.70ts.cc/tingshu/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @connect      none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/438838/%E9%BA%92%E9%BA%9F%E5%90%AC%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/438838/%E9%BA%92%E9%BA%9F%E5%90%AC%E4%B9%A6.meta.js
// ==/UserScript==

(function () {
    let newList=[];
    let storyName;

    if(parseInt(window.location.href.substring(window.location.href.indexOf("tingshu/")).replace("tingshu/","")) && parseInt(window.location.href.substring(window.location.href.indexOf("tingshu/")).replace("tingshu/",""))!=NaN){
        storyName = "tingshu"+parseInt(window.location.href.substring(window.location.href.indexOf("tingshu/")).replace("tingshu/",""));
    }else{
        storyName = "tingshu";
    }
    console.log("页面加载中")
    console.log("本地存储名："+storyName)
    if(localStorage.getItem(storyName) != null){
        newList = JSON.parse(localStorage.getItem(storyName));
    }else{
        localStorage.setItem(storyName,JSON.stringify(Array.from(new Set(newList))));
        //window.location.href = $(".jump-list .pg-next")[0].href;
    }
    function unique(arr) {
        // 创建一个Map对象实例
        const res = new Map()
        // 过滤条件：如果res中没有某个键，就设置这个键的值为1
        return arr.filter((arr) => !res.has(arr.bookEpisode) && res.set(arr.bookEpisode, 1))
    }
    window.onload=function(){
        /*jQuery/Zepto弹窗插件 | version:2016-11-30*/
        !function(t){var e=".alert_overlay{position:fixed;width:100%;height:100%;top:0;left:0;z-index:1000;background:rgba(0,0,0,.05);-webkit-backdrop-filter:blur(3px)}.pc .alert_msg{width:320px}.mob .alert_msg{width:260px;border-radius:4px}.alert_msg{box-sizing:border-box;position:absolute;left:50%;top:30%;border:1px solid #ccc;box-shadow:0 2px 15px rgba(0,0,0,.3);background:#fff;transition:all .2s cubic-bezier(.8,.5,.2,1.4);-webkit-transform:translate(-50%,-50%) scale(.5);opacity:0;transform:translate(-50%,-50%) scale(.5)}.alert_show .alert_msg{opacity:1;transform:translate(-50%,-50%) scale(1);-webkit-transform:translate(-50%,-50%) scale(1)}.alert_content{padding:20px 15px;font-size:14px;text-align:left}.alert_tips{position:fixed;z-index:10176523}.pc .alert_buttons{padding:6px;border-top:1px solid #ccc;text-align:right;box-shadow:0 1px 0 #fff inset;background:#eee;-webkit-user-select:none}.pc .alert_buttons .alert_btn{padding:4px 8px;margin:0 2px;border:1px solid #ccc;background:#eee;cursor:pointer;border-radius:2px;font-size:14px;outline:0;-webkit-appearance:none}.pc .alert_buttons .alert_btn:hover{border-color:#ccc;box-shadow:0 1px 2px #ccc;background:#eaeaea}.pc .alert_buttons .alert_btn:active{box-shadow:0 1px 2px #ccc inset;background:#e6e6e6}.pc.alert_tips{top:50px;right:50px}.pc.alert_tips div{background:rgba(0,0,0,.7);position:relative;color:#fff;font-size:16px;padding:10px 15px;border-radius:2px;margin-bottom:20px;box-shadow:0 0 3px #000;display:none;float:right;clear:both}.mob .alert_buttons{text-align:center;border-top:1px solid #ccc;-webkit-user-select:none}.mob .alert_buttons .alert_btn{display:inline-block;width:50%;border:0;height:40px;font-size:14px;outline:0;-webkit-appearance:none;background:#fff;-webkit-tap-highlight-color:transparent;border-radius:0 0 4px 4px}.mob .alert_buttons .alert_btn:only-child{width:100%}.mob .alert_buttons .alert_btn:first-child+.alert_btn{border-left:1px solid #ccc;border-radius:0 0 4px 0}.mob.alert_tips{width:100%;top:55%;pointer-events:none;text-align:center}.mob.alert_tips div{box-sizing:border-box;display:inline-block;padding:15px;border-radius:10px;background:rgba(0,0,0,.7);min-width:50px;max-width:230px;text-align:center;color:#fff;animation:tipsshow 3s .01s ease;-webkit-animation:tipsshow 3s .01s ease;opacity:0}@keyframes tipsshow{0%{opacity:0;transform:scale(1.4) rotateX(-360deg)}20%,80%{opacity:1;transform:scale(1) rotateX(0deg)}to{transform:scale(1.4) rotateX(360deg)}}@-webkit-keyframes tipsshow{0%,to{opacity:0}0%{-webkit-transform:scale(1.4) rotateX(-360deg)}20%,80%{opacity:1;-webkit-transform:scale(1) rotateX(0deg)}to{opacity:0;-webkit-transform:scale(1.4) rotateX(360deg)}}";t("head").append('<style type="text/css">'+e+"</style>"),t._ismob=/i(Phone|Pod)|Android|phone/i.test(navigator.userAgent),t._isalert=t._isload=0,t.alert=function(){if(arguments.length)return t._isalert=1,t.confirm.apply(t,arguments)},t.confirm=function(){var e,o=arguments;if(o.length){var a=o[1],n=function(t){"function"==typeof a?0!=a.call(e,t.data.r)&&e.close():e.close()};e=t('<div class="alert_overlay '+(t._ismob?"mob":"pc")+'"><div class="alert_msg"><div class="alert_content">'+o[0]+'</div><div class="alert_buttons"><button class="alert_btn alert_btn_cancel">取消</button><button class="alert_btn alert_btn_ok">确定</button></div></div></div>').on("contextmenu",!1).on("click",".alert_btn_ok",{r:!0},n).on("click",".alert_btn_cancel",{r:!1},n),t._isload?e.find(".alert_content").css("text-align","center").parent().css({width:"auto",borderRadius:"4px"}).find(".alert_buttons").remove():t._isalert&&e.find(".alert_btn_cancel").remove(),e.appendTo("body").find(".alert_btn_ok").focus(),e.ok=function(t){return e.find(".alert_btn_ok").text(t||"确定"),e},e.cancel=function(t){return e.find(".alert_btn_cancel").text(t||"取消"),e},e.content=function(t){return t&&e.find(".alert_content").html(t),e},e.close=function(){e.one("webkitTransitionEnd transitionEnd",function(){e.remove()}).removeClass("alert_show")},e.addClass("alert_show")}return t._isalert=t._isload=0,e},t.tips=function(e,o){if(e)if(t._ismob)t(".alert_tips").remove(),t('<div class="alert_tips mob"><div>'+e+"</div></div>").appendTo("body").one("webkitAnimationEnd animationEnd",function(){t(this).remove()});else{var a=t(".alert_tips");a.length||(a=t('<div class="alert_tips pc"></div>').appendTo("body")),t("<div>"+e+"</div>").appendTo(a).fadeIn("fast").delay(o||2e3).slideUp("fast",function(){t(this).remove()})}},t.load=function(){t(".alert_overlay").remove(),t._isload=1;var e=t.confirm.call(t,arguments[0]||"加载中，请稍后...");return t.loaded=e.close,e}}($);
        console.log("页面加载完成")
        setTimeout(()=>{
            if(document.getElementById("play") !=null && document.getElementById("play").contentWindow.document.getElementById("jp_audio_0").src !="" && document.getElementById("play").contentWindow.document.getElementById("jp_audio_0").src != undefined){
                //console.log($(".list-book-dt a").text());
                //console.log($(".content h1").text());
                //console.log(document.getElementById("play").contentWindow.document.getElementById("jp_audio_0").src);
                //获取当前页有声书播放信息
                let current = {bookName:$(".list-book-dt a").text(),bookEpisode:$(".content h1").text(),episodeUrl:document.getElementById("play").contentWindow.document.getElementById("jp_audio_0").src};
                newList.push(current)
                localStorage.setItem(storyName,JSON.stringify(Array.from(unique(newList))));
                console.log("爬取了："+JSON.parse(localStorage.getItem(storyName)).length + "集");
                if($("#nexturl")[0]){
                    setTimeout(()=>{
                        window.location=$("#nexturl")[0].href;//下一页
                    },10);
                }else{
                    alert("分析完毕,下载数据");
                    function sortData(a, b) {
                        //str.substring(str.lastIndexOf("/")).replace(str.substring(str.lastIndexOf(".")),"").replace("/","")
                        return ( (a.episodeUrl.substring(a.episodeUrl.lastIndexOf("/")).replace(a.episodeUrl.substring(a.episodeUrl.lastIndexOf(".")),"").replace("/","")) - (b.episodeUrl.substring(b.episodeUrl.lastIndexOf("/")).replace(b.episodeUrl.substring(b.episodeUrl.lastIndexOf(".")),"").replace("/","")) )
                    }
                    let myList = JSON.parse(localStorage.getItem(storyName));
                    myList.sort(sortData);
                    //将数据转为csv需要的格式
                    let csvString = [
                        ["bookName","bookEpisode","episodeUrl"],
                        ...myList.map(item => [
                            item.bookName,
                            item.bookEpisode.replace("正在播放：",""),
                            item.episodeUrl
                        ])
                    ].map(e => e.join(",")).join('\n')

                    // 导出
                    let link = document.createElement("a")
                    let exportContent = '\uFEFF'
                    let blob = new Blob([exportContent+csvString],{
                        type:'text/plain;charset=utrf-8'
                    })
                    link.id = "download-csv"
                    link.setAttribute("href", URL.createObjectURL(blob))
                    link.setAttribute('download', storyName + ".csv")
                    document.body.appendChild(link)
                    link.click()
                }
            }else if(document.getElementById("play")==null){
                //排序
                function sortData(a, b) {
                    //str.substring(str.lastIndexOf("/")).replace(str.substring(str.lastIndexOf(".")),"").replace("/","")
                    return ( (a.episodeUrl.substring(a.episodeUrl.lastIndexOf("/")).replace(a.episodeUrl.substring(a.episodeUrl.lastIndexOf(".")),"").replace("/","")) - (b.episodeUrl.substring(b.episodeUrl.lastIndexOf("/")).replace(b.episodeUrl.substring(b.episodeUrl.lastIndexOf(".")),"").replace("/","")) )
                }
                function downLoadMyListen(){
                    let myList = JSON.parse(localStorage.getItem(storyName));
                    myList.sort(sortData);
                    //将数据转为csv需要的格式
                    let csvString = [
                        ["bookName","bookEpisode","episodeUrl","bookId"],
                        ...myList.map(item => [
                            item.bookName,
                            item.bookEpisode.replace("正在播放：",""),
                            item.episodeUrl,
                            storyName.replace("tingshu","")
                        ])
                    ].map(e => e.join(",")).join('\n')

                    // 导出
                    let link = document.createElement("a")
                    let exportContent = '\uFEFF'
                    let blob = new Blob([exportContent+csvString],{
                        type:'text/plain;charset=utrf-8'
                    })
                    link.id = "download-csv"
                    link.setAttribute("href", URL.createObjectURL(blob))
                    link.setAttribute('download', storyName + ".csv")
                    document.body.appendChild(link)
                    link.click()
                }
                $.confirm("爬取分析了："+JSON.parse(localStorage.getItem(storyName)).length + "集，下载数据？",function(e){
                    //点击确定或取消后的回调函数，点击确定e = true，点击取消e = false
                    //return false 可以阻止对话框关闭
                    //this 指向弹窗对象
                    if(e){
                        downLoadMyListen();
                    }
                }).ok('下载').cancel('取消')//支持修改弹窗的按钮文字
            }else{
                alert("失败"+ 'document.getElementById("play").contentWindow.document.getElementById("jp_audio_0").src'+"\n刷新该界面");
                location.reload()
            }
        },100);
    }
})();