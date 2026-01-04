// ==UserScript==
// @name         有道云笔记多合一精简网页
// @icon         https://note.youdao.com/favicon.ico
// @version      1.0.6
// @description  去除页面周边的多余 信息,使您在有道云笔记中可以直接阅读到清爽的正文效果
// @author       王嘉乐
// @include      *
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     YNoteClipper https://note.youdao.com/yws/YNoteClipper.js?_=1596113955041
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1213222
// @downloadURL https://update.greasyfork.org/scripts/479288/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%A4%9A%E5%90%88%E4%B8%80%E7%B2%BE%E7%AE%80%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/479288/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%A4%9A%E5%90%88%E4%B8%80%E7%B2%BE%E7%AE%80%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==
//左下角按键类名
var copy_class="sidebar-collapse-content-item";

//左侧栏宽度
//var app_sidebar="app_sidebar";
var l_id="#flexible-left";
var app_sidebar_wMax=40;

//右侧顶栏&浮动高度
var HD_id="hd-space-between";
var noteHD_flex="0 0 40px";
var hdSpace={
    id:"hd-space-between",
    style:"flex: 0 0 40px"
}
//保存按钮&高度
var noteSaveBtn_id="note-save-btn";
var noteSaveBtn_top=-35;
var noteSaveBtn={
    id:"note-save-btn",
    style:"top: -35px !important;",
    remark:""
}
//编辑区
var bulbEditor={
    id:"bulb-editor",
    style:"top: 38px !important;height: calc(100% - 40px)!important;",
    remark:""
}
//隐藏列表
var listLight={
    id:"flexible-list-left",
    style:"left: 260px !important;display: none;width: 260px;",
    remark:"left: 0px !important;display: block;width: 260px;"

}
var listRight={
    id:"flexible-list-right",
    style:"left: 0px !important;display: block;",
    remark:"left: 260px !important;display: block;"
}
//列表栏-顶栏：搜索栏
var listSearch={
    class:"list-search",
    style:"height: 20px !important;width: 260px !important;",
    remark:"设定width为了，隐藏列表时，flex样式不会乱"
}
//列表栏-内容区：列表
var listBD={
    class:"list .list-bd.topNameTag",
    style:"top: 50px !important;",
    remark:""
}
//推出全屏
var eeCopy={
    id:"ee_copy",
    style:`               font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    width: 45px;
    height: 30px;
    margin-left: 4px;
    text-align: center;
    /* margin: auto; */
    /* padding-bottom: 1px; */
    /* vertical-align: middle; */
    border: none;
    border: 2px solid black;
    border-radius: 9px;
    z-index: 3;
    position: absolute;
    display:none;
    bottom: 10px;`
}
var collapseFull={
    class:"collapse-full-screen",
    style: "display: none;",
    remark:"隐藏退出全屏按钮"
}
//构建css样式
var list=[noteSaveBtn,bulbEditor,listSearch,listBD,hdSpace,eeCopy,collapseFull];
console.log(list)
function concatStyle(l){
    let str="";
    for(let i=0;i<l.length;i++){
        if(l[i].id){
            str=str+"#"+l[i].id;
        }else if(l[i].class){
            str=str+"."+l[i].class;
        }
        if(l[i].style){
            str=str+"{"+l[i].style+"}      "
        }
    }
    return str;;
}
//自定义按钮组
var r_stable=1
var r_id="#flexible-right"
var qq_copy=`<div class=`+copy_class+` id="qq_copy">
        <i class="icon-column-one" svg-icon="" svgname="view_1"><svg style="display: inline-block; width: 100%; height: 100%" role="img" class="">
            <use xlink:href="#view_1"></use>
        </svg></i>
    </div>`
var ww_copy=`<div class=`+copy_class+` id="ww_copy">
        <i class="icon-column-two" svg-icon="" svgname="view_2"><svg style="display: inline-block; width: 100%; height: 100%" role="img" class="">
            <use xlink:href="#view_2"></use>
        </svg></i>
    </div>`
