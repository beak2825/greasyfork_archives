// ==UserScript==
// @name       CUBE_提示
// @namespace    https://global-oss.bigo.tv
// @version      0.2
// @description  cb new audit
// @author     OLEREO!
// @match      https://global-oss.bigo.tv/bigoAudit/live-first/index*
// @match      https://global-oss.bigo.tv/bigoAudit/live-final/index*
// @match      https://global-oss-jf2jja.bigo.tv/bigoAudit/live-first/index*
// @match      https://global-oss-jf2jja.bigo.tv/bigoAudit/live-final/index*
// @match      https://global-oss.bigoapp.tv/bigoAudit/live-final/index*
// @match      https://global-oss.bigoapp.tv/bigoAudit/live-first/index*
// @downloadURL https://update.greasyfork.org/scripts/373579/CUBE_%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/373579/CUBE_%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==


var DEBUG = false;

var mVersion = "";

//*****************特殊UID列表*****************
//  如果没有结束期限，那就可以不填写开始和结束时间。
//  注意，每行的最后一定要带有英文的逗号“,”
//  每个 UID 之间要用“;”隔开

//  ["描述", "UID1;UID2;","开始时间","结束时间"],
//  ["特殊UID", "789456123", "2018-03-05 13:49:50", "2018-03-05 13:59:40"],
//  ["没有期限的特殊UID", "103560050;321654987"],
var SpUID = [
    ["特殊UID", ";UID;"],
];
//*****************特殊UID列表*****************




//*****************特殊规则列表*****************
var SpRule = [
    [";ID;RU;", "1：女性：【B】衣内外抓摸胸；【警告】聚焦下体/胸部、叫床、凸点、衣着超暴露<br>2：男女：【警告】裤外摸下体、性暗示、性挑逗、故意露出内衣裤；【A】裤内抓下体"],
    [";RU;TH;", "【B】驾驶直播"],
    [";MY;PH;SG;", "【忽略】展示烟酒"],
    [";MY;", "【A】女性衣外摸胸"],
    [";AT;AU;BE;BY;CA;CH;DE;DK;EE;ES;FI;IE;LT;LU;MD;MX;NL;NO;NZ;PT;RU;SE;UA;UK;US;", "【A】婴儿裸露，包括屁股（西语国家）"],
    [";KR;ID;PH;JP;RU;US;BR;AT;AU;BE;BY;CA;CH;DE;DK;EE;ES;FI;IE;LT;LU;MD;MX;NL;NO;NZ;PT;RU;SE;UA;UK;US;", "【直播封禁】未成年直播"],
];
//*****************特殊规则列表*****************



//       底线类倾向行为 喝酒赤裸  女性露点   聚焦下  摸下体（女  暴露生殖器女  聚焦胸部
//疑似涉黄 ，性挑逗，未成年，赤裸上身，摸下体（男，抽烟，暴露生殖器（男， 色情网站视频图片，男性聚焦下体，抓胸
var LiveFinal_Lable = [
    ["游戏挂机",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "游戏画面"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";挂机;"
    ],

    ["网页挂机",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "网页/图片"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";挂机;"
    ],

    ["视频挂机",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "影视动画"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";挂机;"
    ],

    ["游戏色情",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "游戏画面"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";疑似涉黄;"
    ],

    ["游戏露点",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "游戏画面"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";露点/凸点;"
    ],


    ["游戏露下体",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "游戏画面"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";暴露生殖器官;"
    ],


    ["视频色情",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "游戏画面"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        "色情网站/视频/图片"
    ],


    ["网页色情",
        [
            ["主体", "无"],
            ["性别", "无"],
            ["年龄", "无"],
            ["场景", "网页/图片"],
            ["衣着", "无"],
            ["语音", "无"],
        ],
        ";色情网站/视频/图片;"
    ],

];


//大主播等级。高于此等级的都会提醒
var BigLevel = 20;

//土豪级别
var TuHao = 10000;

