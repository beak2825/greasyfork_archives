// ==UserScript==
// @name        HWM_CardLog
// @author  Zeleax
// @namespace   Zeleax
// @description На странице истории карточных игр отображает число "побед/всего игр", процент побед, максимальные цепочки побед/поражений
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(pl_cardlog.php\?id=.*)/
// @version     1.7
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/18282/HWM_CardLog.user.js
// @updateURL https://update.greasyfork.org/scripts/18282/HWM_CardLog.meta.js
// ==/UserScript==    
var set=getI("//a[@href=(//a[starts-with(@href,'pl_info.php')])[1]/@href]");
var totalWins, maxWins, curWins, maxLoss, curLoss, lastIsWin, wCnt, el, maxWinsEl, maxLossEl, mayWinSum;
totalWins=maxWins=curWins=maxLoss=curLoss=lastIsWin=wCnt=0;
var tCnt=7;
var wProg=set.snapshotLength-tCnt;
for(var i=1;el=set.snapshotItem(i);i++) {
   if(el.firstChild.tagName=='B'){
      curWins++;
      if(curWins>maxWins){maxWins=curWins; maxWinsEl=el;}
      curLoss=0; lastIsWin=1; totalWins++;
      if(i>=wProg) wCnt++;
   }
   else{
      curLoss++;
      if(curLoss>maxLoss){maxLoss=curLoss;maxLossEl=el;}
      curWins=0; lastIsWin=-1;
   }
}
document.getElementsByTagName('style')[0].insertAdjacentHTML('beforeEnd',' .wintime {color:Green} .losstime {color:Red}');
InsertClassInTime(maxWinsEl.parentNode.parentNode,maxWins,'wintime');
InsertClassInTime(maxLossEl.parentNode.parentNode,maxLoss,'losstime');

set.snapshotItem(0).insertAdjacentHTML("afterEnd", '<br><span title="Число побед/всего игр">Побед: '+totalWins+'/'+(set.snapshotLength-1)+' ('+Math.round(100*totalWins/(set.snapshotLength-1))
   +'%)</span><span title="Счёт после '+tCnt+' следующих побед"> ('+(totalWins+tCnt-wCnt)+')</span>, <span title="Максимальные цепочки побед/поражений">max: '+maxWins+'/'+maxLoss+'</span>');

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document.body:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
function InsertClassInTime(startrow,count,classname){ for(var i=0,row=startrow;i<count;i++,row=row.previousSibling) getI("(.//a)[1]",row).snapshotItem(0).className=classname;}
