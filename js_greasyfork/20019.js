// ==UserScript==
// @name         Wykop Zapamiętywarka
// @namespace    http://mirkuj.pw/
// @version      1.34
// @description  Skrypt zapamiętujący przeczytane wpisy
// @author       KaszaGryczana
// @match        http://*.wykop.pl/*
// @namespace    https://greasyfork.org/pl/users/45403-micha%C5%82-m
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20019/Wykop%20Zapami%C4%99tywarka.user.js
// @updateURL https://update.greasyfork.org/scripts/20019/Wykop%20Zapami%C4%99tywarka.meta.js
// ==/UserScript==
(function() {
    function ShowRead() {
        var str = localStorage.getItem("Mirko");
        var res = str.split(",");
        $.each(res, function(index, value) {
            if ($(".iC").find('[id="belka'+value+'"]').length > 0){
            }
            else
            {
            $(".iC").find('[data-id="' + value + '"]').eq(0).before("<div id='belka"+value+"' style='font-size: 70%; font-weight:bold;text-align:center;'><p>PRZECZYTANY <button style='height: 25px' class='mark-number move' value='" + value + "'>Rozwiń</button></p></div>");
            $(".iC").find('[data-id="' + value + '"]').next().remove();
            $(".iC").find('[data-id="' + value + '"]').hide();
            }

        });
        ShowRead1();
        for (i = 0; i < localStorage.length; i++) {
            key = localStorage.key(i);
            value = localStorage.getItem(key);
            $(".iC").find('[data-id="' + key + '"]').eq(0).before("<div id='belka"+key+"' style='font-size: 70%; font-weight:bold;text-align:center;'><p>PRZECZYTANY <button style='height: 25px' class='mark-number move' value='" + key + "'>Rozwiń</button></p></div>");
            $(".iC").find('[data-id="' + key + '"]').next().remove();
            $(".iC").find('[data-id="' + key + '"]').hide();
        }
    }

    function ShowRead1() {
        var str = localStorage.getItem("Mirko");
        var res = str.split(",");
        $.each(res, function(index, value) {
            $(".iC").find('[data-id="' + value + '"]').next().remove();
        });
    }

    function AddRead() {
        $('.iC').mouseover(function() {
            var PostID = $(this).find('.dC').data('id');
            var PostType = $(this).find('.dC').data('type');
            var SwID = localStorage.getItem(PostID);
            if (localStorage.getItem("Mirko") == 1) {
                localStorage.setItem(PostID, '1');
            }
            if ($(".iC").find('[data-id="' + PostID + '"]').length && SearchSpam(PostID) === true && PostType == "entry") {
                $(".iC").find('[data-id="' + PostID + '"]').eq(0).prepend("<p style='font-size: 70%; font-weight:bold; text-align:center;'>PRZECZYTANY</p>");
                AddToSpam(PostID);
            }
        });
    }

    function AddToSpam(PostID) {
        var SwID = localStorage.getItem('Mirko');
        var SwIB = SwID + PostID + ',';
        localStorage.setItem('Mirko', SwIB);
    }

    function SearchSpam(PostID) {
        var SwID = localStorage.getItem('Mirko');
        var a = SwID.indexOf(PostID);
        if (a == "-1") {
            return true;

        } else {
            return false;
        }
    }

    function GetUrl() {
        var txt = window.location.pathname;
        var re1 = '(.)';
        var re2 = '(wpis)';
        var re3 = '(.)';
        var p = new RegExp(re1 + re2 + re3, ["i"]);
        var m = p.exec(txt);
        if (m !== null) {
            return true;
        } else {
            return false;
        }
    }

    function AddInfo() {
        $(".clearfix").eq(2).prepend("<li><a class='dropdown-show hashtag ajax ' onclick='localStorage.clear();location.reload();' href='' title='Wyczyść zapisane posty'><i class='fa fa-eye-slash'></i></a></li>");
    }
    $(document).ready(function() {
        if (localStorage.getItem("Mirko") === null) {
            localStorage.setItem("Mirko", '1');
        }
        if (GetUrl() === false) {
            ShowRead();
        }
        AddRead();
        AddInfo();
        $('button.move').click(function() {
            $('[data-id="' + $(this).val() + '"]').slideToggle("slow", function() {});

        });
    });
   //  $( document ).ajaxStop(function() {
   //         if (GetUrl() === false) {
   //          ShowRead();
   //      }
   //      AddRead();
   //     $('button.move').click(function() {
   //         $('[data-id="' + $(this).val() + '"]').show("slow", function() {});
   //     });
   //});
})();