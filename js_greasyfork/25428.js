// ==UserScript==
// @name         javlibrary.com 优化脚本
// @namespace    https://greasyfork.org/zh-CN/users/25794
// @version      1.0.0
// @description  javlibrary.com网站优化脚本，浏览图片内容更方便，你懂的
// @author       Hobby
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @match        http://*.javlibrary.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      blogjav.net
// @connect      pixhost.org

// @copyright    hobby 2016-12-06

// 交流QQ群：273406036
// 内地用户推荐Chrome + Tampermonkey（必须扩展） + XX-Net(代理) + Proxy SwitchyOmega（扩展）的环境下配合使用。

// v1.0.0 针对javlibrary.com网站的支持，支持方便浏览内容

// @downloadURL https://update.greasyfork.org/scripts/25428/javlibrarycom%20%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/25428/javlibrarycom%20%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var common = {
  parsetext: function(text) {
    var doc = null;
    try {
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = text;
      return doc;
    }
    catch (e) {
      alert('parse error');
    }
  },
}

document.addEventListener('DOMContentLoaded', function () {
    $('.socialmedia').remove();
    GM_addStyle('.min{width:66px;min-height: 233px;height:auto;cursor: pointer;}');

    //获取所有番号影片链接的a元素
    var a_array = $("div[class='videothumblist'] a");
    for (var index = 0; index < a_array.length; index++) {
        var aEle = a_array[index];
        $(aEle).attr("target","_blank");
    }

    //获取番号影片详情页的番号  例如：http://www.javlibrary.com/cn/?v=javlilzo4e
    var td_array = $("div[id='video_id'] td[class='text']");
    for (var index = 0; index < td_array.length; index++) {
        var tdEle = td_array[0];
        var AVID = $(tdEle).html();
        console.log("番号输出:"+$(tdEle).html());

        //异步请求搜索blogjav.net的番号
        GM_xmlhttpRequest({
            method: "GET",
            //大图地址
            url: 'http://blogjav.net/?s='+AVID,
            onload: function(result) {
                var doc = common.parsetext(result.responseText)
                var a = doc.getElementsByClassName('more-link')[0];
                if (a) {
                    //异步请求调用内页详情的访问地址
                    GM_xmlhttpRequest({
                        method: "GET",
                        //大图地址
                        url: a.href,
                        headers:{
                            referrer:  "http://pixhost.org/"
                        },
                        onload: function(XMLHttpRequest) {
                            var bodyStr = XMLHttpRequest.responseText;
                            var yixieBody = bodyStr.substring(bodyStr.search(/<span id="more-(\S*)"><\/span>/),bodyStr.search(/<div class="category/));

                            var img_start_idx = yixieBody.search(/"><img .*src="https*:\/\/(\S*)pixhost.org\/thumbs\//);
                            //如果找到内容大图
                            if( img_start_idx > 0)
                            {
                                var new_img_src = yixieBody.substring(yixieBody.indexOf('src',img_start_idx) + 5,yixieBody.indexOf('alt') - 2);
                                //if(XMLHttpRequest.finalUrl.split("#")[1] ==="more-265499") debugger;
                                //if(new_img_src === "") debugger;
                                var targetImgUrl = new_img_src.replace('thumbs','images').replace('//t','//img');
                                //debugger;
                                //var rawImg = document.getElementById(XMLHttpRequest.finalUrl.split("#")[1]);//例如：more-265519 more-265541
                                //debugger;
                                //将新图替换原创建的img元素
                                console.log("图片地址:"+targetImgUrl);

                                var $img = $(document.createElement("img"));
                                $img.attr("src",targetImgUrl);//此不设置，图片出不来
                                $img.attr("style","height:auto;max-width: none;cursor: pointer;");
                                //$img.attr("height","233px");
                                var divEle = $("div[id='video_favorite_edit']")[0];
                                if (divEle) {
                                    $(divEle).after($img);
                                    $img.click(function(){
                                        $(this).toggleClass('min');
                                        if($(this).attr("class")){
                                            this.parentElement.scrollIntoView();
                                        }
                                    });
                                }
                            }
                        },
                        onerror: function(e) {
                            console.log(e);
                        }
                    });//end  GM_xmlhttpRequest
                }
            },
            onerror: function(e) {
                console.log(e);
            }
        });//end  GM_xmlhttpRequest
    }
}, false);