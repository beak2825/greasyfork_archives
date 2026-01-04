// ==UserScript==
// @name         CL社区收藏夹
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  为社区帖子添加一个本地收藏夹，支持导入导出功能。支持图片批量下载。支持手机和电脑浏览器Tampermonkey。
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
// @downloadURL https://update.greasyfork.org/scripts/400133/CL%E7%A4%BE%E5%8C%BA%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/400133/CL%E7%A4%BE%E5%8C%BA%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

//为了和手机格式统一，url一律以http://**/htm_mob/格式保存



const DAT_STORE = "dat_store";
const DAT_STATUS = "dat_status";

const DAT_EVENT_IMPORT = "dat_import";
const DAT_EVENT_RECORD = "dat_record";
const DAT_EVENT_STATUS = "dat_status";
const SEP_TAG = "<:separator;>"

var url_base = "http://**/htm_mob/"
var url = document.URL
var url_array = url.split("/")
var biaoti_selector = ""
var bankuai_selector = ""
var image_selector = ""
var tag_loc = ""
var mobile = false
var collection_page = false





if (mobile == false && document.URL.split("/").pop() == "profile.php?action=favor")
{
    collection_page = true
}

if (url_array[3] == "htm_mob")
{
    mobile = true
}
if (mobile == true)
{
    biaoti_selector = "#main > div.f18"
    bankuai_selector = "#header > table > tbody > tr > td > h3"
    tag_loc = "h guide"
}
else
{
    biaoti_selector = "#main > div:nth-child(4) > table > tbody > tr.tr1.do_not_catch > th:nth-child(2) > table > tbody > tr > td > h4"
    bankuai_selector = "#main > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > b > a:nth-child(2)"
    tag_loc = 'tiptop'

}
url_array[2] = "**"
url_array[3] = "htm_mob"
url = url_array.join("/")

var time1 = TimeFormat();
var biaoti = ""
var bankuai = ""

if (collection_page == false)
{
    biaoti = document.querySelector(biaoti_selector).textContent
    bankuai = document.querySelector(bankuai_selector).textContent
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
    a.text = " 收藏 "
    //needed for firefox
    document.getElementsByClassName(tag_loc)[0].appendChild(a);

    a.addEventListener("click", function (value) {
            GM_setValue(key,content)
			alert("添加收藏成功\n\n" + content)
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
    a.text = " 導出收藏 "
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
    a.text = " 導入收藏 "
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
			var info = confirm("已复制所有图片链接到粘贴板，现在下载吗？")
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
    tmp_node.className = "tr3 tac"
    tmp_node.children[0].innerText = index
    tmp_node.children[1].innerText = tmp_biaoti
    tmp_node.children[1].setAttribute("onclick","window.open('" + tmp_url + "');")
    tmp_node.children[2].innerText = tmp_bankuai
    tmp_node.children[3].innerText = time
    tmp_node.children[4].innerText = "删除"
    tmp_node.children[4].setAttribute("index",index)
    tmp_node.children[4].onclick = function()
    {
        if (true == confirm("确认删除？"))
            {
               tmp_node.remove()
               GM_deleteValue(key);

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


function Check_Collection()
{
    console.log("打开收藏夹")
    var father = document.getElementsByClassName("t")[2].getElementsByTagName("tr")
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
    upload_entry.innerText = "導入收藏"
    var input = Gen_Input()
    upload_entry.appendChild(input)
}



(function() {
    'use strict';
    if (collection_page == false)
    {
        Collecte()
        Export_Collection()
        Import_Collection()
        //Import_Collection()
        if (bankuai == "新時代的我們" || bankuai == "達蓋爾的旗幟")
        {
            Download_Pics()
     }}
    else
    {

         alert("需要登录才能查看/编辑收藏夹\n\n 未登录状态只能进行添加/导入/导出操作 \n\n收藏内容保存在本地，卸载脚本会丢失收藏夹，请及时导出备份！")

         Check_Collection()

    }

})();