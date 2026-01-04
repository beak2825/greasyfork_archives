// ==UserScript==
// @name        AB站网页背景更改(a站未完善)
// @namespace    https://github.com/wuxintlh/
// @namespace    https://wuxintlh.github.io
// @namespace    https://space.bilibili.com/29058270
// @namespace    https://www.acfun.cn/u/57391284
// @version      0.3.9.3
// @description  更改ab站背景的懒人脚本，位置在页面左下角.
// @author       桜ミク
// @icon         http://smiku.top/sakura.png
// @match        *://*.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://manga.bilibili.com/*
// @match        https://live.bilibili.com/blackboard/*
// @match        https://www.bilibili.com/page-proxy/*
// @match        *.acfun.cn/*
// @exclude      https://live.bilibili.com/p/html/live-lottery/*
// @exclude      *//message.bilibili.com/pages/nav/index_new_pc_sync*
// @exclude      *//t.bilibili.com/pages/nav/index_new*
// @exclude      *//member.bilibili.com/x2/creative/*
// @exclude      *//member.bilibili.com/video/*
// @QQgroup      793513923
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407255/AB%E7%AB%99%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9%28a%E7%AB%99%E6%9C%AA%E5%AE%8C%E5%96%84%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407255/AB%E7%AB%99%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9%28a%E7%AB%99%E6%9C%AA%E5%AE%8C%E5%96%84%29.meta.js
// ==/UserScript==

//sh代表可见高度,bcurl代表背景地址,domain代表域名
var sh;
var bcurl = '';
var host = window.location.host;
var domain = document.domain;
var lc;
var body = document.querySelector('body');
alert("请上作者页面安装最新的版本，此版本不再更新，最新版本为背景更改脚本2.0");
//获取屏幕高度
sh=document.documentElement.clientHeight;
domain == 'bilibili.com'||'www.bilibli.com'|| 'live.bilibili.com'||'managa.bilibili.com'||'t.bilibili.com' ? lc = 0:lc = 1;
//初始化背景div
if(lc==0){
    set();
}else{
    setTimeout(function(){
        set();
    },5000);
}

//bcb代表b站默认背景,bca代表a站默认背景
var bcb = ['https://i0.hdslb.com/bfs/article/d12fee446e2533206e0b04024c39e00a40c4bc4c.png@1320w_912h.webp','https://i0.hdslb.com/bfs/article/54616fdbb9bed40ea2cf8540f8517b11c9aa4ad3.jpg@1320w_868h.webp',
           'https://i0.hdslb.com/bfs/article/67a82d9f881dd41dd6709322595340bf9e6cf46a.jpg@1320w_788h.webp','https://i0.hdslb.com/bfs/album/658ab52e2d631f9d974112e2d5b4cab476e3f61d.jpg',
           'https://i0.hdslb.com/bfs/vc/c255f51c594cf6e724fb9f04975fae7e7eb8b876.jpg@2000w_1e.webp','https://iknow-pic.cdn.bcebos.com/42a98226cffc1e17c52713054290f603738de96e?x-bce-process=image/resize,m_lfit,w_600,h_800,limit_1'];
var bca = ['https://w.wallhaven.cc/full/g8/wallhaven-g8kd37.jpg','https://img.tt98.com/d/file/96kaifa/201905101622281/001.jpg','https://img.tt98.com/d/file/tt98/2019092618001803/001.jpg',
           'https://w.wallhaven.cc/full/zm/wallhaven-zmemxg.png','https://w.wallhaven.cc/full/rd/wallhaven-rdyyjm.png','https://w.wallhaven.cc/full/od/wallhaven-odkp95.jpg'];

//初始化侧边栏按钮
if(lc==0){
    if (host != 'live.bilibili.com') {
        spandiv(body);
        spandivD(body);
    } else {
        var main = document.querySelector('.live-room-app').querySelector('.z-app-content');
        if (main != undefined) {
            spandiv(main);
            spandivD(main);
        } else {
            spandiv(body);
            spandivD(body);
        }
    };
}else{
    spandiv(body);
    spandivD(body);
}



window.addEventListener('scroll', function() {
    var span = document.querySelector('.SakuraSpans');
    var div = document.querySelector('.SakuraDivd');
    span.style.position = 'fixed';
    div.style.position = 'fixed';
})
var span = document.querySelector('.SakuraSpans');
//侧边栏弹出
span.addEventListener('mouseover', function() {
    animate(span, 0);
})
span.addEventListener('mouseout', function() {
    var div = document.querySelector('.SakuraDivd');
    if (div.style.display == 'block') {
        return false;
    } else {
        animate(span, -90);
    }
})

