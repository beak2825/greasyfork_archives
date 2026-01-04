// ==UserScript==
// @name         Tron_sr_page
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @include      https://tron.f5net.com/sr/*
// @grant        GM_xmlhttpRequest
// @connect      tcc.taobao.com
// @connect      www.searchyellowdirectory.com
// @downloadURL https://update.greasyfork.org/scripts/395077/Tron_sr_page.user.js
// @updateURL https://update.greasyfork.org/scripts/395077/Tron_sr_page.meta.js
// ==/UserScript==


$(document).ready(function() {
    document.getElementById('sr-history').getElementsByClassName('sorting_asc')[0].click();
    var l3 = ["liuhfe@digitalchina.com","xujgc@digitalchina.com","zhangjins@digitalchina.com","zhangyju@digitalchina.com","xuhtd@digitalchina.com","xiexca@digitalchina.com",
              "xiaoyqc@digitalchina.com","chenquanb@digitalchina.com","guqy@digitalchina.com","chengqiand@digitalchina.com","yuyxa@digitalchina.com","zhaozhd@digitalchina.com",
              "zhaoywe@digitalchina.com","wufanb@digitalchian.com","wangzbc@digitalchina.com","huypf@digitalchina.com","lixdx@digitalchina.com","zhangxlba@digitalchina.com",
              "kongxxc@digitalchina.com","zhugc1@digitalchina.com","huangytb@digitalchina.com","yanyjg@digitalchina.com","wangdba@digitalchina.com","wanghrg@digitalchina.com",
              "cole.cai@f5asc.com","chenchengn@digitalchina.com","unix.wang@f5asc.com","zzwx@digitalchina.com","liuhao@holyzone.com.cn","lilong@holyzone.com.cn","luojiao@holyzone.com.cn",
              "liuyang@holyzone.com.cn","liuhuan@holyzone.com.cn","wyy@holyzone.com.cn","wzh@holyzone.com.cn","wjw@holyzone.com.cn","lja@holyzone.com.cn","yaohang@holyzone.com.cn","rongkun@holyzone.com.cn",
              "zsp@holyzone.com.cn","syf@holyzone.com.cn","lxc@holyzone.com.cn","wanghao@holyzone.com.cn","oqg@holyzone.com.cn","pengyi@holyzone.com.cn","li_sq@holyzone.com.cn","hyx@holyzone.com.cn","zxd@holyzone.com.cn",
              "huangweijian@eccom.com.cn","wangfei@eccom.com.cn","joshan.fan@netfos.com.tw","leo.jiang@netfos.com.tw","Poseidon.Wang@ingrammicro.com","Jason.Xu@ingrammicro.com","jian.yang@ingrammicro.com","binping.chen@ingrammicro.com",
              "David.Ge@ingrammicro.com","Xiongwei.Zhang@ingrammicro.com"];
    var customeremail = $('.contact-email',$('#sr-header'));
    if(l3.indexOf(customeremail.text()) >= 0) customeremail[0].style.backgroundColor = 'lightpink';
    //console.log('loaded');
    (function () {
        $('#type').on('change', ()=>{
            if ($('#type :selected').text() == 'Problem, Analysis, Resolution') {
                $('#comment').val('P:\nA:\nR:\n');
            }
        });
        var up = document.createElement('span');
        up.classList = 'icon glyphicon-chevron-up';
        var down = document.createElement('span');
        down.classList = 'icon glyphicon-chevron-down';
        down.style = "font-size: 15px; margin-left: 10px; float: left";
        up.style = "font-size: 15px; margin-left: 15px; margin-right: 15px; float:left";
        up.setAttribute("onclick","javascript:upper(this);");
        down.setAttribute("onclick","javascript:lower(this);");
        //up.addEventListener('click',upper,{passive: true});
        //down.addEventListener('click',lower,{passive: true});
        $('.history-title').each(function(i) {
            $(this).prepend(up.outerHTML);
            $(this).prepend(down.outerHTML);
        });
    }());
    var upper = function  upper(e) {
        //$this = e;
        //console.log('upper');
        var tmp1 =  $('td', $(e).closest('tr').prev())[0];
        //var tmp1 = e.tagName === 'TR' ? e : $(e).closest('tr').next()[0];
        if (tmp1.style.display === 'none') {
            upper(tmp1);
            return;
        }
        location.href = "#"+tmp1.id;
    };
    var lower = function lower(e) {
        console.log('lower');
        //e.stopPropagation();
        //e.preventDefault();
        var tmp1 = $('td', $(e).closest('tr').next())[0];
        //var tmp1 = e.tagName === 'TR' ? e : $(e).closest('tr').next()[0];
        //console.log(tmp1);
        //console.log(tmp1.style.display);
        if (tmp1.style.display === 'none') {
            //console.log(tmp1);
            lower(tmp1);
            return;
        }
        location.href = "#"+tmp1.id;
    };
    /* Used to change color */
    $('tr', $('#sr-history')).each (function(i) {
        xx = $('td' ,$(this)).eq(0).attr('data-type');
        //console.log(xx);
        if (/outbound/gi.test(xx)) {
            //console.log(i + 'out');
            $(this).css('background','#02e5f4');
        } else if (/inbound/gi.test(xx)) {
            //console.log(i + 'in');
            $(this).css('background','#f44941');
        } else if (/note/gi.test(xx)) {
            //console.log(i + 'notes');
            $(this).css('background','#81f49d');
        }
    });
    var ur = "http://www.searchyellowdirectory.com/reverse-phone/8615217765390";
    var xx = document.getElementsByClassName('friendly-select')[3];
    var x1 = xx.innerHTML;
    console.log('x1 ' + x1);
    if (x1.substring(0,3) === '+86') {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel="+x1.substring(3),
            onload: function(response) {
                //console.log(eval(response.responseText).carrier);
                xx.innerHTML = x1 +' ( ' + eval(response.responseText).carrier  +' ) ';
            }
        });
    } else {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://www.searchyellowdirectory.com/reverse-phone/" + x1,
            onload: function(res) {
                //console.log(eval(response.responseText).carrier);
                //xx.innerHTML = xx.innerHTML+' ( ' + eval(response.responseText).carrier  +' ) ';
                var x2 = $('.pb_country span.text_orange + span', res.response)[1].innerText;
                xx.innerHTML = x1 + ' ' + x2;
                //console.log(res + '   ' + x2);
            }
        });
    }
    var div1 = document.createElement('div');
    div1.id = 'My_id';
    document.getElementById('form-sr-details').insertAdjacentElement('afterend',div1);

    var todo = function todo(e) {
        //console.log(e)
        //console.log(e.id);
        if(e.checked) {
            //console.log('+++++ checked');
            $('#sr-history > tbody > tr').each(function(i,x) {
                if($('td',x).attr('data-type').indexOf(e.id) >=0) {
                    //console.log(i);
                    x.firstElementChild.style.display = 'table-row';
                }
            });
        } else {
            //console.log('+++++ unchecked');
            $('#sr-history > tbody > tr').each(function(i,x) {
                if($('td',x).attr('data-type').indexOf(e.id)>=0) {
                    //console.log(i);
                    x.firstElementChild.style.display = 'none';
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
})