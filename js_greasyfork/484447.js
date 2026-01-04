// ==UserScript==
// @name         video speed
// @namespace    http://tampermonkey.net/
// @version      20240114.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484447/video%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/484447/video%20speed.meta.js
// ==/UserScript==

class KeepVideoTime {
    constructor(props) {
        this.key = "_video_cache_";
        this.obj = this.get() || {};
        this.id = null;
    }
    set(key, time) {
        this.obj[key] = time;
        this.store();
    }
    store() {
        localStorage.setItem(this.key, JSON.stringify(this.obj));
    }

    get() {
        let data = localStorage.getItem(this.key);
        if (!data) {
            return null;
        }
        try {
            data = JSON.parse(data)
        } catch (e) {
            return null;
        } finally {
            return data;
        }
    }
    keep(getUrlId, video) {
        if (!this.id) {
            this.id = setInterval(() => {
                let vid = getUrlId();
                if (vid) {
                    this.set(vid, video.currentTime);
                }
            }, 500);
        }
    }
    stop() {
        if (this.id) {
            clearInterval(this.id);
            this.id = null;
        }
    }
}
let KeepVideoTimeInstance = null;
let onceMap = {};
let clickDomOnce = function (selector, key) {
    if (key in onceMap) {
        return;
    }
    onceMap[key] = true;
    let id = setInterval(() => {
        let d = selector();
        if (d.length) {
            d[0].click();
            clearInterval(id);
            delete onceMap[key];
        }
    }, 500);
}
let DefaultAction = {
    'default'(video, cache = new Cache()) {
        return [
            {
                group: "重置",
                name: "重置",
                run: false,
                action() {
                    cache.clear();
                }
            },
            {
                group: "全屏自动隐藏",
                name: "全屏自动隐藏",
                run: false,
                action() {
                    // cache.obj.fullScreenToHide = !cache.obj.fullScreenToHide;
                }
            }
        ]
    },
    "bilibili.com"(video) {
        return [
            {
                group: "屏幕操作",
                name: "宽屏",
                run: false,
                action() {
                    clickDomOnce(() => document.getElementsByClassName('bpx-player-ctrl-web-enter'), "bpx-player-ctrl-web-enter");
                }
            },
            {
                group: "屏幕操作",
                name: "全屏",
                run: false,
                action() {
                    clickDomOnce(() => document.getElementsByClassName('bpx-player-ctrl-full'), "bpx-player-ctrl-full");
                }
            },
            {
                group: "屏幕操作",
                name: "undo",
                run: true,
                action() {
                    console.log("undo");
                }
            }
        ]
    },
    'youtube.com'(videoInstance) {
        return [
            {
                group: "屏幕操作",
                name: "宽屏",
                run: false,
                action() {
                    let video = videoInstance.getVideo();
                    if (video.width < window.innerWidth * .8) {
                        clickDomOnce(() => document.getElementsByClassName('ytp-size-button'), "ytp-size-button");
                    }
                }
            },
            {
                group: "屏幕操作",
                name: "全屏",
                run: false,
                action() {
                    clickDomOnce(() => document.getElementsByClassName('ytp-fullscreen-button'), "ytp-fullscreen-button");
                }
            },
            {
                group: "屏幕操作",
                name: "undo",
                run: true,
                action() {
                    console.log("undo");
                }
            },
            {
                name: "记住最后播放时间",
                action(run, cache) {
                    let video = videoInstance.getVideo();
                    let getVid = () => {
                        let vid = (location.search.split('?')[1] || "").split('&').map(_=>_.split('=')).filter(_=>_[0]==='v');
                        if (vid.length === 1) {
                            vid = vid[0][1];
                        }
                        return vid;
                    }
                    let vid = getVid();
                    if (!vid || vid.length < 3) {
                        return;
                    }
                    if (!KeepVideoTimeInstance) {
                        KeepVideoTimeInstance = new KeepVideoTime();
                        if (vid && vid in KeepVideoTimeInstance.obj) {
                            if (video.currentTime < KeepVideoTimeInstance.obj[vid]) {
                                video.currentTime = KeepVideoTimeInstance.obj[vid];
                            }
                        }
                    }
                    if (run) {
                        KeepVideoTimeInstance.keep(getVid, video);
                    } else {
                        KeepVideoTimeInstance.stop();
                    }
                },
                run: true,
                replay: true,
            }
        ]
    }
};
function checkWindow() {
    return window === parent.window;
};

