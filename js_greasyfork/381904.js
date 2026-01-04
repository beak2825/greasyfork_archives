// ==UserScript==
// @name         巴哈縮圖強化
// @namespace    http://tampermonkey.net/
// @version      0.7.43
// @description  狗才用預設縮圖= =
// @author       SmallYue1
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @match        https://forum.gamer.com.tw/post1.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/381904/%E5%B7%B4%E5%93%88%E7%B8%AE%E5%9C%96%E5%BC%B7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/381904/%E5%B7%B4%E5%93%88%E7%B8%AE%E5%9C%96%E5%BC%B7%E5%8C%96.meta.js
// ==/UserScript==

var Lists = [], Lists_Img = [], Lists_Content = [], 帳號 = [], 帳號小寫 = [], 勇者頭像 = [], 小屋連結 = [], 時間 = [], 人氣和互動 = [];
var zip, img, A_Download, Count_Text, Num_Of_Img_Text,Textarea,Clipboard,文章資訊卡,文章資訊卡_內容;

function 新增頁面點擊事件()
{
    document.getElementsByTagName("body")[0].onclick = function(e){
        if((e.target.parentNode.id != "PreView") && (e.target.className.indexOf("b-list__img") == -1) && (e.target.className.indexOf("video-btn_play") == -1) && (e.target.className.indexOf("video-mask") == -1))
        {
            document.getElementById("PreView").outerHTML = "";
        }
    };
}

function 縮圖強化()
{
    var Match = document.getElementsByTagName('tr');
    刪除行及初始設定(Match);
    for(var i = 0; i < Lists.length; i++)
    {
        版面設定(Lists[i],Lists_Img[i],Lists_Content[i]);
        製作文章資訊卡(Lists[i],帳號[i],勇者頭像[i],小屋連結[i],時間[i],人氣和互動[i]);
        覆寫縮圖(Lists_Img[i]);
        文章資訊卡.setAttribute("style","float:left;width:160px;margin-top:5px;margin-bottom:5px;padding-top:"+((文章資訊卡.parentNode.offsetHeight)-((文章資訊卡.offsetHeight+10)))/2+"px;");
        文章資訊卡.parentNode.setAttribute("style","height:"+文章資訊卡.parentNode.offsetHeight+"px;");
    }
}

function 刪除行及初始設定(Match)
{
    for(var i = 0; i < Match.length; i++)
    {
        if(Match[i].className.indexOf('b-list__head') != -1)
        {
            for(var j = Match[i].children.length-1; j >0 ; j--)
            {
                Match[i].removeChild(Match[i].children[j]);
            }
        }
        if(Match[i].className.indexOf('b-list__row') != -1)
        {
            if(Match[i].children.length > 2)
            {
                初始設定(Match[i]);
            }
        }
    }
}

function 初始設定(列)
{
    var Tempt;
    Lists.push(列);
    帳號.push(列.children[2].children[1].innerText);
    帳號小寫.push(帳號[帳號.length-1].toLowerCase());
    Tempt = 帳號小寫[帳號小寫.length-1];
    勇者頭像.push("https://avatar2.bahamut.com.tw/avataruserpic/"+Tempt.split("")[0]+"/"+Tempt.split("")[1]+"/"+Tempt+"/"+Tempt+"_s.png");
    小屋連結.push("https://home.gamer.com.tw/homeindex.php?owner="+帳號[帳號.length-1]);
    時間.push(列.children[3].children[0].innerText);
    人氣和互動.push(列.children[2].children[0].innerText);
    if((列.className.indexOf('b-list__row--sticky') == -1) && (列.className.indexOf('is-del') == -1) && (列.className.indexOf('b-imglist-item') != -1))
    {
        Lists_Img.push(列.children[1].children[0].children[0]);
        Lists_Content.push(列.children[1].children[0].children[1]);
    }
    else
    {
        Lists_Img.push("");
        Lists_Content.push("");
        if(列.className.indexOf('is-del') != -1)
        {
            if(列.children[1].children[0].childElementCount == 0)
            {
                列.children[1].children[1].setAttribute('style','display:inline-block;max-width:657px;margin-top:10px');
                列.children[1].removeChild(列.children[1].children[0]);
            }
            else
            {
                列.children[1].children[0].children[1].setAttribute('style','display:inline-block;max-width:657px;margin-top:10px');
                列.children[1].children[0].removeChild(列.children[1].children[0].children[0]);
            }
        }
    }
    if(列.children[0].children[2] === undefined)
    {
        var Node_Span = document.createElement('span');
        Node_Span.setAttribute('class','b-list__summary__gp b-gp b-gp--normal');
        Node_Span.append("0");
        列.children[0].appendChild(Node_Span);
    }
    for(var k = 列.children.length-1; k > 1; k--)
    {
        列.removeChild(列.children[k]);
    }
}

