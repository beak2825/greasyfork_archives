// ==UserScript==
// @name         bilibili 多屏分控
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  bilibili控制多窗口
// @author       svnzk
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475329/bilibili%20%E5%A4%9A%E5%B1%8F%E5%88%86%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/475329/bilibili%20%E5%A4%9A%E5%B1%8F%E5%88%86%E6%8E%A7.meta.js
// ==/UserScript==


//***********************************
//       配置项

//    是否自动网页全屏
const player_web_max = true;


//***********************************





const csstext = ".playlist{width:100px;position:fixed;top:20%;right:0;z-index:99999}@keyframes adding{from{margin-top:-50px}to{margin-top:10px}}@keyframes rmitem{0%{left:0}50%{left:100px;margin-top:10px}100%{left:100px;margin-top:-50px}}.playitem{width:190px;height:50px;background-color:aliceblue;border-top-left-radius:30px;border-bottom-left-radius:30px;margin:10px;position:relative;left:0;box-shadow:1px 1px 6px #6666;transition-duration:.5s;display:flex;align-items:center;animation:itemshow 1.5s}.rmitem{animation:rmitem 1s forwards!important}.prepend{animation:adding 1s,itemshow 1.5s}@keyframes itemshow{0%{left:100px}50%{left:-60px}100%{left:0}}.playitem:hover{left:-95px;box-shadow:1px 1px 7px #666a}.playitem>img{object-fit:cover;border-radius:5px;height:85%;margin:5px;margin-left:20px}.playitem>p{height:100%;overflow:hidden;font-size:12px;text-shadow:1px 1px 5px #666}.bi_ctrl_btn{position:fixed;top:300px;left:-120px;width:150px;height:30px;border-top-right-radius:50px;border-bottom-right-radius:50px;box-shadow:1px 1px 5px #666;transition:.5s;line-height:30px;text-shadow:1px 1px 5px #666;text-align: right;padding-right: 10px;}.ctrl_on{background-color:cadetblue;height:50px;left:0;text-align: left;}.ctrl_on>p{color:white}";

const id = getRandom();
const bc = new BroadcastChannel("bili");
const bcmsg = {};

function send() {
    bc.postMessage(bcmsg);
    bcmsg.stage = 0;
    bcmsg.url = 0;
}

function getRandom() {return parseInt(Math.random()*100000);}

function findTag_a(elm) {
    if(elm.localName == "a") return elm;
    return findTag_a(elm.parentElement);
}



//  sleep函数延迟用
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
//  异步等待播放器的网页全屏按键可用 然后点击
async function playerWebMax() {
    let bt = document.querySelector(".bpx-player-ctrl-web");
    for(let t = 0;t<10; t++) {
        await sleep(1000);
        console.log("t=" + t);
        bt = document.querySelector(".bpx-player-ctrl-web");
        if(bt != null) {
            console.log(t + ")web max");
            bt.click();
            return;
        }
    }
}
//  =========================    master    =====================================
//  master类
class BMaster {
    static fns = {};
    static start() {
        //  开始处理
        //  1. 向所有client发送hello
        bcmsg.stage = stage.helloClient;
        send();
        //  2. 处理鼠标事件
        //  接管左键
        document.body.onclick = BMaster.onClick;

        //  接管中键
        document.body.onauxclick = BMaster.onClick;

        //  接管右键
        //  这里只把菜单搞掉 因为事件已经在onclick触发了
        document.body.oncontextmenu = e => e.preventDefault();

        //  创建函数列表
        BMaster.fns[stage.helloMaster] = BMaster.onHello;
        BMaster.fns[stage.hiMaster] = BMaster.onHi;
        BMaster.fns[stage.playEnded] = BMaster.onPlayEnded;

        //  接管消息
        bc.onmessage = BMaster.onMsg;

        //  给clients添加一个rm函数
        BMaster.clients.rm = (v) => {
            var pos = BMaster.clients.indexOf(v);
            if(pos != -1) BMaster.clients.splice(pos,1);
        }
        //  给ready添加一个rm函数
        BMaster.ready.rm = (v) => {
            var pos = BMaster.ready.indexOf(v);
            if(pos != -1) BMaster.ready.splice(pos,1);
        }
    }

