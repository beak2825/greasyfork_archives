// ==UserScript==
// @name         小圣杯薪火计划竞拍统计
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @version      1.3
// @description  统计自己竞拍中薪火计划角色的竞拍数量
// @author       Liaune
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/user\/.*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393718/%E5%B0%8F%E5%9C%A3%E6%9D%AF%E8%96%AA%E7%81%AB%E8%AE%A1%E5%88%92%E7%AB%9E%E6%8B%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/393718/%E5%B0%8F%E5%9C%A3%E6%9D%AF%E8%96%AA%E7%81%AB%E8%AE%A1%E5%88%92%E7%AB%9E%E6%8B%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
GM_addStyle(`
table.gridtable {
font-family: verdana,arial,sans-serif;
font-size:11px;
border-width: 1px;
border-color: #a9c6c9;
border-collapse: collapse;
}
table.gridtable th {
background-color: #9adaf2;
border-width: 1px;
padding: 5px;
border-style: solid;
border-color: #a9c6c9;
}
table.gridtable td {
border-width: 1px;
padding: 0px;
border-style: solid;
border-color: #a9c6c9;
}
`);
let api = 'https://tinygrail.com/api/';
function getData(url) {
	if (!url.startsWith('http')) url = api + url;
	return new Promise((resovle, reject) => {
		$.ajax({
			url: url,
			type: 'GET',
			xhrFields: { withCredentials: true },
			success: res => {resovle(res)},
			error: err => {reject(err)}
		});
	});
}

function postData(url, data) {
	let d = JSON.stringify(data);
	if(!url.startsWith('http')) url = api + url;
	return new Promise((resovle, reject) => {
		$.ajax({
			url: url,
			type: 'POST',
			contentType: 'application/json',
			data: d,
			xhrFields: { withCredentials: true },
			success: res => {resovle(res)},
			error: err => {reject(err)}
		});
	});
}

let me = document.querySelector('#dock li.first a').href;
let nickname = document.querySelector('#dock li.first a').innerText;
if(location.href == me)
	$('h1.nameSingle .inner small.grey').after(`<button id="auctionStatistics" class="text_button" title="薪火计划竞拍统计">[统计竞拍]</button>`);

$('#auctionStatistics').on('click', (e) => {
	$('body').html('');
	$('body').append(`<div id='waiting'>数据统计中...加载后请按'Ctrl+A'全选，'Ctrl+C'复制后粘贴到成员拍卖统计表，并选择'合并格式'</div>`);
	let tb=document.createElement('table');
	tb.className = 'gridtable';
	let href = location.origin + '/group/topic/354437';
	let xhr = new XMLHttpRequest();
	xhr.open( "GET", href );
	xhr.withCredentials = true;
	xhr.responseType = "document";
	xhr.send();
	xhr.onload = function(){
		let doc = xhr.responseXML;
		let content = doc.querySelector('#post_1555907 .inner .topic_content').innerText;
		let charas = JSON.parse(content);
		getData(`chara/user/auction/1/100`).then((d)=>{
			$('#waiting').remove();
			let chara = {};
			for(let i=0;i<d.Value.Items.length; i++){
				let Id = d.Value.Items[i].CharacterId.toString();
				let Name = d.Value.Items[i].Name;
				let State = d.Value.Items[i].State;
				let Price = d.Value.Items[i].Price;
				let Amount = d.Value.Items[i].Amount;
				if(Price && Amount && State==0 && charas.includes(Id)){
					chara[Id] = Amount;
				}
			}
			$(tb).append(`<tr><td><a href="${me}" class="l">${nickname}</a></td></tr>`);
			for(let i = 0;i<charas.length; i++){
				if(chara[charas[i]]){
					$(tb).append(`<tr><td>${chara[charas[i]]}</td></tr>`);
				}
				else{
					$(tb).append(`<tr><td> </td></tr>`);
				}
			}
			$('body').append(tb);
		});
	};
});