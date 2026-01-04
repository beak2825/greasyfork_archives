// ==UserScript==
// @name         易安在线-新疆终身学习+VX：shuake345
// @namespace    v+++++++shuake345+++++++++++
// @version      0.1
// @description  自动看完所有小节|无法加速|秒刷/赶时间+V：shuake345
// @author       Vx：shuake345
// @match        *://*.100anquan.com/*
// @match        *://*.xjlll.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466150/%E6%98%93%E5%AE%89%E5%9C%A8%E7%BA%BF-%E6%96%B0%E7%96%86%E7%BB%88%E8%BA%AB%E5%AD%A6%E4%B9%A0%2BVX%EF%BC%9Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/466150/%E6%98%93%E5%AE%89%E5%9C%A8%E7%BA%BF-%E6%96%B0%E7%96%86%E7%BB%88%E8%BA%AB%E5%AD%A6%E4%B9%A0%2BVX%EF%BC%9Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var Kcun=document.querySelectorAll("body > div.content > ul > li > ol > li > div.class_details_bottom > a> i")//[16].click()
    var Kcing=document.querySelector('a>h3.learning')
    function Circsk(){
        function contents() {
		if (document.URL.search('personalCente') > 1) { //是目录
            var jd=document.getElementsByClassName("progress-text pull-left ng-binding")
            for (var i = 0; i < jd.length; i++) {
            if(jd[i].innerText!=='100.0%'){
                jd[i].parentNode.parentNode.querySelectorAll('div>a')[1].click()
                break;
            }else if(i==jd.length-1){
            document.querySelector('[ng-click="nextPage()"]').click()
                setTimeout(contents,4254)
            }
			/*if (document.getElementsByClassName('list-item ng-scope ng-binding active').length == 0) { //没有选择目录中的课程
				document.getElementsByClassName('list-item ng-scope ng-binding')[0].click()
			}
			var chicontents = document.getElementsByClassName('link ng-binding') //子课程ID
			var chilength = chicontents.length //子课程数
			console.log(chilength)
			if (chilength > 0) {
				//判断是否看完
				for (var i = 0; i < chilength; i++) {
					if (chicontents[i].parentElement.parentElement.querySelectorAll('p>span>span')[3].textContent !== '已完成') {
						chicontents[i].click()
						break;
					} else if (i = chilength - 1) { //全完成了
						cometime()
					}
				}
			}*/
		}
	}
    }
	setTimeout(contents, 4000)

	function cometime() {
		document.getElementsByClassName('list-item ng-scope ng-binding active')[0].nextElementSibling.click()
		setTimeout(contents, 2000)
	}

	/*function cy() {
		if (document.URL.search('courseCenter/courseDetails') > 1) { //次页
			//识别播放进度
			if (document.getElementsByClassName('progress')[0].innerText !== "100.0%") { //播放进度未完成
				document.querySelectorAll('table>tbody>tr>td.listtb4>a')[1].click() //1是播放，0是参加测试
				setTimeout(gb, 1000) //关闭当前页
			} else if (document.getElementsByClassName('progress')[0].innerText == "100.0%") { //播放进度100%,开始答题
				document.querySelectorAll('table>tbody>tr>td.listtb4>a')[0].click() //1是播放，0是参加测试
				setTimeout(gb, 1000) //关闭当前页
			}
		}
	}
	setTimeout(cy, 5000)*/

	function bfy() {
		if (document.URL.search('play/play') > 1) { //播放页
			var sp = document.getElementsByTagName('video')[0]
			var jd = document.getElementsByClassName('jw-current-time')[0].innerText
			var alljd = document.getElementsByClassName('jw-duration')[0].innerText
			var xuanzeti = document.querySelectorAll('table>tbody>tr>td>label>input')

			if (document.getElementsByTagName('video')[0].paused && jd == alljd) {
				setTimeout(gb, 1000)
			} else {
				sp.play()
				sp.volume = 0
			}
			if (xuanzeti.length > 0) { //选项>0
				for (var i = 0; i < xuanzeti.length; i++) {
					xuanzeti[i].click()
					document.querySelectorAll('div.questions-inner>button')[0].click() //提交
				}
			}
		}
	}
	setInterval(bfy, 5000)

	function ksy() { //考试界面
		if (document.URL.search('exam/exam') > 1) {
			if (mydaan.length > 19) {
				mydaan = []
			}
			console.log(mydaan)
			var xuanxiang = document.getElementsByClassName('hideNode')
			var tigan = document.querySelectorAll('tr>td>table>tbody')
			if (mydaan == '') { //空数组，则单选全为A，多选全选ABCD
				for (var i = 0; i < xuanxiang.length; i++) {
					if (xuanxiang[i].type == 'radio' && xuanxiang[i].value == 'A') { //单选题
						xuanxiang[i].click()
					}
					if (xuanxiang[i].type == 'checkbox') { //多选全选ABCD
						xuanxiang[i].click()
					}
				}
				if (document.getElementsByClassName('btn btn-primary').length == 1) {
					document.getElementsByClassName('btn btn-primary')[0].click() //提交
				}
			} else if (xuanxiang.length > 0) { //数组不是空，说明刚提取答案
				for (var j = 0; j < mydaan.length; j++) { //数组的个数，只有10题
					switch (mydaan[j]) { //单选
						case 'A':
							tigan[j].querySelectorAll('tr>td>label')[0].click() //A=0,B=1,C=2,D=3,E=4
							break;
						case 'B':
							tigan[j].querySelectorAll('tr>td>label')[1].click() //A=0,B=1,C=2,D=3,E=4
							break;
						case 'C':
							tigan[j].querySelectorAll('tr>td>label')[2].click() //A=0,B=1,C=2,D=3,E=4
							break;
						case 'D':
							tigan[j].querySelectorAll('tr>td>label')[3].click() //A=0,B=1,C=2,D=3,E=4
							break;
						default: //其他情况,多选
							i = 0
							while (i < tigan[j].querySelectorAll('tr>td>label').length) {
								tigan[j].querySelectorAll('tr>td>label')[i].click()
								i++
							}
					}
				}
				if (document.getElementsByClassName('btn btn-primary').length == 1) {
					document.getElementsByClassName('btn btn-primary')[0].click() //提交
				}
			}

			if (document.getElementsByClassName('msConfirm').length == 1) { //提交已完成，确定
				document.getElementsByClassName('msConfirm')[0].click()
				if (parseInt(document.querySelector('div.xz.score>ul>li.highlight.ng-binding').innerText) >= 60) {
					//考试通过
					setTimeout(gb, 1000) //关闭当前页
				} else { //考试未通过，记住答案，再次作答
					var rightdaan = document.querySelectorAll('table>tbody>tr>td>div>span.ng-binding')
					for (var l = 0; l < rightdaan.length; l++) {
						if (rightdaan[l].innerText.search('选项') > 0) { //答案计入数组中
							var daan = rightdaan[l].innerText.replace(/[^a-zA-Z]/g, '')
							mydaan.push(daan)
							// console.log(mydaan)
						}
					}
					//返回
					window.history.go(-1)
				}
			}
		}
	}
	setInterval(ksy, 5000)

	function huakuai() {
		if (document.getElementsByClassName('handler handler_bg').length !== 0) {
			document.querySelector('div.handler.handler_bg').dispatchEvent(new MouseEvent('mousedown'));
			let left = 160;
			let event = new MouseEvent('mousemove', {
				'clientX': left,
			});
			document.querySelector('div.handler.handler_bg').dispatchEvent(event);
			document.querySelector('div.handler.handler_bg').dispatchEvent(new MouseEvent('mouseup'));
			document.dispatchEvent(new MouseEvent('mousemove', {
				clientX: 865,
				clientY: 565
			}));
		}
	}
	setTimeout(huakuai, 3524)
    }

	function sx() {
		window.location.reload()
	}
    setTimeout(sx,645200)
    function Bfy(){
    for (var i = 0; i < Kcun.length; i++) {
        if(Kcing==null){
        if (Kcun[i].innerText == "未学完" ||Kcun[i].innerText == "未学习" ) {
        Kcun[i].click()
        }
        }else if(document.querySelector('video').paused==true){
                    setTimeout(function(){
                    if(document.querySelector('video').paused==true){
                    sx()
                    }
                    },4542)
                   }
				break;
		}
    }
    setInterval(Bfy,12421)

})();