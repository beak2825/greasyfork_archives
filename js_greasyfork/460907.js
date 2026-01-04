// ==UserScript==
// @license MIT
// @name         快速复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快速复制企业信息
// @author       lemondqs
// @match        https://www.tianyancha.com/company/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianyancha.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/460907/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460907/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
setTimeout(function(){


    // 提前展开页面 保障信息完整
    $('.introduceRich_btn__sfAyp').click()

    // 获取行业信息
    function gethyinfo() {
        var hy = '';
        let hyidx = null;
        $('.index_tableBox__ZadJW tr').each((idx, tr)=>{
            if(idx==6) {
                $(tr).children().each((tdid, td)=>{
                    if (hyidx !== null && tdid === hyidx+1) {
                        hy = $(td).text()
                    } else if($(td).text()=='行业') {hyidx = tdid;}
                })
            }
        })
        return hy;
    }
    // 获取经营范围信息
    function getjyinfo() {
        var jy = '';
        let jyidx = null;
        $('.index_tableBox__ZadJW tr').each((idx, tr)=>{
            if(idx==10) {
                $(tr).children().each((tdid, td)=>{
                    if (jyidx !== null && tdid === jyidx+1) {
                        jy = $(td).text()
                    } else if($(td).text()=='经营范围') {jyidx = tdid;}
                })
            }
        })
        return jy;
    }
    // 获取县区名
    function getcounty() {
        var info;
        var result = '';
        var loc = $('.index_detail-address__ZmaTI').html();
        var reg = /.+?(省|市|自治区|自治州|县|区)/g
        if (loc) {
            info = loc.match(reg)
        }
        info.forEach((it, idx)=>{
            if(it.includes('县')) result = it
            else if(it.includes('区')) result = it
            else if(it.includes('市')) result = it
        })
        return result;
    }

    // 获取联系方式
    function getrls() {
        var man = $('.index_link-click__NmHxP').html();
        var tel = $('.index_detail-tel__fgpsE').html();
        return '('+man+'){法人}['+tel+']'
    }

    // 获取全部信息
    function getinfo() {
        var com = $('.index_company-name__LqKlo').html();
        var loc = $('.index_detail-address__ZmaTI').html();
        var dec = $('.introduceRich_expand-item__Vuo_n').text()
        try {
            dec = dec.match(/基本信息(\S*)企业注册资本/)[1];
        } catch (e) {
            console.log(e)
        }
        var rls = getrls();
        var hyi = gethyinfo();
        var cou = getcounty();
        var jyi = getjyinfo();
        var obj = {com, loc, cou, hyi, rls, dec, jyi};
        return obj;
    }
    // 缓存一次保障效率
    var info = getinfo()

    //setTimeout(console.info(Object.values(info).join('\n')), 1000)

    // 保存进剪切板需异步操作
    async function copyinfo() {
        try {
            await navigator.clipboard.writeText(Object.values(info).join('\t')+"\n");

            $("#x-copy").html("已复制");
            $("#x-copy").css("background-color", "#00FF6677")

            setTimeout(()=>{
                $("#x-copy").html("复制信息");
                $("#x-copy").css("background-color", "#0066FF77")
            }, 1000)
            console.log('Infos copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
    // 挂载到窗体
    window.copyinfo = copyinfo;

    // 多页支持
    function mulinfo() {
        let cominfo = {}
        let locst = localStorage.getItem('cominfo')
        if (locst) {
            cominfo = JSON.parse(locst)
        }
        cominfo[info.com] = Object.values(info).join('\t')+"\n";
        localStorage.setItem('cominfo', JSON.stringify(cominfo))
        return Object.values(cominfo).length
    }

    // 执行保存
    let listnum = mulinfo();
    // 清空
    function reload() {
        localStorage.removeItem('cominfo');
        $("#x-copylist").html(`复制（0）条`);
        listnum = 0
    }
    // 挂载到窗体
    window.reload = reload;


    // 保存进剪切板需异步操作
    async function copylist() {
        try {
            if (listnum>0) {
                let locst = localStorage.getItem('cominfo');
                let infolist = Object.values(JSON.parse(locst));

                await navigator.clipboard.writeText(infolist.join(''));
                console.info(infolist.join('\n'))
                $("#x-copylist").html("已复制");
                $("#x-copylist").css("background-color", "#00FF6677")

                setTimeout(()=>{
                    $("#x-copylist").html(`复制（${infolist.length}）条`);
                    $("#x-copylist").css("background-color", "#0066FF77")
                }, 1000)
                console.log('Infos copied to clipboard');
            } else {
                console.info("没有要复制的数据")
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
    // 挂载到窗体
    window.copylist = copylist;

    var infodom =
`<textarea id="x-copyinfo"
style="position: fixed;
top: 300px;
left: 20px;
width: 200px;
height: 120px;
padding: 10px;
background-color: #CCCCCC77;">${Object.values(info).join('\n')}</textarea>`;

    var btn =
`<div id="x-copy"
style="position: fixed;
top: 420px;
left: 100px;
width:120px;
height: 40px;
text-align: center;
border-radius: 5px;
border: 2px #FFF dotted;
cursor: pointer;
padding: 10px;
background-color: #0066FF77;"
onclick="copyinfo()">复制信息</div>`;

    var mulbtn =
`<div id="x-copylist"
style="position: fixed;
top: 460px;
left: 100px;
width:120px;
height: 40px;
text-align: center;
border-radius: 5px;
border: 2px #FFF dotted;
cursor: pointer;
padding: 10px;
background-color: #0066FF77;"
onclick="copylist()">复制（${listnum}）条</div>`;
    var rebtn =
`<div id="x-reload"
style="position: fixed;
top: 460px;
left: 20px;
width:60px;
text-align: center;
border-radius: 5px;
border: 2px #FFF dotted;
cursor: pointer;
padding: 10px;
background-color: #0066FF77;"
onclick="reload()">清空</div>`;

    $('body').append(infodom);
    $('body').append(btn);
    $('body').append(mulbtn);
    $('body').append(rebtn);

}, 1000);


    // Your code here...
})();