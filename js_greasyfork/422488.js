// ==UserScript==
// @name         弹幕显示名称
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  直播弹幕显示名称,右键弹幕高亮uid
// @author       You
// @match        https://live.bilibili.com/*
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/422488/%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/422488/%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.insertAdjacentHTML('afterBegin',`<style>
.app-ctnr nav,.app-ctnr  .wrap{   width: auto !important;   max-width: 1400px !important;   margin: auto;}
.app-ctnr .wrap>ul{    display: flex !important;    flex-wrap: wrap;    justify-content: center;}
.bili-dm i{font-size:60%;text-decoration: underline;opacity:1}
.bili-dm .chat-history-panel {display:inline-block;background:none;}
.bili-dm .chat-history-panel *{margin: 0 1px 0 2px !important; padding:0 !important; vertical-align: middle;}
.highline{ outline: 3px solid; }
.xxlist{padding: 3px 20px !important; line-height: 22px;height: 22px; white-space: nowrap;}
.xxlist:hover{ background: hsla(0,0%,100%,.1); }
#live-player-ctnr>div[id]{position:absolute;pointer-events: none; bottom: 190px; right: 0px;z-index:1;}
#live-player-ctnr>div[id]>div{left:auto;top: auto;bottom:0;right:0}
#live-player-ctnr>div[id]>div>div{left:auto;bottom:auto}
.live-player-ctnr video{height:100% !important;}
.live-player-ctnr div[id*=gift-control-vm-new]{ position: absolute !important; }
</stype>`);
    let E_DANMAKU = ':is(.danmaku-item-container,.bilibili-live-player-video-danmaku)';
    let E_CHAT_LIST = '.chat-items';
    let E_MENU_LIST = ':is(.bilibili-live-player-context-menu-container>ul,[class*=web-player-context-menu])';

    //本地储存
    let localdata = new Proxy({},{
        get(self,key){
            let list = GM_getValue('userlist',self);
            return list[key];
        },
        set(self,key,val){
            self = GM_getValue('userlist',self)
            if(val===null) delete self[key];
            else self[key] = val;
            GM_setValue('userlist', self);
            return true;
        }
    });

    //高亮边框&右键
    let menuObserver = new MutationObserver((mu,obs)=>{
        mu.forEach(xx=>{
            let el = xx.addedNodes[0];
            if(!el){
                return;
            }
            let ul = el.querySelector('ul li:last-child');
            let txt = el.children[0];
            if(!ul || !el.attributes["data-auto-remove"] || !txt){
                return;
            }
            let cache = {};
            let tt = txt.innerHTML.replaceAll('\\','\\\\').replaceAll('"','\\"');
            document.querySelectorAll(`.chat-history-list [data-danmaku="${tt}"]`).forEach(xxx=>{
                let uid = xxx.dataset.uid;
                let name = xxx.dataset.uname;
                if(cache[uid])return true;
                if(Object.keys(cache).length>7)return false;
                cache[uid] = name;
                ul.insertAdjacentHTML('afterEnd',`<li class='xxlist' data-uid='${uid}' data-name='${name}' >高亮uid/取消高亮 (${name})</li>`);
            });

        });
        document.querySelectorAll(`${E_MENU_LIST} .xxlist`).forEach(xx=>{
            xx.onclick=xxx=>{
                xxx = xxx.target;
                localdata[xxx.dataset.uid] = localdata[xxx.dataset.uid]?null:xxx.dataset.name;
                document.querySelectorAll(`${E_DANMAKU} [data-uid="${xxx.dataset.uid}"]`).forEach(xx=>{
                    localdata[xxx.dataset.uid] ? xx.classList.add('highline') : xx.classList.remove('highline') ;
                });
            };
            xx.ondblclick=e=>{
                e.stopPropagation();
                e.preventDefault();
                return false;
            };
        });
    });
    //名称备注
    let danmakuObserver = new MutationObserver((mu, obs) => {
        document.querySelectorAll(`${E_DANMAKU}>:not([style*=done])`).forEach(xx=>{
            if(xx.querySelector('i')){
                xx.setAttribute('style',xx.getAttribute('style')+(';done'));
                return;
            }
            let tt = xx.innerHTML.replaceAll('\\','\\\\').replaceAll('"','\\"');
            let lw = Array.from(document.querySelectorAll(`${E_CHAT_LIST}>.danmaku-item[data-danmaku="${tt}"]:not([style*=done])`)||[]).pop();
            let st = xx.getAttribute('style')+';done';
            let ts = parseFloat( st.match(/-webkit-transform/) ? (st.match(/transform\s+([\d\.]+)/)||[0,0])[1] : -1 );
            if(lw && ts){
                xx.setAttribute('data-uid',lw.dataset.uid);
                lw.setAttribute('style',lw.getAttribute('style')+(';done'));
                let ic = lw.querySelector('[class*=-icon]:empty');//加图标
                ic && (xx.innerHTML+= `<b class='chat-history-panel'><b class='chat-history-list'><b class='chat-item danmaku-item'>${ic.outerHTML}</b></b></b>`);
                xx.innerHTML+=`<i style=';'>${lw.dataset.uname}</i>`;
                localdata[xx.dataset.uid] && xx.classList.add('highline') ;

                xx.setAttribute('style', st);
                (ts>0) && setTimeout(xxx=>{
                    xx.setAttribute('style',`done;display:none`);
                    xx.classList.remove('highline');
                },ts*1000);

            }
        });
    });
    //fucc
    setTimeout(xx=>{
        document.querySelectorAll('#live-player-ctnr').forEach(x=>{
            x.appendChild(document.querySelector('#gift-screen-animation-vm'));//animation
            x.appendChild(document.querySelector('#welcome-area-bottom-vm'));//incoming
            x.appendChild(document.querySelector('#chat-draw-area-vm'));//drawicon
            x.appendChild(document.querySelector('#chat-gift-bubble-vm'));//giftlist
            x.appendChild(document.querySelector('#chat-msg-bubble-vm'));//superchat
            x.appendChild(document.querySelector('#activity-welcome-area-vm'));
        });
        document.querySelectorAll('.supportWebp').forEach(x=>{
           x.classList.add('hide-aside-area');
        });
    },1000);
    //活动页要等菜单加载?
    setTimeout(xx=>{
        document.querySelectorAll(`${E_MENU_LIST}`).forEach(dm=>{
            menuObserver.observe(dm, { attributes: false, childList: true, subtree: false } );
        })
        document.querySelectorAll(`${E_CHAT_LIST},${E_DANMAKU}`).forEach(dm=>{
            danmakuObserver.observe(dm, { attributes: false, childList: true, subtree: true } );
        });
    },1000);
})();