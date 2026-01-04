// ==UserScript==
// @name         ほしゅうじょ
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  try to take over the world!
// @author       You
// @match        https://e-ja.jfael.or.jp/course_list*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/485291/%E3%81%BB%E3%81%97%E3%82%85%E3%81%86%E3%81%98%E3%82%87.user.js
// @updateURL https://update.greasyfork.org/scripts/485291/%E3%81%BB%E3%81%97%E3%82%85%E3%81%86%E3%81%98%E3%82%87.meta.js
// ==/UserScript==


$(function(){

    var currentURL = window.location.href;

    if (currentURL.includes("/chapter/")) {//動画再生画面

        setTimeout(function(){　//自動再生

            $(".control-play").click();
        },2000+getRandomInt(500));

        var isPassword = false;

        setInterval(function(){

            var tmp = $("#cipherArea").text();
            var password = tmp.replace("暗号 : ", "");

            if (isPassword == false && password != "") {

                console.log("pass:", password);
                sessionStorage['password'] = password;
                $(".movieAttentionBox").before("<p>pass:"+password+"</p>");
                isPassword = true;
            }

        },3000);
    }

    if (currentURL.includes("input_cipher")) { //暗号入力画面

        setTimeout(function(){
            var password = sessionStorage.getItem('password');
            $("input[placeholder='暗号入力']").val(password);
        },1000+getRandomInt(500));

        setTimeout(function(){
            $("input[data-disable-with='送信']").click();
            sessionStorage.removeItem('password')

        },2000+getRandomInt(500));
    }

    if (currentURL.includes("complete_cipher")) { //暗号確認しました

        sessionStorage['isContinue'] = 1;
        setTimeout(function(){

            window.location.href = $("a[href*='#movieList']").attr("href");
        },1000+getRandomInt(500));
    }

    if (currentURL.includes("#movieList") && sessionStorage.getItem('isContinue') == 1) { //講義一覧
        setTimeout(function(){
            $(".btnS1").click();
            sessionStorage.removeItem('isContinue');
        },1000+getRandomInt(500));
    }

    var correctAnswer = {};
    if (currentURL.includes("check_test")) { //確認テスト 出題画面

        var num = question_number();


        $('input[name=choice_id]').on('click', function() {   //選択肢のidを保存

            var userAnswer = {};
            if (sessionStorage.getItem('userAnswer') != null) userAnswer = JSON.parse(sessionStorage.getItem('userAnswer'));

            var id = $(this).val();
            userAnswer[num] = id;

            sessionStorage.setItem('userAnswer', JSON.stringify(userAnswer));
        });

        //マルバツを表示する

        correctAnswer = {};
        if (sessionStorage.getItem('correctAnswer') != null) correctAnswer = JSON.parse(sessionStorage.getItem('correctAnswer'));

        var isSelected = false; //選択肢を選択したか

        $(".answerList input").each(function() {
            var tmp = "none";
            if(correctAnswer[$(this).val()] == "maru") {
                $(this).trigger("click"); //正解の選択肢を選択
                tmp = "✅";
                isSelected = true;
            }
            if(correctAnswer[$(this).val()] == "batsu") tmp = "❌";
            if(tmp == "none" && isSelected == false) {
                $(this).trigger("click");
                isSelected = true;
            }
            if(tmp != "none") $(this).after(tmp);
        });

        //エンターキーで回答
        $(document).on('keydown', (e) => {
            if (e.keyCode === 13) {
                $('input[type="submit"]').trigger("click");
            }
        });
    }

    if (currentURL.includes("check_test/result")) { //確認テスト 結果画面

        var userAnswer = {};
        if (sessionStorage.getItem('userAnswer') != null) userAnswer = JSON.parse(sessionStorage.getItem('userAnswer'));
        correctAnswer = {};
        if (sessionStorage.getItem('correctAnswer') != null) correctAnswer = JSON.parse(sessionStorage.getItem('correctAnswer'));

        var judge;

        for (let i = 1; i < 6; i++) {
            //2～6
            if($("td:nth-child("+(i+1)+")").find(".correct").length > 0) { //正解
                judge = "maru";
            }
            if($("td:nth-child("+(i+1)+")").find(".incorrect").length > 0) { //不正解
                judge = "batsu";
            }

            correctAnswer[userAnswer[i]] = judge;
        }

        if($(".strongTxt").text() == "合格です。") sessionStorage.removeItem('correctAnswer');
        else {
            sessionStorage.setItem('correctAnswer', JSON.stringify(correctAnswer));
        }
        sessionStorage.removeItem('userAnswer');

         //エンターキーで再回答
        $(document).on('keydown', (e) => {
            if (e.keyCode === 13) {
              window.location.href = $("a[href*='restart']").attr("href");
            }
        });
    }

})(jQuery);

function question_number(){//現在何問目かを返す

    for (let i = 1; i < 6; i++) {
        if ($('.question_' + i).length) {

            return i;
        }
    }
    return -1;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}