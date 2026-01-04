// ==UserScript==
// @name         HTML2BBCODE
// @description  Convert HTML to BBCode & Copy to Clipboard
// @version      0.6
// @author       Secant(TYT@NexusHD)
// @include      *
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @icon         http://www.nexushd.org/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38251/HTML2BBCODE.user.js
// @updateURL https://update.greasyfork.org/scripts/38251/HTML2BBCODE.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    'use strict';
    function html2bbcodeInterpreter(input_obj) {
        var description_obj = input_obj.clone();
        description_obj.find('blockquote.quote').map(function(){
            $(this).attr('quoter',($(this).contents().toArray().map(function(mem){
                return mem.textContent.trim();
            }).join(' ').match(/引用: ((?:(?!  )[\s\S])*)  /)||['',''])[1]);
        });
        description_obj.find('legend>span').map(function(){
            $(this).html($(this).text());
        });
        description_obj.find(
            ':not(img, br, input):empty,'+
            'script,'+
            '#append_parent,'+
            '#ajaxwaitid,'+
            '#h2b_,'+
            'div.well.small,'+
            'a[onclick="BBCode.spoiler(this);"],'+
            'label[onclick="showHideBB(this);"]>span,'+
            'blockquote.quote>:first-child(),'+
            'div.codetop').remove();
        var a_hrefs = [], img_hrefs = [], hide_labels = [];
        description_obj.find('a').map(function () {
            a_hrefs.push(this.href);
        });
        description_obj.find('img').map(function () {
            var img_href;
            if (this.alt && this.alt.match(/\.(png|jpeg|jpg|gif)$/i)) {
                img_href = this.alt;
            } else {
                img_href = this.src;
            }
            img_href = img_href.replace(/(\S+)(http\S*)/, function (matches, p1, p2) {
                if (p1) {
                    return decodeURIComponent(p2);
                } else {
                    return matches;
                }
            });
            img_hrefs.push(img_href);
        });
        description_obj.find('label.label_showhide').map(function(){
            hide_labels.push($(this).text().replace('Hidden text','').trim());
        });
        description_obj.find('label.label_showhide').remove();
        var old_text = description_obj.html();
        var new_text = old_text.replace(/\n/g, '');
        new_text = new_text.replace(/<br[^>]*>/g, '\n');
        new_text = new_text.replace(/\t+/g, '\t');
        new_text = new_text.replace(/&amp;/gi, '&');
        new_text = new_text.replace(/&nbsp;/gi, ' ');
        new_text = new_text.replace(/<strong(?:\s+[^>]+)?>([^<]+)<\/strong> wrote: <blockquote>/g, '<blockquote quoter="$1">');
        //---------------------------------------------------------------
        var exec_result;
        //是否引入删除每一行前面的空格这一功能暂时待定
        new_text = new_text.replace(/(?:(?:<\/pre>)|^)(?:(?!<pre>)[\s\S])*(?:(?:<pre>)|$)/g, function (matches, p1, p2, p3, offset, string) {
            if (matches) {
                return matches.replace(/(\n|^) +/g, '$1');
            } else {
                return string.replace(/(\n|^) +/g, '$1');
            }
        });
        //[font=courier new]内部的BBCode转换为HTML时会吃掉每一行第一个空格，若某一行开头需要用空格控制缩进效果，就会出现少缩进一个空格的效果，
        //因此需要手动加空格
        new_text = new_text.replace(/(<pre>)((?:(?!<\/pre>)[\s\S])*)(<\/pre>)/g, function (matches, p1, p2, p3) {
            if (matches) {
                return p1+p2.replace(/\n /g,'\n  ')+p3;
            }
        });
        //---------------------------------------------------------------
        var regular_expression_1 = /<(:?\/)?([\w\-]+)((?:\s+[\w\-]+="[^"]*")*)>/;
        var regular_expression_2 = /<([\w\-]+)((?:\s+[\w\-]+="[^"]*")*)>/;
        var regular_expression_3 = /<\/([\w\-]+)((?:\s+[\w\-]+="[^"]*")*)>/;
        var end_tag_array = [];
        var quote_accumulator = 0;
        var box_accumulator = 0;
        var quote_from = '';
        var url_check, quote_tag_value, temp_exec_result;
        while ((exec_result = regular_expression_1.exec(new_text)) != null) {
            var start_index = exec_result.index;
            var stop_index = exec_result.index + exec_result[0].length;
            regular_expression_1.lastIndex = stop_index;
            if (exec_result[0].match(regular_expression_2)) {
                switch (exec_result[2]) {
                    case 'blockquote':
                        var blockquote_tag;
                        if ((blockquote_tag = exec_result[3].match(/quoter="([^"]+)"/))) {
                            new_text = new_text.substring(0, start_index) + '[quote=' + blockquote_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/quote]');
                        }
                        else if(exec_result[3].match(/class\s*=\s*"[^"]*spoiler[^"]*"/)) {
                            new_text = new_text.substring(0, start_index) + '[spoiler]' + new_text.substring(stop_index);
                            end_tag_array.push('[/spoiler]');
                        }
                        else{
                            new_text = new_text.substring(0, start_index) + '[quote]' + new_text.substring(stop_index);
                            end_tag_array.push('[/quote]');
                        }
                        break;
                    case 'strong':
                        new_text = new_text.substring(0, start_index) + '[b]' + new_text.substring(stop_index);
                        end_tag_array.push('[/b]');
                        break;
                    case 'b':
                        new_text = new_text.substring(0, start_index) + '[b]' + new_text.substring(stop_index);
                        end_tag_array.push('[/b]');
                        break;
                    case 'em':
                        new_text = new_text.substring(0, start_index) + '[i]' + new_text.substring(stop_index);
                        end_tag_array.push('[/i]');
                        break;
                    case 'u':
                        new_text = new_text.substring(0, start_index) + '[u]' + new_text.substring(stop_index);
                        end_tag_array.push('[/u]');
                        break;
                    case 'pre':
                        new_text = new_text.substring(0, start_index) + '[pre]' + new_text.substring(stop_index);
                        end_tag_array.push('[/pre]');
                        break;
                    case 'li':
                        new_text = new_text.substring(0, start_index) + '[*]' + new_text.substring(stop_index);
                        end_tag_array.push('\n');
                        break;
                    case 'div':
                        var div_tag;
                        if ((div_tag = exec_result[3].match(/text\-align:\s*([^";]+)[\s\S]*"/))) {
                            new_text = new_text.substring(0, start_index) + '[align=' + div_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/align]');
                            break;
                        } else if ((div_tag = exec_result[3].match(/class\s*=\s*"codemain"/))) {
                            new_text = new_text.substring(0, start_index) + '[code]' + new_text.substring(stop_index);
                            end_tag_array.push('[/code]');
                            break;
                        } else if (exec_result[3].match(/class\s*=\s*"quotetitle"/) && box_accumulator === 0) {
                            box_accumulator = 1;
                        } else if (exec_result[3].match(/class\s*=\s*"quotecontent"/) && box_accumulator === 2) {
                            box_accumulator = 3;
                        } else if (exec_result[3].match(/style/) && box_accumulator === 3) {
                            box_accumulator = 0;
                            new_text = new_text.substring(0, start_index) + '[spoiler]' + new_text.substring(stop_index);
                            end_tag_array.push('[/spoiler]');
                            break;
                        } else if (exec_result[3].match(/class\s*=\s*"div_showhide"/)){
                            var hide_title = hide_labels.pop();
                            new_text = new_text.substring(0, start_index) + '[hide'+(hide_title?('='+hide_title):'')+']' + new_text.substring(stop_index);
                            end_tag_array.push('[/hide]');
                            break;
                        }
                        else {
                            box_accumulator = 0;
                        }
                        new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                        end_tag_array.push('\n');
                        break;
                    case 'input':
                        var button_tag = exec_result[3].match(/type\s*=\s*"button"/);
                        if (button_tag && box_accumulator === 1) {
                            box_accumulator = 2;
                        } else {
                            box_accumulator = 0;
                        }
                        new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                        break;
                    case 'span':
                        var span_tag;
                        if (quote_accumulator === 2) {
                            span_tag = new_text.substring(start_index).match(/> ?([^<]*) ?<\/span>/)[1];
                            temp_exec_result = /<\/span>/.exec(new_text.substring(start_index));
                            if (span_tag) {
                                quote_from = '=' + span_tag.trim();
                            }
                            new_text = new_text.substring(0, start_index) + '[quote' + quote_from + ']' + new_text.substring(start_index + temp_exec_result.index + 7);
                            end_tag_array.push('[/quote]');
                            end_tag_array.push('');
                            quote_from = '';
                            quote_accumulator = 0;
                        } else if ((span_tag = exec_result[3].match(/font\-family:\s*'([^']+)'/))) {
                            new_text = new_text.substring(0, start_index) + '[font=' + span_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/font]');
                        } else if ((span_tag = exec_result[3].match(/[^\-]color:\s*([^";]+)[\s\S]*"/))) {
                            span_tag[1] = span_tag[1].replace(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/g, function (matches, p1, p2, p3) {
                                return '#' + parseInt(p1).toString(16) + parseInt(p2).toString(16) + parseInt(p3).toString(16);
                            });
                            new_text = new_text.substring(0, start_index) + '[color=' + span_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/color]');
                        /*} else if((span_tag = exec_result[3].match(/[^\-]font\-size:\s*(\d+)[\s\S]*"/))){
                            new_text = new_text.substring(0, start_index) + '[size=' + span_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/size]');*///这一部分涉及到字体大小的单位转换，先不考虑去掉了。
                        } else if ((span_tag = exec_result[3].match(/class\s*=\s*"size(\d+)[\s\S]*"/))) {
                            new_text = new_text.substring(0, start_index) + '[size=' + span_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/size]');
                        } else if((span_tag = exec_result[3].match(/class\s*=\s*"spoiler"/))){
                            new_text = new_text.substring(0, start_index) + '[spoiler]' + new_text.substring(stop_index);
                            end_tag_array.push('[/spoiler]');
                        } else if ((span_tag = exec_result[3].match(/text\-decoration:\s*underline\s*/))) {
                            new_text = new_text.substring(0, start_index) + '[u]' + new_text.substring(stop_index);
                            end_tag_array.push('[/u]');
                        } else if ((span_tag = exec_result[3].match(/text\-decoration:\s*line-through\s*/))) {
                            new_text = new_text.substring(0, start_index) + '[del]' + new_text.substring(stop_index);
                            end_tag_array.push('[/del]');
                        } else {
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                            end_tag_array.push('');
                        }
                        break;
                    case 'a':
                        var href_tag = a_hrefs.shift();
                        new_text = new_text.substring(0, start_index) + '[url=' + href_tag.replace(/(\S+)(http\S*)/, function (matches, p1, p2) {
                            if (p1) {
                                return decodeURIComponent(p2);
                            } else {
                                return matches;
                            }
                        }) + ']' + new_text.substring(stop_index);
                        end_tag_array.push('[/url]');
                        break;
                    case 'img':
                        var img_tag = img_hrefs.shift();
                        if(img_tag.match(/^emoji/)){
                            new_text = new_text.substring(0,start_index) + img_tag.replace(/^emoji/,'') + new_text.substring(stop_index);
                        }else{
                            new_text = new_text.substring(0,start_index) + '[img]' + img_tag + '[/img]' + new_text.substring(stop_index);
                        }
                        break;
                    case 'font':
                        var font_tag;
                        if ((font_tag = exec_result[3].match(/[^\-]color\s*=\s*"([^"]+)"/))) {
                            font_tag[1] = font_tag[1].replace(/rgb\((\d+)\s+(\d+)\s+(\d+)\)/g, function (matches, p1, p2, p3) {
                                return '#' + parseInt(p1).toString(16) + parseInt(p2).toString(16) + parseInt(p3).toString(16);
                            });
                            new_text = new_text.substring(0, start_index) + '[color=' + font_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/color]');
                        } else if ((font_tag = exec_result[3].match(/[^\-]face\s*=\s*"([^"]+)"/))) {
                            new_text = new_text.substring(0, start_index) + '[font=' + font_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/font]');
                        } else if ((font_tag = exec_result[3].match(/[^\-]size\s*=\s*"(\d+)"/))) {
                            new_text = new_text.substring(0, start_index) + '[size=' + font_tag[1] + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/size]');
                        } else {
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                            end_tag_array.push('');
                        }
                        break;
                    case 'p':
                        if (exec_result[3].match(/class\s*=\s*"sub"/) && quote_accumulator === 0) {
                            quote_accumulator = 1;
                            quote_tag_value = new_text.substring(start_index).match(/<b>([\s\S]+)<\/b><\/p>/)[1].match(/([\s\S]*) wrote:/);
                            temp_exec_result = /<\/p>/.exec(new_text.substring(start_index));
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(start_index + temp_exec_result.index + 4);
                            if (quote_tag_value) {
                                quote_from = '=' + quote_tag_value[1];
                            }
                        } else {
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                            end_tag_array.push('');
                        }
                        break;
                    case 'td':
                        if (quote_accumulator === 1) {
                            new_text = new_text.substring(0, start_index) + '[quote' + quote_from + ']' + new_text.substring(stop_index);
                            end_tag_array.push('[/quote]');
                            quote_from = '';
                            quote_accumulator = 0;
                        } else {
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                            end_tag_array.push('');
                        }
                        break;
                    case 'fieldset':
                        if (quote_accumulator === 0) {
                            quote_accumulator = 1;
                        } else {
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                            end_tag_array.push('');
                        }
                        break;
                    case 'legend':
                        if (quote_accumulator === 1) {
                            quote_tag_value = new_text.substring(start_index).match(/引用|Quote(:[\s\S]*)? <\/legend>/);
                            temp_exec_result = /<\/legend>/.exec(new_text.substring(start_index));
                            if (quote_tag_value) {
                                if (quote_tag_value[1]) {
                                    quote_from = '=' + quote_tag_value[1].substring(1).trim();
                                }
                            } else {
                                quote_accumulator = 2;
                                break;
                            }
                            new_text = new_text.substring(0, start_index) + '[quote' + quote_from + ']' + new_text.substring(start_index + temp_exec_result.index + 10);
                            end_tag_array.push('[/quote]');
                            quote_from = '';
                            quote_accumulator = 0;
                        } else {
                            new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                            end_tag_array.push('');
                        }
                        break;
                    default:
                        new_text = new_text.substring(0, start_index) + '' + new_text.substring(stop_index);
                        end_tag_array.push('');
                }
            } else if (exec_result[0].match(regular_expression_3)) {
                new_text = new_text.substring(0, start_index) + end_tag_array.pop() + new_text.substring(stop_index);
            }
        }
        new_text = new_text.replace(/&quote;/gi, '"');
        new_text = new_text.replace(/&lt;/gi, '<');
        new_text = new_text.replace(/&gt;/gi, '>');
        new_text = new_text.replace(/\n\[\/hide\]/g, '[/hide]');
        new_text = new_text.replace(/([^\n|^])\[\*\]/gi, '$1\n[*]');
        new_text = new_text.replace(/\[url(=[^\]]*)?\]\[\/url\]/g, '');
        new_text = new_text.replace(/\[url(=([^\s\]]*))?\]([^\s\]]+)\[\/url\]/g, function (matches, p1, p2, p3) {
            if (p2 === p3) {
                return p3;
            }
            return matches;
        });
        if (window.location.origin.match('totheglory.im')) {
            new_text = new_text.replace(/\n*\[img\](?:(?!\[\/img\])[\s\S])*(jinzhuan|ico|hit_run)[^\.]*.gif[\s\S]*$/, '');
        }
        new_text = new_text.replace(/^(\s*\n)?([\s\S]*\S)\s*$/g, '$2');
        new_text = new_text.replace(/(\[quote=[^\]]*\])[^\n]*引用[^\n]*\n/g,'$1');
        new_text = new_text.replace(/(\[quote\])[^\n]*引用 /g,'$1');
        end_tag_array = [];
        return new_text;
    }
    function buttonGenerator(name, torrent_id) {
        var attr_dictionary = {
            'H2B': 'HTML2BBCode',
            'MI':'MediaInfo',
            'DI':'DownloadImages'
        };
        var a_1 = $('<a>');
        a_1.attr({
            'href': '#',
            'title': attr_dictionary[name],
            'id': name.toLowerCase() + '_' + torrent_id
        });
        a_1.append(name);
        return a_1;
    }
    function textareaGenerator(textarea_id) {
        var textarea_1 = $('<textarea>');
        textarea_1.attr({
            'id': textarea_id,
            'type': 'text',
            'rows': '1',
            'cols': '2'
        });
        var div_1 = $('<div>');
        div_1.attr({ 'style': 'position:absolute; top:0; left:-9999px;' });
        div_1.append(textarea_1);
        return div_1;
    }
    function copy2Clipboard(id, content, name) {
        if (content !== 'tyt23333') {
            $('#' + id).val(content);
        }
        $('#' + id)[0].select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'Successfully' : 'Unsuccessfully';
            alert(name + ' Fetched ' + msg + '!');
        } catch (err) {
            alert('Oops, Unable to Fetch ' + name + '!');
        }
    }
    if (window.location.href.match(/awesome\-hd\.me\/torrents\.php\?id=/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('tr[id^=torrent_]').map(function () {
            var torrent_id = $(this).attr('id').match(/\d+/);
            $(this).prev().find('td>span').contents().last().remove();
            $(this).prev().find('td>span').append(' | ').append(buttonGenerator('H2B',torrent_id))
                .append(' | ').append(buttonGenerator('MI',torrent_id)).append(' ]');
            $('#h2b_' + torrent_id).click(function () {
                var interpreted_bbcode = html2bbcodeInterpreter($('div[id$=' + torrent_id + '] ~ blockquote'));
                copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
                return false;
            });
            $('#mi_' + torrent_id).click(function () {
                var media_info = $('[id^=torrent_'+torrent_id+'] br\\<blockquote');
                if (media_info.find('blockquote')[0]) {
                    media_info = media_info.find('blockquote');
                }
                copy2Clipboard('c2c_textarea', html2bbcodeInterpreter(media_info).trim(), 'MediaInfo');
                return false;
            });
        });
    } else if (window.location.href.match(/uhdbits\.org\/torrents\.php\?id=/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('tr[id^=torrent][class^=torrent_row]').map(function () {
            var torrent_id = $(this).attr('id').match(/\d+/);
            $(this).find('td>span:first-child').contents().last().remove();
            $(this).find('td>span:first-child').append(' | ').append(buttonGenerator('H2B',torrent_id))
                .append(' | ').append(buttonGenerator('MI',torrent_id)).append(' ]');
            $.ajax({
                url: 'torrents.php',
                method: 'get',
                data: 'action=mediainfo&id=' + torrent_id,
                success: function (data) {
                    $('#mi_' + torrent_id).attr('mediainfo_log', data.trim());
                }
            });
            $('#h2b_' + torrent_id).click(function () {
                var interpreted_bbcode = html2bbcodeInterpreter($('#torrent_' + torrent_id + ' div[id^=description]'));
                copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
                return false;
            });
            $('#mi_' + torrent_id).click(function () {
                copy2Clipboard('c2c_textarea', $('#mi_' + torrent_id).attr('mediainfo_log')||'MediaInfo Empty!', 'MediaInfo');
                return false;
            });
        });
    } else if (window.location.href.match(/hdbits\.org\/details\.php/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        var description_location = $('#details>tbody>tr>td>div.label').filter(function(){
            return $(this).text().match(/Technical Information/);
        }).closest('tr').next().children();
        description_location.prepend(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter(description_location);
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    } else if (window.location.href.match(/totheglory\.im\/(t\/|(details\.php))/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('#t_d').parent().append($('<br>')).append(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter($('#kt_d'));
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    } else if (window.location.href.match(/hdchina\.org\/details\.php/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('#kdescr').closest('tr').children().first().append($('<br>')).append(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter($('#kdescr'));
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    } else if (window.location.href.match(/bt\.byr\.cn\/details\.php/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('#kdescr').closest('tr').children().first().append($('<br>')).append(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter($('#kdescr'));
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    } else if (window.location.href.match(/npupt\.com\/details\.php/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('#kdescr').before(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter($('#kdescr'));
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    } else if (window.location.href.match(/torviet\.com\/(\S*_t\d+\.html|details\.php)/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('#kdescr').prev().append(' ').append(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter($('#kdescr'));
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    } else if (window.location.href.match(/iptorrents\.me\/details\.php/)) {
        $('body').after(textareaGenerator('c2c_textarea'));
        $('.desWrap').closest('tr').find('.vat').append($('<br>')).append(buttonGenerator('H2B',''));
        $('#h2b_').click(function () {
            var interpreted_bbcode = html2bbcodeInterpreter($('.desWrap'));
            copy2Clipboard('c2c_textarea', interpreted_bbcode, 'BBCode');
            return false;
        });
    }
}());