// ==UserScript==
// @name         认证助手
// @version      2022.9.2.1
// @description  各认证查询网站搜索协助
// @author       lanjile
// @license      MIT
// @match        *://*.cqccms.com.cn/*
// @match        *://*.idocv.com/*
// @match        *://*.doc88.com/p-*
// @match        *://*.vde.com/*
// @match        *://*.ulprospector.com/*
// @match        *://aip.baidubce.com/*
// @require      https://unpkg.com/tesseract.js@2.0.0-alpha.8/dist/tesseract.min.js
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @namespace    648901355@qq.com
// @downloadURL https://update.greasyfork.org/scripts/384611/%E8%AE%A4%E8%AF%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/384611/%E8%AE%A4%E8%AF%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//var text = window.clipboardData.getData("Text");
//console.log('剪切板文本：',window.clipboardData.getData('Text'));
//if(text != ''){
//$('#query').val(text);
//}

// var renzheng_switch;

// chrome.storage.local.get (null, function (items) {
// renzheng_switch = items['renzheng_switch'];
// console.log("当前开关状态：",renzheng_switch);
// if (renzheng_switch) {
// console.log("111111111",renzheng_switch);
// ZHU()
// }
// });
//window.localStorage.setItem("access_token",null);

//自动展开文档
const btns = Array(
    '.btn-readmore',
    '.show-hide-btn',
    '.down-arrow',
    '.paperclip__showbtn',
    '.expend',
    '.shadow-2n5oidXt',
    '.read_more_btn',
    '.QuestionRichText-more',
    '.QuestionMainAction',
    '.ContentItem-expandButton',
    '.js_show_topic',
    '.tbl-read-more-btn',
    '.more-intro-wrapper',
    '.showMore',
    '.unfoldFullText',
    '.taboola-open',
),
      asyncBtns = Array(
          '#continueButton',
          '.read-more-zhankai',
          '.wgt-answers-showbtn',
          '.wgt-best-showbtn',
          '.bbCodeBlock-expandLink'
      ), delay = 500;
let timer;

function showFull(btns, fn, isDone) {
    for (let i = 0; i < btns.length; i++) {
        try {
            continue
        }
        finally {
            const d = btns[i], dom = document.querySelectorAll(d);
            if (!!dom[0]) {
                fn(dom, d);
            }
        }
    }
    clearTimeout(timer);
    if (!isDone) timer = setTimeout(() => showFull(btns, fn, false), delay);
}

function doShow(dom, d) {
    if (d === '.paperclip__showbtn') {
        dom.forEach(item => item.click());
    } else if (d === '.showMore') {
        dom[0].querySelector('span').click();
    } else {
        dom[0].click();
    }
}

function doAsyncShow(dom, d) {
    dom[0].click();
}

showFull(btns, doShow, false);
window.addEventListener("load", () => {
    clearTimeout(timer);
    setTimeout(() => showFull(asyncBtns, doAsyncShow, true), delay);
});
//******
var $ = window.$;
var window_url = window.location.href;//获取当前URL全部
var url = window.location.pathname; //获取当前URL的路径部分
var cwcs = 0;//定义识别错误次数变量
//console.log("当前URL:"+window_url);
var access_token_data=window.localStorage.getItem("access_token");//定义并获取缓存的access_token变量
var xswjnr_anniu=window.localStorage.getItem("xswjnr_anniu");//显示文件内容按钮缓存
if(xswjnr_anniu == null){
    window.localStorage.setItem("xswjnr_anniu", true);
};
var clyzm_anniu =window.localStorage.getItem("clyzm_anniu");//处理验证码按钮缓存
if(clyzm_anniu == null){
    window.localStorage.setItem("clyzm_anniu", true);
    clyzm_anniu=true;
};
var sbyzm_anniu=window.localStorage.getItem("sbyzm_anniu");//识别验证码按钮缓存
if(sbyzm_anniu == null){
    window.localStorage.setItem("sbyzm_anniu", true);
};
var xz100y_anniu=window.localStorage.getItem("xz100y_anniu");//显示100页按钮缓存
if(xz100y_anniu == null){
    window.localStorage.setItem("xz100y_anniu", true);
};
console.log("获取到的缓存：",access_token_data,xswjnr_anniu,clyzm_anniu,sbyzm_anniu,xz100y_anniu);
//window.localStorage.setItem("access_token", '');
//定义助手代码
var j =
    '<td class="headTitle">'+
    '<input type="checkbox" id="XSWJNR"><input type="submit" id="btn XSWJNR" style="margin-right:10px;" class="btn btn-primary" value="显示文件内容">'+
    '<input type="checkbox" id="CLYZM"><input type="submit" id="btn CLYZM" style="margin-right:10px;" class="btn btn-primary" value="处理验证码">'+
    '<input type="checkbox" id="SBYZM"><input type="submit" id="btn SBYZM" style="margin-right:10px;" class="btn btn-primary" value="识别验证码">'+
    '<input type="checkbox" id="XZ100Y"><input type="submit" id="btn XZ100Y" style="margin-right:10px;" class="btn btn-primary" value="选择100页">'+
    '<canvas id="canvas_yzm" style=" margin-left:10px; margin-right:10px;" width="65" height="25"></canvas>'+
    '<input type="submit" id="btn GY" style="float:right; margin-left:10px; margin-right:10px;" class="btn btn-primary" value="关于">'+
    '<input type="submit" id="btn ZC" style="float:right; margin-left:10px; margin-right:10px;" class="btn btn-primary" value="支持">'+
    '<input type="submit" id="btn BCYM" style="float:right; margin-left:10px; margin-right:10px;" class="btn btn-primary" value="保存页面">'+
    //'<input type="text" id="WYNRBJK" style="float:right; margin-left:10px; margin-right:10px;" value="" width="165" height="125">'+
    '</td>';

