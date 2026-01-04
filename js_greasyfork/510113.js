// ==UserScript==
// @name         Train Hack
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Hack the train ticket site
// @author       KinyinTsuk
// @match        https://kyfw.12306.cn/*
// @connect      ibfu.org
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/510113/Train%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/510113/Train%20Hack.meta.js
// ==/UserScript==

/*
1.0.5
- Added Toast notice more infomations.
1.0.4
- Added Price data (original data and guide).
- Added Toast notice more infomations.
- Switched Interface to online.
- Optimized Toast styles.
- Fixed A bug that toast disappear time wrong.
1.0.3
- Optimized Logs.
1.0.2
- Added Departure time and Arrive time seconds.
1.0.1
- Added Result toast feature.
- Added Inject custom style feature.
- Improved Station key to name feature.
1.0
- Finished Required features.
*/

const interface=`https://nfp.ibfu.org/train/app/server/interface.php`;
const i_query=`${interface}?i=query`;
const i_station=`${interface}?i=station`;
const seatTypeName=[`特等座`,`一等座`,`二等座`,`高级软卧`,`软卧`,`动卧`,`一等卧`,`硬卧`,`二等卧`,`软座`,`硬座`,`无座`,`其他`];
const seatTypeKey= [      32,      31,      30,        21,    23,    23,      23,    28,      28,    24,    29,    26,    20];
const seatTypePrice=[];
const parseIndex={
    train_code     : 3,
    train_begin    : 4,
    train_end      : 5,
    train_from     : 6,
    train_to       : 7,
    departure_time : 8,
    arrive_time    : 9,
    used_time      : 10,
    seat_range     : [20,33],
    price_data     : 39,
    price_guide    : 53,
};

const style=[
    `.toast{
        position:fixed;
        left:30%;
        right:30%;
        bottom:10%;
        background: #eef1f8;
        box-shadow:0px 0px 5px #000;
        border: 1px solid #298cce;
        padding:16px;
        align:center;
        z-index:10000;
    }`,
	`.toast.success{
		background: #AAFFAA;
	}`,
	`.toast.error{
		background: #FFCCCC;
	}`,
];

Date.prototype.format = function(fmt) {
	var o = {
	   "M+" : this.getMonth()+1,                 //月份
	   "d+" : this.getDate(),                    //日
	   "h+" : this.getHours(),                   //小时
	   "m+" : this.getMinutes(),                 //分
	   "s+" : this.getSeconds(),                 //秒
	   "q+" : Math.floor((this.getMonth()+3)/3), //季度
	   "S"  : this.getMilliseconds(),            //毫秒
	   "w"	: this.getDay(),                     //星期
	};
	var w = [`日`,`一`,`二`,`三`,`四`,`五`,`六`];
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			switch(k){
				case `w`:
					fmt = fmt.replace(RegExp.$1, w[o[k]]);
				break;
				default:
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
				break;
			}
		}
	}
	return fmt;
}

function stampToTime(timeStampDiff){
	//timeStampDiff为10位时间戳
	if(timeStampDiff<0){
		timeStampDiff=0;
	}
	let diffDays   =Math.floor(timeStampDiff/(24*3600*1000));
	let diffHours  =Math.floor(timeStampDiff%(24*3600*1000)/(3600*1000));
	let diffMinutes=Math.floor(timeStampDiff%(24*3600*1000)%(3600*1000)/(60*1000));
	let diffSeconds=Math.round(timeStampDiff%(24*3600*1000)%(3600*1000)%(60*1000)/1000);

	if(diffSeconds==60){
		diffSeconds=0;
	}

	return {day:diffDays, hour:diffHours, minute:diffMinutes, second:diffSeconds};
}

