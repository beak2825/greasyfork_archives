// ==UserScript==
// @name         MCBBS CreditAnalysis
// @namespace    https://fang.blog.miri.site
// @version      0.6
// @description  MCBBS用户积分成分分析
// @author       Mr_Fang
// @match        https://*.mcbbs.net/?*
// @match        https://*.mcbbs.net/home.php?mod=space&uid=*
// @match        https://*.mcbbs.net/home.php?mod=space&username=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407846/MCBBS%20CreditAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/407846/MCBBS%20CreditAnalysis.meta.js
// ==/UserScript==

(function() {

    console.log(" %c MCBBS %c CreditAnalysis", "color: #fff; background: #f8981d; padding:5px;", "color:#fff; background: #000; padding:5px;");
    console.log(" %c Made by %c 快乐小方 ", "color: #fff; background: #815098; padding:5px;", "color:#fff; background: #000; padding:5px;");
    console.group('MCA Log');

    // 获取用户uid（我觉得通过页面url获取更麻烦）
    var uid = jq("span.xw0").html();
    uid = uid.split(')\n');
    uid = uid[0].replace('(UID: ','');
    console.log("[L] 用户UID：" + uid);

    console.log("[L] 开始获取用户数据");
    // 调用api
    jq.ajax({
        type:'get',
        url:"https://www.mcbbs.net/api/mobile/index.php?module=profile&uid=" + uid,
        success:function(body,heads,status){
            console.log("[L] 成功获取用户数据");
            var credits = body.Variables.space.credits;            //积分总值
            var extcredits1 = body.Variables.space.extcredits1;    //人气
            var extcredits2 = body.Variables.space.extcredits6;    //贡献
            var extcredits3 = body.Variables.space.extcredits7;    //爱心
            var extcredits4 = body.Variables.space.extcredits8;    //钻石
            var posts = body.Variables.space.posts;                //发帖数
            var threads = body.Variables.space.threads;            //主题数
            var digestposts = body.Variables.space.digestposts;    //精华数

            //DeBug：console.log("[D] 人气分:" + extcredits1*3 + "\n贡献分:" + extcredits2*10 + "\n爱心分:" + extcredits3*4 + "\n钻石分:" + extcredits4*2 + "\n发帖分:" + Math.round(posts/3) + "\n主题分:" + threads*2 + "\n精华分:" + digestposts*45)
            var json = [credits,extcredits1*3,extcredits2*10,extcredits3*4,extcredits4*2,posts/3,threads*2,digestposts*45];
            console.log("[D] 用户积分数：" + json[0] +"，公式计算得：" + Math.round(json[1] + json[2] + json[3] + json[4] + json[5] + json[6] + json[7]));

            // 在id是psts的标签末尾添加canvas
            jq('#psts').append(`
<div height="400" width="600" style="padding-top: 100px;">
	<h1>积分成分分析<span class="pipe">By.快乐小方</span></h1>
	<canvas id="chart">你的浏览器不支持HTML5</canvas>
</div>
`);
            // 绘制饼状图（https://github.com/sutianbinde/charts）
            jq('#psts').append(`
<script type="text/javascript">
	function goChart(dataArr) {
		// 声明所需变量
		var canvas, ctx;
		// 图表属性
		var cWidth, cHeight, cMargin, cSpace;
		// 饼状图属性
		var radius, ox, oy; //半径 圆心
		var tWidth, tHeight; //图例宽高
		var posX, posY, textX, textY;
		var startAngle, endAngle;
		var totleNb;
		// 运动相关变量
		var ctr, numctr, speed;
		//鼠标移动
		var mousePosition = {};

		//线条和文字
		var lineStartAngle, line, textPadding, textMoveDis;

		// 获得canvas上下文
		canvas = document.getElementById("chart");
		if (canvas && canvas.getContext) {
			ctx = canvas.getContext("2d");
		}
		initChart();

		// 图表初始化
		function initChart() {
			// 图表信息
			cMargin = 20;
			cSpace = 40;

			canvas.width = canvas.parentNode.getAttribute("width") * 2;
			canvas.height = canvas.parentNode.getAttribute("height") * 2;
			canvas.style.height = canvas.height / 2 + "px";
			canvas.style.width = canvas.width / 2 + "px";
			cHeight = canvas.height - cMargin * 2;
			cWidth = canvas.width - cMargin * 2;

			//饼状图信息
			radius = cHeight * 2 / 6; //半径  高度的2/6
			ox = canvas.width / 2 + cSpace; //圆心
			oy = canvas.height / 2;
			tWidth = 60; //图例宽和高
			tHeight = 20;
			posX = cMargin;
			posY = cMargin; //
			textX = posX + tWidth + 15
			textY = posY + 18;
			startAngle = endAngle = 90 * Math.PI / 180; //起始弧度 结束弧度
			rotateAngle = 0; //整体旋转的弧度

			//将传入的数据转化百分比
			totleNb = 0;
			new_data_arr = [];
			for (var i = 0; i < dataArr.length; i++) {
				totleNb += dataArr[i][0];
			}
			for (var i = 0; i < dataArr.length; i++) {
				new_data_arr.push(dataArr[i][0] / totleNb);
			}
			totalYNomber = 10;
			// 运动相关
			ctr = 1; //初始步骤
			numctr = 50; //步骤
			speed = 1.2; //毫秒 timer速度

			//指示线 和 文字
			lineStartAngle = -startAngle;
			line = 40; //画线的时候超出半径的一段线长
			textPadding = 10; //文字与线之间的间距
			textMoveDis = 200; //文字运动开始的间距
		}

		drawMarkers();
		//绘制比例图及文字
		function drawMarkers() {
			ctx.textAlign = "left";
			for (var i = 0; i < dataArr.length; i++) {
				//绘制比例图及文字
				ctx.fillStyle = dataArr[i][1];
				ctx.fillRect(posX, posY + 40 * i, tWidth, tHeight);
				ctx.moveTo(posX, posY + 40 * i);
				ctx.font = 'normal 24px 微软雅黑'; //斜体 30像素 微软雅黑字体
				ctx.fillStyle = dataArr[i][1]; //"#000000";
				var percent = dataArr[i][2] + "：" + parseInt(100 * new_data_arr[i]) + "%";
				ctx.fillText(percent, textX, textY + 40 * i);
			}
		};

		//绘制动画
		pieDraw();

		function pieDraw(mouseMove) {

			for (var n = 0; n < dataArr.length; n++) {
				ctx.fillStyle = ctx.strokeStyle = dataArr[n][1];
				ctx.lineWidth = 1;
				var step = new_data_arr[n] * Math.PI * 2; //旋转弧度
				var lineAngle = lineStartAngle + step / 2; //计算线的角度
				lineStartAngle += step; //结束弧度

				ctx.beginPath();
				var x0 = ox + radius * Math.cos(lineAngle), //圆弧上线与圆相交点的x坐标
					y0 = oy + radius * Math.sin(lineAngle), //圆弧上线与圆相交点的y坐标
					x1 = ox + (radius + line) * Math.cos(lineAngle), //圆弧上线与圆相交点的x坐标
					y1 = oy + (radius + line) * Math.sin(lineAngle), //圆弧上线与圆相交点的y坐标
					x2 = x1, //转折点的x坐标
					y2 = y1,
					linePadding = ctx.measureText(dataArr[n][2]).width + 10; //获取文本长度来确定折线的长度

				ctx.moveTo(x0, y0);
				//对x1/y1进行处理，来实现折线的运动
				yMove = y0 + (y1 - y0) * ctr / numctr;
				ctx.lineTo(x1, yMove);
				if (x1 <= x0) {
					x2 -= line;
					ctx.textAlign = "right";
					ctx.lineTo(x2 - linePadding, yMove);
					ctx.fillText(dataArr[n][2], x2 - textPadding - textMoveDis * (numctr - ctr) / numctr, y2 - textPadding);
				} else {
					x2 += line;
					ctx.textAlign = "left";
					ctx.lineTo(x2 + linePadding, yMove);
					ctx.fillText(dataArr[n][2], x2 + textPadding + textMoveDis * (numctr - ctr) / numctr, y2 - textPadding);
				}

				ctx.stroke();

			}



			//设置旋转
			ctx.save();
			ctx.translate(ox, oy);
			ctx.rotate((Math.PI * 2 / numctr) * ctr / 2);

			//绘制一个圆圈
			ctx.strokeStyle = "rgba(0,0,0," + 0.5 * ctr / numctr + ")"
			ctx.beginPath();
			ctx.arc(0, 0, (radius + 20) * ctr / numctr, 0, Math.PI * 2, false);
			ctx.stroke();

			for (var j = 0; j < dataArr.length; j++) {

				//绘制饼图
				endAngle = endAngle + new_data_arr[j] * ctr / numctr * Math.PI * 2; //结束弧度

				ctx.beginPath();
				ctx.moveTo(0, 0); //移动到到圆心
				ctx.arc(0, 0, radius * ctr / numctr, startAngle, endAngle, false); //绘制圆弧

				ctx.fillStyle = dataArr[j][1];
				if (mouseMove && ctx.isPointInPath(mousePosition.x * 2, mousePosition.y * 2)) {
					ctx.globalAlpha = 0.8;
				}

				ctx.closePath();
				ctx.fill();
				ctx.globalAlpha = 1;

				startAngle = endAngle; //设置起始弧度
				if (j == dataArr.length - 1) {
					startAngle = endAngle = 90 * Math.PI / 180; //起始弧度 结束弧度
				}
			}

			ctx.restore();

			if (ctr < numctr) {
				ctr++;
				setTimeout(function() {
					//ctx.clearRect(-canvas.width,-canvas.width,canvas.width*2, canvas.height*2);
					ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
					drawMarkers();
					pieDraw();
				}, speed *= 1.085);
			}
		}



		//监听鼠标移动
		var mouseTimer = null;
		canvas.addEventListener("mousemove", function(e) {
			e = e || window.event;
			if (e.offsetX || e.offsetX == 0) {
				mousePosition.x = e.offsetX;
				mousePosition.y = e.offsetY;
			} else if (e.layerX || e.layerX == 0) {
				mousePosition.x = e.layerX;
				mousePosition.y = e.layerY;
			}

			clearTimeout(mouseTimer);
			mouseTimer = setTimeout(function() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawMarkers();
				pieDraw(true);
			}, 10);
		});

	}
    var json = [`+ json.toString() +`]

	var colours = {"#2dc6c8":"人气","#b6a2dd":"贡献","#5ab1ee":"爱心","#d7797f":"钻石","#E6399B":"发帖数","#9F3ED5":"主题数","#FF4040":"精华数"}

	var chartData = []

	var index = 1

	for (let key in colours) {
		if (json[index] != 0){
			chartData.push([json[index], key, colours[key]])
		}
		index++
	}

	console.log("[L] 开始绘制Canvas");
	goChart(chartData);
	console.log("[L] 绘制完成");

</script>
`);
            console.groupEnd();
        }
    });
})();