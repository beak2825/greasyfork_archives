// ==UserScript==
// @name         BT magnet generate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BT magnet generate .
// @author       sdfsung
// @run-at       document-idle
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @match        http://cilibao.biz/s/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/402463/BT%20magnet%20generate.user.js
// @updateURL https://update.greasyfork.org/scripts/402463/BT%20magnet%20generate.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const getKeyword = function(link) {
    const encodeKeyword = link.split('/');
    const keyword = decodeURI(encodeKeyword.pop().replace(/(_rel_\d+)?\.html$/i, '')).replace(/\+/g, ' ');
    return keyword;
  };

  const url = window.location.href;
  const keyword = getKeyword(url);
  console.log(keyword);
  const arrKeyword = keyword.split(/\s+/);
  const reg = new RegExp(arrKeyword.join('.{0,5}?'), 'i');
  const keyword_len = arrKeyword.length;

  waitForKeyElements('div.search-list div.search-item', jNode => {
    const itemNode = jNode[0];
    const linkNode = itemNode.querySelector('a');
    const url = linkNode.href;
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onreadystatechange: function(o) {
        if (o.readyState === 4 && o.status === 200) {
          console.log(url);
          // console.log(o.responseText);
          const match = o.responseText.match(/href="(magnet:\?xt=[\s\S]+?)"/);
          if (match) {
            const magnet = match[1];

            let text = linkNode.innerText;

            if (reg.test(text)) {
              for (let i = 0; i < keyword_len; i++) {
                text = text.replace(
                  new RegExp(arrKeyword[i], 'i'),
                  p1 => '<span class="keyword_highlight">' + p1 + '</span>'
                );
              }
            }


            let btn = document.createElement('button');
            btn.innerText = '☰';
            btn.onclick = function(e) {
              performTkTask('*downloadMagnetViaXEngineInHeikeiyunApp', magnet, keyword);
              this.style.visibility = 'hidden';
              console.log('aaa');
              e.stopPropagation();
            };

            insertBefore(btn, linkNode)
            linkNode.innerHTML = ' * ' + text;
            console.log(text);
            itemNode.onclick = function(e) {
               performTkTask('*downloadMagnetViaLinkClick', keyword, magnet);
              console.log(url);
              console.log(magnet);
              e.stopPropagation();
              linkNode.style.textDecoration = 'line-through';
              return false;
            };
          }
        }
      },
    });
  });

  function insertAfter( newElement, targetElement ){
    var parent = targetElement.parentNode;
    if( parent.lastChild == targetElement ){
      parent.appendChild( newElement, targetElement );
    }else{
      parent.insertBefore( newElement, targetElement.nextSibling );
    };
  };

  function insertBefore( newElement, targetElement ){
    var parent = targetElement.parentNode;
    parent.insertBefore(newElement, targetElement);
  };

  const performTkTask = function(taskName, par1, par2) {
    let cmd = taskName;
    if (par1) cmd += '=:=' + par1;
    if (par2) cmd += '=:=' + par2;
    console.log(cmd);
    cmd = cmd.replace(/&/g, '| |');

    const server = 'http://172.16.0.21:8765';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', server, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('title=Remote Command&command=' + cmd);
    // document.getElementsByTagName('body')[0].innerHTML = cmd;
  };

  const addNewStyle = function(newStyle) {
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.id = 'styles_js';
      document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
  }

  addNewStyle('.keyword_highlight {color: red;}');
  addNewStyle('.menu {visibility: hidden;}figure:active .menu,figure:focus .menu {visibility: visible;}');
})();
