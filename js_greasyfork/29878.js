// ==UserScript==
// @name         swagger-fields-optimize
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        http://www.sosoapi.com/auth/apidoc/*
// @grant        none
// @require    https://cdn.bootcss.com/jquery/1.12.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29878/swagger-fields-optimize.user.js
// @updateURL https://update.greasyfork.org/scripts/29878/swagger-fields-optimize.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log($(window.parent.document).find('.side-bar').length);
    $('body').append('<style>.attribute{padding: 2px 3px;border-radius: 4px}.attribute-active{background-color:#f00;color:#fff}.attribute-select{background-color:#f57;color:#fff}.attribute-select .attribute-active{background-color:#f00;}.attribute-parent{cursor:auto}.attribute-parent-select{background-color:#ddd;color:#333;cursor:auto}.swagger-section .swagger-ui-wrap input.parameter{width:170px}.copy-fields{background-color: #547f00;border-color: #547f00;color: #fff;margin-left:5px;padding: 3px;cursor: pointer;border-radius: 3px;}.copyText{display:inline-block;padding:5px}.swagger-section .swagger-ui-wrap .model-signature pre {max-height: 500px;} </style>');
    if (!getUrlParam('moduleId')&&getUrlParam('docId')&&!$(window.parent.document).find('.side-bar').length) {
        $('body').html('');
        
        //$('body').append('<style>.attribute-active{background-color:#f57;color:#fff} .attribute-select{background-color:#f57;color:#fff} .attribute-parent{cursor:auto} .attribute-parent-select{background-color:#fff;color:#333;cursor:auto} .swagger-section .swagger-ui-wrap input.parameter{width:170px}</style>');
        $('body').append('<style>.main-content {display: -webkit-box;display: -webkit-flex;display: flex;}.main-content .left {border-right: 1px solid rgba(0,0,0,.07);background: #fafafa;width: 250px;overflow: hidden;overflow-y: auto;}.main-content .left .search{border-bottom: 1px solid rgba(0,0,0,.07);border-top: 1px solid rgba(0,0,0,.07);}.main-content .left .left-content{margin:20px 0 0 20px}.main-content .left .side-title {font-size: 16px;margin: 10px 0 10px 10px;}.main-content .left .side-bar {margin-left: 30px;}.main-content .left .side-bar .side-item {font-size: 14px;margin: 10px 0;}.main-content .left .side-bar .side-item a {cursor: pointer;}.main-content .left .side-bar .side-item:hover {text-decoration: underline;}.main-content .right {width: 100%;overflow: hidden;}.main-content .right .main {width: 100%;height: 100%;}a{text-decoration:none;color:#666}.search input{border: none;padding: 5px 0 5px 10px;width: 280px;height: 30px;outline:none;font-size:14px}</style>');
        $('body').append('<div class="main-content"><div class="left-container" style="width:290px"><div class="left"><div class="search"><input type="text" placeholder="搜索"></div><div class="left-content"></div></div></div><div class="right"><iframe src="http://www.sosoapi.com/auth/apidoc/preview.htm?docId=5822&moduleId=18876" frameborder="0" class="main" name="swagger-main"></iframe></div></div><div class="wrapper"></div><div id="tpl-side-bar" class="hide">{{ for(var i in sideBarData){ }}<div class="side-title">{{i}}</div><ul class="side-bar">{{ sideBarData[i].child.map(function(item,index){ }}<li class="side-item"><a href="{{item.url}}" target="swagger-main">{{item.name}}</a></li>{{ }) }}</ul>{{ } }}</div>');
        $('.left').height($(window).height());
        $('.right').height($(window).height());
        $('.main').height($(window).height());
        window.onresize=function(){
            $('.left').height($(window).height());
            $('.right').height($(window).height());
        };
        window.onkeydown=function(event){
            var e = event || window.event;
            if(e && e.keyCode==13){ // enter 键
                  console.log($('.search input').val());
                $('.main').attr('src','http://www.sosoapi.com/auth/apidoc/preview.htm?docId=5822&condition=' + $('.search input').val());
             }
        };
        $.ajax({
            url: 'http://www.sosoapi.com/auth/doc/module/json/list.htm?docId=5822',
            headers: {
                Accept: "application/json;charset=utf-8,*/*"
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Requested-With', {
                    toString: function () {
                        return '';
                    }
                });
            },
            success: function (response) {
                var config = response.data;
                var sideBarData = {};
                config.map(function (item, index) {
                    if (!sideBarData[item.name.split('-')[0]]) {
                        sideBarData[item.name.split('-')[0]] = {};
                        sideBarData[item.name.split('-')[0]].child = [];
                    }
                    console.log(item.name.split('-'), sideBarData[item.name.split('-')[0]]);
                    var name = item.name;
                    item.url = 'http://www.sosoapi.com/auth/apidoc/preview.htm?docId=5822&moduleId=' + item.code;
                    if (name.split('-')[1]) {
                        item.name = item.name.split('-')[1];
                        if(name.split('-')[0] == '版本'){
                            var version=name.split('-')[1].split('|');
                            version.map(function(item){
                                var obj={
                                    name:item,
                                    url:'http://www.sosoapi.com/auth/apidoc/preview.htm?docId=5822&condition=' + item
                                };
                                console.log(obj);
                                sideBarData[name.split('-')[0]].child.push(obj);
                                item=obj;
                            });
                            //sideBarData[name.split('-')[0]].child = version;
                            console.log(version);
                        }else{
                            sideBarData[name.split('-')[0]].child.push(item);
                        }
                    } else {
                        sideBarData[name.split('-')[0]].child.push(item);
                    }

                });
                console.log(sideBarData);
                // console.log(data);
                $('.left-content').append(render($('#tpl-side-bar'), {
                    sideBarData: sideBarData
                }));
                console.log(JSON.stringify(response));
            }
        });

    }

    console.log(getUrlParam('moduleId'));
    setTimeout(function () {
        initFields();
        $('#explore').on('click', function () {
            var timer=setInterval(function () {
                console.log($('.attribute').length);
                if($('.attribute').length){
                    clearInterval(timer);
                    initFields();
                }
            }, 100);

        });


    }, 1000);
    function initFields() {
        $('h2 .toggleEndpointList').each(function(){
            $(this).eq(0).trigger('click');
        });
        $('.attribute').each(function(){
            if($(this).find('.attribute').get(0)){
                $(this).css('padding',0);
            }
        });
        $('.path .toggleOperation').each(function(index){
            $(this).off();
            $(this).on('click',function(){
                if($('.content').eq(index).css('display') != 'none'){
                    setTimeout(function(){
                        $('.content').eq(index).css('display','none');
                    },100);
                }
            });
        });
        var fields = [];
        var fieldsValue = [];
        var fullWidths = [];
        var data = [];
        console.log($('.code').get(0));
        $.ajax({
            url: 'http://www.sosoapi.com/auth/apidoc/json/build.htm?docId=5822',
            headers: {
                Accept: "application/json;charset=utf-8,*/*"
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Requested-With', {
                    toString: function () {
                        return '';
                    }
                });
            },
            success: function (response) {
                //console.log(JSON.stringify(response));
            }
        });


        $('.code').map(function () {
            if ($(this).find('label').html() == 'fields') {
                fields.push($(this).parent().find('td').eq(1));
                $(this).parent().find('td').eq(1).find('input').hide();
                $(this).parent().find('td').eq(1).append('<textarea class="fields" style="width: 310px; height: 80px;"></textarea>');
                $(this).parent().find('td').eq(1).find('textarea').val($(this).parent().find('td').eq(1).find('input').val());
                //console.log($(this).parent().parent().parent().parent().parent().parent().find('.json').parent());
                //fullWidths.push($(this).parent().parent().parent().parent().find('.fullwidth').eq(1).find('.model-signature div .snippet'));
                fullWidths.push($(this).parent().parent().parent().parent().parent().parent().find('.json').parent());

            }
        });

        fields.map(function (item) {
            console.log(item.find('input').val());
            item.find('textarea').after('<div><span class="copy-fields">复制</span></div>');
            fieldsValue.push(getFields(item.find('textarea').val()));
            console.log(getFields(item.find('textarea').val()));
        });

        $('.copy-fields').on('click', function () {

            $(this).parent().prev().get(0).select();
            var tag = document.execCommand("Copy");
            if (tag) {
                console.log($(this).parent().find('.copyText').get(0));
                if ($(this).parent().find('.copyText').get(0)) {
                    $(this).next().show();
                } else {
                    $(this).after('<span class="copyText">已复制到剪切板</span>');
                }
                setTimeout(function () {
                    $('.copyText').hide();
                }, 2000);
            }
        });

        fullWidths.map(function (item, index) {
            item.find('.json').find('.attribute').attr('data-attribute-index', index);
            if (item.find('.json').find('.attribute').find('.attribute').html() == 'data') {

                setParent(item.find('.json').find('.attribute').next().find('.value').eq(0), 0);
            } else {
                setParent(item.find('.json'), 0);
            }

            if (JSON.stringify(fieldsValue[index]) != '{}') {
                if (item.find('.json').find('.attribute').find('.attribute').html() == 'data') {
                    //console.log(item.find('.json').find('.attribute').next().find('.value').eq(0));
                    initJson(item.find('.json').find('.attribute').next().find('.value').eq(0), fieldsValue[index]);

                } else {
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

                /*fullWidths.map(function (item, index) {
                 data[index] = {};
                 if(item.find('.json').find('.attribute').find('.attribute').html() == 'data'){
                 console.log(item.find('.json').find('.attribute').next().find('.value'));
                 getJson(item.find('.json').find('.attribute').next().find('.value').eq(0), data[index]);

                 }else{
                 getJson(item.find('.json'), data[index]);
                 }
                 // console.log(data[0]);
                 });*/
                var index = parseInt($(this).attr('data-attribute-index'));
                var item = fullWidths[index];
                data[index] = {};
                if (item.find('.json').find('.attribute').find('.attribute').html() == 'data') {
                    item.find('.json').find('.attribute').addClass('attribute-parent-no');
                    item.find('.json').find('.attribute').find('.attribute').addClass('attribute-parent-no');
                    console.log(item.find('.json').find('.attribute').next().find('.value'));
                    getJson(item.find('.json').find('.attribute').next().find('.value').eq(0), data[index]);

                } else {
                    getJson(item.find('.json'), data[index]);
                }
                data.map(function (item, index) {

                    fields[index].find('textarea').val(JSON.stringify(item).replace(/"/g, '').replace(/:/g, ''));
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
                if (json && json[$(this).find('.attribute').html()]) {
                    if ($(this).hasClass('attribute-parent')) {
                        $(this).addClass('attribute-parent-select');
                        $(this).find('.attribute').addClass('attribute-parent-select');
                        $(this).addClass('attribute-select');
                        $(this).find('.attribute').addClass('attribute-select');
                    } else {
                        $(this).addClass('attribute-select');
                        $(this).find('.attribute').addClass('attribute-select');
                    }
                }
                if ($(this).next().find('.attribute').get(0)) {
                    initJson($(this).next().find('.value').eq(0), json && json[$(this).find('.attribute').html()]);

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
                        if (key != '') {
                            objArray[objArray.length - 1][key] = obj;
                        } else {
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
    }

    function getUrlParam(key, url) {
        var reg = new RegExp("(#|&|\\?)" + key + "=([^&=\?#]+)");
        var ret = (url || document.location.href).match(reg);
        return (ret && ret[2]) || '';
    }

    function render($el, data) {
        console.log($el.get(0));
        var tokenizeArray = tokenize($el.html());
        var parameter = [];
        var args = [];
        var ret = ['var strArray = []'];
        for (var i = 0, token; token = tokenizeArray[i++];) {
            if (token.type === 'text' && token.expr) {
                ret.push("strArray.push('" + token.expr + "')");
            } else if (token.type === 'logic') {
                ret.push(token.expr);
            } else if (token.expr) {
                ret.push("strArray.push(" + token.expr + ")");
            }
        }
        ret.push("return strArray");
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                parameter.push(key);//形参
                args.push(data[key]);//数据
            }
        }
        var renderArrayFunction = new Function(parameter.join(','), ret.join('\n'));//渲染函数
        var renderArray = renderArrayFunction.apply(this, args);
        $el.remove();
        console.log(renderArrayFunction);
        return renderArray.join('');

    }

    function tokenize(str) {
        var openTag = '{{';
        var closeTag = '}}';
        var ret = [];
        var value = '';
        do {
            var index = str.indexOf(openTag);
            index = index === -1 ? str.length : index;
            value = str.slice(0, index);
            ret.push({//抽取{{前面的静态内容
                expr: value.trim().replace(/[\r\n]/g, ""),//去除换行符
                type: 'text'
            });
            str = str.slice(index + openTag.length);//改变str字符串自身
            if (str) {
                index = str.indexOf(closeTag);
                value = str.slice(0, index);
                if (/^(\s+)/.test(value)) {//抽取{{与}}的动态内容
                    ret.push({
                        expr: antiEscape(value),
                        type: 'logic'
                    });
                } else {
                    ret.push({
                        expr: value,
                        type: 'js'
                    });
                }
                str = str.slice(index + closeTag.length);//改变str字符串自身
            }
        } while (str.length);
        return ret;
    }

    function antiEscape(str) {
        var elem = document.createElement('div');
        elem.innerHTML = str;
        return elem.innerText || elem.textContent;
    }

    // Your code here...
})();