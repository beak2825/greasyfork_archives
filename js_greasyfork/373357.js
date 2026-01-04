// ==UserScript==
// @name       BG_Monitor
// @namespace    https://global-oss.bigo.tv
// @version      2.0
// @description  bg monitor
// @author     OLEREO!
// @match      https://global-oss.bigo.tv/a
// @match      https://global-oss.bigo.tv/A
// @downloadURL https://update.greasyfork.org/scripts/373357/BG_Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/373357/BG_Monitor.meta.js
// ==/UserScript==

Date.prototype.Format = function(fmt){
    var o = {
        "M+": this.getMonth()+1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S+": this.getMilliseconds()
    };

    //因位date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：



    if(/(y+)/.test(fmt)){
        //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。

        fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    }
    for(var k in o){
        if (new RegExp("(" + k +")").test(fmt)){

            //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。

            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
        }
    }
    return fmt;
}

//region  bigo_monitor_info.ini
let Live_QuYu = [
    ["IN", "IN 印度(IN;PK;PH;TR;BD)", "20", ";IN;PK;PH;TR;BD;", "https://i.loli.net/2018/05/23/5b048411e6309.png"],
    ["ID", "ID 印尼(ID;RU)", "20", ";ID;RU", "https://i.loli.net/2018/05/23/5b048411e7b3b.png"],
];

let Pic_FenBu = [
    ["ME", "ME 中东(ME)", "100", ";ME;", "https://i.loli.net/2018/05/23/5b048411ed3bb.png"],
];

const fmjd_YuZhi = 100;

//初审待审核
const cszjd_YuZhi = 60;

//终审待审核
const zszjd_YuZhi = 30;

//总部初审总待检数
value_BenBuChuShengJiDan_YuZhi = 30;

//初审机审
const csjs_YuZhi = 20;

//初审总部用户
const csyh_YuZhi = 20;

const value_BenBuTuPian_YuZhi = 150;


//当离线时间超过这个秒数，则记录下来；
let liWeiShiChang = 150;



const NotificationIcon = {
    ChuShengJiSheng: "https://i.loli.net/2018/05/23/5b0474136cf36.png",
    ChuSheng: "https://i.loli.net/2018/05/23/5b0483ec65d87.jpg",
    ZhongSheng: "https://i.loli.net/2018/05/23/5b048411ebd35.png",
    ChuShenJuBao: "https://i.loli.net/2018/07/28/5b5c0d77d6dd7.png",
    TouXiang: "https://i.loli.net/2018/07/28/5b5c0db1ef5d8.png",
    AllFengMian: "https://i.loli.net/2018/05/23/5b0483ec67627.png"
};
//endregion

//region bigo_monitor_base.js
let myVersion = GM_info.script.version;
let DEBUG = myVersion === "DEBUG";

document.body.innerHTML = "";
document.title = "监控数据 " + myVersion;

const queue = function (funcs, scope) {
    (function next() {
        if (funcs.length > 0) {
            funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
        }
    })();
};

String.prototype.have = function (str) {
    str = str.replace(")", "").replace("(", "");
    let s = this.replace(")", "").replace("(", "");
    return (s.search(str) > -1);
};



function logM(log) {
    if(DEBUG){
        console.log(log);
    }
}

//传输到网上的 JSON 格式
let BacklogMonitor = {
    UpdateTime: -1,
    LiveBacklog: {
        LiveFirst: {
            Total: -1,
            MachineInspectionTotal: -1,//本部机审
            Diff_Division_UR: -1,//营口（减去区域的用户举报工单。
            Division_UR: [
                {
                    Tag: "Division_Test",
                    Name: "Test CN",
                    Country: ";CN;",
                    Threshold: "20",
                    NoticeIcon: "https://i.loli.net/2018/05/23/5b048411e6309.png",
                    Backlog: -1
                }
            ]
        },

        LiveFinal: {
            Total: -1
        }
    },

    ImageBacklog: {
        Avatar: {
            Total: -1,
            Diff_Division: -1,
            Division: [//分部头像
                {
                    Tag: "Avatar_Division_TAG",
                    Name: "Avatar_Name",
                    Threshold: "200",
                    Country: ";CN;TH",
                    NoticeIcon: "https://i.loli.net/2018/05/23/5b048411e6309.png",
                    Backlog: -1
                }
            ]
        },

        Cover: {
            Total: -1,
        },
    }
};

function isUpdate(key, time) {
    let lastUpdateTime = sessionStorage.getItem(key);
    sessionStorage.setItem(key, time);

    //null 代表为第一次获取数据，为了避免数据是滞留无效的，null 值为 false
    //两次时间不一样，说明数据有变化
    return (lastUpdateTime && lastUpdateTime !== time.toString());
}

//region HashMap
function HashMap() {
    //定义长度
    var length = 0;
    //创建一个对象
    var obj = new Object();

    /**
     * 判断Map是否为空
     */
    this.isEmpty = function () {
        return length == 0;
    };

    /**
     * 判断对象中是否包含给定Key
     */
    this.containsKey = function (key) {
        return (key in obj);
    };

    /**
     * 判断对象中是否包含给定的Value
     */
    this.containsValue = function (value) {
        for (var key in obj) {
            if (obj[key] == value) {
                return true;
            }
        }
        return false;
    };

    /**
     *向map中添加数据
     */
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            length++;
        }
        obj[key] = value;
    };

    /**
     * 根据给定的Key获得Value
     */
    this.get = function (key) {
        return this.containsKey(key) ? obj[key] : null;
    };

    /**
     * 根据给定的Key删除一个值
     */
    this.remove = function (key) {
        if (this.containsKey(key) && (delete obj[key])) {
            length--;
        }
    };

    /**
     * 获得Map中的所有Value
     */
    this.values = function () {
        var _values = new Array();
        for (var key in obj) {
            _values.push(obj[key]);
        }
        return _values;
    };

    /**
     * 获得Map中的所有Key
     */
    this.keySet = function () {
        var _keys = new Array();
        for (var key in obj) {
            _keys.push(key);
        }
        return _keys;
    };

    /**
     * 获得Map的长度
     */
    this.size = function () {
        return length;
    };

    /**
     * 清空Map
     */
    this.clear = function () {
        length = 0;
        obj = new Object();
    };
}