//两次直播间隔时间(分钟)
var TwoLive = 3;




////**********************************	下面不用管	***********************************************////
////**********************************	下面不用管	***********************************************////
////**********************************	下面不用管	***********************************************////
////**********************************	下面不用管	***********************************************////
////**********************************	下面不用管	***********************************************////
////**********************************	下面不用管	***********************************************////
////**********************************	下面不用管	***********************************************////

var href = window.location.href;
var live_first = ((href == "https://global-oss.bigo.tv/bigoAudit/live-first/index") || (href.search("localhost:7") != -1));
var live_final = ((href == "https://global-oss.bigo.tv/bigoAudit/live-final/index") || (href.search("localhost:8") != -1));

if (DEBUG) {
    console.log("live_first:" + live_first);
    console.log("live_final:" + live_final);
    mVersion += " TEST";
}

//规则提醒
var btTS_SpRule = document.createElement("button");
btTS_SpRule.style.fontSize = "9px";
btTS_SpRule.style.height = "65px";
btTS_SpRule.style.display = "none";

// 终审快速标签
if (live_final) {
    var wbDuoRenLianMai = document.getElementsByClassName("body-extra detail-part")[0];
    if (wbDuoRenLianMai != null) {
        var Button_CancelAllLable = document.createElement("input");
        Button_CancelAllLable.setAttribute("type", "button");
        Button_CancelAllLable.setAttribute("value", "取消选择");
        Button_CancelAllLable.style.fontSize = "20px";
        Button_CancelAllLable.onclick = function () {
            cancelAllLable();
        }
        wbDuoRenLianMai.appendChild(Button_CancelAllLable);


        var divLable = document.createElement("div");
        divLable.id = "myDivLable";
        divLable.innerHTML = '<div id="divLable" align="center" style="position: absolute; z-index: 9; background-color: blue; width:200px; height:500px; " ></div>';


        //生成标签按钮
        for (i = 0; i < LiveFinal_Lable.length; i++) {
            var lableName = LiveFinal_Lable[i][0];
            console.log(lableName);
            var lableButton = document.createElement("input");
            lableButton.setAttribute("type", "button");
            lableButton.setAttribute("value", lableName);
            lableButton.style.fontSize = "20px";

            (function () {
                var index = i;
                lableButton.onclick = function () {
                    (function () {
                        labelClick(index);
                    })();
                }
            })();

            wbDuoRenLianMai.appendChild(lableButton);
        }

        function cancelAllLable() {
            for (c = 0; c < 4; c++) {
                var level2 = document.getElementsByClassName("label bigo-label bigo-label-level2 cancelable active");
                for (i = 0; i < level2.length; i++) {
                    console.log(level2[i].innerText);
                    level2[i].click();
                }
                var level3 = document.getElementsByClassName("label bigo-label bigo-label-level3 cancelable active");
                for (i = 0; i < level3.length; i++) {
                    console.log(level3[i].innerText);
                    level3[i].click();
                }
            }
        }

        function labelClick(index) {
            cancelAllLable();
            var labelArr = LiveFinal_Lable[index];
            var bigo_label_level2 = document.getElementsByClassName("row row-hover");
            for (i = 0; i < bigo_label_level2.length; i++) {
                var level2_name = bigo_label_level2[i].getElementsByClassName("col-lg-1 col-sm-1 col-sm-1 col-xs-1 control-label text-right");
                if (level2_name.length > 0) {
                    level2_name = level2_name[0].innerText;
                    var level2_Lable = labelArr[1];
                    for (l = 0; l < level2_Lable.length; l++) {
                        if (level2_name == level2_Lable[l][0]) {
                            var l2l_sons = bigo_label_level2[i].getElementsByClassName("label bigo-label bigo-label-level2 cancelable");
                            for (blb2Index = 0; blb2Index < l2l_sons.length; blb2Index++) {
                                var active = (l2l_sons[blb2Index].className.search(" active") != -1);
                                if ((l2l_sons[blb2Index].innerText == level2_Lable[l][1]) && (!active)) {
                                    l2l_sons[blb2Index].click();
                                }
                            }

                        }
                    }
                }
            }

            var bigo_label_level3 = document.getElementsByClassName("label bigo-label bigo-label-level3 cancelable");
            var label3_Arr = labelArr[2].split(";");
            for (i = 0; i < bigo_label_level3.length; i++) {
                var active = (bigo_label_level3[i].className.search(" active") != -1);
                if (!active) {
                    for (l3 = 0; l3 < label3_Arr.length; l3++) {
                        console.log(label3_Arr[l3]);
                        if (label3_Arr[l3] == bigo_label_level3[i].innerText) {
                            bigo_label_level3[i].click();
                        }
                    }
                }
            }
        }
    }
}

