// ==UserScript==
// @name         蓝湖-交互优化
// @namespace    http://fulicat.com
// @version      1.0.7
// @description  优化愚蠢的交互方式和样式，让操作更便捷更人性！
// @homepage     https://greasyfork.org/zh-CN/scripts/446560
// @author       Jack.Chan
// @license MIT
// @url          https://greasyfork.org/zh-CN/scripts/446560-%E8%93%9D%E6%B9%96-%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96
// @match        https://lanhuapp.com/*
// @icon         https://lhcdn.lanhuapp.com/web/static/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446560/%E8%93%9D%E6%B9%96-%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446560/%E8%93%9D%E6%B9%96-%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
var common_cssRules = `
html ::-webkit-scrollbar{
    width: 17px !important;
    height: 17px !important;
}
`;

var board_cssRules = `
html ::-webkit-scrollbar{
    width: 17px !important;
    height: 17px !important;
}

/* .notice_box */
.notice_box li .member-user{
    float: none !important;
    margin-left: 53px !important;
    width: auto !important;
}


/* list */
.top-nav-tabs-link{
    height: 50px !important;
}
.top-nav-tabs-link .tabs .tabs-link{
    padding: 15px !important;
}
.top-nav-tabs-link .header-nav{
    margin-top: -10px !important;
}

.recently-dnd-list{
    margin-top: 15px !important;
    padding-top: 30px !important;
}
.recently-dnd-list .project:hover .project_item:after{
    box-shadow: 0px 0 10px 3px rgb(33 39 65 / 15%) !important;
}
.partic-item .project_list .lan-dnd-list .lan-dnd-item.outDrop,
.rencently-use .project_list .lan-dnd-list .lan-dnd-item.outDrop,
.rencently-update .project_list .lan-dnd-list .lan-dnd-item.outDrop{
    height: 80px !important;
}

#item_box .partic-item .itemContentWidth .group-content .dropContent,
#item_box .partic-item .itemContentWidth .group-content .dropContent.itemShadow,
#item_box .rencently-use .itemContentWidth .group-content .dropContent,
#item_box .rencently-use .itemContentWidth .group-content .dropContent.itemShadow,
#item_box .rencently-update .itemContentWidth .group-content .dropContent,
#item_box .rencently-update .itemContentWidth .group-content .dropContent.itemShadow{
    height: auto !important;
}

.partic-item .project .project_item .project_setting,
.rencently-use .project .project_item .project_setting,
.rencently-update .project .project_item .project_setting{
    height: auto !important;
}

.partic-item .project .detail .projectname,
.rencently-use .project .detail .projectname,
.rencently-update .project .detail .projectname{
    width: 90% !important;
}

.partic-item .project .cover,
.rencently-use .project .cover,
.rencently-update .project .cover{
    height: 60px !important;
}

.partic-item .project .cover>img,
.rencently-use .project .cover>img,
.rencently-update .project .cover>img{
    width: 32px !important;
    height: auto !important;
    opacity: 0.5 !important;
}

.partic-item .lan-scroll-item + .lan-scroll-item,
.rencently-use .lan-scroll-item + .lan-scroll-item,
.rencently-update .lan-scroll-item + .lan-scroll-item{
    margin-top: 25px !important;
}

.partic-item .common-item-group>.title,
.rencently-use .common-item-group>.title,
.rencently-update .common-item-group>.title{
    height: auto !important;
    padding-top: 5px !important;
    padding-bottom: 3px !important;
    background-color: #f7fbfd !important;
    border-bottom: 3px solid #2196f3 !important;
    border-radius: 10px 10px 0 0 !important;
    font-size: 16px;
    font-weight: bold;
}
.partic-item .common-item-group>.title:hover,
.rencently-use .common-item-group>.title:hover,
.rencently-update .common-item-group>.title:hover{
    background-color: #eaf8ff !important;
}
.partic-item .common-item-group>.title.close,
.rencently-use .common-item-group>.title.close,
.rencently-update .common-item-group>.title.close{
    background-color: #a4d7ff !important;
    border-bottom: 3px solid #a4d7ff !important;
}




/* stage */
.master-banner-wrap{
    display: none !important;
}

.view-project .project-nav{
background: rgba(255,255,255,0.95) !important;
}

.view-project .project-nav .back-button{
position: fixed;
left: 0;
}

.view-project .project-nav .tabs{
position: absolute !important;
margin-left: 90px !important;
}

.view-project .project-nav .project-info-button{
position: static !important;
}
.view-project .project-nav .project-name-box{
width: 480px !important;
width: 55% !important;
margin-left: 200px;
}
.view-project .project-nav .project-name-box .project-menu-wrapper-box{
width: 90% !important;
cursor: default !important;
}
.view-project .project-nav .project-name-box .project-name{
width: unset !important;
max-width: 100% !important;
}
.view-project .project-nav .project-name-box .arrow-drop-down{
cursor: pointer !important;
}


#stage-container .top-nav .mid-but-bar{
right: 250px !important;
left: auto !important;
}

.canvas-area #canvas-wrap,
#detail_container{
-webkit-user-select: none !important;
user-select: none !important;
background: none !important;
background-color: #333333 !important;
background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjMzAzMDMwOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICMyMDIwMjA7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGlkPSJsdCIgY2xhc3M9ImNscy0xIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz4KICA8cmVjdCBpZD0icmIiIGNsYXNzPSJjbHMtMSIgeD0iMzIiIHk9IjMyIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz4KICA8cmVjdCBpZD0ibGIiIGNsYXNzPSJjbHMtMiIgeT0iMzIiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIvPgogIDxyZWN0IGlkPSJydCIgY2xhc3M9ImNscy0yIiB4PSIzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIi8+Cjwvc3ZnPgo=) !important;
background-repeat: repeat;
background-attachment: fixed !important;
background-size: 50px 50px !important;
}


.tree-list-section-wrap{
top: 88px !important;
}

.onboarding{
left: auto !important;
right: 0 !important;
width: 15px !important;
}
.onboaring-link{
height: 49px !important;
}
.onboaring-backgr{
position:fixed;
left: 0;
}


`
    var query = new URLSearchParams(location.hash.split('?').pop());


    var $common_style = document.createElement('style');
    $common_style.innerText = common_cssRules;
    document.head.appendChild($common_style);

    if (location.pathname.startsWith('/web')) {
        var $board_style = document.createElement('style');
        $board_style.innerText = board_cssRules;
        document.head.appendChild($board_style);

        // default device
        var pid = query.get('pid');
        if (pid) {
            var KEY_selectDeviceObj = 'selectDeviceObj_'+ pid;
            if (!localStorage.getItem(KEY_selectDeviceObj)) {
                localStorage.setItem(KEY_selectDeviceObj, '{"index":2,"name":"Web","sub":{"text":"@1x","scale":1,"author":"http://fulicat.com"}}');
            }
        }
    }


    // Your code here...
})();