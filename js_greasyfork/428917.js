// ==UserScript==
// @name         学习
// @namespace    hhh2000
// @version      0.2
// @description  学习-
// @author       hhh2000
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.tv/video/*
// @include      *://*.bilibili.com/bangumi/*
// @include      *://*.bilibili.tv/bangumi/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428917/%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/428917/%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

function loadJquery() {
	//加载jquery
	var importJs=document.createElement('script');
	importJs.setAttribute("type","text/javascript");
	importJs.setAttribute("src", 'https://code.jquery.com/jquery-1.12.4.min.js');
	document.getElementsByTagName("head")[0].appendChild(importJs);
}


//****初始化ajax****//
function initajax() {
    //保存所有ajax数据
    var ajax = {
        "课程": {
            "得到列表":{},
            "开始":{},
            "时间":{}
        },
    };
    //默认数据模板
    var template = {
        "post": {
            "json": {
                "method": "POST",
                "async": false,
                "timeout": 3000,
                "url": "",
                "headers": {"Content-Type": "application/json"},
                "body": "",
                "ok": '{"javaClass":"ParameterSet","map":{}}'
            }
        },
        "get": {
            "json": {
                "method": "GET",
                "async": false,
                "timeout": 3000,
                "url": "",
                "body": "",
                "ok": '{"javaClass":"ParameterSet","map":{}}'
            }
        }
    };
    
	//全省干部政德教育专题培训班/参学档案 3487301376055194246
	//党史学习专题培训班 3475522942576630214
    //
    ajax['课程']['得到列表'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['课程']['得到列表']['url'] = "/__api/api/study/my/courses";
    ajax['课程']['得到列表']['body'] = {"courseType":null,"tbtpId":"3475522942576630214","idCardHash":"bSA+H9qlZYjDUlc7OcnjN7YBqLw=","pagenum":0,"pagesize":100,"studyStatus":3};
    //
    ajax['课程']['开始'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['课程']['开始']['url'] = "/__api/api/study/start";
    ajax['课程']['开始']['body'] = {"courseId":"","idCardHash":"bSA+H9qlZYjDUlc7OcnjN7YBqLw=","studyType":"VIDEO"};
    //
    ajax['课程']['时间'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['课程']['时间']['url'] = "/__api/api/study/progress";
    ajax['课程']['时间']['body'] = {"courseId":"","idCardHash":"bSA+H9qlZYjDUlc7OcnjN7YBqLw=","studyTimes":98};
    //
    ajax['课程']['结束'] = JSON.parse(JSON.stringify(template['post']['json']));
    ajax['课程']['结束']['url'] = "/__api/api/study/v2/end";
    ajax['课程']['结束']['body'] = {"courseId":"","idCardHash":"bSA+H9qlZYjDUlc7OcnjN7YBqLw="};
	
    return ajax;    
}
 
 
//request
function send(ajax) {
    try {
        var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open(ajax.method, ajax.url, ajax.async);
        if(ajax.async == true) { xhr.timeout = ajax.timeout }
        for(var k in ajax.headers) { xhr.setRequestHeader(k, ajax.headers[k]) }
        var body = (typeof(ajax['body']) == 'object')? JSON.stringify(ajax['body']): ajax['body'];
        xhr.send(body);
        //alert(xhr.getResponseHeader('Content-Type'));
        //alert(xhr.getAllResponseHeaders());
        return xhr.responseText;
    }
    catch(e) {
        throw e;
    }
};
 
function run(first=0, last=5, studyTimes=100) {
	if(typeof studyTimes === 'string' && studyTimes !== 'all') {console.log('studyTimes错误'); return;}
    //填充查询关键字
    var ajax = initajax();
    var queryAjax = JSON.parse(JSON.stringify(ajax['课程']['得到列表']));
    var json = JSON.parse(send(queryAjax));
	console.log(json);
	
	last = last>json.totalelements? json.totalelements: last
	console.log(first+'<i'+'<'+last);
	var datalist = json.datalist;
	for(let i=first; i<=last; i++) {
		if(datalist[i].percentage !== '100%') {
			var currStudyTimes = (typeof studyTimes === 'string' && studyTimes === 'all')? datalist[i].courseDuration*60: studyTimes;
			console.log(datalist[i].name, datalist[i].courseId, datalist[i].courseDuration*60, datalist[i].studyTimes, studyTimes, currStudyTimes);
			
			var queryAjax = JSON.parse(JSON.stringify(ajax['课程']['开始']));
			queryAjax['body']['courseId'] = datalist[i].courseId;
			var json = JSON.parse(send(queryAjax));
			
			var queryAjax = JSON.parse(JSON.stringify(ajax['课程']['时间']));
			queryAjax['body']['courseId'] = datalist[i].courseId;
			queryAjax['body']['studyTimes'] = currStudyTimes;  //秒
			var json = JSON.parse(send(queryAjax));
			
			console.log(currStudyTimes, datalist[i].studyTimes);
			if(currStudyTimes !== datalist[i].courseDuration*60) break;
			
			var queryAjax = JSON.parse(JSON.stringify(ajax['课程']['结束']));
			queryAjax['body']['courseId'] = datalist[i].courseId;
			var json = JSON.parse(send(queryAjax));
			console.log(json);
		}
	}
}

//https://gbwlxy.dtdjzx.gov.cn/content#/myClass?tbtpId=3475522942576630214&title=%E5%85%9A%E5%8F%B2%E5%AD%A6%E4%B9%A0%E4%B8%93%E9%A2%98%E5%9F%B9%E8%AE%AD%E7%8F%AD
//run(0,10,'all')

//--------------------------------------------------------------------------------------


//     //****初始化ajax****//
//     function initajax() {
//         //保存所有ajax数据
//         var ajax = {
//             "食品": {
//                 "得到列表":{},
//                 "得到地址":{},
//                 "时间":{}
//             },
//         };
//         //默认数据模板
//         var template = {
//             "post": {
//                 "json": {
//                     "method": "POST",
//                     "async": false,
//                     "timeout": 3000,
//                     "url": "",
//                     "headers": {"Content-Type": "application/json"},
//                     "body": "",
//                     "ok": '{"javaClass":"ParameterSet","map":{}}'
//                 }
//             },
//             "get": {
//                 "json": {
//                     "method": "GET",
//                     "async": false,
//                     "timeout": 3000,
//                     "url": "",
//                     "body": "",
//                     "ok": '{"javaClass":"ParameterSet","map":{}}'
//                 }
//             }
//         };

//         //1
//         ajax['食品']['得到列表'] = JSON.parse(JSON.stringify(template['post']['json']));
//         ajax['食品']['得到列表']['url'] = "http://172.20.234.92:8080/sdfda/command/ajax/com.inspur.dsp.bizwork.tasklist.todotask.cmd.ToDoTasksQueryCmd/getProcToDoTasks";
//         ajax['食品']['得到列表']['body'] = {"params":{"javaClass":"org.loushang.next.data.ParameterSet","map":{"light1":"0","light2":"1","light3":"2","defaultSort":{"javaClass":"ArrayList","list":
//                                 [{"javaClass":"HashMap","map":{"field":"SUBMIT_TIME","dir":"ASC"},"length":2}]},"needTotal":true},"length":7},"context":{"javaClass":"HashMap","map":{},"length":0}};
//         //ajax['食品']['得到列表']['async'] = true;

//         //2
//         //ACT_DEF_UNIQUE_ID: "ff80808151417e0f015146c25ed92d95"
//         //FORM_ID: "DSP_SDYJ_SPJY_HF"
//         //sDATA_ID: "ff8080817d3bbbe4017d3bf444fb0010"
//         ajax['食品']['得到地址'] = JSON.parse(JSON.stringify(template['get']['json']));
//         ajax['食品']['得到地址']['url'] = "http://172.20.234.92:8080/sdfda/command/dispatcher/org.loushang.cform.tasklist.cmd.RenderDispatcherCmd/renderForm? \
//                                            actDefUniqueId=&formId=&formDataId=";
//                                            //http://172.20.234.92:8080/sdfda/command/dispatcher/org.loushang.cform.tasklist.cmd.RenderDispatcherCmd/renderForm?
//                                            //actDefUniqueId=ff80808151417da8015146f8cef82562&formId=DSP_SDYJ_SPJY_BG&formDataId=ff8080817dbb671e017dbbc630562813
//         //ajax['食品']['得到地址']['async'] = true;
//         return ajax;
//     }

//     //request
//     function send(ajax) {
//         try {
//             var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
//             xhr.open(ajax.method, ajax.url, ajax.async);
//             if(ajax.async == true) { xhr.timeout = ajax.timeout }
//             for(var k in ajax.headers) { xhr.setRequestHeader(k, ajax.headers[k]) }
//             var body = (typeof(ajax['body']) == 'object')? JSON.stringify(ajax['body']): ajax['body'];
//             xhr.send(body);
//             //alert(xhr.getResponseHeader('Content-Type'));
//             //alert(xhr.getAllResponseHeaders());
//             return xhr.responseText;
//         }
//         catch(e) {
//             throw e;
//         }
//     };

//     function run(){
//         //填充查询关键字
//         var ajax = initajax();
//         var queryAjax = JSON.parse(JSON.stringify(ajax['食品']['得到列表']));
//         //console.log(send(queryAjax));
//         var json = JSON.parse(send(queryAjax));
//         //console.log(json);
//         //ACT_DEF_UNIQUE_ID: "ff80808151417e0f015146c25ed92d95"
//         //FORM_ID: "DSP_SDYJ_SPJY_HF"
//         //DATA_ID: "ff8080817d3bbbe4017d3bf444fb0010"
//         // console.log(json.rows[i]['ACT_DEF_UNIQUE_ID']);
//         // console.log(json.rows[i]['FORM_ID']);
//         // console.log(json.rows[i]['DATA_ID']);
//         console.log(json.rows.length);
//         for(var i=0; i<1; i++){
//             console.log(json.rows[i]['ACT_DEF_UNIQUE_ID']);
//             console.log(json.rows[i]['FORM_ID']);
//             console.log(json.rows[i]['DATA_ID']);
//             let uniqueID = json.rows[i]['ACT_DEF_UNIQUE_ID'];
//             let fromID = json.rows[i]['FORM_ID'];
//             let dataID = json.rows[i]['DATA_ID'];
//             // $.get('http://172.20.234.92:8080/sdfda/command/dispatcher/org.loushang.cform.tasklist.cmd.RenderDispatcherCmd/renderForm', {actDefUniqueId:uniqueID,formId:fromID,formDataId:dataID}, function(data){
//             //     //console.log(data);
//             //     var ret = JSON.parse(data);
//             //     var DSP_SDYJ_SPJY_HF = JSON.parse(JSON.parse(ret['formData'])[fromID]);
//             //     console.log('['+i+']'+DSP_SDYJ_SPJY_HF['DSP_APPLY_PARTY_NAME'] +' | '+ DSP_SDYJ_SPJY_HF['JingYingChangSuo']);
//             // });
//             //actDefUniqueId=ff80808151417e0f015146c25ed92d95&formId=DSP_SDYJ_SPJY_HF&formDataId=ff8080817d3bbbe4017d3bf444fb0010";
//             queryAjax = JSON.parse(JSON.stringify(ajax['食品']['得到地址']));
//             queryAjax['url'] = queryAjax['url'].replace(/actDefUniqueId=/, 'actDefUniqueId='+uniqueID);
//             queryAjax['url'] = queryAjax['url'].replace(/formId=/, 'formId='+fromID);
//             queryAjax['url'] = queryAjax['url'].replace(/formDataId=/, 'formDataId='+dataID);
//             var ret = JSON.parse(send(queryAjax));
//             var DSP_SDYJ_SPJY_HF = JSON.parse(JSON.parse(ret['formData'])[fromID]);
//             count += 1;
//             let vstr = `[${count}]${DSP_SDYJ_SPJY_HF['DSP_APPLY_PARTY_NAME']} | ${DSP_SDYJ_SPJY_HF['JingYingChangSuo']}`;
//             addr.push(vstr)
//             //console.log(JSON.parse(DSP_SDYJ_SPJY_HF)['JingYingChangSuo']);
//             //console.log('['+i+']'+JSON.parse(JSON.parse(ret['formData'])['DSP_SDYJ_SPJY_HF'])['JingYingChangSuo']);
//         }


//     }