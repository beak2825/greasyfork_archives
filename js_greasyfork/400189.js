// ==UserScript==
// @name         1024社区收藏夹
// @namespace    http://tampermonkey.net/
// @version      1.43
// @description  为社区帖子添加一个本地收藏夹，支持导入导出功能。支持图片批量下载。该插件在手机端几乎可以用网页替代社区客户端。支持手机和电脑浏览器Tampermonkey、暴力猴。
// @author       niuhe
// @include      http://*/htm_data/*
// @match        https://*/htm_data/*
// @match        http://*/htm_mob/*
// @match        https://*/htm_mob/*
// @match        http://*/profile.php?action=favor
// @match        https://*/profile.php?action=favor
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_listValues
// @grant   GM_setClipboard
// @grant   GM_download
// @grant   GM_deleteValue
// @grant   GM_info
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/400189/1024%E7%A4%BE%E5%8C%BA%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/400189/1024%E7%A4%BE%E5%8C%BA%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

//为了和手机格式统一，url一律以http://**/htm_mob/格式保存





const DAT_EVENT_IMPORT = "dat_import";
const DAT_EVENT_RECORD = "dat_record";
const DAT_EVENT_STATUS = "dat_status";
const SEP_TAG = "<:separator;>"

var url_base = "http://**/htm_mob/"
var url = document.URL
var url_array = document.URL.split("/")
//CSS选择器
var biaoti_selector = ""
var bankuai_selector = ""
var image_selector = ""
var tag_loc = ""
//UA是否是手机端
var mobile = IsMob()
//用几个标识符来判断页面是收藏页/主题帖（手机）/主题帖（PC）

var is_collection_page = (document.URL.split("/").pop() == "profile.php?action=favor")
var is_htm_mob = (url_array[3] == "htm_mob")
var is_htm_data = (url_array[3] == "htm_data")


url_array[2] = "**"
url_array[3] = "htm_mob"
url = url_array.join("/")

var time1 = TimeFormat();
var biaoti = ""
var bankuai = ""


//获取主题帖标题和板块信息
if (is_collection_page == false)
{
    console.log("I am getting bankuai info")
    if (is_htm_mob)
    {
        biaoti_selector = "#main > div.f18"
        bankuai_selector = "#header > table > tbody > tr > td > h3"
        tag_loc = "h guide"
    }
    if (is_htm_data)
    {
        biaoti_selector = "#main > div:nth-child(4) > table > tbody > tr.tr1.do_not_catch > th:nth-child(2) > table > tbody > tr > td > h4"
        bankuai_selector = "#main > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > b > a:nth-child(2)"
        tag_loc = 'tiptop'
    }
    biaoti = document.querySelector(biaoti_selector).textContent
    if (is_htm_mob)
    {
        var a = document.querySelector(biaoti_selector).innerText
        biaoti = a.substr(0,a.length-4)

    }
    bankuai = document.querySelector(bankuai_selector).textContent
    console.log("biaoti" + biaoti)
}


var key = url_array.slice(4,7).join("/")
var content = biaoti + " " + bankuai + SEP_TAG + url + SEP_TAG + time1
//console.log(content)


document.addEventListener(DAT_EVENT_IMPORT, function (e) {
    //Custom event after CSV import
    alert("导入成功，刷新页面查看")

});


document.addEventListener(DAT_EVENT_STATUS, function (e) {
    // Custom event on set status
	alert("导入成功，已和本地收藏合并");
});

//默认设置cookie的path是根目录
function setCookie ( name, value, expdays, path="/" )
{
    var expdate = new Date();
    //设置Cookie过期日期
    expdate.setDate(expdate.getDate() + expdays) ;
    //添加Cookie
    document.cookie = name + "=" + escape(value) + ";expires=" + expdate.toUTCString() + ";path="  + path;
    console.log("set cookie success")
}


function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
  return result ? result.pop() : ""
}

//清除所有cookie函数
function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}


function IsMob() {
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad", "iPod"];
			var flag = false;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = true;
					break;
				}
			}
			return flag;
        }


