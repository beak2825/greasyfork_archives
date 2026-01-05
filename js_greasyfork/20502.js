// ==UserScript==
// @require     https://greasyfork.org/scripts/22174-hangul-js/code/hanguljs.js
// @require     https://greasyfork.org/scripts/22581-jang-js/code/Jangjs.js
// @name        쿠폰파이.우선대행
// @namespace   https://greasyfork.org/ko/users/15592/
// @version     1.98
// @description 쿠폰파이 우선대행 선택박스 제공
// @author      jwjang
// @match       http://couponfi.com/settings/couponfiusersresponseoptionnew
// @match       http://couponfi.com/user/logon
// @match       http://couponfi.com/settings/couponfiusersresponseoptionnew/indextest
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20502/%EC%BF%A0%ED%8F%B0%ED%8C%8C%EC%9D%B4%EC%9A%B0%EC%84%A0%EB%8C%80%ED%96%89.user.js
// @updateURL https://update.greasyfork.org/scripts/20502/%EC%BF%A0%ED%8F%B0%ED%8C%8C%EC%9D%B4%EC%9A%B0%EC%84%A0%EB%8C%80%ED%96%89.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    if (location.href === 'http://couponfi.com/user/logon') {
        $('#user_email').val('jwjang@gmail.com');
        $('#user_pwd').focus();
        return;
    }

    if (location.href !== 'http://couponfi.com/settings/couponfiusersresponseoptionnew/indextest') {
        return;
    }

    //공통
    Jang.addCssRule('select', {padding: '0px'});

    var myMovieList = (function(my){
        my = my || {};

        my.movies = [];

        my.search = function (str) {
            var result = $.grep(my.movies, function(n, i) {
                //            return n.indexOf(str) > -1;
                var cho1 = toKorChars(n, true).join('');
                var cho2 = toKorChars(str, true).join('');
                return (n.indexOf(str) > -1) || (cho1.indexOf(cho2) > -1) || (Hangul.search(n, str) > -1);
            });
            return result;
        };

        return my;
    })();


    function _init() {
        setValue(document.referrer === "");
        getMovieList();

        var objMovie = $("#obj_response_movie");
        objMovie
            .prop('type', 'search')
            .prop('style', 'width: 140px;border: 1px solid rgb(204, 204, 204);padding: 4px;font-weight: bold;box-sizing: content-box;');

        objMovie.keyup(function() {
            var val = $.trim($(this).val());

            var result = myMovieList.search(val);

            $("#listAnchor").show();
            $("#listWarp div:gt(0)").remove();

            $.each(result, function(i, n) {
                var item = $("<div></div>")
                .css("border", "1px solid #dd0")
                .css("display", "inline-block")
                .css("margin", "0 2px")
                //.css("width", "auto")
                .css("cursor", "pointer")
                .text(n);

                item.click(function() {
                    $("#obj_response_movie").val($(this).text());
                    $("#listAnchor").hide();
                });

                $("#listWarp").append(item);
            });
        });

        var top = objMovie.offset().top + "px";
        var left = objMovie.offset().left;
        left += objMovie.outerWidth() + 4;
        left += "px";

        var listAnchor = $("<div id='listAnchor'></div>")
        .css("position", "relative")
        .css("width", "420px")
        .css("top", "-15px")
        .css("display", "inline-block")
        .hide();

        var listWrap = $("<div id='listWarp'></div>")
        .css("position", "absolute")
        .css("background-color", "#fff")
        .css("top", "0px")
        .css("left", "0px")
        .css("display", "inline-block")
        .css("border", "1px solid #ccc")
        .css("margin-left", "4px")
        .css("padding", "2px")
        .css("height", "auto");
        //        .hide();

        var closer = $("<div>&nbsp;</div>")
        .css("border", "1px solid #dd0")
        .css("display", "inline-block")
        .css("width", "25px")
        //.css("height", "20px")
        //.css("text-align", "center")
        //.css("margin", "0 2px")
        .css("backgroundImage", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAABvAAAAbwHxotxDAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAABVQTFRF/////2Zm/2Rm/2Rk/2Rk/2Rk/2Rl5yM9KwAAAAZ0Uk5TACiAh8HnertJvgAAAE9JREFUCFtNjqsRgDAUBBfSAAI8Ch0Vj8FjKIDA9l8CIpM3uJv7w7zCuMNwVSjvxKI56cmhtejDpqo3qYEMRbVCo/IfdCnMEY/CmIjRfuMDM5YgzzIZVMYAAAAASUVORK5CYII=')")
        .css("backgroundPosition", "center")
        .css("backgroundRepeat", "no-repeat")
        .css("cursor", "pointer");

        closer.click(function() {
            $("#listAnchor").hide();
        });

        listWrap.append(closer);

        listAnchor.append(listWrap);
        listAnchor.insertAfter(objMovie);
    }

    function setValue(isSetValue) {
        // 극장
        $('#cinema_name').css('width', '140px');

        var sel_cinema = $('<select>')
        .addClass('mySelect')
        .append('<option value="">----------</option>')
        .append('<option value="롯데시네마" selected>롯데시네마</option>')
        .append('<option value="CGV">CGV</option>')
        .append('<option value="메가박스">메가박스</option>')
        .css('width', '80px');

        sel_cinema.on('change', function() {
            $('#cinema_name').val(sel_cinema.val());
        });

        $('#cinema_name').parent().append(sel_cinema);

        // 영화제목
        //$('#obj_response_movie').css('width', '140px');

        // 관람인원
        //var sel_man = $('<select>')
        //.append('<option val="1">1</option>')
        //.append('<option val="2" selected>2</option>')
        //.css('width', '80px');

        //sel_man.on('change', function() {
        //    $('#obj_response_man').val(sel_man.val());
        //});

        //$('#obj_response_man').parent().append(sel_man);

        // 관람인원
        var man1 = $('<input type="button">')
        .css('width', '26px')
        .css('height', '26px')
        .css('background-color', '#ccc')
        .css('border', 'solid 1px #ccc')
        .css('margin', '0 0 0 5px')
        .val('1');

        man1.click(function() {
            $('#obj_response_man').val($(this).val());
        });

        var man2 = man1.clone(1).val('2');
        var man3 = man1.clone(1).val('3');
        var man4 = man1.clone(1).val('4');

        $('#obj_response_man').parent().append(man1).append(man2).append(man3).append(man4);

        // 관람시간
        var sel_time = $('<select>')
        .append('<option value="09:30">09:30</option>')
        .append('<option value="10:00">10:00</option>')
        .append('<option value="12:00" selected>12:00</option>')
        .append('<option value="13:59">13:59</option>')
        .append('<option value="20:00">20:00(칼퇴)</option>')
        .append('<option value="21:00">21:00</option>')
        .append('<option value="22:00">22:00</option>')
        .append('<option value="24:01">24:01</option>')
        .css('width', '80px');

        sel_time.on('change', function() {
            $('#obj_response_viewstart_time').val(sel_time.val());
        });

        $('#obj_response_viewstart_time').parent().append(sel_time);

        if (isSetValue)
        {
            sel_cinema.change();
            //sel_man.change();
            sel_time.change();
        } else
        {
            sel_cinema.val($('#cinema_name').val());
            //sel_man.val($('#obj_response_man').val());
            sel_time.val($('#obj_response_viewstart_time').val());
        }
    }

    function getMovieList() {
        $.get("/settings/couponfiusersresponseoptionnew/Create", "", parseMovieList);
    }

    function parseMovieList(data) {
        var allObject = $(data);
        var options = allObject.find("#response_movie option:gt(0)");

        $.each(options, function(i, option) {
            myMovieList.movies.push(option.text);
        });
    }

    _init();
})(jQuery);

