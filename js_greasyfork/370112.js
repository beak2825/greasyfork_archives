// ==UserScript==
// @name         bilipager
// @namespace    http://s.xmcp.ml/
// @version      0.3.3
// @description  人类能用的B站分P列表
// @author       xmcp
// @match        *://www.bilibili.com/video/*
// @supportURL   https://github.com/xmcp/bilipager
// @contributionURL https://s.xmcp.ml/pakkujs/donate.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370112/bilipager.user.js
// @updateURL https://update.greasyfork.org/scripts/370112/bilipager.meta.js
// ==/UserScript==

const ZINDEX_NORMAL=114514;
const ZINDEX_FULLSCREEN=2147483647;
const WIDTH=350;
const ANIMATION_TIME_MS=200;
const CSSTEXT=`
.bilipager-list::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
.bilipager-list::-webkit-scrollbar-track {
    background-color: rgba(255,255,255,.3);
}
.bilipager-list::-webkit-scrollbar-thumb {
    background-color: rgba(128,128,128,.6);
}
.bilipager-list::-webkit-scrollbar-thumb:active {
    background-color: rgba(128,128,128,1);
}

.bilipager-list:empty, .bilipager-popover:empty {
    display: none;
}

.bilipager-list {
    width: ${WIDTH}px;
    position: fixed;
    height: 100%;
    background-color: rgba(225,225,225,.9);
    top: 0;
    left: -${WIDTH-1}px;
    opacity: 0;
    z-index: ${ZINDEX_FULLSCREEN};
    box-sizing: border-box;
    padding: 2em 0;
    overflow-y: auto;
    word-break: break-all;
    transition: left ${ANIMATION_TIME_MS}ms ease-out, opacity ${ANIMATION_TIME_MS}ms ease-out;
}
.bilipager-list:hover, .bilipager-list.hover {
    left: 0;
    opacity: 1;
}

.bilipager-list p {
    overflow: hidden;
    padding: .5em .3em .5em .5em;
    cursor: pointer;
    white-space: nowrap;
    transition: padding .2s ease;
}

.bilipager-list p code {
    font-family: Consolas, Courier, monospace;
}

.bilipager-list p span {
    font-size: 1.2em;
}

.bilipager-list p:hover {
    background-color: rgba(255,255,255,.8);
    white-space: normal;
    padding: .5em 0 .5em .8em;
    box-shadow: 0 1px 25px rgba(0,0,0,.3);
}

.bilipager-list p.bilipager-curp {
    background-color: black;
    color: white;
}

.bilipager-list p.animation {
    color: black;
    -webkit-animation: page-switch 1s ease;
            animation: page-switch 1s ease;
}

@-webkit-keyframes page-switch {
    0%   {box-shadow: 0 1px 25px rgba(0,0,0,.3);   background-color: rgba(255,255,255,.8);}
    20%  {box-shadow: 0 1px 25px rgba(0,0,255,.5); background-color: rgba(205,205,255,1); }
    50%  {box-shadow: 0 1px 25px rgba(0,0,255,.5); background-color: rgba(205,205,255,1); }
    100% {box-shadow: 0 1px 25px rgba(0,0,0,.3);   background-color: rgba(255,255,255,.8);}
}
@keyframes page-switch {
    0%   {box-shadow: 0 1px 25px rgba(0,0,0,.3);   background-color: rgba(255,255,255,.8);}
    20%  {box-shadow: 0 1px 25px rgba(0,0,255,.5); background-color: rgba(205,205,255,1); }
    50%  {box-shadow: 0 1px 25px rgba(0,0,255,.5); background-color: rgba(205,205,255,1); }
    100% {box-shadow: 0 1px 25px rgba(0,0,0,.3);   background-color: rgba(255,255,255,.8);}
}

.bilipager-popover {
    min-width: 150px;
    position: absolute;
    height: 1.7em;
    line-height: 1.7em;
    font-size: 1.2em;
    padding: 0 .5em;
    background-color: black;
    color: white;
    top: 42px;
    left: 10px;
    z-index: ${ZINDEX_NORMAL};
    border-radius: 3px;
    word-break: break-all;
    white-space: nowrap;
}

.bilipager-popover:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    left: -4px;
    margin-top: -5px;
    border-width: 5px 5px 5px 0;
    border-color: transparent;
    border-right-color: black;
    border-style: solid;
}
`;