var wSourceBtn = document.getElementById("sourceCheckboxModalBtn");
var wHeader = document.getElementsByClassName("header")[0];
var wHeaderText = document.getElementById("header-text");

//Enable按钮
var btEnable = document.createElement("input");
btEnable.id = "btEnable";
btEnable.style.background = "#424242";
btEnable.style.border = "2px solid " + "#FFFFFF";
btEnable.setAttribute("type", "button");
btEnable.setAttribute("value", "初终审提示" + mVersion);
btEnable.style.fontSize = "12px";
btEnable.style.align = "center";
btEnable.style.color = "#FFFFFF";
AddToBreadcrumbs("btEnable", btEnable);
btEnable.onclick = function () {
    if (wSourceBtn.style.display == "none") {
        TurnOFF();
    } else {
        TurnON();
    }
};


//恢复比例
var btReRatio = document.createElement("input");
btReRatio.id = "btReRatio";
btReRatio.style.background = "#424242";
btReRatio.style.border = "2px solid " + "#FFFFFF";
btReRatio.setAttribute("type", "button");
btReRatio.setAttribute("value", "恢复比例");
btReRatio.style.fontSize = "12px";
btReRatio.style.align = "center";
btReRatio.style.color = "#FFFFFF";
AddToBreadcrumbs("btReRatio", btReRatio);
var OnReRatio = sessionStorage.getItem("ReRatio");
if (OnReRatio == null || OnReRatio == "false") {
    OnReRatio = false;
} else {
    OnReRatio = true;
}

btReRatio.onclick = function () {
    if (OnReRatio) {
        OnReRatio = false;
    } else {
        OnReRatio = true;
    }
    SetReRation();
};

SetReRation();
function SetReRation() {
    if (OnReRatio) {
        btReRatio.setAttribute("value", "恢复比例：开启");
    } else {
        btReRatio.setAttribute("value", "恢复比例：关闭");
    }
    sessionStorage.setItem("ReRatio", OnReRatio);
}


var txInfo = document.createTextNode("");
var txLastUID = document.createTextNode("");
var bInfospan = document.createElement('span');
bInfospan.style.fontSize = "15px";
bInfospan.style.fontWeight = 'bold';
bInfospan.style.marginLeft = "20px";
bInfospan.appendChild(txInfo);

AddToBreadcrumbs("bInfospan", bInfospan);
AddToBreadcrumbs("bLastUID", txLastUID);

//储存处理过的UID
var HistoryUID = sessionStorage.getItem("HistoryUID");
if (HistoryUID == null) HistoryUID = ";"
pushHistoryUID("");

function pushHistoryUID(uid) {
    if (uid != "")
        HistoryUID = uid + ";" + HistoryUID;
    var spHUID = HistoryUID.split(";");

    var index = 1;
    txLastUID.textContent = "";
    HistoryUID = "";

    for (i = 0; i < spHUID.length; i++) {
        if (spHUID[i] != "") {
            txLastUID.textContent += index + ":" + spHUID[i] + "; ";
            HistoryUID += spHUID[i] + ";";
            index += 1;
        }
        if (i == 4)
            break;
    }
    sessionStorage.setItem("HistoryUID", HistoryUID)
}


