// ==UserScript==
// @name         TAC Helper
// @version      1.8
// @description  そのまま
// @author       ぬ
// @match        https://mbs.tac-school.co.jp/*
// @match        https://ws.tac-school.co.jp/*
// @match        https://n313.network-auth.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/83168
// @downloadURL https://update.greasyfork.org/scripts/439966/TAC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439966/TAC%20Helper.meta.js
// ==/UserScript==

$(function(){

    var dt= new Date();
    var year = dt.getFullYear();
    var month = ( '00' + (dt.getMonth()+1) ).slice( -2 );
    var td_next = ( '00' + (dt.getDate()+1) ).slice( -2 );
    var td_today = ( '00' + (dt.getDate()) ).slice( -2 );
    var s_next = year + "/" + month + "/" + td_next;
    var s_today = year + "/" + month + "/" + td_today;

    function modify_select(){

        var date = $('#date');
        var chair = $('#chair_code');
        var chair_list = {"0":["講座を選択してください"],
                          "1":[["講座を選択してください",""],["公認会計士","02"]],
                         }
        var selected_date = "1";
        chair.children().remove();
        if (!chair_list[selected_date]){
            chair.append('<option disabled selected>選択可能な講座がありません</option>');
        } else {
            for (var i in chair_list[selected_date]){
                chair.append('<option value="' + chair_list[selected_date][i][1] + '">' + chair_list[selected_date][i][0] + '</option>');
                chair.children(':first').attr('disabled',true);
            }
        }
    }

    //Wifi規約同意
     $('a[id="continue_link"]').click();

    //校舎選択
    if($('select[name="base_code"]').length) {
        $('option:contains("日吉校")').attr("selected", "selected");
    }

    //講座選択
    if($('select[id="date"]').length) {

        //alert(tmp);
        $('option[value="'+s_next+'"]').attr("selected", "selected");
        $('select[id="date"]').attr('size', 4);
        modify_select();
        $('option:contains("公認会計士")').attr("selected", "selected");
    }

    $('select[id="date"]').change(function() {
        $('option:contains("公認会計士")').attr("selected", "selected");
        //alert();
    });

    //メニュー追加
    if($('.grobalMenu').length) {
        var kyositsu = $('a:contains("教室情報検索")').attr('href');
        $('.grobalMenu').before('<ul class="grobalMenu_left" id="globalMenuTopLeft"><li><p><a data-method="get" href="' + kyositsu + '"> <span>教室情報</span></a></p></li><li><p><a data-method="get" href="https://ws.tac-school.co.jp/subjects?product_id=51877"> <span>学習項目一覧</span></a></p></li></ul>');
    }

    //自動ログイン
    $('button[name="commit"]'+'.confirmBtn').click();
    $("#user_session_login").val("0100210730");
    $(".renew_input_pass").val("kousaku999");
    $("input[name='user_session[password]']").val("kousaku999");
    $('.loginBtn').click();


    //初期速度x2、x3ボタン
    if (location.pathname.match(/movie_play/)) {
        /*
        const loop = setInterval(function(){
            if ($('video')[0].paused == false){
                //$('video')[0].play();
                $('video')[0].playbackRate = 2;
                clearInterval(loop);
            }
            //console.log("a");
        },500);
        */
        $('button[value="2"]'+".speedChg").click();    //pc
        $('.playerClose').after('<button type="button" class="speed3"><span>x3.0</span></button>');
        $('option[value="2"]').attr("selected", "selected");  //スマホ
    }

    $('.speed3').click(function(e) {

        document.querySelector('video').playbackRate = 3;

    })

})(jQuery);

