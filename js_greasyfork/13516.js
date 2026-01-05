// ==UserScript==
// @name         JCB YOYO
// @namespace    http://your.homepage/
// @version      0.5.0.20160901
// @description  all confidential
// @author       Rophy Tsai
// @match        https://ezweb.easycard.com.tw/Event01/JCBLoginServlet*
// @match        https://ezweb.easycard.com.tw/Event01/JCBLoginRecordServlet*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13516/JCB%20YOYO.user.js
// @updateURL https://update.greasyfork.org/scripts/13516/JCB%20YOYO.meta.js
// ==/UserScript==

var cards = [
    // [  'credit card num ', 'yoyo card num' ],
    [ '1234 1234 ---- 0224', '1232 1234 2222 4123' ],
    [ '1234 1234 ---- 0225', '1232 1234 2222 4124' ],

];

console.log('lala');

var statusMsg = null;
var initDone = false;
function init() {
    
    if (!document || !document.body) {
        return setTimeout(init, 100);
    }

    if (initDone) return;
    
    initDone = true;
    
    console.log('onload');
    
    document.body.innerHTML += '<pre id="secretPanel"l style="position:fixed; top:4px; left; 4px; width: 240px; background-color: white; border: solid 1px red;"><button id="resetButton">Reset</button><br/></pre>';
    var panel = document.getElementById('secretPanel');
    
    setTimeout(function() {
        document.getElementById('resetButton').onclick = function() {
            console.log(this);
            localStorage.clear('records');
            this.innerHTML = 'CLICK ME TO RELOAD PAGE';
            this.onclick = function() {
                window.location.href = window.location.href;
            };
        };
    },200);

    var records = localStorage.getItem('records');
    if (records) {
        records = JSON.parse(records);
    } else {
        records = {};
    }

    var done = false;
    statusMsg = statusMsg || $('#content .success').text() || $('#content .step2.open h3').text();

    var focusCard = null;
    for(var i=0; i<cards.length; i++) {
        var card = cards[i];
        var cardnum = card[0].split(' ');
        var status = records[card[0]];
        if ( status ) {
            panel.innerHTML += (i+1) + ':' + cardnum[3] + ' - ' + status + '\n';
        } else {
            if (!focusCard) {
                focusCard = card;
                status = statusMsg || 'NEXT';
                panel.innerHTML += (i+1) + ':' + cardnum[3] + ' - '+status+'\n';
            } else {
                panel.innerHTML += (i+1) + ':' + cardnum[3] + ' - PENDING\n';
            }
        }
    }
    
    var captcha = null;

    window.addEventListener('message', function(event) {
        switch(event.data.type) {
            case 'captcha':
                captcha = event.data.value;
                console.log('set captcha', captcha);
                $('#captcha').val(captcha);
                panel.innerHTML = 'captcha:<div>'+captcha+'</div>\nhidCaptcha:<div>'+$('#hidCaptcha').val()+'</div>\nCookie:<div>'+document.cookie+'</div>\n'+ panel.innerHTML;
                if (!done) {
                    $('#form1').submit();
                }
                break;
            default:
                console.log('unknown message', event.data);
        }
    });
    
    var handle = setInterval(function() {
        if (!captcha) {
            console.log('reload captcha');
            document.getElementsByTagName("iframe")[0].src = document.getElementsByTagName("iframe")[0].src;
        } else {
            console.log('got captcha');
            clearInterval(handle);
        }
    }, 5000);
    
    if (!focusCard) {
        done = true;
        return;
    }
    
    if (statusMsg) {
        done = true;
        records[focusCard[0]] = statusMsg;
        var json = JSON.stringify(records);
        localStorage.setItem('records', json);
        if (focusCard) {
            console.log('reloading');
            window.location.href = window.location.href;
        }
        /*
        if (statusMsg.indexOf('本月份登錄名額已滿') != -1 ) {
            panel.append(statusMsg);
            return;
        }
        if (statusMsg.indexOf('登錄成功') != -1 || statusMsg.indexOf('查無資料!!') != -1) {
        }
        */
    }
    
    
    
    var cardnum = focusCard[0].split(' ');
    var yoyonum = focusCard[1].split(' ');

    $('#txtCreditCard1').val(cardnum[0]);
    $('#txtCreditCard2').val(cardnum[1]);
    $('#txtCreditCard4').val(cardnum[3]);


    $('#txtEasyCard1').val(yoyonum[0]);
    $('#txtEasyCard2').val(yoyonum[1]);
    $('#txtEasyCard3').val(yoyonum[2]);
    $('#txtEasyCard4').val(yoyonum[3]);
    $('#captcha').css('border', 'solid red 1px').focus();

    if( $('#accept').size() > 0 ) {
        if (!$('#accept').prop('checked')) $('#accept')[0].click();
    }

    

}

setTimeout(function() {
    if (!initDone) location.reload();
}, 10000);

// Replace default alert
var origAlert = alert;
alert = function(msg) {
    statusMsg = msg.trim();
};
window.onload = init;
setTimeout(init, 100);
