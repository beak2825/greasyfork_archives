// ==UserScript==
// @name         企查查、爱企查、天眼查专利列表下载
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  下载企查查、爱企查、天眼查的专利列表，页面显示专利信息即可下载。
// @author       angeljhon
// @match        *://www.qcc.com/*/*
// @match        *://www.tianyancha.com/*/*
// @match        *://aiqicha.baidu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      www.qcc.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467858/%E4%BC%81%E6%9F%A5%E6%9F%A5%E3%80%81%E7%88%B1%E4%BC%81%E6%9F%A5%E3%80%81%E5%A4%A9%E7%9C%BC%E6%9F%A5%E4%B8%93%E5%88%A9%E5%88%97%E8%A1%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/467858/%E4%BC%81%E6%9F%A5%E6%9F%A5%E3%80%81%E7%88%B1%E4%BC%81%E6%9F%A5%E3%80%81%E5%A4%A9%E7%9C%BC%E6%9F%A5%E4%B8%93%E5%88%A9%E5%88%97%E8%A1%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

if(GM_getValue('down_zy',null) == null){
    GM_setValue('down_zy',0);
}
if(GM_getValue('get_de',null) == null){
    GM_setValue('get_de',200);
}

const menu_command_id0 = GM_registerMenuCommand('设置间隔,只有获取摘要时影响',function(){
    var input_f=document.createElement('div');
    input_f.style.position = 'fixed';
    input_f.style.top = '50px';
    input_f.style.right='50px';
    input_f.style.width='150px';
    input_f.style.height='100px';
    input_f.style.background = 'blue';
    input_f.style.color = 'black';
    input_f.style.zIndex = '9999';
    input_f.innerHTML = `<p>输入数据，单位毫秒</p><table style="width:100%;height:20px"><tr><td style="width:10%"></td><td style="width:80%"><input type="text" id="input_v" style="width:80%;height:20px;color:black" value="${GM_getValue('get_de',200)}" /></td><td></td></tr></table>`;

    var btn=document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.left='55px';
    btn.style.top='60px';
    btn.style.width = '40px';
    btn.style.height= '30px';
    btn.style.background= 'black';
    input_f.style.color = 'white';
    btn.innerHTML = '确定';
    btn.onclick = function(){
        var input_v = document.getElementById('input_v').value;
        GM_setValue('get_de',input_v);
        input_f.remove();
    }
    input_f.appendChild(btn)
    document.body.appendChild(input_f)
},'t');

function t_b(){
    if(GM_getValue('down_zy') == 1){
        return '是';
    }else{
        return '否';
    }
}

function change_menu(){
    var menu_command_id = GM_registerMenuCommand(`点击改变下载摘要状态【${t_b()}】`, function() {
        if(GM_getValue('down_zy') == 1){
            GM_setValue('down_zy',0);
        }else{
            GM_setValue('down_zy',1);
        }
        GM_unregisterMenuCommand(menu_command_id);
        change_menu();
    }, "a");
}
change_menu();

function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}

//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return Math.ceil(parseInt(Math.random()*minNum+1,10));
        break;
        case 2:
            return Math.ceil(parseInt(Math.random()*(maxNum-minNum+1)+minNum,10));
        break;
            default:
                return 0;
            break;
    }
}

async function fetchPageWithFetch(url,ind) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return {'html':await response.text(),'i':ind};
    } catch (error) {
        throw error; // 抛出错误以供外部处理
    }
}

