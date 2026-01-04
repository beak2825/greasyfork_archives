// ==UserScript==
// @name           Twitter过滤器
// @description    Twitter推特关键词、昵称过滤器。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @version      2.12
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @match       https://twitter.com/*
// @exclude     https://twitter.com/i/*
// @include      https://x.com/*
// @exclude     https://x.com/i/*
// @exclude     https://x.com/intent/*
// @exclude     https://twitter.com/intent/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/427274/Twitter%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/427274/Twitter%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==
var i, j, c, fl, fk, x, a, b, mo = 0,
    glzs = 0;

function debugx() {
    glzs++;
    $(".xfsz_sz").text(glzs);
    return 1; // 1 显示log； 0 隐藏log
}
var toObj = (arr) => {
    var obj = {};
    for (var temp in arr) {
        obj[arr[temp]] = true;
    }
    return obj;
};
var toArr = (obj) => {
    var arr = [];
    for (var temp in obj) {
        arr.push(temp);
    }
    return arr;
};
var together = (a, b) => {
    for (var temp = 0; temp < b.length; temp++) {
        if (b[temp] != null && b[temp] != "" && b[temp] != "null" && b[temp].length < 40) {
            a.push(b[temp] + "");
        }
    }
};
var getUniq = (arr) => Array.from(new Set(arr))
//dd 都屏蔽， bt 只屏蔽正文关键词， zz 只屏蔽昵称
var dd = GM_getValue("dd", new Array(""));
var bt = GM_getValue("golvci", new Array(""));
var zz = GM_getValue("zz", new Array(""));
var ddx = new Array();
var btx = new Array();
var zzx = new Array();
let glc = new Array(ddx, btx, zzx);
let glcx = new Array(dd, bt, zz);
let nglc = new Array();
let ml = new Array("dd", "golvci", "zz")
let xfz = 0;
together(ddx, dd);
together(btx, bt);
together(zzx, zz);

GM_addValueChangeListener('dd', function (name, old_value, new_value, remote) {
    dd = new_value;
    glc[0] = dd.concat();
    bt.push.apply(bt, dd);
    zz.push.apply(zz, dd);
})
GM_addValueChangeListener('golvci', function (name, old_value, new_value, remote) {
    bt = new_value;
    glc[1] = bt.concat();
    bt.push.apply(bt, dd);
})
GM_addValueChangeListener('zz', function (name, old_value, new_value, remote) {
    zz = new_value;
    glc[2] = zz.concat();
    zz.push.apply(zz, dd);
})

function bc() {
    //保存
    for (var i = 0; i < 3; i++) {
        glc[i] = getUniq(glc[i]);
        glcx[i] = new Array();
        together(glcx[i], glc[i]);
        GM_setValue(ml[i], glcx[i]);
        glc[i] = new Array();
        together(glc[i], glcx[i]);
    }
    dd = glc[0].concat();
    bt = glc[1].concat();
    zz = glc[2].concat();
    bt.push.apply(bt, dd);
    zz.push.apply(zz, dd);
}
bc();

