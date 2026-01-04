// ==UserScript==
// @name         58增强
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  58
// @author       You
// @match
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @include http://zz.58.com/job/*
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/371450/58%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371450/58%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle('.back-red{background: #ced7cf!important;}'+
                 '.back-hong{background: #d97149!important;}'+
                '.font-24{font-size:18px;}');
    $('.rightCon').hide();
    $('.wangmeng_list_bottom_ditong').hide();

    var lists = $('ul#list_con li')
   // console.log(lists.length)
    if(lists.length > 0){
        $.each(lists,function(key,value){
        //console.log("Obj :" + key + '-' + value);
        $(this).addClass('back-red')
        var _this = $(this)
        _this.find('.job_title').hide();
        _this.find('.comp_name').addClass('job_name');
        _this.find('.job_require').hide();
        _this.attr('id','li'+key)
        _this.find('a.apply').hide();
        _this.find('a.sign').hide();
        var url = _this.find('.comp_name a').attr("href");
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Accept': 'application/atom+xml,application/xml,text/xml',
            },
            onload: function(r) {
                var info = $(r.responseText).find('.basicMsgListo')
                $('#li'+key).append('<div class="item_con info font-24"></div>')
                $('#li'+key).find('.info').append(info)
                var comp_lists = $(info).find('li');
                if(comp_lists.length > 0){
                    comp_lists.eq(0).hide();
                    comp_lists.eq(4).hide();
                    comp_lists.eq(5).hide();
                    comp_lists.eq(6).hide();
                    var img = comp_lists.eq(3).find('img');
                    //console.log(comp_lists.eq(3));
                    //console.log('#li'+'---'+key+ '----'+img.length)
                    if(img.length > 0){
                        //console.log('有图')
                        //$('#li'+key).addClass('back-hong')
                    }else{
                        $('#li'+key).hide();
                    }
                }else{
                    $('#li'+key).hide();
                }
            }
        });
        })
    }
})();