//弹出框
span.addEventListener('click', function() {
    var div = document.querySelector('.SakuraDivd');
    if (div.style.display == 'none' && this.style.left == '0px') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
});

//更换背景
var button = document.querySelector('.SakuraButtonb')
button.addEventListener('click', function() {
    var input = document.querySelector('.SakuraInputi');
    bcurl = input.value;
    if (bcurl == '') {
        alert('你没有输入任何内容!');
    } else {
        var div = document.querySelector('.SakuraBackground');
        //在本地储存bcurl
        window.localStorage.setItem('bcurl', bcurl);
        setbc(bcurl);
    }
});

//图片输入框判断是否输入
var input = document.querySelector('.SakuraInputi');
input.addEventListener('focus', function() {
    if (input.value == '') {
        input.placeholder = '';
    }
});
input.addEventListener('blur', function() {
    if (input.value == '') {
        input.placeholder = '请输入完整的背景url';
    }
});

//打开页面时设置背景
function set() {
    var body = document.querySelector('body');
    var div = document.createElement('div');
    var main = document.getElementById('main');
    if(lc==0){
        body.appendChild(div);
    }else{
        var pathname = window.location.pathname;
        var path = pathname.split('/');
        if(path[1]=='v'){
            main.appendChild(div);
        }else{
            body.appendChild(div);
        }
    }
    div.className = 'SakuraBackground';
    var ifbcurl = window.localStorage.getItem('bcurl');
    if (ifbcurl != '' && ifbcurl != null) {
        bcurl = window.localStorage.getItem('bcurl'); //保存的背景
        setbc(bcurl);
    } else {
        lc==0?bcurl = 'https://i0.hdslb.com/bfs/album/eb65ae5ee6f66b6381090f5bee4fe6cbabfd6d0d.png':bcurl='https://img.tt98.com/d/file/96kaifa/201905101622281/001.jpg'; //默认背景
        setbc(bcurl);
    }
};
//背景设置
function setbc(bcurl) {
    if(lc==0){
        var div = document.querySelector('.SakuraBackground');
        div.style.background = "url('" + bcurl + "')";
        div.style.backfroundRepeat = 'no-repeat';
        div.style.position = 'fixed';
        div.style.backgroundPosition = 'center 0';
        div.style.backgroundSize = 'cover';
        div.style.zoom = '1';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.top = '0';
        div.style.left = '0';
        div.style.webkitBackgroundSize = 'cover';
        div.style.zIndex = '-1';
        div.className = 'SakuraBackground';
    } else {
        div = document.getElementById('main');
        div.style.background = 'url("' + bcurl + '")';
        div.style.backfroundRepeat = 'no-repeat';
        div.style.backgroundPosition = 'center 0';
        div.style.backgroundSize = 'cover';
        div.style.zoom = '1';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.top = '0';
        div.style.left = '0';
        div.style.webkitBackgroundSize = 'cover';
        div.style.zIndex = '-1';
    }
}

//提供默认ab站六个背景图
function spandiv(target) {
    var div = document.createElement('div');
    var span = document.createElement('span');
    var input = document.createElement('input');
    var button = document.createElement('button');
    target.appendChild(span);
    span.innerHTML = '点击更换背景';
    span.style.color = 'rgb(220,20,60)';
    span.className = 'SakuraSpans';
    span.style.width = '100px';
    span.style.height = '22px';
    span.style.position = 'absolute';
    //span.style.top = '940px';
    //根据屏幕高度更改
    span.style.top = sh - 160 + "px";
    span.style.left = '-90px';
    span.style.backgroundColor = 'rgba(0,255,255,.5)';
    span.style.userSelect = 'none';
    span.style.zIndex = '10';
    span.style.fontSize = '15px';
    target.appendChild(div);
    div.className = 'SakuraDivd';
    div.style.backgroundColor = 'rgba(255,0,255,.5)'
    div.style.width = '400px';
    div.style.height = '60px';
    div.style.position = 'absolute';
    //div.style.top = '902px';
    //根据屏幕高度更改
    div.style.top = sh - 158 + "px";
    div.style.left = '100px';
    div.style.display = 'none';
    div.style.zIndex = '10';
    span.style.position = 'fixed';
    div.style.postion = 'fixed';
    div.appendChild(input);
    div.appendChild(button);
    input.type = 'text';
    input.placeholder = '请输入完整的背景url';
    input.style.width = '400px';
    input.className = 'SakuraInputi';
    button.innerHTML = '点击更换背景';
    button.style.position = 'absolute';
    button.style.top = '30px';
    button.style.left = '150px';
    button.className = 'SakuraButtonb';
};

