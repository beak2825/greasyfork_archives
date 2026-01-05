// ==UserScript==
// @name         TrafficHurricane
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Jose Enrique Ayala Villegas
// @match        https://www.traffichurricane.plus/*
// @match        http://www.traffichurricane.plus/*
// @match        *:///*Traffic-Config.html
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/27860/TrafficHurricane.user.js
// @updateURL https://update.greasyfork.org/scripts/27860/TrafficHurricane.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';
if (location.href == "https://www.traffichurricane.plus/member/account.php?ec=needupdate" || location.href == "https://www.traffichurricane.plus/member/seq_questions.php"){
    setTimeout(function(){location.href="https://www.traffichurricane.plus/member/overview.php";},30000);
}
userPrincipal = "joseeayalav";
userActual = undefined;
autoLogin = true;
captchaFail = false;
captchaSend = false;
vlto = "";
CFC = 0;
valueMin = 0.005;
valueMax = 0.01;
try{userActual = $('div[class="col-lg-6"]').filter(function(){return this.innerHTML.indexOf("Username:") != -1;})[0].innerHTML.split(": ")[1];}catch(e){}
getValue = GM_getValue;
setValue = GM_setValue;
userA = GM_getValue("userA");
datos = GM_getValue("users");
if(userA === undefined){userA = 0;GM_setValue("userA",userA);}
var pagina = location.href.split("/")[location.href.split("/").length-1];
var Suf = false;//(userActual == userPrincipal) ? true : false;
var Suf_limit = 50;
var key = "6f2b2e83ee317a5d265b4711f3ca1caf";
var cload = false;
var ckey;
var ckeyr;
var cid;
var img = "";
var can = "";
console.log(pagina);
switch(pagina){
    case "view_ad.php":
        view_ad();
        break;
    case "overview.php":
        if(!isSleep())
            overview(); else WaitSleep();
        break;
    case "adview.php":
        adview(0);
        break;
    case "seecashlinks.php":
        if(!isSleep())
            seecashlinks(); else WaitSleep();
        break;
    case "viewlink.php":
        if(!isSleep())
            viewlink(0); else WaitSleep();
        break;
    case "login": case "login.php":
        login();
        break;
    case "index.php": case "index":
        location.href = "https://www.traffichurricane.plus/login";
        break;
    case "claim.php?n=50":
        location.href = "https://www.traffichurricane.plus/member/overview.php";
        break;
    default:
        if(location.href.indexOf('http://www.traffichurricane.plus/member/adview_start.php?ad') != -1)
            adview(0);
        break;
}

function login(){
    DF();
    if(autoLogin){
        if(getData("user") !== null && getData("pass") !== null){
            if(!document.querySelector('*[class="alert alert-danger"]')) logear = true; else
                if(!!document.querySelector('*[class="alert alert-danger"]').textContent.match("robot")) logear = true; else
                    if(!!document.querySelector('*[class="alert alert-danger"]').textContent.match("incorrect")) logear = false; else
                        if(!!document.querySelector('*[class="alert alert-danger"]').textContent.match("database")) logear = false;
            if(logear){
                document.getElementsByName("Username")[0].value = getData("user");
                document.getElementsByName("Password")[0].value = getData("pass");
                if(getData("loginIn") !== null){
                    if (((new Date().getTime() - parseInt(getData("loginIn"))) / 1000) / 60 > 5){
                        if(!document.querySelector('*[class="alert alert-danger"]').textContent.match("incorrect")){
                            getCaptcha(document.querySelector('img[title="5 Failed Attempts will Block your Account"]'),document.querySelector('input[name="turing"]'),document.querySelector('input[type="submit"]'));
                            setData("loginIn",new Date().getTime());
                        }
                    } else {setTimeout(function(){location.reload();},120000);}
                } else {getCaptcha(document.querySelector('img[title="5 Failed Attempts will Block your Account"]'),document.querySelector('input[name="turing"]'),document.querySelector('input[type="submit"]'));}
            }
        }
    }
}

function view_ad(){
    KeepActive();
    try{$('span[class="btn btn-xs btn-info"]')[0].click();}catch(e){setTimeout(function(){view_ad();},1000);}
}

function overview(){
    DF();
    if(Suf)
        try{$('b[style="color:red"]').each(function(){return this.parentElement.nextElementSibling.click();});}catch(e){}
    if($('b[style="color:red"]').length === 0 || !Suf)
        if(getData("doClaim") === null){
            try{$('a').filter(function(){return this.innerHTML.indexOf("Click Here to Go to Cash Links") != -1;})[0].click();}catch(e){setTimeout(function(){location.reload();},60000);}
        } else if(getData("doClaim") == "true"){
            setData("doClaim","false");
            setTimeout(function(){location.reload();},60000);
        } else if(getData("doClaim") == "false"){
            try{$('a').filter(function(){return this.innerHTML.indexOf("Click Here to Go to Cash Links") != -1;})[0].click();}catch(e){setTimeout(function(){location.reload();},60000);}
        }
}

