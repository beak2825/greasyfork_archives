// ==UserScript==
// @name         epubjsgood
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  改善calibre-web版epubjs阅读器的使用，记住字体放大程度、背景颜色；显示进度和章节
// @author       You
// @match        http://yousite:8083/read/*
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/416793/epubjsgood.user.js
// @updateURL https://update.greasyfork.org/scripts/416793/epubjsgood.meta.js
// ==/UserScript==
// @license      MIT
(function () {
    'use strict';
    var that = reader.book;
    var rdt = reader.rendition;
    var chapter="";
    var flag=false;
    var navheight=0;
    //reader.rendition.themes.fontSize('1.2em');
    /*GM_addStyle (`
    #divider.show {
      display: block;
    }
    `);*/
    //document.getElementsByClassName("show")[0].style.visibility="hidden";//在这里是找不到的，因为还没有被设置，会报错
    //document.getElementById("divider").id="divider2"//直接把该容易的id改掉，就不会有中间的竖线
    //document.getElementById("divider").style.visibility="hidden"



    var divshow = $(".md-content");
    //divshow.text("");// 清空数据
    divshow.append('<div><p><span class="label">字体：</span><span class="setting smaller">缩小</span><span class="setting larger">放大</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id="labelfont"></span></p></div>');
    divshow.append('<div><p><span class="label">背景：</span><span class="setting black">淡黄</span><span class="setting white">橄榄</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="label">分隔：</span><span class="setting showline">显示</span><span class="setting hideline">隐藏</span></p></div>');
    //divshow.append('<div><p><span class="label">背景</span><span class="setting black">淡黄</span><span class="setting white">橄榄</span></p></div>');

    var panelshow = $("#panels");
    //divshow.text("");// 清空数据
    panelshow.append('<a id="locatemychapter" class="show_view icon-edit">loc</a>');


    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("modal .label{  font-weight: bold;  width: 150px;  border: none;}.modal span{  padding: 0 10px;  display: inline-block;  width: 50px;}.modal span:nth-child(2){  border-right: 1px solid #ccc;}.modal span:nth-child(5){  border-right: 1px solid #ccc;}.modal .setting{  cursor: pointer;}.setting:hover{  color: #FCC;}.modal .smaller{  font-size: 100%;}.modal .larger{  font-size: 100%;}.modal p{  border-bottom: 1px solid #ccc;  -webkit-touch-callout: none;  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    //定义获取章节的函数
    function getchapter(locationCfi) {
       var tmpchapter=chapter;
       try {
           //let locationCfi = reader.rendition.currentLocation().start.cfi;
           let spineItem = reader.book.spine.get(locationCfi);
           let navItem = reader.book.navigation.get(spineItem.href);
           if (navItem.label!="") {
               tmpchapter=navItem.label.replace(/[\r\n]/g,"");//去除回车，章节的主题
           }
           else {
               tmpchapter=chapter.replace(/[\r\n]/g,"");//去除回车,最初的主题，一般是作者
           }
       } catch(error) {
           console.log("获取不到章节名称:"+error.message);
       }
       return tmpchapter;
    }

    //每两秒更新一次章节和进度
    //setInterval(function(){
    function updateprogess(){
            var part1=""
            var part2="";
            try {
                part1=getchapter(reader.rendition.currentLocation().start.cfi);//获取章节名称
            } catch(error) {
                console.log("cfi获取失败",error.message)
            }
            if (navheight==0) {
                //reader.SidebarController.show()
                //$("#tocView").scrollTop(10000000)
                //navheight=$("#tocView").scrollTop()
                //$("#tocView").scrollTop(0)
                //console.log(navheight)
                //reader.SidebarController.hide()
            } //else
/*            {
                $("#tocView").scrollTop(parseInt(navheight*0.55))
                console.log("定位测试")
            }*/

            try {
                var progress=0
                if (flag) {
                    //实时进度版，速度慢
                    var lct = reader.book.locations
                    var currentLocation = reader.rendition.currentLocation();
                    progress = Math.floor(((lct.percentageFromCfi(currentLocation.start.cfi)).toFixed(5)) * 10000) / 100;
                }
                else {

                    //简化版，速度快,适应性差
                    var lct2=reader.rendition.currentLocation().start.index
                    var total2=0
                      var i=0
                      for (i = 0; i < (reader.book.navigation.toc.length-1); i++) {
                        total2=total2+reader.book.navigation.toc[i].subitems.length+1
                      }

                    total2=reader.book.navigation.toc.length
                    progress = Math.floor(((lct2/total2).toFixed(5))*10000)/100;
                }
                    if (progress>100) {progress=100}

                    part2='[' + progress + '%]';
                    //console.log(navheight*progress)

                
            } catch(error) {
                console.log("进度计算失败:"+error.message);
            }
            $("#chapter-title")[0].innerText = part1+part2;
      }
    //每两秒更新一次章节和进度
    setInterval(function(){
        updateprogess();
    }, 2000);
//**********************


    reader.rendition.hooks.content.register(function(contents, view) {
        updateprogess();
    })



    $(document).ready(function () {
         function locatemychapter() {
            //$("#tocView").scrollTop(parseInt(800+navheight*parseFloat(reader.rendition.location.start.percentage)))
             //console.log(reader.rendition.location.start.percentage);
           /*
           以下为定位到当前位置,与进度配合使用，感觉不如直接按要求定位方便
           let locationCfi = reader.rendition.currentLocation().start.cfi;
           let spineItem = reader.book.spine.get(locationCfi);
		   let lcttoc=reader.book.navigation.tocByHref[spineItem.href]
           let lctclass="#toc-"+reader.book.navigation.toc[lcttoc].id
           let mainContainer = $('#tocView');
           let scrollToContainer = mainContainer.find(lctclass);
           mainContainer.animate({scrollTop: scrollToContainer.offset().top -100- mainContainer.offset().top + mainContainer.scrollTop()}, 500);
           scrollToContainer[0].children[0].style.color="red"*/

           //*************改写为按指定位置定位
           var target=prompt()
		   let lcttoc=reader.book.navigation.toc[target]
           let lctclass="#toc-"+reader.book.navigation.toc[target].id
           let mainContainer = $('#tocView');
           let scrollToContainer = mainContainer.find(lctclass);
           mainContainer.animate({scrollTop: scrollToContainer.offset().top -100- mainContainer.offset().top + mainContainer.scrollTop()}, 500);
           scrollToContainer[0].children[0].click()


           //alert(lctclass)
         }

        function setFontSize(amount) {
            reader.rendition.themes.fontSize(amount);
             document.getElementById("labelfont").innerHTML=amount
         }
         function changeFontSize(amount) {
            var p_value=GM_getValue("myfontsize", "1.2");
            var valuenew=Math.round((parseFloat(p_value)+amount)*100)/100
            if (valuenew<=0.8) {valuenew=0.8}
            if (valuenew>=1.6) {valuenew=1.6}
            reader.rendition.themes.fontSize(valuenew+"em");
           document.getElementById("labelfont").innerHTML=valuenew+"em"
           GM_setValue("myfontsize", valuenew)
         }
         function changeBackgroundColor(color) {
            //reader.book.settings.styles['backgroundColor'] =color;
            //reader.book.settings.styles['color'] = color;
            $('#main').css('background-color', color);
            //reader.book.render.applyStyles();
           GM_setValue("mycolor", color)
         }
         function changelinestate(linestate) {
           document.getElementById("divider").style.visibility=linestate
           GM_setValue("mylinestate", linestate)
         }

         $('span.smaller').click(function() { changeFontSize(-0.1); });
         $('span.larger').click(function() { changeFontSize(0.1); });
         $('span.black').click(function() { changeBackgroundColor("#F6F4EC"); });
         $('span.white').click(function() { changeBackgroundColor("#E1E6D7"); });
         $('span.showline').click(function() { changelinestate(""); });
         $('span.hideline').click(function() { changelinestate("hidden"); });

        $('a.icon-edit').click(function() { locatemychapter(); });//绑定定位位置

        var valuenow=GM_getValue("myfontsize", "1.2");
        setFontSize(valuenow+"em");
        //changeFontSize(GM_getValue("myfontsize", "1em"));
        changeBackgroundColor(GM_getValue("mycolor", "#ffffff"));
        changelinestate(GM_getValue("mylinestate", ""));
        //左侧菜单栏的panel会挡住一部分滚动条，用这条语句设置后不会挡
        document.getElementById("panels").style.width="280px"
        document.getElementById("tocView").style.height="95%"


            that.ready.then(() => {
                try {
                chapter=$("#chapter-title")[0].innerText;//获取默认章节要在此处理


                } catch(error) {console.log("获取不到chapter:"+error.message);}
                console.log("初始化定位开始，千章可能要10分钟");
                return that.locations.generate()
            }).then(result => {
                console.log("初始化定位完成");
                //$("#tocView ul").children("li").each(function(){navheight = navheight + $(this).outerHeight(true);});
                //console.log(navheight);
                flag=true
        })
    });
})();