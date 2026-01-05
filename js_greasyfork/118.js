// ==UserScript==
// @name  Tieba Utilities
// @namespace http://gera2ld.blog.163.com/
// @author  Gerald <gera2ld@163.com>
// @icon  http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version 0.9.1
// @description 百度贴吧依赖脚本（寂寞的原子的公共库）
// @homepageURL http://geraldl.net/userjs/TiebaUtils
// @match *://*.baidu.com/*
// @include *.baidu.com/*
// @run-at  document-start
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/118/Tieba%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/118/Tieba%20Utilities.meta.js
// ==/UserScript==

function initUtils(event_id){
  // communicate with content page
  var post=function(data){
    var e=document.createEvent("MutationEvent");
    e.initMutationEvent(event_id,false,false,null,null,null,JSON.stringify(data),e.ADDITION);
    document.dispatchEvent(e);
  };
  var addSButton=function(){
    function oldTheme(v){
      var b=$('<span class=poster_submit>').insertBefore('.poster_draft_status');
      b.label=$('<em>').html(v).appendTo(b).wrap('<a href="#" class="ui_btn ui_btn_m"><span>');
      return b;
    }
    function newTheme(v){
      var b=$('<span class=poster_submit>').insertBefore('.poster_draft_status');
      b.label=$('<a href="#" class="btn_default btn_middle">').html(v).appendTo(b);
      return b;
    }
    addSButton=$('.j_submit').hasClass('btn_default')?newTheme:oldTheme;
    return addSButton.apply(this, arguments);
  };

  // popup menu for editor
  function Popup(b,funcs){
    this.funcs=funcs;
    this.container=null;
    this.onopen=this._onopen.bind(this);
    this.onclose=this._onclose.bind(this);
    this.ontoggle=this._ontoggle.bind(this);
    this.button=$(b).click(this.ontoggle);
    this.call('init').stopPropagation();
  }
  Popup.prototype={
    stopPropagation:function(){
      this.container.click(function(e){
        e.stopPropagation();
      });
      return this;
    },
    call:function(func){
      var f=this.funcs[func];
      if(f) f(this);
      return this;
    },
    getfunc:function(func){
      var t=this,f=t.funcs[func];
      if(f) return function(){f(t);};
    },
    _onopen:function(){
      this.container.show();
      $(document).click(this.onclose);
      this.call('open');
      this.call('locate');
    },
    _onclose:function(){
      this.container.hide();
      $(document).unbind('click',this.onclose);
      this.call('close');
    },
    _ontoggle:function(e){
      e.preventDefault();
      if(this.container.is(':visible')) this.onclose();
      else setTimeout(this.onopen,0);
    },
  };

  var shortcuts={},links={
    hotkey:'http://gerald.top/code/TiebaUtils#hotkey',
    advanced:'http://gerald.top/code/TiebaAdvanced#advanced',
  },utils={
    index:function(objs,obj,key){
      for(var i=0;i<objs.length;i++)
        if(objs[i][key]===obj) return i;
      return -1;
    },
    wait: (function(){
      var objs=[];
      function init(obj,name,callbacks){
        var value=undefined;
        Object.defineProperty(obj,name,{
          get:function(){return value;},
          set:function(val){
            value=val;
            if(callbacks) {
              callbacks.forEach(function(f){f(val);});
              callbacks=null;
            }
          },
          configurable:true,
        });
      }
      return function(obj,name,callback) {
        if(obj[name]!==undefined) callback(obj[name]);
        else {
          var i=utils.index(objs,obj,'obj'),o=objs[i],c;
          if(!o) objs.push(o={obj:obj,callbacks:{}});
          c=o.callbacks[name];
          if(!c) c=o.callbacks[name]=[];
          c.push(callback);
          init(obj,name,c);
        }
      };
    })(),
    /* window cannot be observed, use utils.wait instead
    observe: (function(){
      var objs=[];
      function init(obj,o){
        // Opera Presto is not supported any more
        function observer(changes){
          changes.forEach(function(c){
            var d=o.data[c.name];
            if(d) {
              console.log('Observed: ',obj,c.name);
              d.forEach(function(f){f(obj[c.name]);});
              delete o.data[c.name];
              if(!--o.length) {
                o=objs.indexOf(o);
                if(o>=0) objs.splice(o,1);
                Object.unobserve(obj,observer,['add']);
              }
            }
          });
        }
        Object.observe(obj,observer,['add']);
      }
      return function(obj,name,callback) {
        if(name in obj) callback(obj[name]);
        else {
          var i=utils.index(objs,obj,'obj'),o=objs[i],d;
          if(!o) {
            objs.push(o={obj:obj,data:{},length:0});
            init(obj,o);
          }
          d=o.data[name];
          if(!d) {
            d=o.data[name]=[];
            o.length++;
          }
          d.push(callback);
        }
      };
    })(),*/
    find: function(selector,ancestor,callback){
      var o=$(selector,ancestor),mo;
      if(o.length) callback(o);
      else if(window.MutationObserver) {
        mo=new MutationObserver(function(changes){
          $.each(changes,function(i,e){
            $.each(e.addedNodes,function(i,o){
              o=$(o).find(selector);
              if(o.length) {
                mo.disconnect();
                callback(o);
              }
            });
          });
        });
        mo.observe(ancestor,{
          childList:true,
          subtree:true,
        });
      } else $(window).load(function(){
        callback($(selector,ancestor));
      });
    },
    hook: function(o,n,a) {
      var f;
      if(o&&(f=o[n])) {
        if(!f.hooked) {
          o[n]=function() {
            var t=this,a=arguments,f=a.callee,r=undefined,_r,i,stop=false;
            f.hookStop=function(){stop=true;};
            for(i=0;i<f.hook_before.length;i++){
              r=f.hook_before[i].apply(t,[f,a]);
              if(stop) return r;
            }
            r=f.hook_func.apply(t,a);
            for(i=0;i<f.hook_after.length;i++){
              _r=f.hook_after[i].apply(t,[f,r,a]);
              if(_r!==undefined) r=_r;
              if(stop) return r;
            }
            return r;
          };
          o[n].hook_func=f;
          f=o[n];
          f.hooked=true;
          f.hook_after=[];
          f.hook_before=[];
        }
        o=f.hook_after;
        if(n=a.after) {
          if(n.concat) f.hook_after=o.concat(n);
          else o.push(n);
        }
        o=f.hook_before;
        if(n=a.before) {
          if(n.concat) f.hook_before=o.concat(n);
          else o.push(n);
        }
      }
    },
    addStyle: function(css,id) {
      var s=document.getElementById(id)||document.createElement('style');
      if(id) s.id=id;if(css) s.innerHTML=css;
      document.head.appendChild(s);
      return $?$(s):s;
    },
    getObj: function(k,d) {
      var r=localStorage.getItem('ge_'+k),u=undefined,v=u;
      if(r) try{v=JSON.parse(r);}catch(e){}
      if(v==u&&d!=u) v=utils.setObj(k,d);
      return v;
    },
    setObj: function(k,v) {
      var j=JSON.stringify(v);
      localStorage.setItem('ge_'+k,j);
      post({cmd:'setvalue',data:{key:k,val:j}});
      return v;
    },
    // Base function
    insertButton: function (parent, $button, additional) {
      additional = additional || {};
      parent = $(parent);
      if (additional.after)
        $button.insertAfter(parent.children(additional.after));
      else if (additional.before)
        $button.insertBefore(parent.children(additional.before));
      else
        $button.appendTo(parent);
      return $button;
    },
    // Deprecated base function
    addButton: function(t,o,m,a) {
      if(m) {
        var i,k=a.keys;
        if(!k||!k.length) k=['mousedown','mouseup'];
        for(i=0;i<k.length;i++) if(o[k[i]]) {o[k[i]].call(o,m);break;}
      }
      return this.insertButton(t,o,a);
    },
    addTButton: function(o,m) { // Add Toolbar Button
      var tb=$('div.edui-btn-toolbar').first();
      if(m) o.click(m);
      return o.appendTo($('<div class="edui-btn edui-btn-bold" unselectable="on" onmousedown="return false">').prependTo(tb));
    },
    addSButton: addSButton, // Add Big Button
    addRPopup: function(b,o,c) { // Add popup for submit-like buttons
      return new Popup(b,{
        init:function(p){
          p.container=$('<div class=ge_panel_p title="">').prependTo(p.button).hide();
          p.caret=$('<i class=ge_caret>').appendTo(p.container).html('<i>');
          p.panel=$('<div class=ge_panel>').appendTo(p.container);
        },
        open:function(p){
          if(o) o(p);
          var l=Math.min(-50,$(document.body).innerWidth()-p.button.offset().left-p.panel.outerWidth());
          p.container.css({marginLeft:l});
          p.caret.css({left:p.button.width()/2-l-10});
        },
        close:c,
      });
    },
    addTPopup: function(b,o,c) { // Add popup for toolbar buttons
      return new Popup(b,{
        init:function(p){
          p.container=$('<div class="edui-dropdown-menu edui-popup" title="" style="display:block;top:44px;position:absolute;">').appendTo('.edui-dialog-container').hide();
          p.caret=$('<div class="edui-popup-caret up" style="top:-8px;position:absolute;">').appendTo(p.container);
          p.panel=$('<div class="edui-popup-body">').appendTo(p.container);
        },
        open:function(p){
          if(o) o(p);
          p.container.css({right:Math.max(-50,p.button.offset().left+p.button.width()-$(document.body).innerWidth())});
          p.caret.css({right:p.panel.outerWidth()+p.panel.offset().left-p.button.parent().offset().left-p.button.width()});
        },
        close:c,
      });
    },
    addLPopup: function(b,o,c) { // Add popup for Lzl buttons
      return new Popup(b,{
        init:function(p){
          p.container=$('<div class="lzl_edui_dialog_container">').hide();
          p.caret=$('<div class="inde_edui_popup_caret">').appendTo(p.container);
          p.panel=$('<div class="inde_edui_dropdown_menu">').appendTo(p.container);
        },
        reinit:function(p){
          p.stopPropagation().container.insertAfter(p.button);
        },
        open:function(p){
          if(o) o(p);
          p.container.css({left:'auto',right:0});
          p.caret.css({right:p.panel.outerWidth()+p.panel.offset().left-p.button.offset().left-p.button.width()});
        },
        close:c,
      });
    },
    bindProp: function(obj,prop,key,def,func,evt) {
      obj.prop(prop,utils.getObj(key,def));
      if(!evt) evt=['change'];
      evt.forEach(function(i){obj.bind(i,function(e){utils.setObj(key,this[prop]);if(func) obj.each(function(i,o){func.call(o,e);});});});
      return obj;
    },
    shortcut:function(key,func){
      key=key.toLowerCase();
      var d=[];
      if(key.slice(-2)=='--') {d.push('-');key=key.slice(0,-2).split('-');}
      else key=key.split('-');
      if(key.indexOf('m')>=0||key.indexOf('meta')>=0) d.unshift('m');
      if(key.indexOf('s')>=0||key.indexOf('shift')>=0) d.unshift('s');
      if(key.indexOf('a')>=0||key.indexOf('alt')>=0) d.unshift('a');
      if(key.indexOf('c')>=0||key.indexOf('ctrl')>=0) d.unshift('c');
      key=key.join('-');
      if(func) shortcuts[key]=func; else delete shortcuts[key];
    },
    list: function(lkey,ikey,dnew,def) {  // def===true: not null
      var t={};t.last=0;
      t.load=function(i,nosave){
        if(i==undefined) i=ikey?utils.getObj(ikey,0):0;
        if(i<0||!t.length) i=0; else if(i>=t.length) i=t.length-1;
        if(ikey&&!nosave) utils.setObj(ikey,i);
        t.cur=t.list[t.last=i];
        return t;
      };
      t.push=function(d){if(!d) d=dnew();t.list.push(d);t.save();return t.length-1;};
      t.pop=function(i){var o=t.list.splice(i,1)[0];t.save();t.load(i);return o;}
      t.save=function(){if(lkey) utils.setObj(lkey,t.list);if(ikey) utils.setObj(ikey,t.last);};
      t.list=lkey?utils.getObj(lkey,[]):[];
      Object.defineProperty(t,'length',{get:function(){return t.list.length;}});
      if(!t.length&&def) {if(def.concat) {t.list=def.concat();t.save();} else t.push();}
      return t;
    },
    getLink:function(t,o){
      o=o||{};
      var l=links[t];
      if(l) o.href=l;
      if(!o['target']) o.target='_blank';
      t=o.html||'';delete t.html;l=['<a'];
      for(i in o) l.push(i+'="'+o[i]+'"');
      return l.join(' ')+'>'+t+'</a>';
    },
    dialog:{  // Popup Window
      dialog:null,
      className:'ge_popup',
      show:function(o){
        var t=this,d=t.dialog;
        t.hide();t.obj=o;
        d.className=o.className||'';
        d.classList.add(t.className);
        d.innerHTML=o.html;
        if(o.init) o.init(d);
        d.style.display='block';
        d.style.top=(innerHeight-d.offsetHeight)/2+'px';
        d.style.left=(innerWidth-d.offsetWidth)/2+'px';
        document.addEventListener('click',t._hide=t.hide.bind(this),false);
      },
      hide:function(){
        var t=this,o=t.obj,d=t.dialog;
        if(o) {
          if(o.dispose) o.dispose(d);
          d.innerHTML='';d.className=t.className;
          d.style.display='none';t.obj=null;
          document.removeEventListener('click',t._hide,false);
        }
      },
    },
  };
  utils.popup=utils.dialog;
  document.addEventListener('keydown',function(e){
    if(e.target==document.body){
      var k=[],f;
      if(e.ctrlKey) k.push('c');
      if(e.altKey) k.push('a');
      if(e.shiftKey) k.push('s');
      if(e.metaKey) k.push('m');
      k.push(String.fromCharCode(e.keyCode));
      k=k.join('-').toLowerCase();
      if(f=shortcuts[k]) {e.preventDefault();f();}
    }
  },false);
  window.addEventListener('DOMContentLoaded',function(){
    var d=document.createElement('div');document.body.appendChild(d);
    d.addEventListener('click',function(e){e.stopPropagation();},false);
    utils.dialog.dialog=d;
    utils.addStyle('\
.ge_x{clear:both;}\
.ge_popup{display:none;z-index:10006;font:normal normal 400 12px/18px 宋体;position:fixed;background:white;border:1px solid silver;box-shadow:5px 5px 7px #333;text-align:left;}\
.ge_mask{background:rgba(0,0,0,0.6);position:fixed;top:0;bottom:0;left:0;right:0;z-index:1007;display:none;}\
.ge_panel_p{position:relative;z-index:1006;}\
.ge_panel{position:absolute;background:#eee;border:1px solid black;padding:10px;border-radius:5px;bottom:0;white-space:nowrap;}\
.ge_caret,.ge_caret>i{position:absolute;border:solid;border-color:black transparent;border-width:8px 8px 0;z-index:889;}\
.ge_caret>i{border-top-color:#eee;top:-9px;left:-8px;}\
.ge_sbtn{background:#77f;color:white;border-radius:3px;border:1px solid;border:none;margin:2px;cursor:pointer;text-align:center;}\
span.ge_sbtn{padding:2px 3px;}\
.ge_disabled{background:gray;cursor:default;}\
.ge_rsep{margin-right:10px;}\
.ge_opt{padding:20px;border-radius:5px;}\
.ge_opt fieldset{border:1px solid silver;border-radius:5px;padding:5px;}\
.ge_opt textarea{min-height:100px;width:100%;}\
','ge_css');
  },false);
  var gkey='__ge_firefox',ff=window[gkey];
  if(!ff) ff=window[gkey]={};
  ff['utils']=utils;
}

function injectScript(code){
  var s=document.createElement('script'),p=document.body||document.documentElement;
  s.innerHTML=code;
  p.appendChild(s);p.removeChild(s);
}
function setvalue(o){
  if(o) data[o.key]=o.val;
  GM_setValue('data',JSON.stringify(data));
}
var event_id='utils'+(Math.random()*65536).toString(36),data;
try{
  data=JSON.parse(GM_getValue('data','{}'));
}catch(e){
  data={};
}
if(!localStorage.ge_backup) {
  var i,k;
  if(data.backup) {
    for(i in data) localStorage.setItem('ge_'+i,data[i]);
  } else {
    data.backup=1;
    for(i=0;i<localStorage.length;i++) {
      k=localStorage.key(i);
      if(k.slice(0,3)=='ge_') data[k.slice(3)]=localStorage.getItem(k);
    }
    setvalue();
  }
}
document.addEventListener(event_id,function(e){
  var o=JSON.parse(e.attrName),
  mappings={
    setvalue:setvalue,
  },f=mappings[o.cmd];
  if(f) f(o.data);
},false);
injectScript('!'+initUtils.toString()+'('+JSON.stringify(event_id)+')');
