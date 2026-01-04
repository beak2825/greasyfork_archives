// ==UserScript==
// @name         吾爱破解桌面版优化
// @namespace    http://tampermonkey.net/
// @version     2025.11.22
// @description  为吾爱破解的桌面版网页增加一些便利性功能
// @author       wcx19911123
// @match        https://www.52pojie.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=52pojie.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530066/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E6%A1%8C%E9%9D%A2%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530066/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E6%A1%8C%E9%9D%A2%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 是否开启调试模式的开关
    let debug = false;
    // 调试函数
    let dgb = function(){
        debug && [...arguments].forEach(o => console.log(o));
    };
    // 监听某件事，符合条件就做另一件事的函数
    let doWhenThen = function(when, then, duration){
        let start = new Date().getTime();
        let eventId = setInterval(function(){
            if(duration && new Date().getTime() - start > duration){
                clearInterval(eventId);
                return;
            }
            let exists = typeof when == 'function' ? when() : when;
            if(exists){
                clearInterval(eventId);
            }else{
                return;
            }
            exists = then(exists);
        },100);
    };
    // 页面右上角添加“桌面版优化”按钮
    doWhenThen(() => document.querySelector('#g_upmine'), o => dgb(o) || o.insertAdjacentHTML('afterend', '<span class="pipe">|</span><a href="javascript:void(0)" onclick="wcx19911123_open_menu();">桌面版优化</a>'));
    // 添加全局CSS的函数
    let addGlobalCSS = function(id, css){
        let style = document.querySelector(`#wcx19911123_${id}_CSS`);
        if(!style){
            document.querySelector('head').insertAdjacentHTML('beforeend', `<style id="wcx19911123_${id}_CSS">${css}</style>`);
        }
    };
    // 生成防抖函数的生成函数
    let debounce = (func, time) => {
        let eventId = null;
        return (...args) => {
            window.clearTimeout(eventId);
            eventId = window.setTimeout(() => {
                func(...args);
            }, time);
        };
    };
    // 该脚本的全部功能菜单一览
    let settings = {
        'hideTop2GatesAnd1Tool': '隐藏页面顶部的入门和工具',
        'hideSubPageBannerText': '隐藏分区版头说明内容',
        'hideSubPageTopThreads': '隐藏分区版头所有置顶帖',
        'hideDefaultAvatar': '隐藏详情页的默认头像',
        'hidePersonalSignature': '隐藏详情页的个人签名',
        'hideColorfulLink': '隐藏详情页前几层红蓝绿的链接',
        'autoCheckin': '自动打卡签到',
        'autoFoldFreeRating': '自动收起详情贴内的免费评分',
        'autoNextPage': '自动翻页当滑到页面最底部',
        'autoFillVerificationCode': '自动填写回复的验证回答',
        'autoPreviewWhenHover': '自动预览帖子当在标题悬停时',
        'showThreadByReply': '根据每日回复数逆序排序分区页帖子',
        'showAll2Gray': '整页变灰模拟哀悼日',
    };
    // 读取该脚本的设置的函数
    let readSetting = function(){
        let setting = localStorage.getItem('wcx19911123_setting');
        if(setting){
            setting = JSON.parse(setting);
        }
        return setting || {};
    };
    // 点击“桌面版优化”按钮打开设置菜单的函数
    window.wcx19911123_open_menu = function(obj){
        addGlobalCSS('menuTop', `
#wcx19911123_open_menu_top{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 999;
}
#wcx19911123_open_menu_top.close{
    display: none !important;
}`);
        let menuDiv = document.querySelector('#wcx19911123_open_menu_top');
        if(!menuDiv){
            window.wcx19911123_setting = readSetting();
            document.querySelector('body').insertAdjacentHTML('beforeend', `<div id="wcx19911123_open_menu_top">
        <h1>桌面版优化设置</h1>
        ${[...Object.keys(settings)].map(o=>`<input type="checkbox" ${window.wcx19911123_setting[o]?'checked=checked':''} onclick="javascript:window.wcx19911123_setting['${o}']=this.checked;"/>${settings[o]}<br/>`).join('')}
        <input type="button" value="保存" onclick="wcx19911123_saveSetting();"/>
        <input type="button" value="取消" onclick="javascript:document.querySelector('#wcx19911123_open_menu_top').classList.add('close')"/>
</div>`);
        }
        menuDiv?.classList?.remove('close');
    };
    // 点击保存按钮使设置生效的函数
    window.wcx19911123_saveSetting = function(){
        localStorage.setItem('wcx19911123_setting', JSON.stringify(window.wcx19911123_setting));
        location.reload();
    }
    // 读取设置，然后实现每个功能，后略
    let setting = readSetting();
    if(setting.hideTop2GatesAnd1Tool){
        addGlobalCSS('hideTop2GatesAnd1Tool', `
#toptb{
    display: none !important;
}`);
    }
    if(setting.hideSubPageBannerText){
        addGlobalCSS('hideSubPageBannerText', `
#ct > div > div.bm.bml.pbn > div.bm_c.cl.pbn{
    display: none !important;
}`);
    }
    if(setting.hideSubPageTopThreads){
        addGlobalCSS('hideSubPageTopThreads', `
#threadlisttableid tbody[id^=stickthread_]{
    display: none !important;
}`);
    }
    if(setting.hideDefaultAvatar){
        addGlobalCSS('hideDefaultAvatar', `
#postlist div.avatar:has(img[src*=noavatar]){
    display: none !important;
}`);
    }
    if(setting.hidePersonalSignature){
        addGlobalCSS('hidePersonalSignature', `
td.plc.plm div.sign{
    display: none !important;
}`);
    }
    if(setting.hideColorfulLink){
        addGlobalCSS('hideColorfulLink', `
#postlist div.vw50_kfc_pb, #postlist div.vw50_kfc_pt{
    display: none !important;
}`);
    }
    if(setting.autoCheckin){
        doWhenThen(function(){
            let scoreBtn = document.querySelector('#extcreditmenu');
            if(!scoreBtn){
                return null;
            }
            let checkinBtn = scoreBtn.previousElementSibling.previousElementSibling;
            if(checkinBtn.tagName.toUpperCase() !== 'A' || checkinBtn.firstChild.src.indexOf('static/image/common/qds.png') == -1){
                return null;
            }
            return checkinBtn;
        }, function(btn){
            let today = new Intl.DateTimeFormat().format(new Date());
            let lastDay = localStorage.getItem('wcx19911123_last_checkin_day');
            if(lastDay && today == lastDay){
                return;
            }
            localStorage.setItem('wcx19911123_last_checkin_day', today);
            setTimeout(function(){
                btn.click();
            }, 300);
        }, 1000 * 5);
    }
    if(setting.autoFoldFreeRating){
        window.wcx19911123_already_fold_rate_list = window.wcx19911123_already_fold_rate_list || new Set();
        let id = o => o.getAttribute('onclick').match(/\d+/)?.[0];
        let has = id => window.wcx19911123_already_fold_rate_list.has(id);
        let add = o => window.wcx19911123_already_fold_rate_list.add(id(o));
        doWhenThen(function(){
            let rateList = document.querySelectorAll('table.ratl a.y.xi2.op');
            if(!rateList){
                return null;
            }
            rateList = [...rateList].filter(o => o.innerHTML.indexOf('收起') > -1 && !has(id(o)));
            rateList.forEach(o => add(o));
            return rateList;
        }, function(aList){
            aList.forEach(o => o.click());
        });
    }
    if(setting.autoNextPage){
        let toNextPage = debounce(function(){
            let d = document.documentElement;
            if(d.scrollTop + d.clientHeight + 1 < (d.scrollHeight || d.clientHeight)){
                return;
            }
            let nextBtn = document.querySelector('#autopbn') || document.querySelector('#ct > div.pgbtn > a.bm_h');
            if(setting.showThreadByReply || setting.autoPreviewWhenHover){
                nextBtn = document.querySelector('#fd_page_top div.pg strong')?.nextElementSibling || nextBtn;
            }
            if(nextBtn){
                nextBtn.click();
            }
        }, 300);
        document.addEventListener('scroll', toNextPage);
    }
    if(setting.autoFillVerificationCode){
        doWhenThen(function(){
            let result = [];
            let textarea = document.querySelector('textarea#fastpostmessage');
            if(textarea){
                result.push(textarea);
            }
            let input = document.querySelector('input[name=secanswer]');
            if(input && !input.value){
                result.push(input);
            }
            let answer = document.querySelector('div#seccodeqS0_menu')?.innerHTML?.split('答案：')?.pop();
            if(answer){
                result.push(answer);
            }
            if(result.length >= 3){
                return result;
            }
            return null;
        }, function(objList){
            let fillAnswer = function(){
                objList[1].focus();
                objList[1].value = objList[2];
                objList[1].blur();
                objList[0].removeEventListener('focus', fillAnswer);
                setTimeout(function(){
                    objList[0].focus();
                }, 100);
            };
            objList[0].addEventListener('focus', fillAnswer);
        }, 5000);
    }
    let doAutoPreviewWhenHover = null;
    if(setting.autoPreviewWhenHover){
        let open = function(url, top, left, width, height){
            let iframe = document.querySelector('iframe#wcx19911123_iframe');
            if(!iframe){
                iframe = document.createElement("iframe");
                iframe.id = 'wcx19911123_iframe';
                iframe.style.position = "fixed";
                iframe.style.border = "1px solid #ccc";
                iframe.style.display = 'none';
                iframe.addEventListener('mouseleave', function(){iframe.style.display = 'none';});
                document.body.appendChild(iframe);
            }
            iframe.style.top = top + "px";
            iframe.style.left = left + "px";
            iframe.style.width = width + "px";
            iframe.style.height = height + "px";
            if(iframe.src != url){
                iframe.src = url;
            }
            iframe.style.display = '';
        };
        let preview = function(){
            let _this = this;
            _this.dataset.eventId = setTimeout(function(){
                let rect = _this.getBoundingClientRect();
                let top = 63;
                let left = Math.min(rect.right + 10, 300);
                let width = window.innerWidth - left - 30;
                let height = window.innerHeight - 93;
                open(_this.href, top, left, width, height);
            }, 2000);
        };
        let cancel = function(){
            clearTimeout(this.dataset.eventId);
        };
        doAutoPreviewWhenHover = () => doWhenThen(function(){
            let list = [...document.querySelectorAll('#threadlisttableid tbody[id^=normalthread]')];
            if(list && list.length > 0){
                return list;
            }
            return null;
        }, function(list){
            dgb('autoPreviewWhenHover');
            list.forEach(o => {
                let a = o.querySelector('th.common>a[href^=thread]');
                a?.removeEventListener('mouseenter', preview);
                a?.addEventListener('mouseenter', preview);
                a?.removeEventListener('mouseleave', cancel);
                a?.addEventListener('mouseleave', cancel);
            });
        }, 5000);
        if(!setting.showThreadByReply){
            doAutoPreviewWhenHover();
        }
    }
    if(setting.showThreadByReply){
        doWhenThen(function(){
            let list = [...document.querySelectorAll('#threadlisttableid tbody[id^=normalthread]')];
            if(list && list.length > 0){
                return list;
            }
            return null;
        }, function(list){
            let first = list[0].previousElementSibling;
            list = [...list].sort((a,b) => {
                let aNum = a.querySelector('td.num a').innerHTML;
                let aTime = new Date(a.querySelector('td.by em>span').innerHTML);
                let bNum = b.querySelector('td.num a').innerHTML;
                let bTime = new Date(b.querySelector('td.by em>span').innerHTML);
                let now = new Date();
                return (+bNum / (+now - +bTime)) - (+aNum / (+now - +aTime));
            });
            list.forEach(o => o.remove());
            first.after(...list);
            if(setting.autoPreviewWhenHover){
                doAutoPreviewWhenHover();
            }
        }, 5000);
    }
    if(setting.showAll2Gray){
        addGlobalCSS('showAll2Gray', `
html{
    filter: grayscale(100%)!important;
}`);
    }
})();