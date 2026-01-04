// ==UserScript==
// @name         微软搞事(MSDN订户显示)
// @version      0.3
// @description  药丸
// @author       InoriHimea
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        *://msdn.microsoft.com/*/subscriptions/downloads/*
// @match        *://msdn.microsoft.com/subscriptions/downloads/*
// @match        *://msdn.microsoft.com/*/subscriptions/securedownloads/*
// @match        *://msdn.microsoft.com/subscriptions/securedownloads/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/136944
// @downloadURL https://update.greasyfork.org/scripts/31031/%E5%BE%AE%E8%BD%AF%E6%90%9E%E4%BA%8B%28MSDN%E8%AE%A2%E6%88%B7%E6%98%BE%E7%A4%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31031/%E5%BE%AE%E8%BD%AF%E6%90%9E%E4%BA%8B%28MSDN%E8%AE%A2%E6%88%B7%E6%98%BE%E7%A4%BA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#SubMigratedMessageArea").remove();
    
    window.setTimeout(function(){
        var length = $(".detailrow").length;
            
        if (length > 0) {
            $(".buttonscolumn").each(function(index){
                $(this).remove();
            });
        }
    },1500);
    
    window.setTimeout(function(){
        $("#DownloadsArea").fadeIn(1000,function(){

            $(".newSubscriberDownloadProducts").click(function(){
                let href = $(this).find("a").attr("href");
                let value = href.substr(href.indexOf("#"),(href.length - href.indexOf("#")));
                window.location.href += value;
                window.location.reload();
            });
         
            var length = $(".detailrow").length;
            console.log("length:" + length);
            
            if (length > 0) {
                $(".detailrow").each(function(index){
                    let id = $(this).find("div")[0].id;
                    //console.log(id);
                    let postId = id.substr(4,id.length);
                    //console.log(postId);

                    let $detail = $("<label class=\"detailtitle\">文件名：</label><label id=\"filenameLabel\"></label><br/><label class=\"detailtitle\">语言：</label><label id=\"languagesLabel\"></label><br/><label class=\"detailtitle\">SHA1：</label><label id=\"sha1Label\"></label><br/><label class=\"detailtitle\">大小：</label><label id=\"sizeLabel\"></label>");

                    $("#" + id).append($detail);
                    $("#" + id).css("display","block");

                    let postUrl = "https://msdn.microsoft.com/en-us/subscriptions/securejson/GetFileDetail";
                    let postData = {"fileId":postId,"brand":"MSDN"};
                    $.ajax({
                        url : postUrl,
                        type : "POST",
                        data : postData,
                        dataType : "json",
                        success : function(json){
                            $(".detailrow").eq(index).find("#filenameLabel").text(json.FileName);
                            $(".detailrow").eq(index).find("#languagesLabel").text(json.Languages[0]);
                            $(".detailrow").eq(index).find("#sha1Label").text(json.Sha1Hash);
                            $(".detailrow").eq(index).find("#sizeLabel").text(json.Size);
                        }
                    });
                });
            }
        });
    },2000);
})();