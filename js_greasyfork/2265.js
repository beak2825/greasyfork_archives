// ==UserScript==
// @name        Kronos MCAnime Plus+
// @namespace   Zeyth
// @description Agrega funciones extras a Kronos [Auto Actualizar Notificaciones, Feeds, Ultimas Respuestas y Temas, Ver Perfiles Privados, etc...]
// @include     http://kronos.mcanime.net/*
// @grant		none
// @version     3.2.0
// @downloadURL https://update.greasyfork.org/scripts/2265/Kronos%20MCAnime%20Plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/2265/Kronos%20MCAnime%20Plus%2B.meta.js
// ==/UserScript==

//Global
title = document.title;
url = window.location.href;
version = '3.1.1';
plusfeed = '0';

//Limitador
function limit() {
	overload = false;
	var l1 = getCookie('Load1');
	var l2 = getCookie('Load2');
	var l3 = getCookie('Load3');
	if(l3 && l2 && l1){
		overload = true;
		lc = false;
	}
	else if(l2 && l1){
		limitset('Load3');
		lc = 3;
	}
	else if(l1){
		limitset('Load2');
		lc = 2;
	}
	else if(!l1){
		limitset('Load1');
		lc = 1;
	}
	if(getCookie('NoLimit') || typeof(opera) != 'undefined')
	{
		overload = false;
		lc = 4;
	}
}

function limitset(zx) {
	setCookie2(zx,'ON',900000,'kronos.mcanime.net');
		$(window).unload(function() {
			setCookie(zx,'OFF',-1,'kronos.mcanime.net');
		});
}

function op() {
var a = window.location.href;
a = a.indexOf('foro') + a.indexOf('enciclopedia') + a.indexOf('descarga') + a.indexOf('group') + a.indexOf('fansubs') + a.indexOf('noticias') + a.indexOf('recomendacion') + a.indexOf('lista') + a.indexOf('manga');
return a;
}

//CSS Limit
$("head").append('<style type="text/css" charset="utf-8">#main-menu { position:relative !important; } #overload { height:28px; width:24px; position:absolute; right:-27px !important; z-index:1000 !important; } #overload.over:before { content:""; display:block; background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMDEvMTMXm/pjAAACdklEQVQ4jW2STUhUURiGn3vvzGiItUjKUigisaZIF0aLAiuzIJvxZ8xqo9bGNi2iRbt2UQgSQRSVbQzEStsMJqIiBJYVSn9qIk6TOOOoyZTjOOOdmXNazL2TmS988J7vnO/9/o4CkA+cABTDNABwALVJSgvgTgDSsF5gHLA0ACr/wQHU3jl/vZpEnKsvmky/2yTHgaOAVrQqs2FOCXV3Xdeql9+7ifkmcBTX2F+Nf7ABUSNxqpK1Ak6grqn8iuvXUCdxJHEkkYAHx8Ez9m7PpzRTZD2BcqC+sexy1dxwFzEpOJ11iJYNObiWplj6OUVZQcnevqmxdCAqDRGz/XIB9bdO1lX6h93oQkcXOpFIkEgkmDrPTQ5yo6i0UkA9yYRYgAoBF28XX3D6P3enphhGMj09xPLyAh052cRk0m8NjFKzv7Ci7etHFVAsAi7dPOJyzHzrByCiCIZtKj7NQjjgAyBk/bueKNAbnudY/k5n37hXsQhQZTQEwKyi89ZmJQKQSKSC1FXcxGIcBKjaAYj2+Cc3Ht6Vl9e7sgRSYjWsMc9Ow7bt/AgFUz6rlGxV4Y030CXgiVYIYxKiA3OBTVVZGbt9egxVClQpODvh4dGMn1MZtpQvE8mgb6EbaFbgpcWoqCMByoPv8+q57MxSb0L+U256Ik5y4pKB+XAP0KxBh7kFE+0ClNZASK3YnF7yG/DY9wDQM+sFoH8h2qfAYxXazSCt0CASEDCqw8qXSHzLvjRlhzcUxBsKoklJZ1B/LeChBs9V4wMpawUkEIMRHfSRqMgtsJKrSsmzxcQ7AfdVaLMYwabA6hZSkNAaB/VpSJj39yzQut7bP+bEHHEXktkCAAAAAElFTkSuQmCC); width:24px; height:24px; background-position:center; background-repeat:no-repeat; } #overload.kon:before { content:""; display:block; background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMDEvMTMXm/pjAAACh0lEQVQ4jW2TS0iUURTHf/d+Y2LQKoxCwVoUErawTS9IMENCHJ8RuVATe4iLFhYmtouIoFUPKxQRKXtpUUbRw6ByoZFJpWakZurk6Gj5nPmcme/eFuNMTnbgLu655/8/53/POQJg3RZI2A9CAAKQAKQD+QSsHmhGARq0hq57MPoZRHIlyAgQMowgHcgvqRjIlXi5ci6+EahH0Rwk0AqUL5gr3OwoCkorenNnzZNMm5WUVLTloigA7P8GGxt2gzAC2YXADhSUlHfkjE9X4vdZ+H0Wbs9bkpIvbH7feisSMIGvLFaxtIIMrSk8cuJ19rDrFKZpUpsWR21aHKZpMuy6RNHxa9laUwhkBEEyBFYUFpc9yhpwVmJ6PZheD273OG73eOg+NHmDg6Wns7T6S2IDMpWPQ0fL6+z9o2dD5cx7LAYHW5mbm6DzXQzaE/CLqJskpmZkdjx+KAFhw6Iov7wq/dvYVQA8po+h4RmmHRYzMz8BmJ1aInQBvkx9ImbHNrujtV3YlEJq5QTAOTmLo38an1uEf7X0LWvVgppCKaRIKiMbKE45lrevo+0VeklQwtYUALo+vAwDR642GGtxPAVqRFIZaIsc4HB8XmKq6/tIKPDBARcAWXeiQ76IVeB87noGVAuDJtuiv0n5ET31nXJTfszeOed8WMaIqIAEaVOMPJl5AdRIG03BLgStUVuI3lqH3Fi8co/3F5wZCgxeT29Awo/77hYhqBYGjUGQsX4nBKdKK3qsBRZcbb410dtF3MTvPiam+hA2RV+d+UYrrguDu0Iu7o5cToDy0u038Y63W7FrdxErDU33RX+79lMlDW6HFm/xLJUQMg0Nyov8eN4Kvl+WK2j4X+wfVf8krO5nIqkAAAAASUVORK5CYII=); width:24px; height:24px; background-position:center; background-repeat:no-repeat; } #overload.forzed:before { content:""; display:block; background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlpJREFUeNpsU89rE0EU/mY2xqonsejBgwcRDyJGUqTeLAVLUxttEtGD1B+0f4V48ebFk5dgUai1tE0C0cT+MCm0BgKhteRiWq3oodAmIUXT1DWb7Ow6M8vGkObBx+yb977vvX2PIeA2codg5C5AKUCIBW6DHMOwbJwjZpqAgGEAY1Mc0yZIKkSgUIvcJCDJ7huZAEwDnz9cDQsRTo7ZAgKMg+KgeXnSffdAOsBK82C7H+H2LAXEnYi1JtO2ZM+yXyvEoeuahFbkIn2z/nYizQI3eVsP3P0Jn7rzjhOrePK8JiG+1WISl3unfCJH5LYKSHJXf3xofzsKxjSJcrksYftqKQXXteBQs4gY4i1+Puz2RLz7hYVGO3VWx/Xba8jn80jGXTAYsyoqCo53uvBj5dl77r52GAyPugfeDlby8zJBN+r4re1Crf9BNpu1xBQNUCxhBh3FXxmcujTs3VkbJw6+CmrqqgyqOm9ZK4CZTK7UNoXqB1ZlGHtijZTyzl6l4qNz5NhpVGpboETDIU4QKBWeSti+jQ7nEWytROcElyTeED4g+Lno6MWee33q/nqjyrkLq/Lc/NL1f230MDYzaTGsl3wcEbvRCBcZyyYnEkc7OhuVbLN9J2XYSKcTIldwRMzR9FthHiCriwv0Sk9Xr2GoqJQey8DeblSeq8u5RWJVDjfmM+wjaDwSE7lq1dR+fts+efb8iTP1ag4ClBhYml3/xAsEHQ4yQ5veDj04XUyrfxGMhTYyCmEQiIW+ZsSdiLXmO9o8JtHNZK0GOjPx3Y6/cDox2S73nwADAOk2P6jHeNmxAAAAAElFTkSuQmCC); width:24px; height:24px; background-position:center; background-repeat:no-repeat; } #overload a, #overload .active { color:#C9FF26 !important; } #overload b { color:orange !important; } #overload span { color:#CCCCCC !important; } #overload strong { color:#CCCCCC !important; } #overload div, #plusupdatetop div { position:absolute !important; width:200px !important; background:#333333!important; border:1px solid #444444 !important; top:26px; left:-90px; padding:5px 8px !important; text-align:center;} #plusupdatetop { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlpJREFUeNpsU89rE0EU/mY2xqonsejBgwcRDyJGUqTeLAVLUxttEtGD1B+0f4V48ebFk5dgUai1tE0C0cT+MCm0BgKhteRiWq3oodAmIUXT1DWb7Ow6M8vGkObBx+yb977vvX2PIeA2codg5C5AKUCIBW6DHMOwbJwjZpqAgGEAY1Mc0yZIKkSgUIvcJCDJ7huZAEwDnz9cDQsRTo7ZAgKMg+KgeXnSffdAOsBK82C7H+H2LAXEnYi1JtO2ZM+yXyvEoeuahFbkIn2z/nYizQI3eVsP3P0Jn7rzjhOrePK8JiG+1WISl3unfCJH5LYKSHJXf3xofzsKxjSJcrksYftqKQXXteBQs4gY4i1+Puz2RLz7hYVGO3VWx/Xba8jn80jGXTAYsyoqCo53uvBj5dl77r52GAyPugfeDlby8zJBN+r4re1Crf9BNpu1xBQNUCxhBh3FXxmcujTs3VkbJw6+CmrqqgyqOm9ZK4CZTK7UNoXqB1ZlGHtijZTyzl6l4qNz5NhpVGpboETDIU4QKBWeSti+jQ7nEWytROcElyTeED4g+Lno6MWee33q/nqjyrkLq/Lc/NL1f230MDYzaTGsl3wcEbvRCBcZyyYnEkc7OhuVbLN9J2XYSKcTIldwRMzR9FthHiCriwv0Sk9Xr2GoqJQey8DeblSeq8u5RWJVDjfmM+wjaDwSE7lq1dR+fts+efb8iTP1ag4ClBhYml3/xAsEHQ4yQ5veDj04XUyrfxGMhTYyCmEQiIW+ZsSdiLXmO9o8JtHNZK0GOjPx3Y6/cDox2S73nwADAOk2P6jHeNmxAAAAAElFTkSuQmCC"); background-position: center center; background-repeat: no-repeat; content: ""; display: block; height: 28px; margin-top:-2px !important; margin-left:1px !important; position:relative !important; z-index:1000 !important; } #plusupdatetop a:hover { background-color:transparent !important; } #wrapper fieldset.topre { border-radius:0 !important; margin-top:18px !important; padding-top:6px !important; } #wrapper fieldset.topre h4 { font-size:11px !important; background:#292F21 !important; position:absolute !Important; top:-12px !important; left:15px !important; padding:3px 10px !important; }</style>');

