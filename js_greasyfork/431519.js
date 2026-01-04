// ==UserScript==
// @name         Bilibili视频观看历史记录
// @namespace    Bilibili-video-History
// @version      1.3.9-temp
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @resource toastr_js  https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource toastr_css https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @grant        GM_getResourceText
// @description  记录并提示Bilibili已观看或已访问但未观看视频记录
// @author       DreamNya
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/v/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/account/history
// @match        https://www.bilibili.com/watchlater/*
// @match        https://search.bilibili.com/*
// @match        https://www.bilibili.com/medialist/play/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431519/Bilibili%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431519/Bilibili%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
/* globals
jQuery, $,
__INITIAL_STATE__,
toastr
*/
/* eslint no-eval:0 */

/*
前言：
1、本脚本纯原创，编写之前已尽全力搜索但未找到相似功能脚本，求人不如求自己，故自己动手编写此脚本。
2、作者本人非码农纯小白，没有系统学习过代码，所有代码纯靠baidu自学，此脚本代码可能存在诸多不合理之处。
2.5、由于懒得想变量名、函数名、故直接使用中文为主、英文为辅的变量名、函数名（随心所欲，气死不负责）
3、本脚本使用了Tampermonkey（油猴）内置函数，完全依赖Tampermonkey，仅在Chromium+Tampermonkey v4.14版本测试正常使用，其余环境均未进行测试。
4、如发现各种问题或BUG欢迎与作者联系。
5、本脚本仅记录普通视频观看记录，番剧、直播、漫画等不在脚本记录对象范围内。
6、本脚本主要是自用，其次是练手写写JS，最后才是发布分享，不保证后续更新。

免责声明：
本脚本完全免费、开源。作者不保证脚本不存在bug。如使用本脚本时因bug、使用不当等原因引起的任何损失、纠纷需用户自行承担，否则请勿使用本脚本。

原理：
通过Tampermonkey内置函数记录观看信息；使用jQuery每秒读取页面元素比对已记录观看信息返回观看记录结果。
（就这么简单，但我从来没见其他人做过。）
所有存储信息均保存在本地（准确来说是Tampermonkey存储目录），如换浏览器、换电脑后仍想保留之前观看记录需要自行备份导出导入存储信息（Tampermonkey自带的云同步似乎也可以自动做到）。

功能：
1、记录Bilibili已观看或已访问记录（包括观看类型、观看时长、观看百分比、观看时间、视频标题）
2、在视频页提示详细观看记录（第一次访问不会提示，仅在第二次访问后在视频页左下角进行提示）
2.5、左下角提示标签右键单击则直接删除本条观看记录，左键单击则直接跳转播放上次观看进度（已访问则无效果）
3、在首页、分区、UP主视频空间内实时提示简略观看记录（仅提示已观看+观看百分比或已访问。）
(4)、如配合【Bilibili Evolved】亦可在关注动态中提示简略观看记录

已知问题：
暂无

更新计划：
增加脚本可视化操作面板，开放部分自定义设置功能，开放历史记录列表（目前仅能从Tampermonkey脚本-存储中手动查看）（计划下个版本更新）

更新记录：
V1.3.9-temp(2022-8-7)
a.更新视频内BV对比适配
b.新增显示进度条功能（测试功能，多P不显示，如不需要可以将代码中【const 显示进度条=true;】替换为【const 显示进度条=false;】）

V1.3.8-temp(2022-7-31)
a.修复jQuery BUG

V1.3.7-temp(2022-7-31)
a.优化视频内BV对比
b.优化jQuery引入方式以解决评论区冲突

V1.3.6-temp(2022-7-28)
a.现在直接关闭浏览器也能正常记录播放信息了
b.优化视频页匹配规则（B站界面不断在更新，脚本随时可能失效、不兼容）
c.测试toastr(凑合用)

V1.3.5-temp(2022-7-26)
a.适配2022.7.26 bilibili新版界面（B站界面不断在更新，脚本随时可能失效、不兼容）
b.优化BV对比

V1.3.4-temp(2022-7-24)
a.隐藏debug用弹窗

V1.3.3-temp(2022-7-23): 临时性更新，修复bug，目前无暇维护，代码写了一半，很多没完善，原定的正式更新又要咕2~3周了
a.支持稍后观看页面 //更新后失效 暂时废弃
b.支持视频内推荐视频记录对比 //不太稳定，可能随时失效
c.引入toaster替换原有view标签 //未正式启用
d.修复多P正则替换bug
e.更新css适配新版界面
f.修复bug

V1.3.2-temp（2022.7.2）
a.临时性更新，进一步优化记录观看时间
b.优化代码css，提高兼容性
（本脚本更新周期可能会非常长，但不会放弃。
预计下次正式更新大概率为7月中下旬，计划有一波大更新，需要重写大量代码）

V1.3.1-temp（2022.7.1）
a.临时性更新，适配新版B站播放器，现在能够正常记录观看时间
b.修复跳转页面未传参bug，优化逻辑
（css问题由于作者工作繁忙，无暇维护，目前只能凑合使用。
本脚本更新周期可能会非常长，但不会放弃。
预计下次正式更新大概率为7月中下旬，计划有一波大更新，需要重写大量代码）

V1.3(2022-2-19):
a.重写大量代码（原本准备发布的代码丢失 被迫重写…… 写着写着发现 咦 这里竟然可以重新改进），优化逻辑
    setInterval改写为setTimeout嵌套，取消原600秒显示限制，现无显示上限
    优化小标签代码、CSS（计划下个版本可自定义小标签内容）
    优化MutationObserver代码，现在能准确判断及记录单页内跳转后的观看信息
    将原先1000ms判断一次小标签改为3000ms（计划下个版本可自定义判断间隔），防止原先偶尔出现无法加载评论区与视频推荐bug（经查明本脚本与官方stardust.js冲突，具体原因未查明（stardust.js被混淆了 懒得逆向=-=））
b.适配发布时新版UI、Bilibili Evolved V2.1.4

V1.2(2021-10-5):
a.脚本现在支持搜索页面
b.优化小标签代码
c.新增多P小标签信息提示（现在悬浮在小标签上会显示所有分P观看信息）
d.修复观看百分比计算bug及观看时间跳转bug
e.修复偶尔不记录观看信息bug（可能仍存在问题）
f.若干细小优化

V1.1(2021-9-4):
a.修复视频选集bug
b.增加视频选集多P独立观看信息记录
c.现在bilibili视频页内点击相关视频跳转页面也能正常记录观看信息了（*感谢DevSplash大佬提供的方法）
d.若干细小优化
e.更换jQuery CDN

v1.0(2021-8-28):
a.首次公开发布
*/

