// ==UserScript==
// @name         导出最新世界羽联排名
// @namespace    https://weibo.com/guoxuebiji/profile?is_all=1
// @version      1.0
// @description  导出最新世界羽联排名(https://www.badmintoncn.com/ranking.php?type=6)
// @author       东风
// @date         2021-10-25
// @modified     2021-10-25
// @match        https://www.badmintoncn.com/ranking.php?type=*
// @license      BSD 3-Clause License
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/434500/%E5%AF%BC%E5%87%BA%E6%9C%80%E6%96%B0%E4%B8%96%E7%95%8C%E7%BE%BD%E8%81%94%E6%8E%92%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/434500/%E5%AF%BC%E5%87%BA%E6%9C%80%E6%96%B0%E4%B8%96%E7%95%8C%E7%BE%BD%E8%81%94%E6%8E%92%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //==========utils=====================================================================
    //加载css文件
    function addCSS(href) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = href;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    //加载js文件
    function addJS(src, cb, onerror ) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        console.log("addJS",script)
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = typeof cb === "function" ? cb : function () {};
        script.onerror = typeof onerror === "function" ? onerror : function () {};
    }

    // 加载css字符串
    function GMaddStyleString(css) {
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle);
    }

    function AddHtml(html) {
        document.body.insertAdjacentHTML('afterEnd', html);
    }


    
    // 改用ZUI //https://www.openzui.com/
    addJS("https://libs.baidu.com/jquery/2.0.0/jquery.min.js", function () {

        console.log("-------------------load jq-------------------")
        window.$ = $.noConflict();
        // addCSS("https://cdn.bootcdn.net/ajax/libs/zui/1.9.2/css/zui.min.css");
        // addJS("https://cdn.bootcdn.net/ajax/libs/zui/1.9.2/js/zui.min.js", function () {
        // addCSS("https://lib.baomitu.com/zui/1.9.2/css/zui.min.css");
        // addJS("https://lib.baomitu.com/zui/1.9.2/js/zui.min.js", function () {        

        // console.log("-------------------load bootcdn zui.min.js-------------------")

        // })

        addJS("https://lib.baomitu.com/xlsx/0.17.0/xlsx.full.min.js");
    });


    function GetFileName(url) {
        var Business=url.split("/");
        return Business[Business.length-1];
    }

    // String.prototype.TextFilter=function(){
    //     var pattern=new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]"); //[]内输入你要过滤的字符
    //     var rs="";
    //     for(var i=0;i<this.length;i++){
    //         rs+=this.substr(i,1).replace(pattern,'');
    //     }
    //     return rs;
    // }

    // 把空格和斜杠转换成下划线
    function Trim(str, limit)
    {
        // str = str.TextFilter()
        console.log(str)
        var result = str.replace(/\n+/g,"\/");
        // result = str.replace(/\s+/g," ");
        // result = result.replace(/\//g,"-");
        // result = result.replace(/\\/g,"_");
        // result = result.replace(/&/g,"-");
        // result = result.replace(/"/g,"");
        // result = result.replace(/:/g,"_");
        // result = result.replace(/\|/g,"_");
        if (limit) {
            result=result.substring(0,limit); 
        }
        console.log(result)
        return result;
    }

    // 去掉标题后缀
    function FormatTitle(str)
    {
        var title = Trim(document.title)
        var n = title.lastIndexOf(str);
        if (n >= 0) {
            title = title.substring(0,n);
        }
        return title;
    }   

    function ShowTips(str) {
        new $.zui.Messager(str, {
            type: 'success', // 定义颜色主题
            time:2000
        }).show();
    }
    function ShowDialog(str) {
        // (new $.zui.ModalTrigger({custom: str})).show();
        // console.log("ShowDialog"+str)
        alert(str)
    }

    //字符串是否包含子串
    function isContains(str, substr) {
        //str是否包含substr
        return str.indexOf(substr) >= 0;
    }

    // 把网页获取的对象转换成数组
    function objToArray(x) {
        var list = [];
        console.log(x)
        for (var i = 0; i < x.length; i++) {
            list[i] = x[i];
        }
        return list
    }

    // 补零
    function PrefixZero(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }

    // 文件加前缀
    function AddPreFilename(fileName, index, max) {
        var len = (max+"").length
        return "P"+PrefixZero(index,len)+"."+fileName
    }    



    function WebGet(url, success) {
        jQuery.ajax({
            url: url,
            async: false,
            success: success,
            omplete: function (data) {
                if (data.status === 200) {
                }
                else {
                    ShowTips("系统错误:暂时无法连接服务器")
                }
            }
        });
    }

    function DownloadTxt(text, fileType, fileName) {
        var blob = new Blob([text], { type: fileType });

        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
    }

