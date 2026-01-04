// ==UserScript==
// @name                杀佛观音·腾讯视频频道页面剧集记录匹配
// @name:zh             杀佛观音·腾讯视频频道页面剧集记录匹配
// @name:zh-CN          杀佛观音·腾讯视频频道页面剧集记录匹配
// @name:zh-TW          殺佛觀音·騰訊視頻頻道頁面劇集記錄匹配
// @namespace           杀佛观音
// @version             0.3.1
// @description         兼容电脑、手机、平板；兼容iOS快捷指令；兼容任意支持脚本扩展的浏览器；兼容TM篡改猴、VM暴力猴、GM油猴插件。通过频道页面快速判断剧集是否为新剧、更新或完结，可快速观看，省去通过书签或眼力寻找，节省时间，效率至上。搭配“杀佛观音·全网VIP视频破解免费看·全网最全非VIP视频去广告·极简版”使用体验更佳。
// @description:zh      兼容电脑、手机、平板；兼容iOS快捷指令；兼容任意支持脚本扩展的浏览器；兼容TM篡改猴、VM暴力猴、GM油猴插件。通过频道页面快速判断剧集是否为新剧、更新或完结，可快速观看，省去通过书签或眼力寻找，节省时间，效率至上。搭配“杀佛观音·全网VIP视频破解免费看·全网最全非VIP视频去广告·极简版”使用体验更佳。
// @description:zh-CN   兼容电脑、手机、平板；兼容iOS快捷指令；兼容任意支持脚本扩展的浏览器；兼容TM篡改猴、VM暴力猴、GM油猴插件。通过频道页面快速判断剧集是否为新剧、更新或完结，可快速观看，省去通过书签或眼力寻找，节省时间，效率至上。搭配“杀佛观音·全网VIP视频破解免费看·全网最全非VIP视频去广告·极简版”使用体验更佳。
// @description:zh-TW   兼容電腦、手機、平板；兼容iOS快捷指令；兼容任意支持腳本擴展的瀏覽器；兼容TM篡改猴、VM暴力猴、GM油猴插件。通過頻道頁面快速判斷劇集是否為新劇、更新或完結，可快速觀看，省去通過書簽或眼力尋找，節省時間，效率至上。搭配“殺佛觀音·全網VIP視訊破解免費看·全網最全非VIP視訊去廣告·極簡版”使用體驗更佳。
// @author              杀佛观音
// @copyright           2021 杀佛观音
// @license             End-User License Agreement
// @contributionURL     bitcoin:1H3DMkWAdJMUpkstdYZmHpiV7RAFjjC4WH
// @contributionAmount  0.0000066 BTC
// @match               *://v.qq.com/channel/*?listpage*
// @downloadURL https://update.greasyfork.org/scripts/429154/%E6%9D%80%E4%BD%9B%E8%A7%82%E9%9F%B3%C2%B7%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E9%A2%91%E9%81%93%E9%A1%B5%E9%9D%A2%E5%89%A7%E9%9B%86%E8%AE%B0%E5%BD%95%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/429154/%E6%9D%80%E4%BD%9B%E8%A7%82%E9%9F%B3%C2%B7%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E9%A2%91%E9%81%93%E9%A1%B5%E9%9D%A2%E5%89%A7%E9%9B%86%E8%AE%B0%E5%BD%95%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(() => {
    'use strict';

    //最终用户许可协议 End-User License Agreement
    // * Copyright (c) 2021 杀佛观音. All Rights Reserved.
    // * Proprietary and Confidential.
    // * Written by 杀佛观音 [SWFtSmVob3ZhaDxhdD50dXRhbm90YS5jb20=(base64)], July 2021.
    // * It is never ok to copy and paste code from an open
    //   source project directly into your proprietary code.
    //   Don't do it.
    // * Re-distribution or adaptation in whole or in part of
    //   this script code by any means or in whatever form is
    //   strictly prohibited.
    // * 该项目介绍、说明书、脚本代码、思路及其他相关
    //   内容版权归作者所有，未经作者本人书面授权，禁
    //   止任何单位或个人以任何形式、任何手段或通过任
    //   何方式（净室工程、手工、图片、电子、机械、磁
    //   性、化学、光学、声学或其它方式）抄袭、摘编、
    //   编辑、修改、结集、出版、再版、转录、转载、爬
    //   虫爬取、重制、仿制、复制、复写、复印、影印、
    //   拷贝、刻录、建立镜像、粘贴、张贴、派发、录音、
    //   用来创建派生作品、与其它任何资料进行合并、翻
    //   译成任何电脑语言或以其他任何方式用于商业或公
    //   共目的。
    // * 该项目仅仅准许您善意的使用，其他任何行为都是
    //   禁止的。

    //搭配“杀佛观音·全网VIP视频破解免费看·全网最全非VIP视频去广告·极简版”使用体验更佳。
    //https://greasyfork.org/zh-CN/users/792030

    //使用前或更新后进入下方脚本下载地址熟读信息，捐赠后视为正版，未捐赠视为盗版，好评后视为正版^_^
    //https://greasyfork.org/zh-CN/scripts/429154

    //一旦修改源码，插件脚本检查更新可能会被取消，请手动进入上方脚本下载地址更新脚本
    //加载剧集页数，每页30个
    let KillBuddha_page = 20;
    //每次看完剧集都需要手动更新此列表，格式为“剧集名|集数|备注”，剧集名需与页面完全相同（包括剧集名中间可能存在的空格），且剧集名前后不带空格。
    //及时备份此列表至记事本，脚本更新后列表会丢失。
    //您可在设置内关闭脚本检查更新，以防止列表被移除，请手动更新脚本。
    let KillBuddha_record =