class DraggableDom {
    static Style = {
        // width: 100px;
        // height: 100px;
        backgroundColor: "lightblue",
        border: "2px solid #4CAF50",
        margin: "10px",
        padding: "10px",
        cursor: "move",
        position: "fixed",
        zIndex: 100000,
        borderRadius: "5px",
    }
    constructor(cache, parentDom = document.body) {
        this.cache = cache;
        this.toggleKey = this.cache.obj.toggleKey;
        this.show = cache.obj.show;
        this.id = `DD_${new Date().getTime()}`;
        this.dom = null;
        this.size = {
            width: 0,
            height: 0,
        };
        this.mark = null;
        if (this.cache.obj.top > window.innerHeight) {
            this.cache.set("top", 0);
        }
        if (this.cache.obj.left > window.innerWidth) {
            this.cache.set("left", 0);
        }
        this.style = {
            ...DraggableDom.Style,
            width: `${cache.obj.width}px`,
            height: `${cache.obj.height}px`,
            top: `${cache.obj.top}px`,
            left: `${cache.obj.left}px`,
            opacity: cache.obj.opacity ? cache.obj.opacity : 1,
            display: cache.obj.show ? 'unset' : 'none',
        };
        this.createDom(parentDom);
        this.dom.id = this.id;
        this.bindEvent();
        setTimeout(() => {
            this.size.width = this.dom.scrollWidth + 20;
            this.size.height = this.dom.scrollHeight + 20;
        }, 500);
    }
    toggleShow(v) {
        if (typeof v === 'boolean') {
            this.show = v;
        } else {
            this.show = !this.show;
        }
        this.dom.style.display = this.show ? 'unset' : 'none';
    }
    getDom() {
        if (this.dom) {
            let dom = this.dom.getElementsByClassName('dom');
            if (dom.length) {
                return dom[0];
            }
        }
        return null;
    }
    createDom(parentDom) {
        // <button accessKey="T" onClick="clickSubmit()">提交按钮</button>
        let btn = document.createElement('button');
        btn.style.display = 'none';
        btn.setAttribute("accessKey", this.toggleKey);
        btn.onclick = () => {
            if (this.dom) {
                this.toggleShow();
            }
        };
        this.mark = document.createElement('div');
        this.mark.style.width = "100vw";
        this.mark.style.height = "100vh";
        this.mark.style.position = "fixed";
        this.mark.style.left = "0";
        this.mark.style.top = "0";
        this.mark.style.display = "none";
        this.mark.style.zIndex = this.style.zIndex - 1;
        this.dom = document.createElement('div');
        this.dom .setAttribute('draggable', "true");
        this.dom.innerHTML = `<div>按下 &lt;ALT+${this.toggleKey}&gt; 可以[隐藏/显示]当前选项框</div><div class="dom"></div>`
        for (let i in this.style) {
            this.dom.style[i] = this.style[i];
        }
        parentDom.append(this.dom);
        parentDom.append(this.mark);
        parentDom.append(btn);
    }
    bindEvent() {
        // JavaScript 代码，实现拖拽功能
        let draggableElement = this.dom;
        let $this = this;
        draggableElement.ondragstart = function(event) {
            event.dataTransfer.setData('text/plain', event.target.id);
            $this.mark.style.display = 'block';
        }
        draggableElement.ondragend = function(event) {
            $this.mark.style.display = 'none';
        }

        document.body.ondragover = function(event) {
            event.preventDefault();
        };

        document.body.ondrop = function(event) {
            event.preventDefault();
            var data = event.dataTransfer.getData('text/plain');
            if (!data) {
                return;
            }
            var draggedElement = document.getElementById(data);

            // 获取鼠标位置
            var mouseX = event.clientX;
            var mouseY = event.clientY;

            // 设置元素的新位置
            draggedElement.style.left = mouseX - draggedElement.offsetWidth / 2 + 'px';
            draggedElement.style.top = mouseY - draggedElement.offsetHeight / 2 + 'px';
            $this.cache.set("top", parseFloat(draggedElement.style.top));
            $this.cache.set("left", parseFloat(draggedElement.style.left));
        };
    }
};