var turn = false;

TurnON();

function TurnON() {
    var headers = document.getElementsByClassName("search-button header-button");
    if (headers != null) {
        for (i = 0; i < headers.length; i++) {
            if (headers[i].innerHTML == "开始审核")
                return;
        }

        for (i = 0; i < headers.length; i++) {
            if (headers[i].innerHTML == "国家")
                headers[i].style.display = "none";
        }
    }

    btEnable.setAttribute("value", "初终审提示 " + mVersion + "：开启");
    btEnable.style.background = "#656565";
    btEnable.style.border = "2px solid " + "#424242";
    wSourceBtn.style.display = "none";
    var oPen = document.getElementById("uid");
    if (oPen != null)
        oPen.style.display = "none";
    wHeaderText.style.display = "none";
    turn = true;
}

function TurnOFF() {
    //关闭
    btEnable.setAttribute("value", "初终审提示 " + mVersion + "：关闭");
    btEnable.style.background = "#424242";
    btEnable.style.border = "2px solid " + "#424242";
    txInfo.textContent = "";
    HideTS();

    wSourceBtn.style.display = "block";

    var e = document.getElementById("uid");
    if (e != null)
        e.style.display = "block";

    wHeaderText.style.display = "block";

    UID = "NONE";
    var dd = document.getElementsByClassName("search-button header-button bg-navy");
    if (dd != null) {
        for (i = 0; i < dd.length; i++) {
            if (dd[i].innerHTML == "国家")
                dd[i].style.display = "";
        }
    }

    turn = false;
}

var UID;
var Country;
var PrivateRoom;
var Level;
var Diamond;
var Remark;
var df_Document;

function initUserInfo() {
    UID = "NONE";
    Country = "NONE";
    PrivateRoom = false;
    Level = "NONE";
    Diamond = "NONE";
    Remark = "";

    if (live_final) {
        df_Document = document;
    } else {
        var detail_iframe = document.getElementsByClassName("pic-div record-div choose-record");
        if (detail_iframe.length == 1) {
            detail_iframe = detail_iframe[0];
        } else if (detail_iframe.length == 2) {
            detail_iframe = detail_iframe[1];
        }


        var frames = window.frames;
        for (var i = 0; i < frames.length; i++) {
            var inxx = frames[i].name.search(detail_iframe.id);
            if (inxx != -1) {
                df_Document = frames[i].document;
            }
        }
    }



    if (df_Document == null) {
        //console.log("df_Document null")
        return;
    } else {
        //console.log("df_Document");
    }

    var userInfos = df_Document.getElementsByClassName("info-p2-1");
    // console.log("UserInfos.length:" + userInfos.length);


    for (i = 0; i < userInfos.length; i++) {
        var str = userInfos[i].innerText;
        if (str.substring(0, 5) == "UID: ") {
            UID = str.substring(5, 20).trim();
        } else if (str.substring(0, 2) == "国家") {
            Country = str.substring(4, 10);
        } else if (str.search("私密房间") != -1) {
            PrivateRoom = true;
        } else if (str.search("私房") != -1) {
            PrivateRoom = true;
        } else if (str.substring(0, 3) == "钻石数") {
            Diamond = str.substring(5, 20);
        } else if (str.substring(0, 2) == "等级") {
            Level = str.substring(4, 10);
        } else if (str.substring(0, 4) == "初审备注") {
            Remark = str.substring(6, 40);
        }
    }

    if (UID == "NONE") {
        HideTS();
    }
}

function HideTS() {
    for (i = 0; i < btTS_ArrayS.length; i++) {
        btTS_ArrayS[i].style.display = "none";
    }

}


setInterval(function () {
    Check();
}, 500);


