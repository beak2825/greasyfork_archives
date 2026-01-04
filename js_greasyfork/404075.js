// ==UserScript==
// @name         READTHEDOCS.IO
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       You
// @match        https://geotrellis.readthedocs.io/*
// @match        https://scala-slick.org/doc/*/*
// @match        https://www.geomesa.org/documentation/tutorials/*
// @match        http://www.sunibas.cn/pages/geotrellis-docs/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/404075/READTHEDOCSIO.user.js
// @updateURL https://update.greasyfork.org/scripts/404075/READTHEDOCSIO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //const $supWindow = window;
    window.docExpand = "docExpand";
    window.docSidebarLoc = "docSidebarLoc";
    var panelDefaultSetting = {
        name: "panelDefaultSetting",
        panelOpacity: 80,
        sidebarOpacity: 80,
        leftColor: "#a7e0e7",
        rightColor: "#79c9f9",
        docScala: 100,
    };
    var setLeftContentColor = function() {};
    var setRightContentColor = function() {};
    var getLeftContentDom = function() {};
    var getRightContentDom = function() {};
    window.panel = {
        color: 'fixColor',
        loc: 'fixLoc',
        sidebar: 'mySidebar',
    };
    window.onload = function() {
        var content = jQuery('.wy-nav-content');
        if (content.length) {
            geotrellis();
            return;
        }
        if (location.host == "scala-slick.org") {
            slick();
        }
        addSetting();
    }
    function addSetting() {
        var settingBtn = jQuery(`<div style="position: fixed;top: 0;left: 0;
z-index: 1000;border: 50px solid;border-top-color: #3F51B5;max-width:100px;max-height:100px;
border-bottom-color: #ffff0000;border-left-color: #9C27B0;cursor: pointer;
border-right-color: #0000ff00;"></div>`);
        jQuery('body').append(settingBtn);
        var settingPanel = jQuery(`<div style="position: fixed;display:none;
    top: 20%;padding:20px;left: 20%;color:white;
    width: 60%;height: 60%;z-index: 1000;background: black;
"><div style="width: 100%;line-height: 20px;cursor: pointer;" tar="close">关闭</div></div>`);
        function updateValue(name,value) {
            panelDefaultSetting[name] = value;
            setContent(panelDefaultSetting.name,panelDefaultSetting);
        }
        function addRange(label,defaultValue,name,onchange,max,min,step) {
            var range = jQuery(`<div style="width: 100%;line-height: 20px;">
<lable style="display: inline-block;width: 20%;text-align: center;">${label}</lable>
<input type="range" style="width: 70%;display:inline-block;" min="${min || 30}" max="${max || 100}" step="${step || 1}"></div>`);
            var inp = range.find('input');
            inp.val(defaultValue || 100);
            inp.on('change',function(e) {
                onchange(e.target.value);
                updateValue(name,e.target.value);
            });
            onchange(defaultValue || 100);
            return range;
        }
        function addColor(label,defaultValue,name,onchange) {
            var range = jQuery(`<div style="width: 100%;line-height: 20px;">
<lable style="display: inline-block;width: 20%;text-align: center;">${label}</lable>
<input type="color" style="width: 70%;display:inline-block;"></div>`);
            var inp = range.find('input');
            inp.val(defaultValue);
            inp.on('change',function(e) {
                onchange(e.target.value);
                updateValue(name,e.target.value);
            });
            onchange(defaultValue);
            return range;
        }
        jQuery('body').append(settingPanel);

        panelDefaultSetting = getContent(panelDefaultSetting.name,panelDefaultSetting);
        settingPanel.append(addRange("面板透明度",panelDefaultSetting.panelOpacity,"panelOpacity",function (val) {
            settingPanel.css({opacity: val / 100});
        }));
        settingPanel.append(addRange("菜单透明度",panelDefaultSetting.sidebarOpacity,"sidebarOpacity",function (val) {
            jQuery(`#${panel.sidebar}`).css({opacity: val / 100});
        }));
        settingPanel.append(addColor("左边文档颜色",panelDefaultSetting.leftColor,"leftColor",function (val) {
            setLeftContentColor(val);
        }));
        settingPanel.append(addColor("右边文档颜色",panelDefaultSetting.rightColor,"rightColor",function (val) {
            setRightContentColor(val);
        }));
        settingPanel.append(addRange("缩放文档",panelDefaultSetting.docScala,"docScala",function (val) {
            getLeftContentDom().style.transformOrigin = "0 0";
            getLeftContentDom().style.transform = `scale(${val / 100})`;
            getRightContentDom().style.transformOrigin = "0 0";
            var offsetX = - getLeftContentDom().offsetWidth * (100 - val) / 100;
            getRightContentDom().style.transform = `scale(${val / 100}) translate(${offsetX}px, 0px)`;
            console.log(val);
        },150,50,10));
        settingPanel.find('[tar="close"]').on("click",function () {
            settingPanel.css({display: 'none'});
        });
        settingBtn.on('click',function() {
            settingPanel.css({display:'block'});
        });
    }
    function slick() {
        function slickOld() {
            var content = jQuery('.content');
            jQuery('.content-wrapper').css({
                padding: '0',
                background: 'unset'
            });
            var sidebar = jQuery('.sidebar');
            sidebar.remove();
            content.css({
                margin:"0 20px",
                width: "auto"
            });
            sidebarSetting(sidebar);
            jQuery('.clearer').css({display:'none'});
            var doc = jQuery('.document');
            doc.css({padding:'0 0px 0 15px'});
            return {content,doc,iframeStyle:"",
                left:`<div class="document">`,right:`</div`};
        }
        function slickNew() {
            let main = jQuery('main');
            let content = main.parent();
            main.css({ "max-width": "800px",display: "inline-block",position: "absolute" });
            content.parent().css({ margin:0,padding:0,"max-width":"unset" });
            let sidebar = jQuery('[data-sticky-container]');
            sidebar.remove();
            sidebar[0].style.minWidth = "250px";
            sidebarSetting(jQuery(`<div>${sidebar[0].children[0].innerHTML}</div>`));
            return {
                content,doc:main,iframeStyle: `position: absolute;left: 850px;`,
                left: '<main class="columns large-order-2 sections">',
                right: '</main>'
            };
        }
        var content = jQuery('.content');
        var dom = {};
        if (content.length === 0) {
            dom = slickNew();
        } else {
            dom = slickOld();
        }

        dom.content.append(jQuery(`<iframe id="copy" style="${dom.iframeStyle}"></iframe>`));
        copyToIframe(copy,dom.doc[0],dom.left,dom.right);
        copy.style.border = "none";
        setTimeout(function() {
            copy.contentDocument.body.style.padding = "0 10px";
            copy.contentDocument.body.children[0].style.width = (copy.contentWindow.innerWidth - 20) + "px";
        });
    }
    function geotrellis() {
        var content = jQuery('.wy-nav-content-wrap');
        var sidebar = jQuery('.wy-nav-side');
        jQuery('.wy-nav-content-wrap').css({margin:0});
        content.css({
            margin:"0"
        });
        sidebar.remove();
        sidebar.css({
            position: "unset",
            "overflow-y": "scroll"
        });
        sidebarSetting(sidebar);
        var doc = jQuery('.wy-nav-content');
        doc.css({float:"left"});
        content.append(jQuery('<iframe id="copyDoc"></iframe>'));
        copyToIframe(copyDoc,doc[0],`<div class="wy-nav-content">`,`</div`);
        copyDoc.style.border = "none";
        setTimeout(function() {
            copyDoc.contentDocument.body.style.padding = "0 10px";
            copyDoc.contentDocument.body.children[0].style.width = (copyDoc.contentWindow.innerWidth - 20) + "px";
        });
    }
    function sidebarSetting(sidebar) {
        function resize() {
            var height = window.innerHeight * 0.9;
            if (sidebar.height() <= window.innerHeight * 0.9) {
                sidebar.css({
                    height: "auto",
                    "overflow-y": "unset"
                });
            } else {
                sidebar.css({
                    height: height + "px",
                    "overflow-y": "scroll"
                });
            }
        };
        var newSidebar = jQuery(`<div id="${panel.sidebar}">
<div style="cursor: pointer;user-select: none;padding: 5px;background: darkseagreen;">
   <div style="display: inline;padding-right:20px" tar="expandSide">展开</div>
   <div style="display: inline;" tar="dExpandSide">收起</div>
   <div style="display: inline;" tar="dragTo">点我拖动</div>
</div></div>`);
        jQuery('body').append(newSidebar);
        newSidebar.append(sidebar);
        var loc = getContent(docSidebarLoc,{top:20,right:10});
        newSidebar.css({
            position: "fixed",
            "z-index": 100000,
            background: "#82c8ff",
            padding: "20px",
            top: loc.top + 'px',
            right: loc.right + 'px',
        });

        var res = window.onresize || (() => {});
        window.onresize = function() {
            res();
            resize();
        };
        resize();
        window.expandSide = function() {
            sidebar.css({display:'block'});
            setContent(docExpand,{ex:true});
        };
        window.dExpandSide = function() {
            sidebar.css({display:'none'});
            setContent(docExpand,{ex:false});
        };
        newSidebar.find('[tar="expandSide"]').on('click',expandSide);
        newSidebar.find('[tar="dExpandSide"]').on('click',dExpandSide);
        var ex = getContent(docExpand,{ex:false}).ex;
        if (ex) {
            expandSide();
        } else {
            dExpandSide();
        }
        // 处理拖动
        newSidebar.find('[tar="dragTo"]').hover(function(){
            $(this).css({"background": "#82c8ff",
                padding: "5px",
                "line-height": "16px",
                "box-sizing": "border-box"
            });//hover时效果
        },function(){
            $(this).css({"background": "unset",
                padding: "0",
                "line-height": "unset",
                "box-sizing": "unset"
            });//hover时效果
        });
        let dragObj = {
            drag: false,
            fromX: 0,
            fromY: 0,
            top: loc.top,
            right: loc.right
        };
        newSidebar.find('[tar="dragTo"]').on("mousedown",function(e) {
            dragObj.drag = true;
            dragObj.fromX = e.clientX;
            dragObj.fromY = e.clientY;
        }).on("mousemove",function(e) {
            if (!dragObj.drag) return;
            var detaX = dragObj.fromX - e.clientX; // 左 正
            var detaY = dragObj.fromY - e.clientY; // 下 负
            // 改变 坐标位置
            dragObj.right += detaX;
            dragObj.top -= detaY;
            newSidebar.css({
                right: dragObj.right + "px",
                top: dragObj.top + "px",
            });
            dragObj.fromX = e.clientX;
            dragObj.fromY = e.clientY;
        }).on("mouseup",function() {
            dragObj.drag = false;
            setContent(docSidebarLoc,{top:dragObj.top,right:dragObj.right});
        });
    }
    function wy_nav_content() {
        var content = jQuery('.wy-nav-content');
        var parentDiv = content.parent();
        parentDiv[0].style.background = "#fff";
        content[0].style.float = 'left';
        content[0].style.background = 'darkkhaki';
        parentDiv.append(jQuery('<iframe id="copy"></iframe>'));
        copyToIframe(copy,content[0],`<div class="wy-nav-content" style="float: left;">`,`</div>`);
    }
    function copyToIframe(copyIfr,copyEle,outerLeft,outerRight) {
        setTimeout(function() {
            setTimeout(function(){
                var ls = document.getElementsByTagName('head')[0].getElementsByTagName('link');
                for (var i = 0;i < ls.length;i++) {
                    if (ls[i].getAttribute('rel') == "stylesheet") {
                        copyIfr.contentWindow.document.getElementsByTagName('body')[0].innerHTML += `<link rel="stylesheet" href="${ls[i].href}" type="text/css">`;
                    }
                }
            },500);
            copyIfr.contentWindow.document.getElementsByTagName('body')[0].innerHTML = outerLeft + copyEle.innerHTML + outerRight;
            copyIfr.style.height = copyEle.clientHeight + "px";
            copyIfr.style.width = (copyEle.clientWidth + 50) + "px";
        });
        setLeftContentColor = function(color) {
            copyEle.style.background = color;
        };
        setRightContentColor = function(color) {
            copyIfr.contentDocument.body.style.background = color;
        };
        getLeftContentDom = function() {
            return copyEle;
        }
        getRightContentDom = function() {
            return copyIfr;
        }
        // 上下运动
        setTimeout(function() {
            jQuery('body').append(jQuery(`
<div id="${panel.loc}" style="position: fixed;right: 20px;top: 50%;font-size: xx-large;cursor: pointer;user-select: none;">
<div id="justLocUp" style="background: cadetblue;border-radius: 10px;padding: 5px;">上</div>
<div id="closeFixLoc" style="margin-top: 5px;background: cadetblue;border-radius: 10px;padding: 5px;">关</div>
<div id="justLocDown" style="margin-top: 5px;background: cadetblue;border-radius: 10px;padding: 5px;">下</div>
</div>`));
            jQuery("#closeFixLoc").on("click",function() {
                jQuery("#fixLoc")[0].style.display = "none";
            });
            let currentLoc = 0;
            let justLoc = function(tar) {
                let cloc = currentLoc + tar * 50;
                if (cloc < 0) {
                    return;
                } else {
                    copyEle.style.marginTop = cloc + "px"
                    currentLoc = cloc;
                }
            }
            jQuery("#justLocUp").on("click",function() {
                justLoc(-1);
            });
            jQuery("#justLocDown").on("click",function() {
                justLoc(1);
            });
        });
    }
    function getContent(name,defaultValue) {
        var value = GM_getValue(name,JSON.stringify(defaultValue));
        return JSON.parse(value);
    }
    function setContent(name,value) {
        GM_setValue(name,JSON.stringify(value));
    }
    // Your code here...
})();