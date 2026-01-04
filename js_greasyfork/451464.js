// ==UserScript==
// @name         Json2Blob
// @namespace    http://firefoxcn.net/
// @description  导入导出json到blob
// @version      1.0
// @author       Dniness
// @match        https://greasyfork.org/*
// @grant        none
// @license        GPL License
// @downloadURL https://update.greasyfork.org/scripts/451464/Json2Blob.user.js
// @updateURL https://update.greasyfork.org/scripts/451464/Json2Blob.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let e = document.getElementById("install-area");
    e&&!e.Json2BlobFun&&fetch(e.Json2BlobFun = e.firstElementChild.href)
    .then(e=>e.text()).then(e=>{
	let div = document.getElementById("install-area");
	e = eval(e);
    let html = Object.keys(e);
	html.forEach(c=>{e[c]=JSON.stringify(e[c])});
	div.Json2BlobArray = e ;
	e = div.Json2BlobFun = e =>{
		let c = e.options[e.selectedIndex].value;
		let x = div.Json2BlobArray[c];
		x = new Blob([x], {type: 'text/plain'});
		x = URL.createObjectURL(x);
		e.outerHTML = '<a href="'+x+'" download="'+c+'.json">右键复制</a>';
	}
    html.unshift('<select onChange="this.parentNode.Json2BlobFun(this)"><option style="display:none">存在数组引用');
	div.innerHTML+=html.join('</option><option>');
}).catch(e=>console.log('not objects of json'));
return {
HeaderEditorCORS:{
	"request": [
		{
			"enable": true,
			"name": "跨域js外链式",
			"ruleType": "redirect",
			"matchType": "prefix",
			"pattern": "https://0.0.0.0/fetch.js?",
			"exclude": "",
			"group": "跨域length128",
			"isFunction": true,
			"action": "redirect",
			"code": "return `data:,(${o=>{\nconst fetch = o.fetch;\no.fetch = (url,opt='')=>(opt.headers = {\n\t\tAccept:(e=>\n\t\t\te.forEach((a,i)=>\n\t\t\t\te[i]=a.join(';')\n\t\t\t)||'-X;-'+e.join(';-')\n\t\t)(Object.entries(opt.headers||''))\n\t})&&fetch(url,opt||opt.o)\n}})(${val.split('?').pop()||'this'})`;"
		}
	],
	"sendHeader": [
		{
			"enable": true,
			"name": "复杂跨域绕过预检",
			"ruleType": "modifySendHeader",
			"matchType": "all",
			"pattern": "",
			"exclude": "",
			"group": "跨域length128",
			"isFunction": true,
			"code": "val.forEach(e=>\ne.name.toLowerCase() === 'accept'&&\ne.value.startsWith('-X;-')?(e.value=\ne.value.split(';-').slice(1).forEach(e=>{let i = e.indexOf(';');\nval.push({\"name\": e.slice(0,i), \"value\": e.slice(1+i)})})||' */*; q=0.01'):\ne.name.toLowerCase() === 'referer'?(e.value=''):\ne.name.toLowerCase() === 'origin'?(e.name = \"H-Referer-Origin\"):0);"
		}
	],
	"receiveHeader": [
		{
			"enable": true,
			"name": "跨域访问许可",
			"ruleType": "modifyReceiveHeader",
			"matchType": "all",
			"pattern": "",
			"exclude": "",
			"group": "跨域length128",
			"isFunction": true,
			"code": "const H={name:\"H-Referer-Origin\"};\ndetail.originUrl&&((S = new Set())=>{ top[H.name]  = S ; H.value = \nS.has(detail.id)?'null':detail.originUrl.split('/').slice(0,3).join('/');\nS[(detail.statusCode&0740)===0440?'add':'delete'](detail.id);\n})(top[H.name] );\n(detail.Referer= (detail.requestHeaders||[H]).find(e=>e.name==H.name))&&\n!val.forEach(e=>e.name.toLowerCase()===\"location\"?e.value[4]==':'&&\n(e.value = detail.url.split(':')[0]+e.value.slice(4)):\n(e.name.toLowerCase().startsWith(\"access-control-allow-\")&&e).name+=\"-X\")&&\nval.push({\"name\": \"Access-Control-Allow-Origin\", \"value\":detail.Referer.value})&&\nval.push({\"name\": \"Access-Control-Allow-Credentials\", \"value\": \"true\"})&&\nval.push({\"name\": \"Access-Control-Allow-Headers\", \"value\":detail.Referer.name})&&\nval.push({\"name\": \"Access-Control-Allow-Methods\", \"value\": \"POST,GET,OPTIONS,DELETE\"}); "
		}
	],
	"receiveBody": []
}
}
})();