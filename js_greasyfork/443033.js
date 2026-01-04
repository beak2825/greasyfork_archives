// ==UserScript==
// @name         看图外挂手机版
// @namespace    香谢枫林
// @version      1.0.6
// @description  不用翻页即可一键查看套图所有图片，已覆盖女神社、全图网、秀色女神、美女屋、秀人集
// @author       香谢枫林
// @license      MIT
// @match        *://nshens.com/*
// @match        *://inewgirl.com/*
// @match        *://*.quantuwang1.com/*
// @match        *://m.54mn.cc/*
// @include      *://*xsnvshen.*/*
// @include      *://www.jpmn5.*/*
// @include      *://www.xiurenb.*/*
// @match        *://tw.kissgoddess.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443033/%E7%9C%8B%E5%9B%BE%E5%A4%96%E6%8C%82%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/443033/%E7%9C%8B%E5%9B%BE%E5%A4%96%E6%8C%82%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //全图网
    let ViewQuantuwang = function(){
        //第二种：直接图里标题
        let title_div = $(".index_c_title");
        title_div.css("color","red");
        title_div[0].addEventListener("click",function(event){
            // console.log("开始插入图片");
            listPicAll();
        });
        //第一种：设置按钮属性及功能
        let div=document.createElement("div");
        div.innerHTML='<p><a id="qtw_wg" href="javascript:void(0);" style="color: red;background-color:gold;font-size: large" >看图外挂</a></p>';
        div.addEventListener("click",function(event){
            // console.log("开始插入图片");
            listPicAll();
        });
        //在图片左上方添加图片按钮
        let title_tag = document.getElementsByClassName("index_c_tag");
        title_tag[0].appendChild(div);
        //获取图片数量
        let div_img_num = document.getElementsByClassName("index_c_page");
        let img_num = parseInt(div_img_num[0].lastElementChild.innerHTML);
        //找到并获取图片链接
        // let div_img = document.getElementsByClassName("index_c_img");
        let div_img = $(".index_c_img");
        let img_url = div_img.children("a").children("img").attr("src");
        let img_url_str = img_url.substr(0,img_url.length-5);
        let img_name = div_img.children("a").children("img").attr("alt");
        //列出所有图片
        let listPicAll = function () {
            let pic_all = '';
            for(let i=1;i<=img_num;i++){
                let url = img_url_str + i + '.jpg';
                // pic_all = pic_all + '<img style="width: 800px" src="'+url+'" alt="'+img_name+'">';
                pic_all = pic_all + '<img src="'+url+'" alt="'+img_name+'">';
            }
            div_img.children("a")[0].innerHTML = pic_all;
            $('#qtw_wg').text("看图外挂,加载完成");
        };
    };

    //主程序入口，获取url判断网站类型
    let urls = window.location.host;
    if(urls.indexOf("quantuwang") >=0 || urls.indexOf("54mn") >=0){
        console.log("这是全图网");
        ViewQuantuwang();
    }

    //*********************************************
    window.onload = function () {
        //秀色女神
        let ViewXsnvshen = function(){
            //第一种：设置按钮属性及功能
            let div = document.createElement("div");
            div.innerHTML='<div class="star-mod-hd"><i></i><span class="f20 yh c666"><a id="xsnvshen_wg" href="javascript:void(0);" style="color:red;">看图外挂</a></span></div>';
            div.className = "star-mod-hd";
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //插入按钮
            let div_parent = document.getElementsByClassName("container")[0];
            div_parent.insertBefore(div,div_parent.childNodes[5]);
            //第二种：直接图里标题
            let title_div = $("h1").children('a');
            title_div.css("color","red");
            title_div.attr("href","javascript:void(0);");
            title_div[0].addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            let title = $('h1').children('a')[0].innerText; //标题
            //获取图片数量
            let sp_num = $(".container")[0].children[4].children[0].childNodes[1].textContent;
            let img_num = parseInt(sp_num.replace(/[^0-9]/ig,"")); //取出数字就是图片的数量
            //获取图片链接
            let div_img = $("#arcbox").children('p');
            let img_url = div_img.children('img').attr('src')
            let img_url_str = 'https:' + img_url.substr(0,img_url.length-7);
            //列出所有图片
            let listPicAll = function () {
                let pic_all = '';
                for(let i=0;i<img_num;i++){
                    let url = img_url_str + prefix_integer(i,3) + '.jpg';
                    pic_all = pic_all + '<img id="bigImg" src="'+url+'" alt="'+title+'" class="nolazy">';
                }
                div_img[0].innerHTML = pic_all;
                $('#xsnvshen_wg').text("看图外挂,加载完成");
            };
            let prefix_integer = function (num, length) {
                return (Array(length).join('0') + num).slice(-length);
            }
        };
        //美女屋
        let ViewJpxgyw = function(){
            //设置按钮属性及功能
            let div = document.createElement("div");
            div.innerHTML='<strong class="text-success"><i class="fa fa-hand-o-right"></i> </strong><a id="jpxgyw_wg" href="javascript:void(0);"  style="color: red; margin: 10px;">||看图外挂</a>';
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //插入按钮
            document.getElementsByClassName("pull-right")[0].appendChild(div);
            //第二种：直接设置标题
            let title_h1 = $(".article-title");
            title_h1.css("color","red");
            title_h1[0].addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //列出所有图片
            let listPicAll = function () {
                // document.getElementById("jpxgyw_wg").innerHTML="看图外挂,加载ing";
                // $('#jpxgyw_wg').text("看图外挂,加载ing");
                //获取标题
                let title = $('.article-title')[0].innerText; //标题
                let page = $(".pagination");
                let page_current = $('.current')[0].innerHTML;//判断是否是第一页
                let page_url = '';
                let page_url_str = '';
                let page_num = '';
                if(page_current == 1){
                    page_url = page.children('ul').children('a')[0]['href'];
                    page_url_str = page_url.substr(0,page_url.length-5);
                    page_num = page.children('ul').children('a').length/2-1;
                }else{
                    page_url = page.children('ul').children('a')[1]['href'];
                    page_url_str = page_url.substr(0,page_url.length-5);
                    page_num = page.children('ul').children('a').length/2-2;
                }
                //获取首页图片数据
                let img_p = $(".article-content").children("p");
                let img_p_num = img_p.children('img').length;
                let pic_all = '';
                //获取首页图片
                for(let i=0;i<img_p_num;i++){
                    pic_all = pic_all + '<img src="'+img_p.children('img')[i]['src']+'" alt="'+title+'"><br><br>';
                }
                //获取其他标签页的图片
                for(let i=1;i<=page_num;i++){
                    let page_urls = page_url_str+"_"+i+".html";
                    pic_all = getPaginationPicUrl(pic_all,page_urls,title);
                }
                img_p[0].innerHTML = pic_all;
                // console.log(pic_all);
                $('#jpxgyw_wg').text("看图外挂,加载完成");
            };
            //获取指定页面的图片
            let getPaginationPicUrl = function (pic_all,page_url,title) {
                $.ajaxSettings.async = false;
                $.get(page_url,function (data) {
                    console.log('获取返回值');
                    let res_img_num = $(data).find(".article-content").children("p").children('img').length;
                    for(let i=0;i<res_img_num;i++){
                        pic_all = pic_all + '<img src="'+$(data).find(".article-content").children("p").children('img')[i]['src']+'" alt="'+title+'"><br><br>';
                        // $(data).find(".article-content").children("p").children('img')[0]['src']
                    }
                });
                $.ajaxSettings.async = true;
                return pic_all;
            };
        };
        //女神社
        let ViewNshens = function () {
            //设置按钮属性及功能
            let div=document.createElement("div");
            div.innerHTML='<a id="nshens_wg" href="javascript:void(0);" class="ma-2 v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default red" style="color: white; margin: 10px;"><span class="v-btn__content">看图外挂</span></a>';
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
                //去掉顶部header，影响看图
                $('header').remove();
            });
            //在H3标题后插入按钮
            let title = $('h3')[0];
            let title_str = title.innerText; //标题
            let str5 = title_str.substr(title_str.length-5); //取标题后5位
            let pic_num = parseInt(str5.replace(/[^0-9]/ig,"")); //取出数字就是图片的数量
            let parent = null;
            parent = title.parentNode;
            parent.appendChild(div);
            //获取第一张图片链接
            let div_parent = null;
            let div_nav = document.getElementsByClassName("v-image__image v-image__image--cover");
            div_parent = div_nav[0].parentNode.parentNode;
            let pic_url = div_parent['href']; //第一张图片url
            let str_l = pic_url.substr(pic_url.length-6,6);//判断后缀
            let k,k_pic,url_str = '';
            if(str_l.indexOf("/") !== -1){
                k = pic_url.substr(pic_url.length-5,1);
                k_pic = pic_url.substr(pic_url.length-4,4);
                url_str = pic_url.substr(0,pic_url.length-5);
            }else {
                k = pic_url.substr(pic_url.length-6,1);
                k_pic = pic_url.substr(pic_url.length-5,5);
                url_str = pic_url.substr(0,pic_url.length-6);
            }
            //列出所有图片
            let listPicAll = function () {
                let pic_all = '';
                let img_ratio = 150;
                for(let i=k;i<pic_num;i++){
                    let url = url_str + i + k_pic;
                    pic_all = pic_all + '<a href="'+url+'" target="_blank"><div aria-label="'+title_str+'" role="img" class="v-image v-responsive theme--light" style="min-height: 300px; min-width: 200px;"><div id="dv_'+i+'"  class="v-responsive__sizer" style="padding-bottom:  '+img_ratio+'%;"></div><div class="v-image__image v-image__image--cover" style="background-image: url('+url+'); background-position: center center;"></div><!----><div class="v-responsive__content post-item-image" style="width: 1200px;"></div></div></a>';
                }
                div_parent.parentNode.innerHTML = pic_all;
                for(let i=k;i<pic_num;i++){
                    let url = url_str + i + k_pic;
                    PicRatios(url,i);
                }
                $('#nshens_wg').text("看图外挂,加载完成");
            };
            function PicRatios(url,i){
                let dv_id = "dv_"+i;
                let img_ratio = 150;
                let img =new Image();
                img.src=url;
                var timer_info = setInterval(
                    function () {
                        if(img.width > 0||img.height >0){
                            clearInterval(timer_info);
                            img_ratio = Math.ceil(100 * (img.height/img.width));
                            $("#"+dv_id+"").css("padding-bottom", img_ratio+"%");
                            // console.log("第"+i+"张图尺寸："+img_ratio);
                        }
                    },40);
            }
        };
        //秀人集
        let ViewXiurenb = function(){
            //第一种：设置按钮属性及功能
            let div = document.createElement("div");
            // div.className = "jianjie";
            div.innerHTML='<a href="javascript:void(0);"><span id="xiurenb_wg" style="color: red;font-size: x-large">||看图外挂</span></a>';
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //插入按钮
            $(".item_title")[1].appendChild(div);
            //第二种：直接设置标题
            let title_h1 = $("h1");
            title_h1.css("color","red");
            title_h1[0].addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //列出所有图片
            let listPicAll = function () {
                let title = $('h1')[0].innerText; //标题
                let page = $(".page");
                let page_current = $('.current')[0].innerHTML;//判断是否是第一页
                let page_url = '';
                let page_url_str = '';
                let page_num = '';
                if(page_current == 1){
                    page_url = page.children('a')[1]['href'];
                    page_url_str = page_url.substr(0,page_url.length-5);
                    page_num = page.children('a').length/2-2;
                }else{
                    page_url = page.children('a')[2]['href'];
                    page_url_str = page_url.substr(0,page_url.length-5);
                    page_num = page.children('a').length/2-3;
                }
                //获取首页图片数据
                let img_p = $(".content").children("p");
                let img_p_num = img_p.children('img').length;
                let pic_all = '';
                //获取首页图片
                for(let i=0;i<img_p_num;i++){
                    pic_all = pic_all + '<img src="'+img_p.children('img')[i]['src']+'" alt="'+title+'"><br><br>';
                }
                //获取其他标签页的图片
                for(let i=1;i<=page_num;i++){
                    let page_urls = page_url_str+"_"+i+".html";
                    pic_all = getPaginationPicUrl(pic_all,page_urls,title);
                }
                // $(".content").children("p").attr({style:"width:800px"});//设置居中
                // $(".content").attr('align','center');//设置宽度800px
                img_p[0].innerHTML = pic_all;
                // console.log(pic_all);
                $('#xiurenb_wg').text("看图外挂,加载完成");
            };
            //获取指定页面的图片
            let getPaginationPicUrl = function (pic_all,page_url,title) {
                $.ajaxSettings.async = false;
                $.get(page_url,function (data) {
                    console.log('获取返回值');
                    let res_img_num = $(data).find(".content").children("p").children('img').length;
                    for(let i=0;i<res_img_num;i++){
                        pic_all = pic_all + '<img src="'+$(data).find(".content").children("p").children('img')[i]['src']+'" alt="'+title+'"><br><br>';
                        // $(data).find(".article-content").children("p").children('img')[0]['src']
                    }
                });
                $.ajaxSettings.async = true;
                return pic_all;
            };
        };

        //主程序入口，获取url判断网站类型
        let url = window.location.host;
        if(url.indexOf("xsnvshen") >=0) {
            console.log("这是秀色女神");
            ViewXsnvshen();
        }else if(url.indexOf("jpmn5") >=0) {
            console.log("这是美女屋");
            ViewJpxgyw();
        }else if(url.indexOf("nshens") >=0 || url.indexOf("inewgirl") >=0) {
            console.log("这是女神社");
            ViewNshens();
        }else if(url.indexOf("xiurenb") >=0) {
            console.log("这是秀人集");
            ViewXiurenb();
        }
    }
})();