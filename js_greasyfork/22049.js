// ==UserScript==
// @name        MF Forum Plug-ins
// @namespace   MF Forum
// @version      1.2
// @description Adds plug-ins to the MF forum
// @author       TheMachinumps
// @match        http://marioforeverforum.boards.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22049/MF%20Forum%20Plug-ins.user.js
// @updateURL https://update.greasyfork.org/scripts/22049/MF%20Forum%20Plug-ins.meta.js
// ==/UserScript==

$(document).ready(function () {
    // When making/editing a post

    // Copy button
    $('.editor.ui-helper-clearfix').append('<div id=\'copy\'>Copy</div>');
    $('#copy').css({
        'position': 'absolute',
        'display': 'inline-block',
        'text-align': 'center',
        'padding': '5px',
        'border': '1px solid #dddddd',
        'border-radius': '10px',
        'background-color': '#ffffff',
        'margin-top': '5px',
        'margin-left': '2px'
    });

    $('#copy').hover(function () {
        $('#copy').css({
            'background-color': '#f2f2f2',
            'cursor': 'pointer'
        });
    }, function () {
        $('#copy').css({
            'background-color': '#ffffff',
            'cursor': ''
        });
    });

    $('#copy').click(function () {
        window.find($('#time').text());
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        copiedAnimation();
    });
    // ---

    // Copied animation
    copiedAnimation = function () {
        $('.editor.ui-helper-clearfix').append('<div class=\'copied\'>Copied!</div>');
        $('.copied').css({
            'position': 'absolute',
            'display': 'inline-block',
            'text-align': 'center',
            'padding': '3px',
            'border': '1px solid #0000ff',
            'border-radius': '5px',
            'background-color': '#0066ff',
            'margin-top': '5px',
            'margin-left': '-3px',
            'opacity': '0',
            'color': '#ffffff'
        }).animate({
            opacity: 1,
            marginTop: '-20px'
        }, 500).delay(1000).animate({
            opacity: 0
        }, 200, function () {
            $(this).remove();
        });
    };
    // ---

    // Time display
    $('.editor.ui-helper-clearfix').append('<div id=\'time\'></div>');
    $('#time').css({
        'position': 'absolute',
        'display': 'inline-block',
        'text-align': 'center',
        'padding': '5px',
        'border': '1px solid #dddddd',
        'border-radius': '10px',
        'background-color': '#ffffff',
        'margin-top': '5px',
        'margin-left': '52px'
    });
    // ---
    getTime = function () {
        month = new Date().getMonth() + 1;
        hours = new Date().getHours().toString();
        if (hours.length < 2) hours = '0' + hours;
        minutes = new Date().getMinutes().toString();
        if (minutes.length < 2) minutes = '0' + minutes;
        seconds = new Date().getSeconds().toString();
        if (seconds.length < 2) seconds = '0' + seconds;
        return new Date().getDate() + '.' + month + '.' + new Date().getFullYear() + ' GMT+' + new Date().toString().substring(30, 31) + ':00 at ' + hours + ':' + minutes + ':' + seconds;
    };
    updateTime = function () {
        time = getTime();
        $('#time').html('<div id=\'time\'>' + time + '</div>');
    };
    setInterval(updateTime, 200);
    // ---

    // Action log toolbox
    if($(location).attr('hostname') + $(location).attr('pathname').substring(0,6) === "marioforeverforum.boards.net/board"){
        // Action toolbox
        $('body').append('<div id=\'timetext\'><div id=\'strictdrag\'style=\'border-bottom: 1px solid #dddddd; padding-bottom: 5px;\'>Action Log:</div><div id=timelog>None...</div></div>');

        // Toolbox setup
        $('#timetext').css({
            'position': 'fixed',
            'z-index': '9999',
            'display': 'inline-block',
            'text-align': 'center',
            'padding': '5px',
            'border': '1px solid #dddddd',
            'border-radius': '10px',
            'background-color': '#ffffff',
            'top': '10px',
            'left': '10px',
            'width': '300px',
        });
        // ---

        // Hide and copy buttons
        $('#timetext').append('<div id=\'hide\'>Hide</div>');

        $('#hide').css({
            'position': 'relative',
            'display': 'inline-block',
            'text-align': 'center',
            'padding': '5px',
            'border': '1px solid #dddddd',
            'border-radius': '10px',
            'background-color': '#ffffff',
            'margin-top': '5px',
        });
        $('#hide').hover(function () {
            $('#hide').css({
                'background-color': '#f2f2f2',
                'cursor': 'pointer'
            });
        }, function () {
            $('#hide').css({
                'background-color': '#ffffff',
                'cursor': ''
            });
        });
        $("#hide").click(function(){
            $("#timelog").toggle();
            if($("#timelog").css('display') === 'none') {
                $("#hide").text("Show");
            } else {
                $("#hide").text("Hide");
            }
        });

        $('#timetext').append('<div id=\'copylog\'>Copy</div>');
        $('#copylog').css({
            'position': 'relative',
            'display': 'inline-block',
            'text-align': 'center',
            'padding': '5px',
            'border': '1px solid #dddddd',
            'border-radius': '10px',
            'background-color': '#ffffff',
            'margin-top': '5px',
            'margin-left': '5px',
        });
        $('#copylog').hover(function () {
            $(this).css({
                'background-color': '#f2f2f2',
                'cursor': 'pointer'
            });
        }, function () {
            $(this).css({
                'background-color': '#ffffff',
                'cursor': ''
            });
        });
        copiedAnimation = function () {
            $('#copylog').append('<div class=\'copied\'>Copied!</div>');
            $('.copied').css({
                'position': 'absolute',
                'display': 'inline-block',
                'text-align': 'center',
                'padding': '3px',
                'border': '1px solid #0000ff',
                'border-radius': '5px',
                'background-color': '#0066ff',
                'margin-top': '-10px',
                'margin-left': '-44px',
                'opacity': '0',
                'color': '#ffffff'
            }).animate({
                opacity: 1,
                marginTop: '-30px'
            }, 500).delay(1000).animate({
                opacity: 0
            }, 200, function () {
                $(this).remove();
            });
        };
        $('#copylog').click(function(){
            if($("#timelog").text() !== "None..."){
                copiedAnimation();
                if($("#timelog").css('display') === 'none'){
                    $("#timelog").show();
                    selectElementText($("#timelog")[0]);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                    $("#timelog").hide();
                } else {
                    selectElementText($("#timelog")[0]);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                    scrollTo(savedscrollX, savedscrollY);
                }
            }
        });
        // ---

        // Draggable window
        $("#strictdrag").css("cursor", "move");
        $("#strictdrag").mouseenter(function(){
            $('#timetext').draggable({
                containment: "window",
                scroll: false,
            });
        }).mouseup().mouseout(function(){
            $('#timetext').draggable("destroy");
        });
        // ---

        // Time log settings
        $('#timelog').css({
            'text-align': 'left',
            'height': '300px',
            'overflow-y': 'scroll',
            'border-bottom': '1px solid #dddddd',
        });
        // ---

        // Update time
        updategettime = function (method) {
            $('.sticky, .unsticky, .lock, .unlock, .bump, .enable_falling, .disable_falling, .ui-dialog:eq(1) > div > div > button').unbind("click.timeonly");
            $('.sticky, .unsticky, .lock, .unlock, .bump, .enable_falling, .disable_falling, .ui-dialog:eq(1) > div > div > button').bind("click.timeonly", function () {
                time = getTime();
                nickname = $('#welcome span') [0].innerHTML.substring(8, Infinity);
                nickname = nickname.substring(0, nickname.length - 1);
                if ($(this).text() == 'Sticky') type = 'Thread Stickeyed';
                if ($(this).text() == 'Unsticky') type = 'Thread Unpinned';
                if ($(this).text() == 'Lock') type = 'Thread Locked';
                if ($(this).text() == 'Unlock') type = 'Thread Unlocked';
                if ($(this).text() == 'Bump') type = 'Thread Bumped';
                if ($(this).text() == 'Enable Falling') type = 'Thread Falling';
                if ($(this).text() == 'Disable Falling') type = 'Thread Bumped';
                if ($(this).text() == 'Move Thread' || $(this).text() == 'Move Threads') type = 'Thread Moved';
                if ($('#timelog').text() === 'None...') {
                    $('#timelog').empty();
                    $('#timelog').append(type + '<br>' + time + '<br>' + nickname);
                } else {
                    $('#timelog').append('<br><br>' + type + '<br>' + time + '<br>' + nickname);
                }
            });
            $(".ui-icon.ui-icon-closethick:eq(1)").unbind("click.closemove");
            $(".ui-icon.ui-icon-closethick:eq(1)").bind("click.closemove", function () {
                interval = setInterval(waitforthreadload, 20);
            });
        };
        waitforthreadload = function () {
            if ($('.ui-dialog:eq(1)').css('display') == 'block' && $('.ui-dialog:eq(1)') !== null) {
                updategettime();
                clearInterval(interval);
            }
        };
        interval = setInterval(waitforthreadload, 20);
        $('.move_thread').click(function () {
            interval;
        });
        // ---
        updategettime();
    }
    // ---
    function selectElementText(el){
        var range = document.createRange();
        range.selectNodeContents(el);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
});