class Cache {
    static Reg = {
        Float: /^[0-9]+.[0-9]+$/,
        Int: /^[0-9]+$/,
    }
    static Default = {
        toggleKey: "X",
        top: 0,
        left: 0,
        width: 'unset',
        height: 'unset',
        speed: 1,
        Action: {},
        opacity: 1,
        show: true,
        // fullScreenToHide: false,
    };
    constructor(action) {
        let $this = this;
        this.key = "_video_speed_cache_";
        this.objType = {
            toggleKey(r) {
                r = r.toString();
                if (r.length > 1) {
                    return r[0];
                } else if (r.length < 1) {
                    return "X";
                } else {
                    return r;
                }
            },
            opacity(r) {
                r = $this.toNumberFloat(r);
                return r <= 0 ? 0.1 : (r > 1 ? 1 : r);
            },
            top: $this.toNumberFloat,
            left: $this.toNumberFloat,
            // width: 'unset',
            // height: 'unset',
            speed(r) {
                return $this.toNumberFloat(r, 1)
            },
        };
        this.obj = this.get() || {};
        for (let i in Cache.Default) {
            if (!(i in this.obj)) {
                this.obj[i] = Cache.Default[i];
            }
        }
    }
    toNumberFloat(r, dv) {
        r = parseFloat(r.toString());
        return Cache.Reg.Float.test(r.toFixed(1)) ? r : (dv||0);
    }
    toNumberInt(r, dv) {
        r = parseInt(r.toString());
        return Cache.Reg.Int.test(r) ? r : (dv||0);
    }
    set(key, value) {
        if (key in this.objType) {
            this.obj[key] = this.objType[key](value);
        } else {
            this.obj[key] = value;
        }
        this.store();
        return this;
    }
    store() {
        localStorage.setItem(this.key, JSON.stringify(this.obj));
    }
    checkData(data) {
        for (let i in this.objType) {
            data[i] = this.objType[i](data[i]);
        }
        return data;
    }
    get() {
        let data = localStorage.getItem(this.key);
        if (!data) {
            return null;
        }
        try {
            data = JSON.parse(data)
        } catch (e) {
            return null;
        } finally {
            return this.checkData(data);
        }
    }
    clear() {
        setTimeout(() => {
            localStorage.removeItem(this.key);
        }, 1000);
    }
}