//跨域传输，先在主页面body添加iframe，iframe内部处理好数据后发送回主页面，主页面添加接收代码，找了好久！！！---LAN 2021.9.17
function KUAYU() {
    //添加iframe
    document.body.innerHTML=document.body.innerHTML+'<iframe id="iframe_id" width="800px" height="200px" src="https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=WS99vGORbgp3rU5GFFy3iLC0&client_secret=MwTGoHoP2RtOnmiMi9O5bRG1hhhHV0Vv"></iframe>'
    //添加接收代码
    window.addEventListener("message",function(e){
        var Date=e.data;
        console.log("主页面接收到处理后的数据：",Date);
        //缓存access_token数据
        window.localStorage.setItem("access_token", Date);
        console.log("主页面缓存了access_token数据：",Date);
        //刷新主页面
        window.location.href = window_url
    },false);

};


if(window_url.indexOf('idocv.com') != -1){
    //var bcwb0 = document.innerHTML
    //var jjj='>www.idocv.com</div>'
    //     console.log(bcwb0);
    //document.innerHTML= bcwb0.replace(jjj, '>LAN</div>');//去除
    //document.innerHTML= bcwb0
    //     console.log("进入idocv.com页面。");
    //     var idocv_div = document.getElementsByTagName("div");
    //     console.log("idocv_div数量",idocv_div.length);
    //     if(idocv_div.length > 0){
    //         for (var idocv_div_i = 0; idocv_div_i < idocv_div.length; idocv_div_i++) {
    //             console.log("idocv_div[idocv_div_i].innerText ",idocv_div[idocv_div_i].innerText);
    //             if(idocv_div[idocv_div_i].innerText == 'www.idocv.com'){
    //                 idocv_div[idocv_div_i].innerText ="LAN"
    //             }
    //         }
    //     }


}else if(window_url.indexOf('aip.baidubce.com') != -1){
    //跨域传输，iframe内部处理好数据后发送回主页面---LAN 2021.9.17
    console.log("进入数据页面，开始处理数据。");
    var data= document.body.innerHTML;
    data = data.split('access_token\":\"');
    data = data[1].split('\"');
    console.log("数据页面处理后的数据：",data[0]);
    document.body.innerHTML=data[0];
    //向主页面发送处理后的access_token数据
    window.parent.postMessage(data[0],'http://webdata.cqccms.com.cn');


}else if (window_url.indexOf('doc88.com/p-') != -1) {
    DOC88();

}else if (window_url.indexOf('docin.com/p-') != -1) {
    //docin();

}else if (url.indexOf('webdata/query/CCCCerti.do') != -1) {
    document.getElementsByTagName("table")[1].innerHTML = '<tbody><tr><td class="headTitle">CCC证书查询</td></tr></tbody>'+j;
    ZHUSHOU();
    YZMCL();
    CCCCerti();

}else if (url.indexOf('webdata/query/ZYCerti.do') != -1) {
    document.getElementsByTagName("table")[1].innerHTML = '<tbody><tr><td class="headTitle">CQC证书查询</td></tr></tbody>'+j;
    ZHUSHOU();
    YZMCL();
    ZYCerti();

}else if (url == '/en/Institute/OnlineService/VDE-approved-products/Pages/Online-Search.aspx') {
    VDE_Online_Search()
}else if(url == '/en/Institute/OnlineService/VDE-approved-products/Pages/Detail-Search.aspx'){
    VDE_Detail_Search()
}else if (url == '/en/Institute/OnlineService/VDE-approved-products/Pages/SearchResult.aspx') {
    VDE_SearchResult()
}else if (url == '/session/new') {
    UL_new()
}else if (url == '/en/') {
    UL_en()
}else if (url == '/en/_') {
    UL_en_()
}

