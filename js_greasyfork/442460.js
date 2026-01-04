// ==UserScript==
// @name         看图外挂
// @namespace    香谢枫林
// @version      2.2.0
// @description  不用翻页即可一键查看套图所有图片，更新适配女神社、秀色女神、小黄书、hitxhot||nshens.com;www.xsnvshen.com;xchina.co;www.hitxhot.org
// @author       香谢枫林
// @license      MIT
// @match        *://nshens.com/*
// @match        *://inewgirl.com/*
// @include      *://*xsnvshen.*/*
// @include      *://www.hitxhot.*/*
// @include      *://xchina.co/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/442460/%E7%9C%8B%E5%9B%BE%E5%A4%96%E6%8C%82.user.js
// @updateURL https://update.greasyfork.org/scripts/442460/%E7%9C%8B%E5%9B%BE%E5%A4%96%E6%8C%82.meta.js
// ==/UserScript==


(function() {
    'use strict';
    unsafeWindow.CollectPic = function(name,url) {
        // console.log(name);
        // console.log(url);
        // console.log("http://180.76.104.21:82/server.php?pagetype=9&flodername="+name+"&imageurl="+url);
        let r = confirm("是否收藏！");
        if(r == true){
            GM_xmlhttpRequest({
                method:"GET",
                url:"http://180.76.104.21:82/server.php?pagetype=9&flodername="+name+"&imageurl="+url,
                onload:function (data){
                    // console.log(data);
                    let dt = JSON.parse(data.response);
                    if(dt.result == true){
                        console.log('已收藏！');
                    }else{
                        alert("收藏失败！");
                    }
                }
            })
        }
    };

    window.onload = function () {
        //秀色女神
        let ViewXsnvshen = function(){
            //设置按钮属性及功能
            let div = document.createElement("div");
            div.innerHTML='<div class="lm_name"><i></i><span class="f20 yh c666"><a id="xsnvshen_wg" href="javascript:void(0);" style="color:red;">看图外挂</a></span></div>';
            div.className = "wrapper1083 show_box_01";
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //插入按钮
            let div_parent = document.getElementsByClassName("longConWhite");
            div_parent[0].insertBefore(div,div_parent[0].childNodes[4]);

            let title_str = $('h1').children('a')[0].innerText; //标题
            //获取图片数量
            let sp_num = $(".swp-tool").children('em')[0].childNodes[1].textContent;
            let img_num = parseInt(sp_num.replace(/[^0-9]/ig,"")); //取出数字就是图片的数量
            //获取图片链接
            let div_img = $(".workShow").children('ul').children('li');
            let img_url = div_img.children('img').attr('src')
            let img_url_str = 'https:' + img_url.substr(0,img_url.length-7);
            //列出所有图片
            let listPicAll = function () {
                let pic_all = '';
                for(let i=0;i<img_num;i++){
                    let url = img_url_str + prefix_integer(i,3) + '.jpg';
                    // pic_all = pic_all + '<img id="bigImg" src="'+url+'" alt="'+title+'" class="mb10" style="max-width: 900px; height: auto;">';
                    pic_all = pic_all + '<a href="javascript:void(0);" onclick="CollectPic(\''+title_str+'\',\''+url+'\');"><img src="'+url+'" alt="'+title_str+'" class="mb10" style="max-width: 900px; height: auto;"></a>';
                }
                div_img[0].innerHTML = pic_all;
                $('#xsnvshen_wg').text("看图外挂,加载完成");
            };
            let prefix_integer = function (num, length) {
                return (Array(length).join('0') + num).slice(-length);
            }
        };

        //女神社
        let ViewNshens = function () {
            //设置按钮属性及功能
            let div=document.createElement("div");
            div.innerHTML='<a id="nshens_wg" href="javascript:void(0);" class="ma-2 v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default red" style="color: white; margin: 10px;"><span class="v-btn__content">看图外挂</span></a>';
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
                $('header').remove();//去掉顶部header，影响看图
            });
            let title = $('h3')[0];
            let title_str = title.innerText; //标题
            let pic_num = get_pic_num();//···通过函数，取出套图数量
            console.log("pic_num",pic_num);
            let parent = null;
            parent = title.parentNode;
            parent.appendChild(div);//···在H3标题后插入按钮
            //获取第一张图片链接
            let div_parent = null;
            let div_nav = document.getElementsByClassName("text-center");
            div_parent = div_nav[0].parentNode;
            let pic_url = div_parent.children[2].children[0].children[0]['href']; //第一张图片url
            let length_str_l = parseInt(pic_url.length) - parseInt(pic_url.lastIndexOf("/")); //判断/位置距离末尾的长度
            let str_l = pic_url.substr(pic_url.length-6,6);//判断后缀
            let k,k_pic,url_str = '';
            if(length_str_l > 10){ //如果length_str_l长度大于10，说明图片不是数字，需要获取每页图片
                k = 0;
                k_pic = pic_url.substr(pic_url.length-5,5);
                url_str = pic_url.substr(0,pic_url.length-length_str_l+1);
            }else { //说明图片是数字，可以直接列出所有图片ID
                if(str_l.indexOf("/") !== -1){
                    k = pic_url.substr(pic_url.length-5,1);
                    k_pic = pic_url.substr(pic_url.length-4,4);
                    url_str = pic_url.substr(0,pic_url.length-5);
                }else {
                    k = pic_url.substr(pic_url.length-6,1);
                    k_pic = pic_url.substr(pic_url.length-5,5);
                    url_str = pic_url.substr(0,pic_url.length-6);
                }
            }
            //列出所有图片
            let listPicAll = function() {
                let pic_all = '';
                let img_ratio = 150;
                if(k == 0){
                    $('#nshens_wg').text("VIP图片无法加载");
                    return;
                }else {
                    for(let i=k;i<pic_num;i++){
                        let url = url_str + i + k_pic;
                        // console.log("Picurl:"+url);
                        pic_all = pic_all + '<a href="javascript:void(0);" onclick="CollectPic(\''+title_str+'\',\''+url+'\');"><div aria-label="'+title_str+'" role="img" class="v-image v-responsive theme--light" style="min-height: 300px; min-width: 200px;"><div id="dv_'+i+'"  class="v-responsive__sizer" style="padding-bottom:  '+img_ratio+'%;"></div><div class="v-image__image v-image__image--cover" style="background-image: url('+url+'); background-position: center center;"></div><!----><div class="v-responsive__content post-item-image" style="width: 1200px;"></div></div></a>';
                    }
                }
                //把图片插入网页中
                div_parent.children[2].children[0].innerHTML = pic_all;
                //刷新所有图片的尺寸
                for(let i=k;i<pic_num;i++){
                    let url = url_str + i + k_pic;
                    PicRatios(url,i);
                }
                $('#nshens_wg').text("看图外挂,加载完成");
            };
            //获取图片的标题和数量
            function get_pic_num(){
                let pic_num = 100; //默认设置为100张
                let title = $('h3')[0];
                let title_str = title.innerText; //标题
                let title_str_p = title_str.match(/(\d+)P/g);//取出标题中数字P，需要判空
                let pic_num_title = null;
                if(title_str_p){
                    pic_num_title = title_str_p.toString().replace(/\D+/g, '');//不为空，取数字就是图片数量
                }
                let describe = $('h3')[0].parentNode.parentNode.innerHTML;//套图描述
                // let describe = $('h3')[0].parentNode.parentNode.children[5].children[0].children[0].children[0].innerHTML;//套图描述
                let describe_p = describe.match(/(\d+)P/g);//描述中的数字P，需要判空
                let pic_num_describe = null;
                if(describe_p){
                    pic_num_describe = describe_p.toString().replace(/\D+/g, '');//不为空，取数字就是图片数量
                }
                if(pic_num_title){ //如果标题有图片数，就取标题的；
                    pic_num = pic_num_title;
                }else if(pic_num_describe){     //如果描述中有图片数量，就取图片的
                    pic_num = pic_num_describe;
                }
                return pic_num;
            }
            //刷新所有图片的尺寸
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

        //hitxhot
        let hitxhot = function (){
            //设置按钮属性及功能
            let div = document.createElement("div");
            // div.className = "jianjie";
            div.innerHTML='<a href="javascript:void(0);"><span class="box-mt-output" id="hitxhot_wg" style="color: yellow;">||看图外挂</span></a>';
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //插入按钮
            document.getElementsByClassName("BRBOVJR")[0].children[0].appendChild(div);
            //列出所有图片
            let listPicAll = function () {
                let title = document.title;//标题字符串
                let title_page = title.substr(title.length-6,6);
                let page_num = title_page.substr(title_page.indexOf("/")+1,3);//图集总页数
                let title_str = title.substring(title.indexOf("Hot:")+5,title.indexOf("|")-1);//图集名称
                let page = $(".page");  //网页url
                let page_url = $(".page")['prevObject'][0]['location']['origin'] + $(".page")['prevObject'][0]['location']['pathname'];
                //获取所有标签页的图片
                let pic_all = '';
                for(let i=1;i<=page_num;i++){
                    let page_urls = page_url+"?page="+i;
                    pic_all = getPaginationPicUrl(pic_all,page_urls,title_str);
                }
                document.getElementsByClassName("VKSUBTSWA")[0].innerHTML = pic_all;
            };
            //获取指定页面的图片
            let getPaginationPicUrl = function (pic_all,page_url,title) {
                $.ajaxSettings.async = false;
                $.get(page_url,function (data) {
                    console.log('获取返回值');
                    let img_p = $(data).find(".VKSUBTSWA").children('a');
                    let res_img_num = $(data).find(".VKSUBTSWA").children('a').length;
                    for(let i=0;i<res_img_num;i++){
                        pic_all = pic_all + '<a href="javascript:void(0);" onclick="CollectPic(\''+title+'\',\''+img_p[i].children[0].src+'\');"><img src="'+img_p[i].children[0].src+'" alt="'+title+'"></a><br><br>';
                        // $(data).find(".article-content").children("p").children('img')[0]['src']
                    }
                });
                $.ajaxSettings.async = true;
                return pic_all;
            };
        }

        //xchina--小黄书
        let xchina = function (){
            //清除广告
            $(".article.banner_ad").remove();
            // $("div[class='item']").remove();
            //设置按钮属性及功能
            let div = document.createElement("div");
            div.innerHTML='<div><span><i class="fa fa-tags"></i><a href="javascript:void(0);" id="xchina_wg" style="color: red;">>>看图外挂</a></span></div>';
            div.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll();
            });
            //设置第二种按钮属性及功能
            let div2 = document.createElement("div");
            div2.innerHTML='<div><span><i class="fa fa-tags"></i><a href="javascript:void(0);" id="xchina_wg2" style="color: orange;">>>看图外挂S</a></span></div>';
            div2.addEventListener("click",function(event){
                // console.log("开始插入图片");
                listPicAll2();
            });
            //插入按钮
            document.getElementsByClassName("tab-content video-info")[0].children[0].appendChild(div);
            document.getElementsByClassName("tab-content video-info")[0].children[0].appendChild(div2);
            let title = $("meta[name='twitter:title']")[0].content;//标题
            // let pic_num = parseInt($("div[target='photoCount']")[0].innerText.replace(/[^0-9]/ig,""));
            let pic_num_str = document.getElementsByClassName("photos")[0].children[0].children[0].children[0].alt;
            let pic_num_str_s = pic_num_str.split("/");
            let pic_num = pic_num_str_s[pic_num_str_s.length - 1].replace(/[^0-9]/ig,"")
            let pic_url = $("meta[name='twitter:image']")[0].content;
            let url_str = pic_url.substr(0,pic_url.length-8);
            //列出所有图片
            let listPicAll = function () {
                //清除影响观看效果的内容
                $("nav").remove();
                let page = window.location.href;
                let page_str = page.substr(-7,1);
                let page_url_str = page.substr(0,page.length-5);
                if(page_str == "/"){
                    page_url_str = page.substr(0,page.length-7);
                }
                let pic_page = Math.ceil(pic_num/17);
                let pic_all = "";
                for(let i=1;i<=pic_page;i++){
                    let page_url = page_url_str + '/' + i + '.html';
                    pic_all = pic_all + getPageContent(page_url);
                }
                $("div[class='photos']")[0].innerHTML = pic_all;
                $('#xchina_wg').text("看图外挂,加载完成");
                $("div[class='item']").remove();
                $("div[class='top']").remove();
            }
            //列出所有图片2
            let listPicAll2 = function () {
                //清除影响观看效果的内容
                $("nav").remove();
                $("div[class='top']").remove();
                let pic_all = '';
                for(let i=1;i<=pic_num;i++){
                    let url = url_str + prefix_integer(i,4) + '_800x0.jpg';
                    let url_original = url_str + prefix_integer(i,4) + '.jpg';
                    // pic_all = pic_all + '<a href="'+url_original+'" target="_blank"><img class="cr_only" src="'+url+'" alt="'+title+'"></a>';
                    pic_all = pic_all + '<a href="javascript:void(0);" onclick="CollectPic(\''+title+'\',\''+url_original+'\');"><img class="cr_only" src="'+url+'" alt="'+title+'"></a>';
                }
                $("div[class='photos']")[0].innerHTML = pic_all;
            }
            let prefix_integer = function (num, length) {
                return (Array(length).join('0') + num).slice(-length);
            }
            //获取指定页面的图片集
            let getPageContent = function (page_url) {
                let pic_all = "";
                $.ajaxSettings.async = false;
                $.get(page_url,function (data) {
                    pic_all = $(data).find(".photos")[0].innerHTML;
                });
                $.ajaxSettings.async = true;
                return pic_all;
            };
        }

        //主程序入口，获取url判断网站类型
        let url = window.location.host;
        if(url.indexOf("xsnvshen") >=0) {
            console.log("这是秀色女神");
            ViewXsnvshen();
        }else if(url.indexOf("nshens") >=0 || url.indexOf("inewgirl") >=0) {
            console.log("这是女神社");
            ViewNshens();
        }else if(url.indexOf("hitxhot") >=0) {
            console.log("这是hitxhot");
            hitxhot();
        }else if(url.indexOf("xchina") >=0) {
            console.log("这是小黄书");
            xchina();
        }
    }
})();