// ==UserScript==
// @name         洛理抢课助手2.0
// @version      1.0.0
// @description  方便抢课的微辅助功能
// @author       阿加Erin【https://www.gaoajia.com】
// @namespace    https://greasyfork.org/zh-CN/users/670112-ajiaerin
// @match        *://172.16.99.4/*
// @match        *://jw.sec.lit.edu.cn/*
// @match        *://120.194.42.205:9001/*
// @match        *://172.16.99.8/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @license      GPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/407708/%E6%B4%9B%E7%90%86%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B20.user.js
// @updateURL https://update.greasyfork.org/scripts/407708/%E6%B4%9B%E7%90%86%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B20.meta.js
// ==/UserScript==


// ==/UserScript==

const SCR_HEADER = "🐛洛理抢课微辅助"; // 用于debug
const configs = []; //* [各个功能的名字, 开关情况] 放在字典里用于生成下拉菜单时遍历
//* 各个功能的类，key为GM存储中的key, caption为在下拉菜单中显示的文字
class Config {
    constructor(key, enabled, caption) {
        this.key = key;
        this.enabled = enabled;
        this.caption = caption;
    }
};
//* 各种功能开关 -------------------------------------------
//* I. 删除提交时的确认提示 ----------------------------------
var Delete_Submit_Prompt = new Config("Del_Sub_Prmpt", GM_getValue("Del_Sub_Prmpt") == null ? true : GM_getValue("Del_Sub_Prmpt"), "删除提交时的确认提示"); // 默认值为true
configs.push(Delete_Submit_Prompt);

//* II. 添加"重复上次提交"按钮 ----------------------------------
var Append_Resubmit_Button = new Config("App_Resub_Btn", GM_getValue("App_Resub_Btn") == null ? true : GM_getValue("App_Resub_Btn"), "一键重复上次提交"); // 默认值为true
configs.push(Append_Resubmit_Button);

const Last_Submit_Table_Storage_Key = //* 储存oTable的innerHTML
{
    'xk' : "oTableInfo_xk", //* 存储选课程otable的信息（上次提交内容）对应的key
    'yy' : "oTableInfo_yy", //* 存储选英语otable的信息（上次提交内容）对应的key
    'fx' : "oTableInfo_fx", //* 存储选非限otable的信息（上次提交内容）对应的key
    'ts' : "oTableInfo_ts" //* 存储选通识otable的信息（上次提交内容）对应的key
};
const Last_Submit_DOM_Storage_Key = //* 储存DOM组件checkbox和显示文字的input
{
    'xk' : 'DOMInfo_xk',
    'yy' : 'DOMInfo_yy',
    'fx' : 'DOMInfo_fx',
    'ts' : 'DOMInfo_ts'
};
// const New_DOM_Storage_Key = //* 储存当前DOM组件checkbox和显示文字的input（用于存储取消提示时的返回状态）
// {
//     'xk': 'new_DOMInfo_xk',
//     'yy': 'new_DOMInfo_yy',
//     'fx': 'new_DOMInfo_fx',
//     'ts': 'new_DOMInfo_ts'
// };

//* III. 弹出窗口中添加"快速选择"按钮 ---------------------------
var Append_Fast_Choose_Button = new Config("App_Fast_Chs_Btn", GM_getValue("App_Fast_Chs_Btn") == null ? true : GM_getValue("App_Fast_Chs_Btn"), "一键选择老师"); // 默认值为true
configs.push(Append_Fast_Choose_Button);

//* IV. 自动点击检索按钮 -------------------------------------
var Auto_Click_Search = new Config("Auto_Search", GM_getValue("Auto_Search") == null ? true : GM_getValue("Auto_Search"), "自动点击检索按钮"); // 默认值为true
configs.push(Auto_Click_Search);

//* -----------------------------
//* 开启Debug功能后会在console输出信息
var DEBUG_MODE = new Config("Debug_Mode", GM_getValue("Debug_Mode") == null ? true : GM_getValue("Debug_Mode"), "控制台输出debug信息"); // 默认值为true
configs.push(DEBUG_MODE);