function adview(n){
    KeepActive();
    console.log("Adview");
    var nads = parseInt($('div[style="float:left;width:40%"]')[0].innerText.split(" ")[12]);
    switch(n){
        case 0:
            try{ $('#site_loader a').filter(function(){return this.textContent === $('#site_loader h3').get(0).textContent.split(': ')[1].replace('.','');}).get(0).click(); setTimeout(function(){adview(n+1);},1000);}
            catch(e){setTimeout(function(){adview(n);},1000);}
            break;
        case 1:
            try{ if(nads <= Suf_limit || Suf_limit === 0){$('#form_confirm > div > a').filter(function(){return this.innerHTML == "Next Site";})[0].click(); setTimeout(function(){adview(n+1);},1000); } else {$('a[class="btn btn-xs btn-info"]').filter(function(){return this.innerHTML.indexOf("Back to Account") !== -1;})[0].click();}}
            catch(e){setTimeout(function(){adview(n);},1000);}
            break;
    }

}

function seecashlinks(){
    var List = $('div[class="coverads"] > div >> a').filter(function(){var value=parseFloat(this.parentElement.previousElementSibling.getElementsByTagName("b")[0].innerHTML.split("$")[1]); return (value >= valueMin && value <= valueMax);});
    try{List[List.length-1].click();}catch(e){
        try{$('a').filter(function(){return this.innerHTML.indexOf("Click Here to Go to Dashboard") != -1;})[0].click();}catch(w){
            if(List.length === 0) {
                if($('a').filter(function(){return this.innerHTML.indexOf("Click Here to Go to Dashboard") !== -1;}).length === 0){
                    //console.log("RP");
                    //setTimeout(function(){location.reload();},60000);
                    DF();
                    setData("doClaim",true);
                    location.href = "https://www.traffichurricane.plus/member/overview.php";
                }
            }
        }
    }
}

function viewlink(n){
    //$('#turing')[0].value
    KeepActive();
    console.log("viewlink - "+n);
    ckeyr = 0;
    console.log("Valgo: " + ckeyr);
    switch (n){
        case 0:
            clearTimeout(vlto);
            getBase64($('#form_confirm > img')[0]);
            break;
        case 1:
            clearTimeout(vlto);
            if(captchaFail || !captchaSend){
                if(captchaFail) CFC++;
                if(CFC > 1) location.href = "https://www.traffichurricane.plus/member/overview.php";
                else
                    $.post("https://2captcha.com/in.php",{"method":"base64","key":key,"body":ckey,"header_acao":1},function(data){
                        captchaFail = false;
                        if(data.indexOf("OK") != -1){cid = data.split("OK|")[1];viewlink(2);captchaSend = true;}
                    });
            }
            break;
        case 2:
            clearTimeout(vlto);
            $.get("https://2captcha.com/res.php?key="+key+"&action=get&id="+cid+"&header_acao=1",null,function(data){
                if(data.indexOf("OK") != -1){ckeyr=0;ckeyr=0;ckeyr=0;ckeyr=0;ckeyr=0;ckeyr = data.split("OK|")[1];$('#turing')[0].value = ckeyr;console.log("Toma: "+ckeyr);viewlink(3);} else
                    if(data == "CAPCHA_NOT_READY"){vlto = setTimeout(function(){viewlink(2);},1000);} else
                        if(data == "ERROR_CAPTCHA_UNSOLVABLE"){console.log("No se pudo Resolver");}
            });
            break;
        case 3:
            clearTimeout(vlto);
            if($('#form_confirm')[0].style.display == "none") {setTimeout(function(){viewlink(3);},1000);} else {
                $('#form_confirm > a')[0].click();viewlink(4);
            }
            break;
        case 4:
            clearTimeout(vlto);
            try{ $('#form_confirm >> a').filter(function(){return this.innerHTML.indexOf("Back to Account") !== -1;})[0].click(); }
            catch(e){
                if($('#turing')[0].style.border == "2px solid red"){
                    $.get("https://2captcha.com/res.php?key="+key+"&action=reportbad&id="+caid+"&header_acao=1",null,function(data){
                        console.log(data);
                    });
                    captchaFail = true;
                    viewlink(0);
                } else
                    vlto = setTimeout(function(){viewlink(4);},1000);
            }
            /*if($('#form_confirm >> a').filter(function(){return this.parentNode.innerHTML.indexOf("Thank you. Your click has been credited!") != -1}).length > 0){
            $('#form_confirm >> a').filter(function(){return this.parentNode.innerHTML.indexOf("Thank you. Your click has been credited!") != -1})[0].click();
            } else {setTimeout(function(){viewlink(4);},1000);}*/
            break;
    }
}