const 显示进度条=true;//测试中，false为隐藏
const debug=true;
GM_addStyle (`
.BvH-tag{position: absolute;margin: .5em!important;padding: 0 5px!important;height: 20px;line-height: 20px;border-radius: 4px;color: #fff;font-style: normal;font-size: 12px;background-color: rgb(122 134 234 / 70%);z-index:108;}
.BvH-tag-small{margin: .2em!important;padding: 0 4px!important;height: 18px;line-height: 18px;;font-size: 10px;}
.BvH-tag-big{height: 22px;line-height: 23px;font-size: 14px;}
.BvH-progress-bar{background: rgb(255 54 54);z-index: 108;position: absolute;height: 4px;bottom: 0px;border-bottom-left-radius: inherit;border-bottom-right-radius: inherit;}
`);

if(typeof unsafeWindow.jQuery == "undefined"){
    unsafeWindow.$=$;
}

if(localStorage.BvHonbeforeunload){ //读取上次关闭页面时的记录并重新储存到油猴中
    let tempValue=JSON.parse(localStorage.BvHonbeforeunload)
    GM_setValue(tempValue.key,tempValue.value)
    localStorage.removeItem("BvHonbeforeunload")
}

let record_p=GM_listValues().filter(i=>i.indexOf("?p=")>-1);
let startTime=new Date().getTime()
function 视频页初始化(){
    console.log("脚本开始加载")
    !function 等待页面加载(){
        if(typeof __INITIAL_STATE__ !="undefined" && __INITIAL_STATE__.videoData && $("#bilibili-player video,bwp-video").length>0){
            console.log("BvH debug: 加载成功")
            eval(GM_getResourceText("toastr_js").replace("window.jQuery","jQuery").replace("window.toastr","unsafeWindow.toastr")); //引入toastr.js
            GM_addStyle(GM_getResourceText("toastr_css").replace(/width\: 300px\;/g,"")); //引入toastr.css 并修改
            toastr.options = {//toastr配置，暂时凑合用
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-bottom-left",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            main()
        }else{
            let now=new Date().getTime()
            let diff=now-startTime
            if(diff>10000){
                console.log("BvH debug: 等待页面加载超时"+unsafeWindow.location.href)
                toastr.error(`脚本加载失败 等待页面加载超时
`+unsafeWindow.location.href, "Bilibili视频观看历史记录")
            }else
            {
                setTimeout(等待页面加载,100)
            }
        }
    }()
}

function main(){
    function 获取cid(){
        return __INITIAL_STATE__.videoData.pages[__INITIAL_STATE__.p-1].cid
    }
    let info=__INITIAL_STATE__
    let videoData=info.videoData
    let page=info.p
    let _cid=videoData.pages[page-1].cid
    let 标题=videoData.title
    let pages=videoData.pages
    if(pages.length>1){
        标题+="_"+pages[page-1].part
    }
    let BV,BV记录,BV类型,BV时间,页面类型,观看时长,总时长,观看百分比
    let mark=$("#bilibili-player video,bwp-video")[0].currentTime>0?true:false
    let 当前页面=unsafeWindow.location.href
    let 跳转标记=true
    let video_src
    let uuid=function (){ //随机标识符 debug用
        let random_string="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        let result=""
        for (let i=0;i<5;++i){
            result += random_string.charAt(Math.floor(Math.random() * random_string.length))
        }
        return result
    }()
    toastr.success("脚本加载成功", "Bilibili视频观看历史记录")
    获取当前页面()
    if(debug){
        console.log("BvH debug:"+unsafeWindow)
        console.log("BvH debug:"+BV)
    }

    (页面类型=="video" || 页面类型=="medialist") && BV && 调用播放页面函数()


    function 调用播放页面函数(){
        if(BV类型){
            views(BV类型,观看时长,观看百分比,BV时间,BV)
        }else{
            GM_setValue(BV,["已访问",,,time(),标题])
        }

        let 播放绑定计时器=setInterval(()=>{
            if($("#bilibili-player video,bwp-video").length>0){
                console.log("BvH log:已绑定")
                clearInterval(播放绑定计时器)
                video_src=$("#bilibili-player video,bwp-video").attr("src")
                if($("#bilibili-player video,bwp-video")[0].currentTime>"0.001" && mark==false){
                    console.log("BvH Error:$(\"bwp-video[src]\")[0].currentTime"+$("#bilibili-player video,bwp-video")[0].currentTime+" "+mark.toString())
                    mark=true
                }
                $("#bilibili-player video,bwp-video").on("ended",()=>{
                    setTimeout(视频内BV对比初始化,100)
                })

                $("#bilibili-player video,bwp-video").on('play',()=>{
                    记录观看(`$("#bilibili-player video,bwp-video")`)
                })
            }
        },100)

        mark && 记录观看("if(mark)")


        unsafeWindow.onbeforeunload = function () {
            console.log("BvH log:onbeforeunload"+BV类型)
            switch(BV类型){
                case "已观看":
                    mark && 记录观看("onbeforeunload",true)
                    break
                case "已访问":
                    BV && GM_setValue(BV,["已访问",,,time(),标题])
                    break
                case "已删除":
                    break
                default:
                    console.log("BvH onbeforeunload Error:"+BV类型)
            }
        }
        let duration
        let current
        let observer = new MutationObserver(function (m) {
            m.forEach(function(e){
                let target_className=e.target.className
                if(target_className=='bpx-player-ctrl-time-duration' ||target_className=='bpx-player-ctrl-time-current'){
                    e.removedNodes.forEach(function(ee){
                        if(target_className=='bpx-player-ctrl-time-duration' && ee.data!="00:00"){
                            duration=ee.data
                        }
                        if(target_className=='bpx-player-ctrl-time-current'){
                            current=ee.data
                        }
                        if(duration && current && video_src!=$("#bilibili-player video,bwp-video").attr("src")){
                            if(BV类型=="已观看" && mark==true && BV){
                                观看时长=current
                                总时长=duration
                                观看百分比=Math.round(观看时长.split(":").reverse().map((item,index)=>(item*=Math.pow(60,index))).reduce((total,item)=>(total+=item))/总时长.split(":").reverse().map((item,index)=>(item*=Math.pow(60,index))).reduce((total,item)=>(total+=item))*100)+"%"
                                GM_setValue(BV,[BV类型,观看时长,观看百分比,time(),标题])
                            }
                            current=null
                            duration=null
                            console.log("BvH log:LINK START")
                            $("#view").remove()
                            跳转标记=false
                            observer.disconnect()

                            !function 跳转判断(旧页面){
                                if(/((BV|bv)[A-Za-z0-9]+(\?p=[0-9]+)?)|(av\d+(\?p=[0-9]+)?)/g.exec(unsafeWindow.location.href)[0].replace(/\?p\=1$/,"")==旧页面){
                                    setTimeout(()=>{
                                        跳转判断(旧页面)
                                    },100)
                                    console.log("BvH log:link link")
                                }else{
                                    console.log("BvH log:LINK END")
                                    main(false)
                                }
                            }(BV)
                        }
                    })
                }
            })
        })

        let 播放器绑定=setInterval(()=>{
            if($("#bilibili-player").length>0){
                clearInterval(播放器绑定)
                observer.observe($("#bilibili-player")[0], {
                    childList: true,
                    subtree: true
                })
            }
        },100)

        //随时可能失效
        function 视频内BV对比初始化(){
            if(!$(".rec-list div:first")[0].__vue__){
                console.log("BvH error:$(\".rec-list div:first\")[0].__vue__")
                return
            }

            let elements=$(".bpx-player-ending-related-item-img")
            if(elements.length==0){
                setTimeout(视频内BV对比初始化,100)
                return
            }

            let images=[]
            elements.each(function(){
                images.push($(this).css("background-image").match(/archive\/(.+?)\./)[1])
            })
            let selector=$("#reco_list")[0].__vue__.$children

            let 视频内BV=images.map(image=>selector.find(item=>item.imgUrl.includes(image)).link.match(/BV[0-9a-zA-Z]+/)[0])

            console.log(视频内BV)
            !function 视频内BV对比(){
                视频内BV.forEach((href,index)=>{
                    let text=GM_getValue(href)
                    let href_p=record_p.filter(item=>(item.indexOf(href)>-1))
                    if(text){
                        href_p.unshift(href)
                    }else if(href_p.length>0){
                        text=GM_getValue(href_p[0])
                    }

                    let 状态,百分比,时间,文本,多P

                    if(text){
                        状态=text[0]
                        百分比=text[2] || ""
                        时间=text[3]
                        文本=href_p.length>1 ? "已记录 多P" : 状态+百分比
                    }

                    let selector=$(".bpx-player-ending-related-item-img").eq(index).prev()
                    if(selector.hasClass("BvH-tag-big")==true){
                        if(selector.text()!=文本){ //判断小标签内容
                            selector.prev().hasClass("BvH-progress-bar") && selector.prev().remove()
                            selector.remove() //不同则删除，后续重新添加
                        }else{
                            return //相同则返回
                        }
                    }

                    if(!text){
                        return
                    }

                    if(href_p.length>1){ //多P
                        多P=true
                        时间+=(href_p[0].indexOf("?")>-1?" "+href_p[0].split("?")[1].replace("=","").replace("p","P")+" ":" P1 ")+状态+百分比
                        href_p.splice(0,1)
                        href_p.forEach(item=>{
                            let item_value=GM_getValue(item)
                            item_value[2]=item_value[2] || ""
                            时间+=("&#10;"+item_value[3]+" "+item.split("?")[1].replace("=","").replace("p","P")+" "+item_value[0]+item_value[2])
                        })
                    }

                    let img=$(".bpx-player-ending-related-item-img").eq(index)
                    img.before(小标签(文本,时间,"BvH-tag BvH-tag-big"))
                    if(百分比 && 显示进度条 && 多P!=true){
                        let progressWidth=百分比.split("%")[0]>3?百分比:"3%"
                        let progressDiv=`<div class="BvH-progress-bar" style="width:${progressWidth};"></div>`;
                        img.prev().before(progressDiv)
                    }
                })
                跳转标记==true && setTimeout(视频内BV对比,3000)
            }()
        }
    }

    function 记录观看(来源,final=false){
        观看时长=$(".bilibili-player-video-time-now").text() || $(".bpx-player-ctrl-time-current").text()
        总时长=$(".bilibili-player-video-time-total").text() || $(".bpx-player-ctrl-time-duration").text()
        观看百分比=Math.round(观看时长.split(":").reverse().map((item,index)=>(item*=Math.pow(60,index))).reduce((total,item)=>(total+=item))/总时长.split(":").reverse().map((item,index)=>(item*=Math.pow(60,index))).reduce((total,item)=>(total+=item))*100)+"%"
        mark=true
        BV类型="已观看"
        console.log("BvH log:已观看"+来源+mark.toString())
        if(final && BV){
            let value=[BV类型,观看时长,观看百分比,time(),标题]
            localStorage.setItem("BvHonbeforeunload",JSON.stringify({key:BV,value:value})) //直接关闭浏览器时GM_setValue无效，猜测插件比页面先关闭，增加一个localStorage存储，下次运行脚本时读取
            GM_setValue(BV,value)
        }
    }
    function 获取当前页面(_BV){
        BV=__INITIAL_STATE__.bvid+(__INITIAL_STATE__.p>1?`?p=${__INITIAL_STATE__.p}`:"")
        unsafeWindow.BV=BV
        BV记录=GM_getValue(BV)
        if(BV记录){
            BV类型=BV记录[0]
            观看时长=BV记录[1]
            观看百分比=BV记录[2]
            BV时间=BV记录[3]
        }
        页面类型=getBV(当前页面,3)
        //标题=document.title
        if(_BV){
            调用播放页面函数()
        }
    }

    function views(BV类型_,观看时长,观看百分比,BV时间,BV号){
        let 时长
        if (观看时长){
            时长=`<br>${观看时长}(${观看百分比})`
                BV号=BV号+"&#10;左键单击跳转视频播放进度&#10;右键单击删除视频记录信息"
        }else{
            时长=``
            BV号=BV号+"&#10;右键单击删除视频记录信息"
        }
        $("body").append(`<div id="view" title=${BV号} style="position:fixed;bottom:15px;left:15px;text-align:center;border-left:6px solid #2196F3;background-color: #aeffff;font-family:'Segoe UI','Segoe','Segoe WP','Helvetica','Tahoma','Microsoft YaHei','sans-serif';font-weight:666">
        <p style="margin:5px 10px 5px 10px">${BV类型_}${时长}</p>
        <p style="margin:0 10px 5px 10px">${BV时间.split(" ")[0]}<br>${BV时间.split(" ")[1]}</p>
        </div>`)
        if (观看时长){
            $("#view").on("click",()=>{
                if($("#bilibili-player video,bwp-video").length>0){
                    let video=$("#bilibili-player video,bwp-video")[0]
                    video.currentTime=观看时长.split(":").reverse().map((item,index)=>(item*=Math.pow(60,index))).reduce((total,item)=>(total+=item))
                    video.play()
                }
            })
        }
        $("#view").bind("contextmenu", ()=>{
            return false
        })
        $("#view").mousedown(function(e){
            if(e.which==3){
                GM_deleteValue(BV)
                BV类型="已删除"
                $(this).html($(this).html().replace(/已访问|已观看/,"已删除"))
            }
        })
    }

}
function time(){
    let d=new Date()
    return [d.getFullYear(),check(d.getMonth()+1),check(d.getDate())].join('-')+' '+[check(d.getHours()),check(d.getMinutes()),check(d.getSeconds())].join(':')
}

function check(val) {
    return val < 10 ? "0" + val : val
}

function getBV(path,num){
    return path.split("/")[num]
}

function 小标签(text,title,_class="BvH-tag"){
    return `<div title="${title}" class="${_class}">${text}</div>`
    }

function BV对比(){
    $("a[href]").filter(function(){
        if(/((BV|bv)[A-Za-z0-9]+(\?p=[0-9]+)?)|(av\d+(\?p=[0-9]+)?)/.test($(this).attr("href"))){
            return ($(this).find("img").length>0 || $(this).find(".bili-dyn-card-video__cover").find(".bili-awesome-img").length>0) && $(this).parents(".list-box").length==0 && $(this).find(".bili-avatar").length==0
        }
    }).each(function(){
        let href=$(this).attr("href").match(/((BV|bv)[A-Za-z0-9]+(\?p=[0-9]+)?)|(av\d+(\?p=[0-9]+)?)/)[0].replace(/\?p=1$/,"")
        let text=GM_getValue(href)
        let href_p=record_p.filter(item=>(item.indexOf(href.replace(/\?p=[0-9]+/,""))>-1))
        if(text){
            href_p.unshift(href)
        }else if(href_p.length>0){
            text=GM_getValue(href_p[0])
        }

        let 状态,百分比,时间,文本,多P

        if(text){
            状态=text[0]
            百分比=text[2] || ""
            时间=text[3]
            文本=href_p.length>1 ? "已记录 多P" : 状态+百分比
        }
        if($(this).find(".BvH-tag").length>0){
            if($(this).find(".BvH-tag").text()!=文本){ //判断小标签内容
                $(this).find(".BvH-tag").remove() //不同则删除，后续重新添加
                $(this).find(".BvH-progress-bar").remove()
            }else{
                return //相同则返回
            }
        }

        if(!text){
            return
        }

        if(href_p.length>1){ //多P
            多P=true
            时间+=(href_p[0].indexOf("?")>-1?" "+href_p[0].split("?")[1].replace("=","").replace("p","P")+" ":" P1 ")+状态+百分比
            href_p.splice(0,1)
            href_p.forEach(item=>{
                let item_value=GM_getValue(item)
                item_value[2]=item_value[2] || ""
                时间+=("&#10;"+item_value[3]+" "+item.split("?")[1].replace("=","").replace("p","P")+" "+item_value[0]+item_value[2])
            })
        }

        let img=$(this).find("img:first")
        if(img.length>0){
            img.before(小标签(文本,时间, "BvH-tag"+($(this).find("img:first").prop("width")<83 ? " BvH-tag-small" : ""))) //图片较小时使用small小标签防止断行
        }else{
            img=$(this).find(".bili-dyn-card-video__cover").find(".bili-awesome-img")
            img.before(小标签(文本,时间, "BvH-tag"))
        }

        if(百分比 && 显示进度条 && 多P!=true){ //进度条功能
            let progressWidth=百分比.split("%")[0]>3?百分比:"3%"
            let progressDiv=`<div class="BvH-progress-bar" style="width:${progressWidth};"></div>`;
            if($(this).find(".bili-video-card__stats").length>0){
                $(this).children().eq(0).prepend(progressDiv)
            }else{
                img.before(progressDiv)
            }
        }
    })
    setTimeout(BV对比,3000)
}
setTimeout(BV对比,3000);
unsafeWindow.location.href.match(/((BV|bv)[A-Za-z0-9]+(\?p=[0-9]+)?)|(av\d+(\?p=[0-9]+)?)/) && 视频页初始化();