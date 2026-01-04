// ==UserScript==
// @name         微信公众号推文图片一键下载
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  一键下载微信公众号推文内的图片到本地保存
// @author       Ray++
// @match        https://mp.weixin.qq.com/s/*
// @match        https://mp.weixin.qq.com/s?__biz=*
// @require      http://libs.baidu.com/jquery/1.9.0/jquery.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @resource Bootstrap http://libs.baidu.com/bootstrap/3.1.1/css/bootstrap.min.css
// @downloadURL https://update.greasyfork.org/scripts/40583/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8E%A8%E6%96%87%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/40583/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8E%A8%E6%96%87%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


var body_data={
			"isuse":1,
			"title":"",
			"copyright":"",
			"post_date":"",
			"post_user":"",
			"post_auth":"",
			"js_content":"",
			"wx_code":"",
			"wx_desc":"",
			"imgs":Array(),
            "imgs_tag":Array()
			};


function dl(m)
{
        var ext=".jpg";
        if (body_data.imgs[m].indexOf('wx_fmt=gif')>0 || body_data.imgs[m].indexOf('mmbiz_gif')>0)  {	ext=".gif"; }
        if (body_data.imgs[m].indexOf('wx_fmt=png')>0 || body_data.imgs[m].indexOf('mmbiz_png')>0)  {	ext=".png"; }
        if (body_data.imgs[m].indexOf('wx_fmt=bmp')>0 || body_data.imgs[m].indexOf('mmbiz_bmp')>0)  {	ext=".bmp"; }

        var fn=body_data.title+m.toString()+ext;

GM_xmlhttpRequest({
		method: 'GET',
		url: body_data.imgs[m],
    responseType: 'blob',
    onload:function (xhr) {
        var blobURL=window.URL.createObjectURL(xhr.response);
        if (body_data.imgs_tag[m]==1)
        {
         download_a = document.querySelector('.download_a');
         download_a.href = blobURL;
	     download_a.setAttribute('download', fn);
         download_a.click();
         window.URL.revokeObjectURL(blobURL);
         body_data.imgs_tag[m]=0;

         if (m<(body_data.imgs.length-1)) {
                   m++;
                   dl(m);
                   $("#cnum")[0].innerText=m+"/"+body_data.imgs.length;
             }
         else
           {
               $("#cnum")[0].innerText="";
           }
        }
    }
      });
}




function download_fn(){
    dl(0);
}

(function() {
    'use strict';
var Bootstrap=GM_getResourceText("Bootstrap");
GM_addStyle(Bootstrap);

    var $btn1=$('<button class="btn btn-success" id="btn1"><small>一键下载所有图片</small> <span id=cnum></span></button><a class="download_a" style="display:none;" download=""></a>');


    $btn1.click(download_fn);
    $("#img-content").prepend($btn1);

var getElm = document.getElementsByTagName("title");
body_data.title=getElm[0].innerText;
var gs=$("#js_content")[0].getElementsByTagName("img");
var imgs=Array();
var imgs_tag=Array();
for (var i=0;i<gs.length;i++)
	{
		if (gs[i].dataset.src) {imgs.push(gs[i].dataset.src);}
		else if (gs[i].src)
			{
				var tmp=gs[i].src;
				tmp=tmp.replace("//res.wx.qq.com/mmbizwap","http://res.wx.qq.com/mmbizwap");
				imgs.push(tmp);
			}
        imgs_tag.push(1);
	}
body_data.imgs=imgs;
body_data.imgs_tag=imgs_tag;
//$("#cnum")[0].innerText=imgs.length;
//console.log(body_data);

    // Your code here...
})();