//Radio Page [Descontinuado, lo dejo como referencia]
//if(url.indexOf('/radioplus') > 0){
radiopage = false;
if(radiopage == true) {
	var rset = 'https://stream.r-a-d.io/main.mp3?stream';
	var rrequest = 'http://r-a-d.io/search';
	var mcr = 'Radio: R/a/dio';
	if(!getCookie('sradio')) {
		mcr = 'Radio: MCAnime';
		rset = 'http://66.90.111.10:8000/;stream.nsv';
		rrequest = 'http://mcanimeradio.com/Pedidos/web/';
	}
	var tr = '<title>' + mcr + '</title>'
	$('head').append(tr)
	$('html').attr('style','background:url(http://i.imgur.com/8SOGAjs.png) !important; background-position:center !important; background-size:cover !important;');
	$('html').attr('id','pradio');
	$('body').html('<div style="width:300px; margin:0 auto 0 auto;"><embed width="300" height="20" flashvars="type=mp3&amp;file=' + rset + '&amp;autostart=true&amp;backcolor=0x0000000&amp;frontcolor=0xFFFFFF" quality="high" name="radio" src="http://www.shoutcheap.com/flashplayer/player.swf" type="application/x-shockwave-flash" id="radioplayer" wmode="opaque" /></div><iframe src="' + rrequest + '" style="display:block; width:1050px; height:92%; margin:8px auto 0 auto; border:0; opacity:0.9 !important;" seamless></iframe> ');
}

//Cookies
function setCookie(c_name,value,exdays,domain)
{
	var d = new Date();
	var exd = d.getDate() + parseInt(exdays,10);
	d.setDate(exd); 
	var c_value = escape(value) + ((exdays==null) ? "" : ";expires=" + d.toUTCString());
	document.cookie = c_name + "=" + c_value + ";domain=" + domain + ";path=/";
}

function setCookie2(c_name,value,milisec,domain)
{
	var d = new Date();
	var exd = d.getTime() + parseInt(milisec,10);
	d.setTime(exd);
	var c_value = escape(value) + ((milisec==null) ? "" : ";expires=" + d.toUTCString());
	document.cookie = c_name + "=" + c_value + ";domain=" + domain + ";path=/";
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies = document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x = x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
};

