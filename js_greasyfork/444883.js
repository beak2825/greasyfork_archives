// ==UserScript==
// @name         Bangumi 评分统计
// @namespace    https://github.com/bangumi/scripts/tree/master/liaune
// @author       Liaune
// @license      MIT
// @description  统计评分及各项指标
// @version      0.1
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/user\/\w+$/
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444883/Bangumi%20%E8%AF%84%E5%88%86%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/444883/Bangumi%20%E8%AF%84%E5%88%86%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

var options = {                  // 图表配置
	chart: {
		type: 'column',         //指定图表的类型
		backgroundColor: 'rgba(255, 255, 255, 0)'
	},
	title: {
		text: ''                  // 标题
	},
	xAxis: {
		categories: ['1','2','3','4','5','6','7','8','9','10']   // x 轴分类
	},
	yAxis: {
		title: {
			text: ''               // y 轴标题
		}
	},
	tooltip: {
		headerFormat: '<table><tr><td style="padding:0">{point.key}分: </td>',
		pointFormat: '<td style="padding:0"><b>{point.y}</b></td></tr>',
		footerFormat: '</table>',
		shared: true,
		useHTML: true
	},
	plotOptions: {
		column: {
			colorByPoint:false
		}
	},
	series: [{                              // 数据列
			name: "",                       // 数据列名
			data: [],                       // 数据
		}
	],
	legend: {
		itemStyle:{
			color: 'rgb(102, 102, 102)',
		},
		enabled: false,
	},
	credits:{
		enabled: false // 禁用版权信息
	}
};

// @numbers 包含所有数字的一维数组
// @digit 保留数值精度小数位数，默认两位小数
function getBebeQ(numbers, digit = 2) {
	// 修复js浮点数精度误差问题
	const formulaCalc = function formulaCalc(formula, digit) {
	  let pow = Math.pow(10, digit);
	  return parseInt(formula * pow, 10) / pow;
	};
	let len = numbers.length;
	let sum = (a, b) => formulaCalc(a + b, digit);
	let max = Math.max.apply(null, numbers);
	let min = Math.min.apply(null, numbers);
	// 平均值
	let avg = len? numbers.reduce(sum) / len:0;
	// 计算中位数
	// 将数值从大到小顺序排列好，赋值给新数组用于计算中位数
	let sequence = [].concat(numbers).sort((a,b) => b-a);
	let mid = 0;
	if(len){
		mid = (len & 1) == 0 ?
			  (sequence[len/2-1] + sequence[len/2]) / 2 :   //数组长度为偶数
			  sequence[(len+1)/2-1];                        //数组长度为奇数
	}
	// 计算标准差
	// 所有数减去其平均值的平方和，再除以数组个数（或个数减一，即变异数）再把所得值开根号
	let stdDev = len? Math.sqrt(numbers.map(n=> (n-avg) * (n-avg)).reduce(sum) / len):0;
	return {
	  max,
	  min,
	  avg: avg.toFixed(digit),
	  mid: mid.toFixed(digit),
	  stdDev : stdDev.toFixed(digit)
	}
}

const SubjectType = {
	1:"book",     //书籍
	2:"anime",    //动画
	3:"music",    //音乐
	4:"game",     //游戏
	              //没有5
	6:"real"      //三次元
}
const CollectType = {
	1:"wish",     //想看
	2:"collect",  //看过
	3:"doing",    //在看
	4:"on_hold",  //搁置
	5:"dropped"   //抛弃
}
const dc = {1:'读',2:'看',3:'听',4:'玩',6:'看'};

