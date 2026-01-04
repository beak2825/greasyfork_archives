// ==UserScript==
// @name         Emby Danmaku 适配4.8
// @namespace    http://tampermonkey.net/
// @license       MIT
// @version      3.2
// @description  为emby加载弹幕功能
// @author       Nc
// @include       *http://192.168.31.151:8097*
// @include       *emby.filexiazaiwr.work*
// @include       *emby.huoxingche.xyz*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant GM_setValue
// @grant GM_getValue
// @require https://cdn.jsdelivr.net/npm/danmaku@2.0.6/dist/danmaku.min.js
// @downloadURL https://update.greasyfork.org/scripts/452510/Emby%20Danmaku%20%E9%80%82%E9%85%8D48.user.js
// @updateURL https://update.greasyfork.org/scripts/452510/Emby%20Danmaku%20%E9%80%82%E9%85%8D48.meta.js
// ==/UserScript==
//指定Apikey
const api_key = "863114e5de954d02aff42a81bf213588";
//输入Nginx为媒体库指定的根目录，不包含最后的斜杠符号。如果布置在Windows路径中，请双写斜杠如下。
const MyMediaSource = "/mnt/8tb/NAS";
//全局控制变量
let CNDanmakuLoaded = false
let CNDanmakuShow = false
let JPDanmakuLoaded = false
let JPDanmakuShow = false
let DandanDanmakuLoaded = false
let DandanDanmakuShow = false
let Timeline = 0
let TimelineChange
let SearchUrl
let EpisodeIdSelected
let VideoIdSelected
let AbsoluteId
let DanmakuMedia
let DanmakuContainer
let DanmakuComment
let EmbyDanmaku
let Episode
let SearchResponse
let DandanDanmakuResponse
let EpisodeInfo
let MaxLimite
let NCmenu
let NCMenubutton
let bottomdisplay
let bottomdisplayflag = true
let globalAlpha
let MaxLimiteControlbutton
let Timelinenow
let globalAlphainput
//获取本地属性，包括最大弹幕数，全局透明度，是否关闭底部弹幕
if (GM_getValue("DanmakuMax")) {
    MaxLimite = GM_getValue("DanmakuMax")
} else {
    MaxLimite = 5000
}
if (GM_getValue("globalAlpha")) {
    globalAlpha = GM_getValue("globalAlpha")
} else {
    globalAlpha = 1.0
}
if (GM_getValue("bottomdisplayflag")) {
    bottomdisplay = (GM_getValue("bottomdisplayflag")) ? "是" : "否";
} else {
    bottomdisplay = "是";
}
//每秒循环执行以添加有关弹幕功能的button
let DanmakuButtonTimer = setInterval(function () {
    let ButtonShowornot = document.querySelectorAll("button[id='CNDanmaku']")[0];
    if (!ButtonShowornot) {
        let EmbyButtonHtmlLocate = document.querySelectorAll("div[class='flex flex-shrink-zero justify-content-flex-end flex-wrap-wrap videoOsdBottom-buttons-right videoOsd-hideWithOpenTab videoOsd-hideWhenLocked']")[0];
        if (EmbyButtonHtmlLocate) {
            let EmbyButtonHtml = `
            <button is="paper-icon-button-light" id="NCMenubutton" title="弹幕显示设置"><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" fill="#ffffff"/></svg></button>
            <button is="paper-icon-button-light" id="CNDanmaku" title="站点保存的中文弹幕，可能来自B站或巴哈"><svg width="32" height="37" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
            <path d="m10.82036,12.19853l24,0l0,24l-24,0l0,-24z" fill="none" id="svg_1"/>
            <path d="m28.40341,4.961566l-24.80682,0c-1.70547,0 -3.10085,1.42625 -3.10085,3.16944l0,28.52502l6.2017,-6.33889l21.70597,0c1.70547,0 3.10085,-1.42625 3.10085,-3.16945l0,-19.01668c0,-1.74319 -1.39538,-3.16944 -3.10085,-3.16944zm0,22.18612l-21.70597,0l-3.10085,3.16945l0,-22.18613l24.80682,0l0,19.01668z" id="svg_2" stroke-width="0" stroke="null"/>
            <text fill="#ffffff" stroke-width="0" x="25.5" y="50.5" id="svg_3" font-size="17" font-family="Helvetica, Arial, sans-serif" text-anchor="start" xml:space="preserve" transform="matrix(1.1531181102140113,0,0,0.953833008591058,-23.288060590480598,-24.810932552679002) " stroke="null" font-weight="bold">中</text>
            </svg></button>
            <button is="paper-icon-button-light" id="JPDanmaku" title="站点保存的日文弹幕弹幕，可能来自nico或himawari"><svg width="32" height="37" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
            <path d="m10.82036,12.19853l24,0l0,24l-24,0l0,-24z" fill="none" id="svg_1"/>
            <path d="m28.40341,4.961566l-24.80682,0c-1.70547,0 -3.10085,1.42625 -3.10085,3.16944l0,28.52502l6.2017,-6.33889l21.70597,0c1.70547,0 3.10085,-1.42625 3.10085,-3.16945l0,-19.01668c0,-1.74319 -1.39538,-3.16944 -3.10085,-3.16944zm0,22.18612l-21.70597,0l-3.10085,3.16945l0,-22.18613l24.80682,0l0,19.01668z" id="svg_2" stroke-width="0" stroke="null"/>
            <text fill="#ffffff" stroke-width="0" x="25.5" y="50.5" id="svg_3" font-size="17" font-family="Helvetica, Arial, sans-serif" text-anchor="start" xml:space="preserve" transform="matrix(1.1531181102140113,0,0,0.953833008591058,-23.288060590480598,-24.810932552679002) " stroke="null" font-weight="bold">日</text>
            </svg></button>
            <button is="paper-icon-button-light" id="DandanDanmaku" title="DandanPlay弹幕库弹幕，首次点击将自动进行匹配。目前尚未匹配Dandan弹幕"><svg width="32" height="37" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
            <path d="m10.82036,12.19853l24,0l0,24l-24,0l0,-24z" fill="none" id="svg_1"/>
            <path d="m28.40341,4.961566l-24.80682,0c-1.70547,0 -3.10085,1.42625 -3.10085,3.16944l0,28.52502l6.2017,-6.33889l21.70597,0c1.70547,0 3.10085,-1.42625 3.10085,-3.16945l0,-19.01668c0,-1.74319 -1.39538,-3.16944 -3.10085,-3.16944zm0,22.18612l-21.70597,0l-3.10085,3.16945l0,-22.18613l24.80682,0l0,19.01668z" id="svg_2" stroke-width="0" stroke="null"/>
            <text fill="#ffffff" stroke-width="0" x="26.267355" y="53.205248" id="svg_3" font-size="24" font-family="Helvetica, Arial, sans-serif" text-anchor="start" xml:space="preserve" transform="matrix(1.1531181102140113,0,0,0.953833008591058,-23.288060590480598,-24.810932552679002) " stroke="null" font-weight="bold">D</text>
            </svg></button>
            <button is="paper-icon-button-light" id="SearchDanmaku" title="在Dandanplay弹幕库中搜索弹幕，修正匹配结果"><svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
            <path stroke="null" id="svg_2" d="m20.912173,18.48336l-1.279175,0l-0.453378,-0.437186c1.586824,-1.845898 2.542157,-4.242326 2.542157,-6.849252c0,-5.812959 -4.711897,-10.524856 -10.524856,-10.524856s-10.524856,4.711897 -10.524856,10.524856s4.711897,10.524856 10.524856,10.524856c2.606926,0 5.003354,-0.955333 6.849252,-2.542157l0.437186,0.453378l0,1.279175l8.096043,8.079851l2.412621,-2.412621l-8.079851,-8.096043zm-9.715251,0c-4.031829,0 -7.286439,-3.254609 -7.286439,-7.286439s3.254609,-7.286439 7.286439,-7.286439s7.286439,3.254609 7.286439,7.286439s-3.254609,7.286439 -7.286439,7.286439z"/>
            </svg></button>
            `
            let EmbymenuHtml = `
            <div class="dialogContainerNC"id="NCMenu"style="display: none;"><div class="focuscontainer dialog dialog-animated dialog-transformorigin-bottom actionSheet actionSheet-automobile actionSheet-largefont opened"id="position"data-lockscroll="true"data-removeonclose="true"data-transparentbackground="true"style="position: fixed; left: 530px; top: 731.225px;"><div is="emby-scroller"data-horizontal="false"data-centerfocus="card"class="actionSheetScroller focuscontainer-x actionsheetScrollSlider-bottompadded emby-scroller scrollY scrollFrameY"><div is="emby-itemscontainer"class="actionsheetScrollSlider scrollSlider flex flex-direction-column itemsContainer vertical-list scrollSliderY"><div class="listItem itemAction focusable listItemCursor listItem-hoverable listItem-withContentWrapper actionSheetMenuItem actionSheetMenuItem-noborderradius actionSheetMenuItem-noicon"id="MaxLimite"><div class="listItem-content listItemContent-touchzoom"><div class="actionsheetListItemBody listItemBody itemAction listItemBody-noleftpadding"><div class="listItemBodyText listItemBodyText-nowrap actionSheetItemText listItemBodyText-lf">限制弹幕池总数</div></div><div class="listItemAside actionSheetItemAsideText secondaryText"id="MaxLimiteControl">${MaxLimite}</div></div></div><div class="listItem itemAction focusable listItemCursor listItem-hoverable listItem-withContentWrapper actionSheetMenuItem actionSheetMenuItem-noborderradius actionSheetMenuItem-noicon"><div class="listItem-content listItemContent-touchzoom"><div class="actionsheetListItemBody listItemBody itemAction listItemBody-noleftpadding"><div class="listItemBodyText listItemBodyText-nowrap actionSheetItemText listItemBodyText-lf">调整弹幕时间轴</div></div><div class="listItemAside actionSheetItemAsideText secondaryText"><button is="paper-icon-button-light"id="LeftTimeline"><svg width="24"height="24"xmlns="http://www.w3.org/2000/svg"fill="#ffffff"><path id="svg_1"opacity="0.87"fill="none"d="m24,0l0,24l-24,0l0,-24l24,0z"/><path stroke="null"id="svg_2"d="m17.93752,0.12497l-11.87504,11.87504l11.87504,11.87504l0,-23.75007z"/></svg></button><p id="Timelinenow">${Timeline}秒</p><button is="paper-icon-button-light"id="RightTimeline"><svg width="24"height="24"xmlns="http://www.w3.org/2000/svg"fill="#ffffff"><path id="svg_1"fill="none"d="m0,0l24,0l0,24l-24,0l0,-24z"/><path stroke="null"id="svg_2"d="m6.23367,23.53266l11.53266,-11.53266l-11.53266,-11.53266l0,23.06532z"/></svg></button></div></div></div><div class="listItem itemAction focusable listItemCursor listItem-hoverable listItem-withContentWrapper actionSheetMenuItem actionSheetMenuItem-noborderradius actionSheetMenuItem-noicon"><div class="listItem-content listItemContent-touchzoom"><div class="actionsheetListItemBody listItemBody itemAction listItemBody-noleftpadding"><div class="listItemBodyText listItemBodyText-nowrap actionSheetItemText listItemBodyText-lf">透明度调整</div></div><div class="listItemAside actionSheetItemAsideText secondaryText"><input type="range"id="globalAlpha"min="0.0"max="1.0"step="0.1"value="${globalAlpha}"></div></div></div><div class="listItem itemAction focusable listItemCursor listItem-hoverable listItem-withContentWrapper actionSheetMenuItem actionSheetMenuItem-noborderradius actionSheetMenuItem-noicon"><div class="listItem-content listItemContent-touchzoom"><div class="actionsheetListItemBody listItemBody itemAction listItemBody-noleftpadding"><div class="listItemBodyText listItemBodyText-nowrap actionSheetItemText listItemBodyText-lf">显示底部弹幕</div></div><div class="listItemAside actionSheetItemAsideText secondaryText"id="bottomdisplaydiv">${bottomdisplay}</div></div></div><div class="listItem itemAction focusable listItemCursor listItem-hoverable listItem-withContentWrapper actionSheetMenuItem actionSheetMenuItem-noborderradius actionSheetMenuItem-noicon"><div class="listItem-content listItemContent-touchzoom"><div class="actionsheetListItemBody listItemBody itemAction listItemBody-noleftpadding"><div class="listItemBodyText listItemBodyText-nowrap actionSheetItemText listItemBodyText-lf">当前弹幕</div></div><div class="listItemAside actionSheetItemAsideText secondaryText"><p id="commentcount">0</p></div></div></div></div></div></div></div>
            `
            EmbyButtonHtmlLocate.insertAdjacentHTML('afterbegin', EmbyButtonHtml)
            document.body.insertAdjacentHTML('beforeend', EmbymenuHtml)
            NCMenubutton = document.querySelector("div[class='flex flex-shrink-zero justify-content-flex-end flex-wrap-wrap videoOsdBottom-buttons-right videoOsd-hideWithOpenTab videoOsd-hideWhenLocked'] #NCMenubutton");
            NCmenu = document.getElementById("NCMenu");
            MaxLimiteControlbutton = document.getElementById("MaxLimiteControl");
            globalAlphainput = document.getElementById("globalAlpha");
            Timelinenow = document.getElementById("Timelinenow");
            bottomdisplay = document.getElementById("bottomdisplaydiv");
            document.getElementById("LeftTimeline").onclick = EmbydanmakuLeft;
            document.getElementById("RightTimeline").onclick = EmbydanmakuRight;
            NCMenubutton.onclick = Menushow;
            MaxLimiteControlbutton.onclick = MaxLimiteControl;
            document.querySelector("div[class='flex flex-shrink-zero justify-content-flex-end flex-wrap-wrap videoOsdBottom-buttons-right videoOsd-hideWithOpenTab videoOsd-hideWhenLocked'] #CNDanmaku").onclick = CNDanmaku
            document.querySelector("div[class='flex flex-shrink-zero justify-content-flex-end flex-wrap-wrap videoOsdBottom-buttons-right videoOsd-hideWithOpenTab videoOsd-hideWhenLocked'] #JPDanmaku").onclick = JPDanmaku
            document.querySelector("div[class='flex flex-shrink-zero justify-content-flex-end flex-wrap-wrap videoOsdBottom-buttons-right videoOsd-hideWithOpenTab videoOsd-hideWhenLocked'] #DandanDanmaku").onclick = DandanDanmaku
            document.querySelector("div[class='flex flex-shrink-zero justify-content-flex-end flex-wrap-wrap videoOsdBottom-buttons-right videoOsd-hideWithOpenTab videoOsd-hideWhenLocked'] #SearchDanmaku").onclick = SearchDanmaku
        }
    }
}, 1000)
//控制设置菜单开关
function Menushow() {
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    let position = document.getElementById("position");
    position.style.top = (windowHeight - 320) + "px";
    position.style.left = (windowWidth - 650) + "px";
    NCmenu.style.display = (NCmenu.style.display === "none") ? "block" : "none";
    document.addEventListener("click", function (event) {
        var targetElement = event.target;
        if (targetElement != NCmenu && !NCmenu.contains(targetElement) && !targetElement != NCMenubutton && !NCMenubutton.contains(targetElement)) {
            NCmenu.style.display = "none";
        }
    });
    globalAlphainput.addEventListener("input", function () {
        globalAlpha = globalAlphainput.value;
        GM_setValue("globalAlpha", globalAlpha);
        Embydanmaku()
    });
    bottomdisplay.addEventListener("click", function () {
        bottomdisplayflag = ( bottomdisplayflag === true) ? false : true;
        GM_setValue("bottomdisplayflag", bottomdisplayflag);
        bottomdisplay.innerHTML = ( bottomdisplayflag === true) ? "是" : "否";
        Embydanmaku()
    });

}
// 按钮功能设定，首次点击为获取弹幕，之后为显示和隐藏弹幕
function CNDanmaku() {
    if (CNDanmakuLoaded) {
        if (CNDanmakuShow) {
            EmbyDanmaku.hide()
            CNDanmakuShow = false
        } else {
            EmbyDanmaku.show()
            CNDanmakuShow = true
        }
    } else {
        CNDanmakuLoad()
    }
    DanmakuListen()
}
function JPDanmaku() {
    if (JPDanmakuLoaded) {
        if (JPDanmakuShow) {
            EmbyDanmaku.hide()
            JPDanmakuShow = false
        } else {
            EmbyDanmaku.show()
            JPDanmakuShow = true
        }
    } else {
        JPDanmakuLoad()
    }
    DanmakuListen()
}
function DandanDanmaku() {
    if (DandanDanmakuLoaded) {
        if (DandanDanmakuShow) {
            EmbyDanmaku.hide()
            DandanDanmakuShow = false
        } else {
            EmbyDanmaku.show()
            DandanDanmakuShow = true
        }
    } else {
        DandanDamakuLoad(true)
    }
    DanmakuListen()
}
function SearchDanmaku() {
    DandanDamakuLoad(false)
    DanmakuListen()
}
function EmbydanmakuRight() {
    TimelineChange = 0.5
    Timeline = Timeline + 0.5
    Embydanmaku()
    document.getElementById("Timelinenow").innerHTML = Timeline + "秒";
}
function EmbydanmakuLeft() {
    TimelineChange = -0.5
    Timeline = Timeline - 0.5
    Embydanmaku()
    document.getElementById("Timelinenow").innerHTML = Timeline + "秒";
}
function MaxLimiteControl() {
    MaxLimite = prompt("修改最大弹幕数为", MaxLimite);
    if (MaxLimite != null) {
        MaxLimite = parseInt(MaxLimite)
        if (!isNaN(MaxLimite)) {
            GM_setValue("DanmakuMax", MaxLimite)
            MaxLimiteControlbutton.innerHTML =  MaxLimite
            Embydanmaku()
        } else {
            alert("请输入数字")
            if (GM_getValue("DanmakuMax")) {
                MaxLimite = GM_getValue("DanmakuMax")
            } else {
                MaxLimite = 5000
            }
        }
    } else {
        if (GM_getValue("DanmakuMax")) {
            MaxLimite = GM_getValue("DanmakuMax")
        } else {
            MaxLimite = 5000
        }
    }
}
//锁定弹幕容器，并绑定初始化条件为退出页面和影片播放
function DanmakuListen() {
    DanmakuMedia = document.querySelector("video[class='htmlvideoplayer moveUpSubtitles']")
    DanmakuContainer = document.body
    DanmakuMedia.addEventListener('loadstart', Initialize)
    document.querySelector("button[class='headerBackButton headerButton hide-mouse-idle-tv paper-icon-button-light']").addEventListener('click', Initialize)
}
//初始化参数
function Initialize() {
    TimelineChange = 0
    CNDanmakuLoaded = false
    CNDanmakuShow = false
    JPDanmakuLoaded = false
    JPDanmakuShow = false
    DandanDanmakuLoaded = false
    DandanDanmakuShow = false
    if (EmbyDanmaku) {
        EmbyDanmaku.destroy()
        EmbyDanmaku = null
    }
    document.getElementById("DandanDanmaku").title = "DandanPlay弹幕库弹幕，首次点击将自动进行匹配。目前尚未匹配Dandan弹幕"
    document.getElementById("Timelinenow").innerHTML = "0秒";
    Timeline = 0
}
//哔哩哔哩弹幕，去除导致加载异常的特殊符号。
function TextRecode(text) {
    text = text.replaceAll("&", "")                                       //首先去除&字符
    text = text.replace("<i>", "&i&")                                  //将有意义的<>替换为&
    text = text.replace("</i>", "&/i&")
    text = text.replace("<chatserver>", "&chatserver&")
    text = text.replace("</chatserver>", "&/chatserver&")
    text = text.replace("<chatid>", "&chatid&")
    text = text.replace("</chatid>", "&/chatid&")
    text = text.replace("<mission>", "&mission&")
    text = text.replace("</mission>", "&/mission&")
    text = text.replace("<maxlimit>", "&maxlimit&")
    text = text.replace("</maxlimit>", "&/maxlimit&")
    text = text.replace("<state>", "&state&")
    text = text.replace("</state>", "&/state>&")
    text = text.replace("<real_name>", "&/real_name&")
    text = text.replace("</real_name>", "&/real_name&")
    text = text.replace("<source>", "&source&")
    text = text.replace("</source>", "&/source&")
    text = text.replaceAll("<d p=\"", "&d p=")
    text = text.replaceAll('\">', '\"&')
    text = text.replaceAll("</d>", "&/d&")
    text = text.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "&?xml version=\"1.0\" encoding=\"UTF-8\"?&")
    text = text.replaceAll("<", "")
    text = text.replaceAll(">", "")
    text = text.replaceAll("\"", "")
    text = text.replaceAll("\'", "")
    text = text.replace("&i&", "<i>")
    text = text.replace("&/i&", "</i>")
    text = text.replace("&chatserver&", "<chatserver>")
    text = text.replace("&/chatserver&", "</chatserver>")
    text = text.replace("&chatid&", "<chatid>")
    text = text.replace("&/chatid&", "</chatid>")
    text = text.replace("&mission&", "<mission>")
    text = text.replace("&/mission&", "</mission>")
    text = text.replace("&maxlimit&", "<maxlimit>")
    text = text.replace("&/maxlimit&", "</maxlimit>")
    text = text.replace("&state&", "<state>")
    text = text.replace("&/state&", "</state>")
    text = text.replace("&/real_name&", "<real_name>")
    text = text.replace("&/real_name&", "</real_name>")
    text = text.replace("&source&", "<source>")
    text = text.replace("&/source&", "</source>")
    text = text.replace("&?xml version=1.0 encoding=UTF-8?&", "<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
    text = text.replaceAll("&/d&", "</d>")
    text = text.replaceAll("&d p=", "<d p=\"")
    text = text.replaceAll('&', '\">')
    return text
}
//弹幕库装填
function Embydanmaku() {
    let DanmakuLimited = Array.from(DanmakuComment)
    if (DanmakuLimited) {
        if (EmbyDanmaku) {
            EmbyDanmaku.destroy()
            EmbyDanmaku = null
        }
        if (DanmakuLimited.length > MaxLimite) {
            let DeleteRate = DanmakuLimited.length / (DanmakuLimited.length - MaxLimite)
            DeleteRate = parseFloat(DeleteRate.toFixed(3))
            for (var n = 0; n < DanmakuLimited.length; n = n + DeleteRate) {
                DanmakuLimited.splice(Math.round(n), 1, "")
            }
            DanmakuLimited = DanmakuLimited.filter((x) => x)
        }
        if (TimelineChange != 0) {
            DanmakuLimited = DanmakuLimited.map((DanmakuLimitedOne) => {
                DanmakuLimitedOne.time = DanmakuLimitedOne.time + TimelineChange
                return DanmakuLimitedOne
            })
        }
        if (TimelineChange != 0) {
            DanmakuLimited = DanmakuLimited.map((DanmakuLimitedOne) => {
                DanmakuLimitedOne.time = DanmakuLimitedOne.time + TimelineChange
                return DanmakuLimitedOne
            })
        }
        if (!bottomdisplayflag) {
            DanmakuLimited = DanmakuLimited.map((DanmakuLimitedOne) => {
                DanmakuLimitedOne.mode = 'rtl'
                return DanmakuLimitedOne
            })
        }
        DanmakuLimited = DanmakuLimited.map((DanmakuLimitedOne) => {
            DanmakuLimitedOne.style.globalAlpha = parseFloat(globalAlpha)
            return DanmakuLimitedOne
        })
        document.getElementById("commentcount").innerHTML = DanmakuLimited.length;
        EmbyDanmaku = new Danmaku({
            container: DanmakuContainer,
            media: DanmakuMedia,
            comments: DanmakuLimited,
            engine: 'canvas',
            speed: 144
        })
        EmbyDanmakuResize()
        console.log("弹幕装填")
    } else {
        console.log("弹幕未装填")
    }
}
//获取基础弹幕文件所在地的基础url
async function Getbaseurl(xml) {
    let ItemUrlpre = document.querySelectorAll("video[class='htmlvideoplayer moveUpSubtitles']")[0].getAttribute("src");
    let ItemUrl = ItemUrlpre.substring(0, ItemUrlpre.indexOf("stream")).replace("videos", "emby/Items") + "PlaybackInfo?api_key=" + api_key;
    let Response = await fetch(ItemUrl);
    if (Response.ok) {
        console.log("获取视频信息成功")
        let ItemInfo = await Response.json()
        let EmbyVideoPath = ItemInfo.MediaSources[0].Path;
        if (EmbyVideoPath.includes(MyMediaSource)) {
            if (EmbyVideoPath.includes("\\")) {
                DanmakuPathpre = EmbyVideoPath.replace(MyMediaSource, "").replace(/\\/g, "/")
            } else {
                DanmakuPathpre = EmbyVideoPath.replace(MyMediaSource, "")
            }
        }
        let DanmakuPath = DanmakuPathpre.substring(0, DanmakuPathpre.lastIndexOf(".")) + xml
        return DanmakuPath
    } else {
        console.log("获取视频信息失败，无法从当前页面获取到视频在emby中的id，可能是因为该视频发生转码播放")
    }
}
//获取中文弹幕文件，并执行分析，选择不同的函数解析，创建弹幕引擎并填入。
async function CNDanmakuLoad() {
    let CNXmlpath = await Getbaseurl("-CN.xml")
    let Response = await fetch(CNXmlpath)
    if (Response.ok) {
        console.log("读取到弹幕文件，尝试分析")
        Initialize()
        let CNText = await Response.text()
        //判断是否是B站弹幕
        if (CNText.match("xml") && CNText.match("p")) {
            DanmakuComment = BiliParser(CNText)
        } else {
            if (CNText.match("text") && CNText.match("userid")) {
                DanmakuComment = BahaParser(CNText)
            } else {
                alert("弹幕文件不识别")
            }

        }
        //判断是否是巴哈弹幕

        Embydanmaku()
        CNDanmakuLoaded = true
        CNDanmakuShow = true
    } else {
        alert("无可供匹配的弹幕文件")
    }
}
////获取日文弹幕文件，并执行分析，选择不同的函数解析，创建弹幕引擎并填入。
async function JPDanmakuLoad() {
    let JPXmlpath = await Getbaseurl("-JP.xml")
    let Response = await fetch(JPXmlpath)
    if (Response.ok) {
        console.log("获取弹幕信息成功")
        let JPText = await Response.text()
        Initialize()
        if (JPText.match("chat") && JPText.match("vpos")) {
            DanmakuComment = NicoParser(JPText);

        } else {
            alert("弹幕文件不识别")
        }
        Embydanmaku()
        JPDanmakuLoaded = true
        JPDanmakuShow = true
    } else {
        alert("无可供匹配的弹幕文件")
    }
}
//B站弹幕分析
function BiliParser(BiliText) {
    if (!BiliText.match("http://www.w3.org/2001/XMLSchema-instance")) {                                               //如果text文本中不含有指定连接，则判断为非dandan处理过的文件，需要进行去错误代码
        BiliText = TextRecode(BiliText)
    }
    let BiliXml = new window.DOMParser().parseFromString(BiliText, "text/xml").getElementsByTagName("d")
    let BiliArray = new Array()
    for (i = 0; i < BiliXml.length; i++) {
        if (BiliXml[i].childNodes[0]) {
            BiliArray[i] = {
                text: BiliXml[i].childNodes[0].nodeValue,
                property: BiliXml[i].getAttribute("p")
            }
        } else {
            i++
        }
    }
    BiliDanmakuComment = BiliArray.map((BiliArrayOne) => {
        let PValues = BiliArrayOne.property.split(',')
        let DMode = ({ 1: 'rtl', 2: 'rtl', 3: 'rtl', 4: 'bottom', 5: 'top', 6: 'ltr' })[PValues[1]]
        if (!DMode) {
            DMode = 'rtl'
        };
        let DSize = PValues[2];
        let = Dcolor = `000000${Number(PValues[3]).toString(16)}`.slice(-6);
        return {
            text: BiliArrayOne.text,
            mode: DMode,
            time: PValues[0] * 1,
            style: {
                fontSize: `${DSize}px`,
                color: `#${Dcolor}`,
                textShadow: Dcolor === '00000'
                    ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
                    : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
                font: `${DSize}px sans-serif`,
                fillStyle: `#${Dcolor}`,
                strokeStyle: Dcolor === '000000' ? '#fff' : '#000',
                lineWidth: 2.0,
            }
        }
    }).filter((x) => x);
    return BiliDanmakuComment
}
//nico站弹幕分析，兼容himawari
function NicoParser(NicoText) {
    let NicoXml = new window.DOMParser().parseFromString(NicoText, "text/xml").getElementsByTagName("chat")
    let NicoArray = new Array()
    for (i = 0; i < NicoXml.length; i++) {
        if (NicoXml[i].childNodes[0]) {
            if (NicoXml[i].getAttribute("mail")) {
                NicoArray[i] = {
                    text: NicoXml[i].childNodes[0].nodeValue,
                    property: NicoXml[i].getAttribute("mail"),
                    time: NicoXml[i].getAttribute("vpos")
                }
            } else {
                NicoArray[i] = {
                    text: NicoXml[i].childNodes[0].nodeValue,
                    time: NicoXml[i].getAttribute("vpos")
                }
            }
        } else {
            i++
        }
    }
    NicoDanmakuComment = NicoArray.map((NicoArrayOne) => {
        let DMode
        let DSize
        let Dtime = NicoArrayOne.time / 100
        let p = NicoArrayOne.property
        if (NicoArrayOne.property) {
            p = NicoArrayOne.property
            if (p.includes('ue')) {
                DMode = 'top'
            } else {
                if (p.includes('shita')) {
                    DMode = 'bottom'
                } else {
                    DMode = 'rtl'
                }
            }
            if (p.includes('big')) {
                DSize = 36
            } else {
                if (p.includes('small')) {
                    DSize = 16
                } else {
                    DSize = 25
                }
            }
            if (p.includes('ue')) {
                DMode = 'top'
            }
            let c = p.replace(/(shita|ue|big|small)/g, "")
            if (c) {
                Dcolor = { black: '000000', white: 'FFFFFF', red: 'FF0000', green: '00ff00', yellow: 'FFFF00', blue: '0000FF', orange: 'ffcc00', pink: 'FF8080', cyan: '0FFFF', purple: 'C000FF', niconicowhite: 'cccc99', white2: 'cccc99', truered: 'cc0033', red2: 'cc0033', passionorange: 'ff6600', orange2: 'ff6600', madyellow: '999900', yellow2: '999900', elementalgreen: '00cc66', green2: '00cc66', marineblue: '33ffcc', blue2: '33ffcc', nobleviolet: '6633cc', purple2: '6633cc' }[c]
                if (!Dcolor) {
                    Dcolor = 'FFFFFF'
                }
            } else {
                Dcolor = 'FFFFFF'
            }
        } else {
            DMode = 'rtl'
            DSize = 25
            Dcolor = 'FFFFFF'
        }
        return {
            text: NicoArrayOne.text,
            mode: DMode,
            time: Dtime,
            style: {
                fontSize: `${DSize}px`,
                color: `#${Dcolor}`,
                textShadow: Dcolor === '00000'
                    ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
                    : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
                font: `${DSize}px sans-serif`,
                fillStyle: `#${Dcolor}`,
                strokeStyle: Dcolor === '000000' ? '#fff' : '#000',
                lineWidth: 2.0,
            }
        }
    }).filter((x) => x);
    return NicoDanmakuComment
}
//巴哈弹幕分析
function BahaParser(BahaText) {
    BahaArray = JSON.parse(BahaText);
    BahaDanmakuComment = BahaArray.map((BahaArrayOne) => {
        let Dmode = ({ 0: 'rtl', 1: 'top', 2: 'bottom' })[BahaArrayOne.position];
        return {
            text: BahaArrayOne.text,
            mode: Dmode,
            time: BahaArrayOne.time / 10,
            style: {
                fontSize: '25px',
                color: BahaArrayOne.color,
                textShadow: BahaArrayOne.color === '00000'
                    ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
                    : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
                font: `25px sans-serif`,
                fillStyle: BahaArrayOne.color,
                strokeStyle: BahaArrayOne.color === '000000' ? '#fff' : '#000',
                lineWidth: 2.0,
            },
        };
    }).filter((x) => x);
    return BahaDanmakuComment;
}
//弹弹弹幕库分析
function DandanParser(DanArray) {
    return DanArray.map((DanArrayOne) => {
        let PValues = DanArrayOne.p.split(',');
        let Dmode = ({ 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' })[PValues[1]];
        if (!Dmode) return null;
        let Dcolor = `000000${Number(PValues[2]).toString(16)}`.slice(-6);
        return {
            text: DanArrayOne.m,
            mode: Dmode,
            time: PValues[0] * 1,
            style: {
                fontSize: '25px',
                color: `#${Dcolor}`,
                textShadow: Dcolor === '00000'
                    ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
                    : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',

                font: `25px sans-serif`,
                fillStyle: `#${Dcolor}`,
                strokeStyle: Dcolor === '000000' ? '#fff' : '#000',
                lineWidth: 2.0,
            },
        };
    }).filter((x) => x);
}
//将弹弹弹幕库的搜索结果列表化
function list2string($obj2) {
    const $animes = $obj2.animes
    var anime_lists = $animes.map(($single_anime) => {
        return $single_anime.animeTitle + " 类型:" + $single_anime.typeDescription
    })
    var anime_lists_str = '0:' + anime_lists[0];
    for (var i = 1; i < anime_lists.length; i++) {
        anime_lists_str = anime_lists_str + "\n" + (i).toString() + ":" + anime_lists[i]
    }
    return anime_lists_str
}
function ep2string($obj3) {
    const $animes = $obj3
    var anime_lists = $animes.map(($single_ep) => {
        return $single_ep.episodeTitle
    })
    var ep_lists_str = '0:' + anime_lists[0];
    for (var i = 1; i < anime_lists.length; i++) {
        ep_lists_str = ep_lists_str + "\n" + (i).toString() + ":" + anime_lists[i]
    }
    return ep_lists_str
}

//弹弹弹幕库匹配
async function DandanDamakuLoad(is_auto) {
    let Series
    VideoIdSelected = 0
    let VideoNameInPage = document.querySelector("h3[class='videoOsdParentTitle videoOsdParentTitle-small hide']").innerHTML
    let VideoName = VideoNameInPage
    if (GM_getValue(VideoNameInPage)) {
        VideoName = GM_getValue(VideoNameInPage)
    }
    if (!is_auto) {
        VideoName = prompt("确认名称:", VideoName);
    }
    if (VideoName != VideoNameInPage) {
        GM_setValue(VideoNameInPage, VideoName)
    }
    let EpisodePre = document.querySelector("h3[class='videoOsdTitle']")
    if (EpisodePre) {
        EpisodePre = EpisodePre.innerHTML
        Episode = /E([0-9]*)/gi.exec(EpisodePre)
        Series = /S([0-9]*)/gi.exec(EpisodePre)
        if (Episode != null) {
            Episode = Episode[0]
            Episode = Episode.substring(1)
            EpisodeIdSelected = Episode
        } else {
            EpisodeIdSelected = 0
        }
        if (Series != null) {
            Series = Series[0]
        } else {
            Series = EpisodePre
        }
    } else {
        Episode = 'movie'
    }
    if (!is_auto) {
        SearchUrl = "https://emby.filexiazaiwr.work:82/danmaku/api/v2/search/episodes?anime=" + VideoName + "&withRelated=true"
    } else {
        SearchUrl = "https://emby.filexiazaiwr.work:82/danmaku/api/v2/search/episodes?anime=" + VideoName + "&withRelated=true&episode=" + Episode
    }
    var SearchResponse = await fetch(SearchUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "User-Agent": "EmbyDanmaku/web 1.0"
        },
    })
    if (SearchResponse.ok) {
        console.log("搜索请求成功");
        var SearchResult = await SearchResponse.json();
        if (!SearchResult.animes[0]){
            alert("未匹配到动画，请点击手动搜索尝试");
            return
        }
        if (GM_getValue(VideoName + Series)) {
            VideoIdSelected = GM_getValue(VideoName + Series)
        }
        if (!is_auto) {
            var VideoNameList = list2string(SearchResult);
            VideoIdSelected = prompt("选择:\n" + VideoNameList, VideoIdSelected)
            VideoIdSelected = parseInt(VideoIdSelected)
            GM_setValue(VideoName + Series, VideoIdSelected)
            var VideoEpisodeList = ep2string(SearchResult.animes[VideoIdSelected].episodes)
            EpisodeIdSelected = prompt("确认集数:\n" + VideoEpisodeList, parseInt(EpisodeIdSelected) - 1);
            EpisodeIdSelected = parseInt(EpisodeIdSelected)
        } else {
            EpisodeIdSelected = 0
        }
        var AbsoluteId = SearchResult.animes[VideoIdSelected].episodes[EpisodeIdSelected].episodeId
        if (SearchResult.animes[VideoIdSelected].type == "tvseries") {
            EpisodeInfo = "动画名称:" + SearchResult.animes[VideoIdSelected].animeTitle + "\n分集名称:" + SearchResult.animes[VideoIdSelected].episodes[EpisodeIdSelected].episodeTitle
        } else {
            EpisodeInfo = "动画名称:" + SearchResult.animes[VideoIdSelected].animeTitle
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://emby.filexiazaiwr.work:82/danmaku/api/v2/comment/" + AbsoluteId + "?withRelated=true",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                "User-Agent": "EmbyDanmaku/web 1.0"
            },

            onload: function (DandanDanmakuResponse) {
                console.log("弹幕请求成功");
                let DandanJson = JSON.parse(DandanDanmakuResponse.responseText)
                let DandanDanmakuComment = DandanParser(DandanJson.comments)
                console.log(DandanDanmakuComment)
                Initialize()
                DanmakuComment = DandanDanmakuComment
                Embydanmaku()
                DandanDanmakuLoaded = true
                DandanDanmakuShow = true
                document.getElementById("DandanDanmaku").title = "DandanPlay弹幕库弹幕，目前匹配为\n" + EpisodeInfo
            },
            onerror: function () {
                console.log("弹幕请求失败");
            }
        });
    } else {
        console.log("搜索请求失败");
    }
}
//监控屏幕变化
function EmbyDanmakuResize() {
    let EmbyDanmakuResize = new ResizeObserver(() => {
        EmbyDanmaku.resize()
    })
    EmbyDanmakuResize.observe(DanmakuContainer)
}