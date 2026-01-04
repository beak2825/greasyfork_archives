// ==UserScript==
// @name        💯 人人都能满分的秒刷·国家安全答题插件
// @namespace   gjaqzsjs
// @match       http://gjaqzsjs.haedu.cn/*
// @grant       none
// @version     4.12
// @author      star_even
// @description 2021/12/6 上午3:23:08
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant unsafewindow

// @downloadURL https://update.greasyfork.org/scripts/436568/%F0%9F%92%AF%20%E4%BA%BA%E4%BA%BA%E9%83%BD%E8%83%BD%E6%BB%A1%E5%88%86%E7%9A%84%E7%A7%92%E5%88%B7%C2%B7%E5%9B%BD%E5%AE%B6%E5%AE%89%E5%85%A8%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436568/%F0%9F%92%AF%20%E4%BA%BA%E4%BA%BA%E9%83%BD%E8%83%BD%E6%BB%A1%E5%88%86%E7%9A%84%E7%A7%92%E5%88%B7%C2%B7%E5%9B%BD%E5%AE%B6%E5%AE%89%E5%85%A8%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  const mapping = 'ABCDEFGHI';
  const A20B21 = (arr)=>arr.map((e) => mapping.indexOf(e));
  const mim = (a, b, c) => (a < b ? (a < c ? a : c) : b < c ? b : c);
  const sim = function (s, t) {
    var n = s.length,
      m = t.length,
      d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
      d[i] = [];
      d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
      d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
      s_i = s.charAt(i - 1);
      for (j = 1; j <= m; j++) {
        t_j = t.charAt(j - 1);
        if (s_i == t_j) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = mim(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }
    return d[n][m];
  };
  const onlyRemainCh = (sentenceWithSigns) =>
    sentenceWithSigns.replace(/[^\u4e00-\u9fa5]/gi, '');
  const match = (s, t) => {
    var l = s.length > t.length ? s.length : t.length;
    var d = sim(s, t);
    return (1 - d / l).toFixed(4);
  };
  l = console.log;

  const matchInTiku = (test, tikuBank) => {
    let len = test.length;
    let answerArr = [];
    tikuBank.forEach((e) => {
      let matchStem = e.charactor.slice(0, len);
      let rate = match(matchStem, test);

      let result = {
        answer:e.answer.toString(),
        matchRate: rate,
        matched: matchStem,
         answerArr: A20B21(e.answer)!=[-1]?A20B21(e.answer):location.reload(),
      };
      answerArr.push(result);
      // l(result)
    });
    let mostMatched = answerArr.reduce(function (x, y) {
      return x.matchRate > y.matchRate ? x : y;
    });

    l(mostMatched);
    return mostMatched
  };

  window.onload = () => {
    //     业务部分开始

    setTimeout(() => {
      let doc = document;
      let tikuBank = GM_getValue('tiku');
      tikuBank.forEach((e) => {
        e.charactor = onlyRemainCh(e.question);
      });
      let tests = [];
      doc.querySelectorAll('.issue').forEach((e) => {
        tests.push(onlyRemainCh(e.innerText));
      });
      
      let optionsGroup = doc.querySelectorAll('.options');
      let allResult = [];
      let lowestRate =0
//       查找每项
      tests.forEach((e, i) => {
        let r=matchInTiku(e, tikuBank)
        let aA=r.answerArr
        if(aA!=[-1]){
                  allResult.push(r);

          aA.forEach((ee,ii)=>{
            optionsGroup[i].childNodes[ee].click()
            
          })
        }else{
          
          l(`出错！即将跳转……`)
          location.reload()
        }
      });
     lowestRate= allResult.reduce(function (x, y) { 
      return x.matchRate < y.matchRate ? x.matchRate : y.matchRate;
    });
      // lowestRate = (parseFloat(lowestRate)).toFixed(2)
if((len =allResult.length),len===20){
      l(`匹配成功，20个`)
    }else{
      location.reload()
    }
      
          setTimeout(() => {
      if (
        (r = window.confirm(
          `所有题已完成，最低匹配度：${lowestRate}(越接近1满分率越高)
          如果没有答上，请刷新(ctrl+R)!如果不放心想要手动确认正确率，可以点击右键调出开发者控制台(F12)查看每一条的答案`
        ))
      ) {
        window.scrollTo(
          0,
          document.documentElement.offsetHeight - window.innerHeight
        );
        //   修改为一个正常的提交时间
        maxTime = parseInt(Math.random() * (500 - 200 + 1) + 200, 10);
      } else {
        maxTime = parseInt(Math.random() * (500 - 200 + 1) + 200, 10);
      }
    }, 600);
      
      
    }, 400);
  };
})();