function ZHUSHOU() {
    if(window.localStorage.getItem("xswjnr_anniu")=="true"){
        document.getElementById("XSWJNR").checked =true;
    }else{
        document.getElementById("XSWJNR").checked =false;
    };
    if(window.localStorage.getItem("clyzm_anniu")=="true"){
        document.getElementById("CLYZM").checked =true;
    }else{
        document.getElementById("CLYZM").checked =false;
    };
    if(window.localStorage.getItem("sbyzm_anniu")=="true"){
        document.getElementById("SBYZM").checked =true;
    }else{
        document.getElementById("SBYZM").checked =false;
    };
    if(window.localStorage.getItem("xz100y_anniu")=="true"){
        document.getElementById("XZ100Y").checked =true;
    }else{
        document.getElementById("XZ100Y").checked =false;
    };
    document.getElementById("imageID").addEventListener('load', YZMCL);
    document.getElementById("btn XSWJNR").addEventListener('click',FXKXSWJNR);
    document.getElementById('btn CLYZM').addEventListener('click',FXKCLYZM);
    document.getElementById("btn SBYZM").addEventListener('click',FXKSBYZM);
    document.getElementById('btn XZ100Y').addEventListener('click',FXKXZ100Y);
    document.getElementById('btn GY').addEventListener('click',GY);
    document.getElementById('btn ZC').addEventListener('click',ZC);
    document.getElementById('btn BCYM').addEventListener('click',BCYM);

};
function FXKXSWJNR() {
    if(document.getElementById("XSWJNR").checked ==true){
        document.getElementById("XSWJNR").checked =false;
        window.localStorage.setItem("xswjnr_anniu", false);
        document.getElementById("XSWJNR").addEventListener('click', CCCCerti);
    }else{
        document.getElementById("XSWJNR").checked =true;
        window.localStorage.setItem("xswjnr_anniu", true);
        document.getElementById("XSWJNR").removeEventListener('click', CCCCerti);
    }
}
function FXKCLYZM() {
    if(document.getElementById("CLYZM").checked ==true){
        document.getElementById("CLYZM").checked =false;
        window.localStorage.setItem("clyzm_anniu", false);
        document.getElementById("imageID").addEventListener('load', YZMCL);
    }else{
        document.getElementById("CLYZM").checked =true;
        window.localStorage.setItem("clyzm_anniu", true);
        document.getElementById("imageID").removeEventListener('load', YZMCL);
    }
}
function FXKSBYZM() {
    if(document.getElementById("SBYZM").checked ==true){
        document.getElementById("SBYZM").checked =false;
        window.localStorage.setItem("sbyzm_anniu", false);
        document.getElementById("SBYZM").addEventListener('click', YZMSB);
    }else{
        document.getElementById("SBYZM").checked =true;
        window.localStorage.setItem("sbyzm_anniu", true);
        document.getElementById("SBYZM").removeEventListener('click', YZMSB);
    }
}
function FXKXZ100Y() {
    if(document.getElementById("XZ100Y").checked ==true){
        document.getElementById("XZ100Y").checked =false;
        window.localStorage.setItem("xz100y_anniu", false);
        document.getElementById("XZ100Y").addEventListener('lclick', xz100y);
    }else{
        document.getElementById("XZ100Y").checked =true;
        window.localStorage.setItem("xs100y_anniu", true);
        document.getElementById("XZ100Y").removeEventListener('click', xz100y);
    }
}
function GY() {

    console.log('认证查询助手：\n\n协助快速完成认证查询工作,只做学习使用，不可用于其他用途。\n\n---蓝吉乐 2019.9---');
}
//保存程序
function downloadFile(fileName, content){
    var aLink = document.createElement('a');//创建下载按钮
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
    aLink.download = fileName;//设置下载文件名
    aLink.href = URL.createObjectURL(blob);
    //aLink.dispatchEvent(evt);
    aLink.click();
}
function BCYM() {
    var bcwb = document.getElementsByTagName("html")[0].innerHTML
    bcwb = bcwb.replace(j, '');//去除助手
    bcwb = bcwb.replace('<head>', '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head>');//添加头
    bcwb = bcwb.replace('</body>', '</body></html>');//添加尾
    bcwb = bcwb.replace('content="text/html;charset=GBK"', 'content="text/html";charset="GBK"');//修改让网页正常显示中文
    bcwb = bcwb.replace(/="\//g, '="' + location.protocol + '//' + location.hostname + '/');//全部替换成固定地址
    var sswb = "";
    if(document.getElementsByName("keyword")[0].value!=""){
        sswb = document.getElementsByName("keyword")[0].value;
    }
    var d = new Date();
    downloadFile(document.title + "（" + sswb + "）" + d.toLocaleString() + ".html",bcwb);//下载保存

}
function ZC() {
    var zc = document.getElementsByTagName("tbody")
    if ( document.getElementById("zcid") == null){
        zc[zc.length-2].innerHTML = '<tbody><tr><img src="https://i.loli.net/2019/08/26/GRQLIcf1qx9XrtV.png" id="zcid" style="width:600px; margin-left:30%;"></tr></tbody>';
    }else{
        zc[zc.length-2].innerHTML = '<tbody><tr><td height="20"></td></tr></tbody>';
    }

}

function xz100y() {
    document.getElementsByTagName("select")[1].value=100;
    //var CCCCerti_select = document.getElementsByTagName("select")[1].value='100';
    //if(CCCCerti_select[1].value!='100'){
    // CCCCerti_select[1].value='100';
    // CCCCerti_select[1].onChange();
    // var event = document.createEvent("HTMLEvents");
    //event.initEvent("change", true, true);
    // document.querySelector(CCCCerti_select[1]).dispatchEvent(event);
    // }
};
function CCCCerti() {
    var CCCCerti_td = document.getElementsByTagName("td");
    if(CCCCerti_td.length > 0){
        for (var CCCCerti_i = 0; CCCCerti_i < CCCCerti_td.length; CCCCerti_i++) {
            if(CCCCerti_td[CCCCerti_i].innerText == '有效 Valid' || CCCCerti_td[CCCCerti_i].innerText == '已撤销 Withdrawn' || CCCCerti_td[CCCCerti_i].innerText == '已注销 Cancelled'){
                if(CCCCerti_td[CCCCerti_i+3].innerText !== ''){
                    var iframe = document.createElement("iframe");
                    iframe.width="940px";
                    iframe.height="760px";
                    var CCCCerti_src = CCCCerti_td[CCCCerti_i+3].getElementsByTagName("a")[0].href;
                    var dizi='https://ow365.cn/?i=30038&fname='+ CCCCerti_td[CCCCerti_i-10].innerText+'&furl='+ CCCCerti_src;
                    //var dizi='https://api.idocv.com/view/url?url='+ encodeURIComponent(CCCCerti_src);
                    iframe.src = dizi;
                    //console.log("iframe.src",iframe.src);
                    CCCCerti_td[CCCCerti_i-10].innerText = '证书编号：'+ CCCCerti_td[CCCCerti_i-10].innerText + '\n\n申请人：'+ CCCCerti_td[CCCCerti_i-9].innerText + '\n\n制造商：'+ CCCCerti_td[CCCCerti_i-8].innerText + '\n\n生产厂：'+ CCCCerti_td[CCCCerti_i-7].innerText ;
                    CCCCerti_td[CCCCerti_i-9].innerText = '产品名称：\n'+ CCCCerti_td[CCCCerti_i-6].innerText ;
                    CCCCerti_td[CCCCerti_i+2].innerText = '标准：'+ CCCCerti_td[CCCCerti_i-4].innerText + '\n——————\n发证日期：'+ CCCCerti_td[CCCCerti_i-3].innerText + '\n———首次发证日期：'+ CCCCerti_td[CCCCerti_i-2].innerText + '\n———证书截止日期：'+ CCCCerti_td[CCCCerti_i-1].innerText + '\n———现状态：'+ CCCCerti_td[CCCCerti_i].innerText + '\n———证书状态变化时间：'+ CCCCerti_td[CCCCerti_i+1].innerText + '\n———原因：'+ CCCCerti_td[CCCCerti_i+2].innerText;
                    CCCCerti_td[CCCCerti_i+1].innerText = '';
                    CCCCerti_td[CCCCerti_i].innerText = '';
                    CCCCerti_td[CCCCerti_i-1].innerText = '';
                    CCCCerti_td[CCCCerti_i-2].innerText = '';
                    CCCCerti_td[CCCCerti_i-3].innerText = '';
                    CCCCerti_td[CCCCerti_i-4].innerText = '';
                    CCCCerti_td[CCCCerti_i-5].innerText = '';
                    CCCCerti_td[CCCCerti_i-6].innerText = '';
                    CCCCerti_td[CCCCerti_i-7].innerText = '';
                    CCCCerti_td[CCCCerti_i-8].innerText = '';
                    CCCCerti_td[CCCCerti_i-8].append(iframe);
                    //setTimeout(CCCCerti_i*100);

                }
            }
        }
    }
    //YZiframe()
}

function YZiframe() {
    var Yiframe = document.getElementsByTagName("iframe");
    for (var Yiframe_i = 0; Yiframe_i < Yiframe.length; Yiframe_i++) {
        if(!Yiframe[Yiframe_i].onload){
            Yiframe[Yiframe_i].contentWindow.location.reload();
        }
    }
};
function ZYCerti() {
    var ZYCerti_td = document.getElementsByTagName("td");
    if(ZYCerti_td.length > 0){
        for (var ZYCerti_i = 0; ZYCerti_i < ZYCerti_td.length; ZYCerti_i++) {
            if(ZYCerti_td[ZYCerti_i].innerText == '有效 Valid' || ZYCerti_td[ZYCerti_i].innerText == '已注销 Cancelled' || ZYCerti_td[ZYCerti_i].innerText == '已撤销 Withdrawn'){
                if(ZYCerti_td[ZYCerti_i+3].innerText !== ''){
                    var iframe = document.createElement("iframe");
                    iframe.width="880px";
                    iframe.height="600px";
                    var ZYCerti_src = ZYCerti_td[ZYCerti_i+3].getElementsByTagName("a")[0].href;
                    var dizi='https://ow365.cn/?i=30038&fname='+ ZYCerti_td[ZYCerti_i-10].innerText+'&furl='+ ZYCerti_src;
                    //var dizi='https://api.idocv.com/view/url?url='+ encodeURIComponent( ZYCerti_src);
                    iframe.src = dizi;
                    ZYCerti_td[ZYCerti_i-10].innerText = '证书编号：'+ZYCerti_td[ZYCerti_i-10].innerText + '\n\n申请人：'+ ZYCerti_td[ZYCerti_i-9].innerText + '\n\n制造商：'+ ZYCerti_td[ZYCerti_i-8].innerText + '\n\n生产厂：'+ ZYCerti_td[ZYCerti_i-7].innerText ;
                    ZYCerti_td[ZYCerti_i-9].innerText = '工厂编号：\n' + ZYCerti_td[ZYCerti_i-6].innerText+ '\n\n产品：'+ ZYCerti_td[ZYCerti_i-5].innerText ;
                    ZYCerti_td[ZYCerti_i+2].innerText ='标准：'+ ZYCerti_td[ZYCerti_i-3].innerText + '\n\n发证日期：'+ ZYCerti_td[ZYCerti_i-2].innerText + '\n\n证书截止日期：'+ ZYCerti_td[ZYCerti_i-1].innerText + '\n\n证书状态：'+ ZYCerti_td[ZYCerti_i].innerText + '\n\n证书状态变化时间：'+ ZYCerti_td[ZYCerti_i+1].innerText + '\n\n原因：'+ ZYCerti_td[ZYCerti_i+2].innerText;
                    ZYCerti_td[ZYCerti_i+1].innerText = '';
                    ZYCerti_td[ZYCerti_i].innerText = '';
                    ZYCerti_td[ZYCerti_i-1].innerText = '';
                    ZYCerti_td[ZYCerti_i-2].innerText = '';
                    ZYCerti_td[ZYCerti_i-3].innerText = '';
                    ZYCerti_td[ZYCerti_i-4].innerText = '';
                    ZYCerti_td[ZYCerti_i-5].innerText = '';
                    ZYCerti_td[ZYCerti_i-6].innerText = '';
                    ZYCerti_td[ZYCerti_i-7].innerText = '';
                    ZYCerti_td[ZYCerti_i-8].innerText = '';
                    ZYCerti_td[ZYCerti_i-8].append(iframe);
                    //setTimeout(ZYCerti_i*100);
                }
            }
        }
    }
}

function VDE_Online_Search() {
    var VDE_Online_td = document.getElementsByTagName("td");
    for (var VDE_Online_i = 0; VDE_Online_i < VDE_Online_td.length; VDE_Online_i++) {
        if(VDE_Online_td[VDE_Online_i].innerText == 'No search results.'){
            VDE_Online_td[VDE_Online_i].innerText = '没有搜索结果。》》》LAN JILE 2019.6《《《'
            VDE_Online_i = VDE_Online_td.length
        }
    }
    document.getElementsByName("ctl00$SPWebPartManager1$g_0e8aa12b_f819_403f_8243_19f81274454c$ctl02")[0].value = "输入证书或客户编号";
    document.getElementsByName("ctl00$SPWebPartManager1$g_0e8aa12b_f819_403f_8243_19f81274454c$ctl03")[0].value = "搜索";
    document.getElementsByName("ctl00$SPWebPartManager1$g_0e8aa12b_f819_403f_8243_19f81274454c$ctl05")[0].value = "无编号搜索";
}

function VDE_Detail_Search() {
    var VDE_Detail_div = document.getElementsByTagName("div");
    for (var VDE_Detail_iii = 0; VDE_Detail_iii < VDE_Detail_div.length; VDE_Detail_iii++) {
        if(VDE_Detail_div[VDE_Detail_iii].innerText == 'If you do not have your reference number, you can find information about the certificates to the sign pictured above on the following input options:'){
            VDE_Detail_div[VDE_Detail_iii].innerText = 'If you do not have your reference number, you can find information about the certificates to the sign pictured above on the following input options:\n（如果您没有参考号，您可以在以下输入选项中找到有关上述标志证书的信息：)'
            VDE_Detail_iii = VDE_Detail_div.length
        }
    }
    var VDE_span = document.getElementsByTagName("span");
    for (var VDE_Detail_i = 0; VDE_Detail_i < VDE_span.length; VDE_Detail_i++) {
        if(VDE_span[VDE_Detail_i].innerText == 'Product'){
            VDE_span[VDE_Detail_i].innerText = 'Product (产品名称)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'Company'){
            VDE_span[VDE_Detail_i].innerText = 'Company (公司名称)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'Customer no.'){
            VDE_span[VDE_Detail_i].innerText = 'Customer no. (客户编号)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'Certificate no.'){
            VDE_span[VDE_Detail_i].innerText = 'Certificate no. (证书编号)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'VDE Reg-No.'){
            VDE_span[VDE_Detail_i].innerText = 'VDE Reg-No. (注册编号)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'Certification mark'){
            VDE_span[VDE_Detail_i].innerText = 'Certification mark (认证标志)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'Type'){
            VDE_span[VDE_Detail_i].innerText = 'Type (类型/型号)'
        }else if(VDE_span[VDE_Detail_i].innerText == 'Search without reference number'){
            VDE_span[VDE_Detail_i].innerText = 'Search without reference number (无编号搜索)'
        }
    }
    var VDE_Detail_td = document.getElementsByTagName("td");
    for (var VDE_Detail_ii = 0; VDE_Detail_ii < VDE_Detail_td.length; VDE_Detail_ii++) {
        if(VDE_Detail_td[VDE_Detail_ii].innerText == 'No search results.'){
            VDE_Detail_td[VDE_Detail_ii].innerText = '没有搜索结果。》》》LAN JILE 2019.6《《《'
            VDE_Detail_ii = VDE_Detail_td.length
        }
    }
    document.getElementsByName("ctl00$SPWebPartManager1$g_14a471a3_313d_497c_9a36_032ec1a7aa5b$ctl15")[0].value = "返回";
    document.getElementsByName("ctl00$SPWebPartManager1$g_14a471a3_313d_497c_9a36_032ec1a7aa5b$ctl18")[0].value = "搜索";
}

function VDE_SearchResult() {
    document.getElementsByTagName("h1")[1].innerText = 'Catalog VDE approved products（VDE认证产品目录）';
    document.getElementsByName("ctl00$SPWebPartManager1$g_4d02fd22_3569_4db8_b5eb_f15c8fa88cae$ctl02")[0].value = "再次搜索";
    var VDE_SearchResult_a = document.getElementsByTagName("a");
    for (var VDE_SearchResult_i = 0; VDE_SearchResult_i < VDE_SearchResult_a.length; VDE_SearchResult_i++) {
        if(VDE_SearchResult_a[VDE_SearchResult_i].innerText == 'Certificate no.'){
            VDE_SearchResult_a[VDE_SearchResult_i].innerText = 'Certificate no.（证书编号）'
        }else if(VDE_SearchResult_a[VDE_SearchResult_i].innerText == 'Company'){
            VDE_SearchResult_a[VDE_SearchResult_i].innerText = 'Company（公司名称）'
        }else if(VDE_SearchResult_a[VDE_SearchResult_i].innerText == 'Product'){
            VDE_SearchResult_a[VDE_SearchResult_i].innerText = 'Product（产品名称）'
        }else if(VDE_SearchResult_a[VDE_SearchResult_i].innerText == 'First types'){
            VDE_SearchResult_a[VDE_SearchResult_i].innerText = 'First types（型号）'
        }
    }
}

function UL_new() {
    document.getElementById("email").value = "467135995@qq.com";
    document.getElementById("loginPass").value = "qq22391023";
    document.getElementById("ssoInfo").innerText = "账号和密码已自动填写，可直接登录。\n》》》LAN JILE 2019.6《《《";
}

function UL_en() {
    var UL_en_h2 = document.getElementsByTagName("h2");
    for (var UL_en_i = 0; UL_en_i < UL_en_h2.length; UL_en_i++) {
        if(UL_en_h2[UL_en_i].innerText == 'Create a Search Now'){
            UL_en_h2[UL_en_i].innerText = 'Create a Search Now（立即创建搜索）'
        }
    }
    var UL_en_a = document.getElementsByTagName("a");
    for (var UL_en_i3 = 0; UL_en_i3 < UL_en_a.length; UL_en_i3++) {
        if(UL_en_a[UL_en_i3].innerText == 'SEARCH'){
            UL_en_a[UL_en_i3].innerText = 'SEARCH（搜索）'
        }else if(UL_en_a[UL_en_i3].innerText == 'MY SEARCHES'){
            UL_en_a[UL_en_i3].innerText = 'MY SEARCHES（我的搜索）'
        }else if(UL_en_a[UL_en_i3].innerText == 'MY TAGS'){
            UL_en_a[UL_en_i3].innerText = 'MY TAGS（我的标签）'
        }else if(UL_en_a[UL_en_i3].innerText == 'My Account'){
            UL_en_a[UL_en_i3].innerText = 'My Account（我的帐户）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Preferences'){
            UL_en_a[UL_en_i3].innerText = 'Preferences（偏好）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Sign Out'){
            UL_en_a[UL_en_i3].innerText = 'Sign Out（签出）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Cancel'){
            UL_en_a[UL_en_i3].innerText = 'Cancel（取消）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Feedback'){
            UL_en_a[UL_en_i3].innerText = 'Feedback（反馈）'
        }
    }
    document.getElementById("q2").placeholder = "输入文件编号/型号或其他关键字";
}

function UL_en_() {
    var UL_en_label = document.getElementsByTagName("label");
    for (var UL_en_i1 = 0; UL_en_i1 < UL_en_label.length; UL_en_i1++) {
        if(UL_en_label[UL_en_i1].innerText == 'Keyword'){
            UL_en_label[UL_en_i1].innerText = 'Keyword（关键字）'
        }else if(UL_en_label[UL_en_i1].innerText == 'UL Category Control Number'){
            UL_en_label[UL_en_i1].innerText = 'UL Category Control Number（UL地区分类号）'
        }else if(UL_en_label[UL_en_i1].innerText == 'Company Name'){
            UL_en_label[UL_en_i1].innerText = 'Company Name（公司名称）'
        }else if(UL_en_label[UL_en_i1].innerText == 'File Number'){
            UL_en_label[UL_en_i1].innerText = 'File Number（文件号）'
        }else if(UL_en_label[UL_en_i1].innerText == 'Country Name'){
            UL_en_label[UL_en_i1].innerText = 'Country Name（国家名）'
        }else if(UL_en_label[UL_en_i1].innerText == 'Add Filter'){
            UL_en_label[UL_en_i1].innerText = 'Add Filter（添加过滤器）'
        }
    }
    var UL_en_span = document.getElementsByTagName("span");
    for (var UL_en_i2 = 0; UL_en_i2 < UL_en_span.length; UL_en_i2++) {
        if(UL_en_span[UL_en_i2].innerText == 'Search'){
            //UL_en_span[UL_en_i2].innerText = '搜索'
        }else if(UL_en_span[UL_en_i2].innerText == 'Save Search'){
            UL_en_span[UL_en_i2].innerText = '保存搜索'
        }
    }
    var UL_en_a = document.getElementsByTagName("a");
    for (var UL_en_i3 = 0; UL_en_i3 < UL_en_a.length; UL_en_i3++) {
        if(UL_en_a[UL_en_i3].innerText == 'SEARCH'){
            UL_en_a[UL_en_i3].innerText = 'SEARCH（搜索）'
        }else if(UL_en_a[UL_en_i3].innerText == 'MY SEARCHES'){
            UL_en_a[UL_en_i3].innerText = 'MY SEARCHES（我的搜索）'
        }else if(UL_en_a[UL_en_i3].innerText == 'MY TAGS'){
            UL_en_a[UL_en_i3].innerText = 'MY TAGS（我的标签）'
        }else if(UL_en_a[UL_en_i3].innerText == 'My Account'){
            UL_en_a[UL_en_i3].innerText = 'My Account（我的帐户）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Preferences'){
            UL_en_a[UL_en_i3].innerText = 'Preferences（偏好）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Sign Out'){
            UL_en_a[UL_en_i3].innerText = 'Sign Out（签出）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Cancel'){
            UL_en_a[UL_en_i3].innerText = 'Cancel（取消）'
        }else if(UL_en_a[UL_en_i3].innerText == 'Feedback'){
            UL_en_a[UL_en_i3].innerText = 'Feedback（反馈）'
        }
    }
}


function YZMCL() {
    var img = document.getElementById('imageID');
    var output_text = document.getElementsByName('imagePassword')[0];
    var canvas = document.getElementById('canvas_yzm');
    var c = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    c.drawImage(img, 0, 0, canvas.width, canvas.height);
    var imgData = c.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imgData,imgData.data.length);
    var index = 50//阈值
    for (var i = 0; i < imgData.data.length; i += 4) {
        var R = imgData.data[i]; //R(0-255)
        var G = imgData.data[i + 1]; //G(0-255)
        var B = imgData.data[i + 2]; //B(0-255)
        var Alpha = imgData.data[i + 3]; //Alpha(0-255)
        var sum = (R + G + B)/3;
        if (sum > index) {
            imgData.data[i] = 255;
            imgData.data[i + 1] = 255;
            imgData.data[i + 2] = 255;
            imgData.data[i + 3] = 255;
        } else {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 255;
        }
        c.putImageData(imgData, 0, 0);
    }
    //     for (var i11 = 0; i11 < imgData.data.length; i11 += 4) {
    //         if (imgData.data[i11] == 0) {
    //             if (imgData.data[i11 - 8] == 255 && imgData.data[i11 -4] == 255 && imgData.data[i11 +4] == 255) {
    //                 imgData.data[i11-4] = 0;
    //                 imgData.data[i11-3] = 0;
    //                 imgData.data[i11-2] = 0;
    //                 imgData.data[i11-1] = 255;
    //             }
    //             if (imgData.data[i11 - 260] == 255 && imgData.data[i11 - 520] == 255) {
    //                 imgData.data[i11-260] = 0;
    //                 imgData.data[i11-259] = 0;
    //                 imgData.data[i11-258] = 0;
    //                 imgData.data[i11-257] = 255;
    //             }

    //             c.putImageData(imgData, 0, 0);
    //         }
    //     }

    if(document.getElementById("SBYZM").checked ==true){
        YZMSB('canvas_yzm');
    }

}

