
// ==UserScript==
// @name         审图平台辅助
// @match        *://*.hnjs.henan.gov.cn/*
// @run-at       document-end
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license MIT
// @description [河南省勘察设计设计质量监管平台](http://hnkcsjzl.hnjs.henan.gov.cn/)辅助工具.
// @version 0.0.1.20230306100304
// @namespace https://greasyfork.org/users/24330
// @downloadURL https://update.greasyfork.org/scripts/461295/%E5%AE%A1%E5%9B%BE%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/461295/%E5%AE%A1%E5%9B%BE%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


function init_window(){
    // console.log(document.querySelector('ul'))
    if (!document.querySelector('ul').innerText.match('意见回复$')){
         return;
     }
     // console.log(document.querySelector('ul').innerText)
     iframe = document.getElementById('mainFrame'); //这里的mainFrame 要看实际的id
     innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    if(document.querySelector('#shaixuan')){return;}
    // if (init_flags){return}
        let html_div=`
<div style="color: #ebebf0;background-color: rgb(14,27,53);position: fixed;bottom: 20px;left: 5px;z-index: 999" id="shaixuan">
    <label>选择预置配置
<!--    <input type='button' onclick="shaixuan('by_select')" value="按预置筛选">-->
        <br/>
        <select name='预置配置' id="yuzhi_shaixuan" style="color: white;background-color: rgb(34,77,162);width: 180px">
        </select>
    </label><br/>
    <a id="all_show_btn">当前设置共隐藏了 <strong style="color: red" id="hidden_num">0</strong> 条,点击显示</a><br/>
     <a style="color: white" id="set_hidden">展开/折叠详细设置</a>
    </br>
    <div id="neibudiv" hidden>
    未勾选的均会被隐藏<br/>
        <div id="work">
            按专业筛选:<br/>
            <label for="work_jz">建筑</label><input type="checkbox" name="建筑" id="work_jz" class="shuaixuan_work"
                                                  checked/>
            <label for="work_jg">结构</label><input type="checkbox" name="结构" id="work_jg" class="shuaixuan_work"
                                                  checked/><br/>
            <label for="work_dq">电气</label><input type="checkbox" name="电气" id="work_dq" class="shuaixuan_work"
                                                  checked/>
            <label for="work_nt">暖通</label><input type="checkbox" name="暖通" id="work_nt" class="shuaixuan_work"
                                                  checked/>
            <label for="work_gps">给排水</label><input type="checkbox" name="给排水" id="work_gps" class="shuaixuan_work"
                                                    checked/>
            <br/>
        </div>
        <div id="type">
            按条文类型筛选:<br/>
            <label for="type_f">F 法律法规</label><input type="checkbox" name="F" id="type_f" class="shuaixuan_type"
                                                     checked/>
            <label for="type_q">Q 强制条文</label><input type="checkbox" name="Q" id="type_q" class="shuaixuan_type"
                                                     checked/><br/>
            <label for="type_p">P 普通条文</label><input type="checkbox" name="P" id="type_p" class="shuaixuan_type"
                                                     checked/>
            <label for="type_a">A 安全隐患</label><input type="checkbox" name="A" id="type_a" class="shuaixuan_type"
                                                     checked/>
            <br/>
        </div>
        <div id="status">
            按意见状态筛选:<br/>
            <label for="status_ok">已合格</label><input type="checkbox" name="合格" id="status_ok" class="shuaixuan_status"
                                                     checked/><br/>
            <label for="status_no">待回复</label><input type="checkbox" name="待回复" id="status_no" class="shuaixuan_status"
                                                     checked/>
            <label for="status_wait">待提交</label><input type="checkbox" name="待提交" id="status_wait"
                                                       class="shuaixuan_status" checked/><br/>
            <input type='button' id="btn_filtrate" value="筛选">
<!--            <input type='button' value="全部显示">-->
            <input type='button' id="btn_save_filtrate"  value="保存为预设">
            <input type='button' id="btn_del_filtrate"  value="删除预设">
        </div>
    </div>
</div>
`

        let div_ele = document.createElement('div');
    div_ele.id='shaixuan_jiaoben';
        let manage_side=document.querySelector('.manage-side');
        if (manage_side){
            manage_side.insertAdjacentHTML('beforeend',html_div);
        }else {
             return; // iframe里会当作一个新的doc重新加载一次用户脚本,如果不return,会出现两个,而且内层的不能用.
            document.body.appendChild(div_ele);
            div_ele.insertAdjacentHTML('beforeend',html_div);
        }

// document.insertBefore(div_ele,$('body').lastChild);

    // document.querySelector('.manage-side').style.zIndex='998'
    neibu_div=$('div#neibudiv')[0]
        $('a#set_hidden').click(hidden_set_window) // 添加点击事件
// document.getElementById('set_hidden').addEventListener('click', hidden_set_window) // 添加点击事件
    $('a#all_show_btn').click(all_show)
    $('input#btn_save_filtrate').click(save_filtrate)
    $('input#btn_del_filtrate').click(del_filtrate)
    $('input#btn_filtrate').click(shaixuan)
// sel_yuzhi.change(apply_yushe)
    sel_yuzhi=$('select#yuzhi_shaixuan')[0]
    sel_yuzhi.addEventListener('change',apply_yushe)
    select_init()
    myTimer=null;
    // init_flags=true
}