function KronosPlus() {
	cop = navigator.userAgent.indexOf("Opera") ? 'top:-2px;' : 'top:0px;';

	//CSS
	$("head").append('<style type="text/css" charset="utf-8">/* Latest Replies & Expand */.daily-releases > .series-releases > div {padding:0px !important;} .daily-releases { margin: 0 auto 0 auto !important; border: 1px solid #638D20 !important; margin-bottom: 4px !important; margin-top:0px !important; padding:0px !important; background-color: #EDF7DC !important; } .daily-releases > .series-releases {  margin: 0 auto 0 auto !important; margin-top:0px !important; padding:0px !important; } .daily-releases > .series-releases > div { margin:5px !important;} .daily-releases > .mcbox-title { background-color:#292F21 !Important; color:#BCE27F !Important; font-weight:bold !Important; padding:3px 0px 4px 5px !Important; margin:0px !important;} .daily-releases > .series-releases > .anime-releases { margin-bottom:0px !important;} .daily-releases > .series-releases > .manga-releases {margin-top:-5px !important;} #sidebar span.sm {display:block !important; margin-bottom:2px !important;}/* Search */.gsc-completion-container { min-width:190px !important; } .gssb_a > div[style] { display:none !important; } div.ua-search { min-width:200px !important; } #customsearch > div[id] { padding:5px 8px 0px 8px !important; } span#customswitch { cursor:pointer !important; display:block; text-align:center !important; height:auto !important; margin-top:-5px !important; } #customresults { position:absolute !important; display:none; right:0 !important; top:108% !important; width:650px !important; min-height:200px; max-height:500px !important; background:#FFFFFF !important; overflow:auto !important; border-radius:5px !important; } .gsc-search-button, .gsc-clear-button { display:none !important; } .gsc-search-box { padding:0 !important; } .gsc-control-cse { padding:5px 10px !important; } .gsc-result-info { margin:-5px 0 0 0 !important; } .gsc-resultsHeader { margin:0 !important; } /* Private */ #private { background:yellow; border:1px solid gold; color:black; text-align:center; padding:5px 0px; margin:-6px 0 5px 0; } /* Sidebar Profiles */ #WhereAmI + #particular_tweet { float:left; width:655px; } #WhereAmI + #particular_tweet #pComment { width:635px; margin-top:5px; } #particular_tweet + #sidebar { float:right; } /* CPanel */ #TopMenuScript { width:743px; background:red; height:34px; border:1px solid #2A2A2A; background:#414141; float:right; color:white; padding:0; font-family:Tahoma,helvetica,arial,sans-serif,corbel !Important; font-size:11px !important;} #TopMenuScript input, #TopMenuScript label { cursor:pointer; } #TopMenuScript input { margin-left:3px;; } #TopMenuScript label { position:relative;' + cop + ' margin-left:2px; } #TopMenuScript .sopt span { display:block; height:17px; } #TopMenuScript .sopt { float:left; position:relative; margin-right:3px; margin-top:2px; } #TopMenuScript .shelp { background:#555555; float:right; width:295px; height:30px; margin:2px; display:table; text-align:center; } #TopMenuScript .shelp > div { display:table-cell; vertical-align:middle; padding-bottom:1px; } #shide, #sshow { width:48px; height:32px; float:left; color:white; cursor:pointer; background-position:center; } #shide { background:url("data:image/png;base64,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"); } #sshow { background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAYAAABU1PscAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDIvMjgvMTO2JO09AAAHeUlEQVRYhb2Ya4xVVxXHf2vvc869MGMHHCkvpwUKIxUEkirh0QjYNGnsxGhDESYwAxfSUGPwg6mJaYx+sUY/2YmmmObeaUc6rVZrfLUaoxZHArWa2EhFaltJECiUYYbOg/s45yw/nHPvnDv3zjBlBtdkZU/2umef/3+ttddZe4uqMlNyICcAIrD+yYy+MmMLTyJmugtkItAAKAjwIPCH6a47VZkWgX05IZeJIpjJiQBfbZzb+CMgPQPYpiQ3TGBvTuiOwe/LiQM8sXBRyzfbN3bNFLYpiXMjD3XmhKdj8Htz0mCQ51qXrm1betsqzl37y4wCvJ6Y9i6Z0FjP1pEA35mTFkFe2bT6/rYlLUu4MPIqfjh608DWE6f3kJaB1qDtPTRWotq7hN5DSk8MviMnay3mpfs+sWchs87zbuFfKCUcY98XgC92C9/bV1sJd+eEFJDN1NoOdguH42ec9i6ZMARJW5nM7pyIwD1W7Auf25j5wDX3FFeLFzCEeDaFFbfy/EM5QSTyTFkZN5bB78wKQrQpReBIAvj+nETzgBEq4KF6DyTfAaDJsb1LRBpAhAOuTX9/x+ZO9z3zN675V7AiGJsiVIeQAsuXrjEP5SScyDHj3mF3ZsUAQeKdIeDsj0p0XVuSQBm4SajGPyyr4iEifKv1tnlfubv1Aa6Gx/H9IaxYjHFRdQnFZaT0DquWbWLN8nvFDwICQLCoWhSDYEAcFs26k54Xd1Xlx5aNiALHTtSm8+I1SDGEK69X28oELOACKcCLGRdj9UnjGCu5u1Z8ZOf6FZu5UjhOoMM4xsWqS6guSkxC8wwU3kTx4iUjlbKKi8GlkBqpCUfaEcJKYKrFNfVmIwI2Bt4ANDnGzPPD8CowBAxpipRxpHfb6i1bVi65lYFCHz4lrPEw6qHqxMBdEK9ChjIBdUFcwKmQMOJipbaC/7ZPNd4DNVjP/B2N90CVzcQuagCagQWOsR+1Yu4A5qvHOnGlb/uGPVtWL/sQg8Xj5IPz+OEgYTiKiOKYVEVtPLomhWM8rHhY4+GIhyPRnGM8rHExUlWtwhiLTWQD2YxiJrAlI+ACjcBcoFmgUYRAHZZJynztwNZH5jQ3X2Kg8DZiQowYSprH1yImKOEZi2saUE0Rxh7XchRkLIWiVzkIDiJOFYHn9iskMmR3TuhIVJ7uzFg5P9gtPNw9ZisTmB2TaFRwApdNxnP2fOm+x9ymORcZKl3BGhfXpPFNHj8soZQoBv34YYm0dUjZRTikUIlJEKWWSIKAOiAWg4NQ+73YPUnVOdhd11YJTTlpnaITfNKkZ+37+gM97vxbFZVClAYmjREPIxaRqGYjIcVwkCH/LfL+JQTBidPGSioePay4kRoXR1yMONiJPz8AdLa1StunGseXdgDmrUYa74yqZ3knKcm6rxpVC0lhxI09ZhCJNJLyuiHFYJDB4A2ggSavNapIEnucpNqKynX6SBs7q54kuZdDUiIqmSXPt31hIZ/7xk93lS5cUixNqIASohrpGOcx1oVggIHiaYb9i7HXo0gYcWN1YrUYuX4TnPvlSf3F768mHVuRS/9Ah09FTjcx+FFgGBgW8E2JY2Hef+S7L3753TPn8ng6n1Ah1CKhBqhq9HS8vGr0llH/IgOFf1MIhiKgRKlTAY9lsg7+SEYRqV91Du9TTK3NOrHnh4ErgFVoRrksJV5Xws9mX/52dseGjpW3L1zGiF6IN7DGJMp/EYFAfYaKZ0nbMyyw8zASpY1qBLw6dtUyrhfSnol7IX1iXC/kxxEA8EtBkA80HAWGpMSQGt32/Imeni2rN967dtnHGS39kVDzhKqxxhGINR++x+X8aRqc22nylkTVRgzhJEfv6fRCZWMhjsLlQMMzwDvAADAqBfrV17Y/nTz+g6Mn+5hj7sE1H0Rj8ElVhVCVoeIFLl87RTEYIZkyWvVPbRX6zFZPPr3VrVt5VtyFtKyraThx4uWCmJlPvWYuj4aufuG1t87+542zP3tsx+btJrC/oxheJNSAIEEiZZuZ461kTqqVW7wWGt0FhIk9E32yhCZvQQ2BQlAiqJmNpBSAX6e/LRPQmFky0FXtNCUUj+/kSyOne48+8+z2TbvTgdPHYHA23twQKMzzWnnt9DFG+48B3dc9DyTlRnuhJODqFjpByD+HPrNfFfh5oP62nxzr6XdGNzDXW4XI7EoU0k4zI/2EG/+LRFVuMq3k8mT9zqS9kOx6vIroeKdUCPQeGiO+JycItBjkpS1r7l+VnjvM+eG/MuIPc8ctbbzc96vwyYxO6Ww52ZHySJ3jJFQfKaV8M1fvAJ8E3d4l2Eb44diZGIG5BnnhY8vXbV28+MO8PdRHy+y7OfrnqROYtqgqux6PxvFab35PdmyuIwudWVJ7sxx+9DeLtPf05/XHb3bogSxBvfVuhprxnk5KvfmejNIZXyfG1ysF4OHz584/+uo/f83C1Pqb5eu6Ukmh9yt7c8JTiRzNRLcVD1pxnlb1vf9XCt3w1eJTY3eiAOSiQ8fzofrbgP6ZADcVmfbtdC6jxJ98shGJE8Dm6a47VfkfmP64MmKzllQAAAAASUVORK5CYII="); } #scont { overflow:auto; width:743px; } /* Radio */ #radio { float:right; margin-top:-23px; } #rhide, #rpop, #rrestore { display:inline-block !important; background:url(data:image/gif;base64,R0lGODlhEgASAKIHAHd3d93d3bu7u4iIiKqqqu7u7v///////yH5BAEAAAcALAAAAAASABIAAANReLrc/pCJR6AwVWJ3zVbdB3pkFRpFphCkx5LF4AxtG0NDUd8R7emyyOmnaoQKuhLnh8wxiwIdMiDLIQsBAIMwDR4GAay2QaA2wGNHcZGOuA8JADs=) !important; background-position:center !important; width:16px !important;; height:16px !important;; float:left !important; padding:0 !important; margin:2px 2px 0 0!important; cursor:pointer !important; } #rpop { background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABz0lEQVR4XpWSwW9MURSHv3tnRpF0Mv4AKwl/QGurbCglXTASBIlI2GAlZWmp7YRigZaVLUlXkokoe6ILVpqUhYWNNhHRdt59xzknL/EyTxd+ycm9Ob/vu6sbjnZY2choJYEA1CI0an4GSkk50kt+IsYF2FJnPpr85PwDZs/OMHfuPp32wwL6G8FF64xx1hx1x2MusJKW6X6+xqulK0y8uMzL6wz3veA77Ywx1h1zYwywKp9otCA24fQoHJ7kHX2xnXbGGOuOubEeYfHbR+YXYGAH1JtsEuucMdYdcznWQcamEGBo9DZyZBK/j9+B8lhvnTF+V8dcL2zOPMahklyZf7FBi/+KAIMD8HMdAhCB/SJgk/uwWbyT0gAHYspZ6CVkI4P1HmKju0qU835NR3my5NzrmBJMn3pECMjshXs8vThDL0NEKAIi+M66OWV+rSFT6pjrH+nD90u090F36So/smWE6k8UsM6ZEyOwqI650YHtkG+FPTuPc+PZXboTDIdAEdC7725qt1sZZd2B4ifWBqHRhC/Zc04e3MvYdOUn+q6t3VdllHXH3HDoFm/iNkbyHIK/qGXNz0Ap2ktKfiIFl//mrUG7gBbVvO9bDFHN6h9Zj/ig30lt1wAAAABJRU5ErkJggg==) !important; } #rrestore { background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjhJREFUeNqcUj1s00AUfj6fY9w2DBlQKB0qVSBQmXA7loUB6MDUBSliQupINtaIGaSy0TWKVCExIBZGRpZYtAK1ClWVtoIkSPmrG/+c7fPxbOevHqjEJz3dvbt73/vu7pPuvT4AWVGADkOW5QIArAkhNnEEx7IgjZBz4EEAge8DTe0VOOfFUeJ7HlwGMl2MjMXC+nU9YvYYiztdhkSBEHHx840l3TTDWBqimlaO0RqulzGOYwK866OoePPpHb1Ws0DTCDy5v6AnvADTI/M4a3Xs1f2j7oNAiBIufaE+So3QbLpg2z5IEsWHTIqmCTgX4DiBOkMz+dXla3Nfv/0qBWFYl5ZfGbjJC6ikuPH4btz5w+cfRvqu2hWqLOTnclmNzjtuQEIiN2tHnXck6SAqgce2dj5WDde2wGcukgYrYRiO49y01/drrZ0/fafRFQS4Iufw3Mr4FyISn3lb7z/tGp7LwB1YF34BSX7j/tuTk3bXv5qFnjqj4rk8PWu3o00MDhJIleG116JiyzRjw0RQMpnYcNgcOsosnk18QvtIEEEiBB9QAiLLFUwraQ9gfgNVvlBvLuYakgZZz2L4Aa2JE4XYxu76qGMaQs0oytJi7uzW7XkXZFBPG11UUKVTBfrDl8/0UxvAC5Nw+WQeIHsfc/xNmO21B87u3iH4fpkOXRfj8Bz94GK3SLK4OAqcKNaAKfV6z937/hMYKxFCjmk4UWAcvNn+l+3HVsYHLBNKYytLYmS3/8RfAQYAPjpdqK/T5bcAAAAASUVORK5CYII=) !important; } /* CPanel R2 */ #scont { height:34px !important; overflow:hidden !important; } .shelp { position:relative !important; } #stwo { clear:both !important; } #sbot, #stop { background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMjYvMTPwjJG6AAAAMUlEQVQYlWNgQAO5Nxn+595k+I8uzoQugAtQXyELNvcgA5g80SYyElJAuYm43Ey0iQC1tg2xUSJyMAAAAABJRU5ErkJggg==) !important; width:10px !important; height:10px !important; position:absolute !important; top:20px !important; left:-13px !important; cursor:pointer !important; padding:0 !important; } #TopMenuScript .shelp > div#stop { background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMjYvMTPwjJG6AAAAXUlEQVQYla2PwQ2AMAwDz1VngenoMDAdHabhU0RIK17cL4llOzIzPKXqvejkya4BcrMAFB0jpaoByqVKM8GxYt4k96iB7SQB5oUxOyYYoKHj3QlI+/Ic0+cnjv+FFz06Hua4XYPwAAAAAElFTkSuQmCC) !important; top:0px !important; display:none; } div#sbot {left:13px !important; top:10px !Important;} #rpop { float:right!important; position:relative!important; top:-33px !important; right:-13px !important; } #rhide { margin-right:23px !important; margin-top:1px !important; } /* Buzz */ @-webkit-keyframes buzz { 50% { -webkit-transform: translateX(3px) rotate(2deg); transform: translateX(3px) rotate(2deg); } 100% { -webkit-transform: translateX(-3px) rotate(-2deg); transform: translateX(-3px) rotate(-2deg); } } @keyframes buzz { 50% { -webkit-transform: translateX(3px) rotate(2deg); transform: translateX(3px) rotate(2deg); } 100% { -webkit-transform: translateX(-3px) rotate(-2deg); transform: translateX(-3px) rotate(-2deg); } } .buzz { display: inline-block; -webkit-transform: translateZ(0); transform: translateZ(0); box-shadow: 0 0 1px rgba(0, 0, 0, 0); } .buzz { -webkit-animation-name: buzz; animation-name: buzz; -webkit-animation-duration: 0.15s; animation-duration: 0.15s; -webkit-animation-timing-function: linear; animation-timing-function: linear; -webkit-animation-iteration-count: 15; animation-iteration-count: 15; } /* Buzz */ /* Overlay */ #overlayplus { position:fixed !important; bottom:10px !important; right:5px !important; z-index:1000 !important; height:106px !important; width:355px !important; overflow:hidden !important; } #live { background:rgba(0,0,0,0.6) !important; max-height:93px !important; padding:4px !important; width:342px !important; position:absolute!important; bottom:-121px; } #live a { color:#cccccc !important; font-family:Arial !important; } #live > div { background:rgba(0,0,0,0.8) !important; overflow:hidden !important; padding:5px !important; } #live .friend-avatar { display:block !important; float:left !important; margin-right:10px !important; width:50px !Important; height:auto !important; } #live .friend-name { font-weight:bold !important; color:white !important; } #overlayplus #liveclose { display:block !important; background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8yNy8xNLWEVkYAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAER0lEQVRIia2Vv4/UVhDHP+/Z3l17WXthc+KWvQIhRNJE10aJoOcoKSKdonBdLh0oJSnShCb8ERG6HlGdIgqElPRIaQKC7vZ0P3Tsj9Ou7X2/UmAb73HpMtLI1njefD3z5jsjQFCXweBK9T4c7tc/itrTFe/lk8HgiivOcI6IJR0MBoAQhXogfBANEE0QrZo2C7tf+JVnPokpzmZS+yoBr6ay0FJsoaamtsjO1fzwzwEog/uA325H3U6n852U8rYQ4ksgASbOub+ttbunp6c7s9l8DKhzwMqg4jyAAGisrl5+6Pv+T71ej263SxRFeJ6HMYb5fM54PObk5ASt9eODg8NHwKIGVgF5BUhZIh8IkiQedLvJo16v9+O1a9dIkgQApRR5nmOMwfd9ut0uvV4PrfXXUsq+73uv8jyfnS1ZHaTMoJkk8aN+v//9YDBAa02WZRhjsNbinMNaizGGxWKBEIKLFy8CrKdpmsxm8+cFwFImZZl8oLGy8tkvly5d+mF1dZX5fI5S6hOAEsRai9YapRRxHKOUWpdSePP5/M86SNF2eEAjisLVOI7f3bhxA2stSimccywWC5RStNtthBA450jTFCEErVYLIQRBECCE4M2bN0yn06tpmh0Xd2TKlpSA12q1vu10OlUQrTVBEHD//n22t7eZz+dkWUaWZWxvb/PgwQOklGitSdMUgDiOCcNws9b2yNqlS+fc7SiKyLIMrTVaa/I8Zzwes7KywtbWFlEUce/ePXq9HqPRCKVU5ZtlGVEU4Zy7XY8tQEigAYTdbvL6+vXrK0oprLUVeZrNJnfv3qXf71e24XDI06dPyfO8skkpCYKAt2/fHo3Hky+AFFgsgcRx53BtbS1I0xTnPpLWOUe73WZzc7Oy7ezsVPdSEU0IwjBkb29PTaenl0uQ+pjAOTfWWgNUXWStJc9zbt68SZ7nld66dYs0TZf8ALTWOOdG9bgliPsQ1/6jlEJKiXMO5xxSSjY2NojjmL29PZ49e8b+/j5JknDnzp0q09K3KPXregtLPrLTGmN2Z7MZQRAsHfR9n4ODA16+fMn79+958eIFh4eH+L6P53mVbxAEzGYzjDG7NRC3xBPP81YbjeDd2toaSimUUgAEQVCRrxTP8xBCUJY3CAJ832c4HLJYqKvGmIonJeMFIJxzCylFaIz5Ko5jtNYVu+uNUL+zEjAMQ05OTsiy/LHW+g8+DEoLOO/MPhHG2L+UUn1gvSRmOVLOSsn0VqvFaDRiMpk80Vo/LDLQZ0HObq5XWZYlSqn1CxcuVKOjXqpGo0EYhgghOD4+ZjKZPHHO/eoc4wLAVP7nbEbnHDPn3HOlFnI6nX5jjMHzPJrNJs1ms+qiyWTC0dEReZ7/Zq37uQAo90k17s+u3082I9AVgi1gA/gc6AIj4DWw6xy/Q/X3ZQb/uRnrQP/rjj8HxFF0HHwccvVBWnesLydbsy/Jv5v6eKN583tAAAAAAElFTkSuQmCC") !important; height:24px !important; width:24px !important; background-position:center !important; position:absolute !important; right:-6px !important; top:-6px !important; cursor:pointer !important; } #overlayplus #liveclose:hover { background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8yNy8xNLWEVkYAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAD1klEQVRIibWWz4tcRRDHP9X93q6zWdwf/trNDwwbTIwaNmIgoiB48LDmDxBExIuoJwnejAcvrkKCoET0KMH/YZEcvOjVrIjRPUTyc4OabGazyczOzOv+eph+b9/MJniyoKg31VX17aqu6h4bY5AOZ1n1vVwUVluymlT6LiWHs0zJh2HKtmkGg7sUtJR1UCWOgJaLIg4DV7sbzqQWzAG+xi5xSTFxqHGsgd83k3rwDMgecm7yMefeyGDBwSFgAliP8GsBS3/F+N3NGJtA7x5g2zKpA+TAyFNZduIB+GDOe/Z4z7QZI0AXWJO4EgJ/hsAmnDpfFItpqTcM5PPBEmVAvtO5Xbu9X5xz7r2X8pxd3gPQBm6nKKPAbu+Z855N6YXMbHYEljeku8Mlq4OUGYzudG7xmSx789k8pwOsS3TT9pRkF2hJODMe729ivilN3JTOUmuIEqQsUwaMPOH9x3u9f+fpLGNNogV0pX4NzCiAoqbrAG2JWedow7wDvyb9WAexsa0sRqacm5l17sIreU5IzhG4K9EGHjbDJe+mhAETSddI8myvx2qMe9dj/CclHMqWdICfMHttxjkE3JLYTM5fHDvGN0eOsCaxnvj00aOcXljAA5vJHmDWOabMXmer7QeGzEVYmDZjXaKTeEMiXLmC37+frw4cYNo5vjx4EL9vH/HyZdpQ2a5LTJsRYaEe28b6P0aAxm7vV17O80faEmGrtRk3Y3HPHrJDhypdce4cH16/zh1tzZ1Pmf/Q6/19NYQnU0N2B4axkCbXYqSZzqKkCLx76RJf93qV7u3VVZrSwBXggEkzCmmKIX1FgmanBKzxhsT7jQba2Kj4eKNBM8YBO+h3m+DWvUAExAL+aEt4tqYpAz7dsYNZ5/i5KDh+5w6/FAW7nOOz8fHKWalcbYkCVqi1sKvZxK60dCNGGmZEiSiR0Z/u30Lg81aLiyFwstXifAiM0j/M0rZhxo0Y6UpLNRANzEluNjNmduG5LKMt0U6H2jCj1z+zqgR5motOzWbUjHNFQUva25OqOSkn3gCL0PXQ6MLzO52jk2pd3niqcUhrSoCTZlwIgdvSqY70fXKLgMq7qyTrwU8tmBXMzzhHTMHiEIjSzhpmTJhxMQSuxnimI51IGRTDIDYIZctNaaIlzT/qHA86VxmI/i06ZsZU0q+EwDXpTIRPBM0EUI3acCYAEtyNcLYFbjXGF3vpgMfNGHeu6qJrMfJ7CGzAySB9lACGq7vt+d32MgKTBm8BrwIHgEn6c7ACLAm+ZWv3ZQb3fRnrQP/rG49Aqf71N+o//60kWeoH6F/3UAWUPOC7XAAAAABJRU5ErkJggg==") !important; } #live .pComment-time {text-transform:capitalize; color:#777777 !important;} #live.lopen:hover {opacity:1.0 !important;}</style>');
	
	//Push
	function pushnot(z) {
		if(!getCookie('plusnot') && hf === true) {		
			var url;
			if (z == 'not') {
				url = '/notificaciones/buscar/?request=notifications';
			}
			//else if (z == 'fri') {
			//	url = '/notificaciones/buscar/?request=friend-requests';
			//}
			else if (z == 'mai') {
				url = '/notificaciones/buscar/?request=messages';
			}
			else if (z == 'for') {
				url = '/notificaciones/buscar/?request=posts';
			}
			
			$.ajax({
				url: url,
				type: 'GET',
				success: function(data) {
					if($("#overlayplus")) {
						$('#overlayplus').remove();
					}
					
					if (plusfeed == '0') {
						var plussound = document.getElementById('sound2');
						plussound.volume=0.5;
						plussound.play();
					}
					
					var noti = $('*', data).filter(":first").parent();
					$('body').append('<div id="overlayplus"><div id="live" class="lopen"><span id="liveclose"></span></div></div>');
					$('#live').append(noti);
					if (z == 'mai') {
						$('#live .friend-name').after(' Te ha enviado un mensaje privado: ');
					}
					$('#liveclose').click(function() {
						$('#live').toggleClass('lopen').animate({
							opacity: 0
						},1200);
						removeplus();
					});
					
					$('#live').animate({
						bottom: 0
					},1200);
					
					var timeout = '1';
					$('#live').mouseenter(function() {
						timeout = '0';
						window.clearTimeout(timer);
					}).mouseleave(function() {      
						timeout = '1';
					});
					
					function removeplus() {
					timer = window.setTimeout(function(){$("#overlayplus").remove();},1200);
					}
					
					function livetimeout(z) {
						setTimeout(function(){
							if(timeout == '0') {
								livetimeout(2000);
							}
							else if (timeout == '1') {
								$('#live').animate({
									opacity: 0
								},1200);
								removeplus();
								$('#live').mouseenter(function() {
									window.clearTimeout(timer);
									$('#live').animate({
										opacity: 1
									},100);
								}).mouseleave(function() {      
									livetimeout(2000);
								});
							}
						},z);
					}
					
					livetimeout(4500);
				}
			});
		}
	}
	
	function recookie() {
		if(lc === 1) {
		setCookie2('Load1','ON',900000,'kronos.mcanime.net');
		}
		else if(lc === 2) {
		setCookie2('Load2','ON',900000,'kronos.mcanime.net');
		}
		else if(lc === 3) {
		setCookie2('Load3','ON',900000,'kronos.mcanime.net');
		}
		setTimeout(recookie, 840000);
	}
	
	if(lc != false || lc != 4) {
		setTimeout(recookie, 840000);
	}
	
	//CPanel
	if ($("#iconbar").length)
	{
		var container = $('#iconbar');
		var TopMenu = window.document.createElement('div');
		TopMenu.id = "TopMenuScript";
		TopMenu.innerHTML = '<div id="scont"><div class="sopt" style="margin-top: 2px;"> <span class="snot"><input type="checkbox" id="snot"><label for="snot">Actualizar Notificaciones</label></span> <span class="sfeeds"><input type="checkbox" id="sfeeds"><label for="sfeeds">Actualizar Feeds</label></span> </div> <div class="sopt"> <span class="sxpand"><input type="checkbox" id="sxpand"><label for="sxpand">Expandir Animes / Mangas</label></span> <span class="ssearch"><input type="checkbox" id="ssearch"><label for="ssearch">Cambiar Motor de B&uacute;squeda</label></span> </div> <div class="sopt"> <span class="sside"><input type="checkbox" id="sside"><label for="sside">Barra Lateral en Feeds</label></span> <span class="sprivate"><input type="checkbox" id="sprivate"><label for="sprivate">Mostrar Perfiles Privados</label></span> </div> <div class="shelp"> <div class="sdesc">Dudas, comentarios o sugerencias: <b><a href="http://kronos.mcanime.net/perfil/614207/actividades" style="color:white !important;">@Zeyth</a></b>.</div> <div id="sbot"></div><div id="stop"></div></div> <div id="stwo"><div class="sopt"> <span class="sradio"><input type="checkbox" checked="checked" id="sradio"><label for="sradio">Estaci&oacute;n MCRadio</label></span><span class="NoLimit"><input type="checkbox" checked="checked" id="NoLimit"><label for="NoLimit">L&iacute;mite de Ventanas</label></span></div><div class="sopt"><span class="PlusLinks"><input type="checkbox" checked="checked" id="PlusLinks"><label for="PlusLinks">Expandir Links</label></span><span class="PlusImages"><input type="checkbox" checked="checked" id="PlusImages"><label for="PlusImages">Expandir Im&aacute;genes</label></span></div><div class="sopt"><span class="plusnot"><input type="checkbox" checked="checked" id="plusnot"><label for="plusnot">Notificaciones Din&aacute;micas</label></span><span class="stopanimes"><input type="checkbox" checked="checked" id="stopanimes"><label for="stopanimes">Mover Cuadro Anime Recientes</label></span></div></div> </div>';
		container.append('<div id="shide"></div>', TopMenu);
		if(getCookie('shide')){
			$('#shide').attr('id','sshow');
			$(TopMenu).hide();
		}
	}

	function cpanel(id,txt) {
		var help = $('.shelp div.sdesc');
		var original = help.html();
		$(id).hover(function (e) {
			help.html(txt);
			if($('#scont .sopt').first().attr('style') == 'margin-top: 2px;' && id != '#TopMenuScript #sbot') {
				$('#sbot').toggle();
			}
		}, function (e) {
			help.html(original);
			if($('#scont .sopt').first().attr('style') == 'margin-top: 2px;' && id != '#TopMenuScript #sbot') {
				$('#sbot').toggle();
			}
		});
	}

	$('#TopMenuScript input:checkbox').change(function() {
	//Nada como parches mal hechos en codigo viejo
		if(this.id == 'stopanimes') {
			if(this.checked) {
				setCookie(this.id,'OFF',365,'kronos.mcanime.net');
			}
			else {
				setCookie(this.id,'ON',-1,'kronos.mcanime.net');
			}
		}
		else if(this.checked) {
			setCookie(this.id,'ON',-1,'kronos.mcanime.net');
		}
		else {
			setCookie(this.id,'OFF',365,'kronos.mcanime.net');
		}
	});
	
	$('#TopMenuScript input:checkbox').each(function() {
	//Parches Parches
		if(this.id == 'stopanimes') {
			if(getCookie(this.id)) {
				$(this).attr('checked', true);
			}
			else{
				$(this).attr('checked', false);
			}
		}
		else if(getCookie(this.id)) {
			$(this).attr('checked', false);
		}
		else{
			$(this).attr('checked', true);
		}
	});

	cpanel('#TopMenuScript .snot','El contador de notificaciones aumentar&aacute; autom&aacute;ticamente cuando recibas un nuevo comentario, mensaje o solicitud.');
	cpanel('#TopMenuScript .sfeeds','Nuevas respuestas en feeds ser&aacute;n autocargadas.<br/>[S&oacute;lo en su direcci&oacute;n &uacute;nica, click en la hora/notificaci&oacute;n]');
	cpanel('#TopMenuScript .sxpand','Expande el cuadro de Animes y Mangas recientes de la portada.');
	cpanel('#TopMenuScript .ssearch','Cambia el buscador por uno personalizado, m&aacute;s amigable a errores y con resultados m&aacute;s espec&iacute;ficos.');
	cpanel('#TopMenuScript .sside','Agrega la barra de informaci&oacute;n de usuario a la derecha de sus feeds [como estaba antes].');
	cpanel('#TopMenuScript .sprivate','Permite ver perfiles privados, s&oacute;lo ver, no se puede comentar sin pertenecer a las amistades de la persona.');
	cpanel('#TopMenuScript .sradio','Cambia la estaci&oacute;n de MCRadio a R/a/d.io');
	cpanel('#TopMenuScript #stop','M&aacute;s opciones.');
	cpanel('#TopMenuScript #sbot','M&aacute;s opciones.');
	cpanel('#TopMenuScript .NoLimit','Limita la ejecuci&oacute;n de Kronos+ a 3 ventanas, si se desactiva puede ocasionar problemas en algunas computadoras.');
	cpanel('#TopMenuScript .PlusLinks','Autoexpande los links en feeds a su url real y los marca como WEB o IMG.');
	cpanel('#TopMenuScript .PlusImages','Muestra autom&aacute;ticamente las im&aacute;genes en feeds.<br/>[Necesita Expandir Links]');
	cpanel('#TopMenuScript .plusnot','Muestra una alerta emergente con la notificaci&oacute;n m&aacute;s reciente.');
	cpanel('#TopMenuScript .stopanimes','Mueve el cuadro de Anime/Manga recientes a la cabecera de la página, estilo V1.');
	
	$('#PlusLinks').click(function() {
		if($(this).attr('checked') == true) {
			plusimages();
		}
	});

	$('#PlusImages').click(function() {
		$("#user-feeds a.hine").toggleClass('hid').toggleClass('exp').next('img').toggle();
	});
	
	$('#shide, #sshow').click(function() {
		var z = this;
		if(z.id == 'shide'){
			$('#TopMenuScript').animate({width:'toggle'},1000);
			z.id = 'sshow';
			setCookie('shide','OFF',365,'kronos.mcanime.net');
		}
		else{
			$('#TopMenuScript').animate({width:'toggle'},1000);
			z.id = 'shide';
			setCookie('shide','OFF',-1,'kronos.mcanime.net');
		}
	});
	
	$('#sbot, #stop').click(function() {
		var z = this;
		$('#sbot, #stop').toggle('slow');
		if(z.id == 'sbot'){
			$('.sopt').animate({ 'marginTop': '-32px'}, 800);
		}
		else{
			$('.sopt').animate({ 'marginTop': '2px'}, 800);
		}
	});
	
	$('.NoLimit').click(function() {
		setCookie('Load1','OFF',-1,'kronos.mcanime.net');
		setCookie('Load2','OFF',-1,'kronos.mcanime.net');
		setCookie('Load3','OFF',-1,'kronos.mcanime.net');
	});

	//HTML5 Audio Container
	function audio() {
		var sound = window.document.createElement('audio');
		sound.id = "sound";
		sound.src = "http://zeyth.net46.net/mcanime/feed.wav";
		sound.style = "display:none;";
		sound.preload= "auto";
		document.body.appendChild(sound);
		var sound2 = window.document.createElement('audio');
		sound2.id = "sound2";
		sound2.src = "http://zeyth.net46.net/mcanime/feed2.wav";
		sound2.style = "display:none;";
		sound2.preload= "auto";
		document.body.appendChild(sound2);
	}

	//Radio
	function radio() {
		var rset = 'https://stream.r-a-d.io/main.mp3?stream';
		var radiourl = 'https://r-a-d.io/';
		if(!getCookie('sradio')) {
			rset = 'http://66.90.111.10:8000/;stream.nsv';
			radiourl = 'http://mcanimeradio.com/';
		}
		var expplayer = '<a href="' + radiourl + '" target="_blank" id="rpop"></a>'
		var rplayer = '<div id="radio"><span id="rhide" title="Desactivar la Radio"></span><embed width="300" height="20" flashvars="type=mp3&amp;file=' + rset + '&amp;autostart=false&amp;backcolor=0x0000000&amp;frontcolor=0xFFFFFF" quality="high" name="radio" src="http://www.shoutcheap.com/flashplayer/player.swf" type="application/x-shockwave-flash" id="radioplayer" wmode="opaque" /></div>';
		
		$("#tab-menu").append(rplayer);
		$("h2.feed").before(expplayer);
		
		if(getCookie('radio')) {
			rrestore(rplayer);
		}
		
		$('#rhide').click(function() {
			rrestore(rplayer);
			setCookie('radio','OFF',365,'kronos.mcanime.net');
		});
		$('#rpop').click(function() {
			$('#rpop').remove();
			rrestore(rplayer);
		});
	
	}
	
	function rrestore(rplayer) {
		$('#radio').html('<span id="rrestore"></span>');
		$('#rpop').remove();
		$('#rrestore').click(function() {
			$('#radio').replaceWith(rplayer);
			$('#rhide').remove();
			setCookie('radio','ON',-1,'kronos.mcanime.net');
		});
	}
	
	if($("#user-feeds.main-feeds").length){
		radio();
	}
	
	$('#TopMenuScript .sradio').click(function() {
		setCookie('radio','ON',-1,'kronos.mcanime.net');
		$('#radio').remove();
		$('#rhide').remove(); $('#rpop').remove();
		setTimeout(function(){radio(); $('#rhide').remove(); $('#rpop').remove();},800);
	});
		
	//Funciones
	$.ajaxSetup({timeout:60000});
	jQuery.support.cors = true;
	function reload(ex) {

		if(ex=='feed') {
			var page = url;
		}
		else{
			var page = "/portada2";
		}
		
		$.ajax
		({
			type: "GET",
			url: page,
			success: function(data) {
			//Start Sucess
				if(!getCookie('slatest')){
					latest(data);
				}
				if(!getCookie('snot')){
					notifications(data);
				}
				if(ex=='feed') {
					if(!getCookie('sfeeds')){
						feed(data);
					}
					if(!getCookie('sfeeds') || !getCookie('snot')){
						setTimeout(function(){reload('feed');},30000);
					}
				}
				else{
					if(!getCookie('snot')){
						setTimeout(function(){reload();},30000);
					}
				}
				data = null;
			//End Sucess
			},
			error: function() {
			//Start Error
				if(ex=='feed') {
					setTimeout(function(){reload('feed');},10000);
				}
				else{
					setTimeout(function(){reload();},10000);
				}
			//End Error
			}
		});

	}

	function expand() {
	$('fieldset.daily-releases').load('/publicaciones/todas/ h4, .series-releases', function() {
		if(getCookie('stopanimes')) {
			$('#sidebar fieldset h4').html('&Uacute;ltimas Publicaciones');
			$('#sidebar fieldset').detach().addClass('topre').prependTo('#wrapper');
		}
	});
	}

	function latest(data) {

		if($('#sidebar').length && $('#sidebar .side-box').length)
		{
			if(!$('.side-box.r7').length)
			{
				$('.side-box.r5').before('<div class="side-box r5 r7"></div>');
			}
			$('.side-box.r5:not(.r7)').html($(".last-topics", data));
			$('.side-box.r7').html($(".last-replies", data));
		}
		data = null;
	}

	function notifications(data) {

		if($('#ua-notifications').length && $('#ua-notifications', data).length)
		{
		//Actuales
		var friends = $('#user-actions li#ua-friend-requests > a > span');
		var messages = $('#user-actions li#ua-messages > a > span');
		var notification = $('#user-actions li#ua-notifications > a > span');
		var forum = $('#user-actions li#ua-posts > a > span');
		//Futuros
		var friends2 = $('#user-actions li#ua-friend-requests > a > span', data).text();
		var messages2 = $('#user-actions li#ua-messages > a > span', data).text();
		var notification2 = $('#user-actions li#ua-notifications > a > span', data).text();
		var forum2 = $('#user-actions li#ua-posts > a > span', data).text();
		var all = parseInt(friends2,10) + parseInt(messages2,10) + parseInt(notification2,10) + parseInt(forum2,10);
		
		//Push Notification
		if(parseInt($(notification).text()) < parseInt(notification2)) {
			pushnot('not');
		}
		else if (parseInt($(messages).text()) < parseInt(messages2)){
			pushnot('mai');
		}
		else if (parseInt($(forum).text()) < parseInt(forum2)){
			pushnot('for');
		}
		//else if (parseInt($(friends).text()) < parseInt(friends2)){
		//	pushnot('fri');
		//}
		
		function nc(not,not2) {
		
			if(parseInt(not2,10) > 0) 
			{
				not.html(not2);
				not.parent().addClass("new");
			}
			else if(parseInt(not2,10) <= 0) 
			{
				not.html(not2);
				not.parent().removeClass ("new");
			}
		}
		
		nc(friends,friends2);
		nc(messages,messages2);
		nc(notification,notification2);
		nc(forum,forum2);

		if(all <= 0){all = 0};
		if(all > 0)
		{
			document.title = "["+all+"] " + title;
		}
		else
		{
			document.title = title;
		}

		}
		
		data = null;
	}

	function feed(data) {

		if($('.pComment-list').length && $('.pComment-list', data).length && $('.pComment-list li', data).length > 0)
		{
			//Actuales
			var comments = $('.pComment-list');
			var number = $('li', comments).length;
			if(number > 0)
			{
				var last = $('li', comments).last();
				var lid = last.attr("id");
				var split = lid.split("-");
			}
			else
			{
				var last = 0;
				var lid = 0;
				var split = 0;
			}
			//Futuros
			var comments2 = $('.pComment-list', data);
			var number2 = $('li', comments2).length;
			var last2 = $('li', comments2).last();
			var lid2 = last2.attr("id");
			var split2 = lid2.split("-");
			//Diferencia
			if(number > 0)
			{
				var dif = parseInt(split2[1],10) - parseInt(split[1],10);
			}
			else
			{
				var dif = 0;
			}
			var dif2 = number2 - number;
			
			if(dif == 0 && dif2 == 0)
			{
				var repeat = 0;
				var time = $('.pComment-time');
				var time2 = $('.pComment-time', data);
				if(time.length == time2.length){
					time.each(function() {
					var tea = $(time2)[repeat++];
						if($(tea).text().length > 5)
						{
							var z = this;
							$(z).replaceWith($(tea));
							z = null;
							tea = null;
						}
					});
				}
				repeat = null;
				time = null;
				time2 = null;
			}
			else if(number == 0 && number2 > 0)
			{
				play();
				comments2.hide();
				comments.replaceWith(comments2);
				comments2.fadeIn(1000);
				altitle();
				reset();
			}		
			else if(dif > 0)
			{
				play();
				ulac = ("#" + lid);
				ulaf = $(ulac, comments2);
				next = ulaf.nextAll();
				next.hide();
				comments.replaceWith(comments2);
				next.fadeIn(1000);
				altitle();
				reset();
			}
			else if(dif2 > 0)
			{
				play();
				comments2.hide();
				comments.replaceWith(comments2);
				comments2.fadeIn(1000);
				altitle();
				reset();
			}
		}
		
		data = null;
	}

	function play()
	{
		var sna = document.getElementById('sound');
		sna.volume=0.5;
		sna.play();
	}

	function reset() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.id = "Reset";
		script.text  = "initInteraction();"  
		if($('#Reset').length > 0) {
			$('#Reset').remove();
		}
		document.body.appendChild(script);
	}

	function focus() {
		hf = false;
		$('body').one('mouseover', function() {
			hf = true;
		});
		$(window).bind("blur", function() {
			hf = false;
		});
		$(window).bind("focus", function() {
			hf = true;
		});
	}
	
	//Focus Encendido
	focus();
	audio();

	function altitle() {
		if (hf === false) 
		{
			var isOldTitle = true;
			var oldTitle = title;
			var newTitle = "[!] Mensaje Nuevo";
			var interval = null;
			function changeTitle() 
			{
				document.title = isOldTitle ? oldTitle : newTitle;
				isOldTitle = !isOldTitle;
			}
			interval = setInterval(changeTitle, 700);
			$(window).focus(function () 
			{
				clearInterval(interval);
				$("title").text(oldTitle);
			});
		}
	}

	function side() {
		var profile = url.split(".net/");
		profile = profile[1].split("/");
		profile = '/perfil/' + profile[1] + '/actividades/'
		$.ajax
		({
			type: "GET",
			url: profile,
			success: function(data) {
			//Start Sucess
				var sidebar = $('#sidebar', data);
				if(sidebar.length) {
					$('#particular_tweet').before('<div id="WhereAmI" style="display:none;"></div>');
					$('#container').append(sidebar);
				}
				data = null;
			//End Sucess
			},
			error: function() {
			//Start Error
				$('#footer').before('<div id="private">Sucedi&oacute; un error al cargar la informaci&oacute;n del usuario.</div>');
			//End Error
			}
		});
	}

	Search = function() {
				var cx = '001161274258707582644:dd-qwefwamu';
				var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true;
				gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
					'//www.google.com/cse/cse.js?cx=' + cx;
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s);
			  };
			  
	function customsearch() {
		$("div.ua-search form").hide();
		$("div.ua-search").append('<div id="customsearch"><gcse:searchbox gname="storesearch"></gcse:searchbox></div><span id="customswitch" onclick="$(\'div#customsearch\').toggle(); $(\'form.gsc-search-box\').toggle(); $(\'div.ua-search form\').toggle(); $(\'#customresults\').hide(); $(this).html($(this).html() == \'Buscador Normal\' ? \'Custom Search\' : \'Buscador Normal\');">Buscador Normal</span><div id="customresults"><gcse:searchresults gname="storesearch"></gcse:searchresults></div>');
		$('#customresults').bind( 'mousewheel DOMMouseScroll', function ( e ) {
			var scroll = document.getElementById('customresults').scrollHeight - 500 - $(this).scrollTop();
			if(scroll == 0) {
				$(this).scrollTop($(this).scrollTop() - 1)
				e.preventDefault();
			}
		});
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.id = "CustomSearch";
		script.text  = "var call = function() {$('#gsc-i-id1').keyup(function(e) { if(e.which == 13) {$('#customresults').fadeIn(1000);}}); $('a.ua-search').click(function(){$('#gsc-i-id1').focus();});};	window.__gcse = {callback: call}; (" + Search.toString() + ")();";  
		document.head.appendChild(script);
	}

	if(url.match('/perfil/.*/.*/actividades/?$')){
		if(!getCookie('sfeeds') || !getCookie('snot')){
			setTimeout(function(){reload('feed');},30000);
			plusfeed = '1';
			//audio();
		}
		if(!getCookie('sside')){
			side();
		}
	}
	else{
		if(!getCookie('snot')){
			reload();
		}
	}

	if($('fieldset.daily-releases').length && !getCookie('sxpand')){
		expand();
	}

	if(url.match('/perfil/([0-9]+)/actividades/?$') && !getCookie('sprivate')){
		if($('#user-feeds').text().trim() == 'Perfil Privado') {
			var privado = url.split("perfil/");
			privado = privado[1].split("/actividades");		
			$.ajax
			({
				type: "GET",
				url: '/mensajes/9876543210123/perfil/' + privado[0],
				success: function(data) {
				//Start Sucess
					var irrumpir = data.split("[|]");
					$('#user-feeds').before('<div id="private">Este es un perfil privado, para poder comentar en los mensajes de esta persona es necesario que te acepte como amigo.</div>');
					$('#user-feeds').after('<div><a class="more-feeds r3" href="/mensajes/' + irrumpir[0] + '">Publicaciones anteriores</a></div>');
					$('#user-feeds').html(irrumpir[1]);
					reset();
					data = null;
				//End Sucess
				},
				error: function() {
				//Start Error
					$('#user-feeds').before('<div id="private">Sucedi&oacute; un error al cargar los mensajes, recargue la p&aacute;gina para volver a intentar.</div>');
				//End Error
				}
			});
		}
	}

	if($('div.ua-search').length && !getCookie('ssearch')){
		customsearch();
	}
}
limit();
function restart() {
	if(typeof fz === 'undefined') {
		fz = false;
	}
	
	if(navigator.userAgent.indexOf('Opera') < 0) {
		if(lc === 1) {
		var ov = '<div id="overload" class="kon"><div class="hide"><span class="active">Kronos+ activado.</span><br/>Ventana # <b>1</b></div></div>'
		}
		else if(lc === 2) {
		var ov = '<div id="overload" class="kon"><div class="hide"><span class="active">Kronos+ activado.</span><br/>Ventana # <b>2</b></div></div>'
		}
		else if(lc === 3) {
		var ov = '<div id="overload" class="kon"><div class="hide"><span class="active">Kronos+ activado.</span><br/>Ventana # <b>3</b></div></div>'
		}
		else if(lc === 4) {
		var ov = '<div id="overload" class="forzed"><div class="hide"><b>Kronos+ activado.</b><br/>Limite de ventanas inactivo.</div></div>'
		}
		else {
		var ov = '<div id="overload" class="over"><div class="hide"><span>Kronos+ est&aacute; desactivado.</span><br/>Tienes m&aacute;s de <b>3</b> ventanas activas.<br/>Ejecutar este script m&aacute;s ocasiones podria afectar el rendimiento de tu navegador.<br/><a>Activar de todas formas</a></div></div>';
		}
		
		if(!$('#overload').length) {
			$('#main-menu').append(ov);
		}
		else{
			$('#overload').replaceWith(ov);
		}
		
		$('#overload').hover(function() {
			$('#overload div').show();
		}, function() {
			$('#overload div').hide();
		});
		$('#overload a').click(function(e) {
			fz = true;
			clearTimeout(vl);
			clearTimeout(vr);
			KronosPlus();
			$('#overload').removeClass('over');
			$('#overload').addClass('forzed');
			$('#overload').html('<div class="hide"><b>Kronos+ activado.</b><br/>Considera cerrar alguna de las ventanas activas.</div>');
		});
	}
		
	if(overload === false && fz === false){
		KronosPlus();
	}
	else if(overload === true && fz === false &&  op() < 0){
		var vl = setTimeout(limit, 10000); 
		var vr = setTimeout(restart, 11000);
	}
}