function YZMSB(id) {
    document.getElementsByName('imagePassword')[0].value = "";
    // 图片base64化
    var newUrl = document.getElementById(id).toDataURL();
    var newUrl_base64 = newUrl.replace(/^(data:\s*image\/(\w+);base64,)/g, '');
    console.log('验证码图片base64化数据：',newUrl_base64);
    window.$.ajax({
        type: 'post',
        url: "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?",//general_basic标准版  accurate_basic高精度版
        data: {
            "access_token": access_token_data,
            "image": newUrl_base64,
            "language_type": "ENG",
            "detect_direction": "false",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        dataType: "json",
        success: function (data) {
            console.log('服务器回传数据：',data,JSON.stringify(data.words_result));
            if (JSON.stringify(data.words_result_num) == "1") {
                var words_result = JSON.stringify(data.words_result);//zh
                words_result = words_result.replace(' ', '');
                words_result = words_result.replace('[{\"words\":\"', '');
                words_result = words_result.replace('\"}]', '');
                console.log('处理后验证码：',words_result);
                if(words_result.length == 5 || words_result.length == 6){
                    var qian = Number(words_result.substring(0,1))
                    var suan = words_result.substring(1,2)
                    var hou = Number(words_result.substring(2,3))
                    var jieguo = 666
                    console.log('qian:',isFinite(qian),'hou:',isFinite(hou));
                    if (isFinite(qian)==true && isFinite(hou)==true){
                        if (suan=="+"){
                            jieguo = qian+hou;
                        }else if (suan=="-"){
                            jieguo = qian-hou;
                        }else if (suan=="*"){
                            jieguo = qian*hou;
                        }else if (suan=="/" || suan=="%"){
                            jieguo = qian/hou;
                        }else{
                            setTimeout(function(){ YZMSB_yichang(); }, 500);
                        }
                        console.log('结果：',jieguo);
                        if (jieguo == 666){
                            setTimeout(function(){ YZMSB_yichang(); }, 500);
                        }else{
                            document.getElementsByName('imagePassword')[0].value = jieguo;
                            cwcs = 0;
                        }
                    }else{
                        setTimeout(function(){ YZMSB_yichang(); }, 500);
                    }
                }else{
                    setTimeout(function(){ YZMSB_yichang(); }, 500);
                };

            }else {
                setTimeout(function(){ YZMSB_yichang(); }, 500);
                return false;
            };
        },
        error:function(){
            console.log('错误，进入获取access_token程序');
            KUAYU();
        }
    });
};

function dianji() {
    var yichang_input = document.getElementsByTagName("input");
    if(yichang_input.length > 0){
        for (var yichang_input_i = 0; yichang_input_i < yichang_input.length; yichang_input_i++) {
            console.log(yichang_input.length,yichang_input[yichang_input_i].value)
            if(yichang_input[yichang_input_i].value == '换一个(Change)'){
                yichang_input[yichang_input_i].click();
            }
        }
    }
};

function YZMSB_yichang() {
    if (cwcs <5){
        cwcs = cwcs+1;
        console.log("错误后执行次数",cwcs);
        console.log("错误后执行次数",document.getElementsByTagName("input").length);
        setTimeout(dianji(),500);

    }else{
        document.getElementsByName('imagePassword')[0].value = "连续错误超过5次";
        cwcs = 0;
    };

};

function DOC88() {
    [
        'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.js',
        'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.js'
    ].forEach(link => {
        let script = document.createElement('script');
        script.src = link;
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
    });



    let btn = `<button id="download-pngs" style="position:fixed; bottom:20rem;left:2.8rem;z-index:99999;">下载图片</button>`,
        form = `
             <form id="download-pdf" style="position:fixed;bottom:22rem;left:2rem;z-index:99999;padding:10px;border:1.5px solid gray;background:white;">
                 <section style="margin:0.5rem 0rem;">
                     <input type="radio" id="paper-size-raw" name="paper-size" value="raw" required>
                     <label for="paper-size-a4">原始比例</label>
                 </section>
                 <section style="margin:1rem 0rem;">
                     <input type="radio" id="paper-size-a4" name="paper-size" value="a4" required checked>
                     <label for="paper-size-a4">A4 大小</label>
                 </section>
                 <button>
                     下载PDF
                 </button>
             </form>
        `,
        ts = ` <form id="doc88_ts" style="position:fixed;bottom:13rem;left:2rem;z-index:99999;padding:5px;border:1px solid gray;background:white;color:red">
        文档已自动展开<br>需全部加载完成<br>方可下载！<br>--------------蓝
        </form>
        `
    ;

    $('body').append(ts).append(btn).append(form);

    $(`#download-pngs`).click(() => {
        document.getElementById("download-pngs").disabled = true;
        let zip = window.JSZip();
        $('canvas[id^="page_"]').each((index, page) => {
            let base64 = page.toDataURL();
            let blob = atob(base64.split(',')[1]);
            zip.file(`${index.toString()}.png`, blob, {binary: true});
        });
        zip.generateAsync({type:"blob"})
            .then((content) => {
            window.saveAs(content, `${$('title').text()}.zip`);
            document.getElementById("download-pngs").disabled = false;
        });
    });

    $(`#download-pdf`).submit((e) => {
        e.preventDefault();
        console.log("page_数量 :",$('[id^="page_"]').length);

        if(confirm( "文档 共"+$('[id^="page_"]').length+"页 ，正在下载中，请耐心等待。。。")){
            var is_ask_for_raw_proportion = $(`#paper-size-raw`).is(':checked');
            console.log("尺寸选中is_ask_for_raw_proportion:",is_ask_for_raw_proportion);
            var orientation = $('#page_1').width() > $('#page_1').height() ? 'l' : 'p';
            console.log("方向orientation :",orientation );
            var { jsPDF } = window.jspdf;
            console.log("jsPDF :",jsPDF );

            let doc = is_ask_for_raw_proportion ?
                new jsPDF(orientation, 'mm', [$('#page_1').attr('height'), $('#page_1').attr('width')]) :
            new jsPDF(orientation, 'px', 'a4');

            var width = parseInt(doc.internal.pageSize.getWidth());
            console.log("宽度 :",width);
            var height = parseInt(doc.internal.pageSize.getHeight());
            console.log("高度 :",height );

            $('[id^="page_"]').each((index, page) => {
                //在doc中添加图像，toDataURL(mimeType, quality)
                //doc.addImage(page.toDataURL('image/jpeg'),'jpeg', 0, 0, width, height);
                console.log("page :",page);
                doc.addImage(page.toDataURL('image/jpeg'),'', 0, 0, width, height);
                //console.log("doc :",doc);

                if (index !== ($('[id^="page_"]').length - 1)) {
                    doc.addPage();
                }
            });
            doc.save($('title').text().replace(' - 道客巴巴', '')+'.pdf');//去除文件名内容

        }
    });

};
