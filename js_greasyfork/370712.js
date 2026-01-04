// ==UserScript==
// @name         1001tracklists in YouTube
// @namespace    https://xcgx.me
// @version      0.1
// @description  Insert 1001tracklists into YouTube player
// @author       You
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370712/1001tracklists%20in%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/370712/1001tracklists%20in%20YouTube.meta.js
// ==/UserScript==
var tl_switch='<div class="ytp-menuitem" role="menuitemcheckbox" aria-checked="false" tabindex="0" id="tl-menu-checkbox"><div class="ytp-menuitem-label">Enable Tracklist</div><div class="ytp-menuitem-content"><div class="ytp-menuitem-toggle-checkbox"></div></div></div>';
var tracktitle='<span id="tl-title"></span>';
var form='<div id="tl-form"><input id="tl-link" style="width: 80%;"/><button id="tl-button">fetch</button><p id="tl-list"></p></div>';
var title_line='<a class="yt-simple-endpoint style-scope yt-formatted-string" onclick="document.getElementById(\'movie_player\').seekTo({second})">{time_str}</a>{title}';
function timestr_to_int(str){
    var l=str.split(':');
    var base=1;
    if (str.indexOf('min')>=0) base=60;
    var result=0;
    for (var i=l.length-1;i>=0;i--){
        result+=base*parseInt(l[i]);
        base*=60;
    }
    return result;
}
var $=jQuery;
var last_interval;
(function() {
    //'use strict';
    // Your code here...
    var lid=setInterval(function(){
        if ($('.title').length==0) return;
        clearInterval(lid);
        $('.ytp-panel-menu').append(tl_switch);
        $('.ytp-time-display').append(tracktitle);
        $(form).insertBefore('.title');
        $('#tl-form').hide();
        $('#tl-title').hide();
        $('#tl-menu-checkbox').click(function(){
            var a=$(this).attr('aria-checked');
            if (a=='true'){
                $(this).attr('aria-checked','false');
                $('#tl-form').hide();
                $('#tl-title').hide();
            }
            else if (a=='false'){
                $(this).attr('aria-checked','true');
                $('#tl-form').show();
                $('#tl-title').show();
            }
        });
        $('#tl-button').click(function(){
            GM_xmlhttpRequest({
                method: "GET",
                url: $('#tl-link').val(),
                onload: function(response) {
                    //console.log(response.responseText);
                    var el = $( '<div></div>' );
                    el.html(response.responseText);
                    var tlp=$('tr[id^=tlp]',el);
                    var result=[];
                    for (var i=0;i<tlp.length;i++){
                        result.push([$('.cueValueField',tlp[i]).text(),$('.trackFormat',tlp[i]).text(),
                                     timestr_to_int($('.cueValueField',tlp[i]).text())]);
                    }
                    function update(bid){
                        var text="";
                        for (var i=0;i<result.length;i++){
                            var t="";
                            if (bid>=0&&i==bid) t='<b>text</b><br/>';
                            else t='text<br/>';
                            t=t.replace("text",title_line.replace('{second}',result[i][2]).replace('{time_str}',result[i][0]).replace('{title}',result[i][1]));
                            text+=t;
                        }
                        $('#tl-list').html(text);//break;
                    }
                    update();

                    console.log(result);
                    var last_tid=-1;
                    if (last_interval) clearInterval(last_interval);
                    last_interval=setInterval(function(){
                        var cur=timestr_to_int($('.ytp-time-current').text());
                        //console.log(cur);
                        var i;
                        for (i=0;i<result.length;i++){
                            if (!result[i][0]) continue;
                            if (cur<result[i][2]) break;
                        }
                        i--;
                        if (i>=0&&i!=last_tid) {
                            last_tid=i;
                            $('#tl-title').text(result[i][1]);
                            update(i);
                        }
                    },1000);
                    $('#tl-link').removeAttr('disabled');
                }
            }
                             );
            $('#tl-link').attr('disabled','disabled');
            $(this).text('change');
        });
    },1000);
})();
/* todo: how to show vs type songs */