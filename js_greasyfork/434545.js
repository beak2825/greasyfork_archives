// ==UserScript==
// @name         jpxgmn 批量图片查看 和 批量下载
// @namespace    http://tampermonkey.net/
// @version      0.3.6
// @description  jpxgmn 批量图片查看 、下载
// @author       nelsons
// @match        https://www.jpxgmn.com/*/*.html
// @match        https://www.jpxgmn.top/*/*.html
// @match        https://www.jpxgmn.net/*/*.html
// @match        https://www.jpxgmn.vip/*/*.html
// @match        https://www.jpmn8.com/*/*/*.html
// @match        https://www.jpxgyw.net/*/*.html
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.1/viewer.min.js
// @downloadURL https://update.greasyfork.org/scripts/434545/jpxgmn%20%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%20%E5%92%8C%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/434545/jpxgmn%20%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%20%E5%92%8C%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
   // let buttonHtml = "<a id='download_show_btn' href=# target='_self' style='cursor:pointer;z-index:98;display:block;width:30px;height:64px;line-height:30px;position:fixed;left:0;top:300px;text-align:center; color: #000;font-size: x-large;background-color: #f7f7f9;border: 1px solid #e1e1e8; border-radius: 4px; box-shadow: inset 0 -3em 3em rgb(0 0 0 / 10%), 0 0 0 2px rgb(255 255 255 / 50%), 0.3em 0.3em 1em rgb(0 0 0 / 20%);'>下载</a>";
    let downloadView = `<div id="download-view" class="download-view"  style="float: right; background-color: rgb(247, 247, 249); border: 1px solid rgb(225, 225, 232); border-radius: 4px; padding: 16px; position: fixed; top: 0px; right: 0px; width: 50vw; z-index: 2147483645; overflow: scroll; height: 100%; display: none;">
    <div class="quanxuan-div"><input type="checkbox" id="quanxuan"/><span>全选</span></div>
    <div class="choose-btn">
        <button id="fanxuan">反选</button>
        <button id="download">下载</button>
    </div>

    <div class="close-btn" id="close-btn">x</div>
    <div class="download-content">

    </div>
</div>`
    let btnHtml =`<svg id='download_show_btn' t="1635327432621" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1003" width="200" height="200"><path d="M624 706.3h-74.1V464c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v242.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.7c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9z" fill="#16c2c2" p-id="1004"></path><path d="M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6 0.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4 14.9-19.2 32.6-35.9 52.4-49.9 41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7-23.4 23.4-54.5 36.3-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z" fill="#16c2c2" p-id="1005"></path></svg>`

    let addStyles = `.viewer-close:before,.viewer-flip-horizontal:before,.viewer-flip-vertical:before,.viewer-fullscreen-exit:before,.viewer-fullscreen:before,.viewer-next:before,.viewer-one-to-one:before,.viewer-play:before,.viewer-prev:before,.viewer-reset:before,.viewer-rotate-left:before,.viewer-rotate-right:before,.viewer-zoom-in:before,.viewer-zoom-out:before{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC");background-repeat:no-repeat;background-size:280px;color:transparent;display:block;font-size:0;height:20px;line-height:0;width:20px}.viewer-zoom-in:before{background-position:0 0;content:"Zoom In"}.viewer-zoom-out:before{background-position:-20px 0;content:"Zoom Out"}.viewer-one-to-one:before{background-position:-40px 0;content:"One to One"}.viewer-reset:before{background-position:-60px 0;content:"Reset"}.viewer-prev:before{background-position:-80px 0;content:"Previous"}.viewer-play:before{background-position:-100px 0;content:"Play"}.viewer-next:before{background-position:-120px 0;content:"Next"}.viewer-rotate-left:before{background-position:-140px 0;content:"Rotate Left"}.viewer-rotate-right:before{background-position:-160px 0;content:"Rotate Right"}.viewer-flip-horizontal:before{background-position:-180px 0;content:"Flip Horizontal"}.viewer-flip-vertical:before{background-position:-200px 0;content:"Flip Vertical"}.viewer-fullscreen:before{background-position:-220px 0;content:"Enter Full Screen"}.viewer-fullscreen-exit:before{background-position:-240px 0;content:"Exit Full Screen"}.viewer-close:before{background-position:-260px 0;content:"Close"}.viewer-container{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;bottom:0;direction:ltr;font-size:0;left:0;line-height:0;overflow:hidden;position:absolute;right:0;top:0;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.viewer-container::-moz-selection,.viewer-container ::-moz-selection{background-color:transparent}.viewer-container::selection,.viewer-container ::selection{background-color:transparent}.viewer-container:focus{outline:0}.viewer-container img{display:block;height:auto;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;width:100%}.viewer-canvas{bottom:0;left:0;overflow:hidden;position:absolute;right:0;top:0}.viewer-canvas>img{height:auto;margin:15px auto;max-width:90%!important;width:auto}.viewer-footer{bottom:0;left:0;overflow:hidden;position:absolute;right:0;text-align:center}.viewer-navbar{background-color:rgba(0,0,0,.5);overflow:hidden}.viewer-list{-webkit-box-sizing:content-box;box-sizing:content-box;height:50px;margin:0;overflow:hidden;padding:1px 0}.viewer-list>li{color:transparent;cursor:pointer;float:left;font-size:0;height:50px;line-height:0;opacity:.5;overflow:hidden;-webkit-transition:opacity .15s;transition:opacity .15s;width:30px}.viewer-list>li:focus,.viewer-list>li:hover{opacity:.75}.viewer-list>li:focus{outline:0}.viewer-list>li+li{margin-left:1px}.viewer-list>.viewer-loading{position:relative}.viewer-list>.viewer-loading:after{border-width:2px;height:20px;margin-left:-10px;margin-top:-10px;width:20px}.viewer-list>.viewer-active,.viewer-list>.viewer-active:focus,.viewer-list>.viewer-active:hover{opacity:1}.viewer-player{background-color:#000;bottom:0;cursor:none;display:none;right:0;z-index:1}.viewer-player,.viewer-player>img{left:0;position:absolute;top:0}.viewer-toolbar>ul{display:inline-block;margin:0 auto 5px;overflow:hidden;padding:6px 3px}.viewer-toolbar>ul>li{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;float:left;height:24px;overflow:hidden;-webkit-transition:background-color .15s;transition:background-color .15s;width:24px}.viewer-toolbar>ul>li:focus,.viewer-toolbar>ul>li:hover{background-color:rgba(0,0,0,.8)}.viewer-toolbar>ul>li:focus{-webkit-box-shadow:0 0 3px #fff;box-shadow:0 0 3px #fff;outline:0;position:relative;z-index:1}.viewer-toolbar>ul>li:before{margin:2px}.viewer-toolbar>ul>li+li{margin-left:1px}.viewer-toolbar>ul>.viewer-small{height:18px;margin-bottom:3px;margin-top:3px;width:18px}.viewer-toolbar>ul>.viewer-small:before{margin:-1px}.viewer-toolbar>ul>.viewer-large{height:30px;margin-bottom:-3px;margin-top:-3px;width:30px}.viewer-toolbar>ul>.viewer-large:before{margin:5px}.viewer-tooltip{background-color:rgba(0,0,0,.8);border-radius:10px;color:#fff;display:none;font-size:12px;height:20px;left:50%;line-height:20px;margin-left:-25px;margin-top:-10px;position:absolute;text-align:center;top:50%;width:50px}.viewer-title{color:#ccc;display:inline-block;font-size:12px;line-height:1;margin:0 5% 5px;max-width:90%;opacity:.8;overflow:hidden;text-overflow:ellipsis;-webkit-transition:opacity .15s;transition:opacity .15s;white-space:nowrap}.viewer-title:hover{opacity:1}.viewer-button{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;height:80px;overflow:hidden;position:absolute;right:-40px;top:-40px;-webkit-transition:background-color .15s;transition:background-color .15s;width:80px}.viewer-button:focus,.viewer-button:hover{background-color:rgba(0,0,0,.8)}.viewer-button:focus{-webkit-box-shadow:0 0 3px #fff;box-shadow:0 0 3px #fff;outline:0}.viewer-button:before{bottom:15px;left:15px;position:absolute}.viewer-fixed{position:fixed}.viewer-open{overflow:hidden}.viewer-show{display:block}.viewer-hide{display:none}.viewer-backdrop{background-color:rgba(0,0,0,.5)}.viewer-invisible{visibility:hidden}.viewer-move{cursor:move;cursor:-webkit-grab;cursor:grab}.viewer-fade{opacity:0}.viewer-in{opacity:1}.viewer-transition{-webkit-transition:all .3s;transition:all .3s}@-webkit-keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.viewer-loading:after{-webkit-animation:viewer-spinner 1s linear infinite;animation:viewer-spinner 1s linear infinite;border:4px solid hsla(0,0%,100%,.1);border-left-color:hsla(0,0%,100%,.5);border-radius:50%;content:"";display:inline-block;height:40px;left:50%;margin-left:-20px;margin-top:-20px;position:absolute;top:50%;width:40px;z-index:1}@media (max-width:767px){.viewer-hide-xs-down{display:none}}@media (max-width:991px){.viewer-hide-sm-down{display:none}}@media (max-width:1199px){.viewer-hide-md-down{display:none}}`

    let addViews = "body{text-align: center;},"
    let addDownloadStyle = `
       .download-view {
            float: right;
            background-color: #f7f7f9;
            border: 1px solid #e1e1e8;
            border-radius: 4px;
            padding: 16px 16px;
            position: fixed;
            top: 0px;
            right: 0px;
            width: 50vw;
            z-index: 2147483645;
            overflow: scroll;
            height: 100%;
        }

        .download-content {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #f5f5f5;
            display: inline-block;
        }

        .div-img-content {
            float: left;
            display: grid;
            padding: 4px 2px;
            background-color: #f7f7f9;
            border: 1px solid #e1e1e8;
            border-radius: 4px;
            margin-right: 5px;
        }

        .div-img-content img {
            width: auto;
            height: 240px;
        }

        .close-btn {
            display: inline-block;
            text-align: center;
            font-size: 20px;
            position: absolute;
            right: 30px;
            top: 18px;
            height: 32px;
            line-height: 32px;
            border-radius: 10px;
            border: 1px solid #aaa;
            width: 30px;
        }
        .quanxuan-div {
            float: left;
            width: 100px;
            height: 30px;
        }

        .quanxuan-div input {
            width: 24px;
            height: 24px;
        }

        .quanxuan-div span {
            font-size: 18px;
            margin-left: 6px;
            vertical-align: middle;
        }
        .icon {
            cursor: pointer;
            z-index: 98;
            display: block;
            width: 50px;
            height: 64px;
            line-height: 30px;
            position: fixed;
            left: 0;
            top: 300px;
            text-align: center;
            color: #000;
        }

        ul {
          list-style: none;
        }

        .choose-btn {
            float: left;
            margin-top: 10px;
            display: block;
            margin-left: -84px;
            margin-top: 38px;
        },`

    GM_addStyle(addStyles+addViews+addDownloadStyle)


    'use strict';

    var newViewer = $("<ul id =viewer style='display: inline-block !important;background-color: #f7f7f9;border: 1px solid #e1e1e8; border-radius: 4px; padding: 16px 16px;'></ul>");

    var host = document.domain;
    var paginationClass = ""
    var imageClass = ""
    if (host == "www.jpmn8.com") {
        paginationClass = ".pagination1 ul"
        imageClass = ".content >div:nth-child(4) > p:nth-child(2) > img"
    } else {
        paginationClass = ".pagination ul"
        imageClass = ".article-content img"
    }
    var linkArr = new Array()
    var length = 0

    var paginationExist = false
    $(paginationClass).each(function () {
        if (paginationExist == true) {
           return false;
        }

        length = $(this).find("a").length
        $(this).find('a').each(function(index, value) {
             if (index <= length-2) {
                linkArr.push($(this).attr('href'))
             }
          });

       paginationExist = true;
    })

    $("body").empty();
    //$("body").append(buttonHtml);
    $("body").append(newViewer);
    $("body").append(downloadView);
    $("body").append(btnHtml);

    $.each(linkArr,function(index,value){
         var itemArr = $('<li></li>');
         $.get( value, function( data ) {

             var image = $(imageClass, data);

             image.each(function(item){
                 var imgUrl = $(this).attr('src')

                 var imageItem ='<img width= "300" style="float:left;" src="' + imgUrl + '" >';

                 itemArr.append(imageItem)

                 var downloadItem = '<div class="div-img-content"><img src="' +imgUrl+ '"><input type="checkbox" class="imgBtnBox" value="'+imgUrl+'"/></div>';
                 $(".download-content").append(downloadItem)

             });
          })
         newViewer.append(itemArr)
    });

   setTimeout(() => {
       var viewer3 = new Viewer(document.getElementById('viewer'),{
           viewed() {}
       } );
   },3000);

    $("#download_btn").click(function(event){
          GM_download('https://www.jpxgmn.top/uploadfile/202109/5/F4175918381.jpg', `pic`);
    });

     var i;
            var li = document.getElementsByTagName("input");
            var quanxuan = document.getElementById("quanxuan");
            var fanxuan = document.getElementById("fanxuan");
            var imgBtnBox = document.getElementsByClassName("imgBtnBox");
            var download = document.getElementById("download");
            var closeBtn = document.getElementById('close-btn');
            var downloadShowBtn = document.getElementById('download_show_btn');
            var isShow = false; // 默认div显示

            //全选和全不选框
            quanxuan.onclick = function () {
                for (i = 0; i < li.length; i++) {
                    li[i].checked = this.checked;
                }
            }

            //按钮反选
            fanxuan.onclick = function () {
                for (i = 0; i < li.length; i++) {
                    li[i].checked = !li[i].checked;
                }
                for (i = 0; i < imgBtnBox.length; i++) {
                    if (!imgBtnBox[i].checked) {
                        quanxuan.checked = false;
                        return;
                    }
                }
            }
            //给所有水果选项绑定单击事件
            for (i = 0; i < imgBtnBox.length; i++) {
                imgBtnBox[i].onclick = function () {
                    for (var j = 0; j < imgBtnBox.length; j++) {
                        if (!imgBtnBox[j].checked) {
                            quanxuan.checked = false;
                            return;
                        }
                    }
                    quanxuan.checked = true;
                }
            }

            //提交按钮
            download.onclick = function () {
                var imgSort = 1
                for (i = 0; i < imgBtnBox.length; i++) {
                    if (imgBtnBox[i].checked) {
                        var url = imgBtnBox[i].value
                        var filename = url.substring(url.lastIndexOf('/')+1);

                        GM_download(url, `img-${imgSort}`);
                        imgSort++;
                    }
                }

            }

            // closeBtn.hide()
            // 显示或者隐藏
            closeBtn.onclick = function () {
                document.getElementById("download-view").style.display = "none";
                isShow = false
            }

            downloadShowBtn.onclick = function () {
                document.getElementById("download-view").style.display = "inline-block";
                isShow = false
            }

})();