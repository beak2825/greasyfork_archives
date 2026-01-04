// ==UserScript==
// @name        opengameart图片放大和滚动加载
// @namespace   Violentmonkey Scripts
// @match       https://opengameart.org/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
//http://code.jquery.com/jquery-2.1.1.min.js
// @require    http://libs.baidu.com/jquery/2.1.1/jquery.min.js
// @description 2024/1/28 下午7:12:54
// @downloadURL https://update.greasyfork.org/scripts/487677/opengameart%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%92%8C%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/487677/opengameart%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%92%8C%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

/*
{list:
  {网站名:"用document.domain获取"
    {

      "pageRegExp":"获得页码的正则表达式(必须)",
      "container":"获得容器的表达式(必须)",
      "secondpage":"获得包含第二页或下一页的A标签的表达式(必须) 或者 写一个function,返回下一页的url"
      "func":"初始化的执行的函数（function）",
      "ajax":"ajax返回数据后执行的函数（function） 对请求的内容进行修改，方法形参html,修改后可返回html结果"
      "lastpage":"最后一页页码（int）" 值有三种：1.值 直接返回一个数值 , 2.方法 返回一个方法返回值是页码， 3.对象 style 字符串，class 字符串，lastnum 方法，返回最后的页码
      "lastpage": {
            "style": "",
            "class": "pageDiv2",
            "lastnum": function() {
                return $(".relative.z-0.inline-flex.shadow-sm a:eq(-2)").text()
            }
      },
      "lastpage_":用于没有最后一页的情况
      "lastpage_":function(html){
						return (new RegExp('(?<=/)\\d+(?=\.html)').exec(($(html).find(".pagination-row:eq(1) a:eq(-2)")).attr("href")) || [""])[0]
			},
      "jump":bool,是否跳转
    }
  }
}
*/


var list = {

    "opengameart.org": {
        "pageRegExp": "(?<=&page=)\\d+",
        "container": ".view-content:last",
        "secondpage": ".pager-next a",
        "lastpage": function() {
            return (new RegExp('(?<=&page=)\\d+').exec($(".pager-last a").attr("href")) || [""])[0]
        },
        "ajax": function(objs, html) {
            $("html").find(".field-item").width(260)

            $("html").find(".field-item img").each(function() {
                $(this).width(260);
                $(this).height(200);
                let src = $(this).attr("src")
                src = src.replace("/thumbnail/", "/medium/")
                $(this).attr("src", src)
            })
            return $(html).find(".view-content:last");
        },
        "func": function() {
            $(".field-item").width(260)

            $(".field-item img").each(function() {
                $(this).width(260);
                $(this).height(200);
                let src = $(this).attr("src")
                src = src.replace("/thumbnail/", "/medium/")
                $(this).attr("src", src)
            })
        }
    },
}

//------------------------------------------------------------------------------------------

var item = list[document.domain]
//分页转瀑布流
var regx = new RegExp(item.pageRegExp)
//获得页码的正则表达式
var container = item.container
//加载的容器
var containerFn = setInterval(()=>{
    try {
        if (document.readyState == "complete") {
            clearInterval(containerFn);
            $ = jQuery;
            //初始化加载自定义事件
            if (list[document.domain] && list[document.domain]["func"]) {
                list[document.domain]["func"]();
            }
            boxLoad(regx, container);
            if ($("#tempHTML").length == 0) {
                $("html").append("<div style='display:none;' id='tempHTML'></div>")
            }
        }
    } catch {}
}
, 200);
function boxLoad(regx, container) {
    var url = window.location.href;
    var page = 1;
    //获得当前页
    let lastpage = (typeof item["lastpage"] == "object") ? (item["lastpage"]["lastnum"]()) : (typeof item["lastpage"] == "function" ? item["lastpage"]() : item["lastpage"])
    if (item["secondpage"] && lastpage) {
        if (typeof item["secondpage"] == "function") {
            url = item["secondpage"]();
        } else {
            url = $(item["secondpage"]).attr("href")
        }
        if ((regx.exec(url) == null || url == undefined) && typeof item["secondpage"] != "function") {
            alert("无法获取下一页地址,请检查代码。\n获取数量：" + $(item["secondpage"]).length + "\n下一页获取代码" + item["secondpage"])
        }
        if (regx.exec(url) != null) {
            page = +(regx.exec(url)[0]) - 1
        }
    }
    //获得域名
    var lsName = window.location.href.replace(regx, "0")
    if (item["jump"] != false && page != localStorage.getItem(lsName) && localStorage.getItem(lsName) != null && localStorage.getItem(lsName) > 1) {
        if (confirm("上次浏览到" + localStorage.getItem(lsName) + "页,是否跳转")) {
            location.replace(url.replace(regx, localStorage.getItem(lsName)));
        } else {
            localStorage.setItem(lsName, page);
        }
    }

    //显示当前页进度
    if (item && item["lastpage"]) {
        addStyle()
        if (typeof item["lastpage"] == "object") {
            var style = item["lastpage"]["style"]
            var class_ = (item["lastpage"]["class"] || "pageDiv2")
            var lastnum = item["lastpage"]["lastnum"]()
            $("body").append("<div id='pageDiv' style='" + style + "' class='" + class_ + "' >" + page + "/" + lastnum + "</div>");
        } else {
            var lastnum
            //判断是否是方法还是数字
            if (typeof item["lastpage"] == "function") {
                lastnum = item["lastpage"]()
            } else {
                lastnum = item["lastpage"]
            }
            $("body").append("<div id='pageDiv' class='pageDiv2' >" + page + "/" + lastnum + "</div>");
        }
    }
    $("a").attr("target", "_blank")

    //元素距离顶部的距离
    let offsetTop = getElementTop($(item["container"]).get(0)) + $(item["container"]).height() / 2;
    if (!item["container"]) {
        alert("找不到容器,请检查container是否正确")
    }
    let scrollSwitch = true;
    $(window).scroll(function() {
        //网页被卷去的高
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

        //网页可见区域高
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

        //网页正文全文高
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

        //开始监听滚动条
        if (scrollSwitch && scrollHeight - offsetTop < (clientHeight + scrollTop)) {
            scrollSwitch = false;
            page++;

            if ((+$("#pageDiv").text().split("/")[0]) >= (+$("#pageDiv").text().split("/")[1])) {
                return;
            }
            var lastnum = (+$("#pageDiv").text().split("/")[1])

            if (item["secondpage"] && typeof item["secondpage"] == "function") {
                url = item["secondpage"]();
            } else {
                url = $(item["secondpage"]).attr("href")
            }
            url = url.replace(regx, page)
            var xmlhttp = new XMLHttpRequest()
            xmlhttp.open("GET", url, true);
            //lhttp.overrideMimeType("text/html;charset=GBK");
            xmlhttp.overrideMimeType($("meta[http-equiv='Content-Type']").attr("content"));
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4)
                    if (xmlhttp.status == 200) {
                        var objs = $(xmlhttp.responseText).find(container).children()
                        if ($(objs).length == 0) {
                            $("#tempHTML").append($.parseHTML(xmlhttp.responseText));
                            var objs = $("#tempHTML").find(container).children()
                            $("#tempHTML").empty();
                        }

                        //没有最后一页的处理(动态获取)
                        if (item && item["lastpage_"]) {
                            lastnum = item["lastpage_"](xmlhttp.responseText)
                        }

                        //显示当前页进度
                        $("#pageDiv").text(page + "/" + lastnum)

                        //自定义事件
                        if (item && item["ajax"]) {
                            var result = item["ajax"](objs, xmlhttp.responseText)
                            if (result != undefined && result != "") {
                                objs = result
                            }
                        }
                        $(container).append(objs);
                        $("a").attr("target", "_blank")
                        localStorage.setItem(lsName, page);

                        setTimeout(function() {
                            scrollSwitch = true;
                            //防止滚动太快，重复执行
                        }, 1000);
                    }
            }
            xmlhttp.send(null);
        }
    });
}