// // document.querySelector("#s-top-left > div > a").insertAdjacentHTML("afterend", '<input type="submit" value="tt" id="tt1"/>')
// function a1(a){return a+1;}
// // document.querySelector("#s-top-left > div > a").parentElement.insertAdjacentHTML("afterend", '<a href="#" id="tt1">弹出窗口</a>')
// $('div.mnav.s-top-more-btn')[0].insertAdjacentHTML("afterend", '<a href="#" id="tt1">弹出窗口</a>')
// let a=document.getElementById('tt1')
// function tx1(){
//     alert(a1(3))
// }
// // 以下四种写法效果相似
// // document.getElementById('tt1').addEventListener('click', tx1);  //这个及下面这个是针对一个元素增加的方法
// // $('#tt1')[0].addEventListener('click', tx1);
// // $('#tt1').click(()=>{tx1()}) //这个及下面这个是针对所有id为tt1的元素
// $('#tt1').click(tx1)
//
//
let iframe; //这里的mainFrame 要看实际的id
let innerDoc;
// let init_flags=false; // 初始化标记

// iframe = document.getElementById('mainFrame'); //这里的mainFrame 要看实际的id
// innerDoc = iframe.contentDocument || iframe.contentWindow.document;

// let main_div=$('div#shaixuan_jiaoben')[0]; // 脚本主div
let neibu_div;
let sel_yuzhi;
let yuzhi_dict;
// main_div.querySelector('a#set_hidden').click(()=>{$('div#neibudiv')[0].hidden=!($('div#neibudiv')[0].hidden) }) # querySelector 的返回值没有click方法

// let morenyuzhi={
//     "暖通专业":[["work",["暖通"]],["type",["F","Q","P","A"]],["status",["合格","待回复","待提交"]]],
//     "未合格的暖通专业":[["work",["暖通"]],["type",["F","Q","P","A"]],["status",["待回复","待提交"]]],
//     "未回复的暖通专业":[["work",["暖通"]],["type",["F","Q","P","A"]],["status",["待回复"]]],
//     "暖通专业强条":[["work",["暖通"]],["type",["Q"]],["status",["合格","待回复","待提交"]]]
// }

yuzhi_dict=GM_getValue('yuzhi_dict');
if (yuzhi_dict){
    // yuzhi_dict=morenyuzhi
    GM_setValue('yuzhi_dict',yuzhi_dict)
}
//console.log(yuzhi_dict)
// yuzhi_dict={}

let div_name_cow_name;
div_name_cow_name={
    'work':'type',
    'type':'type',
    'status':'status'
};// div name与列名的对照字典
let cow_name;

let all_li;
let myTimer = setInterval(init_window, 3000);

GM_registerMenuCommand('导出预设配置',exp_yushe)
GM_registerMenuCommand('导入预设配置',import_yushe)

function exp_yushe(){
    // GM_setClipboard(yuzhi_dict)
    prompt('请自行复制',JSON.stringify(yuzhi_dict))
    // alert('配置已复制到剪切板')
}
function import_yushe(){
    let json=prompt('输入配置字符串');
    // console.log(JSON.parse(json))
    yuzhi_dict=JSON.parse(json)
    GM_setValue('yuzhi_dict',yuzhi_dict)
    select_init()
}


function  del_filtrate(){//todo
    // console.log('删除预设占位符')
    let name;
    name=sel_yuzhi.options[sel_yuzhi.selectedIndex].text;
    if (confirm('确认删除"'+name+'"吗?')){
        delete yuzhi_dict[name]
        GM_setValue('yuzhi_dict',yuzhi_dict)
        sel_yuzhi.options.remove(sel_yuzhi.selectedIndex)
    }
}