    //  接管点击事件
    static onClick(e) {
        //  这个函数需要处理3种点击事件
        //  1. 左键 click button=0
        //  2. 中键 auxclick button=1
        //  3. 右键 auxclick button=2  type=contextmenu
        e.preventDefault();
        //  如果点击了空白处 就不处理了
        if(e.srcElement.localName == "div") return;


        var tag_a = findTag_a(e.srcElement);


        //  处理左键  直接打开url
        if(e.button == 0) {
            // 把url发出
            bcmsg.stage = stage.newURL;
            bcmsg.url = tag_a.href;
            bcmsg.id = BMaster.clients.shift();
            //  此id在ready里也有也一并清除
            BMaster.ready.rm(bcmsg.id);
            send();
            return;
        }

        //  获取title
        var title = e.srcElement.alt;
        if(e.srcElement.localName == "a") title = e.srcElement.text;

        //  获取cover
        var cover = e.srcElement.localName == "img" ? e.srcElement.src : null;



        // 处理中键 添加到playlist开头
        if(e.button == 1) {
            playlist.add({title:title,url:tag_a.href,cover:cover});
        }

        // 处理右键 添加到playlist末尾
        // 右键的事件绑定了两次 一次是click的一次是contextmenu的
        if(e.button == 2) {
            playlist.append({title:title,url:tag_a.href,cover:cover});
        }

        //  中键和右键都会触发一次向ready发送url的事件
        while(BMaster.ready.length) {

            //  如果playlist没有了就结束
            if(playlist.isEmpty()) break;

            //  取出ready 并把client也移除
            bcmsg.id = BMaster.ready.shift();
            bcmsg.url = playlist.pop();
            bcmsg.stage = stage.newURL;
            BMaster.clients.rm(bcmsg.id);
            send();

        }

        console.log("playlist");
        console.log(playlist.list);



    }

    static clients = [];
    static ready = [];

    //  处理client主动发起的hello 回应hi
    static onHello(msg) {
        //  记录id
        if(!BMaster.clients.includes(msg.id)) BMaster.clients.push(msg.id);
        console.log("onHello 新id");
        console.log(BMaster.clients);
        //  回应Hi
        bcmsg.stage = stage.hiClient;
        send();
    }

    //  处理client的Hi
    static onHi(msg) {
        //  hello 之后 client 会发回hi
        //  1. 记录id
        if(!BMaster.clients.includes(msg.id)) BMaster.clients.push(msg.id);
        console.log("onHi新id");
        console.log(BMaster.clients);

        //  2. 如果client是ready 那么加入ready列表中
        if(msg.ready) BMaster.ready.unshift(msg.id);
        console.log("ready:");
        console.log(BMaster.ready);
    }

    //  client 播放结束 插队
    static onPlayEnded(msg) {

        //  先判断这个id存在 存在就移除
        if(BMaster.clients.includes(msg.id)) BMaster.clients.splice(BMaster.clients.indexOf(msg.id),1);

        //  如果playlist有url就发过去
        if(!playlist.isEmpty()) {
            bcmsg.url = playlist.pop();
            bcmsg.stage = stage.newURL;
            bcmsg.id = msg.id;
            send();
            return;
        }

        //  如果playlist是空的 就放入ready里
        //  如果client点击了一个视频 会再次触发这个事件 需要去重
        if(!BMaster.ready.includes(msg.id)) BMaster.ready.push(msg.id);

        console.log("ready:");
        console.log(BMaster.ready);

        //  将这个id插队到前面
        BMaster.clients.unshift(msg.id);
        console.log("插队");
        console.log(BMaster.clients);

    }
    //  Master 消息处理
    static onMsg(msg) {
        //  直接调用
        console.log("master onMsg stage="+msg.data.stage);
        BMaster.fns[msg.data.stage](msg.data);

    }
}
//  =========================    master    =====================================

















//  =========================    client    =====================================
//  client类
class BClient {
    static fns = {};
    //  给Master发送hello
    static HelloMaster() {

        //创建函数列表
        BClient.fns[stage.helloClient] = BClient.onHello;
        BClient.fns[stage.hiClient] = BClient.onHi;
        BClient.fns[stage.newURL] = BClient.onNewURL;

        bcmsg.stage = stage.helloMaster;
        send();
    }

