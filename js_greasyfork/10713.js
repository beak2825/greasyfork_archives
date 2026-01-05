// ==UserScript==
// @name        PepeAlert
// @name:ar        PepeAlert
// @name:cs        PepeAlert
// @namespace   pepe.alert
// @description REEEEEEE! Find out who's been stealing your rare pepes, this script adds a quote link to posts that re-upload images you've seen in the past
// @description:ar        PepeAlesrt
// @description:cs        PepeAlsert
// @include     *boards.4chan.org*
// @version     6
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/10713/PepeAlert.user.js
// @updateURL https://update.greasyfork.org/scripts/10713/PepeAlert.meta.js
// ==/UserScript==
var e_thrPosts = document.querySelectorAll('.board .thread .post');
if (e_thrPosts.length > 0) {
  var defaultColors = [
    '#00ffff',
    '#f0ffff',
    '#f5f5dc',
    '#000000',
    '#0000ff',
    '#a52a2a',
    '#00ffff',
    '#00008b',
    '#008b8b',
    '#a9a9a9',
    '#006400',
    '#bdb76b',
    '#8b008b',
    '#556b2f',
    '#ff8c00',
    '#9932cc',
    '#8b0000',
    '#e9967a',
    '#9400d3',
    '#ff00ff',
    '#ffd700',
    '#008000',
    '#4b0082',
    '#f0e68c',
    '#add8e6',
    '#e0ffff',
    '#90ee90',
    '#d3d3d3',
    '#ffb6c1',
    '#ffffe0',
    '#00ff00',
    '#ff00ff',
    '#800000',
    '#000080',
    '#808000',
    '#ffa500',
    '#ffc0cb',
    '#800080',
    '#800080',
    '#ff0000',
    '#c0c0c0',
    '#ffffff',
    '#ffff00'
  ];
  var colors = JSON.parse(GM_getValue('colors') || JSON.stringify(defaultColors));
  var postLifeDays = 1;
  var regId = function (e_Post) {
    var board = window.location.href.match(/4chan.org(\/.*\/)thread/) [1];
    var threadId = e_Post.parentElement.parentElement.id.substr(1);
    var postId = e_Post.id.substr(1);
    var btpId = board + 'thread/' + threadId + '#p' + postId;
    var e_Img = e_Post.querySelector('a > img');
    if (e_Img && e_Img.attributes['data-md5'].value) {
      if (!(e_Img.attributes['data-md5'].value in idMap)) {
        var posts = {
        };
        posts[btpId] =
        {
          postId: postId,
          threadId: threadId,
          board: board
        };
        idMap[e_Img.attributes['data-md5'].value] =
        {
          date: new Date(),
          src: e_Img.src,
          posts: posts
        };
      } else {
        var now = new Date();
        var postDate = idMap[e_Img.attributes['data-md5'].value].date;
        var maxDate = new Date();
        maxDate.setDate(new Date(postDate).getDate() + postLifeDays);
        if (now > maxDate) {
          var id;
          for (id in idMap) {
            postDate = idMap[id].date;
            maxDate = new Date();
            maxDate.setDate(new Date(postDate).getDate() + postLifeDays);
            if (now > maxDate) {
              colors.push(e_Img.attributes['data-md5'].color);
              delete e_Img.attributes['data-md5'];
            }
          }
        } else {
          var src = idMap[e_Img.attributes['data-md5'].value].src;
          if (e_Img.src != src && !(btpId in idMap[e_Img.attributes['data-md5'].value].posts)) {
            var color;
            if (colors.length > 0) {
              color = colors.splice(0, 1) [0];
            } else {
              color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            }
            idMap[e_Img.attributes['data-md5'].value].date = new Date();
            idMap[e_Img.attributes['data-md5'].value].color = color;
            idMap[e_Img.attributes['data-md5'].value].posts[btpId] =
            {
              date: new Date(),
              postId: postId,
              threadId: threadId,
              board: board
            };
          }
          var otherBtpId;
          for (otherBtpId in idMap[e_Img.attributes['data-md5'].value].posts) {
            var post = idMap[e_Img.attributes['data-md5'].value].posts[otherBtpId];
            postDate = post.date;
            maxDate = new Date();
            maxDate.setDate(new Date(postDate).getDate() + postLifeDays);
            if (now > maxDate) {
              delete idMap[e_Img.attributes['data-md5'].value].posts[otherBtpId];
            } else {
              if (btpId != otherBtpId) {
                var info = e_Post.querySelector('.postInfo');
                var bls = info.querySelector('.backlink');
                if (!bls) {
                  bls = document.createElement('div');
                  bls.className = 'backlink';
                  bls.id = 'bl_' + post.postId;
                  info.appendChild(bls);
                }
                var a = document.createElement('a');
                a.className = 'quotelink';
                a.textContent = '>>>' + post.board + post.postId;
                a.href = otherBtpId;
                var sp = document.createElement('span');
                sp.appendChild(a);
                sp.appendChild(document.createTextNode(' '));
                bls.appendChild(sp);
                color = idMap[e_Img.attributes['data-md5'].value].color;
                a.style = 'color: ' + color + ' !important;';
              }
            }
          }
        }
      }
    }
  }
  var idMap = JSON.parse(GM_getValue('idMap') || '{}');
  var i;
  for (i = 0; i < e_thrPosts.length; i++) {
    regId(e_thrPosts[i]);
  }
  GM_setValue('idMap', JSON.stringify(idMap));
  GM_setValue('colors', JSON.stringify(colors));
}

