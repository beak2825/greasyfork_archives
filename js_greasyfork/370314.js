// ==UserScript==
// @name         PMISO
// @namespace    http://www.womow.cn/
// @version      0.4.7
// @description  增强报销页面的功能
// @require    https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js
// @author       Song
// @match        *://pmis.womow.cn/pmis/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370314/PMISO.user.js
// @updateURL https://update.greasyfork.org/scripts/370314/PMISO.meta.js
// ==/UserScript==

(function () {

    /**
     * 添加截图按钮。
     * 报销单打印页面添加截图按钮。
     */
    function addSnapBtn() {
        var targetNode = document.querySelector('#baseTable').querySelector("span");
        afterMutation(targetNode, prepareSnap);
    }

    /**
     * 初始化截图功能
     */
    function prepareSnap() {

        // 外层容器
        var c = $("#baseTable");

        /*找出报销单号*/
        var h = c.find(".header span").text();
        var hs = h.trim().split("：");
        if (hs.length > 1 && hs[1].length > 0) {
            h = hs[1];
        } else {
            console.warn("未能找到报销单号，终止操作！", h);
            return;
        }

        /* 调整布局、添加元素*/
        c.css({padding: "10px"});
        $('#caiqie').css('z-index',-1);//裁切线div

        // 控制区容器
        var cd = $(".btnframe");
        cd.append('<a id="snapLink" class="down" href="" download="foo.png"></a>');
        cd.append('<button id="snapBtn" class="green">截图</button>');


        var b = document.querySelector("#snapBtn");
        b.addEventListener("click", function (event) {
            snap();
        });

        /**
         * 快照
         */
        function snap() {
            var a = document.querySelector("#snapLink");
            if (a.getAttribute("data-snapped") === "true") {
                a.dispatchEvent(new MouseEvent('click', {cancelable: true, bubble: true, view: window}));
            } else {
                doSnap();
            }
        }

        /*
         * 给报销单快照，真正的截图方法。
         */
        function doSnap() {
            cd.hide();

            /*
             *  html2canvas-0.5 默认背静是透明。1.0默认背景是白色
             */
            html2canvas(document.querySelector("#baseTable"), {"background": "#FFF"}).then(function (canvas) {
                document.body.appendChild(canvas);
                var a = document.querySelector("#snapLink");
                a.setAttribute("download", h + ".png");
                a.setAttribute("data-snapped", "true");
                a.setAttribute('href', canvas.toDataURL());
                a.dispatchEvent(new MouseEvent('click', {cancelable: true, bubble: true, view: window}));
                document.body.removeChild(canvas);
                /*
                 * hide() show() 会增加内嵌样式“display”，导致打印时，@print 中的隐藏样式无法覆盖内嵌display样式。依然会显示。
                 *  因此使用 removeAttr("style"); 代替 // cd.show();
                 */
                cd.removeAttr("style");
            });
        }


    }


    /**
     * 页面元素改变之后执行回调。仅执行一次。用于数据加载之后执行初始化操作。
     * @param target 元素Node
     * @param callback 回调函数
     */
    function afterMutation(target, callback) {
        var config = {childList: true, attributes: true, characterData: true, subtree: true};
        var observer = new MutationObserver(function (mutations) {
            callback();
            observer.disconnect();
        });
        observer.observe(target, config);
    }


    /**
     * 初始化方法
     */
    function init() {
        var pathname = window.location.pathname;
        if (pathname.indexOf("bx_print.jsp") > 0) {
            addSnapBtn();
        }
    }

    init();
})();