function spandivD(target) {
    var div = document.createElement('div');
    var body = document.querySelector('body');
    var span = document.createElement('span');
    var img = document.createElement('img');
    target.appendChild(span);
    span.innerHTML = '点击查看默认背景';
    span.style.color = 'rgb(220,20,60)';
    span.className = 'SakuraDSpans';
    span.style.width = '140px';
    span.style.height = '22px';
    span.style.position = 'absolute';
    //span.style.top = '900px';
    //根据屏幕高度更改
    span.style.top = sh - 335 + "px";
    span.style.left = '-120px';
    span.style.backgroundColor = 'rgba(0,255,255,.5)';
    span.style.userSelect = 'none';
    span.style.zIndex = '10';
    span.style.fontSize = '15px';
    target.appendChild(div);
    div.className = 'SakuraDDivd';
    div.style.backgroundColor = 'rgba(255,255,255,.4)'
    div.style.width = '300px';
    div.style.height = '200px';
    div.style.position = 'absolute';
    //div.style.top = '723px'
    //根据屏幕高度更改
    div.style.top = sh-337 + "px";
    div.style.left = '140px';
    div.style.display = 'none';
    div.style.zIndex = '10';
    span.style.position = 'fixed';
    div.style.position = 'fixed';
    div.appendChild(img);
    //第一张
    if(lc==0){
        img.src = bcb[0];
    }else{
        img.src = bca[0];
    }
    img.style.width = '80px';
    img.style.height = '80px';
    img = document.createElement('img');
    div.appendChild(img);
    //第二张
    if(lc==0){
        img.src = bcb[1];
    }else{
        img.src = bca[1];
    }
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.marginLeft = '30px';
    img = document.createElement('img');
    div.appendChild(img);
    //第三张
    if(lc==0){
        img.src = bcb[2];
    }else{
        img.src = bca[2];
    }
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.marginLeft = '30px';
    img = document.createElement('img');
    div.appendChild(img);
    //第四张
    if(lc==0){
        img.src = bcb[3];
    }else{
        img.src = bca[3];
    }
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.marginTop = '40px';
    img = document.createElement('img');
    div.appendChild(img);
    //第五张
    if(lc==0){
        img.src = bcb[4];
    }else{
        img.src = bca[4];
    }
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.marginLeft = '30px';
    img.style.marginTop = '40px';
    img = document.createElement('img');
    div.appendChild(img);
    //第六张
    if(lc==0){
        img.src = bcb[5];
    }else{
        img.src = bca[5];
    }
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.marginLeft = '30px'
    img.style.marginTop = '40px';
}