var ee_copy=`<div class="note-tip editor-inside" id="ee_copy">
            保存
        </div>`
var cc=document.getElementsByClassName("detail-bd")[0];
var qq=document.createElement("div");
qq.innerHTML=`<div class="note-tip editor-inside" id="ee_copy">
            推出
        </div>`
'<div class="note-tip editor-inside" id="ee_copy">\n            保存\n        </div>'
function closeAd() {
    //移除底部（两层的）按钮
    $(".sidebar-footer").css("display","none");
    //瘦化左侧栏
    $(l_id).css("cssText","max-width: "+app_sidebar_wMax+"px;");
    $(".btn-column-two")[0].click();
    $("#hd-space-between").css("cssText","flex= 0 0 40px;");

}
//向html添加css样式
if(1){
    GM_addStyle(
        `
          /*删除左侧栏滑杆*/
          ::-webkit-scrollbar {
              display: none;
          }
          app-sidebar#flexible-left:after {
              content: "";
              flex-grow: 1;
          }
          app-sidebar#flexible-left:before {
              flex-grow: 1;
              content: "";
          }
          `
        +concatStyle(list)
    );
    //创建退出全屏按键
    var button = document.createElement("button");
    button.id = "ee_copy";
    button.textContent = ">|<";
    document.body.appendChild(button);
}







class listen{

    constructor() {

        this.observer_state=0;
        this.observer2_state=0;

        //防止，侧边栏变宽:>55px:set=55px->id:flexible-right
        this.observer = new MutationObserver((mutationRecord, mutationObserver) =>{
            if(MutationRecord.attributeName="style"){
                if(document.defaultView.getComputedStyle(
                    document.getElementById("flexible-right"),null).left.replace(/[^0-9]/ig,"")>app_sidebar_wMax
                  ){
                    $(r_id).css("cssText","left:"+app_sidebar_wMax+"px");
                }
            }
        });

        //注册监听防止，左侧栏展开列表->#flexible-left:collapse
        this.observer2 = new MutationObserver((mutationRecord, mutationObserver) =>{
            if(MutationRecord.attributeName="class"){
                if(document.getElementById("flexible-left").getAttribute("style")!="left: "+app_sidebar_wMax+"px;"){
                    $(l_id).addClass("collapse");
                }
            }
        });



    }

    start_1(){
        this.observer.observe(document.getElementById("flexible-right"), { attributes: true });
        this.observer_state=1;
    }
    start_2(){
        this.observer2.observe(document.getElementById("flexible-left"), { attributes: true });
        this.observer2_state=1;
    }
    stop_1(){
        this.observer.disconnect();
        this.observer_state=0;
    }
    stop_2(){
        this.observer2.disconnect();
        this.observer2_state=0;
    }
}

