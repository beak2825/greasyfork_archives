// ==UserScript==
// @name         zdf图片站聚合显示
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  将分页的图片网站聚合到一页显示
// @author       You
// @match        https://goddess247.com/*
// @match        http*://*/meinvtupian/*
// @match        http*://*/bizhitupian/*
// @match        http*://*dmmtu.com/*
// @match        https://www.dmmtu.com/*
// @license MIT
// @icon         data:image/png;base64,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
// @require           https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @icon         https://i.loli.net/2021/03/07/rdijeYm83pznxWq.png
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_listValues
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/458587/zdf%E5%9B%BE%E7%89%87%E7%AB%99%E8%81%9A%E5%90%88%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/458587/zdf%E5%9B%BE%E7%89%87%E7%AB%99%E8%81%9A%E5%90%88%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    //网站数据
  //-----------------------------------------
    const urlMapping = [{
        myurl: 'www.umei.cc',
        pububox:'div.main-header',
        weiyecss: 'div.pages ul li a',
        charucss1:'div.big-pic',
        charucss2:'div.big-pic a img',
        adcss:'',},
       {
        myurl: 'www.dmmtu.com',
        pububox:'div.main-body',
        weiyecss: 'div.link_pages a',
        charucss1:'div.main-body',
        charucss2:'div.main-body img',
        adcss:["#sidebar",".main-tags"],},
       {
        myurl: 'goddess247.com',
        weiyecss: '',
        charucss1:'',
        charucss2:'div.elementor-widget-container img',
        adcss:["#sidebar",".link_pages",".main-tags"],}
        ];
  //-------------------------------------------------------
    //功能菜单数据
  //------------------------------------------------------
    const caidan = [{
        name:"缩小图片",
        weiyecss: 'div.pages ul li a',
        charucss1:'div.big-pic',
        charucss2:'div.big-pic a',
        adcss:'',},
        {
        name: "放大图片",
        weiyecss: 'div.link_pages a',
        charucss1:'div.main-body',
        charucss2:'div.main-body img',
        adcss:["#sidebar",".link_pages",".main-tags"],},
        {
        name: "保存本页",
        weiyecss: 'div.link_pages a',
        charucss1:'div.main-body',
        charucss2:'div.main-body img',
        adcss:["#sidebar",".link_pages",".main-tags"],},
        {
        name: "读取保存",
        weiyecss: 'div.link_pages a',
        charucss1:'div.main-body',
        charucss2:'div.main-body img',
        adcss:'',},
        {
        name: "网站列表",
        weiyecss: '',
        charucss1:'',
        charucss2:'',
        adcss:'',}
        ];
  //--------------------------------------------------------


  //功能函数
  //-----------------------------------------------------
    //根据网站数据中CSS选择器移除广告
    function admove(adcss){
        //alert(adcss);
        for(let i in adcss){$(adcss[i]).remove();}
    }

    //function isin(keys要查找的字符串,words被查找的字符串) 如果被查找字符串中包含要查找的字符串则返回值大于0，没找到则等于-1
    function isin(keys,words){
        words=words || "尾页";
        return words.indexOf(keys);
    }

    //根据网站数据中CSS选择器返回尾页按钮地址
    function getweiye(mycss){
        var el = document.querySelectorAll(mycss);
        for (var i = 0; i < el.length; i++) {
            if ( isin(el[i].text)>-1 ) { return el[i].href;}
        }
    }

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

    //返回影集页数，返回的是一个整数
    function getnum(myadd){
        return parseInt(myadd.slice( myadd.lastIndexOf("_")+1,myadd.lastIndexOf(".")));
    }

    //根据文本创建DOCUMENT
    function createDocumentByString (e) {
            if (e) {
                if ('HTML' !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, 'application/xhtml+xml');
                var t;
                try { t = (new DOMParser).parseFromString(e, 'text/html');} catch (e) {}
                if (t) return t;
                if (document.implementation.createHTMLDocument) {
                    t = document.implementation.createHTMLDocument('ADocument');
                } else {
                    try {((t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)), t.documentElement.appendChild(t.createElement('head')), t.documentElement.appendChild(t.createElement('body')));} catch (e) {}
                }
                if (t) {
                    var r = document.createRange(),
                        n = r.createContextualFragment(e);
                    r.selectNodeContents(document.body);
                    t.body.appendChild(n);
                    for (var a, o = { TITLE: !0, META: !0, LINK: !0, STYLE: !0, BASE: !0}, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                    return t;
                }
            } else console.error('没有找到要转成 DOM 的字符串');
        };

  //插入样式表
    function addstyle(){
    const myScriptStyle = document.createElement("style");
    myScriptStyle.innerHTML = ".charua { width: 33%;float:left } img {  width: 100%; height:100%; }*{ margin: 0;padding: 0;}.drawing{width: 150px;margin: 10px;}.drawing:hover{cursor: zoom-in;}.fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}";
    document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
    $("div.main-content").css("margin-right","0px");
  }

    //插入div节点
    //charu(节点数,插入连接前缀,插入连接后缀,插入节点的CSS选择式,读取网页内容的CSS选择式)
    function charu(num,cqian,chou,ccss,dcss){
        //var el = document.querySelector(ccss);
        //alert(ccss);
        for (var i = 2; i <=num; i++) {
            $(ccss).before(" <div id='charu"+i.toString()+"' class='charu'></div>");
           // $("div#charu"+i.toString()).load(cqian+"_"+i.toString()+chou +" "+dcss,function(responseTxt,statusTxt,xhr){alert("载入结束");});
            $("div#charu"+i.toString()).load(cqian+"_"+i.toString()+chou +" "+dcss);
        }
    }
    function charunew(num,cqian,chou,boxcss,dcss){
        //var el = document.querySelector(ccss);
        //alert(ccss);
                  document.documentElement.innerHTML="<html><head></head><body><div class='charumain'></div></body></html>";
                  const myScriptStyle = document.createElement("style");
                 // myScriptStyle.innerHTML = ".charu { width: 33%;float:left } img {  width: 100%;height:100%; }*{ margin: 0;padding: 0;}.drawing{width: 150px;margin: 10px;}.drawing:hover{cursor: zoom-in;}.fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}";
      myScriptStyle.innerHTML = ".pububox { column-count: 4;column-gap: 0;} .charu{ margin: 1px; }.charu img{ width: 100%;} .fangdaimg{position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 999;background-repeat: no-repeat;background-attachment: fixed;background-position: center;background-color: rgba(52, 52, 52, 0.8);background-size: auto 99%;}.fangdaimg:hover{cursor: zoom-out;}";

      document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
      $("div.charumain").after("<div id='pububox' class='pububox'></div>");
        for (var i = 2; i <=num; i++) {
            $("div.pububox").append(" <div id='charu"+i.toString()+"' class='charu' ></div>");
           // $("div#charu"+i.toString()).load(cqian+"_"+i.toString()+chou +" "+dcss,function(responseTxt,statusTxt,xhr){alert("载入结束");});
            $("div#charu"+i.toString()).load(cqian+"_"+i.toString()+chou +" "+dcss);
        }
          $('div.charu').click(function(){
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
    //取地址的匹配CSS
      function getcss(myaddr) {
            for (let index in urlMapping) {
              let item = urlMapping[index];
              //alert(item.myurl+"  "+myaddr);
        //判断当前页面url是否在数据中，在就插入图片
              if( isin(item.myurl,myaddr)>=0){ return item.charucss2; }
            }
           return "";
      };
  //取当前网站的匹配名
       function getmyurl() {
            for (let index in urlMapping) {
              let item = urlMapping[index];
              //alert(item.myurl+"  "+myaddr);
        //判断当前页面url是否在数据中，在就插入图片
              if( isin(item.myurl,window.location.href)>=0){ return item.myurl; }
            }
           return "";
      };
      //功能菜单构建函数
  //--------------------------------------------
    function addBox() {
        // 主元素
        var div = document.createElement('div')
        div.id = 'caidan-box'
        div.style = "position: fixed; top: 120px; left: 20px; width: 80px; background-color: #EEEEEE; font-size: 12px;z-index: 99999;"
        // document.body.appendChild(div)
        document.body.insertAdjacentElement("afterBegin", div);

        // 标题
        let title = document.createElement('span')
        title.innerText = "工具菜单"
        title.style = "display: block; text-align: center; margin-top: 10px; font-size: 14px; font-weight: bold;"
        div.appendChild(title)

        // 搜索列表
        for (let index in caidan) {

            let item = caidan[index];

            // 样式
            let style = "display: block; padding: 10px 0 10px 20px; text-decoration: none;";
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
                //a.id 可以用来做执行函数的参数，实现区分功能
                //根据菜单编号完成相对功能
                if (a.id==0){//缩小图片
                    $(".charu").css("width",parseInt ($(".charu").css("width"))-50+"px");
                }
                if (a.id==1){//放大图片
                    $(".charu").css("width",parseInt ($(".charu").css("width"))+50+"px");
                }
                if (a.id==2){//收藏页面
                  //保存当前页标题和网址
                  //GM_listValues((keys) => console.log(keys));
                  //alert(document.title);
                  GM_setValue(document.title,window.location.href);
                }
                if (a.id==3){//查看收藏页面
                  let mylist=GM_listValues();
                   //console.log(aa);
                  //alert(GM_getValue("zdf", null));
                  document.documentElement.innerHTML="<html><head></head><body><div class='charumain'></div></body></html>";
                  const myScriptStyle = document.createElement("style");
                  myScriptStyle.innerHTML = ".charumain { column-count: 3;column-gap: 0;} .charu{ margin: 1px; }.charu img{ width: 100%;height: 100%;}";
                  document.getElementsByTagName("head")[0].appendChild(myScriptStyle);
                  //let sbody=document.body;
            //let qian= getqianadd(aa[0]); //取前缀
            //console.log(qian);
            //let hou= gethouadd(aa[0]); //取后缀
                  for ( let i in mylist){
                    //console.log(mylist[i]);
                    let uu=GM_getValue(mylist[i], null);
                    if (uu.indexOf(getmyurl())>-1) {
                    let cs=getcss(uu);
                    //alert(cs+"  "+uu);
                    $("div.charumain").append(" <div id='charu"+i.toString()+"' class='charu'></div>");
           // $("div#charu"+i.toString()).load(cqian+"_"+i.toString()+chou +" "+dcss,function(responseTxt,statusTxt,xhr){alert("载入结束");});
            //$("div#charu"+i.toString()).load( uu+" "+"div.main-body img");
                    //console.log(uu+" "+cs);
                    GM_xmlhttpRequest({
                      method: "get",
                      url: uu,
                      headers: { "Content-Type": "application/x-www-form-urlencoded" },
                      onload: function(r) {
                        //alert("ok");
                        let dd=createDocumentByString(r.responseText);

                        let aa=document.createElement("a");
                        aa.href=uu;
                        let myimg=dd.querySelector(cs);
                        //alert(myimg.hasAttribute("data-lazy-src"));
                        if (myimg.hasAttribute("data-lazy-src")) myimg.src=(myimg.getAttributeNode("data-lazy-src").value);
                              aa.appendChild(myimg);
                        console.log(dd.querySelector(cs));
                        $("div#charu"+i.toString()).append(aa);
                        // code
                      }
                    });
                  }
                }
            //console.log(hou);
            //var shu=getnum(hurl); //取张数
            //console.log(shu);
            //admove(item.adcss);
           // $("div.main-content").css("margin-right","0px");
            //charu(1,qian,hou,"body",item.charucss2)
                  //GM_setValue(document.title,window.location.href);
                }
                if (a.id==4){//打开网站列表
                  addBox2();
                }
            }
            div.appendChild(a)
        }
    };
  //--------------------------------------------
    //网站列表菜单构建函数
  //--------------------------------------------
    function addBox2() {
        // 主元素
        var div = document.createElement('div')
        div.id = 'caidan-box2'
        div.style = "position: fixed; top: 120px; right: 20px; width: 150px; background-color: #EEEEEE; font-size: 12px;z-index: 99999;"
        // document.body.appendChild(div)
        document.body.insertAdjacentElement("afterBegin", div);

        // 标题
        let title = document.createElement('span')
        title.innerText = "网站列表"
        title.style = "display: block; text-align: center; margin-top: 10px; font-size: 14px; font-weight: bold;"
        title.onclick = function () { $("div#caidan-box2").remove(); }
        div.appendChild(title)

        // 搜索支持网站列表
        for (let index in urlMapping) {

            let item = urlMapping[index];

            // 样式
            let style = "display: block; padding: 10px 0 10px 20px; text-decoration: none;";
            let defaultStyle = style + "color: #333333;";
            let hoverStyle = style + "color: #ffffff; background-color: #666666;";

            let a = document.createElement('a')
            a.href = 'javascript:;'
            a.innerText = item.myurl
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
              window.location.href="https://"+item.myurl;

            }
            div.appendChild(a)
        }
    };
  //--------------------------------------------
  //---------------------------------------------------


    'use strict';
    //逻辑：获取尾页连接——判断共多少页——重组各个网页连接——读取子页并将元素插入当前页
//-----------------------------------------主程序开始-------------------------------------------------------------------------
  //1、插入样式

  //2、循环比对数据信息，完成插入分页图片
    for (let index in urlMapping) {
        let item = urlMapping[index];
        //判断当前页面url是否在数据中，在就插入图片
        if( isin(item.myurl,window.location.href)>=0){
          //addstyle();//插入样式
          //admove(item.adcss);//移除广告
          if (item.weiyecss=="") continue;//尾页css选择器为空就跳过
          //alert("进入")
          let diyiye=document.querySelector(item.charucss2);
            if (diyiye == null) continue;
            var hurl=getweiye(item.weiyecss); //取尾页地址
            if (typeof(hurl)== "undefined") continue;
            //alert(hurl);
            var qian= getqianadd(hurl); //取前缀
            //alert(qian);
            var hou= gethouadd(hurl); //取后缀
            //alert(hou);
            var shu=getnum(hurl); //取张数
            if ( shu<2 ) continue;//如果张数小于2跳过
            //alert(shu);
            //charu(shu,qian,hou,item.charucss1,item.charucss2)
          charunew(shu,qian,hou,item.pububox,item.charucss2)
        }
    }

    // var el = document.querySelectorAll("img");
    // console.log( el[i].text );
    // alert(el.length);
    //替换body内容，可用
    //var bd = document.createElement("body");
    //var dv=document.querySelector('div.main-body');
    //bd.append(dv);
    //document.body.innerHTML=bd.innerHTML;
//alert("进入")

    //逻辑：找到节点——建立插入内容——插入节点
    //查找节点：Document.querySelector(css选择器)
    //插入节点：Element.insertAdjacentHTML(position, text)
    //'beforebegin'：元素自身的前面。'afterbegin'：插入元素内部的第一个子节点之前。'beforeend'：插入元素内部的最后一个子节点之后。'afterend'：元素自身的后面。
    //eg: d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

    //3、插入菜单函数
  addBox();
    //不能直接给IMG标签加点击事件
    //$("div.charu").click(function(){alert(this)});

    //点击图片查看大图，实际通过点击图片外DIV实现
  //---------------------------------------------------------------
    $('div.charu').click(function(){
        $(this).after("<div class='fangdaimg'></div>");
        var imgSrc = this.querySelector("img").src
        $(".fangdaimg").css("background-image", "url(" + imgSrc + ")");
        $('.fangdaimg').fadeIn(1000);
        //关闭并移除图层
        $('.fangdaimg').click(function(){
          $('.fangdaimg').fadeOut(1000).remove();
        });
    });
//-----------------------------------------------------------------
    //alert("脚本载入结束");

})();