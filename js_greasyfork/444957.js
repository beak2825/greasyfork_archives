// ==UserScript==
// @name         图片列表全屏
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  网页图片全屏查看,缩放, 切换
// @author       liangxin
// @match        *://*/*
// @grant      GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/444957/%E5%9B%BE%E7%89%87%E5%88%97%E8%A1%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444957/%E5%9B%BE%E7%89%87%E5%88%97%E8%A1%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    // 图片数组
    let imgs;

    // 图片浏览父容器
    let div;
    // 当前操作的 图片元素;
    let img;
    // 当前操作图片索引
    let imgIndex = 0;
    // 图片大小
    let imgSize;
    // 图片宽高比
    let imgAspectRatio;
    // 图片缩放比例
    let imgZoomNum = 1;
    // 初始缩放比例, 即第一次展示时的缩放比例
    let initImgZoomNum = 1;


    function loading() {
        if(!loadImg()){
            return;
        }
        initMenu();
        initEvent();
        // initDiv();
    }
    let loadImg=()=>{
        // 获取图片元素集合
        imgs = Array.from(document.getElementsByTagName("img"));
        // 过滤小图片
        let min=150
        imgs = imgs.filter(img => img.width > min && img.height > min);
        if (imgs.length <1) {
            return false;
        }
        return true;
    }


    /**
         * 加载菜单
         */
    let initMenu = () => {
        // 右键菜单
        let msg = `Ctrl + I : 开启图片全屏列表  Shift + I : 重新加载图片全屏列表
            ESC : 退出图片全屏
            鼠标滚轮: 缩放图片 鼠标拖动: 移动图片
            `;
        const w = unsafeWindow || window;
        GM_registerMenuCommand('图片浏览快捷键表', alert.bind(w, msg));
    }


    /**
         *  加载父级容器
         */
    let initDiv = () => {
        // 每次初始索引
        imgIndex = 0;
        // 如果已有 容器, 则不再重新创建
        if (div) {
            div.style.width = window.innerWidth + "px";
            div.style.height = window.innerHeight + "px";
            div.style.display = "block";
            return;
        }
        div = document.createElement("div");
        div.style.width = window.innerWidth + "px";
        div.style.height = window.innerHeight + "px";
        div.style.backgroundColor = "#000";
        div.style.position = "fixed";
        div.style.top = 0;
        div.style.left = 0;
        div.style.zIndex = 9999999;
        div.style.display = "block";
        div.style.overflow = "hidden";
        document.body.append(div);
    }

    /**
         * 显示图片
         */
    let imgShow = () => {
        let showImg = new Image();
        showImg.src = imgs[imgIndex].src;
        showImg.title = imgs[imgIndex].title === "" ? "第" + (imgIndex + 1) +"/"+imgs.length+ "张" : imgs[imgIndex].title;

        showImg.style.position = "absolute";
        div.innerHTML = showImg.outerHTML;
        img = div.querySelector("img");
        // 判断是否已加载成功
        if (img.complete) {
            imgSize = {
                "width": img.width,
                "height": img.height
            };
            imgAspectRatio = getImgAspectRatio(img);
            imgZoomNum = 1;
            setImgSize();
        } else {
            // 如果还未加载成功, 则将 设置大小的操作,写在 图片的 onload 函数中
            img.onload = function() {
                imgSize = {
                    "width": img.width,
                    "height": img.height
                };
                imgAspectRatio = getImgAspectRatio(img);
                imgZoomNum = 1;
                setImgSize();
            }
        }
        imgZoomEvent();
        imgMove();

    }


    /**
         * 初始 图片大小
         */
    function setImgSize() {
        let newHeight = window.innerHeight;
        let newWidth = 0;
        do {
            newHeight = newHeight - 5;
            newWidth = calculateWidth(newHeight, imgAspectRatio);
        } while (newWidth > window.innerWidth);
        imgZoom(newHeight / imgSize.height);
        initImgZoomNum = imgZoomNum;
    }

    /**
         * 图片左右居中
         */
    function imgCenter() {
        img.style.marginLeft = (window.innerWidth - img.width) / 2 + "px";
    }

    /**
         * 根据比例关系, 已知 高度, 计算 宽度
         */
    function calculateWidth(heigth, aspectRatio) {
        return parseInt(heigth * aspectRatio.width / aspectRatio.height);
    }

    /**
         * 根据比例关系, 已知 宽度, 计算 高度
         */
    function calculateHeight(width, aspectRatio) {
        return parseInt(width * aspectRatio.height / aspectRatio.width);
    }

    /**
         * 缩放图片
         */
    let imgZoom = (zoom = 1) => {
        let newHeight = float_calculator.mul(imgSize.height, zoom);
        img.height = parseInt(newHeight);
        img.width = calculateWidth(newHeight, imgAspectRatio);
        imgCenter();
        showMsg.show(parseInt(float_calculator.mul(zoom, 100)) + "%");
        imgZoomNum = zoom;
        return false;
    }

    /**
         * 鼠标滚轮缩放事件
         */
    let imgZoomEvent = () => {
        // 缩放基数
        let zoom = 0.1;
        let zoomEvent = (zoomOpt) => {
            if (initImgZoomNum == imgZoomNum) {
                let i = (imgZoomNum * 100) % (zoom * 100);
                if (i > 0) {
                    imgZoomNum = (imgZoomNum * 100 + zoom * 100 - i) / 100
                }
            }
            if (zoomOpt) {
                // 向上 放大
                imgZoomNum = float_calculator.add(imgZoomNum, zoom)
            } else {
                // 向下 // 缩小
                imgZoomNum = float_calculator.add(imgZoomNum, -zoom)
            }
            if (imgZoomNum < zoom) {
                imgZoomNum=zoom;
                return;
            }
            imgZoom(imgZoomNum);
            return false;
        }
        div.onmousewheel = function(e) {
            zoomEvent(e.wheelDelta > 0);
        };


        // 双击回复为 初始缩放比例
        div.addEventListener("dblclick", e => {
            imgZoom(initImgZoomNum);
        })
    }

    let imgMove = () => {

        let imgTop = 0;
        let imgLeft = 0;
        let mx = 0;
        let my = 0;

        img.ondragstart = e => {
            mx = e.screenX;
            my = e.screenY;
            if (img.style.top === "") {
                imgTop = 0;
                imgLeft = 0;
            }
        }

        img.ondrag = e => {
            if (e.screenY == 0 && e.screenX == 0) {
                return
            }
            imgTop = imgTop + e.screenY - my;
            imgLeft = imgLeft + e.screenX - mx;
            mx = e.screenX;
            my = e.screenY;
            img.style.top = imgTop + "px";
            img.style.left = imgLeft + "px";

        }

    }

    /**
         * 初始化事件
         */
    let initEvent = () => {
        window.addEventListener("keydown", e => {
            // <-  和 -> 切换图片
            if (e.keyCode == 37 || e.keyCode == 39) {
                if (e.keyCode == 39) {
                    imgIndex++;
                    imgIndex = imgIndex >= imgs.length ? 0 : imgIndex;
                } else {
                    imgIndex--;
                    imgIndex = imgIndex < 0 ? imgs.length - 1 : imgIndex;
                }
                imgShow();
            }
            // ESC 键 隐藏
            if (e.keyCode == 27) {
                div.style.display = "none";
            }
            // Ctrl + I  开启浏览
            if (e.ctrlKey && e.keyCode == 73) {
                initDiv();
                imgShow();
            }
            // Shift + I  重新加载图片
            if(e.shiftKey & e.keyCode == 73){
                loadImg();
                initDiv();
                imgShow();
            }
        })

    }

    window.addEventListener("load",e=>{
        loading();
    });





    //---------------------------- 工具方法 ------------------

    /**
         * 消息对象
         */
    window.showMsg = {
        flag: false,
        msgSpan: null,
        msgTimeOut: null,
        show: function(m, s = 2) {
            // 如果 已有消息, 则清除, 并清除之前的延迟计时器
            if (this.msgSpan) {
                this.msgSpan.remove();
                clearTimeout(this.msgTimeOut);
            }
            this.msgSpan = document.createElement("span");
            document.body.append(this.msgSpan);
            this.msgSpan.innerHTML = m;
            this.msgSpan.style.position = "fixed";
            this.msgSpan.style.top = "50px"
            this.msgSpan.style.left = "49vw";
            this.msgSpan.style.backgroundColor = "#000";
            this.msgSpan.style.color = "#fff";
            this.msgSpan.style.lineHeight = "30px";
            this.msgSpan.style.padding = "0 10px";
            this.msgSpan.style.opacity = 0.5;
            this.msgSpan.style.zIndex = 2147483647;
            this.msgSpan.style.display = "block";
            this.msgSpan.style.borderRadius = "10px";
            this.msgSpan.style.minWidth = "105px";
            this.msgSpan.style.textAlign = "center";

            // 延迟删除
            this.msgTimeOut = setTimeout(() => {
                this.msgSpan.remove();
                this.flag = false;
            }, s * 1000);
        }
    }

    /**
         * 获取图片比例 [宽,高]
         */
    function getImgAspectRatio(img) {
        let i = img.width / img.height;
        console.log("比例: " + img.width + " / " + img.height + " = " + i);
        return i > 1 ? {
            "width": i,
            "height": 1
        } : {
            "width": 1,
            "height": 1 / i
        };
    }


    // 自定义高精度浮点数运算
    // 对象格式写法
    var float_calculator = {
        /**
             * 1.记录两个运算数小数点后的位数
             * 2.将其转化为整数类型进行运算
             * 3.移动小数点的位置
             **/
        add: function(arg1, arg2) {
            var r1, r2, m;
            try {
                //取小数位长度
                r1 = arg1.toString().split(".")[1].length;
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //计算因子

            return (arg1 * m + arg2 * m) / m;
        },
        minus: function(arg1, arg2) {
            return this.add(arg1, -arg2);
        },
        mul: function(arg1, arg2) {
            var r1, r2, m;
            try {
                //取小数位长度
                r1 = arg1.toString().split(".")[1].length;
                r2 = arg2.toString().split(".")[1].length;
            } catch (e) {
                r1 = 0;
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2)); //计算因子

            return (arg1 * m) * (arg2 * m) / (m * m);
        }
    };
})();