//endregion
//endregion

//region bigo_monitor_newaudit.js

const divWFC_Left = document.createElement("div");
divWFC_Left.style.width = "30%";
divWFC_Left.style.backgroundColor = "#F9F9F9";
divWFC_Left.style.float = "left";
document.body.appendChild(divWFC_Left);

const FLAG_UL_LIVE_TOTAL_COUNT = "FLAG_UL_LIVE_TOTAL_COUNT";
const FLAG_UL_LIVE_HOME_OFFICE = "FLAG_UL_LIVE_HOME_OFFICE";
const FLAG_UL_LIVE_SEGMENT = "FLAG_UL_LIVE_SEGMENT";


const ul_LiveBase = document.createElement('ul');
const LiLiveBase = document.createElement("h2");
LiLiveBase.innerHTML = "直播";
ul_LiveBase.style.fontSize = "10px";
LiLiveBase.appendChild(ul_LiveBase);
divWFC_Left.appendChild(LiLiveBase);

const _li_Live_TotalCount = document.createElement("li");
_li_Live_TotalCount.innerHTML = "总数据";
const ul_Live_TotalCount = document.createElement("ul");
ul_Live_TotalCount.id = FLAG_UL_LIVE_TOTAL_COUNT;
_li_Live_TotalCount.appendChild(ul_Live_TotalCount);
ul_LiveBase.appendChild(_li_Live_TotalCount);

const _li_Live_HomeOffice = document.createElement("li");
_li_Live_HomeOffice.innerHTML = "本部";
const _ul_Live_HomeOffice = document.createElement("ul");
_ul_Live_HomeOffice.id = FLAG_UL_LIVE_HOME_OFFICE;
_li_Live_HomeOffice.appendChild(_ul_Live_HomeOffice);
ul_LiveBase.appendChild(_li_Live_HomeOffice);

const _li_Live_Segment = document.createElement("li");
_li_Live_Segment.innerHTML = "分部";
const _ul_live_segment = document.createElement("ul");
_ul_live_segment.id = FLAG_UL_LIVE_SEGMENT;
_li_Live_Segment.appendChild(_ul_live_segment);
ul_LiveBase.appendChild(_li_Live_Segment);


const FLAG_UL_PIC_SEGMENT = "FLAG_UL_PIC_SEGMENT";
const FLAG_UL_PIC_HME_OFFICE = "FLAG_UL_PIC_HME_OFFICE";

const ul_PicBase = document.createElement("ul");
const li_PicBase = document.createElement("h2");
ul_PicBase.style.fontSize = "10px";
li_PicBase.innerHTML = "图片";
li_PicBase.appendChild(ul_PicBase);
divWFC_Left.appendChild(li_PicBase);

const _liLivePicHomeOffice = document.createElement("li");
_liLivePicHomeOffice.innerHTML = "本部";
const _ulLivePicHomeOffice = document.createElement("ul");
_ulLivePicHomeOffice.id = FLAG_UL_PIC_HME_OFFICE;
_liLivePicHomeOffice.appendChild(_ulLivePicHomeOffice);
ul_PicBase.appendChild(_liLivePicHomeOffice);

const _liLivePicSegment = document.createElement("li");
_liLivePicSegment.innerHTML = "分部";
const _ulLivePicSegment = document.createElement("ul");
_ulLivePicSegment.id = FLAG_UL_PIC_SEGMENT;
_liLivePicSegment.appendChild(_ulLivePicSegment);
ul_PicBase.appendChild(_liLivePicSegment);


//endregion

//region bigo_monitor_newaudit_check.js
const iFrame_WaitForCount = document.createElement('iframe');
iFrame_WaitForCount.src = "";
iFrame_WaitForCount.style.display = "none";
document.body.appendChild(iFrame_WaitForCount);

let _callback;

//**初审举报积单 */
function checkNewAudit(callback) {
    _callback = callback;
    iFrame_WaitForCount.src = "https://global-oss.bigo.tv/bigoAudit/live-count/wait-for-count";
}

function checkPic(callback) {
    _callback = callback;
    iFrame_WaitForCount.src = "https://global-oss.bigo.tv/AppImgAudit/app-img-audit/index";
}