function glyc() {
    //console.log("开始过滤");
    var nurl = window.location.href;
    if (nurl.indexOf("/hashtag/")>0 || nurl.indexOf("/search?")>0){
        //搜索页面过滤
        $(`article div[data-testid="User-Name"]:not([fi])`).each(function () {
            $(this).attr('fi', '1');
            var x = $(this).find('div:first').text();
            var y = $(this).find('div:nth-child(2)>div:first>div:first').text();
            //console.log("搜索判断  ", x,"  :  ", y);
            if (/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(x) && /^@([A-Z_a-z]+)[0-9]+$/.test(y)) {
                //昵称 ID符合广告号，过滤
                var zd = 0;
                var pa = $(this).parent();
                for (var i = 0; i < 30; i++) {
                    pa = $(pa).parent();
                    if ($(pa).prop("tagName").toLowerCase()=="article") {
                        zd = 1;
                        break;
                    }
                }
                if (zd == 1) {
                    $(pa).html("");
                console.log("删除　广告昵称 ", x, "  ID ", y);
                glzs++;
                $(".xfsz_sz").text(glzs);
                }
            }
        })
    }
    $(`div[data-testid="cellInnerDiv"]:not([fil])`).each(function () {
        var x = 0;
        var y = $(this).find(`div[data-testid="User-Name"] > div:nth-child(1) a[role="link"]`).text().toLowerCase().replace(/\n/g, " ").replace(/\s\s/g, " ");
        //console.log("判断 ", "  :  ", y);
        if (y.length < 1) return;
        $(this).attr('fil', '1');
        for (var j = 0; j < zz.length; j++) {
            if (zz[j] != "" && y.indexOf(zz[j]) > -1) {
                x = 1;
                break;
            }
        }
        if (x == 1) {
            console.log("删除　昵称 [ ", zz[j], " ]  :  ", y);
            glzs++;
            var zd = 0;
            $(".xfsz_sz").text(glzs);
            //topics[i].remove();
            $(this).html("");
        }
    });
    $(`article div[dir="auto"][lang]:not([fil])`).each(function () {

        var x = 0;
        var y = $(this).text().toLowerCase().replace(/\n/g, " ").replace(/\s\s/g, " ").split("---")[0];
        if (y.length < 2) return;
        $(this).attr('fil', '1');
        //console.log("判断 ", "  :  ", y);
        for (var j = 0; j < bt.length; j++) {
            if (bt[j] != "" && y.indexOf(bt[j]) > -1) {
                x = 1;
                break;
            }
        }
        if (x == 1) {
            console.log("删除关键词 [ ", bt[j], " ]  :  ", y);
            glzs++;
            $(".xfsz_sz").text(glzs);
            //topics[i].remove();
            $(this).parent().parent().parent().parent().parent().parent().parent().parent().html("");
        }
    });
    return true;
}

var wz = location.href;
var xh;
glyc();
var aaa = new Date();
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (records) {
    var bbb = new Date();
    if (bbb - aaa > 200) {
        aaa = bbb;
        records.map(function (record) {
            if (record.addedNodes) {
                glyc();
            }
        });
    }
});
var option = {
    childList: true,
    subtree: true,
};
observer.observe(document.body, option);


//--------------左下角按钮--设置界面-------------
let wdstyle = document.createElement('style');
wdstyle.innerHTML = `
.xfsz {
    height: 80px;
    width: 80px;
    position: fixed;
    transition: 0.5s;
    z-index: 9999;
    opacity: 0;
    left: 0px;
    bottom: 0px;
  }
  .xfsz:hover {
    opacity: 1;
  }
  .xfsz_an {
    left: 1vw;
    bottom: 1vw;
    background-color: rgb(29, 161, 242);
    border-radius: 19px;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    height: 38px;
    width: 38px;
    line-height: 38px;
    position: absolute;
    text-align: center;
    z-index: 99999;
    user-select: none;
    display: block;
  }
  .xfsz_sz{
    left: 30px;
    bottom: 0px;
    background-color: #333;
    border-radius: 25px;
    color: #fff;
    cursor: pointer;
    font-size: 10px;
    height: 25px;
    width: 25px;
    line-height: 25px;
    position: absolute;
    text-align: center;
    z-index: 99999;
    user-select: none;
    display: block;
  }
  .xfck {
    display: none;
    background: #222;
    width: 700px;
    height: 640px;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 99999;
    border: solid 3px #000000;
  }
  .xfsc {
    background: #444;
    right: 20px;
    border-radius: 35px;
    margin-bottom: 13px;
    margin-right: 10px;
    margin-left: 10px;
    cursor: pointer;
    border: solid 5px #444;
    white-space: nowrap;
    float: left;
  }
  .xfsc:hover {
    background: #000;
    border: solid 5px #000;
  }
  .xfan {
    width: 100px;
    height: 40px;
  }
  .xfyy {
    overflow: auto;
    width: 700px;
    height: 430px;
    margin: auto;
  }
  #xf_sr {
    width: 580px;
    height: 32px;
    margin: auto;
  }
  #xf_dc {
    margin-left: 40px;
    margin-right: 40px;
  }
  .xfgb {
    position: absolute;
    right: 3px;
    top: 3px;
    cursor: pointer;
    font-size: 40px;
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .xfgb:hover {
    background: #f00;
  }
  .tabbox ul {
    list-style: none;
    display: table;
    margin: 0;
    padding-left: 70px;
    width: 1000px;
  }
  .tabbox ul li {
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border: 1px solid #aaccff;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
  }

  .tabbox ul li:hover{
    background-color: #111;
    color: white;
    font-weight: bold;
  }
  .tabbox ul li.active {
    background-color: #004f69;
    color: white;
    font-weight: bold;
  }
  .xfan,
  #xf_sr {
    background: #333;
    color: #ddd;
  }
  .xfan:hover,
  #xf_sr:focus {
    background: #111;
    color: #fff;
  }

  `;
