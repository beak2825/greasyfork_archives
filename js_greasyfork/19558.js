// ==UserScript==
// @name         show bing wallpaper without watermark_Fixed
// @namespace    http://weibo.com/willxiangwb
// @namespace    http://www.mewchen.com
// @version      0.6.2
// @description  主要是方便自己使用，避免每次看到喜欢的壁纸后右键审查元素双击，框选，然后复制，再粘贴打开右键。(代码写得渣)
// @author       willxiang
// @author       mewchen
// @include      *://www.bing.com/*
// @include      *://cn.bing.com/*
// @include      *://global.bing.com/*
// @grant        none
// @require      http://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/19558/show%20bing%20wallpaper%20without%20watermark_Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/19558/show%20bing%20wallpaper%20without%20watermark_Fixed.meta.js
// ==/UserScript==

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

    //由于IP不同时同一个地址的页面显示不同，所以暂时根据元素是否存在来判断
    var isChineseVersionPage = document.getElementById("sh_igw");

    if (isChineseVersionPage) {

        var style = "style='width: 40px; height: 40px; margin: 0px 10px; background-position-x: 0px;overflow: hidden;background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAAHjBAMAAACHmFoxAAAAA3NCSVQICAjb4U/gAAAAMFBMVEX///////////////////////////////////////////////////////////////9Or7hAAAAAEHRSTlMAESIzRFVmd4iZqrvM3e7/dpUBFQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAACAASURBVHic7Z0LcF3Fecf3XD0sWbZ17RCT2AZf8nCagEE0CZ2EEN0AeVGCRJJpCEywoM6TJBbJNKWdDrp0kkIyATsNTdswRA6FhCkJkkOgTQKRTGBK2hQJQxkeaeQE88jDvjK2JVuPu93X9+23e/ZKukb2EWV3xujop8PZ757d/fY73//uHsZ0+ZPvlSv/+XnmlvqvPMj/cGsxIxgyKXctV+WxAqVvKStY+XoWMGhS0ssf/0A+efON/FDe0tP51JdOZS+7YIjfcaQhFAuFSaZQky7m/6IP3sqfRtjEn9MfJncdLx1ZaAvCiy2zJjXzH8DhiXyLOcoNHYSPkmyeKswbTD4puuM38hQSQwE2E4YmJQNjaDPbNGmu//bpNoR1I0/NF6wfUHVPFi2kNvGnjEmUgUmLK/aarK681fz8toVslT7lhcMcWDBZQOgYquFih3FtEuv9DbkmO/kQ/QFFn1MrfI9o5S860Ha9pwG6NnEFe12ma2igN1R+wk75Y2irU/3iqcOAn1G1PErgIlJ7t4GeoRI2eIwrk44fcypim34t/tM0lXdgMlKqGZ5karnXwh5S+biGvk1y4B/vs1+r29zvGtoib3T7PhcqMBNceU/lyUscWA+dr1IE6N6pTgVThu5Ltbxu+xwvuLUrMFDybGqanBEuklZVLqewA6vZD9Dtj79RMGXopLAgVYRJTRNY73m71I++Equr5D2bknLbDND4QuUFDczZ0VwpGOhaNSlh2ibeRrrDttX6p/jgS217liu67YZZ80GE9XuK6ufmLQDFLPw/P3XhelXx8oEdFi4x1iwX1g1qWI8mLlcmFwUkdi83n2PLUgvzif45rMwypY5rQ4Xpy55HQ5fxnernKTsB9nK+t3HYgeqG7mVr1cDScJOuQUDOxzRE76igcI8CWpsM5HxnO7IpZgwVd7MH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) no-repeat;background-position: 0 -168px;'"

        var sh_igw = $("#sh_igw");
        var newA = document.createElement("a");
        newA.title = "点击打开无水印图后请自行右键保存";
        newA.innerHTML = "<div class='sc_light'><div id='downloadPic' " + style + "></div></div>";
        sh_igw.after(newA);

        var downloadPic = $("#downloadPic");

        downloadPic.mouseenter(function() {
            downloadPic.css("margin", "-1px 9px");
            downloadPic.css("background-position-x", "-252px");
        });
        downloadPic.mouseout(function() {
            downloadPic.css("margin", "0px 10px");
            downloadPic.css("background-position-x", "0px");
        });


        var url = "正在获取图片地址……请稍等……";
        var imgDiv = $("#bgDiv");

        function getUrl() {
            url = imgDiv.css('backgroundImage');
            if (url != "none") {
                //clearInterval(timer);
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