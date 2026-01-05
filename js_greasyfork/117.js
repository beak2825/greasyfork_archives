// ==UserScript==
// @name  Tieba Advanced
// @namespace http://gera2ld.blog.163.com/
// @author  Gerald <gera2ld@163.com>
// @icon  http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version 2.7.8
// @description 贴吧增强 - Gerald倾情打造
// @homepageURL http://gerald.top/code/TiebaAdvanced
// @include http://tieba.baidu.com/*
// @exclude http://tieba.baidu.com/tb/*
// @require https://greasyfork.org/scripts/144/code.user.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/117/Tieba%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/117/Tieba%20Advanced.meta.js
// ==/UserScript==

// Mask layer
var mask=$('<div class=ge_mask style="padding:100px 100px 20px;">').appendTo('body');
DELAY=2000;

// 初始化贴子管理面板
function initPostManager() {
  if(utils.postManager) return;
  utils.addStyle('\
#ge_tm{display:none;border-collapse:separate;width:100%;height:100%;background:white;color:#333;padding:20px;border-radius:20px;shadow:0 1px 5px #333;border-spacing:5px;table-layout:fixed;}\
#ge_tm tr{height:1px;}\
#ge_tm tr.ge_td{height:auto;}\
.ge_td>td{width:50%;height:100%;vertical-align:top;position:relative;}\
.ge_td>td>*{width:100%;height:100%;border:1px solid;overflow:auto;background:transparent;'+(window.opera?'position:absolute;':'')+'}\
');
  var tm=$('<table id=ge_tm>').appendTo(mask);
  tm.listItems=function(t,e,x,s){
    var d=[];
    if(x) d.push('<option>'+x+'</option>');
    t.list.forEach(function(i){d.push('<option>'+i.name+'</option>');});
    e.html(d.join(''));
    if(s) {x=x?1:0;t.load(s-x);e.prop('selectedIndex',t.last+x);}
  };
  tm.newItem=function(e,d) {
    tm.list.load(tm.list.length-1);
    if(!tm.list.cur||tm.list.cur.data) {
      tm.list.load(tm.list.push(d));
      $('<option>').appendTo(ti).text(tm.list.cur.name);
    } else {
      tm.list.cur.type=d.type;
      tm.list.cur.data=d.data;
    }
    $(ti).prop('selectedIndex',tm.list.last);
    editItem();
  };
  var th=document.createElement('p'),tk='innerText' in th?'innerText':'textContent';
  function h2t(h){  // html to text
    th.innerHTML=h.replace(/<br>/g,'\n');
    return th[tk];
  }
  function t2h(t){  // text to html
    th[tk]=t;
    return th.innerHTML.replace(/  /g,'&nbsp; ').replace(/(^| ) /g,'&nbsp;$1').replace(/\r?\n/g,'<br>');
  }
  function editItem(e) {
    if(e) tm.list.load(ti.prop('selectedIndex'),1);
    var t=tm.list.cur;
    tc.prop('disabled',!t);
    if(!t) t={type:'s',data:''};
    tt.val(t.type);
    if(['j','h','H'].indexOf(t.type)>=0) tc.val(t.data);
    else tc.val(h2t(t.data));
    liveShow();
  }
  function saveItem(e) {
    var t=tm.list.cur;if(!t) return;
    switch(t.type=tt.val()) {
      case 'j':try{eval(t.data=tc.val());}catch(e){}break;
      case 's':t.data=t2h(tc.val());break;
      case 'H':t.data=tc.val();break;
      default:tv.find('img').each(function(i,e){
                e.setAttribute('pic_type',1);
                unsafeWindow.EditorUI.resizeImage(e,560);
              });
              tc.val(t.data=tv.html());
    }
  }
  function liveShow(e) {
    function show() {
      if(--count) return;
      var t=tt.val(),s;
      if(t=='j') try{s=eval(tc.val());}catch(e){s='<font color=red>JS代码有误！</font>';}
      else s=tc.val();
      if(t=='s') s=t2h(s);
      else if(t=='H') s=s.split('\n').shift();
      tv.html(s);
    }
    count++;
    setTimeout(show,500);
  }
  var count=0;
  tm.loadPanel=function(t,n,c) {
    tm.list=t;tn.text(n);tm.callback=c;
    tm.listItems(t,ti);editItem(1);
    mask.fadeIn('fast',function() {
      tm.css({display:'table'}).animate({top:'0px',left:'0px'},300);
    });
  };
  var c=$('<td colspan=2>').appendTo($('<tr>').appendTo(tm)),
      tn=$('<strong class=ge_rsep>').appendTo(c),
      ti=$('<select>').appendTo(c).change(editItem);
  $('<span class="ge_sbtn ge_rsep">改名</span>').appendTo(c).click(function(e) {
    if(!tm.list.cur) return;
    var t=prompt('修改名称：',tm.list.cur.name);
    if(t) {tm.list.cur.name=t;ti.children('option:eq('+tm.list.last+')').text(t);}
  });
  var tt=$('<select>').appendTo($('<label class=ge_rsep>类型：'+utils.getLink('advanced',{title:'帮助',html:'(?)'})+'</label>').appendTo(c)).html('<option value="s" checked>普通字串</option><option value="h">HTML代码</option><option value="H">HTML随机</option><option value="j">JS代码</option>').change(liveShow).blur(saveItem);
  $('<span class=ge_sbtn>添加</span>').appendTo(c).click(tm.newItem);
  $('<span class=ge_sbtn>删除</span>').appendTo(c).click(function() {
    var l=tm.list.last;tm.list.pop(l);ti.children().eq(l).remove();editItem(1);
  });
  c=$('<div style="float:right;"></div>').appendTo(c);
  $('<span class=ge_sbtn>关闭</span>').appendTo(c).click(function() {
    tm.list.save();if(tm.callback) tm.callback();
    tm.animate({top:innerHeight+'px'},300,function() {$(this).hide();mask.fadeOut('fast');});
  });
  $('<tr><td>编辑框</td><td align=right>预览框</td></tr>').appendTo(tm);
  c=$('<tr class=ge_td>').appendTo(tm);
  var tc=$('<textarea>').appendTo($('<td>').appendTo(c)).blur(saveItem).keyup(liveShow).mouseup(liveShow);
  var tv=$('<div>').appendTo($('<td>').appendTo(c));
  utils.postManager=tm;
}
// 灌水
function initAddWater(editor) {
  initPostManager();
  var tails=utils.list('tails',null,function(){return {type:'s',data:'',name:'新尾巴'};},[
    {type:'j',name:'UA',data:'"——我喂自己袋盐<br>&gt;&gt;"+navigator.userAgent'},
    {type:'h',name:'求妹纸',data:'<img pic_type="1" class="BDE_Image" src="http://imgsrc.baidu.com/forum/w%3D580/sign=6ca77dcee5dde711e7d243fe97edcef4/b03533fa828ba61e111605e44134970a314e5905.jpg" width="560" height="11"><br><img pic_type="1" src="http://static.tieba.baidu.com/tb/editor/images/tsj/t_0010.gif" class="BDE_Smiley" height="40" width="40">少壮不追妹，老大去相亲'},
  ]).load(),water=utils.list('water',null,function(){return {type:'s',data:'',name:'新水贴'};},[
    {type:'s',name:'打酱油',data:'我是打酱油的~'},
  ]).load();
  function initTails(){utils.postManager.listItems(tails,ti,'随机',utils.getObj('tailindex',1));}
  function initWater(){utils.postManager.listItems(water,wi,'随机',utils.getObj('waterindex',0));}
  function getItem(t,s){
    var l=s.prop('selectedIndex'),L=t.length;if(!L) return;
    if(!l) l=Math.floor(Math.random()*L); else l--;
    t=t.list[l];var d=t.data;
    if(t.type=='j') d=eval(d);
    else if(t.type=='H') {d=d.split('\n');d=d[Math.floor(Math.random()*d.length)];}
    return d;
  }
  var op=utils.addRPopup(utils.addSButton('灌 水')).panel;
  $('<div class=ge_sbtn style="cursor:default">智能灌水</div>').appendTo(op);
  var ti=$('<select class=ge_rsep>').appendTo($('<label>尾巴：</label>').appendTo(op)).change(function(e){utils.setObj('tailindex',this.selectedIndex);});
  $('<br>').appendTo(op);
  var tail=utils.bindProp($('<input type=checkbox>').prependTo($('<label class=ge_rsep>自动附加尾巴</label>').appendTo(op)),'checked','usetail',true);
  $('<br>').appendTo(op);
  $('<span class=ge_sbtn>存为新尾巴</span>').appendTo(op).click(function(e){
    utils.postManager.loadPanel(tails,'尾巴管理',initTails);
    utils.postManager.newItem(e,{type:'h',name:'新尾巴',data:editor.$body.html()});
  });
  $('<span class=ge_sbtn>管理</span>').appendTo(op).click(function(e){utils.postManager.loadPanel(tails,'尾巴管理',initTails);});
  $('<hr>').appendTo(op);
  var wi=$('<select class=ge_rsep>').appendTo($('<label>水贴：</label>').appendTo(op)).change(function(e){utils.setObj('waterindex',this.selectedIndex);});
  $('<br>').appendTo(op);
  $('<span class=ge_sbtn>存为新水贴</span>').appendTo(op).click(function(e){
    utils.postManager.loadPanel(water,'水贴管理',initWater);
    utils.postManager.newItem(e,{type:'h',name:'新水贴',data:editor.$body.html()});
  });
  $('<span class=ge_sbtn>管理</span>').appendTo(op).click(function(e){utils.postManager.loadPanel(water,'水贴管理',initWater);});
  $('<br>').appendTo(op);
  $('<span class=ge_sbtn>载入</span>').appendTo(op).click(function(e){
    editor.execCommand('inserthtml',getItem(water,wi));
  });
  $('<span class=ge_sbtn>发表</span>').appendTo(op).click(function(e){
    editor.$body.html(getItem(water,wi));
    unsafeWindow.test_poster.post();
  });
  /*$('<span class=ge_sbtn>人工置顶</span>').appendTo(op).click(function(e){
    function post(){PostHandler.post(rich_postor._option.url,b,delay,function(){});}
    function delay(m){
      if(m) {
        if(m.no) d+=1000; else {d=DELAY;e.text('停止('+(++c)+')');}
      }
      if(!m||!m.no) b.content=getItem(water,wi);
      setTimeout(post,d);
    }
    (e=$(this)).unbind('click').text('停止').click(function(){location.reload();});
    var c=0,d=0;b=rich_postor._getData();delay();
  });*/
  var tailed=false;
  initTails();initWater();
  utils.wait(unsafeWindow,'test_poster',function(){
    utils.hook(unsafeWindow.test_poster,'post',{before:function(){
      var t=getItem(tails,ti);
      if(!tail.prop('checked')||!t||tailed) return;
      editor.$body.append('&nbsp;<br><br>'+t);tailed=true;    // 加个空格以免破坏@
    }});
    utils.hook(unsafeWindow.test_poster,'showPostSuccess',{after:function(){
      tailed=false;
    }});
  });
}

