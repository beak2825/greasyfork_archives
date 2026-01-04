// ==UserScript==
// @name         豆瓣日记页功能优化
// @namespace    http://tampermonkey.net/
// @version      0.420
// @description  复制豆瓣日记编辑栏，互动栏，标签栏到顶部，增加侧栏，在查看/编辑界面点击可跳转到各级标题位置
// @author       lpy
// @license MIT
// @match      *://www.douban.com/note*
// @grant        none
// @connect      douban.com
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434337/%E8%B1%86%E7%93%A3%E6%97%A5%E8%AE%B0%E9%A1%B5%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434337/%E8%B1%86%E7%93%A3%E6%97%A5%E8%AE%B0%E9%A1%B5%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(
    function () {
        const COLOR = {
            "sidenavOnEdit":"#45a152",
            "sidenav":"#f7c792",
            "sidenavHidden":"#aaaaaa",
        };

        const STYLE = `
      .sns-bar{
      margin:0px;
      padding:0px;
      }

      #sidenav {
      width:300px;
      /*height:500px;*/
      background-color:#FFFFFF;
      /*border: 3px solid #f7c792;*/
      padding: 10px;
      }

      #snarea {
      position:fixed;
      bottom:40%;
      left:5px;
      }

      #sidenav a{
      margin: 2px 0px;
      /*border: 1px solid #ddd;*/
      display:block;
      }

      /*
      为不同等级的标题设置缩进
      */
      #sidenav a[header_lv="H1"]{
      font-size:160%;
      }

      #sidenav a[header_lv="H2"],a[header_lv="SPAN"],a[header_lv="DIV"]{
      padding-left: 20px;
      font-size:140%;
      }

      #sidenav a[header_lv="H3"]{
      padding-left: 40px;
      font-size:120%;
      }

      #sidenav a[header_lv="H4"]{
      padding-left: 60px;
      font-size:110%;
      }

      #sidenav a[header_lv="H5"]{
      padding-left: 80px;
      }

      /*隐藏按钮*/
      #hidebtn {
      height: 10px;
      width: 10px;
      border: 5px solid #aaaaaa;
      }
    `;
        function loadStyle(){
            let style = $("<style></style>").attr("type","text/css").html(STYLE);
            style.appendTo($(document.head));
        };

        function bottombarToTop(){
            'use strict';
            $(".note-footer-stat").clone().css({"margin":"5px 0px"}).appendTo($(".pub-date"));
            $(".mod-tags").css({"overflow":"hidden"});
            $(".mod-tags").clone().appendTo($(".pub-date"));
            $(".mod-tags").find("a").css({"float":"left"});
            $(".sns-bar").clone().appendTo($(".pub-date"));
        };

        function sideNav(isOnEdit){
            let navArea = $("<div></div>").attr("id","snarea");
            navArea.appendTo($(document.body));
            let nav = $("<div></div>").attr("id","sidenav");
            /*注意运算顺序
            console.log("3px solid "+ (isOnEdit?COLOR.sidenavOnEdit:COLOR.sidenav));
            */
            nav.css("border","3px solid "+ (isOnEdit?COLOR.sidenavOnEdit:COLOR.sidenav));
            nav.appendTo($("#snarea"));
            //编辑页侧边栏行为
            if(isOnEdit){
                let isNavInit = true;
                $("#content").on("focus keyup",".article",function(e){
                    //指定刷新的触发事件
                    //用blur的时候会和侧栏点击事件冲突，故删除
                    refresh(e);
                    jump(isOnEdit);
                    if(isNavInit == true){
                        sidenavPostProcess();
                        isNavInit = false;
                    }
                });

                function refresh(e){
                    //拆分出的刷新方法
                    $("#sidenav").empty();
                    //  获取事件对象，将target转换为jquery对象
                    let headers = $(e.target).find(":header,.DRE-draggable");
                        for (let header of headers){
                            let jqHeader = $(header);
                            let title;
                            switch(jqHeader.attr("class")){
                                    //  case判断的已经是class名了所以没有.
                                case "DRE-draggable" :
                                    title = jqHeader.find(".DRE-subject-title").children().text();
                                    break;
                                default :
                                    title = jqHeader.find("[data-text=true]").text();
                            }
                            let slot = $("<a></a>").text(title);
                            slot.attr("header_lv",jqHeader.prop("tagName"));
                            slot.appendTo($("#sidenav"));
                        }
                 };
            }

            //浏览页侧边栏行为
            else{
                //  用find复合查询，避免拼接
                let headers = $(".note").find(".title-text,:header");

                for (let header of headers){
                    let jqHeader = $(header);
                    let slot = $("<a></a>").text(jqHeader.text());
                    //  prop方法可用于检索DOM的对象属性值
                    slot.attr("header_lv",jqHeader.prop("tagName"));
                    slot.appendTo($("#sidenav"));
                }
                sidenavPostProcess();
                jump(isOnEdit);
            }

        };

        function jump(isOnEdit){
            //  跳转方法，点哪个子元素就传哪个
            $('#sidenav').on('click','a',function f(e){
                let target = $(e.target);
                let title = target.text();
                target.off(e.type);
                let jumper = isOnEdit?
                    $(".DRE-subject-info").add(":header").find(":contains("+title.trim().replace(/《|》/g,"")+")").last():
                    $(".note").find(":contains("+title.trim().replace(/《|》/g,"")+")").filter(":header,.title-text").last();
                //  滚动跳转
                /* little tip:
                    .stop() animation before playing another.
                    check max and min value of scroll
                */
                $('html,body').stop().animate({scrollTop:jumper.offset().top - 250}, "fast");
                $(target).on(e.type,f);
            });
        };

        function sidenavPostProcess(){
            //  动态调整上下位置
            $("#snarea").css({"bottom":(parseInt($("#snarea").css("bottom").slice(0,-2))-$("#sidenav").height()/2)+"px"});
        };

        function hideBtn(isOnEdit){
            let btn = $("<div></div>").attr("id","hidebtn");
            $("#snarea").prepend(btn);
            $('#hidebtn').on('click',function(e){
                if($("#sidenav").is(":visible")){
                    let pos = $("#snarea").position().top;
                    //是offset()而不是offset,offset取不到值的
                    $("#sidenav").hide();
                    let bdc = "";
                    if(isOnEdit){bdc = COLOR.sidenavOnEdit}
                    else{bdc = COLOR.sidenav}
                    $('#hidebtn').css({"border-color":bdc});
                    $('#snarea').css({"top":pos,"bottom":undefined});
                }
                else{
                    $("#sidenav").show();
                    $('#hidebtn').css({"border-color":COLOR.sidenavHidden});
                }
            })
        };

        function sleep(time){
            return new Promise((resolve) => setTimeout(resolve, time));
        };

        /*Main*/
        loadStyle();
        bottombarToTop();
        let isOnEdit = /edit/.test(window.location.href)||/create/.test(window.location.href)?true:false;
        sideNav(isOnEdit);
        hideBtn(isOnEdit);
    }
)();