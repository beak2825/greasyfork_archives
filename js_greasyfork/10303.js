// ==UserScript==
// @name         V2EX Topic Preview
// @namespace    http://www.v2ex.com/member/icedx
// @version      0.2333
// @description  None
// @author       openroc@V2EX,Alex Hsiao
// @match        *://www.v2ex.com/go/*
// @match        *://www.v2ex.com/?tab=*
// @match        *://www.v2ex.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10303/V2EX%20Topic%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/10303/V2EX%20Topic%20Preview.meta.js
// ==/UserScript==

/*
  v2ex.com.js for chrome extension dotjs, have fun, :)
*/
var map = {};
 
var comment_template = [
'<div id="r_2127958" class="cell">',
  '<table cellpadding="0" cellspacing="0" border="0" width="100%">',
    '<tbody><tr>',
      '<td width="48" valign="top" align="center"><img src="_{{_avatar_normal_}}_" class="avatar" border="0" align="default"></td>',
      '<td width="10" valign="top"></td>',
      '<td width="auto" valign="top" align="left"><div class="fr"><span class="no">_{{_seq_}}_</span></div>',
          '<div class="sep3"></div>',
          '<strong><a href="/member/_{{_username_}}_" class="dark">_{{_username_}}_</a></strong>&nbsp; &nbsp;<span class="fade small">_{{_dt_}}_</span> <span class="small fade"></span>',
          '<div class="sep5"></div>',
          '<div class="reply_content">_{{_content_rendered_}}_</div>',
      '</td>',
    '</tr>',
  '</tbody></table>',
'</div>',
].join('');
 
function replace(src, map) {
  var rc = src;
  for(var key in map) {
    rc = rc.replace(new RegExp("_{{_"+key+"_}}_","g"), map[key]);
  }
  return rc;
}
 
function getTopicId(url) {
  return (/\/t\/(\d+)/i.test(url)? RegExp.$1 : undefined);
}
 
function getTS(s) {
  var rc = '';
  if(s<60) {
    rc = Math.floor(s) + '秒前';
  } else if( s>=60 && s<3600) {
    rc = Math.floor(s/60) + '分钟前';
  } else if( s>=3600 && s<3600*24) {
    rc = Math.floor(s/3600) + '小时前';
  } else if( s>=3600*24) {
    rc = Math.floor(s/(3600*24)) + '天前';
  }
  return rc;
}
 
function closeContent(host, tid) {
  map[tid] = {status:0, host: host};
  host.find('.injection').remove();
  $('html, body').animate({scrollTop: host.offset().top}, 50);
}
 
function showContent(host, tid) {
  for(var id in map) {
    if(map[id].status == 1) closeContent(map[id].host, id);
  }
 
  $('html, body').animate({scrollTop: host.offset().top}, 50);
 
  map[tid] = {status:1, host: host};
 
  var wrapper = $('<div class="injection" style=""></div>');
  var content = $('<div class="topic_content markdown_body" style="margin:10px 0;">loading....</div>');
  var comments = $('<div class="" style="border-top:1px solid #ccc; background-color:#f9f9f9; margin-left:50px;"></div>');
 
  wrapper.append(content);
  wrapper.append(comments);
  host.append(wrapper);
 
  $.get('/api/topics/show.json?id='+tid, function(data){
    content.html(data[0].content_rendered);
  });
 
  $.get('/api/replies/show.json?topic_id='+tid, function(data){
    for(var n=0, len=data.length; n<len; ++n) {
      var kv = {
        content_rendered: data[n].content_rendered,
        username: data[n].member.username,
        avatar_normal: data[n].member.avatar_normal,
        cid: data[n].id,
        uid: data[n].member.id,
        dt: getTS(Date.now()/1000-data[n].created),
        seq: n+1,
      };
      comments.append(replace(comment_template, kv));
      host.find('.imgly').css('max-width', '530px');
    }
  });
}
function onItemClick(self) {
  var tid = getTopicId(self.find('.item_title a').attr('href'));
  if(map[tid] && map[tid].status == 1) {
    closeContent(self, tid);
  } else {
    showContent(self, tid);
  }
}
 
// for dynamic url, such as /?tab=tech
$('div.cell.item').click(function(){
  onItemClick($(this));
});
 
// for static url, such as /go/share
$('#TopicsNode .cell').click(function(){
  onItemClick($(this));
});