//展开图片框
function PicBox_Show(index) {
    var picBox = document.getElementById('divCenter');
    var divArr;
    if (live_final) {
        divArr = $('#pic-list-node div');
    } else {
        var pcn = df_Document.getElementById("pic-list-node");
        divArr = pcn.getElementsByTagName("div");
    }

    for (i = index - 2 * 2; i < divArr.length; i++) {
        if (i < 0) {
            continue;
        }

        if (divArr[i].getElementsByTagName("img").length > 0) {
            var img = new Image();
            img.src = divArr[i].getElementsByTagName("img")[0].src;

            if (divArr[i].className == "pic-div record-pic") {
                img.style.border = "8px solid red";
            } else if (i == index) {
                img.style.border = "8px solid blue";
            } else {
                img.style.border = "3px solid black";
            }

            var changerWidth = false;
            if (img.width > img.height) {
                if (img.width > 462) {
                    img.width = 462;
                }
            } else {
                if (img.height > 475) {

                    img.height = 475;
                }
            }

            picBox.appendChild(img);
        }
        if (i - index > 5 * 2) {
            break;
        }
    }

    picBox.style.display = "block";

    var pcn = df_Document.getElementById("show-pic");
    if (pcn != null) {
        pcn.click();
    }
}

function PicBox_Close() {
    var v = document.getElementById('divCenter');
    v.style.display = "none";
    while (v.hasChildNodes()) //当div下还存在子节点时 循环继续  
    {
        v.removeChild(v.firstChild);
    }

    var pcn = df_Document.getElementById("show-pic");
    if (pcn != null) {
        pcn.click();
    }

}

var div = document.createElement("div");
div.id = "myDiv";
div.innerHTML = '<div id="divCenter" align="center" style="position: absolute; z-index: 9; display: none; background-color: black; width:1840px; height:870px;left:50px;top:50px; " ></div>';
div.onclick = function () {
    PicBox_Close();
};

document.body.appendChild(div);



