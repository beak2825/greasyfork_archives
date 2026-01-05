// ==UserScript==
// @name        imgur_show_user_stats_light
// @namespace   someName
// @include     http://imgur.com/user/*
// @include     https://imgur.com/user/*
// @version     0.3.7
// @grant       none
// @description Show user statistics on imgur
// @downloadURL https://update.greasyfork.org/scripts/29999/imgur_show_user_stats_light.user.js
// @updateURL https://update.greasyfork.org/scripts/29999/imgur_show_user_stats_light.meta.js
// ==/UserScript==
// TODO: Catch errors and check result.success
// TODO: Think about useable version numbers...
// TODO: Add support for username.imgur.com style urls
// TODO: Show errors and handle no credits remaining ?

$(window).ready(function () {
  var CLIENT_ID = 'cd0695f1226536b';
  var SHOW_ID = false;
  var MAX_SUB_PAGES = 15;
  var _submissions_left = -1;
  var _sub_site = 0;
  var _submissions = [];
  var _last_sub_id = -1;
  var _last_post = -1;
  
  function _update_limits_from_header(xhr) {
    xhr.getResponseHeader('Header')
    $('#stats_credits_user').html('User Credits: ' + xhr.getResponseHeader('X-RateLimit-UserRemaining') + ' / ' + xhr.getResponseHeader('X-RateLimit-UserLimit'));
    $('#stats_credits_script').html('Script Credits: : ' + xhr.getResponseHeader('X-RateLimit-ClientRemaining') + ' / ' + xhr.getResponseHeader('X-RateLimit-ClientLimit'));
  }

  function request_user_info(endpoint, success_cb, error_cb) {
    $.ajax({
      url: 'https://api.imgur.com/3/account/' + username + '/' + endpoint,
      method: 'GET',
      headers: {
        Authorization: 'Client-ID ' + CLIENT_ID,
        Accept: 'application/json'
      },
      success: function (a, b, c) {
        _update_limits_from_header(c);
        success_cb(a, b, c);
      },
      error: error_cb
    });
  }
  
  
  if (window.location.pathname.indexOf('/user/') === 0 && $('.button').filter('.comments').length > 0) {
    // Set up UI
    var username = window.location.pathname.split('/', 3) [2]; // TODO: look for a more stable way (is there an imgur js var maybe ?)
    var newBox = $('<div id="statsBox" class="textbox"></div>');
    var tble = $('<table id="_stats_table" width="100%">' +
    //'<tr><td colspan="2" align="center" style="display:none; color:#cf3131; font-weight:bold;" id="stats_is_mod">Moderator</td></tr>' +
    '<tr><td colspan="2"><hr></td></tr>'+
    '<tr style="display:none"><td>Userid:</td><td align="right"><span id="stats_uid"> - </span></td></tr>' +
    '<tr><td>Account creation</td><td align="right"><span id="stats_created"> - </span></td></tr>' +
    '<tr><td>Comments</td><td align="right"><a href="http://imgur.com/user/' + username + '/" id="stats_comments"> - </a></td></tr>' +
    '<tr><td>Submissions</td><td align="right"><a href="http://imgur.com/user/' + username + '/submitted" id="stats_submissions"> - </a></td></tr>' +
    '<tr><td>Albums</td><td align="right"><a href="http://' + username + '.imgur.com" id="stats_albums"> - </a></td></tr>' +
    '<tr><td>Images</td><td align="right"><a href="http://' + username + '.imgur.com/all" id="stats_images"> - </a></td></tr>' +
    '<tr><td>Favorites</td><td align="right"><a href="http://imgur.com/user/' + username + '/favorites" id="stats_favorites"> - </a></td></tr>' +
    '<tr><td colspan="2"><hr></td></tr>'+
    '<tr><td colspan="2" align="center"><button id="_btn_extend">Extended statistics</button></td></tr>' +
    '<tr class="_extended"><td colspan="2"><hr></td></tr>'+
    '<tr class="_extended"><td>Last activity</td><td align="right" id="stats_last_active"></td></tr>' +
    '<tr class="_extended"><td>AVG post points</td><td align="right" id="stats_score"></td></tr>' +
    '<tr class="_extended"><td>AVG post views</td><td align="right" id="stats_views"></td></tr>' +
    '<tr class="_extended"><td>Most viral posts </td><td align="right" id="stats_most_viral"></td></tr>' +
    '<tr class="_extended"><td>NSFW posts </td><td align="right" id="stats_nsfw"></td></tr>' +
    '<tr class="_extended"><td>Top tags</td><td align="right" id="stats_toptags"></td></tr>' +
    '<tr><td colspan="2"><hr></td></tr>'+
    '<tr><td colspan="2" align="center"><a href="http://community.imgur.com/users/' + username + '">IC profile</a></td></tr>' +             
    '<tr><td style="color: #2B2B2B; font-size: 0.7em;" colspan="2" align="center" id="stats_credits_user"> - </td></tr>' +
    '<tr><td style="color: #2B2B2B; font-size: 0.7em;" colspan="2" align="center" id="stats_credits_script"> - </td></tr>' +
    '</table>');
    newBox.append(tble);
    newBox.insertBefore($('.notoriety-container'));
    
    tble.find('._extended').hide();
    
    // Add loading icon to all rows
    var tmp = $('#_stats_table tr td:nth-child(2)'); tmp.children().hide();
    tmp.append('<img style="height:1em" src="https://i.imgur.com/LR2v0rh.gif" />');
    
    
    $('#_btn_extend').click(function(){
      if(_submissions_left == 0) return;
      tble.find('._extended').show();
      get_submissions();
    });
    
    
    // get coments / submission stats
    request_user_info('gallery_profile', function (result, status, request) {
        $('#stats_comments').text(result.data.total_gallery_comments.toLocaleString()).closest('td').children().show().filter('img').remove();
        $('#stats_submissions').text(result.data.total_gallery_submissions.toLocaleString()).closest('td').children().show().filter('img').remove();
        $('#stats_favorites').text(result.data.total_gallery_favorites.toLocaleString()).closest('td').children().show().filter('img').remove();
        _submissions_left = result.data.total_gallery_submissions;
        if(_submissions_left == 0) $('#_btn_extend, #_stats_table hr:nth(1)').hide()
      }, function (a, b, c) {
        console.log('Failed to load', a, b, c);
        $('#stats_comments, #stats_submissions, #stats_favorites').text('Failed to load').closest('td').children().show().filter('img').remove();
      }
    );
    
    // get the exact (*) join date. TODO: I bet i messed up the time(zones) here.
    request_user_info('', function (result, status, request) {
        var date = new Date(result.data.created * 1000);
        var cake = new Date(result.data.created * 1000);
        var now = new Date();
        cake.setFullYear(now.getFullYear());
        if(cake < now){
          cake.setFullYear(cake.getFullYear() + 1);
        }
        var dist = cake - now;
        var foo = [[1000*60*60*24, 'day'], [1000*60*60, 'hour'], [1000*60, 'minute'], [1000, 'second']];
        var till_str = "";
        for(var i=0; i< foo.length; ++i){
          var val = Math.floor(dist / foo[i][0]);
          dist -= val * foo[i][0];
          if(val == 0 && till_str.length == 0)
            continue;
          till_str += val + " " + foo[i][1];
          if(val > 1) till_str += "s";
          till_str += " ";
        }
        $('#stats_created').text(date.toLocaleDateString()).attr('title', date.toLocaleString() + "\n" + "In: " + till_str).closest('td').children().show().filter('img').remove();
        if(SHOW_ID){
          $('#stats_uid').text(result.data.id).parent().parent().show();
          $('#stats_uid').closest('td').children().show().filter('img').remove();
        }
        /*if(result.data.pro_expiration != false){
          $('#stats_is_mod').show();  
        }*/
      }, function (a, b, c) {
        console.log('Failed to load', a, b, c);
        $('#stats_created').text('Failed to load').closest('td').children().show().filter('img').remove();
      }
    );
    
    // album count (inklusive not submitted to gallery), if album settings are set to public.
    request_user_info('albums/count', function (result, status, request) {
        $('#stats_albums').text(result.data.toLocaleString()).closest('td').children().show().filter('img').remove();
      }, function (a, b, c) {
        console.log('Failed to load', a, b, c);
        $('#stats_albums').text('private').closest('td').children().show().filter('img').remove();
      }
    );
    
    // image count (inklusive not submitted to gallery), if image settings are set to public.
    request_user_info('images/count', function (result, status, request) {
        $('#stats_images').text(result.data.toLocaleString()).closest('td').children().show().filter('img').remove();
      }, function (a, b, c) {
        console.log('Failed to load', a, b, c);
        $('#stats_images').text('private').closest('td').children().show().filter('img').remove();
      }
    );
    
    
    
    function get_submissions() {
      if(_submissions_left <= 0){
        return; 
      }
      console.log("Requesting submission page #" + _sub_site);
      
      request_user_info('submissions/' + _sub_site, function (result, status, request) {
          _submissions.push.apply(_submissions, result.data);
          _submissions_left -= result.data.length;
          var done = true;
          if(result.data.length > 0 && _submissions_left > 0 &&  _last_sub_id != result.data[0].id){
            if(_sub_site+1 == MAX_SUB_PAGES){
              var a = $('<span style="color:yellow; font-weight: bold; padding: 0 5px 0 5px;">!</span>');
              a.attr('title', 'Only the last '+ _submissions.length +' submissions are considered.');
              $('#stats_score, #stats_views, #stats_toptags, #stats_nsfw, #stats_most_viral').parent().children('td:nth-child(1)').append(a);
            }else{
              _last_sub_id = result.data[0].id;
              _sub_site += 1;
              get_submissions();
              done = false;
            }
          }
          if(done){
            if(_submissions.length > 0){
              //  TODO: are they  always returned newest first ?
              _last_post = _submissions[0].datetime;
            }
            calc_views();
            calc_score();
            collect_tags();
            get_last_comment();
            calc_most_viral();
            calc_nsfw();
          }
        }, function (a, b, c) {
          console.log('Failed to load', a, b, c);
        }
      );
    }
    
    function _get_field(array, field){
      var ret = Array();
      for(var i=0; i < array.length; ++i){
        ret.push(array[i][field])
      }
      return ret;
    }
    
    // some array funcs for convinience
    Array.prototype.sum = function() {
      return this.reduce(function(a, b) { return a + b; }, 0);
    };
    Array.prototype.max = function() {
      return Math.max.apply(null, this);
    };
    Array.prototype.min = function() {
      return Math.min.apply(null, this);
    };
    var round = Math.round;
    
    function calc_views(){
      var views = _get_field(_submissions ,'views');
      var view_sum = views.sum();
      var a = $('<span></span>');
      a.text(round(view_sum / views.length).toLocaleString());
      a.attr('title', 'All: ' + round(view_sum).toLocaleString() + ". Max: " + views.max().toLocaleString() + ". Min: " + views.min().toLocaleString() + ".");
      $('#stats_views').append(a).closest('td').children().show().filter('img').remove();
    }
    
    function calc_score(){
      var points = _get_field(_submissions ,'points');
      var ups = _get_field(_submissions ,'ups').sum() / points.length;
      var downs = _get_field(_submissions ,'downs').sum() / points.length;
      var point_sum = points.sum();
      var a = $('<span></span>');
      a.text( round(point_sum / points.length).toLocaleString());
      a.attr('title', 'Upvotes avg: ' + round(ups).toLocaleString() + ". Downvotes avg: " + round(downs).toLocaleString() + ".");
      $('#stats_score').append(a).closest('td').children().show().filter('img').remove();
    }
    
    function calc_most_viral(){
      var virals = _get_field(_submissions ,'in_most_viral');
      var _sum = virals.sum();
      if(virals.length > 0){
        val = Math.round((100.0 / virals.length) * _sum);
      }
      var a = $('<span></span>');
      a.text( val + "%" );
      a.attr('title', _sum + " / " + virals.length + " posts");
      $('#stats_most_viral').append(a).closest('td').children().show().filter('img').remove();
    }
    
    function calc_nsfw(){
      var nsfws = _get_field(_submissions ,'nsfw');
      var _sum = nsfws.sum();
      var val = 0;
      if(nsfws.length > 0){
        val = Math.round((100.0 / nsfws.length) * _sum);
      }
      var a = $('<span></span>');
      a.text( val + "%" );
      a.attr('title', _sum + " / " + nsfws.length + " posts");
      $('#stats_nsfw').append(a).closest('td').children().show().filter('img').remove();
    }
    
    function collect_tags(){
      console.log('collect_tags');
      var counter = {};
      for(var i=0; i < _submissions.length; ++i){
        var tags = _submissions[i].tags;
        for(var j=0; j < tags.length; ++j){
          var count = 1; var k = tags[j].display_name;
          if( k in counter ){
            count += counter[k][0];
          }
          counter[k] = [count, tags[j]];
        }
      }
      var vals = Object.values(counter);
      vals.sort(function(a, b) {
       return b[0] - a[0];
      });
      
      $('#stats_toptags').children().show().filter('img').remove();
      for(var i=0; i < 5 && i < vals.length; ++i){
        var node = $('<a>-</a><br>');
        node.filter('a').text(vals[i][1].display_name).attr('title', "Used "+vals[i][0]+" times").attr('href', 'https://imgur.com/t/'+vals[i][1].name);
        $('#stats_toptags').append(node);
      }
    }
  }
  
  function get_last_comment(){
    request_user_info('comments/newest', function (result, status, request) {
        if(result.data.length == 0 && _last_post == -1){
          $('#stats_last_active').text('-');
          return; 
        }
        if(result.data.length == 0) return;
        var d = result.data[0].datetime;
        var link = result.data[0].datetime;
        if(d > _last_post){
          link = 'https://imgur.com/gallery/' +result.data[0].image_id+ '/comment/' + result.data[0].id;
        }else{
          link = 'https://imgur.com/gallery/' + _submissions[0].id;
          d = _last_post;
        }
        var delta = (new Date().getTime()/1000) - d;  
        function pluralize(val, word){
          val = Math.floor(val);
          return val + " " + Imgur.Util.pluralize(val, word);
        }
        // thats propably somewhere already
        if(delta >= 356*24*60*60) delta = pluralize(delta / (356*24*60*60), " year");
        else if(delta >= 24*60*60) delta = pluralize(delta / (24*60*60), " day");
        else if(delta >= 60*60) delta = pluralize(delta / (60*60), " hour");
        else if(delta >= 60) delta = pluralize(delta / 60, " minute");
        else delta = pluralize(delta, " second");
        d = new Date(d * 1000);
        var a = $('<a></a>').attr('href', link).text(delta + " ago").attr('title', d.toLocaleDateString() + " " + d.toLocaleTimeString());
        $('#stats_last_active').append(a).children().show().filter('img').remove();
      }, function (a, b, c) {
        console.log('Failed to load', a, b, c);
        $('#stats_last_active').text('Failed to load comment').closest('td').children().show().filter('img').remove();
      }
    );
  }
});
