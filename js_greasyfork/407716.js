// ==UserScript==
// @name         A斗鱼活动积分兑换飞机等道具
// @icon         https://s2.ax1x.com/2020/02/28/3Dyt0g.png
// @namespace    http://tampermonkey.net/
// @version      2020.07.10.03
// @description  斗鱼Dota2活动积分换礼物|斗鱼王者荣耀活动积分换礼物
// @author       表弟
// @match        https://www.douyu.com/topic/DPLCDAS2?rid=*
// @match        https://www.douyu.com/topic/BEYONDEPIC?rid=*
// @match        https://www.douyu.com/topic/ryzlsg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407716/A%E6%96%97%E9%B1%BC%E6%B4%BB%E5%8A%A8%E7%A7%AF%E5%88%86%E5%85%91%E6%8D%A2%E9%A3%9E%E6%9C%BA%E7%AD%89%E9%81%93%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/407716/A%E6%96%97%E9%B1%BC%E6%B4%BB%E5%8A%A8%E7%A7%AF%E5%88%86%E5%85%91%E6%8D%A2%E9%A3%9E%E6%9C%BA%E7%AD%89%E9%81%93%E5%85%B7.meta.js
// ==/UserScript==

function init(){
    init_judge();
    initStyles();
    check_update();
}

function init_judge(){
    let url = window.location.href;
    let dota_1 = /(DPLCDAS2)/;
    let dota_2 = /(BEYONDEPIC)/;
    let wzry = /(ryzlsg)/;
    if(dota_1.test(url)||dota_2.test(url)){
        dota2_function();
    }else if(wzry.test(url)){
        wzry_function();
    }
}

function dota2_function(){
    init_dota2_html();
    verify_token();
    dota2_addEventListener();
}

var get_rockets_gift;
var get_airplane_gift;
var get_666_gift;
var get_100yw_gift;
function dota2_addEventListener(){
    document.getElementById("dota2_rocket_gift_id").addEventListener("click", function() {
            if (document.getElementById("dota2_rocket_gift_id").checked == true) {
                showMessage("【开始】抢礼物→火箭！！！", "info");
                get_rockets_gift = setInterval(() => {
                    dota2_rocket_func();
                    //clearInterval(get_rockets_gift);
                }, 2000);
            } else{
                showMessage("【停止】抢礼物→火箭！！！","error");
                clearInterval(get_rockets_gift);
            }
    });
    document.getElementById("dota2_airplane_gift_id").addEventListener("click", function() {
            if (document.getElementById("dota2_airplane_gift_id").checked == true) {
                showMessage("【开始】抢礼物→飞机！！！", "info");
                get_airplane_gift = setInterval(() => {
                    dota2_airplane_func();
                    //clearInterval(get_airplane_gift);
                }, 2000);
            } else{
                showMessage("【停止】抢礼物→飞机！！！","error");
                clearInterval(get_airplane_gift);
            }
	});
    document.getElementById("dota2_666_gift_id").addEventListener("click", function() {
            if (document.getElementById("dota2_666_gift_id").checked == true) {
                showMessage("【开始】抢礼物→鱼翅！！！", "info");
                get_666_gift = setInterval(() => {
                    dota2_666_func();
                    //clearInterval(get_666_gift);
                }, 2000);
            } else{
                showMessage("【停止】抢礼物→鱼翅！！！","error");
                clearInterval(get_666_gift);
            }
	});
    document.getElementById("dota2_100yw_gift_id").addEventListener("click", function() {
            if (document.getElementById("dota2_100yw_gift_id").checked == true) {
                showMessage("【开始】抢礼物→100鱼丸！！！", "info");
                get_100yw_gift = setInterval(() => {
                    dota2_100yw_func();
                    //clearInterval(get_100yw_gift);
                }, 2000);
            } else{
                showMessage("【停止】抢礼物→100鱼丸！！！","error");
                clearInterval(get_100yw_gift);
            }
	});
}

