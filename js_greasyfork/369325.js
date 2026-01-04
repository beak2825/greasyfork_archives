// ==UserScript==
// @name         MTV UI Improvements
// @namespace    http://tampermonkey.net/
// @version      0.56
// @description  Various UI modifications to improve organization.
// @license      MIT
// @author       Narkyy
// @match        https://www.morethan.tv/*
// @match        https://morethan.tv/*
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/369325/MTV%20UI%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/369325/MTV%20UI%20Improvements.meta.js
// ==/UserScript==

//Definition of global variables
var list_parse_regex = /\":.+?,\"/gmi;
var list_parse_regex_end = /\{.|\":.+?.}/gmi;
var series_id_regex = /id=(.+)\#/;
var type_regex = /\.releases_(.+)\'/;
var year_regex = /(.+)\s(\((\d\d\d\d)\))/;
var region_regex = /(.+)\s\((US|UK|CA)\)/i;
var art_id_regex = /id=(.+)/;
var ep_grp_regex = /(S[0-9]+E[0-9]+|20\d\d.\d\d.\d\d)/i;
var season_grp_regex = /(S[0-9]+|Season.[0-9]+)/i;
var season_full_regex = /Season.([0-9]+)/i;
var ep_groupid_regex = /groupid_([0-9]+)/i;

var cache = {};
var existing_cache = false;

var init_count;
var current_count;

var series_id_list;
var series_search_list = [];
var series_autocomplete = [];
var autocomplete_string;

var page_url = window.location.pathname;
var artist_id;

var dirname;
var alt_filename;

var path_count = 0;

var group_id;

var groups = [];
var final_rows = $();
var count = 0;
var grprls_count = 0;
var changed_i = 0;

var new_season_group = [];
var new_season_childs = [];

var artistSeasons = [];
var artistEpisodes = [];
var artistExtras = [];
var ep_array = [];
var ep_rows = [];
var ep_edition_rows = [];
var firstep_edition = [];
var epno_count = [];

var seriesname = $("h2").text();
var region;
var seriesname_orig = seriesname;
var seriesname_srch = seriesname.replace(/ /g,'+');
var seriesname_andreplaced;
var premiereyear;
var info_box;

var tvdb_id, tvdb_url, tvmaze_id, tvmaze_url, tvmaze_info, banner, poster, poster_large;
var allbanners;

var series_info;
var tvmaze_box = $();

var contains_seasons = false, contains_episodes = false, contains_extras = false;
var extras_table;

//Series search bar
var searchbar_series = $("li#searchbar_torrents").clone(false);

//User stylesheet info, assuming it's not a custom css
var stylesheet_user = $($.grep($("link[rel^=stylesheet]"), function(obj){return obj.title;})[0]).attr('title');

//Get cached lists for autocomplete & series search
getCachedLists();
//Initialize series search bar
initSeriesSearchBar();

//If page is /torrents.php
if (page_url == '/torrents.php' || page_url == '/artist.php'){

    //Clean up tables
    $("#discog_table>div").remove();
    //Remove voting links before getting elements.. breaks without "Disable voting links" setting enabled
    $("[class^='votespan brackets'], [class^='brackets tooltip']").remove();
    $("#similar_artist_map").remove();

    //Get objects needed
    dirname = $("[id^=files_]").find('.filelist_path');
    alt_filename = $("[id^=files_]").find('.filelist_table tbody tr:nth-child(2) td:first-child');
    group_id = $("[class^='group_info'] a.tooltip");

    var group_count = 0;
    if(group_id.length){
        //For every matched group,
        $(group_id).each(function(){
            //If there's Season or SXX in the name, enter this
            if($(this).text().includes("Season") || /S[0-9]+(\.|\s)/.test($(this).text())){

                contains_seasons = true;

                //Get the torrents id for request
                var artist_groupid = art_id_regex.exec($(this).attr('href'))[1];

                //Get all rows under the torrent id
                var alt_rows = $("tr[class^='releases_23 torrent_row groupid_"+ artist_groupid+"'] td[colspan=2] > a, tr[class^='releases_24 torrent_row groupid_"+ artist_groupid+"'] td[colspan=2] > a,"+
                                 "tr[class^='releases_25 torrent_row groupid_"+ artist_groupid+"'] td[colspan=2] > a, tr[class^='releases_99 torrent_row groupid_"+ artist_groupid+"'] td[colspan=2] > a,"+
                                 "tr[class^='releases_21 torrent_row groupid_"+ artist_groupid+"'] td[colspan=2] > a, tr[class^='releases_22 torrent_row groupid_"+ artist_groupid+"'] td[colspan=2] > a,"+
                                 "tr[class^='group_torrent groupid_"+artist_groupid+"'] td[colspan=3] > a");

                //Get the season head from torrent id
                var season_head = $($("tr[class^='releases_23 groupid_"+artist_groupid+" edition group_torrent discog'], tr[class^='releases_24 groupid_"+artist_groupid+" edition group_torrent discog'],"+
                                      "tr[class^='releases_25 groupid_"+artist_groupid+" edition group_torrent discog'], tr[class^='releases_99 groupid_"+artist_groupid+" edition group_torrent discog'],"+
                                      "tr[class^='releases_21 groupid_"+artist_groupid+" edition group_torrent discog'], tr[class^='releases_22 groupid_"+artist_groupid+" edition group_torrent discog']")[0]).prev();

                //Realign the season label center
                $(season_head).css('vertical-align', 'middle');

                //Get the torrent rows under torrent id
                var season_group;

                var final_season;

                //If the group name isn't Season XX, we rename to what it is.
                if(/S[0-9]+(\.|\s)/.test($(this).text()) || !/^Season.[0-9]+(\s$|$|\sPart|\.\d)/i.test($(this).text())){

                    season_group = $("tr[class*='groupid_"+artist_groupid+"']");

                    //Add header for rest of seasons
                    if(new_season_group.length == 0){
                        var alt_seasonhead =
                            "<tr class='releases_alt_seasons groupid_otherseasons edition group_torrent discog' id='cat_otherseasons' style='border-bottom: 1px solid black; border-top: 1px solid black;'>"+
                            "<td colspan='6' class='otherseasons'><strong style='color: #c8c8c8'><a href='#' onclick=\"toggle_edition('otherseasons', 1, this, event);\" class='tooltip'>−</a>"+
                            " Other Seasons</strong></td></tr>";

                        new_season_group.push(alt_seasonhead);
                    }

                    //Remove current edition
                    season_group.splice(0, 1);

                    //Get the name of the header
                    var pack_name = $(season_head).find('a.tooltip').text().replace(/∧.+/, '');
                    //Change the name of torrent row
                    $(season_group).find("td[colspan=2] > a").text(pack_name);

                    //Change the class for hide button
                    $(season_group).attr('class', function(index, attr){
                        return attr.replace(/groupid_[0-9]+/i, "groupid_otherseasons");
                    });

                    if(page_url == '/artist.php'){
                        //Remove edition and header rows
                        $(this).closest("tr").next().remove();
                        $(this).closest("tr").remove();
                    }

                    //Push torrent row to array
                    new_season_childs.push(season_group);
                }
                //If the group is named Season XX only
                else{

                    season_group = $("tr[class*='groupid_"+artist_groupid+"']");

                    //Push the url to the groups array for requests
                    groups.push($(this).attr('href'));

                    //Merge the head and children of the season
                    final_season = $.merge(season_head, season_group);

                    //Merge the torrent rows under the season head into the final array
                    $.merge(final_rows, alt_rows);

                    //If the group is empty, there's just a season header, rename and tag
                    if(final_season.length == 0){
                        var tags = $(this).parent().find("[class^=tags]").text();
                        $(this).parent().find("[class^=tags]").prepend("<a style='color:#bc4b4b'>grouped_pack</a> ");

                        final_rows.push($(this));
                    }
                    //Push the season rows to array
                    artistSeasons.push(final_season);

                    //Rename head to Showname - Season XX [Year]
                    if(page_url == '/torrents.php'){
                        var seasonno = $(this).text();
                        var showname = $(this).closest("td").prev().find("div[class^='tp-showname']").text();
                        $(this).text(showname+" - "+seasonno);

                        //Remove category, keep only year.
                        var yeartext = $($(this).parent().contents()[2]).text();
                        if(/(.*)(?=\[[a-zA-Z])/i.test(yeartext)){
                            yeartext = /(.*)(?=\[[a-zA-Z])/i.exec(yeartext)[1];
                        }

                        $(this).parent().contents()[2].remove();
                        $(this).after("<span>"+yeartext+"</span>");
                    }
                }
            }
            //If there's EXX in the name, enter this
            else if(ep_grp_regex.test($(this).text()) && page_url == '/artist.php'){

                contains_episodes = true;

                var ep_name = $(this).text();
                var artist_groupid_ep = art_id_regex.exec($(this).attr('href'))[1];

                var ep_head = $($("tr[class^='releases_23 groupid_"+artist_groupid_ep+" edition group_torrent discog'], tr[class^='releases_24 groupid_"+artist_groupid_ep+" edition group_torrent discog'],"+
                                  "tr[class^='releases_25 groupid_"+artist_groupid_ep+" edition group_torrent discog'], tr[class^='releases_99 groupid_"+artist_groupid_ep+" edition group_torrent discog'],"+
                                  "tr[class^='releases_21 groupid_"+artist_groupid_ep+" edition group_torrent discog'], tr[class^='releases_22 groupid_"+artist_groupid_ep+" edition group_torrent discog']")[0]).prev();

                var ep_group = $("tr[class*='groupid_"+artist_groupid_ep+"']");

                if(ep_group.length == 0){
                    $(this).closest("tr").remove();
                }

                var ep_season_grp = $.merge(ep_head, ep_group);

                artistEpisodes.push(ep_season_grp);
            }
            else{
                if(page_url != '/artist.php'){
                    contains_episodes = true;
                }
                else{  //There's extras on artist.php
                    contains_extras = true;

                    //Get extras release name
                    groups.push($(this).attr('href'));

                    var extras_groupid = art_id_regex.exec($(this).attr('href'))[1];

                    //Remove head
                    $(this).closest("tr").remove();
                    //Remove edition rows
                    $("tr[class*='groupid_"+extras_groupid+" edition group_torrent']").remove();

                    //Get release <a> for name requests
                    var extras_a = $("tr[class*='torrent_row groupid_"+extras_groupid+"'] td[colspan=2] > a");
                    $.merge(final_rows, extras_a);

                    //Get final rows to move
                    var extras_tr = $("tr[class*='torrent_row groupid_"+extras_groupid+"']");

                    artistExtras.push(extras_tr);

                }
            }
            group_count++;
        });

        //On series page
        if(page_url == '/artist.php'){
            $("div.tags").remove();

            //Add other seasons under header and to season category
            new_season_childs.sort(compareAltSeasons).reverse();
            $(new_season_childs).each(function(){
                new_season_group.push($(this));
            });
            artistSeasons.push(new_season_group);

            artist_id = art_id_regex.exec(window.location.href)[1]

            var first_colhead = "[class^='colhead_dark']:first";
            var second_colhead = "[class^='colhead_dark']:eq(1)";

            var type_seasons = type_regex.exec($($(first_colhead+" td:nth-child(2) a")[1]).prop('outerHTML'))[1];
            var eps_rlsno = $($(second_colhead+" td:nth-child(2) a")[1]).prop('outerHTML');
            var type_episodes;

            //If there's 2 headers, episodes go under second
            //Otherwise, under first colhead.
            if(eps_rlsno){
                type_episodes = type_regex.exec($($(second_colhead+" td:nth-child(2) a")[1]).prop('outerHTML'))[1];
            }
            else{
                var newtable = $("#discog_table table").clone(false);

                //Set attributes for new torrent table
                $(newtable).attr('id', 'torrents_episodes');
                $($(newtable).find("[class^='colhead_dark'] td:nth-child(2) a")[1]).attr('onclick', '$(".releases_11").gtoggle(true); return false');
                $(newtable).find("tr[class^=releases_]").remove();

                $(newtable).insertAfter($("#discog_table table"));

                type_episodes = 11;
            }

            //If name contains year, strip it for info search
            if(year_regex.test(seriesname)){
                premiereyear = year_regex.exec(seriesname)[3];
                seriesname = year_regex.exec(seriesname)[1];
            }
            else if(region_regex.test(seriesname)){
                region = region_regex.exec(seriesname)[2];
                seriesname = region_regex.exec(seriesname)[1];
            }
            seriesname_andreplaced = seriesname.replace(/\&/g,'and');

            //Get TVDB stuff quickly
            console.log("Getting Series Info");
            getTVDBID();

            //Name colhead to corresponding table
            $(first_colhead).find("strong").text("Seasons");
            $(second_colhead).find("strong").text("Episodes");

            //If there are only seasons or only episodes
            if(contains_seasons && !contains_episodes){
                $(first_colhead).find("strong").text("Seasons");
            }
            else if (!contains_seasons && contains_episodes){
                $(first_colhead).find("strong").text("Episodes");
            }

            //Clean up boxes
            info_box = $("[class='box box_search']");
            $(info_box).find("div strong").text('Series Info');
            $(info_box).find("ul li").remove()

            //Remove empty objects breaking the sorting of episode groups
            artistEpisodes = $.grep(artistEpisodes, function(n){ return (n.length !== 0); });

            //Sort the season and episodes.
            artistSeasons.sort(compare);
            artistEpisodes.sort(compareEpisodes);

            //Insert every season block at the top
            $(artistSeasons).each(function(){
                //Rename class of seasons for hide button
                $(this).each(function(){
                    $(this).attr('class', function(index, attr){
                        if(attr){
                            return attr.replace(/releases_\d\d/i, 'releases_'+type_seasons);
                        }
                    });
                });

                $(this).insertAfter(first_colhead);
            });

            //Process episodes
            $(artistEpisodes).each(function(){

                //Fix formatting for Lime stylesheet
                if(stylesheet_user == "mtv_lime"){
                    $(this).find("td>span").css({'float':'right','margin-right':'4px'});
                    $(this).find("td").css({'border':'1px solid black', 'padding-left':'6px'});
                }
                else{
                    $(this).find("td").css('border','1px solid black');
                }

                if($(this).length != 0){
                    var epname = $($(this)[0]).find("strong a.tooltip").text();
                    var season_episode = ep_grp_regex.exec(epname)[1].toUpperCase();
                }
                else{
                    return;
                }

                var epedition_row;
                var ep_i = ep_array.indexOf(season_episode);
                //If we don't have the episode number, add to array
                if(ep_i === -1){

                    ep_array.push(season_episode);
                    epno_count.push(1);

                    //Add edition row for episode number
                    epedition_row = "<tr class='releases_"+type_episodes+" groupid_"+season_episode+" edition group_torrent discog' id='cat_episode_"+season_episode+"' style='border-bottom: 1px solid black; border-top: 1px solid black;'>"+
                        "<td rowspan=3 id='edition_row_"+season_episode+"' style='width:22%; background-color: #2d2d2d;' class='edition_ep'><strong style='color: #c8c8c8'>"+
                        " "+season_episode.toUpperCase()+"</strong></td></tr>";

                    $(epedition_row).insertAfter(second_colhead);
                    ep_edition_rows.push($(epedition_row));
                }
                else{
                    if(epno_count[ep_i]){
                        epno_count[ep_i]++;
                    }
                }

                //Process each row in the episode group
                $(this).each(function(){

                    //Rename class of episodes for hide button
                    $(this).attr('class', function(index, attr){
                        return attr.replace(/releases_\d\d/i, 'releases_'+type_episodes);
                    });

                    //Remove hidden tag set by site
                    $(this).attr('class', function(index, attr){
                        return attr.replace(/ hidden/gi, '');
                    });

                    var small_ep = $(this).find("td[colspan=2] > a").text();

                    //If matched row is an edition, remove
                    if(!small_ep){
                        $(this).remove();
                    }
                    else{

                        //Push torrent row to array
                        var row_a = $(this).find("td[colspan=2] > a");
                        $(row_a).text(epname);

                        //Get torrent ID
                        var curr_id = /groupid_([0-9]+)/i.exec($(this).attr('class'))[1];

                        //Get parsed attributes
                        var naming_arr = parseReleaseName(epname, curr_id);
                        var season_episode = ep_grp_regex.exec(epname)[1].toUpperCase();

                        //Rename group id for hide button
                        $(this).attr('class', function(index, attr){
                            return attr.replace(/groupid_[0-9]+/i, "groupid_"+season_episode+"");
                        });

                        //Simple tooltip for release name on episodes.
                        $(row_a).attr('title', epname);

                        //Remove extra text at the left
                        $(this).find("td[colspan=2]").contents().eq(2).remove();

                        //Rename to parsed info
                        $(row_a).html("<span>"+naming_arr[0]+"</span><span> / </span>"+naming_arr[3]+"<span class='ep_media'>"+naming_arr[1]+"</span><span> / </span>"+
                                      "<span class='ep_resolution'>"+naming_arr[2]+"</span><span> / </span><span id='ep_origin_"+curr_id+"'><strong>"+naming_arr[4]+"</strong></span>");

                        //Style the spans to align left
                        $(row_a).find("span").css({'float':'left', 'white-space':'pre'});

                        //Push rows for eventual sorting
                        ep_rows.push($(this));

                        //Remove colspan
                        $(this).find("td[colspan=2]").attr('colspan', 1);
                    }
                });
            });

            //Color web source tags
            $("[id^=ep_web_source_], [id^=ep_repack]").each(function(){
                var source = $(this).text();

                if(source == "Netflix"){
                    $(this).css('color', '#c43535');
                }
                else if(source == "Amazon"){
                    $(this).css('color', '#e0c126');
                }
                else if(source == "iTunes"){
                    $(this).css('color', '#3868d1');
                }
                else if(source == "Hulu"){
                    $(this).css('color', '#39ad39');
                }
                else if(source == "Repack" || source == "Proper"){
                    $(this).css('color', '#abe096');
                }
            });

            //Color origin tags
            $("[id^=ep_origin_]").each(function(){
                var origin = $(this).text();

                if(origin == "P2P"){
                    $(this).css('color', '#9b6fc6');
                }
                else if(origin == "Scene"){
                    $(this).css('color', '#94cad3');
                }
            });

            ep_rows.sort(compareIndividualEpisodeGroups).reverse();

            //Move eps under categories
            $(ep_rows).each(function(){
                var season_episode = /groupid_(.+?)\s/i.exec($(this).attr('class'))[1];
                var test = $("[id='edition_row_"+season_episode+"']");
                var index = ep_array.indexOf(season_episode);
                var count_i = epno_count[index];

                //If first torrent, change edition rowspan to count of episodes
                if(firstep_edition.indexOf(season_episode) === -1){
                    firstep_edition.push(season_episode);

                    $(test).attr('rowspan', count_i);

                    //If 1 episode, add directly under as td
                    //Otherwise, decrement count and add as tr
                    if(count_i == 1){
                        $(this).find('td').insertAfter($(test));
                    }
                    else{
                        epno_count[index] = count_i - 1;
                        $(this).insertAfter("[id='cat_episode_"+season_episode+"']");
                    }
                }
                //If last episode, add as td
                //Otherwise, decrement count and add as tr
                else if(count_i == 1){
                    $(this).find('td').insertAfter($(test));
                }
                else{
                    epno_count[index] = count_i - 1;
                    $(this).insertAfter("[id='cat_episode_"+season_episode+"']");
                }
            });

            //Remove empty torrent tables
            var tabheads = $("table[class^='torrent_table']");
            $(tabheads).each(function(){
                if($(this).find("tr[class^=releases_]").children().length == 0){
                    if(contains_extras && !extras_table){
                        extras_table = $(this).clone(false);
                    }
                    $(this).remove();
                }
            });

            //Rename tables to seasons & eps, move eps before seasons
            var remaining_tables = $("#discog_table table");
            if(remaining_tables[1]){
                $(remaining_tables[0]).attr('id', 'torrents_seasons');
                $(remaining_tables[1]).attr('id', 'torrents_episodes');
                $(remaining_tables[1]).insertBefore($(remaining_tables[0]));
            }

            //Create table for extras
            if(contains_extras){
                $(extras_table).attr('id', 'torrents_extras');
                $(extras_table).find("[class^='colhead_dark'] strong").text("Extras");
                $($(extras_table).find("[class^='colhead_dark'] td:nth-child(2) a")[1]).attr('onclick', '$(".releases_88").gtoggle(true); return false');

                $("#discog_table").append(extras_table);

                //Move extras under their own table
                $(artistExtras).each(function(){
                    //Rename class of rows for hide button
                    $(this).attr('class', function(index, attr){
                        return attr.replace(/releases_\d\d/i, 'releases_88');
                    });

                    $(this).insertAfter("#torrents_extras tr[class^='colhead_dark']");
                });
                //Remove remaining empty table after extras if any
                $(tabheads).each(function(){
                    if($(this).find("tr[class^=releases_]").children().length == 0){
                        $(this).remove();
                    }
                });
            }
        }
        else if (page_url == '/torrents.php'){
            var pad_rls;
            var pad_edition;

            pad_rls = (contains_episodes ? "35%" : "38%");
            pad_edition = (contains_episodes ? "24%" : "27%");

            //Move the releases to center of group on torrents.php browse/search
            $(artistSeasons).each(function(){
                $(this).find("td[colspan^='3']").contents().filter(function(){return this.nodeType !== 1;}).remove();
                $(this).find("td[colspan^='3'] > a").wrap('<span style="float:left;padding-left:'+pad_rls+';"></span>').before(document.createTextNode(' » '));
                $(this).find("td[colspan^='9'] strong").css('padding-left',pad_edition);
            });
        }

        //Start getting release names
        if(groups[0]){
            console.log("Getting release names for seasons");
            getGroup(groups[0]);
        }
    }
    else if(window.location.href.includes("?id=")){ //We're on a specific torrents.php?id= page
        $(alt_filename).each(function(){

            var final_name = $($(dirname)[path_count]).text().replace(/\//g, '');

            if(!final_name){
                final_name = $($(alt_filename)[path_count]).text().replace(/\//g, '');
                dirname[path_count] = final_name;
            }
            else{
                dirname[path_count] = final_name;
            }

            path_count++;
        });

        if(dirname.length != 0 && dirname[0]){
            var test = $("[id^=torrent_details]").find('.torrent_row td > a');

            var n = 0;
            $(test).each(function(){
                $(this).text(dirname[n]);
                n++;
            });
        }
    }
}

function getGroup(url){
    grprls_count++;

    $.get("/"+url, function(data){
        data = $(data).filter("#wrapper");
        var rls_names = $(data).find("[id^=files_]").find('.filelist_path');
        var alt_rls_names = $(data).find("[id^=files_]").find('.filelist_table tbody tr:nth-child(2) td:first-child');

        $(alt_rls_names).each(function(){

            var final_name = $($(rls_names)[path_count]).text().replace(/\//g, '');

            if(!final_name){
                final_name = $($(alt_rls_names)[path_count]).text().replace(/\//g, '');
            }

            rls_names[path_count] = final_name;

            $($(final_rows)[changed_i]).text(rls_names[path_count].replace(/\//g, ''));

            changed_i++;
            path_count++;
        });

        if(grprls_count < groups.length){
            if(groups[grprls_count].includes("torrents.php")){
               path_count = 0;
               getGroup(groups[grprls_count]);
            }
        }
        else{
            console.log("Got all release names");
        }

    });
}

function compare(a,b) {
    a = $($(a)[0]).find("[class^='group_info clear'] a.tooltip").text();
    b = $($(b)[0]).find("[class^='group_info clear'] a.tooltip").text();

    if(/Season.([0-9]+)/i.test(a)){
        a = parseInt(/Season.([0-9]+)/i.exec(a)[1]);
    }
    if(/Season.([0-9]+)/i.test(b)){
        b = parseInt(/Season.([0-9]+)/i.exec(b)[1]);
    }

    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
}

function compareAltSeasons(a,b) {
    if(a.length == 0 || b.length == 0){ return 0; }

    a = season_grp_regex.exec($(a).find("td[colspan=2] > a").text())[1];
    b = season_grp_regex.exec($(b).find("td[colspan=2] > a").text())[1];

    if(season_full_regex.test(a)){
        a = "S"+season_full_regex.exec(a)[1];
    }
    if(season_full_regex.test(b)){
        b = "S"+season_full_regex.exec(b)[1];
    }

    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
}

function compareEpisodes(a,b) {
    if(a.length == 0 || b.length == 0){ return 0;}

    a = ep_grp_regex.exec($($(a)[0]).find("[class^='group_info clear'] a.tooltip").text())[1];
    b = ep_grp_regex.exec($($(b)[0]).find("[class^='group_info clear'] a.tooltip").text())[1];

    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
}

//Comparator for episodes, importance order: Resolution > Source > Origin (P2P/Scene)
function compareIndividualEpisodeGroups(a,b){
    var media_quality_order = ["DVD", "HDTV", "WEBRip", "WEB-DL", "Bluray"];
    var resolution_quality_order = ["SD", "720p", "1080i", "1080p", "2160p"];
    var origin_quality_order = ["Scene", "P2P"];

    if(a.length == 0 || b.length == 0){ return 0; }

    var a_media = media_quality_order.indexOf($(a).find("[class^=ep_media]").text());
    var a_res = resolution_quality_order.indexOf($(a).find("[class^=ep_resolution]").text());
    var a_origin = origin_quality_order.indexOf($(a).find("[id^=ep_origin]").text());
    var b_media = media_quality_order.indexOf($(b).find("[class^=ep_media]").text());
    var b_res = resolution_quality_order.indexOf($(b).find("[class^=ep_resolution]").text());
    var b_origin = origin_quality_order.indexOf($(b).find("[id^=ep_origin]").text());

    if(a_media < b_media){
        if(a_res > b_res){
            return 1;
        }
        else{
            return -1;
        }
    }
    else if(a_media > b_media){
        if(a_res < b_res){
            return -1;
        }
        else{
            return 1;
        }
    }
    else{
        if(a_res < b_res){
            return -1;
        }
        else if(a_res > b_res){
            return 1;
        }
        else if(a_media == b_media && a_res == b_res){
            if(a_origin > b_origin){
                return 1;
            }
            else if (a_origin < b_origin){
                return -1;
            }
        }
        else{
            return 0;
        }
    }
}

function getTVDBID(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.tvmaze.com/search/shows?q="+seriesname_andreplaced,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            var parser = JSON.parse(response.responseText);

            if(!parser.Error && parser.length != 0){
                tvmaze_info = parser[0].show;

                //Try to find the correct show
                if(tvmaze_info.name.toLowerCase() != seriesname.toLowerCase() && parser.length > 1){
                    for(var i = 1; i<parser.length; i++){
                        var testname = parser[i].show.name;
                        if(testname.toLowerCase() == seriesname.toLowerCase()){
                            tvmaze_info = parser[i].show;
                            break;
                        }
                        else{
                            tvmaze_info = parser[0].show;
                            break;
                        }
                    }
                }
                else if(premiereyear){
                    var altyear_index = parser.findIndex(obj => obj.show.premiered.includes(premiereyear));

                    if(altyear_index){
                        tvmaze_info = parser[altyear_index].show;
                    }
                }

                tvdb_id = tvmaze_info.externals.thetvdb;
                tvmaze_id = tvmaze_info.id;
                tvmaze_url = tvmaze_info.url.replace("http://", "https://");
                tvdb_url = "https://www.thetvdb.com?id="+tvdb_id+"&tab=series";

                if(tvmaze_info.image){
                    poster = tvmaze_info.image.medium.replace("http://", "https://");
                    poster_large = tvmaze_info.image.original.replace("http://", "https://");
                }

                //Fill now because it looks nicer
                fillInfo();
                getTVDBInfo();
            }
            else{
                console.log("Error parsing response: TVmaze init request");
                return;
            }
        }
    });
}

function getTVDBInfo(){
    if(tvdb_id){
        GM_xmlhttpRequest({
            method: "GET",
            url: tvdb_url,
            onload: function(response) {
                var unwantedregex = /(thetvdb|rating|schedules|tv.com|updated)/i;
                allbanners = $($.parseHTML(response.responseText)).find("[class^='col-xs-12 col-sm-6']");
                var firstbanner = $(allbanners[0]).find("a").attr('data-featherlight');

                if(firstbanner){
                    altBanner(firstbanner);
                }

                series_info = $($.parseHTML(response.responseText)).find('#series_basic_info li');

                if(series_info.length != 0){

                    series_info = $.grep(series_info, function(value) {
                        value = $(value).text();
                        return ! unwantedregex.test(value);
                    });

                    fillInfo();
                }
            }
        });
    }
    else{
        series_info = undefined;

        $.merge(tvmaze_box, $("<li class='list-group-item clearfix'><strong>Status: </strong><span>"+tvmaze_info.status+"</span></li>"+
                              "<li class='list-group-item clearfix'><strong>First Aired: </strong><span>"+tvmaze_info.premiered+"</span></li>"+
                              "<li class='list-group-item clearfix'><strong>Network: </strong><span>"+(tvmaze_info.network ? tvmaze_info.network.name : tvmaze_info.webChannel.name)+"</span></li>"+
                              "<li class='list-group-item clearfix'><strong>Runtime: </strong><span>"+tvmaze_info.runtime+"</span></li>"+
                              "<li class='list-group-item clearfix'><strong>Genres: </strong><span>"+tvmaze_info.genres.toString().replace(/,/g, ', ')+"</span></li>"+
                              "<li class='list-group-item clearfix'><strong style='color:#31e08b'>TVmaze: </strong><span><a href="+tvmaze_url+" target='_blank'>"+tvmaze_id+"</a></span></li>"));

        fillInfo();
    }
}

function fillInfo(){
    if(tvmaze_info.image){
        if(tvmaze_info.image.medium){
            $("[class='box box_image']").remove();

            $(info_box).before("<div class='box box_image'><div class='head'><strong>"+seriesname_orig+"</strong></div><div style='text-align: center; padding: 10px 0px;'>"
                               +"<img style='max-width: 220px;' src='"+poster+"'"
                               +"alt='"+seriesname_orig+"' onclick=\"lightbox.init('"+poster_large+"', 220);\">"
                               +"</div>"
                               +"</div>");
        }
    }

    if(series_info){
        $(info_box).find("ul").append(series_info);
        var tvdb_li = "<li class='list-group-item clearfix'><strong style='color:#009b24'>TVDB: </strong><span><a href=https://www.thetvdb.com?id="+tvdb_id+"&tab=series target='_blank'>"+tvdb_id+"</a></span></li>"
        var tvmaze_li = "<li class='list-group-item clearfix'><strong style='color:#31e08b'>TVmaze: </strong><span><a href="+tvmaze_url+" target='_blank'>"+tvmaze_id+"</a></span></li>";

        $($(series_info)[series_info.length - 1]).css('color', '#f2c318');

        $(info_box).find("ul").append(tvdb_li, tvmaze_li);
        console.log("Added TVDB Info");

    }
    else{
        if(tvmaze_box.length != 0){
            console.log("Added TVmaze info");
        }
        $(info_box).find("ul").append(tvmaze_box);
    }
}

function altBanner(url){
GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.thetvdb.com"+url,
        onload: function(response) {
            var engregex = /English \(English\)/gmi;

            var resp = $($.parseHTML(response.responseText)).text();

            if(engregex.test(resp)){
                banner = $(allbanners[0]).find("a img").attr('src');
            }
            else{
                banner = $(allbanners[allbanners.length - 3]).find("a img").attr('src');
            }

            if(banner){
                banner = banner;

                var img_a = "<a href=/torrents.php?artistname="+seriesname_srch+"><img style='max-height: 125px;' id=tvdb_banner src="+banner+"></a>";

                $("h2").after(img_a);
                $("h2").hide();
            }

        }
    });
}

function getCachedLists(){

    //Series cache checks & update
    if(GM_listValues().includes("last_id")){
        init_count = parseInt(GM_getValue("last_id"));
    }
    else{
        init_count = 10560;
        GM_setValue("last_id", init_count);
    }
    //Set current to last ID
    current_count = init_count, count = init_count;

    //Check for cached series array or add it to storage.
    if(GM_listValues().includes("cached_series")){
        existing_cache = true;
        series_id_list = JSON.parse(GM_getValue("cached_series"));
        series_search_list = JSON.parse(GM_getValue("cached_series").toLowerCase());
    }
    else{
        GM_setValue("cached_series", "{\"1\":\"8354\",\"24\":\"74\",\"40\":\"7523\",\"1992\":\"4135\",\"1993\":\"7407\",\"2010\":\"9299\",\"MotoGP\":\"6\",\"Oz\":\"13\",\"English Premier League\":\"25\",\"Ligue 1\":\"28\",\"Bundesliga\":\"29\",\"Dexter\":\"34\",\"Battlestar Galactica (2003)\":\"35\",\"Sons of Anarchy\":\"40\",\"The Vampire Diaries\":\"44\",\"Gotham\":\"48\",\"The Flash (2014)\":\"49\",\"Arrow\":\"50\",\"Supernatural\":\"52\",\"Boardwalk Empire\":\"53\",\"The League\":\"61\",\"South Park\":\"62\",\"Some Girls\":\"67\",\"Breaking Bad\":\"83\",\"Homeland\":\"85\",\"FIFA Official World Cup Films\":\"90\",\"The Wire\":\"92\",\"Umbre\":\"93\",\"The FA Cup\":\"95\",\"The Mysteries of Laura\":\"96\",\"Lost\":\"98\",\"The Mentalist\":\"102\",\"Downton Abbey\":\"105\",\"Fringe\":\"108\",\"The Good Wife\":\"110\",\"The Big Bang Theory\":\"113\",\"Criminal Minds\":\"115\",\"UFC\":\"116\",\"The Musketeers\":\"117\",\"True Detective\":\"120\",\"American Body Shop\":\"121\",\"Sherlock\":\"122\",\"Brandi and Jarrod: Married to the Job\":\"123\",\"Brooklyn Nine-Nine\":\"125\",\"Family Guy\":\"129\",\"Revenge\":\"130\",\"The Boondocks\":\"131\",\"The Affair\":\"132\",\"The Walking Dead\":\"134\",\"Pretty Little Liars\":\"137\",\"NBA\":\"145\",\"12 Monkeys\":\"147\",\"Selfie\":\"148\",\"MythBusters\":\"154\",\"Top Gear\":\"157\",\"Girls\":\"158\",\"Marco Polo (2014)\":\"159\",\"Vikings\":\"161\",\"Helix\":\"163\",\"Arrested Development\":\"164\",\"Hacking the System\":\"166\",\"Witches of East End\":\"168\",\"Black Sails\":\"169\",\"Gold Rush\":\"170\",\"Archer (2009)\":\"172\",\"Adventure Time\":\"174\",\"Game of Thrones\":\"177\",\"NFL\":\"180\",\"Prison Break\":\"181\",\"Banshee\":\"183\",\"Soviet Storm\":\"184\",\"Heroes\":\"186\",\"Fresh Off the Boat\":\"188\",\"The Americans (2013)\":\"189\",\"The Sopranos\":\"190\",\"Suits\":\"191\",\"The Blacklist\":\"192\",\"Better Call Saul\":\"195\",\"Marvel's Agent Carter\":\"196\",\"Person of Interest\":\"199\",\"Justified\":\"201\",\"The Originals\":\"202\",\"NCIS\":\"203\",\"New Girl\":\"204\",\"Modern Family\":\"206\",\"True Blood\":\"208\",\"Bosch\":\"209\",\"The 100\":\"210\",\"Constantine\":\"219\",\"House\":\"222\",\"Stalker\":\"223\",\"Two and a Half Men\":\"224\",\"Under the Dome\":\"225\",\"Camelot\":\"227\",\"Asylum\":\"230\",\"Sleepy Hollow\":\"231\",\"Band of Brothers\":\"233\",\"Jericho (2006)\":\"236\",\"How to Get Away with Murder\":\"237\",\"House of Cards (US)\":\"238\",\"Bitten\":\"246\",\"Duck Dynasty\":\"247\",\"Eye Candy\":\"248\",\"Star Wars Rebels\":\"255\",\"American Crime\":\"257\",\"Elementary\":\"258\",\"American Horror Story\":\"261\",\"Californication\":\"262\",\"WWE Smackdown\":\"263\",\"How I Met Your Mother\":\"265\",\"Haven\":\"266\",\"Black Books\":\"267\",\"Sanctuary\":\"268\",\"Bluestone 42\":\"269\",\"Drake and Josh\":\"270\",\"Eastbound & Down\":\"271\",\"Curb Your Enthusiasm\":\"273\",\"The Shield\":\"275\",\"Seinfeld\":\"277\",\"Portlandia\":\"280\",\"Workaholics\":\"281\",\"Cosmos: A Spacetime Odyssey\":\"282\",\"Mike & Molly\":\"7315\",\"Orphan Black\":\"289\",\"Fargo\":\"290\",\"Empire (2015)\":\"291\",\"Perception\":\"292\",\"Good Witch\":\"293\",\"Rubicon\":\"294\",\"The Amazing Race\":\"295\",\"Rectify\":\"296\",\"Wheeler Dealers\":\"298\",\"The Apprentice\":\"299\",\"Tosh.0\":\"300\",\"Motive\":\"301\",\"House Of Lies\":\"302\",\"Da Vinci's Demons\":\"303\",\"The Following\":\"304\",\"Bloodline\":\"305\",\"Hannibal\":\"306\",\"In Living Color\":\"307\",\"Rogue\":\"308\",\"Unbreakable Kimmy Schmidt\":\"309\",\"Mozart in the Jungle\":\"310\",\"Trailer Park Boys\":\"315\",\"Real Time with Bill Maher\":\"320\",\"Mr Selfridge\":\"322\",\"The Awesomes\":\"323\",\"The Red Road\":\"324\",\"Young Drunk Punk\":\"326\",\"Marvel's Agents of S.H.I.E.L.D.\":\"331\",\"The Knick\":\"332\",\"Gordons Great Escape\":\"333\",\"Hawaii Five-0\":\"334\",\"Entourage\":\"335\",\"Outlander\":\"336\",\"Battle Creek\":\"337\",\"Salem\":\"340\",\"American Odyssey\":\"342\",\"Mad Men\":\"343\",\"Shameless (US)\":\"345\",\"River Monsters\":\"346\",\"Finding Carter\":\"347\",\"Five Days\":\"350\",\"Comedians In Cars Getting Coffee\":\"356\",\"X Company\":\"357\",\"Fortitude\":\"358\",\"Marvel's Daredevil\":\"360\",\"The Strain\":\"361\",\"Wentworth\":\"362\",\"Broad City\":\"363\",\"Gallipoli\":\"364\",\"Bob's Burgers\":\"366\",\"Rome\":\"369\",\"WWII Air Crash Detectives\":\"370\",\"Keeping Up with the Kardashians\":\"371\",\"iZombie\":\"378\",\"Happy Endings\":\"379\",\"Community\":\"380\",\"Silicon Valley\":\"381\",\"It's Always Sunny in Philadelphia\":\"382\",\"Orange Is the New Black\":\"384\",\"Major Lazer\":\"385\",\"Wild China\":\"387\",\"Banished\":\"388\",\"Shipping Wars\":\"393\",\"Ridiculousness\":\"396\",\"Impractical Jokers\":\"399\",\"Backstrom\":\"400\",\"Sensitive Skin\":\"401\",\"Grimm\":\"408\",\"Cristela\":\"409\",\"My Name Is Earl\":\"412\",\"Younger\":\"415\",\"Other Space\":\"416\",\"The Pacific\":\"423\",\"White Collar\":\"425\",\"Power\":\"431\",\"Nurse Jackie\":\"432\",\"Last Man Standing (2011)\":\"433\",\"MasterChef Australia\":\"434\",\"The Last Man on Earth\":\"437\",\"Bones\":\"439\",\"2 Broke Girls\":\"442\",\"Scorpion\":\"443\",\"Bates Motel\":\"444\",\"How the Universe Works\":\"445\",\"Amish Mafia\":\"451\",\"Vera\":\"454\",\"Jane the Virgin\":\"455\",\"Rehab Addict\":\"458\",\"Top of the Lake\":\"459\",\"Botched\":\"461\",\"Penny Dreadful\":\"463\",\"The Real Housewives Of Beverly Hills\":\"467\",\"Through the Wormhole\":\"468\",\"Burn Notice\":\"472\",\"The Simpsons\":\"476\",\"Mom\":\"477\",\"Beauty and the Beast (2012)\":\"478\",\"Lark Rise To Candleford\":\"479\",\"The Universe\":\"481\",\"Soul Man\":\"484\",\"Drugs, Inc.\":\"485\",\"Over the Garden Wall\":\"486\",\"Cops\":\"487\",\"WWE NXT\":\"489\",\"The Messengers (2015)\":\"491\",\"CHiPs\":\"493\",\"NHL\":\"495\",\"Poldark (2015)\":\"497\",\"Match of The Day 2\":\"499\",\"Madam Secretary\":\"503\",\"The Royals (2015)\":\"504\",\"Veep\":\"505\",\"Last Week Tonight with John Oliver\":\"506\",\"HBO Boxing\":\"507\",\"Jump! (2015)\":\"511\",\"Once Upon a Time (2011)\":\"519\",\"Secrets and Lies (US)\":\"521\",\"The Returned (US)\":\"522\",\"Shortland Street\":\"525\",\"The Night Shift\":\"526\",\"Castle (2009)\":\"527\",\"NCIS: Los Angeles\":\"528\",\"The Daily Show with Jon Stewart\":\"532\",\"Conan (2010)\":\"534\",\"Rush (2014)\":\"538\",\"Property Brothers\":\"545\",\"Undateable (2014)\":\"546\",\"Allegiance\":\"547\",\"NCIS: New Orleans\":\"548\",\"Weird Loners\":\"549\",\"One Big Happy\":\"550\",\"Your Family or Mine\":\"551\",\"Chicago Fire\":\"552\",\"Deadliest Catch\":\"554\",\"Tattoos After Dark\":\"556\",\"Louie (2010)\":\"557\",\"Nazi Mega Weapons\":\"558\",\"Late Night with Seth Meyers\":\"560\",\"TNA Impact Wrestling\":\"564\",\"The Tonight Show Starring Jimmy Fallon\":\"565\",\"Powers (2015)\":\"568\",\"The Nightly Show with Larry Wilmore\":\"569\",\"CSI: Cyber\":\"572\",\"Nashville (2012)\":\"573\",\"Storage Wars\":\"576\",\"The Late Late Show with James Corden\":\"578\",\"Reign (2013)\":\"583\",\"Surface\":\"586\",\"Peter Kay's Car Share\":\"589\",\"Million Dollar Listing New York\":\"590\",\"No Ordinary Family\":\"591\",\"The Odd Couple (2015)\":\"592\",\"Marry Me (2014)\":\"593\",\"Grey's Anatomy\":\"596\",\"Olympus\":\"597\",\"First Dates\":\"608\",\"Have I Got News for You\":\"620\",\"HAPPYish\":\"624\",\"Blue Bloods\":\"633\",\"Private Practice\":\"636\",\"V (2009)\":\"643\",\"Sonic Boom\":\"668\",\"A.D. The Bible Continues\":\"694\",\"Black-ish\":\"697\",\"The X-Files\":\"702\",\"Awake\":\"710\",\"Flash Gordon (2007)\":\"712\",\"Broadchurch\":\"713\",\"Forever (2014)\":\"715\",\"American Idol\":\"718\",\"Hellcats\":\"719\",\"Cheating Vegas\":\"723\",\"HBO Documentary Film Series\":\"727\",\"Make It Pop\":\"750\",\"The Gates\":\"753\",\"VICE\":\"768\",\"Friday Night Lights\":\"789\",\"Rookie Blue\":\"795\",\"Tales from the Crypt\":\"820\",\"The O.C.\":\"829\",\"Law & Order: Special Victims Unit\":\"830\",\"Chicago P.D.\":\"833\",\"American Pickers\":\"834\",\"The Voice UK\":\"838\",\"Lip Sync Battle\":\"841\",\"Wayward Pines\":\"843\",\"Common Law (2012)\":\"855\",\"Teen Wolf\":\"856\",\"The Goldbergs (2013)\":\"858\",\"Intelligence (2014)\":\"861\",\"NOVA\":\"865\",\"Scandal (2012)\":\"876\",\"The Real Housewives of New York City\":\"883\",\"DIG\":\"884\",\"Hunted\":\"890\",\"Remedy\":\"906\",\"Maron\":\"914\",\"Hangar 1: The UFO Files\":\"921\",\"Hart of Dixie\":\"924\",\"Alias\":\"925\",\"National Geographic Documentaries\":\"928\",\"Parenthood\":\"939\",\"History Channel Documentaries\":\"940\",\"Brain Games\":\"942\",\"Episodes\":\"943\",\"Brickleberry\":\"944\",\"Tatau\":\"947\",\"The Real Housewives of Atlanta\":\"956\",\"Teenage Mutant Ninja Turtles (2012)\":\"961\",\"Last Tango in Halifax\":\"967\",\"Futurama\":\"992\",\"Rick and Morty\":\"994\",\"The Middle\":\"1026\",\"Big Time in Hollywood, FL\":\"1045\",\"BBC Documentaries\":\"1069\",\"The Dukes of Hazzard\":\"1080\",\"Spartacus\":\"1111\",\"The Penguins of Madagascar\":\"1115\",\"Bellator Fighting Championships\":\"1116\",\"American Dad!\":\"1122\",\"Anthony Bourdain: Parts Unknown\":\"1128\",\"The Powerpuff Girls\":\"1153\",\"Falling Skies\":\"1160\",\"Young Justice\":\"1161\",\"Galavant\":\"1169\",\"The L Word\":\"1172\",\"Somebody's Gotta Do It\":\"1173\",\"Pawn Stars\":\"1179\",\"The Young Turks\":\"1183\",\"Alaskan Bush People\":\"1192\",\"SpongeBob SquarePants\":\"1196\",\"Samurai Champloo\":\"1210\",\"Stitchers\":\"1214\",\"Jack Irish\":\"1224\",\"Glee\":\"1227\",\"James May's Man Lab\":\"1229\",\"Rugrats\":\"1230\",\"The Avengers: Earth's Mightiest Heroes\":\"1232\",\"Jonathan Strange & Mr Norrell\":\"1235\",\"Marvel's Hulk and the Agents of S.M.A.S.H.\":\"1240\",\"Afro Samurai\":\"1242\",\"Street Outlaws\":\"1252\",\"Boomtowners\":\"1257\",\"The Island\":\"1259\",\"WWE Raw is War\":\"1263\",\"StarTalk with Neil deGrasse Tyson\":\"1266\",\"Supergirl\":\"1267\",\"Texas Rising\":\"1270\",\"RuPaul's Drag Race\":\"1272\",\"Mr. Robot\":\"1281\",\"MasterChef (US)\":\"1289\",\"Grace and Frankie\":\"1299\",\"Jeopardy!\":\"1301\",\"Kill la Kill\":\"1305\",\"Mysteries at the Museum\":\"1309\",\"Life Below Zero\":\"1311\",\"Between\":\"1312\",\"Aquarius (2015)\":\"1313\",\"The Comedians (2015)\":\"1314\",\"The Last Ship\":\"1318\",\"My Mad Fat Diary\":\"1343\",\"Tanked\":\"1348\",\"Scooby-Doo! Mystery Incorporated\":\"1370\",\"Chuck\":\"1390\",\"Alphas\":\"1391\",\"Ripper Street\":\"1393\",\"The Book of Negroes\":\"1394\",\"Halt and Catch Fire\":\"1398\",\"The Last Alaskans\":\"1400\",\"High Profits\":\"1401\",\"When Calls the Heart\":\"1403\",\"Finding Bigfoot\":\"1404\",\"Paranormal Survivor\":\"1405\",\"Zorro (1990)\":\"1412\",\"Chef's Table\":\"1418\",\"UnREAL\":\"1420\",\"The Whispers\":\"1421\",\"Devious Maids\":\"1422\",\"American Genius\":\"1424\",\"Royal Pains\":\"1453\",\"Off the Air\":\"1454\",\"The Newsroom (2012)\":\"1468\",\"Storage Hunters (UK)\":\"1474\",\"Baby Daddy\":\"1477\",\"Tonight\":\"1503\",\"Expedition Unknown\":\"1504\",\"Brew Dogs\":\"1513\",\"The Man In The High Castle\":\"1519\",\"Sense8\":\"1525\",\"Mistresses (US)\":\"1541\",\"Steven Universe\":\"1571\",\"Gravity Falls\":\"1575\",\"Click (2000)\":\"1576\",\"Dallas (2012)\":\"1577\",\"Childrens Hospital\":\"1580\",\"Dominion\":\"1606\",\"Wicked Tuna\":\"1620\",\"Golan the Insatiable\":\"1623\",\"China, IL\":\"1626\",\"Utopia (US) (2014)\":\"1633\",\"Major Crimes\":\"1647\",\"The Fosters (2013)\":\"1649\",\"Murder in the First\":\"1651\",\"Odd Mom Out\":\"1652\",\"Becoming Us\":\"1660\",\"New Worlds\":\"1665\",\"Mickey Mouse Clubhouse\":\"1671\",\"Hemlock Grove\":\"1672\",\"Attack on Titan\":\"1673\",\"Dispatches\":\"1674\",\"Friends\":\"1676\",\"Proof (2015)\":\"1683\",\"Boston Legal\":\"1689\",\"Hell's Kitchen (US)\":\"1690\",\"Triage X\":\"1691\",\"The Interceptor\":\"1692\",\"Steins;Gate\":\"1693\",\"Melissa & Joey\":\"1696\",\"Mysteries at the National Parks\":\"1700\",\"Gran Hotel\":\"1705\",\"Napoleon (2015)\":\"1706\",\"Defiance\":\"1720\",\"Phineas and Ferb\":\"1721\",\"Dark Matter\":\"1722\",\"Thunderbirds Are Go!\":\"1725\",\"Girl Meets World\":\"1726\",\"Napoleon: The Campaign of Russia\":\"1727\",\"Ben 10\":\"1729\",\"Cowboy Bebop\":\"1731\",\"The Border\":\"1736\",\"Humans\":\"1737\",\"Angry Birds Toons\":\"1738\",\"Wolf Hall\":\"1746\",\"The Big Fat Quiz of the Year\":\"1747\",\"Whose Line Is It Anyway?\":\"1748\",\"Gavin and Stacey\":\"1751\",\"Vicious\":\"1752\",\"The Making of The Mob: New York\":\"1753\",\"Black Mirror\":\"1754\",\"Commander In Chief\":\"1756\",\"Hello Ladies\":\"1759\",\"Tyrant\":\"1763\",\"Rizzoli and Isles\":\"1764\",\"Boy Meets World\":\"1766\",\"Strike Back\":\"1770\",\"Brother vs. Brother\":\"1772\",\"SunTrap\":\"1773\",\"Kirby Buckets\":\"1774\",\"Misfits\":\"1775\",\"Mountain Men\":\"1781\",\"Complications\":\"1782\",\"The Astronaut Wives Club\":\"1783\",\"Alone\":\"1787\",\"Firefly\":\"1789\",\"Metropolis\":\"1790\",\"Stargate SG-1\":\"1791\",\"Killjoys\":\"1792\",\"8 Out of 10 Cats Does Countdown\":\"1796\",\"Pokémon\":\"1800\",\"The First 48\":\"1806\",\"The Dark Charisma of Adolf Hitler\":\"1810\",\"Almost Human\":\"1811\",\"Stargate Atlantis\":\"1812\",\"Discovery Channel Documentaries\":\"1814\",\"Skins\":\"1819\",\"Spawn\":\"1820\",\"Naruto Shippuden\":\"1822\",\"The Fall\":\"1823\",\"Weeds\":\"1825\",\"Death Note\":\"1827\",\"Super City\":\"1828\",\"Liv and Maddie\":\"1833\",\"Aqua Teen Hunger Force Forever\":\"1836\",\"Celebrity Family Feud\":\"1837\",\"The Brink\":\"1838\",\"Ballers\":\"1839\",\"The BBC at War\":\"1844\",\"BattleBots (2015)\":\"1845\",\"Gilmore Girls\":\"1847\",\"Deutschland 83\":\"1848\",\"Xtreme Waterparks\":\"1849\",\"Chasing Maria Menounos\":\"1852\",\"Web of Lies\":\"1854\",\"90 Day Fiance\":\"1856\",\"Carrier\":\"1857\",\"Star vs. the Forces of Evil\":\"1859\",\"Forged in Fire\":\"1864\",\"Ultimate Spider-Man\":\"1866\",\"The Real Housewives of Orange County\":\"1873\",\"The Rachel Maddow Show\":\"1875\",\"Catch a Contractor\":\"1881\",\"Pointless\":\"1882\",\"Clipped\":\"1885\",\"Doctor Who (2005)\":\"1888\",\"WWE Tough Enough\":\"1892\",\"EastEnders\":\"1894\",\"Merlin\":\"1895\",\"Inside Amy Schumer\":\"1896\",\"Ink Master\":\"1897\",\"Natural World\":\"1900\",\"Frontline\":\"1902\",\"Dance Moms\":\"1906\",\"River City\":\"1908\",\"Survivor\":\"1910\",\"The IT Crowd\":\"1911\",\"Regular Show\":\"1912\",\"Big Brother\":\"1914\",\"What Could Possibly Go Wrong?\":\"1917\",\"First Peoples\":\"1918\",\"Billy & Billie\":\"1920\",\"The Briefcase\":\"1921\",\"Graceland\":\"1933\",\"Scooby-Doo, Where Are You!\":\"1934\",\"Smallville\":\"1937\",\"Six Feet Under\":\"1946\",\"The Killing\":\"1947\",\"Best Friends Whenever\":\"1950\",\"Drive on NBC Sports\":\"1966\",\"The Fighting Season\":\"1968\",\"Star Trek: The Next Generation\":\"1972\",\"Impastor\":\"1976\",\"The Half Hour\":\"1980\",\"Hero 108\":\"1981\",\"Dream Defenders\":\"1982\",\"Toshokan Sensou\":\"1984\",\"LEGO NinjaGo: Masters of Spinjitzu\":\"1986\",\"The Bachelor\":\"1990\",\"Star Wars: The Clone Wars\":\"1994\",\"The Meltdown with Jonah and Kumail\":\"1998\",\"Zoo\":\"2002\",\"Shark Week\":\"2003\",\"The Bank: A Matter of Life and Debt\":\"2005\",\"Marvel's Avengers Assemble\":\"2010\",\"Continuum\":\"2011\",\"Red Dwarf\":\"2016\",\"Extant\":\"2021\",\"Hamtaro\":\"2023\",\"Astro Boy\":\"2024\",\"Masters of Sex\":\"2025\",\"Ray Donovan\":\"2026\",\"Luther\":\"2027\",\"Sofia the First\":\"2030\",\"The McCarthys\":\"2032\",\"Max Steel (2013)\":\"2036\",\"Lab Rats (2012)\":\"2040\",\"The Office (US)\":\"2042\",\"Parks and Recreation\":\"2045\",\"Baieti Buni\":\"2047\",\"Yukon Gold\":\"2049\",\"Scrubs\":\"2054\",\"The Millers\":\"2056\",\"Panorama\":\"2070\",\"Chasing Life\":\"2073\",\"Black Work\":\"2074\",\"Talia in the Kitchen\":\"2078\",\"Every Witch Way\":\"2082\",\"Holby City\":\"2084\",\"Doc McStuffins\":\"2096\",\"Total Divas\":\"2097\",\"Tattoo Fixers\":\"2101\",\"Love\":\"2104\",\"The Amazing World of Gumball\":\"2110\",\"NRL\":\"2114\",\"The Spoils Before Dying\":\"2115\",\"Review\":\"2120\",\"Dragons\":\"2123\",\"Catching Milat\":\"2125\",\"Prime Suspect\":\"2127\",\"The Amazing Race Canada\":\"2128\",\"Playhouse Presents\":\"2129\",\"Jessie (2011)\":\"2134\",\"Masters of Illusion\":\"2135\",\"Married\":\"2137\",\"Treehouse Masters\":\"2140\",\"The Elegant Gentleman's Guide to Knife Fighting\":\"2142\",\"7 Days in Hell\":\"2149\",\"The Ultimate Fighter\":\"2158\",\"Death Row Stories\":\"2168\",\"Nick Helm's Heavy Entertainment\":\"2169\",\"Storyville\":\"2179\",\"Z Nation\":\"2182\",\"Dancing on the Edge\":\"2183\",\"Residue\":\"2194\",\"Trust Me I'm A Doctor\":\"2203\",\"Doc Zone\":\"2204\",\"Murdoch Mysteries\":\"2214\",\"Justice League\":\"2215\",\"Sex&Drugs&Rock&Roll\":\"2221\",\"The Exes\":\"2222\",\"Bargain Hunt\":\"2224\",\"Jono and Ben at Ten\":\"2226\",\"Homes Under the Hammer\":\"2232\",\"Odd Squad\":\"2233\",\"The ONE Show\":\"2238\",\"Pete and Pio\":\"2242\",\"Pig Goat Banana Cricket\":\"2247\",\"Harvey Beaks\":\"2249\",\"Hetty Feather\":\"2250\",\"Sanjay and Craig\":\"2253\",\"Hell on Wheels\":\"2262\",\"John from Cincinnati\":\"2267\",\"Desperate Housewives\":\"2268\",\"BoJack Horseman\":\"2269\",\"Friends of the People\":\"2271\",\"Welcome to Sweden (2014)\":\"2272\",\"Your Pretty Face is Going to Hell\":\"2280\",\"Kim Possible\":\"2281\",\"Naked and Afraid XL\":\"2283\",\"Jimmy Kimmel Live\":\"2299\",\"Glitch (2015)\":\"2325\",\"Witnesses\":\"2327\",\"The Saboteurs\":\"2328\",\"Tut\":\"2329\",\"Lilyhammer\":\"2332\",\"Wander Over Yonder\":\"2337\",\"Life with Boys\":\"2352\",\"Tom and Jerry Tales\":\"2353\",\"MasterChef New Zealand\":\"2368\",\"What's New Scooby-Doo?\":\"2381\",\"The Starter Wife\":\"2388\",\"Eggheads\":\"2389\",\"I Am Cait\":\"2392\",\"Face Off\":\"2409\",\"30 Rock\":\"2416\",\"We Bare Bears\":\"2421\",\"The Carbonaro Effect\":\"2422\",\"Catastrophe (2015)\":\"2424\",\"The Enfield Haunting\":\"2425\",\"Jimmy Two-Shoes\":\"2426\",\"American Masters\":\"2429\",\"Wet Hot American Summer\":\"2433\",\"Kung Fu Panda: Legends of Awesomeness\":\"2435\",\"The Ricky Gervais Show\":\"2450\",\"The Unit\":\"2452\",\"Marvel's Guardians of the Galaxy\":\"2458\",\"Good Eats\":\"2460\",\"The First 48: Missing Persons\":\"2461\",\"Mob City\":\"2472\",\"Rizzoli & Isles\":\"2478\",\"Playing House\":\"2479\",\"Mr. Robinson\":\"2487\",\"Earth's Natural Wonders\":\"2492\",\"Horizon\":\"2494\",\"Dating Naked\":\"2497\",\"Caught Red Handed UK\":\"2505\",\"Gogglebox\":\"2518\",\"Claimed and Shamed\":\"2519\",\"Great Canal Journeys\":\"2525\",\"Sportscene\":\"2532\",\"On Assignment\":\"2555\",\"Jeeves and Wooster\":\"2566\",\"Akame ga Kill!\":\"2568\",\"Gatchaman Crowds\":\"2569\",\"Park Bench\":\"2570\",\"Boj\":\"2576\",\"The Carmichael Show\":\"2579\",\"Lucifer\":\"2580\",\"Minority Report\":\"2581\",\"Blindspot\":\"2582\",\"Crash\":\"2583\",\"The Island with Bear Grylls\":\"2584\",\"Hard Knocks\":\"2585\",\"Documentary Now!\":\"2589\",\"UCL\":\"2597\",\"Everything's Rosie\":\"2604\",\"Heroes Reborn\":\"2605\",\"Project MC2\":\"2617\",\"Miami Vice\":\"2629\",\"Tumble Leaf\":\"2639\",\"Project Runway\":\"2642\",\"Ex on the Beach\":\"2645\",\"Hotel Babylon\":\"2646\",\"Sidekick\":\"2647\",\"Blunt Talk\":\"2655\",\"Time Traveling with Brian Unger\":\"2657\",\"Show Me a Hero\":\"2661\",\"Jordskott\":\"2665\",\"Don't Be Tardy\":\"2666\",\"A Question of Sport\":\"2669\",\"Grossology\":\"2673\",\"Shameless\":\"10237\",\"Hack My Life\":\"2680\",\"Real Husbands of Hollywood\":\"2683\",\"Kingdom (2014)\":\"2686\",\"Outlaw Chronicles: Hells Angels\":\"2694\",\"From Dusk Till Dawn: The Series\":\"2705\",\"Flowers of Evil\":\"2715\",\"Survivor's Remorse\":\"2719\",\"Fear the Walking Dead\":\"2728\",\"Plebs\":\"2730\",\"Switched at Birth\":\"2734\",\"The Heart, She Holler\":\"2741\",\"Deadbeat\":\"2743\",\"Public Morals (2015)\":\"2746\",\"Paw Patrol\":\"2753\",\"Goodness Gracious Me\":\"2761\",\"Homicide Hunter: Lt. Joe Kenda\":\"2769\",\"Happy Valley\":\"2771\",\"Grantchester\":\"2776\",\"Narcos\":\"2777\",\"Wallander (UK)\":\"2779\",\"A Football Life\":\"2792\",\"EPL Matchday\":\"2796\",\"Naarje\":\"2798\",\"Media Watch\":\"2809\",\"Awkward.\":\"2815\",\"Faking It (2014)\":\"2816\",\"Moonbeam City\":\"2817\",\"Lost Girl\":\"2818\",\"Celebrity Mastermind\":\"2820\",\"The World Game\":\"2824\",\"inside story au\":\"2826\",\"Hand of God\":\"2835\",\"Bondi Rescue\":\"2838\",\"Drunk History\":\"2841\",\"Insight (1999)\":\"2847\",\"Nature\":\"2864\",\"Mr. Sloane\":\"2893\",\"Wallander\":\"2905\",\"Avatar: The Last Airbender\":\"2908\",\"The Joy of Painting\":\"2917\",\"Hack My Brain\":\"3067\",\"UEFA Euro 2016 Qualifying Group E England Vs Switzerland\":\"3080\",\"Doctor Foster\":\"3093\",\"Young & Hungry\":\"3104\",\"Room 101\":\"3132\",\"Longmire\":\"3152\",\"Celebrity Juice\":\"3177\",\"Alt for Norge\":\"3188\",\"Mickey Mouse\":\"3206\",\"Celebrity Big Brother Live From The House 2015 09\":\"3220\",\"Henry Danger\":\"3248\",\"Dateline SBS\":\"3317\",\"Foreign Correspondent\":\"3323\",\"The 4400\":\"3330\",\"Love & Hip Hop Hollywood\":\"3342\",\"The Mindy Project\":\"3367\",\"World Series Of Poker\":\"3372\",\"Britain's Biggest Adventures with Bear Grylls\":\"3383\",\"The Late Show with Stephen Colbert\":\"5309\",\"The Bastard Executioner\":\"3389\",\"The Living Room\":\"3405\",\"Manhattan\":\"3417\",\"The Weekly With Charlie Pickering\":\"3470\",\"The Sunday Footy Show NRL 2015 05 10\":\"3471\",\"Witness (2012)\":\"3474\",\"Heartland (2007) (CA)\":\"3511\",\"America Unearthed\":\"3528\",\"Black Jesus\":\"3529\",\"You're the Worst\":\"3535\",\"Hunted (2015)\":\"3537\",\"The Chaser's Media Circus\":\"3538\",\"America's Secret Swimming Holes\":\"3540\",\"Limitless\":\"3554\",\"NCAA Football 2015 09 19 Northern Illinois Vs Ohio State 720p ESPN WEBRip AAC2\":\"3566\",\"CSI: Crime Scene Investigation\":\"3579\",\"Tavis Smiley\":\"3581\",\"The Dumping Ground\":\"3591\",\"Pit Bulls And Parolees\":\"3593\",\"Kings\":\"3595\",\"Saturday Kitchen\":\"3596\",\"The Film Review\":\"3597\",\"Our World (2007)\":\"3598\",\"This Is England\":\"3616\",\"Special Forces - Ultimate Hell Week\":\"3617\",\"Alaska Haunting\":\"3618\",\"The Sweeney\":\"3623\",\"Quantum Leap\":\"3624\",\"The Gadget Show\":\"3630\",\"The Muppets\":\"3634\",\"Life in Pieces\":\"3635\",\"The Ellen DeGeneres Show\":\"3636\",\"Parking Wars (2015)\":\"3638\",\"Scream Queens (2015)\":\"3640\",\"Talking Footy\":\"3644\",\"Night Stalker\":\"3648\",\"Rosewood\":\"3651\",\"The Player (2015)\":\"3653\",\"Saving Hope\":\"3654\",\"Quantico\":\"3658\",\"Blood & Oil\":\"3660\",\"The Sheriffs Are Coming\":\"3661\",\"The Thick of It\":\"3666\",\"Warehouse 13\":\"3667\",\"Kolchak: The Night Stalker\":\"3668\",\"Greek\":\"3673\",\"The Closer\":\"3677\",\"Sunnyside\":\"3679\",\"The Leftovers\":\"3680\",\"The Eric Andre Show\":\"3681\",\"Gracepoint\":\"3682\",\"The Bridge (2011)\":\"3684\",\"Side Om Side\":\"3689\",\"Occupied\":\"3690\",\"Chosen\":\"3691\",\"The Andy Griffith Show\":\"3694\",\"Chopped\":\"3695\",\"Nathan for You\":\"3696\",\"Gossip Girl\":\"3698\",\"Ghost in the Shell: Stand Alone Complex\":\"3702\",\"Taxi Brooklyn\":\"3703\",\"The Shining\":\"3707\",\"The Job Lot\":\"3708\",\"Please Like Me\":\"3713\",\"Veronica Mars\":\"3715\",\"You, Me and the Apocalypse\":\"3717\",\"The Critic\":\"3718\",\"Flea Market Flip\":\"3719\",\"Cesar 911\":\"3722\",\"The Adventures of Brisco County Jr.\":\"3726\",\"Caprica\":\"3727\",\"King of the Hill\":\"3728\",\"Cleaners\":\"3729\",\"Back in Time for Dinner\":\"3730\",\"Togetherness\":\"3733\",\"Club de Cuervos\":\"3734\",\"Dead Like Me\":\"3736\",\"Man Seeking Woman\":\"3737\",\"River\":\"3738\",\"Psych\":\"3742\",\"ER\":\"3743\",\"Karl Pilkington: The Moaning of Life\":\"3744\",\"Malcolm in the Middle\":\"3746\",\"The West Wing\":\"3749\",\"Zoids.Chaotic.Century\":\"3750\",\"The Principal\":\"3757\",\"Indian Summers\":\"3760\",\"Human Planet\":\"3763\",\"Utopia\":\"3764\",\"Star Trek: Voyager\":\"3765\",\"Farscape\":\"3766\",\"Con Man\":\"3767\",\"One Tree Hill\":\"3769\",\"Lost in Space\":\"3777\",\"Legends (2014)\":\"3779\",\"Breadwinners\":\"3780\",\"Bubble Guppies\":\"3781\",\"Pushing Daisies\":\"3782\",\"Ali G Rezurection\":\"3784\",\"Dr. Ken\":\"3787\",\"Borgen\":\"3789\",\"An Idiot Abroad\":\"3790\",\"Blue Mountain State\":\"3800\",\"TripTank\":\"3802\",\"Deadwood\":\"3803\",\"Political Animals\":\"3804\",\"Leverage\":\"3805\",\"The Tudors\":\"3809\",\"Dark Angel\":\"3810\",\"Robot Chicken\":\"3811\",\"Dollhouse\":\"3812\",\"Blackadder\":\"3815\",\"Babylon 5\":\"3816\",\"The Borgias\":\"3818\",\"Satisfaction (2014)\":\"3819\",\"What's Really in Our Food (UK)\":\"3820\",\"Popples (2015)\":\"3823\",\"Star Trek: Deep Space Nine\":\"3824\",\"Peaky Blinders\":\"3827\",\"Wolfblood\":\"3828\",\"Secret Eaters\":\"3830\",\"Anger Management\":\"3831\",\"Hogfather\":\"3832\",\"This Is America Charlie Brown\":\"3833\",\"Crusade\":\"3835\",\"Red Oaks\":\"3837\",\"Pokemon\":\"3840\",\"Grandfathered\":\"3842\",\"Family Matters\":\"3846\",\"Flesh and Bone\":\"3848\",\"The Returned\":\"3849\",\"Andy's Dinosaur Adventures\":\"3850\",\"Trollied\":\"3851\",\"Transparent\":\"3853\",\"Fawlty Towers\":\"3856\",\"A Gifted Man\":\"3857\",\"Kyle XY\":\"3858\",\"In The Flesh\":\"3859\",\"Better Off Ted\":\"3861\",\"Betrayal\":\"3864\",\"Fairly Legal\":\"3865\",\"Master of None\":\"3866\",\"The Civil War\":\"3868\",\"Everybody Loves Raymond\":\"3869\",\"Emily Owens, M.D.\":\"3870\",\"Off the Map\":\"3871\",\"Generation Kill\":\"3874\",\"Life\":\"3876\",\"Crossing Lines\":\"3877\",\"UFOs Declassified\":\"3881\",\"The Librarians (2014)\":\"3882\",\"Agent X (2015)\":\"3883\",\"Getting On (US)\":\"3884\",\"Getting On\":\"3885\",\"Twin Peaks\":\"3886\",\"Robin Hood\":\"3893\",\"Terra Nova\":\"3895\",\"Deception\":\"3898\",\"Alcatraz\":\"3900\",\"Wicked City\":\"3901\",\"Jekyll and Hyde\":\"3902\",\"Gangland Undercover\":\"3903\",\"Rosemary's Baby\":\"3906\",\"Smash (2012)\":\"3907\",\"Eleventh Hour (US)\":\"3908\",\"Sherlock Holmes\":\"3909\",\"Sam & Cat\":\"3911\",\"Code Black\":\"3912\",\"Nip/Tuck\":\"3913\",\"Unforgotten\":\"3914\",\"Married ... with Children\":\"3916\",\"Stargate Universe\":\"3917\",\"Airwolf\":\"3918\",\"Peep Show\":\"3921\",\"Ash vs Evil Dead\":\"3925\",\"Cheer Perfection\":\"3926\",\"The White Queen\":\"3927\",\"The Last Kingdom\":\"3928\",\"The Mind of a Chef\":\"3930\",\"The Frankenstein Chronicles\":\"3931\",\"MasterChef Junior\":\"3935\",\"Into the Badlands\":\"3936\",\"Breakthrough\":\"3939\",\"Alaska: The Last Frontier\":\"3940\",\"Defying Gravity\":\"3941\",\"Fantasy Island\":\"3942\",\"From Darkness\":\"3943\",\"The 10th Kingdom\":\"3944\",\"The Coroner\":\"3946\",\"Insider\":\"3948\",\"London Spy\":\"3950\",\"Crazy Ex-Girlfriend\":\"3952\",\"The Block NZ\":\"3963\",\"A Place To Call Home\":\"3965\",\"Austin City Limits\":\"3966\",\"Dragon Ball Kai\":\"3969\",\"Scot Squad\":\"3970\",\"The Curse of Oak Island\":\"3972\",\"Chicago Med\":\"3975\",\"Homes By the Sea\":\"3976\",\"Alien Surf Girls\":\"3980\",\"Dag\":\"3981\",\"The Romeo Section\":\"3989\",\"The Last Panthers\":\"3990\",\"The Grinder\":\"3991\",\"iCarly\":\"4000\",\"Matrioshki - Russian Dolls: Sex Trade\":\"4002\",\"Poker After Dark\":\"4003\",\"Being Mary Jane\":\"4005\",\"Nightwatch\":\"4006\",\"Manhattan Love Story\":\"4007\",\"Grand Designs New Zealand\":\"4008\",\"Marvel's Jessica Jones\":\"4013\",\"Citizen Khan\":\"4014\",\"Punky Brewster\":\"4016\",\"Cheers\":\"4017\",\"Everwood\":\"4018\",\"Torchwood\":\"4020\",\"One-Punch Man\":\"4022\",\"Inside No. 9\":\"4023\",\"Flight of the Conchords\":\"4024\",\"Wolverine and the X-Men\":\"4026\",\"LateLine\":\"4027\",\"That '70s Show\":\"4029\",\"Life (2009)\":\"4032\",\"Pardon the Interruption\":\"4037\",\"Moonshiners\":\"4039\",\"Teenage Mutant Ninja Turtles (1987)\":\"4041\",\"The Art of More\":\"4043\",\"The Apprentice: You're Fired!\":\"4045\",\"Sherlock Holmes (1984)\":\"4047\",\"The Comeback\":\"4048\",\"The Hunt (2015)\":\"4050\",\"South of Hell\":\"4052\",\"No Game No Life\":\"4058\",\"Korgoth of Barbaria\":\"4059\",\"Ergo Proxy\":\"4060\",\"The Missing\":\"4061\",\"A Crime to Remember\":\"4063\",\"W/ Bob & David\":\"4069\",\"Rock & Chips\":\"4070\",\"The Scene\":\"4072\",\"Superstore\":\"4074\",\"Batman Beyond\":\"4075\",\"Hindsight (2015)\":\"4076\",\"Unsealed: Conspiracy Files\":\"4077\",\"The Impressionists: Painting and Revolution\":\"4079\",\"SAS: Who Dares Wins\":\"4080\",\"Being Erica\":\"4083\",\"Jane By Design\":\"4086\",\"Melrose Place (2009)\":\"4088\",\"The L.A. Complex\":\"4089\",\"Dobrodružství kriminalistiky\":\"4090\",\"Believe\":\"4091\",\"The New Normal\":\"4092\",\"Casual\":\"4095\",\"Fixer Upper\":\"4097\",\"Olive Kitteridge\":\"4099\",\"Attenborough: 60 Years in the Wild\":\"4101\",\"Detectorists\":\"4102\",\"Julkalendern\":\"4103\",\"Bad Blood\":\"4109\",\"Mission: Impossible\":\"4111\",\"Planet Earth\":\"4113\",\"Long Way Round\":\"4114\",\"The Timeline\":\"4117\",\"Mike Tyson Mysteries\":\"4119\",\"BBC Music Awards\":\"4121\",\"10 Things You Dont Know About\":\"4122\",\"Samurai Jack\":\"4124\",\"The Cleveland Show\":\"4128\",\"TURN: Washington's Spies\":\"4129\",\"The Beautiful Lie\":\"4131\",\"Capital (2015)\":\"4132\",\"Neon Joe, Werewolf Hunter\":\"4133\",\"This American Life\":\"4134\",\"The Expanse\":\"4136\",\"Real Rob\":\"4137\",\"Childhood's End\":\"4138\",\"The Magicians (2015)\":\"4139\",\"Toast of London\":\"4140\",\"The Jinx: The Life and Deaths of Robert Durst\":\"4142\",\"That Mitchell and Webb Look\":\"4143\",\"Top Chef: Last Chance Kitchen\":\"4144\",\"37 Days\":\"4146\",\"Human Universe\":\"4148\",\"Project Runway All Stars\":\"4149\",\"Ransom\":\"4151\",\"Backchat with Jack Whitehall and His Dad\":\"4152\",\"Sweets Made Simple\":\"4153\",\"Simply Nigella\":\"4154\",\"Sequestered\":\"4155\",\"A Day In The Life\":\"4156\",\"Spotless\":\"4158\",\"Brotherhood\":\"4160\",\"Josh\":\"4161\",\"Pulling\":\"4164\",\"Wilfred (US)\":\"4165\",\"Colony\":\"4166\",\"Crims\":\"4169\",\"Everybody Hates Chris\":\"4170\",\"The Sandhamn Murders\":\"4171\",\"Spiral (2005)\":\"4172\",\"Der Tatortreiniger\":\"4173\",\"Watchmen: The Motion Comic\":\"4176\",\"The Super Hero Squad Show\":\"4177\",\"F is for Family\":\"4178\",\"The Quest for Bannockburn\":\"4179\",\"Call the Midwife\":\"4180\",\"Wonders of the Solar System\":\"4181\",\"The Fairly Oddparents\":\"4182\",\"Strange Luck\":\"4184\",\"Kidnapped\":\"4185\",\"Wonders of the Universe\":\"4187\",\"Meet the Kittens\":\"4189\",\"My Pet and Me\":\"4190\",\"Sarah & Duck\":\"4191\",\"Billions\":\"4193\",\"Wonders of Life\":\"4196\",\"8 Out of 10 Cats\":\"4197\",\"Tatort\":\"4198\",\"The Adventures of Puss in Boots\":\"4199\",\"The Lost Room\":\"4200\",\"Moonlight\":\"4201\",\"Tree Fu Tom\":\"4202\",\"The Neighbors\":\"4203\",\"The Shannara Chronicles\":\"4205\",\"Life Story\":\"4206\",\"Making a Murderer\":\"4207\",\"Serial Experiments Lain\":\"4208\",\"War and Peace (2016)\":\"4211\",\"The Legend of Korra\":\"4212\",\"Endeavour\":\"4213\",\"Jericho (2016)\":\"4214\",\"Shades of Blue\":\"4215\",\"And Then There Were None\":\"4216\",\"Outsourced\":\"4217\",\"Captain Scarlet and the Mysterons\":\"4218\",\"Golden Globe Awards\":\"4219\",\"Arvingerne\":\"4220\",\"Mars (2016)\":\"4221\",\"Brille\":\"4222\",\"What's With Andy\":\"4223\",\"RocketJump: The Show\":\"4224\",\"The Increasingly Poor Decisions of Todd Margaret\":\"4225\",\"Danny Phantom\":\"4226\",\"Beck\":\"4228\",\"Dark Matters: Twisted But True\":\"4230\",\"Great Barrier Reef with David Attenborough\":\"4231\",\"Copper\":\"4235\",\"Crossing Jordan\":\"4236\",\"DC's Legends of Tomorrow\":\"4237\",\"CBeebies Stargazing\":\"4239\",\"Revolution\":\"4240\",\"Toopy and Binoo\":\"4243\",\"Agatha Christie's Poirot\":\"4244\",\"The Life and Times of Tim\":\"4246\",\"Mad Dogs (US)\":\"4247\",\"Mako Mermaids\":\"4248\",\"Bewitched\":\"4250\",\"Baskets\":\"4251\",\"The Office (UK)\":\"4252\",\"Snooker Masters 2016\":\"4254\",\"Stone Cold Podcast\":\"4255\",\"Kate Humble: Living with Nomads\":\"4256\",\"Yami Shibai - Japanese Ghost Stories\":\"4257\",\"Around the Horn\":\"4258\",\"Highly Questionable\":\"4260\",\"Outside the Lines\":\"4261\",\"Shadowhunters\":\"4263\",\"Unusual Suspects\":\"4268\",\"Schitt's Creek\":\"4269\",\"The Boonies\":\"4270\",\"Blue\":\"4272\",\"Still Open All Hours\":\"4274\",\"Inside Man\":\"4275\",\"Solsidan\":\"4276\",\"Sirens (2014)\":\"4277\",\"Dixi\":\"4279\",\"Legend of the Seeker\":\"4283\",\"Horace and Pete\":\"4285\",\"Team Ninja Warrior\":\"4287\",\"Rebellion\":\"4288\",\"Rebel Geeks\":\"4289\",\"Unforgettable\":\"4290\",\"Angie Tribeca\":\"4291\",\"Fosterland\":\"4292\",\"Beer Geeks\":\"4293\",\"American Crime Story\":\"4294\",\"Life.Story\":\"4295\",\"Sleeper Cell\":\"4298\",\"Frank Herbert's Children of Dune\":\"4300\",\"Austin & Ally\":\"4301\",\"K.C. Undercover\":\"4302\",\"Immortal Egypt with Joann Fletcher\":\"4303\",\"Victorian Bakers\":\"4304\",\"Head to Head\":\"4305\",\"Great British Railway Journeys\":\"4306\",\"Madoff\":\"4307\",\"The Cisco Kid\":\"4308\",\"Animals.\":\"4309\",\"Babylon (2014)\":\"4313\",\"Gomorrah\":\"4315\",\"Schulz & Böhmermann\":\"4316\",\"Insert Name Here\":\"4317\",\"The Nightmare Worlds of H.G. Wells\":\"4318\",\"Killing Fields\":\"4321\",\"Chelsea Does...\":\"4322\",\"The Real Housewives of Cheshire\":\"4324\",\"Sugar Free Farm\":\"4325\",\"The Real Marigold Hotel\":\"4326\",\"Harper's Island\":\"4328\",\"Eureka\":\"4329\",\"Studio 60 on the Sunset Strip\":\"4330\",\"The River (2012)\":\"4332\",\"WRC\":\"4334\",\"Nowhere To Hide\":\"4335\",\"Bordertown (2016)\":\"4337\",\"Cooper Barrett's Guide To Surviving Life\":\"4338\",\"Idiotsitter (2016)\":\"4339\",\"Vinyl\":\"4340\",\"11.22.63\":\"4341\",\"Letterkenny\":\"4343\",\"Greece with Simon Reeve\":\"4344\",\"Hunderby\":\"4348\",\"Topless Prophet\":\"4349\",\"It's a Date\":\"4350\",\"Mammon\":\"4351\",\"RWBY\":\"4352\",\"M.I. High\":\"4355\",\"Join or Die with Craig Ferguson\":\"4358\",\"Nascar\":\"4359\",\"Molly\":\"4360\",\"The Family Law\":\"4361\",\"The Cyanide & Happiness Show\":\"4362\",\"The Geansaí\":\"4363\",\"How Not To Live Your Life\":\"4364\",\"WWE Pay-Per-View\":\"4365\",\"Telenovela\":\"4366\",\"Dickensian\":\"4368\",\"Luck\":\"4370\",\"Adam Ruins Everything\":\"4371\",\"Ainsi soient-ils\":\"4372\",\"Versailles (2015)\":\"4373\",\"Reaper\":\"4375\",\"Fuller House\":\"4376\",\"Second Chance (2016)\":\"4377\",\"The Venture Bros.\":\"4380\",\"Fullmetal Alchemist Brotherhood\":\"4384\",\"Fate/Stay Night Unlimited Blade Works\":\"4385\",\"Steve Austin's Broken Skull Challenge\":\"4387\",\"How the Earth Was Made\":\"4389\",\"Felicity\":\"4390\",\"Batman: The Brave and the Bold\":\"4391\",\"The Secret Life of the American Teenager\":\"4392\",\"Dark Net\":\"4393\",\"Angel from Hell\":\"4394\",\"Eli Stone\":\"4397\",\"The Real O'Neals\":\"4399\",\"Red Band Society\":\"4401\",\"ReGenesis\":\"4402\",\"Ultimate Spider-Man vs The Sinister 6\":\"4403\",\"The Family (2016)\":\"4404\",\"The Night Manager\":\"4405\",\"Jamillah and Aladdin\":\"4406\",\"Recovery Road\":\"4407\",\"The Nine Lives of Chloe King\":\"4408\",\"Comic Book Men\":\"4409\",\"Talking Dead\":\"4410\",\"Talking Saul\":\"4411\",\"Damien\":\"4412\",\"Victoria's Secret\":\"4414\",\"Monk\":\"4415\",\"East Los High\":\"4417\",\"Angels in America\":\"4421\",\"Chappelle's Show\":\"4422\",\"Carnivàle\":\"4424\",\"Are You the One?\":\"4425\",\"Slasher\":\"4426\",\"American Ninja Warrior\":\"4427\",\"The Game (2014)\":\"4428\",\"The Company\":\"4429\",\"Not Safe with Nikki Glaser\":\"4430\",\"This is Not Happening\":\"4432\",\"Full Frontal with Samantha Bee\":\"4433\",\"Yukon Men\":\"4435\",\"Dual Survival\":\"4436\",\"Diesel Brothers\":\"4440\",\"The Last Detective\":\"4441\",\"Dragon Ball Super\":\"4442\",\"Star Trek\":\"4443\",\"Prohibition\":\"4444\",\"Flaked\":\"4447\",\"Criminal Minds: Beyond Borders\":\"4449\",\"Clannad\":\"4450\",\"Crowded\":\"4451\",\"Trapped (2015)\":\"4452\",\"Blå ögon\":\"4453\",\"Steve-O: Guilty as Charged\":\"4454\",\"Wildboyz\":\"4455\",\"Murder (2016)\":\"4459\",\"Bunheads\":\"4460\",\"Formula1\":\"4461\",\"Blood and Water\":\"4462\",\"Iolo's Brecon Beacons\":\"4464\",\"The Bletchley Circle\":\"4465\",\"Bear Grylls Breaking Point\":\"4466\",\"Silent Witness\":\"4467\",\"Mr. Pickles\":\"4468\",\"Counting Cars\":\"4469\",\"Billion Dollar Wreck\":\"4470\",\"Swamp People\":\"4472\",\"The Catch\":\"4474\",\"Chrisley Knows Best\":\"4476\",\"Wild Palms\":\"4477\",\"Shetland\":\"4478\",\"Puffin Rock\":\"4479\",\"Hung\":\"4481\",\"Beowulf: Return to the Shieldlands\":\"4482\",\"Ghost Whisperer\":\"4483\",\"Magic City\":\"4484\",\"Thirteen\":\"4485\",\"Fresh Meat\":\"4486\",\"Freaks and Geeks\":\"4487\",\"Outsiders\":\"4490\",\"Stan Lee's Lucky Man\":\"4491\",\"Rush Hour (2016)\":\"4492\",\"Party Down\":\"4495\",\"Terra Formars\":\"4496\",\"The Tunnel\":\"4498\",\"Ugly Americans\":\"4499\",\"The Genius Of Photography\":\"4500\",\"Hard\":\"4501\",\"Teachers (2016)\":\"4502\",\"Hap and Leonard\":\"4503\",\"The Cruise\":\"4504\",\"The Little Mermaid\":\"4505\",\"The Jim Gaffigan Show\":\"4506\",\"Inside Obama's White House\":\"4507\",\"Wonders of the Monsoon\":\"4508\",\"James May: The Reassembler\":\"4509\",\"Dice\":\"4510\",\"Varan-TV\":\"4511\",\"Insurrection\":\"4512\",\"Turmoil and Triumph: The George Shultz Years\":\"4513\",\"Big Dreams Small Spaces\":\"4514\",\"Peg + Cat\":\"4515\",\"Meet The McDonaghs\":\"4516\",\"Garfunkel and Oates\":\"4518\",\"Millennium\":\"4519\",\"Wahlburgers\":\"4520\",\"Hunters\":\"4522\",\"Vanderpump Rules\":\"4523\",\"Mercy Street\":\"4524\",\"Heartbeat\":\"4526\",\"The Larry Sanders Show\":\"4527\",\"When We Left Earth: The NASA Missions\":\"4528\",\"Water Life\":\"4529\",\"Frozen Planet\":\"4531\",\"Dawn of The Croods\":\"4532\",\"Cooked\":\"4534\",\"Death in Paradise\":\"4535\",\"The War\":\"4536\",\"The World at War\":\"4537\",\"The Internet Ruined My Life\":\"4539\",\"Ajin\":\"4541\",\"Raised by Wolves\":\"4542\",\"Midsomer Murders\":\"4543\",\"Time Traveling Bong\":\"4544\",\"Girlfriends' Guide to Divorce\":\"4545\",\"Flowers\":\"4547\",\"World Without End\":\"4548\",\"Southland\":\"4549\",\"Ask This Old House\":\"4553\",\"Life After People\":\"4555\",\"UEL\":\"4558\",\"The Honourable Woman\":\"4559\",\"Miss Fisher's Murder Mysteries\":\"4562\",\"Shark (2015)\":\"4566\",\"Soredemo, Ikite Yuku\":\"4568\",\"Helt Perfekt\":\"4570\",\"Autumn's Concerto\":\"4572\",\"Eurovision Song Contest\":\"4573\",\"The Hours of My Life\":\"4575\",\"The Bride Mask\":\"4576\",\"Battle of Changsha\":\"4577\",\"Basta\":\"4578\",\"Chuno\":\"4580\",\"Descendants of the Sun\":\"4583\",\"Empress Ki\":\"4585\",\"Gaiji Keisatsu\":\"4586\",\"Great Teacher Onizuka (1998)\":\"4588\",\"Hakusen Nagashi\":\"4589\",\"For You In Full Blossom\":\"4590\",\"Underground\":\"4591\",\"Home Fires (2015)\":\"4592\",\"The Durrells\":\"4621\",\"Houdini & Doyle\":\"4622\",\"Two Doors Down\":\"4623\",\"Wynonna Earp\":\"4624\",\"Undercover (2016)\":\"4626\",\"Reba\":\"4627\",\"Nazi Megastructures\":\"4628\",\"Anne of Green Gables (1985)\":\"4629\",\"Six Flying Dragons\":\"4630\",\"Soldier\":\"4631\",\"Westside\":\"4632\",\"Boss (2011)\":\"4633\",\"Extras\":\"4636\",\"Marcella\":\"4637\",\"Property Brothers at Home on the Ranch\":\"4641\",\"Raising Hope\":\"4642\",\"Space's Deepest Secrets\":\"4644\",\"Shark Tank\":\"4646\",\"Sealab 2021\":\"4647\",\"Air Crash Investigation\":\"4648\",\"Preacher\":\"4649\",\"Billboard Music Awards\":\"4650\",\"Wolf Creek\":\"4652\",\"Pânico na Band\":\"4653\",\"Iron & Fire\":\"4655\",\"The Path\":\"4656\",\"The Red Tent\":\"4658\",\"Enlightened\":\"4659\",\"The Bridge\":\"4661\",\"Rake\":\"4662\",\"The Real Housewives of Dallas\":\"4663\",\"You Me Her\":\"4665\",\"A Bite of China\":\"4666\",\"Witless\":\"4667\",\"UFC Fight Night\":\"4668\",\"The Secret (2016)\":\"4669\",\"The 13 Ghosts of Scooby-Doo\":\"4670\",\"The Whitest Kids U Know\":\"4671\",\"Top Gear: Extra Gear\":\"4672\",\"Top Gear (US)\":\"4673\",\"Heartbeat (2016)\":\"4675\",\"Americas Got Talent\":\"4676\",\"The Detour\":\"4678\",\"Cleverman\":\"4679\",\"Roots: The Next Generations\":\"4680\",\"The Midwives\":\"4682\",\"Ocean Girl\":\"4683\",\"Room 101 (AU)\":\"4684\",\"Date a Live\":\"4685\",\"Game of Silence\":\"4686\",\"So You Think You Can Dance\":\"4689\",\"Roots (2016)\":\"4690\",\"UEFA Euro 2016\":\"4691\",\"Tomorrow When the War Began\":\"4692\",\"The Gong Show Movie\":\"4694\",\"Alan Davies: As Yet Untitled\":\"4697\",\"Uncle Buck (2016)\":\"4698\",\"Animal Kingdom (2016)\":\"4699\",\"Insane Clown Posse Theater\":\"4700\",\"Car SOS\":\"4701\",\"Doc Martin\":\"4702\",\"Outcast\":\"4703\",\"Bajillion Dollar Propertie$\":\"4704\",\"Submission\":\"4707\",\"Anne of Green Gables\":\"4708\",\"Jeopardy\":\"4710\",\"The Million Second Quiz\":\"4712\",\"Another Period\":\"4714\",\"Queen of the South\":\"4716\",\"Marseille\":\"4717\",\"The Biggest Loser\":\"4718\",\"Medium\":\"4719\",\"Difficult People\":\"4720\",\"Power Monkeys\":\"4722\",\"The Night Of\":\"4723\",\"R.L. Stine's The Haunting Hour\":\"4724\",\"City in the Sky\":\"4726\",\"The Girlfriend Experience\":\"4727\",\"Criminal Justice\":\"4728\",\"Cougar Town\":\"4729\",\"Guilt\":\"4730\",\"Containment\":\"4731\",\"BrainDead\":\"4732\",\"Comedy Bang! Bang!\":\"4733\",\"Dead of Summer\":\"4735\",\"Wrecked (2016)\":\"4736\",\"Feed The Beast\":\"4737\",\"The Living and the Dead\":\"4738\",\"American Gothic (2016)\":\"4739\",\"Murder Among Friends\":\"4740\",\"Lucha Underground\":\"4744\",\"Air Warriors\":\"4745\",\"Lie to Me\":\"4746\",\"Wimbledon\":\"4747\",\"Scream: The TV Series\":\"4749\",\"The Kettering Incident\":\"4750\",\"Private Eyes\":\"4751\",\"Locked Up\":\"4752\",\"Ancient Aliens\":\"4753\",\"Vice Does America\":\"4754\",\"Unearthed (2016)\":\"4755\",\"Airline\":\"4756\",\"SCTV Network 90\":\"4757\",\"Danger 5\":\"4758\",\"Roadies\":\"4760\",\"How It's Made\":\"4761\",\"The Making of The Mob\":\"4764\",\"Batman: The Animated Series\":\"4765\",\"Star Trek: Enterprise\":\"4766\",\"Bomb Girls\":\"4767\",\"Eureka Seven\":\"4768\",\"Man Down\":\"4769\",\"Stranger Things\":\"4770\",\"Dragon Ball Z\":\"4772\",\"The Lion Guard\":\"4774\",\"Big Love\":\"4775\",\"Animaniacs\":\"4776\",\"Forces of Nature with Brian Cox\":\"4777\",\"King of the Road\":\"4778\",\"Woman (2016)\":\"4779\",\"The Legend of Tarzan\":\"4780\",\"30 for 30\":\"4781\",\"New Blood\":\"4783\",\"VICE World of Sports\":\"4784\",\"Eden (2016)\":\"4785\",\"Journey to the edge of the Universe\":\"4786\",\"The Professionals\":\"4787\",\"Himalaya with Michael Palin\":\"4788\",\"Kingdom of Heaven\":\"4789\",\"The Men Who Made Us Thin\":\"4790\",\"The Adventures of Tintin\":\"4791\",\"Clinton Cash\":\"4792\",\"Barracuda\":\"4795\",\"Yes Minister\":\"4796\",\"Huang's World\":\"4798\",\"My Little Pony: Friendship is Magic\":\"4799\",\"The American West\":\"4800\",\"The Secret Agent (2016)\":\"4801\",\"Life on Earth\":\"4802\",\"Aladdin\":\"4803\",\"MADtv\":\"4804\",\"Nekomonogatari White\":\"4805\",\"Still the King\":\"4806\",\"Batman\":\"4807\",\"No Man Left Behind\":\"4808\",\"My Giant Life\":\"4809\",\"Hotel Hell\":\"4810\",\"Penn & Teller: Fool Us\":\"4811\",\"Miami Medical\":\"4812\",\"Serial Thriller\":\"4813\",\"Rio Summer Olympics 2016\":\"4814\",\"Friday Night Dinner\":\"4815\",\"Last Chance U\":\"4817\",\"Deep South Paranormal\":\"4819\",\"The Haunting Of\":\"4820\",\"Black Market\":\"4821\",\"Life or Debt\":\"4822\",\"The New Yorker Presents\":\"4823\",\"The Mole\":\"4825\",\"Lucky Luke\":\"4826\",\"The Osbournes\":\"4827\",\"Brief Encounters\":\"4830\",\"Transformers: Rescue Bots\":\"4832\",\"Degrassi: Next Class\":\"4834\",\"Morgan Spurlock: Inside Man\":\"4838\",\"The Spectacular Spider-Man\":\"4839\",\"Cyberwar\":\"4842\",\"Married at First Sight\":\"4844\",\"World's Busiest Railway\":\"4845\",\"Fleabag\":\"4846\",\"Police Ten 7\":\"4849\",\"Ghost Hunters\":\"4855\",\"7 Days (2009)\":\"4857\",\"The Dresden Files\":\"4859\",\"Now You See Me 2\":\"4860\",\"LEGO Star Wars: Droid Tales\":\"4861\",\"The Block\":\"4862\",\"Death Parade (2015)\":\"4863\",\"Marrying Mum and Dad\":\"4864\",\"Getting High For God?\":\"4865\",\"The Price Is Right\":\"4866\",\"Secret Eats with Adam Richman\":\"4867\",\"Regal Academy\":\"4868\",\"Bachelor in Paradise\":\"4870\",\"Mayday\":\"4872\",\"Wasted (2016)\":\"4874\",\"The Investigator: A British Crime Story\":\"4875\",\"Celebrity Big Brother\":\"4876\",\"Big Easy Motors\":\"4877\",\"FlashForward\":\"4878\",\"Pinky and the Brain\":\"4880\",\"The Kicks (2015)\":\"4882\",\"Ascension\":\"4883\",\"Wilfred\":\"4884\",\"Nev's Indian Call Centre\":\"4885\",\"Terminator: The Sarah Connor Chronicles\":\"4886\",\"Treme\":\"4888\",\"Little Women: LA\":\"4889\",\"Return to Amish\":\"4890\",\"Code 1\":\"4891\",\"Squidbillies\":\"4892\",\"Brad Neely's Harg Nallin Sclopio Peepio\":\"4893\",\"Ice Pilots NWT\":\"4894\",\"The Dog Ate My Homework\":\"4895\",\"Dead Set on Life\":\"4896\",\"D-Day in HD\":\"4898\",\"Friends With Benefits\":\"4899\",\"Chloe's Closet\":\"4900\",\"Hell House\":\"4901\",\"19-2 (2014)\":\"4902\",\"Pablo Escobar: El Patrón del Mal\":\"4903\",\"Looking\":\"4904\",\"Off Centre\":\"4905\",\"Iron Man: Armored Adventures\":\"4906\",\"Cosmos\":\"4907\",\"Deadly 60\":\"4908\",\"Charlie's Angels (2011)\":\"4909\",\"Apres Ski\":\"4911\",\"All Hail King Julien\":\"4912\",\"Atlanta\":\"4916\",\"Counting On\":\"4917\",\"Doctors\":\"4918\",\"Gardeners' World\":\"4919\",\"Harley and the Davidsons\":\"4920\",\"Facing\":\"4921\",\"Magic Hands\":\"4925\",\"Wataha\":\"4927\",\"Friday Night Tykes\":\"4929\",\"Better Things\":\"4931\",\"Quarry\":\"4934\",\"The Inbetweeners\":\"4935\",\"One Of Us\":\"4936\",\"Comedy Central Roasts\":\"4938\",\"Oliver Twist\":\"4939\",\"19-2\":\"4940\",\"Lethal Weapon\":\"4942\",\"Mega Shippers\":\"4946\",\"JonBenét: An American Murder Mystery\":\"4947\",\"The Exorcist\":\"4948\",\"Cuckoo\":\"4950\",\"Van Helsing\":\"4951\",\"Hillary\":\"4952\",\"Kevin Can Wait\":\"4953\",\"US Presidential Debates\":\"4954\",\"American Monster\":\"4955\",\"The Good Place\":\"4956\",\"Marvel's Luke Cage\":\"4957\",\"Murder: Did They Do It?\":\"4958\",\"Westworld\":\"4960\",\"Frequency\":\"4962\",\"Notorious\":\"4963\",\"Running Wild with Bear Grylls\":\"4964\",\"Victoria\":\"4965\",\"Our Girl\":\"4966\",\"Crisis in Six Scenes\":\"4967\",\"Catfish: The TV Show\":\"4968\",\"Timeless (2016)\":\"4969\",\"Deep Water\":\"4971\",\"Divorce\":\"4974\",\"One Mississippi\":\"4975\",\"Chance\":\"4976\",\"Goliath\":\"4977\",\"World's Most Dangerous Roads (2011)\":\"4978\",\"National Treasure\":\"4979\",\"BBC.Worlds.Most.Dangerous.Roads\":\"4980\",\"BBC World's Most Dangerous Roads\":\"4982\",\"Crunch Time\":\"4983\",\"http://www.imdb.com/title/tt0094982/\":\"4984\",\"Deadliest Catch: Dungeon Cove\":\"4985\",\"Class\":\"4986\",\"Son of Zorn\":\"4987\",\"Re:Zero Starting Life In Another World\":\"4988\",\"Shinsekai Yori - From The New World\":\"4989\",\"My Little Pony Friendship is Magic\":\"4990\",\"Flophouse\":\"4991\",\"Secrets of the Dead\":\"4992\",\"Edge of Alaska\":\"4995\",\"Pure Genius\":\"4996\",\"Do or Die\":\"4998\",\"Flat TV\":\"4999\",\"The Young Pope\":\"5000\",\"Haters Back Off\":\"5001\",\"Barbarians Rising\":\"5002\",\"Machines: How They Work\":\"5003\",\"Dinotopia\":\"5004\",\"Trailer Park Boys: Out of the Park\":\"5006\",\"Hinterland\":\"5007\",\"Neon Genesis Evangelion\":\"5008\",\"My Babysitter's a Vampire\":\"5009\",\"Resurrection\":\"5010\",\"Generation War\":\"5011\",\"Wild West - America's Great Frontier\":\"5012\",\"It's Always Sunny In Phiadelphia\":\"5015\",\"Shounen Maid\":\"5017\",\"Canada's Worst Driver\":\"5018\",\"Pet Medics\":\"5021\",\"Full Steam Ahead\":\"5022\",\"Medici: Masters of Florence\":\"5023\",\"High Maintenance (2016)\":\"5024\",\"The Crown\":\"5025\",\"The Victorian Slum\":\"5026\",\"Rob & Chyna\":\"5027\",\"I Survived\":\"5028\",\"The Outer Limits (1995)\":\"5029\",\"HIM\":\"5031\",\"The Moonstone (2016)\":\"5032\",\"Paranoid\":\"5033\",\"This is High School\":\"5034\",\"Shooter\":\"5035\",\"Dark Angel (2016)\":\"5036\",\"Hipster\":\"5037\",\"A Season With\":\"5038\",\"Eagleheart\":\"5039\",\"The Team\":\"5040\",\"The Grand Tour (2016)\":\"5041\",\"Dirty Sanchez\":\"5042\",\"America's Test Kitchen\":\"5043\",\"WAGs\":\"5044\",\"StartUp (2016)\":\"5046\",\"The Crusades: Crescent & the Cross\":\"5047\",\"Helppo elämä\":\"5049\",\"3 Percent\":\"5052\",\"Code Lyoko\":\"5053\",\"Don't Trust The B---- in Apartment 23\":\"5055\",\"Planet Earth II\":\"5057\",\"Weediquette\":\"5058\",\"Houdini\":\"5059\",\"Insecure\":\"5060\",\"Doctor Doctor (2016)\":\"5061\",\"This Is Us\":\"5062\",\"House of Saddam\":\"5063\",\"Mr. Show\":\"5064\",\"Gortimer Gibbon's Life on Normal Street\":\"5068\",\"Hikaru no Go\":\"5069\",\"Speed with Guy Martin\":\"5070\",\"Travelers (2016)\":\"5074\",\"Shut Eye\":\"5075\",\"Common As Muck\":\"5076\",\"Hip-Hop Evolution\":\"5077\",\"Pitch\":\"5078\",\"Hamilton's Pharmacopeia (2016)\":\"5079\",\"QI\":\"5080\",\"Wanted: Dead or Alive\":\"5081\",\"Spectral (2016)\":\"5083\",\"Matador\":\"5085\",\"Infomercials\":\"5086\",\"Kees & Co\":\"5087\",\"The Brokenwood Mysteries\":\"5089\",\"Rick Steves' Europe\":\"5091\",\"Touch\":\"5092\",\"Bull (2016)\":\"5094\",\"Rillington Place\":\"5095\",\"White Rabbit Project\":\"5096\",\"Channel Zero\":\"5097\",\"WAGS: Miami\":\"5098\",\"Vikingane\":\"5099\",\"Count Arthur Strong\":\"5100\",\"Spooks\":\"5101\",\"Graves\":\"5103\",\"Project Grizzly\":\"5104\",\"People of Earth\":\"5106\",\"Berlin Station\":\"5107\",\"Andromeda\":\"5108\",\"Äkta Människor\":\"5109\",\"Aftermath (2016)\":\"5110\",\"Continent 7: Antarctica\":\"5111\",\"1989-1990\":\"5112\",\"Incorporated\":\"5113\",\"Good Girls Revolt\":\"5114\",\"The OA\":\"5115\",\"Angel\":\"5116\",\"Jon Glaser Loves Gear\":\"5117\",\"Eyewitness (US)\":\"5118\",\"MasterChef: The Professionals\":\"5119\",\"Falling Water\":\"5120\",\"Fear Factor\":\"5121\",\"Svartsjön\":\"5122\",\"Revelation: The End of Days\":\"5125\",\"Hustle\":\"5128\",\"The Supervet\":\"5130\",\"Dirk Gently's Holistic Detective Agency\":\"5131\",\"Lip Service\":\"5132\",\"The Royle Family\":\"5133\",\"OutDaughtered\":\"5134\",\"Robot Wars (2016)\":\"5135\",\"A Haunting\":\"5136\",\"Close to the Enemy\":\"5138\",\"Walliams & Friend\":\"5139\",\"Conviction (2016)\":\"5142\",\"The Mick\":\"5143\",\"Home Improvement\":\"5145\",\"The Flintstones\":\"5146\",\"Monty Python's Flying Circus\":\"5147\",\"Home Movies\":\"5148\",\"Beyond\":\"5149\",\"Tinker Tailor Soldier Spy\":\"5151\",\"Inside the Gangsters' Code\":\"5152\",\"Royal Institution Christmas Lectures\":\"5153\",\"Drew Carey's Improvaganza\":\"5157\",\"Broken Trail\":\"5158\",\"The Scooby-Doo Show\":\"5160\",\"3 Lbs\":\"5162\",\"Kidnap and Ransom\":\"5163\",\"Xena: Warrior Princess\":\"5164\",\"Spartacus: Gods of the Arena\":\"5165\",\"Pure\":\"5166\",\"The Vet Life\":\"5167\",\"Our Big Blue Backyard\":\"5168\",\"Maigret (2016)\":\"5170\",\"M*A*S*H\":\"5171\",\"Dr. Katz, Professional Therapist\":\"5172\",\"Blood Road Bomb Squad\":\"5173\",\"Women in Prison (2015)\":\"5174\",\"Long Lost Family (US)\":\"5175\",\"Good Behavior\":\"5176\",\"Rovers\":\"5177\",\"Taboo (2017)\":\"5179\",\"No Tomorrow\":\"5180\",\"Star\":\"5181\",\"Nightcap\":\"5182\",\"Spies (2017)\":\"5185\",\"MacGyver (2016)\":\"5188\",\"Emerald City\":\"5189\",\"Chicago Hope\":\"5190\",\"A Series of Unfortunate Events\":\"5192\",\"Sneaky Pete\":\"5193\",\"Magnum, P.I.\":\"5194\",\"Full Circle\":\"5195\",\"SuperMansion\":\"5196\",\"American Housewife\":\"5198\",\"Das Boot\":\"5199\",\"Hollywood & Football\":\"5202\",\"SIX\":\"5203\",\"The Great Indoors\":\"5205\",\"Ice Road Truckers\":\"5206\",\"FETCH! With Ruff Ruffman\":\"5208\",\"Big Night Out\":\"5209\",\"Six Degrees of Murder\":\"5210\",\"Killer Instinct with Chris Hansen\":\"5211\",\"Disappeared\":\"5212\",\"Bar Rescue\":\"5214\",\"Nobel\":\"5215\",\"The Incredible Hulk\":\"5216\",\"The Level\":\"5217\",\"Frontier (2016)\":\"5218\",\"Spin City\":\"5220\",\"Bella and the Bulldogs\":\"5222\",\"Viva La Bam\":\"5223\",\"Riverdale\":\"5224\",\"Xiaolin Showdown\":\"5225\",\"Borgia\":\"5226\",\"Dungeons & Dragons\":\"5227\",\"The Twilight Zone\":\"5228\",\"Beat Bugs\":\"5230\",\"Z: The Beginning of Everything\":\"5231\",\"The Wrong Girl\":\"5234\",\"The A-Team\":\"5235\",\"The Paradise\":\"5236\",\"The Almighty Johnsons\":\"5237\",\"The Golden Girls\":\"5239\",\"Training Day\":\"5240\",\"Blade: The Series\":\"5242\",\"CSI Cyber\":\"5244\",\"Friday The 13th\":\"5245\",\"Friday the 13th: The Series\":\"5246\",\"Everest Rescue\":\"5247\",\"DragonBall\":\"5248\",\"Tru Calling\":\"5249\",\"24: Legacy\":\"5251\",\"Wings\":\"5253\",\"Vice News Tonight\":\"5254\",\"Superior Donuts\":\"5256\",\"Man with a Plan\":\"5258\",\"APB\":\"5261\",\"Wonderfalls\":\"5262\",\"Imposters\":\"5263\",\"Witchblade\":\"5267\",\"The Pillars of the Earth\":\"5268\",\"Xavier: Renegade Angel\":\"5269\",\"King of the Nerds\":\"5270\",\"Jeremiah\":\"5271\",\"Legion\":\"5272\",\"Borderline (2016)\":\"5273\",\"Bering Sea Gold\":\"5275\",\"Last Call with Carson Daly\":\"5279\",\"Emmerdale\":\"5281\",\"The Fake News Show\":\"5283\",\"Just Add Magic\":\"5287\",\"Counterfeit Cat\":\"5288\",\"Bizaardvark\":\"5290\",\"HarmonQuest\":\"5291\",\"The Challenge\":\"5292\",\"Who Wants to Be a Millionaire\":\"5297\",\"Powerless\":\"5298\",\"The Jump (2016)\":\"5299\",\"Dragons' Den\":\"5300\",\"Firsthand (2015)\":\"5302\",\"Marchlands\":\"5303\",\"Lightfields\":\"5304\",\"Lion Man: One World African Safari\":\"5305\",\"Single by 30\":\"5306\",\"Top Chef\":\"5307\",\"Live PD\":\"5308\",\"British History's Biggest Fibs with Lucy Worsley\":\"5312\",\"Delete, Delete, Delete\":\"5313\",\"The Great Pottery Throw Down\":\"5314\",\"Revolting\":\"5317\",\"Bong Appetit\":\"5318\",\"Madiba\":\"5321\",\"Triumph\":\"5328\",\"Coronation Street\":\"5330\",\"The Collection\":\"5333\",\"Ghosts in the Hood\":\"5336\",\"Stuck in the Middle\":\"5337\",\"Tyler Perry's The Haves and the Have Nots\":\"5339\",\"Ginormous Food\":\"5340\",\"The Rap Game\":\"5342\",\"The Talk\":\"5343\",\"Cajun Pawn Stars\":\"5344\",\"Let's Make A Deal\":\"5345\",\"Great American Railroad Journeys\":\"5347\",\"Chewing Gum\":\"5348\",\"Bionic Woman (2007)\":\"5351\",\"Droned\":\"5352\",\"Bear Grylls' Survival School\":\"5353\",\"This Old House\":\"5354\",\"I Escaped to the Country\":\"5356\",\"Rip Off Britain: Holidays\":\"5358\",\"Cherif\":\"5361\",\"Flog it\":\"5362\",\"Flog it: Trade Secrets\":\"5363\",\"NJPW on Samurai TV\":\"5364\",\"Only Connect\":\"5365\",\"Jade Fever\":\"5366\",\"Ghost Adventures\":\"5368\",\"The Pioneer Woman\":\"5369\",\"Private Sales\":\"5370\",\"Africa's Predator Zones\":\"5372\",\"Ninja Warrior UK\":\"5375\",\"Hotel of Mum and Dad\":\"5376\",\"24 CH\":\"5377\",\"Den fördömde\":\"5379\",\"Diners, Drive-ins and Dives\":\"5380\",\"Mind Field\":\"5382\",\"Power Rangers\":\"5383\",\"It Takes a Killer\":\"5384\",\"MythBusters: The Search\":\"5386\",\"Detroit Steel\":\"5387\",\"LEGO Nexo Knights\":\"5388\",\"Birds of Prey\":\"5389\",\"Chasing Conspiracies\":\"5391\",\"Evil Lives Here\":\"5393\",\"Yo-kai Watch\":\"5394\",\"Paranormal Lockdown\":\"5395\",\"Murder Calls\":\"5397\",\"Mickey and the Roadster Racers\":\"5399\",\"Independent Lens\":\"5401\",\"Ice Cold Killers\":\"5402\",\"I, Witness\":\"5403\",\"Country Calendar\":\"5405\",\"Charlie Jade\":\"5406\",\"Invasion\":\"5409\",\"Famously Single\":\"5410\",\"Crazyhead\":\"5411\",\"Kuu Kuu Harajuku\":\"5416\",\"House Husbands\":\"5417\",\"AmeriCARna\":\"5419\",\"Maine Cabin Masters\":\"5420\",\"First Time Flippers\":\"5421\",\"Jail\":\"5422\",\"Project Runway Junior\":\"5423\",\"Arthur\":\"5424\",\"Monica the Medium\":\"5425\",\"Street Science\":\"5426\",\"Beau Séjour\":\"5427\",\"Reizen Waes\":\"5428\",\"Fish Hooks\":\"5431\",\"Aussie Gold Hunters\":\"5432\",\"Newton's Law\":\"5434\",\"My 600-lb Life\":\"5436\",\"Codes and Conspiracies\":\"5437\",\"Ice\":\"5438\",\"Point Pleasant\":\"5439\",\"Fair Go\":\"5440\",\"Boundless\":\"5441\",\"Steampunk'd\":\"5443\",\"Loch Lomond: A Year in the Wild\":\"5444\",\"Getaways\":\"5452\",\"60 Minutes Sports\":\"5457\",\"Billion Dollar Buyer\":\"5461\",\"Match Game (2016)\":\"5464\",\"I Live With Models\":\"5465\",\"The Big Painting Challenge\":\"5466\",\"Justice League Action\":\"5467\",\"Sicily: The Wonder of the Mediterranean\":\"5470\",\"Escape to the Country\":\"5471\",\"Bitchin' Rides\":\"5478\",\"Booze Traveler\":\"5480\",\"How to Live with Your Parents\":\"5484\",\"Summer House\":\"5487\",\"800 Words\":\"5488\",\"Alan Carr's 12 Stars of Christmas\":\"5489\",\"Hate Thy Neighbor\":\"5490\",\"Gilligan's Island\":\"5491\",\"Wicked Tuna: Outer Banks\":\"5492\",\"Deadly Islands\":\"5493\",\"Father Brown (2013)\":\"5494\",\"Skam\":\"5495\",\"Bravest Warriors\":\"5497\",\"Ugly Betty\":\"5500\",\"Knight Rider\":\"5501\",\"Vice Principals\":\"5502\",\"Roswell\":\"5503\",\"Commando Cody\":\"5505\",\"Patagonia: Earth's Secret Paradise\":\"5506\",\"The Henry Rollins Show\":\"5507\",\"Apple Tree Yard\":\"5508\",\"Hooten & the Lady\":\"5509\",\"Santa Clarita Diet\":\"5512\",\"Tokyo Trial\":\"5513\",\"The Halcyon\":\"5515\",\"Case\":\"5516\",\"Spaced\":\"5518\",\"The Blacklist Redemption\":\"5520\",\"Sweet/Vicious\":\"5521\",\"No Offence\":\"5522\",\"The Legend of the Blue Sea\":\"5523\",\"F*ck, That's Delicious\":\"5524\",\"Kim's Convenience\":\"5525\",\"The Last Leg\":\"5526\",\"Designated Survivor\":\"5527\",\"Patriot (2017)\":\"5528\",\"Save My Life: Boston Trauma\":\"5529\",\"Lonesome Dove\":\"5530\",\"Taken\":\"5534\",\"Full House\":\"5536\",\"Cardinal\":\"5541\",\"Bellevue\":\"5542\",\"PJ Masks\":\"5544\",\"Byzantium: A Tale of Three Cities\":\"5545\",\"Long Way Down\":\"5546\",\"Te Radar's Chequered Past\":\"5547\",\"Follow The Money\":\"5551\",\"Chasing Classic Cars\":\"5552\",\"Bunk'd\":\"5555\",\"Beyblade\":\"5557\",\"Pointless Celebrities\":\"5559\",\"Gogglebox Australia\":\"5560\",\"SS-GB\":\"5562\",\"Robot Wars\":\"5564\",\"Making History\":\"5565\",\"Big Little Lies\":\"5566\",\"Chicago Justice\":\"5567\",\"FEUD\":\"5568\",\"Sesame Street\":\"5569\",\"Mama June: From Not to Hot\":\"5571\",\"Home and Away\":\"5574\",\"The High Court\":\"5575\",\"Time After Time (2017)\":\"5577\",\"Crashing\":\"5579\",\"Mary Berry Everyday\":\"5581\",\"Love & Hip Hop: Atlanta\":\"5583\",\"Australian Story\":\"10463\",\"The Breaks\":\"5589\",\"Believer with Reza Aslan\":\"5590\",\"Timber Kings\":\"5591\",\"Days of Our Lives\":\"5592\",\"First Contact\":\"5593\",\"When We Rise\":\"5598\",\"Workin' Moms\":\"5602\",\"Detroiters\":\"5604\",\"Throwing Shade\":\"5605\",\"Uncensored With Michael Ware\":\"5606\",\"Long Island Medium\":\"5608\",\"Jeff & Some Aliens\":\"5610\",\"Play to the Whistle\":\"5612\",\"The Secret Chef\":\"5614\",\"This Hour Has 22 Minutes\":\"5616\",\"Stranded with a Million Dollars\":\"5617\",\"The Worst Witch\":\"5619\",\"Money for Nothing\":\"5620\",\"Benidorm\":\"5621\",\"Drunk History (UK)\":\"5622\",\"Speechless\":\"5624\",\"Destination Flavour Singapore\":\"5625\",\"F1 Legends\":\"5626\",\"Little Big Shots (UK)\":\"5629\",\"The Pop Game\":\"5630\",\"The Incredible Dr. Pol\":\"5634\",\"This Country\":\"5636\",\"Time: The Kalief Browder Story\":\"5638\",\"Gap Year\":\"5639\",\"Harry Hill's Alien Fun Capsule\":\"5643\",\"The Great British Benefits Handout\":\"5644\",\"60 Days In\":\"5645\",\"Nirvanna the Band the Show\":\"5646\",\"The Quad\":\"5649\",\"Fangbone!\":\"5651\",\"Ghost Brothers\":\"5652\",\"Volcanic Odysseys\":\"5657\",\"Sun Records\":\"5659\",\"Elena of Avalor\":\"5661\",\"Selling Houses Australia\":\"5674\",\"Clique\":\"5677\",\"Grand Designs\":\"5678\",\"Ant and Dec's Saturday Night Takeaway\":\"5679\",\"Andi Mack\":\"5680\",\"The Good Fight\":\"5681\",\"Supercar Superbuild\":\"5684\",\"JoJo's Bizarre Adventure\":\"5685\",\"Real Detective\":\"5686\",\"Americas Test Kitchen\":\"5688\",\"Murder Comes To Town\":\"5689\",\"Hunter Street\":\"5690\",\"Trollhunters\":\"5691\",\"Catfish\":\"5699\",\"Snatch\":\"5701\",\"Greenleaf\":\"5702\",\"Marvel's Iron Fist\":\"5704\",\"MasterChef Canada\":\"5705\",\"The Loud House\":\"5707\",\"Beautiful Mind\":\"5708\",\"Britain's Busiest Motorway\":\"5711\",\"Hip Hop Squares\":\"5712\",\"Gundam Build Fighters\":\"5714\",\"Little House on the Prairie\":\"5715\",\"My Love Story\":\"5717\",\"Oasis\":\"5720\",\"Boston EMS\":\"5723\",\"Anne\":\"5725\",\"Hunter X Hunter\":\"5727\",\"Port Protection\":\"5729\",\"The Art of\":\"5731\",\"Police Interceptors\":\"5732\",\"Tattoo Age\":\"5739\",\"The Real Housewives of Sydney\":\"5740\",\"Graveyard Carz\":\"5747\",\"Nobodies\":\"5748\",\"Parched\":\"5749\",\"The Comedy Jam\":\"5754\",\"Cosplay Melee\":\"5755\",\"Dave Chappelle\":\"5757\",\"Big Brother Canada\":\"5759\",\"shots fired\":\"5760\",\"You Are Wanted\":\"5761\",\"Origins: The Journey of Humankind\":\"5762\",\"Three Wives, One Husband\":\"5764\",\"Mary Kills People\":\"5766\",\"Game of Stones\":\"5767\",\"Filthy Rich (2016)\":\"5768\",\"Chopped Junior\":\"5769\",\"Real Vikings\":\"5771\",\"Hunted (US)\":\"5772\",\"Modus\":\"5773\",\"Uncle\":\"5774\",\"Judge Rinder's Crime Stories\":\"5779\",\"All Round to Mrs Brown's\":\"5782\",\"The Faculty\":\"5783\",\"Say Yes To The Dress\":\"5785\",\"Bunsen is a Beast!\":\"5787\",\"The Perfect Murder\":\"5788\",\"Todd Sampson's Life on the Line\":\"5791\",\"Dream Gardens\":\"5792\",\"Little Big Shots\":\"5794\",\"Who Do You Think You Are? (US)\":\"5795\",\"The Circus\":\"5797\",\"Amazing Hotels: Life Beyond the Lobby\":\"5799\",\"Brockmire\":\"5802\",\"Pawn Stars Pumped Up\":\"5803\",\"Invicta FC\":\"5807\",\"Little Women: Atlanta\":\"5811\",\"Rebel\":\"5812\",\"NCAA Basketball\":\"5813\",\"Spring Break With Grandad\":\"5814\",\"Adam Carolla and Friends Build Stuff Live\":\"5815\",\"Legends Of The Hidden Temple\":\"5817\",\"Goof Troop\":\"5818\",\"Jungletown\":\"5820\",\"Stargazing Live\":\"5821\",\"The Repair Shop\":\"5822\",\"Fugitives\":\"5823\",\"Harlots\":\"5824\",\"MasterChef\":\"5825\",\"Imaginary Mary\":\"5828\",\"Lopez\":\"5829\",\"DIY SOS\":\"5833\",\"8 Simple Rules\":\"5834\",\"Bryan Inc.\":\"5835\",\"Inside West Coast Customs\":\"5836\",\"Guy's Grocery Games\":\"5837\",\"Rich House, Poor House\":\"5840\",\"Decline and Fall\":\"5842\",\"Canada: The Story of Us\":\"5843\",\"13 Reasons Why\":\"5844\",\"Demolition Man\":\"5845\",\"Carters Get Rich\":\"5846\",\"Hibana: Spark\":\"5848\",\"EPL\":\"5850\",\"Gold Rush: Parker's Trail\":\"5852\",\"George Lopez\":\"5853\",\"Million Dollar Cold Case\":\"5854\",\"All Round To Mrs Browns\":\"5855\",\"The House That £100k Built\":\"5856\",\"Match of the Day\":\"5858\",\"The Secrets of Your Food\":\"5859\",\"Motorway Patrol\":\"5862\",\"Victorious\":\"5863\",\"The After Party\":\"5864\",\"The Real Housewives of Potomac\":\"5865\",\"Turkey with Simon Reeve\":\"5866\",\"Castle\":\"5870\",\"Million Dollar Listing Los Angeles\":\"5877\",\"The Graham Norton Show\":\"5879\",\"Dimension 404\":\"5880\",\"Five Came Back\":\"5881\",\"Southern Charm\":\"5882\",\"Spying on the Royals\":\"5883\",\"What Would Sal Do?\":\"5884\",\"Ingobernable\":\"5885\",\"The Powerpuff Girls (2016)\":\"5887\",\"Gilmore Girls: A Year in the Life\":\"5889\",\"Inside...\":\"5891\",\"The Arrangement (2017)\":\"5893\",\"Shaun the sheep\":\"5894\",\"Terriers\":\"5895\",\"Child of Our Time\":\"5896\",\"Wild Germany\":\"5897\",\"On the Case With Paula Zahn\":\"5900\",\"Comedy Crib The Show\":\"5902\",\"POV\":\"5903\",\"One Night with My Ex\":\"5905\",\"One Born Every Minute\":\"5906\",\"The Chefs\":\"5907\",\"Terrace House: Aloha State\":\"5908\",\"When Kids Kill\":\"5909\",\"Impossible Engineering\":\"5910\",\"The Get Down\":\"5911\",\"Blaze and the Monster Machines\":\"5912\",\"American Playboy: The Hugh Hefner Story\":\"5913\",\"Prime Suspect 1973\":\"5914\",\"The Son\":\"5919\",\"THE TOY BOX\":\"5927\",\"Sons of Liberty\":\"5928\",\"The Checkout\":\"5929\",\"Billy the Exterminator\":\"5932\",\"The Gorburger Show\":\"5933\",\"Talking with Chris Hardwick\":\"5936\",\"Warship\":\"5937\",\"Dirt Every Day\":\"5940\",\"Road Hauks\":\"5941\",\"Dicte\":\"5943\",\"The Proud Family\":\"5944\",\"Jamie Johnson\":\"5945\",\"Hollywood Darlings\":\"5949\",\"HOT ROD Garage\":\"5950\",\"Neo Magazin Royale\":\"5951\",\"Bucket\":\"5954\",\"Seven Types of Ambiguity\":\"5955\",\"The Silk Road\":\"5958\",\"You Can't Ask That\":\"5960\",\"Roadkill\":\"5961\",\"Underbelly\":\"5962\",\"Wild Kratts\":\"5964\",\"WordWorld\":\"5967\",\"Flip or Flop\":\"5968\",\"Chelsea\":\"5969\",\"You The Jury\":\"5970\",\"Vegas Rat Rods\":\"5971\",\"Building The Worlds Most Luxurious Cruise Ship\":\"5972\",\"Eve\":\"5975\",\"Nate and Jeremiah by Design\":\"5980\",\"Maigret\":\"5985\",\"Mystery Science Theater 3000\":\"5986\",\"Hero Factory\":\"5987\",\"Guerrilla\":\"5988\",\"MECH-X4\":\"5989\",\"Freakish\":\"5990\",\"Franklin and Friends\":\"5991\",\"Iron Chef Gauntlet\":\"5992\",\"The White Princess\":\"5994\",\"Talk Show the Game Show\":\"5995\",\"Garden Rescue\":\"5996\",\"Our Friend Victoria\":\"5999\",\"Kings of Atlantis\":\"6000\",\"Famous in Love\":\"6001\",\"Dog Squad (NZ)\":\"6002\",\"Cooper's Treasure\":\"6003\",\"Problematic with Moshe Kasher\":\"6005\",\"The Deleted\":\"6006\",\"Murder in Successville\":\"6007\",\"Trial & Error (2017)\":\"6009\",\"Tiny House Hunters\":\"6010\",\"Confessions of a Junior Doctor\":\"6013\",\"Taskmaster\":\"6014\",\"Puppy Dog Pals\":\"6015\",\"Magic Funhouse\":\"6016\",\"Dictatorland\":\"6017\",\"Nature's Weirdest Events\":\"6019\",\"Hockey Wives\":\"6020\",\"Born to Kill\":\"6023\",\"Inspector De Luca\":\"6026\",\"Girlboss\":\"6027\",\"Secret Britain\":\"6028\",\"O Negocio\":\"6029\",\"Holliston\":\"6030\",\"Hospital People\":\"6031\",\"Hot Girls Wanted: Turned On\":\"6032\",\"Hogan's Heroes\":\"6033\",\"NASA's Unexplained Files\":\"6035\",\"Queen Sugar\":\"6037\",\"Basketball Wives\":\"6040\",\"Rise\":\"6041\",\"Wild Japan\":\"6043\",\"Return of the Mac\":\"6047\",\"I'm Different: Let Me Drive\":\"6048\",\"Dani's Castle\":\"6049\",\"Rusty Rivets\":\"6051\",\"Little Boy Blue\":\"6055\",\"Fire Island\":\"6056\",\"Iron Chef Eats\":\"6058\",\"Silk\":\"6059\",\"The Handmaid's Tale\":\"6060\",\"Dr. Quinn, Medicine Woman\":\"6061\",\"Great News\":\"6063\",\"Business of Life\":\"6064\",\"Conquering Southern China\":\"6065\",\"Seven Year Switch\":\"10273\",\"Des Bishop: Breaking China\":\"6067\",\"Bill Nye Saves the World\":\"6068\",\"Little Women: Dallas\":\"6069\",\"Great Teacher Onizuka\":\"6070\",\"Inside the FBI: New York\":\"6071\",\"Beerland\":\"6072\",\"Dear White People\":\"6073\",\"Joanna Lumley's Postcards\":\"6074\",\"Divorce (2016)\":\"6076\",\"Mad Jack the Pirate\":\"6077\",\"The President Show\":\"6079\",\"Tent and Sex\":\"6080\",\"Damned\":\"6081\",\"Below Deck\":\"6082\",\"Cruising with Jane McDonald\":\"6085\",\"Happily Ever After?\":\"6086\",\"Undercover Boss (US)\":\"6087\",\"America's.Test.Kitchen\":\"6091\",\"Dragons' Den UK\":\"6092\",\"Grand Designs Australia\":\"6094\",\"American Gods\":\"6096\",\"Are You The One: Second Chances\":\"6098\",\"Line of Duty\":\"6099\",\"Family Feud (NZ)\":\"6100\",\"United Shades of America\":\"6103\",\"El Chapo\":\"6104\",\"Lovesick\":\"6106\",\"The Wanted\":\"6107\",\"Taken (2017)\":\"6110\",\"Real Sports with Bryant Gumbel\":\"6111\",\"#HoodDocumentary\":\"6113\",\"Great Escapes of WWII\":\"6115\",\"Twiz & Tuck\":\"6116\",\"Say Yes To The Dress Randy Knows Best\":\"6117\",\"Curvy Brides\":\"6118\",\"Rip Off Britain\":\"6122\",\"Smart Guy\":\"6123\",\"Henry IX\":\"6124\",\"Chris Harris on Cars\":\"6127\",\"Girl Starter\":\"6128\",\"Car Crash Britain: Caught on Camera\":\"6129\",\"The Tomorrow People (US)\":\"6130\",\"Second Wives Club\":\"10516\",\"An Art Lovers' Guide\":\"6135\",\"Jamestown\":\"6136\",\"Britain Today Tonight\":\"6137\",\"Great British Menu\":\"6138\",\"Tanglin\":\"6139\",\"Game Changers\":\"6144\",\"Martha Bakes\":\"6147\",\"JFK Declassified: Tracking Oswald\":\"6149\",\"The Keith and Paddy Picture Show\":\"6151\",\"My Cat From Hell\":\"6153\",\"Marvel's Rocket & Groot\":\"6154\",\"Queer Britain\":\"6155\",\"The Naked Choir NZ\":\"6156\",\"Raw Travel\":\"6158\",\"Dara and Ed's Road to Mandalay\":\"6159\",\"Intervention\":\"6160\",\"Brown Nation\":\"6163\",\"How 2 Win\":\"6164\",\"Genius (2017)\":\"6165\",\"Ground Floor\":\"6166\",\"Loaded\":\"6167\",\"The Therapist\":\"6168\",\"The Amazing Spider-Man\":\"6169\",\"MTV Movie Awards\":\"6171\",\"Below Deck Mediterranean\":\"6172\",\"Elizabeth I\":\"6174\",\"Dr. Miami\":\"6176\",\"A1: Britain's Longest Road\":\"6177\",\"4 Blocks\":\"6179\",\"Nitro Circus Live\":\"6184\",\"Britain's Busiest Airport Heathrow\":\"6185\",\"Debatable\":\"6186\",\"Morocco To Timbuktu: An Arabian Adventure\":\"6187\",\"I Love Dick\":\"6188\",\"Million Dollar Shoppers\":\"6194\",\"Nostradamus Effect\":\"6195\",\"The Real Story with Maria Elena Salinas\":\"6196\",\"Saint George\":\"6197\",\"The Aussie Property Flippers\":\"6198\",\"Autopsy\":\"6199\",\"Ancient Assassins\":\"6200\",\"F1\":\"6202\",\"The Story of God with Morgan Freeman\":\"6206\",\"Inside the Freemasons\":\"6207\",\"We the Fans\":\"6208\",\"Inside the gang\":\"6209\",\"Year Million\":\"6210\",\"The House Of Muscle\":\"6211\",\"Cold Case\":\"6214\",\"Britains Got Talent\":\"6215\",\"Three Girls\":\"6216\",\"Downward Dog\":\"6218\",\"Gutsful\":\"6223\",\"Hipsters\":\"6226\",\"Redwater\":\"6228\",\"Backyard Goldmine\":\"6230\",\"Space Above and Beyond\":\"6231\",\"The Keepers\":\"6232\",\"Time Trax\":\"6233\",\"Crusoe\":\"6235\",\"Undeclared\":\"6237\",\"Seaquest\":\"6239\",\"Digits\":\"6241\",\"Samurai Girl\":\"6243\",\"The Munsters\":\"6244\",\"I Love Lucy\":\"6245\",\"Hear No Evil\":\"6247\",\"Right Now Kapow\":\"6250\",\"No Activity\":\"6252\",\"The Trial: A Murder in the Family\":\"6255\",\"Neverland\":\"6258\",\"I'm Dying Up Here\":\"6259\",\"Frisky Dingo\":\"6260\",\"The Many Loves of Dobie Gillis\":\"6261\",\"Terrahawks\":\"6262\",\"The Last Resort (AU)\":\"6263\",\"Legend Hunter\":\"6264\",\"Deep Time History\":\"6265\",\"Saenai Heroine no Sodatekata\":\"6267\",\"The Fifteen Billion Pound Railway\":\"6270\",\"Noragami\":\"6272\",\"Noragami Aragoto\":\"6273\",\"Covert Affairs\":\"6274\",\"Gakkou Gurashi\":\"6275\",\"Hooten And The Lady\":\"6278\",\"Head 2 Head\":\"6279\",\"Captain Caveman & the Teen Angels\":\"6280\",\"Truth & Iliza\":\"6281\",\"Wheel Of Fortune\":\"6283\",\"Rob and Chyna\":\"6286\",\"Rip Off Britain Live\":\"6287\",\"White Gold\":\"6288\",\"Jinsei\":\"6290\",\"Britain's Busiest Airport – Heathrow\":\"6291\",\"Transformers\":\"6292\",\"Geordie Shore\":\"6293\",\"Bad Judge\":\"6295\",\"Speed Is the New Black\":\"6296\",\"Sarabhai vs Sarabhai\":\"6297\",\"The Shadow Line\":\"6298\",\"Record Of Lodoss War (1990)\":\"6302\",\"Building Alaska\":\"6303\",\"Dirty Dancing\":\"6304\",\"Human Giant\":\"6305\",\"Janet King\":\"6306\",\"666 Park Avenue\":\"6309\",\"Buffy the Vampire Slayer\":\"6312\",\"Out of Practice\":\"6313\",\"Earth Final Conflict\":\"6314\",\"Paula\":\"6316\",\"Bakers vs. Fakers\":\"6317\",\"Dr. Phil\":\"6318\",\"TMZ on TV\":\"6320\",\"Cold Case Files\":\"6321\",\"Love Connection\":\"6323\",\"Moltissimo\":\"6324\",\"Spirit: Riding Free\":\"6325\",\"Kitchen Nightmares (US)\":\"6327\",\"Black Widows\":\"6328\",\"Secrets of the Manor House\":\"6329\",\"All Access: Quest for the Stanley Cup\":\"6332\",\"Live PD: Police Patrol\":\"6333\",\"Femme Fatales\":\"6334\",\"2 stupid dogs\":\"6337\",\"Aeon Flux\":\"6338\",\"ALF\":\"6340\",\"My Super Sweet 16\":\"6341\",\"Frasier\":\"6342\",\"JAG\":\"6344\",\"We Bought the Farm\":\"6346\",\"Go Jetters\":\"6347\",\"Roman Empire: Reign of Blood\":\"6348\",\"Party Legends\":\"6352\",\"Doogie Howser, M.D.\":\"6355\",\"The Life Swap Adventure\":\"6356\",\"Psi\":\"6357\",\"The Addams Family\":\"6358\",\"Expedition Mungo\":\"6359\",\"Countryfile\":\"6360\",\"Metalocalypse\":\"6361\",\"Charmed\":\"6362\",\"The Nerdist\":\"6363\",\"Ally McBeal\":\"6366\",\"Spin\":\"6367\",\"Unbreakable Machine-Doll\":\"6368\",\"Born to Kill (2017)\":\"6369\",\"Back to the Future Animated Series\":\"6370\",\"Baywatch\":\"6371\",\"Still Star-Crossed\":\"6372\",\"Taking Fire\":\"6373\",\"Teen Mom\":\"6376\",\"FantomWorks\":\"6383\",\"World of Dance\":\"6384\",\"Inside the American Mob\":\"6387\",\"The Royal\":\"6390\",\"The Great Fire\":\"6391\",\"The Joy of Techs\":\"6392\",\"The F Word (US)\":\"6394\",\"Wanna Be the Strongest in the World\":\"6398\",\"Roadkill Garage\":\"6399\",\"High School DxD\":\"6400\",\"Aria: The Animation\":\"6401\",\"Black Dynamite\":\"6402\",\"Go 8 Bit DLC\":\"6404\",\"Foster's Home for Imaginary Friends\":\"6405\",\"Sword Art Online\":\"6407\",\"Beat Shazam\":\"6410\",\"Hijacked\":\"6411\",\"Cyrus vs. Cyrus: Design and Conquer\":\"6412\",\"Henry Hugglemonster\":\"6413\",\"Good Morning, Miami\":\"6414\",\"Father Ted\":\"6415\",\"Pee Wee's Playhouse\":\"6418\",\"Moonlighting\":\"6419\",\"American Gangster\":\"6420\",\"Tremors\":\"6421\",\"Edgemont\":\"6422\",\"The Fresh Prince of Bel-Air\":\"6423\",\"Jack & Bobby\":\"6424\",\"The Zoo (2017)\":\"6425\",\"Snapped\":\"6427\",\"The Next Food Network Star\":\"6428\",\"Dream Coder\":\"6429\",\"Fighter of the Destiny\":\"6430\",\"Decker\":\"6431\",\"Here Come The Habibs!\":\"6432\",\"Ultimate Beastmaster\":\"6433\",\"Planet Earth II 2016\":\"6434\",\"John Oliver's New York Stand-Up Show\":\"6435\",\"24 Hours in Police Custody\":\"6436\",\"Long Strange Trip\":\"6438\",\"Big Brother (UK)\":\"6439\",\"Tyler Perry's For Better or Worse\":\"6440\",\"Daytime Divas\":\"6441\",\"Key & Peele\":\"6443\",\"Michael: Every Day\":\"6446\",\"Dirty Sexy Money\":\"6447\",\"The Devil Is a Part-Timer!\":\"6448\",\"Man, Fire, Food\":\"6449\",\"The Chillenden Murders\":\"6450\",\"The Jim Jefferies Show\":\"6451\",\"Captive\":\"6453\",\"Top Cat\":\"6454\",\"Date My Dad\":\"6455\",\"Devil's Canyon\":\"6457\",\"The Profit\":\"6458\",\"Tales By Light\":\"6461\",\"Ackley Bridge\":\"6463\",\"Ozzy and Jack's World Detour\":\"6464\",\"Cutthroat Kitchen\":\"6465\",\"Where the Heart Is\":\"6466\",\"Guy Court\":\"6467\",\"Eat Well for Less\":\"6471\",\"Berserk 1997\":\"6473\",\"Mock the Week\":\"6474\",\"Frankie Boyle's New World Order\":\"6475\",\"Cupid\":\"6476\",\"American Boyband\":\"6477\",\"Blade\":\"6478\",\"Histeria!\":\"6479\",\"Le Mans: Racing is Everything\":\"6480\",\"Drop Dead Gorgeous\":\"6483\",\"Sense and Sensibility 2008\":\"6484\",\"Clarence (2014)\":\"6485\",\"Durham County\":\"6487\",\"MTV Wonderland\":\"6489\",\"The Long Long Holiday\":\"6490\",\"Dog the Bounty Hunter\":\"6491\",\"Billy Dilley's Super-Duper Subterranean Summer\":\"6492\",\"Enlisted\":\"6493\",\"Last Resort\":\"6494\",\"Mixology\":\"6495\",\"Nikita\":\"6496\",\"True Life\":\"6497\",\"Idiotsitter\":\"6500\",\"Canal Road\":\"6501\",\"The Glades\":\"10263\",\"Ronny Chieng: International Student\":\"6504\",\"Being Human\":\"6505\",\"Octonauts\":\"6506\",\"Rescue Me\":\"6507\",\"The Loch\":\"6510\",\"What Next?\":\"6511\",\"Crackanory\":\"6512\",\"Claws\":\"6513\",\"American Grit\":\"6514\",\"The Sky At Night\":\"6515\",\"Tangle\":\"6517\",\"Steve Harvey's Funderdome\":\"6518\",\"Burning Love\":\"6519\",\"The Summer of Love: How Hippies Changed the World\":\"6520\",\"Bikie Wars: Brothers in Arms\":\"6522\",\"Fastlane\":\"6523\",\"Mildred Pierce\":\"6524\",\"Annual Tony Awards\":\"6525\",\"Faith\":\"6526\",\"Dates\":\"6529\",\"Fearless\":\"6530\",\"Sunday Night with Megyn Kelly\":\"6531\",\"The Art of Japanese Life\":\"6533\",\"David Attenborough's Natural Curiosities\":\"6534\",\"The Putin Interviews\":\"6535\",\"Superhuman\":\"6536\",\"Just Tattoo Of Us\":\"6537\",\"Voice\":\"6540\",\"Those Who Can't\":\"6541\",\"Spartan: Ultimate Team Challenge\":\"6542\",\"Love Child\":\"6544\",\"Japanorama\":\"6546\",\"Splash Splash Love\":\"6547\",\"Hindafing\":\"6551\",\"Blue Exorcist\":\"6553\",\"Holiday Horrors: Caught on Camera\":\"6555\",\"Million Dollar Matchmaker\":\"6557\",\"Blood Drive\":\"6558\",\"Signal\":\"6559\",\"Royal Murder Mysteries\":\"6560\",\"America's Book of Secrets\":\"6561\",\"Nurses Who Kill\":\"6565\",\"Summer Heights High\":\"6571\",\"Quincy M.E.\":\"6572\",\"God, Guns & Automobiles\":\"6573\",\"The Deep End\":\"6574\",\"I Love the 1880s\":\"6575\",\"Brad Meltzer's Decoded\":\"6576\",\"Riviera\":\"6577\",\"Phoenix Nights\":\"6579\",\"LEGO Star Wars\":\"6581\",\"Homestead Rescue\":\"6583\",\"IRT Deadliest Roads\":\"6584\",\"Generation B\":\"6585\",\"Dad Camp\":\"6586\",\"LEXX\":\"6588\",\"Fast N' Loud\":\"6589\",\"RuPaul's Drag Race All Stars\":\"6590\",\"Kabaneri of the Iron Fortress\":\"6593\",\"Early Edition\":\"6594\",\"The ZhuZhus\":\"6595\",\"Tool Academy\":\"6596\",\"The Lost World\":\"6597\",\"Legends of Chamberlain Heights\":\"6598\",\"Hospital\":\"6600\",\"Unsealed: Alien Files\":\"6601\",\"Pitch Battle\":\"6602\",\"A Bit of Fry and Laurie\":\"6604\",\"Shark Tank (AU)\":\"6605\",\"Dracula\":\"6606\",\"Inspector Morse\":\"6607\",\"True Story With Hamish And Andy\":\"6608\",\"Industrial Light & Magic: Creating the Impossible\":\"6609\",\"The Knock\":\"6610\",\"Fight Game: The McGuigans\":\"6611\",\"Reasonable Doubt\":\"6612\",\"The Thundermans\":\"6613\",\"The Bold Type\":\"6614\",\"WWE Friday Night SmackDown\":\"6616\",\"Hotel Transylvania: The Television Series\":\"6617\",\"Here Come THe Habibs\":\"6618\",\"Curious Creatures\":\"6623\",\"Disney Tsum Tsum\":\"6624\",\"Big Pacific\":\"6625\",\"Solitary\":\"6628\",\"Outrageous Acts of Danger\":\"6629\",\"Eastsiders\":\"6630\",\"Little Big Shots: Forever Young\":\"6631\",\"Drugs Map of Britain\":\"6632\",\"Sid the Science Kid\":\"6635\",\"Free Rein\":\"6636\",\"Underbelly NZ - Land Of The Long Green Cloud\":\"6637\",\"The Mist\":\"6638\",\"Sinbad\":\"6639\",\"Growing Up Hip Hop: Atlanta\":\"6640\",\"GLOW\":\"6641\",\"Boy Band\":\"6642\",\"Forbidden History\":\"6643\",\"Animal Practice\":\"6645\",\"Shattered\":\"6646\",\"Escape the Night\":\"6649\",\"Wildfire\":\"6650\",\"The Crystal Maze\":\"6652\",\"Get Smart\":\"6653\",\"Shaun Micallef's Mad as Hell\":\"6654\",\"So Awkward\":\"6656\",\"Little People Big World\":\"6657\",\"The Skinny Dip\":\"6658\",\"The Guest List\":\"6659\",\"Matilda and the Ramsay Bunch\":\"6660\",\"To Tell the Truth\":\"6662\",\"Cold Water Cowboys\":\"6664\",\"DR. Vegas\":\"6665\",\"Trust Me (2009)\":\"6666\",\"Amazon with Bruce Parry\":\"6671\",\"Glastonbury\":\"6673\",\"Dr. Jeff: Rocky Mountain Vet\":\"6674\",\"Jo Frost: Nanny On Tour\":\"6677\",\"Hotel Transylvania: The Series\":\"6678\",\"Dinosaurs\":\"6680\",\"Handmade in Japan\":\"6681\",\"Street Outlaws: New Orleans\":\"6684\",\"Border Patrol\":\"6686\",\"Ax Men\":\"6687\",\"How to Make It in America\":\"6688\",\"'Til Death\":\"6690\",\"Lost World\":\"6691\",\"Offspring\":\"6693\",\"Love Island\":\"6694\",\"Hood Adjacent With James Davis\":\"6695\",\"Tales\":\"6696\",\"Baroness von Sketch Show\":\"6698\",\"Reggie Yates: Hidden Australia\":\"6699\",\"I Am Jazz\":\"6700\",\"Hard Time\":\"6701\",\"I Am Homicide\":\"6702\",\"Miniverse\":\"6703\",\"Axe Cop\":\"6704\",\"Where There's Blame, There's a Claim\":\"6706\",\"CIA Declassified\":\"6707\",\"Good Bones\":\"6709\",\"Spa Wars\":\"6710\",\"Circle\":\"6713\",\"Transporter\":\"6714\",\"Gypsy\":\"6715\",\"Noddy, Toyland Detective\":\"6716\",\"Popeye and Son\":\"6717\",\"Willo the Wisp\":\"6718\",\"Voltron: Legendary Defender\":\"6720\",\"Mount Pleasant\":\"6722\",\"Kendra on Top\":\"6723\",\"Highway Thru Hell\":\"6724\",\"Criminals Caught on Camera\":\"6725\",\"Doubt\":\"6728\",\"All or Nothing\":\"6729\",\"The Yorkshire Vet\":\"6731\",\"Mister Rogers' Neighborhood\":\"6732\",\"Mighty Morphin Power Rangers\":\"6733\",\"All in the Family\":\"6734\",\"Taggart\":\"6736\",\"The Rockford Files\":\"6737\",\"The Abominable Bride\":\"6738\",\"The Happenings\":\"6739\",\"CSI: NY\":\"6741\",\"Party Down South\":\"6744\",\"Kitchen Garden Live With The Hairy Bikers\":\"6747\",\"The Standups\":\"6748\",\"Bo Burnham: Words, Words, Words\":\"6749\",\"The F Word (UK)\":\"6750\",\"Born To Kill? Class Of Evil\":\"6751\",\"Venture\":\"6752\",\"Will\":\"6753\",\"Broken (2017)\":\"6756\",\"The Windsors\":\"6758\",\"Snowfall\":\"6759\",\"Guys With Kids\":\"6761\",\"Joanna Lumley's India\":\"6762\",\"Beverly Hills Pawn\":\"6763\",\"Hey Arnold!\":\"6764\",\"Kids Baking Championship\":\"6767\",\"Zach Stone Is Gonna Be Famous\":\"6769\",\"Naked Attraction\":\"6770\",\"Castlevania\":\"6771\",\"Battle of the Network Stars\":\"6772\",\"Billy Goes North\":\"6773\",\"Delicious\":\"6774\",\"Scum's Wish\":\"6777\",\"American Restoration\":\"6779\",\"New Tricks\":\"6780\",\"Mr. D\":\"6781\",\"Survivors (2008)\":\"6784\",\"Panic 911\":\"6785\",\"Les Revenants\":\"6786\",\"UFOs: The Lost Evidence\":\"6787\",\"School of Rock\":\"6790\",\"Ross Kemp: Extreme World\":\"6791\",\"Pat the Dog\":\"6792\",\"Barakamon\":\"6794\",\"The Defiant Ones\":\"6795\",\"Candy Crush\":\"6796\",\"Star Wars: Forces of Destiny\":\"6797\",\"Apollo Gauntlet\":\"6800\",\"Tiny Paradise\":\"10555\",\"The Colbert Report\":\"6802\",\"Ross Kemp Battle for the Amazon\":\"6805\",\"Ghosts of Shepherdstown\":\"6807\",\"Ultimate Homes\":\"6809\",\"Australian Ninja Warrior\":\"6810\",\"Teen Mom 3\":\"6811\",\"Right on the Money\":\"6812\",\"Twirlywoos\":\"6813\",\"Filthy Rich\":\"6814\",\"Hawaii Five-O\":\"6816\",\"Come Dine With Me\":\"6817\",\"In The Dark\":\"6818\",\"American Ripper\":\"6820\",\"Luna Petunia\":\"6821\",\"World of Winx\":\"6824\",\"Witch Hunt: A Century of Murder\":\"6825\",\"Monday Mornings\":\"6826\",\"Home\":\"6827\",\"Le Bureau des Légendes\":\"6828\",\"Salvation\":\"6831\",\"Sound Waves: The Symphony of Physics\":\"6832\",\"Altair: A Record of Battles\":\"6834\",\"I'm Sorry\":\"6835\",\"Shaun Ryder On UFOs\":\"6836\",\"Friends from College\":\"6841\",\"Diff'rent Strokes\":\"6844\",\"Akil the Fugitive Hunter\":\"6848\",\"Yummy Mummies\":\"6850\",\"Bellator\":\"6851\",\"A Timewatch Guide\":\"6853\",\"Planet of the Apps\":\"6855\",\"The Hollow Crown\":\"6856\",\"Behave Yourself!\":\"6857\",\"I Know Who You Are\":\"6858\",\"Unsupervised\":\"6859\",\"Touch (2012)\":\"6860\",\"The Cul de Sac\":\"6861\",\"Shahs of Sunset\":\"6863\",\"Tracey Breaks the News\":\"6864\",\"Deadly Sins\":\"6865\",\"Youngers\":\"6866\",\"Chop Socky Boom\":\"6867\",\"Rock the Park\":\"6868\",\"Nadiya's British Food Adventure\":\"6869\",\"The Bionic Vet\":\"6871\",\"Roba\":\"6872\",\"Fabulosas Flores\":\"6873\",\"Velvet\":\"6874\",\"Inside the Factory\":\"6875\",\"Operation Stonehenge: What Lies Beneath\":\"6877\",\"Seeking Salvage\":\"6878\",\"Ari Shaffir: Double Negative\":\"6879\",\"The Sniffer\":\"6880\",\"The Layover\":\"6881\",\"A Night With My Ex\":\"6882\",\"Utopia (AU) (2014)\":\"6883\",\"Murder by Numbers\":\"6884\",\"Mysteries of the Outdoors\":\"6885\",\"The Birthday Boys\":\"6886\",\"Fearless (2017)\":\"6888\",\"Cable Girls\":\"6889\",\"The Sweet Makers\":\"6890\",\"Black Ink Crew: Chicago\":\"6891\",\"I Was Prey\":\"6893\",\"Letterbox\":\"6894\",\"The Undertaker\":\"6896\",\"Open Heart\":\"6897\",\"46 Yok Olan\":\"6898\",\"Boruto: Naruto Next Generations\":\"6900\",\"Saiyuki\":\"6901\",\"History's Ultimate Spies\":\"6902\",\"Pacific Heat\":\"6904\",\"The Mash Report\":\"6905\",\"Ozark\":\"6906\",\"The Life of Mammals\":\"6908\",\"Sex: An Unnatural History\":\"6909\",\"Niko and the Sword of Light\":\"6910\",\"Shinesty\":\"6911\",\"Lost in Oz\":\"6912\",\"Raven's Home\":\"6913\",\"Chronos Ruler\":\"6914\",\"Sorjonen.S01\":\"6915\",\"Norm Macdonald Live\":\"6916\",\"Ill Behaviour\":\"6917\",\"My Only Love Song\":\"6920\",\"My Hero Academia\":\"6921\",\"Katsugeki Touken Ranbu\":\"6922\",\"The Reflection\":\"6923\",\"Killer Kids\":\"6924\",\"Curious and Unusual Deaths\":\"6925\",\"Alien Encounters\":\"6926\",\"MTV Cribs\":\"6928\",\"Three.Kingdoms\":\"6930\",\"The Jury Speaks\":\"6931\",\"Tour de France\":\"6932\",\"Tangled: The Series\":\"6934\",\"Top Secret Swimming Holes\":\"6935\",\"7th Heaven\":\"6936\",\"Wild UK\":\"6937\",\"Bible Secrets Revealed\":\"6938\",\"Dirk Gently 2010\":\"6940\",\"Lucky Louie\":\"6941\",\"El Cartel de los Sapos\":\"6942\",\"The Sixties\":\"6943\",\"Oddbods\":\"6944\",\"Tracy Beaker Returns\":\"6945\",\"Rocko's Modern Life\":\"6947\",\"Midnight, Texas\":\"6948\",\"Somewhere Between\":\"6949\",\"University Challenge\":\"6951\",\"Monster Man\":\"6952\",\"Spy in the Wild\":\"6953\",\"Take My Wife (2016)\":\"6954\",\"The Eighties\":\"6955\",\"The Seventies\":\"6957\",\"Tokyo Vampire Hotel\":\"6958\",\"Princess Diana: Tragedy or Treason?\":\"6959\",\"The New Adventures of Gilligan\":\"6960\",\"Teen Mom 2\":\"6961\",\"Khloe & Lamar\":\"6962\",\"VeggieTales In The House\":\"6963\",\"Seo-Young, My Daughter\":\"6966\",\"Africa (2013)\":\"6969\",\"The Blue Planet\":\"6970\",\"Signed\":\"6972\",\"Filthy Preppy Teen$\":\"6974\",\"Hellsing Ultimate\":\"6975\",\"Hellsing: The Dawn\":\"6976\",\"Stromberg\":\"6977\",\"The Real Housewives of Auckland\":\"6978\",\"Short Poppies\":\"6979\",\"The Real Housewives of Melbourne\":\"6980\",\"Inside London Fire Brigade\":\"6981\",\"The Last Tycoon\":\"6982\",\"Wrestling Pack\":\"6983\",\"Fauda\":\"6984\",\"Farouk Omar\":\"6986\",\"10 Puppies and Us\":\"6987\",\"The Passenger\":\"6988\",\"The Pact\":\"6989\",\"Disparue\":\"6990\",\"Arne Dahl\":\"6991\",\"Date Night Live\":\"6992\",\"Dynasty\":\"6993\",\"Vidiots\":\"6994\",\"Squad 38\":\"6996\",\"Daughters of Destiny\":\"6997\",\"Trial and Error\":\"6998\",\"Nowhere Boys\":\"7000\",\"Room 104\":\"7001\",\"Trial & Error\":\"7002\",\"Sister, Sister\":\"7003\",\"Jamie and Jimmy's Food Fight Club\":\"7004\",\"Animal Mechanicals\":\"7006\",\"Shrink\":\"7007\",\"Those Who Kill\":\"7008\",\"Upper Middle Bogan\":\"7009\",\"Get Shorty\":\"7010\",\"The Mr. Peabody & Sherman Show\":\"7011\",\"Halfworlds\":\"7012\",\"Milo Murphy's Law\":\"7013\",\"Momo Salon\":\"7014\",\"Daria\":\"7015\",\"Skin to the Max\":\"7016\",\"One Child\":\"7017\",\"Teen Titans\":\"7018\",\"The Dude Perfect Show\":\"7019\",\"Australian Survivor\":\"7020\",\"Secret Knowledge\":\"7021\",\"Ramsay's Boiling Point\":\"7022\",\"The Trip\":\"7023\",\"Coast Guard Alaska\":\"7025\",\"Man In An Orange Shirt\":\"7026\",\"Queers\":\"7027\",\"The Last Shot\":\"7028\",\"Buddy Thunderstruck\":\"7029\",\"CBSN: On Assignment\":\"7032\",\"Gone\":\"7033\",\"Siesta Key\":\"7034\",\"How the States Got Their Shapes\":\"7035\",\"Bo Burnham: what.\":\"7036\",\"Spuren des Bösen\":\"7037\",\"The Lens\":\"7038\",\"Braquo\":\"7039\",\"The Cat in the Hat Knows a Lot About That!\":\"7040\",\"21 Thunder\":\"7041\",\"Goldie and Bear\":\"7044\",\"El Secretario\":\"7045\",\"Manhunt: Unabomber\":\"7046\",\"Typical Rick\":\"7047\",\"Come Dine With Me South Africa\":\"7048\",\"Tarzan and Jane\":\"7050\",\"21 Jump Street\":\"7052\",\"The Sinner\":\"7053\",\"Hard Quiz\":\"7054\",\"So Sharp\":\"10131\",\"Gourmet Farmer\":\"7058\",\"Turbo FAST\":\"7059\",\"Talking Tom and Friends\":\"7061\",\"The Guest Book\":\"7064\",\"Gåsmamman\":\"7065\",\"Comrade Detective\":\"7066\",\"I Love Kellie Pickler\":\"7067\",\"Dallas Cowboys Cheerleaders: Making the Team\":\"7068\",\"What Would Diplo Do?\":\"7070\",\"Cold Justice\":\"7071\",\"Wild Russia\":\"7072\",\"South Pacific\":\"7073\",\"Blazing Team: Masters of Yo Kwon Do\":\"7074\",\"Darkness\":\"7075\",\"World War II Behind Closed Doors\":\"7077\",\"Clifford's Puppy Days\":\"7079\",\"Surviving Escobar: Alias JJ\":\"7082\",\"Oliver Stone's Untold History of the United States\":\"7085\",\"Truth and Lies\":\"7086\",\"Top Gear America\":\"7087\",\"Highlands: Scotland's Wild Heart\":\"7088\",\"Secrets Of Silicon Valley\":\"7089\",\"The Chris Gethard Show\":\"7091\",\"Chesapeake Shores\":\"7092\",\"[email protected]\":\"7094\",\"Spider-Man\":\"7096\",\"Life of Kylie\":\"7097\",\"The Battle Against Rome\":\"7098\",\"Girl/Girl Scene\":\"7099\",\"Jamie Oliver's Food Revolution\":\"7100\",\"Revenge Body with Khlo Kardashian\":\"7103\",\"Kourtney and Khlo Take the Hamptons\":\"7104\",\"Escaping Polygamy\":\"7105\",\"Yu-Gi-Oh! Duel Monsters\":\"7106\",\"Man v. Food\":\"7107\",\"Secret Forest\":\"7110\",\"Fat Actress\":\"7111\",\"Ladies of London\":\"7114\",\"Eden\":\"7115\",\"Roommates (2015)\":\"7116\",\"Secret State\":\"7118\",\"Earth: The Power of the Planet\":\"7119\",\"Wildest Islands\":\"7121\",\"The Real L Word\":\"7123\",\"Mr & Mrs Murder\":\"7125\",\"Knight Rider 2008\":\"7126\",\"Renegade\":\"7129\",\"Romanzo Criminale\":\"7130\",\"Weird or What?\":\"7131\",\"Mr. Mercedes\":\"7133\",\"Atypical\":\"7135\",\"I'm Coming Out\":\"7138\",\"Matron, Medicine and Me: 70 Years of the NHS\":\"7139\",\"The X Factor\":\"7140\",\"Love Rain\":\"7143\",\"DuckTales\":\"7145\",\"First in Human: The Trials of Building 10\":\"7146\",\"Teach My Pet to Do That\":\"7147\",\"Peppa Pig\":\"7149\",\"ZEN\":\"7150\",\"The Bernie Mac Show\":\"7152\",\"Mia and me\":\"7153\",\"The Men Who Built America\":\"7155\",\"David Attenborough's Conquest of the Skies\":\"7156\",\"90 Day Fiance: Before The 90 Days\":\"7157\",\"Hidden Kingdoms\":\"7159\",\"Wild Canada\":\"7160\",\"V - The Visitors\":\"7161\",\"Wild France\":\"7163\",\"Inside The Human Body\":\"7164\",\"Misfit Garage\":\"7166\",\"House Hunters Renovation\":\"7167\",\"Married to Medicine\":\"7168\",\"All Wrong\":\"7170\",\"Legit (2013)\":\"7172\",\"Life of Crime\":\"7174\",\"What Remains\":\"7175\",\"The Joy of Sex Toys\":\"7177\",\"Slugterra\":\"7178\",\"Easyjet: Inside the Cockpit\":\"7179\",\"Years of Living Dangerously\":\"7182\",\"Baller Wives\":\"7183\",\"Vegas Strip\":\"7185\",\"People Just Do Nothing\":\"7186\",\"Quacks\":\"7188\",\"Last Chance High\":\"7191\",\"I Hart Food\":\"7192\",\"3rd Rock from the Sun\":\"7193\",\"Leah Remini: Scientology and the Aftermath\":\"7195\",\"The Murder of Laci Peterson\":\"7196\",\"The New Scooby-Doo Movies\":\"7198\",\"Tiny House, Big Living\":\"7199\",\"Unsolved Mysteries\":\"7200\",\"Hidden Restaurants with Michel Roux Jr\":\"7201\",\"Celebrity MasterChef\":\"7202\",\"Marlon\":\"7203\",\"Saving Lives at Sea\":\"7204\",\"Nightmare Tenants, Slum Landlords\":\"7205\",\"Undressed\":\"7206\",\"The Cars That Made America\":\"7211\",\"The Brighton Police\":\"7215\",\"Chuggington\":\"7217\",\"Rundfunk\":\"7218\",\"Marvel's The Defenders\":\"7220\",\"Eat Your Heart Out with Nick Helm\":\"7221\",\"Flipping Out\":\"7223\",\"Dinotrux\":\"7224\",\"Naked SNCTM\":\"7225\",\"Ask the StoryBots\":\"7226\",\"The Carrie Diaries\":\"7227\",\"The Story of Diana\":\"7229\",\"Angel's Friends\":\"7231\",\"Rush (2008)\":\"7233\",\"Haunted Towns\":\"7235\",\"Spanish Supercup\":\"7236\",\"Rude Tube\":\"7237\",\"Benders\":\"7238\",\"Hunting Hitler\":\"7239\",\"Wild Things with Dominic Monaghan\":\"7240\",\"Marvel's Spider-Man\":\"7241\",\"Flashpoint\":\"7242\",\"Striking Out\":\"7244\",\"Casualty\":\"7245\",\"Len Goodman's Partners in Rhyme\":\"7246\",\"Hostages\":\"7247\",\"The Loop\":\"7248\",\"Mysticons\":\"7249\",\"The State\":\"7250\",\"Astronauts: Do You Have What It Takes?\":\"7251\",\"Fake or Fortune\":\"7253\",\"The Hunt with John Walsh\":\"7256\",\"Swamp Murders\":\"7257\",\"Intruders\":\"7261\",\"Midnight Sun\":\"7262\",\"Norsemen\":\"7263\",\"Weightlifting Fairy Kim Bok-Joo\":\"7264\",\"Down East Dickering\":\"7265\",\"Naked News Uncovered\":\"7266\",\"Little Witch Academia\":\"7267\",\"Joe Tech\":\"7268\",\"Streetmate\":\"7269\",\"Superfoods: The Real Story\":\"7270\",\"Terrace House: Boys & Girls in the City\":\"7271\",\"Deadly Possessions\":\"7273\",\"Grojband\":\"7274\",\"In Therapy\":\"7276\",\"Caribbean Pirate Treasure\":\"7278\",\"Mafiosa\":\"7280\",\"John Doe\":\"7281\",\"True and the Rainbow Kingdom\":\"7282\",\"The Boat\":\"7283\",\"Mysteries of the Missing\":\"7285\",\"O.J.: Made in America\":\"7286\",\"The Planets\":\"7287\",\"The Woodlies\":\"7289\",\"Close Calls: On Camera\":\"7290\",\"homeMADE\":\"7291\",\"The Disappearance of Natalee Holloway\":\"7292\",\"The Secrets of Sleep\":\"7294\",\"The X Factor (US)\":\"7295\",\"Angelo Rules\":\"7296\",\"LEGO Masters\":\"7298\",\"Star-Crossed\":\"7299\",\"Ambulance\":\"7300\",\"The Tick\":\"7301\",\"Horrid Henry\":\"7302\",\"Disjointed\":\"7303\",\"Flipper & Lopaka\":\"7304\",\"Lone Target\":\"7305\",\"Oceans\":\"7307\",\"Britain's Benefit Tenants\":\"7308\",\"The Defenders (2010)\":\"7310\",\"Big History\":\"7311\",\"The Deuce\":\"7312\",\"Da Jammies\":\"7314\",\"The Nineties\":\"7316\",\"Great Migrations\":\"7317\",\"Madagascar\":\"7318\",\"Bargain-Loving Brits in the Sun\":\"7319\",\"Found\":\"7320\",\"Anthony Bourdain: No Reservations\":\"7321\",\"Conspiracy (2015)\":\"7323\",\"I Am Frankie\":\"7327\",\"One Night of Ecstasy\":\"7328\",\"America Divided\":\"7329\",\"Metim Lerega\":\"7330\",\"Dawson's Creek\":\"7331\",\"Prisoners of War\":\"7334\",\"Puberty Blues\":\"7336\",\"MTV's Dare To Live\":\"7340\",\"The Housing Enforcers\":\"7341\",\"WWE Mae Young Classic\":\"7342\",\"Payday\":\"7345\",\"The Batman\":\"7346\",\"This Time Next Year (AU)\":\"7347\",\"The Tick (2016)\":\"7348\",\"Sunny Day\":\"7349\",\"MTV Video Music Awards\":\"7350\",\"Hulk Hogan's Rock 'N' Wrestling\":\"7352\",\"Shazam\":\"7353\",\"Ringer\":\"7354\",\"The Great British Bake Off\":\"7355\",\"WWII in HD\":\"7356\",\"Little Einsteins\":\"7357\",\"Face Off: Game Face\":\"7360\",\"Get Krack!n\":\"7361\",\"Japanology Plus\":\"7362\",\"Eerie, Indiana\":\"7364\",\"Chandra Levy: An American Murder Mystery\":\"7365\",\"World's Busiest Cities\":\"7367\",\"Starting Up, Starting Over\":\"7368\",\"Mountain: Life at the Extreme\":\"7369\",\"Inside Balmoral\":\"7370\",\"My Shopping Addiction\":\"7371\",\"Garage Rehab\":\"7372\",\"Idris Elba: No Limits\":\"7373\",\"Dog City\":\"7374\",\"Samurai Gourmet\":\"7376\",\"Educating...\":\"7377\",\"Gypsy Kids: Our Secret World\":\"7379\",\"South Beach Tow\":\"7380\",\"The Detectives: Inside the Major Crimes Team\":\"7381\",\"Mermaids (2014)\":\"7384\",\"Sex Map of Britain\":\"7386\",\"Swift And Shift Couriers\":\"7391\",\"Fat Pizza\":\"7392\",\"Gem Hunt\":\"7393\",\"Wonderland (BBC)\":\"7394\",\"Green Wing\":\"7397\",\"The Finder\":\"7398\",\"Comedy Playhouse\":\"7399\",\"Secrets of the National Trust\":\"7400\",\"Anno 1790\":\"7402\",\"Shahrzad\":\"7403\",\"Neil Gaiman's Likely Stories\":\"7406\",\"The Untouchables\":\"7408\",\"Beauty Queen Murders\":\"7409\",\"The Jonathan Ross Show\":\"7410\",\"Sports Jeopardy\":\"7411\",\"Crossbones\":\"7412\",\"The Nightmare Neighbour Next Door\":\"7413\",\"Prisoner Zero\":\"7416\",\"Auction Hunters\":\"7417\",\"Highway to Heaven\":\"7418\",\"Asheghaneh\":\"7419\",\"The Strange Calls\":\"7420\",\"Trust Me (2017)\":\"7421\",\"The Wrong Mans\":\"7422\",\"Tell Me You Love Me\":\"7423\",\"My Secret Sex Fantasy\":\"7424\",\"Deadline: Crime with Tamron Hall\":\"7425\",\"Brushing Up On...\":\"7430\",\"Francesco's Venice\":\"7431\",\"Mayday (2013)\":\"7432\",\"SciGirls\":\"7433\",\"Council House Crackdown\":\"7436\",\"Kourtney and Kim Take Miami\":\"7438\",\"Up All Night\":\"7439\",\"Only Fools and Horses\":\"7440\",\"North Woods Law\":\"7441\",\"Olobob Top\":\"7442\",\"Where in the World?\":\"7443\",\"Angel Beats!\":\"7444\",\"Married To A Celebrity: The Survival Guide\":\"7445\",\"The Hotel Inspector Returns\":\"7446\",\"Suck Less with Willam\":\"7447\",\"Needles & Pins\":\"7449\",\"Hoard Hunters\":\"7450\",\"Blackstone\":\"7451\",\"Rachel Hunter's Tour of Beauty\":\"7453\",\"Inside The NFL\":\"7454\",\"Tribes, Predators, and Me\":\"7455\",\"Evil, I\":\"7456\",\"The New Yankee Workshop\":\"7457\",\"Back\":\"7458\",\"The Young and the Restless\":\"7459\",\"Epicly Later'd\":\"7460\",\"Hit the Floor\":\"7461\",\"Can't Pay We'll Take It Away\":\"7462\",\"Whites\":\"7463\",\"Penoza\":\"7464\",\"Life on the Reef\":\"7465\",\"Fake Britain\":\"7466\",\"Killing Richard Glossip\":\"7469\",\"Dear Murderer\":\"7470\",\"Safe House\":\"7472\",\"Greenhouse Academy\":\"7474\",\"Giada at Home\":\"7475\",\"The Confession Tapes\":\"7476\",\"Maison close\":\"7477\",\"Quirke\":\"7480\",\"Cold Feet\":\"7482\",\"Cosby\":\"7484\",\"The Mill\":\"7485\",\"The Village\":\"7486\",\"MTV Unplugged\":\"7487\",\"Secret Army\":\"7488\",\"Out of the Wild\":\"7489\",\"Fire Chasers\":\"7490\",\"Mysteries of the Abandoned\":\"7491\",\"Love Blows\":\"7492\",\"Tin Star\":\"7493\",\"The Age of Aerospace\":\"7495\",\"Secret History\":\"7496\",\"Tess of the D'Urbervilles (2008)\":\"7499\",\"Andy's Prehistoric Adventures\":\"7501\",\"Black Love\":\"7502\",\"Spirit Riding Free\":\"7503\",\"Barefoot Contessa\":\"7504\",\"The Orville\":\"7505\",\"Britain's Greatest Bridges\":\"7506\",\"Tim and Eric's Bedtime Stories\":\"7507\",\"Judge Judy\":\"7508\",\"Disney's Hercules\":\"7509\",\"Upstart Crow\":\"7510\",\"Liar\":\"7511\",\"Rellik\":\"7512\",\"The Undateables\":\"7514\",\"Worst Cooks in America\":\"7515\",\"The Good Doctor\":\"7517\",\"The Great American Baking Show\":\"7518\",\"Spring Baking Championship\":\"7519\",\"Ancient Top 10\":\"7520\",\"Save Money: Good Health\":\"7521\",\"Big Time RV\":\"7522\",\"Cake Boss\":\"7524\",\"Desert Flippers\":\"7526\",\"ChuckleVision\":\"7527\",\"Dinner at Tiffani's\":\"7528\",\"Ellie's Real Good Food\":\"7529\",\"Grave Mysteries\":\"7530\",\"100 Year Old Driving School\":\"7531\",\"Marvel's Ant-Man\":\"7532\",\"According to Chrisley\":\"7534\",\"PhoneShop\":\"7535\",\"Lupin III\":\"7536\",\"How To Stay Young\":\"7538\",\"My Crazy Sex\":\"7539\",\"Gigolos\":\"7540\",\"Tytgat Chocolat\":\"7541\",\"Lovely Complex\":\"7543\",\"Dead Set\":\"7546\",\"RuPaul's Drag Race All Stars: Untucked!\":\"7547\",\"Gruen\":\"7548\",\"My Extreme OCD Life\":\"7549\",\"American Vandal\":\"7550\",\"Hit & Miss\":\"7551\",\"Comedy Central Stand-Up Presents\":\"7552\",\"The Driver\":\"7553\",\"The Pizza Show\":\"7556\",\"Kindred Spirits\":\"7558\",\"The Mayor (2017)\":\"7559\",\"Numb3rs\":\"7562\",\"Lewis\":\"7563\",\"The Doctor Blake Mysteries\":\"7564\",\"Evil Things\":\"7565\",\"Doctor Who (1963)\":\"7566\",\"Pirate Treasure of the Knights Templar\":\"7567\",\"Philip K. Dick's Electric Dreams\":\"7568\",\"Strike\":\"7569\",\"The Spouse House\":\"7570\",\"W1A\":\"7572\",\"1976-1978\":\"7575\",\"2002-2005\":\"7576\",\"The Scooby-Doo/Dynomutt Hour\":\"7577\",\"Berserk\":\"7578\",\"The Bold and the Beautiful\":\"7579\",\"The Vietnam War (2017)\":\"7580\",\"Alaska: A Year in the Wild\":\"7582\",\"Call the Cleaners\":\"7583\",\"Black Lake\":\"7584\",\"Nine Minute Ninja\":\"7585\",\"Primeval\":\"7586\",\"Antiques Road Trip\":\"7587\",\"Alpha House\":\"7588\",\"In Plain Sight\":\"7590\",\"Porters\":\"7591\",\"The Detectives: Murder on the Streets\":\"7592\",\"Come Fly with Me\":\"7593\",\"Flipper\":\"7594\",\"Video Game High School\":\"7595\",\"Ghosted\":\"7596\",\"Tyler Perry's If Loving You Is Wrong\":\"7598\",\"The Othersiders\":\"7599\",\"Neo Yokio\":\"7600\",\"The Russell Howard Hour\":\"7601\",\"Shadow of Doubt\":\"7604\",\"Mike Judge Presents: Tales From the Tour Bus\":\"7605\",\"Dan Vs.\":\"7606\",\"Once Upon a Time in Wonderland\":\"7607\",\"The Great British Baking Off\":\"7609\",\"Star Trek: Discovery\":\"7610\",\"Mystery!: Cadfael\":\"7612\",\"Mobile Suit Gundam: The 08th MS Team\":\"7613\",\"After Trek\":\"7614\",\"My Kitchen Rules NZ\":\"7615\",\"Absentia\":\"7616\",\"The Brave\":\"7617\",\"Young Sheldon\":\"7618\",\"Me, MYSELF & I\":\"7619\",\"The Opposition with Jordan Klepper\":\"7620\",\"Dare To Live\":\"7623\",\"Alias Grace\":\"7625\",\"90's House\":\"7626\",\"Slice Of Paradise\":\"7627\",\"Rick Mercer Report\":\"7628\",\"Seal Team\":\"7629\",\"Released\":\"7630\",\"Garage Squad\":\"7631\",\"Face Value\":\"7632\",\"50 Central\":\"7633\",\"Russia's War: Blood Upon the Snow\":\"7636\",\"The Little Couple\":\"7638\",\"You Can't Turn That Into A House\":\"7639\",\"Will & Grace\":\"7640\",\"Big Mouth\":\"7641\",\"The Magic School Bus Rides Again\":\"7642\",\"Murder Maps\":\"7644\",\"Brigada\":\"7645\",\"America's War on Drugs\":\"7646\",\"Dragons' Den (CA)\":\"7647\",\"City Homicide\":\"7649\",\"White Famous\":\"7650\",\"Marvel's Inhumans\":\"7651\",\"Jack Whitehall: Travels with My Father\":\"7654\",\"Saturday Night Live\":\"7656\",\"Cannabis\":\"7657\",\"Halloween Baking Championship\":\"7658\",\"Ravenswood\":\"7659\",\"Medical Investigation\":\"7660\",\"The Beast\":\"7661\",\"The Last Post\":\"7662\",\"Wisdom of the Crowd\":\"7664\",\"Ten Days in the Valley\":\"7665\",\"Captain Scarlet\":\"7666\",\"The Bachelorette (AU)\":\"7667\",\"My Big Fat Pet Makeover\":\"7668\",\"Collateral\":\"7669\",\"Flyboys\":\"7671\",\"Step by Step\":\"7673\",\"9JKL\":\"7674\",\"The Gifted\":\"7675\",\"My Big Fat Fabulous Life\":\"7676\",\"Young Americans\":\"7677\",\"Active Shooter: America Under Fire\":\"7678\",\"Missions\":\"7680\",\"Grace\":\"7681\",\"Hangin' with Mr. Cooper\":\"7682\",\"seaQuest DSV\":\"7683\",\"Law & Order: True Crime\":\"7684\",\"Kevin (Probably) Saves the World\":\"7685\",\"OK K.O.! Let's Be Heroes\":\"7686\",\"Halloween Wars\":\"7687\",\"Persons Unknown\":\"7688\",\"Nazi Secret Files\":\"7689\",\"Blackish\":\"7690\",\"Secrets of Our Cities\":\"7691\",\"Ink Master: Angels\":\"7692\",\"The Event\":\"7693\",\"Dune\":\"7694\",\"Dekalog\":\"7696\",\"Bad Move\":\"7697\",\"Cant Pay Well Take It Away\":\"7698\",\"The Real Housewives of New Jersey\":\"7699\",\"Human Target\":\"7700\",\"Archangel\":\"7702\",\"Ghost Wars\":\"7704\",\"Skylanders Academy\":\"7706\",\"Real Estate Wars\":\"7708\",\"The Devil Wears Prada\":\"7709\",\"Coast\":\"7710\",\"Richie Rich (2015)\":\"7711\",\"World War II: The Price of Empire\":\"7714\",\"ID-0\":\"7715\",\"Russell Peters\":\"7717\",\"Citizen Smith\":\"7718\",\"Police Squad!\":\"7719\",\"Rickey Smiley For Real\":\"7720\",\"Origins (2017)\":\"7721\",\"The Apprentice (UK)\":\"7724\",\"Nile Rodgers: How to Make It in the Music Business\":\"7725\",\"Invader ZIM\":\"7727\",\"AFV\":\"7728\",\"This is Life with Lisa Ling\":\"7730\",\"Valor\":\"7731\",\"30 For 30 (2009)\":\"7733\",\"The Dick Van Dyke Show\":\"7734\",\"Breaking Amish\":\"7735\",\"Gunslingers\":\"7737\",\"Love, Nina\":\"7738\",\"Tattoo Girls\":\"7739\",\"The Drinky Crow Show\":\"7740\",\"Vampirina\":\"7742\",\"Mary Shelley's Frankenhole\":\"7743\",\"Jackie Chan Adventures\":\"7747\",\"Mobile Suit Gundam: Iron-Blooded Orphans\":\"7748\",\"Terror in the Woods\":\"7749\",\"Dynasty (2017)\":\"7750\",\"Cuba with Simon Reeve\":\"7752\",\"The New Celebrity Apprentice\":\"7753\",\"Suburra\":\"7757\",\"Hotel Impossible\":\"7759\",\"The Comedy Get Down\":\"7760\",\"The Rundown with Robin Thede\":\"7761\",\"Superstition\":\"7762\",\"Lore\":\"7764\",\"I Love You, America\":\"7765\",\"Mindhunter\":\"7766\",\"Russia with Simon Reeve\":\"7767\",\"The Jetsons\":\"7768\",\"BBC Space 2001\":\"7769\",\"Something's Killing Me\":\"7770\",\"Stan Against Evil\":\"7771\",\"Roseanne\":\"7772\",\"Darien Gap: Desperate Journey to America\":\"7773\",\"Tricks of the Restaurant Trade\":\"7774\",\"The Day of the Triffids\":\"7777\",\"Cult\":\"7778\",\"Red Widow\":\"7779\",\"Simply Ming\":\"7780\",\"Paradox\":\"7782\",\"BattleBots\":\"7783\",\"Threshold\":\"7784\",\"What on Earth?\":\"7787\",\"Shokugeki no souma San\":\"7789\",\"Dead Silent\":\"7791\",\"Strange Evidence\":\"7792\",\"Legendary Locations\":\"7793\",\"Gordon Ramsay on Cocaine\":\"7795\",\"The Eleven\":\"7797\",\"Max & Paddy's Road to Nowhere\":\"7798\",\"The Day I Met El Chapo: The Kate Del Castillo Story\":\"7799\",\"Geeks Who Drink\":\"7802\",\"Rosehaven\":\"7803\",\"The Blue Racer\":\"7805\",\"World's Deadliest Drivers\":\"7806\",\"In Another World With My Smartphone\":\"7808\",\"Columbo\":\"7809\",\"Yu-Gi-Oh! Arc-V\":\"7810\",\"Gunpowder\":\"7812\",\"The Platinum Life\":\"7814\",\"Best Baker In America\":\"7816\",\"Little Mosque on the Prairie\":\"7817\",\"Street Fighter: Resurrection\":\"7818\",\"The Disappearance of Maura Murray\":\"7820\",\"Furze World Wonders\":\"7823\",\"The Nanny\":\"7824\",\"The Jellies (2017)\":\"7825\",\"Monster\":\"7826\",\"Paddington Station 24/7\":\"7830\",\"SMILF\":\"7831\",\"The Nature of Things\":\"7832\",\"Bizarre Foods: Delicious Destinations\":\"7834\",\"The Disappearance\":\"7835\",\"Gucci Mane And Keyshia Ka'oir: The Mane Event\":\"7836\",\"Scared Famous\":\"7837\",\"The Untitled Action Bronson Show\":\"7838\",\"My Kitchen Rules (UK)\":\"7839\",\"Eat the World with Emeril Lagasse\":\"7840\",\"Undercover\":\"7841\",\"Drop The Mic\":\"7844\",\"Bounty Hunters\":\"7845\",\"The Victoria's Secret Fashion Show\":\"7846\",\"Bad Habits, Holy Orders\":\"7847\",\"Pickle and Peanut\":\"7848\",\"Army: Behind the New Frontlines\":\"7849\",\"At Home with Amy Sedaris\":\"7850\",\"The Joker's Wild\":\"7852\",\"Bored to Death\":\"7853\",\"Klondike\":\"7855\",\"Ugly House to Lovely House with George Clarke\":\"7856\",\"Single AF\":\"7857\",\"Bargain Loving Brits in Blackpool\":\"7859\",\"Home Alone\":\"7860\",\"Lifeline (2017)\":\"7861\",\"Blue Planet II\":\"7862\",\"Beyond Stranger Things\":\"7863\",\"Getting the Builders In\":\"7866\",\"Lip Sync Battle Shorties\":\"7867\",\"The Jellies\":\"7868\",\"Estocolmo\":\"10275\",\"Nigella: At My Table\":\"7870\",\"Motherland\":\"7871\",\"Love & Hip Hop\":\"7873\",\"The Harbour\":\"7874\",\"Gentlemen & Gangsters\":\"7876\",\"Secrets of the Underground\":\"7877\",\"Aaahh!!! Real Monsters\":\"7878\",\"Danger Mouse\":\"7880\",\"Brothers & Sisters\":\"7884\",\"The 1980s: The Deadliest Decade\":\"7885\",\"Ryan Hansen Solves Crimes On Television\":\"7888\",\"Junior Doctors: Blood, Sweat and Tears\":\"7889\",\"The Ex-PM\":\"7890\",\"Criminal Confessions\":\"7891\",\"Homicide: Life on the Street\":\"7892\",\"El jardín de bronce\":\"7894\",\"El Marginal\":\"7895\",\"S.W.A.T. (2017)\":\"7897\",\"Sigmund and the Sea Monsters\":\"7899\",\"Australian Wilderness with Ray Mears\":\"7901\",\"Bear's Mission with...\":\"7902\",\"Food Unwrapped\":\"7903\",\"Eight Days That Made Rome\":\"7904\",\"Finding Escobar's millions\":\"7905\",\"Ancient Mysteries (UK)\":\"7906\",\"Animal Cribs\":\"7907\",\"Bleak House\":\"7910\",\"Volatile Earth\":\"7911\",\"Zak Storm\":\"7912\",\"The Cape\":\"7914\",\"Hawthorne\":\"7915\",\"The Triangle\":\"7916\",\"Evolution of Evil\":\"7917\",\"The Kitchen\":\"7918\",\"Happyland\":\"7919\",\"Ride with Norman Reedus\":\"7920\",\"The Prisoner\":\"7921\",\"Jamie and Jimmy's Friday Night Feast\":\"7922\",\"Black Box\":\"7923\",\"Hammer House of Horror\":\"7924\",\"Operation Gold Rush with Dan Snow\":\"7928\",\"Grotesco\":\"7929\",\"Chris Tarrant: Extreme Railway Journeys\":\"7930\",\"Courage the Cowardly Dog\":\"7931\",\"Primeval: New World\":\"7932\",\"Live at the Apollo\":\"7933\",\"Northern Exposure\":\"7936\",\"The A Word\":\"7937\",\"Rick Stein's Road to Mexico\":\"7938\",\"Grand Designs: House of the Year\":\"7939\",\"The Secret Life of 4, 5 and 6 Year Olds\":\"7940\",\"XIII: The Series\":\"7941\",\"Damnation\":\"7943\",\"Snoop Dogg Presents: The Joker's Wild\":\"7944\",\"Drifters\":\"7946\",\"The Long Road Home\":\"7947\",\"Yorkshire: A Year In The Wild\":\"7948\",\"Finding Your Roots with Henry Louis Gates, Jr.\":\"7949\",\"Children's Ward\":\"7950\",\"Texas Metal\":\"7951\",\"Frankie Drake Mysteries\":\"7952\",\"The Secret Daughter\":\"7953\",\"Meet the Lords\":\"7954\",\"People Magazine Investigates\":\"7955\",\"Acquitted\":\"7956\",\"Mystery of the Lost Islands\":\"7957\",\"The Firm\":\"7958\",\"Babylon Berlin\":\"7959\",\"The Letdown\":\"7960\",\"How TV Ruined Your Life\":\"7961\",\"Exodus: Our Journey\":\"7964\",\"Sisters (AU)\":\"7965\",\"Iron Chef Showdown\":\"7966\",\"Life And Death Row\":\"7967\",\"Ritual\":\"7968\",\"Sea Oak\":\"7969\",\"Love You More\":\"7970\",\"The Climb\":\"7971\",\"The Celts: Blood Iron and Sacrifice with Alice Roberts and Neil Oliver\":\"7973\",\"Lady Dynamite\":\"7975\",\"Log Cabin Living\":\"7976\",\"Holiday Baking Championship\":\"7979\",\"Meet The Putmans\":\"7980\",\"Hawaii Life\":\"7981\",\"MacGyver\":\"7983\",\"The Director's Chair\":\"7984\",\"World's Greatest Bridges\":\"7986\",\"Crime 360\":\"7987\",\"Wanted (2016)\":\"7989\",\"How to Be a Gentleman\":\"7990\",\"Against the Odds\":\"7991\",\"Daniel Tiger's Neighborhood\":\"7992\",\"Big Bad BBQ Brawl\":\"7994\",\"Building Off the Grid\":\"7995\",\"Britain's Bloodiest Dynasty\":\"7996\",\"Marriage Boot Camp: Reality Stars\":\"7997\",\"Finding Beasts\":\"7998\",\"Manzo'd with Children\":\"7999\",\"The Grim Adventures of Billy & Mandy\":\"8000\",\"Fubar Age of Computer\":\"8001\",\"Au service de la France\":\"8002\",\"Most Expensivest\":\"8003\",\"The Warfighters\":\"8004\",\"King Alfred and the Anglo Saxons\":\"8005\",\"Wildest Islands of Indonesia\":\"8006\",\"Wild Untamed Brazil\":\"8007\",\"Out of Egypt\":\"8010\",\"Jungle Atlantis\":\"8012\",\"Beneath New Zealand\":\"8014\",\"A History of Ancient Britain\":\"8015\",\"AMC Visionaries: Robert Kirkman's Secret History of Comics\":\"8017\",\"Australian Crime Stories\":\"8018\",\"Cat vs. Dog\":\"8019\",\"Dinotrux Supercharged\":\"8020\",\"Man's Greatest Food\":\"8021\",\"Spring Tide\":\"8022\",\"Howards End\":\"8023\",\"My Lottery Dream Home\":\"8025\",\"Rattled\":\"8026\",\"Texas Cake House\":\"8027\",\"Stella (2012)\":\"8028\",\"Team Umizoomi\":\"8029\",\"Mission Hill\":\"8030\",\"Xscape: Still Kickin' It\":\"8031\",\"Okkupert\":\"8032\",\"The Phantom (TV Mini-Series) (2009)\":\"8035\",\"Hassel (2017)\":\"8036\",\"Quartet\":\"8037\",\"American Jungle\":\"8038\",\"America's Secret Slang\":\"8039\",\"The Story of Us with Morgan Freeman\":\"8040\",\"The Job Interview\":\"8041\",\"Monsters Inside Me\":\"8042\",\"Loudermilk\":\"8043\",\"Flip or Flop Fort Worth\":\"8045\",\"Late Nite Eats\":\"8046\",\"Beat Bobby Flay\":\"8047\",\"The Beaverton\":\"8048\",\"dragon.ball.super\":\"8049\",\"Future Man\":\"8050\",\"Running Man\":\"8051\",\"Food Wars!: Shokugeki no Soma\":\"8053\",\"Royal Recipes\":\"8054\",\"The Kill Point\":\"8055\",\"Senke nad Balkanom\":\"8056\",\"The LXD\":\"8057\",\"Texas Flip and Move\":\"8058\",\"Ignition\":\"8059\",\"Jo Brand's Cats and Kittens\":\"8060\",\"Sick Note\":\"8061\",\"Hit the Road\":\"8062\",\"Christmas Cookie Challenge\":\"8063\",\"The Fifth Estate\":\"8064\",\"Secret Lives of the Super Rich\":\"8066\",\"Snoop Dogg Presents The Joker's Wild\":\"8067\",\"Operation Grand Canyon with Dan Snow\":\"8068\",\"The Hunt for the Zodiac Killer\":\"8069\",\"Salamander\":\"8070\",\"James and Jupp\":\"8072\",\"Saturday Mash-Up\":\"8073\",\"Nowhere Fast\":\"8074\",\"Classic Countdown\":\"8075\",\"Porridge (2016)\":\"8076\",\"Creeped Out\":\"8077\",\"World War II: Witness to War\":\"8078\",\"Cassandra French's Finishing School\":\"8079\",\"The Secret Life of the Zoo\":\"8081\",\"There's... Johnny!\":\"8082\",\"FBI: Criminal Pursuit\":\"8084\",\"Heavy Rescue: 401\":\"8085\",\"Wishfart\":\"8086\",\"Murder on the Internet\":\"8087\",\"Code Geass\":\"8088\",\"Home Town (2017)\":\"8089\",\"Fate/Zero\":\"8090\",\"Psycho-Pass\":\"8091\",\"Wartime Crime\":\"8092\",\"Food Paradise\":\"8093\",\"Beach Hunters\":\"8094\",\"Food: Fact or Fiction\":\"8095\",\"Vegas Cakes\":\"8096\",\"Trump: An American Dream\":\"8097\",\"Love, Lies & Records\":\"8098\",\"Peter Kays Car Share\":\"8099\",\"Parasyte: The Maxim\":\"8100\",\"Erased\":\"8101\",\"Ireland with Simon Reeve\":\"8102\",\"Marvel's The Punisher\":\"8103\",\"Pustina\":\"8104\",\"Keeping Australia Safe\":\"8105\",\"Southern and Hungry\":\"8106\",\"Star Trek Deep Space Nine\":\"8107\",\"Be Cool Scooby-Doo!\":\"8108\",\"Marketplace\":\"8109\",\"The Seven Deadly Sins\":\"8113\",\"Toy Hunter\":\"8115\",\"Mr. Bean\":\"8116\",\"Michael McIntyre's Big Show\":\"8117\",\"Plastic Memories\":\"8118\",\"Agatha Christie's Miss Marple\":\"8119\",\"Sweet Virginia\":\"8123\",\"Bargain Mansions\":\"8124\",\"Smile Precure!\":\"8125\",\"I'm a Celebrity: Get Me Out of Here!\":\"8126\",\"This Just In\":\"8127\",\"Caribbean Life\":\"8128\",\"The Inside\":\"8129\",\"La Liga\":\"8130\",\"I'm A Celebrity: Extra Camp\":\"8132\",\"Royal Navy School\":\"8133\",\"Extinct (2017)\":\"8134\",\"Ed, Edd n Eddy\":\"8136\",\"Would I Lie to You?\":\"8137\",\"Big Hero 6: The Series\":\"8138\",\"Marvel's Runaways\":\"8139\",\"The Oblongs\":\"8144\",\"Isabel\":\"8145\",\"Extreme Cake Makers\":\"8146\",\"No Activity (US)\":\"8147\",\"Drugsland\":\"8148\",\"Extreme Hotels\":\"8149\",\"Grave Secrets\":\"8150\",\"Sr. Avila\":\"8151\",\"Bushcraft Build-Off\":\"8152\",\"Who Killed Tupac?\":\"8153\",\"Godless (2017)\":\"8155\",\"Hodges Half Dozen\":\"8156\",\"Mary Berry's Country House Secrets\":\"8157\",\"Clash of the Grandmas\":\"8159\",\"Stephen Colbert\":\"8160\",\"Farmen\":\"8162\",\"The Best Thing I Ever Ate\":\"8163\",\"Iron Resurrection\":\"8164\",\"Blitz: The Bombs That Changed Britain\":\"8165\",\"Atomic Puppet\":\"8166\",\"Appalachian Outlaws\":\"8169\",\"Some Mothers Do 'Ave 'Em\":\"8170\",\"Love Matters\":\"8171\",\"Bring It!\":\"8173\",\"Raymond Blanc: How to Cook Well\":\"8174\",\"Derek\":\"8176\",\"Hello Stranger\":\"8177\",\"Mystery Science Theater 3000: The Return\":\"8178\",\"Cracked\":\"8179\",\"Sjätte dagen\":\"8180\",\"Keeping Faith\":\"8181\",\"Damages\":\"8183\",\"Harvey Birdman, Attorney at Law\":\"8184\",\"Journeyman\":\"8185\",\"Property Brothers at Home\":\"8186\",\"Iron Chef: Behind the Battle\":\"8187\",\"Expedition Volcano\":\"8188\",\"Dexter's Laboratory\":\"8189\",\"Women's Murder Club\":\"8190\",\"The Other Guy\":\"8193\",\"The Indian Doctor\":\"8194\",\"Sinkholes\":\"8197\",\"Employable Me\":\"8198\",\"Massive Monster Mayhem\":\"8199\",\"Static Shock\":\"8201\",\"The Stinky & Dirty Show\":\"8202\",\"The Marvelous Mrs. Maisel\":\"8203\",\"Transformers: Prime\":\"8204\",\"Skin Wars\":\"8205\",\"Drawn Together\":\"8206\",\"She's Gotta Have It\":\"8207\",\"Angry Boys\":\"8208\",\"Mutant X\":\"8209\",\"Erky Perky\":\"8210\",\"37 Problems\":\"8211\",\"Dream Corp LLC\":\"8212\",\"Curious George\":\"8213\",\"Nerds and Monsters\":\"8214\",\"Almost Naked Animals\":\"8215\",\"Breakout Kings\":\"8216\",\"Super Wings\":\"8217\",\"Superjail!\":\"8218\",\"Duck Dodgers\":\"8220\",\"DARK\":\"8221\",\"Conspiracy?\":\"8222\",\"Brunch at Bobby's\":\"8223\",\"Patti LaBelle's Place\":\"8224\",\"Weinberg\":\"8226\",\"Married With Secrets\":\"8227\",\"How It Really Happened\":\"8229\",\"Rhett & Link's Buddy System\":\"8230\",\"Welcome to Sweetie Pie's\":\"8231\",\"Stretch Armstrong and the Flex Fighters\":\"8232\",\"Coastal Railways with Julie Walters\":\"8234\",\"Gary Neville's Soccerbox\":\"8235\",\"Marvel Super Hero Adventures\":\"8236\",\"Best Ed\":\"8237\",\"The Hairy Bikers Home for Christmas\":\"8238\",\"Engine Masters\":\"8239\",\"A History of Air Travel: From Zeppelin to Concorde\":\"8240\",\"The Real Marigold on Tour\":\"8241\",\"Supershoppers\":\"8244\",\"Floribama Shore\":\"8245\",\"The Great Christmas Light Fight\":\"8246\",\"Island Medics\":\"8247\",\"Tarantula\":\"8248\",\"RelationShep\":\"8249\",\"Ambassadors\":\"8250\",\"The Mayor\":\"8251\",\"Black Clover\":\"8253\",\"Struggle Street\":\"8254\",\"Stripped\":\"8255\",\"Finding Me a Family\":\"8256\",\"David Jason's Secret Service\":\"8257\",\"Pop Goes Northern Ireland\":\"8258\",\"How to Spend It Well at Christmas with Phillip Schofield\":\"8259\",\"Handmade in Mexico\":\"8260\",\"Brunel: The Man Who Built Britain\":\"8263\",\"Happy!\":\"8264\",\"Cajun Aces\":\"8265\",\"Inside Secret Societies\":\"8266\",\"Foo Fighters Sonic Highways\":\"8267\",\"El Tiempo Entre Costuras\":\"8268\",\"Cagney & Lacey\":\"8269\",\"Shot in the Dark\":\"8270\",\"Amazingness\":\"8271\",\"Rebecka Martinsson\":\"8272\",\"Annedroids\":\"8273\",\"Counterpart\":\"8274\",\"The Onion News Network\":\"8275\",\"LEGO Friends\":\"8276\",\"Totally Amp'd\":\"8277\",\"Web Therapy (2011)\":\"8278\",\"Bye bye Sverige\":\"8279\",\"InSecurity\":\"8280\",\"Through the Keyhole (2013)\":\"8284\",\"The Circuit (2016)\":\"8286\",\"Second Jen\":\"8287\",\"Ahamed's Ramadan Diary\":\"8288\",\"Ain't That America\":\"8290\",\"The Great War\":\"8291\",\"Swashbuckle\":\"8292\",\"Johnny Bravo\":\"8294\",\"The Disappearance (2017)\":\"8295\",\"Love in the Wild\":\"8296\",\"32 Brinkburn Street\":\"8297\",\"Bancroft\":\"8298\",\"House Hunters: Outside the Box\":\"8299\",\"Knightfall\":\"8301\",\"Black Ink Crew\":\"8302\",\"MeatEater\":\"8303\",\"Vanished by the Lake\":\"8304\",\"Search Party (2016)\":\"8305\",\"The Fake News with Ted Nelms\":\"8306\",\"The Indian Detective\":\"8307\",\"Hot Date\":\"8308\",\"IT'S SUPPERTIME!\":\"8309\",\"The Menendez Murders: Erik Tells All\":\"8310\",\"Wormwood\":\"8311\",\"Channel 5 (UK) Documentaries\":\"8312\",\"Jean-Claude Van Johnson\":\"8313\",\"Generator Rex\":\"8314\",\"All Def Comedy\":\"8315\",\"The Chi\":\"8317\",\"Moving Out With Tamati\":\"8318\",\"Sheffield Real Estate\":\"8319\",\"My Floating Home\":\"8320\",\"Metal Hurlant Chronicles\":\"8321\",\"Nigel Slater's 12 Tastes of Christmas\":\"8322\",\"Bounty Hunters (2017)\":\"8323\",\"Classical Baby\":\"8324\",\"NYPD Blue\":\"8325\",\"Impossible\":\"8326\",\"The Boulet Brothers' DRAGULA\":\"8327\",\"Bondi Ink Tattoo\":\"8328\",\"Witch's Court\":\"8329\",\"The Black Donnellys\":\"8330\",\"Unique Rides\":\"8332\",\"Season 01\":\"8333\",\"Wormwood (2017)\":\"8335\",\"Containables\":\"8336\",\"Africa's Hunters\":\"8337\",\"The League of Gentlemen\":\"8338\",\"Tender Touches\":\"8339\",\"Airport Security: Colombia\":\"8340\",\"Celebrity Island with Bear Grylls\":\"8342\",\"Hollywood Treasure\":\"8343\",\"Nate & Jeremiah by Design\":\"8344\",\"Let's Get a Good Thing Going\":\"8345\",\"The Next Step\":\"8346\",\"American Greed\":\"8347\",\"The Toys That Made Us\":\"8348\",\"Dope Sheet\":\"8349\",\"Fear Itself\":\"8350\",\"Giada in Italy\":\"8351\",\"Dope\":\"8352\",\"Shark\":\"8353\",\"Rachael Ray\":\"8355\",\"Mafia's Greatest Hits\":\"8356\",\"Alvinnn!!! and The Chipmunks\":\"8358\",\"The Grill Dads\":\"8359\",\"Mako: Island of Secrets\":\"8360\",\"Fred: The Show\":\"8361\",\"You, Me & Them\":\"8362\",\"The Commander\":\"8363\",\"Tethered\":\"8364\",\"Dennis and Gnasher: Unleashed\":\"8365\",\"Dennis & Gnasher\":\"8366\",\"Zapped!\":\"8367\",\"Doodlebugs\":\"8369\",\"Antiques Roadshow (US)\":\"8371\",\"X-Men: The Animated Series\":\"8372\",\"Detective (2017)\":\"8373\",\"Cooks vs. Cons\":\"8374\",\"Little Women\":\"8375\",\"Road to the NHL Winter Classic\":\"8376\",\"Sports Night\":\"8377\",\"Malice Aforethought\":\"8378\",\"The End of the Big Cats\":\"8379\",\"Storage Wars Canada\":\"8380\",\"Flip or Flop Nashville\":\"8381\",\"LA to Vegas\":\"8382\",\"Bad Trips Abroad\":\"8383\",\"Johan Falk\":\"8384\",\"Stove Tots\":\"8385\",\"Wild Ireland: The Edge of the World\":\"8386\",\"Top Chef Jr.\":\"8387\",\"Eat, Sleep, BBQ\":\"8388\",\"Romper Stomper\":\"8389\",\"Billion Dollar Deals and How They Changed Your World\":\"8391\",\"New World Order\":\"8392\",\"Only an Excuse\":\"8393\",\"McMafia\":\"8394\",\"Alone Together\":\"8395\",\"Freedom Fighters: The Ray\":\"8396\",\"Boys Over Flowers (KR)\":\"8397\",\"Better Late Than Never\":\"8398\",\"Takeshi's Castle: Thailand\":\"8399\",\"#blacklove\":\"8400\",\"The Killer Speaks\":\"8401\",\"Kate Humble: Off the Beaten Track\":\"8402\",\"Girlfriends\":\"8403\",\"DayBreak\":\"8404\",\"Tom Kerridge's Lose Weight for Good\":\"8405\",\"Trust Me, I'm a Doctor\":\"8406\",\"grown-ish\":\"8407\",\"9-1-1\":\"8408\",\"The Frozen Dead\":\"8409\",\"He Shed She Shed\":\"8410\",\"My City's Just Not That Into Me\":\"8411\",\"Baked in Vermont\":\"8412\",\"The Perfect Suspect\":\"8413\",\"WAGS: Atlanta\":\"8414\",\"See No Evil (2015)\":\"8415\",\"Way to Go\":\"8416\",\"Joyride\":\"8417\",\"Gin to Kin\":\"8418\",\"UniKitty!\":\"8419\",\"Derry Girls\":\"8420\",\"The Ray Bradbury Theater\":\"8421\",\"The Boarding School\":\"8422\",\"Good Game (2017)\":\"8423\",\"Devilman Crybaby\":\"8424\",\"Rotten\":\"8425\",\"The Four: Battle for Stardom\":\"8426\",\"Hairy Bikers' Mediterranean Adventure\":\"8427\",\"A House Through Time\":\"8428\",\"La casa de papel:Season 01\":\"8429\",\"Lab Rats: Elite Force\":\"8430\",\"A Stitch in Time\":\"8431\",\"Next of Kin\":\"8432\",\"The End of the F***ing World\":\"8433\",\"SchlossEinstein\":\"8434\",\"The Interrogation Room\":\"8438\",\"Child Support\":\"8439\",\"Rome Unpacked\":\"8440\",\"Waterfront House Hunting\":\"8441\",\"Hard Sun\":\"8442\",\"X-Men The Animated Series\":\"8443\",\"Merlí\":\"8444\",\"Sliders\":\"8445\",\"Nirvana The Band The Show\":\"8446\",\"Building Giants\":\"8447\",\"Small Town Security\":\"8448\",\"Sister Wives\":\"8449\",\"Zombie House Flipping\":\"8450\",\"Tiny House Hunting\":\"8451\",\"Surgeons: At the Edge of Life\":\"8452\",\"Junkyard Gold\":\"8453\",\"My Wife and Kids\":\"8454\",\"Kim of Queens\":\"8455\",\"Abby's Ultimate Dance Competition\":\"8456\",\"Lone Star Law\":\"8457\",\"America's Next Top Model\":\"8458\",\"Little Women: Terras Little Family\":\"8459\",\"Backstage\":\"8460\",\"Stacey Dooley Investigates\":\"8461\",\"Ellen's Game of Games\":\"8463\",\"House of Saud: A Family at War\":\"8464\",\"La casa de papel\":\"8465\",\"Can't Cope, Won't Cope\":\"8466\",\"Love Hina\":\"8467\",\"Brass Eye\":\"8468\",\"The Clinic\":\"8469\",\"Lucy Worsley's Nights at the Opera\":\"8470\",\"The Smoking Gun Presents: The World's Dumbest\":\"8471\",\"Ja'mie: Private School Girl\":\"8472\",\"Star Wars The Clone Wars\":\"8474\",\"Barter Kings\":\"8475\",\"Jam\":\"8477\",\"Beyond Scared Straight\":\"8478\",\"Iron Yarmulke\":\"8479\",\"Please Sir\":\"8480\",\"False Flag\":\"8481\",\"Living Single\":\"8482\",\"LoliRock\":\"8483\",\"Ack Värmland\":\"8484\",\"England's Forgotten Queen: The Life and Death of Lady Jane Grey\":\"8485\",\"Big Cats\":\"8486\",\"Nighty Night\":\"8487\",\"Outcasts\":\"8488\",\"Growing Up Fisher\":\"8489\",\"Somebody Feed Phil\":\"10222\",\"Mega Machines\":\"8491\",\"Somebody Feed Phil - Season 1\":\"8492\",\"The World According to Kids\":\"8494\",\"Louis Theroux's Weird Weekends\":\"8495\",\"Vanderpump Rules: Jax And Brittany Take Kentucky\":\"8496\",\"Human Remains\":\"8497\",\"Nathan Barley\":\"8498\",\"Born This Way\":\"8499\",\"Family By the Ton\":\"8500\",\"Hoarding: Buried Alive\":\"8501\",\"Wilderness Vet\":\"8502\",\"The Voyager with Josh Garcia\":\"8503\",\"The Code (2014)\":\"8504\",\"Pretty Wicked Moms\":\"8505\",\"Burden of Truth\":\"8506\",\"One Born Every Minute (US)\":\"8507\",\"Destination Truth\":\"8508\",\"Kiri\":\"8509\",\"Man Like Mobeen\":\"8510\",\"Yellowstone\":\"8511\",\"The Adventures Of Kid Danger\":\"8512\",\"Silk Stalkings\":\"8513\",\"Wallykazam!\":\"8514\",\"Mob Wives\":\"8515\",\"Savage Kingdom\":\"8516\",\"Hot Streets\":\"8517\",\"Swipe Right for Murder\":\"8518\",\"Jodi Arias: An American Murder Mystery\":\"8519\",\"Billionaire Babies: 24 Carat Kids\":\"8521\",\"Monster Bug Wars!\":\"8522\",\"The Martin Lewis Money Show\":\"8523\",\"Seeking Sister Wife\":\"8524\",\"Inside the Actors Studio\":\"8525\",\"Island Life\":\"8526\",\"Shababnikim\":\"8527\",\"Chain of Command\":\"8528\",\"First Dates Hotel\":\"8529\",\"Bag of Bones\":\"8530\",\"The Canadians\":\"8531\",\"Resistance\":\"8532\",\"La peste\":\"8533\",\"Atlanta Exes\":\"8534\",\"Barely Famous\":\"8535\",\"Black Lightning\":\"8536\",\"The Paynes\":\"8537\",\"Final Appeal\":\"8538\",\"Europe's Great Wilderness\":\"8539\",\"Basketball Wives LA\":\"8540\",\"Undercover High\":\"8542\",\"Homicide for the Holidays\":\"8543\",\"Bye Felicia\":\"8544\",\"Rooster and Butch\":\"8545\",\"Valley Cops\":\"8546\",\"Total Bellas\":\"8547\",\"Tesla's Death Ray: A Murder Declassified\":\"8548\",\"Corporate\":\"8549\",\"Jack Taylor\":\"8550\",\"Case Histories\":\"8553\",\"Inspector Gadget (2015)\":\"8554\",\"Drug Lords\":\"8555\",\"Relative Success with Tabatha\":\"8556\",\"Hitler's Empire: The Post War Plan\":\"8557\",\"Gold Rush: White Water\":\"8558\",\"Austin Stories\":\"8559\",\"American Experience\":\"8560\",\"Remember Me\":\"8561\",\"The Escape Artist\":\"8562\",\"Trolls: The Beat Goes On!\":\"8563\",\"Rita\":\"8564\",\"Hugh's Wild West\":\"8565\",\"NightMan\":\"8566\",\"Monty Don's Paradise Gardens\":\"8567\",\"Untouchable (2017)\":\"8568\",\"Taxi\":\"8569\",\"Manhunt Unabomber\":\"8570\",\"Darknet\":\"8571\",\"The Adventures of Pete and Pete\":\"8573\",\"The Resident\":\"8574\",\"Beauty Queen and Single\":\"8575\",\"Naturally, Danny Seo\":\"8576\",\"Love After Lockup\":\"8577\",\"Under Suspicion (2015)\":\"8578\",\"The Biggest Little Railway in the World\":\"8579\",\"The Lizzie Borden Chronicles\":\"8580\",\"The Launch\":\"8583\",\"The Alienist\":\"8584\",\"Mosaic\":\"8585\",\"Secrets from the Sky\":\"8586\",\"Family Therapy with Dr. Jenn\":\"8587\",\"Dennis & Gnasher Unleashed!\":\"8588\",\"Andy Richter Controls the Universe\":\"8589\",\"Britannia\":\"8590\",\"Salvage Hunters Classic Cars\":\"8591\",\"Monty Dons Paradise Gardens\":\"8592\",\"Llama Llama\":\"8593\",\"One Day at a Time (2017)\":\"8594\",\"Dirty Money (2018)\":\"8595\",\"Pinky Dinky Doo\":\"8597\",\"The Miniaturist\":\"8598\",\"Cardcaptor Sakura: Clear Card\":\"8599\",\"Channel 4 (UK) Documentaries\":\"8600\",\"Grace & Favour\":\"8601\",\"Are You Being Served?\":\"8602\",\"As Time Goes By\":\"8603\",\"A Stranger in My Home\":\"8604\",\"Wizards of Waverly Place\":\"8605\",\"Altered Carbon\":\"8606\",\"Taboo\":\"8607\",\"Dude, You're Screwed\":\"8609\",\"Bridget and Eamon\":\"8610\",\"Jonathan Creek\":\"8611\",\"Il Candidato\":\"8612\",\"Kenny Starfighter\":\"8614\",\"Law & Order: UK\":\"8615\",\"A Touch of Frost\":\"8616\",\"Drama Stage\":\"8617\",\"Limmy's Show!\":\"8618\",\"Moving On\":\"8619\",\"James Patterson's Murder Is Forever\":\"8620\",\"Next Of Kin (2018)\":\"8622\",\"2 Dope Queens\":\"8623\",\"American Occult\":\"8624\",\"Bloodlands\":\"8625\",\"On The Buses\":\"8626\",\"The Wonder Years\":\"8627\",\"Croupier\":\"8629\",\"Mia och Klara\":\"8630\",\"HippHipp!\":\"8631\",\"Step Up: High Water\":\"8632\",\"The Darkest Hour\":\"8633\",\"Jonah from Tonga\":\"8634\",\"In Sickness and in Health\":\"8635\",\"GRAND PRIX Driver\":\"8636\",\"That Peter Kay Thing\":\"8637\",\"Ben 10 (2016)\":\"8638\",\"Kath & Kim 2002\":\"8639\",\"Injustice\":\"8640\",\"Below the Surface\":\"8641\",\"The Take\":\"8642\",\"Animals with Cameras\":\"8643\",\"The Stray\":\"8644\",\"Surviving Evil\":\"8645\",\"The Adventures of Jimmy Neutron Boy Genius\":\"8646\",\"The Troop\":\"8647\",\"DuckTales (2017)\":\"8648\",\"Macken\":\"8650\",\"Kvarteret Skatan\":\"8651\",\"Thirty Plus\":\"8652\",\"Lasermannen\":\"8653\",\"Hinsehaxan\":\"8654\",\"Bibliotekstjuven\":\"8655\",\"Hammarkullen\":\"8656\",\"Tron: Uprising\":\"8659\",\"Chasing Cameron\":\"8661\",\"Unlocking the Truth\":\"8664\",\"Lockup: Women Behind Bars\":\"8665\",\"Weaponology\":\"8666\",\"Lockup: First Timers\":\"8667\",\"Lockup: Maximum Security\":\"8668\",\"Desus & Mero\":\"8669\",\"Round Planet\":\"8670\",\"Breaking In\":\"8671\",\"Him & Her\":\"8672\",\"Big Brother (US)\":\"8674\",\"Trauma (2018)\":\"8675\",\"Re:Mind\":\"8676\",\"Hellraiser Judgment\":\"8677\",\"Everything Sucks!\":\"8681\",\"Facing Evil\":\"8682\",\"Planeta Calleja\":\"8683\",\"History's Strongest Disciple Kenichi\":\"8684\",\"Morgonsoffan\":\"8685\",\"My Gym Partner's a Monkey\":\"8686\",\"SMASH\":\"8687\",\"The Young Ones\":\"8692\",\"Bryan Inc\":\"8693\",\"Christopher Kimballs Milk Street Television\":\"8694\",\"Salvage Hunters\":\"8695\",\"Arthur C. Clarke's Mysterious World\":\"8696\",\"Packed to the Rafters\":\"8697\",\"Tales of the Gold Monkey\":\"8698\",\"Volando Voy\":\"8699\",\"Soap\":\"8700\",\"Family Ties\":\"8702\",\"V\":\"8709\",\"Initial D\":\"8710\",\"Crashing (2017)\":\"8711\",\"Dark Minds\":\"8712\",\"Human Trafficking\":\"8713\",\"Byhåla\":\"8714\",\"Big Fix Alaska\":\"8715\",\"Thundercats\":\"8716\",\"Teenage Mutant Ninja Turtles (2003)\":\"8717\",\"Gargantia on the Verdurous Planet\":\"8718\",\"BEATLESS\":\"8719\",\"Loonatics Unleashed\":\"8720\",\"Squinters\":\"8721\",\"Lloyd in Space\":\"8723\",\"Winx Club\":\"8724\",\"The Trixie & Katya Show\":\"8725\",\"Topp Country\":\"8726\",\"Waco\":\"8727\",\"Big Papi Needs a Job\":\"8729\",\"Ultimate Expedition (US)\":\"8732\",\"The Big Ward\":\"8733\",\"24 Hours in A&E\":\"8734\",\"Heathers\":\"8735\",\"Celebrity Big Brother (US)\":\"8738\",\"Watch What Happens Live with Andy Cohen\":\"8739\",\"Impossible Builds\":\"8740\",\"Karena and Kasey's Kitchen Diplomacy\":\"8741\",\"Death Row Chronicles\":\"8742\",\"House Hunters\":\"8743\",\"Kiss of Death\":\"8744\",\"Laff Mobb's Laff Tracks\":\"8745\",\"Let's Get Physical\":\"8746\",\"TRL\":\"8747\",\"Animal Cops: Philadelphia\":\"8748\",\"Love Kills\":\"8749\",\"NY ER\":\"8750\",\"Nicky, Ricky, Dicky & Dawn\":\"8751\",\"I (Almost) Got Away With It\":\"8753\",\"Ridiculous Cakes\":\"8754\",\"Vanity Fair Confidential\":\"8755\",\"Lidia's Kitchen\":\"8757\",\"Valerie's Home Cooking\":\"8758\",\"Trisha's Southern Kitchen\":\"8759\",\"Pingu\":\"8760\",\"Sea Cities\":\"8761\",\"Doctor Finlay (1993)\":\"8762\",\"Numb Chucks\":\"8763\",\"Extra 3\":\"8764\",\"Jump!\":\"8765\",\"From Ice to Fire: The Incredible Science of Temperature\":\"8766\",\"Stargate Origins\":\"8767\",\"PBS NewsHour\":\"8768\",\"NHL On The Fly\":\"8769\",\"Real, Fake or Unknown\":\"8770\",\"Whatcha Packin' with Michelle Visage\":\"8771\",\"Bride Killa\":\"8772\",\"Enginuity\":\"8773\",\"Seven Seconds\":\"8775\",\"The Bachelor Winter Games\":\"8776\",\"Rocky Mountain Railroad\":\"8781\",\"Britain's Most Evil Killers\":\"8782\",\"Untold Stories of the E.R.\":\"8783\",\"Kick Buttowski\":\"8785\",\"100 Questions\":\"8786\",\"ThunderCats (2011)\":\"8787\",\"NBA Inside Stuff\":\"8788\",\"The Politician's Wife\":\"8789\",\"Homicide City\":\"8790\",\"There's Nothing to Worry About!\":\"8791\",\"Alfresco\":\"8792\",\"Men Behaving Badly\":\"8793\",\"Game Shakers\":\"8794\",\"The Young Offenders\":\"8795\",\"heute-show\":\"8796\",\"Little Women Atlanta\":\"8797\",\"Tamar & Vince\":\"8798\",\"Celebrity Big Brother's Bit On The Side\":\"8799\",\"American Pickers: Best of\":\"8800\",\"Ugly Delicious\":\"8802\",\"Breathe\":\"8803\",\"PBS NewsHour Weekend\":\"8804\",\"College Gameday\":\"8805\",\"Jeff Leeson: Off The Cuff\":\"8808\",\"Bargoens\":\"8809\",\"Our Cartoon President\":\"8812\",\"Piglet's Big Movie\":\"8813\",\"Infinite Challenge\":\"8814\",\"The Voice (FR)\":\"8816\",\"America: Facts vs. Fiction\":\"8817\",\"Dragons Den (UK)\":\"8819\",\"De helden van Arnout\":\"8820\",\"Hold the Sunset\":\"8826\",\"Bizarre Foods\":\"8827\",\"The Oath\":\"8828\",\"The Trade\":\"8829\",\"Here and Now (2018)\":\"8831\",\"Revenge Body with Khloé Kardashian\":\"8832\",\"Married at First Sight (AU)\":\"8833\",\"To Rome for Love\":\"8834\",\"Gardening Australia\":\"8836\",\"Endangered Species\":\"8837\",\"Please Teacher!\":\"8838\",\"My So-Called Life\":\"8839\",\"Onegai Twins\":\"8840\",\"Shakespeare & Hathaway: Private Investigators\":\"8841\",\"My Kitchen Rules\":\"8843\",\"The Worst Witch (2017)\":\"8844\",\"Classic Mary Berry\":\"8848\",\"Living Biblically\":\"8850\",\"Agatha Raisin\":\"8851\",\"Good Girls\":\"8852\",\"Sam\":\"8853\",\"Love & Hip Hop Miami\":\"8854\",\"Winter Road Rescue\":\"8855\",\"Final Space\":\"8856\",\"Les innocents\":\"8857\",\"My Strange Addiction\":\"8858\",\"Mum\":\"8859\",\"Wild Castles\":\"8860\",\"Two Greedy Italians\":\"8861\",\"This Time Next Year (US)\":\"8862\",\"Winter Break: Hunter Mountain\":\"8863\",\"Bethenny and Fredrik\":\"8864\",\"Back in Time for Tea\":\"8865\",\"Intruders (2017)\":\"8866\",\"Dara O Briain's Go 8 Bit\":\"8867\",\"Nix Festes\":\"8868\",\"Hidden (2018)\":\"8869\",\"The Pink Panther\":\"8870\",\"Jericho (2005)\":\"8871\",\"This Crowded House\":\"8872\",\"Struggle for Life\":\"8873\",\"Beautiful People\":\"8874\",\"Full Patte\":\"8875\",\"india's lost worlds\":\"8876\",\"Africa's Deadliest\":\"8877\",\"everest\":\"8878\",\"Too Cute\":\"8879\",\"Strip the Cosmos\":\"8880\",\"Gear Dogs\":\"8881\",\"Arena (1975)\":\"8882\",\"Massage Tantei Joe\":\"8883\",\"The Same Sky\":\"8884\",\"Twin Turbos\":\"8885\",\"Bliss\":\"8887\",\"The Detectives (2018)\":\"8888\",\"Slutever (2018)\":\"8889\",\"Doctor Finlay\":\"8890\",\"Martha & Snoop's Potluck Dinner Party\":\"8891\",\"Glam Masters\":\"8892\",\"RuPaul's Drag Race: Untucked!\":\"8894\",\"The Looming Tower\":\"8895\",\"Everest: Beyond the Limit\":\"8898\",\"Kath & Kim\":\"8899\",\"Miller Junction\":\"8900\",\"Big Brother: Over the Top\":\"8902\",\"Comedy Central Presents\":\"8903\",\"Little Dog\":\"8904\",\"Civilisations (2018)\":\"8905\",\"Music City\":\"8906\",\"Showtime at the Apollo\":\"8907\",\"Flint Town\":\"8908\",\"B: The Beginning\":\"8909\",\"Barnwood Builders\":\"8910\",\"American Ninja Warrior: Ninja vs. Ninja\":\"8911\",\"Full Moon\":\"8912\",\"Metod\":\"8913\",\"We'll Meet Again\":\"8914\",\"Mossad 101\":\"8916\",\"Requiem\":\"8917\",\"Black Card Revoked\":\"8919\",\"BET's Mancave\":\"8920\",\"VH1 Beauty Bar\":\"8921\",\"Fangar\":\"8922\",\"Ebersberg\":\"8923\",\"Laurieann Gibson: Beyond the Spotlight\":\"8924\",\"Low Winter Sun\":\"8925\",\"Clowntergeist\":\"8926\",\"Troy Fall Of City\":\"8927\",\"Tro, hopp och kärlek\":\"8928\",\"Grounded for Life\":\"8929\",\"Troy Fall of a City\":\"8930\",\"Girlfriend's Guide to Divorce\":\"8931\",\"Hannah Montana\":\"8933\",\"60 Minutes\":\"8934\",\"Harmon\":\"8935\",\"The Demolition Man\":\"8936\",\"Troy: Fall of a City\":\"8937\",\"Girls Incarcerated\":\"8938\",\"Iyanla, Fix My Life\":\"8939\",\"Guy's Family Road Trip\":\"8940\",\"Busytown Mysteries\":\"8941\",\"Knight Squad\":\"8942\",\"Mystery Diners\":\"8943\",\"Sewing With Nancy\":\"8944\",\"The Vicar Of Dibley\":\"8945\",\"The Prosecutors: Real Crime and Punishment\":\"8946\",\"Launch\":\"8947\",\"Kipat Barzel\":\"8948\",\"Apple & Onion\":\"8949\",\"Scam City\":\"8950\",\"The Magicians\":\"8951\",\"See No Evil: The Moors Murders\":\"8952\",\"Harbour Lives\":\"8953\",\"La stagiaire\":\"8954\",\"Duel au soleil\":\"8955\",\"The New Adventures of Winnie the Pooh\":\"8956\",\"Jack and Dean of All Trades\":\"8957\",\"The Haunted Hathaways\":\"8958\",\"The Sarah Silverman Program\":\"8959\",\"East West 101\":\"8960\",\"Top Boy\":\"8961\",\"Little Women: Terra's Little Family\":\"8962\",\"East of Everything\":\"8963\",\"Little Women: NY\":\"8964\",\"This Farming Life\":\"8965\",\"You Should Really See A Doctor\":\"8966\",\"Belfer\":\"8967\",\"Richard Hammond's Crash Course\":\"8968\",\"Spotlight\":\"8969\",\"Kasim Bæder\":\"8970\",\"Un village français\":\"8971\",\"Black Harbour\":\"8972\",\"Nieuwe buren\":\"8973\",\"Still Game\":\"8976\",\"Travel Waes\":\"8978\",\"If Loving You Is Wrong\":\"8979\",\"Anh's Brush with Fame\":\"8980\",\"My Big Fat American Gypsy Wedding\":\"8981\",\"Zero Hour\":\"8982\",\"Ordinary Lies\":\"8983\",\"Transcendent\":\"8984\",\"The Adventures of Napkin Man!\":\"8985\",\"Lipstick Jungle\":\"8986\",\"Kourtney & Kim Take Miami\":\"8987\",\"Mar de plástico\":\"8988\",\"Money and Violence\":\"8989\",\"Atlantis\":\"8990\",\"Home: Adventures with Tip & Oh\":\"8992\",\"Penn Zero: Part-Time Hero\":\"8993\",\"Khloé & Lamar\":\"8994\",\"Bankerot\":\"8995\",\"Good Cop\":\"8996\",\"I am the Ambassador\":\"8997\",\"The Story of Tracy Beaker\":\"8998\",\"Secret Diary of a Call Girl\":\"8999\",\"Aquarius\":\"9000\",\"Celebrity Rehab with Dr. Drew\":\"9001\",\"Kingin with Tyga\":\"9002\",\"Check It Out! with Dr. Steve Brule\":\"9003\",\"Dara O Briain: School of Hard Sums\":\"9004\",\"Tokyo Ghoul: Root A\":\"9005\",\"Monster Allergy\":\"9006\",\"Bake Off Creme De La Creme\":\"9007\",\"Snooki & JWOWW\":\"9008\",\"Memphis Beat\":\"9009\",\"Brick City\":\"9010\",\"Firsthand\":\"9011\",\"Behind the Mask\":\"9012\",\"Kate and Mim-Mim\":\"9013\",\"In the Heat of the Night\":\"9014\",\"Damo and Ivor\":\"9015\",\"The Great Holiday Baking Show\":\"9016\",\"Most Extreme Elimination Challenge\":\"9017\",\"Greatest Party Story Ever\":\"9018\",\"The 7D\":\"9019\",\"Balls Deep\":\"9020\",\"Chowder\":\"9021\",\"NY Med\":\"9022\",\"Noisey\":\"9023\",\"The Dengineers\":\"9024\",\"Jeff Ross Presents Roast Battle\":\"9025\",\"Foursome (2016)\":\"9026\",\"Man vs. Wild\":\"9028\",\"De collega's\":\"9029\",\"Het Huis Anubis\":\"9030\",\"Single Ladies\":\"9031\",\"Celebrity Food Fight\":\"9032\",\"Newzoids\":\"9033\",\"Teacup Travels\":\"9034\",\"Bridget & Eamon\":\"9035\",\"Treasure Quest: Snake Island\":\"9036\",\"In an Instant\":\"9037\",\"Care Bears and Cousins\":\"9038\",\"Gamer's Guide to Pretty Much Everything\":\"9039\",\"1000 Ways to Die\":\"9040\",\"You're Only Young Twice\":\"9041\",\"Final 24\":\"9042\",\"Gaycation\":\"9043\",\"Red Bull Soapbox Race\":\"9044\",\"Kalmte kan u redden\":\"9045\",\"Deadly Devotion\":\"9046\",\"Dora and Friends: Into the City!\":\"9047\",\"Just Good Friends\":\"9048\",\"Harry Enfield and Chums\":\"9050\",\"Lazy Company\":\"9051\",\"La coccinelle de Gotlib\":\"9052\",\"Make Me a Millionaire Inventor\":\"9053\",\"Flipping Vegas\":\"9054\",\"No Such Thing as the News\":\"9055\",\"My Life in Books\":\"9056\",\"Shame\":\"9057\",\"Mike the Knight\":\"9058\",\"Asian Provocateur\":\"9059\",\"Bobby's World\":\"9060\",\"Saxondale\":\"9061\",\"Newsreaders\":\"9062\",\"Dave Gorman: Modern Life Is Goodish\":\"9063\",\"Booze Traveler: Best Bars\":\"9064\",\"The Trap Door\":\"9065\",\"Scooby Doo, Where Are You!\":\"9066\",\"Almost Royal\":\"9067\",\"Class of '92: Out of Their League\":\"9068\",\"The Charlie Brown and Snoopy Show\":\"9069\",\"The Code\":\"9070\",\"Underworld, Inc.\":\"9071\",\"Wild & Weird\":\"9072\",\"Underworld.Inc.\":\"9073\",\"Broke A$$ Game Show\":\"9074\",\"Horrible Histories\":\"9075\",\"You Gotta Eat Here!\":\"9076\",\"The Late Night Big Breakfast\":\"9077\",\"The Almost Impossible Gameshow\":\"9078\",\"Blue's Clues\":\"9079\",\"Charlie and Lola\":\"9080\",\"Mr. Wizard's World\":\"9081\",\"¡Mucha Lucha!\":\"9082\",\"Peter Rabbit\":\"9083\",\"Black Sheep Squadron\":\"9084\",\"Art of the Heist\":\"9085\",\"Britain's Busiest Airport: Heathrow\":\"9086\",\"Siblings\":\"9087\",\"The Instant Gardener\":\"9088\",\"OOglies\":\"9089\",\"The Numbers Game\":\"9090\",\"You're Back in the Room\":\"9091\",\"The Octonauts\":\"9092\",\"Mofy\":\"9093\",\"Angelina Ballerina: The Next Steps\":\"9094\",\"Camp Lakebottom\":\"9095\",\"The Fear\":\"9096\",\"Ultimate Airport Dubai\":\"9098\",\"Home Free\":\"9099\",\"United States of Tara\":\"9100\",\"Boy Meets Girl\":\"9101\",\"Upstairs Downstairs\":\"9102\",\"Get Well Soon\":\"9103\",\"Bedlam\":\"9104\",\"This Close\":\"9105\",\"For My Man\":\"9106\",\"Action Team\":\"9107\",\"Sundays with Alec Baldwin\":\"9108\",\"Shifting Gears With Aaron Kaufman\":\"9109\",\"Farmhouse Rules\":\"9110\",\"James May's Cars of the People\":\"9111\",\"12 oz. Mouse\":\"9112\",\"Assy McGee\":\"9113\",\"DIY le Donnie\":\"9114\",\"The Clare Balding Show\":\"9115\",\"Old Jack's Boat\":\"9116\",\"Untold Stories of the ER\":\"9117\",\"My Story\":\"9118\",\"Just Kidding\":\"9119\",\"Millie Inbetween\":\"9120\",\"The Ghost Inside My Child\":\"9121\",\"Woolly and Tig\":\"9122\",\"The Noose\":\"9123\",\"Mixels\":\"9124\",\"Cauchemar en cuisine\":\"9125\",\"Värsta språket\":\"9126\",\"Laura Trenter\":\"9127\",\"Shakedown The Town\":\"9128\",\"This Life\":\"9129\",\"H2O Abenteuer Meerjungfrau\":\"9130\",\"Descendants: Wicked World\":\"9131\",\"Bear Grylls: Survival School\":\"9132\",\"Tracey Ullman's Show\":\"9133\",\"The Greatest American Hero\":\"9134\",\"Car Share\":\"9135\",\"Extra Gear\":\"9136\",\"The Lying Game\":\"9137\",\"Glitch\":\"9138\",\"Guardians of the Galaxy\":\"9139\",\"Dinosaur King\":\"9140\",\"Shimmer and Shine\":\"9141\",\"Pac-Man and the Ghostly Adventures\":\"9142\",\"Wakako zake\":\"9143\",\"Hear Me Out\":\"9144\",\"The Galloping Gourmet\":\"9145\",\"Transformers: Prime Wars Trilogy\":\"9146\",\"Alice in Wonderland\":\"9147\",\"Crash Karaoke\":\"9148\",\"Bananas In Pyjamas (2011)\":\"9149\",\"Divided States\":\"9150\",\"Carson Daly\":\"9151\",\"The Secret Life of Brothers and Sisters\":\"9152\",\"New Looney Tunes\":\"9153\",\"Mr. Bean: The Animated Series\":\"9154\",\"Fate/Apocrypha\":\"9155\",\"Art, Passion & Power\":\"9156\",\"Anime e Sangue\":\"9157\",\"Upp till kamp\":\"9158\",\"Den döende detektiven\":\"9159\",\"The Hurting\":\"9160\",\"Yianni: Supercar Customiser\":\"9161\",\"Oscar's Oasis\":\"9162\",\"Ferne and Rory's Vet Tales\":\"9163\",\"Cop Car Workshop\":\"9164\",\"Guilty Rich\":\"9165\",\"Ultimate Journeys\":\"9166\",\"Kratts' Creatures\":\"9167\",\"Unsolved\":\"9168\",\"Wild Israel\":\"9169\",\"Wild Rockies\":\"9170\",\"Dinosaur Train\":\"9171\",\"Brazil Untamed\":\"9172\",\"Arabian Seas\":\"9173\",\"The Curse of Civil War Gold\":\"9174\",\"Cyberchase\":\"9175\",\"Hajimete no Gal\":\"9176\",\"Nigel Slater's Middle East\":\"9177\",\"Timeshift\":\"9178\",\"WordGirl\":\"9179\",\"The Yorkshire Steam Railway: All Aboard\":\"9180\",\"Davis Rules\":\"9181\",\"Life Sentence\":\"9184\",\"Secrets of the Lost\":\"9185\",\"Reading Rainbow\":\"9186\",\"Hitler's Circle of Evil\":\"9187\",\"Safe Harbour\":\"9188\",\"Ultimate Survival: Everest\":\"9189\",\"Wildest India\":\"9190\",\"Bad Ink\":\"9191\",\"MegaMan: NT Warrior\":\"9192\",\"Get Out Alive With Bear Grylls\":\"9193\",\"Wildest Arctic\":\"9194\",\"Jongo\":\"9195\",\"Wild North\":\"9196\",\"But I'm Chris Jericho!\":\"9199\",\"48 Hours Mystery\":\"9200\",\"Flashback (NL)\":\"9201\",\"Travel Man: 48 Hours in...\":\"9202\",\"The NRL Sunday Roast\":\"9203\",\"Nature Cat\":\"9204\",\"Not Going Out\":\"9205\",\"Great Continental Railway Journeys\":\"9206\",\"The Champions\":\"9208\",\"Truck Night In America\":\"9209\",\"Trolls the beat goes on\":\"9210\",\"Extreme Constructions\":\"9211\",\"Caillou\":\"9212\",\"Liberty Crossing\":\"9214\",\"My Next Guest Needs No Introduction With David Letterman\":\"9215\",\"Earth: Final Conflict\":\"9216\",\"Starship Icarus\":\"9217\",\"Starhyke\":\"9218\",\"Harrow\":\"9219\",\"Bridezillas\":\"9220\",\"RailRoad Australia\":\"9221\",\"Murder in the Heartland (2017)\":\"9222\",\"Design Squad\":\"9223\",\"The Taste of Success\":\"9225\",\"Martha Speaks\":\"9226\",\"Dateline: Secrets Uncovered\":\"9227\",\"Nerve Center\":\"9228\",\"Mysteries and Scandals\":\"9229\",\"Samantha Brown's Places to Love\":\"9230\",\"Mexico - One Plate at a Time\":\"9231\",\"Frenemies\":\"9232\",\"World's Most Evil Killers\":\"9233\",\"The Electric Company (2009)\":\"9234\",\"Cash Cab\":\"9236\",\"The Legacy\":\"9237\",\"The Listener\":\"9238\",\"James Martin: Home Comforts\":\"9239\",\"The Auction House\":\"9240\",\"Bodyshockers\":\"9242\",\"Dante's Cove\":\"9243\",\"Next Great Baker\":\"9244\",\"Pit Boss\":\"9245\",\"Graham Kerr's Kitchen\":\"9247\",\"Kimi ni Todoke: From Me To You\":\"9248\",\"Transformers: Robots In Disguise (2015)\":\"9249\",\"Baccano\":\"9250\",\"Toradora!\":\"9251\",\"Just For Laughs: All Access\":\"9252\",\"Great Art\":\"9253\",\"Interceptor\":\"9254\",\"Trophy Wife\":\"9255\",\"Easy\":\"9256\",\"D.I.C.E.\":\"9257\",\"Deception (2018)\":\"9258\",\"The 80's: The Decade That Made Us\":\"9259\",\"Kingpin (2018)\":\"9260\",\"Family Tools\":\"9261\",\"Lead Balloon\":\"9262\",\"64 Zoo Lane\":\"9263\",\"Rawhide\":\"9264\",\"Ramsay's Kitchen Nightmares\":\"9265\",\"Three Days to Live\":\"9266\",\"Hawaii.Five-0\":\"9268\",\"Naked and Afraid\":\"9269\",\"Christopher Kimball’s Milk Street Television\":\"9271\",\"The Master\":\"9272\",\"Call my Agent!\":\"9273\",\"CMT Crossroads (2002)\":\"9274\",\"Nailed It\":\"9275\",\"Donnie Loves Jenny\":\"9277\",\"Faking It\":\"9278\",\"Airplane Repo\":\"9279\",\"Dora the Explorer\":\"9280\",\"iHeartRadio Music Awards\":\"9281\",\"The New Frontier\":\"9282\",\"Teen Mom: Young + Pregnant\":\"9283\",\"Sons of Tucson\":\"9284\",\"Ashes to Ashes (2008)\":\"9285\",\"Ricky Gervais\":\"9286\",\"For the People (2018)\":\"9290\",\"The Hollywood Masters\":\"9291\",\"Bogan Hunters\":\"9292\",\"West of the West: Tales from California's Channel Islands\":\"9293\",\"Live From The BBC\":\"9294\",\"Life on Mars\":\"9295\",\"Rise (2018)\":\"9296\",\"Strippers\":\"9297\",\"The Footy Show\":\"9298\",\"Ultimate Brain\":\"9300\",\"Melody\":\"9301\",\"Firefighters\":\"9302\",\"Gargoyles\":\"9303\",\"Lincoln Heights\":\"9304\",\"My Boys\":\"9305\",\"The FBI Files\":\"9306\",\"The New Adventures of Old Christine\":\"9307\",\"Fugget About It\":\"9308\",\"Kjell\":\"9309\",\"Absolute Genius\":\"9310\",\"Call of the Wildman\":\"9311\",\"Les hommes de l'ombre\":\"9312\",\"Justin Time\":\"9313\",\"The Ranch (2016)\":\"9314\",\"Space Precinct\":\"9315\",\"Martha Stewart's Cooking School\":\"9316\",\"The Remix\":\"9318\",\"Tabula Rasa\":\"9319\",\"Wild Wild Country\":\"9321\",\"The World's Most Extraordinary Homes\":\"9322\",\"Rev Run's Sunday Suppers\":\"9323\",\"The Great Irish Bake Off\":\"9325\",\"he Magicians (2015)\":\"9326\",\"Pastewka\":\"9327\",\"The Secret Life of Kids\":\"9328\",\"NTSF:SD:SUV::\":\"9329\",\"Wheel of Fortune (Australia)\":\"9330\",\"Kenan & Kel\":\"9331\",\"Historieätarna\":\"9332\",\"Die Anstalt\":\"9333\",\"Eve (2015)\":\"9334\",\"The Kyle Files\":\"9335\",\"Go Back To Where You Came From\":\"9337\",\"American Chopper: Senior vs. Junior\":\"9338\",\"The Good Karma Hospital\":\"9339\",\"The Golden State Killer: It's Not Over Yet\":\"9340\",\"Instinct (2018)\":\"9341\",\"Genius Junior\":\"9342\",\"Doll & Em\":\"9343\",\"Life's Too Short\":\"9344\",\"Strangers with Candy\":\"9345\",\"Codename: Kids Next Door\":\"9346\",\"Aaron Hernandez Uncovered\":\"9347\",\"The Crossing\":\"9348\",\"Jungle Gold\":\"9349\",\"OK.K.O.Lets.Be.Heroes\":\"9350\",\"Bad Guys\":\"9352\",\"The 2018 Rose Parade Hosted by Cord & Tish\":\"9353\",\"Cold Hearted\":\"9355\",\"Sam (2016)\":\"9356\",\"Goblin Works Garage\":\"9357\",\"Great Indian Railway Journeys\":\"9358\",\"The World From Above\":\"9359\",\"Silicon Valley: The Untold Story\":\"9360\",\"Gone (2017)\":\"9362\",\"NY Ink\":\"9363\",\"Krypton\":\"9365\",\"Teach\":\"9366\",\"Queer Eye\":\"9367\",\"The Bleak Old Shop Of Stuff\":\"9368\",\"The Diary Of A Nobody\":\"9369\",\"The Great Outdoors\":\"9370\",\"Big Cats About The House\":\"9371\",\"Crawford\":\"9372\",\"Last Stop Garage\":\"9373\",\"Show Me The Movie!\":\"9374\",\"Sando\":\"9375\",\"Station 19\":\"9376\",\"Cuban Chrome\":\"9377\",\"Muppet Babies (2018)\":\"9378\",\"Thomas The Tank Engine & Friends\":\"9379\",\"Evil Talks\":\"9381\",\"The Mechanism\":\"9382\",\"Animorphs\":\"9383\",\"Dead Boss\":\"9384\",\"A.P. Bio\":\"9385\",\"Muppet Babies\":\"9386\",\"Unlocked: The World of Games, Revealed\":\"9387\",\"Jersey Shore Family Vacation\":\"9388\",\"Gordon Ramsay's Ultimate Cookery Course\":\"9389\",\"Glory Daze\":\"9390\",\"The Kids in the Hall\":\"9391\",\"The Secret Helpers\":\"9393\",\"War and Peace\":\"9394\",\"Escape to the Chateau\":\"9395\",\"Aber Bergen\":\"9396\",\"Perfect Strangers\":\"9397\",\"Made in Chelsea\":\"9398\",\"Barry\":\"9401\",\"Trust\":\"9403\",\"The Terror\":\"9404\",\"The Detail\":\"9405\",\"Footy Classified\":\"9406\",\"In Contempt\":\"9409\",\"Raising The Bar\":\"9411\",\"Caught\":\"9412\",\"Armed and Deadly: Police UK\":\"9415\",\"Leave it to Stevie\":\"9416\",\"The Jerry Springer Show\":\"9417\",\"Arranged\":\"9418\",\"One Strange Rock\":\"9420\",\"Buried: Knights Templar And The Holy Grail\":\"9421\",\"Goalstar\":\"9422\",\"The Zen Diaries of Garry Shandling\":\"9423\",\"Youth & Consequences\":\"9424\",\"True Conviction\":\"9425\",\"Worst Week\":\"9426\",\"Come Home\":\"9427\",\"Carnival Eats\":\"9428\",\"PBS Specials\":\"9430\",\"Splitting Up Together\":\"9431\",\"90 Day Fiancé: Before The 90 Days\":\"9432\",\"Love at First Flight\":\"9433\",\"Australian Spartan\":\"9434\",\"Germany's Next Topmodel\":\"9435\",\"Miriam's Big American Adventure\":\"9436\",\"Generation Gifted\":\"9437\",\"Futz!\":\"9438\",\"Longhouse Tales\":\"9439\",\"Those Scurvy Rascals\":\"9440\",\"Nilus the Sandman\":\"9441\",\"140 secondi\":\"9442\",\"Giada Entertains\":\"9443\",\"Alex, Inc.\":\"9444\",\"Giada's Holiday Handbook\":\"9445\",\"Trust (2018)\":\"9446\",\"Nick Stellino: Storyteller in the Kitchen\":\"9447\",\"Southern at Heart\":\"9448\",\"James Acaster: Repertoire\":\"9449\",\"Damned (2016)\":\"9450\",\"Great Performances\":\"9451\",\"Ice (2016)\":\"9452\",\"Who Killed Jane Doe?\":\"9454\",\"The Body Farm\":\"9456\",\"Siren (2018)\":\"9457\",\"The Dangerous Book For Boys\":\"9458\",\"The Floogals\":\"9459\",\"Welcome to the Wayne\":\"9460\",\"Rapture\":\"9461\",\"Marcia Clark Investigates The First 48\":\"9462\",\"A.P.BIO\":\"9463\",\"Pirate Islands\":\"9464\",\"Waco: Madman or Messiah\":\"9465\",\"The Wild Adventures of Blinky Bill\":\"9466\",\"Lee And Dean\":\"9467\",\"Craig of the Creek\":\"9468\",\"Teenage Mutant Ninja Turtles\":\"9470\",\"Teyana & Iman\":\"9471\",\"Star Falls\":\"9473\",\"FLCL\":\"9474\",\"To Love-Ru\":\"9476\",\"Drop Dead Diva\":\"9477\",\"Can't Pay? We'll Take It Away!\":\"9478\",\"Billy Connolly's Route 66\":\"9479\",\"Surviving Suburbia\":\"9480\",\"Happily Divorced\":\"9481\",\"Surveillance Oz\":\"9482\",\"Cranford\":\"9483\",\"Arctic Secrets\":\"9484\",\"Ha'achayot Hamutzlachot Sheli\":\"9485\",\"Me and Mrs Jones\":\"9486\",\"The Life & Times of Tim\":\"9488\",\"Franklin & Bash\":\"9489\",\"In Ice Cold Blood\":\"9491\",\"Railroad Alaska\":\"9492\",\"WWE Monday Night RAW\":\"9495\",\"Unmasking a killer\":\"9496\",\"Pie in the Sky\":\"9497\",\"Kiss Me First\":\"9498\",\"Nothing to Declare UK\":\"9500\",\"Corner Gas Animated\":\"9501\",\"Neighbours\":\"9502\",\"Customs UK\":\"9504\",\"Rob Beckett's Playing for Time\":\"9505\",\"Russell Howard & Mum: USA Road Trip\":\"9506\",\"Cunk On Britain\":\"9507\",\"My Little Life\":\"9508\",\"Jennifer Falls\":\"9509\",\"Murder Book\":\"9510\",\"Dot.\":\"9516\",\"Air Disasters\":\"9518\",\"Deep State\":\"9519\",\"In The Long Run\":\"9520\",\"Dream Cruises\":\"9521\",\"High School USA!\":\"9522\",\"The Boss Baby: Back in Business\":\"9523\",\"Bonekickers\":\"9524\",\"Scrap Kings\":\"9526\",\"Addicted\":\"9527\",\"Maggie & Bianca Fashion Friends\":\"9528\",\"The Sandlot\":\"9529\",\"Ex On The Beach: Body SOS\":\"9530\",\"Your Worst Nightmare\":\"9531\",\"The Footy Show (NRL)\":\"9532\",\"Amiche Mie\":\"9533\",\"Swedish Dicks\":\"9534\",\"Revista de la Liga\":\"9535\",\"First Team: Juventus\":\"9536\",\"Interview with the Vampire\":\"9537\",\"Non Non Biyori\":\"9538\",\"Killing Eve\":\"9540\",\"Flip or Flop Vegas\":\"9542\",\"Grace and Favour\":\"9543\",\"De Ronde\":\"9546\",\"Allah in Europa\":\"9547\",\"Edha\":\"9553\",\"Guardians of the Wild\":\"9554\",\"Ordeal by Innocence\":\"9557\",\"Best in Food\":\"9560\",\"The Weird Al Show\":\"9561\",\"Christopher Kimball's Milk Street Television\":\"9562\",\"Rab C Nesbitt\":\"9563\",\"Riphagen\":\"9564\",\"Your Husband Is Cheating On Us\":\"9565\",\"Romanzo Siciliano\":\"9567\",\"Kiss X Sis\":\"9570\",\"Ballmastrz: 9009\":\"9573\",\"Pool Kings\":\"9574\",\"Lee & Dean\":\"9575\",\"Trop\":\"9577\",\"Meteor en de machtige monster trucks\":\"9578\",\"UFC 223\":\"9579\",\"Mustangs FC\":\"9581\",\"Richard Hammond's Invisible World's\":\"9582\",\"Splitting Up Together (US)\":\"9586\",\"Secret Agent Selection: WW2\":\"9587\",\"Class of Mum and Dad\":\"9588\",\"Four Corners (1961)\":\"9589\",\"Animal Cops: Phoenix\":\"9590\",\"The Sunday Footy Show (AFL)\":\"9591\",\"Flip Wars\":\"9592\",\"Sell It Like Serhant\":\"9593\",\"AMO\":\"9594\",\"SoundFX\":\"9595\",\"Big Beach Builds\":\"9596\",\"Vice Hysteria\":\"9598\",\"Buyers Bootcamp\":\"9599\",\"grace vs abrams\":\"9600\",\"Lost in Space (2018)\":\"9601\",\"Urban Myths\":\"9602\",\"Ronia the Robber's Daughter\":\"9603\",\"Stories from Norway\":\"9604\",\"Wannabe\":\"9605\",\"The Booth At The End\":\"9606\",\"Insectibles\":\"9607\",\"Wyatt Cenac's Problem Areas\":\"9608\",\"Britain's Got Talent\":\"9609\",\"Britain's Got More Talent\":\"9610\",\"Masters of Horror\":\"9611\",\"Hunting Nazi Treasure\":\"9612\",\"Constantine: City of Demons\":\"9613\",\"Barney Bear\":\"9614\",\"Call of Duty ELITE: Friday Night Fights\":\"9615\",\"The Forest\":\"9616\",\"Big Block SingSong\":\"9617\",\"The Outer Limits\":\"9618\",\"Buck Rogers in the 25th Century\":\"9619\",\"Long Lost Family\":\"9620\",\"Britain's Biggest Warship\":\"9621\",\"Restored\":\"9622\",\"Days that Shaped America\":\"9624\",\"Southern Charm New Orleans\":\"9625\",\"Famalam\":\"9626\",\"Miguel\":\"9627\",\"Africas Hunters\":\"9629\",\"Kids on the Slope\":\"9630\",\"Deadly Intelligence\":\"9631\",\"American Ninja Warrior: Ninja vs Ninja\":\"9632\",\"H2O: Just Add Water\":\"9633\",\"McCallum\":\"9634\",\"Gypsy Sisters\":\"9635\",\"7 Water Wonders\":\"9636\",\"Class Dismissed\":\"9637\",\"Joe All Alone\":\"9640\",\"It Was Him: The Many Murders of Ed Edwards\":\"9641\",\"The Charlotte Crosby Experience\":\"9642\",\"Sullivan & Son\":\"9643\",\"Outnumbered\":\"9644\",\"Top of the Shop with Tom Kerridge\":\"9645\",\"Stephen: The Murder that Changed a Nation\":\"9646\",\"Breaking Homicide\":\"9647\",\"Forged in Fire : Knife or Death\":\"9648\",\"The Charlotte Show\":\"9650\",\"Nightmare Pets SOS\":\"9651\",\"Hip Hop Squares (2017)\":\"9652\",\"America Inside Out with Katie Couric\":\"9653\",\"Serial Killers\":\"9654\",\"Aerial Cities\":\"9655\",\"Ex on the Beach (US)\":\"9657\",\"Extreme Weight Loss\":\"9658\",\"Home From Home\":\"9659\",\"Where's Waldo?\":\"9660\",\"The Beechgrove Garden\":\"9661\",\"Jay Leno's Garage (2015)\":\"9662\",\"Aggressive Retsuko\":\"9663\",\"Dragon Pilot: Hisone and Masotan\":\"9664\",\"Survivor New Zealand\":\"9665\",\"Ellen\":\"9666\",\"Rhod Gilbert's Work Experience\":\"9667\",\"The Stand\":\"9668\",\"Christiane Amanpour: Sex & Love Around the World\":\"9669\",\"The Woman in White (2018)\":\"9670\",\"Jeremy Wade's Mighty Rivers\":\"9671\",\"Moone Boy\":\"9673\",\"Dress to Impress\":\"9674\",\"Kroll Show\":\"9675\",\"Spy Kids: Mission Critical\":\"9676\",\"The Split\":\"9677\",\"The New Legends of Monkey\":\"9678\",\"Last Outpost\":\"9679\",\"Forged in Fire: Knife or Death\":\"9680\",\"Ellie Undercover\":\"9681\",\"JDM Legends\":\"9682\",\"First Civilizations\":\"9683\",\"NOVA Wonders\":\"9684\",\"Claymore\":\"9685\",\"Walk the Prank\":\"9686\",\"The Killer Beside Me\":\"9687\",\"Food Exposed With Nelufar Hedayat\":\"9688\",\"Scene of the Crime with Tony Harris\":\"9689\",\"Forbidden: Dying for Love\":\"9690\",\"Food Paradise International\":\"9691\",\"Girlfriends (2018)\":\"9692\",\"World's Most Epic\":\"9693\",\"3%\":\"9694\",\"Rick Stein's Seafood Odyssey\":\"9695\",\"Taskmaster (US)\":\"9697\",\"Homecoming Queens\":\"9698\",\"SKAM Austin\":\"9699\",\"Wayside\":\"9700\",\"Portillo's Hidden History of Britain\":\"9701\",\"My Year with the Tribe\":\"9703\",\"Head Cases\":\"9704\",\"The Secret Circle\":\"9705\",\"Coast New Zealand\":\"9706\",\"Homefront\":\"9708\",\"The Whole Truth\":\"9709\",\"BBC Proms\":\"9710\",\"Dino Dan\":\"9711\",\"Hunter x Hunter (2011)\":\"9712\",\"The Business (2013)\":\"9713\",\"Tari Tari\":\"9716\",\"Food Wars! Shokugeki no Soma\":\"9717\",\"Sticker Shock\":\"9718\",\"Assassination Classroom\":\"9719\",\"Unusual Suspects: Deadly Intent\":\"9721\",\"The Disastrous Life of Saiki K\":\"9722\",\"Dancing with the Stars (NZ)\":\"9723\",\"Bachelor in Paradise Australia\":\"9724\",\"So, I Can't Play H!\":\"9725\",\"Snow Leopards Of Leafy London\":\"9726\",\"Just Legal\":\"9727\",\"Mountain Life\":\"9728\",\"Murders That Shocked The Nation\":\"9729\",\"Time Travel Shoujo\":\"9730\",\"Over There\":\"9731\",\"The Detectives (2015)\":\"9732\",\"The Ice Cream Show\":\"9733\",\"David and Olivia?\":\"9734\",\"amc visionaries James camerons story of science fiction\":\"9735\",\"Ready or Not\":\"9736\",\"Shuffle!\":\"9737\",\"CMT Crossroads\":\"9738\",\"Der Lack ist ab\":\"9739\",\"Missing\":\"9741\",\"Sea Patrol\":\"9743\",\"Britain's Best Home Cook\":\"9744\",\"Foxy Ladies\":\"9745\",\"The Rain\":\"9746\",\"Cobra Kai\":\"9747\",\"Aldnoah Zero\":\"9748\",\"Couple Thinkers\":\"9749\",\"Restaurant to Another World\":\"9750\",\"Kuromukuro\":\"9751\",\"Picket Fences\":\"9752\",\"Classroom of the Elite\":\"9753\",\"Mobile Suit Gundam\":\"9754\",\"Digimon Fusion\":\"9756\",\"Busted!\":\"9757\",\"The Tesla Files\":\"9758\",\"High & Dry\":\"9760\",\"Who Wants to Be a Millionaire (UK)\":\"9762\",\"Engineering Catastrophes\":\"9763\",\"Sweetbitter\":\"9764\",\"Vida\":\"9765\",\"James Cameron's Story of Science Fiction\":\"9766\",\"Orange (2016)\":\"9767\",\"Syria: The World's War\":\"9768\",\"The Crystal Maze (2017)\":\"9769\",\"Anneliezen\":\"9770\",\"Gangsta.\":\"9771\",\"Beware the Batman\":\"9772\",\"Car Fix\":\"9774\",\"No. 6\":\"9775\",\"Garth Marenghi's Darkplace\":\"9776\",\"Fall in Love with Soon Jung\":\"9777\",\"House Rules (AU)\":\"9778\",\"Nagi-Asu: A Lull in the Sea\":\"9779\",\"Broken\":\"9780\",\"Virgin\":\"9781\",\"Britain's Fat Fight with Hugh Fearnley-Whittingstall\":\"9782\",\"Hey Duggee\":\"9783\",\"The Home That 2 Built\":\"9784\",\"Diablo Guardián\":\"9785\",\"Animal Cops: Houston\":\"9786\",\"Mysteries of the Mekong\":\"9787\",\"Innocent (2018)\":\"9788\",\"The Cromarties\":\"9789\",\"Mine Hunters\":\"9791\",\"Secrets of the Earth\":\"9792\",\"All Girls Garage\":\"9796\",\"Two Guys Garage\":\"9797\",\"Velocity Dispatch\":\"9798\",\"Fishing for Giants\":\"9800\",\"Tonightly With Tom Ballard\":\"9802\",\"Nadia - The Secret of Blue Water\":\"9803\",\"House Rules AU\":\"9804\",\"Race to Escape\":\"9805\",\"Safe\":\"9807\",\"Lizzie McGuire\":\"9808\",\"Kong: King of the Apes\":\"9813\",\"Mega Decks\":\"9814\",\"Made in Abyss\":\"9815\",\"Saga of Tanya the Evil\":\"9816\",\"Louis Theroux Documentaries\":\"9817\",\"Alaska's Deadliest\":\"9818\",\"The Familiar of Zero\":\"9819\",\"Scared Rider Xechs\":\"9820\",\"Seven Deadly Sins\":\"9821\",\"Anatole\":\"9823\",\"Happy Town\":\"9824\",\"Southern Charm Savannah\":\"9825\",\"Patrick Melrose\":\"9826\",\"The Who Was? Show\":\"9830\",\"All Night\":\"9831\",\"Check it out with Dr. Steve Brule\":\"9832\",\"Kirby: Right Back at Ya!\":\"9833\",\"Trust in China\":\"9835\",\"Bad Banks\":\"9837\",\"Joey\":\"9838\",\"Money Heist\":\"9839\",\"Innocent Times\":\"9842\",\"91 Days\":\"9843\",\"Girl vs Boy\":\"9844\",\"A Bridge to the Starry Skies\":\"9845\",\"Hakata Tonkotsu Ramens\":\"9846\",\"Dragonaut - The Resonance\":\"9847\",\"Beelzebub\":\"9848\",\"Dead Of Night (2018)\":\"9849\",\"Scaredy Squirrel\":\"9850\",\"WWE 205 Live\":\"9851\",\"Bulletproof\":\"9852\",\"** 403: Series Not Permitted **\":\"9853\",\"Carter\":\"9854\",\"National Parks Top 10\":\"9855\",\"Dog Days\":\"9856\",\"This World\":\"9857\",\"Bakuman\":\"9858\",\"Dallas Cakes\":\"9859\",\"The Wedding Guru\":\"9860\",\"The Saint\":\"9862\",\"Cops UK: Bodycam Squad\":\"9863\",\"Save Me (2018)\":\"9864\",\"My House\":\"9866\",\"Century City\":\"9867\",\"SciJinks\":\"9869\",\"Booba\":\"9870\",\"Grimgar of Fantasy and Ash\":\"9871\",\"The Hotel Barclay\":\"9872\",\"Citizen Rose\":\"9873\",\"Love in the Countryside\":\"9874\",\"Million Pound Menu\":\"9875\",\"Pls Like\":\"9876\",\"An Island Parish\":\"9877\",\"American Dynasties: The Kennedys\":\"9878\",\"The Crash Detectives\":\"9879\",\"Evil Genius: The True Story of America's Most Diabolical Bank Heist\":\"9880\",\"BBC Scotland Investigates\":\"9881\",\"First Dates (NZ)\":\"9882\",\"Nineties\":\"9883\",\"Funny Girls (NZ)\":\"9884\",\"Chacha Vidhayak Hain Humare\":\"9886\",\"Antiques Roadshow (UK)\":\"9887\",\"The Joel McHale Show with Joel McHale\":\"9888\",\"My Amazing Boyfriend\":\"9889\",\"Cancer: The Emperor of All Maladies\":\"9890\",\"Galápagos\":\"9891\",\"Rabbids Invasion\":\"9892\",\"Come Back, Mister\":\"9893\",\"Design Junkies\":\"9894\",\"Trading Spaces\":\"9895\",\"The Lion Man: African Safari\":\"9896\",\"Abuse of Power\":\"9897\",\"Lost in Transition\":\"9899\",\"Heathrow: Britain's Busiest Airport\":\"9901\",\"Being Serena\":\"9902\",\"Bent\":\"9903\",\"Children's Hospital\":\"9904\",\"Kickin' It\":\"9906\",\"Joe Pera Talks With You\":\"9907\",\"Luis Miguel: The Series\":\"9908\",\"Psychoville\":\"9909\",\"Project Nazi: The Blueprints of Evil\":\"9910\",\"The Colony\":\"9911\",\"Million Dollar Extreme Presents: World Peace\":\"9912\",\"Shaunie's Home Court\":\"9913\",\"The Day My Butt Went Psycho!\":\"9914\",\"Grand Tours of Scotland's Lochs\":\"9915\",\"The Bill\":\"9916\",\"Zak Storm, Super Pirate\":\"9918\",\"The Adventures of Rocky and Bullwinkle\":\"9920\",\"Kung Fu\":\"9922\",\"QB2QB with Russell Wilson\":\"9923\",\"Explained\":\"9924\",\"Top of the World\":\"9925\",\"Hellfire Heroes\":\"9926\",\"A Craftsman's Legacy\":\"9927\",\"Hey Rookie, Welcome to the NFL\":\"9928\",\"A Very English Scandal\":\"9929\",\"The Last 24\":\"9930\",\"The Doctor Who Gave Up Drugs\":\"9931\",\"A and E Live\":\"9932\",\"P. Allen Smith's Garden Home\":\"9933\",\"Splitting Up Together (BE)\":\"9935\",\"Danger! Health Films\":\"9936\",\"Picnic at Hanging Rock\":\"9938\",\"Hayley\":\"9939\",\"Doll and Em\":\"9940\",\"Love Your Garden\":\"9941\",\"My Last Days\":\"9942\",\"Million Dollar Baby\":\"9943\",\"Teen Mom UK\":\"9944\",\"Top Of The Box\":\"9945\",\"Cheap Eats\":\"9946\",\"The Break with Michelle Wolf\":\"9951\",\"Detail From the Mind of Kobe Bryant\":\"9952\",\"Dateline NBC\":\"9953\",\"The Zimmern List\":\"9954\",\"Angela Anaconda\":\"9955\",\"dateline\":\"9956\",\"WWE Raw\":\"9957\",\"Abstract: The Art of Design\":\"9958\",\"Madness in the Fast Lane\":\"9959\",\"Grammar Schools: Who Will Get In?\":\"9960\",\"Fixer Upper: Behind the Design\":\"9961\",\"90 Day Fiancé: Happily Ever After?\":\"9962\",\"Love Connection (2017)\":\"9963\",\"The Chalet\":\"9964\",\"Charlotte's Web\":\"9965\",\"America's Got Talent\":\"9966\",\"Champions\":\"9967\",\"Stone House Revival\":\"9968\",\"The Demon Headmaster\":\"9969\",\"Cults and Extreme Belief\":\"9970\",\"Weird, True and Freaky\":\"9971\",\"Hunting ISIS\":\"9972\",\"Love Island Australia\":\"9973\",\"Hidden Potential (2018)\":\"9974\",\"Silver Spoon\":\"9975\",\"Wild C.A.T.S: Covert Action Teams\":\"9976\",\"Reverie\":\"9977\",\"K9 Cops\":\"9978\",\"Iron Chef America\":\"9979\",\"The Bureau\":\"9980\",\"All or Nothing: New Zealand All Blacks\":\"9981\",\"Richard Osman's House of Games\":\"9982\",\"Skin Tight\":\"9983\",\"The Hundred Code\":\"9986\",\"Direct Talk\":\"9989\",\"Boise Boys\":\"9993\",\"Wood Work\":\"9997\",\"Cupido\":\"9998\",\"Hyori's Bed & Breakfast\":\"9999\",\"Phenoms\":\"10000\",\"Back in Time for Dinner (AU)\":\"10001\",\"Bride of the Water God\":\"10005\",\"Have You Been Paying Attention?\":\"10007\",\"Good Vibes\":\"10008\",\"90 Day Fiancé\":\"10009\",\"Fear Thy Neighbor\":\"10010\",\"My Favorite Martian\":\"10011\",\"Seconds From Disaster\":\"10012\",\"Wrong Man\":\"10015\",\"Vet Gone Wild\":\"10017\",\"Extinct or Alive\":\"10018\",\"Dog Squad\":\"10019\",\"Pose\":\"10020\",\"Succession\":\"10021\",\"GeGeGe no Kitaro\":\"10022\",\"CBS News Sunday Morning\":\"10023\",\"Frankie Goes To Russia\":\"10024\",\"Mystery Road\":\"10025\",\"Giada On The Beach\":\"10027\",\"House Hunters International\":\"10028\",\"The Guild Garage\":\"10029\",\"Dietland\":\"10030\",\"Drain the Oceans\":\"10031\",\"Larva\":\"10032\",\"Talkin' 'Bout Your Generation\":\"10033\",\"Bake Off: The Professionals\":\"10034\",\"Buried In The Backyard\":\"10035\",\"Unapologetic With Aisha Tyler\":\"10036\",\"People Magazine Investigates: Cults\":\"10037\",\"Cults and Extreme Beliefs\":\"10038\",\"48 Hours: NCIS\":\"10040\",\"Africa: A Journey into Music\":\"10041\",\"Impulse\":\"10042\",\"Our Wild Life\":\"10043\",\"The Truth About...\":\"10044\",\"Who Do You Think You Are?\":\"10045\",\"Bizarre Foods America\":\"10476\",\"Friday On My Mind\":\"10047\",\"The Treehouse Guys\":\"10048\",\"American Woman\":\"10049\",\"Beach Bites with Katie Lee\":\"10050\",\"Penelope Keith's Coastal Villages\":\"10051\",\"Growing Up Hip Hop\":\"10052\",\"Marvel's Cloak & Dagger\":\"10053\",\"Grand Hotel (2011)\":\"10054\",\"The Hollow\":\"10055\",\"Condor\":\"10056\",\"Ultimate Pools\":\"10057\",\"The Wonderland Murders\":\"10058\",\"House of Anubis\":\"10059\",\"Britain's Secret Charity Cheats\":\"10060\",\"Louis Theroux\":\"10061\",\"Joseph Campbell and the Power of Myth\":\"10062\",\"Il miracolo\":\"10063\",\"Cake Hunters\":\"10064\",\"The Staircase\":\"10065\",\"Louis Theroux's LA Stories\":\"10066\",\"Dodo Heroes\":\"10067\",\"I Want That Wedding!\":\"10068\",\"Fiertés\":\"10069\",\"Buying Blind\":\"10070\",\"The Voice (AU)\":\"10071\",\"Big City Greens\":\"10072\",\"Kitchen Boss\":\"10073\",\"Xtreme Screams\":\"10074\",\"Julia Zemiro's Home Delivery\":\"10076\",\"La catedral de Mar\":\"10077\",\"Naked and Afraid: Savage\":\"10078\",\"Race of Life\":\"10079\",\"The Cancer Hospital\":\"10080\",\"Food Safari\":\"10081\",\"The City & The City\":\"10082\",\"A Wedding and A Murder\":\"10083\",\"Hitler's Last Stand\":\"10084\",\"The Last Defense\":\"10085\",\"Sound! Euphonium\":\"10086\",\"999: What's Your Emergency?\":\"10087\",\"The $100,000 Pyramid\":\"10088\",\"Strange Angel\":\"10089\",\"Judge John Deed\":\"10090\",\"Gotti: Godfather and Son\":\"10091\",\"Later... with Jools Holland\":\"10092\",\"Animal Cops: Miami\":\"10093\",\"Gordon Ramsay's 24 Hours to Hell & Back\":\"10094\",\"Navy SEALs: America's Secret Warriors\":\"10097\",\"Swamp Mysteries With Troy Landry\":\"10098\",\"Music City Fix\":\"10099\",\"Jumanji\":\"10100\",\"Interview\":\"10101\",\"The Mentor\":\"10102\",\"The National Parks: America's Best Idea\":\"10103\",\"Insane Pools: Off the Deep End\":\"10104\",\"Hope for Wildlife\":\"10106\",\"Solomon's Perjury\":\"10110\",\"Timon & Pumbaa\":\"10111\",\"Trump - An American Dream\":\"10112\",\"PaparaGilles\":\"10113\",\"Say Yes To The Dress Atlanta\":\"10114\",\"CNN Special Report\":\"10115\",\"Liquid Science\":\"10117\",\"To Tell The Truth (2016)\":\"10118\",\"Wild Bear Rescue\":\"10119\",\"Lakefront Bargain Hunt\":\"10120\",\"Married... with Children\":\"10121\",\"/Drive on NBCSN\":\"10123\",\"Disney's Fairy Tale Weddings\":\"10124\",\"Inside Evil with Chris Cuomo\":\"10125\",\"The Proposal\":\"10126\",\"Corvette Nation\":\"10127\",\"Marvel Disk Wars: The Avengers\":\"10128\",\"Mortimer and Whitehouse: Gone Fishing\":\"10129\",\"Yellowstone (2018)\":\"10130\",\"Yan Can Cook: Spice Kingdom\":\"10132\",\"The Dead Files\":\"10133\",\"Extreme Measures\":\"10134\",\"Joanne Weir's Plates and Places\":\"10135\",\"Live PD Presents: Women on Patrol\":\"10136\",\"High Noon\":\"10137\",\"Take Two\":\"10138\",\"Cooking on High\":\"10139\",\"Conviction: Murder in Suburbia\":\"10140\",\"The Gong Show (2017)\":\"10141\",\"The First World War\":\"10142\",\"Que Pasa USA\":\"10143\",\"Take My Wife\":\"10144\",\"Love Yurts\":\"10145\",\"Back In Time For Dinner (CA)\":\"10146\",\"Breaking Big\":\"10147\",\"Drag Race Thailand\":\"10148\",\"Joel & Nish vs The World\":\"10149\",\"The Deed\":\"10150\",\"The Price of Duty\":\"10151\",\"1600 Penn\":\"10152\",\"Burning Ice\":\"10153\",\"Hooked: Monster Fishing\":\"10154\",\"The Project\":\"10155\",\"Adult Swim Infomercials\":\"10156\",\"Bare Knuckle Fight Club\":\"10157\",\"Ainori Love Wagon: Asian Journey\":\"10158\",\"Black Sequence\":\"10159\",\"Penn & Teller: Bullshit!\":\"10160\",\"Secret City\":\"10162\",\"Double Dare (2018)\":\"10163\",\"Rapunzel's Tangled Adventure\":\"10164\",\"Crimewatch Roadshow\":\"10165\",\"WWE Smackdown Live\":\"10166\",\"Genie in the House\":\"10167\",\"Wedding Cake Championship\":\"10168\",\"Stath Lets Flats\":\"10169\",\"Girl Meets Farm\":\"10170\",\"Shop Smart, Save Money\":\"10171\",\"W817\":\"10172\",\"The Fourth Estate\":\"10173\",\"Brilliant Beasts\":\"10174\",\"The Looney Tunes Show\":\"10175\",\"If You Give a Mouse a Cookie\":\"10176\",\"Pardon The Expression\":\"10177\",\"Britain's Best Junior Doctors\":\"10178\",\"Hollywood Love Story\":\"10179\",\"Post Radical\":\"10180\",\"Tattoo Age (2017)\":\"10181\",\"Masters of Illusion (2014)\":\"10182\",\"Nailed It!\":\"10183\",\"Inspector George Gently\":\"10184\",\"Great Rail Restorations with Peter Snow\":\"10185\",\"Native America\":\"10186\",\"Olafs Frozen Adventure\":\"10187\",\"Encounters with Evil\":\"10188\",\"MONSTER ENERGY NASCAR CUP SERIES\":\"10189\",\"Double Dare\":\"10190\",\"The Misadventures of Romesh Ranganathan\":\"10191\",\"Galactica 1980\":\"10192\",\"Kandi Koated Nights\":\"10194\",\"Playground\":\"10195\",\"First Dates (AU)\":\"10196\",\"Mostly 4 Millennials\":\"10197\",\"Whose Line is it Anyway? (US)\":\"10199\",\"Cultureshock\":\"10200\",\"Ben 10: Alien Force\":\"10201\",\"Ben 10: Omniverse\":\"10202\",\"Ben 10: Ultimate Alien\":\"10203\",\"A Chef's Life\":\"10204\",\"Harvey Street Kids\":\"10205\",\"Louie\":\"10206\",\"Jerks\":\"10207\",\"To the Ends of the Earth\":\"10208\",\"Ciao Italia\":\"10209\",\"The Police Tapes\":\"10211\",\"Food Flirts\":\"10212\",\"Sacred Games\":\"10213\",\"Carpool Karaoke (2017)\":\"10214\",\"All or Nothing: A Season with the Arizona Cardinals\":\"10216\",\"Growing Pains\":\"10217\",\"Zumbo's Just Desserts\":\"10218\",\"Samantha!\":\"10219\",\"Sharp Objects\":\"10220\",\"Corey White's Roadmap to Paradise\":\"10221\",\"Pop Team Epic\":\"10223\",\"Summer Camp Island\":\"10224\",\"Very Cavallari\":\"10225\",\"Lawn & Order\":\"10226\",\"Cake Wars\":\"10227\",\"Timber Creek Lodge\":\"10228\",\"Mr. Sunshine (2018)\":\"10230\",\"Baby Ballroom\":\"10231\",\"Thye Ultimate Fighter\":\"10232\",\"The Outpost\":\"10233\",\"10 That Changed America\":\"10234\",\"Born Behind Bars\":\"10235\",\"Wellington Paranormal\":\"10236\",\"A Very Secret Service\":\"10238\",\"How to Grow a Planet\":\"10239\",\"Burgers, Brew & 'Que\":\"10241\",\"Empresses In The Palace\":\"10242\",\"TKO: Total Knock Out\":\"10243\",\"Dr. Pimple Popper\":\"10244\",\"Seatbelt Psychic\":\"10245\",\"The Comedy Lineup\":\"10246\",\"Blood Ties\":\"10247\",\"The Back Pages\":\"10248\",\"Bobcat Goldthwait's Misfits & Monsters\":\"10249\",\"Four Corners\":\"10250\",\"Comicstaan\":\"10251\",\"The Epic Tales of Captain Underpants\":\"10252\",\"China Beach\":\"10253\",\"Flipping Virgins\":\"10254\",\"Whistleblower\":\"10255\",\"Nick Cannon Presents: Wild 'N Out\":\"10256\",\"Sugar Rush (2018)\":\"10257\",\"The Dream Job\":\"10258\",\"Trinity\":\"10259\",\"Who Is America?\":\"10260\",\"My Aloha Dream Home\":\"10261\",\"The Garfield Show\":\"10262\",\"Hyperlinked\":\"10264\",\"Wild Food\":\"10265\",\"Beast Wars\":\"10266\",\"Hormones\":\"10267\",\"This Is Not A Conspiracy Theory\":\"10268\",\"Shaun of the Dead\":\"10269\",\"The Jungle Bunch\":\"10270\",\"Bug Juice: My Adventures at Camp\":\"10271\",\"Miraculous Ladybug\":\"10272\",\"SharkFest\":\"10274\",\"Queens of Comedy\":\"10276\",\"El Vato\":\"10277\",\"Traffic Cops\":\"10279\",\"The Crimson Field\":\"10280\",\"Sammy J and Randy in Ricketts Lane\":\"10281\",\"Tenacious D\":\"10282\",\"Mischievous Kiss\":\"10283\",\"Lockup\":\"10284\",\"The 'S' Word with Vanessa Lengies\":\"10285\",\"Mister Tachyon\":\"10287\",\"Fancy Nancy\":\"10288\",\"Meteor Garden (2018)\":\"10289\",\"[email protected]\":\"10290\",\"Junkyard Empire\":\"10291\",\"Hannah Gadsby: Nanette\":\"10292\",\"When Sharks Attack\":\"10294\",\"Historia de un Clan\":\"10295\",\"Four Seasons in Havana\":\"10296\",\"Dilbert\":\"10297\",\"Amazing Interiors\":\"10298\",\"Land Girls\":\"10299\",\"Dark Tourist\":\"10300\",\"Cromo\":\"10301\",\"Supervolcano\":\"10302\",\"Rise of The Teenage Mutant Ninja Turtles\":\"10304\",\"Intimate Enemy\":\"10305\",\"Dads (2013)\":\"10306\",\"Nymphs\":\"10307\",\"Scarecrow and Mrs. King\":\"10308\",\"The Grand Hustle\":\"10309\",\"Jimmy: The True Story of a True Idiot\":\"10310\",\"In Search Of (2018)\":\"10311\",\"Triple D Nation\":\"10312\",\"Ice Fantasy\":\"10313\",\"Little Women (2017)\":\"10314\",\"House of Bond\":\"10315\",\"A Korean Odyssey\":\"10316\",\"The Five Billion Pound Super Sewer\":\"10317\",\"Howie Mandel's Animals Doing Things\":\"10318\",\"Stewart Lee's Comedy Vehicle\":\"10319\",\"The Method\":\"10320\",\"Black Crows\":\"10321\",\"Deadly Rich\":\"10322\",\"The Wine Show\":\"10323\",\"Duckman\":\"10324\",\"These Woods are Haunted\":\"10326\",\"Live PD Presents PD Cam\":\"10327\",\"The History of Comedy\":\"10328\",\"Live Free or Die\":\"10329\",\"Destinos: An Introduction To Spanish\":\"10330\",\"Nadiya's Family Favourites\":\"10331\",\"Smashing Hits! The 80's Pop Map of Britain & Ireland\":\"10332\",\"No Passport Required\":\"10333\",\"Bonus Family\":\"10334\",\"Miz & Mrs\":\"10335\",\"Charité\":\"10336\",\"Jamie Private School Girl\":\"10337\",\"Dorothy and the Wizard of Oz\":\"10338\",\"La rosa de Guadalupe\":\"10340\",\"Gary and His Demons\":\"10341\",\"Castle Rock\":\"10342\",\"The Bletchley Circle: San Francisco\":\"10343\",\"Scream Street\":\"10344\",\"The Clangers\":\"10345\",\"Banshee: Origins\":\"10346\",\"Liza on Demand\":\"10347\",\"Crimes Against Nature\":\"10348\",\"The South Bank Show Originals\":\"10349\",\"GameFace\":\"10350\",\"Dead Lucky\":\"10351\",\"Captain Earth\":\"10352\",\"Killing Bites\":\"10353\",\"Adam DeVine's House Party\":\"10354\",\"The Great Food Truck Race\":\"10355\",\"The Road Trick\":\"10356\",\"Psiconautas\":\"10357\",\"Missing Korea\":\"10358\",\"Miss Dynamite\":\"10359\",\"Flipper (1964)\":\"10360\",\"Roman Empire\":\"10361\",\"Cash Cab (US)\":\"10362\",\"In Search Of... (2018)\":\"10363\",\"1916: The Irish Rebellion\":\"10364\",\"Charlie's Angels\":\"10365\",\"Shark After Dark\":\"10367\",\"Pink Collar Crimes\":\"10368\",\"Unexpected\":\"10369\",\"David Baddiel on the Silk Road\":\"10370\",\"Mind Games (2014)\":\"10371\",\"Travels in Trumpland with Ed Balls\":\"10372\",\"The Gaming Show\":\"10373\",\"Welcome to the Family (2018)\":\"10374\",\"Blood Money (2018)\":\"10376\",\"Lucky Dog\":\"10377\",\"Secrets of the Zoo\":\"10378\",\"Goblin\":\"10379\",\"Yago\":\"10380\",\"Ekaterina\":\"10381\",\"House Hunters Family\":\"10382\",\"Everyman\":\"10383\",\"Age Before Beauty\":\"10384\",\"Club de Cuervos Presents: The Ballad of Hugo Sánchez\":\"10385\",\"Beachfront Bargain Hunt\":\"10386\",\"Nella the Princess Knight\":\"10387\",\"Hard to kill\":\"10388\",\"Making It\":\"10389\",\"Switched\":\"10391\",\"F*ck That's Delicious\":\"10457\",\"QB1: Beyond the Lights\":\"10393\",\"Black\":\"10394\",\"Social Fabric\":\"10395\",\"After the Raves\":\"10396\",\"Becoming Champions\":\"10397\",\"Whicker's World\":\"10398\",\"One Foot in the Past\":\"10399\",\"The Traffickers\":\"10400\",\"Dark Blue\":\"10401\",\"Building Sights\":\"10402\",\"Perpetual Motion\":\"10403\",\"Breathing Space\":\"10404\",\"All Mod Cons\":\"10405\",\"Meet the Drug Lords: Inside the Real Narcos\":\"10406\",\"Pokémon: Origins\":\"10407\",\"Flash Gordon (1996)\":\"10408\",\"Chozen\":\"10409\",\"Deadliest Catch: The Bait\":\"10410\",\"Kid vs Kat\":\"10411\",\"Farinia – Snow on the Atlantic\":\"10412\",\"Marching Orders\":\"10413\",\"Steven Seagal: Lawman\":\"10414\",\"Timewatch\":\"10415\",\"One Hot Summer\":\"10416\",\"I Am A Killer\":\"10417\",\"Kevin Hart Presents: The Next Level\":\"10418\",\"Chasing Monsters\":\"10419\",\"Living Legends\":\"10420\",\"Making The Most Of The Micro\":\"10421\",\"Planet America\":\"10422\",\"Micro Live\":\"10423\",\"Omnibus (1967)\":\"10424\",\"The People Detective\":\"10425\",\"Tomorrow's World\":\"10426\",\"The Crimson Petal and The White\":\"10427\",\"Mad Dog Made\":\"10428\",\"Blood Money\":\"10429\",\"Life (2018)\":\"10430\",\"The Science of Star Wars\":\"10431\",\"Sideswiped\":\"10432\",\"Catching Hell\":\"10433\",\"Britain's Ancient Tracks with Tony Robinson\":\"10434\",\"Russell Coight's All Aussie Adventures\":\"10435\",\"People Magazine Investigates: Crimes of Fashion\":\"10436\",\"Conviction\":\"10437\",\"Street Smart\":\"10438\",\"Strange World (2016)\":\"10439\",\"Good Morning America\":\"10440\",\"Architecture at the Crossroads\":\"10441\",\"Ultimate Ninja Challenge\":\"10442\",\"On Children\":\"10443\",\"Detail: From the Mind of Kobe Bryant\":\"10444\",\"Someone You Thought You Knew\":\"10445\",\"Liquid Edge\":\"10446\",\"The Horn\":\"10447\",\"Ghost Hunters International\":\"10448\",\"Man Alive\":\"10449\",\"40 Minutes\":\"10450\",\"Rest In Power: The Trayvon Martin Story\":\"10451\",\"Lodge 49\":\"10452\",\"Fairground Attractions\":\"10453\",\"Yellowstone Live\":\"10454\",\"Islands of the Future\":\"10455\",\"Stewart Lee Stand-up Shows\":\"10456\",\"Breakaway (1968)\":\"10458\",\"Defence of the Realm\":\"10459\",\"Off The Rec. HYOLEE\":\"10460\",\"Reality Cupcakes\":\"10461\",\"Made In Chelsea: Croatia\":\"10462\",\"War on Waste\":\"10464\",\"Orbit: Earth's Extraordinary Journey\":\"10465\",\"Castaways\":\"10466\",\"Inside the American Embassy\":\"10467\",\"Hard Knocks (2001)\":\"10468\",\"Random Acts of Flyness\":\"10469\",\"Judge Romesh\":\"10470\",\"El Capo - El Amo del Tunel\":\"10471\",\"El Desconocido\":\"10472\",\"Argon\":\"10473\",\"I Am Me!\":\"10474\",\"Hang Ups\":\"10475\",\"Escape to the Continent\":\"10477\",\"Boomtown Builder\":\"10478\",\"Good Cheap Eats\":\"10479\",\"The Prisoner (2009)\":\"10480\",\"Insatiable\":\"10481\",\"All About The Washingtons\":\"10482\",\"Bachelorette Weekend\":\"10483\",\"The Prosecutors: In Pursuit Of Justice\":\"10485\",\"Who Were the Greeks?\":\"10486\",\"The Ponysitters Club\":\"10487\",\"Seaside Snacks & Shacks\":\"10488\",\"Broken Trust\":\"10489\",\"The House of Flowers\":\"10490\",\"72 Dangerous Animals: Asia\":\"10491\",\"Family Rules\":\"10492\",\"The Killer Closer\":\"10493\",\"Food, Booze & Tattoos\":\"10494\",\"A Pang For Brasil\":\"10495\",\"Testing Teachers\":\"10497\",\"Frisky Business\":\"10498\",\"Rebel Music\":\"10499\",\"Death: A Series About Life\":\"10500\",\"Seventeen Moments Of Spring\":\"10501\",\"£10k Holiday Home\":\"10502\",\"Love It or List It, Too\":\"10503\",\"Fatal Vows\":\"10504\",\"Victory at Sea\":\"10505\",\"Afflicted\":\"10506\",\"The Witness for the prosecution\":\"10507\",\"Dance Boss\":\"10508\",\"Show Me What You're Made Of\":\"10510\",\"Clive James' Postcard from\":\"10511\",\"Contrasts\":\"10512\",\"Our Lives\":\"10513\",\"BBC Wales Investigates\":\"10514\",\"The Vanilla Ice Project\":\"10515\",\"The Single Wives\":\"10518\",\"Ponysitters Club\":\"10519\",\"Bad Language\":\"10520\",\"Wonders of Mexico\":\"10521\",\"The 80's Greatest\":\"10522\",\"Wacky Races (2017)\":\"10523\",\"The Quon Dynasty\":\"10524\",\"Cocaine Coast\":\"10525\",\"Red Rock\":\"10526\",\"On the Edge\":\"10527\",\"All Hail King Julien: Exiled\":\"10529\",\"Mark Kermode's Secrets of Cinema\":\"10530\",\"Rip It Up\":\"10531\",\"Bite Club\":\"10532\",\"Terrace House: Opening New Doors\":\"10533\",\"Raising Tourette's\":\"10534\",\"Strange World\":\"10535\",\"All or Nothing: Manchester City\":\"10536\",\"Recipes That Made Me\":\"10537\",\"Disenchantment\":\"10538\",\"Stay Here\":\"10539\",\"Search for Second Earth\":\"10540\",\"Filthy Rich and Homeless (AU)\":\"10541\",\"Magic for Humans\":\"10542\",\"Nightwatch Nation\":\"10543\",\"Ultraviolet (2017)\":\"10544\",\"Peng Life\":\"10545\",\"The 2000s\":\"10546\",\"Look Me In The Eye\":\"10547\",\"Sex In The World's Cities\":\"10548\",\"Catherine the Great (2015)\":\"10549\",\"The Crazy Ones\":\"10550\",\"Esme & Roy\":\"10551\",\"The Travel Show\":\"10552\",\"BBC News at Ten\":\"10556\",\"Glitter Force Doki Doki (2017)\":\"10558\",\"Dokidoki! Precure\":\"10559\",\"Gay Skit Happens\":\"10560\"}");
        series_id_list = JSON.parse(GM_getValue("cached_series"));
        series_search_list = JSON.parse(GM_getValue("cached_series").toLowerCase());
    }

    //Check for cached autocomplete or add it to storage.
    if(GM_listValues().includes("cached_autocomplete")){
        autocomplete_string = GM_getValue("cached_autocomplete");
        series_autocomplete = autocomplete_string.split(',');
    }
    else{
        autocomplete_string = GM_getValue("cached_series").replace(list_parse_regex, ',').replace(list_parse_regex_end, '');

        //Keep the array as a string to store
        GM_setValue("cached_autocomplete", autocomplete_string);

        //Split the array for autocomplete search
        series_autocomplete = autocomplete_string.split(',');
    }

    if(GM_listValues().includes("next_cache")){
        if(Date.now() > GM_getValue("next_cache")){
            console.log("Updating series cache");
            getSeries(count);
        }
    }
    else{
        console.log("Updating series cache");
        getSeries(count);
    }
}

function getSeries(i){
    $.get('/artist.php?id='+i, function(data){
        data = $(data).filter("#wrapper");
        data = $(data).find("#content");

        var id;

        //If the series page isn't empty, so valid
        if(data.length != 0 && !data.text().includes("Error 404")){
            var name = $(data).find("h2").text();

            id = series_id_regex.exec($(data).find("div[class^='linkbox'] a.brackets:last").attr('href'))[1];

            series_id_list[name] = id;
            autocomplete_string += ","+name;

            GM_setValue("cached_series", JSON.stringify(series_id_list));
            GM_setValue("cached_autocomplete", autocomplete_string);

            init_count = parseInt(id);

            GM_setValue("last_id", parseInt(id));
            console.log("Cached series id "+id);
        }

        current_count++;
        if(current_count < init_count + 5){
            setTimeout(function(){ getSeries(current_count); }, 500);
        }
        else{
            console.log("Finished updating series cache, next update in 6h");
            GM_setValue("next_cache", Date.now() + 21600000);
            return;
        }
    });
}

function initSeriesSearchBar(){
    $(searchbar_series).attr('id', 'searchbar_series').find("form").attr('name','series').removeAttr('action method').find("input").removeAttr('accesskey onfocus onblur value autocomplete').attr({
        'id': 'series_search',
        'placeholder': 'Series'});

    $(searchbar_series).insertAfter($("li#searchbar_torrents"));
    $("#series_search").val('Series');

    //On focus/blur
    $("#series_search").focusin(function(){
        if($("#series_search").val() == 'Series'){
            $("#series_search").val('');
        }
    });
    $("#series_search").focusout(function(){
        if($("#series_search").val() == ''){
            $("#series_search").val('Series');
        }
    });

    //On submit
    $(searchbar_series).submit(function(e){
        e.preventDefault();

        console.log("Input: "+ $("#series_search").val());

        var input_str = $("#series_search").val().toLowerCase();
        var id_match = series_search_list[input_str];

        console.log("Series dict size: "+ Object.keys(series_search_list).length);
        console.log("Matched ID: "+id_match);

        if(id_match){
            location.href = '/artist.php?id='+id_match;
        }
    });

    //Autocomplete config and function on select
    $('#series_search').autocomplete({
        source: series_autocomplete,
        minLength: 2,
        select: function(event, ui) {
            location.href = '/artist.php?id='+series_search_list[ui.item.value.toLowerCase()];
        }
    });

    //Autocomplete CSS, basic since can't modify objects without stylesheet
    //since they appear on search only
    $("#ui-id-1").css({"max-width":"200px","background-color":"#252525", "border":"1px solid black"});
    $("[class^=ui-helper-hidden-accessible]").remove();
}

function parseReleaseName(title, curr_id){
    //Origin regex
    var scenearray = "NOIVTC,LucidTV,EDHD,Scene,SH0W,0SEC,2HD,7SinS,aAF,ACED,AiRTV,ALTEREGO,AMBIT,AMBiTiOUS,ANGELiC,ANiVCD,ARCHiViST,ARiGOLD,ASAP,ASCENDANCE,AVCDVD,AVCHD,AVS,aWake,B4F,BAJSKORV,BALLS,BAMBOOZLE,BareHD,BARGE,BATV,BAWLS,BiA,BiGBruv,BiPOLAR,BiQ,BOV,BRAVERY,BRICKSQUaD,BRiGAND,BRISK,BRMP,BWB,C4TV,CABs,CAFFEiNE,CaRaT,Catchphraser,CBFD,CBFM,CCAT,CCCAM,CCCUNT,CHAMPiONS,CiA,CiNEFiLE,CLASSiC,CLUE,CNHD,COMPETiTiON,COMPULSiON,CONSCiENCE,CookieMonster,Counterfeit,CRAVERS,CREED,CREST,CRiMSON,CROOKS,CROSSFIT,CTU,CURIOSITY,D0NK,D2V,DAA,DAH,DEADPiXEL,DEADPOOL,DEAL,DeBTViD,DEFEATER,DEFiNiTE,DEFLATE,DEiMOS,DEMAND,DEMENTED,DEPTH,DERANGED,DETAiLS,DEUTERiUM,DHD,DiCH,DiFFERENT,DIMENSION,DiVERGE,DiVERSE,DiViSiON,DOCERE,DOMiNATE,DRAWER,DUKES,EDUCATiON,EiTheL,EPiC,ETACH,euHD,EVOLVE,EwDp,EXCELENTE,EXCELLENCE,EXECUTION,EXViD,FADE,FaiLED,FAIRPLAY,FARGIRENIS,FCC,FEET,FFNDVD,FiCO,FiHTV,FilmHD,FIRST,FKKHD,FKKTV,FLATLiNE,FLEET,FLHD,FoReVer,FoV,FQM,FRiSPARK,FTP,FULLSiZE,FUtV,GAMETiME,GAYTEAM,GECKOS,GERUDO,GHOULS,GORE,GOTEi,GOTHiC,GreenBlade,GRiP,GTVG,GUFFAW,GZCrew,HAGGiS,HALCYON,HD4U,HDMI,HDR,HILSWALTB,HOLiDAY,HUNTED,hV,HYBRiS,iFH,iFPD,iGNiTiON,iHD,iKUZE,iLM,iMCARE,IMMERSE,iMMORTALs,iNCiTE,iND,iNFiNiTE,iNGOT,INNOCENCE,INQUISITION,iNSPiRED,iNTENTiON,intothevoid,iOM,ITG,Japhson,JETSET,JHD,JMT,KFV,KILLERS,KLINGON,KmF,KNiFESHARP,KNOCKOUT,KOENiG,KYR,LCHD,LiBRARiANS,LiLDiCK,LiNKLE,LiViDiTY,LMAO,LOGiES,LOL,LPH,Ltu,LYCAN,m00tv,MACK4,MAJiKNiNJAZ,MaM,MARS,MATCH,MAYHEM,MEDiEVAL,MELON,MEMENTO,METCON,MiND,MiNDTHEGAP,MiNT,MiSFiTS,MOAB,MOBTV,MOMENTUM,MORiTZ,MOROSE,MoTv,MSE,MTB,MULTiPLY,NBCTV,NBS,NCAXA,NGCHD,NODLABS,NORDiCHD,NORiTE,NOSCREENS,NSN,OMER,OMiCRON,ORENJI,ORGANiC,OSiRiS,OSiTV,OUIJA,OVERTiME,P0W4,P0W4DVD,P2W,PANZeR,PCH,PFa,PHASE,PHOBOS,PiX,PLANET3,PLUTONiUM,PREMiER,PRiNCE,PSYCHD,PUCKS,PVR,QCF,QPEL,QRUS,RAPIDO,RCDiVX,RDVAS,RedBlade,REMARKABLE,REMAX,REWARD,RiTALiN,RiVER,ROVERS,RPTV,RRH,RTA,RTL,RUGGERZ,RUNNER,S0LD13R,SADPANDA,SAiNTS,SEMTEX,SERIOUSLY,SFM,SHOCKWAVE,SHORTBREHD,SiBV,SiNNERS,SiTiN,SKANK,SKGTV,SNOOZE,SNOW,SOAPBOX,SODAPOP,SomeTV,SONiDO,SORNY,SPAROOD,sPHD,SPLiTSViLLE,SPOCHT,SPRiNTER,SQUEAK,SRiZ,ss,STRiFE,SVA,SViNTO,sweHD,SweWR,SWOLLED,SYNS,SYS,TABULARiA,TARS,TASTETV,Taurine,TAXES,TBS,TCM,TCPA,TELEFUNKEN,TENEIGHTY,TERRA,TFiN,thebeeb,TINKERS,TLA,TNS,ToF,TOPAZ,TOPCAT,TRexHD,TRiPS,TRUEDEF,TURBO,TVA,TVBOX,TVBYEN,TViLLAGE,TVLoO,TvNORGE,TVP,TVSLiCES,TWG,uAuViD,UAV,uDF,UltraHD,UNTOUCHABLES,UNVEiL,URTV,UTOPiA,VALiOMEDiA,VeDeTT,VERUM,VH-PROD,ViD,VIDEOSLAVE,ViLD,VoMiT,W4F,W4Y,WaLMaRT,WALTERWHITE,WAT,WAVEY,WeFaiLED,WHEELS,WHiSKEY,WiDE,WiNNERS,WNN,WPi,xD2V,XOR,XORBiTANT,XPERT_HD,XTV,YELLOWBiRD,YesTV,ZZGtv,SPARKS,GECKOS,DRONES,BLOW,COCAIN,Replica,DiAMOND,Felony,SECTOR7,Larceny,Counterfeit,ROVERS,LPD,CiNEFiLE,LiBRARiANS,VoMiT,SADPANDA,VETO,AMIABLE,IAMABLE,SPOOKS,GHOULS,agw,CREEPSHOW,CREEPSHOWx,RedBlade,DoNE,BiPOLAR,FiCO,UNVEiL,WiDE,MULTiPLY,SiNNERS,PSYCHD,RUSTED,ARiES,NODLABS,HD4U,NOSCREENS,VALUE,GUACAMOLE,PHOBOS,USURY,TRiPS,RRH,MARS,TASTE,MOOVEE,7SiNS,DEPTH,PFa,KEBAP,AEROHOLiCS,GiMCHi,EiDER,SPRiNTER,FaiLED,MELiTE,CADAVER,WaLMaRT,JFKDVD,ENSOR,EwDp,HUMANiSM,TABULARiA,VH-PROD,iGNiTiON,iFAiL,OBiTS,ToF,ALLiANCE,ASSOCiATE,THUGLiNE,COW,Ltu,Counterfeit,Japhson,Felony,AN0NYM0US,BRMP,FRAGMENT,SiNCiTY,SAPHiRE,FUTURiSTiC,DEV0,GRiLL,Chakra,LoveGuru,REGARDS,LAP,MEGABOX,ONEY,iNTENSO,MANiC,aBD,JustWatch,FLABICIOUS,PussyFoot,SUMMERX,CHRONiCLER,EXCLUDED,SABENA,TERMiNAL,GETiT,HAiDEAF,WEST,NOMAAM,CURSE,HOTEL,LATENCY,GECiSFAGYi,UHDooDoo,SWAGGERUHD,LAZERS,CBGB,FilmHD,BAKED,NERV,FULLSiZE,TRUEDEF,PCH,CiNEMATiC,DiSRUPTiON,TAPAS,BRDC,BDA,watchHD,UltraHD,VEXHD,BLURRY,LCHD,MIDDLE,UNRELiABLE,WHiZZ,o0o,COASTER,SUPERSIZE,PTWINNER,OCULAR,ROUNDROBIN,KillerHD,KOREANSHIT,DUH,OMFUG,EMERALD,WhiteRhino,OLDHAM,iTWASNTME,SKG,CSOLHD,WESTCOAST".split(',');
    var p2parray = "KiTTeN,KORPOS,SiGMA,BTN,BTW,ESPNtb,HiSD,HRiP,iPRiP,iT00NZ,JJ,LoTV,NTb,PreBS,TTVa,TVSmash,2Maverick,2T,449,A4N,aB,ABH,Abjex,Absinth,AFFY,AG,AJP69,ALANiS,AltHD,Anime-Koi,AREA11,Asenshi,AURA,AUTHORiTY,BatchGuy,BB,BDCop,beAst,BF1,BgFr,BitHQ,bLinKkY,BluDragon,BluHD,BluntzRip,BlurayDesuYo,Bob,Bobash,BOOP,BS,BYTE,C-W,Cache,CasStudio,CBM,CH,ChaosBlades,CHD,Chihiro,CHiNJiTSU,Chotab,Chyuu,CLARiTY,CLDD,CMS,CMSSide,CNN,Coalgirls,Commie,Coo7,COR,CP,CREATiVE24,Cthuko,CTL,CtrlHD,CYRUS,D-Z0N3,DameDesuYo,DarkHollow,DaViEW,dbR,decibeL,denpa,DiFUN,DLBR,DmonHiro,DoA,Doki,DOLEMiTE,DON,doosh,Doremi,DRACULA,DWJ,DX-TV,Ebi,EbP,ECI,EDL,ELANOR,eMperor,EPSiLON,ESiR,Euc,EucHD,EV1LAS,EveTaku,Exiled-Destiny,FANT,FFF,Final8,FiNCH,FraMeSToR,FREAKS,gc04,gg,GJM,GoApe,Grassy,Green,GS,GTi,h264iRMU,HANDJOB,Handy,Hatsuyuki,HDAccess,HDB,HDCLUB,HDS,HDWinG,HDWTV,HDxT,HeBits,Hector,HERO,Hien,HiFi,Hiryuu,HoodBag,HOPELESS,HorribleSubs,HPotter,HQC,HRD,HT,HTTV,Hukumuzuku,HWD,HWE,Hype,iMPUDiCiTY,Introspective,iNVULTUATiON,iON,iPOP,Irishman,iTRY,IWStreams,jAh,JCH,jhonny2,JiZZA,JohnGalt,Juggalotus,JungleBoy,k3n,KAGA,Kaylith,KCRT,kingofosiris,KiNGS,KiSHD,KRaLiMaRKo,LEGiON,LiBERTY,LiGHTSPEED,LIMO,Link420,lulz,M0ar,matt42,MD,MEECH,Mezashite,MiCDROP,Migoto,MiMa,MissDream,MMI,monkee,MOS,MW,MYSELF,NEXT,NFHD,NORMIES,NorTV,NovaRip,NT,NTG,Nub,NuMbErTw0,NY2,NyanTaku,OOO,Oosh,OZC,panos,Pcar,pcsyndicate,Penumbra,Phr0stY,Piranha,PISTA,PLAYNOW,PLAYREADY,playTV,PLRVRTX,POD,Poke,PPKORE,ProdQc,PSiG,PublicHD,PWE,QOQ,QuebecRules,QUEENS,R2D2,Raizel,RARBG,RAS,RCG,RDF,Reborn4HD,RED,RedJohn,ReDone,Rizlim,RKSTR,RTFM,RTN,RUDOS,Ryu,RZF,SA89,SallySubs,saMMie,SbR,SDH,Secludedly,SFH,SHiELD,sHoTV,SiGMA,Silver007,Sir.Paul,SLiME,smcgill1969,SMODOMiTE,SOAP,SRS,StarryNights,Sticky83,SWC,Sweet-Star,SynHD,TAiLGATE,TAR,TayTO,TB,TeamCoCo,testttt,TheBox,THORA,THoRCuATo,TiGHTBH,tlacatlc6,tNe,tonic,TOPKEK,TRiAL,TrollHD,TrollUHD,TrueHD,TSTN,Tsundere,TT,TTL,TURTLE,TVCUK,TVV,TxN,TYT,Underwater,UNPOPULAR,UTW,Vawn,VietHD,ViLLAiNS,ViPER,ViSUM,Vivid,VLAD,wAm,WAREZNiK,WB,WBS,WDTeam,Weby,WHR,WhyNot,WiKi,WINNEBAGO,WITH,WLR,WRCR,WTB,WYW,XAA,XEON,XWT,yAzMMA,YFN,Yonidan,ZR1,Zurako".split(',');
    var regexscenegroups = new RegExp( '\^\('+scenearray.join( "|" )+'\)\$', "i");
    var regexp2pgroups = new RegExp( '\^\('+p2parray.join( "|" )+'\)\$', "i");

    var media_regex = /^.+?(HDTV|WEB-DL|WEBRip|[.]WEB[.]|\sWEB\s|BluRay|DVD|BDRip)/i;
    var codec_regex = /^.+?(x264|x265|H.264|H264|MPEG2)/i;
    var res_regex = /^.+?(480p|720p|1080p|1080i|2160p)/i;
    var web_regex = /^.+?(\.|\s)(Amazon|Netflix|AMZN|NF|Hulu)(\.|\s)/i;
    var itunes_regex = /^.+?(\.|\s)(iT)(\.|\s)/;
    var origin_group_regex = /^(.+\-(.+?))(\.|$)/i;

    var media;
    var codec;
    var resolution;
    var web_source = "";
    var origin;

    if(origin_group_regex.test(title)){
        origin = origin_group_regex.exec(title)[2];

        if(regexp2pgroups.test(origin)) origin = "P2P";
        if(regexscenegroups.test(origin)) origin = "Scene";
    }
    else origin = "No Group";

    if(media_regex.test(title)){
        media = media_regex.exec(title.toLowerCase())[1];

        switch(media){
            case "hdtv":
                media = "HDTV";
                break;
            case "web-dl":
            case ".web.":
            case " web ":
                media = "WEB-DL";
                break;
            case "webrip":
                media = "WEBRip";
                break;
            case "bluray":
            case "bdrip":
                media = "Bluray";
                break;
            case "dvd":
                media = "DVD";
                break;
            default:
                media = "Unknown";
        }
    }
    else{
        media = "Media";
    }
    if(codec_regex.test(title)){
        codec = codec_regex.exec(title.toLowerCase())[1];

        switch(codec){
            case "x264":
            case "h264":
            case "h.264":
                codec = "H.264";
                break;
            case "mpeg2":
                codec = "MPEG2";
                break;
            default:
                codec = "Unknown";
        }
    }
    else{
        codec = "Codec";
    }
    if(res_regex.test(title)){
        resolution = res_regex.exec(title.toLowerCase())[1];
        if(resolution == "480p") resolution = "SD";
    }
    else{
        resolution = "SD";
    }

    if(web_regex.test(title)){
        web_source = web_regex.exec(title.toLowerCase())[2];

        switch(web_source){
            case "netflix":
            case "nf":
                web_source = "Netflix";
                break;
            case "amazon":
            case "amzn":
                web_source = "Amazon";
                break;
            case "hulu":
                web_source = "Hulu";
                break;
            default:
                web_source = "";
        }
        if(web_source) web_source = "<span id='ep_web_source_"+curr_id+"'><strong>"+web_source+"</strong></span><span> / </span>";
    }
    else if (itunes_regex.test(title)){
        web_source = "iTunes";
        web_source = "<span id='ep_web_source_"+curr_id+"'><strong>"+web_source+"</strong></span><span> / </span>";
    }
    if(title.toLowerCase().includes("repack")){
        web_source += "<span id='ep_repack'>Repack</span><span> / </span>";
    }
    else if(title.toLowerCase().includes("proper")){
        web_source += "<span id='ep_repack'>Proper</span><span> / </span>";
    }

    return [codec, media, resolution, web_source, origin];
}