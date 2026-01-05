// ==UserScript==
// @id             tumblrEPB
// @name           Tumblr Easy Page Browsing
// @description    Now it works on all tumblr blogs even if not with a tumblr domain. Adds a draggable navigation panel that contains buttons for newer page, older page, home and archive. The script stores the position of the panel. 
// @include        *
// @exclude        *://www.tumblr.com/*
// @version        0.3.3
// @namespace https://greasyfork.org/users/2459
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/2205/Tumblr%20Easy%20Page%20Browsing.user.js
// @updateURL https://update.greasyfork.org/scripts/2205/Tumblr%20Easy%20Page%20Browsing.meta.js
// ==/UserScript==


function linked(url) {
  return document.querySelector('a[href="'+ url +'"]');
}

//add css for button
function init_css()
{
	GM_addStyle(
	
		'@font-face {' +
		'font-family: "fontawesomeregular";' +
		'src: url(data:application/font-woff2;charset=utf-8;base64,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) format("woff2"),' +
		'url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAw0AA8AAAAAEgQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABWAAAABwAAAAcad82lEdERUYAAAF0AAAAHQAAACAATAAET1MvMgAAAZQAAABAAAAAYIs3dtRjbWFwAAAB1AAAAIcAAAGyDjv8xmN2dCAAAAJcAAAABAAAAAQARAURZ2FzcAAAAmAAAAAIAAAACP//AANnbHlmAAACaAAABqMAAAic3q2g92hlYWQAAAkMAAAAMAAAADYL1gjxaGhlYQAACTwAAAAeAAAAJA7fBtJobXR4AAAJXAAAAE8AAAB8gTcBfmxvY2EAAAmsAAAAJwAAAEAM+g7cbWF4cAAACdQAAAAfAAAAIABoALduYW1lAAAJ9AAAAZ8AAAOIM0mFunBvc3QAAAuUAAAAlwAAAUafcylPd2ViZgAADCwAAAAGAAAABi5FVioAAAABAAAAAMw9os8AAAAAy1G1AAAAAADST97EeNpjYGRgYOADYgkGEGBiYARCOSBmAfMYAAWUAFEAAAB42mNgZslinMDAysDCasRyloGBYSaEZgJixkMMeEBBZVExgwODwscJbLf/3WZgYLvD6AsUZkRSosDACAB6Cw0CeNpjYGBgZoBgGQZGBhBYA+QxgvksDBOAtAIQsoDpBQpcCvoK8ap/PrB8EP3g/SHxw9IPKz+2f+z6OOH/f6gKBiQVXh8SgCpWwFT8f/w/5QHr/Yf3N90SE+Dn/89/mn87fwl/Ed9Uvsl8fVDb8QJGNga4MkYmIMGErgDilaEBWMjSBQBYvjHpAABEBREAAAAB//8AAnjabVVrbBxXFb73zuwdeyfehz2P9cZ79+HZ52zWZB+zSbzriMaJu6s6NjhrDFEa5FaRC/WCUKElVFABESC3VFlTBPxIpaB2FVWJYgtiRGglHn/4QUtREJbWAimg0rgCgZAqJdkdc+64raomu9Kde87cc893v3vON4igSYTIo64GEpCEcmsYjVXWJRH9K79GXVuVdYHAFK0J3O3i7nWJ4m5lHXN/wR/1x6P+6CSJ2Ab+kb3katx5ZVL8A0IIow/99jv2TrMP0RoaQUiMJXFOLBVRNM+IPiEUIkhV+rHIKkqvvCe5MGnhGEZTq8+cTKdPPrM6hRGO2Xd6B1oKuepOLX/p4vRdPJKfq6dS9bm8/Y+7XXj5STgGCiEkzbquoyFUgpR+hY4COn80lij5i1apH2txiUqjsWQ/psnEGE5YZWzldVepaI3jvKb6dYZpzWR2zd6ya8zE5Dw5j9HOlNsjePu7t7q3Bjwe95RbkAXLOGNgXfFt+ZQ7skiavQ4s37AhmMSxC5NQ7++k3pBJH/lB7/F+TOSGzNzkMmPbf/Opqs/O/dHNkMPTys6y1KR1NAyGBRgUmsSJ5O6jWHZcVlk6pDGmdf8siyGte0PThKwWEmV6SBtgt5fZgCaYsty94Uy0cT4MsO4NWd7l/TH6ID2OwIBjO0zoWFNo7s5gMJEIuv4dJL/o/tyjMrrKVA/MzF1ctZ0A7dABFAFD5UxCkBdTYA8nShxYIR8Gl4SjeY12apVuB8+Y5nymWsn2ApkMeTtbGc/Om6a9JsQrNdJpVRv21fTT6U/Bu1t8FflnNnvCPAsL5ndxBmgL8kXBgF0h0ZhDANxeFRetQpSnPczTAnzayvQC7yXAM92tSr1eEQx7DQBkx2HrtzOkNZHhOOYhA55pVFvVeTybnqim57OAL8XPKHxQk2V0GD2BULzgH43lSDLh/HPiaIyqCiNqlD+1QtQDROh86gyF/AQxiokYVbT8kFNrMQlQJw47/CSSMC1x3M6YZ4Ku6UwqcLbihpGqT2VG3eLcPneUqOpwoP8TZ2KZWK956NML4/isX68oqZj4hUceWv9OG6+YlWy28mqjam8c+dXW8xd/j/FRISH++qnLV57Erwz/8nmzZiVy3vg0CQzsHdyrBty4Vm20yNbeipmSXadq3gnRTGaDR6f3f3b8AX3h0PiCMhmaORjbl5kbGjEWT+WsnJPCJFs9o9o4MrP+Ip3/8nDggWNXnvrK5aPHV36cqh97ODC+QEa8Ib8+0N+AXgPuoD5qyEBFuLFSMTEaLVulIlzaaEzCEjAUxhhIgivj3mjeQj5CxYiRIL5By4iImmvDZL3fbGrakhKOKPbikqIs4QtKJKwsqeommYCOMla27ev2T+zr76ysvIOP4jP46DZprTJzUwsxiHOieIC9CMFqmKmbJg7ygO2Vle3dAB56D15AxIFCQXOccMEhzG94FzagLuOyZXwU76sqzwNYIfFm77fMhG6vbqqqAwFfWFIxux/eTljl51KcZZsm4/BVBk7FCXrzPnChNms7TWkD8MpoL+ItyQnmtQYVtKtsu6rGC2roI7bYAQ3b4vCwwchrJrt9jRu0zkwQqNuGY8B7QaqYcPE4fneDu0SQPBPftDtOZBxGkFPg7YL0LvSljDQ0ClK+gJbROa5V0CNUopquWeX35jDVqZjM4fIE1kEIc9iQKAJRFcsWiiseAmzmoFQGyxME4iTKsHWYK7DG92GCwLDkwRBuJRMShT1hZy2uDYKTbwpZcvh9vygIAS2V+ExgWE2kTp7r6/P5on1DMV/sjaJtf+PsKav0n6/ONXU8KV+zO23bvuqTN3C8beMZPHvipS37L/Zr9uv/e+HF1unXf/ZCpl4Qqd9PpQvvFgsFtz84dqJunvhYSOsrFIf79EL+wZExFw2NTH4X7Twyvk8+GA4zdyQ9NfW7R8MHJMmIPIdVHEnN+P3heGJ2cDC07mPUNeAxvHTP559oplN/Wv7cY2H1i99fal6a9QXt/7adJ/ZenP7pD5+ceuh7b37t2zjdOv3sMZKpveQDogg5cqz2zeBQnzc3eZqcLz378eCwLx+cOlD2UjYykqNe81zT/uu3wiG3fCD88BvTx6sq4AiXJTb/gbY59R5EaXTwfQ3nw4cEXAtx9daLBMobqlzkknZPl8Z1j91UfQMee9Xtxk3Z69Fxy6Nfe9m+aV+xb7bbmF36+lvtRfiU3Vv8Qq3j0Ts+dQ9+3O3zu/GyrHs6+tOXMGu3d+NfXmy/hfffpwf+Dws1DMEAeNpjYGRgYGBhZNvD43cunt/mK4M8BwMIXPK/dwRB/5fgYGDzA3I5GJhAogA5Uwq6eNpjYGRgYLvzbzMDAwcDA8P//0ASKIIC5AF6KwTDAAB42mN6w+DCAARMq4CYAYKZNRkY2IIQNJM0AwPjFCDmhWCGU0DaGUhHQmiQHJM1AwMHUIg9l0EWiLvZPIF6bzN4AjFYHERD2Z4wPgDNyQ0sAHjaY2Bg0CECmjCkMRxg+MDIw+jCWMckw1TCdIZZgPkNix8A0iwI6gB42mNgZGBgkGdoY2BnAAEmIGZkAIk5MOiBBAAUGwEgAHjajVE9SwNBEH13iZooBAUJYnWFWFgkl2hAgk0wxFJRULAQLsnlg3xcTKJia2lpbeUvEH+Fxs5CsPGHWPl2bhMvcoIsu/N2Z+bNm1kAS3hDBEY0DuCM28cGkrz52EQCQ40jSOFG4yjW8ajxDNbwrvEsc780nsODsahxDCvGk8ZxLBsjjRewYXxqnMCOGdP4GUmzqPELbPNU4xFi5q3Gr5g373z8EcGqeY9deOjhGn00UUeDyi0U4eASLtEeURdV+i1kYSODHDuyUECbywpkDeTm0rq0KrvKyBLZu/QWcCU+Dx3aQ+46LsjgMNavPkCeDOHx+Un17B8R1i/OY1ExoDoVbWGLWtS2A32EMx2QwSXHQFhVRzXhshjpydkQT9jcVE6FaFy1RtsP5NR0RfXSZ40qXzuit8U3h69D4Suzjx+WLq26VUSlP9O+sEwrD/u1hnD2OME017i+M5WXkkr/j0xzQr6arnScxgnPcqC7jEy6JL1Y2JeZqLlv8rSxzRo5rjzv2cB/tMjiUoEneYqrNGE8wjln0qRH/Uj7G1JfjTEAeNp9zbkOwjAQBFBPAoT7vs9fWJs4R2mQ/CuAhBANBX+PgoeWbV4zM6si9f8OSiFCrGLUUEcDCZpooY0OuuihjwGGGGGMCaaYYY4FllhhjQ222GHfuNzfz6sOmOT1uIk4qTQiPzU19EhTamlGc1rQkrqg8UEbtP5c6bnnRdtg6ugpmAnVQcecK+j3j9dFTkNfl/IBr3xBXQAAAVYqLkQAAA==) format("woff"),' +
		'url("fontawesome-webfont.ttf") format("truetype"),' +
		'url("fontawesome-webfont.svg#fontawesomeregular") format("svg");' +
		'font-weight: normal;' +
		'font-style: normal;' +
		'}' +
	
		
		'*.btn-tumblr_no-older { '+
		'position:absolute !important;'+
		'top:5px; !important;'+
		'left:95px;!important;'+
		'display: block !important;'+
		'}'+
		
		'*.btn-tumblr_no-newer { '+
		'position:absolute !important;'+
		'top:5px !important;'+
		'left:5px !important;'+
		'display: block !important;'+
		'}'+	
		
		'*.btn-tumblr_no-home { '+
		'position:absolute !important;'+
		'top:95px; !important;'+
		'left:5px;!important;'+
		'display: block !important;'+
		'}'+

		'*.btn-tumblr_no-archive { '+
		'position:absolute !important;'+
		'top:95px; !important;'+
		'left:95px;!important;'+
		'display: block !important;'+
		'}'+
			
		'.thoughtbot a:link { color: #fff!important; text-decoration: none !important; background: none !important;box-sizing: content-box !important;}'+
		'.thoughtbot a:hover { color: #fff !important; text-decoration: none !important; background: none !important;box-sizing: content-box !important;}'+
		'.thoughtbot a:active { color: #fff !important; text-decoration: none !important; background: none !important;box-sizing: content-box !important;}'+
		'.thoughtbot a:visited { color: #fff !important; text-decoration: none !important; background: none !important;box-sizing: content-box !important;}'+
		
		'.thoughtbot {'+
		'background-color: #ee432e;'+
		'background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ee432e), color-stop(50%, #c63929), color-stop(50%, #b51700), color-stop(100%, #891100));'+
		'background-image: -webkit-linear-gradient(top, #ee432e 0%, #c63929 50%, #b51700 50%, #891100 100%);'+
		'background-image: -moz-linear-gradient(top, #ee432e 0%, #c63929 50%, #b51700 50%, #891100 100%);'+
		'background-image: -ms-linear-gradient(top, #ee432e 0%, #c63929 50%, #b51700 50%, #891100 100%);'+
		'background-image: -o-linear-gradient(top, #ee432e 0%, #c63929 50%, #b51700 50%, #891100 100%);'+
		'background-image: linear-gradient(top, #ee432e 0%, #c63929 50%, #b51700 50%, #891100 100%);'+
		'border: 1px solid #951100;'+
		'border-radius: 5px;'+
		'-webkit-box-shadow: inset 0px 0px 0px 1px rgba(255, 115, 100, 0.4), 0 1px 3px #333333;'+
		'box-shadow: inset 0px 0px 0px 1px rgba(255, 115, 100, 0.4), 0 1px 3px #333333;'+
		'color: #fff !important;'+
		'box-sizing: content-box !important;'+
		'font-size: 80px !important;'+
		'font-family: "fontawesomeregular", normal !important;'+
		'padding: 0px 0px 0px 0px !important;'+
		'margin: 0 !important;'+
		'text-align: center !important;'+
		'text-shadow: 0 -1px 1px rgba(19,65,88,.8);'+
		'line-height: 100% !important;'+
		'min-width: 80px !important;'+
		'min-height: 80px !important;'+
		'}'+
		
		'.thoughtbot:hover {'+
			'background-color: #f37873;'+
			'background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f37873), color-stop(50%, #db504d), color-stop(50%, #cb0500), color-stop(100%, #a20601));'+
			'background-image: -webkit-linear-gradient(top, #f37873 0%, #db504d 50%, #cb0500 50%, #a20601 100%);'+
			'background-image: -moz-linear-gradient(top, #f37873 0%, #db504d 50%, #cb0500 50%, #a20601 100%);'+
			'background-image: -ms-linear-gradient(top, #f37873 0%, #db504d 50%, #cb0500 50%, #a20601 100%);'+
			'background-image: -o-linear-gradient(top, #f37873 0%, #db504d 50%, #cb0500 50%, #a20601 100%);'+
			'background-image: linear-gradient(top, #f37873 0%, #db504d 50%, #cb0500 50%, #a20601 100%);'+
			'cursor: pointer;' +
		   '}'+
			
		'.thoughtbot:active {'+
			'background-color: #d43c28;'+
			'background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d43c28), color-stop(50%, #ad3224), color-stop(50%, #9c1500), color-stop(100%, #700d00));'+
			'background-image: -webkit-linear-gradient(top, #d43c28 0%, #ad3224 50%, #9c1500 50%, #700d00 100%);'+
			'background-image: -moz-linear-gradient(top, #d43c28 0%, #ad3224 50%, #9c1500 50%, #700d00 100%);'+
			'background-image: -ms-linear-gradient(top, #d43c28 0%, #ad3224 50%, #9c1500 50%, #700d00 100%);'+
			'background-image: -o-linear-gradient(top, #d43c28 0%, #ad3224 50%, #9c1500 50%, #700d00 100%);'+
			'background-image: linear-gradient(top, #d43c28 0%, #ad3224 50%, #9c1500 50%, #700d00 100%);'+
			'-webkit-box-shadow: inset 0px 0px 0px 1px rgba(255, 115, 100, 0.4);'+
			'box-shadow: inset 0px 0px 0px 1px rgba(255, 115, 100, 0.4);' +
		   '}'
	);
}

