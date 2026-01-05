// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         lib-add-stylish-string
// @version      1.00
// @description  Library: addStylish(string)
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// ==/UserScript==
//
!(function(){
 window.addStylish = function addStylish(str)
 {
  var s = str;
  var a, b, c, d;
  // s = s.replace(/\/\*(?:[\s\S]?)+?\*\//g, '');
  s = s.replace(/@namespace.*$/m, '');
  a = [];
  b = s.split('@-moz-document');
  a[0] = { url: [''], css: b[0].trim() };
  for(var i = 1; i < b.length; i++)
  {
   a[i] = {};
   c = b[i].match(/[^{]*/)[0];
   c = c.split(',');
   a[i].url = [];
   for(var j = 0; j < c.length; j++)
   {
    d = c[j].match(/(domain|url|url-prefix|regexp)\((.*)\)/);
    if(d && d[2])
    {
     if( d[2][0] == '"' || d[2][0] == "'" )
      d[2] = d[2].slice(1, -1);
     switch(d[1])
     {
      case 'url':
       a[i].url[j] = new RegExp(d[2].replace(/\./g, '\\.'), 'i');
       break;
      case 'url-prefix':
       a[i].url[j] = new RegExp(d[2].replace(/\./g, '\\.') + '.*', 'i');
       break;
      case 'domain':
       a[i].url[j] = new RegExp('(https?:)?\/\/(www\.)?' + d[2].replace(/\./g, '\\.') + '\/.*', 'i');
       break;
      case 'regexp':
       a[i].url[j] = new RegExp(d[2], 'i');
       break;
     }
    }
   }
   c = b[i].match(/{([\s\S]*)}/);
   a[i].css = (c[1] || '').trim();
  }
  for(var i = 0; i < b.length; i++)
  {
   if(a[i].css)
   {
    for(var j = 0; j < a[i].url.length; j++)
    {
     if(a[i].url[j] == '' || window.location.href.match(a[i].url[j]))
     {
      var dad, obj = document.createElement('style');
      obj.setAttribute('type', 'text/css');
      obj.innerHTML = a[i].css;
      dad = document.getElementsByTagName('head');
      (dad && dad.length ? dad[0] : document).appendChild(obj);
      if(document.readyState == 'loading')
       document.addEventListener('DOMContentLoaded', function(){obj.parentNode.appendChild(obj)});
      break;
     }
    }
   }
  }
 }
})();