function wzry_function(){
    init_wzry_html();
    verify_token();
    let gift_id = setInterval(() => {
        if (typeof(wzrygiftid()) != "undefined") {
            wzry_gift();
            showMessage("开始执行抢礼物！", "info");
            clearInterval(gift_id);
        }
    }, 1000);
}


var curVersion = "2020.07.10.03"
function check_update() {
	fetch('https://greasyfork.org/zh-CN/scripts/407716',{
		method: 'GET',
		mode: 'cors',
		cache: 'no-store',
		credentials: 'omit',
	}).then(res => {
		return res.text();
	}).then(txt => {
		txt = (new DOMParser()).parseFromString(txt, 'text/html');
		let v = txt.getElementsByClassName("script-show-version")[1];
		if(v != undefined){
			if (v.innerText != curVersion) {
				update_script(true);
			}
		}
	}).catch(err => {
		console.error('请求失败', err);
	})
}

function update_script(x){
    let update_message = "";
    update_message += '<a href="https://greasyfork.org/zh-CN/scripts/407716" style="font-size:13px;" target="_blank">新版本来咯，点击立即我更新插件！</a>';
    if(x == true){
        showMessage(update_message, "warning");
    }
}

function init_dota2_html(){
    let html = "";
    let a = document.createElement("div");
    a.style = "float:left;"
    html += '<label><input type="checkbox" id="dota2_rocket_gift_id" name="dota2_free_gift" value="824">火箭</label>';
    html += '<label><input type="checkbox" id="dota2_airplane_gift_id" name="dota2_free_gift" value="825">飞机</label>';
    html += '<label><input type="checkbox" id="dota2_666_gift_id" name="dota2_free_gift" value="826">5鱼翅</label>';
    html += '<label><input type="checkbox" id="dota2_100yw_gift_id" name="dota2_free_gift" value="827">100鱼丸</label>';
    a.innerHTML = html;
    let b = document.getElementsByClassName("PlayerToolbar-Wealth")[0];
    b.insertBefore(a, b.childNodes[0]);
}

function init_wzry_html(){
    let html = "";
    let a = document.createElement("div");
    a.style = "float:left;font-size:18px;color:#ffffff;"
    html += '<label><input type="radio" name="wzry_free_gift" value="850">火箭</label>';
    html += '<label><input type="radio" name="wzry_free_gift" value="844">飞机</label>';
    html += '<label><input type="radio" name="wzry_free_gift" value="841">办卡</label>';
    html += '<label><input type="radio" name="wzry_free_gift" value="839">666</label>';
    a.innerHTML = html;
    let b = document.getElementsByClassName("vmScoreUserInfoV2")[0];
    b.insertBefore(a, b.childNodes[0]);
}

function getCookie(cookie_name){
	var allcookies = document.cookie;
	var cookie_pos = allcookies.indexOf(cookie_name);
	// 如果找到了索引，就代表cookie存在，
	// 反之，就说明不存在。
	if (cookie_pos != -1){
	// 把cookie_pos放在值的开始，只要给值加1即可。
		cookie_pos += cookie_name.length + 1;
		var cookie_end = allcookies.indexOf(";", cookie_pos);
		if (cookie_end == -1){
			cookie_end = allcookies.length;
		}
	var value = unescape(allcookies.substring(cookie_pos, cookie_end));
	}
	return value;
}

function initStyles() {
	let style = document.createElement("style");
	style.appendChild(document.createTextNode(
        `/*    Notice.css*/.noticejs-top{top:0;width:100%!important}.noticejs-top .item{border-radius:0!important;margin:0!important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100%!important}.noticejs-bottom .item{border-radius:0!important;margin:0!important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible!important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible!important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible!important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible!important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left!important;margin-left:7px;margin-right:0!important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs ::-webkit-scrollbar{width:8px}.noticejs ::-webkit-scrollbar-button{width:8px;height:5px}.noticejs ::-webkit-scrollbar-track{border-radius:10px}.noticejs ::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs ::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}
`));
	document.head.appendChild(style);
}

function showMessage(msg, type) {
	// type: success[green] error[red] warning[orange] info[blue]
	new NoticeJs({
		text: msg,
		type: type,
		position: 'bottomRight',
	}).show();
}

