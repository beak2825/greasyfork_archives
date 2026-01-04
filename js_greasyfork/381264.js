// ==UserScript==
// @name     BDWM PLUS
// @version  1.3
// @description BDWM_PLUS by motaguoke
// @include  http://bbs.pku.edu.cn/*
// @include  https://bbs.pku.edu.cn/*
// @include  https://*.bdwm.net/*
// @include  http://*.bdwm.net/*
// @grant    GM.getValue
// @grant    GM.setValue
// @namespace https://greasyfork.org/users/284856
// @downloadURL https://update.greasyfork.org/scripts/381264/BDWM%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/381264/BDWM%20PLUS.meta.js
// ==/UserScript==
//设置
var GLOBAL_VERSION = "1.3"

//全局变量
var GLOBAL_SEEME_STATUS = false //当前只看某一作者状态
var GLOBAL_SEEME_AUTHOR = "" //当前只看某一作者的作者ID

console.log(`BDWM_PLUS by motaguoke Version: ${GLOBAL_VERSION}`)
window.onload = BDWM_ADDON_MAIN()


async function BDWM_ADDON_MAIN(){
    //初始化插件
    var observe = new MutationObserver(async function (mutations){
        //初始化渲染插件
        BDWM_ADDON_SEEME_RENDER() //只看作者插件
        BDWM_ADDON_SETTINGINFO() //插件信息插件
        bool_GODMODE = await GM.getValue("启用娱乐模式",false)
        if (bool_GODMODE == true){ //娱乐模式
        BDWM_ADDON_GODMODE() 
        }
    })
    observe.observe(document.documentElement,{childList:true,subtree:true})
    
}


document.addEventListener('click',async function(event){
    //点击事件钩子
    //console.log(event.target.className+" "+event.target.id)

    if (event.target.className == "only-seeme"){ // BDWM_ADDON_SEEME插件，只看某一作者
        if (event.target.innerText == "只看TA"){
            //进入只看作者状态
            event.target.innerText = "取消只看TA"
            GLOBAL_SEEME_AUTHOR = event.target.id
            GLOBAL_SEEME_STATUS = true

            obj_onlyseeme = document.getElementsByClassName("only-seeme")
            for (i=0;i<obj_onlyseeme.length;i++){
                obj_onlyseeme[i].innerText = "取消只看TA"
            }

        } else {
            //退出只看作者状态
            event.target.innerText = "只看TA"
            GLOBAL_SEEME_AUTHOR = ""
            GLOBAL_SEEME_STATUS = false

            obj_onlyseeme = document.getElementsByClassName("only-seeme")
            for (i=0;i<obj_onlyseeme.length;i++){
                obj_onlyseeme[i].innerText = "只看TA"
            }
        }
        BDWM_ADDON_SEEME_RENDER() //点击后立刻重新渲染
    }else{
    if (event.target.id == "settings_GODMODE"){
        //娱乐模式选项
        bool_GODMODE = await GM.getValue("启用娱乐模式",false)
        console.log(bool_GODMODE)
        console.log(!bool_GODMODE)
        await GM.setValue("启用娱乐模式",!bool_GODMODE)
        if (!bool_GODMODE == true){
            BDWM_ADDON_GODMODE() //点击开始后立刻重新渲染
        }
    }

    }

},true);



async function BDWM_ADDON_SEEME_RENDER(){

    if (window.location.href.indexOf("post-read.php")<0){
        //当切换到非读贴内容时，立刻重新刷新状态，避免上次查看主楼的延续
        GLOBAL_SEEME_AUTHOR = ""
        GLOBAL_SEEME_STATUS = false
    }

    obj_found = document.getElementsByClassName("only-seeme")
    if (obj_found.length==0){ //本页面第一次加载时，给每个帖子加按钮
        obj_functions = document.getElementsByClassName("functions")

        for (i = 0;i < obj_functions.length; i++){
            obj_widebtn = obj_functions[i].getElementsByClassName("line wide-btn")[0]
            obj_newobj = document.createElement("a")
            obj_newobj.className = "only-seeme"
            if (GLOBAL_SEEME_STATUS == false){
            obj_newobj.innerText = "只看TA"} else
            {obj_newobj.innerText = "取消只看TA"}

            if (obj_widebtn){
                //存在关注按钮，在关注按钮旁边添加即可
                str_username = obj_widebtn.getElementsByClassName("add-friend")[0].getAttribute("data-username")
                obj_newobj.id = str_username
                obj_widebtn.appendChild(obj_newobj)
            } else {
                //不存在关注按钮，需要首先获取的user-name，再新建一个widebtn类插入
                //得到username
                str_username = obj_functions[i].parentNode.getElementsByClassName("username")[0].getElementsByTagName("a")[0].innerText
                obj_newobj.id = str_username
                //插入widebtn
                obj_widebtn = document.createElement("div")
                obj_widebtn.className = "line wide-btn"
                obj_functions[i].appendChild(obj_widebtn)
                //重新获得插入的widebtn DOM
                obj_functions[i].lastChild.appendChild(obj_newobj)

            }


        }
    }

    if (GLOBAL_SEEME_STATUS==true){
        //只看作者状态
        obj_postcard = document.getElementsByClassName("post-card")
        for (i = 0;i < obj_postcard.length; i++){
            str_username = obj_postcard[i].getElementsByClassName("username")[0].getElementsByTagName("a")[0].innerText //关注后“关注”按钮将被隐藏
            if (str_username!=GLOBAL_SEEME_AUTHOR){
                obj_postcard[i].style.display = "none"
            }else{
                obj_postcard[i].style.display = "block"
            }
        }

    }else{
        //非只看作者状态
        obj_postcard = document.getElementsByClassName("post-card")
        for (i = 0;i< obj_postcard.length; i++){
            obj_postcard[i].style.display = "block"
        }
    }

}