// csv转sheet对象
function csv2sheet(csv) {
    var sheet = {}; // 将要生成的sheet
    csv = csv.split('\n');
    csv.forEach(function(row, i) {
        console.log(row, i)
        row = row.split(',');
        if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
        row.forEach(function(col, j) {
            sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
        });
    });
    return sheet;
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName)
{
    if(typeof url == 'object' && url instanceof Blob)
    {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else
    {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

// 传入csv，执行后就会弹出下载框
function exportExcel(csv) {
    var sheet = csv2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, '导出.xlsx')
}



    //===============================================================================
    function Table2Array(d) {   
        var ranktable = d.getElementsByClassName("ranktable")[0].children[0].children
        // console.log("ranktable = ", ranktable)
        var table = [["排名","国家/地区","球员","升/降","积分"]]
        for (var i = 1; i < ranktable.length; i++) {
            var arr = []
            var item = ranktable[i].getElementsByTagName("td");
            // console.log(i, item)

            // 获取队员名字
            var players = item[2].getElementsByClassName("player")
            var str = ""
            for (var index = 0; index < players.length; index++) {
                if (index > 0) {str = str + "/"}
                str = str + players[index].innerText.replace(/\n+/g," ")
            }

            arr[0] = parseInt(item[0].innerText)//排名
            arr[1] = item[1].getElementsByClassName("country")[0].innerText//国家
            arr[2] = str //运动员
            arr[3] = parseInt(item[3].innerText)?parseInt(item[3].innerText):""//排名变化  //<img src="/cbo_star/images/arrow-up.png">
            arr[4] = parseInt(item[4].innerText)//积分

            if (item[3].getElementsByTagName("img").length>0) {
                var src = item[3].getElementsByTagName("img")[0].src
                if (isContains(src, "arrow-down.png")) {
                    arr[3] = -arr[3] //排名下降
                }
                
            }
            table[i] = arr

            // console.log(item, item.getElementsByTagName("td"))
            
        }
        // console.log(table)
        return table
    }
    function ParseUrl() {
        // var table = Table2Array(document)
        // console.log(table)

        // if (true) {return}
        var names = ["男子单打","女子单打","男子双打","女子双打","混合双打"]
        var workbook = {
            SheetNames: names,
            Sheets: {}
        };
        
        function DownloadHtml(url, sheetName) {
            WebGet(url, function(res){
                    // var sheetName = names[6-i]
                    console.log("加载网页", sheetName)
                    // console.log(res)
                    var doc = (new DOMParser()).parseFromString(res, "text/html")
                    // console.log(doc)
                    var table = Table2Array(doc)
                    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(table);;
                })
        }

        for (var i = 6; i <= 10; i++) {
            DownloadHtml("https://www.badmintoncn.com/ranking.php?type="+i, names[i-6])
        }


        // 生成excel的配置项
        var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
        // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        var filename = document.getElementsByClassName("title")[0].innerText
        openDownloadDialog(blob, filename+'.xlsx');

// var aoa = [
//     ['主要信息', null, null, '其它信息'], // 特别注意合并的地方后面预留2个null
//     ['姓名', '性别', '年龄', '注册时间'],
//     ['张三', '男', 18, 1],
//     ['李四', '女', 22, 1]
// ];
// var sheet = XLSX.utils.aoa_to_sheet(aoa);
// sheet['!merges'] = [
//     // 设置A1-C1的单元格合并
//     {s: {r: 0, c: 0}, e: {r: 0, c: 2}}
// ];
// openDownloadDialog(sheet2blob(sheet), '单元格合并示例.xlsx');
    }

    var isInit = 0;
    function DoInit() {

        // isInit ++;
        // if (isInit != 2 ) {return}
        // console.log("----------------DoInit-------------")
        var btn = document.getElementsByClassName("btnDownload")
        if (btn.length > 0) {
            return
        }

        GMaddStyleString(`#download_movie_box {cursor:pointer; position:fixed; top:` + 60 + `px; left:` + 0 + `px; width:0px; background-color:#2E9AFE; z-index:2147483647; font-size:20px; text-align:left;}
            #download_movie_box .item_text {width:28px; padding:4px 0px; text-align:center;}
            #download_movie_box .item_text img {width:35px; height:35px; display:inline-block; vertical-align:middle;}
            `);

        // var $ = $ || window.$;
        var ImgBase64Data = "data:image/png;base64,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"

        var html = 
        `<div id='download_movie_box' class="btnDownload">
            <div class='item_text'>
                <img src='`+ ImgBase64Data +`' title='下载视频' id="downloadVideos"/>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('afterEnd', html);

        document.getElementById("downloadVideos").onclick = function () {
            var urls = ParseUrl();
            // console.log("urls = ",urls)
            // if (urls) {
            //     Download(urls)
            // }
        };
    }
    /*
        主入口，分出不同模块：用户、画板，监听并刷新URL
    */
    window.onload =function() {
        DoInit()
    }

    // GM_setValue("mytset","mytset---------------------------")
    // console.log(GM_getValue("mytset"))
})();

