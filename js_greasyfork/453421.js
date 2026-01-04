// ==UserScript==
// @name         随意拖拽DOM元素
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  网页上元素这么多，你不想像堆积木一样拖着玩玩看吗，该脚本在页面加载一个悬浮窗，双击后可以任意拖拽、消除网页内的元素，包括广告等，不会影响网页的原本功能，拖到浏览器最左边可以删除元素,移到上方还原,移到下方合并生成多个元素的css选择器,移到右边生成python采集代码。
// @author       readerror
// @require      https://unpkg.com/css-selector-generator@3.6.4/build/index.js
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @include      *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453421/%E9%9A%8F%E6%84%8F%E6%8B%96%E6%8B%BDDOM%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/453421/%E9%9A%8F%E6%84%8F%E6%8B%96%E6%8B%BDDOM%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==
(function(){
  'use strict';
    var deleteMode = 0;
    if(self != top) return;//不要再iframe里再加载一次
    var new_element_N=document.createElement("style");
    new_element_N.innerHTML = '#dragerDom {' +
        '   position: fixed;' +
        '   width: 20px;' +
        '   height: 20px;' +
        '   background-color: rgba(0, 0, 127, 0.2);' +
        '   z-index: 10000000000;' +
        '   cursor: pointer;' +
        '   top: 0px;' +
        '   left: 0px;' +
        '   border-radius: 30%;' +
        '   padding: 6px;' +
        ' }' +
        ' ' +
        ' #dragerDom>div {' +
        '   border-radius: 50%;' +
        '   width: 100%;' +
        '   height: 100%;' +
        '   background-color: rgba(0, 0, 127, 0.3);' +
        '   transition: all 0.2s;' +
        '  -webkit-transition: all 0.2s;' +
        '  -moz-transition: all 0.2s;' +
        '  -o-transition: all 0.2s;' +
        ' }' +
        ' #dragerDom:hover>div{' +
        '   background-color: rgba(0, 0, 127, 0.6);' +
        ' } '+
        '.showMessageDom {padding: 10px 20px;border-radius: 5px;position: fixed;top: 15%;left: 50%;color: #ffffff;z-index: 999;transform: translate(-50%, 0);}'+
        '.showMessageSuccessDom {background-color: #f0f9eb;border: 1px solid #E1F3D8;color: #67c23a;}'+
        '.showMessageErrorDom {background-color: #fef0f0;border: 1px solid #fde2e2;color: #F76C6C;}'+
        '.chosenBorderTmp{opacity:0.77; box-shadow: inset 0px 0px 0px 0.5px #ff0000; color:red; background-size: 21vw 4.2vw; background-color: rgb(247, 108, 108, 0.5); box-sizing: border-box; -moz-box-sizing: border-box;}';
    document.body.appendChild(new_element_N);
    new_element_N=document.createElement('div');
    new_element_N.setAttribute("id","dragerDom");
    new_element_N.style.top="80px";
    new_element_N.style.left = (document.body.clientWidth-45)+"px";
    new_element_N.innerHTML = ' <div></div>' ;
    document.body.appendChild(new_element_N);
    //抽屉start
  let new_element_D=document.createElement('div');
    new_element_D.setAttribute("id","drawerDomDom");
    new_element_D.style.display="none";
    new_element_D.innerHTML = '<div class="close">X</div><div class="self-drawer-content"><textarea id="domdomdomcode"></textarea><h1 id="domdomdom">已拖拽元素:<span id="domdomdomnum">0</span>个</h1>如果只有单个元素，则会生成独立css选择器，并且如果无法为所有元素构造单个选择器，将为每个元素生成一个独立的选择器,所以使用时需要尽量把所有相似元素拖入，一般2-4个即可<h4 id="domdomdomdom"></h4></div>' ;
    document.body.appendChild(new_element_D);

    //抽屉start
    $("body").append('<div class="drawerMask" style="position:fixed;width:100%;height:100%;background: black;left:0px;top:0px;z-index: 888;display:none;opacity: 0.5;"></div>')
            $.fn.extend({
                // 初始化
                "drawerInit": function () {
                    var _this=this;
                    var width=window.innerWidth;
                    var height=window.innerHeight;
                    _this.css('width',width+"px")
                    .css('height',height+"px")
                    // .css('background',"rgba(0,0,0,.5)")
                    .css('position',"fixed")
                    .css('top',"0px")
                    .css('z-index',999)
                    .css('right',-width+"px");
                    var startX=0
                    var distance=0
                    _this.bind("touchstart",function(e){
                        var touch=e.originalEvent.touches[0];
                        startX=touch.clientX;
                    })
                    _this.bind("touchmove",function(e){
                        var touch=e.originalEvent.touches[0];
                        var moveX=touch.clientX;
                        distance=moveX-startX;
                        if(distance<0){
                            distance=0;
                        }
                        _this.css('right',-distance+"px");
                    })
                    _this.bind("touchend",function(e){
                        var width=window.innerWidth;
                        if(distance>=width/3){
                            _this.animate({right:-width+"px"},300,function(){$(".drawerMask").hide()});
                        }
                        if(distance<width/3){
                            _this.animate({right:"0px"},300);
                        }
                        distance=0;
                    })
                    var content=_this.find(".self-drawer-content");
                    content.css('width',(width*0.8)+"px")
                    .css('height',height+"px")
                    .css('background',"white")
                    .css('position',"absolute")
                    .css('top',"0px")
                    .css('right',"0px")
                    var close=_this.find(".close");
                    close.css('width',"20px")
                    .css('height',"20px")
                    .css('font-size',"15px")
                    .css('display',"flex")
                    .css('justify-content',"center")
                    .css('align-items',"center")
                    .css('background',"white")
                    .css('position',"absolute")
                    .css('top',"0px")
                    .css('right',"0px")
                    .css('z-index',999)
                    .css('border',"1px solid black")
                    .css('border-radius',"100%")
                    close.click(function(){
                        _this.animate({right:-width+"px"},500,function(){$(".drawerMask").hide()});
                    })
                },
                // 展示抽屉
                "drawerShow": function () {
                    var _this=this;
                    $(".drawerMask").show()
                    _this.show();
                    _this.animate({right:"0px"},500);
                },
                // 关闭抽屉
                "drawerHide": function () {
                    var _this=this;
                    var width=window.innerWidth;
                    _this.animate({right:-width+"px"},500,function(){$(".drawerMask").hide()});
                },
            });
    $("#drawerDomDom").drawerInit();

    //抽屉end
    //
    var posX;
    var posY;
    var screenWidth =document.documentElement.clientWidth;
    var screenHeight = document.documentElement.clientHeight;
    var fdiv = document.getElementById("dragerDom");
    fdiv.onmousedown=function(e)
    {
      screenWidth =document.documentElement.clientWidth;
      screenHeight = document.documentElement.clientHeight;
      if(!e){ e = window.event; } //IE
      posX = e.clientX - parseInt(fdiv.style.left);
      posY = e.clientY - parseInt(fdiv.style.top);
      document.onmousemove = mousemove;
    }
    function showMessage(message, type) {
        let messageJQ= $("<div class='showMessageDom'>" + message + "</div>");
        if (type == 0) {
            messageJQ.addClass("showMessageErrorDom");
        } else if (type == 1) {
            messageJQ.addClass("showMessageSuccessDom");
        }
        // 先将原始隐藏，然后添加到页面，最后以400毫秒的速度下拉显示出来
        messageJQ.hide().appendTo("body").slideDown(400);
        // 4秒之后自动删除生成的元素
        window.setTimeout(function() {
            messageJQ.show().slideUp(400, function() {
                messageJQ.remove();
            })
        }, 4000);
    }
    document.onmouseup = function()//释放时自动贴到最近位置
    {
      document.onmousemove = null;
      if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(screenHeight/2)){//在上半部分
        if((parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)<=(screenWidth/2)){//在左半部分
          if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)){//靠近上方
            fdiv.style.top="0px";
          }else{//靠近左边
            fdiv.style.left="0px";
          }
        }else{//在右半部分
          if((parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2)<=(screenWidth-(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)) ){//靠近上方
            fdiv.style.top="0px";
          }else{//靠近右边
            fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
          }
        }
      }else{ //下半部分
         if((parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)<=(screenWidth/2)){//在左半部分
          if( (screenHeight-(parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2))<=(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)){//靠近下方
            fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
          }else{//靠近左边
            fdiv.style.left="0px";
          }
        }else{//在右半部分
          if( (screenHeight-(parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight)/2))<=(screenWidth-(parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth)/2)) ){//靠近上方
            fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
          }else{//靠近右边
            fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
          }
        }
      }
    }
    function mousemove(ev)
    {
      if(ev==null){ ev = window.event;}//IE
      if((ev.clientY - posY)<=0){//超过顶部
         fdiv.style.top="0px";
      }else if((ev.clientY - posY) >(screenHeight-parseInt(fdiv.clientHeight))){//超过底部
        fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
      }else{
        fdiv.style.top = (ev.clientY - posY) + "px";
      }
       if((ev.clientX- posX)<=0){//超过左边
         fdiv.style.left="0px";
      }else if((ev.clientX - posX) >(screenWidth-parseInt(fdiv.clientWidth))){//超过右边
        fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
      }else{
        fdiv.style.left = (ev.clientX - posX) + "px";
      }
      // console.log( posX +" "+ fdiv.style.left);
    }
    window.onload = window.onresize = function() { //窗口大小改变事件
      screenWidth =document.documentElement.clientWidth;
      screenHeight = document.documentElement.clientHeight;
      if( (parseInt(fdiv.style.top)+parseInt(fdiv.clientHeight))>screenHeight){//窗口改变适应超出的部分
         fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
      }
      if( (parseInt(fdiv.style.left)+parseInt(fdiv.clientWidth))>screenWidth){//窗口改变适应超出的部分
         fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
      }
      document.onmouseup.apply()
    };
    fdiv.addEventListener('touchstart', fdiv.onmousedown, false);
    fdiv.addEventListener('touchmove', function(event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
          　　　　 event.preventDefault();// 阻止浏览器默认事件，重要
              var touch = event.targetTouches[0];
              if((touch.pageY)<=0){//超过顶部
                fdiv.style.top="0px";
              }else if(touch.pageY>(screenHeight-parseInt(fdiv.clientHeight))){//超过底部
                fdiv.style.top=(screenHeight-parseInt(fdiv.clientHeight))+"px";
              }else{
                fdiv.style.top = (touch.pageY-parseInt(fdiv.clientHeight)/2) + "px";
              }
              if(touch.pageX<=0){//超过左边
                fdiv.style.left="0px";
              }else if( touch.pageX >(screenWidth-parseInt(fdiv.clientWidth))){//超过右边
                fdiv.style.left=(screenWidth-parseInt(fdiv.clientWidth))+"px";
              }else{
                fdiv.style.left = (touch.pageX-parseInt(fdiv.clientWidth)/2) + "px";
              }
            }
          }, false);
    fdiv.addEventListener('touchend', document.onmouseup , false);
   if (typeof(jQuery) == 'undefined'||$("dragerDom").on==undefined) {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css');
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    let addDom = null;
    fdiv.ondblclick=function(){//双击事件可能在手机端浏览器会与网页缩放事件冲突
      if(deleteMode==0){//进入删除模式
        deleteMode = 1;
         $(this).addClass("chosenBorderTmp");


          let position = {
            x: 0,
        y: 0,
        left: 0,
        top: 0,
      }
      let target = null
      let cssstr = ''
      let selecets = []
      let rawStyle = null
      let tarr = null
      let pname = ''
      let isDown = false
      let isHide = false
      let rawOpacity = 1
        //加边框知道选中了哪个
        $("*").hover(
            function(event){
                if(deleteMode==1){
                  if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom"||isDown) return false;
                  $(this).addClass("chosenBorderTmp");
                  if (addDom){
                      addDom.remove()
                  }
                  addDom = $("<div id='addDomadddom' style='clear:both;transform: scale(0.7, 0.7); width: 27%; opacity:1; white-space: nowrap; overflow: visible; font-size: 11px;  background-color: rgb(127, 217, 217, 0.77); font-weight:1100; z-index: 100000000; position: fixed; bottom: -57px; right: -27px; color: blue;'></div>").text('o')
                  let styleD = getComputedStyle(event.currentTarget, null)
               //   rawOpacity = event.currentTarget.style.opacity
                //  event.currentTarget.style.opacity = 0.77
                  let tmpDom002 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("移动到最左边删除，移到页面顶部可还原 ")
                  addDom.append(tmpDom002)
                  tmpDom002 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("移到页面底部可生成css选择器，移到右边可生成python采集脚本 ")
                  addDom.append(tmpDom002)
                  let tmpDom001 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text(event.currentTarget.parentNode.nodeName+'.'+event.currentTarget.className)
                  addDom.append(tmpDom001)
                  let tmpDom0 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("width:"+ styleD['width'])
                  addDom.append(tmpDom0)
                  let tmpDom1 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("height:"+ styleD['height'])
                  addDom.append(tmpDom1)
                  let tmpDom2 = $("<h4 style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></h4>").text("Color & Background")
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("color:"+ styleD['color'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("background-color:"+ styleD['background-color'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<h4 style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></h4>").text("Positioning")
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("position:"+ styleD['position'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("top:"+ styleD['top'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("bottom:"+ styleD['bottom'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("right:"+ styleD['right'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("left:"+ styleD['left'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("display:"+ styleD['display'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("left:"+ styleD['left'])
                  addDom.append(tmpDom2)
                  let zi = styleD['z-index']
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("z-index:"+ zi)
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<h4 style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></h4>").text("Font & Text")
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("font-family:"+ styleD['font-family'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("font-size:"+ styleD['font-size'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("font-weight:"+ styleD['font-weight'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("font-line:"+ styleD['font-line'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("text-decoration:"+ styleD['text-decoration'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("word-spacing:"+ styleD['word-spacing'])
                  addDom.append(tmpDom2)
                    tmpDom2 = $("<div style='clear:both; opacity:1; width:7px; white-space: nowrap; overflow: visible; font-size: 11px;'></div>").text("word-wrap:"+ styleD['break-word'])
                  addDom.append(tmpDom2)
                  $('body').before(addDom)
                  return false;
                }
            },
            function(){
              if(deleteMode==1){
                 if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom"||isDown) return false;
                 $("*").removeClass("chosenBorderTmp");
                // event.currentTarget.style.opacity = rawOpacity
                 if (addDom){
                     addDom.remove()
                     addDom = null
                 }
              }
            }
        );
     var cloneObj = function (obj) {
         var newObj = {};
         if (obj instanceof Array) {
             newObj = [];
         }
         for (var key in obj) {
             var val = obj[key];
             newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
         }
         return newObj;
     };
   
        //点击隐藏，使用on方法，保留原来的事件
        $("*").on("dbclick",function (event){
            if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom") return false;
            $(this).hide();
            return false;
        });
        $("*").on("mousedown",function (event){
            if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom") return false;
            target = event.currentTarget
            rawStyle = cloneObj(event.currentTarget.style)
          //  target.style.fixedheight = '70px !important';
           // target.style.fixedwidth = '100px !important';
            tarr = $(this)
            document.documentElement.style.overflow = 'auto'
            pname = tarr.parent().prev().prop('nodeName')

            position.x = event.clientX
            position.y = event.clientY
            position.left = event.currentTarget.offsetLeft
            position.top = event.currentTarget.offsetTop
            isDown = true
            isHide = false
            return false;
        });

        $("*").on("mousemove",function (event){
            if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom") return false;
            if (!isDown) return
            target.style.position = "fixed"
            target.style.zIndex = 100000001;
            let mx = event.clientX
            let my = event.clientY
            let myLeft = mx - position.x + position.left
            let myTop = my - position.y + position.top
            //console.log({ myLeft, myTop })
            target.style.left = myLeft + "px"
            target.style.top = myTop + "px"
            if (event.clientX == 0 && !isHide){
                tarr.hide();
                showMessage('已删除Dom: '+pname+'-> '+tarr.prev().prop('nodeName'), 0);
                isHide=true;
            }
            if (event.clientY < 3){
                target.style = rawStyle
                tarr.show();
                isDown = false
                isHide=false;
                selecets.remove(target)
                showMessage('已还原Dom: css选择器: '+CssSelectorGenerator.getCssSelector(selecets, {selectors: ['id', 'class', 'tag','nthoftype','attribute','nthchild'], combineBetweenSelectors: true, includeTag: true, combineWithinSelector: true}), 1);
            }
            screenWidth =document.documentElement.clientWidth;
            screenHeight = document.documentElement.clientHeight;
            if (event.clientX > (screenWidth - 50)){
                target.style = rawStyle
                target.classList.remove("chosenBorderTmp")
                let clonetmp= tarr.clone(true)
                clonetmp.attr("style","border: 5px solid paleturquoise; height:50px; postion: static;");
                selecets.push(target)
                let csstmp = CssSelectorGenerator.getCssSelector(selecets, {selectors: ['id','class', 'tag', 'nthoftype','attribute','nthchild' ], combineBetweenSelectors: true, includeTag: true, combineWithinSelector: true});
                target.style.opacity = 0.77
                target.style.boxShadow = "inset 0px 0px 0px 0.5px #ff0000";
                target.style.color = "red"
                target.style.backgroundSize = "21vw 4.2vw"
                target.style.backgroundColor = "rgb(247, 108, 108, 0.5)"
                target.style.boxSizing = "border-box"
                target.style.MozBoxSizing = "border-box"
                tarr.show();
                isDown = false
                isHide=false;
                $('.self-drawer-content').append(clonetmp)
                showMessage('已生成Dom采集脚本: '+pname+'-> '+tarr.prev().prop('nodeName'), 1);

                $("#domdomdomdom").text('css选择器: '+csstmp)
                $("#domdomdomnum").text(selecets.length)

                function heredoc(fn) {
                    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
                }
                $("#domdomdomcode").attr("style","border: 2px solid paleturquoise; height:700px; width: 600px; postion: static;")
                var tmpl = heredoc(function(){/*'
import json
import os.path
import re
import time
import pyquery
import requests
import pyppeteer.browser
import pyppeteer.errors
import pyppeteer.page
import typing
import urllib.parse
import asyncio
import guesstime
from pyppeteer import launch
from functools import partial

CACHE_PATH = 'tmp_cache_html'
log_func = partial(print, guesstime.GuessTime().to_date_str(), 'log:')


class Proxy:
    proxy = {
        "http": None,
    }

    def __str__(self):
        return f'{self.proxy}'

    def reset_proxy(self):
        self.proxy = {
            "http": None,
        }
        return NotImplementedError


class Browser:
    def __init__(self):
        self.user_agent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
        self._page: typing.Union[pyppeteer.page.Page, None] = None
        self._browser: typing.Union[pyppeteer.browser.Browser, None] = None
        self.loop = asyncio.new_event_loop()
        self.proxy = Proxy()
        # asyncio.set_event_loop(new_loop)

    @property
    async def browser(self) -> pyppeteer.browser.Browser:
        if not self._browser:
            self._browser = await launch({
                'args': self.args,
                'timeout': 60 * 1000,
                'headless': True,
                # 'dumpio': True,
                'ignoreHTTPSErrors': True,
                'userDataDir': "./tmp",
                'handleSIGINT': False,
                'handleSIGTERM': False,
                'handleSIGHUP': False
            })
        return self._browser

    @property
    async def page(self) -> pyppeteer.page.Page:
        if not self._page:
            self._page = await self.init_page()
        return self._page

    @property
    def args(self):
        log_func(f'use proxy: {self.proxy}')
        return [
            '--disable-infobars',
            "--no-sandbox",
            '--proxy-server={}'.format(self.proxy.proxy['http']) if self.proxy.proxy['http'] else '',
            "--user-agent=" + self.user_agent,
        ]

    async def init_page(self):
        context = await (await self.browser).createIncogniteBrowserContext()
        # context = await self.browser
        # page = (await context.pages())[0]
        page = await context.newPage()

        await page.evaluateOnNewDocument("""() => {
                         delete navigator.__proto__.webdriver;
                     }""")

        await page.setUserAgent(self.user_agent)
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7'
        })

    async def get_page_data(self, url, timeout=60, return_cache=True):
        # context = await (await self.browser).createIncogniteBrowserContext()
        url_d = urllib.parse.urlsplit(url)
        url_format = "{}_{}".format(
            url_d.hostname.replace('.', '_'),
            re.sub(r'[^a-zA-Z0-9]', '_', url_d.path)
        )
        if not os.path.exists(CACHE_PATH):
            os.makedirs(CACHE_PATH)
        file_cache_path = f'{CACHE_PATH}/tmp_res_{url_format}.html'
        if return_cache and os.path.exists(file_cache_path):
            with open(file_cache_path, 'r', encoding='utf-8') as fr:
                return fr.read()
        context = await self.browser
        try:
            page = (await context.pages())[0]
        except Exception as ex:
            log_func(f'create page: {ex.__class__} {ex}')
            page = await context.newPage()
        for retry in range(15):
            try:
                log_func(f'start goto {url}')
                await page.goto(url, timeout=timeout * 1000)
                res = await page.content()
                with open(file_cache_path, 'wb') as f:
                    f.write(res.encode(encoding='utf-8'))
                if not res:
                    raise ValueError(f'res:{res}')
                else:
                    await page.close()
                # log_func(res)
                return res
            except pyppeteer.errors.TimeoutError:
                log_func('timeout')
                continue
            except (json.decoder.JSONDecodeError, pyppeteer.errors.PageError, ValueError) as ex:
                log_func(f'Error: {ex}')
                self.proxy.reset_proxy()
                self.browser.close()
                self._browser = None
                continue
        await page.close()
        return []

    def fetch_url(self, url, return_cache=True):
        time_start = time.time()
        res = self.loop.run_until_complete(self.get_page_data(url=url, return_cache=return_cache))
        log_func(f'url [cost {time.time() - time_start:.2f}s] [return_cache:{return_cache}] [proxy:{self.proxy}]: {url}')
        return res


def task_browser(url):
    browser = Browser()
    return browser.fetch_url(url)


def task_req(url):
    return requests.get(url, timeout=60).content.decode()


def task(url, css_select):
    html = task_browser(url)
    pqd = pyquery.PyQuery(html)
    log_func(css_select)
    select_html = [pyquery.PyQuery(i).outer_html() for i in pqd(css_select)]
    log_func(f"共{len(select_html)}个元素: {css_select}\n{select_html}")


if __name__ == '__main__':
*/});
                $("#domdomdomcode").text(tmpl+"    _url = '"+window.location.href+"'\n    _css_select = r'"+csstmp+"'\n    task(_url, _css_select)")
                $("#drawerDomDom").drawerShow();
                deleteMode = 0;
                $("*").removeClass("chosenBorderTmp");
                //去掉点击事件
                $("*").off("dbclick");

                $("*").off("mousedown");

                $("*").off("mousemove");

                $("*").off("mouseup");
                $(window.frames[$(this).attr("id")].document).find("*").off("click");
            }
            if (event.clientY > (screenHeight - 50)){
                target.style = rawStyle
                target.classList.remove("chosenBorderTmp")
                let clonetmp= tarr.clone(true)
                clonetmp.attr("style","border: 5px solid paleturquoise; height:178px; postion: static;");
                selecets.push(target)
                let csstmp = CssSelectorGenerator.getCssSelector(selecets, {selectors: ['id', 'class', 'tag','nthoftype',  'attribute', 'nthchild'], combineBetweenSelectors: true, includeTag: true, combineWithinSelector: true});
                target.style.opacity = 0.77
                target.style.boxShadow = "inset 0px 0px 0px 0.5px #ff0000";
                target.style.color = "red"
                target.style.backgroundSize = "21vw 4.2vw"
                target.style.backgroundColor = "rgb(247, 108, 108, 0.5)"
                target.style.boxSizing = "border-box"
                target.style.MozBoxSizing = "border-box"
//              tarr.addClass("chosenBorderR");
                tarr.show();
                isDown = false
                isHide=false;
                $('.self-drawer-content').append(clonetmp)
                $("#domdomdomdom").text('css选择器: '+csstmp)
                $("#domdomdomnum").text(selecets.length)
                $("#drawerDomDom").drawerShow();
                showMessage('已生成Dom css选择器: '+csstmp, 1);
            }
        });

        $("*").on("mouseup",function (event){
            if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom") return false;
            if (isDown) isDown = false
        });
        //单独操作iframe里的广告
        $("iframe").each(function(){
          //console.log($(this).attr("id"));
          $(window.frames[$(this).attr("id")].document).find("*").on("click",function (event){
                if(event.currentTarget.id=="dragerDom"||event.currentTarget.parentNode.id=="dragerDom") return false;
                $(this).hide();
                return false;
          });
        })
      }else{//删除结束
            deleteMode = 0;
            $("*").removeClass("chosenBorderTmp");
            //去掉点击事件
            $("*").off("dbclick");

            $("*").off("mousedown");

            $("*").off("mousemove");

            $("*").off("mouseup");
            $(window.frames[$(this).attr("id")].document).find("*").off("click");
      }
    }
})();