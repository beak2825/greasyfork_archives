// ==UserScript==
// @name         流浪商人接口
// @version      0.5
// @author       酷月
// @match        https://lostmerchants.com/
// @connect      lostmerchants.com
// @grant        none
// @description  自用流浪商人接口
// @license           LGPLv3
// @namespace https://greasyfork.org/users/949427
// @downloadURL https://update.greasyfork.org/scripts/463923/%E6%B5%81%E6%B5%AA%E5%95%86%E4%BA%BA%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/463923/%E6%B5%81%E6%B5%AA%E5%95%86%E4%BA%BA%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==


function jsonpProcess (data) {
    console.log(data)
}

function getClassName(param){
    var modalityArrClassName = '';
    if(param.match(/[\(\)\[\]\{\}]/g)){
        modalityArrClassName= param.replace('(','').replace(')','');
    }else{
        modalityArrClassName= param;
    }
    return modalityArrClassName;
}

function jsonp_Script (id,data) {
    var _script = document.createElement("script");
    _script.type = "text/javascript";
    _script.src = "https://www.myzc.online/lost/1.PHP?lostmerchants="+data+"&id="+id;
    document.head.appendChild(_script);
}




var timer;
timer = setInterval((function() {
    var a,b,s,y,e,i;
    var myDate = new Date();
    s = document.getElementsByClassName("alert alert-danger");
    if(s.length > 0){
        if(s[0].innerText == "Disconnected from server. Try to Reload." ){
            if(e > 12){
                e = 0;
                location.reload();
            }else
            {
                e = e + 1;
            }

        }

    }


    if (myDate.getMinutes()>30 && myDate.getMinutes()<55)
    {
        i = document.getElementsByClassName("merchant merchant-grid__item ");
        if(i.length>1)
        {
            for (let o = 0;i.length > o ; o++){
                s = i[o].getElementsByClassName("empty-card__submit-location");
                if(s.length==0){
                    s=i[o].getElementsByClassName("card-frame__title");
                    b=i[o].getElementsByClassName("card-frame__inner ")
                    y=b[b.length-1].querySelectorAll("span")
                    a = s[s.length-2].innerText + "|"+ getClassName(s[s.length-1].innerText) + "|" + y[0].innerText + "|" + y[1].innerText;
                    jsonp_Script(o,a);
                }
            }
        }
    }
}),5000);
