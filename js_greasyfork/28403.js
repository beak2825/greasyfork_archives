// ==UserScript==
// @name         CEM System Lite
// @namespace    http://www.ieslab.cn
// @version      0.3
// @description  Change the representation of 'iESLab CEM System'
// @author       splitfire
// @match        https://vpn2.ieslab.cn/go/cem.ieslab.cn/send/*
// @match        https://vpn3.ieslab.cn/*/send/*
// @match        http://cem.ieslab.cn/send/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require      http://cdn.bootcss.com/autosize.js/3.0.20/autosize.js
// @require      http://cdn.bootcss.com/jquery-datetimepicker/2.5.4/build/jquery.datetimepicker.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/28403/CEM%20System%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/28403/CEM%20System%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //< autosize the height of textarea elements
    var textAreaList = document.querySelectorAll('textarea');
    for (var i = 0; i < textAreaList.length; ++i) {
        textAreaList[i].style = "min-height:30px;max-height:200px;width:100%;";
    }
    autosize(textAreaList);
	
	    //< replace calendar plugin with jquery-datetimepicker
    var dateTimePickerCdnURL = "https://cdn.bootcss.com/jquery-datetimepicker/2.5.4/jquery.datetimepicker.css";
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", dateTimePickerCdnURL);
    var heads = document.getElementsByTagName("head");
    if(heads.length)  {
        heads[0].appendChild(link);
    }
    else {
        doc.documentElement.appendChild(link);
    }
    
    jQuery.datetimepicker.setLocale('zh');
    jQuery('#AltData1_starttime').datetimepicker({
        i18n:{
            zh:{
                months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一','十二',]
            }
        },
        timepicker:false,
        format:'Y-m-d'
    });
    jQuery('#AltData1_endtime').datetimepicker({
        i18n:{
            zh:{
                months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一','十二',]
            }
        },
        timepicker:false,
        format:'Y-m-d'
    });
    jQuery('#myGridView_TxtBeginDateE').datetimepicker({
        i18n:{
            zh:{
                months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一','十二',
                ]
            }
        }
    });
    jQuery('#myGridView_TxtendDateE').datetimepicker({
        i18n:{
            zh:{
                months:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一','十二',
                ]
            }
        }
    });
    $("input[name='AltData1$btn_starttime']").hide();
    $("input[name='AltData1$btn_endtime']").hide();
})();