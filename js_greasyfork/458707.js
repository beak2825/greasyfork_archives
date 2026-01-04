// ==UserScript==
// @name         A级图片站工具箱
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  对一张多页图片站，在图片上点击中键实现图片聚合显示。
// @author       zdf
// @match        http*://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js
// @icon         http://p3.music.126.net/tBTNafgjNnTL1KlZMt7lVA==/18885211718935735.jpg
// @license MIT
// @grant        GM_log
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458707/A%E7%BA%A7%E5%9B%BE%E7%89%87%E7%AB%99%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/458707/A%E7%BA%A7%E5%9B%BE%E7%89%87%E7%AB%99%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==
//函数
//
//0.1版基本可用
//功能：
//1、在一页多张图片网站图片浏览页，中键点击图片，实现聚合显示。
//2、点击菜单“加”“减”可增加、减少聚合列数
//3、点击菜单“存”可以将中键点击的图片和本页网址保存起来
//4、点击菜单“取”可以浏览已经保存图片集的列表，点击列表图片会跳转到图片集页面
//存在问题：
//已解决问题：
//1、延迟加载图片的网站不显示图片的问题
(function() {
    //全局变量
  var ycsrc=""; //图片延迟加载属性名
  var mysrc="";
  var bid;
  var bflg=0;
  var imgcss="";
  //var adcss="#contxt br";
  var lie=4;
  var qian="";
  var jsonstr={};
  var divcss;
      const caidan = [{
        name:"加",
        adcss:'',},
        {
        name: "减",
        adcss:["#sidebar",".link_pages",".main-tags"],},
        {
        name: "存",
        adcss:["#sidebar",".link_pages",".main-tags"],},
        {
        name: "取",
        adcss:'',},
        {
        name: "合",
        adcss:'',},
        {
          name: "聚",
          adcss:'',}
        ];
  //取地址前缀，不带扩展名（.htm）
  function getqianadd(myadd){
    //alert(myadd)
    if(myadd.indexOf("_")>-1) {
      return myadd.slice(0,myadd.lastIndexOf("_"));
    }
    else { return myadd.slice(0,myadd.lastIndexOf(".")); }
  }

  //取地址后缀，扩展名（.htm 或 .html）
  function gethouadd(myadd){
    return myadd.slice(myadd.lastIndexOf("."),myadd.length);
  }
  //保存影集
  function baocun(){
    GM_setValue(window.location.href,mysrc);
  alert("保存影集成功！");
};
  //读取影集 & 删除影集
  function duqu(){
 // $("body").remove();
  let mylist=GM_listValues();
  document.documentElement.innerHTML="<html><head></head><body><div class='pububox'></div></body></html>";
  GM_addStyle(".pububox { column-count: 4;column-gap: 0;} .pububox-item{ margin: 1px; }.pububox-item img{ width: 100%;heith:100%} .del{position:absolute;background-color: rgba(52, 52, 52, 0.8);}");
  for ( let i in mylist){
    //console.log(mylist[i]);
    let uu=GM_getValue(mylist[i], null);
    $(".pububox").append("<div class='pububox-item'><div class='del'>✘</div><a href='"+mylist[i]+"'><img src='"+uu+"'></a></div>" );
  }
  $(".del").click(function(){

   GM_deleteValue( $(this).parent().find("a").attr("href"));
     $(this).parent().remove();
  });
};
  //页面工具栏
  function hesub(){
    let bcolor;
    $('img').mousedown(function (e){
      //bcolor=$(this).css("background-color")
 //console.log($(this).parent().attr("class"))
 console.log(e)
    })
    $('*').mouseleave(function (e){
      //$(this).css("background-color",lightgrey)

    })
  }
  //修改img标签中的其他有图片连接的属性值赋值给src属性，解决延迟加载的图片聚合后显示不出来
  function changesrc(obj){
    var j;
    var l;
    console.log("changesrc:"+obj)
    //alert("changsrc")
    for (let i=0;i<obj.attributes.length;i++){
      console.log(obj.attributes[i].name)
      if(obj.attributes[i].name="src")j=i;
    }
    for (let i=0;i<obj.attributes.length;i++){
      //if(obj.attributes[i].value.indexOf("jpg")>-1 && obj.attributes[i].name!="src") l=i;
    }
    obj.attributes[j].value=obj.attributes[l].value

  }
  //取标签上三代标签名，用来当CSS选择器
  function gettag(obj){
    //换连接，避免延迟加载错误
    //bcolor=$(this).css("background-color")
    //console.log($(this).parent().attr("class"))
    //let a=$(this).parent().parent().parent().attr("class") || $(this).parent().parent().parent().prop("tagName")
    // let b=(this).parent().parent().attr("class") || $(this).parent().parent().prop("tagName")
    //let c=$(this).parent().attr("class") || $(this).parent().prop("tagName")
    //console.log(obj)
    let a= $(obj).parent().parent().parent().prop("tagName")||""
    let b=$(obj).parent().parent().prop("tagName")||""
    let c=$(obj).parent().prop("tagName")||""
    let d=$(obj).prop("class")||""
    let e=$(obj).prop("id")||""
    a=a.replace(/\s+/g,".");
    b=b.replace(/\s+/g,".");
    c=c.replace(/\s+/g,".");
    d=d.replace(/\s+/g,".");
    e=e.replace(/\s+/g,".");
    //alert(d.replace(/\s+/g,"."))
    if(d!=""){return a+" "+b+" "+c+" img."+d;}
    if(e!=""){return a+" "+b+" "+c+" img#"+e;}
    return a+" "+b+" "+c+" img";
  }
  //取父级div的class属性值
  function getparentdiv(obj){
    //alert($(obj).parent().prop("tagName"))
    if($(obj).parent().prop("tagName")=="DIV"){
      if($(obj).parent().prop("class")!=""){divcss= "."+$(obj).parent().prop("class");}
      if($(obj).parent().prop("id")!=""){divcss= "#"+$(obj).parent().prop("id");}
      else {getparentdiv($(obj).parent())}
    }
    else {getparentdiv($(obj).parent())}
  }

//给所有img标签添加中键相应程序
    function addimgsub(){

      $('img').mousedown(function (e){
        //console.log(this.attributes)
        if(bflg=1){
          bflg=0;
          document.querySelector("div#caidan-box2 span").innerText = "★";

          // alert(divcss);
          //changesrc(e.target)
          //console.log(e.target.src)
          //e是jquery的event对象
          if(e.button==1){
            //alert(butflg)
            if(bid==4){ //合按钮点击后，中键功能
              //ycsrc=getycsrc(e.target)
              getparentdiv(this);
              qian=getqianadd(window.location.href);
              mysrc=e.target.src;
              imgcss=gettag(this);
              $("a").each(function(index){
                let ahref= $(this).attr("href");
                if(ahref.indexOf(qian)>-1) jsonstr[ahref]="ok";
                //$(this).attr("src",$(this).attr(ycsrc))
              })
              //console.log(jsonstr)
              //alert(divcss)
              $(divcss).prepend("<div class='pububox'></div>")
              $.each(jsonstr,function(key,value){
                // $("<div class='pububox-item'></div>")
                //console.log(key +" "+imgcss)

                $("<div class='pububox-item'></div>").load(key +" "+imgcss,function(responseTxt,statusTxt,xhr){
                  $("div.pububox").prepend(this);
                  $(this).click(function(){
                    $(this).after("<div class='fangdaimg'></div>");
                    var imgSrc = this.querySelector("img").src
                    $(".fangdaimg").css("background-image", "url(" + imgSrc + ")");
                    $('.fangdaimg').fadeIn(1000);
                    //关闭并移除图层
                    $('.fangdaimg').click(function(){
                      $('.fangdaimg').fadeOut(1000).remove();
                    });
                  });
                });
                //document.write(key+":"+value+"<br/>");
              });
              //var qimgs=$(".pububox-item").wrapAll("<div class='pububox'></div>");
              GM_addStyle(".pububox { column-count: 4;column-gap: 0;} .pububox-item{ margin: 1px; }.pububox-item img{ width: 100%;heith:100%}");
              GM_addStyle(" .fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}");


            }
            if(bid==5){ //聚按钮点击后，中键功能
              ycsrc=getycsrc(e.target)
              mysrc=e.target.src;
              juhe(gettag(this));
            }

          }
        }
      })

    }
 //一张多页网站合并显示
  function hebing(a){
  //  console.log(a)
  $(a).each(function(index){$(this).attr("src",$(this).attr(ycsrc))})
  $(a).wrap("<div class='pububox-item'></div>");
  var qimgs=$(".pububox-item").wrapAll("<div class='pububox'></div>");
  GM_addStyle(".pububox { column-count: 4;column-gap: 0;} .pububox-item{ margin: 1px; }.pububox-item img{ width: 100%;heith:100%}");
  GM_addStyle(" .fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}");

  //GM_addStyle(".container { display: flex;flex-flow: column wrap;align-content: space-between;height: 660px;}.item {  width: 32%;}.item::before {counter-increment: items;content: counter(items);}.item:nth-child(3n+1) { order: 1; }.item:nth-child(3n+2) { order: 2; }.item:nth-child(3n)   { order: 3; }.container::before,.container::after {content:;flex-basis: 100%; width: 0; order: 2;}");
  //GM_log(qimgs);


  }
  //一页多张网站聚合显示
  function juhe(a){
  // alert(a)
  // console.log($(a))
  $(a).each(function(index){$(this).attr("src",$(this).attr(ycsrc))})
  $(a).wrap("<div class='pububox-item'></div>");
  var qimgs=$(".pububox-item").wrapAll("<div class='pububox'></div>");
  GM_addStyle(".pububox { column-count: 4;column-gap: 0;} .pububox-item{ margin: 1px; }.pububox-item img{ width: 100%;heith:100%}");
  GM_addStyle(" .fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}");

  //GM_addStyle(".container { display: flex;flex-flow: column wrap;align-content: space-between;height: 660px;}.item {  width: 32%;}.item::before {counter-increment: items;content: counter(items);}.item:nth-child(3n+1) { order: 1; }.item:nth-child(3n+2) { order: 2; }.item:nth-child(3n)   { order: 3; }.container::before,.container::after {content:;flex-basis: 100%; width: 0; order: 2;}");
  //GM_log(qimgs);
    $('.pububox-item').click(function(){
      $(this).after("<div class='fangdaimg'></div>");
      var imgSrc = this.querySelector("img").src
      $(".fangdaimg").css("background-image", "url(" + imgSrc + ")");
      $('.fangdaimg').fadeIn(1000);
      //关闭并移除图层
      $('.fangdaimg').click(function(){
        $('.fangdaimg').fadeOut(1000).remove();
      });
    });

  }
  //添加菜单
  function addcaidan() {
    // 主元素
    var div = document.createElement('div')
    div.id = 'caidan-box2'
    div.style = "position: fixed; top: 120px; right: 20px; width: 40px; background-color: #EEEEEE; font-size: 16px;z-index: 99999;"
    // document.body.appendChild(div)
    document.body.insertAdjacentElement("afterBegin", div);

    // 标题
    var title = document.createElement('span')
    title.innerText = "★"
    title.style = "display: block; text-align: center; margin-top: 10px; font-size: 14px; font-weight: bold;"
    title.onclick = function () { $("div#caidan-box2").remove(); }
    div.appendChild(title)

    // 搜索支持网站列表
    for (let index in caidan) {

      let item = caidan[index];

      // 样式
      let style = "display: block;text-align:center;text-decoration: none;";
      let defaultStyle = style + "color: #333333;";
      let hoverStyle = style + "color: #ffffff; background-color: #666666;";
      let a = document.createElement('a')
      a.href = 'javascript:;'
      a.innerText = item.name
      a.style = defaultStyle
      a.id = index

      // 鼠标移入移除效果，相当于hover
      a.onmouseenter = function () {
        this.style = hoverStyle
      }
      a.onmouseleave = function () {
        this.style = defaultStyle
      }
      a.onclick = function () {
        //菜单中按钮命令
        //alert(a.id);
        //window.location.href="https://"+item.myurl;
        bid=a.id;
        if (a.id==0){//展示栏+1
          lie=lie+1;
          $(".pububox").css("column-count",lie)
        }
        if (a.id==1){//展示栏-1
          lie=lie-1;
          $(".pububox").css("column-count",lie)
        }
        if (a.id==2){//存
          baocun();
        }
        if (a.id==3){//取
          duqu();
        }
        if (a.id==4){//合
          if(bflg==0){bflg=1;title.innerText="★合"}
          else{bflg=0;title.innerText = "★"}
          addimgsub()
          //duqu();
        }
        if (a.id==5){//聚
          if(bflg==0){bflg=1;title.innerText="★聚"}
          else{bflg=0;title.innerText = "★"}
          addimgsub()
          //jusub();
        }
      }
      div.appendChild(a)
    }
  };
  //取img标签延迟加载属性属性名
  function getycsrc(obj){
    //alert(obj.attributes)
    //console.log(obj.attributes)
    for (let i=0;i<obj.attributes.length;i++){
      if(obj.attributes[i].value.indexOf("jpg")>-1 && obj.attributes[i].name!="src") return obj.attributes[i].name;
    }
    return "noname";
  }

    'use strict';

  //var imgs=document.querySelectorAll(imgcss);


  addcaidan();
  //jusub()
  function test(){
  $(imgcss).wrap("<div class='pububox-item'></div>");
  var qimgs=$(".pububox-item").wrapAll("<div class='pububox'></div>");
  GM_addStyle(".pububox { column-count: 4;column-gap: 0;} .pububox-item{ margin: 1px; }.pububox-item img{ width: 100%;heith:100%}");
  GM_addStyle(" .fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}");

  //GM_addStyle(".container { display: flex;flex-flow: column wrap;align-content: space-between;height: 660px;}.item {  width: 32%;}.item::before {counter-increment: items;content: counter(items);}.item:nth-child(3n+1) { order: 1; }.item:nth-child(3n+2) { order: 2; }.item:nth-child(3n)   { order: 3; }.container::before,.container::after {content:;flex-basis: 100%; width: 0; order: 2;}");
  //GM_log(qimgs);
  $(adcss).remove();
  //var lie=parseInt($(".pububox").css("column-count"))+1;
  //alert(lie);
  GM_registerMenuCommand("增加图片列", function( KeyboardEvent) {lie=lie+1;$(".pububox").css("column-count",lie)}, "z");
  GM_registerMenuCommand("减少图片列", function( KeyboardEvent) {lie=lie-1;$(".pububox").css("column-count",lie)}, "x");
  GM_registerMenuCommand("保存影集", function( KeyboardEvent) {baocun()}, "c");
  GM_registerMenuCommand("读取影集", function( KeyboardEvent) {duqu()}, "d");
      $('.pububox-item').click(function(){
        $(this).after("<div class='fangdaimg'></div>");
        var imgSrc = this.querySelector("img").src
        $(".fangdaimg").css("background-image", "url(" + imgSrc + ")");
        $('.fangdaimg').fadeIn(1000);
        //关闭并移除图层
        $('.fangdaimg').click(function(){
          $('.fangdaimg').fadeOut(1000).remove();
        });
    });
  //for (var i = 0; i < imgs.length; i++) {
    //GM_log(imgs[i].src);
  //}
  //开始

  //alert("执行结束");
    // Your code here...
  }

  GM_log("管理命令");
})();