(function() {
    'use strict';
    //去网页广告
    window.onload=function (){
        var sidebarFt = document.getElementsByClassName('sidebar-ft')[0];
        sidebarFt.parentNode.removeChild(sidebarFt);

        document.getElementsByClassName('sidebar-content')[0].style.bottom = 0;
    };
    //重构页面
    window.setTimeout(e => {
        let target = document.querySelector('.main-container')
        let top = document.querySelector('.top-banner')
        top.style.zIndex = 0
        target.style.top = 0
        target.style.translation = 'all 0.5s'
    }, 100)
    //注册油猴菜单
    GM_registerMenuCommand('一键收藏', function () {
        var ydNoteWebClipperElem = document.getElementById('ydNoteWebClipper');
        if(document.getElementById('ydNoteWebClipper')) {
            document.body.removeChild(ydNoteWebClipperElem);
        }
        try {
            var YNoteClipper = GM_getResourceText('YNoteClipper');
            if(YNoteClipper) {
                new Function(YNoteClipper)();
            } else {
                var a = document.createElement('div');
                a.style.cssText = 'position: absolute;top: 10px;right: 30px;padding: 5px;border-radius: 5px;box-shadow: rgb(92, 184, 229) 0px 0px 2px; -webkit-box-shadow: rgb(92, 184, 229) 0px 0px 2px;background-color: rgba(92, 184, 229, 0.498039) !important;z-index: 999999;';
                a.innerHTML = 'Load script error!';
                document.body.appendChild(a);
                a.onclick = function() {
                    a.style.display = 'none';
                };
                setTimeout(function() {
                    a.click();
                }, 8e3);
            }
        } catch(b) {
            alert('该扩展暂不支持当前的浏览器或不支持收藏该类型https类网站');
            console.error(b);
        }
    });
    //重构页面
    var listener=new listen();

    if(1){

        //还有"DOMSubtreeModified"
        document.addEventListener("DOMNodeInserted", function (event) {
            if(1){
                $(event.target).find(".view-container").show(function(){
                    closeAd();
                    listener.start_1()
                    listener.start_2()
                    //listener.start_3()
                    document.getElementsByClassName("sidebar-collapse-footer")[0].innerHTML=qq_copy+ww_copy;

                    document.getElementById("qq_copy").onclick=()=>{
                        document.getElementsByClassName("btn-column-one")[0].click();
                        //点击全屏时显示推出按钮
                        $("#ee_copy").css("cssText","display: block;")
                    };



                    button.onclick=()=>{
                        document.getElementsByClassName("collapse-full-screen")[0].click();
                        if(r_stable==0){
                            $("#"+listLight.id).css("cssText",listLight.style);
                            $("#"+listRight.id).css("cssText",listRight.style);
                        }else{
                            $("#"+listLight.id).css("cssText",listLight.remark);
                            $("#"+listRight.id).css("cssText",listRight.remark);
                        }
                        $("#ee_copy").css("cssText","display: none;")
                    };


                    function qq_off(){
                        //$('#flexible-list-left').css({"display":"none"});
                        //$('#flexible-list-left').css("cssText","left:0px");
                        $("#"+listLight.id).css("cssText",listLight.style);
                        $("#"+listRight.id).css("cssText",listRight.style);
                        r_stable=0;
                    }
                    function qq_on(){
                        //$('#flexible-list-left').css({"display":"block"});
                        //$('#flexible-list-left').css("cssText","left:250px");
                        $("#"+listLight.id).css("cssText",listLight.remark);
                        $("#"+listRight.id).css("cssText",listRight.remark);
                        r_stable=1;
                    }
                    document.getElementById("ww_copy").onclick=()=>{
                        r_stable?qq_off():qq_on();
                    };

                })
            }

            //console.log(event.target.class)

            //alert(document.getElementById("hd-space-between"))
            //关闭和开启笔记列表
            /*
            $(event.target).find(".sidebar-collapse-footer").show(function(){
                document.getElementsByClassName("sidebar-collapse-footer")[0].innerHTML=envar.l.qq_copy+envar.l.ww_copy;
                document.getElementById("qq_copy").onclick=()=>{document.getElementsByClassName("btn-column-one")[0].click();};
                function qq_off(){
                    $('.viewport .list-detail .list').css({"display":"none"});
                    $('.viewport .list-detail .detail-container').css("cssText","left:0px");
                    envar.r.r_stable=0;
                }
                function qq_on(){
                    $('.viewport .list-detail .list').css({"display":"block"});
                    $('.viewport .list-detail .detail-container').css("cssText","left:255px");
                    envar.r.r_stable=1;
                }
                document.getElementById("ww_copy").onclick=()=>{
                    envar.r.r_stable?qq_off():qq_on();
                };
            });
            */

            //顶栏：hd-space-between#实现二
            /*
            $(event.target).find(".hd-space-between").show(function(){
                //alert("！hd-space-between：已被添加");
                $("#"+HD_id).css("cssText","flex:"+noteHD_flex);
            });
            */

            //移除广告
            $(event.target).find(".ad-close").show(function(){
                alert("！test：已删除广告");
                $("div.ad-close").click();
            });
        });

    }
})();