//String转Json
function strToJson(str){
    return JSON.parse(str);
}

(function() {
    'use strict';
    let intID = setInterval(() => {
        if (typeof(document.getElementsByClassName("BackpackButton")[0]) != "undefined"||typeof(document.getElementsByClassName("vmScoreUserInfoV2")[0]) != "undefined") {
            setTimeout(() => {
                init();
            }, 1500)
            clearInterval(intID);
        }
    }, 1000);

})();


function regetCookie(){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.douyu.com/japi/carnival/nc/common/generateCsrf', true);
    xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
    xhr.send('');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
			var res = xhr.responseText;
			console.log(res);
            if(strToJson(res).error == "0"){
                //history.go(0);
                showMessage("身份信息获取成功，请选择后开始执行！", "success");
            }else{
                showMessage("身份信息获取失败，请稍后重试！", "error");
            }
		}};
}

function verify_token(){
    console.log(getCookie('cvl_csrf_token'));
    if(typeof(getCookie('cvl_csrf_token'))=="undefined"){
        showMessage("正在重新获取身份信息！", "error");
        regetCookie();
    }else{
        showMessage("身份信息获取成功，请选择后开始执行！", "success");
    }
}

function cleardota2giftid(){
    var gift_list = document.getElementsByName("dota2_free_gift");
    for (var i = 0; i < gift_list.length; i++) {
        if (gift_list[i].checked == true) {
            gift_list[i].checked = false;
        }
    }
}

function dota2_rocket_func(){
    let gift_id = document.getElementById("dota2_rocket_gift_id").value;
    get_dota2_rocket(gift_id);
    get_dota2_rocket(gift_id);
    get_dota2_rocket(gift_id);
}

/*
XMLHttpRequest方法
*/
/*function get_dota2_rocket(gift_id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.douyu.com/japi/carnival/nc/point/exchangeGift', true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send('nameEn=20200605dplcdas2_credits1&giftId=' + gift_id + '&csrfToken=' + getCookie('cvl_csrf_token'));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var res = xhr.responseText;
            let ret = strToJson(res);
            if (ret.error == 0) {
                showMessage(ret.msg, "success");
                clearInterval(get_rockets_gift);
                document.getElementById("dota2_rocket_gift_id").checked = false;
            }else if(ret.error == 1000){
                //console.log(ret);
                if(ret.msg != "输入的请求参数错误"){
                    showMessage(ret.msg, "error");
                }
                clearInterval(get_rockets_gift);
                document.getElementById("dota2_rocket_gift_id").checked = false;
            }else if(ret.error == 1006){
                //console.log(ret);
                if(ret.msg == "本活动内的当前奖励额度你已全部领取，感谢参与"){
                    showMessage(ret.msg, "error");
                    clearInterval(get_rockets_gift);
                    document.getElementById("dota2_rocket_gift_id").checked = false;
                }else if(ret.msg == "您点击的太快了，请稍后重试~"){
                    if(document.getElementById("dota2_rocket_gift_id").checked == true){
                        get_dota2_rocket(gift_id);
                    }
                }
            }else if(ret.error == 9001){
                verify_token();
                if(document.getElementById("dota2_rocket_gift_id").checked == true){
                    get_dota2_rocket(gift_id);
                }
            }else if(ret.error == 70003){
                //console.log(ret);
                showMessage(ret.msg, "error");
                clearInterval(get_rockets_gift);
                document.getElementById("dota2_rocket_gift_id").checked = false;
            }else{
                console.log(ret);
                if(document.getElementById("dota2_rocket_gift_id").checked == true){
                    get_dota2_rocket(gift_id);
                }
            }
        }};
}*/

