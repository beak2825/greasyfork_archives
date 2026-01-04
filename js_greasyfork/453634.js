// ==UserScript==
// @license MIT
// @name         cmf redlist
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  cmf论坛红名单或黑名单设置
// @author       You
// @match        *://*.cmfish.com/bbs/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue

// @downloadURL https://update.greasyfork.org/scripts/453634/cmf%20redlist.user.js
// @updateURL https://update.greasyfork.org/scripts/453634/cmf%20redlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SHADIAO_BG_CSS = "background-image:url('data:image/png;base64,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');";
    const RED_CSS="    background-color: #ffebe5;background-size:contain;"
    const BLACK_CSS="    background-color: #e6e6e6;background-size:contain;"
    const GREEN_CSS="    background-color: #e5ffee;background-size:contain;"
    const BLUE_CSS="    background-color: #e5f7ff;background-size:contain;"
    const PURPLE_CSS="    background-color: #ffe5ff;background-size:contain;"

    let url = document.URL;
    let username_in_infopage;

    let redListName = 'red-list';
    let redlist = GM_getValue(redListName, "").split(';');
    let redButtonName = 'redbutton';

    let blackListName = 'black-list';
    let blacklist = GM_getValue(blackListName, "").split(';');
    let blackButtonName = 'blackbutton';

    let greenListName = 'green-list';
    let greenlist = GM_getValue(greenListName, "").split(';');
    let greenButtonName = 'greenbutton';

    let blueListName = 'blue-list';
    let bluelist = GM_getValue(blueListName, "").split(';');
    let blueButtonName = 'bluebutton';

    let purpleListName = 'purple-list';
    let purplelist = GM_getValue(purpleListName, "").split(';');
    let purpleButtonName = 'purplebutton';

    let hideListName = 'hide-list';
    let hidelist = GM_getValue(hideListName, "").split(';');
    let hideButtonName = 'hidebutton';

    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    //清空红黑榜，慎重
    //GM_deleteValue(redListName);
    //GM_deleteValue(blackListName);
    //return;


    if (url.indexOf('forum.php?mod=forumdisplay')>0)
    {
        //debugger;
        // 首页及类首页
        let home_list = document.getElementById('threadlisttableid').children;
        let len = home_list.length;
        for(let i=1; i<len; i++) {
            if(home_list[i]
               &&home_list[i].children[0]
               &&home_list[i].children[0].children[2]
               &&home_list[i].children[0].children[2].children[0]
               &&home_list[i].children[0].children[2].children[0].children[0]){
                let href=home_list[i].children[0].children[2].children[0].children[0].href
                let username=href.substring(href.lastIndexOf('uid=')+4)
                if (redlist.indexOf(username) >= 0) {
                    home_list[i].style = RED_CSS;
                }
                if (blacklist.indexOf(username) >= 0) {
                    home_list[i].style = BLACK_CSS;
                }
                if (greenlist.indexOf(username) >= 0) {
                    home_list[i].style = GREEN_CSS;
                }
                if (bluelist.indexOf(username) >= 0) {
                    home_list[i].style = BLUE_CSS;
                }
                if (purplelist.indexOf(username) >= 0) {
                    home_list[i].style = PURPLE_CSS;
                }
                if (hidelist.indexOf(username) >= 0) {
                    home_list[i].hidden=true;
                }
                let remark=GM_getValue('r-'+username, "")
                if(remark){
                    let title=home_list[i].children[0].children[1].children[2]
                    title.innerHTML=title.innerHTML+'<div style="color: #CC0000;float:right">'+remark+"</div>"
                }
                let position=GM_getValue('p-'+username, "")
                if(position){
                    let title=home_list[i].children[0].children[1].children[2]
                    title.innerHTML=title.innerHTML+'<div style="color: #CC0000;float:left">'+position+"</div>"
                }
            }
        }
    }else if (url.indexOf('forum.php?mod=guide')>0){
        //debugger;
        // 首页及类首页
        let home_list =  document.getElementById('threadlist').children[1].children[1].children;
        let len = home_list.length;
        for(let i=0; i<len; i++) {
            //debugger;
            if(home_list[i]
               &&home_list[i].children[0]
               &&home_list[i].children[0].children[3]
               &&home_list[i].children[0].children[3].children[0]
               &&home_list[i].children[0].children[3].children[0].children[0].href){
                let href=home_list[i].children[0].children[3].children[0].children[0].href
                let username=href.substring(href.lastIndexOf('uid=')+4)
                if (redlist.indexOf(username) >= 0) {
                    home_list[i].style = RED_CSS;
                }
                if (blacklist.indexOf(username) >= 0) {
                    home_list[i].style = BLACK_CSS;
                }
                if (greenlist.indexOf(username) >= 0) {
                    home_list[i].style = GREEN_CSS;
                }
                if (bluelist.indexOf(username) >= 0) {
                    home_list[i].style = BLUE_CSS;
                }
                if (purplelist.indexOf(username) >= 0) {
                    home_list[i].style = PURPLE_CSS;
                }
                if (hidelist.indexOf(username) >= 0) {
                    home_list[i].hidden=true;
                }
                let remark=GM_getValue('r-'+username, "")
                if(remark){
                    //debugger
                    let title=home_list[i].children[0].children[1]
                    title.innerHTML=title.innerHTML+'<div style="color: #CC0000;float:right">'+remark+"</div>"
                }
                let position=GM_getValue('p-'+username, "")
                if(position){
                    let title=home_list[i].children[0].children[1]
                    title.innerHTML=title.innerHTML+'<div style="color: #CC0000;float:left">'+position+"</div>"
                }
            }
        }
    } else if (url.indexOf('forum.php?mod=viewthread')>0) {
        // 帖子详情页
        let comments = document.getElementsByClassName('pls cl favatar');
        let len = comments.length;
        for(let i=0; i<len; i++) {
            let cell = comments[i];
            let href=comments[i].children[0].children[0].children[0].href
            let username=href.substring(href.lastIndexOf('uid=')+4)
            if (redlist.indexOf(username) >= 0) {
                cell.parentElement.parentElement.parentElement.style = RED_CSS;
            }
            if (blacklist.indexOf(username) >= 0) {
                cell.parentElement.parentElement.parentElement.style = BLACK_CSS;
            }
            if (greenlist.indexOf(username) >= 0) {
                cell.parentElement.parentElement.parentElement.style = GREEN_CSS;
            }
            if (bluelist.indexOf(username) >= 0) {
                cell.parentElement.parentElement.parentElement.style = BLUE_CSS;
            }
            if (purplelist.indexOf(username) >= 0) {
                cell.parentElement.parentElement.parentElement.style = PURPLE_CSS;
            }
            if (hidelist.indexOf(username) >= 0) {
                cell.parentElement.parentElement.parentElement.hidden=true;
            }
            let remark=GM_getValue('r-'+username, "")
                if(remark){
                    //debugger
                    cell.innerHTML=cell.innerHTML+'<div style="color: #CC0000;float:left">备注:'+remark+"</div>"
                }
            let position=GM_getValue('p-'+username, "")
                if(position){
                    cell.innerHTML=cell.innerHTML+'<br><div style="color: #CC0000;float:left">位置:'+position+"</div>"
                }
        }
    } else if (url.indexOf('home.php?mod=space')>0) {
        // 个人主页
        username_in_infopage = GetQueryString('uid');
        // let button = document.getElementsByClassName('fr')[0];
        let button_container = document.getElementsByClassName('mt')[0];

        let red = document.createElement('input');
        red.setAttribute('type', 'button');
        red.setAttribute('id', redButtonName);
        red.setAttribute('value', redlist.indexOf(username_in_infopage)>=0 ? 'Unred' : 'Red');
        red.setAttribute('class', 'super normal button');
        button_container.appendChild(red);
        document.getElementById(redButtonName).onclick = function() {
            let redlist = GM_getValue(redListName, "").split(';');
            if (redlist.indexOf(username_in_infopage) >= 0) {
                GM_setValue(redListName, GM_getValue(redListName, "").replace(';' + username_in_infopage, ''));
            } else {
                GM_setValue(redListName, GM_getValue(redListName, "") + ';' + username_in_infopage);
            }
            document.getElementById(redButtonName).value = GM_getValue(redListName, '').split(';').indexOf(username_in_infopage)>=0 ? 'Unred' : 'Red';
        };

        let black = document.createElement('input');
        black.setAttribute('type', 'button');
        black.setAttribute('id', blackButtonName);
        black.setAttribute('value', blacklist.indexOf(username_in_infopage)>=0 ? 'Unblack' : 'Black');
        black.setAttribute('class', 'super normal button');
        button_container.appendChild(black);
        document.getElementById(blackButtonName).onclick = function() {
            let blacklist = GM_getValue(blackListName, "").split(';');
            if (blacklist.indexOf(username_in_infopage) >= 0) {
                GM_setValue(blackListName, GM_getValue(blackListName, "").replace(';' + username_in_infopage, ''));
            } else {
                GM_setValue(blackListName, GM_getValue(blackListName, "") + ';' + username_in_infopage);
            }
            document.getElementById(blackButtonName).value = GM_getValue(blackListName, '').split(';').indexOf(username_in_infopage)>=0 ? 'Unblack' : 'Black';
        };

        let green = document.createElement('input');
        green.setAttribute('type', 'button');
        green.setAttribute('id', greenButtonName);
        green.setAttribute('value', greenlist.indexOf(username_in_infopage)>=0 ? 'Ungreen' : 'Green');
        green.setAttribute('class', 'super normal button');
        button_container.appendChild(green);
        document.getElementById(greenButtonName).onclick = function() {
            let greenlist = GM_getValue(greenListName, "").split(';');
            if (greenlist.indexOf(username_in_infopage) >= 0) {
                GM_setValue(greenListName, GM_getValue(greenListName, "").replace(';' + username_in_infopage, ''));
            } else {
                GM_setValue(greenListName, GM_getValue(greenListName, "") + ';' + username_in_infopage);
            }
            document.getElementById(greenButtonName).value = GM_getValue(greenListName, '').split(';').indexOf(username_in_infopage)>=0 ? 'Ungreen' : 'Green';
        };

        let blue = document.createElement('input');
        blue.setAttribute('type', 'button');
        blue.setAttribute('id', blueButtonName);
        blue.setAttribute('value', bluelist.indexOf(username_in_infopage)>=0 ? 'Unblue' : 'Blue');
        blue.setAttribute('class', 'super normal button');
        button_container.appendChild(blue);
        document.getElementById(blueButtonName).onclick = function() {
            let bluelist = GM_getValue(blueListName, "").split(';');
            if (bluelist.indexOf(username_in_infopage) >= 0) {
                GM_setValue(blueListName, GM_getValue(blueListName, "").replace(';' + username_in_infopage, ''));
            } else {
                GM_setValue(blueListName, GM_getValue(blueListName, "") + ';' + username_in_infopage);
            }
            document.getElementById(blueButtonName).value = GM_getValue(blueListName, '').split(';').indexOf(username_in_infopage)>=0 ? 'Unblue' : 'Blue';
        };

        let purple = document.createElement('input');
        purple.setAttribute('type', 'button');
        purple.setAttribute('id', purpleButtonName);
        purple.setAttribute('value', purplelist.indexOf(username_in_infopage)>=0 ? 'Unpurple' : 'Purple');
        purple.setAttribute('class', 'super normal button');
        button_container.appendChild(purple);
        document.getElementById(purpleButtonName).onclick = function() {
            let purplelist = GM_getValue(purpleListName, "").split(';');
            if (purplelist.indexOf(username_in_infopage) >= 0) {
                GM_setValue(purpleListName, GM_getValue(purpleListName, "").replace(';' + username_in_infopage, ''));
            } else {
                GM_setValue(purpleListName, GM_getValue(purpleListName, "") + ';' + username_in_infopage);
            }
            document.getElementById(purpleButtonName).value = GM_getValue(purpleListName, '').split(';').indexOf(username_in_infopage)>=0 ? 'Unpurple' : 'Purple';
        };

        let hide = document.createElement('input');
        hide.setAttribute('type', 'button');
        hide.setAttribute('id', hideButtonName);
        hide.setAttribute('value', hidelist.indexOf(username_in_infopage)>=0 ? '显示' : '隐藏');
        hide.setAttribute('class', 'super normal button');
        button_container.appendChild(hide);
        document.getElementById(hideButtonName).onclick = function() {
            let hidelist = GM_getValue(hideListName, "").split(';');
            if (hidelist.indexOf(username_in_infopage) >= 0) {
                GM_setValue(hideListName, GM_getValue(hideListName, "").replace(';' + username_in_infopage, ''));
            } else {
                GM_setValue(hideListName, GM_getValue(hideListName, "") + ';' + username_in_infopage);
            }
            document.getElementById(hideButtonName).value = GM_getValue(hideListName, '').split(';').indexOf(username_in_infopage)>=0 ? '显示' : '隐藏';
        };

        let remark = document.createElement('input');
        remark.setAttribute('type', 'input');
        remark.setAttribute('id', 't-remark');
        remark.setAttribute('placeholder', '请输入备注');
        remark.setAttribute('value', GM_getValue('r-'+username_in_infopage, ""));
        button_container.appendChild(remark);

        let saveRemark = document.createElement('input');
        saveRemark.setAttribute('type', 'button');
        saveRemark.setAttribute('id', 'saveRemark');
        saveRemark.setAttribute('value', '保存备注');
        saveRemark.setAttribute('class', 'super normal button');
        button_container.appendChild(saveRemark);
        document.getElementById('saveRemark').onclick = function() {
            GM_setValue('r-'+username_in_infopage, document.getElementById('t-remark').value)
        };

        let position = document.createElement('input');
        position.setAttribute('type', 'input');
        position.setAttribute('id', 't-position');
        position.setAttribute('placeholder', '请输入位置');
        position.setAttribute('value', GM_getValue('p-'+username_in_infopage, ""));
        button_container.appendChild(position);

        let savePosition = document.createElement('input');
        savePosition.setAttribute('type', 'button');
        savePosition.setAttribute('id', 'savePosition');
        savePosition.setAttribute('value', '保存位置');
        savePosition.setAttribute('class', 'super normal button');
        button_container.appendChild(savePosition);
        document.getElementById('savePosition').onclick = function() {
            GM_setValue('p-'+username_in_infopage, document.getElementById('t-position').value)
        };
    }
})();