(function() {
	'use strict';

	// Create a new button element
	const button = document.createElement('button');
	button.innerText = '下载';

	// Change the button style
	button.style.backgroundColor = 'black';
	button.style.color = 'white';
	button.style.position = 'fixed';
	button.style.bottom = '20px';
	button.style.right = '5px';
	button.style.zIndex = '9999';
    button.style.width ='60px';
    button.style.height = '30px';

	// Add the button to the page
	document.body.appendChild(button);
    var dl_name="专利列表.xls";
    var c_name="";
	// Add a click event listener to the button
	button.addEventListener('click', () => {
		var exportFileContent="";
        if(document.URL.search('qcc.com')!=-1){
            var e_s=document.querySelector("#zhuanlilist");
            var hh = e_s.querySelectorAll("span.tbadge")[1].textContent;
            //var e_li = e_lu.querySelectorAll("li.active");
            var e_lu =e_s.querySelector("ul.pagination");
            var e_li = e_lu.querySelectorAll("li");

            if(e_lu.querySelector("li.active").querySelector("a").textContent.replaceAll(' ','').replaceAll('\n','')!="1"){
                for(var i=0;i<e_li.length;i++){
                    var a_t=e_li[i].querySelector("a");
                    console.log(a_t.textContent);
                    if(a_t.textContent.replaceAll(' ','').replaceAll('\n','')=="1"||a_t.textContent.replaceAll(' ','').replaceAll('\n','')=="1..."){
                        a_t.click();
                    }
                }
            }
            e_s=document.querySelector("#zhuanlilist");
            // exportFileContent = exportFileContent + e_s.querySelector("table.ntable").outerHTML;
            var te_l=e_s.querySelector("table.ntable").querySelectorAll("tr");
            if(GM_getValue('down_zy') == 1){
            exportFileContent = exportFileContent + te_l[0].outerHTML.replace('</th></tr>','</th><th>摘要</th></tr>');
            }else{
                exportFileContent = exportFileContent + te_l[0].outerHTML;
            }
            for(i=1;i<te_l.length;i++){
                if(GM_getValue('down_zy') == 1){
                    var detail_url=te_l[i].querySelector('a[href]').href;
                    fetchPageWithFetch(detail_url,i)
                        .then(data => {
                        // console.log(te_l[data.i]); // 打印获取到的网页内容
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(data.html, "text/html");
                        var doc_titles = doc.querySelectorAll('div.sub-title');
                        for(var j=0;j<doc_titles.length;j++){
                            if(doc_titles[j].innerText=="摘要"){
                                var zy=doc_titles[j].nextElementSibling.innerHTML;
                                exportFileContent = exportFileContent + te_l[data.i].outerHTML.replace('</td></tr>',`</td><td>${zy}</td></tr>`);
                            }else if(j==doc_titles.length-1){
                                exportFileContent = exportFileContent + te_l[data.i].outerHTML.replace('</td></tr>',`</td><td> </td></tr>`);
                            }
                        }
                    })
                        .catch(error => {
                        console.error(error); // 打印错误信息
                    });
                    sleep(GM_getValue('get_de',200));
                }else{
                    exportFileContent = exportFileContent + te_l[i].outerHTML;
                }
            }
        }else if(document.URL.search('tianyancha')!=-1){
            var targetText="专利名称";
            var ts_e= document.getElementsByClassName('table-wrap');
            ww1:{
                for(var i3=0;i3<ts_e.length;i3++){
                    var zhuangli_es=ts_e[i3].getElementsByTagName('th');
                    for(var ii=0;ii<zhuangli_es.length;ii++){
                        var tarelement = zhuangli_es[ii];
                        if (tarelement.textContent == targetText){
                            //exportFileContent=ts_e[i3].outerHTML;
                            var target_e=ts_e[i3];
                            break ww1;
                        }
                    }
                }
            }
            if(target_e.parentElement.querySelector("div.active").textContent!="1"){
                var num_es=target_e.parentElement.querySelector("div.pageWrap").querySelectorAll("div.num");
                for(var i2=0;i2<num_es.length;i2++){
                    if(num_es[i2].textContent==="1"||num_es[i].textContent==="1..."){
                        num_es[i2].click();
                    }
                }
            }
            exportFileContent=target_e.outerHTML;
        }else if(document.URL.search('aiqicha.baidu')!=-1){
            document.querySelector("#certRecord-patent").querySelector("li.ivu-page-item[title='1']").click();
            exportFileContent = document.querySelector(".certRecord-patent-table").outerHTML;
        }

        var che0="1";
        var cou=0;
		var intervalId = setInterval(function() {
			if(cou!=0 && cou%20==0){//这里是翻n（20）页后暂停一会
				var st=randomNum(1000,5000);//这里是翻页后暂停的时间，随机重（t1,t2）单位ms
                console.log("暂停"+String(st)+"ms");
                sleep(st);
			}
            if(document.URL.search('qcc.com')!=-1){
                var e_s=document.querySelector("#zhuanlilist");
                var e_lu =e_s.querySelector("ul.pagination");
                var che1=e_lu.querySelector("li.active").querySelector("a").textContent.replaceAll(' ','').replaceAll('\n','');
                if(che1!=che0){
                    // exportFileContent = exportFileContent + e_s.querySelector("table.ntable").outerHTML;
                    var te_l=e_s.querySelector("table.ntable").querySelectorAll("tr");
                    for(var i=1;i<te_l.length;i++){
                        if(GM_getValue('down_zy') == 1){
                            var detail_url=te_l[i].querySelector('a[href]').href;
                            fetchPageWithFetch(detail_url,i)
                                .then(data => {
                                // console.log(te_l[data.i]); // 打印获取到的网页内容
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(data.html, "text/html");
                                var doc_titles = doc.querySelectorAll('div.sub-title');
                                for(var j=0;j<doc_titles.length;j++){
                                    if(doc_titles[j].innerText=="摘要"){
                                        var zy=doc_titles[j].nextElementSibling.innerHTML;
                                        exportFileContent = exportFileContent + te_l[data.i].outerHTML.replace('</td></tr>',`</td><td>${zy}</td></tr>`);
                                    }else if(j==doc_titles.length-1){
                                        exportFileContent = exportFileContent + te_l[data.i].outerHTML.replace('</td></tr>',`</td><td> </td></tr>`);
                                    }
                                }
                            })
                                .catch(error => {
                                console.error(error); // 打印错误信息
                            });
                            sleep(GM_getValue('get_de',200));
                        }else{
                            exportFileContent = exportFileContent + te_l[i].outerHTML;
                        }
                    }
                    che0=che1;
                }
                e_lu =e_s.querySelector("ul.pagination");
                var e_li = e_lu.querySelectorAll("li");
                var flag=0;
                for(i=0;i<e_li.length;i++){
                    var a_t=e_li[i].querySelector("a");
                    if(a_t.textContent.replaceAll(' ','').replaceAll('\n','')==">"){
                        a_t.click();
                        console.log(cou);
                        cou++;
                        flag=1;
                    }
                }
            }else if(document.URL.search('tianyancha')!=-1){
                var targetText="专利名称";
                var ts_e= document.getElementsByClassName('table-wrap');
                ww1:{
                    for(var i1=0;i1<ts_e.length;i1++){
                        var zhuangli_es=ts_e[i1].getElementsByTagName('th');
                        for(var ii=0;ii<zhuangli_es.length;ii++){
                            var tarelement = zhuangli_es[ii];
                            if (tarelement.textContent == targetText){
                                //exportFileContent=ts_e[i].outerHTML;
                                var target_e=ts_e[i1];
                                break ww1;
                            }
                        }
                    }
                }
                if(target_e.parentElement.querySelector("div.active").textContent!=che0){
                    exportFileContent=exportFileContent+target_e.outerHTML;
                    che0=target_e.parentElement.querySelector("div.active").textContent;
                }
                flag=0;
                var num_es=target_e.parentElement.querySelector("div.pageWrap").querySelectorAll("div.num");
                if(num_es[num_es.length-1].childElementCount!=0){
                    num_es[num_es.length-1].click();
                    console.log(cou);
                    cou++;
                    flag=1;
                }
            }else if(document.URL.search('aiqicha.baidu')!=-1){
				var at_e=document.querySelector("#certRecord-patent").querySelector("li.ivu-page-item.ivu-page-item-active").textContent;
				if(at_e!=che0){
					exportFileContent = exportFileContent+document.querySelector(".certRecord-patent-table").outerHTML;
					che0=at_e;
				}
				flag=0;
				var nextp=document.querySelector("#certRecord-patent").querySelector("li.ivu-page-next[title='下一页']");
				if(nextp && !document.querySelector("#certRecord-patent").querySelector("li.ivu-page-next.ivu-page-disabled[title='下一页']")){
					nextp.click();
					console.log(cou);
                    cou++;
                    flag=1;
				}
			}
			if(flag==0){
				clearInterval(intervalId);
                if(document.URL.search('qcc.com')!=-1){
                    c_name =document.querySelector("h1.copy-value").textContent;
                    dl_name=c_name+"_企查查_专利列表.xls";
                    // exportFileContent=exportFileContent.replaceAll('</table><table class="ntable"><!----> <tr><!----> <th class="tx">序号</th> <th width="13%" class="">发明名称<!----> <!----></th><th width="8%" class="">专利类型<!----> <!----></th><th class="">法律状态<!----> <!----></th><th width="13%" class="">申请号<!----> <!----></th><th width="10%" class="sort-th"><span class="tsort">申请日期<!----> <span class="tsort-icon"></span></span> <!----></th><th class="">公开(公告)号<!----> <!----></th><th width="11.8%" class="sort-th"><span class="tsort">公开(公告)日期<!----> <span class="tsort-icon"></span></span> <!----></th><th width="auto" class="">发明人<!----> <!----></th><th width="5%" class="">内容<!----> <!----></th></tr> <tr><!----> ','');
                    exportFileContent='<table class="ntable"><!----> '+exportFileContent+'</table>';
                }else if(document.URL.search('aiqicha.baidu')!=-1){
					c_name =document.querySelector(".name").textContent;
					dl_name=c_name+"_爱企查_专利列表.xls";
					exportFileContent=exportFileContent.replaceAll('</table><table class="aqc-detail-table certRecord-patent-table"><thead class="aqc-detail-thead"><tr class="table-header"><td class="table-header-title" style="width: 50px;"><span class="sort-header"><span>序号</span><!----><!----></span></td><td class="table-header-title" style="width: 389px;"><span class="sort-header"><span>专利名称</span><!----><!----></span></td><td class="table-header-title" style="width: 140px;"><span class="sort-header"><span>公布/公告号</span><!----><!----></span></td><td class="table-header-title" style="width: 100px;"><span class="sort-header"><span>专利类型</span><!----><!----></span></td><td class="table-header-title" style="width: 100px;"><span class="sort-header"><span>公布/公告日期</span><!----><!----></span></td><td class="table-header-title" style="width: 60px;"><span class="sort-header"><span>操作</span><!----><!----></span></td></tr></thead>','');
				}else if(document.URL.search('tianyancha')!=-1){
					c_name =document.querySelector(".index_company-name__LqKlo").textContent;
					dl_name=c_name+"_天眼查_专利列表.xls";
					exportFileContent=exportFileContent.replaceAll('</table><table class="table-wrap"><colgroup><col width="56"><col width="120"><col width=""><col width="100"><col width="100"><col width="160"><col width="160"><col width="136"><col width="120"><col width="56"></colgroup><thead class="table-thead"><tr><th class="">序号</th><th class="show-sort">申请日<span class="sort-icon sort-icon-default"></span></th><th class="">专利名称</th><th class="">专利类型</th><th class="">专利状态</th><th class="">申请号</th><th class="">公开（公布）号</th><th class="show-sort">公开（公告）日<span class="sort-icon sort-icon-default"></span></th><th class="">发明人</th><th class="">操作</th></tr></thead>','');
				}
				if(exportFileContent != undefined){
					//使用Blob
					var blob = new Blob([exportFileContent], {type: "text/plain;charset=utf-8"});//解决中文乱码问题
					blob = new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
					//设置链接
					var link = window.URL.createObjectURL(blob);
					var a = document.createElement("a");
					//a.download = "专利列表.xls";
					a.download = dl_name;
					a.href = link;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				}else{
					alert("下载失败!");
				}
			}
		}, randomNum(800,2000));//这里是翻页的间隔速度，会随机从800-2000，单位ms
    });
})();