function timeToSecond(time) {
    let parts = time.split(`:`);
    let hours = parseInt(parts[0]) || 0;
    let minutes = parseInt(parts[1]) || 0;
    let seconds = parseInt(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

function formatBytes(bytes) {
	if (bytes === 0) return `0 B`;
	const units = [`B`, `KB`, `MB`, `GB`, `TB`];
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const size = bytes / Math.pow(k, i);
	return size.toFixed(2) + ' ' + units[i];
}

function seatKey(seatName){
    return seatTypeKey[seatTypeName.indexOf(seatName)];
}
function seatName(seatKey){
    return seatTypeName[seatTypeKey.indexOf(seatKey)];
}
function stationName(skey,map){
    if(typeof map==`object`){
        return map[skey];
    }else{
        return stationNamesMap.get(skey).name;
    }
}

let stationNamesMap=new Map();
function parseStationNames(){
    let snp=station_names.split(`@`); // station_names为网站数据，直接访问
    for(let s of snp){
        if(!s) continue;
        let sp=s.split(`|`); // bjb|北京北|VAP|beijingbei|bjb|0|0357|北京|||
        let sobj={
            id:sp[0],
            name:sp[1],
            key:sp[2],
            ename:sp[3],
            num:sp[6],
            city:sp[7],
            origin:s,
        };
        stationNamesMap.set(sp[2],sobj);
    }
}

let toastTimeout;
function toast(msg,type=`normal`,time=5000){
    $(`.toast`).remove();
    $(`body`).append(`<div class="toast ${type}">${msg}</div>`);
    clearTimeout(toastTimeout);
    toastTimeout=setTimeout(()=>{
        $(`.toast`).remove();
    },time);
}

function ajaxPromise(url, type=`GET`, post){
    const formData = new FormData();
    for(let key in post){
        formData.append(key, JSON.stringify(post[key]));
    }
    return new Promise((resolve, reject)=>{
        GM_xmlhttpRequest({
            method: type,
            url: url,
            data: formData,
            onload:function(e){
                resolve(e.responseText);
            },
            onerror:function(e){
                reject(e);
            }
        });
    });
}

function getQuery(url,k){
    let query=url.split(`?`);
    let querySplit=query.split(`&`);
    let queryObj={};
    for(let q of querySplit){
        let qSp=q.split(`=`);
        let key=qSp[0];
        let val=decodeURIComponent(qSp[1]);
        queryObj[key]=val;
    }
    if(!k){
        return queryObj;
    }else{
        return queryObj[k];
    }
}

function hookXHR(){
    let originalXHR = window.XMLHttpRequest;
    // 新的XMLHttpRequest构造函数
    window.XMLHttpRequest = function() {
        let actualXHR = new originalXHR();
        actualXHR.onload = function() {
            if (actualXHR.readyState === 4) { // 由于onreadystatechange会被覆盖，因此使用onload绕开。
                activeXHR(actualXHR);
            }
        }
        return actualXHR;
    };
}

function activeXHR(response){
    let url=response.responseURL;
    let text=response.responseText;
    let json=JSON.parse(text);
    let type=``;
    switch(true){
        case url.includes(`otn/leftTicket`):
            type=`LEFT_TICKET`;
        break;
        case url.includes(`otn/czxx`):
            type=`STATION_INFO`;
        break;
        default:
        break;
    }
    if(type){
        sendWindowMessage(type,url,json);
    }
}

function sendWindowMessage(type, url, data){
    window.postMessage({type:'FROM_PAGE', data:{type:type, url:url, data:data}}, `*`);
}

function injectScript(){
    let scriptFunctionList=[
        hookXHR.toString().match(/{([\s\S]*)}/)[1].trim(),
        activeXHR.toString(),
        sendWindowMessage.toString(),
        getQuery.toString(),
    ];
    $(`head`).append(`<script id="injectScript">${scriptFunctionList.join(`\n`)}</script>`);
    console.log(`Script Injected.`);
}

function customStyle(){
    $(`head`).append(`<style id="customStyle">${style.join(`\n`)}</style>`);
}

function receiveWindowMessage(){
    window.addEventListener(`message`, function(event) {
        if (event.data && event.data.type === `FROM_PAGE`) {
            switch(event.data.data.type){
                case `LEFT_TICKET`:
                    parseLeftTicket(event.data.data.url, event.data.data.data);
                break;
                case `STATION_INFO`:
                    parseStationInfo(event.data.data.url, event.data.data.data);
                break;
            }
            //console.log('Tampermonkey received message:', event.data);
            //let rs=await ajaxPromise(interface, `POST`, {data:JSON.stringify(event.data)});
            //console.log(rs);
        }
    });
    console.log(`Receiving Window Message.`);
}

async function parseLeftTicket(url, data){
    console.log(`parseLeftTicket`,data);
    let map=data.data.map;
    let result=data.data.result;
    let ticketList=[];
    for(let r of result){
        let rsp=r.split(`|`);
        let ticketObj={
            train_code            : rsp[parseIndex.train_code], // 车次
            train_from            : stationName(rsp[parseIndex.train_from]), // 出发（站名）
            train_to              : stationName(rsp[parseIndex.train_to]), // 到达（站名）
            train_begin           : stationName(rsp[parseIndex.train_begin]), // 始发（ID，不支持查询站名）
            train_end             : stationName(rsp[parseIndex.train_end]), // 终到（ID，不支持查询站名）
            departure_time        : rsp[parseIndex.departure_time], // 出发时间
            arrive_time           : rsp[parseIndex.arrive_time], // 到达时间
            used_time             : rsp[parseIndex.used_time], // 用时
            departure_time_second : timeToSecond(rsp[parseIndex.departure_time]), // 出发时间
            arrive_time_second    : timeToSecond(rsp[parseIndex.arrive_time]), // 到达时间
            used_time_second      : timeToSecond(rsp[parseIndex.used_time]), // 用时（转换为秒）
            seat_list             : {}, // 席别
            price_data            : {data:rsp[parseIndex.price_data], guide: rsp[parseIndex.price_guide]},
        };
        for(let i=parseIndex.seat_range[0]; i<=parseIndex.seat_range[1]; i++){ // 根据车票情况筛选席别
            let curSeat=rsp[i];
            if(curSeat!=``){ // 席别不为空字符串，则表示有该席别，添加进列表
                //ticketObj.seat_list.push(seatName(i));
                ticketObj.seat_list[seatName(i)]=curSeat;
            }
        }
        ticketList.push(ticketObj);
    }
    console.log(ticketList);
	toast(`Sending Left Ticket Data [${ticketList.length}, ${formatBytes(JSON.stringify(ticketList).length)}]...`,`normal`,10000);
    ajaxPromise(i_query,`POST`,{data:ticketList}).then(rs=>{toast(rs,`success`)}).catch(rs=>{toast(rs,`error`)});
}

function parseStationInfo(url, data){
    console.log(`parseStationInfo`,data);
    let stationList=data.data.data;
	toast(`Sending Station Info Data [${stationList.length}, ${formatBytes(JSON.stringify(stationList).length)}]...`,`normal`,10000);
    ajaxPromise(i_station,`POST`,{data:stationList}).then(rs=>{toast(rs,`success`)}).catch(rs=>{toast(rs,`error`)});
}

(function() {
    'use strict';
    injectScript();
    customStyle();
    receiveWindowMessage();
    parseStationNames();
})();