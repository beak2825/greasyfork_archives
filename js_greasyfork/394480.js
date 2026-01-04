// ==UserScript==
// @name         酷安 Feed 阅读
// @namespace    https://coolapk.com/
// @version      0.1.1
// @description  利用酷安的客户端 API，在无须扫码打开的情况下预览酷安网 Feed 的信息
// @author       duangsuse
// @include      /http(s?):\/\/www.coolapk.com\/feed\/(\d+)/
// @match        https://www.coolapk.com/feed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394480/%E9%85%B7%E5%AE%89%20Feed%20%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394480/%E9%85%B7%E5%AE%89%20Feed%20%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

function currentTimeTms() { return new Date().getTime(); }

function checkFunDep(value, message) {
  if (typeof value !='function')
    throw Error(message);
}

function findFirstParent(elem, predicate) {
  var eln = elem.parentNode;
  do {
    if (predicate(eln))
      return eln;

    eln = eln.parentNode;
  } while (eln != null);
}

// from https://jsfiddle.net/briguy37/2MVFd/
function uuidgen() {
  var tms = currentTimeTms();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (tms + Math.random() * 16) %16 | 0;
    tms = Math.floor(tms /16);
    return (c=='x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// Begin coolToken

function hex(x) {return '0x' + x.toString(16);}

function timestampMd5(ts) {
  checkFunDep(digest, 'MD5 digest algorithm not found');

  var repr = String(ts);
  return digest(repr);
}

function coolToken(_base, appId, uuid, time) {
  checkFunDep(digest, 'MD5 digest algorithm not found');

  var base = _base || 'token://com.coolapk.market/c67ef5943784d09750dcfbb31020f0ab?';
  var aid = appId || 'com.coolapk.market';
  var uuidstr = uuid || '00000000-0000-0000-0000-000000000000';
  var tms = time || Math.floor(currentTimeTms() /1000);

  var salt = base + timestampMd5(tms) + "$" + uuidstr + "&" + aid;

  var saltbase64 = btoa(salt);
  var saltb64md5 = digest(saltbase64);

  var hextime = hex(tms);

  return saltb64md5 + uuidstr + hextime;
}

// End coolToken
function xmlhttp(url, asyncb, method) {
  var req = new XMLHttpRequest();
  req.open(method || 'GET', url, asyncb !=null);

  req.onreadystatechange = function (st) {
    if (req.readyState == XMLHttpRequest.DONE)
      asyncb(req);
  };
  return req;
}
function setheaders(xmlreq, hdrs) {
  hdrs.forEach(function (kv) {
    xmlreq.setRequestHeader(kv[0], kv[1]);
  });
}

function to_a(dom) {
  var result = [];
  for (var xi in Object.keys(dom))
    result.push(dom[xi]);
  return result;
}

cool = {
  detail: function(id) {return 'https://api.coolapk.com/v6/feed/detail?id='+id;}
};

function concat(xs, sep) {
  var seprator = sep || '';
  var result = [];
  xs.forEach(function (x) { result.push(x); });
  return result.join(seprator);
}

/**
 * CoolApk Feed render
 * [title](abbr: info + entityId + length)(href: shareUrl) [share_num]{!=0} [signature] [isXXX]
 * [userInfo]
 * <img>[message_cover]</img>
 * Keywords: [message_keywords]
 * [tags]
 * <quote>[message_brief]</quote>
 * [message]
 * [picArr]
 * [dateline] [lastupdate]
 * [device_title] (abbr: device_name) [device_rom] [fromname](abbr: fromid)
 * 
 * [likenum] / [burynum] / [rank_score]
 * [recent_like_list]
 * [userLikeList]
 * 
 * [recent_hot_reply_ids] [commentnum](abbr: replynum, comment_block_num)
 * [hotReplyRows]
 * 
 * ~> [recent_reply_ids]
 */
var _ = ' ';
function feedRender(model) {
  //console.log(model.message);
  var mesg = document.createElement('p');
  mesg.id = model.entityId;
  mesg.innerHTML = (model.message || '未知消息');

  var title = document.createElement('h2');
  var titleabbr = document.createElement('abbr');
  titleabbr.innerText = model.title || '未知标题';
  titleabbr.title = concat([model.info, _, model.entityId, _, '长度=', model.message_length, ' @次数=', model.at_count]);
  title.appendChild(titleabbr);

  var share = document.createElement('a');
  share.href = model.shareUrl;
  share.innerText = model.share_num ==0? '分享' : model.share_num+' 次外链';

  var widget = document.createElement('div');

  [title, share, mesg].forEach(function (x) {widget.appendChild(x);});
  //console.log(widget);
  return widget;
}

/**
 * CoolApk User model render
 * | [displayUsername]{username != displayUsername} '('[username]')' (href: url) (abbr: level + groupid + uid + status) [admintype]
 * [userAvatar] (src: userAvatar, href: userBigAvatar) | []
 * | [logintime] [regdate]
 */
function userRender(model) {}

function render(trans, destview) {
  if (trans.status !=200) {
    alert(":( Sorry, request to CoolApk API failed with response code " + trans.status + " and body " + trans.response);
  }
  var model = JSON.parse(trans.response);
  var data = model.data;
  console.log(data);
  //console.log(destview);
  destview.appendChild(feedRender(data));
}

function rewrites(container) {
  //alert('rewrite!');

  try {
    to_a(container.children).forEach(function (child) {container.removeChild(child);});
    var currenttok = coolToken();
    //console.log(currenttok);

    var feedid = /coolapk.com\/feed\/(\d+)$/.exec(document.location)[1];
    //console.log(feedid);
    var req = xmlhttp(cool.detail(feedid), function(t){render(t, container);});
    
    var headers = [
      ['X-Requested-With', XMLHttpRequest.name],
      ['X-Sdk-Int', 25],
      ['X-Sdk-Locale', 'zh-CN'],
      ['X-App-Id', 'com.coolapk.market'],
      ['X-App-Version', '9.0.2'],
      ['X-App-Code', 1902151],
      ['X-App-Token', coolToken()]
    ];

    setheaders(req, headers);
    req.send(null);

  } catch (e) { container.appendChild(document.createTextNode(e +'@'+ e.lineNumber)); }
}

function main() {
  var dbtn = document.querySelector('.download_button');
  //dbtn.innerHTML = 'GO';

  var container = findFirstParent(dbtn, function (e) {return /*e.style.textAlign ==='center'*/ e.classList.contains('msg_box');});
  var dbtnc = findFirstParent(dbtn, function (e) {return e.tagName ==='DIV';});

  var btntext = document.createTextNode('Preview Feed');
  var rewrite = document.createElement('a');
  rewrite.classList.add('header-developer');
  
  var btx = document.createElement('span');
  btx.appendChild(btntext);
  rewrite.appendChild(btx);

  container.appendChild(document.createElement('br'));
  container.appendChild(rewrite);

  rewrite.onclick = function(){rewrites(container);};
}

//document.addEventListener('DOMContentLoaded', main);
main();

/// Dependency https://github.com/solderjs/jsMD5

function digestn(M) {
  var originalLength, i, j, k, l, A, B, C, D, AA, BB, CC, DD, X, rval;

  function F(x, y, z) {
    return (x & y) | (~x & z);
  }

  function G(x, y, z) {
    return (x & z) | (y & ~z);
  }

  function H(x, y, z) {
    return x ^ y ^ z;
  }

  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function to4bytes(n) {
    return [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
  }

  originalLength = M.length; // for Step.2

  // 3.1 Step 1. Append Padding Bits
  M.push(0x80);
  l = (56 - M.length) & 0x3f;
  for (i = 0; i < l; i++)
    M.push(0);

  // 3.2 Step 2. Append Length
  to4bytes(8 * originalLength).forEach(function (e) {
    M.push(e);
  });
  [0, 0, 0, 0].forEach(function (e) {
    M.push(e);
  });

  // 3.3 Step 3. Initialize MD Buffer
  A = [0x67452301];
  B = [0xefcdab89];
  C = [0x98badcfe];
  D = [0x10325476];

  // 3.4 Step 4. Process Message in 16-Word Blocks
  function rounds(a, b, c, d, k, s, t, f) {
    a[0] += f(b[0], c[0], d[0]) + X[k] + t;
    a[0] = ((a[0] << s) | (a[0] >>> (32 - s)));
    a[0] += b[0];
  }

  for (i = 0; i < M.length; i += 64) {
    X = [];
    for (j = 0; j < 64; j += 4) {
      k = i + j;
      X.push(M[k] | (M[k + 1] << 8) | (M[k + 2] << 16) | (M[k + 3] << 24));
    }
    AA = A[0];
    BB = B[0];
    CC = C[0];
    DD = D[0];

    // Round 1.
    rounds(A, B, C, D, 0, 7, 0xd76aa478, F);
    rounds(D, A, B, C, 1, 12, 0xe8c7b756, F);
    rounds(C, D, A, B, 2, 17, 0x242070db, F);
    rounds(B, C, D, A, 3, 22, 0xc1bdceee, F);
    rounds(A, B, C, D, 4, 7, 0xf57c0faf, F);
    rounds(D, A, B, C, 5, 12, 0x4787c62a, F);
    rounds(C, D, A, B, 6, 17, 0xa8304613, F);
    rounds(B, C, D, A, 7, 22, 0xfd469501, F);
    rounds(A, B, C, D, 8, 7, 0x698098d8, F);
    rounds(D, A, B, C, 9, 12, 0x8b44f7af, F);
    rounds(C, D, A, B, 10, 17, 0xffff5bb1, F);
    rounds(B, C, D, A, 11, 22, 0x895cd7be, F);
    rounds(A, B, C, D, 12, 7, 0x6b901122, F);
    rounds(D, A, B, C, 13, 12, 0xfd987193, F);
    rounds(C, D, A, B, 14, 17, 0xa679438e, F);
    rounds(B, C, D, A, 15, 22, 0x49b40821, F);

    // Round 2.
    rounds(A, B, C, D, 1, 5, 0xf61e2562, G);
    rounds(D, A, B, C, 6, 9, 0xc040b340, G);
    rounds(C, D, A, B, 11, 14, 0x265e5a51, G);
    rounds(B, C, D, A, 0, 20, 0xe9b6c7aa, G);
    rounds(A, B, C, D, 5, 5, 0xd62f105d, G);
    rounds(D, A, B, C, 10, 9, 0x02441453, G);
    rounds(C, D, A, B, 15, 14, 0xd8a1e681, G);
    rounds(B, C, D, A, 4, 20, 0xe7d3fbc8, G);
    rounds(A, B, C, D, 9, 5, 0x21e1cde6, G);
    rounds(D, A, B, C, 14, 9, 0xc33707d6, G);
    rounds(C, D, A, B, 3, 14, 0xf4d50d87, G);
    rounds(B, C, D, A, 8, 20, 0x455a14ed, G);
    rounds(A, B, C, D, 13, 5, 0xa9e3e905, G);
    rounds(D, A, B, C, 2, 9, 0xfcefa3f8, G);
    rounds(C, D, A, B, 7, 14, 0x676f02d9, G);
    rounds(B, C, D, A, 12, 20, 0x8d2a4c8a, G);

    // Round 3.
    rounds(A, B, C, D, 5, 4, 0xfffa3942, H);
    rounds(D, A, B, C, 8, 11, 0x8771f681, H);
    rounds(C, D, A, B, 11, 16, 0x6d9d6122, H);
    rounds(B, C, D, A, 14, 23, 0xfde5380c, H);
    rounds(A, B, C, D, 1, 4, 0xa4beea44, H);
    rounds(D, A, B, C, 4, 11, 0x4bdecfa9, H);
    rounds(C, D, A, B, 7, 16, 0xf6bb4b60, H);
    rounds(B, C, D, A, 10, 23, 0xbebfbc70, H);
    rounds(A, B, C, D, 13, 4, 0x289b7ec6, H);
    rounds(D, A, B, C, 0, 11, 0xeaa127fa, H);
    rounds(C, D, A, B, 3, 16, 0xd4ef3085, H);
    rounds(B, C, D, A, 6, 23, 0x04881d05, H);
    rounds(A, B, C, D, 9, 4, 0xd9d4d039, H);
    rounds(D, A, B, C, 12, 11, 0xe6db99e5, H);
    rounds(C, D, A, B, 15, 16, 0x1fa27cf8, H);
    rounds(B, C, D, A, 2, 23, 0xc4ac5665, H);

    // Round 4.
    rounds(A, B, C, D, 0, 6, 0xf4292244, I);
    rounds(D, A, B, C, 7, 10, 0x432aff97, I);
    rounds(C, D, A, B, 14, 15, 0xab9423a7, I);
    rounds(B, C, D, A, 5, 21, 0xfc93a039, I);
    rounds(A, B, C, D, 12, 6, 0x655b59c3, I);
    rounds(D, A, B, C, 3, 10, 0x8f0ccc92, I);
    rounds(C, D, A, B, 10, 15, 0xffeff47d, I);
    rounds(B, C, D, A, 1, 21, 0x85845dd1, I);
    rounds(A, B, C, D, 8, 6, 0x6fa87e4f, I);
    rounds(D, A, B, C, 15, 10, 0xfe2ce6e0, I);
    rounds(C, D, A, B, 6, 15, 0xa3014314, I);
    rounds(B, C, D, A, 13, 21, 0x4e0811a1, I);
    rounds(A, B, C, D, 4, 6, 0xf7537e82, I);
    rounds(D, A, B, C, 11, 10, 0xbd3af235, I);
    rounds(C, D, A, B, 2, 15, 0x2ad7d2bb, I);
    rounds(B, C, D, A, 9, 21, 0xeb86d391, I);

    A[0] += AA;
    B[0] += BB;
    C[0] += CC;
    D[0] += DD;
  }

  rval = [];
  to4bytes(A[0]).forEach(function (e) {
    rval.push(e);
  });
  to4bytes(B[0]).forEach(function (e) {
    rval.push(e);
  });
  to4bytes(C[0]).forEach(function (e) {
    rval.push(e);
  });
  to4bytes(D[0]).forEach(function (e) {
    rval.push(e);
  });

  return rval;
}
function digest(s) {
  var M = [],
    i, d, rstr, s;

  for (i = 0; i < s.length; i++)
    M.push(s.charCodeAt(i));

  d = digestn(M);
  rstr = '';

  d.forEach(function (e) {
    s = e.toString(16);
    while (s.length < 2)
      s = '0' + s;
    rstr += s;
  });

  return rstr;
}