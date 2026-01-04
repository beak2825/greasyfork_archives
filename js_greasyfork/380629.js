// ==UserScript==
// @name         电影信息查询脚本
// @description  Fetch Douban Description, IMDb information and TMDb information
// @version      2.4
// @author       Secant(TYT@NexusHD)
// @include      http*://movie.douban.com/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.js
// @require      https://code.jquery.com/jquery-migrate-1.0.0.js
// @require      https://greasyfork.org/scripts/367610-full-width-half-width-detect/code/Full-width%20Half-width%20Detect.js?version=595740
// @icon         https://movie.douban.com/favicon.ico
// @namespace    https://greasyfork.org/users/152136
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380629/%E7%94%B5%E5%BD%B1%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/380629/%E7%94%B5%E5%BD%B1%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    var TMDB_api_key = atob('OWNmZmQ5MjY4OTUzZDhhYzA1OTYxMWYwMDg2OGNkNmU=');
    var full_half = [[0,15,15,1,0],[1,11,12,0,2],[2,11,13,0,1],[3,10,13,1,0],[4,6,10,0,2],[5,6,11,0,1],[6,5,11,1,0],[7,1,8,0,2],[8,1,9,0,1],[9,0,9,1,0]];
    function nameFormatter(nms, full_half, prop_name, numbers, divider){
        var res =
            nms.map(function(e){
                var display_name = e[prop_name];
                var full_count = 0;
                var half_count = 0;
                var name_row = 0;
                var translated_names = new Array();
                var start_ind = 0;
                for(var char_ind = 0; char_ind<display_name.length; char_ind++){
                    if(eaw.characterLength(display_name.charAt(char_ind))===2){
                        full_count++;
                    }
                    else{
                        half_count++;
                    }
                    if((char_ind+1-start_ind)>=full_half[full_count][2]&&(char_ind+1)!=display_name.length){
                        translated_names[name_row]=display_name.slice(start_ind,char_ind+1)+
                            ' '.repeat(full_half[full_count][3])+
                            '　'.repeat(full_half[full_count][4])+divider;
                        start_ind = char_ind+1;
                        full_count=0;
                        half_count=0;
                        name_row++;
                    }
                }
                translated_names[name_row]=display_name.slice(start_ind,char_ind+1)+
                    ' '.repeat(full_half[full_count][1]-half_count)+
                    ' '.repeat(full_half[full_count][3])+
                    '　'.repeat(full_half[full_count][4])+divider;
                return translated_names;
            });
        var names = new Array();
        for(var item_inds = 0; item_inds < Math.ceil(res.length/numbers); item_inds++){
            names[item_inds] = {};
            names[item_inds].results = res.slice(item_inds*numbers, Math.min(item_inds*numbers+numbers, res.length));
            names[item_inds].max_height = Math.max.apply(null, names[item_inds].results.map(function(e){return e.length;}));
            names[item_inds].pads = names[item_inds].results.map(function(e){
                var e_len = e.length;
                for(var i = 0; i<(names[item_inds].max_height - e_len); i++){
                    e.push(' '.repeat(16)+divider);
                }
                return e;
            });
            names[item_inds].string = '';
            for( var j = 0; j<names[item_inds].max_height; j++){
                for(var i = 0; i<names[item_inds].pads.length; i++){
                    names[item_inds].string += names[item_inds].pads[i][j];
                }
                names[item_inds].string += '\n';
            }
            names[item_inds].string = '[font=courier new][size=1]'+names[item_inds].string.replace(/(^|\n) /g,'$1  ')+'[/size][/font]';
        }
        return names;
    }
    function fadeInThenFadeOut(element_id, content, time){
        $('#'+element_id).text('　'+content);
        $('#'+element_id).fadeIn(function(){
            $(this).delay(time).fadeOut(function(){
                $('#'+element_id).text('');
            });
        });
    }
    function buttonGenerator(movie_id, button_name, button_id, display){
        var span_1 = $('<span>');
        span_1.append(button_name);
        var a_1 = $('<a>');
        a_1.attr({
            'href': 'javascript:void(0)',
            'id': button_id,
            'style': display
        });
        a_1.append(span_1);
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
    if(window.location.href.match(/\/subject\/\d+/)){
        //--------------------------------------------------------------
        var tv_or_movie = '';
        var description_text=[];
        var movie_id = window.location.href.match(/\/subject\/(\d+)/)[1];
        $('#info br:last-of-type')
            .after('<br>')
            .after('<span id="fifo_tyt" style="display:none;color:#007722"></span>')
            .after(buttonGenerator(movie_id,'复制','c2c_tyt','display:none'))
            .after(buttonGenerator(movie_id,'获取','fetch_tyt',''))
            .after('<span class="pl">描述文本:</span> ');
        $('body').after(textareaGenerator('c2c_textarea'));
        //标题
        var this_title, trans_title;
        var chinese_title = document.title.replace('(豆瓣)','').trim();
        var foreign_title = $('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title,'').trim();
        var aka_anchor = $('#info span.pl:contains("又名")')[0];
        var aka;
        if(aka_anchor){
            aka = aka_anchor.nextSibling.nodeValue.trim().split(' / ').sort(function(a,b){
                if(a.match(/\(港\)/)){
                    return -1;
                }else if(b.match(/\(港\)/)){
                    return 1;
                }else if(a.match(/\(台\)/)){
                    return -1;
                }else if(b.match(/\(台\)/)){
                    return 1;
                }else{
                    return -1;//a.localeCompare(b);
                }
            }).join('/');
        }
        if(foreign_title){
            trans_title = chinese_title + (aka?('/' + aka):'');
            this_title = foreign_title;
        }else{
            trans_title = aka?aka:'';
            this_title = chinese_title;
        }
        //年代
        var year = $('#content>h1>span.year').text().slice(1,-1);
        //产地
        var regions_anchor = $('#info span.pl:contains("制片国家/地区")')[0];
        var region;
        if(regions_anchor){
            region = regions_anchor.nextSibling.nodeValue.trim().split(' / ').join('/');
        }
        //类别
        var genre = $('#info span[property="v:genre"]').map(function(){
            return $(this).text().trim();
        }).toArray().join('/');
        //语言
        var language_anchor = $('#info span.pl:contains("语言")')[0];
        var language;
        if(language_anchor){
            language = language_anchor.nextSibling.nodeValue.trim().split(' / ').join('/');
        }
        //上映日期
        var playdate = $('#info span[property="v:initialReleaseDate"]').map(function(){
            return $(this).text().trim();
        }).toArray().sort(function(a,b){//按上映日期升序排列
            return new Date(a) - new Date(b);
        }).join('/');
        //IMDb链接
        var imdb_link_anchor = $('#info span.pl:contains("IMDb链接")');
        var imdb_link;
        if(imdb_link_anchor[0]){
            imdb_link = imdb_link_anchor.next().attr('href').replace(/(\/)?$/,'/');
        }
        var first_season_douban = $('#season>option:not(:selected):contains("1")').attr('value');
        //豆瓣链接
        var douban_link = 'https://' + window.location.href.match(/movie.douban.com\/subject\/\d+\//);
        //集数
        var episodes_anchor = $('#info span.pl:contains("集数")')[0];
        var episodes;
        if(episodes_anchor){
            episodes = episodes_anchor.nextSibling.nodeValue.trim();
        }
        //片长
        var duration_anchor = $('#info span.pl:contains("单集片长")')[0];
        var duration;
        if(duration_anchor){
            duration = duration_anchor.nextSibling.nodeValue.trim();
        }else{
            duration = $('#info span[property="v:runtime"]').text().trim();
        }
        var director, writer, cast;
        var awards;
        var douban_average_rating, douban_votes, douban_rating, introduction, poster;
        var imdb_average_rating, imdb_votes, imdb_rating;
        var tmdb_id, tvdb_id;
        var tags;
        var home_page, tag_line, MPAA_rating, key_words;
        var similars='', recommendations;
        $('#fetch_tyt').click(function () {
            $('#fetch_tyt').attr('style','display:none');
            $('#fetch_tyt').after('获取中...');
            //获奖情况
            var requests = [];
            var itmdb_requests = [];
            var tmdb_detail_requests = [];
            requests.push($.ajax({
                method:'get',
                url: douban_link + 'awards',
                success: function(data){
                    awards = $(data).find('#content>div>div.article').html()
                        .replace(/[ \n]/g,'')
                        .replace(/<\/li><li>/g,'</li> <li>')
                        .replace(/<\/a><span/g,'</a> <span')
                        .replace(/<(div|ul)[^>]*>/g,'\n')
                        .replace(/<[^>]+>/g,'')
                        .replace(/&nbsp;/g,' ')
                        .replace(/ +\n/g,'\n')
                        .trim();
                }
            }));
            //豆瓣评分，简介，海报，导演，编剧，演员，标签
            requests.push($.ajax({
                type : 'get',
                url : 'https://api.douban.com/v2/movie/'+movie_id,
                dataType : 'jsonp',
                jsonpCallback:'callback',
                success : function(json){
                    douban_average_rating = json.rating.average;
                    douban_votes = json.rating.numRaters.toLocaleString();
                    douban_rating = douban_average_rating + '/10 from '+douban_votes+' users';
                    introduction = json.summary.replace(/^None$/g,'暂无相关剧情介绍');
                    poster = json.image.replace(/s(_ratio_poster|pic)/g,'l$1');
                    director = json.attrs.director?json.attrs.director.join(' / '):'';
                    writer = json.attrs.writer?json.attrs.writer.join(' / '):'';
                    cast = json.attrs.cast?json.attrs.cast.join('\n'):'';
                    tags = json.tags.map(function(member){
                        return member.name;
                    }).join(' | ');
                }
            }));
            var descriptionGenerator = function(){
                if(poster){
                    description_text.push('[img]'+poster+'[/img]\n');
                }
                if(trans_title){
                    description_text.push('◎译　　名　'+trans_title);
                }
                if(this_title){
                    description_text.push('◎片　　名　'+this_title);
                }
                if(tag_line){
                    description_text.push('◎标　　语　'+tag_line);
                }
                if(year){
                    description_text.push('◎年　　代　'+year);
                }
                if(region){
                    description_text.push('◎产　　地　'+region);
                }
                if(genre){
                    description_text.push('◎类　　别　'+genre);
                }
                if(language){
                    description_text.push('◎语　　言　'+language);
                }
                if(home_page){
                    description_text.push('◎官方主页　'+home_page);
                }
                if(playdate){
                    description_text.push('◎上映日期　'+playdate);
                }
                if(MPAA_rating){
                    description_text.push('◎MPAA评级  '+MPAA_rating);
                }
                if(tvdb_id){
                    description_text.push('◎TVDb编号  '+tvdb_id);
                }
                if(imdb_rating){
                    description_text.push('◎IMDb评分  '+imdb_rating);
                }
                if(imdb_link){
                    description_text.push('◎IMDb链接  '+imdb_link);
                }
                if(douban_rating){
                    description_text.push('◎豆瓣评分　'+douban_rating);
                }
                if(douban_link){
                    description_text.push('◎豆瓣链接　'+douban_link);
                }
                if(episodes){
                    description_text.push('◎集　　数　'+episodes);
                }
                if(duration){
                    description_text.push('◎片　　长　'+duration);
                }
                if(director){
                    description_text.push('◎导　　演　'+director);
                }
                if(writer){
                    description_text.push('◎编　　剧　'+writer);
                }
                if(cast){
                    description_text.push(
                        '◎主　　演　'+cast
                        .replace(/\n/g,'\n'+'　'.repeat(4)+'  　')
                        .trim()
                    );
                }
                if(tags){
                    description_text.push('\n◎标　　签　'+tags);
                }
                if(key_words){
                    description_text.push('\n◎关键词语　'+key_words);
                }
                if(introduction){
                    description_text.push(
                        '\n◎简　　介\n\n　　'+introduction
                        .replace(/\n/g,'\n'+'　'.repeat(2))
                    );
                }
                if(awards){
                    description_text.push(
                        '\n◎获奖情况\n\n　　'+awards
                        .replace(/\n/g,'\n'+'　'.repeat(2))
                    );
                }
                if(similars){
                    description_text.push(
                        '\n◎类似题材\n\n'+similars
                    );
                }
                if(recommendations){
                    description_text.push(
                        '\n◎其他推荐\n\n'+recommendations
                    );
                }
                $('#c2c_textarea').val(description_text.join('\n'));
                description_text=[];
                $('#fetch_tyt')[0].nextSibling.remove();
                $('#c2c_tyt').attr('style','');
            };
            if(first_season_douban){
                requests.push(
                    $.ajax({
                        method:'get',
                        url: 'https://movie.douban.com/subject/'+first_season_douban,
                        success: function(data){
                            imdb_link = $(data).find('#info a[href*="www.imdb.com/title/"]').attr('href');
                        }
                    })
                );
            }
            $.when.apply($, requests).then(function(){
                if(imdb_link){
                    window.imdb={
                        rating:{
                            run:function(a){
                                imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1)+'').replace('NaN','');
                                imdb_votes = a.resource.ratingCount?a.resource.ratingCount.toLocaleString():'';
                                imdb_rating = imdb_votes?imdb_average_rating + '/10 from '+imdb_votes+' users':'';
                            }
                        }
                    };
                    itmdb_requests.push($.ajax({
                        url: 'https://p.media-imdb.com/static-content/documents/v1/title/'+
                        imdb_link.match(/tt\d+/)+
                        '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json',
                        dataType: "script",
                        error:function(a,b,c){
                            switch(a.status){
                                case 404:
                                    console.log('IMDb链接不存在！');
                                    imdb_link = '';
                                    break;
                                default:
                                    console.log('无法获取IMDb评分！');
                                    break;
                            }
                        }
                    }));
                    itmdb_requests.push($.ajax({
                        url: 'https://api.themoviedb.org/3/find/'+imdb_link.match(/tt\d+/)+'?api_key='+TMDB_api_key+'&external_source=imdb_id',
                        success: function(data){
                            try{
                                var tmdb_response = JSON.stringify(data, function(key,value){
                                    if(value.length==0){
                                        return undefined;
                                    }
                                    else if(value.length==1){
                                        return value[0].id;
                                    }
                                    return value;
                                });
                                if(tmdb_response.match('tv')){
                                    tv_or_movie = 'tv';
                                }
                                else{
                                    tv_or_movie = 'movie';
                                }
                                tmdb_id = tmdb_response.match(/\d+/)[0];
                            }
                            catch(e){
                                console.log('无TMDB信息！');
                            }
                        },
                        error:function(a,b,c){
                            console.log('TMDB查询错误: '+a.status);
                        }
                    }));
                    $.when.apply($, itmdb_requests).then(function(){
                        if(tmdb_id){
                            tmdb_detail_requests.push($.ajax({
                                url: 'https://api.themoviedb.org/3/'+tv_or_movie+'/'+tmdb_id+'?api_key='+TMDB_api_key+
                                '&language=zh-CN&append_to_response=external_ids%2Crelease_dates%2Ckeywords%2Crecommendations%2Csimilar',
                                success: function(data){
                                    home_page = data.homepage;
                                    tag_line = data.tagline;
                                    tvdb_id = data.external_ids.tvdb_id;
                                    if(tv_or_movie === 'tv'){
                                        key_words = data.keywords.results.map(function(e){
                                            return e.name.replace(/(^| )\w/g, function(match){
                                                return match.toUpperCase();
                                            });
                                        }).join(' | ');
                                        /*
                                        var col_num = 5;
                                        var text_divider = '| ';
                                        var image_divider = ' [font=courier new][size=1]'+
                                            ('　'.repeat(eaw.length(text_divider)-text_divider.length)+
                                             ' '.repeat(2*text_divider.length-eaw.length(text_divider))).replace(/(^|\n) /g,'$1  ')+
                                            '[/size][/font]';
                                        var original_titles = nameFormatter(data.similar.results, full_half, 'name', col_num, text_divider);
                                        for(var i=0; i<original_titles.length; i++){
                                            similars += data.similar.results.slice(i*col_num, i*col_num+col_num).map(function(e){
                                                return '[url=torrents.php?cat102=1&cat103=1&cat104=1&cat105=1&search='+
                                                    encodeURIComponent(e.original_name)+'&search_area=0&search_mode=0#searchinput][img]https://image.tmdb.org/t/p/w92'+e.poster_path+'[/img][/url]';
                                            }).join(image_divider) + '\n' + original_titles[i].string + '\n';
                                        }
                                        similars = '[b]'+similars+'[/b]';
                                        */
                                        similars = data.similar.results.map(function(e){
                                            return '[url=torrents.php?cat102=1&cat103=1&cat104=1&cat105=1&search='+
                                                encodeURIComponent(e.original_name.replace(/(\:|,|\.) /g,' '))+'&search_area=0&search_mode=0#searchinput][img]https://image.tmdb.org/t/p/w92'+e.poster_path+'[/img][/url]';
                                        }).slice(0,16).join(' ');
                                        recommendations = data.recommendations.results.map(function(e){
                                            return '[url=torrents.php?cat102=1&cat103=1&cat104=1&cat105=1&search='+
                                                encodeURIComponent(e.original_name.replace(/(\:|,|\.) /g,' '))+'&search_area=0&search_mode=0#searchinput][img]https://image.tmdb.org/t/p/w92'+e.poster_path+'[/img][/url]';
                                        }).slice(0,16).join(' ');
                                    }
                                    else if(tv_or_movie === 'movie'){
                                        key_words = data.keywords.keywords.map(function(e){
                                            return e.name.replace(/(^| )\w/g, function(match){
                                                return match.toUpperCase();
                                            });
                                        }).join(' | ');
                                        similars = data.similar.results.map(function(e){
                                            return '[url=torrents.php?cat101=1&cat103=1&cat104=1&cat105=1&search='+
                                                encodeURIComponent(e.original_title.replace(/(\:|,|\.) /g,' '))+'&search_area=0&search_mode=0#searchinput][img]https://image.tmdb.org/t/p/w92'+e.poster_path+'[/img][/url]';
                                        }).slice(0,16).join(' ');
                                        recommendations = data.recommendations.results.map(function(e){
                                            return '[url=torrents.php?cat101=1&cat103=1&cat104=1&cat105=1&search='+
                                                encodeURIComponent(e.original_title.replace(/(\:|,|\.) /g,' '))+'&search_area=0&search_mode=0#searchinput][img]https://image.tmdb.org/t/p/w92'+e.poster_path+'[/img][/url]';
                                        }).slice(0,16).join(' ');
                                        data.release_dates.results.map(function(e){
                                            if(e.iso_3166_1 === 'US'){
                                                e.release_dates.map(function(f){
                                                    if(f.certification){
                                                        MPAA_rating = f.certification;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }));
                            $.when.apply($, tmdb_detail_requests).then(function(){
                                descriptionGenerator();
                            });
                        }else{
                            descriptionGenerator();
                        }
                    }, function(){
                        descriptionGenerator();
                    });
                }
                else{
                    descriptionGenerator();
                }
            },function(){
                descriptionGenerator();
            });
        });
        $('#c2c_tyt').click(function () {
            $('#c2c_textarea')[0].select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? '成功' : '失败';
                fadeInThenFadeOut('fifo_tyt', '文本复制' + msg + '!', 1000);
            } catch (err) {
                fadeInThenFadeOut('fifo_tyt', '复制文本出现异常!', 1000);
            }
        });
    }
})();