//* ------------------------------------------------------
//* 根据当前功能开关情况生成插件下拉菜单，并添加对应修改函数 ---------------------
var menuIds = []; //所有下拉菜单的id

drawMenu();

// 每次按下按钮后就重绘一遍menu
function drawMenu () {
    // 重绘新菜单，只有在最父层frame且没有id的时候才重绘，避免内层frame加载时重复多次调用
    if (window == top) {
        // debugger;
        menuIds = [];
        for (const config of configs) {
            var pre = config.enabled ? "【✔️已启用】" : "【❌已禁用】";
            var id = GM_registerMenuCommand(pre + config.caption, changeEnabled(config));
            menuIds.push(id);
        }
    }
}

function changeEnabled(config) {
    return () => {
        // debugger;
        config.enabled = !config.enabled;
        GM_setValue(config.key, config.enabled);

        // 修改功能开关后重绘下拉菜单
        for (const id of menuIds) {
            GM_unregisterMenuCommand(id);
        }
        drawMenu();
    };
}

//* 需要前面的prefix才能用，如 input.button
const BTN_CLASS = "ZZJBtn";
const BTN_CSS =
`input.${BTN_CLASS} {
    font-family: "宋体";
    font-size: 12px;
    cursor: pointer;
    height: 20px;
    margin-left: 7px;
}
`;

