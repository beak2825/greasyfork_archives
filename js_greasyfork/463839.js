// ==UserScript==
// @license MIT
// @name         马到成公
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  成绩提醒
// @author       lemondqs
// @match        http://39.107.108.81:50/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=108.81
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    var dom =
            `<audio controls id="player">
            <source src="https://www.runoob.com/try/demo_source/horse.ogg" type="audio/ogg">
            <source src="https://www.runoob.com/try/demo_source/horse.mp3" type="audio/mpeg">
            </audio>`
    $('body').append(dom);

    var warning = function() {
        var player = $('#player')[0];
        player.play()
    }


    window.first = true;
    // 监听xhr
    window.sethd = false;
    window.heads = null;
    if(window.XMLHttpRequest){

        var originop = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function(){
            // test
            if (/search/.test(arguments[1])) {
                sethd = true;
                //console.info('op---', arguments)
            } else {
                sethd = false;
            }
            
            originop.apply(this, arguments);
        }

        var originhd = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(){
            if(sethd) {
                //console.info('hd---', arguments)

                if (heads == null) {
                    heads = {};
                }
                const [k, v] = arguments
                heads[k] = v;
            }

            originhd.apply(this, arguments);
        }
        var originsd = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            if(heads) {
                //console.info('sd---', arguments)
                if(first) {load();}
            }

            originsd.apply(this, arguments);
        }
    };
    // 监听log
    /**
    window.logs = [];
    window.auth = '';
    if(window.console && console.log){
        var old = console.log;
        console.log = function(){
            if(arguments.length >1) {
                logs.push(arguments)
                Array.prototype.unshift.call(arguments, 'DateTime: '+new Date());
            } else {
                old.apply(this, arguments);
                // test
                if (/n4c/.test(arguments[0])) {
                    auth = arguments[0];
                    if(sethd){load();}
                }
            }

        }
    };
    **/

    var load = function() {
        first = false;

        var ts = new Date().getTime();
        $.ajax({
            type: 'POST',
            /**
            headers: {
                'Accept': 'application/json, text/plain, *\/*',
                'Authorization': auth,
                'nonce': '57154542801142944234780587464225',
                'signature': '26a9c13795963b39b28467a9406eb8a1',
                'timestamp': ts,
                'X-Requested-With': '',
            },
            **/
            headers: {...heads, 'timestamp': ts},
            url: 'http://39.107.108.81:50/third/qjwzwb/score/search.htm',
            success: function(info) {
                console.info('info:', info)
                var data = JSON.parse(info);
                if(data.code!=401) {
                    console.info(data.data);
                    warning()
                } else {
                    console.info(data.msg);
                    setTimeout(load, 30*1000)
                }
            }
        })
    };

    // Your code here...
})();