// ==UserScript==
// @name         手机贴吧优化
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  针对浏览器直接访问贴吧的页面进行优化
// @author       Container_Z
// @license MIT
// @match        https://tieba.baidu.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/468992/%E6%89%8B%E6%9C%BA%E8%B4%B4%E5%90%A7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/468992/%E6%89%8B%E6%9C%BA%E8%B4%B4%E5%90%A7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///////////////////////////////////////方法列表///////////////////////////////////////////////////
    function replace_broken_img(){//替换所有破损的表情连接
        var images = document.querySelectorAll('.emotion-img');
        // 遍历每个图片
        for (var i = 0; i < images.length; i++) {
            // 获取图片的src属性
            var src = images[i].getAttribute("src");
            // 如果图片指向https://static.tieba.baidu.com/
            if (src && src.startsWith("http://static.tieba.baidu.com/")) {
                // 替换为指向https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/
                var newSrc = src.replace("http://static.tieba.baidu.com/", "http://tb2.bdstatic.com/");//或者替换为https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/
                // 设置新的src属性
                images[i].setAttribute("src", newSrc);
                // 重新加载图片对应的资源
            }
        }
    }

    function add_a_herf_img(elem='.media-content img,.post-img-wrapper img'){//为所有贴吧图片添加一个a标签父级以便灯箱识别
        // 获取所有在用户文章内，是img并且已加载完成的dom
        var images = document.querySelectorAll(elem);
        // 遍历每个img元素
        images.forEach(function(image) {
            // 获取img元素的src属性值
                image.onload = function() {
                    if (image.parentElement && image.parentElement.tagName != "A") {
                    var src = image.getAttribute("data-src");
                    if(src){
                        // 获取img元素的父节点
                        var parent = image.parentElement;
                        // 创建一个a元素
                        var link = document.createElement("a");
                        // 设置a元素的data-fancybox属性为"gallery"
                        link.setAttribute("data-fancybox", "gallery");
                        // 设置a元素的href属性为img元素的src属性值
                        link.setAttribute("href", src);
                        // 使用父节点的replaceChild()方法，将img元素替换为a元素
                        parent.replaceChild(link, image);
                        // 使用a元素的append()方法，将img元素添加为a元素的子节点
                        link.append(image);
                    }
                };
            };
        });
    }

    function add_fancybox(){//为图片附加灯箱
        Fancybox.bind('[data-fancybox="gallery"]', {
            wheel: "slide", //滚轮
            contentClick: false, //单击鼠标
            contentDblClick: "toggleZoom", //双击鼠标
            idle: false,
            Thumbs: {
                type: "modern",
                showOnStart: false, //打开时不显示
            },
            backdropClick: false,
            compact: false,
            Carousel: { //缩放移动相关
                Navigation: false,
            },
            Images: {
                Panzoom: { //最大缩放倍率
                    maxScale: () => {
                        return 2.5;
                    },
                },
            },
            Toolbar: { //顶部工具栏
                display: {
                    left: ["infobar"], //顶部左侧
                    middle: [],
                    right: ["flipY", "flipX", "rotateCCW", "rotateCW","slideshow", "thumbs", "close"], //right: ["flipY", "flipX", "rotateCCW", "rotateCW", "zoomIn", "zoomOut", "slideshow", "fullscreen", "thumbs", "close"],
                },
            },
            //在文章输出时在preview内，就对移动、PC端做过判断，移动端则输出data-srcset=缩略图地址，并在灯箱渲染时作为srcset属性存在，此属性存在时，会覆盖原图的src属性，灯箱显示的图片会变成缩略图，此时通过保留和删除该属性，便可以实现缩略图与原图之间的切换
            on: {
                'Carousel.ready': (event) => { //初始化加载完成
                    event.container.style.setProperty( //背景显示放大模糊缩略图
                        '--bg-image',
                        `url("${event.getSlide().thumbSrc}")`
                    );
                },
                'Carousel.change': (event) => { //图片成功切换到下一张时执行（左右拖动图片松开鼠标的瞬间）
                    event.container.style.setProperty( //背景显示放大模糊缩略图
                        '--bg-image',
                        `url("${event.getSlide().thumbSrc}")`
                    );
                },

            },
        });
    }
    //////////////////////////////////方法执行////////////////////////////////////
    window.addEventListener("scroll", function(event) {
        replace_broken_img();
        add_a_herf_img();
    });

    // 文档内容发生变化时触发一次事件
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            replace_broken_img();
            add_a_herf_img();
        });
    });
    observer.observe(document, {childList: true, subtree: true});


    ////////////////////////载入fancybox文件，并在文件加载完成后执行灯箱初始化///////////////////////
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css");
    document.head.appendChild(link);

    var script = document.createElement("script");
    script.setAttribute("src", "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js");
    script.onload = function() {
        add_fancybox();
    };
    document.head.appendChild(script);

    ////////////////////////为文档附加样式///////////////////////
    var styleElement = document.createElement("style");
    styleElement.innerText = `

    a[data-fancybox] img {
	  cursor: zoom-in;/*画廊首页的图像缩略图，指针为放大镜*/
	}
	.fancybox__caption {
	  display:none;/*图片标题*/
	}

	.fancybox__container {
	  --fancybox-bg: #000;/*图片背景为全黑*/
	}
	/*背景附加上当前图片的模糊缩略图*/
	.fancybox__backdrop::after {
	    content: "";
	    position: absolute;
	    width: 100%;
	    height: 100%;
	    filter: blur(20px);
	    transform: scale(1.1);
	    opacity: 0.3;
	    background-image: var(--bg-image);
	    background-size: cover;
	    background-repeat: no-repeat;
	    background-position: center center;
	}

	/*为工具栏按钮修改颜色，图标粗细*/
	.fancybox__toolbar,
	.fancybox__nav {
	  --f-button-bg: transparent;
	  --f-button-hover-bg: rgb(90 90 90 / 70%);
	  --f-button-active-bg: rgb(90 90 90 / 40%);
	  --f-button-svg-stroke-width: 2.2;
	}

	/*修改工具栏被禁用的按钮颜色*/
	.f-button[disabled] svg{
	    --f-button-svg-disabled-opacity: .4;
	}
	/*修改灯箱内部，图片的距离屏幕边框的边距*/
	.fancybox__slide{
	    padding: 48px 8px 8px;
	}

	@media (min-width: 1024px){
	    .fancybox__slide {
	        padding: 64px 100px;
	    }
	}

	/*修复现代模式的缩略图中，点选缩略图后鼠标平移拖拽图片，白色描边的焦点还会停留在原本缩略图上的bug*/
	.is-modern .f-thumbs__slide:focus-within:not(.is-selected) {
	    filter: none;
	}

	/*屏幕宽度过小时隐藏部分工具栏按钮*/
	@media (max-width: 370px){
	    button.f-button[data-panzoom-action="flipX"],button.f-button[data-panzoom-action="flipY"]{
	        display: none;
	    }
	}
	@media (max-width: 280px){
	    button.f-button[data-panzoom-action="rotateCW"],button.f-button[data-panzoom-action="rotateCCW"]{
	        display: none;
	    }
	}
	@media (max-width: 190px){
	    button.f-button[data-panzoom-action="zoomIn"],button.f-button[data-panzoom-action="zoomOut"]{
	        display: none;
	    }
	}

	`;
    document.head.appendChild(styleElement);
})();