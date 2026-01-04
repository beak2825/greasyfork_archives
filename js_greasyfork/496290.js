// ==UserScript==
// @name         69shu2
// @namespace    http://tampermonkey.net/
// @version      2024-03-24
// @description  for 69shu easy!
// @author       You
// @match        https://www.69shuba.pro/txt/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496290/69shu2.user.js
// @updateURL https://update.greasyfork.org/scripts/496290/69shu2.meta.js
// ==/UserScript==

(function() {
  var btn = document.createElement('button');
  btn.textContent = 'Next';
  document.body.append(btn);
  btn.onclick = function() {
    fetch(document.body.querySelector('.page1 > a:last-child').href)
      .then(b => {
        if (!b.ok) return alert('Error');
        return b.arrayBuffer();
      })
      .then(b => {
        g = new DOMParser().parseFromString(new TextDecoder('GBK').decode(b), "text/html")
        document.body.innerHTML = g;
        var rrd = document.createElement('div');
        rrd.append(document.querySelector('.page1'));
        const $q1 = document.querySelector.bind(document),
          $q2 = document.querySelectorAll.bind(document),
          rs1 = (a, b, c) => {
            a.innerHTML = a.innerHTML.replace(b, c);
          };
        document.body.innerHTML = $q1('.txtnav').outerHTML;
        $q1("body").querySelectorAll('font,h1').forEach(a => {
          a.innerHTML = a.innerText;
        });
        document.body.innerHTML = document.body.innerHTML.replace(/\u2003\u2003/g, '</p><p>');
        var tc = '.txtinfo,.adsbygoogle,br,.bottom-ad,.bottom-ad-pc,.contentadv,.setbox';
        document.querySelectorAll(tc).forEach(function(a) {
          a.remove();
        });
        $q2('*').forEach(a => ["style", "class", "id", "[class]"].forEach(b => a.removeAttribute(b)));
        var tr = [/\[|〖/g, '【', /\]|〗/g, '】', /h1>/g, 'hz>', /】\u000A【/g, '】<br>【', /\d+/g, '<h r="w">$&</h>', /【/g, '<h r="w">【</h><h b="w">', /】/g, '</h><h r="w">】</h>', /Level/gi, '<h g="w">Level</h>', /hz>/g, 'h1>', /\u2003\u2003/g, '', /font/g, 'p', /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]+/g, /“.+?(“|”)/g, '<h z="w">$&</h>'];
        rs1(document.body, /"/g, '“');
        for (let a = 0, b = 1; a <= 21; a = a + 2, b = b + 2) rs1(document.body, tr[a], tr[b]);
        $q2('p').forEach(a => rs1(a, tr[23], tr[24]));
        $q1('body').append(rrd);
        window.scrollTo(0,0);
      });
  };
})();