function CreateNavPanel(){
	
	init_css();

// DRAGGABLE BOX
// Credit to JoeSimmons
// http://userscripts-mirror.org/scripts/show/47608
// OPTIONS ///////////////////////////////////////////////////////////////
var Navbox_style = 'border:4px ridge #550000 !important; box-sizing: content-box !important; padding:0  !important; margin: 0 !important; width:182px !important; height:182px !important; text-align:center; cursor:move;';
//////////////////////////////////////////////////////////////////////////

	
var dragObj = new Object(), x, y;

var ObjLeft = GM_getValue('styleLeft', 100);
var ObjTop = GM_getValue('styleTop', 100);

var SetLeft;
var SetTop;

if (GM_getValue('styleLeft', 100)==null) {ObjLeft=100};
if (GM_getValue('styleTop', 100)==null) {ObjTop=100};

dragObj.zIndex = 9999;
var NavPanel = document.createElement('div');
NavPanel.setAttribute('id', 'NavPanel_draggable_box');
NavPanel.setAttribute('style', 'z-index:9999 !important; position:fixed; top:'+ ObjTop +'px !important; left:'+ ObjLeft +'px!important; border-radius:6px; '+(Navbox_style?Navbox_style:''));
NavPanel.addEventListener('mousedown', function(e){dragStart(e);}, false);
document.body.insertBefore(NavPanel, document.body.firstChild);

function dragStart(e) {
dragObj.elNode = e.target;
if (dragObj.elNode.nodeType == 3) dragObj.elNode = dragObj.elNode.parentNode;
dragObj.cursorStartX = e.clientX + window.scrollX;
dragObj.cursorStartY = e.clientY + window.scrollY;
dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
dragObj.elNode.style.zIndex = ++dragObj.zIndex;
document.addEventListener("mousemove", dragGo,   true);
document.addEventListener("mouseup",   dragStop, true);
e.preventDefault();
}

function dragGo(e) {
e.preventDefault();
var xxx = e.clientX + window.scrollX,
	yyy = e.clientY + window.scrollY;
dragObj.elNode.style.left = (dragObj.elStartLeft + xxx - dragObj.cursorStartX) + "px";
dragObj.elNode.style.top = (dragObj.elStartTop  + yyy - dragObj.cursorStartY) + "px";
SetLeft=(dragObj.elStartLeft + xxx - dragObj.cursorStartX);
SetTop=(dragObj.elStartTop  + yyy - dragObj.cursorStartY);
}

function dragStop(e) {
if (!(isNaN(SetLeft) && isNaN(SetTop))){
GM_setValue("styleLeft", SetLeft);
GM_setValue("styleTop", SetTop );
}

document.removeEventListener("mousemove", dragGo,   true);
document.removeEventListener("mouseup",   dragStop, true);
}

//********** Button	*************


		var older
			, newer
			, path = location.pathname
			, base = '/page/'
			, baseN = '/page/null'
			, noLinkpage = false
			, pagenone = linked(baseN)
			, page = path.match('^/page/(\\d+)')
		  , sitepage;
	

		if (page) page = Number(page[1]);
		else 
		if ('/' === path) page = 1;
		
		if (page) {
		
		var newid = page - 1;
		var oldid = page + 1;
		
		if ((older = linked(base + oldid))) older=older.href;
		if ((newer = linked(base + newid))) newer=newer.href;
		
		if (older == pagenone && newer == pagenone) noLinkpage=true;
		
		var uriNewer = '/page/'+ newid;
		var uriOlder = '/page/'+ oldid;
		var uriHome = 'http://' + location.host;
		var uriArchive = 'http://' + location.host + '/archive';
			
			
		var textNewer = '\uf0a8';
		var textOlder = '\uf0a9';
		var textHome =  '\uf015';
		var textArchive = '\uf187';
	
			
		var newerElem = document.createElement('p');
		newerElem.classList.add('thoughtbot');
		newerElem.classList.add('btn-tumblr_no-newer');
		newerElem.innerHTML ='<a href="' + uriNewer + '">'+ textNewer +'</a>';
		
		var olderElem = document.createElement('p');
		olderElem.classList.add('thoughtbot');
		olderElem.classList.add('btn-tumblr_no-older');
		olderElem.innerHTML ='<a href="' + uriOlder + '">'+ textOlder +'</a>';

		var homeElem = document.createElement('p');
		homeElem.classList.add('thoughtbot');
		homeElem.classList.add('btn-tumblr_no-home');
		homeElem.innerHTML ='<a href="' + uriHome + '">'+ textHome +'</a>';

	  var archiveElem = document.createElement('p');
		archiveElem.classList.add('thoughtbot');
		archiveElem.classList.add('btn-tumblr_no-archive');
		archiveElem.innerHTML ='<a href="' + uriArchive + '">'+ textArchive +'</a>';
			
	
	if (page!= 1) NavPanel.appendChild(homeElem);
	NavPanel.appendChild(archiveElem);
	
	if (noLinkpage)NavPanel.appendChild(olderElem);
		else 
		if (older != pagenone) NavPanel.appendChild(olderElem);
		if (page!= 1) NavPanel.appendChild(newerElem);
			

}	

}	


function start_tumblrEPB()
{
	if((frameElement )||(! document.getElementById('tumblr_controls')) && document.getElementsByClassName('tmblr-iframe').length==0 ){ return; }
	else
	CreateNavPanel();
}

function getMetaContent(propName) {
    var metas = document.getElementsByTagName('meta');
    for (i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("property") == propName) {
		return metas[i].getAttribute("content");

		}
    }
    return "";
	} 

(function testTumblr() 
{   
		var target = getMetaContent('og:type');
        if (target =="tumblr-feed:tumblelog")
        {
        start_tumblrEPB();
        }
})();