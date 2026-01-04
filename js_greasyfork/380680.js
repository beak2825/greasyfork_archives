// ==UserScript==
// @name     NGA PLUS
// @version  2.0

// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.listValues
// @grant    GM.setClipboard
// @grant    GM.deleteValue
// @include  http://nga.178.com/*
// @include  https://nga.178.com/*
// @include  https://bbs.nga.cn/*
// @include  http://bbs.nga.cn/*
// @include  https://*.ngabbs.com/*
// @include  http://*.ngabbs.com/*
// @namespace https://greasyfork.org/users/284856
// @description NGA网页版增强插件
// @downloadURL https://update.greasyfork.org/scripts/380680/NGA%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/380680/NGA%20PLUS.meta.js
// ==/UserScript==
var ARRAY_COLOR_LIST=new Array("red","yellow","green","aqua","blue","purple","white","black") //设置循环颜色
var NGA_PLUS_VERSION = 2.0

//渲染页面
//针对帖子列表页面

str_url = window.location.href

async function NGA_PLUS(){
// 加入脚本设置功能
DISPLAY_TIME = await GM.getValue("脚本设置_显示时间",false)
DISPLAY_MOBILE = await GM.getValue("脚本设置_显示机型",true)
//DISPLAY_VOID = await GM.getValue("脚本设置_无备注显示空",false) 不开放该功能，若开放，则无法在贴内进行备注

obj_cpinfo = document.getElementsByClassName("cpinfo")[0]

obj_newinfo = document.createElement("input")
obj_newinfo.type = "checkbox"
obj_newinfo.id = "settings_display_time"
obj_newinfo.checked = DISPLAY_TIME
obj_cpinfo.appendChild(obj_newinfo)
obj_newinfo = document.createElement("span")
obj_newinfo.innerText = "功能：显示用户注册/最后登录时间"
obj_cpinfo.appendChild(obj_newinfo)
obj_cpinfo.appendChild(document.createElement("br"))


obj_newinfo = document.createElement("input")
obj_newinfo.type = "checkbox"
obj_newinfo.id = "settings_display_mobile"
obj_newinfo.checked = DISPLAY_MOBILE
obj_cpinfo.appendChild(obj_newinfo)
obj_newinfo = document.createElement("span")
obj_newinfo.innerText = "功能：显示用户手机型号（如可能）"
obj_cpinfo.appendChild(obj_newinfo)
obj_cpinfo.appendChild(document.createElement("br"))

//obj_newinfo = document.createElement("input")
//obj_newinfo.type = "checkbox"
//obj_newinfo.id = "settings_display_void"
//obj_newinfo.checked = DISPLAY_VOID
//obj_cpinfo.appendChild(obj_newinfo)
//obj_newinfo = document.createElement("span")
//obj_newinfo.innerText = "功能：当无备注时隐藏备注"
//obj_cpinfo.appendChild(obj_newinfo)
//obj_cpinfo.appendChild(document.createElement("br"))

obj_newinfo = document.createElement('span')
obj_newinfo.style.color = "blue"
obj_newinfo.style.fontSize = "12px"
obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
obj_newinfo.innerText = "导出设置"
obj_newinfo.id = "Export_NGA_PLUS"
obj_cpinfo.appendChild(obj_newinfo)
obj_cpinfo.appendChild(document.createElement("br"))

obj_newinfo = document.createElement('span')
obj_newinfo.style.color = "blue"
obj_newinfo.style.fontSize = "12px"
obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
obj_newinfo.innerText = "导入设置并合并"
obj_newinfo.id = "Import_NGA_PLUS"
obj_cpinfo.appendChild(obj_newinfo)
obj_cpinfo.appendChild(document.createElement("br"))

obj_newinfo = document.createElement('span')
obj_newinfo.style.color = "blue"
obj_newinfo.style.fontSize = "12px"
obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
obj_newinfo.innerText = "清空设置"
obj_newinfo.id = "Zero_NGA_PLUS"
obj_cpinfo.appendChild(obj_newinfo)
obj_cpinfo.appendChild(document.createElement("br"))

obj_newinfo = document.createElement('span')
obj_newinfo.style.color = "red"
obj_newinfo.style.fontSize = "12px"
obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
obj_newinfo.innerText = `NGA_PLUS 版本 ${NGA_PLUS_VERSION} 作者 春风扫残雪`
obj_newinfo.id = "NGA_PLUS"
obj_cpinfo.appendChild(obj_newinfo)





if (str_url.indexOf("read.php?")>=0){
    if (str_url.indexOf("thread.php")<0){
    //渲染读取页面
        //首先渲染客户端来源

        if (await GM.getValue("脚本设置_显示机型",true)){
            list_source = document.getElementsByClassName(" client_icon")
            for (i = 0;i<list_source.length;i++){
                str_source = list_source[i].title.replace("发送自 ","").replace(" 上的 NGA官方客户端","").replace("NGA官方客户端","开源版客户端(Android)")
                obj_newinfo = document.createElement('span')
                obj_newinfo.style.color = "#555"
                obj_newinfo.style.fontSize = "12px"
                obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
                obj_newinfo.innerText = str_source
                
                obj_poster = list_source[i].parentNode
                obj_poster.insertBefore(obj_newinfo,obj_poster.lastChild)
                console.log("done")
        }
    }

        //其次渲染注册/登录时间等信息
        
        list_poster = document.getElementsByClassName("posterinfo")
        for (i = 0;i<list_poster.length;i++){
            if (list_poster[i].id.indexOf('commentposter')>=0){
                //热点回复
            }
            else {
                obj_author = list_poster[i].firstChild
                //console.log(list_poster[i])
                obj_stat = list_poster[i].getElementsByClassName("stat")[0]
                //console.log(obj_author.lastChild.innerText) // str_user_id
                str_user_id = "用户ID " + obj_author.lastChild.innerText
                str_user_note = await GM.getValue(str_user_id + "_备注","")
                int_user_color = await GM.getValue(str_user_id,0)
                //console.log(str_user_id +" "+str_user_note)
                if (str_user_note){
                    obj_newinfo = document.createElement('span')
                    obj_newinfo.className = "UserDefinedNote"
                    obj_newinfo.style.color = ARRAY_COLOR_LIST[int_user_color % ARRAY_COLOR_LIST.length]
                    obj_newinfo.style.fontSize = "12px"
                    obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
                    obj_newinfo.id = str_user_id
                    obj_newinfo.innerText = "备注: " + str_user_note
                }
                else {
                    obj_newinfo = document.createElement('span')
                    obj_newinfo.className = "UserDefinedNoteNull"
                    obj_newinfo.style.color = "#555"
                    obj_newinfo.style.fontSize = "12px"
                    obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
                    obj_newinfo.id = str_user_id
                    //if (await GM.getValue("脚本设置_无备注显示空",true) == false){
                    //    obj_newinfo.innerText = "无备注"
                    //} else {
                    //    obj_newinfo.innerText = ""
                    //}
                    obj_newinfo.innerText = "无备注"
                }
                list_poster[i].appendChild(obj_newinfo)
                list_info = obj_stat.getElementsByTagName("span")
                str_logininfo = list_info[3].title // MAGIC
                //console.log(await GM.getValue("脚本设置_显示时间"))
                if (await GM.getValue("脚本设置_显示时间") == true){

                    
                    obj_newinfo = document.createElement('span')
                    obj_newinfo.style.color = "#555"
                    obj_newinfo.style.fontSize = "12px"
                    obj_newinfo.style.fontFamily = 'Verdana, Tahoma, Arial, "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;'
                    obj_newinfo.innerText = str_logininfo
                    //console.log(list_info)
                    list_poster[i].appendChild(document.createElement("br"))
                    list_poster[i].appendChild(obj_newinfo)
                }
        }}
        return



} 
}
    //渲染其他页面，如搜索、帖子列表等
    list_time = document.getElementsByClassName("silver postdate")
    for (i = 0;i<list_time.length;i++){
        str_user_id = list_time[i].parentNode.getElementsByClassName("author")[0].title

        int_user_color = await GM.getValue(str_user_id) //读取之前设置的颜色index
        if (int_user_color) {
            obj_c3 = list_time[i].parentNode
            obj_c3.parentNode.getElementsByClassName("c2")[0].getElementsByClassName("topic")[0].style.color = ARRAY_COLOR_LIST[int_user_color % ARRAY_COLOR_LIST.length]
            console.log(`color done`)
        }
        str_user_note = await GM.getValue(str_user_id + "_备注","") // 读取之前设置的备注
        if (str_user_note != ""){
            list_time[i].innerText += " 备注:" + str_user_note
            list_time[i].style.color = "red"
            console.log(str_user_id + " " + str_user_note)
        }
    }
}

