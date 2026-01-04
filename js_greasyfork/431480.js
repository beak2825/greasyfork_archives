// ==UserScript==
// @name        鼠标悬停图片放大预览-大师兄
// @date        05/27/2021
// @namespace    https://greasyfork.org/zh-CN/users/724782-caogen1207
// @match       *://*/*
// @version     5.02
// @author      大师兄 476116973@qq.com  VX:caogen
// @license     2022年1月8日22:30:21
// @description 电脑端可以跟随鼠标悬停图片放大预览，找了很多图片放大的脚本，都没有一个能用的，只有自己写。大部分网站的图片都可以已支持悬浮放大了。完美适应大小屏幕，图片超大也会图片等比例自适应浏览器。鼠标跟随也优化。欢迎好评反馈，有时间就更新
// @note        2.5 2021年10月4日更新超大图片显示问题
// @note        2.6 2021年10月14日解决某些网站不能正常使用问题
// @note        3.0 2021年11月6日已更新大部分网站不能识别图片放大功能
// @note        3.1 2022年10月8日18:42:41 解决淘宝缩略图问题，例如详情页里主图缩略图悬浮，猜你喜欢的悬浮放大出原图
// @note        3.2 2022年10月9日18:28:17 解决某些网站图片显示成直线问题
// @note        4.0 2022年10月10日12:33:13 修复了大图显示混乱问题；增加了有些不能放大的图片的功能；增加了天猫、微博直接放大出原图功能，不是放大缩略图
// @note        4.1 2022年10月10日22:58:10 增加了更多能悬停放大的图片；增加了B站视频封面直接放大出原图功能，不是放大缩略图。下一步计划添加下载快捷键，求问用什么快捷键好一些
// @note        5.0 2024年5月27日22点46分 加了按键Alt才能触发鼠标悬停放大，需要Alt键和鼠标滑动同时才能有效。更新了大部分图片格式不能被放大的BUG，现在基本能99%的图片能被识别并放大。因时间关系，平时比较少更新，也比较少看评论，如果感兴趣的话，可以加V催。如果支持，打赏一下，也不是不接受，哈哈
// @note        5.01 2024年5月28日21点31分 一直要按住Alt键有点麻烦，又重新改回了鼠标自动放大。如果想暂时禁用脚本，可以在油猴那里有菜单禁用，也可直接用篡改猴自带的禁用。按一下Alt键会也会启用或禁用，但是没按一次按键，需要再重新用鼠标点击页面空白处，激活页面，才能第二次监听按键。一个小脚本，想适应更多网页，如果加太多代码，反而引起很多BUG。就没有优化这点。如果脚本还有其它bug欢迎留言，还是那句话，有时间再更新，这次优化了2天，耽误我糊口了
// @note        5.02 更新小BUG
// @run-at      document-idle
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @icon        http://inews.gtimg.com/newsapp_bt/0/14677352341/641
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/431480/%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E9%A2%84%E8%A7%88-%E5%A4%A7%E5%B8%88%E5%85%84.user.js
// @updateURL https://update.greasyfork.org/scripts/431480/%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E9%A2%84%E8%A7%88-%E5%A4%A7%E5%B8%88%E5%85%84.meta.js
// ==/UserScript==
(function() {
    console.log("鼠标悬停图片放大预览-大师兄");
    let stop = GM_getValue("stop", true);
    let imgw,imgh,imgSrc;
    let ee;
    isKuaijiejian();
    addbox();
    MAIN();

    function addbox() {
        //添加图片盒子
        $(document.body).prepend("<div id='dashixiong_preview' style='display:none;pointer-events:none;padding:0px;margin:0px;left:0px;top:0px;background-color:#00000000;position:fixed;z-index:9999999998;'><img /></div>"); //弹出一个div里面放着图片
    }


    function MAIN(){

        // 监听鼠标事件
        $("body").on("mouseenter mousemove mouseout", "img, a, picture, span,li,video", function(e) {
            ee=e;
            if (stop) {
                if (e.type === "mouseenter") {
                    // 获取元素中的图片地址或背景图地址
                    let imgSrc = getimgSrcFromElement(this);
                    if (imgSrc) {
                        console.log("元素包含图片地址：" + imgSrc);
                        xianshitupian(e,imgSrc);
                        return;
                    }
                } else if (e.type === "mousemove") {
                    // 更新图片位置
                    tupianweizhi(e, imgw, imgh);
                } else if (e.type === "mouseout") {
                    $("#dashixiong_preview").stop(true, false).hide();
                }
            }
        });

        // 监听鼠标事件（对 div 元素的特殊处理）
        $(document).on("mouseenter mousemove mouseout", "div", function(e) {
            ee=e;
            if (stop) {
                if (e.type === "mouseenter") {
                    // 检查目标 div 是否有图片或背景图
                    let imgSrc = getimgSrcFromElement(this);
                    if (imgSrc) {
                        // console.log("目标 div 元素包含图片地址：" + imgSrc);
                        xianshitupian(e,imgSrc);
                        return;
                    }
                    // 检查目标 div 前面的兄弟元素是否有图片或背景图
                    let prevSiblingImgSrc = getSiblingImgSrc(this, "prev");
                    if (prevSiblingImgSrc) {
                        // console.log("目标 div 前面的兄弟元素包含图片地址：" + prevSiblingImgSrc);
                        xianshitupian(e,prevSiblingImgSrc);
                        return;
                    }
                    // 检查目标 div 后面的兄弟元素是否有图片或背景图
                    let nextSiblingImgSrc = getSiblingImgSrc(this, "next");
                    if (nextSiblingImgSrc) {
                        // console.log("目标 div 后面的兄弟元素包含图片地址：" + nextSiblingImgSrc);
                        xianshitupian(e,nextSiblingImgSrc);
                        return;
                    }

                } else if (e.type === "mousemove") {
                    // 更新图片位置
                    tupianweizhi(e, imgw, imgh);
                } else if (e.type === "mouseout") {
                    // 隐藏图片预览
                    $("#dashixiong_preview").stop(true, false).hide();
                }
            }
        });

    }

    // 获取目标 div 前或后的兄弟元素中的图片地址
    function getSiblingImgSrc(element, direction) {
        let sibling = (direction === "prev") ? element.previousElementSibling : element.nextElementSibling;
        if (sibling) {
            let imgSrc = getimgSrcFromElement(sibling);
            if (imgSrc) {
                return imgSrc;
            }
        }
        return null;
    }

    // 函数用于获取元素中的图片地址或背景图地址
    function getimgSrcFromElement(element) {
        let imgSrc = null;
        let children = element.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName.toLowerCase() === "img") {
                imgSrc = children[i].src;
                break;
            }
        }
        if (!imgSrc) {
            let backgroundImage = window.getComputedStyle(element).backgroundImage;
            if (backgroundImage && backgroundImage !== "none") {
                // 检查背景图是否是图片地址
                if (backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)) {
                    imgSrc = backgroundImage.replace(/^url\(["']?(.*?)["']?\)$/, "$1");
                }
            }
        }
        return imgSrc;
    }



    function isKuaijiejian(){
        // 添加菜单设置选项
        GM_registerMenuCommand("开启/禁用放大功能", function() {
            stop = !stop; // 切换启用/禁用状态
            GM_setValue("stop", stop); // 保存设置
            if (stop) {
                Toast("放大功能已启用");
            } else {
                Toast("放大功能已禁用");
            }
        });

        // 监听键盘按键释放事件
        $(document).on("keyup", function(event) {
            // 检查是否释放了 Alt 键
            if (event.key === "Alt") {
                stop = !stop; // 切换启用/禁用状态
                GM_setValue("stop", stop); // 保存设置
                if (stop) {
                    Toast("放大功能已启用");
                } else {
                    Toast("放大功能已禁用");
                }
            }
        });

    }

    function gaidizhi(imgSrc){
        let url = window.location.hostname;
        if(/weibo.com/i.test(url)){
            if(/\/orj360\//i.test(imgSrc)){
                imgSrc = imgSrc.replace(/orj360/i,'mw2000');
            }
        }else if(/(taobao|tmall).com/i.test(url)){
            //解决淘宝缩略图问题
            if(/.(jpg|png|jpeg)_(\d+)x(\d+).jpg_.webp/i.test(imgSrc)){
                imgSrc = imgSrc.replace(/_(\d+)x(\d+).jpg_.webp/i,'');
            }else if(/.(jpg|png|jpeg)_(\d+)x(\d+)q(90|75|50)(s50)?.jpg_.webp/i.test(imgSrc)){
                imgSrc = imgSrc.replace(/_(\d+)x(\d+)q(90|75|50)(s50)?.jpg_.webp/i,'');
            }else if(/.(jpg|png|jpeg)_q(90|75).jpg/i.test(imgSrc)){
                imgSrc = imgSrc.replace(/_q(90|75).jpg/i,'');
            }else if(/.(jpg|png|jpeg)_(\d+)x(\d+).jpg/i.test(imgSrc)){
                imgSrc = imgSrc.replace(/_(\d+)x(\d+).jpg/i,'');
            }
        }else if(/bilibili.com/i.test(url)){
            // 检查字符串中是否存在非图片格式的尾部信息
            if (/(\.(jpg|jpeg|png|gif|bmp|tiff|psd|ico|svg|webp|heif|heic))@.*$/i.test(imgSrc)) {
                // 移除非图片格式的尾部信息
                imgSrc = imgSrc.replace(/(\.(jpg|jpeg|png|gif|bmp|tiff|psd|ico|svg|webp|heif|heic))@.*$/i, "$1");
                // console.log("调整B站图片地址：" + imgSrc);
            }
        }
        // 检查图片网址中是否有?+一串字符的
        if (/(\.(jpg|jpeg|png|gif|bmp|tiff|psd|ico|svg|webp|heif|heic))\?.*$/i.test(imgSrc)) {
            // 移除非图片格式的尾部信息
            imgSrc = imgSrc.replace(/(\.(jpg|jpeg|png|gif|bmp|tiff|psd|ico|svg|webp|heif|heic))\?.*$/i, "$1");
            // console.log("调整B站图片地址：" + imgSrc);
        }
        // 检查图片网址中是否有_+一串字符的
        if (/(\.(jpg|jpeg|png|gif|bmp|tiff|psd|ico|svg|webp|heif|heic))_.*$/i.test(imgSrc)) {
            // 移除非图片格式的尾部信息
            imgSrc = imgSrc.replace(/(\.(jpg|jpeg|png|gif|bmp|tiff|psd|ico|svg|webp|heif|heic))_.*$/i, "$1");
            // console.log("调整B站图片地址：" + imgSrc);
        }

        return imgSrc;

    }


    function xianshitupian(e, imgurl){
        imgSrc = gaidizhi(imgurl);
        $("#dashixiong_preview img").attr("src", imgSrc).attr("style","width: auto").attr("style","height: auto");
        getImageWidth(imgSrc, function(size) {
            // console.log("图片宽度:", size[0], "图片高度:", size[1],"图片地址" + imgurl ,"添加进去的地址" + $("#dashixiong_preview img").attr("src"));
            imgw = size[0];
            imgh = size[1];
        });
        tupianweizhi(e, imgw, imgh);
        $("#dashixiong_preview").stop(true, false).show();
    }
    function guanbitupian(){
        $("#dashixiong_preview").stop(true, false).hide();
    }


    function tupianweizhi(e, img_width, img_height) {
        $("#dashixiong_preview img").width(img_width);
        $("#dashixiong_preview img").height(img_height);

        let jianxi = 20;
        let window_height = $(window).height();
        let window_width = $(window).width();
        if(window_height > window.screen.height)window_height = document.body.clientHeight;

        if (img_height > window_height || img_width > window_width) {
            if (window_width*img_height/img_width > window_height) {
                $("#dashixiong_preview img").css({
                    "height": window_height,
                    "width": img_width * window_height / img_height
                });
            }else{
                $("#dashixiong_preview img").css({
                    "height": img_height * window_width / img_width,
                    "width": window_width
                });
            };
        };

        img_height = $("#dashixiong_preview img").height();
        img_width = $("#dashixiong_preview img").width();

        if (img_height + e.clientY < window_height && img_width + e.clientX < window_width){
            //console.log("显示在鼠标右下");
            $("#dashixiong_preview").css({
                top: e.clientY + jianxi,
                left: (e.clientX + img_width + jianxi > window_width) ? window_width - img_width - jianxi : e.clientX + jianxi,
            });
        } else if (img_height + e.clientY > window_height && img_width + e.clientX < window_width) {
            //console.log("显示高度超过屏幕,显示在鼠标左右两侧");
            if (img_height + e.clientY + jianxi > window_height) {
                $("#dashixiong_preview").css({
                    top: (e.clientY - img_height - jianxi) < 0 ? 0 : e.clientY - img_height - jianxi,
                    left: ((e.clientX - img_width - jianxi) < 0 && e.clientX + jianxi + img_width > window_width) ? window_width - img_width - jianxi : e.clientX + jianxi
                });
            }
        } else if (img_width + e.clientX + jianxi > window_width && img_height + e.clientY < window_height) {
            //console.log("显示宽度超过屏幕，显示在鼠标上下两侧");
            $("#dashixiong_preview").css({
                top: (e.clientY - img_height - jianxi) < 0 ? 0 : e.clientY + jianxi,
                left: (e.clientX - img_width - jianxi) < 0 ? 0 : e.clientX - img_width - jianxi,
            });
        } else if (img_width + e.clientX > window_width && img_height + e.clientY > window_height) {
            //console.log("显示高度和宽度均超过屏幕");
            if (e.clientX - img_width - jianxi > 0 && e.clientY - img_height - jianxi > 0) {//左上角
                $("#dashixiong_preview").css({
                    top: e.clientY - img_height - jianxi,
                    left: e.clientX - img_width - jianxi,
                });
            } else if (e.clientX - img_width - jianxi < 0 && e.clientY - img_height - jianxi > 0) {//宽度超大左上角，左边固定
                $("#dashixiong_preview").css({
                    top: e.clientY - img_height - jianxi,
                    left: 0,
                });
            } else if (e.clientX - img_width - jianxi > 0 && e.clientY - img_height - jianxi < 0) {//高度超大左上角，顶边固定
                $("#dashixiong_preview").css({
                    top: 0,
                    left: e.clientX - img_width - jianxi,
                });
            } else if (e.clientX - img_width - jianxi < 0 && e.clientY - img_height - jianxi < 0) {//高宽均超大，固定左上角边
                $("#dashixiong_preview").css({
                    top: 0,
                    left: 0,
                });
            };

        }
    }


    function getImageWidth(img_url, callback) {
        // 创建对象
        var img = new Image();
        // 改变图片的src
        img.src = img_url;
        // 判断是否有缓存
        if (img.complete) {
            // 图片已经加载完成，直接调用回调函数
            callback([img.width, img.height]);
        } else {
            // 图片还在加载中，等待加载完成后调用回调函数
            img.onload = function() {
                callback([img.width, img.height]);
            };
        }
    }

    function Toast(msg,duration){
        duration=isNaN(duration)?3000:duration;
        let m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            let d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }

    function getViewprotOffset() {
        if (window.innerWidth) {
            return [window.innerWidth,window.innerHeight]
        } else {
            if (document.compatMode == "BackCompat") {
                return [document.body.clientWidth, document.body.clientHeight]
            } else {
                return [document.documentElement.clientWidth, document.documentElement.clientHeight]
            }
        }
    }

})();