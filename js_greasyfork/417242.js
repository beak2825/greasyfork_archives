// ==UserScript==
// @name         Similar Picture
// @namespace    com.hct.similar
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.2
// @description  upload image to same images
// @description:zh-cn   上传图片找相似
// @author       叶落风霜
// @match        http*://*/*
// @grant        GM_xmlhttpRequest
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/417242/Similar%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/417242/Similar%20Picture.meta.js
// ==/UserScript==

(function() {
    appendHtml();
    $("body").on('click', function (e) {
        var menu = document.getElementById("menu_div");
        menu.style.display = "none"
    });
})();
var imageUrl="";
function appendHtml(){

    document.body.setAttribute("style", "box-sizing: content-box;-webkit-box-sizing: content-box;");
    var menu_div = document.createElement("div");
    menu_div.setAttribute("id", "menu_div");
    menu_div.setAttribute("style", "width:220px;font-size: 14px;font-family: '微软雅黑';border: 1px solid #ccc;position:fixed;left:0;top:0;display: none;background: #f2f2f2;z-index:99999999;color: rgb(113 82 82);");
    document.body.appendChild(menu_div);

    var menu_ul = document.createElement("ul");
    menu_ul.setAttribute("style", "margin: 0px;padding: 0px;text-align: center;min-height:57px;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_div.appendChild(menu_ul);

    var menu_li = document.createElement("li");
    menu_li.setAttribute("id", "taobao");
    menu_li.setAttribute("class", "menu_li");
    menu_li.setAttribute("style", "padding-top: 7px;font-size: 16px;height:25px;cursor:pointer;border-bottom:1px solid #ddd;display:block;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_ul.appendChild(menu_li);

    var img_li = document.createElement("img");
    img_li.setAttribute("src", "https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/taobao_16px.png");
    img_li.setAttribute("style", "width:16px;height:16px;float:left;padding-left:10px;padding-top:1px;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_li.appendChild(img_li);

    var p_li = document.createElement("span");
    p_li.innerHTML = "TaoBao Similar Picture";
    p_li.setAttribute("style", "float:left;padding-left:10px;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_li.appendChild(p_li);

    var menu_vvic_li = document.createElement("li");
    menu_vvic_li.setAttribute("id", "vvic");
    menu_vvic_li.setAttribute("class", "menu_li");
    menu_vvic_li.setAttribute("style", "padding-top: 7px;font-size: 16px;height:25px;cursor:pointer;display:block;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_ul.appendChild(menu_vvic_li);

    var img_vvic_li = document.createElement("img");
    img_vvic_li.setAttribute("src", "https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/vvic.ico");
    img_vvic_li.setAttribute("style", "width:16px;height:16px;float:left;padding-left:10px;padding-top:1px;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_vvic_li.appendChild(img_vvic_li);

    var p_vvic_li = document.createElement("span");
    p_vvic_li.innerHTML = "VVIC Similar Picture";
    p_vvic_li.setAttribute("style", "float:left;padding-left:10px;box-sizing: content-box;-webkit-box-sizing: content-box;");
    menu_vvic_li.appendChild(p_vvic_li);

    var menu = document.getElementById("menu_div");
    document.oncontextmenu = function(e) {
        var evt = e || window.event;
        if("IMG"==evt.path[0].tagName){
            imageUrl = $(evt.path[0]).attr("src");
            //鼠标点的坐标
            var oX = e.clientX;
            var oY = e.clientY;
            //菜单出现后的位置
            menu.style.display = "block";
            menu.style.left = oX + "px";
            menu.style.top = oY + "px";
            //阻止浏览器默认事件
            return false;
        }else{
            menu.style.display = "none";
        }
    }
    menu_li.onclick = function(e) {
        e.cancelBubble = true;
        if(imageUrl.indexOf("http")<0){
            imageUrl = "http:"+imageUrl;
        }
        console.log("请稍等，正在上传图片："+imageUrl);
        toUploadImage(imageUrl);
        menu.style.display = "none";
    }

    menu_vvic_li.onclick = function(e) {
        e.cancelBubble = true;
        alert("功能开发中..");
    }

    $(".menu_li").on('mouseover', function (e) {
        var name = $(e.currentTarget).attr("id");
        $("#"+name).css("background-color","rgb(56 93 50)");
        $("#"+name).css("color","#fff");
    });
    $(".menu_li").on('mouseout', function (e) {
        var name = $(e.currentTarget).attr("id");
        $("#"+name).css("background-color","#f2f2f2");
        $("#"+name).css("color","rgb(113 82 82)");
    });
}
function toUploadImage(imageUrl){
    var url= "http://hagoto.com:8096/collect/taobao/uploadImage";
    var params = {"imageUrl":imageUrl};
    GM_xmlhttpRequest({
            method: "POST",
            url: url,
            dataType: "json",
            data: JSON.stringify(params),
            headers:  {
                "Content-Type": "application/json"
            },
            onload: function(xhr) {
                if(xhr.readyState==4&&xhr.status==200){
                    var jsondata = JSON.parse(xhr.responseText);
                    if(jsondata.code=="2001"){
                        alert(jsondata.msg);
                        return;
                    }
                    var path = jsondata.data;
                    console.log("上传后图片地址："+path);
                    var filename = path;
                    if(path.indexOf("/")>0){
                        filename=path.substring(path.lastIndexOf("/")+1,path.length);
                    }
                    var same_url = "https://s.taobao.com/search?app=imgsearch&tfsid="+filename;
                    window.open(same_url,"_blank")
                }
            }
        });
}