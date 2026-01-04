// ==UserScript==
// @name         Post Formatter
// @description  Format upload info and smilies
// @version      1.9
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @grant        none
// @icon         http://www.nexushd.org/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @downloadURL https://update.greasyfork.org/scripts/36224/Post%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/36224/Post%20Formatter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function insert_tyt(myValue,switcher){
        var obj_target;
        if(switcher===1){
            obj_target=$("#compose textarea",window.opener.document)[0];
        }
        else if(switcher===0){
            if($("#compose textarea").length){
                obj_target=$("#compose textarea")[0];
            }
            else if($("#shbox_text").length){
                obj_target=$("#shbox_text")[0];
            }
        }
        else{
            return false;
        }
        var match_obj = /(\n\[\/|\](\[\/|$))/.exec(myValue);
        var startPos = obj_target.selectionStart;
        var endPos = obj_target.selectionEnd;
        obj_target.value = obj_target.value.substring(0, startPos) + myValue + obj_target.value.substring(endPos, obj_target.value.length);
        obj_target.selectionEnd = startPos + myValue.length;
        obj_target.focus();
        if(match_obj){
            obj_target.setSelectionRange(startPos+match_obj.index+1, startPos+match_obj.index+1);
        }
        return true;
    }
    function nestExplode(input_text){
        var output_text,c;
        do{
            output_text = input_text.replace(/\[box((?:=[^\]]+)?\](?:(?!\[\/box\])[\s\S])*\[box(?:=[^\]]+)?\])/g,"[quote$1");
            output_text = output_text.replace(/(\[\/box\](?:(?!\[box(?:=[^\]]+)?\])[\s\S])*)\[\/box\]/g,"$1[/quote]");
            c=(input_text!=output_text);
            input_text=output_text;
        }while(c);
        return output_text;
    }
    function switchBoxQuote(input_text){
        var output_text,c;
        do{
            output_text = input_text.replace(/(\[)(?:box|_x~bTYt_)((?:=[^\]]+)?\](?:(?!\[\/(?:box|_x~bTYt_)\])[\s\S])*\[)quote((?:=[^\]]+)?\](?:(?!\[\/quote\])[\s\S])*\[\/)quote((?:=[^\]]+)?\](?:(?!\[(?:box|_x~bTYt_)(?:=[^\]]+)?\])[\s\S])*\[\/)(?:box|_x~bTYt_)(\])/g,"$1_x~bTYt_$2_e~qTYt_$3_e~qTYt_$4_x~bTYt_$5");
            c=(input_text!=output_text);
            input_text=output_text;
        }while(c);
        output_text = output_text.replace(/_x~bTYt_/g,"quote");
        output_text = output_text.replace(/_e~qTYt_/g,"box");
        return output_text;
    }
    function compact_content(input_text){
        var output_text,c;
        do{
            output_text = input_text.replace(/(\[\/?(?:quote|box|code)(?:=[^\]]+)?\])\s+(\S)/g,"$1$2");
            output_text = output_text.replace(/(\S)\s+(\[\/?(?:quote|box|code)(?:=[^\]]+)?\])/g,"$1$2");
            output_text = output_text.replace(/(\[quote|box|code(?:=[^\]]+)?\](?:(?!\[\/)[\s\S])*\[(?:font|b|i|u|color|size)(?:=[^\]]+)?\])\n+([^\n])/g,"$1$2");
            c=(input_text!=output_text);
            input_text=output_text;
        }while(c);
        return output_text;
    }
    function otherCopyGenerator(other_copy,imdb_number){
        var versions = other_copy.find('table>tbody>tr').length-1;
        var tr_1 = $("<tr>");
        tr_1.attr({
            "id":imdb_number+"_other_copy_tyt"
        });
        var td_1 = $("<td>");
        td_1.attr({
            "class":"rowhead nowrap",
            "valign":"top",
            "align":"right"
        });
        var div_1 = $("<div>");
        var a_1 = $("<a>");
        a_1.attr({
            "href":"javascript: klappe_news('othercopy')"
        });
        var span_1 = $("<span>");
        span_1.attr({
            "class":"nowrap"
        });
        var img_1 = $("<img>");
        if(versions<=5){
            img_1.attr({
                "class":"minus",
                "src":"pic/trans.gif",
                "alt":"Show/Hide",
                "id":"picothercopy"
            });
            other_copy.attr('style','');
        }
        else{
            img_1.attr({
                "class":"plus",
                "src":"pic/trans.gif",
                "alt":"Show/Hide",
                "id":"picothercopy"
            });
            other_copy.attr('style','display:none;');
        }
        span_1.append(img_1).append(' 其他版本');
        a_1.append(span_1);
        div_1.append(a_1);
        td_1.append(div_1);
        var td_2 = $("<td>");
        td_2.attr({
            "class":"rowfollow",
            "valign":"top",
            "align":"left"
        });
        var div_2 = $("<div>");
        var b_1 = $("<b>");
        b_1.append(versions+'个其它版本');
        div_2.append(b_1).append('<br>').append(other_copy);
        td_2.append(div_2);
        tr_1.append(td_1).append(td_2);
        return tr_1;
    }
    function otherCopyHeaderGenerator(){
        var tr_1 = $('<tr>');
        var td_1 = $('<td>');
        td_1.attr({
            "class":"colhead",
            "style":"padding: 0px; text-align:center;",
        });
        td_1.append('类型');
        var td_2 = $('<td>');
        td_2.attr({
            "class":"colhead",
            "align":"left",
        });
        td_2.append('标题');
        var td_3 = $('<td>');
        td_3.attr({
            "class":"colhead",
            "align":"center",
        });
        td_3.append('质量');
        var td_4 = $('<td>');
        td_4.attr({
            "class":"colhead",
            "align":"center",
        });
        var img_1 = $('<img>');
        img_1.attr({
            "class":"size",
            "src":"pic/trans.gif",
            "alt":"size",
            "title":"大小"
        });
        td_4.append(img_1);
        var td_5 = $('<td>');
        td_5.attr({
            "class":"colhead",
            "align":"center",
        });
        var img_2 = $('<img>');
        img_2.attr({
            "class":"time",
            "src":"pic/trans.gif",
            "alt":"time added",
            "title":"添加时间"
        });
        td_5.append(img_2);
        var td_6 = $('<td>');
        td_6.attr({
            "class":"colhead",
            "align":"center",
        });
        var img_3 = $('<img>');
        img_3.attr({
            "class":"seeders",
            "src":"pic/trans.gif",
            "alt":"seeders",
            "title":"种子数"
        });
        td_6.append(img_3);
        var td_7 = $('<td>');
        td_7.attr({
            "class":"colhead",
            "align":"center",
        });
        var img_4 = $('<img>');
        img_4.attr({
            "class":"leechers",
            "src":"pic/trans.gif",
            "alt":"leechers",
            "title":"下载数"
        });
        td_7.append(img_4);
        tr_1.append(td_1).append(td_2).append(td_3).append(td_4).append(td_5).append(td_6).append(td_7);
        return tr_1;
    }
    function otherCopyFirstRowGenerator(data,torrent_class,icon_td_element,title){
        var cat = icon_td_element.find('a').attr('href').match(/(\?)([\s\S]+)/)[2];
        icon_td_element.find('a').attr('href','torrents.php?allsec=1&'+cat);
        var torrent_id = $(data).find('#bookmark0').attr('href').match(/bookmark\((\d+)/)[1];
        var info_1 = $(data).find('#outer>table>tbody>tr:nth-child(3)>td:nth-child(2)').text();
        var type = info_1.match(/类型:\s*(\w+(\s\w+)?)\s*/)[1];
        var source_array = info_1.match(/来源:\s*(\S+(\s\w+)?)\s*/);
        var source = '';
        if(source_array){
            source = source_array[1];
        }
        var codec_array = info_1.match(/编码:\s*(\S+)\s*/);
        var codec = '';
        if(codec_array){
            codec = codec_array[1];
        }
        var standard_array = info_1.match(/分辨率:\s*(\w+)\s*/);
        var standard = '';
        if(standard_array){
            standard = standard_array[1];
        }
        var processing_array = info_1.match(/处理:\s*(\w+)\s*/);
        var processing = '';
        if(processing_array){
            processing = processing_array[1];
        }
        var size = info_1.match(/大小：\s*(\S+(\s\w+)?)\s*/)[1];
        var quality = source+', '+codec+', '+standard+', '+processing;
        var date = $(data).find('#outer>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().match(/发布于([\s\S]+)$/)[1];
        var seeders = $(data).find('#peercount').text().match(/(\d+)个做种者/)[1];
        var leechers = $(data).find('#peercount').text().match(/(\d+)个下载者/)[1];
        var tr_1 = $('<tr>');
        tr_1.attr({
            "class":torrent_class
        });
        var td_1 = $('<td>');
        td_1.attr({
            "class":"rowfollow",
            "align":"left"
        });
        var a_1 = $('<a>');
        a_1.attr({
            "href":"http://www.nexushd.org/details.php?id="+torrent_id+"&hit=1"
        });
        a_1.append(title);
        td_1.append(a_1);
        var td_2=$('<td>');
        td_2.attr({
            "class":"rowfollow",
            "align":"left"
        });
        td_2.append(quality);
        var td_3=$('<td>');
        td_3.attr({
            "class":"rowfollow",
            "align":"center"
        });
        td_3.append(size);
        var td_4=$('<td>');
        td_4.attr({
            "class":"rowfollow nowrap",
            "align":"center"
        });
        td_4.append(date);
        var td_5=$('<td>');
        td_5.attr({
            "class":"rowfollow",
            "align":"center"
        });
        td_5.append(seeders);
        var td_6=$('<td>');
        td_6.attr({
            "class":"rowfollow",
            "align":"center"
        });
        td_6.append(leechers);
        tr_1.append(icon_td_element).append(td_1).append(td_2).append(td_3).append(td_4).append(td_5).append(td_6);
        return tr_1;
    }
    //============================================================
    if(window.location.href.match(/(upload|edit)\.php/)){
        var input_1 = $("<input>");
        input_1.attr({
            "type":"button",
            "name":"bingo_converter",
            "value":"BINGO",
            "style":"font-size: 11px; margin-right: 3px",
        });
        input_1.click(function(){
            var old_text = $("#descr").val();
            var new_text = old_text.replace(/(\[\/?)([A-Z]+)((?:=(?:[^\r\n\t\f\v \[\]])+)?\])/g, function(match, p1, p2, p3) {
                p2 = p2.toLowerCase();
                return p1+p2+p3;
            });
            new_text = new_text.replace(/\[(\/)?(?:spoiler|hide)((?:=[^\]]+)?)\]/g,"[$1box$2]");
            new_text = new_text.replace(/\[pre\]/g,"[font=courier new]");
            new_text = new_text.replace(/\[\/pre\]/g,"[/font]");
            new_text = nestExplode(new_text);
            new_text = switchBoxQuote(new_text);
            new_text = new_text.replace(/(?:(?:\[\/(url|flash|flv))|^)(?:(?!\[(url|flash|flv))[\s\S])*(?:(?:\[(url|flash|flv))|$)/g,function(matches){
                return(matches.replace(/\[align(=\w*)?\]/g,"\n"));
            });
            new_text = new_text.replace(/\[(\/)?align(=\w*)?\]/g,"");
            new_text = new_text.replace(/^\s*([\s\S]*\S)\s*$/g,"$1");//是否要加上第一行？/^(\s*\n)?([\s\S]*\S)\s*$/g
            new_text = new_text.replace(/\[size=(\d+)\]/g, function(match, p1){
                if(parseInt(p1)>7){
                    return('[size=7]');
                }
                return(match);
            });
            new_text = compact_content(new_text);
            $("#descr").val(new_text);
            //=========================================================================================================
            if (new_text.match("◎")){
                var T_title_array = new_text.match(/译\s*名\s*([^\/\n]+)(?:\/|\n)/);
                var O_title_array = new_text.match(/片\s*名\s*([^\/\n]+)(?:\/|\n)/);
                var ch_title="";
                if(T_title_array&&O_title_array){
                    if(new_text.match(/产\s*地\s*中国大陆\n/)){
                        ch_title = O_title_array[1]+" | ";
                    }
                    else{
                        ch_title = T_title_array[1]+" | ";
                    }
                }
                var festival_array = new_text.match(/(\d{4})-\d{2}-\d{2}\((\S+电影节)\)/);
                var festival = "";
                if(festival_array){
                    festival = festival_array[1]+festival_array[2]+" | ";
                }
                var catagory_array = new_text.match(/类\s*别\s+([^\n]*)\s*\n/);
                var catagory = "";
                if(catagory_array){
                    catagory = catagory_array[1].replace(/\//g," / ")+" | ";
                }
                var doub_score_array = new_text.match(/豆\s*瓣\s*评\s*分\s+(\d\.\d)\/10\sfrom\s((?:\d+,)*\d+)\susers/);
                var doub_score = "";
                if(doub_score_array){
                    doub_score = "豆瓣 "+doub_score_array[1]+"（"+doub_score_array[2]+"） | ";
                }
                var doub_link_array = new_text.match(/豆瓣\s*链\s*接\s+([^\s\n]+)\s*\n/);
                if (doub_link_array){
                    $("input[name='douban_url']").val(doub_link_array[1]);
                }
                else{
                    $("input[name='douban_url']").val("");
                }
                var imdb_score_array = new_text.match(/IMDb\s*评\s*分\s+(\d\.\d)\/10\sfrom\s((?:\d+,)*\d+)\susers/i);
                var imdb_score = "";
                if(imdb_score_array){
                    imdb_score = "IMDb "+imdb_score_array[1]+"（"+imdb_score_array[2]+"） | ";
                }
                var imdb_link_array = new_text.match(/IMDb\s*链\s*接\s+([^\s\n]+)\s*\n/i);
                if(imdb_link_array){
                    $("input[name='url'][type='text']").val(imdb_link_array[1]);
                }
                else{
                    $("input[name='url'][type='text']").val("");
                }
                var director_array = new_text.match(/导\s*演\s+([^\w\n\s]*)\s*/);
                var director="";
                if(director_array){
                    director=director_array[1];
                }
                var subtitle = ch_title+festival+catagory+doub_score+imdb_score+director;
                $("input[name='small_descr']").val(subtitle);
                var cata_num=0;
                if(catagory.match('纪录')){
                    cata_num=104;
                }
                else if(catagory.match('动画')){
                    cata_num=105;
                }
                else if(catagory.match('秀')){
                    cata_num=103;
                }
                else if(new_text.match(/集\s*数\s+/g)){
                    cata_num=102;
                }
                else if(catagory!==""){
                    cata_num=101;
                }
                $("#browsecat").val(cata_num);
            }
            else{
                $("input[name='douban_url']").val("");
                $("input[name='url'][type='text']").val("");
                $("input[name='small_descr']").val("");
                $("#browsecat").val(0);
            }
            //=========================================================================================================
            $("#name").val($("#name").val().replace(/\s+(?:mkv|mp4|iso|ts)\s*$/gi,""));
            $("#name").val($("#name").val().replace(/^\[.*\]\s(\S)/gi,"$1"));
            var title = $("#name").val();
            if(title!==""){
                if(title.match(/\W1080p\W/gi)){
                    $("select[name='standard_sel']").val(1);
                }
                else if(title.match(/\W1080i\W/gi)){
                    $("select[name='standard_sel']").val(2);
                }
                else if(title.match(/\W720p\W/gi)){
                    $("select[name='standard_sel']").val(3);
                }
                else if(title.match(/\W(?:2160p|4k)\W/gi)){
                    $("select[name='standard_sel']").val(6);
                }
                else if(title.match(/\Wdvd/gi)){
                    $("select[name='standard_sel']").val(4);
                }
                if(title.match(/\W(?:remux|web\-?dl)\W/gi)){
                    $("select[name='processing_sel']").val(1);
                }
                else{
                    $("select[name='processing_sel']").val(2);
                }
                if(title.match(/\W(?:h|x)\.?264\W/gi)){
                    $("select[name='codec_sel']").val(1);
                }
                else if(title.match(/\W(?:h|x)\.?265\W/gi)){
                    $("select[name='codec_sel']").val(12);
                }
                else if(title.match(/\Wflac/gi)){
                    $("select[name='codec_sel']").val(10);
                }
                if(title.match(/\W(?:blu(?:e|\-)?ray|bdrip)\W/gi)){
                    $("select[name='source_sel']").val(1);
                }
                else if(title.match(/\Wdvd/gi)){
                    $("select[name='source_sel']").val(3);
                }
                else if(title.match(/\Whdtv\W/gi)){
                    $("select[name='source_sel']").val(4);
                }
                else if(title.match(/\Wweb\-?dl\W/gi)){
                    $("select[name='source_sel']").val(7);
                }
                else if(title.match(/\Wwebrip\W/gi)){
                    $("select[name='source_sel']").val(9);
                }
            }
            var imdb_array = $('#compose input[type="text"][name="url"]')[0].value.match(/tt\d{7}/);
            if(imdb_array){
                if(!$('#'+imdb_array[0]+'_other_copy_tyt')[0]){
                    var imdb_number = imdb_array[0];
                    $.ajax({
                        url: 'torrents.php',
                        data: 'search='+imdb_number+'&search_area=4&search_mode=0',
                        success: function(data_1){
                            var title_href = $(data_1).find('#outer table.torrents>tbody>tr:nth-child(2) table.torrentname td:first-child a').attr('href');
                            if(title_href){
                                var torrent_class = $(data_1).find('#outer table.torrents>tbody>tr:nth-child(2)').attr('class');
                                var icon_td = $(data_1).find('#outer table.torrents>tbody>tr:nth-child(2)>td:first-child');
                                var torrent_title = $(data_1).find('#outer table.torrents>tbody>tr:nth-child(2) table.torrentname>tbody>tr>td:first-child>a').attr('title');
                                $.ajax({
                                    url: title_href,
                                    data: '',
                                    success: function(data_2){
                                        var other_copy = $(data_2).find('#kothercopy');
                                        var other_copy_first_row = otherCopyFirstRowGenerator(data_2,torrent_class,icon_td,torrent_title);
                                        var oc_tr_1;
                                        if(other_copy[0]){
                                            other_copy.find('table>tbody>tr:first-child').after(other_copy_first_row);
                                            oc_tr_1 = otherCopyGenerator(other_copy,imdb_number);
                                        }
                                        else{
                                            var other_copy_header = otherCopyHeaderGenerator();
                                            var other_copy_div = $('<div>');
                                            other_copy_div.attr({
                                                "id":"kothercopy",
                                            });
                                            var other_copy_table = $('<table>');
                                            other_copy_table.attr({
                                                "border":"1",
                                                "cellspacing":"0",
                                                "cellpadding":"5"
                                            });
                                            var other_copy_tbody = $('<tbody>');
                                            other_copy_tbody.append(other_copy_header).append(other_copy_first_row);
                                            other_copy_table.append(other_copy_tbody);
                                            other_copy_div.append(other_copy_table);
                                            oc_tr_1 = otherCopyGenerator(other_copy_div,imdb_number);
                                        }
                                        $('tr[id$="_other_copy_tyt"]').remove();
                                        $('#compose>table>tbody>tr:last-child').before(oc_tr_1);
                                    }});
                            }
                            else{
                                $('tr[id$="_other_copy_tyt"]').remove();
                            }
                        }
                    });
                }
            }
            else{
                $('tr[id$="_other_copy_tyt"]').remove();
            }
            $("#descr").focus();
            //=========================================================================================================
        });
        var td_1 = $("<td>");
        td_1.attr({
            "class":"embedded"
        });
        var tr_1 = $("<tr>");
        tr_1.attr({
            "id":"multi_function"
        });
        var tbody_1 = $("<tbody>");
        var table_1 = $("<table>");
        table_1.attr({
            "cellspaceing":"1",
            "cellpadding":"2",
            "border":"0",
            "style":"margin-top:3px"
        });
        td_1.append(input_1);
        tr_1.append(td_1);
        tbody_1.append(tr_1);
        table_1.append(tbody_1);
        $('#compose input[name="quote"]').closest('table').after(table_1);
        //=================================================================================================
        var input_4 = $("<input>");
        input_4.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"box",
            "value":"BOX",
            "style":"font-size:11px;margin-right:3px",
        });
        input_4.click(function(){
            insert_tyt('[box][/box]',0);
        });
        var td_3 = $("<td>");
        td_3.attr({
            "class":"embedded"
        });
        td_3.append(input_4);
        $("#multi_function").prepend(td_3);
        var input_5 = $("<input>");
        input_5.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"del",
            "value":"DEL",
            "style":"font-size:11px;margin-right:3px",
        });
        input_5.click(function(){
            insert_tyt('[del][/del]',0);
        });
        var td_4 = $("<td>");
        td_4.attr({
            "class":"embedded"
        });
        td_4.append(input_5);
        td_3.after(td_4);
        var input_6 = $("<input>");
        input_6.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"code",
            "value":"CODE",
            "style":"font-size:11px;margin-right:3px",
        });
        input_6.click(function(){
            insert_tyt('[code][/code]',0);
        });
        var td_5 = $("<td>");
        td_5.attr({
            "class":"embedded"
        });
        td_5.append(input_6);
        td_4.after(td_5);
        var input_7 = $("<input>");
        input_7.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"star",
            "value":"*",
            "style":"font-size:11px;margin-right:3px",
        });
        input_7.click(function(){
            insert_tyt('[*]',0);
        });
        var td_6 = $("<td>");
        td_6.attr({
            "class":"embedded"
        });
        td_6.append(input_7);
        td_5.after(td_6);
        var input_8 = $("<input>");
        input_8.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"mediainfowithquote",
            "value":"QMDIF",
            "style":"font-size:11px;margin-right:3px",
        });
        input_8.click(function(){
            insert_tyt('[quote][box=MediaInfo][/box][/quote]',0);
        });
        var td_7 = $("<td>");
        td_7.attr({
            "class":"embedded"
        });
        td_7.append(input_8);
        td_6.after(td_7);
        var input_9 = $("<input>");
        input_9.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"mediainfo",
            "value":"MDIF",
            "style":"font-size:11px;margin-right:3px",
        });
        input_9.click(function(){
            insert_tyt('[box=MediaInfo][/box]',0);
        });
        var td_8 = $("<td>");
        td_8.attr({
            "class":"embedded"
        });
        td_8.append(input_9);
        td_7.after(td_8);
        var input_10 = $("<input>");
        input_10.attr({
            "type":"button",
            "class":"codebuttons",
            "name":"releaseinfo",
            "value":"RLIF",
            "style":"font-size:11px;margin-right:3px",
        });
        input_10.click(function(){
            insert_tyt('[quote][b]Release iNFO[/b][font=courier new]\n[/font][/quote]',0);
        });
        var td_9 = $("<td>");
        td_9.attr({
            "class":"embedded"
        });
        td_9.append(input_10);
        td_8.after(td_9);
        //========================================================================================
    }
    var smiles_num = $("a[href*='SmileIT']").length;
    var switcher = 0;
    if(window.location.href.match(/moresmilies\.php/)){
        switcher = 1;
    }
    $("a[href*='SmileIT']").click(function(){
        insert_tyt(this.getAttribute("href").match(/\[em\d+\]/)[0],switcher);
        return false;
    });
})();