function getBase64(imgg){
    clearTimeout(vlto);
    //img = $('#form_confirm > img')[0];
    img = imgg;
    can = document.createElement('canvas');var ctx = can.getContext('2d');
    img.onload = function(){
        can.width  = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ckey = can.toDataURL('image/jpeg');
        cload = true;
        vlto = setTimeout(function(){viewlink(1);},1000);
    };
    if($('#form_confirm > img')[0].complete)
        img.onload();
}

function getCaptcha(imgg,input,boton){
    clearTimeout(vlto);
    img = imgg;
    img.removeAttribute("style");
    can = document.createElement('canvas');var ctx = can.getContext('2d');
    img.onload = function(){
        can.width  = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ckey = can.toDataURL('image/jpeg');
        cload = true;
        clearTimeout(vlto);
        vlto = setTimeout(function(){SC(ckey,input,boton);},1000);
    };
    if(img.complete)
        img.onload();
}
function SC(base,input,boton){
    $.post("https://2captcha.com/in.php",{"method":"base64","key":key,"body":base,"header_acao":1},function(data){
        if(data.indexOf("OK") != -1){cid = data.split("OK|")[1];WFC(cid,input,boton);}
    });
}
function WFC(caid,input,boton){
    $.get("https://2captcha.com/res.php?key="+key+"&action=get&id="+caid+"&header_acao=1",null,function(data){
        if(data.indexOf("OK") != -1){ckeyr = data.split("OK|")[1];input.value = ckeyr;boton.click();console.log("Toma: "+ckeyr);} else
            if(data == "CAPCHA_NOT_READY"){setTimeout(function(){WFC(caid,input,boton);},1000);} else
                if(data == "ERROR_CAPTCHA_UNSOLVABLE"){console.log("No se pudo Resolver");}
    });
}

function KeepActive(){
    window.onfocus();
    try{$('#paused > a')[0].click();}catch(e){}
}

if(location.href.indexOf("Traffic-Config.html") != -1){
    console.log("Traffic-Config");
    datos = GM_getValue("users");
    if(datos){
        console.log(datos.length);
        for(var i=0; i < datos.length; i++){
            $('.user')[i].value = datos[i][0];
            $('.pass')[i].value = datos[i][1];
            //$('.code')[i].value = datos[i][2];
            if(i != datos.length-1)
                add();
        }
    }
    checkSave();
    function checkSave(){
        if(!guardar){
            setTimeout(function(){checkSave();},1000);
        } else {
            GM_setValue("users",datos);
            guardar = !guardar;
            setTimeout(function(){checkSave();},1000);
        }
    }
}
if(location.href == "https://www.traffichurricane.plus/login"){
    atras = document.createElement("input");
    atras.type = "button";
    adelante = atras.cloneNode();
    botonP = atras.cloneNode();
    adelante.id="adelante";
    atras.setAttribute("style","margin-left:15px;");
    atras.id="atras";
    atras.value = "<";
    adelante.value= ">";
    $(atras).insertBefore($(".row")[1]);
    $(adelante).insertAfter(atras);
    span = document.createElement("span");
    span2 = document.createElement("span");
    span2.innerHTML = "   ";
    span.id = "index";
    $(span).insertAfter(atras);
    botonP.value = "Ver Usuarios";
    botonP.setAttribute("style","margin-left:15px;");
    $(botonP).insertBefore(atras);
    $(span2).insertAfter($('input[class="btn btn-info"')[0]);
    $(span).hide();$(atras).hide();$(adelante).hide();
    botonP.onclick = function(){
        $(this).hide();
        $(atras).show();$(adelante).show();$(span).show();
        showData();
    };

    function showData(){
        try{
            $('input[name="Username"]')[0].value = datos[userA][0];$('input[name="Password"]')[0].value = datos[userA][1];
        } catch(e){$('input[name="username"]')[0].value = datos[userA][0];$('input[name="password"]')[0].value = datos[userA][1];}
        $('#index')[0].innerHTML = "  " + (userA+1) + "/" + datos.length + "  ";
    }
    adelante.onclick=function(){
        if(userA < datos.length-1){
            userA++;
            GM_setValue("userA",userA);
        }
        showData();
    };
    atras.onclick=function(){
        if(userA > 0){
            userA--;
            GM_setValue("userA",userA);
        }
        showData();
    };
}

function WaitSleep(){
    //min = new Date().getMinutes();
    if(isSleep()){
        setTimeout(WaitSleep,5000);
    } else location.reload();
}

function isSleep(){
    min = new Date().getMinutes();
    return (min >= 58 && min < 05);
}
function DF(){
    setData = function(dato,valor){
        sessionStorage.setItem(dato,valor);
    };

    getData  = function(dato){
        return sessionStorage.getItem(dato);
    };
    try{
        forma = document.getElementsByName("LoginForm")[0];
        forma.onsubmit = function(){
            setData("user",document.getElementsByName("Username")[0].value);
            setData("pass",document.getElementsByName("Password")[0].value);
        };} catch(e){}
}