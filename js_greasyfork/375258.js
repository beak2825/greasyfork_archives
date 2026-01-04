// ==UserScript==
// @name     Lamptest pinned header of table
// @name:ru  Прилепленный заголовок таблицы для результатов тестирования ламп Lamptest
// @description:ru При прокрутке страницы и уходе заголовка из вьюпорта становится видимым прилепленный заголовок
// @grant    none
// @version     2.2019.4.29
// @namespace   spmbt.github.com
// @include http://lamptest.ru/*
// @include https://lamptest.ru/*
// @description for stick header of table when scrolling
// @downloadURL https://update.greasyfork.org/scripts/375258/Lamptest%20pinned%20header%20of%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/375258/Lamptest%20pinned%20header%20of%20table.meta.js
// ==/UserScript==
d=document;
$q=(q,E)=>(E||d).querySelector(q);
$qA=(q,E)=>(E||d).querySelectorAll(q);
$x=(E,h,i)=>{if(h)for(i in h)E[i]=h[i];return E};
$e=(g,el,cl,ht,at,x,o)=>{ //===создать или использовать имеющийся элемент===
    if(el)g.el=el; if(cl)g.cl=cl; if(ht)g.ht=ht; //(оптимизации записей на позиционные)
    o = g.el = g.el|| g.clone && g.clone.cloneNode(!0)||'DIV';
    o = g.el = typeof o =='string'? /\W/.test(o) ? $q(o, g.blck) : d.createElement(o) : o;
    if(o){
        if(g.cl) o.className = g.cl;
        if(g.cs) $x(o.style, g.cs);
        if(g.ht || g.at){at = g.at ||{}; if(g.ht) at.innerHTML = g.ht;}
        if(at) for(x in at){
            if(x=='innerHTML') o[x] = at[x];
            else o.setAttribute(x, at[x]);}
        if(g.ap) o.appendChild(g.ap);
        g.apT && g.apT.appendChild(o);
        g.aft && ((x=g.aft.nextSibling)?g.aft.parentNode.insertBefore(o,x):g.aft.parentNode.appendChild(o));
        g.remove && g.remove.parentNode.removeChild(g.remove);
    }
return o};
var $tFix, wW, wX, $tNL, $TQuery = '#ajax_search_results', $T0 = $q($TQuery), $T;
setInterval(() => {
    $T0 = $q($TQuery);
    if(!$T0) return;
    $T = $T0;
    if(wW !== innerWidth || wX !== pageXOffset || !$qA('.tFix').length)
        wW = innerWidth,
        wX = pageXOffset,
        $sav = $q('.tFix tr:not(:first-child)'),
        $THCopy = $qA('th', $q('#ajax_results_table', $T)),
        $tFix = $e({cs:{position:'fixed', top:0, left: $T.getBoundingClientRect().x +'px',
                minWidth:'120px', minHeight:'20px', maxWidth:'none', width: ($T.offsetWidth + $THCopy.length * 2 - 5)+'px',
                paddingBottom:'1px', background:'rgba(183, 191, 234, 0.85)', fontSize:'0.8em'},
            apT:$q('body')},'TABLE','tFix','<tr style="text-align: center"></tr>'),
        $THCopy.forEach(el => $e({el:$q('tr', $tFix),
			ap: $e({clone: el, cs: {width: el.offsetWidth +'px', border:'1px solid #D5D5D5'}}) })),
        $e({aft: $sav},$q('tr', $tFix));
    if(($tNL = $qA('.tFix:not(:last-child)')).length)
        $e({remove: $tNL[0]});
    $e({cs:{display: $qA('tr', $tFix).length > 1 || $T.getBoundingClientRect().y < 0 ?'block':'none'}},$tFix);
}, 1330);