/*
fetch方法
*/
function get_dota2_rocket(gift_id) {
    fetch("https://www.douyu.com/japi/carnival/nc/point/exchangeGift", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'nameEn=20200605dplcdas2_credits1&giftId=' + gift_id + '&csrfToken=' + getCookie('cvl_csrf_token')
    }).then(res => {
        return res.json();
    }).then((ret) =>{
        let rocket_status = document.getElementById("dota2_rocket_gift_id");
        if (ret.error == 0) {
            showMessage("【火箭】→"+ret.msg, "success");
            clearInterval(get_rockets_gift);
            rocket_status.checked = false;
        }else if(ret.error == 1000){
            //console.log(ret);
            showMessage("【火箭】→"+ret.msg, "error");
            clearInterval(get_rockets_gift);
            rocket_status.checked = false;
        }else if(ret.error == 1006){
            //console.log(ret);
            if(ret.msg == "本活动内的当前奖励额度你已全部领取，感谢参与"){
                showMessage("【火箭】→"+ret.msg, "error");
                clearInterval(get_rockets_gift);
                rocket_status.checked = false;
            }else if(ret.msg == "您点击的太快了，请稍后重试~"){
                if(rocket_status.checked == true){
                    get_dota2_rocket(gift_id);
                }
            }
        }else if(ret.error == 9001){
            verify_token();
            if(rocket_status.checked == true){
                get_dota2_rocket(gift_id);
            }
        }else if(ret.error == 70003){
            //console.log(ret);
            showMessage(ret.msg, "error");
            clearInterval(get_rockets_gift);
            rocket_status.checked = false;
        }else{
            console.log(ret);
            if(rocket_status.checked == true){
                get_dota2_rocket(gift_id);
            }
        }
    })
}

function dota2_airplane_func(){
    let gift_id = document.getElementById("dota2_airplane_gift_id").value;
    get_dota2_airplane(gift_id);
    get_dota2_airplane(gift_id);
    get_dota2_airplane(gift_id);
}

function get_dota2_airplane(gift_id) {
    fetch("https://www.douyu.com/japi/carnival/nc/point/exchangeGift", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'nameEn=20200605dplcdas2_credits1&giftId=' + gift_id + '&csrfToken=' + getCookie('cvl_csrf_token')
    }).then(res => {
        return res.json();
    }).then((ret) =>{
        let airplane_status = document.getElementById("dota2_airplane_gift_id");
        if (ret.error == 0) {
            showMessage("【飞机】→"+ret.msg, "success");
            clearInterval(get_airplane_gift);
            airplane_status.checked = false;
        }else if(ret.error == 1000){
            //console.log(ret);
            showMessage("【飞机】→"+ret.msg, "error");
            clearInterval(get_airplane_gift);
            airplane_status.checked = false;
        }else if(ret.error == 1006){
            //console.log(ret);
            if(ret.msg == "本活动内的当前奖励额度你已全部领取，感谢参与"){
                showMessage("【飞机】→"+ret.msg, "error");
                clearInterval(get_airplane_gift);
                airplane_status.checked = false;
            }else if(ret.msg == "您点击的太快了，请稍后重试~"){
                if(airplane_status.checked == true){
                    get_dota2_airplane(gift_id);
                }
            }
        }else if(ret.error == 9001){
            verify_token();
            if(airplane_status.checked == true){
                get_dota2_airplane(gift_id);
            }
        }else if(ret.error == 70003){
            //console.log(ret);
            showMessage(ret.msg, "error");
            clearInterval(get_airplane_gift);
           airplane_status.checked = false;
        }else{
            console.log(ret);
            if(airplane_status.checked == true){
                get_dota2_airplane(gift_id);
            }
        }
    })
}

function dota2_666_func(){
    let gift_id = document.getElementById("dota2_666_gift_id").value;
    get_dota2_666(gift_id);
    get_dota2_666(gift_id);
    get_dota2_666(gift_id);
}

