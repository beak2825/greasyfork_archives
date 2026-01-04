// ==UserScript==
// @name Youtube关键词屏蔽
// @description Youtube屏蔽与相应关键词有关的视频与直播。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 2.0
// @include *youtube.com*
//@exclude *watch?*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419003/Youtube%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/419003/Youtube%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var i, j, c, fl, fk, x, a, b, mo = 0,
    glzs = 0;
var sptime = 5; //过滤的短视频时长，分钟
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
//dd 都屏蔽， bt 只屏蔽标题， zz 只屏蔽频道， sp屏蔽频道下的短视频
var dd = GM_getValue("dd", new Array(""));
var bt = GM_getValue("bt", new Array(""));
var zz = GM_getValue("zz", new Array(""));
var sp = GM_getValue("sp", new Array(""));
var ddx = new Array();
var btx = new Array();
var zzx = new Array();
var spx = new Array();
let glc = new Array(ddx, btx, zzx, spx)
let glcx = new Array(dd, bt, zz, sp)
let nglc = new Array();
let ml = new Array("dd", "bt", "zz", "sp")
let xfz = 0;
together(ddx, dd);
together(btx, bt);
together(zzx, zz);
together(spx, sp);


GM_addValueChangeListener('dd', function (name, old_value, new_value, remote) {
    dd = new_value;
    glc[0] = dd;
    bt.push.apply(bt, dd);
    zz.push.apply(zz, dd);
})
GM_addValueChangeListener('bt', function (name, old_value, new_value, remote) {
    bt = new_value;
    glc[1] = bt;
    bt.push.apply(bt, dd);
})
GM_addValueChangeListener('zz', function (name, old_value, new_value, remote) {
    zz = new_value;
    glc[2] = zz;
    zz.push.apply(zz, dd);
})
GM_addValueChangeListener('sp', function (name, old_value, new_value, remote) {
    sp = new_value;
    glc[3] = sp;
})

function bc() {
    //保存
    for (var i = 0; i < 4; i++) {
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
    sp = glc[3].concat();
    bt.push.apply(bt, dd);
    zz.push.apply(zz, dd);
}
bc();

function glyc() {
    //console.log("开始过滤");
    var d;
    //短视频
    fl = document.querySelectorAll("#text:not([fil-sp])")
    for (i = fl.length - 1; i > -1; i--) {
        if (fl[i] != null) {
            d = 1;
            for (x = 0; x < sp.length; x++) {
                if (sp[x] != "") {
                    a = fl[i];
                    b = a.innerText;
                    if (b.toLowerCase().indexOf(sp[x].toLowerCase()) > -1) {
                        d = 0;
                        while (true) {
                            //console.log('当前 ' + a.tagName.toLowerCase()+'  :  '+a );
                            if (a.tagName.toLowerCase().indexOf("body") > -1) {
                                a = b;
                                break;
                            }
                            if (a.tagName.toLowerCase().indexOf("ytd-compact-video-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-grid-video-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-rich-item-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-video-renderer") > -1) {
                                break;
                            }
                            a = a.parentNode;
                        }
                        if (b == 1 || a.innerText == null) break;
                        b = a.querySelector("#overlays > ytd-thumbnail-overlay-time-status-renderer > span");
                        if (b == null) break;
                        c = b.innerText.replace(/\n/g, "").replace(/\s/g, "");
                        b = c.split(":")[0];
                        if (b >= sptime || b.length > 1 || c.length > 5) {
                            //console.log('判断为好: [' + sp[x] + ']   时长:' + c);
                            fl[i].setAttribute('fil-sp', '1');
                            break;
                        }
                        if (debugx()) {
                            console.log('移除短视频频道: [' + sp[x] + ']   时长:' + c);
                            console.log(a.innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            console.log(' ');
                        }
                        a.remove();
                        break;
                    }

                }

            }
            if (d == 1) {
                fl[i].setAttribute('fil-sp', '2');
            }
        }
    }
    //频道
    fl = document.querySelectorAll("#text:not([fil-zz])")
    for (i = fl.length - 1; i > -1; i--) {
        d = 0;
        for (x = 0; x < zz.length; x++) {
            if (zz[x] != "") {
                a = fl[i];
                b = a.innerText;
                if (b.toLowerCase().indexOf(zz[x].toLowerCase()) > -1) {
                    while (true) {
                        //console.log('当前 ' + a.tagName.toLowerCase()+'  :  '+a );
                        if (a.tagName.toLowerCase().indexOf("body") > -1) {
                            a = b;
                            break
                        }
                        if (a.tagName.toLowerCase().indexOf("ytd-compact-video-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-grid-video-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-rich-item-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-video-renderer") > -1) {
                            break
                        }
                        a = a.parentNode;
                    }
                    if (b == 1 || a.innerText == null) {
                        fl[i].setAttribute('fil-zz', '1');
                        continue;
                    }
                    if (debugx()) {
                        console.log('移除频道: [' + zz[x] + ']   ' + b);
                        console.log(a.innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        console.log(' ');
                    }
                    a.remove();
                    break;
                } else {
                    fl[i].setAttribute('fil-zz', '1');
                }
            }

        }
        if (d == 1) {
            fl[i].setAttribute('fil-zz', '1');
        }
    }
    //关键词
    fl = document.querySelectorAll("#video-title:not([fil-bt])");
    for (i = fl.length - 1; i > -1; i--) {
        d = 0;
        for (x = 0; x < bt.length; x++) {
            if (bt[x] != "") {
                a = fl[i];
                b = a.innerText;
                if (b.toLowerCase().indexOf(bt[x].toLowerCase()) > -1) {
                    while (true) {
                        if (a.tagName.toLowerCase().indexOf("body") > -1) {
                            b = 1;
                            break
                        }
                        if (a.tagName.toLowerCase().indexOf("ytd-compact-video-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-grid-video-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-rich-item-renderer") > -1 || a.tagName.toLowerCase().indexOf("ytd-video-renderer") > -1) {
                            break
                        }
                        a = a.parentNode;
                    }
                    if (b == 1 || a.innerText == null) {
                        fl[i].setAttribute('fil-bt', '1');
                        continue;
                    }
                    if (debugx()) {
                        console.log('移除关键词: [' + bt[x] + ']   ' + b);
                        console.log(a.innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                        console.log(' ');
                    }
                    a.remove();
                    break;
                } else {
                    fl[i].setAttribute('fil-bt', '1');
                }
            }
        }
        if (d == 1) {
            fl[i].setAttribute('fil-bt', '1');
        }
    }
    return true;
}

var wz = location.href;
var xh;
setTimeout(glyc, 4000);
setInterval(glyc, 8000);

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
    <div>Youtube过滤设置 作用于首页、流行、订阅 及播放页面右侧的推荐</div>
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
            　　　　<li class="active">标题+频道</li>
            　　　　<li>标题</li>
            　　　　<li>频道</li>
            　　　　<li>短视频过滤频道</li>
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