iFrame_WaitForCount.onload = function () {
    const if_document = iFrame_WaitForCount.contentWindow.document;
    let _href = iFrame_WaitForCount.contentWindow.location.href;
    logM(_href);
    if (_href === "https://global-oss.bigo.tv/bigoAudit/live-count/wait-for-count") {
        BacklogMonitor.LiveBacklog.LiveFirst.Division_UR.length = 0;
        let table = if_document.getElementsByClassName("table table-striped table-bordered")[0];
        let rows = table.rows;

        //region 初终审总数据
        let _LiveFinal_Total = 0;
        let _MachineInspection_Total = 0;
        let _UserReport_Total = 0;

        for (let g = 1; g < rows.length; g++) {
            let hang = rows[g].cells;
            _MachineInspection_Total += parseInt(hang[1].innerText);
            _UserReport_Total += parseInt(hang[2].innerText);
            _LiveFinal_Total += parseInt(hang[3].innerText);
            _LiveFinal_Total += parseInt(hang[4].innerText);
        }

        let _LiveFirst_Total = _MachineInspection_Total + _UserReport_Total;
        //endregion

        //region 分部初审用户举报
        let _Division_UR_Total = 0;
        for (let i = 0; i < Live_QuYu.length; i++) {
            let wfc = 0;

            let _division = {
                Tag: "division_" + Live_QuYu[i][0],
                Name: Live_QuYu[i][1],
                Country: Live_QuYu[i][3],
                Threshold: Live_QuYu[i][2],
                NoticeIcon: Live_QuYu[i][4],
                Backlog: 999
            };

            for (let g = 1; g < rows.length; g++) {
                let hang = rows[g].cells;
                let guoJia = hang[0].innerText;
                if (_division.Country.search(guoJia) !== -1) {
                    wfc += parseInt(hang[2].innerText);
                }
            }

            _division.Backlog = wfc;
            _Division_UR_Total += wfc;
            BacklogMonitor.LiveBacklog.LiveFirst.Division_UR.push(_division);
        }
        //endregion

        BacklogMonitor.LiveBacklog.LiveFirst.Total = _LiveFirst_Total;
        BacklogMonitor.LiveBacklog.LiveFinal.Total = _LiveFinal_Total;
        BacklogMonitor.LiveBacklog.LiveFirst.Diff_Division_UR = _UserReport_Total - _Division_UR_Total;
        BacklogMonitor.LiveBacklog.LiveFirst.MachineInspectionTotal = _MachineInspection_Total;

        logM("初终审举报积单检查完成");
        _callback();
    }else if (_href === "https://global-oss.bigo.tv/AppImgAudit/app-img-audit/index") {
        let wNotAuditedImpeachCount = if_document.getElementById("notaudited-impeach-count");
        logM(parseInt(wNotAuditedImpeachCount.innerText));
       BacklogMonitor.ImageBacklog.Avatar.Diff_Division = parseInt(wNotAuditedImpeachCount.innerText);

        logM("头像积单检查完成");
        _callback();
    }
};


//endregion

//region bigo_monitor_renyuan.js
const COLOR_ONLINE = "#71AA2D";
const COLOR_OFFLINE = "#FF7777";

const FLAG_YEWU_CHUSHEN = "初审";
const FLAG_YEWU_ZHONGSHENG = "终审";

const FLAG_YEWU_LAIYUAN_JISHENG = "机审";
const FLAG_YEWU_LAIYUAN_YONGHUJUBAO = "用户举报";
const FLAG_YEWU_LAIYUAN_YY_TO_B = "YY to B";
const FLAG_YEWU_LAIYUAN_ALL = "ALL";


const divRenYuan_Right = document.createElement("div");
divRenYuan_Right.style.width = "50%";
divRenYuan_Right.style.backgroundColor = "#F9F9F9";
divRenYuan_Right.style.float = "right";
document.body.appendChild(divRenYuan_Right);

//region 列表人员输入框
const etRenYuanInputBox = document.createElement("input");
etRenYuanInputBox.setAttribute("type", "text");
etRenYuanInputBox.style.width = "500px";
divRenYuan_Right.appendChild(etRenYuanInputBox);
let ssRenYuanList = sessionStorage.getItem("ssRenYuanList");
if (ssRenYuanList === null) {
    ssRenYuanList = "开始审核之后，离线两分半记录一次;陈寿然";
}
etRenYuanInputBox.setAttribute("value", ssRenYuanList);
//endregion

//region “刷新列表人员”按钮
const refRenYuanButton = document.createElement("input");
refRenYuanButton.setAttribute("type", "button");
refRenYuanButton.setAttribute("value", "刷新列表人员");
divRenYuan_Right.appendChild(refRenYuanButton);
refRenYuanButton.onclick = function () {
    ssRenYuanList = etRenYuanInputBox.value;
    sessionStorage.setItem("ssRenYuanList", ssRenYuanList);
    initRenYuan();
};
//endregion

//region “开始/刷新”按钮
let renYuanInterval;
const refDataButton = document.createElement("input");
refDataButton.setAttribute("type", "button");
refDataButton.setAttribute("value", "开始/刷新");
divRenYuan_Right.appendChild(refDataButton);
refDataButton.onclick = function () {
    updateState();
    if (renYuanInterval == null) {
        renYuanInterval = setInterval(function () {
            //console.log("监控");
            updateState();
        }, 10000);
    }
};
//endregion


//region “刷新审核量”按钮
const refSHLButton = document.createElement("input");
refSHLButton.setAttribute("type", "button");
refSHLButton.setAttribute("value", "刷新审核量");
divRenYuan_Right.appendChild(refSHLButton);
refSHLButton.onclick = function () {
    alert("不要频繁刷工作量");
    lastUpdateLiang = new Date((new Date().getTime() - 1000 * 6000));
    updateLiang();
};
//endregion


const daoChuShuJuTable = document.createElement("table");
daoChuShuJuTable.style.display = "none";
divRenYuan_Right.appendChild(daoChuShuJuTable);


const daoChuShuJu = document.createElement("input");
daoChuShuJu.setAttribute("type","button");
daoChuShuJu.setAttribute("value","导出监控人员数据");
divRenYuan_Right.appendChild(daoChuShuJu);
daoChuShuJu.onclick = function(){
    RenYuan.outPutRenYuan();
};

//region 各业务人数统计

//业务人数
YeWuRenShu = {
    createNew: function (_title, _app) {
        let YWRS = {};

        let JiSheng = 0;
        let JuBao = 0;
        let ZhongSheng = 0;

        let app = _app;


        YWRS.adddRenYuan = function (renyuan) {
            if (renyuan.getYeWu() === app) {
                if (renyuan.isJiShen())
                    JiSheng += 1;
                if (renyuan.isJuBao())
                    JuBao += 1;
                if (renyuan.isZhongShen())
                    ZhongSheng += 1;

                shenheYeWuRenShu_JiSheng.innerHTML = "机审：" + JiSheng;
                shenHeYeWuRenShu_JuBao.innerHTML = "举报：" + JuBao;
                shenHeYeWuRenShu_ZhongSheng.innerHTML = "终审：" + ZhongSheng;
            }
        };

        YWRS.clearRenShu = function () {
            JiSheng = 0;
            JuBao = 0;
            ZhongSheng = 0;
        };


        let shenHeRenYuanShuLiang = document.createElement("li");
        shenHeRenYuanShuLiang.innerHTML = app + ":" + _title;
        let _shenHeRenYuanShuLiangUL = document.createElement("ul");

        let shenheYeWuRenShu_JiSheng = document.createElement("li");
        shenheYeWuRenShu_JiSheng.innerHTML = "机审";
        let shenHeYeWuRenShu_JuBao = document.createElement("li");
        shenHeYeWuRenShu_JuBao.innerHTML = "举报";
        let shenHeYeWuRenShu_ZhongSheng = document.createElement("li");
        shenHeYeWuRenShu_ZhongSheng.innerHTML = "终审";

        divRenYuan_Right.appendChild(shenHeRenYuanShuLiang);
        shenHeRenYuanShuLiang.appendChild(_shenHeRenYuanShuLiangUL);
        _shenHeRenYuanShuLiangUL.appendChild(shenheYeWuRenShu_JiSheng);
        _shenHeRenYuanShuLiangUL.appendChild(shenHeYeWuRenShu_JuBao);
        _shenHeRenYuanShuLiangUL.appendChild(shenHeYeWuRenShu_ZhongSheng);

        return YWRS;
    }
};

