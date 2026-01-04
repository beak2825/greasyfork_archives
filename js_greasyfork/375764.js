// ==UserScript==
// @name         维普期刊详情页真实预览图-免登陆
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @icon         http://www.cqvip.com/favicon.ico
// @description  在期刊文章的详情页，自动将模糊的预览图改为真实的图片（若是没有预览图则用不了此脚本）。对于多页的文章，可以点开预览图后手动下载（另存为jpg格式）再合成PDF。支持本地Aria2-RPC下载（默认6800端口）。
// @description  交流:hokis艾foxmail.com
// @author       Hokis
// @match        http://www.cqvip.com/QK/*/*/*.html
// @match        http://www.cqvip.com/qk/*/*/*.html
// @created        2018-12-20
// @lastUpdated    2020-05-15
// @grant        none
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/375764/%E7%BB%B4%E6%99%AE%E6%9C%9F%E5%88%8A%E8%AF%A6%E6%83%85%E9%A1%B5%E7%9C%9F%E5%AE%9E%E9%A2%84%E8%A7%88%E5%9B%BE-%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/375764/%E7%BB%B4%E6%99%AE%E6%9C%9F%E5%88%8A%E8%AF%A6%E6%83%85%E9%A1%B5%E7%9C%9F%E5%AE%9E%E9%A2%84%E8%A7%88%E5%9B%BE-%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
/* jshint -W097 */

(function($) {
    'use strict';
    var $viewDiv = $("div.pageview");
    //加个按钮
    var $previewBtn_a = $('<a href="javascript:void(0);" style="display:block;float:left;margin: 40px auto 0  20px;color: gray;border-color: gray;background-color: white;border-style: double;text-decoration: line-through;font-size: 20px;line-height: 30px;text-align: center;width: 100px;height: 30px;">高清预览</a>');
    //存在预览图
    if($viewDiv.length == 1){
        $previewBtn_a.css({"color": "red","border-color":"red","background-color": "aliceblue","text-decoration": "none"});
        $previewBtn_a.one('click',function(){getPreviewPic($viewDiv);});
        $viewDiv.find("ul").append($previewBtn_a);
    }
    else{
        var $previewPage = $('<div class="pageview"><ul class="pics"><li></li><div id="cqvip_ad_detailleft2"></div></ul></div>');
        $previewBtn_a.text("无预览图");
        $previewPage.find("ul").append($previewBtn_a);
        $("div.detailinfo").prepend($previewPage);
    }

    function getPreviewPic(viewDiv){
        var url,id,$li;
        //虚的页数，单行最多4页
        var pages = viewDiv.find("ul>li>a");
        //1、从【出　处】解析出的页数
        var actualPages = parseInt(viewDiv.parent().find("b:contains('【出　处】')").parent().next().text().match(/共\d+页/g)[0].replace("共","").replace("页",""));
        //清除浮动
        var $divClear = $('<div style="clear: both;"></div>');
        var tempCount = 0;
        //补充完整
        for(var i=pages.length+1;i<= actualPages;i++){
            if(tempCount%4 === 0){
                //调整大小
                viewDiv.find("ul").append($divClear.clone());
                var nowHeight = viewDiv.find("ul").height();
                nowHeight =(Math.round(i/pages.length)+1)*130;
                viewDiv.height(nowHeight).find("ul").height(nowHeight);
            }
            $li = viewDiv.find("ul>li").eq(0).clone();
            $li.find("i").text("第"+i+"页");
            $li.appendTo(viewDiv.find("ul"));
            tempCount ++;
        }
        //重新获取
        pages = viewDiv.find("ul>li>a");

        //有内容
        if( pages.length > 0){
            url = pages[0].href;
            var tempArr = url.split("id=");
            id = tempArr[tempArr.length-1];

            new Promise(function(resolve,reject){
                $.ajax({
                    url:url,
                    dataType:"html",
                    beforeSend:function(){
                        viewDiv.find("ul > a").text("获取中...");
                    },
                    success:function(result){
                        resolve(result);
                    },
                    error:function(){
                        reject();
                    }
                });
            }).then(function(data){
                var resArr = data.match(/pInfo=(.*?)&/g);
                if(resArr.length > 0){
                    var perurl=window.decodeURIComponent(resArr[0].slice(6,-1));
                    if(perurl.startsWith("http")){
                        var imgArr = new Array(pages.length);
                        //生成URL
                        for(var j = 0; j < pages.length;j++){
                            imgArr[j] = perurl+"&page="+(j+1)+"&lngID="+id;
                        }
                        //执行替换
                        $.each(pages,function(index,p){
                            p.href = imgArr[index];
                            $(p).find("img")[0].src = imgArr[index];
                        });
                    }

                    $previewBtn_a.css("width","150px").text("发送到Aria2");
                    $previewBtn_a.one('click',function(){sendToAria2RPC(imgArr,$(document.querySelector("h1")).text().replace(/[\\\/:\*\?\"<>\|]/g," "));});
                }
            }).catch(function(err){
                viewDiv.find("ul > a").text("高清预览");
            });

        }
    }

    function sendToAria2RPC(urls,path){
        if($.isArray(urls)){
            $.each(urls,function(index,url){
                var json_rpc = {
                    id:'',
                    jsonrpc:'2.0',
                    method:'aria2.addUri',
                    params:[
                        [url],
                        {
                            dir:"downloads/"+path,
                            out:(Array(2).join(0) + (index+1)).slice(-2)+".gif"
                        }
                    ]
                };
                var localRPC='http://127.0.0.1:6800/jsonrpc';
                $.ajax({
                    url:localRPC,
                    type:'POST',
                    crossDomain:true,
                    processData:false,
                    data:JSON.stringify(json_rpc),
                    contentType: 'application/json',
                    success:function(response){
                    },error:function(err){
                        console.log("异常："+err);
                    }
                });
            });
            $previewBtn_a.css({"width":"170px","height":"80px","line-height":"40px"}).text("已获取高清预览并发送至Aria2-RPC");
        }
    }
})(window.jQuery);
