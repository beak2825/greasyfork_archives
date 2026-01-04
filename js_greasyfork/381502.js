// ==UserScript==
// @name         HOJ Addon - Side Menu Utils
// @namespace    https://twitter.com/r1825_java
// @version      0.5
// @description  HOJに便利なサイドメニューを追加します。
// @author       r1825
// @include      https://hoj.hamako-ths.ed.jp/onlinejudge/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381502/HOJ%20Addon%20-%20Side%20Menu%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/381502/HOJ%20Addon%20-%20Side%20Menu%20Utils.meta.js
// ==/UserScript==

// メニューの部分はhttp://blog.8bit.co.jp/?p=12308を参考にしました。

function isPP () {
    let url = location.href.split("/");
    if ( url.length == 6 && url[5] != "" ) {
        return true;
    }
    else {
        return false;
    }
}

var isWorking = 0;

(function() {
    'use strict';


    var html = `<style type="text/css">
<!--
	#sidemenu{
		background:#000;
		opacity:0.9;
	}
	#sidemenu ul li a{
		display:block;
		padding:15px;
		border-bottom:#333 solid 1px;
		color:#FFF;
		text-decoration:none;
	}
	#sidemenu ul li a:hover{background:#333;}
	#sidemenu_key{
		border-radius:5px 0 0 5px;
		background:#000;
		opacity:0.9;
		color:#FFF;
		padding:30px 0;
		cursor:pointer;
		margin-top:120px;
	}
	#sidemenu_key:hover{opacity:0.5;}
#menu_wrap{
		display:block;
		position:fixed;
		top:0;
		/* widthはメニュー幅+keyボタン幅 */
		width:370px;
		/* メニュー幅に合わせる */
		right:-350px;
        z-index:1825;
	}
	#sidemenu{
		display:inline-block;
		width:350px;
		float:right;
	}
	#sidemenu_key{
		display:inline-block;
		width:20px;
		float:right;
        text-align: center;
	}
-->
</style>

<div id="menu_wrap">
    <div id="sidemenu">
        <div style="margin: 10px">
    	    <div style="color: white; text-align: center" id="smu_search_title"><br>問題検索</div>
            <input type="text" style="width: 100%" id="smu_search_input"  placeholder="タイトルの部分文字列を入力">
            <input type="button" id="smu_search_button" value="検索">
            <div id="smu_search_result" style="overflow-y: scroll; height: 300px">
            </div>
        </div>

    </div>
    <div id="sidemenu_key"><</div>
    <div class="clear"></div>
</div>`;

    const except = `<div style="margin: 10px">
    <div style="color: white; text-align: center" id="smu_except_title"><br>ユーザー選択</div>
    <input type="text" style="width: 100%" id="smu_except_input"  placeholder="表示したいユーザー名(正規表現可)">
    <input type="button" id="smu_except_button" value="選択">
</div>`;

    const accept = `<div style="margin: 10px">
    <div style="color: white; text-align: center" id="smu_accept_title"><br>AC済みの問題</div>
    <input type="button" id="smu_accept_button" value="非表示">
</div>`;

    const object = document.getElementById('main');

    object.insertAdjacentHTML('beforebegin', html);

    if ( location.href.indexOf('https://hoj.hamako-ths.ed.jp/onlinejudge/state') != -1 ) $('#sidemenu').prepend(except);
    if ( location.href.indexOf('https://hoj.hamako-ths.ed.jp/onlinejudge/problems') != -1 && !isPP() ) $('#sidemenu').prepend(accept);

    //***********************************

    var menuWrap = '#menu_wrap'
    var sideMenu = '#sidemenu'
    var sidemenKey = '#sidemenu_key'
    var menuWidth = '350'
    var closeHtml = '<';
    var openHtml = '>';
    var speed = 300


    //***********************************

    $(sidemenKey).click(function(){
        if($(menuWrap).hasClass('active')){
            $(menuWrap).stop().animate({right:'-'+menuWidth+'px'},speed).removeClass('active');
            $(sidemenKey).html(closeHtml);
        }else{
            $(menuWrap).stop().animate({right:'0'},speed).addClass('active');
            $(sidemenKey).html(openHtml);
        };
    });


    /**************************/

    var windowHeight = window.innerHeight;

    $(sideMenu).height(windowHeight);
    $('#smu_search_result').height(windowHeight - 30 - $('#smu_title').height() - $('#smu_search_input').height() - $('#smu_search_button').height());
    var timer = false;
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            windowHeight = window.innerHeight;
            $(sideMenu).height(windowHeight);
            $('#smu_search_result').height(windowHeight - 30 - $('#smu_title').height() - $('#smu_search_input').height() - $('#smu_search_button').height());
        }, 50);
    });


    /**************************/

    $('#smu_search_button').on('click', function() {
        var target = document.getElementById("smu_search_input");
        const text = target.value;
        if ( isWorking ) {
            window.alert("現在検索中です。");
        }
        if ( target.value != "" && !isWorking ) {
            isWorking = 1;
            window.alert("開始");
            document.getElementById("smu_search_result").innerHTML = "";
            var resultList = [];
            for ( var i = 1; i <= 50; i++ ) {
                let url_check = "https://hoj.hamako-ths.ed.jp/onlinejudge/problems?page=" + i;
                resultList.push ( $.ajax({
                    url: url_check,
                    dataType: 'html',
                    success: function(data) {
                        const menu = document.getElementById("smu_search_result");
                        var list = data.match(/<a href=".*?">.*?<\/a><\/div><\/td>/g);
                        for ( var i = 0; i < list.length; i++ ) {
                            if ( list[i].indexOf ( text ) != -1 ) {
                                var a_tag = list[i].replace(/href="https:/, 'style="color: white"; href="https:');
                                menu.insertAdjacentHTML('beforeend', a_tag + "<br>");
                            }
                        }
                        if ( data.indexOf("Hello World!") != -1 && data.indexOf("001") != -1 ) isWorking = 0;
                    }
                }));
            }
        }
    });

    $('#smu_except_button').on('click', function() {
        var target = document.getElementById("smu_except_input");
        if ( target.value != "" ) {
            const reg = new RegExp(target.value);
            var list = document.getElementsByTagName('tr');
            for ( var i = 1; i < list.length; i++ ) {
                var tmp = list[i].innerHTML.match(/<a href=\"https:\/\/hoj.hamako-ths.ed.jp\/onlinejudge\/users\/id\/.*?\">.*?<\/a>/)[0].replace(/<.*?>/g, '');
                if ( !tmp.match(reg) ) {
                    list[i].innerHTML = "";
                }
            }
        }
    });

    $('#smu_accept_button').on('click', function() {
        var list = document.getElementsByTagName('tr');
        for ( var i = 1; i < list.length; i++ ) {
            if ( list[i].innerHTML.indexOf('<i class="fa fa-check" style="color:blue;">') != -1 ) {
                list[i].innerHTML = "";
            }

        }
    });

    // Your code here...
})();