// 尾页直达功能
function initLastPage() {
  utils.addStyle('.threadlist_rep_num{cursor:pointer;}');
  $('.threadlist_rep_num').prop('title','直达尾页').click(function(e){
    e=$(e.target);e.unbind('click');
    var s='',d=JSON.parse(e.parents('.j_thread_list').attr('data-field'));
    setInterval(function(){
      if(s.length>2) s=''; else s+='.';
      e.html(s);
    },300);
    d='/p/'+d.id;
    $.get(d,function(data){
      var m=data.match(/共<span class="red">(\d+)/)[1];
      if(m=='1') m=''; else m='?pn='+m;
      location.href=d+m;
    });
  });
}

// 召唤术增强
var calllist=utils.list('calllist','calllast',function(){return {name:'新列表',data:[]};},true).load();
function initCard() {
  function fix(){
    var t=this._j_card,c=calllist.cur.data;
    setTimeout(function(){
      function update(a) {a.html((j<0?'加入':'移出')+'@列表');}
      var u=t.getData().un,j=c.indexOf(u),w=t.find('.interaction_wrap'),a;
      if(w.length) update(a=$('<a href=# class="btn-small btn-encourage">').appendTo(w).click(function(e){
        e.preventDefault();
        if(j<0) {j=c.length;c.push(u);}
        else {for(;j<c.length-1;j++) c[j]=c[j+1];c.pop();j=-1;}
        calllist.save();
        update(a);
      }));
    },0);
  }
  function hook(b){
    utils.hook(b.__proto__,'buildVisitCard',{before:function(){
      utils.hook(this._visit_card,'setContent',{after:fix});
    }});
  }
  unsafeWindow._.Module.use("ihome/widget/UserVisitCard",{},hook);
  unsafeWindow._.Module.use("puser/widget/UserVisitCard",{},hook);
}
function initCall(editor) {
  var pl,sl,be,bs,c=calllist;
  utils.addStyle('\
#callList{border:1px solid;height:125px;overflow:auto;background:white;margin:0 auto;width:380px;}\
#callList a{padding:2px;border-radius:2px;margin:2px;display:inline-block;}\
#callList a.selected{background:limegreen;color:white}\
.edui-btn-toolbar .edui-btn .edui-button{width:21px;height:20px;line-height:20px;text-align:center;font-size:16px;font-weight:bold;cursor:pointer;}\
');
  function newList(e) {
    c.load(c.push());$('<option>').appendTo(sl).text(c.cur.name);
    sl.prop('selectedIndex',c.last);
    editList(e);
  }
  function editList(e) {
    if(e) c.load(sl.prop('selectedIndex')); else sl.prop('selectedIndex',c.last);
    pl.empty();
    c.cur.data.forEach(function(i){$('<a href=#>').html(i).appendTo(pl);});
    pl.prop('contenteditable',false);
  }
  function loadLists(p) {
    var op=p.panel;
    c.load();op.empty();
    $('<div class=ge_sbtn style="cursor:default">超级召唤</div>').appendTo(op);
    sl=$('<select>').appendTo($('<label>选择名单：</label>').appendTo(op)).change(editList);
    $('<span class="ge_sbtn ge_rsep">改名</span>').appendTo(op).click(function(e) {
      e.preventDefault();
      var t=prompt('列表名称：',c.cur.name);
      if(t) {sl.children(':eq('+c.last+')').text(t);c.cur.name=t;c.save();}
    });
    $('<span class=ge_sbtn>新建列表</span>').appendTo(op).click(newList);
    $('<span class="ge_sbtn ge_rsep">删除列表</span>').appendTo(op).click(function(e){
      e.preventDefault();
      var l=c.last;c.pop(l);editList();sl.children().eq(l).remove();
    });
    pl=$('<div id=callList>').appendTo(op).click(function(e){
      e.preventDefault();
      e=e.target;if(e.tagName=='A') $(e).toggleClass('selected');
    }).dblclick(function(e){
      e.stopPropagation();
      var s=window.getSelection();
      if(!s.rangeCount) return;
      var r=s.getRangeAt(0),c=r.startContainer,k=r.startOffset;
      var i=c.data.substr(0,k).search(/\s\S*$/),j=c.data.substr(k).search(/\s/);
      r.setStart(c,i+1);r.setEnd(c,j<0?c.data.length:k+j);
      s.removeAllRanges();s.addRange(r);  // Compatible with Chrome
    });
    $('<label>名单管理：</label>').appendTo(op);
    be=$('<span>').appendTo(op);
    $('<span class=ge_sbtn>编辑</span>').appendTo(be).click(function(e){
      bs.show();be.hide();
      pl.prop('contenteditable',true);
      pl.text(c.cur.data.join(' '));
    });
    $('<span class=ge_sbtn>全选/不选</span>').appendTo(be).click(function(e){
      e.preventDefault();
      var a=pl.children('a:not(.selected)');
      if(a.length) a.addClass('selected'); else pl.children('a').removeClass('selected');
    });
    bs=$('<span>').appendTo(op).hide();
    $('<span class=ge_sbtn>去重</span>').appendTo(bs).click(function(e){
      var d=pl.text().replace(/^\s+|\s+$/,'').split(/\s+/),h={};
      d.forEach(function(i){h[i]=0;});
      pl.text(Object.getOwnPropertyNames(h).join(' '));
    });
    $('<span class="ge_sbtn ge_rsep">完成</span>').appendTo(bs).click(function(e){
      c.cur.data=pl.text().replace(/^\s+|\s+$/,'').split(/\s+/);
      c.save();editList(e);be.show();bs.hide();
    });
    $('<span>空格隔开，双击选中一个名字</span>').appendTo(bs);
    var b=$('<div style="float:right">').appendTo(op);be=be.add(b);
    $('<span class=ge_sbtn title="普通召唤，超过十个ID将会失败">召唤</span>').appendTo(b).click(function(e){
      var se=p==pM?editor:unsafeWindow.LzlEditor._s_p._se;
      pl.children('a.selected').each(function(i,e){se.execCommand('inserthtml','@'+e.innerHTML+'&nbsp;');});
      p.onclose();
    });
    /*$('<span class=ge_sbtn title="插入一个占位符，将自动替换成召唤名单">自动召唤</span>').appendTo(b).click(function(e){
      e=[];pl.children('a.selected').each(function(){e.push(this.innerHTML);});
      p.onclose();
      if(e.length) {
        p.holder.names=e;
        e=p.holder==E?editor:unsafeWindow.LzlEditor._s_p._se;
        e.execCommand('inserthtml','<img class=BDE_Smiley title="将在此自动插入召唤名单" alt="召唤列表" height=18>');
      }
    });*/
    c.list.forEach(function(i){$('<option>').text(i.name).appendTo(sl);});
    editList();
  }
  var l=/<img [^>]*?alt="召唤列表"[^>]*>/;
  function addNames(e,n){
    if(n.splice) n='@'+n.splice(0,10).join(' @')+' ';
    return e.replace(l,n);
  }
  // 主编辑框
  var o=utils.addTButton($('<div unselectable="on" class="edui-button" style="color:red" title="召唤">@</div>')),
      pM=utils.addTPopup(o,loadLists);
  /*utils.hook(unsafeWindow.PostHandler,'post',{before:function(f,a){
    function post(){f.hook_func(a[0],a[1],E.names?delay:a[2],a[3]);}
    function delay(m){
      if(m){if(m.no) d+=1000; else d=DELAY;}
      if((!m||!m.no)&&E.names) {
        a[1].content=addNames(e,E.names);
        if(!E.names.length) delete E.names;
      }
      setTimeout(post,d);
    }
    var e=a[1].content,d=0;f.hookStop();
    if(E.names&&e.search(l)<0) delete E.names;
    delay();
  }});*/
  // 楼中楼
  /*lzl_init.push(function(){
    utils.hook(unsafeWindow.SimplePostor.prototype,'_submitData',{before:function(f){
      function post(){
        $.tb.post(FORUM_POST_URL.postAdd,b,delay);
      }
      function delay(m){
        if(o.names) {
          if(m){if(m.no) d+=1000; else d=DELAY;}
          if(!m||!m.no) {
            b.content=addNames(a,o.names);
            if(!o.names.length) delete o.names;
          }
          setTimeout(post,d);
        } else location.reload();
      }
      if(o.names&&this._se.editArea.innerHTML.search(l)>=0) {
        f.hookStop();var d=0,b=this._getData(),a=b.content;delay();
      }
    }});
  });*/
  var o=$('<span title="召唤" style="color:red">@</span>'),p=utils.addLPopup(o,loadLists);
  lzl_init.push(p.getfunc('reinit'));
  addPButton(o.click(p.ontoggle));
}