let wddiv = `
<div class="xfsz">
    <span class="xfsz_an" title="过滤设置">
    滤
    <span class="xfsz_sz">0
    </span>
    </span>
</div>
<div class="xfck">
    <div>Twitter过滤设置</div>
    <div class="xfgb">X
    </div>
    <div>
        <textarea type="text" name="textfield" id="xf_sr" width="auto"></textarea>
        <br>
        不同过滤词用英文 , 分隔；导入会清空已有的，替换为导入的，导入空白等于删除全部过滤词。
        <br>
        <input type="submit" name="submit" id="xf_zj" class="xfan" value="增加">
        <input type="submit" name="submit" id="xf_dc" class="xfan" value="导出">
        <input type="submit" name="submit" id="xf_dr" class="xfan" value="导入">
    </div>
    <div class="tabbox">
        　　<ul>
            　　　　<li class="active">关键词+昵称</li>
            　　　　<li>关键词</li>
            　　　　<li>昵称</li>
            　　</ul>
        <br>
        <div class="xfyy"></div>
    </div>
</div>
`;
document.body.appendChild(wdstyle);
setTimeout(() => {
    document.querySelector("body").innderHTML += wddiv;
    $(wddiv).appendTo($("body"));
    //关闭
    $(".xfgb").click(function () {
        $(".xfck").toggle();
    })
    $(".xfsz_an").click(function () {
        sc();
        $(".xfck").toggle();
    });

    $(".tabbox ul li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        //获取选中元素的下标
        var index = $(this).index();
        $(this).parent().siblings().children().eq(index).addClass("active")
            .siblings().removeClass("active");
        xfz = index;
        sc();
    })
    //删除
    function sc() {
        $(".xfyy").empty();
        glc[xfz].forEach(glcc => {
            let a = document.createElement("span");
            $(a).text(glcc).addClass("xfsc");
            $(a).click(function () {
                glc[xfz] = glc[xfz].filter(item => {
                    return item != $(a).text();
                })
                bc();
                sc();
            })
            $(a).appendTo($(".xfyy"));
        });
    }
    sc();

    //增加
    $("#xf_zj").click(function () {
        nglc = $("#xf_sr").val().split(",");
        together(glc[xfz], nglc);
        glc[xfz] = getUniq(glc[xfz]);
        bc();
        sc();
        $("#xf_sr").val("")
    });

    //导出
    $("#xf_dc").click(function () {
        let s = "";
        glc[xfz].forEach((x) => {
            s += x + ","
        })
        $("#xf_sr").val(s).select();
    });
    //导入
    $("#xf_dr").click(function () {
        glc[xfz] = $("#xf_sr").val().split(",");
        bc();
        sc();
        $("#xf_sr").val("");
    });

    function glsjy() {

    }
}, 1000);