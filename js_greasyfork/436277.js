// ==UserScript==
// @name         Bing壁纸下载（修改版）
// @namespace    http://www.baidu.com/p/%E6%B1%82%E7%9F%A5%E8%80%85wzx
// @namespace    http://weibo.com/willxiangwb
// @namespace    http://www.mewchen.com
// @version      0.7.0
// @description  主要是方便自己使用，避免每次看到喜欢的壁纸后右键审查元素双击，框选，然后复制，再粘贴打开右键。现在改为点击按钮字节下载图片，支持切换图片下载(代码写得渣)
// @description  1.修改中文版下载按钮规则;2.修改换图片下载的是同一图片的bug,3.修复bing更新导致的问题4.修复上一张图片下载日期问题
// @description  5.目前仅支持中国版 6.第一次打开页面不显示下载按钮，需要刷新一下
// @description  6.v0.6.7因为bing背景图片默认变成了1920x1200了，但是这个尺寸的图片代水印，所以把默认图片尺寸改回1920x1080尺寸
// @description  v0.6.8 增加1920x1200分辨率下载，因为1920x1200分辨率的视野更大，但是有水印
// @description  v0.6.9 更改文件命名，增加图片Title，示例：[2022-08-26]OHR.PeljesacWind_ZH-CN9299214248_UHD-[既有风，又有水]-[克罗地亚佩列沙茨半岛附近的风筝冲浪者和风帆冲浪者© helivideo／Getty Images].jpg
// @description  v0.7.0 修改下载按钮显示样式，使界面风格更统一；替换旧的图标，减小脚本大小；优化文件命名格式和下载按钮提示文字；
// @author       bluesky
// @author       willxiang
// @author       mewchenm
// @include      *://www.bing.com/*
// @include      *://cn.bing.com/*
// @include      *://global.bing.com/*
// @grant        none
// @require      http://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436277/Bing%E5%A3%81%E7%BA%B8%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436277/Bing%E5%A3%81%E7%BA%B8%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

//计算当前日期
var nowDate = new Date().getTime();
var calcNum = 0;
$("#leftNav").on("click",function(){
    if(calcNum < 7){
        calcNum = calcNum + 1;
        nowDate = nowDate - 1000 * 60 * 60 * 24;
        console.log(new Date(nowDate));
    }
});
$("#rightNav").on("click",function(){
    if(calcNum > 0){
        calcNum = calcNum - 1;
        nowDate = nowDate + 1000 * 60 * 60 * 24;
        console.log(new Date(nowDate));
    }
});
//计算当前日期结束

