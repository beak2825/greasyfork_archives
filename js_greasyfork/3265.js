// ==UserScript==
// @name       tb_borer
// @namespace   iaceob_tborer
// @description tba_style
// @include     http://tieba.baidu.com/*
// @version     2.2.2 alpha
// @grant       none
// @author 生物烯丙菊
// @downloadURL https://update.greasyfork.org/scripts/3265/tb_borer.user.js
// @updateURL https://update.greasyfork.org/scripts/3265/tb_borer.meta.js
// ==/UserScript==

String.prototype.format = function () {
  var txt = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    var exp = getStringFormatPlaceHolderRegEx(i);
    txt = txt.replace(exp, (arguments[i] == null ? "" : arguments[i]));
  }
  return cleanStringFormatResult(txt);
};
function getStringFormatPlaceHolderRegEx(placeHolderIndex) {
  return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm');
};
function cleanStringFormatResult(txt) {
  if (txt == null) return '';
  return txt.replace(getStringFormatPlaceHolderRegEx("\\d+"), "");
};

String.prototype.filterHtmlTag = function(){
  var str = this.toString();
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&#39;');
  return str;
};

Array.prototype.remove=function(dx) {
    if(isNaN(dx)||dx>this.length){ return false; }
    for(var i=0,n=0;i<this.length;i++) {
        if(this[i]!=this[dx]) this[n++]=this[i];
    }
    this.length-=1;
    return true;
};


