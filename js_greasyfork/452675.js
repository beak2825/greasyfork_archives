// ==UserScript==
// @name         bilibili 推荐刷刷刷
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  b 站推荐页面
// @author       You
// @match        https://www.bilibili.com*
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452675/bilibili%20%E6%8E%A8%E8%8D%90%E5%88%B7%E5%88%B7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452675/bilibili%20%E6%8E%A8%E8%8D%90%E5%88%B7%E5%88%B7%E5%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let story = new (class {
        constructor() {
            this.cache = {};
        }
        get(name,force,defaultValue) {
            if (name in this.cache && !force) {
                return this.cache[name];
            } else {
                let c = localStorage.getItem(name);
                if (c) {
                    this.cache[name] = c;
                    return c;
                } if (typeof c === 'boolean') {
                    return c; // false
                } else if (typeof c === 'string') {
                    return c; // ''
                } else if (typeof c === 'number') {
                    return c; // 0
                } else {
                    return c || defaultValue;
                }
            }
        }
        set(name,value) {
            if (name) {
                this.cache[name] = value;
                localStorage.setItem(name,value);
            }
        }
    })

    const myPanelSize = '_my_panel_size_';
    let makeDom = new (class {
        constructor() {
            this.panel = null;
            this.rowItem = [];
            this.loadMore = null;
            this.loadMoreLock = false;
            this.first = true;
            this.timer = 0;
            this.size = +story.get(myPanelSize,false,4);
            this.lastItems = [];
            this.time3 = false;
            this.init();
        }
        init() {
            let myPanelBox = document.createElement('div');
            myPanelBox.classList.add('my-panel-box');
            myPanelBox.style.display = 'none';
            myPanelBox.innerHTML =
                `<div class="my-panel" id="my-panel"></div>
<div class="my-panel-load-more" id="my-panel-load-more">加载更多</div>
<div class="close-my-panel" id="close-my-panel">关闭</div>
<div class="size-my-panel" id="size-my-panel">
    <div tar="4">4&nbsp;&nbsp;个</div>
    <div tar="6">6&nbsp;&nbsp;个</div>
    <div tar="8">8&nbsp;&nbsp;个</div>
</div>
<div class="clear-my-panel" id="clear-my-panel">清空列表</div>`;
            document.head.innerHTML += `<style>
        .my-panel-box {
            z-index: 100000;
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            padding: 10px;
            width: 100vw;
            height: 100vh;
            background: #818181ad;
            box-sizing: border-box;
        }
        .my-panel {
            width: 100%;
            height: calc(100% - 30px);
            background: #434343;
            border-radius: 10px;
            overflow-y: scroll;
            padding: 20px;
            box-sizing: border-box;
        }
        .my-panel-load-more {
            height: 30px;
            line-height: 30px;
            font-size: 20px;
            text-align: center;
            cursor: pointer;
            color: #673ab7;
            font-weight: bold;
        }
        .close-my-panel {
            position: fixed;
            left: 10px;
            bottom: 3px;
            height: 30px;
            line-height: 30px;
            background: black;
            color: white;
            width: 50px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
        }
        .size-my-panel {
            position: fixed;
            left: 70px;
            bottom: 3px;
            height: 30px;
            line-height: 30px;
            /*background: black;*/
            color: white;
            /*width: 50px;*/
            text-align: center;
            cursor: pointer;
        }
        .size-my-panel div {
            width: 50px;
            background: #5e10ff;
            color: white;
            border-radius: 8px;
            display: inline-block;
        }
        .clear-my-panel {
            position: fixed;
            right: 10px;
            bottom: 3px;
            height: 30px;
            line-height: 30px;
            background: black;
            color: white;
            width: 90px;
            text-align: center;
            border-radius: 8px;
            cursor: pointer;
        }
        .my-panel::-webkit-scrollbar {
            background-color: transparent;
            width: 0px;
            height: 7px;
        } /* 这是针对缺省样式 (必须的) */

        .my-panel-row {
            display: flex;
        }
        .my-video-card {
            padding: 5px;
            flex: 1;
            color: whitesmoke;
            text-decoration: none;
            position: relative;
        }
        .my-video-card img {
            width: 100%;
        }
        .my-video-card .my-video-card-title {
            /*white-space: nowrap;*/
            /*overflow: hidden;*/
            /*text-overflow: ellipsis;*/
        }
        .my-video-card .my-video-card-up {
            position: absolute;
            left: 5px;
            top: 5px;
            color: white;
            background: cadetblue;
            padding: 4px;
        }
    </style>`;
            document.body.append(myPanelBox);

            this.panel = document.getElementById('my-panel');
            let loadMore = document.getElementById('my-panel-load-more');
            loadMore.onclick = () => {
                this.getNextPage();
            };

            let comm = document.createElement('li');
            comm.classList.add('right-entry-item');
            comm.innerHTML += `<a class="right-entry__outside"><svg style="color: white;" width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="zhuzhan-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z" fill="currentColor"></path></svg><span class="right-entry-text">推荐模式</span></a>`;
            let id = setInterval(() => {
                let ul = document.getElementsByClassName('right-entry');
                if (ul && ul.length) {
                    ul = ul[0];
                    let lis = ul.getElementsByTagName('li');
                    ul.insertBefore(comm,lis[1]);

                    comm.onclick = () => {
                        this.panel.parentElement.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                        this.first ? this.getNextPage() : null;
                    }
                    document.getElementById('close-my-panel').onclick = () => {
                        this.panel.parentElement.style.display = 'none';
                        document.body.style.overflow = 'scroll';
                    };
                    document.getElementById('clear-my-panel').onclick = () => {
                        this.panel.innerHTML = '';
                    };
                    let divs = document.getElementById('size-my-panel').getElementsByTagName('div');
                    for (let i = 0;i < divs.length;i++) {
                        divs[i].onclick = (function (tar) {
                            this.changeSize(+tar);
                        }).bind(this,divs[i].getAttribute('tar'));
                    }
                    clearInterval(id);
                }
            },500);
        }

        addItems(items) {
            this.lastItems = items;
            items.forEach(i => {
                this.rowItem.push(i);
                this.addToView();
            });
            this.addToView();
        }
        addToView() {
            if (this.rowItem.length === this.size) {
                let div = document.createElement('div');
                div.classList.add('my-panel-row');
                div.innerHTML = this.rowItem.map(i => {
                    return `<a class="my-video-card" target="_blank" href="${i.uri}">
                <img src="${i.pic}" alt="">
                <span class="my-video-card-title">${i.title}</span>
                <span class="my-video-card-up">${i.owner.name}</span>
            </a>`;
                }).join('\r\n');
                this.rowItem = [];
                this.panel.append(div);
            }
        }
        changeSize(size) {
            story.set(myPanelSize,size);
            if (this.size !== size) {
                this.size = size;
                this.panel.innerHTML = '';
                this.rowItem = [];
                this.addItems(this.lastItems);
            }
        }
        getNextPage() {
            if (this.loadMoreLock && !this.time3) {
                return;
            }
            this.first = false;
            this.loadMoreLock = true;
            fetch(`https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3&version=1&ps=10&fresh_idx=${this.timer + 1}&fresh_idx_1h=${this.timer + 1}`,{
                method: 'get',
                credentials: 'include'
            })
                .then(_ => _.json())
                .then(ret => {
                if (ret.data.item.length) {
                    this.addItems(ret.data.item);
                }
                this.timer++;
                if (this.timer % 3) {
                    this.time3 = true;
                    this.getNextPage();
                } else {
                    this.time3 = false;
                    setTimeout(() => {
                        this.loadMoreLock = false;
                    },2000);
                }
            });
        }
    });
    // Your code here...
})();
