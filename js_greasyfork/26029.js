// ==UserScript==
// @name			淘宝 图片获取脚本
// @namespace		https://item.taobao.com/
// @license         MIT
// @version			2.31
// @description		淘宝缩略图、首图视频、分类图、详情图下载 ##分类图会将已经无货下架的分类也显示出来 开发环境:Chrome:66.0.3359.170 x64 不保证兼容其他类型浏览器
// @author			Richard He
// @homepage		http://www.greasyfork.org/users/89556
// @match           https://item.taobao.com/*
// @iconURL         https://img.alicdn.com/favicon.ico
// @grant           GM_notification
// @grant           GM_addStyle
// @grant           GM_download
// @downloadURL https://update.greasyfork.org/scripts/26029/%E6%B7%98%E5%AE%9D%20%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/26029/%E6%B7%98%E5%AE%9D%20%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
	//last edit:2018-5-16 0622
	//Jshint Options
	/*jshint multistr:true */

	//Document Css Style
	GM_addStyle('\
	.thumb-ul{\
		font-family:Arial;\
		font-weight:bold;\
	}\
	.thumb-ul li{\
		border-style:solid;\
		border-color:#FE4403!important;\
		font-family:Arial;\
		font-weight:bold;\
		font-size:16px;\
		cursor:pointer;\
	}\
	.cat-ul li{\
		cursor:pointer;\
		font-size:14px;\
		font-family:Arial;\
	}\
	.detail-li,.border-li{\
		width:40px!important;\
		padding:0px!important;\
	}\
	.tb-tabbar>li{\
		min-width:80px!important;\
	}\
	');

	//Global Varible
	var d = document;
	var paramsObj = {}; //store all the parameters in url
	var params = location.search.substr(1).split('&');
        var Seq;
	for(var i=0;i<params.length;i++)
	{
		paramsObj[params[i].split('=')[0]] = unescape(params[i].split('=')[1]);
	}

   //下载缩略图及首图视频
	document.onreadystatechange = function()
	{
		var thumbVideoExist = 0;
		var thumbVideoSrc = '';
		var ulThumb = d.createElement('ul');
		ulThumb.className = 'tb-thumb tb-clearfix thumb-ul';
		var liThumb,divThumb,aThumb;
		d.getElementsByClassName('tb-gallery')[0].appendChild(ulThumb);
		if(d.getElementById('J_VideoThumb')!=null)
		{
			thumbVideoExist = 1;
		}
		var videoStart = d.getElementsByClassName('vjs-center-start')[0];
		if(!!videoStart)
		{
		  videoStart.click(); //click to load video src
		}
		var lis = d.getElementById('J_UlThumb').getElementsByTagName('li');
		var tSrc = [];
		for(var i = 0;i<lis.length;i++)
		{
			if(thumbVideoExist==1&&i==0)
			{
				tSrc[i] = "https://gtms01.alicdn.com/tps/i1/TB1QqhrFVXXXXb4XFXXrWC4HVXX-96-126.png";
			}
			else
			{
				tSrc[i] = lis[i].getElementsByTagName('img')[0].src;
			    if(tSrc[i].indexOf('SS2')<0)
		    	{
		    		tSrc[i] = tSrc[i].substr(0,tSrc[i].length-16);
		    	}
		    	else
		    	{
			    	tSrc[i] = tSrc[i].substr(0,tSrc[i].length-16)+'_800x800'+tSrc[i].substr(tSrc[i].length-10,4);
		    	}
			}
			liThumb = d.createElement('li');
			ulThumb.appendChild(liThumb);
			divThumb = d.createElement('div');
			divThumb.className = 'tb-pic tb-s50';
			divThumb.style.textAlign = "center";
			liThumb.appendChild(divThumb);
			aThumb = d.createElement('IMG');
			aThumb.src = tSrc[i];
			aThumb.style.margin = "0 auto";
			aThumb.title = i+1;
			aThumb.setAttribute('data',tSrc[i]);
			divThumb.appendChild(aThumb);
			aThumb.onclick = function()
			{
				if(thumbVideoExist==1&&(parseInt(this.innerText)-1)==0)
				{
					GM_notification('此项目为商品首图视频','温馨提示');
					GM_download('https:'+d.getElementsByTagName('video')[0].getAttribute('src'),paramsObj.id+'视频');
				}
				else
				{
                                        Seq = this.title < 10 ? "0" + this.title : this.title;
					GM_download(this.getAttribute('data'),"S" + paramsObj.id.substr(-2,2) + Seq);
				}
			};
			aThumb.onmouseover = function()
			{
				lis[parseInt(this.innerText)-1].className = 'tb-selected';

			};
			aThumb.onmouseout = function()
			{
				lis[parseInt(this.innerText)-1].className = '';
			};
		}
	};

	//下载图片 分类图片
	var catDl = d.getElementsByClassName('J_Prop_Color')[0];
	if(catDl!=undefined)
	{
		var imgExist = 0;
		var aExist = catDl.getElementsByTagName('a');
		if(aExist!=undefined)
		{
			for(var j =0;j<catDl.getElementsByTagName('a').length;j++)
			{
				if(catDl.getElementsByTagName('a')[j].style.backgroundImage!= '')
				{
					imgExist =1;
				}
			}
			if(imgExist>0)
			{
				var catImages =[];
				var dlCat,dtCat,ddCat,ulCat,liCat,aCat,imgCat;
				dlCat = d.createElement('dl');
				dlCat.className = 'tb-prop tb-clear J_Prop_Color';
				catDl.parentNode.insertBefore(dlCat,catDl.nextSibling);
				dtCat = d.createElement('dt');
				dtCat.className = 'tb-property-type';
				dlCat.appendChild(dtCat);
				dtCat.innerText = '分类下载';
				ddCat = d.createElement('dd');
				dlCat.appendChild(ddCat);
				ulCat = d.createElement('ul');
				ulCat.className = 'J_TSaleProp tb-img tb-clearfix cat-ul';
				ddCat.appendChild(ulCat);
				var bgImg;
				for(var k=0;k<aExist.length;k++)
				{
					bgImg = aExist[k].style.backgroundImage;
					if(bgImg != '')
					{
						catImages[k] ='https:'+bgImg.substr(5,bgImg.length-17);
					}
					else
					{
						catImages[k] = 0;
					}
					liCat = d.createElement('li');
					ulCat.appendChild(liCat);
					aCat = d.createElement('a');
					liCat.appendChild(aCat);
                    imgCat = d.createElement('IMG');
                    aCat.appendChild(imgCat);
					aCat.data = catImages[k];
					aCat.innerText = k+1;
                    imgCat.src = catImages[k]; 
                    imgCat.style.width = "30px";
                    imgCat.style.height = "30px";
					aCat.onmouseover = function()
					{
						if(this.data != 0)
						{catDl.getElementsByTagName('li')[this.innerText-1].className = 'tb-selected';}
						else
						{catDl.getElementsByTagName('li')[this.innerText-1].className += ' tb-selected';}
					};
					aCat.onmouseout = function()
					{
						if(this.data != 0)
						{catDl.getElementsByTagName('li')[this.innerText-1].className = '';}
						else
						{catDl.getElementsByTagName('li')[this.innerText-1].className = 'tb-txt';}
					};
					aCat.onclick = function()
					{
						if(this.data == 0)
						{
							GM_notification('请注意：这个分类没有图片','温馨提示');
						}
						else
                        {
                           Seq = this.innerText < 10 ? "0" + this.innerText : this.innerText;
							GM_download(this.data,"F" + paramsObj.id.substr(-2,2) + Seq + this.data.substr(-4,4));
						}
					};
				}
			}
		}
	}

	 //获取商品 详情图

	 var imgAdrs = [];
	 var detailLi = d.createElement('li');
	 detailLi.className = 'detail-li';
	 var detailA = d.createElement('a');
	 detailA.onclick = function()
	 {
		 var desLis = document.getElementById('J_DivItemDesc').childNodes;
		 var des = document.getElementById('J_DivItemDesc');
		 var imgs = des.getElementsByTagName('img');
		 for(var i in imgs)
		 {
			 if(typeof imgs[i] == 'object' && imgs[i].src.indexOf('assets')<0)
			 {
				 imgAdrs.push(imgs[i].src);
			 }
		 }
         for(var j in imgAdrs)
		{
                 Seq = parseInt(j) + 1;
                 Seq = Seq < 10 ? "0" + Seq : Seq;
				 GM_download(imgAdrs[j],"X" + paramsObj.id.substr(-2,2) + Seq);
		 }
	 };
	 detailA.innerText = '下载';
	 detailA.href = '###';
	 detailA.className = 'tb-tab-anchor';
	 detailA.title = '注意：点击之前先将页面下拉，使得所有图片完全显示完毕再点击下载按钮，否则将下载一些不完整的图片';
	 detailLi.appendChild(detailA);
	 document.getElementById('J_TabBar').insertBefore(detailLi,document.getElementById('J_ServiceTab').nextSibling);

	 //图片加边框
	 var borderLi = d.createElement('li');
	 var detailImagesObj = d.getElementById('J_DivItemDesc').getElementsByTagName('img');
	 borderLi.className = 'border-li';
	 var borderA = d.createElement('a');
	 borderA.setAttribute('borderAdded',0);
	 borderLi.appendChild(borderA);
	 borderA.onclick = function()
	 {
		 if(this.getAttribute('borderAdded') == 0)
		 {
			 for(var i in detailImagesObj)
			 {
				 if(typeof detailImagesObj[i] == 'object' && detailImagesObj[i].src.indexOf('assets')<0)
				 {
					 detailImagesObj[i].style.borderBottom = '20px solid #F12D03';
					 }
			 }
			 this.setAttribute('borderAdded',1);
			 this.innerText = '去框';
		 }
		 else
		 {
			 this.setAttribute('borderAdded',0);
			 for(var j in detailImagesObj)
			 {
				 if(typeof detailImagesObj[j] == 'object' && detailImagesObj[j].src.indexOf('assets')<0)
					 detailImagesObj[j].style.borderBottom = '0px solid #F12D03';
			 }
			 this.innerText = '加框';
		 }
	 };
	 borderA.className = 'tb-tab-anchor';
	 borderA.href = '###';
	 borderA.innerHTML = '加框';
	 borderA.title = '单击一次：给详情图每张图片下方添加20像素宽红色边框；再次单击：取消边框';
	 document.getElementById('J_TabBar').insertBefore(borderLi,document.getElementById('J_ServiceTab').nextSibling);
