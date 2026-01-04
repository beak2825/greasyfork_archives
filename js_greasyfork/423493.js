// ==UserScript==
// @name         CFAccountsManager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Codeforces多账号管理助手
// @author       bakapiano
// @match        *://codeforces.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423493/CFAccountsManager.user.js
// @updateURL https://update.greasyfork.org/scripts/423493/CFAccountsManager.meta.js
// ==/UserScript==

(function() {
    var BACKENDURL = "https://cf.bakapiano.site";
    function login(username, password) {
        if (document.querySelector("#header > div.lang-chooser > div:nth-child(2) > a:nth-child(2)").innerText == "Logout") {
            var url = document.querySelector("#header > div.lang-chooser > div:nth-child(2) > a:nth-child(2)").href;
            $.ajax({
                type: "GET",
                url: url,
                async: false,
            });
        }

        $.get(
            url = "https://codeforces.com/enter",
            success = function(response,status,xhr){
                //console.log(response);
                var temp = $('<div></div>');
                temp.append($.parseHTML(response));
                var csrf_token = temp.find('.csrf-token')[0].attributes['data-csrf'].value;
                console.log(csrf_token);
                $.post(
                    url = "https://codeforces.com/enter",
                    data = {
                        'csrf_token': csrf_token,
                        'ftaa': 'jshedqz38upltgyz7u',
                        'bfaa': '262e4b1217220f326d1bb72da0b5daa4',
                        'handleOrEmail': username,
                        'password': password,
                        '_tta': '115',
                        'action': 'enter',
                    },
                    success = function(response,status,xhr){
                        location.reload()
                    }
                )
            }
        );
    }

    function check_current_work() {
        if (localStorage["work"] == "login") {
            login();
        } else if (1==1) {
        }
    }

    function get_friend() {
        var list = $("#pageContent > div.datatable > div:nth-child(6) > table > tbody > tr").find("td");
        for(var i=0; i<list.length; i++) {
            if (i%3 == 1) {
                console.log(list[i]);
            }
        }
    }

    function process_accounts_info() {
        var data = [];
        var lines = localStorage['accounts'].split('\n');
        for(var i=0; i<lines.length; i++) {
            var temp = lines[i].trim().split(' ');
            console.log(temp);
            if(temp.length>=2) {
                var username = temp[0].trim();
                var password = temp[temp.length-1].trim();
                if(username!="" && password!="") {
                    data.push([username,password])
                }
            }
        }
        localStorage['data'] = JSON.stringify(data);
    }

    function refresh_msg() {
        if(localStorage['data'] == null){
            return;
        }
        var data = jQuery.parseJSON(localStorage['data']);
        var ele = [];
        for(var i=0; i<data.length; i++) {
            var p = document.createElement("p");
            var a = document.createElement("a");
            //var username = data[i][0];
            //var password = data[i][1];

            a.href = "#";
            //a.href="javascript:login('" + username + "','" + password + "')";
            a.attributes['username'] = data[i][0];
            a.attributes['password'] = data[i][1];

            console.log("fuck", a.attributes['username'], a.attributes['password']);

            a.onclick = function(){
                //console.log(this.href);
                //var t = username;
                //var a = password;
                //alert(this.attributes['username'], this.attributes['password']);
                //alert(this.attributes['password']);
                //console.log(t,a);
                login(this.attributes['username'], this.attributes['password']);
            };


            console.log(data[i][0]);
            var t = document.createTextNode(data[i][0]);
            a.appendChild(t);
/*
            var success = document.createElement("div");
            success.style = 'display:inline;';
            success.className = 'success';
            p.appendChild(success);
*/
            var info = document.createElement("div");
            info.style = 'display:inline;';
            info.className = 'info';
            p.appendChild(a);
            p.appendChild(info);

            ele.push(p);
        }
        $('#msg').children().remove();
        for(i=0; i<ele.length; i++) {
            $('#msg')[0].appendChild(ele[i]);
            console.log(ele[i]);
            ele[i].id = "user_" + data[i][0];
        }
        //$('#msg').append('<br>');
    }

    function check_unread_msg() {
        if(localStorage['data'] == null){
            return;
        }
        var data = jQuery.parseJSON(localStorage['data']);
        console.log(data);
        //console.log()
        $.ajax({
            type: "POST",
            url: BACKENDURL + "/check_unread",
            //contentType: "application/json; charset=utf-8",
            data: "data="+JSON.stringify(data),
            dataType: "json",
            success : function (data) {
                unread = data[0];
                fail   = data[1];
                var i = 0;
                all = $('#msg').find('.info');
                //for(i=0; i<all.length; i++) {
                //    all[i].innerText = " No info. "
                //}
                for(i=0; i<unread.length; i++) {
                    $('#msg').find('#user_'+unread[i]).find('.info')[0].innerText = " New message! ";
                }
                for(i=0; i<fail.length; i++) {
                    $('#msg').find('#user_'+fail[i]).find('.info')[0].innerText = " Fail to login! ";
                }
                console.log(data);
            }
        });
    }

    function sync_friend() {
        if(localStorage['data'] == null){
            return;
        }
        var data = jQuery.parseJSON(localStorage['data']);
        console.log(data);
        //console.log()
        $.ajax({
            type: "POST",
            url: BACKENDURL + "/sync_friend",
            //contentType: "application/json; charset=utf-8",
            data: "data="+JSON.stringify(data),
            dataType: "json",
            success : function (data) {
                fail = data;
                var i = 0;
                all = $('#msg').find('.info');
                for(i=0; i<all.length; i++) {
                    all[i].innerText = " Sync done. "
                }
                for(i=0; i<fail.length; i++) {
                    $('#msg').find('#user_'+fail[i]).find('.info')[0].innerText = " Fail to login! ";
                }
                console.log(data);
            }
        });
    }

    function window_switch() {
        var main = $('#cfmain')[0];
        main.hidden = !main.hidden;
        var small = $('#cfmain_small')[0];
        small.hidden = !small.hidden;

    }

    setTimeout(function(){
        check_current_work();

        $("body").append(" <div id='cfmain' style='left: 10px;bottom: 10px;background: #C0C0C0;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width:220px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'></div>");

        $('#cfmain').append("<div id='msg'></div>");
        refresh_msg()

        $('#cfmain').append('<div id="input"> </div>');
        $("#input").append('<textarea id="data" rows="8" style="width:200px;"></textarea>')
        $('#input').append('<br>');

        if(localStorage['hideen'] != null) {
            localStorage['hideen'] = true;
        }
        $('#input')[0].hidden = localStorage['hideen'];

        if(localStorage['accounts'] != null) {
            $('#data')[0].value = localStorage['accounts'];
        }

        $('#cfmain').append('<button type="button" id="sync"  >同步好友</button>');
        $('#cfmain').append('<button type="button" id="edit"  >编辑账号</button>');
        $('#cfmain').append('<button type="button" id="exit"  >关闭窗口</button>');
        $('#cfmain').append('<br>');

        $('#data')[0].onblur = function() {
            localStorage['accounts'] = $('#data')[0].value;
            process_accounts_info();
            refresh_msg();
            check_unread_msg();
        }

        $('#sync').click(function(){
            //localStorage["preURL"] = document.URL;
            //login();

            sync_friend()
        });

        $('#edit').click(function(){
            var input = $('#input')[0];
            if(input.hidden) {
                check_unread_msg();
            }
            input.hidden = !input.hidden;
            localStorage['hideen'] = input.hidden;
        });

        $('#exit').click(function(){
            window_switch();
        });

        $("body").append(" <div id='cfmain_small' style='left: 10px;bottom: 10px;background: #C0C0C0;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width:50px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'></div>");
        $("#cfmain_small").append("显示");
        $("#cfmain_small").click(function(){
            window_switch();
        });

        //$("#cfmain_small")[0].hidden = true;
        $("#cfmain")[0].hidden = true;

        setInterval(check_unread_msg, 1000*30);

        //$('#cfmain').append('<input type="text" name="" id="TIME" style="width: 50" oninput="value=value.replace(/[^\\d]/g,\'\')">');

        if (localStorage["preURL"] != "") {
            var temp = localStorage["preURL"];
            alert("xxx");
            localStorage["preURL"] = "";
            window.location.href = temp;
        }
    },500);
})();