function Check() {
    if (!turn)
        return;



    txInfo.textContent = wHeaderText.innerText;

    var u = UID;
    initUserInfo();

    var ReportTime = 0;
    var LastLive = false;
    var lastTime = 0;
    var TenMin = false;

    // todo 由于图片加载有延迟，所以这些图片有可能没有被更改到，现在是每一次都重复写
    //超过举报时间5分钟和10分钟的图片，图片底色更改。
    //if (ReportTime.getTime() > 0) {
    var divArr;
    if (live_final) {
        divArr = $('#pic-list-node div');
    } else {
        var pcn = df_Document.getElementById("pic-list-node");
        divArr = pcn.getElementsByTagName("div");
    }

    //遍历图片
    for (i = 0; i < divArr.length; i++) {
        var d = divArr[i];
        var cn = d.className;
        if (cn != "") {
            var rpTime = new Date(divArr[i + 1].innerText);
            if (ReportTime == 0) {
                ReportTime = rpTime;
                lastTime = rpTime;
            }

            if (TwoLive != false) {
                if (!LastLive) {
                    if ((lastTime.getTime() - rpTime.getTime()) > (60000 * TwoLive)) {
                        LastLive = true
                    }
                }
                lastTime = rpTime;
            }


            if (rpTime != "Invalid Date") {
                //  divArr[i + 1].innerHTML = divArr[i + 1].innerText.substring(5, 20) + ";";
                if (d.getElementsByTagName("img").length > 0) {
                    if (OnReRatio) {
                        //将图片的比例恢复正常
                        //问题图片大小不一
                        //宽图片显示面积不大。（旋转90度？
                        var img = d.getElementsByTagName("img")[0];
                        var pic = new Image();
                        pic.src = img.src;
                        var imgHeight = pic.height;
                        var imgWidth = pic.width;
                        var maxWidth = 170;
                        var maxHeight = 200;
                        if (imgWidth >= maxWidth || imgHeight >= maxHeight) {
                            if (imgWidth / imgHeight < 2) {
                                var sb = imgWidth / maxWidth;
                                img.style.height = imgHeight / sb;
                                img.style.width = maxWidth;
                            } else {
                                var sb = img.height / maxHeight;
                                img.style.width = imgWidth / sb;
                                img.style.height = maxHeight;
                            }
                        }
                        //   d.style.height = img.style.height + 50;
                    }

                    (function () {
                        var index = i;
                        d.onclick = function () {
                            (function () {
                                PicBox_Show(index);
                            })();
                        };
                    })();
                }

                if (cn != "pic-div record-pic") {//非高危图片（高危图片保留原来的颜色）
                    var t = ReportTime.getTime() - rpTime.getTime();
                    if (LastLive) {
                        d.style.background = "blue";
                    } else if (t > 600000) {//10分钟
                        d.style.background = "#A07070";
                        TenMin = true;
                    } else if (t > 300000) {//5分钟
                        d.style.background = "#CFB47E";
                    }
                    i += 1;
                }
            }
        }
    }

    if (TwoLive != false) {
        if (TenMin) {
            // btTS_TenMin.style.display = "";
        } else {
            //  btTS_TenMin.style.display = "none";
        }
    }


    if (UID == "NONE" || UID == u) {
        return;
    }
    if (DEBUG) console.log("切换UID：" + UID);



    if (UID != u) {
        //显示记录的上一个UID
        var dd = df_Document.getElementsByClassName("live-p4-1");
        for (s = 0; s < dd.length; s++) {
            dd[s].addEventListener("click", function () {
                pushHistoryUID(UID);
            });
        }
    }



    //快捷键  DEBUG
    if (live_first) {
        // console.log("ShortKey");
        // df_Document.onkeydown = function (event) {
        //     onFirstKeyDown(event.keyCode);
        // }
    }


    //特殊UID
    var description = IsSpUID(UID);
    if (description != "") {
        SSSRemind();
        btTS_SUID.setAttribute("value", description + ":" + UID);
        btTS_SUID.style.display = "";
    } else {
        btTS_SUID.style.display = "none";
    }



    var pic_btn = df_Document.getElementById("pic-btn");
    if (pic_btn != null) {

        //在后面添加特殊规则
        if (getSpRule(Country) != "") {
            btTS_SpRule.style.display = "";
            btTS_SpRule.innerHTML = getSpRule(Country);
        } else {
            btTS_SpRule.style.display = "none";
        }
    }




    //私密房间
    if (PrivateRoom) {
        SSSRemind();
        btTS_SMFJ.style.display = "";
        var x = df_Document.getElementsByClassName("live-p4-1");
        // console.log("live-p4-1.length:" + x.length);
        for (s = 0; s < x.length; s++) {
            if (x[s].innerText.trim() == "违规") {
                x[s].innerHTML = "违规\r\n（私密房间!!!!!!只处罚A类!!!!!!）";
            }
        }
    } else {
        btTS_SMFJ.style.display = "none";
    }

    if (Level > BigLevel) {
        btTS_DJ.setAttribute("value", "高等级:" + Level);
        btTS_DJ.style.display = "";
    } else {
        btTS_DJ.style.display = "none";
    }

    if (Diamond > TuHao) {
        btTS_ZS.setAttribute("value", "钻石数:" + Diamond);
        btTS_ZS.style.display = "";
    } else {
        btTS_ZS.style.display = "none";
    }

    //初审备注
    if (live_final) {
        if (Remark != "") {
            var sRemark = Remark.split("(")[0];
            if (sRemark != "") {
                SSSRemind();
                btTS_Remark.setAttribute("value", "备注:" + sRemark);
                btTS_Remark.style.display = "";
            } else {
                btTS_Remark.style.display = "none";
            }
        }
    } else {
        btTS_Remark.style.display = "none";
    }
}


function SSSRemind() {
    var vv = df_Document.getElementById("page-body");
    vv.style.background = "#A8E5AF";
}

