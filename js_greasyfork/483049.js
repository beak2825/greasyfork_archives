// ==UserScript==
// @name         花瓣收藏夹
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  图片添加花瓣收藏夹脚本
// @author       Hazel
// @match        https://*/*
// @match        http://*/*
// @icon         https://st0.dancf.com/static/02/202306090204-51f4.png
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/483049/%E8%8A%B1%E7%93%A3%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/483049/%E8%8A%B1%E7%93%A3%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==
const last_boards = "https://api.huaban.com/last_boards";
let cookie = GM_getValue('cookie', false);
let name = GM_getValue('name', "登录");

(function() {
    'use strict';
    // Your code here...
    menu_init();
    event_init();
    //download_img()
})();

function send_request(url, res_type="json", method="get", body=new FormData(), is_json=false){
    let headers = {
                'Cookies': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            };
    if(is_json){
    headers = {
                'Cookies': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                "content-type": "application/json"
            }
    }
    return new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
            method: method,
            url: url,
            responseType:res_type,
            headers: headers,
            onload: function(response){
                var name=response.response;
                resolve(name);
            },
            data: body,
            onerror: function(response){
                console.log("请求失败");
            }
        })
    })

}

async function download_img(board_id, img_url){
    let img_res = await send_request(img_url, "blob");
    var img=new File([img_res],"1.jpeg");
    let fd = new FormData()
    fd.append("file", img)
    let file_res = await send_request("https://api.huaban.com/upload","json","post", fd)
    console.log(file_res);
    var raw = {
        "board_id": board_id,
        "pins": [
            {
                "file_id": file_res.id,
                "text": file_res.key
            }
        ]
    };
    var jsonString = JSON.stringify(raw);
    let success_res = await send_request("https://api.huaban.com/pins/batch","json","post", jsonString, true);
    console.log(success_res);
}

async function login(){
    let user_res = await send_request("https://api.huaban.com/users/me","json","get")
    if("username" in user_res){
        GM_setValue("name", user_res.username)
        return user_res.username
    }
    return '登录'
}

// 添加菜单代码
async function menu_init(){
    if(cookie){
        name = await login();
    }else{
        name = '登录'
    }
    var menu_html = "<style>\n" +
        "        #fixed-form {\n" +
        "            position: fixed;\n" +
        "            padding: 10px;\n" +
        "            background-color: #fff;\n" +
        "            border: 1px solid #ccc;\n" +
        "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
        "            z-index: 9999;\n"+
        "        }\n" +
        "\n" +
        "        #fixed-form label {\n" +
        "            font-weight: bold;\n" +
        "        }\n" +
        "\n" +
        "        #fixed-form input[type=\"text\"],\n" +
        "        #fixed-form select {\n" +
        "            width: 100%;\n" +
        "            padding: 5px;\n" +
        "            margin-bottom: 10px;\n" +
        "        }\n" +
        "\n" +
        "        #fixed-form button {\n" +
        "            background-color: #007bff;\n" +
        "            color: #fff;\n" +
        "            border: none;\n" +
        "            padding: 5px 10px;\n" +
        "            cursor: pointer;\n" +
        "        }\n" +
        "    </style>\n" +
        "<div id=\"fixed-form\">\n" +
        "        <form>\n" +
        "<label for=\"searchInput\">用户:</label>\n" +
         `<input type="button" id="huaban_login" value="${name}"><br>`+
        "<!--            <label for=\"searchInput\">输入收藏夹名:</label>-->\n" +
        "<!--            <input type=\"text\" id=\"huaban_login\" placeholder=\"输完点击其他地方\">-->\n" +
        "            <label for=\"fileSelect\">选择收藏夹:</label>\n" +
        "            <select id=\"fileSelect\">\n" +
        "                <option value=\"file1\">选择收藏夹</option>\n" +
        "            </select>\n" +
        "\n" +
        "            <button type=\"button\" id=\"submit\">采集</button>\n" +
        "            <button type=\"button\" id=\"close\">隐藏</button>\n" +
        "        </form>\n" +
        "    </div>"
    var newLIst = document.createElement("div");
    newLIst.id = "my-list";
    newLIst.style.display = 'none';
    //document.body.appendChild(newLIst);
    document.body.insertBefore(newLIst, document.body.firstChild);
    newLIst.innerHTML = menu_html
}

// 菜单显示控制
function menu_control(is_display, e) {
    let menu = document.querySelector('#my-list');
    let menu_inner = document.querySelector('#fixed-form');
    if(is_display){
        menu_inner.style.left = e.clientX + "px";
        menu_inner.style.top = e.clientY + "px";
        menu.style.display = 'block';

    }else{
        menu.style.display = 'none';
    }
}

//监听事件初始化
async function event_init(){
        let img_url = ""
        const boards = await send_request(last_boards,"json","get")
    // 点击图片关闭菜单
    document.onclick = function (e) {
        let target = e.target;
        if (target.nodeName === "IMG"){
            menu_control(false, e);
            }
        };
    // 右键点击图片显示菜单
    document.oncontextmenu = function (e) {
        let target = e.target
        let menu = document.querySelector('#fixed-form');
        menu.style.display = null;
        if (target.nodeName==="IMG"){
            img_url = target.src;
            e.preventDefault();
            menu_control(true, e)
            }
        };
    // 点击隐藏按钮关闭菜单
    document.getElementById("close").onclick = function (e) {
        console.log("隐藏")
            menu_control(false, e)
        }
    //显示收藏夹列表
    document.getElementById("fileSelect").onclick = function (e) {
        let select_option = ""
        for (var i = 0;i<boards.boards.length;i++){
            select_option += `<option value="${boards.boards[i].board_id}">${boards.boards[i].title}</option>\n`
        }
        if(!document.getElementById("fileSelect").size){
            document.getElementById("fileSelect").size = 4;
             document.getElementById("fileSelect").innerHTML = select_option;
        }else{
            document.getElementById("fileSelect").size = null
        }
    }
    //上传图片到收藏夹
    document.getElementById("submit").onclick = function (e) {
        let fileSelect = document.getElementById("fileSelect")
        var index = fileSelect.options.selectedIndex;
        console.log(index)
        if (fileSelect.options[index].value !== 'file'){
            let board_id = fileSelect.options[index].value;
             download_img(board_id, img_url);
            alert(`${img_url}上传 收藏夹${fileSelect.options[index].text}`)
            menu_control(false, e);
        }else{
            alert("请选择收藏夹")
        }
    }
    // 登录
    document.getElementById("huaban_login").onclick = function (e){
        let is_continue = false;
        if(location.href.search("https://huaban.com/") != -1){
            cookie = document.cookie;
            GM_setValue('cookie', cookie)
            login();
            location.reload();
            return;
        }
        if(cookie){
           is_continue = confirm("点击确认后可跳转花瓣页面，登录后再次点击此按钮即可更换账号")
        }else{
           is_continue =confirm("未检测到登录记录，点击确认后可跳转花瓣页面，登录后再次点击此按钮可生成登录记录")
        }
        if(is_continue || location.href.search("https://huaban.com/") == -1){
            location.href = "https://huaban.com/";
        }
    }
}