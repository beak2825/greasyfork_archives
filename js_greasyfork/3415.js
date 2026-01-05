// ==UserScript==
// @name           UnfollowHater
// @namespace      tumblr-unfollowhater
// @description    Shows who unfollowed you on Tumblr
// @include        http://www.tumblr.com/blog/*
// @include        https://www.tumblr.com/blog/*
// @author		   Adrian Sanchez
// @version        2.0.0 beta
// @grant		   none  
// @require       http://code.jquery.com/jquery-2.1.4.js
// @require       http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/3415/UnfollowHater.user.js
// @updateURL https://update.greasyfork.org/scripts/3415/UnfollowHater.meta.js
// ==/UserScript==

//***********************************************************************************      
//      This program is free software: you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation, either version 3 of the License, or
//      (at your option) any later version.
//
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//
//      You should have received a copy of the GNU General Public License
//      along with this program.  If not, see http://www.gnu.org/licenses/gpl-3.0.html
//***********************************************************************************
if (window.top != window.self)  //-- Don't run on frames or iframes
    return;
    
var FUNCTION_DESCRIPTION_UNFOLLOWER = 'Current new unfollows:';
var FUNCTION_DESCRIPTION_NEWFOLLOWER = 'Current new followers:';
var FUNCTION_DESCRIPTION_TOTAL_UNFOLLOWER = 'Total unfollows since this script is running:';
var loading_control = {function_name:'loading', title:'Parsing Pages', function_description:''};
var error_control = {function_name:'error', title:'Error', function_description:'There was an error while the script was executing: '};
var unfollow_control = {function_name:'unfollower', title:'Unfollowers', function_description:FUNCTION_DESCRIPTION_UNFOLLOWER};
var new_follow_control = {function_name:'new_follower', title:'New Followers', function_description:FUNCTION_DESCRIPTION_NEWFOLLOWER};
var total_follow_control = {function_name:'total_unfollower', title:'Total Unfollowers', function_description:FUNCTION_DESCRIPTION_TOTAL_UNFOLLOWER};

function load_css(){
    var css_jqueryui = document.createElement('link');
    css_jqueryui.rel = 'stylesheet';
    css_jqueryui.type = 'text/css';
    css_jqueryui.href = 'https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css';

    var style = document.createElement('style');
    style.innerHTML = "#feedback { font-size: 1.4em; }"+
        " #selectable .ui-selecting { background: #FECA40; }"+
        " #selectable .ui-selected { background: #F39814; color: white; }"+
        " #selectable { list-style-type: none; margin: 0; padding: 0; width: 60%; }"+
        " #selectable li { margin: 3px; padding: 0.4em; font-size: 1.4em; height: 18px; text-align: center; }";

    document.getElementsByTagName("head")[0].appendChild(css_jqueryui);
    document.getElementsByTagName("head")[0].appendChild(style);

}

