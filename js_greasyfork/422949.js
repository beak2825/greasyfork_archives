// ==UserScript==
// @name         aura主工程打包提醒
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  请点击url地址栏左侧图标网站设置，打开aura.jd.com的开启弹出式窗口和重定向权限，用户强提醒弹出桌面通知；打开git.jd.com的页面通知和弹出式窗口和重定向的权限
// @author       You
// @match        http://aura.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422949/aura%E4%B8%BB%E5%B7%A5%E7%A8%8B%E6%89%93%E5%8C%85%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/422949/aura%E4%B8%BB%E5%B7%A5%E7%A8%8B%E6%89%93%E5%8C%85%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    var newWindow;
    var timer;
    var timer2;
    var initUrl;
    console.log("url check "+urlCheck())
    if(urlCheck()){
        console.log("init 1")
        timer = setInterval(init,500)
    }
    urlChangeListen(function () {
        console.log("change")
        console.log(document.location.toString().search("current_view_name=appBuildHistoryTab") != -1 );
        if(urlCheck()){
            console.log("init 2")
            timer = setInterval(init,500)
        }
    });
    function isHashChanged() {
        return document.location.href !== initUrl
    }
    function urlChangeListen(hashChangeFire){
        initUrl = document.location.href
        console.log(initUrl)
        // 如浏览器不支持onhashchange事件，则用定时器检测的办法
        timer2 = setInterval(function () {
            console.log("urlChangeListen2")
            // isHashChanged() 为要检测url是否被改变的函数
            var ischanged = isHashChanged();
            if (ischanged) {
                initUrl = document.location.href
                hashChangeFire(); //如被改变，设用函数
            }
        }, 300);

    }
    function urlCheck(){
        return document.location.toString().search("current_view_name=appBuildHistoryTab") != -1;
    }

    function init(){
        if(document.getElementsByClassName("el-table__row").length>0){
            start()
            clearInterval(timer)
        }
    }
    function start() {
        console.log("start")
        // 观察者的选项(要观察哪些突变)
        var config = { attributes: true, childList: true, subtree: true }

        var testElements = document.getElementsByClassName("el-table__fixed-right")[0].getElementsByClassName("el-table__row")
        var index = 4;
        var lastIndex = 13;
        var titleList = document.getElementsByClassName("el-table__header-wrapper")[0].getElementsByTagName("th");
        for(var i = 0; i < titleList.length; i++){
            if('状态'==titleList[i].innerText){
                console.log("pindex = "+index)
                index = i;
                break;
            }
        }
        titleList = document.getElementsByClassName("el-table__fixed-right")[0].getElementsByTagName("th");
        for(i = titleList.length-1; i >= 0; i--){
            if('more'==titleList[i].children[0].textContent){
                console.log("plastIndex = "+index)
                lastIndex = i;
                break;
            }
        }
        for (let i = 0; i < testElements.length; i++){
            var stateClass = document.getElementsByClassName("el-table__row")[i].children[index].children[0].getElementsByTagName("span")[0].className;
            if("el-tag el-tag--success el-tag--light" == stateClass || "el-tag el-tag--danger el-tag--light" == stateClass){
                continue;
            }
            var td = testElements[i].children[lastIndex];
            var button = createBtn();
            button.style.marginRight="0.8%";
            button.innerText = "监听";
            button.id = "bt"+i;
            button.addEventListener('click',function(){
                if(document.getElementById("bt"+i).innerText == "还原"){
                    changeColor('',i)
                    var self = document.getElementById("bt"+i);
                    self.parentElement.removeChild(self);
                    return;
                }
                var r=confirm("是否启用强提醒");
                newWindow = r;
                document.getElementById("bt"+i).innerText = "监听中";
                var target = document.getElementsByClassName("el-table__row")[i].children[index].children[0].getElementsByTagName("span")[0];
                console.log("click")
                var observer = new MutationObserver(function(){
                    if(target.className == "el-tag el-tag--success el-tag--light"){
                        document.getElementById("bt"+i).innerText = "还原"
                        changeColor('#D4EFDF',i)
                        toastUser(true)
                    }
                    if(target.className == "el-tag el-tag--danger el-tag--light"){
                        document.getElementById("bt"+i).innerText = "还原"
                        changeColor('#FADBD8',i)
                        toastUser(false)
                    }});
                // 开始观察已配置突变的目标节点
                observer.observe(target ,config);
                console.log(target)
            },false)
            td.appendChild(button);
        };
        console.log("end")
    }
    function toastUser(success){
        if(hidden() && newWindow){
            var url = "https://git.jd.com/?aura="+(success?"success":"fail")
            console.log("hidden")
            var a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('target', '_blank');
            a.setAttribute('id', 'startTelMedicine');
            // 防止反复添加
            if(document.getElementById('startTelMedicine')) {
                document.body.removeChild(document.getElementById('startTelMedicine'));
            }
            document.body.appendChild(a);
            a.click()


            //console.log(url)
            //window.open(url,'target','');
        }else{
            alert(success?"打包完成":"打包失败")
        }
    }

    function hidden(){
        if (typeof document.hasFocus !== 'function') {
            return document.hidden;
        }
        return !document.hasFocus()
    }



    function createBtn() {
        // var button = document.createElement("a");
        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.style.background = "#1E90FF";
        button.style.padding = "2px 5px 2px 5px";
        button.style.color = "white";
        button.style.textAlign = "center";
        return button;
    }
    function changeColor(color,i) {
        document.getElementsByClassName("el-table__row")[i].style.backgroundColor = color
        document.getElementsByClassName("el-table__row")[10+i].style.backgroundColor = color
        document.getElementsByClassName("el-table__row")[20+i].style.backgroundColor = color
    }

}


)();