class PlayDom {
    constructor(video, videoInstance, actions = [], cache = new Cache()) {
        this.video = video;
        this.cache = cache;
        this.draggableDom = new DraggableDom(this.cache, videoInstance.getParentDomMethod());
        this.action = {};
        this.videoInstance = videoInstance;
        this.loopActionRun = false;

        let ret = this.buildAction(actions);

        this.createDom(ret.actionListForDom);
        ret.promise().then(() => {
            this.loopAction();
        });
    }
    addListen() {
        let $this = this;
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        let video = null;

        function handleFullscreenChange() {
            if (!video) {
                video = $this.videoInstance.getVideo();
            }
            if (!document.fullscreenElement) {
                if ($this.cache.obj.Action['全屏自动隐藏'] === '全屏自动隐藏') {
                    $this.draggableDom.toggleShow(true);
                }
                return;
            }
            let isVideoFullscreen = false;
            if (video === document.fullscreenElement) {
                isVideoFullscreen = true;
            } else {
                isVideoFullscreen = !!new Array(...document.fullscreenElement.getElementsByTagName($this.videoInstance.baseDom)).filter(v => v=== video).length;
                if (isVideoFullscreen) {
                    video = document.fullscreenElement;
                }
            }
            if ($this.cache.obj.Action['全屏自动隐藏'] === '全屏自动隐藏') {
                $this.draggableDom.toggleShow(false);
            }
        }
    }
    loopAction() {
        if (this.loopActionRun) return;
        this.loopActionRun = true;
        this.addListen();
        let fn = () => {
            let v = this.videoInstance.getVideo();

            let update = false;
            let windowWidth = window.innerWidth;
            let windowHeight = window.innerHeight;
            if (windowWidth < this.cache.obj.left) {
                this.cache.obj.left = windowWidth - (this.draggableDom.size.width || windowWidth);
                update = true;
            }
            if (windowHeight < this.cache.obj.top) {
                this.cache.obj.top = windowHeight - (this.draggableDom.size.height || windowHeight);
                update = true;
            }

            v.playbackRate = this.cache.obj.speed;
            if (update) {
                this.draggableDom.dom.style.left = `${this.cache.obj.left}px`;
                this.draggableDom.dom.style.top = `${this.cache.obj.top}px`;
            }

            this.videoInstance.LoopAction();
        }
        fn();
        setInterval(() => {
            fn();
        },500);
    }