    //  master会回应hi
    static onHi(msg) {
        //  如果回应了hi 说明有master了 就把按钮消除
        CtrlBtn.display();
        console.log("client onHi");
    }

    static onHello(msg) {
        //  此stage是master发起了hello 现在要变成client了

        //  把video的状态也上报给master
        var video = document.querySelector("video");
        bcmsg.ready = video ? video.ended : true;

        bcmsg.stage = stage.hiMaster;
        send();
        CtrlBtn.display();
        console.log("client onHello");
    }

    static onNewURL(msg) {
        console.log("onNewURL");

        //  如果id不是自己 就返回
        if(msg.id != id) return;

        //  画面变白 作为响应
        document.body.style.display = "none";

        //  处理来自master的链接
        window.location.assign(msg.url);

    }

    //  video触发ended事件
    static onEnded(e) {
        bcmsg.stage = stage.playEnded;
        send();
    }


    //  client 消息处理
    static onMsg(msg) {
        //  client 不接收其他client的消息
        if(msg.data.stage >= stage.helloMaster) return;
        BClient.fns[msg.data.stage](msg.data);
    }
}
//  =========================    client    =====================================





class PlayList {
    constructor() {
        this.playlistdiv = document.createElement("div");
        this.playlistdiv.classList.add("playlist");
        document.body.appendChild(this.playlistdiv);
        this.list = [];
    }

    newItem(d) {
        //  新建一个div 并绑定数据
        var div = document.createElement("div");
        var img = document.createElement("img");
        var p = document.createElement("p");
        div.classList.add("playitem");
        div.append(img,p);
        p.innerText = d.title;
        img.src = d.cover;
        img.alt = d.title;

        return div;
    }

    add(o) {
        this.list.unshift(o);
        var c = this.newItem(o);
        c.classList.add("prepend");
        this.playlistdiv.prepend(c);
    }

    append(o) {
        this.list.push(o);
        var c = this.newItem(o);
        this.playlistdiv.append(c);
    }

    isEmpty() {
        return this.list == 0 ? true : false;
    }

    pop() {
        var rm = this.playlistdiv.querySelector(":first-child");
        rm.onanimationend = (e) => {e.srcElement.remove();}
        rm.classList.add("rmitem");
        return this.list.shift().url;
    }
}





//  控制按钮
class CtrlBtn {
    static div;
    constructor() {
        CtrlBtn.div = document.createElement("div");
        CtrlBtn.div.innerHTML = "on";
        CtrlBtn.div.className = "bi_ctrl_btn";
        CtrlBtn.div.onclick = CtrlBtn.onClick;
        document.body.appendChild(CtrlBtn.div);
    }

    //  被点击了
    static onClick() {
        //  成为master
        BMaster.start();
        //  变绿

        CtrlBtn.div.classList.add("ctrl_on");
        CtrlBtn.div.innerHTML = "<p>左键:触发播放</p><p>中键:添加到列表首</p><p>右键:添加到列表尾</p>"
        CtrlBtn.div.onclick = null;


        //  后续会添加再次点击取消master的功能  现在暂时这样用了
    }

    static display() {
        CtrlBtn.div.style.display = "none";
    }

}

//  1. master start之后 会向client发hello  client会回应hi
//  2. 一个新的页面 默认会向master发hello  如果有master回应hi 那么就成为client

const stage = {
    //  master
    helloClient : 11,
    hiClient    : 12,
    newURL      : 13,

    //  client
    helloMaster : 21,
    hiMaster    : 22,
    playEnded   : 23
};

const playlist = new PlayList();
//  开始
//  一开始就作为client存在  如果点击了start 那么才会变成master
(function() {
    GM_addStyle(csstext);
    //  监听消息
    bc.onmessage = BClient.onMsg;
    console.log("my id:"+id);
    bcmsg.id = id;

    // 添加一个按钮
    var btn = new CtrlBtn();


    //  初次hallo
    BClient.HelloMaster();

    var video = document.querySelector("video");
    if(video == null) {
        console.log("没有播放器");
    } else {
        video.onended = BClient.onEnded;

        //  网页全屏
        if(player_web_max) playerWebMax();

    }

})();