// ==UserScript==
// @name         Poker Odds & Strategic Advisor
// @namespace    https://openuserjs.org/users/torn/pokerodds
// @version      100.0
// @description  update 5
// @author       aquagloop
// @match        https://www.torn.com/page.php?sid=holdem
// @run-at       document-body
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      lol-manager.com
// @downloadURL https://update.greasyfork.org/scripts/547396/Poker%20Odds%20%20Strategic%20Advisor.user.js
// @updateURL https://update.greasyfork.org/scripts/547396/Poker%20Odds%20%20Strategic%20Advisor.meta.js
// ==/UserScript==

const PREFLOP_HAND_RANKS={"AA":1,"KK":2,"QQ":3,"JJ":4,"AKs":5,"TT":6,"AQs":7,"AJs":8,"KQs":9,"99":10,"AKo":11,"ATs":12,"KJs":13,"88":14,"QJs":15,"KTs":16,"AQo":17,"A9s":18,"77":19,"AJo":20,"K9s":21,"QTs":22,"A8s":23,"KQo":24,"66":25,"JTs":26,"A7s":27,"A5s":28,"K8s":29,"Q9s":30,"A4s":31,"A6s":32,"T9s":33,"A3s":34,"K7s":35,"Q8s":36,"KJo":37,"A2s":38,"55":39,"J9s":40,"K6s":41,"K5s":42,"Q7s":43,"T8s":44,"K4s":45,"K3s":46,"K2s":47,"Q6s":48,"Q5s":49,"J8s":50,"ATo":51,"Q4s":52,"Q3s":53,"44":54,"Q2s":55,"T7s":56,"J7s":57,"KTo":58,"A9o":59,"98s":60,"QTo":61,"J6s":62,"J5s":63,"J4s":64,"A8o":65,"J3s":66,"33":67,"J2s":68,"97s":69,"T6s":70,"A7o":71,"K9o":72,"A5o":73,"Q9o":74,"87s":75,"A4o":76,"22":77,"A6o":78,"JTo":79,"T5s":80,"96s":81,"T4s":82,"A3o":83,"Q8o":84,"T3s":85,"T2s":86,"A2o":87,"86s":88,"95s":89,"K8o":90,"J9o":91,"Q7o":92,"76s":93,"T9o":94,"K7o":95,"98o":96,"J8o":97,"Q6o":98,"K6o":99,"85s":100,"Q5o":101,"J7o":102,"T8o":103,"K5o":104,"75s":105,"97o":106,"K4o":107,"Q4o":108,"65s":109,"K3o":110,"87o":111,"Q3o":112,"T7o":113,"K2o":114,"J6o":115,"96o":116,"Q2o":117,"86o":118,"64s":119,"J5o":120,"76o":121,"J4o":122,"54s":123,"95o":124,"J3o":125,"T6o":126,"85o":127,"J2o":128,"74s":129,"65o":130,"T5o":131,"84s":132,"53s":133,"75o":134,"94s":135,"T4o":136,"63s":137,"93s":138,"T3o":139,"43s":140,"92s":141,"83s":142,"T2o":143,"73s":144,"54o":145,"82s":146,"64o":147,"52s":148,"74o":149,"62s":150,"42s":151,"84o":152,"32s":153,"94o":154,"72s":155,"53o":156,"63o":157,"93o":158,"83o":159,"92o":160,"73o":161,"52o":162,"82o":163,"43o":164,"62o":165,"72o":166,"42o":167,"32o":168,"2s":169};
const PREFLOP_EQUITY={"AA":[85.2,73.5,64.5,57.2,51.2,46.1,41.7,37.9,34.4],"KK":[82.4,69.5,59.5,51.6,45.2,39.9,35.5,31.7,28.3],"QQ":[79.9,65.9,55.1,46.7,40.1,34.7,30.2,26.4,23.1],"JJ":[77.5,62.4,50.9,42.1,35.3,29.8,25.3,21.5,18.2],"TT":[75.1,59.1,47.1,37.9,31.1,25.6,21.1,17.4,14.2],"99":[72.2,55.4,42.9,33.7,27.1,21.8,17.5,13.9,10.9],"88":[69.3,51.9,39.2,29.9,23.5,18.4,14.3,10.9,8.1],"77":[66.3,48.4,35.5,26.3,20.1,15.2,11.4,8.3,5.7],"66":[63.4,45.1,32.2,23.2,17.2,12.5,9.0,6.1,3.8],"55":[60.3,41.7,28.9,20.1,14.4,10.0,6.9,4.4,2.4],"44":[57.0,38.3,25.8,17.3,11.9,7.9,5.2,3.0,1.3],"33":[53.7,35.0,22.9,14.8,9.8,6.2,3.8,2.0,0.6],"22":[50.3,31.8,20.1,12.5,7.9,4.8,2.8,1.3,0.2],"AKs":[67.0,50.6,39.2,31.0,25.0,20.4,16.8,13.9,11.5],"AQs":[66.1,49.4,37.9,29.6,23.5,18.9,15.4,12.5,10.1],"AJs":[65.2,48.2,36.6,28.2,22.1,17.6,14.1,11.3,8.9],"ATs":[64.2,47.0,35.4,26.9,20.8,16.3,12.9,10.2,7.9],"A9s":[62.5,45.1,33.3,25.0,19.0,14.6,11.3,8.7,6.5],"A8s":[61.5,43.9,32.1,23.8,17.9,13.6,10.4,7.9,5.8],"A7s":[60.5,42.9,31.1,22.8,17.0,12.8,9.6,7.2,5.2],"A6s":[59.4,41.6,29.8,21.6,15.8,11.7,8.6,6.2,4.3],"A5s":[59.2,41.5,29.8,21.6,15.9,11.8,8.7,6.4,4.5],"A4s":[58.1,40.4,28.7,20.6,15.0,11.0,8.0,5.7,3.9],"A3s":[57.0,39.3,27.7,19.7,14.2,10.3,7.4,5.2,3.5],"A2s":[55.9,38.2,26.6,18.7,13.3,9.5,6.7,4.6,3.0],"KQs":[63.1,45.8,34.5,26.5,20.6,16.2,12.9,10.3,8.2],"KJs":[62.1,44.5,33.1,25.1,19.2,14.9,11.7,9.2,7.1],"KTs":[61.0,43.2,31.8,23.8,17.9,13.7,10.6,8.2,6.2],"K9s":[59.1,41.1,29.5,21.7,16.0,11.9,8.9,6.6,4.8],"K8s":[58.0,39.9,28.3,20.6,15.0,11.0,8.1,5.9,4.1],"K7s":[56.9,38.7,27.1,19.4,14.0,10.1,7.3,5.2,3.5],"K6s":[55.7,37.4,25.8,18.1,12.9,9.1,6.4,4.4,2.8],"K5s":[54.5,36.1,24.6,17.0,11.9,8.3,5.7,3.8,2.3],"K4s":[53.2,34.7,23.3,15.8,10.9,7.4,5.0,3.2,1.8],"K3s":[52.0,33.4,22.1,14.8,10.0,6.7,4.4,2.7,1.4],"K2s":[50.8,32.2,21.0,13.8,9.1,5.9,3.7,2.2,1.1],"QJs":[59.8,42.1,31.0,23.2,17.5,13.3,10.2,7.8,5.9],"QTs":[58.7,40.8,29.7,21.9,16.2,12.2,9.2,6.9,5.1],"Q9s":[57.5,39.5,28.3,20.6,15.0,11.0,8.1,5.9,4.1],"Q8s":[55.5,37.3,26.0,18.5,13.1,9.4,6.7,4.7,3.1],"Q7s":[54.2,35.9,24.7,17.3,12.0,8.4,5.8,3.9,2.4],"Q6s":[52.9,34.6,23.4,16.1,11.0,7.5,5.1,3.3,1.9],"Q5s":[51.6,33.2,22.2,15.1,10.2,6.8,4.5,2.8,1.5],"Q4s":[50.3,31.8,20.9,14.0,9.3,6.1,3.9,2.3,1.2],"Q3s":[49.0,30.5,19.8,13.1,8.5,5.4,3.4,1.9,0.9],"Q2s":[47.8,29.3,18.7,12.1,7.7,4.8,2.9,1.6,0.7],"JTs":[57.2,39.4,28.4,20.8,15.3,11.3,8.4,6.2,4.5],"J9s":[55.9,38.0,26.9,19.4,14.0,10.1,7.3,5.2,3.5],"J8s":[54.6,36.6,25.5,18.0,12.7,8.9,6.2,4.3,2.7],"J7s":[52.4,34.3,23.3,16.0,11.0,7.5,5.0,3.3,1.9],"J6s":[51.1,32.9,21.9,14.8,9.9,6.6,4.3,2.7,1.4],"J5s":[49.7,31.5,20.7,13.8,9.0,5.8,3.7,2.2,1.1],"J4s":[48.4,30.2,19.5,12.8,8.2,5.2,3.2,1.8,0.8],"J3s":[47.1,28.9,18.4,11.8,7.4,4.6,2.8,1.5,0.6],"J2s":[45.8,27.6,17.4,11.0,6.7,4.1,2.4,1.3,0.5],"T9s":[54.2,36.4,25.5,18.2,13.0,9.2,6.5,4.6,3.0],"T8s":[52.9,35.0,24.1,16.9,11.8,8.2,5.6,3.8,2.3],"T7s":[51.5,33.5,22.7,15.6,10.6,7.2,4.8,3.1,1.7],"T6s":[49.1,31.1,20.5,13.7,9.0,5.9,3.7,2.2,1.1],"T5s":[47.7,29.8,19.4,12.7,8.2,5.2,3.2,1.8,0.8],"T4s":[46.4,28.5,18.3,11.8,7.4,4.6,2.8,1.5,0.6],"T3s":[45.0,27.2,17.2,10.9,6.7,4.0,2.4,1.3,0.5],"T2s":[43.8,26.0,16.2,10.1,6.0,3.5,2.0,1.0,0.4],"98s":[51.4,33.7,22.9,15.9,10.9,7.5,5.1,3.4,2.0],"97s":[49.9,32.2,21.5,14.6,9.8,6.5,4.3,2.7,1.4],"96s":[47.5,29.8,19.3,12.7,8.2,5.2,3.2,1.8,0.8],"95s":[46.0,28.4,18.1,11.6,7.3,4.5,2.7,1.5,0.6],"94s":[44.6,27.1,17.0,10.7,6.5,3.9,2.3,1.2,0.5],"93s":[43.2,25.8,16.0,9.9,5.9,3.4,1.9,1.0,0.4],"92s":[41.9,24.6,15.0,9.1,5.3,3.0,1.6,0.8,0.3],"87s":[48.5,30.9,20.3,13.6,8.9,5.9,3.8,2.3,1.2],"86s":[46.0,28.5,18.1,11.6,7.3,4.5,2.7,1.5,0.6],"85s":[44.5,27.1,16.9,10.5,6.4,3.8,2.2,1.1,0.4],"84s":[42.1,24.8,15.0,8.9,5.1,2.9,1.6,0.8,0.3],"83s":[40.7,23.5,14.0,8.1,4.5,2.5,1.3,0.6,0.2],"82s":[39.5,22.3,13.1,7.4,4.0,2.2,1.1,0.5,0.2],"76s":[45.4,28.0,17.5,11.1,6.9,4.2,2.5,1.4,0.6],"75s":[42.9,25.7,15.5,9.4,5.6,3.3,1.8,0.9,0.3],"74s":[41.5,24.3,14.4,8.5,4.8,2.7,1.4,0.6,0.2],"73s":[39.1,22.1,12.6,7.1,3.8,2.0,1.0,0.4,0.1],"72s":[37.8,20.9,11.7,6.3,3.3,1.7,0.8,0.3,0.1],"65s":[42.3,25.2,15.0,9.0,5.3,3.1,1.7,0.8,0.3],"64s":[39.8,22.8,13.1,7.6,4.2,2.3,1.2,0.5,0.2],"63s":[38.4,21.5,12.1,6.7,3.6,1.9,0.9,0.4,0.1],"62s":[36.1,19.3,10.4,5.4,2.7,1.3,0.6,0.2,0.1],"54s":[39.2,22.4,12.6,7.2,4.0,2.2,1.1,0.5,0.2],"53s":[36.7,20.1,10.9,5.9,3.1,1.6,0.7,0.3,0.1],"52s":[34.4,18.0,9.3,4.7,2.3,1.1,0.5,0.2,0.0],"43s":[34.0,17.7,9.0,4.6,2.3,1.1,0.5,0.2,0.0],"42s":[31.7,15.7,7.6,3.7,1.7,0.8,0.3,0.1,0.0],"32s":[29.3,13.8,6.3,2.9,1.3,0.6,0.2,0.1,0.0],"AKo":[65.3,48.4,36.9,28.7,22.7,18.2,14.7,11.9,9.5],"AQo":[64.4,47.2,35.6,27.2,21.2,16.8,13.4,10.7,8.4],"AJo":[63.4,46.0,34.4,25.9,19.9,15.5,12.1,9.4,7.2],"ATo":[62.4,44.8,33.1,24.6,18.6,14.2,10.9,8.3,6.2],"A9o":[60.6,42.8,31.0,22.7,16.8,12.5,9.4,6.9,4.9],"A8o":[59.6,41.6,29.8,21.5,15.7,11.6,8.5,6.1,4.2],"A7o":[58.5,40.5,28.7,20.4,14.7,10.7,7.7,5.4,3.6],"A6o":[57.4,39.2,27.4,19.2,13.6,9.6,6.7,4.5,2.8],"A5o":[57.1,39.0,27.2,19.1,13.5,9.6,6.7,4.5,2.8],"A4o":[56.0,37.8,26.1,18.1,12.6,8.8,6.0,3.9,2.3],"A3o":[54.8,36.7,25.1,17.2,11.8,8.1,5.4,3.5,2.0],"A2o":[53.6,35.5,24.0,16.2,10.9,7.3,4.8,3.0,1.7],"KQo":[61.2,43.5,32.3,24.4,18.6,14.3,11.0,8.6,6.6],"KJo":[60.2,42.2,30.9,22.9,17.2,12.9,9.8,7.4,5.5],"KTo":[59.0,40.9,29.6,21.7,15.9,11.8,8.8,6.5,4.6],"K9o":[56.9,38.6,27.2,19.5,14.0,10.1,7.2,5.1,3.4],"K8o":[55.8,37.4,26.0,18.4,13.0,9.2,6.4,4.4,2.8],"K7o":[54.6,36.1,24.7,17.2,11.9,8.2,5.5,3.7,2.2],"K6o":[53.3,34.7,23.4,16.0,10.8,7.3,4.8,3.1,1.7],"K5o":[52.0,33.4,22.1,14.8,9.8,6.4,4.1,2.5,1.3],"K4o":[50.7,32.0,20.8,13.6,8.8,5.6,3.5,2.1,1.0],"K3o":[49.4,30.6,19.6,12.6,7.9,4.9,3.0,1.7,0.8],"K2o":[48.1,29.3,18.5,11.6,7.1,4.3,2.6,1.4,0.6],"QJo":[57.8,39.8,28.8,21.1,15.4,11.4,8.5,6.2,4.4],"QTo":[56.6,38.4,27.4,19.8,14.2,10.2,7.4,5.2,3.5],"Q9o":[55.3,37.0,25.9,18.4,12.9,9.1,6.3,4.3,2.7],"Q8o":[53.1,34.7,23.6,16.3,11.1,7.6,5.1,3.3,1.9],"Q7o":[51.8,33.3,22.3,15.1,10.0,6.7,4.4,2.7,1.4],"Q6o":[50.4,31.8,21.0,13.9,9.0,5.8,3.7,2.2,1.1],"Q5o":[49.0,30.4,19.8,12.8,8.1,5.1,3.1,1.8,0.8],"Q4o":[47.6,29.0,18.6,11.8,7.3,4.5,2.7,1.5,0.6],"Q3o":[46.2,27.6,17.5,10.9,6.5,3.9,2.3,1.2,0.5],"Q2o":[44.9,26.3,16.4,10.0,5.8,3.4,1.9,1.0,0.4],"JTo":[54.9,36.9,26.0,18.5,13.2,9.4,6.7,4.7,3.1],"J9o":[53.5,35.4,24.5,17.1,11.9,8.2,5.6,3.8,2.3],"J8o":[52.1,33.9,23.0,15.7,10.6,7.1,4.7,3.0,1.7],"J7o":[49.8,31.5,20.8,13.8,9.0,5.8,3.7,2.2,1.1],"J6o":[48.4,30.1,19.5,12.6,7.9,4.9,3.0,1.7,0.8],"J5o":[46.9,28.6,18.3,11.6,7.1,4.3,2.5,1.4,0.6],"J4o":[45.5,27.2,17.1,10.6,6.3,3.7,2.1,1.1,0.5],"J3o":[44.1,25.9,16.1,9.8,5.6,3.2,1.8,0.9,0.4],"J2o":[42.8,24.7,15.1,9.0,5.0,2.8,1.5,0.7,0.3],"T9o":[51.8,33.8,23.1,15.9,10.9,7.5,5.1,3.4,2.0],"T8o":[50.3,32.3,21.7,14.6,9.8,6.5,4.3,2.7,1.4],"T7o":[48.8,30.8,20.2,13.3,8.6,5.5,3.5,2.1,1.0],"T6o":[46.3,28.3,18.0,11.5,7.1,4.3,2.6,1.4,0.6],"T5o":[44.9,26.9,16.8,10.5,6.3,3.7,2.1,1.1,0.5],"T4o":[43.5,25.6,15.8,9.6,5.6,3.2,1.8,0.9,0.4],"T3o":[42.1,24.3,14.8,8.8,5.0,2.8,1.5,0.7,0.3],"T2o":[40.8,23.1,13.8,8.1,4.4,2.4,1.3,0.6,0.2],"98o":[48.9,31.1,20.5,13.7,8.9,5.9,3.8,2.3,1.2],"97o":[47.3,29.5,19.0,12.4,7.8,4.9,3.0,1.7,0.8],"96o":[44.8,26.9,16.8,10.5,6.3,3.7,2.1,1.1,0.5],"95o":[43.3,25.5,15.6,9.4,5.5,3.1,1.7,0.8,0.3],"94o":[41.8,24.1,14.5,8.5,4.8,2.6,1.4,0.6,0.2],"93o":[40.4,22.8,13.5,7.8,4.2,2.3,1.2,0.5,0.2],"92o":[39.1,21.6,12.5,7.0,3.7,1.9,1.0,0.4,0.1],"87o":[45.9,28.3,17.8,11.4,7.0,4.3,2.6,1.4,0.6],"86o":[43.3,25.7,15.6,9.5,5.6,3.3,1.8,0.9,0.3],"85o":[41.7,24.2,14.4,8.4,4.7,2.6,1.4,0.6,0.2],"84o":[39.2,21.8,12.5,6.9,3.6,1.9,0.9,0.4,0.1],"83o":[37.8,20.5,11.5,6.2,3.1,1.6,0.7,0.3,0.1],"82o":[36.5,19.3,10.6,5.5,2.7,1.3,0.6,0.2,0.1],"76o":[42.7,25.3,15.2,9.1,5.3,3.1,1.7,0.8,0.3],"75o":[40.1,22.8,13.1,7.5,4.1,2.2,1.1,0.5,0.2],"74o":[38.6,21.4,12.0,6.5,3.4,1.8,0.8,0.3,0.1],"73o":[36.2,19.2,10.3,5.3,2.6,1.3,0.6,0.2,0.1],"72o":[34.9,18.0,9.4,4.6,2.2,1.0,0.4,0.2,0.0],"65o":[39.6,22.4,12.6,7.1,3.9,2.1,1.0,0.4,0.1],"64o":[37.0,20.0,10.8,5.7,2.9,1.5,0.7,0.3,0.1],"63o":[35.6,18.7,9.8,5.0,2.4,1.2,0.5,0.2,0.1],"62o":[33.2,16.5,8.1,3.9,1.8,0.8,0.3,0.1,0.0],"54o":[36.5,19.6,10.4,5.5,2.8,1.4,0.6,0.3,0.1],"53o":[33.9,17.3,8.7,4.4,2.1,1.0,0.4,0.1,0.0],"52o":[31.6,15.3,7.2,3.4,1.5,0.7,0.3,0.1,0.0],"43o":[31.2,14.9,7.0,3.3,1.5,0.7,0.3,0.1,0.0],"42o":[28.9,13.0,5.7,2.5,1.1,0.5,0.2,0.1,0.0],"32o":[26.5,11.2,4.7,2.0,0.8,0.4,0.1,0.0]};
let GM_addStyle=function(s){let t=document.createElement("style");t.type="text/css";t.innerHTML=s;document.head.appendChild(t);};