function 版面設定(列,縮圖,文字)
{
    var Tempt;
    var New_div1 = document.createElement('div');
    var New_div2 = document.createElement('div');
    if((列.className.indexOf('b-list__row--sticky') == -1) && (列.className.indexOf('is-del') == -1) && (列.className.indexOf('b-imglist-item') != -1))
    {
        文字.className="";
        文字.parentNode.setAttribute('style','text-decoration:none;');
        文字.setAttribute('style','display:block;margin-top:5px;margin-right:20px;');
        New_div1.setAttribute('style','display:inline-block;max-width:657px;margin-top:5px');
        New_div2.appendChild(文字.parentNode);
        New_div1.appendChild(New_div2);
        New_div1.appendChild(縮圖);
        列.children[1].appendChild(New_div1);
        if(文字.childElementCount > 1)
        {
            文字.children[1].setAttribute('style','margin:5px;margin-left:10px;margin-right:25px;');
        }

    }
}

function 製作文章資訊卡(列,帳號,勇者頭像,小屋連結,時間,人氣和互動)
{
    文章資訊卡 = document.createElement('div');
    文章資訊卡_內容 = document.createElement('a');
    列.children[1].className="";
    列.children[1].prepend(文章資訊卡);
    文章資訊卡.appendChild(文章資訊卡_內容);
    文章資訊卡.setAttribute("class","TOP-my");
    文章資訊卡_內容.outerHTML =`
            <a class="topbar_member-home" href="${小屋連結}" target="_blank" style="text-align:center;color: #117096;display:inline-block;width:100%">
                <div class="nav-member_imgbox">
                    <img src="${勇者頭像}">
                </div>
                ${帳號}
            </a>
            <p style="text-align:center;font-size:13px">
                ${時間}
            </p>
            <p style="text-align:center;font-size:11px; color:gray;">
                互動: ${人氣和互動.split("/")[0]} 人氣: ${人氣和互動.split("/")[1]}
            </p>`;
}

function 覆寫縮圖(縮圖)
{
        if(縮圖 !== "")
        {
            if(縮圖.dataset.thumbnail != undefined)
            {
                縮圖.setAttribute('style','margin-top:5px;margin-left:10px;margin-bottom:10px;background-image:url("'+縮圖.dataset.thumbnail+'");');
                縮圖.className = 'b-list__img';
                if(縮圖.dataset.thumbnail.indexOf("ytimg") != -1)
                {
                    縮圖.onclick = function() {
                        var New_div = document.createElement('div');
                        var New_Iframe = document.createElement('iframe');
                        New_Iframe.src = "https://www.youtube.com/embed/"+this.dataset.thumbnail.split('/')[4];
                        New_div.setAttribute('style','background-image:url("https://p2.bahamut.com.tw/HOME/cssimg/25/smallyue1_A_7.PNG?v=1567059486");display:flex;align-items:center;justify-content:center;top:76px;bottom:0px;width:100%;position:fixed;z-index:1;overflow:auto;');
                        New_Iframe.setAttribute('style','width:90%;height: 90%;');
                        New_Iframe.setAttribute('allowfullscreen','');
                        New_div.appendChild(New_Iframe);
                        New_div.setAttribute("id","PreView");
                        document.body.prepend(New_div);
                    };
                }
                else
                {
                    縮圖.onclick = function() {
                        var New_div = document.createElement('div');
                        var New_Img = document.createElement('img');
                        New_Img.src = this.dataset.thumbnail.split("?")[0];
                        New_div.setAttribute('style','background-image:url("https://p2.bahamut.com.tw/HOME/cssimg/25/smallyue1_A_7.PNG?v=1567059486");display:flex;align-items:center;justify-content:center;top:76px;bottom:0px;width:100%;position:fixed;z-index:1;overflow:auto;');
                        New_Img.setAttribute('style','max-width:95%;max-height:95%;');
                        New_div.appendChild(New_Img);
                        New_div.setAttribute("id","PreView");
                        document.body.prepend(New_div);
                    };
                }
            }
            else
            {
                縮圖.outerHTML = "";
            }
        }
}