function getTumblelog(){
    return document.URL.split("/")[4].replace(/[#]/gi,"");
}

function get_dom_from_string(data){
    var element = document.createElement('div');
    element.innerHTML = data;
    return element;
}

function process(){
    load_css();
    display_control(loading_control, 0);

    $.ajax({
        url: furl,
        cache: false   
    }).done(function(data) {
        var follower_list = get_follower_list(data);
        var current_list = jQuery.parseJSON(localStorage.getItem(getTumblelog()+"_followersList"));
        var storage_string_unfollower = localStorage.getItem(getTumblelog()+"_unfollowersList");

        var unfollowers_list = compare_lists(current_list,follower_list);
        var new_followers_list  = compare_lists(follower_list,current_list);
        var total_unfollowers_list = create_total_unfollowers_list((storage_string_unfollower===null)?[]:jQuery.parseJSON(storage_string_unfollower),new_followers_list,unfollowers_list);

        if ((unfollowers_list !==null)&&(unfollowers_list.length >  0)){
            localStorage.setItem(getTumblelog()+"_unfollowersList",JSON.stringify(total_unfollowers_list));
        }
        
        remove_control(loading_control);
        set_control(unfollowers_list,unfollow_control);
        set_control(new_followers_list,new_follow_control);
        set_control(total_unfollowers_list,total_follow_control);
		localStorage.setItem(getTumblelog()+"_followersList",JSON.stringify(follower_list));
        console.log("done");
    }).fail(function(data,textStatus,errorThrown) {
        display_error({text_status:textStatus, error_thrown:errorThrown});
    });
}

function create_total_unfollowers_list(total_unfollowers_list, new_followers_list, unfollowers_list){
    var tul_wo_nf_list = compare_lists(total_unfollowers_list,new_followers_list);
    var tul_wo_uf_list = compare_lists(tul_wo_nf_list,unfollowers_list);
    return tul_wo_uf_list.concat(unfollowers_list);
}

function get_follower_list(data){
    var followerPages = Math.ceil(get_follower_count(data)/followersPage);
    var furl_ext = furl+"/page/";
    var followerList = [];

    for(i=0; i<followerPages; i++){
        var page = i+1;
        $.ajax({
            async: false,
            url: furl_ext+page,
            cache: false
        }).done(function(data) {
            update_counter_control(loading_control, page+"/"+followerPages);
            var element = get_dom_from_string(data);
            $(element).find('.name').each(function(){
                var link = $(this).find('a').attr('href');
                followerList[followerList.length] = {name: $(this).text(),
                                                     url: link};
            });
        }).fail(function(data,textStatus,errorThrown) {
            display_error({text_status:textStatus, error_thrown:errorThrown});
        });
    }
    set_new_follower_list(followerList);
    return followerList;
}


function get_follower_count(data){
    var element = get_dom_from_string(data);
    return parseInt($(element).find('.title_and_controls').text().replace(/\,/g,'').replace(/\./g,'').replace(/\ /g,'').match("[0-9]+"));
}

function set_new_follower_list(list){
    if(virgen){
        localStorage.setItem(getTumblelog()+"_followersList",JSON.stringify(list));
    }
}

function compare_lists(current_list, new_list){
    var diff = [];
    for(var i=0; i<current_list.length; i++){
        var found=false;
        for(var j=0; j<new_list.length; j++){
            if(new_list[j]["name"]==current_list[i]["name"]){
                found=true;
                break;
            }
        }
        if(!found){
            diff[diff.length]=current_list[i];
        }
    }
    return diff;
}

function set_control(list, control) {
    var count = list.length;


    display_control(control, count);    


    insert_content_dialog(control, 
                          function(){
                              var element = create_content_dialog(control);
                              var list_element = display_list(list);
                              $('#'+element.id).empty();
                              $(element).append(list_element);
                              $(element).append(please_donate());
                              $(element).dialog({
                                  title: control.title,
                                  close: function( event, ui ) {
                                      list_element.innerHTML="";
                                  }
                              });
                              $(element).position({
                                  my: "center"
                              });
                          });

}

function create_content_dialog(control){
    var element = document.createElement('div');
    var description_text = document.createElement('div');
    element.id = control.function_name+"_dialog";
    description_text.id = control.function_name+"_text";
    description_text.innerHTML = control.function_description;
    $(element).append(description_text);
    return element;
}

function insert_content_dialog(control, functionality){
    $('#'+control.function_name+'_control').click(functionality);
}

function display_control(control, count){
    $('#dashboard_controls_open_blog').append('<li id="'+control.function_name+'_control" class="controls_section_item "><a class="control-item control-anchor posts"><div class="hide_overflow">'+control.title+'</div><span id="'+control.function_name+'_count" class="count"></span></a></li>');
    $('#'+control.function_name+'_count').text(count);
}

function update_counter_control(control, count){
    $('#'+control.function_name+'_count').text(count);
}

function remove_control(control){
    $('#'+control.function_name+'_control').remove();
}

function display_list(follower_list){
    var ol = document.createElement('ol');
    $(ol).selectable();
    for(i=0;i<follower_list.length;i++){
        var li = document.createElement('li');
        var a = document.createElement('a');

        $(a).attr('href',follower_list[i]["url"]).text(follower_list[i]["name"]);
        $(a).attr('target','_blank');
        $(li).addClass('ui-widget-content').append(a);
        $(ol).append(li);
    }
    return ol;
}

function please_donate(){
    var paypal_html='<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">'+
        '<input type="hidden" name="cmd" value="_s-xclick">'+
        '<input type="hidden" name="hosted_button_id" value="WD4YNAQALVHLC">'+
        '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">'+
        '<img alt="" border="0" src="https://www.paypalobjects.com/es_XC/i/scr/pixel.gif" width="1" height="1"></form>';

    var paypal_element = document.createElement('div');
    paypal_element.innerHTML = paypal_html;

    return paypal_element;
}

function display_error(error){
    display_control(error_control, error);
    insert_content_dialog(error_control,  function(){
        var element = create_content_dialog(error_control);
        $('#'+element.id).empty();
        $(element).append(please_donate());
        $('#'+control.function_name+'_text').text('\n\n'+error.text_status+": "+error.error_thrown);
        $(element).dialog({
            title: control.title,
            close: function( event, ui ) {
                $('#'+control.function_name+'_text').text('');
            }
        });
        $(element).position({
            my: "center"
        });
    });
}

function top_icon(){
}

var followersPage = 40;
var blogUrl = window.location.protocol+"//www.tumblr.com/blog/";
var furl = blogUrl+getTumblelog()+"/followers";
var virgen = (localStorage.getItem(getTumblelog()+"_followersList")===null);
console.log("start");

$(document).ready(function() {  
process();
});