class PokerCalculatorModule
{
    constructor()
    {
        this.DEBUG = false;
        this.SIMULATION_TRIALS = 4000;
        this.debugLog = [];
        this.lastLength = -1;
        this.lastOpponentCount = -1;
        this.lastBetToCall = -1;
        this.updateTimeout = null;
        this.observer = null;
        this.playersOnTable = new Map();
        this.apiKey = null;
        this.tbsQueue = [];
        this.isFetchingTbs = false;
        this.initApiKey();
        this.addStyle();
    }

    initApiKey() {
        let storedKey = localStorage.getItem('tornPokerApiKey');
        if (!storedKey) {
            storedKey = prompt('Please enter your Torn API key for the Battle Stats feature:');
            if (storedKey) {
                localStorage.setItem('tornPokerApiKey', storedKey);
            }
        }
        this.apiKey = storedKey;
    }

    removeApiKey() {
        localStorage.removeItem('tornPokerApiKey');
        this.apiKey = null;
        this.playersOnTable.forEach(player => {
            player.tbs = '...';
        });
        this.renderMuggingList();
        this.initApiKey();
        if (this.apiKey) {
            this.playersOnTable.forEach((player, id) => {
                this.tbsQueue.push(id);
            });
            this.processTbsQueue();
        }
    }