window.onload = NGA_PLUS()


//点击事件
document.addEventListener('click',async function(event){
    //console.log(event.target.className+" "+event.target.id)
    if (event.target.className == "c3"){
        str_user_id = event.target.getElementsByClassName("author")[0].title //读取选中的用户ID
        str_user_value = await GM.getValue(str_user_id,-1) //读取之前设置的颜色
        str_user_value += 1
        await GM.setValue(str_user_id,str_user_value)
        event.target.parentNode.getElementsByClassName("c2")[0].getElementsByClassName("topic")[0].style.color = ARRAY_COLOR_LIST[str_user_value % ARRAY_COLOR_LIST.length]
    }
    if (event.target.className == "silver postdate"){
        var newstr = prompt("请输入对该用户的备注","")
        event.target.innerText += " 备注:" + newstr

        str_user_id = event.target.parentNode.getElementsByClassName("author")[0].title
        
        event.target.style.color = "red"
        GM.setValue(str_user_id+"_备注", newstr)
        
        
    }
    if (event.target.className == " uitxt1"){
        //ajax 加载待解决
    }
    if (event.target.className == "UserDefinedNoteNull") {
        // 添加新备注
        var newstr = prompt("请输入对该用户的备注","")
        event.target.innerText = "备注: " + newstr
        event.target.style.color = "red"
        str_user_id = event.target.id
        await GM.setValue(str_user_id+"_备注",newstr)
        event.target.className = "UserDefinedNote"
        return
    }
    if (event.target.className == "UserDefinedNote") {
        var newstr = prompt("请修改对该用户的备注","")
        int_user_color = await GM.getValue(str_user_id,0)
        event.target.innerText = "备注: " + newstr
        str_user_id = event.target.id
        await GM.setValue(str_user_id+"_备注",newstr)
    }
    if (event.target.id == "Export_NGA_PLUS"){
        Export_NGAPLUS()
    }
    if (event.target.id == "Zero_NGA_PLUS"){
        Zero_NGAPLUS()
    }
    if (event.target.id == "Import_NGA_PLUS"){
        Import_NGAPLUS()
    }
    if (event.target.id == "settings_display_time"){
        tmp_display = await GM.getValue("脚本设置_显示时间",false)
        tmp_display = !tmp_display
        GM.setValue("脚本设置_显示时间",tmp_display)
    }
    if (event.target.id == "settings_display_mobile"){
        tmp_mobile = await GM.getValue("脚本设置_显示机型",true)
        tmp_mobile = !tmp_mobile
        GM.setValue("脚本设置_显示机型",tmp_mobile)
    }
    if (event.target.id == "settings_display_void"){
        tmp_void = await GM.getValue("脚本设置_无备注显示空",false)
        tmp_void = !tmp_void
        GM.setValue("脚本设置_无备注显示空",tmp_void)
    }
},true);