zongRenYuan = YeWuRenShu.createNew("总人员", "bigoLive");
jianKongYeWuRenYuan = YeWuRenShu.createNew("列表人员", "bigoLive");
//endregion

//region 人员数据列表
const tbRenYuan = document.createElement("table");
divRenYuan_Right.appendChild(tbRenYuan);

const tbOtherRenYuan = document.createElement("table");
divRenYuan_Right.appendChild(tbOtherRenYuan);
//endregion

//region iFrame_RenYuan
const iFrame_RenYuan = document.createElement('iframe');
iFrame_RenYuan.src = "";
iFrame_RenYuan.style.display = "none";
iFrame_RenYuan.style.width = "1200px";
iFrame_RenYuan.style.height = "600px";
document.body.appendChild(iFrame_RenYuan);
//endregion

let renYuanList = [];

//初始化人员信息
function initRenYuan() {
    renYuanList = [];
    let renyuanNameList = etRenYuanInputBox.value.split(";");
    for (let i in renyuanNameList) {
        if (renyuanNameList[i] !== "") {
            renYuanList.push(RenYuan.createNew(renyuanNameList[i], true));
        }
    }

    tbRenYuan.innerHTML = "";

    for (let i in renYuanList) {
        let renyuan = renYuanList[i];
        tbRenYuan.appendChild(renyuan.table.row);
    }

    tbOtherRenYuan.innerHTML = "";
}


createCells = function (cells) {
    let hang = document.createElement("tr");

    for (let i=0;i<cells.length;i++){
        let cell = document.createElement("td");
        cell.innerHTML = cells[i];
        cell.style.border = "1px solid #000";
        hang.appendChild(cell);
    }

    return hang;
};