//元素距离顶部的距离
function getElementTop(element) {
    try {
        var actualTop = element.offsetTop;
        //这是获取元素距父元素顶部的距离
        var current = element.offsetParent;
        //这是获取父元素
        while (current !== null) {
            //当它上面有元素时就继续执行
            actualTop += current.offsetTop;
            //这是获取父元素距它的父元素顶部的距离累加起来
            current = current.offsetParent;
            //继续找父元素
        }
        return actualTop;
    } catch {
        return 0;
    }
}

//copy按钮 ,site 位置,title 需要复制的文本
function copybtn(siteOrObj, textOrFunction) {
    /*
     * 使用说明
    var array=[]
    copybtn(".pagination.pagination", function() {
        $(".thumbnail img").each(function() {
          array.push("http://twhentai.com/" + $(this).attr("src").replace("-thumb265x385", ""))
        });
        return array.join("\r\n")
    })
    copybtn({ "site" :"#titleCopy","btnId":"copytitle1" ,"textareaId":"titleCopy1","btnText":"复制标题"},$(".heading h3").text())
    */
    let site = siteOrObj;
    let btnId = "copytitle99";
    let textareaId = "titleCopy99";
    let btnText = "复制"
    let btnClass = "";
    if (typeof site == "object") {
        site = siteOrObj.site
        btnId = siteOrObj.btnId || btnId
        textareaId = siteOrObj.textareaId || textareaId
        btnText = siteOrObj.btnText || btnText
        btnClass = siteOrObj.btnClass || btnClass
    }
    if ($("#" + btnId).length == 0) {
        $(site).after("<span id='" + btnId + "_canvas'></span>")
        $("#" + btnId + "_canvas").append("<button id='" + btnId + "' style='margin-left:15px;' class='" + btnClass + "'>" + btnText + "</button><textarea type='text' id='" + textareaId + "' style='opacity:0;float:right;'></textarea>")
        $("#" + btnId).on("click", function() {
            var text;
            if (typeof textOrFunction == "function") {
                text = textOrFunction();
            } else {
                text = textOrFunction;
            }
            $("#" + textareaId).val(text)
            var urlresult = document.getElementById(textareaId);
            urlresult.select();
            // 选择对象
            document.execCommand("Copy");
            // 执行浏览器复制命令
        })
    }
}

//添加class类
function addStyle() {
    var styleElement = document.createElement('style');
    styleElement.nodeType = 'text/css';
    var cssStyle1 = ".pageDiv { position: fixed;right: 0px; bottom: 0px;margin-right:20px;color: black;z-index: 99999;}"
    var cssStyle2 = ".pageDiv2 { position: fixed;right: 0px; bottom: 0px;margin-right:20px;background-color: white;z-index: 99999;color: black}"
    styleElement.appendChild(document.createTextNode(cssStyle1));
    styleElement.appendChild(document.createTextNode(cssStyle2));
    var theHead = document.head || document.getElementsByTagName('head')[0];
    theHead.appendChild(styleElement)
}

//正则表达式,获取第一个符合条件
function regxGetOne(str, regx, model) {
    var result = str.match(new RegExp(regx.replace("\\", "\\\\"),model || "g"));
    if (result) {
        return result[0];
    }
}

//正则表达式,获取第一个符合条件
function hrefRegx(regx, model) {
    var result = window.location.href.match(new RegExp(regx.replace("\\", "\\\\"),model || "g"));
    if (result) {
        return result[0];
    }
}