    buildAction(actions) {
        let cacheAction = this.cache.obj.Action;
        let actionList = [];
        let actionListForDom = {};
        let actionListForDom_ = [];
        actions.forEach(act => {
            this.action[act.name] = {
                action:()=>{},
                replay: false,
            }
            // act = { name: "", action() {}, group: "", run: false }
            if (!act.group) {
                act.group = act.name;
            }
            if (!(act.group in actionListForDom)) {
                actionListForDom[act.group] = [];
            }
            if (!(act.group in cacheAction)) {
                cacheAction[act.group] = "";
            } else if (cacheAction[act.group] === "") {
                cacheAction[act.group] = "none_" + new Date().getTime();
            }
            if (act.name === cacheAction[act.group]) {
                // 该主当前希望运行改方法
                actionList.push(act.action);
                cacheAction[act.group] = act.name;
                act.run = true;
                if (act.replay) {
                    this.action[act.name] = {
                        action: act.action,
                        replay: act.replay,
                    };
                }
            } else {
                if (act.run) {
                    if (cacheAction[act.group] === "") {
                        cacheAction[act.group] = act.name;
                        actionList.push(act.action);
                        if (act.replay) {
                            this.action[act.name] = {
                                action: act.action,
                                replay: act.replay,
                            };
                        }
                    } else {
                        act.run = false;
                        this.action[act.name] = {
                            action: act.action,
                            replay: false,
                        };
                    }
                } else {
                    this.action[act.name] = {
                        action: act.action,
                        replay: false,
                    };
                }
            }
            if (!act.replay) {
                this.action[act.name].replay = true;
            }
            actionListForDom[act.group].push({
                name: act.name,
                run: act.run
            });
        });
        for (let i in actionListForDom) {
            actionListForDom_.push({
                group: i,
                actions: actionListForDom[i]
            });
        }
        this.cache.obj.Action = Object.assign(this.cache.obj.Action, cacheAction);
        this.cache.store();
        return {
            promise: (function (actionLis, cache) {
                return new Promise(s => s()).then(() => {
                    actionList.forEach(act => act(true, cache));
                    return true;
                });
            }).bind(null,actionList,this.cache.obj),
            actionListForDom: actionListForDom_
        };
    }
    createDom(actionListForDom) {
        let styleDom = document.createElement('style');
        styleDom.innerHTML = `.play_dom_box {
        display: flex;
        padding: 5px;
    }
    .play_dom_btn {
        background: gainsboro;
        padding: 2px;
        margin-bottom: 2px;
        border-radius: 4px;
        width: 40px;
        text-align: center;
        cursor: pointer;
    }
    .play_dom_text {
        flex: 1;
        line-height: 80px;
        text-align: center;
    }`;
        let boxDom = document.createElement('div');
        boxDom.innerHTML = `
<div class="play_dom_box">
    <div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">-0.1</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">-0.2</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">-0.5</div>
    </div>
    <div class="play_dom_text play_dom_text_speed">${this.cache.obj.speed}</div>
    <div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">+0.1</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">+0.2</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">+0.5</div>
    </div>
</div>
<div style="display: flex;">透明 【<div class="play_dom_text_opacity">${this.cache.obj.opacity}</div>】 <div class="play_dom_btn play_dom_btn_opacity" tag="speed">-0.1</div>
&nbsp;&nbsp;&nbsp;<div class="play_dom_btn play_dom_btn_opacity" tag="speed">+0.1</div></div>
<div>
${actionListForDom.map(act => {
            // {
            //      group: "",
            //      actions: [{name: '', run: ''}]
            // }
            if (act.actions.length > 1) {
                let dom = act.actions.map(a => {
                    return `<input type="radio" tag="${a.name}" name="${act.group}" ${a.run ? 'checked' : ''} class="play_dom_check"/> ${a.name}`;
                }).join('');
                return `<div>${act.group} | ${dom}</div>`
            } else {
                let acti = act.actions[0];
                return `<div>${acti.name} <input tag="${acti.name}" type="checkbox" name="${act.group}" ${acti.run ? 'checked' : ''} class="play_dom_check"/></div>`
            }
        }).join(' ')}
</div>`;
        let dom = this.draggableDom.getDom();
        dom.append(styleDom);
        dom.append(boxDom);
        let $this = this;
        let speedTextDom = boxDom.getElementsByClassName('play_dom_text_speed')[0];
        let opacityTextDom = boxDom.getElementsByClassName('play_dom_text_opacity')[0];

        new Array(...boxDom.getElementsByClassName('play_dom_btn_opacity')).forEach(btn => {
            btn.onclick = function () {
                let sp = +this.innerText;
                $this.cache.set('opacity', (+$this.cache.obj.opacity + sp).toFixed(1));
                opacityTextDom.innerText = $this.cache.obj.opacity;
                $this.draggableDom.dom.style.opacity = $this.cache.obj.opacity;
            };
        });
        new Array(...boxDom.getElementsByClassName('play_dom_btn_speed')).forEach(btn => {
            btn.onclick = function () {
                let sp = +this.innerText;
                $this.cache.set('speed', (+$this.cache.obj.speed + sp).toFixed(2));
                speedTextDom.innerText = $this.cache.obj.speed;
                // $this.video.playbackRate = $this.cache.obj.speed;
            };
        });
        new Array(...boxDom.getElementsByClassName('play_dom_check')).forEach(btn => {
            btn.onchange = function () {
                let group = this.getAttribute('name');
                let actionName = this.getAttribute('tag');
                let currentAction = $this.action[actionName];
                if (this.checked) {
                    $this.cache.obj.Action[group] = actionName;
                    if (currentAction.replay) {
                        currentAction.action(true, $this.cache.obj);
                    } else {
                        currentAction.action(true, $this.cache.obj);
                        $this.action[actionName].action = () => {};
                    }
                } else {
                    $this.cache.obj.Action[group] = "";
                    if (currentAction.replay) {
                        currentAction.action(false, $this.cache.obj);
                    }
                }
                $this.cache.store();
            };
        });
    }
}