var currentUrl = window.location.href;
if (currentUrl.indexOf("global") != -1) {
    var oldA = $("#DownloadHPImage");
    var newA = document.createElement("a");
    newA.title = "Download today's image without watermark";
    newA.id = "newDownloadHPImage";
    newA.style.cursor = "pointer";

    var newDiv = document.createElement("div");
    newDiv.innerHTML = "Download today's image without watermark";
    newA.appendChild(newDiv);
    oldA.after(newA);


    var url = "please wait a moment";
    var imgDiv = $("#bgDiv");

    function getUrl() {
        url = imgDiv.css('backgroundImage');
        if (url != "none") {
            //clearInterval(timer);
        } else {
            getUrl();
        }
    }


    $("#newDownloadHPImage").click(function() {
        if (url == "Please wait a moment...") {
            alert(url);
        } else {
            url = url.replace('url(', '').replace(')', '');
            url = url.substr(url.indexOf('"') + 1,url.lastIndexOf('"') - url.indexOf('"')-1);//New,For removing the domain at the beginning of the url and quotes at the url
            //window.location.href = url;//Open in current window/tab
            window.open(url);//Open in a new window/tab
        }
    });

    var timer = setInterval(getUrl, 500);

} else {
    //图标文件
    var iconElement = '<svg class="downloadIcon" x="0px" y="0px" viewBox="0 0 22 22" enable-background="new 0 0 22 22" aria-hidden="true" role="presentation" style="width: 22px; margin-inline: 16px; position: initial;"><path d="M17.842 11.483l-6.671 6.725-6.671-6.725.967-.967 5.017 5.049v-15.565h1.375v15.565l5.017-5.049.966.967zm-12.859 10.517v-1.375h12.375v1.375h-12.375z"></path></svg>';
    //由于IP不同时同一个地址的页面显示不同，所以暂时根据元素是否存在来判断
    //国际版下载
    var isIntentionVersionPage = $("#est_en").attr("class");

    if (isIntentionVersionPage == "est_selected") {

        var url = "正在获取图片地址……请稍等……";

        var imgDiv = $("#bgDiv");
//         var imgProgLoad = $("#bgImgProgLoad");

        function getUrl() {
            url = imgDiv.css('backgroundImage');
//             url = imgProgLoad.attr("data-ultra-definition-src");
//             if(url==null||url==""){
//                 url = imgDiv.css('backgroundImage');
//             }
            if (url != "none"&&url!=null&&url!="") {
                //clearInterval(timer);
                //生成下载按钮
                var DownloadUrl = url;
                DownloadUrl = DownloadUrl.replace('url(', '').replace(')', '');
                // DownloadUrl = DownloadUrl.substr(DownloadUrl.indexOf('"') + 1,DownloadUrl.lastIndexOf('"') - DownloadUrl.indexOf('"')-1);
                DownloadUrl = DownloadUrl.replace(/\"/g,"").replace("1920x1080","UHD");
                var sh_igw = $("#sh_cp");
                var title = $("#musCardImageTitle");
                var author = $("#musCardCopyright");
                var newA = document.createElement("a");
                newA.title = "点击下载壁纸";
                //<a href="http://somehost/somefile.zip" download="myfile.zip">Download file</a>
                newA.href = DownloadUrl;
                //change start by 0.6.6
                var date = new Date(nowDate);
                var strDate = "["+date.getFullYear()+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+((date.getDate())<10?("0"+(date.getDate())):(date.getDate()))+"]";
                var cutStart = DownloadUrl.indexOf('=')+1;
                var cutLenth = DownloadUrl.indexOf('&')-cutStart;
                var downName = strDate+DownloadUrl.substr(cutStart,cutLenth);
                var preName = downName.substr(0,downName.lastIndexOf('.'));
                var sufName = downName.substr(downName.lastIndexOf('.'));
                newA.download = preName+"-["+title.text().replace('/','／')+"("+author.text().replace('/','／')+")]"+sufName;
                //change end by 0.6.6
                //newA.innerHTML = "<div class='sc_light_1'><div id='downloadPic' " + style + "></div></div>";
                newA.innerHTML = iconElement;
                sh_igw.after(newA);

                //添加高清壁纸下载按钮
                var newB = document.createElement("a");
                newB.title = "点击下载高清壁纸";
                newB.href = newA.href.replace("1920x1080","UHD");
                newB.download = newA.download.replace("1920x1080","UHD");
                //newB.innerHTML = "<div class='sc_light'><div id='downloadUhdPic' " + style + "></div></div>";
                newB.innerHTML = iconElement;
                sh_igw.after(newB);

                var downloadPic = $("#downloadPic");
                downloadPic.mouseenter(function() {
                    downloadPic.css("margin", "0px 10px");
                    downloadPic.css("background-position-x", "-252px");
                });
                downloadPic.mouseout(function() {
                    downloadPic.css("margin", "0px 10px");
                    downloadPic.css("background-position-x", "0px");
                });
                isIntentionVersionPage = "none";
                //结束计时器
                clearInterval(timer);
                //持续检测
                function reGetUrl() {
                    var imgDiv = $("#bgDiv");
                    url = imgDiv.css('backgroundImage');
//                     var imgProgLoad = $("#bgImgProgLoad");
//                     url = imgProgLoad.attr("data-ultra-definition-src");
//                     if(url==null||url==""){
//                         url = imgDiv.css('backgroundImage');
//                     }
                    DownloadUrl = url;
                    DownloadUrl = DownloadUrl.replace('url(', '').replace(')', '');
                    //DownloadUrl = DownloadUrl.substr(DownloadUrl.indexOf('"') + 1,DownloadUrl.lastIndexOf('"') - DownloadUrl.indexOf('"')-1);
                    DownloadUrl = DownloadUrl.replace(/\"/g,"");
                    var downloadPic = $("#downloadPic");
                    var downloadUhdPic = $("#downloadUhdPic");
                    var dwButton = downloadPic.parents("a");
                    var dwUhdButton = downloadUhdPic.parents("a");
                    if(dwButton.attr("href") != DownloadUrl || title.text()!="") { //change by v0.6.6
                        dwButton.attr("href",DownloadUrl);
                        dwUhdButton.attr("href",DownloadUrl.replace("1920x1080","UHD"));
                        //change start by 0.6.6
                        var cutStart = DownloadUrl.indexOf('=')+1;
                        var cutLenth = DownloadUrl.indexOf('&')-cutStart;
                        var date = new Date(nowDate);
                        var strDate = "["+date.getFullYear()+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+((date.getDate())<10?("0"+(date.getDate())):(date.getDate()))+"]";
                        var downName = strDate+DownloadUrl.substr(cutStart,cutLenth);
                        var preName = downName.substr(0,downName.lastIndexOf('.'));
                        var sufName = downName.substr(downName.lastIndexOf('.'));
                        dwButton.attr("download",preName+"-["+title.text().replace('/','／')+"("+author.text().replace('/','／')+")]"+sufName);
                        dwUhdButton.attr("download",dwButton.attr("download").replace("1920x1080","UHD"));
                        //change end by 0.6.6
                    }
                }
                var reGetTimer = setInterval(reGetUrl, 500);
            } else {
                getUrl();
            }
        }


        $("#downloadPic").click(function() {
            if (url == "正在获取图片地址……请稍等……") {
                alert(url);
            } else {
                url = url.replace('url(', '').replace(')', '');
                url = url.substr(url.indexOf('"') + 1,url.lastIndexOf('"') - url.indexOf('"')-1);//New,For removing the domain at the beginning of the url and quotes at the url
                //window.location.href = url;//Open in current window/tab
                window.open(url);//Open in a new window/tab
            }
        });

        var timer = setInterval(getUrl, 500);

    } else {
        //国内版下载
        //var isChineseVersionPage = document.getElementById("sh_igw");
        var isChineseVersionPage = $("#est_cn").attr("class");

        if (isChineseVersionPage.indexOf("est_selected") > -1) {

            var url = "正在获取图片地址……请稍等……";
            var imgDiv = $(".downloadLink")[0];
//             var imgProgLoad = $("#bgImgProgLoad");

            function getUrl() {
                url = imgDiv.href;
//                 url = imgProgLoad.attr("data-ultra-definition-src");
//                 if(url==null||url==""){
//                     url = imgDiv.css('backgroundImage');
//                 }
                if (url != "none"&&url!=null&&url!="") {
                    //clearInterval(timer);
                    //生成下载按钮
                    var DownloadUrl = url;
                    //DownloadUrl = DownloadUrl.replace('url(', '').replace(')', '');
                    //DownloadUrl = DownloadUrl.substr(DownloadUrl.indexOf('"') + 1,DownloadUrl.lastIndexOf('"') - DownloadUrl.indexOf('"')-1);
                    //DownloadUrl = DownloadUrl.replace(/\"/g,"");
                    var sh_igw = $(".nav")[0];
                    var picInfo = $(".musCardCont .title")[0].innerText;
                    var picCopyright = $("#copyright")[0].innerText.replace('/','／');
                    var picTitle = $("#headline")[0].innerText;
                    var newA = document.createElement("a");
                    newA.title = "1920x1200壁纸（有水印）";
                    //<a href="http://somehost/somefile.zip" download="myfile.zip">Download file</a>
                    newA.href = DownloadUrl;
                    //change start by 0.6.6
                    var date = new Date(nowDate);
                    var strDate = "["+date.getFullYear()+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+((date.getDate())<10?("0"+(date.getDate())):(date.getDate()))+"]";
                    var cutStart = DownloadUrl.indexOf('=')+1;
                    var cutLenth = DownloadUrl.indexOf('&')-cutStart;
                    var downName = strDate+DownloadUrl.substr(cutStart,cutLenth);
                    var preName = downName.substr(0,downName.lastIndexOf('.'));
                    var sufName = downName.substr(downName.lastIndexOf('.'));
                    newA.download = preName+"-["+picTitle+"]-["+picInfo+" ("+picCopyright+")]"+sufName;
                    //newA.className = "musCardCont";
                    //newA.style.position="initial";
                    //newA.style.width = "32px";
                    //newA.style.padding = "0px";
                    //change end by 0.6.6
                    //newA.innerHTML = "<div class='sc_light'><div id='downloadPic' " + style + "></div></div>";
                    newA.innerHTML = '<div class="sc_light" style="width: 32px;" id="downloadPic">'+iconElement+'</div>';
                    sh_igw.after(newA);

                    //添加1080P（1920x1080）壁纸下载按钮
                    var newB = document.createElement("a");
                    newB.title = "1080P壁纸";
                    newB.href = newA.href.replace("1920x1200","1920x1080");
                    newB.download = newA.download.replace("1920x1200","1920x1080");
                    //newB.innerHTML = "<div class='sc_light'><div id='downloadPic1080' " + style + "></div></div>";
                    newB.innerHTML = '<div class="sc_light" style="width: 32px;" id="downloadPic1080">'+iconElement+'</div>';
                    //newB.className = "musCardCont";
                    //newB.style.position="initial";
                    //newB.style.width = "32px";
                    //newB.style.padding = "0px";
                    sh_igw.after(newB);

                    //添加高清壁纸下载按钮
                    var newC = document.createElement("a");
                    newC.title = "高清壁纸";
                    newC.href = newA.href.replace("1920x1200","UHD");
                    newC.download = newA.download.replace("1920x1200","UHD");
                    //newC.innerHTML = "<div class='sc_light'><div id='downloadUhdPic' " + style + "></div></div>";
                    newC.innerHTML = '<div class="sc_light" style="width: 32px;" id="downloadUhdPic">'+iconElement+'</div>';
                    //newC.className = "musCardCont";
                    //newC.style.position="initial";
                    //newC.style.width = "32px";
                    //newC.style.padding = "0px";
                    sh_igw.after(newC);

                    var downloadPic = $("#downloadPic");

//                     downloadPic.mouseenter(function() {
//                         downloadPic.css("margin", "0px 0px");
//                         downloadPic.css("background-position-x", "-252px");
//                     });
//                     downloadPic.mouseout(function() {
//                         downloadPic.css("margin", "0px 0px");
//                         downloadPic.css("background-position-x", "0px");
//                     });
                    isChineseVersionPage = "none";
                    //结束计时器
                    clearInterval(timer);
                    //持续检测
                    function reGetUrl() {
                        var imgDiv = $(".downloadLink")[0];
                        url = imgDiv.href;
//                         var imgProgLoad = $("#bgImgProgLoad");
//                         url = imgProgLoad.attr("data-ultra-definition-src");
//                         if(url==null||url==""){
//                             url = imgDiv.css('backgroundImage');
//                         }
                        DownloadUrl = url;
                        //DownloadUrl = DownloadUrl.replace('url(', '').replace(')', '');
                        //DownloadUrl = DownloadUrl.substr(DownloadUrl.indexOf('"') + 1,DownloadUrl.lastIndexOf('"') - DownloadUrl.indexOf('"')-1);
                        //DownloadUrl = DownloadUrl.replace(/\"/g,"");
                        var downloadPic = $("#downloadPic");
                        var downloadPic1080 = $("#downloadPic1080");
                        var downloadUhdPic = $("#downloadUhdPic");
                        var dwButton = downloadPic.parents("a");
                        var dwButton1080 = downloadPic1080.parents("a");
                        var dwUhdButton = downloadUhdPic.parents("a");
                        if(dwButton.attr("href") != DownloadUrl) {
                            dwButton.attr("href",DownloadUrl);
                            dwButton1080.attr("href",DownloadUrl.replace("1920x1200","1920x1080"));
                            dwUhdButton.attr("href",DownloadUrl.replace("1920x1200","UHD"));
                            var date = new Date(nowDate);
                            var strDate = "["+date.getFullYear()+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+((date.getDate())<10?("0"+(date.getDate())):(date.getDate()))+"]";
                            //change start by 0.6.6
                            if(DownloadUrl.indexOf('=')<0){
//                                 DownloadUrl = $("#bgImgProgLoad").attr("data-ultra-definition-src");
//                                 dwButton.attr("href",DownloadUrl);
                                dwButton.attr("href",DownloadUrl);
                                dwButton1080.attr("href",DownloadUrl.replace("1920x1200","1920x1080"));
                                dwUhdButton.attr("href",DownloadUrl.replace("1920x1200","UHD"));
                                cutStart = DownloadUrl.lastIndexOf('/')+1;
                                var downName = strDate+DownloadUrl.substr(cutStart);
                                var preName = downName.substr(0,downName.lastIndexOf('.'));
                                var sufName = downName.substr(downName.lastIndexOf('.'));
                                var picInfo = $(".musCardCont .title")[0].innerText;
                                var picCopyright = $("#copyright")[0].innerText.replace('/','／');
                                var picTitle = $("#headline")[0].innerText;
                                dwButton.attr("download",preName+"-["+picTitle+"]-["+picInfo+" ("+picCopyright+")]"+sufName);
                                dwButton1080.attr("download",dwButton.attr("download").replace("1920x1200","1920x1080"));
                                dwUhdButton.attr("download",dwButton.attr("download").replace("1920x1200","UHD"));
                            }else{
                                dwButton.attr("href",DownloadUrl);
                                dwButton1080.attr("href",DownloadUrl.replace("1920x1200","1920x1080"));
                                dwUhdButton.attr("href",DownloadUrl.replace("1920x1200","UHD"));
                                cutStart = DownloadUrl.indexOf('=')+1;
                                cutLenth = DownloadUrl.indexOf('&')-cutStart;
                                var downName = strDate+DownloadUrl.substr(cutStart,cutLenth);
                                var preName = downName.substr(0,downName.lastIndexOf('.'));
                                var sufName = downName.substr(downName.lastIndexOf('.'));
                                var picInfo = $(".musCardCont .title")[0].innerText;
                                var picCopyright = $("#copyright")[0].innerText.replace('/','／');
                                var picTitle = $("#headline")[0].innerText;
                                dwButton.attr("download",preName+"-["+picTitle+"]-["+picInfo+" ("+picCopyright+")]"+sufName);
                                dwButton1080.attr("download",dwButton.attr("download").replace("1920x1200","1920x1080"));
                                dwUhdButton.attr("download",dwButton.attr("download").replace("1920x1200","UHD"));
                            }
                            //change end by 0.6.6
                        }
                    }
                    var reGetTimer = setInterval(reGetUrl, 500);
                } else {
                    getUrl();
                }
            }


            $("#downloadPic").click(function() {
                if (url == "正在获取图片地址……请稍等……") {
                    alert(url);
                } else {
                    url = url.replace('url(', '').replace(')', '');
                    url = url.substr(url.indexOf('"') + 1,url.lastIndexOf('"') - url.indexOf('"')-1);//New,For removing the domain at the beginning of the url and quotes at the url
                    //window.location.href = url;//Open in current window/tab
                    window.open(url);//Open in a new window/tab
                }
            });

            var timer = setInterval(getUrl, 500);
        } else {

            var oldA = $("#DownloadHPImage");
            var newA = document.createElement("a");
            newA.title = "Download today's image without watermark";
            newA.style.cursor = "pointer";
            newA.id = "newDownloadHPImage";
            var newDiv = document.createElement("div");
            newDiv.innerHTML = "Download today's image without watermark";

            newA.appendChild(newDiv);

            oldA.after(newA);



            var url = "please wait a moment";
            var imgDiv = $("#bgDiv");

            function getUrl() {
                url = imgDiv.css('backgroundImage');
                if (url != "none") {
                    //clearInterval(timer);
                } else {
                    getUrl();
                }
            }


            $("#newDownloadHPImage").click(function() {
                if (url == "Please wait a moment...") {
                    alert(url);
                } else {
                    url = url.replace('url(', '').replace(')', '');
                    window.location.href = url;
                }
            });

            var timer = setInterval(getUrl, 500);
        }

    }
}