// 楼中楼初始化
var lzl_init=[],lzl_buttons=[];
function addPButton(o) { // 新增楼中楼按钮
  lzl_buttons.push(o.addClass('lzl-button'));
}
function initLzL(editor) {
  // 楼中楼初始化
  function fixLzl() {
    var p=editor.cur_sec.find('.lzl_panel_btn');
    p.parent().css('width','50%').prev().css('width','auto');
    p.next().css({left:'auto',right:24});
    lzl_buttons.forEach(function(i){utils.insertButton(p,i);});
    lzl_init.forEach(function(i){i();});
  }
  if(lzl_buttons.length)
    utils.addStyle('.lzl-button{width:22px;height:20px;margin:2px 6px 0;float:right;cursor:pointer;line-height:20px;font-size:16px;font-weight:bold;text-align:center;}');
  if(editor.cur_sec) fixLzl();
  utils.hook(editor,'_buildEditor',{after:fixLzl});
}

function initEditor(editor){
  initAddWater(editor);     // 灌水+尾巴
  initCall(editor);     // 召唤增强，召唤列表
}

// 以下为模块调用，可将不需要的模块注释，不要改变顺序
if($&&PageData&&PageData.user) {
  initCard();   // 用户卡片上添加召唤按钮
  // 以下模块无需登录
  if(PageData.thread) { // 以下模块仅在帖子浏览页面加载
  } else {
    initLastPage();   // 尾页直达功能
  }
  //以下模块仅在登录时加载
  if(PageData.user.is_login&&unsafeWindow.PosterContext&&unsafeWindow.PosterContext.isPostAllowed()) {
    utils.wait(unsafeWindow,'test_editor',initEditor);
    utils.wait(unsafeWindow,'LzlEditor',initLzL);
  }
}
