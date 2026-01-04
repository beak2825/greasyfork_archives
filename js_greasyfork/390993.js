// ==UserScript==
// @name 5ch id check
// @version 2.67
// @description 定期更新される自前のNGあぼーん砲。荒らしと広告を消します。拡張機能 Tampermonkey を入れてから、このスクリプトをインストールします。読み込み高速化のため拡張機能 uBlock origin も入れましょう。
// @match https://*.5ch.net/test/read.cgi/*
// @grant none
// @namespace https://greasyfork.org/users/385753
// @downloadURL https://update.greasyfork.org/scripts/390993/5ch%20id%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/390993/5ch%20id%20check.meta.js
// ==/UserScript==

(function() {
  let l = location;
  let loc = l.href.split("test/read.cgi/")[1];
  let ita = loc.split("/")[0], sure = loc.split("/")[1].split("/")[0];
  if (l.href.indexOf("354/3/l50") != -1) { l.href = l.href.replace("/3/l50", "/l10"); return; }

  let strD = "display", strN = "none", isReverse = false;
  if (l.hash.indexOf("on") != -1) isReverse = true;
  let rSure = [
    /1560732922|1573026185|1581373551|1581400914|1612938991|1632356183/, //r
    /1581403057|1588767022|1602431094/, //fake
    /1564059291|1590746639|1624173528/, // e8 - e10
    /1540776960|1548800507/, //e5 - 6
    /1554331925|1594629608/, // niki 7 - 8
    /1623134943|1632206655|1644511567|1670628125/, //d16 -
    /1485862712|1529838377|1552651737|1566743567|1574308993|1579279104|1583459191|1588242309|1592838016|1601493514|1614888819/, //d5 - d15
    /1592813113|1588767022/, // nise13
    /1638399226|1629680167|1656901382/, //t42
    /1546072218|1552048375|1561091787|1567758393|1581641354|1589782777|1601992285|1613327098|1613503140/ // -t40
  ];

  $(document).ready(function(){
    adDelete('#banner'); adDelete('.ad--bottom'); adDelete('.ad--right');
    for (let i in rSure)
      if ( /female|seikei|body/.test(ita) )
        if ( rSure[i].test(sure) )
          idChange(ita);
  });

  function adDelete(name) {
    let o = $("body").find(name);
    o.each(function() { $(this).css(strD,strN); });
  }
  function idChange(ita) {
    let o = $(".thread").find(".post"), countDel = 0, countHissi = 0;
    let idValid = /^ID/, idHissi, idCheck, rPrefix;
    if (ita == "female")
        rPrefix = "rtn00000",
        idHissi = [
          /iQ\/cB41B0|nhSXteJc0|T0um1k\+k0|eovT4pG00|oyScGOwD0|RDvjhBX\/0|wzTIFb170|pdZskl2n0|1OiQ\/Oqm0/,
          /R9ooQyJJ0|nNRD48J\+0|jWmQE\/7a0|\+TbTt0XN0|3lAdU4yp0|wgD\+I0180|ktMudwJ00|gWvVILcJ0|46DPrUcm0/,
          /DRib93K60/, // rt5
          /O0VQbpbv0|zNLeOhKH0|JwmKwdtj0|2wIirySk0|\+T3okvrd0|QO0u7CYl0|umeg5BeK0|ZL\+3zANa0|pDlaWgha0/,
          /kB22OPeL0|SiEL7Qmo0|C72q65RH0|NTzuGps10|NG6GYc1o0|PjAayBMM0/, //rt4
          /SN7HAb9q0|z4RVqQ2a0|P7AmMgKV0|CnmthSNT0|GC\+q3ROn0|\/d51uu7E0|yO0U4N7K0|JtdVI7KL0|Zy4pdcyB0/,
          /vy8ytufG0|I8\/Bs6\+S0|8kbZ3XJ40|Q\/yzF1PY0|\/d51uu7E0|NzbZUh3c0|2BkK9Qik0|QEV\/qH8A0|3JjhFLLz0/,
          /YmiySwUa0|8Q2kZilM0|393CU41P0|AhsqxYbO0|wjTrnq2N0|sKJAyeA10|\/Gt3L2us0|V3z7qZbf0|EBKXR6Gi0/, // rt3.5
          /TVu7Tti60|oEe6JUWS0|O1UFZFEH0|Z4zfwGUt0|ta83yJkN0|OnU3l5Dm0|ZWM5LuFC0/, //rt3
          /HVCkX1K40|t5YHtlLH0|os6YPhiD0|zoeD5MLZ0|ubSZIClc0/, //niki8
          /UBKXYhK70|Z4zfwGUt0|QNd1NRUY0|1PpQqNsc0|aAy7Fkab0|wN1iuSLv0|jtzn+0sd0|35PcXCCE0|LBLBBgSJ0|l5HVyYzD0/,
          /hL\/Mlcyj0|WpSqHdMe0|dXpC2a2p0|2wSFcaqL0|xwgr8Uk40|STXCp9xe0|z3uCD\/qG0|5uliIhtz0|q6d67o\+i0|iSnQtpVf0/,
          /kw4dIgN20|q6d67o\+i0|FqyJQDRC0|f8b82hbv0|h+OsWi+X0|r2Mhv8BC0|d20RNmH30|CBbsPB9M0|dFieaG5Q0|O7nOggzT0/,
          /8okh7eQ90|O7nOggzT0|ml4yBV3o0|FFv68c3p0|29iR5DQg0|b3yaJmpO0|HZuCQGuX0|QePcF5ZY0|vtVkIT7a0|CGiQl9Gq0/,
          /8UUMU2Va0|lzBiqupT0|L9\+lsPZy0|R88Drbal0|8RXx0soR0|Ke7mmo5T0|K462y9jG0|MooNQdqh0|OkaP6\/d60|xNG30H9k0/,
          /WaaY4cs90|46jMLTwI0/, //fr1
          /aWRAd4gv0|yO0U4N7K0|08Tl3Mod0|tipY1GJ80/, // e9
          /nymX0pNm0|Pu3ffND30/, // e8
          /5FSGmNgg0|TMvrli1X0|A3Eq\/BRp0|cam\/p0CG0|MMDdMi\+s0/, //e5
          /Gi2qXblc0|mMSFmIp40|qg\/25ryM0|V4svLUrL0|i\/k2hf800|\/LiAB\/YM0|yGu5e7Tn0|yDlRPDbf0|AEGWWSDw0|dTkOqkyw0/,
          /dTkOqkyw0|PPkthjsV0|MVvi8mOO0|EcfH4moi0|EcfH4moi0|WNYMUIGM0|uyjPkoXc0|IdwXtkMx0|mCsfOSPU0|KQMtD4I70/,
          /KQMtD4I70|ZLAZRKBV0|ZLAZRKBV0|oUv\+fuIL0|MpQA5Tx70|l2dAvW9a0|BAY14qra0|0pGKRLTB0|wpxk7d380|tmz0aFVb0/,
          /QY\+sOjRL0|eilFDZdE0|3l70CKiO0|AdsB4vL50|dwqXz8\+A0|dwqXz8\+A0|ZNW8l\/wh0|9Du4YThX0|\+aHBdzUa0/,
          /8wOM3HEq0|dqhzxkTk0|gKsYDgRT0|Q4oX9WRT0|xzLJEhJ80|E\+cPKBCd0|WTRTG6A70|IuXKwE8H0|WcXyurr50|oF\/\/igoW0/,
          /dFTStUg00|bGxQKbj\+0|\/BO5lo3E0|c94JsbUD0|\/rTUSEX50|yImXMXCO0|A2a7vybs0|Hsdj54\+n0|1EKkvDJQ0/,
          /Qjjsfzfv0|A1zSTjn50|\/RorRB\+C0|C6zdPji80|qEJzRauh0|Q42\+\+f\/M0|BCxZyp050|knBRp5\+x0/, //niki7
          /bB+V6ac70lOP6L3GU0|\+WL8nzeD0|\/wJkxy4k0|Zy4pdcyB0|COh5aG390|gX\+tzsk\+0|2gVLFf090|p6RhTXBX0|Fkpgadna0/,
          /BwS7uke10|cZ5FIAqB0|lOP6L3GU0|MB4rUiLE0|YCD4P3WZ0|gpZrze4c0|UJeZY4ln0|sleqO65x0/,
          /UGz3B6x50|3RSMBXUQ0|c40uIX6K0|mSqDHthc0|TsxxjbN00|VwRob1S90|v7c8hctH0|yWDtPr6K0/, //fr2
          /XTg9Rs940|6q9n\/jDI0|0HlpF\/Gq0|xBUOV5kQ0|AfTk3Wdw0/, //fr3
        ],
       idCheck = [
          /gimgHAXC0|RDvjhBX\/0|LZbwuNkt0|wJFDdzyP0|7DAt5O0w0|cQsK26Re0|\/PxzBqxM0|5ivhpSeE0|E0elzrUG0|wH2oSPRb0/,
          /XZ2XKPlF0|K3VnmpFn0|p\/QWd5Hh0|aVwNZb\/M0|9LYbiRJP0|XZ2XKPlF0|K3VnmpFn0|p\/QWd5Hh0|aVwNZb\/M0|9LYbiRJP0/,
          /PEXb4Wux0|c1JtjIRp0|mcxqM\/qs0|O7WWFrWh0|pQLFs9kp0|y5tIG0wW0|qd71dP9X0|aizMmK9z0|1eWoXGmq0|4HMtnTqR0/,
          /O3pdeTP\/0|H24NDFmO0|BicdKs0J0|v9ISorke0|ZWvIVS8I0|wvvKGuyT0|6Usphos\/0|GKC9F1HK0|FoDS8QUB0|oqrc\+U9M0/,
          /cXb\/pdVc0|Jcx07Vz30|6xbzemc70|2hMbiJ240|VuDPJiXK0|n6LWal\/j0|xHUbP8A80|P5iCNMN\/0|1C2ZpM1m0|P2Jwleqr0/,
          /Hs28wU7s0|AvPfgcVh0|Nxkwt\+\+\+0|1tQYJx6m0|aPPFEqYV0|81DQWfO40|Hvn7B5EE0|EU7V\+lYt0|\+Mb90wwQ0|wgD\+I0180/,
          /bmR4buD00|geesxdRP0|PQezyCFc0|kou4IG600|4qBU9qgM0|G07pA4j90|G07pA4j90|PqhwMEQ40|SA359r090|pErxJhzs0/,
          /EVmY0DUU0|2sd5r7FB0|u2XuWHnN0|uzzlU5rA0|PL8DpzJj0|NULYKVZN0|Pa0qzVOj0|QwBKPwXH0|XO9OX5RO0|yCDgf\+yY0/,
          /UzMyZ\+BZ0|F4zkV7WY0|5iTfUt9z0|JYzyfNTg0|4DTEI\+4r0|xrYu5Jj50|aTRZi7yh0|BUlhs7DN0|dWXWytYV0|N52hPVW70/,
          /fT0eMp9S0|scTKcWf40|LKyfz9xk0|m7Fgr7UY0/, // rt5
          /kHrezuKE0|ny9qE0kZ0|puodRN8I0|\+eIeuLij0/, //e10
          /LzD\+9Jcc0|GwhZ\+vBA0|QCGYQWX00|ObxIYo2N0|gz693H5\/0|15IE0PqP0|TTP8Gtwo0|hmWRRTVg0|aW\/OSje10|31ryDvsM0/,
          /S0HE5m4p0|kpWnxAYC0|0T71dsX90|WkVzxzoC0|pdYA06\/v0|xewpRxtK0|vDQuDwxn0|6LzkstXG0|Zjc1yZGV0|vjN\+\+UOe0/,
          /GbDqVVNR0|LbxCGL1U0|Ys8RFno40|QFjmHMG20|znXPjeW70|26O6A8E00|VErATLZt0|ucRH17ot0|N3hBzoSh0|FfXNx2kM0/,
          /valuRlOs0|2Jxw\+pAO0|IqPoQc7K0|wcjLfNz\/0|scoXpfrA0|kyZnockY0|GcSlVgdc0|Rf7flNLM0|JKNNh9lL0|unUc18Fl0/,
          /gf\+DCJ270|RRi4AyET0|U9yBSe5Q0|yeE\+Yu3L0|TkVyIhl90|zoAQPfjB0|f9UpU1OT0|4gs2　ZaXu0|McwJjGiK0|uJ\/X0yLW0/,
          /TiX3UVay0|y\+z4dMfW0|hkou7lfW0|uahV2es60|BYrzi7zt0|TiAPfH3b0|cjozH72v0|f\/sxS7k30|j0SUM8zI0|87nFfOMA0/,
          /\/Oci9b1U0|qkuabweX0|w9E0ltVs0|HJGIgMaN0|IAzRr9uq0|uyACwtum0|1EnRY6z80|bLHb7YCZ0|Qo9RfQRl0|nT5H0Vfd0/,
          /yYBi\/8jG0|dnA7VTdZ0|kxVv0Qz10|vun43ySx0|xJf3DUxd0|4L6u0Br50|MbueVTeU0|v\/ZmdGpp0|2IQ0M\+p70|IVwtdhrx0/,
          /v5HZ9WcF0|7PJ8IKAM0|6RLqL\+Jn0|68\/FUF6P0|gZn5OSmc0|Ta09WV440|yNNVdOo70|h\/w4wCZK0|O\+AYAP5s0|fbhUKglN0/,
          /pcpSQyuJ0|\+5XKDNQX0|0S\+8Egdt0|LMAFIvFs0|kaIblV6H0|VO4JMEFv0|6R38OT2H0|oSMZcwl20|g9m3n6Fg0|MZZqtuDL0/,
          /6twpG1S\+0|3ww4gzf50|MMvy49i00|PwspuxNK0|ZgLZTJmW0|pJ1c3kEd0|9TNJ7aI\+0|6zB4taDI0|80eJVJ\/80|zxvVN1ul0/,
          /YbEbZnUR0|\+SZHCUHn0|dsu8pBGh0|1AWckkfM0|3W4ecBqr0|gasDYwkT0|E4ID2dxg0|zLZ7gYcQ0|oe17nirs0|ju6Z9KSx0/,
          /ANabgJps0|fbeOkmTR0|NE9kbl2r0|wx7gErBM0|OKT7ZNe00|tYsUN1N00|4fwgY98Q0|faJ8eilI0|ciO1bNyI0|paOMMMlg0/,
          /\/awV2XJn0|r2JRg0nM0|IEGLjIc20|0wj\+rG620|WxiXjwlk0|Ogah2j\/00|Ls02iYq\+0|qmQYpFM\/0|kc9Zx7h10|XEHg5zaw0/,
          /hrbQ8ocT0|K2uMSjqF0|KSm498Wp0|Wmev39ze0|9fz2ezIf0|uW\+mM\+b90|uW\+mM\+b90|8suIAfrC0|41SZHHEt0|NaHhh2WE0/,
          /8suIAfrC0|KF9oTMr\+0|6QfWKYm90|6QfWKYm90|CLDU4SNv0|ho5IX2vN0|rz22IbJT0|LjvRs2Y80|1QjKwRfb0|GhJ4dzt\/0/,
          /a\+NokO7i0|Q5xUg00X0|S63L92nK0|ewQbaU5O0|KSLq\/F7U0|BAR\+sFVk0|a8lF\/Rmf0|Fyf9Nu\+H0|UQFkyQnf0|UQFkyQnf0/,
          /IATj5DXT0|R7KKNiEP0|GtW7AfFm0|TyJFSZcw0|RrWPZEXW0|\/8SmY7l00|pP\/emylf0|NG6GYc1o0|g8FcoJCF0|kGlN3WYx0/,
          /4ae2JktC0|EcbUR7QZ0|4eQMNjnp0|zaXiMcUO0|3tMeab2l0|X4Fe6Edx0|jY\+pAqWU0|ULMnqes80|GshfWIVW0|DqU56SWq0/,
          /hxv50id\+0|k7hCUODg0|fLQYzi310|15WAKDFE0|AE\+3rUXr0|yILQy8mU0|gQVki4EA0|2zALlL7e0|Y5TyIVU10|13Wizaq\+0/,
          /pDQEuLnv0|TRclBug50|wJ6oMzMd0|jnYo4rMk0|bTGR2pu40|AM6reOlO0|SzsM6wxP0|Fyf9Nu\+H0|TIc\/qb9p0|81OQf61T0/,
          /DuIVEJmp0|OAR9k2NB0|PpQhTLxF0|hEVBh\/iT0|hkEdx4F80/, // rt4
          /Y0t3I83a0|73wYjDWC0|zqRbHSqm0|qcNC6ynq0|7pa\+kWeN0|yO0U4N7K0|0Yka7xPh0|FU\/j0YMzO|fs\/3HQjv0|YeDIR78n0/,
          /JTUUBHCO0|\+C7Pd88V0|sv3\+NDey0|5Na9\+8P\+0|D4IyqT4Z0|1gASx6pI0|\+GrDf0lg0|R1QHI\/Pr0|mAzFixTQ0|XAFhdcBT0/,
          /mAzFixTQ0|XAFhdcBT0|Zey4csXV0/, // e9 71-
          /W9JR8HMH0|f\+sQjjub0|3nU07aOb0|btZJaRbu0|QXcDMKAb0|SrnRQ8RvO|KGdfeAPBO/, //niki8
          /lmVdK41d0|WUA\+sFKb0|n4Zrzpnj0|xl5s4dXF0|BUdXqBPo0|3MVs0G8W0|ifrCA24Z0|PFBS43Cw0|ZvcUPRlt0|d9WJVIv20/,
          /zYACJZ7V0|AfTk3Wdw0｜UQGrzwjn0|OEYr9SAQ0/, //fr3
          /4FPTsdwo0|Bcp7Ai9jO|yeKF\+z5h0|SMP2wsZy0|d5hH2NCO0|giOZx9dw0|dn3db7y90|zSPtRDFf0|xbhQuDnx0|\/a0Ag1Ti0|P48d0J1N0/,
          /gT1YmY3\+0|pTsqvPjK0|1\+HizgetcbQK\+BaZ0|jOE01wil0|04PXgYFj0|edxW4pVl0|Vz52D9BK0|iKh9oUbX0|1tlOsCqn|\+zsAFa\/\/0/,
          /Feu6UBRu0|UAn942Fh0|8xQsE9uj0|aFiywZIc0|Sp\+86\+0H0|3t\+eRJYt0|OI9eJ9Gq0|bbhjUrea0|5D0ZZ5x90|Lp442\/MZ0|9y1vVdlB0/,
          /oWekwzOC0|eFq6N9yA0|DQdMFz0D0|wGAHa8HN0|DLa\+vqIj0TYUnzJTt0|0Y0ZiwOe0|POjz2YU60|3w5Hs\+5o0|Awa7K9cd0|Ru3bJIky0/,
          /evYNHtku0|lu9U4OuT0|FP\/F3Exu0|\+rpE6gTJ0|pvY9DrL60|jEqgYRY40|wMrnlyAg0|copnHzZ50|PsZV7b9s0|XWcc3x630|PyJ\+TXqE0/,
          /5ceYAh\+E0|ilFe7QwT0|lnLgghW\/0|ao\+KBpZD0|lS9Fiy\+50|w6ZIQTIj0|cbQK\+BaZ0|1\+Hizget0|\+QuA1TAC0|\+gb\/14LM0/,
          /M8v6f0si0|TYUnzJTt0|g4XCMefc0|pkTUgvHt0|7HoV5WXc0|FTAGfxls0|eJu5R9jW0|XUWpIqSm0|XxNVF94Q0|gVcU8JVT0|POVLCaWm0/,
          /rAAIZXPP0|aPkccsI30|Drzr3Edt0|D8S3oTZi0|gIDDQPjy0|jv51C32z0|StoRVeGa0|GI\/EbbxR0|RgujZj\+30|M\/pOIJhI0|Inh9rY\+d0/,
          /mH6WUaDS0|BDnECPLW0|DGE2G5UM0|xoLSV16e0|X6xpvSD30|ChwleyUd0|BLaZt3bz0|9jYbQaQ40|s1d3HLkx0|JkUzDCVT0|\/zcJuJsX0/,
          /DDm9FswG0|Hu9Oc1VZ0|Zeo599lc0|bEY9NTlP0|NntRMJac0|tNroaqpv0|jrps\+jmD0|I74dHSmO0|rIRSNLDk0|VColDY4B0|Xba1vr5y0/,
          /qvCxfuE80|6L80G8P\/0|a1kNIMeo0|9uog7V5Q0|HWDmJVmk0|8Nk6UWiX0|uHEeATCY0|85tZgD\/w0|iCuNJAjR0|8vnwWUWv0|9qzvE3zI0/,
          /BUccoFnD0|8zdemgED0|a7z6amLC0|FBlffqu10|5ZCBMV3f0|loqIu\/W30|ARNKcEo90|OnT8NRlU0|ut8rPlDZ0|LyqS8dLl0|yhOABzdm0/,
          /xRuuqoXP0|7otFdJLY0|opv8z1uA0|ejG87xDG0|PHB4pKdC0|ASa\+qbYd0|xq2oMXqG0|Sw17qs\+y0|1XmNRbVD0|VmL9tavQ0|NDAFjO1u0/,
          /VPVaUmAQ0|8dKPtjiG0|JbDBPIX80|6oWBvSX30|80rafPc10|PWtOFcdi0|38L23GWO0|teGCa4fS0|o5l7kdhG0|dXx\/HOXr0|o5l7kdhG0/,
          /dXx\/HOXr0|Ln0F6wVJ0|jSI7V2tD0|ZuOHTTL50|r5l8y\/3z0|zJnoZJ0N0|zUzN0ne\/0|THPCSG7R0|u9u3pRY30|vKHSocKr0|B2Uw\/jIQ/,
          /XlI2BAFJ0|K49y7fZN0|ZQAmkwq50|oYoqGuVe0|6VJOVh0h0|jAT723Jw0|jxja5OEf0|ARUcH70D0|2QeJ7\/ll0|0XlI2BAFJ0|Vg22dGu90/,
          /ec8PbFjd0|aEkhsj8y0|Vqwrqkfv0|42LH\/HLx0|aL5d6W8f0|8iHNLtIm0|7T51vQCB0|qbihDoao0|vqkGPV0D0|M8Cn4BzE0|Ne0E0fAO0/,
          /gCL7P1iN0|xiJZrZTJ0|v9bpvjCu0|m4e5Ljl40|Yi11w\/ai0|vf\/ND5jP0|UFU7tQmk0|cHcIVrs\+0|wHzM0BZD0|SAOSmv1V0|NQidhYhu0/,
          /WbLekK5Z0|TMdrALk\+0|xwy56H7I0|QepSez\/j0|HnY0B3290|AoZk7AOt0|fue2LVR20|x3avetSu0|57mQKD4R0|EIdVCrsb0/, //r3.5 800
          /Rp2KFHE40|Kx\+1Xgv\+0|KwkL4s7M0|wbbSOecR0|5Y0f9w6w0|2RM9IM6uO/, //fr2,
          /Mb15XpYj0|9Irc0hR00|7GPIgjMT0|aDALxCcI0|D3tCIQkd0|TVu7Tti60|oEe6JUWS0|cZ5mUn\+i0|lGvRND1G0|MMNoPLcK0|mdNmOB270/,
          /rn6zOHpf0|mdNmOB270|PAyRiLSW0|sA7P3QJi0|H2lr\/r5A0|MWv0k56V0|PcKQ31Bh0|XkYYDe4O0|PcKQ31Bh0|OnU3l5Dm0|pY\/FMRE\+0/, //r3
          /ftcNnxxj0|b6RL3ZJA0|monajb440|mXh3vm8K0|R\+AEW5pU0|xH5CrEVq0|F4GKE\/2\+0|pKLutexd0|eGJz\/Sg90/,
          /TEeDpFXo|a8znlwRY0|hJgsaQbR0|wBNo\+B6N0|Du44SMQX0|FCWh\+j1Z|hPM0ovPx0|uBGpJT5J0|o4ImcJZ40/, //rg
          /5lN\/MPuy0|r56T8H1z0|9xq1LlZX0|DC8Lv\+8k0|DL5Ux59t0|af5E\/EWd0|IUWUxZld0|a7C\+G5Ej0/,
          /fq\+bTjhm0|tZoNM3Ss0|D1gYpE9I0|zKGiJZOx0|9cGfI4\/t0|veUb9FjO0|pkg\+2HI70/,
          /yP9yGeUW0|r8FG\/T3E0|03SHigQ00|CiSASm1e0|ESQsA8rB0|yev7Hd2u0|k9Duahjg0|XylpFkby0|em7grWid0/,
          /sEqUiZyr0|BMYHpnkV0|8olWp99M0|Efx5ueOH0|RoMujtRr0|Un0533mQ0|tF9WRWDE0|peebyxm90|JRKjlIMq0/,
          /AFWE9n9e0|E06SRmVp0|089UCh1Q0|ZJ4Q6tX20|8MnY2CKX0|4tTQs6mr0|2FTCa5Wg0|IFsMe3rn0/,
          /XOEB1mCf0|1KAzwoQc0|UZvswVe0|0bqb9C4y0|INwL2Bvy0|qd4UJPhj0|DoLDXDpM0|FuRolnPM0|Rv0b5rA10|YS39q9J60/,
          /iyaPgPHW0|SyC7xHso0|KNVn\+85u0|\+lyd4FH\+0|WimVeaS\/0|4XGWreLh0|DqbyDfg20|PcmfJdGC0|hEmLjMRc0/,
          /XOVN7j8x0|JluLcBWU0|a1dhQZ0r0|sNU4n2VN0|qTzhy\/uy0|lbDbTztT0|v2Om7dIu0|3ReWxJAz0/, //rz
          /mYawCmis0|CHZAG6YL0|Pp9mTFyN0|9LE4Wkjp0|v7c8hctH0|CW8UZKRz0|SOs5YWZc0|9OAm3eS30|yWDtPr6K0/,
          /bUhUGtSx0|5M7398N80|ULLCwZju0|9\/oL1H\/u0|HT3I\+f1Z0|Ngf2EtEG0|HqonYqBR0|d8zM6nxn0/,
          /TsxxjbN00|\/Nicz\+vC0|UL420\/pF0|wmrXHxjI0|t2mTJuTw0|xLsCVpVQ0|zTrX5ETF0|beubxmEA0|G1GtQuWL0/,
          /\+d0IA5J\+0|3EgRqmwy0|K8ahwZjg0|ghgKdxeC0|ErAEMBBa0|DLZjJ6nd0|shD241py0|O6DGqC4G0|h4hK3OH60/, //r2
        ];
    else if (ita == "seikei")
        rPrefix = "SEIKEIITA",
        idHissi = [
          /\/ZIY3BOD/, // d17
          /WJYiwhEc|Qbf22LN9|eLHNEb3R|JY0UEB2A|aOIe\+hqr|VxkW\+P0B|1SJFZbqW|NdalFTZ4/, //d15
          /ZJWZPBex|8Zds4DcB|H8UW3lyj|uqPfAp5B/, //d14
          /DreGvPjZ|7lC6p4sZ|CO1CmfuF|jTBBaMND/, //d13
          /z2TViqco|Gr\/wTHNj|S\+ao\/brt|aYk4Ww8V|4PvG8DI2/, //d12
          /uqPfAp5B|Lvob1\+Vy/, //tt muki
          /8xUkqeqe|pgX6FFsd/, // t42
          /AlQSeSi\+|fLDrou9x|v9f1qUVC|3QTZRRL3/, //t41
          /VEhgJwOT|bT9SgvJ6|M9kGzIgW|CMPsVbXP|\+exs75M0|GaQGk6fQ|jKZp\+aPo|0lKJQQ3h|p8K50fnS|n4XwL0u7/, //t40
          /U3jlmq04|LA9EUqGN|oZZs9cuD/, //t39
          /KRcksu8n|2vmcjC9W|kJ8UnDOA|Mk7qyGzZ|TNnlpYSF|PCOhFzko/, //t38
        ],
        idCheck = [
          /gKBHvaZW|vlHRiu9s|bQUntgC2|o2pHEF\+n|bBVHWBPJ|5ULf\+qm6|yzkPAhZl|0EeuWYV\+|3KMH44KP|0EeuWYV\+|3KMH44KP/,
          /9ALbKUCG|Luvh8Mwe|k4o\+E4YX|apZhIONb|wG60tFNq/, // t42
          /\/dgUX\+Vn|Nmg98Kmm|U7Cv9\+zM|EZOHBf6a|1ALRlwI7|C8UCmHXg|eQKNYBT8|RYsSAMlu|CYL2rhHh|SUVBTQiU|iVSTXtuG/,
          /Ir23Zv0k|zzEbSUnT|A\/9ND66D|xLes6YU3/, // d19
          /CNvE5DlQ|7Zi3Zxq2|9Sewu\/BT|AXsyPTFx|KsJwDX6g|wcd5dIrg|kQQbrZxN|qTnEihB8|W7SwG0NP|i0poHfir|aVZs\+XnC/,
          /vulVLE9z|zHp6qrJ6|gviFei1l|SvqSRqfT|bvPYaisO|fBqdzdDY|5c\+Bhh4N|ILHb7HF0/, //d18
          /jI\/j4jZg|OVKphAx9|DPEmVtDD|dBcVmpZx|O3oQw9\+q|MCMeSW9z|cRkvC\/bQ|brkuww6h|K8t22QwN|OF92v3dU|hFDoztjF/,
          /U1jxe\+J\/|jfheIikJ|p43rhmz5|zk0QmKjn|kxhHwcpn|NI\/LbK0D|DOrCBh7z|UT8009ar|f2Yz5OdM|2e4hryGQ|bWH2HVyt/,
          /F4sdXXCV|8p8OWJC\/|aeB2tW7y|l68K0Wjo|l68K0Wjo|WqeM9xNK|aAR8HbMi|UCPLyMMu|zu1UT3sT|7PeGUhUM|FCcXMetp/,
          /1G4qSkDm|rnx6s6qw|eFUTxXfq|WiWKovgu|KjssENDo|EZJMKm2i|wOvNfuF\/|yeUSKcWq|v\+8\/ogaQ|sR2Qb66o|8a0usw3y/,
          /Bp7UMZlS|atmhvlKL|2OL8hMCs|GpsMkbJN|9D9wmPyK|1EKy8S7A|wiOWtLcP|Yn2Nnruu|ZKJMSs2T|luitv5S9|MGFVFvhx/,
          /QzG0zWFC|1T33LIWH|UwU0VoHa|g1S65YUb|nZ0ivNCn|xhwQ6v33|EWC\+JQqm|KCz1MkVj|CRgp\/Whz|mmoIZa1O|Q\+hfsmJB/,
          /txrfc6QZ|3uaz2GGu|eDPyiVC7|iBJqTYUp|AkToPwp0|7DEUDDl7|WFY5eBdo|Az7SGf4S|Uq3vyvRU|qQA24a0R|E6zbhCRC/,
          /4zxx5YKf|Ys1K\+mKb|rcelYAVS|IRk\/cVVu|I5EnN4Ih|aeHwy7DJ|cMt3s\+A9|I5d0l8vz|nnGpoBY8|VDjuBJtb|mXrFXNGt/,
          /pZQ0zwRd|eXGi\/h\/x|QfSmbYi8|1kl3H2CH|b7qgm8Tn|mCs4kiO\+|UwTHZ7tC|CyT03xRX|pZwL5SIS|IMk2RIxZ|JGRVtU0e/,
          /pnUqsJS7|dVkzaZne|ZRu0P2c1|AQ7ZHwpL|tkDgvxhX|9M1oBqre|HxZPCP7H|kyyOdV4m/, //d17
          /xozqSsCo|Wz4WQRFy|aS6GXmFz|Ux\+mC7hr|X1HeEWp1|jHJEF6dr|6YCvf7au|pHDCFnvU|poBBH\/\/0|KsRHEjsE|C0K3\+qGk/,
          /rgcGegkR|LOMiaMIg|8V\+UZDfO|OGsQCAbW|LOh6D7CV|zr\+xfSmT|zr\+xfSmT|BVrxcn\/D|eN3H1CRS|Kt2FrYYy|b0MuChvR/,
          /QzCRIyoi|pTtLi64N|5TBqk5Kw|l5lcMXDt|u2TgyTm2|eS8wL1Iq|hKvkRG\/d|4Syj5Tz\+|2dpQv1LL|wRv84K\/8|WvzMk7sd/,
          /\/lfXjeuZ|Rg2ezTib|PuGBZXTV|JdWZcfuk|WQ2x\/\+X2|UnfVWVVK|7DXSzPfr|1atNjSF4|LafiHoKb|GG1oCKlD|X1jYhoOt/,
          /DyTNLEnT|C8VzofZA|Ec6qN0qG|H9eoIpYP|CjujNvUb|JHHxya\+2|agSJZpBg|yMKA0vEB|ocpZ4Zju|mp4yTujz|WWEv74eS/,
          /iFyyTarP|Lv1ZQvJ4|gSvYhHHh|qRxxXwzg|r\/45GVNS|iL48DMRO|YV\/zjupc|bPO4Egtr|XyzuEw9W|W4uFW975|IEXhz1FN/,
          /VfEPW7tg|bUqvtgsW|rVgQLTGq|hhxWIQ\/q|qlfa5E8q|5GJtrLII|khzZF16P|KakA8wGV|7CFlkiUV|\/tHa2s5C|G2ygL9ED/,
          /CoeKAYPO|M6xp\/d8l|O4n\/s2Dp|45ufGVAO|u75QBrPs|WpVjCzIX|\+N2aqFhg|aDSQ\+J8v|aDSQ\+J8v|FzVKx5bz|JvVtKFz9/,
          /Cjwv7tWw|Vo5lEzxa|QACQz1lg|NMu4BG4G|79oowczV|U8lVe7Cj|EaYR2HqJ|VPRYgMPh/, //t41
          /vGJNd2hL|uD8tfFTG|rxZXD7Nr|iH4ESxLQ|kzu16SUx|5m0gSxcw|EL\/R9aUV|0mRgPls9|cCcXjypM|tc47jOKo|D4WcrWau/,
          /ucqsRhNq|gssF\/K4d|x9jcZP3s|x9jcZP3s|CU0SYRET|4VhhxAeg|wQiEUDiE|vIYESP9u|7Xkk01kT|\/y31o1Do|j3s\/o2PZ/,
          /J0C8QV8p|IT1Do8KH|22Ce9Otj|tMC9aceQ|2yYjiYUG|B2grEiV8|yjldcLOB|ydb\/rHsW|QCQib2Ny|0XkBKyvM|l44vdmNS/,
          /OhCVsCP\+|SX\/APKjt|VNEjomrp|Zl9IVGa8|RAbupLYR|3ljJ0hli|OR\+GF1Nz|Yt1XVC6p|6THjWCx5|PRbJcQBA|qch1kn0U/,
          /TJNa9iDN|ILDFqj\/R|rCNmzPGF|j8A3pzY9|BO72qTUl|h55blGau|5I8Juhoc|NwXeOFTE|938UklmV|fQqUnGGl|fQqUnGGl/,
          /sNJ1u7mS|COrGZu\/p|eIPxowLE|hWVaNtF8|bTTOT4bV/, // d16
          /uqPfAp5B|A4a8m6v7|omNPNGLw|XomHMB5G|UI5x82G6|\+HPeodmM|EweKn5jb|qYym8XKG|EbHrGsNR|uGFx59t4|Ugu82aRc/,
          /K38lzr2y|piBiHJ7h|F65Ow30T|6IzfdKqx|BfbN85B4|iMAyK\+yz|xK\+xV5kR|CwRIPsNZ|ti9ChzcQ|WiHQlle3|qdrnLpXR/,
          /F7re\/P0j/, //t muki
          /bSPEcI1d|zU4XFbUT|Xxpm87jl|DjmXo4P\/|6Tpg\/U48|r299DdQd|\/9Gej2aZ|SSz0IXk8|KRc9AW8X|gE6x0joc|pZLqokte/,
          /hKWYjfy5|jvU2TLcE|r299DdQd|\/9Gej2aZ|SSz0IXk8|KRc9AW8X|gE6x0joc|pZLqokte|hKWYjfy5|jvU2TLcE|KOcH5uD8/,
          /kzoY3INE|AruJi\+LQ|FSiDrqf0|1\/L8rZaq|YHx02Bnf|aR3LZecP|wSe8wAof|Op6RmUEH|Op6RmUEH|S\+at0n4t|\/kSWgAs4/,
          /zjNBlMw1|dCUlprtX|kt1Z\+3FS|pZK\/FrDr|\/u7riuq\+|l2VhTGMV|GS10JHmP|WU6Gn7sb|qMpLjpqB|O8szngmP|cAQJiHU4/,
          /RDJr2AGB|8TZu2IMW|8TZu2IMW|auxU\+ksi|9yejHWok|cCLWsT3O|0IIgY2jN|wnBAv7bR|UeTNeiHR|3415wEOU|juEkTtEQ/,
          /u3TdKi\/6|rgBPyIG\+|sg\/8Npx8|ikW1XU0Q|TnoUpMeu|t4F\/\/\/cp|6\+cE7vLU|vfBZZ3\/a|cgGENXTw|tpKHjeYw/,
          /\+XI3E1ay|7GvtHCsL|MCv8WIBQ|yCZvzx\+O|SYNZJHpx|PNao5q\+u|SYpXYPwm|meo\+Qp0X|\/60wXfDC|hVf7P1Ao|hL29cl2y/,
          /trIBVy2w|cFa9NPjV|WdYg67ql|EiwS2ctt|epWEXrrH|\+n52dEMR|AOAFQ2IV|xbmfr78k|lJCNdr\+I|\+Jd2jWQV|WHRv8Utw/,
          /W7hgFJsO|gURlHKiH|gURlHKiH|JYmYu0B1|ijKqCqbU|c0Fz9QsZ|YBiKQRic|tnTKzMcs|zMLuwTKX|9bmeOFQj|XeAKb4WH|RW4\/jJn\//,
          /CdtwNRfy|diLNoc7F|JIFnNgY8|K4MRisSC|7B2Yj7Ox|hQDfOLzK|3hUeoFGh|dwwrcsaR/,//d15
          /zQtptvTD|mzlLiVnt|qvVlsrHn|c6VRc2MX|80VUBuE\/|Z7ucIBdV|mGS\+uPrS|mGS\+uPrS|jXT8IuZr|GlfM0ZTi|UTOxhlvq/,
          /BXotzyEu|\+AjNq5m2|oMMrNq5K|qvHRZk2e|OJ46T4X\/|CGFJWNT1|q\/Q2cK4G|aWUI00gs|F075etF8|zDWO7bAF|dMt8PmW8/,
          /0pT2Hgs8|kNbYsHMc|N3IVSRtG|fcS2hFba|BppVZm0B|BppVZm0B|RGokNXXm|f\+aV\/cL3|mdv\+YTPw|Z\/5Ysafp|8dZUnXmE/,
          /b\/azDBAd|4kQkEZY7|KrZaejYY|\+PVMP9Kj|eJZVAVun|Th0714sj|FCVS\+bPf|\+sVBstOX|6MEOjWH1|T9gcUOEw|BFnBh\+gr/,
          /MUeX\/Sa0|gFZj9bs3|\/e6LlUpk|LJMrxALr|VLSMl5G2|OWO1XxZC|4bMWC2TB|D3n9c6fX|upI5HzC4|SbXQiBCF|Hnre2HGg/,
          /zRboC3bQ|0j7f\+rDz|stE9j1xJ|cQPf3Ji0|\+Lf94vI1|lML1dWAO|lKgaGIgh|6f5Tzf2p|RqL81j1\/|grExn9gP|hdY3KTYh/,
          /T8ZMl1sS|Iy8MQvCu|\+htq8m4j|uEpjbJiP|pELbVvF7|jxBQlWP2|OrWgyqGq|0er6TeJ9|rtUvZaR5|qFRbwp3Z|wNs0g4GI/,
          /fmVkuFOi|lRxHzo\+n|m9LeRM7J|XcYrHW9T|inWUPijS|Tui2CN4\/|i\/L1\/ADo|pmQR2iZn|t41zLBMf|z11X1z3B|r73dkbS4/,
          /hfhDW3wP|93AhEGM4|SznyY9ut|p1\/UWuDY|S\+vg3gH0|6vH0xnHS|LZYHTKnP|m6fPfSY3|\+RTzdKEr|OmrWBmH0|YNTf\+A1T/,
          /hD8O3Por|nYJDml3M|9pnoyXJa|R6i15q6C|gZA0KgjO|jzKOaqx8|u\+0Xo1m4|GkcVHBSX|iLj\/WaOT|5bAR4Xhy|12LHRxPb/,
          /\/AW7\/Ksy|b1\+FlXAd|Y4TLn9ch|GaWUnIHY|IwMdkxhg|Kd9Od\+ll|j0feJHM\/|AFonFeSt|oanXvTQv|OGYZgHfF|inewyoD6/,
          /GqwLIHbd|IaiG8Ldt|IaiG8Ldt|yBk7lxFv|sfwqR8K5|XXOE33yF|XXOE33yF|qGP5ax\/A|qierxKTd/, //t40
          /PPQ\/\+Gc9|CsUNVgNy|KIIXQ4jW|ZsuC7kKg|my5\+Y3yR|KfuADt0V|MtFfEjnz|sPTDNhpM|ED9Hn4G2|i3an65sS|zOmi6LsK/,
          /QyFmDwE4|GJzGbIfq|zOmi6LsK|rjbBwiwf|xwWKhKvJ|3M8VJTSb|WsyVbfIw|WsyVbfIw|xv9Rwo2e|tbHUsyzW|XUmPKkRG/,
          /XiSKNf7z|XnySI6GQ|jUG8vGPo|wlDR21w\/|CmsD0HcB|1LRO23Ac|RI2vEIY5|Y\+hxCGUQ|OQoZ9ipl|YjJTF\/GP/,
          /XwCw\/i\+f|xyeVaHq2|6oZRseh6|eSiv345b|ek3roU3u|3lcoL6Vs|oX\+wNcd1|cc4s4\+s\+|QiC48J2\+|pF8A9T5j/,
          /3XNCUkDx|QAqTpexp|NIB5HJzp|JFravz3H|qYS0LESQ|6nXuOAMW|c88jYHAW|hO76jEef|zS\+D1K3f|JRp7tFHF|u\+X\/xkKv/,
          /Kgny8DCV|b8MVHZon|rD05HRLB|emM2P8Wf|Wol6P6Zc|AfEl1mi5|EoAF6WQP|pW0pO9yO|Nz1hbAjy|9qFQqwTa|8AcokNNN/,
          /37YSBL\+Y|V87BMx5H|8tIJIDoc|PYpCi\+lf|XwlKo8ss|\+rP4QuKW|ynMh6vIM|JRKZ3dKM|vAf3x7WH|Q8LW2n3f/,
          /FBNubZvC|8C1AizrY|F5SWM2a1|kcYkoFf1|iMwCZgB9|gEtDley3|qv52gHA9|iMwCZgB9|\+zi9oK8G|3sDaORDZ/,
          /ZhXXg380|YWOMbxQ4|xtwhMWgG|rn5ws\/oQ|pVZNC\+WI|zpVF79mA|fXakg7Th|qSwULu\+B|bGTzu19a|JSudsVdG/, //t39
          /4PvG8DI2|AlF7o\/Pe|X1jmYUJB|tPzlmyLJ|M8IZvTPQ|1Cc3Zs14|wQUPg\+1Y|YMheJPa2|U7MAy1WP|1LaymJeT|ZD91j84S/,
          /PPDnwqu2|EBI6qY2R|020O5O3B|w\+d1YdYE|mHsMurKd|nCan1FyU|MAR4Z29c|Zar0S88n|mLM8liVp|QuhiDiTm|dwRbDluf/,
          /1ESbPxRv|PqTAklZL|yzVH\/K2F|wq4tx\/3C|SpOZmexN|hyAkas21|1Sog86F5|wX36Kf9\/|nCXynA81|CUx6AG3d|DLbTmEHM/,
          /78R9xUnQ|vrZfAX2X|BQk0fTsk|ip3a\+C0R|Y1pTK2BW|zEhRnMWJ|D8C7lZo0/, //d14
          /yeWmgwVc|s9El7CzC|xaWCcYZd|yNCWE6Y7|dySP5pwN|wOifQkHl|l\/lyD95n|GFBfQXCa|NeX9f0Fw|NT32x804|GB0RClYc/,
          /Kbc3W7zt|Eme\/eyMK|J7jRkhMb|6npvAgdA|9DOAoYwp|DHDNytBV|\+U3QUaiO|J7jRkhMb|NVG3lsqX|\/S\/iDAmR|PKaGY89S/,
          /CO6q4lPz|PSImNT\/U|uBBWxYwL|Cmgt4Xkz|MzGv9PY8|UCeCSEGZ|avnj\+k4S|K55ZWeDf|xgrqTWQl|\+92Ct\+rZ|74371Zkr/,
          /4vharosE|q6EkocDR|u70Milv\/|rk7gwSVT|8iiR2oAe|vo9LeAl2|MVf2YgRm|HPUzcf22|fzSJ9m4Z|r\+3LnKaz|WurzffWp/,
          /LRTEvjLx|f7rR0sTi|S0XLz4G\/|mvDg5YHm|VaOnUdKr|OyR0fUdC|XEZDSeBtRhECaW3E|y8GRfEnb|Bb93nFBg|W\/kHwMYD/,
          /XEZDSeBt|UcJHm1Zo|m\/8L3IVI|O7\/62LDt|vsEym1uO|lXsQ33R9|q\/EJvl\+p|QaPQpjHh|IznyuSUS|iG4Hpm2N|IznyuSUS/,
          /AtoE4y\/j|Com8sdIp|OgYYnI2U|RelWWyVf|XEZDSeBt|0GF404Oj|\/8n\/Cm\+L|UPKVIVcu|RLj4jM8T|0ESkFGpn|2eGd3jGs/,
          /RhECaW3E|y8GRfEnb|Bb93nFBg|W\/kHwMYD|O7\/62LDt|vsEym1uO|lXsQ33R9|F3B4DJhs|MyPRGvz2|zUZRSzBm|q\/EJvl\+p/,
          /GDQLEEyM|Q0Sehmu2|ChJ2m3ZA|8\+zRsVqw|0kA9XspM|H2vKZS1U|ExFfBDE6|sdQbvp8R|54jpgu5x|jsCcSQqY|CgpV\+r14/,
          /KyM8sP23|WbingSTP|leFWK59\/|36mlPNX9|DfTVfQoI|WC7hgBVP|VS9pQlqE|LfFxPPby|P\+nYRDPD|4O3gzETs|f66T\+m7g/,
          /Qz7rpmDO|dgb50RBK|DBqCMIGR|DBqCMIGR|acmBGDgD|jsCcSQqY|SkucdjjN|hR\+WoJx8|LYsGd3i7|npLvGHt0|CHSVRrQG/,
          /RQ4qjS0Z|yiQIT1uI|eVtATC1K|6kv3RHc5|6ZoZotjv|CqhTHdeZ|nG\+YrjTT|bpFd4AcB|KuU75Z6x|vRJT9g2U|jWuHpRrx|hek9fAAA/,
          /zV85DOab|ZDkx0gTh|Ko6Eu0FR|xZjiOoRt|xZjiOoRt|cNI\/3cQOS2ib3Oqv|nMMZtYCS|mAR0bAWa|XVnSH2Wn|junJscX9|k7XOt595/,
          /ry8juu\/Y|QKUxBNI1|RT8w2CN0|G\/N74Dzw|f57NENJ5|wpQBhJXa|0yKUGHgo|ibh87PDs|ibh87PDs|cNI\/3cQO|5ngbuE3q/,
          /w5C6wA0a|0RwOHytU|ysdXEhWL|CF24pIfV|Tqxb3o9o|F6PMnORP|X10ea\/Kb|y5bet\/\/I|tnBSJSRN|xEH9SSkq|xGxEOn3b/,
          /p9CPKNun|Nr9DQlpY|\/ixw4oiY|G150hAAs|\+ihz8NnM|lWXPfCEB|0kd8yEBp|mAhz\+k0n/,
          /rG2nXYux|b7xZzm0w|40GtsLuf|sn2kcq8n|GcH1yneg|tyX7Tbl\/|VFKoCRlw|GcH1yneg|xuoG\/fMI|p3BdhL\/z|\/oYALwsc/,//d13
          /T1EUam\/Z|aXI35yY4|GcUpDDUW|NuYMfCDo|OeKd25vT|IvHZdY\+c|54rUvVS5|\/bC4BtUX|8RGrT8u3|sGknBYA4|BDcmAFsQ/,
          /g\+L\/5W5D|Loz5YO1o|Dj1ZJA3I|CJe1chrI|FgLpTwMH|81VRtHTg|ARnzDkkR|2SVswFA2|\/VtE7l5T|5rM5E1Vq|Sv8UcrdZ/,
          /BP4\/vmI5|QN1febQW|auQXHP\/\/|2vmcjC9W|NREtu10v|fZgGXWPQ|f2U\+GaER|9xt6mKcX|XuSdYQPt|uLukeNlY|oCUyT6O7/,
          /YFp65IiQ|QiR\+\+ySh|uk7Ni4kz|s4xeMJ3x|Luu5bCcR|FkTWmIP40|Uw3hXRyP|AGLRFyHp|RpYO1kqm|pXlfagDy|23k2glvX/,
          /sM7HpAfT|JA56Vyk5|Cn9kIN4e|noe2zM\/c|VGKDHfsu|F5rgCgS6|lz0\+15Mj|lZ91ukC\+|udntzkqy|OoYHQuOG|UYz1ZMhp/,
          /2UkVe29F|ls6MDv4f|YCyjgdsd|tFRRKlVP|ktik453c|l5ioRKar|2pPORlGK|bjQG8VIK|WTuv42EM|X91iCDId|hlAFwokA/,
          /F5RvqFZ\/|xaAkExEx|1fUgCexX|e0w7Ap\+i|4ZYrUJRg|pRHWidR0|Xaqh7mL9|9S1DDPll|JsXUZlFp|K9HWBMKv|bCvH4uFt/,
          /jGbedKSU|LVOKXn4S|0j8TqoMM|KeibyssI|V\/8bk4M5|YiUfJ9\+g|mPynOAnE|DzKAxk0b|2VYGKglz|hyrAMzmV|FOCZiBWv/,
          /DD64Tm6E|qLI6EndI|kghMpKPr|9x3b67Gf|ZKQMa8p3|lBJJHQM2|FDlJSkJ6|FDlJSkJ6|FYtFomWh|vNGrUCXh|BSrvN9AE/,
          /m\/yBkWAw|ql2lHc\/L|iva9\/Rci|T08Frzeb|OQptGPcQ|xwQl6K1h|nbYcCktY|PFNHtYsC|EMFFGV9F|k5aXNL6a|lsHaZLrv/,
          /omnm8187|sNme1OIe|j7mAOdFW|4s4Inj4G|QMMvHvNk|2zKZbyRd|2zKZbyRd|kfuywPmH|rTSgbzkj|qT5VsNtO|d0NoqL1H/,
          /Qyow6jaA|NQkQNzFz|GV5hph33|zwaY7ZIA|LIqmm5AX|dOQSX90I|s5iLbpv2|tJ5y6SNk|yYmkoqPv|pVmL0kpt|heZS\+tca/,
          /NW30G48K|0k\+rqAOM|L305i50R|6h3AB4Ol|2F4HGGlg|uOw7f\/\+f|wMb34U9q|BsPSjmGS|Er4A1VRd|roXK1\+Q2|52ufXI8l/,
          /NfXYxRwR|ojSU2iSZ|lXr42dJW|Asb35LPP|hEZ09\/a\/|gfpB8JRW|uxV6\+zUb|sIP48Y10|qfAOYIxI|\+37LEktQ|OT0kou\+z/,
          /2ZQz69Jt|Fs\/xEbqE|8JK\+nzPF|3rScBODQ|RZDE2KzH|aH3EZYIf|IWDfEm6k|yACVSMW2|3FwT9LeR|I\/yxzfC5|AN4o\+7l0/,
          /4Q2MevKp|i6lRYN8T|7yASSFNb|7yASSFNb|iKkvNmsp|uSjpSxGl|kOSRncga|mqzj3\+\+S|DkoYSGiw|S9\+g\+M11|RDvyL8A1/,
          /TzdqhCzF|3SfkdRHS|moiSBADD|3Ml0Jkin|3SfkdRHS|AjQmvdkS|3Ml0Jkin|fmmWdicM|2jVP4DsW|JVJuM14H|vn92ZLxi/,
          /DALTgdq\/|RlSGExQ4|hWPY\+C89|o9bpY2y\+|Czwl6tEX/, //t38 202-
          /37dt2s7H|zUZRSzBm|mQVycKtd|aMXLRe3n|bdnjiUPt|8jRCBUey|aa6DP0Ko|02lxruL5|nsnD9MyO|QlKnyQ3p|So\/lt477/,
          /\+KGQdbuU|PWb1gY1e|lhT8rDwK|fv3PJela|E060\/V0z|n0hspWU\/|W6jYysXM|fRxKRu4J|JVxjVq9v|ZVGY7jBP|SPDGt13J/,
          /fs\+sGloT|Qv4FIEcP|wT9Fs8tv|AcLiZsKm/, //s Ad
          /Co10uGlp|0uH9J5TG|QaiNggWB|S7Kfjfv7|P9KI3O0e|DS9zAWKR|uygYbySz|khAr7utt|nTu4J\/zA|XBIefPi5|8LuQqqPG/,
          /jjPfNvaY|tdPzknOr|loy1AZuD|WFd4n7y3|2KP6Jl1o|VJ\+PPGeI|4HZSPNAL|pnMBgYSM|SSNrV8If|hWwGYNP9|mj\/LXuIT/,
          /DJNypQYR|gg5Gwktu|pkB6Yw8S|csnVds6i|mil1rnGo|0XTpOpjs|zImDUlLD|6vYefJbF|DPss\+c5S|KClTpz8y|Z\+NaaLDr/,
          /cYOItHVJ|U\+w3Voft|uRoGL3c6|vM2bdF7U|\/UNuwMGd|YtPch8EJ|xthblWSo|ozhM9FEN|w45AC0Hp|0TMd40lA|kah\+UpfY/,
          /2f9mkaMJ|exyZ53r1|RKRRvTmZ|IlR1RERT|\+KcYfEvR|xj573Na7|V9HQ1TGs|ltLd2LBf|lWyAbLIq|aLizJzOk|sDXsXz\/U/,
          /yt3iP3RU|P2ON\+SNF|uVtoBxOY|1FgGyyW4|q3\/KS431|ZI6VtQ43|Vpb07EpC|SFp5C4Ue|45j5N7d|eTTT5PZ1|QX9iG4Ij/,
          /sOavFU1\/|0kbuvxuo|sRCNkOVC|JhYb2tTY|YP5\+bXLM|hqJ6gTzq|MJs7DSkn|7WyTozsA|IXnHNQzS|ljFbLa6v|DTBjqlK\//,
          /Ne13bOSQ|jXBMNdyH|sw5aM\/Ze|cPpuAFk8|i8cAOy1v|\+wz\+\+vcn|HLd3UOtp|d5zklhvs|JD\+3W4is|1EgN9mX6|znoljmLy/,
          /W6T0RaGD|N7oRfHwc|9FpDrgqq|6GxFmGxY|EoaQwWdG|lpXncqv9|er\/\+Whke|iKshmIYv|RewxxZtd|lY0mmWzM|Lcga1vkv/,
          /Z\+9tEH8z|ZHgRPxWf|T2huAEu6|uxPBVgiI|kfpDNX29|6XWHIj1H|Nlm41FqH|c6d3nQfH|LjT\+yBQY|LjT\+yBQY|ddS73E6m/,
          /8VIwbL4N|K8ybAv39|Tu4sAZ5v|yb95lwqY|SsjkFjMO|h\+SowUUK|5nT3sgOU|ompekJ6g|xY\+uzxAH|fN0os\/B4|VoCpizWr/,
          /BXyKw5t6|nfzaGOvS|3Xm52aXx|rqOTUmtE|x05SrgPW|4jJN8M1k|J2lz2yFc|4J\/kkT1K|RC2kSSIe|Z\+kzSj2D|PVN3gN89/,
          /k3VPJ6R\/|TX0FYkCW|WMdLNV4v|eSsQjTFE|TzzgAoQA|60ESOBo2|TMszeemg|foKVnHB9|foKVnHB9|lwuFQ0FZ|Z\/ldu6IH/,
          /wT\/meu5G|ZvzhHo\/q|0r\/xS\/nR|ko9pCuM1|0vYlWtRD/, //d12, 929-
          /fIJ\+5YPb|LAm1308G|2Jut9Hxy|JGgBRX9u|KsG8jdvD|y1FV8Uuj|IwxhMth7|8lFy6lRX|\/Z3T67O|WQ9sILit|6Sggx\+ff/,
          /ybp\+SQsp|wdJrT8ZR|bULArs7K|\+NB78VU\+|MOgIIhRL|Z86zHhc1|uifbJlH4|JskO\/XOq|Saz04syE|HOhq\+EGN|ue9Gw2KM/,
          /zw5YDGxK|psQ3WJsJ|gaP9y2V4|5qv0Rt40|O\/R8Tqol|VGRHuet9|T1sl1hUq|aSqBK9d9|BukQdqGg|Y3BqEDSF|pRmyfNRc/,
          /FPRRClrW|avSWIbsj|rnvmlVV9|9vmmMxU1|98L98iqD|Jq7RjFUB|8QdTTm8U|idTImWHi|DL\/z\/0zz|MYYwyKqX|Ba9N\+0u7/,
          /2GTFVgIv|PvvQ4M3T|TjeDtKjH|begxuwzJ|lc\+\+IApU/, //d11
          /hwAE3Ptc|104JES1R|f5y8meZu|Be67qIMi|0f7v8lNj|Pg8v4\/F9|SXynTeWP|n4XPbzmK|Kld7o04i|CW7jpGXY|bVsMpAAZ/,
          /9t\+SEMIW|DJa5tDkY|cGxhR\/Vs|XgGUm\+M1|BVo78\/2f|bbk20U40|WE85ORXf|N2Dyz40I|\+eaOSUaN|jV5N4BvU|0i1C+IEk/,
          /9wGzyoDB|SkJ\+4Opb|veNpo2\+s|oCGf4XQM|iPs9M9Fu|LKsCEHaQ|w5UIa\/by|5DpmnQnz|3bJ2bXk5|mMZd06ot|ZSWsOvpG/,
          /yRCHM|ykyp0nTT|Du0arnK0|ZadhgSwD|u13uozM0|Xu\/dt5FR|2QfX2RI1|0i1C\+IEk|vspQCrm\/|xYvGPmAo|IHYr8G\/c/,
          /0yYdk|z8K8C1oR|WB1duQP6|sYknn3\/5|JCzW721B|u1UO\+\+QV|L\+24FX0q|fZILE2hz|Te28EPwv|UZBBh4JG|cWe\+SPrx/,
          /8K8C1oR|w7nqpKJ1|WRGfAl0c|\/DjNJqSK|uyNjNHEd|vV4SJBSO|B67WZEso|QxO\/ozK7|HKjeHF\/u|AVr\/SucX|jNTGDBKi/,
          /HrGAILqC|n6XIhL3R|4G6IejRV|JGBLEulb|HkDwE\/k8|9o1NB0xF|ny16ML3H/, //t37
          /mvuR3yvL|xvG\/mfHY|uDxOTscp|NrPuqUU3|ZFKJiIEl|Kwtj2NG3|ncszrVay|olX93oMc|hkNXltxn|lPaMNUjI|uyHCYZ1H/,
          /lP\/5givq|D9qEJWPz|xLhThr1a|UJpelcKd|BRyRZCqE|il2CmaUy|Fb3FcDzw|WeQz\/zV5|JlNNfw3k|0h1IWF8x|3WJz6Dfy/,
          /gOUhQ5mF|vtTeQmM\/Xdd8dqxo|XqckSuzB|ouMLLskg|9SHlxfL3|iQI8hA2F|YTwnyVFt|ti7dMlsg|aWpjReYh|tC2sMkp4/,
          /Z3IMBOUX|BkWqpsVd|8dYY8SvM|iDXe\/Ome|Trdt4w7E|Qa4Qzj6e|XrQ8rCec|SRjwgg5Z|B0KWoWKq|rp\+c7Rk1|mfhc7k2I/,
          /Jjth0vzt|Ei1YAl7\/|YQw2U8c4|qtyBZZ9v|jYCn9IZj|\/1P9OvFm|YqK797hv|PEas4HpU|UKDaievM|Ad7\/ibV7|pO65EFtV/,
          /\/Pp2Wb2a|1RGcr6bf|tZNoaGvb|RuN2DDyr|yg4UA90e|h0WXYysR|Nk\+k5cNz|bdhZLPRx|\+s0kL1KF|9cfrt2KB|k33g8ESV/,
          /yUZiER7\+|vlRPc08\+|WA8VGV4M|aBbshD8v|B0rW1ADN|HJQl\/RB2|vb4elol0|x2CBSxAc|Dr3IvWvD|Uo\+SbbQL|QnljZK\/6/,
          /1PaGj\/ds|eNiFAxM1|DLe6Gp1T|WZiFQOL0|ohxJOLlF|0rJkRm2a|Gce\+pYGy|44BBYZQx|ix2pHePm|baMQJyOC|4oOasYqD/,
          /ydwbXdJ9|da4BMtut|UPcKdnQx|QNYVFDju|TzMBDqb7|K5\/P8eFs|co05cTww|1Njdm3fn|RTc2L2o5|jZgxWVkf|dt3Kdol3/,
          /plLuQZvr|R7ddQwmT|64RrQepR|b7w\+\+uWb|qHANjYqJ|IpgeI3FV|hoMj56Xe|UmZbkyVr|vx93vCgL|\/zCX7gur|gWrTyjgC/,
          /V6jlZ5qL|dyqlaYWs|Zf2n\+o17|s8yTJLj4|NgaOmBid|LrDZeqBc|H31Ta4z7|NmxMll21|epSOLmf7|ZOEKVaRp|CLCFP\+mk/,
          /livptZkY|mg\/qfXa6|WWTVzupl|ApdNMK0j|eVvm5a3Y|Zc0TDbIG|WYRDGHkR|uWxweqcI|Qa27q4Gb|0tBHgNGM|\+RQLrfaR/,
          /qTyf1XaM|LQG3IosN|QZ7IsCe\+|B\+3pAz6k|sLghoVlu|ToKm549A|\/FQJtfsM|RZEYR3nZ|x7iMlIDt|yLiX3SUN|B8TeQj43/,
          /\/AzxhQeI|4KSeebNx|VMrvx80m|b3GBtb\/L|pbQ6TtJe|spa8faPD|K\/fEFqNl|TAhrrZY6|AGvkwT2H|jc0n9bsc|XEYpUwty/,
          /nY6rM\/yV|PPuOXxuV|HwapwEsR|xcfDxtTM|QgvnwYQR|Js6WmIfi|dyRtb5Zi|926vs\/lE|y5RKKEuW|xcfrhAzi|hf6gQ1C9/,
          /J\/0rhRjN|I1XEq\+2\/|nwR48nhy|bEBBRyyN|ZiteiEtD|HCVp14aN|k868LbLN|9hims3X1|FcDQyfHf|8TzEazfJ|c1rVngjP/,
          /T26n36Mg|1bdQWPqT|\+5T9s1TB|FK4mui2s|TmoNJTvb|COOOgGtj|Abdb06\+H|X5bXjeaN|gEkbKDXe|pQ4UEsEX|OAy\+LJYK/, //s Ad
          /qKNEhM20|xWe1rtO2|lkGEVEV7|tKdPWhP2|i8kXUN2E|f6v3X56\+|4d1\/Ugm\/|xhih8X4p|p\+0yU5u5|dWsS7L9q|VkdrFeUS/,
          /rkLqR8q3|Vy1WSpTp|6bxTNpB0|dEONU4ua|J8gU\+8Ty|QShtoK16|9W5pIPz\+|2dFSGW3T|gDFWHh8r|naXmDIECrTXR67cN|aE5jP0SS/,
          /bj7dwETx|1DbS0lDC|Dn5TbIcz|DeqG75kV|fSkTQlef|tBpTr2fz|N8mkuxZE|HNRnjK6n|agyuiPei|5QnIxvW1|uwvLz2vP|K3lKhiUo/,
          /b1WAZeHW|vQZTJBkP|g81UF9XQ|mzCmPh48|n6XIh3LR|7VB74jXY|45CS92Ss|ET1\/1dwb|oteqN7OF|RMlhGr7A|nAXY5Cdg|oZwmdY\/E/,
          /1PxZH55D|yGqoNLcG|XxO4Ll\+7|Tw6aL484|\+0ODONju|7PKnPM1Z|tG5bojuc|lGq3rJJK|moqXZHpL|cUxEZD1Y|heV11P\+s/,
          /Zyaac\/vY|l9O\+uItn|05qb\+d\/q|qHLFf0Oa|Eze\/zxkb|FchT849x|Na8f\/tDh|ox5V470Q|Pk0PkO0j|Yd40LZXE|3dx5VGKL/,
          /RNt3jlmM|CmS3CwJH|J\+G5Ncja|RY6stMjf|Ge2d1ixW|dprU4lcu|rqIyceAa|omJaSP2W|JQ2L8xxX|cRF5NWW1|nQAEWclg|\+sMlGvsS/,
          /rTFRST7A|\+zga\+pC9|Q\+TL\/mFH|lf\/6EFZr|XnpgfDj6|FQj9fnpS|7EdNqIff|WtbzGoOE|nqreW9Fh|NTdXGSiE|bEOVVwrr/, // d10
          /JOI\/yjmr|RVX5ZM0H|w6T8nOxT|8f6FaGDM|Rxxtj\/vl|b7Po2Fdg|\/BAs\/9ff|YXjAXJML|95O0kZt6|M\+RPjZhY|DnkNzh8v/,
          /uld8nFOd|wlkUn2gb|3ZHy8aIC|5dzVYl21|NMkDoQZ\/|FXpLVBjA|3Av61bNz|WP57mEdM|Gsbbd\/sJ|gogxVTE3|b8ZYMjwY/,
          /DDmhlPH\+|b4RImjTt|IQMlB7QL|MNF08ID3|2L2OxA\/V|DWXNSl6A|xmlAtovm|lsQWEjX4|ZtMuzm\/A|B8\/Kg\/XR/,
          /71tBWPiJ|XyjgpUGU|u2wt1by7|ki\/32ped|LZ3PcCiy|NAfVnB79|ya3Jsq4X|9KrOraoP|\+CB0NN5M|kfA6DxbY|\+Ze4UXvX/,
          /2MAIz2oY|ergX5N07|qoQ7Mc7C|L6VoxvGg|0QQogyfD|i3rRGGwO|CEZvxAsy/, // t36
          /Mk8YC\+Io|zHuDrQmZ|ZqvWXNMl|mt2BMbUc|qmAQwqW0|ABsXc\+QQ|LA8ff\+aL|SVS2Q2hV|NkDMaQmB|e7l1ow\+i/,
          /adzMZRWo|cOeO0EYd|jXZ5v2ec|5Gfwuog8|k1gENI08|21I\+UIV8|CJyXTeqj|K2406l6I|FVoBS6QL|hlPS\/Rwq|\+LhvddGG/,
          /pjrQmfOv|jL8\+btQZ|pM0IPZ4k|o67\/HMJt|vhsO2N\+F|KUPbLDZi|cL7dCeQQ|8KsAjgDP|VTtVbKRK|f9V3RrQu/,
          /G9GhHizr|QSpOLM3d|ERhRY20P|RY6ZUp3w|asirxowx|lAa\+\+qa0|mAep6OjC|a2l\/bYMi|XFDEk4Yh|dhy\+g5iG/,
          /AXc2LlDr|rQbGzYCk|PI3\+vaY8|53JUrPpZ|1VDUsnki|BBd542rH|eAaVMjHl|AAzXPcCb|7k5j1TP2|hN\+FZqmG|uYLNEu0p/,
          /XQV4CPVQ|1U\/cH\+ez|vlbtimJJ|j0POI4ln|3QlmbUqD|sPjqwnqW|01i7nm4a|rILQLGFg|AqYDUt1P|UYKgK82Q/,
          /zcrAeu\+b|mwKDLr8z|\+j7KoXRV|jOwSykTI|0JDg0D7M|hUfmpC5f|Ll1NutQF|0d\+4OcDh/, // S_Ad 2019-12
          /nm2Rq\/pW|yn\/g4G8j|\+M\/AaPKP|sDwioxNL|xx4wBlHE|9iRKsqpo|WD4wModr|CVa3pdtY|\/lWvU7TM|wfEVVJ5x/,
          /Oinp26dN|w9w\/RkvR|l5JXn08a|wNqx7NzK|xMR61KmV|8c5nQmSm|kp9teajv|VWJPjuf0|xxKBglbG|\/sUMHwe7/,
          /ru29O7wK|ujgRkkNe|stgolRUG|wSeEsgjq|ciPsjkE4|wXI4JJq\/|q0GdPz5I|TSBkqvqL|qhke7zkF|tqL\/PeKe/,
          /2DML\+UYe|UEStQuxp|1AOTMA4m|Ke\/IIEr7|cKVvGdTA|BxldV09I|CNueFqlL|wJ8JdW1K|5ofwKL0i|URA1Tp4S/,
          /723dAeU0|pizjjD0B|3H4t2hvhL|3hqE8oFG|H4t2hvhL|A6wIfu1u|Bt2oZq\+9|hu\/\+8bdv|1uyZ0FkS|lk\/fAn0S/,
          /wuBK3DFH|5PnJIGGj|y5B39fLb|OpI\/fZK8|HVc550N2|uvvLu0bf|Sp9Bc2CR|DgR23coJ|teRD3gl3|1sRaxhBg|ZDAXcYDW/,
          /RQQogK15|d1ymxaWG|iHirX97l|oUfbVFt2|C1kli66\+|YU66\/gza|cfjGWaCz|Z0TX4eNC|NDkZrvFx|\+DQunKXa/,
          /2M8C242p|0TZiCDxf|ncrAanZm/, //d9
          /BASu58dU|jrW2pT99|OeXkrBUZ|ActRWfBa|uyKsB6IT|52u06ssF|GK2dl4\/Q|ZMlIAAdS|ghj5QFoQ|slk\/sNkS/,
          /iNpxYEKT|ANQqLuqK|OUdvFPEC|s2JbHLIL|0HoCPgZ2|wZB\/oNqi|3\+umScQy|yae\/wm\+y|14jB01zd|EwKnRPtk/,
          /fLKKVEGq|q\/wpu\+Ie|lrvHCugd|cSWml3I3|TE0X5pE8|QiMCWwSz|f2heDLue|oOSpy6ln|0my62lBc|1WJu\+p04/,
          /4\/Wak13x|cYwtKm0\+|WTcudiqL|pJLf79q8|rJ6RDcXt|2UPJGyg3|Bp4xpwnR|0UjLzMSl|XachTIaI|XJo8qpNl/,
          /2yCQ0XyR|DAKDS7N8|gMyMm4av|HNg3U7uf|ZWH5mxfg|lJ081zfK|Uex\+TP90|oPXTB9RC|Bupk4SBW|vqFEEpqY/,
          /ch1SOWXS|QtzlIJoU|\+r\/v27ix|sTGlcLsj|N\/HA\/ycJ|I9tcLcvs|dSmuaEG\+|9ZdSI7fK|JiQcQGDa|Hxc\+iLKL/,
          /r9OB38Ui|g5P5o6Bj|TLfN\/HW2|pk8XF6VR|QNva6PHU|8uVCcy6A|GBAlICBb|UNs13H\/B|\/vI6AzAM|3OVmy3GE/,
          /bcsqt\/Ad|l766SIQ\/|pP\+l9p1K|EPedSvTP|yVnRuJdd|3Fgs\/aKG｜kD7V0Xy|kD7V0XyC|NdiqlM34|mclWKj\+8/,
          /oPBfSuWd|ejzXoTuH|vEnDQ6p5|T9vygxtI|YFCj5WoF|0JyIl9wO|cPQrxda0|HwTFKF5n|nWjhEdH\/|kIdKgJau/,
          /8yjJWHdS|6w0xI\/\/R|Y\+aT0cas|MwIKCvRO|KRB\+OEPx|LklS3LwU|Iw04J04x|KuBSh\/bL|Ml0BBiBO|Pd1CSsZ6/,
          /oylK2XHE|9wfKfRVl|uld8nFOdVBDiPZnj|0G2rnRFz|NjB8BZTx|T\/9nWZAR|S1pk2vyu|sLafCjev|URmqx2aA/,
          /AcsF4cne|vdLXp0jI|fWPbqILF|3Fgs\/aKG|\+K\+EQz5t|IvZxL9h\/|G4aDLvpK|tcvfF3kU|ptQ1hQrz|vc1UG3iH/,
          /y1MdAjep|zXmz8PP3|\+zp3eZqY|zZMY6K9c|kIPYRjiK|wjd2oCN8|HcJjfutL|ndYDuS22|E8Y8\/Sdx|LA97H0qI/,
          /X1n4N81j|bzjaRjpU|i7S4tMLv|RKQz17os|ECl4Ope5|cN8S\/U3n|cXQJTURJ|T9Fs8tv|t4qPbvvw/, //S_Ad
          /4T8RxHK5|DeGsHVWg|rdarYvWM|AIBwSOXU|tErbK8Us|lz06YjZ1|soVr1D1V|REql0Bi5|XswYKWUo|1M8Gcnh4|EPfD0FYF/,
          /lGHlXY7\/|356OxTfR|jZbxKkD8|PTqoHiMQ|DHqOPBli|YvK8trwM|06vea3Jc|oNtx\+7VY|sh7mpMfl|MIzHHKbs|7o8lDf9l/,
          /Oo5owBsG|ew\+vHGTN|udxWymje|hMHBXfdo|TePoHev4|19ViJ5Dd|X1o25C5l|dclXT3Yw|SvxMxe8l|473fh6FI|3Y9WbBbZ/,
          /Z\+HeMl8X|pL7yFJnw|qMhLcMoC|4Y0BYXhG|Jrhw9EM0|5avtvYxP|SNp9Ayah|Sp4VMeuE|V2ZAirfp|kVGHBcTJ|ovgIwJw2/,
          /IRtnqJ2h|\+CmVBruu|G2PoBTnS|hQSNBHro|yR\/gh7fG|5EDMs8e\/|hfvzxxsd|NOWXBTX2|qGk3FqEu|3GTWK\/lk/,
          /5bGRrRML|9n2V6VTl|fSoZ0HXX|JBush5IY|aV7mJVY3|Yw6QCmBp|\/7kjnleK|GwwSYXBt|UG5AFlbt/, //d5_Ad
          /3ex5ClNv|pjN\/kPzy|XbjhiPeI|\/vPO8Tob|20uE0iQH|0wfv\+u6g|hrSdzBMs|kvgnngEL|bpTsOqSF|j3V4s6Lp/,
          /\/1IzFObK|h9qmSFLe|fPF1Ur5\+|kHu0z8fF|uKtaoIFH|wEDXIj4y|aDAnOvly|xQqK\/FhD|S88H6rm\/|uzXlJZPU/,
          /9cT99PrE|Z9ftZrLw|AuEs6bx3|g7EtBqUl|DoyLaMl7|llkB3QIn|oOT9bWkV|6k1lVwH\/|I5Y6WeZl|KWEhZoIO/,
          /M\+SY4CsX|OVOlddDd|hFsadyE8|\+SXFCc4V|r\/o\/mYGx|FHynASIp|B6V4pmcE|8rPw3Egw|GYl2M2gi|oT3b5rgD/,
          /ynj8hV4z|gNA27NSk|zfJ9PxAm|eGk3pkbF|EaSx4GMS|vKvGr0G1|GcY1dB3H|FGCFoU3c|7ahyb\/N6|dCvEj45j/,
          /TAQxMeAa|JNTo6sbr|oZvhkmUv|yR8IMcCZ|pqI6uqaF|DFzAwEVQ|tA7x5r\/h|ZEhofwFU|NlGOOP0C|HI507Qa4/,
          /jpuyscWW|0PvcxHJW|\/NH\+lVMV|lcIkJ4WK|K8liI2uD|Jj7vUgLe|cEt6w2aB|t\/VOrAmg|RbnKz4zM|pTJ5skoM/,
          /WO6IlCyj|I62mZXR\/|fog5p01k|A8pSxW5F|UD7aS6\+D|T3Zf\/7Xy|IsGlzx\+y|XBTSx\/k2|PzNd5AB4|xKqCDeWw/,
          /rkYKvbx7|7I2cokzc|B2cwqTg8|Zkt3mHNx|9c8OMPRK|2bte67Jj|dkslgJqp|DOUoRN\+s|9\+uHCTrc|yiei\/1Td/,
          /\+9zSKtWO|Jb51vYPL|c2EpKvWq|KLKMhhkl|AJs\+AX61|aw0XVvbE|iZqid5e7|WxP8fw1\+|bzluz\+rq|bnBXSoGX/,
          /19dGvd52|E6MUJJvO|cg9J0\+Tn|oT74WBTm|lZRLqGDE|S2xd0fjh|ad8C47Ij|Mvz3sDOI|XiEh3Ofd|EMlkslcW/,
          /P78LHWoL|1O\/pNN4Z|gYCKuE0u|M4YYNPKR|T2yfRV51|5UWEvwlA|Wim02s4O|ArN5HP07|ZxCDLYc\/|qSquknj4/,
          /PnPYwx0C|e8YAVS4G|Euz9\+erf|8pHL5qQa|LE\/61YfG|T7iZAc30|\+MPM065J|IdmaMbx8|rRAOvquu|FKnAPu64|KUNc6h2e/, //d6_Ad
          /4v4rYL0e|Q71xzUy0|\+3ax3yOK|\/LcmzCA1|YG1QoVEj|Hj6J5u3K|rVhMWaar|zR1dHmRh|Us2hdBjx|OQRhf\/Rb/,
          /CVDZu\+T7|iffUx3ps|GRkSPWhB|mV4gtlfv|p7FtlDZI|n7Yqtf9Y|vcer86gZ|rZMiQ\+q1|uxU1ZTQZ|0cEDL7\+c/,
          /kUkPtFmr|TRILjRT0|Ldvu66WJ|UF5lxlHj|4jrzA0TO|BmnXhnYI|Iy\/Xhfmw|wb1ZY3BW|Q5Rht6rl|Wtb6JN4o/,
          /ZUAknpl0|Nf1Q2H7b|s\+e\/ixZz|TNfG5Hqh|x2S1PvIt|kGrLSrbV|ALTMlYqJ|cUYrMtWT|wTTY7Mt\+|6MNkiN5P/,
          /qRWYdpnd|10ug4Pub|c9\/Vst\/g|O\+2HFZ8x|S1uN\/VXv|\+6W\/6\+F\/|eiLKzsB7|x93J4CZy|ceNcUGyi/,
          /0c1mxLDe|5N7mKYV1|GhOTwr4l|2a9Z\+8BV|WJwdTmQF|CHc\+Nj8B|JdIHFyJh|otN\+mqBo|EqyIgPPI|y09FTlAE/,
          /B3gfeIgO|Sylf5ea0|rLTAYvMR|CW9jtTX3|PBoJ0KSf|lyIJcitw|aEIfOV8U|o7Dw9X\/\+|rFQ0Ey5h|NmFSKrxN/,
          /u26GO8\+\+|00LKikVG|tpJZJNQo|fjGsltX6|ZWOFHdwb|Dwa1MoTs|r919s\+PA|Fm8rztzX|0b5Qyi7t|1xvYN4rB/,
          /V9yD9adh|KWKMf1\+L|XC6QoWpz|mc8SmwbL|Uw7yfMvX|cLJiOfQ3|8Ilcpmo5|filNfDEG|IUf4U\+tz/,
          /m2AXNKg1|GhZAqhzI|jPh5ix8b|uGDK8cA5|xOMZYHvk|EhkNXFkq|KE9Ozk9H|iy\+64AAn|qMKmyMFa/,
          /\+gDX17ea|urUGAP9Q|1dcnB9zv|al59\+adQ|\/C2FHnrJ|8NbFITtD|OvFmk1\/n|yj0v3Kuz|jUteNMEW/,
          /EAXAGI6b|x2NFJkTU|\/Nw0ismb|vuaeRqCH|gAFkEaYt|T5ZbRyaI|ApACyi1f|\/i6CGZNz|\+teii\/uC/, //d7_Ad
          /HLK9SRDg|XHAD\/\/6S|fCfSHAnA|CUjyvHtm|mOGuE9C\/|clwm5R\/3|5BMKlgIa|lQwUmIeb|RABYWk9a/,
          /qLGMydAm|0IY5RS0W|FoT9kBgl|p\/ureyB\+|d0NkozcH|hpqAvfrN|OEbYJAsR|u\/u6TFKC|4EE2uFVi/,
          /cnrTxWri|Yst2ma4\/|nMwV\+O0Z|cdBixFkk|WiyZmv\/\/|Ep3pWxCa|qkXsEU99|SzYOSeWg/,
          /y8GoOIfA|DusdwMgb|36UEwh\/V|tkl39x5K|\/4p8ken4|5ortEB9W|hNqM4tIB|wTh2Y0Od|cRgQbfJL/,
          /FXkHb5ed|BaMrYRta|2A6etXh4|T7NSRzXt|iesHqFOB|\/pK\+deW\+|83h4TUKi|x4Z46sxh|AeKGX0br/,
          /mTOEPWVQ|kaEoMlox|2nCEYCjE|z2QOOKMI|0eQh8tnT|NadRtglX|i2ZD2iRj|zV6KPCUm|uQKjpZJm|Fieudb9l/, //t36_Ad
          /HzJIlnoo|VbkmWWZc|wTGr5wAv|X5z8n\+q0|djOt3xlk|EE2CTFS5|xjHZzln1|M4Hf6O\+n|QArFSDkS/,
          /Ey8sfshL|zyvlV\+m3|gIfKx1\/N|4ztziv50|n1xxAqXm|otiEdFtP|VMjZELIO|K42JTwYQ|4lbnrat2/,
          /Bz0WgyY5|y7K64qUu|s31jf37x|D8bP06EO|ah0F4K75|dse\+pPhl|wl9Iw74n|Hq\/bWXAI|IrNmYpp3/,
          /P6m\/tCKN|qbUY2sGe|rvHheUYp|TRUtL08F|8fp8Puhm|OV\+a1DPO|L5E2G3VV|iemDGIUM|otH0899f/,
          /hwItzcpY|UiyRlCJY|xzP\+nwVQ|oxqAQODr|\/\/GRVdFx|mGzDpWd\+|hW\/evk88|TqPy9dRd|gcqTDOQI/,
          /NAK3JDbl|VSKqjBY1|z6tZD6DK|CpxxdfHG|MRgX\+nu\+|IiT\+q3t4|TKo\/oW98|s3hd\+WEI|KwJ\/LdsJ/,
          /nx97LrfL|\+NYrpnDE|GrVyn70i|uL0JoZPs|ViXFX\/5X|9KUpW1n3|ipIlRpKf|n8nJhgjv|JMv35B2s/, // t35
          /Xkwx9rH9|bSRwLT3l|5dGX0IPF|4zL8iWrC|D20\/vdVa|GjA2Yq7\+|vdxVHd75|ejBABWui|UaroiGB\+|KceRtxaI/,
          /\/U\+7NizS|\+qm4\/zV5|dBcDn38s|abcpxhx6|IIp9T5vx|mBBs5W7X|HC2V6IMl|gN\/8vdvO|KE9u1KbS|sql\/RmUg/,
          /Tnms5EAj|6IXxIsJG|feB6OxW0|qoQp\/c0P|OAIkIYpg|ArKTmxUJ|8jMFxWAV|oBJIkruL|u5Mca6Ed|qv4N\+KMA|x8WijgzT/,
          /zezcLthL|7fwI5U6O|9VzPpIZl|137nSdt1|8\/lgTRlW|DgrC27Uh|mKb1Fu6j|3haARNwZ|Wb\+6oLaZ|0hsSuuxT|SQHqKHue/, //d6
          /wKj06e55|aYT8rmjq|b7snW780|6phfryLy|U25UkkHV|WxohNAxU|\/yOKZgyr|ped1LSL\/|Q\+DKhStw|MT0171mv|GHIw48Zi/,
          /Cp0FvJ6W|kngf2GBI|hInwFB9A|L3E0rf\+B|0gZTTPhl|bjwXCRIC|ZfyYH3sB|XwltgXab|3l\+gVMPx|gPJwfnE7|9SGBXlfQ/,
          /LAZNmJ8a|EuFT\+i3\/|Z8HbAqa2|iO3W\/grl|pmAi2VVe|5avchtaT|nySyOZ7u|9THoDq57|uyNnF075|XavXSjPi|ZoqdkMcQ|5G\+MyJYT/, //d7
          /rn6zksgg|ccDN7X4N|NykBL\+w\+|l0BV3OCX|p4GaZlLv|Eq4vC4Ai|CrQ\+\/BSS|yAUaVktU|Ir1bs05A|c6mkgbd4|7BvXzMZX/,
          /zYjRB5R2|WdnQr1fE|eRIwv1vd|fYZrdVEP|AmyKIUEs|gLGC\+ktz|765JZmTr|r1L2zelZ|d7ZMvQXi|jDw\/iNil|Qw8ptTDo/,
          /M1\/rvI4l|lfR87uRW|Uzy9iunx|yjgGePAw|ZchkiVLT|oad0xqrc|f\/SeJKfM|Pa3\+iZ0\+|SCQPbKpS|IYDe\+L2x|wY7nPU0S/,
          /G\/eQEuCD|60LUi7dk|Xh\+DC26s|Jsg\/k2ry|Z0pl2dVm|ma3kf8P2|QdLyuH06|VtwZO7c1|mtJpVW9Z|TxGZ7EU1|er7jRUZR/,
          /Ydlt8iYp|LfwjZI\/S|055b\/Qlb|gzLg9nXG|fTizTQv2|w8ZAj6\+6|T\/9jaaeT|ZddIbVle|GWynbkpZ|QGQ9sFqa|z21mVX\+B/,
          /sVqIHHJp|ZaNsQ36v|v55CAn45|HgCmtq0U|CWRMKdAQ|8iJLjKFn|KskdwCge|Lj68HDzy|hAKAxXcM|dM4SrgQB/, //d8-547
          /CunXQceb|\/tKQrY5K|ogjFaFOg|fetho2S0|6VRpRn82|xjQth1t2|ksnE6s1u|IvH\+VLkZ|t8zpx9tT|p4tXcwVP|YA1j\+\/nr/,
          /wiiOKRve|djiOp4FM|2wgzO3bb|2PkgjV3V|3iRUBVQx|c7ysp7xo|2vKjZN1e|8G8o9Ivj|Gclgy35U|XUMlELOe|e4n7da0M/,
          /xrdXNEuO|4\/zHeSU\+|Hxkdi\/hu|FFJH4dZy|D\+v0ROMB|zboDiGwV|KsDv90Xt|19awLj1A|27zW3wXC|wBYGiVu\/|w5TJbjXs/, //d8
          /4HF2EMBA|UgPYjEEq|bA\/5dEzZ|86O0IP58|ziUffDPq|FUdKi\/l8|POk5pF7X|KEqrlota|fBjENeO1/,
          /WqmD6yFj|Xddja6NU|Nfdsfsah|vqonKsWr|\+f0Qarwy|ENujkzVf|Cl6rKYPR|q6FCfWt1/, //t36_162
          /z0y4fSXR|jH0cBzWg|ZP9ooQN3|Oi\+cOIYe|8Puhtc7x|FHQYgnFS|UuFXnTUY|WHLX5rkU|P5d5T754|vR3miCcV|tuvvSlMT/,
          /vJDpZM7K|vklEMXgp|rFaKXkHf|19lmKZ1T|Y4xryi15|M\+3gGq44|vCHMvrgF|z78u2xzg|UBYKU3VK|UTZjUwyW/,
          /4LyEUPYi|Xbq\+rpZp|BAmlLPMZ|uRPHu8YQ|bR65ZdXk|YizUqnow|nUNV1CVT|3r\/lT4XS|FStMTt7|Cl7insCk/,
          /SwQf4Bf2|Tg3jeI8J|6uHs9Egn|24wHWHNT|7L7C4t9o|xGEwDbdr|kM2ffcHB|NOygwOLW|bYCAvSA0|\/VQmkiT1/,
          /YLxv4XPw|YRNEdyCu|JeLG\/JiZ|nLgQfxdg|ouqOoqa7|uYi\+3S3v|b0PjR8Mg|0gdO13LS|g6wAC2QL|mdhc1V02/,
          /r9MP6LWl|7CEnqLut|8r\+TIv3I|ezkwCJfB|nXh7uTHS|T4R5kUqz|oRN3uErp|rX61MS\/b|77fZdgkd|82Z8mZDs/,
          /FDMOsREa|t7pMTIBI|N46hCBVQ|U8AFEkgw|kcY79ifk|3PTh\/eql|CoW9eGwG|WhDaTQBq|NkeKpVbD/, // t35
        ];
    else if (ita == "body")
        rPrefix = "rtn00000",
        idHissi = [
          /BvTb25lTM|7xmChLRrd|s7Qr2zeC0|GCZuCeWya|UOt7bvTG0/, //
        ],
       idCheck = [
          /tempids/, // e9 71-
        ];

    let aIDData = [];
    o.each(function() {
      let u = $(this), isHissi = false, isDetect = false,
          id = u.attr("data-userid"),
          date = u.find(".date").text().split(" ")[0];
      if (aIDData.length == 0 || aIDData[aIDData.length-1][0] != date)
        aIDData.push([date, id.split(":")[1] ]);
      else
        aIDData[aIDData.length-1].push( id.split(":")[1] );

      if (idValid.test(id)) {
        if (/Mb15XpYj0/.test(id)) {
          isDetect = true, countDel++;
          delElm(u);
        }
        for (let i in idHissi)
          if (idHissi[i].test(id)) {
            isHissi = true, countHissi++;
            u.css({"background":"#d8c6c0"});
            break;
          }
        if (isHissi) return true; // cotinue
        for (let i in idCheck)
          if (idCheck[i].test(id) === true) {
            isDetect = true, countDel++;
            if (isReverse == false)
              delElm(u);
            break;
          }
        if (isReverse && isDetect === false)
          delElm(u);
      }
    });

    let unData = [];
    for (let i in aIDData) {
      aIDData[i] = Array.from(new Set(aIDData[i]));
      unData.push(aIDData[i].shift());
      unData.push(":");
      unData.push(aIDData[i].length);
      unData.push(" ");
      //anData.push("<br>");
    }
    console.log(unData.join(""));


    if (isReverse === false && (countDel || countHissi)) {
      let originalTotalRes = $(".pagestats:first .menujust li:first-child").text();
      let delMessage = originalTotalRes +"<br><b>" +
              countDel + "レス削除</b>(" +
              Math.round(countDel / Number(originalTotalRes.slice(0, -4)) * 100) + "%)で快適" +
              (countHissi ? "<br>漏れID" + countHissi + "レスを強調表示" : "") +
          "<br><button style=\"zoom:80%\" " +
          "onclick=\"if (location.href.indexOf('on') == -1) location.href += '#on'\">デバッグ</button>"
          "";
      $(".pagestats .menujust li:first-child").html(delMessage);
    }

    let output = [];
    for (let i in idHissi)
      output.push( String(idHissi[i]).slice(1,-1) );
    for (let i in idCheck)
      output.push( String(idCheck[i]).slice(1,-1) );
    console.log( rPrefix + "|" + output.join("|") + "|" + rPrefix)
  }
  function delElm(elm) {
    elm.css(strD,strN);
    elm.css({"margin-bottom":"0", "padding-bottom":"0", "padding-top":"0"});
    elm.next().css(strD,strN);
  }
})();