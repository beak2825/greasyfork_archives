// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         cbox-videos
// @version      0.01
// @description  Open youtube links in a dialog in cbox chats
// @include      https://my.cbox.ws/*
// @include      /(https?:)?//(www\d\.)cbox\.ws\/box/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26341/cbox-videos.user.js
// @updateURL https://update.greasyfork.org/scripts/26341/cbox-videos.meta.js
// ==/UserScript==
//
(function($){
 // @part-name         @desktop
 // @part-author       https://github.com/leoncastro
 // @part-license      Private use only
 // @part-description  desktop with moveable and resizable dialogs
 // @part-version      beta-0.3 (partial content)
 // <@desktop>
 var minW = 50, minH = 50, minX = 0, maxX = 9999, minY = 0, maxY = 9999,
 ks = '-', kh = '#', kp = '.', kc = ',', kn = '>',
 prefix_main = 'wdlg',
 selector_main = prefix_main + ks + 'main',
 selector_tool = prefix_main + ks + 'tool',
 selector_head = prefix_main + ks + 'head',
 selector_text = prefix_main + ks + 'text',
 selector_ctrl = prefix_main + ks + 'ctrl',
 selector_exit = prefix_main + ks + 'exit',
 selector_body = prefix_main + ks + 'body',
 selector_pane = prefix_main + ks + 'pane',
 selector_foot = prefix_main + ks + 'foot',
 selector_grip = prefix_main + ks + 'grip';
 var template_css = `
<style id="###0###" type="text/css">
.wdlg-tool{position:absolute;background-color:#F4F4F4;z-index:910;-moz-box-shadow:3px 3px 8px #818181;-webkit-box-shadow:3px 3px 8px #818181;box-shadow:3px 3px 8px #818181;cursor:default}
.wdlg-tool.selected{z-index:911}
.wdlg-tool>.wdlg-head{display:block;position:relative;height:24px;line-height:24px;padding:8px 32px 0 8px;cursor:move;color:black;background-color:darkgray;font-size:130%;font-weight:normal;overflow:hidden}
.wdlg-tool.selected>.wdlg-head{background-color:white}
.wdlg-tool>.wdlg-head>.wdlg-text{display:block;position:absolute;left:0;right:0;margin:0 32px 0 8px;overflow:hidden}
.wdlg-tool>.wdlg-head>.wdlg-ctrl{display:block;position:absolute;top:0;right:0}
.wdlg-tool>.wdlg-head>.wdlg-ctrl>div{display:block;float:right;width:32px;height:16px;padding:8px;text-align:center;cursor:pointer;color:white;filter:alpha(opacity=50);opacity:0.5;}
.wdlg-tool>.wdlg-head>.wdlg-ctrl>div:hover{filter:alpha(opacity=100);opacity:1}
.wdlg-tool>.wdlg-head>.wdlg-ctrl>.wdlg-exit:hover{background-color:red}
.wdlg-tool>.wdlg-head>.wdlg-ctrl>.wdlg-exit:hover>svg>path{stroke:white}
.wdlg-tool>.wdlg-body{display:block;position:relative;width:100%;margin:0;padding:0;overflow:hidden}
.wdlg-tool>.wdlg-body>.wdlg-pane{display:block;position:relative;width:100%;height:100%;margin:0;padding:0;overflow:hidden}
.wdlg-tool>.wdlg-foot{display:block;position:relative;padding-right:16px}
.wdlg-tool>.wdlg-foot>.wdlg-grip{display:block;position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:se-resize}
</style>
`;
 var template_dlg =`
<div id="###1###" class="wdlg-tool" style="width:###2###;height:###3###;left:###4###;top:###5###;">
 <div class="wdlg-head">
  <div class="wdlg-text"></div>
  <div class="wdlg-ctrl">
   <div class="wdlg-exit">
    <svg width="16" height="16" overflow="hidden"><path d="M 2 2 L 13 13 M 13 2 L 2 13" stroke="#000" stroke-opacity="1" stroke-width="2" fill="none"></path></svg>
   </div>
  </div>
 </div>
 <div class="wdlg-body">
  <div class="wdlg-pane">
###0###
  </div>
 </div>
 <div class="wdlg-foot">
  <div class="wdlg-grip">
   <svg width="16" height="16" overflow="hidden"><path d="M 13 2 L 2 13 M 13 6 L 6 13 M 13 10 L 10 13 Z" stroke="#FFF" stroke-opacity="1" stroke-width="0.6" fill="none"></path></svg>
  </div>
 </div>
</div>
`;
 var template_frm = `<iframe frameborder="0" scrolling="no" width="100%" height="100%" src="###0###"></iframe>`;
 // Function call:
 function safeCall(o,a){if(o[a])o[a]();}
 // Node:
 function nodeCreate(o,n,c,t){t=t||'div';var e=document.createElement('div');if(n)e.id=n;if(c)e.className=c;if(o)o.appendChild(e);return e;}
 function nodeSelect(n,o){return'string'==typeof n?(o||document).querySelector(n):n;}
 function nodeInsert(n,t,o){n=nodeSelect(n,o);if(n)n.insertAdjacentHTML('beforeEnd',t);}
 function nodeRemove(n,o){n=nodeSelect(n,o);if(n){n.innerHTML='';if(n.parentNode)n.parentNode.removeChild(n);}}
 // Class:
 function classInsert(n,c){n=nodeSelect(n);if(n){n.className=(n.className?n.className+' ':'')+c;}}
 function classRemove(n,c){n=nodeSelect(n);if(n&&n.className){n.className=(' '+n.className+' ').split(' '+c+' ').join(' ').trim();}}
 // Event:
 function eventInsert(e,n,fn){n=nodeSelect(n);return n.addEventListener(e,fn,0);}
 function eventRemove(e,n,fn){n=nodeSelect(n);return n.removeEventListener(e,fn,0);}
 function eventCancel(e,c){e.returnValue=!1;safeCall(e,'preventDefault');if(c){e.keyCode=0;e.cancelBubble=!0;e.retainFocus=!0;safeCall(e,'stopPropagation');}}
 function eventFilter(e){return((e.which&&(e.which==1))||(e.button&&(e.button==1)));}
 // Helpers:
 function getFreeId(){var i=1,j;while(document.getElementById(j=(selector_main+ks+([1e4]+i).slice(-4))))i++;return j;}
 function getPixels(s){return s+'px';}
 function getToolX(n){return parseInt(n.style.left);}
 function getToolY(n){return parseInt(n.style.top);}
 function getToolW(n){return n.offsetWidth;}
 function getToolH(n){return n.offsetHeight;}
 // Template:
 function templateBuild()
 {
  var t = null;
  if(arguments.length)
  {
   t = arguments[0];
   for(var i = 1; i< arguments.length; i++)
    t = t.replace('###' + (i - 1) + '###', arguments[i]);
  }
  return t;
 }
 // Desktop:
 var desktop = function(n)
 {
  n = n || document.body;
  this.handleDesk = n;
  this.selectTool = null;
  this.selectItem = null;
  this.x = 0;
  this.y = 0;
  this.w = 0;
  this.h = 0;
  this.cx = 0;
  this.cy = 0;
  this.mx = 0;
  this.my = 0;

  var it = this;
  eventInsert('mousedown', n, function(e){it.onMouseDn(e);});
  eventInsert('mousemove', n, function(e){it.onMouseMv(e);});
  eventInsert('mouseup'  , n, function(e){it.onMouseUp(e);});

  this.insertWindowHTML = function(html, opt, cx, cy, x, y)
  {
   var t = prefix_main + ks + 'style';
   if( !nodeSelect(kh + t) )
    nodeInsert(this.handleDesk, templateBuild(template_css, t));

   var n = getFreeId();
   opt = opt || {};
   opt.title = opt.title || n;
   this.w = this.w || 320; // 320, 400, 480, 640, 800, 1024 // TODO
   this.h = this.h || 204; // 180, 224, 270, 360, 450,  576 // TODO
   cx = cx || opt.cx || opt.height || this.w;
   cy = cy || opt.cy || opt.width  || this.h - 24;
   x  = x  || opt.x  || opt.left   || Math.random() * (getToolW(this.handleDesk) - cx);
   y  = y  || opt.y  || opt.top    || Math.random() * (getToolH(this.handleDesk) - cy);

   nodeInsert(this.handleDesk, templateBuild(template_dlg, html, n,
              getPixels(cx), getPixels(24 + cy), getPixels(x), getPixels(y)));
   if(this.selectTool)
    this.selectLeave(1);
   this.selectEnter(nodeSelect(kh + n));
   var it = this,
   c = kh + n + kp + selector_tool + kn + kp + selector_head + kn +
       kp + selector_ctrl + kn + kp + selector_exit;
   if(nodeSelect(c))
    eventInsert('click', c, function(e){
     if(it.b)
      it.selectLeave(1);
     nodeRemove(kh + n);
     eventCancel(e, 1);
    });
   this.onMouseUp();
   return n;
  };
  this.insertWindowLink = function(link, opt, cx, cy, x, y)
  {
   var html = templateBuild(template_frm, link);
   opt = opt || {};
   opt.link = link;
   this.insertWindowHTML(html, opt, cx, cy, x, y);
  };
  this.deleteWindowTool = function(n)
  {
   nodeRemove(kh + n);
  };
 };
 var fn = desktop.prototype;
 // Mouse:
 fn.onMouseDn = function(e)
 {
  var o = e.target || e.srcElement, n = null, h = null;
  while(o)
  {
   if(o.className)
   {
    if( !h && (
        ~String.prototype.indexOf.call(o.className, selector_grip) ||
        ~String.prototype.indexOf.call(o.className, selector_head)) )
     h = o;
    if( ~String.prototype.indexOf.call(o.className, selector_tool) )
    {
     n = o;
     break;
    }
   }
   o = o.parentNode;
  }
  if(this.selectTool && (this.selectTool != n))
  {
   this.selectLeave(1);
  }
  if(n && (!this.selectTool || (n == this.selectTool)))
  {
   if(h)
    eventCancel(e);
   this.selectEnter(n);
   if(eventFilter(e))
    this.selectItem = h;
  }
 };
 fn.onMouseMv = function(e)
 {
  var mx = e.pageX || e.clientX + document.documentElement.scrollLeft;
  var my = e.pageY || e.clientY + document.documentElement.scrollTop;
  var x = mx - this.mx + this.cx;
  var y = my - this.my + this.cy;
  this.cx = this.cy = 0;
  this.mx = mx;
  this.my = my;
  if(!this.selectItem)
   return true;
  if(this.resizeStep(x, y))
  {
   if(this.selectTool)
   {
    var b = nodeSelect(kp + selector_body, this.selectTool);
    if(b)
    {
     b.style.width = getPixels(getToolW(this.selectTool));
     b.style.height = getPixels(getToolH(this.selectTool) -
                      getToolH(nodeSelect(kp + selector_head, this.selectTool)));
    }
   }
  }
  else
  {
   var dX = x, dY = y;
   if(this.x + dX < minX)
    this.cx = (dX - (x = minX - this.x));
   else if(this.x + this.w + dX > maxX)
    this.cx = (dX - (x = maxX - this.x - this.w));
   if(this.y + dY < minY)
    this.cy = (dY - (y = minY - this.y));
   else if(this.y + this.h + dY > maxY)
    this.cy = (dY - (y = maxY - this.y - this.h));
   this.x += x;
   this.y += y;
  }
  this.selectTool.style.left   = getPixels(this.x);
  this.selectTool.style.top    = getPixels(this.y);
  this.selectTool.style.width  = getPixels(this.w);
  this.selectTool.style.height = getPixels(this.h);

  eventCancel(e);
 };
 fn.onMouseUp = function(e)
 {
  if(this.selectTool)
  {
   var b = nodeSelect(kp + selector_body, this.selectTool);
   if(b)
   {
    b.style.width = getPixels(getToolW(this.selectTool));
    b.style.height = getPixels(getToolH(this.selectTool) -
                     getToolH(nodeSelect(kp + selector_head, this.selectTool)));
   }
  }
  this.selectLeave(0);
 };
 // Select:
 fn.selectEnter = function(n)
 {
  if(n && (n != this.selectTool))
  {
   this.resizeInit(n);
   this.x = getToolX(n);
   this.y = getToolY(n);
   this.w = getToolW(n);
   this.h = getToolH(n);
  }
 };
 fn.selectLeave = function(e)
 {
  if(e)
   this.resizeInit(null);
  this.selectItem = null;
  this.cx = 0;
  this.cy = 0;
 };
 // Resize:
 fn.resizeInit = function(n)
 {
  var s = 'selected';
  if(n)
  {
   this.selectTool = n;
   classInsert(this.selectTool, s);
  }
  else
  {
   classRemove(this.selectTool, s);
   this.selectTool = n;
  }
 };
 fn.resizeStep = function(x, y)
 {
  var h = '';
  if(this.selectItem && this.selectItem.className)
  {
   if(this.selectItem.className === selector_grip)
    h = 'br';
  }
  var dX = x, dY = y, r = 0;
  if(~h.indexOf('b'))
  {
   if(this.h + dY < minH)
    this.cy = (dY - (y = minH - this.h));
   else if(this.y + this.h + dY > maxY)
    this.cy = (dY - (y = maxY - this.y - this.h));
   this.h += y;
   r = 1;
  }
  if(~h.indexOf('r'))
  {
   if(this.w + dX < minW)
    this.cx = (dX - (x = minW - this.w));
   else if(this.x + this.w + dX > maxX)
    this.cx = (dX - (x = maxX - this.x - this.w));
   this.w += x;
   r = 1;
  }
  return r;
 };
 // </@desktop>

 // <@cbox-videos>
 var yt_video = '//www.youtube.com/embed/###?wmode=opaque&autoplay=1&modestbranding=1&rel=0&showinfo=1';
 var yt_regex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((?:\w|-){11})(?:\S+)?/i;
 var deskctrl = new desktop();

 var addVideo = function(txt, x, y)
 {
  var yt_urlid = txt && txt.match(yt_regex);
  if( yt_urlid && (yt_urlid = yt_urlid[1]) )
  {
   deskctrl.insertWindowLink(yt_video.replace('###', yt_urlid), {}, null, null, x, y);
   return 1;
  }
  return 0;
 };

 document.addEventListener('click', function(e){
  e = window.event ? event : e;
  var url, obj = window.event ? event.srcElement : e.target;
  if( (obj.tagName == 'A'   && obj.className && ~obj.className.indexOf('autoLink') && (url = obj.href)) ||
      (obj.tagName == 'DIV' && obj.className && ~obj.className.indexOf('body') &&
       obj.parentNode && ~obj.parentNode.className.indexOf('msg') && obj.innerHTML &&
       (url = obj.innerHTML.match(yt_regex)) && (url = url[0])) )
  {
   if(addVideo(url, e.clientX, e.clientY))
    e.preventDefault();
  }
 });
 // </@cbox-videos>

})();
