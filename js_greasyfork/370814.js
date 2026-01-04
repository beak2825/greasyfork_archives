// ==UserScript==
// @name         CSDNBBSCleaner
// @version      0.2
// @description  csdn论坛一些影响阅读的多余元素清理
// @author       anonymous
// @match        https://bbs.csdn.net/forums/*
// @match        https://bbs.csdn.net/topics/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-body
// @namespace https://greasyfork.org/users/200191
// @downloadURL https://update.greasyfork.org/scripts/370814/CSDNBBSCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/370814/CSDNBBSCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var KEY_BLACK_LIST ="CSDNBBSCleaner_Config_BlackList";
    var KEY_NOT_MODERATOR ="CSDNBBSCleaner_Config_isNotModerator";

    //读取配置
    //读取黑名单
    // GM_deleteValue(KEY_BLACK_LIST);
    let blackList = GM_getValue(KEY_BLACK_LIST, null);
    if(blackList == null){
        blackList = new Array("CSDN推荐","csdngkk","CSDNedu");
        GM_setValue(KEY_BLACK_LIST, blackList);
    }
    //读取是否版主
    let isNotModerator = GM_getValue(KEY_NOT_MODERATOR, false);

    GM_registerMenuCommand("设置", function(){
        //添加菜单设置项
        GM_addStyle(`#CSDNBBSCleaner_configDialog{position:absolute;left:0px;top:0px;right:0px;bottom:0px}#CSDNBBSCleaner_config_content{position:absolute;top:0px;right:0px;bottom:0px;left:0px;margin:auto;background:#fff;border:1px solid #ced1d9;border-radius:4px;box-shadow:0 0 3px #ced1d9;color:black;word-break:break-all;display:block;width:500px;height:255px;padding:10px 20px;z-index:9999}#CSDNBBSCleaner_config_content h3{border-bottom:1px solid #ced1d9;font-size:1.5em;font-weight:bold}#CSDNBBSCleaner_config_content h4{border-bottom:1px solid #ced1d9;font-size:1.0em;font-weight:bold;margin:10px 0px}#CSDNBBSCleaner_config_moderator{text-align:center;margin:10px 0px 0px 0px;padding:0}#CSDNBBSCleaner_config_content .very-very-important{font-size:20px;font-weight:bold}.CSDNBBSCleaner_button{margin:0px 20px}`);
        let div = document.createElement('div');
        div.id="CSDNBBSCleaner_configDialog";
        div.innerHTML = `<div id="CSDNBBSCleaner_config_content"><h3>CSDNBBSCleaner配置</h3><input id="CSDNBBSCleaner_config_moderator"type="checkbox">我不是CSDN论坛版主</input><h4>黑名单设置</h4><p style="font-size: 12px">不显示黑名单用户的帖子;黑名单之间以“,”分隔</p><textarea id="CSDNBBSCleaner_blackList">${blackList}</textarea><hr><a id="CSDNBBSCleaner_close"class="close CSDNBBSCleaner_button">关闭</a><a id="CSDNBBSCleaner_save"class="close CSDNBBSCleaner_button">保存</a></div>`;
        document.body.appendChild(div);
        document.getElementById("CSDNBBSCleaner_config_moderator").checked = isNotModerator;

        //监听关闭按钮
        document.getElementById("CSDNBBSCleaner_close").addEventListener('click', function(){
            document.getElementById("CSDNBBSCleaner_configDialog").remove();
        })

        //监听保存按钮
        document.getElementById("CSDNBBSCleaner_save").addEventListener('click', function(){
            //保存修改后的配置
            let newBlackList = document.getElementById("CSDNBBSCleaner_blackList").value.split(',');
            while(blackList.length>0){blackList.shift();}
            newBlackList.forEach(function(newVal, newIndex) {
                if(newVal.length>0){
                    let isContains = false;
                    blackList.forEach(function(val, index) {
                        if (val.indexOf(newVal) >= 0) {
                            isContains = true;
                        }
                    });
                    if(!isContains)
                    {
                        blackList.push(newVal);
                    }
                }
            });

            GM_setValue(KEY_BLACK_LIST, blackList);
            isNotModerator= document.getElementById("CSDNBBSCleaner_config_moderator").checked;
            GM_setValue(KEY_NOT_MODERATOR, isNotModerator);

            document.getElementById("CSDNBBSCleaner_configDialog").remove();
        })
    }, null);

    let url = location.href;
    if (url.indexOf('https://bbs.csdn.net/forums/') >= 0) //列表
    {
        if(isNotModerator){ //移除管理相关的元素
            $(".forums_manage > a").remove();
            $(".forums_tab_list > li:nth-last-of-type(1)").remove();
        }

        var authorNodes = $(".forums_author");
        for (let index = 0; index < authorNodes.length; index++) {
            let authorNode = authorNodes[index];
            let author = authorNode.getElementsByTagName('a')[0].innerText;
            blackList.forEach(function(val, index) {
                if (author.indexOf(val) >= 0) {
                    authorNode.parentNode.remove();
                }
            });
        }
    }
    else //帖子
    {
        $(".post_feed_box").remove();

        if(isNotModerator){ //移除管理相关的元素
            $(".manage_toggle").remove();
            $(".drop_menu_wrap").remove();
        }

        var topicNodes = $(".mod_topic_wrap");
        for (let index = 0; index < topicNodes.length - 1; index++) {
            let topicNode = topicNodes[index];
            let authorNodes = topicNode.getElementsByClassName('nick_name');
            if (authorNodes != null && authorNodes.length > 0) {
                let author = authorNodes[0].innerText;
                blackList.forEach(function(val, index) {
                    if (author.indexOf(val) >= 0) {
                        topicNode.remove();
                    }
                });
            }
        }
    }
})();