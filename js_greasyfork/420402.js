// ==UserScript==
// @name         Fanfiction.net ratio
// @namespace    https://greasyfork.org/users/728828
// @version  	 1.3
// @description  Adds score ratio to fanfics
// @author       1233Echo
// @match        https://www.fanfiction.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/420402/Fanfictionnet%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/420402/Fanfictionnet%20ratio.meta.js
// ==/UserScript==

// My first and probably last script
// Shout out to Min "AO3: Kudos/hits ratio" for inspiring this script

// PERCENT Score color brakets
var percent_green = 75;
var percent_yellow = 50;
var percent_orange = 25;

// NORMAL Score color brakets
var normal_green = 1000;
var normal_yellow = 500;
var normal_orange = 250;

// Colors of the Ratio div
var border_color = "#cdcdcd";
var green_color = "#b7e1cd";
var yellow_color = "#fce8b2";
var orange_color = "#f8d8ba";
var red_color = "#f4c7c3";

// Calculate score based on genre popularity
var genre_popularity = true;

// Calculate score based on rating popularity
var rating_popularity = true;

// Gives score up to 100% based on ratio formula
var percentage_score = true;

(function($) {
    var i;
    var ratio_equa;
    var genre_list;
    var genre_popu;
    var ratin_popu;
    var ratin_list;
    var proce_scor;

    if (localStorage.getItem("ratio_settings") === null) {
        ratio_equa = "(10*reviews/Math.log(words))/5";

        genre_popu = genre_popularity;
        genre_list = [
            {name : "Adventure", value : 0.87},
            {name : "Angst", value : 0.91},
            {name : "Crime", value : 0.99},
            {name : "Drama", value : 0.84},
            {name : "Family", value : 0.95},
            {name : "Fantasy", value : 0.98},
            {name : "Friendship", value : 0.92},
            {name : "Horror", value : 0.99},
            {name : "Humor", value : 0.78},
            {name : "Hurt", value : 0.91},
            {name : "Mystery", value : 0.98},
            {name : "Parody", value : 0.98},
            {name : "Poetry", value : 0.99},
            {name : "Romance", value : 0.40},
            {name : "Sci-Fi", value : 1.00},
            {name : "Spiritual", value : 1.00},
            {name : "Supernatual", value : 0.98},
            {name : "Suspense", value : 0.99},
            {name : "Tragedy", value : 0.96},
            {name : "Western", value : 1.00}
        ];

        ratin_popu = rating_popularity;
        ratin_list = [
            {name : "K", value : 1.00, id : "K"},
            {name : "K+", value : 1.00, id : "Kp"},
            {name : "T", value : 1.00, id : "T"},
            {name : "M", value : 3.00, id : "M"},
        ];

        proce_scor = percentage_score;
    }
    else{
        var ratio_settings = localStorage.getItem('ratio_settings');
        var obj = JSON.parse(ratio_settings);
        ratio_equa = obj[0];
        genre_popu = obj[1];
        genre_list = obj[2];
        ratin_popu = obj[3];
        ratin_list = obj[4];
        proce_scor = obj[5]
    }

    var button = $('<span class="btn" id="ratio-settings"></span>').text("Ratio");
    var btn = $('span[class="btn"]');
    btn.after(button ,'\n');
    $("#ratio-settings").css("margin-left","10px");
    $("#ratio-settings").css("width","39.8px");

    $("#ratio-settings").click(function(){
        Settings();
    });

    Ratio();

    function Settings(){
        function Check_color(a, b, c){
            if($(a).is(":checked")){
                $(b).css('color','#04761c');
                $(c).show();
            }else{
                $(b).css('color','#c00000');
                $(c).hide();
            }
        }
        function Genre_input(){
            $('.span_a').after("<div class='ar' id='ara'></div>")
            for(i=0; i<genre_list.length; i++){
                $('#ara').append("<div class='single'><div style='width:37.5%; float:left; padding-top:10px'>"+genre_list[i].name+"</div>\
                                  <input style='genre_input: 0 0 200px' class='genre_input' id='"+genre_list[i].name+"' value='"+genre_list[i].value+"'></input></div>");
            }
        }
        function Rating_input(){
            $('.span_b').after("<div class='ar' id='arb'></div>")
            for(i=0; i<ratin_list.length; i++){
                $('#arb').append("<div class='single'><div style='width:37.5%; float:left; padding-top:10px'>"+ratin_list[i].name+"</div>\
                                  <input style='genre_input: 0 0 200px' class='genre_input' id='"+ratin_list[i].id+"' value='"+ratin_list[i].value+"'></input></div>");
            }
        }
        function Procent_input(){
            $('.span_c').after("<div class='ar' id='arc'></div>")
            $('#arc').append("<div class='single'><div style='width:37.5%; float:left; padding-top:10px'></div>\
            <input style='genre_input: 0 0 200px' class='genre_input' id='' value=''></input></div>")
        }

        var modal = ("<div class='modal-backdrop fade in'>\
                        <div class='modal-wrapper'>\
                            <div class='modal fade hide in' data-dynamic='true' id='settings' aria-hidden='false' style='display: block;'>\
                                <div class='modal-body' data-children-count='17'>\
                                    <span style='color:#04761c'>Ratio</span>\
                                    Formula\
                                    <div style='height:10px'></div>\
                                    <input name='ratio_a' spellcheck='false' class='text_box' id='calc_ratio' value="+ratio_equa+"></input>\
                                    <div name='ratio_a' class='info_box' title='Words used to get values from fanfics: \n\nwords - get number of words \nreviews - get number of reviews \nfavs - get number of favorites \nfollows - get number of follows \nchapters - get number of chapters'>?</div>\
                                    <div style='height:10px'></div>\
                                    <span class='color_style_a'>Score</span>\
                                    with genre popularity\
                                    <span class='span_a' style='float:right'>Genre <input class='g_box_a' type='checkbox'></span>\
                                    <div style='height:10px'></div>\
                                    <span class='color_style_b'>Score</span>\
                                    with rating popularity\
                                    <span class='span_b' style='float:right'>Rating <input class='g_box_b' type='checkbox'></span>\
                                    <div style='height:10px'></div>\
                                    <span class='color_style_c'>Score</span>\
                                    with percent setting\
                                    <span class='span_c' style='float:right'>Percent <input class='g_box_c' type='checkbox'></span>\
                                </div>\
                                <div class='modal-footer'>\
                                    <span class='btn pull-left' id='cancel-settings'>Cancel</span>\
                                    <span class='btn pull-right btn-primary' id='apply-settings'>Apply</span>\
                                    <span class='pull-right btn_default' id='default-settings'>Default</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>");

        $('.lc-wrapper').after(modal);
        Genre_input();
        Rating_input();
        $(".btn_default").hover(function(){
            $(this).css('background-image', 'none');
        }, function(){
            $(this).css('background-image', 'linear-gradient(to bottom,#cc8800,#cc4400)');
        });

        $(".g_box_a").prop('checked', genre_popu);
        $(".g_box_b").prop('checked', ratin_popu);
        $(".g_box_c").prop('checked', proce_scor);

        Check_color($('.g_box_a'), $('.color_style_a'), $('#ara'));
        Check_color($('.g_box_b'), $('.color_style_b'), $('#arb'));
        Check_color($('.g_box_c'), $('.color_style_c'), $('#arc'));
        $('input').change(function(){
            Check_color($('.g_box_a'), $('.color_style_a'), $('#ara'));
            Check_color($('.g_box_b'), $('.color_style_b'), $('#arb'));
            Check_color($('.g_box_c'), $('.color_style_c'), $('#arc'));
        });

        $('.ar div:nth-child(odd)').css({
            'margin-right':'5px'
        });
        $('.ar div:nth-child(even)').css({
            'margin-left':'5px'
        });
        $('#ara').css({
            'width':'auto',
            'height':'400px',
            'margin-top':'10px',
        });
        $('#arb').css({
            'width':'auto',
            'height':'80px',
            'margin-top':'10px',
        });
        $('.single').css({
            'height': '30px',
            'height': '30px',
            'width':'49%',
            'display': 'flex',
            'align-items': 'center',
            'float':'left',
            'margin-bottom':'10px',
            'display': 'table-cell',
            'vertical-align': 'middle',
        });
        $('.genre_input').css({
            'width':'55%',
            'height':'26px',
            'margin-top':'4px',
            'border-radius':'4px',
            'color':'#555',
            'border':'1px solid #ccc',
            'outline':'none',
            'text-align':'left',
            'float':'left',
            'padding-left':'10px'
        });
        $('.btn_default').css({
            'text-shadow': '0 -1px 0 rgb(0 0 0 /25%)',
            'line-height': '20px',
            'background-color': '#cc4400',
            'display': 'inline-block',
            'padding': '4px 12px',
            'cursor': 'pointer',
            'border': '1px solid #ccc',
            'border-radius': '4px',
            'background-image': 'linear-gradient(to bottom,#cc8800,#cc4400)',
            'border-color':'rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25)',
            'color':'white'
        });
        $('.color_style').css({
            'width':'auto',
            'height':'auto',
            'max-height':'100%'
        });
        $('.text_box').css({
            'width':'calc(100% - 40px)',
            'height':'26px',
            'margin-top':'4px',
            'border-radius':'4px',
            'color':'#555',
            'border':'1px solid #ccc',
            'outline':'none',
            'text-align':'center'
        });
        $('.info_box').css({
            'width':'28px',
            'height':'23px',
            'margin-top':'4px',
            'border-radius':'4px',
            'color':'#555',
            'border':'1px solid #ccc',
            'outline':'none',
            'text-align':'center',
            'padding-top':'5px',
            'user-select':'none',
            'float':'right'
        });
        $('.modal-body').css({
            'width':'auto',
            'height':'auto',
            'max-height':'100%'
        });

        var remove_modal = $('.modal-backdrop');

        $(".modal-backdrop").click(function(e){
            var container = $("#settings");
            if (!container.is(e.target) && container.has(e.target).length === 0){
                remove_modal.remove();
                return false;
            }
        });
        $("#cancel-settings").click(function(){
            remove_modal.remove();
            return false;
        });
        $("#default-settings").click(function(){
            localStorage.removeItem('ratio_settings');
            location.reload();
        });
        $("#apply-settings").click(function(){
            var genre_popu = false;
            var ratin_popu = false;
            var proce_scor = false;
            if($('.g_box_a').is(":checked")) {
                genre_popu = true;
            }
            if($('.g_box_b').is(":checked")) {
                ratin_popu = true;
            }
            if($('.g_box_c').is(":checked")) {
                proce_scor = true;
            }
            var cal_string = $("#calc_ratio").val();
            for(i=0; i<genre_list.length;i++){
                var g_value = $("#"+genre_list[i].name).val();
                genre_list[i].value = g_value;
            }
            for(i=0; i<ratin_list.length;i++){
                var r_value = $("#"+ratin_list[i].id).val();
                ratin_list[i].value = r_value;
            }
            var all = [cal_string, genre_popu, genre_list, ratin_popu, ratin_list, proce_scor];
            var obj = JSON.stringify(all);
            localStorage.setItem('ratio_settings', obj);
            location.reload();
        });
    }

    // I don't know why this div exist but hiding it hopefully doesn't break anything
    $('div[style*="width:160px"]').hide();

	function Ratio() {
        $('div.z-list').each(function() {
            var words;
            var reviews;
            var favs;
            var follows;
            var chapters;

            var hits_value = $(this).find('div.z-padtop2.xgray');
            var wrevi = $(this).find('a.stitle');
            var text = hits_value.text();
            var split = text.split(' ');

            var words_index = $.inArray("Words:",split);
            var words_string = split[words_index+1];
            var w = words_string.replace(/\,/g, '');
            words = parseInt(w);

            var chapters_index = $.inArray("Chapters:",split);
            var chapters_string = split[chapters_index+1];
            var c = chapters_string.replace(/\,/g, '');
            chapters = parseInt(c);

            var review_index = $.inArray("Reviews:",split);
            if (review_index == -1) {
                reviews = 0.01;
            }
            else{
            var reviews_string = split[review_index+1];
            reviews = parseInt(reviews_string);
            }

            var favs_index = $.inArray("Favs:",split);
            if (favs_index == -1) {
                favs = 0.01;
            }
            else{
            var favs_string = split[favs_index+1];
            var f = favs_string.replace(/\,/g, '');
            favs = parseInt(f);
            }

            var follows_index = $.inArray("Follows:",split);
            if (follows_index == -1) {
                follows = 0.01;
            }
            else{
            var follows_string = split[follows_index+1];
            var fa = follows_string.replace(/\,/g, '');
            follows = parseInt(fa);
            }

            var rated_index = $.inArray("Rated:",split);
            var rated_string = split[rated_index+1];

            var score = (eval(ratio_equa)).toFixed(2);

            var score_muliplayer = 0;
            var counter = 0;

            // This is optional I thought of adjusting score based on general popularity of genres
            // or depending on what I want to read at the moment
            if(genre_popu){
                for(i = 0; i < genre_list.length; i++){
                    if(text.includes(genre_list[i].name)){
                        score_muliplayer += score * genre_list[i].value;
                        counter++;
                    }
                }
                if(counter > 0){
                    score = score_muliplayer/counter;
                }
            }

            // This is also optional I adjusted this based on popularity of mature fics
            if(ratin_popu){
                for(i = 0; i < ratin_list.length; i++){
                    if(rated_string == ratin_list[i].name){
                        score *= ratin_list[i].value;
                    }
                }
            }
            if(proce_scor){
                score = Number(score).toFixed(2);
                if (score < 0.1) {
                    score = 0;
                }
                if (score > 100) {
                    score = 100;
                }

                var hits_count = parseInt(hits_value.text());
                var ratio_label = $('<div class="ratio"></div>').text("Ratio: "+score+"%");
                wrevi.after(ratio_label ,'\n');

                // Ratio div background color
                // Green
                if(score>percent_green){
                    ratio_label.css("background-color", green_color);
                }
                // Yellow
                else if(score>percent_yellow){
                    ratio_label.css("background-color", yellow_color);
                }
                // Orange
                else if(score>percent_orange){
                    ratio_label.css("background-color", orange_color);
                }
                // Red
                else{
                    ratio_label.css("background-color", red_color);
                }
            }
            else{
                score = Number(score).toFixed(0);
                if (score < 0.1) {
                    score = 0;
                }

                hits_count = parseInt(hits_value.text());
                ratio_label = $('<div class="ratio"></div>').text(score);
                wrevi.after(ratio_label ,'\n');

                // Ratio div background color
                // Green
                if(score>normal_green){
                    ratio_label.css("background-color", green_color);
                }
                // Yellow
                else if(score>normal_yellow){
                    ratio_label.css("background-color", yellow_color);
                }
                // Orange
                else if(score>normal_orange){
                    ratio_label.css("background-color", orange_color);
                }
                // Red
                else{
                    ratio_label.css("background-color", red_color);
                }
            }
        });

        $('.ratio').css({
            'width':'110px',
            'text-align':'center',
            'float':'right',
            'border-radius':'3px',
            'border-style':'solid',
            'border-width':'thin',
            'border-color':border_color
        });
	}
})(jQuery);