//人员类，基本信息。名字、状态
const RenYuan = {
    _json : null,
    getJson : function () {
        if (!RenYuan._json) {
            let j = sessionStorage.getItem("mJson");
            if (j) {
                RenYuan._json = JSON.parse(j);
            } else {
                RenYuan._json = {
                    ren: [
                        // {
                        //     name: "csr",
                        //     "liWei": [
                        //     ],
                        //     "yeWu": [
                        //     ]
                        // }
                    ]
                };
            }
        }

        return RenYuan._json;
    },
    saveJSON : function(){
        sessionStorage.setItem("mJson",JSON.stringify(RenYuan.getJson()));
    },
    getJsonRenYuan : function(name){
        let j = RenYuan.getJson();
        let ren = null;
        for(let i=0;i<j.ren.length;i++){
            if(j.ren[i].name === name){
                ren = j.ren[i];
                continue;
            }
        }
        if(!ren){
           ren = {
               name :name,
               liWei:[],
               yeWu:[]
           };
           j.ren.push(ren);
        }
        return ren;
    },
    outPutRenYuan:function(){
        daoChuShuJuTable.innerHTML = "";

        let lie1 =  ["","离线次数","离线总时长(分)"];

        let renLen = RenYuan.getJson().ren.length;
        let maxLK = 0;

        //输出表头
        for(let i=0;i<3;i++){
            switch (i){
                case 0:
                    let rName = [lie1[i]];
                    for(let r=0;r<renLen;r++){
                        rName.push(RenYuan._json.ren[r].name);
                    }
                    daoChuShuJuTable.appendChild(createCells(rName));
                    break;
                case 1:
                    let rLiKaiCiShu = [lie1[i]];
                    for(let r=0;r<renLen;r++){
                        let lkcs = RenYuan._json.ren[r].liWei.length;
                        rLiKaiCiShu.push(lkcs);

                        if(maxLK < lkcs)
                            maxLK = lkcs;
                    }
                    daoChuShuJuTable.appendChild(createCells(rLiKaiCiShu));
                    break;
                case 2:
                    let rLiKaiZongShiChang = [lie1[i]];
                    for(let r=0;r<renLen;r++){
                        let zsc = 0;
                        for (let lw=0;lw<RenYuan._json.ren[r].liWei.length;lw++){
                            zsc += (RenYuan._json.ren[r].liWei[lw].huiLai - RenYuan._json.ren[r].liWei[lw].liKai);
                        }

                        rLiKaiZongShiChang.push((zsc/1000/60).toFixed(2));
                    }
                    daoChuShuJuTable.appendChild(createCells(rLiKaiZongShiChang));
                    break;
            }
        }

        for (let i =0;i<maxLK;i++){
            let lkShiDuan = [""];
            for(let r=0;r<renLen;r++){
                let sd = RenYuan.getJson().ren[r].liWei[i];
                if(sd){
                    lkShiDuan.push(new Date(sd.liKai).Format("HH:mm:ss") + "-"+new Date(sd.huiLai).Format("HH:mm:ss") + " 离线:" + ((sd.huiLai-sd.liKai)/1000/60).toFixed(2) );
                }else {
                    lkShiDuan.push("");
                }
            }
            daoChuShuJuTable.appendChild(createCells(lkShiDuan));
        }

        let html = "<html><head><meta charset='utf-8' /></head><body>" + daoChuShuJuTable.outerHTML + "</body></html>";
        let blob = new Blob([html], {type: "application/vnd.ms-excel"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "监控人员数据" + new Date().Format("yyyy-MM-dd HH:mm:ss") + ".xls";
        a.click();


    },
    createNew: function (name, monitor) {
        let renyuan = {};
        renyuan.name = name;
        renyuan.isMonitor = monitor;
        renyuan.table = RenYuan_LieBiao_Hang.createNew(renyuan.name);

        renyuan.liKaiShiJian = 0;


        renyuan.addLiKai = function (liKai, huiLai) {
           // console.log(renyuan.name + " 离开时间：" + liKai + "  回来时间：" + huiLai);
            RenYuan.getJsonRenYuan(renyuan.name).liWei.push({
                "liKai": liKai.getTime()
                , "huiLai": huiLai.getTime()
            });
            console.log(RenYuan._json);
        };




        let app = "";
        renyuan.setYeWu = function (yewu) {
            app = yewu;
            renyuan.table.setYeWu(yewu);
        };
        renyuan.getYeWu = function () {
            return app;
        };

        renyuan.setGuoJia = function(gj){
            renyuan.table.setGuoJia(gj);
        };


        let _state = false;
        let jiShenZhuangTai = false;
        let juBaoZhuangTai = false;
        let zhongShenZhuangTai = false;

        let _zuiHouZaiXian = -1;

        renyuan.setYeWuZhuangTai = function (jiShen, juBao, zhongSheng) {
            _state = (jiShen || juBao || zhongSheng);

            jiShenZhuangTai = jiShen;
            juBaoZhuangTai = juBao;
            zhongShenZhuangTai = zhongSheng;

            renyuan.table.setState(_state);
            renyuan.table.setJiShenState(jiShen);
            renyuan.table.setJuBaoState(juBao);
            renyuan.table.setZhongShengState(zhongSheng);

            let nowTime = new Date();
            if (_state) {
                //在线，判断他上次是不是在线；
                if (_zuiHouZaiXian !== 0) {
                    if(_zuiHouZaiXian === -1)
                        _zuiHouZaiXian = nowTime;
                    //不为0，说明上次不在线
                    //超过设定时间的，记录下来。
                    let lx = (nowTime - _zuiHouZaiXian) / 1000;
                    console.log(renyuan.name + " 上线，已经离线（秒）：" + lx);

                    if ((lx > liWeiShiChang) && renyuan.isMonitor) {
                        renyuan.addLiKai(_zuiHouZaiXian, nowTime);
                    }


                }
                _zuiHouZaiXian = 0;
                //else {
                    //   console.log(renyuan.name +"保持在线");
              //  }
            } else {
                //离线，判断他上次是不是在线；上次在线的话，记录这次的时间，
                if (_zuiHouZaiXian === 0) {
                    _zuiHouZaiXian = nowTime;
                    console.log(renyuan.name + "离线");
                 }//else if(_zuiHouZaiXian === -1){
                //     console.log(renyuan.name + "未上线");
                // }
            }

            if (_state) {
                renyuan.table.setLiXianShiChang(0);
            } else if(_zuiHouZaiXian !==-1) {
                let lastTimeOFF = (nowTime - _zuiHouZaiXian);
                renyuan.table.setLiXianShiChang(Math.floor((Math.floor((lastTimeOFF / 1000))) / 60));
            }
        };

        renyuan.startCheckState = function () {
            _state = false;
        };

        renyuan.endCheckState = function () {
            if (!_state) {
                renyuan.setYeWuZhuangTai(false, false, false);
            }
        };

        renyuan.getState = function () {
            return _state;
        };
        renyuan.isJiShen = function () {
            return jiShenZhuangTai;
        };
        renyuan.isJuBao = function () {
            return juBaoZhuangTai;
        };
        renyuan.isZhongShen = function () {
            return zhongShenZhuangTai;
        };


        return renyuan;
    }
};


//人员列表；（每一行
const RenYuan_LieBiao_Hang = {
    createNew: function (name) {
        let renyuanLieBiao = {};

        let hang = document.createElement("tr");
        hang.style.border = "1px solid #000";
        renyuanLieBiao.row = hang;

        //region 姓名；背景色是状态  //done
        let td0_name = document.createElement("td");
        td0_name.innerHTML = name;
        td0_name.style.fontWeight = "bold";
        td0_name.style.border = "3px solid #000";
        hang.appendChild(td0_name);

        renyuanLieBiao.setState = function (state) {
            td0_name.style.backgroundColor = state ? COLOR_ONLINE : COLOR_OFFLINE;
        };
        //endregion

        //region 业务
        let td1_yeWu = document.createElement("td");
        td1_yeWu.innerHTML = "业务";
        td1_yeWu.style.border = "1px solid #000";
        hang.appendChild(td1_yeWu);
        renyuanLieBiao.setYeWu = function (yewu) {
            td1_yeWu.innerHTML = yewu;
        };
        //endregion

        //region 机审状态
        let td1_jiShen = document.createElement("td");
        td1_jiShen.innerHTML = "机审";
        td1_jiShen.style.color = "#FFFFFF";
        td1_jiShen.style.border = "1px solid #000";
        hang.appendChild(td1_jiShen);
        renyuanLieBiao.setJiShenState = function (state) {
            td1_jiShen.style.backgroundColor = state ? COLOR_ONLINE : COLOR_OFFLINE;
        };
        //endregion //

        //region 举报状态
        let td2_juBao = document.createElement("td");
        td2_juBao.innerHTML = "举报";
        td2_juBao.style.color = "#FFFFFF";
        td2_juBao.style.border = "1px solid #000";
        hang.appendChild(td2_juBao);
        renyuanLieBiao.setJuBaoState = function (state) {
            td2_juBao.style.backgroundColor = state ? COLOR_ONLINE : COLOR_OFFLINE;
        };
        //endregion

        //region 终审状态
        let td3_zhongshen = document.createElement("td");
        td3_zhongshen.innerHTML = "终审";
        td3_zhongshen.style.color = "#FFFFFF";
        td3_zhongshen.style.border = "1px solid #000";
        hang.appendChild(td3_zhongshen);
        renyuanLieBiao.setZhongShengState = function (state) {
            td3_zhongshen.style.backgroundColor = state ? COLOR_ONLINE : COLOR_OFFLINE;
        };
        //endregion

        //region 离线时长
        let td_LastOnlineTime = document.createElement("td");
        td_LastOnlineTime.innerHTML = "";
        td_LastOnlineTime.style.border = "1px solid #000";
        hang.appendChild(td_LastOnlineTime);

        renyuanLieBiao.setLiXianShiChang = function (min) {
            td_LastOnlineTime.innerHTML = "离线(分)：" + min;
        };
        //endregion

        //region 工作量
        let td_YeWuZongLiang = document.createElement("td");
        td_YeWuZongLiang.innerHTML = "";
        td_YeWuZongLiang.style.border = "1px solid #000";
        hang.appendChild(td_YeWuZongLiang);

        let td_YeWuZongLiang_ZhongSheng = document.createElement("td");
        td_YeWuZongLiang_ZhongSheng.innerHTML = "";
        td_YeWuZongLiang_ZhongSheng.style.border = "1px solid #000";
        hang.appendChild(td_YeWuZongLiang_ZhongSheng);

        //上次的审核量
        let _lastChuShenLiang = 0;
        let _lastZhongShenLiang = 0;

        //上个小时
        let _lastHours = (new Date()).getHours();

        //本小时的总量
        let _thisHoursTotalChuShenLiang = null;
        let _thisHoursZhongShengLiang = null;

        let td_BenXiaoShiLiang = document.createElement("td");
        td_BenXiaoShiLiang.innerHTML = "";
        td_BenXiaoShiLiang.style.border = "1px solid #000";
        hang.appendChild(td_BenXiaoShiLiang);

        let td_BenXiaoShiLiang_ZhongSheng = document.createElement("td");
        td_BenXiaoShiLiang_ZhongSheng.innerHTML = "";
        td_BenXiaoShiLiang_ZhongSheng.style.border = "1px solid #000";
        hang.appendChild(td_BenXiaoShiLiang_ZhongSheng);

        renyuanLieBiao.setYeWuZongLiang = function (chuSheng, zhongSheng) {
            td_YeWuZongLiang.innerHTML = "总量&nbsp;&nbsp;&nbsp;&nbsp;初审：" + chuSheng + "&nbsp;&nbsp;";
            td_YeWuZongLiang_ZhongSheng.innerHTML = "终审：" + zhongSheng + "&nbsp;&nbsp;";

            let nowHours = (new Date()).getHours();
            if (_lastHours !== nowHours) {
                _lastHours = nowHours;
                _thisHoursTotalChuShenLiang = 0;
                _thisHoursZhongShengLiang = 0;
            } else if (_thisHoursZhongShengLiang === null) {
                _lastChuShenLiang = chuSheng;
                _lastZhongShenLiang = zhongSheng;
            }

            _thisHoursTotalChuShenLiang += (chuSheng - _lastChuShenLiang);
            _thisHoursZhongShengLiang += (zhongSheng - _lastZhongShenLiang);

            td_BenXiaoShiLiang.innerHTML = "本小时量&nbsp;&nbsp;&nbsp;&nbsp;初审：" + _thisHoursTotalChuShenLiang + "&nbsp;&nbsp;";
            td_BenXiaoShiLiang_ZhongSheng.innerHTML = "终审：" + _thisHoursZhongShengLiang + "&nbsp;&nbsp;";

            _lastChuShenLiang = chuSheng;
            _lastZhongShenLiang = zhongSheng;
        };
        //endregion

        //region 国家勾选
        let td_GuoJiaGouXuan = document.createElement("td");
        td_GuoJiaGouXuan.innerHTML = "";
        td_GuoJiaGouXuan.style.border = "1px solid #000";
        hang.appendChild(td_GuoJiaGouXuan);
        renyuanLieBiao.setGuoJia = function (guojia) {
            guojia = guojia.toString().trim();
            if(guojia !== "all"){
                td_GuoJiaGouXuan.innerHTML = "";
                for (let i = 0; i < Live_QuYu.length; i++) {
                    let   Country = Live_QuYu[i][3].split(";");
                    for(let ct = 0;ct<Country.length;ct++){
                        if (guojia.search(Country[ct]) !== -1 && Country[ct] !== "") {
                            td_GuoJiaGouXuan.innerHTML += Country[ct] + ";";
                        }
                    }
                }
            } else {
                td_GuoJiaGouXuan.innerHTML = guojia;
            }
            //todo 这里显示国家勾选
        };
        //endregion

        return renyuanLieBiao;
    }
};


function updateState() {
    console.log("updateState()");
    iFrame_RenYuan.src = "https://global-oss.bigo.tv/bigoAudit/live-count/admin-list";
    iFrame_RenYuan.onload = function () {
        let doc = iFrame_RenYuan.contentWindow.document;
        let table = doc.getElementsByClassName("table table-striped table-bordered")[0];
        let rows = table.rows;
        zongRenYuan.clearRenShu();
        jianKongYeWuRenYuan.clearRenShu();


        //开启检测状态
        for (let r = 0; r < renYuanList.length; r++) {
            let _renyuan = renYuanList[r];
            _renyuan.startCheckState();
        }

        //遍历在线人员数据 > 遍历人员（不在线的不会被检测到，所以需要上面的人员类内部的“开始”“结束”检查函数
        for (let i = 1; i < rows.length; i++) {
            let hang = rows[i].cells;
            let app = hang[3].innerText;

            if (app !== "bigoLive")
                continue;

            let shenHeYuan = hang[1].innerText;

            let renyuan = null;
            for (let r = 0; r < renYuanList.length; r++) {
                let _renyuan = renYuanList[r];
                if (shenHeYuan.have(_renyuan.name)) {
                    renyuan = _renyuan;
                    continue;
                }
            }

            if (!renyuan) {
                console.log("新的人员：" + shenHeYuan);
                renyuan = RenYuan.createNew(shenHeYuan, false);
                renYuanList.push(renyuan);
                tbOtherRenYuan.appendChild(renyuan.table.row);
            }

            if (shenHeYuan.have(renyuan.name)) {
                let jishen = false;
                let jubao = false;
                let zhongShen = false;

                let zhuangTai = hang[2].innerText;
                let shenHeDanLaiYuan = hang[4].innerText;
                let guojia = hang[5].innerText;
                renyuan.setYeWu(app);

                renyuan.setGuoJia(guojia);


                if (zhuangTai.have(FLAG_YEWU_CHUSHEN)) {
                    let all = (shenHeDanLaiYuan === FLAG_YEWU_LAIYUAN_ALL) || (shenHeDanLaiYuan === "");
                    jishen = (shenHeDanLaiYuan.have(FLAG_YEWU_LAIYUAN_JISHENG) || all);
                    jubao = (shenHeDanLaiYuan.have(FLAG_YEWU_LAIYUAN_YONGHUJUBAO) || shenHeDanLaiYuan.have(FLAG_YEWU_LAIYUAN_YY_TO_B) || all);
                }
                zhongShen = (zhuangTai.have(FLAG_YEWU_ZHONGSHENG));

                renyuan.setYeWuZhuangTai(jishen, jubao, zhongShen);
            }

            if (renyuan.isMonitor)
                jianKongYeWuRenYuan.adddRenYuan(renyuan);
            zongRenYuan.adddRenYuan(renyuan);
        }

        //结束状态检测
        for (let r = 0; r < renYuanList.length; r++) {
            let _renyuan = renYuanList[r];
            _renyuan.endCheckState();
        }
        updateLiang();
        paiXuRenYuan();
        huanHangBianSeRenYuanTable();

        RenYuan.saveJSON();

    }
}



let lastUpdateLiang = new Date();
//更新工作量
function updateLiang() {
    let nt = new Date();
    if((nt - lastUpdateLiang) > (1000 * 1800)){
        console.log("刷新工作量");
        lastUpdateLiang = nt;
         iFrame_RenYuan.src = "https://global-oss.bigo.tv/bigoAudit/live-count/record-count";
         iFrame_RenYuan.onload = function () {
            let doc = iFrame_RenYuan.contentWindow.document;
            let table = doc.getElementsByClassName("table table-striped table-bordered")[0];
            let rows = table.rows;

            for (let i = 0; i < renYuanList.length; i++) {
                let renyuan = renYuanList[i];
                if (renyuan.isMonitor) {
                    for (let r = 0; r < rows.length; r++) {
                        let hang = rows[r].cells;
                        let shenHeYuan = hang[0].innerText;
                        if (shenHeYuan.have(renyuan.name)) {
                            let chuShenLiang = parseInt(hang[1].innerText);
                            let ZhongShenLiang = parseInt(hang[4].innerText);
                            renyuan.table.setYeWuZongLiang(chuShenLiang, ZhongShenLiang);
                            continue;
                        }
                    }
                }
            }
        }
    }

}

//排序，将不在线的人员排到前面
function paiXuRenYuan() {
    for (let i = 0; i < renYuanList.length; i++) {
        let renyuan = renYuanList[i];
        if (renyuan.isMonitor) {
            if (renyuan.getState()) {
                tbRenYuan.appendChild(renyuan.table.row);
            }
        }
    }
}

//隔一行就将背景色变了
function huanHangBianSeRenYuanTable() {
    let gray = "#C8C8C8";
    let white = "#FFFFFF";
    let color = "";
    for (let i = 0; i < tbRenYuan.rows.length; i++) {
        color = color === white ? gray : white;
        let hang = tbRenYuan.rows[i];
        let pc = [1, 5, 6, 7, 8, 9];
        for (let p = 0; p < pc.length; p++) {
            hang.cells[pc[p]].style.backgroundColor = color;
        }
    }
}


//endregion

//region bigo_monitor.js
const nofHashMap = new HashMap();


const bt_StartMonitor = document.createElement("input");
bt_StartMonitor.style.border = "5px solid " + "#f5f5f5";
bt_StartMonitor.setAttribute("type", "button");
bt_StartMonitor.setAttribute("value", "开启监控");
bt_StartMonitor.style.fontSize = "20px";
document.body.appendChild(bt_StartMonitor);




//region 合并积单通知 开关
const _liMergerNotification = document.createElement("ul");
_liMergerNotification.innerHTML = "合并积单通知";


const cbMergerNotification = document.createElement("input");
cbMergerNotification.setAttribute("type", "checkbox");
_liMergerNotification.appendChild(cbMergerNotification);
document.body.appendChild(_liMergerNotification);
cbMergerNotification.onclick = function () {
    if (cbMergerNotification.checked) {
        for (let i = 0; i < nofHashMap.size(); i++) {
            let n = nofHashMap.get(nofHashMap.keySet()[i]);
            if (n !== null) {
                n.close();
            }
        }
    }
};
//endregion


const pushAndReceive = {
    token: new Date().getTime(),
    // canPush: true, //客户端开关，是否允许推送
    isPush: false,  //脚本状态，本客户端是不是推送端
    ditto: 0, //获取到的数据重复次数



};


//推送监控数据到网上
pushBacklogMonitor = function (callback) {
    refreshMonitor(BacklogMonitor);
};

const refreshMonitor = function (serviceJSON) {
        pushWFC("LiveFirst_Total", FLAG_UL_LIVE_TOTAL_COUNT, "初审总待检数：", serviceJSON.LiveBacklog.LiveFirst.Total, cszjd_YuZhi, NotificationIcon.ChuSheng);
        pushWFC("LiveFinal_Total", FLAG_UL_LIVE_TOTAL_COUNT, "终审总待检数：", serviceJSON.LiveBacklog.LiveFinal.Total, zszjd_YuZhi, NotificationIcon.ZhongSheng);
        pushWFC("Diff_Division_UR", FLAG_UL_LIVE_HOME_OFFICE, "初审举报：", serviceJSON.LiveBacklog.LiveFirst.Diff_Division_UR, csyh_YuZhi, NotificationIcon.ChuShenJuBao);
        pushWFC("MachineInspectionTotal", FLAG_UL_LIVE_HOME_OFFICE, "初审机审：", serviceJSON.LiveBacklog.LiveFirst.MachineInspectionTotal, csjs_YuZhi, NotificationIcon.ChuShengJiSheng);
        for (let i = 0; i < serviceJSON.LiveBacklog.LiveFirst.Division_UR.length; i++) {
            let division = serviceJSON.LiveBacklog.LiveFirst.Division_UR[i];
            pushWFC(division.Tag, FLAG_UL_LIVE_SEGMENT, division.Name + " 分部初审：", division.Backlog, division.Threshold, division.NoticeIcon);
        }

        // if (DEBUG) console.log("BacklogMonitor.ImageBacklog.Avatar.Division.length:" + serviceJSON.ImageBacklog.Avatar.Division.length);
        pushWFC("Avatar_Diff_Division", FLAG_UL_PIC_HME_OFFICE, "Global图片审核积单总数(从审核页面获取，所选的产品来源总数)(临时)：", serviceJSON.ImageBacklog.Avatar.Diff_Division, value_BenBuTuPian_YuZhi, NotificationIcon.TouXiang);
        //pushWFC("Cover_Total", FLAG_UL_PIC_HME_OFFICE, "所有区域封面积单总数：", serviceJSON.ImageBacklog.Cover.Total, fmjd_YuZhi, NotificationIcon.AllFengMian);
        for (let i = 0; i < serviceJSON.ImageBacklog.Avatar.Division.length; i++) {
            let division = serviceJSON.ImageBacklog.Avatar.Division[i];
            pushWFC(division.Tag, FLAG_UL_PIC_SEGMENT, division.Name + " 图片审核积单总数：", division.Backlog, division.Threshold, division.NoticeIcon);
        }

};

const checkInterval = {
    isOn: false,
    auditInterval: null,
    coveInterval: null,
    turnOn: function () {
        this.isOn = true;
        this.auditInterval = setInterval(function () {
            queue([checkNewAudit,checkPic,  pushBacklogMonitor]);
        }, 2000);

        this.coveInterval = setInterval(function () {
            //CheckFMJD_NoCallBack();
        }, 2000);
    },
    turnOff: function () {
        this.isOn = false;
        clearInterval(this.auditInterval);
        clearInterval(this.coveInterval);
        this.auditInterval = null;
        this.coveInterval = null;

        for(let i=0;i<nofHashMap.keySet().length;i++){
            let k = nofHashMap.get(nofHashMap.keySet()[i]);
            k.close();
        }
    }
};


bt_StartMonitor.onclick = function () {
    if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
        });
    }
    //endregion

    let nowTime = (new Date()).getTime();

    if (checkInterval.isOn) {
        bt_StartMonitor.setAttribute("value", "开启监控");
        sessionStorage.setItem("lastCheck", nowTime + 60000000);
        checkInterval.turnOff();
    } else {
        bt_StartMonitor.setAttribute("value", "关闭监控");
        checkInterval.turnOn();
        lastCheck = nowTime - 190000;
    }
};


