// ==UserScript==
// @name             KTXP&dmhyTorrentLinkToMagnet
// @namespace        http://KTXP&dmhyTorrentLinkToMagnet/
// @version          3.13
// @description      将dmhy的超长磁链换成btih为40个字符长度的磁链，用于不支持btih为32个字符的磁链的下载渠道，对另外四个站的列表页新增同类的磁力链接，对dmhy和类似miobt的站点提供批量磁链复制，支持跨页复制 PS:沿用这个脚本并不是因为我认为这四个站跟极影有任何关系，只是受众有重叠
// @match            http://www.miobt.com/*
// @match            http://miobt.com/*
// @match            http://share.dmhy.org/*
// @match            https://mikanani.me/Home/Classic*
// @match            https://mikanani.me/Home/Search*
// @include          /http(s)?:\/\/share.dmhy.org\/.*/
// @include          /http:\/\/(www.)?comicat.org\/.*/
// @include          /http:\/\/(www.)?kisssub.org\/.*/
// @require          https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-y/??jquery/1.9.0/jquery.min.js,mousetrap/1.4.6/mousetrap.min.js
// @grant            GM_setClipboard
// @grant            GM_xmlhttpRequest
// @connect          jmnsy.github.io
// @license          GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright        2014.01.17, JMNSY
// @downloadURL https://update.greasyfork.org/scripts/5457/KTXPdmhyTorrentLinkToMagnet.user.js
// @updateURL https://update.greasyfork.org/scripts/5457/KTXPdmhyTorrentLinkToMagnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

let observer,targetNodeBody;
let confirmText = ["即将进行磁链多行复制操作，确认进行？",
                    "即将追加选中的磁链到剪贴板，确认进行？",
                    "即将清除缓存和剪贴板中的内容，确认进行？"];
