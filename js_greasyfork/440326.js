// ==UserScript==
// @name         到顶到底
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  让网页一键到顶到底
// @author       MriJ
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440326/%E5%88%B0%E9%A1%B6%E5%88%B0%E5%BA%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440326/%E5%88%B0%E9%A1%B6%E5%88%B0%E5%BA%95.meta.js
// ==/UserScript==

(function(){
 const key=encodeURIComponent('到顶到底:执行判断');
 if(window[key]){return;}
 try{
  window[key]=true;
  function s(i){window.scrollTo(0,i);}
  const f=document.createElement('link');
  f.rel='stylesheet';
  f.href="data:text/css,@font-face{font-family:TandB;src:url('data:font/woff2;base64,d09GMgABAAAAAAKYAAoAAAAABcQAAAJLAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAAgkoKgnyCMQsIAAE2AiQDDAQgBYI+ByAbvgTIjsJxr4SI0AxliGLAyxhKy8P/jzHv+4ZoMomaTBKHzCFSPUQyjUgTbZVMJpF1Wyi7fr+270zfv/OGSzJPXBNxTJMl1Ub8lhFNeGQ6oRBNhq7JHyl+AP7RJfb0NhzCML1tPI7iidum3D0cqLVrbXIJPnsoGaFVqKR7ziNwbX5hfKoNMUhaBoAYBABwcN4Vhivv1t0od/F/kTsvwhOAgDwCgBkIGRkTENjDFZjAMws0RUiLDP//AP4HHqRjiwIgGth0ZjZ53QvgCoACkiQVXiEuIKR8Oc8qrZKpLZea8Ga3ZF63rYtux7R+R7qgtfAlhVtaPePZdipbHftD2xI8r9mESzKf2KHHMIQhHPGtvKSjEN9c4ib7sR3Z7GhDC3QOTU+6XWkOhamX7Mfoo9q3HqYf03V1p5gnCg5a6utopZI5xpj8+qQxtQ9/KErJfn93HQ0IB+e+gKKwhaAoAlvA8sei9qPzdOb0RCkcCFm+v9jGcyIE8/l5ipX0CcandXWWQEic8PPDgo2gLY7o1j5McDkABIJ/xkA+5c6rSMoDeG82uflh6v8r+ZCbB6BTAsFuVl47SJirTO1xjlHIydfUnT+EkK3jsB+11w0ECBUBkqYKkFU9AhTVIASqKVoINNUyrihiCN02MpD02gVZt32oYIeg2hFc0nR7MQd6w+2fgPGE98UzSVddUdXwX7pwVcktGk0vbj8RzAJ6hbUziQhLGJFpmJiQdddBQxL69MpSrUKVBlm6cT6sa6o6DBosi4x2zxZvsAguYOkoAAAAAA')}%23sky-scrolltop,%23sky-scrolltbtm{font-family:TandB!important;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;-webkit-font-smoothing:antialiased;line-height:1;font-size:16px;padding:5px;background:%23222;border-radius:6px}";
  document.head.append(f);
  const d=document.createElement('div');
  d.innerHTML='<div id="sky-scrolltop">顶</div><div id="sky-scrolltbtm" style="margin-top:18px;">底</div>';
  d.style='position:fixed;left:15px;bottom:20%;z-index:999999;color:#eee;user-select:none;opacity:0.6;';
  document.body.append(d);
  document.getElementById('sky-scrolltop').onclick=()=>{s(0)};
  document.getElementById('sky-scrolltbtm').onclick=()=>{s(document.body.scrollHeight)};
 } catch(err){console.log('到顶到底：',err);}
})();