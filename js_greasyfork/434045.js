// ==UserScript==
// @name         SWAN 剩余时间
// @namespace    https://byxiaoxie.com/
// @version      0.5
// @description  SWAN Time
// @author       ByXiaoXie
// @match        https://panel.owswan.co/client*
// @match        https://v2.owswan.co/client*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434045/SWAN%20%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/434045/SWAN%20%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    var lang = document.getElementsByClassName('dropdown-menu')[1];
    var a_active = lang.getElementsByClassName('dropdown-item');
    var leng_sub = "";

    function cd(t1, t2, tg) {
        //相差的毫秒数
        var ms = Date.parse(t1) - Date.parse(t2);
        var minutes = 1000 * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var years = days * 365;
        //求出天数
        var d = Math.floor(ms / days);
        //求出除开天数，剩余的毫秒数
        ms %= days;
        var h = Math.floor(ms / hours);
        ms %= hours;
        var m = Math.floor(ms / minutes);
        ms %= minutes;
        var s = Math.floor(ms / 1000);
        //返回所需值并退出函数
        switch(tg){
            case 'd' : return d;
            case 'h' : return h;
            case 'm' : return m;
            case 's' : return s;
        }
    }

    function endtime(){
        try{
            var t1 = document.getElementsByClassName('form-control')[3].value;
            var d = cd(t1, new Date(), 'd');
            var h = cd(t1, new Date(), 'h');
            var m = cd(t1, new Date(), 'm');
            var s = cd(t1, new Date(), 's');

            if(t1 == "FFFFFF"){
				return;
			}

            var div_1 = document.getElementsByClassName('card-body')[0];
            var div_2 = div_1.getElementsByClassName('form-group');
            var html = div_2[3].outerHTML;

            var lang = document.getElementsByClassName('dropdown-menu')[0]; //[1]老版本 [0]V2新版本
            var a_active = lang.getElementsByClassName('dropdown-item');

            for(var i=0;i<a_active.length;i++){
                var lang_active = a_active[i].className;
                if(lang_active == "dropdown-item notify-item  active "){
                    leng_sub = a_active[i].href.substring(a_active[i].href.length-2);
                    if(leng_sub == "us"){
                        div_2[3].outerHTML = html + '<div class="form-group"><label for="expiredate"><i class="fa fa-hourglass-half"></i> Time remaining (UTC+5) New York Time</label><input id="timeend" class="form-control" readonly="" value="'+d + ' Day ' + h + ' Hour ' + m + ' Min ' + s + ' Sec' + '"></div>';
                    }else if(leng_sub == "cn"){
                        div_2[3].outerHTML = html + '<div class="form-group"><label for="expiredate"><i class="fa fa-hourglass-half"></i> 剩余时间 (UTC+8) 标准时间</label><input id="timeend" class="form-control" readonly="" value="'+d + ' 天 ' + h + ' 时 ' + m + ' 分 ' + s + ' 秒 ' + '"></div>';
                    }else if(leng_sub == "kr"){
                        div_2[3].outerHTML = html + '<div class="form-group"><label for="expiredate"><i class="fa fa-hourglass-half"></i> 남 은 시간 (UTC+9) 한국 표준시</label><input id="timeend" class="form-control" readonly="" value="'+d + ' 하늘 ' + h + ' 시간 ' + m + ' 분 ' + s + ' 초' + '"></div>';
                    }else if(leng_sub == "ru"){
                        div_2[3].outerHTML = html + '<div class="form-group"><label for="expiredate"><i class="fa fa-hourglass-half"></i> остаток времени (UTC+3) моско́вское вре́мя</label><input id="timeend" class="form-control" readonly="" value="'+d + ' день ' + h + ' час ' + m + ' минута ' + s + ' Секунды' + '"></div>';
                    }
                }
            }

            setInterval(writetime,1000);

            //return d + '天' + h + '时' + m + '分' + s + '秒';
        }
        catch(error){
            console.log('not time class');
        }

    }

    function writetime(){
        var t1 = document.getElementsByClassName('form-control')[3].value;
        var d = cd(t1, new Date(), 'd');
        var h = cd(t1, new Date(), 'h');
        var m = cd(t1, new Date(), 'm');
        var s = cd(t1, new Date(), 's');

        if(leng_sub == "us"){
			document.getElementById('timeend').value = d + ' Day ' + h + ' Hour ' + m + ' Min ' + s + ' Sec ';
		}else if(leng_sub == "cn"){
			document.getElementById('timeend').value = d + ' 天 ' + h + ' 时 ' + m + ' 分 ' + s + ' 秒 ';
		}else if(leng_sub == "kr"){
			document.getElementById('timeend').value = d + ' 하늘 ' + h + ' 시간 ' + m + ' 분 ' + s + ' 초';
		}else if(leng_sub == "ru"){
			document.getElementById('timeend').value = d + ' день ' + h + ' час ' + m + ' минута ' + s + ' Секунды';
		}
    }

    endtime();
})();