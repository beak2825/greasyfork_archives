
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tf-swufe.careersky.cn/jixun/Begin/Begin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385243/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/385243/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    run();

    // Your code here...

function run(){
	// 进行现状评估

	var url = window.location;
	if(url == "http://tf-swufe.careersky.cn/jixun/Begin/Begin"){
		console.log("现状评估********************开始");
		xzpg();
		console.log("现状评估********************完成");
	}
	else if(url == "http://tf-swufe.careersky.cn/jixun/Interest/Interest" ){
		console.log("职业兴趣********************开始");
		zyxq();
		console.log("职业兴趣********************完成");
	}
	else if(url == "http://tf-swufe.careersky.cn/jixun/Character/Character"){
		console.log("职业性格********************开始");
		zyxg();
		console.log("职业性格********************完成");
	}
	else if(url == "http://tf-swufe.careersky.cn/jixun/Skill/Skill"){
		console.log("职业技能********************开始");
		zyjn();
		console.log("职业技能********************完成");
	}
	else if(url == "http://tf-swufe.careersky.cn/jixun/Value/Value"){
		console.log("价值观********************开始");
		jzg();
		console.log("价值观********************完成");
	}
	else if(url == "http://tf-swufe.careersky.cn/jixun/Learn/Learn"){
		console.log("学习风格********************开始");
		xxfg();
		console.log("学习风格********************完成");
	}


}

})();




//   现状评估
function xzpg(){
	/* 开始答题 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div:nth-child(1) > a").click();
	for(var i = 1; i<18; )
	{
		var path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-form.user-feed-Form > table > tbody > tr:nth-child("+i+") > td:nth-child(2) > div > label.ant-radio-wrapper.td"+ Math.floor(Math.random()*4) +"  > span > input";

		try{
			document.querySelector(path).click();
		}catch(e){
			console.log("Exception\t" + e.message);
			break;
		}
		console.log("OK");
		i++;

	}
	/* 提交 OR 下一页 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click();

}

//   职业兴趣
function zyxq(){
	/* 开始答题 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div:nth-child(1) > a").click();
	for(var pagenum = 0; pagenum < 6; pagenum ++){

		for(var i = 1; i<17;){
			var path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > table > tbody > tr:nth-child(" + i + ") > td:nth-child(2) > div > label:nth-child("+ (Math.floor(Math.random()*2)+1) +") > span.ant-radio > input"
			try{
				document.querySelector(path).click();
			}catch(e){
				console.log("Exception\t" + e.message);
				console.log(path);
				break;
			}
			console.log("OK");
			i++;
		}

		/* 提交 OR 下一页 */
		document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click()

	}

}

// 职业性格
function zyxg(){
	/* 开始答题 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div:nth-child(1) > a").click()
	for(var pagenum = 0; pagenum < 6; pagenum ++){

		for(var i = 1; i<16;){
			var path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > dl:nth-child("+i+") > dd > div > label:nth-child(" + (Math.floor(Math.random()*2)+1) + ") > span.ant-radio > input";
			try{
				document.querySelector(path).click();
			}catch(e){
				console.log("Exception\t" + e.message);
				console.log(path);
				break;
			}
			console.log("OK");
			i++;
		}

		/* 提交 OR 下一页 */
		document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click();
	}
}

// 职业技能
function zyjn(){
	/* 开始答题 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div:nth-child(1) > a").click();
	for(var pageNum = 0; pageNum < 3; pageNum ++){
		console.log(pageNum);
		switch (pageNum){
			case 0:{
				for(var i0 = 0; i0<5; i0++){
					try{
						document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > ul > li:nth-child("+ Math.floor(Math.random()*35 + 1) +") > div.mask").click();
					}catch(e){
						//TODO handle the exception
						console.log("Exception:\t" + e.message);
					}
				}
			};break;
			case 1:{
				for(var i1 = 0; i1<5; i1++){
					var path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > ul > li:nth-child("+(i1+1)+") > div.mask";
					try{
						document.querySelector(path).click();
					}catch(e){
						//TODO handle the exception
						console.log("Exception:\t" + e.message);
					}
				}
			};break;
			case 2:{
				for(var i2 = 0; i2<3; i2++){
					path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > ul > li:nth-child("+ Math.floor(Math.random()*30 + 1) +") > div.mask";
					try{
						document.querySelector(path).click();
					}catch(e){
						//TODO handle the exception
						console.log("Exception:\t" + e.message);
					}
				}
			};break;
			default:
				break;
		}
		document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click();
	}
}

// 价值观
function jzg(){
	/* 开始答题 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div:nth-child(1) > a").click();

	for(var pagenum = 0; pagenum < 6; pagenum ++){

		for(var i = 1; i<16;){
			var path = "";
			switch (Math.floor(Math.random()*2)){
				case 0:{
					path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > ul:nth-child("+ i +") > li > div > label.ant-radio-wrapper.first > span.ant-radio > input"
				};break;
				default:{
					path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > ul:nth-child("+ i +") > li > div > label:nth-child(3) > span.ant-radio > input";
				};break;
			}
			try{
				document.querySelector(path).click();
			}catch(e){
				console.log("Exception\t" + e.message);
				console.log(path);
				break;
			}
			console.log("OK");
			i++;
		}

		/* 提交 OR 下一页 */
		document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click();
	}
	for(var i2 = 1; i2<3; i2++){
			document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div > div:nth-child("+i2+") > div:nth-child(1) > span.ant-input-wrapper > input").click();
	}

	/* 提交 OR 下一页 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click();

}

// 学习风格
function xxfg(){
	/* 开始答题 */
	document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div:nth-child(1) > a").click();
	for(var pagenum = 0; pagenum < 6; pagenum ++){

		for(var i = 1; i<17;){
			var path = "#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div:nth-child(3) > div.container-box-form.user-feed-Form > table > tbody > tr:nth-child("+ i +") > td:nth-child(2) > div > label:nth-child(" + (Math.floor(Math.random()*2)+1) + ") > span.ant-radio > input";
			try{
				document.querySelector(path).click();
			}catch(e){
				console.log("Exception\t" + e.message);
				console.log(path);
				break;
			}
			console.log("OK");
			i++;
		}

		/* 提交 OR 下一页 */
		document.querySelector("#app > div > div.container-box-wrap > div > div.container-box-middle.container-box-middle122 > div.container-box-submit > div > a").click();
	}

}
