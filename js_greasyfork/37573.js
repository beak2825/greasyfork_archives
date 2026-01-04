// ==UserScript==
// @name         Kahoot font
// @namespace    https://github.com/rogeraabbccdd/kahoot-font
// @version      1.2
// @description  Change font size and font face in Kahoot!.
// @author       rogeraabbccdd
// @include       *://*.kahoot.*/*
// @include       *://kahoot.it/*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37573/Kahoot%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/37573/Kahoot%20font.meta.js
// ==/UserScript==
//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永無BUG
//
//
/* style.css  (https://play.kahoot.it/theme/kahoot/css/style.css?v1.382.0)
 .richText.question = 倒數時顯示的題目，預設48px
 .launcher .quizInfo .name = 讀取時的測驗標題，預設34px
 div.title = 預備時的測驗標題，預設40px;
 input.username = 玩家輸入Nickname和其他東西時輸入欄的字
 span.player-name = 主控顯示的玩家名、隊伍名
 div.status-bar__username = 玩家端顯示的玩家名
 h3.nickname__text = 玩家顯示的隊伍名
 li.players__members-name = 玩家顯示的隊員名
 li.players-block__member-name = 主控顯示的隊伍玩家名
*/
GM_addStyle(`
.richText.question
{
	font-size: 60px !important;
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
.launcher .quizInfo .name
{
	font-size: 50px !important;
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
div.title
{
	font-size: 60px !important;
	font-family: BPreplay, "Microsoft JhengHei";
}
input.username
{
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
span.player-name
{
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
div.status-bar__username
{
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
h3.nickname__text
{
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
li.players-block__member-name
{
	font-family: montserrat,"helvetica neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
`);

/* player.min.css in iframe "gameBlockIframe" (https://play.kahoot.it/game-blocks/quiz/player.min_1cdad0b3.css)
 span.question-choices__card-text = 選項，預設 1.125rem? 0.875rem?
 h1.question-bar__title = 選項出現時上面的題目，預設1.25rem;
*/
var iframe = document.getElementsByTagName('iframe')[0];
iframe.addEventListener("load", function() {
    var node = document.createElement('style');
    node.appendChild(document.createTextNode(`
span.question-choices__card-text
{
	font-size: 2.7rem !important;
	font-family: "Montserrat","Helvetica Neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
h1.question-bar__title
{
	font-size: 3rem !important;
	font-family: "Montserrat","Helvetica Neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
`));
    window.frames[0].document.head.appendChild(node);
});

/* player.min_e6985650.css in "scoreBoardIframe"
 https://play.kahoot.it/game-blocks/scoreboard/player.min_e6985650.css
 div.content__center = 每題後計分板排名的名字
 */
var iframe2 = document.getElementsByTagName('iframe')[1];
iframe2.addEventListener("load", function() {
    var node = document.createElement('style');
    node.appendChild(document.createTextNode(`
div.content__center
{
	font-family: "Montserrat","Helvetica Neue",helvetica,arial,sans-serif,"Microsoft JhengHei";
}
`));
    window.frames[1].document.head.appendChild(node);
});
