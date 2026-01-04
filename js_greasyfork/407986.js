// ==UserScript==
// @name         b站空间展示当前uid粉丝数等
// @namespace    https://space.bilibili.com/29058270
// @namespace    https://github.com/wuxintlh
// @version      0.1.1.3
// @description  一个没啥用的插件
// @author       桜wuxin
// @match        https://space.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/407986/b%E7%AB%99%E7%A9%BA%E9%97%B4%E5%B1%95%E7%A4%BA%E5%BD%93%E5%89%8Duid%E7%B2%89%E4%B8%9D%E6%95%B0%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/407986/b%E7%AB%99%E7%A9%BA%E9%97%B4%E5%B1%95%E7%A4%BA%E5%BD%93%E5%89%8Duid%E7%B2%89%E4%B8%9D%E6%95%B0%E7%AD%89.meta.js
// ==/UserScript==

window.addEventListener('load',function(){
    if(document.querySelector('.n-statistics')){
        var father = document.querySelector('.n-statistics');
        var body = document.querySelector('#app');
        var box = document.createElement('div');
        var scroll = document.createElement('span');
        var sub = document.createElement('span');
        body.appendChild(scroll);
        scroll.style.position = 'absolute';
        scroll.style.left = '0px';
        scroll.style.top = '480px'
        scroll.style.width = '80px';
        scroll.style.height = '20px';
        scroll.innerHTML = '点击关闭';
        scroll.style.backgroundColor = 'red'
        scroll.style.fontSize = '20px';
        scroll.style.userSelect = 'none';
        body.appendChild(sub);
        sub.style.position = 'absolute';
        sub.style.left = '80px';
        sub.style.top = '480px';
        sub.style.width = 'auto';
        sub.style.height = '20px';
        sub.style.fontSize = '20px';
        sub.style.userSelect = 'none';
        sub.style.background = 'rgb(255,0,255)';
        body.appendChild(box);
        box.style.position = 'absolute';
        box.style.display = 'block';
        box.style.backgroundColor = 'rgba(255,192,203,.2)';
        box.style.left = '0px';
        box.style.top = '500px';
        box.style.borderTopRightRadius = '25px';
        box.style.borderBottomRightRadius = '25px';
        var a = father.querySelectorAll('a');
        var i = null;
        for(i=0;i<2;i++){
            var node = document.createElement('span');
            box.appendChild(node);
            if(i == 0){
                node.innerHTML = '关注数:' + a[i].title + '<br>';
            }else{
                node.innerHTML = '粉丝数:' + a[i].title + '<br>';
            }
            node.className = 'SakuraBoxNode';
        };
        var div = father.querySelectorAll('div');
        for(i=0;i<div.length;i++){
            node = document.createElement('span');
            box.appendChild(node);
            if(i==0){
                var dianzan = div[0].title.split('赞',-1);
                node.innerHTML = '总获赞数:' + dianzan[1] + '<br>';
                node.className = 'SakuraBoxNode';
            }else{
                var dic = div[i].title.split('，',-1);
                node.innerHTML = dic[1] + '<br>';
                node.className = 'SakuraBoxNode';
            }
        };
        if(document.querySelector('.i-live-off')){
            a = document.querySelector('.i-live-off').querySelector('a');
            var href = a.href.split('/',-1);
            if(href[3].length<10){
                node = document.createElement('span');
                box.appendChild(node);
                node.innerHTML = '当前账号直播间号:<a href="https://live.bilibili.com/' + href[3] + '" target="_blanket">' + href[3] + '<br>';
                node.className = 'SakuraBoxNode';
            }
        }else if(document.querySelector('.i-live-on')){
            a = document.querySelector('.i-live-on').querySelector('a');
            href = a.href.split('/',-1);
            node.innerHTML = '当前账号直播间号:<a href="https://live.bilibili.com/' + href[3] + '" target="_blanket">' + href[3] + '<br>';
            node.className = 'SakuraBoxNode';
        }
        node = document.createElement('span');
        box.appendChild(node);
        var uid = window.location.pathname.split('/',-1);
        node.innerHTML = '当前账号uid:' + uid[1];
        node.className = 'SakuraBoxNode';
        var allnode = document.querySelectorAll('.SakuraBoxNode');
        for(i=0;i<allnode.length;i++){
            allnode[i].style.color = 'rgb(255,255,0)';
            allnode[i].style.fontSize = '20px';
        };
        window.addEventListener('scroll',function(){
            box.style.position = 'fixed';
            scroll.style.position = 'fixed';
            sub.style.position = 'fixed';
        });
        box.style.height = 'auto';
        box.style.width = 'auto';
        //关注
        if(document.querySelector('.h-action')){
            var subscribe = document.querySelector('.h-action');
            if(subscribe.children[0].className == 'h-f-btn h-follow'){
                sub.innerHTML = '点击关注';
            }else{
                sub.innerHTML = '点击取关';
            }
        }
        sub.addEventListener('click',function(){
            if(subscribe.children[0].className == 'h-f-btn h-follow'){
                subscribe.children[0].click();
                setTimeout(function(){
                    var follow = document.querySelector('.follow-dialog-window');
                    var btn = follow.querySelector('.bottom').querySelector('button');
                    btn.click();
                },500);
                sub.innerHTML = '点击取关';
            }else if(subscribe.children[0].className == 'be-dropdown h-f-btn h-unfollow'){
                subscribe.children[0].children[1].children[1].click();
                sub.innerHTML = '点击关注';
            }
        })
        //开关信息
        scroll.addEventListener('click',function(){
            if(box.style.display == 'block'){
                box.style.display = 'none';
                scroll.innerHTML = '点击开启';
            }else if(box.style.display == 'none'){
                box.style.display = 'block';
                scroll.innerHTML = '点击关闭';
            };
        })
    };
})