function get_dota2_666(gift_id) {
    fetch("https://www.douyu.com/japi/carnival/nc/point/exchangeGift", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'nameEn=20200605dplcdas2_credits1&giftId=' + gift_id + '&csrfToken=' + getCookie('cvl_csrf_token')
    }).then(res => {
        return res.json();
    }).then((ret) =>{
        let yc_status = document.getElementById("dota2_666_gift_id");
        if (ret.error == 0) {
            showMessage("【鱼翅】→"+ret.msg, "success");
            if(yc_status.checked == true){
                get_dota2_666(gift_id);
            }
        }else if(ret.error == 1000){
            //console.log(ret);
            showMessage("【鱼翅】→"+ret.msg, "error");
            clearInterval(get_666_gift);
            yc_status.checked = false;
        }else if(ret.error == 1006){
            //console.log(ret);
            if(ret.msg == "本活动内的当前奖励额度你已全部领取，感谢参与"){
                showMessage("【鱼翅】→"+ret.msg, "error");
                clearInterval(get_666_gift);
                yc_status.checked = false;
            }else if(ret.msg == "您点击的太快了，请稍后重试~"){
                if(yc_status.checked == true){
                    get_dota2_666(gift_id);
                }
            }
        }else if(ret.error == 9001){
            verify_token();
            if(yc_status.checked == true){
                get_dota2_666(gift_id);
            }
        }else if(ret.error == 70003){
            //console.log(ret);
            showMessage(ret.msg, "error");
            clearInterval(get_666_gift);
            yc_status.checked = false;
        }else{
            console.log(ret);
            if(yc_status.checked == true){
                get_dota2_666(gift_id);
            }
        }
    })
}

function dota2_100yw_func(){
    let gift_id = document.getElementById("dota2_100yw_gift_id").value;
    get_dota2_100yw(gift_id);
    get_dota2_100yw(gift_id);
    get_dota2_100yw(gift_id);
}

function get_dota2_100yw(gift_id) {
    fetch("https://www.douyu.com/japi/carnival/nc/point/exchangeGift", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'nameEn=20200605dplcdas2_credits1&giftId=' + gift_id + '&csrfToken=' + getCookie('cvl_csrf_token')
    }).then(res => {
        return res.json();
    }).then((ret) =>{
        let yw_status = document.getElementById("dota2_100yw_gift_id");
        if (ret.error == 0) {
            showMessage("【鱼丸】→"+ret.msg, "success");
            if(yw_status.checked == true){
                get_dota2_100yw(gift_id);
            }
        }else if(ret.error == 1000){
            //console.log(ret);
            showMessage("【鱼丸】→"+ret.msg, "error");
            clearInterval(get_100yw_gift);
            yw_status.checked = false;
        }else if(ret.error == 1006){
            //console.log(ret);
            if(ret.msg == "本活动内的当前奖励额度你已全部领取，感谢参与"){
                showMessage("【鱼丸】→"+ret.msg, "error");
                clearInterval(get_100yw_gift);
                yw_status.checked = false;
            }else if(ret.msg == "您点击的太快了，请稍后重试~"){
                if(yw_status.checked == true){
                    get_dota2_100yw(gift_id);
                }
            }
        }else if(ret.error == 9001){
            verify_token();
            if(yw_status.checked == true){
                get_dota2_100yw(gift_id);
            }
        }else if(ret.error == 70003){
            //console.log(ret);
            showMessage(ret.msg, "error");
            clearInterval(get_100yw_gift);
            yw_status.checked = false;
        }else{
            console.log(ret);
            if(yw_status.checked == true){
                get_dota2_100yw(gift_id);
            }
        }
    })
}

function wzrygiftid(){
    let giftid;
    let gift_list = document.getElementsByName("wzry_free_gift");
    let list_length = document.getElementsByName("wzry_free_gift").length;
    for (var i = 0; i < list_length; i++) {
        if (gift_list[i].checked == true) {
            giftid = gift_list[i].value;
        }
    }
    return giftid;
}

function wzry_gift(){
    function callback() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.douyu.com/japi/carnival/nc/point/exchangeGift', true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send('nameEn=20200610sgzl_credits1&giftId=' + wzrygiftid() + '&csrfToken=' + getCookie('cvl_csrf_token'));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = xhr.responseText;
                console.log(JSON.parse(res));
                if(strToJson(res).error == "0"){
                    showMessage(strToJson(res).msg, "success");
                }
            }};
        setTimeout(callback, 50);
    }
    setTimeout(callback, 50);
}