function save_filtrate(){

    let name;
    name=prompt('输入预设配置名')
    if (name in yuzhi_dict){
        alert('已存在的配置名,请重新保存')
        return;
    }else {
        if (!confirm('确认使用"'+name+'"作为配置名吗?')){
            return;
        }
    }
    yuzhi_dict[name]=get_filtrate_scheme()
    GM_setValue('yuzhi_dict',yuzhi_dict)
    select_init() // 重新加载

}

function select_init (){//todo
    console.log('预设初始化占位')
    sel_yuzhi.length=0 //清空
    // sel_yuzhi.add(new Option('2'))
    // sel_yuzhi.add(new Option('1'))
    for (let key in yuzhi_dict){
        sel_yuzhi.add(new Option(key))
    }
    // 缺少一个默认选项
}
function apply_yushe(){
    console.log('预设选择占位符')
    // console.log(this.options.selectedIndex)
    let name;
    let dct;
    name=this.options[this.selectedIndex].text
    dct=yuzhi_dict[name]
    set_filtrate_scheme(dct)
}
function hidden_set_window(){
    // console.log('切换div隐藏')
    neibu_div.hidden=!(neibu_div.hidden)
}
function all_show(){ //todo
    console.log('全部显示占位')//
    let tt;
    all_li=innerDoc.querySelectorAll('li.opinion-item');
    for (tt of all_li){
        tt.hidden=false
    }
}
function shaixuan(){
    // console.log(by)

    console.log('筛选占位符')

    iframe = document.getElementById('mainFrame'); //这里的mainFrame 要看实际的id
    innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    // console.log(innerDoc)

    all_li=innerDoc.querySelectorAll('li.opinion-item');
    // all_li=document.querySelectorAll('li.opinion-item');
    all_show()
    get_th_num()
    let exp;
    exp=get_filtrate_scheme()

    // const select_dict={
    //     '12':[['type','暖通']],// 暖通专业
    //     '13':[['type','暖通'],['status','(待回复|待提交)']],//未合格的暖通专业
    //     '14':[['type','暖通'],['status','待回复']],//未回复的暖通专业
    //     '15':[['type','暖通'],['type','Q\\d']]//暖通专业强条
    // }
    // let exp=[];
    // if (by==='by_select'){
    //     exp=select_dict[document.querySelector('select#yuzhi_shaixuan').value]
    // }else if(by==='by_checkbox'){
    //     let t;
    //     let w=''
    //     // console.log(document.querySelectorAll('input.shuaixuan_work'))
    //     for (t of document.querySelectorAll('input.shuaixuan_work')){
    //         // console.log(t)
    //         if (t.checked){
    //             w+='|'+t.name
    //         }
    //
    //     }
    //     // console.log(w)
    //     if (w){
    //         exp.push(['type','('+w.slice(1)+')'])
    //     }
    //     w=''
    //     for (t of document.querySelectorAll('input.shuaixuan_type')){
    //         if (t.checked){
    //             w+='|'+t.name
    //         }
    //     }
    //     if (w){
    //         exp.push(['type','('+w.slice(1)+')'])
    //     }
    //     w=''
    //     for (t of document.querySelectorAll('input.shuaixuan_status')){
    //         if (t.checked){
    //             w+='|'+t.name
    //         }
    //     }
    //     if (w){
    //         exp.push(['status','('+w.slice(1)+')'])
    //     }
    //
    // }else {return false}
    // console.log('规则')
    // console.log(exp)
    let l;
    let hidden_num = 0
    for (l of exp ){
        // console.log(l)
        let hidden_type;
        let tt;
        hidden_type="("+l[1].join('|')+')'
        // console.log(hidden_type)
        for (tt of all_li) {
            // console.log(dd)
            // console.log(tt)
            // console.log(dd[l[0]])

            if (judge_and_hidden(tt, cow_name[div_name_cow_name[l[0]]], hidden_type)) {
                hidden_num += 1

            }
        }

    }
    $('#hidden_num')[0].innerText=hidden_num
    //alert('共隐藏了' + hidden_num + '个对象')
}

// 获取设置的筛选方案

function get_filtrate_scheme(){// 预计返回一个[[],[]]对象

    let r=[]; // 用于返回的列表
    let l=[]; // 内部的临时列表
    for (let div of neibu_div.querySelectorAll('div')){
        l=[] // 置空
        for (let cb of div.querySelectorAll('input') ){
            // debugger;
            if (cb.checked){
                l.push(cb.name)
                // console.log(l)
            }
        }
        // console.log(l)
        r.push([div.id,l])
    }
    return r
}

