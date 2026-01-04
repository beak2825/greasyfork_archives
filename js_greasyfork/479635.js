// ==UserScript==
// @name         Wikidot用户屏蔽插件
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @license MIT
// @description  目前仅适用于SCP中国分部的wikidot网站
// @author       MentalImageryMirage，即为心象蜃气楼
// @match        https://scp-wiki-cn.wikidot.com/forum/*
// @match        http://scp-wiki-cn.wikidot.com/forum/*
// @match        https://scp-wiki-cn.wikidot.com/forum:recent-posts
// @match        http://scp-wiki-cn.wikidot.com/forum:recent-posts
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479635/Wikidot%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/479635/Wikidot%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('心象蜃气楼的wikidot用户屏蔽组件启动')
    var deadList=[]
    //deadList.push('testID')
    //deadList.push('HarryLinrui')
    //deadList.push('Dr Hormress')
    var count=0
    var tempCookies = document.cookie;
    //console.log('tempCookies:'+tempCookies)
    function getCookie(name = ' blackList'){
        //截取变成cookie数组
        var array = tempCookies.split(';');
        // console.log(array)
        for (var i = 0; i < array.length; i++) {
            //将cookie截取成两部分
            var item = array[i].split("=");
            // console.log(item[0])
            //判断cookie是否为本脚本存入的，注意前面有空格
            if (item[0].toString() == name) {
                return item[1];
            }
        }
        return 'noCookie'
    }

    var theCookieList = getCookie()
    //console.log(theCookieList)
    if(theCookieList == 'noCookie'){
        document.cookie = "blackList= ; max-age=7776000; path=/"
        document.cookie = "blackListOpen=1; max-age=7776000; path=/"
        console.log('新增cookie:' + document.cookie.split(';'))

    }
    else{
        console.log('已有cookie:'+ theCookieList.split(","))
        if(theCookieList.split(",")!=""){
            deadList = theCookieList.split(",")
        }
    }

    var posts = document.getElementsByClassName('post-container')
    var thread = document.getElementById('thread-container');
    if(!thread){//近期论坛帖子页面
        thread = document.getElementById('breadcrumbs');
        posts = document.getElementsByClassName('post')
    }

    thread.innerHTML += '<div style="position: fixed;right:0;top:0;bottom:0;margin:auto 0;display:flex;align-items:start;height:150px;"><div style = "display:flex;flex-direction:column"><div style="color:red;cursor: pointer;user-select:none;height:20px;width:20px;background-color:black;text-align:center;display:flex;align-items:center;justify-content:center" onclick="window.hide()" id="hide">▶</div><div style="color:red;cursor: pointer;user-select:none;height:20px;width:20px;background-color:black;text-align:center;display:flex;align-items:center;justify-content:center" onclick="window.hide()" id="COUNT"></div></div><div id="blackList" style="width:200px;height:150px;background-color:black;color:white;display:flex;flex-direction:column;align-items:center;"><div style="display:flex;width:200px;justify-content:center;align-items:center"><div style="font-size:larger;text-align:center;">屏蔽列表</div></div><div id="list" style="overflow-y: auto;height:140px"></div></div></div>'

    window.hide = function(){
        if(document.getElementById("blackList").style.display == 'none'){
            document.getElementById("blackList").style.display = 'flex'
            document.getElementById("hide").textContent = '▶'
            document.cookie = "blackListOpen=1; max-age=7776000; path=/"
        }
        else{
            document.getElementById("blackList").style.display = 'none'
            document.getElementById("hide").textContent = '◀'
            document.cookie = "blackListOpen=0; max-age=7776000; path=/"
        }
    }
    //console.log(getCookie(' blackListOpen'))
    if(getCookie(' blackListOpen')=='0'){
        console.log('自动隐藏')
        window.hide()
    }


    window.deleteName = function(e){//挂载到window上以定义为全局函数
        console.log('删除'+ deadList[e] )
        unKill(deadList[e])
        deadList = deadList.filter(item => item !== deadList[e]);
        updateListWindow()
        updateCookie()
    }
    window.addName = function(){
        var addname = document.getElementById('addN').value;
        document.getElementById('addN').value = "";
        console.log('添加'+ addname)
        deadList.push(addname)
        updateListWindow()
        updateCookie()
    }
    const button = document.getElementById('blackList')
    button.innerHTML += '<div id="Add" style="justify-self:end;display:flex;width:170px;justify-content:space-between;align-items:center"><input id="addN" typt="text" style="height:12px;width:130px;border:none"/><div style="color:red;cursor: pointer;user-select:none;" onclick="window.addName()">添加</div></div>'

    //根据窗口内容更新名单
    function updateDeadList(){
        deadList = []
        var targetASSes = document.getElementsByClassName('targetASS')
        for(var ass = 0;ass<targetASSes.length;ass++){
            deadList.push(targetASSes[ass].textContent)
        }
    }

    const listWindow = document.getElementById('list');

    //根据名单更新窗口内容
    function updateListWindow(){
        //console.log('updateListWindow')
        //console.log(deadList)
        listWindow.innerHTML =""
        for(var newASS = 0;newASS<deadList.length;newASS++){
            console.log('更新'+ deadList[newASS])
            listWindow.innerHTML += '<div class="targetASS" style="display:flex;justify-content:space-between;width:170px;border-top:1px solid red">'+deadList[newASS]+'<span onclick="window.deleteName('+newASS+')" style="color:red;float:right;cursor: pointer;user-select:none;">删除</span></div>'
        }
    }
    //根据名单更新cookie储存
    function updateCookie(){
        //for(var id = 0;id<deadList.length;id++){
            //deadList[id]
        //}
        if(getCookie()!='noCookie'){
            //var tempCookies = document.cookie;
            var tempArray = tempCookies.split(';');
            //console.log(tempArray)
            for (var i = 0; i < tempArray.length; i++) {
                //将cookie截取成两部分
                var item = tempArray[i].split("=");
                if (item[0] == ' blackList') {
                    item[1] = deadList.join();
                    document.cookie = "blackList="+item[1]+"; max-age=7776000; path=/"
                    // tempArray[i] = item[0] + "=" + item[1]
                    // tempCookies = tempArray.join(";")
                    // console.log('更新后的cookie：'+tempCookies)
                }
            }
        }

    }

    updateListWindow()
    //alert('评论区页面')
    function kill(){
        console.log('开杀！')
        //var posts = document.getElementsByClassName('post-container')
            //console.log(posts)
        var name = ""
        for(var i = 0;i<posts.length;i++){
            if(posts[i].getElementsByClassName('printuser')[0].children[1]){
                //console.log(posts[i].getElementsByClassName('printuser')[0].children[1])
                name = posts[i].getElementsByClassName('printuser')[0].children[1].textContent
            }
            else if(posts[i].getElementsByClassName('printuser')[0].children[0]){
                console.log(posts[i].getElementsByClassName('printuser')[0].textContent)//account deleted
                name = posts[i].getElementsByClassName('printuser')[0].textContent
            }
            //console.log(name)
            for(var j=0;j<deadList.length;j++){
                if(deadList[j]==name && posts[i].style.display != 'none'){
                    console.log('屏蔽'+name)
                    posts[i].style.display = 'none'
                    count ++
                }
            }
            document.getElementById('COUNT').textContent = count
        }
    }
    //kill()
    function unKill(Name){
        var name = ""
        for(var i = 0;i<posts.length;i++){
            if(posts[i].getElementsByClassName('printuser')[0].children[1]){
                name = posts[i].getElementsByClassName('printuser')[0].children[1].textContent
            }
            else if(posts[i].getElementsByClassName('printuser')[0].children[0]){
                console.log(posts[i].getElementsByClassName('printuser')[0].textContent)//account deleted
                name = posts[i].getElementsByClassName('printuser')[0].textContent
            }
            //console.log(name)
            if(posts[i].style.display == 'none'&& name==Name){
                console.log('解除屏蔽'+name)
                posts[i].style.display = 'block'
            }
                    //posts[i].style.display = 'block'
        }
    }
    // 目标节点
    var targetNode = document.getElementById('thread-container');
    if(!targetNode){
        targetNode = document.getElementsByClassName('forum-recent-posts-box')[0];
    }
        console.log('监听'+ targetNode);

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver((mutationsList, observer) => {
        console.log('节点发生变化');
        kill()
        // 在每次 DOM 变化时触发的回调函数
        //for (let mutation of mutationsList) {
            //if (mutation.type === 'childList') {
                // 子节点列表变化（添加或删除子节点）
                //console.log('子节点发生变化');
            //}
            //else if (mutation.type === 'attributes') {
                // 属性变化
                //console.log('属性发生变化');
            //}
        //}
    });
    // 配置 MutationObserver
    const config = { childList: true, attributes: true, subtree: true };
    // 开始观察目标节点
    observer.observe(targetNode, config);

})();