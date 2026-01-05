// ==UserScript==
// @name        FuniRip
// @version     1.0.0
// @namespace   http://www.funimation.com/?#FuniSimpleDL
// @include     http://www.funimation.com/shows/*/videos/official/*
// @include     http://www.funimation.com/shows/*/videos/promotional/*
// @description Simple download from FUNImation
// @grant       none
// @icon        http://www.funimation.com/assets/img/funimation2_favicon_01.ico
// @downloadURL https://update.greasyfork.org/scripts/19945/FuniRip.user.js
// @updateURL https://update.greasyfork.org/scripts/19945/FuniRip.meta.js
// ==/UserScript==

if( document.querySelectorAll('#main-content').length > 0 && playersData){
	console.log('!!!!! FuniSimpleDL: Loading...');
	for(var pl in playersData[0].playlist){
		if(playersData[0].playlist[pl].items){
			searchItemVid(playersData[0].playlist[pl]);
			break;
		}
	}
	console.log('!!!!! FuniSimpleDL: OK');
}

function makeNum(num){
	return parseInt(num,10) < 10 ? '0'+num : num;
}

function searchItemVid(videoData){
	var parentElx = document.querySelector('#main-content');
	var dllinks = document.createElement('div');
	var returnData='',hd720,hd1080,isDub,fileTitle='';
	for(var v in videoData.items){
		if(videoData.items[v].videoSet){
			videoData = videoData.items[v];
			for(var set in videoData.videoSet){
				fileTitle = videoData.artist+' - '+makeNum(videoData.title.split('-')[0]);
				returnData += '<b>' + videoData.artist+' - '+videoData.title+' ('+videoData.videoSet[set].aspectRatio+' '+videoData.videoSet[set].languageMode+')</b>';
				hd720 = videoData.videoSet[set].hdUrl === '' ? false : true;
				hd1080 = videoData.videoSet[set].hd1080Url === '' ? false : true;
				isDub = videoData.videoSet[set].languageMode == 'dub' ? true :false;
				returnData += makeLinks(videoData.videoSet[set].FUNImationID,videoData.videoSet[set].authToken,fileTitle,hd720,hd1080,isDub);
				if(videoData.videoSet[set].closedCaptions){
					returnData += '<br/>[ <a href="'+videoData.videoSet[set].ccUrl+'/'+encodeURIComponent('[FuniDL] '+fileTitle+'['+(isDub?'Dub ':'')+'480p-2000K]')+'.srt">CC (srt)</a> ]';
				}
				if(videoData.videoSet.length-1 > set){
					returnData += '<br/>';
				}
			}
			dllinks.innerHTML = returnData;
			parentElx.insertBefore(dllinks, parentElx.firstChild);
			break;
		}
	}
}

function makeLinks(FUNImationID,authToken,fileTitle,make720,make1080,isDub){
	var urls;
		urls  = '<br/>';
		//urls += ' 480p:';
		urls += ' [ '+baseVideoUrl(FUNImationID,authToken,fileTitle,'480p','480','750K',isDub);
		urls += ' | '+baseVideoUrl(FUNImationID,authToken,fileTitle,'480p','480','1000K',isDub);
		urls += ' | '+baseVideoUrl(FUNImationID,authToken,fileTitle,'480p','480','1500K',isDub);
		urls += ' | '+baseVideoUrl(FUNImationID,authToken,fileTitle,'480p','480','2000K',isDub);
		urls += ' ] ';
		if(make720){
			urls += '<br/>';
			//urls += ' 720p:';
			urls += ' [ '+baseVideoUrl(FUNImationID,authToken,fileTitle,'720p','720','2500K',isDub);
			urls += ' | '+baseVideoUrl(FUNImationID,authToken,fileTitle,'720p','720','3500K',isDub);
			urls += ' | '+baseVideoUrl(FUNImationID,authToken,fileTitle,'720p(alt)','480','2500K',isDub);
			urls += ' | '+baseVideoUrl(FUNImationID,authToken,fileTitle,'720p(alt)','480','3500K',isDub);
			urls += ' ] ';
		}
		if(make1080){
			urls += '<br/>';
			//urls += ' 1080p:';
			urls += ' [ '+baseVideoUrl(FUNImationID,authToken,fileTitle,'1080p','480','4000K',isDub);
			urls += ' ] ';
		}
	return urls;
}

function baseVideoUrl(FUNImationID,authToken,fileTitle,qualityText,quality,bitRate,isDub){
	var rtr  = '<a href="http://wpc.8c48.edgecastcdn.net/008C48/SV/'+quality+'/'+FUNImationID+'/'+FUNImationID+'-'+quality+'-'+bitRate+'.mp4/';
		rtr += encodeURIComponent('[FuniDL] '+fileTitle+'['+(isDub?'Dub ':'')+qualityText+'-'+bitRate+']')+'.mp4'+authToken+'">'+qualityText+'-'+bitRate+'</a>';
	return rtr;
}