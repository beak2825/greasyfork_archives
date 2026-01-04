// ==UserScript==
// @name         FXP Account Switcher
// @namespace    http://pa0neix.github.io/
// @version      1.2
// @description  switch users on כספ
// @author       pnx <pa0neix@gmail.com>
// @match        https://www.fxp.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32876/FXP%20Account%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/32876/FXP%20Account%20Switcher.meta.js
// ==/UserScript==

function xhr(ARG) {
  var xhttp = new XMLHttpRequest();
  if (ARG['type'])
    xhttp.responseType = ARG['type'];
  xhttp.addEventListener('readystatechange', function () {
  if (xhttp.status == 200 && xhttp.readyState == 4 && ARG['func'])
    ARG['func'](xhttp);
  });
  xhttp.open(ARG['method'], ARG['url'], ARG['async'] ? ARG['async'] : ARG['method'] == 'GET' ? true : false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  if (ARG['payload']) {
    var data = '';
    Object.keys(ARG['payload']).forEach(function (e, i) {
      data += e + '=' + Object.values(ARG['payload'])[i] + (Object.keys(ARG['payload']).length - 1 == i ? '' : '&');
    });
  }
  xhttp.send(ARG['payload'] ? data: null);
}

var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

function relog(u,p) {
  function __login() {
    xhr({
      method: 'post',
      url: 'https://www.fxp.co.il/login.php?do=login',
      async: true,
      payload: {
        do:'login',
        vb_login_md5password:p,
        vb_login_md5password_utf:p,
        s:null,
        securitytoken:SECURITYTOKEN,
        url:'https://www.fxp.co.il/index.php',
        vb_login_username:u,
        vb_login_password:null,
        cookieuser:1
      },
      func: function(e) {
        location.reload();
      }
    });
  }
  if(SECURITYTOKEN == 'guest') __login();
  else {
    xhr({
      method: 'post',
      url: 'https://www.fxp.co.il/login.php?do=logout&logouthash='+SECURITYTOKEN,
      async: true,
      func: function(e) {
        __login();
      }
    });
  }

}

var mul = {
  get: function() {
    if(!localStorage['mul']) localStorage['mul'] = '[]';
    return JSON.parse(localStorage['mul']);
  },
  add: function() {
    var u = prompt('הכנס שם משתמש');
    if(!u) return;
    var x = mul.get();
    if(x.length) {
      x.forEach(function(e, i) {
        if(e.user == u) {
          alert('המשתמש הזה כבר קיים ברשימת המשתמשים');
          return mul.add();
        } else if(i == x.length-1 && e.user != u) {
          var p = prompt(`${u} הכנס סיסמה עבור המשתמש`);
          x.push({ user: u, pass: MD5(p) });
          localStorage['mul'] = JSON.stringify(x);
          __setupList();
        }
      });
    } else {
      var p = prompt(`${u} הכנס סיסמה עבור המשתמש`);
      x.push({ user: u, pass: MD5(p) });
      localStorage['mul'] = JSON.stringify(x);
      __setupList();
    }
  },
  remove: function() {
    var u = prompt('הכנס שם משתמש כדי להסירו');
    if(!u) return;
    var m = mul.get();
    var f = false;
    m.forEach(function(e,i) {
      if(e.user == u) {
        m.splice(i, 1);
        f = true;
      }
    });
    if(!f) alert('השם משתמש אינו נמצא ברשימת המשתמשים.');
    localStorage['mul'] = JSON.stringify(m);
    __setupList();
  },
  edit: function() {
    var u = prompt('הכנס שם משתמש בכדי להכנס למצב עריכה');
    if(!u) return;
    var m = mul.get();
    m.find((e,i) => {
      if(e.user == u) {
        var inp = prompt('הקלד "user" כדי לשנות את שם המשתמש\nהקלד "pass" כדי לשנות את הסיסמה של המשתמש');
        switch(inp) {
          case 'user':
          var cng = prompt('הכנס שם משתמש חדש');
          if(cng) {
            m[i].user = cng;
            localStorage['mul'] = JSON.stringify(m);
            __setupList();
          } else alert('invalid input');
          break;
          case 'pass':
          var cng = prompt('הכנס סיסמה חדשה');
          if(cng) {
            m[i].pass = MD5(cng);
            localStorage['mul'] = JSON.stringify(m);
            __setupList();
          } else alert('invalid input');
          break;
          default:
          if(!inp) return;
          else alert('invalid input');
        }
      }
    });
  }
};

var x = document.createElement('select');
x.id = 'uList';
x.className = 'nibba';
document.querySelector('.topbluew').append(x);

function __addItem(text) {
  var y = document.createElement('option');
  y.innerText = text;
  x.append(y);
  return y;
}

function __setupList() {
  var x = document.querySelector('#uList');
  x.innerHTML = '';
  var tmp;
  tmp = __addItem('בחר אופציה');
  tmp.selected = true;
  tmp.disabled = true;
  tmp = __addItem('הוסף משתמש');
  tmp.value = 'C1';
  tmp = __addItem('ערוך משתמש');
  tmp.value = 'C2';
  tmp = __addItem('הסר משתמש');
  tmp.value = 'C3';

  tmp = __addItem('');
  tmp.disabled = true;
  tmp = __addItem('בחר משתמש');
  tmp.disabled = true;

  mul.get().forEach(function(e,i) {
    tmp = __addItem(e.user);
    tmp.value = i;
  });

  var xx = document.createElement('style');
  xx.innerHTML = '#uList { position: absolute; top: 6px; right: 6px; transition: 1s ease; } #uList.nibba { right: -'+x.offsetWidth+'px; }';
  document.head.append(xx);
}
__setupList();

x.addEventListener('change', function(e) {
  var val = x.value;
  if(val.length > 0) {
    //console.log('status changed - ' + val);
    if(val[0] == 'C') {
      console.log(val[1]);
      switch(val[1]) {
        case '1':
        mul.add();
        break;
        case '2':
        mul.edit();
        break;
        case '3':
        mul.remove();
      }
    } else {
      var y = mul.get()[val];
      relog(y.user, y.pass);
    }
  }
});

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 45 || (e.keyCode == 192 && e.shiftKey)) document.querySelector('#uList').classList.toggle('nibba');
});