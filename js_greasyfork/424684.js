// ==UserScript==
// @name         Riddle Master Assistant Reborn
// @version      0.3.2
// @description  ML based riddle master answering bot. Help novice to answer pony problem when encounter riddle master challenge.
// @homepage     https://rdma.ooguy.com
// @include      http://hentaiverse.org/*
// @include      http://alt.hentaiverse.org/*
// @include      https://hentaiverse.org/*
// @include      https://alt.hentaiverse.org/*
// @compatible   Chrome/Chromium + Tampermonkey
// @connect      rdma.ooguy.com
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM.notification
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/756324
// @downloadURL https://update.greasyfork.org/scripts/424684/Riddle%20Master%20Assistant%20Reborn.user.js
// @updateURL https://update.greasyfork.org/scripts/424684/Riddle%20Master%20Assistant%20Reborn.meta.js
// ==/UserScript==

var GM_notification = GM_notification || GM.notification;
//You can specify these two parameter in local storage.
var extend_submit_interval = 3;//delay time for extand waiting when dom has focused at "expecting submit time"
var api_key = '';

// From https://jsperf.com/parse-response-headers-from-xhr/3
function parseResponseHeaders(headerStr) {
	var l = headerStr.length,
	p = -2,
	j = 0,
	headers = {},
	l, i, q, k, v;

	while ( (p = headerStr.indexOf( "\r\n", (i = p + 2) + 5 )) > i )
		(q = headerStr.indexOf( ":", i + 3 )) > i && q < p
		&& (headers[k = headerStr.slice( i, q ).toLowerCase()] = headerStr.slice( q + 2, p ))[0] === '"'
		&& (headers[k] = JSON.parse( headers[k] ));
		(q = headerStr.indexOf( ":", i + 3 )) > i && q < l
		&& (headers[k = headerStr.slice( i, q ).toLowerCase()] = headerStr.slice( q + 2 ))[0] === '"'
		&& (headers[k] = JSON.parse( headers[k] ))
	return headers;
}

function send_head(){
    //GM_notification('INFO: Send awake request to server.','Riddle Master Assistant');
    console.log('[RMA]INFO: Send awake request to server');
    GM.xmlHttpRequest({
        method: 'HEAD',
        timeout: 30000,
        url: 'https://rdma.ooguy.com/status',
        onerror: async function(){
            var is_down = await GM.getValue('is_down',false);
            if(!is_down){
                GM_notification('ERROR: Server not respond','Riddle Master Assistant');
                GM.setValue('is_down',true);
            }
            console.error('[RMA]ERROR: Server not respond');
            GM.setValue('check_interval',60);
        },
        ontimeout: async function(){
            var is_down = await GM.getValue('is_down',false);
            if(!is_down){
                GM_notification('TIMEOUT: Server not respond','Riddle Master Assistant');
                GM.setValue('is_down',true);
            }
            console.error('[RMA]TIMEOUT: Server not respond');
            GM.setValue('check_interval',60);
        },
        onload: async function(response){
            if(response.status!=200){
                var is_maintenance = await GM.getValue('is_maintenance',false);
                if(!is_maintenance){
                    GM.setValue('is_maintenance',true);
                }else{
                    alert('[RMA]WARNING: Server is in maintenance');
                }
                console.warn('[RMA]WARNING: Server is in maintenance');
                GM.setValue('check_interval',60);
            }
            else{
                if(is_maintenance){
                    GM_notification('INFO: Server is up','Riddle Master Assistant');
                    console.log('[RMA]INFO: Server is up');
                }
                GM.setValue('is_maintenance',false);
                GM.setValue('check_interval',3600);
                GM.setValue('is_down',false);
            }
        },
    });
}

async function stay_awake(){
    var d = new Date();
    var last_day = await GM.getValue('last_date','0/0/0');
    var today = d.getUTCFullYear()+'/'+(d.getUTCMonth()+1)+'/'+d.getUTCDate();
    if(today!=last_day){
        console.log('[RMA]INFO: Initialize variable')
        GM.setValue('last_date',today);
        GM.setValue('is_maintenance',false);
        GM.setValue('check_interval',3600);
        GM.setValue('is_down',false);
    }
    var now = Date.now();
    var ts = Math.floor(now / 1000);
    var last_ts = await GM.getValue('last_awake_ts',0);
    var check_interval = await GM.getValue('check_interval',3600);
    if((ts-last_ts) >= check_interval){
        send_head();
        GM.setValue('last_awake_ts',ts);
    }
}

stay_awake();
setInterval(stay_awake,30000);

