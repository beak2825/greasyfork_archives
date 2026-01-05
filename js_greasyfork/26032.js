// ==UserScript==
// @name         天猫 图片获取脚本
// @namespace    https://www.tmall.com
// @version	 1.29
// @description	 下载天猫缩略图，分类图以及详情图
// @author       Richard He
// @homepage     https://www.greasyfork.org/users/89556
// @iconURL      https://img.alicdn.com/tfs/TB1XlF3RpXXXXc6XXXXXXXXXXXX-16-16.png
// @match        https://detail.tmall.com/*
// @match        https://detail.tmall.hk/*
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant	 GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/26032/%E5%A4%A9%E7%8C%AB%20%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/26032/%E5%A4%A9%E7%8C%AB%20%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
	//match example url
	//1. https://detail.tmall.com/item.htm?id=559254305797
	/*jshint multistr:true */
	//CSS Style
	GM_addStyle('\
	/* style for thumbs */\
	.thumbUlOverride li{\
		padding-top:0px!important;\
	}\
	.thumbUlOverride li a {\
		border:2px solid #000;\
		width:56px!important;\
		height:56px!important;\
		font-size:22px;\
		font-family:Arial;\
		font-weight:bold;\
		color:#FE0335!important;\
		line-height:56px!important;\
	}\
	.img-down li a{\
		font-family:Arial;\
		cursor:pointer;\
		color:#FE0335;\
		font-weight:bold;\
		font-size:16px;\
	}\
	.cat-ul{\
    \
	}\
	.cat-ul li{\
		line-height:28px;\
		float:left;\
		position:relative;\
		margin:0 4px 4px 0;\
		vertical-align:middle;\
		padding:1px;\
		list-style:none;\
	}\
	.cat-ul li a{\
		width:38px!important;\
		height:38px;\
		padding:0px;\
		line-height:38px;\
		outline:0;\
		font-family:Arial;\
		color:#FE0335;\
		font-weight:bolder;\
	}\
	');
	//Vars needed
	var paramsObj = {}; //store all the parameters in url
	var params = location.search.substr(1).split('&');
	for(var i=0;i<params.length;i++)
	{
		paramsObj[params[i].split('=')[0]] = unescape(params[i].split('=')[1]);
	}
   //下载商品 缩略图
   var d = document;
	var thumbList = d.getElementById('J_UlThumb');
	var imgAddress = [];
	var imgSrc = '';
    var Seq;
	var thumbUl,thumbLi,thumbA;
	thumbUl = d.createElement('ul');
	thumbUl.className = 'tb-thumb tm-clear thumbUlOverride';
	d.getElementsByClassName('tb-gallery')[0].appendChild(thumbUl);
	for(var i=0;i<thumbList.getElementsByTagName('li').length;i++)
	{
		imgSrc = thumbList.getElementsByTagName('li')[i].getElementsByTagName('a')[0].getElementsByTagName('img')[0].src;
		imgAddress[i] = imgSrc.substr(0,imgSrc.length-13);
            //生成按钮
					thumbLi = d.createElement('li');
					thumbA = d.createElement('IMG');
					thumbA.src = imgAddress[i];
                    thumbA.style.cursor = "pointer";
					thumbA.title = i+1;
					thumbA.onmouseover = function()
					{
						thumbList.getElementsByTagName('li')[this.title-1].className = 'tb-selected';
					};
					thumbA.onmouseout = function()
					{
						thumbList.getElementsByTagName('li')[this.title-1].className = 'tb-thumb tm-clear';
					};
					thumbA.onclick = function()
					{
                      Seq = parseInt(this.title);
                      Seq = Seq < 10 ? "0" + Seq : Seq;
                      GM_download(this.src,"S" + paramsObj.id.substr(-2,2) + Seq + this.src.substr(-4,4));
					};
					thumbUl.appendChild(thumbLi);
					thumbLi.appendChild(thumbA);
	}


	//下载商品 颜色分类图
	var catImage = d.getElementsByClassName('tb-img')[0];
	var jAmount = d.getElementById('J_Amount');
	var catWrapperDl,catWrapperDt,catWrapperDd,catWrapperUl,catWrapperLi;
	var catImageList = [];
	var bgImage = '';
	var catA;
	if(jAmount.nodeName == 'DD'&&typeof(catImage)!='undefined'&&document.getElementsByClassName('tb-img')[0].childNodes[1].childNodes[1].style.backgroundImage.indexOf('url')>=0)
	{
		catWrapperDl = d.createElement('dl');
		catWrapperDt = d.createElement('dt');
		catWrapperUl = d.createElement('ul');
		catWrapperLi = d.createElement('li');
		jAmount.parentNode.parentNode.insertBefore(catWrapperDl,jAmount.parentNode);
		catWrapperDl.appendChild(catWrapperDt);
		catWrapperDd = d.createElement('dd');
		catWrapperDl.appendChild(catWrapperDd);
		catWrapperDd.appendChild(catWrapperUl);
		catWrapperDl.className = 'tb-prop';
		catWrapperDt.className = 'tb-metatit';
		catWrapperDt.innerHTML = '天猫图片<br/>分类下载';
		catWrapperUl.className = 'cat-ul';
		for(var i=0;i<catImage.getElementsByTagName('li').length;i++)
		{
			bgImage = catImage.getElementsByTagName('li')[i].getElementsByTagName('a')[0].style.backgroundImage;
			catImageList[i] = 'http:'+bgImage.substr(5,bgImage.length-20);

			catWrapperLi = d.createElement('li');
			catA = d.createElement('a');
			catA.href = '#';
			catA.data = catImageList[i];
			catA.innerText = i+1;
			catA.onmouseover = function()
			{
				catImage.getElementsByTagName('li')[this.innerText-1].className = 'tb-selected';
			};
			catA.onmouseout = function()
			{
				catImage.getElementsByTagName('li')[this.innerText-1].className = '';
			};
			catA.onclick = function()
			{
                Seq = this.innerText;
                Seq = Seq < 10 ? "0" + Seq : Seq;
				GM_download(this.data,"F" + paramsObj.id.substr(-2,2) + Seq);
			};
			catWrapperUl.appendChild(catWrapperLi);
			catWrapperLi.appendChild(catA);
		}
		catWrapperLi = d.createElement('li');
		catA = d.createElement('a');
		catA.href = '#';
		catA.innerText = '全';
		catA.title = '点击下载全部分类图片';
		catA.onclick = function()
		{
			for(var i=0;i<catImage.getElementsByTagName('li').length;i++)
			{ console.log(i);
				GM_download(catImageList[i],paramsObj.id+'分类图'+(i+1));
			}
		}
		catWrapperUl.appendChild(catWrapperLi);
		catWrapperLi.appendChild(catA);
	}


	//下载 商品详情图 可给图片加边框以方便下载单个图片
	var imgAdrs =[];
    var Seq;
	var jTabBar = d.getElementById('J_TabBar');
	var detailLi = d.createElement('li');
	var detailA = d.createElement('a');
	detailLi.appendChild(detailA);
	jTabBar.insertBefore(detailLi,d.getElementsByClassName('tm-qrcode-icon')[0]);
	detailA.href = '#description';
                detailA.onclick = function() {
                    detailLi.className = 'tm-selected';
                    var desLis = d.getElementsByClassName('ke-post')[0].childNodes;
                    if (typeof (desLis[0]) != 'undefined') {
                        for (var l = 0; l < desLis.length; l++) {
                            if (desLis[l].nodeName == 'IMG') {} else if (desLis[l].childNodes.length > 0) {
                                for (var m = 0; m < desLis[l].childNodes.length; m++) {
                                    if (desLis[l].childNodes[m].nodeName == 'IMG')
                                        imgAdrs.push(desLis[l].childNodes[m].src);
                                }
                            }
                        }
                        GM_notification('本次将下载 ' + imgAdrs.length + ' 张图片，点击此处下载', '友情提示');
                        for (var k = 0; k < imgAdrs.length; k++) {
                            Seq = k + 1;
                            Seq = Seq < 10 ? '0'+ Seq : Seq;
                            GM_download(imgAdrs[k], "X"+paramsObj.id.substr(-2,2) + Seq + imgAdrs[k].substr(-4, 4));
                        }
                    }
                }                ;
			detailA.innerHTML = '下载详情图';
			detailA.title = '请注意，下载详情图之前请先将所有详情图片显示完毕再点击此按钮下载，否则会出现下载不完整等问题';

	//图片加边框
	var borderLi = d.createElement('li');
	var borderA= d.createElement('a');
   borderLi.appendChild(borderA);
	jTabBar.insertBefore(borderLi,d.getElementsByClassName('tm-qrcode-icon')[0]);
	borderA.href="javascript:void(0)";
	borderLi.onclick = function()
	{
		borderLi.className = 'tm-selected';
		var desLis = d.getElementsByClassName('ke-post')[0].childNodes;
		if(typeof(desLis[0])!='undefined')
		{
			for(var i=0;i<desLis.length;i++)
			{//console.log(desLis[i]);
				if((desLis[i].align == "absmiddle"|desLis[i].alt!='')&&desLis[i].nodeName == 'IMG') //filter other images and elements
				{
					desLis[i].style.borderTop = '8px solid #000';
					desLis[i].style.borderBottom = '8px solid #000';
				}
				else if(desLis[i].childNodes.length>0)
				{
					for(var j=0;j<desLis[i].childNodes.length;j++)
					{
						if(desLis[i].childNodes[j].nodeName == 'IMG')
							desLis[i].childNodes[j].style.borderTop = '8px solid #000';
							desLis[i].childNodes[j].style.borderBottom = '8px solid #000';
					}
				}
				else
				{
				}
			}
		}
    };
		borderA.innerHTML = '详情图加框';
		borderA.title = '点击后每一张单独的图片上下会添加黑色边框，便于单张或多张选择下载';
