// ==UserScript==
// @name 抖音关键词屏蔽
// @description 抖音屏蔽与相应关键词有关的视频与直播。左下角隐藏按钮进入设置页面、显示当前页面过滤数量。可批量添加关键词，用英文逗号,分割。支持导入导出。
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 1.4.10
// @include https://www.douyin.com/*
// @include https://www.douyin.com/re*
// @include https://www.douyin.com/?*
// @include https://www.douyin.com/follow
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/432275/%E6%8A%96%E9%9F%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/432275/%E6%8A%96%E9%9F%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var i, j, c, fl, fk, x, a, b, mo = 0,al,
    glzs = 0;

function debugx() {
    glzs++;
    $(`.xfsz_sz`).text(glzs);
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
    al="";
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
function gldq(x){
    if (location.href.indexOf("/follow")>-1){
        setTimeout(function (){
            console.log("当前已关注，不屏蔽，进入下一个视频");
            $(`div.swiper-slide.swiper-slide-active div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
        },500);
        x=2;
        return;
    }
    var isfollowed,yj;
    isfollowed=false;
    $(`div[data-e2e="feed-active-video"] div.playerContainer div.OFZHdvpl > div:nth-child(1) > div > div > div:nth-child(1)`).each(function () {
        if (typeof($(this).attr("hidden")) != "undefined") {
            isfollowed = true;
        }
    });
    if  (isfollowed){
        console.log("当前已关注，不屏蔽，进入下一个视频");
        $(`div.swiper-slide.swiper-slide-active div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
        return;
    };
    if (x==1){
        setTimeout(function(){gldq(0);},500);
    }
    if (x<2){
        yj=0;
        //console.log("不感兴趣当前  ",x);
        $(`div[data-e2e="feed-active-video"] div[data-e2e="video-player-no-like"]`).each(function (){
                //console.log("找到  ",$(this));
            if (yj==0 && $(this).text().indexOf("不感兴趣")>-1){
                console.log("点击  ",$(this));
                $(this).click();
                yj=1;
            }
        });
    }
    if(x>2){
        if  (!isfollowed){
            setTimeout(function (){
               console.log("无描述，不屏蔽，进入下一个视频");
               $(`div.swiper-slide.swiper-slide-active div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
            },500);
            x=2;
            return;
        }
    }
}
function keydown(event) {
    //79 o 80 p
    //console.log(event.keyCode);
    if (event.keyCode == 79 || event.keyCode == 98) {//o，num2
        console.log("不感兴趣当前  ",$(`div[data-e2e="feed-active-video"]`).text().replace(/\n/g, " ").replace(/\s\s/g, " "));
        glzs++;
        $(`.xfsz_sz`).text(glzs);
        gldq(0);
    }
    if (event.keyCode == 73 || event.keyCode == 97) {//i，num1
        //console.log("上一个视频");
        $(`div[data-e2e="feed-active-video"] div.xgplayer-playswitch div.xgplayer-playswitch-prev`).click();
    }
    if (event.keyCode == 80 || event.keyCode == 99) {//p，num3
        //console.log("下一个视频");
        $(`div[data-e2e="feed-active-video"] div.xgplayer-playswitch div.xgplayer-playswitch-next`).click();
    }
}
document.addEventListener('keydown', keydown, false);
function glyc() {
    //console.log("开始过滤");
    $(`div[data-e2e="feed-active-video"]`).each(function () {
        x = 0;
        var y = $(`div[data-e2e="feed-active-video"] #video-info-wrap > div.video-info-detail > div.account`).text();
        if (y==null || y==al)return;
        if (y!=null){
            //console.log("判断昵称   :  ", y);
            for (var j = 0; j < zz.length; j++) {
                if (zz[j] != "" && y.indexOf(zz[j]) > -1) {
                    x = 1;
                    console.log("删除　昵称 [ ", zz[j], " ]  :  ", y);
                    break;
                }
            }
            al=y;
        }
        y=$(`div[data-e2e="feed-active-video"] #video-info-wrap > div.video-info-detail > div.title`).text();
        if (y==null)return;
        if (x==0 && y!=null){
            //console.log("判断标题 ", "  :  ", y);
            for (j = 0; j < bt.length; j++) {
                if (bt[j] != "" && y.indexOf(bt[j]) > -1) {
                    console.log("删除关键词 [ ", bt[j], " ]  :  ", y);
                    x = 1;
                    break;
                }
            }
        }
        y=$(`div[data-e2e="feed-active-video"] div.title div.RA5iG98_`).text();
        if (y==null)return;
        if (x==0 && y!=null){
            //console.log("判断标题 ", "  :  ", y);
                if (y.indexOf("广告") > -1) {
                    console.log("删除关键词 [ 广告 ]  :  ", y);
                    x = 1;
            }
        }

        //console.log(y,"  :  ", y.length);
        if  (x==0 && (y.length<1)){
            //console.log("无标题，直接过滤  :  ", y);
            //x = 3;
        }
        if (x == 1 || x==3) {
            glzs++;
            $(`.xfsz_sz`).text(glzs);
            gldq(x);
            x=2;
        }
    });
    return true;
}

var wz = location.href;
var xh;
glyc();
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (records) {
    records.map(function (record) {
        if (record.addedNodes) {
            glyc();
        }
    });
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
    height: 50px;
    width: 50px;
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
    <div>抖音 过滤设置</div>
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
    $(wddiv).appendTo($(`body`));
    //关闭
    $(`.xfgb`).click(function () {
        $(`.xfck`).toggle();
    })
    $(`.xfsz_an`).click(function () {
        sc();
        $(`.xfck`).toggle();
    });

    $(`.tabbox ul li`).click(function () {
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
        $(`.xfyy`).empty();
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
            $(a).appendTo($(`.xfyy`));
        });
    }
    sc();

    //增加
    $(`#xf_zj`).click(function () {
        nglc = $(`#xf_sr").val().split(",`);
        together(glc[xfz], nglc);
        glc[xfz] = getUniq(glc[xfz]);
        bc();
        sc();
        $(`#xf_sr").val("`)
    });

    //导出
    $(`#xf_dc`).click(function () {
        let s = "";
        glc[xfz].forEach((x) => {
            s += x + ","
        })
        $(`#xf_sr`).val(s).select();
    });
    //导入
    $(`#xf_dr`).click(function () {
        glc[xfz] = $(`#xf_sr").val().split(",`);
        bc();
        sc();
        $(`#xf_sr").val("`);
    });

    function glsjy() {

    }
}, 1000);