if (document.getElementById('riddlecounter')){
    var image_url=document.getElementById('riddleimage').childNodes[0].src;
    //GM_notification('INFO: Encounter Riddle Master Challenge','Riddle Master Assistant','https://webrdm.herokuapp.com/favicon.ico');
    window.addEventListener('load', function(event) {//need to wait for riddlebot to complete download
        var xhr = new Request(image_url,{method:'GET',credentials:'same-origin',cache:'only-if-cached',mode:'same-origin'});
        fetch(xhr).then(response => {
            if(response.status===200){
                return response.blob();
            } else {
                //throw new Error('Cache not usable');
                console.warn('[RMA]WARNING: Can not use cache');
                GM_notification('INFO: Can not use cache','Riddle Master Assistant');
                var xhr_nocache = new Request(image_url,{method:'GET',credentials:'same-origin',cache:'force-cache',mode:'same-origin'});
                fetch(xhr_nocache).then(response_nocache => {
                    if(response_nocache.status===200){
                        return response_nocache.blob();
                    } else {
                        console.error('[RMA]ERROR: Cannot get riddlebot');
                        //alert('[RMA]ERROR: Cannot get riddlebot');
                        throw new Error('Cannot get riddlebot');
                    }
                });
            }
        }).then(imgData =>{
            GM.xmlHttpRequest({
                method: 'POST',
                timeout: 8666,
                url: 'https://rdma.ooguy.com/help2',
                onload: async function(response){
					
					console.log('status',response.status, response.status == 429)
					
					var extend_submit_interval = await GM.getValue('extend_submit_interval',3);
					var return_dict = JSON.parse(response.responseText);
					if(return_dict.return=='error'){
						GM_notification('ERROR: Server respond with error','Riddle Master Assistant');
						console.error('[RMA]ERROR: Server respond with error');
					} else if (return_dict.return=='finish'){
						GM_notification('ERROR: No more solves for the day','Riddle Master Assistant Reborn');
					}else if(return_dict.return=='good'){
						console.log(return_dict);
						var responseheaders = parseResponseHeaders(response.responseHeaders);

                        // tick the correct boxes
                        if (return_dict.answer.includes('aj')){
                            document.getElementById('riddler1').children[5].children[0].children[0].checked = true
                        }
                        if (return_dict.answer.includes('fs')){
                            document.getElementById('riddler1').children[2].children[0].children[0].checked = true
                        }
                        if (return_dict.answer.includes('pp')){
                            document.getElementById('riddler1').children[4].children[0].children[0].checked = true
                        }
                        if (return_dict.answer.includes('ra')){
                            document.getElementById('riddler1').children[1].children[0].children[0].checked = true
                        }
                        if (return_dict.answer.includes('rd')){
                            document.getElementById('riddler1').children[3].children[0].children[0].checked = true
                        }
                        if (return_dict.answer.includes('ts')){
                            document.getElementById('riddler1').children[0].children[0].children[0].checked = true
                        }
						// document.getElementById('riddleanswer').value=return_dict.answer;
						
						if (responseheaders['x-ratelimit-remaining'] < 3){
							GM_notification('WARNING: Remaining solves = ' +  responseheaders['x-ratelimit-remaining'] + ' for the day','Riddle Master Assistant Reborn');
						}
						
						document.getElementById('riddlesubmit').disabled = false;					
						
						
						//GM_notification('Remaining solve: ' + responseheaders['x-ratelimit-remaining'] ,'Riddle Master Assistant');
															
						// document.getElementById('riddleform').childNodes[3].click();

						 if(document.hasFocus()){
							 setTimeout(
								 function(){
									 console.log('[RMA]INFO: Auto submit with delay of '+extend_submit_interval+' secs');
									 document.getElementById('riddlesubmit').click()
								 },
								 extend_submit_interval*1000
							 );
						 }else{
							 console.log('[RMA]INFO: Auto submit');
							 setTimeout(() => document.getElementById('riddlesubmit').click(), Math.random() * (8000 - 3000) + 3000);
						 }

						if(return_dict.expire==true){
							GM_notification('WARNING: License is expired/invalid','Riddle Master Assistant Reborn');
						}
						
					}else{
						GM_notification('ERROR: Server respond with unknown result','Riddle Master Assistant');
						console.error('[RMA]ERROR: Server respond with unknown result');
					}
					
                },
                onerror: function(response){
					
					//console.log('WTF RESPONSE PLS',response)
					if(response.status == 429){
						GM_notification('ERROR: All solves used up for this IP today','Riddle Master Assistant');
					} else {
						GM_notification('ERROR: Send request error','Riddle Master Assistant');
						console.error('[RMA]ERROR: Send request error');
					}
                },
                ontimeout: function(){
                    GM_notification('TIMEOUT: Server not respond','Riddle Master Assistant');
                    console.error('[RMA]TIMEOUT: Server does not respond');
                },
                binary: true,
                data: imgData,
                headers: {
                    'Content-Type':'image/jpeg',
					'apikey': api_key
                }
            });
        });
    });
}
