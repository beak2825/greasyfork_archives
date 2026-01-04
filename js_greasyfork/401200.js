// ==UserScript==
// @name        zuanke8_aide
// @namespace   zuanke8
// @name:zh-CN  zuanke8一键拉黑脚本
// @homepage    https://greasyfork.org/zh-CN/scripts/401200-zuanke8-aide
// @require     https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require     https://bowercdn.net/c/gbk.js-0.2.3/dist/gbk2.min.js
// @include     http*://www.zuanke8.com*
// @grant       none
// @version     1.1.3
// @author      Ben
// @license     MIT
// @description zuanke8一键拉黑辅助脚本
// @downloadURL https://update.greasyfork.org/scripts/401200/zuanke8_aide.user.js
// @updateURL https://update.greasyfork.org/scripts/401200/zuanke8_aide.meta.js
// ==/UserScript==




var css = [
  ".fc{",
	"color:#f00!important;",
  "font-weight:bold!important;",
	"}",
  '.blockuser_bg{',
  'background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACPklEQVQ4T32TTWgTURSFz30zKcaiULGCuy4EFyKIogvXrrRocRKRNJMUkXamNF2oDdSVQhcKBReCM4lYccZqSSa1qFh0JfiDP7hxEUR3WhCkrqLUJDPvyhQtSZr07t67532cx7mX0FIx3YyDeBLAbgDLxHjvA6MPXPtHqzY8U+OlljLOCOAigAm1y39dXYlGFKU+IIEsQP0lx/rYClkDxNPmATDfQsCJ4myu3Cg8mRzeL4R46Tn25s6AlJlgloc9NzfWzqqWMucEB9mim//a2F9zEEuNFMCi6LlWsR0gljIuCeZ3BTf3pAPAzAC8zXPsyx0ACzW1pj+cmam0BcSTo7tYyC/Vuux9dD+/3CgaGDL6FElPS44VJtNULSmYRwhYIMghtSt4UV1BRFGUUww6R0QninesDxsCjiXMnqjKUwBGGfyZQJsAbCei6SAIbAVqd6Ci51dQKT9z3d9Nc6AlDY0EboJwRfqRe/Oz15dCQWg/4ss9LJQpIuxgyT9BiAI07jnW4uoXtLShQXKamUfm7+a/N9rU9QvdK1RZAovh/wlpaWOKJI5D8DQNDma21pT6KwYmPcd+vG60h4zTkJz0nFx/2IulRyxA9JGUniTaR2G+AA55jn20bXy6cR6ELTVVzXf5/jUGfBGJZlD7sxfEWdJShgPgecmxZzrk30/AGAMqQGXPscZXnehmnEkeDB2w59hNca7fUOMTCHPMcrHk5t/+29gCCbFzw4eNoJhuXCWCxkAvwG9URTk7d/vGt7+x7Ove9OkLSAAAAABJRU5ErkJggg==);',
  '}'
].join('\n');

function initCss(){
  if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
}

/** **/
function get_block_user($){
  return new Promise((resolve, reject) => {
    var block_users = [];
    $.ajax({
      url:'http://www.zuanke8.com/home.php?mod=space&uid=819296&do=friend&view=blacklist&quickforward=1&start=',
      type:'get',
      dataType:'html',
      //async:false,
      success: function(data){
        var block_user_li = $('#friend_ul ul li',data);
        $.each(block_user_li,function(i,dom){
          var $dom = $(dom);

          var uid = $dom.attr('id');
          uid = uid.split('_')[1];
          var uname = $dom.find('h4 a[href="http://www.zuanke8.com/space-uid-'+uid+'.html"]').text();
          block_users.push({'uid':uid,'uname':uname});
        });
        resolve(block_users)
      },
      error: function () {reject(block_users)}
    })
  });
}



// 简单判断是否登录
async function check_is_login($){

  if(!discuz_uid){
    return {is_login:false};
  }

  var block_users = await get_block_user($);

  // 帖子列表
  var $thread_list_table = $('#threadlisttableid');
  if($thread_list_table[0]){
    return {is_login:true,block_users:block_users,thread_list:$thread_list_table};
  }

  // 帖子详情
  var $post_list = $('#postlist');
  if($post_list[0]){
    return {is_login:true,block_users:block_users,post_list:$post_list};
  }

  return {is_login:true};
}


function thread_list_filter($,thread_list,block_users){

  // 存在已拉黑的用户，则filter
  if(block_users.length > 0){

    $.each(block_users,function(i,o){
        var block_uid = o.uid;
        var block_uname = o.uname;
        $('a[href="http://www.zuanke8.com/space-uid-'+block_uid+'.html"]').parents('tbody').remove();
    });
  }

}


function post_list_filter($,post_list,block_users){

    $('#hiddenpoststip').remove()
    $('#hiddenposts').remove();

    var div_elems = post_list.children('div[id^="post_"]');
    $.each(div_elems,function(i,dom){
      var $dom = $(dom);
      var $ul = $dom.find('ul');
      var id = $dom.attr('id');
      id = id.replace(/post_/g,'');
      var name = $('#favatar'+id).find('.authi').text();
      var li = '<li class="blockuser_bg"><a href="javascript:;" data-uid='+id+' data-uname='+name+' title="拉黑" class="fc">拉黑</a></li>';

      var $ul = $dom.find('ul');
      $ul.append(li);

      // 移除头像
      $dom.find('div[class="avatar"]').remove();
    });

    var formhash;

    $.ajax({
      type:'get',
      url:'http://www.zuanke8.com/home.php?mod=space&do=friend',
      dataType:'html',
      success:function(data){
        var scbar_form = $('#scbar_form',$(data));
        formhash = $('input[name="formhash"]',scbar_form).val();
        console.log(formhash)
      }
    });


    $('ul li.blockuser_bg a').on('click',function(){
      var uid = $(this).data('uid');
      var uname = $(this).data('uname');

      if(confirm('确认拉黑'+uname+'?')){

        var params = {
          blacklistsubmit:true,
          blacklistsubmit_btn:true,
          formhash:formhash,
          username:uname
        };
        var send_body = '';
        $.each(params,function (key,value) {
            send_body += (key + '=' + GBK.URI.encodeURI(value) + '&')
        });
        send_body = send_body.substring(0,send_body.lastIndexOf('&'));

         $.ajax({
          url:'http://www.zuanke8.com/home.php?mod=spacecp&ac=friend&op=blacklist&start=',
          type:'post',
          data:send_body,
          success:function(data){
            alert('操作成功，可以去《我的好友列表---我的黑名单》查看是否成功！');
          }
        })

      }
    });
}

jQuery.noConflict();

(async function($){
  "use strict";

    initCss();
    $('#scform').find('h1 a').find('img').remove();
    $('#hd').find('h2 a').find('img').remove();
    $('title').text('-');

    var rs = await check_is_login($);
    console.log(rs);
    if(!rs.is_login){
      console.log('未登录!');
      return;
    }

    var block_users = rs.block_users;

    var thread_list = rs.thread_list;
    if(thread_list && thread_list.get(0)){
      thread_list_filter($,thread_list,block_users);
    }


    var post_list = rs.post_list
    if(post_list && post_list.get(0)){
      post_list_filter($,post_list,block_users);
    }




})(jQuery);
