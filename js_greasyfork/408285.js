// ==UserScript==
// @name        * Reading Assist R (読書アシスト)
// @namespace   knoa.jp
// @description 大日本印刷(DNP)と日本ユニシスが開発した「読書アシスト」をの手法を、手軽に試してみよう。
// @include     *
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/408285/%2A%20Reading%20Assist%20R%20%28%E8%AA%AD%E6%9B%B8%E3%82%A2%E3%82%B7%E3%82%B9%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408285/%2A%20Reading%20Assist%20R%20%28%E8%AA%AD%E6%9B%B8%E3%82%A2%E3%82%B7%E3%82%B9%E3%83%88%29.meta.js
// ==/UserScript==

/*
[update]
「小説家になろう」など、一部のサイトで動作しなかった問題を修正しました。

[memo]
赤月ゆにちゃんの指摘など
https://twitter.com/kantankikaku/status/1310747945730322433

横幅75%を超えて句読点があれば積極的に改行していくとか
  br追加？ってわけにはいかない気が。
  margin-right追加して改行させる？
*/
(function(){
  const KEY = 'r';/*起動キー*/
  const Y   = 0.1;/*斜め字下げ(em)*/
  const GAP = 0.1;/*斜め字下げ横間隔(em)*/
  const X   = 1.0;/*インデント(em)*/
  const MAXINDENT = 8;/*最大インデント回数*/
  const RE = /.+?([、。！？!?\s]+|\p{sc=Hiragana}(?=\p{sc=Katakana})|\p{sc=Hiragana}(?=\p{sc=Han})|[^\w,\.](?=[\w,\.(「―])|$)/u;/*句読点、ひらがなの終わり、記号の始まりを検出して文節とみなす*/
  window.addEventListener('keydown', function(e){
    if(['input', 'textarea'].includes(e.target.localName) || e.target.isContentEditable) return;
    if(e.key === KEY && !e.metaKey && !e.altKey && !e.shiftKey && !e.ctrlKey){
      /* 対象要素 */
      /* brを含むdivを分割して複数のpにする */
      Array.from(document.querySelectorAll('div')).filter(div => Array.from(div.children).some(c => c.localName === 'br')).forEach(div => {
        let ps = [];
        Array.from(div.childNodes).forEach((n, i) => {
          if(i === 0 || n.localName === 'br'){
            ps.push(document.createElement('p'));
            if(n.localName === 'br') div.replaceChild(ps[ps.length- 1], n);/*i===0かつbrに備えて先に判定*/
            else div.insertBefore(ps[ps.length- 1], n);
          }else{
            ps[ps.length - 1].appendChild(n);
          }
        });
      });
      let targets = [
        ...Array.from(document.querySelectorAll('p')),
      ];
      /* 斜め字下げ */
      const flow = function(n, i){
        n.style.display = 'inline-block';
        n.style.transform = `translateY(${i*Y}em)`;
        n.style.marginRight = `${GAP}em`;
      };
      const split = function(n, i){
        if(n.nodeType === Node.TEXT_NODE){
          n.data = n.data.trim();
          let pos = n.data.search(RE);
          if(pos !== -1){
            let rest = n.splitText(RegExp.lastMatch.length);/*ターゲットであるnと続くrestに分割*/
            /* この時点でn(処理済み),target(新規テキスト),rest(次に処理)の3つに分割されている */
            let span = document.createElement('span');
            flow(span, i)
            /* 直前のrubyは1要素として吸収する */
            while(n.previousElementSibling && n.previousElementSibling.localName === 'ruby') span.appendChild(n.previousElementSibling);
            span.appendChild(n);/*textNode*/
            rest.before(span);
            return split(rest, ++i);
          }else{
            if(n.nextSibling) return split(n.nextSibling, i);
          }
        }
        else if(n.localName === 'ruby'){
          if(n.nextSibling) return split(n.nextSibling, i);
        }
        /* もともと含まれる a や span など */
        else if(n.nodeType === Node.ELEMENT_NODE){
          flow(n, i);
          if(n.nextSibling) return split(n.nextSibling, ++i);
        }
      };
      const getMarginBottom = (e) => parseFloat(getComputedStyle(e).marginBottom);
      const getTranslateY = (e) => parseFloat((getComputedStyle(e).transform.match(/[0-9.]+/g) || [0,0,0,0,0,0])[5]);
      targets.forEach(p => {
        if(p.firstChild) split(p.firstChild, 0);/*回しながらchildNodesは増えていく*/
        if(p.children.length === 0) return;
        p.dataset.originalMarginBottom = p.dataset.originalMarginBottom || getMarginBottom(p);
        p.style.marginBottom = parseFloat(p.dataset.originalMarginBottom) + getTranslateY(p.lastElementChild) + 'px';
      });
      /* インデント */
      targets.forEach(p => {
        /* 複数回起動に備えてリセット */
        for(let i = 1; p.children[i]; i++){
          p.children[i].style.marginLeft = `0em`;
        }
        let x = [0], breaks = 0;
        for(let i = 1; p.children[i]; i++){
          setTimeout(function(){
            x[i] = p.children[i].getBoundingClientRect().x;
            if(x[i-1] < x[i]) return;
            if(MAXINDENT <= ++breaks) breaks = 0;
            p.children[i].style.marginLeft = `${breaks * X}em`;
          }, i);
        }
      });
    }
  });
})();