//手机和PC自适应，并重定向页面
function Set_Cookie()
{
     if (mobile)
    {
        let is_mob= getCookieValue("ismob")
        if (is_mob != "1")
        {
            setCookie("ismob","1",360)
            console.log(" Mob cookie changed")
        }
        else
        {
            console.log(" Mob cookie not changed")
        }

    }
    else
    {
        let is_mob= getCookieValue("ismob")
        if (is_mob == "1")
        {
            setCookie("ismob","0",360)
            console.log(" PC cookie changed,Redirect Page")
        }
        else
        {
            console.log(" PC cookie not  changed")
        }

    }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function TimeFormat() {
    var fmt = "yyyy-MM-dd hh:mm:ss"
    var myDate = new Date();
    var o = {
        "M+": myDate.getMonth() + 1, //月份
        "d+": myDate.getDate(), //日
        "h+": myDate.getHours(), //小时
        "m+": myDate.getMinutes(), //分
        "s+": myDate.getSeconds(), //秒
        "q+": Math.floor((myDate.getMonth() + 3) / 3), //季度
        "S": myDate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}

function Collecte(){
        if (mobile == true)
        {
            var tmp = document.createElement("text")
            tmp.textContent = "|"
            document.getElementsByClassName(tag_loc)[0].appendChild(tmp)
        }
    var a = document.createElement('a');
    //a.href = 'data:application/dat;charset=utf-8,' + encodeURIComponent(data);
    //supported by chrome 14+ and firefox 20+
    //a.download = 'favorite.dat';
    if ("none" == GM_getValue(key,"none"))
    {
        a.text = " 收藏 "
        a.style = "color:#2F5FA1;"
    }
    else
    {
        a.text = " 已收藏 "
        a.style = "color:#FF0000;"
    }

    document.getElementsByClassName(tag_loc)[0].appendChild(a);

    a.addEventListener("click", function (value) {
            if (a.text == " 收藏 ")
            {
                GM_setValue(key,content);
                a.text = " 已收藏 "
                a.style = "color:#FF0000;"

            }
            else
            {
                GM_deleteValue(key);
                a.text = " 收藏 "
                a.style = "color:#2F5FA1;"
            }
			//alert("添加收藏成功\n\n" + content)
        });
}

function Export_Collection(data){
    if (mobile == true)
    {
        var tmp = document.createElement("text")
        tmp.textContent = "|"
        document.getElementsByClassName(tag_loc)[0].appendChild(tmp)
    }
    var keys = GM_listValues()
    var a = document.createElement('a');
    //supported by chrome 14+ and firefox 20+
    a.download = 'favorite.dat';
    a.text = " 導出 "
    //needed for firefox
    document.getElementsByClassName(tag_loc)[0].appendChild(a);
    a.addEventListener("click", function (value) {
            var keys = GM_listValues()
            var data = []
            for(var i = 0, len = keys.length; i < len; i++){
                data.push(GM_getValue(keys[i]))
            }
            data = data.join("\n")
            a.href = 'data:application/dat;charset=utf-8,' + encodeURIComponent(data);
			alert("导出成功")
        });
}

function Gen_Input()
{
    let input = document.createElement("input");
    input.type = "file";
    input.accept=".dat"
    Object.assign(input.style, {
        position: "relative"
    });
    input.addEventListener("input", function (value) {
        let reader = new FileReader();
        reader.readAsText(value.target.files[0]);
        reader.onload = function () {
            var dat_array = reader.result.split("\n")
            for (var k = 0 ,len2 = dat_array.length; k < len2;k++)
            {
                GM_setValue(Gen_Key(dat_array[k]),dat_array[k])
            }
            document.dispatchEvent(new Event(DAT_EVENT_IMPORT))
        };
    });
    return input
}


function Import_Collection(){
    if (mobile == true)
    {
        var tmp = document.createElement("text")
        tmp.textContent = "|"
        document.getElementsByClassName(tag_loc)[0].appendChild(tmp)
    }
    var a = document.createElement('a');
    //supported by chrome 14+ and firefox 20+
    a.download = 'favorite.dat';
    a.text = " 導入 "
    //needed for firefox
    document.getElementsByClassName(tag_loc)[0].appendChild(a);
    var input = Gen_Input()
    document.getElementsByClassName(tag_loc)[0].appendChild(input);

}


async function downloader(image_urls) {
  console.log('start downloading');

  // Sleep in loop
   for(var img = 1, length1 = image_urls.length; img <= length1; img++){
       var extension = image_urls[img-1].split(".").pop()
       GM_download(image_urls[img-1], biaoti + "[" + img + "]." + extension)
       console.log("Download Image" + img)
       await sleep(2000)
   }
  await sleep(2000);
}

function Download_Pics()
{
     if (mobile == true)
     {
         var tmp = document.createElement("text")
         tmp.textContent = "|"
         document.getElementsByClassName(tag_loc)[0].appendChild(tmp)
     }
     var a = document.createElement('a');
    //supported by chrome 14+ and firefox 20+
    a.text = " 下載 "
    //needed for firefox
    document.getElementsByClassName(tag_loc)[0].appendChild(a);
    a.addEventListener("click", async function (value) {
            var images = null
            var image_urls = []
            if (mobile == true)
            {
                images = document.querySelector(".tpc_cont").getElementsByTagName("img")
            }
            else
            {
                images = document.querySelector(".tpc_content").getElementsByTagName("img")
            }
            for(var i = 0, len = images.length; i < len; i++){
                image_urls.push(images[i].src)
            }
            var result = image_urls.join("\n")
            GM_setClipboard(result)
			var info = confirm("已复制" + image_urls.length + "张图片链接到粘贴板，现在下载吗？")
            if (info == true)
            {
                await downloader(image_urls)
            }

        });

}


function Gen_Key(value)
{
    var url = value.split("<:separator;>")[1]
    var url_array = url.split("/")
    var key = url_array.slice(4,7).join("/")
    return key
}

function Gen_Node(index,key,row_base,value) //
{
    var tmp = value.split("<:separator;>")
    var time = tmp[2]

    var tmp_url = tmp[1]
    tmp_url = tmp_url.replace(/\*\*/, document.URL.split("/")[2])
    tmp_url = tmp_url.replace(/htm_mob/, "htm_data")
    var tmp_str = tmp[0].split(" ")
    var tmp_bankuai = tmp_str.pop()
    var tmp_biaoti = tmp_str.join(" ")
    var tmp_node = row_base.cloneNode(true)
    tmp_node.className = "tr3"
    tmp_node.children[0].innerText = index
    tmp_node.children[1].innerText = tmp_biaoti
    tmp_node.children[1].setAttribute("onclick","window.open('" + tmp_url + "');")
    tmp_node.children[2].innerText = tmp_bankuai
    tmp_node.children[3].innerText = time
    tmp_node.children[4].innerText = "删除"
    tmp_node.children[4].setAttribute("index",index)
    tmp_node.children[4].setAttribute("align","center")
    tmp_node.children[4].onclick = function()
    {
        if (tmp_node.children[4].innerText == "删除")
            {
               tmp_node.remove()
               GM_deleteValue(key);

            }
    };
    return tmp_node
}

//Gen node for mobile
function Gen_Mob_Node(index,key,row_base,value) //
{
    var tmp = value.split("<:separator;>")
    var time = tmp[2]

    var tmp_url = tmp[1]
    tmp_url = tmp_url.replace(/\*\*/, document.URL.split("/")[2])
    tmp_url = tmp_url.replace(/htm_data/, "htm_mob")
    var tmp_str = tmp[0].split(" ")
    var tmp_bankuai = tmp_str.pop()
    var tmp_biaoti = tmp_str.join(" ")
    var tmp_node = row_base.cloneNode(true)
    tmp_node.className = "tr3 tac"
    tmp_node.children[0].innerText = tmp_biaoti
    tmp_node.children[0].setAttribute("onclick","window.open('" + tmp_url + "');")
    tmp_node.children[1].innerText = "删除"
    tmp_node.children[1].setAttribute("index",index)
    tmp_node.children[1].setAttribute("align","center")
    tmp_node.children[1].onclick = function()
    {
        if (tmp_node.children[1].innerText == "删除")
            {
                GM_deleteValue(key);
                tmp_node.children[1].innerText = "已删除"
            }
    };
    return tmp_node
}


//time key
function extract_key_list()
{
    var keys = GM_listValues()
    var result = []
    var tmps = []
    for (var i=0 ,len1 = keys.length; i < len1; i++)
    {
        var tmp = []
        var bar = GM_getValue(keys[i])
        if (bar)
        {
            //time
            tmp.push(bar.split("<:separator;>").pop())
        }

        tmp.push(keys[i])
        tmps.push(tmp)
    }

    tmps.sort(function (a,b){return Date.parse(a[0]) < Date.parse(b[0]) ? 1 : -1;})
    console.log(tmps)
    for (var j=0 ,len2 = tmps.length; j < len2; j++)
    {
        result.push(tmps[j][1])
    }

    return result
}





function PC_Check_Collection()
{
    console.log("打开收藏夹")
    try
    {
        var father = document.getElementsByClassName("t")[2].getElementsByTagName("tr")
        }
    catch (err)
    {
        alert("需要登录才能查看/编辑收藏夹\n\n未登录状态只能进行添加/导入/导出操作\n\n收藏内容保存在本地，卸载脚本会丢失收藏夹，请及时导出备份！")
    }
    if (father.length > 2 )
    {
        for (var i= 2 ,len = father.length; i < len;i++)
        {
            father[i].remove()
        }
    }
    father[1].getElementsByTagName("td")[3].innerText = "時間"
    father[1].getElementsByTagName("td")[4].innerText = "操作"
    document.querySelector("#main > div:nth-child(3) > table > tbody > tr > td:nth-child(2) > form > center").remove()

    var row_base = father[1]


    var keys = extract_key_list()

    for(var j = 0, len1 = keys.length; j < len1; j++){
        var tmp_node = Gen_Node(j+1,keys[j] ,row_base, GM_getValue(keys[j]))
        father[1].parentElement.append(tmp_node)
    }
    var upload_entry = document.querySelector("#main > div:nth-child(3) > table > tbody > tr > td:nth-child(1) > form > div > table > tbody > tr:nth-child(4) > th")
    upload_entry.innerText = " 導入 "
    var input = Gen_Input()
    upload_entry.appendChild(input)
}

function Mob_Check_Collection()
{
    console.log("打开收藏夹")
    try
    {
        document.querySelector("#main > div:nth-child(3) > table > tbody > tr:nth-child(2) > td > form > center").remove()

        var father = document.getElementsByClassName("t")[2].getElementsByTagName("tr")
        }
    catch (err)
    {
        alert("需要登录才能查看/编辑收藏夹\n\n未登录状态只能进行添加/导入/导出操作\n\n收藏内容保存在本地，卸载脚本会丢失收藏夹，请及时导出备份！")
    }
    if (father.length > 1 )
    {
        for (var i= 1 ,len = father.length; i < len;i++)
        {
            father[i].remove()
        }
    }

    father[0].children[1].width = "15%"
    father[0].children[1].innerText = "操作"
    father[0].children[1].innerText.align="right"

    var row_base = father[0]


    var keys = extract_key_list()

    for(var j = 0, len1 = keys.length; j < len1; j++){
        var tmp_node = Gen_Mob_Node(j+1,keys[j] ,row_base, GM_getValue(keys[j]))
        father[0].parentElement.append(tmp_node)
    }

    document.getElementsByClassName("tr1")[0].parentNode.remove()

    var upload_entry = document.getElementsByClassName("tr1")[0].children[0]
    upload_entry.innerText = "導入   "

    var input = Gen_Input()
    upload_entry.appendChild(input)
}

(function() {
    'use strict';
    Set_Cookie()


    if (is_collection_page == false)
    {
        Collecte()
        if (bankuai == "新時代的我們" || bankuai == "達蓋爾的旗幟")
        {
            Download_Pics()
        }
        Export_Collection()
        Import_Collection()
        //Import_Collection()
        }
    else
    {


         if (mobile )
         {
            Mob_Check_Collection()
         }
         else
         {
            PC_Check_Collection()
         }
    }

})();