`
斗罗大陆|166|
西行纪|50|
入间同学入魔了|34|第二季
斗破苍穹 第4季|19|
完美世界|16|
月光下的异世界之旅|03|
`;

    if(!window.location.href.match(/^https?:\/\/v.qq.com\/channel\/.+?listpage.+/i)){
        return;
    }
    (() => {
        return new Promise(resolve => {
            let intervalID = setInterval(() => {
                if((document.head || document.documentElement) && document.getElementsByTagName('img').length >= 30){
                    clearInterval(intervalID);
                    resolve();
                }
            }, 500);
        });
    })().then(() => {
        return new Promise(resolve => {
            let intervalID = setInterval(() => {
                window.scrollTo(0,Math.max(document.documentElement.scrollHeight,document.body.scrollHeight));
                if(document.getElementsByTagName('img').length >= 30*KillBuddha_page+100){
                    clearInterval(intervalID);
                    window.scrollTo(0,0);
                    resolve();
                }
            }, 50);
        });
    }).then(() => {
        return new Promise(resolve => {
            let KillBuddha_record_arr = KillBuddha_record.split(/[(\r\n)\r\n]+/);
            let KillBuddha_episode_list = [];
            KillBuddha_record_arr.forEach(i => {
                if(i.split('|').length === 3){
                    let str = i.split('|')[0];
                    let num = i.split('|')[1];
                    Array.from(document.getElementsByTagName('img')).forEach(img => {
                        if(img.alt && img.alt === str){
                            if(img.nextElementSibling && img.nextElementSibling.innerHTML && img.nextElementSibling.innerHTML.match(/\d{1,}/)[0] !== void 0){
                                let over = 0;
                                if(img.nextElementSibling.innerHTML.slice(0,1) === '全'){
                                    over = 1;
                                }
                                if(img.nextElementSibling.innerHTML.match(/\d{1,}/)[0] !== num){
                                    KillBuddha_episode_list.push({name:str,old_num:num,new_num:img.nextElementSibling.innerHTML.match(/\d{1,}/)[0],object:img.parentElement,over:over});
                                }else if(img.nextElementSibling.innerHTML.match(/\d{1,}/)[0] === num && over){
                                    KillBuddha_episode_list.push({name:str,old_num:num,new_num:img.nextElementSibling.innerHTML.match(/\d{1,}/)[0],object:img.parentElement,over:over});
                                }
                            }
                        }
                    });
                }
            });
            Array.from(document.getElementsByTagName('img')).forEach(img => {
                if(img.nextElementSibling && img.nextElementSibling.innerHTML && img.nextElementSibling.innerHTML === '更新至01集'){
                    KillBuddha_episode_list.push({name:img.alt,old_num:'',new_num:'1',object:img.parentElement,over:-1});
                }
            });
            if(KillBuddha_episode_list.length !== 0){
                resolve(KillBuddha_episode_list);
            }
        });
    }).then(KillBuddha_episode_list => {
        (css => {
            let style = document.createElement('style');
            style.textContent = css;
            let dom = document.head || document.documentElement;
            dom.appendChild(style);
        })(`.KillBuddha_div{z-index:99999999999999;position:fixed;width:30%;height:40%;left:35%;top:30%;;background-color:#FFFFFF;box-shadow:rgba(15, 66, 76, 0.25) 0px 0px 8px 3px;border-radius:15px;overflow:hidden;background-size:100% 100%;}
            .KillBuddha_div_son{height:100%;overflow:auto;scrollbar-width:thin;}
            .KillBuddha_div_son::-webkit-scrollbar{width:7px;height:7px;}
            .KillBuddha_div_son::-webkit-scrollbar-thumb{background-color:rgba(255,255,255,.6);-webkit-box-shadow:none;}
            .KillBuddha_div_son::-webkit-scrollbar-track{background-color:rgba(0,0,0,.2);-webkit-box-shadow:none;}
            .KillBuddha_div_son::-o-scrollbar{width:7px;height:7px;}
            .KillBuddha_div_son::-o-scrollbar-thumb{background-color:rgba(255,255,255,.6);-webkit-box-shadow:none;}
            .KillBuddha_div_son::-o-scrollbar-track{background-color:rgba(0,0,0,.2);-webkit-box-shadow:none;}
            .KillBuddha_button{position:fixed;color:#000000;border:none;font-size:15px;}
            .KillBuddha_button_close{background-color:#FFFFFF;border-top-left-radius:15px;border-bottom-left-radius:8px;border-bottom-right-radius:15px;border-top-right-radius:8px;float:left;box-shadow:0px 0px 8px 3px;}
            .KillBuddha_div_title{color:#000000;font-size:22px;text-align:center;}
            a:hover {color:#2828FF}
            .KillBuddha_div_elem{color:#000000;font-size:22px;text-align:center;cursor:pointer;}
        `);
        let KillBuddha_div = document.createElement('div');
        KillBuddha_div.className = 'KillBuddha_div';
        KillBuddha_div.onmouseover = KillBuddha_div.onfocus = () => {
            KillBuddha_div.style['box-shadow'] = '0px 0px 8px 3px';
        };
        KillBuddha_div.onmouseleave = KillBuddha_div.onblur = () => {
            KillBuddha_div.style['box-shadow'] = 'rgba(15, 66, 76, 0.25) 0px 0px 8px 3px';
        };
        let KillBuddha_div_son = document.createElement('div');
        KillBuddha_div_son.className = 'KillBuddha_div_son';
        KillBuddha_div.appendChild(KillBuddha_div_son);
        (document.querySelector('body')?document.body:document.documentElement).appendChild(KillBuddha_div);
        let div_ = document.createElement('div');
        div_.className = 'KillBuddha_button';
        let KillBuddha_button_close = document.createElement('button');
        KillBuddha_button_close.className = 'KillBuddha_button_close';
        KillBuddha_button_close.innerHTML = '&nbsp;&nbsp;X&nbsp;&nbsp;';
        KillBuddha_button_close.onclick = () => {
            document.getElementsByClassName('KillBuddha_div')[0].style.display='none';
        };
        KillBuddha_button_close.onmouseover = KillBuddha_button_close.onfocus = () => {
            KillBuddha_button_close.style['box-shadow'] = 'rgba(15, 66, 76, 0.25) 0px 0px 8px 3px';
        };
        KillBuddha_button_close.onmouseleave = KillBuddha_button_close.onblur = () => {
            KillBuddha_button_close.style['box-shadow'] = '0px 0px 8px 3px';
        };
        div_.appendChild(KillBuddha_button_close);
        KillBuddha_div_son.appendChild(div_);
        let KillBuddha_appendChild = (div,tag,className,innerHTML,isTitle,episodeElem) =>{
            let elem = document.createElement(tag);
            if(className){elem.className = className;}
            if(innerHTML){elem.innerHTML = innerHTML;}
            if(!isTitle){
                elem.onmouseover = elem.onfocus = () => {
                    elem.style['background-color'] = '#DCDCDC';
                };
                elem.onmouseleave = elem.onblur = () => {
                    elem.style['background-color'] = '#FFFFFF';
                };
                elem.onclick = () => {
                    episodeElem.click();
                };
            }
            div.appendChild(elem);
        }
        KillBuddha_appendChild(KillBuddha_div_son,'br');
        KillBuddha_appendChild(KillBuddha_div_son,'div','KillBuddha_div_title','<a href=\'https://greasyfork.org/zh-CN/users/792030\'>杀佛观音</a>·<a href=\'https://greasyfork.org/zh-CN/scripts/429154\'>腾讯视频频道页面剧集记录匹配</a>·更新列表',!0);
        KillBuddha_appendChild(KillBuddha_div_son,'br');
        KillBuddha_appendChild(KillBuddha_div_son,'hr');
        KillBuddha_episode_list.forEach(episode => {
            let innerHTML = episode.name+' '+episode.old_num+'→'+episode.new_num;
            if(episode.over === 1){
                innerHTML += ' 已完结';
            }else if(episode.over === -1){
                innerHTML += ' 新剧';
            }
            KillBuddha_appendChild(KillBuddha_div_son,'div','KillBuddha_div_elem',innerHTML,!1,episode.object);
            KillBuddha_appendChild(KillBuddha_div_son,'hr');
        });
    });
    if (typeof(completion) === 'function' && completion.toString().indexOf('ExtensionPreprocessingJS') > -1) {
        completion();
    }
})();