async function BDWM_ADDON_SETTINGINFO(){
    //增加插件信息
    obj_footer = document.getElementById("footer")
    if (document.getElementById("footer").innerHTML.indexOf("BDWM_PLUS")<0) {
    
    obj_newobj = document.createElement("a")
    obj_newobj.style.color = "blue"
    obj_newobj.innerText = `BDWM_PLUS 版本 ${GLOBAL_VERSION} 作者 motaguoke 点击查看更新`
    obj_newobj.href = "https://greasyfork.org/zh-CN/scripts/381264-bdwm-plus"
    obj_newobj.target = "_blank"
    obj_footer.appendChild(obj_newobj)

    obj_footer.appendChild(document.createElement("br"))

    obj_newobj = document.createElement("input")
    obj_newobj.type = "checkbox"
    obj_newobj.id = "settings_GODMODE"
    obj_newobj.checked = await GM.getValue("启用娱乐模式",false)
    obj_footer.appendChild(obj_newobj)
    
    obj_newobj = document.createElement("span")
    obj_newobj.innerText = "启用娱乐模式"
    obj_footer.appendChild(obj_newobj)
    
    obj_footer.appendChild(document.createElement("br"))


    obj_newobj = document.createElement("a")
    obj_newobj.style.color = "blue"
    obj_newobj.innerText = `查看该脚本的github页面`
    obj_newobj.href = "https://github.com/wangjunyi2008/BDWM_PLUS"
    obj_newobj.target = "_blank"

    obj_footer.appendChild(obj_newobj)
    }
}

async function BDWM_ADDON_GODMODE(){
    //娱乐模式，让你变成大佬
    str_username = document.getElementsByClassName("user-list-trigger")[0].nextSibling.nextSibling.innerText
    lst_postowner = document.getElementsByClassName("post-owner")
    for (i=0;i<lst_postowner.length;i++){
        str_thisuser = lst_postowner[i].getElementsByClassName("username")[0].firstChild.innerText
        if (str_thisuser == str_username){
            //回帖名称匹配
            obj_port = lst_postowner[i].getElementsByClassName("portrait-container")[0]
            
            if (obj_port.getElementsByClassName("vip").length <= 0){ //如果没有被日过
                //给头像加大V
                obj_new = document.createElement("img")
                obj_new.className = "vip"
                obj_new.src = "images/user/verified-border-0.png"

                obj_port.appendChild(obj_new)

                //修改昵称
                lst_postowner[i].getElementsByClassName("nickname text-line-limit")[0].innerText = "本站站长"
                lst_postowner[i].getElementsByClassName("nickname text-line-limit")[0].style.color = "red"
                //修改等级和积分
                lst_postowner[i].getElementsByClassName("score")[0].innerText = "10.0"
                lst_postowner[i].getElementsByClassName("level")[0].innerText = "唯我独尊"
                //修改帖子数和原创分
                int_postnum = parseInt(lst_postowner[i].getElementsByClassName("label")[0].nextSibling.data)
                lst_postowner[i].getElementsByClassName("label")[0].nextSibling.data = String(int_postnum * 30)

                int_postnum = parseInt(lst_postowner[i].getElementsByClassName("label")[1].nextSibling.data)
                lst_postowner[i].getElementsByClassName("label")[1].nextSibling.data = String((int_postnum + 1)* 99)

            }
        }
    }
}
