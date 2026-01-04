// ==UserScript==
// @author      xprog512
// @name        Speed video
// @namespace https://greasyfork.org/users/559998
// @description Speed x5
// @include     https://*.*.*
// @version     5.21
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403169/Speed%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/403169/Speed%20video.meta.js
// ==/UserScript==

async function async__$ExEC_FuNC$__pub(v, ti){

	var t = v.duration;
	for(var i = false;i != true;){
		var r = await new Promise(resolve => { setTimeout(()=>{

									if(v.duration == t){

										if(v.readyState != 1){
											v.currentTime += 10000;
										}

										if(v.readyState == 2){
											v.play();v.pause();v.play();
										}


									}
									else
									{
										i = true;
									}



									resolve('exec_OK');
								     }, ti);
							} );

	}

}

function playbackwardvid(v, timg){
		var time = v.currentTime;
		if(time > 0){
			v.currentTime -= parseFloat(timg, 10);
		}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRHexC(){
    return '#'+getRandomInt(256).toString(16)+getRandomInt(256).toString(16)+getRandomInt(256).toString(16);
}

let start=false, playb = false, timervid = 0, dispsec=false, num = 0;
let ologo = {};
ologo.on = false;
ologo.timer = 0;

let search = false, searchi = false;
document.getElementById('search-input').onclick = function(event){
    searchi = true;
    //alert('ssearch:'+search);
}

document.body.onclick = function(event){
    if(searchi){
        search = true;
    }
    else
    {
        search = false;
    }
    searchi = false;
    //alert('bsearch:'+search);
}

document.onkeypress = function(event){
    var v = document.getElementsByTagName('video')[num];console.log(event.charCode);
    if(!search){
        if(event.charCode == 115){
            start = !start;
            (start)? v.playbackRate = 5.0 : v.playbackRate = 1.0;

        }
        else if(event.charCode == 112){
            async__$ExEC_FuNC$__pub(v, 50);
        }
        else if(event.charCode == 114){
            playb = !playb;
            if(playb == true){
                timervid = window.setInterval(r => playbackwardvid(v, 0.25), 250);
            }
            else{
                clearInterval(timervid);
            }
        }
        else if(event.charCode == 121){//y
            v.currentTime += 5;
        }
        else if(event.charCode == 117){//u
            if(v.currentTime > 0)v.currentTime -= 5;
        }
        else if(event.charCode == 118){//v
            try{document.getElementsByTagName('ytd-feed-filter-chip-bar-renderer')[0].innerHTML="";}catch(e){console.log(e);}
            try{document.getElementsByTagName('ytd-video-masthead-ad-v3-renderer')[0].innerHTML="";}catch(e){console.log(e);}
            try{document.getElementsByTagName('ytd-player-legacy-desktop-watch-ads-renderer')[0].innerHTML="";}catch(e){console.log(e);}

        }
        else if(event.charCode == 119){//v
            /*******init************/
            var logo = document.getElementsByClassName('style-scope ytd-topbar-logo-renderer');
            logo[5].setAttribute('fill', getRHexC());
            logo[6].setAttribute('fill', getRHexC());
            /***********************/
        }
        else if(event.charCode == 104){//h
            event.preventDefault();
            dispsec=!dispsec;
            var sec = document.getElementById('secondary');
            sec.style.height='500px';
            sec.style.overflow='auto';
            if(dispsec)sec.style.display='none';
            else sec.style.display='block';


        }
        else if(event.charCode == 110){//n
            ologo.on = !ologo.on;
            if(ologo.on == true){
                ologo.timer = window.setInterval(()=> {
                    var logo = document.getElementsByClassName('style-scope ytd-topbar-logo-renderer');
                    logo[5].setAttribute('fill', getRHexC());
                    logo[6].setAttribute('fill', getRHexC());


                }, 1000);
            }
            else{
                clearInterval(ologo.timer);
            }
        }
        else if(event.charCode == 43){//+
            num++;console.log('NUM VIDEO:' + num);
        }
        else if(event.charCode == 45){//+
            if(num > 0)num--;console.log('NUM VIDEO:' + num);
        }

    }

};

try{
    let plr = {};
    plr.playr = HTMLMediaElement.prototype.play;
    plr.duration = document.getElementsByTagName('video')[0].duration;
    HTMLMediaElement.prototype.play = function(){
        plr.playr.apply(this);

        var logo = document.getElementsByClassName('style-scope ytd-topbar-logo-renderer');
        logo[5].setAttribute('fill', getRHexC());
        logo[6].setAttribute('fill', getRHexC());

        
       
       

    }

}
catch(e)
{
    console.log('error numero 15:' + e);
}