class Video {
    static getVideoMethod = {
        default() {
            let videos = document.getElementsByTagName('video');
            let video = false;
            if (videos.length) {
                if (videos.length === 1) {
                    video = videos[0];
                } else {
                    let ww = parseInt(window.innerWidth * 0.4);
                    let v = videos.filter(v => v.width > ww);
                    if (v.length) {
                        video = v[0];
                    }
                }
            }
            return video;
        },
        'youtube.com'() {
            let videos = document.getElementsByTagName('video');
            return videos.length ? videos[0] : false;
        },
        'bilibili.com'() {
            let bwpVideos = document.getElementsByTagName('bwp-video');
            let trVideos = document.getElementsByTagName('video');
            return bwpVideos.length ? bwpVideos[0] : (trVideos.length ? trVideos[0] : false);
        },
    }
    static getParentDomMethod = {
        'bilibili.com'() {
            let dom = document.getElementsByClassName('bpx-player-video-area');
            if (dom.length) {
                return dom[0];
            }
            window.loopActionBili = true;
            return document.body;
        }
    }
    static LoopAction = {
        'bilibili.com'() {
            if (!window.loopActionBili) {
                window.loopActionBili = setInterval(() => {
                    new Array(...document.getElementsByClassName('fixed-header')).forEach(ele => ele.style.zIndex = 1);
                }, 500);
            }
        }
    }
    static RetryTime = {
        'default': {
            time: 60,
            sleepTime: 1000,
        },
        'youtube.com': {
            time: 1e5,
            sleepTime: 3000,
        },
    }
    constructor() {
        this.baseDom = null;
        this.host =null;
        this.getVideoMethod = () => false;
        this.getParentDomMethod = () => document.body;
        this.LoopAction = () => {};
    }
    getVideo() {
        return this.getVideoMethod();
    }
    init() {
        return new Promise(s => {
            setTimeout(() => {
                this.host = location.hostname.split('.').reverse().slice(0, 2).reverse().join('.');
                let RetryTime = this.host in Video.RetryTime ? Video.RetryTime[this.host] : Video.RetryTime['default'];
                if (this.host in Video.getVideoMethod) {
                    this.getVideoMethod = Video.getVideoMethod[this.host];
                }
                if (this.host in Video.getParentDomMethod) {
                    this.getParentDomMethod = Video.getParentDomMethod[this.host];
                }
                if (this.host in Video.LoopAction) {
                    this.LoopAction = Video.LoopAction[this.host];
                }
                // 尝试推荐方法2次后使用默认方法不断尝试，超过一分钟后停止所有尝试
                let times = 2;
                let nexter = () => {
                    this.getVideoMethod = Video.getVideoMethod["default"];
                    times = RetryTime.time;
                    let id = setInterval(() => {
                        let video = this.getVideoMethod();
                        if (video) {
                            clearInterval(id);
                            this.baseDom = video.tagName;
                            s();
                        } else {
                            times--;
                            if (!times) {
                                clearInterval(id);
                                console.log("放弃，没有希望了");
                            }
                        }
                    }, RetryTime.sleepTime);
                };

                let id = setInterval(() => {
                    let video = this.getVideoMethod();
                    if (video) {
                        clearInterval(id);
                        this.baseDom = video.tagName;
                        s();
                    } else {
                        times--;
                        if (!times) {
                            clearInterval(id);
                            nexter();
                        }
                    }
                }, 500);
            }, 1000);
        })
    }
    getParentDom() {
        return this.getParentDomMethod();
    }
}
(function() {
    'use strict';
    // window.customElements.defineOld = window.customElements.define;
    // window.customElements.define = function (name, clz) {
    //     clz.prototype.attachShadowOld = clz.prototype.attachShadow;
    //     clz.prototype.attachShadow = function (obj) {
    //         return this.attachShadowOld({...obj||{},mode: 'open'})
    //     }
    //     return window.customElements.defineOld(name, clz);
    // }
    if (checkWindow()) {
        let video = new Video();
        video.init().then(() => {
            let v = video.getVideo();
            let cache = new Cache();
            if (v) {
                console.log("play dom");
                window.playDom = new PlayDom(v, video, [
                    ...(DefaultAction[video.host](video, cache) || []),
                    ...DefaultAction['default'](video, cache),
                ],cache);
            }
        });
    }
    // Your code here...
})();