//提供默认背景更改的弹出框等
var spanD = document.querySelector('.SakuraDSpans');
window.addEventListener('scroll', function() {
    var spanD = document.querySelector('.SakuraDSpans');
    var divD = document.querySelector('.SakuraDDivd');
    spanD.style.position = 'fixed';
    divD.style.position = 'fixed';
})
spanD = document.querySelector('.SakuraDSpans');
//侧边栏弹出
spanD.addEventListener('mouseover', function() {
    animate(spanD, 0);
})
spanD.addEventListener('mouseout', function() {
    var divD = document.querySelector('.SakuraDDivd');
    if (divD.style.display == 'block') {
        return false;
    } else {
        animate(spanD, -120);
    }
})
//弹出框
spanD.addEventListener('click', function() {
    var divD = document.querySelector('.SakuraDDivd');
    if (divD.style.display == 'none' && this.style.left == '0px') {
        divD.style.display = 'block';
    } else {
        divD.style.display = 'none';
    }
});
var divD = document.querySelector('.SakuraDDivd');
var img = divD.querySelectorAll('img');
for (var i = 0; i < img.length; i++) {
    img[i].addEventListener('click', function() {
        var bcurl = this.src;
        setbc(bcurl);
        window.localStorage.setItem('bcurl', bcurl);
    })
};
//将视频中出现的关注按钮进行隐藏并把评论栏透明化(已经无效)
/*
setTimeout(function() {
    if (document.querySelector('.bilibili-player-popup-padding') && document.querySelector('.bilibili-player-popup-area')) {
        var father = document.querySelector('.bilibili-player-popup-padding');
        var son = document.querySelector('.bilibili-player-popup-area');
        father.removeChild(son);
    }
}, 2000) //设置默认2s延迟
*/
//视频评论
var cvhost = window.location.pathname;
var cvhostall = cvhost.split('/',-1);
cvhost = cvhostall[1];
setTimeout(function() {
    if ((document.querySelector('.bb-comment')&& cvhost == 'video')||(document.querySelector('.bb-comment')&& cvhost == 'bangumi')) {
        var span = document.createElement('span');
        body.appendChild(span);
        span.style.position = 'absolute';
        span.style.backgroundColor = 'rgba(0,255,255,.5)';
        span.innerHTML = '点击切换评论区透明度';
        span.style.userSelect = 'none';
        span.style.width = '140px'
        span.style.left = '-120px';
        //span.style.top = '800px';
        //根据屏幕更改高度
        span.style.top = sh - 220 + "px";
        span.style.position = 'fixed';
        span.className = 'SakuraSpanBbChange';
        var div = document.querySelector('.bb-comment');
        div.style.background = 'rgba(255,192,203,0)';
    }
}, 5000) //设置默认5s延迟
setTimeout(function(){
    var spansbc = document.querySelector('.SakuraSpanBbChange');
    spansbc.addEventListener('click',function(){
        var div = document.querySelector('.bb-comment');
        if(div.style.background == 'rgba(255, 192, 203, 0.5)'&& spansbc.style.left == '0px'){
            div.style.background = 'rgba(255, 192, 203, 0)';
        }else{
            div.style.background = 'rgba(255, 192, 203, 0.5)';
        }
    })
    spansbc.addEventListener('mouseover',function(){
        animate(spansbc,0);
    })
    spansbc.addEventListener('mouseout',function(){
        animate(spansbc,-120);
    })
},6000)
//将专栏透明化(暂时取消)
/*
if (document.querySelector('.page-container') && cvhost == 'read') {
    var page = document.querySelector('.page-container');
    page.style.background = 'rgba(255,192,203,.4)';
    setTimeout(function() {
        var cont = document.querySelector('.bb-comment');
        cont.style.background = 'rgba(255,255,255,0)';
    }, 3000)
}
*/
//直播间动态和页脚透明化(暂时取消)
/*
if (host == 'live.bilibili.com') {
    setTimeout(function() {
        if (document.querySelector('.feed-card') != undefined) {
            var div = document.querySelector('.feed-card').querySelector('.content').querySelectorAll('.card');
            for (var i = 0; i < div.length; i++) {
                div[i].style.background = 'rgba(255,192,203,0)'
            }
        }
        if (div = document.querySelector('#link-footer-vm')) { //将某些页面最低层变透明
            div = document.querySelector('#link-footer-vm');
            div.style.background = 'rgba(255,192,203,.1)';
            var footer = document.querySelector('.link-footer');
            footer.style.backgroundColor = 'rgba(255,192,203,.1)';
        }
    }, 5000)
}
*/
//将视频上方的导航栏透明化(暂时取消)
/*
setTimeout(function() {
    if (document.querySelector('.mini-type')) {
        var div = document.querySelector('.mini-type');
        div.style.background = 'rgba(255,192,203, .1)';
        div = document.querySelectorAll('div');
        for (var i = 0; i < div.length; i++) {
            if (div[i].className == 'van-popover van-popper van-popper-vip' || div[i].className == 'van-popover van-popper van-popper-favorite' || div[i].className == 'van-popover van-popper van-popper-history' ||
                div[i].className == 'van-popover van-popper van-popper-upload' || div[i].className == 'van-popover van-popper van-popper-nav van-popper-avatar') {
                div[i].style.backgroundColor = 'rgba(255,192,203, .8)';
            }
        }
    }
}, 3000);
*/
//滑出动画
function animate(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer);
            if (callback) {
                animate(obj, target, callback);
            }
        } else {
            obj.style.left = obj.offsetLeft + step + 'px';
        }
    }, 10)
};