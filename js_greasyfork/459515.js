// ==UserScript==
// @name         extract table for hualala   
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Extract table form Hualala website
// @author       eqd
// @match        https://report.hualala.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459515/extract%20table%20for%20hualala.user.js
// @updateURL https://update.greasyfork.org/scripts/459515/extract%20table%20for%20hualala.meta.js
// ==/UserScript==
const CopyBtnRowId = "CopyBtnRowId"
var TbData = null;
var TbHead = null;
var ExecInput = null;
var ExecBtn = null;
var onmouseover_btn = function()
{
    this.style.backgroundColor="rgb(0 114 213)";
}
var onmouseleave_btn = function()
{
    this.style.backgroundColor="rgb(0 98 183)";
}
var add_float_window = function () {
    var body = document.body;
    let div=document.createElement("div");
    div.setAttribute("id","plug_main");
    div.setAttribute("style","max-height: 540px;visibility: visible;z-index: 1000;float: left;display: block;position: fixed;top: 400px;margin: 10px;");
    div.innerHTML = `
    <div id='pg_extract' class='pg_btn' style='margin: 12px 8px 8px 8px;
    background-color: rgb(0 98 183);
    color: white;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    border-radius: 6px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    padding: 5px 20px;
    user-select: none;'>
        提取
    </div>`;
    
    var reverseBtn = div.querySelector("#pg_extract").cloneNode(true);
    reverseBtn.setAttribute("id","pg_extract_r");
    reverseBtn.innerHTML = reverseBtn.innerHTML + "反序";

    var genBtn = reverseBtn.cloneNode(true);
    genBtn.setAttribute("id","pg_gen");
    genBtn.innerHTML = "生成按钮";

    div.append(reverseBtn);
    div.append(genBtn);
    
    ExecInput = document.createElement("input");
    ExecInput.setAttribute("id","ExecIn");
    div.append(ExecInput);

    ExecBtn = reverseBtn.cloneNode(true);
    ExecBtn.setAttribute("id","pg_exec");
    ExecBtn.innerHTML = "执行";
    div.append(ExecBtn);

    body.append(div);
    
    let btns = div.querySelectorAll('.pg_btn');
    for(var b of btns)
    {
        b.onmouseover=onmouseover_btn;
        b.onmouseleave=onmouseleave_btn;
    }

    return div;
};
function isVisible(el) {
    var loopable = true,
        visible = getComputedStyle(el).display != 'none' && getComputedStyle(el).visibility != 'hidden';
        
    while(loopable && visible) {
        el = el.parentNode;
        
        if(el && el != document.body) {
            visible = getComputedStyle(el).display != 'none' && getComputedStyle(el).visibility != 'hidden';
        }else {
            loopable = false;
        }
    }
    return visible;
}
var extract_table = function(el)
{
    var trs = el.getElementsByTagName("tr");
    var cols = [];
    for(var tr of trs)
    {
        if(tr.getAttribute("aria-hidden") == "true" || tr.getAttribute("id") == CopyBtnRowId)
        {
            continue;
        }
        var rows = [];
        var tds = tr.getElementsByTagName("td");
        for(var td of tds)
        {
            var span = td.getElementsByTagName("span");
            var real = "";
            if(span.length > 0)
            {
                var inner = span[0].innerHTML;
                if(inner.startsWith("<span>"))
                {
                    real = span[0].getElementsByTagName("span")[0].innerHTML;
                }else{
                    real = inner;
                }
            }
            rows.push(real);
        }
        cols.push(rows);
    }
    return cols;
}
var extract_head = function(el)
{
    var trs = el.getElementsByTagName("tr");
    var res = [];
    var idx = 0;
    for(var tr of trs)
    {
        var ths = tr.getElementsByTagName("th");
        for(var th of ths)
        {
            var rowspan = th.getAttribute("rowspan")
            var colspan = th.getAttribute("colspan")
            if(idx == 0 && ((rowspan != undefined && parseInt(rowspan) != trs.length) || colspan != undefined) ) {continue;}
            var es = th.getElementsByTagName("span");
            for(var e of es)
            {
                var inner = e.innerHTML;
                if((e.getAttribute("class") == "title-fixed" || e.getAttribute("class") == "custom-title") && inner != "")
                {
                    if(inner.startsWith("<span>"))
                    {
                        var span = e.getElementsByTagName('span');
                        res.push(span[0].innerHTML);
                    }else{
                        res.push(inner);
                    }
                }
            }
        }
        idx+=1;
    }
    return res;
}
function checkExcelTimeStr(str)
{
    // if(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(str))
    // {
    //     return str.replaceAll('-','/');
    // }
    return str;
}
var setClipboard = function(table)
{
    var str = "";
    for(var i = 0;i < table.length;++i)
    {
        for(var j = 0;j < table[i].length;++j)
        {
            str += checkExcelTimeStr(table[i][j]);
            if(j < table[i].length - 1)str += '\t';
        }
        if(i < table.length - 1)str += '\n';
    }
    GM_setClipboard(str);
}
var setClipboardReverse = function(da)
{
    var str = "";
    for(var i = da.length - 1;i >= 0;--i)
    {
        for(var j = 0;j < da[i].length;++j)
        {
            str += checkExcelTimeStr(da[i][j]);
            if(j < da[i].length - 1)str += '\t';
        }
        if(i > 0)str += '\n';
    }
    GM_setClipboard(str);
}
function find_table_comm(tag)
{
    var tables = document.getElementsByTagName(tag);
    if(tables.length == 0)
    {
        return null;
    }
    var tb = null;
    for(var t of tables)
    {
        var cls = t.getAttribute("class");
        var isDisplay = isVisible(t);
        if(cls == ("ant-table-"+tag) && isDisplay)
        {
            tb = t;
        }
    }
    return tb;
}
function find_table()
{
    return find_table_comm("tbody");
}
function find_thead()
{
    return find_table_comm("thead");
}
var on_extract = function(b)
{
    var tb = find_table();
    if(tb != null)
    {
        var data = extract_table(tb);
        if(b.getAttribute("id").endsWith("_r"))
        {
            setClipboardReverse(data);
        }else{
            setClipboard(data);
        }
    }else{
        alert("没有找到表格");
    }
};
///generate col copy buttons////////////////////
function generate_copy_btn(cls,onclick,text)
{
    let btn=document.createElement("div");
    btn.setAttribute("class",cls);
    btn.style = `margin: 4px 2px 2px 2px;background-color: rgb(0 98 183);
    color: white;
    font-size: 10px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    border-radius: 6px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
    padding: 5px 20px;
    user-select: none;`;
    btn.onmouseover = onmouseover_btn;
    btn.onmouseleave = onmouseleave_btn;
    btn.onclick = onclick;
    btn.innerHTML = text;
    return btn;
}
function on_copy_col()
{
    var str = "";
    if(!this.reverse)
    {
        for(var i = 0;i < this.array.length;++i)
        {
            str += this.array[i];
            if(i < this.array.length - 1)str += '\n';
        }
    }else{
        for(var i = this.array.length - 1;i >= 0;--i)
        {
            str += this.array[i];
            if(i > 0)str += '\n';
        }
    }
    GM_setClipboard(str);
}
function find_or_gen_copy_rows(tb)
{
    var btn_tr = tb.querySelector("#"+CopyBtnRowId);
    if(btn_tr != null) return btn_tr;
    var trs = tb.getElementsByTagName("tr");
    var btn_tr = null;
    var first_tr = null;
    for(var tr of trs)
    {
        if(tr.getAttribute("aria-hidden") == "true")
        {
            continue;
        }
        first_tr = tr;
        btn_tr = tr.cloneNode(true);
        btn_tr.setAttribute("id",CopyBtnRowId);
        break;
    }
    if(btn_tr == null){
        alert("没有找到表格第一行");
        return;
    }
    tb.insertBefore(btn_tr,first_tr);
    return btn_tr;
}
function generate_col_btns()
{
    var tb = find_table();
    
    if(tb == null)
    {
        alert("没有找到表格");
        return;
    }
    var data = extract_table(tb);
    data.pop();
    TbHead = extract_head(find_thead());
    TbData = data;
    var btn_tr = find_or_gen_copy_rows(tb);
    var tds = btn_tr.getElementsByTagName("td");
    for(var j = 0;j < tds.length;++j)
    {
        var arr = [];
        for(var i = 0;i < data.length;++i)
        {
            arr.push(data[i][j]);
        }
        var copy = generate_copy_btn("copy_col_btn",on_copy_col,"复制");
        var copy_r = generate_copy_btn("copy_col_r_btn",on_copy_col,"反向复制");
        copy.array = arr;
        copy_r.array = arr;
        copy_r.reverse = true;
        tds[j].innerHTML = "";
        tds[j].append(copy);
        tds[j].append(copy_r);
    }
}
///////////////////////////////////////
///exec part////////////////////////////////////
var read_col = function(i,d,r)
{
    var res = [];
    if(r)
    {
        for(var x = d.length - 1;x >= 0;--x)
        {
            res.push(d[x][i]);
        }
    }else{
        for(var x = 0;x < d.length;++x)
        {
            res.push(d[x][i]);
        }
    }
    return res;
}
var find_col = function(str,reverse = true)
{
    for(var i = 0;i < TbHead.length;++i)
    {
        if(TbHead[i] == str)
        {
            return read_col(i,TbData,reverse);
        }
    }
}
//operator
var binary_operation = null;
var binary_operation_arr = function(a,op,b)
{
    if(typeof a === 'number' && typeof b === 'number')
    {
        return binary_operation(a,op,b);
    }
    var res = [];
    for(var i = 0;i < Math.min(a.length,b.length); ++i)
    {
        res.push(binary_operation(parseFloat(a[i]),op,parseFloat(b[i])));
    }
    return res;
}
var Op={};
Op.add = function(a,b){ return binary_operation_arr(a,'+',b); }
Op.sub = function(a,b){ return binary_operation_arr(a,'-',b); }
Op.mul = function(a,b){ return binary_operation_arr(a,'*',b); }
Op.div = function(a,b){ return binary_operation_arr(a,'/',b); }
Op.__supported_op = { '+':Op.add,'-':Op.sub,'*':Op.mul,'/':Op.div }
Op._is_supported_op = function(o){ return o in this.__supported_op; }
Op._get_op = function(o){ return this.__supported_op[o]; }