async function showProgress(subject_type=2,type=2){
	let data = [];
	let ct = {
		1: '想'+dc[subject_type],
		2: dc[subject_type]+'过',
		3: '在'+dc[subject_type],
		4: '搁置',
		6: '抛弃'
	};
	options.series[0] = {name:ct[type],data:[]};
	let avatar_href = $('.headerAvatar a.avatar')[0].href;
	let nickname = $('.nameSingle .inner a')[0].text;
	let backgroundImage = $('.headerAvatar .avatarNeue')[0].style.backgroundImage.slice(5,-2);
	let user_id = avatar_href.split('/').pop();
	let total_pages = 1;
	for(let i=0;i<total_pages;i++){
		let offset = i*100;
		await fetch(`https://api.bgm.tv/v0/users/${user_id}/collections?subject_type=${subject_type}&type=${type}&limit=100&offset=${offset}`)
				.then(response => response.json())
				.then(info => {
					total_pages = Math.ceil(info.total/100);
					data.push.apply(data,info.data);
		});
	}
	//console.log(data);
	let rates = {"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0};
	let numbers = [];
	for(let i=0;i<data.length;i++){
		if(data[i].rate) numbers.push(data[i].rate);
		rates[data[i].rate] = (rates[data[i].rate] + 1) || 1;
	}
	console.log(numbers);
	let statics = getBebeQ(numbers);
	for(let key in rates){
		if(key != "0") options.series[0].data.push(rates[key]);
	}
	$('#layout').remove();
	let container = $(`<div id="container">
						<div id="user_rating" class="user-rating"></div>
						<div id="user_panel" class="user-panel">
							<div class="info-card">
								<div class="avatar">
									<a href="${avatar_href}" alt="${nickname}" target="_blank">
										<img src="${backgroundImage}">
									</a>
								</div>
								<div class="nickname">${nickname}</div>
								<div class="subtitle">${ct[type]}</div>
								<div class="score">${data.length}</div>
								<div class="subtitle">已评</div>
								<div class="score">${data.length-rates["0"]}</div>
								<div class="subtitle">均值</div>
								<div class="score">${statics.avg}</div>
								<div class="subtitle">中值</div>
								<div class="score">${statics.mid}</div>
								<div class="subtitle">标准差</div>
								<div class="score ">${statics.stdDev}</div>
							</div>
							<div class="select_search">
								<select id="subject_type">
									<option value="1">书籍</option>
									<option value="2">动画</option>
									<option value="3">音乐</option>
									<option value="4">游戏</option>
									<option value="6">三次元</option>
								</select>
								<select id="type">
									<option value="1">想${dc[subject_type]}</option>
									<option value="2">${dc[subject_type]}过</option>
									<option value="3">在${dc[subject_type]}</option>
									<option value="4">搁置</option>
									<option value="5">抛弃</option>
								</select>
								<a id="search_collection" class="chiiBtn" href="javascript:;">查询</a>
							</div>
						</div>
					</div>`);
	$('#headerProfile').append(container);
	$('select#subject_type').val(subject_type);
	$('select#type').val(type);
	$('#search_collection').on('click',()=>{
		subject_type = $('select#subject_type').val();
		type = $('select#type').val();
		$('#container').remove();
		showProgress(subject_type,type);
	});
	$.getScript('https://cdn.highcharts.com.cn/highcharts/highcharts.js',function(){
		var charts = Highcharts.chart('user_rating',options);
	});
}

(function() {
	let showBtn = $(`<li><a href="javascript:;">评分统计</a></li>`);
	$('#headerProfile ul.navTabs').append(showBtn);
	let flag = 1;
	let show_flag = 0;
	showBtn.on('click',()=>{
		show_flag = show_flag==1?0:1;
		if(flag){
			let layout = $(`<div id="layout"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`);
			$('#headerProfile').append(layout);
			showProgress();
		}
		flag = 0;
		if(show_flag){
			$('#container').show();
		}
		else{
			$('#container').hide();
		}
	});
})();

GM_addStyle(`
	.user-rating{
		width: 800px;
		height: 600px;
		position: relative;
		left: -100px;
		float: left;
	}
	.user-panel{
		display: flex;
		float: left;
		width: 200px;
		padding-top: 20px;
		margin-left: -75px;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		justify-content: space-between;
	}
	.select_search{
		margin-top: 50px;
	}
	#layout{
	    width: 300px;
		height: 300px;
		padding: 100px;
		left: 500px;
		position: relative;
	}
	.subtitle{
		font-size: 2vh;
	}
	.avatar img{
		border-radius: 50%;
		width: 8vh;
		height: 8vh;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	.nickname{
		font-size: 4vh;
		font-weight: 700;
		margin-bottom: 1vh;
		line-height: 1;
	}
	.score{
		font-size: 3vh;
		line-height: 1;
		margin-bottom: 1vh;
	}

	.lds-roller {
		display: inline-block;
		position: relative;
		width: 64px;
		height: 64px;
		margin:10px 20px
	  }
	  .lds-roller div {
		animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		transform-origin: 32px 32px;
	  }
	  .lds-roller div:after {
		content: " ";
		display: block;
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #f09199;
		margin: -3px 0 0 -3px;
	  }
	  .lds-roller div:nth-child(1) {
		animation-delay: -0.036s;
	  }
	  .lds-roller div:nth-child(1):after {
		top: 50px;
		left: 50px;
	  }
	  .lds-roller div:nth-child(2) {
		animation-delay: -0.072s;
	  }
	  .lds-roller div:nth-child(2):after {
		top: 54px;
		left: 45px;
	  }
	  .lds-roller div:nth-child(3) {
		animation-delay: -0.108s;
	  }
	  .lds-roller div:nth-child(3):after {
		top: 57px;
		left: 39px;
	  }
	  .lds-roller div:nth-child(4) {
		animation-delay: -0.144s;
	  }
	  .lds-roller div:nth-child(4):after {
		top: 58px;
		left: 32px;
	  }
	  .lds-roller div:nth-child(5) {
		animation-delay: -0.18s;
	  }
	  .lds-roller div:nth-child(5):after {
		top: 57px;
		left: 25px;
	  }
	  .lds-roller div:nth-child(6) {
		animation-delay: -0.216s;
	  }
	  .lds-roller div:nth-child(6):after {
		top: 54px;
		left: 19px;
	  }
	  .lds-roller div:nth-child(7) {
		animation-delay: -0.252s;
	  }
	  .lds-roller div:nth-child(7):after {
		top: 50px;
		left: 14px;
	  }
	  .lds-roller div:nth-child(8) {
		animation-delay: -0.288s;
	  }
	  .lds-roller div:nth-child(8):after {
		top: 45px;
		left: 10px;
	  }
	  @keyframes lds-roller {
		0% {
		  transform: rotate(0deg);
		}
		100% {
		  transform: rotate(360deg);
		}
	  }
`);