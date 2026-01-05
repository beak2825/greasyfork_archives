// ==UserScript==
// @name         get-fields
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.sosoapi.com/auth/apidoc/*
// @grant        none
// @require    https://cdn.bootcss.com/jquery/1.12.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29871/get-fields.user.js
// @updateURL https://update.greasyfork.org/scripts/29871/get-fields.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('body').append('<style>.attribute-active{background-color:#f57;color:#fff} .attribute-select{background-color:#f57;color:#fff} .attribute-parent{cursor:auto} .attribute-parent-select{background-color:#fff;color:#333;cursor:auto} .swagger-section .swagger-ui-wrap input.parameter{width:170px}</style>');
    var fields = [];
    var fieldsValue = [];
    var fullWidths = [];
    var data = [];
    setTimeout(function () {
        console.log($('.code').get(0));
        $('.code').map(function () {

            if ($(this).find('label').html() == 'fields') {
                fields.push($(this).parent().find('td').eq(1));
                fullWidths.push($(this).parent().parent().parent().parent().find('.fullwidth').eq(1).find('.model-signature div .snippet'));

            }
        });

        fields.map(function (item) {
            console.log(item.find('input').val());
            item.find('input').after('<span style="margin-left:5px;padding: 3px;border: #333 1px solid;background-color: #fff;cursor: pointer;" class="copy-fields">复制fields</span>');
            fieldsValue.push(getFields(item.find('input').val()));
            console.log(getFields(item.find('input').val()));
        });

        $('.copy-fields').on('click',function(){
            $(this).prev().get(0).select();
            var tag=document.execCommand("Copy");
            if(tag){
              alert('复制fields成功');
            }
        });

        fullWidths.map(function (item, index) {
            if(item.find('.json').find('.attribute').find('.attribute').html() == 'data'){
                
                setParent(item.find('.json').find('.attribute').next().find('.value').eq(0), 0);
            }else{
                setParent(item.find('.json'), 0);
            }
            
            if(JSON.stringify(fieldsValue[index]) != '{}'){
                if(item.find('.json').find('.attribute').find('.attribute').html() == 'data'){
                    console.log(item.find('.json').find('.attribute').next().find('.value').eq(0));
                initJson(item.find('.json').find('.attribute').next().find('.value').eq(0), fieldsValue[index]);
                
            }else{
                initJson(item.find('.json'), fieldsValue[index]);
            }
                
            }
        });
        $('.attribute').on('mouseover', function () {

            if (!$(this).hasClass('attribute-parent') && $(this).html()) {
                $(this).addClass('attribute-active');
            }

        });
        $('.attribute').on('mouseout', function () {

            if (!$(this).hasClass('attribute-parent') && $(this).html()) {
                $(this).removeClass('attribute-active');
            }
        });
        $('.attribute').on('click', function () {

            var data = [];
            if (!$(this).hasClass('attribute-parent') && $(this).html()) {

                if ($(this).hasClass('attribute-select')) {
                    $(this).removeClass('attribute-select');
                    removeParentSelect($(this).parent());
                } else {
                    $(this).addClass('attribute-select');

                    if ($(this).parent().parent().parent().prev().hasClass('attribute-parent')) {
                        setParentSelect($(this).parent());
                    }
                }

                fullWidths.map(function (item, index) {
                    data[index] = {};
                    if(item.find('.json').find('.attribute').find('.attribute').html() == 'data'){
                console.log(item.find('.json').find('.attribute').next().find('.value'));
                        getJson(item.find('.json').find('.attribute').next().find('.value').eq(0), data[index]);
                     
                    }else{
                       getJson(item.find('.json'), data[index]);
                    }
                   // console.log(data[0]);
                });
                data.map(function (item, index) {

                    fields[index].find('input').val(JSON.stringify(item).replace(/"/g, '').replace(/:/g, ''));
                });


            }

        });
        function getJson(el, obj) {
            el.find('>.attribute-select').each(function (index) {

                if ($(this).next().find('.attribute-select').get(0)) {
                    obj[$(this).find('.attribute-select').html()] = {};
                    getJson($(this).next().find('.value').eq(0), obj[$(this).find('.attribute-select').html()]);

                } else {
                    console.log(obj);
                    obj[$(this).find('.attribute-select').html()] = '';
                }
            });
        }


        function setParent(el, num) {
            el.find('>.attribute').each(function (index) {
                if ($(this).next().find('.attribute').get(0)) {
                    $(this).addClass('attribute-parent');
                    $(this).find('.attribute').addClass('attribute-parent');
                    $(this).attr('data-index', num);
                    $(this).find('.attribute').attr('data-index', num);
                    setParent($(this).next().find('.value').eq(0), num + 1);

                }
            });
        }

        function initJson(el, json) {
            el.find('>.attribute').each(function (index) {
                if (json&&json[$(this).find('.attribute').html()]) {
                    if($(this).hasClass('attribute-parent')){
                        $(this).addClass('attribute-parent-select');
                        $(this).find('.attribute').addClass('attribute-parent-select');
                        $(this).addClass('attribute-select');
                        $(this).find('.attribute').addClass('attribute-select');
                    }else{
                        $(this).addClass('attribute-select');
                        $(this).find('.attribute').addClass('attribute-select');
                    }
                }
                if ($(this).next().find('.attribute').get(0)) {
                    initJson($(this).next().find('.value').eq(0),json&&json[$(this).find('.attribute').html()]);

                }
            });
        }

        function setParentSelect(el) {
            el.parent().parent().prev().find('.attribute').addClass('attribute-parent-select');
            el.parent().parent().prev().addClass('attribute-parent-select');
            el.parent().parent().prev().find('.attribute').addClass('attribute-select');
            el.parent().parent().prev().addClass('attribute-select');

            if (el.parent().parent().prev().attr('data-index') != 0) {

                setParentSelect(el.parent().parent().prev());
            }
        }

        function removeParentSelect(el) {
            var parentShow = false;

            el.siblings().each(function (index, item) {

                if ($(item).find('>.attribute').hasClass('attribute-select')) {
                    parentShow = true;
                }
            });

            if (!parentShow) {
                if (el.parent().parent().prev().hasClass('attribute-parent')) {
                    el.parent().parent().prev().find('.attribute').removeClass('attribute-select');
                    el.parent().parent().prev().removeClass('attribute-select');
                    el.parent().parent().prev().find('.attribute').removeClass('attribute-parent-select');
                    el.parent().parent().prev().removeClass('attribute-parent-select');

                    if (el.parent().parent().prev().attr('data-index') != 0) {

                        removeParentSelect(el.parent().parent().prev());
                    }
                }
            }
        }
        
        function getFields(fields) {
        var objArray = [];
        var start = 0;
        var end = 0;
        var key = '';
        for (var i = 0; i < fields.length; i++) {

            switch (fields.charAt(i)) {
                case '{':
                    key = fields.substring(start, end);
                    start = end + 1;
                    var obj = {};
                    if(key != ''){
                        objArray[objArray.length - 1][key] = obj;
                    }else{
                        objArray.push(obj);
                    }

                    objArray.push(obj);
                    break;
                case '}':
                    key = fields.substring(start, end);
                    start = end + 1;
                    if (key != '') {
                        objArray[objArray.length - 1][key] = true;
                    }
                    objArray.pop();
                    break;
                case ',':
                    console.log(start, end);
                    key = fields.substring(start, end);
                    start = end + 1;
                    if (key != '') {
                        objArray[objArray.length - 1][key] = true;
                    }
                    console.log(key);
                    break;
                default:
            }
            end++;
        }

        return objArray[0];
    }

       

    }, 1000);
    // Your code here...
})();