function  set_filtrate_scheme(filtrate_set) { // 根据筛选条件设置筛选复选框
    for (let cb of neibu_div.querySelectorAll('input[type="checkbox"]')){
        cb.checked=false
    }// 清除所有设置
    for (let key of filtrate_set){ //应用设置
        for (let key2 of key[1]){
            // console.log(key[0])
            // console.log(key2)
            console.log('div#'+key[0]+'>input[name="'+key2+'"]')
            neibu_div.querySelector('div#'+key[0]+'>input[name="'+key2+'"').checked=true
        }
    }
}

// 获取列标头
function get_th_num() {
    // let t = document.querySelector('li.opinion-item')
    let thead = innerDoc.querySelector('li.opinion-item').querySelector('thead');
    let ths = thead.querySelectorAll('th');
    cow_name = {'type':null,
        'paper_num':null,
        'opinion':null,
        'iso_name':null,
        'date':null,
        'status':null,
        'do':null
    };
    for (let i = 0; i < ths.length; i++) {
        let text = ths[i].innerText
        if (text.match('意见类别')) {
            cow_name['type'] = i
        } else if (text.match('图号')) {
            cow_name['paper_num'] = i
        } else if (text.match('审查意见')) {
            cow_name['opinion'] = i
        } else if (text.match('条文号')) {
            cow_name['iso_name'] = i
        } else if (text.match('提交日期')) {
            cow_name['date'] = i
        } else if (text.match('意见状态')) {
            cow_name['status'] = i
        } else if (text.match('操作')) {
            cow_name['do'] = i
        }
    }
    console.log(cow_name)
}
//根据匹配隐藏 注意是没匹配到的隐藏
function judge_and_hidden(ele,th_num,hidden_type){
    let t1 = ele.querySelectorAll('tr')[1].querySelectorAll('td')[th_num]
    // console.log(t1)
    // console.log(t1.innerText)
    if (!t1.innerText.match(hidden_type)){
        ele.hidden=true
        return true
    }
    return false
}

//---------------------------------------------- 常用意见-----------------------------------------//
let div_replyForm;
let select_changyong;
let btn_push;
let btn_add;
let btn_del;

function init_changyong_sel(){
    console.log(document.querySelector('div#replyForm'))
    console.log(document.querySelector('#select_changyong'))
if (document.querySelector('div#replyForm') &&! document.querySelector('#select_changyong')) {
    div_replyForm = document.querySelector('div#replyForm')
    select_changyong = document.createElement('select')

    select_changyong.style.width = '50%';
    select_changyong.id = 'select_changyong'
// select_changyong.add(new Option('同意审查意见,修改并重新上传.'))
// select_changyong.add(new Option('同意审查意见.'))
    div_replyForm.appendChild(select_changyong)

    select_changyong.save_option = function () {
        let select_changyong_dict = [];
        for (let op of this.options) {
            select_changyong_dict.push(op.value)
        }
        GM_setValue('select_changyong_dict', select_changyong_dict)
        console.log(select_changyong_dict)
        // GM_setValue('select_changyong_dict',this.)
    }
    select_changyong.load_option = function () {
        let select_changyong_dict;
        select_changyong_dict = GM_getValue('select_changyong_dict', ['同意审查意见.', '同意审查意见,修改并重新上传.'])
        for (let op of select_changyong_dict) {
            this.add(new Option(op))
        }

    }
    select_changyong.load_option()


    btn_push = document.createElement('input')
    btn_push.type = 'button'
    btn_push.value = '追加回复'
    btn_push.id = 'push_changyong'
    div_replyForm.appendChild(btn_push)

    btn_add = document.createElement('input')
    btn_add.type = 'button'
    btn_add.value = '增加常用'
    btn_add.id = 'add_changyong'
    div_replyForm.appendChild(btn_add)

    btn_del = document.createElement('input')
    btn_del.type = 'button'
    btn_del.value = '删除常用'
    btn_del.id = 'del_changyong'
    div_replyForm.appendChild(btn_del)

    btn_push.addEventListener('click', push_changyong)
    btn_add.addEventListener('click', add_changyong)
    btn_del.addEventListener('click', del_changyong)

    function push_changyong() {
        this.parentElement.querySelector('textarea').value += '\n' + select_changyong.options[select_changyong.selectedIndex].text
    }

    function del_changyong() {
        select_changyong.options.remove(select_changyong.selectedIndex)
        select_changyong.save_option()
    }

    function add_changyong() {
        select_changyong.add(new Option(this.parentElement.querySelector('textarea').value))
        select_changyong.save_option()
    }
    changong_Timer=null
}
}
let changong_Timer = setInterval(init_changyong_sel, 3000);


(function () {

})();