let copyimg = "https://jmnsy.github.io/black-tie-bold-2f74f123f4edd720c202dbfac55ab2a8454e5785fddb6975b2d8d1d0ebc6f45f.png";
//页面变量，作用范围为两次load之间
var localMap = {};
//如果页面变量中不存在任何变量，即声明后不曾设值，则初始化
if(Object.getOwnPropertyNames(localMap).length === 0 && localStorage.getItem("multiMagnet")!=null){
    //把localStorage中的多行磁链切开并为其设置
    var localArr = localStorage.getItem("multiMagnet").split("\r\n");
    for(var j in localArr){
        localMap[localArr[j]] = true;
    }
}
jQuery().ready(function(){
    doChange();
    observer.observe(targetNodeBody, { attributes: true, childList: true, subtree: true });
});
function doChange(){
    let debounceFunction;
    jQuery.noConflict();
    var isShowTorrent = JSON.parse(getItemByDefault("isShowTorrentLink","true"));
    var isShowPikpak = JSON.parse(getItemByDefault("isShowPikpak","true"));
    var link;
    var switchy;
    var thisurl = window.location.href;
    //适配天国的极影列表页
    if(jQuery(".quick-down").length > 0){
        link = jQuery(".quick-down");
        switchy = 1;
    }
    //适配花园列表页
    else if(jQuery(".jmd").length > 0 && jQuery(".jmd_base").length > 0){
        //对平时显示的节目单进行隐藏
        jQuery(".jmd").hide();
        //显示平时隐藏的全周节目单，并加上平时节目单的class，用于配合原本样式和可能存在的事件绑定
        jQuery(".jmd_base").show().addClass("jmd");
        //今天周几，用于节目单中的标黄强调
        var nowDay = new Date().getDay();
        var TRs = jQuery(".jmd_base >tbody> tr");
        //全周节目单从周日开始，遍历整个节目单表格行，分别加上奇偶行类和当天类，用于配合原本样式和可能存在的事件绑定
        for(var i in TRs){
            if(i == nowDay){
                TRs.eq(i).addClass("today");
            }
            if(i % 2 === 0){
                TRs.eq(i).addClass("even");
            }
            else{
                TRs.eq(i).addClass("odd");
            }
        }

        //修改表头,加宽磁链的列宽并改变列名
        if(isShowTorrent){
            jQuery("span.title").eq(3).parent().attr("width","8%");
            jQuery("span.title").eq(3).text("磁鏈 種子");
        }
        //获得原本的磁链，这里有整页所有的磁链
        link = jQuery(".download-arrow[title='磁力下載']");
        //新建全选复选框对象
        var checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll",title:"全選"});
        //在表头添加全选复选框
        if(jQuery("#checkAll").length === 0){
            jQuery("span.title").eq(3).before(checkall).parent();
        }
        else{
            jQuery("#checkAll").get(0).checked=false;
        }
        //对全选复选框和其他复选框监听变更事件
        jQuery("#checkAll").on("change",checkAll);
        confirmText = ["即將進行磁鏈多行複製操作，確認進行？",
                        "即將追加選中的磁鏈到剪貼簿，確認進行？",
                        "即將清除快取和剪貼簿中的内容，確認進行？"];
        //link以dmhy的处理方式处理
        switchy = 0;
        //当且仅当勾上显示控件图标选项时，请求图片并加载控件
        if(JSON.parse(getItemByDefault("controlVisible","true"))){
            //以图片链接，链接类型，回调函数作为参数调用方法发起去掉reffer的请求
            //对图片链接进行请求后，把相应内容交由回调函数处理
            requestNoReferer(copyimg,'image/png',dmhyAddOperation);
        }
        //鼠标按键绑定相应的函数，按键通过函数从localStorage中获取
        Mousetrap.stopCallback = function () {
            return false;
        };
        Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);
        Mousetrap.bind(getItemByDefault("delete","shift+f2"), clearLocalStorageAndClipboard);
        Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);
        Mousetrap.bind(getItemByDefault("settingsSC","esc"), showDmhySettingDiv);

        //用可用的上一页下一页链接的href用来拼接跳转目标页的地址
        var pageControl = jQuery("a:contains('下一頁')");
        //若下一页文本不被链接元素包围
        if(pageControl.length === 0){
            //尝试上一页文本
            pageControl = jQuery("a:contains('上一頁')");
        }
        //如果上面获得了有效的结果，调用函数添加跳转组件
        for(i in pageControl){
            if(i >= 0){
                addGoToPair(i,pageControl.eq(i));
            }
        }
        if(!isShowPikpak){
            jQuery("a.download-pikpak").remove();
        }
        // 创建一个MutationObserver对象,翻页工具翻页后再次渲染页面
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 判断新添加的节点是否是动态创建的div元素
                if (mutation.addedNodes[0] && mutation.addedNodes[0].tagName && mutation.addedNodes[0].tagName.toLowerCase() === "tbody") {
                    debounceFunction = debounceFunction === undefined?debounce(doChange,100,false):debounceFunction;
                    debounceFunction()
                }
            });
        });
        targetNodeBody = document.querySelector("#topic_list");
    }
    //适配bt.acg.gg和miobt.com列表页
    else if(jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']").length > 0){
        link = jQuery(".clear > table#listTable > tbody.tbody > tr[class^='alt'] > td > a[href^='show']");
        if(/http[s]?:\/\/bt.acg.gg\/.*/.test(thisurl)){
            //link以bt.acg.gg的处理方式处理
            switchy = 2;
            var headTh = jQuery(".l3");
            for(i in headTh){
                var newColumn = headTh.eq(i).clone();
                newColumn.removeClass("l3").addClass("l31").css("width","65px");
                headTh.eq(i).after(newColumn.text("磁链"));
            }
            //鼠标按键绑定相应的函数，按键通过函数从localStorage中获取
            Mousetrap.stopCallback = function () {
                return false;
            };
            Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);
            Mousetrap.bind(getItemByDefault("delete","shift+f2"), clearLocalStorageAndClipboard);
            Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);
            Mousetrap.bind(getItemByDefault("settingsSC","esc"), showGGSettingDiv);
        }
        else if(/http[s]?:\/\/(www.)?miobt.com\/.*/.test(thisurl)||/http[s]?:\/\/(www.)?comicat.org\/.*/.test(thisurl)||/http[s]?:\/\/(www.)?kisssub.org\/.*/.test(thisurl)){
            //link以miobt系的处理方式处理
            switchy = 3;
            headTh = jQuery(".l3.tableHeaderOver");
            newColumn = headTh.clone();
            newColumn.removeClass("l3").addClass("l31").css("width","65px");
            checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll",title:"全选"});
            if(jQuery("#checkAll").length === 0){
                headTh.after(newColumn.text("").append(checkall).append("磁链"));
            }
            else{
                jQuery("#checkAll").get(0).checked=false;
            }
            //对全选复选框和其他复选框监听变更事件
            jQuery("#checkAll").on("change",checkAll);
            //鼠标按键绑定相应的函数，按键通过函数从localStorage中获取
            Mousetrap.stopCallback = function () {
                return false;
            };
            Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);
            Mousetrap.bind(getItemByDefault("delete","shift+f2"), clearLocalStorageAndClipboard);
            Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);
            Mousetrap.bind(getItemByDefault("settingsSC","esc"), showMioSettingDiv);

            //我自己画的，有意见你就帮我画一个
            //对miobt.com中，由该脚本新增的链接添加样式，使链接有足够面积被点击，并以有明显意义的图标作为背景
            requestNoReferer("https://jmnsy.github.io/magnet.gif",'image/gif',mioAddMagnetIcon);
            // 创建一个MutationObserver对象
            observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    // 判断新添加的节点是否是动态创建的div元素
                    if (mutation.addedNodes[0] && mutation.addedNodes[0].tagName && mutation.addedNodes[0].tagName.toLowerCase() === "tr") {
                        debounceFunction = debounceFunction === undefined?debounce(doChange,100,false):debounceFunction;
                        debounceFunction()
                    }
                });
            });
            targetNodeBody = document.querySelector("#data_list");
        }
    }
    //适配蜜柑计划列表页和搜索页
    else if(/http[s]?:\/\/mikanani.me\/.*/.test(thisurl)){
        link = jQuery("table.table > tbody >tr >td >a >img").parent();
        //link以蜜柑计划的处理方式处理
        switchy = 4;
        //当且仅当勾上显示控件图标选项时，请求图片并加载控件
        if(JSON.parse(getItemByDefault("controlVisible","true"))){
            //以图片链接，链接类型，回调函数作为参数调用方法发起去掉reffer的请求
            //对图片链接进行请求后，把相应内容交由回调函数处理
            requestNoReferer(copyimg,'image/png',mikanAddOperation);
        }
        let bangumiColumn = jQuery("table.table.table-striped > thead >tr >th:contains('番组名')");
        bangumiColumn.attr("width",parseInt(bangumiColumn.attr("width").match(/\d+/)[0])-2+"%")
        headTh = jQuery("table.table.table-striped > thead >tr >th:last");
        headTh.attr("width","7%");
        checkall = jQuery("<input/>",{type:"checkbox",id:"checkAll",title:"全选"}).css({"width":"15px","height":"15px"});
        if(jQuery("#checkAll").length === 0){
            headTh.prepend(checkall);
        }
        else{
            jQuery("#checkAll").get(0).checked=false;
        }
        //对全选复选框和其他复选框监听变更事件
        jQuery("#checkAll").on("change",checkAll);
        //鼠标按键绑定相应的函数，按键通过函数从localStorage中获取
        Mousetrap.stopCallback = function () {
            return false;
        };
        Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);
        Mousetrap.bind(getItemByDefault("delete","shift+f2"), clearLocalStorageAndClipboard);
        Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);
        Mousetrap.bind(getItemByDefault("settingsSC","esc"), showMikanSettingDiv);

        // 创建一个MutationObserver对象
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 判断新添加的节点是否是动态创建的div元素
                if (mutation.addedNodes[0] && mutation.addedNodes[0].tagName && mutation.addedNodes[0].tagName.toLowerCase() === "tr") {
                    debounceFunction = debounceFunction === undefined?debounce(doChange,100,false):debounceFunction;
                    debounceFunction()
                }
            });
        });
        targetNodeBody = document.querySelector("table.table.table-striped.tbl-border.fadeIn");
        var observerTR = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutationRecord) {
                jQuery("#checkAll").get(0).checked=false;
                jQuery(".checkMagnet:checked").each(function(){
                    jQuery(this).get(0).checked=false;
                });
            });
          });

        var target = document.querySelector('.js-search-results-row');
        if(target != undefined){
            observerTR.observe(target, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    }
    //对列表页表格中的每一行
    if(link != null){ // 不可使用!==进行两者的比较，因为undefined !== null的值为true
        link.each(function(){
            var temp,str,magnet;
            if(switchy == 1){
                temp = jQuery(this).clone();//原本用于复制一个种子下载图标，链接改为磁链，现在用不上，说到底这个分支目前都不会走
                str = jQuery(this).attr("href");
                jQuery(this).attr("href",str.substring(0,60));
            }
            else if (switchy === 0){
                //复制一个磁链图标并改造为种子下载图标
                temp = jQuery(this).clone().removeClass("arrow-magnet").addClass("arrow-torrent").attr("title","種子下載");
                if( jQuery(this).data("srcMagnet") == null){
                    jQuery(this).data("srcMagnet",jQuery(this).attr("href"))
                }
                //获得当前资源磁链
                str = jQuery(this).data("srcMagnet");
                //获得当前资源发布日期时间
                var datetime = jQuery(this).parent().parent().children().eq(0).children().eq(0).text();
                //获得当前资源发布日期
                var date = datetime.substring(0,datetime.lastIndexOf(" "));
                var tracker = str.substring(str.indexOf("&"));
                //获得当前磁链的base32编码hash
                var b32 = str.split("&")[0].substring(20,52);
                if(b32 == null){
                    debounceFunction();
                    return false;
                }
                //解码后编码为HEX
                var b16 = base32ToHex(b32);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + b16;//b32;//
                //构成种子链
                var torrentLink = thisurl.substring(0,thisurl.indexOf("/"))+"//dl.dmhy.org/" + date + "/" + b16.toLowerCase() + ".torrent";
                if(JSON.parse(getItemByDefault("hasTracker","false"))){
                    magnet = magnet + tracker;
                }
                var checkboxValue = magnet;
                if(JSON.parse(getItemByDefault("copyTorrent","false"))){
                    checkboxValue = torrentLink;
                }
                //把种子下载链接的href置为种子链
                temp.attr("href",torrentLink);
                var check = jQuery("<input/>",{type:"checkbox",class:"checkMagnet",value:checkboxValue}).css("margin-bottom","4px");
                //把磁链的href置为16位磁链，在磁链图标后加入种子下载图标
                var magnetArrow = jQuery(this).attr("href",magnet).attr("data-tracker",tracker);
                if(magnetArrow.parent().find(".checkMagnet").length === 0){
                    magnetArrow.before(check);
                }
                if(isShowTorrent && magnetArrow.parent().find(".arrow-torrent").length === 0){
                    magnetArrow.after(temp);
                }
            }
            else if (switchy == 2){
                //从资源页url中切出hex编码hash
                str = jQuery(this).attr("href").substring(5,45);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + str;
                var td = jQuery("<td/>");
                check = jQuery("<input/>",{type:"checkbox",class:"checkMagnet",value:magnet});
                //新增一个图标，以链接元素包围
                var a = jQuery("<a/>",{href:magnet,class:"magnet"});
                var icon = jQuery("<img/>",{src:"http://bt.acg.gg/images/icon_magnet.gif"});
                var addEle = a.append(icon);

                if(jQuery(this).parent().parent().find(".checkMagnet").length === 0){
                    jQuery(this).parent().after(td.append(check).append(a));
                }
            }
            else if(switchy == 3){
                //从资源页url中切出hex编码hash
                str = jQuery(this).attr("href").substring(5,45);
                //构成磁链
                magnet = "magnet:?xt=urn:btih:" + str;
                td = jQuery("<td/>");
                check = jQuery("<input/>",{type:"checkbox",class:"checkMagnet",value:magnet});
                //把整个元素放到后面的td中
                a = jQuery("<a/>",{href:magnet,class:"magnet"});
                if(jQuery(this).parent().parent().find(".checkMagnet").length === 0){
                    jQuery(this).parent().after(td.append(check).append(a));
                }
            }
            else if(switchy == 4){
                //从资源页url中切出hex编码hash
                torrentLink = jQuery(this).prop("href");
                //获取磁链
                magnet = jQuery(this).parent().parent().find(".magnet-link").data("clipboard-text");
                var checkboxValue = magnet;
                if(JSON.parse(getItemByDefault("copyTorrent","false"))){
                    checkboxValue = torrentLink;
                }
                check = jQuery("<input/>",{type:"checkbox",class:"checkMagnet",value:checkboxValue}).css({"width":"15px","height":"15px"});
                if(jQuery(this).parent().find(".checkMagnet").length === 0){
                    jQuery(this).children().eq(0).css({"margin-left":"2px","height":"15px","width":"20px","margin-bottom":"7px"});
                    jQuery(this).prepend(check);
                }
            }
        });
    }
    if(jQuery(".checkMagnet")){
        //对checkMagnet类的变更事件绑定全选复选框的选中变更函数
        jQuery(".checkMagnet").on("change",checkThis);
    }
}
//在页面中第index个下一页或者上一页<a/>(ele)后追加用于跳转页面的组件，包括数字输入框和按钮
function addGoToPair(index,ele){
    //获取传入元素的href属性
    var href = ele.get(0).href;
    //切出页码前的字符
    var prefix = href.substring(0,href.lastIndexOf("/page/")+6);
    //切出页面参数(搜索参数一类)，当href不存在?时，suffix会被赋以href值
    var suffix = href.substring(href.lastIndexOf("?"));
    var showIndex = window.location.href.replace(prefix,"").replace(suffix,"");
    //当suffix被赋以href值，赋值为空字串
    suffix = (suffix == href?"":suffix);
    //组件的部分id字串
    var id = "index" + index;
    //声明一个输入框，id为index，并绑定enter键按下事件
    var input = jQuery("<input/>",{type:'number',min:'1',placeholder:'前往頁碼',id:id,width:'70px',height:'12px',value:showIndex}).on("keydown",function(event){
        if(event.keyCode == 13){
            //按下enter键则模拟点击旁边的前往按钮
            jQuery("#goto"+id).click();
        }
    });
    //声明前往按钮，点击更改窗口url
    var goto = jQuery("<a/>",{id:"goto"+id,href:'#'}).text("前　往").on("click",function(){go(prefix,id,suffix);});
    //把两个组件加入到dom树中
    if(jQuery("#"+id).length === 0){
        ele.eq(0).parent().append(jQuery("<span/>").text("　")).append(input).append(jQuery("<span/>").text("　")).append(goto);
    }
}
function go(prefix,id,suffix){
    //获取旁边的输入框的输入值
    var index = jQuery("#"+id).val();
    //更改窗口url
    window.location.href = prefix + index + suffix;
}
//dmhy站的操作图标返回后调用的回调函数
function dmhyAddOperation(responseDetails,titles,showSettingdivFun) {
    if(titles == undefined){
        titles = ["多行複製","追加磁鏈","清空剪貼簿","设定"];
    }
    if(showSettingdivFun == undefined){
        showSettingdivFun = showDmhySettingDiv;
    }
    //将返回的图片编码成base64字串
    var base64 = customBase64Encode(responseDetails.responseText);
    var iconsImage = "data:image/png;base64," + base64;
    //声明图片组件按钮并插入到dom树上
    var copyIt = jQuery("<div/>",{id:"copySelectedMagnet",title:titles[0],class:"controlIcon"}).on("click",copyMagnet).css({
        "background":"url(" + iconsImage + ") -485px -285px",
        //   "background-size":"contain",
        "background-repeat":"no-repeat",
        "padding":"15px 15px",
        "position":"fixed",
        "right":"5px",
        "bottom":"90px",
        "cursor":"pointer"
    });
    var addIt = copyIt.clone().css({"bottom":"195px","background":"url(" + iconsImage + ") -85px -45px"}).attr({"id":"addSelectedMagnet","title":titles[1]}).on("click",addLocalStorage);
    var clearIt = copyIt.clone().css({"bottom":"160px","background":"url(" + iconsImage + ") -565px -45px"}).attr({"id":"clearMagnet","title":titles[2]}).on("click",clearLocalStorageAndClipboard);
    var settings = copyIt.clone().css({"bottom":"55px","background":"url(" + iconsImage + ") -525px -45px"}).attr({"id":"settingIcon","title":titles[3]}).on("click",showSettingdivFun);
    jQuery("body").append(copyIt).append(addIt).append(clearIt).append(settings);
}
function mikanAddOperation(responseDetails) {
    dmhyAddOperation(responseDetails,["多行复制","追加磁链","清空剪贴板","设定"],showMikanSettingDiv);
}
//对设置界面表单元素进行设值的函数
function setSettingValue(str){
    if(jQuery("#settingDiv").length === 1){
        jQuery("#appendInput").val(getItemByDefault("append","shift+f1"));
        jQuery("#deleteInput").val(getItemByDefault("delete","shift+f2"));
        jQuery("#copyInput").val(getItemByDefault("copy","shift+f4"));
        jQuery("#settingsInput").val(getItemByDefault("settingsSC","esc"));
        jQuery("#CFCheck").attr("checked",JSON.parse(getItemByDefault("copyNoConfirm","false")));
        if(str == 'mikan' || str == 'dmhy'){
            jQuery("#TRCheck").attr("checked",JSON.parse(getItemByDefault("copyTorrent","false")));
            jQuery("#CVCheck").attr("checked",JSON.parse(getItemByDefault("controlVisible","true")));
            if(str == 'dmhy'){
                jQuery("#HTCheck").attr("checked",JSON.parse(getItemByDefault("hasTracker","false")));
                jQuery("#STCheck").attr("checked",JSON.parse(getItemByDefault("isShowTorrentLink","true")));
            }
        }
    }
}
//显示dmhy的设置界面
function showDmhySettingDiv(){
    showSettingDiv(getDmhySettingDiv,dmhySaveAndClose);
    jQuery("#TRCheck").on("change",function(){
        if("true" == (jQuery("#TRCheck:checked").length == 1?"true":"false")){
            jQuery("#STCheck").prop("checked",true);
        }
    });
    jQuery("#STCheck").on("change",function(){
        if("false" == (jQuery("#STCheck:checked").length == 1?"true":"false")){
            jQuery("#TRCheck").prop("checked",false);
        }
    });
    setSettingValue("dmhy");
}
//显示Mikan的设置界面
function showMikanSettingDiv(){
    showSettingDiv(getMikanSettingDiv,mikanSaveAndClose);
    setSettingValue("mikan");
}
//显示acg.gg的设置界面
function showGGSettingDiv(){
    showSettingDiv(getGGSettingDiv,ggSaveAndClose);
    setSettingValue("GG");
}
//显示mio的设置界面
function showMioSettingDiv(){
    showSettingDiv(getMioSettingDiv,mioSaveAndClose);
    setSettingValue("mio");
}
//显示设置，以获取设置界面html的函数以及界面关闭函数作为参数调用
function showSettingDiv(func1,func2){
    //设置界面关闭状态时显示，显示状态时关闭
    if(jQuery("#settingDiv").length === 0){
        var html = func1();
        jQuery(html).appendTo("body");
        jQuery("#closeSpan").on("click",func2);
    }
    else{
        func2();
    }
}
//之前用js写html的我真是太天真了,全改成了好修改的长字符串
//返回mio设置界面html的函数
function getGGSettingDiv(){
    var html = getMioSettingDiv().replace("00A1CB","1283AF");
    return html;
}
//返回mio设置界面html的函数
function getMioSettingDiv(){
    var html =
        '<div id="settingDiv" style="background: #ffffff; width: 200px; height: 190px; position: fixed; bottom: 320px; right: 20px;z-index:20;">'+
        '   <div id="settingDivTitle" style="background: #00A1CB; color:  #ffffff; width: 190px; height: 20px; position: fixed; bottom: 485px; right: 25px;">'+
        '       设定'+
        '       <span id="closeSpan" style="float: right; margin: 2px; color:  #ffffff; cursor: pointer;">(X)</span>'+
        '   </div>'+
        '   <div id="settingMain" style="background: #f0f0f0; color: #000000; width: 190px; height: 158px; position: fixed; bottom: 325px; right: 25px;">'+
        '       <div id="appendSC" style="margin: 2px;">'+
        '           <span id="appendLabel" style="width: 65px; display: inline-block;">追加磁链</span>'+
        '           <input id="appendInput" type="text" style="width: 80px;"></div>'+
        '       <div id="deleteSC" style="margin: 2px;">'+
        '           <span id="deleteLabel" style="width: 65px; display: inline-block;">清空剪贴板</span>'+
        '           <input id="deleteInput" type="text" style="width: 80px;"></div>'+
        '       <div id="copySC" style="margin: 2px;">'+
        '           <span id="copyLabel" style="width: 65px; display: inline-block;">多行复制</span>'+
        '           <input id="copyInput" type="text" style="width: 80px;"></div>'+
        '       <div id="settingsSC" style="margin: 2px;">'+
        '           <span id="settingsLabel" style="width: 65px; display: inline-block;">设定</span>'+
        '           <input id="settingsInput" type="text" style="width: 80px;" readOnly unselectable></div>'+
        '       <div id="confirmTD" style="margin: 2px;">'+
        '           <span id="CFLabel" style="width: 80px; display: inline-block;">复制无需确认</span>'+
        '           <input id="CFCheck" type="checkbox" style="width: 80px;" /></div>'+
        '   </div>'+
        '</div>'
    ;
    return html;
}
//返回dmhy设置界面html的函数，我需要一个美工给我一点建议
function getDmhySettingDiv(){
    var html =
        '<div id="settingDiv" style="background: #ffffff; width: 300px; height: 220px; position: fixed; bottom: 20px; right: 50px;">'+
        '   <div id="settingDivTitle" style="background: #224477; color:  #ffffff; width: 290px; height: 20px; position: fixed; bottom: 215px; right: 55px;">'+
        '       设定'+
        '       <span id="closeSpan" style="float: right; margin: 2px; color:  #ffffff; cursor: pointer;">(X)</span>'+
        '   </div>'+
        '   <div id="settingMain" style="background: #ccddff; color: #000; width: 290px; height: 188px; position: fixed; bottom: 25px; right: 55px;">'+
        '       <div id="appendSC" style="margin: 2px;">'+
        '           <span id="appendLabel" style="width: 65px; display: inline-block;">追加磁鏈:</span>'+
        '           <input id="appendInput" type="text" style="width: 80px;"></div>'+
        '       <div id="deleteSC" style="margin: 2px;">'+
        '           <span id="deleteLabel" style="width: 65px; display: inline-block;">清空剪貼簿:</span>'+
        '           <input id="deleteInput" type="text" style="width: 80px;"></div>'+
        '       <div id="copySC" style="margin: 2px;">'+
        '           <span id="copyLabel" style="width: 65px; display: inline-block;">多行複製</span>'+
        '           <input id="copyInput" type="text" style="width: 80px;"></div>'+
        '       <div id="settingsSC" style="margin: 2px;">'+
        '           <span id="settingsLabel" style="width: 65px; display: inline-block;">设定</span>'+
        '           <input id="settingsInput" type="text" style="width: 80px;" readOnly unselectable></div>'+
        '       <div id="showTD" style="margin: 2px;">'+
        '           <span id="STLabel" style="width: 80px; display: inline-block;">顯示種子鏈</span>'+
        '           <input id="STCheck" type="checkbox" style="width: 80px;" value="shift+f2"></div>'+
        '       <div id="copyTD" style="margin: 2px;">'+
        '           <span id="TRLabel" style="width: 80px; display: inline-block;">只複製種子鏈</span>'+
        '           <input id="TRCheck" type="checkbox" style="width: 80px;" value="shift+f2"></div>'+
        '       <div id="confirmTD" style="margin: 2px;">'+
        '           <span id="CFLabel" style="width: 80px; display: inline-block;">複製無需確認</span>'+
        '           <input id="CFCheck" type="checkbox" style="width: 80px;" value="shift+f2"></div>'+
        '       <div id="hasTracker" style="margin: 2px;">'+
        '           <span id="HTLabel" style="width: 80px; display: inline-block;">磁鏈帶Tracker</span>'+
        '           <input id="HTCheck" type="checkbox" style="width: 80px;" value="shift+f2"></div>'+
        '       <div id="controlVisible" style="margin: 2px;">'+
        '           <span id="CVLabel" style="width: 80px; display: inline-block;">显示控件图标</span>'+
        '           <input id="CVCheck" type="checkbox" style="width: 80px;" value="shift+f2"></div>'+
        '   </div>'+
        '</div>';
    return html;
}
//返回mikan设置界面html的函数，我需要一个美工给我一点建议
function getMikanSettingDiv(){
    var html =
        '<div id="settingDiv" style="background: #ffffff; width: 300px; height: 220px; position: fixed; bottom: 20px; right: 50px;">'+
        '   <div id="settingDivTitle" style="background: #47c1c5; color:  #ffffff; width: 290px; height: 20px; position: fixed; bottom: 215px; right: 55px;">'+
        '       设定'+
        '       <span id="closeSpan" style="float: right; margin: 2px; color:  #ffffff; cursor: pointer;">(X)</span>'+
        '   </div>'+
        '   <div id="settingMain" style="background: #d8f2f3; color: #000; width: 290px; height: 188px; position: fixed; bottom: 25px; right: 55px;">'+
        '       <div id="appendSC" style="margin: 2px;">'+
        '           <span id="appendLabel" style="width: 65px; display: inline-block;">追加磁链:</span>'+
        '           <input id="appendInput" type="text" style="width: 80px;"></div>'+
        '       <div id="deleteSC" style="margin: 2px;">'+
        '           <span id="deleteLabel" style="width: 65px; display: inline-block;">清空剪贴板:</span>'+
        '           <input id="deleteInput" type="text" style="width: 80px;"></div>'+
        '       <div id="copySC" style="margin: 2px;">'+
        '           <span id="copyLabel" style="width: 65px; display: inline-block;">多行复制</span>'+
        '           <input id="copyInput" type="text" style="width: 80px;"></div>'+
        '       <div id="settingsSC" style="margin: 2px;">'+
        '           <span id="settingsLabel" style="width: 65px; display: inline-block;">设定</span>'+
        '           <input id="settingsInput" type="text" style="width: 80px;" readOnly unselectable></div>'+
        '       <div id="copyTD" style="margin: 2px;">'+
        '           <span id="TRLabel" style="width: 80px; display: inline-block;">只复制种子链</span>'+
        '           <input id="TRCheck" type="checkbox" style="width: 80px;" ></div>'+
        '       <div id="confirmTD" style="margin: 2px;">'+
        '           <span id="CFLabel" style="width: 80px; display: inline-block;">复制无需确认</span>'+
        '           <input id="CFCheck" type="checkbox" style="width: 80px;" ></div>'+
        '       <div id="controlVisible" style="margin: 2px;">'+
        '           <span id="CVLabel" style="width: 80px; display: inline-block;">显示控件图标</span>'+
        '           <input id="CVCheck" type="checkbox" style="width: 80px;"></div>'+
        '   </div>'+
        '</div>';
    return html;
}
//从localStorage中获取name对应的值，不存在时设为defaultValue并返回defaultValue的值
function getItemByDefault(name,defaultValue){
    var item = localStorage.getItem(name);
    if(isNone(item)){
        item = defaultValue;
        localStorage.setItem(name,defaultValue);
    }
    return item;
}
//快捷键配置的读取和保存，以及新设定快捷键的事件绑定
function shotcutSave(){
    //获取设置参数
    var appendSC = jQuery("#appendInput").val();
    var deleteSC = jQuery("#deleteInput").val();
    var copySC = jQuery("#copyInput").val();
    var settingsSC = jQuery("#settingsInput").val();
     //保存设置到localStorage，重新绑定键盘按键事件
    Mousetrap.unbind(getItemByDefault("append","shift+f1"));
    localStorage.setItem("append",appendSC);
    Mousetrap.bind(getItemByDefault("append","shift+f1"), addLocalStorage);

    Mousetrap.unbind(getItemByDefault("delete","shift+f2"));
    localStorage.setItem("delete",deleteSC);
    Mousetrap.bind(getItemByDefault("delete","shift+f2"),clearLocalStorageAndClipboard);

    Mousetrap.unbind(getItemByDefault("copy","shift+f4"));
    localStorage.setItem("copy",copySC);
    Mousetrap.bind(getItemByDefault("copy","shift+f4"), copyMagnet);

    Mousetrap.unbind(getItemByDefault("settingsSC","esc"));
    localStorage.setItem("settingsSC",settingsSC);
}
//关闭并保存mio设置
function mioSaveAndClose(){
    shotcutSave();
    //设置界面的显示逻辑因站点变化而变化
    Mousetrap.bind(getItemByDefault("settingsSC","esc"), showMioSettingDiv);
    var CFFlag = jQuery("#CFCheck:checked").length == 1?"true":"false";
    localStorage.setItem("copyNoConfirm",CFFlag);
    //从dom中移除设置小窗
    jQuery("#settingDiv").remove();
}
//关闭并保存mio设置
function ggSaveAndClose(){
    shotcutSave();
    //设置界面的显示逻辑因站点变化而变化
    Mousetrap.bind(getItemByDefault("settingsSC","esc"), showGGSettingDiv);
    //从dom中移除设置小窗
    jQuery("#settingDiv").remove();
}
//关闭并保存dmhy设置
function dmhySaveAndClose(){
    shotcutSave();
    var STFlag = jQuery("#STCheck:checked").length == 1?"true":"false";
    var HTFlag = jQuery("#HTCheck:checked").length == 1?"true":"false";
    var CVFlag = jQuery("#CVCheck:checked").length == 1?"true":"false";
    var TRFlag = jQuery("#TRCheck:checked").length == 1?"true":"false";
    var CFFlag = jQuery("#CFCheck:checked").length == 1?"true":"false";

    Mousetrap.bind(getItemByDefault("settingsSC","esc"), showDmhySettingDiv);

    localStorage.setItem("isShowTorrentLink",STFlag);
    //遍历所有磁链箭头
    //由于页面ready的时候就在处理磁力链的时候获得tracker并保存在磁链箭头a元素的data-tracker属性中，所以在设置保存的时候就可以处理，立即生效
    jQuery(".download-arrow[title='磁力下載']").each(function(){
        var temp = jQuery(this);
        var checkbox = temp.prev();
        var magnetHref = temp.attr("href");
        var checkboxValue = "";
        //如果勾上“复制种子链”
        if('true'==TRFlag){
            checkboxValue = temp.next().attr("href");
        }
        //如果勾上“磁鏈帶Tracker”
        else if('true'==HTFlag){
            //在磁链后带上tracker
            checkboxValue += temp.attr("data-tracker");
        }
        else{
            //把磁链中的tracker用空字串替换
            checkboxValue = magnetHref.replace(temp.attr("data-tracker"),"");
        }
        //改变磁链箭头前复选框的value
        checkbox.attr("value",checkboxValue);
    });
    //当且仅当勾上显示控件图标选项时，请求图片并加载控件
    if(JSON.parse(CVFlag)){
        //以图片链接，链接类型，回调函数作为参数调用方法发起去掉reffer的请求
        //对图片链接进行请求后，把相应内容交由回调函数处理
        requestNoReferer(copyimg,'image/png',dmhyAddOperation);
    }
    else{
        jQuery(".controlIcon").remove();
    }
    localStorage.setItem("hasTracker",HTFlag);
    localStorage.setItem("copyTorrent",TRFlag);
    localStorage.setItem("copyNoConfirm",CFFlag);
    localStorage.setItem("controlVisible",CVFlag);
    //从dom中移除设置小窗
    jQuery("#settingDiv").remove();
}
//关闭并保存mikan设置
function mikanSaveAndClose(){
    shotcutSave();
    var CVFlag = jQuery("#CVCheck:checked").length == 1?"true":"false";
    var TRFlag = jQuery("#TRCheck:checked").length == 1?"true":"false";
    var CFFlag = jQuery("#CFCheck:checked").length == 1?"true":"false";

    Mousetrap.bind(getItemByDefault("settingsSC","esc"), showMikanSettingDiv);

    //遍历所有磁链箭头
    //由于页面ready的时候就在处理磁力链的时候获得tracker并保存在磁链箭头a元素的data-tracker属性中，所以在设置保存的时候就可以处理，立即生效
    jQuery(".checkMagnet").each(function(){
        var checkbox = jQuery(this);
        var checkboxValue = "";
        //如果勾上“复制种子链”
        if('true'==TRFlag){
            checkboxValue = checkbox.parent().prop("href");
        }
        else{
            checkboxValue = checkbox.parent().parent().parent().find(".magnet-link").data("clipboard-text");
        }
        //改变磁链箭头前复选框的value
        checkbox.attr("value",checkboxValue);
    });
    //当且仅当勾上显示控件图标选项时，请求图片并加载控件
    if(JSON.parse(CVFlag)){
        //以图片链接，链接类型，回调函数作为参数调用方法发起去掉reffer的请求
        //对图片链接进行请求后，把相应内容交由回调函数处理
        requestNoReferer(copyimg,'image/png',mikanAddOperation);
    }
    else{
        jQuery(".controlIcon").remove();
    }
    localStorage.setItem("copyTorrent",TRFlag);
    localStorage.setItem("copyNoConfirm",CFFlag);
    localStorage.setItem("controlVisible",CVFlag);
    //从dom中移除设置小窗
    jQuery("#settingDiv").remove();
}
//mio站的磁链图标返回后调用的回调函数
function mioAddMagnetIcon(responseDetails){
    //把磁链图标编码成base64，组成base64图片链，作为class为magnet的a元素的背景图片
    var base64 = customBase64Encode(responseDetails.responseText);
    var imgstr = "data:image/gif;base64," + base64;
    jQuery("a.magnet").css({"background":"url(" + imgstr + ")","background-size":"contain","background-repeat":"no-repeat","padding-left":"15px"});
}
//以url,返回类型和回调函数作为参数调用的函数
//用于不传referer请求，缺点是不会检查文件是否变更过(不会304)
function requestNoReferer(url,accept,func){
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
            'Accept': accept,
            'referer':'',
        },
        onload: function(responseDetails){
            func(responseDetails);
        } ,
        overrideMimeType: 'text/plain; charset=x-user-defined'
    });
}
//多行复制，不能跨页复制，不能追加，不可与追加在同一次复制中混用
function copyMagnet(){
    var i = 0;
    var arr = new Array("");
    //获取所有勾上class为checkMagnet的checkbox（每行资源所对应的checkbox），遍历
    jQuery(".checkMagnet:checked:visible").each(function(){
        //获取该checkbox的val，即磁链，放到数组中
        arr[i] = jQuery(this).val();
        i+=1;
    });
    //把数组以换行回车连接为一个字符串
    var multiMagnet = arr.join("\r\n");
    //弹出确认对话框，用户选择积极选项时把字符串放入剪贴板
    if(JSON.parse(getItemByDefault("copyNoConfirm","false")) || confirm(confirmText[0])){
        GM_setClipboard(multiMagnet);
    }
}
//全选
function checkAll(){
    //获取所有资源所对应的checkbox，遍历
    jQuery(".checkMagnet:visible").each(function(){
        //当全选复选框与当前复选框的勾选状态不一样时
        if(jQuery(this).get(0).checked != jQuery("#checkAll").get(0).checked){
            //点击当前复选框
            jQuery(this).get(0).click();
        }
    });
}
//全选状态的临界状态处理，即全选到差一个全选，以及差一个全选到全选
function checkThis(){
    //如果当前checkbox不被勾上
    if(jQuery(this).get(0).checked === false){
        //全选复选框也不可以被勾上
        jQuery("#checkAll").get(0).checked=false;
    }
    //如果当前checkbox被勾上并且所有资源所对应的checkbox都被勾上
    else if(jQuery(this).get(0).checked === true && jQuery(".checkMagnet:checked:visible").length == jQuery(".checkMagnet:visible").length){
        //全选复选框也要被勾上
        jQuery("#checkAll").get(0).checked=true;
    }
}
function isNone(str){
    return str === null || str === "";
}
//追加磁链
function addLocalStorage(){
    var i = 0;
    var arr = [];
    //多行磁链
    var multiMagnet = localStorage.getItem("multiMagnet")==null?"":localStorage.getItem("multiMagnet");
    //对当前勾选的复选框
    jQuery(".checkMagnet:checked:visible").each(function(){
        //获取复选框元素的value，每个元素的value都是一条磁链
        var thisMagnet = jQuery(this).val();
        //如果页面变量和本地存储中都不存在这条磁链对应的值，防重
        if( localMap[thisMagnet] === undefined && multiMagnet!=null && multiMagnet.indexOf(thisMagnet)==-1){
            //这条磁链插入数组
            arr[i] = thisMagnet;
            //并把页面变量中磁链对应的值设为true
            localMap[thisMagnet] = true;
            i += 1;
        }
    });
    var add = "";
    if(JSON.parse(getItemByDefault("copyNoConfirm","false")) || confirm(confirmText[1])){
        //对所有不重复的磁链
        if(arr.length > 0){
            //用回车连接成一个字符串
            add = arr.join("\r\n");
            //向原有的磁链追加
            var clipbordStr = (isNone(multiMagnet)?"":multiMagnet + "\r\n") + add;
            //写入localStorage并复制
            localStorage.setItem("multiMagnet",clipbordStr);
            GM_setClipboard(clipbordStr);
        }
        else{
            GM_setClipboard(multiMagnet);
            return;
        }
    }
}
//清除剪贴板，清除localStorage中的多行磁链，页面变量置空
function clearLocalStorageAndClipboard(){
    if(confirm(confirmText[2])){
        localStorage.setItem("multiMagnet","");
        GM_setClipboard("");
        localMap = {};
    }
}
//简单来说就是base32翻译成base2，再翻译成base16
function base32ToHex(str){
    if(str.length % 8 !== 0){
        return null;
    }
    str = str.toLowerCase();
    var b32 = {'a':'00000','b':'00001','c':'00010','d':'00011',
               'e':'00100','f':'00101','g':'00110','h':'00111',
               'i':'01000','j':'01001','k':'01010','l':'01011',
               'm':'01100','n':'01101','o':'01110','p':'01111',
               'q':'10000','r':'10001','s':'10010','t':'10011',
               'u':'10100','v':'10101','w':'10110','x':'10111',
               'y':'11000','z':'11001','2':'11010','3':'11011',
               '4':'11100','5':'11101','6':'11110','7':'11111'};
    var b16 = {'0000':'0','0001':'1','0010':'2','0011':'3',
               '0100':'4','0101':'5','0110':'6','0111':'7','1000':'8',
               '1001':'9','1010':'a','1011':'b','1100':'c','1101':'d',
               '1110':'e','1111':'f'};
    var bin = "";
    var returnStr = "";
    for(var i = 0;i < str.length;i++){
        bin += b32[str.substring(i,i+1)];
    }
    for(i = 0;i < bin.length;i+=4){
        returnStr += b16[bin.substring(i,i+4)];
    }
    return returnStr;
}
function customBase64Encode (inputStr) {
    var
        bbLen               = 3,   //3字节一组
        enCharLen           = 4,   //3字节转换成4个base64编码字符
        inpLen              = inputStr.length,   //图片str的长度

        inx                 = 0,
        jnx,   //字节读入时使用的下标
        keyStr              = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                            + "0123456789+/=",   //转换用字符串
        output              = "",   //输出字符串
        paddingBytes        = 0;   //决定最后一组等号的个数
    var
        bytebuffer          = new Array (bbLen),   //三字节一组
        encodedCharIndexes  = new Array (enCharLen);   //转换成4字符
    //对图片str的每一个字节
    while (inx < inpLen) {
        //每次把下标初始化为0，读入三个字节
        for (jnx = 0;  jnx < bbLen;  ++jnx) {

            //以ascii读入三个字节，存储到数组中
            if (inx < inpLen)
                bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
            //当图片str的长度不为3的倍数时，剩余的位数置零
            else{
                bytebuffer[jnx] = 0;
                inx+=1;
            }
        }
        //base64编码第一个字符为第一个字节右移两位
        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        //base64编码第二个字符为第一个字节和00000011b作与运算并左移四位的结果与第二个字节右移四位的结果作并运算
        encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4)   |  (bytebuffer[1] >> 4);
        //base64编码第三个字符为第二个字节保留右边4位并左移2位的结果与第三个字节右移6位的结果作并运算
        encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2)  |  (bytebuffer[2] >> 6);
        //base64编码第四个字符为第三个字节保留右边6位
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

        paddingBytes = inx - inpLen;
        switch (paddingBytes) {
            case 1:
                encodedCharIndexes[3] = 64;
                break;
            case 2:
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            default:
                break; // No padding - proceed
        }
        for (jnx = 0; jnx < enCharLen; ++jnx)
            output += keyStr.charAt ( encodedCharIndexes[jnx] );
    }
    return output;
}
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
//update log:
//1.修改js的cdn地址
})();