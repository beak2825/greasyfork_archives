// ==UserScript==
// @name         AWS
// @namespace    saqfish
// @version      1.5
// @description  AWS script
// @author       saqfish
// @match        https://app.hubspot.com/biden/disputes/*
// @include      *
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/25496/AWS.user.js
// @updateURL https://update.greasyfork.org/scripts/25496/AWS.meta.js
// ==/UserScript==
if (window.location.toString().toLowerCase().indexOf("https://app.hubspot.com/") != -1){
    var winder;
    if(winder){
        winder.locaiton.href = $('a').attr('href');
        winder.blur();
        winder.focus();
    }else{
        winder = window.open($('a').attr('href'),"blah","height=500,width=700");
    }
    window.addEventListener('message',function(event) {
        console.log(event.data);
        var a = event.data;
        switch(a.A){
            case "1":
                var num = a.B.replace("b",'');
                console.log(num);
                $('input').eq(num).prop('checked',true);
                break;
            case "2":
                $('input[name="companyNameAnswer"]').val(a.B);
                break;
            case "3":
                if(a.B == "submit"){
                    $('button[type=submit').click();
                }
        }
    },false);
}

if (window.location.toString().toLowerCase().indexOf("https://app.hubspot.com/biden/disputes/") == -1){

    $(document).keypress(function(e) {
        switch(e.which) {
            case 50: // 1
                sendit("1","b1");
                break;

            case 51: // 2
                sendit("1","b2");
                break;

            case 52: // 3
                sendit("1","b3");
                break;

            case 53: // 4
                sendit("1","b4");
                break;
            case 54: // 5
                sendit("1","b5");
                break;
                case 13: // tab
                sendit("3","submit");
                break;

            default: return;
        }
        e.preventDefault();
    });

    $('body').bind('mouseup', function(e){
        var selection;

        if (window.getSelection) {
            s = window.getSelection();
        } else if (document.selection) {
            s = document.selection.createRange();
        }
        sendit("2",s.toString());
    });

}

function sendit(f,f2){
    window.opener.postMessage({A: f, B: f2},'*'); 
}