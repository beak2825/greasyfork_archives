// ==UserScript==
// @name         shrtz.me Ad Patch
// @namespace    Shortzon
// @version      2.2
// @description  Patches most Shortzon shrtz.me/shrink.me clones to remove ads, timer, and make them automatically proceed after captcha is solved.
// @author       4channel Pirate
// @include      http://*/*
// @include      https://*/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/386992/shrtzme%20Ad%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/386992/shrtzme%20Ad%20Patch.meta.js
// ==/UserScript==
// 

var timeValShortZon = 1000;
var counteTimerShortZon = null;
var sentShortZon = false;
var counterTextShortZon = 'unset';

autoProceed = function() {
    if ($('#go-link').length) {
        sendDirect();
        if (counterTextShortZon == 'unset'){
          counterTextShortZon = app_vars.counter_value/2;
          app_vars.counter_value = Math.floor(Math.random()*(999 - 10 + 1) )+10;
          
        }
        if (counteTimerShortZon == null && counterTextShortZon != 0) {
            counteTimerShortZon = setInterval(function() {
                  counterTextShortZon = counterTextShortZon-1;
            }, 1000);
        }
        if (counterTextShortZon < 1 && sentShortZon == false) {
            clearInterval(counteTimerShortZon);
            counterTextShortZon = 0;
            sendSubmit();
        }
        $('#go-link.go-link').submit(function(e) { 
            e.preventDefault();
        }); 
        //$(counter_start_object).off();
        var n = $('#go-link').find('button');
        var p = $('.box-main:first').children('h4');
        $('.box-main:first').css({'visibility':'hidden'});
        n.css({'visibility':'visible'});
        p.css({'visibility':'visible'});
        p.html('Your link is almost ready!<br>Please wait: ' + counterTextShortZon);
    }
    var autoSubmit = window.setInterval(function() {
        var subBtn = $('#invisibleCaptchaShortlink');
        var subBtnTxt = 'V2FpdGluZyBmb3IgeW91IHRvIHNvbHZlIHRoZSBjYXB0Y2hhLi4u';
        if (subBtn.length && subBtn.is(':enabled') && subBtn.text() == atob(subBtnTxt)) {
            subBtn.text(atob('UHJvY2Vzc2luZyBzb2x2ZWQgY2FwdGNoYSBhbnN3ZXIgbm93Li4u'));
            $('#link-view').submit();
        }
        if (subBtn.length && subBtn.is(':disabled')) {
            subBtn.text(atob(subBtnTxt));
        }
    }, timeValShortZon);
    $(document).add('*').off();
};

autoFixPage = function() {
    if ($('footer').length) {
        $('.text-left,strong').remove();
        $('#link-view').contents().filter(function() {
              return (this.nodeType == 3);
        }).remove();
        $('#link-view').find('br,center:eq(1)').remove();
        $('.cookie-message,.cookie-confirm').parent().remove();
        $('center:eq(0),#mainNav,#cookie-pop,.banner-inner,.banner,footer').remove();
        $('.box-main').css({'border': 'none'});
        $('#invisibleCaptchaShortlink').html('Submit');
        $(document).add('*').off();
    }
};

function sendSubmit() {
    var e = $('#go-link');
    var d = getCookie('form_data');
    var a = getCookie('form_action');
    var n = e.find('button');
    var z = e.attr('action');
    var j = e.serialize();
    var p = $('.box-main:first').children('h4');
    if (d.length && a.length) {
      j = atob(d);
      z = atob(a);
    }
    if (z.length && j.length) {
        setCookie('form_action',btoa(z),365);
        setCookie('form_data',btoa(j),365);
    }
    $.ajax({
        dataType: 'json',
        type: 'DELETE',
        url: z,
        data: j,
        beforeSend: function(t) {
            'banner' === ad_type && (n.attr('disabled', 'disabled'),$('a.get-link').text(atob('TGVhdmluZyBzaGl0dHkgYWQgc2l0ZS4uLiB3YWl0IG9uZSBtb21lbnQgYnJv'))), 'interstitial' === ad_type && n.attr('disabled', 'disabled');
        },
        success: function(t, e, n) {
            if (t && t.url.length != 0) {
                    p.append('<h4>' + atob('WW91ciBsaW5rIGlzIHJlYWR5LiBSZWRpcmVjdGluZyB0byB5b3VyIGxpbmsgbm93IQ') + '<br><a id="MyLinkTZ" style="text-transform: none;" href="' + t.url + '">' + t.url + '</a></h4>');
                    $(location).attr('href',t.url);
                    sendDirect();
            }
        },
        error: function(t, e, n) {},
        complete: function(t, e) {}
    });
    sentShortZon = true;
};