async function Export_NGAPLUS(){
    str_result = "#NGASTART#"
    OBJ_STATE_SAVE = {};
    list_GM = await GM.listValues()
    console.log(list_GM)
    for (i=0;i<list_GM.length;i++){
        OBJ_STATE_SAVE[list_GM[i]] = await GM.getValue(list_GM[i])
    }
    str_obj_json = JSON.stringify(OBJ_STATE_SAVE)
    str_result += str_obj_json + "#NGAEND#"
    GM.setClipboard(str_result)
    alert("设置已导出到剪贴板中！")
}

async function Zero_NGAPLUS(){
    if (confirm("确认要清空插件的所有备注和颜色提示吗？")){
        list_GM = await GM.listValues()
        console.log(list_GM)
        for (i=0;i<list_GM.length;i++){
            GM.deleteValue(list_GM[i])
        }
        console.log(await GM.listValues())
        alert("设置已清空！")
    }
}

async function Import_NGAPLUS(){
    str_import = prompt("请输入需要合并的设置","")
    if ((str_import.indexOf("#NGASTART#")>=0)&&(str_import.indexOf("#NGAEND#")>=0)){
        str_json = str_import.replace("#NGASTART#","").replace("#NGAEND#","")
        console.log(str_json)
        obj_json = JSON.parse(str_json)
        for (key in obj_json){
            GM.setValue(key,obj_json[key])
        }
    alert("设置合并完成！")
    } else {
        alert("设置不完整，请重新检查！")
    }
}