restart();
if(!getCookie('PlusLinks')){
	plusimages();
}

function plusimages() {
	//CSS
	var chrome;
	if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){
		chrome = 'a.done {margin-top:1px !important;}';
	}
	$("head link[rel='stylesheet']").last().after("<style type='text/css'>a.done.img, a.done.web, a.hine { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAKCAYAAABMtYURAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDUvMDMvMTRAJpJxAAABC0lEQVQ4jaWU4U3DQAyFPyP+kxHKBMkItwHdgLBBRwgbZAMyQtigbJARwgS0Ezx+xKXmmqgpPMk62X4n+53sMzJISsBoZmPwAQYzO2TcDbDJcyE+e28RmtBk/q9YyB1iTlIhaa9LXNwFuFvV0YRdVrgGHjLOHqiAFzMz4BF4BYpVFRaUj37WIT64SVIjaZtzrmGt8g444up9DkqgDZzKz945TbDZhm559hYoJVVA7c30OSkMV3LbOf9fxbvQxDPQZVM8wM8sYGbJzNIpPof7tZXNbJT0DjyFJmK+l/QJtJLg/CoFMLtqtyiHs/qP0z+QYcuk9A34ciuZtuA6JCX/JP7ke2zj8SRpcc2+AfTN5II6e80RAAAAAElFTkSuQmCC') !important; background-position:right 2px !important; background-repeat:no-repeat !important; background-color:#ADBD00 !important; height:14px !important; display:inline-block !important; padding:0px 32px 0px 5px !important; line-height:13px !important; color:#333333 !important; white-space:nowrap !important; text-overflow: ellipsis !important; max-width:500px !important; } a.done.img { margin-right:19px !important; } .pComment-content a.done.img, .pComment-content a.done.web { max-width:454px !important; margin-top:1px !important; } a.done.img:hover { background-color:#C9D900 !important; text-decoration:none !important; } a.done.web { background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAKCAYAAABMtYURAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDUvMDMvMTRAJpJxAAABNUlEQVQ4jY2UUXHDMBBE32b63zCIGcQMKgZtGQRCIaQMAiEQDMEQXAYOAwfB9sOnmYtrd7IzHku3J92tvZJsN0AjqSdguwWQNKRYASZJQ4yXGCRNSy7vm2EbbJ89o02EbTvN9xG6Zn6BssGNIfBP8R1QO6uLS0r4yBzQpfXfekS/5IBP4ACc1tTvYtE9FSiJX8ZygWcwxntaIwVguwPeJcl2LbAHkNTaHoFRUol8A7e0+SDpa4Wrv7KVVHOJPHYx7iJQgLdQ2APHiB14/ORVVc0bNrgOeAWua8prF02YY6jmice2+w1Dnjf2euBsX7J5s/IXAEmj7R/gGPM+Eu7xJW752D2LcHlh9tS/iZeqNMW6fMQW6p49apPt05pypcme2SBjNUd03hAXSMotK/2vXjLLtbn4L9XWUlUV5/3cAAAAAElFTkSuQmCC') !important; padding-right:35px !important; background-color:#265CFF !important; color:#111111 !important; } a.done.web:hover { background-color:#4F7BFF !important; text-decoration:none !important; } a.hine.hid { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8xMi8xNMX63KQAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAQElEQVQokWP8//8/AzUAE1VMGTWIKMCCTVBZWbmAgYGhH4eej3fv3hUgyiAGBoYFDAwMF3DIfcAmyDiajoagQQAvMg15/Rqd5AAAAABJRU5ErkJggg==') !important; } a.hine.exp { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAYAAAAi2ky3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8xMi8xNMX63KQAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAAAfklEQVQokWP8//8/AwwwMjIykAKQ9TKRpBMPoJ9BSkpKDUpKSv8JqRt8XmPEFmtKSkoFDAwM/Tj0fLx3754AAwNqrLHgULyAgYHhApSdwMDAEM/AwOAI5X/AquP///9wjA3gC2xkvVQLI1xeQwYLGBgYDhBShDWwiQWDO4sAAGuqMlfDb+iyAAAAAElFTkSuQmCC') !important; } a.hine { background-position:right !important; background-color:#FF4000 !important; padding:0px 7px 0px 8px !important; margin-left:-18px !important; } a.hine:hover { text-decoration:none !Important; background-color:red !important; }" + chrome + "</style>");

	//Status
	var expanding = 1;
	var expfirst = 1;

	function exp(z) {
		expanding = z;
	}

	function css(z,x) {
		$(z).css({ "max-width": "100%", "width": "auto", "height": "auto", "display": "block", "margin": "5px 0px 5px 0px", "cursor": "pointer" });
		
		if(x) {
			$(z).hide();
		}
	}

	$("#user-feeds").delegate( "a.hine", "click", function() {
		 $(this).next('img').toggle();
	});	

	function fancy(z,x) {
		$(z).fancybox({
			'padding'       : 10,
			'autoScale'     : true,
			'transitionIn'  : 'elastic',
			'titleShow'     : true,
			'showCloseButton': true,
			'titlePosition' : 'outside',
			'transitionOut' : 'elastic',
			'title'         : '<a href="'+x+'" target="_blank" onclick="$.fancybox.close();">Ir a la imagen original.</a>',
			'href'          : x.href,
			'type'			: 'image'
		});
	}

	function loadimages() {
		var links = $.merge($('.story-message a[target="_blank"]:not(.done)'), $('.pComment-content a[target="_blank"]:not(.done)'));
		var colinks =  links.length - 1;
		if (colinks != -1) {
			exp(1);
		}
		else {
			exp(0);
		}

		$.each(links, function(key, value) {
			var link = this;
			var json = 'https://api-ssl.bitly.com/v3/expand?access_token=0d24189b58200b509140af5edffc0c89be378743&shortUrl=' + link;
			$(link).addClass('done');
			var plusimg;
			var hideimg = 'hine hid';
			if(getCookie('PlusImages')){
				plusimg = 'hide';
				hideimg = 'hine exp';
			}

			//RealURL
				$.ajax({
				  url: json,
				  dataType: 'json',
				  success: function(result){
					var realurl = result.data.expand[0].long_url;
					var realurl2 = realurl;
					if(realurl) {
						var length = realurl.length;
						if (length > 85) {
							realurl2 = realurl.substring(0,38) + '...' + realurl.slice(-39);
						}
						$("<img src='" + value + "'>").error(function(){$(link).addClass('web'); link.href = realurl; $(link).html(realurl2);}).load(function(){$(link).addClass('img'); css(this,plusimg); fancy(this,link); $(link).after(' ',this); $(this).next('br').hide(); link.href = realurl; $(link).html(realurl2); $(link).after('<a href="javascript:void(0)" class="' +hideimg+ '" onclick="$(this).toggleClass(\'hid\').toggleClass(\'exp\');">&nbsp;</a>');});
					}
				  },
				  error: function(request, textStatus, errorThrown) {
					$(link).addClass('error');
				  },
				  complete: function(request, textStatus) {
					//Extra, tras completar la accion, siempre se ejecuta
					if (colinks == key) {
						setTimeout(function(){
							exp(0);
						}, 1000);
					}
				  }
				});
			//RealURL
		});
	}

	loadimages();

	function opx(z) {
		b = z.indexOf('friend-requests') + z.indexOf('messages') + z.indexOf('notifications') + z.indexOf('posts') + z.indexOf('bit');
		c = z.indexOf('portada2');
		d = z.indexOf('publicaciones/todas/');

		if(b > 0 || c > 0 || d > 0) {
			return true;
		}
		else
		{
			return false;
		}
	}

	$(document).ajaxComplete(function(event, xhr, settings){
		if (opx(settings.url) == false){
			if(expanding == 0) {
				exp(1);
				if(!getCookie('PlusLinks')){
					loadimages();
				}
			}
		}
	});
}