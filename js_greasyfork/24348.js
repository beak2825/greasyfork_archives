// ==UserScript==
// @name         Haproxy Statistics Report
// @namespace    4e29d21a-e289-411d-9549-e2a8906a3cf1
// @version      2016.11.5.1
// @icon         http://www.haproxy.org/img/logo-med.png
// @description  修改Haproxy状态页中的流量信息
// @author       Dennis(tossp.com)
// @include      http*://*:1188/*
// @run-at       document-idle
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @supportURL   https://gist.github.com/tossp/de260df461c54a56485f07587471be88
// @downloadURL https://update.greasyfork.org/scripts/24348/Haproxy%20Statistics%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/24348/Haproxy%20Statistics%20Report.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var patterns = {};
    patterns.ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
    patterns.dn = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$$/;

    if ($('h1 a').attr('href')=='http://www.haproxy.org/'){
        $('body > form > table > tbody > tr').each(function(k,v) {
            var inElem,outElem;

            window.ts=v;
            if ($(v).children("td:eq(2)").attr('colspan')){
                inElem=$(v).children("td:eq(12)");
                outElem=$(v).children("td:eq(13)");
            }else{
                inElem=$(v).children("td:eq(14)");
                outElem=$(v).children("td:eq(15)");
            }
            //console.info(inElem.html(),outElem.html());
            //.css('background-color', '#20a0ff')
            inElem.html(size(inElem.text()));
            outElem.html(size(outElem.text()));
        });
        $('table tbody tr td a.lfsb').each(function(k,v) {
            addrLookUp(v.text,v);
        });

    }
    function addrLookUp(addr,elem){
        var addrSplit=addr.split('.');
        if (verify(addr,'ip')){
            getGOE(addr,function(data){
                elem.text=data.country+data.city;
                elem.text='['+addrSplit[addrSplit.length-1]+']'+elem.text;
            });
        }else if(verify(addr,'dn')){
            getGOE(addr,function(data){
                elem.text=data.country+data.city;
                elem.text='['+addrSplit[0]+']'+'['+data.query.split('.')[3]+']'+elem.text;
            });
        }
    }
    function getGOE(addr,func){
        $.getJSON('http://ip-api.com/json/'+addr,{lang:'zh-CN'},function(data){
            if($.isFunction(func)){
                if (data.status!='success'){
                    console.info(addr,data);
                }else{                    
                    func(data);
                }
            }
        });
    }

    function size(kb){
        var tmp = kb;
        if (tmp.indexOf('Response bytes')!=-1){
            tmp = tmp.substr(0,tmp.indexOf('Response bytes'));
        }
        if (!isNaN(tmp)&&parseInt(tmp)>0){
            if (tmp < 1024 ) {
                tmp = parseFloat(tmp).toFixed(2) + ' B';
            } else if ( tmp >= 1024 && tmp < 1048576 ) {
                tmp = parseFloat(tmp / 1024).toFixed(2) + ' Kb';
            }        else if ( tmp >= 1048576 && tmp < 1073741824 )        {
                tmp = parseFloat(tmp / (1024 * 1024)).toFixed(2) + ' Mb';
            }        else        {
                tmp = parseFloat(tmp / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';
            }
        }else{
            return kb;
        }
        return tmp;


    }
    function verify(str,pat){        
        var thePat = patterns[pat];
        if(thePat.test(str)){
            return true;
        }else{
            return false;
        }
    }

})();