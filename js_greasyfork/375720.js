// ==UserScript==
// @name        8k
// @namespace   erin
// @description A more circlejerk-friendly 8chan extension.
// @include     *8chan.co*
// @include     *8ch.net*
// @run-at      document-end
// @version     0.75
// @icon        data:image/png;base64,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
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375720/8k.user.js
// @updateURL https://update.greasyfork.org/scripts/375720/8k.meta.js
// ==/UserScript==

function chanK(){

  var d, db, h, namespace, $, $$, version;

  d = document;
  db = document.body;
  h = document.getElementsByTagName('head')[0];

  namespace = "8k";
  version = 0.75;
  
  if(window.location.href.indexOf('8ch.net') > 0){
    var $siteDomain = '8ch.net';    
  }else{
    var $siteDomain = '8chan.co'; 
  }

  $ = function(s, p){
    if(!p || p == null){
      p = db;
    }
    return p.querySelector(s);
  };

  $$ = function(s, p){
    if(!p || p == null){
      p = db;
    }
    return p.querySelectorAll(s);
  };

  $.getVal = function(k, v){
    if(typeof(Storage) !=="undefined"){
      if(v == null){
        if(localStorage.getItem(namespace + "." + k) != null){
          return localStorage.getItem(namespace  + "." + k);
        }else{
          return 'undefined';
        }
      }else{
        if(localStorage.getItem(namespace + "." + k) != null){
          return localStorage.getItem(namespace + "." + k);
        }else{
          return v;
        }
      }
    }else{
      return 'storage unavailable';
    }
  };

  $.setVal = function(k, v){
    if(typeof(Storage) !=="undefined"){
      if(v == null){
        return 'undefined';
      }else{
        return localStorage.setItem(namespace  + "." + k, v);
      }
    }else{
      return 'storage unavailable';
    }
  };

  $.delVal = function(k){
    return localStorage.removeItem(namespace + "." + k);
  };

  $.elm = function(t, a, s){
    var e = d.createElement(t);
    if(a){
      for (key in a){
        e.setAttribute(key, a[key]);
      }
    }
    if(s){
      s.appendChild(e);
    }
    return e;
  };

  $.htm = function(s, v){
    if(v == null){
      return s.innerHTML;
    }else{
      s.innerHTML = v;
    }
    return s;
  };

  $.each = function(a, c, e){
    for(var i = 0; i < a.length; i++){
      c(a[i], i);
      if(i == (a.length)-1){
        if(e && e != null){
          return e(a[i], i);
        }else{
          return a;
        }
      }
    }
  };

  $.xhr = function(t, u, i, c, p){
    if(i != null){
      if(t == 'POST'){
        var xd = new FormData();
        for (key in i){
          xd.append(key, i[key]);
        }
      }else{
        xd = '?';
        for (key in i){
          xd += key + '=' + i[key] + '&';
        }
        xd = xd.substring(0, (xd.length-1));
        u += xd;
      }
    }
    var x = new XMLHttpRequest();
    x.open(t, u);
    if(p != null){
      for (key in p){
        x.setRequestHeader(key, p[key]);
      }
    }
    x.onreadystatechange = function(){
      if (x.readyState == 4) {
        return c(x);
      }
    }
    if(t == 'POST' && i != null){
      x.send(xd);
    }else{
      x.send();
    }
  };

  $.JSON = function(s){
    if(typeof s == 'string'){
      return JSON.parse(s);
    }else{
      return JSON.stringify(s);
    }
  };

  $.time = function(t, c, l){
    if(c == false){
      return clearInterval(t);
    }else{
      if(l == true){
        return setInterval(function(){
          c();
        },t);
      }else{
        return setTimeout(function(){
          c();
        },t);
      }
    }
  };

  $.val = function(s, v){
    if(!v || v == null){
      return s.value;
    }else{
      s.value = v;
    }
    return s;
  };

  $.event = function(t, i, s){
    if (i == null) {
      i = {};
    }
    if (s == null) {
      s = d;
    }
    return s.dispatchEvent(new CustomEvent(t, i));
  };

  $.att = function(s, a, v) {
    if (!v || v == null || v == false) {
      if (v == false) {
        return s.removeAttribute(a);
      } else {
        return s.getAttribute(a);
      }
    } else {
      s.setAttribute(a, v);
      return s;
    }
  };

  $.destroy = function(s) {
    return s.parentNode.removeChild(s);
  };

  $.css = function(s){
    var e = d.createElement('style');
    e.type = 'text/css';
    if (e.styleSheet){
      e.styleSheet.cssText = s;
    } else {
      e.appendChild(d.createTextNode(s));
    }
    h.appendChild(e);
    return e;
  };

  $.onCursor = function(myField, myValue){
    if (document.selection) {
      myField.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
    }else if(myField.selectionStart || myField.selectionStart == '0'){
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
    }else{
      myField.value += myValue;
    }
  };

  $.after = function(e, s){
    s.parentNode.insertBefore(e, s.nextSibling);
    return e;
  };
  
  $.before = function(e, s){
    s.parentNode.insertBefore(e, s);
    return e;
  };

  $.getSelected = function(){
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };
  
  $.parLines = function(s){
    s = s.replace(/<\/p>/g, " ");
    return s;    
  };
  
  $.stripTags = function(inputtags, allowedtags){
    allowedtags = (((allowedtags || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return inputtags.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowedtags.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  };
  
  $.stripMore = function(s){
    s = s.replace(/&gt;/g, ">"); 
    s = s.replace(/&lt;/g, "<"); 
    s = s.replace(/&nbsp;/g, " ");
    return s;
  };
  
  $.anchorJump = function(h){
    var url = location.href;
    location.href = "#"+h;
    history.replaceState(null,null,url); 
  };

  $.elmJump = function(s){
    window.scrollTo(0, s.offsetTop);
  };

  /*------------------------------------------*/

  var k, w, qr, page, setting;

  w = window.location.href;
  k = {};
  qr = {};
  page = {};
  setting = {};
  
  if('contextMenu' in document.body && 'HTMLMenuItemElement' in window){
    k.contexts = true;
  }else{
    k.contexts = false;
  }
  
  k.firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  if($siteDomain == '8ch.net'){    
    k.end = w.split('.net')[1];    
  }else{
    k.end = w.split('.co')[1];
  }
  k.proto = window.location.protocol;
  if(k.end.indexOf('mod.php?') > 0){
    if(k.end.length > 3 && w.split('mod.php?/')[1].indexOf('/') > 0 && w.indexOf('/src/') < 1){ 
      k.board = w.split('mod.php?/')[1].split('/')[0]; 
    }else{ 
      k.board = null; 
    }
    if(w.indexOf('/res/') > 1){ 
      k.thread = w.split('/res/')[1].split('+')[0].split('.')[0]; 
    }else if(w.indexOf('catalog') > 2){ 
      k.thread = 'catalog'; 
    }else{ 
      k.thread = 'mod'; 
    }
  }else{
    if(k.end.length > 3 && w.split($siteDomain+'/')[1].indexOf('/') > 0 && w.indexOf('/src/') < 1){ 
      k.board = w.split($siteDomain+'/')[1].split('/')[0]; 
    }else{ 
      k.board = null; 
    }
    if(w.indexOf('/res/') > 1){ 
      k.thread = w.split('/res/')[1].split('+')[0].split('.h')[0]; 
    }else if(w.indexOf('catalog') > 2){ 
      k.thread = 'catalog'; 
    }else if(w.indexOf('index') > 2 || w.substring((w.length-1), w.length) == '/'){ 
      k.thread = 'index'; 
    }else{ 
      k.thread = null; 
    }
  }

  $.setVal('currentVer', version);

  /*------------------------------------------*/
  
    
  k.patch = function(thisPatch){
    if(parseFloat($.getVal('currentPatch', '0')) < parseFloat(thisPatch)){
      for(var i = 0;i < parseFloat(thisPatch); i++){
        
      }      
    }    
  }

  k.versionCheck = function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", k.proto + '//erin.wtf/version/8k.php');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if(xhr.status == "200"){
          var re = $.JSON(xhr.responseText);
          if(parseFloat(re.version) > parseFloat(version) && $.getVal('8k.optOut.' + re.version, 'false') != 'true' && parseFloat(re.version) > parseFloat($.getVal('currentVer', version))){            
            var con = confirm(
              "8k update \n8k wants to update from version " 
              + version + " to " + re.version + ". \n" + 
              "Changes in v" + re.version + " include: \n  " + re.change +
              ".\nAllow?"
            );
            if (con == true) {
              $.setVal('currentVer', re.version);
              window.location.href = (re.url);
            }else{
              $.setVal('8k.optOut.' + re.version, 'true');
            } 
          }
        }else{ 
          console.log('8k failed handshake with remote server'); 
        }
      }
    }
    xhr.send();    
  }
  //(function(){return k.versionCheck();})();

  //$.time(1000 * 60 * 15, k.versionCheck, true);

  setting.recent = $.JSON($.getVal('recent', '[]'));
  
  k.pageLength = $$('.post').length;
  
  k.trackUpdater = function(t, n){
    var updater = $('#update_secs');
    if(updater.innerHTML != 'Updating...'){
      if(t == true && $$('.post').length > k.pageLength){
        var e = {};
        e.detail = {};
        e.detail['count'] = (parseFloat($$('.post').length) - parseFloat(k.pageLength));
        e.detail['board'] = k.board;
        e.detail['thread'] = k.thread;
        $.event('threadUpdate', e, d);
        k.pageLength = $$('.post').length;
      }
      if(parseFloat(updater.innerHTML) > 15){
        return $.time(2000, function(){ k.trackUpdater(false, 0); }, false);
      }else if(parseFloat(updater.innerHTML) < 3){
        return $.time(50, function(){ k.trackUpdater(false, 0); }, false);       
      }else{
        return $.time(300, function(){ k.trackUpdater(false, 0); }, false); 
      }
    }else{
      return $.time(50, function(){ k.trackUpdater(true, $$('.post').length); }, false); 
    }   
  }
  
  k.asset = {};
  k.asset.close = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kGAxQNG0D0AQQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA9ElEQVQ4y8WSwWrDMBBEn2SnIYd+YnDsxMo3WcGC0k/sqbWk6SEi2HUNvZQsLOyudmZXI8GzzcyTYRj0F9D1ejWr4jAMypI0ScqTFCWl4rHUJilLmg+q5ySZT8bwBkDnOupyHIkEHwA4u2Yx2C6T6hEHH4hALPFvPasNUqw5uo73AgjeL5qPriPFenuDqoZDtvSuXWnUu5ZDtlRL/JJgygIsmd2K4F6zpWdLA2uQjYw/VgcYvUc2gjXbBBm4zQRrXE/j+kd+8wHxsU0Q9fWIW3diT2JPonWnGeB1+xVq83IXMFWYbKFcd2egP1+gSqR/+8pPs28O9HrDbAjm+gAAAABJRU5ErkJggg==';
  k.asset.fileSwitch = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwhJREFUeNqMUs9rE0EUfrs7u/nRJI2xTVsFW5utP7AWa6pQ0UPtQQ82BxWVEkEQFA9CwX9Bj1WQnkTBgwcP0qIIoqAiiKIgFm3tD1K1Ypu0TWyyaXazu7MzvsStVU8OfMy84b1v5n3fE7quTQNRFCCyDISQHgDYwTkfskwTKos5DlDbBl8gAJIkgSCK8HtxDmQtgh5KaaJaxBj87yIuUw++kjh1qFm9+3g2hTeDiALiC+I1IuXmxzH3GO4diHrEKMHvxm3LSpw41KpmMmVIHNigOowz3aTWQk6PTX4u7KGcP8XkFiLyM22b/NHGiDcc9EuekRcZidhur4ZBQdMs8HgUsG0ullYcr19UvN07G0Jvxhcv1Xh4S2dbqNE0mFzMW0AEuaqNVH/wfJpaljU2tVDf2d4YufdoLPUtndckwmhtwOtbypXXl8r2zo5YuE7L26izwDL50tzoVG7WNOlbof3KKCAB4E96sJ2qiKj0dc7Y4bpITaek+Po2bfRHlrMFJRjw8CUNpvNF65kgCDcxdYzomrYq6HNEN2IGiyvi3VgulB9EN3j9SzYoLBiC+R8rxeyCNuM4zkUU06m6UCoUQMY5kL3eJLIe/WWjMymK0nl/yBczG6PBdJlBEzestGYblkPn6XL+HFr9BFNnpUBXP4iimMSBGWg6sj++PJZKE69yvLa5YZemxlpmHUVcJ3Mn+3FGz6rqBFNbpbDoRJiu7zZLxmYheu7+YWS6XN+fiH/CbtqC6AgFWEJzKEezWdkWXr7KGEX9q3awN8d9PiILAHvCAO+H7qTI6sgaOHyYDyUs5jZ16oyVMnyfK+gTqUVu2bf1YvGrNDLc62/fXhtWW2o8wZCM8wNC6PRdYJQm0YGB0NlkXLt15x3yVARaRHxAR4YhN/3O1A1g62Iq5u3D+82IEGr2Rai8LkW3g7itLynUbR2oTvbUw65Va+zxkb9mX9hyZC3ITYPgHhVEQNx74SQQ/372avDqHzWVzrAxMF2UXVTO1iqB5JJ43J38Q8DctugfqMTOTwEGAI5ZdkILqB9jAAAAAElFTkSuQmCC';
  k.asset.eject = 'data:image/png;base64,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';
  k.asset.load = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAIAAACp9tltAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH2wELFw4qAh25UAAAAAd0RVh0QXV0aG9yAKmuzEgAAAAMdEVYdERlc2NyaXB0aW9uABMJISMAAAAKdEVYdENvcHlyaWdodACsD8w6AAAADnRFWHRDcmVhdGlvbiB0aW1lADX3DwkAAAAJdEVYdFNvZnR3YXJlAF1w/zoAAAALdEVYdERpc2NsYWltZXIAt8C0jwAAAAh0RVh0V2FybmluZwDAG+aHAAAAB3RFWHRTb3VyY2UA9f+D6wAAAAh0RVh0Q29tbWVudAD2zJa/AAAABnRFWHRUaXRsZQCo7tInAAACAklEQVQokU1Su05UURRdZ59z7x3uyAwzoPiKCEhILAA7rSXRUmNhTCxsLO0s/BV/QBM7ExMr0R+wMaJIQlTQhDgyOK/7OmfvbaEyrtWsYjXrYVQVAAARyatBL//JyirqXDJz7FTsEvyDO1IK2d5/++rjUzJ2VI6SuHH3ysPTU/NjK4sOsvArkzLI585hkDA9OWuotnvw/cO3YbefARpZnGnHzgf90qmK0pClYa4GjkUtxRWjN1ISGRbF1x/99dVpx4rDvPRmqxy+G4Uda6OSKxYBZZudx+eOX1w5ub69y4M8kKqqovDFxtbzvcOdNGmUvvDi07jxcvPF6603PhgFjAEBINiF5tpi+zarDooeDLHqsMyXZ1evL91T34YBYJwqRFQ0unDiWquZb3x6dra9eDDqZt7cufRgvr1WVMYcleVFBCTqZpKb51vF+/0nwtNXlx7VaGWvG+qx/C1LoSKqglpMk7X48twtlmx2cmGutVyvqTVkxhMomFVFrQGg9Vrjxtp9wHYHsGSTiJiZjDEAKcCiAIyBihLE0QTBESkLPKsoiIwxcIAGZoWmMaWxDaLN1FVeBrk06m4ioqL041hBpJ/5ZupKHwJLtyel57LkXj9kjrIiFFUA4CJrWqnb7eQsUnlhFh+EhWGAP69TJBE1U2cCc1ZwVomIqGLM/xBZmqrHvwEOdkF5lFdZ8wAAAABJRU5ErkJggg==';
  k.asset.optionsIcon = 'data:image/png;base64,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';
  k.asset.alert1 = 'data:audio/wav;base64,UklGRgYPAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YeEOAACBgYCCgIKAgoGCgoKCgYKBgoGCgYKBgYKBgoGDgYOBgoKCg4KDgYKBg4KEg4SFhYaGiIaGg4SBgYB+fn1+fX9+f39/gICCgYODhISEhYSGhoeHiIiHiYeJh4iIh4eFhYOEg4ODgYOChIKDg4ODgYKChIGBgYKEg4WEhoeKjY6Pi4mFhYKAfnx9e318fn5/f4CCgYOCg4KCg4OFhIaGioqNjYyMiouJiYaEgH9/f398fXt+foGCgYGBhISFgoGAg4OEh4mMjJKVmZWSjImGgX98fHt9fH17fX1+f3+BgIKBg4OFhIaHiYuLjIuMiouIiIaEg4CAfX18fX1/gICBf4GBhIWDgX5/gIOFiY+Sl5mdmpWOiIR+fHh5eXp7enp4eHd4eHh7fICAhIWHiImMjI6Njo+PjoqKh4eDg4F+fXt9fYB/fn19f3+AfoCBhYmKjY+VmJybmJKLhoB9eHZ0dHNzdXd6eHl5fHx+gYSJiY2Nj4yNjY6OjY6MioWHhYJ9e3p4ent/fXt4eHd0cnR7gYiLk5ecnp6ck4uDgHx9fHx5eXh1dHN2dnl6foCCg4SIio+SlpaWlZKPiYeEhIOBgYCAfoCAfnp3dnNybnB0e4KHkJWamZyclo6Gg39+fHx8e3t5end2dHV4eHp8gYKHjI6Oi4yIhYKFiIeIiYqEgXt7eXl7f4WFhYJ+eHR2eoSKlJmenJSLg398f399eXp6eXt8f36AgIKCgoCDiIqLi4+QkIyKh4B8fIOBfn1/eHBvdnyBj5yahHl3cGJtkKill5GIgXx7dXBsbnF4goaFfXt4dXaDlaGln5iJfXV1fYqWlpaMemVeaHOFmqqeg25kWlJrmLWqlo6KhX15dXV3eX5+fnp4d3uFjpWUlI+Gfn2FiIuOkox8cnR7eoOXpJR3aGReVmuTqJ6LhoB8enx6en1/gX19e31+goaMj4mEf4OCgIGIjYaBgoeAfIWYmod3dHVscYmkpJaMiYZ/fHZ2d3p7e3x9fHuBiIyHhIJ/e3qAhYuJiIqQiH58iZGHeXFwZWBxlaiilo+Jf3t4enp9fH1+fH2Ah4mIhYJ+dXF0gYaHhoiJgHt/jI2Df4KBdXmOoZ2QiYR/eHl6d3Z4fHp8fYCBgoJ9enV3fIqTjoiJjomGh4d9bWtzenN6kaCYiYeBeXZ6d3FydHp/iIqHfHZ7gIOGj46Gf4SKh397gIB+fICChpGgqJZ8bHJ4fYWIgHR1eX+DhoOCfnRudYaMjZWdiXF2j5OHhX1sYnONpJ6MhoiEfYSCc2p3gYaHhH94bG6SraeRinhjbYyUgXdwX01imsO/q6KLaVJef5umlW9PWHSMp7qxim9aR1yizK+HZjAda9XquYprWGR4foB+gnldTFx6otPGfDgpSJfr4JFOJSuG7OCOb3+Ef3RmbImadkxKY5jZz3MuKFiz8sNvRSxPtemtfI2dj3NdYYurkFI8XaThwWIjNnzU5aBbLjSD2cmMjKObelVOfbOoWipEl9vIaiM0gdTipFUnO5ncuo6VppZsSWKjwYYzLnvQ1YgwKG/H565ZHTKX4LuIkamZXjZXrsR0ITCN0sVoIjSL3NqKNBhZyNyYf5yrfT03h82jRCZrxNGEKiZ31eCRMhZdzt2NdqK7hjAmeNSuRiBiv9WGLC2A3NyAKCOA3sZ6hbqwXR5Fr9l6JDKM0bZXKly75KRDHl/J04+Ft65ZIFG93HshMI/fyGIkT7frt04XS8PepZmwgzQuht2mORdhxdR+KTaU5MZaDiyj7rSMmHs/SaTShR8cctLOdSQukubPXAgcm/fDi5F5SGi4rkAEPbDlmSwQX93sgA4EZerukn1zW363lCsOXM/ZcBIeie7cYQUUhPXafWl+jqyWRRpRut2SLCF22+uNIRFn3PmhXXmtwJdMKFqtzJNAL3bP35w3GFq756Vqld7Ebx0ifMCyfkdCg8HKkD0pW7LcvKrDsWQiLofEolcsPYnNzY4yEkWp9eCmjXtgZXpzUERUfKSvmWxFR3OrzbOOgXtwa2tnZ2ZmYGJug5aZkYqJg4B+fXt7fn6Af4KEhoiIi4qJhoiHhoaDhYOFhIODhIaFiIeJioyMiIiHiIaGh4eIh4mGh4eIiIeIhYWEh4aGhoWFhIWCgoKAf31+fX9/gIB/f36BgYOAgH99fHl5d3l5enl3dnV3dnZycW5tbW1ucHRzc3Jzc3R1dXZ3enl7e4CAgIGBgoGDgoSAgICBgoKDg4WEhoOEhIaFhISDhYWIiImIioqLjY2OjI2LjIyOjY+Pj4+NjouMiYiGhYSChISFgoOCgoODhIKEgoOAfn9+f3t6eHd1c3RxcG9yc3BwbWxpamxvcnJ1dHZ0dXh5e3h3dHV1dXZ1d3d5eXp5e4CBg4CBgYGBgoOChYWIiYiIiIuKi4qMjIyMjJGSlJOWlpaWlZaUlZGPi4qLj5GQj4yOjY+Ojo6Mi4eFg4SBgH18e3l3dnl5eHRzcW9ubW5tbWxwcHJydHV0c25ta2xqa2xwcG5vcXNydXd7e3t5eXt7e3p9fX5/goWIiomLjI6Oj5COj46Sk5WUlpucnZyfnJeVl5uanJqbmJaWmJuWk46NjIqKiYmFhIGAgH5+e3t3dnVzcW1wc3Vxb25vcG1saGhnaWllZWRkXl1ibHNyb21zdXRvb3BxcW9xdH2AgHx+hoyNh4iKj42PlJukpJ2Ul5yhnZyfpKCUkp+2vLWlmpabnpiQjIyDfoSVl4x8cneBjIyEd3h8enJ0enRfTmB4dFxWW11WUFlyiYFnUFp0dE08Wm5gWXuSfVJKbJmxoYFpeJWGYnOkpXp2rM+mbHOr1NrFmoClxo1clOHEa3TGyXBTk8jCs6J5eKaWS0inwGM+hbdtNGOplHuDYjVejkAQbbtYC1WrWAlNpHlYg2EdS5xjJoLEaR6EvmIslMKGcq6CUY3JelbA4m1b2NFOdvrXlLK9bnnHrViT4ppYqdhuX9nLjY2fbmWTh01ppGo1bo0yOKCYUWB0QDdoWyNSi0EaXnEnS6OJSWl3UlZ9cF6On21wqZBrpNiifqKjg5e3mJXSwIaix4qK4OClqL6lkq2qip6sfoCffGufqXtvf3ZVYHlVWHxZNFtWK12WZzVDWTo0X1lBb25AXXRTca6VY3KMfHKamHmftHiMuIWT5tyTmbaqmsDJpsTUn6LAkJnUvpaRmpCGjI52hYpfYXNMW5yBTUheUkBQSjNYXyM0UDhXlnI2TGhhY3hrbpCGbYWCebDNlnSZoJ21tJq91aiqu5eu9dmhrLSktK6Qn6qMiZJxc6KOcGxgYXdfSmxbLkVUGyZ5czEySUI7UmFQR2FoWmqOkW5sfoWHjp2nppWNnL/b2si6wcrMyMXGwrejmJ2usKSWioeDf3d1d3NjSEBUb2lNNC01ODo8RUY8MDRMZXBkW19pbnR7goiFhIynwsq5rbO7xMrR0cy9trzIyLmroqCal5GNhnhranqCeF5NSEhFRUc/MCIsQ1hRPjlET1ZeY2ViZnCElZeMi5agrLO1s7bB0+fq28W9u726s6qfmZOXmJF/cG9wb2RbT0I6SWNaNSArODo6PD49RllvcGFlc35+g4uQkp6+0sayvM3R09bUw7vCy7+qoZ+elpSLeGRqhoNqV1lUTUU0GxQ2Yl8zIzA/TFZYUF15kINudoyir7Ghn73q7czA1+TYyLCjq8C6pZiWlIh6YFVvj3xTOTxALR8iLTpFNzE6R1JVVlpgcpKNfZanmJqssNj/+NDP0cm9rLjYx6OXnJR6boijhFBJXzwUKmlvIQAtNx8zWnNVPl1pXm6TsJh8pbSmwPb/07/YzrXC1MmtpKSOho6Ug2xpW0pNYVw2Jys1P1JaRThDVWR8iHVkeJOnyN2/mK3M0NrixaCmtKysr5Z4e4J7gn5RMTpARl1JEhQwPVRoSTFOYnOTm21unLPQ6sOMrtfX49ahkrGwrrKSbHeCgIpoKBxCXXVODxA6WXhsODpdgq6zdFV7uvj/zo5/q/D82a6MgKTIuZp8W0djgG5JKxgVL0RIRURESFdkcnyJkI6WrMzc39rRycbLyMCzq6OZkoh9bWBRQzkvKigtLzM8QkhPXWZzf4qVpLXCztDNztLPxcG5sqmimI2DdGVURzguJyMkJy40PkVPWWRxf46aqbnK1NrY087IxL22q6SbkoZ2YU09LyghHh4lLTZAR1JcaneKmau8y9fe4NrWzsi/uK6lmYx+bFlCLyAcGR0jKzQ+SVJfaXqNobLF1d/k4d3TzMW+tKiaiHhoWD8sIBobISowOkVRXmt6iJ6zxdLc4N3d1s7Du7GilYRzYU0wHRscJC0zOUdSV2V8lKS0vsbe8+7WycC9vrKZfWpeXkUaDBYlNkA7Q1Fge5GTmrXP7vPd0s7KxLigkYR5bUolGR8sNi8yQVBmb3F+mLvd18vS2t7Pu62mnpFuTT05OCYaIzZGUVBbco+orrjP5Ondy8XAtqaMd2ZXPiIVHiw6PkFPY36OlqrO6ezb0c/LwKaRhHxiNRkZJSssMUJWZ3J+ncHf4t3b19LBsJ6Rf104Ih8lJyYyQ1dncoqqzt/d3tvVxrall4VpRCgeHyYoMUFSaHSJqs7j49zY0sS0n453WzweFh0sNDtJYn+WqMLf5+LQu6OOhn93cW9qaGZlZWRnZmlpbW5xcnR3eHt7fn6BgIKDhIWFh4aIh4mIiIiIh4aHhYaDhIOEg4ODg4SCg4KCgIKAgH9/fn19e3x6e3p8e3x8fH19fnx9fH18fHx6e3p7ent7e3x8fnx+fX5+fn99f31+fn6AfoB/gYCAgH+AfoB/gIB/gH+BgIKCg4SDhIKDgYKCgoKBgoCCgYKCgoOCg4KDgoODgoOBgoGCgYKCgYKAgYCBgIGBgIGAgYCBgIGBgYGAgX+Bf4CAgYGAgX+AfoB+gH+AgICAf4B/gH+BgICAf4F/gH5/fn9/f4B/gH+AfoB+gH+AgH+AfoB+gH+BgIGAgIB/gYCCgIGAgYGAgYCBgIKAgYGBgYCBgIKBgYGAgoCCgIGBgYKBgoCBgIGBgIKAgoCBgIGBgIGAgYCBgQA=';
  k.asset.memearrow = 'data:image/png;base64,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';
  
  qr.spawn = function(){

    qr.css = {};
      
      qr.css.yotsubaa = '\
      .kqr{\
        position:fixed;\
        background:#FFFFEE;\
        border:1px solid;\
        top:50px;\
        left:calc(100% - 350px);\
      }\
      .kqr-comment{\
        width:300px;\
        height:75px;\
        background:#F0E0D6;\
        max-width:100%;\
        color:#800000;\
        max-width:100% !important;\
      }\
      .default-backdrop{\
        background:#FFFFEE;\
      }\
      .kqr-postbutton{\
        float:right;\
      }\
      .kqr-personafield{\
        width:75px;\
        background:#F0E0D6;\
        color:#800000;\
        font-size:11px !important;\
        max-width:100% !important;\
      }\
      .kqr-handle{\
        background:#800000;\
        text-align:center;\
        color:#FFFFEE;\
        padding-bottom:2px;\
        margin-bottom:2px;\
        font-size:10pt !important;\
      }\
      .kqr-button{\
        background:#F0E0D6;\
        color:#800000;\
      }\
      .kqr-leftopts{\
        float:left;\
      }\
      .kqr-rightopts{\
        float:right;\
      }\
      .kqr-checkbox{\
        margin-top:-0px;\
      }\
      .kqr-close{\
        color:#FFFFEE;\
        margin-right:5px;\
      }\
      .kqr-link{\
        cursor:pointer;\
      }\
      .kqr-fileinput{\
        max-width:175px;\
      }\
      .kqr-fileclear{\
      }\
      .add_image{\
        display:none !important;\
      }\
      .menu-button{\
        display:none !important;\
      }\
      .kqr-you{\
        text-decoration:underline;\
      }\
      .kqr-embedinput{\
        background:#F0E0D6;\
        color:#800000;\
        font-size:11px !important;\
      }\
      #k-chanmenu{\
        background:#F0E0D6;\
      }\
    ';
    
     qr.css.yotsubab = '\
      .kqr{\
        position:fixed;\
        background:#eef2ff;\
        border:1px solid;\
        top:50px;\
        left:calc(100% - 350px);\
      }\
      .default-backdrop{\
        background:#eef2ff;\
      }\
      .kqr-comment{\
        width:300px;\
        height:75px;\
        background:#D6DAF0;\
        max-width:100%;\
        color:black;\
      }\
      .kqr-postbutton{\
        float:right;\
      }\
      .kqr-personafield{\
        width:75px;\
        background:#D6DAF0;\
        color:black;\
        font-size:11px !important;\
        max-width:100% !important;\
      }\
      .kqr-handle{\
        background:#98e;\
        text-align:center;\
        color:black;\
        padding-bottom:2px;\
        margin-bottom:2px;\
        font-size:10pt !important;\
      }\
      .kqr-button{\
        background:#D6DAF0;\
        color:black;\
      }\
      .kqr-leftopts{\
        float:left;\
      }\
      .kqr-rightopts{\
        float:right;\
      }\
      .kqr-checkbox{\
        margin-top:-0px;\
      }\
      .kqr-close{\
        color:#eef2ff;\
        margin-right:5px;\
      }\
      .kqr-link{\
        cursor:pointer;\
      }\
      .kqr-fileinput{\
        max-width:175px;\
      }\
      .kqr-fileclear{\
      }\
      .add_image{\
        display:none !important;\
      }\
      .menu-button{\
        display:none !important;\
      }\
      .kqr-you{\
        text-decoration:underline;\
      }\
      .kqr-embedinput{\
        background:#D6DAF0;\
        color:black;\
        font-size:11px !important;\
      }\
      #k-chanmenu{\
        background:#D6DAF0;\
      }\
    ';
    
    qr.css.tomorrow = '\
      .kqr{\
        position:fixed;\
        background:#1d1f21;\
        border:1px solid;\
        top:50px;\
        left:calc(100% - 350px);\
      }\
      .default-backdrop{\
        background:#1d1f21;\
      }\
      .kqr-comment{\
        width:300px;\
        height:75px;\
        background:#282a2e;\
        max-width:100%;\
        color:#c5c8c6;\
      }\
      .kqr-postbutton{\
        float:right;\
      }\
      .kqr-personafield{\
        width:75px;\
        background:#282a2e;\
        color:#c5c8c6;\
        font-size:11px !important;\
        max-width:100% !important;\
      }\
      .kqr-handle{\
        background:#282a2e;\
        text-align:center;\
        color:#c5c8c6;\
        padding-bottom:2px;\
        margin-bottom:2px;\
        font-size:10pt !important;\
      }\
      .kqr-button{\
        background:#282a2e;\
        color:#c5c8c6;\
      }\
      .kqr-leftopts{\
        float:left;\
      }\
      .kqr-rightopts{\
        float:right;\
      }\
      .kqr-checkbox{\
        margin-top:-0px;\
      }\
      .kqr-close{\
        color#1d1f21;\
        margin-right:5px;\
      }\
      .kqr-link{\
        cursor:pointer;\
      }\
      .kqr-fileinput{\
        max-width:175px;\
      }\
      .kqr-fileclear{\
      }\
      .add_image{\
        display:none !important;\
      }\
      .menu-button{\
        display:none !important;\
      }\
      .kqr-you{\
        text-decoration:underline;\
      }\
      .kqr-embedinput{\
        background:#282a2e;\
        color:#c5c8c6;\
        font-size:11px !important;\
      }\
      #k-chanmenu{\
        background:#282a2e;\
      }\
    ';
    
   qr.css.photon = '\
      .kqr{\
        position:fixed;\
        background:#eeeeee;\
        border:1px solid;\
        top:50px;\
        left:calc(100% - 350px);\
      }\
      .default-backdrop{\
        background:#eeeeee;\
      }\
      .kqr-comment{\
        width:300px;\
        height:75px;\
        background:#dddddd;\
        max-width:100%;\
        color:#333333;\
      }\
      .kqr-postbutton{\
        float:right;\
      }\
      .kqr-personafield{\
        width:75px;\
        background:#dddddd;\
        color:#333333;\
        font-size:11px !important;\
        max-width:100% !important;\
      }\
      .kqr-handle{\
        background:#eeeeee;\
        text-align:center;\
        color:#333333;\
        padding-bottom:2px;\
        margin-bottom:2px;\
        font-size:10pt !important;\
      }\
      .kqr-button{\
        background:#dddddd;\
        color:#333333;\
      }\
      .kqr-leftopts{\
        float:left;\
      }\
      .kqr-rightopts{\
        float:right;\
      }\
      .kqr-checkbox{\
        margin-top:-0px;\
      }\
      .kqr-close{\
        color:#333333;\
        margin-right:5px;\
      }\
      .kqr-link{\
        cursor:pointer;\
      }\
      .kqr-fileinput{\
        max-width:175px;\
      }\
      .kqr-fileclear{\
      }\
      .add_image{\
        display:none !important;\
      }\
      .menu-button{\
        display:none !important;\
      }\
      .kqr-you{\
        text-decoration:underline;\
      }\
      .kqr-embedinput{\
        background:#dddddd;\
        color:#333333;\
        font-size:11px !important;\
      }\
      #k-chanmenu{\
        background:#dddddd;\
      }\
    ';
    
    qr.css.dark = '\
      .kqr{\
        position:fixed;\
        background:#1d1f21;\
        border:1px solid;\
        top:50px;\
        left:calc(100% - 350px);\
      }\
      .default-backdrop{\
        background:#1d1f21;\
      }\
      .kqr-comment{\
        width:300px;\
        height:75px;\
        background:#282a2e;\
        max-width:100% !important;\
        color:#c5c8c6;\
      }\
      .kqr-postbutton{\
        float:right;\
      }\
      .kqr-personafield{\
        width:75px;\
        max-width:100% !important;\
        background:#282a2e;\
        color:#c5c8c6;\
        font-size:11px !important;\
        padding-left:0px !important;\
      }\
      .kqr-handle{\
        background:#282a2e;\
        text-align:center;\
        color:#c5c8c6;\
        padding-bottom:2px;\
        margin-bottom:4px;\
        font-size:10pt !important;\
      }\
      .kqr-button{\
        background:#282a2e;\
        color:#c5c8c6;\
      }\
      .kqr-leftopts{\
        float:left;\
      }\
      .kqr-rightopts{\
        float:right;\
      }\
      .kqr-checkbox{\
        margin-top:-0px;\
      }\
      .kqr-close{\
        color#1d1f21;\
        margin-right:5px;\
      }\
      .kqr-link{\
        cursor:pointer;\
      }\
      .kqr-fileinput{\
        max-width:175px;\
      }\
      .kqr-fileclear{\
      }\
      .add_image{\
        display:none !important;\
      }\
      .menu-button{\
        display:none !important;\
      }\
      .kqr-you{\
        text-decoration:underline;\
      }\
      .kqr-embedinput{\
        background:#282a2e;\
        color:#c5c8c6;\
        font-size:11px !important;\
      }\
      #k-chanmenu{\
        background:#282a2e;\
      }\
    ';
    
    qr.css.elm = $.css('{}');
    
    page.initStoredStyle = function(){
      $.destroy(qr.css.elm);
      if($.getVal('stored.style', 'yotsubab') == 'yotsubab'){
        qr.css.elm = $.css(qr.css.yotsubab);
      }else if($.getVal('stored.style', 'yotsubab') == 'yotsubaa'){
        qr.css.elm = $.css(qr.css.yotsubaa);
      }else if($.getVal('stored.style', 'yotsubab') == 'tomorrow'){
        qr.css.elm = $.css(qr.css.tomorrow);
      }else if($.getVal('stored.style', 'yotsubab') == 'photon'){
        qr.css.elm = $.css(qr.css.photon);
      }else if($.getVal('stored.style', 'yotsubab') == 'dark'){
        qr.css.elm = $.css(qr.css.dark);
      }else{
        qr.css.elm = $.css(qr.css.yotsubab);
      }
      
    }
    
    page.updateStyle = function(){
      $.destroy(qr.css.elm);
      if($('#stylechooser').value == "Yotsuba"){
        $.setVal('stored.style', 'yotsubaa');
        qr.css.elm = $.css(qr.css.yotsubaa);
      }else if($('#stylechooser').value == "Tomorrow"){
        $.setVal('stored.style', 'tomorrow');
        qr.css.elm = $.css(qr.css.tomorrow);
      }else if($('#stylechooser').value == "Photon"){
        $.setVal('stored.style', 'photon');
        qr.css.elm = $.css(qr.css.photon);
      }else if($('#stylechooser').value == "Dark"){
        $.setVal('stored.style', 'dark');
        qr.css.elm = $.css(qr.css.dark);
      }else{
        $.setVal('stored.style', 'yotsubab');
        qr.css.elm = $.css(qr.css.yotsubab);
      }
    }
    page.initStoredStyle();
    
    page.applyKMenu = function(){
      
      $.css('#options_div{ height: 400px !important; }');
      
      var $tabCont = {};
        $tabCont['id'] = 'ekTabCont';
        $tabCont['class'] = 'options_tab';
        $tabCont = $.elm('div', $tabCont, $('#options_div'));
        $.htm($tabCont, '<h2>8k Settings</h2><hr>\
          <div id="ekTab-list"></div><hr>\
          <div style="text-align:center;">[8k version ' + version + ']</div>\
        ');
      
        var $tabAddCheck = function(ti, sv, iv){
          if(!iv){
            var iv = 'true';
          }
          $tEl = {};
          $tEl['class'] = 'kqr-setting-p';
          $tEl = $.elm('p', $tEl, $('#ekTab-list'));
          $.htm($tEl, '<input type = "checkbox" id="kqr-setbox-' + sv + '">- ' + ti);
          if($.getVal('kqr.' + sv, iv) == 'true'){
            $('#kqr-setbox-' + sv).checked = true;            
          }else{
            $('#kqr-setbox-' + sv).checked = false;
          }
          $('#kqr-setbox-' + sv).addEventListener('change', function(){
            if($('#kqr-setbox-' + sv).checked == true){
              $.setVal('kqr.' + sv, 'true');
            }else{
              $.setVal('kqr.' + sv, 'false');
            }            
          }, false);
        }
        
        var $tabAddIntager = function(ti, sv, iv){
          if(!iv){
            var iv = '0';
          }
          $tEl = {};
          $tEl['class'] = 'kqr-setting-p';
          $tEl = $.elm('p', $tEl, $('#ekTab-list'));
          $.htm($tEl, '<input id="kqr-setintager-' + sv + '" style="width:20px;">- ' + ti);
          $('#kqr-setintager-' + sv).value = $.getVal('kqr.' + sv, iv);
          $('#kqr-setintager-' + sv).addEventListener('input', function(){
            $.setVal('kqr.' + sv, $('#kqr-setintager-' + sv).value);    
          }, false);
        }
        
      
        
        $tabAddCheck('Add sauce links to images', 'addSauce');
        $tabAddCheck('Enable desktop notifications', 'desktopNotes');
        $tabAddCheck('Play sound on desktop notification', 'noteAudio', 'false');
        $tabAddIntager('Close notification after x seconds (0 for default)', 'noteTime');
        $tabAddCheck('Auto retry posting on status error', 'autoError');
        
        $tabCont.style.display = 'none';
      
        var $tabIcon = {};
        $tabIcon['id'] = 'ekTabIcon';
        $tabIcon['class'] = 'options_tab_icon';
        $tabIcon = $.elm('div', $tabIcon, $('#options_tablist'));
        $.htm($tabIcon, '<div class="options_tab_icon" id="kTabIconPar" style="cursor:ponter;"><img src="' + k.asset.optionsIcon + '"><div>8k Options</div></div>');
        
        $.each($$('.options_tab_icon'), function(ti, tii){
          if(ti.id != 'ekTabIcon'){
            ti.addEventListener('click', function(){
              $tabCont.style.display = 'none';
              if($tabIcon.className.indexOf('active') > 1){
                $tabIcon.className = $tabIcon.className.split(' active')[0];
              }
            }, false);
          }
        });  
      
        $('#kTabIconPar').addEventListener('click', function(){
          $.each($$('.options_tab'), function(ta, tai){
            ta.style.display = "none";
          });
          $.each($$('.options_tab_icon'), function(txa, txai){
            if(txa.className.indexOf('active') > 1){
              txa.className = txa.className.split(' active')[0];
            }
          });
          if($tabIcon.className.indexOf('active') < 1){
             $tabIcon.className += ' active';
          }
          $tabCont.style.display = '';
        }, false);
    }
    
    $.time(2000, function(){
      if($('[title="Options"]', d)){
        $('[title="Options"]', d).addEventListener('click', function(){ 
          $('#stylechooser').addEventListener('change', function(){    
            page.updateStyle();
          }, false);
        }, false);
        page.applyKMenu();
      }
    }, false);
    
    
    
    
    /*--------------------------------------------------*/
    

      function validateTrip(tc){
          !function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.tripcode=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};
          t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){var crypt=_dereq_("./lib/crypt");var htmlEscape=_dereq_("./lib/html-escape");var sjisconv=_dereq_("./lib/sjisconv");var SALT_TABLE=".............................................../0123456789A"+"BCDEFGABCDEFGHIJKLMNOPQRSTUVWXYZabcdefabcdefghijklmnopqrstuvwxyz.........."+".........................................................................."+".................................................";
          function sjis(str){var encoded="";var index=-1;var length=str.length;while(++index<length){var character=sjisconv[String.fromCharCode(str.charCodeAt(index))];if(character)encoded+=character}return encoded}module.exports=function(key){key=sjis(key);key=htmlEscape(key);if(!key.length)return"";var salt="";var index=0;while(index++<2){salt+=SALT_TABLE[(key+"H.").charCodeAt(index)%256]}return crypt(key,salt).substring(3)}},{"./lib/crypt":2,"./lib/html-escape":3,"./lib/sjisconv":4}],2:[function(_dereq_,module,exports){var IP=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
          var FP=[40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];var PC1_C=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36];var PC1_D=[63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];var shifts=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];var PC2_C=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2];var PC2_D=[41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
          var C=[];var D=[];var KS=[];for(var i=0;i<16;++i){KS[i]=[]}function setkey(key){var i,j,k,t;for(i=0;i<28;i++){C[i]=key[PC1_C[i]-1];D[i]=key[PC1_D[i]-1]}for(i=0;i<16;i++){for(k=0;k<shifts[i];k++){t=C[0];for(j=0;j<28-1;j++)C[j]=C[j+1];C[27]=t;t=D[0];for(j=0;j<28-1;j++)D[j]=D[j+1];D[27]=t}for(j=0;j<24;j++){KS[i][j]=C[PC2_C[j]-1];KS[i][j+24]=D[PC2_D[j]-28-1]}}}var E=[];var e=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
          var S=[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]];
          var P=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];var L=[],R=[];var tempL=[[]];var f=[];var preS=[];function encrypt(block,edflag){var i,ii,j,k,t;var perm=[];for(j=0;j<64;j++){perm[j]=block[IP[j]-1]}for(j=0;j<32;++j){L[j]=perm[j];R[j]=perm[j+32]}for(ii=0;ii<16;ii++){if(edflag)i=15-ii;else i=ii;for(j=0;j<32;j++)tempL[j]=R[j];for(j=0;j<48;j++)preS[j]=R[E[j]-1]^KS[i][j];for(j=0;j<8;j++){t=6*j;k=S[j][(preS[t+0]<<5)+(preS[t+1]<<3)+(preS[t+2]<<2)+(preS[t+3]<<1)+(preS[t+4]<<0)+(preS[t+5]<<4)];
          t=4*j;f[t+0]=k>>3&1;f[t+1]=k>>2&1;f[t+2]=k>>1&1;f[t+3]=k>>0&1}for(j=0;j<32;j++)R[j]=L[j]^f[P[j]-1];for(j=0;j<32;j++)L[j]=tempL[j]}for(j=0;j<32;j++){t=L[j];L[j]=R[j];R[j]=t}for(j=0;j<32;++j){perm[j]=L[j];perm[j+32]=R[j]}for(j=0;j<64;j++){block[j]=perm[FP[j]-1]}}var strToBytes=function(str){var i,x=[];for(i=0;i<str.length;++i){x[i]=str.charCodeAt(i)}return x};var bytesToStr=function(bytes){return String.fromCharCode.apply(String,bytes)};function crypt(pw,salt,returnBytes){if(typeof pw==="string")pw=strToBytes(pw);
          if(typeof salt==="string")salt=strToBytes(salt);var i,j,k,c,temp;var block=[],iobuf=[];for(i=0;i<66;i++)block[i]=0;for(i=0,k=0;(c=pw[k])&&i<64;++k){for(j=0;j<7;j++,i++)block[i]=c>>6-j&1;i++}setkey(block);for(i=0;i<66;i++)block[i]=0;for(i=0;i<48;i++)E[i]=e[i];for(i=0,k=0;i<2;i++,++k){c=salt[k];iobuf[i]=c;if(c>"Z".charCodeAt(0))c-=6;if(c>"9".charCodeAt(0))c-=7;c-=".".charCodeAt(0);for(j=0;j<6;j++){if(c>>j&1){temp=E[6*i+j];E[6*i+j]=E[6*i+j+24];E[6*i+j+24]=temp}}}for(i=0;i<25;i++)encrypt(block,0);for(i=0;i<11;i++){c=0;
          for(j=0;j<6;j++){c<<=1;c|=block[6*i+j]}c+=".".charCodeAt(0);if(c>"9".charCodeAt(0))c+=7;if(c>"Z".charCodeAt(0))c+=6;iobuf[i+2]=c}if(iobuf[1]==0)iobuf[1]=iobuf[0];if(returnBytes)return iobuf;else return bytesToStr(iobuf)}module.exports=crypt},{}],3:[function(_dereq_,module,exports){var escapeMap={"&":"&amp;","<":"&lt;",'"':"&quot;",">":"&gt;"};module.exports=function(str){return str.replace(/[&<>"]/g,function(c){return escapeMap[c]})}},{}],4:[function(_dereq_,module,exports){var SAME_IN_SJIS=[" ","!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~",""];
          var sjisconv={};var i=SAME_IN_SJIS.length;while(i--){var value=SAME_IN_SJIS[i];sjisconv[value]=value}sjisconv["\xa2"]="\x81\x91";sjisconv["\xa3"]="\x81\x92";sjisconv["\xa7"]="\x81\x98";sjisconv["\xa8"]="\x81N";sjisconv["\xac"]="\x81\xca";sjisconv["\xb0"]="\x81\x8b";sjisconv["\xb1"]="\x81}";sjisconv["\xb4"]="\x81L";sjisconv["\xb6"]="\x81\xf7";sjisconv["\xd7"]="\x81~";sjisconv["\xf7"]="\x81\x80";sjisconv["\u0391"]="\x83\x9f";sjisconv["\u0392"]="\x83\xa0";sjisconv["\u0393"]="\x83\xa1";sjisconv["\u0394"]="\x83\xa2";
          sjisconv["\u0395"]="\x83\xa3";sjisconv["\u0396"]="\x83\xa4";sjisconv["\u0397"]="\x83\xa5";sjisconv["\u0398"]="\x83\xa6";sjisconv["\u0399"]="\x83\xa7";sjisconv["\u039a"]="\x83\xa8";sjisconv["\u039b"]="\x83\xa9";sjisconv["\u039c"]="\x83\xaa";sjisconv["\u039d"]="\x83\xab";sjisconv["\u039e"]="\x83\xac";sjisconv["\u039f"]="\x83\xad";sjisconv["\u03a0"]="\x83\xae";sjisconv["\u03a1"]="\x83\xaf";sjisconv["\u03a3"]="\x83\xb0";sjisconv["\u03a4"]="\x83\xb1";sjisconv["\u03a5"]="\x83\xb2";sjisconv["\u03a6"]="\x83\xb3";
          sjisconv["\u03a7"]="\x83\xb4";sjisconv["\u03a8"]="\x83\xb5";sjisconv["\u03a9"]="\x83\xb6";sjisconv["\u03b1"]="\x83\xbf";sjisconv["\u03b2"]="\x83\xc0";sjisconv["\u03b3"]="\x83\xc1";sjisconv["\u03b4"]="\x83\xc2";sjisconv["\u03b5"]="\x83\xc3";sjisconv["\u03b6"]="\x83\xc4";sjisconv["\u03b7"]="\x83\xc5";sjisconv["\u03b8"]="\x83\xc6";sjisconv["\u03b9"]="\x83\xc7";sjisconv["\u03ba"]="\x83\xc8";sjisconv["\u03bb"]="\x83\xc9";sjisconv["\u03bc"]="\x83\xca";sjisconv["\u03bd"]="\x83\xcb";sjisconv["\u03be"]="\x83\xcc";
          sjisconv["\u03bf"]="\x83\xcd";sjisconv["\u03c0"]="\x83\xce";sjisconv["\u03c1"]="\x83\xcf";sjisconv["\u03c3"]="\x83\xd0";sjisconv["\u03c4"]="\x83\xd1";sjisconv["\u03c5"]="\x83\xd2";sjisconv["\u03c6"]="\x83\xd3";sjisconv["\u03c7"]="\x83\xd4";sjisconv["\u03c8"]="\x83\xd5";sjisconv["\u03c9"]="\x83\xd6";sjisconv["\u0401"]="\x84F";sjisconv["\u0410"]="\x84@";sjisconv["\u0411"]="\x84A";sjisconv["\u0412"]="\x84B";sjisconv["\u0413"]="\x84C";sjisconv["\u0414"]="\x84D";sjisconv["\u0415"]="\x84E";sjisconv["\u0416"]="\x84G";
          sjisconv["\u0417"]="\x84H";sjisconv["\u0418"]="\x84I";sjisconv["\u0419"]="\x84J";sjisconv["\u041a"]="\x84K";sjisconv["\u041b"]="\x84L";sjisconv["\u041c"]="\x84M";sjisconv["\u041d"]="\x84N";sjisconv["\u041e"]="\x84O";sjisconv["\u041f"]="\x84P";sjisconv["\u0420"]="\x84Q";sjisconv["\u0421"]="\x84R";sjisconv["\u0422"]="\x84S";sjisconv["\u0423"]="\x84T";sjisconv["\u0424"]="\x84U";sjisconv["\u0425"]="\x84V";sjisconv["\u0426"]="\x84W";sjisconv["\u0427"]="\x84X";sjisconv["\u0428"]="\x84Y";sjisconv["\u0429"]="\x84Z";
          sjisconv["\u042a"]="\x84[";sjisconv["\u042b"]="\x84\\";sjisconv["\u042c"]="\x84]";sjisconv["\u042d"]="\x84^";sjisconv["\u042e"]="\x84_";sjisconv["\u042f"]="\x84`";sjisconv["\u0430"]="\x84p";sjisconv["\u0431"]="\x84q";sjisconv["\u0432"]="\x84r";sjisconv["\u0433"]="\x84s";sjisconv["\u0434"]="\x84t";sjisconv["\u0435"]="\x84u";sjisconv["\u0436"]="\x84w";sjisconv["\u0437"]="\x84x";sjisconv["\u0438"]="\x84y";sjisconv["\u0439"]="\x84z";sjisconv["\u043a"]="\x84{";sjisconv["\u043b"]="\x84|";sjisconv["\u043c"]="\x84}";
          sjisconv["\u043d"]="\x84~";sjisconv["\u043e"]="\x84\x80";sjisconv["\u043f"]="\x84\x81";sjisconv["\u0440"]="\x84\x82";sjisconv["\u0441"]="\x84\x83";sjisconv["\u0442"]="\x84\x84";sjisconv["\u0443"]="\x84\x85";sjisconv["\u0444"]="\x84\x86";sjisconv["\u0445"]="\x84\x87";sjisconv["\u0446"]="\x84\x88";sjisconv["\u0447"]="\x84\x89";sjisconv["\u0448"]="\x84\x8a";sjisconv["\u0449"]="\x84\x8b";sjisconv["\u044a"]="\x84\x8c";sjisconv["\u044b"]="\x84\x8d";sjisconv["\u044c"]="\x84\x8e";sjisconv["\u044d"]="\x84\x8f";
          sjisconv["\u044e"]="\x84\x90";sjisconv["\u044f"]="\x84\x91";sjisconv["\u0451"]="\x84v";sjisconv["\u2010"]="\x81]";sjisconv["\u2015"]="\x81\\";sjisconv["\u2016"]="\x81a";sjisconv["\u2018"]="\x81e";sjisconv["\u2019"]="\x81f";sjisconv["\u201c"]="\x81g";sjisconv["\u201d"]="\x81h";sjisconv["\u2020"]="\x81\xf5";sjisconv["\u2021"]="\x81\xf6";sjisconv["\u2025"]="\x81d";sjisconv["\u2026"]="\x81c";sjisconv["\u2030"]="\x81\xf1";sjisconv["\u2032"]="\x81\x8c";sjisconv["\u2033"]="\x81\x8d";sjisconv["\u203b"]="\x81\xa6";
          sjisconv["\u2103"]="\x81\x8e";sjisconv["\u212b"]="\x81\xf0";sjisconv["\u2190"]="\x81\xa9";sjisconv["\u2191"]="\x81\xaa";sjisconv["\u2192"]="\x81\xa8";sjisconv["\u2193"]="\x81\xab";sjisconv["\u21d2"]="\x81\xcb";sjisconv["\u21d4"]="\x81\xcc";sjisconv["\u2200"]="\x81\xcd";sjisconv["\u2202"]="\x81\xdd";sjisconv["\u2203"]="\x81\xce";sjisconv["\u2207"]="\x81\xde";sjisconv["\u2208"]="\x81\xb8";sjisconv["\u220b"]="\x81\xb9";sjisconv["\u2212"]="\x81|";sjisconv["\u221a"]="\x81\xe3";sjisconv["\u221d"]="\x81\xe5";
          sjisconv["\u221e"]="\x81\x87";sjisconv["\u2220"]="\x81\xda";sjisconv["\u2227"]="\x81\xc8";sjisconv["\u2228"]="\x81\xc9";sjisconv["\u2229"]="\x81\xbf";sjisconv["\u222a"]="\x81\xbe";sjisconv["\u222b"]="\x81\xe7";sjisconv["\u222c"]="\x81\xe8";sjisconv["\u2234"]="\x81\x88";sjisconv["\u2235"]="\x81\xe6";sjisconv["\u223d"]="\x81\xe4";sjisconv["\u2252"]="\x81\xe0";sjisconv["\u2260"]="\x81\x82";sjisconv["\u2261"]="\x81\xdf";sjisconv["\u2266"]="\x81\x85";sjisconv["\u2267"]="\x81\x86";sjisconv["\u226a"]="\x81\xe1";
          sjisconv["\u226b"]="\x81\xe2";sjisconv["\u2282"]="\x81\xbc";sjisconv["\u2283"]="\x81\xbd";sjisconv["\u2286"]="\x81\xba";sjisconv["\u2287"]="\x81\xbb";sjisconv["\u22a5"]="\x81\xdb";sjisconv["\u2312"]="\x81\xdc";sjisconv["\u2500"]="\x84\x9f";sjisconv["\u2501"]="\x84\xaa";sjisconv["\u2502"]="\x84\xa0";sjisconv["\u2503"]="\x84\xab";sjisconv["\u250c"]="\x84\xa1";sjisconv["\u250f"]="\x84\xac";sjisconv["\u2510"]="\x84\xa2";sjisconv["\u2513"]="\x84\xad";sjisconv["\u2514"]="\x84\xa4";sjisconv["\u2517"]="\x84\xaf";
          sjisconv["\u2518"]="\x84\xa3";sjisconv["\u251b"]="\x84\xae";sjisconv["\u251c"]="\x84\xa5";sjisconv["\u251d"]="\x84\xba";sjisconv["\u2520"]="\x84\xb5";sjisconv["\u2523"]="\x84\xb0";sjisconv["\u2524"]="\x84\xa7";sjisconv["\u2525"]="\x84\xbc";sjisconv["\u2528"]="\x84\xb7";sjisconv["\u252b"]="\x84\xb2";sjisconv["\u252c"]="\x84\xa6";sjisconv["\u252f"]="\x84\xb6";sjisconv["\u2530"]="\x84\xbb";sjisconv["\u2533"]="\x84\xb1";sjisconv["\u2534"]="\x84\xa8";sjisconv["\u2537"]="\x84\xb8";sjisconv["\u2538"]="\x84\xbd";
          sjisconv["\u253b"]="\x84\xb3";sjisconv["\u253c"]="\x84\xa9";sjisconv["\u253f"]="\x84\xb9";sjisconv["\u2542"]="\x84\xbe";sjisconv["\u254b"]="\x84\xb4";sjisconv["\u25a0"]="\x81\xa1";sjisconv["\u25a1"]="\x81\xa0";sjisconv["\u25b2"]="\x81\xa3";sjisconv["\u25b3"]="\x81\xa2";sjisconv["\u25bc"]="\x81\xa5";sjisconv["\u25bd"]="\x81\xa4";sjisconv["\u25c6"]="\x81\x9f";sjisconv["\u25c7"]="\x81\x9e";sjisconv["\u25cb"]="\x81\x9b";sjisconv["\u25ce"]="\x81\x9d";sjisconv["\u25cf"]="\x81\x9c";sjisconv["\u25ef"]="\x81\xfc";
          sjisconv["\u2605"]="\x81\x9a";sjisconv["\u2606"]="\x81\x99";sjisconv["\u2640"]="\x81\x8a";sjisconv["\u2642"]="\x81\x89";sjisconv["\u266a"]="\x81\xf4";sjisconv["\u266d"]="\x81\xf3";sjisconv["\u266f"]="\x81\xf2";sjisconv["\u3000"]="\x81@";sjisconv["\u3001"]="\x81A";sjisconv["\u3002"]="\x81B";sjisconv["\u3003"]="\x81V";sjisconv["\u3005"]="\x81X";sjisconv["\u3006"]="\x81Y";sjisconv["\u3007"]="\x81Z";sjisconv["\u3008"]="\x81q";sjisconv["\u3009"]="\x81r";sjisconv["\u300a"]="\x81s";sjisconv["\u300b"]="\x81t";
          sjisconv["\u300c"]="\x81u";sjisconv["\u300d"]="\x81v";sjisconv["\u300e"]="\x81w";sjisconv["\u300f"]="\x81x";sjisconv["\u3010"]="\x81y";sjisconv["\u3011"]="\x81z";sjisconv["\u3012"]="\x81\xa7";sjisconv["\u3013"]="\x81\xac";sjisconv["\u3014"]="\x81k";sjisconv["\u3015"]="\x81l";sjisconv["\u301c"]="\x81`";sjisconv["\u3041"]="\x82\x9f";sjisconv["\u3042"]="\x82\xa0";sjisconv["\u3043"]="\x82\xa1";sjisconv["\u3044"]="\x82\xa2";sjisconv["\u3045"]="\x82\xa3";sjisconv["\u3046"]="\x82\xa4";sjisconv["\u3047"]="\x82\xa5";
          sjisconv["\u3048"]="\x82\xa6";sjisconv["\u3049"]="\x82\xa7";sjisconv["\u304a"]="\x82\xa8";sjisconv["\u304b"]="\x82\xa9";sjisconv["\u304c"]="\x82\xaa";sjisconv["\u304d"]="\x82\xab";sjisconv["\u304e"]="\x82\xac";sjisconv["\u304f"]="\x82\xad";sjisconv["\u3050"]="\x82\xae";sjisconv["\u3051"]="\x82\xaf";sjisconv["\u3052"]="\x82\xb0";sjisconv["\u3053"]="\x82\xb1";sjisconv["\u3054"]="\x82\xb2";sjisconv["\u3055"]="\x82\xb3";sjisconv["\u3056"]="\x82\xb4";sjisconv["\u3057"]="\x82\xb5";sjisconv["\u3058"]="\x82\xb6";
          sjisconv["\u3059"]="\x82\xb7";sjisconv["\u305a"]="\x82\xb8";sjisconv["\u305b"]="\x82\xb9";sjisconv["\u305c"]="\x82\xba";sjisconv["\u305d"]="\x82\xbb";sjisconv["\u305e"]="\x82\xbc";sjisconv["\u305f"]="\x82\xbd";sjisconv["\u3060"]="\x82\xbe";sjisconv["\u3061"]="\x82\xbf";sjisconv["\u3062"]="\x82\xc0";sjisconv["\u3063"]="\x82\xc1";sjisconv["\u3064"]="\x82\xc2";sjisconv["\u3065"]="\x82\xc3";sjisconv["\u3066"]="\x82\xc4";sjisconv["\u3067"]="\x82\xc5";sjisconv["\u3068"]="\x82\xc6";sjisconv["\u3069"]="\x82\xc7";
          sjisconv["\u306a"]="\x82\xc8";sjisconv["\u306b"]="\x82\xc9";sjisconv["\u306c"]="\x82\xca";sjisconv["\u306d"]="\x82\xcb";sjisconv["\u306e"]="\x82\xcc";sjisconv["\u306f"]="\x82\xcd";sjisconv["\u3070"]="\x82\xce";sjisconv["\u3071"]="\x82\xcf";sjisconv["\u3072"]="\x82\xd0";sjisconv["\u3073"]="\x82\xd1";sjisconv["\u3074"]="\x82\xd2";sjisconv["\u3075"]="\x82\xd3";sjisconv["\u3076"]="\x82\xd4";sjisconv["\u3077"]="\x82\xd5";sjisconv["\u3078"]="\x82\xd6";sjisconv["\u3079"]="\x82\xd7";sjisconv["\u307a"]="\x82\xd8";
          sjisconv["\u307b"]="\x82\xd9";sjisconv["\u307c"]="\x82\xda";sjisconv["\u307d"]="\x82\xdb";sjisconv["\u307e"]="\x82\xdc";sjisconv["\u307f"]="\x82\xdd";sjisconv["\u3080"]="\x82\xde";sjisconv["\u3081"]="\x82\xdf";sjisconv["\u3082"]="\x82\xe0";sjisconv["\u3083"]="\x82\xe1";sjisconv["\u3084"]="\x82\xe2";sjisconv["\u3085"]="\x82\xe3";sjisconv["\u3086"]="\x82\xe4";sjisconv["\u3087"]="\x82\xe5";sjisconv["\u3088"]="\x82\xe6";sjisconv["\u3089"]="\x82\xe7";sjisconv["\u308a"]="\x82\xe8";sjisconv["\u308b"]="\x82\xe9";
          sjisconv["\u308c"]="\x82\xea";sjisconv["\u308d"]="\x82\xeb";sjisconv["\u308e"]="\x82\xec";sjisconv["\u308f"]="\x82\xed";sjisconv["\u3090"]="\x82\xee";sjisconv["\u3091"]="\x82\xef";sjisconv["\u3092"]="\x82\xf0";sjisconv["\u3093"]="\x82\xf1";sjisconv["\u309b"]="\x81J";sjisconv["\u309c"]="\x81K";sjisconv["\u309d"]="\x81T";sjisconv["\u309e"]="\x81U";sjisconv["\u30a1"]="\x83@";sjisconv["\u30a2"]="\x83A";sjisconv["\u30a3"]="\x83B";sjisconv["\u30a4"]="\x83C";sjisconv["\u30a5"]="\x83D";sjisconv["\u30a6"]="\x83E";
          sjisconv["\u30a7"]="\x83F";sjisconv["\u30a8"]="\x83G";sjisconv["\u30a9"]="\x83H";sjisconv["\u30aa"]="\x83I";sjisconv["\u30ab"]="\x83J";sjisconv["\u30ac"]="\x83K";sjisconv["\u30ad"]="\x83L";sjisconv["\u30ae"]="\x83M";sjisconv["\u30af"]="\x83N";sjisconv["\u30b0"]="\x83O";sjisconv["\u30b1"]="\x83P";sjisconv["\u30b2"]="\x83Q";sjisconv["\u30b3"]="\x83R";sjisconv["\u30b4"]="\x83S";sjisconv["\u30b5"]="\x83T";sjisconv["\u30b6"]="\x83U";sjisconv["\u30b7"]="\x83V";sjisconv["\u30b8"]="\x83W";sjisconv["\u30b9"]="\x83X";
          sjisconv["\u30ba"]="\x83Y";sjisconv["\u30bb"]="\x83Z";sjisconv["\u30bc"]="\x83[";sjisconv["\u30bd"]="\x83\\";sjisconv["\u30be"]="\x83]";sjisconv["\u30bf"]="\x83^";sjisconv["\u30c0"]="\x83_";sjisconv["\u30c1"]="\x83`";sjisconv["\u30c2"]="\x83a";sjisconv["\u30c3"]="\x83b";sjisconv["\u30c4"]="\x83c";sjisconv["\u30c5"]="\x83d";sjisconv["\u30c6"]="\x83e";sjisconv["\u30c7"]="\x83f";sjisconv["\u30c8"]="\x83g";sjisconv["\u30c9"]="\x83h";sjisconv["\u30ca"]="\x83i";sjisconv["\u30cb"]="\x83j";sjisconv["\u30cc"]="\x83k";
          sjisconv["\u30cd"]="\x83l";sjisconv["\u30ce"]="\x83m";sjisconv["\u30cf"]="\x83n";sjisconv["\u30d0"]="\x83o";sjisconv["\u30d1"]="\x83p";sjisconv["\u30d2"]="\x83q";sjisconv["\u30d3"]="\x83r";sjisconv["\u30d4"]="\x83s";sjisconv["\u30d5"]="\x83t";sjisconv["\u30d6"]="\x83u";sjisconv["\u30d7"]="\x83v";sjisconv["\u30d8"]="\x83w";sjisconv["\u30d9"]="\x83x";sjisconv["\u30da"]="\x83y";sjisconv["\u30db"]="\x83z";sjisconv["\u30dc"]="\x83{";sjisconv["\u30dd"]="\x83|";sjisconv["\u30de"]="\x83}";sjisconv["\u30df"]="\x83~";
          sjisconv["\u30e0"]="\x83\x80";sjisconv["\u30e1"]="\x83\x81";sjisconv["\u30e2"]="\x83\x82";sjisconv["\u30e3"]="\x83\x83";sjisconv["\u30e4"]="\x83\x84";sjisconv["\u30e5"]="\x83\x85";sjisconv["\u30e6"]="\x83\x86";sjisconv["\u30e7"]="\x83\x87";sjisconv["\u30e8"]="\x83\x88";sjisconv["\u30e9"]="\x83\x89";sjisconv["\u30ea"]="\x83\x8a";sjisconv["\u30eb"]="\x83\x8b";sjisconv["\u30ec"]="\x83\x8c";sjisconv["\u30ed"]="\x83\x8d";sjisconv["\u30ee"]="\x83\x8e";sjisconv["\u30ef"]="\x83\x8f";sjisconv["\u30f0"]="\x83\x90";
          sjisconv["\u30f1"]="\x83\x91";sjisconv["\u30f2"]="\x83\x92";sjisconv["\u30f3"]="\x83\x93";sjisconv["\u30f4"]="\x83\x94";sjisconv["\u30f5"]="\x83\x95";sjisconv["\u30f6"]="\x83\x96";sjisconv["\u30fb"]="\x81E";sjisconv["\u30fc"]="\x81[";sjisconv["\u30fd"]="\x81R";sjisconv["\u30fe"]="\x81S";sjisconv["\u4e00"]="\x88\xea";sjisconv["\u4e01"]="\x92\x9a";sjisconv["\u4e03"]="\x8e\xb5";sjisconv["\u4e07"]="\x96\x9c";sjisconv["\u4e08"]="\x8f\xe4";sjisconv["\u4e09"]="\x8eO";sjisconv["\u4e0a"]="\x8f\xe3";sjisconv["\u4e0b"]="\x89\xba";
          sjisconv["\u4e0d"]="\x95s";sjisconv["\u4e0e"]="\x97^";sjisconv["\u4e10"]="\x98\xa0";sjisconv["\u4e11"]="\x89N";sjisconv["\u4e14"]="\x8a\x8e";sjisconv["\u4e15"]="\x98\xa1";sjisconv["\u4e16"]="\x90\xa2";sjisconv["\u4e17"]="\x99\xc0";sjisconv["\u4e18"]="\x8bu";sjisconv["\u4e19"]="\x95\xb8";sjisconv["\u4e1e"]="\x8f\xe5";sjisconv["\u4e21"]="\x97\xbc";sjisconv["\u4e26"]="\x95\xc0";sjisconv["\u4e2a"]="\x98\xa2";sjisconv["\u4e2d"]="\x92\x86";sjisconv["\u4e31"]="\x98\xa3";sjisconv["\u4e32"]="\x8b\xf8";sjisconv["\u4e36"]="\x98\xa4";
          sjisconv["\u4e38"]="\x8a\xdb";sjisconv["\u4e39"]="\x92O";sjisconv["\u4e3b"]="\x8e\xe5";sjisconv["\u4e3c"]="\x98\xa5";sjisconv["\u4e3f"]="\x98\xa6";sjisconv["\u4e42"]="\x98\xa7";sjisconv["\u4e43"]="\x94T";sjisconv["\u4e45"]="\x8bv";sjisconv["\u4e4b"]="\x94V";sjisconv["\u4e4d"]="\x93\xe1";sjisconv["\u4e4e"]="\x8c\xc1";sjisconv["\u4e4f"]="\x96R";sjisconv["\u4e55"]="\xe5h";sjisconv["\u4e56"]="\x98\xa8";sjisconv["\u4e57"]="\x8f\xe6";sjisconv["\u4e58"]="\x98\xa9";sjisconv["\u4e59"]="\x89\xb3";sjisconv["\u4e5d"]="\x8b\xe3";
          sjisconv["\u4e5e"]="\x8c\xee";sjisconv["\u4e5f"]="\x96\xe7";sjisconv["\u4e62"]="\x9b\xa4";sjisconv["\u4e71"]="\x97\x90";sjisconv["\u4e73"]="\x93\xfb";sjisconv["\u4e7e"]="\x8a\xa3";sjisconv["\u4e80"]="\x8bT";sjisconv["\u4e82"]="\x98\xaa";sjisconv["\u4e85"]="\x98\xab";sjisconv["\u4e86"]="\x97\xb9";sjisconv["\u4e88"]="\x97\\";sjisconv["\u4e89"]="\x91\x88";sjisconv["\u4e8a"]="\x98\xad";sjisconv["\u4e8b"]="\x8e\x96";sjisconv["\u4e8c"]="\x93\xf1";sjisconv["\u4e8e"]="\x98\xb0";sjisconv["\u4e91"]="\x89]";
          sjisconv["\u4e92"]="\x8c\xdd";sjisconv["\u4e94"]="\x8c\xdc";sjisconv["\u4e95"]="\x88\xe4";sjisconv["\u4e98"]="\x98j";sjisconv["\u4e99"]="\x98i";sjisconv["\u4e9b"]="\x8d\xb1";sjisconv["\u4e9c"]="\x88\x9f";sjisconv["\u4e9e"]="\x98\xb1";sjisconv["\u4e9f"]="\x98\xb2";sjisconv["\u4ea0"]="\x98\xb3";sjisconv["\u4ea1"]="\x96S";sjisconv["\u4ea2"]="\x98\xb4";sjisconv["\u4ea4"]="\x8c\xf0";sjisconv["\u4ea5"]="\x88\xe5";sjisconv["\u4ea6"]="\x96\x92";sjisconv["\u4ea8"]="\x8b\x9c";sjisconv["\u4eab"]="\x8b\x9d";
          sjisconv["\u4eac"]="\x8b\x9e";sjisconv["\u4ead"]="\x92\xe0";sjisconv["\u4eae"]="\x97\xba";sjisconv["\u4eb0"]="\x98\xb5";sjisconv["\u4eb3"]="\x98\xb6";sjisconv["\u4eb6"]="\x98\xb7";sjisconv["\u4eba"]="\x90l";sjisconv["\u4ec0"]="\x8fY";sjisconv["\u4ec1"]="\x90m";sjisconv["\u4ec2"]="\x98\xbc";sjisconv["\u4ec4"]="\x98\xba";sjisconv["\u4ec6"]="\x98\xbb";sjisconv["\u4ec7"]="\x8bw";sjisconv["\u4eca"]="\x8d\xa1";sjisconv["\u4ecb"]="\x89\xee";sjisconv["\u4ecd"]="\x98\xb9";sjisconv["\u4ece"]="\x98\xb8";sjisconv["\u4ecf"]="\x95\xa7";
          sjisconv["\u4ed4"]="\x8ee";sjisconv["\u4ed5"]="\x8ed";sjisconv["\u4ed6"]="\x91\xbc";sjisconv["\u4ed7"]="\x98\xbd";sjisconv["\u4ed8"]="\x95t";sjisconv["\u4ed9"]="\x90\xe5";sjisconv["\u4edd"]="\x81W";sjisconv["\u4ede"]="\x98\xbe";sjisconv["\u4edf"]="\x98\xc0";sjisconv["\u4ee3"]="\x91\xe3";sjisconv["\u4ee4"]="\x97\xdf";sjisconv["\u4ee5"]="\x88\xc8";sjisconv["\u4eed"]="\x98\xbf";sjisconv["\u4eee"]="\x89\xbc";sjisconv["\u4ef0"]="\x8b\xc2";sjisconv["\u4ef2"]="\x92\x87";sjisconv["\u4ef6"]="\x8c\x8f";sjisconv["\u4ef7"]="\x98\xc1";
          sjisconv["\u4efb"]="\x94C";sjisconv["\u4f01"]="\x8a\xe9";sjisconv["\u4f09"]="\x98\xc2";sjisconv["\u4f0a"]="\x88\xc9";sjisconv["\u4f0d"]="\x8c\xde";sjisconv["\u4f0e"]="\x8a\xea";sjisconv["\u4f0f"]="\x95\x9a";sjisconv["\u4f10"]="\x94\xb0";sjisconv["\u4f11"]="\x8bx";sjisconv["\u4f1a"]="\x89\xef";sjisconv["\u4f1c"]="\x98\xe5";sjisconv["\u4f1d"]="\x93`";sjisconv["\u4f2f"]="\x94\x8c";sjisconv["\u4f30"]="\x98\xc4";sjisconv["\u4f34"]="\x94\xba";sjisconv["\u4f36"]="\x97\xe0";sjisconv["\u4f38"]="\x90L";sjisconv["\u4f3a"]="\x8ef";
          sjisconv["\u4f3c"]="\x8e\x97";sjisconv["\u4f3d"]="\x89\xbe";sjisconv["\u4f43"]="\x92\xcf";sjisconv["\u4f46"]="\x92A";sjisconv["\u4f47"]="\x98\xc8";sjisconv["\u4f4d"]="\x88\xca";sjisconv["\u4f4e"]="\x92\xe1";sjisconv["\u4f4f"]="\x8fZ";sjisconv["\u4f50"]="\x8d\xb2";sjisconv["\u4f51"]="\x97C";sjisconv["\u4f53"]="\x91\xcc";sjisconv["\u4f55"]="\x89\xbd";sjisconv["\u4f57"]="\x98\xc7";sjisconv["\u4f59"]="\x97]";sjisconv["\u4f5a"]="\x98\xc3";sjisconv["\u4f5b"]="\x98\xc5";sjisconv["\u4f5c"]="\x8d\xec";sjisconv["\u4f5d"]="\x98\xc6";
          sjisconv["\u4f5e"]="\x9bC";sjisconv["\u4f69"]="\x98\xce";sjisconv["\u4f6f"]="\x98\xd1";sjisconv["\u4f70"]="\x98\xcf";sjisconv["\u4f73"]="\x89\xc0";sjisconv["\u4f75"]="\x95\xb9";sjisconv["\u4f76"]="\x98\xc9";sjisconv["\u4f7b"]="\x98\xcd";sjisconv["\u4f7c"]="\x8c\xf1";sjisconv["\u4f7f"]="\x8eg";sjisconv["\u4f83"]="\x8a\xa4";sjisconv["\u4f86"]="\x98\xd2";sjisconv["\u4f88"]="\x98\xca";sjisconv["\u4f8b"]="\x97\xe1";sjisconv["\u4f8d"]="\x8e\x98";sjisconv["\u4f8f"]="\x98\xcb";sjisconv["\u4f91"]="\x98\xd0";
          sjisconv["\u4f96"]="\x98\xd3";sjisconv["\u4f98"]="\x98\xcc";sjisconv["\u4f9b"]="\x8b\x9f";sjisconv["\u4f9d"]="\x88\xcb";sjisconv["\u4fa0"]="\x8b\xa0";sjisconv["\u4fa1"]="\x89\xbf";sjisconv["\u4fab"]="\x9bD";sjisconv["\u4fad"]="\x96\x99";sjisconv["\u4fae"]="\x95\x8e";sjisconv["\u4faf"]="\x8c\xf2";sjisconv["\u4fb5"]="\x90N";sjisconv["\u4fb6"]="\x97\xb5";sjisconv["\u4fbf"]="\x95\xd6";sjisconv["\u4fc2"]="\x8cW";sjisconv["\u4fc3"]="\x91\xa3";sjisconv["\u4fc4"]="\x89\xe2";sjisconv["\u4fca"]="\x8fr";sjisconv["\u4fce"]="\x98\xd7";
          sjisconv["\u4fd0"]="\x98\xdc";sjisconv["\u4fd1"]="\x98\xda";sjisconv["\u4fd4"]="\x98\xd5";sjisconv["\u4fd7"]="\x91\xad";sjisconv["\u4fd8"]="\x98\xd8";sjisconv["\u4fda"]="\x98\xdb";sjisconv["\u4fdb"]="\x98\xd9";sjisconv["\u4fdd"]="\x95\xdb";sjisconv["\u4fdf"]="\x98\xd6";sjisconv["\u4fe1"]="\x90M";sjisconv["\u4fe3"]="\x96\x93";sjisconv["\u4fe4"]="\x98\xdd";sjisconv["\u4fe5"]="\x98\xde";sjisconv["\u4fee"]="\x8fC";sjisconv["\u4fef"]="\x98\xeb";sjisconv["\u4ff3"]="\x94o";sjisconv["\u4ff5"]="\x95U";sjisconv["\u4ff6"]="\x98\xe6";
          sjisconv["\u4ff8"]="\x95\xee";sjisconv["\u4ffa"]="\x89\xb4";sjisconv["\u4ffe"]="\x98\xea";sjisconv["\u5005"]="\x98\xe4";sjisconv["\u5006"]="\x98\xed";sjisconv["\u5009"]="\x91q";sjisconv["\u500b"]="\x8c\xc2";sjisconv["\u500d"]="\x94{";sjisconv["\u500f"]="\xe0\xc5";sjisconv["\u5011"]="\x98\xec";sjisconv["\u5012"]="\x93|";sjisconv["\u5014"]="\x98\xe1";sjisconv["\u5016"]="\x8c\xf4";sjisconv["\u5019"]="\x8c\xf3";sjisconv["\u501a"]="\x98\xdf";sjisconv["\u501f"]="\x8e\xd8";sjisconv["\u5021"]="\x98\xe7";
          sjisconv["\u5023"]="\x95\xed";sjisconv["\u5024"]="\x92l";sjisconv["\u5025"]="\x98\xe3";sjisconv["\u5026"]="\x8c\x91";sjisconv["\u5028"]="\x98\xe0";sjisconv["\u5029"]="\x98\xe8";sjisconv["\u502a"]="\x98\xe2";sjisconv["\u502b"]="\x97\xcf";sjisconv["\u502c"]="\x98\xe9";sjisconv["\u502d"]="\x98`";sjisconv["\u5036"]="\x8b\xe4";sjisconv["\u5039"]="\x8c\x90";sjisconv["\u5043"]="\x98\xee";sjisconv["\u5047"]="\x98\xef";sjisconv["\u5048"]="\x98\xf3";sjisconv["\u5049"]="\x88\xcc";sjisconv["\u504f"]="\x95\xce";
          sjisconv["\u5050"]="\x98\xf2";sjisconv["\u5055"]="\x98\xf1";sjisconv["\u5056"]="\x98\xf5";sjisconv["\u505a"]="\x98\xf4";sjisconv["\u505c"]="\x92\xe2";sjisconv["\u5065"]="\x8c\x92";sjisconv["\u506c"]="\x98\xf6";sjisconv["\u5072"]="\x8e\xc3";sjisconv["\u5074"]="\x91\xa4";sjisconv["\u5075"]="\x92\xe3";sjisconv["\u5076"]="\x8b\xf4";sjisconv["\u5078"]="\x98\xf7";sjisconv["\u507d"]="\x8bU";sjisconv["\u5080"]="\x98\xf8";sjisconv["\u5085"]="\x98\xfa";sjisconv["\u508d"]="\x96T";sjisconv["\u5091"]="\x8c\x86";
          sjisconv["\u5098"]="\x8eP";sjisconv["\u5099"]="\x94\xf5";sjisconv["\u509a"]="\x98\xf9";sjisconv["\u50ac"]="\x8d\xc3";sjisconv["\u50ad"]="\x97b";sjisconv["\u50b2"]="\x98\xfc";sjisconv["\u50b3"]="\x99B";sjisconv["\u50b4"]="\x98\xfb";sjisconv["\u50b5"]="\x8d\xc2";sjisconv["\u50b7"]="\x8f\x9d";sjisconv["\u50be"]="\x8cX";sjisconv["\u50c2"]="\x99C";sjisconv["\u50c5"]="\x8b\xcd";sjisconv["\u50c9"]="\x99@";sjisconv["\u50ca"]="\x99A";sjisconv["\u50cd"]="\x93\xad";sjisconv["\u50cf"]="\x91\x9c";sjisconv["\u50d1"]="\x8b\xa1";
          sjisconv["\u50d5"]="\x96l";sjisconv["\u50d6"]="\x99D";sjisconv["\u50da"]="\x97\xbb";sjisconv["\u50de"]="\x99E";sjisconv["\u50e3"]="\x99H";sjisconv["\u50e5"]="\x99F";sjisconv["\u50e7"]="\x91m";sjisconv["\u50ed"]="\x99G";sjisconv["\u50ee"]="\x99I";sjisconv["\u50f5"]="\x99K";sjisconv["\u50f9"]="\x99J";sjisconv["\u50fb"]="\x95\xc6";sjisconv["\u5100"]="\x8bV";sjisconv["\u5101"]="\x99M";sjisconv["\u5102"]="\x99N";sjisconv["\u5104"]="\x89\xad";sjisconv["\u5109"]="\x99L";sjisconv["\u5112"]="\x8e\xf2";sjisconv["\u5114"]="\x99Q";
          sjisconv["\u5115"]="\x99P";sjisconv["\u5116"]="\x99O";sjisconv["\u5118"]="\x98\xd4";sjisconv["\u511a"]="\x99R";sjisconv["\u511f"]="\x8f\x9e";sjisconv["\u5121"]="\x99S";sjisconv["\u512a"]="\x97D";sjisconv["\u5132"]="\x96\xd7";sjisconv["\u5137"]="\x99U";sjisconv["\u513a"]="\x99T";sjisconv["\u513b"]="\x99W";sjisconv["\u513c"]="\x99V";sjisconv["\u513f"]="\x99X";sjisconv["\u5140"]="\x99Y";sjisconv["\u5141"]="\x88\xf2";sjisconv["\u5143"]="\x8c\xb3";sjisconv["\u5144"]="\x8cZ";sjisconv["\u5145"]="\x8f[";
          sjisconv["\u5146"]="\x92\x9b";sjisconv["\u5147"]="\x8b\xa2";sjisconv["\u5148"]="\x90\xe6";sjisconv["\u5149"]="\x8c\xf5";sjisconv["\u514b"]="\x8d\x8e";sjisconv["\u514c"]="\x99[";sjisconv["\u514d"]="\x96\xc6";sjisconv["\u514e"]="\x93e";sjisconv["\u5150"]="\x8e\x99";sjisconv["\u5152"]="\x99Z";sjisconv["\u5154"]="\x99\\";sjisconv["\u515a"]="\x93}";sjisconv["\u515c"]="\x8a\x95";sjisconv["\u5162"]="\x99]";sjisconv["\u5165"]="\x93\xfc";sjisconv["\u5168"]="\x91S";sjisconv["\u5169"]="\x99_";sjisconv["\u516a"]="\x99`";
          sjisconv["\u516b"]="\x94\xaa";sjisconv["\u516c"]="\x8c\xf6";sjisconv["\u516d"]="\x98Z";sjisconv["\u516e"]="\x99a";sjisconv["\u5171"]="\x8b\xa4";sjisconv["\u5175"]="\x95\xba";sjisconv["\u5176"]="\x91\xb4";sjisconv["\u5177"]="\x8b\xef";sjisconv["\u5178"]="\x93T";sjisconv["\u517c"]="\x8c\x93";sjisconv["\u5180"]="\x99b";sjisconv["\u5182"]="\x99c";sjisconv["\u5185"]="\x93\xe0";sjisconv["\u5186"]="\x89~";sjisconv["\u5189"]="\x99f";sjisconv["\u518a"]="\x8d\xfb";sjisconv["\u518c"]="\x99e";sjisconv["\u518d"]="\x8d\xc4";
          sjisconv["\u518f"]="\x99g";sjisconv["\u5190"]="\xe3\xec";sjisconv["\u5191"]="\x99h";sjisconv["\u5192"]="\x96`";sjisconv["\u5193"]="\x99i";sjisconv["\u5195"]="\x99j";sjisconv["\u5196"]="\x99k";sjisconv["\u5197"]="\x8f\xe7";sjisconv["\u5199"]="\x8e\xca";sjisconv["\u51a0"]="\x8a\xa5";sjisconv["\u51a2"]="\x99n";sjisconv["\u51a4"]="\x99l";sjisconv["\u51a5"]="\x96\xbb";sjisconv["\u51a6"]="\x99m";sjisconv["\u51a8"]="\x95y";sjisconv["\u51a9"]="\x99o";sjisconv["\u51aa"]="\x99p";sjisconv["\u51ab"]="\x99q";
          sjisconv["\u51ac"]="\x93~";sjisconv["\u51b0"]="\x99u";sjisconv["\u51b1"]="\x99s";sjisconv["\u51b2"]="\x99t";sjisconv["\u51b3"]="\x99r";sjisconv["\u51b4"]="\x8d\xe1";sjisconv["\u51b5"]="\x99v";sjisconv["\u51b6"]="\x96\xe8";sjisconv["\u51b7"]="\x97\xe2";sjisconv["\u51bd"]="\x99w";sjisconv["\u51c4"]="\x90\xa6";sjisconv["\u51c5"]="\x99x";sjisconv["\u51c6"]="\x8fy";sjisconv["\u51c9"]="\x99y";sjisconv["\u51cb"]="\x92\x9c";sjisconv["\u51cc"]="\x97\xbd";sjisconv["\u51cd"]="\x93\x80";sjisconv["\u51d6"]="\x99\xc3";
          sjisconv["\u51db"]="\x99z";sjisconv["\u51dc"]="\xea\xa3";sjisconv["\u51dd"]="\x8b\xc3";sjisconv["\u51e0"]="\x99{";sjisconv["\u51e1"]="\x96}";sjisconv["\u51e6"]="\x8f\x88";sjisconv["\u51e7"]="\x91\xfa";sjisconv["\u51e9"]="\x99}";sjisconv["\u51ea"]="\x93\xe2";sjisconv["\u51ed"]="\x99~";sjisconv["\u51f0"]="\x99\x80";sjisconv["\u51f1"]="\x8aM";sjisconv["\u51f5"]="\x99\x81";sjisconv["\u51f6"]="\x8b\xa5";sjisconv["\u51f8"]="\x93\xca";sjisconv["\u51f9"]="\x89\x9a";sjisconv["\u51fa"]="\x8fo";sjisconv["\u51fd"]="\x94\x9f";
          sjisconv["\u51fe"]="\x99\x82";sjisconv["\u5200"]="\x93\x81";sjisconv["\u5203"]="\x90n";sjisconv["\u5204"]="\x99\x83";sjisconv["\u5206"]="\x95\xaa";sjisconv["\u5207"]="\x90\xd8";sjisconv["\u5208"]="\x8a\xa0";sjisconv["\u520a"]="\x8a\xa7";sjisconv["\u520b"]="\x99\x84";sjisconv["\u520e"]="\x99\x86";sjisconv["\u5211"]="\x8cY";sjisconv["\u5214"]="\x99\x85";sjisconv["\u5217"]="\x97\xf1";sjisconv["\u521d"]="\x8f\x89";sjisconv["\u5224"]="\x94\xbb";sjisconv["\u5225"]="\x95\xca";sjisconv["\u5227"]="\x99\x87";
          sjisconv["\u5229"]="\x97\x98";sjisconv["\u522a"]="\x99\x88";sjisconv["\u522e"]="\x99\x89";sjisconv["\u5230"]="\x93\x9e";sjisconv["\u5233"]="\x99\x8a";sjisconv["\u5236"]="\x90\xa7";sjisconv["\u5237"]="\x8d\xfc";sjisconv["\u5238"]="\x8c\x94";sjisconv["\u5239"]="\x99\x8b";sjisconv["\u523a"]="\x8eh";sjisconv["\u523b"]="\x8d\x8f";sjisconv["\u5243"]="\x92\xe4";sjisconv["\u5244"]="\x99\x8d";sjisconv["\u5247"]="\x91\xa5";sjisconv["\u524a"]="\x8d\xed";sjisconv["\u524b"]="\x99\x8e";sjisconv["\u524c"]="\x99\x8f";
          sjisconv["\u524d"]="\x91O";sjisconv["\u524f"]="\x99\x8c";sjisconv["\u5254"]="\x99\x91";sjisconv["\u5256"]="\x96U";sjisconv["\u525b"]="\x8d\x84";sjisconv["\u525e"]="\x99\x90";sjisconv["\u5263"]="\x8c\x95";sjisconv["\u5264"]="\x8d\xdc";sjisconv["\u5265"]="\x94\x8d";sjisconv["\u5269"]="\x99\x94";sjisconv["\u526a"]="\x99\x92";sjisconv["\u526f"]="\x95\x9b";sjisconv["\u5270"]="\x8f\xe8";sjisconv["\u5271"]="\x99\x9b";sjisconv["\u5272"]="\x8a\x84";sjisconv["\u5273"]="\x99\x95";sjisconv["\u5274"]="\x99\x93";
          sjisconv["\u5275"]="\x91n";sjisconv["\u527d"]="\x99\x97";sjisconv["\u527f"]="\x99\x96";sjisconv["\u5283"]="\x8ac";sjisconv["\u5287"]="\x8c\x80";sjisconv["\u5288"]="\x99\x9c";sjisconv["\u5289"]="\x97\xab";sjisconv["\u528d"]="\x99\x98";sjisconv["\u5291"]="\x99\x9d";sjisconv["\u5292"]="\x99\x9a";sjisconv["\u5294"]="\x99\x99";sjisconv["\u529b"]="\x97\xcd";sjisconv["\u529f"]="\x8c\xf7";sjisconv["\u52a0"]="\x89\xc1";sjisconv["\u52a3"]="\x97\xf2";sjisconv["\u52a9"]="\x8f\x95";sjisconv["\u52aa"]="\x93w";
          sjisconv["\u52ab"]="\x8d\x85";sjisconv["\u52ac"]="\x99\xa0";sjisconv["\u52ad"]="\x99\xa1";sjisconv["\u52b1"]="\x97\xe3";sjisconv["\u52b4"]="\x98J";sjisconv["\u52b5"]="\x99\xa3";sjisconv["\u52b9"]="\x8c\xf8";sjisconv["\u52bc"]="\x99\xa2";sjisconv["\u52be"]="\x8aN";sjisconv["\u52c1"]="\x99\xa4";sjisconv["\u52c3"]="\x96u";sjisconv["\u52c5"]="\x92\xba";sjisconv["\u52c7"]="\x97E";sjisconv["\u52c9"]="\x95\xd7";sjisconv["\u52cd"]="\x99\xa5";sjisconv["\u52d2"]="\xe8\xd3";sjisconv["\u52d5"]="\x93\xae";sjisconv["\u52d7"]="\x99\xa6";
          sjisconv["\u52d8"]="\x8a\xa8";sjisconv["\u52d9"]="\x96\xb1";sjisconv["\u52dd"]="\x8f\x9f";sjisconv["\u52de"]="\x99\xa7";sjisconv["\u52df"]="\x95\xe5";sjisconv["\u52e0"]="\x99\xab";sjisconv["\u52e2"]="\x90\xa8";sjisconv["\u52e3"]="\x99\xa8";sjisconv["\u52e4"]="\x8b\xce";sjisconv["\u52e6"]="\x99\xa9";sjisconv["\u52e7"]="\x8a\xa9";sjisconv["\u52f2"]="\x8cM";sjisconv["\u52f3"]="\x99\xac";sjisconv["\u52f5"]="\x99\xad";sjisconv["\u52f8"]="\x99\xae";sjisconv["\u52f9"]="\x99\xaf";sjisconv["\u52fa"]="\x8e\xd9";
          sjisconv["\u52fe"]="\x8c\xf9";sjisconv["\u52ff"]="\x96\xdc";sjisconv["\u5301"]="\x96\xe6";sjisconv["\u5302"]="\x93\xf5";sjisconv["\u5305"]="\x95\xef";sjisconv["\u5306"]="\x99\xb0";sjisconv["\u5308"]="\x99\xb1";sjisconv["\u530d"]="\x99\xb3";sjisconv["\u530f"]="\x99\xb5";sjisconv["\u5310"]="\x99\xb4";sjisconv["\u5315"]="\x99\xb6";sjisconv["\u5316"]="\x89\xbb";sjisconv["\u5317"]="\x96k";sjisconv["\u5319"]="\x8d\xfa";sjisconv["\u531a"]="\x99\xb7";sjisconv["\u531d"]="\x91x";sjisconv["\u5320"]="\x8f\xa0";
          sjisconv["\u5321"]="\x8b\xa7";sjisconv["\u5323"]="\x99\xb8";sjisconv["\u532a"]="\x94\xd9";sjisconv["\u532f"]="\x99\xb9";sjisconv["\u5331"]="\x99\xba";sjisconv["\u5333"]="\x99\xbb";sjisconv["\u5338"]="\x99\xbc";sjisconv["\u5339"]="\x95C";sjisconv["\u533a"]="\x8b\xe6";sjisconv["\u533b"]="\x88\xe3";sjisconv["\u533f"]="\x93\xbd";sjisconv["\u5340"]="\x99\xbd";sjisconv["\u5341"]="\x8f\\";sjisconv["\u5343"]="\x90\xe7";sjisconv["\u5345"]="\x99\xbf";sjisconv["\u5346"]="\x99\xbe";sjisconv["\u5347"]="\x8f\xa1";
          sjisconv["\u5348"]="\x8c\xdf";sjisconv["\u5349"]="\x99\xc1";sjisconv["\u534a"]="\x94\xbc";sjisconv["\u534d"]="\x99\xc2";sjisconv["\u5351"]="\x94\xda";sjisconv["\u5352"]="\x91\xb2";sjisconv["\u5353"]="\x91\xec";sjisconv["\u5354"]="\x8b\xa6";sjisconv["\u5357"]="\x93\xec";sjisconv["\u5358"]="\x92P";sjisconv["\u535a"]="\x94\x8e";sjisconv["\u535c"]="\x96m";sjisconv["\u535e"]="\x99\xc4";sjisconv["\u5360"]="\x90\xe8";sjisconv["\u5366"]="\x8cT";sjisconv["\u5369"]="\x99\xc5";sjisconv["\u536e"]="\x99\xc6";
          sjisconv["\u536f"]="\x89K";sjisconv["\u5370"]="\x88\xf3";sjisconv["\u5371"]="\x8a\xeb";sjisconv["\u5373"]="\x91\xa6";sjisconv["\u5374"]="\x8bp";sjisconv["\u5375"]="\x97\x91";sjisconv["\u5377"]="\x99\xc9";sjisconv["\u5378"]="\x89\xb5";sjisconv["\u537b"]="\x99\xc8";sjisconv["\u537f"]="\x8b\xa8";sjisconv["\u5382"]="\x99\xca";sjisconv["\u5384"]="\x96\xef";sjisconv["\u5396"]="\x99\xcb";sjisconv["\u5398"]="\x97\xd0";sjisconv["\u539a"]="\x8c\xfa";sjisconv["\u539f"]="\x8c\xb4";sjisconv["\u53a0"]="\x99\xcc";
          sjisconv["\u53a5"]="\x99\xce";sjisconv["\u53a6"]="\x99\xcd";sjisconv["\u53a8"]="\x90~";sjisconv["\u53a9"]="\x89X";sjisconv["\u53ad"]="\x89}";sjisconv["\u53ae"]="\x99\xcf";sjisconv["\u53b0"]="\x99\xd0";sjisconv["\u53b3"]="\x8c\xb5";sjisconv["\u53b6"]="\x99\xd1";sjisconv["\u53bb"]="\x8b\x8e";sjisconv["\u53c2"]="\x8eQ";sjisconv["\u53c3"]="\x99\xd2";sjisconv["\u53c8"]="\x96\x94";sjisconv["\u53c9"]="\x8d\xb3";sjisconv["\u53ca"]="\x8by";sjisconv["\u53cb"]="\x97F";sjisconv["\u53cc"]="\x91o";sjisconv["\u53cd"]="\x94\xbd";
          sjisconv["\u53ce"]="\x8e\xfb";sjisconv["\u53d4"]="\x8ff";sjisconv["\u53d6"]="\x8e\xe6";sjisconv["\u53d7"]="\x8e\xf3";sjisconv["\u53d9"]="\x8f\x96";sjisconv["\u53db"]="\x94\xbe";sjisconv["\u53df"]="\x99\xd5";sjisconv["\u53e1"]="\x89b";sjisconv["\u53e2"]="\x91p";sjisconv["\u53e3"]="\x8c\xfb";sjisconv["\u53e4"]="\x8c\xc3";sjisconv["\u53e5"]="\x8b\xe5";sjisconv["\u53e8"]="\x99\xd9";sjisconv["\u53e9"]="\x92@";sjisconv["\u53ea"]="\x91\xfc";sjisconv["\u53eb"]="\x8b\xa9";sjisconv["\u53ec"]="\x8f\xa2";sjisconv["\u53ed"]="\x99\xda";
          sjisconv["\u53ee"]="\x99\xd8";sjisconv["\u53ef"]="\x89\xc2";sjisconv["\u53f0"]="\x91\xe4";sjisconv["\u53f1"]="\x8e\xb6";sjisconv["\u53f2"]="\x8ej";sjisconv["\u53f3"]="\x89E";sjisconv["\u53f6"]="\x8a\x90";sjisconv["\u53f7"]="\x8d\x86";sjisconv["\u53f8"]="\x8ei";sjisconv["\u53fa"]="\x99\xdb";sjisconv["\u5401"]="\x99\xdc";sjisconv["\u5403"]="\x8bh";sjisconv["\u5404"]="\x8ae";sjisconv["\u5408"]="\x8d\x87";sjisconv["\u5409"]="\x8bg";sjisconv["\u540a"]="\x92\xdd";sjisconv["\u540b"]="\x89D";sjisconv["\u540c"]="\x93\xaf";
          sjisconv["\u540d"]="\x96\xbc";sjisconv["\u540e"]="\x8d@";sjisconv["\u540f"]="\x97\x99";sjisconv["\u5410"]="\x93f";sjisconv["\u5411"]="\x8c\xfc";sjisconv["\u541b"]="\x8cN";sjisconv["\u541d"]="\x99\xe5";sjisconv["\u541f"]="\x8b\xe1";sjisconv["\u5420"]="\x96i";sjisconv["\u5426"]="\x94\xdb";sjisconv["\u5429"]="\x99\xe4";sjisconv["\u542b"]="\x8a\xdc";sjisconv["\u542c"]="\x99\xdf";sjisconv["\u542d"]="\x99\xe0";sjisconv["\u542e"]="\x99\xe2";sjisconv["\u5436"]="\x99\xe3";sjisconv["\u5438"]="\x8bz";sjisconv["\u5439"]="\x90\x81";
          sjisconv["\u543b"]="\x95\xab";sjisconv["\u543c"]="\x99\xe1";sjisconv["\u543d"]="\x99\xdd";sjisconv["\u543e"]="\x8c\xe1";sjisconv["\u5440"]="\x99\xde";sjisconv["\u5442"]="\x98C";sjisconv["\u5446"]="\x95\xf0";sjisconv["\u5448"]="\x92\xe6";sjisconv["\u5449"]="\x8c\xe0";sjisconv["\u544a"]="\x8d\x90";sjisconv["\u544e"]="\x99\xe6";sjisconv["\u5451"]="\x93\xdb";sjisconv["\u545f"]="\x99\xea";sjisconv["\u5468"]="\x8e\xfc";sjisconv["\u546a"]="\x8e\xf4";sjisconv["\u5470"]="\x99\xed";sjisconv["\u5471"]="\x99\xeb";
          sjisconv["\u5473"]="\x96\xa1";sjisconv["\u5475"]="\x99\xe8";sjisconv["\u5476"]="\x99\xf1";sjisconv["\u5477"]="\x99\xec";sjisconv["\u547b"]="\x99\xef";sjisconv["\u547c"]="\x8c\xc4";sjisconv["\u547d"]="\x96\xbd";sjisconv["\u5480"]="\x99\xf0";sjisconv["\u5484"]="\x99\xf2";sjisconv["\u5486"]="\x99\xf4";sjisconv["\u548b"]="\x8d\xee";sjisconv["\u548c"]="\x98a";sjisconv["\u548e"]="\x99\xe9";sjisconv["\u548f"]="\x99\xe7";sjisconv["\u5490"]="\x99\xf3";sjisconv["\u5492"]="\x99\xee";sjisconv["\u54a2"]="\x99\xf6";
          sjisconv["\u54a4"]="\x9aB";sjisconv["\u54a5"]="\x99\xf8";sjisconv["\u54a8"]="\x99\xfc";sjisconv["\u54ab"]="\x9a@";sjisconv["\u54ac"]="\x99\xf9";sjisconv["\u54af"]="\x9a]";sjisconv["\u54b2"]="\x8d\xe7";sjisconv["\u54b3"]="\x8aP";sjisconv["\u54b8"]="\x99\xf7";sjisconv["\u54bc"]="\x9aD";sjisconv["\u54bd"]="\x88\xf4";sjisconv["\u54be"]="\x9aC";sjisconv["\u54c0"]="\x88\xa3";sjisconv["\u54c1"]="\x95i";sjisconv["\u54c2"]="\x9aA";sjisconv["\u54c4"]="\x99\xfa";sjisconv["\u54c7"]="\x99\xf5";sjisconv["\u54c8"]="\x99\xfb";
          sjisconv["\u54c9"]="\x8d\xc6";sjisconv["\u54d8"]="\x9aE";sjisconv["\u54e1"]="\x88\xf5";sjisconv["\u54e2"]="\x9aN";sjisconv["\u54e5"]="\x9aF";sjisconv["\u54e6"]="\x9aG";sjisconv["\u54e8"]="\x8f\xa3";sjisconv["\u54e9"]="\x96\x89";sjisconv["\u54ed"]="\x9aL";sjisconv["\u54ee"]="\x9aK";sjisconv["\u54f2"]="\x93N";sjisconv["\u54fa"]="\x9aM";sjisconv["\u54fd"]="\x9aJ";sjisconv["\u5504"]="\x89S";sjisconv["\u5506"]="\x8d\xb4";sjisconv["\u5507"]="\x90O";sjisconv["\u550f"]="\x9aH";sjisconv["\u5510"]="\x93\x82";
          sjisconv["\u5514"]="\x9aI";sjisconv["\u5516"]="\x88\xa0";sjisconv["\u552e"]="\x9aS";sjisconv["\u552f"]="\x97B";sjisconv["\u5531"]="\x8f\xa5";sjisconv["\u5533"]="\x9aY";sjisconv["\u5538"]="\x9aX";sjisconv["\u5539"]="\x9aO";sjisconv["\u553e"]="\x91\xc1";sjisconv["\u5540"]="\x9aP";sjisconv["\u5544"]="\x91\xed";sjisconv["\u5545"]="\x9aU";sjisconv["\u5546"]="\x8f\xa4";sjisconv["\u554c"]="\x9aR";sjisconv["\u554f"]="\x96\xe2";sjisconv["\u5553"]="\x8c[";sjisconv["\u5556"]="\x9aV";sjisconv["\u5557"]="\x9aW";
          sjisconv["\u555c"]="\x9aT";sjisconv["\u555d"]="\x9aZ";sjisconv["\u5563"]="\x9aQ";sjisconv["\u557b"]="\x9a`";sjisconv["\u557c"]="\x9ae";sjisconv["\u557e"]="\x9aa";sjisconv["\u5580"]="\x9a\\";sjisconv["\u5583"]="\x9af";sjisconv["\u5584"]="\x91P";sjisconv["\u5587"]="\x9ah";sjisconv["\u5589"]="\x8dA";sjisconv["\u558a"]="\x9a^";sjisconv["\u558b"]="\x92\x9d";sjisconv["\u5598"]="\x9ab";sjisconv["\u5599"]="\x9a[";sjisconv["\u559a"]="\x8a\xab";sjisconv["\u559c"]="\x8a\xec";sjisconv["\u559d"]="\x8a\x85";sjisconv["\u559e"]="\x9ac";
          sjisconv["\u559f"]="\x9a_";sjisconv["\u55a7"]="\x8c\x96";sjisconv["\u55a8"]="\x9ai";sjisconv["\u55a9"]="\x9ag";sjisconv["\u55aa"]="\x91r";sjisconv["\u55ab"]="\x8bi";sjisconv["\u55ac"]="\x8b\xaa";sjisconv["\u55ae"]="\x9ad";sjisconv["\u55b0"]="\x8b\xf2";sjisconv["\u55b6"]="\x89c";sjisconv["\u55c4"]="\x9am";sjisconv["\u55c5"]="\x9ak";sjisconv["\u55c7"]="\x9a\xa5";sjisconv["\u55d4"]="\x9ap";sjisconv["\u55da"]="\x9aj";sjisconv["\u55dc"]="\x9an";sjisconv["\u55df"]="\x9al";sjisconv["\u55e3"]="\x8ek";sjisconv["\u55e4"]="\x9ao";
          sjisconv["\u55f7"]="\x9ar";sjisconv["\u55f9"]="\x9aw";sjisconv["\u55fd"]="\x9au";sjisconv["\u55fe"]="\x9at";sjisconv["\u5606"]="\x92Q";sjisconv["\u5609"]="\x89\xc3";sjisconv["\u5614"]="\x9aq";sjisconv["\u5616"]="\x9as";sjisconv["\u5617"]="\x8f\xa6";sjisconv["\u5618"]="\x89R";sjisconv["\u561b"]="\x9av";sjisconv["\u5629"]="\x89\xdc";sjisconv["\u562f"]="\x9a\x82";sjisconv["\u5631"]="\x8f\xfa";sjisconv["\u5632"]="\x9a}";sjisconv["\u5634"]="\x9a{";sjisconv["\u5636"]="\x9a|";sjisconv["\u5638"]="\x9a~";
          sjisconv["\u5642"]="\x89\\";sjisconv["\u564c"]="\x91X";sjisconv["\u564e"]="\x9ax";sjisconv["\u5650"]="\x9ay";sjisconv["\u565b"]="\x8a\x9a";sjisconv["\u5664"]="\x9a\x81";sjisconv["\u5668"]="\x8a\xed";sjisconv["\u566a"]="\x9a\x84";sjisconv["\u566b"]="\x9a\x80";sjisconv["\u566c"]="\x9a\x83";sjisconv["\u5674"]="\x95\xac";sjisconv["\u5678"]="\x93\xd3";sjisconv["\u567a"]="\x94\xb6";sjisconv["\u5680"]="\x9a\x86";sjisconv["\u5686"]="\x9a\x85";sjisconv["\u5687"]="\x8ad";sjisconv["\u568a"]="\x9a\x87";sjisconv["\u568f"]="\x9a\x8a";
          sjisconv["\u5694"]="\x9a\x89";sjisconv["\u56a0"]="\x9a\x88";sjisconv["\u56a2"]="\x94X";sjisconv["\u56a5"]="\x9a\x8b";sjisconv["\u56ae"]="\x9a\x8c";sjisconv["\u56b4"]="\x9a\x8e";sjisconv["\u56b6"]="\x9a\x8d";sjisconv["\u56bc"]="\x9a\x90";sjisconv["\u56c0"]="\x9a\x93";sjisconv["\u56c1"]="\x9a\x91";sjisconv["\u56c2"]="\x9a\x8f";sjisconv["\u56c3"]="\x9a\x92";sjisconv["\u56c8"]="\x9a\x94";sjisconv["\u56ce"]="\x9a\x95";sjisconv["\u56d1"]="\x9a\x96";sjisconv["\u56d3"]="\x9a\x97";sjisconv["\u56d7"]="\x9a\x98";
          sjisconv["\u56d8"]="\x99d";sjisconv["\u56da"]="\x8e\xfa";sjisconv["\u56db"]="\x8el";sjisconv["\u56de"]="\x89\xf1";sjisconv["\u56e0"]="\x88\xf6";sjisconv["\u56e3"]="\x92c";sjisconv["\u56ee"]="\x9a\x99";sjisconv["\u56f0"]="\x8d\xa2";sjisconv["\u56f2"]="\x88\xcd";sjisconv["\u56f3"]="\x90}";sjisconv["\u56f9"]="\x9a\x9a";sjisconv["\u56fa"]="\x8c\xc5";sjisconv["\u56fd"]="\x8d\x91";sjisconv["\u56ff"]="\x9a\x9c";sjisconv["\u5700"]="\x9a\x9b";sjisconv["\u5703"]="\x95\xde";sjisconv["\u5704"]="\x9a\x9d";sjisconv["\u5708"]="\x9a\x9f";
          sjisconv["\u5709"]="\x9a\x9e";sjisconv["\u570b"]="\x9a\xa0";sjisconv["\u570d"]="\x9a\xa1";sjisconv["\u570f"]="\x8c\x97";sjisconv["\u5712"]="\x89\x80";sjisconv["\u5713"]="\x9a\xa2";sjisconv["\u5716"]="\x9a\xa4";sjisconv["\u5718"]="\x9a\xa3";sjisconv["\u571c"]="\x9a\xa6";sjisconv["\u571f"]="\x93y";sjisconv["\u5726"]="\x9a\xa7";sjisconv["\u5727"]="\x88\xb3";sjisconv["\u5728"]="\x8d\xdd";sjisconv["\u572d"]="\x8c\\";sjisconv["\u5730"]="\x92n";sjisconv["\u5737"]="\x9a\xa8";sjisconv["\u5738"]="\x9a\xa9";
          sjisconv["\u573b"]="\x9a\xab";sjisconv["\u5740"]="\x9a\xac";sjisconv["\u5742"]="\x8d\xe2";sjisconv["\u5747"]="\x8b\xcf";sjisconv["\u574a"]="\x96V";sjisconv["\u574e"]="\x9a\xaa";sjisconv["\u574f"]="\x9a\xad";sjisconv["\u5750"]="\x8d\xbf";sjisconv["\u5751"]="\x8dB";sjisconv["\u5761"]="\x9a\xb1";sjisconv["\u5764"]="\x8d\xa3";sjisconv["\u5766"]="\x92R";sjisconv["\u5769"]="\x9a\xae";sjisconv["\u576a"]="\x92\xd8";sjisconv["\u577f"]="\x9a\xb2";sjisconv["\u5782"]="\x90\x82";sjisconv["\u5788"]="\x9a\xb0";
          sjisconv["\u5789"]="\x9a\xb3";sjisconv["\u578b"]="\x8c^";sjisconv["\u5793"]="\x9a\xb4";sjisconv["\u57a0"]="\x9a\xb5";sjisconv["\u57a2"]="\x8dC";sjisconv["\u57a3"]="\x8a_";sjisconv["\u57a4"]="\x9a\xb7";sjisconv["\u57aa"]="\x9a\xb8";sjisconv["\u57b0"]="\x9a\xb9";sjisconv["\u57b3"]="\x9a\xb6";sjisconv["\u57c0"]="\x9a\xaf";sjisconv["\u57c3"]="\x9a\xba";sjisconv["\u57c6"]="\x9a\xbb";sjisconv["\u57cb"]="\x96\x84";sjisconv["\u57ce"]="\x8f\xe9";sjisconv["\u57d2"]="\x9a\xbd";sjisconv["\u57d3"]="\x9a\xbe";
          sjisconv["\u57d4"]="\x9a\xbc";sjisconv["\u57d6"]="\x9a\xc0";sjisconv["\u57dc"]="\x94W";sjisconv["\u57df"]="\x88\xe6";sjisconv["\u57e0"]="\x95u";sjisconv["\u57e3"]="\x9a\xc1";sjisconv["\u57f4"]="\x8f\xfb";sjisconv["\u57f7"]="\x8e\xb7";sjisconv["\u57f9"]="\x94|";sjisconv["\u57fa"]="\x8a\xee";sjisconv["\u57fc"]="\x8d\xe9";sjisconv["\u5800"]="\x96x";sjisconv["\u5802"]="\x93\xb0";sjisconv["\u5805"]="\x8c\x98";sjisconv["\u5806"]="\x91\xcd";sjisconv["\u580a"]="\x9a\xbf";sjisconv["\u580b"]="\x9a\xc2";sjisconv["\u5815"]="\x91\xc2";
          sjisconv["\u5819"]="\x9a\xc3";sjisconv["\u581d"]="\x9a\xc4";sjisconv["\u5821"]="\x9a\xc6";sjisconv["\u5824"]="\x92\xe7";sjisconv["\u582a"]="\x8a\xac";sjisconv["\u582f"]="\xea\x9f";sjisconv["\u5830"]="\x89\x81";sjisconv["\u5831"]="\x95\xf1";sjisconv["\u5834"]="\x8f\xea";sjisconv["\u5835"]="\x93g";sjisconv["\u583a"]="\x8d\xe4";sjisconv["\u583d"]="\x9a\xcc";sjisconv["\u5840"]="\x95\xbb";sjisconv["\u5841"]="\x97\xdb";sjisconv["\u584a"]="\x89\xf2";sjisconv["\u584b"]="\x9a\xc8";sjisconv["\u5851"]="\x91Y";
          sjisconv["\u5852"]="\x9a\xcb";sjisconv["\u5854"]="\x93\x83";sjisconv["\u5857"]="\x93h";sjisconv["\u5858"]="\x93\x84";sjisconv["\u5859"]="\x94\xb7";sjisconv["\u585a"]="\x92\xcb";sjisconv["\u585e"]="\x8d\xc7";sjisconv["\u5862"]="\x9a\xc7";sjisconv["\u5869"]="\x89\x96";sjisconv["\u586b"]="\x93U";sjisconv["\u5870"]="\x9a\xc9";sjisconv["\u5872"]="\x9a\xc5";sjisconv["\u5875"]="\x90o";sjisconv["\u5879"]="\x9a\xcd";sjisconv["\u587e"]="\x8fm";sjisconv["\u5883"]="\x8b\xab";sjisconv["\u5885"]="\x9a\xce";sjisconv["\u5893"]="\x95\xe6";
          sjisconv["\u5897"]="\x91\x9d";sjisconv["\u589c"]="\x92\xc4";sjisconv["\u589f"]="\x9a\xd0";sjisconv["\u58a8"]="\x96n";sjisconv["\u58ab"]="\x9a\xd1";sjisconv["\u58ae"]="\x9a\xd6";sjisconv["\u58b3"]="\x95\xad";sjisconv["\u58b8"]="\x9a\xd5";sjisconv["\u58b9"]="\x9a\xcf";sjisconv["\u58ba"]="\x9a\xd2";sjisconv["\u58bb"]="\x9a\xd4";sjisconv["\u58be"]="\x8d\xa4";sjisconv["\u58c1"]="\x95\xc7";sjisconv["\u58c5"]="\x9a\xd7";sjisconv["\u58c7"]="\x92d";sjisconv["\u58ca"]="\x89\xf3";sjisconv["\u58cc"]="\x8f\xeb";
          sjisconv["\u58d1"]="\x9a\xd9";sjisconv["\u58d3"]="\x9a\xd8";sjisconv["\u58d5"]="\x8d\x88";sjisconv["\u58d7"]="\x9a\xda";sjisconv["\u58d8"]="\x9a\xdc";sjisconv["\u58d9"]="\x9a\xdb";sjisconv["\u58dc"]="\x9a\xde";sjisconv["\u58de"]="\x9a\xd3";sjisconv["\u58df"]="\x9a\xe0";sjisconv["\u58e4"]="\x9a\xdf";sjisconv["\u58e5"]="\x9a\xdd";sjisconv["\u58eb"]="\x8em";sjisconv["\u58ec"]="\x90p";sjisconv["\u58ee"]="\x91s";sjisconv["\u58ef"]="\x9a\xe1";sjisconv["\u58f0"]="\x90\xba";sjisconv["\u58f1"]="\x88\xeb";
          sjisconv["\u58f2"]="\x94\x84";sjisconv["\u58f7"]="\x92\xd9";sjisconv["\u58f9"]="\x9a\xe3";sjisconv["\u58fa"]="\x9a\xe2";sjisconv["\u58fb"]="\x9a\xe4";sjisconv["\u58fc"]="\x9a\xe5";sjisconv["\u58fd"]="\x9a\xe6";sjisconv["\u5902"]="\x9a\xe7";sjisconv["\u5909"]="\x95\xcf";sjisconv["\u590a"]="\x9a\xe8";sjisconv["\u590f"]="\x89\xc4";sjisconv["\u5910"]="\x9a\xe9";sjisconv["\u5915"]="\x97[";sjisconv["\u5916"]="\x8aO";sjisconv["\u5918"]="\x99\xc7";sjisconv["\u5919"]="\x8fg";sjisconv["\u591a"]="\x91\xbd";
          sjisconv["\u591b"]="\x9a\xea";sjisconv["\u591c"]="\x96\xe9";sjisconv["\u5922"]="\x96\xb2";sjisconv["\u5925"]="\x9a\xec";sjisconv["\u5927"]="\x91\xe5";sjisconv["\u5929"]="\x93V";sjisconv["\u592a"]="\x91\xbe";sjisconv["\u592b"]="\x95v";sjisconv["\u592c"]="\x9a\xed";sjisconv["\u592d"]="\x9a\xee";sjisconv["\u592e"]="\x89\x9b";sjisconv["\u5931"]="\x8e\xb8";sjisconv["\u5932"]="\x9a\xef";sjisconv["\u5937"]="\x88\xce";sjisconv["\u5938"]="\x9a\xf0";sjisconv["\u593e"]="\x9a\xf1";sjisconv["\u5944"]="\x89\x82";
          sjisconv["\u5947"]="\x8a\xef";sjisconv["\u5948"]="\x93\xde";sjisconv["\u5949"]="\x95\xf2";sjisconv["\u594e"]="\x9a\xf5";sjisconv["\u594f"]="\x91t";sjisconv["\u5950"]="\x9a\xf4";sjisconv["\u5951"]="\x8c_";sjisconv["\u5954"]="\x96z";sjisconv["\u5955"]="\x9a\xf3";sjisconv["\u5957"]="\x93\x85";sjisconv["\u5958"]="\x9a\xf7";sjisconv["\u595a"]="\x9a\xf6";sjisconv["\u5960"]="\x9a\xf9";sjisconv["\u5962"]="\x9a\xf8";sjisconv["\u5965"]="\x89\x9c";sjisconv["\u5967"]="\x9a\xfa";sjisconv["\u5968"]="\x8f\xa7";
          sjisconv["\u5969"]="\x9a\xfc";sjisconv["\u596a"]="\x92D";sjisconv["\u596c"]="\x9a\xfb";sjisconv["\u596e"]="\x95\xb1";sjisconv["\u5973"]="\x8f\x97";sjisconv["\u5974"]="\x93z";sjisconv["\u5978"]="\x9b@";sjisconv["\u597d"]="\x8dD";sjisconv["\u5981"]="\x9bA";sjisconv["\u5982"]="\x94@";sjisconv["\u5983"]="\x94\xdc";sjisconv["\u5984"]="\x96\xcf";sjisconv["\u598a"]="\x94D";sjisconv["\u598d"]="\x9bJ";sjisconv["\u5993"]="\x8bW";sjisconv["\u5996"]="\x97d";sjisconv["\u5999"]="\x96\xad";sjisconv["\u599b"]="\x9b\xaa";
          sjisconv["\u599d"]="\x9bB";sjisconv["\u59a3"]="\x9bE";sjisconv["\u59a5"]="\x91\xc3";sjisconv["\u59a8"]="\x96W";sjisconv["\u59ac"]="\x93i";sjisconv["\u59b2"]="\x9bF";sjisconv["\u59b9"]="\x96\x85";sjisconv["\u59bb"]="\x8d\xc8";sjisconv["\u59be"]="\x8f\xa8";sjisconv["\u59c6"]="\x9bG";sjisconv["\u59c9"]="\x8eo";sjisconv["\u59cb"]="\x8en";sjisconv["\u59d0"]="\x88\xb7";sjisconv["\u59d1"]="\x8c\xc6";sjisconv["\u59d3"]="\x90\xa9";sjisconv["\u59d4"]="\x88\xcf";sjisconv["\u59d9"]="\x9bK";sjisconv["\u59da"]="\x9bL";
          sjisconv["\u59dc"]="\x9bI";sjisconv["\u59e5"]="\x89W";sjisconv["\u59e6"]="\x8a\xad";sjisconv["\u59e8"]="\x9bH";sjisconv["\u59ea"]="\x96\xc3";sjisconv["\u59eb"]="\x95P";sjisconv["\u59f6"]="\x88\xa6";sjisconv["\u59fb"]="\x88\xf7";sjisconv["\u59ff"]="\x8ep";sjisconv["\u5a01"]="\x88\xd0";sjisconv["\u5a03"]="\x88\xa1";sjisconv["\u5a09"]="\x9bQ";sjisconv["\u5a11"]="\x9bO";sjisconv["\u5a18"]="\x96\xba";sjisconv["\u5a1a"]="\x9bR";sjisconv["\u5a1c"]="\x9bP";sjisconv["\u5a1f"]="\x9bN";sjisconv["\u5a20"]="\x90P";
          sjisconv["\u5a25"]="\x9bM";sjisconv["\u5a29"]="\x95\xd8";sjisconv["\u5a2f"]="\x8c\xe2";sjisconv["\u5a35"]="\x9bV";sjisconv["\u5a36"]="\x9bW";sjisconv["\u5a3c"]="\x8f\xa9";sjisconv["\u5a40"]="\x9bS";sjisconv["\u5a41"]="\x98K";sjisconv["\u5a46"]="\x94k";sjisconv["\u5a49"]="\x9bU";sjisconv["\u5a5a"]="\x8d\xa5";sjisconv["\u5a62"]="\x9bX";sjisconv["\u5a66"]="\x95w";sjisconv["\u5a6a"]="\x9bY";sjisconv["\u5a6c"]="\x9bT";sjisconv["\u5a7f"]="\x96\xb9";sjisconv["\u5a92"]="\x94}";sjisconv["\u5a9a"]="\x9bZ";
          sjisconv["\u5a9b"]="\x95Q";sjisconv["\u5abc"]="\x9b[";sjisconv["\u5abd"]="\x9b_";sjisconv["\u5abe"]="\x9b\\";sjisconv["\u5ac1"]="\x89\xc5";sjisconv["\u5ac2"]="\x9b^";sjisconv["\u5ac9"]="\x8e\xb9";sjisconv["\u5acb"]="\x9b]";sjisconv["\u5acc"]="\x8c\x99";sjisconv["\u5ad0"]="\x9bk";sjisconv["\u5ad6"]="\x9bd";sjisconv["\u5ad7"]="\x9ba";sjisconv["\u5ae1"]="\x92\x84";sjisconv["\u5ae3"]="\x9b`";sjisconv["\u5ae6"]="\x9bb";sjisconv["\u5ae9"]="\x9bc";sjisconv["\u5afa"]="\x9be";sjisconv["\u5afb"]="\x9bf";sjisconv["\u5b09"]="\x8a\xf0";
          sjisconv["\u5b0b"]="\x9bh";sjisconv["\u5b0c"]="\x9bg";sjisconv["\u5b16"]="\x9bi";sjisconv["\u5b22"]="\x8f\xec";sjisconv["\u5b2a"]="\x9bl";sjisconv["\u5b2c"]="\x92\xda";sjisconv["\u5b30"]="\x89d";sjisconv["\u5b32"]="\x9bj";sjisconv["\u5b36"]="\x9bm";sjisconv["\u5b3e"]="\x9bn";sjisconv["\u5b40"]="\x9bq";sjisconv["\u5b43"]="\x9bo";sjisconv["\u5b45"]="\x9bp";sjisconv["\u5b50"]="\x8eq";sjisconv["\u5b51"]="\x9br";sjisconv["\u5b54"]="\x8dE";sjisconv["\u5b55"]="\x9bs";sjisconv["\u5b57"]="\x8e\x9a";sjisconv["\u5b58"]="\x91\xb6";
          sjisconv["\u5b5a"]="\x9bt";sjisconv["\u5b5b"]="\x9bu";sjisconv["\u5b5c"]="\x8ey";sjisconv["\u5b5d"]="\x8dF";sjisconv["\u5b5f"]="\x96\xd0";sjisconv["\u5b63"]="\x8bG";sjisconv["\u5b64"]="\x8c\xc7";sjisconv["\u5b65"]="\x9bv";sjisconv["\u5b66"]="\x8aw";sjisconv["\u5b69"]="\x9bw";sjisconv["\u5b6b"]="\x91\xb7";sjisconv["\u5b70"]="\x9bx";sjisconv["\u5b71"]="\x9b\xa1";sjisconv["\u5b73"]="\x9by";sjisconv["\u5b75"]="\x9bz";sjisconv["\u5b78"]="\x9b{";sjisconv["\u5b7a"]="\x9b}";sjisconv["\u5b80"]="\x9b~";sjisconv["\u5b83"]="\x9b\x80";
          sjisconv["\u5b85"]="\x91\xee";sjisconv["\u5b87"]="\x89F";sjisconv["\u5b88"]="\x8e\xe7";sjisconv["\u5b89"]="\x88\xc0";sjisconv["\u5b8b"]="\x91v";sjisconv["\u5b8c"]="\x8a\xae";sjisconv["\u5b8d"]="\x8e\xb3";sjisconv["\u5b8f"]="\x8dG";sjisconv["\u5b95"]="\x93\x86";sjisconv["\u5b97"]="\x8f@";sjisconv["\u5b98"]="\x8a\xaf";sjisconv["\u5b99"]="\x92\x88";sjisconv["\u5b9a"]="\x92\xe8";sjisconv["\u5b9b"]="\x88\xb6";sjisconv["\u5b9c"]="\x8bX";sjisconv["\u5b9d"]="\x95\xf3";sjisconv["\u5b9f"]="\x8e\xc0";sjisconv["\u5ba2"]="\x8bq";
          sjisconv["\u5ba3"]="\x90\xe9";sjisconv["\u5ba4"]="\x8e\xba";sjisconv["\u5ba5"]="\x97G";sjisconv["\u5ba6"]="\x9b\x81";sjisconv["\u5bae"]="\x8b{";sjisconv["\u5bb0"]="\x8d\xc9";sjisconv["\u5bb3"]="\x8aQ";sjisconv["\u5bb4"]="\x89\x83";sjisconv["\u5bb5"]="\x8f\xaa";sjisconv["\u5bb6"]="\x89\xc6";sjisconv["\u5bb8"]="\x9b\x82";sjisconv["\u5bb9"]="\x97e";sjisconv["\u5bbf"]="\x8fh";sjisconv["\u5bc2"]="\x8e\xe2";sjisconv["\u5bc3"]="\x9b\x83";sjisconv["\u5bc4"]="\x8a\xf1";sjisconv["\u5bc5"]="\x93\xd0";sjisconv["\u5bc6"]="\x96\xa7";
          sjisconv["\u5bc7"]="\x9b\x84";sjisconv["\u5bc9"]="\x9b\x85";sjisconv["\u5bcc"]="\x95x";sjisconv["\u5bd0"]="\x9b\x87";sjisconv["\u5bd2"]="\x8a\xa6";sjisconv["\u5bd3"]="\x8b\xf5";sjisconv["\u5bd4"]="\x9b\x86";sjisconv["\u5bdb"]="\x8a\xb0";sjisconv["\u5bdd"]="\x90Q";sjisconv["\u5bde"]="\x9b\x8b";sjisconv["\u5bdf"]="\x8e@";sjisconv["\u5be1"]="\x89\xc7";sjisconv["\u5be2"]="\x9b\x8a";sjisconv["\u5be4"]="\x9b\x88";sjisconv["\u5be5"]="\x9b\x8c";sjisconv["\u5be6"]="\x9b\x89";sjisconv["\u5be7"]="\x94J";sjisconv["\u5be8"]="\x9e\xcb";
          sjisconv["\u5be9"]="\x90R";sjisconv["\u5beb"]="\x9b\x8d";sjisconv["\u5bee"]="\x97\xbe";sjisconv["\u5bf0"]="\x9b\x8e";sjisconv["\u5bf3"]="\x9b\x90";sjisconv["\u5bf5"]="\x92\x9e";sjisconv["\u5bf6"]="\x9b\x8f";sjisconv["\u5bf8"]="\x90\xa1";sjisconv["\u5bfa"]="\x8e\x9b";sjisconv["\u5bfe"]="\x91\xce";sjisconv["\u5bff"]="\x8e\xf5";sjisconv["\u5c01"]="\x95\x95";sjisconv["\u5c02"]="\x90\xea";sjisconv["\u5c04"]="\x8e\xcb";sjisconv["\u5c05"]="\x9b\x91";sjisconv["\u5c06"]="\x8f\xab";sjisconv["\u5c07"]="\x9b\x92";
          sjisconv["\u5c08"]="\x9b\x93";sjisconv["\u5c09"]="\x88\xd1";sjisconv["\u5c0a"]="\x91\xb8";sjisconv["\u5c0b"]="\x90q";sjisconv["\u5c0d"]="\x9b\x94";sjisconv["\u5c0e"]="\x93\xb1";sjisconv["\u5c0f"]="\x8f\xac";sjisconv["\u5c11"]="\x8f\xad";sjisconv["\u5c13"]="\x9b\x95";sjisconv["\u5c16"]="\x90\xeb";sjisconv["\u5c1a"]="\x8f\xae";sjisconv["\u5c20"]="\x9b\x96";sjisconv["\u5c22"]="\x9b\x97";sjisconv["\u5c24"]="\x96\xde";sjisconv["\u5c28"]="\x9b\x98";sjisconv["\u5c2d"]="\x8b\xc4";sjisconv["\u5c31"]="\x8fA";
          sjisconv["\u5c38"]="\x9b\x99";sjisconv["\u5c39"]="\x9b\x9a";sjisconv["\u5c3a"]="\x8e\xda";sjisconv["\u5c3b"]="\x90K";sjisconv["\u5c3c"]="\x93\xf2";sjisconv["\u5c3d"]="\x90s";sjisconv["\u5c3e"]="\x94\xf6";sjisconv["\u5c3f"]="\x94A";sjisconv["\u5c40"]="\x8b\xc7";sjisconv["\u5c41"]="\x9b\x9b";sjisconv["\u5c45"]="\x8b\x8f";sjisconv["\u5c46"]="\x9b\x9c";sjisconv["\u5c48"]="\x8b\xfc";sjisconv["\u5c4a"]="\x93\xcd";sjisconv["\u5c4b"]="\x89\xae";sjisconv["\u5c4d"]="\x8er";sjisconv["\u5c4e"]="\x9b\x9d";sjisconv["\u5c4f"]="\x9b\xa0";
          sjisconv["\u5c50"]="\x9b\x9f";sjisconv["\u5c51"]="\x8b\xfb";sjisconv["\u5c53"]="\x9b\x9e";sjisconv["\u5c55"]="\x93W";sjisconv["\u5c5e"]="\x91\xae";sjisconv["\u5c60"]="\x93j";sjisconv["\u5c61"]="\x8e\xc6";sjisconv["\u5c64"]="\x91w";sjisconv["\u5c65"]="\x97\x9a";sjisconv["\u5c6c"]="\x9b\xa2";sjisconv["\u5c6e"]="\x9b\xa3";sjisconv["\u5c6f"]="\x93\xd4";sjisconv["\u5c71"]="\x8eR";sjisconv["\u5c76"]="\x9b\xa5";sjisconv["\u5c79"]="\x9b\xa6";sjisconv["\u5c8c"]="\x9b\xa7";sjisconv["\u5c90"]="\x8a\xf2";sjisconv["\u5c91"]="\x9b\xa8";
          sjisconv["\u5c94"]="\x9b\xa9";sjisconv["\u5ca1"]="\x89\xaa";sjisconv["\u5ca8"]="\x91Z";sjisconv["\u5ca9"]="\x8a\xe2";sjisconv["\u5cab"]="\x9b\xab";sjisconv["\u5cac"]="\x96\xa6";sjisconv["\u5cb1"]="\x91\xd0";sjisconv["\u5cb3"]="\x8ax";sjisconv["\u5cb6"]="\x9b\xad";sjisconv["\u5cb7"]="\x9b\xaf";sjisconv["\u5cb8"]="\x8a\xdd";sjisconv["\u5cbb"]="\x9b\xac";sjisconv["\u5cbc"]="\x9b\xae";sjisconv["\u5cbe"]="\x9b\xb1";sjisconv["\u5cc5"]="\x9b\xb0";sjisconv["\u5cc7"]="\x9b\xb2";sjisconv["\u5cd9"]="\x9b\xb3";
          sjisconv["\u5ce0"]="\x93\xbb";sjisconv["\u5ce1"]="\x8b\xac";sjisconv["\u5ce8"]="\x89\xe3";sjisconv["\u5ce9"]="\x9b\xb4";sjisconv["\u5cea"]="\x9b\xb9";sjisconv["\u5ced"]="\x9b\xb7";sjisconv["\u5cef"]="\x95\xf5";sjisconv["\u5cf0"]="\x95\xf4";sjisconv["\u5cf6"]="\x93\x87";sjisconv["\u5cfa"]="\x9b\xb6";sjisconv["\u5cfb"]="\x8fs";sjisconv["\u5cfd"]="\x9b\xb5";sjisconv["\u5d07"]="\x90\x92";sjisconv["\u5d0b"]="\x9b\xba";sjisconv["\u5d0e"]="\x8d\xe8";sjisconv["\u5d11"]="\x9b\xc0";sjisconv["\u5d14"]="\x9b\xc1";
          sjisconv["\u5d15"]="\x9b\xbb";sjisconv["\u5d16"]="\x8aR";sjisconv["\u5d17"]="\x9b\xbc";sjisconv["\u5d18"]="\x9b\xc5";sjisconv["\u5d19"]="\x9b\xc4";sjisconv["\u5d1a"]="\x9b\xc3";sjisconv["\u5d1b"]="\x9b\xbf";sjisconv["\u5d1f"]="\x9b\xbe";sjisconv["\u5d22"]="\x9b\xc2";sjisconv["\u5d29"]="\x95\xf6";sjisconv["\u5d4b"]="\x9b\xc9";sjisconv["\u5d4c"]="\x9b\xc6";sjisconv["\u5d4e"]="\x9b\xc8";sjisconv["\u5d50"]="\x97\x92";sjisconv["\u5d52"]="\x9b\xc7";sjisconv["\u5d5c"]="\x9b\xbd";sjisconv["\u5d69"]="\x90\x93";
          sjisconv["\u5d6c"]="\x9b\xca";sjisconv["\u5d6f"]="\x8d\xb5";sjisconv["\u5d73"]="\x9b\xcb";sjisconv["\u5d76"]="\x9b\xcc";sjisconv["\u5d82"]="\x9b\xcf";sjisconv["\u5d84"]="\x9b\xce";sjisconv["\u5d87"]="\x9b\xcd";sjisconv["\u5d8b"]="\x93\x88";sjisconv["\u5d8c"]="\x9b\xb8";sjisconv["\u5d90"]="\x9b\xd5";sjisconv["\u5d9d"]="\x9b\xd1";sjisconv["\u5da2"]="\x9b\xd0";sjisconv["\u5dac"]="\x9b\xd2";sjisconv["\u5dae"]="\x9b\xd3";sjisconv["\u5db7"]="\x9b\xd6";sjisconv["\u5dba"]="\x97\xe4";sjisconv["\u5dbc"]="\x9b\xd7";
          sjisconv["\u5dbd"]="\x9b\xd4";sjisconv["\u5dc9"]="\x9b\xd8";sjisconv["\u5dcc"]="\x8a\xde";sjisconv["\u5dcd"]="\x9b\xd9";sjisconv["\u5dd2"]="\x9b\xdb";sjisconv["\u5dd3"]="\x9b\xda";sjisconv["\u5dd6"]="\x9b\xdc";sjisconv["\u5ddb"]="\x9b\xdd";sjisconv["\u5ddd"]="\x90\xec";sjisconv["\u5dde"]="\x8fB";sjisconv["\u5de1"]="\x8f\x84";sjisconv["\u5de3"]="\x91\x83";sjisconv["\u5de5"]="\x8dH";sjisconv["\u5de6"]="\x8d\xb6";sjisconv["\u5de7"]="\x8dI";sjisconv["\u5de8"]="\x8b\x90";sjisconv["\u5deb"]="\x9b\xde";
          sjisconv["\u5dee"]="\x8d\xb7";sjisconv["\u5df1"]="\x8c\xc8";sjisconv["\u5df2"]="\x9b\xdf";sjisconv["\u5df3"]="\x96\xa4";sjisconv["\u5df4"]="\x94b";sjisconv["\u5df5"]="\x9b\xe0";sjisconv["\u5df7"]="\x8dJ";sjisconv["\u5dfb"]="\x8a\xaa";sjisconv["\u5dfd"]="\x92F";sjisconv["\u5dfe"]="\x8b\xd0";sjisconv["\u5e02"]="\x8es";sjisconv["\u5e03"]="\x95z";sjisconv["\u5e06"]="\x94\xbf";sjisconv["\u5e0b"]="\x9b\xe1";sjisconv["\u5e0c"]="\x8a\xf3";sjisconv["\u5e11"]="\x9b\xe4";sjisconv["\u5e16"]="\x92\x9f";sjisconv["\u5e19"]="\x9b\xe3";
          sjisconv["\u5e1a"]="\x9b\xe2";sjisconv["\u5e1b"]="\x9b\xe5";sjisconv["\u5e1d"]="\x92\xe9";sjisconv["\u5e25"]="\x90\x83";sjisconv["\u5e2b"]="\x8et";sjisconv["\u5e2d"]="\x90\xc8";sjisconv["\u5e2f"]="\x91\xd1";sjisconv["\u5e30"]="\x8bA";sjisconv["\u5e33"]="\x92\xa0";sjisconv["\u5e36"]="\x9b\xe6";sjisconv["\u5e37"]="\x9b\xe7";sjisconv["\u5e38"]="\x8f\xed";sjisconv["\u5e3d"]="\x96X";sjisconv["\u5e40"]="\x9b\xea";sjisconv["\u5e43"]="\x9b\xe9";sjisconv["\u5e44"]="\x9b\xe8";sjisconv["\u5e45"]="\x95\x9d";
          sjisconv["\u5e47"]="\x9b\xf1";sjisconv["\u5e4c"]="\x96y";sjisconv["\u5e4e"]="\x9b\xeb";sjisconv["\u5e54"]="\x9b\xed";sjisconv["\u5e55"]="\x96\x8b";sjisconv["\u5e57"]="\x9b\xec";sjisconv["\u5e5f"]="\x9b\xee";sjisconv["\u5e61"]="\x94\xa6";sjisconv["\u5e62"]="\x9b\xef";sjisconv["\u5e63"]="\x95\xbc";sjisconv["\u5e64"]="\x9b\xf0";sjisconv["\u5e72"]="\x8a\xb1";sjisconv["\u5e73"]="\x95\xbd";sjisconv["\u5e74"]="\x94N";sjisconv["\u5e75"]="\x9b\xf2";sjisconv["\u5e76"]="\x9b\xf3";sjisconv["\u5e78"]="\x8dK";
          sjisconv["\u5e79"]="\x8a\xb2";sjisconv["\u5e7a"]="\x9b\xf4";sjisconv["\u5e7b"]="\x8c\xb6";sjisconv["\u5e7c"]="\x97c";sjisconv["\u5e7d"]="\x97H";sjisconv["\u5e7e"]="\x8a\xf4";sjisconv["\u5e7f"]="\x9b\xf6";sjisconv["\u5e81"]="\x92\xa1";sjisconv["\u5e83"]="\x8dL";sjisconv["\u5e84"]="\x8f\xaf";sjisconv["\u5e87"]="\x94\xdd";sjisconv["\u5e8a"]="\x8f\xb0";sjisconv["\u5e8f"]="\x8f\x98";sjisconv["\u5e95"]="\x92\xea";sjisconv["\u5e96"]="\x95\xf7";sjisconv["\u5e97"]="\x93X";sjisconv["\u5e9a"]="\x8dM";sjisconv["\u5e9c"]="\x95{";
          sjisconv["\u5ea0"]="\x9b\xf7";sjisconv["\u5ea6"]="\x93x";sjisconv["\u5ea7"]="\x8d\xc0";sjisconv["\u5eab"]="\x8c\xc9";sjisconv["\u5ead"]="\x92\xeb";sjisconv["\u5eb5"]="\x88\xc1";sjisconv["\u5eb6"]="\x8f\x8e";sjisconv["\u5eb7"]="\x8dN";sjisconv["\u5eb8"]="\x97f";sjisconv["\u5ec1"]="\x9b\xf8";sjisconv["\u5ec2"]="\x9b\xf9";sjisconv["\u5ec3"]="\x94p";sjisconv["\u5ec8"]="\x9b\xfa";sjisconv["\u5ec9"]="\x97\xf5";sjisconv["\u5eca"]="\x98L";sjisconv["\u5ecf"]="\x9b\xfc";sjisconv["\u5ed0"]="\x9b\xfb";sjisconv["\u5ed3"]="\x8af";
          sjisconv["\u5ed6"]="\x9c@";sjisconv["\u5eda"]="\x9cC";sjisconv["\u5edb"]="\x9cD";sjisconv["\u5edd"]="\x9cB";sjisconv["\u5edf"]="\x95_";sjisconv["\u5ee0"]="\x8f\xb1";sjisconv["\u5ee1"]="\x9cF";sjisconv["\u5ee2"]="\x9cE";sjisconv["\u5ee3"]="\x9cA";sjisconv["\u5ee8"]="\x9cG";sjisconv["\u5ee9"]="\x9cH";sjisconv["\u5eec"]="\x9cI";sjisconv["\u5ef0"]="\x9cL";sjisconv["\u5ef1"]="\x9cJ";sjisconv["\u5ef3"]="\x9cK";sjisconv["\u5ef4"]="\x9cM";sjisconv["\u5ef6"]="\x89\x84";sjisconv["\u5ef7"]="\x92\xec";sjisconv["\u5ef8"]="\x9cN";
          sjisconv["\u5efa"]="\x8c\x9a";sjisconv["\u5efb"]="\x89\xf4";sjisconv["\u5efc"]="\x94U";sjisconv["\u5efe"]="\x9cO";sjisconv["\u5eff"]="\x93\xf9";sjisconv["\u5f01"]="\x95\xd9";sjisconv["\u5f03"]="\x9cP";sjisconv["\u5f04"]="\x98M";sjisconv["\u5f09"]="\x9cQ";sjisconv["\u5f0a"]="\x95\xbe";sjisconv["\u5f0b"]="\x9cT";sjisconv["\u5f0c"]="\x98\x9f";sjisconv["\u5f0d"]="\x98\xaf";sjisconv["\u5f0f"]="\x8e\xae";sjisconv["\u5f10"]="\x93\xf3";sjisconv["\u5f11"]="\x9cU";sjisconv["\u5f13"]="\x8b|";sjisconv["\u5f14"]="\x92\xa2";
          sjisconv["\u5f15"]="\x88\xf8";sjisconv["\u5f16"]="\x9cV";sjisconv["\u5f17"]="\x95\xa4";sjisconv["\u5f18"]="\x8dO";sjisconv["\u5f1b"]="\x92o";sjisconv["\u5f1f"]="\x92\xed";sjisconv["\u5f25"]="\x96\xed";sjisconv["\u5f26"]="\x8c\xb7";sjisconv["\u5f27"]="\x8c\xca";sjisconv["\u5f29"]="\x9cW";sjisconv["\u5f2d"]="\x9cX";sjisconv["\u5f2f"]="\x9c^";sjisconv["\u5f31"]="\x8e\xe3";sjisconv["\u5f35"]="\x92\xa3";sjisconv["\u5f37"]="\x8b\xad";sjisconv["\u5f38"]="\x9cY";sjisconv["\u5f3c"]="\x95J";sjisconv["\u5f3e"]="\x92e";
          sjisconv["\u5f41"]="\x9cZ";sjisconv["\u5f48"]="\x9c[";sjisconv["\u5f4a"]="\x8b\xae";sjisconv["\u5f4c"]="\x9c\\";sjisconv["\u5f4e"]="\x9c]";sjisconv["\u5f51"]="\x9c_";sjisconv["\u5f53"]="\x93\x96";sjisconv["\u5f56"]="\x9c`";sjisconv["\u5f57"]="\x9ca";sjisconv["\u5f59"]="\x9cb";sjisconv["\u5f5c"]="\x9cS";sjisconv["\u5f5d"]="\x9cR";sjisconv["\u5f61"]="\x9cc";sjisconv["\u5f62"]="\x8c`";sjisconv["\u5f66"]="\x95F";sjisconv["\u5f69"]="\x8d\xca";sjisconv["\u5f6a"]="\x95V";sjisconv["\u5f6b"]="\x92\xa4";sjisconv["\u5f6c"]="\x95j";
          sjisconv["\u5f6d"]="\x9cd";sjisconv["\u5f70"]="\x8f\xb2";sjisconv["\u5f71"]="\x89e";sjisconv["\u5f73"]="\x9ce";sjisconv["\u5f77"]="\x9cf";sjisconv["\u5f79"]="\x96\xf0";sjisconv["\u5f7c"]="\x94\xde";sjisconv["\u5f7f"]="\x9ci";sjisconv["\u5f80"]="\x89\x9d";sjisconv["\u5f81"]="\x90\xaa";sjisconv["\u5f82"]="\x9ch";sjisconv["\u5f83"]="\x9cg";sjisconv["\u5f84"]="\x8ca";sjisconv["\u5f85"]="\x91\xd2";sjisconv["\u5f87"]="\x9cm";sjisconv["\u5f88"]="\x9ck";sjisconv["\u5f8a"]="\x9cj";sjisconv["\u5f8b"]="\x97\xa5";
          sjisconv["\u5f8c"]="\x8c\xe3";sjisconv["\u5f90"]="\x8f\x99";sjisconv["\u5f91"]="\x9cl";sjisconv["\u5f92"]="\x93k";sjisconv["\u5f93"]="\x8f]";sjisconv["\u5f97"]="\x93\xbe";sjisconv["\u5f98"]="\x9cp";sjisconv["\u5f99"]="\x9co";sjisconv["\u5f9e"]="\x9cn";sjisconv["\u5fa0"]="\x9cq";sjisconv["\u5fa1"]="\x8c\xe4";sjisconv["\u5fa8"]="\x9cr";sjisconv["\u5fa9"]="\x95\x9c";sjisconv["\u5faa"]="\x8fz";sjisconv["\u5fad"]="\x9cs";sjisconv["\u5fae"]="\x94\xf7";sjisconv["\u5fb3"]="\x93\xbf";sjisconv["\u5fb4"]="\x92\xa5";
          sjisconv["\u5fb9"]="\x93O";sjisconv["\u5fbc"]="\x9ct";sjisconv["\u5fbd"]="\x8bJ";sjisconv["\u5fc3"]="\x90S";sjisconv["\u5fc5"]="\x95K";sjisconv["\u5fcc"]="\x8a\xf5";sjisconv["\u5fcd"]="\x94E";sjisconv["\u5fd6"]="\x9cu";sjisconv["\u5fd7"]="\x8eu";sjisconv["\u5fd8"]="\x96Y";sjisconv["\u5fd9"]="\x96Z";sjisconv["\u5fdc"]="\x89\x9e";sjisconv["\u5fdd"]="\x9cz";sjisconv["\u5fe0"]="\x92\x89";sjisconv["\u5fe4"]="\x9cw";sjisconv["\u5feb"]="\x89\xf5";sjisconv["\u5ff0"]="\x9c\xab";sjisconv["\u5ff1"]="\x9cy";
          sjisconv["\u5ff5"]="\x94O";sjisconv["\u5ff8"]="\x9cx";sjisconv["\u5ffb"]="\x9cv";sjisconv["\u5ffd"]="\x8d\x9a";sjisconv["\u5fff"]="\x9c|";sjisconv["\u600e"]="\x9c\x83";sjisconv["\u600f"]="\x9c\x89";sjisconv["\u6010"]="\x9c\x81";sjisconv["\u6012"]="\x93{";sjisconv["\u6015"]="\x9c\x86";sjisconv["\u6016"]="\x95|";sjisconv["\u6019"]="\x9c\x80";sjisconv["\u601b"]="\x9c\x85";sjisconv["\u601c"]="\x97\xe5";sjisconv["\u601d"]="\x8ev";sjisconv["\u6020"]="\x91\xd3";sjisconv["\u6021"]="\x9c}";sjisconv["\u6025"]="\x8b}";
          sjisconv["\u6026"]="\x9c\x88";sjisconv["\u6027"]="\x90\xab";sjisconv["\u6028"]="\x89\x85";sjisconv["\u6029"]="\x9c\x82";sjisconv["\u602a"]="\x89\xf6";sjisconv["\u602b"]="\x9c\x87";sjisconv["\u602f"]="\x8b\xaf";sjisconv["\u6031"]="\x9c\x84";sjisconv["\u603a"]="\x9c\x8a";sjisconv["\u6041"]="\x9c\x8c";sjisconv["\u6042"]="\x9c\x96";sjisconv["\u6043"]="\x9c\x94";sjisconv["\u6046"]="\x9c\x91";sjisconv["\u604a"]="\x9c\x90";sjisconv["\u604b"]="\x97\xf6";sjisconv["\u604d"]="\x9c\x92";sjisconv["\u6050"]="\x8b\xb0";
          sjisconv["\u6052"]="\x8dP";sjisconv["\u6055"]="\x8f\x9a";sjisconv["\u6059"]="\x9c\x99";sjisconv["\u605a"]="\x9c\x8b";sjisconv["\u605f"]="\x9c\x8f";sjisconv["\u6060"]="\x9c~";sjisconv["\u6062"]="\x89\xf8";sjisconv["\u6063"]="\x9c\x93";sjisconv["\u6064"]="\x9c\x95";sjisconv["\u6065"]="\x92p";sjisconv["\u6068"]="\x8d\xa6";sjisconv["\u6069"]="\x89\xb6";sjisconv["\u606a"]="\x9c\x8d";sjisconv["\u606b"]="\x9c\x98";sjisconv["\u606c"]="\x9c\x97";sjisconv["\u606d"]="\x8b\xb1";sjisconv["\u606f"]="\x91\xa7";
          sjisconv["\u6070"]="\x8a\x86";sjisconv["\u6075"]="\x8cb";sjisconv["\u6077"]="\x9c\x8e";sjisconv["\u6081"]="\x9c\x9a";sjisconv["\u6083"]="\x9c\x9d";sjisconv["\u6084"]="\x9c\x9f";sjisconv["\u6089"]="\x8e\xbb";sjisconv["\u608b"]="\x9c\xa5";sjisconv["\u608c"]="\x92\xee";sjisconv["\u608d"]="\x9c\x9b";sjisconv["\u6092"]="\x9c\xa3";sjisconv["\u6094"]="\x89\xf7";sjisconv["\u6096"]="\x9c\xa1";sjisconv["\u6097"]="\x9c\xa2";sjisconv["\u609a"]="\x9c\x9e";sjisconv["\u609b"]="\x9c\xa0";sjisconv["\u609f"]="\x8c\xe5";
          sjisconv["\u60a0"]="\x97I";sjisconv["\u60a3"]="\x8a\xb3";sjisconv["\u60a6"]="\x89x";sjisconv["\u60a7"]="\x9c\xa4";sjisconv["\u60a9"]="\x94Y";sjisconv["\u60aa"]="\x88\xab";sjisconv["\u60b2"]="\x94\xdf";sjisconv["\u60b3"]="\x9c{";sjisconv["\u60b4"]="\x9c\xaa";sjisconv["\u60b5"]="\x9c\xae";sjisconv["\u60b6"]="\x96\xe3";sjisconv["\u60b8"]="\x9c\xa7";sjisconv["\u60bc"]="\x93\x89";sjisconv["\u60bd"]="\x9c\xac";sjisconv["\u60c5"]="\x8f\xee";sjisconv["\u60c6"]="\x9c\xad";sjisconv["\u60c7"]="\x93\xd5";sjisconv["\u60d1"]="\x98f";
          sjisconv["\u60d3"]="\x9c\xa9";sjisconv["\u60d8"]="\x9c\xaf";sjisconv["\u60da"]="\x8d\x9b";sjisconv["\u60dc"]="\x90\xc9";sjisconv["\u60df"]="\x88\xd2";sjisconv["\u60e0"]="\x9c\xa8";sjisconv["\u60e1"]="\x9c\xa6";sjisconv["\u60e3"]="\x91y";sjisconv["\u60e7"]="\x9c\x9c";sjisconv["\u60e8"]="\x8eS";sjisconv["\u60f0"]="\x91\xc4";sjisconv["\u60f1"]="\x9c\xbb";sjisconv["\u60f3"]="\x91z";sjisconv["\u60f4"]="\x9c\xb6";sjisconv["\u60f6"]="\x9c\xb3";sjisconv["\u60f7"]="\x9c\xb4";sjisconv["\u60f9"]="\x8e\xe4";
          sjisconv["\u60fa"]="\x9c\xb7";sjisconv["\u60fb"]="\x9c\xba";sjisconv["\u6100"]="\x9c\xb5";sjisconv["\u6101"]="\x8fD";sjisconv["\u6103"]="\x9c\xb8";sjisconv["\u6106"]="\x9c\xb2";sjisconv["\u6108"]="\x96\xfa";sjisconv["\u6109"]="\x96\xf9";sjisconv["\u610d"]="\x9c\xbc";sjisconv["\u610e"]="\x9c\xbd";sjisconv["\u610f"]="\x88\xd3";sjisconv["\u6115"]="\x9c\xb1";sjisconv["\u611a"]="\x8b\xf0";sjisconv["\u611b"]="\x88\xa4";sjisconv["\u611f"]="\x8a\xb4";sjisconv["\u6121"]="\x9c\xb9";sjisconv["\u6127"]="\x9c\xc1";
          sjisconv["\u6128"]="\x9c\xc0";sjisconv["\u612c"]="\x9c\xc5";sjisconv["\u6134"]="\x9c\xc6";sjisconv["\u613c"]="\x9c\xc4";sjisconv["\u613d"]="\x9c\xc7";sjisconv["\u613e"]="\x9c\xbf";sjisconv["\u613f"]="\x9c\xc3";sjisconv["\u6142"]="\x9c\xc8";sjisconv["\u6144"]="\x9c\xc9";sjisconv["\u6147"]="\x9c\xbe";sjisconv["\u6148"]="\x8e\x9c";sjisconv["\u614a"]="\x9c\xc2";sjisconv["\u614b"]="\x91\xd4";sjisconv["\u614c"]="\x8dQ";sjisconv["\u614d"]="\x9c\xb0";sjisconv["\u614e"]="\x90T";sjisconv["\u6153"]="\x9c\xd6";
          sjisconv["\u6155"]="\x95\xe7";sjisconv["\u6158"]="\x9c\xcc";sjisconv["\u6159"]="\x9c\xcd";sjisconv["\u615a"]="\x9c\xce";sjisconv["\u615d"]="\x9c\xd5";sjisconv["\u615f"]="\x9c\xd4";sjisconv["\u6162"]="\x96\x9d";sjisconv["\u6163"]="\x8a\xb5";sjisconv["\u6165"]="\x9c\xd2";sjisconv["\u6167"]="\x8cd";sjisconv["\u6168"]="\x8aS";sjisconv["\u616b"]="\x9c\xcf";sjisconv["\u616e"]="\x97\xb6";sjisconv["\u616f"]="\x9c\xd1";sjisconv["\u6170"]="\x88\xd4";sjisconv["\u6171"]="\x9c\xd3";sjisconv["\u6173"]="\x9c\xca";
          sjisconv["\u6174"]="\x9c\xd0";sjisconv["\u6175"]="\x9c\xd7";sjisconv["\u6176"]="\x8cc";sjisconv["\u6177"]="\x9c\xcb";sjisconv["\u617e"]="\x97|";sjisconv["\u6182"]="\x97J";sjisconv["\u6187"]="\x9c\xda";sjisconv["\u618a"]="\x9c\xde";sjisconv["\u618e"]="\x91\x9e";sjisconv["\u6190"]="\x97\xf7";sjisconv["\u6191"]="\x9c\xdf";sjisconv["\u6194"]="\x9c\xdc";sjisconv["\u6196"]="\x9c\xd9";sjisconv["\u6199"]="\x9c\xd8";sjisconv["\u619a"]="\x9c\xdd";sjisconv["\u61a4"]="\x95\xae";sjisconv["\u61a7"]="\x93\xb2";
          sjisconv["\u61a9"]="\x8ce";sjisconv["\u61ab"]="\x9c\xe0";sjisconv["\u61ac"]="\x9c\xdb";sjisconv["\u61ae"]="\x9c\xe1";sjisconv["\u61b2"]="\x8c\x9b";sjisconv["\u61b6"]="\x89\xaf";sjisconv["\u61ba"]="\x9c\xe9";sjisconv["\u61be"]="\x8a\xb6";sjisconv["\u61c3"]="\x9c\xe7";sjisconv["\u61c6"]="\x9c\xe8";sjisconv["\u61c7"]="\x8d\xa7";sjisconv["\u61c8"]="\x9c\xe6";sjisconv["\u61c9"]="\x9c\xe4";sjisconv["\u61ca"]="\x9c\xe3";sjisconv["\u61cb"]="\x9c\xea";sjisconv["\u61cc"]="\x9c\xe2";sjisconv["\u61cd"]="\x9c\xec";
          sjisconv["\u61d0"]="\x89\xf9";sjisconv["\u61e3"]="\x9c\xee";sjisconv["\u61e6"]="\x9c\xed";sjisconv["\u61f2"]="\x92\xa6";sjisconv["\u61f4"]="\x9c\xf1";sjisconv["\u61f6"]="\x9c\xef";sjisconv["\u61f7"]="\x9c\xe5";sjisconv["\u61f8"]="\x8c\x9c";sjisconv["\u61fa"]="\x9c\xf0";sjisconv["\u61fc"]="\x9c\xf4";sjisconv["\u61fd"]="\x9c\xf3";sjisconv["\u61fe"]="\x9c\xf5";sjisconv["\u61ff"]="\x9c\xf2";sjisconv["\u6200"]="\x9c\xf6";sjisconv["\u6208"]="\x9c\xf7";sjisconv["\u6209"]="\x9c\xf8";sjisconv["\u620a"]="\x95\xe8";
          sjisconv["\u620c"]="\x9c\xfa";sjisconv["\u620d"]="\x9c\xf9";sjisconv["\u620e"]="\x8f^";sjisconv["\u6210"]="\x90\xac";sjisconv["\u6211"]="\x89\xe4";sjisconv["\u6212"]="\x89\xfa";sjisconv["\u6214"]="\x9c\xfb";sjisconv["\u6216"]="\x88\xbd";sjisconv["\u621a"]="\x90\xca";sjisconv["\u621b"]="\x9c\xfc";sjisconv["\u621d"]="\xe6\xc1";sjisconv["\u621e"]="\x9d@";sjisconv["\u621f"]="\x8c\x81";sjisconv["\u6221"]="\x9dA";sjisconv["\u6226"]="\x90\xed";sjisconv["\u622a"]="\x9dB";sjisconv["\u622e"]="\x9dC";sjisconv["\u622f"]="\x8bY";
          sjisconv["\u6230"]="\x9dD";sjisconv["\u6232"]="\x9dE";sjisconv["\u6233"]="\x9dF";sjisconv["\u6234"]="\x91\xd5";sjisconv["\u6238"]="\x8c\xcb";sjisconv["\u623b"]="\x96\xdf";sjisconv["\u623f"]="\x96[";sjisconv["\u6240"]="\x8f\x8a";sjisconv["\u6241"]="\x9dG";sjisconv["\u6247"]="\x90\xee";sjisconv["\u6248"]="\xe7\xbb";sjisconv["\u6249"]="\x94\xe0";sjisconv["\u624b"]="\x8e\xe8";sjisconv["\u624d"]="\x8d\xcb";sjisconv["\u624e"]="\x9dH";sjisconv["\u6253"]="\x91\xc5";sjisconv["\u6255"]="\x95\xa5";sjisconv["\u6258"]="\x91\xef";
          sjisconv["\u625b"]="\x9dK";sjisconv["\u625e"]="\x9dI";sjisconv["\u6260"]="\x9dL";sjisconv["\u6263"]="\x9dJ";sjisconv["\u6268"]="\x9dM";sjisconv["\u626e"]="\x95\xaf";sjisconv["\u6271"]="\x88\xb5";sjisconv["\u6276"]="\x95}";sjisconv["\u6279"]="\x94\xe1";sjisconv["\u627c"]="\x9dN";sjisconv["\u627e"]="\x9dQ";sjisconv["\u627f"]="\x8f\xb3";sjisconv["\u6280"]="\x8bZ";sjisconv["\u6282"]="\x9dO";sjisconv["\u6283"]="\x9dV";sjisconv["\u6284"]="\x8f\xb4";sjisconv["\u6289"]="\x9dP";sjisconv["\u628a"]="\x94c";
          sjisconv["\u6291"]="\x97}";sjisconv["\u6292"]="\x9dR";sjisconv["\u6293"]="\x9dS";sjisconv["\u6294"]="\x9dW";sjisconv["\u6295"]="\x93\x8a";sjisconv["\u6296"]="\x9dT";sjisconv["\u6297"]="\x8dR";sjisconv["\u6298"]="\x90\xdc";sjisconv["\u629b"]="\x9de";sjisconv["\u629c"]="\x94\xb2";sjisconv["\u629e"]="\x91\xf0";sjisconv["\u62ab"]="\x94\xe2";sjisconv["\u62ac"]="\x9d\xab";sjisconv["\u62b1"]="\x95\xf8";sjisconv["\u62b5"]="\x92\xef";sjisconv["\u62b9"]="\x96\x95";sjisconv["\u62bb"]="\x9dZ";sjisconv["\u62bc"]="\x89\x9f";
          sjisconv["\u62bd"]="\x92\x8a";sjisconv["\u62c2"]="\x9dc";sjisconv["\u62c5"]="\x92S";sjisconv["\u62c6"]="\x9d]";sjisconv["\u62c7"]="\x9dd";sjisconv["\u62c8"]="\x9d_";sjisconv["\u62c9"]="\x9df";sjisconv["\u62ca"]="\x9db";sjisconv["\u62cc"]="\x9da";sjisconv["\u62cd"]="\x94\x8f";sjisconv["\u62cf"]="\x9d[";sjisconv["\u62d0"]="\x89\xfb";sjisconv["\u62d1"]="\x9dY";sjisconv["\u62d2"]="\x8b\x91";sjisconv["\u62d3"]="\x91\xf1";sjisconv["\u62d4"]="\x9dU";sjisconv["\u62d7"]="\x9dX";sjisconv["\u62d8"]="\x8dS";
          sjisconv["\u62d9"]="\x90\xd9";sjisconv["\u62db"]="\x8f\xb5";sjisconv["\u62dc"]="\x9d`";sjisconv["\u62dd"]="\x94q";sjisconv["\u62e0"]="\x8b\x92";sjisconv["\u62e1"]="\x8ag";sjisconv["\u62ec"]="\x8a\x87";sjisconv["\u62ed"]="\x90@";sjisconv["\u62ee"]="\x9dh";sjisconv["\u62ef"]="\x9dm";sjisconv["\u62f1"]="\x9di";sjisconv["\u62f3"]="\x8c\x9d";sjisconv["\u62f5"]="\x9dn";sjisconv["\u62f6"]="\x8eA";sjisconv["\u62f7"]="\x8d\x89";sjisconv["\u62fe"]="\x8fE";sjisconv["\u62ff"]="\x9d\\";sjisconv["\u6301"]="\x8e\x9d";
          sjisconv["\u6302"]="\x9dk";sjisconv["\u6307"]="\x8ew";sjisconv["\u6308"]="\x9dl";sjisconv["\u6309"]="\x88\xc2";sjisconv["\u630c"]="\x9dg";sjisconv["\u6311"]="\x92\xa7";sjisconv["\u6319"]="\x8b\x93";sjisconv["\u631f"]="\x8b\xb2";sjisconv["\u6327"]="\x9dj";sjisconv["\u6328"]="\x88\xa5";sjisconv["\u632b"]="\x8d\xc1";sjisconv["\u632f"]="\x90U";sjisconv["\u633a"]="\x92\xf0";sjisconv["\u633d"]="\x94\xd2";sjisconv["\u633e"]="\x9dp";sjisconv["\u633f"]="\x91}";sjisconv["\u6349"]="\x91\xa8";sjisconv["\u634c"]="\x8eJ";
          sjisconv["\u634d"]="\x9dq";sjisconv["\u634f"]="\x9ds";sjisconv["\u6350"]="\x9do";sjisconv["\u6355"]="\x95\xdf";sjisconv["\u6357"]="\x92\xbb";sjisconv["\u635c"]="\x91{";sjisconv["\u6367"]="\x95\xf9";sjisconv["\u6368"]="\x8e\xcc";sjisconv["\u6369"]="\x9d\x80";sjisconv["\u636b"]="\x9d~";sjisconv["\u636e"]="\x90\x98";sjisconv["\u6372"]="\x8c\x9e";sjisconv["\u6376"]="\x9dx";sjisconv["\u6377"]="\x8f\xb7";sjisconv["\u637a"]="\x93\xe6";sjisconv["\u637b"]="\x94P";sjisconv["\u6380"]="\x9dv";sjisconv["\u6383"]="\x91|";
          sjisconv["\u6388"]="\x8e\xf6";sjisconv["\u6389"]="\x9d{";sjisconv["\u638c"]="\x8f\xb6";sjisconv["\u638e"]="\x9du";sjisconv["\u638f"]="\x9dz";sjisconv["\u6392"]="\x94r";sjisconv["\u6396"]="\x9dt";sjisconv["\u6398"]="\x8c@";sjisconv["\u639b"]="\x8a|";sjisconv["\u639f"]="\x9d|";sjisconv["\u63a0"]="\x97\xa9";sjisconv["\u63a1"]="\x8d\xcc";sjisconv["\u63a2"]="\x92T";sjisconv["\u63a3"]="\x9dy";sjisconv["\u63a5"]="\x90\xda";sjisconv["\u63a7"]="\x8dT";sjisconv["\u63a8"]="\x90\x84";sjisconv["\u63a9"]="\x89\x86";
          sjisconv["\u63aa"]="\x91[";sjisconv["\u63ab"]="\x9dw";sjisconv["\u63ac"]="\x8bd";sjisconv["\u63b2"]="\x8cf";sjisconv["\u63b4"]="\x92\xcd";sjisconv["\u63b5"]="\x9d}";sjisconv["\u63bb"]="\x91~";sjisconv["\u63be"]="\x9d\x81";sjisconv["\u63c0"]="\x9d\x83";sjisconv["\u63c3"]="\x91\xb5";sjisconv["\u63c4"]="\x9d\x89";sjisconv["\u63c6"]="\x9d\x84";sjisconv["\u63c9"]="\x9d\x86";sjisconv["\u63cf"]="\x95`";sjisconv["\u63d0"]="\x92\xf1";sjisconv["\u63d2"]="\x9d\x87";sjisconv["\u63d6"]="\x97K";sjisconv["\u63da"]="\x97g";
          sjisconv["\u63db"]="\x8a\xb7";sjisconv["\u63e1"]="\x88\xac";sjisconv["\u63e3"]="\x9d\x85";sjisconv["\u63e9"]="\x9d\x82";sjisconv["\u63ee"]="\x8a\xf6";sjisconv["\u63f4"]="\x89\x87";sjisconv["\u63f6"]="\x9d\x88";sjisconv["\u63fa"]="\x97h";sjisconv["\u6406"]="\x9d\x8c";sjisconv["\u640d"]="\x91\xb9";sjisconv["\u640f"]="\x9d\x93";sjisconv["\u6413"]="\x9d\x8d";sjisconv["\u6416"]="\x9d\x8a";sjisconv["\u6417"]="\x9d\x91";sjisconv["\u641c"]="\x9dr";sjisconv["\u6426"]="\x9d\x8e";sjisconv["\u6428"]="\x9d\x92";
          sjisconv["\u642c"]="\x94\xc0";sjisconv["\u642d"]="\x93\x8b";sjisconv["\u6434"]="\x9d\x8b";sjisconv["\u6436"]="\x9d\x8f";sjisconv["\u643a"]="\x8cg";sjisconv["\u643e"]="\x8d\xef";sjisconv["\u6442"]="\x90\xdb";sjisconv["\u644e"]="\x9d\x97";sjisconv["\u6458"]="\x93E";sjisconv["\u6467"]="\x9d\x94";sjisconv["\u6469"]="\x96\x80";sjisconv["\u646f"]="\x9d\x95";sjisconv["\u6476"]="\x9d\x96";sjisconv["\u6478"]="\x96\xcc";sjisconv["\u647a"]="\x90\xa0";sjisconv["\u6483"]="\x8c\x82";sjisconv["\u6488"]="\x9d\x9d";
          sjisconv["\u6492"]="\x8eT";sjisconv["\u6493"]="\x9d\x9a";sjisconv["\u6495"]="\x9d\x99";sjisconv["\u649a"]="\x94Q";sjisconv["\u649e"]="\x93\xb3";sjisconv["\u64a4"]="\x93P";sjisconv["\u64a5"]="\x9d\x9b";sjisconv["\u64a9"]="\x9d\x9c";sjisconv["\u64ab"]="\x95\x8f";sjisconv["\u64ad"]="\x94d";sjisconv["\u64ae"]="\x8eB";sjisconv["\u64b0"]="\x90\xef";sjisconv["\u64b2"]="\x96o";sjisconv["\u64b9"]="\x8ah";sjisconv["\u64bb"]="\x9d\xa3";sjisconv["\u64bc"]="\x9d\x9e";sjisconv["\u64c1"]="\x97i";sjisconv["\u64c2"]="\x9d\xa5";
          sjisconv["\u64c5"]="\x9d\xa1";sjisconv["\u64c7"]="\x9d\xa2";sjisconv["\u64cd"]="\x91\x80";sjisconv["\u64d2"]="\x9d\xa0";sjisconv["\u64d4"]="\x9d^";sjisconv["\u64d8"]="\x9d\xa4";sjisconv["\u64da"]="\x9d\x9f";sjisconv["\u64e0"]="\x9d\xa9";sjisconv["\u64e1"]="\x9d\xaa";sjisconv["\u64e2"]="\x93F";sjisconv["\u64e3"]="\x9d\xac";sjisconv["\u64e6"]="\x8eC";sjisconv["\u64e7"]="\x9d\xa7";sjisconv["\u64ec"]="\x8b[";sjisconv["\u64ef"]="\x9d\xad";sjisconv["\u64f1"]="\x9d\xa6";sjisconv["\u64f2"]="\x9d\xb1";sjisconv["\u64f4"]="\x9d\xb0";
          sjisconv["\u64f6"]="\x9d\xaf";sjisconv["\u64fa"]="\x9d\xb2";sjisconv["\u64fd"]="\x9d\xb4";sjisconv["\u64fe"]="\x8f\xef";sjisconv["\u6500"]="\x9d\xb3";sjisconv["\u6505"]="\x9d\xb7";sjisconv["\u6518"]="\x9d\xb5";sjisconv["\u651c"]="\x9d\xb6";sjisconv["\u651d"]="\x9d\x90";sjisconv["\u6523"]="\x9d\xb9";sjisconv["\u6524"]="\x9d\xb8";sjisconv["\u652a"]="\x9d\x98";sjisconv["\u652b"]="\x9d\xba";sjisconv["\u652c"]="\x9d\xae";sjisconv["\u652f"]="\x8ex";sjisconv["\u6534"]="\x9d\xbb";sjisconv["\u6535"]="\x9d\xbc";
          sjisconv["\u6536"]="\x9d\xbe";sjisconv["\u6537"]="\x9d\xbd";sjisconv["\u6538"]="\x9d\xbf";sjisconv["\u6539"]="\x89\xfc";sjisconv["\u653b"]="\x8dU";sjisconv["\u653e"]="\x95\xfa";sjisconv["\u653f"]="\x90\xad";sjisconv["\u6545"]="\x8c\xcc";sjisconv["\u6548"]="\x9d\xc1";sjisconv["\u654d"]="\x9d\xc4";sjisconv["\u654f"]="\x95q";sjisconv["\u6551"]="\x8b~";sjisconv["\u6555"]="\x9d\xc3";sjisconv["\u6556"]="\x9d\xc2";sjisconv["\u6557"]="\x94s";sjisconv["\u6558"]="\x9d\xc5";sjisconv["\u6559"]="\x8b\xb3";sjisconv["\u655d"]="\x9d\xc7";
          sjisconv["\u655e"]="\x9d\xc6";sjisconv["\u6562"]="\x8a\xb8";sjisconv["\u6563"]="\x8eU";sjisconv["\u6566"]="\x93\xd6";sjisconv["\u656c"]="\x8ch";sjisconv["\u6570"]="\x90\x94";sjisconv["\u6572"]="\x9d\xc8";sjisconv["\u6574"]="\x90\xae";sjisconv["\u6575"]="\x93G";sjisconv["\u6577"]="\x95~";sjisconv["\u6578"]="\x9d\xc9";sjisconv["\u6582"]="\x9d\xca";sjisconv["\u6583"]="\x9d\xcb";sjisconv["\u6587"]="\x95\xb6";sjisconv["\u6588"]="\x9b|";sjisconv["\u6589"]="\x90\xc4";sjisconv["\u658c"]="\x95k";sjisconv["\u658e"]="\x8d\xd6";
          sjisconv["\u6590"]="\x94\xe3";sjisconv["\u6591"]="\x94\xc1";sjisconv["\u6597"]="\x93l";sjisconv["\u6599"]="\x97\xbf";sjisconv["\u659b"]="\x9d\xcd";sjisconv["\u659c"]="\x8e\xce";sjisconv["\u659f"]="\x9d\xce";sjisconv["\u65a1"]="\x88\xb4";sjisconv["\u65a4"]="\x8b\xd2";sjisconv["\u65a5"]="\x90\xcb";sjisconv["\u65a7"]="\x95\x80";sjisconv["\u65ab"]="\x9d\xcf";sjisconv["\u65ac"]="\x8ea";sjisconv["\u65ad"]="\x92f";sjisconv["\u65af"]="\x8ez";sjisconv["\u65b0"]="\x90V";sjisconv["\u65b7"]="\x9d\xd0";sjisconv["\u65b9"]="\x95\xfb";
          sjisconv["\u65bc"]="\x89\x97";sjisconv["\u65bd"]="\x8e{";sjisconv["\u65c1"]="\x9d\xd3";sjisconv["\u65c3"]="\x9d\xd1";sjisconv["\u65c4"]="\x9d\xd4";sjisconv["\u65c5"]="\x97\xb7";sjisconv["\u65c6"]="\x9d\xd2";sjisconv["\u65cb"]="\x90\xf9";sjisconv["\u65cc"]="\x9d\xd5";sjisconv["\u65cf"]="\x91\xb0";sjisconv["\u65d2"]="\x9d\xd6";sjisconv["\u65d7"]="\x8a\xf8";sjisconv["\u65d9"]="\x9d\xd8";sjisconv["\u65db"]="\x9d\xd7";sjisconv["\u65e0"]="\x9d\xd9";sjisconv["\u65e1"]="\x9d\xda";sjisconv["\u65e2"]="\x8a\xf9";
          sjisconv["\u65e5"]="\x93\xfa";sjisconv["\u65e6"]="\x92U";sjisconv["\u65e7"]="\x8b\x8c";sjisconv["\u65e8"]="\x8e|";sjisconv["\u65e9"]="\x91\x81";sjisconv["\u65ec"]="\x8f{";sjisconv["\u65ed"]="\x88\xae";sjisconv["\u65f1"]="\x9d\xdb";sjisconv["\u65fa"]="\x89\xa0";sjisconv["\u65fb"]="\x9d\xdf";sjisconv["\u6602"]="\x8dV";sjisconv["\u6603"]="\x9d\xde";sjisconv["\u6606"]="\x8d\xa9";sjisconv["\u6607"]="\x8f\xb8";sjisconv["\u660a"]="\x9d\xdd";sjisconv["\u660c"]="\x8f\xb9";sjisconv["\u660e"]="\x96\xbe";sjisconv["\u660f"]="\x8d\xa8";
          sjisconv["\u6613"]="\x88\xd5";sjisconv["\u6614"]="\x90\xcc";sjisconv["\u661c"]="\x9d\xe4";sjisconv["\u661f"]="\x90\xaf";sjisconv["\u6620"]="\x89f";sjisconv["\u6625"]="\x8ft";sjisconv["\u6627"]="\x96\x86";sjisconv["\u6628"]="\x8d\xf0";sjisconv["\u662d"]="\x8f\xba";sjisconv["\u662f"]="\x90\xa5";sjisconv["\u6634"]="\x9d\xe3";sjisconv["\u6635"]="\x9d\xe1";sjisconv["\u6636"]="\x9d\xe2";sjisconv["\u663c"]="\x92\x8b";sjisconv["\u663f"]="\x9eE";sjisconv["\u6641"]="\x9d\xe8";sjisconv["\u6642"]="\x8e\x9e";
          sjisconv["\u6643"]="\x8dW";sjisconv["\u6644"]="\x9d\xe6";sjisconv["\u6649"]="\x9d\xe7";sjisconv["\u664b"]="\x90W";sjisconv["\u664f"]="\x9d\xe5";sjisconv["\u6652"]="\x8eN";sjisconv["\u665d"]="\x9d\xea";sjisconv["\u665e"]="\x9d\xe9";sjisconv["\u665f"]="\x9d\xee";sjisconv["\u6662"]="\x9d\xef";sjisconv["\u6664"]="\x9d\xeb";sjisconv["\u6666"]="\x8aA";sjisconv["\u6667"]="\x9d\xec";sjisconv["\u6668"]="\x9d\xed";sjisconv["\u6669"]="\x94\xd3";sjisconv["\u666e"]="\x95\x81";sjisconv["\u666f"]="\x8ci";sjisconv["\u6670"]="\x9d\xf0";
          sjisconv["\u6674"]="\x90\xb0";sjisconv["\u6676"]="\x8f\xbb";sjisconv["\u667a"]="\x92q";sjisconv["\u6681"]="\x8b\xc5";sjisconv["\u6683"]="\x9d\xf1";sjisconv["\u6684"]="\x9d\xf5";sjisconv["\u6687"]="\x89\xc9";sjisconv["\u6688"]="\x9d\xf2";sjisconv["\u6689"]="\x9d\xf4";sjisconv["\u668e"]="\x9d\xf3";sjisconv["\u6691"]="\x8f\x8b";sjisconv["\u6696"]="\x92g";sjisconv["\u6697"]="\x88\xc3";sjisconv["\u6698"]="\x9d\xf6";sjisconv["\u669d"]="\x9d\xf7";sjisconv["\u66a2"]="\x92\xa8";sjisconv["\u66a6"]="\x97\xef";
          sjisconv["\u66ab"]="\x8eb";sjisconv["\u66ae"]="\x95\xe9";sjisconv["\u66b4"]="\x96\\";sjisconv["\u66b8"]="\x9eA";sjisconv["\u66b9"]="\x9d\xf9";sjisconv["\u66bc"]="\x9d\xfc";sjisconv["\u66be"]="\x9d\xfb";sjisconv["\u66c1"]="\x9d\xf8";sjisconv["\u66c4"]="\x9e@";sjisconv["\u66c7"]="\x93\xdc";sjisconv["\u66c9"]="\x9d\xfa";sjisconv["\u66d6"]="\x9eB";sjisconv["\u66d9"]="\x8f\x8c";sjisconv["\u66da"]="\x9eC";sjisconv["\u66dc"]="\x97j";sjisconv["\u66dd"]="\x94\x98";sjisconv["\u66e0"]="\x9eD";sjisconv["\u66e6"]="\x9eF";
          sjisconv["\u66e9"]="\x9eG";sjisconv["\u66f0"]="\x9eH";sjisconv["\u66f2"]="\x8b\xc8";sjisconv["\u66f3"]="\x89g";sjisconv["\u66f4"]="\x8dX";sjisconv["\u66f5"]="\x9eI";sjisconv["\u66f7"]="\x9eJ";sjisconv["\u66f8"]="\x8f\x91";sjisconv["\u66f9"]="\x91\x82";sjisconv["\u66fc"]="\x99\xd6";sjisconv["\u66fd"]="\x91]";sjisconv["\u66fe"]="\x91\\";sjisconv["\u66ff"]="\x91\xd6";sjisconv["\u6700"]="\x8d\xc5";sjisconv["\u6703"]="\x98\xf0";sjisconv["\u6708"]="\x8c\x8e";sjisconv["\u6709"]="\x97L";sjisconv["\u670b"]="\x95\xfc";
          sjisconv["\u670d"]="\x95\x9e";sjisconv["\u670f"]="\x9eK";sjisconv["\u6714"]="\x8d\xf1";sjisconv["\u6715"]="\x92\xbd";sjisconv["\u6716"]="\x9eL";sjisconv["\u6717"]="\x98N";sjisconv["\u671b"]="\x96]";sjisconv["\u671d"]="\x92\xa9";sjisconv["\u671e"]="\x9eM";sjisconv["\u671f"]="\x8a\xfa";sjisconv["\u6726"]="\x9eN";sjisconv["\u6727"]="\x9eO";sjisconv["\u6728"]="\x96\xd8";sjisconv["\u672a"]="\x96\xa2";sjisconv["\u672b"]="\x96\x96";sjisconv["\u672c"]="\x96{";sjisconv["\u672d"]="\x8eD";sjisconv["\u672e"]="\x9eQ";
          sjisconv["\u6731"]="\x8e\xe9";sjisconv["\u6734"]="\x96p";sjisconv["\u6736"]="\x9eS";sjisconv["\u6737"]="\x9eV";sjisconv["\u6738"]="\x9eU";sjisconv["\u673a"]="\x8a\xf7";sjisconv["\u673d"]="\x8b\x80";sjisconv["\u673f"]="\x9eR";sjisconv["\u6741"]="\x9eT";sjisconv["\u6746"]="\x9eW";sjisconv["\u6749"]="\x90\x99";sjisconv["\u674e"]="\x97\x9b";sjisconv["\u674f"]="\x88\xc7";sjisconv["\u6750"]="\x8d\xde";sjisconv["\u6751"]="\x91\xba";sjisconv["\u6753"]="\x8e\xdb";sjisconv["\u6756"]="\x8f\xf1";sjisconv["\u6759"]="\x9eZ";
          sjisconv["\u675c"]="\x93m";sjisconv["\u675e"]="\x9eX";sjisconv["\u675f"]="\x91\xa9";sjisconv["\u6760"]="\x9eY";sjisconv["\u6761"]="\x8f\xf0";sjisconv["\u6762"]="\x96\xdb";sjisconv["\u6763"]="\x9e[";sjisconv["\u6764"]="\x9e\\";sjisconv["\u6765"]="\x97\x88";sjisconv["\u676a"]="\x9ea";sjisconv["\u676d"]="\x8dY";sjisconv["\u676f"]="\x94t";sjisconv["\u6770"]="\x9e^";sjisconv["\u6771"]="\x93\x8c";sjisconv["\u6772"]="\x9d\xdc";sjisconv["\u6773"]="\x9d\xe0";sjisconv["\u6775"]="\x8bn";sjisconv["\u6777"]="\x94f";
          sjisconv["\u677c"]="\x9e`";sjisconv["\u677e"]="\x8f\xbc";sjisconv["\u677f"]="\x94\xc2";sjisconv["\u6785"]="\x9ef";sjisconv["\u6787"]="\x94\xf8";sjisconv["\u6789"]="\x9e]";sjisconv["\u678b"]="\x9ec";sjisconv["\u678c"]="\x9eb";sjisconv["\u6790"]="\x90\xcd";sjisconv["\u6795"]="\x96\x8d";sjisconv["\u6797"]="\x97\xd1";sjisconv["\u679a"]="\x96\x87";sjisconv["\u679c"]="\x89\xca";sjisconv["\u679d"]="\x8e}";sjisconv["\u67a0"]="\x98g";sjisconv["\u67a1"]="\x9ee";sjisconv["\u67a2"]="\x90\x95";sjisconv["\u67a6"]="\x9ed";
          sjisconv["\u67a9"]="\x9e_";sjisconv["\u67af"]="\x8c\xcd";sjisconv["\u67b3"]="\x9ek";sjisconv["\u67b4"]="\x9ei";sjisconv["\u67b6"]="\x89\xcb";sjisconv["\u67b7"]="\x9eg";sjisconv["\u67b8"]="\x9em";sjisconv["\u67b9"]="\x9es";sjisconv["\u67c1"]="\x91\xc6";sjisconv["\u67c4"]="\x95\xbf";sjisconv["\u67c6"]="\x9eu";sjisconv["\u67ca"]="\x95A";sjisconv["\u67ce"]="\x9et";sjisconv["\u67cf"]="\x94\x90";sjisconv["\u67d0"]="\x96^";sjisconv["\u67d1"]="\x8a\xb9";sjisconv["\u67d3"]="\x90\xf5";sjisconv["\u67d4"]="\x8f_";
          sjisconv["\u67d8"]="\x92\xd1";sjisconv["\u67da"]="\x97M";sjisconv["\u67dd"]="\x9ep";sjisconv["\u67de"]="\x9eo";sjisconv["\u67e2"]="\x9eq";sjisconv["\u67e4"]="\x9en";sjisconv["\u67e7"]="\x9ev";sjisconv["\u67e9"]="\x9el";sjisconv["\u67ec"]="\x9ej";sjisconv["\u67ee"]="\x9er";sjisconv["\u67ef"]="\x9eh";sjisconv["\u67f1"]="\x92\x8c";sjisconv["\u67f3"]="\x96\xf6";sjisconv["\u67f4"]="\x8e\xc4";sjisconv["\u67f5"]="\x8d\xf2";sjisconv["\u67fb"]="\x8d\xb8";sjisconv["\u67fe"]="\x96\x8f";sjisconv["\u67ff"]="\x8a`";
          sjisconv["\u6802"]="\x92\xcc";sjisconv["\u6803"]="\x93\xc8";sjisconv["\u6804"]="\x89h";sjisconv["\u6813"]="\x90\xf0";sjisconv["\u6816"]="\x90\xb2";sjisconv["\u6817"]="\x8cI";sjisconv["\u681e"]="\x9ex";sjisconv["\u6821"]="\x8dZ";sjisconv["\u6822"]="\x8a\x9c";sjisconv["\u6829"]="\x9ez";sjisconv["\u682a"]="\x8a\x94";sjisconv["\u682b"]="\x9e\x81";sjisconv["\u6832"]="\x9e}";sjisconv["\u6834"]="\x90\xf1";sjisconv["\u6838"]="\x8aj";sjisconv["\u6839"]="\x8d\xaa";sjisconv["\u683c"]="\x8ai";sjisconv["\u683d"]="\x8d\xcd";
          sjisconv["\u6840"]="\x9e{";sjisconv["\u6841"]="\x8c\x85";sjisconv["\u6842"]="\x8cj";sjisconv["\u6843"]="\x93\x8d";sjisconv["\u6846"]="\x9ey";sjisconv["\u6848"]="\x88\xc4";sjisconv["\u684d"]="\x9e|";sjisconv["\u684e"]="\x9e~";sjisconv["\u6850"]="\x8b\xcb";sjisconv["\u6851"]="\x8cK";sjisconv["\u6853"]="\x8a\xba";sjisconv["\u6854"]="\x8bj";sjisconv["\u6859"]="\x9e\x82";sjisconv["\u685c"]="\x8d\xf7";sjisconv["\u685d"]="\x96\x91";sjisconv["\u685f"]="\x8eV";sjisconv["\u6863"]="\x9e\x83";sjisconv["\u6867"]="\x95O";
          sjisconv["\u6874"]="\x9e\x8f";sjisconv["\u6876"]="\x89\xb1";sjisconv["\u6877"]="\x9e\x84";sjisconv["\u687e"]="\x9e\x95";sjisconv["\u687f"]="\x9e\x85";sjisconv["\u6881"]="\x97\xc0";sjisconv["\u6883"]="\x9e\x8c";sjisconv["\u6885"]="\x94~";sjisconv["\u688d"]="\x9e\x94";sjisconv["\u688f"]="\x9e\x87";sjisconv["\u6893"]="\x88\xb2";sjisconv["\u6894"]="\x9e\x89";sjisconv["\u6897"]="\x8d[";sjisconv["\u689b"]="\x9e\x8b";sjisconv["\u689d"]="\x9e\x8a";sjisconv["\u689f"]="\x9e\x86";sjisconv["\u68a0"]="\x9e\x91";
          sjisconv["\u68a2"]="\x8f\xbd";sjisconv["\u68a6"]="\x9a\xeb";sjisconv["\u68a7"]="\x8c\xe6";sjisconv["\u68a8"]="\x97\x9c";sjisconv["\u68ad"]="\x9e\x88";sjisconv["\u68af"]="\x92\xf2";sjisconv["\u68b0"]="\x8aB";sjisconv["\u68b1"]="\x8d\xab";sjisconv["\u68b3"]="\x9e\x80";sjisconv["\u68b5"]="\x9e\x90";sjisconv["\u68b6"]="\x8a\x81";sjisconv["\u68b9"]="\x9e\x8e";sjisconv["\u68ba"]="\x9e\x92";sjisconv["\u68bc"]="\x93\x8e";sjisconv["\u68c4"]="\x8a\xfc";sjisconv["\u68c6"]="\x9e\xb0";sjisconv["\u68c9"]="\x96\xc7";
          sjisconv["\u68ca"]="\x9e\x97";sjisconv["\u68cb"]="\x8a\xfb";sjisconv["\u68cd"]="\x9e\x9e";sjisconv["\u68d2"]="\x96_";sjisconv["\u68d4"]="\x9e\x9f";sjisconv["\u68d5"]="\x9e\xa1";sjisconv["\u68d7"]="\x9e\xa5";sjisconv["\u68d8"]="\x9e\x99";sjisconv["\u68da"]="\x92I";sjisconv["\u68df"]="\x93\x8f";sjisconv["\u68e0"]="\x9e\xa9";sjisconv["\u68e1"]="\x9e\x9c";sjisconv["\u68e3"]="\x9e\xa6";sjisconv["\u68e7"]="\x9e\xa0";sjisconv["\u68ee"]="\x90X";sjisconv["\u68ef"]="\x9e\xaa";sjisconv["\u68f2"]="\x90\xb1";
          sjisconv["\u68f9"]="\x9e\xa8";sjisconv["\u68fa"]="\x8a\xbb";sjisconv["\u6900"]="\x98o";sjisconv["\u6901"]="\x9e\x96";sjisconv["\u6904"]="\x9e\xa4";sjisconv["\u6905"]="\x88\xd6";sjisconv["\u6908"]="\x9e\x98";sjisconv["\u690b"]="\x96\xb8";sjisconv["\u690c"]="\x9e\x9d";sjisconv["\u690d"]="\x90A";sjisconv["\u690e"]="\x92\xc5";sjisconv["\u690f"]="\x9e\x93";sjisconv["\u6912"]="\x9e\xa3";sjisconv["\u6919"]="\x90\x9a";sjisconv["\u691a"]="\x9e\xad";sjisconv["\u691b"]="\x8a\x91";sjisconv["\u691c"]="\x8c\x9f";
          sjisconv["\u6921"]="\x9e\xaf";sjisconv["\u6922"]="\x9e\x9a";sjisconv["\u6923"]="\x9e\xae";sjisconv["\u6925"]="\x9e\xa7";sjisconv["\u6926"]="\x9e\x9b";sjisconv["\u6928"]="\x9e\xab";sjisconv["\u692a"]="\x9e\xac";sjisconv["\u6930"]="\x9e\xbd";sjisconv["\u6934"]="\x93\xcc";sjisconv["\u6936"]="\x9e\xa2";sjisconv["\u6939"]="\x9e\xb9";sjisconv["\u693d"]="\x9e\xbb";sjisconv["\u693f"]="\x92\xd6";sjisconv["\u694a"]="\x97k";sjisconv["\u6953"]="\x95\x96";sjisconv["\u6954"]="\x9e\xb6";sjisconv["\u6955"]="\x91\xc8";
          sjisconv["\u6959"]="\x9e\xbc";sjisconv["\u695a"]="\x91^";sjisconv["\u695c"]="\x9e\xb3";sjisconv["\u695d"]="\x9e\xc0";sjisconv["\u695e"]="\x9e\xbf";sjisconv["\u6960"]="\x93\xed";sjisconv["\u6961"]="\x9e\xbe";sjisconv["\u6962"]="\x93\xe8";sjisconv["\u696a"]="\x9e\xc2";sjisconv["\u696b"]="\x9e\xb5";sjisconv["\u696d"]="\x8b\xc6";sjisconv["\u696e"]="\x9e\xb8";sjisconv["\u696f"]="\x8f|";sjisconv["\u6973"]="\x94\x80";sjisconv["\u6974"]="\x9e\xba";sjisconv["\u6975"]="\x8b\xc9";sjisconv["\u6977"]="\x9e\xb2";
          sjisconv["\u6978"]="\x9e\xb4";sjisconv["\u6979"]="\x9e\xb1";sjisconv["\u697c"]="\x98O";sjisconv["\u697d"]="\x8ay";sjisconv["\u697e"]="\x9e\xb7";sjisconv["\u6981"]="\x9e\xc1";sjisconv["\u6982"]="\x8aT";sjisconv["\u698a"]="\x8d\xe5";sjisconv["\u698e"]="\x89|";sjisconv["\u6991"]="\x9e\xd2";sjisconv["\u6994"]="\x98P";sjisconv["\u6995"]="\x9e\xd5";sjisconv["\u699b"]="\x90Y";sjisconv["\u699c"]="\x9e\xd4";sjisconv["\u69a0"]="\x9e\xd3";sjisconv["\u69a7"]="\x9e\xd0";sjisconv["\u69ae"]="\x9e\xc4";sjisconv["\u69b1"]="\x9e\xe1";
          sjisconv["\u69b2"]="\x9e\xc3";sjisconv["\u69b4"]="\x9e\xd6";sjisconv["\u69bb"]="\x9e\xce";sjisconv["\u69be"]="\x9e\xc9";sjisconv["\u69bf"]="\x9e\xc6";sjisconv["\u69c1"]="\x9e\xc7";sjisconv["\u69c3"]="\x9e\xcf";sjisconv["\u69c7"]="\xea\xa0";sjisconv["\u69ca"]="\x9e\xcc";sjisconv["\u69cb"]="\x8d\\";sjisconv["\u69cc"]="\x92\xc6";sjisconv["\u69cd"]="\x91\x84";sjisconv["\u69ce"]="\x9e\xca";sjisconv["\u69d0"]="\x9e\xc5";sjisconv["\u69d3"]="\x9e\xc8";sjisconv["\u69d8"]="\x97l";sjisconv["\u69d9"]="\x96\x8a";
          sjisconv["\u69dd"]="\x9e\xcd";sjisconv["\u69de"]="\x9e\xd7";sjisconv["\u69e7"]="\x9e\xdf";sjisconv["\u69e8"]="\x9e\xd8";sjisconv["\u69eb"]="\x9e\xe5";sjisconv["\u69ed"]="\x9e\xe3";sjisconv["\u69f2"]="\x9e\xde";sjisconv["\u69f9"]="\x9e\xdd";sjisconv["\u69fb"]="\x92\xce";sjisconv["\u69fd"]="\x91\x85";sjisconv["\u69ff"]="\x9e\xdb";sjisconv["\u6a02"]="\x9e\xd9";sjisconv["\u6a05"]="\x9e\xe0";sjisconv["\u6a0a"]="\x9e\xe6";sjisconv["\u6a0b"]="\x94\xf3";sjisconv["\u6a0c"]="\x9e\xec";sjisconv["\u6a12"]="\x9e\xe7";
          sjisconv["\u6a13"]="\x9e\xea";sjisconv["\u6a14"]="\x9e\xe4";sjisconv["\u6a17"]="\x92\x94";sjisconv["\u6a19"]="\x95W";sjisconv["\u6a1b"]="\x9e\xda";sjisconv["\u6a1e"]="\x9e\xe2";sjisconv["\u6a1f"]="\x8f\xbe";sjisconv["\u6a21"]="\x96\xcd";sjisconv["\u6a22"]="\x9e\xf6";sjisconv["\u6a23"]="\x9e\xe9";sjisconv["\u6a29"]="\x8c\xa0";sjisconv["\u6a2a"]="\x89\xa1";sjisconv["\u6a2b"]="\x8a~";sjisconv["\u6a2e"]="\x9e\xd1";sjisconv["\u6a35"]="\x8f\xbf";sjisconv["\u6a36"]="\x9e\xee";sjisconv["\u6a38"]="\x9e\xf5";
          sjisconv["\u6a39"]="\x8e\xf7";sjisconv["\u6a3a"]="\x8a\x92";sjisconv["\u6a3d"]="\x92M";sjisconv["\u6a44"]="\x9e\xeb";sjisconv["\u6a47"]="\x9e\xf0";sjisconv["\u6a48"]="\x9e\xf4";sjisconv["\u6a4b"]="\x8b\xb4";sjisconv["\u6a58"]="\x8bk";sjisconv["\u6a59"]="\x9e\xf2";sjisconv["\u6a5f"]="\x8b@";sjisconv["\u6a61"]="\x93\xc9";sjisconv["\u6a62"]="\x9e\xf1";sjisconv["\u6a66"]="\x9e\xf3";sjisconv["\u6a72"]="\x9e\xed";sjisconv["\u6a78"]="\x9e\xef";sjisconv["\u6a7f"]="\x8a\x80";sjisconv["\u6a80"]="\x92h";sjisconv["\u6a84"]="\x9e\xfa";
          sjisconv["\u6a8d"]="\x9e\xf8";sjisconv["\u6a8e"]="\x8c\xe7";sjisconv["\u6a90"]="\x9e\xf7";sjisconv["\u6a97"]="\x9f@";sjisconv["\u6a9c"]="\x9ew";sjisconv["\u6aa0"]="\x9e\xf9";sjisconv["\u6aa2"]="\x9e\xfb";sjisconv["\u6aa3"]="\x9e\xfc";sjisconv["\u6aaa"]="\x9fK";sjisconv["\u6aac"]="\x9fG";sjisconv["\u6aae"]="\x9e\x8d";sjisconv["\u6ab3"]="\x9fF";sjisconv["\u6ab8"]="\x9fE";sjisconv["\u6abb"]="\x9fB";sjisconv["\u6ac1"]="\x9e\xe8";sjisconv["\u6ac2"]="\x9fD";sjisconv["\u6ac3"]="\x9fC";sjisconv["\u6ad1"]="\x9fI";
          sjisconv["\u6ad3"]="\x98E";sjisconv["\u6ada"]="\x9fL";sjisconv["\u6adb"]="\x8b\xf9";sjisconv["\u6ade"]="\x9fH";sjisconv["\u6adf"]="\x9fJ";sjisconv["\u6ae8"]="\x94\xa5";sjisconv["\u6aea"]="\x9fM";sjisconv["\u6afa"]="\x9fQ";sjisconv["\u6afb"]="\x9fN";sjisconv["\u6b04"]="\x97\x93";sjisconv["\u6b05"]="\x9fO";sjisconv["\u6b0a"]="\x9e\xdc";sjisconv["\u6b12"]="\x9fR";sjisconv["\u6b16"]="\x9fS";sjisconv["\u6b1d"]="\x89T";sjisconv["\u6b1f"]="\x9fU";sjisconv["\u6b20"]="\x8c\x87";sjisconv["\u6b21"]="\x8e\x9f";
          sjisconv["\u6b23"]="\x8b\xd3";sjisconv["\u6b27"]="\x89\xa2";sjisconv["\u6b32"]="\x97~";sjisconv["\u6b37"]="\x9fW";sjisconv["\u6b38"]="\x9fV";sjisconv["\u6b39"]="\x9fY";sjisconv["\u6b3a"]="\x8b\\";sjisconv["\u6b3d"]="\x8b\xd4";sjisconv["\u6b3e"]="\x8a\xbc";sjisconv["\u6b43"]="\x9f\\";sjisconv["\u6b47"]="\x9f[";sjisconv["\u6b49"]="\x9f]";sjisconv["\u6b4c"]="\x89\xcc";sjisconv["\u6b4e"]="\x92V";sjisconv["\u6b50"]="\x9f^";sjisconv["\u6b53"]="\x8a\xbd";sjisconv["\u6b54"]="\x9f`";sjisconv["\u6b59"]="\x9f_";
          sjisconv["\u6b5b"]="\x9fa";sjisconv["\u6b5f"]="\x9fb";sjisconv["\u6b61"]="\x9fc";sjisconv["\u6b62"]="\x8e~";sjisconv["\u6b63"]="\x90\xb3";sjisconv["\u6b64"]="\x8d\x9f";sjisconv["\u6b66"]="\x95\x90";sjisconv["\u6b69"]="\x95\xe0";sjisconv["\u6b6a"]="\x98c";sjisconv["\u6b6f"]="\x8e\x95";sjisconv["\u6b73"]="\x8d\xce";sjisconv["\u6b74"]="\x97\xf0";sjisconv["\u6b78"]="\x9fd";sjisconv["\u6b79"]="\x9fe";sjisconv["\u6b7b"]="\x8e\x80";sjisconv["\u6b7f"]="\x9ff";sjisconv["\u6b80"]="\x9fg";sjisconv["\u6b83"]="\x9fi";
          sjisconv["\u6b84"]="\x9fh";sjisconv["\u6b86"]="\x96w";sjisconv["\u6b89"]="\x8f}";sjisconv["\u6b8a"]="\x8e\xea";sjisconv["\u6b8b"]="\x8ec";sjisconv["\u6b8d"]="\x9fj";sjisconv["\u6b95"]="\x9fl";sjisconv["\u6b96"]="\x90B";sjisconv["\u6b98"]="\x9fk";sjisconv["\u6b9e"]="\x9fm";sjisconv["\u6ba4"]="\x9fn";sjisconv["\u6baa"]="\x9fo";sjisconv["\u6bab"]="\x9fp";sjisconv["\u6baf"]="\x9fq";sjisconv["\u6bb1"]="\x9fs";sjisconv["\u6bb2"]="\x9fr";sjisconv["\u6bb3"]="\x9ft";sjisconv["\u6bb4"]="\x89\xa3";sjisconv["\u6bb5"]="\x92i";
          sjisconv["\u6bb7"]="\x9fu";sjisconv["\u6bba"]="\x8eE";sjisconv["\u6bbb"]="\x8ak";sjisconv["\u6bbc"]="\x9fv";sjisconv["\u6bbf"]="\x93a";sjisconv["\u6bc0"]="\x9a\xca";sjisconv["\u6bc5"]="\x8bB";sjisconv["\u6bc6"]="\x9fw";sjisconv["\u6bcb"]="\x9fx";sjisconv["\u6bcd"]="\x95\xea";sjisconv["\u6bce"]="\x96\x88";sjisconv["\u6bd2"]="\x93\xc5";sjisconv["\u6bd3"]="\x9fy";sjisconv["\u6bd4"]="\x94\xe4";sjisconv["\u6bd8"]="\x94\xf9";sjisconv["\u6bdb"]="\x96\xd1";sjisconv["\u6bdf"]="\x9fz";sjisconv["\u6beb"]="\x9f|";
          sjisconv["\u6bec"]="\x9f{";sjisconv["\u6bef"]="\x9f~";sjisconv["\u6bf3"]="\x9f}";sjisconv["\u6c08"]="\x9f\x81";sjisconv["\u6c0f"]="\x8e\x81";sjisconv["\u6c11"]="\x96\xaf";sjisconv["\u6c13"]="\x9f\x82";sjisconv["\u6c14"]="\x9f\x83";sjisconv["\u6c17"]="\x8bC";sjisconv["\u6c1b"]="\x9f\x84";sjisconv["\u6c23"]="\x9f\x86";sjisconv["\u6c24"]="\x9f\x85";sjisconv["\u6c34"]="\x90\x85";sjisconv["\u6c37"]="\x95X";sjisconv["\u6c38"]="\x89i";sjisconv["\u6c3e"]="\x94\xc3";sjisconv["\u6c40"]="\x92\xf3";sjisconv["\u6c41"]="\x8f`";
          sjisconv["\u6c42"]="\x8b\x81";sjisconv["\u6c4e"]="\x94\xc4";sjisconv["\u6c50"]="\x8e\xac";sjisconv["\u6c55"]="\x9f\x88";sjisconv["\u6c57"]="\x8a\xbe";sjisconv["\u6c5a"]="\x89\x98";sjisconv["\u6c5d"]="\x93\xf0";sjisconv["\u6c5e"]="\x9f\x87";sjisconv["\u6c5f"]="\x8d]";sjisconv["\u6c60"]="\x92r";sjisconv["\u6c62"]="\x9f\x89";sjisconv["\u6c68"]="\x9f\x91";sjisconv["\u6c6a"]="\x9f\x8a";sjisconv["\u6c70"]="\x91\xbf";sjisconv["\u6c72"]="\x8b\x82";sjisconv["\u6c73"]="\x9f\x92";sjisconv["\u6c7a"]="\x8c\x88";
          sjisconv["\u6c7d"]="\x8bD";sjisconv["\u6c7e"]="\x9f\x90";sjisconv["\u6c81"]="\x9f\x8e";sjisconv["\u6c82"]="\x9f\x8b";sjisconv["\u6c83"]="\x97\x80";sjisconv["\u6c88"]="\x92\xbe";sjisconv["\u6c8c"]="\x93\xd7";sjisconv["\u6c8d"]="\x9f\x8c";sjisconv["\u6c90"]="\x9f\x94";sjisconv["\u6c92"]="\x9f\x93";sjisconv["\u6c93"]="\x8cB";sjisconv["\u6c96"]="\x89\xab";sjisconv["\u6c99"]="\x8d\xb9";sjisconv["\u6c9a"]="\x9f\x8d";sjisconv["\u6c9b"]="\x9f\x8f";sjisconv["\u6ca1"]="\x96v";sjisconv["\u6ca2"]="\x91\xf2";
          sjisconv["\u6cab"]="\x96\x97";sjisconv["\u6cae"]="\x9f\x9c";sjisconv["\u6cb1"]="\x9f\x9d";sjisconv["\u6cb3"]="\x89\xcd";sjisconv["\u6cb8"]="\x95\xa6";sjisconv["\u6cb9"]="\x96\xfb";sjisconv["\u6cba"]="\x9f\x9f";sjisconv["\u6cbb"]="\x8e\xa1";sjisconv["\u6cbc"]="\x8f\xc0";sjisconv["\u6cbd"]="\x9f\x98";sjisconv["\u6cbe"]="\x9f\x9e";sjisconv["\u6cbf"]="\x89\x88";sjisconv["\u6cc1"]="\x8b\xb5";sjisconv["\u6cc4"]="\x9f\x95";sjisconv["\u6cc5"]="\x9f\x9a";sjisconv["\u6cc9"]="\x90\xf2";sjisconv["\u6cca"]="\x94\x91";
          sjisconv["\u6ccc"]="\x94\xe5";sjisconv["\u6cd3"]="\x9f\x97";sjisconv["\u6cd5"]="\x96@";sjisconv["\u6cd7"]="\x9f\x99";sjisconv["\u6cd9"]="\x9f\xa2";sjisconv["\u6cdb"]="\x9f\xa0";sjisconv["\u6cdd"]="\x9f\x9b";sjisconv["\u6ce1"]="\x96A";sjisconv["\u6ce2"]="\x94g";sjisconv["\u6ce3"]="\x8b\x83";sjisconv["\u6ce5"]="\x93D";sjisconv["\u6ce8"]="\x92\x8d";sjisconv["\u6cea"]="\x9f\xa3";sjisconv["\u6cef"]="\x9f\xa1";sjisconv["\u6cf0"]="\x91\xd7";sjisconv["\u6cf1"]="\x9f\x96";sjisconv["\u6cf3"]="\x89j";sjisconv["\u6d0b"]="\x97m";
          sjisconv["\u6d0c"]="\x9f\xae";sjisconv["\u6d12"]="\x9f\xad";sjisconv["\u6d17"]="\x90\xf4";sjisconv["\u6d19"]="\x9f\xaa";sjisconv["\u6d1b"]="\x97\x8c";sjisconv["\u6d1e"]="\x93\xb4";sjisconv["\u6d1f"]="\x9f\xa4";sjisconv["\u6d25"]="\x92\xc3";sjisconv["\u6d29"]="\x89k";sjisconv["\u6d2a"]="\x8d^";sjisconv["\u6d2b"]="\x9f\xa7";sjisconv["\u6d32"]="\x8fF";sjisconv["\u6d33"]="\x9f\xac";sjisconv["\u6d35"]="\x9f\xab";sjisconv["\u6d36"]="\x9f\xa6";sjisconv["\u6d38"]="\x9f\xa9";sjisconv["\u6d3b"]="\x8a\x88";
          sjisconv["\u6d3d"]="\x9f\xa8";sjisconv["\u6d3e"]="\x94h";sjisconv["\u6d41"]="\x97\xac";sjisconv["\u6d44"]="\x8f\xf2";sjisconv["\u6d45"]="\x90\xf3";sjisconv["\u6d59"]="\x9f\xb4";sjisconv["\u6d5a"]="\x9f\xb2";sjisconv["\u6d5c"]="\x95l";sjisconv["\u6d63"]="\x9f\xaf";sjisconv["\u6d64"]="\x9f\xb1";sjisconv["\u6d66"]="\x89Y";sjisconv["\u6d69"]="\x8d_";sjisconv["\u6d6a"]="\x98Q";sjisconv["\u6d6c"]="\x8a\\";sjisconv["\u6d6e"]="\x95\x82";sjisconv["\u6d74"]="\x97\x81";sjisconv["\u6d77"]="\x8aC";sjisconv["\u6d78"]="\x90Z";
          sjisconv["\u6d79"]="\x9f\xb3";sjisconv["\u6d85"]="\x9f\xb8";sjisconv["\u6d88"]="\x8f\xc1";sjisconv["\u6d8c"]="\x97O";sjisconv["\u6d8e"]="\x9f\xb5";sjisconv["\u6d93"]="\x9f\xb0";sjisconv["\u6d95"]="\x9f\xb6";sjisconv["\u6d99"]="\x97\xdc";sjisconv["\u6d9b"]="\x93\x93";sjisconv["\u6d9c"]="\x93\xc0";sjisconv["\u6daf"]="\x8aU";sjisconv["\u6db2"]="\x89t";sjisconv["\u6db5"]="\x9f\xbc";sjisconv["\u6db8"]="\x9f\xbf";sjisconv["\u6dbc"]="\x97\xc1";sjisconv["\u6dc0"]="\x97\x84";sjisconv["\u6dc5"]="\x9f\xc6";
          sjisconv["\u6dc6"]="\x9f\xc0";sjisconv["\u6dc7"]="\x9f\xbd";sjisconv["\u6dcb"]="\x97\xd2";sjisconv["\u6dcc"]="\x9f\xc3";sjisconv["\u6dd1"]="\x8fi";sjisconv["\u6dd2"]="\x9f\xc5";sjisconv["\u6dd5"]="\x9f\xca";sjisconv["\u6dd8"]="\x93\x91";sjisconv["\u6dd9"]="\x9f\xc8";sjisconv["\u6dde"]="\x9f\xc2";sjisconv["\u6de1"]="\x92W";sjisconv["\u6de4"]="\x9f\xc9";sjisconv["\u6de6"]="\x9f\xbe";sjisconv["\u6de8"]="\x9f\xc4";sjisconv["\u6dea"]="\x9f\xcb";sjisconv["\u6deb"]="\x88\xfa";sjisconv["\u6dec"]="\x9f\xc1";
          sjisconv["\u6dee"]="\x9f\xcc";sjisconv["\u6df1"]="\x90[";sjisconv["\u6df3"]="\x8f~";sjisconv["\u6df5"]="\x95\xa3";sjisconv["\u6df7"]="\x8d\xac";sjisconv["\u6df9"]="\x9f\xb9";sjisconv["\u6dfa"]="\x9f\xc7";sjisconv["\u6dfb"]="\x93Y";sjisconv["\u6e05"]="\x90\xb4";sjisconv["\u6e07"]="\x8a\x89";sjisconv["\u6e08"]="\x8d\xcf";sjisconv["\u6e09"]="\x8f\xc2";sjisconv["\u6e0a"]="\x9f\xbb";sjisconv["\u6e0b"]="\x8fa";sjisconv["\u6e13"]="\x8ck";sjisconv["\u6e15"]="\x9f\xba";sjisconv["\u6e19"]="\x9f\xd0";sjisconv["\u6e1a"]="\x8f\x8d";
          sjisconv["\u6e1b"]="\x8c\xb8";sjisconv["\u6e1d"]="\x9f\xdf";sjisconv["\u6e1f"]="\x9f\xd9";sjisconv["\u6e20"]="\x8b\x94";sjisconv["\u6e21"]="\x93n";sjisconv["\u6e23"]="\x9f\xd4";sjisconv["\u6e24"]="\x9f\xdd";sjisconv["\u6e25"]="\x88\xad";sjisconv["\u6e26"]="\x89Q";sjisconv["\u6e29"]="\x89\xb7";sjisconv["\u6e2b"]="\x9f\xd6";sjisconv["\u6e2c"]="\x91\xaa";sjisconv["\u6e2d"]="\x9f\xcd";sjisconv["\u6e2e"]="\x9f\xcf";sjisconv["\u6e2f"]="\x8d`";sjisconv["\u6e38"]="\x9f\xe0";sjisconv["\u6e3a"]="\x9f\xdb";
          sjisconv["\u6e3e"]="\x9f\xd3";sjisconv["\u6e43"]="\x9f\xda";sjisconv["\u6e4a"]="\x96\xa9";sjisconv["\u6e4d"]="\x9f\xd8";sjisconv["\u6e4e"]="\x9f\xdc";sjisconv["\u6e56"]="\x8c\xce";sjisconv["\u6e58"]="\x8f\xc3";sjisconv["\u6e5b"]="\x92X";sjisconv["\u6e5f"]="\x9f\xd2";sjisconv["\u6e67"]="\x97N";sjisconv["\u6e6b"]="\x9f\xd5";sjisconv["\u6e6e"]="\x9f\xce";sjisconv["\u6e6f"]="\x93\x92";sjisconv["\u6e72"]="\x9f\xd1";sjisconv["\u6e76"]="\x9f\xd7";sjisconv["\u6e7e"]="\x98p";sjisconv["\u6e7f"]="\x8e\xbc";
          sjisconv["\u6e80"]="\x96\x9e";sjisconv["\u6e82"]="\x9f\xe1";sjisconv["\u6e8c"]="\x94\xac";sjisconv["\u6e8f"]="\x9f\xed";sjisconv["\u6e90"]="\x8c\xb9";sjisconv["\u6e96"]="\x8f\x80";sjisconv["\u6e98"]="\x9f\xe3";sjisconv["\u6e9c"]="\x97\xad";sjisconv["\u6e9d"]="\x8da";sjisconv["\u6e9f"]="\x9f\xf0";sjisconv["\u6ea2"]="\x88\xec";sjisconv["\u6ea5"]="\x9f\xee";sjisconv["\u6eaa"]="\x9f\xe2";sjisconv["\u6eaf"]="\x9f\xe8";sjisconv["\u6eb2"]="\x9f\xea";sjisconv["\u6eb6"]="\x97n";sjisconv["\u6eb7"]="\x9f\xe5";
          sjisconv["\u6eba"]="\x93M";sjisconv["\u6ebd"]="\x9f\xe7";sjisconv["\u6ec2"]="\x9f\xef";sjisconv["\u6ec4"]="\x9f\xe9";sjisconv["\u6ec5"]="\x96\xc5";sjisconv["\u6ec9"]="\x9f\xe4";sjisconv["\u6ecb"]="\x8e\xa0";sjisconv["\u6ecc"]="\x9f\xfc";sjisconv["\u6ed1"]="\x8a\x8a";sjisconv["\u6ed3"]="\x9f\xe6";sjisconv["\u6ed4"]="\x9f\xeb";sjisconv["\u6ed5"]="\x9f\xec";sjisconv["\u6edd"]="\x91\xea";sjisconv["\u6ede"]="\x91\xd8";sjisconv["\u6eec"]="\x9f\xf4";sjisconv["\u6eef"]="\x9f\xfa";sjisconv["\u6ef2"]="\x9f\xf8";
          sjisconv["\u6ef4"]="\x93H";sjisconv["\u6ef7"]="\xe0B";sjisconv["\u6ef8"]="\x9f\xf5";sjisconv["\u6efe"]="\x9f\xf6";sjisconv["\u6eff"]="\x9f\xde";sjisconv["\u6f01"]="\x8b\x99";sjisconv["\u6f02"]="\x95Y";sjisconv["\u6f06"]="\x8e\xbd";sjisconv["\u6f09"]="\x8d\x97";sjisconv["\u6f0f"]="\x98R";sjisconv["\u6f11"]="\x9f\xf2";sjisconv["\u6f13"]="\xe0A";sjisconv["\u6f14"]="\x89\x89";sjisconv["\u6f15"]="\x91\x86";sjisconv["\u6f20"]="\x94\x99";sjisconv["\u6f22"]="\x8a\xbf";sjisconv["\u6f23"]="\x97\xf8";sjisconv["\u6f2b"]="\x96\x9f";
          sjisconv["\u6f2c"]="\x92\xd0";sjisconv["\u6f31"]="\x9f\xf9";sjisconv["\u6f32"]="\x9f\xfb";sjisconv["\u6f38"]="\x91Q";sjisconv["\u6f3e"]="\xe0@";sjisconv["\u6f3f"]="\x9f\xf7";sjisconv["\u6f41"]="\x9f\xf1";sjisconv["\u6f45"]="\x8a\xc1";sjisconv["\u6f54"]="\x8c\x89";sjisconv["\u6f58"]="\xe0N";sjisconv["\u6f5b"]="\xe0I";sjisconv["\u6f5c"]="\x90\xf6";sjisconv["\u6f5f"]="\x8a\x83";sjisconv["\u6f64"]="\x8f\x81";sjisconv["\u6f66"]="\xe0R";sjisconv["\u6f6d"]="\xe0K";sjisconv["\u6f6e"]="\x92\xaa";sjisconv["\u6f6f"]="\xe0H";
          sjisconv["\u6f70"]="\x92\xd7";sjisconv["\u6f74"]="\xe0k";sjisconv["\u6f78"]="\xe0E";sjisconv["\u6f7a"]="\xe0D";sjisconv["\u6f7c"]="\xe0M";sjisconv["\u6f80"]="\xe0G";sjisconv["\u6f81"]="\xe0F";sjisconv["\u6f82"]="\xe0L";sjisconv["\u6f84"]="\x90\x9f";sjisconv["\u6f86"]="\xe0C";sjisconv["\u6f8e"]="\xe0O";sjisconv["\u6f91"]="\xe0P";sjisconv["\u6f97"]="\x8a\xc0";sjisconv["\u6fa1"]="\xe0U";sjisconv["\u6fa3"]="\xe0T";sjisconv["\u6fa4"]="\xe0V";sjisconv["\u6faa"]="\xe0Y";sjisconv["\u6fb1"]="\x93b";sjisconv["\u6fb3"]="\xe0S";
          sjisconv["\u6fb9"]="\xe0W";sjisconv["\u6fc0"]="\x8c\x83";sjisconv["\u6fc1"]="\x91\xf7";sjisconv["\u6fc2"]="\xe0Q";sjisconv["\u6fc3"]="\x94Z";sjisconv["\u6fc6"]="\xe0X";sjisconv["\u6fd4"]="\xe0]";sjisconv["\u6fd5"]="\xe0[";sjisconv["\u6fd8"]="\xe0^";sjisconv["\u6fdb"]="\xe0a";sjisconv["\u6fdf"]="\xe0Z";sjisconv["\u6fe0"]="\x8d\x8a";sjisconv["\u6fe1"]="\x94G";sjisconv["\u6fe4"]="\x9f\xb7";sjisconv["\u6feb"]="\x97\x94";sjisconv["\u6fec"]="\xe0\\";sjisconv["\u6fee"]="\xe0`";sjisconv["\u6fef"]="\x91\xf3";
          sjisconv["\u6ff1"]="\xe0_";sjisconv["\u6ff3"]="\xe0J";sjisconv["\u6ff6"]="\xe8\x89";sjisconv["\u6ffa"]="\xe0d";sjisconv["\u6ffe"]="\xe0h";sjisconv["\u7001"]="\xe0f";sjisconv["\u7009"]="\xe0b";sjisconv["\u700b"]="\xe0c";sjisconv["\u700f"]="\xe0g";sjisconv["\u7011"]="\xe0e";sjisconv["\u7015"]="\x95m";sjisconv["\u7018"]="\xe0m";sjisconv["\u701a"]="\xe0j";sjisconv["\u701b"]="\xe0i";sjisconv["\u701d"]="\xe0l";sjisconv["\u701e"]="\x93\xd2";sjisconv["\u701f"]="\xe0n";sjisconv["\u7026"]="\x92\x95";sjisconv["\u7027"]="\x91\xeb";
          sjisconv["\u702c"]="\x90\xa3";sjisconv["\u7030"]="\xe0o";sjisconv["\u7032"]="\xe0q";sjisconv["\u703e"]="\xe0p";sjisconv["\u704c"]="\x9f\xf3";sjisconv["\u7051"]="\xe0r";sjisconv["\u7058"]="\x93\xe5";sjisconv["\u7063"]="\xe0s";sjisconv["\u706b"]="\x89\xce";sjisconv["\u706f"]="\x93\x94";sjisconv["\u7070"]="\x8aD";sjisconv["\u7078"]="\x8b\x84";sjisconv["\u707c"]="\x8e\xdc";sjisconv["\u707d"]="\x8d\xd0";sjisconv["\u7089"]="\x98F";sjisconv["\u708a"]="\x90\x86";sjisconv["\u708e"]="\x89\x8a";sjisconv["\u7092"]="\xe0u";
          sjisconv["\u7099"]="\xe0t";sjisconv["\u70ac"]="\xe0x";sjisconv["\u70ad"]="\x92Y";sjisconv["\u70ae"]="\xe0{";sjisconv["\u70af"]="\xe0v";sjisconv["\u70b3"]="\xe0z";sjisconv["\u70b8"]="\xe0y";sjisconv["\u70b9"]="\x93_";sjisconv["\u70ba"]="\x88\xd7";sjisconv["\u70c8"]="\x97\xf3";sjisconv["\u70cb"]="\xe0}";sjisconv["\u70cf"]="\x89G";sjisconv["\u70d9"]="\xe0\x80";sjisconv["\u70dd"]="\xe0~";sjisconv["\u70df"]="\xe0|";sjisconv["\u70f1"]="\xe0w";sjisconv["\u70f9"]="\x96B";sjisconv["\u70fd"]="\xe0\x82";sjisconv["\u7109"]="\xe0\x81";
          sjisconv["\u7114"]="\x89\x8b";sjisconv["\u7119"]="\xe0\x84";sjisconv["\u711a"]="\x95\xb0";sjisconv["\u711c"]="\xe0\x83";sjisconv["\u7121"]="\x96\xb3";sjisconv["\u7126"]="\x8f\xc5";sjisconv["\u7136"]="\x91R";sjisconv["\u713c"]="\x8f\xc4";sjisconv["\u7149"]="\x97\xf9";sjisconv["\u714c"]="\xe0\x8a";sjisconv["\u714e"]="\x90\xf7";sjisconv["\u7155"]="\xe0\x86";sjisconv["\u7156"]="\xe0\x8b";sjisconv["\u7159"]="\x89\x8c";sjisconv["\u7162"]="\xe0\x89";sjisconv["\u7164"]="\x94\x81";sjisconv["\u7165"]="\xe0\x85";
          sjisconv["\u7166"]="\xe0\x88";sjisconv["\u7167"]="\x8f\xc6";sjisconv["\u7169"]="\x94\xcf";sjisconv["\u716c"]="\xe0\x8c";sjisconv["\u716e"]="\x8e\xcf";sjisconv["\u717d"]="\x90\xf8";sjisconv["\u7184"]="\xe0\x8f";sjisconv["\u7188"]="\xe0\x87";sjisconv["\u718a"]="\x8cF";sjisconv["\u718f"]="\xe0\x8d";sjisconv["\u7194"]="\x97o";sjisconv["\u7195"]="\xe0\x90";sjisconv["\u7199"]="\xea\xa4";sjisconv["\u719f"]="\x8fn";sjisconv["\u71a8"]="\xe0\x91";sjisconv["\u71ac"]="\xe0\x92";sjisconv["\u71b1"]="\x94M";sjisconv["\u71b9"]="\xe0\x94";
          sjisconv["\u71be"]="\xe0\x95";sjisconv["\u71c3"]="\x94R";sjisconv["\u71c8"]="\x93\x95";sjisconv["\u71c9"]="\xe0\x97";sjisconv["\u71ce"]="\xe0\x99";sjisconv["\u71d0"]="\x97\xd3";sjisconv["\u71d2"]="\xe0\x96";sjisconv["\u71d4"]="\xe0\x98";sjisconv["\u71d5"]="\x89\x8d";sjisconv["\u71d7"]="\xe0\x93";sjisconv["\u71df"]="\x9az";sjisconv["\u71e0"]="\xe0\x9a";sjisconv["\u71e5"]="\x91\x87";sjisconv["\u71e6"]="\x8eW";sjisconv["\u71e7"]="\xe0\x9c";sjisconv["\u71ec"]="\xe0\x9b";sjisconv["\u71ed"]="\x90C";sjisconv["\u71ee"]="\x99\xd7";
          sjisconv["\u71f5"]="\xe0\x9d";sjisconv["\u71f9"]="\xe0\x9f";sjisconv["\u71fb"]="\xe0\x8e";sjisconv["\u71fc"]="\xe0\x9e";sjisconv["\u71ff"]="\xe0\xa0";sjisconv["\u7206"]="\x94\x9a";sjisconv["\u720d"]="\xe0\xa1";sjisconv["\u7210"]="\xe0\xa2";sjisconv["\u721b"]="\xe0\xa3";sjisconv["\u7228"]="\xe0\xa4";sjisconv["\u722a"]="\x92\xdc";sjisconv["\u722c"]="\xe0\xa6";sjisconv["\u722d"]="\xe0\xa5";sjisconv["\u7230"]="\xe0\xa7";sjisconv["\u7232"]="\xe0\xa8";sjisconv["\u7235"]="\x8e\xdd";sjisconv["\u7236"]="\x95\x83";
          sjisconv["\u723a"]="\x96\xea";sjisconv["\u723b"]="\xe0\xa9";sjisconv["\u723c"]="\xe0\xaa";sjisconv["\u723d"]="\x91u";sjisconv["\u723e"]="\x8e\xa2";sjisconv["\u723f"]="\xe0\xab";sjisconv["\u7240"]="\xe0\xac";sjisconv["\u7246"]="\xe0\xad";sjisconv["\u7247"]="\x95\xd0";sjisconv["\u7248"]="\x94\xc5";sjisconv["\u724b"]="\xe0\xae";sjisconv["\u724c"]="\x94v";sjisconv["\u7252"]="\x92\xab";sjisconv["\u7258"]="\xe0\xaf";sjisconv["\u7259"]="\x89\xe5";sjisconv["\u725b"]="\x8b\x8d";sjisconv["\u725d"]="\x96\xc4";
          sjisconv["\u725f"]="\x96\xb4";sjisconv["\u7261"]="\x89\xb2";sjisconv["\u7262"]="\x98S";sjisconv["\u7267"]="\x96q";sjisconv["\u7269"]="\x95\xa8";sjisconv["\u7272"]="\x90\xb5";sjisconv["\u7274"]="\xe0\xb0";sjisconv["\u7279"]="\x93\xc1";sjisconv["\u727d"]="\x8c\xa1";sjisconv["\u727e"]="\xe0\xb1";sjisconv["\u7280"]="\x8d\xd2";sjisconv["\u7281"]="\xe0\xb3";sjisconv["\u7282"]="\xe0\xb2";sjisconv["\u7287"]="\xe0\xb4";sjisconv["\u7292"]="\xe0\xb5";sjisconv["\u7296"]="\xe0\xb6";sjisconv["\u72a0"]="\x8b]";
          sjisconv["\u72a2"]="\xe0\xb7";sjisconv["\u72a7"]="\xe0\xb8";sjisconv["\u72ac"]="\x8c\xa2";sjisconv["\u72af"]="\x94\xc6";sjisconv["\u72b2"]="\xe0\xba";sjisconv["\u72b6"]="\x8f\xf3";sjisconv["\u72b9"]="\xe0\xb9";sjisconv["\u72c2"]="\x8b\xb6";sjisconv["\u72c3"]="\xe0\xbb";sjisconv["\u72c4"]="\xe0\xbd";sjisconv["\u72c6"]="\xe0\xbc";sjisconv["\u72ce"]="\xe0\xbe";sjisconv["\u72d0"]="\x8c\xcf";sjisconv["\u72d2"]="\xe0\xbf";sjisconv["\u72d7"]="\x8b\xe7";sjisconv["\u72d9"]="\x91_";sjisconv["\u72db"]="\x8d\x9d";
          sjisconv["\u72e0"]="\xe0\xc1";sjisconv["\u72e1"]="\xe0\xc2";sjisconv["\u72e2"]="\xe0\xc0";sjisconv["\u72e9"]="\x8e\xeb";sjisconv["\u72ec"]="\x93\xc6";sjisconv["\u72ed"]="\x8b\xb7";sjisconv["\u72f7"]="\xe0\xc4";sjisconv["\u72f8"]="\x92K";sjisconv["\u72f9"]="\xe0\xc3";sjisconv["\u72fc"]="\x98T";sjisconv["\u72fd"]="\x94\x82";sjisconv["\u730a"]="\xe0\xc7";sjisconv["\u7316"]="\xe0\xc9";sjisconv["\u7317"]="\xe0\xc6";sjisconv["\u731b"]="\x96\xd2";sjisconv["\u731c"]="\xe0\xc8";sjisconv["\u731d"]="\xe0\xca";
          sjisconv["\u731f"]="\x97\xc2";sjisconv["\u7325"]="\xe0\xce";sjisconv["\u7329"]="\xe0\xcd";sjisconv["\u732a"]="\x92\x96";sjisconv["\u732b"]="\x94L";sjisconv["\u732e"]="\x8c\xa3";sjisconv["\u732f"]="\xe0\xcc";sjisconv["\u7334"]="\xe0\xcb";sjisconv["\u7336"]="\x97P";sjisconv["\u7337"]="\x97Q";sjisconv["\u733e"]="\xe0\xcf";sjisconv["\u733f"]="\x89\x8e";sjisconv["\u7344"]="\x8d\x96";sjisconv["\u7345"]="\x8e\x82";sjisconv["\u734e"]="\xe0\xd0";sjisconv["\u734f"]="\xe0\xd1";sjisconv["\u7357"]="\xe0\xd3";
          sjisconv["\u7363"]="\x8fb";sjisconv["\u7368"]="\xe0\xd5";sjisconv["\u736a"]="\xe0\xd4";sjisconv["\u7370"]="\xe0\xd6";sjisconv["\u7372"]="\x8al";sjisconv["\u7375"]="\xe0\xd8";sjisconv["\u7378"]="\xe0\xd7";sjisconv["\u737a"]="\xe0\xda";sjisconv["\u737b"]="\xe0\xd9";sjisconv["\u7384"]="\x8c\xba";sjisconv["\u7387"]="\x97\xa6";sjisconv["\u7389"]="\x8b\xca";sjisconv["\u738b"]="\x89\xa4";sjisconv["\u7396"]="\x8b\xe8";sjisconv["\u73a9"]="\x8a\xdf";sjisconv["\u73b2"]="\x97\xe6";sjisconv["\u73b3"]="\xe0\xdc";
          sjisconv["\u73bb"]="\xe0\xde";sjisconv["\u73c0"]="\xe0\xdf";sjisconv["\u73c2"]="\x89\xcf";sjisconv["\u73c8"]="\xe0\xdb";sjisconv["\u73ca"]="\x8eX";sjisconv["\u73cd"]="\x92\xbf";sjisconv["\u73ce"]="\xe0\xdd";sjisconv["\u73de"]="\xe0\xe2";sjisconv["\u73e0"]="\x8e\xec";sjisconv["\u73e5"]="\xe0\xe0";sjisconv["\u73ea"]="\x8c]";sjisconv["\u73ed"]="\x94\xc7";sjisconv["\u73ee"]="\xe0\xe1";sjisconv["\u73f1"]="\xe0\xfc";sjisconv["\u73f8"]="\xe0\xe7";sjisconv["\u73fe"]="\x8c\xbb";sjisconv["\u7403"]="\x8b\x85";
          sjisconv["\u7405"]="\xe0\xe4";sjisconv["\u7406"]="\x97\x9d";sjisconv["\u7409"]="\x97\xae";sjisconv["\u7422"]="\x91\xf4";sjisconv["\u7425"]="\xe0\xe6";sjisconv["\u7432"]="\xe0\xe8";sjisconv["\u7433"]="\x97\xd4";sjisconv["\u7434"]="\x8b\xd5";sjisconv["\u7435"]="\x94\xfa";sjisconv["\u7436"]="\x94i";sjisconv["\u743a"]="\xe0\xe9";sjisconv["\u743f"]="\xe0\xeb";sjisconv["\u7441"]="\xe0\xee";sjisconv["\u7455"]="\xe0\xea";sjisconv["\u7459"]="\xe0\xed";sjisconv["\u745a"]="\x8c\xe8";sjisconv["\u745b"]="\x89l";
          sjisconv["\u745c"]="\xe0\xef";sjisconv["\u745e"]="\x90\x90";sjisconv["\u745f"]="\xe0\xec";sjisconv["\u7460"]="\x97\xda";sjisconv["\u7463"]="\xe0\xf2";sjisconv["\u7464"]="\xea\xa2";sjisconv["\u7469"]="\xe0\xf0";sjisconv["\u746a"]="\xe0\xf3";sjisconv["\u746f"]="\xe0\xe5";sjisconv["\u7470"]="\xe0\xf1";sjisconv["\u7473"]="\x8d\xba";sjisconv["\u7476"]="\xe0\xf4";sjisconv["\u747e"]="\xe0\xf5";sjisconv["\u7483"]="\x97\x9e";sjisconv["\u748b"]="\xe0\xf6";sjisconv["\u749e"]="\xe0\xf7";sjisconv["\u74a2"]="\xe0\xe3";
          sjisconv["\u74a7"]="\xe0\xf8";sjisconv["\u74b0"]="\x8a\xc2";sjisconv["\u74bd"]="\x8e\xa3";sjisconv["\u74ca"]="\xe0\xf9";sjisconv["\u74cf"]="\xe0\xfa";sjisconv["\u74d4"]="\xe0\xfb";sjisconv["\u74dc"]="\x89Z";sjisconv["\u74e0"]="\xe1@";sjisconv["\u74e2"]="\x95Z";sjisconv["\u74e3"]="\xe1A";sjisconv["\u74e6"]="\x8a\xa2";sjisconv["\u74e7"]="\xe1B";sjisconv["\u74e9"]="\xe1C";sjisconv["\u74ee"]="\xe1D";sjisconv["\u74f0"]="\xe1F";sjisconv["\u74f1"]="\xe1G";sjisconv["\u74f2"]="\xe1E";sjisconv["\u74f6"]="\x95r";
          sjisconv["\u74f7"]="\xe1I";sjisconv["\u74f8"]="\xe1H";sjisconv["\u7503"]="\xe1K";sjisconv["\u7504"]="\xe1J";sjisconv["\u7505"]="\xe1L";sjisconv["\u750c"]="\xe1M";sjisconv["\u750d"]="\xe1O";sjisconv["\u750e"]="\xe1N";sjisconv["\u7511"]="\x8d\x99";sjisconv["\u7513"]="\xe1Q";sjisconv["\u7515"]="\xe1P";sjisconv["\u7518"]="\x8a\xc3";sjisconv["\u751a"]="\x90r";sjisconv["\u751c"]="\x93[";sjisconv["\u751e"]="\xe1R";sjisconv["\u751f"]="\x90\xb6";sjisconv["\u7523"]="\x8eY";sjisconv["\u7525"]="\x89\x99";sjisconv["\u7526"]="\xe1S";
          sjisconv["\u7528"]="\x97p";sjisconv["\u752b"]="\x95\xe1";sjisconv["\u752c"]="\xe1T";sjisconv["\u7530"]="\x93c";sjisconv["\u7531"]="\x97R";sjisconv["\u7532"]="\x8db";sjisconv["\u7533"]="\x90\\";sjisconv["\u7537"]="\x92j";sjisconv["\u7538"]="\x99\xb2";sjisconv["\u753a"]="\x92\xac";sjisconv["\u753b"]="\x89\xe6";sjisconv["\u753c"]="\xe1U";sjisconv["\u7544"]="\xe1V";sjisconv["\u7546"]="\xe1[";sjisconv["\u7549"]="\xe1Y";sjisconv["\u754a"]="\xe1X";sjisconv["\u754b"]="\x9d\xc0";sjisconv["\u754c"]="\x8aE";
          sjisconv["\u754d"]="\xe1W";sjisconv["\u754f"]="\x88\xd8";sjisconv["\u7551"]="\x94\xa8";sjisconv["\u7554"]="\x94\xc8";sjisconv["\u7559"]="\x97\xaf";sjisconv["\u755a"]="\xe1\\";sjisconv["\u755b"]="\xe1Z";sjisconv["\u755c"]="\x92{";sjisconv["\u755d"]="\x90\xa4";sjisconv["\u7560"]="\x94\xa9";sjisconv["\u7562"]="\x95L";sjisconv["\u7564"]="\xe1^";sjisconv["\u7565"]="\x97\xaa";sjisconv["\u7566"]="\x8cl";sjisconv["\u7567"]="\xe1_";sjisconv["\u7569"]="\xe1]";sjisconv["\u756a"]="\x94\xd4";sjisconv["\u756b"]="\xe1`";
          sjisconv["\u756d"]="\xe1a";sjisconv["\u7570"]="\x88\xd9";sjisconv["\u7573"]="\x8f\xf4";sjisconv["\u7574"]="\xe1f";sjisconv["\u7576"]="\xe1c";sjisconv["\u7577"]="\x93\xeb";sjisconv["\u7578"]="\xe1b";sjisconv["\u757f"]="\x8bE";sjisconv["\u7582"]="\xe1i";sjisconv["\u7586"]="\xe1d";sjisconv["\u7587"]="\xe1e";sjisconv["\u7589"]="\xe1h";sjisconv["\u758a"]="\xe1g";sjisconv["\u758b"]="\x95D";sjisconv["\u758e"]="\x91a";sjisconv["\u758f"]="\x91`";sjisconv["\u7591"]="\x8b^";sjisconv["\u7594"]="\xe1j";sjisconv["\u759a"]="\xe1k";
          sjisconv["\u759d"]="\xe1l";sjisconv["\u75a3"]="\xe1n";sjisconv["\u75a5"]="\xe1m";sjisconv["\u75ab"]="\x89u";sjisconv["\u75b1"]="\xe1v";sjisconv["\u75b2"]="\x94\xe6";sjisconv["\u75b3"]="\xe1p";sjisconv["\u75b5"]="\xe1r";sjisconv["\u75b8"]="\xe1t";sjisconv["\u75b9"]="\x90]";sjisconv["\u75bc"]="\xe1u";sjisconv["\u75bd"]="\xe1s";sjisconv["\u75be"]="\x8e\xbe";sjisconv["\u75c2"]="\xe1o";sjisconv["\u75c3"]="\xe1q";sjisconv["\u75c5"]="\x95a";sjisconv["\u75c7"]="\x8f\xc7";sjisconv["\u75ca"]="\xe1x";sjisconv["\u75cd"]="\xe1w";
          sjisconv["\u75d2"]="\xe1y";sjisconv["\u75d4"]="\x8e\xa4";sjisconv["\u75d5"]="\x8d\xad";sjisconv["\u75d8"]="\x93\x97";sjisconv["\u75d9"]="\xe1z";sjisconv["\u75db"]="\x92\xc9";sjisconv["\u75de"]="\xe1|";sjisconv["\u75e2"]="\x97\x9f";sjisconv["\u75e3"]="\xe1{";sjisconv["\u75e9"]="\x91\x89";sjisconv["\u75f0"]="\xe1\x82";sjisconv["\u75f2"]="\xe1\x84";sjisconv["\u75f3"]="\xe1\x85";sjisconv["\u75f4"]="\x92s";sjisconv["\u75fa"]="\xe1\x83";sjisconv["\u75fc"]="\xe1\x80";sjisconv["\u75fe"]="\xe1}";sjisconv["\u75ff"]="\xe1~";
          sjisconv["\u7601"]="\xe1\x81";sjisconv["\u7609"]="\xe1\x88";sjisconv["\u760b"]="\xe1\x86";sjisconv["\u760d"]="\xe1\x87";sjisconv["\u761f"]="\xe1\x89";sjisconv["\u7620"]="\xe1\x8b";sjisconv["\u7621"]="\xe1\x8c";sjisconv["\u7622"]="\xe1\x8d";sjisconv["\u7624"]="\xe1\x8e";sjisconv["\u7627"]="\xe1\x8a";sjisconv["\u7630"]="\xe1\x90";sjisconv["\u7634"]="\xe1\x8f";sjisconv["\u763b"]="\xe1\x91";sjisconv["\u7642"]="\x97\xc3";sjisconv["\u7646"]="\xe1\x94";sjisconv["\u7647"]="\xe1\x92";sjisconv["\u7648"]="\xe1\x93";
          sjisconv["\u764c"]="\x8a\xe0";sjisconv["\u7652"]="\x96\xfc";sjisconv["\u7656"]="\x95\xc8";sjisconv["\u7658"]="\xe1\x96";sjisconv["\u765c"]="\xe1\x95";sjisconv["\u7661"]="\xe1\x97";sjisconv["\u7662"]="\xe1\x98";sjisconv["\u7667"]="\xe1\x9c";sjisconv["\u7668"]="\xe1\x99";sjisconv["\u7669"]="\xe1\x9a";sjisconv["\u766a"]="\xe1\x9b";sjisconv["\u766c"]="\xe1\x9d";sjisconv["\u7670"]="\xe1\x9e";sjisconv["\u7672"]="\xe1\x9f";sjisconv["\u7676"]="\xe1\xa0";sjisconv["\u7678"]="\xe1\xa1";sjisconv["\u767a"]="\x94\xad";
          sjisconv["\u767b"]="\x93o";sjisconv["\u767c"]="\xe1\xa2";sjisconv["\u767d"]="\x94\x92";sjisconv["\u767e"]="\x95S";sjisconv["\u7680"]="\xe1\xa3";sjisconv["\u7683"]="\xe1\xa4";sjisconv["\u7684"]="\x93I";sjisconv["\u7686"]="\x8aF";sjisconv["\u7687"]="\x8dc";sjisconv["\u7688"]="\xe1\xa5";sjisconv["\u768b"]="\xe1\xa6";sjisconv["\u768e"]="\xe1\xa7";sjisconv["\u7690"]="\x8eH";sjisconv["\u7693"]="\xe1\xa9";sjisconv["\u7696"]="\xe1\xa8";sjisconv["\u7699"]="\xe1\xaa";sjisconv["\u769a"]="\xe1\xab";sjisconv["\u76ae"]="\x94\xe7";
          sjisconv["\u76b0"]="\xe1\xac";sjisconv["\u76b4"]="\xe1\xad";sjisconv["\u76b7"]="\xea\x89";sjisconv["\u76b8"]="\xe1\xae";sjisconv["\u76b9"]="\xe1\xaf";sjisconv["\u76ba"]="\xe1\xb0";sjisconv["\u76bf"]="\x8eM";sjisconv["\u76c2"]="\xe1\xb1";sjisconv["\u76c3"]="\x94u";sjisconv["\u76c6"]="\x96~";sjisconv["\u76c8"]="\x89m";sjisconv["\u76ca"]="\x89v";sjisconv["\u76cd"]="\xe1\xb2";sjisconv["\u76d2"]="\xe1\xb4";sjisconv["\u76d6"]="\xe1\xb3";sjisconv["\u76d7"]="\x93\x90";sjisconv["\u76db"]="\x90\xb7";sjisconv["\u76dc"]="\x9fX";
          sjisconv["\u76de"]="\xe1\xb5";sjisconv["\u76df"]="\x96\xbf";sjisconv["\u76e1"]="\xe1\xb6";sjisconv["\u76e3"]="\x8a\xc4";sjisconv["\u76e4"]="\x94\xd5";sjisconv["\u76e5"]="\xe1\xb7";sjisconv["\u76e7"]="\xe1\xb8";sjisconv["\u76ea"]="\xe1\xb9";sjisconv["\u76ee"]="\x96\xda";sjisconv["\u76f2"]="\x96\xd3";sjisconv["\u76f4"]="\x92\xbc";sjisconv["\u76f8"]="\x91\x8a";sjisconv["\u76fb"]="\xe1\xbb";sjisconv["\u76fe"]="\x8f\x82";sjisconv["\u7701"]="\x8f\xc8";sjisconv["\u7704"]="\xe1\xbe";sjisconv["\u7707"]="\xe1\xbd";
          sjisconv["\u7708"]="\xe1\xbc";sjisconv["\u7709"]="\x94\xfb";sjisconv["\u770b"]="\x8a\xc5";sjisconv["\u770c"]="\x8c\xa7";sjisconv["\u771b"]="\xe1\xc4";sjisconv["\u771e"]="\xe1\xc1";sjisconv["\u771f"]="\x90^";sjisconv["\u7720"]="\x96\xb0";sjisconv["\u7724"]="\xe1\xc0";sjisconv["\u7725"]="\xe1\xc2";sjisconv["\u7726"]="\xe1\xc3";sjisconv["\u7729"]="\xe1\xbf";sjisconv["\u7737"]="\xe1\xc5";sjisconv["\u7738"]="\xe1\xc6";sjisconv["\u773a"]="\x92\xad";sjisconv["\u773c"]="\x8a\xe1";sjisconv["\u7740"]="\x92\x85";
          sjisconv["\u7747"]="\xe1\xc7";sjisconv["\u775a"]="\xe1\xc8";sjisconv["\u775b"]="\xe1\xcb";sjisconv["\u7761"]="\x90\x87";sjisconv["\u7763"]="\x93\xc2";sjisconv["\u7765"]="\xe1\xcc";sjisconv["\u7766"]="\x96r";sjisconv["\u7768"]="\xe1\xc9";sjisconv["\u776b"]="\xe1\xca";sjisconv["\u7779"]="\xe1\xcf";sjisconv["\u777e"]="\xe1\xce";sjisconv["\u777f"]="\xe1\xcd";sjisconv["\u778b"]="\xe1\xd1";sjisconv["\u778e"]="\xe1\xd0";sjisconv["\u7791"]="\xe1\xd2";sjisconv["\u779e"]="\xe1\xd4";sjisconv["\u77a0"]="\xe1\xd3";
          sjisconv["\u77a5"]="\x95\xcb";sjisconv["\u77ac"]="\x8fu";sjisconv["\u77ad"]="\x97\xc4";sjisconv["\u77b0"]="\xe1\xd5";sjisconv["\u77b3"]="\x93\xb5";sjisconv["\u77b6"]="\xe1\xd6";sjisconv["\u77b9"]="\xe1\xd7";sjisconv["\u77bb"]="\xe1\xdb";sjisconv["\u77bc"]="\xe1\xd9";sjisconv["\u77bd"]="\xe1\xda";sjisconv["\u77bf"]="\xe1\xd8";sjisconv["\u77c7"]="\xe1\xdc";sjisconv["\u77cd"]="\xe1\xdd";sjisconv["\u77d7"]="\xe1\xde";sjisconv["\u77da"]="\xe1\xdf";sjisconv["\u77db"]="\x96\xb5";sjisconv["\u77dc"]="\xe1\xe0";
          sjisconv["\u77e2"]="\x96\xee";sjisconv["\u77e3"]="\xe1\xe1";sjisconv["\u77e5"]="\x92m";sjisconv["\u77e7"]="\x94\x8a";sjisconv["\u77e9"]="\x8b\xe9";sjisconv["\u77ed"]="\x92Z";sjisconv["\u77ee"]="\xe1\xe2";sjisconv["\u77ef"]="\x8b\xb8";sjisconv["\u77f3"]="\x90\xce";sjisconv["\u77fc"]="\xe1\xe3";sjisconv["\u7802"]="\x8d\xbb";sjisconv["\u780c"]="\xe1\xe4";sjisconv["\u7812"]="\xe1\xe5";sjisconv["\u7814"]="\x8c\xa4";sjisconv["\u7815"]="\x8d\xd3";sjisconv["\u7820"]="\xe1\xe7";sjisconv["\u7825"]="\x93u";
          sjisconv["\u7826"]="\x8d\xd4";sjisconv["\u7827"]="\x8bm";sjisconv["\u7832"]="\x96C";sjisconv["\u7834"]="\x94j";sjisconv["\u783a"]="\x93v";sjisconv["\u783f"]="\x8d{";sjisconv["\u7845"]="\xe1\xe9";sjisconv["\u785d"]="\x8f\xc9";sjisconv["\u786b"]="\x97\xb0";sjisconv["\u786c"]="\x8dd";sjisconv["\u786f"]="\x8c\xa5";sjisconv["\u7872"]="\x94\xa1";sjisconv["\u7874"]="\xe1\xeb";sjisconv["\u787c"]="\xe1\xed";sjisconv["\u7881"]="\x8c\xe9";sjisconv["\u7886"]="\xe1\xec";sjisconv["\u7887"]="\x92\xf4";sjisconv["\u788c"]="\xe1\xef";
          sjisconv["\u788d"]="\x8aV";sjisconv["\u788e"]="\xe1\xea";sjisconv["\u7891"]="\x94\xe8";sjisconv["\u7893"]="\x89O";sjisconv["\u7895"]="\x8d\xea";sjisconv["\u7897"]="\x98q";sjisconv["\u789a"]="\xe1\xee";sjisconv["\u78a3"]="\xe1\xf0";sjisconv["\u78a7"]="\x95\xc9";sjisconv["\u78a9"]="\x90\xd7";sjisconv["\u78aa"]="\xe1\xf2";sjisconv["\u78af"]="\xe1\xf3";sjisconv["\u78b5"]="\xe1\xf1";sjisconv["\u78ba"]="\x8am";sjisconv["\u78bc"]="\xe1\xf9";sjisconv["\u78be"]="\xe1\xf8";sjisconv["\u78c1"]="\x8e\xa5";sjisconv["\u78c5"]="\xe1\xfa";
          sjisconv["\u78c6"]="\xe1\xf5";sjisconv["\u78ca"]="\xe1\xfb";sjisconv["\u78cb"]="\xe1\xf6";sjisconv["\u78d0"]="\x94\xd6";sjisconv["\u78d1"]="\xe1\xf4";sjisconv["\u78d4"]="\xe1\xf7";sjisconv["\u78da"]="\xe2A";sjisconv["\u78e7"]="\xe2@";sjisconv["\u78e8"]="\x96\x81";sjisconv["\u78ec"]="\xe1\xfc";sjisconv["\u78ef"]="\x88\xe9";sjisconv["\u78f4"]="\xe2C";sjisconv["\u78fd"]="\xe2B";sjisconv["\u7901"]="\x8f\xca";sjisconv["\u7907"]="\xe2D";sjisconv["\u790e"]="\x91b";sjisconv["\u7911"]="\xe2F";sjisconv["\u7912"]="\xe2E";
          sjisconv["\u7919"]="\xe2G";sjisconv["\u7926"]="\xe1\xe6";sjisconv["\u792a"]="\xe1\xe8";sjisconv["\u792b"]="\xe2I";sjisconv["\u792c"]="\xe2H";sjisconv["\u793a"]="\x8e\xa6";sjisconv["\u793c"]="\x97\xe7";sjisconv["\u793e"]="\x8e\xd0";sjisconv["\u7940"]="\xe2J";sjisconv["\u7941"]="\x8cV";sjisconv["\u7947"]="\x8b_";sjisconv["\u7948"]="\x8bF";sjisconv["\u7949"]="\x8e\x83";sjisconv["\u7950"]="\x97S";sjisconv["\u7953"]="\xe2P";sjisconv["\u7955"]="\xe2O";sjisconv["\u7956"]="\x91c";sjisconv["\u7957"]="\xe2L";
          sjisconv["\u795a"]="\xe2N";sjisconv["\u795d"]="\x8fj";sjisconv["\u795e"]="\x90_";sjisconv["\u795f"]="\xe2M";sjisconv["\u7960"]="\xe2K";sjisconv["\u7962"]="\x94I";sjisconv["\u7965"]="\x8f\xcb";sjisconv["\u7968"]="\x95[";sjisconv["\u796d"]="\x8d\xd5";sjisconv["\u7977"]="\x93\x98";sjisconv["\u797a"]="\xe2Q";sjisconv["\u797f"]="\xe2R";sjisconv["\u7980"]="\xe2h";sjisconv["\u7981"]="\x8b\xd6";sjisconv["\u7984"]="\x98\\";sjisconv["\u7985"]="\x91T";sjisconv["\u798a"]="\xe2S";sjisconv["\u798d"]="\x89\xd0";
          sjisconv["\u798e"]="\x92\xf5";sjisconv["\u798f"]="\x95\x9f";sjisconv["\u799d"]="\xe2T";sjisconv["\u79a6"]="\x8b\x9a";sjisconv["\u79a7"]="\xe2U";sjisconv["\u79aa"]="\xe2W";sjisconv["\u79ae"]="\xe2X";sjisconv["\u79b0"]="\x94H";sjisconv["\u79b3"]="\xe2Y";sjisconv["\u79b9"]="\xe2Z";sjisconv["\u79ba"]="\xe2[";sjisconv["\u79bd"]="\x8b\xd7";sjisconv["\u79be"]="\x89\xd1";sjisconv["\u79bf"]="\x93\xc3";sjisconv["\u79c0"]="\x8fG";sjisconv["\u79c1"]="\x8e\x84";sjisconv["\u79c9"]="\xe2\\";sjisconv["\u79cb"]="\x8fH";
          sjisconv["\u79d1"]="\x89\xc8";sjisconv["\u79d2"]="\x95b";sjisconv["\u79d5"]="\xe2]";sjisconv["\u79d8"]="\x94\xe9";sjisconv["\u79df"]="\x91d";sjisconv["\u79e1"]="\xe2`";sjisconv["\u79e3"]="\xe2a";sjisconv["\u79e4"]="\x94\x89";sjisconv["\u79e6"]="\x90`";sjisconv["\u79e7"]="\xe2^";sjisconv["\u79e9"]="\x92\x81";sjisconv["\u79ec"]="\xe2_";sjisconv["\u79f0"]="\x8f\xcc";sjisconv["\u79fb"]="\x88\xda";sjisconv["\u7a00"]="\x8bH";sjisconv["\u7a08"]="\xe2b";sjisconv["\u7a0b"]="\x92\xf6";sjisconv["\u7a0d"]="\xe2c";
          sjisconv["\u7a0e"]="\x90\xc5";sjisconv["\u7a14"]="\x96\xab";sjisconv["\u7a17"]="\x95B";sjisconv["\u7a18"]="\xe2d";sjisconv["\u7a19"]="\xe2e";sjisconv["\u7a1a"]="\x92t";sjisconv["\u7a1c"]="\x97\xc5";sjisconv["\u7a1f"]="\xe2g";sjisconv["\u7a20"]="\xe2f";sjisconv["\u7a2e"]="\x8e\xed";sjisconv["\u7a31"]="\xe2i";sjisconv["\u7a32"]="\x88\xee";sjisconv["\u7a37"]="\xe2l";sjisconv["\u7a3b"]="\xe2j";sjisconv["\u7a3c"]="\x89\xd2";sjisconv["\u7a3d"]="\x8cm";sjisconv["\u7a3e"]="\xe2k";sjisconv["\u7a3f"]="\x8de";
          sjisconv["\u7a40"]="\x8d\x92";sjisconv["\u7a42"]="\x95\xe4";sjisconv["\u7a43"]="\xe2m";sjisconv["\u7a46"]="\x96s";sjisconv["\u7a49"]="\xe2o";sjisconv["\u7a4d"]="\x90\xcf";sjisconv["\u7a4e"]="\x89n";sjisconv["\u7a4f"]="\x89\xb8";sjisconv["\u7a50"]="\x88\xaa";sjisconv["\u7a57"]="\xe2n";sjisconv["\u7a61"]="\xe2p";sjisconv["\u7a62"]="\xe2q";sjisconv["\u7a63"]="\x8f\xf5";sjisconv["\u7a69"]="\xe2r";sjisconv["\u7a6b"]="\x8an";sjisconv["\u7a70"]="\xe2t";sjisconv["\u7a74"]="\x8c\x8a";sjisconv["\u7a76"]="\x8b\x86";
          sjisconv["\u7a79"]="\xe2u";sjisconv["\u7a7a"]="\x8b\xf3";sjisconv["\u7a7d"]="\xe2v";sjisconv["\u7a7f"]="\x90\xfa";sjisconv["\u7a81"]="\x93\xcb";sjisconv["\u7a83"]="\x90\xde";sjisconv["\u7a84"]="\x8d\xf3";sjisconv["\u7a88"]="\xe2w";sjisconv["\u7a92"]="\x92\x82";sjisconv["\u7a93"]="\x91\x8b";sjisconv["\u7a95"]="\xe2y";sjisconv["\u7a96"]="\xe2{";sjisconv["\u7a97"]="\xe2x";sjisconv["\u7a98"]="\xe2z";sjisconv["\u7a9f"]="\x8cA";sjisconv["\u7aa9"]="\xe2|";sjisconv["\u7aaa"]="\x8cE";sjisconv["\u7aae"]="\x8b\x87";
          sjisconv["\u7aaf"]="\x97q";sjisconv["\u7ab0"]="\xe2~";sjisconv["\u7ab6"]="\xe2\x80";sjisconv["\u7aba"]="\x89M";sjisconv["\u7abf"]="\xe2\x83";sjisconv["\u7ac3"]="\x8a\x96";sjisconv["\u7ac4"]="\xe2\x82";sjisconv["\u7ac5"]="\xe2\x81";sjisconv["\u7ac7"]="\xe2\x85";sjisconv["\u7ac8"]="\xe2}";sjisconv["\u7aca"]="\xe2\x86";sjisconv["\u7acb"]="\x97\xa7";sjisconv["\u7acd"]="\xe2\x87";sjisconv["\u7acf"]="\xe2\x88";sjisconv["\u7ad2"]="\x9a\xf2";sjisconv["\u7ad3"]="\xe2\x8a";sjisconv["\u7ad5"]="\xe2\x89";sjisconv["\u7ad9"]="\xe2\x8b";
          sjisconv["\u7ada"]="\xe2\x8c";sjisconv["\u7adc"]="\x97\xb3";sjisconv["\u7add"]="\xe2\x8d";sjisconv["\u7adf"]="\xe8\xed";sjisconv["\u7ae0"]="\x8f\xcd";sjisconv["\u7ae1"]="\xe2\x8e";sjisconv["\u7ae2"]="\xe2\x8f";sjisconv["\u7ae3"]="\x8fv";sjisconv["\u7ae5"]="\x93\xb6";sjisconv["\u7ae6"]="\xe2\x90";sjisconv["\u7aea"]="\x92G";sjisconv["\u7aed"]="\xe2\x91";sjisconv["\u7aef"]="\x92[";sjisconv["\u7af0"]="\xe2\x92";sjisconv["\u7af6"]="\x8b\xa3";sjisconv["\u7af8"]="\x99^";sjisconv["\u7af9"]="\x92|";sjisconv["\u7afa"]="\x8e\xb1";
          sjisconv["\u7aff"]="\x8a\xc6";sjisconv["\u7b02"]="\xe2\x93";sjisconv["\u7b04"]="\xe2\xa0";sjisconv["\u7b06"]="\xe2\x96";sjisconv["\u7b08"]="\x8b\x88";sjisconv["\u7b0a"]="\xe2\x95";sjisconv["\u7b0b"]="\xe2\xa2";sjisconv["\u7b0f"]="\xe2\x94";sjisconv["\u7b11"]="\x8f\xce";sjisconv["\u7b18"]="\xe2\x98";sjisconv["\u7b19"]="\xe2\x99";sjisconv["\u7b1b"]="\x93J";sjisconv["\u7b1e"]="\xe2\x9a";sjisconv["\u7b20"]="\x8a}";sjisconv["\u7b25"]="\x90y";sjisconv["\u7b26"]="\x95\x84";sjisconv["\u7b28"]="\xe2\x9c";
          sjisconv["\u7b2c"]="\x91\xe6";sjisconv["\u7b33"]="\xe2\x97";sjisconv["\u7b35"]="\xe2\x9b";sjisconv["\u7b36"]="\xe2\x9d";sjisconv["\u7b39"]="\x8d\xf9";sjisconv["\u7b45"]="\xe2\xa4";sjisconv["\u7b46"]="\x95M";sjisconv["\u7b48"]="\x94\xa4";sjisconv["\u7b49"]="\x93\x99";sjisconv["\u7b4b"]="\x8b\xd8";sjisconv["\u7b4c"]="\xe2\xa3";sjisconv["\u7b4d"]="\xe2\xa1";sjisconv["\u7b4f"]="\x94\xb3";sjisconv["\u7b50"]="\xe2\x9e";sjisconv["\u7b51"]="\x92}";sjisconv["\u7b52"]="\x93\x9b";sjisconv["\u7b54"]="\x93\x9a";
          sjisconv["\u7b56"]="\x8d\xf4";sjisconv["\u7b5d"]="\xe2\xb6";sjisconv["\u7b65"]="\xe2\xa6";sjisconv["\u7b67"]="\xe2\xa8";sjisconv["\u7b6c"]="\xe2\xab";sjisconv["\u7b6e"]="\xe2\xac";sjisconv["\u7b70"]="\xe2\xa9";sjisconv["\u7b71"]="\xe2\xaa";sjisconv["\u7b74"]="\xe2\xa7";sjisconv["\u7b75"]="\xe2\xa5";sjisconv["\u7b7a"]="\xe2\x9f";sjisconv["\u7b86"]="\x95\xcd";sjisconv["\u7b87"]="\x89\xd3";sjisconv["\u7b8b"]="\xe2\xb3";sjisconv["\u7b8d"]="\xe2\xb0";sjisconv["\u7b8f"]="\xe2\xb5";sjisconv["\u7b92"]="\xe2\xb4";
          sjisconv["\u7b94"]="\x94\x93";sjisconv["\u7b95"]="\x96\xa5";sjisconv["\u7b97"]="\x8eZ";sjisconv["\u7b98"]="\xe2\xae";sjisconv["\u7b99"]="\xe2\xb7";sjisconv["\u7b9a"]="\xe2\xb2";sjisconv["\u7b9c"]="\xe2\xb1";sjisconv["\u7b9d"]="\xe2\xad";sjisconv["\u7b9f"]="\xe2\xaf";sjisconv["\u7ba1"]="\x8a\xc7";sjisconv["\u7baa"]="\x92\\";sjisconv["\u7bad"]="\x90\xfb";sjisconv["\u7bb1"]="\x94\xa0";sjisconv["\u7bb4"]="\xe2\xbc";sjisconv["\u7bb8"]="\x94\xa2";sjisconv["\u7bc0"]="\x90\xdf";sjisconv["\u7bc1"]="\xe2\xb9";
          sjisconv["\u7bc4"]="\x94\xcd";sjisconv["\u7bc6"]="\xe2\xbd";sjisconv["\u7bc7"]="\x95\xd1";sjisconv["\u7bc9"]="\x92z";sjisconv["\u7bcb"]="\xe2\xb8";sjisconv["\u7bcc"]="\xe2\xba";sjisconv["\u7bcf"]="\xe2\xbb";sjisconv["\u7bdd"]="\xe2\xbe";sjisconv["\u7be0"]="\x8e\xc2";sjisconv["\u7be4"]="\x93\xc4";sjisconv["\u7be5"]="\xe2\xc3";sjisconv["\u7be6"]="\xe2\xc2";sjisconv["\u7be9"]="\xe2\xbf";sjisconv["\u7bed"]="\x98U";sjisconv["\u7bf3"]="\xe2\xc8";sjisconv["\u7bf6"]="\xe2\xcc";sjisconv["\u7bf7"]="\xe2\xc9";
          sjisconv["\u7c00"]="\xe2\xc5";sjisconv["\u7c07"]="\xe2\xc6";sjisconv["\u7c0d"]="\xe2\xcb";sjisconv["\u7c11"]="\xe2\xc0";sjisconv["\u7c12"]="\x99\xd3";sjisconv["\u7c13"]="\xe2\xc7";sjisconv["\u7c14"]="\xe2\xc1";sjisconv["\u7c17"]="\xe2\xca";sjisconv["\u7c1f"]="\xe2\xd0";sjisconv["\u7c21"]="\x8a\xc8";sjisconv["\u7c23"]="\xe2\xcd";sjisconv["\u7c27"]="\xe2\xce";sjisconv["\u7c2a"]="\xe2\xcf";sjisconv["\u7c2b"]="\xe2\xd2";sjisconv["\u7c37"]="\xe2\xd1";sjisconv["\u7c38"]="\x94\xf4";sjisconv["\u7c3d"]="\xe2\xd3";
          sjisconv["\u7c3e"]="\x97\xfa";sjisconv["\u7c3f"]="\x95\xeb";sjisconv["\u7c40"]="\xe2\xd8";sjisconv["\u7c43"]="\xe2\xd5";sjisconv["\u7c4c"]="\xe2\xd4";sjisconv["\u7c4d"]="\x90\xd0";sjisconv["\u7c4f"]="\xe2\xd7";sjisconv["\u7c50"]="\xe2\xd9";sjisconv["\u7c54"]="\xe2\xd6";sjisconv["\u7c56"]="\xe2\xdd";sjisconv["\u7c58"]="\xe2\xda";sjisconv["\u7c5f"]="\xe2\xdb";sjisconv["\u7c60"]="\xe2\xc4";sjisconv["\u7c64"]="\xe2\xdc";sjisconv["\u7c65"]="\xe2\xde";sjisconv["\u7c6c"]="\xe2\xdf";sjisconv["\u7c73"]="\x95\xc4";
          sjisconv["\u7c75"]="\xe2\xe0";sjisconv["\u7c7e"]="\x96\xe0";sjisconv["\u7c81"]="\x8b\xcc";sjisconv["\u7c82"]="\x8cH";sjisconv["\u7c83"]="\xe2\xe1";sjisconv["\u7c89"]="\x95\xb2";sjisconv["\u7c8b"]="\x90\x88";sjisconv["\u7c8d"]="\x96\xae";sjisconv["\u7c90"]="\xe2\xe2";sjisconv["\u7c92"]="\x97\xb1";sjisconv["\u7c95"]="\x94\x94";sjisconv["\u7c97"]="\x91e";sjisconv["\u7c98"]="\x94S";sjisconv["\u7c9b"]="\x8fl";sjisconv["\u7c9f"]="\x88\xbe";sjisconv["\u7ca1"]="\xe2\xe7";sjisconv["\u7ca2"]="\xe2\xe5";sjisconv["\u7ca4"]="\xe2\xe3";
          sjisconv["\u7ca5"]="\x8a\x9f";sjisconv["\u7ca7"]="\x8f\xcf";sjisconv["\u7ca8"]="\xe2\xe8";sjisconv["\u7cab"]="\xe2\xe6";sjisconv["\u7cad"]="\xe2\xe4";sjisconv["\u7cae"]="\xe2\xec";sjisconv["\u7cb1"]="\xe2\xeb";sjisconv["\u7cb2"]="\xe2\xea";sjisconv["\u7cb3"]="\xe2\xe9";sjisconv["\u7cb9"]="\xe2\xed";sjisconv["\u7cbd"]="\xe2\xee";sjisconv["\u7cbe"]="\x90\xb8";sjisconv["\u7cc0"]="\xe2\xef";sjisconv["\u7cc2"]="\xe2\xf1";sjisconv["\u7cc5"]="\xe2\xf0";sjisconv["\u7cca"]="\x8c\xd0";sjisconv["\u7cce"]="\x91W";
          sjisconv["\u7cd2"]="\xe2\xf3";sjisconv["\u7cd6"]="\x93\x9c";sjisconv["\u7cd8"]="\xe2\xf2";sjisconv["\u7cdc"]="\xe2\xf4";sjisconv["\u7cde"]="\x95\xb3";sjisconv["\u7cdf"]="\x91\x8c";sjisconv["\u7ce0"]="\x8df";sjisconv["\u7ce2"]="\xe2\xf5";sjisconv["\u7ce7"]="\x97\xc6";sjisconv["\u7cef"]="\xe2\xf7";sjisconv["\u7cf2"]="\xe2\xf8";sjisconv["\u7cf4"]="\xe2\xf9";sjisconv["\u7cf6"]="\xe2\xfa";sjisconv["\u7cf8"]="\x8e\x85";sjisconv["\u7cfa"]="\xe2\xfb";sjisconv["\u7cfb"]="\x8cn";sjisconv["\u7cfe"]="\x8b\x8a";
          sjisconv["\u7d00"]="\x8bI";sjisconv["\u7d02"]="\xe3@";sjisconv["\u7d04"]="\x96\xf1";sjisconv["\u7d05"]="\x8dg";sjisconv["\u7d06"]="\xe2\xfc";sjisconv["\u7d0a"]="\xe3C";sjisconv["\u7d0b"]="\x96\xe4";sjisconv["\u7d0d"]="\x94[";sjisconv["\u7d10"]="\x95R";sjisconv["\u7d14"]="\x8f\x83";sjisconv["\u7d15"]="\xe3B";sjisconv["\u7d17"]="\x8e\xd1";sjisconv["\u7d18"]="\x8dh";sjisconv["\u7d19"]="\x8e\x86";sjisconv["\u7d1a"]="\x8b\x89";sjisconv["\u7d1b"]="\x95\xb4";sjisconv["\u7d1c"]="\xe3A";sjisconv["\u7d20"]="\x91f";
          sjisconv["\u7d21"]="\x96a";sjisconv["\u7d22"]="\x8d\xf5";sjisconv["\u7d2b"]="\x8e\x87";sjisconv["\u7d2c"]="\x92\xdb";sjisconv["\u7d2e"]="\xe3F";sjisconv["\u7d2f"]="\x97\xdd";sjisconv["\u7d30"]="\x8d\xd7";sjisconv["\u7d32"]="\xe3G";sjisconv["\u7d33"]="\x90a";sjisconv["\u7d35"]="\xe3I";sjisconv["\u7d39"]="\x8f\xd0";sjisconv["\u7d3a"]="\x8d\xae";sjisconv["\u7d3f"]="\xe3H";sjisconv["\u7d42"]="\x8fI";sjisconv["\u7d43"]="\x8c\xbc";sjisconv["\u7d44"]="\x91g";sjisconv["\u7d45"]="\xe3D";sjisconv["\u7d46"]="\xe3J";
          sjisconv["\u7d4b"]="\xe3E";sjisconv["\u7d4c"]="\x8co";sjisconv["\u7d4e"]="\xe3M";sjisconv["\u7d4f"]="\xe3Q";sjisconv["\u7d50"]="\x8c\x8b";sjisconv["\u7d56"]="\xe3L";sjisconv["\u7d5b"]="\xe3U";sjisconv["\u7d5e"]="\x8di";sjisconv["\u7d61"]="\x97\x8d";sjisconv["\u7d62"]="\x88\xba";sjisconv["\u7d63"]="\xe3R";sjisconv["\u7d66"]="\x8b\x8b";sjisconv["\u7d68"]="\xe3O";sjisconv["\u7d6e"]="\xe3P";sjisconv["\u7d71"]="\x93\x9d";sjisconv["\u7d72"]="\xe3N";sjisconv["\u7d73"]="\xe3K";sjisconv["\u7d75"]="\x8aG";
          sjisconv["\u7d76"]="\x90\xe2";sjisconv["\u7d79"]="\x8c\xa6";sjisconv["\u7d7d"]="\xe3W";sjisconv["\u7d89"]="\xe3T";sjisconv["\u7d8f"]="\xe3V";sjisconv["\u7d93"]="\xe3S";sjisconv["\u7d99"]="\x8cp";sjisconv["\u7d9a"]="\x91\xb1";sjisconv["\u7d9b"]="\xe3X";sjisconv["\u7d9c"]="\x91\x8e";sjisconv["\u7d9f"]="\xe3e";sjisconv["\u7da2"]="\xe3a";sjisconv["\u7da3"]="\xe3[";sjisconv["\u7dab"]="\xe3_";sjisconv["\u7dac"]="\x8e\xf8";sjisconv["\u7dad"]="\x88\xdb";sjisconv["\u7dae"]="\xe3Z";sjisconv["\u7daf"]="\xe3b";
          sjisconv["\u7db0"]="\xe3f";sjisconv["\u7db1"]="\x8dj";sjisconv["\u7db2"]="\x96\xd4";sjisconv["\u7db4"]="\x92\xd4";sjisconv["\u7db5"]="\xe3\\";sjisconv["\u7db8"]="\xe3d";sjisconv["\u7dba"]="\xe3Y";sjisconv["\u7dbb"]="\x92]";sjisconv["\u7dbd"]="\xe3^";sjisconv["\u7dbe"]="\x88\xbb";sjisconv["\u7dbf"]="\x96\xc8";sjisconv["\u7dc7"]="\xe3]";sjisconv["\u7dca"]="\x8b\xd9";sjisconv["\u7dcb"]="\x94\xea";sjisconv["\u7dcf"]="\x91\x8d";sjisconv["\u7dd1"]="\x97\xce";sjisconv["\u7dd2"]="\x8f\x8f";sjisconv["\u7dd5"]="\xe3\x8e";
          sjisconv["\u7dd8"]="\xe3g";sjisconv["\u7dda"]="\x90\xfc";sjisconv["\u7ddc"]="\xe3c";sjisconv["\u7ddd"]="\xe3h";sjisconv["\u7dde"]="\xe3j";sjisconv["\u7de0"]="\x92\xf7";sjisconv["\u7de1"]="\xe3m";sjisconv["\u7de4"]="\xe3i";sjisconv["\u7de8"]="\x95\xd2";sjisconv["\u7de9"]="\x8a\xc9";sjisconv["\u7dec"]="\x96\xc9";sjisconv["\u7def"]="\x88\xdc";sjisconv["\u7df2"]="\xe3l";sjisconv["\u7df4"]="\x97\xfb";sjisconv["\u7dfb"]="\xe3k";sjisconv["\u7e01"]="\x89\x8f";sjisconv["\u7e04"]="\x93\xea";sjisconv["\u7e05"]="\xe3n";
          sjisconv["\u7e09"]="\xe3u";sjisconv["\u7e0a"]="\xe3o";sjisconv["\u7e0b"]="\xe3v";sjisconv["\u7e12"]="\xe3r";sjisconv["\u7e1b"]="\x94\x9b";sjisconv["\u7e1e"]="\x8e\xc8";sjisconv["\u7e1f"]="\xe3t";sjisconv["\u7e21"]="\xe3q";sjisconv["\u7e22"]="\xe3w";sjisconv["\u7e23"]="\xe3p";sjisconv["\u7e26"]="\x8fc";sjisconv["\u7e2b"]="\x96D";sjisconv["\u7e2e"]="\x8fk";sjisconv["\u7e31"]="\xe3s";sjisconv["\u7e32"]="\xe3\x80";sjisconv["\u7e35"]="\xe3{";sjisconv["\u7e37"]="\xe3~";sjisconv["\u7e39"]="\xe3|";sjisconv["\u7e3a"]="\xe3\x81";
          sjisconv["\u7e3b"]="\xe3z";sjisconv["\u7e3d"]="\xe3`";sjisconv["\u7e3e"]="\x90\xd1";sjisconv["\u7e41"]="\x94\xc9";sjisconv["\u7e43"]="\xe3}";sjisconv["\u7e46"]="\xe3x";sjisconv["\u7e4a"]="\x91@";sjisconv["\u7e4b"]="\x8cq";sjisconv["\u7e4d"]="\x8fJ";sjisconv["\u7e54"]="\x90D";sjisconv["\u7e55"]="\x91U";sjisconv["\u7e56"]="\xe3\x84";sjisconv["\u7e59"]="\xe3\x86";sjisconv["\u7e5a"]="\xe3\x87";sjisconv["\u7e5d"]="\xe3\x83";sjisconv["\u7e5e"]="\xe3\x85";sjisconv["\u7e66"]="\xe3y";sjisconv["\u7e67"]="\xe3\x82";
          sjisconv["\u7e69"]="\xe3\x8a";sjisconv["\u7e6a"]="\xe3\x89";sjisconv["\u7e6d"]="\x96\x9a";sjisconv["\u7e70"]="\x8cJ";sjisconv["\u7e79"]="\xe3\x88";sjisconv["\u7e7b"]="\xe3\x8c";sjisconv["\u7e7c"]="\xe3\x8b";sjisconv["\u7e7d"]="\xe3\x8f";sjisconv["\u7e7f"]="\xe3\x91";sjisconv["\u7e82"]="\x8e[";sjisconv["\u7e83"]="\xe3\x8d";sjisconv["\u7e88"]="\xe3\x92";sjisconv["\u7e89"]="\xe3\x93";sjisconv["\u7e8c"]="\xe3\x94";sjisconv["\u7e8e"]="\xe3\x9a";sjisconv["\u7e8f"]="\x93Z";sjisconv["\u7e90"]="\xe3\x96";
          sjisconv["\u7e92"]="\xe3\x95";sjisconv["\u7e93"]="\xe3\x97";sjisconv["\u7e94"]="\xe3\x98";sjisconv["\u7e96"]="\xe3\x99";sjisconv["\u7e9b"]="\xe3\x9b";sjisconv["\u7e9c"]="\xe3\x9c";sjisconv["\u7f36"]="\x8a\xca";sjisconv["\u7f38"]="\xe3\x9d";sjisconv["\u7f3a"]="\xe3\x9e";sjisconv["\u7f45"]="\xe3\x9f";sjisconv["\u7f4c"]="\xe3\xa0";sjisconv["\u7f4d"]="\xe3\xa1";sjisconv["\u7f4e"]="\xe3\xa2";sjisconv["\u7f50"]="\xe3\xa3";sjisconv["\u7f51"]="\xe3\xa4";sjisconv["\u7f54"]="\xe3\xa6";sjisconv["\u7f55"]="\xe3\xa5";
          sjisconv["\u7f58"]="\xe3\xa7";sjisconv["\u7f5f"]="\xe3\xa8";sjisconv["\u7f60"]="\xe3\xa9";sjisconv["\u7f67"]="\xe3\xac";sjisconv["\u7f68"]="\xe3\xaa";sjisconv["\u7f69"]="\xe3\xab";sjisconv["\u7f6a"]="\x8d\xdf";sjisconv["\u7f6b"]="\x8cr";sjisconv["\u7f6e"]="\x92u";sjisconv["\u7f70"]="\x94\xb1";sjisconv["\u7f72"]="\x8f\x90";sjisconv["\u7f75"]="\x94l";sjisconv["\u7f77"]="\x94\xeb";sjisconv["\u7f78"]="\xe3\xad";sjisconv["\u7f79"]="\x9c\xeb";sjisconv["\u7f82"]="\xe3\xae";sjisconv["\u7f83"]="\xe3\xb0";
          sjisconv["\u7f85"]="\x97\x85";sjisconv["\u7f86"]="\xe3\xaf";sjisconv["\u7f87"]="\xe3\xb2";sjisconv["\u7f88"]="\xe3\xb1";sjisconv["\u7f8a"]="\x97r";sjisconv["\u7f8c"]="\xe3\xb3";sjisconv["\u7f8e"]="\x94\xfc";sjisconv["\u7f94"]="\xe3\xb4";sjisconv["\u7f9a"]="\xe3\xb7";sjisconv["\u7f9d"]="\xe3\xb6";sjisconv["\u7f9e"]="\xe3\xb5";sjisconv["\u7fa3"]="\xe3\xb8";sjisconv["\u7fa4"]="\x8cQ";sjisconv["\u7fa8"]="\x91A";sjisconv["\u7fa9"]="\x8b`";sjisconv["\u7fae"]="\xe3\xbc";sjisconv["\u7faf"]="\xe3\xb9";sjisconv["\u7fb2"]="\xe3\xba";
          sjisconv["\u7fb6"]="\xe3\xbd";sjisconv["\u7fb8"]="\xe3\xbe";sjisconv["\u7fb9"]="\xe3\xbb";sjisconv["\u7fbd"]="\x89H";sjisconv["\u7fc1"]="\x89\xa5";sjisconv["\u7fc5"]="\xe3\xc0";sjisconv["\u7fc6"]="\xe3\xc1";sjisconv["\u7fca"]="\xe3\xc2";sjisconv["\u7fcc"]="\x97\x82";sjisconv["\u7fd2"]="\x8fK";sjisconv["\u7fd4"]="\xe3\xc4";sjisconv["\u7fd5"]="\xe3\xc3";sjisconv["\u7fe0"]="\x90\x89";sjisconv["\u7fe1"]="\xe3\xc5";sjisconv["\u7fe6"]="\xe3\xc6";sjisconv["\u7fe9"]="\xe3\xc7";sjisconv["\u7feb"]="\x8a\xe3";
          sjisconv["\u7ff0"]="\x8a\xcb";sjisconv["\u7ff3"]="\xe3\xc8";sjisconv["\u7ff9"]="\xe3\xc9";sjisconv["\u7ffb"]="\x96|";sjisconv["\u7ffc"]="\x97\x83";sjisconv["\u8000"]="\x97s";sjisconv["\u8001"]="\x98V";sjisconv["\u8003"]="\x8dl";sjisconv["\u8004"]="\xe3\xcc";sjisconv["\u8005"]="\x8e\xd2";sjisconv["\u8006"]="\xe3\xcb";sjisconv["\u800b"]="\xe3\xcd";sjisconv["\u800c"]="\x8e\xa7";sjisconv["\u8010"]="\x91\xcf";sjisconv["\u8012"]="\xe3\xce";sjisconv["\u8015"]="\x8dk";sjisconv["\u8017"]="\x96\xd5";sjisconv["\u8018"]="\xe3\xcf";
          sjisconv["\u8019"]="\xe3\xd0";sjisconv["\u801c"]="\xe3\xd1";sjisconv["\u8021"]="\xe3\xd2";sjisconv["\u8028"]="\xe3\xd3";sjisconv["\u8033"]="\x8e\xa8";sjisconv["\u8036"]="\x96\xeb";sjisconv["\u803b"]="\xe3\xd5";sjisconv["\u803d"]="\x92^";sjisconv["\u803f"]="\xe3\xd4";sjisconv["\u8046"]="\xe3\xd7";sjisconv["\u804a"]="\xe3\xd6";sjisconv["\u8052"]="\xe3\xd8";sjisconv["\u8056"]="\x90\xb9";sjisconv["\u8058"]="\xe3\xd9";sjisconv["\u805a"]="\xe3\xda";sjisconv["\u805e"]="\x95\xb7";sjisconv["\u805f"]="\xe3\xdb";
          sjisconv["\u8061"]="\x91\x8f";sjisconv["\u8062"]="\xe3\xdc";sjisconv["\u8068"]="\xe3\xdd";sjisconv["\u806f"]="\x97\xfc";sjisconv["\u8070"]="\xe3\xe0";sjisconv["\u8072"]="\xe3\xdf";sjisconv["\u8073"]="\xe3\xde";sjisconv["\u8074"]="\x92\xae";sjisconv["\u8076"]="\xe3\xe1";sjisconv["\u8077"]="\x90E";sjisconv["\u8079"]="\xe3\xe2";sjisconv["\u807d"]="\xe3\xe3";sjisconv["\u807e"]="\x98W";sjisconv["\u807f"]="\xe3\xe4";sjisconv["\u8084"]="\xe3\xe5";sjisconv["\u8085"]="\xe3\xe7";sjisconv["\u8086"]="\xe3\xe6";
          sjisconv["\u8087"]="\x94\xa3";sjisconv["\u8089"]="\x93\xf7";sjisconv["\u808b"]="\x98]";sjisconv["\u808c"]="\x94\xa7";sjisconv["\u8093"]="\xe3\xe9";sjisconv["\u8096"]="\x8f\xd1";sjisconv["\u8098"]="\x95I";sjisconv["\u809a"]="\xe3\xea";sjisconv["\u809b"]="\xe3\xe8";sjisconv["\u809d"]="\x8a\xcc";sjisconv["\u80a1"]="\x8c\xd2";sjisconv["\u80a2"]="\x8e\x88";sjisconv["\u80a5"]="\x94\xec";sjisconv["\u80a9"]="\x8c\xa8";sjisconv["\u80aa"]="\x96b";sjisconv["\u80ac"]="\xe3\xed";sjisconv["\u80ad"]="\xe3\xeb";
          sjisconv["\u80af"]="\x8dm";sjisconv["\u80b1"]="\x8dn";sjisconv["\u80b2"]="\x88\xe7";sjisconv["\u80b4"]="\x8d\xe6";sjisconv["\u80ba"]="\x94x";sjisconv["\u80c3"]="\x88\xdd";sjisconv["\u80c4"]="\xe3\xf2";sjisconv["\u80c6"]="\x92_";sjisconv["\u80cc"]="\x94w";sjisconv["\u80ce"]="\x91\xd9";sjisconv["\u80d6"]="\xe3\xf4";sjisconv["\u80d9"]="\xe3\xf0";sjisconv["\u80da"]="\xe3\xf3";sjisconv["\u80db"]="\xe3\xee";sjisconv["\u80dd"]="\xe3\xf1";sjisconv["\u80de"]="\x96E";sjisconv["\u80e1"]="\x8c\xd3";sjisconv["\u80e4"]="\x88\xfb";
          sjisconv["\u80e5"]="\xe3\xef";sjisconv["\u80ef"]="\xe3\xf6";sjisconv["\u80f1"]="\xe3\xf7";sjisconv["\u80f4"]="\x93\xb7";sjisconv["\u80f8"]="\x8b\xb9";sjisconv["\u80fc"]="\xe4E";sjisconv["\u80fd"]="\x94\\";sjisconv["\u8102"]="\x8e\x89";sjisconv["\u8105"]="\x8b\xba";sjisconv["\u8106"]="\x90\xc6";sjisconv["\u8107"]="\x98e";sjisconv["\u8108"]="\x96\xac";sjisconv["\u8109"]="\xe3\xf5";sjisconv["\u810a"]="\x90\xd2";sjisconv["\u811a"]="\x8br";sjisconv["\u811b"]="\xe3\xf8";sjisconv["\u8123"]="\xe3\xfa";sjisconv["\u8129"]="\xe3\xf9";
          sjisconv["\u812f"]="\xe3\xfb";sjisconv["\u8131"]="\x92E";sjisconv["\u8133"]="\x94]";sjisconv["\u8139"]="\x92\xaf";sjisconv["\u813e"]="\xe4B";sjisconv["\u8146"]="\xe4A";sjisconv["\u814b"]="\xe3\xfc";sjisconv["\u814e"]="\x90t";sjisconv["\u8150"]="\x95\x85";sjisconv["\u8151"]="\xe4D";sjisconv["\u8153"]="\xe4C";sjisconv["\u8154"]="\x8do";sjisconv["\u8155"]="\x98r";sjisconv["\u815f"]="\xe4T";sjisconv["\u8165"]="\xe4H";sjisconv["\u8166"]="\xe4I";sjisconv["\u816b"]="\x8e\xee";sjisconv["\u816e"]="\xe4G";
          sjisconv["\u8170"]="\x8d\x98";sjisconv["\u8171"]="\xe4F";sjisconv["\u8174"]="\xe4J";sjisconv["\u8178"]="\x92\xb0";sjisconv["\u8179"]="\x95\xa0";sjisconv["\u817a"]="\x91B";sjisconv["\u817f"]="\x91\xda";sjisconv["\u8180"]="\xe4N";sjisconv["\u8182"]="\xe4O";sjisconv["\u8183"]="\xe4K";sjisconv["\u8188"]="\xe4L";sjisconv["\u818a"]="\xe4M";sjisconv["\u818f"]="\x8dp";sjisconv["\u8193"]="\xe4U";sjisconv["\u8195"]="\xe4Q";sjisconv["\u819a"]="\x95\x86";sjisconv["\u819c"]="\x96\x8c";sjisconv["\u819d"]="\x95G";
          sjisconv["\u81a0"]="\xe4P";sjisconv["\u81a3"]="\xe4S";sjisconv["\u81a4"]="\xe4R";sjisconv["\u81a8"]="\x96c";sjisconv["\u81a9"]="\xe4V";sjisconv["\u81b0"]="\xe4W";sjisconv["\u81b3"]="\x91V";sjisconv["\u81b5"]="\xe4X";sjisconv["\u81b8"]="\xe4Z";sjisconv["\u81ba"]="\xe4^";sjisconv["\u81bd"]="\xe4[";sjisconv["\u81be"]="\xe4Y";sjisconv["\u81bf"]="\x94^";sjisconv["\u81c0"]="\xe4\\";sjisconv["\u81c2"]="\xe4]";sjisconv["\u81c6"]="\x89\xb0";sjisconv["\u81c8"]="\xe4d";sjisconv["\u81c9"]="\xe4_";sjisconv["\u81cd"]="\xe4`";
          sjisconv["\u81d1"]="\xe4a";sjisconv["\u81d3"]="\x91\x9f";sjisconv["\u81d8"]="\xe4c";sjisconv["\u81d9"]="\xe4b";sjisconv["\u81da"]="\xe4e";sjisconv["\u81df"]="\xe4f";sjisconv["\u81e0"]="\xe4g";sjisconv["\u81e3"]="\x90b";sjisconv["\u81e5"]="\x89\xe7";sjisconv["\u81e7"]="\xe4h";sjisconv["\u81e8"]="\x97\xd5";sjisconv["\u81ea"]="\x8e\xa9";sjisconv["\u81ed"]="\x8fL";sjisconv["\u81f3"]="\x8e\x8a";sjisconv["\u81f4"]="\x92v";sjisconv["\u81fa"]="\xe4i";sjisconv["\u81fb"]="\xe4j";sjisconv["\u81fc"]="\x89P";
          sjisconv["\u81fe"]="\xe4k";sjisconv["\u8201"]="\xe4l";sjisconv["\u8202"]="\xe4m";sjisconv["\u8205"]="\xe4n";sjisconv["\u8207"]="\xe4o";sjisconv["\u8208"]="\x8b\xbb";sjisconv["\u8209"]="\x9d\xa8";sjisconv["\u820a"]="\xe4p";sjisconv["\u820c"]="\x90\xe3";sjisconv["\u820d"]="\xe4q";sjisconv["\u820e"]="\x8e\xc9";sjisconv["\u8210"]="\xe4r";sjisconv["\u8212"]="\x98\xae";sjisconv["\u8216"]="\xe4s";sjisconv["\u8217"]="\x95\xdc";sjisconv["\u8218"]="\x8a\xda";sjisconv["\u821b"]="\x91C";sjisconv["\u821c"]="\x8fw";
          sjisconv["\u821e"]="\x95\x91";sjisconv["\u821f"]="\x8fM";sjisconv["\u8229"]="\xe4t";sjisconv["\u822a"]="\x8dq";sjisconv["\u822b"]="\xe4u";sjisconv["\u822c"]="\x94\xca";sjisconv["\u822e"]="\xe4\x84";sjisconv["\u8233"]="\xe4w";sjisconv["\u8235"]="\x91\xc7";sjisconv["\u8236"]="\x94\x95";sjisconv["\u8237"]="\x8c\xbd";sjisconv["\u8238"]="\xe4v";sjisconv["\u8239"]="\x91D";sjisconv["\u8240"]="\xe4x";sjisconv["\u8247"]="\x92\xf8";sjisconv["\u8258"]="\xe4z";sjisconv["\u8259"]="\xe4y";sjisconv["\u825a"]="\xe4|";
          sjisconv["\u825d"]="\xe4{";sjisconv["\u825f"]="\xe4}";sjisconv["\u8262"]="\xe4\x80";sjisconv["\u8264"]="\xe4~";sjisconv["\u8266"]="\x8a\xcd";sjisconv["\u8268"]="\xe4\x81";sjisconv["\u826a"]="\xe4\x82";sjisconv["\u826b"]="\xe4\x83";sjisconv["\u826e"]="\x8d\xaf";sjisconv["\u826f"]="\x97\xc7";sjisconv["\u8271"]="\xe4\x85";sjisconv["\u8272"]="\x90F";sjisconv["\u8276"]="\x89\x90";sjisconv["\u8277"]="\xe4\x86";sjisconv["\u8278"]="\xe4\x87";sjisconv["\u827e"]="\xe4\x88";sjisconv["\u828b"]="\x88\xf0";sjisconv["\u828d"]="\xe4\x89";
          sjisconv["\u8292"]="\xe4\x8a";sjisconv["\u8299"]="\x95\x87";sjisconv["\u829d"]="\x8e\xc5";sjisconv["\u829f"]="\xe4\x8c";sjisconv["\u82a5"]="\x8aH";sjisconv["\u82a6"]="\x88\xb0";sjisconv["\u82ab"]="\xe4\x8b";sjisconv["\u82ac"]="\xe4\x8e";sjisconv["\u82ad"]="\x94m";sjisconv["\u82af"]="\x90c";sjisconv["\u82b1"]="\x89\xd4";sjisconv["\u82b3"]="\x96F";sjisconv["\u82b8"]="\x8c|";sjisconv["\u82b9"]="\x8b\xda";sjisconv["\u82bb"]="\xe4\x8d";sjisconv["\u82bd"]="\x89\xe8";sjisconv["\u82c5"]="\x8a\xa1";sjisconv["\u82d1"]="\x89\x91";
          sjisconv["\u82d2"]="\xe4\x92";sjisconv["\u82d3"]="\x97\xe8";sjisconv["\u82d4"]="\x91\xdb";sjisconv["\u82d7"]="\x95c";sjisconv["\u82d9"]="\xe4\x9e";sjisconv["\u82db"]="\x89\xd5";sjisconv["\u82dc"]="\xe4\x9c";sjisconv["\u82de"]="\xe4\x9a";sjisconv["\u82df"]="\xe4\x91";sjisconv["\u82e1"]="\xe4\x8f";sjisconv["\u82e3"]="\xe4\x90";sjisconv["\u82e5"]="\x8e\xe1";sjisconv["\u82e6"]="\x8b\xea";sjisconv["\u82e7"]="\x92\x97";sjisconv["\u82eb"]="\x93\xcf";sjisconv["\u82f1"]="\x89p";sjisconv["\u82f3"]="\xe4\x94";
          sjisconv["\u82f4"]="\xe4\x93";sjisconv["\u82f9"]="\xe4\x99";sjisconv["\u82fa"]="\xe4\x95";sjisconv["\u82fb"]="\xe4\x98";sjisconv["\u8302"]="\x96\xce";sjisconv["\u8303"]="\xe4\x97";sjisconv["\u8304"]="\x89\xd6";sjisconv["\u8305"]="\x8a\x9d";sjisconv["\u8306"]="\xe4\x9b";sjisconv["\u8309"]="\xe4\x9d";sjisconv["\u830e"]="\x8cs";sjisconv["\u8316"]="\xe4\xa1";sjisconv["\u8317"]="\xe4\xaa";sjisconv["\u8318"]="\xe4\xab";sjisconv["\u831c"]="\x88\xa9";sjisconv["\u8323"]="\xe4\xb2";sjisconv["\u8328"]="\x88\xef";
          sjisconv["\u832b"]="\xe4\xa9";sjisconv["\u832f"]="\xe4\xa8";sjisconv["\u8331"]="\xe4\xa3";sjisconv["\u8332"]="\xe4\xa2";sjisconv["\u8334"]="\xe4\xa0";sjisconv["\u8335"]="\xe4\x9f";sjisconv["\u8336"]="\x92\x83";sjisconv["\u8338"]="\x91\xf9";sjisconv["\u8339"]="\xe4\xa5";sjisconv["\u8340"]="\xe4\xa4";sjisconv["\u8345"]="\xe4\xa7";sjisconv["\u8349"]="\x91\x90";sjisconv["\u834a"]="\x8ct";sjisconv["\u834f"]="\x89`";sjisconv["\u8350"]="\xe4\xa6";sjisconv["\u8352"]="\x8dr";sjisconv["\u8358"]="\x91\x91";
          sjisconv["\u8373"]="\xe4\xb8";sjisconv["\u8375"]="\xe4\xb9";sjisconv["\u8377"]="\x89\xd7";sjisconv["\u837b"]="\x89\xac";sjisconv["\u837c"]="\xe4\xb6";sjisconv["\u8385"]="\xe4\xac";sjisconv["\u8387"]="\xe4\xb4";sjisconv["\u8389"]="\xe4\xbb";sjisconv["\u838a"]="\xe4\xb5";sjisconv["\u838e"]="\xe4\xb3";sjisconv["\u8393"]="\xe4\x96";sjisconv["\u8396"]="\xe4\xb1";sjisconv["\u839a"]="\xe4\xad";sjisconv["\u839e"]="\x8a\xce";sjisconv["\u839f"]="\xe4\xaf";sjisconv["\u83a0"]="\xe4\xba";sjisconv["\u83a2"]="\xe4\xb0";
          sjisconv["\u83a8"]="\xe4\xbc";sjisconv["\u83aa"]="\xe4\xae";sjisconv["\u83ab"]="\x94\x9c";sjisconv["\u83b1"]="\x97\x89";sjisconv["\u83b5"]="\xe4\xb7";sjisconv["\u83bd"]="\xe4\xcd";sjisconv["\u83c1"]="\xe4\xc5";sjisconv["\u83c5"]="\x90\x9b";sjisconv["\u83ca"]="\x8be";sjisconv["\u83cc"]="\x8b\xdb";sjisconv["\u83ce"]="\xe4\xc0";sjisconv["\u83d3"]="\x89\xd9";sjisconv["\u83d6"]="\x8f\xd2";sjisconv["\u83d8"]="\xe4\xc3";sjisconv["\u83dc"]="\x8d\xd8";sjisconv["\u83df"]="\x93p";sjisconv["\u83e0"]="\xe4\xc8";
          sjisconv["\u83e9"]="\x95\xec";sjisconv["\u83eb"]="\xe4\xbf";sjisconv["\u83ef"]="\x89\xd8";sjisconv["\u83f0"]="\x8c\xd4";sjisconv["\u83f1"]="\x95H";sjisconv["\u83f2"]="\xe4\xc9";sjisconv["\u83f4"]="\xe4\xbd";sjisconv["\u83f7"]="\xe4\xc6";sjisconv["\u83fb"]="\xe4\xd0";sjisconv["\u83fd"]="\xe4\xc1";sjisconv["\u8403"]="\xe4\xc2";sjisconv["\u8404"]="\x93\xb8";sjisconv["\u8407"]="\xe4\xc7";sjisconv["\u840b"]="\xe4\xc4";sjisconv["\u840c"]="\x96G";sjisconv["\u840d"]="\xe4\xca";sjisconv["\u840e"]="\x88\xde";
          sjisconv["\u8413"]="\xe4\xbe";sjisconv["\u8420"]="\xe4\xcc";sjisconv["\u8422"]="\xe4\xcb";sjisconv["\u8429"]="\x94\x8b";sjisconv["\u842a"]="\xe4\xd2";sjisconv["\u842c"]="\xe4\xdd";sjisconv["\u8431"]="\x8a\x9e";sjisconv["\u8435"]="\xe4\xe0";sjisconv["\u8438"]="\xe4\xce";sjisconv["\u843c"]="\xe4\xd3";sjisconv["\u843d"]="\x97\x8e";sjisconv["\u8446"]="\xe4\xdc";sjisconv["\u8449"]="\x97t";sjisconv["\u844e"]="\x97\xa8";sjisconv["\u8457"]="\x92\x98";sjisconv["\u845b"]="\x8a\x8b";sjisconv["\u8461"]="\x95\x92";
          sjisconv["\u8462"]="\xe4\xe2";sjisconv["\u8463"]="\x93\x9f";sjisconv["\u8466"]="\x88\xaf";sjisconv["\u8469"]="\xe4\xdb";sjisconv["\u846b"]="\xe4\xd7";sjisconv["\u846c"]="\x91\x92";sjisconv["\u846d"]="\xe4\xd1";sjisconv["\u846e"]="\xe4\xd9";sjisconv["\u846f"]="\xe4\xde";sjisconv["\u8471"]="\x94K";sjisconv["\u8475"]="\x88\xa8";sjisconv["\u8477"]="\xe4\xd6";sjisconv["\u8479"]="\xe4\xdf";sjisconv["\u847a"]="\x95\x98";sjisconv["\u8482"]="\xe4\xda";sjisconv["\u8484"]="\xe4\xd5";sjisconv["\u848b"]="\x8f\xd3";
          sjisconv["\u8490"]="\x8fN";sjisconv["\u8494"]="\x8e\xaa";sjisconv["\u8499"]="\x96\xd6";sjisconv["\u849c"]="\x95f";sjisconv["\u849f"]="\xe4\xe5";sjisconv["\u84a1"]="\xe4\xee";sjisconv["\u84ad"]="\xe4\xd8";sjisconv["\u84b2"]="\x8a\x97";sjisconv["\u84b8"]="\x8f\xf6";sjisconv["\u84b9"]="\xe4\xe3";sjisconv["\u84bb"]="\xe4\xe8";sjisconv["\u84bc"]="\x91\x93";sjisconv["\u84bf"]="\xe4\xe4";sjisconv["\u84c1"]="\xe4\xeb";sjisconv["\u84c4"]="\x92~";sjisconv["\u84c6"]="\xe4\xec";sjisconv["\u84c9"]="\x97u";sjisconv["\u84ca"]="\xe4\xe1";
          sjisconv["\u84cb"]="\x8aW";sjisconv["\u84cd"]="\xe4\xe7";sjisconv["\u84d0"]="\xe4\xea";sjisconv["\u84d1"]="\x96\xaa";sjisconv["\u84d6"]="\xe4\xed";sjisconv["\u84d9"]="\xe4\xe6";sjisconv["\u84da"]="\xe4\xe9";sjisconv["\u84ec"]="\x96H";sjisconv["\u84ee"]="\x98@";sjisconv["\u84f4"]="\xe4\xf1";sjisconv["\u84fc"]="\xe4\xf8";sjisconv["\u84ff"]="\xe4\xf0";sjisconv["\u8500"]="\x8e\xc1";sjisconv["\u8506"]="\xe4\xcf";sjisconv["\u8511"]="\x95\xcc";sjisconv["\u8513"]="\x96\xa0";sjisconv["\u8514"]="\xe4\xf7";
          sjisconv["\u8515"]="\xe4\xf6";sjisconv["\u8517"]="\xe4\xf2";sjisconv["\u8518"]="\xe4\xf3";sjisconv["\u851a"]="\x89U";sjisconv["\u851f"]="\xe4\xf5";sjisconv["\u8521"]="\xe4\xef";sjisconv["\u8526"]="\x92\xd3";sjisconv["\u852c"]="\xe4\xf4";sjisconv["\u852d"]="\x88\xfc";sjisconv["\u8535"]="\x91\xa0";sjisconv["\u853d"]="\x95\xc1";sjisconv["\u8540"]="\xe4\xf9";sjisconv["\u8541"]="\xe5@";sjisconv["\u8543"]="\x94\xd7";sjisconv["\u8548"]="\xe4\xfc";sjisconv["\u8549"]="\x8f\xd4";sjisconv["\u854a"]="\x8e\xc7";
          sjisconv["\u854b"]="\xe5B";sjisconv["\u854e"]="\x8b\xbc";sjisconv["\u8555"]="\xe5C";sjisconv["\u8557"]="\x95\x99";sjisconv["\u8558"]="\xe4\xfb";sjisconv["\u855a"]="\xe4\xd4";sjisconv["\u8563"]="\xe4\xfa";sjisconv["\u8568"]="\x98n";sjisconv["\u8569"]="\x93\xa0";sjisconv["\u856a"]="\x95\x93";sjisconv["\u856d"]="\xe5J";sjisconv["\u8577"]="\xe5P";sjisconv["\u857e"]="\xe5Q";sjisconv["\u8580"]="\xe5D";sjisconv["\u8584"]="\x94\x96";sjisconv["\u8587"]="\xe5N";sjisconv["\u8588"]="\xe5F";sjisconv["\u858a"]="\xe5H";
          sjisconv["\u8590"]="\xe5R";sjisconv["\u8591"]="\xe5G";sjisconv["\u8594"]="\xe5K";sjisconv["\u8597"]="\x89\x92";sjisconv["\u8599"]="\x93\xe3";sjisconv["\u859b"]="\xe5L";sjisconv["\u859c"]="\xe5O";sjisconv["\u85a4"]="\xe5E";sjisconv["\u85a6"]="\x91E";sjisconv["\u85a8"]="\xe5I";sjisconv["\u85a9"]="\x8eF";sjisconv["\u85aa"]="\x90d";sjisconv["\u85ab"]="\x8cO";sjisconv["\u85ac"]="\x96\xf2";sjisconv["\u85ae"]="\x96\xf7";sjisconv["\u85af"]="\x8f\x92";sjisconv["\u85b9"]="\xe5V";sjisconv["\u85ba"]="\xe5T";
          sjisconv["\u85c1"]="\x98m";sjisconv["\u85c9"]="\xe5S";sjisconv["\u85cd"]="\x97\x95";sjisconv["\u85cf"]="\xe5U";sjisconv["\u85d0"]="\xe5W";sjisconv["\u85d5"]="\xe5X";sjisconv["\u85dc"]="\xe5[";sjisconv["\u85dd"]="\xe5Y";sjisconv["\u85e4"]="\x93\xa1";sjisconv["\u85e5"]="\xe5Z";sjisconv["\u85e9"]="\x94\xcb";sjisconv["\u85ea"]="\xe5M";sjisconv["\u85f7"]="\x8f\x93";sjisconv["\u85f9"]="\xe5\\";sjisconv["\u85fa"]="\xe5a";sjisconv["\u85fb"]="\x91\x94";sjisconv["\u85fe"]="\xe5`";sjisconv["\u8602"]="\xe5A";
          sjisconv["\u8606"]="\xe5b";sjisconv["\u8607"]="\x91h";sjisconv["\u860a"]="\xe5]";sjisconv["\u860b"]="\xe5_";sjisconv["\u8613"]="\xe5^";sjisconv["\u8616"]="\x9fP";sjisconv["\u8617"]="\x9fA";sjisconv["\u861a"]="\xe5d";sjisconv["\u8622"]="\xe5c";sjisconv["\u862d"]="\x97\x96";sjisconv["\u862f"]="\xe1\xba";sjisconv["\u8630"]="\xe5e";sjisconv["\u863f"]="\xe5f";sjisconv["\u864d"]="\xe5g";sjisconv["\u864e"]="\x8c\xd5";sjisconv["\u8650"]="\x8bs";sjisconv["\u8654"]="\xe5i";sjisconv["\u8655"]="\x99|";sjisconv["\u865a"]="\x8b\x95";
          sjisconv["\u865c"]="\x97\xb8";sjisconv["\u865e"]="\x8b\xf1";sjisconv["\u865f"]="\xe5j";sjisconv["\u8667"]="\xe5k";sjisconv["\u866b"]="\x92\x8e";sjisconv["\u8671"]="\xe5l";sjisconv["\u8679"]="\x93\xf8";sjisconv["\u867b"]="\x88\xb8";sjisconv["\u868a"]="\x89\xe1";sjisconv["\u868b"]="\xe5q";sjisconv["\u868c"]="\xe5r";sjisconv["\u8693"]="\xe5m";sjisconv["\u8695"]="\x8e\\";sjisconv["\u86a3"]="\xe5n";sjisconv["\u86a4"]="\x94a";sjisconv["\u86a9"]="\xe5o";sjisconv["\u86aa"]="\xe5p";sjisconv["\u86ab"]="\xe5z";
          sjisconv["\u86af"]="\xe5t";sjisconv["\u86b0"]="\xe5w";sjisconv["\u86b6"]="\xe5s";sjisconv["\u86c4"]="\xe5u";sjisconv["\u86c6"]="\xe5v";sjisconv["\u86c7"]="\x8e\xd6";sjisconv["\u86c9"]="\xe5x";sjisconv["\u86cb"]="\x92`";sjisconv["\u86cd"]="\x8cu";sjisconv["\u86ce"]="\x8aa";sjisconv["\u86d4"]="\xe5{";sjisconv["\u86d9"]="\x8a^";sjisconv["\u86db"]="\xe5\x81";sjisconv["\u86de"]="\xe5|";sjisconv["\u86df"]="\xe5\x80";sjisconv["\u86e4"]="\x94\xb8";sjisconv["\u86e9"]="\xe5}";sjisconv["\u86ec"]="\xe5~";sjisconv["\u86ed"]="\x95g";
          sjisconv["\u86ee"]="\x94\xd8";sjisconv["\u86ef"]="\xe5\x82";sjisconv["\u86f8"]="\x91\xfb";sjisconv["\u86f9"]="\xe5\x8c";sjisconv["\u86fb"]="\xe5\x88";sjisconv["\u86fe"]="\x89\xe9";sjisconv["\u8700"]="\xe5\x86";sjisconv["\u8702"]="\x96I";sjisconv["\u8703"]="\xe5\x87";sjisconv["\u8706"]="\xe5\x84";sjisconv["\u8708"]="\xe5\x85";sjisconv["\u8709"]="\xe5\x8a";sjisconv["\u870a"]="\xe5\x8d";sjisconv["\u870d"]="\xe5\x8b";sjisconv["\u8711"]="\xe5\x89";sjisconv["\u8712"]="\xe5\x83";sjisconv["\u8718"]="\x92w";
          sjisconv["\u871a"]="\xe5\x94";sjisconv["\u871c"]="\x96\xa8";sjisconv["\u8725"]="\xe5\x92";sjisconv["\u8729"]="\xe5\x93";sjisconv["\u8734"]="\xe5\x8e";sjisconv["\u8737"]="\xe5\x90";sjisconv["\u873b"]="\xe5\x91";sjisconv["\u873f"]="\xe5\x8f";sjisconv["\u8749"]="\x90\xe4";sjisconv["\u874b"]="\x98X";sjisconv["\u874c"]="\xe5\x98";sjisconv["\u874e"]="\xe5\x99";sjisconv["\u8753"]="\xe5\x9f";sjisconv["\u8755"]="\x90I";sjisconv["\u8757"]="\xe5\x9b";sjisconv["\u8759"]="\xe5\x9e";sjisconv["\u875f"]="\xe5\x96";
          sjisconv["\u8760"]="\xe5\x95";sjisconv["\u8763"]="\xe5\xa0";sjisconv["\u8766"]="\x89\xda";sjisconv["\u8768"]="\xe5\x9c";sjisconv["\u876a"]="\xe5\xa1";sjisconv["\u876e"]="\xe5\x9d";sjisconv["\u8774"]="\xe5\x9a";sjisconv["\u8776"]="\x92\xb1";sjisconv["\u8778"]="\xe5\x97";sjisconv["\u877f"]="\x94\x88";sjisconv["\u8782"]="\xe5\xa5";sjisconv["\u878d"]="\x97Z";sjisconv["\u879f"]="\xe5\xa4";sjisconv["\u87a2"]="\xe5\xa3";sjisconv["\u87ab"]="\xe5\xac";sjisconv["\u87af"]="\xe5\xa6";sjisconv["\u87b3"]="\xe5\xae";
          sjisconv["\u87ba"]="\x97\x86";sjisconv["\u87bb"]="\xe5\xb1";sjisconv["\u87bd"]="\xe5\xa8";sjisconv["\u87c0"]="\xe5\xa9";sjisconv["\u87c4"]="\xe5\xad";sjisconv["\u87c6"]="\xe5\xb0";sjisconv["\u87c7"]="\xe5\xaf";sjisconv["\u87cb"]="\xe5\xa7";sjisconv["\u87d0"]="\xe5\xaa";sjisconv["\u87d2"]="\xe5\xbb";sjisconv["\u87e0"]="\xe5\xb4";sjisconv["\u87ef"]="\xe5\xb2";sjisconv["\u87f2"]="\xe5\xb3";sjisconv["\u87f6"]="\xe5\xb8";sjisconv["\u87f7"]="\xe5\xb9";sjisconv["\u87f9"]="\x8aI";sjisconv["\u87fb"]="\x8ba";
          sjisconv["\u87fe"]="\xe5\xb7";sjisconv["\u8805"]="\xe5\xa2";sjisconv["\u880d"]="\xe5\xb6";sjisconv["\u880e"]="\xe5\xba";sjisconv["\u880f"]="\xe5\xb5";sjisconv["\u8811"]="\xe5\xbc";sjisconv["\u8815"]="\xe5\xbe";sjisconv["\u8816"]="\xe5\xbd";sjisconv["\u8821"]="\xe5\xc0";sjisconv["\u8822"]="\xe5\xbf";sjisconv["\u8823"]="\xe5y";sjisconv["\u8827"]="\xe5\xc4";sjisconv["\u8831"]="\xe5\xc1";sjisconv["\u8836"]="\xe5\xc2";sjisconv["\u8839"]="\xe5\xc3";sjisconv["\u883b"]="\xe5\xc5";sjisconv["\u8840"]="\x8c\x8c";
          sjisconv["\u8842"]="\xe5\xc7";sjisconv["\u8844"]="\xe5\xc6";sjisconv["\u8846"]="\x8fO";sjisconv["\u884c"]="\x8ds";sjisconv["\u884d"]="\x9f\xa5";sjisconv["\u8852"]="\xe5\xc8";sjisconv["\u8853"]="\x8fp";sjisconv["\u8857"]="\x8aX";sjisconv["\u8859"]="\xe5\xc9";sjisconv["\u885b"]="\x89q";sjisconv["\u885d"]="\x8f\xd5";sjisconv["\u885e"]="\xe5\xca";sjisconv["\u8861"]="\x8dt";sjisconv["\u8862"]="\xe5\xcb";sjisconv["\u8863"]="\x88\xdf";sjisconv["\u8868"]="\x95\\";sjisconv["\u886b"]="\xe5\xcc";sjisconv["\u8870"]="\x90\x8a";
          sjisconv["\u8872"]="\xe5\xd3";sjisconv["\u8875"]="\xe5\xd0";sjisconv["\u8877"]="\x92\x8f";sjisconv["\u887d"]="\xe5\xd1";sjisconv["\u887e"]="\xe5\xce";sjisconv["\u887f"]="\x8b\xdc";sjisconv["\u8881"]="\xe5\xcd";sjisconv["\u8882"]="\xe5\xd4";sjisconv["\u8888"]="\x8cU";sjisconv["\u888b"]="\x91\xdc";sjisconv["\u888d"]="\xe5\xda";sjisconv["\u8892"]="\xe5\xd6";sjisconv["\u8896"]="\x91\xb3";sjisconv["\u8897"]="\xe5\xd5";sjisconv["\u8899"]="\xe5\xd8";sjisconv["\u889e"]="\xe5\xcf";sjisconv["\u88a2"]="\xe5\xd9";
          sjisconv["\u88a4"]="\xe5\xdb";sjisconv["\u88ab"]="\x94\xed";sjisconv["\u88ae"]="\xe5\xd7";sjisconv["\u88b0"]="\xe5\xdc";sjisconv["\u88b1"]="\xe5\xde";sjisconv["\u88b4"]="\x8c\xd1";sjisconv["\u88b5"]="\xe5\xd2";sjisconv["\u88b7"]="\x88\xbf";sjisconv["\u88bf"]="\xe5\xdd";sjisconv["\u88c1"]="\x8d\xd9";sjisconv["\u88c2"]="\x97\xf4";sjisconv["\u88c3"]="\xe5\xdf";sjisconv["\u88c4"]="\xe5\xe0";sjisconv["\u88c5"]="\x91\x95";sjisconv["\u88cf"]="\x97\xa0";sjisconv["\u88d4"]="\xe5\xe1";sjisconv["\u88d5"]="\x97T";
          sjisconv["\u88d8"]="\xe5\xe2";sjisconv["\u88d9"]="\xe5\xe3";sjisconv["\u88dc"]="\x95\xe2";sjisconv["\u88dd"]="\xe5\xe4";sjisconv["\u88df"]="\x8d\xbe";sjisconv["\u88e1"]="\x97\xa1";sjisconv["\u88e8"]="\xe5\xe9";sjisconv["\u88f2"]="\xe5\xea";sjisconv["\u88f3"]="\x8f\xd6";sjisconv["\u88f4"]="\xe5\xe8";sjisconv["\u88f8"]="\x97\x87";sjisconv["\u88f9"]="\xe5\xe5";sjisconv["\u88fc"]="\xe5\xe7";sjisconv["\u88fd"]="\x90\xbb";sjisconv["\u88fe"]="\x90\x9e";sjisconv["\u8902"]="\xe5\xe6";sjisconv["\u8904"]="\xe5\xeb";
          sjisconv["\u8907"]="\x95\xa1";sjisconv["\u890a"]="\xe5\xed";sjisconv["\u890c"]="\xe5\xec";sjisconv["\u8910"]="\x8a\x8c";sjisconv["\u8912"]="\x96J";sjisconv["\u8913"]="\xe5\xee";sjisconv["\u891d"]="\xe5\xfa";sjisconv["\u891e"]="\xe5\xf0";sjisconv["\u8925"]="\xe5\xf1";sjisconv["\u892a"]="\xe5\xf2";sjisconv["\u892b"]="\xe5\xf3";sjisconv["\u8936"]="\xe5\xf7";sjisconv["\u8938"]="\xe5\xf8";sjisconv["\u893b"]="\xe5\xf6";sjisconv["\u8941"]="\xe5\xf4";sjisconv["\u8943"]="\xe5\xef";sjisconv["\u8944"]="\xe5\xf5";
          sjisconv["\u894c"]="\xe5\xf9";sjisconv["\u894d"]="\xe8\xb5";sjisconv["\u8956"]="\x89\xa6";sjisconv["\u895e"]="\xe5\xfc";sjisconv["\u895f"]="\x8b\xdd";sjisconv["\u8960"]="\xe5\xfb";sjisconv["\u8964"]="\xe6A";sjisconv["\u8966"]="\xe6@";sjisconv["\u896a"]="\xe6C";sjisconv["\u896d"]="\xe6B";sjisconv["\u896f"]="\xe6D";sjisconv["\u8972"]="\x8fP";sjisconv["\u8974"]="\xe6E";sjisconv["\u8977"]="\xe6F";sjisconv["\u897e"]="\xe6G";sjisconv["\u897f"]="\x90\xbc";sjisconv["\u8981"]="\x97v";sjisconv["\u8983"]="\xe6H";
          sjisconv["\u8986"]="\x95\xa2";sjisconv["\u8987"]="\x94e";sjisconv["\u8988"]="\xe6I";sjisconv["\u898a"]="\xe6J";sjisconv["\u898b"]="\x8c\xa9";sjisconv["\u898f"]="\x8bK";sjisconv["\u8993"]="\xe6K";sjisconv["\u8996"]="\x8e\x8b";sjisconv["\u8997"]="\x94`";sjisconv["\u8998"]="\xe6L";sjisconv["\u899a"]="\x8ao";sjisconv["\u89a1"]="\xe6M";sjisconv["\u89a6"]="\xe6O";sjisconv["\u89a7"]="\x97\x97";sjisconv["\u89a9"]="\xe6N";sjisconv["\u89aa"]="\x90e";sjisconv["\u89ac"]="\xe6P";sjisconv["\u89af"]="\xe6Q";sjisconv["\u89b2"]="\xe6R";
          sjisconv["\u89b3"]="\x8a\xcf";sjisconv["\u89ba"]="\xe6S";sjisconv["\u89bd"]="\xe6T";sjisconv["\u89bf"]="\xe6U";sjisconv["\u89c0"]="\xe6V";sjisconv["\u89d2"]="\x8ap";sjisconv["\u89da"]="\xe6W";sjisconv["\u89dc"]="\xe6X";sjisconv["\u89dd"]="\xe6Y";sjisconv["\u89e3"]="\x89\xf0";sjisconv["\u89e6"]="\x90G";sjisconv["\u89e7"]="\xe6Z";sjisconv["\u89f4"]="\xe6[";sjisconv["\u89f8"]="\xe6\\";sjisconv["\u8a00"]="\x8c\xbe";sjisconv["\u8a02"]="\x92\xf9";sjisconv["\u8a03"]="\xe6]";sjisconv["\u8a08"]="\x8cv";sjisconv["\u8a0a"]="\x90u";
          sjisconv["\u8a0c"]="\xe6`";sjisconv["\u8a0e"]="\x93\xa2";sjisconv["\u8a10"]="\xe6_";sjisconv["\u8a13"]="\x8cP";sjisconv["\u8a16"]="\xe6^";sjisconv["\u8a17"]="\x91\xf5";sjisconv["\u8a18"]="\x8bL";sjisconv["\u8a1b"]="\xe6a";sjisconv["\u8a1d"]="\xe6b";sjisconv["\u8a1f"]="\x8f\xd7";sjisconv["\u8a23"]="\x8c\x8d";sjisconv["\u8a25"]="\xe6c";sjisconv["\u8a2a"]="\x96K";sjisconv["\u8a2d"]="\x90\xdd";sjisconv["\u8a31"]="\x8b\x96";sjisconv["\u8a33"]="\x96\xf3";sjisconv["\u8a34"]="\x91i";sjisconv["\u8a36"]="\xe6d";
          sjisconv["\u8a3a"]="\x90f";sjisconv["\u8a3b"]="\x92\x90";sjisconv["\u8a3c"]="\x8f\xd8";sjisconv["\u8a41"]="\xe6e";sjisconv["\u8a46"]="\xe6h";sjisconv["\u8a48"]="\xe6i";sjisconv["\u8a50"]="\x8d\xbc";sjisconv["\u8a51"]="\x91\xc0";sjisconv["\u8a52"]="\xe6g";sjisconv["\u8a54"]="\x8f\xd9";sjisconv["\u8a55"]="\x95]";sjisconv["\u8a5b"]="\xe6f";sjisconv["\u8a5e"]="\x8e\x8c";sjisconv["\u8a60"]="\x89r";sjisconv["\u8a62"]="\xe6m";sjisconv["\u8a63"]="\x8cw";sjisconv["\u8a66"]="\x8e\x8e";sjisconv["\u8a69"]="\x8e\x8d";
          sjisconv["\u8a6b"]="\x98l";sjisconv["\u8a6c"]="\xe6l";sjisconv["\u8a6d"]="\xe6k";sjisconv["\u8a6e"]="\x91F";sjisconv["\u8a70"]="\x8bl";sjisconv["\u8a71"]="\x98b";sjisconv["\u8a72"]="\x8aY";sjisconv["\u8a73"]="\x8f\xda";sjisconv["\u8a7c"]="\xe6j";sjisconv["\u8a82"]="\xe6o";sjisconv["\u8a84"]="\xe6p";sjisconv["\u8a85"]="\xe6n";sjisconv["\u8a87"]="\x8c\xd6";sjisconv["\u8a89"]="\x97_";sjisconv["\u8a8c"]="\x8e\x8f";sjisconv["\u8a8d"]="\x94F";sjisconv["\u8a91"]="\xe6s";sjisconv["\u8a93"]="\x90\xbe";sjisconv["\u8a95"]="\x92a";
          sjisconv["\u8a98"]="\x97U";sjisconv["\u8a9a"]="\xe6v";sjisconv["\u8a9e"]="\x8c\xea";sjisconv["\u8aa0"]="\x90\xbd";sjisconv["\u8aa1"]="\xe6r";sjisconv["\u8aa3"]="\xe6w";sjisconv["\u8aa4"]="\x8c\xeb";sjisconv["\u8aa5"]="\xe6t";sjisconv["\u8aa6"]="\xe6u";sjisconv["\u8aa8"]="\xe6q";sjisconv["\u8aac"]="\x90\xe0";sjisconv["\u8aad"]="\x93\xc7";sjisconv["\u8ab0"]="\x92N";sjisconv["\u8ab2"]="\x89\xdb";sjisconv["\u8ab9"]="\x94\xee";sjisconv["\u8abc"]="\x8bb";sjisconv["\u8abf"]="\x92\xb2";sjisconv["\u8ac2"]="\xe6z";
          sjisconv["\u8ac4"]="\xe6x";sjisconv["\u8ac7"]="\x92k";sjisconv["\u8acb"]="\x90\xbf";sjisconv["\u8acc"]="\x8a\xd0";sjisconv["\u8acd"]="\xe6y";sjisconv["\u8acf"]="\x90z";sjisconv["\u8ad2"]="\x97\xc8";sjisconv["\u8ad6"]="\x98_";sjisconv["\u8ada"]="\xe6{";sjisconv["\u8adb"]="\xe6\x87";sjisconv["\u8adc"]="\x92\xb3";sjisconv["\u8ade"]="\xe6\x86";sjisconv["\u8ae0"]="\xe6\x83";sjisconv["\u8ae1"]="\xe6\x8b";sjisconv["\u8ae2"]="\xe6\x84";sjisconv["\u8ae4"]="\xe6\x80";sjisconv["\u8ae6"]="\x92\xfa";sjisconv["\u8ae7"]="\xe6~";
          sjisconv["\u8aeb"]="\xe6|";sjisconv["\u8aed"]="\x97@";sjisconv["\u8aee"]="\x8e\x90";sjisconv["\u8af1"]="\xe6\x81";sjisconv["\u8af3"]="\xe6}";sjisconv["\u8af7"]="\xe6\x85";sjisconv["\u8af8"]="\x8f\x94";sjisconv["\u8afa"]="\x8c\xbf";sjisconv["\u8afe"]="\x91\xf8";sjisconv["\u8b00"]="\x96d";sjisconv["\u8b01"]="\x89y";sjisconv["\u8b02"]="\x88\xe0";sjisconv["\u8b04"]="\x93\xa3";sjisconv["\u8b07"]="\xe6\x89";sjisconv["\u8b0c"]="\xe6\x88";sjisconv["\u8b0e"]="\x93\xe4";sjisconv["\u8b10"]="\xe6\x8d";sjisconv["\u8b14"]="\xe6\x82";
          sjisconv["\u8b16"]="\xe6\x8c";sjisconv["\u8b17"]="\xe6\x8e";sjisconv["\u8b19"]="\x8c\xaa";sjisconv["\u8b1a"]="\xe6\x8a";sjisconv["\u8b1b"]="\x8du";sjisconv["\u8b1d"]="\x8e\xd3";sjisconv["\u8b20"]="\xe6\x8f";sjisconv["\u8b21"]="\x97w";sjisconv["\u8b26"]="\xe6\x92";sjisconv["\u8b28"]="\xe6\x95";sjisconv["\u8b2b"]="\xe6\x93";sjisconv["\u8b2c"]="\x95T";sjisconv["\u8b33"]="\xe6\x90";sjisconv["\u8b39"]="\x8b\xde";sjisconv["\u8b3e"]="\xe6\x94";sjisconv["\u8b41"]="\xe6\x96";sjisconv["\u8b49"]="\xe6\x9a";
          sjisconv["\u8b4c"]="\xe6\x97";sjisconv["\u8b4e"]="\xe6\x99";sjisconv["\u8b4f"]="\xe6\x98";sjisconv["\u8b56"]="\xe6\x9b";sjisconv["\u8b58"]="\x8e\xaf";sjisconv["\u8b5a"]="\xe6\x9d";sjisconv["\u8b5b"]="\xe6\x9c";sjisconv["\u8b5c"]="\x95\x88";sjisconv["\u8b5f"]="\xe6\x9f";sjisconv["\u8b66"]="\x8cx";sjisconv["\u8b6b"]="\xe6\x9e";sjisconv["\u8b6c"]="\xe6\xa0";sjisconv["\u8b6f"]="\xe6\xa1";sjisconv["\u8b70"]="\x8bc";sjisconv["\u8b71"]="\xe3\xbf";sjisconv["\u8b72"]="\x8f\xf7";sjisconv["\u8b74"]="\xe6\xa2";
          sjisconv["\u8b77"]="\x8c\xec";sjisconv["\u8b7d"]="\xe6\xa3";sjisconv["\u8b80"]="\xe6\xa4";sjisconv["\u8b83"]="\x8e]";sjisconv["\u8b8a"]="\x9d\xcc";sjisconv["\u8b8c"]="\xe6\xa5";sjisconv["\u8b8e"]="\xe6\xa6";sjisconv["\u8b90"]="\x8fQ";sjisconv["\u8b92"]="\xe6\xa7";sjisconv["\u8b93"]="\xe6\xa8";sjisconv["\u8b96"]="\xe6\xa9";sjisconv["\u8b99"]="\xe6\xaa";sjisconv["\u8b9a"]="\xe6\xab";sjisconv["\u8c37"]="\x92J";sjisconv["\u8c3a"]="\xe6\xac";sjisconv["\u8c3f"]="\xe6\xae";sjisconv["\u8c41"]="\xe6\xad";
          sjisconv["\u8c46"]="\x93\xa4";sjisconv["\u8c48"]="\xe6\xaf";sjisconv["\u8c4a"]="\x96L";sjisconv["\u8c4c"]="\xe6\xb0";sjisconv["\u8c4e"]="\xe6\xb1";sjisconv["\u8c50"]="\xe6\xb2";sjisconv["\u8c55"]="\xe6\xb3";sjisconv["\u8c5a"]="\x93\xd8";sjisconv["\u8c61"]="\x8f\xdb";sjisconv["\u8c62"]="\xe6\xb4";sjisconv["\u8c6a"]="\x8d\x8b";sjisconv["\u8c6b"]="\x98\xac";sjisconv["\u8c6c"]="\xe6\xb5";sjisconv["\u8c78"]="\xe6\xb6";sjisconv["\u8c79"]="\x95^";sjisconv["\u8c7a"]="\xe6\xb7";sjisconv["\u8c7c"]="\xe6\xbf";
          sjisconv["\u8c82"]="\xe6\xb8";sjisconv["\u8c85"]="\xe6\xba";sjisconv["\u8c89"]="\xe6\xb9";sjisconv["\u8c8a"]="\xe6\xbb";sjisconv["\u8c8c"]="\x96e";sjisconv["\u8c8d"]="\xe6\xbc";sjisconv["\u8c8e"]="\xe6\xbd";sjisconv["\u8c94"]="\xe6\xbe";sjisconv["\u8c98"]="\xe6\xc0";sjisconv["\u8c9d"]="\x8aL";sjisconv["\u8c9e"]="\x92\xe5";sjisconv["\u8ca0"]="\x95\x89";sjisconv["\u8ca1"]="\x8d\xe0";sjisconv["\u8ca2"]="\x8dv";sjisconv["\u8ca7"]="\x95n";sjisconv["\u8ca8"]="\x89\xdd";sjisconv["\u8ca9"]="\x94\xcc";sjisconv["\u8caa"]="\xe6\xc3";
          sjisconv["\u8cab"]="\x8a\xd1";sjisconv["\u8cac"]="\x90\xd3";sjisconv["\u8cad"]="\xe6\xc2";sjisconv["\u8cae"]="\xe6\xc7";sjisconv["\u8caf"]="\x92\x99";sjisconv["\u8cb0"]="\x96\xe1";sjisconv["\u8cb2"]="\xe6\xc5";sjisconv["\u8cb3"]="\xe6\xc6";sjisconv["\u8cb4"]="\x8bM";sjisconv["\u8cb6"]="\xe6\xc8";sjisconv["\u8cb7"]="\x94\x83";sjisconv["\u8cb8"]="\x91\xdd";sjisconv["\u8cbb"]="\x94\xef";sjisconv["\u8cbc"]="\x93\\";sjisconv["\u8cbd"]="\xe6\xc4";sjisconv["\u8cbf"]="\x96f";sjisconv["\u8cc0"]="\x89\xea";
          sjisconv["\u8cc1"]="\xe6\xca";sjisconv["\u8cc2"]="\x98G";sjisconv["\u8cc3"]="\x92\xc0";sjisconv["\u8cc4"]="\x98d";sjisconv["\u8cc7"]="\x8e\x91";sjisconv["\u8cc8"]="\xe6\xc9";sjisconv["\u8cca"]="\x91\xaf";sjisconv["\u8ccd"]="\xe6\xda";sjisconv["\u8cce"]="\x91G";sjisconv["\u8cd1"]="\x93\xf6";sjisconv["\u8cd3"]="\x95o";sjisconv["\u8cda"]="\xe6\xcd";sjisconv["\u8cdb"]="\x8e^";sjisconv["\u8cdc"]="\x8e\x92";sjisconv["\u8cde"]="\x8f\xdc";sjisconv["\u8ce0"]="\x94\x85";sjisconv["\u8ce2"]="\x8c\xab";sjisconv["\u8ce3"]="\xe6\xcc";
          sjisconv["\u8ce4"]="\xe6\xcb";sjisconv["\u8ce6"]="\x95\x8a";sjisconv["\u8cea"]="\x8e\xbf";sjisconv["\u8ced"]="\x93q";sjisconv["\u8cfa"]="\xe6\xcf";sjisconv["\u8cfb"]="\xe6\xd0";sjisconv["\u8cfc"]="\x8dw";sjisconv["\u8cfd"]="\xe6\xce";sjisconv["\u8d04"]="\xe6\xd1";sjisconv["\u8d05"]="\xe6\xd2";sjisconv["\u8d07"]="\xe6\xd4";sjisconv["\u8d08"]="\x91\xa1";sjisconv["\u8d0a"]="\xe6\xd3";sjisconv["\u8d0b"]="\x8a\xe4";sjisconv["\u8d0d"]="\xe6\xd6";sjisconv["\u8d0f"]="\xe6\xd5";sjisconv["\u8d10"]="\xe6\xd7";
          sjisconv["\u8d13"]="\xe6\xd9";sjisconv["\u8d14"]="\xe6\xdb";sjisconv["\u8d16"]="\xe6\xdc";sjisconv["\u8d64"]="\x90\xd4";sjisconv["\u8d66"]="\x8e\xcd";sjisconv["\u8d67"]="\xe6\xdd";sjisconv["\u8d6b"]="\x8aq";sjisconv["\u8d6d"]="\xe6\xde";sjisconv["\u8d70"]="\x91\x96";sjisconv["\u8d71"]="\xe6\xdf";sjisconv["\u8d73"]="\xe6\xe0";sjisconv["\u8d74"]="\x95\x8b";sjisconv["\u8d77"]="\x8bN";sjisconv["\u8d81"]="\xe6\xe1";sjisconv["\u8d85"]="\x92\xb4";sjisconv["\u8d8a"]="\x89z";sjisconv["\u8d99"]="\xe6\xe2";
          sjisconv["\u8da3"]="\x8e\xef";sjisconv["\u8da8"]="\x90\x96";sjisconv["\u8db3"]="\x91\xab";sjisconv["\u8dba"]="\xe6\xe5";sjisconv["\u8dbe"]="\xe6\xe4";sjisconv["\u8dc2"]="\xe6\xe3";sjisconv["\u8dcb"]="\xe6\xeb";sjisconv["\u8dcc"]="\xe6\xe9";sjisconv["\u8dcf"]="\xe6\xe6";sjisconv["\u8dd6"]="\xe6\xe8";sjisconv["\u8dda"]="\xe6\xe7";sjisconv["\u8ddb"]="\xe6\xea";sjisconv["\u8ddd"]="\x8b\x97";sjisconv["\u8ddf"]="\xe6\xee";sjisconv["\u8de1"]="\x90\xd5";sjisconv["\u8de3"]="\xe6\xef";sjisconv["\u8de8"]="\x8c\xd7";
          sjisconv["\u8dea"]="\xe6\xec";sjisconv["\u8deb"]="\xe6\xed";sjisconv["\u8def"]="\x98H";sjisconv["\u8df3"]="\x92\xb5";sjisconv["\u8df5"]="\x91H";sjisconv["\u8dfc"]="\xe6\xf0";sjisconv["\u8dff"]="\xe6\xf3";sjisconv["\u8e08"]="\xe6\xf1";sjisconv["\u8e09"]="\xe6\xf2";sjisconv["\u8e0a"]="\x97x";sjisconv["\u8e0f"]="\x93\xa5";sjisconv["\u8e10"]="\xe6\xf6";sjisconv["\u8e1d"]="\xe6\xf4";sjisconv["\u8e1e"]="\xe6\xf5";sjisconv["\u8e1f"]="\xe6\xf7";sjisconv["\u8e2a"]="\xe7H";sjisconv["\u8e30"]="\xe6\xfa";sjisconv["\u8e34"]="\xe6\xfb";
          sjisconv["\u8e35"]="\xe6\xf9";sjisconv["\u8e42"]="\xe6\xf8";sjisconv["\u8e44"]="\x92\xfb";sjisconv["\u8e47"]="\xe7@";sjisconv["\u8e48"]="\xe7D";sjisconv["\u8e49"]="\xe7A";sjisconv["\u8e4a"]="\xe6\xfc";sjisconv["\u8e4c"]="\xe7B";sjisconv["\u8e50"]="\xe7C";sjisconv["\u8e55"]="\xe7J";sjisconv["\u8e59"]="\xe7E";sjisconv["\u8e5f"]="\x90\xd6";sjisconv["\u8e60"]="\xe7G";sjisconv["\u8e63"]="\xe7I";sjisconv["\u8e64"]="\xe7F";sjisconv["\u8e72"]="\xe7L";sjisconv["\u8e74"]="\x8fR";sjisconv["\u8e76"]="\xe7K";
          sjisconv["\u8e7c"]="\xe7M";sjisconv["\u8e81"]="\xe7N";sjisconv["\u8e84"]="\xe7Q";sjisconv["\u8e85"]="\xe7P";sjisconv["\u8e87"]="\xe7O";sjisconv["\u8e8a"]="\xe7S";sjisconv["\u8e8b"]="\xe7R";sjisconv["\u8e8d"]="\x96\xf4";sjisconv["\u8e91"]="\xe7U";sjisconv["\u8e93"]="\xe7T";sjisconv["\u8e94"]="\xe7V";sjisconv["\u8e99"]="\xe7W";sjisconv["\u8ea1"]="\xe7Y";sjisconv["\u8eaa"]="\xe7X";sjisconv["\u8eab"]="\x90g";sjisconv["\u8eac"]="\xe7Z";sjisconv["\u8eaf"]="\x8b\xeb";sjisconv["\u8eb0"]="\xe7[";sjisconv["\u8eb1"]="\xe7]";
          sjisconv["\u8ebe"]="\xe7^";sjisconv["\u8ec5"]="\xe7_";sjisconv["\u8ec6"]="\xe7\\";sjisconv["\u8ec8"]="\xe7`";sjisconv["\u8eca"]="\x8e\xd4";sjisconv["\u8ecb"]="\xe7a";sjisconv["\u8ecc"]="\x8bO";sjisconv["\u8ecd"]="\x8cR";sjisconv["\u8ed2"]="\x8c\xac";sjisconv["\u8edb"]="\xe7b";sjisconv["\u8edf"]="\x93\xee";sjisconv["\u8ee2"]="\x93]";sjisconv["\u8ee3"]="\xe7c";sjisconv["\u8eeb"]="\xe7f";sjisconv["\u8ef8"]="\x8e\xb2";sjisconv["\u8efb"]="\xe7e";sjisconv["\u8efc"]="\xe7d";sjisconv["\u8efd"]="\x8cy";sjisconv["\u8efe"]="\xe7g";
          sjisconv["\u8f03"]="\x8ar";sjisconv["\u8f05"]="\xe7i";sjisconv["\u8f09"]="\x8d\xda";sjisconv["\u8f0a"]="\xe7h";sjisconv["\u8f0c"]="\xe7q";sjisconv["\u8f12"]="\xe7k";sjisconv["\u8f13"]="\xe7m";sjisconv["\u8f14"]="\x95\xe3";sjisconv["\u8f15"]="\xe7j";sjisconv["\u8f19"]="\xe7l";sjisconv["\u8f1b"]="\xe7p";sjisconv["\u8f1c"]="\xe7n";sjisconv["\u8f1d"]="\x8bP";sjisconv["\u8f1f"]="\xe7o";sjisconv["\u8f26"]="\xe7r";sjisconv["\u8f29"]="\x94y";sjisconv["\u8f2a"]="\x97\xd6";sjisconv["\u8f2f"]="\x8fS";sjisconv["\u8f33"]="\xe7s";
          sjisconv["\u8f38"]="\x97A";sjisconv["\u8f39"]="\xe7u";sjisconv["\u8f3b"]="\xe7t";sjisconv["\u8f3e"]="\xe7x";sjisconv["\u8f3f"]="\x97`";sjisconv["\u8f42"]="\xe7w";sjisconv["\u8f44"]="\x8a\x8d";sjisconv["\u8f45"]="\xe7v";sjisconv["\u8f46"]="\xe7{";sjisconv["\u8f49"]="\xe7z";sjisconv["\u8f4c"]="\xe7y";sjisconv["\u8f4d"]="\x93Q";sjisconv["\u8f4e"]="\xe7|";sjisconv["\u8f57"]="\xe7}";sjisconv["\u8f5c"]="\xe7~";sjisconv["\u8f5f"]="\x8d\x8c";sjisconv["\u8f61"]="\x8cD";sjisconv["\u8f62"]="\xe7\x80";sjisconv["\u8f63"]="\xe7\x81";
          sjisconv["\u8f64"]="\xe7\x82";sjisconv["\u8f9b"]="\x90h";sjisconv["\u8f9c"]="\xe7\x83";sjisconv["\u8f9e"]="\x8e\xab";sjisconv["\u8f9f"]="\xe7\x84";sjisconv["\u8fa3"]="\xe7\x85";sjisconv["\u8fa7"]="\x99\x9f";sjisconv["\u8fa8"]="\x99\x9e";sjisconv["\u8fad"]="\xe7\x86";sjisconv["\u8fae"]="\xe3\x90";sjisconv["\u8faf"]="\xe7\x87";sjisconv["\u8fb0"]="\x92C";sjisconv["\u8fb1"]="\x90J";sjisconv["\u8fb2"]="\x94_";sjisconv["\u8fb7"]="\xe7\x88";sjisconv["\u8fba"]="\x95\xd3";sjisconv["\u8fbb"]="\x92\xd2";sjisconv["\u8fbc"]="\x8d\x9e";
          sjisconv["\u8fbf"]="\x92H";sjisconv["\u8fc2"]="\x89I";sjisconv["\u8fc4"]="\x96\x98";sjisconv["\u8fc5"]="\x90v";sjisconv["\u8fce"]="\x8c}";sjisconv["\u8fd1"]="\x8b\xdf";sjisconv["\u8fd4"]="\x95\xd4";sjisconv["\u8fda"]="\xe7\x89";sjisconv["\u8fe2"]="\xe7\x8b";sjisconv["\u8fe5"]="\xe7\x8a";sjisconv["\u8fe6"]="\x89\xde";sjisconv["\u8fe9"]="\x93\xf4";sjisconv["\u8fea"]="\xe7\x8c";sjisconv["\u8feb"]="\x94\x97";sjisconv["\u8fed"]="\x93R";sjisconv["\u8fef"]="\xe7\x8d";sjisconv["\u8ff0"]="\x8fq";sjisconv["\u8ff4"]="\xe7\x8f";
          sjisconv["\u8ff7"]="\x96\xc0";sjisconv["\u8ff8"]="\xe7\x9e";sjisconv["\u8ff9"]="\xe7\x91";sjisconv["\u8ffa"]="\xe7\x92";sjisconv["\u8ffd"]="\x92\xc7";sjisconv["\u9000"]="\x91\xde";sjisconv["\u9001"]="\x91\x97";sjisconv["\u9003"]="\x93\xa6";sjisconv["\u9005"]="\xe7\x90";sjisconv["\u9006"]="\x8bt";sjisconv["\u900b"]="\xe7\x99";sjisconv["\u900d"]="\xe7\x96";sjisconv["\u900e"]="\xe7\xa3";sjisconv["\u900f"]="\x93\xa7";sjisconv["\u9010"]="\x92\x80";sjisconv["\u9011"]="\xe7\x93";sjisconv["\u9013"]="\x92\xfc";
          sjisconv["\u9014"]="\x93r";sjisconv["\u9015"]="\xe7\x94";sjisconv["\u9016"]="\xe7\x98";sjisconv["\u9017"]="\x90\x80";sjisconv["\u9019"]="\x94\x87";sjisconv["\u901a"]="\x92\xca";sjisconv["\u901d"]="\x90\xc0";sjisconv["\u901e"]="\xe7\x97";sjisconv["\u901f"]="\x91\xac";sjisconv["\u9020"]="\x91\xa2";sjisconv["\u9021"]="\xe7\x95";sjisconv["\u9022"]="\x88\xa7";sjisconv["\u9023"]="\x98A";sjisconv["\u9027"]="\xe7\x9a";sjisconv["\u902e"]="\x91\xdf";sjisconv["\u9031"]="\x8fT";sjisconv["\u9032"]="\x90i";sjisconv["\u9035"]="\xe7\x9c";
          sjisconv["\u9036"]="\xe7\x9b";sjisconv["\u9038"]="\x88\xed";sjisconv["\u9039"]="\xe7\x9d";sjisconv["\u903c"]="\x95N";sjisconv["\u903e"]="\xe7\xa5";sjisconv["\u9041"]="\x93\xd9";sjisconv["\u9042"]="\x90\x8b";sjisconv["\u9045"]="\x92x";sjisconv["\u9047"]="\x8b\xf6";sjisconv["\u9049"]="\xe7\xa4";sjisconv["\u904a"]="\x97V";sjisconv["\u904b"]="\x89^";sjisconv["\u904d"]="\x95\xd5";sjisconv["\u904e"]="\x89\xdf";sjisconv["\u904f"]="\xe7\x9f";sjisconv["\u9050"]="\xe7\xa0";sjisconv["\u9051"]="\xe7\xa1";sjisconv["\u9052"]="\xe7\xa2";
          sjisconv["\u9053"]="\x93\xb9";sjisconv["\u9054"]="\x92B";sjisconv["\u9055"]="\x88\xe1";sjisconv["\u9056"]="\xe7\xa6";sjisconv["\u9058"]="\xe7\xa7";sjisconv["\u9059"]="\xea\xa1";sjisconv["\u905c"]="\x91\xbb";sjisconv["\u905e"]="\xe7\xa8";sjisconv["\u9060"]="\x89\x93";sjisconv["\u9061"]="\x91k";sjisconv["\u9063"]="\x8c\xad";sjisconv["\u9065"]="\x97y";sjisconv["\u9068"]="\xe7\xa9";sjisconv["\u9069"]="\x93K";sjisconv["\u906d"]="\x91\x98";sjisconv["\u906e"]="\x8e\xd5";sjisconv["\u906f"]="\xe7\xaa";sjisconv["\u9072"]="\xe7\xad";
          sjisconv["\u9075"]="\x8f\x85";sjisconv["\u9076"]="\xe7\xab";sjisconv["\u9077"]="\x91J";sjisconv["\u9078"]="\x91I";sjisconv["\u907a"]="\x88\xe2";sjisconv["\u907c"]="\x97\xc9";sjisconv["\u907d"]="\xe7\xaf";sjisconv["\u907f"]="\x94\xf0";sjisconv["\u9080"]="\xe7\xb1";sjisconv["\u9081"]="\xe7\xb0";sjisconv["\u9082"]="\xe7\xae";sjisconv["\u9083"]="\xe2\x84";sjisconv["\u9084"]="\x8a\xd2";sjisconv["\u9087"]="\xe7\x8e";sjisconv["\u9089"]="\xe7\xb3";sjisconv["\u908a"]="\xe7\xb2";sjisconv["\u908f"]="\xe7\xb4";
          sjisconv["\u9091"]="\x97W";sjisconv["\u90a3"]="\x93\xdf";sjisconv["\u90a6"]="\x96M";sjisconv["\u90a8"]="\xe7\xb5";sjisconv["\u90aa"]="\x8e\xd7";sjisconv["\u90af"]="\xe7\xb6";sjisconv["\u90b1"]="\xe7\xb7";sjisconv["\u90b5"]="\xe7\xb8";sjisconv["\u90b8"]="\x93@";sjisconv["\u90c1"]="\x88\xe8";sjisconv["\u90ca"]="\x8dx";sjisconv["\u90ce"]="\x98Y";sjisconv["\u90db"]="\xe7\xbc";sjisconv["\u90e1"]="\x8cS";sjisconv["\u90e2"]="\xe7\xb9";sjisconv["\u90e4"]="\xe7\xba";sjisconv["\u90e8"]="\x95\x94";sjisconv["\u90ed"]="\x8as";
          sjisconv["\u90f5"]="\x97X";sjisconv["\u90f7"]="\x8b\xbd";sjisconv["\u90fd"]="\x93s";sjisconv["\u9102"]="\xe7\xbd";sjisconv["\u9112"]="\xe7\xbe";sjisconv["\u9119"]="\xe7\xbf";sjisconv["\u912d"]="\x93A";sjisconv["\u9130"]="\xe7\xc1";sjisconv["\u9132"]="\xe7\xc0";sjisconv["\u9149"]="\x93\xd1";sjisconv["\u914a"]="\xe7\xc2";sjisconv["\u914b"]="\x8fU";sjisconv["\u914c"]="\x8e\xde";sjisconv["\u914d"]="\x94z";sjisconv["\u914e"]="\x92\x91";sjisconv["\u9152"]="\x8e\xf0";sjisconv["\u9154"]="\x90\x8c";sjisconv["\u9156"]="\xe7\xc3";
          sjisconv["\u9158"]="\xe7\xc4";sjisconv["\u9162"]="\x90|";sjisconv["\u9163"]="\xe7\xc5";sjisconv["\u9165"]="\xe7\xc6";sjisconv["\u9169"]="\xe7\xc7";sjisconv["\u916a"]="\x97\x8f";sjisconv["\u916c"]="\x8fV";sjisconv["\u9172"]="\xe7\xc9";sjisconv["\u9173"]="\xe7\xc8";sjisconv["\u9175"]="\x8dy";sjisconv["\u9177"]="\x8d\x93";sjisconv["\u9178"]="\x8e_";sjisconv["\u9182"]="\xe7\xcc";sjisconv["\u9187"]="\x8f\x86";sjisconv["\u9189"]="\xe7\xcb";sjisconv["\u918b"]="\xe7\xca";sjisconv["\u918d"]="\x91\xe7";sjisconv["\u9190"]="\x8c\xed";
          sjisconv["\u9192"]="\x90\xc1";sjisconv["\u9197"]="\x94\xae";sjisconv["\u919c"]="\x8fX";sjisconv["\u91a2"]="\xe7\xcd";sjisconv["\u91a4"]="\x8f\xdd";sjisconv["\u91aa"]="\xe7\xd0";sjisconv["\u91ab"]="\xe7\xce";sjisconv["\u91af"]="\xe7\xcf";sjisconv["\u91b4"]="\xe7\xd2";sjisconv["\u91b5"]="\xe7\xd1";sjisconv["\u91b8"]="\x8f\xf8";sjisconv["\u91ba"]="\xe7\xd3";sjisconv["\u91c0"]="\xe7\xd4";sjisconv["\u91c1"]="\xe7\xd5";sjisconv["\u91c6"]="\x94\xce";sjisconv["\u91c7"]="\x8d\xd1";sjisconv["\u91c8"]="\x8e\xdf";
          sjisconv["\u91c9"]="\xe7\xd6";sjisconv["\u91cb"]="\xe7\xd7";sjisconv["\u91cc"]="\x97\xa2";sjisconv["\u91cd"]="\x8fd";sjisconv["\u91ce"]="\x96\xec";sjisconv["\u91cf"]="\x97\xca";sjisconv["\u91d0"]="\xe7\xd8";sjisconv["\u91d1"]="\x8b\xe0";sjisconv["\u91d6"]="\xe7\xd9";sjisconv["\u91d8"]="\x93B";sjisconv["\u91db"]="\xe7\xdc";sjisconv["\u91dc"]="\x8a\x98";sjisconv["\u91dd"]="\x90j";sjisconv["\u91df"]="\xe7\xda";sjisconv["\u91e1"]="\xe7\xdb";sjisconv["\u91e3"]="\x92\xde";sjisconv["\u91e6"]="\x96t";sjisconv["\u91e7"]="\x8b\xfa";
          sjisconv["\u91f5"]="\xe7\xde";sjisconv["\u91f6"]="\xe7\xdf";sjisconv["\u91fc"]="\xe7\xdd";sjisconv["\u91ff"]="\xe7\xe1";sjisconv["\u920d"]="\x93\xdd";sjisconv["\u920e"]="\x8ab";sjisconv["\u9211"]="\xe7\xe5";sjisconv["\u9214"]="\xe7\xe2";sjisconv["\u9215"]="\xe7\xe4";sjisconv["\u921e"]="\xe7\xe0";sjisconv["\u9229"]="\xe8n";sjisconv["\u922c"]="\xe7\xe3";sjisconv["\u9234"]="\x97\xe9";sjisconv["\u9237"]="\x8c\xd8";sjisconv["\u923f"]="\xe7\xed";sjisconv["\u9244"]="\x93S";sjisconv["\u9245"]="\xe7\xe8";
          sjisconv["\u9248"]="\xe7\xeb";sjisconv["\u9249"]="\xe7\xe9";sjisconv["\u924b"]="\xe7\xee";sjisconv["\u9250"]="\xe7\xef";sjisconv["\u9257"]="\xe7\xe7";sjisconv["\u925a"]="\xe7\xf4";sjisconv["\u925b"]="\x89\x94";sjisconv["\u925e"]="\xe7\xe6";sjisconv["\u9262"]="\x94\xab";sjisconv["\u9264"]="\xe7\xea";sjisconv["\u9266"]="\x8f\xde";sjisconv["\u9271"]="\x8dz";sjisconv["\u927e"]="\x96g";sjisconv["\u9280"]="\x8b\xe2";sjisconv["\u9283"]="\x8fe";sjisconv["\u9285"]="\x93\xba";sjisconv["\u9291"]="\x91L";sjisconv["\u9293"]="\xe7\xf2";
          sjisconv["\u9295"]="\xe7\xec";sjisconv["\u9296"]="\xe7\xf1";sjisconv["\u9298"]="\x96\xc1";sjisconv["\u929a"]="\x92\xb6";sjisconv["\u929b"]="\xe7\xf3";sjisconv["\u929c"]="\xe7\xf0";sjisconv["\u92ad"]="\x91K";sjisconv["\u92b7"]="\xe7\xf7";sjisconv["\u92b9"]="\xe7\xf6";sjisconv["\u92cf"]="\xe7\xf5";sjisconv["\u92d2"]="\x96N";sjisconv["\u92e4"]="\x8f\x9b";sjisconv["\u92e9"]="\xe7\xf8";sjisconv["\u92ea"]="\x95\xdd";sjisconv["\u92ed"]="\x89s";sjisconv["\u92f2"]="\x95e";sjisconv["\u92f3"]="\x92\x92";sjisconv["\u92f8"]="\x8b\x98";
          sjisconv["\u92fa"]="\xe7\xfa";sjisconv["\u92fc"]="\x8d|";sjisconv["\u9306"]="\x8eK";sjisconv["\u930f"]="\xe7\xf9";sjisconv["\u9310"]="\x90\x8d";sjisconv["\u9318"]="\x90\x8e";sjisconv["\u9319"]="\xe8@";sjisconv["\u931a"]="\xe8B";sjisconv["\u9320"]="\x8f\xf9";sjisconv["\u9322"]="\xe8A";sjisconv["\u9323"]="\xe8C";sjisconv["\u9326"]="\x8b\xd1";sjisconv["\u9328"]="\x95d";sjisconv["\u932b"]="\x8e\xe0";sjisconv["\u932c"]="\x98B";sjisconv["\u932e"]="\xe7\xfc";sjisconv["\u932f"]="\x8d\xf6";sjisconv["\u9332"]="\x98^";
          sjisconv["\u9335"]="\xe8E";sjisconv["\u933a"]="\xe8D";sjisconv["\u933b"]="\xe8F";sjisconv["\u9344"]="\xe7\xfb";sjisconv["\u934b"]="\x93\xe7";sjisconv["\u934d"]="\x93t";sjisconv["\u9354"]="\x92\xd5";sjisconv["\u9356"]="\xe8K";sjisconv["\u935b"]="\x92b";sjisconv["\u935c"]="\xe8G";sjisconv["\u9360"]="\xe8H";sjisconv["\u936c"]="\x8cL";sjisconv["\u936e"]="\xe8J";sjisconv["\u9375"]="\x8c\xae";sjisconv["\u937c"]="\xe8I";sjisconv["\u937e"]="\x8f\xdf";sjisconv["\u938c"]="\x8a\x99";sjisconv["\u9394"]="\xe8O";
          sjisconv["\u9396"]="\x8d\xbd";sjisconv["\u9397"]="\x91\x99";sjisconv["\u939a"]="\x92\xc8";sjisconv["\u93a7"]="\x8aZ";sjisconv["\u93ac"]="\xe8M";sjisconv["\u93ad"]="\xe8N";sjisconv["\u93ae"]="\x92\xc1";sjisconv["\u93b0"]="\xe8L";sjisconv["\u93b9"]="\xe8P";sjisconv["\u93c3"]="\xe8V";sjisconv["\u93c8"]="\xe8Y";sjisconv["\u93d0"]="\xe8X";sjisconv["\u93d1"]="\x93L";sjisconv["\u93d6"]="\xe8Q";sjisconv["\u93d7"]="\xe8R";sjisconv["\u93d8"]="\xe8U";sjisconv["\u93dd"]="\xe8W";sjisconv["\u93e1"]="\x8b\xbe";
          sjisconv["\u93e4"]="\xe8Z";sjisconv["\u93e5"]="\xe8T";sjisconv["\u93e8"]="\xe8S";sjisconv["\u9403"]="\xe8^";sjisconv["\u9407"]="\xe8_";sjisconv["\u9410"]="\xe8`";sjisconv["\u9413"]="\xe8]";sjisconv["\u9414"]="\xe8\\";sjisconv["\u9418"]="\x8f\xe0";sjisconv["\u9419"]="\x93\xa8";sjisconv["\u941a"]="\xe8[";sjisconv["\u9421"]="\xe8d";sjisconv["\u942b"]="\xe8b";sjisconv["\u9435"]="\xe8c";sjisconv["\u9436"]="\xe8a";sjisconv["\u9438"]="\x91\xf6";sjisconv["\u943a"]="\xe8e";sjisconv["\u9441"]="\xe8f";sjisconv["\u9444"]="\xe8h";
          sjisconv["\u9451"]="\x8a\xd3";sjisconv["\u9452"]="\xe8g";sjisconv["\u9453"]="\x96\xf8";sjisconv["\u945a"]="\xe8s";sjisconv["\u945b"]="\xe8i";sjisconv["\u945e"]="\xe8l";sjisconv["\u9460"]="\xe8j";sjisconv["\u9462"]="\xe8k";sjisconv["\u946a"]="\xe8m";sjisconv["\u9470"]="\xe8o";sjisconv["\u9475"]="\xe8p";sjisconv["\u9477"]="\xe8q";sjisconv["\u947c"]="\xe8t";sjisconv["\u947d"]="\xe8r";sjisconv["\u947e"]="\xe8u";sjisconv["\u947f"]="\xe8w";sjisconv["\u9481"]="\xe8v";sjisconv["\u9577"]="\x92\xb7";sjisconv["\u9580"]="\x96\xe5";
          sjisconv["\u9582"]="\xe8x";sjisconv["\u9583"]="\x91M";sjisconv["\u9587"]="\xe8y";sjisconv["\u9589"]="\x95\xc2";sjisconv["\u958a"]="\xe8z";sjisconv["\u958b"]="\x8aJ";sjisconv["\u958f"]="\x89[";sjisconv["\u9591"]="\x8a\xd5";sjisconv["\u9593"]="\x8a\xd4";sjisconv["\u9594"]="\xe8{";sjisconv["\u9596"]="\xe8|";sjisconv["\u9598"]="\xe8}";sjisconv["\u9599"]="\xe8~";sjisconv["\u95a0"]="\xe8\x80";sjisconv["\u95a2"]="\x8a\xd6";sjisconv["\u95a3"]="\x8at";sjisconv["\u95a4"]="\x8d}";sjisconv["\u95a5"]="\x94\xb4";
          sjisconv["\u95a7"]="\xe8\x82";sjisconv["\u95a8"]="\xe8\x81";sjisconv["\u95ad"]="\xe8\x83";sjisconv["\u95b2"]="\x89{";sjisconv["\u95b9"]="\xe8\x86";sjisconv["\u95bb"]="\xe8\x85";sjisconv["\u95bc"]="\xe8\x84";sjisconv["\u95be"]="\xe8\x87";sjisconv["\u95c3"]="\xe8\x8a";sjisconv["\u95c7"]="\x88\xc5";sjisconv["\u95ca"]="\xe8\x88";sjisconv["\u95cc"]="\xe8\x8c";sjisconv["\u95cd"]="\xe8\x8b";sjisconv["\u95d4"]="\xe8\x8e";sjisconv["\u95d5"]="\xe8\x8d";sjisconv["\u95d6"]="\xe8\x8f";sjisconv["\u95d8"]="\x93\xac";
          sjisconv["\u95dc"]="\xe8\x90";sjisconv["\u95e1"]="\xe8\x91";sjisconv["\u95e2"]="\xe8\x93";sjisconv["\u95e5"]="\xe8\x92";sjisconv["\u961c"]="\x95\x8c";sjisconv["\u9621"]="\xe8\x94";sjisconv["\u9628"]="\xe8\x95";sjisconv["\u962a"]="\x8d\xe3";sjisconv["\u962e"]="\xe8\x96";sjisconv["\u962f"]="\xe8\x97";sjisconv["\u9632"]="\x96h";sjisconv["\u963b"]="\x91j";sjisconv["\u963f"]="\x88\xa2";sjisconv["\u9640"]="\x91\xc9";sjisconv["\u9642"]="\xe8\x98";sjisconv["\u9644"]="\x95\x8d";sjisconv["\u964b"]="\xe8\x9b";
          sjisconv["\u964c"]="\xe8\x99";sjisconv["\u964d"]="\x8d~";sjisconv["\u964f"]="\xe8\x9a";sjisconv["\u9650"]="\x8c\xc0";sjisconv["\u965b"]="\x95\xc3";sjisconv["\u965c"]="\xe8\x9d";sjisconv["\u965d"]="\xe8\x9f";sjisconv["\u965e"]="\xe8\x9e";sjisconv["\u965f"]="\xe8\xa0";sjisconv["\u9662"]="\x89@";sjisconv["\u9663"]="\x90w";sjisconv["\u9664"]="\x8f\x9c";sjisconv["\u9665"]="\x8a\xd7";sjisconv["\u9666"]="\xe8\xa1";sjisconv["\u966a"]="\x94\x86";sjisconv["\u966c"]="\xe8\xa3";sjisconv["\u9670"]="\x89A";sjisconv["\u9672"]="\xe8\xa2";
          sjisconv["\u9673"]="\x92\xc2";sjisconv["\u9675"]="\x97\xcb";sjisconv["\u9676"]="\x93\xa9";sjisconv["\u9677"]="\xe8\x9c";sjisconv["\u9678"]="\x97\xa4";sjisconv["\u967a"]="\x8c\xaf";sjisconv["\u967d"]="\x97z";sjisconv["\u9685"]="\x8b\xf7";sjisconv["\u9686"]="\x97\xb2";sjisconv["\u9688"]="\x8cG";sjisconv["\u968a"]="\x91\xe0";sjisconv["\u968b"]="\xe4@";sjisconv["\u968d"]="\xe8\xa4";sjisconv["\u968e"]="\x8aK";sjisconv["\u968f"]="\x90\x8f";sjisconv["\u9694"]="\x8au";sjisconv["\u9695"]="\xe8\xa6";sjisconv["\u9697"]="\xe8\xa7";
          sjisconv["\u9698"]="\xe8\xa5";sjisconv["\u9699"]="\x8c\x84";sjisconv["\u969b"]="\x8d\xdb";sjisconv["\u969c"]="\x8f\xe1";sjisconv["\u96a0"]="\x89B";sjisconv["\u96a3"]="\x97\xd7";sjisconv["\u96a7"]="\xe8\xa9";sjisconv["\u96a8"]="\xe7\xac";sjisconv["\u96aa"]="\xe8\xa8";sjisconv["\u96b0"]="\xe8\xac";sjisconv["\u96b1"]="\xe8\xaa";sjisconv["\u96b2"]="\xe8\xab";sjisconv["\u96b4"]="\xe8\xad";sjisconv["\u96b6"]="\xe8\xae";sjisconv["\u96b7"]="\x97\xea";sjisconv["\u96b8"]="\xe8\xaf";sjisconv["\u96b9"]="\xe8\xb0";
          sjisconv["\u96bb"]="\x90\xc7";sjisconv["\u96bc"]="\x94\xb9";sjisconv["\u96c0"]="\x90\x9d";sjisconv["\u96c1"]="\x8a\xe5";sjisconv["\u96c4"]="\x97Y";sjisconv["\u96c5"]="\x89\xeb";sjisconv["\u96c6"]="\x8fW";sjisconv["\u96c7"]="\x8c\xd9";sjisconv["\u96c9"]="\xe8\xb3";sjisconv["\u96cb"]="\xe8\xb2";sjisconv["\u96cc"]="\x8e\x93";sjisconv["\u96cd"]="\xe8\xb4";sjisconv["\u96ce"]="\xe8\xb1";sjisconv["\u96d1"]="\x8eG";sjisconv["\u96d5"]="\xe8\xb8";sjisconv["\u96d6"]="\xe5\xab";sjisconv["\u96d9"]="\x99\xd4";
          sjisconv["\u96db"]="\x90\x97";sjisconv["\u96dc"]="\xe8\xb6";sjisconv["\u96e2"]="\x97\xa3";sjisconv["\u96e3"]="\x93\xef";sjisconv["\u96e8"]="\x89J";sjisconv["\u96ea"]="\x90\xe1";sjisconv["\u96eb"]="\x8e\xb4";sjisconv["\u96f0"]="\x95\xb5";sjisconv["\u96f2"]="\x89_";sjisconv["\u96f6"]="\x97\xeb";sjisconv["\u96f7"]="\x97\x8b";sjisconv["\u96f9"]="\xe8\xb9";sjisconv["\u96fb"]="\x93d";sjisconv["\u9700"]="\x8e\xf9";sjisconv["\u9704"]="\xe8\xba";sjisconv["\u9706"]="\xe8\xbb";sjisconv["\u9707"]="\x90k";sjisconv["\u9708"]="\xe8\xbc";
          sjisconv["\u970a"]="\x97\xec";sjisconv["\u970d"]="\xe8\xb7";sjisconv["\u970e"]="\xe8\xbe";sjisconv["\u970f"]="\xe8\xc0";sjisconv["\u9711"]="\xe8\xbf";sjisconv["\u9713"]="\xe8\xbd";sjisconv["\u9716"]="\xe8\xc1";sjisconv["\u9719"]="\xe8\xc2";sjisconv["\u971c"]="\x91\x9a";sjisconv["\u971e"]="\x89\xe0";sjisconv["\u9724"]="\xe8\xc3";sjisconv["\u9727"]="\x96\xb6";sjisconv["\u972a"]="\xe8\xc4";sjisconv["\u9730"]="\xe8\xc5";sjisconv["\u9732"]="\x98I";sjisconv["\u9738"]="\x9eP";sjisconv["\u9739"]="\xe8\xc6";
          sjisconv["\u973d"]="\xe8\xc7";sjisconv["\u973e"]="\xe8\xc8";sjisconv["\u9742"]="\xe8\xcc";sjisconv["\u9744"]="\xe8\xc9";sjisconv["\u9746"]="\xe8\xca";sjisconv["\u9748"]="\xe8\xcb";sjisconv["\u9749"]="\xe8\xcd";sjisconv["\u9752"]="\x90\xc2";sjisconv["\u9756"]="\x96\xf5";sjisconv["\u9759"]="\x90\xc3";sjisconv["\u975c"]="\xe8\xce";sjisconv["\u975e"]="\x94\xf1";sjisconv["\u9760"]="\xe8\xcf";sjisconv["\u9761"]="\xear";sjisconv["\u9762"]="\x96\xca";sjisconv["\u9764"]="\xe8\xd0";sjisconv["\u9766"]="\xe8\xd1";
          sjisconv["\u9768"]="\xe8\xd2";sjisconv["\u9769"]="\x8av";sjisconv["\u976b"]="\xe8\xd4";sjisconv["\u976d"]="\x90x";sjisconv["\u9771"]="\xe8\xd5";sjisconv["\u9774"]="\x8cC";sjisconv["\u9779"]="\xe8\xd6";sjisconv["\u977a"]="\xe8\xda";sjisconv["\u977c"]="\xe8\xd8";sjisconv["\u9781"]="\xe8\xd9";sjisconv["\u9784"]="\x8a\x93";sjisconv["\u9785"]="\xe8\xd7";sjisconv["\u9786"]="\xe8\xdb";sjisconv["\u978b"]="\xe8\xdc";sjisconv["\u978d"]="\x88\xc6";sjisconv["\u978f"]="\xe8\xdd";sjisconv["\u9790"]="\xe8\xde";
          sjisconv["\u9798"]="\x8f\xe2";sjisconv["\u979c"]="\xe8\xdf";sjisconv["\u97a0"]="\x8bf";sjisconv["\u97a3"]="\xe8\xe2";sjisconv["\u97a6"]="\xe8\xe1";sjisconv["\u97a8"]="\xe8\xe0";sjisconv["\u97ab"]="\xe6\x91";sjisconv["\u97ad"]="\x95\xda";sjisconv["\u97b3"]="\xe8\xe3";sjisconv["\u97b4"]="\xe8\xe4";sjisconv["\u97c3"]="\xe8\xe5";sjisconv["\u97c6"]="\xe8\xe6";sjisconv["\u97c8"]="\xe8\xe7";sjisconv["\u97cb"]="\xe8\xe8";sjisconv["\u97d3"]="\x8a\xd8";sjisconv["\u97dc"]="\xe8\xe9";sjisconv["\u97ed"]="\xe8\xea";
          sjisconv["\u97ee"]="\x94B";sjisconv["\u97f2"]="\xe8\xec";sjisconv["\u97f3"]="\x89\xb9";sjisconv["\u97f5"]="\xe8\xef";sjisconv["\u97f6"]="\xe8\xee";sjisconv["\u97fb"]="\x89C";sjisconv["\u97ff"]="\x8b\xbf";sjisconv["\u9801"]="\x95\xc5";sjisconv["\u9802"]="\x92\xb8";sjisconv["\u9803"]="\x8d\xa0";sjisconv["\u9805"]="\x8d\x80";sjisconv["\u9806"]="\x8f\x87";sjisconv["\u9808"]="\x90{";sjisconv["\u980c"]="\xe8\xf1";sjisconv["\u980f"]="\xe8\xf0";sjisconv["\u9810"]="\x97a";sjisconv["\u9811"]="\x8a\xe6";sjisconv["\u9812"]="\x94\xd0";
          sjisconv["\u9813"]="\x93\xda";sjisconv["\u9817"]="\x90\x9c";sjisconv["\u9818"]="\x97\xcc";sjisconv["\u981a"]="\x8cz";sjisconv["\u9821"]="\xe8\xf4";sjisconv["\u9824"]="\xe8\xf3";sjisconv["\u982c"]="\x96j";sjisconv["\u982d"]="\x93\xaa";sjisconv["\u9834"]="\x89o";sjisconv["\u9837"]="\xe8\xf5";sjisconv["\u9838"]="\xe8\xf2";sjisconv["\u983b"]="\x95p";sjisconv["\u983c"]="\x97\x8a";sjisconv["\u983d"]="\xe8\xf6";sjisconv["\u9846"]="\xe8\xf7";sjisconv["\u984b"]="\xe8\xf9";sjisconv["\u984c"]="\x91\xe8";sjisconv["\u984d"]="\x8az";
          sjisconv["\u984e"]="\x8a{";sjisconv["\u984f"]="\xe8\xf8";sjisconv["\u9854"]="\x8a\xe7";sjisconv["\u9855"]="\x8c\xb0";sjisconv["\u9858"]="\x8a\xe8";sjisconv["\u985b"]="\x93^";sjisconv["\u985e"]="\x97\xde";sjisconv["\u9867"]="\x8c\xda";sjisconv["\u986b"]="\xe8\xfa";sjisconv["\u986f"]="\xe8\xfb";sjisconv["\u9870"]="\xe8\xfc";sjisconv["\u9871"]="\xe9@";sjisconv["\u9873"]="\xe9B";sjisconv["\u9874"]="\xe9A";sjisconv["\u98a8"]="\x95\x97";sjisconv["\u98aa"]="\xe9C";sjisconv["\u98af"]="\xe9D";sjisconv["\u98b1"]="\xe9E";
          sjisconv["\u98b6"]="\xe9F";sjisconv["\u98c3"]="\xe9H";sjisconv["\u98c4"]="\xe9G";sjisconv["\u98c6"]="\xe9I";sjisconv["\u98db"]="\x94\xf2";sjisconv["\u98dc"]="\xe3\xca";sjisconv["\u98df"]="\x90H";sjisconv["\u98e2"]="\x8bQ";sjisconv["\u98e9"]="\xe9J";sjisconv["\u98eb"]="\xe9K";sjisconv["\u98ed"]="\x99\xaa";sjisconv["\u98ee"]="\x9fZ";sjisconv["\u98ef"]="\x94\xd1";sjisconv["\u98f2"]="\x88\xf9";sjisconv["\u98f4"]="\x88\xb9";sjisconv["\u98fc"]="\x8e\x94";sjisconv["\u98fd"]="\x96O";sjisconv["\u98fe"]="\x8f\xfc";
          sjisconv["\u9903"]="\xe9L";sjisconv["\u9905"]="\x96\xdd";sjisconv["\u9909"]="\xe9M";sjisconv["\u990a"]="\x97{";sjisconv["\u990c"]="\x89a";sjisconv["\u9910"]="\x8e`";sjisconv["\u9912"]="\xe9N";sjisconv["\u9913"]="\x89\xec";sjisconv["\u9914"]="\xe9O";sjisconv["\u9918"]="\xe9P";sjisconv["\u991d"]="\xe9R";sjisconv["\u991e"]="\xe9S";sjisconv["\u9920"]="\xe9U";sjisconv["\u9921"]="\xe9Q";sjisconv["\u9924"]="\xe9T";sjisconv["\u9928"]="\x8a\xd9";sjisconv["\u992c"]="\xe9V";sjisconv["\u992e"]="\xe9W";sjisconv["\u993d"]="\xe9X";
          sjisconv["\u993e"]="\xe9Y";sjisconv["\u9942"]="\xe9Z";sjisconv["\u9945"]="\xe9\\";sjisconv["\u9949"]="\xe9[";sjisconv["\u994b"]="\xe9^";sjisconv["\u994c"]="\xe9a";sjisconv["\u9950"]="\xe9]";sjisconv["\u9951"]="\xe9_";sjisconv["\u9952"]="\xe9`";sjisconv["\u9955"]="\xe9b";sjisconv["\u9957"]="\x8b\xc0";sjisconv["\u9996"]="\x8e\xf1";sjisconv["\u9997"]="\xe9c";sjisconv["\u9998"]="\xe9d";sjisconv["\u9999"]="\x8d\x81";sjisconv["\u99a5"]="\xe9e";sjisconv["\u99a8"]="\x8a]";sjisconv["\u99ac"]="\x94n";sjisconv["\u99ad"]="\xe9f";
          sjisconv["\u99ae"]="\xe9g";sjisconv["\u99b3"]="\x92y";sjisconv["\u99b4"]="\x93\xe9";sjisconv["\u99bc"]="\xe9h";sjisconv["\u99c1"]="\x94\x9d";sjisconv["\u99c4"]="\x91\xca";sjisconv["\u99c5"]="\x89w";sjisconv["\u99c6"]="\x8b\xec";sjisconv["\u99c8"]="\x8b\xed";sjisconv["\u99d0"]="\x92\x93";sjisconv["\u99d1"]="\xe9m";sjisconv["\u99d2"]="\x8b\xee";sjisconv["\u99d5"]="\x89\xed";sjisconv["\u99d8"]="\xe9l";sjisconv["\u99db"]="\xe9j";sjisconv["\u99dd"]="\xe9k";sjisconv["\u99df"]="\xe9i";sjisconv["\u99e2"]="\xe9w";
          sjisconv["\u99ed"]="\xe9n";sjisconv["\u99ee"]="\xe9o";sjisconv["\u99f1"]="\xe9p";sjisconv["\u99f2"]="\xe9q";sjisconv["\u99f8"]="\xe9s";sjisconv["\u99fb"]="\xe9r";sjisconv["\u99ff"]="\x8fx";sjisconv["\u9a01"]="\xe9t";sjisconv["\u9a05"]="\xe9v";sjisconv["\u9a0e"]="\x8bR";sjisconv["\u9a0f"]="\xe9u";sjisconv["\u9a12"]="\x91\x9b";sjisconv["\u9a13"]="\x8c\xb1";sjisconv["\u9a19"]="\xe9x";sjisconv["\u9a28"]="\x91\xcb";sjisconv["\u9a2b"]="\xe9y";sjisconv["\u9a30"]="\x93\xab";sjisconv["\u9a37"]="\xe9z";sjisconv["\u9a3e"]="\xe9\x80";
          sjisconv["\u9a40"]="\xe9}";sjisconv["\u9a42"]="\xe9|";sjisconv["\u9a43"]="\xe9~";sjisconv["\u9a45"]="\xe9{";sjisconv["\u9a4d"]="\xe9\x82";sjisconv["\u9a55"]="\xe9\x81";sjisconv["\u9a57"]="\xe9\x84";sjisconv["\u9a5a"]="\x8b\xc1";sjisconv["\u9a5b"]="\xe9\x83";sjisconv["\u9a5f"]="\xe9\x85";sjisconv["\u9a62"]="\xe9\x86";sjisconv["\u9a64"]="\xe9\x88";sjisconv["\u9a65"]="\xe9\x87";sjisconv["\u9a69"]="\xe9\x89";sjisconv["\u9a6a"]="\xe9\x8b";sjisconv["\u9a6b"]="\xe9\x8a";sjisconv["\u9aa8"]="\x8d\x9c";sjisconv["\u9aad"]="\xe9\x8c";
          sjisconv["\u9ab0"]="\xe9\x8d";sjisconv["\u9ab8"]="\x8a[";sjisconv["\u9abc"]="\xe9\x8e";sjisconv["\u9ac0"]="\xe9\x8f";sjisconv["\u9ac4"]="\x90\x91";sjisconv["\u9acf"]="\xe9\x90";sjisconv["\u9ad1"]="\xe9\x91";sjisconv["\u9ad3"]="\xe9\x92";sjisconv["\u9ad4"]="\xe9\x93";sjisconv["\u9ad8"]="\x8d\x82";sjisconv["\u9ade"]="\xe9\x94";sjisconv["\u9adf"]="\xe9\x95";sjisconv["\u9ae2"]="\xe9\x96";sjisconv["\u9ae3"]="\xe9\x97";sjisconv["\u9ae6"]="\xe9\x98";sjisconv["\u9aea"]="\x94\xaf";sjisconv["\u9aeb"]="\xe9\x9a";
          sjisconv["\u9aed"]="\x95E";sjisconv["\u9aee"]="\xe9\x9b";sjisconv["\u9aef"]="\xe9\x99";sjisconv["\u9af1"]="\xe9\x9d";sjisconv["\u9af4"]="\xe9\x9c";sjisconv["\u9af7"]="\xe9\x9e";sjisconv["\u9afb"]="\xe9\x9f";sjisconv["\u9b06"]="\xe9\xa0";sjisconv["\u9b18"]="\xe9\xa1";sjisconv["\u9b1a"]="\xe9\xa2";sjisconv["\u9b1f"]="\xe9\xa3";sjisconv["\u9b22"]="\xe9\xa4";sjisconv["\u9b23"]="\xe9\xa5";sjisconv["\u9b25"]="\xe9\xa6";sjisconv["\u9b27"]="\xe9\xa7";sjisconv["\u9b28"]="\xe9\xa8";sjisconv["\u9b29"]="\xe9\xa9";
          sjisconv["\u9b2a"]="\xe9\xaa";sjisconv["\u9b2e"]="\xe9\xab";sjisconv["\u9b2f"]="\xe9\xac";sjisconv["\u9b31"]="\x9fT";sjisconv["\u9b32"]="\xe9\xad";sjisconv["\u9b3b"]="\xe2\xf6";sjisconv["\u9b3c"]="\x8bS";sjisconv["\u9b41"]="\x8a@";sjisconv["\u9b42"]="\x8d\xb0";sjisconv["\u9b43"]="\xe9\xaf";sjisconv["\u9b44"]="\xe9\xae";sjisconv["\u9b45"]="\x96\xa3";sjisconv["\u9b4d"]="\xe9\xb1";sjisconv["\u9b4e"]="\xe9\xb2";sjisconv["\u9b4f"]="\xe9\xb0";sjisconv["\u9b51"]="\xe9\xb3";sjisconv["\u9b54"]="\x96\x82";
          sjisconv["\u9b58"]="\xe9\xb4";sjisconv["\u9b5a"]="\x8b\x9b";sjisconv["\u9b6f"]="\x98D";sjisconv["\u9b74"]="\xe9\xb5";sjisconv["\u9b83"]="\xe9\xb7";sjisconv["\u9b8e"]="\x88\xbc";sjisconv["\u9b91"]="\xe9\xb8";sjisconv["\u9b92"]="\x95\xa9";sjisconv["\u9b93"]="\xe9\xb6";sjisconv["\u9b96"]="\xe9\xb9";sjisconv["\u9b97"]="\xe9\xba";sjisconv["\u9b9f"]="\xe9\xbb";sjisconv["\u9ba0"]="\xe9\xbc";sjisconv["\u9ba8"]="\xe9\xbd";sjisconv["\u9baa"]="\x96\x8e";sjisconv["\u9bab"]="\x8eL";sjisconv["\u9bad"]="\x8d\xf8";
          sjisconv["\u9bae"]="\x91N";sjisconv["\u9bb4"]="\xe9\xbe";sjisconv["\u9bb9"]="\xe9\xc1";sjisconv["\u9bc0"]="\xe9\xbf";sjisconv["\u9bc6"]="\xe9\xc2";sjisconv["\u9bc9"]="\x8c\xef";sjisconv["\u9bca"]="\xe9\xc0";sjisconv["\u9bcf"]="\xe9\xc3";sjisconv["\u9bd1"]="\xe9\xc4";sjisconv["\u9bd2"]="\xe9\xc5";sjisconv["\u9bd4"]="\xe9\xc9";sjisconv["\u9bd6"]="\x8eI";sjisconv["\u9bdb"]="\x91\xe2";sjisconv["\u9be1"]="\xe9\xca";sjisconv["\u9be2"]="\xe9\xc7";sjisconv["\u9be3"]="\xe9\xc6";sjisconv["\u9be4"]="\xe9\xc8";
          sjisconv["\u9be8"]="\x8c~";sjisconv["\u9bf0"]="\xe9\xce";sjisconv["\u9bf1"]="\xe9\xcd";sjisconv["\u9bf2"]="\xe9\xcc";sjisconv["\u9bf5"]="\x88\xb1";sjisconv["\u9c04"]="\xe9\xd8";sjisconv["\u9c06"]="\xe9\xd4";sjisconv["\u9c08"]="\xe9\xd5";sjisconv["\u9c09"]="\xe9\xd1";sjisconv["\u9c0a"]="\xe9\xd7";sjisconv["\u9c0c"]="\xe9\xd3";sjisconv["\u9c0d"]="\x8a\x82";sjisconv["\u9c10"]="\x98k";sjisconv["\u9c12"]="\xe9\xd6";sjisconv["\u9c13"]="\xe9\xd2";sjisconv["\u9c14"]="\xe9\xd0";sjisconv["\u9c15"]="\xe9\xcf";
          sjisconv["\u9c1b"]="\xe9\xda";sjisconv["\u9c21"]="\xe9\xdd";sjisconv["\u9c24"]="\xe9\xdc";sjisconv["\u9c25"]="\xe9\xdb";sjisconv["\u9c2d"]="\x95h";sjisconv["\u9c2e"]="\xe9\xd9";sjisconv["\u9c2f"]="\x88\xf1";sjisconv["\u9c30"]="\xe9\xde";sjisconv["\u9c32"]="\xe9\xe0";sjisconv["\u9c39"]="\x8a\x8f";sjisconv["\u9c3a"]="\xe9\xcb";sjisconv["\u9c3b"]="\x89V";sjisconv["\u9c3e"]="\xe9\xe2";sjisconv["\u9c46"]="\xe9\xe1";sjisconv["\u9c47"]="\xe9\xdf";sjisconv["\u9c48"]="\x92L";sjisconv["\u9c52"]="\x96\x90";
          sjisconv["\u9c57"]="\x97\xd8";sjisconv["\u9c5a"]="\xe9\xe3";sjisconv["\u9c60"]="\xe9\xe4";sjisconv["\u9c67"]="\xe9\xe5";sjisconv["\u9c76"]="\xe9\xe6";sjisconv["\u9c78"]="\xe9\xe7";sjisconv["\u9ce5"]="\x92\xb9";sjisconv["\u9ce7"]="\xe9\xe8";sjisconv["\u9ce9"]="\x94\xb5";sjisconv["\u9ceb"]="\xe9\xed";sjisconv["\u9cec"]="\xe9\xe9";sjisconv["\u9cf0"]="\xe9\xea";sjisconv["\u9cf3"]="\x96P";sjisconv["\u9cf4"]="\x96\xc2";sjisconv["\u9cf6"]="\x93\xce";sjisconv["\u9d03"]="\xe9\xee";sjisconv["\u9d06"]="\xe9\xef";
          sjisconv["\u9d07"]="\x93\xbc";sjisconv["\u9d08"]="\xe9\xec";sjisconv["\u9d09"]="\xe9\xeb";sjisconv["\u9d0e"]="\x89\xa8";sjisconv["\u9d12"]="\xe9\xf7";sjisconv["\u9d15"]="\xe9\xf6";sjisconv["\u9d1b"]="\x89\x95";sjisconv["\u9d1f"]="\xe9\xf4";sjisconv["\u9d23"]="\xe9\xf3";sjisconv["\u9d26"]="\xe9\xf1";sjisconv["\u9d28"]="\x8a\x9b";sjisconv["\u9d2a"]="\xe9\xf0";sjisconv["\u9d2b"]="\x8e\xb0";sjisconv["\u9d2c"]="\x89\xa7";sjisconv["\u9d3b"]="\x8d\x83";sjisconv["\u9d3e"]="\xe9\xfa";sjisconv["\u9d3f"]="\xe9\xf9";
          sjisconv["\u9d41"]="\xe9\xf8";sjisconv["\u9d44"]="\xe9\xf5";sjisconv["\u9d46"]="\xe9\xfb";sjisconv["\u9d48"]="\xe9\xfc";sjisconv["\u9d50"]="\xeaD";sjisconv["\u9d51"]="\xeaC";sjisconv["\u9d59"]="\xeaE";sjisconv["\u9d5c"]="\x89L";sjisconv["\u9d5d"]="\xea@";sjisconv["\u9d5e"]="\xeaA";sjisconv["\u9d60"]="\x8d\x94";sjisconv["\u9d61"]="\x96\xb7";sjisconv["\u9d64"]="\xeaB";sjisconv["\u9d6c"]="\x96Q";sjisconv["\u9d6f"]="\xeaJ";sjisconv["\u9d72"]="\xeaF";sjisconv["\u9d7a"]="\xeaK";sjisconv["\u9d87"]="\xeaH";
          sjisconv["\u9d89"]="\xeaG";sjisconv["\u9d8f"]="\x8c{";sjisconv["\u9d9a"]="\xeaL";sjisconv["\u9da4"]="\xeaM";sjisconv["\u9da9"]="\xeaN";sjisconv["\u9dab"]="\xeaI";sjisconv["\u9daf"]="\xe9\xf2";sjisconv["\u9db2"]="\xeaO";sjisconv["\u9db4"]="\x92\xdf";sjisconv["\u9db8"]="\xeaS";sjisconv["\u9dba"]="\xeaT";sjisconv["\u9dbb"]="\xeaR";sjisconv["\u9dc1"]="\xeaQ";sjisconv["\u9dc2"]="\xeaW";sjisconv["\u9dc4"]="\xeaP";sjisconv["\u9dc6"]="\xeaU";sjisconv["\u9dcf"]="\xeaV";sjisconv["\u9dd3"]="\xeaY";sjisconv["\u9dd9"]="\xeaX";
          sjisconv["\u9de6"]="\xea[";sjisconv["\u9ded"]="\xea\\";sjisconv["\u9def"]="\xea]";sjisconv["\u9df2"]="\x98h";sjisconv["\u9df8"]="\xeaZ";sjisconv["\u9df9"]="\x91\xe9";sjisconv["\u9dfa"]="\x8d\xeb";sjisconv["\u9dfd"]="\xea^";sjisconv["\u9e1a"]="\xea_";sjisconv["\u9e1b"]="\xea`";sjisconv["\u9e1e"]="\xeaa";sjisconv["\u9e75"]="\xeab";sjisconv["\u9e78"]="\x8c\xb2";sjisconv["\u9e79"]="\xeac";sjisconv["\u9e7d"]="\xead";sjisconv["\u9e7f"]="\x8e\xad";sjisconv["\u9e81"]="\xeae";sjisconv["\u9e88"]="\xeaf";sjisconv["\u9e8b"]="\xeag";
          sjisconv["\u9e8c"]="\xeah";sjisconv["\u9e91"]="\xeak";sjisconv["\u9e92"]="\xeai";sjisconv["\u9e93"]="\x98[";sjisconv["\u9e95"]="\xeaj";sjisconv["\u9e97"]="\x97\xed";sjisconv["\u9e9d"]="\xeal";sjisconv["\u9e9f"]="\x97\xd9";sjisconv["\u9ea5"]="\xeam";sjisconv["\u9ea6"]="\x94\x9e";sjisconv["\u9ea9"]="\xean";sjisconv["\u9eaa"]="\xeap";sjisconv["\u9ead"]="\xeaq";sjisconv["\u9eb8"]="\xeao";sjisconv["\u9eb9"]="\x8d\x8d";sjisconv["\u9eba"]="\x96\xcb";sjisconv["\u9ebb"]="\x96\x83";sjisconv["\u9ebc"]="\x9b\xf5";
          sjisconv["\u9ebe"]="\x9f\x80";sjisconv["\u9ebf"]="\x96\x9b";sjisconv["\u9ec4"]="\x89\xa9";sjisconv["\u9ecc"]="\xeas";sjisconv["\u9ecd"]="\x8bo";sjisconv["\u9ece"]="\xeat";sjisconv["\u9ecf"]="\xeau";sjisconv["\u9ed0"]="\xeav";sjisconv["\u9ed2"]="\x8d\x95";sjisconv["\u9ed4"]="\xeaw";sjisconv["\u9ed8"]="\xe0\xd2";sjisconv["\u9ed9"]="\x96\xd9";sjisconv["\u9edb"]="\x91\xe1";sjisconv["\u9edc"]="\xeax";sjisconv["\u9edd"]="\xeaz";sjisconv["\u9ede"]="\xeay";sjisconv["\u9ee0"]="\xea{";sjisconv["\u9ee5"]="\xea|";
          sjisconv["\u9ee8"]="\xea}";sjisconv["\u9eef"]="\xea~";sjisconv["\u9ef4"]="\xea\x80";sjisconv["\u9ef6"]="\xea\x81";sjisconv["\u9ef7"]="\xea\x82";sjisconv["\u9ef9"]="\xea\x83";sjisconv["\u9efb"]="\xea\x84";sjisconv["\u9efc"]="\xea\x85";sjisconv["\u9efd"]="\xea\x86";sjisconv["\u9f07"]="\xea\x87";sjisconv["\u9f08"]="\xea\x88";sjisconv["\u9f0e"]="\x93C";sjisconv["\u9f13"]="\x8c\xdb";sjisconv["\u9f15"]="\xea\x8a";sjisconv["\u9f20"]="\x91l";sjisconv["\u9f21"]="\xea\x8b";sjisconv["\u9f2c"]="\xea\x8c";sjisconv["\u9f3b"]="\x95@";
          sjisconv["\u9f3e"]="\xea\x8d";sjisconv["\u9f4a"]="\xea\x8e";sjisconv["\u9f4b"]="\xe2V";sjisconv["\u9f4e"]="\xe6\xd8";sjisconv["\u9f4f"]="\xe8\xeb";sjisconv["\u9f52"]="\xea\x8f";sjisconv["\u9f54"]="\xea\x90";sjisconv["\u9f5f"]="\xea\x92";sjisconv["\u9f60"]="\xea\x93";sjisconv["\u9f61"]="\xea\x94";sjisconv["\u9f62"]="\x97\xee";sjisconv["\u9f63"]="\xea\x91";sjisconv["\u9f66"]="\xea\x95";sjisconv["\u9f67"]="\xea\x96";sjisconv["\u9f6a"]="\xea\x98";sjisconv["\u9f6c"]="\xea\x97";sjisconv["\u9f72"]="\xea\x9a";
          sjisconv["\u9f76"]="\xea\x9b";sjisconv["\u9f77"]="\xea\x99";sjisconv["\u9f8d"]="\x97\xb4";sjisconv["\u9f95"]="\xea\x9c";sjisconv["\u9f9c"]="\xea\x9d";sjisconv["\u9f9d"]="\xe2s";sjisconv["\u9fa0"]="\xea\x9e";sjisconv["\uff01"]="\x81I";sjisconv["\uff03"]="\x81\x94";sjisconv["\uff04"]="\x81\x90";sjisconv["\uff05"]="\x81\x93";sjisconv["\uff06"]="\x81\x95";sjisconv["\uff08"]="\x81i";sjisconv["\uff09"]="\x81j";sjisconv["\uff0a"]="\x81\x96";sjisconv["\uff0b"]="\x81{";sjisconv["\uff0c"]="\x81C";sjisconv["\uff0e"]="\x81D";
          sjisconv["\uff0f"]="\x81^";sjisconv["\uff10"]="\x82O";sjisconv["\uff11"]="\x82P";sjisconv["\uff12"]="\x82Q";sjisconv["\uff13"]="\x82R";sjisconv["\uff14"]="\x82S";sjisconv["\uff15"]="\x82T";sjisconv["\uff16"]="\x82U";sjisconv["\uff17"]="\x82V";sjisconv["\uff18"]="\x82W";sjisconv["\uff19"]="\x82X";sjisconv["\uff1a"]="\x81F";sjisconv["\uff1b"]="\x81G";sjisconv["\uff1c"]="\x81\x83";sjisconv["\uff1d"]="\x81\x81";sjisconv["\uff1e"]="\x81\x84";sjisconv["\uff1f"]="\x81H";sjisconv["\uff20"]="\x81\x97";sjisconv["\uff21"]="\x82`";
          sjisconv["\uff22"]="\x82a";sjisconv["\uff23"]="\x82b";sjisconv["\uff24"]="\x82c";sjisconv["\uff25"]="\x82d";sjisconv["\uff26"]="\x82e";sjisconv["\uff27"]="\x82f";sjisconv["\uff28"]="\x82g";sjisconv["\uff29"]="\x82h";sjisconv["\uff2a"]="\x82i";sjisconv["\uff2b"]="\x82j";sjisconv["\uff2c"]="\x82k";sjisconv["\uff2d"]="\x82l";sjisconv["\uff2e"]="\x82m";sjisconv["\uff2f"]="\x82n";sjisconv["\uff30"]="\x82o";sjisconv["\uff31"]="\x82p";sjisconv["\uff32"]="\x82q";sjisconv["\uff33"]="\x82r";sjisconv["\uff34"]="\x82s";
          sjisconv["\uff35"]="\x82t";sjisconv["\uff36"]="\x82u";sjisconv["\uff37"]="\x82v";sjisconv["\uff38"]="\x82w";sjisconv["\uff39"]="\x82x";sjisconv["\uff3a"]="\x82y";sjisconv["\uff3b"]="\x81m";sjisconv["\uff3c"]="\x81_";sjisconv["\uff3d"]="\x81n";sjisconv["\uff3e"]="\x81O";sjisconv["\uff3f"]="\x81Q";sjisconv["\uff40"]="\x81M";sjisconv["\uff41"]="\x82\x81";sjisconv["\uff42"]="\x82\x82";sjisconv["\uff43"]="\x82\x83";sjisconv["\uff44"]="\x82\x84";sjisconv["\uff45"]="\x82\x85";sjisconv["\uff46"]="\x82\x86";
          sjisconv["\uff47"]="\x82\x87";sjisconv["\uff48"]="\x82\x88";sjisconv["\uff49"]="\x82\x89";sjisconv["\uff4a"]="\x82\x8a";sjisconv["\uff4b"]="\x82\x8b";sjisconv["\uff4c"]="\x82\x8c";sjisconv["\uff4d"]="\x82\x8d";sjisconv["\uff4e"]="\x82\x8e";sjisconv["\uff4f"]="\x82\x8f";sjisconv["\uff50"]="\x82\x90";sjisconv["\uff51"]="\x82\x91";sjisconv["\uff52"]="\x82\x92";sjisconv["\uff53"]="\x82\x93";sjisconv["\uff54"]="\x82\x94";sjisconv["\uff55"]="\x82\x95";sjisconv["\uff56"]="\x82\x96";sjisconv["\uff57"]="\x82\x97";
          sjisconv["\uff58"]="\x82\x98";sjisconv["\uff59"]="\x82\x99";sjisconv["\uff5a"]="\x82\x9a";sjisconv["\uff5b"]="\x81o";sjisconv["\uff5c"]="\x81b";sjisconv["\uff5d"]="\x81p";sjisconv["\uff61"]="\xa1";sjisconv["\uff62"]="\xa2";sjisconv["\uff63"]="\xa3";sjisconv["\uff64"]="\xa4";sjisconv["\uff65"]="\xa5";sjisconv["\uff66"]="\xa6";sjisconv["\uff67"]="\xa7";sjisconv["\uff68"]="\xa8";sjisconv["\uff69"]="\xa9";sjisconv["\uff6a"]="\xaa";sjisconv["\uff6b"]="\xab";sjisconv["\uff6c"]="\xac";sjisconv["\uff6d"]="\xad";
          sjisconv["\uff6e"]="\xae";sjisconv["\uff6f"]="\xaf";sjisconv["\uff70"]="\xb0";sjisconv["\uff71"]="\xb1";sjisconv["\uff72"]="\xb2";sjisconv["\uff73"]="\xb3";sjisconv["\uff74"]="\xb4";sjisconv["\uff75"]="\xb5";sjisconv["\uff76"]="\xb6";sjisconv["\uff77"]="\xb7";sjisconv["\uff78"]="\xb8";sjisconv["\uff79"]="\xb9";sjisconv["\uff7a"]="\xba";sjisconv["\uff7b"]="\xbb";sjisconv["\uff7c"]="\xbc";sjisconv["\uff7d"]="\xbd";sjisconv["\uff7e"]="\xbe";sjisconv["\uff7f"]="\xbf";sjisconv["\uff80"]="\xc0";sjisconv["\uff81"]="\xc1";
          sjisconv["\uff82"]="\xc2";sjisconv["\uff83"]="\xc3";sjisconv["\uff84"]="\xc4";sjisconv["\uff85"]="\xc5";sjisconv["\uff86"]="\xc6";sjisconv["\uff87"]="\xc7";sjisconv["\uff88"]="\xc8";sjisconv["\uff89"]="\xc9";sjisconv["\uff8a"]="\xca";sjisconv["\uff8b"]="\xcb";sjisconv["\uff8c"]="\xcc";sjisconv["\uff8d"]="\xcd";sjisconv["\uff8e"]="\xce";sjisconv["\uff8f"]="\xcf";sjisconv["\uff90"]="\xd0";sjisconv["\uff91"]="\xd1";sjisconv["\uff92"]="\xd2";sjisconv["\uff93"]="\xd3";sjisconv["\uff94"]="\xd4";sjisconv["\uff95"]="\xd5";
          sjisconv["\uff96"]="\xd6";sjisconv["\uff97"]="\xd7";sjisconv["\uff98"]="\xd8";sjisconv["\uff99"]="\xd9";sjisconv["\uff9a"]="\xda";sjisconv["\uff9b"]="\xdb";sjisconv["\uff9c"]="\xdc";sjisconv["\uff9d"]="\xdd";sjisconv["\uff9e"]="\xde";sjisconv["\uff9f"]="\xdf";sjisconv["\uffe3"]="\x81P";sjisconv["\uffe5"]="\x81\x8f";module.exports=sjisconv},{}]},{},[1])(1)}); 

          function tPrepName(tNN){
            return '<span style="font-weight:bold;">' + tNN + '</span>';
          }

          if(tc == ''){
            return tPrepName('Anonymous');
          }else{
            if(tc.indexOf('##') > 0){
              var preSplit = tc.split('##')[0];
              if(preSplit.indexOf('#') > -1){

                return tPrepName(tc.split('#')[0]) + '!' + tripcode(tc.split('#')[1]) + '!!***'; 
              }else{
                return tPrepName(preSplit) + '!!***';
              }
            }else if(tc.indexOf('#') > -1){
              return tPrepName(tc.split('#')[0]) + '!' + tripcode(tc.split('#')[1]);
            }else{
              return tPrepName(tc);
            }  
          }

      }

    
    
    
    
     /*--------------------------------------------------*/
    
    qr.main = {};
    qr.main['id'] = 'kqr';
    qr.main['class'] = 'kqr';  
    qr.main = $.elm('span', qr.main, db);
    
    qr.title = '/' + k.board + '/' + k.thread;
    
    qr.upEmbed = false;

    qr.main.innerHTML = '\
      <div id="kqr-handle" class="kqr-handle">\
        <span class="kqr-leftopts"><input type="checkbox" id="kqr-min" class="kqr-min kqr-checkbox" title="Minimize QR" /></span>\
        <span class="kqr-title">&nbsp;' + qr.title + '&nbsp;</span><span id="kqr-eject"></span><span id="kqr-loadthread" style="display:none"></span>\
<span class="kqr-rightopts" style="margin-right:12px !important;">[<span id="kqr-exopts-tog"><a style="cursor:pointer;">&#9660;</a></span>] <a id="kqr-close" class="kqr-close kqr-link" title="Close QR"><img style="padding:0px !important; padding-right:10px !important; position:absolute !important;" src="' + k.asset.close + '"></a></span>\
      </div>\
      <div id="kqr-body" class="kqr-body">\
<div id="kqr-xtra-opts" style="text-align:center;"><hr style="margin:0px;"><span id="kqrValidTrip"></span> <span id="kqrValidFlag"></span><hr style="margin:0px;">[\
      S<input type="checkbox" id="kqr-sage-check" title="Sage">/ I<input type="checkbox" id="kqr-spoil" class="kqr-spoil kqr-checkbox" title="Image Spoiler" />/ F\
<input type="checkbox" id="kqr-flag" class="kqr-flag kqr-checkbox" title="Hide Country Flag" />/ <input class="kqr-personafield" style="width:20px;" type="text" id="kqr-dice-d" placeholder="X"> d <input type="text" id="kqr-dice-y" class="kqr-personafield" style="width:20px;" placeholder="Y">  + <input type="text" id="kqr-dice-m" class="kqr-personafield" style="width:20px;" placeholder="Z"> \
      ]<hr style="margin:0px;"></div>\
        <div>\
          <input type="text" id="kqr-name" class="kqr-name kqr-personafield" placeholder="Name" />\
          <input type="text" id="kqr-email" class="kqr-email kqr-personafield" placeholder="Email" />\
          <input type="text" id="kqr-subject" class="kqr-subject kqr-personafield" placeholder="Subject" />\
<span style="float:right;" title="Anonymous Posting">[A:<input type="checkbox" id="kqr-read" class="kqr-read kqr-checkbox" title="Anonymous Posting" />]&nbsp;</span>\
        </div>\
        <div>\
          <textarea id="kqr-comment" class="kqr-comment" placeholder="Comment"></textarea>\
        </div>\
        <div id="kqr-captcha" style="display:none;">\
<div id="kqr-captcha-img" style="cursor:pointer;text-align:center;background:#FFFFFF;" title="Refresh Captcha"></div>\
           <div style="text-align:center;"><input style="width:297px;" id="kqr-captcha-input" data-cookie="" placeholder="Captcha" class="kqr-personafield"></div>\
          </div>\
        <div>\
          <span id="kqr-uploadType" class="kqr-link">&nbsp;<a><img title="File/Embed" style="padding:0px !important;margin-bottom:-4px !important;width:14px;" src="' + k.asset.fileSwitch + '"></a></span>\
          <span id="kqr-embedcontainer" style="display:none;"><input type="text" id="kqr-embedinput" class="kqr-embedinput" style="width:165px;" placeholder="Embed URL" /></span>\
          <span id="kqr-filecontainer"><input type="file" id="kqr-fileinput" class="kqr-fileinput kqr-button" multiple/></span>&nbsp;<a id="kqr-fileclear" class="kqr-fileclear kqr-link"><img title="Clear File" style="padding:0px !important; padding-right:10px !important; position:absolute !important;" src="' + k.asset.close + '"></a>\
          <button type="button" id="kqr-postbutton" class="kqr-postbutton kqr-button">Post</button>\
        </div>\
      </div>\
    ';
    
    $('#kqr-xtra-opts').style.display = "none";
    $('#kqr-exopts-tog').addEventListener('click', function(){
      if($('#kqr-xtra-opts').style.display != "none"){        
        $('#kqr-xtra-opts').style.display = "none";
        $.htm($('#kqr-exopts-tog'),'<a style="cursor:pointer;">&#9660;</a>');
      }else{
        $('#kqr-xtra-opts').style.display = "";
        $.htm($('#kqr-exopts-tog'),'<a style="cursor:pointer;">&#9650;</a>');
        qr.getFlag();
      }
     }, false);
    
    $('#kqr-uploadType').addEventListener('click', function(){
      if(qr.upEmbed == false){
        qr.upEmbed = true;
        qr.clearFile();
        $('#kqr-embedcontainer').style.display = '';
        $('#kqr-filecontainer').style.display = 'none';
      }else{
        qr.upEmbed = false;
        $('#kqr-embedcontainer').style.display = 'none';
        $('#kqr-filecontainer').style.display = '';
        $('#kqr-embedinput').value = '';
      }
    }, false);

    if($.getVal('qr-sage') == 'true'){
      $('#kqr-sage-check').checked = true;
    }else{
      $.setVal('qr-sage', 'false');
    }
    
    $('#kqr-sage-check').addEventListener('change', function(){
      if($.getVal('qr-sage') == 'false'){
        $('#kqr-sage-check').checked = true;
        $.setVal('qr-sage', 'true');
      }else{
        $.setVal('qr-sage', 'false');
        $('#kqr-sage-check').checked = false;
      }
    }, false);
        
    if($.getVal('qr-read') == 'true'){
      $('#kqr-read').checked = true;
      $('#kqr-name').disabled = true;
      $('#kqr-subject').disabled = true;
      $('#kqr-email').disabled = true;
    }else{
      $.setVal('qr-read', 'false');
    }
    
    $('#kqr-read').addEventListener('change', function(){
      if($.getVal('qr-read') == 'false'){
        $('#kqr-read').checked = true;
        $.setVal('qr-read', 'true');
        $('#kqr-name').disabled = true;
        $('#kqr-subject').disabled = true;
        $('#kqr-email').disabled = true;
      }else{
        $.setVal('qr-read', 'false');
        $('#kqr-read').checked = false;
        $('#kqr-name').disabled = false;
        $('#kqr-subject').disabled = false;
        $('#kqr-email').disabled = false;
      }
    }, false);
    

    qr.min = function(){
      $('#kqr-body').style.display = 'none';
      $('#kqr').addEventListener('mouseenter', function(){$('#kqr-body').style.display = '';}, false);
      $('#kqr').addEventListener('mouseleave', function(){ if($('#kqr-min').checked == true){ $('#kqr-body').style.display = 'none'; } }, false);

    }

    if($.getVal('qr-min') == 'true'){
      $('#kqr-min').checked = true;
      qr.min();
    }else{     
      $.setVal('qr-min', 'false');
    }

    $('#kqr-name').value = $.getVal('qr-name', '');
    $('#kqr-name').addEventListener('input', function(){
      $.setVal('qr-name', $('#kqr-name').value);
    }, false);

    $('#kqr-email').value = $.getVal('qr-email', '');
    $('#kqr-email').addEventListener('input', function(){
      $.setVal('qr-email', $('#kqr-email').value);
    }, false);

    $('#kqr-subject').value = $.getVal('qr-subject', '');
    $('#kqr-subject').addEventListener('input', function(){
      $.setVal('qr-subject', $('#kqr-subject').value);
    }, false);

    $('#kqr-min').addEventListener('change', function(){ 
      if($('#kqr-min').checked == true){ 
        qr.min();
        $.setVal('qr-min', 'true');
      }else{
        $.setVal('qr-min', 'false');
      }
    }, false);
    
    $('#kqrValidTrip').innerHTML = validateTrip($('#kqr-name').value);
    $('#kqr-name').addEventListener('input', function(){
       $('#kqrValidTrip').innerHTML = validateTrip($('#kqr-name').value);
    }, false);


    
    $('#kqr-close').addEventListener('click', function(){ 
      qr.main.style.display = "none"; 
    }, false);
    
    k.makeOP = true;
    
    if(k.thread != null && k.thread != 'catalog' && k.thread != 'index'){
      k.makeOP = false;
      $('#kqr-eject').innerHTML = '<a id="kqr-ejectButton" class="kqr-link" style="color:#FFFFEE;"><img title="Post New Thread" style="margin-bottom:-2px;" src="' + k.asset.eject + '"></a>&nbsp;';
      $('#kqr-loadthread').innerHTML = '<a id="kqr-loadThreadButton" class="kqr-link" style="color:#FFFFEE;"><img title="Post In Current Thread" style="margin-bottom:-2px;height:12px;" src="' + k.asset.load + '"></a>&nbsp;'; 
      $('#kqr-eject').addEventListener('click', function(){
        $('#kqr-loadthread').style.display = '';
        $('#kqr-eject').style.display = 'none';
        k.makeOP = true;
        $('.kqr-title').innerHTML = '&nbsp; New thread on /' + k.board + '/&nbsp;';
      }, false);
      $('#kqr-loadthread').addEventListener('click', function(){
        $('#kqr-loadthread').style.display = 'none';
        $('#kqr-eject').style.display = '';
        k.makeOP = false; 
        $('.kqr-title').innerHTML = '&nbsp;' + qr.title + '&nbsp;';
      }, false);
    }

    $('#kqr-fileclear').style.display = 'none';

    qr.showFileClear = function(){
      $('#kqr-fileclear').style.display = '';      
    }
    
    qr.flashGreen = function(){     
      qr.main.style.background = "green";
      $.time(50, function(){qr.main.style.background = "";}, false);
      $.time(100, function(){qr.main.style.background = "green";}, false);
      $.time(150, function(){qr.main.style.background = "";}, false);     
    }
    
    qr.flashRed = function(){     
      qr.main.style.background = "red";
      $.time(50, function(){qr.main.style.background = "";}, false);
      $.time(100, function(){qr.main.style.background = "red";}, false);
      $.time(150, function(){qr.main.style.background = "";}, false);     
    }

    qr.clearFile = function(){
      $.destroy($('#kqr-fileinput'));
      $('#kqr-filecontainer').innerHTML = '<input type="file" id="kqr-fileinput" class="kqr-fileinput kqr-button" multiple/>';
      $('#kqr-fileclear').style.display = 'none';
      return $('#kqr-fileinput').addEventListener('change', qr.showFileClear, false);
    }

    $('#kqr-fileinput').addEventListener('change', qr.showFileClear, false);

    $('#kqr-fileclear').addEventListener('click', qr.clearFile, false);
    
    if(typeof GM_xmlhttpRequest === "function"){
      qr.getFlag = function(){
        var $flagsp = $('#kqrValidFlag');
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://freegeoip.app/json/",
          onload: function(response){
            var rx = $.JSON(response.responseText);
            $flagsp.innerHTML = '<img class="flag flag-' + rx['country_code'].toLowerCase() + '" src="/static/blank_flag.gif" style="" alt="' + rx['country_name'] + '" title="' + rx['country_name'] + '">';
          }
        });    
      }
      qr.getFlag();
      $.time((1*60*1000), function(){ qr.getFlag(); }, true);
    }
    
    qr.drag = function(dragTarget){

      function dragDown(e){
        e = (e ? e : event);
        var top  = (isNaN(parseInt(this.parentNode.style.top))  ? 50 : this.parentNode.style.top);
        var left = (isNaN(parseInt(this.parentNode.style.left)) ? parseInt(window.innerWidth) - 350 : this.parentNode.style.left);
        var y = Math.abs(parseInt(top) - e.clientY);
        var x = Math.abs(parseInt(left) - e.clientX);

        var oldCursor = this.parentNode.style.cursor;
        this.parentNode.style.cursor = "move";

        var oldMousemove = d.onmousemove;
        var oldMouseup   = d.onmouseup;
        d.onmousemove = dragMakeMoveFunc(this.parentNode, y, x);
        d.onmouseup   = dragMakeStopFunc(this.parentNode, oldMousemove, oldMouseup, oldCursor);
      }

      function dragMakeMoveFunc(elem, y, x){
        return function(e){
          e = (e ? e : event);
          elem.style.top  = (e.clientY - y) + 'px';
          elem.style.left = (e.clientX - x) + 'px';
        }
      }

      function dragMakeStopFunc(elem, oldMousemove, oldMouseup, oldCursor){
        return function(){
          d.onmousemove  = oldMousemove;
          d.onmouseup    = oldMouseup;
          elem.style.cursor     = oldCursor;
        }
      }

      dragTarget.addEventListener('mousedown', dragDown, false);
    }
    qr.drag($('#kqr-handle')); 
    
    var status;
    
    function getNotPerm(){
      if (Notification && Notification.permission !== "granted"){
        Notification.requestPermission(function(status){
          if (Notification.permission !== status) {
            Notification.permission = status;
          }
        });
      }
    }

    qr.notify = function(n, nb, ni){
      if (Notification.permission === "granted" && $.getVal('kqr.desktopNotes', 'true') == 'true'){
        var notifyOpts = {};
        notifyOpts['body'] = nb;
        if(ni && ni != null){
          notifyOpts['icon'] = ni;
        }else{
          notifyOpts['icon'] = k.asset.optionsIcon;          
        }
        
        return new Notification(n, notifyOpts);
      }
    }
    getNotPerm();
    
    qr.buildAudio = function(){
      var $soundElm = {};
      $soundElm['id'] = 'kqr-alertSound';
      $soundElm = $.elm('audio', $soundElm, db);
      $soundElm.innerHTML = '<source src="' + k.asset.alert1 + '" type="audio/wav">';      
    }
    qr.buildAudio();
    
    qr.playAlert = function(){
      $('#kqr-alertSound').play();      
    }
    
    qr.captcha = function(){
      $('#kqr-captcha').style.display = ''; 
      function getNew(){        
        if($('img', $('#kqr-captcha-img'))){
          $('img', $('#kqr-captcha-img')).style.opacity = '0.2';       
        }
        $('#kqr-captcha-input').value = '';
        var xhr = new XMLHttpRequest();
        xhr.open("GET", k.proto + '//'+$siteDomain+'/8chan-captcha/entrypoint.php?mode=get&extra=abcdefghijklmnopqrstuvwxyz');
        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            var rx = $.JSON(xhr.responseText);
            $('#kqr-captcha-img').innerHTML = rx['captchahtml'];
            $.att($('#kqr-captcha-input'), 'data-cookie', rx['cookie']);
            $.time(((1000*parseInt(rx['expires_in']))-(15*1000)), function(){
              if($.att($('#kqr-captcha-input'), 'data-cookie') == rx['cookie']){
                getNew();                
              }              
            }, false);
          }      
        }
        xhr.send();  
      }
      getNew();
      d.addEventListener('refresh-captcha', getNew, false);
      $('#kqr-captcha-img').addEventListener('click', getNew, false);
    }
    
    qr.boardOptions = function(){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", k.proto + '//'+$siteDomain+'/settings.php?board=' + k.board);
        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            var bopts = $.JSON(xhr.responseText);
            if(bopts['captcha']['enabled'] == true){
              qr.captcha();              
            }else if(bopts['new_thread_capt'] == true && k.thread == 'index' || bopts['new_thread_capt'] == true && k.thread == 'catalog'){
              qr.captcha();              
            }
          } 
        }
        xhr.send();
    }
    qr.boardOptions();
    
    qr.xWindow = function(){
      var $expander = {};
      $expander['id'] = 'b-Expander';
      $expander['title'] = 'Expand Menu';
      $expander['style'] = 'float:left;padding-left:5px;';
      $expander = $.elm('span', $expander, $('.boardlist'));
      $expander.innerHTML = '<a style="cursor:pointer;">[ + ]&nbsp;</a>';
      
      qr.openLink = {};
      qr.openLink['id'] = 'kqr-menu';
      qr.openLink['title'] = 'Hide/Show Quick Reply';
      qr.openLink = $.elm('span', qr.openLink, $('.boardlist'));
      //qr.openLink.innerHTML = ' [ 8k: ';
      var qrLink = {};
      qrLink['id'] = 'kqr-qrMenuLink';
      qrLink['class'] = 'kqr-link';
      qr.openLink = $.elm('a', qrLink, qr.openLink);
      qr.openLink.innerHTML = ' [ QR ] ';  
      //$('#kqr-menu').innerHTML += ' ] ';
      $('#kqr-qrMenuLink').addEventListener('click', function(){ 
        if(qr.main.style.display == "none"){ 
          qr.main.style.display = ""; 
        }else{ 
          qr.main.style.display = "none"; 
        } 
      }, false);
       
      $.time(500, function(){
        
        $('[title="Options"]').style.float = "";
        $('[title="Options"]').innerHTML = "[ ⚙ ] ";
        $('[title="Options"]').title = "Settings";
        
        if(k.thread != 'catalog' && k.thread != null){
          $('.watchlist-toggle').innerHTML = " ☆ ";
          $('.watchlist-toggle').title = "Thread Watcher";
        }
        
        $.each($$('.sub'), function(sF, sE){
         sF.style.display = 'none';                            
        });
        
        var $bar = {};
        $bar['id'] = 'kq-menu-bar';
        $bar['name'] = 'kq-menu-bar';
        $bar['style'] = 'float:right;padding-left:5px;padding-right:5px;';
        $bar = $.elm('span', $bar, $('.boardlist'));
        if(k.thread != 'catalog' && k.thread != 'index' && k.thread != null){
          $bar.innerHTML = '<span id="newCounter"></span> <span id="updater"><span id="update_secs" title="Update" style="cursor:pointer;"> </span></span>&nbsp;/&nbsp;<span id="thread_stats_posts" title="Replies" style="cursor:help;"></span>&nbsp;/&nbsp;<span id="thread_stats_images" title="Images" style="cursor:help;"></span>&nbsp;/&nbsp;<span id="thread_stats_page" title="Page" style="cursor:help;"></span>&nbsp;';
          $('#update_secs').addEventListener('click', function(){        
            $.event('click', {}, $('#update_thread'));
          }, false);
        }
        
        if($('#thread_stats')) $.destroy($('#thread_stats'));
        
        if($$('#update_secs')[1]) $.destroy($$('#update_secs')[1]);
        
        if($('#link-quick-reply')) $.destroy($('#link-quick-reply'));
        
        if($('#thread-links')) $('#thread-links').style.width = '100%';
        
        if($$('#updater')[1]) $$('#updater')[1].style.float = 'right';
        
        if($('.bottom')) $('.bottom').style.display = 'none';
        
        if($('footer')) $('footer').innerHTML = '<p style="margin-top:20px;text-align:center;" class="unimportant"> - 8chan Infinity + 8k v' + version + ' - <br>- Fredrick Brennan - Erin Steph -<br>- All posts on 8chan are the responsibility of the individual poster -</p>';
        
        $.event('click', {}, $('#update_thread'));
        
        $('#b-Expander').addEventListener('click', function(){
          if($('.sub').style.display == 'none'){
            $('.sub').style.display = '';
            $('#b-Expander').innerHTML = '<a style="cursor:pointer;">[ - ]&nbsp;</a>';
          }else{
            $('.sub').style.display = 'none';
            $('#b-Expander').innerHTML = '<a style="cursor:pointer;">[ + ]&nbsp;</a>';
          }          
        }, false);  
        
        if($('[title="Settings"]', d)){
          $('[title="Settings"]', d).addEventListener('click', function(){ 
            $('#stylechooser').addEventListener('change', function(){    
              page.updateStyle();
            }, false);
          }, false);
          page.applyKMenu();
        }
        
        $.time(1000, function(){ k.trackUpdater(false, 0); }, false);
        
      },false);
    }
    if(k.thread != null) qr.xWindow();
    
    qr.dnsbl = function(){
      
      var $dnsBlackout = {};
      $dnsBlackout['id'] = 'kqr-dnsbl-blackout';
      $dnsBlackout['style'] = 'position:fixed;width:100%;height:100%;top:0px;left:0px;background:#000000;opacity:0.6;';
      $dnsBlackout = $.elm('div', $dnsBlackout, db);
      
      var $dnsbox = {};
      $dnsbox['id'] = 'kqr-dnsbl';
      $dnsbox['style'] = 'position:fixed;top:25%;left:50%;margin-left:-115px;display:inline-block;border:1px solid;text-align:center;';
      $dnsbox['class'] = 'default-backdrop';
      $dnsbox = $.elm('div', $dnsbox, db);
      $dnsbox.innerHTML = '<span id="kqr-dnsbl-quit" style="float:left;cursor:pointer;">[X]</span><h2>DNSBLS Bypass</h2><div id="kqr-dnsbl-image" style="background:#FFFFFF;cursor:pointer;"></div><input id="kqr-dnsbl-input" placeholder="Captcha" data-cookie="" style="width:96%;">';
      
      function dnsblLoad(){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", k.proto + '//'+$siteDomain+'/8chan-captcha/entrypoint.php?mode=get&extra=abcdefghijklmnopqrstuvwxyz');
        xhr.onreadystatechange = function(){
          if(xhr.readyState == 4){
            var rx = $.JSON(xhr.responseText);
            $('#kqr-dnsbl-image').innerHTML = rx['captchahtml'];
            $.att($('#kqr-dnsbl-input'), 'data-cookie', rx['cookie']);
            $('#kqr-dnsbl-input').focus();
          }      
        }
        xhr.send();
      }
      
      function dnsblSend(){
        $('img', $('#kqr-dnsbl-image')).style.opacity = '0.2';
        $('#kqr-dnsbl-input').disabled = true;        
        var xhr = new XMLHttpRequest();
        var dnsblData = new FormData();
        dnsblData.append('captcha_text', $('#kqr-dnsbl-input').value);
        dnsblData.append('captcha_cookie', $.att($('#kqr-dnsbl-input'), 'data-cookie'));
        xhr.open("POST", k.proto + '//'+$siteDomain+'/dnsbls_bypass.php');
        xhr.onreadystatechange = function(){
          if(xhr.readyState == 4){
            var rx = xhr.responseText;
            if(rx.indexOf('<h1>Error</h1>') > 0){
              $('#kqr-dnsbl-input').disabled = false;
              $('#kqr-dnsbl-input').value = '';
              $.att($('#kqr-dnsbl-input'), 'placeholder', 'Try again...');
              $('#kqr-dnsbl-input').focus();
              dnsblLoad();
            }else{
              $.destroy($('#kqr-dnsbl-blackout'));
              $.destroy($('#kqr-dnsbl'));
              $('#kqr-postbutton').focus();
            }
          }      
        }
        xhr.send(dnsblData);
      }
      
      function dnsblQuit(){
        $.destroy($('#kqr-dnsbl-blackout'));
        $.destroy($('#kqr-dnsbl'));
        $('#kqr-postbutton').focus();
      }
      
      $('#kqr-dnsbl-quit').addEventListener('click', dnsblQuit, false);
      
      $('#kqr-dnsbl-image').addEventListener('click', function(){
        $('img', $('#kqr-dnsbl-image')).style.opacity = '0.2';
        $('#kqr-dnsbl-input').disabled = false;
        $('#kqr-dnsbl-input').value = '';
        $('#kqr-dnsbl-input').focus();   
        dnsblLoad();
      }, false);
      
      $('#kqr-dnsbl-input').addEventListener("keypress", function(e){
        if(e.keyCode == 13){
          dnsblSend();
        }
      }, false);
      
      
      dnsblLoad();
      
    }
    
    qr.contextMenu = function(){
      $.att($('.thread'), 'contextmenu', 'kqr-contextMenu');
      var $contextMenu = {};
      $contextMenu['type'] = 'context';
      $contextMenu['id'] = 'kqr-contextMenu';
      $contextMenu = $.elm('menu', $contextMenu, db);
      $contextMenu.innerHTML = '<menuitem id="kqr-tripcodeThis" label="Select #key to show !trip"></menuitem><menuitem id="kqr-greentextThis" label="Greentext This" icon="' + k.asset.memearrow + '"></menuitem>';      
      $('.thread').addEventListener('contextmenu', function(){
        if($.getSelected() != ''){
          $('#kqr-greentextThis').disabled = false;
          $('#kqr-tripcodeThis').disabled = true;
          $('#kqr-tripcodeThis').style.display = 'none';
          if($.getSelected().length < 18){
            if($.getSelected()[0] == '#'){
              $('#kqr-tripcodeThis').disabled = false;
              $.att($('#kqr-tripcodeThis'), 'label', $.getSelected() + ' > ' + $.stripTags(validateTrip($.getSelected()))); 
              $('#kqr-tripcodeThis').style.display = '';
            }
            $.att($('#kqr-greentextThis'), 'label', 'Greentext "' + $.getSelected() + '"');
          }else{
            $.att($('#kqr-greentextThis'), 'label', 'Greentext "' + $.getSelected().substring(0, 15)  + '..."');
          }
        }else{
          $('#kqr-greentextThis').disabled = true;  
          $('#kqr-tripcodeThis').disabled = true;
          $('#kqr-tripcodeThis').style.display = 'none';
          $.att($('#kqr-greentextThis'), 'label', 'Greentext Selected');
        }        
      }, false);     
      $('#kqr-greentextThis').addEventListener('click', function(){
        if($.getSelected() != ''){
          $.onCursor($('#kqr-comment'), '>' + $.getSelected().replace(/\n\n/g, '\n').replace(/\n/g, '\n>') + '\n');
          qr.main.style.display = "";
          $('#kqr-comment').focus();
        }
      }, false);    
      $('#kqr-tripcodeThis').addEventListener('click', function(){
        if($.getSelected() != ''){
          $.onCursor($('#kqr-comment'), $.getSelected() + ' > ' + $.stripTags(validateTrip($.getSelected())) + '\n');
          qr.main.style.display = "";
          $('#kqr-comment').focus();
        }
      }, false);   
    }
    if(k.contexts == true){
      qr.contextMenu();      
    }
    
    qr.quote = function(n){
      qr.main.style.display = "";
      if($.getSelected() != ''){ 
        $.onCursor($('#kqr-comment'), '>>' + n + '\n>' 
           + $.getSelected().replace(/\n\n/g, '\n').replace(/\n/g, '\n>') 
           + '\n'); 
      }else{
        $.onCursor($('#kqr-comment'), '>>' + n + '\n');        
      }
      $('#kqr-comment').focus();
    }

    $.css('#quick-reply{display:none !important;}');
    
    qr.hideStaticForm = function(){
      $('[name="post"]').style.display = "none";
      var $expandForm = {};
      $expandForm['id'] = 'expandForm';
      $expandForm['type'] = 'button';
      $expandForm = $.elm('button', $expandForm, $('.board-settings'));
      $expandForm.innerHTML = 'Toggle Post Form';
      $expandForm.addEventListener('click',function(){
        if($('[name="post"]').style.display == "none"){
          $('[name="post"]').style.display = "";
        }else{
          $('[name="post"]').style.display = "none";
        }
        
      }, false);
      
    }
    qr.hideStaticForm();
    
    qr.addFileSauce = function(){
      $.each($$('.fileinfo'), function(c, i){
        if(!$('.kqr-filesauce', c)){
          var ti = {};
          ti.un = $('.unimportant', c);
          if($.att($('a', ti.un),'href').indexOf('media.') < 0){
            ti.l = 'http://8ch.net' + $.att($('a', ti.un),'href');
          }else{
            ti.l = $.att($('a', ti.un),'href');
          }
          ti.regex = '<a title="Check EXIF data on regex.info" href="http://exif.regex.info/exif.cgi?imgurl=' + encodeURIComponent(ti.l) + '" target="_blank">exif</a>';
          ti.google = '<a title="Reverse Image Search on Google" href="https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(ti.l) + '" target="_blank">google</a>';
          ti.iqdb = '<a title="Reverse Image Search on iqdb" href="http://iqdb.org/?url=' + encodeURIComponent(ti.l) + '" target="_blank">iqdb</a>';
          ti.tar = {};
          ti.tar['class'] = 'kqr-filesauce';
          ti.tar = $.elm('span', ti.tar, ti.un);
          $.htm(ti.tar, ' [' + ti.google + '/' + ti.regex + '/' + ti.iqdb + ']');
        }
      });           
    }
    
    qr.parseQuotes = function(){
      $.each($$('a'), function(c, i){
        if(c.className == 'post_no'){
          if($.att(c, 'k8') != 'passed'){
            if(c.id.indexOf('no') < 2){
            /*  if(k.contexts == true){
                qr.pokeMenu(c.innerHTML);
              } */
              c.onClick = function(e){ 
                e.preventDefault();
                e.stopPropagation();
              }
              c.addEventListener('click', function(e){ 
                e.preventDefault();
                e.stopPropagation();               
                qr.quote(c.innerHTML); 
              }, false);
              $.att(c, 'k8', 'passed');
            }
          }
        }else if($.att(c, 'You') != 'marked' && c.title != "Reply to this post"){
          if(setting.recent.indexOf(c.href.split('.html#')[1]) > 0 && $.getVal('kqr.umrk', 'true') == 'true'){
            $.att(c, 'You', 'marked');
            var y = {};
            y['class'] = 'kqr-you';
            y = $.after($.elm('span', y), c);
            y.innerHTML = '&nbsp;(You) ';
            var xcc = c.parentNode.parentNode;
            if($.att(c, 'href').indexOf('#') > 2 && $.getVal('desknt', 'true') == 'true'){
              if(xcc.parentNode.className.indexOf('has-file') > 0){
                if($.att($('.post-image', xcc.parentNode), 'src').indexOf('.jpg') > 0){
                  var fth = $.att($('.post-image', xcc.parentNode), 'src');  
                }else{
                  var fth = null;
                }
              }else{
                var fth = null;
              }
              var spawnNote = qr.notify('Mentioned in /' + k.board + '/' + k.thread,  $.stripMore($.stripTags($.parLines(xcc.innerHTML.split('(You)')[1]))), fth);
              if($.getVal('kqr.noteTime', '0') != '0'){
                $.time(($.getVal('kqr.noteTime')*1000), function(){ spawnNote.close.bind(spawnNote); },false);                
              }
              if($.getVal('kqr.noteAudio', 'false') != 'false'){
                qr.playAlert();
              }
              spawnNote.onclick = function(){ $.elmJump(xcc); };
            }
          }
        }else if(c.title == "Reply to this post"){
          if($.att(c, 'k8') != 'passed'){
            if(c.id.indexOf('no') < 2){
              c.onClick = function(e){ 
                e.preventDefault();
                e.stopPropagation();
              }
              c.addEventListener('click', function(e){ 
                e.preventDefault();
                e.stopPropagation();
                qr.quote(c.innerHTML); 
              }, false);

              $.att(c, 'k8', 'passed');
            }
          }
        }
      });
      if($.getVal('kqr.addSauce', 'true') == 'true'){
        qr.addFileSauce();
      }
    }

    $.time(500, qr.parseQuotes, false);
        

    d.addEventListener('threadUpdate', function(e){ 
      if($('#newCounter') && e.detail.count && e.detail.count > 0){
        $('#newCounter').innerHTML = '+' + e.detail.count;
        $.time(1500, function(){ 
          $('#newCounter').innerHTML = '';
        }, false); 
      }
      $.time(200, function(){ qr.parseQuotes(); }, false); 
      $.time(700, function(){ qr.parseQuotes(); }, false); 
      $.time(1600, function(){ qr.parseQuotes(); }, false);
    }, false);

    qr.send = function(){
      
      var storedTitle = d.title;
      
      d.title = '/' + k.board + '/ - Posting...';

      $.htm($('#kqr-postbutton'), 'Posting...');
      
      $('#kqr-comment').disabled = true;
      $('#kqr-captcha-input').disabled = true;

      var formData = new FormData();
      formData.append('json_response', '0');
      formData.append('post', $('input[type="submit"]', $('form[name="post"]')).value);
      formData.append("board", k.board);
      if(k.thread != 'index' && k.thread != 'catalog'  && k.thread != 'mod' && k.makeOP != true){ 
        formData.append("thread", k.thread); 
      }
      if($('#kqr-read').checked != true){
        formData.append("name", $('#kqr-name').value);
        formData.append("email", $('#kqr-email').value);
        formData.append("subject", $('#kqr-subject').value);
      }
      if($('#kqr-flag').checked == true){
        formData.append("no_country", "on");
      }
      if($('#kqr-sage-check').checked == true){
        formData.append("no-bump", "on");
      }
      if($('#kqr-dice-d').value != ''){
        formData.append("dx", $('#kqr-dice-d').value);
        formData.append("dy", $('#kqr-dice-y').value);
        formData.append("dz", $('#kqr-dice-m').value);
      }
      
      formData.append("body", $('#kqr-comment').value);
      if(qr.upEmbed == true){ 
        formData.append("embed", $('#kqr-embedinput').value); 
      }else{
        formData.append("file", $("#kqr-fileinput").files[0]);
        formData.append("file2", $("#kqr-fileinput").files[1]);
        formData.append("file3", $("#kqr-fileinput").files[2]);
        formData.append("file4", $("#kqr-fileinput").files[3]);
        formData.append("file5", $("#kqr-fileinput").files[4]);
      }
      formData.append("password", $('[name="password"]').value);       
      if($('#kqr-spoil').checked == true){ 
        formData.append("spoiler", "on"); 
      }
      
      if($('#kqr-captcha-input').value != ''){ 
        formData.append("captcha_text", $('#kqr-captcha-input').value); 
        formData.append("captcha_cookie", $.att($('#kqr-captcha-input'), 'data-cookie'));
      }

      var xhr = new XMLHttpRequest();

      xhr.open("POST", k.proto + '//sys.'+$siteDomain+'/post.php');

      qr.abort = function(){
        xhr.abort();
        delete formData;
        delete xhr;
        $.event('refresh-captcha', {}, d);
        $('#kqr-postbutton').removeEventListener("click", qr.abort, false);
        $.htm($('#kqr-postbutton'), 'Aborted');
        $('#kqr-comment').disabled = false;
        $('#kqr-captcha-input').disabled = false;
        d.title = storedTitle;
        $('#kqr-postbutton').addEventListener("click", qr.send, false);
      }      

      $('#kqr-postbutton').removeEventListener("click", qr.send, false);
      $('#kqr-postbutton').addEventListener("click", qr.abort, false);

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          $.event('refresh-captcha', {}, d);
          if(xhr.status != 200 && xhr.status > 100){
            if($.getVal('autoError', 'true') == 'true'){
              qr.flashRed();
              qr.send();
            }else{
              alert('Error ' + xhr.status + ': ' + xhr.statusText + '. Please try again.');
              $.htm($('#kqr-postbutton'), 'Try Again');
              d.title = '/' + k.board + '/ - Failed!';
              $.time(1500, function(){ d.title = storedTitle; }, false);
              $('#kqr-postbutton').removeEventListener("click", qr.abort, false);
              $('#kqr-postbutton').addEventListener("click", qr.send, false);
              $('#kqr-comment').disabled = false;
              $('#kqr-captcha-input').disabled = false;
              qr.flashRed();
            }           
          }else{
            var re = $.JSON(xhr.responseText.replace('true|', '"true,",').replace('false|', '"false,",')); 
            var reb = $.JSON(xhr.responseText.replace('true|', '"true",').replace('false|', '"false",'));
            console.log(re);
            if(re.hasOwnProperty('error') || reb.hasOwnProperty('captcha')){   
              if(reb['captcha'] == 'true'){
                qr.dnsbl();
                qr.abort();
              }
              if(re['error'].indexOf('dnsbls_bypass.php') > 0){
                qr.dnsbl();
                qr.abort();
              }else{
                alert(re['error']);
                qr.abort();
              }
              $.htm($('#kqr-postbutton'), 'Try Again');
              d.title = '/' + k.board + '/ - Failed!';
              $.time(1500, function(){ d.title = storedTitle; }, false);
              //$('#kqr-postbutton').removeEventListener("click", qr.abort, false);
              //$('#kqr-postbutton').addEventListener("click", qr.send, false);
              //$('#kqr-comment').disabled = false;
              //$('#kqr-captcha-input').disabled = false;
              qr.flashRed();
            }else{
              if(xhr.status == 200){
                qr.flashGreen();
              }else{
                qr.flashRed();              
              }
              setting.recent = $.JSON($.getVal('recent', '[]'));
              setting.recent.push(re['id']);
              setting.recent.splice(0, setting.recent.length-400);
              $.setVal('recent', $.JSON(setting.recent));
              $('#kqr-comment').disabled = false;
              $('#kqr-captcha-input').disabled = false;
              $('#kqr-comment').value = '';
              $('#kqr-embedinput').value = '';
              $('#kqr-dice-d').value = '';
              $('#kqr-dice-y').value = '';
              $('#kqr-dice-m').value = '';
              qr.clearFile();
              $.htm($('#kqr-postbutton'), 'Post');
              d.title = '/' + k.board + '/ - Posted!';
              $.time(1500, function(){ d.title = storedTitle; }, false);
              $('#kqr-postbutton').removeEventListener("click", qr.abort, false);
              $('#kqr-postbutton').addEventListener("click", qr.send, false);
              $.event('ajax_after_post', re);
              var e = {};
              e.detail = {};
              e.detail['board'] = k.board;
              e.detail['thread'] = k.thread;
              e.detail['no'] = re['id'];
              $.event('kPostPush', e, d);           
              if(k.makeOP == true){
                window.location.href = k.proto + '//'+$siteDomain+'/' + k.board + '/res/' + re.id + '.html';
              }
              $.time(500, function(){ 
                $.event('click', {}, $('#update_thread')); 
                var isChromium = window.chrome;
                if(isChromium){                
                  /*function getPositionY(elementY){
                    var elyPosition = 0;
                    while(elementY){
                      elyPosition += (elementY.offsetTop - elementY.scrollTop + elementY.clientTop);
                      elementY = elementY.offsetParent;
                    }
                    return elyPosition;
                  }
                  window.scrollTo(0,getPositionY(document.getElementById("reply_" + re['id'])));  */               
                  window.scrollTo(0,document.body.scrollHeight);
                } 
              }, false);                 
            }
          }
        }
      }

      function updateProgress(e){
        if (e.lengthComputable){
          var percentComplete = parseInt((e.loaded / e.total)*100).toFixed(0);
          if(percentComplete > 100) percentComplete = 100;
          $.htm($('#kqr-postbutton'), percentComplete + '%');
          d.title = '/' + k.board + '/ - ' + percentComplete + '%';
        }else{
          $.htm($('#kqr-postbutton'), 'unknown %');
        }
      }
      xhr.upload.addEventListener("progress", updateProgress, false); 

      xhr.send(formData);

    };
    
    $('#kqr-postbutton').addEventListener("click", qr.send, false);
    
    $('#kqr-captcha-input').addEventListener("keypress", function(e){
      if(e.keyCode == 13){
        qr.send();
      }
    }, false);
                                            
  };  

  $.css('#new-bottom-ads{display:none !important;}');
  $.css('#s-bottom-ad{display:none !important;}');

  /*------------------------------------------*/
  
  if(k.board != null && k.thread != null) qr.spawn(); 

}
chanK();