function 設定對優質門寶具()
{
    var Tool_Bar = document.getElementById('BH-menu-path');
    A_Download = document.createElement('a');
    Count_Text = document.createElement('a');
    Num_Of_Img_Text = document.createElement('a');
    var Li_A_Download = document.createElement('li');
    Li_A_Download.appendChild(A_Download);
    A_Download.append("對優質門寶具");
    A_Download.onclick = 對優質門寶具;
    A_Download.setAttribute("id","A_Download");
    Count_Text.append("0");
    Count_Text.setAttribute("id","Count");
    Num_Of_Img_Text.append("0");
    Num_Of_Img_Text.setAttribute("id","Num_Of_Img");
    if(Tool_Bar !== null)
    {
        Tool_Bar.children[0].appendChild(Li_A_Download);
        document.body.appendChild(Count_Text);
        document.body.appendChild(Num_Of_Img_Text);
    }
}

function 對優質門寶具()
{
    zip = new JSZip();
    zip.file(document.title.replace(/\//g,"_") +".url", "[InternetShortcut]\n" +"URL="+location.href);
    img = zip.folder("images");
    var Match_Imgs = document.getElementsByTagName('img');
    DownloadImage(Match_Imgs);
}

function DownloadImage(Match_Imgs)
{
    var xhr = [];
    for(var i = 0; i < Match_Imgs.length; i++)
    {
        if((Match_Imgs[i].getAttribute("data-src") != null) && ((Match_Imgs[i].className.indexOf('lazyloaded') != -1) || (Match_Imgs[i].className.indexOf('lazyload') != -1)) && ((Match_Imgs[i].getAttribute("data-src").indexOf("bahamut") == -1) || ((Match_Imgs[i].getAttribute("data-src").indexOf("truth") != -1) && (Match_Imgs[i].getAttribute("data-src").indexOf("bahamut") != -1))))
        {
            Num_Of_Img_Text.innerText = parseInt(Num_Of_Img_Text.innerText) + 1;
            xhr.push(new XMLHttpRequest());
            xhr[i].responseType = 'blob';
            xhr[i].MURL = Match_Imgs[i].getAttribute("data-src");
            xhr[i].onload = function () {
                Count_Text.innerText = parseInt(Count_Text.innerText) + 1;
                A_Download.innerText = "下載 "+Count_Text.innerText+" 張圖片中";
                Check_For_Duplicate_Names(this.responseURL.split("/")[this.responseURL.split("/").length-1].split("?")[0], this.response, 0);
            };
            xhr[i].onerror = function () {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    if(this.statusText == "OK")
                    {
                        Count_Text.innerText = parseInt(Count_Text.innerText) + 1;
                        A_Download.innerText = "下載 "+Count_Text.innerText+" 張圖片中";
                        Check_For_Duplicate_Names(this.responseURL.split("/")[this.responseURL.split("/").length-1].split("?")[0], this.response, 0);
                    }
                    else if(this.statusText == "Too Many Requests")
                    {
                        alert('檔案 '+this.responseURL.split("/")[this.responseURL.split("/").length-1].split("?")[0]+' 下載失敗:過多請求，請稍後再試。');
                        Num_Of_Img_Text.innerText = parseInt(Num_Of_Img_Text.innerText) - 1;
                    }
                    else
                    {
                        Num_Of_Img_Text.innerText = parseInt(Num_Of_Img_Text.innerText) - 1;
                    }
                };
                xhr.open("GET", "https://cors-anywhere.herokuapp.com/"+this.MURL);
                xhr.send(null);
            };
            xhr[i].open("GET", Match_Imgs[i].getAttribute("data-src"));
            xhr[i].send(null);
        }
        else
        {
            xhr.push("");
        }
    }
    setTimeout(function(){Check();},1000);
    console.log("done");
}

function Check()
{
    if(parseInt(Num_Of_Img_Text.innerText) == parseInt(Count_Text.innerText))
    {
        Package();
    }
    else
    {
        setTimeout(function(){Check();},1000);
    }

}

function Check_For_Duplicate_Names(name, response, count)
{
    if(count == 0)
    {
        if(img.file(name) == null)
        {
            img.file(name, response);
        }
        else
        {
            Check_For_Duplicate_Names(name, response, count + 1);
        }
    }
    else
    {
        if(img.file(name.split(".")[0] + "(" + count + ")." + name.split(".")[1]) == null)
        {
            img.file(name.split(".")[0] + "(" + count + ")." + name.split(".")[1], response);
        }
        else
        {
            Check_For_Duplicate_Names(name, response, count + 1);
        }
    }
}

function Package()
{
    if(parseInt(Count_Text.innerText) !== 0)
    {
        zip.generateAsync({type:"blob",compression:"STORE"}, function updateCallback(metadata) {
            A_Download.innerText = "封裝進度： " + metadata.percent.toFixed(2) + " %";
        }).then(function(content) {
            saveAs(content, document.title.replace(/\//g,"_") + ".zip");
            A_Download.innerText = "共下載了 "+Count_Text.innerText+" 張圖片";
            Count_Text.setAttribute("style","visibility:hidden;");
        });
    }
    else
    {
        A_Download.innerText = "沒有符合域名的圖片";
    }
}

function Pixiv轉pixivcat代理()
{
    const iframeWindow = document.getElementsByTagName('iframe')[0].contentWindow;
    Textarea = iframeWindow.document.getElementsByTagName("body");
    Clipboard = document.createElement('a');
    Clipboard.innerText = "";
    Clipboard.setAttribute("id","Clipboard");
    document.body.appendChild(Clipboard);
    iframeWindow.addEventListener('paste', function(e){
        if(this.document.hasFocus())
        {
            var paste = e.clipboardData.getData("text/plain");
            Clipboard.innerText = paste;
            setTimeout(()=>{
                Clipboard.innerText = "";
            },1000)
        }
    }, false);
    Textarea[0].addEventListener('input',function(e){
        if(this.innerHTML.indexOf("pximg.net") != "-1")
        {
            this.innerHTML = this.innerHTML.replace(/pximg.net/g,"pixiv.cat");
        }
        else if(this.innerHTML.indexOf("www.pixiv.net") != "-1")
        {
            setTimeout(()=>{
                var Tempt = Clipboard.innerText.split("/");
                Tempt = Tempt[Tempt.length-1];
                var Tempt_A = this.getElementsByTagName('a');
                for(var i = 0; i < Tempt_A.length; i++)
                {
                    if((Tempt_A[i].innerText.indexOf(Tempt) != -1) && (Tempt_A[i].innerText == Clipboard.innerText) && (Tempt_A[i].innerText != ""))
                    {
                        Tempt_A[i].outerHTML = '<img id = "'+Tempt+'" src = "https://pixiv.cat/'+Tempt+'.jpg">';
                        var Tempt_Img = this.getElementsByTagName("img");
                        for(var j = 0; j < Tempt_Img.length; j++)
                        {
                            if(Tempt_Img[j].id == Tempt)
                            {
                                Tempt_Img[j].onerror = function(){
                                    var tempt = this.src;
                                    tempt = tempt.split("/");
                                    tempt = tempt[tempt.length-1];
                                    tempt = tempt.split(".")[0];
                                    this.src = "https://pixiv.cat/"+tempt+"-1.jpg";
                                }
                            }
                        }
                    }
                }
            },10);
        }
    }, false);
}

(function() {
    'use strict';
    if(location.pathname.indexOf("B.php") != -1)
    {
        新增頁面點擊事件();
        縮圖強化();
    }
    else if((location.pathname.indexOf("C.php") != -1) || (location.pathname.indexOf("Co.php") != -1))
    {
        設定對優質門寶具();
    }
    else if(location.pathname.indexOf("post1.php") != -1)
    {
        Pixiv轉pixivcat代理();
    }
})();