pushWFC = function (_tag, _pid, _title, _wfc, _yuzhi, _icon) {
    let color = "black";

    let lli = document.getElementById(_tag);
    if (lli == null) {
        lli = document.createElement("li");
        lli.id = _tag;

        let _iBox = document.createElement("input");
        _iBox.id = "input" + _tag;
        _iBox.setAttribute("type", "text");

        let ipYuZhi = sessionStorage.getItem("ipYuZHI" + _tag);
        if (ipYuZhi !== null) {
            _iBox.setAttribute("value", ipYuZhi);
        } else {
            _iBox.setAttribute("value", _yuzhi);
        }

        let lb = document.createElement("ul");
        lb.appendChild(lli);
        lb.appendChild(_iBox);
        let p = document.getElementById(_pid);
        p.appendChild(lb);
    }


    let yuZhiIB = document.getElementById("input" + _tag);

    //console.log( _tag + ":" + parseInt(yuZhiIB.value));
    let yuZhi = parseInt(yuZhiIB.value);

    sessionStorage.setItem("ipYuZHI" + _tag, yuZhiIB.value);

    if (yuZhi && _wfc > yuZhi) {
        color = "red";
        nofHashMap.put(_tag, notif(_tag, _title, _wfc, _icon));
    } else {
        let nf = nofHashMap.get(_tag);
        if (nf != null) {
            nf.close();
        }
    }

    lli.innerHTML = _title + '<span style= " color:' + color + ';">' + _wfc + '</span>';
    lli.style.fontSize = "20px";
    lli.style.backgroundColor = "#E7E7E7";
}


let time = new Date();

notif = function (_tag, _title, _body, _icon) {
    if (cbMergerNotification.checked) {
        let last = new Date() - time;
        if (last > 2000) {
            time = new Date();
            console.log("合并的通知");
            let options = {
                body: _body,
                tag: "HeBingNF",
                renotify: true,
                icon: _icon
            };
            let notification = new Notification(_title, options);
            notification.onclick = function () {
                window.focus();
            }
        }
        return null;
    } else {
        let options = {
            body: _body,
            tag: _tag,
            renotify: true,
            icon: _icon
        };
        let notification = new Notification(_title, options);
        notification.onclick = function () {
            window.focus();
        };
        return notification;
    }
};
//endregion