function sendDirect() {
    var a = atob(getCookie('form_action'));
    var b = atob(getCookie('form_data'));
    var sentAjax = false;
  if (!sentAjax) {
        sentAjax = true;
        $.ajax({
            dataType: 'json',
            type: 'DELETE',
            url: a,
            data: b,
            success: function(t, e, n) {
                if (t && t.url.length != 0) {
                        $(location).attr('href',t.url);
                }
            },
            error: function(t, e, n) {
                //setCookie('form_action','',0);
                //setCookie('form_data','',0);
                //location.reload();
            },
            complete: function(t, e) {}
        });
    }
};

function isValid(obj) {
    return (obj === undefined || obj == null || obj.length <= 0) ? true : false;
};

function isBase64(str) {
    if (str ==='' || str.trim() ===''){ return false; }
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
};

$(document).ready(function() {
    var mwlii = 'TWFkZSUyMHdpdGglMjAlRTIlOTklQTUlMjBpbiUyMEluZGlh';
        mwlii =  decodeURIComponent(atob(mwlii));
    var shrnk = Boolean(typeof app_vars !== 'undefined' && Object.keys(app_vars).length > 20 && document.cookie.indexOf('ab='));
    if ($(document).text().split(mwlii).length-1 || shrnk) {
        window.setInterval('autoFixPage(); autoProceed();', timeValShortZon);
    if ($('.box-main').length) {
            $('.box-main:first').parent().contents().filter(function () {
              return this.nodeType === 3; 
            }).remove();
            $('html').children().css({'visibility':'hidden'});
            $('.box-main:first').css({'visibility':'visible','border':'medium none','background':'transparent none repeat scroll 0% 0%','top':'50%','left':'50%','position':'relative','transform':'translate(-50%, 50%)'});
            $('.adsbygoogle').remove();
            $('img:not("#invisibleCaptchaShortlink"),a').remove();
            if (isBase64(getCookie('form_action')) && isBase64(getCookie('form_data'))) {
                sendDirect();
                return true;
            }
        }
    //kill basic anti-adblock
    var bxmn = document.getElementsByClassName('box-main')[0];
    if (bxmn !== undefined) {
            bxmn.addEventListener('DOMSubtreeModified',function () { 
                setCookie('ab', '1', 1);
            }, false);
        }
    }
});
//find and kill advanced anti-adblock
(function(window) {
    var windowKeysDefault = Object.keys(window);
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    var pivot = 'Ly93d3cuZ29vZ2xlLmNvbS9hZHNlbnNlL3N0YXJ0L2ltYWdlcy9mYXZpY29uLmljbw==';

    document.addEventListener('DOMContentLoaded', function() {
        var windowKeysSuspect = Object.keys(window)
            .filter(function(x){return windowKeysDefault.indexOf(x) === -1 && x.length == 12;});

        for(var i = 0; i < windowKeysSuspect.length; i++) {
            var suspectName = windowKeysSuspect[i];

            if(isFirefox) {
                var suspect = window[suspectName];
                var suspectKeys = Object.keys(suspect);
                var found = false;

                for (var ii in suspectKeys) {
                    var source = suspect[suspectKeys[ii]].toSource();
                    found = source.indexOf(pivot) !== -1;

                    if (found) break;
                }
            } else {
                found = /\D\d\D/.exec(suspectName) !== null;
            }

            if(found) {
                console.log('Found BlockAdBlock with name ' + suspectName);
                delete window[suspectName];
            }
        }
    });
})(window);