    formatTbs(num) {
        if (num === null || num === undefined || num === 0) return 'N/A';
        const units = ['', 'k', 'M', 'B', 'T'];
        const tier = Math.log10(Math.abs(num)) / 3 | 0;
        if (tier == 0) return num;
        const suffix = units[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(2) + suffix;
    }

    fetchBattleStats(userId) {
        return new Promise((resolve) => {
            if (!this.apiKey) {
                console.log("API key not set. Skipping TBS fetch.");
                resolve(null);
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://www.lol-manager.com/api/battlestats/${this.apiKey}/${userId}/aquagloopPokerScript`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.Result !== 0 && data.TBS !== undefined) {
                            resolve(data.TBS);
                        } else {
                            console.error(`API Error for ${userId}:`, data.Reason || data);
                            resolve(null);
                        }
                    } catch (e) {
                        console.error(`Error parsing response for ${userId}:`, e);
                        resolve(null);
                    }
                },
                onerror: (error) => {
                    console.error(`GM_xmlhttpRequest error for ${userId}:`, error);
                    resolve(null);
                }
            });
        });
    }

    parseMoney(text) { if (!text) return 0; const c=text.replace(/[^0-9]/g, ''); return parseInt(c, 10) || 0; }
    parseCardFromElement(element) { const c=element.classList[1]; if(!c) return "null-0"; let card=c.split("_")[0].replace("-A", "-14").replace("-K", "-13").replace("-Q", "-12").replace("-J", "-11"); if(card==="cardSize"||card==="back") return "null-0"; return card; }

    update()
    {
        this.updateMuggingHelper();
        const gameState = this.getGameState();
        this.updateGameStateUI(gameState);
        let allCards = this.getFullDeck();
        let knownCards = Array.from(document.querySelectorAll("[class*='flipper___'] > div[class*='front___'] > div")).map(e => this.parseCardFromElement(e));
        let communityCards = knownCards.slice(0, 5).filter(e => !e.includes("null"));
        allCards = this.filterDeck(allCards, knownCards.filter(e => !e.includes("null")));
        if(JSON.stringify(knownCards).length !== this.lastLength || gameState.opponents !== this.lastOpponentCount || gameState.isMyTurn !== (this.lastBetToCall !== -1) )
        {
            const playerNode = document.querySelector("[class*='playerMeGateway___']");
            if (!playerNode) return;
            let myCards = Array.from(playerNode.querySelectorAll("div[class*='front___'] > div")).map(e => this.parseCardFromElement(e));
            if (myCards.filter(c => c !== 'null-0').length === 2) {
                let advice;
                if (communityCards.length < 3) {
                    this.handlePreFlopState(myCards, gameState);
                    advice = this.getStrategicAdvice(myCards, communityCards, gameState);
                } else {
                    const myRank = this.calculateHandRank(myCards, communityCards, allCards, gameState.opponents);
                    this.handlePostFlopState(myCards, communityCards, allCards, myRank);
                    advice = this.getStrategicAdvice(myCards, communityCards, gameState, myRank.winEquity);
                }
                this.updateAdviceUI(advice);
            } else {
                this.hideAllTables();
                this.debugLog = [];
            }
            this.updateDebugLogUI();
            this.lastLength = JSON.stringify(knownCards).length;
            this.lastOpponentCount = gameState.opponents;
            this.lastBetToCall = gameState.betToCall;
        }
    }

    hideAllTables() {
        document.querySelector("#pokerCalc-advice").style.display = 'none';
        document.querySelector("#pokerCalc-preFlop").style.display = 'none';
        document.querySelector("#pokerCalc-myHand").style.display = 'none';
        document.querySelector("#pokerCalc-upgrades").style.display = 'none';
    }

    handlePreFlopState(myCards, gameState) {
        document.querySelector("#pokerCalc-preFlop").style.display = 'table';
        document.querySelector("#pokerCalc-myHand").style.display = 'none';
        document.querySelector("#pokerCalc-upgrades").style.display = 'none';
        this.debugLog = [];
        this.updateDebugLogUI();
        const { handKey, handName } = this.getHandKeyAndName(myCards);
        const rank = PREFLOP_HAND_RANKS[handKey] || 0;
        const rankPercent = rank > 0 ? (rank / 169) * 100 : 100;
        const opponents = gameState.opponents;
        const equityIndex = Math.max(0, Math.min(8, opponents - 1));
        const equity = PREFLOP_EQUITY[handKey]?.[equityIndex] || 0;
        const tbody = document.querySelector("#pokerCalc-preFlop tbody");
        tbody.innerHTML = `
            <tr><td>Hand Name</td><td>${handName} (${handKey})</td></tr>
            <tr><td>Hand Rank</td><td>${rank} / 169 (Top ${rankPercent.toFixed(1)}%)</td></tr>
            <tr><td>Win Probability</td><td>${equity.toFixed(1)}% vs ${opponents} opponent${opponents !== 1 ? 's' : ''}</td></tr>
        `;
    }

    handlePostFlopState(myCards, communityCards, allCards, myRank) {
        document.querySelector("#pokerCalc-preFlop").style.display = 'none';
        document.querySelector("#pokerCalc-myHand").style.display = 'table';
        const myCurrentHand = this.getHandScore(communityCards.concat(myCards));
        document.querySelector("#pokerCalc-myHand tbody").innerHTML = `<tr><td>Me</td><td>${myCurrentHand.description}</td><td>${myRank.rank}</td><td>${myRank.top}</td></tr>`;
        const upgradesTable = document.querySelector("#pokerCalc-upgrades");
        const upgradesBody = upgradesTable.querySelector("tbody");
        if (communityCards.length >= 3 && communityCards.length <= 4) {
            const improvements = this.getHandImprovements(myCards, communityCards, allCards, myCurrentHand);
            if (Object.keys(improvements).length > 0) {
                const remainingCards = allCards.length;
                let html = "";
                for (const handName in improvements) {
                    const improvement = improvements[handName];
                    const numOuts = improvement.outs.length;
                    let chance = 0;
                    if (communityCards.length === 3) {
                        chance = (1 - ((remainingCards - numOuts) / remainingCards) * ((remainingCards - 1 - numOuts) / (remainingCards - 1))) * 100;
                    } else {
                        chance = (numOuts / remainingCards) * 100;
                    }
                    html += `<tr><td style="text-align: center;">${chance.toFixed(1)}%</td><td>${handName}</td></tr>`;
                }
                upgradesBody.innerHTML = html;
                upgradesTable.style.display = 'table';
            } else {
                upgradesTable.style.display = 'none';
            }
        } else {
            upgradesTable.style.display = 'none';
        }
    }

    getGameState() {
        const potElement = document.querySelector('.totalPotWrap___PsJLF .unit___B364X');
        const pot = this.parseMoney(potElement?.textContent);
        let myStack = 0;
        const myStackElements = document.querySelectorAll("[class*='playerMeGateway___'] [class*='pot___'], [class*='playerMeGateway___'] .detailsItem___btgwD p");
        if (myStackElements.length > 0) {
            const stacks = Array.from(myStackElements).map(el => this.parseMoney(el.textContent));
            myStack = Math.max(...stacks);
        }
        const allSeatedPlayers = Array.from(document.querySelectorAll("[class*='playerPositioner-']:not([class*='emptyPlayer___'])"));
        const activePlayers = allSeatedPlayers.filter(p => {
            const isOut = p.matches("[class*='isOut___']");
            const hasFoldedClass = p.querySelector("[class*='folded___']") !== null;
            const stateElement = p.querySelector("[class*='state___']");
            const stateText = stateElement ? stateElement.textContent.trim() : "";
            const hasFoldedText = stateText.includes('Fold');
            const isWaiting = stateText.includes('Waiting BB');
            return !isOut && !hasFoldedClass && !hasFoldedText && !isWaiting;
        });
        const opponents = activePlayers.length;
        const myNode = document.querySelector("[class*='playerMeGateway___']");
        let myPosition = null;
        let myPositionName = "N/A";
        let isMyTurn = false;
        if (myNode) {
            isMyTurn = myNode.querySelector("[class*='active___']") !== null;
            const myPosMatch = myNode.parentElement.className.match(/playerPositioner-(\d+)/);
            if(myPosMatch) myPosition = parseInt(myPosMatch[1], 10);
            else myPosition = 0;
        }
        let dealerPosition = null;
        const dealerElement = document.querySelector("[class*='dealer___']");
        if (dealerElement) {
              const classList = dealerElement.className.split(' ');
              const positionClass = classList.find(c => c.startsWith('position-'));
              if (positionClass) {
                  if (positionClass.includes('position-self')) { dealerPosition = myPosition; }
                  else { const match = positionClass.match(/position-(\d+)/); if (match) { dealerPosition = parseInt(match[1], 10); } }
              }
        }
        myPositionName = this.calculateMyPositionName(myPosition, dealerPosition, activePlayers, (opponents + 1));
        let betToCall = -1;
        if (isMyTurn) {
            const callButton = Array.from(document.querySelectorAll('button[class*="button_"]')).find(b => b.textContent.trim().startsWith('Call'));
            betToCall = callButton ? this.parseMoney(callButton.textContent) : 0;
        }
        return { pot, myStack, playersInHand: opponents, opponents, myPosition, myPositionName, betToCall, isMyTurn };
    }

    updateGameStateUI(gameState) {
        const gameStateBody = document.querySelector("#pokerCalc-gameState tbody");
        if (!gameStateBody) return;
        gameStateBody.innerHTML = `
            <tr><td>Total Pot</td><td>$${gameState.pot.toLocaleString()}</td></tr>
            <tr><td>Your Stack</td><td>$${gameState.myStack.toLocaleString()}</td></tr>
            <tr><td>Opponents in Hand</td><td>${gameState.playersInHand}</td></tr>
            <tr><td>Your Position</td><td>${gameState.myPositionName}</td></tr>
        `;
    }

    updateAdviceUI(advice) {
        const adviceTable = document.querySelector("#pokerCalc-advice");
        const adviceBody = document.querySelector("#pokerCalc-advice tbody");
        if (!adviceBody || !advice) return;
        adviceTable.style.display = 'table';
        adviceBody.innerHTML = `
            <tr>
                <td style="font-weight: bold; width: 30%;">${advice.action}</td>
                <td>${advice.reason}</td>
            </tr>
        `;
    }

    updateDebugLogUI() {
        const debugDiv = document.querySelector("#pokerCalc-debug");
        if (!debugDiv) return;
        let content = `<div style="font-weight: bold; margin-bottom: 2px; text-align: left;">Simulation Log</div>`;
        if (this.debugLog.length > 0) {
            this.debugLog.forEach(log => {
                content += `<div>[${log.timestamp}] - ${log.simsRan} sims in ${log.simTime}ms | Win: ${log.winEquity}% | Opponents: ${log.opponents}</div>`;
            });
        }
        debugDiv.innerHTML = content;
    }

    getHandKeyAndName(myCards){const c1R=parseInt(myCards[0].split("-")[1]),c1S=myCards[0].split("-")[0],c2R=parseInt(myCards[1].split("-")[1]),c2S=myCards[1].split("-")[0];const r=[c1R,c2R].sort((a,b)=>b-a),iS=c1S===c2S,iP=r[0]===r[1];const R={14:"A",13:"K",12:"Q",11:"J",10:"T",9:"9",8:"8",7:"7",6:"6",5:"5",4:"4",3:"3",2:"2"};const hC=R[r[0]],lC=R[r[1]];let hK;if(iP){hK=hC+lC}else{hK=hC+lC+(iS?"s":"o")}const hN=iP?`Pocket ${hC}s`:`${hC}-${lC} ${iS?"suited":"offsuit"}`;return{handKey:hK,handName:hN}}
    calculateMyPositionName(myPos,dealerPos,activeOpponentElements,totalPlayers){if(myPos===null||dealerPos===null)return"N/A";let aPP=activeOpponentElements.map(e=>{const m=e.className.match(/playerPositioner-(\d+)/);return m?parseInt(m[1],10):null}).filter(p=>p!==null);aPP.push(myPos);aPP=[...new Set(aPP)].sort((a,b)=>a-b);const pC=totalPlayers;if(pC<2)return"Heads Up";let dI=aPP.indexOf(dealerPos);if(dI===-1){let tDP=dealerPos;while(dI===-1){tDP=(tDP+9-1)%9;dI=aPP.indexOf(tDP);if(tDP===dealerPos)break}if(dI===-1)return"Finding Dealer..."}if(pC===2){return myPos===aPP[dI]?"Button / SB":"Big Blind"}const mI=aPP.indexOf(myPos);const pFD=(mI-dI+pC)%pC;const pN={9:["BTN","SB","BB","UTG","UTG+1","UTG+2","MP","HJ","CO"],8:["BTN","SB","BB","UTG","UTG+1","MP","HJ","CO"],7:["BTN","SB","BB","UTG","MP","HJ","CO"],6:["BTN","SB","BB","UTG","HJ","CO"],5:["BTN","SB","BB","UTG","CO"],4:["BTN","SB","BB","CO"],3:["BTN","SB","BB"]};const n=pN[pC]||[];return n[pFD]||"N/A"}

    getStrategicAdvice(myCards, communityCards, gameState, winEquity = 0) {
        if (gameState.betToCall === -1) {
            return { action: 'N/A', reason: 'Waiting for your turn to act.' };
        }
        let advice;
        if (communityCards.length < 3) {
            advice = this.getPreFlopAdvice(myCards, gameState);
        } else {
            advice = this.getPostFlopAdvice(myCards, communityCards, gameState, winEquity);
        }
        return advice || { action: '...', reason: 'Evaluating...' };
    }

    getPreFlopAdvice(myCards, gameState) {
        const { handKey } = this.getHandKeyAndName(myCards);
        const rank = PREFLOP_HAND_RANKS[handKey] || 169;
        const pos = gameState.myPositionName;
        const { betToCall, pot } = gameState;
        let positionCategory = 'Late';
        if (pos.includes('UTG') || pos.includes('MP')) positionCategory = 'Early';
        if (pos.includes('HJ')) positionCategory = 'Middle';
        if (pos.includes('CO') || pos.includes('BTN')) positionCategory = 'Late';
        if (pos.includes('Blind')) positionCategory = 'Blinds';
        if (betToCall === 0) {
            let openRaiseThreshold = 80;
            if (positionCategory === 'Early') openRaiseThreshold = 30;
            if (positionCategory === 'Middle') openRaiseThreshold = 45;
            if (positionCategory === 'Late') openRaiseThreshold = 85;
            if (positionCategory === 'Blinds') openRaiseThreshold = 60;
            if (rank <= openRaiseThreshold) {
                const betAmount = Math.round(pot * 0.75);
                return { action: `Raise $${betAmount.toLocaleString()}`, reason: `Strong hand for ${positionCategory} position in an unopened pot.` };
            }
            else {
                if (pos === 'BB') {
                    return { action: 'Check', reason: `You are in the Big Blind with a weak hand. Check to see a free flop.` };
                }
                else {
                    return { action: 'Fold', reason: `Hand is too weak to open from ${positionCategory} position.` };
                }
            }
        }
        if (betToCall > 0) {
            let callThreshold = 40, reraiseThreshold = 10;
            if (positionCategory === 'Early') { callThreshold = 20; reraiseThreshold = 6; }
            if (positionCategory === 'Middle') { callThreshold = 30; reraiseThreshold = 8; }
            if (positionCategory === 'Late') { callThreshold = 50; reraiseThreshold = 12; }
            if (positionCategory === 'Blinds') { callThreshold = 45; reraiseThreshold = 10; }
            if (rank <= reraiseThreshold) {
                const raiseAmount = Math.round(betToCall * 3);
                return { action: `Re-raise to $${raiseAmount.toLocaleString()}`, reason: `Premium hand. Re-raise for value and to isolate.` };
            }
            if (rank <= callThreshold) {
                return { action: 'Call', reason: `Good speculative hand to see a flop with.` };
            }
            return { action: 'Fold', reason: `Hand is not strong enough to call a raise from ${positionCategory}.` };
        }
        return null;
    }

    getPostFlopAdvice(myCards, communityCards, gameState, winEquity) {
        const { pot, myStack, opponents, betToCall } = gameState;
        const handAnalysis = this.analyzeHandAndBoard(myCards, communityCards);
        if (betToCall === 0) {
            if (winEquity > 85) {
                const betAmount = Math.round(pot * 0.75);
                return { action: `Bet $${betAmount.toLocaleString()}`, reason: `Monster hand (${handAnalysis.handName}) with ${winEquity}% equity. Bet for maximum value.` };
            }
            if (winEquity > 50) {
                const betAmount = Math.round(pot * 0.66);
                return { action: `Bet $${betAmount.toLocaleString()}`, reason: `Strong hand with ${winEquity}% equity. Bet for value and protection.` };
            }
            if (winEquity > 20) {
                return { action: 'Check', reason: `Marginal hand with ${winEquity}% equity. Check to control the pot size.` };
            }
            if (handAnalysis.drawOuts > 0) {
                return { action: 'Check', reason: `You have a draw with low equity (${winEquity}%). Check to see a free card.` };
            }
            return { action: 'Fold', reason: `Weak hand with only ${winEquity}% equity. Fold unless you can check for free.` };
        }
        if (betToCall > 0) {
            const potOdds = (betToCall / (pot + betToCall)) * 100;
            if (winEquity > 65) {
                const raiseAmount = Math.round(betToCall * 3);
                return { action: `Raise to $${raiseAmount.toLocaleString()}`, reason: `Very strong hand with ${winEquity}% equity. Re-raise for value.`};
            }
            if (winEquity > potOdds) {
                return { action: 'Call', reason: `You have ${winEquity}% equity, which is greater than the required ${potOdds.toFixed(1)}% pot odds to call.` };
            }
            if (handAnalysis.drawOuts >= 8) {
                const spr = pot > 0 ? myStack / pot : Infinity;
                if (spr > 10) {
                    return { action: 'Call', reason: `Good draw (${handAnalysis.drawType}) with great implied odds due to deep stacks.` };
                }
            }
            return { action: 'Fold', reason: `You only have ${winEquity}% equity, which is not enough to profitably call the ${potOdds.toFixed(1)}% pot odds.` };
        }
        return null;
    }

    analyzeHandAndBoard(myCards, communityCards) {
        if (communityCards.length < 3) return { isImprovingHand: true, handStrength: 0, handName: 'High Card', isTopPair: false, drawOuts: 0, drawType: 'No Draw', isNutDraw: false };
        const myBestHand = this.getHandScore(myCards.concat(communityCards));
        const boardBestHand = this.getHandScore(communityCards);
        const isImprovingHand = myBestHand.score > boardBestHand.score;
        const handStrength = myBestHand.score >> 20;
        const handName = myBestHand.description.split(':')[0];
        const { outs, drawType, isNutDraw } = this.countOuts(myCards, communityCards);
        let isTopPair = false;
        if (handStrength === 1) {
            const myPairRank = parseInt(myBestHand.result[0].split('-')[1]);
            const boardRanks = communityCards.map(c => parseInt(c.split('-')[1]));
            const highestBoardCard = Math.max(...boardRanks);
            if (myPairRank >= highestBoardCard) {
                const myCardRanks = myCards.map(c => parseInt(c.split('-')[1]));
                if (myCardRanks.includes(myPairRank)) {
                    isTopPair = true;
                }
            }
        }
        return { isImprovingHand, handStrength, handName, isTopPair, drawOuts: outs, drawType, isNutDraw };
    }

    getBoardTexture(communityCards) {
        if (communityCards.length < 3) return { isPaired: false, isTrips: false, isMonotone: false, isConnected: false, isWet: false, isDry: true };
        const ranks = communityCards.map(c => parseInt(c.split('-')[1])).sort((a,b) => b-a);
        const suits = communityCards.map(c => c.split('-')[0]);
        const rankCounts = ranks.reduce((acc, rank) => { acc[rank] = (acc[rank] || 0) + 1; return acc; }, {});
        const suitCounts = suits.reduce((acc, suit) => { acc[suit] = (acc[suit] || 0) + 1; return acc; }, {});
        const isPaired = Object.values(rankCounts).some(c => c === 2);
        const isTrips = Object.values(rankCounts).some(c => c === 3);
        const isMonotone = Object.values(suitCounts).some(c => c >= 3);
        const uniqueRanks = [...new Set(ranks)];
        const isConnected = uniqueRanks[0] - uniqueRanks[uniqueRanks.length - 1] <= 4;
        return { isPaired, isTrips, isMonotone, isConnected, isWet: isMonotone || isConnected, isDry: !isMonotone && !isConnected };
    }

    countOuts(myCards,communityCards){let h=myCards.concat(communityCards),hO=this.makeHandObject(h);let fDS=null,cIS=0;for(const s in hO.suits){if(hO.suits[s].length===4){fDS=s;cIS=4;break}}const fO=fDS?13-cIS:0;const m=new Map();h.forEach(c=>{const v=parseInt(c.split("-")[1]);if(!m.has(v))m.set(v,c)});const uR=Array.from(m.keys()).sort((a,b)=>a-b);let sO=0,iO=false;for(let i=2;i<=10;i++){const n=new Set([i,i+1,i+2,i+3,i+4]);const ha=uR.filter(r=>n.has(r));if(ha.length===4){if(ha[0]===i&&ha[3]===i+3){iO=true;sO=8;break}else{sO=4}}}if(new Set(uR).has(14))uR.unshift(1);for(let i=0;i<=uR.length-4;i++){if(uR[i+3]-uR[i]===3&&(uR[i+3]<14&&uR[i]>1)){iO=true;sO=8;break}}let isNutDraw=false;if(fO>0){const mySuitCards=myCards.filter(c=>c.startsWith(fDS));if(mySuitCards.some(c=>parseInt(c.split('-')[1])===14))isNutDraw=true;}if(fO>0&&sO>0)return{outs:fO+sO,drawType:"Flush & Straight Draw",isNutDraw};if(fO>0)return{outs:fO,drawType:"Flush Draw",isNutDraw};if(iO)return{outs:sO,drawType:"Open-Ended Straight Draw",isNutDraw:true};if(sO>0)return{outs:sO,drawType:"Gutshot Straight Draw",isNutDraw};return{outs:0,drawType:"No Draw",isNutDraw:false}}
    getHandImprovements(myCards,communityCards,deck,currentHand){const i={};const cC=myCards.concat(communityCards);const cH_S=currentHand.score;for(const c of deck){const pH=cC.concat([c]);const nH=this.getHandScore(pH);if(nH.score>cH_S){const hN=nH.description.split(":")[0];if(!i[hN]){i[hN]={outs:[],result:nH}}i[hN].outs.push(c)}}return i}

    async processTbsQueue() {
        if (this.isFetchingTbs || this.tbsQueue.length === 0) {
            return;
        }
        this.isFetchingTbs = true;
        while (this.tbsQueue.length > 0) {
            const userId = this.tbsQueue.shift();
            const tbs = await this.fetchBattleStats(userId);
            const playerData = this.playersOnTable.get(userId);
            if (playerData) {
                playerData.tbs = tbs;
                this.renderMuggingList();
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        this.isFetchingTbs = false;
    }

    async updateMuggingHelper() {
        const currentPlayersOnDOM = document.querySelectorAll("[class*='playerPositioner-']:not([class*='emptyPlayer___']) [id^='player-']");
        const currentPlayerIds = new Set();
        let needsRender = false;
        let newPlayersFound = false;

        for (const playerDiv of currentPlayersOnDOM) {
            const id = playerDiv.id.replace('player-', '');
            const isMe = playerDiv.closest("[class*='playerMeGateway___']");
            if (isMe) continue;

            currentPlayerIds.add(id);

            const stackEl = playerDiv.querySelector("[class*='potString___'], [class*='money___']");
            const stack = stackEl ? this.parseMoney(stackEl.textContent) : 0;

            if (!this.playersOnTable.has(id)) {
                needsRender = true;
                newPlayersFound = true;
                const nameEl = playerDiv.querySelector("[class*='name___']");
                const name = nameEl ? nameEl.textContent.trim() : 'Unknown';
                this.playersOnTable.set(id, { name, stack, tbs: '...' });
                this.tbsQueue.push(id);
            } else {
                const playerData = this.playersOnTable.get(id);
                if (playerData.stack !== stack) {
                    playerData.stack = stack;
                    needsRender = true;
                }
            }
        }

        this.playersOnTable.forEach((playerData, id) => {
            if (!currentPlayerIds.has(id)) {
                if (playerData.stack > 0) {
                    this.showLeaverNotification(playerData.name, playerData.stack, id);
                }
                this.playersOnTable.delete(id);
                needsRender = true;
            }
        });

        if (newPlayersFound) {
            this.processTbsQueue();
        }

        if (needsRender) {
            this.renderMuggingList();
        }
    }

    renderMuggingList() {
        const muggingList = document.getElementById("pokerMuggingList");
        if (!muggingList) return;

        muggingList.innerHTML = "";
        if (this.playersOnTable.size > 0) {
            this.playersOnTable.forEach((playerData, id) => {
                const li = document.createElement("li");
                const tbsDisplay = playerData.tbs === '...' ? '...' : this.formatTbs(playerData.tbs);
                li.innerHTML = `
                    <a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank" rel="noopener noreferrer" class="player-info">
                        <span>${playerData.name} - <b>$${playerData.stack.toLocaleString()}</b></span>
                        <small>TBS: ${tbsDisplay}</small>
                    </a>
                    <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${id}" target="_blank" rel="noopener noreferrer" class="attack-link">Attack</a>
                `;
                muggingList.appendChild(li);
            });
        } else {
            muggingList.innerHTML = "<li>No opponents at table.</li>";
        }
    }


    showLeaverNotification(name, amount, id) {
        const notification = document.createElement('div');
        notification.className = 'leaver-notification';
        notification.innerHTML = `
            <span>${name} left with <b>$${amount.toLocaleString()}</b></span>
            <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${id}" target="_blank" rel="noopener noreferrer">Attack</a>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    initObserver(){const t=document.getElementById("react-root");if(!t){return}const c={childList:true,subtree:true,attributes:true,attributeFilter:["class","style"]};const cb=(m,o)=>{clearTimeout(this.updateTimeout);this.updateTimeout=setTimeout(()=>{this.update()},250)};this.observer=new MutationObserver(cb);this.observer.observe(t,c);this.update()}
    addStyle(){GM_addStyle(`#pokerCalc-div * { all: revert; font-family: Arial, Helvetica, sans-serif; } #pokerCalc-div { position: relative; background-color: #f0f0f0; color: #333; padding: 8px; margin-top: 10px; border: 1px solid #ccc; border-radius: 5px; } #pokerCalc-div table { border-collapse: collapse; margin-top: 10px; width: 100%; font-size: 12px; } #pokerCalc-div th, #pokerCalc-div td { border: 1px solid #ccc; padding: 6px; text-align: left; } #pokerCalc-div th { background-color: #e2e2e2; } #pokerCalc-gameState td:nth-child(1), #pokerCalc-preFlop td:nth-child(1), #pokerCalc-advice td:nth-child(1) { width: 40%; font-weight: bold; } #pokerCalc-gameState td:nth-child(2), #pokerCalc-preFlop td:nth-child(2) { width: 60%; text-align: right; } #pokerCalc-myHand tr td:nth-child(1), #pokerCalc-myHand tr td:nth-child(3), #pokerCalc-myHand tr td:nth-child(4), #pokerCalc-upgrades tr td:nth-child(1) { text-align: center; } #pokerCalc-div caption { padding: 4px; font-weight: bold; background-color: #e2e2e2; border: 1px solid #ccc; border-bottom: none; text-align: left; } #pokerCalc-debug { text-align: left; font-size: 10px; color: #555; margin-top: 8px; padding: 4px; border: 1px solid #ddd; background-color: #f9f9f9; max-height: 80px; overflow-y: auto; } #pokerMuggingHelper { position: fixed; top: 10px; right: 10px; width: 220px; background-color: #f9f9f9; border: 1px solid #aaa; border-radius: 5px; z-index: 10000; color: #333; } #pokerMuggingHelper h4 { all: revert; font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 8px; background-color: #e2e2e2; font-size: 14px; font-weight: bold; border-bottom: 1px solid #aaa; border-radius: 5px 5px 0 0; text-align: center; } #pokerMuggingHelper h4 button { all: revert; float: right; border: 1px solid #999; background: #eee; cursor: pointer; color: #c00; font-weight: bold; border-radius: 3px; } #pokerMuggingHelper h4 button:hover { background: #ddd; } #pokerMuggingHelper ul { all: revert; list-style: none; padding: 5px; margin: 0; max-height: 200px; overflow-y: auto; } #pokerMuggingHelper li { all: revert; font-family: Arial, Helvetica, sans-serif; padding: 4px 8px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; } #pokerMuggingHelper li:last-child { border-bottom: none; } #pokerMuggingHelper a { all: revert; font-family: Arial, Helvetica, sans-serif; text-decoration: none; } #pokerMuggingHelper .player-info { display: flex; flex-direction: column; flex-grow: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 5px; color: #333; } #pokerMuggingHelper .player-info:hover { text-decoration: underline; } #pokerMuggingHelper .player-info small { color: #555; font-size: 10px; } #pokerMuggingHelper .attack-link { color: #c00; font-weight: bold; font-size:12px; } #pokerMuggingHelper .attack-link:hover { text-decoration: underline; } .leaver-notification { position: fixed; top: 250px; right: 10px; padding: 15px; background-color: #ffc107; color: black; border: 2px solid #c00; border-radius: 8px; z-index: 10001; font-size: 16px; font-weight: bold; animation: flash-fade 5s forwards; display: flex; justify-content: space-between; align-items: center; width: 320px; } .leaver-notification a { all: revert; font-family: Arial, Helvetica, sans-serif; color: #c00; text-decoration: none; font-weight: bold; font-size: 14px; padding: 5px 10px; background-color: white; border: 1px solid #c00; border-radius: 4px; margin-left: 10px; } .leaver-notification a:hover { background-color: #f0f0f0; } @keyframes flash-fade { 0%, 10%, 20%, 30% { opacity: 1; transform: scale(1.1); } 5%, 15%, 25% { opacity: 0.7; transform: scale(1); } 80% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.5); } }`)}
    addStatisticsTable(){if(!document.querySelector("#react-root")){setTimeout(()=>this.addStatisticsTable(),1000);return}let p=document.getElementById("pokerCalc-div");if(!p){p=document.createElement("div");p.id="pokerCalc-div";const t=document.querySelector("#content, #react-root");if(t){t.appendChild(p)}else{return}}p.innerHTML=`<table id="pokerCalc-gameState"><caption>Game State</caption><tbody></tbody></table><table id="pokerCalc-advice" style="display:none;"><caption>Strategic Advice</caption><tbody></tbody></table><table id="pokerCalc-preFlop" style="display:none;"><caption>Pre-flop Analysis</caption><tbody></tbody></table><table id="pokerCalc-myHand" style="display:none;"><caption>Your Hand (Simulated)</caption><thead><tr><th style="width:15%">Name</th><th>Hand</th><th style="width:18%">Rank</th><th style="width:18%">Top</th></tr></thead><tbody></tbody></table><table id="pokerCalc-upgrades" style="display:none;"><caption>Your Potential Hands</caption><thead><tr><th style="width:25%">Chance</th><th>Hand</th></tr></thead><tbody></tbody></table><div id="pokerCalc-debug"></div>`; this.addMuggingHelperUI();}
    addMuggingHelperUI() {
        let h=document.getElementById("pokerMuggingHelper");
        if(!h){
            h=document.createElement("div");
            h.id="pokerMuggingHelper";
            document.body.appendChild(h)
        }
        h.innerHTML=`
            <h4>
                Mugging Helper
                <button id="removeApiKeyBtn" title="Remove API Key">X</button>
            </h4>
            <ul id="pokerMuggingList"></ul>
        `;
        document.getElementById('removeApiKeyBtn').addEventListener('click', () => this.removeApiKey());
    }

    prettifyHand(hand){let t="";for(let c of hand){if(c!="null-0"){t+=" "+c.replace("diamonds","<span style='color: red'>♦</span>").replace("spades","<span style='color: black'>♠</span>").replace("hearts","<span style='color: red'>♥</span>").replace("clubs","<span style='color: black'>♣</span>").replace("-14","A").replace("-13","K").replace("-12","Q").replace("-11","J").replace("-","");}}return t;}
    getFullDeck(){let r=[];const s=["hearts","diamonds","spades","clubs"];for(let u of s){for(let v=2;v<=14;v++){r.push(`${u}-${v}`);}}return r;}
    filterDeck(deck,cardsToRemove){const r=new Set(cardsToRemove);return deck.filter(c=>!r.has(c));}
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    calculateHandRank(myCards, communityCards, allCards, numOpponents) {
        if (!myCards || myCards.length < 2 || numOpponents <= 0) {
            return { rank: "N/A", top: "N/A", winEquity: 0 };
        }
        const startTime = performance.now();
        let wins = 0, ties = 0;
        for (let i = 0; i < this.SIMULATION_TRIALS; i++) {
            let tempDeck = this.shuffleArray([...allCards]);
            let opponentHands = [];
            for (let j = 0; j < numOpponents; j++) {
                if (tempDeck.length < 2) break;
                opponentHands.push([tempDeck.pop(), tempDeck.pop()]);
            }
            let cardsToDeal = 5 - communityCards.length;
            let runout = [];
            for (let k = 0; k < cardsToDeal; k++) {
                if (tempDeck.length < 1) break;
                runout.push(tempDeck.pop());
            }
            const finalBoard = communityCards.concat(runout);
            const myFinalHand = this.getHandScore(myCards.concat(finalBoard));
            let bestOpponentHandScore = 0;
            for (const oppHand of opponentHands) {
                const oppFinalHand = this.getHandScore(oppHand.concat(finalBoard));
                if (oppFinalHand.score > bestOpponentHandScore) {
                    bestOpponentHandScore = oppFinalHand.score;
                }
            }
            if (myFinalHand.score > bestOpponentHandScore) wins++;
            else if (myFinalHand.score === bestOpponentHandScore) ties++;
        }
        const endTime = performance.now();
        const losses = this.SIMULATION_TRIALS - wins - ties;
        const winEquity = ((wins + ties / 2) / this.SIMULATION_TRIALS) * 100;
        const topEquity = ((losses + ties / 2) / this.SIMULATION_TRIALS) * 100;
        const newLogEntry = {
            simsRan: this.SIMULATION_TRIALS,
            simTime: (endTime - startTime).toFixed(2),
            winEquity: winEquity.toFixed(1),
            opponents: numOpponents,
            timestamp: new Date().toLocaleTimeString('en-GB')
        };
        this.debugLog.unshift(newLogEntry);
        if (this.debugLog.length > 5) this.debugLog.pop();
        return {
            rank: `Win: ${winEquity.toFixed(1)}%`,
            top: `Top ${topEquity.toFixed(1)}%`,
            winEquity: winEquity.toFixed(1)
        };
    }

    getHandScore(hand){hand=hand.filter(e=>!e.includes("null"));if(hand.length<5)return{description:"",score:0};let r="",t="",h,o=this.makeHandObject(hand);if(h=this.hasFourOfAKind(hand,o)){r+="7";t+="Four of a kind:";}else if(h=this.hasFullHouse(hand,o)){r+="6";t+="Full house:";}else if(h=this.hasFlush(hand,o)){let i,s;if(i=this.hasRoyalFlush(hand,o)){h=i;r+="9";t+="Royal flush:";}else if(s=this.hasStraightFlush(hand,o)){h=s;r+="8";t+="Straight flush:";}else{r+="5";t+="Flush:";}}else if(h=this.hasStraight(hand,o)){r+="4";t+="Straight:";}else if(h=this.hasThreeOfAKind(hand,o)){r+="3";t+="Three of a kind:";}else if(h=this.hasTwoPairs(hand,o)){r+="2";t+="Two pairs:";}else if(h=this.hasPair(hand,o)){r+="1";t+="Pair:";}else{r+="0";t+="High card:";h=hand.sort((a,b)=>parseInt(b.split('-')[1])-parseInt(a.split('-')[1])).slice(0,5);}for(let c of h){r+=parseInt(c.split("-")[1]).toString(16).padStart(2,'0');}t+=this.prettifyHand(h);return{description:t,result:h,score:parseInt(r,16)};}
    makeHandObject(hand){let r={cards:hand,suits:{},values:{}};hand.sort((a,b)=>parseInt(b.split("-")[1])-parseInt(a.split("-")[1])).filter(e=>e!="null-0").forEach(e=>{let s=e.split("-")[0],v=e.split("-")[1];if(!r.suits[s])r.suits[s]=[];if(!r.values[v])r.values[v]=[];r.suits[s].push(e);r.values[v].push(e);});return r;}
    hasRoyalFlush(hand,handObject){for(let s in handObject.suits){const c=handObject.suits[s];if(c.length>=5){const v=new Set(c.map(c=>parseInt(c.split("-")[1])));if([10,11,12,13,14].every(val=>v.has(val))){return c.filter(c=>parseInt(c.split("-")[1])>=10).sort((a,b)=>parseInt(b.split("-")[1])-parseInt(a.split("-")[1])).slice(0,5);}}}return null;}
    hasStraightFlush(hand,handObject){for(let s in handObject.suits){if(handObject.suits[s].length>=5){const f=this.hasStraight(handObject.suits[s],this.makeHandObject(handObject.suits[s]));if(f)return f;}}return null;}
    hasFourOfAKind(hand,handObject){let q=Object.values(handObject.values).find(e=>e.length===4);if(q){const s=new Set(q);const k=hand.filter(c=>!s.has(c)).sort((a,b)=>parseInt(b.split('-')[1])-parseInt(a.split('-')[1]));return q.concat(k).slice(0,5);}}
    hasFullHouse(hand,handObject){let t=Object.values(handObject.values).filter(e=>e.length>=3).sort((a,b)=>parseInt(b[0].split("-")[1])-parseInt(a[0].split("-")[1]));if(!t.length)return null;for(let h of t){const v=parseInt(h[0].split("-")[1]);let p=Object.values(handObject.values).filter(e=>e.length>=2&&parseInt(e[0].split("-")[1])!==v).sort((a,b)=>parseInt(b[0].split("-")[1])-parseInt(a[0].split("-")[1]));if(p.length)return h.slice(0,3).concat(p[0].slice(0,2));}return null;}
    hasFlush(hand,handObject){for(let s in handObject.suits){if(handObject.suits[s].length>=5){return handObject.suits[s].sort((a,b)=>parseInt(b.split("-")[1])-parseInt(a.split("-")[1])).slice(0,5);}}return null;}
    hasStraight(hand,handObject){const m=new Map();hand.forEach(c=>{const v=parseInt(c.split("-")[1]);if(!m.has(v))m.set(v,c);});let u=Array.from(m.keys()).sort((a,b)=>b-a);if(u.includes(14))u.push(1);for(let i=0;i<=u.length-5;i++){const r=u.slice(i,i+5);if(r[0]-r[4]===4){if(r[0]===5&&r[4]===1)return[m.get(5),m.get(4),m.get(3),m.get(2),m.get(14)];return r.map(v=>m.get(v));}}return null;}
    hasThreeOfAKind(hand,handObject){let t=Object.values(handObject.values).filter(e=>e.length===3).sort((a,b)=>parseInt(b[0].split("-")[1])-parseInt(a[0].split("-")[1]));if(t.length){const s=new Set(t[0]);const k=hand.filter(c=>!s.has(c)).sort((a,b)=>parseInt(b.split('-')[1])-parseInt(a.split('-')[1]));return t[0].concat(k).slice(0,5);}}
    hasTwoPairs(hand,handObject){let p=Object.values(handObject.values).filter(e=>e.length===2).sort((a,b)=>parseInt(b[0].split("-")[1])-parseInt(a[0].split("-")[1]));if(p.length>1){const s1=new Set(p[0]),s2=new Set(p[1]);const k=hand.filter(c=>!s1.has(c)&&!s2.has(c)).sort((a,b)=>parseInt(b.split('-')[1])-parseInt(a.split('-')[1]));return p[0].concat(p[1]).concat(k).slice(0,5);}}
    hasPair(hand,handObject){let p=Object.values(handObject.values).filter(e=>e.length===2).sort((a,b)=>parseInt(b[0].split("-")[1])-parseInt(a[0].split("-")[1]));if(p.length){const s=new Set(p[0]);const k=hand.filter(c=>!s.has(c)).sort((a,b)=>parseInt(b.split('-')[1])-parseInt(a.split('-')[1]));return p[0].concat(k).slice(0,5);}}
}

function initialize() {
    const interval = setInterval(() => {
        if (document.querySelector("#react-root")) {
            clearInterval(interval);
            window.pokerCalculator = new PokerCalculatorModule();
            window.pokerCalculator.addStatisticsTable();
            window.pokerCalculator.initObserver();
        }
    }, 500);
}

initialize();
