// ==UserScript==
// @name         Bing搜索增强-By Evelynal
// @namespace    http://www.evelynal.top/Navigation/
// @version      0.0.1
// @description  增加多种bing搜索的命令，快捷搜索pdf、文档等
// @author       Evelynal
// @match        https://cn.bing.com/search?q=*
// @icon         https://cn.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/483058/Bing%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA-By%20Evelynal.user.js
// @updateURL https://update.greasyfork.org/scripts/483058/Bing%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA-By%20Evelynal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //------------------------------------------------------------------------------------------------------------------------------------------------初始化设置
    if(GM_getValue("search_box","empty")=="empty"){GM_setValue("search_box",true);}//搜索框按钮
    if(GM_getValue("functional_zone","empty")=="empty"){GM_setValue("functional_zone",true);}//功能区按钮
    if(GM_getValue("sourl","empty")=="empty"){GM_setValue("search_box","http://www.zhihu.com");}
    //------------------------------------------------------------------------------------------------------------------------------------------------油猴脚本设置按钮
    const menu_groupNum_id = GM_registerMenuCommand("设置网站搜索链接", function (event) {//设置网站搜索链接
        var sourl;
        var person=prompt("请输入要设置的网址",GM_getValue("sourl","http://www.zhihu.com"));
        if (person!=null && person!=""){
            GM_setValue("sourl", person);
        }
    }, "groupNum");
    //-----------------------------------------------------------------------------------------------------------------------搜索框开关按钮
    if(GM_getValue("search_box","empty")){
        const menu_search_bar = GM_registerMenuCommand("✅搜索框按钮", search_switch)
        }else{const menu_search_bar = GM_registerMenuCommand("❌搜索框按钮", search_switch)}

    function search_switch(){
        if(GM_getValue("search_box","empty")){
            GM_setValue("search_box",false);
            location.reload()
        }else{
            GM_setValue("search_box",true);
            location.reload()
        }
    }
    var x=document.querySelectorAll("input[name=q]");//搜索框内容
    //---------------------------------------------------------------------------------------------------------------Class
    var class_button=document.createElement('div')//按钮的class
    class_button.innerHTML='<style>.evbutton{text-align: center;padding:8px;padding-left:15px;padding-right:15px;margin:4px;border: 1px solid blue;background:#f7faff;}</style>'
    //---------------------------------------------------------------------------------------------------------------搜内容
    var sou_content = document.createElement('span')
    sou_content.style="float:right;display:flex;cursor:pointer;font-size: 16px;"
    sou_content.innerHTML = '<div class="evbutton" style="margin-left:1px;margin-right:1px" ><b style="color:#174ae4;">搜内容</b></div>'
    sou_content.addEventListener("click", sou_contents)
    //下拉栏
    var sou_content2= document.createElement('div')
    sou_content2.style="float:left;cursor:pointer;"
    sou_content2.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1">搜内容</a></li>'
    sou_content2.addEventListener("click", sou_contents)
    function sou_contents(){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = "https://cn.bing.com/search?q=intexe:"+x[0].value
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    }
    //---------------------------------------------------------------------------------------------------------------搜标题
    var sou_title = document.createElement('div')
    sou_title.style="float:right;font-size: 18px;cursor:pointer;font-size: 16px;"
    sou_title.innerHTML = '<div class="evbutton" style="border-radius: 50px 0px 0px 50px;margin-right:1px;" ><b style="color:#174ae4;">搜标题</b></div>'
    sou_title.addEventListener("click", sou_titles)
    //下拉栏
    var sou_title2= document.createElement('div')
    sou_title2.style="float:left;cursor:pointer;"
    sou_title2.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1">搜标题</a></li>'
    sou_title2.addEventListener("click", sou_titles)
    function sou_titles(){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = "https://cn.bing.com/search?q=intitle:"+x[0].value
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    }
    //---------------------------------------------------------------------------------------------------------------网站搜索
    var sou_website2= document.createElement('div')
    sou_website2.style="float:left;cursor:pointer;"
    sou_website2.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1" id="b-scopeListItem-dictionarys">搜网站</a></li>'
    sou_website2.addEventListener("click", sou_websites)
    function sou_websites(){
        // id示例 if(event.target.id=="span-1"){
        //如果被点击的元素class="evbutton inbutton"则触发，防止其他误触发
        //if示例 if(event.target.className=="evbutton inbutton" || event.target.id=="b-scopeListItem-dictionary" || event.target.id=="b-scopeListItem-dictionarys" ){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = "https://cn.bing.com/search?q="+x[0].value+" site:" +GM_getValue("sourl","http://www.zhihu.com")
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    };
    //---------------------------------------------------------------------------------------------------------------------搜索 pdf

    var soupdf = document.createElement('div')
    soupdf.style="float:left;cursor:pointer;"
    soupdf.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1">搜PDF</a></li>'
    soupdf.onclick=function(event){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = "https://cn.bing.com/search?q=filetype:pdf "+x[0].value
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    };
    //---------------------------------------------------------------------------------------------------------------------搜文档

    var souword= document.createElement('div')
    souword.style="float:left;cursor:pointer;"
    souword.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1">搜文档</a></li>'
    souword.onclick=function(event){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = "https://cn.bing.com/search?q=filetype:docx "+x[0].value
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    };
    //---------------------------------------------------------------------------------------------------------------------搜表格

    var souxlsx= document.createElement('div')
    souxlsx.style="float:left;cursor:pointer;"
    souxlsx.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1">搜表格</a></li>'
    souxlsx.onclick=function(event){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = "https://cn.bing.com/search?q=filetype:xlsx "+x[0].value
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    };
    //---------------------------------------------------------------------------------------------------------------------严格模式
    //搜索框
    var soustrict = document.createElement('div')
    soustrict.style="float:right;font-size: 18px;cursor:pointer;font-size: 16px;"
    soustrict.innerHTML = '<div class="evbutton" style="border-radius: 0px 50px 50px 0px;margin-left:1px;" ><b style="color:#174ae4;">严格模式</b></div>'
    soustrict.addEventListener("click", soustricts)
    //工具栏
    var soustrict2= document.createElement('div')
    soustrict2.style="float:left;cursor:pointer;"
    soustrict2.innerHTML = '<li class="" data-menuurl="" id="b-scopeListItem-dictionary" data-query=""><a class="" target="_blank" aria-current="false" h="ID=SERP,5031.1">严格模式</a></li>'
    soustrict2.addEventListener("click", soustricts)
    function soustricts(){
        //active:true，新标签页获取页面焦点
        //setParent :true:新标签页面关闭后，焦点重新回到源页面
        var urls = 'https://cn.bing.com/search?q="'+x[0].value + '"'
        newTap = GM_openInTab(urls,{ active: true, setParent :true});
    };
    //---------------------------------------------------------------------------------------------------------------------添加组件
    //添加class-------
    var classs = document.getElementsByClassName("b_respl")
    classs[0].appendChild(class_button)

    //搜索框按钮
    if(GM_getValue("search_box","empty")){
        var parent1 = document.getElementsByClassName("b_searchboxForm")
        parent1[0].appendChild(soustrict)
        parent1[0].appendChild(sou_content)
        parent1[0].appendChild(sou_title)
    }
    //列表功能
    //修改顶部高度
    var videoCards=document.getElementById("b_header")
    if(GM_getValue("functional_zone","empty")){
        videoCards.style="height:160px"
    }
    var List_function=document.getElementsByClassName("b_scopebar")
    List_function[0].appendChild(soupdf)
    List_function[0].appendChild(souword)
    List_function[0].appendChild(souxlsx)
    List_function[0].appendChild(sou_content2)
    List_function[0].appendChild(sou_title2)
    List_function[0].appendChild(sou_website2)
    List_function[0].appendChild(soustrict2)


    // Your code here...
})();