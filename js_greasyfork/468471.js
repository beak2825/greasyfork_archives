// ==UserScript==
// @name         八方客服助手
// @namespace    http://tampermonkey.net/
// @version      1.0.20250205
// @description  这是一个客服快捷使用工具
// @author       子牙
// @match        http://bd168.zhongshang114.com/*
// @match        http://b2b168.zhongshang114.com/*
// @match        http://bd168.shangjimall.com/*
// @match        https://bd168.zhongshang114.com/*
// @match        https://b2b168.zhongshang114.com/*
// @match        https://bd168.shangjimall.com/*
// @match        http://*.b2b168.com/*
// @match        http://*.b2b168.net/*
// @match        https://*.b2b168.com/*
// @match        https://*.b2b168.net/*
// @match        http://*.cn.b2b168.com/*
// @match        http://*.cn.b2b168.net/*
// @match        https://*.cn.b2b168.com/*
// @match        https://*.cn.b2b168.net/*
// @match        https://m.b2b168.com/*
// @match        https://m.b2b168.com/?spm=*
// @exclude      http://bd168.shangjimall.com/index.aspx*
// @exclude      https://crm.b2b168.com/*
// @exclude      https://cn.b2b168.com/*
// @exclude      http://cn.b2b168.com/*
// @exclude      http://mzs.b2b168.com/*
// @exclude      https://mm.b2b168.com/*
// @exclude      https://nkf.b2b168.com/*
// @exclude      https://tj.b2b168.com/*
// @exclude      https://tr.b2b168.com/*
// @exclude      http://tr.b2b168.com/*
// @exclude      http://www.b2b168.com/jiage-*
// @exclude      http://www.b2b168.com/k-*
// @exclude      http://w.alone.b2b168.com/*
// @exclude      http://*.w.b2b168.com/*

// @downloadURL https://update.greasyfork.org/scripts/468471/%E5%85%AB%E6%96%B9%E5%AE%A2%E6%9C%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/468471/%E5%85%AB%E6%96%B9%E5%AE%A2%E6%9C%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// @grant        unsafeWindow
// ==/UserScript==



// 样式函数
function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}
//网址参数获取
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
//文章编号组合


