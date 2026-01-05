// ==UserScript==
// @name        UnipaBeautifulTimeboard
// @namespace   notification
// @description 学生時間割表の見た目を整える
// @include     http*://portal.sa.dendai.ac.jp/up/faces/up/*
// @version     1.29
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5131/UnipaBeautifulTimeboard.user.js
// @updateURL https://update.greasyfork.org/scripts/5131/UnipaBeautifulTimeboard.meta.js
// ==/UserScript==

$(function () {
    try {
        var page_title = $('.titleAreaL').html();
        var mode, selector_table_prefix;
        if (page_title == '学生時間割表') {
            mode = 's';
            selector_table_prefix = '#form1\\:calendarList';
        } else if(page_title == '授業時間割表') {
            mode = 'a';
            selector_table_prefix = '#form1\\:tableCal ';
        } else {
            console.log('skip BT script');
            return;
        }
        console.log('load BT script');

        var data = {
            'header:form1:htmlMenuItemButton': '実行',
            'header:form1:hiddenMenuNo': '602',
            'header:form1:hiddenFuncRowId': '0',
            'com.sun.faces.VIEW': $('[name="com.sun.faces.VIEW"]').val(),
            'header:form1': 'header:form1'
        };
        $.ajax({
            url: '#',
            type: 'post',
            timeout: 5000,
            data: data,
            success: function(html, status) {
                var got_units = [];
                $(html).find('#singleTableArea>table>tbody>tr').each(function() {
                    if ('ABCSRARBRCRSRN'.indexOf($(this).find(".tdHyokaList").text()) == -1) {
                        return;
                    }
                    got_units.push($(this).find('.tdKamokuList').text());
                });
                console.log(got_units);

                // 授業情報表示の整形
                $(selector_table_prefix + ' .linkMark>a').each(function() {
                    var params, id, name, term, term_code, teacher, room, unit;
                    params = $(this).html().split('&nbsp;');
                    if (mode == 'a') {
                        var params2, params3, params4;
                        params2 = params[0].split(' ');
                        id = params2[0];
                        name = params2[1];
                        params3 = params[1].split(' ');
                        room = params3[1];
                        term = '';
                        if (params3[0].indexOf('）') != -1) {
                            params4 = params3[0].split('）');
                            term = params4[0].replace(/（/g, '(').replace('科目', '') + ')';
                            teacher = params4[1].replace(/[【】]/g, '').replace(/　/, ' ');
                        } else {
                            teacher = params3[0].replace(/[【】]/g, '').replace(/　/, '').replace(/　/, ' ');
                        }
                        $span_unit = '';
                    } else if (mode == 's') {
                        id = params[0];
                        name = params[1];
                        term = params[2].replace(/（/g, '(').replace(/）/g, ')').replace('科目', '');
                        teacher = params[3].replace(/[【】]/g, '').replace(/　/, ' ');
                        room = params[4];
                        unit = params[5].replace('単位', '');
                        if (!unit) {
                            unit = '同上';
                        }
                        $span_unit = $('<span/>').addClass('unit').html(unit);
//                        $span_unit = '<span class="unit">' + unit + '<span>単位</span></span>';
                    }
                    term_code = -1;
                    if (term == '　') {
                        term = '';
                    } else if (term.indexOf('前期') != -1) {
                        term_code = 0;
                    } else if (term.indexOf('後期') != -1) {
                        term_code = 1;
                    }

                    unit_ids = to_unit_id(name);

                    $(this).parent().addClass('cid-' + id.substr(0, 3));
                    $(this).parent().addClass('name-' + name);
                    if (got_units.indexOf(name) != -1) {
                        $(this).parent().addClass('got');
                    }
                    $(this).parent().addClass('name-' + name);
                    if (term_code != -1) {
                        $(this).parent().addClass('term-' + term_code);
                    }


                    units_html = '';
                    $name_el = $('<span/>').addClass('name').html(name);
                    $term_el = $('<span/>').addClass('term').html(term);
                    if (unit_ids.length != 0) {
                        // unit 科目の処理
                        for (var j = 0; j < unit_ids.length; j++) {
                            $name_el.append(to_unit_str_wrap(unit_ids[j]));
                        }
                    }

                    $(this).html('');
                    $(this).append($('<div/>').append($name_el, $term_el));
                    $(this).after(
                        $('<p/>').addClass('teacher').html('☺' + teacher),
                        $('<p/>').addClass('subs').html('➡').append(
                            $('<span/>').addClass('room').html(room),
                            $span_unit
                        ),
                        $('<p/>').addClass('id').html(id)
                    );
                });

                var $id_params = $('.linkMark .id');

                // style変更
                $('.linkMark>a>div').css({
                    'max-height' : '3em',
                    'overflow' : 'hidden'
                });
                $('.linkMark>a .term').css({
                    'font-size' : '11px',
                    'color' : 'orange'
                });
                $id_params.css({
                    'font-size' : '11px',
                    'color' : 'gray',
                    'display' : 'none'
                });
                $('.linkMark .teacher').css('font-size', '15px');
                $('.linkMark> .room').css({
                    'font-size': '12px',
                    'float' : 'left'
                });
                $('.linkMark>.subs').css({
                    'overflow' : 'auto',
                    'line-height' : '19px'
                });
                $('.linkmark .unit').css({
                    'font-size': '12px',
                    'float' : 'right',
                    'padding' : '0 6px',
                    'background' : '#1d588f',
                    'color' : 'white',
                    'border-radius' : '8px'

                });
                $('.linkmark .unit>span').css({
                    'font-size': '9px',
                });

                $('.koma>span>div').css({
                    'height': '107px'
                });
                $('.koma>span>:not(div:last-child)').css('border-bottom', 'solid 1px');

                // 土曜日の授業がないかチェック
                sut_check = '';
                $('.outline tr.tujoHeight>td:nth-child(7)>span').each(function() {
                    sut_check += $(this).html();
                });
                // 土曜日が空の場合は消去
                if (sut_check == '') {
                    $('.outline tr>*:nth-child(7)').hide();
                }


                var term_cu_str, selector_control, selector;
                if (mode == 's') {
                    term_cu_str = $('#form1\\:lableGakkiName').html().substr(0, 1);
                    $('.left.lineHeight').append('<div id="second-control-box"></div>')

                } else {
                    term_cu_str = $('#form1\\:labelOutLabel3').html().substr(7, 1);
                    $('#form1\\:labelOutLabel').after('<p id="second-control-box"></p>')
                }

                // クラスIDの表示をトグルするチェックボックス
                $('#second-control-box').append('<input id="toggle-show-id" type="checkbox" />クラスIDを表示');
                $('#toggle-show-id').change(function() {
                    if ($(this).is(":checked")) {
                        $id_params.show();
                        $('.koma>span>div').css('height', '117px');
                    } else {
                        $id_params.hide();
                        $('.koma>span>div').css('height', '107px');
                    }
                });

                // 人科のトグル idが11Gから始まるもの
                $('#second-control-box').append('<input id="toggle-show-punit" type="checkbox" checked="" />人科の表示');
                $('#second-control-box').append('<input id="toggle-show-got" type="checkbox" checked=""/>取得科目の表示');
                // 4半期のクラスのみ表示を切り替えるinput
                $('#second-control-box').append(
                        '<input type="radio" name="view-term" value="0" checked="">' + term_cu_str + '期' +
                        '<input type="radio" name="view-term" value="1">' + term_cu_str + '前期' +
                        '<input type="radio" name="view-term" value="2">' + term_cu_str + '後期'
                        );
                var changed_filter = function() {
                    $('.cid-11G').show();
                    $('.got').show();
                    $('.term-0').show();
                    $('.term-1').show();
                    switch($('input[name="view-term"]:radio').val()) {
                        case '0':
                            $('.term-0').show();
                            $('.term-1').show();
                            break;
                        case '1':
                            $('.term-0').show();
                            $('.term-1').hide();
                            break;
                        case '2':
                            $('.term-0').hide();
                            $('.term-1').show();
                            break;
                        default:
                            break;
                    }
                    if (!$('#toggle-show-punit').is(":checked")) {
                        $('.cid-11G').hide();
                    }
                    if (!$('#toggle-show-got').is(":checked")) {
                        $('.got').hide();
                    }
                }
                $('#toggle-show-punit').change(changed_filter);
                $('#toggle-show-got').change(changed_filter);
                $('input[name="view-term"]:radio').change(changed_filter);
            }
        });
    } catch (e) {
        $('body').prepend('<p style="color:red;">[GreasmonkeyScript: BeautifulTimeboard] でエラーが起こっています, 無効にして下さい</p>');
    }

    function to_unit_str(id) {
        return ["CG", "VS", "MI", "WI", "SN", "ST"][id];
    }

    function to_unit_str_long(id) {
        return [
            "Computer Graphics (コンピュータグラフィックス)",
        "Video & Sound (映像と音)",
        "Media & Interaction (メディアとインタラクション)",
        "Web Intelligence (ウェブインテリジェンス)",
        "Security & Network (セキュリティとネットワーク)",
        "Software Technology (ソフトウェアテクノロジ)"
            ][id];
    }

    function to_unit_id(name) {
        lib = [[
            'ＣＧモデリングおよび演習',
        'ＣＧレンダリングおよび演習',
        '形状処理および演習',
        'コンピュータアニメーションおよび演習'
            ], [
            '画像処理',
        '画像処理演習',
        '音声・音響情報処理',
        'コンピュータ音楽作品制作演習',
        'バーチャルリアリティ',
        '音声・音響情報処理'
            ], [
            'ヒューマンインタラクションおよび演習',
        '人間情報システムおよび演習',
        'メディア情報学',
        'インタラクションデザイン'
            ], [
            'サーバ設計論',
        '情報アクセスと知的処理',
        'サーバプログラミング演習',
        'Web情報システム演習',
        'データベースプログラミング演習'
            ], [
            '情報セキュリティの基礎と暗号技術',
        'ネットワークプログラミング',
        'ネットワークプログラミング演習',
        'ネットワークセキュリティおよび演習'
            ], [
            'サーバ設計論',
        'メディア情報学',
        'サーバプログラミング演習',
        'ソフトウェア設計',
        '情報システム論',
        'ソフトウェア分析・モデリング'
            ]];
        kinds = [];
        for (var i = 0; i < lib.length; i++) {
            if (lib[i].indexOf(name) >= 0) {
                kinds.push(i);
            }
        }
        return kinds;
    }

    function to_unit_str_wrap(id) {
        var style = {
            background: 'orange',
            color: 'white',
            'border-radius': '4px',
            'padding-left': '5px',
            'padding-right': '5px',
            'margin-left': '5px',
        };
        // 情報とメディアで色分け
        if (id >= 3) {
            style.background = 'blue';
        }
        return $('<span>').html(to_unit_str(id)).css(style);
    }

});
