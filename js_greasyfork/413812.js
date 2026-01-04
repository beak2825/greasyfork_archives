// ==UserScript==
// @name        Auto-Fill-Verification-Code-Box-of-ZJU
// @author      HsFish1213
// @namespace   https://github.com/HsFish1213/Auto-Fill-Verification-Code-Box-of-ZJU
// @description 自动填写浙大图书馆预约系统验证码
// @include     http://10.203.97.155/home/book*
// @require     https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @version     3.0
// @grant       none
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/413812/Auto-Fill-Verification-Code-Box-of-ZJU.user.js
// @updateURL https://update.greasyfork.org/scripts/413812/Auto-Fill-Verification-Code-Box-of-ZJU.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
	alert("Please click login in 3 seconds.Then I'll auto-fill the verifying box every 2 seconds.");
	//$('a.badge login-btn login_click').trigger("click");
	//$('a.login-btn login_click').trigger("click");
    //$(".login-btn").trigger("click");
	setTimeout (function ()
	{Main();}, 3000);

	function Main(){
		var img = document.getElementById("checkpic");
		console.log("Time is up");
        //$('input[name=verify]').val("Test");//for test
		//document.getElementsByName("verify").value="lalala";
        console.log(img.src);//for test
        //$("#imgCode").hide();
		var canvas = document.createElement('canvas');//创建画布
		document.body.appendChild(canvas);
		canvas.width = 130;
		canvas.height= 50;

		var ctx;
		var imgArr = [];

		//console.log("Draw happens!");//开始绘入img （for test）
		if (!canvas.getContext) return;
		ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		//console.log("Getting code!");//for test
		var imgData_obj = ctx.getImageData(0,0,canvas.width,canvas.height);// 获取画布上的图像像素矩阵
		var imgData = imgData_obj.data;// 获取到的数据为一维数组，包含图像的RGBA四个通道数据

		var Gmain=getTheMainColor();//获取主要的颜色
		function getTheMainColor(){
			var kind=[];//各种颜色的集合
			var kindN=1;//颜色种类数
			var kindS=[];//不同种颜色的面积
			for (var i=0;i<=130-1;i++){
				for (var j=0;j<=50-1;j++){
					kindS.push(0);
					var colorNow=imgData[4*(130*j+i)];
					if(colorNow!=243 && findTheKind(colorNow)==0){
						kind[kindN]=colorNow;
						kindS[kindN]++;
						kindN++;
					}
					else if(colorNow!=243){
						kindS[findTheKind(colorNow)]++;
					}
				}
			}

			function findTheKind(a){//找到所在颜色类型
				for (var i=1;i<=kindN;i++){
					if (a==kind[i]){
						return i;
					}
				}
				return 0;
			}
			var mainKindId = 1;
			for (var iii=1;iii<=kindN;iii++){//计算得到主要的颜色
					if (kindS[mainKindId]<kindS[iii])
                    {mainKindId=iii;}
			}
			return kind[mainKindId];
		}

		var ee=88;
		var boolColor = new Array(130);//存储背景、数字以及轮廓的矩阵
		var boolEachColor = new Array(5);//分别储存每个数字的矩阵
		var boolEachGet = new Array(5);//分别储存每个数字get
		for (var index=1;index<=4;index++){
			boolEachColor[index]=new Array(130);
			boolEachGet[index]=new Array(130);
		}
        var boolTest = new Array(130);//for test
		var boolGet = new Array(130);//是否已经检测
		for (var i=0;i<=130-1;i++){
			boolColor[i]=new Array(50);
			for (var z=1;z<=4;z++){boolEachColor[z][i]=new Array(50);boolEachGet[z][i]=new Array(50);}
            boolTest[i]=new Array(50);
			boolGet[i]=new Array(50);
			for (var j=0;j<=50-1;j++){
				if(imgData[4*(130*j+i)]==243)
					{boolColor[i][j]="";}
				else if(imgData[4*(130*j+i)]==Gmain)
					{boolColor[i][j]=11;}
				else boolColor[i][j]=ee;
				for (var index2=1;index2<=4;index2++){boolEachColor[index2][i][j]="";boolEachGet[index2][i][j]="";}
                boolTest[i][j]="";
				boolGet[i][j]="";
			}
		}


		var mainS=[0,0,0,0,0];//4个数字的主颜色面积 1-4
		var edgeS=[0,0,0,0,0];//4个数字的轮廓面积 1-4
		var holeS=[0,0,0,0,0];//4个数字的孔洞面积 1-4
		//var big=[0];//4个数字的大块中心数量  1-4

		getTheCode1();

		function getTheCode1(){//开始逐一拓展
			var n=1;
			for (var i=0;i<=130-1;i++){
				for (var j=0;j<=50-1;j++){
					if (boolGet[i][j]==""&&boolColor[i][j]==11){
						expand(i,j,n);
						n++;
					}
				}
			}
		}


		function expand(i,j,n){//使用递归 由一点拓展到整个数字
            boolGet[i][j]=11;
            boolTest[i][j]=11;//for test
            if(boolColor[i][j]==11){mainS[n]+=1;boolEachColor[n][i][j]=11;}
			if(boolColor[i][j]==ee){edgeS[n]+=1;boolEachColor[n][i][j]=ee;}//important
            //console.log("Expanding "+i+" "+j);//for test
			var iplus=[1,-1,0,0];
			var jplus=[0,0,1,-1];
			for(var m=0;m<=3;m+=1){
				var ii=i+iplus[m];
				var jj=j+jplus[m];
				if(0<=ii&&ii<=130-1&&0<=jj&&jj<=50-1&&boolGet[ii][jj]==""){
					if(boolColor[ii][jj]==11||boolColor[ii][jj]==ee){
						expand(ii,jj,n);
					}
				}
			}
		}

		if(mainS[4]==0){refresh();return;}

		function getAverage(n){//获得一个数字矩阵的main和edge的均坐标作为特征
			var mainXSum=0,mainYSum=0;
			var edgeXSum=0,edgeYSum=0;
			var aver=[];
			for (var i=0;i<=130-1;i++){
				for (var j=0;j<=50-1;j++){
					if (boolEachColor[n][i][j]==11){
						mainXSum+=i;
						mainYSum+=j;
					}
					if (boolEachColor[n][i][j]==ee){
						edgeXSum+=i;
						edgeYSum+=j;
					}
				}
			}
			aver[1]=mainXSum/mainS[n];aver[2]=mainYSum/mainS[n];
			aver[3]=edgeXSum/edgeS[n];aver[4]=edgeYSum/edgeS[n];
			return aver;
		}

		var aver=new Array(5);
		var vector=new Array(5);//每个数字的特征矢量 1-4
		var vectLength=new Array(5);//每个数字的特征矢量长度 1-4
		var hole=[0];//每个数字的洞口数量 1-4
		for(var index5=1;index5<=4;index5++){
			aver[index5]= getAverage(index5);
			vector[index5]=[aver[index5][1]-aver[index5][3],aver[index5][2]-aver[index5][4]];
			vectLength[index5]=Math.pow(vector[index5][0],2)+Math.pow(vector[index5][1],2);
			hole.push(numberOfHole(index5));
			//big.push(getBig(index5));
		}


		function numberOfHole(n){//开始逐一拓展检查孔洞,返回孔洞数目
			var ans=0;
			var iTo=130,jTo=50;
			expandHole(0,0,n,1);
			for (var i=0;i<=iTo-1;i++){
				for (var j=0;j<=jTo-1;j++){
					if (boolEachGet[n][i][j]==""&&boolEachColor[n][i][j]==""){
						expandHole(i,j,n,2);
						ans++;
					}
				}
			}

			function expandHole(i,j,n,mode){//使用递归 由一点拓展到整个hole. Mode:1背景 2孔洞
				boolEachGet[n][i][j]=11;
				if(mode==2){holeS[n]+=1;}
				//console.log("Expanding "+i+" "+j);//for test
				var iplus=[1,-1,0,0];
				var jplus=[0,0,1,-1];
				for(var m=0;m<=3;m+=1){
					var ii=i+iplus[m];
					var jj=j+jplus[m];
					if(0<=ii&&ii<=130-1&&0<=jj&&jj<=50-1&&boolEachGet[n][ii][jj]==""){
						if(boolEachColor[n][ii][jj]==""||boolEachColor[n][ii][jj]==ee){
							expandHole(ii,jj,n,mode);
						}
					}
				}
			}
			return ans;
		}
		/*
		function getBig(n){
			var ansBig=0;
			var r=2;//半径--------
			for (var x=0+r;x<=130-1-r;x++){
				for (var y=0+r;y<=50-1-r;y++){
					if(ifBig(x,y,n)==1){ansBig++;}
				}
			}
			function ifBig(x,y,n){
				var ansIfBig=1;
				for (var ii=x+(-1)*r;ii<=x+r;ii++){
					for (var jj=y+(-1)*r;jj<=y+r;jj++){
						if(boolEachColor[n][ii][jj]==""){ansIfBig=0;}
					}
				}
				return ansIfBig;
			}
			return ansBig;
		}*/
		/*
		function getHoleS(n){//获取第n个数字的孔洞面积
			var holeS=0,backS=0;
			backS=getBackS(n);
			function getBackS(n){//填充背景矩阵并获得背景面积
				//var boolBackGet=Raw.slice();
				var boolBackGet=Array.from(Raw);
				var ansBackS=0;
				expandBack(0,0,n);
				function expandBack(i,j,n){//使用递归由一点拓展到整个背景
					boolBackGet[i][j]=11;
					ansBackS++;
					var iplus=[1,-1,0,0];
					var jplus=[0,0,1,-1];
					for(var m=0;m<=3;m+=1){
						var ii=i+iplus[m];
						var jj=j+jplus[m];
						if(0<=ii&&ii<=130-1&&0<=jj&&jj<=50-1&&boolBackGet[ii][jj]==""){
							if(boolEachColor[n][ii][jj]==""||boolEachColor[n][ii][jj]==ee){
								expandBack(ii,jj,n);
							}
						}
					}
				}
				return ansBackS;
			}
			console.log("SHole:"+holeS);//for test
			holeS=130*50-backS-mainS[n];
			return holeS;
			for (var i=0;i<=130-1;i++){
				for (var j=0;j<=50-1;j++){
					if (boolEachGet[n][i][j]==""&&boolEachColor[n][i][j]==""){
					}
				}
			}
		}*/

		var finalAns=[0,0,0,0,0];
		function getAns(n){
			if(mainS[n]<=83&&hole[n]==0){return 1;}
			if(85<=mainS[n]&&mainS[n]<=100&&hole[n]==0){return 7;}
			if(110<=mainS[n]&&mainS[n]<=119&&hole[n]==0){return 3;}
			if(121<=mainS[n]&&mainS[n]<=130){return which245();}
			if(131<=mainS[n]&&mainS[n]<=150){return which0689();}

			function which245(){
				if(hole[n]==1){return 4;}
				if(hole[n]==0){return which25v3ByVect();}//-choose-
				function which25v1(){//main:模糊方案
					if(115<=mainS[n]&&mainS[n]<=125){return 2;}
					if(126<=mainS[n]&&mainS[n]<=130){return 5;}
				}
				function which25v2(){//main:刷新以求准确方案
					if(115<=mainS[n]&&mainS[n]<=123){return 2;}
					if(127<=mainS[n]&&mainS[n]<=130){return 5;}
					return -1;
				}
				function which25v3ByVect(){//vect:观察半天输出得到的参数界定 still not good enough
					if((vector[n][0]>0.09&&vector[n][1]<0.06)||(vector[n][0]<-0.06&&vector[n][1]<-0.1)||vector[n][1]<-0.6||vector[n][0]>0.68){return 2;}
					else return 5;
				}
				return -1;
			}

			function which0689(){
				if(hole[n]==2){return 8;}
				if(hole[n]==1){return which069();}
				function which069(){//通过特征矢量方向判断
					//getHoleS(n);
					if(holeS[n]>=40){return 0;}
					if(5<=holeS[n]&&holeS[n]<=25){return which69ByVectSign();}
					function which69ByVectSign(){
						if(vector[n][0]>0&&vector[n][1]<0){return 9;}
						if(vector[n][0]<0&&vector[n][1]>0){return 6;}
						return -1;
					}
					return -1;
				}
				return -1;
			}

			return -1;//说明错误：自动刷新
		}
		for(var index6=1;index6<=4;index6++){
			finalAns[index6]=getAns(index6);
			if(finalAns[index6]==-1){refresh();return;}//如果出错则刷新
		}


		//特征数据流
		console.log("Main: "+mainS[1]+" "+mainS[2]+" "+mainS[3]+" "+mainS[4]);//输出4个数字的main面积
		console.log("Edge: "+edgeS[1]+" "+edgeS[2]+" "+edgeS[3]+" "+edgeS[4]);//输出4个数字的edge面积
		console.log("Hole: "+hole[1]+" "+hole[2]+" "+hole[3]+" "+hole[4]);//输出4个数字的hole
		console.log("HoleS: "+holeS[1]+" "+holeS[2]+" "+holeS[3]+" "+holeS[4]);//输出4个数字的hole面积
		//console.log("Big: "+big[1]+" "+big[2]+" "+big[3]+" "+big[4]);//输出4个数字的big
		for(var index4=1;index4<=4;index4++){
			console.log("Vect"+index4+":"+vectLength[index4]+"|"+vector[index4]);
		}
		console.log("Code: "+finalAns[1]+" "+finalAns[2]+" "+finalAns[3]+" "+finalAns[4]);//输出4个数字
		//console.log(boolEachColor);//for test
		//console.log(boolColor);//for test
        //console.log(boolGet);//for test
        //console.log(boolTest);//for test

		$('input[name=verify]').val(""+finalAns[1]+finalAns[2]+finalAns[3]+finalAns[4]);

		console.log("----------------------------");

		function refresh(){//刷新验证码并且递归
			$('#checkpic').trigger("click");
			setTimeout (function ()
			{
				Main();
			}, 500);
		}


		setTimeout (function ()//每3秒自动刷新并且循环一次
		{
			refresh();
		}, 2000);


		/*
		for(var i=0; i<=4*6500-1; i += 4){
			//imgData.length
			imgArr.push(imgData[i], imgData[i+1], imgData[i+2]);
			boolColor.push(imgData[i]);
            if(imgData[i]!=243)
			{
                console.log(i+" "+imgData[i]);
            }
		}*/
		//感悟：要想提高准确性就得不断获取新的特征以区分(当然刷新也是个方法)
	}
})();