//myFun(3,2)
(function() {
    function toggleIframe() {
  var iframe = document.getElementById('my-iframe');
  if (iframe.style.display === 'none') {
    iframe.style.display = 'block';
  } else {
    iframe.style.display = 'none';
  }
}

    'use strict';
    var aid =""
    var sid = ""
    var atype = ""
    var reg = ""
    var urlhref = window.location.href;
    var domain = window.location.host;
    var urltext = ''
    // 刷新缓存
    if(domain == 'bd168.zhongshang114.com'){
        //alert(domain)
        var url = "http://kefucrm.b2b168.com/page/zyseo-work-zhongshang-baidu-caches-url.php?url="+urlhref
        var domainurl = "http://kefucrm.b2b168.com/tools/?url="+urlhref
        var urlhref1 = urlhref.replace("s13/","s12/")
            urlhref1 = urlhref1.replace("/u","/v")

        var urlhref2 = urlhref.replace("bd168.zhongshang114.com","bd188.b2b168.com")

        var urlhref3 = urlhref.replace("/v","/u")
            urlhref3 = urlhref3.replace("s13/","s12/")

        var urlhref4 = urlhref.replace("bd168.zhongshang114.com","bd168.shangjimall.com")
            urlhref4 = urlhref4.replace("/u","/v")
            urlhref4 = urlhref4.replace("s12/","s13/")
        var text = "<div class=\"kefuxuanfu1\"><a href=\""+url+"\">本页清除</a> <a href=\""+domainurl+"\">全站清除</a></br><a href=\""+urlhref1+"\">正常推广</a> <a href=\""+urlhref2+"\">预览网址</a></br><a href=\""+urlhref3+"\">二跳推广</a> <a href=\""+urlhref4+"\">规避推广</a></div>"
    }
    else if(domain == 'bd168.shangjimall.com'){
        url = "http://kefucrm.b2b168.com/page/zyseo-work-zhongshang-baidu-caches-url.php?url="+urlhref
        domainurl = "http://kefucrm.b2b168.com/tools/?url="+urlhref
        urlhref1 = urlhref.replace("bd168.shangjimall.com","bd168.zhongshang114.com")
        urlhref1 = urlhref1.replace("/u","/v")
        urlhref1 = urlhref1.replace("s13/","s12/")

        urlhref2 = urlhref.replace("bd168.shangjimall.com","bd188.b2b168.com")

        urlhref3 = urlhref.replace("bd168.shangjimall.com","bd168.zhongshang114.com")
        urlhref3 = urlhref3.replace("/v","/u")
        urlhref3 = urlhref3.replace("s13/","s12/")

        urlhref4 = urlhref.replace("/u","/v")
        urlhref4 = urlhref4.replace("s12/","s13/")
        text = "<div class=\"kefuxuanfu1\"><a href=\""+url+"\">本页清除</a> <a href=\""+domainurl+"\">全站清除</a></br><a href=\""+urlhref1+"\">正常推广</a> <a href=\""+urlhref2+"\">预览网址</a></br><div ><a href=\""+urlhref3+"\">二跳推广</a> <a href=\""+urlhref4+"\">规避推广</a></div>"
    }
    else if(domain == 'bd188.b2b168.com'){
        url = "http://kefucrm.b2b168.com/page/zyseo-work-zhongshang-baidu-caches-url.php?url="+urlhref
        url = "http://kefucrm.b2b168.com/page/zyseo-work-zhongshang-baidu-caches.php?url="+urlhref
        urlhref1 = urlhref.replace("bd188.b2b168.com","bd168.zhongshang114.com")
        urlhref1 = urlhref1.replace("/u","/v")
        urlhref1 = urlhref1.replace("s13/","s12/")

        urlhref3 = urlhref.replace("bd188.b2b168.com","bd168.zhongshang114.com")
        urlhref3 = urlhref3.replace("/v","/u")
        urlhref3 = urlhref3.replace("s13/","s12/")

        urlhref4 = urlhref.replace("bd188.b2b168.com","bd168.shangjimall.com")
        urlhref4 = urlhref4.replace("/u","/v")
        urlhref4 = urlhref4.replace("s12/","s13/")
        text = "<div  class=\"kefuxuanfu1\"><a href=\""+urlhref1+"\">正常推广</a></br><div ><a href=\""+urlhref3+"\">二跳推广</a> <a href=\""+urlhref4+"\">规避推广</a></div>"
    }
    else{
        text = ""
    }

    // 获取网站id
    if(domain.indexOf("b2b168.com") != -1 || domain.indexOf("b2b168.net") != -1) {
        sid = $("meta[name='og:coid']").attr("content");
    }
    if(domain == 'bd168.zhongshang114.com' || domain == 'bd188.b2b168.com' || domain == 'b2b168.zhongshang114.com' || domain == 'bd168.shangjimall.com'){
        try{
            reg = /v(.*)s1/;
            sid = reg.exec(urlhref)[1].trim();
        }catch(e){
            sid =""
        }
        if(sid ==""){
            try{
                reg = /u(.*)s1/;
                sid = reg.exec(urlhref)[1].trim();
            }catch(e){
                sid =""
            }
        }
    }
    if (sid > 0){
        url = "https://crm.b2b168.com/?pg=MemberList&kw=%5B%7B%22i%22%3A%221%22%2C%22n%22%3A%22%E5%85%AC%E5%8F%B8%E7%BC%96%E5%8F%B7%22%2C%22o%22%3A%221%22%2C%22v%22%3A%22"+sid+"%22%2C%22s%22%3A%220%22%7D%2C%7B%22i%22%3A%222%22%2C%22n%22%3A%22%E4%BC%9A%E5%91%98%E8%B4%A6%E5%8F%B7%22%2C%22o%22%3A%221%22%2C%22v%22%3A%22%22%2C%22s%22%3A%220%22%7D%2C%7B%22i%22%3A%2214%22%2C%22n%22%3A%22%E6%89%8B%E6%9C%BA%22%2C%22o%22%3A%221%22%2C%22v%22%3A%22%22%2C%22s%22%3A%220%22%7D%2C%7B%22i%22%3A%2211%22%2C%22n%22%3A%22%E5%85%AC%E5%8F%B8%E5%90%8D%E7%A7%B0%22%2C%22o%22%3A%225%22%2C%22v%22%3A%22%22%2C%22s%22%3A%220%22%7D%2C%7B%22i%22%3A%2212%22%2C%22n%22%3A%22QQ%22%2C%22o%22%3A%221%22%2C%22v%22%3A%22%22%2C%22s%22%3A%220%22%7D%5D&sOption=0%2C5&sOrder=%5B%7B%22i%22%3A%224%22%2C%22n%22%3A%22%22%2C%22o%22%3A%221%22%7D%5D&SetId=102&m=1"
        text = text+"<div  class=\"kefuxuanfu1\">公司编号:"+sid+"</div><div  class=\"kefuxuanfu1\"><a href=\""+url+"\" target=\"_blank\">登陆后台</a>  <a href=\"http://kefucrm.b2b168.com/page/search.php?type=coid&conter="+sid+"\" target=\"_blank\">合作服务</a></div>"
        if(domain.indexOf("b2b168.net") != -1  && domain != 'bd188.b2b168.com') {
            text = text+"<div  class=\"kefuxuanfu1\"><a href=\"http://bd188.b2b168.com/v"+sid+"s12/\" target=\"_blank\">千百词推广网址预览</a></div>"
        }
        if(domain.indexOf("b2b168.com") != -1  && domain != 'bd188.b2b168.com') {
            text = text+"<div  class=\"kefuxuanfu1\"><a href=\"http://bd188.b2b168.com/v"+sid+"s12/\" target=\"_blank\">千百词推广网址预览</a></div>"
        }
    }else{
        text = text+""
    }
    //获取供应商机ID
    if(domain.indexOf("b2b168.com") != -1 || domain.indexOf("b2b168.net") != -1 || domain == 'bd168.zhongshang114.com' || domain == 'b2b168.zhongshang114.com' || domain == 'bd168.shangjimall.com') {
        if(urlhref.indexOf("/shop/supply/") != -1 && urlhref.indexOf(".html") != -1) {
            reg = /shop\/supply\/(.*).html/;
            atype = "Supply"
            aid = reg.exec(urlhref)[1].trim()
        }else if(urlhref.indexOf("/supply_2_") != -1 && urlhref.indexOf(".html") != -1) {
            reg = /supply_2_(.*).html/;
            atype = "Supply"
            aid = reg.exec(urlhref)[1].trim()
        }else if(urlhref.indexOf("b2b168.com/s168")!= -1 && urlhref.indexOf(".html") != -1) {
            reg = /s168-(.*).html/;
            atype = "Supply"
            aid = reg.exec(urlhref)[1].trim();
        }else if(urlhref.indexOf("/shop/news/") != -1 && urlhref.indexOf(".html") != -1) {
            reg = /shop\/news\/(.*).html/;
            atype = "glNews"
            aid = reg.exec(urlhref)[1].trim();
        }else if(urlhref.indexOf("/news_6_") != -1 && urlhref.indexOf(".html") != -1) {
            reg = /news_6_(.*).html/;
            atype = "glNews"
            aid = reg.exec(urlhref)[1].trim();
        }else if(urlhref.indexOf("/shop/cpzs/") != -1 && urlhref.indexOf(".html") != -1) {
            reg = /shop\/cpzs\/(.*).html/;
            atype = "glcpzs"
            aid = reg.exec(urlhref)[1].trim();
        }else if(urlhref.indexOf("/cpzs_17_") != -1 && urlhref.indexOf(".html") != -1) {
            reg = /cpzs_17_(.*).html/;
            atype = "glcpzs"
            aid = reg.exec(urlhref)[1].trim();
        }else if(urlhref.indexOf("/shop/khal/")!= -1 && urlhref.indexOf(".html") != -1) {
            reg = /shop\/khal\/(.*).html/;
            atype = "glkhal"
            aid = reg.exec(urlhref)[1].trim();
        }else if(urlhref.indexOf("/khal_16_")!= -1 && urlhref.indexOf(".html") != -1) {
            reg = /khal_16_(.*).html/;
            atype = "glkhal"
            aid = reg.exec(urlhref)[1].trim();
        }else{
            aid = ""
        }
        if(aid !=""){
            if (atype == "Supply"){
                url = "https://m.b2b168.com/Index.aspx?pg=Supply&id="+aid
                var url2 = "https://m.b2b168.com/Index.aspx?pg=SupplyList&r=0&rt=1&q="+aid
                text = text+"<div  class=\"kefuxuanfu1\"><a href=\""+url+"\" target=\"_blank\">供应编辑</a>:<a href=\""+url2+"\" target=\"_blank\">"+aid+"</a></div>"
                }
            else if (atype == "glNews"){
                url = "https://m.b2b168.com/Index.aspx?pg=glNews&id="+aid
                url2 = "https://m.b2b168.com/Index.aspx?pg=glqydtList&r=2&Submit=%C2%A0%C2%A0&page=&Rev=2&iVal=6&Type=&Ids=&cVal=&act=&q="+aid
                text = text+"<div  class=\"kefuxuanfu1\"><a href=\""+url+"\" target=\"_blank\">动态编辑</a>:<a href=\""+url2+"\" target=\"_blank\">"+aid+"</a></div>"
            }
            else if (atype == "glkhal"){
                url = "https://m.b2b168.com/Index.aspx?pg=glNews&id="+aid
                url2 = "https://m.b2b168.com/Index.aspx?pg=glkhalList&r=2&Submit=%C2%A0%C2%A0&page=&Rev=2&iVal=6&Type=&Ids=&cVal=&act=&q="+aid
                text = text+"<div  class=\"kefuxuanfu1\"><a href=\""+url+"\" target=\"_blank\">案例编辑</a>:<a href=\""+url2+"\" target=\"_blank\">"+aid+"</a></div>"
            }
            else if (atype == "glcpzs"){
                url = "https://m.b2b168.com/Index.aspx?pg=glNews&id="+aid
                url2 = "https://m.b2b168.com/Index.aspx?pg=glcpzsList&r=2&Submit=%C2%A0%C2%A0&page=&Rev=2&iVal=6&Type=&Ids=&cVal=&act=&q="+aid
                text = text+"<div  class=\"kefuxuanfu1\"><a href=\""+url+"\" target=\"_blank\">知识编辑</a>:<a href=\""+url2+"\" target=\"_blank\">"+aid+"</a></div>"
            }else{
                text = text+""
            }
        }
    }
    //图片编辑
    if(domain.indexOf("b2b168.com") != -1 || domain == 'bd168.zhongshang114.com' || domain == 'bd188.b2b168.com' || domain == 'bd168.shangjimall.com') {
        //alert("图片编辑");
        if(urlhref.indexOf("/uppic/") != -1) {
            reg = /(\d+)\/(\d+)\/(\d+)\/(\d+).(jpg|png|jpeg)/;
            var imgid = reg.exec(urlhref)[4].trim();
            var imgdel = urlhref.replace("/uppic/","/delbdbc/uppic/")
            text = text+"<div  class=\"kefuxuanfu1\"><a href='https://m.b2b168.com/Index.aspx?pg=PhotoList&r=0&q="+imgid+"' target=\"_blank\">点击修改</a><a href='"+imgdel+"' target=\"_blank\">图片清理</a></div>"
        }
    }

    //企业形象/公司信息修改
    if(domain == 'bd168.zhongshang114.com' || domain == 'bd188.b2b168.com' || domain == 'bd168.shangjimall.com') {
        if(sid > 0){
            text = text+"<div  class=\"kefuxuanfu1\"><a href='https://m.b2b168.com/Index.aspx?pg=CompanyAlbumList&r=1' target=\"_blank\">企业形象</a> <a href='https://m.b2b168.com/Index.aspx?pg=CompanyBasic' target=\"_blank\">公司信息</a></div>"
        }
    }
    //检查中商百度百词竞价商铺违禁词
    if(domain == 'bd168.zhongshang114.com' || domain == 'bd188.b2b168.com' || domain == 'bd168.shangjimall.com') {
        var sumkeyword = 0
        var words=['侵权','维权','GMP','人才网','转其他平台','涨薪','增值税票','供氧','医院','医用','病床','病房','美发','信用卡','医疗','制药','OEM','贴牌','护肤','婴儿','报关','足疗','人体','金银花','人参','枸杞','疼痛','军事','手术','处方','发票','肺炎','红色教育','禁毒','健康','手术','救护','淘宝','支付宝','特种','游戏','养老院','护肤品','易燃易爆','乳液','消化','前列腺','骨质疏松','止泻','脾胃','抗老年痴呆','保肝','营养不良','消食','国际级别','治疗','维生素','营养','中药材','阳痿','壮阳','部队','政府','机关','医院','婴儿','美容','奶粉','化妆'];//单引号中填写敏感词，逗号分隔不分大小写
        for(var i=0;i<words.length;i++){
            var wordtext = "<font color='red' style='font-size:24px' class=\"weijingci\">" + words[i] + "</font>"
            document.body.innerHTML=document.body.innerHTML.replace(new RegExp(words[i],'ig'),wordtext);//LanPu是替换成的词
            var str = document.body.innerHTML
            if(str.indexOf(words[i])!=-1){
                sumkeyword = sumkeyword + 1
            }
        };
        text = text+"<div class=\"kefuxuanfu1\">风险词数量："+sumkeyword+"</div>"
    }
    if(domain=='m.b2b168.com'){
        try{document.querySelector("#frmSave > div > div.sp03 > p:nth-child(2)").style.height = 'auto';}catch(e){}
        try{document.querySelector("body > div.lpcs > ul.u02").style.height = 'unset';}catch(e){}
        // 创建一个新的CSS样式规则
        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '#frmSave > div > div.sp03 > p:nth-child(2) > span { max-width: unset; }';

        // 将新的CSS规则添加到样式表中
        document.head.appendChild(css);

        //document.querySelector(.cpfl .sp03 span").style.display = 'none';
        //document.querySelector("body > div.head > div.middle > ul > a:nth-child(5)").style.display = 'none';


        var link = document.createElement("a");
        link.href = "https://m.b2b168.com/Index.aspx?pg=CompanyAlbumList&r=2";
        link.target = "_blank";
        var li = document.createElement("li");
        li.className = "li06";
        li.innerHTML = "横幅设置";
        link.appendChild(li);
        document.querySelector("body > div.head > div.middle > ul").appendChild(link);

        link = document.createElement("a");
        link.href = "https://m.b2b168.com/index.aspx?pg=ProductClassInsList&spm="+Date.parse(new Date());
        link.target = "_blank";
        li = document.createElement("li");
        li.className = "li06";
        li.innerHTML = "分类设置";
        link.appendChild(li);
        document.querySelector("body > div.head > div.middle > ul").appendChild(link);

        link = document.createElement("a");
        link.href = "https://m.b2b168.com/index.aspx?pg=LinkUrlList&spm="+Date.parse(new Date());
        link.target = "_blank";
        li = document.createElement("li");
        li.className = "li06";
        li.innerHTML = "友链设置";
        link.appendChild(li);
        document.querySelector("body > div.head > div.middle > ul").appendChild(link);


    }

    if (window.self === window.top) {
        // text = text+"<iframe id=\"my-iframe\" src=\""+urlhref+"\" style=\"position: fixed; left: 0; top: 50%; transform: translateY(-50%); height: 90%;width:420px;background-color: white\"></iframe>"
    // 组合显示结果
    try{
        var span=document.createElement("div");
        span.className ="kefuxuanfu";
        //span.style.font-size="18px!important";
        //span.style.line-height="32px";
        span.style.right="10px";
        span.style.top="10px";
        span.style.background="rgb(241 242 243)";
        span.style.color="#1e1e1e";
        span.style.overflow="hidden";
        //span.style.z-index="9999";
        span.style.position="fixed";
        span.style.padding="5px";
        //span.style.text-align="center";
        //span.style.border-bottom-left-radius="4px";
        //span.style.border-bottom-right-radius="4px";
        //span.style.border-top-left-radius="4px";
        //span.style.border-top-right-radius="4px";
        span.innerHTML=text
        document.body.append(span);
        addNewStyle(".kefuxuanfu{font-size:18px!important;line-height:32px;z-index:9999;text-align:center;}.kefuxuanfu1{background-color: white;border-bottom: 1px dashed #000;}")
    }catch(e){
        alert("插件出错")
    }
        // var iframe = document.getElementById('my-iframe');
       //  iframe.src = urlhref;
       //  iframe.addEventListener('load', function() {
       //      iframe.contentWindow.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 11; HarmonyOS; JAD-AL00; HMSCore 6.5.0.312) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.105 HuaweiBrowser/12.1.0.302 Mobile Safari/537.36';
//});
        // 当前页面不在iframe中
    }
    // if(urlhref.indexOf(".html") != -1){
    //     window.onload = function() {
    //         window.scrollTo(0, document.body.scrollHeight);
    //     }
    // }
})();