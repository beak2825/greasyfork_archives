// ==UserScript==
// @name         Easy Sub Uploader
// @description  Upload subs more conveniently
// @version      0.1
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/torrents.php*
// @include      http*://www.nexushd.org/subtitles.php*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-migrate/3.0.1/jquery-migrate.min.js
// @grant        none
// @icon         http://www.nexushd.org/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @downloadURL https://update.greasyfork.org/scripts/377396/Easy%20Sub%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/377396/Easy%20Sub%20Uploader.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';
    var language_dictionary = {
        '1': ['bg', 'bul', 'Bulgarian'],
        '2': ['hr', 'hrv', 'Croatian'],
        '3': ['cs', 'ces', 'cze', 'Czech'],
        '4': ['da', 'dan', 'Danish'],
        '5': ['nl', 'nld', 'dut', 'Dutch'],
        '6': ['en', 'eng', 'English'],
        '7': ['et', 'est', 'Estonian'],
        '8': ['fi', 'fin', 'Finnish'],
        '9': ['fr', 'fra', 'fre', 'French'],
        '10': ['de', 'deu', 'ger', 'German'],
        '11': ['el', 'ell', 'gre', 'Greek'],
        '12': ['he', 'heb', 'Hebrew'],
        '13': ['hu', 'hun', 'Hungarian'],
        '14': ['it', 'ita', 'Italian'],
        '15': ['ja', 'jpn', 'Japanese', '日本語'],
        '16': ['ko', 'kor', 'Korean', '한국어'],
        '17': ['no', 'nor', 'Norwegian'],
        '19': ['pl', 'pol', 'Polish'],
        '20': ['pt', 'por', 'Portuguese'],
        '21': ['ro', 'ron', 'rum', 'Romanian'],
        '22': ['ru', 'rus', 'Russian'],
        '23': ['sr', 'srp', 'Serbian'],
        '24': ['sk', 'slk', 'slo', 'Slovak'],
        '25': ['chs', 'sc', 'zhs', '简体', '简', '简中', '简体中文', 'ch', 'zh', 'zho', 'chi', 'Simplified', 'Simplified Chinese', 'Chinese'],
        '26': ['es', 'spa', 'Spanish'],
        '27': ['sv', 'swe', 'Swedish'],
        '28': ['cht', 'tc', 'zht', '繁体', '繁體', '繁', '繁中', '繁體中文', 'Traditional', 'Traditional Chinese'],
        '29': ['tr', 'tur', 'Turkish'],
        '30': ['sl', 'slv', 'Slovenian'],
        '31': ['th', 'tha', 'Thai']
    };
    var trim_title_regexp = /\.[^.]+$/;
    var check_lang_regexp = /(?:\.|^)([^.]+)(?:\.\[[^\]]*\])?\.[^.]+$/;
    function checkLang(target, default_language){
        for(var key in language_dictionary){
            var regex = new RegExp('^' + language_dictionary[key].join('$|^') + '$', 'i');
            if(regex.test(target)){
                return key;
            }
        }
        return default_language;
    }
    if(window.location.href.match('/torrents.php')){
        var sub_up_link = $('<a/>', {
            'class': 'subuplink',
            'href': 'subtitles.php',
            'title': 'Upload Subtitles'
        }).append(
            $('<img/>', {
                'src': 'http://www.nexushd.org/attachments/201902/2019020300082767b341b632dddf06fd715731c821e190.gif',
                'style': 'width: 16px'
            })
        );
        var sub_up_button = $('<input/>', {
            'class': 'subupbutton',
            'type': 'file',
            'name': 'file',
            'accept': '.srt, .ssa, .ass, .cue, .zip, .rar'
        }).prop('multiple', 'true').css('display', 'none');
        $('table.torrentname>tbody>tr>td.embedded:last-of-type').append(sub_up_link).append(sub_up_button);
        $('a.subuplink').on('click', function(event){
            event.preventDefault();
            $(this).next('input.subupbutton').trigger('click');
        });
        $('input.subupbutton').on('click', function(event){
            $(this).val('');
        });
        $('input.subupbutton').on('change', function(event){
            var torrent_id = $(this).closest('tr').find('td:first-of-type>a')[0].href.match(/id=(\d+)/)[1];
            var requests = [];
            Array.from(this.files).forEach(function(e){
                var form = new FormData();
                var title = e.name.replace(trim_title_regexp, '');
                var sel_lang = '18';
                try{
                    var lang = e.name.match(check_lang_regexp)[1].split('&');
                    if(lang.length == 1){//单国语言
                        sel_lang = checkLang(lang[0], '18');
                    }
                    else{//多国语言
                        sel_lang = '18';
                    }
                }
                catch(error){};
                form.append('action', 'upload');
                form.append('file', e);
                form.append('torrent_id', torrent_id);
                form.append('title', title);
                form.append('sel_lang', sel_lang);
                form.append('uplver', 'yes');
                requests.push(
                    $.ajax({
                        url: 'subtitles.php',
                        method: 'POST',
                        contentType: false,
                        data: form,
                        processData: false,
                        error: function(jqXHR, textStatus, errorThrown){
                            alert('ERROR: ' + textStatus);
                        }
                    })
                );
            });
            $.when.apply($, requests).then(function(){
                alert('所有字幕均已上传成功！');
            }, function(){
                alert('字幕上传出现问题！');
            });
        });
    }
    else if(window.location.href.match('/subtitles.php')){
        var torrent_id_input = $('#outer>table.main input[name="torrent_id"]');
        var file_input = $('#outer>table.main input[name="file"]');
        var title_input = $('#outer>table.main input[name="title"]');
        var lang_select = $('#outer>table.main select[name="sel_lang"]');
        var anonymous_input = $('#outer>table.main input[name="uplver"]');
        if(torrent_id_input.val() == ''){
            torrent_id_input.val($('#outer>table:not(.main) tr:nth-of-type(2)>td:nth-of-type(2)>a')[0].href.match(/torrentid=(\d+)/)[1]);
        }
        anonymous_input.prop('checked', true);
        file_input.on('change', function(){
            if(this.files.length){
                var sub_file = this.files[0];
                title_input.val(sub_file.name.replace(trim_title_regexp, ''));
                var sel_lang = '18';
                try{
                    var lang = sub_file.name.match(check_lang_regexp)[1].split('&');
                    if(lang.length == 1){//单国语言
                        sel_lang = checkLang(lang[0], '18');
                    }
                    else{//多国语言
                        sel_lang = '18';
                    }
                }
                catch(error){};
                lang_select.find('option[value="' + sel_lang + '"]').prop('selected', true);
            }
        });
    }
})();