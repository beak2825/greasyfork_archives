// ==UserScript==
// @name       1688 图片获取脚本
// @namespace    http://detail.1688.com/offer
// @version      1.01
// @description   获取1688产品缩略、分类及详情图片
// @author       Richard He
// @homepage     https://www.greasyfork.org/users/89556
// @iconURL      http://www.xuebalib.cn/userjs/icon.ico
// @resource css http://www.xuebalib.cn/userjs/css.css
// @match        https://detail.1688.com/offer/*
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/26016/1688%20%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/26016/1688%20%E5%9B%BE%E7%89%87%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
	 GM_addStyle(GM_getResourceText('css'));
	
    //缩略图获取部分开始
    var but = document.createElement('div');
    but.style.width = '380px';
    but.innerText = '请手动将所有缩略图显示后再点击';
    but.id = 'but';
	 but.className = 'classButton';
    but.onclick = function(){getImg();};
    document.getElementsByClassName('region-detail-gallery')[0].appendChild(but);
    function getImg()
	 {
    document.getElementById('but').style.display = "none";
    //获取原图地址
    var tri = document.getElementsByClassName('tab-trigger');
    var count = tri.length;
    for(var i=0;i<count;i++)
    {
        var thumb1 = tri[i].childNodes[1].childNodes[1].childNodes[1];
        var arr;
        arr = thumb1.src.split(".");
        if(i<5)
        arr.splice(-2,1);
        else{
        var suffix = arr[arr.length-2];
        var temp = suffix.substring(0,suffix.length-1);
        arr.splice(-3,3);
        arr.push(temp);
        }
        var addr = arr.join(".");

        var buttonR = document.createElement('span');
        buttonR.onclick = function()
		   {
			 var tit = this.title.split("-"); 
			 GM_download(tit[0],"S"+tit[1]+tit[0].substr(-4,4));
		   };
		  buttonR.title = addr+'-'+(i+1);
        buttonR.innerHTML = i+1;
        buttonR.className = 'classButton';
        buttonR.style.width = '32px';
        buttonR.style.float = 'left';
        buttonR.style.margin = '2px 2px';
        document.getElementsByClassName('region-detail-gallery')[0].appendChild(buttonR);
    }
    }
    
    //分类图开始
    var objLeading = document.getElementsByClassName('obj-leading')[0];
    if(typeof(objLeading) != 'undefined')
    {
        var wrapper = document.createElement('div');
        wrapper.className = 'obj-leading';
        objLeading.parentNode.insertBefore(wrapper,objLeading.nextSibling);

        var objHeader = document.createElement('div');
        objHeader.className = 'obj-header';
        objHeader.innerText = '下载';
        wrapper.appendChild(objHeader);

        var objContent = document.createElement('div');
        objContent.className = 'obj-content';
        wrapper.appendChild(objContent);

        var listLeading = document.createElement('ul');
        listLeading.className = 'list-leading comBut';
        listLeading.innerText = '等待分类图片显示完毕点击此处';
        listLeading.style.cursor = 'pointer';
        listLeading.onclick = function (){ this.innerText = '';getCat();};
        objContent.appendChild(listLeading);

        function getCat()
        {
            var lis = objLeading.childNodes[3].childNodes[1].childNodes;
            var srcs = new Array();
            lis.forEach(function(val,ind,lis){if(val.nodeName == "LI")srcs.push(val.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].src);});

            for(var i=0;i<srcs.length;i++)
            {
                var temp;
                temp = srcs[i].split('.');
                temp.splice(-2,1);
                srcs[i] = temp.join('.');
                var li = document.createElement('li');
				     listLeading.appendChild(li);
				     var but = document.createElement('button');
				     but.className = 'classButton';
				     but.innerHTML = i+1;
				     but.style.width = '32px';
				     but.title = srcs[i]+"-"+(i+1);
				     but.onclick = function()
					 {
						 var tp = this.title.split("-");
						 GM_download(tp[0],"F"+tp[1]+tp[0].substr(-4,4));
					 };
              li.appendChild(but);

            }
        }
    }
	
    //获取详情图
    var buttonC = document.createElement('button');
    buttonC.onclick = function() 
    {
        var desc = document.getElementById('desc-lazyload-container');
        var imgSrcs = desc.getElementsByTagName('img');
		GM_notification({
			text:'本次将下载 '+imgSrcs.length+ ' 张图片',
			title:'友情提示',timeout:3000},function()
		   {
			for(var j=0;j<imgSrcs.length;j++)
			{
				
                GM_download(imgSrcs[j].src,"X"+(j+1)+imgSrcs[j].src.substr(-4,4));
			}
		   });  
       
    };
    buttonC.innerHTML = '获取详情页';
    buttonC.className = 'comBut butX';
    buttonC.style.bottom = '0px';
    document.body.appendChild(buttonC);
    
    //图片加边框
    var buttonD= document.createElement('button');
    buttonD.onclick = function() 
    {
        var desc = document.getElementById('desc-lazyload-container');
        var imgSrcs = desc.getElementsByTagName('img');
        for(var h=0;h<imgSrcs.length;h++)
        {
          imgSrcs[h].style.borderTop = '4px solid red';
          imgSrcs[h].style.borderBottom = '4px solid red';
        }
    };
    buttonD.innerHTML = '图片加边框';
    buttonD.style.bottom = '40px';
    buttonD.className = 'comBut butX';
    document.body.appendChild(buttonD);
})();