function AddToBreadcrumbs(id, bt) {
    var ele = document.getElementById(id);
    if (ele == null) {
        var breadcrumb = document.getElementById("breadcrumbs");
        if (breadcrumb != null)
            breadcrumb.appendChild(bt);
    } else {
        ele.style.display = "block";
    }
}


function getSpRule(country) {

    return "挂机-B类；其他警告<br>播放视频，刷网页改标签；<br>普通擦边（裸上身、抽烟、内衣单张图等）不处理";
}

function IsSpUID(uid) {
    for (i = 0; i < SpUID.length; i++) {
        var uids = SpUID[i][1];
        if (uids.search(uid) != -1) {
            var des = SpUID[i][0];
            if (SpUID[i].length > 2) {
                var sTime = new Date(SpUID[i][2]);
                var eTime = new Date(SpUID[i][3]);
                var nowTime = new Date();
                if (nowTime > sTime && nowTime < eTime) {
                    return des;
                }
            } else {
                return des;
            }
        }
    }
    return "";
}


//*****************************下面是提示按钮 */

var btTS_ArrayS = new Array();
btTS_ArrayS.push(btTS_SpRule);

var btTS_SMFJ = document.createElement("input");
btTS_SMFJ.id = "TS_SMFJ";
btTS_SMFJ.setAttribute("type", "button");
btTS_SMFJ.setAttribute("value", "私密房间");
btTS_SMFJ.style.width = "200px";
btTS_SMFJ.style.height = "65px";
btTS_SMFJ.style.fontSize = "20px";
btTS_SMFJ.style.background = "#FF0000";
btTS_SMFJ.style.color = "white";
btTS_SMFJ.style.display = "none";
btTS_ArrayS.push(btTS_SMFJ);

var btTS_DJ = document.createElement("input");
btTS_DJ.id = "TS_DJ";
btTS_DJ.setAttribute("type", "button");
btTS_DJ.setAttribute("value", "等级");
btTS_DJ.style.height = "65px";
btTS_DJ.style.fontSize = "20px";
btTS_DJ.style.align = "center";
btTS_DJ.style.background = "#0BF124";
btTS_DJ.style.color = "#000000";
btTS_DJ.style.display = "none";
btTS_ArrayS.push(btTS_DJ);

var btTS_ZS = document.createElement("input");
btTS_ZS.id = "TS_ZS";
btTS_ZS.setAttribute("type", "button");
btTS_ZS.setAttribute("value", "钻石");
btTS_ZS.style.height = "65px";
btTS_ZS.style.fontSize = "20px";
btTS_ZS.style.align = "center";
btTS_ZS.style.background = "#00E4FF";
btTS_ZS.style.color = "#007684";
btTS_ZS.style.display = "none";
btTS_ArrayS.push(btTS_ZS);

var btTS_SUID = document.createElement("input");
btTS_SUID.id = "TS_SUID";
btTS_SUID.setAttribute("type", "button");
btTS_SUID.setAttribute("value", "特殊UID");
btTS_SUID.style.fontSize = "20px";
btTS_SUID.style.height = "65px";
btTS_SUID.style.align = "center";
btTS_SUID.style.background = "#FF18B9";
btTS_SUID.style.color = "#FFFFFF";
btTS_SUID.style.display = "none";
btTS_ArrayS.push(btTS_SUID);

var btTS_Remark = document.createElement("input");
btTS_Remark.id = "TS_Remark";
btTS_Remark.setAttribute("type", "button");
btTS_Remark.setAttribute("value", "备注");
btTS_Remark.style.fontSize = "20px";
btTS_Remark.style.height = "65px";
btTS_Remark.style.align = "center";
btTS_Remark.style.background = "#FF18B9";
btTS_Remark.style.color = "#FFFFFF";
btTS_Remark.style.display = "none";
btTS_ArrayS.push(btTS_Remark);


for (i = 0; i < btTS_ArrayS.length; i++) {
    wHeader.appendChild(btTS_ArrayS[i]);
}