function log(msg){
    if (DEBUG_MODE.enabled){
        let d = new Date();
        console.log("[" + SCR_HEADER + "] " + msg + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
    }
};

function error(msg){
    if (DEBUG_MODE.enabled){
        let d = new Date();
        console.error("[" + SCR_HEADER + "] " + msg + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
    }
};



//* 清空脚本存储的记录，
function clearResubmitStorage() {
    GM_deleteValue(Last_Submit_Table_Storage_Key['xk']);
    GM_deleteValue(Last_Submit_Table_Storage_Key['yy']);
    GM_deleteValue(Last_Submit_Table_Storage_Key['fx']);
    GM_deleteValue(Last_Submit_Table_Storage_Key['ts']);
    GM_deleteValue(Last_Submit_DOM_Storage_Key['xk']);
    GM_deleteValue(Last_Submit_DOM_Storage_Key['yy']);
    GM_deleteValue(Last_Submit_DOM_Storage_Key['fx']);
    GM_deleteValue(Last_Submit_DOM_Storage_Key['ts']);
}

(function() {
    'use strict'; // 严格模式下使用未定义的变量会报错
    // if (name = 'frmMain') {
    //     console.log(SCR_HEADER + this.location.pathname);
    // }
    // if (name == 'frmRpt'){
    //     console.log(SCR_HEADER + this.location.pathname);
    // }
    //* I. 删除提交时的提示 -------------------------------------------------
    if (Delete_Submit_Prompt.enabled && name == 'frmRpt'){

        //* 删掉frmRpt(/wsxk/stu_btx_rpt.aspx)里的ChkValue(theObj)里的
        //* str: if (!confirm('是否提交记录？'))return false;
        //* regEx: /if \(!confirm\('是否提交记录？'\)\)return false;/
        //* 即可
        //* 专业课 frmRpt(/wsxk/stu_btx_rpt.aspx)  对应scripts[1]
        //* 通识 frmRpt(/wsxk/stu_xszx_rpt.aspx))  对应scripts[3]
        //* 英语 frmRpt(/wsxk/stu_btx_rpt.aspx))
        //* 非限 frmRpt(/wsxk/stu_btx_rpt.aspx))
        var tpe = null;
        if (self.location.pathname == "/wsxk/stu_btx_rpt.aspx"){
            tpe = 1;
        }else if(self.location.pathname == "/wsxk/stu_xszx_rpt.aspx"){
            tpe = 3;
        }
        if (tpe) {
            // 先找到对应的script元素，用删掉文字后的标签替换原标签
            var scr = self.document.createElement("script");
            scr.innerHTML = document.scripts[tpe].innerHTML.replace("if (!confirm('是否提交记录？'))return false;", "");

            document.scripts[tpe].replaceWith(scr);

            if (document.scripts[tpe].text.search("是否提交记录")==-1){
                log("已删除提交确认框！");
            }else{
                error("未删除提交确认框！");
            }
        }
    }
    //* -----------------------------------------------------------------

    //* II. "重复上次提交"按钮 ---------------------------------------------
    if (Append_Resubmit_Button.enabled && name == 'frmMain'){
        // debugger;
        var leixing = null; // 是哪个类型的页面：xk, ts, yy, fx
        switch (window.location.pathname) {
            case "/wsxk/stu_btx.aspx": // 专业课
                leixing = "xk";
                break;
            case "/wsxk/stu_whszk.aspx": // 英语
                leixing = "ts";
                break;
            case "/wsxk/stu_yytgk_bx.aspx": // 通识
                leixing = "yy";
                break;
            case "/wsxk/stu_ggrxk.aspx": // 非限
                leixing = "fx";
                break;
            default:
                break;
        }
        if (leixing) {

            //* 专业课 (frmMain(/wsxk/stu_btx.aspx) frmRpt(/wsxk/stu_btx_rpt.aspx))
            //* 通识(frmMain(/wsxk/stu_whszk.aspx) frmRpt(/wsxk/stu_xszx_rpt.aspx))
            //* 英语(frmMain(/wsxk/stu_yytgk_bx.aspx) frmRpt(/wsxk/stu_btx_rpt.aspx))
            //* 非限(frmMain(/wsxk/stu_ggrxk.aspx) frmRpt(/wsxk/stu_btx_rpt.aspx))

            // console.log(this.location.pathname);
            //* 为了保证多开网页能通用，存在GM storage里。
            //* 不同域名的网站也要通用？--> 利用GM_setValue和GM_getValue, 而不存储在localStorage里
            //* 在提交旁边加上重复上次提交按钮，提交按钮按下时先在 GM storage 存下 frmMain(/wsxk/stu_btx.aspx) -> frmRpt(/wsxk/stu_btx_rpt.aspx) -> id=oTable 的innerHTML，点击重复提交时先从storage里调取覆盖，再执行提交按钮对应的onclick，

            var subBtn = null; // 提交按钮，含提交的窗口加载出来时就会赋值
            var oTable = null; // 所有选课内容的表格
            //* 找到提交按钮
            for (const btn of document.querySelectorAll(".button")) {
                if (btn.value == "提交"){
                    subBtn = btn;
                    log("获取提交按钮");
                    break;
                }
            }

            if (subBtn != null) {
                //* 找到提交按钮，新按钮才能添加
                //* II.1. 设计样式并添加 "重新提交" 按钮 ------------------------------------------
                //* 添加新按钮的css
                GM_addStyle(BTN_CSS);

                //* 新按钮的元素
                var resubBtn = document.createElement("input");
                resubBtn.setAttribute("class", BTN_CLASS);
                // resubBtn.setAttribute("class", "button");
                resubBtn.setAttribute("type", "button");
                resubBtn.setAttribute("name", "submit");
                resubBtn.setAttribute("value", "重复上次提交");
                resubBtn.setAttribute("leixing", leixing); // 确定当前页面类型，用于存储oTable在不同的key里面

                //* 修改整体宽度
                subBtn.parentElement.setAttribute("width", 700);

                //* 添加到 提交 后面
                insertAfter(resubBtn, subBtn);
                log("已添加重复上次提交" + leixing + "按钮。");

                //* II.2. 设置重新提交按钮按下时的逻辑 ---------------------------------
                //* 先覆盖当前oTable的信息（修改innerHTML），再调用提交按钮的onclick函数

                resubBtn.onclick = function(subBtn){
                    return function(){
                        var val = GM_getValue(Last_Submit_Table_Storage_Key[leixing]);
                        if (val != null) {
                            //* 读取 oTable:
                            var oTable = frmRpt.document.getElementById("oTable"); // 选课表格对应的元素，含表格的窗口(frmRpt)加载出来时就会赋值
                            oTable.innerHTML = val;

                            //* 读取checkbox的checked和input的value信息
                            var tmp = JSON.parse(GM_getValue(Last_Submit_DOM_Storage_Key[leixing]));
                            var chkKCs = oTable.querySelectorAll("input[type='checkbox']");
                            for (const chkKCi of chkKCs) {
                                chkKCi.checked = tmp[chkKCi.id];
                            }

                            var chkSKBJstrs = oTable.querySelectorAll("input[type='text']");
                            for (const chkSKBJstr of chkSKBJstrs) {
                                chkSKBJstr.value = tmp[chkSKBJstr.id];
                            }

                            log("成功读取" + leixing + "_信息。");

                            subBtn.onclick();
                        }else{
                            error(leixing + "_信息不存在！");
                        }
                    };
                }(subBtn);


            }else {
                error("未能添加重复上次提交按钮。");
            }
        }


    }
    //* II.3. 改写提交按钮的逻辑，把提交内容存入Storage，并post到其他hosts的相同pathname下 -----------------
    //* 提交按钮按下时先在 Storage 存下 frmMain(/wsxk/stu_btx.aspx) -> frmRpt(/wsxk/stu_btx_rpt.aspx) -> id=oTable 的innerHTML。点击重复提交时先从storage里调取覆盖，再执行提交按钮对应的onclick。
    if (Append_Resubmit_Button.enabled && name == 'frmRpt'){
        // 通识 frmRpt(/wsxk/stu_xszx_rpt.aspx)
        // 英语 frmRpt(/wsxk/stu_btx_rpt.aspx)
        // 非限 frmRpt(/wsxk/stu_btx_rpt.aspx)

        var tpe = null; // 选择修改的内容是scripts几
        if (self.location.pathname == "/wsxk/stu_btx_rpt.aspx"){
            tpe = 1;
        } else if (self.location.pathname == "/wsxk/stu_xszx_rpt.aspx") {
            tpe = 3;
        }
        if (tpe){
            //* 只在加载出表格网页时才进行
            for (const btn of parent.document.querySelectorAll(".button")) {
                if (btn.value == "提交"){
                    subBtn = btn;
                    log("获取提交按钮");
                    break;
                }
            }

            if (subBtn != null) {
                //* 改变提交按钮的逻辑，先存oTable再onclick

                //* frmRpt(/wsxk/stu_btx_rpt.aspx 对应scripts[1]) (/wsxk/stu_xszx_rpt.aspx 对应scripts[3]) 里的 checkbox 'chkKC' 的checked属性以及后面input 'chkSKBJstr' 的value属性 与 HTML标签里的属性不同步，
                //* 可以单独记录所有chkKC的checked和chkSKBJstr的value，读取的时候也把这些信息读进来。√
                //* 或修改网页的函数openWinDialog, 使得改变chkKC的属性值以及chkSKBJstr的value使修改对应的HTML标签。×

                var oTable = null;
                if (name == 'frmRpt') {
                    oTable = document.getElementById("oTable");
                }else if (name == 'frmMain') {
                    oTable = frmRpt.document.getElementById("oTable");
                }

                const leixing = parent.document.querySelector("."+BTN_CLASS).getAttribute("leixing");


                // debugger;
                subBtn.onclick = function(oTable, leixing){
                    return function(){

                        GM_setValue(Last_Submit_Table_Storage_Key[leixing], oTable.innerHTML);

                        //* 存所有checkbox (chkKC#)的checked属性和后面的input (chkSKBJstr#)的value属性到JSON，key是对应的id
                        const chkKCs = oTable.querySelectorAll("input[type='checkbox']");
                        var tmp = {}; // 要存储的JSON：chkKC1: true, ...
                        for (const chkKCi of chkKCs) {
                            tmp[chkKCi.id] = chkKCi.checked;
                        }
                        const chkSKBJstrs = oTable.querySelectorAll("input[type='text']");
                        for (const chkSKBJstr of chkSKBJstrs) {
                            tmp[chkSKBJstr.id] = chkSKBJstr.value;
                        }

                        GM_setValue(Last_Submit_DOM_Storage_Key[leixing],
                            JSON.stringify(tmp));
                        log("成功保存" + leixing + "_信息");

                        self.document.all.Submit.onclick();
                    };

                } (oTable, leixing);

            }
        }
    }
    //* --------------------------------------------------------------

    //* III. 弹出窗口增加快速选择选项（选好后自动确定） --------------------------
    if (Append_Fast_Choose_Button.enabled && (location.pathname == "/wsxk/stu_xszx_skbj.aspx" || location.pathname == "/wsxk/stu_xszx_chooseskbj.aspx")){
        //* 专业课: /wsxk/stu_xszx_skbj.aspx?xxxx=xxxx
        //* 英语: /wsxk/stu_xszx_chooseskbj.aspx?xxx
        //* 非限: /wsxk/stu_xszx_skbj.aspx?xxx
        //* 通识: /wsxk/stu_xszx_skbj.aspx?xxx
        var tab = document.getElementById("pageRpt");
        var sureBtn = document.getElementById("sure"); // 确定按钮

        //* III.1. 最后新加一列
        // 列头
        var tdh = tab.querySelector(".T").insertCell();
        tdh.rowSpan = "2";
        tdh.textContent = "快选";
        tdh.align = "center";

        //* III.2. 每一行结尾添加快选按钮
        var trs = tab.querySelectorAll(".B");
        for (const tr of trs) {
            if (tr.lastElementChild.firstElementChild.tagName.toUpperCase() == "INPUT") {
                var rad = tr.lastElementChild.firstElementChild;
                // 含radio的那一行，插入快选按钮

                var inp = document.createElement("input");
                inp.className = "button";
                inp.type = "button";
                inp.value = "快选";
                inp.style.marginTop = "2px";
                inp.style.marginBottom = "2px";
                inp.disabled = rad.disabled; // 快选的按钮disabled与前面的radio相同

                // 每行最后一个格子
                var td = tr.insertCell();
                td.rowSpan = rad.parentElement.rowSpan;
                td.appendChild(inp);

                //* III.3.添加按钮的逻辑
                // 按下时先选中前面的rad，再点击确定按钮

                // 接受参数，返回由参数确定内容的函数指针。
                inp.onclick = function(rad, sureBtn){
                    return function(){
                        // 按下时先选中前面的rad，再点击确定按钮

                        rad.onclick(); // 选中前面的rad
                        sureBtn.onclick(); // 点击确定

                        log("快速选择了" + rad.id);
                    }
                }(rad, sureBtn);

            }
        }
        log("添加了快选按钮");

    }
    //* --------------------------------------------------------------

})();

window.onload = function(){
    //* IV. 自动点击检索按钮
    //* class为button, value为检索
    if (Auto_Click_Search.enabled && name == 'frmMain'){
        var leixing = null; // 是哪个类型的页面：xk, ts, yy, fx
        switch (self.location.pathname) {
            case "/wsxk/stu_btx.aspx": // 专业课
                leixing = "xk";
                break;
            case "/wsxk/stu_whszk.aspx": // 英语
                leixing = "ts";
                break;
            case "/wsxk/stu_yytgk_bx.aspx": // 通识
                leixing = "yy";
                break;
            case "/wsxk/stu_ggrxk.aspx": // 非限
                leixing = "fx";
                break;
            default:
                break;
        }
        if (leixing) {
            var searchBtn = null;
            for (const btn of document.querySelectorAll(".button")) {
                if (btn.value == "检索"){
                    searchBtn = btn;
                    log("已获取检索按钮");
                    break;
                }
            }
            if (searchBtn){
                searchBtn.click(); // 模拟点击按钮
                log("已点击检索按钮");
            }else{
                error("未找到检索按钮");
            }
        }
    }
};
function insertBefore(newElem, targetElem) {
    var parent = targetElem.parentNode;
    parent.insertBefore(newElem, targetElem);
}

function insertAfter(newElem, targetElem){

    var parent = targetElem.parentNode;
    if (parent.lastChild == targetElem) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElem);
    } else {
        //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
        parent.insertBefore(newElem, targetElem.nextSibling);
    }
}