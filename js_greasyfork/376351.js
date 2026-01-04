// ==UserScript==
// @name              115艾薇预览
// @namespace     http://tampermonkey.net/
// @version           1.6
// @description     115登录后自动跳转到文件界面、文件界面放大、自动获取艾薇封面+标题
// @author            kyay006
// @include           https://115.com/home/userhome
// @include           https://115.com/?*mode=wangpan*
// @domain           avmask.com
// @domain           avsox.asia
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376351/115%E8%89%BE%E8%96%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/376351/115%E8%89%BE%E8%96%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href === "https://115.com/home/userhome")
        window.location = "https://115.com/?mode=wangpan";
    else
    {
        var item_list,item_obj,item_name;
        var ifr = $("iframe[style='position: absolute; top: 0px;']");
        $("div#js-main_mode").css("display","none");
        $("div.main-core").css("left","0");
        ifr.load(
            function(){
                setCss();
                addMarkButton();
                item_list = ifr.contents().find("body").find("div#js_data_list");
                item_list.mouseenter(
                    function(){
                        if($("div.exph-loader").css("display") === "none" && !(item_list.find("div#isload").length)){
                            item_list.append("<div id='isload'></div>");
                            itemEvent();
                        }
                    }
                );
            }
        );
    }

    function addMarkButton(){
        var read_mark = `
            <li id="read_mark">
                <a id="add_mark" class="mark" href="javascript:;">标记已阅</a>
                <a id="del_mark" class="mark" href="javascript:;">取消已阅</a>
            </li>
        `;
        ifr.contents().find("body").mouseup(
            function(event){
                if(event.button == 2){
                    setTimeout(function(){
                        $("div#js_float_content").find("li[val='open_dir']").after(read_mark);
                        if($("li#read_mark").length){
                            showMarkButton(item_name);
                            $("a#add_mark").click(
                                function(){
                                    GM_setValue(item_name,"1");
                                    showMarkButton(item_name);
                                    item_obj.find("i[class$='folder']").append("<i class='mark_ico'></i>");
                                    $("div#js_float_content").css("display","none");
                                    $("body div").last().css("display","none");
                                }
                            );
                            $("a#del_mark").click(
                                function(){
                                    GM_deleteValue(item_name);
                                    showMarkButton(item_name);
                                    item_obj.find("i.mark_ico").remove();
                                    $("div#js_float_content").css("display","none");
                                    $("body div").last().css("display","none");
                                }
                            );
                            ifr.contents().find("body").unbind("mouseup");
                        }
                    },50);
                }
            }
        )
    }

    function getVideoCode(title){
        var t = title.match(/[A-Za-z]+\-\d+/);
        if(!t){
            t = title.match(/heyzo[\-\_]?\d{4}/);
        }
        if(!t){
            t = title.match(/\d{6}[\-\_]\d{3}/);
        }
        if(!t){
            t = title.match(/[A-Za-z]+\d+/);
        }
        return t;
    }

    function getVideoInfo(id){
        var info = "<div id='" + id + "' class='item_info'></div>";
        item_list.append(info);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://avmask.com/cn/search/" + id,
            onload: xhr => {
                var xhr_data = $(xhr.responseText);
                if(!(xhr_data.find("div.alert").length)){
                    var title = xhr_data.find("div.photo-info span").html();
                    var item_info = item_list.find("#" + id);
                    var info_html ="<div class='item_border'><h4>" + title + "</h4></div>";
                    item_info.append(info_html);
                    var img = xhr_data.find("div.photo-frame img").attr("src").replace("ps.j","pl.j");;
                    item_info.find(".item_border").append("<img src='" + img + "'>");
                }else{
                    getUncensored(id);
                }
            }
        })
    }

    function getUncensored(id){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://avsox.asia/cn/search/" + id,
            onload: xhr => {
                var xhr_data = $(xhr.responseText);
                if(!(xhr_data.find("div.alert").length)){
                    var title = xhr_data.find("div.photo-info span").html();
                    var item_info = item_list.find("#" + id);
                    var info_html ="<div class='item_border'><h4>" + title + "</h4></div>";
                    item_info.append(info_html);
                    var details_url = xhr_data.find("a.movie-box").attr("href");
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: details_url,
                        onload: temp => {
                            var img = $(temp.responseText).find("a.bigImage").attr("href");
                            item_info.find(".item_border").append("<img src='" + img + "'>");
                        }
                    });
                }
            }
        })
    }

    function getMarkList(items){
        for(var i=0;i<items.length;i++){
            if(GM_getValue($(items[i]).attr("title")))
                $(items[i]).find("i[class$='folder']").append("<i class='mark_ico'></i>");;
        }
    }

    function hiddenVideoInfo(id){
        item_list.find("div#" + id).css("display","none");
    }

    function itemEvent(){
        var item = item_list.find("li");
        getMarkList(item);
        item.mouseenter(
            function(f){
                item_name = $(this).attr("title");
                var id = getVideoCode(item_name);
                if(id){
                    if(!(item_list.find("div#"+id).length))
                        getVideoInfo(id);
                    showVideoInfo(item_list.find("div#"+id),f.clientX,f.clientY);
                }
            }
        );
        item.mouseleave(
            function(){
                item_name = $(this).attr("title");
                hiddenVideoInfo(getVideoCode(item_name));
            }
        );
        item.mouseup(
            function(event){
                item_obj = $(this);
                item_name = $(this).attr("title");
                hiddenVideoInfo(getVideoCode(item_name));
                if(event.button == 2)
                    showMarkButton(item_name);
            }
        );
    };

    function setCss(){
        $("head").append(`
            <style type='text/css'>
                #read_mark .mark{
                    display:none;
                }
                #read_mark .mark-show{
                    display:block;
                }
            </style>
        `);
    	ifr.contents().find("head").append(`
        	<style type='text/css'>
                #js_data_list i.mark_ico{
                    width:40px;
                    height:40px;
                    position:absolute;
                    top:14px;
                    left:12px;
                    background-image:url(data:image/png;base64,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);
                }
        		.item_info{
        			display:none;
        			width:400px;
        			position:fixed;
        			z-index:100;
        			border-radius:5px;
        			background:rgba(248,248,255,0.7);
        		}
        		.item_border{
                    margin:5px;
        			padding:5px 5px 0px 5px;
        			border:1px solid gray;
        			border-radius:5px;
        		}
        		.item_border h4{
        			margin-bottom:5px;
        		}
        		.item_border img{
        			width:100%;
        		}
        	</style>
        `);
    }

    function showMarkButton(name){
        if(!(GM_getValue(name))){
            $("#del_mark").removeClass("mark-show");
            $("#add_mark").addClass("mark-show");
        }
        else{
            $("#add_mark").removeClass("mark-show");
            $("#del_mark").addClass("mark-show");
        }
    }

    function showVideoInfo(ele, x, y){
        if(x + 400 > ifr.width())
            x = x - 400;
        var ty = y + 326;
        if(ty > ifr.height())
            y = y - (ty - ifr.height());
        ele.css("left",x);
        ele.css("top",y);
        ele.css("display","block");
    }


})();