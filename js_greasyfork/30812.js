// ==UserScript==
// @name         F5_tron
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @include      https://tron.f5net.com/sr/*
// @grant        GM_xmlhttpRequest
// @connect      tcc.taobao.com
// @connect      www.searchyellowdirectory.com
// @downloadURL https://update.greasyfork.org/scripts/30812/F5_tron.user.js
// @updateURL https://update.greasyfork.org/scripts/30812/F5_tron.meta.js
// ==/UserScript==

$(document).ready(function() {
    document.getElementById('sr-history').getElementsByClassName('sorting_asc')[0].click();
    (function () {
        up = document.createElement('span');
        up.classList = 'icon glyphicon-chevron-up';
        down = document.createElement('span');
        down.classList = 'icon glyphicon-chevron-down';
        down.style = "font-size: 15px; margin-left: 10px; float: left";
        up.style = "font-size: 15px; margin-left: 15px; margin-right: 15px; float:left";
        up.setAttribute("onclick","javascript:upper(this);");
        down.setAttribute("onclick","javascript:lower(this);");
        $('.history-title').each(function(i) {
            $(this).prepend(up.outerHTML);
            $(this).prepend(down.outerHTML);                    
        });
    }());
    var upper = function  upper(e) {
        //$this = e;
        var tmp1 =  $('td', $(e).closest('tr').prev())[0];
        if (tmp1.style.display === 'none') {
            upper(tmp1);
            return;
        }
        location.href = "#"+tmp1.id;
    };
    var lower = function lower(e) {
        var tmp1 = $('td', $(e).closest('tr').next())[0];
        if (tmp1.style.display === 'none') {
            lower(tmp1);
            return;
        }
        location.href = "#"+tmp1.id;
    };
    /* Used to change color */
    $('tr', $('#sr-history')).each (function(i) {
        xx = $('td' ,$(this)).eq(0).attr('data-type');
        if (/outbound/gi.test(xx)) {
            $(this).css('background','#02e5f4');
        } else if (/inbound/gi.test(xx)) {
            $(this).css('background','#f44941');
        } else if (/note/gi.test(xx)) {
            $(this).css('background','#81f49d');
        }
    });
    var ur = "http://www.searchyellowdirectory.com/reverse-phone/8615217765390";
    var xx = document.getElementsByClassName('friendly-select')[5];
    var x1 = xx.innerHTML;
    if (x1.substring(0,3) === '+86') {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel="+x1.substring(3),
            onload: function(response) {
                xx.innerHTML = x1 +' ( ' + eval(response.responseText).carrier  +' ) ';
            }
        });
    } else {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.searchyellowdirectory.com/reverse-phone/" + x1,
            onload: function(res) {
                //xx.innerHTML = xx.innerHTML+' ( ' + eval(response.responseText).carrier  +' ) ';
                x2 = $('.pb_country span.text_orange + span', res.response)[1].innerText;
                xx.innerHTML = x1 + ' ' + x2;
            }
        });
    }
    var div1 = document.createElement('div');
    div1.id = 'My_id';
    document.getElementById('form-sr-details').insertAdjacentElement('afterend',div1);

    var todo = function todo(e) {
        if(e.checked) {
            $('#sr-history > tbody > tr').each(function(i,x) {
                if($('td',x).attr('data-type').indexOf(e.id) >=0) {
                    x.style.display = 'table-row';
                }
            });
        } else {
            $('#sr-history > tbody > tr').each(function(i,x) {
                if($('td',x).attr('data-type').indexOf(e.id)>=0) {
                    x.style.display = 'none';
                }
            });
        }
    };
    var sc1 = document.createElement('script');
    sc1.innerHTML=todo.toString();
    sc1.innerHTML+=upper.toString();
    sc1.innerHTML+=lower.toString();
    $('body').append(sc1);
    function cd(typ) {
        var e = document.createElement('input');
        e.type = 'checkbox';
        e.setAttribute('checked',true);
        e.id = typ;
        e.setAttribute('onchange', 'todo(this)');
        var c = document.createElement('label');
        c.className='checkbox-inline';
        c.appendChild(e);
        c.innerHTML += typ;
        div1.appendChild(c);
    }

    cd('Outbound');
    cd('Inbound');
    cd('Research');
    cd('Notes');
    cd('Review');
    cd('Mentor');
});