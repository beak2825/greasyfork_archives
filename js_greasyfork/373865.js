// ==UserScript==
// @name         OneDrive批量下载
// @namespace    http://www.ilt.me/
// @version      0.1
// @description  实现oneDrive多选下载,暂不支持文件夹下载
// @author       Zing
// @match        https://vipmail-my.sharepoint.cn/personal/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/373865/OneDrive%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/373865/OneDrive%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var listDiv = null;
    var itemDivs = null;

    var style = '.root-ms-Button:hover {background-color: #d0d0d0;}.root-ms-Button{position:relative;font-family:"Segoe UI","Segoe UI Web (West European)","Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;font-weight:400;box-sizing:border-box;display:inline-block;text-align:center;cursor:pointer;vertical-align:top;padding-top:0;padding-right:4px;padding-bottom:0;padding-left:4px;min-width:40px;background-color:#f4f4f4;color:#333;height:100%;user-select:none;outline:transparent;border-width:1px;border-style:solid;border-color:transparent;border-image:initial;text-decoration:none;border-radius:0} .flexContainer-button{display:flex;height:100%;flex-wrap:nowrap;justify-content:center;align-items:center} .icon-button{display:inline-block;-webkit-font-smoothing:antialiased;font-style:normal;font-weight:normal;speak:none;font-family:FabricMDL2Icons;font-size:16px;margin-top:0;margin-right:4px;margin-bottom:0;margin-left:4px;height:16px;line-height:16px;text-align:center;vertical-align:middle;flex-shrink:0;color:#106ebe} .label-button{margin-top:0;margin-right:4px;margin-bottom:0;margin-left:4px;line-height:100%;font-weight:normal;white-space:nowrap}'
    $('head').append('<style>'+style+'</style>')

    function downClick(){
        // 获取当前地址
        var currUrl = window.location.href;
        currUrl = currUrl.substr(0,currUrl.indexOf('Documents')) + 'Documents';

        // 获取层级
        $('.BreadcrumbBar-list li a,.BreadcrumbBar-list li span').each(function(i,item){
            currUrl += '/'+$(item).attr('title');
        })

        $.each(itemDivs,function(i,item){
            window.open(currUrl + '/' + $('.ms-Link',item).attr('title'));
        })
    }


    setInterval(function(){
        listDiv = $('.ms-List-surface');
        itemDivs = $('.ms-FocusZone[aria-selected="true"]',listDiv);

        if(itemDivs.length > 0){
            if($('.root-ms-Button').length == 0){
                $('.ms-OverflowSet:first').append('<button class="root-ms-Button" type="button"><div class="flexContainer-button"><i data-icon-name="Download" class="ms-Button-icon icon-button"></i><div><div class="ms-Button-label label-button">批量下载</div></div></div></button>')
                // 重新绑定事件，office禁止行内事件
                $('.root-ms-Button').click(function(){
                    downClick();
                })
            }
        }else{
            $('.root-ms-Button').remove();
        }
    },250);


})();