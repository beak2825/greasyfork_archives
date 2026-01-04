// ==UserScript==
// @name         Tocas-UI CK_Announcement
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Prettify CK Announcement
// @author       oToToT
// @match        https://web.ck.tp.edu.tw/ann/*
// @match        http://web.ck.tp.edu.tw/ann/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tocas-ui/2.3.3/tocas.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/datepicker.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/i18n/datepicker.zh.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372285/Tocas-UI%20CK_Announcement.user.js
// @updateURL https://update.greasyfork.org/scripts/372285/Tocas-UI%20CK_Announcement.meta.js
// ==/UserScript==

/* initialize */
if(location.protocol === 'http:'){
    location.protocol = 'https:'
}else{
    const AddStylesheet = async function(href){
        let script = document.createElement('link');
        script.setAttribute('href', href);
        script.setAttribute('rel','stylesheet');
        script.setAttribute('type', 'text/css');
        await document.head.appendChild(script);
    };
    const identify = new URL(location.href);
    const page_type = identify.pathname
    console.log("Using: "+page_type);
    if(page_type === "/ann/" || page_type==="/ann/index.php"){
        (async()=>{
            /* add scripts */
            await AddStylesheet("https://cdnjs.cloudflare.com/ajax/libs/tocas-ui/2.3.3/tocas.css");
            await AddStylesheet("https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/css/datepicker.min.css");
            GM_addStyle(`body{
background-color: rgb(243, 227, 203)
}
.ts.surrounded{
padding: 1.8em !important;
}`);
            /* my script */
            let anns = [];
            $("table:eq(1) tr:not(:eq(0))").each(function(){
                let obj = {};
                obj.level = $(this).find("td:eq(0)").text().trim();
                obj.title = $(this).find("td:eq(1)").text().trim();
                obj.origin = $(this).find("td:eq(2)").text().trim();
                obj.date = $(this).find("td:eq(3)").text().trim();
                obj.popularity = $(this).find("td:eq(4)").text().trim();
                obj.href = $(this).find('a').attr("href");
                anns.push(obj);
            });
            let htmlData = `<div class="ts fluid top link huge menu">
<div class="ts narrow container"><a class="item" href="/">台北市立建國高級中學公告系統</a><span class="item right"><a href="/ann/index.php">
        <button class="ts mini very compact basic button">列出全部</button></a></span></div>
</div>
<div class="ts narrow container surrounded">
<table class="ts attatched selectable striped celled table">
<thead>
<tr>
<th>標題</th>
<th>單位</th>
<th>日期</th>
<th>人氣</th>
</tr>
</thead>
<tbody>
${anns.map((ele)=>{
    let ret_str = "";
    if(ele.level === '普通'){
        ret_str += `<tr class="info indicated">
<!-- 普通-->`;
    }else if(ele.level === '重要'){
        ret_str += `<tr class="primary indicated">
<!-- 重要-->`;
    }else if(ele.level === '急件'){
        ret_str += `<tr class="negative indicated">
<!-- 急件-->`;
    }else{ return `<tr><td>Parsing Failed</td><td>Parsing Failed</td><td>Parsing Failed</td><td>Parsing Failed</td></tr>`;}
    ret_str += `
<td><a href="${ele.href}">${ele.title}</a></td>
<td>${ele.origin}</td>
<td>${ele.date}</td>
<td>${ele.popularity}</td>
</tr>`
    return ret_str;
}).join('')}
</tbody>
</table>
<div class="ts horizontal list">
<a class="item${(typeof $("a:contains('上一頁')").attr('href') === 'undefined')?" disabled":""}" href="${$("a:contains('上一頁')").attr('href')}">上一頁</a>
<a class="item${(typeof $("a:contains('下一頁')").attr('href') === 'undefined')?" disabled":""}" href="${$("a:contains('下一頁')").attr('href')}">下一頁</a>
<span class="item">
<select class="ts dropdown basic" onchange="location=this.value;">
${$('select:eq(-1)').html()}
</select>
${$('select:eq(-1)').next().text()}
</span>
</div>
</div>
</div>
<div class="ts surrounded">
<div class="ts narrow container">
<div class="ts slate">
<form class="ts form" action="/ann/index.php" method="POST">
<fieldset>
<legend>搜尋參數</legend>
<div class="inline field">
<label for="mysearch">搜尋</label>
<input id="mysearch" type="text" name="mysearch" />
</div>
<div class="field">
<div class="ts toggle checkbox">
<input id="stxt" type="checkbox" name="stxt" />
<label for="stxt">含內容</label>
</div>
</div>
<div class="inline fields">
<div class="eight wide field">
<label>幾天以內</label>
<input type="number" name="myday" />
</div>
<div class="eight wide field">
<label>何時之前</label>
<input class="datepicker-here" id="mydate" type="text" data-language="zh" data-min-view="months" data-view="months" data-date-format="yyyy, MM" />
<input type="hidden" name="myyear" id="myyear">
<input type="hidden" name="mymonth" id="mymonth">
</div>
</div>
</fieldset>
<div class="ts two fields">
<div class="field">
<label>類別</label>
<select name="myclass">
${$("select[name='myclass']:eq(0)").html()}
</select>
</div>
<div class="field">
<label>群組</label>
<select onchange="location.href=this.options[this.selectedIndex].value">
${$("select[name='mypartid']:eq(1)").html()}
</select>
</div>
</div>
<button class="ts positive button">查詢</button>
</form>
</div>
</div>
</div>`;
            // clear data
            $("body").attr("background","");
            $("center").remove();
            $("br").remove();
            $("style[id^='stylus']").remove();
            // append html
            document.body.innerHTML += htmlData;
            $("#mydate").datepicker({
                "onSelect": function(str, d, inst) {
                    $("#myyear").val(d.getFullYear());
                    $("#mymonth").val(d.getMonth());
                }
            });
        })();
    }else if(page_type === "show"){
    }
}