(function() {
    'use strict';

    let list_root=document.createElement('div');
    list_root.className='bilipager-list';
    list_root.addEventListener('mousewheel',function(e) {
        e.stopPropagation();
    });

    let popover=document.createElement('div');
    popover.className='bilipager-popover';
    popover.addEventListener('mouseover',function(e) {
        list_root.classList.add('hover');
        setTimeout(function() {
            list_root.classList.remove('hover');
        },ANIMATION_TIME_MS+10);
    });

    let playlist_cache={};

    function format_duration(d) {
        function pad(t) {
            return (''+t).padStart(2,'0');
        }
        return d<3600 ?
            (Math.floor(d/60)+':'+pad(d%60)) :
            (Math.floor(d/3600)+':'+pad(Math.floor((d%3600)/60))+':'+pad(d%60));
    }

    function reload_ui(aid) {
        if(!playlist_cache[aid]) {
            playlist_cache[aid]=fetch('https://api.bilibili.com/x/player/pagelist?aid='+aid).then(res=>res.json());
        }
        playlist_cache[aid].then(function(plist) {
            list_root.textContent='';
            popover.textContent='';

            console.log('!!',plist);
            if(plist.data.length<=1) return;

            plist.data.forEach(function(p) {
                let li=document.createElement('p');

                let li_1=document.createElement('code');
                li_1.textContent=`[${p.page}] ${format_duration(p.duration)} `;
                li.appendChild(li_1);
                let li_2=document.createElement('span');
                li_2.textContent=`${p.part}`;
                li.appendChild(li_2);

                li.addEventListener('click',function() {
                    li.classList.add('animation');

                    const ind_10=Math.floor((p.page-1)/10)*10+1;
                    const ind_30=Math.floor((p.page-1)/30)*30+1;

                    function paginate_failed() {
                        //alert('pagination failed');
                        location.href='//www.bilibili.com/video/av'+aid+'/?p='+p.page;
                    }

                    for(const pager_30 of document.querySelectorAll('#multi_page .more-box li')) {
                        if(pager_30.textContent.startsWith(ind_30+'-')) {
                            pager_30.click();
                            setTimeout(function() {
                                for(const pager_10 of document.querySelectorAll('#multi_page .paging li')) {
                                    if(pager_10.textContent.startsWith(ind_10+'-')) {
                                        pager_10.click();
                                        setTimeout(function() {
                                            const paginate_link=document.querySelector(`a.router-link-active[href="/video/av${aid}/?p=${p.page}"]`);
                                            if(paginate_link) {
                                                console.log('switch: pagniate link');
                                                paginate_link.click();
                                                return;
                                            }
                                            paginate_failed();
                                        },1);
                                        return;
                                    }
                                }
                                paginate_failed();
                            },1);
                            return;
                        }
                    }
                    paginate_failed();
                });
                list_root.appendChild(li);

                if(p.cid===parseInt(window.cid)) {
                    li.className='bilipager-curp';
                    if(li.scrollIntoViewIfNeeded) {
                        li.scrollIntoViewIfNeeded();
                    } else {
                        li.scrollIntoView(false);
                    }
                    popover.textContent=`[${p.page}/${plist.data.length}] ${p.part}`;
                }
            });
        });
    }

    function setup_listener() {
        function onfschange(e) {
            const elem=document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.body;
            if(list_root.parentNode!==elem) {
                if(list_root.parentNode) {
                    list_root.parentNode.removeChild(list_root);
                }
                elem.appendChild(list_root);
            }
        }
        document.addEventListener('fullscreenchange',onfschange);
        document.addEventListener('webkitfullscreenchange',onfschange);
        document.addEventListener('mozfullscreenchange',onfschange);

        addEventListener('message',function(e) {
            if(e.data.type==='pakku_event_danmaku_loaded') {
                reload_ui(window.aid);
            }
        });
    }

    if(window.aid) {
        let cssobj=document.createElement('style');
        cssobj.textContent=CSSTEXT;
        document.head.appendChild(cssobj);
        document.body.appendChild(list_root);
        document.body.appendChild(popover);
        setup_listener();
        reload_ui(window.aid);
    }
})();
