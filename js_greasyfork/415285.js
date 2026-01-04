// ==UserScript==
// @name         test_2
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  xqg switch
// @author       You
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html*
// @match        https://pc.xuexi.cn/points/exam-practice.html*
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/415285/test_2.user.js
// @updateURL https://update.greasyfork.org/scripts/415285/test_2.meta.js
// ==/UserScript==


(function() {
	'use strict';

	var ds = 15;
	var is_go = null;
	var ds_t = null;
	var model = 'auto';
	var once = 0;
	function go() {
		console.log("执行go()...");
		let click_c = 0;
		let tip = [];
		let match_w = {};
		let max = 0;
		let yc_t = 0;
		let may_w = false; //是否可能存在错题
		if (document.querySelector(".q-header") == null) // 结果页面或者没有加载
		{
			if (document.querySelector(".ant-btn.action.ant-btn-primary") != null) //有再来一组再来一次再练一次按钮
			{
				document.querySelector("#my_div").remove();
				console.log("=======" + '结束' + "======");
				return;
			} else {     //题目没有加载
				setTimeout(go, 1000);
				return;
			}
		}
		if(once==0) {draw_div(); once++};
		let type = document.querySelector(".q-header").innerText.substr(0, 3);
		if (document.querySelector(".q-footer .tips") != null) {
			document.querySelector(".q-footer .tips").click();
		} else //做错的时候点击确定按钮后会显示答案解析且提示消失，不会跳转到下一题
		{
			console.log("检测不到提示内容(可能此题做错),调用next()");
			next(1);
			return;
		}
		document.querySelectorAll('.line-feed [color=red]').forEach(function(a, b, c) {
			let i = a.innerText;
			if (i != "") tip.push(i);
		});
		switch (type) {
			case "单选题":
				yc_t = 1;
			case "多选题":
				click_c = document.querySelectorAll('.q-answers .chosen').length;
				if (click_c <= 0) { //已经有选择则跳过
					let options=document.querySelectorAll('.q-answer');
                    for(let i=0;i<options.length;i++){
                        let option=options[i];
						let option_txt = option.innerHTML.split('. ').slice(-1)[0];
						let is_match = false;
						let dz_c = 0;
						let is_click = false; //是否已经被选中
						let tip_txt = tip.join('');
						is_click = Boolean(option.className.indexOf("chosen") != -1); //是否已经被选中
						is_match = (option_txt.indexOf(tip_txt) != -1 || tip_txt.indexOf(option_txt) != -1) && tip_txt != "";
						if (is_match && !is_click) {
							option.click(); 
							click_c++;
							}
						if (!is_match) {
							dz_c += dz(tip_txt, option.innerHTML); 
							match_w[dz_c] = option;
							}
						console.log(i + " " + option_txt + "<->" + tip_txt + " is_match:" + is_match + " dz_c:" + dz_c);
						if(option_txt==tip_txt&&click_c>0) break;   //如果所有提示==选项，说明是单选且是最匹配的一个选项 break for
					}

					if (click_c == 0) {
						for (let i in match_w) {
							max = Number(max) >= Number(i) ? Number(max) : Number(i);
						}
						match_w[max].click();
						click_c++;
						console.log("最终未能匹配，选择:" + match_w[max].innerHTML + " max:" + max);
						may_w = true;
					}
					yc_t = yc_t == 0 ? 2500 : 1500;
				}
				break;
			case "填空题":
				let inpus = document.querySelectorAll('.q-body input');
				let inputs_e = document.querySelectorAll('.q-body input[value=""]'); //html中的属性
				click_c = inpus.length - inputs_e.length;
				if (inputs_e.length > 0) {
					let ev = new Event('input', {bubbles: true});
					inpus.forEach(function(a, b, c) {
						if (tip[0] == undefined) {
							may_w = true;
							let a = document.querySelector(".q-body").innerText;
							let n = parseInt(Math.random() * 2 + 2);
							let i = parseInt(Math.random() * (a.length - n - 1));
							tip[0] = a.substr(i, n);
						}
						let value = "";
						if (c.length == 1)
							value = tip.join('');
						else
							value = b < tip.length ? tip[b] : tip[0];
						if (a.value == "") {
							//a.value=value;
							a.setAttribute("value", value);
							a.dispatchEvent(ev);
							click_c++;
							console.log(b + "->" + value);
						}
					})
					yc_t = 3500;
				}
				break;
		}
		console.log("已自动做选择/填空 次数click_c:" + click_c);
		over(click_c, may_w, yc_t);
	}

	function next(click_c = 0) {
		console.log("执行 next()...");
		if (click_c > 0 && model == 'auto') { //做错的时候点击确定按钮后会显示答案解析且提示消失，不会跳转到下一题
			let b=document.querySelector(".detail-body button:not(:disabled)");     //detail-body为题目div
			if(b!=null)
			{
				b.click();
				is_go = setTimeout(go, parseInt(Math.random() * 1000 + 2000));
				console.log('next中启动定时器_go');
			}
			else
			{
				let p = document.querySelector("#my_p");
				p.innerHTML ="请手动做题后，点击下面按钮切换到自动模式";
				model = "manual";
				document.querySelector("#manual").style.display="none";
				document.querySelector("#auto").style.removeProperty('display');
			}
		}
	}

	function over(click_c = 0, may_w = false, yc_t = 0) {
		if (!may_w) {
			is_go = setTimeout(function() {next(click_c)}, parseInt(Math.random() * 1500 + yc_t));
			console.log('over中启动定时器_next');
			return;
		}
		model = "wait";
		let ds_c = 0;
		let p = document.querySelector("#my_p");
		p.innerHTML ="<span style='color:red;'>此题无完全匹配答案，已填写(选择)一个相对最匹配的答案(可能是错误的)。<br>你可以点击下面按钮切换到手动做题并修正答案后再次点击按钮切换到自动模式。<br>若 <span id='my_ds_c'>" +
			ds + "</span> 秒无操作则继续自动模式</span>";
		ds_t = setInterval(function() {
			ds_c++;
			document.querySelector("#my_ds_c").innerText = ds - ds_c;
			if (ds_c >= ds) {
				p.innerHTML="自动测试中...";
				clearInterval(ds_t);
				ds_t = null;
				model = 'auto';
				console.log('over中调用_go()');
				go();
			}
		}, 1000);

	}
	
	function dz(a = '', b = '') {
		let c = 0;
		for (let i = 0; i < b.length; i++) {
			if (a.indexOf(b.substr(i, 1)) != -1) {
				c++;
				//console.log(b.substr(i,1));
			}
		}
		return c;
	}
	
	function draw_div(){
		let d= document.createElement("div");
		d.id = "my_div";
		d.style.cssText='text-align: center;border: 1px solid #f0f0f0; background-color: rgb(200,227,255); padding: 10px; margin: -20px auto 10px auto;'
		let p = document.createElement("p");
		p.id = "my_p";
		p.style.fontSize = '22px';
		p.innerHTML= '自动测试中...';
		d.appendChild(p);
		let exam=document.querySelector(".detail-body");
		exam.parentNode.insertBefore(d,exam);
		
		let b1 = document.createElement("button");
		let b2 = document.createElement("button");
		b1.style.cssText='color:green; font-size: 20px; text-align: center; margin-top: 10px; cursor: pointer; width: 200px; height: 40px;';
		b2.style.cssText='color:red;   font-size: 20px; text-align: center; margin-top: 10px; cursor: pointer; width: 200px; height: 40px;';
		b1.id = 'manual';
		b2.id = 'auto';
		b1.innerText = '切换到手动模式';
		b2.innerText = '切换到自动模式';
		b2.style.display="none";
		b1.onclick = function() {
			let p=document.querySelector("#my_p");
			if (ds_t != null) {
				console.log('清除定时器_ds_t');
				clearInterval(ds_t);
				ds_t = null;
			}
			if (is_go != null) {
				console.log('清除定时器_is_go');
				clearInterval(is_go);
				is_go = null;
			}
			model = "manual";
			p.innerHTML= '手动测试中...';
			b1.style.display="none";
			b2.style.removeProperty('display');
		}
		b2.onclick = function() {
			let p=document.querySelector("#my_p");
			if (ds_t != null) {
				console.log('清除定时器_ds_t');
				clearInterval(ds_t);
				ds_t = null;
			}
			model = 'auto';
			p.innerHTML= '自动测试中...';
			console.log('over中调用_go()');
			go();
			b2.style.display="none";
			b1.style.removeProperty('display');
		}
		d.appendChild(b1);	
		d.appendChild(b2);
			
	}

	//draw_div();
	is_go = setTimeout(function(){go();}, parseInt(Math.random() * 1000 + 2000));

})();