binary_operation = function(a,op,b)
{
    switch(op)
    {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
}

///parse cmd str
class Stack{
    constructor()
    {
        this.arr = [];
    }
    push(v)
    {
        this.arr.push(v);
    }
    pop()
    {
        return this.arr.pop();
    }
    get top()
    {
        if(this.arr.length == 0) {return undefined;}
        return this.arr[this.arr.length - 1];
    }
    get size() {return this.arr.length;}
    get empty() {return this.arr.length == 0;}
}
class SynTree{
    constructor()
    {
        this.a = null;
        this.b = null;
        this.op = null;
    }
    get val()
    {
        return this.op((this.a instanceof SynTree ? this.a.val : this.a),
        (this.b instanceof SynTree ? this.b.val : this.b));
    }
    get vaild()
    {
        return this.a != null && this.b != null && this.op != null;
    }
}
function check_shuck(str)
{
    if(str.length >= 2 && str[0] == '(' && str[str.length - 1] == ')')
        return str.substr(1,str.length - 2);
    return str;
}
function parse_token(i,str)
{
    var tk = "";
    var stack = new Stack();
    var next_normal = false;
    for(var x = i;x < str.length;++x)
    {
        if(str[x] == '\\')
        {
            next_normal = true;
            continue;
        }
        if(!next_normal && str[x] == '(')
        {    
            stack.push(str[x]); 
        }
        if(!next_normal && str[x] == ')')
        {
            if(stack.empty || stack.top != '(')
                throw new Error("Parse token failed!");
            stack.pop();
        }
        if(!next_normal && str[x] == ' ') {continue;}
        tk += str[x];
        if(stack.empty && x + 1 < str.length && Op._is_supported_op(str[x + 1])){return [check_shuck(tk),x];}
        if(!next_normal && stack.empty && Op._is_supported_op(tk)){return [check_shuck(tk),x];}
        next_normal = false;
    }
    if(tk.length > 0){ return [check_shuck(tk),x];}
    return [null,x]; 
}
function parse_val(str)
{
    if(str.length > 0 && str[0] == '$')
        return find_col(str.substr(1));
    if(str.length > 0 && str[0] == '#')
        return find_col(str.substr(1),false);
    return parseFloat(str);
}
function parse(str)
{
    var tree = new SynTree();
    var st = 0;
    for(var i = 0;i < str.length;++i)
    {
        let tk;
        [tk,i] = parse_token(i,str);
        if(tk == null) throw Error("Unexpected expression end");
        if(st == 0 || st == 2)
        {
            var val = parse_val(tk);
            if(val == null) {
                var sub_tree = parse(tk);
                if(!sub_tree.vaild)
                {
                    throw Error("Parse expression failed");
                }
                val = sub_tree;
            }
            if(st == 0) {
                tree.a = val;
                ++st;
            }else{
                tree.b = val;
                --st;
            }
        }else{
            if(tree.op != null)
            {
                var left_tree = tree;
                tree = new SynTree();
                tree.a = left_tree;
                left_tree = null;
            }
            tree.op = Op._get_op(tk);
            ++st;
        }
    }
    return tree;
}
function on_exec()
{
    var cmd = ExecInput.value;
    var table = TbData;
    var head = TbHead;
    var fc = find_col;
    var op = binary_operation_arr;
    var arr = parse(cmd).val; //eval(cmd);
    var cal = {};
    cal.array = arr;
    cal.on_copy_col = on_copy_col;
    cal.on_copy_col();
}
//////////////////////////////////////////////////
(function () {
    'use strict';

    var main = add_float_window();
    var extract = main.querySelector("#pg_extract");
    extract.onclick = function(){on_extract(extract);};
    var extract_r = main.querySelector("#pg_extract_r");
    extract_r.onclick = function(){on_extract(extract_r);};
    var gen = main.querySelector("#pg_gen");
    gen.onclick = generate_col_btns;

    ExecBtn.onclick = on_exec;
})();