(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==='object'&&typeof module==='object')module.exports=factory();else if(typeof define==='function'&&define.amd)define("NoticeJs",[],factory);else if(typeof exports==='object')exports["NoticeJs"]=factory();else root["NoticeJs"]=factory()})(typeof self!=='undefined'?self:this,function(){return(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter})}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module['default']}:function getModuleExports(){return module};__webpack_require__.d(getter,'a',getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="dist/";return __webpack_require__(__webpack_require__.s=2)})([(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var noticeJsModalClassName=exports.noticeJsModalClassName='noticejs-modal';var closeAnimation=exports.closeAnimation='noticejs-fadeOut';var Defaults=exports.Defaults={title:'',text:'',type:'success',position:'topRight',timeout:30,progressBar:true,closeWith:['button'],animation:null,modal:false,scroll:{maxHeight:300,showOnHover:true},rtl:false,callbacks:{beforeShow:[],onShow:[],afterShow:[],onClose:[],afterClose:[],onClick:[],onHover:[],onTemplate:[]}}}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.appendNoticeJs=exports.addListener=exports.CloseItem=exports.AddModal=undefined;exports.getCallback=getCallback;var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}var options=API.Defaults;function getCallback(ref,eventName){if(ref.callbacks.hasOwnProperty(eventName)){ref.callbacks[eventName].forEach(function(cb){if(typeof cb==='function'){cb.apply(ref)}})}}var AddModal=exports.AddModal=function AddModal(){if(document.getElementsByClassName(API.noticeJsModalClassName).length<=0){var element=document.createElement('div');element.classList.add(API.noticeJsModalClassName);element.classList.add('noticejs-modal-open');document.body.appendChild(element);setTimeout(function(){element.className=API.noticeJsModalClassName},200)}};var CloseItem=exports.CloseItem=function CloseItem(item){getCallback(options,'onClose');if(options.animation!==null&&options.animation.close!==null){item.className+=' '+options.animation.close}setTimeout(function(){item.remove()},200);if(options.modal===true&&document.querySelectorAll("[noticejs-modal='true']").length>=1){document.querySelector('.noticejs-modal').className+=' noticejs-modal-close';setTimeout(function(){document.querySelector('.noticejs-modal').remove()},500)}var position='.'+item.closest('.noticejs').className.replace('noticejs','').trim();setTimeout(function(){if(document.querySelectorAll(position+' .item').length<=0){let p=document.querySelector(position);if(p!=null){p.remove()}}},500)};var addListener=exports.addListener=function addListener(item){if(options.closeWith.includes('button')){item.querySelector('.close').addEventListener('click',function(){CloseItem(item)})}if(options.closeWith.includes('click')){item.style.cursor='pointer';item.addEventListener('click',function(e){if(e.target.className!=='close'){getCallback(options,'onClick');CloseItem(item)}})}else{item.addEventListener('click',function(e){if(e.target.className!=='close'){getCallback(options,'onClick')}})}item.addEventListener('mouseover',function(){getCallback(options,'onHover')})};var appendNoticeJs=exports.appendNoticeJs=function appendNoticeJs(noticeJsHeader,noticeJsBody,noticeJsProgressBar){var target_class='.noticejs-'+options.position;var noticeJsItem=document.createElement('div');noticeJsItem.classList.add('item');noticeJsItem.classList.add(options.type);if(options.rtl===true){noticeJsItem.classList.add('noticejs-rtl')}if(noticeJsHeader&&noticeJsHeader!==''){noticeJsItem.appendChild(noticeJsHeader)}noticeJsItem.appendChild(noticeJsBody);if(noticeJsProgressBar&&noticeJsProgressBar!==''){noticeJsItem.appendChild(noticeJsProgressBar)}if(['top','bottom'].includes(options.position)){document.querySelector(target_class).innerHTML=''}if(options.animation!==null&&options.animation.open!==null){noticeJsItem.className+=' '+options.animation.open}if(options.modal===true){noticeJsItem.setAttribute('noticejs-modal','true');AddModal()}addListener(noticeJsItem,options.closeWith);getCallback(options,'beforeShow');getCallback(options,'onShow');document.querySelector(target_class).appendChild(noticeJsItem);getCallback(options,'afterShow');return noticeJsItem}}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _noticejs=__webpack_require__(3);var _noticejs2=_interopRequireDefault(_noticejs);var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);var _components=__webpack_require__(4);var _helpers=__webpack_require__(1);var helper=_interopRequireWildcard(_helpers);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var NoticeJs=function(){function NoticeJs(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,NoticeJs);this.options=Object.assign(API.Defaults,options);this.component=new _components.Components();this.on('beforeShow',this.options.callbacks.beforeShow);this.on('onShow',this.options.callbacks.onShow);this.on('afterShow',this.options.callbacks.afterShow);this.on('onClose',this.options.callbacks.onClose);this.on('afterClose',this.options.callbacks.afterClose);this.on('onClick',this.options.callbacks.onClick);this.on('onHover',this.options.callbacks.onHover);return this}_createClass(NoticeJs,[{key:'show',value:function show(){var container=this.component.createContainer();if(document.querySelector('.noticejs-'+this.options.position)===null){document.body.appendChild(container)}var noticeJsHeader=void 0;var noticeJsBody=void 0;var noticeJsProgressBar=void 0;noticeJsHeader=this.component.createHeader(this.options.title,this.options.closeWith);noticeJsBody=this.component.createBody(this.options.text);if(this.options.progressBar===true){noticeJsProgressBar=this.component.createProgressBar()}var noticeJs=helper.appendNoticeJs(noticeJsHeader,noticeJsBody,noticeJsProgressBar);return noticeJs}},{key:'on',value:function on(eventName){var cb=arguments.length>1&&arguments[1]!==undefined?arguments[1]:function(){};if(typeof cb==='function'&&this.options.callbacks.hasOwnProperty(eventName)){this.options.callbacks[eventName].push(cb)}return this}}]);return NoticeJs}();exports.default=NoticeJs;module.exports=exports['default']}),(function(module,exports){}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.Components=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);var _helpers=__webpack_require__(1);var helper=_interopRequireWildcard(_helpers);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var options=API.Defaults;var Components=exports.Components=function(){function Components(){_classCallCheck(this,Components)}_createClass(Components,[{key:'createContainer',value:function createContainer(){var element_class='noticejs-'+options.position;var element=document.createElement('div');element.classList.add('noticejs');element.classList.add(element_class);return element}},{key:'createHeader',value:function createHeader(){var element=void 0;if(options.title&&options.title!==''){element=document.createElement('div');element.setAttribute('class','noticejs-heading');element.textContent=options.title}if(options.closeWith.includes('button')){var close=document.createElement('div');close.setAttribute('class','close');close.innerHTML='&times;';if(element){element.appendChild(close)}else{element=close}}return element}},{key:'createBody',value:function createBody(){var element=document.createElement('div');element.setAttribute('class','noticejs-body');var content=document.createElement('div');content.setAttribute('class','noticejs-content');content.innerHTML=options.text;element.appendChild(content);if(options.scroll!==null&&options.scroll.maxHeight!==''){element.style.overflowY='auto';element.style.maxHeight=options.scroll.maxHeight+'px';if(options.scroll.showOnHover===true){element.style.visibility='hidden'}}return element}},{key:'createProgressBar',value:function createProgressBar(){var element=document.createElement('div');element.setAttribute('class','noticejs-progressbar');var bar=document.createElement('div');bar.setAttribute('class','noticejs-bar');element.appendChild(bar);if(options.progressBar===true&&typeof options.timeout!=='boolean'&&options.timeout!==false){var frame=function frame(){if(width<=0){clearInterval(id);var item=element.closest('div.item');if(options.animation!==null&&options.animation.close!==null){item.className=item.className.replace(new RegExp('(?:^|\\s)'+options.animation.open+'(?:\\s|$)'),' ');item.className+=' '+options.animation.close;var close_time=parseInt(options.timeout)+500;setTimeout(function(){helper.CloseItem(item)},close_time)}else{helper.CloseItem(item)}}else{width--;bar.style.width=width+'%'}};var width=100;var id=setInterval(frame,options.timeout)}return element}}]);return Components}()})])});