!(function(window, $, undefined){

  var document = window.document;
  var pd = window.PageData;

  if (!pd) {
    return;
  }

  var config = {
    history: {
      title: '',
      // url: '',
      data: null
    },
    posts: {
      page_url: '',
      handle_url: 'http://tieba.baidu.com/f/commit/thread/add',
      forum_id: 0,
      forum_name: 0,
      tbs: '',
      floor_num: 0,
      content: '',
      title: ''
    },
    post: {
      page_url: '',
      handle_url: 'http://tieba.baidu.com/f/commit/post/add',
      forum_id: 0,
      thread_id: 0,
      forum_name: '',
      tbs: '',
      floor_num: 1,
      lzl_url: 'http://tieba.baidu.com/p/comment',
      lzl_pn: 1,
      post_id: '',
      see_lz: false
    },
    captcha: {
      url4: 'http://tieba.baidu.com/cgi-bin/genimg',
      url4_get: 'http://tieba.baidu.com/f/commit/commonapi/getVcode',
      url_check: 'http://tieba.baidu.com/f/commit/commonapi/checkVcode',
      type: 0,
      code: '',
      input: '',
      value: []
    },
    user: {
      id: 0,
      name: ''
    },
    depend: [
      // {url: 'http://balupton.github.io/history.js/scripts/bundled/html4+html5/jquery.history.js', type: 'js'},
      {url: 'http://well.iaceob.name/shell/pace/v0.5.3/pace.min.js', type: 'js'},
      {url: 'http://well.iaceob.name/shell/tba/jquery.omniwindow.js', type: 'js'},
      {url: 'http://well.iaceob.name/shell/tba/tba_v2.1_alpha.css', type: 'css'},
      {url: 'http://well.iaceob.name/shell/bd_um/themes/default/css/umeditor.css', type: 'css'},
      {url: 'http://well.iaceob.name/shell/bd_um/umeditor.config.js', type: 'js'},
      {url: 'http://well.iaceob.name/shell/bd_um/umeditor.min.js', type: 'js'},
      {url: 'http://well.iaceob.name/shell/bd_um/lang/zh-cn/zh-cn.js', type: 'js'},
    ],
    message: {
      url: {
        atme: 'http://tieba.baidu.com/i/sys/jump?type=atme',
        replay: 'http://tieba.baidu.com/i/sys/jump?type=replyme',
        fans: 'http://tieba.baidu.com/i/sys/jump?type=fans',
        feature: 'http://tieba.baidu.com/i/sys/jump?type=feature',
        recycle: 'http://tieba.baidu.com/pmc/recycle'
      },
      number: {
        atme: 0,
        replay: 0,
        fans: 0,
        feature: 0,
        recycle: 0,
        total: 0
      },
      recycle: {
        url: 'http://tieba.baidu.com/pmc/userthreadinfo',
        currentPage: 1,
        pageSize: 20
      },
      show: false,
      constraint: false,
      interval: 60*1000
    },
    editor: null
  };

  var tpl = {};
  var tborer = {};
  tborer.config = config;
  config.user.id = pd.user.user_id;
  config.user.name = pd.user.user_name;
  window.cfg = config;
  tpl.html_header = '<header id="header" class="loop-12 slide-time"></header>';
  tpl.html_container = '<div class="span container">{0}</div>';
  tpl.html_footer = '<footer id="footer" class="loop-12">Footer</footer>';
  tpl.html_footer += '<div class="ow-overlay ow-closed"></div><div class="tba-modal ow-closed">Hello, human!</div>';
  tpl.html_box_posts = '<div class="loop-12 box_posts slide-time" id="box_posts"></div>';
  tpl.html_box_post = '<div class="loop-12 post_container" id="post_container"></div>';
  tpl.html_footer += '<div class="box_pcfg">\
  <div class="loop-12 btn_gotop"><span>&#8593;</span></div>\
  <div class="loop-12 btn_pl"><span>≡</span></div>\
  <div class="loop-12 btn_tb_msg"><span>消息</span><span class="tb-msg-num"></span></div>\
  <div class="loop-12 btn_godown"><span>&#8595;</span></div>\
  </div>';
  // tpl.css = 'http://idc.iaceob.name/tba_style/tba_v1.6_alpha.css';
  // tpl.js_omniwindow = 'http://idc.iaceob.name/tba_style/jquery.omniwindow.js';
  // getTiebaMessage

  if (location.href === 'http://tieba.baidu.com/') {
    return;
  }


  function initBorer() {
    if (!!pd.forum.id) {
      setPostsConfig($('body').text());
      var postsPage = parsePosts($('body'));
      initPage();
      initPosts(postsPage);
      openPosts();
      return;
    }
    if (!!pd.forum.forum_id) {
      $.ajax({
        url: 'http://tieba.baidu.com/' + pd.forum.forum_name,
        dataType: 'html'
      }).done(function(data){
        config.post.page_url = window.location.href;
        setPostConfig($('body').text());
        setPostsConfig($(data).text());
        var postPage = parsePost($('body'));
        initPage();
        initPosts(parsePosts($(data)));
        initPost(postPage);
        openPosts();
      });
      return;
    }
  };

  function initPage() {
      var fhtml = parseFooter();
      html = tpl.html_header;
      html += tpl.html_container.format(tpl.html_box_posts+tpl.html_box_post);
      html += tpl.html_footer;
      $('body').empty();
      $('body').html(html);
      // $('#head').html(html);
      initHeader();
      initFooter(fhtml);
      initImport();
      bindEvent();
  };

  function initPosts(body) {
      $('.posts_paging a').unbind('click');
      $('#post_container').empty();
      $('#box_posts').html(body);
      $('#box_posts').scrollTop(0);
      monitorHPage();
  };

  function initPost(body) {
      $('.post-page a').unbind('click');
      $('#post_container').html(body);
      $('#post_container').scrollTop(0);
      mointorPPage();
  };
  
  function initHeader() {
    var hhtml = '<div class="loop-2 tiebalogo"><img src="http://tb2.bdstatic.com/tb/static-common/img/search_logo_7098cbef.png"></div>';
    hhtml += '<div class="loop-8">\
    <div class="select_box">\
    <input type="text" name="query" id="query" class="keyipt" autocomplete="off">\
    <div id="search_list" style="display: none"></div>\
    </div>\
    </div>';
    $('#header').html(hhtml);
  };

  function initFooter(fhtml) {
    $('#footer').html(fhtml);
  };

  function initImport(){
    for(var i=0; i<config.depend.length; i++) {
      loadFile(config.depend[i].url, config.depend[i].type);
    }
  };

  function monitorHPage() {
    $('#btn_posting').bind('click', function(){
      var pshtml = '';
      pshtml += '<div class="box_modal">\
      <div class="modal_container">\
        <div class="loop-12"><textarea id="posts_editor" name="content" style="width:100%;height:360px;"></textarea></div>\
        <div class="loop-2">贴吧:</div>\
        <div class="loop-10 forum_name">' + config.posts.forum_name + '</div>\
        <div class="loop12">标题:</div>\
        <div class="loop-12"><input type="text" id="posts_title" name="title" autocomplete="off"></div>\
      </div>\
      <div class="loop-12" id="modal_other"></div>\
      <div class="loop-12 modal_result"></div>\
      <div class="loop-12"><button class="btn" id="btn_submit">提交</button></div>\
      </div>';      
      $('.tba-modal').html(pshtml);
      window.UM.delEditor('posts_editor');
      var editor_posts = window.UM.getEditor('posts_editor');
      config.editor = editor_posts;
      $('.tba-modal').omniWindow().trigger('show');
      $('#btn_submit').bind('click', function(){
        var title = $('#posts_title').val();
        var content = formatEditor(editor_posts.getContent());
        executePosting(title, content);
      });
    });
    $('.posts_paging a').bind('click', function(){
      handleGetPosts(this.href);
      return false;
    });
    $('.posts_list li').bind('click', function(){
      config.history.title = $(this).find('.post_title').text();
      // config.history.url = $(this).data('href');
      handleGetPost($(this).data('href'));
      closePosts();
    });
  };

  
  function mointorPPage() {
    $('.post-page a').bind('click', function(){
      handleGetPost(this.href);
      return false;
    });
    $('#post_replay').bind('click', function(){
      var pshtml = '';
      pshtml += '<div class="box_modal">\
      <div class="modal_container">\
        <div class="loop-12"><textarea id="post_editor" name="content" style="width:100%;height:360px;"></textarea></div>\
        <div class="loop-2">贴吧:</div>\
        <div class="loop-10 forum_name">' + config.posts.forum_name + '</div>\
      </div>\
      <div class="loop-12" id="modal_other"></div>\
      <div class="loop-12 modal_result"></div>\
      <div class="loop-12"><button class="btn" id="btn_submit">提交</button></div>\
      </div>';
      $('.tba-modal').html(pshtml);
      window.UM.delEditor('post_editor');
      var editor_post = window.UM.getEditor('post_editor');
      config.editor = editor_post;
      $('.tba-modal').omniWindow().trigger('show');
      $('#btn_submit').bind('click', function(){
        var content = formatEditor(editor_post.getContent());
        executPostReplay(content);
      });
    });
    $('.btn_replay_lzl').bind('click', function(){
      if($(this).data('floor')==1) {
        $('#post_replay').click();
        return;
      }
      config.post.lzl_pn = 1;
      config.post.floor_num = $(this).data('floor');
      config.post.post_id = $(this).data('pid');
      handleGetLzlReplay();
    });
    $('#see_lz').bind('click', function(){
      if (config.post.see_lz) {
        config.post.see_lz = false;
        handleGetPost(config.post.page_url.split('?')[0]);
        return;
      }
      config.post.see_lz = true;
      handleGetPost(config.post.page_url.split('?')[0] + '?see_lz=1');
      return;
    });
  };

  function mointorSearch(){
    $.ajax({
      url: 'http://tieba.baidu.com/suggestion',
      data: $('#query').serialize(),
      dataType: 'json',
    }).done(function(data){
      $('#search_list').html(parseSearch(data));
    });
  };

  function mointorLzlReplay(pid, html) {
      $('.tba-modal').html(html);
      $('.tba-modal').omniWindow().trigger('show');
      $('.lzl-page a').bind('click', function(){
        config.post.lzl_pn = this.href.split('#')[1];
        config.post.post_id = pid;
        handleGetLzlReplay();
      });
      $('.btn_lzl_replay').bind('click', function(){
        $('.box_lzl_replay').empty();
        var pid = $(this).data('spid');
        var aur = $(this).data('author');
        var lrp = '<div id="box_lzl_replay_' + pid + '" class="span box_lzl_replay">\
        <div class="loop-12 lzl_editor"><textarea id="lzl-editor-' + pid + '">' + (!aur ? '' : '@'+aur+' ') + '</textarea></div>\
        <div class="loop-12 lzl_operate">\
        <button class="btn" id="btn_handle_replay_lzl" data-pid="' + pid + '">回复</button>\
        </div>\
        <div class="lzl_replay_other"></div>\
        </div>';
        $('#box_lzl_rep-' + pid).html(lrp);
        monitorBtnLzlReplay();
      });
  };

  function monitorBtnLzlReplay() {
    $('#btn_handle_replay_lzl').bind('click', function(){
      var pid = $(this).data('pid');
      var content = $('#lzl-editor-' + pid).val();
      $.ajax({
        url: config.post.handle_url,
        type: 'post',
        data: {
          anonymous: 0,
          fid: config.post.forum_id,
          floor_num: config.post.floor_num,
          ie: 'utf-8',
          kw: config.post.forum_name,
          quote_id: config.post.post_id,
          repostid: config.post.post_id,
          rich_text: 1,
          // tag: 11,
          tbs: config.post.tbs,
          tid: config.post.thread_id,
          new_vcode: 1,
          content: content,
          vcode_md5: config.captcha.code,
          vcode: config.captcha.input
        },
        dataType: 'json'
      }).done(function(data){
        parseLzlReplay(data, pid);
      });
    });
  };
  
  window.handleSearchResult = function(forum){
    var url = 'http://tieba.baidu.com/' + forum;
    handleGetPosts(url);
    config.history.title = forum;
    // config.history.url = url;
    window.history.pushState(config.history, null, url);
  };

  function handleGetPosts(postsUrl) {
    // History.pushState({mark: 'posts'}, config.history.title, postsUrl);
    config.posts.page_url = postsUrl;
    window.history.pushState(config.history, null, postsUrl);
    $.ajax({
      url: postsUrl,
      dataType: 'html'
    }).done(function(data){
      setPostsConfig($(data).text());
      initPosts(parsePosts($(data)));
    });
  };

  function handleGetLzlReplay() {
    $.ajax({
      url: config.post.lzl_url,
      data: {tid: config.post.thread_id, pid: config.post.post_id, pn: config.post.lzl_pn},
      dataType: 'html'
    }).done(function(data){
      window.da = $(data);
      var lhtml = parsePostLzl($(data));
      mointorLzlReplay(config.post.post_id, lhtml);
    });
  };

  function handleGetPost(postUrl) {
    // History.pushState({mark: 'post'}, config.history.title, postUrl);
    config.post.page_url = postUrl;
    window.history.pushState(config.history, null, postUrl);
    $.ajax({
      url: postUrl,
      dataType: 'html'
    }).done(function(data){
      initPost(parsePost($(data)));
      setPostConfig($(data).text());
    });
  };



  function setPostsConfig(text) {
    var tbs = text.match(/PageData.tbs([ ]*)=([ ]*)"(.*?)"/);//[3]
    var fid = text.match(/PageData.forum([ ]*)=([ ]*){(.*?)"forum_id":(\d+)/);
    var fe = text.match(/PageData.forum([ ]*)=([ ]*){(.*?)"forum_name":"(.*?)"/);
    config.posts.tbs = !tbs ? '' : tbs[3];
    config.posts.forum_id = !fid ? 0 : fid[4];
    config.posts.forum_name = !fe ? '' : decodeUnicode(fe[4]);
    config.posts.page_url = 'http://tieba.baidu.com/' + config.posts.forum_name;
  };

  function setPostConfig(text){
    var tbs1 = text.match(/PageData([ ]*)=([ ]*){(.*?)'tbs'(.*?):(.*?)"(.*?)"/);
    var tbs2 = text.match(/PageData([ ]*)=([ ]*){(.*?)tbs(.*?):(.*?)'(.*?)'/);
    var fid = text.match(/PageData.forum([ ]*)=([ ]*){(.*?)"forum_id":(\d+)/);
    var fe = text.match(/PageData.forum([ ]*)=([ ]*){(.*?)"forum_name":"(.*?)"/);
    var tid = text.match(/PageData.thread([ ]*)=([ ]*){(.*?)thread_id(.*?):(\d+)/);
    config.post.tbs = !tbs1 ? tbs2[6] : tbs1[6];
    config.post.forum_id = !fid ? 0 : fid[4];
    config.post.forum_name = !fe ? '' : decodeUnicode(fe[4]);
    config.post.thread_id = !tid ? 0 : tid[5];
  };
  
  function bindEvent() {
    window.tborer = tborer;
    $('#query').bind('keyup', function(event){
      $('#search_list').show();
      if (event.keyCode != 13) {
        mointorSearch(); 
        return;
      }
     event.cancelBubble = true;
     event.returnValue = false;
     window.handleSearchResult($(this).val());
    });
    $('#query').bind('click', function(){
      $('#search_list').show();
      mointorSearch();
      openPosts();
    });
    $('#search_list').hover(function(){
      $(this).show();
    }, function(){
      $(this).hide();
    });
    $('.btn_pl').bind('click', function(){
      if ($('#box_posts').hasClass('show')) {
        closePosts();
        return;
      }
      openPosts();
    });
    $('#post_container').bind('mousemove', function(event){
        var e = event||window.event;
        // var h = window.innerHeight;
        var y = e.clientY;
        // || h-y<100
        if(y<20){
          $('#header').addClass('show');
          return;
        }
        $('#header').removeClass('show');
    });
    $('.btn_gotop').bind('click', function(){
      $('#post_container').animate({scrollTop:0},1000);
    });
    $('.btn_godown').bind('click', function(){
      $('#post_container').animate({scrollTop:$('#post_container')[0].scrollHeight},1000);
    });
    $('.btn_tb_msg').bind('click', function(){
      config.message.constraint = false;
      mointorTiebaMessage();
    });
    // window.setTimeout(getTiebaMessage(),5000);
    window.setTimeout(function(){
      window.initItiebaMessage = function(msg){
        tborer.parseTiebaMessage(msg);
      };
      window.tiebaMsgTimer = setInterval(function(){
        tborer.handleGetTiebaMessage();
      }, config.message.interval);
    }, 3000);
    /*
    window.setTimeout(function(){
      History.Adapter.bind(window,'statechange',function(){
        tborer.handleHistory(History.getState());
      });
    }, 3000);
  */
  };
  

  function parseFooter() {
    var tf = $('#footer').html();
    var fhtml = '<div class="loop-12">' + tf + '</div>';
    return fhtml;
  };
  
  function parseSearch(data) {
    var qms = data.query_match.search_data;
    if (qms.length==0) {
      return '<p>无数据';
    }
    var qhtml = '<ul>';
    for(var i=0; i<qms.length; i++) {
      qhtml += '<li onclick="handleSearchResult(&quot;' + qms[i].fname + '&quot;)">\
      <div class="sh_forum_name">' + qms[i].fname + '</div>\
      <div class="sh_forum_desc">' + qms[i].forum_desc + '</div>';
    }
    qhtml += '</ul>';
    return qhtml;
  };
  
  function parsePosts(postsDom) {
    var h_posts = postsDom.find('li.j_thread_list');
    var h_paging = postsDom.find('#frs_list_pager');
    var h_cur_page = postsDom.find('#frs_list_pager .cur');
    var h_cur_url = !h_cur_page.length ? '#?' + window.Math.random() : '/f?kw=' + config.posts.forum_name + '&pn=' + (h_cur_page.text()*50-50);
    var ho_pobj = {}, posts_html='';
    posts_html='<div class="span"><div class="loop-12 posts_list"><ul>';
    for(var i=0; i<h_posts.length; i++) {
      var hp = h_posts[i];
      var hp_rep_num = $(hp).find('.threadlist_rep_num')[0].textContent;
      var hp_title = $(hp).find('.j_th_tit')[1].textContent;
      var hp_href = $(hp).find('.j_th_tit')[1].href;
      var hp_detail = !$(hp).find('.threadlist_text')[1] ? '' : $(hp).find('.threadlist_text')[1].textContent.filterHtmlTag();
      var hp_author = !$(hp).find('.j_user_card')[0] ? '' : $(hp).find('.j_user_card')[0].textContent;
      var hp_last_repuser = !$(hp).find('.j_user_card')[1] ? '' : $(hp).find('.j_user_card')[1].textContent;
      var hp_last_time = !$(hp).find('.j_reply_data')[0] ? '' : $(hp).find('.j_reply_data')[0].textContent;
      posts_html += '<li data-href="' + hp_href + '">\
      <div class="span">\
      <div class="loop-10 post_title hidefont" title="' + hp_title + '">' + hp_title + '</div>\
      <div class="loop-2 post_author hidefont" title="' + hp_author + '">' + hp_author + '</div>\
      <div class="loop-12 box_posts_detail">' + hp_detail + '</div>\
      <div class="loop-5 post_repuser hidefont">最后回复人:' + hp_last_repuser + '</div>\
      <div class="loop-5 post_lasttime">最后回复时间:' + hp_last_time + '</div></div>';
    }
    posts_html += '</ul></div>';
    posts_html += '</div>\
    <div class="span">\
    <div class="loop-4 posts_paging">' + 
      (!h_paging.length ? '' : h_paging.html()) +
      '<a href="' + h_cur_url + '">刷新</a>\
      <span id="btn_posting">发帖</span>\
    </div>\
    </div>';
    return posts_html;
  };
  
  
  function parsePost(postDom) {
    var post_title = postDom.find('.core_title_txt').html()
    var post_info = postDom.find('.l_post');
    var post_content = postDom.find('.p_content cc');
    var author_avatar = postDom.find('.p_author_face img');
    var lzlbox = postDom.find('j_lzl_c_b_a');
    var ppage = postDom.find('.pb_list_pager')[0];
    var post_html = '';
    post_html += '<div class="loop-12 post_title">' + post_title + '</div>';
    for(var i=0; i<post_info.length; i++) {
      var pi = $(post_info[i]).data('field');
      var pc = post_content[i];
      post_html += '<section data-post="' + pi.content.post_id + '" >';
      post_html += '<div class="loop-2 post_info">\
      <div class="loop-12 post_author" data-user="' + pi.author.user_id + '">\
        <div><img src="http://tb.himg.baidu.com/sys/portrait/item/' + pi.author.portrait + '"></div>\
        <span>' + pi.author.user_name + '</span>\
      </div>\
      <div class="loop-12 post_author_level">\
        <span>' + (pi.author.level_name||'*') + '</span>\
        <span>' + (pi.author.level_id||'0') + '</span>\
      </div>\
      </div>';
      post_html += '<div class="loop-10 post_article">' + pc.innerHTML + '</div>';
      post_html += '<div class="loop-10 post_msg"><div class="loop-2 btn_replay_lzl" data-pid="' + pi.content.post_id + '" data-floor="' + pi.content.post_no + '">楼中楼(' + pi.content.comment_num + ')</div><div class="loop-2">' + pi.content.post_no + '楼</div><div class="loop-2">' + pi.content.date + '</div></div>';
      post_html += '</section>';
    }
    post_html += '<div class="loop-4 post-page">' + ppage.innerHTML + '<span id="post_replay">回复</span><span id="see_lz">楼主模式</span></div>';
    post_html += '<div class="loop-4 post-url"><span>' + config.post.page_url + '</span></div>';
    post_html='<div class="span box_post">' +post_html+ '</div>';
    return post_html;
  };
  
  function parsePostLzl(data) {
    var lzlhtml = '<div class="box_lzl"><ul>';
    for(var i=0; i<data.length; i++) {
      var lzlinfo = $(data[i]).data('field');
      var lzltext = $(data[i]).find('.lzl_cnt span.lzl_content_main').html();
      var lzltime = $(data[i]).find('.lzl_cnt span.lzl_time').html();
      if (!lzlinfo.spid) {
        break;
      }
      lzlhtml += '<li id="lzl-'+lzlinfo.spid+'">\
      <div class="span">\
      <div class="loop-4 lzl_author">' + lzlinfo.user_name + '</div>\
      <div class="loop-8 lzl_cnt">' + lzltext + '</div>\
      <div class="loop-12 lzl_info">\
      <span>' + lzltime + '</span>\
      <span class="btn_lzl_replay" data-spid="' + lzlinfo.spid + '" data-author="' + lzlinfo.user_name + '">回复</span></div>\
      </div>\
      <div id="box_lzl_rep-' + lzlinfo.spid + '"></div>';
    }
    lzlhtml += '</ul>';
    lzlhtml += '<div class="span">\
    <div class="loop-12">\
    <span class="btn_lzl_replay" data-spid="1">回复</span></div>\
    </div>\
    </div>\
    <div id="box_lzl_rep-1"></div>';
    var lzlp = $(data[data.length-1]).find('.j_pager');
    lzlhtml += !lzlp.length ? '' : '<div class="loop-12 lzl-page">' + lzlp.html() + '</div>';
    lzlhtml += '</div>';
    return lzlhtml;
  };


  function executePosting(title, content){
    $.ajax({
        url: config.posts.handle_url,
        type: 'post',
        data: {
            content: content,
            fid: config.posts.forum_id,
            floor_num: config.posts.floor_num,
            ie: 'utf-8',
            kw: config.posts.forum_name,
            rich_text: 1,
            tbs: config.posts.tbs,
            tid: 0,
            title: title,
            vcode: config.captcha.input,
            vcode_md5: config.captcha.code
        },
        dataType: 'json'
    }).done(function(data){
        parsePosting(data);
    });
  };


  function executPostReplay(content) {
    $.ajax({
      url: config.post.handle_url,
      type: 'post',
      data: { 
        kw: config.post.forum_name,
        ie: 'utf-8',
        rich_text: 1,
        floor_num: config.post.floor_num,
        fid: config.post.forum_id,
        tid: config.post.thread_id,
        content: content,
        anonymous: 0,
        tbs: config.post.tbs,
        vcode_md5: config.captcha.code,
        vcode: config.captcha.input
      },
      dataType: 'json'
    }).done(function(data){
      parsePostReplay(data);
    });
  };

  function parsePosting(data) {
    if (!data.no) {
      handleGetPosts(config.posts.page_url);
      $('.tba-modal').omniWindow().trigger('hide');
      return;
    }
    var vhtml = '', da = data.data;
    var captHtml = parsePostCaptcha(da);
    if (!captHtml) {
      return;
    }
    $('#modal_other').html(captHtml);
    mointorCaptcha();
  };

  function parsePostReplay(data) {
    if (!data.no) {
      handleGetPost(config.post.page_url);
      $('.tba-modal').omniWindow().trigger('hide');
      return;
    }
    var vhtml = '', da = data.data;
    var captHtml = parsePostCaptcha(da);
    if (!captHtml) {
      return;
    }
    $('#modal_other').html(captHtml);
    mointorCaptcha();
  };

  function parseLzlReplay(data, mark) {
    if (!data.no) {
      handleGetLzlReplay();
      return;
    }
    var vhtml = '', da = data.data;
    var captHtml = parsePostCaptcha(da);
    if (!captHtml) {
      return;
    }
    $('.lzl_replay_other').html(captHtml);
    mointorCaptcha();
  };

  function parsePostCaptcha(data) {
    config.captcha.value = [];
    var vhtml = '';
    if (!data.vcode.need_vcode) {
      return null;
    }
    config.captcha.code = data.vcode.captcha_vcode_str;
    config.captcha.type = data.vcode.captcha_code_type;
    var img = config.captcha.url4 + '?' + data.vcode.captcha_vcode_str;
    vhtml += '<div class="box_captcha">';
    vhtml += '<div class="loop-12 captcha"><img src="' + img + '"></div>';
    vhtml += '<div class="loop-12 captcha-input">\
    <input type="checkbox" class="cait cait-1" data-index="1" value="00000000">\
    <input type="checkbox" class="cait cait-2" data-index="2" value="00010000">\
    <input type="checkbox" class="cait cait-3" data-index="3" value="00020000">\
    <input type="checkbox" class="cait cait-4" data-index="4" value="00000001">\
    <input type="checkbox" class="cait cait-5" data-index="5" value="00010001">\
    <input type="checkbox" class="cait cait-6" data-index="6" value="00020001">\
    <input type="checkbox" class="cait cait-7" data-index="7" value="00000002">\
    <input type="checkbox" class="cait cait-8" data-index="8" value="00010002">\
    <input type="checkbox" class="cait cait-9" data-index="9" value="00020002">\
    </div>';
    // vhtml += '<div class="loop-12"><button type="button" id="btn_refre_captcha">换一张</button></div>';
    vhtml += '<div class="loop-12"><div class="loop-10" id="captchackr"></div><div class="loop-2" id="delcaptchar">X</div></div>';
    vhtml += '<div class="loop-12" id="post-result"></div>';
    vhtml += '</div>';
    return vhtml;
  };

  function mointorCaptcha() {
    $('.cait').bind('click', function(){
      if (config.captcha.value.length<4) {
        $(this).prop({disabled: true});
        config.captcha.value.push({val: $(this).val(), index: $(this).data('index')});
        $('#captchackr').append('<span id="checkcaptchar-' + $(this).data('index') + '">' + $(this).data('index') + '</span>');
        if (config.captcha.value.length==4) {
          var captVal = '';
          for(var i=0; i<config.captcha.value.length; i++) {
            captVal += config.captcha.value[i].val;
          }
          config.captcha.input = captVal;
        }
        return;
      }
    });
    $('#delcaptchar').bind('click', function(){
      for(var i=0; i<config.captcha.value.length; i++) {
        if ((i+1)==config.captcha.value.length) {
          $('#checkcaptchar-' + config.captcha.value[i].index).remove();
          $('.cait-' + config.captcha.value[i].index).prop({disabled: false, checked: false});
          config.captcha.value.remove((i+1));
        }
      }
    });
    /*
    $('#btn_refre_captcha').bind('click', function(){
      // $('#btn_post').click();
    });
    */
  };



  function parseMsgPage(data) {
    var msgs = data.find('#feed li');
    var atmeuser = msgs.find('.atme_user');
    var atmecnt = msgs.find('.atme_content');
    var feedfrom = msgs.find('.feed_from');
    var replayuser = msgs.find('.replyme_user');
    var replaycnt = msgs.find('.replyme_content');
    var feature = data.find('#featureList');
    var fansbox = data.find('#follow');
    var shtml = '';
    shtml += '<div class="span box_tbmsg">';
    if (atmeuser.length) {
      for (var i = 0; i < atmeuser.length; i++) {
        shtml += '<div class="msg_cnt">';
        shtml += '<div class="loop-2 msg_row_1 atme_user">' + atmeuser[i].innerHTML + '</div>';
        shtml += '<div class="loop-10 msg_row_2 atme_content">' + atmecnt[i].innerHTML + '</div>';
        shtml += '<div class="loop-12 msg_row_3 feed_from">' + feedfrom[i].innerHTML + '</div>';
        shtml += '</div>';
      }
    }
    if (replayuser.length) {
      for (var i = 0; i < replayuser.length; i++) {
        shtml += '<div class="msg_cnt">\
        <div class="loop-2 msg_row_1 replay_user">' + replayuser[i].innerHTML + '</div>\
        <div class="loop-10 msg_row_2 replay_content">' + replaycnt[i].innerHTML + '</div>\
        <div class="loop-12 msg_row_3 feed_from">' + feedfrom[i].innerHTML + '</div>\
        </div>';
      }
    }
    if (feature.length) {
      var feature_title = feature.find('.feature_title');
      var feature_ext = feature.find('.feature_title_ext');
      for (var i = 0; i < feature_title.length; i++) {
        shtml += '<div class="msg_cnt">';
        shtml += '<div class="loop-12 msg_row_1 feature_title">' + feature_title[i].innerHTML + '</div>';
        shtml += '<div class="loop-12 msg_row_2 feature_ext">' + feature_ext[i].innerHTML + '</div>';
        shtml += '</div>';
      }
      }
    if (fansbox.length) {
      var user = fansbox.find('.user');
      var page = fansbox.find('#pagerPanel div.pager');
      for(var i=0; i<user.length; i++) {
        var avatar = $(user[i]).find('.left img');
        var uinfo = $(user[i]).find('.mid');
        var ufns = $(user[i]).find('.right');
        shtml += '<div class="msg_cnt">';
        shtml += '<div class="loop-2 fans_avatar"><img src="' + avatar[0].getAttribute('isrc') + '"></div>';
        shtml += '<div class="loop-8 fans_infos">' + (uinfo.text()||'') + '</div>';
        shtml += '<div class="loop-2 fans_status">' + (ufns.text()||'') + '</div>';
        shtml += '</div>';
      }
      shtml += '<div class="loop-12 fans_page">' + (page.html()||'') + '</div>';
    }
    shtml += '</div>';
    return shtml;
  };

  function mointorTiebaMessage() {
    /*
    if (!config.message.number.total) {
      return;
    }
    */
    var html = '';
    html += '<div class="span">\
    <div class="loop-12 tb-msg-btn-group">\
    <button class="btn btn-msg-fans">粉丝<span class="msg-num-fans">' + (config.message.number.fans||'') + '</span></button>\
    <button class="btn btn-msg-replay">回复<span class="msg-num-replay">' + (config.message.number.replay||'') + '</span></button>\
    <button class="btn btn-msg-atme">@我<span class="msg-num-atme">' + (config.message.number.atme||'') + '</span></button>\
    <button class="btn btn-msg-feature">精品<span class="msg-num-feature">' + (config.message.number.feature||'') + '</span></button>\
    <button class="btn btn-msg-recycle">回收站<span class="msg-num-recycle">' + (config.message.number.recycle||'') + '</span></button>\
    </div>\
    <div class="loop-12 tb-msg-content"></div>\
    </div>';
    $('.tba-modal').html(html);
    $('.tba-modal').omniWindow().trigger('show');
    mointorTiebaMsgBtn();
  };

  function mointorTiebaMsgBtn() {
    $('.btn-msg-fans').bind('click', function(){
      handleGetMsgFans(config.message.url.fans);
    });
    $('.btn-msg-replay').bind('click', function(){
      $.ajax({
        url: config.message.url.replay,
        dataType: 'html',
        type: 'get'
      }).done(function(data){
        var shtml = parseMsgPage($(data));
        disposeTiebaMessage({category: 2, content: shtml});
      });
    });
    $('.btn-msg-atme').bind('click', function(){
      $.ajax({
        url: config.message.url.atme,
        dataType: 'html',
        type: 'get'
      }).done(function(data){
        var shtml = parseMsgPage($(data));
        disposeTiebaMessage({category: 3, content: shtml});
      });
    });
    $('.btn-msg-feature').bind('click', function(){
      $.ajax({
        url: config.message.url.feature,
        dataType: 'html',
        type: 'get'
      }).done(function(data){
        var shtml = parseMsgPage($(data));
        disposeTiebaMessage({category: 4, content: shtml});
      });
    });
    $('.btn-msg-recycle').bind('click', function(){
      var shtml = '<div class="span"><div class="loop-12">\
      <button class="btn btn_recycle" data-who="bawu">吧主团队删贴</button>\
      <button class="btn btn_recycle" data-who="system">系统删贴</button>\
      <button class="btn btn_recycle" data-who="louzhu">楼主删贴</button>\
      <button class="btn btn_recycle" data-who="self">自己删贴</button>\
      </div><div class="loop-12 result-recycle"></div><div class="loop-12 detail-recycle"></div></div>';
      disposeTiebaMessage({category: 5, content: shtml});
    });
  };

  function handleGetMsgFans(url) {
    $.ajax({
      url: url,
      dataType: 'html',
      type: 'get'
    }).done(function(data){
      var shtml = parseMsgPage($(data));
      disposeTiebaMessage({category: 1, content: shtml});
    });
  };

  function disposeTiebaMessage(data) {
    $('.tb-msg-content').html(data.content);
    switch(data.category){
      case 5:
        $('.btn_recycle').bind('click', function(){
          config.message.recycle.currentPage = 1;
          handleGetRecycle($(this).data('who'));
        });
        return false;
    };
    $('.msg_cnt a').bind('click', function(){
        try {
          if (this.href.match(/\/f\?kw=.*/)) {
            handleGetPosts(this.href);
            openPosts();
          }
          if (this.href.match(/\p\/.*/)) {
            handleGetPost(this.href);
            closePosts();
          }
          if (this.href.match(/(.*=.*&)/)) {
            handleGetPost(this.href);
            closePosts();
          }
          if (this.href.match(/\/i\/.*/)) {

          }
        } catch (e) {
           console.log(e);
           console.log('...这什么错');
        } finally {
          $('.tba-modal').omniWindow().trigger('hide');
          return false;
        }
    });
    !$('.fans_page').length||$('.fans_page a').bind('click', function(){
      handleGetMsgFans(this.href);
      return false;
    });
    return false;
  };

  function handleGetRecycle(who){
    $('.detail-recycle').text('');
    $.ajax({
      url: config.message.recycle.url,
      type: 'post',
      dataType: 'json',
      data: {
        bywho: who,
        curpage: config.message.recycle.currentPage,
        pagenum: config.message.recycle.pageSize
      }
    }).done(function(data){
      var rlrcl = parseRecycle(data);
      $('.result-recycle').html(rlrcl.result);
      mointorRecycleResult(rlrcl.page);
    });
  };


  function parseRecycle(data) {
    if (data.errno) {
      return;
    }
    var rfo = null;
    if (data.barServicePosts) {
      rfo = data.barServicePosts.userthreadinfo;
    }
    if (data.systemPosts) {
      rfo=data.systemPosts.userthreadinfo;
    }
    if (data.landlordPosts) {
      rfo=data.landlordPosts.userthreadinfo;
    }
    if (data.selfPosts) {
      rfo = data.selfPosts.userthreadinfo;
    }
    var totalSize = rfo.totalnum;
    var currPage = rfo.curpage;
    var who = rfo.bywho;
    var rfd = rfo.data;
    var page = false;
    var rhtml = '';
    rhtml += '<div class="span box_recycle">';
    rhtml += '<div class="recycle_title">';
    rhtml += '<div class="loop-3">吧名</div>';
    rhtml += '<div class="loop-3">帖子主题</div>';
    rhtml += '<div class="loop-3">贴子内容</div>';
    rhtml += '<div class="loop-3">删贴时间</div>';
    rhtml += '</div>';
    for(var i=0; i<rfd.length; i++) {
      rhtml += '<div class="recyle_items">';
      rhtml += '<div class="loop-3 hidefont del_forum_name">' + rfd[i].forum_name + '</div>';
      rhtml += '<div class="loop-3 hidefont del_post_title">' + rfd[i].title + '</div>';
      rhtml += '<div class="loop-3 hidefont del_post_content">' + rfd[i].content + '</div>';
      rhtml += '<div class="loop-3 hidefont del_time">' + rfd[i].delete_time + '</div>';
      rhtml += '</div>';
    }
    //rhtml ='';
    if (totalSize>config.message.recycle.pageSize) {
      var totalPage = window.Math.ceil(totalSize/config.message.recycle.pageSize);
      rhtml += '<div class="recycle_page">';
      if (config.message.recycle.currentPage>1) {
        rhtml += '<a data-page="' + (config.message.recycle.currentPage-1) + '" data-who="' + who + '">上一页</a>';
      }
      if (config.message.recycle.currentPage<totalPage) {
        rhtml += '<a data-page="' + (config.message.recycle.currentPage+1) +  '" data-who="' + who + '">下一页</a>';
      }
      rhtml += '<span>' + config.message.recycle.currentPage + '</span>';
      rhtml += '</div>';
      page = true;
    }
    rhtml += '</div>';
    return {page: page, result: rhtml};
  };


  function mointorRecycleResult(page){
    if (page) {
      $('.recycle_page a').bind('click', function(){
        config.message.recycle.currentPage = $(this).data('page');
        handleGetRecycle($(this).data('who'));
      });
    }
    $('.recyle_items').bind('click', function(){
      var dhtml = '';
      dhtml += '<div class="span">';
      dhtml += '<div class="loop-12 detail-recycle-forum"><label>吧名:</label>' + $(this).find('.del_forum_name').html() + '</div>';
      dhtml += '<div class="loop-12 detail-recycle-title"><label>帖子主题:</label>' + $(this).find('.del_post_title').html() + '</div>';
      dhtml += '<div class="loop-12 detail-recycle-time"><label>删贴时间:</label>' + $(this).find('.del_time').html() + '</div>';
      dhtml += '<div class="loop-12 detail-recycle-content"><label>贴子内容:</label>' + $(this).find('.del_post_content').text() + '</div>';
      dhtml += '</div>';
      $('.detail-recycle').html(dhtml);
    });
  };



  tborer.parseTiebaMessage = function(msg) {
    this.config.message.number.fans = msg[0]||0;
    this.config.message.number.replay = msg[3]||0;
    this.config.message.number.feature = msg[4]||0;
    this.config.message.number.atme = msg[8]||0;
    this.config.message.number.recycle = msg[9]||0;
    this.config.message.number.total = 
    this.config.message.number.fans+
    this.config.message.number.replay+
    this.config.message.number.feature+
    this.config.message.number.atme+
    this.config.message.number.recycle;
    $('.btn_tb_msg span.tb-msg-num').text(this.config.message.number.total||'');
  };
  
  tborer.handleGetTiebaMessage = function(){
    loadFile('http://message.tieba.baidu.com/i/msg/get_data', 'js');
  };

  /*
  tborer.handleHistory = function(state){
    config.history.data = state;
    console.log(state);
    if (state.data.mark == 'post') {
      $.ajax({
        // url: config.history.url,
        url: state.url,
        dataType: 'html'
      }).done(function(data){
        initPost(parsePost($(data)));
        setPostConfig($(data).text());
      });
    };
    if (state.data.mark == 'posts') {
      $.ajax({
        url: state.url,
        dataType: 'html'
      }).done(function(data){
        setPostsConfig($(data).text());
        initPosts(parsePosts($(data)));
      });
    };
  };
  */

  function openPosts() {
    $('#box_posts').addClass('show');
  };
  function closePosts() {
    $('#box_posts').removeClass('show');
  };

  function loadFile(filename,filetype){
    if ('js' == filetype) {
      var fileref = document.createElement('script');
      fileref.setAttribute("type","text/javascript");
      fileref.setAttribute("src",filename);
    }
    if ('css' == filetype) {
      var fileref = document.createElement('link');
      fileref.setAttribute("rel","stylesheet");
      fileref.setAttribute("type","text/css");
      fileref.setAttribute("href",filename);
    }
    if(typeof fileref != "undefined"){
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
  };

  function encodeUnicode(str){
    return escape(str).toLocaleLowerCase().replace(/%u/gi,'\\u');
  };

  function decodeUnicode(str){
    return unescape(str.replace(/\\u/gi,'%u'));
  };

  function formatEditor(content) {
    return content.replace(/<p>|<br\/>/gi, '').replace(/<\/p>/gi, '[br]').replace(/_src=".*?"/gi, 'class="BDE_Smiley"');
  };

  initBorer();
})(window, jQuery);
