// ==UserScript==
// @name         Cookie Clicker upgrade suggester
// @namespace    http://azzurite.tv
// @version      1.0.3
// @description  Clears the top bar and instead displays suggestions for next buy there
// @author       Azzurite
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/389700/Cookie%20Clicker%20upgrade%20suggester.user.js
// @updateURL https://update.greasyfork.org/scripts/389700/Cookie%20Clicker%20upgrade%20suggester.meta.js
// ==/UserScript==


var myWindow = {
	skeleton: `<form class="" style="display:none"> <div id="altStatus">ALT MODE</div> <div>  <a id="importSave">Import save</a>  <a id="reimportSave" class="hidden">Re-import last import</a>  <label>Bakery name: <input id="bakeryNameIn" type="text" class="text" maxlength="28" spellcheck="false" tabindex="2" value="Sweet Burglar"></label>&nbsp;  <a id="randomBakeryName">Random name</a>  &nbsp;|&nbsp;  <label data-title="The longer your session, the more bonus from Century egg.">   Session start time: <input id="sessionStartTime" type="text" class="date" placeholder="0" tabindex="2" value="1567368116765">  </label>  <br>  <label><input id="abbrCheck" type="checkbox" tabindex="2" checked="checked"> Shorten numbers</label>  &nbsp;|&nbsp;  <label>Average clicks per second: <input id="clicksPsIn" type="text" class="deci" maxlength="7" placeholder="0" tabindex="2" value="20"></label>  &nbsp;|&nbsp;  <label><input id="bornAgainCheck" type="checkbox" tabindex="2"> Born again challenge mode</label>  <br>  <label id="heraldsInLabel" data-title="">Heralds: <input id="heraldsIn" type="text" maxlength="3" placeholder="0" tabindex="2" value="0"></label>  &nbsp;|&nbsp;  <label id="lumpsInLabel">Sugar lumps: <input id="lumpsIn" type="text" placeholder="0" tabindex="2" value="0"></label>  &nbsp;|&nbsp;  <label id="prestigeInLabel">Prestige levels: <input id="prestigeIn" type="text" class="heaven" placeholder="0" tabindex="2" value="0"></label>  <span id="prestigeMultSpan" class="hidden">(+<span id="prestigeMult"><span>0</span></span>% CpS)</span>&nbsp;  <a id="recalcButton">Recalculate</a> </div> <br> <div class="marginHead">  Buildings tables&nbsp;  <span id="buildTableTabs" class="tabs" data-tabblocks="buildTables">   <a id="buildTableTabCps" class="tab tabCurrent">CpS</a>   <a id="buildTableTabPrice" class="tab">Prices</a>  </span>  <span data-title="Ctrl-click to add 10 (or 1 if 10 is selected), shift-click to add 100.">   -/+ buttons:   <label><input id="plusminus1" type="radio" class="plusminusCheck" name="plusminusCheck" checked="checked" tabindex="2"> 1</label>   <label><input id="plusminus10" type="radio" class="plusminusCheck" name="plusminusCheck" tabindex="2"> 10</label>   <label><input id="plusminus100" type="radio" class="plusminusCheck" name="plusminusCheck" tabindex="2"> 100</label>  </span>  &nbsp;|&nbsp;  <label><input id="foolsNameCheck" type="checkbox" tabindex="2"> Show Business Day building names</label>  <span id="sellCheckSpan" class="hidden">   &nbsp;|&nbsp;<label><input id="sellCheck" type="checkbox" tabindex="2"> Show sell</label>  </span> </div> <div id="buildTables">  <table id="buildCpsTable" class="tabBlock hideCpsPlus">   <thead><tr>    <th>Name</th><th>Amount</th><th>Level</th><th>Price</th>    <th>CpS</th><th>Time for</th><th>+CpS</th>    <th class="cpsPlus">+CpS w/ clicks</th>    <th>Amortization <span class="help" data-title="Time for the increase in CpS to pay for the purchase.">[?]</span></th>   </tr></thead>   <tbody>    <tr class="buildingRow buildCpsRow" data-object="Cursor"><td class="name">Cursor</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn0" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn0" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span>15</span></td><td class="cps"><span>0</span></td><td class="time">1s</td><td class="nextCps"><span>0.1</span></td><td class="cpsPlus"><span>0.1</span></td><td class="amort">2m 30s</td></tr><tr class="buildingRow buildCpsRow" data-object="Grandma"><td class="name">Grandma</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn1" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn1" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span>100</span></td><td class="cps"><span>0</span></td><td class="time">5s</td><td class="nextCps"><span>1</span></td><td class="cpsPlus"><span>1</span></td><td class="amort">1m 40s</td></tr><tr class="buildingRow buildCpsRow" data-object="Farm"><td class="name">Farm</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn2" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn2" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span>1,100</span></td><td class="cps"><span>0</span></td><td class="time">55s</td><td class="nextCps"><span>8</span></td><td class="cpsPlus"><span>8</span></td><td class="amort">2m 18s</td></tr><tr class="buildingRow buildCpsRow" data-object="Mine"><td class="name">Mine</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn3" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn3" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span>12,000</span></td><td class="cps"><span>0</span></td><td class="time">10m</td><td class="nextCps"><span>47</span></td><td class="cpsPlus"><span>47</span></td><td class="amort">4m 16s</td></tr><tr class="buildingRow buildCpsRow" data-object="Factory"><td class="name">Factory</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn4" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn4" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span>130,000</span></td><td class="cps"><span>0</span></td><td class="time">1h 48m 20s</td><td class="nextCps"><span>260</span></td><td class="cpsPlus"><span>260</span></td><td class="amort">8m 20s</td></tr><tr class="buildingRow buildCpsRow" data-object="Bank"><td class="name">Bank</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn5" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn5" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="1,400,000">1.4 M</span></td><td class="cps"><span>0</span></td><td class="time">19h 26m 40s</td><td class="nextCps"><span>1,400</span></td><td class="cpsPlus"><span>1,400</span></td><td class="amort">16m 40s</td></tr><tr class="buildingRow buildCpsRow" data-object="Temple"><td class="name">Temple</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn6" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn6" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="20,000,000">20 M</span></td><td class="cps"><span>0</span></td><td class="time">277h 46m 40s</td><td class="nextCps"><span>7,800</span></td><td class="cpsPlus"><span>7,800</span></td><td class="amort">42m 45s</td></tr><tr class="buildingRow buildCpsRow" data-object="Wizard tower"><td class="name">Wizard tower</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn7" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn7" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="330,000,000">330 M</span></td><td class="cps"><span>0</span></td><td class="time">4,583h 20m</td><td class="nextCps"><span>44,000</span></td><td class="cpsPlus"><span>44,000</span></td><td class="amort">2h 5m</td></tr><tr class="buildingRow buildCpsRow" data-object="Shipment"><td class="name">Shipment</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn8" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn8" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="5,100,000,000">5.1 B</span></td><td class="cps"><span>0</span></td><td class="time">70,833h 20m</td><td class="nextCps"><span>260,000</span></td><td class="cpsPlus"><span>260,000</span></td><td class="amort">5h 26m 56s</td></tr><tr class="buildingRow buildCpsRow" data-object="Alchemy lab"><td class="name">Alchemy lab</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn9" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn9" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="75,000,000,000">75 B</span></td><td class="cps"><span>0</span></td><td class="time">1.042 Mh 40m</td><td class="nextCps"><span data-title="1,600,000">1.6 M</span></td><td class="cpsPlus"><span data-title="1,600,000">1.6 M</span></td><td class="amort">13h 1m 15s</td></tr><tr class="buildingRow buildCpsRow" data-object="Portal"><td class="name">Portal</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn10" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn10" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="1,000,000,000,000">1 T</span></td><td class="cps"><span>0</span></td><td class="time">13.889 M h 53m 20s</td><td class="nextCps"><span data-title="10,000,000">10 M</span></td><td class="cpsPlus"><span data-title="10,000,000">10 M</span></td><td class="amort">27h 46m 40s</td></tr><tr class="buildingRow buildCpsRow" data-object="Time machine"><td class="name">Time machine</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn11" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn11" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="14,000,000,000,000">14 T</span></td><td class="cps"><span>0</span></td><td class="time">194.444 M h 26m 40s</td><td class="nextCps"><span data-title="65,000,000">65 M</span></td><td class="cpsPlus"><span data-title="65,000,000">65 M</span></td><td class="amort">59h 49m 45s</td></tr><tr class="buildingRow buildCpsRow" data-object="Antimatter condenser"><td class="name">Antimatter condenser</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn12" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn12" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="170,000,000,000,000">170 T</span></td><td class="cps"><span>0</span></td><td class="time">2.361 B h 6m 40s</td><td class="nextCps"><span data-title="430,000,000">430 M</span></td><td class="cpsPlus"><span data-title="430,000,000">430 M</span></td><td class="amort">109h 49m 9s</td></tr><tr class="buildingRow buildCpsRow" data-object="Prism"><td class="name">Prism</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn13" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn13" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="2,100,000,000,000,000">2.1 Qa</span></td><td class="cps"><span>0</span></td><td class="time">29.167 B h 40m</td><td class="nextCps"><span data-title="2,900,000,000">2.9 B</span></td><td class="cpsPlus"><span data-title="2,900,000,000">2.9 B</span></td><td class="amort">201h 8m 58s</td></tr><tr class="buildingRow buildCpsRow" data-object="Chancemaker"><td class="name">Chancemaker</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn14" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn14" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="26,000,000,000,000,000">26 Qa</span></td><td class="cps"><span>0</span></td><td class="time">361.111 B h 6m 40s</td><td class="nextCps"><span data-title="21,000,000,000">21 B</span></td><td class="cpsPlus"><span data-title="21,000,000,000">21 B</span></td><td class="amort">343h 54m 56s</td></tr><tr class="buildingRow buildCpsRow" data-object="Fractal engine"><td class="name">Fractal engine</td><td><a class="minus plusminus">-</a> <input id="buildCpsAmountIn15" type="text" maxlength="4" tabindex="3" placeholder="0" value="0"> <a class="plus plusminus">+</a></td><td><a class="minus plusminus limited">-</a> <input id="buildLevelIn15" type="text" maxlength="2" tabindex="4" placeholder="0" value="0"> <a class="plus plusminus limited">+</a></td><td class="buildPrice"><span data-title="310,000,000,000,000,000">310 Qa</span></td><td class="cps"><span>0</span></td><td class="time">4.306 T h 33m 20s</td><td class="nextCps"><span data-title="150,000,000,000">150 B</span></td><td class="cpsPlus"><span data-title="150,000,000,000">150 B</span></td><td class="amort">574h 4m 27s</td></tr><tr id="buildCpsTotUp" class="section">     <td>Upgrades &amp; minigames</td><td></td><td></td><td></td><td class="cps"><span>0</span></td>     <td colspan="2" class="alignLeft"><small>(multiplier: <span class="mult"><span>100</span></span>%)</small></td>     <td class="cpsPlus"></td><td></td>    </tr>    <tr id="buildCpsTotAch">     <td>Achievements</td><td>Milk: <span class="milk"><span>0</span></span>%</td><td></td><td></td>     <td class="cps"><span>0</span></td><td></td><td class="nextCps">---</td>     <td class="nextCpsPlus cpsPlus">---</td><td></td>    </tr>    <tr id="buildCpsTotal" class="section">     <td>Total</td><td class="amount">0</td><td></td><td></td>     <td class="cps"><span>0</span></td><td></td><td class="cpsPlus"></td>     <td colspan="2">Cookies per click: <span class="perClick"><span>1</span></span></td>    </tr>   </tbody>  </table>  <table id="buildPriceTable" class="tabBlock hidden hideSell">   <thead><tr>    <th>Name</th><th>Current</th><th class="noMinWidth"></th><th>Desired</th>    <th>Price (1)</th><th>Price (10)</th><th>Price (100)</th><th>Price (desired)</th>    <th id="buildPriceCumuHead" class="cumu">Price paid</th><th class="sell">Sell return</th>   </tr></thead>   <tbody>    <tr class="buildingRow buildPriceRow" data-object="Cursor"><td class="name">Cursor</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn0" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn0" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span>15</span></td><td class="buy10"><span>308</span></td><td class="buy100"><span data-title="117,431,291">117.431 M</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Grandma"><td class="name">Grandma</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn1" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn1" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span>100</span></td><td class="buy10"><span>2,035</span></td><td class="buy100"><span data-title="782,875,017">782.875 M</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Farm"><td class="name">Farm</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn2" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn2" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span>1,100</span></td><td class="buy10"><span>22,337</span></td><td class="buy100"><span data-title="8,611,624,689">8.612 B</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Mine"><td class="name">Mine</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn3" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn3" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span>12,000</span></td><td class="buy10"><span>243,649</span></td><td class="buy100"><span data-title="93,944,996,104">93.945 B</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Factory"><td class="name">Factory</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn4" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn4" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span>130,000</span></td><td class="buy10"><span data-title="2,639,485">2.639 M</span></td><td class="buy100"><span data-title="1,017,737,457,316">1.018 T</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Bank"><td class="name">Bank</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn5" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn5" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="1,400,000">1.4 M</span></td><td class="buy10"><span data-title="28,425,209">28.425 M</span></td><td class="buy100"><span data-title="10,960,249,539,916">10.96 T</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Temple"><td class="name">Temple</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn6" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn6" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="20,000,000">20 M</span></td><td class="buy10"><span data-title="406,074,367">406.074 M</span></td><td class="buy100"><span data-title="156,574,993,426,755">156.575 T</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Wizard tower"><td class="name">Wizard tower</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn7" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn7" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="330,000,000">330 M</span></td><td class="buy10"><span data-title="6,700,227,021">6.7 B</span></td><td class="buy100"><span data-title="2,583,487,391,540,660">2.583 Qa</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Shipment"><td class="name">Shipment</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn8" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn8" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="5,100,000,000">5.1 B</span></td><td class="buy10"><span data-title="103,548,963,016">103.549 B</span></td><td class="buy100"><span data-title="39,926,623,323,809,500">39.927 Qa</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Alchemy lab"><td class="name">Alchemy lab</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn9" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn9" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="75,000,000,000">75 B</span></td><td class="buy10"><span data-title="1,522,778,867,856">1.523 T</span></td><td class="buy100"><span data-title="587,156,225,350,139,100">587.156 Qa</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Portal"><td class="name">Portal</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn10" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn10" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="1,000,000,000,000">1 T</span></td><td class="buy10"><span data-title="20,303,718,238,054">20.304 T</span></td><td class="buy100"><span data-title="7,828,749,671,335,187,000">7.829 Qi</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Time machine"><td class="name">Time machine</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn11" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn11" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="14,000,000,000,000">14 T</span></td><td class="buy10"><span data-title="284,252,055,332,739">284.252 T</span></td><td class="buy100"><span data-title="109,602,495,398,692,630,000">109.602 Qi</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Antimatter condenser"><td class="name">Antimatter condenser</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn12" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn12" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="170,000,000,000,000">170 T</span></td><td class="buy10"><span data-title="3,451,632,100,468,966">3.452 Qa</span></td><td class="buy100"><span data-title="1.3308874441269822e+21">1.331 Sx</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Prism"><td class="name">Prism</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn13" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn13" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="2,100,000,000,000,000">2.1 Qa</span></td><td class="buy10"><span data-title="42,637,808,299,910,730">42.638 Qa</span></td><td class="buy100"><span data-title="1.6440374309803895e+22">16.44 Sx</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Chancemaker"><td class="name">Chancemaker</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn14" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn14" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="26,000,000,000,000,000">26 Qa</span></td><td class="buy10"><span data-title="527,896,674,189,370,800">527.897 Qa</span></td><td class="buy100"><span data-title="2.035474914547149e+23">203.547 Sx</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr class="buildingRow buildPriceRow" data-object="Fractal engine"><td class="name">Fractal engine</td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountCurrentIn15" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td><a class="setDesired">⇛</a></td><td><a class="minus plusminus">-</a> <input id="buildPriceAmountDesiredIn15" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></td><td class="buy1"><span data-title="310,000,000,000,000,000">310 Qa</span></td><td class="buy10"><span data-title="6,294,152,653,796,344,000">6.294 Qi</span></td><td class="buy100"><span data-title="2.4269123981139086e+24">2.427 Sp</span></td><td class="buyDesired"><span>0</span></td><td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td></tr><tr id="buildPriceTotal" class="section">     <td>Total</td><td class="amount">0</td><td></td><td class="desired"><span>0</span></td>     <td class="buy1"><span data-title="338,285,080,451,543,230">338.285 Qa</span></td><td class="buy10"><span data-title="6,868,444,957,625,130,000">6.868 Qi</span></td><td class="buy100"><span data-title="2.6483492124026164e+24">2.648 Sp</span></td><td class="buyDesired"><span>0</span></td>     <td class="cumu"><span>0</span></td><td class="sell"><span>0</span></td>    </tr>   </tbody>  </table> </div> <br> <div id="cpsMods">  <div id="globalCpsModIcons" class="menuIcons" data-upgrade-group="globalCpsMod"><div class="upgrade crate toggle togglePair extraCrate" style="background-position: -384px -432px;" data-upgrade="Elder Covenant" data-id="84"></div><div class="upgrade crate toggle togglePair extraCrate hidden" style="background-position: -384px -432px;" data-upgrade="Revoke Elder Covenant" data-id="85"></div><div class="upgrade crate debug extraCrate" style="background-position: -816px -240px;" data-upgrade="Magic shenanigans" data-id="208"></div><div class="upgrade crate toggle togglePair extraCrate" style="background-position: -960px -480px;" data-upgrade="Golden switch [off]" data-id="331"></div><div class="upgrade crate toggle togglePair extraCrate hidden" style="background-position: -1008px -480px;" data-upgrade="Golden switch [on]" data-id="332"></div><div class="upgrade crate debug extraCrate" style="background-position: -720px -240px;" data-upgrade="Occult obstruction" data-id="398"></div><div class="upgrade crate toggle togglePair extraCrate" style="background-position: -432px -480px;" data-upgrade="Shimmering veil [off]" data-id="563"></div><div class="upgrade crate toggle togglePair extraCrate hidden" style="background-position: -432px -480px;" data-upgrade="Shimmering veil [on]" data-id="564"></div></div>  <div>   <label class="lockCheckSpan" data-title="Ctrl-, alt-, and/or shift-click to do the opposite."><input class="lockChecker" type="checkbox" tabindex="5"> Toggle locks on click</label>   <br><br>   <label id="numWrinklersInSpan">Wrinklers munching: <a class="minus plusminus limited">-</a> <input id="numWrinklersIn" type="text" maxlength="2" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus limited">+</a></label>   &nbsp;|&nbsp;   <label id="numGoldenCookiesInSpan" data-title="For the Dragon's Fortune aura.">Golden cookies on screen: <a class="minus plusminus limited">-</a> <input id="numGoldenCookiesIn" type="text" maxlength="4" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus limited">+</a></label>  </div> </div> <br> <div id="cpsWithMultsBlock">Cookies per Second: <span><span>0</span></span><br>Cookies per Click: <span>1</span><br>Total: <span>20</span> Cookies per Second<br><br></div> <!-- CpS: <span id="cpsMultTotal">0</span> <small id="witherCentSpan" class="warning hidden">  (withered: <span id="witherCent">0</span>%) </small> <div id="totClicksSpan" class="hidden">  Cookies per click: +<span id="cookiesOnClick2">1</span> =  <span id="totCookieClicks">0</span> cookies per second  <br>  otal cookies per second: +<span id="totCpsPlusClicks">0</span> </div> --> <div id="adviceBlock">  <div id="recOptions">   <span id="bankSpan" data-title="Shows minimum cookies to have in your bank before purchase to keep at least the current maximum &quot;Lucky!&quot; bonuses.">    Show bank:    <label><input id="bankNone" type="radio" name="bank" tabindex="5"> Off</label>    <label><input id="bankLucky" type="radio" name="bank" tabindex="5" checked="checked"> Lucky!</label>    <label><input id="bankFrenzy" type="radio" name="bank" tabindex="5"> x7 Lucky!</label>    <label id="bankFullCheckSpan" class="hidden" data-title="Banks to gain full lucky bonuses after purchase, vs the default banking to gain bonuses.">     <input id="bankFullCheck" type="checkbox" tabindex="5"> Bank for full gain    </label>   </span>   <br>   <label data-title="Shows building chains and building lookaheads, if applicable.">    <input id="multiBuildRecCheck" type="checkbox" checked="checked" tabindex="5">    Show multi-building recs   </label>   <span id="quantitySpan" data-title="How many buildings at a time to build in recommendations.">    &nbsp;|&nbsp;    Building recommend #:    <label><input id="quantityOne" type="radio" name="quantity" checked="checked" tabindex="5"> 1</label>    <label><input id="quantityTen" type="radio" name="quantity" tabindex="5"> 10</label>   </span>   <br>   <label data-title="Hardcore achievement requires no upgrades.">    <input id="hardcoreCheck" type="checkbox" checked="checked" tabindex="5">    Recommend upgrades   </label>   <span id="recUpgradeOptions">    &nbsp;|&nbsp;    <label id="buildChainMaxSpan" data-title="Checks up to this many buildings ahead for the purchase of certain upgrades and their required buildings.0 to disable. -1 for unlimited.">     Max building chain:     <input id="buildChainMax" type="text" value="10" maxlength="4" placeholder="0" tabindex="5">    </label>    <span id="researchCheckSpan">     &nbsp;|&nbsp;     <label><input id="researchCheck" type="checkbox" tabindex="5"> Recommend research</label>&nbsp;     <span id="nextResearchSpan" class="clickme tooltipped hidden">Unlock <span id="nextResearch">---</span></span>    </span>   </span>  </div>  op 5 recommended purchases:  <br>  <div id="recommendedList"><span class="recPurchase clickme"><span data-title="Cursor #1&lt;div class=&quot;icon tinyIcon&quot; style=&quot;background-position:0px 0px;&quot;&gt;&lt;/div&gt; Reinforced index finger">Chain for <div class="icon tinyIcon" style="background-position:0px 0px;"></div> Reinforced index finger</span> - Price: <span>115</span>, +<span>20.2</span> CpS, <span class="earnedAchsSpan tooltipped">+2 achievements</span>, Bank: <span>115</span></span><br><span class="recPurchase clickme"><span data-title="Cursor #1&lt;div class=&quot;icon tinyIcon&quot; style=&quot;background-position:0px -48px;&quot;&gt;&lt;/div&gt; Carpal tunnel prevention cream">Chain for <div class="icon tinyIcon" style="background-position:0px -48px;"></div> Carpal tunnel prevention cream</span> - Price: <span>515</span>, +<span>20.2</span> CpS, <span class="earnedAchsSpan tooltipped">+2 achievements</span>, Bank: <span>515</span></span><br><span class="recPurchase clickme lookAheadRec"><span>Grandma #1-3</span> - Price: <span>348</span>, +<span>1</span> CpS, <span class="earnedAchsSpan tooltipped">+3 achievements</span>, Bank: <span>348</span></span><br><span class="recPurchase clickme lookAheadRec"><span>Cursor #1-2</span> - Price: <span>33</span>, +<span>0.1</span> CpS, <span class="earnedAchsSpan tooltipped">+3 achievements</span>, Bank: <span>33</span></span><br><span class="recPurchase clickme lookAheadRec"><span>Farm #1-7</span> - Price: <span>12,175</span>, +<span>8</span> CpS, <span class="earnedAchsSpan tooltipped">+5 achievements</span>, Bank: <span>12,175</span></span><br></div>  <div id="noRecsSpan" class="ital">- Nothing to recommend. -</div>  <small>(this list is recalculated every time you make a purchase)</small> </div> <br><br> <div id="infoTabs" class="tabs toggleTabs" data-tabblocks="infotabBlocks">  <a id="tabUpgrades" class="tab">Upgrades</a>  <a id="tabAchieves" class="tab">Achievements</a>  <a id="tabPresCalc" class="tab">Prestige</a>  <a id="tabBuffs" class="tab" data-title="">Buffs</a>  <a id="tabGCookies" class="tab tabCurrent">Golden Cookies</a>  <a id="tabSeason" class="tab">Seasons</a>  <a id="tabFamiliar" class="tab">Santa &amp; Dragon Auras</a>  <a id="tabMinigames" class="tab">Pantheon</a>  <a id="tabGarden" class="tab">Garden</a>  <a id="tabBlacklist" class="tab">Blacklist</a> </div> <div id="infotabBlocks">    <div id="achieves" class="tabBlock hidden">   <h2>Achievements</h2>   <div id="achOptions">    <div>     <a id="achReset" data-title="Disables all achievements that the calculator can auto-award that you do not meet the requirements for." class="hidden">      Reset achievements     </a>     <a id="achDisableAll" class="hidden">Disable all achievements</a>     <a id="achEnableAll">Enable all achievements</a>    </div>    <label data-title="Hide achievements like the game does.">     <input id="achHideCheck" type="checkbox" tabindex="5">     Hide unearned achievements    </label>&nbsp;|&nbsp;    Show:    <label><input id="achFilterUnowned" type="radio" name="achFilter" tabindex="5"> Unearned</label>    <label><input id="achFilterAll" type="radio" name="achFilter" checked="checked" tabindex="5"> All</label>&nbsp;    <a id="setAchFilter">Filter</a>   </div>   <div class="marginHead">    Unlocked: <span id="numAch">0 / 415 (0%)</span>    <span id="numAchOther" class="numShadow hidden"> (+0)</span>    <br>    Milk: <span id="achMilk">Rank I - Plain milk</span>   </div>   <div id="achIcons">    <div id="achNorm" class="menuIcons"><div class="achievement crate" style="background-position: 0px -240px;" data-achievement="Wake and bake"></div><div class="achievement crate" style="background-position: -48px -240px;" data-achievement="Making some dough"></div><div class="achievement crate" style="background-position: -96px -240px;" data-achievement="So baked right now"></div><div class="achievement crate" style="background-position: -144px -240px;" data-achievement="Fledgling bakery"></div><div class="achievement crate" style="background-position: -192px -240px;" data-achievement="Affluent bakery"></div><div class="achievement crate" style="background-position: -240px -240px;" data-achievement="World-famous bakery"></div><div class="achievement crate" style="background-position: -288px -240px;" data-achievement="Cosmic bakery"></div><div class="achievement crate" style="background-position: -336px -240px;" data-achievement="Galactic bakery"></div><div class="achievement crate" style="background-position: -384px -240px;" data-achievement="Universal bakery"></div><div class="achievement crate" style="background-position: -432px -240px;" data-achievement="Timeless bakery"></div><div class="achievement crate" style="background-position: -480px -240px;" data-achievement="Infinite bakery"></div><div class="achievement crate" style="background-position: -528px -240px;" data-achievement="Immortal bakery"></div><div class="achievement crate" style="background-position: -864px -240px;" data-achievement="Don't stop me now"></div><div class="achievement crate" style="background-position: -912px -240px;" data-achievement="You can stop now"></div><div class="achievement crate" style="background-position: -960px -240px;" data-achievement="Cookies all the way down"></div><div class="achievement crate" style="background-position: -1008px -240px;" data-achievement="Overdose"></div><div class="achievement crate" style="background-position: -1056px -240px;" data-achievement="How?"></div><div class="achievement crate" style="background-position: -1104px -240px;" data-achievement="The land of milk and cookies"></div><div class="achievement crate" style="background-position: -1152px -240px;" data-achievement="He who controls the cookies controls the universe"></div><div class="achievement crate" style="background-position: -1200px -240px;" data-achievement="Tonight on Hoarders"></div><div class="achievement crate" style="background-position: -1248px -240px;" data-achievement="Are you gonna eat all that?"></div><div class="achievement crate" style="background-position: -1296px -240px;" data-achievement="We're gonna need a bigger bakery"></div><div class="achievement crate" style="background-position: -1344px -240px;" data-achievement="In the mouth of madness"></div><div class="achievement crate" style="background-position: -1392px -240px;" data-achievement="Brought to you by the letter &lt;div style=&quot;display:inline-block;background:url(img/money.png);width:16px;height:16px;&quot;&gt;&lt;/div&gt;"></div><div class="achievement crate" style="background-position: -1008px -96px;" data-achievement="The dreams in which I'm baking are the best I've ever had"></div><div class="achievement crate" style="background-position: -1056px -96px;" data-achievement="Set for life"></div><div class="achievement crate" style="background-position: -1104px -96px;" data-achievement="Panic! at Nabisco"></div><div class="achievement crate" style="background-position: -1152px -96px;" data-achievement="Bursting at the seams"></div><div class="achievement crate" style="background-position: -1200px -96px;" data-achievement="Just about full"></div><div class="achievement crate" style="background-position: -1248px -96px;" data-achievement="Hungry for more"></div><div class="achievement crate" style="background-position: -1296px -96px;" data-achievement="Feed me, Orteil"></div><div class="achievement crate" style="background-position: -1344px -96px;" data-achievement="And then what?"></div><div class="achievement crate" style="background-position: -1392px -96px;" data-achievement="I think it's safe to say you've got it made"></div><div class="achievement crate" style="background-position: 0px -240px;" data-achievement="Casual baking"></div><div class="achievement crate" style="background-position: -48px -240px;" data-achievement="Hardcore baking"></div><div class="achievement crate" style="background-position: -96px -240px;" data-achievement="Steady tasty stream"></div><div class="achievement crate" style="background-position: -144px -240px;" data-achievement="Cookie monster"></div><div class="achievement crate" style="background-position: -192px -240px;" data-achievement="Mass producer"></div><div class="achievement crate" style="background-position: -240px -240px;" data-achievement="Cookie vortex"></div><div class="achievement crate" style="background-position: -288px -240px;" data-achievement="Cookie pulsar"></div><div class="achievement crate" style="background-position: -336px -240px;" data-achievement="Cookie quasar"></div><div class="achievement crate" style="background-position: -384px -240px;" data-achievement="Oh hey, you're still here"></div><div class="achievement crate" style="background-position: -432px -240px;" data-achievement="Let's never bake again"></div><div class="achievement crate" style="background-position: -480px -240px;" data-achievement="A world filled with cookies"></div><div class="achievement crate" style="background-position: -528px -240px;" data-achievement="When this baby hits 36 quadrillion cookies per hour"></div><div class="achievement crate" style="background-position: -864px -240px;" data-achievement="Fast and delicious"></div><div class="achievement crate" style="background-position: -912px -240px;" data-achievement="Cookiehertz : a really, really tasty hertz"></div><div class="achievement crate" style="background-position: -960px -240px;" data-achievement="Woops, you solved world hunger"></div><div class="achievement crate" style="background-position: -1008px -240px;" data-achievement="Turbopuns"></div><div class="achievement crate" style="background-position: -1056px -240px;" data-achievement="Faster menner"></div><div class="achievement crate" style="background-position: -1104px -240px;" data-achievement="And yet you're still hungry"></div><div class="achievement crate" style="background-position: -1152px -240px;" data-achievement="The Abakening"></div><div class="achievement crate" style="background-position: -1200px -240px;" data-achievement="There's really no hard limit to how long these achievement names can be and to be quite honest I'm rather curious to see how far we can go.&lt;br&gt;Adolphus W. Green (1844–1917) started as the Principal of the Groton School in 1864. By 1865, he became second assistant librarian at the New York Mercantile Library; from 1867 to 1869, he was promoted to full librarian. From 1869 to 1873, he worked for Evarts, Southmayd &amp; Choate, a law firm co-founded by William M. Evarts, Charles Ferdinand Southmayd and Joseph Hodges Choate. He was admitted to the New York State Bar Association in 1873.&lt;br&gt;Anyway, how's your day been?"></div><div class="achievement crate" style="background-position: -1248px -240px;" data-achievement="Fast"></div><div class="achievement crate" style="background-position: -1296px -240px;" data-achievement="Knead for speed"></div><div class="achievement crate" style="background-position: -1344px -240px;" data-achievement="Well the cookies start coming and they don't stop coming"></div><div class="achievement crate" style="background-position: -1392px -240px;" data-achievement="I don't know if you've noticed but all these icons are very slightly off-center"></div><div class="achievement crate" style="background-position: -1008px -96px;" data-achievement="The proof of the cookie is in the baking"></div><div class="achievement crate" style="background-position: -1056px -96px;" data-achievement="If it's worth doing, it's worth overdoing"></div><div class="achievement crate" style="background-position: -1104px -96px;" data-achievement="Running with scissors"></div><div class="achievement crate" style="background-position: -1152px -96px;" data-achievement="Rarefied air"></div><div class="achievement crate" style="background-position: -1200px -96px;" data-achievement="Push it to the limit"></div><div class="achievement crate" style="background-position: -1248px -96px;" data-achievement="Green cookies sleep furiously"></div><div class="achievement crate" style="background-position: -1296px -96px;" data-achievement="Leisurely pace"></div><div class="achievement crate" style="background-position: -1344px -96px;" data-achievement="Hypersonic"></div><div class="achievement crate" style="background-position: -1392px -96px;" data-achievement="Gotta go fast"></div><div class="achievement crate" style="background-position: -528px 0px;" data-achievement="Clicktastic"></div><div class="achievement crate" style="background-position: -528px -48px;" data-achievement="Clickathlon"></div><div class="achievement crate" style="background-position: -528px -96px;" data-achievement="Clickolympics"></div><div class="achievement crate" style="background-position: -528px -624px;" data-achievement="Clickorama"></div><div class="achievement crate" style="background-position: -528px -672px;" data-achievement="Clickasmic"></div><div class="achievement crate" style="background-position: -528px -720px;" data-achievement="Clickageddon"></div><div class="achievement crate" style="background-position: -528px -768px;" data-achievement="Clicknarok"></div><div class="achievement crate" style="background-position: -528px -816px;" data-achievement="Clickastrophe"></div><div class="achievement crate" style="background-position: -528px -864px;" data-achievement="Clickataclysm"></div><div class="achievement crate" style="background-position: -528px -912px;" data-achievement="The ultimate clickdown"></div><div class="achievement crate" style="background-position: -528px -1344px;" data-achievement="All the other kids with the pumped up clicks"></div><div class="achievement crate" style="background-position: -528px -1440px;" data-achievement="One...more...click..."></div><div class="achievement crate" style="background-position: 0px 0px;" data-achievement="Click"></div><div class="achievement crate" style="background-position: 0px -288px;" data-achievement="Double-click"></div><div class="achievement crate" style="background-position: -48px -288px;" data-achievement="Mouse wheel"></div><div class="achievement crate" style="background-position: 0px -48px;" data-achievement="Of Mice and Men"></div><div class="achievement crate" style="background-position: 0px -96px;" data-achievement="The Digital"></div><div class="achievement crate" style="background-position: 0px -624px;" data-achievement="Extreme polydactyly"></div><div class="achievement crate" style="background-position: 0px -672px;" data-achievement="Dr. T"></div><div class="achievement crate" style="background-position: 0px -720px;" data-achievement="Thumbs, phalanges, metacarpals"></div><div class="achievement crate" style="background-position: 0px -768px;" data-achievement="With her finger and her thumb"></div><div class="achievement crate" style="background-position: 0px -1056px;" data-achievement="Click delegator"></div><div class="achievement crate" style="background-position: 0px -1104px;" data-achievement="Finger clickin' good"></div><div class="achievement crate" style="background-position: 0px -1152px;" data-achievement="Click (starring Adam Sandler)"></div><div class="achievement crate" style="background-position: 0px -1248px;" data-achievement="Freaky jazz hands"></div><div class="achievement crate" style="background-position: -480px -432px;" data-achievement="Just wrong"></div><div class="achievement crate" style="background-position: -48px 0px;" data-achievement="Grandma's cookies"></div><div class="achievement crate" style="background-position: -48px -48px;" data-achievement="Sloppy kisses"></div><div class="achievement crate" style="background-position: -48px -96px;" data-achievement="Retirement home"></div><div class="achievement crate" style="background-position: -48px -624px;" data-achievement="Friend of the ancients"></div><div class="achievement crate" style="background-position: -48px -672px;" data-achievement="Ruler of the ancients"></div><div class="achievement crate" style="background-position: -48px -720px;" data-achievement="The old never bothered me anyway"></div><div class="achievement crate" style="background-position: -48px -768px;" data-achievement="The agemaster"></div><div class="achievement crate" style="background-position: -48px -816px;" data-achievement="To oldly go"></div><div class="achievement crate" style="background-position: -48px -864px;" data-achievement="Aged well"></div><div class="achievement crate" style="background-position: -48px -912px;" data-achievement="101st birthday"></div><div class="achievement crate" style="background-position: -48px -1344px;" data-achievement="Defense of the ancients"></div><div class="achievement crate" style="background-position: -48px -1440px;" data-achievement="But wait 'til you get older"></div><div class="achievement crate" style="background-position: -48px -1056px;" data-achievement="Gushing grannies"></div><div class="achievement crate" style="background-position: -48px -1104px;" data-achievement="Panic at the bingo"></div><div class="achievement crate" style="background-position: -48px -1152px;" data-achievement="Frantiquities"></div><div class="achievement crate" style="background-position: -48px -1248px;" data-achievement="Methuselah"></div><div class="achievement crate" style="background-position: -480px -432px;" data-achievement="Elder"></div><div class="achievement crate" style="background-position: -480px -432px;" data-achievement="Veteran"></div><div class="achievement crate" style="background-position: -96px 0px;" data-achievement="My first farm"></div><div class="achievement crate" style="background-position: -96px -48px;" data-achievement="Reap what you sow"></div><div class="achievement crate" style="background-position: -96px -96px;" data-achievement="Farm ill"></div><div class="achievement crate" style="background-position: -96px -624px;" data-achievement="Perfected agriculture"></div><div class="achievement crate" style="background-position: -96px -672px;" data-achievement="Homegrown"></div><div class="achievement crate" style="background-position: -96px -720px;" data-achievement="Gardener extraordinaire"></div><div class="achievement crate" style="background-position: -96px -768px;" data-achievement="Seedy business"></div><div class="achievement crate" style="background-position: -96px -816px;" data-achievement="You and the beanstalk"></div><div class="achievement crate" style="background-position: -96px -864px;" data-achievement="Harvest moon"></div><div class="achievement crate" style="background-position: -96px -912px;" data-achievement="Make like a tree"></div><div class="achievement crate" style="background-position: -96px -1344px;" data-achievement="Sharpest tool in the shed"></div><div class="achievement crate" style="background-position: -96px -1056px;" data-achievement="I hate manure"></div><div class="achievement crate" style="background-position: -96px -1104px;" data-achievement="Rake in the dough"></div><div class="achievement crate" style="background-position: -96px -1152px;" data-achievement="Overgrowth"></div><div class="achievement crate" style="background-position: -96px -1248px;" data-achievement="Huge tracts of land"></div><div class="achievement crate" style="background-position: -144px 0px;" data-achievement="You know the drill"></div><div class="achievement crate" style="background-position: -144px -48px;" data-achievement="Excavation site"></div><div class="achievement crate" style="background-position: -144px -96px;" data-achievement="Hollow the planet"></div><div class="achievement crate" style="background-position: -144px -624px;" data-achievement="Can you dig it"></div><div class="achievement crate" style="background-position: -144px -672px;" data-achievement="The center of the Earth"></div><div class="achievement crate" style="background-position: -144px -720px;" data-achievement="Tectonic ambassador"></div><div class="achievement crate" style="background-position: -144px -768px;" data-achievement="Freak fracking"></div><div class="achievement crate" style="background-position: -144px -816px;" data-achievement="Romancing the stone"></div><div class="achievement crate" style="background-position: -144px -864px;" data-achievement="Mine?"></div><div class="achievement crate" style="background-position: -144px -912px;" data-achievement="Cave story"></div><div class="achievement crate" style="background-position: -144px -1344px;" data-achievement="Hey now, you're a rock"></div><div class="achievement crate" style="background-position: -144px -1056px;" data-achievement="Never dig down"></div><div class="achievement crate" style="background-position: -144px -1104px;" data-achievement="Quarry on"></div><div class="achievement crate" style="background-position: -144px -1152px;" data-achievement="Sedimentalism"></div><div class="achievement crate" style="background-position: -144px -1248px;" data-achievement="D-d-d-d-deeper"></div><div class="achievement crate" style="background-position: -192px 0px;" data-achievement="Production chain"></div><div class="achievement crate" style="background-position: -192px -48px;" data-achievement="Industrial revolution"></div><div class="achievement crate" style="background-position: -192px -96px;" data-achievement="Global warming"></div><div class="achievement crate" style="background-position: -192px -624px;" data-achievement="Ultimate automation"></div><div class="achievement crate" style="background-position: -192px -672px;" data-achievement="Technocracy"></div><div class="achievement crate" style="background-position: -192px -720px;" data-achievement="Rise of the machines"></div><div class="achievement crate" style="background-position: -192px -768px;" data-achievement="Modern times"></div><div class="achievement crate" style="background-position: -192px -816px;" data-achievement="Ex machina"></div><div class="achievement crate" style="background-position: -192px -864px;" data-achievement="In full gear"></div><div class="achievement crate" style="background-position: -192px -912px;" data-achievement="In-cog-neato"></div><div class="achievement crate" style="background-position: -192px -1344px;" data-achievement="Break the mold"></div><div class="achievement crate" style="background-position: -192px -1056px;" data-achievement="The incredible machine"></div><div class="achievement crate" style="background-position: -192px -1104px;" data-achievement="Yes I love technology"></div><div class="achievement crate" style="background-position: -192px -1152px;" data-achievement="Labor of love"></div><div class="achievement crate" style="background-position: -192px -1248px;" data-achievement="Patently genius"></div><div class="achievement crate" style="background-position: -720px 0px;" data-achievement="Pretty penny"></div><div class="achievement crate" style="background-position: -720px -48px;" data-achievement="Fit the bill"></div><div class="achievement crate" style="background-position: -720px -96px;" data-achievement="A loan in the dark"></div><div class="achievement crate" style="background-position: -720px -624px;" data-achievement="Need for greed"></div><div class="achievement crate" style="background-position: -720px -672px;" data-achievement="It's the economy, stupid"></div><div class="achievement crate" style="background-position: -720px -720px;" data-achievement="Acquire currency"></div><div class="achievement crate" style="background-position: -720px -768px;" data-achievement="The nerve of war"></div><div class="achievement crate" style="background-position: -720px -816px;" data-achievement="And I need it now"></div><div class="achievement crate" style="background-position: -720px -864px;" data-achievement="Treacle tart economics"></div><div class="achievement crate" style="background-position: -720px -912px;" data-achievement="Save your breath because that's all you've got left"></div><div class="achievement crate" style="background-position: -720px -1344px;" data-achievement="Get the show on, get paid"></div><div class="achievement crate" style="background-position: -720px -1056px;" data-achievement="Vested interest"></div><div class="achievement crate" style="background-position: -720px -1104px;" data-achievement="Paid in full"></div><div class="achievement crate" style="background-position: -720px -1152px;" data-achievement="Reverse funnel system"></div><div class="achievement crate" style="background-position: -720px -1248px;" data-achievement="A capital idea"></div><div class="achievement crate" style="background-position: -768px 0px;" data-achievement="Your time to shrine"></div><div class="achievement crate" style="background-position: -768px -48px;" data-achievement="Shady sect"></div><div class="achievement crate" style="background-position: -768px -96px;" data-achievement="New-age cult"></div><div class="achievement crate" style="background-position: -768px -624px;" data-achievement="Organized religion"></div><div class="achievement crate" style="background-position: -768px -672px;" data-achievement="Fanaticism"></div><div class="achievement crate" style="background-position: -768px -720px;" data-achievement="Zealotry"></div><div class="achievement crate" style="background-position: -768px -768px;" data-achievement="Wololo"></div><div class="achievement crate" style="background-position: -768px -816px;" data-achievement="Pray on the weak"></div><div class="achievement crate" style="background-position: -768px -864px;" data-achievement="Holy cookies, grandma!"></div><div class="achievement crate" style="background-position: -768px -912px;" data-achievement="Vengeful and almighty"></div><div class="achievement crate" style="background-position: -768px -1344px;" data-achievement="My world's on fire, how about yours"></div><div class="achievement crate" style="background-position: -768px -1056px;" data-achievement="New world order"></div><div class="achievement crate" style="background-position: -768px -1104px;" data-achievement="Church of Cookiology"></div><div class="achievement crate" style="background-position: -768px -1152px;" data-achievement="Thus spoke you"></div><div class="achievement crate" style="background-position: -768px -1248px;" data-achievement="It belongs in a bakery"></div><div class="achievement crate" style="background-position: -816px 0px;" data-achievement="Bewitched"></div><div class="achievement crate" style="background-position: -816px -48px;" data-achievement="The sorcerer's apprentice"></div><div class="achievement crate" style="background-position: -816px -96px;" data-achievement="Charms and enchantments"></div><div class="achievement crate" style="background-position: -816px -624px;" data-achievement="Curses and maledictions"></div><div class="achievement crate" style="background-position: -816px -672px;" data-achievement="Magic kingdom"></div><div class="achievement crate" style="background-position: -816px -720px;" data-achievement="The wizarding world"></div><div class="achievement crate" style="background-position: -816px -768px;" data-achievement="And now for my next trick, I'll need a volunteer from the audience"></div><div class="achievement crate" style="background-position: -816px -816px;" data-achievement="It's a kind of magic"></div><div class="achievement crate" style="background-position: -816px -864px;" data-achievement="The Prestige"></div><div class="achievement crate" style="background-position: -816px -912px;" data-achievement="Spell it out for you"></div><div class="achievement crate" style="background-position: -816px -1344px;" data-achievement="The meteor men beg to differ"></div><div class="achievement crate" style="background-position: -816px -1056px;" data-achievement="Hocus pocus"></div><div class="achievement crate" style="background-position: -816px -1104px;" data-achievement="Too many rabbits, not enough hats"></div><div class="achievement crate" style="background-position: -816px -1152px;" data-achievement="Manafest destiny"></div><div class="achievement crate" style="background-position: -816px -1248px;" data-achievement="Motormouth"></div><div class="achievement crate" style="background-position: -240px 0px;" data-achievement="Expedition"></div><div class="achievement crate" style="background-position: -240px -48px;" data-achievement="Galactic highway"></div><div class="achievement crate" style="background-position: -240px -96px;" data-achievement="Far far away"></div><div class="achievement crate" style="background-position: -240px -624px;" data-achievement="Type II civilization"></div><div class="achievement crate" style="background-position: -240px -672px;" data-achievement="We come in peace"></div><div class="achievement crate" style="background-position: -240px -720px;" data-achievement="Parsec-masher"></div><div class="achievement crate" style="background-position: -240px -768px;" data-achievement="It's not delivery"></div><div class="achievement crate" style="background-position: -240px -816px;" data-achievement="Make it so"></div><div class="achievement crate" style="background-position: -240px -864px;" data-achievement="That's just peanuts to space"></div><div class="achievement crate" style="background-position: -240px -912px;" data-achievement="Space space space space space"></div><div class="achievement crate" style="background-position: -240px -1344px;" data-achievement="Only shooting stars"></div><div class="achievement crate" style="background-position: -240px -1056px;" data-achievement="And beyond"></div><div class="achievement crate" style="background-position: -240px -1104px;" data-achievement="The most precious cargo"></div><div class="achievement crate" style="background-position: -240px -1152px;" data-achievement="Neither snow nor rain nor heat nor gloom of night"></div><div class="achievement crate" style="background-position: -240px -1248px;" data-achievement="Been there done that"></div><div class="achievement crate" style="background-position: -288px 0px;" data-achievement="Transmutation"></div><div class="achievement crate" style="background-position: -288px -48px;" data-achievement="Transmogrification"></div><div class="achievement crate" style="background-position: -288px -96px;" data-achievement="Gold member"></div><div class="achievement crate" style="background-position: -288px -624px;" data-achievement="Gild wars"></div><div class="achievement crate" style="background-position: -288px -672px;" data-achievement="The secrets of the universe"></div><div class="achievement crate" style="background-position: -288px -720px;" data-achievement="The work of a lifetime"></div><div class="achievement crate" style="background-position: -288px -768px;" data-achievement="Gold, Jerry! Gold!"></div><div class="achievement crate" style="background-position: -288px -816px;" data-achievement="All that glitters is gold"></div><div class="achievement crate" style="background-position: -288px -864px;" data-achievement="Worth its weight in lead"></div><div class="achievement crate" style="background-position: -288px -912px;" data-achievement="Don't get used to yourself, you're gonna have to change"></div><div class="achievement crate" style="background-position: -288px -1344px;" data-achievement="We could all use a little change"></div><div class="achievement crate" style="background-position: -288px -1056px;" data-achievement="Magnum Opus"></div><div class="achievement crate" style="background-position: -288px -1104px;" data-achievement="The Aureate"></div><div class="achievement crate" style="background-position: -288px -1152px;" data-achievement="I've got the Midas touch"></div><div class="achievement crate" style="background-position: -288px -1248px;" data-achievement="Phlogisticated substances"></div><div class="achievement crate" style="background-position: -336px 0px;" data-achievement="A whole new world"></div><div class="achievement crate" style="background-position: -336px -48px;" data-achievement="Now you're thinking"></div><div class="achievement crate" style="background-position: -336px -96px;" data-achievement="Dimensional shift"></div><div class="achievement crate" style="background-position: -336px -624px;" data-achievement="Brain-split"></div><div class="achievement crate" style="background-position: -336px -672px;" data-achievement="Realm of the Mad God"></div><div class="achievement crate" style="background-position: -336px -720px;" data-achievement="A place lost in time"></div><div class="achievement crate" style="background-position: -336px -768px;" data-achievement="Forbidden zone"></div><div class="achievement crate" style="background-position: -336px -816px;" data-achievement="H̸̷͓̳̳̯̟͕̟͍͍̣͡ḛ̢̦̰̺̮̝͖͖̘̪͉͘͡ ̠̦͕̤̪̝̥̰̠̫̖̣͙̬͘ͅC̨̦̺̩̲̥͉̭͚̜̻̝̣̼͙̮̯̪o̴̡͇̘͎̞̲͇̦̲͞͡m̸̩̺̝̣̹̱͚̬̥̫̳̼̞̘̯͘ͅẹ͇̺̜́̕͢s̶̙̟̱̥̮̯̰̦͓͇͖͖̝͘͘͞"></div><div class="achievement crate" style="background-position: -336px -864px;" data-achievement="What happens in the vortex stays in the vortex"></div><div class="achievement crate" style="background-position: -336px -912px;" data-achievement="Objects in the mirror dimension are closer than they appear"></div><div class="achievement crate" style="background-position: -336px -1344px;" data-achievement="Your brain gets smart but your head gets dumb"></div><div class="achievement crate" style="background-position: -336px -1056px;" data-achievement="With strange eons"></div><div class="achievement crate" style="background-position: -336px -1104px;" data-achievement="Ever more hideous"></div><div class="achievement crate" style="background-position: -336px -1152px;" data-achievement="Which eternal lie"></div><div class="achievement crate" style="background-position: -336px -1248px;" data-achievement="Bizarro world"></div><div class="achievement crate" style="background-position: -384px 0px;" data-achievement="Time warp"></div><div class="achievement crate" style="background-position: -384px -48px;" data-achievement="Alternate timeline"></div><div class="achievement crate" style="background-position: -384px -96px;" data-achievement="Rewriting history"></div><div class="achievement crate" style="background-position: -384px -624px;" data-achievement="Time duke"></div><div class="achievement crate" style="background-position: -384px -672px;" data-achievement="Forever and ever"></div><div class="achievement crate" style="background-position: -384px -720px;" data-achievement="Heat death"></div><div class="achievement crate" style="background-position: -384px -768px;" data-achievement="cookie clicker forever and forever a hundred years cookie clicker, all day long forever, forever a hundred times, over and over cookie clicker adventures dot com"></div><div class="achievement crate" style="background-position: -384px -816px;" data-achievement="Way back then"></div><div class="achievement crate" style="background-position: -384px -864px;" data-achievement="Invited to yesterday's party"></div><div class="achievement crate" style="background-position: -384px -912px;" data-achievement="Groundhog day"></div><div class="achievement crate" style="background-position: -384px -1344px;" data-achievement="The years start coming"></div><div class="achievement crate" style="background-position: -384px -1056px;" data-achievement="Spacetime jigamaroo"></div><div class="achievement crate" style="background-position: -384px -1104px;" data-achievement="Be kind, rewind"></div><div class="achievement crate" style="background-position: -384px -1152px;" data-achievement="D&amp;eacute;j&amp;agrave; vu"></div><div class="achievement crate" style="background-position: -384px -1248px;" data-achievement="The long now"></div><div class="achievement crate" style="background-position: -624px 0px;" data-achievement="Antibatter"></div><div class="achievement crate" style="background-position: -624px -48px;" data-achievement="Quirky quarks"></div><div class="achievement crate" style="background-position: -624px -96px;" data-achievement="It does matter!"></div><div class="achievement crate" style="background-position: -624px -624px;" data-achievement="Molecular maestro"></div><div class="achievement crate" style="background-position: -624px -672px;" data-achievement="Walk the planck"></div><div class="achievement crate" style="background-position: -624px -720px;" data-achievement="Microcosm"></div><div class="achievement crate" style="background-position: -624px -768px;" data-achievement="Scientists baffled everywhere"></div><div class="achievement crate" style="background-position: -624px -816px;" data-achievement="Exotic matter"></div><div class="achievement crate" style="background-position: -624px -864px;" data-achievement="Downsizing"></div><div class="achievement crate" style="background-position: -624px -912px;" data-achievement="A matter of perspective"></div><div class="achievement crate" style="background-position: -624px -1344px;" data-achievement="What a concept"></div><div class="achievement crate" style="background-position: -624px -1056px;" data-achievement="Supermassive"></div><div class="achievement crate" style="background-position: -624px -1104px;" data-achievement="Infinitesimal"></div><div class="achievement crate" style="background-position: -624px -1152px;" data-achievement="Powers of Ten"></div><div class="achievement crate" style="background-position: -624px -1248px;" data-achievement="Chubby hadrons"></div><div class="achievement crate" style="background-position: -672px 0px;" data-achievement="Lone photon"></div><div class="achievement crate" style="background-position: -672px -48px;" data-achievement="Dazzling glimmer"></div><div class="achievement crate" style="background-position: -672px -96px;" data-achievement="Blinding flash"></div><div class="achievement crate" style="background-position: -672px -624px;" data-achievement="Unending glow"></div><div class="achievement crate" style="background-position: -672px -672px;" data-achievement="Rise and shine"></div><div class="achievement crate" style="background-position: -672px -720px;" data-achievement="Bright future"></div><div class="achievement crate" style="background-position: -672px -768px;" data-achievement="Harmony of the spheres"></div><div class="achievement crate" style="background-position: -672px -816px;" data-achievement="At the end of the tunnel"></div><div class="achievement crate" style="background-position: -672px -864px;" data-achievement="My eyes"></div><div class="achievement crate" style="background-position: -672px -912px;" data-achievement="Optical illusion"></div><div class="achievement crate" style="background-position: -672px -1344px;" data-achievement="You'll never shine if you don't glow"></div><div class="achievement crate" style="background-position: -672px -1056px;" data-achievement="Praise the sun"></div><div class="achievement crate" style="background-position: -672px -1104px;" data-achievement="A still more glorious dawn"></div><div class="achievement crate" style="background-position: -672px -1152px;" data-achievement="Now the dark days are gone"></div><div class="achievement crate" style="background-position: -672px -1248px;" data-achievement="Palettable"></div><div class="achievement crate" style="background-position: -912px 0px;" data-achievement="Lucked out"></div><div class="achievement crate" style="background-position: -912px -48px;" data-achievement="What are the odds"></div><div class="achievement crate" style="background-position: -912px -96px;" data-achievement="Grandma needs a new pair of shoes"></div><div class="achievement crate" style="background-position: -912px -624px;" data-achievement="Million to one shot, doc"></div><div class="achievement crate" style="background-position: -912px -672px;" data-achievement="As luck would have it"></div><div class="achievement crate" style="background-position: -912px -720px;" data-achievement="Ever in your favor"></div><div class="achievement crate" style="background-position: -912px -768px;" data-achievement="Be a lady"></div><div class="achievement crate" style="background-position: -912px -816px;" data-achievement="Dicey business"></div><div class="achievement crate" style="background-position: -912px -864px;" data-achievement="Maybe a chance in hell, actually"></div><div class="achievement crate" style="background-position: -912px -912px;" data-achievement="Jackpot"></div><div class="achievement crate" style="background-position: -912px -1344px;" data-achievement="You'll never know if you don't go"></div><div class="achievement crate" style="background-position: -912px -1056px;" data-achievement="Fingers crossed"></div><div class="achievement crate" style="background-position: -912px -1104px;" data-achievement="Just a statistic"></div><div class="achievement crate" style="background-position: -912px -1152px;" data-achievement="Murphy's wild guess"></div><div class="achievement crate" style="background-position: -912px -1248px;" data-achievement="Let's leaf it at that"></div><div class="achievement crate" style="background-position: -960px 0px;" data-achievement="Self-contained"></div><div class="achievement crate" style="background-position: -960px -48px;" data-achievement="Threw you for a loop"></div><div class="achievement crate" style="background-position: -960px -96px;" data-achievement="The sum of its parts"></div><div class="achievement crate" style="background-position: -960px -624px;" data-achievement="Bears repeating"></div><div class="achievement crate" style="background-position: -960px -672px;" data-achievement="More of the same"></div><div class="achievement crate" style="background-position: -960px -720px;" data-achievement="Last recurse"></div><div class="achievement crate" style="background-position: -960px -768px;" data-achievement="Out of one, many"></div><div class="achievement crate" style="background-position: -960px -816px;" data-achievement="An example of recursion"></div><div class="achievement crate" style="background-position: -960px -864px;" data-achievement="For more information on this achievement, please refer to its title"></div><div class="achievement crate" style="background-position: -960px -912px;" data-achievement="I'm so meta, even this achievement"></div><div class="achievement crate" style="background-position: -960px -1344px;" data-achievement="Never get bored"></div><div class="achievement crate" style="background-position: -960px -1056px;" data-achievement="The needs of the many"></div><div class="achievement crate" style="background-position: -960px -1104px;" data-achievement="Eating its own"></div><div class="achievement crate" style="background-position: -960px -1152px;" data-achievement="We must go deeper"></div><div class="achievement crate" style="background-position: -960px -1248px;" data-achievement="Sierpinski rhomboids"></div><div class="achievement crate" style="background-position: -96px -288px;" data-achievement="Builder"></div><div class="achievement crate" style="background-position: -144px -288px;" data-achievement="Architect"></div><div class="achievement crate" style="background-position: -192px -288px;" data-achievement="Engineer"></div><div class="achievement crate" style="background-position: -240px -288px;" data-achievement="Lord of Constructs"></div><div class="achievement crate" style="background-position: -432px 0px;" data-achievement="Enhancer"></div><div class="achievement crate" style="background-position: -432px -48px;" data-achievement="Augmenter"></div><div class="achievement crate" style="background-position: -432px -96px;" data-achievement="Upgrader"></div><div class="achievement crate" style="background-position: -432px -672px;" data-achievement="Lord of Progress"></div><div class="achievement crate" style="background-position: -1392px -336px;" data-achievement="Polymath"></div><div class="achievement crate" style="background-position: -480px -480px;" data-achievement="Renaissance baker"></div><div class="achievement crate" style="background-position: -480px -432px;" data-achievement="The elder scrolls"></div><div class="achievement crate" style="background-position: -96px -336px;" data-achievement="One with everything"></div><div class="achievement crate" style="background-position: -1104px -576px;" data-achievement="Mathematician"></div><div class="achievement crate" style="background-position: -1104px -576px;" data-achievement="Base 10"></div><div class="achievement crate" style="background-position: -288px -288px;" data-achievement="Centennial"></div><div class="achievement crate" style="background-position: -336px -288px;" data-achievement="Centennial and a half"></div><div class="achievement crate" style="background-position: -384px -288px;" data-achievement="Bicentennial"></div><div class="achievement crate" style="background-position: -432px -288px;" data-achievement="Bicentennial and a half"></div><div class="achievement crate" style="background-position: -1392px -576px;" data-achievement="Tricentennial"></div><div class="achievement crate" style="background-position: -1008px -1248px;" data-achievement="Tricentennial and a half"></div><div class="achievement crate" style="background-position: -1056px -1248px;" data-achievement="Quadricentennial"></div><div class="achievement crate" style="background-position: -1104px -1248px;" data-achievement="Quadricentennial and a half"></div><div class="achievement crate" style="background-position: -1392px -1200px;" data-achievement="Quincentennial"></div><div class="achievement crate" style="background-position: -480px -672px;" data-achievement="Golden cookie"></div><div class="achievement crate" style="background-position: -1056px -288px;" data-achievement="Lucky cookie"></div><div class="achievement crate" style="background-position: -1104px -288px;" data-achievement="A stroke of luck"></div><div class="achievement crate" style="background-position: -1152px -288px;" data-achievement="Fortune"></div><div class="achievement crate" style="background-position: -1200px -288px;" data-achievement="Leprechaun"></div><div class="achievement crate" style="background-position: -1248px -288px;" data-achievement="Black cat's paw"></div><div class="achievement crate" style="background-position: -480px -672px;" data-achievement="Early bird"></div><div class="achievement crate" style="background-position: -480px -672px;" data-achievement="Fading luck"></div><div class="achievement crate" style="background-position: -336px -480px;" data-achievement="Thick-skinned"></div><div class="achievement crate" style="background-position: -48px -384px;" data-achievement="Cookie-dunker"></div><div class="achievement crate" style="background-position: 0px -240px;" data-achievement="Tiny cookie"></div><div class="achievement crate" style="background-position: -720px -432px;" data-achievement="What's in a name"></div><div class="achievement crate" style="background-position: -48px -336px;" data-achievement="Here you go"></div><div class="achievement crate" style="background-position: -1296px -336px;" data-achievement="Tabloid addiction"></div><div class="achievement crate" style="background-position: -576px 0px;" data-achievement="Neverclick"></div><div class="achievement crate" style="background-position: -576px 0px;" data-achievement="Uncanny clicker"></div><div class="achievement crate" style="background-position: -384px -432px;" data-achievement="Elder nap"></div><div class="achievement crate" style="background-position: -384px -432px;" data-achievement="Elder slumber"></div><div class="achievement crate" style="background-position: -384px -432px;" data-achievement="Elder calm"></div><div class="achievement crate" style="background-position: -912px -384px;" data-achievement="Itchscratcher"></div><div class="achievement crate" style="background-position: -912px -384px;" data-achievement="Wrinklesquisher"></div><div class="achievement crate" style="background-position: -912px -384px;" data-achievement="Moistburster"></div><div class="achievement crate" style="background-position: -1152px -672px;" data-achievement="Dude, sweet"></div><div class="achievement crate" style="background-position: -1248px -672px;" data-achievement="Sugar rush"></div><div class="achievement crate" style="background-position: -1392px -672px;" data-achievement="Year's worth of cavities"></div><div class="achievement crate" style="background-position: -1344px -672px;" data-achievement="Hand-picked"></div><div class="achievement crate" style="background-position: -1392px -720px;" data-achievement="Sugar sugar"></div><div class="achievement crate" style="background-position: -1392px -816px;" data-achievement="Sweetmeats"></div><div class="achievement crate" style="background-position: -1392px -1296px;" data-achievement="Maillard reaction"></div><div class="achievement crate" style="background-position: -576px -384px;" data-achievement="Spooky cookies"></div><div class="achievement crate" style="background-position: -864px -432px;" data-achievement="Coming to town"></div><div class="achievement crate" style="background-position: -912px -480px;" data-achievement="All hail Santa"></div><div class="achievement crate" style="background-position: -912px -432px;" data-achievement="Let it snow"></div><div class="achievement crate" style="background-position: -576px -432px;" data-achievement="Oh deer"></div><div class="achievement crate" style="background-position: -576px -432px;" data-achievement="Sleigh of hand"></div><div class="achievement crate" style="background-position: -576px -432px;" data-achievement="Reindeer sleigher"></div><div class="achievement crate" style="background-position: -576px -432px;" data-achievement="Eldeer"></div><div class="achievement crate" style="background-position: -960px -144px;" data-achievement="Lovely cookies"></div><div class="achievement crate" style="background-position: -48px -576px;" data-achievement="The hunt is on"></div><div class="achievement crate" style="background-position: -192px -576px;" data-achievement="Egging on"></div><div class="achievement crate" style="background-position: -336px -576px;" data-achievement="Mass Easteria"></div><div class="achievement crate" style="background-position: -624px -576px;" data-achievement="Hide &amp; seek champion"></div><div class="achievement crate" style="background-position: -1008px -576px;" data-achievement="Here be dragon"></div><div class="achievement crate" style="background-position: -1008px -288px;" data-achievement="Rebirth"></div><div class="achievement crate" style="background-position: -1008px -288px;" data-achievement="Resurrection"></div><div class="achievement crate" style="background-position: -1008px -288px;" data-achievement="Reincarnation"></div><div class="achievement crate" style="background-position: -528px -288px;" data-achievement="Sacrifice"></div><div class="achievement crate" style="background-position: -528px -288px;" data-achievement="Oblivion"></div><div class="achievement crate" style="background-position: -528px -288px;" data-achievement="From scratch"></div><div class="achievement crate" style="background-position: -528px -336px;" data-achievement="Nihilism"></div><div class="achievement crate" style="background-position: -528px -336px;" data-achievement="Dematerialize"></div><div class="achievement crate" style="background-position: -528px -336px;" data-achievement="Nil zero zilch"></div><div class="achievement crate" style="background-position: -528px -384px;" data-achievement="Transcendence"></div><div class="achievement crate" style="background-position: -528px -384px;" data-achievement="Obliterate"></div><div class="achievement crate" style="background-position: -528px -384px;" data-achievement="Negative void"></div><div class="achievement crate" style="background-position: -1392px -288px;" data-achievement="To crumbs, you say?"></div><div class="achievement crate" style="background-position: -1392px -288px;" data-achievement="You get nothing"></div><div class="achievement crate" style="background-position: -1392px -288px;" data-achievement="Humble rebeginnings"></div><div class="achievement crate" style="background-position: -1008px -1200px;" data-achievement="The end of the world"></div><div class="achievement crate" style="background-position: -1008px -1200px;" data-achievement="Oh, you're back"></div><div class="achievement crate" style="background-position: -1008px -1200px;" data-achievement="Lazarus"></div><div class="achievement crate" style="background-position: -576px -288px;" data-achievement="Hardcore"></div><div class="achievement crate" style="background-position: -720px -336px;" data-achievement="Wholesome"></div><div class="achievement crate" style="background-position: -1008px -528px;" data-achievement="Bibbidi-bobbidi-boo"></div><div class="achievement crate" style="background-position: -1056px -528px;" data-achievement="I'm the wiz"></div><div class="achievement crate" style="background-position: -1392px -528px;" data-achievement="A wizard is you"></div><div class="achievement crate" style="background-position: -1248px -960px;" data-achievement="Botany enthusiast"></div><div class="achievement crate" style="background-position: -1296px -960px;" data-achievement="Green, aching thumb"></div><div class="achievement crate" style="background-position: -1344px -960px;" data-achievement="In the garden of Eden (baby)"></div><div class="achievement crate" style="background-position: -1200px -960px;" data-achievement="Keeper of the conservatory"></div><div class="achievement crate" style="background-position: -1392px -960px;" data-achievement="Seedless to nay"></div><div class="achievement crate" style="background-position: -480px 0px;" data-achievement="You win a cookie"></div></div>    <div id="achShadowBlock" class="achBlock">     <h4 id="achShadowHead">Shadow Achievements</h4>     <div id="achShadow" class="menuIcons"><div class="achievement crate shadow" style="background-position: -1296px -288px;" data-achievement="Four-leaf cookie"></div><div class="achievement crate shadow" style="background-position: -1392px -768px;" data-achievement="All-natural cane sugar"></div><div class="achievement crate shadow" style="background-position: -96px -336px;" data-achievement="Endless cycle"></div><div class="achievement crate shadow" style="background-position: -480px -288px;" data-achievement="Cheated cookies taste awful"></div><div class="achievement crate shadow" style="background-position: -816px -240px;" data-achievement="God complex"></div><div class="achievement crate shadow" style="background-position: -768px -240px;" data-achievement="Third-party"></div><div class="achievement crate shadow" style="background-position: -1200px -336px;" data-achievement="When the cookies ascend just right"></div><div class="achievement crate shadow" style="background-position: -576px -240px;" data-achievement="Speed baking I"></div><div class="achievement crate shadow" style="background-position: -624px -240px;" data-achievement="Speed baking II"></div><div class="achievement crate shadow" style="background-position: -672px -240px;" data-achievement="Speed baking III"></div><div class="achievement crate shadow" style="background-position: -576px 0px;" data-achievement="True Neverclick"></div><div class="achievement crate shadow" style="background-position: -720px -288px;" data-achievement="Just plain lucky"></div><div class="achievement crate shadow" style="background-position: -1152px -576px;" data-achievement="Last Chance to See"></div><div class="achievement crate shadow" style="background-position: -1104px -528px;" data-achievement="So much to do so much to see"></div></div>    </div>    <div id="achDungeonBlock" class="achBlock">     <h4 id="achDungeonHead">Dungeon Achievements</h4>     <div id="achDungeon" class="menuIcons"><div class="achievement crate" style="background-position: -576px -336px;" data-achievement="Getting even with the oven"></div><div class="achievement crate" style="background-position: -576px -336px;" data-achievement="Now this is pod-smashing"></div><div class="achievement crate" style="background-position: -624px -336px;" data-achievement="Chirped out"></div><div class="achievement crate" style="background-position: -672px -336px;" data-achievement="Follow the white rabbit"></div></div>    </div>   </div>  </div>  <div id="presCalc" class="tabBlock hidden">   <h2>Prestige</h2>   <table><tbody>    <tr>     <td><label>Cookies baked this ascension</label></td>     <td>      <input id="cookiesBaked" type="text" class="exp" spellcheck="false" placeholder="0" data-title="0" tabindex="5" value="0">      <span id="setCookiesBakedSpan" class="clickme hidden">Guesstimate: <span id="setCookiesBakedNum"><span>0</span></span></span>     </td>    </tr>    <tr>     <td><label>Cookies forfeited by resetting</label></td>     <td>      <input id="cookiesReset" type="text" class="exp" spellcheck="false" placeholder="0" data-title="0" tabindex="5" value="0">      <span id="setPrestigeSpan" class="clickme small hidden">(Prestige from cookies: <span id="setPrestigeNum"><span>0</span></span>)</span>      <span id="setCookiesResetSpan" class="clickme small hidden">(Cookies from prestige: <span id="setCookiesResetNum"><span>0</span></span>)</span>     </td>    </tr>   </tbody></table>   <br>   <label>    Prestige level:    <input id="prestigeCurrentIn" type="text" class="heaven" placeholder="0" tabindex="5" value="0">   </label>&nbsp;   <label>    Prestige desired:    <input id="prestigeDesiredIn" type="text" class="heaven" placeholder="0" tabindex="5" value="0">   </label>   <br>   <table id="prestigeTable"><tbody>    <tr>     <td>Prestige levels after reset</td>     <td id="prestigeGain"><span>0</span> (+<span>0</span>)</td>     <td>      <span id="prestigeGainCps">--- CpS</span>      <span id="prestigeGainCpsHelp" class="help hidden" data-title="Assumes all heavenly upgrades">*</span>     </td>    </tr>    <tr id="prestigeDesiredGainRow" class="hidden">     <td>Prestige desired</td>     <td id="prestigeDesiredGain"><span>0</span> (+<span>0</span>)</td>     <td>      <span id="prestigeDesiredCps">--- CpS</span>      <span id="prestigeDesiredCpsHelp" class="help hidden" data-title="Assumes all heavenly upgrades">*</span>     </td>    </tr>    <tr>     <td>Cookies for next prestige level</td>     <td id="cookiesNextPrestige"><span data-title="1,000,000,000,000">1 T</span></td>     <td id="cookiesNextPrestigeTime">13.889 M h 53m 20s</td>    </tr>    <tr id="cookiesPrestigeNeedRow" class="hidden">     <td>Cookies for desired</td>     <td id="cookiesPrestigeNeed"><span>0</span></td>     <td id="cookiesPrestigeNeedTime">---</td>    </tr>   </tbody></table>   <br>   <br><label class="lockCheckSpan" data-title="Ctrl-, alt-, and/or shift-click to do the opposite."><input class="lockChecker" type="checkbox" tabindex="5"> Toggle locks on click</label>   <br><br>   <div id="prestigeIcons" class="menuIcons" data-upgrade-group="allHeaven"><div class="upgrade crate extraCrate" style="background-position: -912px -336px;" data-upgrade="Heavenly chip secret" data-id="129"></div><div class="upgrade crate extraCrate" style="background-position: -864px -336px;" data-upgrade="Heavenly cookie stand" data-id="130"></div><div class="upgrade crate extraCrate" style="background-position: -816px -336px;" data-upgrade="Heavenly bakery" data-id="131"></div><div class="upgrade crate extraCrate" style="background-position: -768px -336px;" data-upgrade="Heavenly confectionery" data-id="132"></div><div class="upgrade crate extraCrate" style="background-position: -720px -336px;" data-upgrade="Heavenly key" data-id="133"></div><div class="upgrade crate prestige extraCrate" style="background-position: -432px -96px;" data-upgrade="Persistent memory" data-id="141"></div><div class="upgrade crate prestige extraCrate" style="background-position: -768px -288px;" data-upgrade="Season switcher" data-id="181"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -384px;" data-upgrade="Tin of british tea biscuits" data-id="253"></div><div class="upgrade crate prestige extraCrate" style="background-position: -960px -384px;" data-upgrade="Box of macarons" data-id="254"></div><div class="upgrade crate prestige extraCrate" style="background-position: -960px -432px;" data-upgrade="Box of brand biscuits" data-id="255"></div><div class="upgrade crate prestige extraCrate" style="background-position: 0px -480px;" data-upgrade="Permanent upgrade slot I" data-id="264"></div><div class="upgrade crate prestige extraCrate" style="background-position: -48px -480px;" data-upgrade="Permanent upgrade slot II" data-id="265"></div><div class="upgrade crate prestige extraCrate" style="background-position: -96px -480px;" data-upgrade="Permanent upgrade slot III" data-id="266"></div><div class="upgrade crate prestige extraCrate" style="background-position: -144px -480px;" data-upgrade="Permanent upgrade slot IV" data-id="267"></div><div class="upgrade crate prestige extraCrate" style="background-position: -192px -480px;" data-upgrade="Permanent upgrade slot V" data-id="268"></div><div class="upgrade crate prestige extraCrate" style="background-position: 0px -576px;" data-upgrade="Starspawn" data-id="269"></div><div class="upgrade crate prestige extraCrate" style="background-position: -576px -432px;" data-upgrade="Starsnow" data-id="270"></div><div class="upgrade crate prestige extraCrate" style="background-position: -624px -384px;" data-upgrade="Starterror" data-id="271"></div><div class="upgrade crate prestige extraCrate" style="background-position: -960px -144px;" data-upgrade="Starlove" data-id="272"></div><div class="upgrade crate prestige extraCrate" style="background-position: -816px -288px;" data-upgrade="Startrade" data-id="273"></div><div class="upgrade crate prestige extraCrate" style="background-position: 0px -528px;" data-upgrade="Angels" data-id="274"></div><div class="upgrade crate prestige extraCrate" style="background-position: -48px -528px;" data-upgrade="Archangels" data-id="275"></div><div class="upgrade crate prestige extraCrate" style="background-position: -96px -528px;" data-upgrade="Virtues" data-id="276"></div><div class="upgrade crate prestige extraCrate" style="background-position: -144px -528px;" data-upgrade="Dominions" data-id="277"></div><div class="upgrade crate prestige extraCrate" style="background-position: -192px -528px;" data-upgrade="Cherubim" data-id="278"></div><div class="upgrade crate prestige extraCrate" style="background-position: -240px -528px;" data-upgrade="Seraphim" data-id="279"></div><div class="upgrade crate prestige extraCrate" style="background-position: -288px -528px;" data-upgrade="God" data-id="280"></div><div class="upgrade crate prestige extraCrate" style="background-position: -720px -528px;" data-upgrade="Twin Gates of Transcendence" data-id="281"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1056px -288px;" data-upgrade="Heavenly luck" data-id="282"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1104px -288px;" data-upgrade="Lasting fortune" data-id="283"></div><div class="upgrade crate prestige extraCrate" style="background-position: -480px -672px;" data-upgrade="Decisive fate" data-id="284"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -336px;" data-upgrade="Divine discount" data-id="285"></div><div class="upgrade crate prestige extraCrate" style="background-position: -864px -336px;" data-upgrade="Divine sales" data-id="286"></div><div class="upgrade crate prestige extraCrate" style="background-position: -816px -336px;" data-upgrade="Divine bakeries" data-id="287"></div><div class="upgrade crate prestige extraCrate" style="background-position: 0px -672px;" data-upgrade="Starter kit" data-id="288"></div><div class="upgrade crate prestige extraCrate" style="background-position: -48px -672px;" data-upgrade="Starter kitchen" data-id="289"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1056px -336px;" data-upgrade="Halo gloves" data-id="290"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1104px -336px;" data-upgrade="Kitten angels" data-id="291"></div><div class="upgrade crate prestige extraCrate" style="background-position: -720px -576px;" data-upgrade="Unholy bait" data-id="292"></div><div class="upgrade crate prestige extraCrate" style="background-position: -912px -384px;" data-upgrade="Sacrilegious corruption" data-id="293"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1056px -576px;" data-upgrade="How to bake your dragon" data-id="323"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -336px;" data-upgrade="Chimera" data-id="325"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -432px;" data-upgrade="Tin of butter cookies" data-id="326"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -480px;" data-upgrade="Golden switch" data-id="327"></div><div class="upgrade crate prestige extraCrate" style="background-position: -48px -384px;" data-upgrade="Classic dairy selection" data-id="328"></div><div class="upgrade crate prestige extraCrate" style="background-position: -432px -336px;" data-upgrade="Fanciful dairy selection" data-id="329"></div><div class="upgrade crate prestige extraCrate" style="background-position: -336px -528px;" data-upgrade="Belphegor" data-id="353"></div><div class="upgrade crate prestige extraCrate" style="background-position: -384px -528px;" data-upgrade="Mammon" data-id="354"></div><div class="upgrade crate prestige extraCrate" style="background-position: -432px -528px;" data-upgrade="Abaddon" data-id="355"></div><div class="upgrade crate prestige extraCrate" style="background-position: -480px -528px;" data-upgrade="Satan" data-id="356"></div><div class="upgrade crate prestige extraCrate" style="background-position: -528px -528px;" data-upgrade="Asmodeus" data-id="357"></div><div class="upgrade crate prestige extraCrate" style="background-position: -576px -528px;" data-upgrade="Beelzebub" data-id="358"></div><div class="upgrade crate prestige extraCrate" style="background-position: -624px -528px;" data-upgrade="Lucifer" data-id="359"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1344px -288px;" data-upgrade="Golden cookie alert sound" data-id="360"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1392px -240px;" data-upgrade="Basic wallpaper assortment" data-id="362"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -288px;" data-upgrade="Legacy" data-id="363"></div><div class="upgrade crate prestige extraCrate" style="background-position: -912px -384px;" data-upgrade="Elder spice" data-id="364"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -288px;" data-upgrade="Residual luck" data-id="365"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1344px -336px;" data-upgrade="Five-finger discount" data-id="368"></div><div class="upgrade crate prestige extraCrate" style="background-position: -480px -960px;" data-upgrade="Synergies Vol. I" data-id="393"></div><div class="upgrade crate prestige extraCrate" style="background-position: -480px -1392px;" data-upgrade="Synergies Vol. II" data-id="394"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1200px -576px;" data-upgrade="Heavenly cookies" data-id="395"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1248px -576px;" data-upgrade="Wrinkly cookies" data-id="396"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -576px;" data-upgrade="Distilled essence of redoubled luck" data-id="397"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1200px -720px;" data-upgrade="Stevia Caelestis" data-id="408"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1248px -720px;" data-upgrade="Diabetica Daemonicus" data-id="409"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -720px;" data-upgrade="Sucralosia Inutilis" data-id="410"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -720px;" data-upgrade="Lucky digit" data-id="411"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -720px;" data-upgrade="Lucky number" data-id="412"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -720px;" data-upgrade="Lucky payout" data-id="413"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -816px;" data-upgrade="Sugar baking" data-id="449"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1056px -816px;" data-upgrade="Sugar craving" data-id="450"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1104px -816px;" data-upgrade="Sugar aging process" data-id="451"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -1248px;" data-upgrade="Eye of the wrinkler" data-id="495"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1344px -1248px;" data-upgrade="Inspired checklist" data-id="496"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1344px -1392px;" data-upgrade="Label printer" data-id="505"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -1392px;" data-upgrade="Heralds" data-id="520"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1056px -1392px;" data-upgrade="Keepsakes" data-id="537"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1008px -1440px;" data-upgrade="Sugar crystal cookies" data-id="539"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1200px -1392px;" data-upgrade="Box of maybe cookies" data-id="540"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1248px -1392px;" data-upgrade="Box of not cookies" data-id="541"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -1392px;" data-upgrade="Box of pastries" data-id="542"></div><div class="upgrade crate prestige extraCrate" style="background-position: -528px -480px;" data-upgrade="Genius accounting" data-id="561"></div><div class="upgrade crate prestige extraCrate" style="background-position: -432px -480px;" data-upgrade="Shimmering veil" data-id="562"></div><div class="upgrade crate prestige extraCrate" style="background-position: -384px -480px;" data-upgrade="Cosmic beginner's luck" data-id="591"></div><div class="upgrade crate prestige extraCrate" style="background-position: -336px -480px;" data-upgrade="Reinforced membrane" data-id="592"></div></div>  </div>  <div id="buffsBlock" class="tabBlock hidden">   <h2>Buffs</h2>   <div id="buffsCurrentBlock">    <div>     <span class="bold">Active buffs</span>     <div id="buffsCurrent" class="menuIcons hideNextWithContent"></div>     <div id="buffsCurrentEmpty" class="ital">No active buffs</div>    </div>    <a id="buffsClearAll" class="hidden">End all buffs</a>    <a id="buffsClearSelected" class="hidden">End selected buffs</a>    <a id="buffsClearCancel" class="spacer hidden">Cancel</a>   </div>   <br>   <label data-title="Some garden plants affect golden cookies but not wrath cookies, and vice-versa.">    <input id="buffsSetWrath" type="checkbox" tabindex="5"> Wrath cookies   </label>   <br>   <div id="buffsTypesBlock"><div class="buffType" data-bufftype="frenzy"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Frenzy</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="blood frenzy"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Elder frenzy</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="clot"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Clot</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="dragon harvest"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Dragon Harvest</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="everything must go"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Everything must go</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="cursed finger"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Cursed finger</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="click frenzy"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Click frenzy</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="dragonflight"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Dragonflight</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="building buff"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Building buff</span> <span class="buffTypeOptions spacer"><select class="buffObjectSelect" tabindex="5"><option value="0" selected="selected">Cursor</option><option value="1">Grandma</option><option value="2">Farm</option><option value="3">Mine</option><option value="4">Factory</option><option value="5">Bank</option><option value="6">Temple</option><option value="7">Wizard tower</option><option value="8">Shipment</option><option value="9">Alchemy lab</option><option value="10">Portal</option><option value="11">Time machine</option><option value="12">Antimatter condenser</option><option value="13">Prism</option><option value="14">Chancemaker</option><option value="15">Fractal engine</option></select> <input type="text" class="buffObjectAmountIn" value="1" placeholder="1" maxlength="4" tabindex="5"> <a class="buffRandomObject">Random</a></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="building debuff"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Building debuff</span> <span class="buffTypeOptions spacer"><select class="buffObjectSelect" tabindex="5"><option value="0" selected="selected">Cursor</option><option value="1">Grandma</option><option value="2">Farm</option><option value="3">Mine</option><option value="4">Factory</option><option value="5">Bank</option><option value="6">Temple</option><option value="7">Wizard tower</option><option value="8">Shipment</option><option value="9">Alchemy lab</option><option value="10">Portal</option><option value="11">Time machine</option><option value="12">Antimatter condenser</option><option value="13">Prism</option><option value="14">Chancemaker</option><option value="15">Fractal engine</option></select> <input type="text" class="buffObjectAmountIn" value="1" placeholder="1" maxlength="4" tabindex="5"> <a class="buffRandomObject">Random</a></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="haggler luck"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Haggler's luck</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="haggler misery"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Haggler's misery</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="pixie luck"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Crafty pixies</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="pixie misery"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Nasty goblins</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="devastation"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Devastation</span> <span class="buffTypeOptions spacer"><select class="buffObjectSelect" tabindex="5"><option value="0" selected="selected">Cursor</option><option value="1">Grandma</option><option value="2">Farm</option><option value="3">Mine</option><option value="4">Factory</option><option value="5">Bank</option><option value="6">Temple</option><option value="7">Wizard tower</option><option value="8">Shipment</option><option value="9">Alchemy lab</option><option value="10">Portal</option><option value="11">Time machine</option><option value="12">Antimatter condenser</option><option value="13">Prism</option><option value="14">Chancemaker</option><option value="15">Fractal engine</option></select> <input type="text" class="buffObjectAmountIn" value="1" placeholder="1" maxlength="4" tabindex="5"> <select tabindex="5"><option value="1" selected="selected">Diamond</option><option value="2">Ruby</option><option value="3">Jade</option></select> <label data-title="Buff will be replaced on add otherwise."><input type="checkbox" checked="checked" tabindex="5"> Stack on add</label> <a class="spacer hidden">Sell and Add</a></span> <span class="buffTypeBtns"></span></div><div class="buffType" data-bufftype="sugar frenzy"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> Sugar frenzy</span> <span class="buffTypeOptions spacer"></span> <span class="buffTypeBtns"></span></div></div>  </div>  <div id="gCookies" class="tabBlock">   <h2>Golden Cookies</h2>   <div id="gCookiesInfo">    <table id="gCookiesTable">     <thead><tr>      <th></th>      <th class="wrath" data-title="Clot">x0.5</th>      <th>x1</th>      <th data-title="Frenzy">x7</th>      <th class="harvest" data-title="Dragon harvest">x15</th>      <th class="wrath" data-title="Elder frenzy">x666</th>      <th id="gCookiesCurrentBuffHeader" class="current" data-title="Current">x<span>1</span></th>     </tr></thead>     <tbody><tr><td>Frenzy CpS</td><td class="wrath" data-title="66 seconds at 0 CpS = 0">0</td><td class="noSel">---</td><td data-title="77 seconds at 0 CpS = 0">0</td><td class="harvest" data-title="60 seconds at 0 CpS = 0">0</td><td class="wrath" data-title="6 seconds at 0 CpS = 0">0</td><td class="noSel">---</td></tr><tr><td>Max Lucky!</td><td class="wrath" data-title="Bank: 0">13</td><td data-title="Bank: 0">13</td><td data-title="Bank: 0">13</td><td class="harvest" data-title="Bank: 0">13</td><td class="wrath" data-title="Bank: 0">13</td><td class="current" data-title="Bank: 0">13</td></tr><tr><td>x777 Click frenzy</td><td class="wrath" data-title="13 seconds at 777 per click = 202,020">777</td><td data-title="13 seconds at 777 per click = 202,020">777</td><td data-title="13 seconds at 777 per click = 202,020">777</td><td class="harvest" data-title="13 seconds at 777 per click = 202,020">777</td><td class="wrath" data-title="13 seconds at 777 per click = 202,020">777</td><td class="current" data-title="13 seconds at 777 per click = 202,020">777</td></tr><tr class="dragonflight"><td>x1111 Dragonflight</td><td class="wrath" data-title="10 seconds at 1,111 per click = 222,200">1,111</td><td data-title="10 seconds at 1,111 per click = 222,200">1,111</td><td data-title="10 seconds at 1,111 per click = 222,200">1,111</td><td class="harvest" data-title="10 seconds at 1,111 per click = 222,200">1,111</td><td class="wrath" data-title="10 seconds at 1,111 per click = 222,200">1,111</td><td class="current" data-title="10 seconds at 1,111 per click = 222,200">1,111</td></tr></tbody>    </table>    <div id="gCookiesDetailsBlock" class="hidden">     <br>     <a id="gcClearSelected">Clear selected effects</a>     <div id="gCookiesDetails" class="marginHead"></div>    </div>   </div>   <!-- <div id="gcChain" class="hidden">    <br>    <strong>Cookie chains:</strong>    <br>    <span id="gcChainMultSpan">     CpS multiplier:     <label><input id="gcChainMultX1" type="radio" name="gcChainMult" checked> x1</label>     <label><input id="gcChainMultX7" type="radio" name="gcChainMult"> x7</label>    </span>    <div id="gcChainWrite"></div>   </div> -->   <br><label class="lockCheckSpan" data-title="Ctrl-, alt-, and/or shift-click to do the opposite."><input class="lockChecker" type="checkbox" tabindex="5"> Toggle locks on click</label>   <br><br>   <div id="goldIcons" class="menuIcons" data-upgrade-group="goldCookie"><div class="upgrade crate extraCrate" style="background-position: -1296px -288px;" data-upgrade="Lucky day" data-id="52"></div><div class="upgrade crate extraCrate" style="background-position: -1296px -288px;" data-upgrade="Serendipity" data-id="53"></div><div class="upgrade crate debug extraCrate" style="background-position: -480px -672px;" data-upgrade="Gold hoard" data-id="83"></div><div class="upgrade crate extraCrate" style="background-position: -1296px -288px;" data-upgrade="Get lucky" data-id="86"></div><div class="upgrade crate extraCrate" style="background-position: -624px -576px;" data-upgrade="Golden goose egg" data-id="222"></div><div class="upgrade crate prestige extraCrate" style="background-position: 0px -576px;" data-upgrade="Starspawn" data-id="269"></div><div class="upgrade crate prestige extraCrate" style="background-position: -624px -384px;" data-upgrade="Starterror" data-id="271"></div><div class="upgrade crate prestige extraCrate" style="background-position: -960px -144px;" data-upgrade="Starlove" data-id="272"></div><div class="upgrade crate prestige extraCrate" style="background-position: -816px -288px;" data-upgrade="Startrade" data-id="273"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1056px -288px;" data-upgrade="Heavenly luck" data-id="282"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1104px -288px;" data-upgrade="Lasting fortune" data-id="283"></div><div class="upgrade crate prestige extraCrate" style="background-position: -480px -672px;" data-upgrade="Decisive fate" data-id="284"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -288px;" data-upgrade="Residual luck" data-id="365"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1296px -576px;" data-upgrade="Distilled essence of redoubled luck" data-id="397"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -720px;" data-upgrade="Lucky digit" data-id="411"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -720px;" data-upgrade="Lucky number" data-id="412"></div><div class="upgrade crate prestige extraCrate" style="background-position: -1152px -720px;" data-upgrade="Lucky payout" data-id="413"></div></div>  </div>  <div id="season" class="tabBlock hidden">   <h2>Seasons</h2>   <label class="lockCheckSpan" data-title="Ctrl-, alt-, and/or shift-click to do the opposite."><input class="lockChecker" type="checkbox" tabindex="5"> Toggle locks on click</label>   <br><br>   <div id="seasonSelIcons" data-upgrade-group="seasonSwitch"><div class="upgrade crate toggle extraCrate" style="background-position: -576px -480px;" data-upgrade="Festive biscuit" data-id="182"></div><div class="upgrade crate toggle extraCrate" style="background-position: -624px -384px;" data-upgrade="Ghostly biscuit" data-id="183"></div><div class="upgrade crate toggle extraCrate" style="background-position: -960px -144px;" data-upgrade="Lovesick biscuit" data-id="184"></div><div class="upgrade crate toggle extraCrate" style="background-position: -816px -288px;" data-upgrade="Fool's biscuit" data-id="185"></div><div class="upgrade crate toggle extraCrate" style="background-position: 0px -576px;" data-upgrade="Bunny biscuit" data-id="209"></div></div>   <br>   Number of season changes: <span id="seasonCountSpan"><a class="minus plusminus">-</a> <input id="seasonCountIn" type="text" maxlength="true" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus">+</a></span>   <br>   Next season change price: <span id="nextSeason"><span data-title="1,000,000,000">1 B</span></span>   <br>   <div id="christmasDiv" class="seasonBlock hidden" data-season="christmas">    <h2>Christmas</h2>    <div>     Reindeer:     <div id="reindeerWrite"><div class="wrath">1 minute x<span>0.5</span> production: <span>25</span></div><div>1 minute x<span>1</span> production: <span>25</span></div><div>1 minute x<span>7</span> production x0.75: <span>25</span></div><div class="harvest">1 minute x<span>15</span> production: <span>25</span></div><div class="wrath">1 minute x<span>666</span> production x0.5: <span>25</span></div></div>    </div>    <br>   </div>   <h4 id="halloweenDiv" class="seasonBlock hidden" data-season="halloween">Halloween</h4>   <h4 id="valentinesDiv" class="seasonBlock hidden" data-season="valentines">Valentine's Day</h4>   <h4 id="easterDiv" class="seasonBlock hidden" data-season="easter">Easter</h4>   <div id="seasonIcons">    <div id="christmasIcons" class="seasonBlock menuIcons hidden" data-season="christmas" data-upgrade-group="christmas"><div class="upgrade crate cookie extraCrate" style="background-position: -576px -480px;" data-upgrade="Christmas tree biscuits" data-id="143"></div><div class="upgrade crate cookie extraCrate" style="background-position: -624px -480px;" data-upgrade="Snowflake biscuits" data-id="144"></div><div class="upgrade crate cookie extraCrate" style="background-position: -672px -480px;" data-upgrade="Snowman biscuits" data-id="145"></div><div class="upgrade crate cookie extraCrate" style="background-position: -720px -480px;" data-upgrade="Holly biscuits" data-id="146"></div><div class="upgrade crate cookie extraCrate" style="background-position: -768px -480px;" data-upgrade="Candy cane biscuits" data-id="147"></div><div class="upgrade crate cookie extraCrate" style="background-position: -816px -480px;" data-upgrade="Bell biscuits" data-id="148"></div><div class="upgrade crate cookie extraCrate" style="background-position: -864px -480px;" data-upgrade="Present biscuits" data-id="149"></div><div class="upgrade crate extraCrate" style="background-position: -912px -432px;" data-upgrade="A festive hat" data-id="152"></div><div class="upgrade crate extraCrate" style="background-position: -816px -432px;" data-upgrade="Increased merriness" data-id="153"></div><div class="upgrade crate extraCrate" style="background-position: -816px -432px;" data-upgrade="Improved jolliness" data-id="154"></div><div class="upgrade crate extraCrate" style="background-position: -624px -432px;" data-upgrade="A lump of coal" data-id="155"></div><div class="upgrade crate extraCrate" style="background-position: -672px -432px;" data-upgrade="An itchy sweater" data-id="156"></div><div class="upgrade crate extraCrate" style="background-position: -576px -432px;" data-upgrade="Reindeer baking grounds" data-id="157"></div><div class="upgrade crate extraCrate" style="background-position: -576px -432px;" data-upgrade="Weighted sleighs" data-id="158"></div><div class="upgrade crate extraCrate" style="background-position: -576px -432px;" data-upgrade="Ho ho ho-flavored frosting" data-id="159"></div><div class="upgrade crate extraCrate" style="background-position: -768px -432px;" data-upgrade="Season savings" data-id="160"></div><div class="upgrade crate extraCrate" style="background-position: -768px -432px;" data-upgrade="Toy workshop" data-id="161"></div><div class="upgrade crate extraCrate" style="background-position: -720px -432px;" data-upgrade="Naughty list" data-id="162"></div><div class="upgrade crate extraCrate" style="background-position: -912px -432px;" data-upgrade="Santa's bottomless bag" data-id="163"></div><div class="upgrade crate extraCrate" style="background-position: -912px -432px;" data-upgrade="Santa's helpers" data-id="164"></div><div class="upgrade crate extraCrate" style="background-position: -912px -432px;" data-upgrade="Santa's legacy" data-id="165"></div><div class="upgrade crate extraCrate" style="background-position: -912px -432px;" data-upgrade="Santa's milk and cookies" data-id="166"></div><div class="upgrade crate debug extraCrate" style="background-position: -576px -432px;" data-upgrade="Reindeer season" data-id="167"></div><div class="upgrade crate extraCrate" style="background-position: -912px -480px;" data-upgrade="Santa's dominion" data-id="168"></div><div class="upgrade crate prestige extraCrate" style="background-position: -576px -432px;" data-upgrade="Starsnow" data-id="270"></div></div>    <div id="spookIcons" class="seasonBlock menuIcons hidden" data-season="halloween" data-upgrade-group="halloween"><div class="upgrade crate cookie extraCrate" style="background-position: -576px -384px;" data-upgrade="Skull cookies" data-id="134"></div><div class="upgrade crate cookie extraCrate" style="background-position: -624px -384px;" data-upgrade="Ghost cookies" data-id="135"></div><div class="upgrade crate cookie extraCrate" style="background-position: -672px -384px;" data-upgrade="Bat cookies" data-id="136"></div><div class="upgrade crate cookie extraCrate" style="background-position: -720px -384px;" data-upgrade="Slime cookies" data-id="137"></div><div class="upgrade crate cookie extraCrate" style="background-position: -768px -384px;" data-upgrade="Pumpkin cookies" data-id="138"></div><div class="upgrade crate cookie extraCrate" style="background-position: -816px -384px;" data-upgrade="Eyeball cookies" data-id="139"></div><div class="upgrade crate cookie extraCrate" style="background-position: -864px -384px;" data-upgrade="Spider cookies" data-id="140"></div></div>    <div id="heartIcons" class="seasonBlock menuIcons hidden" data-season="valentines" data-upgrade-group="valentines"><div class="upgrade crate cookie extraCrate" style="background-position: -912px -144px;" data-upgrade="Pure heart biscuits" data-id="169"></div><div class="upgrade crate cookie extraCrate" style="background-position: -960px -144px;" data-upgrade="Ardent heart biscuits" data-id="170"></div><div class="upgrade crate cookie extraCrate" style="background-position: -960px -192px;" data-upgrade="Sour heart biscuits" data-id="171"></div><div class="upgrade crate cookie extraCrate" style="background-position: -1008px -144px;" data-upgrade="Weeping heart biscuits" data-id="172"></div><div class="upgrade crate cookie extraCrate" style="background-position: -1008px -192px;" data-upgrade="Golden heart biscuits" data-id="173"></div><div class="upgrade crate cookie extraCrate" style="background-position: -912px -192px;" data-upgrade="Eternal heart biscuits" data-id="174"></div></div>    <div id="eggIcons" class="seasonBlock menuIcons hidden" data-season="easter" data-upgrade-group="easter"><div class="upgrade crate extraCrate" style="background-position: -48px -576px;" data-upgrade="Chicken egg" data-id="210"></div><div class="upgrade crate extraCrate" style="background-position: -96px -576px;" data-upgrade="Duck egg" data-id="211"></div><div class="upgrade crate extraCrate" style="background-position: -144px -576px;" data-upgrade="Turkey egg" data-id="212"></div><div class="upgrade crate extraCrate" style="background-position: -192px -576px;" data-upgrade="Quail egg" data-id="213"></div><div class="upgrade crate extraCrate" style="background-position: -240px -576px;" data-upgrade="Robin egg" data-id="214"></div><div class="upgrade crate extraCrate" style="background-position: -288px -576px;" data-upgrade="Ostrich egg" data-id="215"></div><div class="upgrade crate extraCrate" style="background-position: -336px -576px;" data-upgrade="Cassowary egg" data-id="216"></div><div class="upgrade crate extraCrate" style="background-position: -384px -576px;" data-upgrade="Salmon roe" data-id="217"></div><div class="upgrade crate extraCrate" style="background-position: -432px -576px;" data-upgrade="Frogspawn" data-id="218"></div><div class="upgrade crate extraCrate" style="background-position: -480px -576px;" data-upgrade="Shark egg" data-id="219"></div><div class="upgrade crate extraCrate" style="background-position: -528px -576px;" data-upgrade="Turtle egg" data-id="220"></div><div class="upgrade crate extraCrate" style="background-position: -576px -576px;" data-upgrade="Ant larva" data-id="221"></div><div class="upgrade crate extraCrate" style="background-position: -624px -576px;" data-upgrade="Golden goose egg" data-id="222"></div><div class="upgrade crate extraCrate" style="background-position: -672px -576px;" data-upgrade="Faberge egg" data-id="223"></div><div class="upgrade crate extraCrate" style="background-position: -720px -576px;" data-upgrade="Wrinklerspawn" data-id="224"></div><div class="upgrade crate extraCrate" style="background-position: -768px -576px;" data-upgrade="Cookie egg" data-id="225"></div><div class="upgrade crate extraCrate" style="background-position: -816px -576px;" data-upgrade="Omelette" data-id="226"></div><div class="upgrade crate extraCrate" style="background-position: -864px -576px;" data-upgrade="Chocolate egg" data-id="227"></div><div class="upgrade crate extraCrate" style="background-position: -912px -576px;" data-upgrade="Century egg" data-id="228"></div><div class="upgrade crate extraCrate" style="background-position: -960px -576px;" data-upgrade="&quot;egg&quot;" data-id="229"></div></div>   </div>  </div>  <div id="familiarDiv" class="tabBlock hidden">   <br>   <label class="lockCheckSpan" data-title="Ctrl-, alt-, and/or shift-click to do the opposite."><input class="lockChecker" type="checkbox" tabindex="5"> Toggle locks on click</label>   <br><br>   <div id="familiarIcons"><div class="upgrade crate extraCrate" style="background-position: -912px -432px;" data-upgrade="A festive hat" data-id="152"></div><div class="upgrade crate extraCrate" style="background-position: -1008px -576px;" data-upgrade="A crumbly egg" data-id="324"></div></div>   <h2>Santa</h2>   Santa's level:   <select id="santaLevel" class="recalc" tabindex="5"><option id="noSantaOpt" value="0" selected="selected">---</option><option>Festive test tube</option><option>Festive ornament</option><option>Festive wreath</option><option>Festive tree</option><option>Festive present</option><option>Festive elf fetus</option><option>Elf toddler</option><option>Elfling</option><option>Young elf</option><option>Bulky elf</option><option>Nick</option><option>Santa Claus</option><option>Elder Santa</option><option>True Santa</option><option>Final Claus</option></select>   <br>   <span id="santaClick" class="clickme hidden">---</span>   <h2>Dragon Auras</h2>   Dragon level: <span id="dragonLevelSpan"><a class="minus plusminus limited">-</a> <input id="dragonLevelIn" type="text" maxlength="2" placeholder="0" tabindex="5" value="0"> <a class="plus plusminus limited">+</a></span> <span id="dragonName">Dragon egg</span>   <br>   <span id="dragonAction" data-title="" class="clickme">Chip it - Cost: 1 million cookies</span>   <br><br>   <div id="auraBlock">    Current auras    <br><br>    <div id="auraCurrent" class="menuIcons">     <div id="auraSlot0" class="crate aura auraSlot" data-slot="0" style="background-position: 0px -336px;" data-aura="0"></div>     <div id="auraSlot1" class="crate aura auraSlot" data-slot="1" style="background-position: 0px -336px;" data-aura="0"></div>    </div>    <div id="auraAvailableBlock" class="hidden">     <br><br>     Select an aura:     <div id="auraAvailable" class="menuIcons"><div class="crate aura unlocked" style="background-position: 0px -336px;" data-aura="0"></div><div class="crate aura" style="background-position: -864px -1200px;" data-aura="1"></div><div class="crate aura" style="background-position: 0px -1200px;" data-aura="2"></div><div class="crate aura" style="background-position: -48px -1200px;" data-aura="3"></div><div class="crate aura" style="background-position: -96px -1200px;" data-aura="4"></div><div class="crate aura" style="background-position: -144px -1200px;" data-aura="5"></div><div class="crate aura" style="background-position: -192px -1200px;" data-aura="6"></div><div class="crate aura" style="background-position: -720px -1200px;" data-aura="7"></div><div class="crate aura" style="background-position: -768px -1200px;" data-aura="8"></div><div class="crate aura" style="background-position: -816px -1200px;" data-aura="9"></div><div class="crate aura" style="background-position: -240px -1200px;" data-aura="10"></div><div class="crate aura" style="background-position: -288px -1200px;" data-aura="11"></div><div class="crate aura" style="background-position: -336px -1200px;" data-aura="12"></div><div class="crate aura" style="background-position: -384px -1200px;" data-aura="13"></div><div class="crate aura" style="background-position: -624px -1200px;" data-aura="14"></div><div class="crate aura" style="background-position: -672px -1200px;" data-aura="15"></div><div class="crate aura" style="background-position: -912px -1200px;" data-aura="16"></div><div class="crate aura" style="background-position: -960px -1200px;" data-aura="17"></div></div>     <br>     <a id="switchAuraCancel">Cancel</a>     <a id="switchAuraFree" class="">Change aura (free)</a>     <a id="switchAuraBuy" class="hidden">Change aura (---)</a>    </div>   </div>  </div>  <div id="minigames" class="tabBlock hidden">   <h2>Pantheon</h2>   <div id="pantheonBlock">    <div id="pantheonSlots" class="menuIcons"><div id="pantheonSlot0" class="templeGod templeGod0 templeSlot tooltipped" data-slot="0" data-god="-1"><div id="pantheonSlot0Icon" class="usesIcon templeIcon hidden"></div><div class="usesIcon templeGem templeGem1"></div></div><div id="pantheonSlot1" class="templeGod templeGod1 templeSlot tooltipped" data-slot="1" data-god="-1"><div id="pantheonSlot1Icon" class="usesIcon templeIcon hidden"></div><div class="usesIcon templeGem templeGem2"></div></div><div id="pantheonSlot2" class="templeGod templeGod2 templeSlot tooltipped" data-slot="2" data-god="-1"><div id="pantheonSlot2Icon" class="usesIcon templeIcon hidden"></div><div class="usesIcon templeGem templeGem3"></div></div></div>    <div id="pantheonAvailableBlock">     <br><br>     <div id="pantheonAvailable" class="menuIcons"><div id="pantheonGod0" class="templeGod tooltipped" data-god="0"><div id="pantheonGod0Icon" class="usesIcon templeIcon" style="background-position: -1008px -864px;"></div></div><div id="pantheonGod1" class="templeGod tooltipped" data-god="1"><div id="pantheonGod1Icon" class="usesIcon templeIcon" style="background-position: -1056px -864px;"></div></div><div id="pantheonGod2" class="templeGod tooltipped" data-god="2"><div id="pantheonGod2Icon" class="usesIcon templeIcon" style="background-position: -1104px -864px;"></div></div><div id="pantheonGod3" class="templeGod tooltipped" data-god="3"><div id="pantheonGod3Icon" class="usesIcon templeIcon" style="background-position: -1152px -864px;"></div></div><div id="pantheonGod4" class="templeGod tooltipped" data-god="4"><div id="pantheonGod4Icon" class="usesIcon templeIcon" style="background-position: -1200px -864px;"></div></div><div id="pantheonGod5" class="templeGod tooltipped" data-god="5"><div id="pantheonGod5Icon" class="usesIcon templeIcon" style="background-position: -1248px -864px;"></div></div><div id="pantheonGod6" class="templeGod tooltipped" data-god="6"><div id="pantheonGod6Icon" class="usesIcon templeIcon" style="background-position: -1296px -864px;"></div></div><div id="pantheonGod7" class="templeGod tooltipped" data-god="7"><div id="pantheonGod7Icon" class="usesIcon templeIcon" style="background-position: -1344px -864px;"></div></div><div id="pantheonGod8" class="templeGod tooltipped" data-god="8"><div id="pantheonGod8Icon" class="usesIcon templeIcon" style="background-position: -1392px -864px;"></div></div><div id="pantheonGod9" class="templeGod tooltipped" data-god="9"><div id="pantheonGod9Icon" class="usesIcon templeIcon" style="background-position: -1008px -912px;"></div></div><div id="pantheonGod10" class="templeGod tooltipped" data-god="10"><div id="pantheonGod10Icon" class="usesIcon templeIcon" style="background-position: -1056px -912px;"></div></div></div>     <br>     <a id="pantheonClearSelection" class="hidden">Cancel</a>     <a id="pantheonSetGod" class="hidden">Set God</a>     <a id="pantheonClearSlot" class="hidden">Clear slot</a>    </div>   </div>  </div>  <div id="blacklist" class="tabBlock hidden">   <h2>Recommended purchase blacklist</h2>   <div id="blacklistHead" class="marginHead">    <label><input id="blackCheckAll" type="checkbox" tabindex="5"> Toggle all shown</label>&nbsp;    <a id="blackClear" class="hidden">Clear owned</a>   </div>   <ul id="blacklistEles" class="columns"><li class="blacklistEle"><label data-title="Cursor&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cursor</span></label></li><li class="blacklistEle"><label data-title="Grandma&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Grandma</span></label></li><li class="blacklistEle"><label data-title="Farm&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Farm</span></label></li><li class="blacklistEle"><label data-title="Mine&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mine</span></label></li><li class="blacklistEle"><label data-title="Factory&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Factory</span></label></li><li class="blacklistEle"><label data-title="Bank&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bank</span></label></li><li class="blacklistEle"><label data-title="Temple&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Temple</span></label></li><li class="blacklistEle"><label data-title="Wizard tower&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wizard tower</span></label></li><li class="blacklistEle"><label data-title="Shipment&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shipment</span></label></li><li class="blacklistEle"><label data-title="Alchemy lab&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Alchemy lab</span></label></li><li class="blacklistEle"><label data-title="Portal&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Portal</span></label></li><li class="blacklistEle"><label data-title="Time machine&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Time machine</span></label></li><li class="blacklistEle"><label data-title="Antimatter condenser&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Antimatter condenser</span></label></li><li class="blacklistEle"><label data-title="Prism&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Prism</span></label></li><li class="blacklistEle"><label data-title="Chancemaker&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chancemaker</span></label></li><li class="blacklistEle"><label data-title="Fractal engine&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fractal engine</span></label></li><li class="blacklistEle hidden"><label data-title="Santa levels&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Santa levels</span></label></li><li class="blacklistEle"><label data-title="Reinforced index finger&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reinforced index finger</span></label></li><li class="blacklistEle"><label data-title="Carpal tunnel prevention cream&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Carpal tunnel prevention cream</span></label></li><li class="blacklistEle"><label data-title="Ambidextrous&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ambidextrous</span></label></li><li class="blacklistEle hidden"><label data-title="Thousand fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Thousand fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Million fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Million fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Billion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Billion fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Trillion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Trillion fingers</span></label></li><li class="blacklistEle"><label data-title="Forwards from grandma&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Forwards from grandma</span></label></li><li class="blacklistEle"><label data-title="Steel-plated rolling pins&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Steel-plated rolling pins</span></label></li><li class="blacklistEle hidden"><label data-title="Lubricated dentures&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lubricated dentures</span></label></li><li class="blacklistEle"><label data-title="Cheap hoes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cheap hoes</span></label></li><li class="blacklistEle"><label data-title="Fertilizer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fertilizer</span></label></li><li class="blacklistEle hidden"><label data-title="Cookie trees&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cookie trees</span></label></li><li class="blacklistEle"><label data-title="Sturdier conveyor belts&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sturdier conveyor belts</span></label></li><li class="blacklistEle"><label data-title="Child labor&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Child labor</span></label></li><li class="blacklistEle hidden"><label data-title="Sweatshop&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sweatshop</span></label></li><li class="blacklistEle"><label data-title="Sugar gas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar gas</span></label></li><li class="blacklistEle"><label data-title="Megadrill&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Megadrill</span></label></li><li class="blacklistEle hidden"><label data-title="Ultradrill&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ultradrill</span></label></li><li class="blacklistEle"><label data-title="Vanilla nebulae&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Vanilla nebulae</span></label></li><li class="blacklistEle"><label data-title="Wormholes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wormholes</span></label></li><li class="blacklistEle hidden"><label data-title="Frequent flyer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Frequent flyer</span></label></li><li class="blacklistEle"><label data-title="Antimony&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Antimony</span></label></li><li class="blacklistEle"><label data-title="Essence of dough&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Essence of dough</span></label></li><li class="blacklistEle hidden"><label data-title="True chocolate&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">True chocolate</span></label></li><li class="blacklistEle"><label data-title="Ancient tablet&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ancient tablet</span></label></li><li class="blacklistEle"><label data-title="Insane oatling workers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Insane oatling workers</span></label></li><li class="blacklistEle hidden"><label data-title="Soul bond&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Soul bond</span></label></li><li class="blacklistEle"><label data-title="Flux capacitors&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Flux capacitors</span></label></li><li class="blacklistEle"><label data-title="Time paradox resolver&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Time paradox resolver</span></label></li><li class="blacklistEle hidden"><label data-title="Quantum conundrum&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Quantum conundrum</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten helpers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten helpers</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten workers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten workers</span></label></li><li class="blacklistEle hidden"><label data-title="Plain cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Plain cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Sugar cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Oatmeal raisin cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Oatmeal raisin cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Peanut butter cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Peanut butter cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Coconut cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Coconut cookies</span></label></li><li class="blacklistEle hidden"><label data-title="White chocolate cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">White chocolate cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Macadamia nut cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Macadamia nut cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Double-chip cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Double-chip cookies</span></label></li><li class="blacklistEle hidden"><label data-title="White chocolate macadamia nut cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">White chocolate macadamia nut cookies</span></label></li><li class="blacklistEle hidden"><label data-title="All-chocolate cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">All-chocolate cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Quadrillion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Quadrillion fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Prune juice&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Prune juice</span></label></li><li class="blacklistEle hidden"><label data-title="Genetically-modified cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Genetically-modified cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Radium reactors&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Radium reactors</span></label></li><li class="blacklistEle hidden"><label data-title="Ultimadrill&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ultimadrill</span></label></li><li class="blacklistEle hidden"><label data-title="Warp drive&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Warp drive</span></label></li><li class="blacklistEle hidden"><label data-title="Ambrosia&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ambrosia</span></label></li><li class="blacklistEle hidden"><label data-title="Sanity dance&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sanity dance</span></label></li><li class="blacklistEle hidden"><label data-title="Causality enforcer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Causality enforcer</span></label></li><li class="blacklistEle hidden"><label data-title="Lucky day&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lucky day</span></label></li><li class="blacklistEle hidden"><label data-title="Serendipity&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Serendipity</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten engineers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten engineers</span></label></li><li class="blacklistEle hidden"><label data-title="Dark chocolate-coated cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dark chocolate-coated cookies</span></label></li><li class="blacklistEle hidden"><label data-title="White chocolate-coated cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">White chocolate-coated cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Farmer grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Farmer grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Miner grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Miner grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Worker grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Worker grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Cosmic grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cosmic grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Transmuted grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Transmuted grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Altered grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Altered grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Grandmas' grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Grandmas' grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Bingo center/Research facility&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bingo center/Research facility</span></label></li><li class="blacklistEle hidden"><label data-title="Specialized chocolate chips&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Specialized chocolate chips</span></label></li><li class="blacklistEle hidden"><label data-title="Designer cocoa beans&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Designer cocoa beans</span></label></li><li class="blacklistEle hidden"><label data-title="Ritual rolling pins&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ritual rolling pins</span></label></li><li class="blacklistEle hidden"><label data-title="Underworld ovens&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Underworld ovens</span></label></li><li class="blacklistEle hidden"><label data-title="One mind&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">One mind</span></label></li><li class="blacklistEle hidden"><label data-title="Exotic nuts&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Exotic nuts</span></label></li><li class="blacklistEle hidden"><label data-title="Communal brainsweep&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Communal brainsweep</span></label></li><li class="blacklistEle hidden"><label data-title="Arcane sugar&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Arcane sugar</span></label></li><li class="blacklistEle hidden"><label data-title="Elder Pact&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Elder Pact</span></label></li><li class="blacklistEle hidden"><label data-title="Elder Pledge&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Elder Pledge</span></label></li><li class="blacklistEle hidden"><label data-title="Plastic mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Plastic mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Iron mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Iron mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Titanium mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Titanium mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Adamantium mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Adamantium mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Ultrascience&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ultrascience</span></label></li><li class="blacklistEle hidden"><label data-title="Eclipse cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Eclipse cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Zebra cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Zebra cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Quintillion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Quintillion fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Gold hoard&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gold hoard</span></label></li><li class="blacklistEle hidden"><label data-title="Elder Covenant&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Elder Covenant</span></label></li><li class="blacklistEle hidden"><label data-title="Revoke Elder Covenant&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Revoke Elder Covenant</span></label></li><li class="blacklistEle hidden"><label data-title="Get lucky&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Get lucky</span></label></li><li class="blacklistEle hidden"><label data-title="Sacrificial rolling pins&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sacrificial rolling pins</span></label></li><li class="blacklistEle hidden"><label data-title="Snickerdoodles&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Snickerdoodles</span></label></li><li class="blacklistEle hidden"><label data-title="Stroopwafels&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Stroopwafels</span></label></li><li class="blacklistEle hidden"><label data-title="Macaroons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Macaroons</span></label></li><li class="blacklistEle hidden"><label data-title="Neuromancy&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Neuromancy</span></label></li><li class="blacklistEle hidden"><label data-title="Empire biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Empire biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="British tea biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">British tea biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate british tea biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate british tea biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Round british tea biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Round british tea biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Round chocolate british tea biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Round chocolate british tea biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Round british tea biscuits with heart motif&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Round british tea biscuits with heart motif</span></label></li><li class="blacklistEle hidden"><label data-title="Round chocolate british tea biscuits with heart motif&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Round chocolate british tea biscuits with heart motif</span></label></li><li class="blacklistEle"><label data-title="Sugar bosons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar bosons</span></label></li><li class="blacklistEle"><label data-title="String theory&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">String theory</span></label></li><li class="blacklistEle hidden"><label data-title="Large macaron collider&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Large macaron collider</span></label></li><li class="blacklistEle hidden"><label data-title="Big bang bake&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Big bang bake</span></label></li><li class="blacklistEle hidden"><label data-title="Antigrandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Antigrandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Madeleines&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Madeleines</span></label></li><li class="blacklistEle hidden"><label data-title="Palmiers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Palmiers</span></label></li><li class="blacklistEle hidden"><label data-title="Palets&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Palets</span></label></li><li class="blacklistEle hidden"><label data-title="Sabl&amp;eacute;s&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sablés</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten overseers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten overseers</span></label></li><li class="blacklistEle hidden"><label data-title="Sextillion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sextillion fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Double-thick glasses&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Double-thick glasses</span></label></li><li class="blacklistEle hidden"><label data-title="Gingerbread scarecrows&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gingerbread scarecrows</span></label></li><li class="blacklistEle hidden"><label data-title="Recombobulators&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Recombobulators</span></label></li><li class="blacklistEle hidden"><label data-title="H-bomb mining&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">H-bomb mining</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate monoliths&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate monoliths</span></label></li><li class="blacklistEle hidden"><label data-title="Aqua crustulae&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Aqua crustulae</span></label></li><li class="blacklistEle hidden"><label data-title="Brane transplant&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Brane transplant</span></label></li><li class="blacklistEle hidden"><label data-title="Yestermorrow comparators&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Yestermorrow comparators</span></label></li><li class="blacklistEle hidden"><label data-title="Reverse cyclotrons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reverse cyclotrons</span></label></li><li class="blacklistEle hidden"><label data-title="Unobtainium mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Unobtainium mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Caramoas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Caramoas</span></label></li><li class="blacklistEle hidden"><label data-title="Sagalongs&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sagalongs</span></label></li><li class="blacklistEle hidden"><label data-title="Shortfoils&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shortfoils</span></label></li><li class="blacklistEle hidden"><label data-title="Win mints&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Win mints</span></label></li><li class="blacklistEle hidden"><label data-title="Perfect idling&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Perfect idling</span></label></li><li class="blacklistEle hidden"><label data-title="Fig gluttons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fig gluttons</span></label></li><li class="blacklistEle hidden"><label data-title="Loreols&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Loreols</span></label></li><li class="blacklistEle hidden"><label data-title="Jaffa cakes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Jaffa cakes</span></label></li><li class="blacklistEle hidden"><label data-title="Grease's cups&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Grease's cups</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly chip secret&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly chip secret</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly cookie stand&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly cookie stand</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly bakery&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly bakery</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly confectionery&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly confectionery</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly key&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly key</span></label></li><li class="blacklistEle hidden"><label data-title="Skull cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Skull cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Ghost cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ghost cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Bat cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bat cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Slime cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Slime cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Pumpkin cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pumpkin cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Eyeball cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Eyeball cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Spider cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Spider cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Persistent memory&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Persistent memory</span></label></li><li class="blacklistEle hidden"><label data-title="Wrinkler doormat&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wrinkler doormat</span></label></li><li class="blacklistEle hidden"><label data-title="Christmas tree biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Christmas tree biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Snowflake biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Snowflake biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Snowman biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Snowman biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Holly biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Holly biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Candy cane biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Candy cane biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Bell biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bell biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Present biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Present biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Gingerbread men&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gingerbread men</span></label></li><li class="blacklistEle hidden"><label data-title="Gingerbread trees&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gingerbread trees</span></label></li><li class="blacklistEle hidden"><label data-title="A festive hat&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">A festive hat</span></label></li><li class="blacklistEle hidden"><label data-title="Increased merriness&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Increased merriness</span></label></li><li class="blacklistEle hidden"><label data-title="Improved jolliness&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Improved jolliness</span></label></li><li class="blacklistEle hidden"><label data-title="A lump of coal&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">A lump of coal</span></label></li><li class="blacklistEle hidden"><label data-title="An itchy sweater&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">An itchy sweater</span></label></li><li class="blacklistEle hidden"><label data-title="Reindeer baking grounds&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reindeer baking grounds</span></label></li><li class="blacklistEle hidden"><label data-title="Weighted sleighs&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Weighted sleighs</span></label></li><li class="blacklistEle hidden"><label data-title="Ho ho ho-flavored frosting&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ho ho ho-flavored frosting</span></label></li><li class="blacklistEle hidden"><label data-title="Season savings&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Season savings</span></label></li><li class="blacklistEle hidden"><label data-title="Toy workshop&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Toy workshop</span></label></li><li class="blacklistEle hidden"><label data-title="Naughty list&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Naughty list</span></label></li><li class="blacklistEle hidden"><label data-title="Santa's bottomless bag&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Santa's bottomless bag</span></label></li><li class="blacklistEle hidden"><label data-title="Santa's helpers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Santa's helpers</span></label></li><li class="blacklistEle hidden"><label data-title="Santa's legacy&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Santa's legacy</span></label></li><li class="blacklistEle hidden"><label data-title="Santa's milk and cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Santa's milk and cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Reindeer season&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reindeer season</span></label></li><li class="blacklistEle hidden"><label data-title="Santa's dominion&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Santa's dominion</span></label></li><li class="blacklistEle hidden"><label data-title="Pure heart biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pure heart biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Ardent heart biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ardent heart biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Sour heart biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sour heart biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Weeping heart biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Weeping heart biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Golden heart biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden heart biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Eternal heart biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Eternal heart biscuits</span></label></li><li class="blacklistEle"><label data-title="Gem polish&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gem polish</span></label></li><li class="blacklistEle"><label data-title="9th color&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">9th color</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate light&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate light</span></label></li><li class="blacklistEle hidden"><label data-title="Grainbow&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Grainbow</span></label></li><li class="blacklistEle hidden"><label data-title="Pure cosmic light&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pure cosmic light</span></label></li><li class="blacklistEle hidden"><label data-title="Rainbow grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Rainbow grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Season switcher&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Season switcher</span></label></li><li class="blacklistEle hidden"><label data-title="Festive biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Festive biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Ghostly biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ghostly biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Lovesick biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lovesick biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Fool's biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fool's biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Eternal seasons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Eternal seasons</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten managers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten managers</span></label></li><li class="blacklistEle hidden"><label data-title="Septillion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Septillion fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Octillion fingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Octillion fingers</span></label></li><li class="blacklistEle hidden"><label data-title="Eludium mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Eludium mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Wishalloy mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wishalloy mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Aging agents&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Aging agents</span></label></li><li class="blacklistEle hidden"><label data-title="Pulsar sprinklers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pulsar sprinklers</span></label></li><li class="blacklistEle hidden"><label data-title="Deep-bake process&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Deep-bake process</span></label></li><li class="blacklistEle hidden"><label data-title="Coreforge&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Coreforge</span></label></li><li class="blacklistEle hidden"><label data-title="Generation ship&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Generation ship</span></label></li><li class="blacklistEle hidden"><label data-title="Origin crucible&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Origin crucible</span></label></li><li class="blacklistEle hidden"><label data-title="Deity-sized portals&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Deity-sized portals</span></label></li><li class="blacklistEle hidden"><label data-title="Far future enactment&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Far future enactment</span></label></li><li class="blacklistEle hidden"><label data-title="Nanocosmics&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nanocosmics</span></label></li><li class="blacklistEle hidden"><label data-title="Glow-in-the-dark&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Glow-in-the-dark</span></label></li><li class="blacklistEle hidden"><label data-title="Rose macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Rose macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Lemon macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lemon macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Pistachio macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pistachio macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Hazelnut macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Hazelnut macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Violet macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Violet macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Magic shenanigans&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Magic shenanigans</span></label></li><li class="blacklistEle hidden"><label data-title="Bunny biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bunny biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Chicken egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chicken egg</span></label></li><li class="blacklistEle hidden"><label data-title="Duck egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Duck egg</span></label></li><li class="blacklistEle hidden"><label data-title="Turkey egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Turkey egg</span></label></li><li class="blacklistEle hidden"><label data-title="Quail egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Quail egg</span></label></li><li class="blacklistEle hidden"><label data-title="Robin egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Robin egg</span></label></li><li class="blacklistEle hidden"><label data-title="Ostrich egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ostrich egg</span></label></li><li class="blacklistEle hidden"><label data-title="Cassowary egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cassowary egg</span></label></li><li class="blacklistEle hidden"><label data-title="Salmon roe&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Salmon roe</span></label></li><li class="blacklistEle hidden"><label data-title="Frogspawn&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Frogspawn</span></label></li><li class="blacklistEle hidden"><label data-title="Shark egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shark egg</span></label></li><li class="blacklistEle hidden"><label data-title="Turtle egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Turtle egg</span></label></li><li class="blacklistEle hidden"><label data-title="Ant larva&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ant larva</span></label></li><li class="blacklistEle hidden"><label data-title="Golden goose egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden goose egg</span></label></li><li class="blacklistEle hidden"><label data-title="Faberge egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Faberge egg</span></label></li><li class="blacklistEle hidden"><label data-title="Wrinklerspawn&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wrinklerspawn</span></label></li><li class="blacklistEle hidden"><label data-title="Cookie egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cookie egg</span></label></li><li class="blacklistEle hidden"><label data-title="Omelette&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Omelette</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate egg</span></label></li><li class="blacklistEle hidden"><label data-title="Century egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Century egg</span></label></li><li class="blacklistEle hidden"><label data-title="&quot;egg&quot;&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">"egg"</span></label></li><li class="blacklistEle hidden"><label data-title="Caramel macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Caramel macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Licorice macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Licorice macarons</span></label></li><li class="blacklistEle"><label data-title="Taller tellers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Taller tellers</span></label></li><li class="blacklistEle"><label data-title="Scissor-resistant credit cards&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Scissor-resistant credit cards</span></label></li><li class="blacklistEle hidden"><label data-title="Acid-proof vaults&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Acid-proof vaults</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate coins&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate coins</span></label></li><li class="blacklistEle hidden"><label data-title="Exponential interest rates&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Exponential interest rates</span></label></li><li class="blacklistEle hidden"><label data-title="Financial zen&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Financial zen</span></label></li><li class="blacklistEle"><label data-title="Golden idols&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden idols</span></label></li><li class="blacklistEle"><label data-title="Sacrifices&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sacrifices</span></label></li><li class="blacklistEle hidden"><label data-title="Delicious blessing&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Delicious blessing</span></label></li><li class="blacklistEle hidden"><label data-title="Sun festival&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sun festival</span></label></li><li class="blacklistEle hidden"><label data-title="Enlarged pantheon&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Enlarged pantheon</span></label></li><li class="blacklistEle hidden"><label data-title="Great Baker in the sky&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Great Baker in the sky</span></label></li><li class="blacklistEle"><label data-title="Pointier hats&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pointier hats</span></label></li><li class="blacklistEle"><label data-title="Beardlier beards&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Beardlier beards</span></label></li><li class="blacklistEle hidden"><label data-title="Ancient grimoires&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ancient grimoires</span></label></li><li class="blacklistEle hidden"><label data-title="Kitchen curses&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitchen curses</span></label></li><li class="blacklistEle hidden"><label data-title="School of sorcery&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">School of sorcery</span></label></li><li class="blacklistEle hidden"><label data-title="Dark formulas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dark formulas</span></label></li><li class="blacklistEle hidden"><label data-title="Banker grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Banker grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Priestess grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Priestess grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Witch grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Witch grandmas</span></label></li><li class="blacklistEle hidden"><label data-title="Tin of british tea biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Tin of british tea biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Box of macarons&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Box of macarons</span></label></li><li class="blacklistEle hidden"><label data-title="Box of brand biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Box of brand biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Pure black chocolate cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pure black chocolate cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Pure white chocolate cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pure white chocolate cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Ladyfingers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ladyfingers</span></label></li><li class="blacklistEle hidden"><label data-title="Tuiles&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Tuiles</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate-stuffed biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate-stuffed biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Checker cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Checker cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Butter cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Cream cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cream cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Permanent upgrade slot I&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Permanent upgrade slot I</span></label></li><li class="blacklistEle hidden"><label data-title="Permanent upgrade slot II&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Permanent upgrade slot II</span></label></li><li class="blacklistEle hidden"><label data-title="Permanent upgrade slot III&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Permanent upgrade slot III</span></label></li><li class="blacklistEle hidden"><label data-title="Permanent upgrade slot IV&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Permanent upgrade slot IV</span></label></li><li class="blacklistEle hidden"><label data-title="Permanent upgrade slot V&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Permanent upgrade slot V</span></label></li><li class="blacklistEle hidden"><label data-title="Starspawn&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Starspawn</span></label></li><li class="blacklistEle hidden"><label data-title="Starsnow&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Starsnow</span></label></li><li class="blacklistEle hidden"><label data-title="Starterror&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Starterror</span></label></li><li class="blacklistEle hidden"><label data-title="Starlove&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Starlove</span></label></li><li class="blacklistEle hidden"><label data-title="Startrade&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Startrade</span></label></li><li class="blacklistEle hidden"><label data-title="Angels&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Angels</span></label></li><li class="blacklistEle hidden"><label data-title="Archangels&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Archangels</span></label></li><li class="blacklistEle hidden"><label data-title="Virtues&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Virtues</span></label></li><li class="blacklistEle hidden"><label data-title="Dominions&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dominions</span></label></li><li class="blacklistEle hidden"><label data-title="Cherubim&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cherubim</span></label></li><li class="blacklistEle hidden"><label data-title="Seraphim&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Seraphim</span></label></li><li class="blacklistEle hidden"><label data-title="God&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">God</span></label></li><li class="blacklistEle hidden"><label data-title="Twin Gates of Transcendence&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Twin Gates of Transcendence</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly luck&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly luck</span></label></li><li class="blacklistEle hidden"><label data-title="Lasting fortune&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lasting fortune</span></label></li><li class="blacklistEle hidden"><label data-title="Decisive fate&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Decisive fate</span></label></li><li class="blacklistEle hidden"><label data-title="Divine discount&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Divine discount</span></label></li><li class="blacklistEle hidden"><label data-title="Divine sales&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Divine sales</span></label></li><li class="blacklistEle hidden"><label data-title="Divine bakeries&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Divine bakeries</span></label></li><li class="blacklistEle hidden"><label data-title="Starter kit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Starter kit</span></label></li><li class="blacklistEle hidden"><label data-title="Starter kitchen&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Starter kitchen</span></label></li><li class="blacklistEle hidden"><label data-title="Halo gloves&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Halo gloves</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten angels&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten angels</span></label></li><li class="blacklistEle hidden"><label data-title="Unholy bait&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Unholy bait</span></label></li><li class="blacklistEle hidden"><label data-title="Sacrilegious corruption&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sacrilegious corruption</span></label></li><li class="blacklistEle hidden"><label data-title="Xtreme walkers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Xtreme walkers</span></label></li><li class="blacklistEle hidden"><label data-title="Fudge fungus&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fudge fungus</span></label></li><li class="blacklistEle hidden"><label data-title="Planetsplitters&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Planetsplitters</span></label></li><li class="blacklistEle hidden"><label data-title="Cyborg workforce&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cyborg workforce</span></label></li><li class="blacklistEle hidden"><label data-title="Way of the wallet&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Way of the wallet</span></label></li><li class="blacklistEle hidden"><label data-title="Creation myth&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Creation myth</span></label></li><li class="blacklistEle hidden"><label data-title="Cookiemancy&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cookiemancy</span></label></li><li class="blacklistEle hidden"><label data-title="Dyson sphere&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dyson sphere</span></label></li><li class="blacklistEle hidden"><label data-title="Theory of atomic fluidity&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Theory of atomic fluidity</span></label></li><li class="blacklistEle hidden"><label data-title="End of times back-up plan&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">End of times back-up plan</span></label></li><li class="blacklistEle hidden"><label data-title="Great loop hypothesis&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Great loop hypothesis</span></label></li><li class="blacklistEle hidden"><label data-title="The Pulse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The Pulse</span></label></li><li class="blacklistEle hidden"><label data-title="Lux sanctorum&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lux sanctorum</span></label></li><li class="blacklistEle hidden"><label data-title="The Unbridling&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The Unbridling</span></label></li><li class="blacklistEle hidden"><label data-title="Wheat triffids&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wheat triffids</span></label></li><li class="blacklistEle hidden"><label data-title="Canola oil wells&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Canola oil wells</span></label></li><li class="blacklistEle hidden"><label data-title="78-hour days&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">78-hour days</span></label></li><li class="blacklistEle hidden"><label data-title="The stuff rationale&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The stuff rationale</span></label></li><li class="blacklistEle hidden"><label data-title="Theocracy&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Theocracy</span></label></li><li class="blacklistEle hidden"><label data-title="Rabbit trick&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Rabbit trick</span></label></li><li class="blacklistEle hidden"><label data-title="The final frontier&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The final frontier</span></label></li><li class="blacklistEle hidden"><label data-title="Beige goo&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Beige goo</span></label></li><li class="blacklistEle hidden"><label data-title="Maddening chants&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Maddening chants</span></label></li><li class="blacklistEle hidden"><label data-title="Cookietopian moments of maybe&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cookietopian moments of maybe</span></label></li><li class="blacklistEle hidden"><label data-title="Some other super-tiny fundamental particle? Probably?&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Some other super-tiny fundamental particle? Probably?</span></label></li><li class="blacklistEle hidden"><label data-title="Reverse shadows&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reverse shadows</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten accountants&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten accountants</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten specialists&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten specialists</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten experts&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten experts</span></label></li><li class="blacklistEle hidden"><label data-title="How to bake your dragon&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">How to bake your dragon</span></label></li><li class="blacklistEle hidden"><label data-title="A crumbly egg&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">A crumbly egg</span></label></li><li class="blacklistEle hidden"><label data-title="Chimera&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chimera</span></label></li><li class="blacklistEle hidden"><label data-title="Tin of butter cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Tin of butter cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Golden switch&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden switch</span></label></li><li class="blacklistEle hidden"><label data-title="Classic dairy selection&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Classic dairy selection</span></label></li><li class="blacklistEle hidden"><label data-title="Fanciful dairy selection&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fanciful dairy selection</span></label></li><li class="blacklistEle hidden"><label data-title="Dragon cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dragon cookie</span></label></li><li class="blacklistEle hidden"><label data-title="Golden switch [off]&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden switch [off]</span></label></li><li class="blacklistEle hidden"><label data-title="Golden switch [on]&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden switch [on]</span></label></li><li class="blacklistEle hidden"><label data-title="Milk selector&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Milk selector</span></label></li><li class="blacklistEle hidden"><label data-title="Milk chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Milk chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Dark chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dark chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="White chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">White chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Ruby chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ruby chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Gingersnaps&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gingersnaps</span></label></li><li class="blacklistEle hidden"><label data-title="Cinnamon cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cinnamon cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Vanity cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Vanity cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Cigars&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cigars</span></label></li><li class="blacklistEle hidden"><label data-title="Pinwheel cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pinwheel cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Fudge squares&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fudge squares</span></label></li><li class="blacklistEle hidden"><label data-title="Digits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Digits</span></label></li><li class="blacklistEle hidden"><label data-title="Butter horseshoes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter horseshoes</span></label></li><li class="blacklistEle hidden"><label data-title="Butter pucks&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter pucks</span></label></li><li class="blacklistEle hidden"><label data-title="Butter knots&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter knots</span></label></li><li class="blacklistEle hidden"><label data-title="Butter slabs&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter slabs</span></label></li><li class="blacklistEle hidden"><label data-title="Butter swirls&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter swirls</span></label></li><li class="blacklistEle hidden"><label data-title="Shortbread biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shortbread biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Millionaires' shortbreads&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Millionaires' shortbreads</span></label></li><li class="blacklistEle hidden"><label data-title="Caramel cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Caramel cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Belphegor&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Belphegor</span></label></li><li class="blacklistEle hidden"><label data-title="Mammon&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mammon</span></label></li><li class="blacklistEle hidden"><label data-title="Abaddon&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Abaddon</span></label></li><li class="blacklistEle hidden"><label data-title="Satan&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Satan</span></label></li><li class="blacklistEle hidden"><label data-title="Asmodeus&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Asmodeus</span></label></li><li class="blacklistEle hidden"><label data-title="Beelzebub&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Beelzebub</span></label></li><li class="blacklistEle hidden"><label data-title="Lucifer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lucifer</span></label></li><li class="blacklistEle hidden"><label data-title="Golden cookie alert sound&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden cookie alert sound</span></label></li><li class="blacklistEle hidden"><label data-title="Golden cookie sound selector&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Golden cookie sound selector</span></label></li><li class="blacklistEle hidden"><label data-title="Basic wallpaper assortment&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Basic wallpaper assortment</span></label></li><li class="blacklistEle hidden"><label data-title="Legacy&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Legacy</span></label></li><li class="blacklistEle hidden"><label data-title="Elder spice&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Elder spice</span></label></li><li class="blacklistEle hidden"><label data-title="Residual luck&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Residual luck</span></label></li><li class="blacklistEle hidden"><label data-title="Fantasteel mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fantasteel mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Nevercrack mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nevercrack mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Five-finger discount&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Five-finger discount</span></label></li><li class="blacklistEle hidden"><label data-title="Future almanacs&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Future almanacs</span></label></li><li class="blacklistEle hidden"><label data-title="Rain prayer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Rain prayer</span></label></li><li class="blacklistEle hidden"><label data-title="Seismic magic&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Seismic magic</span></label></li><li class="blacklistEle hidden"><label data-title="Asteroid mining&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Asteroid mining</span></label></li><li class="blacklistEle hidden"><label data-title="Quantum electronics&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Quantum electronics</span></label></li><li class="blacklistEle hidden"><label data-title="Temporal overclocking&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Temporal overclocking</span></label></li><li class="blacklistEle hidden"><label data-title="Contracts from beyond&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Contracts from beyond</span></label></li><li class="blacklistEle hidden"><label data-title="Printing presses&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Printing presses</span></label></li><li class="blacklistEle hidden"><label data-title="Paganism&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Paganism</span></label></li><li class="blacklistEle hidden"><label data-title="God particle&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">God particle</span></label></li><li class="blacklistEle hidden"><label data-title="Arcane knowledge&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Arcane knowledge</span></label></li><li class="blacklistEle hidden"><label data-title="Magical botany&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Magical botany</span></label></li><li class="blacklistEle hidden"><label data-title="Fossil fuels&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fossil fuels</span></label></li><li class="blacklistEle hidden"><label data-title="Shipyards&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shipyards</span></label></li><li class="blacklistEle hidden"><label data-title="Primordial ores&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Primordial ores</span></label></li><li class="blacklistEle hidden"><label data-title="Gold fund&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gold fund</span></label></li><li class="blacklistEle hidden"><label data-title="Infernal crops&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Infernal crops</span></label></li><li class="blacklistEle hidden"><label data-title="Abysmal glimmer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Abysmal glimmer</span></label></li><li class="blacklistEle hidden"><label data-title="Relativistic parsec-skipping&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Relativistic parsec-skipping</span></label></li><li class="blacklistEle hidden"><label data-title="Primeval glow&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Primeval glow</span></label></li><li class="blacklistEle hidden"><label data-title="Extra physics funding&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Extra physics funding</span></label></li><li class="blacklistEle hidden"><label data-title="Chemical proficiency&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chemical proficiency</span></label></li><li class="blacklistEle hidden"><label data-title="Light magic&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Light magic</span></label></li><li class="blacklistEle hidden"><label data-title="Mystical energies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mystical energies</span></label></li><li class="blacklistEle hidden"><label data-title="Synergies Vol. I&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Synergies Vol. I</span></label></li><li class="blacklistEle hidden"><label data-title="Synergies Vol. II&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Synergies Vol. II</span></label></li><li class="blacklistEle hidden"><label data-title="Heavenly cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heavenly cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Wrinkly cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wrinkly cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Distilled essence of redoubled luck&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Distilled essence of redoubled luck</span></label></li><li class="blacklistEle hidden"><label data-title="Occult obstruction&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Occult obstruction</span></label></li><li class="blacklistEle hidden"><label data-title="Glucose-charged air&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Glucose-charged air</span></label></li><li class="blacklistEle hidden"><label data-title="Lavender chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lavender chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Lombardia cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lombardia cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Bastenaken cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bastenaken cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Pecan sandies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pecan sandies</span></label></li><li class="blacklistEle hidden"><label data-title="Moravian spice cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Moravian spice cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Anzac biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Anzac biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Buttercakes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Buttercakes</span></label></li><li class="blacklistEle hidden"><label data-title="Ice cream sandwiches&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ice cream sandwiches</span></label></li><li class="blacklistEle hidden"><label data-title="Stevia Caelestis&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Stevia Caelestis</span></label></li><li class="blacklistEle hidden"><label data-title="Diabetica Daemonicus&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Diabetica Daemonicus</span></label></li><li class="blacklistEle hidden"><label data-title="Sucralosia Inutilis&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sucralosia Inutilis</span></label></li><li class="blacklistEle hidden"><label data-title="Lucky digit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lucky digit</span></label></li><li class="blacklistEle hidden"><label data-title="Lucky number&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lucky number</span></label></li><li class="blacklistEle hidden"><label data-title="Lucky payout&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lucky payout</span></label></li><li class="blacklistEle hidden"><label data-title="Background selector&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Background selector</span></label></li><li class="blacklistEle hidden"><label data-title="Lucky grandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lucky grandmas</span></label></li><li class="blacklistEle"><label data-title="Your lucky cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Your lucky cookie</span></label></li><li class="blacklistEle"><label data-title="&quot;All Bets Are Off&quot; magic coin&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">"All Bets Are Off" magic coin</span></label></li><li class="blacklistEle hidden"><label data-title="Winning lottery ticket&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Winning lottery ticket</span></label></li><li class="blacklistEle hidden"><label data-title="Four-leaf clover field&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Four-leaf clover field</span></label></li><li class="blacklistEle hidden"><label data-title="A recipe book about books&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">A recipe book about books</span></label></li><li class="blacklistEle hidden"><label data-title="Leprechaun village&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Leprechaun village</span></label></li><li class="blacklistEle hidden"><label data-title="Improbability drive&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Improbability drive</span></label></li><li class="blacklistEle hidden"><label data-title="Antisuperstistronics&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Antisuperstistronics</span></label></li><li class="blacklistEle hidden"><label data-title="Gemmed talismans&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gemmed talismans</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten consultants&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten consultants</span></label></li><li class="blacklistEle hidden"><label data-title="Birthday cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Birthday cookie</span></label></li><li class="blacklistEle hidden"><label data-title="Armythril mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Armythril mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Reverse dementia&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reverse dementia</span></label></li><li class="blacklistEle hidden"><label data-title="Humane pesticides&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Humane pesticides</span></label></li><li class="blacklistEle hidden"><label data-title="Mole people&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mole people</span></label></li><li class="blacklistEle hidden"><label data-title="Machine learning&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Machine learning</span></label></li><li class="blacklistEle hidden"><label data-title="Edible money&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Edible money</span></label></li><li class="blacklistEle hidden"><label data-title="Sick rap prayers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sick rap prayers</span></label></li><li class="blacklistEle hidden"><label data-title="Deluxe tailored wands&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Deluxe tailored wands</span></label></li><li class="blacklistEle hidden"><label data-title="Autopilot&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Autopilot</span></label></li><li class="blacklistEle hidden"><label data-title="The advent of chemistry&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The advent of chemistry</span></label></li><li class="blacklistEle hidden"><label data-title="The real world&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The real world</span></label></li><li class="blacklistEle hidden"><label data-title="Second seconds&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Second seconds</span></label></li><li class="blacklistEle hidden"><label data-title="Quantum comb&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Quantum comb</span></label></li><li class="blacklistEle hidden"><label data-title="Crystal mirrors&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Crystal mirrors</span></label></li><li class="blacklistEle hidden"><label data-title="Bunnypedes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bunnypedes</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten assistants to the regional manager&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten assistants to the regional manager</span></label></li><li class="blacklistEle hidden"><label data-title="Charm quarks&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Charm quarks</span></label></li><li class="blacklistEle hidden"><label data-title="Pink biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pink biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Whole-grain cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Whole-grain cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Candy cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Candy cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Big chip cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Big chip cookies</span></label></li><li class="blacklistEle hidden"><label data-title="One chip cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">One chip cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Sugar baking&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar baking</span></label></li><li class="blacklistEle hidden"><label data-title="Sugar craving&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar craving</span></label></li><li class="blacklistEle hidden"><label data-title="Sugar aging process&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar aging process</span></label></li><li class="blacklistEle hidden"><label data-title="Sugar frenzy&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar frenzy</span></label></li><li class="blacklistEle hidden"><label data-title="Sprinkles cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sprinkles cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Peanut butter blossoms&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Peanut butter blossoms</span></label></li><li class="blacklistEle hidden"><label data-title="No-bake cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">No-bake cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Florentines&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Florentines</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate crinkles&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate crinkles</span></label></li><li class="blacklistEle hidden"><label data-title="Maple cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Maple cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Turbo-charged soil&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Turbo-charged soil</span></label></li><li class="blacklistEle hidden"><label data-title="Technobsidian mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Technobsidian mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Plasmarble mouse&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Plasmarble mouse</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten marketeers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten marketeers</span></label></li><li class="blacklistEle hidden"><label data-title="Festivity loops&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Festivity loops</span></label></li><li class="blacklistEle hidden"><label data-title="Persian rice cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Persian rice cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Norwegian cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Norwegian cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Crispy rice cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Crispy rice cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Ube cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ube cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Butterscotch cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butterscotch cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Speculaas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Speculaas</span></label></li><li class="blacklistEle hidden"><label data-title="Elderwort biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Elderwort biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Bakeberry cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bakeberry cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Duketater cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Duketater cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Green yeast digestives&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Green yeast digestives</span></label></li><li class="blacklistEle hidden"><label data-title="Fern tea&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fern tea</span></label></li><li class="blacklistEle hidden"><label data-title="Ichor syrup&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ichor syrup</span></label></li><li class="blacklistEle hidden"><label data-title="Wheat slims&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wheat slims</span></label></li><li class="blacklistEle hidden"><label data-title="Synthetic chocolate green honey butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Synthetic chocolate green honey butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Royal raspberry chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Royal raspberry chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Ultra-concentrated high-energy chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Ultra-concentrated high-energy chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Timeproof hair dyes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Timeproof hair dyes</span></label></li><li class="blacklistEle hidden"><label data-title="Barnstars&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Barnstars</span></label></li><li class="blacklistEle hidden"><label data-title="Mine canaries&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mine canaries</span></label></li><li class="blacklistEle hidden"><label data-title="Brownie point system&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Brownie point system</span></label></li><li class="blacklistEle hidden"><label data-title="Grand supercycles&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Grand supercycles</span></label></li><li class="blacklistEle hidden"><label data-title="Psalm-reading&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Psalm-reading</span></label></li><li class="blacklistEle hidden"><label data-title="Immobile spellcasting&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Immobile spellcasting</span></label></li><li class="blacklistEle hidden"><label data-title="Restaurants at the end of the universe&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Restaurants at the end of the universe</span></label></li><li class="blacklistEle hidden"><label data-title="On second thought&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">On second thought</span></label></li><li class="blacklistEle hidden"><label data-title="Dimensional garbage gulper&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Dimensional garbage gulper</span></label></li><li class="blacklistEle hidden"><label data-title="Additional clock hands&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Additional clock hands</span></label></li><li class="blacklistEle hidden"><label data-title="Baking Nobel prize&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Baking Nobel prize</span></label></li><li class="blacklistEle hidden"><label data-title="Reverse theory of light&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reverse theory of light</span></label></li><li class="blacklistEle hidden"><label data-title="Revised probabilistics&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Revised probabilistics</span></label></li><li class="blacklistEle hidden"><label data-title="Kitten analysts&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Kitten analysts</span></label></li><li class="blacklistEle hidden"><label data-title="Eye of the wrinkler&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Eye of the wrinkler</span></label></li><li class="blacklistEle hidden"><label data-title="Inspired checklist&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Inspired checklist</span></label></li><li class="blacklistEle hidden"><label data-title="Pure pitch-black chocolate butter biscuit&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Pure pitch-black chocolate butter biscuit</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate oatmeal cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate oatmeal cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Molasses cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Molasses cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Biscotti&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Biscotti</span></label></li><li class="blacklistEle hidden"><label data-title="Waffle cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Waffle cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Almond cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Almond cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Hazelnut cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Hazelnut cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Walnut cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Walnut cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Label printer&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Label printer</span></label></li><li class="blacklistEle hidden"><label data-title="Good manners&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Good manners</span></label></li><li class="blacklistEle hidden"><label data-title="Lindworms&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lindworms</span></label></li><li class="blacklistEle hidden"><label data-title="Bore again&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bore again</span></label></li><li class="blacklistEle hidden"><label data-title="&quot;Volunteer&quot; interns&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">"Volunteer" interns</span></label></li><li class="blacklistEle hidden"><label data-title="Rules of acquisition&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Rules of acquisition</span></label></li><li class="blacklistEle hidden"><label data-title="War of the gods&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">War of the gods</span></label></li><li class="blacklistEle hidden"><label data-title="Electricity&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Electricity</span></label></li><li class="blacklistEle hidden"><label data-title="Universal alphabet&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Universal alphabet</span></label></li><li class="blacklistEle hidden"><label data-title="Public betterment&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Public betterment</span></label></li><li class="blacklistEle hidden"><label data-title="Embedded microportals&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Embedded microportals</span></label></li><li class="blacklistEle hidden"><label data-title="Nostalgia&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nostalgia</span></label></li><li class="blacklistEle hidden"><label data-title="The definite molecule&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The definite molecule</span></label></li><li class="blacklistEle hidden"><label data-title="Light capture measures&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Light capture measures</span></label></li><li class="blacklistEle hidden"><label data-title="0-sided dice&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">0-sided dice</span></label></li><li class="blacklistEle hidden"><label data-title="Heralds&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Heralds</span></label></li><li class="blacklistEle hidden"><label data-title="Metagrandmas&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Metagrandmas</span></label></li><li class="blacklistEle"><label data-title="Metabakeries&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Metabakeries</span></label></li><li class="blacklistEle"><label data-title="Mandelbrown sugar&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mandelbrown sugar</span></label></li><li class="blacklistEle hidden"><label data-title="Fractoids&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Fractoids</span></label></li><li class="blacklistEle hidden"><label data-title="Nested universe theory&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nested universe theory</span></label></li><li class="blacklistEle hidden"><label data-title="Menger sponge cake&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Menger sponge cake</span></label></li><li class="blacklistEle hidden"><label data-title="One particularly good-humored cow&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">One particularly good-humored cow</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate ouroboros&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate ouroboros</span></label></li><li class="blacklistEle hidden"><label data-title="Nested&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nested</span></label></li><li class="blacklistEle hidden"><label data-title="Space-filling fibers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Space-filling fibers</span></label></li><li class="blacklistEle hidden"><label data-title="Endless book of prose&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Endless book of prose</span></label></li><li class="blacklistEle hidden"><label data-title="The set of all sets&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">The set of all sets</span></label></li><li class="blacklistEle hidden"><label data-title="Recursive mirrors&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Recursive mirrors</span></label></li><li class="blacklistEle hidden"><label data-title="Mice clicking mice&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mice clicking mice</span></label></li><li class="blacklistEle hidden"><label data-title="Custard creams&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Custard creams</span></label></li><li class="blacklistEle hidden"><label data-title="Bourbon biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Bourbon biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Keepsakes&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Keepsakes</span></label></li><li class="blacklistEle hidden"><label data-title="Mini-cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Mini-cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Sugar crystal cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Sugar crystal cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Box of maybe cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Box of maybe cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Box of not cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Box of not cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Box of pastries&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Box of pastries</span></label></li><li class="blacklistEle hidden"><label data-title="Profiteroles&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Profiteroles</span></label></li><li class="blacklistEle hidden"><label data-title="Jelly donut&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Jelly donut</span></label></li><li class="blacklistEle hidden"><label data-title="Glazed donut&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Glazed donut</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate cake&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate cake</span></label></li><li class="blacklistEle hidden"><label data-title="Strawberry cake&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Strawberry cake</span></label></li><li class="blacklistEle hidden"><label data-title="Apple pie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Apple pie</span></label></li><li class="blacklistEle hidden"><label data-title="Lemon meringue pie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lemon meringue pie</span></label></li><li class="blacklistEle hidden"><label data-title="Butter croissant&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Butter croissant</span></label></li><li class="blacklistEle hidden"><label data-title="Cookie dough&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cookie dough</span></label></li><li class="blacklistEle hidden"><label data-title="Burnt cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Burnt cookie</span></label></li><li class="blacklistEle hidden"><label data-title="A chocolate chip cookie but with the chips picked off for some reason&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">A chocolate chip cookie but with the chips picked off for some reason</span></label></li><li class="blacklistEle hidden"><label data-title="Flavor text cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Flavor text cookie</span></label></li><li class="blacklistEle hidden"><label data-title="High-definition cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">High-definition cookie</span></label></li><li class="blacklistEle hidden"><label data-title="Toast&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Toast</span></label></li><li class="blacklistEle hidden"><label data-title="Peanut butter &amp; jelly&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Peanut butter &amp; jelly</span></label></li><li class="blacklistEle hidden"><label data-title="Wookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Wookies</span></label></li><li class="blacklistEle hidden"><label data-title="Cheeseburger&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cheeseburger</span></label></li><li class="blacklistEle hidden"><label data-title="One lone chocolate chip&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">One lone chocolate chip</span></label></li><li class="blacklistEle hidden"><label data-title="Genius accounting&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Genius accounting</span></label></li><li class="blacklistEle hidden"><label data-title="Shimmering veil&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shimmering veil</span></label></li><li class="blacklistEle hidden"><label data-title="Shimmering veil [off]&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shimmering veil [off]</span></label></li><li class="blacklistEle hidden"><label data-title="Shimmering veil [on]&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Shimmering veil [on]</span></label></li><li class="blacklistEle hidden"><label data-title="Whoopie pies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Whoopie pies</span></label></li><li class="blacklistEle hidden"><label data-title="Caramel wafer biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Caramel wafer biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate chip mocha cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate chip mocha cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Earl Grey cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Earl Grey cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Corn syrup cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Corn syrup cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Icebox cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Icebox cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Graham crackers&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Graham crackers</span></label></li><li class="blacklistEle hidden"><label data-title="Hardtack&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Hardtack</span></label></li><li class="blacklistEle hidden"><label data-title="Cornflake cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cornflake cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Tofu cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Tofu cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Gluten-free cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Gluten-free cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Russian bread cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Russian bread cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Lebkuchen&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Lebkuchen</span></label></li><li class="blacklistEle hidden"><label data-title="Aachener Printen&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Aachener Printen</span></label></li><li class="blacklistEle hidden"><label data-title="Canistrelli&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Canistrelli</span></label></li><li class="blacklistEle hidden"><label data-title="Nice biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nice biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="French pure butter cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">French pure butter cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Petit beurre&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Petit beurre</span></label></li><li class="blacklistEle hidden"><label data-title="Nanaimo bars&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Nanaimo bars</span></label></li><li class="blacklistEle hidden"><label data-title="Berger cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Berger cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Chinsuko&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chinsuko</span></label></li><li class="blacklistEle hidden"><label data-title="Panda koala biscuits&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Panda koala biscuits</span></label></li><li class="blacklistEle hidden"><label data-title="Putri salju&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Putri salju</span></label></li><li class="blacklistEle hidden"><label data-title="Milk cookies&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Milk cookies</span></label></li><li class="blacklistEle hidden"><label data-title="Cookie crumbs&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cookie crumbs</span></label></li><li class="blacklistEle hidden"><label data-title="Chocolate chip cookie&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Chocolate chip cookie</span></label></li><li class="blacklistEle hidden"><label data-title="Cosmic beginner's luck&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Cosmic beginner's luck</span></label></li><li class="blacklistEle hidden"><label data-title="Reinforced membrane&amp;#10;Check this to blacklist it."><input type="checkbox" tabindex="5"> <span class="name">Reinforced membrane</span></label></li></ul>  </div> </div> <br></form>`};
myWindow.location = window.location;
myWindow.document = window.document;

var myDiv = window.document.createElement('div');
myDiv.innerHTML = myWindow.skeleton;
window.document.body.appendChild(myDiv);

$('#topBar').children().each((idx, child) => {
	var $child = $(child);
	if (idx !== 0 && $child.attr('id') !== 'heralds') {
		$child.css('display', 'none');
	}
});

var prevCookiesPS = null;
setInterval(() => {
	if (!window.Game || !window.Game.cookiesPs || !window.Game.WriteSave) return;
	if (window.Game.cookiesPs !== prevCookiesPS) {
		console.log('Recommended update triggered');
		prevCookiesPS = window.Game.cookiesPs;
		myWindow.Game.importSave(window.Game.WriteSave(1));
	}
}, 100);

/* global Base64 */
/* eslint no-unused-vars: ["error", {"vars": "local"}] */

function utf8_to_b64(str) {
	try {
		return Base64.encode(unescape(encodeURIComponent(str)));
	} catch (err) {
		return "";
	}
}

function b64_to_utf8(str) {
	try {
		return decodeURIComponent(escape(Base64.decode(str)));
	} catch (err) {
		// alert("There was a problem while decrypting from base64. (" + err + ")");
		console.error(err);
		return "";
	}
}

function UncompressBin(num) { //uncompress a number like 54 to a sequence like [0, 1, 1, 0, 1, 0].
	return num.toString(2).slice(1, -1).split("").reverse();
}

function UncompressLargeBin(arr) {
	var arr2 = arr.split(";");
	var bits = [];
	for (var i in arr2) {
		bits.push(UncompressBin(parseInt(arr2[i], 10)));
	}
	arr2 = [];
	for (i in bits) {
		for (var ii in bits[i]) { arr2.push(bits[i][ii]); }
	}
	return arr2;
}

function unpack(str) {
	var bytes = [];
	var len = str.length;
	for (var i = 0, n = len; i < n; i++) {
		var char = str.charCodeAt(i);
		bytes.push(char >>> 8, char & 0xFF);
	}
	return bytes;
}

//modified from http://www.smashingmagazine.com/2011/10/19/optimizing-long-lists-of-yesno-values-with-javascript/
function pack2(/* string */ values) {
	var chunks = values.match(/.{1,14}/g);
	var packed = "";
	for (var i = 0; i < chunks.length; i++) {
		var chunk = chunks[i];
		//add dummy data to prevent packing to "|"
		if (chunk === "111100") { chunk += "00"; }
		packed += String.fromCharCode(parseInt("1" + chunk, 2));
	}
	return packed;
}

// function pack3(values) {
// 	//too many save corruptions, darn it to heck
// 	return values;
// }

function unpack2(/* string */ packed) {
	var values = "";
	for (var i = 0; i < packed.length; i++) {
		values += packed.charCodeAt(i).toString(2).substring(1);
	}
	return values;
}

//like str.split("|") but works around game's pack2() potentially outputting a "|",
//  by skipping over first pipe character of a pair in fields where pack2 is used
//  (the second field is intentionally empty as of this writing so still have to split that)
function splitSave(str) {
	var arr = [];
	do {
		var index = str.indexOf("|");
		if (index > -1 && arr.length > 2 && str.charAt(index + 1) === "|") {
			index++;
		}
		arr.push(str.slice(0, index > -1 ? index : undefined));
		str = str.slice(index + 1);
	} while (index > -1);
	return arr;
}

function decodeSave(str) {
	return b64_to_utf8(unescape(str).split("!END!")[0]);
}

function encodeSave(str) {
	return escape(utf8_to_b64(str) + "!END!");
}

myWindow.byId = function byId(id) {
	const elementById = document.getElementById(id);
	if (!elementById) {
		console.log('ID not found:', id)
	}
	return elementById;
};

//seeded random function, courtesy of http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
//out of IIFE because strict mode
//eslint-disable-next-line
(function(a, b, c, d, e, f) {
	function k(a) {
		var b, c = a.length, e = this, f = 0, g = e.i = e.j = 0, h = e.S = [];
		for (c || (a = [c++]); d > f;) h[f] = f++;
		for (f = 0; d > f; f++) h[f] = h[g = j & g + a[f % c] + (b = h[f])], h[g] = b;
		(e.g = function(a) {
			for (var b, c = 0, f = e.i, g = e.j, h = e.S; a--;) b = h[f = j & f + 1], c = c * d + h[j & (h[f] = h[g = j & g + b]) + (h[g] = b)];
			return e.i = f, e.j = g, c
		})(d)
	}

	function l(a, b) {
		var e, c = [], d = (typeof a)[0];
		if (b && "o" == d) for (e in a) try {c.push(l(a[e], b - 1))} catch (f) {}
		return c.length ? c : "s" == d ? a : a + "\0"
	}

	function m(a, b) {
		for (var d, c = a + "", e = 0; c.length > e;) b[j & e] = j & (d ^= 19 * b[j & e]) + c.charCodeAt(e++);
		return o(b)
	}

	function n(c) {
		try {return a.crypto.getRandomValues(c = new Uint8Array(d)), o(c)} catch (e) {
			return [
				+new Date,
				a,
				a.navigator.plugins,
				a.screen,
				o(b)
			]
		}
	}

	function o(a) {return String.fromCharCode.apply(0, a)}

	var g = c.pow(d, e), h = c.pow(2, f), i = 2 * h, j = d - 1;
	c.seedrandom = function(a, f) {
		var j = [], p = m(l(f ? [a, o(b)] : 0 in arguments ? a : n(), 3), j), q = new k(j);
		return m(o(q.S), b), c.random = function() {
			for (var a = q.g(e), b = g, c = 0; h > a;) a = (a + c) * d, b *= d, c = q.g(1);
			for (; a >= i;) a /= 2, b /= 2, c >>>= 1;
			return (a + c) / b
		}, p
	}, m(c.random(), b)
})(window, [], Math, 256, 6, 52);

(function(window, $) {
	"use strict";

	var document = window.document;
	var byId = window.byId;

	//#region definitions

	var Game = {
		version: 2.019,
		mainJS: "2.054",
		beta: window.location.href.indexOf("/beta") > -1,

		firstRun: true,

		fps: 30,

		ObjectPriceIncrease: 1.15, //price increase factor for buildings
		SpecialGrandmaUnlock: 15, //when farmer/worker/miner/etc. grandmas upgrades unlock
		maxClicksPs: 250, //maximum clicks per second

		Objects: {}, //buildings
		ObjectsById: [],
		ObjectsByGroup: {},
		ObjectsOwned: 0,

		Upgrades: {},
		UpgradesById: [],
		UpgradesByPool: {},
		UpgradesByGroup: {},
		UpgradesOwned: 0,
		numCountedUpgrades: 0,
		maxCountedUpgrades: 0,

		UpgradeOrder: [], //list of upgrades sorted by current settings

		Achievements: {},
		AchievementsById: [],
		AchievementsByPool: {},
		AchievementsByGroup: {},
		AchievementsOwned: 0,
		AchievementsTotal: 0,

		defaultSeason: "",
		season: "",
		seasons: {},
		seasonTriggerBasePrice: 1000000000,
		seasonUses: 0,

		pledges: 0,
		ascensionMode: 0,
		sellMultiplier: 0.5,
		startDate: Date.now(), //used for calculating Century egg stuff
		CenturyEggBoost: 1,
		objectGodMult: 1,

		numGoldenCookies: 0,

		ObjectPriceMultArray: [], //used for Object price caches
		UpgradePriceMultArray: [],

		heralds: 0,

		heavenlyPower: 1, //% cps bonus per prestige level
		cookiesPs: 0,
		cookiesPerClick: 0,
		cookiesPsPlusClicks: 0,
		globalCpsMult: 1,
		rawCookiesPs: 0,
		unbuffedCookiesPs: 0,
		prestige: 0,
		cookiesBaked: 0,

		buildingBuyInterval: 1,

		santa: {},
		santaLevel: 0,
		santaLevels: [
			"Festive test tube", "Festive ornament", "Festive wreath", "Festive tree", "Festive present",
			"Festive elf fetus", "Elf toddler", "Elfling", "Young elf", "Bulky elf", "Nick", "Santa Claus", "Elder Santa", "True Santa", "Final Claus"
		],

		dragonLevel: 0,
		dragonAura: 0,
		dragonAura2: 0,
		maxWrinklers: 10,

		minCumulative: 0, //minimum cookies needed for everything (see getMinCumulative method)
		minCumulativeOffset: 0, //used to try to prevent minCumulative from being excessively wrong large due to saves from old game versions
		permanentUpgrades: [-1, -1, -1, -1, -1], //used for calculating min cumulative
		includeDragonSacrifices: true, //whether to include the cost of sacrificing buildings to train Krumblor (if relevant)

		Buffs: {},
		BuffTypes: [],
		BuffTypesByName: {},

		lumps: 0,

		effs: {},

		pantheon: {
			gods: {},
			godsById: [],
			slot: [-1, -1, -1],
			slotNames: ["Diamond", "Ruby", "Jade"]
		},

		garden: {
			plants: {},
			plantsById: [],
			numPlants: 0,
			seedSelected: -1,

			soils: {},
			soilsById: [],

			plot: [],
			plotBoost: [],
			plotLimits: [],

			effs: {},
			effsData: {},

			tileSize: 40,

			stepT: 1,
			soil: 0
		},

		Milks: [
			{
				name: "Rank I - Plain milk",
				icon: [1, 8]
			},
			{
				name: "Rank II - Chocolate milk",
				icon: [2, 8]
			},
			{
				name: "Rank III - Raspberry milk",
				icon: [3, 8]
			},
			{
				name: "Rank IV - Orange milk",
				icon: [4, 8]
			},
			{
				name: "Rank V - Caramel milk",
				icon: [5, 8]
			},
			{
				name: "Rank VI - Banana milk",
				icon: [6, 8]
			},
			{
				name: "Rank VII - Lime milk",
				icon: [7, 8]
			},
			{
				name: "Rank VIII - Blueberry milk",
				icon: [8, 8]
			},
			{
				name: "Rank IX - Strawberry milk",
				icon: [9, 8]
			},
			{
				name: "Rank X - Vanilla milk",
				icon: [10, 8]
			},
			{
				name: "Rank XI - Honey milk",
				icon: [21, 23]
			},
			{
				name: "Rank XII - Coffee milk",
				icon: [22, 23]
			},
			{
				name: "Rank XIII - Tea with a spot of milk",
				icon: [23, 23]
			},
			{
				name: "Rank XIV - Coconut milk",
				icon: [24, 23]
			},
			{
				name: "Rank XV - Cherry milk",
				icon: [25, 23]
			},
			{
				name: "Rank XVI - Spiced milk",
				icon: [26, 23]
			},
			{
				name: "Rank XVII - Maple milk",
				icon: [28, 23]
			}
		],

		temp: {
			ObjectsOwned: 0,
			UpgradesOwned: 0,
			UpgradesToCheck: [],
			kittensOwned: 0,
			AchievementsOwned: 0,
			LockedAchievements: [],

			cpsObj: {},

			prestige: 0,
			cookiesBaked: 0,
			santaLevel: 0,
			dragonAura: 0,
			dragonAura2: 0
		},

		storedImport: null,

		maxRecommend: 1,
		maxLookahead: 20,

		abbrOn: true, //whether to abbreviate with letters/words or with commas/exponential notation
		lockChecked: false, //sets behavior when clicking on upgrades, controlled by various checkboxes on the page
		predictiveMode: false, //prevents predictive calculations overwriting current state by changing which properties are read/written
		showDebug: false, //whether to always show debug upgrades
		altMode: false
	};
	window.Game = Game;
	Game.santaMax = Game.santaLevels.length - 1;
	Game.lastUpdateTime = Game.startDate;

	if (Game.beta) { document.title += " Beta"; }

	//#endregion definitions


	//#region methods

	Game.choose = function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	};

	Game.makeSeed = function() {
		var chars = "abcdefghijklmnopqrstuvwxyz".split("");
		var str = "";
		for (var i = 0; i < 5; i++) { str += Game.choose(chars); }
		return str;
	};

	Game.setSeed = function(seed) {
		Game.seed = seed || Game.makeSeed(); //each run has its own seed, used for deterministic random stuff
	};

	//sets obj[key] to an array if it is not already and pushes value to it
	Game.ArrayPush = function(obj, key, value) {
		if (!Array.isArray(obj[key])) {
			obj[key] = [];
		}
		obj[key].push(value);
	};

	//checks event for keys for alt mode
	Game.checkEventAltMode = function(event) {
		return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
	};

	var Abbreviations = [
		{
			short: "",
			long: ""
		},
		{
			short: "k",
			long: "thousand"
		},
		{
			short: "M",
			long: "million"
		},
		{
			short: "B",
			long: "billion"
		},
		{
			short: "T",
			long: "trillion"
		},
		{
			short: "Qa",
			long: "quadrillion"
		},
		{
			short: "Qi",
			long: "quintillion"
		},
		{
			short: "Sx",
			long: "sextillion"
		},
		{
			short: "Sp",
			long: "septillion"
		},
		{
			short: "Oc",
			long: "octillion"
		},
		{
			short: "No",
			long: "nonillion"
		}
	];

	var longPrefixes = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"];
	var longSuffixes = [
		"decillion",
		"vigintillion",
		"trigintillion",
		"quadragintillion",
		"quinquagintillion",
		"sexagintillion",
		"septuagintillion",
		"octogintillion",
		"nonagintillion"
	];
	var shortPrefixes = ["", "Un", "Do", "Tr", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
	var shortSuffixes = ["D", "V", "T", "Qa", "Qi", "Sx", "Sp", "O", "N"];
	for (var i = 0; i < longSuffixes.length; i++) {
		for (var j = 0; j < longPrefixes.length; j++) {
			Abbreviations.push({
				short: shortPrefixes[j] + shortSuffixes[i],
				long: longPrefixes[j] + longSuffixes[i]
			});
		}
	}
	Abbreviations[11].short = "Dc";
	var AbbreviationsMax = Abbreviations.length - 1;

	for (i = 1; i <= AbbreviationsMax; i++) {
		var abbr = Abbreviations[i];
		abbr.shortRgx = new RegExp("(\\-?[\\d\\.]+)\\s*(" + abbr.short + ")\\s*$", "i");
		abbr.longRgx = new RegExp("(\\-?[\\d\\.]+)\\s*(" + abbr.long + ")\\s*$", "i");
	}

	var commaRgx = /\B(?=(\d{3})+(?!\d))/g;
	Game.addCommas = function(what) {
		var x = what.toString().split(".");
		x[0] = x[0].replace(commaRgx, ",");
		return x.join(".");
	};

	Game.Beautify = function(what, floats) { //turns 9999999 into 9,999,999
		if (what === "---") { return what; }
		if (!isFinite(what)) { return "Infinity"; }
		var absWhat = Math.abs(what);
		if (absWhat > 1 && what.toString().indexOf("e") > -1) { return what.toString(); }
		floats = absWhat < 1000 && floats > 0 ? Math.pow(10, floats) : 1;
		what = Math.round(what * floats) / floats;
		return Game.addCommas(what);
	};

	Game.shortenNumber = function(value) {
		//if no scientific notation, return as is, else :
		//keep only the 5 first digits (plus dot), round the rest
		//may or may not work properly
		if (value >= 1000000 && isFinite(value)) {
			var num = value.toString();
			var ind = num.indexOf("e+");
			if (ind == -1) { return value; }
			var str = "";
			for (var i = 0; i < ind; i++) {
				str += (i < 6 ? num[i] : "0");
			}
			str += "e+";
			str += num.split("e+")[1];
			return parseFloat(str);
		}
		return value;
	};

	//abbreviates numbers
	Game.abbreviateNumber = function(num, floats, abbrlong) {
		if (num === "---") { return num; }
		if (!isFinite(num)) { return "Infinity"; }
		if (Math.abs(num) < 1000000) { return Game.Beautify(num, floats); }
		num = Number(num).toExponential().split("e+");
		var pow = Math.floor(num[1] / 3);
		if (pow > AbbreviationsMax) {
			num[0] = Math.round(num[0] * 1000) / 1000;
			return num.join("e+");
		}
		num[0] *= Math.pow(10, num[1] % 3);
		num[0] = Math.round(num[0] * 1000) / 1000;
		if (Math.abs(num[0]) >= 1000 && pow < AbbreviationsMax) {
			pow += 1;
			num[0] /= 1000;
		} else {
			num[0] = Game.addCommas(num[0]);
		}
		num[1] = Abbreviations[Math.min(pow, AbbreviationsMax)][abbrlong ? "long" : "short"];
		return num.join(" ");
	};

	Game.BeautifyAbbr = function(what, floats, abbrlong) {
		return Game.abbrOn ? Game.abbreviateNumber(what, floats, abbrlong) : Game.Beautify(what, floats);
	};

	Game.formatNumber = function(num, floats, abbrlong, extraStr, extraTitle) {
		var beaut = Game.Beautify(num, floats);
		var abbr = Game.abbreviateNumber(num, floats, abbrlong);
		var text = extraStr || "";
		var title = text + (extraTitle || "");
		if (beaut === abbr) {
			text = beaut + text;
		} else {
			text = (Game.abbrOn ? abbr : beaut) + text;
			var aLong = abbrlong || abbr === beaut ? abbr : Game.abbreviateNumber(num, floats, true);
			title = (Game.abbrOn ? beaut : aLong) + title;
		}
		return ("<span" + (title ? ' data-title="' + title.trim() + '">' : ">") + text + "</span>");
	};

	Game.formatTime = function(seconds) {
		if (isNaN(seconds) || !isFinite(seconds) || seconds <= 0) { return "---"; }
		seconds = Math.ceil(seconds);
		var hours = Math.floor(seconds / 3600);
		if (hours > 0) {
			hours = Game.BeautifyAbbr(hours) + (hours >= 1e7 ? " " : "") + "h ";
		} else {
			hours = "";
		}

		seconds %= 3600;
		var minutes = Math.floor(seconds / 60);
		minutes = minutes > 0 ? minutes + "m " : "";
		seconds %= 60;
		seconds = seconds > 0 ? seconds + "s" : "";
		return (hours + minutes + seconds).trim();
	};

	Game.getPlural = function(amount, singular, plural) {
		singular = singular || "";
		plural = plural || (singular + "s");
		return amount === 1 ? singular : plural;
	};

	Game.sayTime = function(time, detail) {
		//time is a value where one second is equal to Game.fps (30).
		//detail skips days when >1, hours when >2, minutes when >3 and seconds when >4.
		//if detail is -1, output something like "3 hours, 9 minutes, 48 seconds"
		if (time <= 0) { return ""; }
		var str = "";
		detail = detail || 0;
		time = Math.floor(time);

		if (detail == -1) {
			// var months = 0;
			var days = 0;
			var hours = 0;
			var minutes = 0;
			var seconds = 0;
			// if (time >= Game.fps * 60 * 60 * 24 * 30) { months = (Math.floor(time / (Game.fps * 60 * 60 * 24 * 30))); }
			if (time >= Game.fps * 60 * 60 * 24) { days = (Math.floor(time / (Game.fps * 60 * 60 * 24))); }
			if (time >= Game.fps * 60 * 60) { hours = (Math.floor(time / (Game.fps * 60 * 60))); }
			if (time >= Game.fps * 60) { minutes = (Math.floor(time / (Game.fps * 60))); }
			if (time >= Game.fps) { seconds = (Math.floor(time / (Game.fps))); }
			// days -= months * 30;
			hours -= days * 24;
			minutes -= hours * 60 + days * 24 * 60;
			seconds -= minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60;
			if (days > 10) { hours = 0; }
			if (days) {
				minutes = 0;
				seconds = 0;
			}
			if (hours) { seconds = 0; }
			var bits = [];
			// if (months > 0) { bits.push(Game.Beautify(months) + Game.getPlural(months, " month")); }
			if (days > 0) { bits.push(Game.Beautify(days) + Game.getPlural(days, " day")); }
			if (hours > 0) { bits.push(Game.Beautify(hours) + Game.getPlural(hours, " hour")); }
			if (minutes > 0) { bits.push(Game.Beautify(minutes) + Game.getPlural(minutes, " minute")); }
			if (seconds > 0) { bits.push(Game.Beautify(seconds) + Game.getPlural(seconds, " second")); }
			if (bits.length == 0) { str = "less than 1 second"; } else { str = bits.join(", "); }
		} else {
			/* if (time >= Game.fps * 60 * 60 * 24 * 30 * 2 && detail < 1) { str = Game.Beautify(Math.floor(time / (Game.fps * 60 * 60 * 24 * 30))) + " months"; }
		else if (time >= Game.fps * 60 * 60 * 24 * 30 && detail < 1) { str = "1 month"; }
		else */
			if (time >= Game.fps * 60 * 60 * 24 * 2 && detail < 2) {
				str = Game.Beautify(Math.floor(time / (Game.fps * 60 * 60 * 24))) + " days";
			} else if (time >= Game.fps * 60 * 60 * 24 && detail < 2) { str = "1 day"; } else if (time >= Game.fps * 60 * 60 * 2 && detail <
				3) { str = Game.Beautify(Math.floor(time / (Game.fps * 60 * 60))) + " hours"; } else if (time >= Game.fps * 60 * 60 && detail <
				3) { str = "1 hour"; } else if (time >= Game.fps * 60 * 2 && detail < 4) {
				str = Game.Beautify(Math.floor(time / (Game.fps * 60))) + " minutes";
			} else if (time >= Game.fps * 60 && detail < 4) { str = "1 minute"; } else if (time >= Game.fps * 2 && detail < 5) {
				str = Game.Beautify(Math.floor(time / (Game.fps))) + " seconds";
			} else if (time >= Game.fps && detail < 5) { str = "1 second"; } else { str = "less than 1 second"; }
		}
		return str;
	};

	Game.costDetails = function(cost, force) {
		if (!force && !Game.HasUpgrade("Genius accounting")) { return ""; }
		if (!cost || !isFinite(cost)) { return ""; }
		var priceInfo = "";
		var cps = Game.cookiesPs * (1 - Game.cpsSucked);
		if (!cps) { return ""; }
		// if (cost > Game.cookies) { priceInfo += "in " + Game.sayTime(((cost - Game.cookies) / cps + 1) * Game.fps) + "<br>"; }
		priceInfo += Game.sayTime((cost / cps + 1) * Game.fps) + " worth<br>";
		// priceInfo += Game.Beautify((cost / Game.cookies) * 100, 1) + "% of bank<br>";
		return ('<div class="costDetails">' + priceInfo + "</div>");
	};

	var cleanNumberRgx = /[^\deE\+\.\-]/g;
	Game.cleanNumber = function(str) {
		return str.replace(cleanNumberRgx, "");
	};

	var parseMatchRgx = /\s*(.*\d)(\D*)/;
	var parseReplaceRgx = /[^\d\.]/g;

	Game.parseNumber = function(num, min, max, floor) {
		if (typeof num === "string" && num.length) {
			var matches = num.match(parseMatchRgx);
			var c = false;

			if (matches) {
				var d = parseFloat(matches[1].replace(parseReplaceRgx, ""));
				var n = (d + matches[2]).trim();
				for (var i = 1; i <= AbbreviationsMax; i++) {
					var abbrs = Abbreviations[i];
					if (abbrs.shortRgx.test(n) || abbrs.longRgx.test(n)) {
						num = d * Math.pow(10, 3 * i);
						c = true;
						break;
					}
				}
			}
			if (!c) { num = parseFloat(Game.cleanNumber(num)); }
		}

		num = Number(num) || 0;
		num = Math.max(num, min || 0);
		if (!isNaN(max)) {
			num = Math.min(num, max);
		}
		if (floor) {
			num = Math.floor(num);
		}
		return num || 0;
	};

	Game.setInput = function(ele, value) {
		var $ele = $(ele);
		ele = $ele[0];

		var metaObj = ele.metaObj;
		var dataProp = ele.dataProp;

		if ($ele.hasClass("text")) {
			ele.value = value;

		} else {

			if (typeof value === "undefined") {
				value = ele.parsedValue || 0; //refresh values and stuff
			}
			value = Game.parseNumber(value, ele.minIn, ele.maxIn, !$ele.hasClass("deci"));
			var displayVal = value;

			ele.parsedValue = value;
			if ($ele.hasClass("exp")) {
				ele.dataset.title = value < 1e7 || Game.abbrOn ? Game.Beautify(value) : Game.abbreviateNumber(value, 0, true);
				displayVal = Game.BeautifyAbbr(value, 0, true);
				ele.displayValue = displayVal;
			}
			if (document.activeElement !== ele) {
				ele.value = displayVal;
			}

			if (ele.twin) {
				ele.twin.parsedValue = ele.parsedValue;
				if (ele.displayValue) {
					ele.twin.displayValue = ele.displayValue;
				}
				if (document.activeElement !== ele.twin) {
					ele.twin.value = ele.twin.displayValue || value;
				}
				if (typeof ele.dataset.title !== "undefined") {
					ele.twin.dataset.title = ele.dataset.title;
				}

				metaObj = metaObj || ele.twin.metaObj;
				dataProp = dataProp || ele.twin.dataProp;
			}
		}

		if ((ele === Game.tooltipAnchor || ele.twin === Game.tooltipAnchor) && typeof Game.updateTooltip === "function") {
			Game.updateTooltip(true);
		}

		if (metaObj && dataProp) {
			metaObj[dataProp] = value;
		}

		return value;
	};

	Game.registerInput = function(ele, metaObj, dataProp) {
		ele = $(ele)[0];
		if (ele) {
			ele.metaObj = metaObj || null;
			ele.dataProp = dataProp || null;
		}
	};

	Game.registerInputs = function(metaObj, arr) {
		for (var i = 0; i < arr.length; i++) {
			var props = arr[i];
			Game.registerInput(props[0], metaObj, props[1]);
		}
	};

	Game.GetUpgrade = function(what) {
		if (what && what.type === "upgrade") {
			return what;
		}
		if (Game.Upgrades.hasOwnProperty(what)) {
			return Game.Upgrades[what];
		}
		if (Game.UpgradesById.hasOwnProperty(what)) {
			return Game.UpgradesById[what];
		}
		return false;
	};

	Game.Has = Game.HasUpgrade = function(what, asNum) {
		var upgrade = Game.GetUpgrade(what);
		if (!upgrade) { return false; }
		if (Game.ascensionMode === 1 && upgrade.pool === "prestige") {
			return false;
		}
		return upgrade.getBought(asNum);
	};

	Game.GetAchiev = Game.GetAchieve = function(what) {
		if (what && what.type === "achievement") {
			return what;
		}
		if (Game.Achievements.hasOwnProperty(what)) {
			return Game.Achievements[what];
		}
		if (Game.AchievementsById.hasOwnProperty(what)) {
			return Game.AchievementsById[what];
		}
		return false;
	};

	Game.HasAchiev = Game.HasAchieve = function(what, asNum) {
		var achieve = Game.GetAchiev(what);
		return achieve ? achieve.getWon(asNum) : false;
	};

	Game.Win = function(what, temp) {
		if (Array.isArray(what)) {
			for (var i = what.length - 1; i >= 0; i--) { Game.Win(what[i], temp); }
		} else {
			var achieve = Game.getAchieve(what);
			if (achieve) { achieve.setWon(true, temp); }
		}
	};

	Game.countUpgradesByGroup = function(list, limit, includeUnlocked) {
		if (!Array.isArray(list)) {
			list = Game.UpgradesByGroup[list];
		}
		var count = 0;
		if (list) {
			if (isNaN(limit) || limit < 0) {
				limit = list.length;
			}
			for (var i = list.length - 1; i >= 0 && count < limit; i--) {
				var upgrade = Game.GetUpgrade(list[i]);
				if (upgrade) {
					if (upgrade.getBought() || (includeUnlocked && upgrade.unlocked)) {
						count++;
					}
				}
			}
		}
		return count;
	};

	Game.listTinyOwnedUpgrades = function(arr) {
		var str = "";
		for (var i = 0; i < arr.length; i++) {
			var upgrade = Game.GetUpgrade(arr[i]);
			if (upgrade.getBought()) {
				str += upgrade.tinyIconStr;
			}
		}
		return str;
	};

	Game.saySeasonSwitchUses = function() {
		if (Game.seasonUses == 0) { return "You haven't switched seasons this ascension yet."; }
		return ("You've switched seasons <b>" + (Game.seasonUses == 1 ? "once" : Game.seasonUses == 2 ? "twice" : (Game.seasonUses + " times")) +
			"</b> this ascension.");
	};

	Game.hasAura = function(name) {
		if (Game.predictiveMode && Game.tempDragonAuraOff === name) {
			return false;
		}
		return Game.dragonAuras[Game.Get("dragonAura")].name === name || Game.dragonAuras[Game.Get("dragonAura2")].name === name;
	};

	Game.hasBuff = function(what) {
		return Game.Buffs[what];
	};

	Game.hasGod = function(what) {
		var god = Game.pantheon.gods[what];
		if (god) {
			for (var i = 0; i < 3; i++) {
				if (Game.pantheon.slot[i] === god.id) { return (i + 1); }
			}
		}
		return false;
	};

	Game.GetTieredCpsMult = function(building) {
		var mult = 1;
		for (var i in building.tieredUpgrades) {
			var upgrade = building.tieredUpgrades[i];
			if (!Game.Tiers[upgrade.tier].special && upgrade.getBought()) {
				mult *= 2;
			}
		}
		for (i = building.synergies.length - 1; i >= 0; i--) {
			var syn = building.synergies[i];
			if (syn.getBought()) {
				if (syn.buildingTie1 === building) {
					mult *= 1 + 0.05 * syn.buildingTie2.getAmount();
				} else if (syn.buildingTie2 === building) {
					mult *= 1 + 0.001 * syn.buildingTie1.getAmount();
				}
			}
		}
		if (building.grandmaSynergy && building.grandmaSynergy.getBought()) {
			mult *= 1 + Game.Objects["Grandma"].getAmount() * 0.01 * (1 / (building.id - 1));
		}
		return mult;
	};

	Game.setDisabled = function(ele, disable) {
		ele = $(ele)[0];
		if (!ele) { return; }
		disable = typeof disable === "undefined" ? !ele.disabled : Boolean(disable);
		ele.disabled = disable;
		var $par = $(ele.parentNode);
		if ($par.is("label")) {
			$par.toggleClass("disabled", disable);
		} else if ($par.is("select")) {
			$(ele).toggleClass("hidden", disable);
		}
		return ele.disable;
	};

	var ObjectPriceMultStr = "";
	var mapToNum = function(i) { return Number(i); };
	//cache price reduction upgrade.bought values, for use in getPrice methods
	Game.setPriceMultArrays = function() {
		Game.ObjectPriceMultArray = [
			Game.HasUpgrade("Season savings"),
			Game.HasUpgrade("Santa's dominion"),
			Game.HasUpgrade("Faberge egg"),
			Game.HasUpgrade("Divine discount"),
			Game.hasAura("Fierce Hoarder"),
			Boolean(Game.hasBuff("Everything must go")),
			Boolean(Game.hasBuff("Crafty pixies")),
			Boolean(Game.hasBuff("Nasty goblins")),
			Game.eff("buildingCost"),
			Number(Game.hasGod("creation")) //Dotjeiess
		];
		var newStr = Game.ObjectPriceMultArray.map(mapToNum).join("");

		Game.UpgradePriceMultArray = [
			Game.HasUpgrade("Toy workshop"),
			Game.HasUpgrade("Five-finger discount"),
			Game.ObjectPriceMultArray[1], //Santa's dominion
			Game.ObjectPriceMultArray[2], //Faberge egg
			Game.HasUpgrade("Divine sales"),
			Boolean(Game.hasBuff("Haggler's luck")),
			Boolean(Game.hasBuff("Haggler's misery")),
			Game.hasAura("Master of the Armory"),
			Game.eff("upgradeCost"),
			Game.HasUpgrade("Divine bakeries")
		];

		if (newStr !== ObjectPriceMultStr) {
			ObjectPriceMultStr = newStr;
			for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
				Game.ObjectsById[i].priceCache = {};
			}
		}
	};

	Game.modifyObjectPrice = function(building, price) {
		var arr = Game.ObjectPriceMultArray;
		if (arr[0]) { price *= 0.99; } //Season savings
		if (arr[1]) { price *= 0.99; } //Santa's dominion
		if (arr[2]) { price *= 0.99; } //Faberge egg
		if (arr[3]) { price *= 0.99; } //Divine discount
		if (arr[4]) { price *= 0.98; } //Fierce Hoarder
		if (arr[5]) { price *= 0.95; } //Everything must go
		if (arr[6]) { price *= 0.98; } //Crafty pixies
		if (arr[7]) { price *= 1.02; } //Nasty goblins
		price *= arr[8]; //buildingCost minigame effect

		var godLvl = arr[9]; //creation
		if (godLvl == 1) { price *= 0.93; } else if (godLvl == 2) { price *= 0.95; } else if (godLvl == 3) { price *= 0.98; }
		return price;
	};

	Game.setObjectDisplays = function() {
		for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
			Game.ObjectsById[i].setDisplay();
		}
	};

	// var foolsNameCheck = byId("foolsNameCheck");

	Game.setSeason = function(season) {
		var seasonObj = Game.seasons[season];
		if (!seasonObj) {
			seasonObj = Game.seasons[Game.defaultSeason];
		}
		if (!seasonObj) {
			seasonObj = {season: ""};
		}
		Game.season = seasonObj.season || "";
		$(".seasonBlock").addClass("hidden");
		$('.seasonBlock[data-season="' + Game.season + '"]').removeClass("hidden");

		//TODO revisit autoforce fools display names once?
		// if (Game.season === "fools" && !foolsNameCheck.manualChecked && Game.defaultSeason !== "fools") {
		// 	foolsNameCheck.checked = true;
		// }
		// Game.setObjectDisplays();
	};

	Game.getGoldCookieDurationMod = function(wrath) {
		var effectDurMod = 1;
		if (Game.HasUpgrade("Get lucky")) { effectDurMod *= 2; }
		if (Game.HasUpgrade("Lasting fortune")) { effectDurMod *= 1.1; }
		if (Game.HasUpgrade("Lucky digit")) { effectDurMod *= 1.01; }
		if (Game.HasUpgrade("Lucky number")) { effectDurMod *= 1.01; }
		if (Game.HasUpgrade("Green yeast digestives")) { effectDurMod *= 1.01; }
		if (Game.HasUpgrade("Lucky payout")) { effectDurMod *= 1.01; }
		if (Game.hasAura("Epoch Manipulator")) { effectDurMod *= 1.05; }

		if (wrath) {
			effectDurMod *= Game.eff("wrathCookieEffDur");
		} else {
			effectDurMod *= Game.eff("goldenCookieEffDur");
		}

		var godLvl = Game.hasGod("decadence"); //Vomitrax
		if (godLvl == 1) { effectDurMod *= 1.07; } else if (godLvl == 2) { effectDurMod *= 1.05; } else if (godLvl == 3) { effectDurMod *= 1.02; }

		return effectDurMod;
	};

	//shortcut function to get either current or temporary property of Game
	Game.Get = function(key) {
		return Game.predictiveMode && key in Game.temp ? Game.temp[key] : Game[key];
	};

	//shortcut function to set either current or temporary property of Game
	Game.Set = function(key, value) {
		var obj = Game.predictiveMode && key in Game.temp ? Game.temp : Game;
		obj[key] = value;
	};

	Game.getCookiesBaked = function(add) {
		return (Game.Get("cookiesBaked") + (Number(add) || 0));
	};

	Game.ComputeCps = function(base, mult, bonus) {
		return (base) * (Math.pow(2, mult)) + (bonus || 0);
	};

	Game.addClickMult = function(mult) {
		for (var key in Game.Buffs) {
			var multClick = Game.Buffs[key].multClick;
			if (typeof multClick !== "undefined") {
				mult *= multClick;
			}
		}
		return mult;
	};

	Game.calcCookiesPerClick = function(cps, includeBuffs) {
		var add = 0;
		if (Game.HasUpgrade("Thousand fingers")) { add += 0.1; }
		if (Game.HasUpgrade("Million fingers")) { add += 0.5; }
		if (Game.HasUpgrade("Billion fingers")) { add += 5; }
		if (Game.HasUpgrade("Trillion fingers")) { add += 50; }
		if (Game.HasUpgrade("Quadrillion fingers")) { add += 500; }
		if (Game.HasUpgrade("Quintillion fingers")) { add += 5000; }
		if (Game.HasUpgrade("Sextillion fingers")) { add += 50000; }
		if (Game.HasUpgrade("Septillion fingers")) { add += 500000; }
		if (Game.HasUpgrade("Octillion fingers")) { add += 5000000; }
		add *= Game.Get("ObjectsOwned") - Game.Objects["Cursor"].getAmount();

		if (isNaN(cps)) { cps = Game.Get("cookiesPs"); }
		cps *= 0.01;
		if (Game.HasUpgrade("Plastic mouse")) { add += cps; }
		if (Game.HasUpgrade("Iron mouse")) { add += cps; }
		if (Game.HasUpgrade("Titanium mouse")) { add += cps; }
		if (Game.HasUpgrade("Adamantium mouse")) { add += cps; }
		if (Game.HasUpgrade("Unobtainium mouse")) { add += cps; }
		if (Game.HasUpgrade("Eludium mouse")) { add += cps; }
		if (Game.HasUpgrade("Wishalloy mouse")) { add += cps; }
		if (Game.HasUpgrade("Fantasteel mouse")) { add += cps; }
		if (Game.HasUpgrade("Nevercrack mouse")) { add += cps; }
		if (Game.HasUpgrade("Armythril mouse")) { add += cps; }
		if (Game.HasUpgrade("Technobsidian mouse")) { add += cps; }
		if (Game.HasUpgrade("Plasmarble mouse")) { add += cps; }

		var mult = 1;
		if (Game.HasUpgrade("Santa's helpers")) { mult = 1.1; }
		if (Game.HasUpgrade("Cookie egg")) { mult *= 1.1; }
		if (Game.HasUpgrade("Halo gloves")) { mult *= 1.1; }

		mult *= Game.eff("click");

		var godLvl = Game.hasGod("labor"); //Muridal
		if (godLvl == 1) { mult *= 1.15; } else if (godLvl == 2) { mult *= 1.1; } else if (godLvl == 3) { mult *= 1.05; }

		if (includeBuffs) {
			mult = Game.addClickMult(mult);
		}

		if (Game.hasAura("Dragon Cursor")) { mult *= 1.05; }

		var out = mult * Game.ComputeCps(1, Game.HasUpgrade("Reinforced index finger") +
			Game.HasUpgrade("Carpal tunnel prevention cream") + Game.HasUpgrade("Ambidextrous"), add);

		if (Game.hasBuff("Cursed finger")) {
			out = Game.Buffs["Cursed finger"].power;
		}

		return out;
	};

	Game.eff = function(name, def) {
		if (typeof Game.effs[name] === "undefined") {
			return (typeof def === "undefined" ? 1 : def);
		} else {
			return Game.effs[name];
		}
	};

	Game.setEffs = function() {
		//add up effect bonuses from building minigames
		var effs = {};
		for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
			var building = Game.ObjectsById[i];
			if (building.minigame && building.minigame.effs) {
				var myEffs = Game.ObjectsById[i].minigame.effs;
				for (var ii in myEffs) {
					if (effs[ii]) { effs[ii] *= myEffs[ii]; } else { effs[ii] = myEffs[ii]; }
				}
			}
		}
		Game.effs = effs;
	};

	Game.CalculateCookiesPs = function(earnedAchs, method) {
		if (!Array.isArray(earnedAchs)) {
			earnedAchs = [];
		}
		if (!method || typeof Game[method] !== "function") {
			method = "CalculateGains";
		}

		var cpsObj = Game[method]();
		if (Game.predictiveMode && cpsObj.rawCookiesPs < Game.rawCookiesPs) {
			return cpsObj;
		}

		var earned = 0;
		for (var i = Game.CpsAchievements.length - 1; i >= 0; i--) {
			var achieve = Game.CpsAchievements[i];
			if (!achieve.getWon() && achieve.require(cpsObj.rawCookiesPs)) {
				achieve.setWon(true);
				earned++;
				if (Game.predictiveMode) {
					earnedAchs.push(achieve);
				}
			}
		}

		if (earned > 0) {
			Game.Set("AchievementsOwned", Game.Get("AchievementsOwned") + earned);
			if (Game.Get("kittensOwned") > 0) {
				//recurse to see if you'd earn more cps achievements just from the milk gained
				//(probably not but better safe than sorry)
				cpsObj = Game.CalculateCookiesPs(earnedAchs, method);
			}
		}

		return cpsObj;
	};

	Game.GetHeavenlyMultiplier = function() {
		var heavenlyMult = 0;
		if (Game.HasUpgrade("Heavenly chip secret")) { heavenlyMult += 0.05; }
		if (Game.HasUpgrade("Heavenly cookie stand")) { heavenlyMult += 0.20; }
		if (Game.HasUpgrade("Heavenly bakery")) { heavenlyMult += 0.25; }
		if (Game.HasUpgrade("Heavenly confectionery")) { heavenlyMult += 0.25; }
		if (Game.HasUpgrade("Heavenly key")) { heavenlyMult += 0.25; }
		if (Game.hasAura("Dragon God")) { heavenlyMult *= 1.05; }
		if (Game.HasUpgrade("Lucky digit")) { heavenlyMult *= 1.01; }
		if (Game.HasUpgrade("Lucky number")) { heavenlyMult *= 1.01; }
		if (Game.HasUpgrade("Lucky payout")) { heavenlyMult *= 1.01; }

		var godLvl = Game.hasGod("creation"); //Dotjeiess
		if (godLvl == 1) { heavenlyMult *= 0.7; } else if (godLvl == 2) { heavenlyMult *= 0.8; } else if (godLvl == 3) { heavenlyMult *= 0.9; }
		return heavenlyMult;
	};

	Game.CalculateGains = function(heavenlyMult) {
		var mult = 1;
		var cpsObj = {
			cookiesPs: 0,
			cookiesPsBase: 0,
			cookiesPsByType: {},
			cookiesMultByType: {}
		};

		if (Game.ascensionMode !== 1) {
			if (isNaN(heavenlyMult)) {
				heavenlyMult = Game.GetHeavenlyMultiplier();
			}
			mult += Game.Get("prestige") * 0.01 * Game.heavenlyPower * heavenlyMult;
		}

		mult *= Game.eff("cps");

		if (Game.Has("Heralds") && Game.ascensionMode !== 1) {
			mult *= 1 + 0.01 * Game.heralds;
		}

		var hasResidualLuck = Game.HasUpgrade("Residual luck");

		var goldenSwitchMult = 1.5;
		var eggMult = 1;
		for (var i = Game.UpgradesNoMisc.length - 1; i >= 0; i--) {
			var upgrade = Game.UpgradesNoMisc[i];
			if (upgrade.getBought()) {
				if (upgrade.pool === "cookie" || upgrade.pseudoCookie) {
					mult *= 1 + (typeof upgrade.power === "function" ? upgrade.power(upgrade) : upgrade.power) * 0.01;
				}
				if (typeof upgrade.groups.plus === "number") {
					mult *= upgrade.groups.plus;
				}

				var addCps = upgrade.groups.addCps;
				if (typeof addCps === "number") { //"egg"
					cpsObj.cookiesPs += addCps;
					cpsObj.cookiesPsByType[upgrade.name] = addCps;
				}
				if (hasResidualLuck && upgrade.groups.goldSwitchMult) {
					goldenSwitchMult += 0.1;
				}
				if (upgrade.groups.commonEgg) {
					eggMult *= 1.01;
				}
			}
		}
		cpsObj.addCpsBase = cpsObj.cookiesPs;

		var godLvl = Game.hasGod("asceticism"); //Holobore
		if (godLvl == 1) { mult *= 1.15; } else if (godLvl == 2) { mult *= 1.1; } else if (godLvl == 3) { mult *= 1.05; }

		godLvl = Game.hasGod("ages"); //Cyclius
		if (godLvl == 1) { mult *= 1 + 0.15 * Math.sin((Game.lastUpdateTime / 1000 / (60 * 60 * 3)) * Math.PI * 2); } else if (godLvl == 2) {
			mult *= 1 + 0.15 * Math.sin((Game.lastUpdateTime / 1000 / (60 * 60 * 12)) * Math.PI * 2);
		} else if (godLvl == 3) { mult *= 1 + 0.15 * Math.sin((Game.lastUpdateTime / 1000 / (60 * 60 * 24)) * Math.PI * 2); }

		if (Game.HasUpgrade("Santa's legacy")) {
			mult *= 1 + (Game.Get("santaLevel") + 1) * 0.03;
		}

		Game.addBuildingCps(cpsObj);

		if (Game.HasUpgrade("Century egg")) {
			eggMult *= Game.CenturyEggBoost;
		}

		cpsObj.cookiesMultByType["eggs"] = eggMult;

		mult *= eggMult;

		if (Game.HasUpgrade("Sugar baking")) {
			mult *= (1 + Math.min(100, Game.lumps) * 0.01);
		}

		if (Game.hasAura("Radiant Appetite")) {
			mult *= 2;
		}

		if (Game.hasAura("Dragon's Fortune")) {
			for (i = 0; i < Game.numGoldenCookies; i++) {
				mult *= 2.23;
			}
		}

		cpsObj.preMilkMult = mult;
		mult = Game.addMilkMult(cpsObj, mult);

		cpsObj.rawMult = mult;
		cpsObj.rawCookiesPs = cpsObj.cookiesPs * mult;
		var extraMult = 1;

		var name = Game.bakeryNameLowerCase;
		if (name === "orteil") {
			extraMult *= 0.99;
		} else if (name === "ortiel") { //or so help me
			extraMult *= 0.98;
		}

		if (Game.HasUpgrade("Elder Covenant")) { extraMult *= 0.95; }

		if (Game.HasUpgrade("Golden switch [off]")) { extraMult *= goldenSwitchMult; }
		if (Game.HasUpgrade("Shimmering veil [off]")) {
			var veilMult = 0.5;
			if (Game.HasUpgrade("Reinforced membrane")) {
				veilMult += 0.1;
			}
			extraMult *= 1 + veilMult;
		}
		if (Game.HasUpgrade("Magic shenanigans")) { extraMult *= 1000; }
		if (Game.HasUpgrade("Occult obstruction")) { extraMult *= 0; }

		var multCpSTotal = 1;

		for (var key in Game.Buffs) {
			var multCpS = Game.Buffs[key].multCpS;
			if (typeof multCpS !== "undefined") {
				multCpSTotal *= multCpS;
			}
		}
		cpsObj.buffMultCps = multCpSTotal;

		cpsObj.unbuffedExtraMult = extraMult;
		var unbuffedMult = mult * extraMult;
		extraMult *= multCpSTotal;

		cpsObj.extraMult = extraMult;
		mult *= extraMult;
		cpsObj.globalCpsMult = mult;
		cpsObj.unbuffedGlobalCpsMult = unbuffedMult;

		cpsObj.unbuffedCookiesPs = cpsObj.cookiesPs * unbuffedMult;
		cpsObj.unbuffedCookiesPerClick = Game.calcCookiesPerClick(cpsObj.unbuffedCookiesPs, false);
		cpsObj.unbuffedCookiesPsPlusClicks = cpsObj.unbuffedCookiesPs + cpsObj.unbuffedCookiesPerClick * Game.clicksPs;

		cpsObj.cookiesPs *= mult;
		cpsObj.cookiesPerClick = Game.calcCookiesPerClick(cpsObj.cookiesPs, true);
		cpsObj.cookiesPsPlusClicks = cpsObj.cookiesPs + cpsObj.cookiesPerClick * Game.clicksPs;

		return cpsObj;
	};

	//bit of a pain to do this, but optimizations help when there's so many .chains to check
	Game.CalculateBuildingGains = function() {
		var cpsObj = {
			cookiesPs: Game.addCpsBase,
			cookiesPsBase: 0,
			cookiesPsByType: {},
			cookiesMultByType: {},
			preMilkMult: Game.temp.cpsObj.preMilkMult,
			extraMult: Game.temp.cpsObj.extraMult
		};

		Game.addBuildingCps(cpsObj);

		var mult = Game.temp.AchievementsOwned > Game.AchievementsOwned ? Game.addMilkMult(cpsObj, cpsObj.preMilkMult) : Game.temp.cpsObj.rawMult;
		cpsObj.rawMult = mult;
		cpsObj.rawCookiesPs = cpsObj.cookiesPs * mult;

		mult *= cpsObj.extraMult;
		cpsObj.globalCpsMult = mult;
		cpsObj.cookiesPs *= mult;

		cpsObj.cookiesPerClick = Game.calcCookiesPerClick(cpsObj.cookiesPs, true);
		cpsObj.cookiesPsPlusClicks = cpsObj.cookiesPs + cpsObj.cookiesPerClick * Game.clicksPs;

		return cpsObj;
	};

	Game.setObjectGodMultiplier = function() {
		var buildMult = 1;
		var godLvl = Game.hasGod("decadence"); //Vomitrax
		if (godLvl == 1) { buildMult *= 0.93; } else if (godLvl == 2) { buildMult *= 0.95; } else if (godLvl == 3) { buildMult *= 0.98; }

		godLvl = Game.hasGod("industry"); //Jeremy
		if (godLvl == 1) { buildMult *= 1.1; } else if (godLvl == 2) { buildMult *= 1.06; } else if (godLvl == 3) { buildMult *= 1.03; }

		godLvl = Game.hasGod("labor"); //Muridal
		if (godLvl == 1) { buildMult *= 0.97; } else if (godLvl == 2) { buildMult *= 0.98; } else if (godLvl == 3) { buildMult *= 0.99; }
		Game.objectGodMult = buildMult;
	};

	Game.addBuildingCps = function(cpsObj) {
		for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
			var building = Game.ObjectsById[i];
			var amount = building.getAmount();
			var cps = building.calcCps(building);
			if (Game.ascensionMode !== 1) {
				cps *= (1 + building.level * 0.01) * Game.objectGodMult;
			}
			var cpsTotal = cps * amount;
			cpsObj.cookiesPsBase += building.baseCps * amount;

			if (!Game.predictiveMode) {
				building.storedCps = cps;
				building.storedTotalCps = cpsTotal;
			}
			cpsObj.cookiesPs += cpsTotal;
			cpsObj.cookiesPsByType[building.name] = cpsTotal;
		}
		return cpsObj;
	};

	Game.addMilkMult = function(cpsObj, mult) {
		var milkProgress = Game.Get("AchievementsOwned") / 25;
		cpsObj.milkProgress = milkProgress;
		if (Game.Get("kittensOwned") > 0) {
			var milkMult = 1;
			if (Game.HasUpgrade("Santa's milk and cookies")) { milkMult *= 1.05; }
			if (Game.hasAura("Breath of Milk")) { milkMult *= 1.05; }

			var godLvl = Game.hasGod("mother"); //Mokalsium
			if (godLvl == 1) { milkMult *= 1.1; } else if (godLvl == 2) { milkMult *= 1.05; } else if (godLvl == 3) { milkMult *= 1.03; }

			milkMult *= Game.eff("milk");

			var catMult = 1;

			if (Game.HasUpgrade("Kitten helpers")) { catMult *= 1 + milkProgress * 0.1 * milkMult; }
			if (Game.HasUpgrade("Kitten workers")) { catMult *= 1 + milkProgress * 0.125 * milkMult; }
			if (Game.HasUpgrade("Kitten engineers")) { catMult *= 1 + milkProgress * 0.15 * milkMult; }
			if (Game.HasUpgrade("Kitten overseers")) { catMult *= 1 + milkProgress * 0.175 * milkMult; }
			if (Game.HasUpgrade("Kitten managers")) { catMult *= 1 + milkProgress * 0.2 * milkMult; }
			if (Game.HasUpgrade("Kitten accountants")) { catMult *= 1 + milkProgress * 0.2 * milkMult; }
			if (Game.HasUpgrade("Kitten specialists")) { catMult *= 1 + milkProgress * 0.2 * milkMult; }
			if (Game.HasUpgrade("Kitten experts")) { catMult *= 1 + milkProgress * 0.2 * milkMult; }
			if (Game.HasUpgrade("Kitten consultants")) { catMult *= 1 + milkProgress * 0.2 * milkMult; }
			if (Game.HasUpgrade("Kitten assistants to the regional manager")) { catMult *= 1 + milkProgress * 0.175 * milkMult; }
			if (Game.HasUpgrade("Kitten marketeers")) { catMult *= 1 + milkProgress * 0.15 * milkMult; }
			if (Game.HasUpgrade("Kitten analysts")) { catMult *= 1 + milkProgress * 0.125 * milkMult; }
			if (Game.HasUpgrade("Kitten angels")) { catMult *= 1 + milkProgress * 0.1 * milkMult; }

			cpsObj.cookiesMultByType["kittens"] = catMult;
			mult *= catMult;
		}
		return mult;
	};


	Game.resetObjects = function() {
		for (var i = Game.ObjectsById.length - 1; i >= 0; i--) { Game.ObjectsById[i].resetTemp(); }
		Game.temp.ObjectsOwned = Game.ObjectsOwned;
	};
	Game.resetUpgrades = function() {
		for (var i = Game.UpgradesById.length - 1; i >= 0; i--) { Game.UpgradesById[i].resetTemp(); }
	};
	Game.resetAchievements = function(achsList, force) {
		if (!Array.isArray(achsList)) {
			achsList = Game.AchievementsById;
		}
		force = force || achsList === Game.AchievementsById;
		for (var i = achsList.length - 1; i >= 0; i--) {
			var achieve = achsList[i];
			if (!force && !achieve.won && achieve.tempWon && Game.CountsAsAchievementOwned(achieve.pool)) { Game.temp.AchievementsOwned--; }
			achieve.tempWon = achieve.won;
		}
		if (force) {
			Game.temp.AchievementsOwned = Game.AchievementsOwned;
		}
	};

	Game.setPredictiveMode = function() {
		Game.predictiveMode = true;

		Game.resetObjects();
		Game.resetUpgrades();
		Game.resetAchievements();

		for (i in Game.temp) {
			var val = Game[i];
			if (Array.isArray(val)) {
				val = val.slice(0);
			} else if (typeof val === "object" && val !== null) {
				val = $.extend({}, val);
			}
			Game.temp[i] = val;
		}
	};

	// writes to children elements, where obj's keys map to class attributes
	Game.writeChildren = function($parent, obj) {
		$parent = $($parent);
		for (var c in obj) {
			var val = obj[c];
			if (typeof val === "number") {
				val = Game.formatNumber(val, 1);
			}
			$parent.find("." + c).html(val);
		}
		return $parent;
	};

	var recommendListSort = function(a, b) {
		return ((a.rate - b.rate) || (a.order - b.order) || ((a.chain ? a.chain.amount : 0) - (b.chain ? b.chain.amount : 0)));
	};

	//#endregion methods


	//#region update()

	var updateScheduleTimer = null;
	var lastUpdateDelay = 1;
	var updateDelayedFuncs = [];
	// Delay update so page reflows happen first and/or to throttle inputs
	Game.scheduleUpdate = function(delay, afterUpdateFunc) {
		if (!isFinite(delay)) { delay = 1; }
		if (typeof afterUpdateFunc === "function") {
			updateDelayedFuncs.push(afterUpdateFunc);
		}
		delay = Math.max(delay, lastUpdateDelay) || lastUpdateDelay || 1;
		lastUpdateDelay = delay;
		clearTimeout(updateScheduleTimer);
		updateScheduleTimer = setTimeout(function() {
			Game.update();
			for (var i = 0; i < updateDelayedFuncs.length; i++) {
				updateDelayedFuncs[i]();
			}
			updateDelayedFuncs = [];
		}, delay);
	};

	Game.update = function() {
		Game.predictiveMode = false;
		clearTimeout(Game.updateTimer);
		clearTimeout(updateScheduleTimer);
		lastUpdateDelay = 1;
		Game.lastUpdateTime = Date.now();

		var i, building, upgrade, achieve, req;

		for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
			building = Game.ObjectsById[i];
			if (building.minigame && building.minigame.updateFunc) {
				building.minigame.updateFunc();
			}
		}

		Game.setEffs();
		Game.setPriceMultArrays();

		Game.ascensionMode = Number(byId("bornAgainCheck").checked);
		Game.sellMultiplier = Game.hasAura("Earth Shatterer") ? 0.5 : 0.25;
		Game.cookiesBaked = byId("cookiesBaked").parsedValue;
		Game.cookiesPs = 0;

		Game.buildingBuyInterval = 1;
		if (byId("multiBuildRecCheck").checked && byId("quantityTen").checked) {
			Game.buildingBuyInterval = 10;
		}

		Game.heavenlyMultiplier = Game.GetHeavenlyMultiplier();
		var mult = Game.prestige * Game.heavenlyPower * Game.heavenlyMultiplier;

		//the boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor(Math.max(Game.lastUpdateTime - Game.startDate, 0) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day, 100);
		Game.CenturyEggBoost = 1 + (1 - Math.pow(1 - day / 100, 3)) * 0.1;

		Game.clicksPs = 20;
		Game.maxChain = 1000;
		if (Game.maxChain < 0 || Game.maxChain > 1000) {
			Game.maxChain = 1000;
		}

		if (Game.clicksPs > 0 && Game.HasUpgrade("Shimmering veil [off]")) {
			Game.GetUpgrade("Shimmering veil [on]").setBought(true);
		}

		var santaIndex = Game.santa.dropEle.selectedIndex;
		Game.santaLevel = Math.max(Math.min(santaIndex - 1, Game.santaMax), 0) || 0;

		Game.setObjectGodMultiplier();

		// Game.setDisabled(foolsNameCheck, Game.season === "fools");
		// foolsNameCheck.checked = Game.season === "fools" ? true : foolsNameCheck.manualChecked;
		// var isFools = Game.season === "fools" || foolsNameCheck.checked;
		// var isFools = foolsNameCheck.checked;

		var bulkAmount = 1;

		//set building name and amounts and associated properties
		Game.ObjectsOwned = 0;
		Game.HighestBuilding = null;
		for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
			building = Game.ObjectsById[i];
			var amount = building.amountIn.parsedValue;
			building.amount = amount;
			building.level = building.levelIn.parsedValue;
			building.price = building.getPrice();
			building.bulkPrice = building.getPriceSum(amount, amount + bulkAmount);
			building.$tooltipBlock = null;

			Game.ObjectsOwned += amount;
			if (!Game.HighestBuilding && amount) {
				Game.HighestBuilding = building;
			}
		}


		Game.UpgradesOwned = 0;
		Game.kittensOwned = 0;
		Game.UpgradesToCheck = [];
		Game.hasClickPercent = false;

		for (i = Game.UpgradesById.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesById[i];
			if (upgrade.runFunc) {
				upgrade.runFunc();
			}

			upgrade.isPerm = false;
			upgrade.statsStr = null;
			upgrade.cpsObj = null;
			upgrade.cps = 0;
			upgrade.rate = 0;
			upgrade.amort = 0;
			upgrade.recommendObj = null;
			if (upgrade.chain) {
				upgrade.chain.recommendObj = null;
				upgrade.chain.rate = 0;
			}
			upgrade.$blacklistEle.toggleClass("hidden", !upgrade.bought || !upgrade.blacklistCheckbox.checked)
				.toggleClass("strike", upgrade.bought && upgrade.blacklistCheckbox.checked);

			upgrade.$tooltipBlock = null;

			if (upgrade.noBuy && upgrade.bought) { //safety switch
				upgrade.bought = false;
			}

			if (upgrade.bought) {
				if (Game.CountsAsUpgradeOwned(upgrade.pool)) {
					Game.UpgradesOwned++;
				}
				if (upgrade.groups.kitten) {
					Game.kittensOwned++;
				}
				if (upgrade.groups.clickPercent) {
					Game.hasClickPercent += true;
				}
			}
		}

		if (Game.ascensionMode !== 1) {
			for (i = Game.permanentUpgrades.length - 1; i >= 0; i--) {
				upgrade = Game.GetUpgrade(Game.permanentUpgrades[i]);
				if (upgrade) {
					upgrade.isPerm = true;
				}
			}
		}


		Game.minCumulative = Math.max(Game.getMinCumulative() - Game.minCumulativeOffset, 0);
		$("#setCookiesBakedSpan").toggleClass("hidden", !isFinite(Game.cookiesBaked + Game.minCumulative) || Game.cookiesBaked >= Game.minCumulative);
		Game.cookiesBaked = Math.max(Game.cookiesBaked, Game.minCumulative);

		Game.AchievementsOwned = 0;
		var achievementsOwnedOther = 0;
		var showResetAchs = false;
		var showEnableAchs = false;
		var showDisableAchs = false;
		Game.LockedAchievements = [];

		for (i = Game.AchievementsById.length - 1; i >= 0; i--) {
			achieve = Game.AchievementsById[i];
			req = achieve.require ? achieve.require() : false;

			if (!achieve.won && achieve.require && !achieve.groups.cpsAch) {
				if (req) {
					achieve.won = true;
				} else {
					Game.LockedAchievements.push(achieve);
				}
			}

			if (achieve.won) {
				if (Game.CountsAsAchievementOwned(achieve.pool)) {
					Game.AchievementsOwned++;
				} else {
					achievementsOwnedOther++;
				}

				if (!achieve.groups.cpsAch) { //ugh
					if (achieve.require) {
						showResetAchs = showResetAchs || !req;
					}
					showDisableAchs = showDisableAchs || !req;
				}
			} else if (!showEnableAchs && !achieve.groups.cpsAch && achieve.pool !== "dungeon") {
				showEnableAchs = true;
			}
			achieve.$crateNodes.toggleClass("enabled", achieve.won);
		}

		Game.buffMultClicks = Game.addClickMult(1);
		var cpsObj = Game.CalculateCookiesPs();
		$.extend(Game, cpsObj);
		Game.cpsObj = cpsObj;

		//Game.garden.updateHarvestBonus();

		for (i = Game.CpsAchievements.length - 1; i >= 0 && (!showResetAchs || !showDisableAchs); i--) {
			achieve = Game.CpsAchievements[i];
			if (achieve.won) {
				req = achieve.require();
				if (achieve.require) {
					showResetAchs = showResetAchs || !req;
				}
				showDisableAchs = showDisableAchs || !req;
			} else {
				showEnableAchs = true;
			}
		}

		var milkStr = Math.round(Game.milkProgress * 100);
		// byId("achMilk").innerHTML = Math.round(Game.milkProgress * 100) + "% (" +
		// 	Game.Milks[Math.min(Math.floor(Game.milkProgress), Game.Milks.length - 1)].name + ")";


		var checkUpgrades = byId("hardcoreCheck").checked;
		var checkResearch = byId("researchCheck").checked;

		for (i = Game.UpgradesById.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesById[i];
			upgrade.setPrice();

			if (!upgrade.unlocked && upgrade.require) {
				upgrade.unlocked = Boolean(upgrade.require());
			}

			if (checkUpgrades && !upgrade.bought && !upgrade.blacklistCheckbox.checked && Game.CountsAsUpgradeOwned(upgrade.pool) &&
				(upgrade.pool !== "tech" || checkResearch) && (!upgrade.requiredUpgrade || Game.HasUpgrade(upgrade.requiredUpgrade))) {
				Game.UpgradesToCheck.push(upgrade);
			}

			upgrade.$crateNodes.toggleClass("unlocked", upgrade.unlocked).toggleClass("enabled", upgrade.bought);
		}

		Game.nextTech = null;
		if (Game.HasUpgrade("Bingo center/Research facility")) {
			for (i = Game.UpgradesByPool.tech.length - 1; i >= 0; i--) {
				upgrade = Game.UpgradesByPool.tech[i];
				if (!upgrade.bought) {
					if (!upgrade.unlocked) {
						Game.nextTech = upgrade;
					}
					break;
				}
			}
		}
		// $('#researchCheckSpan').toggleClass('hidden', !Game.nextTech);

		var suckRate = 1 / 20;
		suckRate *= Game.eff("wrinklerEat");
		var numWrinklers = Math.min(byId("numWrinklersIn").parsedValue, Game.maxWrinklers);
		Game.cpsSucked = numWrinklers * suckRate;
		var witherMult = 1 - Game.cpsSucked;

		Game.filterAchievements();

		Game.updateDragon();
		Game.updateBuffs();

		Game.setPredictiveMode();
		Game.recommendList = [];

		Game.updatePrestige();
		Game.updateGoldenCookies();

		var nextCps = "---";
		var nextCpsPlusClicks = "---";
		if (Game.cookiesPs > 0 && Game.kittensOwned > 0 && Game.AchievementsOwned < Game.AchievementsTotal) {
			Game.temp.AchievementsOwned = Game.AchievementsOwned + 1;
			var nextAchCpsObj = Game.CalculateGains();
			nextCps = Math.abs(nextAchCpsObj.cookiesPs - Game.cookiesPs);
			nextCpsPlusClicks = Math.abs(nextAchCpsObj.cookiesPsPlusClicks - Game.cookiesPsPlusClicks);
		}
		Game.temp.AchievementsOwned = 0;

		var upgradeCpSDiff = Game.cookiesPs - Game.cookiesPsBase;
		if (Game.unbuffedGlobalCpsMult !== 0 && Game.buffMultCps === 0) { //sigh
			upgradeCpSDiff = 0;
		}

		Game.temp.AchievementsOwned = Game.AchievementsOwned;

		//santa
		var cond = santaIndex > 0 && Game.santaLevel < Game.santaMax;
		var price = Math.pow(Game.santaLevel + 1, Game.santaLevel + 1);
		Game.santa.price = price;
		var santaStr = cond ? Game.santaLevels[Game.santaLevel + 1] : "---";
		Game.setDisabled("#noSantaOpt", Game.HasUpgrade("A festive hat"));
		var calcNextSanta = cond && Game.cookiesPs > 0 && Game.HasUpgrade("Santa's legacy");
		Game.santa.recommendObj = null;
		var isSantaBlacklisted = Game.santa.blacklistCheckbox.checked;

		if (cond) {
			var nextSanta = santaStr;
			santaStr += " - Cost: " + Game.formatNumber(price);
			if (calcNextSanta) {
				Game.temp.santaLevel++;
				var santaCpsObj = Game.calculateChanges(price, []);
				santaStr += ", +" + Game.formatNumber(santaCpsObj.cookiesPsPlusClicksDiff, 1) + " cps";

				Game.temp.santaLevel = Game.santaLevel;
				Game.resetAchievements(santaCpsObj.earnedAchs, true);

				if (!isSantaBlacklisted && santaCpsObj.rate > 0) {
					Game.santa.recommendObj = {
						type: "santa",
						gameObj: Game.santa,
						name: nextSanta + " (santa level)",
						price: price,
						cpsObj: santaCpsObj,
						earnedAchs: santaCpsObj.earnedAchs,
						rate: santaCpsObj.rate
					};
					Game.recommendList.push(Game.santa.recommendObj);
				}
			}
		}
		Game.santa.$blacklistEle.toggleClass("hidden", !calcNextSanta && !isSantaBlacklisted)
			.toggleClass("strike", !calcNextSanta && isSantaBlacklisted);

		Game.updateBuildings();
		Game.updateUpgrades();

		Game.recommendList.sort(recommendListSort);
		Game.updateRecommended();
		Game.updateBlacklist();

		Game.predictiveMode = false;
		Game.sortAndFilterUpgrades();

		if (typeof Game.updateTooltip === "function") {
			Game.updateTooltip(true);
		}

		upgrade = Game.Upgrades["Century egg"];
		var check = Game.cookiesPs > 0 &&
			(Game.hasGod("ages") || //Cyclius
				(day < 100 && (upgrade.unlocked || upgrade.bought || Game.tooltipUpgrade === upgrade)));
		if (check) {
			Game.updateTimer = setTimeout(Game.update, 1000 * 10); //10 seconds
		}
	};


	function updateTab() {
		if (this && typeof this.updateTabFunc === "function") {
			this.updateTabFunc();
		}
	}


	Game.updateBuildings = function() {
		var sum = {
			amount: Game.addCommas(Game.ObjectsOwned),
			desired: 0,
			buy1: 0,
			buy10: 0,
			buy100: 0,
			buyDesired: 0,
			cumu: 0,
			sell: 0
		};

		for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
			var building = Game.ObjectsById[i];
			building.recommendObj = null;

			var cpsObj = Game.setChanges([{gameObj: building}], [], "CalculateBuildingGains");

			var cps = building.storedTotalCps * Game.globalCpsMult;
			var percent = building.amount > 0 && Game.cookiesPs > 0 ? Game.Beautify(cps / Game.cookiesPs * 100, 1) : 0;
			var cpsWrite = Game.formatNumber(cps, 1, false, "", building.amount > 0 ? " (" + percent + "%)" : "");
			Game.writeChildren(building.$cpsRow, {
				buildPrice: building.bulkPrice,
				cps: cpsWrite,
				time: Game.formatTime(Math.ceil(building.price / Game.cookiesPsPlusClicks)),
				nextCps: cpsObj.cookiesPsDiff,
				cpsPlus: cpsObj.cookiesPsPlusClicksDiff,
				amort: Game.formatTime(cpsObj.amort)
			});

			var amount = building.amount;
			var desired = building.amountInDesired.parsedValue;

			var buy10 = building.getPriceSum(amount, amount + 10);
			var buy100 = building.getPriceSum(amount, amount + 100);
			var buyDesired = building.getPriceSum(amount, desired);
			var cumu = building.getPriceSum(0, amount);
			var sell = building.getSellSum(amount, desired);

			Game.writeChildren(building.$priceRow, {
				buy1: building.price,
				buy10: buy10,
				buy100: buy100,
				buyDesired: buyDesired,
				cumu: cumu,
				sell: sell
			});

			sum.desired += desired;
			sum.buy1 += building.price;
			sum.buy10 += buy10;
			sum.buy100 += buy100;
			sum.buyDesired += buyDesired;
			sum.cumu += cumu;
			sum.sell += sell;

			if (!building.blacklistCheckbox.checked) {
				building.recommendObj = {
					type: building.type,
					name: building.getRecommendedName(building.amount + Game.buildingBuyInterval),
					gameObj: building,
					toAmount: building.amount + Game.buildingBuyInterval,
					price: Game.buildingBuyInterval === 10 ? buy10 : building.price,
					order: building.id,
					cpsObj: cpsObj,
					rate: cpsObj.rate
				};
				Game.recommendList.push(building.recommendObj);
			}
		}

		Game.writeChildren("#buildPriceTotal", sum);
	};

	Game.updateUpgrades = function() {
		if (!byId("hardcoreCheck").checked) {
			return;
		}
		var recommendChains = byId("multiBuildRecCheck").checked && Game.maxChain > 0;
		var recommendResearch = byId("researchCheck").checked;

		for (var i = Game.UpgradesToCheck.length - 1; i >= 0; i--) {
			var upgrade = Game.UpgradesToCheck[i];

			if (upgrade.unlocked) {
				var cpsObj = upgrade.calcCps();
				if (cpsObj && cpsObj.amort > 0 && cpsObj.rate > 0 &&
					(upgrade.pool !== "tech" || recommendResearch) && (!upgrade.recommendFunc || upgrade.recommendFunc())) {
					upgrade.recommendObj = {
						type: upgrade.type,
						name: upgrade.iconName,
						price: upgrade.price,
						gameObj: upgrade,
						order: upgrade.order,
						cpsObj: cpsObj,
						rate: cpsObj.rate
					};
					Game.recommendList.push(upgrade.recommendObj);
					upgrade.$blacklistEle.removeClass("hidden strike");
				}
			}

			//upgrade chains (are a pain)
			var chain = upgrade.chain;
			if (chain && recommendChains && !upgrade.unlocked && chain.require()) {
				var chainCpsObj = Game.setChanges(Game.getUpgradeBuildChainChangeArr(upgrade, chain), [], "CalculateBuildingGains");
				chain.rate = chainCpsObj.rate;

				if (chain.rate > 0) {
					var chainAmount = Game.getUpgradeBuildChainAmount(chain);
					chain.recommendObj = {
						type: "upgrade chain",
						name: "Chain for " + upgrade.iconName + ' ' + chain.building.getRecommendedName(chainAmount),
						title: chain.building.getRecommendedName(chainAmount) + "\n" + upgrade.iconName,
						gameObj: upgrade,
						price: chainCpsObj.price,
						building: chain.building,
						toAmount: chainAmount,
						order: upgrade.order,
						cpsObj: chainCpsObj,
						rate: chainCpsObj.rate
					};
					Game.recommendList.push(chain.recommendObj);
					upgrade.$blacklistEle.removeClass("hidden strike");
				}
			}
		}
	};

	//sets temporary changes to the game state to calculate them, takes an array of js objects
	//{gameObj: [either Game.Object (aka building) or upgrade], amount: number (for buildings, defaults to current amount + 1)}
	//will pass setCpsNegative if set as an argument, as a property of the js obj, or if on the gameObj
	Game.setChanges = function(changeArr, earnedAchs, method, noCalc) {
		Game.predictiveMode = true;
		var resetArr = [];
		var price = 0;
		var setCpsNegative = false;
		var ObjectsOwned = Game.temp.ObjectsOwned;

		for (var i = changeArr.length - 1; i >= 0; i--) {
			var c = changeArr[i];
			if (!c) { continue; }
			var gObj = c.gameObj;
			if (!gObj) { continue; }

			if (gObj.type === "building") {
				var nextAmount = c.amount || gObj.amount + Game.buildingBuyInterval;
				price += c.price || gObj.getPriceSum(gObj.tempAmount, nextAmount);
				Game.temp.ObjectsOwned += nextAmount - gObj.tempAmount;
				gObj.tempAmount = nextAmount;

				resetArr.push(gObj);
			} else if (gObj.type === "upgrade") {
				price += gObj.price;

				if (gObj.toggleInto && gObj.isChild) {
					gObj.toggleInto.setBought();
				} else {
					gObj.setBought();
				}

				if (Game.CountsAsUpgradeOwned(gObj.pool)) {
					Game.temp.UpgradesOwned += gObj.tempBought ? 1 : -1;
				}
				if (gObj.groups.kitten) {
					Game.temp.kittensOwned += gObj.tempBought ? 1 : -1;
				}
				resetArr.push(gObj);
			}
			setCpsNegative = setCpsNegative || c.setCpsNegative || gObj.setCpsNegative;
		}

		if (earnedAchs && earnedAchs.length) {
			for (i = earnedAchs.length - 1; i >= 0; i--) {
				var achieve = earnedAchs[i];
				if (!achieve.tempWon && Game.CountsAsAchievementOwned(achieve.pool)) { Game.temp.AchievementsOwned++; }
				achieve.tempWon = true;
			}
		}

		if (noCalc) {
			return;
		}

		var toReturn = Game.calculateChanges(price, earnedAchs, setCpsNegative, method);

		for (i = resetArr.length - 1; i >= 0; i--) {
			resetArr[i].resetTemp();
		}
		Game.temp.ObjectsOwned = ObjectsOwned;
		Game.temp.UpgradesOwned = Game.upgradesOwned;
		Game.temp.kittensOwned = Game.kittensOwned;
		Game.resetAchievements(toReturn.earnedAchs);
		return toReturn;
	};

	//calculates cps changes and achievements earned based on changes
	//pass setCpsNegative to set the difference in cps from current as a loss
	Game.calculateChanges = function(price, earnedAchs, setCpsNegative, method) {
		price = Number(price) || 0;
		if (!Array.isArray(earnedAchs)) {
			earnedAchs = [];
		}
		Game.predictiveMode = true;

		for (i = Game.LockedAchievements.length - 1; i >= 0; i--) {
			var achieve = Game.LockedAchievements[i];
			var arg = achieve.groups.bankAch ? price : undefined; //bit hacky but what can you do
			if (!achieve.tempWon && achieve.require && achieve.require(arg)) {
				achieve.tempWon = true;
				earnedAchs.push(achieve);
				if (Game.CountsAsAchievementOwned(achieve.pool)) {
					Game.temp.AchievementsOwned++;
				}
			}
		}

		var cpsObj = Game.CalculateCookiesPs(earnedAchs, method);
		var gameCpsObj = Game.temp.cpsObj;

		var mult = setCpsNegative ? -1 : 1;
		var cpscDiff = Math.abs(gameCpsObj.cookiesPsPlusClicks - cpsObj.cookiesPsPlusClicks) * mult;
		cpsObj.cookiesPsDiff = Math.abs(gameCpsObj.cookiesPs - cpsObj.cookiesPs) * mult;
		cpsObj.cookiesPerClickDiff = Math.abs(gameCpsObj.cookiesPerClick - cpsObj.cookiesPerClick) * mult;
		cpsObj.cookiesPsPlusClicksDiff = cpscDiff;
		cpsObj.earnedAchs = earnedAchs;

		cpsObj.price = price;
		cpsObj.rate = cpscDiff > 0 ? Math.max(price * cpsObj.cookiesPsPlusClicks / cpscDiff, 0) || 0 : 0;
		cpsObj.amort = cpscDiff > 0 ? Math.ceil(price / cpscDiff) || 0 : 0;
		return cpsObj;
	};

	Game.updateDragon = function() {
		var lvlObj = Game.dragonLevels[Game.dragonLevel] || {
			name: "---",
			action: "---"
		};
		var str = lvlObj.action || "---";
		if (lvlObj.costStr) {
			str += " - Cost: " + lvlObj.costStr();
		}

		byId("dragonName").textContent = lvlObj.name;
		$("#dragonAction").html(str).attr("data-title", lvlObj.actionTitle || "")
			.toggleClass("clickme", Game.dragonLevel < Game.dragonLevelMax && Boolean(lvlObj.cost ? lvlObj.cost() : true));

		var $switchAura = $("#auraAvailable .aura.enabled");
		var switchId = $switchAura.attr("data-aura");
		var currentId = Game.$enabledAuraSlot ? Game.$enabledAuraSlot.attr("data-aura") : null;
		var otherId = Game.$enabledAuraSlot ? Game.$enabledAuraSlot.siblings().attr("data-aura") : null;

		$("#switchAuraBuy").html("Change aura (" + (Game.HighestBuilding ? "sacrifice 1 " + Game.HighestBuilding.displayName : "---") + ")")
			.toggleClass("hidden", !Game.HighestBuilding || !Game.$enabledAuraSlot || !$switchAura.length ||
				currentId == switchId || (switchId > 0 && otherId == switchId));
		$("#switchAuraFree").toggleClass("hidden", Game.$enabledAuraSlot && $switchAura.length && currentId == switchId);

		for (var i = Game.dragonAuras.length - 1; i >= 1; i--) {
			Game.dragonAuras[i].$crateNode.toggleClass("unlocked", Game.dragonLevel >= i + 4 && i != otherId);
		}
		$("#auraSlot0").toggleClass("unlocked", Game.dragonLevel > 4);
		$("#auraSlot1").toggleClass("unlocked", Game.dragonLevel >= Game.dragonLevelMax);
	};

	Game.HCfactor = 3;
	Game.HowMuchPrestige = function(cookies) { //how much prestige [cookies] should land you
		return Math.pow(cookies / 1e12, 1 / Game.HCfactor);
	};
	Game.HowManyCookiesReset = function(chips) { //how many cookies [chips] are worth
		//this must be the inverse of the above function (ie. if cookies = chips^2, chips = cookies^(1/2) )
		return (Math.pow(chips, Game.HCfactor) * 1e12); //1 trillion
	};
	//ugh floating point why must you be a pain
	Game.HowManyCookiesResetAdjusted = function(chips) {
		var cookies = Game.HowManyCookiesReset(chips);
		var i = 0;
		if (Game.HowMuchPrestige(cookies) < chips) {
			i = 1;
			while (Game.HowMuchPrestige(cookies + i) < chips) {
				i *= 10;
			}
		}
		return (cookies + i);
	};

	Game.updateBuffs = function() {
		for (var i = Game.BuffTypes.length - 1; i >= 0; i--) {
			Game.BuffTypes[i].updateFunc();
		}
	};

	Game.updatePrestige = function() {
		Game.predictiveMode = true;
		var cookiesReset = byId("cookiesReset").parsedValue;
		var cookiesBakedAllTime = Game.cookiesBaked + cookiesReset;
		var cpsObj;

		var prestigeFromCookiesReset = Math.floor(Game.HowMuchPrestige(cookiesReset));
		$("#setPrestigeSpan, #setCookiesResetSpan").toggleClass("hidden", prestigeFromCookiesReset === Game.prestige);
		byId("setPrestigeNum").innerHTML = Game.formatNumber(prestigeFromCookiesReset);
		var cookiesResetFromPrestige = Game.HowManyCookiesResetAdjusted(Game.prestige);
		var ele = byId("setCookiesResetNum");
		ele.innerHTML = Game.formatNumber(cookiesResetFromPrestige);
		ele.setValue = cookiesResetFromPrestige;

		var heavenlyMult = Game.heavenlyMultiplier;
		if (!heavenlyMult) {
			heavenlyMult = 1;
			if (Game.hasAura("Dragon God")) { heavenlyMult *= 1.05; }
		}
		$("#prestigeGainCpsHelp, #prestigeDesiredCpsHelp").toggleClass("hidden", Game.heavenlyMultiplier > 0 || !Game.cookiesPs);

		//prestige gained from resetting
		var prestigeGain = Math.floor(Game.HowMuchPrestige(cookiesBakedAllTime));
		var prestigeGainDiff = Math.max(prestigeGain - Game.prestige, 0) || 0;
		var gainStr = Game.formatNumber(prestigeGain) + " (+" + Game.formatNumber(prestigeGainDiff) + ")";
		if (prestigeGainDiff > 0 && Game.prestige > 0) {
			gainStr += " (+" + Game.Beautify(prestigeGainDiff / prestigeGain * 100, 1) + "%)";
		}
		byId("prestigeGain").innerHTML = gainStr;

		var cpsStr = "--- CpS";
		if (prestigeGainDiff > 0 && Game.cookiesPs > 0) {
			Game.temp.prestige = prestigeGain;
			cpsObj = Game.CalculateGains(heavenlyMult);
			cpsStr = Game.formatNumber(cpsObj.cookiesPs, 1) + " CpS (+" +
				Game.formatNumber(Math.max(cpsObj.cookiesPs - Game.cookiesPs, 0), 1) + ")";
			if (Game.clicksPs > 0) {
				cpsStr += ", " + Game.formatNumber(cpsObj.cookiesPsPlusClicks, 1) + " CpS (+" +
					Game.formatNumber(Math.max(cpsObj.cookiesPsPlusClicks - Game.cookiesPsPlusClicks, 0), 1) + ")";
			}
		}
		byId("prestigeGainCps").innerHTML = cpsStr;

		var cookiesForNextLevel = Math.max(Game.HowManyCookiesResetAdjusted(prestigeGain + 1) - cookiesBakedAllTime, 0) || 0;
		var timeForNextLevel = Game.cookiesPsPlusClicks > 0 && cookiesForNextLevel > 0 ? Math.ceil(cookiesForNextLevel / Game.cookiesPsPlusClicks) :
			"---";
		byId("cookiesNextPrestige").innerHTML = Game.formatNumber(cookiesForNextLevel);
		byId("cookiesNextPrestigeTime").innerHTML = Game.formatTime(timeForNextLevel);

		//prestige gained from desired (if applicable)
		var prestigeDesired = byId("prestigeDesiredIn").parsedValue;
		var prestigeDesiredDiff = Math.max(prestigeDesired - Game.prestige, 0) || 0;

		$("#prestigeDesiredGainRow, #cookiesPrestigeNeedRow").toggleClass("hidden", !prestigeDesiredDiff);
		gainStr = Game.formatNumber(prestigeDesired) + " (+" + Game.formatNumber(prestigeDesiredDiff) + ")";
		if (prestigeDesiredDiff > 0 && Game.prestige > 0) {
			gainStr += " (+" + Game.Beautify(prestigeDesiredDiff / prestigeDesired * 100, 1) + "%)";
		}
		byId("prestigeDesiredGain").innerHTML = gainStr;

		cpsStr = "--- CpS";
		if (prestigeDesiredDiff > 0 && Game.cookiesPs > 0) {
			Game.temp.prestige = prestigeDesired;
			cpsObj = Game.CalculateGains(heavenlyMult);
			cpsStr = Game.formatNumber(cpsObj.cookiesPs, 1) + " CpS (+" +
				Game.formatNumber(Math.max(cpsObj.cookiesPs - Game.cookiesPs, 0), 1) + ")";
			if (Game.clicksPs > 0) {
				cpsStr += ", " + Game.formatNumber(cpsObj.cookiesPsPlusClicks, 1) + " CpS (+" +
					Game.formatNumber(Math.max(cpsObj.cookiesPsPlusClicks - Game.cookiesPsPlusClicks, 0), 1) + ")";
			}
		}
		byId("prestigeDesiredCps").innerHTML = cpsStr;

		var cookiesForDesired = Math.max(Game.HowManyCookiesResetAdjusted(prestigeDesired) - cookiesBakedAllTime, 0) || 0;
		var timeForDesired = Game.cookiesPsPlusClicks > 0 && cookiesForDesired > 0 ? Math.ceil(cookiesForDesired / Game.cookiesPsPlusClicks) : "---";
		byId("cookiesPrestigeNeed").innerHTML = Game.formatNumber(cookiesForDesired);
		byId("cookiesPrestigeNeedTime").innerHTML = Game.formatTime(timeForDesired);

		Game.temp.prestige = Game.prestige;
	};

	//golden cookies
	var gcShowClicks = false;
	var gcEffectMult = 1;
	var gcWrathEffectMult = 1;
	var gcDurationMult = 1;

	//list of effects; .calc for the table and .details if it's selected
	var gcEffectsList = [
		{
			name: "Frenzy CpS",
			detailName: " frenzy",
			calc: function(str, cpsMultObj) {
				if (cpsMultObj.base || (cpsMultObj.current && (Game.buffMultCps === 1 || Game.buffMultCps === 0))) {
					return (str + '<td class="noSel">---</td>');
				}
				var html = Game.BeautifyAbbr(cpsMultObj.cookiesPs);
				var sum = Game.BeautifyAbbr(cpsMultObj.cookiesPs * cpsMultObj.duration);
				var title = cpsMultObj.duration + " seconds at " + Game.BeautifyAbbr(cpsMultObj.cookiesPs) + " CpS";
				if (gcShowClicks) {
					title += " + " + Game.BeautifyAbbr(cpsMultObj.cookiesPerClick) + " per click";
					sum = Game.BeautifyAbbr(cpsMultObj.cookiesPsPlusClicks * cpsMultObj.duration);
				}
				title += " = " + sum;
				return (str + "<td" + cpsMultObj.className + ' data-title="' + title + '">' + html + "</td>");
			},
			details: function(cpsMultObj) {
				var sum = Game.formatNumber(cpsMultObj.cookiesPs * cpsMultObj.duration);
				var str = cpsMultObj.duration + " seconds at " + Game.formatNumber(cpsMultObj.cookiesPs) + " CpS";
				if (gcShowClicks) {
					str += " + " + Game.formatNumber(cpsMultObj.cookiesPerClick) + " per click";
					sum = Game.formatNumber(cpsMultObj.cookiesPsPlusClicks * cpsMultObj.duration);
				}
				return (str + " = " + sum);
			}
		}, {
			name: "Max Lucky!",
			detailName: " Max Lucky!",
			calc: function(str, cpsMultObj) {
				var mult = cpsMultObj.type === "wrath" ? gcWrathEffectMult : gcEffectMult;
				var html = mult * cpsMultObj.cookiesPs * 900 + 13;
				var title = "Bank: " + Game.BeautifyAbbr(Math.ceil(cpsMultObj.cookiesPs * 6000)); //60 * 15 / 0.15
				return (str + "<td" + cpsMultObj.className + ' data-title="' + title + '">' + Game.BeautifyAbbr(html) + "</td>");
			},
			details: function(frenzy) {
				var mult = frenzy.type === "wrath" ? gcWrathEffectMult : gcEffectMult;
				return (Game.formatNumber(mult * frenzy.cookiesPs * 900 + 13) + " - Bank: " + Game.formatNumber(Math.ceil(frenzy.cookiesPs * 6000)));
			}
		}, {
			name: "x777 Click frenzy",
			calc: function(str, cpsMultObj) {
				var cookiesPerClick = cpsMultObj.cookiesPerClick;
				if (!Game.hasBuff("Click frenzy")) { cookiesPerClick *= 777; }
				var duration = Math.ceil(13 * gcDurationMult);
				var html = Game.BeautifyAbbr(cookiesPerClick);
				var title = duration + " seconds at " + html + " per click";
				if (Game.clicksPs > 0) {
					title += " = " + Game.BeautifyAbbr(cookiesPerClick * Game.clicksPs * duration);
				}
				return (str + "<td" + cpsMultObj.className + ' data-title="' + title + '">' + html + "</td>");
			},
			details: function(cpsMultObj) {
				var cookiesPerClick = cpsMultObj.cookiesPerClick;
				if (!Game.hasBuff("Click frenzy")) { cookiesPerClick *= 777; }
				if (cpsMultObj.current && Game.hasBuff("Click frenzy")) { cookiesPerClick = cpsMultObj.cookiesPerClick; }
				var duration = Math.ceil(13 * gcDurationMult);
				return (duration + " seconds at " + Game.formatNumber(cookiesPerClick) + " per click" +
					(Game.clicksPs > 0 ? " = " + Game.formatNumber(cookiesPerClick * Game.clicksPs * duration) : ""));
			}
		}, {
			name: "x1111 Dragonflight",
			className: "dragonflight",
			calc: function(str, cpsMultObj) {
				var cookiesPerClick = cpsMultObj.cookiesPerClick;
				if (!Game.hasBuff("Dragonflight")) { cookiesPerClick *= 1111; }
				var duration = Math.ceil(10 * gcDurationMult);
				var html = Game.BeautifyAbbr(cookiesPerClick);
				var title = duration + " seconds at " + html + " per click";
				if (Game.clicksPs > 0) {
					title += " = " + Game.BeautifyAbbr(cookiesPerClick * Game.clicksPs * duration);
				}
				return (str + "<td" + cpsMultObj.className + ' data-title="' + title + '">' + html + "</td>");
			},
			details: function(cpsMultObj) {
				var cookiesPerClick = cpsMultObj.cookiesPerClick;
				if (!Game.hasBuff("Dragonflight")) { cookiesPerClick *= 1111; }
				var duration = Math.ceil(10 * gcDurationMult);
				return (duration + " seconds at " + Game.formatNumber(cookiesPerClick) + " per click" +
					(Game.clicksPs > 0 ? " = " + Game.formatNumber(cookiesPerClick * Game.clicksPs * duration) : ""));
			}
		}
	];

	var $gcTableTbody = $("#gCookiesTable tbody");

	var gcCpsMults = [
		{
			mult: 0.5,
			baseDuration: 66,
			type: "wrath"
		},
		{
			mult: 1,
			baseDuration: 0,
			base: true
		},
		{
			mult: 7,
			baseDuration: 77,
			reindeerMult: 0.75
		},
		{
			mult: 15,
			baseDuration: 60,
			type: "harvest"
		},
		{
			mult: 666,
			baseDuration: 6,
			type: "wrath",
			reindeerMult: 0.5
		}
	];
	var gcCpsMultCurrent = {
		mult: 1,
		baseDuration: 0,
		type: "current",
		current: true,
		reindeerMult: 1,
		header: byId("gCookiesCurrentBuffHeader")
	};
	gcCpsMults.push(gcCpsMultCurrent);

	for (i = gcCpsMults.length - 1; i >= 0; i--) {
		var cpsMultObj = gcCpsMults[i];
		cpsMultObj.className = cpsMultObj.type ? ' class="' + cpsMultObj.type + '"' : "";
	}

	Game.updateGoldenCookies = function() {
		gcShowClicks = Game.cookiesPs > 0 && Game.clicksPs > 0 && Game.hasClickPercent;
		var gMult = Game.HasUpgrade("Green yeast digestives") ? 1.01 : 1;
		gcEffectMult = gMult * (Game.hasAura("Unholy Dominion") ? 1.1 : 1) * Game.eff("goldenCookieGain");
		gcWrathEffectMult = gMult * (Game.hasAura("Ancestral Metamorphosis") ? 1.1 : 1) * Game.eff("wrathCookieGain");

		/* $('#gCookiesInfo').toggleClass('hideWrath', !Game.HasUpgrade('One mind'))
		.toggleClass('hideHarvest', !Game.hasAura('Reaper of Fields'))
		.toggleClass('hideFlight', !Game.hasAura('Dragonflight')); */

		gcDurationMult = Game.getGoldCookieDurationMod();

		var duration;
		var mult = 1;
		if (Game.buffMultCps !== 1) {
			for (var name in Game.Buffs) {
				var buff = Game.Buffs[name];
				if (buff.multCpS) {
					var time = buff.time / Game.fps;
					if (duration) {
						duration = Math.min(duration, time);
					} else {
						duration = time;
					}
				}
			}

			if (Game.hasBuff("Frenzy")) {
				mult *= 0.75;
			}
			if (Game.hasBuff("Elder frenzy")) {
				mult *= 0.5;
			}
		}

		gcCpsMultCurrent.mult = Game.buffMultCps;
		gcCpsMultCurrent.baseDuration = duration || 0;
		gcCpsMultCurrent.reindeerMult = mult;
		gcCpsMultCurrent.header.innerHTML = "x" + Game.formatNumber(Game.buffMultCps, 1);

		var reindeerHtml = "";
		var reindeerBonusMult = 1;
		var reindeerBonusText = "";
		if (Game.HasUpgrade("Ho ho ho-flavored frosting")) {
			reindeerBonusMult = 2;
		}
		reindeerBonusMult *= Game.eff("reindeerGain");
		if (reindeerBonusMult !== 1) {
			reindeerBonusText = " x" + Game.Beautify(reindeerBonusMult, 2);
		}

		var currentIsRedundant = false;
		for (var i = gcCpsMults.length - 1; i >= 0; i--) {
			var cpsMultObj = gcCpsMults[i];
			if (!cpsMultObj.current && cpsMultObj.mult === Game.buffMultCps) {
				currentIsRedundant = true;
				break;
			}
		}

		for (i = gcCpsMults.length - 1; i >= 0; i--) {
			cpsMultObj = gcCpsMults[i];
			cpsMultObj.duration = Math.ceil(cpsMultObj.baseDuration * gcDurationMult);
			cpsMultObj.cookiesPs = Game.unbuffedCookiesPs * cpsMultObj.mult;
			cpsMultObj.cookiesPerClick = Game.calcCookiesPerClick(cpsMultObj.cookiesPs, true);
			cpsMultObj.cookiesPsPlusClicks = cpsMultObj.cookiesPs + Game.clicksPs * cpsMultObj.cookiesPerClick;

			if (cpsMultObj.current && currentIsRedundant) {
				continue;
			}
			var reindeerCookies = cpsMultObj.cookiesPs * 60;
			var frenzyReindeerMultText = "";
			if (cpsMultObj.reindeerMult && cpsMultObj.reindeerMult !== 1) {
				reindeerCookies *= cpsMultObj.reindeerMult;
				frenzyReindeerMultText = " x" + cpsMultObj.reindeerMult;
			}

			reindeerHtml = "<div" + cpsMultObj.className + ">1 minute x" + Game.formatNumber(cpsMultObj.mult, 1) +
				" production" + reindeerBonusText + frenzyReindeerMultText + ": " +
				Game.formatNumber(Math.max(25, reindeerCookies) * reindeerBonusMult) + "</div>" + reindeerHtml;
		}

		$("#reindeerWrite").html(reindeerHtml);

		$gcTableTbody.empty();
		var len = gcEffectsList.length;
		for (i = 0; i < len; i++) {
			var effects = gcEffectsList[i];
			var tr = $("<tr></tr>").html("<td>" + effects.name + "</td>" + gcCpsMults.reduce(effects.calc, ""))
				.appendTo($gcTableTbody);
			if (effects.className) {
				tr.addClass(effects.className);
			}
		}

		Game.updateGoldenCookiesDetails();
	};

	Game.gcSelectedCells = [];
	Game.getGCCellFrenzyIndeces = function(cell) {
		var $cell = $(cell);
		var $par = $cell.parent();
		return [$gcTableTbody.children().index($par), $par.children().index(cell)];
	};
	var gcTableTbody = $gcTableTbody[0];
	var $gcClose = $('<span class="close" data-title="Remove this">x</span>');

	Game.updateGoldenCookiesDetails = function() {
		$("#gCookiesTable .gcSelected").removeClass("gcSelected");
		var $par = $("#gCookiesDetails").empty();
		var hasSelected = false;

		// show details for cells that currently exist and are not hidden
		for (var i = Game.gcSelectedCells.length - 1; i >= 0; i--) {
			var indeces = Game.gcSelectedCells[i].split(",");
			var tr = gcTableTbody.children[indeces[0]];
			if (!tr) { continue; }

			var cell = tr.children[indeces[1]];
			var $cell = $(cell);
			if (cell && !$cell.hasClass("noSel")) {
				hasSelected = true;
				var effects = gcEffectsList[indeces[0]];
				var cpsMultObj = gcCpsMults[indeces[1] - 1];
				var $ele = $("<div" + cpsMultObj.className + ">x" + cpsMultObj.mult + (effects.detailName || (" + " + effects.name)) +
					": " + effects.details(cpsMultObj) + "</div>")
					.prependTo($par);
				$gcClose.clone().prependTo($ele)[0].gcIndex = Game.gcSelectedCells[i];

				$cell.addClass("gcSelected");
			}
		}

		$("#gCookiesDetailsBlock").toggleClass("hidden", !hasSelected);
	};

	function processAchs(achs) {
		if (!achs || !Array.isArray(achs)) {
			return [];
		}
		var u = {};
		var a = [];
		for (var i = 0, len = achs.length; i < len; i++) {
			if (!u.hasOwnProperty(achs[i].id)) {
				a.push(achs[i]);
				u[achs[i].id] = true;
			}
		}
		return a.sort(Game.sortByOrderFunc);
	}

	Game.updateRecommended = function () {
		var mode = Game.predictiveMode;
		if ($('#recommended').length === 0) {
			$("#topBar").append('<div id=recommended>');
			$('head').append('<style>#recommended .tinyIcon {vertical-align: middle;\n' +
				'display: inline-block;\n' +
				'transform: scale(0.5);\n' +
				'margin: -16px;}</style>')
		}
		var $par = $('#recommended').empty();
		var enableLookahead = byId("multiBuildRecCheck").checked && !Game.altMode;

		var i = 0;
		var reccedCount = 0;
		var len = Game.recommendList.length;
		var reccedBuildings = {};

		while (i < len && reccedCount < Game.maxRecommend) {
			var recObj = Game.recommendList[i];
			i++;

			var $ele = null;

			if (recObj.type === "building") {
				if (reccedBuildings[recObj.gameObj.name]) {
					continue;
				}
				reccedBuildings[recObj.gameObj.name] = true;
			}

			if (recObj.type === "upgrade chain" && Game.altMode) {
				if (reccedBuildings[recObj.building.name]) {
					continue;
				}
				$ele = $(getRecommendedListHTML(recObj.building.recommendObj));
				$ele[0].recommendObj = recObj.building.recommendObj;
				reccedBuildings[recObj.building.name] = true;
			}

			if (recObj.type === "building" && enableLookahead) {
				var obj = recObj.lookaheadObj;
				if (!obj) {
					obj = Game.lookahead(recObj, reccedCount);
					recObj.lookaheadObj = obj;
				}
				if (obj.toAmount > recObj.toAmount) {
					$ele = $(getRecommendedListHTML(obj)).addClass("lookAheadRec");
					$ele[0].recommendObj = obj;
				}
			}
			if (!$ele) {
				$ele = $(getRecommendedListHTML(recObj));
				$ele[0].recommendObj = recObj;
			}
			$ele.appendTo($par);

			reccedCount++;
			$("<br>").appendTo($par);
		}

		Game.setPredictiveMode();
		Game.predictiveMode = mode;
	};

	var escapeHTMLChars = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;"
	};

	Game.escapeHTML = function(str) {
		return str.replace(/[&<>'"]/g, function(c) {
			return escapeHTMLChars[c];
		});
	};

	function getRecommendedListHTML(recObj) {
		//15% of bank >= 15 minutes (60 * 15) production
		var bankMult = 6000 * (1 + 6 * byId("bankFrenzy").checked);

		if (!recObj.earnedAchs) {
			recObj.earnedAchs = processAchs(recObj.cpsObj.earnedAchs);
		}

		var str = '<span class="recPurchase clickme"><span';
		if (recObj.title) {
			str += ' data-title="' + Game.escapeHTML(recObj.title.replace("<br>", "")) + '"';
		}
		str += ">" + recObj.name + "</span> - Price: " + Game.formatNumber(recObj.price) +
			", +" + Game.formatNumber(recObj.cpsObj.cookiesPsPlusClicksDiff, 1) + " CpS";

		if (recObj.earnedAchs && recObj.earnedAchs.length > 0) {
			str += ', <span class="earnedAchsSpan tooltipped">+' + recObj.earnedAchs.length +
				" achievement" + (recObj.earnedAchs.length === 1 ? "" : "s") + "</span>";
		}

		if (!byId("bankNone").checked) {
			str += ", Bank: " + Game.formatNumber(recObj.price +
				Math.ceil((byId("bankFullCheck").checked ? recObj.cpsObj.cookiesPs : Game.cookiesPs) * bankMult));
		}

		return (str + "</span>");
	}


	//looks ahead up to Game.maxLookahead levels to combine object purchases
	//stops if there are more immediately better purchases than index,
	//where index is the object's 0-indexed position in the recommended list
	Game.lookahead = function(recObj, index) {
		var b = 2;
		var i;
		var compareCpsObj;

		var checkChains = byId("multiBuildRecCheck").checked;

		var checkSanta = !Game.santa.blacklistCheckbox.checked && Game.santa.dropEle.selectedIndex &&
			Game.santaLevel < Game.santaMax && Game.HasUpgrade("Santa's legacy");

		var lookaheadObj = $.extend({}, recObj);
		var lookaheadBuilding = recObj.gameObj;
		var baseAmount = lookaheadBuilding.amount;

		Game.setPredictiveMode();

		lookaheadLabel:
			while (b <= Game.maxLookahead) {
				var betterPurchases = 0;

				//set base state to having purchased the building level(s)
				var earnedAchs = lookaheadObj.cpsObj.earnedAchs;
				Game.temp.cpsObj = lookaheadObj.cpsObj;
				Game.temp.cookiesBaked = Game.cookiesBaked + lookaheadObj.cpsObj.price;

				Game.setChanges([
					{
						gameObj: lookaheadBuilding,
						amount: lookaheadObj.toAmount
					}
				], earnedAchs, null, true);

				//full recalc, just in case
				var nextLevelCpsObj = Game.setChanges([
					{
						gameObj: lookaheadBuilding,
						amount: baseAmount + b * Game.buildingBuyInterval
					}
				], []);
				var nextRate = nextLevelCpsObj.rate;
				lookaheadBuilding.tempAmount = lookaheadObj.toAmount; //gotta set again bluh

				if (checkSanta) {
					Game.temp.santaLevel = Game.santaLevel + 1;
					compareCpsObj = Game.calculateChanges(Game.santa.price, []);
					Game.temp.santaLevel = Game.santaLevel;
					Game.resetAchievements(compareCpsObj.earnedAchs);

					if (compareCpsObj.rate > 0 && compareCpsObj.rate < nextRate) {
						betterPurchases++;
					}
					if (betterPurchases > index) {
						break lookaheadLabel;
					}
				}

				for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
					var building = Game.ObjectsById[i];
					if (building === lookaheadBuilding || building.blacklistCheckbox.checked) {
						continue;
					}

					compareCpsObj = Game.setChanges([{gameObj: building}], [], "CalculateBuildingGains");
					if (compareCpsObj.rate > 0 && compareCpsObj.rate < nextRate) {
						betterPurchases++;
					}
					if (betterPurchases > index) {
						break lookaheadLabel;
					}
				}

				for (i = Game.UpgradesToCheck.length - 1; i >= 0; i--) {
					var upgrade = Game.UpgradesToCheck[i];
					var req = upgrade.unlocked || (upgrade.require && upgrade.require());
					if (req) {
						compareCpsObj = Game.setChanges([{gameObj: upgrade}], []);
						if (compareCpsObj.rate > 0 && compareCpsObj.rate < nextRate) {
							betterPurchases++;
						}
						if (betterPurchases > index) {
							break lookaheadLabel;
						}
					}

					var chain = upgrade.chain;
					if (chain && checkChains && !req && chain.require()) {
						compareCpsObj = Game.setChanges(Game.getUpgradeBuildChainChangeArr(upgrade, chain), [], "CalculateBuildingGains");
						lookaheadBuilding.tempAmount = lookaheadObj.toAmount; //gotta be safe
						if (compareCpsObj.rate > 0 && compareCpsObj.rate < nextRate) {
							betterPurchases++;
						}
						if (betterPurchases > index) {
							break lookaheadLabel;
						}
					}
				}

				lookaheadObj.price += nextLevelCpsObj.price;
				nextLevelCpsObj.earnedAchs = earnedAchs.concat(nextLevelCpsObj.earnedAchs);
				lookaheadObj.cpsObj = nextLevelCpsObj;
				lookaheadObj.toAmount = baseAmount + b * Game.buildingBuyInterval;
				Game.resetAchievements();
				b++;
			}

		lookaheadBuilding.resetTemp();
		return {
			type: lookaheadBuilding.type,
			name: lookaheadBuilding.getRecommendedName(lookaheadObj.toAmount),
			gameObj: lookaheadBuilding,
			toAmount: lookaheadObj.toAmount,
			price: lookaheadObj.price,
			order: lookaheadBuilding.id,
			cpsObj: lookaheadObj.cpsObj,
			rate: lookaheadObj.cpsObj.rate
		};
	};

	Game.updateBlacklist = function() {
		var blEles = $("#blacklistEles .blacklistEle");
		blEles.filter(".hidden:has(:checked)").removeClass("hidden");
		var visibleEles = blEles.filter(":not(.hidden)");
		var visibleChecked = blEles.filter(":has(:checked)");

		$("#blackClear").toggleClass("hidden", !blEles.filter(".hidden:has(:checked)").length);
		var blackCheckAll = byId("blackCheckAll");
		blackCheckAll.checked = visibleEles.length === visibleChecked.length;
		blackCheckAll.indeterminate = visibleChecked.length > 0 && !blackCheckAll.checked;
	};


	Game.filterAchievements = function() {
		var filterAchs = byId("achFilterUnowned").checked;
		var hideAchs = byId("achHideCheck").checked;

		$(document.body).toggleClass("mysteryAchs", hideAchs);
		$("#achIcons").toggleClass("hideEarnedAchs", filterAchs);
		$(".achBlock").each(function() {
			var $ele = $(this);
			var $achs = $ele.find(".achievement");
			var enabled = $achs.filter(".enabled").length;
			$ele.toggleClass("hidden", (hideAchs && filterAchs) || (hideAchs && !enabled) || (filterAchs && enabled === $achs.length));
		});
	};

	var UpgradeSortFunctions = {
		price: function(a, b) { return (a.price - b.price) || (a.order - b.order); },
		cps: function(a, b) { return ((a.cps || 0) - (b.cps || 0)) || (a.order - b.order); },
		rate: function(a, b) { return ((a.rate || 0) - (b.rate || 0)) || (a.order - b.order); },
		amort: function(a, b) { return ((a.amort || 0) - (b.amort || 0)) || (a.order - b.order); }
	};

	var UpgradeFilterFunctions = {
		all: function() { return true; },
		unowned: function(upgrade) { return !upgrade.bought; },
		owned: function(upgrade) { return upgrade.bought; }
	};

	function sortArray(arr, sortFunction, sortDesc) {
		arr = arr.slice(0);
		if (typeof sortFunction === "function") {
			arr.sort(sortFunction);
		}
		if (sortDesc) {
			arr.reverse();
		}
		return arr;
	}

	Game.sortAndFilterUpgrades = function() {
	};


	//guesstimates the minimum cookies baked this ascension you'd need for everything
	//assumes everything is bought with current price reduction upgrades
	//(including the very upgrades that provide said reduction 'cause to do otherwise is a pain)
	//also to set a difference when importing just in case the save is from a version with different prices and this voodoo would be thrown off
	Game.getMinCumulative = function() {
		var cumu = 0, upgrade, i;
		for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
			var building = Game.ObjectsById[i];
			cumu += building.getPriceSum((Game.ascensionMode === 1 ? 0 : building.free), building.getAmount());
		}

		for (i = Game.UpgradesById.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesById[i];
			if (
				upgrade.pool !== "prestige" && upgrade.pool !== "toggle" &&
				!upgrade.groups.santaDrop && !upgrade.groups.egg &&
				upgrade.getBought() && !upgrade.isPerm
			) {
				cumu += upgrade.getPrice();
			}
		}

		upgrade = Game.Upgrades["Elder Pledge"];
		for (i = Game.pledges; i > 0; i--) {
			cumu += upgrade.getPrice(i - 1);
		}

		cumu += Game.seasonTriggerBasePrice * Game.seasonUses;
		// upgrade = Game.UpgradesByGroup.seasonSwitch[0];
		// for (i = Game.seasonUses; i > 0; i--) {
		// 	cumu += upgrade.getPrice(i - 1);
		// }

		for (i = Game.santaLevel; i > 0; i--) {
			cumu += Math.pow(i, i);
		}

		//assumes you bought each santa drop/easter egg before getting another
		//(and again ignoring that there are price reduction upgrades in both lists for sanity's sake)
		var level = 0;
		for (i = Game.UpgradesByGroup.santaDrop.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.santaDrop[i];
			if (upgrade.getBought() && !upgrade.isPerm) {
				cumu += upgrade.getPrice(level);
				level++;
			}
		}

		var eggs = 0;
		for (i = Game.UpgradesByGroup.egg.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.egg[i];
			if (upgrade.getBought() && !upgrade.isPerm) {
				cumu += upgrade.getPrice(eggs);
				eggs++;
			}
		}

		var end = Math.min(Game.dragonLevel, Game.dragonLevels.length);
		if (!Game.includeDragonSacrifices) { end = Math.min(end, 5); }
		for (i = 0; i < end; i++) {
			var lvl = Game.dragonLevels[i];
			cumu += lvl.cumuCost ? lvl.cumuCost() : 0;
		}

		return cumu;
	};

	Game.toggleShowDebug = function(toggle) {
		toggle = typeof toggle === "undefined" ? !Game.showDebug : Boolean(toggle);
		Game.showDebug = toggle;
		$(document.body).toggleClass("hideDebug", Game.HasUpgrade("Neuromancy") ? false : !toggle);
		return toggle;
	};
	$(document.body).toggleClass("hideDebug", !Game.showDebug);

	//#endregion update()


	function parseBoolean(n) {
		return Boolean(Game.parseNumber(n));
	}

	var clearSpaceRgx = /\s/g;

	Game.importSave = function(saveCode) {
		var save = saveCode || prompt("Please paste in the code that was given to you on save export.", "");
		if (!save || typeof save !== "string") {
			return false;
		}
		save = save.replace(clearSpaceRgx, "");

		var toStore = save; //save now write later, just in case of error
		save = decodeSave(save);
		if (!save) { return false; }

		// save = save.split("|");
		save = splitSave(save);

		var version = parseFloat(save[0]);
		if (isNaN(version) || save.length < 5 || version < 1) {
			alert("Oops, looks like the import string is all wrong!");
			return false;
		}
		if (version > Game.version) {
			alert("Error : you are attempting to load a save from a future version (v." + version + "; you are using v." + Game.version + ").");
		}

		Game.predictiveMode = false;
		var i, building, upgrade, achieve, mestr, bought;

		var spl = save[2].split(";"); //save stats
		Game.setInput("#sessionStartTime", parseInt(spl[0], 10));
		Game.bakeryName = spl[3] || Game.RandomBakeryName();
		Game.bakeryNameLowerCase = Game.bakeryName.toLowerCase();
		byId("bakeryNameIn").value = Game.bakeryName;
		Game.setSeed(spl[4]);

		//save[3] is preferences so meh

		spl = save[4].split(";"); //cookies and lots of other stuff
		var cookies = Math.floor(parseFloat(spl[0]));
		var cookiesBaked = Game.setInput("#cookiesBaked", Math.floor(parseFloat(spl[1])));

		var cookiesReset = Game.setInput("#cookiesReset", Math.floor(parseFloat(spl[8])) || 0);
		Game.pledges = parseInt(spl[10], 10) || 0;

		Game.santaLevel = parseInt(spl[18], 10) || 0;
		Game.santa.dropEle.selectedIndex = Game.santaLevel ? Game.santaLevel + 1 : 0;
		Game.setInput("#seasonCountIn", parseInt(spl[21], 10) || 0);

		var season = spl[22] || Game.defaultSeason; //will set season later
		var wrinklers = parseInt(spl[24], 10) || 0;

		// Game.prestige = Game.setInput('#prestigeIn', parseFloat(spl[25]) || 0);
		Game.ascensionMode = parseInt(spl[29], 10) || 0;
		byId("bornAgainCheck").checked = Game.ascensionMode === 1;

		Game.permanentUpgrades = [30, 31, 32, 33, 34].map(function(i) {
			return (spl[i] ? parseInt(spl[i], 10) : -1);
		});

		var dragonLevel = parseInt(spl[35], 10);
		if (version < 2.0041 && dragonLevel === Game.dragonLevels.length - 2) { dragonLevel = Game.dragonLevels.length - 1; }
		Game.setInput("#dragonLevelIn", dragonLevel);
		Game.setAura(0, 0); //reset auras to make sure there's not a problem
		Game.setAura(1, 0);
		Game.setAura(0, parseInt(spl[36], 10) || 0);
		Game.setAura(1, parseInt(spl[37], 10) || 0);

		var lumps = parseFloat(spl[42]) || -1;
		Game.setInput("#lumpsIn", lumps);
		Game.setInput("#heraldsIn", parseInt(spl[48], 10) || 0);

		spl = save[5].split(";"); //buildings
		for (i = 0; i < Game.ObjectsById.length; i++) {
			building = Game.ObjectsById[i];
			var amount = 0;
			var level = 0;

			var minigameStr = "";

			if (spl[i]) {
				mestr = spl[i].toString().split(",");
				amount = parseInt(mestr[0], 10) || 0;
				level = parseInt(mestr[3], 10) || 0;

				minigameStr = mestr[4];
			}

			building.amount = Game.setInput(building.amountIn, amount);
			building.level = Game.setInput(building.levelIn, level);
			building.free = 0;
			building.priceCache = {};

			if (building.minigame) {
				building.minigame.reset();
				building.minigame.load(minigameStr);
			}
		}


		if (version < 1.035) { //old non-binary algorithm
			spl = save[6].split(";"); //upgrades
			for (i = 0; i < Game.UpgradesById.length; i++) {
				upgrade = Game.UpgradesById[i];
				upgrade.unlocked = false;
				bought = false;
				if (spl[i]) {
					mestr = spl[i].split(",");
					upgrade.unlocked = parseBoolean(mestr[0]);
					bought = parseBoolean(mestr[1]);
				}
				upgrade.setBought(bought);
			}

			spl = save[7] ? save[7].split(";") : []; //achievements
			for (i = 0; i < Game.AchievementsById.length; i++) {
				achieve = Game.AchievementsById[i];
				achieve.won = false;
				if (spl[i]) {
					mestr = spl[i].split(",");
					achieve.won = parseBoolean(mestr[0]);
				}
			}

		} else if (version < 1.0502) { //old awful packing system
			spl = save[6] || []; //upgrades
			spl = version < 1.05 ? UncompressLargeBin(spl) : unpack(spl);

			for (i = 0; i < Game.UpgradesById.length; i++) {
				upgrade = Game.UpgradesById[i];
				upgrade.unlocked = false;
				bought = false;
				if (spl[i * 2]) {
					upgrade.unlocked = parseBoolean(spl[i * 2]);
					bought = parseBoolean(spl[i * 2 + 1]);
				}
				upgrade.setBought(bought);
			}

			spl = save[7] || []; //achievements
			spl = version < 1.05 ? UncompressLargeBin(spl) : unpack(spl);
			for (i = 0; i < Game.AchievementsById.length; i++) {
				achieve = Game.AchievementsById[i];
				achieve.won = false;
				if (spl[i]) {
					achieve.won = parseBoolean(spl[i]);
				}
			}
		} else {

			spl = save[6] || []; //upgrades
			if (version < 2.0046) { spl = unpack2(spl); }
			spl = spl.split("");
			for (i = 0; i < Game.UpgradesById.length; i++) {
				upgrade = Game.UpgradesById[i];
				upgrade.unlocked = false;
				bought = false;
				if (spl[i * 2]) {
					upgrade.unlocked = parseBoolean(spl[i * 2]);
					bought = parseBoolean(spl[i * 2 + 1]);
				}
				upgrade.setBought(bought);
			}

			spl = save[7] || []; //achievements
			if (version < 2.0046) { spl = unpack2(spl); }
			spl = spl.split("");
			for (i = 0; i < Game.AchievementsById.length; i++) {
				achieve = Game.AchievementsById[i];
				achieve.won = false;
				if (spl[i]) {
					achieve.won = parseBoolean(spl[i]);
				}
			}
		}
		Game.setSeason(season);

		if (version < 1.0503) { //upgrades that used to be regular, but are now heavenly
			upgrade = Game.Upgrades["Persistent memory"];
			upgrade.unlocked = false;
			upgrade.setBought(false);
			upgrade = Game.Upgrades["Season switcher"];
			upgrade.unlocked = false;
			upgrade.setBought(false);
		}

		Game.prestige = Game.setInput("#prestigeIn", Math.floor(Game.HowMuchPrestige(cookiesReset)));

		if (version === 1.9) { //are we importing from the 1.9 beta? remove all heavenly upgrades
			for (i = Game.UpgradesByPool.prestige; i >= 0; i--) {
				upgrade = Game.UpgradesByPool.prestige[i];
				upgrade.unlocked = false;
				upgrade.setBought(false);
			}
		}

		//set after to make sure it's properly limited by elder spice
		Game.setInput("#numWrinklersIn", wrinklers);

		Game.killBuffs();
		spl = (save[8] || "").split(";"); //buffs
		for (i = 0; i < spl.length; i++) {
			if (spl[i]) {
				mestr = spl[i].toString().split(",");
				var type = Game.BuffTypes[parseInt(mestr[0], 10)];
				if (type && !type.hidden) {
					Game.gainBuff(type.name,
						[parseFloat(mestr[1]) / Game.fps, parseFloat(mestr[3] || 0), parseFloat(mestr[4] || 0), parseFloat(mestr[5] || 0)]);
				}
			}
		}

		Game.setPriceMultArrays();
		var minCumu = Game.getMinCumulative() + cookies;
		Game.minCumulativeOffset = Math.max(minCumu - cookiesBaked, 0);

		Game.storedImport = toStore;
		Game.clearBuffSelection();
		Game.setBuffObjectInputs();
		Game.clearAuraSelection();
		// Game.clearPantheonSelection();
		$("#reimportSave").removeClass("hidden");
		Game.update();
		return true;
	};

})(myWindow, jQuery);

(function(window, $) {
	"use strict";

	var Game = window.Game;
	var byId = window.byId;
	var document = window.document;

	Game.init = function() {
		"use strict";
		console.log('init');

		if (!Game.firstRun) { return; }

		//#region start stuff


		$(window).on("keydown keyup", function(ev) {
			Game.focusing = false;
			var testkey = Game.checkEventAltMode(ev);
			if (typeof testkey !== "undefined" && testkey !== Game.altMode) {
				Game.altMode = Boolean(testkey);
				Game.updateRecommended();
				Game.clearTooltip();
			}

		}).on("focus", function() { Game.focusing = true; })
			.on("click", function(ev) {
				if (Game.focusing) {
					Game.focusing = false;
					var testkey = Game.checkEventAltMode(ev);
					if (typeof testkey !== "undefined" && testkey !== Game.altMode) {
						Game.altMode = Boolean(testkey);
						Game.updateRecommended();
						Game.clearTooltip();
					}
				}
			});

		//old key format
		localStorage.removeItem("CCalcAbbreviateNums");
		localStorage.removeItem("CCalcClicks");
		localStorage.removeItem("CCalcHideInfo");
		localStorage.removeItem("CCalcShowBank");
		//read from saves now
		localStorage.removeItem("CCalc.Heralds");

		var localAbbr = true;
		Game.abbrOn = localAbbr;
		if (localStorage.getItem("CCalc.Clicks")) {
			Game.setInput("#clicksPsIn", localStorage.getItem("CCalc.Clicks"));
		}

		var ele = byId(localStorage.getItem("CCalc.ShowBank") || "");
		if (ele) {
			ele.checked = true;
		}
		localStorage.setItem("CCalc.ShowBank", document.querySelector('[name="bank"]:checked').id);

		ele = byId(localStorage.getItem("CCalc.BuildQuantity") || "");
		if (ele) {
			ele.checked = true;
		}
		localStorage.setItem("CCalc.BuildQuantity", document.querySelector('[name="quantity"]:checked').id);

		//automatic season detection (might not be 100% accurate)
		Game.defaultSeason = "";
		var day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
		if (day >= 41 && day <= 46) {
			Game.defaultSeason = "valentines";
		} else if (day >= 90 && day <= 92) {
			Game.defaultSeason = "fools";
		} else if (day >= 304 - 7 && day <= 304) {
			Game.defaultSeason = "halloween";
		} else if (day >= 349 && day <= 365) {
			Game.defaultSeason = "christmas";
		} else {
			//easter is a pain goddamn
			var easterDay = function(Y) {
				var C = Math.floor(Y / 100),
					N = Y - 19 * Math.floor(Y / 19),
					K = Math.floor((C - 17) / 25),
					I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
				I = I - 30 * Math.floor((I / 30));
				I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) *
					Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
				var J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
				J = J - 7 * Math.floor(J / 7);
				var L = I - J,
					M = 3 + Math.floor((L + 40) / 44),
					D = L + 28 - 31 * Math.floor(M / 4);
				return new Date(Y, M - 1, D);
			}(new Date().getFullYear());
			easterDay = Math.floor((easterDay - new Date(easterDay.getFullYear(), 0, 0)) /
				(1000 * 60 * 60 * 24));
			if (day >= easterDay - 7 && day <= easterDay) { Game.defaultSeason = "easter"; }
		}
		Game.season = Game.defaultSeason;

		var foolsNameCheck = byId("foolsNameCheck");
		foolsNameCheck.checked = Game.defaultSeason === "fools";

		var $tooltipContainer = $("#tooltip");
		var tooltipEle = byId("tooltipBlock");
		var $tooltipEle = $(tooltipEle);
		Game.updateTooltip = null;

		Game.setTooltip = function(obj, update) {
			Game.clearTooltip(update);
			if (!obj || !obj.refEle) {
				return;
			}

			if (obj.html) {
				tooltipEle.innerHTML = obj.html;
			}

			$tooltipContainer.removeClass("hidden");

			var ele = obj.refEle;
			var pos = ele.getBoundingClientRect();
			var eleWidth = pos.width;
			var top, left;

			//position it centered above obj.refEle
			var windowWidth = document.body.offsetWidth;
			var tooltipWidth = tooltipEle.offsetWidth;
			var tooltipHeight = tooltipEle.offsetHeight;

			top = pos.top - tooltipHeight - 10 - (obj.isCrate ? 9 : 0);
			//put tooltip below ele if it would go off top of screen, or if specified to
			if (top < 0 || obj.position === "below") {
				top = pos.top + pos.height + 10;
			}

			left = pos.left + eleWidth / 2 - tooltipWidth / 2;
			if (left + tooltipWidth + 15 > windowWidth) { //stop tooltip from going off right edge of screen
				left = windowWidth - 15 - tooltipWidth;
			}

			//position tooltip, stopping it from going off left edge of screen (higher priority than off right)
			$tooltipContainer.css({
				top: top,
				left: Math.max(left, 5)
			});
		};

		Game.clearTooltip = function(update) {
			$tooltipContainer.addClass("hidden").removeAttr("style");
			if (!update) {
				Game.updateTooltip = null;
				Game.tooltipUpgrade = null;
				Game.tooltipAnchor = null;
			}
		};

		function makeTag(str, color) {
			return ('<span class="tag"' + (color ? ' style="color:' + color + ';"' : "") + ">[" + str + "]</span> ");
		}


		var BeautifyInTextFilter = /(([\d]+[,]*)+)/g;
		var clearCommasRgx = /,/g;

		function BeautifyInTextFunction(str) {
			return Game.Beautify(parseInt(str.replace(clearCommasRgx, ""), 10));
		}

		function AbbrInTextFunction(str) {
			return Game.abbreviateNumber(parseInt(str.replace(clearCommasRgx, ""), 10), 0, true);
		}

		function BeautifyInText(str) { //reformat every number inside a string
			return str.replace(BeautifyInTextFilter, BeautifyInTextFunction);
		}

		function AbbrInText(str) { //reformat every number inside a string
			return str.replace(BeautifyInTextFilter, AbbrInTextFunction);
		}


		//adds input with -/+ buttons that subtract/add when clicked
		function addPlusMinusInput(par, id, maxlen, limit) {
			var $eles = $('<a class="minus plusminus">-</a> <input id="' +
				id + '" type="text"' + (maxlen ? ' maxlength="' + maxlen + '"' : "") +
				'> <a class="plus plusminus">+</a>').appendTo(par);
			if (limit) {
				$eles.filter(".plusminus").addClass("limited");
			}
			var ele = $eles[2];
			var pm = $eles[0];
			pm.plusminusIn = ele;
			pm.plusminusMode = -1;
			pm = $eles[4];
			pm.plusminusIn = ele;
			pm.plusminusMode = 1;
			return ele;
		}

		//sets two inputs to update each other when changed
		function twinInputs(ele1, ele2) {
			ele1 = $(ele1)[0];
			ele2 = $(ele2)[0];
			ele1.twin = ele2;
			ele2.twin = ele1;
		}

		function addBlacklist(obj, name) {
			var $ele = $('<li class="blacklistEle"><label><input type="checkbox"> <span class="name">' +
				name + "</span></label></li>").appendTo("#blacklistEles");

			//sigh
			$ele.find("label").attr("data-title", name + "&#10;Check this to blacklist it.");

			obj.$blacklistEle = $ele;
			obj.blacklistCheckbox = $ele.find("input")[0];
			$ele[0].blacklistCheckbox = obj.blacklistCheckbox;
		}

		// Game.blankFunc = function () { return false; };

		Game.getIconCss = function(icon) {
			var css = {
				backgroundPosition: (-icon[0] * 48) + "px " + (-icon[1] * 48) + "px",
				backgroundImage: ""
			};
			if (icon[2]) {
				css.backgroundImage = "url(" + icon[2] + ")";
			}
			return css;
		};

		Game.getIconCssStr = function(iconCss) {
			if (Array.isArray(iconCss)) {
				iconCss = Game.getIconCss(iconCss);
			}
			var str = "background-position:" + iconCss.backgroundPosition + ";";
			if (iconCss.backgroundImage) {
				str = "background-image:" + iconCss.backgroundImage + ";" + str;
			}
			return str;
		};

		Game.getTinyIconStr = function(iconCss) {
			return ('<div class="icon tinyIcon" style="' + Game.getIconCssStr(iconCss) + '"></div>');
		};

		//#endregion start stuff

		var i, j, desc, upgrade, priceFunc, requireFunc;

		//to be used with upgrade groups
		var groupImplications = {
			"build": [],
			"egg": ["commonEgg", "rareEgg"],
			"bonus": ["plus"]
		};


		//#region Objects/Buildings

		var objRefOption = $('#upgradeFilterSel option[value="synergy"]');
		var ObjCalcFn = function(building) {
			var mult = 1;
			mult *= Game.GetTieredCpsMult(building);
			return (building.baseCps * mult);
		};

		Game.Object = function(name, commonName, desc, foolsName, iconColumn, calcCps) { //, props) {
			var id = Game.ObjectsById.length;

			this.type = "building";
			this.id = id;
			this.name = name;
			commonName = commonName.split("|");
			this.single = commonName[0];
			this.plural = commonName[1];
			this.pluralCapital = this.plural.charAt(0).toUpperCase() + this.plural.slice(1);
			this.actionName = commonName[2];
			this.groupName = commonName[3];
			desc = desc.split("|");
			this.desc = desc[0];
			this.displayDesc = desc[0];
			this.extraName = commonName[1];
			this.extraPlural = commonName[2];
			foolsName = foolsName.split("|");
			this.foolsName = foolsName[0];
			this.foolsDesc = foolsName[1];

			this.iconColumn = iconColumn;
			this.icon = [iconColumn, 0];
			this.iconCssStr = Game.getIconCssStr(this.icon);

			this.displayName = foolsNameCheck.checked ? this.foolsName : name;

			this.amount = 0;
			this.tempAmount = 0; //used for CPS prediction calculations
			this.free = 0; //how much given for free by prestige upgrades
			this.level = 0;

			this.storedTotalCps = 0;

			this.synergies = [];
			this.priceCache = {};
			this.tieredUpgrades = {};
			this.tieredAchievs = {};

			this.calcCps = typeof calcCps === "function" ? calcCps : ObjCalcFn;

			if (id > 0) {
				//new automated price and CpS curves
				this.baseCps = Math.ceil((Math.pow(id * 1, id * 0.5 + 2)) * 10) / 10;
				//clamp 14,467,199 to 14,000,000 (there's probably a more elegant way to do that)
				var digits = Math.pow(10, (Math.ceil(Math.log(Math.ceil(this.baseCps)) / Math.LN10))) / 100;
				this.baseCps = Math.round(this.baseCps / digits) * digits;

				this.basePrice = (id * 1 + 9 + (id < 5 ? 0 : Math.pow(id - 5, 1.75) * 5)) * Math.pow(10, id);
				digits = Math.pow(10, (Math.ceil(Math.log(Math.ceil(this.basePrice)) / Math.LN10))) / 100;

				this.basePrice = Math.round(this.basePrice / digits) * digits;
			}

			var tr = '<tr class="buildingRow" data-object="' + name + '"><td class="name">' + this.displayName + "</td><td></td>";
			this.$cpsRow = $(tr + '<td></td><td class="buildPrice">0</td><td class="cps">0</td><td class="time">---</td>' +
				'<td class="nextCps">0</td><td class="cpsPlus">0</td><td class="amort">---</td></tr>')
				.addClass("buildCpsRow").insertBefore("#buildCpsTotUp");
			this.$cpsNameSpan = this.$cpsRow.find(".name");
			this.$cpsNameSpan[0].objTie = this;
			this.amountIn = addPlusMinusInput(this.$cpsRow.children(":eq(1)"), "buildCpsAmountIn" + id, 4);
			this.amountIn.tabIndex = 3;
			this.levelIn = addPlusMinusInput(this.$cpsRow.children(":eq(2)"), "buildLevelIn" + id, 2, true);
			this.levelIn.tabIndex = 4;

			this.$priceRow = $(tr + '<td><a class="setDesired">&#8667;</a></td><td></td><td class="buy1">0</td><td class="buy10">0</td>' +
				'<td class="buy100">0</td><td class="buyDesired">0</td><td class="cumu">0</td><td class="sell">0</td>')
				.addClass("buildPriceRow").insertBefore("#buildPriceTotal");
			this.$priceNameSpan = this.$priceRow.find(".name");
			this.$priceNameSpan[0].objTie = this;
			this.amountInCurrent = addPlusMinusInput(this.$priceRow.children(":eq(1)"), "buildPriceAmountCurrentIn" + id, 4);
			this.amountInDesired = addPlusMinusInput(this.$priceRow.children(":eq(3)"), "buildPriceAmountDesiredIn" + id, 4);

			this.$priceRow.find(".setDesired")[0].objTie = this;
			twinInputs(this.amountIn, this.amountInCurrent);

			$('<option value="' + this.groupName + '">- ' + this.pluralCapital + "</option>").insertBefore(objRefOption);

			addBlacklist(this, this.name);

			groupImplications.build.push(this.groupName);

			Game.Objects[name] = this;
			Game.ObjectsById.push(this);
			Game.ObjectsByGroup[this.groupName] = this;
			Game.last = this;
		};

		Game.Object.prototype.toString = function() {
			return this.name;
		};

		Game.Object.prototype.setDisplay = function() {
			if (foolsNameCheck.checked) {
				this.displayName = this.foolsName;
				this.displayDesc = this.foolsDesc;
			} else {
				this.displayName = this.name;
				this.displayDesc = this.desc;
			}
			this.$cpsNameSpan.text(this.displayName);
			this.$priceNameSpan.text(this.displayName);
			this.$tooltipBlock = null;
		};

		Game.Object.prototype.sacrifice = function(amount) {
			if (!isNaN(amount)) {
				Game.setInput(this.amountIn, this.amount - amount);
			}
		};

		Game.Object.prototype.getAmount = function() {
			return Game.predictiveMode ? this.tempAmount : this.amount;
		};

		Game.Object.prototype.setAmount = function(amount) {
			if (isNaN(amount)) {
				return this.amount;
			}
			return Game.setInput(this.amountIn, amount);
		};

		Game.Object.prototype.getRecommendedName = function(amount) {
			var next = this.getAmount() + 1;
			return (this.displayName + " #" + next + (amount > next ? "-" + amount : ""));
		};

		Game.Object.prototype.buy = function(amount) {
			if (isNaN(amount)) {
				amount = 1;
			}
			return this.setAmount(this.amount + amount);
		};

		Game.Object.prototype.resetTemp = function() {
			this.tempAmount = this.amount;
		};

		Game.Object.prototype.getPrice = function(amount) {
			if (isNaN(amount)) {
				amount = this.getAmount();
			}
			amount = Math.max(0, amount - (Game.ascensionMode === 1 ? 0 : this.free));

			if (!this.priceCache[amount]) {
				var price = this.basePrice * Math.pow(Game.ObjectPriceIncrease, amount);
				price = Game.modifyObjectPrice(this, price);
				this.priceCache[amount] = Math.ceil(price);
			}
			return this.priceCache[amount];
		};

		//sum how many cookies to reach end by buying
		Game.Object.prototype.getPriceSum = function(start, end) {
			var cumu = 0;
			for (var i = start; i < end; i++) {
				cumu += this.getPrice(i);
			}
			return cumu;
		};

		Game.Object.prototype.getSellSum = function(start, end) {
			var cumu = 0;
			var mult = Game.sellMultiplier;
			for (var i = start; i > end; i--) {
				cumu += Math.floor(this.getPrice(i) * mult);
			}
			return cumu;
		};

		Game.Object.prototype.getTooltip = function(ele, update) {
			if (!this.$tooltipBlock) {
				this.setTooltipBlock();
			}

			$tooltipEle.empty().append(this.$tooltipBlock);

			Game.setTooltip({
				refEle: ele,
				isCrate: true
			}, update);
		};

		Game.Object.prototype.setTooltipBlock = function() {
			var me = this;
			var name = me.displayName;
			var desc = me.displayDesc;

			var i, upgrade, other, mult, boost;

			var synergiesStr = "";
			//note : might not be entirely accurate, math may need checking
			if (me.amount > 0) {
				var synergiesWith = {};
				var synergyBoost = 0;

				if (me.name === "Grandma") {
					for (i = Game.UpgradesByGroup.grandmaSynergy.length - 1; i >= 0; i--) {
						upgrade = Game.UpgradesByGroup.grandmaSynergy[i];
						if (upgrade.bought) {
							other = upgrade.grandmaBuilding;
							mult = me.amount * 0.01 * (1 / (other.id - 1));
							boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + mult);
							synergyBoost += boost;
							if (!synergiesWith[other.plural]) { synergiesWith[other.plural] = 0; }
							synergiesWith[other.plural] += mult;
						}
					}
				} else if (me.name === "Portal" && Game.HasUpgrade("Elder Pact")) {
					other = Game.Objects["Grandma"];
					boost = (me.amount * 0.05 * other.amount) * Game.globalCpsMult;
					synergyBoost += boost;
					if (!synergiesWith[other.plural]) { synergiesWith[other.plural] = 0; }
					synergiesWith[other.plural] += boost / (other.storedTotalCps * Game.globalCpsMult);
				}

				for (i = me.synergies.length - 1; i >= 0; i--) {
					upgrade = me.synergies[i];
					if (upgrade.bought) {
						var weight = 0.05;
						other = upgrade.buildingTie1;
						if (me == upgrade.buildingTie1) {
							weight = 0.001;
							other = upgrade.buildingTie2;
						}
						boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + me.amount * weight);
						synergyBoost += boost;
						if (!synergiesWith[other.plural]) { synergiesWith[other.plural] = 0; }
						synergiesWith[other.plural] += me.amount * weight;
					}
				}
				if (synergyBoost > 0) {
					for (i in synergiesWith) {
						if (synergiesStr != "") { synergiesStr += ", "; }
						synergiesStr += i + " +" + Game.Beautify(synergiesWith[i] * 100, 1) + "%";
					}
					synergiesStr = "...also boosting some other buildings : " + synergiesStr + " - all combined, these boosts account for <b>" +
						Game.BeautifyAbbr(synergyBoost, 1) + "</b> cookies per second (<b>" +
						Game.Beautify((synergyBoost / Game.cookiesPs) * 100, 1) + "%</b> of total CpS)";
				}
			}

			this.$tooltipBlock = $('<div class="buildingTooltip"><div class="icon buildingIcon" style="' + me.iconCssStr +
				'"></div><div class="buildingPrice"><span class="price priceIcon">' + Game.BeautifyAbbr(Math.round(me.bulkPrice)) + "</span>" +
				Game.costDetails(me.bulkPrice) +
				'</div><div class="name">' + name + "</div>" + "<small>[owned : " + me.amount + "</small>]" +
				(me.free > 0 ? " <small>[free : " + me.free + "</small>!]" : "") +
				'<div class="line"></div><div class="description">' + desc + "</div>" +
				(me.amount > 0 ? (
					'<div class="line"></div><div class="data">' +
					(me.amount > 0 ?
						"&bull; each " + me.single + " produces <b>" + Game.BeautifyAbbr((me.storedTotalCps / me.amount) * Game.globalCpsMult, 1) +
						"</b> " +
						Game.getPlural(Math.round((me.storedTotalCps / me.amount) * Game.globalCpsMult), "cookie") + " per second<br>" : "") +
					"&bull; " + me.amount + " " + (me.amount == 1 ? me.single : me.plural) + " producing <b>" +
					Game.BeautifyAbbr(me.storedTotalCps * Game.globalCpsMult, 1) + "</b> " +
					Game.getPlural(Math.round(me.storedTotalCps * Game.globalCpsMult), "cookie") + " per second (<b>" +
					Game.BeautifyAbbr(
						Game.cookiesPs > 0 ? ((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100) : 0, 1) +
					"%</b> of total CpS)<br>" +
					(synergiesStr ? ("&bull; " + synergiesStr + "<br>") : "")
				) : "") +
				"</div>");
		};

		/* Game.Object.prototype.levelTooltip = function () {
	var me = this;
	var level = Game.Beautify(me.level);
	return ('<div style="width:280px;padding:8px;"><b>Level ' + level + " " + me.plural + '</b><div class="line"></div>' +
		(me.level == 1 ? me.extraName : me.extraPlural).replace("[X]", level) + " granting <b>+" + level + "% " + me.name +
		' CpS</b>.<div class="line"></div>Click to level up for <span class="price lump' + (Game.lumps >= me.level + 1 ? "" : " disabled") + '">' +
		Game.Beautify(me.level + 1) + Game.getPlural(me.level + 1, " sugar lump") + "</span>." +
		((me.level === 0 && me.minigameUrl) ? '<div class="line"></div><b>Levelling up this building unlocks a minigame.</b>' : "") + "</div>");
}; */

		//define Objects/Buildings
		new Game.Object("Cursor", "cursor|cursors|clicked|cursor",
			"Autoclicks once every 10 seconds.|[X] extra finger|[X] extra fingers",
			"Rolling pin|Essential in flattening dough. The first step in cookie-making.",
			0, function(me) {
				var add = 0;
				if (Game.HasUpgrade("Thousand fingers")) { add += 0.1; }
				if (Game.HasUpgrade("Million fingers")) { add += 0.5; }
				if (Game.HasUpgrade("Billion fingers")) { add += 5; }
				if (Game.HasUpgrade("Trillion fingers")) { add += 50; }
				if (Game.HasUpgrade("Quadrillion fingers")) { add += 500; }
				if (Game.HasUpgrade("Quintillion fingers")) { add += 5000; }
				if (Game.HasUpgrade("Sextillion fingers")) { add += 50000; }
				if (Game.HasUpgrade("Septillion fingers")) { add += 500000; }
				if (Game.HasUpgrade("Octillion fingers")) { add += 5000000; }

				var mult = 1;
				mult *= Game.GetTieredCpsMult(me);
				// mult *= Game.magicCps("Cursor"); //effectively disabled ingame after Orteil found how overpowered it was
				mult *= Game.eff("cursorCps");

				add *= Game.Get("ObjectsOwned") - me.getAmount();
				return (Game.ComputeCps(0.1, Game.HasUpgrade("Reinforced index finger") +
					Game.HasUpgrade("Carpal tunnel prevention cream") + Game.HasUpgrade("Ambidextrous"), add) * mult);
			});
		Game.last.basePrice = 15;
		Game.last.baseCps = 0.1;

		new Game.Object("Grandma", "grandma|grandmas|baked|grandma",
			"A nice grandma to bake more cookies.|Grandmas are [X] year older|Grandmas are [X] years older",
			"Oven|A crucial element of baking cookies.",
			1, function(me) {
				var mult = 1;
				for (var i = Game.UpgradesByGroup.grandmaSynergy.length - 1; i >= 0; i--) {
					if (Game.UpgradesByGroup.grandmaSynergy[i].getBought()) {
						mult *= 2;
					}
				}
				if (Game.HasUpgrade("Bingo center/Research facility")) { mult *= 4; }
				if (Game.HasUpgrade("Ritual rolling pins")) { mult *= 2; }
				if (Game.HasUpgrade("Naughty list")) { mult *= 2; }

				if (Game.HasUpgrade("Elderwort biscuits")) { mult *= 1.02; }
				mult *= Game.eff("grandmaCps");

				mult *= Game.GetTieredCpsMult(me);

				var add = 0;
				var amount = me.getAmount();
				if (Game.HasUpgrade("One mind")) { add += amount * 0.02; }
				if (Game.HasUpgrade("Communal brainsweep")) { add += amount * 0.02; }
				if (Game.HasUpgrade("Elder Pact")) { add += Game.Objects["Portal"].getAmount() * 0.05; }

				if (Game.hasAura("Elder Battalion")) {
					mult *= 1 + 0.01 * (Game.Get("ObjectsOwned") - amount);
				}

				return (me.baseCps + add) * mult;
			});

		new Game.Object("Farm", "farm|farms|harvested|farm",
			"Grows cookie plants from cookie seeds.|[X] more acre|[X] more acres",
			"Kitchen|The more kitchens, the more cookies your employees can produce.",
			2);
		new Game.Object("Mine", "mine|mines|mined|mine",
			"Mines out cookie dough and chocolate chips.|[X] mile deeper|[X] miles deeper",
			"Secret recipe|These give you the edge you need to outsell those pesky competitors.",
			3);
		new Game.Object("Factory", "factory|factories|mass-produced|factory",
			"Produces large quantities of cookies.|[X] additional patent|[X] additional patents",
			"Factory|Mass production is the future of baking. Seize the day, and synergize!",
			4);
		new Game.Object("Bank", "bank|banks|banked|bank",
			"Generates cookies from interest.|Interest rates [X]% better|Interest rates [X]% better",
			"Investor|Business folks with a nose for profit, ready to finance your venture as long as there's money to be made.",
			15);
		new Game.Object("Temple", "temple|temples|discovered|temple",
			"Full of precious, ancient chocolate.|[X] sacred artifact retrieved|[X] sacred artifacts retrieved",
			"Like|Your social media page is going viral! Amassing likes is the key to a lasting online presence and juicy advertising deals.",
			16);
		new Game.Object("Wizard tower", "wizard tower|wizard towers|summoned|wizardTower",
			"Summons cookies with magic spells.|Incantations have [X] more syllable|Incantations have [X] more syllables",
			"Meme|Cookie memes are all the rage! With just the right amount of social media astroturfing, your brand image will be all over the cyberspace.",
			17);
		new Game.Object("Shipment", "shipment|shipments|shipped|shipment",
			"Brings in fresh cookies from the cookie planet.|[X] galaxy fully explored|[X] galaxies fully explored",
			"Supermarket|A gigantic cookie emporium - your very own retail chain.",
			5);
		new Game.Object("Alchemy lab", "alchemy lab|alchemy labs|transmuted|alchemyLab",
			"Turns gold into cookies!|[X] primordial element mastered|[X] primordial elements mastered",
			"Stock share|You're officially on the stock market, and everyone wants a piece!",
			6);
		new Game.Object("Portal", "portal|portals|retrieved|portal",
			"Opens a door to the Cookieverse.|[X] dimension enslaved|[X] dimensions enslaved",
			"TV show|Your cookies have their own sitcom! Hilarious baking hijinks set to the cheesiest laughtrack.",
			7);
		new Game.Object("Time machine", "time machine|time machines|recovered|timeMachine",
			"Brings cookies from the past, before they were even eaten.|[X] century secured|[X] centuries secured",
			"Theme park|Cookie theme parks, full of mascots and roller-coasters. Build one, build a hundred!",
			8, "Grandmas' grandmas");
		new Game.Object("Antimatter condenser", "antimatter condenser|antimatter condensers|condensed|antimatterCondenser",
			"Condenses the antimatter in the universe into cookies.|[X] extra quark flavor|[X] extra quark flavors",
			"Cookiecoin|A virtual currency, already replacing regular money in some small countries.",
			13);
		new Game.Object("Prism", "prism|prisms|converted|prism",
			"Converts light itself into cookies.|[X] new color discovered|[X] new colors discovered",
			"Corporate country|You've made it to the top, and you can now buy entire nations to further your corporate greed. Godspeed.",
			14);
		new Game.Object("Chancemaker", "chancemaker|chancemakers|spontaneously generated|chancemaker",
			"Generates cookies out of thin air through sheer luck.|Chancemakers are powered by [X]-leaf clovers|Chancemakers are powered by [X]-leaf clovers",
			"Privatized planet|Actually, you know what's cool? A whole planet dedicated to producing, advertising, selling, and consuming your cookies.",
			19);
		new Game.Object("Fractal engine", "fractal engine|fractal engines|made from cookies|fractalEngine",
			"Turns cookies into even more cookies.|[X] iteration deep|[X] iterations deep",
			"Senate seat|Only through political dominion can you truly alter this world to create a brighter, more cookie-friendly future.",
			20);

		//#endregion Objects/Buildings


		//santa
		Game.santa = {
			$dropEle: $("#santaLevel"),
			dropEle: byId("santaLevel"),
			buy: function() {
				var ele = Game.santa.dropEle;
				if (ele.selectedIndex && Game.santaLevel < Game.santaMax) {
					ele.selectedIndex = Game.santaLevel + 2;
				}
			}
		};

		Game.santa.dropEle.innerHTML += Game.santaLevels.reduce(function(html, level) {
			return (html + "<option>" + level + "</option>");
		}, "");

		addBlacklist(Game.santa, "Santa levels");
		$("#santaClick").on("click", function() {
			Game.santa.buy();
			Game.scheduleUpdate();
			return false;
		});


		//#region Upgrades

		Game.CountsAsUpgradeOwned = function(pool) {
			return pool === "" || pool === "cookie" || pool === "tech";
		};

		var groupSplitRgx = /\s*\|+\s*/;
		var groupPropSplitRgx = /\s*:+\s*/;

		function processGroups(group) {
			var groups = {};

			if (typeof group === "string" && group.length) {
				group = group.trim().split(groupSplitRgx);

				for (var i = group.length - 1; i >= 0; i--) {
					if (!group[i]) { continue; }
					var g = group[i].split(groupPropSplitRgx);
					if (1 in g && !isNaN(g[1])) {
						g[1] = Number(g[1]);
					}
					groups[g[0]] = g[1] || true;
				}

				for (i in groupImplications) {
					if (groups[i]) { continue; }
					var implyNames = groupImplications[i];
					for (var j = implyNames.length - 1; j >= 0; j--) {
						if (groups[implyNames[j]]) {
							groups[i] = true;
							break;
						}
					}
				}
			}

			return groups;
		}

		var clickRecFunc = function() { return Game.clicksPs > 0; };

		var order;

		var poolTags = {
			prestige: {
				text: "Heavenly",
				color: "#efa438"
			},
			tech: {
				text: "Tech",
				color: "#36a4ff"
			},
			cookie: {text: "Cookie"},
			debug: {
				text: "Debug",
				color: "#00c462"
			},
			toggle: {text: "Switch"},
			"": {text: "Upgrade"}
		};

		Game.Upgrade = function(name, desc, price, icon, properties) {
			this.type = "upgrade";
			this.id = Game.UpgradesById.length;
			this.name = name;
			this.basePrice = price;
			this.price = 0;
			this.priceLumps = 0;
			this.pool = "";
			this.tier = 0;
			this.order = this.id;
			if (order) {
				this.order = order + this.id * 0.001;
			}

			this.setDescription(desc);

			if (properties instanceof Object) {
				$.extend(this, properties);
			}

			if (this.tier >= 0 && this.col >= 0) {
				icon = [this.col, Game.Tiers[this.tier].iconRow];
			}

			this.icon = icon;
			this.iconCss = Game.getIconCss(this.icon);
			this.tinyIconStr = Game.getTinyIconStr(this.iconCss);
			this.iconName = this.tinyIconStr + " " + this.name;

			this.groups = processGroups(this.groups);

			if (this.priceLumps > 0) {
				this.groups.priceLumps = true;

			} else if (this.pool !== "prestige") {
				this.groups.normal = true;
			}
			var tag = poolTags[this.pool] || poolTags[""];
			this.poolTag = makeTag(tag.text, tag.color);

			this.unlocked = false;
			this.tempUnlocked = false;
			this.bought = false;
			this.tempBought = false;

			this.$baseCrate = $('<div class="upgrade crate"></div>')
				.css(this.iconCss).attr({
					"data-upgrade": this.name,
					"data-id": this.id
				});
			this.$baseCrate[0].objTie = this;

			this.$crateNodes = this.$baseCrate;
			this.$extraCrates = $();

			addBlacklist(this, this.name);

			this.$tooltipCrate = this.createCrate();

			Game.Upgrades[name] = this;
			Game.UpgradesById.push(this);
			Game.last = this;
		};

		Game.Upgrade.prototype.toString = function() {
			return this.name;
		};

		Game.Upgrade.prototype.setDescription = function(desc) {
			this.baseDesc = desc;
			this.beautifyDesc = BeautifyInText(desc);
			this.abbrDesc = AbbrInText(desc);
			this.setCurrentDescription();
		};

		Game.Upgrade.prototype.setCurrentDescription = function() {
			this.desc = Game.abbrOn ? this.abbrDesc : this.beautifyDesc;
		};

		//creates a clickable div.crate, like seen in the game's store and stats menu
		//adds it to stored jQuery objects to easily synch .unlocked/.enabled state
		Game.Upgrade.prototype.createCrate = function(parentNode) {
			var $crate = this.$baseCrate.clone().addClass("extraCrate");
			$crate[0].objTie = this;
			this.$crateNodes = this.$crateNodes.add($crate);
			this.$extraCrates = this.$extraCrates.add($crate);
			if (parentNode) {
				$crate.appendTo(parentNode);
			}
			return $crate;
		};

		Game.Upgrade.prototype.calcCps = function() {
			if (!this.cpsObj && !this.noBuy) {
				this.cps = 0;
				this.rate = 0;
				this.amort = 0;

				if (!this.groups.misc) {
					var mode = Game.predictiveMode;
					this.cpsObj = Game.setChanges([{gameObj: this}], []);
					Game.predictiveMode = mode;

					this.cps = this.cpsObj.cookiesPsPlusClicksDiff;
					this.rate = this.cpsObj.rate;
					this.amort = this.cpsObj.amort;
					this.amortStr = Game.formatTime(this.amort);
				}

				if (this.afterCalcCps) {
					this.afterCalcCps();
				}
			}
			return this.cpsObj;
		};

		Game.Upgrade.prototype.getPrice = function(arg) {
			var price = this.basePrice;
			if (this.priceFunc) {
				price = this.priceFunc(arg);
			}
			if (price == 0) {
				return 0;
			}
			if (this.pool !== "prestige") {
				var arr = Game.UpgradePriceMultArray;
				if (arr[0]) { price *= 0.95; } //Toy workshop
				if (arr[1]) { price *= Math.pow(0.99, Game.Objects["Cursor"].getAmount() / 100); } //Five-finger discount
				if (arr[2]) { price *= 0.98; } //Santa's dominion
				if (arr[3]) { price *= 0.99; } //Faberge egg
				if (arr[4]) { price *= 0.99; } //Divine sales
				if (arr[5]) { price *= 0.98; } //Haggler's luck buff
				if (arr[6]) { price *= 1.02; } //Haggler's misery
				if (arr[7]) { price *= 0.98; } //Master of the Armory (aura)
				price *= arr[8]; //upgradeCost minigame effect
				if (this.pool === "cookie" && arr[9]) { price /= 5; } //Divine bakeries
			}
			return Math.ceil(price);
		};

		Game.Upgrade.prototype.setPrice = function() {
			this.price = this.getPrice();
			var price = this.priceLumps > 0 ? this.priceLumps : this.price;
			this.priceStr = "";
			this.priceStrWithDetails = "";

			if (price > 0) {
				var priceDeets = Game.costDetails(price);
				this.priceDetails = priceDeets;
				this.priceDetailsForce = priceDeets || Game.costDetails(price, true);
				var c = "";
				if (this.priceLumps > 0) {
					c += " lump";

				} else if (this.pool === "prestige") {
					c += " heavenly";

				}
				var str = '<span class="price priceIcon' + c + '">';
				this.priceStr = str + Game.formatNumber(price) + "</span>";
				this.priceStrWithDetails =
					str + Game.BeautifyAbbr(price) + (this.pool !== "prestige" && this.priceLumps === 0 ? priceDeets : "") + "</span>";
			}
		};

		Game.Upgrade.prototype.resetTemp = function() {
			this.tempUnlocked = this.unlocked;
			this.tempBought = this.bought;
		};

		Game.Upgrade.prototype.getUnlocked = function(asNum) {
			var unlocked = Game.predictiveMode ? this.tempUnlocked : this.unlocked;
			unlocked = unlocked || this.getBought();
			return asNum ? Number(unlocked) : Boolean(unlocked);
		};

		Game.Upgrade.prototype.setUnlocked = function(toggle) {
			var key = Game.predictiveMode ? "tempUnlocked" : "unlocked";
			toggle = typeof toggle === "undefined" ? !this[key] : Boolean(toggle);
			this[key] = toggle;
			if (!Game.predictiveMode) {
				this.tempUnlocked = toggle;
				this.$crateNodes.toggleClass("unlocked", toggle);
			}
			return toggle;
		};

		Game.Upgrade.prototype.getBought = function(asNum) {
			var bought = Game.predictiveMode ? this.tempBought : this.bought;
			return asNum ? Number(bought) : Boolean(bought);
		};

		Game.Upgrade.prototype.setBought = function(toggle) {
			var key = Game.predictiveMode ? "tempBought" : "bought";
			toggle = typeof toggle === "undefined" ? !this[key] : Boolean(toggle);
			if (this.noBuy) { toggle = false; }
			this[key] = toggle;
			if (!Game.predictiveMode) {
				this.tempBought = toggle;
				this.$crateNodes.toggleClass("enabled", toggle);
				if (this.buyFunc) { this.buyFunc(); }
			}
			return toggle;
		};

		Game.Upgrade.prototype.buy = function() {
			this.bought = true;
			this.tempBought = true;
			this.$crateNodes.addClass("enabled");
			return true;
		};

		Game.Upgrade.prototype.getTooltip = function(crate, update) {
			if (!this.$tooltipBlock || this.descFunc) {
				this.setTooltipBlock();
			}

			$tooltipEle.empty().append(this.$tooltipBlock);
			this.$tooltipCrate.removeClass("hidden");

			Game.setTooltip({
				refEle: crate,
				isCrate: true
			}, update);
			Game.tooltipUpgrade = this;
		};

		Game.Upgrade.prototype.setTooltipBlock = function() {
			var tags = this.poolTag;

			var hasPrinter = Game.HasUpgrade("Label printer");
			if (this.tier != 0 && hasPrinter) {
				tags += makeTag("Tier : " + Game.Tiers[this.tier].name, Game.Tiers[this.tier].color);
			}
			if (this.name === "Label printer" && hasPrinter) {
				tags += makeTag("Tier : Self-referential", "#ff00ea");
			}

			if (this.bought) {
				if (this.pool === "tech") {
					tags += makeTag("Researched");
				} else if (this.groups.kitten) {
					tags += makeTag("Purrchased");
				} else {
					tags += makeTag("Purchased");
				}
			}

			if (this.lasting && this.getUnlocked()) {
				tags += makeTag("Unlocked forever", "#f2ff87");
			}

			// if (Game.HasUpgrade("Neuromancy")) {
			// 	if (bought) {
			// 		tags += makeTag("Click to unlearn!", "#00c462");
			// 	} else {
			// 		tags += makeTag("Click to learn!", "#00c462");
			// 	}
			// }

			var desc = this.desc;
			if (this.descFunc) {
				desc = this.descFunc();
			}
			if (this.unlockAt) {
				if (this.unlockAt.require) {
					if (typeof this.unlockAt.require !== "function") {
						var required = Game.Upgrades[this.unlockAt.require];
						desc = '<div style="font-size:80%;text-align:center;">From ' + required.iconName + '</div><div class="line"></div>' + desc;
					}
				} else if (this.unlockAt.text) {
					desc =
						'<div style="font-size:80%;text-align:center;">From <b>' + this.unlockAt.text + '</b></div><div class="line"></div>' + desc;
				}
			}

			if (typeof this.statsStr !== "string") {
				var str = "";
				var cpsObj = this.calcCps();
				if (cpsObj) {
					if (this.pool !== "prestige" && !this.bought && this.price > 0 && Game.cookiesPsPlusClicks > 0) {
						str += "<div>Time to afford: <b>" + Game.formatTime(this.price / Game.cookiesPsPlusClicks) + "</b></div>";
					}

					if (Math.abs(this.cps) > 0) {
						str += "<div>Cookies per " + (this.cpsPrefix || "Second") + ": <b" +
							(this.cps > 0 ? ">" : ' class="negative">') + Game.BeautifyAbbr(this.cps, 1, true) + "</b></div>";
					}

					if (this.pool !== "prestige" && this.amortStr && this.amortStr !== "---") {
						str += "<div>Amortization: <b>" + this.amortStr + "</b></div>";
					}

					if (str) {
						str = '<div class="stats"><div class="line"></div>' + str + "</div>";
					}
				}
				this.statsStr = str;
			}

			this.$tooltipBlock = $('<div class="crateTooltip upgradeTooltip">' + this.priceStrWithDetails +
				'<div class="name">' + this.name + '</div><div class="tags">' + tags + "</div>" +
				'<div class="line"></div><div class="description">' + desc + "</div>" + (this.statsStr || "") + "</div>")
				.prepend(this.$tooltipCrate);
		};


		//return a function that returns true if you have enough cookies baked this game
		//and if applicable if you have the required upgrade and/or if it's the right season
		var getCookiesBakedRequireFunc = function(obj, price) {
			price = price || obj.price;
			return function(add) {
				return (Game.getCookiesBaked(add) >= price && (!obj.require || Game.HasUpgrade(obj.require)) &&
					(!obj.season || Game.season === obj.season)); // && (!obj.requireAch || Game.HasAchiev(obj.requireAch))
			};
		};

		Game.CookieUpgrade = function(obj) {
			var desc = "";
			if (obj.forceDesc) {
				desc = obj.forceDesc;
			} else {
				desc = "Cookie production multiplier <b>+" +
					Game.Beautify((typeof (obj.power) === "function" ? obj.power(obj) : obj.power), 1) + "%</b>.<q>" + obj.desc + "</q>";
			}

			var upgrade = new Game.Upgrade(obj.name,
				desc,
				obj.price, obj.icon, {
					power: obj.power,
					pool: "cookie",
					groups: (obj.groups || "") + "|plus"
				});
			if (!obj.locked) {
				upgrade.require = getCookiesBakedRequireFunc(obj, obj.price / 20);
			}
			if (typeof obj.require === "function") {
				upgrade.require = obj.require;
			} else if (obj.require) {
				upgrade.requiredUpgrade = obj.require;
			}
			return upgrade;
		};

		//tiered upgrades system
		//each building has several upgrade tiers
		//all upgrades in the same tier have the same color, unlock threshold and price multiplier
		Game.Tiers = {
			1: {
				name: "Plain",
				unlock: 1,
				achievUnlock: 1,
				iconRow: 0,
				color: "#ccb3ac",
				price: 10
			},
			2: {
				name: "Berrylium",
				unlock: 5,
				achievUnlock: 50,
				iconRow: 1,
				color: "#ff89e7",
				price: 50
			},
			3: {
				name: "Blueberrylium",
				unlock: 25,
				achievUnlock: 100,
				iconRow: 2,
				color: "#00deff",
				price: 500
			},
			4: {
				name: "Chalcedhoney",
				unlock: 50,
				achievUnlock: 150,
				iconRow: 13,
				color: "#ffcc2f",
				price: 50000
			},
			5: {
				name: "Buttergold",
				unlock: 100,
				achievUnlock: 200,
				iconRow: 14,
				color: "#e9d673",
				price: 5000000
			},
			6: {
				name: "Sugarmuck",
				unlock: 150,
				achievUnlock: 250,
				iconRow: 15,
				color: "#a8bf91",
				price: 500000000
			},
			7: {
				name: "Jetmint",
				unlock: 200,
				achievUnlock: 300,
				iconRow: 16,
				color: "#60ff50",
				price: 500000000000
			},
			8: {
				name: "Cherrysilver",
				unlock: 250,
				achievUnlock: 350,
				iconRow: 17,
				color: "#f01700",
				price: 500000000000000
			},
			9: {
				name: "Hazelrald",
				unlock: 300,
				achievUnlock: 400,
				iconRow: 18,
				color: "#9ab834",
				price: 500000000000000000
			},
			10: {
				name: "Mooncandy",
				unlock: 350,
				achievUnlock: 450,
				iconRow: 19,
				color: "#7e7ab9",
				price: 500000000000000000000
			},
			11: {
				name: "Astrofudge",
				unlock: 400,
				achievUnlock: 500,
				iconRow: 28,
				color: "#9a3316",
				price: 5000000000000000000000000
			},
			12: {
				name: "Alabascream",
				unlock: 450,
				achievUnlock: 550,
				iconRow: 30,
				color: "#c1a88c",
				price: 50000000000000000000000000000
			},
			"synergy1": {
				name: "Synergy I",
				unlock: 15,
				iconRow: 20,
				color: "#008595",
				special: true,
				require: "Synergies Vol. I",
				price: 200000
			},
			"synergy2": {
				name: "Synergy II",
				unlock: 75,
				iconRow: 29,
				color: "#008595",
				special: true,
				require: "Synergies Vol. II",
				price: 200000000000
			}
		};

		Game.GetIcon = function(type, tier) {
			var col = type === "Kitten" ? 18 : Game.Objects[type].iconColumn;
			return [col, Game.Tiers[tier].iconRow];
		};

		Game.SetTier = function(building, tier) {
			if (!Game.Objects[building]) {
				alert("No building named " + building);
			}
			Game.last.tier = tier;
			Game.last.buildingTie = Game.Objects[building];
			if (Game.last.type === "achievement") {
				Game.Objects[building].tieredAchievs[tier] = Game.last;
			} else {
				Game.Objects[building].tieredUpgrades[tier] = Game.last;
			}
		};

		Game.TieredUpgrade = function(name, desc, buildingName, tier) {
			var building = Game.Objects[buildingName];
			var tierObj = Game.Tiers[tier];
			var upgrade = new Game.Upgrade(name, desc,
				building.basePrice * tierObj.price, Game.GetIcon(buildingName, tier),
				{groups: "" + building.groupName + ":" + tierObj.unlock});
			Game.SetTier(buildingName, tier);
			return upgrade;
		};

		var synPriceFunc = function() {
			return (this.basePrice * (Game.HasUpgrade("Chimera") ? 0.98 : 1));
		};

		var synRequireFunc = function(check) {
			var tier = Game.Tiers[this.tier];
			var amount1 = this.buildingTie1.getAmount();
			amount1 = Math.min(amount1, check) || amount1;
			var amount2 = this.buildingTie2.getAmount();
			amount2 = Math.min(amount2, check) || amount2;
			return Game.HasUpgrade(tier.require) && amount1 >= tier.unlock && amount2 >= tier.unlock;
		};

		//creates a new upgrade that :
		//- unlocks when you have tier.unlock of building1 and building2
		//- is priced at (building1.price * 10 + building2.price) * tier.price (formerly : Math.sqrt(building1.price * building2.price) * tier.price)
		//- gives +(0.1 * building1)% cps to building2 and +(5 * building2)% cps to building1
		//- if building2 is below building1 in worth, swap them
		Game.SynergyUpgrade = function(name, desc, building1, building2, tier) {
			var b1 = Game.Objects[building1];
			var b2 = Game.Objects[building2];
			if (b1.basePrice > b2.basePrice) { //swap
				b1 = Game.Objects[building2];
				b2 = Game.Objects[building1];
			}
			var tierObj = Game.Tiers[tier];

			desc = b1.pluralCapital + " gain <b>+5% CpS</b> per " + b2.name.toLowerCase() + ".<br>" +
				b2.pluralCapital + " gain <b>+0.1% CpS</b> per " + b1.name.toLowerCase() + "." +
				desc;
			var upgrade = new Game.Upgrade(name, desc,
				(b1.basePrice * 10 + b2.basePrice) * tierObj.price, Game.GetIcon(building1, tier), {
					tier: tier,
					buildingTie1: b1,
					buildingTie2: b2,
					groups: "synergy|" + b1.groupName + "|" + b2.groupName,
					priceFunc: synPriceFunc,
					require: synRequireFunc
				});
			Game.Objects[building1].synergies.push(upgrade);
			Game.Objects[building2].synergies.push(upgrade);
			return upgrade;
		};

		var grandmaSynergyRequireFunc = function(amount) {
			if (isNaN(amount)) { amount = this.grandmaBuilding.getAmount(); }
			return Game.Objects["Grandma"].getAmount() > 0 && amount >= Game.SpecialGrandmaUnlock;
		};

		Game.GrandmaSynergy = function(name, desc, building) {
			building = Game.Objects[building];
			var grandmaNumber = (building.id - 1);
			if (grandmaNumber === 1) {
				grandmaNumber = "grandma";
			} else {
				grandmaNumber += " grandmas";
			}
			desc = "Grandmas are <b>twice</b> as efficient. " + building.pluralCapital + " gain <b>+1% CpS</b> per " + grandmaNumber + ".<q>" + desc +
				"</q>";

			var upgrade = new Game.Upgrade(name, desc,
				building.basePrice * Game.Tiers[2].price, [10, 9], {
					groups: "grandmaSynergy|grandma|" + building.groupName,
					require: grandmaSynergyRequireFunc
				});
			building.grandmaSynergy = upgrade;
			upgrade.grandmaBuilding = building;
			return upgrade;
		};

		var getNumAllObjectsRequireFunc = function(amount) {
			return function() {
				for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
					if (Game.ObjectsById[i].getAmount() < amount) { return false; }
				}
				return true;
			};
		};

		//start defining Upgrades

		order = 100;
		//this is used to set the order in which the items are listed
		new Game.Upgrade("Reinforced index finger",
			"The mouse and cursors are <b>twice</b> as efficient.<q>prod prod</q>",
			100, [0, 0], {
				tier: 1,
				col: 0,
				groups: "cursor:1|click"
			});
		new Game.Upgrade("Carpal tunnel prevention cream",
			"The mouse and cursors are <b>twice</b> as efficient.<q>it... it hurts to click...</q>",
			500, [0, 1], {
				tier: 2,
				col: 0,
				groups: "cursor:1|click"
			});
		new Game.Upgrade("Ambidextrous",
			"The mouse and cursors are <b>twice</b> as efficient.<q>Look ma, both hands!</q>",
			10000, [0, 2], {
				tier: 3,
				col: 0,
				groups: "cursor:10|click"
			});
		new Game.Upgrade("Thousand fingers",
			"The mouse and cursors gain <b>+0.1</b> cookies for each non-cursor object owned.<q>clickity</q>",
			100000, [0, 13], {
				tier: 4,
				col: 0,
				groups: "cursor:25|click"
			});
		new Game.Upgrade("Million fingers",
			"The mouse and cursors gain <b>+0.5</b> cookies for each non-cursor object owned.<q>clickityclickity</q>",
			10000000, [0, 14], {
				tier: 5,
				col: 0,
				groups: "cursor:50|click"
			});
		new Game.Upgrade("Billion fingers",
			"The mouse and cursors gain <b>+5</b> cookies for each non-cursor object owned.<q>clickityclickityclickity</q>",
			100000000, [0, 15], {
				tier: 6,
				col: 0,
				groups: "cursor:100|click"
			});
		new Game.Upgrade("Trillion fingers",
			"The mouse and cursors gain <b>+50</b> cookies for each non-cursor object owned.<q>clickityclickityclickityclickity</q>",
			1000000000, [0, 16], {
				tier: 7,
				col: 0,
				groups: "cursor:150|click"
			});

		order = 200;
		Game.TieredUpgrade("Forwards from grandma",
			"Grandmas are <b>twice</b> as efficient.<q>RE:RE:thought you'd get a kick out of this ;))</q>",
			"Grandma", 1);
		Game.TieredUpgrade("Steel-plated rolling pins",
			"Grandmas are <b>twice</b> as efficient.<q>Just what you kneaded.</q>",
			"Grandma", 2);
		Game.TieredUpgrade("Lubricated dentures",
			"Grandmas are <b>twice</b> as efficient.<q>squish</q>",
			"Grandma", 3);

		order = 300;
		Game.TieredUpgrade("Cheap hoes",
			"Farms are <b>twice</b> as efficient.<q>Rake in the dough!</q>",
			"Farm", 1);
		Game.TieredUpgrade("Fertilizer",
			"Farms are <b>twice</b> as efficient.<q>It's chocolate, I swear.</q>",
			"Farm", 2);
		Game.TieredUpgrade("Cookie trees",
			"Farms are <b>twice</b> as efficient.<q>A relative of the breadfruit.</q>",
			"Farm", 3);

		order = 500;
		Game.TieredUpgrade("Sturdier conveyor belts",
			"Factories are <b>twice</b> as efficient.<q>You're going places.</q>",
			"Factory", 1);
		Game.TieredUpgrade("Child labor",
			"Factories are <b>twice</b> as efficient.<q>Cheaper, healthier workforce.</q>",
			"Factory", 2);
		Game.TieredUpgrade("Sweatshop",
			"Factories are <b>twice</b> as efficient.<q>Slackers will be terminated.</q>",
			"Factory", 3);

		order = 400;
		Game.TieredUpgrade("Sugar gas",
			"Mines are <b>twice</b> as efficient.<q>A pink, volatile gas, found in the depths of some chocolate caves.</q>",
			"Mine", 1);
		Game.TieredUpgrade("Megadrill",
			"Mines are <b>twice</b> as efficient.<q>You're in deep.</q>",
			"Mine", 2);
		Game.TieredUpgrade("Ultradrill",
			"Mines are <b>twice</b> as efficient.<q>Finally caved in?</q>",
			"Mine", 3);

		order = 600;
		Game.TieredUpgrade("Vanilla nebulae",
			"Shipments are <b>twice</b> as efficient.<q>If you removed your space helmet, you could probably smell it!<br>(Note : don't do that.)</q>",
			"Shipment", 1);
		Game.TieredUpgrade("Wormholes",
			"Shipments are <b>twice</b> as efficient.<q>By using these as shortcuts, your ships can travel much faster.</q>",
			"Shipment", 2);
		Game.TieredUpgrade("Frequent flyer",
			"Shipments are <b>twice</b> as efficient.<q>Come back soon!</q>",
			"Shipment", 3);

		order = 700;
		Game.TieredUpgrade("Antimony",
			"Alchemy labs are <b>twice</b> as efficient.<q>Actually worth a lot of mony.</q>",
			"Alchemy lab", 1);
		Game.TieredUpgrade("Essence of dough",
			"Alchemy labs are <b>twice</b> as efficient.<q>Extracted through the 5 ancient steps of alchemical baking.</q>",
			"Alchemy lab", 2);
		Game.TieredUpgrade("True chocolate",
			"Alchemy labs are <b>twice</b> as efficient.<q>The purest form of cacao.</q>",
			"Alchemy lab", 3);

		order = 800;
		Game.TieredUpgrade("Ancient tablet",
			"Portals are <b>twice</b> as efficient.<q>A strange slab of peanut brittle, holding an ancient cookie recipe. Neat!</q>",
			"Portal", 1);
		Game.TieredUpgrade("Insane oatling workers",
			"Portals are <b>twice</b> as efficient.<q>ARISE, MY MINIONS!</q>",
			"Portal", 2);
		Game.TieredUpgrade("Soul bond",
			"Portals are <b>twice</b> as efficient.<q>So I just sign up and get more cookies? Sure, whatever!</q>",
			"Portal", 3);

		order = 900;
		Game.TieredUpgrade("Flux capacitors",
			"Time machines are <b>twice</b> as efficient.<q>Bake to the future.</q>",
			"Time machine", 1);
		Game.TieredUpgrade("Time paradox resolver",
			"Time machines are <b>twice</b> as efficient.<q>No more fooling around with your own grandmother!</q>",
			"Time machine", 2);
		Game.TieredUpgrade("Quantum conundrum",
			"Time machines are <b>twice</b> as efficient.<q>There is only one constant, and that is universal uncertainty.<br>Or is it?</q>",
			"Time machine", 3);

		order = 20000;
		new Game.Upgrade("Kitten helpers",
			"You gain <b>more CpS</b> the more milk you have.<q>meow may I help you</q>",
			9000000, Game.GetIcon("Kitten", 1), {
				tier: 1,
				groups: "bonus|kitten:0.5"
			});
		new Game.Upgrade("Kitten workers",
			"You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow</q>",
			9000000000, Game.GetIcon("Kitten", 2), {
				tier: 2,
				groups: "bonus|kitten:1"
			});

		order = 10000;
		Game.CookieUpgrade({
			name: "Plain cookies",
			desc: "We all gotta start somewhere.",
			icon: [2, 3],
			power: 1,
			price: 999999
		});
		Game.CookieUpgrade({
			name: "Sugar cookies",
			desc: "Tasty, if a little unimaginative.",
			icon: [7, 3],
			power: 1,
			price: 999999 * 5
		});
		Game.CookieUpgrade({
			name: "Oatmeal raisin cookies",
			desc: "No raisin to hate these.",
			icon: [0, 3],
			power: 1,
			price: 9999999
		});
		Game.CookieUpgrade({
			name: "Peanut butter cookies",
			desc: "Get yourself some jam cookies!",
			icon: [1, 3],
			power: 1,
			price: 9999999 * 5
		});
		Game.CookieUpgrade({
			name: "Coconut cookies",
			desc: "Flaky, but not unreliable. Some people go crazy for these.",
			icon: [3, 3],
			power: 2,
			price: 99999999
		});
		order = 10001;
		Game.CookieUpgrade({
			name: "White chocolate cookies",
			desc: "I know what you'll say. It's just cocoa butter! It's not real chocolate!<br>Oh please.",
			icon: [4, 3],
			power: 2,
			price: 99999999 * 5
		});
		Game.CookieUpgrade({
			name: "Macadamia nut cookies",
			desc: "They're macadamn delicious!",
			icon: [5, 3],
			power: 2,
			price: 999999999
		});
		Game.CookieUpgrade({
			name: "Double-chip cookies",
			desc: "DOUBLE THE CHIPS<br>DOUBLE THE TASTY<br>(double the calories)",
			icon: [6, 3],
			power: 2,
			price: 999999999 * 5
		});
		Game.CookieUpgrade({
			name: "White chocolate macadamia nut cookies",
			desc: "Orteil's favorite.",
			icon: [8, 3],
			power: 2,
			price: 9999999999
		});
		Game.CookieUpgrade({
			name: "All-chocolate cookies",
			desc: "CHOCOVERDOSE.",
			icon: [9, 3],
			power: 2,
			price: 9999999999 * 5
		});

		order = 100;
		new Game.Upgrade("Quadrillion fingers",
			"The mouse and cursors gain <b>+500</b> cookies for each non-cursor object owned.<q>clickityclickityclickityclickityclick</q>",
			10000000000, [0, 17], {
				tier: 8,
				col: 0,
				groups: "cursor:200|click"
			});

		order = 200;
		Game.TieredUpgrade("Prune juice",
			"Grandmas are <b>twice</b> as efficient.<q>Gets me going.</q>",
			"Grandma", 4);
		order = 300;
		Game.TieredUpgrade("Genetically-modified cookies",
			"Farms are <b>twice</b> as efficient.<q>All-natural mutations.</q>",
			"Farm", 4);
		order = 500;
		Game.TieredUpgrade("Radium reactors",
			"Factories are <b>twice</b> as efficient.<q>Gives your cookies a healthy glow.</q>",
			"Factory", 4);
		order = 400;
		Game.TieredUpgrade("Ultimadrill",
			"Mines are <b>twice</b> as efficient.<q>Pierce the heavens, etc.</q>",
			"Mine", 4);
		order = 600;
		Game.TieredUpgrade("Warp drive",
			"Shipments are <b>twice</b> as efficient.<q>To boldly bake.</q>",
			"Shipment", 4);
		order = 700;
		Game.TieredUpgrade("Ambrosia",
			"Alchemy labs are <b>twice</b> as efficient.<q>Adding this to the cookie mix is sure to make them even more addictive!<br>Perhaps dangerously so.<br>Let's hope you can keep selling these legally.</q>",
			"Alchemy lab", 4);
		order = 800;
		Game.TieredUpgrade("Sanity dance",
			"Portals are <b>twice</b> as efficient.<q>We can change if we want to.<br>We can leave our brains behind.</q>",
			"Portal", 4);
		order = 900;
		Game.TieredUpgrade("Causality enforcer",
			"Time machines are <b>twice</b> as efficient.<q>What happened, happened.</q>",
			"Time machine", 4);

		order = 5000;
		new Game.Upgrade("Lucky day",
			"Golden cookies appear <b>twice as often</b> and stay <b>twice as long</b>.<q>Oh hey, a four-leaf penny!</q>",
			777777777, [27, 6], {groups: "goldCookie|goldSwitchMult"});
		new Game.Upgrade("Serendipity",
			"Golden cookies appear <b>twice as often</b> and stay <b>twice as long</b>.<q>What joy! Seven horseshoes!</q>",
			77777777777, [27, 6], {groups: "goldCookie|goldSwitchMult"});

		order = 20000;
		new Game.Upgrade("Kitten engineers",
			"You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow, sir</q>",
			90000000000000, Game.GetIcon("Kitten", 3), {
				tier: 3,
				groups: "bonus|kitten:2"
			});

		order = 10020;
		Game.CookieUpgrade({
			name: "Dark chocolate-coated cookies",
			desc: "These absorb light so well you almost need to squint to see them.",
			icon: [10, 3],
			power: 4,
			price: 99999999999
		});
		Game.CookieUpgrade({
			name: "White chocolate-coated cookies",
			desc: "These dazzling cookies absolutely glisten with flavor.",
			icon: [11, 3],
			power: 4,
			price: 99999999999
		});

		order = 250;
		Game.GrandmaSynergy("Farmer grandmas", "A nice farmer to grow more cookies.", "Farm");
		Game.GrandmaSynergy("Miner grandmas", "A nice miner to dig more cookies.", "Mine");
		Game.GrandmaSynergy("Worker grandmas", "A nice worker to manufacture more cookies.", "Factory");
		Game.GrandmaSynergy("Cosmic grandmas", "A nice thing to... uh... cookies.", "Shipment");
		Game.GrandmaSynergy("Transmuted grandmas", "A nice golden grandma to convert into more cookies.", "Alchemy lab");
		Game.GrandmaSynergy("Altered grandmas", "a NiCe GrAnDmA tO bA##########", "Portal");
		Game.GrandmaSynergy("Grandmas' grandmas", "A nice grandma's nice grandma to bake double the cookies.", "Time machine");

		order = 14000;
		new Game.Upgrade("Bingo center/Research facility",
			"Grandma-operated science lab and leisure club.<br>Grandmas are <b>4 times</b> as efficient.<br><b>Regularly unlocks new upgrades</b>.<q>What could possibly keep those grandmothers in check?...<br>Bingo.</q>",
			1000000000000000, [11, 9], {
				groups: "grandma|grandmapocalypse",
				require: function() {
					var elder = Game.GetAchiev("Elder");
					return Game.Objects["Grandma"].getAmount() >= 6 && (elder.getWon() || elder.require()); //ah order of execution
				}
			});

		order = 15000;
		new Game.Upgrade("Specialized chocolate chips",
			"Cookie production multiplier <b>+1%</b>.<q>Computer-designed chocolate chips. Computer chips, if you will.</q>",
			1000000000000000, [0, 9], {
				pool: "tech",
				groups: "plus:1.01|grandmapocalypse"
			});
		new Game.Upgrade("Designer cocoa beans",
			"Cookie production multiplier <b>+2%</b>.<q>Now more aerodynamic than ever!</q>",
			2000000000000000, [1, 9], {
				pool: "tech",
				groups: "plus:1.02|grandmapocalypse"
			});
		new Game.Upgrade("Ritual rolling pins",
			"Grandmas are <b>twice</b> as efficient.<q>The result of years of scientific research!</q>",
			4000000000000000, [2, 9], {
				pool: "tech",
				groups: "grandma|grandmapocalypse"
			});
		new Game.Upgrade("Underworld ovens",
			"Cookie production multiplier <b>+3%</b>.<q>Powered by science, of course!</q>",
			8000000000000000, [3, 9], {
				pool: "tech",
				groups: "plus:1.03|grandmapocalypse"
			});
		new Game.Upgrade("One mind",
			'Each grandma gains <b>+0.0<span></span>2 base CpS per grandma</b>.<div class="warning">Note : the grandmothers are growing restless. Do not encourage them.</div><q>We are one. We are many.</q>',
			16000000000000000, [4, 9], {
				pool: "tech",
				groups: "grandma|grandmapocalypse"
			});
		new Game.Upgrade("Exotic nuts",
			"Cookie production multiplier <b>+4%</b>.<q>You'll go crazy over these!</q>",
			32000000000000000, [5, 9], {
				pool: "tech",
				groups: "plus:1.04|grandmapocalypse"
			});
		new Game.Upgrade("Communal brainsweep",
			'Each grandma gains another <b>+0.0<span></span>2 base CpS per grandma</b>.<div class="warning">Note : proceeding any further in scientific research may have unexpected results. You have been warned.</div><q>We fuse. We merge. We grow.</q>',
			64000000000000000, [6, 9], {
				pool: "tech",
				groups: "grandma|grandmapocalypse"
			});
		new Game.Upgrade("Arcane sugar",
			"Cookie production multiplier <b>+5%</b>.<q>Tastes like insects, ligaments, and molasses.</q>",
			128000000000000000, [7, 9], {
				pool: "tech",
				groups: "plus:1.05|grandmapocalypse"
			});
		new Game.Upgrade("Elder Pact",
			'Each grandma gains <b>+0.0<span></span>5 base CpS per portal</b>.<div class="warning">Note : this is a bad idea.</div><q>squirm crawl slither writhe<br>today we rise</q>',
			256000000000000000, [8, 9], {
				pool: "tech",
				groups: "grandma|grandmapocalypse"
			});
		new Game.Upgrade("Elder Pledge",
			"Contains the wrath of the elders, at least for a while.<q>This is a simple ritual involving anti-aging cream, cookie batter mixed in the moonlight, and a live chicken.</q>",
			1, [9, 9], {
				pool: "toggle",
				groups: "grandmapocalypse",
				priceFunc: function(pledges) {
					if (isNaN(pledges)) { pledges = Game.pledges; }
					return Math.pow(8, Math.min(pledges + 2, 14));
				},
				descFunc: function() {
					return ('<div style="text-align:center;">' +
						(Game.pledges == 0 ?
							"You haven't pledged to the elders yet." :
							("You've pledged to the elders <b>" +
								(Game.pledges == 1 ? "once" : Game.pledges == 2 ? "twice" : (Game.pledges + " times")) + "</b>.")) +
						'<div class="line"></div></div>' + this.desc);
				}
			});

		order = 150;
		new Game.Upgrade("Plastic mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>Slightly squeaky.</q>",
			50000, [11, 0], {
				tier: 1,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Iron mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>Click like it's 1349!</q>",
			5000000, [11, 1], {
				tier: 2,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Titanium mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>Heavy, but powerful.</q>",
			500000000, [11, 2], {
				tier: 3,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Adamantium mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>You could cut diamond with these.</q>",
			50000000000, [11, 13], {
				tier: 4,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});

		order = 40000;
		new Game.Upgrade("Ultrascience",
			"Research takes only <b>5 seconds</b>.<q>YEAH, SCIENCE!</q>",
			7, [9, 2], {
				pool: "debug",
				groups: "grandmapocalypse|misc"
			}); //debug purposes only

		order = 10020;
		Game.CookieUpgrade({
			name: "Eclipse cookies",
			desc: "Look to the cookie.",
			icon: [0, 4],
			power: 2,
			price: 99999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Zebra cookies",
			desc: "...",
			icon: [1, 4],
			power: 2,
			price: 999999999999
		});

		order = 100;
		new Game.Upgrade("Quintillion fingers",
			"The mouse and cursors gain <b>+5000</b> cookies for each non-cursor object owned.<q>man, just go click click click click click, it's real easy, man.</q>",
			10000000000000, [0, 18], {
				tier: 9,
				col: 0,
				groups: "cursor:250|click"
			});

		order = 40000;
		new Game.Upgrade("Gold hoard",
			"Golden cookies appear <b>really often</b>.<q>That's entirely too many.</q>",
			7, [10, 14], {
				pool: "debug",
				groups: "goldCookie|misc"
			}); //debug purposes only

		order = 15000;
		new Game.Upgrade("Elder Covenant",
			"Puts a permanent end to the elders' wrath, at the price of 5% of your CpS.<q>This is a complicated ritual involving silly, inconsequential trivialities such as cursed laxatives, century-old cacao, and an infant.<br>Don't question it.</q>",
			66666666666666, [8, 9], {
				pool: "toggle",
				groups: "bonus|grandmapocalypse|globalCpsMod",
				isParent: true,
				setCpsNegative: true
			});
		var covenant = Game.last;

		new Game.Upgrade("Revoke Elder Covenant",
			"You will get 5% of your CpS back, but the grandmatriarchs will return.<q>we<br>rise<br>again</q>",
			6666666666, [8, 9], {
				pool: "toggle",
				groups: "bonus|grandmapocalypse|globalCpsMod",
				toggleInto: covenant,
				isChild: true
			});
		covenant.toggleInto = Game.last;

		order = 5000;
		new Game.Upgrade("Get lucky",
			"Golden cookie effects last <b>twice as long</b>.<q>You've been up all night, haven't you?</q>",
			77777777777777, [27, 6], {groups: "goldCookie|goldSwitchMult"});

		order = 15000;
		new Game.Upgrade("Sacrificial rolling pins",
			"Elder pledges last <b>twice</b> as long.<q>These are mostly just for spreading the anti-aging cream.<br>(And accessorily, shortening the chicken's suffering.)</q>",
			2888888888888, [2, 9], {groups: "misc|grandmapocalypse|misc"});

		order = 10020;
		Game.CookieUpgrade({
			name: "Snickerdoodles",
			desc: "True to their name.",
			icon: [2, 4],
			power: 2,
			price: 999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Stroopwafels",
			desc: "If it ain't dutch, it ain't much.",
			icon: [3, 4],
			power: 2,
			price: 9999999999999
		});
		Game.CookieUpgrade({
			name: "Macaroons",
			desc: "Not to be confused with macarons.<br>These have coconut, okay?",
			icon: [4, 4],
			power: 2,
			price: 9999999999999 * 5
		});

		order = 40000;
		new Game.Upgrade("Neuromancy",
			"Can toggle upgrades on and off at will in the stats menu.<q>Can also come in handy to unsee things that can't be unseen.</q>",
			7, [4, 9], {
				pool: "debug",
				groups: "misc",
				buyFunc: function() { Game.toggleShowDebug(Game.showDebug); }
			}); //debug purposes only

		order = 10031;
		Game.CookieUpgrade({
			name: "Empire biscuits",
			desc: "For your growing cookie empire, of course!",
			icon: [5, 4],
			power: 2,
			price: 99999999999999
		});
		Game.CookieUpgrade({
			name: "British tea biscuits",
			desc: "Quite.",
			icon: [6, 4],
			require: "Tin of british tea biscuits",
			power: 2,
			price: 99999999999999
		});
		Game.CookieUpgrade({
			name: "Chocolate british tea biscuits",
			desc: "Yes, quite.",
			icon: [7, 4],
			require: Game.last.name,
			power: 2,
			price: 99999999999999
		});
		Game.CookieUpgrade({
			name: "Round british tea biscuits",
			desc: "Yes, quite riveting.",
			icon: [8, 4],
			require: Game.last.name,
			power: 2,
			price: 99999999999999
		});
		Game.CookieUpgrade({
			name: "Round chocolate british tea biscuits",
			desc: "Yes, quite riveting indeed.",
			icon: [9, 4],
			require: Game.last.name,
			power: 2,
			price: 99999999999999
		});
		Game.CookieUpgrade({
			name: "Round british tea biscuits with heart motif",
			desc: "Yes, quite riveting indeed, old chap.",
			icon: [10, 4],
			require: Game.last.name,
			power: 2,
			price: 99999999999999
		});
		Game.CookieUpgrade({
			name: "Round chocolate british tea biscuits with heart motif",
			desc: "I like cookies.",
			icon: [11, 4],
			require: Game.last.name,
			power: 2,
			price: 99999999999999
		});

		order = 1000;
		Game.TieredUpgrade("Sugar bosons",
			"Antimatter condensers are <b>twice</b> as efficient.<q>Sweet firm bosons.</q>",
			"Antimatter condenser", 1);
		Game.TieredUpgrade("String theory",
			"Antimatter condensers are <b>twice</b> as efficient.<q>Reveals new insight about the true meaning of baking cookies (and, as a bonus, the structure of the universe).</q>",
			"Antimatter condenser", 2);
		Game.TieredUpgrade("Large macaron collider",
			"Antimatter condensers are <b>twice</b> as efficient.<q>How singular!</q>",
			"Antimatter condenser", 3);
		Game.TieredUpgrade("Big bang bake",
			"Antimatter condensers are <b>twice</b> as efficient.<q>And that's how it all began.</q>",
			"Antimatter condenser", 4);

		order = 255;
		Game.GrandmaSynergy("Antigrandmas", "A mean antigrandma to vomit more cookies.", "Antimatter condenser");

		order = 10020;
		Game.CookieUpgrade({
			name: "Madeleines",
			desc: "Unforgettable!",
			icon: [12, 3],
			power: 2,
			price: 99999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Palmiers",
			desc: "Palmier than you!",
			icon: [13, 3],
			power: 2,
			price: 99999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Palets",
			desc: "You could probably play hockey with these.<br>I mean, you're welcome to try.",
			icon: [12, 4],
			power: 2,
			price: 999999999999999
		});
		Game.CookieUpgrade({
			name: "Sabl&eacute;s",
			desc: "The name implies they're made of sand. But you know better, don't you?",
			icon: [13, 4],
			power: 2,
			price: 999999999999999
		});

		order = 20000;
		new Game.Upgrade("Kitten overseers",
			"You gain <b>more CpS</b> the more milk you have.<q>my purrpose is to serve you, sir</q>",
			90000000000000000, Game.GetIcon("Kitten", 4), {
				tier: 4,
				groups: "bonus|kitten:3"
			});

		order = 100;
		new Game.Upgrade("Sextillion fingers",
			"The mouse and cursors gain <b>+50000</b> cookies for each non-cursor object owned.<q>sometimes<br>things just<br>click</q>",
			10000000000000000, [0, 19], {
				tier: 10,
				col: 0,
				groups: "cursor:300|click"
			});

		order = 200;
		Game.TieredUpgrade("Double-thick glasses",
			"Grandmas are <b>twice</b> as efficient.<q>Oh... so THAT's what I've been baking.</q>",
			"Grandma", 5);
		order = 300;
		Game.TieredUpgrade("Gingerbread scarecrows",
			"Farms are <b>twice</b> as efficient.<q>Staring at your crops with mischievous glee.</q>",
			"Farm", 5);
		order = 500;
		Game.TieredUpgrade("Recombobulators",
			"Factories are <b>twice</b> as efficient.<q>A major part of cookie recombobulation.</q>",
			"Factory", 5);
		order = 400;
		Game.TieredUpgrade("H-bomb mining",
			"Mines are <b>twice</b> as efficient.<q>Questionable efficiency, but spectacular nonetheless.</q>",
			"Mine", 5);
		order = 600;
		Game.TieredUpgrade("Chocolate monoliths",
			"Shipments are <b>twice</b> as efficient.<q>My god. It's full of chocolate bars.</q>",
			"Shipment", 5);
		order = 700;
		Game.TieredUpgrade("Aqua crustulae",
			"Alchemy labs are <b>twice</b> as efficient.<q>Careful with the dosing - one drop too much and you get muffins.<br>And nobody likes muffins.</q>",
			"Alchemy lab", 5);
		order = 800;
		Game.TieredUpgrade("Brane transplant",
			'Portals are <b>twice</b> as efficient.<q>This refers to the practice of merging higher dimensional universes, or "branes", with our own, in order to facilitate transit (and harvesting of precious cookie dough).</q>',
			"Portal", 5);
		order = 900;
		Game.TieredUpgrade("Yestermorrow comparators",
			"Time machines are <b>twice</b> as efficient.<q>Fortnights into milleniums.</q>",
			"Time machine", 5);
		order = 1000;
		Game.TieredUpgrade("Reverse cyclotrons",
			"Antimatter condensers are <b>twice</b> as efficient.<q>These can uncollision particles and unspin atoms. For... uh... better flavor, and stuff.</q>",
			"Antimatter condenser", 5);

		order = 150;
		new Game.Upgrade("Unobtainium mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>These nice mice should suffice.</q>",
			5000000000000, [11, 14], {
				tier: 5,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});

		order = 10020;
		Game.CookieUpgrade({
			name: "Caramoas",
			desc: "Yeah. That's got a nice ring to it.",
			icon: [14, 4],
			require: "Box of brand biscuits",
			power: 3,
			price: 9999999999999999
		});
		Game.CookieUpgrade({
			name: "Sagalongs",
			desc: "Grandma's favorite?",
			icon: [15, 3],
			require: "Box of brand biscuits",
			power: 3,
			price: 9999999999999999
		});
		Game.CookieUpgrade({
			name: "Shortfoils",
			desc: "Foiled again!",
			icon: [15, 4],
			require: "Box of brand biscuits",
			power: 3,
			price: 9999999999999999
		});
		Game.CookieUpgrade({
			name: "Win mints",
			desc: "They're the luckiest cookies you've ever tasted!",
			icon: [14, 3],
			require: "Box of brand biscuits",
			power: 3,
			price: 9999999999999999
		});

		order = 40000;
		new Game.Upgrade("Perfect idling",
			"You keep producing cookies even while the game is closed.<q>It's the most beautiful thing I've ever seen.</q>",
			7, [10, 0], {
				pool: "debug",
				groups: "misc"
			}); //debug purposes only

		order = 10030;
		Game.CookieUpgrade({
			name: "Fig gluttons",
			desc: "Got it all figured out.",
			icon: [17, 4],
			require: "Box of brand biscuits",
			power: 2,
			price: 999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Loreols",
			desc: "Because, uh... they're worth it?",
			icon: [16, 3],
			require: "Box of brand biscuits",
			power: 2,
			price: 999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Jaffa cakes",
			desc: "If you want to bake a cookie from scratch, you must first build a factory.",
			icon: [17, 3],
			require: "Box of brand biscuits",
			power: 2,
			price: 999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Grease's cups",
			desc: "Extra-greasy peanut butter.",
			icon: [16, 4],
			require: "Box of brand biscuits",
			power: 2,
			price: 999999999999999 * 5
		});

		order = 30000;
		new Game.Upgrade("Heavenly chip secret",
			"Unlocks <b>5%</b> of the potential of your prestige level.<q>Grants the knowledge of heavenly chips, and how to use them to make baking more efficient.<br>It's a secret to everyone.</q>",
			11, [19, 7], {
				groups: "bonus|heaven|heavenAch",
				require: function() { return Game.ascensionMode !== 1 && Game.prestige > 0; }
			});
		new Game.Upgrade("Heavenly cookie stand",
			"Unlocks <b>25%</b> of the potential of your prestige level.<q>Don't forget to visit the heavenly lemonade stand afterwards. When afterlife gives you lemons...</q>",
			1111, [18, 7], {
				groups: "bonus|heaven|heavenAch",
				require: function() { return Game.ascensionMode !== 1 && Game.prestige > 0 && Game.HasUpgrade("Heavenly chip secret"); }
			});
		new Game.Upgrade("Heavenly bakery",
			"Unlocks <b>50%</b> of the potential of your prestige level.<q>Also sells godly cakes and divine pastries. The pretzels aren't too bad either.</q>",
			111111, [17, 7], {
				groups: "bonus|heaven|heavenAch",
				require: function() { return Game.ascensionMode !== 1 && Game.prestige > 0 && Game.HasUpgrade("Heavenly cookie stand"); }
			});
		new Game.Upgrade("Heavenly confectionery",
			"Unlocks <b>75%</b> of the potential of your prestige level.<q>They say angel bakers work there. They take angel lunch breaks and sometimes go on angel strikes.</q>",
			11111111, [16, 7], {
				groups: "bonus|heaven|heavenAch",
				require: function() { return Game.ascensionMode !== 1 && Game.prestige > 0 && Game.HasUpgrade("Heavenly bakery"); }
			});
		new Game.Upgrade("Heavenly key",
			"Unlocks <b>100%</b> of the potential of your prestige level.<q>This is the key to the pearly (and tasty) gates of pastry heaven, granting you access to your entire stockpile of heavenly chips for baking purposes.<br>May you use them wisely.</q>",
			1111111111, [15, 7], {
				groups: "bonus|heaven|heavenAch",
				require: function() { return Game.ascensionMode !== 1 && Game.prestige > 0 && Game.HasUpgrade("Heavenly confectionery"); }
			});

		order = 10100;
		Game.CookieUpgrade({
			name: "Skull cookies",
			desc: "Wanna know something spooky? You've got one of these inside your head RIGHT NOW.",
			locked: true,
			icon: [12, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});
		Game.CookieUpgrade({
			name: "Ghost cookies",
			desc: "They're something strange, but they look pretty good!",
			locked: true,
			icon: [13, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});
		Game.CookieUpgrade({
			name: "Bat cookies",
			desc: "The cookies this town deserves.",
			locked: true,
			icon: [14, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});
		Game.CookieUpgrade({
			name: "Slime cookies",
			desc: "The incredible melting cookies!",
			locked: true,
			icon: [15, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});
		Game.CookieUpgrade({
			name: "Pumpkin cookies",
			desc: "Not even pumpkin-flavored. Tastes like glazing. Yeugh.",
			locked: true,
			icon: [16, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});
		Game.CookieUpgrade({
			name: "Eyeball cookies",
			desc: "When you stare into the cookie, the cookie stares back at you.",
			locked: true,
			icon: [17, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});
		Game.CookieUpgrade({
			name: "Spider cookies",
			desc: "You found the recipe on the web. They do whatever a cookie can.",
			locked: true,
			icon: [18, 8],
			power: 2,
			price: 444444444444,
			groups: "halloween|halloweenAch|grandmapocalypse"
		});

		order = 0;
		new Game.Upgrade("Persistent memory",
			"Subsequent research will be <b>10 times</b> as fast.<q>It's all making sense!<br>Again!</q>",
			500, [9, 2], {
				pool: "prestige",
				groups: "grandmapocalypse"
			});

		order = 40000;
		new Game.Upgrade("Wrinkler doormat",
			"Wrinklers spawn much more frequently.<q>You're such a pushover.</q>",
			7, [19, 8], {
				pool: "debug",
				groups: "grandmapocalypse|misc"
			}); //debug purposes only

		order = 10200;
		Game.CookieUpgrade({
			name: "Christmas tree biscuits",
			desc: "Whose pine is it anyway?",
			locked: true,
			icon: [12, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});
		Game.CookieUpgrade({
			name: "Snowflake biscuits",
			desc: "Mass-produced to be unique in every way.",
			locked: true,
			icon: [13, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});
		Game.CookieUpgrade({
			name: "Snowman biscuits",
			desc: "It's frosted. Doubly so.",
			locked: true,
			icon: [14, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});
		Game.CookieUpgrade({
			name: "Holly biscuits",
			desc: "You don't smooch under these ones. That would be the mistletoe (which, botanically, is a smellier variant of the mistlefinger).",
			locked: true,
			icon: [15, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});
		Game.CookieUpgrade({
			name: "Candy cane biscuits",
			desc: "It's two treats in one!<br>(Further inspection reveals the frosting does not actually taste like peppermint, but like mundane sugary frosting.)",
			locked: true,
			icon: [16, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});
		Game.CookieUpgrade({
			name: "Bell biscuits",
			desc: "What do these even have to do with christmas? Who cares, ring them in!",
			locked: true,
			icon: [17, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});
		Game.CookieUpgrade({
			name: "Present biscuits",
			desc: "The prequel to future biscuits. Watch out!",
			locked: true,
			icon: [18, 10],
			power: 2,
			price: 252525252525,
			groups: "christmas|christmasAch"
		});

		order = 10020;
		Game.CookieUpgrade({
			name: "Gingerbread men",
			desc: "You like to bite the legs off first, right? How about tearing off the arms? You sick monster.",
			icon: [18, 4],
			power: 2,
			price: 9999999999999999
		});
		Game.CookieUpgrade({
			name: "Gingerbread trees",
			desc: "Evergreens in pastry form. Yule be surprised what you can come up with.",
			icon: [18, 3],
			power: 2,
			price: 9999999999999999
		});

		order = 25000;
		new Game.Upgrade("A festive hat",
			"<b>Unlocks... something.</b><q>Not a creature was stirring, not even a mouse.</q>",
			25, [19, 9], {
				groups: "christmas|misc",
				buyFunc: function() {
					if (this.bought && !Game.santa.dropEle.selectedIndex) { Game.santa.dropEle.selectedIndex = 1; }
				}
			});
		Game.last.createCrate("#familiarIcons");

		new Game.Upgrade("Increased merriness",
			"Cookie production multiplier <b>+15%</b>.<br>Cost scales with Santa level.<q>It turns out that the key to increased merriness, strangely enough, happens to be a good campfire and some s'mores.<br>You know what they say, after all; the s'more, the merrier.</q>",
			2525, [17, 9], {groups: "christmas|plus:1.15|santaDrop"});
		new Game.Upgrade("Improved jolliness",
			"Cookie production multiplier <b>+15%</b>.<br>Cost scales with Santa level.<q>A nice wobbly belly goes a long way.<br>You jolly?</q>",
			2525, [17, 9], {groups: "christmas|plus:1.15|santaDrop"});
		new Game.Upgrade("A lump of coal",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with Santa level.<q>Some of the world's worst stocking stuffing.<br>I guess you could try starting your own little industrial revolution, or something?...</q>",
			2525, [13, 9], {groups: "christmas|plus:1.01|santaDrop"});
		new Game.Upgrade("An itchy sweater",
			'Cookie production multiplier <b>+1%</b>.<br>Cost scales with Santa level.<q>You don\'t know what\'s worse : the embarrassingly quaint "elf on reindeer" motif, or the fact that wearing it makes you feel like you\'re wrapped in a dead sasquatch.</q>',
			2525, [14, 9], {groups: "christmas|plus:1.01|santaDrop"});
		new Game.Upgrade("Reindeer baking grounds",
			"Reindeer appear <b>twice as frequently</b>.<br>Cost scales with Santa level.<q>Male reindeer are from Mars; female reindeer are from venison.</q>",
			2525, [12, 9], {groups: "christmas|misc|santaDrop"});
		new Game.Upgrade("Weighted sleighs",
			"Reindeer are <b>twice as slow</b>.<br>Cost scales with Santa level.<q>Hope it was worth the weight.<br>(Something something forced into cervidude)</q>",
			2525, [12, 9], {groups: "christmas|misc|santaDrop"});
		new Game.Upgrade("Ho ho ho-flavored frosting",
			"Reindeer give <b>twice as much</b>.<br>Cost scales with Santa level.<q>It's time to up the antler.</q>",
			2525, [12, 9], {groups: "christmas|misc|santaDrop"});
		new Game.Upgrade("Season savings",
			"All buildings are <b>1% cheaper</b>.<br>Cost scales with Santa level.<q>By Santa's beard, what savings!<br>But who will save us?</q>",
			2525, [16, 9], {groups: "christmas|priceReduction|misc|santaDrop"});
		new Game.Upgrade("Toy workshop",
			"All upgrades are <b>5% cheaper</b>.<br>Cost scales with Santa level.<q>Watch yours-elf around elvesdroppers who might steal our production secrets.<br>Or elven worse!</q>",
			2525, [16, 9], {groups: "christmas|priceReduction|misc|santaDrop"});
		new Game.Upgrade("Naughty list",
			"Grandmas are <b>twice</b> as productive.<br>Cost scales with Santa level.<q>This list contains every unholy deed perpetuated by grandmakind.<br>He won't be checking this one twice.<br>Once. Once is enough.</q>",
			2525, [15, 9], {groups: "christmas|grandma|santaDrop"});
		new Game.Upgrade("Santa's bottomless bag",
			"Random drops are <b>10% more common</b>.<br>Cost scales with Santa level.<q>This is one bottom you can't check out.</q>",
			2525, [19, 9], {groups: "christmas|misc|santaDrop"});
		new Game.Upgrade("Santa's helpers",
			"Clicking is <b>10% more powerful</b>.<br>Cost scales with Santa level.<q>Some choose to help hamburger; some choose to help you.<br>To each their own, I guess.</q>",
			2525, [19, 9], {groups: "christmas|click|onlyClick|santaDrop"});
		new Game.Upgrade("Santa's legacy",
			"Cookie production multiplier <b>+3% per Santa's levels</b>.<br>Cost scales with Santa level.<q>In the north pole, you gotta get the elves first. Then when you get the elves, you start making the toys. Then when you get the toys... then you get the cookies.</q>",
			2525, [19, 9], {groups: "christmas|bonus|santaDrop"});
		new Game.Upgrade("Santa's milk and cookies",
			"Milk is <b>5% more powerful</b>.<br>Cost scales with Santa level.<q>Part of Santa's dreadfully unbalanced diet.</q>",
			2525, [19, 9], {groups: "christmas|bonus|santaDrop"});

		order = 40000;
		new Game.Upgrade("Reindeer season",
			"Reindeer spawn much more frequently.<q>Go, Cheater! Go, Hacker and Faker!</q>",
			7, [12, 9], {
				pool: "debug",
				groups: "christmas|misc"
			}); //debug purposes only

		order = 25000;
		new Game.Upgrade("Santa's dominion",
			"Cookie production multiplier <b>+20%</b>.<br>All buildings are <b>1% cheaper</b>.<br>All upgrades are <b>2% cheaper</b>.<q>My name is Claus, king of kings;<br>Look on my toys, ye Mighty, and despair!</q>",
			2525252525252525, [19, 10], {groups: "christmas|priceReduction|plus:1.2"});

		order = 10300;
		var heartPower = function() {
			var pow = 2;
			if (Game.Has("Starlove")) { pow = 3; }
			var godLvl = Game.hasGod("seasons");
			if (godLvl == 1) { pow *= 1.3; } else if (godLvl == 2) { pow *= 1.2; } else if (godLvl == 3) { pow *= 1.1; }
			return pow;
		};
		Game.CookieUpgrade({
			name: "Pure heart biscuits",
			desc: 'Melty white chocolate<br>that says "I *like* like you".',
			season: "valentines",
			icon: [19, 3],
			power: heartPower,
			price: 1000000,
			groups: "valentines|valentinesAch"
		});
		Game.CookieUpgrade({
			name: "Ardent heart biscuits",
			desc: "A red hot cherry biscuit that will nudge the target of your affection in interesting directions.",
			require: Game.last.name,
			season: "valentines",
			icon: [20, 3],
			power: heartPower,
			price: 1000000000,
			groups: "valentines|valentinesAch"
		});
		Game.CookieUpgrade({
			name: "Sour heart biscuits",
			desc: "A bitter lime biscuit for the lonely and the heart-broken.",
			require: Game.last.name,
			season: "valentines",
			icon: [20, 4],
			power: heartPower,
			price: 1000000000000,
			groups: "valentines|valentinesAch"
		});
		Game.CookieUpgrade({
			name: "Weeping heart biscuits",
			desc: "An ice-cold blueberry biscuit, symbol of a mending heart.",
			require: Game.last.name,
			season: "valentines",
			icon: [21, 3],
			power: heartPower,
			price: 1000000000000000,
			groups: "valentines|valentinesAch"
		});
		Game.CookieUpgrade({
			name: "Golden heart biscuits",
			desc: "A beautiful biscuit to symbolize kindness, true love, and sincerity.",
			require: Game.last.name,
			season: "valentines",
			icon: [21, 4],
			power: heartPower,
			price: 1000000000000000000,
			groups: "valentines|valentinesAch"
		});
		Game.CookieUpgrade({
			name: "Eternal heart biscuits",
			desc: "Silver icing for a very special someone you've liked for a long, long time.",
			require: Game.last.name,
			season: "valentines",
			icon: [19, 4],
			power: heartPower,
			price: 1000000000000000000000,
			groups: "valentines|valentinesAch"
		});

		order = 1100;
		Game.TieredUpgrade("Gem polish",
			"Prisms are <b>twice</b> as efficient.<q>Get rid of the grime and let more light in.<br>Truly, truly outrageous.</q>",
			"Prism", 1);
		Game.TieredUpgrade("9th color",
			"Prisms are <b>twice</b> as efficient.<q>Delve into untouched optical depths where even the mantis shrimp hasn't set an eye!</q>",
			"Prism", 2);
		Game.TieredUpgrade("Chocolate light",
			"Prisms are <b>twice</b> as efficient.<q>Bask into its cocoalescence.<br>(Warning : may cause various interesting albeit deadly skin conditions.)</q>",
			"Prism", 3);
		Game.TieredUpgrade("Grainbow",
			"Prisms are <b>twice</b> as efficient.<q>Remember the different grains using the handy Roy G. Biv mnemonic : R is for rice, O is for oats... uh, B for barley?...</q>",
			"Prism", 4);
		Game.TieredUpgrade("Pure cosmic light",
			"Prisms are <b>twice</b> as efficient.<q>Your prisms now receive pristine, unadulterated photons from the other end of the universe.</q>",
			"Prism", 5);

		order = 255;
		Game.GrandmaSynergy("Rainbow grandmas", "A luminous grandma to sparkle into cookies.", "Prism");

		order = 24000;
		new Game.Upgrade("Season switcher",
			"Allows you to <b>trigger seasonal events</b> at will, for a price.<q>There will always be time.</q>",
			1111, [16, 6], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Festive biscuit",
			"Triggers <b>Christmas season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<br>Cost scales with unbuffed CpS and increases with every season switch.<q>'Twas the night before Christmas- or was it?</q>",
			Game.seasonTriggerBasePrice, [12, 10], {
				pool: "toggle",
				groups: "seasonSwitch",
				season: "christmas",
				descFunc: function() {
					var santaDrops = Game.UpgradesByGroup.santaDrop;
					var reindeerDrops = Game.UpgradesByGroup.christmasAch;
					return ('<div style="text-align:center;">' +
						Game.listTinyOwnedUpgrades(santaDrops) + "<br><br>You've purchased <b>" + Game.countUpgradesByGroup(santaDrops) + "/" +
						santaDrops.length + '</b> of Santa\'s gifts.<div class="line"></div>' +
						Game.listTinyOwnedUpgrades(reindeerDrops) + "<br><br>You've purchased <b>" + Game.countUpgradesByGroup(reindeerDrops) + "/" +
						reindeerDrops.length + '</b> reindeer cookies.<div class="line"></div>' +
						Game.saySeasonSwitchUses() + '<div class="line"></div></div>' + this.desc);
				}
			});
		new Game.Upgrade("Ghostly biscuit",
			"Triggers <b>Halloween season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<br>Cost scales with unbuffed CpS and increases with every season switch.<q>spooky scary skeletons<br>will wake you with a boo</q>",
			Game.seasonTriggerBasePrice, [13, 8], {
				pool: "toggle",
				groups: "seasonSwitch",
				season: "halloween",
				descFunc: function() {
					var halloweenDrops = Game.UpgradesByGroup.halloweenAch;
					return ('<div style="text-align:center;">' +
						Game.listTinyOwnedUpgrades(halloweenDrops) + "<br><br>You've purchased <b>" + Game.countUpgradesByGroup(halloweenDrops) +
						"/" + halloweenDrops.length + '</b> halloween cookies.<div class="line"></div>' +
						Game.saySeasonSwitchUses() + '<div class="line"></div></div>' + this.desc);
				}
			});
		new Game.Upgrade("Lovesick biscuit",
			"Triggers <b>Valentine's Day season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<br>Cost scales with unbuffed CpS and increases with every season switch.<q>Romance never goes out of fashion.</q>",
			Game.seasonTriggerBasePrice, [20, 3], {
				pool: "toggle",
				groups: "seasonSwitch",
				season: "valentines",
				descFunc: function() {
					var heartDrops = Game.UpgradesByGroup.valentinesAch;
					return ('<div style="text-align:center;">' +
						Game.listTinyOwnedUpgrades(heartDrops) + "<br><br>You've purchased <b>" + Game.countUpgradesByGroup(heartDrops) + "/" +
						heartDrops.length + '</b> heart biscuits.<div class="line"></div>' +
						Game.saySeasonSwitchUses() + '<div class="line"></div></div>' + this.desc);
				}
			});
		new Game.Upgrade("Fool's biscuit",
			"Triggers <b>Business Day season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<br>Cost scales with unbuffed CpS and increases with every season switch.<q>Business. Serious business. This is absolutely all of your business.</q>",
			Game.seasonTriggerBasePrice, [17, 6], {
				pool: "toggle",
				groups: "seasonSwitch",
				season: "fools",
				descFunc: function() {
					return ('<div style="text-align:center;">' + Game.saySeasonSwitchUses() + '<div class="line"></div></div>' + this.desc);
				}
			});

		order = 40000;
		new Game.Upgrade("Eternal seasons",
			"Seasons now last forever.<q>Season to taste.</q>",
			7, [16, 6], {
				pool: "debug",
				groups: "misc"
			}); //debug purposes only

		order = 20000;
		new Game.Upgrade("Kitten managers",
			"You gain <b>more CpS</b> the more milk you have.<q>that's not gonna paws any problem, sir</q>",
			900000000000000000000, Game.GetIcon("Kitten", 5), {
				tier: 5,
				groups: "bonus|kitten:4"
			});

		order = 100;
		new Game.Upgrade("Septillion fingers",
			"The mouse and cursors gain <b>+500000</b> cookies for each non-cursor object owned.<q>[cursory flavor text]</q>",
			10000000000000000000, [12, 20], {
				tier: 11,
				col: 0,
				groups: "cursor:350|click"
			});
		new Game.Upgrade("Octillion fingers",
			"The mouse and cursors gain <b>+5000000</b> cookies for each non-cursor object owned.<q>Turns out you <b>can</b> quite put your finger on it.</q>",
			10000000000000000000000, [12, 19], {
				tier: 12,
				col: 0,
				groups: "cursor:400|click"
			});

		order = 150;
		new Game.Upgrade("Eludium mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>I rodent do that if I were you.</q>",
			500000000000000, [11, 15], {
				tier: 6,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Wishalloy mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>Clicking is fine and dandy, but don't smash your mouse over it. Get your game on. Go play.</q>",
			50000000000000000, [11, 16], {
				tier: 7,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		order = 200;
		Game.TieredUpgrade("Aging agents",
			"Grandmas are <b>twice</b> as efficient.<q>Counter-intuitively, grandmas have the uncanny ability to become more powerful the older they get.</q>",
			"Grandma", 6);
		order = 300;
		Game.TieredUpgrade("Pulsar sprinklers",
			"Farms are <b>twice</b> as efficient.<q>There's no such thing as over-watering. The moistest is the bestest.</q>",
			"Farm", 6);
		order = 500;
		Game.TieredUpgrade("Deep-bake process",
			"Factories are <b>twice</b> as efficient.<q>A patented process increasing cookie yield two-fold for the same amount of ingredients. Don't ask how, don't take pictures, and be sure to wear your protective suit.</q>",
			"Factory", 6);
		order = 400;
		Game.TieredUpgrade("Coreforge",
			"Mines are <b>twice</b> as efficient.<q>You've finally dug a tunnel down to the Earth's core. It's pretty warm down here.</q>",
			"Mine", 6);
		order = 600;
		Game.TieredUpgrade("Generation ship",
			"Shipments are <b>twice</b> as efficient.<q>Built to last, this humongous spacecraft will surely deliver your cookies to the deep ends of space, one day.</q>",
			"Shipment", 6);
		order = 700;
		Game.TieredUpgrade("Origin crucible",
			"Alchemy labs are <b>twice</b> as efficient.<q>Built from the rarest of earths and located at the very deepest of the largest mountain, this legendary crucible is said to retain properties from the big-bang itself.</q>",
			"Alchemy lab", 6);
		order = 800;
		Game.TieredUpgrade("Deity-sized portals",
			"Portals are <b>twice</b> as efficient.<q>It's almost like, say, an elder god could fit through this thing now. Hypothetically.</q>",
			"Portal", 6);
		order = 900;
		Game.TieredUpgrade("Far future enactment",
			"Time machines are <b>twice</b> as efficient.<q>The far future enactment authorizes you to delve deep into the future - where civilization has fallen and risen again, and cookies are plentiful.</q>",
			"Time machine", 6);
		order = 1000;
		Game.TieredUpgrade("Nanocosmics",
			"Antimatter condensers are <b>twice</b> as efficient.<q>The theory of nanocosmics posits that each subatomic particle is in fact its own self-contained universe, holding unfathomable amounts of energy.<br>This somehow stacks with the nested universe theory, because physics.</q>",
			"Antimatter condenser", 6);
		order = 1100;
		Game.TieredUpgrade("Glow-in-the-dark",
			"Prisms are <b>twice</b> as efficient.<q>Your prisms now glow in the dark, effectively doubling their output!</q>",
			"Prism", 6);

		order = 10032;
		Game.CookieUpgrade({
			name: "Rose macarons",
			desc: "Although an odd flavor, these pastries recently rose in popularity.",
			icon: [22, 3],
			require: "Box of macarons",
			power: 3,
			price: 9999
		});
		Game.CookieUpgrade({
			name: "Lemon macarons",
			desc: "Tastefully sour, delightful treats.",
			icon: [23, 3],
			require: "Box of macarons",
			power: 3,
			price: 9999999
		});
		Game.CookieUpgrade({
			name: "Chocolate macarons",
			desc: "They're like tiny sugary burgers!",
			icon: [24, 3],
			require: "Box of macarons",
			power: 3,
			price: 9999999999
		});
		Game.CookieUpgrade({
			name: "Pistachio macarons",
			desc: "Pistachio shells now removed after multiple complaints.",
			icon: [22, 4],
			require: "Box of macarons",
			power: 3,
			price: 9999999999999
		});
		Game.CookieUpgrade({
			name: "Hazelnut macarons",
			desc: "These go especially well with coffee.",
			icon: [23, 4],
			require: "Box of macarons",
			power: 3,
			price: 9999999999999999
		});
		Game.CookieUpgrade({
			name: "Violet macarons",
			desc: "It's like spraying perfume into your mouth!",
			icon: [24, 4],
			require: "Box of macarons",
			power: 3,
			price: 9999999999999999999
		});

		order = 40000;
		new Game.Upgrade("Magic shenanigans",
			'Cookie production <b>multiplied by 1,000</b>.<q>It\'s magic. I ain\'t gotta explain sh<div style="display:inline-block;background:url(img/money.png);width:16px;height:16px;position:relative;top:4px;left:0px;margin:0px -2px;"></div>t.</q>',
			7, [17, 5], {
				pool: "debug",
				groups: "bonus|globalCpsMod"
			}); //debug purposes only

		order = 24000;
		new Game.Upgrade("Bunny biscuit",
			"Triggers <b>Easter season</b> for the next 24 hours.<br>Triggering another season will cancel this one.<br>Cost scales with unbuffed CpS and increases with every season switch.<q>All the world will be your enemy<br>and when they catch you,<br>they will kill you...<br>but first they must catch you.</q>",
			Game.seasonTriggerBasePrice, [0, 12], {
				pool: "toggle",
				groups: "seasonSwitch",
				season: "easter",
				descFunc: function() {
					var easterEggs = Game.UpgradesByGroup.egg;
					return ('<div style="text-align:center;">' +
						Game.listTinyOwnedUpgrades(easterEggs) + "<br><br>You've purchased <b>" + Game.countUpgradesByGroup(easterEggs) + "/" +
						easterEggs.length + '</b> eggs.<div class="line"></div>' +
						Game.saySeasonSwitchUses() + '<div class="line"></div></div>' + this.desc);
				}
			});

		var eggPrice = 999999999999;
		var eggPrice2 = 99999999999999;
		new Game.Upgrade("Chicken egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>The egg. The egg came first. Get over it.</q>",
			eggPrice, [1, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Duck egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>Then he waddled away.</q>",
			eggPrice, [2, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Turkey egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>These hatch into strange, hand-shaped creatures.</q>",
			eggPrice, [3, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Quail egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>These eggs are positively tiny. I mean look at them. How does this happen? Whose idea was that?</q>",
			eggPrice, [4, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Robin egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>Holy azure-hued shelled embryos!</q>",
			eggPrice, [5, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Ostrich egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>One of the largest eggs in the world. More like ostrouch, am I right?<br>Guys?</q>",
			eggPrice, [6, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Cassowary egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>The cassowary is taller than you, possesses murderous claws and can easily outrun you.<br>You'd do well to be casso-wary of them.</q>",
			eggPrice, [7, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Salmon roe",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>Do the impossible, see the invisible.<br>Roe roe, fight the power?</q>",
			eggPrice, [8, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Frogspawn",
			'Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>I was going to make a pun about how these "toadally look like eyeballs", but froget it.</q>',
			eggPrice, [9, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Shark egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>HELLO IS THIS FOOD?<br>LET ME TELL YOU ABOUT FOOD.<br>WHY DO I KEEP EATING MY FRIENDS</q>",
			eggPrice, [10, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Turtle egg",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>Turtles, right? Hatch from shells. Grow into shells. What's up with that?<br>Now for my skit about airplane food.</q>",
			eggPrice, [11, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Ant larva",
			"Cookie production multiplier <b>+1%</b>.<br>Cost scales with how many eggs you own.<q>These are a delicacy in some countries, I swear. You will let these invade your digestive tract, and you will derive great pleasure from it.<br>And all will be well.</q>",
			eggPrice, [12, 12], {groups: "easter|commonEgg|plus"});
		new Game.Upgrade("Golden goose egg",
			"Golden cookies appear <b>5% more often</b>.<br>Cost scales with how many eggs you own.<q>The sole vestige of a tragic tale involving misguided investments.</q>",
			eggPrice2, [13, 12], {groups: "easter|rareEgg|goldCookie|goldSwitchMult|misc"});
		new Game.Upgrade("Faberge egg",
			"All buildings and upgrades are <b>1% cheaper</b>.<br>Cost scales with how many eggs you own.<q>This outrageous egg is definitely fab.</q>",
			eggPrice2, [14, 12], {groups: "easter|rareEgg|priceReduction|misc"});
		new Game.Upgrade("Wrinklerspawn",
			"Wrinklers explode into <b>5% more cookies</b>.<br>Cost scales with how many eggs you own.<q>Look at this little guy! It's gonna be a big boy someday! Yes it is!</q>",
			eggPrice2, [15, 12], {groups: "easter|rareEgg|grandmapocalypse|misc"});
		new Game.Upgrade("Cookie egg",
			"Clicking is <b>10% more powerful</b>.<br>Cost scales with how many eggs you own.<q>The shell appears to be chipped.<br>I wonder what's inside this one!</q>",
			eggPrice2, [16, 12], {groups: "easter|rareEgg|click|onlyClick"});
		new Game.Upgrade("Omelette",
			"Other eggs appear <b>10% more frequently</b>.<br>Cost scales with how many eggs you own.<q>Fromage not included.</q>",
			eggPrice2, [17, 12], {groups: "easter|rareEgg|misc"});
		new Game.Upgrade("Chocolate egg",
			"Contains <b>a lot of cookies</b>.<br>Cost scales with how many eggs you own.<q>Laid by the elusive cocoa bird. There's a surprise inside!</q>",
			eggPrice2, [18, 12], {groups: "easter|rareEgg|misc"});
		new Game.Upgrade("Century egg",
			"You continually gain <b>more CpS the longer you've played</b> in the current ascension.<br>Cost scales with how many eggs you own.<q>Actually not centuries-old. This one isn't a day over 86!</q>",
			eggPrice2, [19, 12], {
				groups: "easter|rareEgg|bonus",
				descFunc: function() {
					return ('<div style="text-align:center;">Current boost : <b>+' + Game.Beautify((Game.CenturyEggBoost - 1) * 100, 1) +
						'%</b></div><div class="line"></div>' + this.desc);
				}
			});
		new Game.Upgrade('"egg"',
			'<b>+9 CpS</b><q>hey it\'s "egg"</q>',
			eggPrice2, [20, 12], {groups: "easter|rareEgg|addCps:9"});

		Game.GetHowManyEggs = function(limit, includeUnlocked) {
			return Game.countUpgradesByGroup(Game.UpgradesByGroup.egg, limit, includeUnlocked);
		};

		order = 10032;
		Game.CookieUpgrade({
			name: "Caramel macarons",
			desc: "The saltiest, chewiest of them all.",
			icon: [25, 3],
			require: "Box of macarons",
			power: 3,
			price: 9999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Licorice macarons",
			desc: 'Also known as "blackarons".',
			icon: [25, 4],
			require: "Box of macarons",
			power: 3,
			price: 9999999999999999999999999
		});

		order = 525;
		Game.TieredUpgrade("Taller tellers",
			"Banks are <b>twice</b> as efficient.<q>Able to process a higher amount of transactions. Careful though, as taller tellers tell tall tales.</q>",
			"Bank", 1);
		Game.TieredUpgrade("Scissor-resistant credit cards",
			"Banks are <b>twice</b> as efficient.<q>For those truly valued customers.</q>",
			"Bank", 2);
		Game.TieredUpgrade("Acid-proof vaults",
			"Banks are <b>twice</b> as efficient.<q>You know what they say : better safe than sorry.</q>",
			"Bank", 3);
		Game.TieredUpgrade("Chocolate coins",
			"Banks are <b>twice</b> as efficient.<q>This revolutionary currency is much easier to melt from and into ingots - and tastes much better, for a change.</q>",
			"Bank", 4);
		Game.TieredUpgrade("Exponential interest rates",
			"Banks are <b>twice</b> as efficient.<q>Can't argue with mathematics! Now fork it over.</q>",
			"Bank", 5);
		Game.TieredUpgrade("Financial zen",
			"Banks are <b>twice</b> as efficient.<q>The ultimate grail of economic thought; the feng shui of big money, the stock market yoga - the Heimlich maneuver of dimes and nickels.</q>",
			"Bank", 6);

		order = 550;
		Game.TieredUpgrade("Golden idols",
			"Temples are <b>twice</b> as efficient.<q>Lure even greedier adventurers to retrieve your cookies. Now that's a real idol game!</q>",
			"Temple", 1);
		Game.TieredUpgrade("Sacrifices",
			"Temples are <b>twice</b> as efficient.<q>What's a life to a gigaton of cookies?</q>",
			"Temple", 2);
		Game.TieredUpgrade("Delicious blessing",
			"Temples are <b>twice</b> as efficient.<q>And lo, the Baker's almighty spoon came down and distributed holy gifts unto the believers - shimmering sugar, and chocolate dark as night, and all manner of wheats. And boy let me tell you, that party was mighty gnarly.</q>",
			"Temple", 3);
		Game.TieredUpgrade("Sun festival",
			"Temples are <b>twice</b> as efficient.<q>Free the primordial powers of your temples with these annual celebrations involving fire-breathers, traditional dancing, ritual beheadings and other merriments!</q>",
			"Temple", 4);
		Game.TieredUpgrade("Enlarged pantheon",
			"Temples are <b>twice</b> as efficient.<q>Enough spiritual inadequacy! More divinities than you'll ever need, or your money back! 100% guaranteed!</q>",
			"Temple", 5);
		Game.TieredUpgrade("Great Baker in the sky",
			"Temples are <b>twice</b> as efficient.<q>This is it. The ultimate deity has finally cast Their sublimely divine eye upon your operation; whether this is a good thing or possibly the end of days is something you should find out very soon.</q>",
			"Temple", 6);

		order = 575;
		Game.TieredUpgrade("Pointier hats",
			"Wizard towers are <b>twice</b> as efficient.<q>Tests have shown increased thaumic receptivity relative to the geometric proportions of wizardly conic implements.</q>",
			"Wizard tower", 1);
		Game.TieredUpgrade("Beardlier beards",
			"Wizard towers are <b>twice</b> as efficient.<q>Haven't you heard? The beard is the word.</q>",
			"Wizard tower", 2);
		Game.TieredUpgrade("Ancient grimoires",
			'Wizard towers are <b>twice</b> as efficient.<q>Contain interesting spells such as "Turn Water To Drool", "Grow Eyebrows On Furniture" and "Summon Politician".</q>',
			"Wizard tower", 3);
		Game.TieredUpgrade("Kitchen curses",
			"Wizard towers are <b>twice</b> as efficient.<q>Exotic magic involved in all things pastry-related. Hexcellent!</q>",
			"Wizard tower", 4);
		Game.TieredUpgrade("School of sorcery",
			"Wizard towers are <b>twice</b> as efficient.<q>This cookie-funded academy of witchcraft is home to the 4 prestigious houses of magic : the Jocks, the Nerds, the Preps, and the Deathmunchers.</q>",
			"Wizard tower", 5);
		Game.TieredUpgrade("Dark formulas",
			"Wizard towers are <b>twice</b> as efficient.<q>Eldritch forces are at work behind these spells - you get the feeling you really shouldn't be messing with those. But I mean, free cookies, right?</q>",
			"Wizard tower", 6);

		order = 250;
		Game.GrandmaSynergy("Banker grandmas", "A nice banker to cash in more cookies.", "Bank");
		Game.GrandmaSynergy("Priestess grandmas", "A nice priestess to praise the one true Baker in the sky.", "Temple");
		Game.GrandmaSynergy("Witch grandmas", "A nice witch to cast a zip, and a zoop, and poof! Cookies.", "Wizard tower");

		order = 0;
		new Game.Upgrade("Tin of british tea biscuits",
			"Contains an assortment of fancy biscuits.<q>Every time is tea time.</q>",
			25, [21, 8], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Box of macarons",
			"Contains an assortment of macarons.<q>Multicolored delicacies filled with various kinds of jam.<br>Not to be confused with macaroons, macaroni, macarena or any of that nonsense.</q>",
			25, [20, 8], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Box of brand biscuits",
			"Contains an assortment of popular biscuits.<q>They're brand new!</q>",
			25, [20, 9], {
				pool: "prestige",
				groups: "misc"
			});

		order = 10020;
		Game.CookieUpgrade({
			name: "Pure black chocolate cookies",
			desc: 'Dipped in a lab-made substance darker than the darkest cocoa (dubbed "chocoalate").',
			icon: [26, 3],
			power: 4,
			price: 9999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Pure white chocolate cookies",
			desc: "Elaborated on the nano-scale, the coating on this biscuit is able to refract light even in a pitch-black environment.",
			icon: [26, 4],
			power: 4,
			price: 9999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Ladyfingers",
			desc: "Cleaned and sanitized so well you'd swear they're actual biscuits.",
			icon: [27, 3],
			power: 3,
			price: 99999999999999999
		});
		Game.CookieUpgrade({
			name: "Tuiles",
			desc: "These never go out of tile.",
			icon: [27, 4],
			power: 3,
			price: 99999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Chocolate-stuffed biscuits",
			desc: "A princely snack!<br>The holes are so the chocolate stuffing can breathe.",
			icon: [28, 3],
			power: 3,
			price: 999999999999999999
		});
		Game.CookieUpgrade({
			name: "Checker cookies",
			desc: "A square cookie? This solves so many storage and packaging problems! You're a genius!",
			icon: [28, 4],
			power: 3,
			price: 999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Butter cookies",
			desc: "These melt right off your mouth and into your heart. (Let's face it, they're rather fattening.)",
			icon: [29, 3],
			power: 3,
			price: 9999999999999999999
		});
		Game.CookieUpgrade({
			name: "Cream cookies",
			desc: "It's like two chocolate chip cookies! But brought together with the magic of cream! It's fiendishly perfect!",
			icon: [29, 4],
			power: 3,
			price: 9999999999999999999 * 5
		});

		order = 0;
		desc = "Placing an upgrade in this slot will make its effects <b>permanent</b> across all playthroughs.<br><b>Click to activate.</b>";
		new Game.Upgrade("Permanent upgrade slot I",
			desc, 100, [0, 10], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Permanent upgrade slot II",
			desc, 2000, [1, 10], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Permanent upgrade slot III",
			desc, 30000, [2, 10], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Permanent upgrade slot IV",
			desc, 400000, [3, 10], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Permanent upgrade slot V",
			desc, 5000000, [4, 10], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Starspawn",
			"Eggs drop <b>10%</b> more often.<br>Golden cookies appear <b>2%</b> more often during Easter.",
			111111, [0, 12], {
				pool: "prestige",
				groups: "goldCookie|misc"
			});
		new Game.Upgrade("Starsnow",
			"Christmas cookies drop <b>5%</b> more often.<br>Reindeer appear <b>5%</b> more often.",
			111111, [12, 9], {
				pool: "prestige",
				groups: "christmas|misc"
			});
		new Game.Upgrade("Starterror",
			"Spooky cookies drop <b>10%</b> more often.<br>Golden cookies appear <b>2%</b> more often during Halloween.",
			111111, [13, 8], {
				pool: "prestige",
				groups: "goldCookie|misc"
			});
		new Game.Upgrade("Starlove",
			"Heart cookies are <b>50%</b> more powerful.<br>Golden cookies appear <b>2%</b> more often during Valentines.",
			111111, [20, 3], {
				pool: "prestige",
				groups: "goldCookie|misc"
			});
		new Game.Upgrade("Startrade",
			"Golden cookies appear <b>5%</b> more often during Business day.",
			111111, [17, 6], {
				pool: "prestige",
				groups: "goldCookie|misc"
			});

		var angelPriceFactor = 7;
		desc = function(percent, total) {
			return "You gain another <b>+" + percent + "%</b> of your regular CpS while the game is closed, for a total of <b>" + total + "%</b>.";
		};
		new Game.Upgrade("Angels",
			desc(10, 15) +
			"<q>Lowest-ranking at the first sphere of pastry heaven, angels are tasked with delivering new recipes to the mortals they deem worthy.</q>",
			Math.pow(angelPriceFactor, 1), [0, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Archangels",
			desc(10, 25) +
			"<q>Members of the first sphere of pastry heaven, archangels are responsible for the smooth functioning of the world's largest bakeries.</q>",
			Math.pow(angelPriceFactor, 2), [1, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Virtues",
			desc(10, 35) +
			"<q>Found at the second sphere of pastry heaven, virtues make use of their heavenly strength to push and drag the stars of the cosmos.</q>",
			Math.pow(angelPriceFactor, 3), [2, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Dominions",
			desc(10, 45) +
			"<q>Ruling over the second sphere of pastry heaven, dominions hold a managerial position and are in charge of accounting and regulating schedules.</q>",
			Math.pow(angelPriceFactor, 4), [3, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Cherubim",
			desc(10, 55) + "<q>Sieging at the first sphere of pastry heaven, the four-faced cherubim serve as heavenly bouncers and bodyguards.</q>",
			Math.pow(angelPriceFactor, 5), [4, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Seraphim",
			desc(10, 65) +
			"<q>Leading the first sphere of pastry heaven, seraphim possess ultimate knowledge of everything pertaining to baking.</q>",
			Math.pow(angelPriceFactor, 6), [5, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("God",
			desc(10, 75) + "<q>Like Santa, but less fun.</q>",
			Math.pow(angelPriceFactor, 7), [6, 11], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Twin Gates of Transcendence",
			"You now <b>keep making cookies while the game is closed</b>, at the rate of <b>5%</b> of your regular CpS and up to <b>1 hour</b> after the game is closed.<br>(Beyond 1 hour, this is reduced by a further 90% - your rate goes down to <b>0.5%</b> of your CpS.)<q>This is one occasion you're always underdressed for. Don't worry, just rush in past the bouncer and pretend you know people.</q>",
			1, [15, 11], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Heavenly luck",
			"Golden cookies appear <b>5%</b> more often.<q>Someone up there likes you.</q>",
			77, [22, 6], {
				pool: "prestige",
				groups: "goldCookie|goldSwitchMult"
			});
		new Game.Upgrade("Lasting fortune",
			"Golden cookies effects last <b>10%</b> longer.<q>This isn't your average everyday luck. This is... advanced luck.</q>",
			777, [23, 6], {
				pool: "prestige",
				groups: "goldCookie|goldSwitchMult"
			});
		new Game.Upgrade("Decisive fate",
			"Golden cookies stay <b>5%</b> longer.<q>Life just got a bit more intense.</q>",
			7777, [10, 14], {
				pool: "prestige",
				groups: "goldCookie|goldSwitchMult"
			});

		new Game.Upgrade("Divine discount",
			"Buildings are <b>1% cheaper</b>.<q>Someone special deserves a special price.</q>",
			99999, [21, 7], {
				pool: "prestige",
				groups: "priceReduction|misc"
			});
		new Game.Upgrade("Divine sales",
			"Upgrades are <b>1% cheaper</b>.<q>Everything must go!</q>",
			99999, [18, 7], {
				pool: "prestige",
				groups: "priceReduction|misc"
			});
		new Game.Upgrade("Divine bakeries",
			"Cookie upgrades are <b>5 times cheaper</b>.<q>They sure know what they're doing.</q>",
			399999, [17, 7], {
				pool: "prestige",
				groups: "priceReduction|misc"
			});

		new Game.Upgrade("Starter kit",
			"You start with <b>10 cursors</b>.<q>This can come in handy.</q>",
			50, [0, 14], {
				pool: "prestige",
				groups: "cursor|priceReduction|misc",
				buyFunc: function() {
					Game.Objects["Cursor"].free = this.bought ? 10 : 0;
					Game.Objects["Cursor"].priceCache = {};
				}
			});
		new Game.Upgrade("Starter kitchen",
			"You start with <b>5 grandmas</b>.<q>Where did these come from?</q>",
			5000, [1, 14], {
				pool: "prestige",
				groups: "grandma|priceReduction|misc",
				buyFunc: function() {
					Game.Objects["Grandma"].free = this.bought ? 5 : 0;
					Game.Objects["Grandma"].priceCache = {};
				}
			});
		new Game.Upgrade("Halo gloves",
			"Clicks are <b>10% more powerful</b>.<q>Smite that cookie.</q>",
			55555, [22, 7], {
				pool: "prestige",
				groups: "click|onlyClick"
			});

		new Game.Upgrade("Kitten angels",
			"You gain <b>more CpS</b> the more milk you have.<q>All cats go to heaven.</q>",
			9000, [23, 7], {
				pool: "prestige",
				groups: "bonus|kitten"
			});

		new Game.Upgrade("Unholy bait",
			"Wrinklers appear <b>5 times</b> as fast.<q>No wrinkler can resist the scent of worm biscuits.</q>",
			44444, [15, 12], {
				pool: "prestige",
				groups: "grandmapocalypse|misc"
			});
		new Game.Upgrade("Sacrilegious corruption",
			"Wrinklers regurgitate <b>5%</b> more cookies.<q>Unique in the animal kingdom, the wrinkler digestive tract is able to withstand an incredible degree of dilation - provided you prod them appropriately.</q>",
			444444, [19, 8], {
				pool: "prestige",
				groups: "grandmapocalypse|misc"
			});

		order = 200;
		Game.TieredUpgrade("Xtreme walkers",
			'Grandmas are <b>twice</b> as efficient.<q>Complete with flame decals and a little horn that goes "toot".</q>',
			"Grandma", 7);
		order = 300;
		Game.TieredUpgrade("Fudge fungus",
			"Farms are <b>twice</b> as efficient.<q>A sugary parasite whose tendrils help cookie growth.<br>Please do not breathe in the spores. In case of spore ingestion, seek medical help within the next 36 seconds.</q>",
			"Farm", 7);
		order = 400;
		Game.TieredUpgrade("Planetsplitters",
			"Mines are <b>twice</b> as efficient.<q>These new state-of-the-art excavators have been tested on Merula, Globort and Flwanza VI, among other distant planets which have been curiously quiet lately.</q>",
			"Mine", 7);
		order = 500;
		Game.TieredUpgrade("Cyborg workforce",
			"Factories are <b>twice</b> as efficient.<q>Semi-synthetic organisms don't slack off, don't unionize, and have 20% shorter lunch breaks, making them ideal labor fodder.</q>",
			"Factory", 7);
		order = 525;
		Game.TieredUpgrade("Way of the wallet",
			"Banks are <b>twice</b> as efficient.<q>This new monetary school of thought is all the rage on the banking scene; follow its precepts and you may just profit from it.</q>",
			"Bank", 7);
		order = 550;
		Game.TieredUpgrade("Creation myth",
			"Temples are <b>twice</b> as efficient.<q>Stories have been circulating about the origins of the very first cookie that was ever baked; tales of how it all began, in the Dough beyond time and the Ovens of destiny.</q>",
			"Temple", 7);
		order = 575;
		Game.TieredUpgrade("Cookiemancy",
			"Wizard towers are <b>twice</b> as efficient.<q>There it is; the perfected school of baking magic. From summoning chips to hexing nuts, there is not a single part of cookie-making that hasn't been improved tenfold by magic tricks.</q>",
			"Wizard tower", 7);
		order = 600;
		Game.TieredUpgrade("Dyson sphere",
			"Shipments are <b>twice</b> as efficient.<q>You've found a way to apply your knowledge of cosmic technology to slightly more local endeavors; this gigantic sphere of meta-materials, wrapping the solar system, is sure to kick your baking abilities up a notch.</q>",
			"Shipment", 7);
		order = 700;
		Game.TieredUpgrade("Theory of atomic fluidity",
			"Alchemy labs are <b>twice</b> as efficient.<q>Pushing alchemy to its most extreme limits, you find that everything is transmutable into anything else - lead to gold, mercury to water; more importantly, you realize that anything can -and should- be converted to cookies.</q>",
			"Alchemy lab", 7);
		order = 800;
		Game.TieredUpgrade("End of times back-up plan",
			"Portals are <b>twice</b> as efficient.<q>Just in case, alright?</q>",
			"Portal", 7);
		order = 900;
		Game.TieredUpgrade("Great loop hypothesis",
			"Time machines are <b>twice</b> as efficient.<q>What if our universe is just one instance of an infinite cycle? What if, before and after it, stretched infinite amounts of the same universe, themselves containing infinite amounts of cookies?</q>",
			"Time machine", 7);
		order = 1000;
		Game.TieredUpgrade("The Pulse",
			"Antimatter condensers are <b>twice</b> as efficient.<q>You've tapped into the very pulse of the cosmos, a timeless rhythm along which every material and antimaterial thing beats in unison. This, somehow, means more cookies.</q>",
			"Antimatter condenser", 7);
		order = 1100;
		Game.TieredUpgrade("Lux sanctorum",
			"Prisms are <b>twice</b> as efficient.<q>Your prism attendants have become increasingly mesmerized with something in the light - or maybe something beyond it; beyond us all, perhaps?</q>",
			"Prism", 7);

		order = 200;
		Game.TieredUpgrade("The Unbridling",
			"Grandmas are <b>twice</b> as efficient.<q>It might be a classic tale of bad parenting, but let's see where grandma is going with this.</q>",
			"Grandma", 8);
		order = 300;
		Game.TieredUpgrade("Wheat triffids",
			"Farms are <b>twice</b> as efficient.<q>Taking care of crops is so much easier when your plants can just walk about and help around the farm.<br>Do not pet. Do not feed. Do not attempt to converse with.</q>",
			"Farm", 8);
		order = 400;
		Game.TieredUpgrade("Canola oil wells",
			"Mines are <b>twice</b> as efficient.<q>A previously untapped resource, canola oil permeates the underground olifers which grant it its particular taste and lucrative properties.</q>",
			"Mine", 8);
		order = 500;
		Game.TieredUpgrade("78-hour days",
			"Factories are <b>twice</b> as efficient.<q>Why didn't we think of this earlier?</q>",
			"Factory", 8);
		order = 525;
		Game.TieredUpgrade("The stuff rationale",
			"Banks are <b>twice</b> as efficient.<q>If not now, when? If not it, what? If not things... stuff?</q>",
			"Bank", 8);
		order = 550;
		Game.TieredUpgrade("Theocracy",
			"Temples are <b>twice</b> as efficient.<q>You've turned your cookie empire into a perfect theocracy, gathering the adoration of zillions of followers from every corner of the universe.<br>Don't let it go to your head.</q>",
			"Temple", 8);
		order = 575;
		Game.TieredUpgrade("Rabbit trick",
			"Wizard towers are <b>twice</b> as efficient.<q>Using nothing more than a fancy top hat, your wizards have found a way to simultaneously curb rabbit population and produce heaps of extra cookies for basically free!<br>Resulting cookies may or may not be fit for vegans.</q>",
			"Wizard tower", 8);
		order = 600;
		Game.TieredUpgrade("The final frontier",
			"Shipments are <b>twice</b> as efficient.<q>It's been a long road, getting from there to here. It's all worth it though - the sights are lovely and the oil prices slightly more reasonable.</q>",
			"Shipment", 8);
		order = 700;
		Game.TieredUpgrade("Beige goo",
			"Alchemy labs are <b>twice</b> as efficient.<q>Well now you've done it. Good job. Very nice. That's 3 galaxies you've just converted into cookies. Good thing you can hop from universe to universe.</q>",
			"Alchemy lab", 8);
		order = 800;
		Game.TieredUpgrade("Maddening chants",
			'Portals are <b>twice</b> as efficient.<q>A popular verse goes like so : "jau\'hn madden jau\'hn madden aeiouaeiouaeiou brbrbrbrbrbrbr"</q>',
			"Portal", 8);
		order = 900;
		Game.TieredUpgrade("Cookietopian moments of maybe",
			"Time machines are <b>twice</b> as efficient.<q>Reminiscing how things could have been, should have been, will have been.</q>",
			"Time machine", 8);
		order = 1000;
		Game.TieredUpgrade("Some other super-tiny fundamental particle? Probably?",
			"Antimatter condensers are <b>twice</b> as efficient.<q>When even the universe is running out of ideas, that's when you know you're nearing the end.</q>",
			"Antimatter condenser", 8);
		order = 1100;
		Game.TieredUpgrade("Reverse shadows",
			"Prisms are <b>twice</b> as efficient.<q>Oh man, this is really messing with your eyes.</q>",
			"Prism", 8);

		order = 20000;
		new Game.Upgrade("Kitten accountants",
			"You gain <b>more CpS</b> the more milk you have.<q>business going great, sir</q>",
			900000000000000000000000, Game.GetIcon("Kitten", 6), {
				tier: 6,
				groups: "bonus|kitten:5"
			});
		new Game.Upgrade("Kitten specialists",
			"You gain <b>more CpS</b> the more milk you have.<q>optimeowzing your workflow like whoah, sir</q>",
			900000000000000000000000000, Game.GetIcon("Kitten", 7), {
				tier: 7,
				groups: "bonus|kitten:6"
			});
		new Game.Upgrade("Kitten experts",
			"You gain <b>more CpS</b> the more milk you have.<q>10 years expurrrtise in the cookie business, sir</q>",
			900000000000000000000000000000, Game.GetIcon("Kitten", 8), {
				tier: 8,
				groups: "bonus|kitten:7"
			});

		new Game.Upgrade("How to bake your dragon",
			'Allows you to purchase a <b>crumbly egg</b> once you have earned 1 million cookies.<q>A tome full of helpful tips such as "oh god, stay away from it", "why did we buy this thing, it\'s not even house-broken" and "groom twice a week in the direction of the scales".</q>',
			9, [22, 12], {
				pool: "prestige",
				groups: "misc"
			});

		order = 25100;
		new Game.Upgrade("A crumbly egg",
			"Unlocks the <b>cookie dragon egg</b>.<q>Thank you for adopting this robust, fun-loving cookie dragon! It will bring you years of joy and entertainment.<br>Keep in a dry and cool place, and away from other house pets. Subscription to home insurance is strongly advised.</q>",
			25, [21, 12], {
				groups: "misc",
				require: getCookiesBakedRequireFunc({
					price: 1000000,
					require: "How to bake your dragon"
				})
			});
		Game.last.createCrate("#familiarIcons");
		new Game.Upgrade("Chimera",
			"Synergy upgrades are <b>2% cheaper</b>.<br>You gain another <b>+5%</b> of your regular CpS while the game is closed.<br>You retain optimal cookie production while the game is closed for <b>2 more days</b>.<q>More than the sum of its parts.</q>",
			Math.pow(angelPriceFactor, 9), [24, 7], {
				pool: "prestige",
				groups: "priceReduction|misc"
			});
		new Game.Upgrade("Tin of butter cookies",
			"Contains an assortment of rich butter cookies.<q>Five varieties of danish cookies.<br>Complete with little paper cups.</q>",
			25, [21, 9], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Golden switch",
			"Unlocks the <b>golden switch</b>, which passively boosts your CpS by 50% but disables golden cookies.<q>Less clicking, more idling.</q>",
			999, [21, 10], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Classic dairy selection",
			"Unlocks the <b>milk selector</b>, letting you pick which milk is displayed under your cookie.<br>Comes with a variety of basic flavors.<q>Don't have a cow, man.</q>",
			9, [1, 8], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Fanciful dairy selection",
			"Contains more exotic flavors for your milk selector.<q>Strong bones for the skeleton army.</q>",
			1000000, [9, 7], {
				pool: "prestige",
				groups: "misc"
			});

		order = 10300;
		Game.CookieUpgrade({
			name: "Dragon cookie",
			desc: "Imbued with the vigor and vitality of a full-grown cookie dragon, this mystical cookie will embolden your empire for the generations to come.",
			icon: [10, 25],
			power: 5,
			price: 9999999999999999 * 7,
			require: function() { return Game.HasUpgrade("A crumbly egg") && Game.dragonLevel > 19; }
		});

		priceFunc = function() { return Game.cookiesPs * 60 * 60; };
		var descFunc = function() {
			if (Game.HasUpgrade("Residual luck")) {
				var bonus = Game.countUpgradesByGroup("goldSwitchMult");
				return ('<div style="text-align:center;">' + Game.listTinyOwnedUpgrades(Game.UpgradesByGroup.goldSwitchMult) +
					"<br><br>The effective boost is <b>+" +
					Game.Beautify(Math.round(50 + bonus * 10)) + "%</b><br>thanks to residual luck<br>and your <b>" + bonus +
					"</b> golden cookie upgrade" + (bonus == 1 ? "" : "s") + '.</div><div class="line"></div>' + this.desc);
			}
			return this.desc;
		};
		requireFunc = function() { return Game.HasUpgrade("Golden switch"); };
		order = 40000;
		new Game.Upgrade("Golden switch [off]",
			"Turning this on will give you a passive <b>+50% CpS</b>, but prevents golden cookies from spawning.<br>Cost is equal to 1 hour of production.",
			1000000, [20, 10], {
				pool: "toggle",
				groups: "bonus|globalCpsMod",
				priceFunc: priceFunc,
				descFunc: descFunc,
				require: requireFunc,
				isParent: true
			});
		var gSwitch = Game.last;

		new Game.Upgrade("Golden switch [on]",
			"The switch is currently giving you a passive <b>+50% CpS</b>; it also prevents golden cookies from spawning.<br>Turning it off will revert those effects.<br>Cost is equal to 1 hour of production.",
			1000000, [21, 10], {
				pool: "toggle",
				groups: "bonus|globalCpsMod",
				priceFunc: priceFunc,
				descFunc: descFunc,
				require: requireFunc,
				toggleInto: gSwitch,
				isChild: true,
				setCpsNegative: true
			});
		gSwitch.toggleInto = Game.last;

		order = 50000;
		new Game.Upgrade("Milk selector",
			"Lets you pick what flavor of milk to display.",
			0, [1, 8], {
				pool: "toggle",
				noBuy: true,
				groups: "misc"
			});

		order = 10300;
		Game.CookieUpgrade({
			name: "Milk chocolate butter biscuit",
			desc: "Rewarded for owning 100 of everything.<br>It bears the engraving of a fine entrepreneur.",
			icon: [27, 8],
			power: 10,
			price: 999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(100)
		});
		Game.CookieUpgrade({
			name: "Dark chocolate butter biscuit",
			desc: "Rewarded for owning 150 of everything.<br>It is adorned with the image of an experienced cookie tycoon.",
			icon: [27, 9],
			power: 10,
			price: 999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(150)
		});
		Game.CookieUpgrade({
			name: "White chocolate butter biscuit",
			desc: "Rewarded for owning 200 of everything.<br>The chocolate is chiseled to depict a masterful pastry magnate.",
			icon: [28, 9],
			power: 10,
			price: 999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(200)
		});
		Game.CookieUpgrade({
			name: "Ruby chocolate butter biscuit",
			desc: "Rewarded for owning 250 of everything.<br>Covered in a rare red chocolate, this biscuit is etched to represent the face of a cookie industrialist gone mad with power.",
			icon: [28, 8],
			power: 10,
			price: 999999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(250)
		});

		order = 10020;
		Game.CookieUpgrade({
			name: "Gingersnaps",
			desc: "Cookies with a soul. Probably.",
			icon: [29, 10],
			power: 4,
			price: 99999999999999999999
		});
		Game.CookieUpgrade({
			name: "Cinnamon cookies",
			desc: "The secret is in the patented swirly glazing.",
			icon: [23, 8],
			power: 4,
			price: 99999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Vanity cookies",
			desc: "One tiny candied fruit sits atop this decadent cookie.",
			icon: [22, 8],
			power: 4,
			price: 999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Cigars",
			desc: "Close, but no match for those extravagant cookie straws they serve in coffee shops these days.",
			icon: [25, 8],
			power: 4,
			price: 999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Pinwheel cookies",
			desc: "Bringing you the dizzying combination of brown flavor and beige taste!",
			icon: [22, 10],
			power: 4,
			price: 9999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Fudge squares",
			desc: "Not exactly cookies, but you won't care once you've tasted one of these.<br>They're so good, it's fudged-up!",
			icon: [24, 8],
			power: 4,
			price: 9999999999999999999999 * 5
		});

		order = 10030;
		Game.CookieUpgrade({
			name: "Digits",
			desc: "Three flavors, zero phalanges.",
			icon: [26, 8],
			require: "Box of brand biscuits",
			power: 2,
			price: 999999999999999 * 5
		});

		order = 10030;
		Game.CookieUpgrade({
			name: "Butter horseshoes",
			desc: "It would behoove you to not overindulge in these.",
			icon: [22, 9],
			require: "Tin of butter cookies",
			power: 4,
			price: 99999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Butter pucks",
			desc: "Lord, what fools these mortals be!<br>(This is kind of a hokey reference.)",
			icon: [23, 9],
			require: "Tin of butter cookies",
			power: 4,
			price: 99999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Butter knots",
			desc: "Look, you can call these pretzels if you want, but you'd just be fooling yourself, wouldn't you?",
			icon: [24, 9],
			require: "Tin of butter cookies",
			power: 4,
			price: 999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Butter slabs",
			desc: "Nothing butter than a slab to the face.",
			icon: [25, 9],
			require: "Tin of butter cookies",
			power: 4,
			price: 999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Butter swirls",
			desc: "These are equal parts sugar, butter, and warm fuzzy feelings - all of which cause millions of deaths everyday.",
			icon: [26, 9],
			require: "Tin of butter cookies",
			power: 4,
			price: 9999999999999999999999999
		});

		order = 10020;
		Game.CookieUpgrade({
			name: "Shortbread biscuits",
			desc: "These rich butter cookies are neither short, nor bread. What a country!",
			icon: [23, 10],
			power: 4,
			price: 99999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Millionaires' shortbreads",
			desc: "Three thought-provoking layers of creamy chocolate, hard-working caramel and crumbly biscuit in a poignant commentary of class struggle.",
			icon: [24, 10],
			power: 4,
			price: 99999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Caramel cookies",
			desc: "The polymerized carbohydrates adorning these cookies are sure to stick to your teeth for quite a while.",
			icon: [25, 10],
			power: 4,
			price: 999999999999999999999999
		});

		desc = function(totalHours) {
			var hours = totalHours % 24;
			var days = Math.floor(totalHours / 24);
			var str = hours + (hours === 1 ? " hour" : " hours");
			if (days > 0) { str = days + (days === 1 ? " day" : " days") + " and " + str; }
			return ("You retain optimal cookie production while the game is closed for twice as long, for a total of <b>" + str + "</b>.");
		};
		new Game.Upgrade("Belphegor",
			desc(2) + "<q>A demon of shortcuts and laziness, Belphegor commands machines to do work in his stead.</q>",
			Math.pow(angelPriceFactor, 1), [7, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Mammon",
			desc(4) + "<q>The demonic embodiment of wealth, Mammon requests a tithe of blood and gold from all his worshippers.</q>",
			Math.pow(angelPriceFactor, 2), [8, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Abaddon",
			desc(8) + "<q>Master of overindulgence, Abaddon governs the wrinkler brood and inspires their insatiability.</q>",
			Math.pow(angelPriceFactor, 3), [9, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Satan",
			desc(16) + "<q>The counterpoint to everything righteous, this demon represents the nefarious influence of deceit and temptation.</q>",
			Math.pow(angelPriceFactor, 4), [10, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Asmodeus",
			desc(32) + "<q>This demon with three monstrous heads draws his power from the all-consuming desire for cookies and all things sweet.</q>",
			Math.pow(angelPriceFactor, 5), [11, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Beelzebub",
			desc(64) + "<q>The festering incarnation of blight and disease, Beelzebub rules over the vast armies of pastry inferno.</q>",
			Math.pow(angelPriceFactor, 6), [12, 11], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Lucifer",
			desc(128) + "<q>Also known as the Lightbringer, this infernal prince's tremendous ego caused him to be cast down from pastry heaven.</q>",
			Math.pow(angelPriceFactor, 7), [13, 11], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Golden cookie alert sound",
			"Unlocks the <b>golden cookie sound selector</b>, which lets you pick whether golden cookies emit a sound when appearing or not.<q>A sound decision.</q>",
			9999, [28, 6], {
				pool: "prestige",
				groups: "misc"
			});

		order = 49900;
		new Game.Upgrade("Golden cookie sound selector",
			"Lets you change the sound golden cookies make when they spawn.",
			0, [28, 6], {
				pool: "toggle",
				noBuy: true,
				groups: "misc"
			});

		new Game.Upgrade("Basic wallpaper assortment",
			"Unlocks the <b>background selector</b>, letting you select the game's background.<br>Comes with a variety of basic flavors.<q>Prioritizing aesthetics over crucial utilitarian upgrades? Color me impressed.</q>",
			99, [29, 5], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Legacy",
			'This is the first heavenly upgrade; it unlocks the <b>Heavenly chips</b> system.<div class="line"></div>Each time you ascend, the cookies you made in your past life are turned into <b>heavenly chips</b> and <b>prestige</b>.<div class="line"></div><b>Heavenly chips</b> can be spent on a variety of permanent transcendental upgrades.<div class="line"></div>Your <b>prestige level</b> also gives you a permanent <b>+1% CpS</b> per level.<q>We\'ve all been waiting for you.</q>',
			1, [21, 6], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Elder spice",
			"You can attract <b>2 more wrinklers</b>.<q>The cookie your cookie could smell like.</q>",
			444444, [19, 8], {
				pool: "prestige",
				groups: "grandmapocalypse|misc",
				buyFunc: function() {
					Game.maxWrinklers = this.bought ? 12 : 10;
					byId("numWrinklersIn").maxIn = Game.maxWrinklers;
					Game.setInput("#numWrinklersIn");
				}
			});

		new Game.Upgrade("Residual luck",
			"While the golden switch is on, you gain an additional <b>+10% CpS</b> per golden cookie upgrade owned.<q>Fortune comes in many flavors.</q>",
			99999, [27, 6], {
				pool: "prestige",
				groups: "goldCookie"
			});

		order = 150;
		new Game.Upgrade("Fantasteel mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>You could be clicking using your touchpad and we'd be none the wiser.</q>",
			5000000000000000000, [11, 17], {
				tier: 8,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Nevercrack mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>How much beefier can you make a mouse until it's considered a rat?</q>",
			500000000000000000000, [11, 18], {
				tier: 9,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Five-finger discount",
			"All upgrades are <b>1% cheaper per 100 cursors</b>.<q>Stick it to the man.</q>",
			555555, [28, 7], {
				pool: "prestige",
				groups: "priceReduction|misc"
			});

		order = 5000;
		Game.SynergyUpgrade("Future almanacs",
			"<q>Lets you predict optimal planting times. It's crazy what time travel can do!</q>",
			"Farm", "Time machine", "synergy1");
		Game.SynergyUpgrade("Rain prayer",
			"<q>A deeply spiritual ceremonial involving complicated dance moves and high-tech cloud-busting lasers.</q>",
			"Farm", "Temple", "synergy2");

		Game.SynergyUpgrade("Seismic magic",
			"<q>Surprise earthquakes are an old favorite of wizardly frat houses.</q>",
			"Mine", "Wizard tower", "synergy1");
		Game.SynergyUpgrade("Asteroid mining",
			"<q>As per the <span>19</span>74 United Cosmic Convention, comets, moons, and inhabited planetoids are no longer legally excavatable.<br>But hey, a space bribe goes a long way.</q>",
			"Mine", "Shipment", "synergy2");

		Game.SynergyUpgrade("Quantum electronics",
			"<q>Your machines won't even be sure if they're on or off!</q>",
			"Factory", "Antimatter condenser", "synergy1");
		Game.SynergyUpgrade("Temporal overclocking",
			"<q>Introduce more quickitude in your system for increased speedation of fastness.</q>",
			"Factory", "Time machine", "synergy2");

		Game.SynergyUpgrade("Contracts from beyond",
			"<q>Make sure to read the fine print!</q>",
			"Bank", "Portal", "synergy1");
		Game.SynergyUpgrade("Printing presses",
			"<q>Fake bills so real, they're almost worth the ink they're printed with.</q>",
			"Bank", "Factory", "synergy2");

		Game.SynergyUpgrade("Paganism",
			"<q>Some deities are better left unworshipped.</q>",
			"Temple", "Portal", "synergy1");
		Game.SynergyUpgrade("God particle",
			"<q>Turns out God is much tinier than we thought, I guess.</q>",
			"Temple", "Antimatter condenser", "synergy2");

		Game.SynergyUpgrade("Arcane knowledge",
			"<q>Some things were never meant to be known - only mildly speculated.</q>",
			"Wizard tower", "Alchemy lab", "synergy1");
		Game.SynergyUpgrade("Magical botany",
			'<q>Already known in some reactionary newspapers as "the wizard\'s GMOs".</q>',
			"Wizard tower", "Farm", "synergy2");

		Game.SynergyUpgrade("Fossil fuels",
			"<q>Somehow better than plutonium for powering rockets.<br>Extracted from the fuels of ancient, fossilized civilizations.</q>",
			"Shipment", "Mine", "synergy1");
		Game.SynergyUpgrade("Shipyards",
			"<q>Where carpentry, blind luck, and asbestos insulation unite to produce the most dazzling spaceships on the planet.</q>",
			"Shipment", "Factory", "synergy2");

		Game.SynergyUpgrade("Primordial ores",
			"<q>Only when refining the purest metals will you extract the sweetest sap of the earth.</q>",
			"Alchemy lab", "Mine", "synergy1");
		Game.SynergyUpgrade("Gold fund",
			"<q>If gold is the backbone of the economy, cookies, surely, are its hip joints.</q>",
			"Alchemy lab", "Bank", "synergy2");

		Game.SynergyUpgrade("Infernal crops",
			"<q>Sprinkle regularly with FIRE.</q>",
			"Portal", "Farm", "synergy1");
		Game.SynergyUpgrade("Abysmal glimmer",
			"<q>Someone, or something, is staring back at you.<br>Perhaps at all of us.</q>",
			"Portal", "Prism", "synergy2");

		Game.SynergyUpgrade("Relativistic parsec-skipping",
			"<q>People will tell you this isn't physically possible.<br>These are people you don't want on your ship.</q>",
			"Time machine", "Shipment", "synergy1");
		Game.SynergyUpgrade("Primeval glow",
			"<q>From unending times, an ancient light still shines, impossibly pure and fragile in its old age.</q>",
			"Time machine", "Prism", "synergy2");

		Game.SynergyUpgrade("Extra physics funding",
			"<q>Time to put your money where your particle colliders are.</q>",
			"Antimatter condenser", "Bank", "synergy1");
		Game.SynergyUpgrade("Chemical proficiency",
			"<q>Discover exciting new elements, such as Fleshmeltium, Inert Shampoo Byproduct #17 and Carbon++!</q>",
			"Antimatter condenser", "Alchemy lab", "synergy2");

		Game.SynergyUpgrade("Light magic",
			"<q>Actually not to be taken lightly! No, I'm serious. 178 people died last year. You don't mess around with magic.</q>",
			"Prism", "Wizard tower", "synergy1");
		Game.SynergyUpgrade("Mystical energies",
			"<q>Something beckons from within the light. It is warm, comforting, and apparently the cause for several kinds of exotic skin cancers.</q>",
			"Prism", "Temple", "synergy2");

		new Game.Upgrade("Synergies Vol. I",
			"Unlocks a new tier of upgrades that affect <b>2 buildings at the same time</b>.<br>Synergies appear once you have <b>15</b> of both buildings.<q>The many beats the few.</q>",
			222222, [10, 20], {
				pool: "prestige",
				groups: "synergy|misc"
			});
		new Game.Upgrade("Synergies Vol. II",
			"Unlocks a new tier of upgrades that affect <b>2 buildings at the same time</b>.<br>Synergies appear once you have <b>75</b> of both buildings.<q>The several beats the many.</q>",
			2222222, [10, 29], {
				pool: "prestige",
				groups: "synergy|misc"
			});

		new Game.Upgrade("Heavenly cookies",
			"Cookie production multiplier <b>+10% permanently</b>.<q>Baked with heavenly chips. An otherwordly flavor that transcends time and space.</q>",
			3, [25, 12], {
				pool: "prestige",
				power: 10,
				pseudoCookie: true
			});
		new Game.Upgrade("Wrinkly cookies",
			"Cookie production multiplier <b>+10% permanently</b>.<q>The result of regular cookies left to age out for countless eons in a place where time and space are meaningless.</q>",
			6666666, [26, 12], {
				pool: "prestige",
				power: 10,
				pseudoCookie: true
			});
		new Game.Upgrade("Distilled essence of redoubled luck",
			"Golden cookies (and all other things that spawn, such as reindeer) have <b>1% chance of being doubled</b>.<q>Tastes glittery. The empty phial makes for a great pencil holder.</q>",
			7777777, [27, 12], {
				pool: "prestige",
				groups: "goldCookie|misc"
			});

		order = 40000;
		new Game.Upgrade("Occult obstruction",
			"Cookie production <b>reduced to 0</b>.<q>If symptoms persist, consult a doctor.</q>",
			7, [15, 5], {
				pool: "debug",
				groups: "bonus|globalCpsMod"
			}); //debug purposes only
		new Game.Upgrade("Glucose-charged air",
			"Sugar lumps coalesce <b>a whole lot faster</b>.<q>Don't breathe too much or you'll get diabetes!</q>",
			7, [29, 16], {
				pool: "debug",
				groups: "misc"
			}); //debug purposes only

		order = 10300;
		Game.CookieUpgrade({
			name: "Lavender chocolate butter biscuit",
			desc: "Rewarded for owning 300 of everything.<br>This subtly-flavored biscuit represents the accomplishments of decades of top-secret research. The molded design on the chocolate resembles a well-known entrepreneur who gave their all to the ancient path of baking.",
			icon: [26, 10],
			power: 10,
			price: 999999999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(300)
		});

		order = 10030;
		Game.CookieUpgrade({
			name: "Lombardia cookies",
			desc: "These come from those farms with the really good memory.",
			icon: [23, 13],
			require: "Box of brand biscuits",
			power: 3,
			price: 999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Bastenaken cookies",
			desc: "French cookies made of delicious cinnamon and candy sugar. These do not contain Nuts!",
			icon: [24, 13],
			require: "Box of brand biscuits",
			power: 3,
			price: 999999999999999999999 * 5
		});

		order = 10020;
		Game.CookieUpgrade({
			name: "Pecan sandies",
			desc: "Stick a nut on a cookie and call it a day! Name your band after it! Whatever!",
			icon: [25, 13],
			power: 4,
			price: 999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Moravian spice cookies",
			desc: "Popular for being the world's moravianest cookies.",
			icon: [26, 13],
			power: 4,
			price: 9999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Anzac biscuits",
			desc: "Army biscuits from a bakery down under, containing no eggs but yes oats.",
			icon: [27, 13],
			power: 4,
			price: 9999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Buttercakes",
			desc: "Glistening with cholesterol, these cookies moistly straddle the line between the legal definition of a cookie and just a straight-up stick of butter.",
			icon: [29, 13],
			power: 4,
			price: 99999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Ice cream sandwiches",
			desc: 'In an alternate universe, "ice cream sandwich" designates an ice cream cone filled with bacon, lettuce, and tomatoes. Maybe some sprinkles too.',
			icon: [28, 13],
			power: 4,
			price: 99999999999999999999999999 * 5
		});

		new Game.Upgrade("Stevia Caelestis",
			"Sugar lumps ripen <b>an hour sooner</b>.<q>A plant of supernatural sweetness grown by angels in heavenly gardens.</q>",
			100000000, [25, 15], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Diabetica Daemonicus",
			"Sugar lumps mature <b>an hour sooner</b>.<q>A malevolent, if delicious herb that is said to grow on the cliffs of the darkest abyss of the underworld.</q>",
			300000000, [26, 15], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Sucralosia Inutilis",
			"Bifurcated sugar lumps appear <b>5% more often</b> and are <b>5% more likely</b> to drop 2 lumps.<q>A rare berry of uninteresting flavor that is as elusive as its uses are limited; only sought-after by the most avid collectors with too much wealth on their hands.</q>",
			1000000000, [27, 15], {
				pool: "prestige",
				groups: "misc"
			});

		//note : these showIf functions stop working beyond 10 quadrillion prestige level, due to loss in precision; the solution, of course, is to
		// make sure 10 quadrillion is not an attainable prestige level
		new Game.Upgrade("Lucky digit",
			"<b>+1%</b> prestige level effect on CpS.<br><b>+1%</b> golden cookie effect duration.<br><b>+1%</b> golden cookie lifespan.<q>This upgrade is a bit shy and only appears when your prestige level ends in 7.</q>",
			777, [24, 15], {
				pool: "prestige",
				groups: "bonus|heaven|goldCookie|goldSwitchMult"
			});
		new Game.Upgrade("Lucky number",
			"<b>+1%</b> prestige level effect on CpS.<br><b>+1%</b> golden cookie effect duration.<br><b>+1%</b> golden cookie lifespan.<q>This upgrade is a reclusive hermit and only appears when your prestige level ends in 777.</q>",
			77777, [24, 15], {
				pool: "prestige",
				groups: "bonus|heaven|goldCookie|goldSwitchMult"
			});
		new Game.Upgrade("Lucky payout",
			"<b>+1%</b> prestige level effect on CpS.<br><b>+1%</b> golden cookie effect duration.<br><b>+1%</b> golden cookie lifespan.<q>This upgrade took an oath of complete seclusion from the rest of the world and only appears when your prestige level ends in 777777.</q>",
			77777777, [24, 15], {
				pool: "prestige",
				groups: "bonus|heaven|goldCookie|goldSwitchMult"
			});

		order = 50000;
		new Game.Upgrade("Background selector",
			"Lets you pick which wallpaper to display.",
			0, [29, 5], {
				pool: "toggle",
				noBuy: true,
				groups: "misc"
			});

		order = 255;
		Game.GrandmaSynergy("Lucky grandmas", "A fortunate grandma that always seems to find more cookies.", "Chancemaker");

		order = 1200;
		Game.TieredUpgrade("Your lucky cookie",
			"Chancemakers are <b>twice</b> as efficient.<q>This is the first cookie you've ever baked. It holds a deep sentimental value and, after all this time, an interesting smell.</q>",
			"Chancemaker", 1);
		Game.TieredUpgrade('"All Bets Are Off" magic coin',
			"Chancemakers are <b>twice</b> as efficient.<q>A coin that always lands on the other side when flipped. Not heads, not tails, not the edge. The <i>other side</i>.</q>",
			"Chancemaker", 2);
		Game.TieredUpgrade("Winning lottery ticket",
			"Chancemakers are <b>twice</b> as efficient.<q>What lottery? THE lottery, that's what lottery! Only lottery that matters!</q>",
			"Chancemaker", 3);
		Game.TieredUpgrade("Four-leaf clover field",
			"Chancemakers are <b>twice</b> as efficient.<q>No giant monsters here, just a whole lot of lucky grass.</q>",
			"Chancemaker", 4);
		Game.TieredUpgrade("A recipe book about books",
			"Chancemakers are <b>twice</b> as efficient.<q>Tip the scales in your favor with 28 creative new ways to cook the books.</q>",
			"Chancemaker", 5);
		Game.TieredUpgrade("Leprechaun village",
			"Chancemakers are <b>twice</b> as efficient.<q>You've finally become accepted among the local leprechauns, who lend you their mythical luck as a sign of friendship (as well as some rather foul-tasting tea).</q>",
			"Chancemaker", 6);
		Game.TieredUpgrade("Improbability drive",
			"Chancemakers are <b>twice</b> as efficient.<q>A strange engine that turns statistics on their head. Recommended by the Grandmother's Guide to the Bakery.</q>",
			"Chancemaker", 7);
		Game.TieredUpgrade("Antisuperstistronics",
			"Chancemakers are <b>twice</b> as efficient.<q>An exciting new field of research that makes unlucky things lucky. No mirror unbroken, no ladder unwalked under!</q>",
			"Chancemaker", 8);

		order = 5000;
		Game.SynergyUpgrade("Gemmed talismans",
			"<q>Good-luck charms covered in ancient and excruciatingly rare crystals. A must have for job interviews!</q>",
			"Chancemaker", "Mine", "synergy1");

		order = 20000;
		new Game.Upgrade("Kitten consultants",
			"You gain <b>more CpS</b> the more milk you have.<q>glad to be overpaid to work with you, sir</q>",
			900000000000000000000000000000000, Game.GetIcon("Kitten", 9), {
				tier: 9,
				groups: "bonus|kitten:8"
			});

		order = 99999;
		var years = Math.floor((Game.startDate - new Date(2013, 7, 8)) / (1000 * 60 * 60 * 24 * 365));
		//only updates on page load
		//may behave strangely on leap years
		Game.CookieUpgrade({
			name: "Birthday cookie",
			forceDesc: "Cookie production multiplier <b>+1%</b> for every year Cookie Clicker has existed (currently : <b>+" + Game.Beautify(years) +
				"%</b>).<q>Thank you for playing Cookie Clicker!<br>-Orteil</q>",
			icon: [22, 13],
			power: years,
			price: 99999999999999999999999999999
		});

		order = 150;
		new Game.Upgrade("Armythril mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>This one takes about 53 people to push it around and another 48 to jump down on the button and trigger a click. You could say it's got some heft to it.</q>",
			50000000000000000000000, [11, 19], {
				tier: 10,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});

		order = 200;
		Game.TieredUpgrade("Reverse dementia",
			"Grandmas are <b>twice</b> as efficient.<q>Extremely unsettling, and somehow even worse than the regular kind.</q>",
			"Grandma", 9);
		order = 300;
		Game.TieredUpgrade("Humane pesticides",
			"Farms are <b>twice</b> as efficient.<q>Made by people, for people, from people and ready to unleash some righteous scorching pain on those pesky insects that so deserve it.</q>",
			"Farm", 9);
		order = 400;
		Game.TieredUpgrade("Mole people",
			"Mines are <b>twice</b> as efficient.<q>Engineered from real human beings within your very labs, these sturdy little folks have a knack for finding the tastiest underground minerals in conditions that more expensive machinery probably wouldn't survive.</q>",
			"Mine", 9);
		order = 500;
		Game.TieredUpgrade("Machine learning",
			"Factories are <b>twice</b> as efficient.<q>You figured you might get better productivity if you actually told your workers to learn how to work the machines. Sometimes, it's the little things...</q>",
			"Factory", 9);
		order = 525;
		Game.TieredUpgrade("Edible money",
			"Banks are <b>twice</b> as efficient.<q>It's really quite simple; you make all currency too delicious not to eat, solving world hunger and inflation in one fell swoop!</q>",
			"Bank", 9);
		order = 550;
		Game.TieredUpgrade("Sick rap prayers",
			"Temples are <b>twice</b> as efficient.<q>With their ill beat and radical rhymes, these way-hip religious tunes are sure to get all the youngins who thought they were 2 cool 4 church back on the pews and praying for more! Wicked!</q>",
			"Temple", 9);
		order = 575;
		Game.TieredUpgrade("Deluxe tailored wands",
			"Wizard towers are <b>twice</b> as efficient.<q>In this age of science, most skillful wand-makers are now long gone; but thankfully - not all those wanders are lost.</q>",
			"Wizard tower", 9);
		order = 600;
		Game.TieredUpgrade("Autopilot",
			"Shipments are <b>twice</b> as efficient.<q>Your ships are now fitted with completely robotic crews! It's crazy how much money you save when you don't have to compensate the families of those lost in space.</q>",
			"Shipment", 9);
		order = 700;
		Game.TieredUpgrade("The advent of chemistry",
			"Alchemy labs are <b>twice</b> as efficient.<q>You know what? That whole alchemy nonsense was a load of baseless rubbish. Dear god, what were you thinking?</q>",
			"Alchemy lab", 9);
		order = 800;
		Game.TieredUpgrade("The real world",
			"Portals are <b>twice</b> as efficient.<q>It turns out that our universe is actually the twisted dimension of another, saner plane of reality. Time to hop on over there and loot the place!</q>",
			"Portal", 9);
		order = 900;
		Game.TieredUpgrade("Second seconds",
			"Time machines are <b>twice</b> as efficient.<q>That's twice as many seconds in the same amount of time! What a deal! Also, what in god's name!</q>",
			"Time machine", 9);
		order = 1000;
		Game.TieredUpgrade("Quantum comb",
			"Antimatter condensers are <b>twice</b> as efficient.<q>Quantum entanglement is one of those things that are so annoying to explain that we might honestly be better off without it. This is finally possible thanks to the quantum comb!</q>",
			"Antimatter condenser", 9);
		order = 1100;
		Game.TieredUpgrade("Crystal mirrors",
			"Prisms are <b>twice</b> as efficient.<q>Designed to filter more light back into your prisms, reaching levels of brightness that reality itself had never planned for.</q>",
			"Prism", 9);
		order = 1200;
		Game.TieredUpgrade("Bunnypedes",
			"Chancemakers are <b>twice</b> as efficient.<q>You've taken to breeding rabbits with hundreds of paws, which makes them intrinsically very lucky and thus a very handy (if very disturbing) pet.</q>",
			"Chancemaker", 9);

		order = 20000;
		new Game.Upgrade("Kitten assistants to the regional manager",
			"You gain <b>more CpS</b> the more milk you have.<q>nothing stresses meowt... except having to seek the approval of my inferiors, sir</q>",
			900000000000000000000000000000000000, Game.GetIcon("Kitten", 10), {
				tier: 10,
				groups: "bonus|kitten:9"
			});

		order = 5000;
		Game.SynergyUpgrade("Charm quarks",
			"<q>They're after your lucky quarks!</q>",
			"Chancemaker", "Antimatter condenser", "synergy2");

		order = 10020;
		Game.CookieUpgrade({
			name: "Pink biscuits",
			desc: "One of the oldest cookies. Traditionally dipped in champagne to soften it, because the French will use any opportunity to drink.",
			icon: [21, 16],
			power: 4,
			price: 999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Whole-grain cookies",
			desc: 'Covered in seeds and other earthy-looking debris. Really going for that "5-second rule" look.',
			icon: [22, 16],
			power: 4,
			price: 999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Candy cookies",
			desc: "These melt in your hands just a little bit.",
			icon: [23, 16],
			power: 4,
			price: 9999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Big chip cookies",
			desc: "You are in awe at the size of these chips. Absolute units.",
			icon: [24, 16],
			power: 4,
			price: 9999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "One chip cookies",
			desc: "You get one.",
			icon: [25, 16],
			power: 1,
			price: 99999999999999999999999999999
		});

		new Game.Upgrade("Sugar baking",
			'Each unspent sugar lump (up to 100) gives <b>+1% CpS</b>.<div class="warning">Note : this means that spending sugar lumps will decrease your CpS until they grow back.</div><q>To bake with the sugary essence of eons themselves, you must first learn to take your sweet time.</q>',
			200000000, [21, 17], {
				pool: "prestige",
				groups: "bonus"
			});
		new Game.Upgrade("Sugar craving",
			'Once an ascension, you may use the "Sugar frenzy" switch to <b>triple your CpS</b> for 1 hour, at the cost of <b>1 sugar lump</b>.<q>Just a little kick to sweeten the deal.</q>',
			400000000, [22, 17], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Sugar aging process",
			"Each grandma (up to 600) makes sugar lumps ripen <b>6 seconds</b> sooner.<q>Aren't they just the sweetest?</q>",
			600000000, [23, 17], {
				pool: "prestige",
				groups: "misc"
			});

		order = 40050;
		new Game.Upgrade("Sugar frenzy",
			"Activating this will <b>triple your CpS</b> for 1 hour, at the cost of <b>1 sugar lump</b>.<br>May only be used once per ascension.",
			0, [22, 17], {
				priceLumps: 1,
				pool: "toggle",
				requiredUpgrade: "Sugar craving",
				groups: "misc"
			});

		order = 10020;
		Game.CookieUpgrade({
			name: "Sprinkles cookies",
			desc: "A bit of festive decorating helps hide the fact that this might be one of the blandest cookies you've ever tasted.",
			icon: [21, 14],
			power: 4,
			price: 99999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Peanut butter blossoms",
			desc: "Topped with a scrumptious chocolate squirt, which is something we really wish we didn't just write.",
			icon: [22, 14],
			power: 4,
			price: 999999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "No-bake cookies",
			desc: "You have no idea how these mysterious oven-less treats came to be or how they hold their shape. You're thinking either elephant glue or cold fusion.",
			icon: [21, 15],
			power: 4,
			price: 999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Florentines",
			desc: "These make up for being the fruitcake of cookies by at least having the decency to feature chocolate.",
			icon: [26, 16],
			power: 4,
			price: 9999999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Chocolate crinkles",
			desc: "Non-denominational cookies to celebrate year-round deliciousness, and certainly not Christmas or some other nonsense.",
			icon: [22, 15],
			power: 4,
			price: 9999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Maple cookies",
			desc: "Made with syrup from a land where milk comes in bags, instead of spontaneously pooling at the bottom of your screen depending on your achievements.",
			icon: [21, 13],
			power: 4,
			price: 99999999999999999999999999999999
		});

		order = 40000;
		new Game.Upgrade("Turbo-charged soil",
			"Garden plants grow every second.<br>Garden seeds are free to plant.<br>You can switch soils at any time.<q>It's got electrolytes!</q>",
			7, [2, 16], {
				pool: "debug",
				groups: "misc"
			}); //debug purposes only

		order = 150;
		new Game.Upgrade("Technobsidian mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>A highly advanced mouse of a sophisticated design. Only one thing on its mind : to click.</q>",
			5000000000000000000000000, [11, 28], {
				tier: 11,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});
		new Game.Upgrade("Plasmarble mouse",
			"Clicking gains <b>+1% of your CpS</b>.<q>A shifting blur in the corner of your eye, this mouse can trigger a flurry of clicks when grazed by even the slightest breeze.</q>",
			500000000000000000000000000, [11, 30], {
				tier: 12,
				col: 11,
				groups: "click|onlyClick|clickPercent",
				recommend: clickRecFunc
			});

		order = 20000;
		new Game.Upgrade("Kitten marketeers",
			"You gain <b>more CpS</b> the more milk you have.<q>no such thing as a saturated markit, sir</q>",
			900000000000000000000000000000000000000, Game.GetIcon("Kitten", 11), {
				tier: 11,
				groups: "kitten:10"
			});

		order = 10030;
		Game.CookieUpgrade({
			name: "Festivity loops",
			desc: "These garish biscuits are a perfect fit for children's birthday parties or the funerals of strange, eccentric billionaires.",
			icon: [25, 17],
			require: "Box of brand biscuits",
			power: 2,
			price: 999999999999999 * 5
		});

		order = 10020;
		Game.CookieUpgrade({
			name: "Persian rice cookies",
			desc: "Rose water and poppy seeds are the secret ingredients of these small, butter-free cookies.",
			icon: [28, 15],
			power: 4,
			price: 99999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Norwegian cookies",
			desc: "A flat butter cookie with a sliver of candied cherry on top. It is said that these illustrate the bleakness of scandinavian existentialism.",
			icon: [22, 20],
			power: 4,
			price: 999999999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Crispy rice cookies",
			desc: "Fun to make at home! Store-bought cookies are obsolete! Topple the system! There's marshmallows in these! Destroy capitalism!",
			icon: [23, 20],
			power: 4,
			price: 999999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Ube cookies",
			desc: "The tint is obtained by the use of purple yams. According to color symbolism, these cookies are either noble, holy, or supervillains.",
			icon: [24, 17],
			power: 4,
			price: 9999999999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Butterscotch cookies",
			desc: "The butterscotch chips are just the right amount of sticky, and make you feel like you're eating candy.",
			icon: [24, 20],
			power: 4,
			price: 9999999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Speculaas",
			desc: "These crunchy, almost obnoxiously cinnamony cookies are a source of dutch pride. About the origin of the name, one can only speculate.",
			icon: [21, 20],
			power: 4,
			price: 99999999999999999999999999999999999
		});

		order = 10200;
		Game.CookieUpgrade({
			name: "Elderwort biscuits",
			forceDesc: "Cookie production multiplier <b>+2%</b>.<br>Grandma production multiplier <b>+2%</b>.<br>Dropped by elderwort plants.<q>They taste incredibly stale, even when baked fresh.</q>",
			icon: [22, 25],
			power: 2,
			price: 60 * 2,
			locked: true,
			groups: "gardenDrop"
		});
		Game.CookieUpgrade({
			name: "Bakeberry cookies",
			forceDesc: "Cookie production multiplier <b>+2%</b>.<br>Dropped by bakeberry plants.<q>Really good dipped in hot chocolate.</q>",
			icon: [23, 25],
			power: 2,
			price: 60,
			locked: true,
			groups: "gardenDrop"
		});
		Game.CookieUpgrade({
			name: "Duketater cookies",
			forceDesc: "Cookie production multiplier <b>+10%</b>.<br>Dropped by duketater plants.<q>Fragrant and mealy, with a slight yellow aftertaste.</q>",
			icon: [24, 25],
			power: 10,
			price: 60 * 3,
			locked: true,
			groups: "gardenDrop"
		});
		Game.CookieUpgrade({
			name: "Green yeast digestives",
			forceDesc: "<b>+1%</b> golden cookie gains and effect duration.<br><b>+1%</b> golden cookie frequency.<br><b>+3%</b> random drops.<br>Dropped by green rot plants.<q>These are tastier than you'd expect, but not by much.</q>",
			icon: [25, 25],
			power: 0,
			price: 60 * 3,
			locked: true,
			groups: "gardenDrop"
		});

		order = 23000;
		new Game.Upgrade("Fern tea",
			"You gain <b>+3%</b> of your regular CpS while the game is closed <small>(provided you have the Twin Gates of Transcendence heavenly upgrade)</small>.<br>Dropped by drowsyfern plants.<q>A chemically complex natural beverage, this soothing concoction has been used by mathematicians to solve equations in their sleep.</q>",
			60, [26, 25], {groups: "gardenDrop"});
		new Game.Upgrade("Ichor syrup",
			"You gain <b>+7%</b> of your regular CpS while the game is closed <small>(provided you have the Twin Gates of Transcendence heavenly upgrade)</small>.<br>Sugar lumps mature <b>7 minutes</b> sooner.<br>Dropped by ichorpuff plants.<q>Tastes like candy. The smell is another story.</q>",
			60 * 2, [27, 25], {groups: "gardenDrop"});

		order = 10200;
		Game.CookieUpgrade({
			name: "Wheat slims",
			forceDesc: "Cookie production multiplier <b>+1%</b>.<br>Dropped by baker's wheat plants.<q>The only reason you'd consider these to be cookies is because you feel slightly sorry for them.</q>",
			icon: [28, 25],
			power: 1,
			price: 30,
			locked: true,
			groups: "gardenDrop"
		});

		order = 10300;
		Game.CookieUpgrade({
			name: "Synthetic chocolate green honey butter biscuit",
			desc: "Rewarded for owning 350 of everything.<br>The recipe for this butter biscuit was once the sole heritage of an ancient mountain monastery. Its flavor is so refined that only a slab of lab-made chocolate specifically engineered to be completely tasteless could complement it.<br>Also it's got your face on it.",
			icon: [24, 26],
			power: 10,
			price: 999999999999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(350)
		});
		Game.CookieUpgrade({
			name: "Royal raspberry chocolate butter biscuit",
			desc: "Rewarded for owning 400 of everything.<br>Once reserved for the megalomaniac elite, this unique strain of fruity chocolate has a flavor and texture unlike any other. Whether its exorbitant worth is improved or lessened by the presence of your likeness on it still remains to be seen.",
			icon: [25, 26],
			power: 10,
			price: 999999999999999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(400)
		});
		Game.CookieUpgrade({
			name: "Ultra-concentrated high-energy chocolate butter biscuit",
			desc: "Rewarded for owning 450 of everything.<br>Infused with the power of several hydrogen bombs through a process that left most nuclear engineers and shareholders perplexed. Currently at the center of some rather heated United Nations meetings. Going in more detail about this chocolate would violate several state secrets, but we'll just add that someone's bust seems to be pictured on it. Perhaps yours?",
			icon: [26, 26],
			power: 10,
			price: 999999999999999999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(450)
		});

		order = 200;
		Game.TieredUpgrade("Timeproof hair dyes",
			"Grandmas are <b>twice</b> as efficient.<q>Why do they always have those strange wispy pink dos? What do they know about candy floss that we don't?</q>",
			"Grandma", 10);
		order = 300;
		Game.TieredUpgrade("Barnstars",
			"Farms are <b>twice</b> as efficient.<q>Ah, yes. These help quite a bit. Somehow.</q>",
			"Farm", 10);
		order = 400;
		Game.TieredUpgrade("Mine canaries",
			"Mines are <b>twice</b> as efficient.<q>These aren't used for anything freaky! The miners just enjoy having a pet or two down there.</q>",
			"Mine", 10);
		order = 500;
		Game.TieredUpgrade("Brownie point system",
			"Factories are <b>twice</b> as efficient.<q>Oh, these are lovely! You can now reward your factory employees for good behavior, such as working overtime or snitching on coworkers. 58 brownie points gets you a little picture of a brownie, and 178 of those pictures gets you an actual brownie piece for you to do with as you please! Infantilizing? Maybe. Oodles of fun? You betcha!</q>",
			"Factory", 10);
		order = 525;
		Game.TieredUpgrade("Grand supercycles",
			"Banks are <b>twice</b> as efficient.<q>We let the public think these are complicated financial terms when really we're just rewarding the bankers with snazzy bicycles for a job well done. It's only natural after you built those fancy gold swimming pools for them, where they can take a dip and catch Kondratiev waves.</q>",
			"Bank", 10);
		order = 550;
		Game.TieredUpgrade("Psalm-reading",
			"Temples are <b>twice</b> as efficient.<q>A theologically dubious and possibly blasphemous blend of fortune-telling and scripture studies.</q>",
			"Temple", 10);
		order = 575;
		Game.TieredUpgrade("Immobile spellcasting",
			"Wizard towers are <b>twice</b> as efficient.<q>Wizards who master this skill can now cast spells without having to hop and skip and gesticulate embarrassingly, which is much sneakier and honestly quite a relief.</q>",
			"Wizard tower", 10);
		order = 600;
		Game.TieredUpgrade("Restaurants at the end of the universe",
			"Shipments are <b>twice</b> as efficient.<q>Since the universe is spatially infinite, and therefore can be construed to have infinite ends, you've opened an infinite chain of restaurants where your space truckers can rest and partake in some home-brand cookie-based meals.</q>",
			"Shipment", 10);
		order = 700;
		Game.TieredUpgrade("On second thought",
			"Alchemy labs are <b>twice</b> as efficient.<q>Disregard that last upgrade, alchemy is where it's at! Your eggheads just found a way to transmute children's nightmares into rare metals!</q>",
			"Alchemy lab", 10);
		order = 800;
		Game.TieredUpgrade("Dimensional garbage gulper",
			"Portals are <b>twice</b> as efficient.<q>So we've been looking for a place to dispose of all the refuse that's been accumulating since we started baking - burnt cookies, failed experiments, unruly workers - and well, we figured rather than sell it to poor countries like we've been doing, we could just dump it in some alternate trash dimension where it's not gonna bother anybody! Probably!</q>",
			"Portal", 10);
		order = 900;
		Game.TieredUpgrade("Additional clock hands",
			"Time machines are <b>twice</b> as efficient.<q>It seemed like a silly idea at first, but it turns out these have the strange ability to twist time in interesting new ways.</q>",
			"Time machine", 10);
		order = 1000;
		Game.TieredUpgrade("Baking Nobel prize",
			"Antimatter condensers are <b>twice</b> as efficient.<q>What better way to sponsor scientific growth than to motivate those smarmy nerds with a meaningless award! What's more, each prize comes with a fine print lifelong exclusive contract to come work for you (or else)!</q>",
			"Antimatter condenser", 10);
		order = 1100;
		Game.TieredUpgrade("Reverse theory of light",
			"Prisms are <b>twice</b> as efficient.<q>A whole new world of physics opens up when you decide that antiphotons are real and posit that light is merely a void in shadow.</q>",
			"Prism", 10);
		order = 1200;
		Game.TieredUpgrade("Revised probabilistics",
			"Chancemakers are <b>twice</b> as efficient.<q>Either something happens or it doesn't. That's a 50% chance! This suddenly makes a lot of unlikely things very possible.</q>",
			"Chancemaker", 10);

		order = 20000;
		new Game.Upgrade("Kitten analysts",
			"You gain <b>more CpS</b> the more milk you have.<q>based on purrent return-on-investment meowdels we should be able to affurd to pay our empawyees somewhere around next century, sir</q>",
			900000000000000000000000000000000000000000, Game.GetIcon("Kitten", 12), {
				tier: 12,
				groups: "kitten:11"
			});

		new Game.Upgrade("Eye of the wrinkler",
			"Mouse over a wrinkler to see how many cookies are in its stomach.<q>Just a wrinkler and its will to survive.<br>Hangin' tough, stayin' hungry.</q>",
			99999999, [27, 26], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Inspired checklist",
			'Unlocks the <b>Buy all</b> feature, which lets you instantly purchase every upgrade in your store (starting from the cheapest one).<br>Also unlocks the <b>Vault</b>, a store section where you can place upgrades you do not wish to auto-buy.<q>Snazzy grandma accessories? Check. Transdimensional abominations? Check. A bunch of eggs for some reason? Check. Machine that goes "ping"? Check and check.</q>',
			900000, [28, 26], {
				pool: "prestige",
				groups: "misc"
			});

		order = 10300;
		Game.CookieUpgrade({
			name: "Pure pitch-black chocolate butter biscuit",
			desc: "Rewarded for owning 500 of everything.<br>This chocolate is so pure and so flawless that it has no color of its own, instead taking on the appearance of whatever is around it. You're a bit surprised to notice that this one isn't stamped with your effigy, as its surface is perfectly smooth (to the picometer) - until you realize it's quite literally reflecting your own face like a mirror.",
			icon: [24, 27],
			power: 10,
			price: 999999999999999999999999999999999999999999999,
			locked: true,
			require: getNumAllObjectsRequireFunc(500)
		});

		order = 10020;
		Game.CookieUpgrade({
			name: "Chocolate oatmeal cookies",
			desc: "These bad boys compensate for lack of a cohesive form and a lumpy, unsightly appearance by being just simply delicious. Something we should all aspire to.",
			icon: [23, 28],
			power: 4,
			price: 99999999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Molasses cookies",
			desc: "Sticky, crackly, and dusted in fine sugar.<br>Some lunatics have been known to eat these with potatoes.",
			icon: [24, 28],
			power: 4,
			price: 999999999999999999999999999999999999
		});
		Game.CookieUpgrade({
			name: "Biscotti",
			desc: "Almonds and pistachios make these very robust cookies slightly more interesting to eat than to bludgeon people with.",
			icon: [22, 28],
			power: 4,
			price: 999999999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Waffle cookies",
			desc: "Whether these are cookies with shocklingly waffle-like features or simply regular cookie-sized waffles is a debate we're not getting into here.",
			icon: [21, 28],
			power: 4,
			price: 9999999999999999999999999999999999999
		});

		order = 10000;
		//early cookies that unlock at the same time as coconut cookies; meant to boost early game a little bit
		Game.CookieUpgrade({
			name: "Almond cookies",
			desc: "Sometimes you feel like one of these. Sometimes you don't.",
			icon: [21, 27],
			power: 2,
			price: 99999999
		});
		Game.CookieUpgrade({
			name: "Hazelnut cookies",
			desc: "Tastes like a morning stroll through a fragrant forest, minus the clouds of gnats.",
			icon: [22, 27],
			power: 2,
			price: 99999999
		});
		Game.CookieUpgrade({
			name: "Walnut cookies",
			desc: "Some experts have pointed to the walnut's eerie resemblance to the human brain as a sign of its sentience - a theory most walnuts vehemently object to.",
			icon: [23, 27],
			power: 2,
			price: 99999999
		});

		new Game.Upgrade("Label printer",
			"Mouse over an upgrade to see its tier.<br><small>Note : only some upgrades have tiers. Tiers are purely cosmetic and have no effect on gameplay.</small><q>Also comes in real handy when you want to tell catsup apart from ketchup.</q>",
			999999, [28, 29], {
				pool: "prestige",
				groups: "misc"
			});

		order = 200;
		Game.TieredUpgrade("Good manners",
			'Grandmas are <b>twice</b> as efficient.<q>Apparently these ladies are much more amiable if you take the time to learn their strange, ancient customs, which seem to involve saying "please" and "thank you" and staring at the sun with bulging eyes while muttering eldritch curses under your breath.</q>',
			"Grandma", 11);
		order = 300;
		Game.TieredUpgrade("Lindworms",
			"Farms are <b>twice</b> as efficient.<q>You have to import these from far up north, but they really help areate the soil!</q>",
			"Farm", 11);
		order = 400;
		Game.TieredUpgrade("Bore again",
			"Mines are <b>twice</b> as efficient.<q>After extracting so much sediment for so long, you've formed some veritable mountains of your own from the accumulated piles of rock and dirt. Time to dig through those and see if you find anything fun!</q>",
			"Mine", 11);
		order = 500;
		Game.TieredUpgrade('"Volunteer" interns',
			"Factories are <b>twice</b> as efficient.<q>If you're bad at something, always do it for free.</q>",
			"Factory", 11);
		order = 525;
		Game.TieredUpgrade("Rules of acquisition",
			"Banks are <b>twice</b> as efficient.<q>Rule 387 : a cookie baked is a cookie kept.</q>",
			"Bank", 11);
		order = 550;
		Game.TieredUpgrade("War of the gods",
			"Temples are <b>twice</b> as efficient.<q>An interesting game; the only winning move is not to pray.</q>",
			"Temple", 11);
		order = 575;
		Game.TieredUpgrade("Electricity",
			"Wizard towers are <b>twice</b> as efficient.<q>Ancient magicks and forbidden hexes shroud this arcane knowledge, whose unfathomable power can mysteriously turn darkness into light and shock an elephant to death.</q>",
			"Wizard tower", 11);
		order = 600;
		Game.TieredUpgrade("Universal alphabet",
			'Shipments are <b>twice</b> as efficient.<q>You\'ve managed to chart a language that can be understood by any sentient species in the galaxy; its exciting vocabulary contains over 56 trillion words that sound and look like sparkly burps, forming intricate sentences that usually translate to something like "give us your cookies, or else".</q>',
			"Shipment", 11);
		order = 700;
		Game.TieredUpgrade("Public betterment",
			"Alchemy labs are <b>twice</b> as efficient.<q>Why do we keep trying to change useless matter into cookies, or cookies into even better cookies? Clearly, the way of the future is to change the people who eat the cookies into people with a greater understanding, appreciation and respect for the cookies they're eating. Into the vat you go!</q>",
			"Alchemy lab", 11);
		order = 800;
		Game.TieredUpgrade("Embedded microportals",
			"Portals are <b>twice</b> as efficient.<q>We've found out that if we bake the portals into the cookies themselves, we can transport people's taste buds straight into the taste dimension! Good thing your army of lawyers got rid of the FDA a while ago!</q>",
			"Portal", 11);
		order = 900;
		Game.TieredUpgrade("Nostalgia",
			"Time machines are <b>twice</b> as efficient.<q>Your time machine technicians insist that this is some advanced new time travel tech, and not just an existing emotion universal to mankind. Either way, you have to admit that selling people the same old cookies just because it reminds them of the good old times is an interesting prospect.</q>",
			"Time machine", 11);
		order = 1000;
		Game.TieredUpgrade("The definite molecule",
			"Antimatter condensers are <b>twice</b> as efficient.<q>Your scientists have found a way to pack a cookie into one single continuous molecule, opening exciting new prospects in both storage and flavor despite the fact that these take up to a whole year to digest.</q>",
			"Antimatter condenser", 11);
		order = 1100;
		Game.TieredUpgrade("Light capture measures",
			"Prisms are <b>twice</b> as efficient.<q>As the universe gets ever so slightly dimmer due to you converting more and more of its light into cookies, you've taken to finding new and unexplored sources of light for your prisms; for instance, the warm glow emitted by a pregnant woman, or the twinkle in the eye of a hopeful child.</q>",
			"Prism", 11);
		order = 1200;
		Game.TieredUpgrade("0-sided dice",
			"Chancemakers are <b>twice</b> as efficient.<q>The advent of the 0-sided dice has had unexpected and tumultuous effects on the gambling community, and saw experts around the world calling you both a genius and an imbecile.</q>",
			"Chancemaker", 11);

		new Game.Upgrade("Heralds",
			"You now benefit from the boost provided by <b>heralds</b>.<br>Each herald gives you <b>+1% CpS</b>.<br>Look on the purple flag at the top to see how many heralds are active at any given time.<q>Be excellent to each other.<br>And Patreon, dudes!</q>",
			100, [21, 29], {
				pool: "prestige",
				groups: "bonus"
			});

		order = 255;
		Game.GrandmaSynergy("Metagrandmas", "A fractal grandma to make more grandmas to make more cookies.", "Fractal engine");

		order = 1300;
		Game.TieredUpgrade("Metabakeries",
			"Fractal engines are <b>twice</b> as efficient.<q>They practically bake themselves!</q>",
			"Fractal engine", 1);
		Game.TieredUpgrade("Mandelbrown sugar",
			"Fractal engines are <b>twice</b> as efficient.<q>A substance that displays useful properties such as fractal sweetness and instant contact lethality.</q>",
			"Fractal engine", 2);
		Game.TieredUpgrade("Fractoids",
			"Fractal engines are <b>twice</b> as efficient.<q>Here's a frun fract : all in all, these were a terrible idea.</q>",
			"Fractal engine", 3);
		Game.TieredUpgrade("Nested universe theory",
			"Fractal engines are <b>twice</b> as efficient.<q>Asserts that each subatomic particle is host to a whole new universe, and therefore, another limitless quantity of cookies.<br>This somehow stacks with the theory of nanocosmics, because physics.</q>",
			"Fractal engine", 4);
		Game.TieredUpgrade("Menger sponge cake",
			"Fractal engines are <b>twice</b> as efficient.<q>Frighteningly absorbent thanks to its virtually infinite surface area. Keep it isolated in a dry chamber, never handle it with an open wound, and do not ever let it touch a body of water.</q>",
			"Fractal engine", 5);
		Game.TieredUpgrade("One particularly good-humored cow",
			"Fractal engines are <b>twice</b> as efficient.<q>This unassuming bovine was excruciatingly expensive and it may seem at first like you were ripped off. On closer inspection however, you notice that its earrings (it's wearing earrings) are actually fully functional copies of itself, each of which also wearing their own cow earrings, and so on, infinitely. It appears your dairy concerns will be taken care of for a while, although you'll have to put up with the cow's annoying snickering.</q>",
			"Fractal engine", 6);
		Game.TieredUpgrade("Chocolate ouroboros",
			"Fractal engines are <b>twice</b> as efficient.<q>Forever eating its own tail and digesting itself, in a metabolically dubious tale of delicious tragedy.</q>",
			"Fractal engine", 7);
		Game.TieredUpgrade("Nested",
			"Fractal engines are <b>twice</b> as efficient.<q>Clever self-reference or shameful cross-promotion? This upgrade apparently has the gall to advertise a link to <u>orteil.dashnet.org/nested</u>, in a tooltip you can't even click.</q>",
			"Fractal engine", 8);
		Game.TieredUpgrade("Space-filling fibers",
			"Fractal engines are <b>twice</b> as efficient.<q>This special ingredient has the incredible ability to fill the local space perfectly, effectively eradicating hunger in those who consume it!<br>Knowing that no hunger means no need for cookies, your marketers urge you to repurpose this product into next-level packing peanuts.</q>",
			"Fractal engine", 9);
		Game.TieredUpgrade("Endless book of prose",
			"Fractal engines are <b>twice</b> as efficient.",
			"Fractal engine", 10);
		// Game.last.descFunc = function () {
		// 	var str = '"There once was a baker named ' + Game.bakeryName + ". One day, there was a knock at the door; " + Game.bakeryName + "
		// opened it and was suddenly face-to-face with a strange and menacing old grandma. The grandma opened her mouth and, in a strange little
		// voice, started reciting this strange little tale : "; var n = 35; var i = Math.floor(Game.T * 0.1); return this.desc + '<q
		// style="font-family:Courier;">' + (str.substr(i % str.length, n) + (i % str.length > (str.length - n) ? str.substr(0, i % str.length -
		// (str.length - n)) : "")) + "</q>"; };
		Game.TieredUpgrade("The set of all sets",
			"Fractal engines are <b>twice</b> as efficient.<q>The answer, of course, is a definite maybe.</q>",
			"Fractal engine", 11);

		order = 5000;
		Game.SynergyUpgrade("Recursive mirrors",
			"<q>Do you have any idea what happens when you point two of these at each other? Apparently, the universe doesn't either.</q>",
			"Fractal engine", "Prism", "synergy1");
		Game.SynergyUpgrade("Mice clicking mice",
			"",
			"Fractal engine", "Cursor", "synergy2");
		Game.last.descFunc = function() {
			Math.seedrandom(Game.seed + "-blacsphemouse");
			if (Math.random() < 0.3) {
				Math.seedrandom();
				return this.desc + "<q>Absolutely blasphemouse!</q>";
			} else {
				Math.seedrandom();
				return this.desc + "<q>Absolutely blasphemous!</q>";
			}
		};

		order = 10020;
		Game.CookieUpgrade({
			name: "Custard creams",
			desc: "British lore pits these in a merciless war against bourbon biscuits.<br>The filling evokes vanilla without quite approaching it.<br>They're tastier on the inside!",
			icon: [23, 29],
			power: 4,
			price: 9999999999999999999999999999999999999 * 5
		});
		Game.CookieUpgrade({
			name: "Bourbon biscuits",
			desc: "Two chocolate biscuits joined together with even more chocolate.<br>The sworn rivals of custard creams, as legend has it.",
			icon: [24, 29],
			power: 4,
			price: 99999999999999999999999999999999999999
		});

		new Game.Upgrade("Keepsakes",
			"Seasonal random drops have a <b>1/5 chance</b> to carry over through ascensions.<q>Cherish the memories.</q>",
			1111111111, [22, 29], {
				pool: "prestige",
				groups: "misc"
			});

		order = 10020;
		Game.CookieUpgrade({
			name: "Mini-cookies",
			desc: "Have you ever noticed how the smaller something is, the easier it is to binge on it?",
			icon: [29, 30],
			power: 5,
			price: 99999999999999999999999999999999999999 * 5
		});

		new Game.Upgrade("Sugar crystal cookies",
			"Cookie production multiplier <b>+5% permanently</b>, and <b>+1%</b> for every building type level 10 or higher.<q>Infused with cosmic sweetness. It gives off a faint shimmery sound when you hold it up to your ear.</q>",
			1000000000, [21, 30], {
				pool: "prestige",
				pseudoCookie: true,
				power: function() {
					var n = 5;
					for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
						if (Game.ObjectsById[i].level >= 10) { n++; }
					}
					return n;
				},
				descFunc: function() {
					var n = 5;
					for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
						if (Game.ObjectsById[i].level >= 10) { n++; }
					}
					return ('<div style="text-align:center;">Current : <b>+' + Game.Beautify(n) + '%</b><div class="line"></div></div>' + this.desc);
				}
			});
		new Game.Upgrade("Box of maybe cookies",
			"Contains an assortment of...something.<q>These may or may not be considered cookies.</q>",
			333000000000, [25, 29], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Box of not cookies",
			"Contains an assortment of...something.<q>These are strictly, definitely not cookies.</q>",
			333000000000, [26, 29], {
				pool: "prestige",
				groups: "misc"
			});
		new Game.Upgrade("Box of pastries",
			"Contains an assortment of delicious pastries.<q>These are a damn slippery slope is what they are!</q>",
			333000000000, [27, 29], {
				pool: "prestige",
				groups: "misc"
			});

		order = 10040;
		Game.CookieUpgrade({
			name: "Profiteroles",
			desc: "Also known as cream puffs, these pastries are light, fluffy, filled with whipped cream and fun to throw at people when snowballs are running scarce.",
			icon: [29, 29],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 31)
		});
		Game.CookieUpgrade({
			name: "Jelly donut",
			desc: "Guaranteed to contain at least 0.3% jelly filling, or your money back.<br>You can still see the jelly stab wound!",
			icon: [27, 28],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 33)
		});
		Game.CookieUpgrade({
			name: "Glazed donut",
			desc: "Absolutely gooey with sugar. The hole is the tastiest part!",
			icon: [28, 28],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 35)
		});
		Game.CookieUpgrade({
			name: "Chocolate cake",
			desc: "The cake is a Portal reference!",
			icon: [25, 27],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 37)
		});
		Game.CookieUpgrade({
			name: "Strawberry cake",
			desc: "It's not easy to come up with flavor text for something as generic as this, but some would say it's a piece of cake.",
			icon: [26, 27],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 39)
		});
		Game.CookieUpgrade({
			name: "Apple pie",
			desc: "It is said that some grandmas go rogue and bake these instead.",
			icon: [25, 28],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 41)
		});
		Game.CookieUpgrade({
			name: "Lemon meringue pie",
			desc: "Meringue is a finicky substance made of sugar and egg whites that requires specific atmospheric conditions to be baked at all. The lemon, as far as we can tell, isn't nearly as picky.",
			icon: [26, 28],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 43)
		});
		Game.CookieUpgrade({
			name: "Butter croissant",
			desc: "Look around.<br>A rude man in a striped shirt bikes past you. He smells of cigarettes and caf&eacute;-au-lait. Somewhere, a mime uses his moustache to make fun of the British. 300 pigeons fly overhead.<br>Relax. You're experiencing croissant.",
			icon: [29, 28],
			require: "Box of pastries",
			power: 4,
			price: Math.pow(10, 45)
		});

		order = 10050;
		Game.CookieUpgrade({
			name: "Cookie dough",
			desc: "Bursting with infinite potential, but can also be eaten as is. Arguably worth the salmonella.",
			icon: [25, 30],
			require: "Box of maybe cookies",
			power: 4,
			price: Math.pow(10, 35)
		});
		Game.CookieUpgrade({
			name: "Burnt cookie",
			desc: "This cookie flew too close to the sun and is now a shadow of its former self. If only you remembered to set a timer, you wouldn't have this tragedy on your hands...",
			icon: [23, 30],
			require: "Box of maybe cookies",
			power: 4,
			price: Math.pow(10, 37)
		});
		Game.CookieUpgrade({
			name: "A chocolate chip cookie but with the chips picked off for some reason",
			desc: "This has to be the saddest thing you've ever seen.",
			icon: [24, 30],
			require: "Box of maybe cookies",
			power: 3,
			price: Math.pow(10, 39)
		});
		Game.CookieUpgrade({
			name: "Flavor text cookie",
			desc: "What you're currently reading is what gives this cookie its inimitable flavor.",
			icon: [22, 30],
			require: "Box of maybe cookies",
			power: 4,
			price: Math.pow(10, 41)
		});
		Game.CookieUpgrade({
			name: "High-definition cookie",
			desc: "Uncomfortably detailed, like those weird stories your aunt keeps telling at parties.",
			icon: [28, 10],
			require: "Box of maybe cookies",
			power: 5,
			price: Math.pow(10, 43)
		});

		order = 10060;
		Game.CookieUpgrade({
			name: "Toast",
			desc: "A crisp slice of bread, begging for some butter and jam.<br>Why do people keep proposing these at parties?",
			icon: [27, 10],
			require: "Box of not cookies",
			power: 4,
			price: Math.pow(10, 34)
		});
		Game.CookieUpgrade({
			name: "Peanut butter & jelly",
			desc: "It's time.",
			icon: [29, 9],
			require: "Box of not cookies",
			power: 4,
			price: Math.pow(10, 36)
		});
		Game.CookieUpgrade({
			name: "Wookies",
			desc: "These aren't the cookies you're looking for.",
			icon: [26, 30],
			require: "Box of not cookies",
			power: 4,
			price: Math.pow(10, 38)
		});
		Game.CookieUpgrade({
			name: "Cheeseburger",
			desc: "Absolutely no relation to cookies whatsoever - Orteil just wanted an excuse to draw a cheeseburger.",
			icon: [28, 30],
			require: "Box of not cookies",
			power: 4,
			price: Math.pow(10, 40)
		});
		Game.CookieUpgrade({
			name: "One lone chocolate chip",
			desc: "The start of something beautiful.",
			icon: [27, 30],
			require: "Box of not cookies",
			power: 1,
			price: Math.pow(10, 42)
		});

		new Game.Upgrade("Genius accounting",
			"Unlocks <b>extra price information</b>.<br>Each displayed cost now specifies how long it'll take you to afford it, and how much of your bank it represents.<q>There's no accounting for taste, and yet here we are.</q>",
			2000000, [11, 10], {
				pool: "prestige",
				groups: "misc"
			});

		new Game.Upgrade("Shimmering veil",
			"Unlocks the <b>shimmering veil</b>, a switch that passively boosts your CpS by <b>50%</b>.<br>You start with the veil turned on; however, it is very fragile, and clicking the big cookie or any golden cookie or reindeer will turn it off, requiring 24 hours of CpS to turn back on.<q>Hands off!</q>",
			999999999, [9, 10], {
				pool: "prestige",
				groups: "misc"
			});

		order = 40005;
		descFunc = function() {
			var boost = 50;
			var resist = 0;
			if (Game.HasUpgrade("Reinforced membrane")) {
				boost += 10;
				resist += 10;
			}
			return ((this.name == "Shimmering veil [on]" ? '<div style="text-align:center;">Active.</div><div class="line"></div>' : "") +
				"Boosts your cookie production by <b>" + Game.Beautify(boost) +
				"%</b> when active.<br>The veil is very fragile and will break if you click the big cookie or any golden cookies or reindeer.<br><br>Once broken, turning the veil back on costs 24 hours of unbuffed CpS." +
				(resist > 0 ? ("<br><br>Has a <b>" + Game.Beautify(resist) + "%</b> chance to not break.") : ""));
		};
		new Game.Upgrade("Shimmering veil [off]",
			"",
			1000000, [9, 10], {
				pool: "toggle",
				groups: "bonus|globalCpsMod",
				isParent: true,
				priceFunc: function() { return Game.unbuffedCookiesPs * 60 * 60 * 24; },
				descFunc: descFunc
			});
		var sVeil = Game.last;
		new Game.Upgrade("Shimmering veil [on]",
			"",
			0, [9, 10], {
				pool: "toggle",
				groups: "bonus|globalCpsMod",
				toggleInto: sVeil,
				isChild: true,
				setCpsNegative: true,
				descFunc: descFunc
			});
		sVeil.toggleInto = Game.last;

		var getCookiePrice = function(level) { return 999999999999999999999999999999999999999 * Math.pow(10, (level - 1) / 2); };

		order = 10020;
		Game.CookieUpgrade({
			name: "Whoopie pies",
			desc: "Two chocolate halves joined together by a cream filling. It's got no eyebrows, but you never noticed until now.",
			icon: [21, 31],
			power: 5,
			price: getCookiePrice(1)
		});
		Game.CookieUpgrade({
			name: "Caramel wafer biscuits",
			desc: "Coated in delicious chocolate. As many layers as you'll get in a biscuit without involving onions.",
			icon: [22, 31],
			power: 5,
			price: getCookiePrice(2)
		});
		Game.CookieUpgrade({
			name: "Chocolate chip mocha cookies",
			desc: "Mocha started out as an excuse to smuggle chocolate into coffee. And now, in a poignant display of diplomacy and cultural exchange, it's bringing coffee to chocolate cookies.",
			icon: [23, 31],
			power: 5,
			price: getCookiePrice(3)
		});
		Game.CookieUpgrade({
			name: "Earl Grey cookies",
			desc: "Captain Picard's favorite.",
			icon: [24, 31],
			power: 5,
			price: getCookiePrice(4)
		});
		Game.CookieUpgrade({
			name: "Corn syrup cookies",
			desc: "The corn syrup makes it extra chewy. Not the type of stuff you'd think to put in a cookie, but bakers make do.",
			icon: [25, 31],
			power: 5,
			price: getCookiePrice(5)
		});
		Game.CookieUpgrade({
			name: "Icebox cookies",
			desc: "Can be prepared in a variety of shapes with a variety of ingredients. Made by freezing dough before baking it, mirroring a time-proven medieval torture practice. Gotta keep them guessing.",
			icon: [26, 31],
			power: 5,
			price: getCookiePrice(6)
		});
		Game.CookieUpgrade({
			name: "Graham crackers",
			desc: "Inspired in their design by the wish to live a life of austere temperance, free from pleasure or cheer; it's no wonder these are so tasty.",
			icon: [27, 31],
			power: 5,
			price: getCookiePrice(7)
		});
		Game.CookieUpgrade({
			name: "Hardtack",
			desc: "Extremely hard and, if we're being honest, extremely tack.<br>If you're considering eating this as a fun snack, you probably have other things to worry about than this game, like getting scurvy or your crew fomenting mutiny.",
			icon: [28, 31],
			power: 5,
			price: getCookiePrice(8)
		});
		Game.CookieUpgrade({
			name: "Cornflake cookies",
			desc: "They're grrrrrroovy! Careful not to let it sit in your milk too long, lest you accidentally end up with a bowl of cereal and get confused.",
			icon: [29, 31],
			power: 5,
			price: getCookiePrice(9)
		});
		Game.CookieUpgrade({
			name: "Tofu cookies",
			desc: "There's really two ways to go with tofu cooking; either it asserts itself in plain sight or it camouflages itself in the other ingredients. This happens to be the latter, and as such, you can't really tell the difference between this and a regular cookie, save for that one pixel on the left.",
			icon: [30, 31],
			power: 5,
			price: getCookiePrice(10)
		});
		Game.CookieUpgrade({
			name: "Gluten-free cookies",
			desc: "Made with browned butter and milk to closely match the archetypal chocolate chip cookie.<br>For celiacs, a chance to indulge in a delicious risk-free pastry. For others, a strangely threatening confection whose empty eyes will never know heaven nor hell.",
			icon: [30, 30],
			power: 5,
			price: getCookiePrice(10)
		});
		Game.CookieUpgrade({
			name: "Russian bread cookies",
			desc: "Also known as alphabet cookies; while most bakers follow the recipe to the letter, it is said that some substitute the flour for spelt. But don't take my word for it.",
			icon: [30, 29],
			power: 5,
			price: getCookiePrice(11)
		});
		Game.CookieUpgrade({
			name: "Lebkuchen",
			desc: "Diverse cookies from Germany, fragrant with honey and spices, often baked around Christmas.<br>Once worn by warriors of old for protection in battle.<br>+5 STR, +20% magic resistance.",
			icon: [30, 28],
			power: 5,
			price: getCookiePrice(12)
		});
		Game.CookieUpgrade({
			name: "Aachener Printen",
			desc: "The honey once used to sweeten these gingerbread-like treats has since been swapped out for beet sugar, providing another sad example of regressive evolution.",
			icon: [30, 27],
			power: 5,
			price: getCookiePrice(13)
		});
		Game.CookieUpgrade({
			name: "Canistrelli",
			desc: "A dry biscuit flavored with anise and wine, tough like the people of Corsica where it comes from.",
			icon: [30, 26],
			power: 5,
			price: getCookiePrice(14)
		});
		Game.CookieUpgrade({
			name: "Nice biscuits",
			desc: "Made with coconut and perfect with tea. Traces its origins to a French city so nice they named it that.",
			icon: [30, 25],
			power: 5,
			price: getCookiePrice(15)
		});
		Game.CookieUpgrade({
			name: "French pure butter cookies",
			desc: "You can't tell what's stronger coming off these - the smell of butter or condescension.",
			icon: [31, 25],
			power: 5,
			price: getCookiePrice(16)
		});
		Game.CookieUpgrade({
			name: "Petit beurre",
			desc: 'An unassuming biscuit whose name simply means "little butter". Famed and feared for its four ears and forty-eight teeth.<br>When it hears ya, it\'ll get ya...',
			icon: [31, 26],
			power: 5,
			price: getCookiePrice(16)
		});
		Game.CookieUpgrade({
			name: "Nanaimo bars",
			desc: "A delicious no-bake pastry hailing from Canada. Probably beats eating straight-up snow with maple syrup poured on it, but what do I know.",
			icon: [31, 27],
			power: 5,
			price: getCookiePrice(17)
		});
		Game.CookieUpgrade({
			name: "Berger cookies",
			desc: "Messily slathered with chocolate fudge, but one of the most popular bergers of Baltimore, along with the triple fried egg berger and the blue crab cheeseberger.",
			icon: [31, 28],
			power: 5,
			price: getCookiePrice(18)
		});
		Game.CookieUpgrade({
			name: "Chinsuko",
			desc: "A little piece of Okinawa in cookie form. Part of a Japanese custom of selling sweets as souvenirs. But hey, pressed pennies are cool too.",
			icon: [31, 29],
			power: 5,
			price: getCookiePrice(19)
		});
		Game.CookieUpgrade({
			name: "Panda koala biscuits",
			desc: "Assorted jungle animals with equally assorted fillings.<br>Comes in chocolate, strawberry, vanilla and green tea.<br>Eat them all before they go extinct!",
			icon: [31, 13],
			power: 5,
			price: getCookiePrice(19)
		});
		Game.CookieUpgrade({
			name: "Putri salju",
			desc: 'A beloved Indonesian pastry; its name means "snow princess", for the powdered sugar it\'s coated with. Had we added these to Cookie Clicker some years ago, this is where we\'d make a reference to that one Disney movie, but it\'s probably time to let it go.',
			icon: [31, 30],
			power: 5,
			price: getCookiePrice(20)
		});
		Game.CookieUpgrade({
			name: "Milk cookies",
			desc: "Best eaten with a tall glass of chocolate.",
			icon: [31, 31],
			power: 5,
			price: getCookiePrice(21)
		});

		order = 9999;
		Game.CookieUpgrade({
			name: "Cookie crumbs",
			desc: "There used to be a cookie here. Now there isn't.<br>Good heavens, what did you <i>DO?!</i>",
			icon: [30, 13],
			power: 1,
			require: "Legacy",
			price: 100
		});
		Game.CookieUpgrade({
			name: "Chocolate chip cookie",
			desc: "This is the cookie you've been clicking this whole time. It looks a bit dented and nibbled on, but it's otherwise good as new.",
			icon: [10, 0],
			power: 10,
			require: "Legacy",
			price: 1000000000000
		});

		new Game.Upgrade("Cosmic beginner's luck",
			"Prior to purchasing the <b>Heavenly chip secret</b> upgrade in a run, random drops are <b>5 times more common</b>.<q>Oh! A penny!<br>Oh! A priceless heirloom!<br>Oh! Another penny!</q>",
			999999999 * 15, [8, 10], {pool: "prestige"});
		new Game.Upgrade("Reinforced membrane",
			"The <b>shimmering veil</b> is more resistant, and has a <b>10% chance</b> not to break. It also gives <b>+10%</b> more CpS.<q>A consistency between jellyfish and cling wrap.</q>",
			999999999 * 15, [7, 10], {pool: "prestige"});


		//cleanup defined stuff

		var buildRequireFunc = function(amount) {
			if (isNaN(amount)) { amount = this.buildingTie.getAmount(); }
			return amount >= this.groups[this.buildingTie.groupName];
		};

		Game.getUpgradeBuildChainAmount = function(chain) {
			var buildAmount = chain.building.getAmount();
			var toAmount = Math.max(buildAmount, chain.amount);
			var diff = chain.amount - buildAmount;
			var mult = Game.buildingBuyInterval;

			if (diff > 0 && mult > 1) {
				diff = Math.ceil(diff / mult) * mult;
				toAmount = buildAmount + diff;
			}
			return toAmount;
		};

		Game.getUpgradeBuildChainChangeArr = function(upgrade, chain) {
			var amount = Game.getUpgradeBuildChainAmount(chain);
			return [
				{
					gameObj: chain.building,
					amount: amount
				}, {gameObj: upgrade}
			];
		};

		var buildChainRequireFunc = function() {
			var buildAmount = this.buildingTie.getAmount();
			var toAmount = Game.getUpgradeBuildChainAmount(this.chain);
			return (!this.buildingTie.blacklistCheckbox.checked && buildAmount < this.chain.amount &&
				toAmount - buildAmount <= Game.maxChain && this.require(this.chain.amount)); //better safe than sorry
		};

		var buyToggleIntoFunc = function() {
			if (this.bought) { this.toggleInto.setBought(false); }
		};

		Game.UpgradesNoMisc = [];

		for (i = Game.UpgradesById.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesById[i];
			var pool = upgrade.pool;
			Game.ArrayPush(Game.UpgradesByPool, pool, upgrade);

			if (Game.CountsAsUpgradeOwned(pool)) {
				Game.maxCountedUpgrades++;
			}

			if (!upgrade.groups.misc) {
				Game.UpgradesNoMisc.push(upgrade);
			}

			if (pool) {
				upgrade.$crateNodes.addClass(pool);
			}

			for (j in upgrade.groups) {
				Game.ArrayPush(Game.UpgradesByGroup, j, upgrade);

				var amount = upgrade.groups[j];
				if (!upgrade.groups.synergy && j in Game.ObjectsByGroup && typeof amount === "number") {
					upgrade.buildingTie = Game.ObjectsByGroup[j];
					upgrade.require = buildRequireFunc;
					upgrade.chain = {
						amount: amount,
						building: upgrade.buildingTie,
						// setArr: [{gameObj: upgrade.buildingTie, amount: amount}, {gameObj: upgrade}],
						require: buildChainRequireFunc.bind(upgrade)
					};
				}
			}

			if (upgrade.pool === "prestige") {
				upgrade.order = upgrade.id;
			}

			if (upgrade.groups.heaven || pool === "prestige" || pool === "prestigeDecor") {
				Game.ArrayPush(Game.UpgradesByGroup, "allHeaven", upgrade);
			}

			if (upgrade.toggleInto) {
				upgrade.$crateNodes.addClass("togglePair");
				upgrade.buyFunc = buyToggleIntoFunc;
			}
		}

		Game.sortByOrderFunc = function(a, b) { return a.order - b.order; };
		Game.UpgradeOrder = Game.UpgradesById.slice(0);
		Game.UpgradeOrder.sort(Game.sortByOrderFunc);
		Game.UpgradesByOrder = Game.UpgradeOrder.slice(0);


		$("[data-upgrade-group]").each(function() {
			var upgrades = Game.UpgradesByGroup[this.dataset.upgradeGroup];
			if (upgrades) {
				for (var i = upgrades.length - 1; i >= 0; i--) {
					upgrades[i].createCrate(this);
				}
			}
		});

		var grandmaSynergyChainRequireFunc = function() {
			var unlock = Game.SpecialGrandmaUnlock;
			var building = this.grandmaBuilding;
			var amount = building.getAmount();
			return (Game.Objects["Grandma"].getAmount() > 0 && !building.blacklistCheckbox.checked &&
				amount < unlock && unlock - amount <= Game.maxChain);
		};

		for (i = Game.UpgradesByGroup.grandmaSynergy.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.grandmaSynergy[i];
			if (upgrade.grandmaBuilding) {
				upgrade.chain = {
					amount: Game.SpecialGrandmaUnlock,
					building: upgrade.grandmaBuilding,
					require: grandmaSynergyChainRequireFunc.bind(upgrade)
				};
			}
		}

		var runFunc = function() { this.bought = Game.season === this.season; };
		requireFunc = function() { return Game.HasUpgrade("Season switcher"); };
		var buyFunc = function(wasBought) {
			if (this.bought) {
				Game.setSeason(this.season);
			} else if (wasBought) {
				Game.setSeason();
			}
		};
		priceFunc = function(uses) {
			if (isNaN(uses)) { uses = Game.seasonUses; }
			var m = 1;
			var godLvl = Game.hasGod("seasons");
			if (godLvl == 1) { m *= 2; } else if (godLvl == 2) { m *= 1.50; } else if (godLvl == 3) { m *= 1.25; }
			// return (Game.seasonTriggerBasePrice * Math.pow(2, uses) * m);
			// return (Game.cookiesPs * 60 * Math.pow(1.5, uses) * m);
			return (Game.seasonTriggerBasePrice + Game.unbuffedCookiesPs * 60 * Math.pow(1.5, uses) * m);
		};

		for (i = Game.UpgradesByGroup.seasonSwitch.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.seasonSwitch[i];
			Game.seasons[upgrade.season] = {
				season: upgrade.season,
				switchUpgrade: upgrade
			};
			upgrade.runFunc = runFunc;
			upgrade.require = requireFunc;
			upgrade.buyFunc = buyFunc;
			upgrade.priceFunc = priceFunc;
		}

		priceFunc = function(santaLevel) {
			if (isNaN(santaLevel)) { santaLevel = Game.Get("santaLevel"); }
			return (Math.pow(3, santaLevel) * 2525);
		};
		for (i = Game.UpgradesByGroup.santaDrop.length - 1; i >= 0; i--) { //scale christmas upgrade prices with santa level
			Game.UpgradesByGroup.santaDrop[i].priceFunc = priceFunc;
		}

		priceFunc = function(eggs) { return Math.pow(2, eggs || Game.GetHowManyEggs()) * 999; };
		for (i = Game.UpgradesByGroup.commonEgg.length - 1; i >= 0; i--) { //scale egg prices to how many eggs you have
			Game.UpgradesByGroup.commonEgg[i].priceFunc = priceFunc;
		}
		priceFunc = function(eggs) { return Math.pow(3, eggs || Game.GetHowManyEggs()) * 999; };
		for (i = Game.UpgradesByGroup.rareEgg.length - 1; i >= 0; i--) {
			Game.UpgradesByGroup.rareEgg[i].priceFunc = priceFunc;
		}

		requireFunc = function() { return Game.Get("AchievementsOwned") / 25 >= this.groups.kitten; };
		for (i = Game.UpgradesByGroup.kitten.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.kitten[i];
			if (typeof upgrade.groups.kitten === "number") {
				upgrade.require = requireFunc;
			}
		}

		priceFunc = function(cost) {
			return function() { return cost * Game.cookiesPs * 60; };
		};
		for (i = Game.UpgradesByGroup.gardenDrop.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.gardenDrop[i];
			upgrade.priceFunc = priceFunc(upgrade.basePrice);
			upgrade.setDescription(upgrade.baseDesc.replace("<q>", "<br>Cost scales with CpS.<q>"));
			upgrade.lasting = true;
		}

		var clickPercentAfterCalcCps = function() {
			this.cpsPrefix = Game.clicksPs ? "Second" : "Click";
			if (Game.cookiesPs && !Game.clicksPs) {
				this.cps = this.cpsObj.cookiesPerClickDiff;
				this.amort = this.cps > 0 ? Math.ceil(this.price / this.cps) : 0;
				this.amortStr = this.amort > 0 ? Game.BeautifyAbbr(this.amort) + " clicks" : "---";
			}
		};

		var clickAfterCalcCps = function() {
			this.cpsPrefix = "Second";
			if (!this.cpsObj.cookiesPsDiff && !Game.clicksPs) {
				this.cpsPrefix = "Click";
				this.cps = this.cpsObj.cookiesPerClickDiff;
				this.amort = this.cps > 0 ? Math.ceil(this.price / this.cps) : 0;
				this.amortStr = this.amort > 0 ? Game.BeautifyAbbr(this.amort) + " clicks" : "---";
			}
		};

		for (i = Game.UpgradesByGroup.click.length - 1; i >= 0; i--) {
			upgrade = Game.UpgradesByGroup.click[i];
			if (upgrade.groups.clickPercent) {
				upgrade.afterCalcCps = clickPercentAfterCalcCps;
			} else {
				upgrade.afterCalcCps = clickAfterCalcCps;
			}
		}

		//#endregion Upgrades


		//#region Achievements

		Game.CountsAsAchievementOwned = function(pool) {
			return pool === "" || pool === "normal";
		};

		Game.Achievement = function(name, desc, icon, properties) {
			this.type = "achievement";
			this.id = Game.AchievementsById.length;
			this.name = name;
			this.icon = icon;
			this.iconCss = Game.getIconCss(icon);
			this.tinyIconStr = Game.getTinyIconStr(this.iconCss);
			this.iconName = this.tinyIconStr + " " + this.name;
			this.pool = "normal";
			this.order = this.id;
			if (order) {
				this.order = order + this.id * 0.001;
			}

			this.setDescription(desc);

			if (properties instanceof Object) {
				$.extend(this, properties);
			}

			this.groups = processGroups(this.groups);

			this.$baseCrate = $('<div class="achievement crate"></div>')
				.css(this.iconCss).attr("data-achievement", this.name);
			this.$baseCrate[0].objTie = this;

			this.$tooltipCrate = this.$baseCrate.clone();
			this.$crateNodes = this.$baseCrate.add(this.$tooltipCrate);

			this.won = false;
			this.tempWon = false;

			Game.Achievements[name] = this;
			Game.AchievementsById.push(this);

			Game.last = this;
		};

		Game.Achievement.prototype.toString = function() {
			return this.name;
		};

		Game.Achievement.prototype.setDescription = function(desc) {
			this.baseDesc = desc;
			this.beautifyDesc = BeautifyInText(desc);
			this.abbrDesc = AbbrInText(desc);
			this.setCurrentDescription();
		};

		Game.Achievement.prototype.setCurrentDescription = function() {
			this.desc = Game.abbrOn ? this.abbrDesc : this.beautifyDesc;
		};

		Game.Achievement.prototype.resetTemp = function() {
			this.tempWon = this.won;
		};

		Game.Achievement.prototype.getWon = function(asNum) {
			var won = Game.predictiveMode ? this.tempWon : this.won;
			return asNum ? Number(won) : Boolean(won);
		};

		Game.Achievement.prototype.setWon = function(toggle, temp) {
			var key = Game.predictiveMode || temp ? "tempWon" : "won";
			toggle = typeof toggle === "undefined" ? !this[key] : Boolean(toggle);
			if (this.require) { toggle = toggle || this.require(); }
			this[key] = toggle;
			if (!Game.predictiveMode) {
				this.tempWon = toggle;
				this.$crateNodes.toggleClass("enabled", toggle);
			}
			return toggle;
		};

		Game.Achievement.prototype.getTooltip = function(crate, update) {
			var mysterious = !this.won && byId("achHideCheck").checked;
			var tags = "";
			if (this.pool === "shadow") {
				tags = makeTag("Shadow Achievement", "#9700cf");
			} else {
				tags = makeTag("Achievement");
			}
			tags += makeTag(this.won ? "Unlocked" : "Locked");

			var $div = $('<div class="crateTooltip achievementTooltip">' +
				'<div class="name">' + (mysterious ? "???" : this.name) + '</div><div class="tags">' + tags + "</div>" +
				'<div class="line"></div><div class="description">' + (mysterious ? "???" : this.desc) + "</div></div>");
			this.$tooltipCrate.prependTo($div);
			$tooltipEle.empty().append($div);

			Game.setTooltip({
				refEle: crate,
				isCrate: true
			}, update);
		};

		var buildTierAchRequireFunc = function() {
			return this.buildingTie.getAmount() >= Game.Tiers[this.tier].achievUnlock;
		};

		Game.TieredAchievement = function(name, desc, buildingName, tier) {
			var achieve = new Game.Achievement(name, desc, Game.GetIcon(buildingName, tier),
				{
					require: buildTierAchRequireFunc,
					groups: Game.Objects[buildingName].groupName
				});
			Game.SetTier(buildingName, tier);
			return achieve;
		};

		Game.ProductionAchievement = function(name, building, tier, q, mult) {
			building = Game.Objects[building];
			var icon = [building.iconColumn, 22];
			var n = 12 + building.id + (mult || 0);
			if (tier == 2) {
				icon[1] = 23;
				n += 7;
			} else if (tier == 3) {
				icon[1] = 24;
				n += 14;
			}
			var pow = Math.pow(10, n);
			var achiev = new Game.Achievement(name,
				"Make <b>" + Game.abbreviateNumber(pow, 0, true) + "</b> cookies just from " + building.plural + "." + (q ? "<q>" + q + "</q>" : ""),
				icon);
			// building.productionAchievs.push({pow: pow, achiev: achiev});
			return achiev;
		};

		Game.thresholdIcons =
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
		Game.BankAchievements = [];
		var bankRequireFunc = function(add) { return Game.getCookiesBaked(add) >= this.threshold; };

		Game.BankAchievement = function(name, desc) {
			var threshold = Math.pow(10, Math.floor(Game.BankAchievements.length * 1.5 + 2));
			if (Game.BankAchievements.length === 0) { threshold = 1; }
			var achieve = new Game.Achievement(name,
				"Bake <b>" + Game.abbreviateNumber(threshold, 0, true) + "</b> cookie" + (threshold === 1 ? "" : "s") + " in one ascension." +
				(desc || ""),
				[Game.thresholdIcons[Game.BankAchievements.length], Game.BankAchievements.length > 23 ? 2 : 5],
				{
					threshold: threshold,
					order: 100 + Game.BankAchievements.length * 0.01,
					groups: "bankAch",
					require: bankRequireFunc
				});
			Game.BankAchievements.push(achieve);
			return achieve;
		};

		Game.CpsAchievements = [];
		var cpsRequireFunc = function(cps) {
			if (isNaN(cps)) { cps = Game.Get("cookiesPs"); }
			return cps >= this.threshold;
		};
		Game.CpsAchievement = function(name, desc) {
			var threshold = Math.pow(10, Math.floor(Game.CpsAchievements.length * 1.2));
			var achieve = new Game.Achievement(name,
				"Bake <b>" + Game.abbreviateNumber(threshold, 0, true) + "</b> cookie" + (threshold == 1 ? "" : "s") + " per second." + (desc || ""),
				[Game.thresholdIcons[Game.CpsAchievements.length], Game.CpsAchievements.length > 23 ? 2 : 5],
				{
					threshold: threshold,
					order: 200 + Game.CpsAchievements.length * 0.01,
					groups: "cpsAch",
					require: cpsRequireFunc
				});
			Game.CpsAchievements.push(achieve);
			return achieve;
		};


		//define Achievements
		order = 0;
		Game.BankAchievement("Wake and bake");
		Game.BankAchievement("Making some dough");
		Game.BankAchievement("So baked right now");
		Game.BankAchievement("Fledgling bakery");
		Game.BankAchievement("Affluent bakery");
		Game.BankAchievement("World-famous bakery");
		Game.BankAchievement("Cosmic bakery");
		Game.BankAchievement("Galactic bakery");
		Game.BankAchievement("Universal bakery");
		Game.BankAchievement("Timeless bakery");
		Game.BankAchievement("Infinite bakery");
		Game.BankAchievement("Immortal bakery");
		Game.BankAchievement("Don't stop me now");
		Game.BankAchievement("You can stop now");
		Game.BankAchievement("Cookies all the way down");
		Game.BankAchievement("Overdose");

		Game.CpsAchievement("Casual baking");
		Game.CpsAchievement("Hardcore baking");
		Game.CpsAchievement("Steady tasty stream");
		Game.CpsAchievement("Cookie monster");
		Game.CpsAchievement("Mass producer");
		Game.CpsAchievement("Cookie vortex");
		Game.CpsAchievement("Cookie pulsar");
		Game.CpsAchievement("Cookie quasar");
		Game.CpsAchievement("Oh hey, you're still here");
		Game.CpsAchievement("Let's never bake again");

		order = 30010;
		new Game.Achievement("Sacrifice",
			"Ascend with <b>1 million</b> cookies baked.<q>Easy come, easy go.</q>",
			[11, 6]);
		new Game.Achievement("Oblivion",
			"Ascend with <b>1 billion</b> cookies baked.<q>Back to square one.</q>",
			[11, 6]);
		new Game.Achievement("From scratch",
			"Ascend with <b>1 trillion</b> cookies baked.<q>It's been fun.</q>",
			[11, 6]);

		order = 11010;
		new Game.Achievement("Neverclick",
			"Make <b>1 million</b> cookies by only having clicked <b>15 times</b>.",
			[12, 0]);
		order = 1000;
		new Game.Achievement("Clicktastic",
			"Make <b>1,000</b> cookies from clicking.",
			[11, 0]);
		new Game.Achievement("Clickathlon",
			"Make <b>100,000</b> cookies from clicking.",
			[11, 1]);
		new Game.Achievement("Clickolympics",
			"Make <b>10,000,000</b> cookies from clicking.",
			[11, 2]);
		new Game.Achievement("Clickorama",
			"Make <b>1,000,000,000</b> cookies from clicking.",
			[11, 13]);

		order = 1050;
		new Game.Achievement("Click",
			"Have <b>1</b> cursor.",
			[0, 0], {groups: "cursor:1"});
		new Game.Achievement("Double-click",
			"Have <b>2</b> cursors.",
			[0, 6], {groups: "cursor:2"});
		new Game.Achievement("Mouse wheel",
			"Have <b>50</b> cursors.",
			[1, 6], {groups: "cursor:50"});
		new Game.Achievement("Of Mice and Men",
			"Have <b>100</b> cursors.",
			[0, 1], {groups: "cursor:100"});
		new Game.Achievement("The Digital",
			"Have <b>200</b> cursors.",
			[0, 2], {groups: "cursor:200"});

		order = 1100;
		new Game.Achievement("Just wrong",
			"Sell a grandma.<q>I thought you loved me.</q>",
			[10, 9]);
		Game.TieredAchievement("Grandma's cookies",
			"Have <b>1</b> grandma.",
			"Grandma", 1);
		Game.TieredAchievement("Sloppy kisses",
			"Have <b>50</b> grandmas.",
			"Grandma", 2);
		Game.TieredAchievement("Retirement home",
			"Have <b>100</b> grandmas.",
			"Grandma", 3);

		order = 1200;
		Game.TieredAchievement("My first farm",
			"Have <b>1</b> farm.",
			"Farm", 1);
		Game.TieredAchievement("Reap what you sow",
			"Have <b>50</b> farms.",
			"Farm", 2);
		Game.TieredAchievement("Farm ill",
			"Have <b>100</b> farms.",
			"Farm", 3);

		order = 1400;
		Game.TieredAchievement("Production chain",
			"Have <b>1</b> factory.",
			"Factory", 1);
		Game.TieredAchievement("Industrial revolution",
			"Have <b>50</b> factories.",
			"Factory", 2);
		Game.TieredAchievement("Global warming",
			"Have <b>100</b> factories.",
			"Factory", 3);

		order = 1300;
		Game.TieredAchievement("You know the drill",
			"Have <b>1</b> mine.",
			"Mine", 1);
		Game.TieredAchievement("Excavation site",
			"Have <b>50</b> mines.",
			"Mine", 2);
		Game.TieredAchievement("Hollow the planet",
			"Have <b>100</b> mines.",
			"Mine", 3);

		order = 1500;
		Game.TieredAchievement("Expedition",
			"Have <b>1</b> shipment.",
			"Shipment", 1);
		Game.TieredAchievement("Galactic highway",
			"Have <b>50</b> shipments.",
			"Shipment", 2);
		Game.TieredAchievement("Far far away",
			"Have <b>100</b> shipments.",
			"Shipment", 3);

		order = 1600;
		Game.TieredAchievement("Transmutation",
			"Have <b>1</b> alchemy lab.",
			"Alchemy lab", 1);
		Game.TieredAchievement("Transmogrification",
			"Have <b>50</b> alchemy labs.",
			"Alchemy lab", 2);
		Game.TieredAchievement("Gold member",
			"Have <b>100</b> alchemy labs.",
			"Alchemy lab", 3);

		order = 1700;
		Game.TieredAchievement("A whole new world",
			"Have <b>1</b> portal.",
			"Portal", 1);
		Game.TieredAchievement("Now you're thinking",
			"Have <b>50</b> portals.",
			"Portal", 2);
		Game.TieredAchievement("Dimensional shift",
			"Have <b>100</b> portals.",
			"Portal", 3);

		order = 1800;
		Game.TieredAchievement("Time warp",
			"Have <b>1</b> time machine.",
			"Time machine", 1);
		Game.TieredAchievement("Alternate timeline",
			"Have <b>50</b> time machines.",
			"Time machine", 2);
		Game.TieredAchievement("Rewriting history",
			"Have <b>100</b> time machines.",
			"Time machine", 3);

		order = 7000;
		new Game.Achievement("One with everything",
			"Have <b>at least 1</b> of every building.",
			[2, 7], {require: getNumAllObjectsRequireFunc(1)});
		new Game.Achievement("Mathematician",
			"Have at least <b>1 of the most expensive object, 2 of the second-most expensive, 4 of the next</b> and so on (capped at 128).",
			[23, 12], {
				require: function() {
					var m = 1;
					for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
						if (Game.ObjectsById[i].getAmount() < m) { return false; }
						m = Math.min(m * 2, 128);
					}
					return true;
				}
			});
		new Game.Achievement("Base 10",
			"Have at least <b>10 of the most expensive object, 20 of the second-most expensive, 30 of the next</b> and so on.",
			[23, 12], {
				require: function() {
					var m = 10;
					for (var i = Game.ObjectsById.length - 1; i >= 0; i--) {
						if (Game.ObjectsById[i].getAmount() < m) { return false; }
						m += 10;
					}
					return true;
				}
			});

		order = 10000;
		new Game.Achievement("Golden cookie",
			"Click a <b>golden cookie</b>.",
			[10, 14]);
		new Game.Achievement("Lucky cookie",
			"Click <b>7 golden cookies</b>.",
			[22, 6]);
		new Game.Achievement("A stroke of luck",
			"Click <b>27 golden cookies</b>.",
			[23, 6]);

		order = 30200;
		new Game.Achievement("Cheated cookies taste awful",
			"Hack in some cookies.",
			[10, 6], {pool: "shadow"});
		order = 11010;
		new Game.Achievement("Uncanny clicker",
			"Click really, really fast.<q>Well I'll be!</q>",
			[12, 0]);

		order = 5000;
		new Game.Achievement("Builder",
			"Own <b>100</b> buildings.",
			[2, 6], {require: function() { return Game.Get("ObjectsOwned") >= 100; }});
		new Game.Achievement("Architect",
			"Own <b>500</b> buildings.",
			[3, 6], {require: function() { return Game.Get("ObjectsOwned") >= 500; }});
		order = 6000;
		new Game.Achievement("Enhancer",
			"Purchase <b>20</b> upgrades.",
			[9, 0], {require: function() { return Game.Get("UpgradesOwned") >= 20; }});
		new Game.Achievement("Augmenter",
			"Purchase <b>50</b> upgrades.",
			[9, 1], {require: function() { return Game.Get("UpgradesOwned") >= 50; }});

		order = 11000;
		new Game.Achievement("Cookie-dunker",
			"Dunk the cookie.<q>You did it!</q>",
			[1, 8]);

		order = 10000;
		new Game.Achievement("Fortune",
			"Click <b>77 golden cookies</b>.<q>You should really go to bed.</q>",
			[24, 6]);
		order = 31000;
		new Game.Achievement("True Neverclick",
			"Make <b>1 million</b> cookies with <b>no</b> cookie clicks.<q>This kinda defeats the whole purpose, doesn't it?</q>",
			[12, 0], {pool: "shadow"});

		order = 20000;
		new Game.Achievement("Elder nap",
			"Appease the grandmatriarchs at least <b>once</b>.<q>we<br>are<br>eternal</q>",
			[8, 9]);
		new Game.Achievement("Elder slumber",
			"Appease the grandmatriarchs at least <b>5 times</b>.<q>our mind<br>outlives<br>the universe</q>",
			[8, 9]);

		order = 1150;
		new Game.Achievement("Elder",
			"Own at least <b>7</b> grandma types.",
			[10, 9], {
				require: function() {
					var list = Game.UpgradesByGroup.grandmaSynergy;
					return Game.countUpgradesByGroup(list, 7) >= 7;
				}
			});

		order = 20000;
		new Game.Achievement("Elder calm",
			"Declare a covenant with the grandmatriarchs.<q>we<br>have<br>fed</q>",
			[8, 9]);

		order = 5000;
		new Game.Achievement("Engineer",
			"Own <b>1000</b> buildings.",
			[4, 6], {require: function() { return Game.Get("ObjectsOwned") >= 1000; }});

		order = 10000;
		new Game.Achievement("Leprechaun",
			"Click <b>777 golden cookies</b>.",
			[25, 6]);
		new Game.Achievement("Black cat's paw",
			"Click <b>7777 golden cookies</b>.",
			[26, 6]);

		order = 30050;
		new Game.Achievement("Nihilism",
			"Ascend with <b>1 quadrillion</b> cookies baked.<q>There are many things<br>that need to be erased</q>",
			[11, 7]);

		order = 1900;
		Game.TieredAchievement("Antibatter",
			"Have <b>1</b> antimatter condenser.",
			"Antimatter condenser", 1);
		Game.TieredAchievement("Quirky quarks",
			"Have <b>50</b> antimatter condensers.",
			"Antimatter condenser", 2);
		Game.TieredAchievement("It does matter!",
			"Have <b>100</b> antimatter condensers.",
			"Antimatter condenser", 3);

		order = 6000;
		new Game.Achievement("Upgrader",
			"Purchase <b>100</b> upgrades.",
			[9, 2], {require: function() { return Game.Get("UpgradesOwned") >= 100; }});

		order = 7000;
		new Game.Achievement("Centennial",
			"Have at least <b>100 of everything</b>.",
			[6, 6], {require: getNumAllObjectsRequireFunc(100)});

		order = 30500;
		new Game.Achievement("Hardcore",
			"Get to <b>1 billion</b> cookies baked with <b>no upgrades purchased</b>.",
			[12, 6]);

		order = 30600;
		new Game.Achievement("Speed baking I",
			"Get to <b>1 million</b> cookies baked in <b>35 minutes</b>.",
			[12, 5], {pool: "shadow"});
		new Game.Achievement("Speed baking II",
			"Get to <b>1 million</b> cookies baked in <b>25 minutes</b>.",
			[13, 5], {pool: "shadow"});
		new Game.Achievement("Speed baking III",
			"Get to <b>1 million</b> cookies baked in <b>15 minutes</b>.",
			[14, 5], {pool: "shadow"});

		order = 61000;
		new Game.Achievement("Getting even with the oven",
			"Defeat the <b>Sentient Furnace</b> in the factory dungeons.",
			[12, 7], {pool: "dungeon"});
		new Game.Achievement("Now this is pod-smashing",
			"Defeat the <b>Ascended Baking Pod</b> in the factory dungeons.",
			[12, 7], {pool: "dungeon"});
		new Game.Achievement("Chirped out",
			"Find and defeat <b>Chirpy</b>, the dysfunctionning alarm bot.",
			[13, 7], {pool: "dungeon"});
		new Game.Achievement("Follow the white rabbit",
			"Find and defeat the elusive <b>sugar bunny</b>.",
			[14, 7], {pool: "dungeon"});

		order = 1000;
		new Game.Achievement("Clickasmic",
			"Make <b>100,000,000,000</b> cookies from clicking.",
			[11, 14]);

		order = 1100;
		Game.TieredAchievement("Friend of the ancients",
			"Have <b>150</b> grandmas.",
			"Grandma", 4);
		Game.TieredAchievement("Ruler of the ancients",
			"Have <b>200</b> grandmas.",
			"Grandma", 5);

		order = 32000;
		new Game.Achievement("Wholesome",
			"Unlock <b>100%</b> of your heavenly chips power.",
			[15, 7], {
				require: function() {
					if (!Game.prestige || Game.ascensionMode === 1) {
						return false;
					}
					var list = Game.UpgradesByGroup.heaven;
					return Game.countUpgradesByGroup(list) >= list.length;
				}
			});

		order = 33000;
		new Game.Achievement("Just plain lucky",
			"You have <b>1 chance in 500,000</b> every second of earning this achievement.",
			[15, 6], {pool: "shadow"});

		order = 21000;
		new Game.Achievement("Itchscratcher",
			"Burst <b>1 wrinkler</b>.",
			[19, 8]);
		new Game.Achievement("Wrinklesquisher",
			"Burst <b>50 wrinklers</b>.",
			[19, 8]);
		new Game.Achievement("Moistburster",
			"Burst <b>200 wrinklers</b>.",
			[19, 8]);

		order = 22000;
		new Game.Achievement("Spooky cookies",
			'Unlock <b>every Halloween-themed cookie</b>.<div class="line"></div>Owning this achievement makes Halloween-themed cookies drop more frequently in future playthroughs.',
			[12, 8], {
				require: function() {
					var list = Game.UpgradesByGroup.halloweenAch;
					return Game.countUpgradesByGroup(list) >= list.length;
				}
			});

		order = 22100;
		new Game.Achievement("Coming to town",
			"Reach <b>Santa's 7th form</b>.",
			[18, 9], {require: function() { return Game.Get("santaLevel") >= 7; }});
		new Game.Achievement("All hail Santa",
			"Reach <b>Santa's final form</b>.",
			[19, 10], {require: function() { return Game.Get("santaLevel") >= Game.santaMax; }});
		new Game.Achievement("Let it snow",
			'Unlock <b>every Christmas-themed cookie</b>.<div class="line"></div>Owning this achievement makes Christmas-themed cookies drop more frequently in future playthroughs.',
			[19, 9], {
				require: function() {
					var list = Game.UpgradesByGroup.christmasAch;
					return Game.countUpgradesByGroup(list) >= list.length;
				}
			});
		new Game.Achievement("Oh deer",
			"Pop <b>1 reindeer</b>.",
			[12, 9]);
		new Game.Achievement("Sleigh of hand",
			"Pop <b>50 reindeer</b>.",
			[12, 9]);
		new Game.Achievement("Reindeer sleigher",
			"Pop <b>200 reindeer</b>.",
			[12, 9]);

		order = 1200;
		Game.TieredAchievement("Perfected agriculture",
			"Have <b>150</b> farms.",
			"Farm", 4);
		order = 1400;
		Game.TieredAchievement("Ultimate automation",
			"Have <b>150</b> factories.",
			"Factory", 4);
		order = 1300;
		Game.TieredAchievement("Can you dig it",
			"Have <b>150</b> mines.",
			"Mine", 4);
		order = 1500;
		Game.TieredAchievement("Type II civilization",
			"Have <b>150</b> shipments.",
			"Shipment", 4);
		order = 1600;
		Game.TieredAchievement("Gild wars",
			"Have <b>150</b> alchemy labs.",
			"Alchemy lab", 4);
		order = 1700;
		Game.TieredAchievement("Brain-split",
			"Have <b>150</b> portals.",
			"Portal", 4);
		order = 1800;
		Game.TieredAchievement("Time duke",
			"Have <b>150</b> time machines.",
			"Time machine", 4);
		order = 1900;
		Game.TieredAchievement("Molecular maestro",
			"Have <b>150</b> antimatter condensers.",
			"Antimatter condenser", 4);

		order = 2000;
		Game.TieredAchievement("Lone photon",
			"Have <b>1</b> prism.",
			"Prism", 1);
		Game.TieredAchievement("Dazzling glimmer",
			"Have <b>50</b> prisms.",
			"Prism", 2);
		Game.TieredAchievement("Blinding flash",
			"Have <b>100</b> prisms.",
			"Prism", 3);
		Game.TieredAchievement("Unending glow",
			"Have <b>150</b> prisms.",
			"Prism", 4);

		order = 5000;
		new Game.Achievement("Lord of Constructs",
			"Own <b>2000</b> buildings.<q>He saw the vast plains stretching ahead of him, and he said : let there be civilization.</q>",
			[5, 6], {require: function() { return Game.Get("ObjectsOwned") >= 2000; }});
		order = 6000;
		new Game.Achievement("Lord of Progress",
			"Purchase <b>200</b> upgrades.<q>One can always do better. But should you?</q>",
			[9, 14], {require: function() { return Game.Get("UpgradesOwned") >= 200; }});
		order = 7002;
		new Game.Achievement("Bicentennial",
			"Have at least <b>200 of everything</b>.<q>You crazy person.</q>",
			[8, 6], {require: getNumAllObjectsRequireFunc(200)});

		order = 22300;
		new Game.Achievement("Lovely cookies",
			"Unlock <b>every Valentine-themed cookie</b>.",
			[20, 3], {
				require: function() {
					var list = Game.UpgradesByGroup.valentinesAch;
					return Game.countUpgradesByGroup(list) >= list.length;
				}
			});

		order = 7001;
		new Game.Achievement("Centennial and a half",
			"Have at least <b>150 of everything</b>.",
			[7, 6], {require: getNumAllObjectsRequireFunc(150)});

		order = 11000;
		new Game.Achievement("Tiny cookie",
			"Click the tiny cookie.<q>These aren't the cookies<br>you're clicking for.</q>",
			[0, 5]);

		order = 400000;
		new Game.Achievement("You win a cookie",
			"This is for baking 10 trillion cookies and making it on the local news.<q>We're all so proud of you.</q>",
			[10, 0], {
				require: bankRequireFunc,
				threshold: 10000000000000
			});

		order = 1070;
		Game.ProductionAchievement("Click delegator", "Cursor", 1, 0, 7);
		order = 1120;
		Game.ProductionAchievement("Gushing grannies", "Grandma", 1, 0, 6);
		order = 1220;
		Game.ProductionAchievement("I hate manure", "Farm", 1);
		order = 1320;
		Game.ProductionAchievement("Never dig down", "Mine", 1);
		order = 1420;
		Game.ProductionAchievement("The incredible machine", "Factory", 1);
		order = 1520;
		Game.ProductionAchievement("And beyond", "Shipment", 1);
		order = 1620;
		Game.ProductionAchievement("Magnum Opus", "Alchemy lab", 1);
		order = 1720;
		Game.ProductionAchievement("With strange eons", "Portal", 1);
		order = 1820;
		Game.ProductionAchievement("Spacetime jigamaroo", "Time machine", 1);
		order = 1920;
		Game.ProductionAchievement("Supermassive", "Antimatter condenser", 1);
		order = 2020;
		Game.ProductionAchievement("Praise the sun", "Prism", 1);

		order = 1000;
		new Game.Achievement("Clickageddon",
			"Make <b>10,000,000,000,000</b> cookies from clicking.",
			[11, 15]);
		new Game.Achievement("Clicknarok",
			"Make <b>1,000,000,000,000,000</b> cookies from clicking.",
			[11, 16]);

		order = 1050;
		new Game.Achievement("Extreme polydactyly",
			"Have <b>300</b> cursors.",
			[0, 13], {groups: "cursor:300"});
		new Game.Achievement("Dr. T",
			"Have <b>400</b> cursors.",
			[0, 14], {groups: "cursor:400"});

		order = 1100;
		Game.TieredAchievement("The old never bothered me anyway",
			"Have <b>250</b> grandmas.",
			"Grandma", 6);
		order = 1200;
		Game.TieredAchievement("Homegrown",
			"Have <b>200</b> farms.",
			"Farm", 5);
		order = 1400;
		Game.TieredAchievement("Technocracy",
			"Have <b>200</b> factories.",
			"Factory", 5);
		order = 1300;
		Game.TieredAchievement("The center of the Earth",
			"Have <b>200</b> mines.",
			"Mine", 5);
		order = 1500;
		Game.TieredAchievement("We come in peace",
			"Have <b>200</b> shipments.",
			"Shipment", 5);
		order = 1600;
		Game.TieredAchievement("The secrets of the universe",
			"Have <b>200</b> alchemy labs.",
			"Alchemy lab", 5);
		order = 1700;
		Game.TieredAchievement("Realm of the Mad God",
			"Have <b>200</b> portals.",
			"Portal", 5);
		order = 1800;
		Game.TieredAchievement("Forever and ever",
			"Have <b>200</b> time machines.",
			"Time machine", 5);
		order = 1900;
		Game.TieredAchievement("Walk the planck",
			"Have <b>200</b> antimatter condensers.",
			"Antimatter condenser", 5);
		order = 2000;
		Game.TieredAchievement("Rise and shine",
			"Have <b>200</b> prisms.",
			"Prism", 5);

		order = 30200;
		new Game.Achievement("God complex",
			'Name yourself <b>Orteil</b>.<div class="warning">Note : usurpers incur a -1% CpS penalty until they rename themselves something else.</div><q>But that\'s not you, is it?</q>',
			[17, 5], {
				pool: "shadow",
				require: function() { return Game.bakeryNameLowerCase === "orteil"; }
			});
		new Game.Achievement("Third-party",
			"Use an <b>add-on</b>.<q>Some find vanilla to be the most boring flavor.</q>",
			[16, 5], {pool: "shadow"});

		order = 30050;
		new Game.Achievement("Dematerialize",
			"Ascend with <b>1 quintillion</b> cookies baked.<q>Presto!<br>...where'd the cookies go?</q>",
			[11, 7]);
		new Game.Achievement("Nil zero zilch",
			"Ascend with <b>1 sextillion</b> cookies baked.<q>To summarize : really not very much at all.</q>",
			[11, 7]);
		new Game.Achievement("Transcendence",
			"Ascend with <b>1 septillion</b> cookies baked.<q>Your cookies are now on a higher plane of being.</q>",
			[11, 8]);
		new Game.Achievement("Obliterate",
			"Ascend with <b>1 octillion</b> cookies baked.<q>Resistance is futile, albeit entertaining.</q>",
			[11, 8]);
		new Game.Achievement("Negative void",
			"Ascend with <b>1 nonillion</b> cookies baked.<q>You now have so few cookies that it's almost like you have a negative amount of them.</q>",
			[11, 8]);

		order = 22400;
		new Game.Achievement("The hunt is on",
			"Unlock <b>1 egg</b>.",
			[1, 12], {require: function() { return Game.GetHowManyEggs(1, true) >= 1; }});
		new Game.Achievement("Egging on",
			"Unlock <b>7 eggs</b>.",
			[4, 12], {require: function() { return Game.GetHowManyEggs(7, true) >= 7; }});
		new Game.Achievement("Mass Easteria",
			"Unlock <b>14 eggs</b>.",
			[7, 12], {require: function() { return Game.GetHowManyEggs(14, true) >= 14; }});
		new Game.Achievement("Hide & seek champion",
			'Unlock <b>all the eggs</b>.<div class="line"></div>Owning this achievement makes eggs drop more frequently in future playthroughs.',
			[13, 12], {require: function() { return Game.GetHowManyEggs(20, true) >= 20; }});

		order = 11000;
		new Game.Achievement("What's in a name",
			"Give your bakery a name.",
			[15, 9]);

		order = 1425;
		Game.TieredAchievement("Pretty penny",
			"Have <b>1</b> bank.",
			"Bank", 1);
		Game.TieredAchievement("Fit the bill",
			"Have <b>50</b> banks.",
			"Bank", 2);
		Game.TieredAchievement("A loan in the dark",
			"Have <b>100</b> banks.",
			"Bank", 3);
		Game.TieredAchievement("Need for greed",
			"Have <b>150</b> banks.",
			"Bank", 4);
		Game.TieredAchievement("It's the economy, stupid",
			"Have <b>200</b> banks.",
			"Bank", 5);
		order = 1450;
		Game.TieredAchievement("Your time to shrine",
			"Have <b>1</b> temple.",
			"Temple", 1);
		Game.TieredAchievement("Shady sect",
			"Have <b>50</b> temples.",
			"Temple", 2);
		Game.TieredAchievement("New-age cult",
			"Have <b>100</b> temples.",
			"Temple", 3);
		Game.TieredAchievement("Organized religion",
			"Have <b>150</b> temples.",
			"Temple", 4);
		Game.TieredAchievement("Fanaticism",
			"Have <b>200</b> temples.",
			"Temple", 5);
		order = 1475;
		Game.TieredAchievement("Bewitched",
			"Have <b>1</b> wizard tower.",
			"Wizard tower", 1);
		Game.TieredAchievement("The sorcerer's apprentice",
			"Have <b>50</b> wizard towers.",
			"Wizard tower", 2);
		Game.TieredAchievement("Charms and enchantments",
			"Have <b>100</b> wizard towers.",
			"Wizard tower", 3);
		Game.TieredAchievement("Curses and maledictions",
			"Have <b>150</b> wizard towers.",
			"Wizard tower", 4);
		Game.TieredAchievement("Magic kingdom",
			"Have <b>200</b> wizard towers.",
			"Wizard tower", 5);

		order = 1445;
		Game.ProductionAchievement("Vested interest", "Bank", 1);
		order = 1470;
		Game.ProductionAchievement("New world order", "Temple", 1);
		order = 1495;
		Game.ProductionAchievement("Hocus pocus", "Wizard tower", 1);

		order = 1070;
		Game.ProductionAchievement("Finger clickin' good", "Cursor", 2, 0, 7);
		order = 1120;
		Game.ProductionAchievement("Panic at the bingo", "Grandma", 2, 0, 6);
		order = 1220;
		Game.ProductionAchievement("Rake in the dough", "Farm", 2);
		order = 1320;
		Game.ProductionAchievement("Quarry on", "Mine", 2);
		order = 1420;
		Game.ProductionAchievement("Yes I love technology", "Factory", 2);
		order = 1445;
		Game.ProductionAchievement("Paid in full", "Bank", 2);
		order = 1470;
		Game.ProductionAchievement("Church of Cookiology", "Temple", 2);
		order = 1495;
		Game.ProductionAchievement("Too many rabbits, not enough hats", "Wizard tower", 2);
		order = 1520;
		Game.ProductionAchievement("The most precious cargo", "Shipment", 2);
		order = 1620;
		Game.ProductionAchievement("The Aureate", "Alchemy lab", 2);
		order = 1720;
		Game.ProductionAchievement("Ever more hideous", "Portal", 2);
		order = 1820;
		Game.ProductionAchievement("Be kind, rewind", "Time machine", 2);
		order = 1920;
		Game.ProductionAchievement("Infinitesimal", "Antimatter condenser", 2);
		order = 2020;
		Game.ProductionAchievement("A still more glorious dawn", "Prism", 2);

		order = 30000;
		new Game.Achievement("Rebirth",
			"Ascend at least once.",
			[21, 6]);

		order = 11000;
		new Game.Achievement("Here you go",
			"Click this achievement's slot.<q>All you had to do was ask.</q>",
			[1, 7]);

		order = 30000;
		new Game.Achievement("Resurrection",
			"Ascend <b>10 times</b>.",
			[21, 6]);
		new Game.Achievement("Reincarnation",
			"Ascend <b>100 times</b>.",
			[21, 6]);
		new Game.Achievement("Endless cycle",
			"Ascend <b>1000 times</b>.<q>Oh hey, it's you again.</q>",
			[2, 7], {pool: "shadow"});

		order = 1100;
		Game.TieredAchievement("The agemaster",
			"Have <b>300</b> grandmas.",
			"Grandma", 7);
		Game.TieredAchievement("To oldly go",
			"Have <b>350</b> grandmas.",
			"Grandma", 8);

		order = 1200;
		Game.TieredAchievement("Gardener extraordinaire",
			"Have <b>250</b> farms.",
			"Farm", 6);
		order = 1300;
		Game.TieredAchievement("Tectonic ambassador",
			"Have <b>250</b> mines.",
			"Mine", 6);
		order = 1400;
		Game.TieredAchievement("Rise of the machines",
			"Have <b>250</b> factories.",
			"Factory", 6);
		order = 1425;
		Game.TieredAchievement("Acquire currency",
			"Have <b>250</b> banks.",
			"Bank", 6);
		order = 1450;
		Game.TieredAchievement("Zealotry",
			"Have <b>250</b> temples.",
			"Temple", 6);
		order = 1475;
		Game.TieredAchievement("The wizarding world",
			"Have <b>250</b> wizard towers.",
			"Wizard tower", 6);
		order = 1500;
		Game.TieredAchievement("Parsec-masher",
			"Have <b>250</b> shipments.",
			"Shipment", 6);
		order = 1600;
		Game.TieredAchievement("The work of a lifetime",
			"Have <b>250</b> alchemy labs.",
			"Alchemy lab", 6);
		order = 1700;
		Game.TieredAchievement("A place lost in time",
			"Have <b>250</b> portals.",
			"Portal", 6);
		order = 1800;
		Game.TieredAchievement("Heat death",
			"Have <b>250</b> time machines.",
			"Time machine", 6);
		order = 1900;
		Game.TieredAchievement("Microcosm",
			"Have <b>250</b> antimatter condensers.",
			"Antimatter condenser", 6);
		order = 2000;
		Game.TieredAchievement("Bright future",
			"Have <b>250</b> prisms.",
			"Prism", 6);

		order = 25000;
		new Game.Achievement("Here be dragon",
			"Complete your <b>dragon's training</b>.",
			[21, 12], {require: function() { return Game.HasUpgrade("A crumbly egg") && Game.dragonLevel >= Game.dragonMax; }});

		Game.BankAchievement("How?");
		Game.BankAchievement("The land of milk and cookies");
		Game.BankAchievement("He who controls the cookies controls the universe",
			"<q>The milk must flow!</q>");
		Game.BankAchievement("Tonight on Hoarders");
		Game.BankAchievement("Are you gonna eat all that?");
		Game.BankAchievement("We're gonna need a bigger bakery");
		Game.BankAchievement("In the mouth of madness",
			"<q>A cookie is just what we tell each other it is.</q>");
		Game.BankAchievement(
			'Brought to you by the letter <div style="display:inline-block;background:url(img/money.png);width:16px;height:16px;"></div>');

		Game.CpsAchievement("A world filled with cookies");
		Game.CpsAchievement("When this baby hits " + Game.abbreviateNumber(10000000000000 * 60 * 60, 0, true) + " cookies per hour");
		Game.CpsAchievement("Fast and delicious");
		Game.CpsAchievement("Cookiehertz : a really, really tasty hertz",
			"<q>Tastier than a hertz donut, anyway.</q>");
		Game.CpsAchievement("Woops, you solved world hunger");
		Game.CpsAchievement("Turbopuns",
			'<q>Mother Nature will be like "slowwwww dowwwwwn".</q>');
		Game.CpsAchievement("Faster menner");
		Game.CpsAchievement("And yet you're still hungry");
		Game.CpsAchievement("The Abakening");
		Game.CpsAchievement(
			"There's really no hard limit to how long these achievement names can be and to be quite honest I'm rather curious to see how far we can go.<br>Adolphus W. Green (1844–1917) started as the Principal of the Groton School in 1864. By 1865, he became second assistant librarian at the New York Mercantile Library; from 1867 to 1869, he was promoted to full librarian. From 1869 to 1873, he worked for Evarts, Southmayd & Choate, a law firm co-founded by William M. Evarts, Charles Ferdinand Southmayd and Joseph Hodges Choate. He was admitted to the New York State Bar Association in 1873.<br>Anyway, how's your day been?");
		Game.CpsAchievement("Fast",
			"<q>Wow!</q>");

		order = 7002;
		new Game.Achievement("Bicentennial and a half",
			"Have at least <b>250 of everything</b>.<q>Keep on truckin'.</q>",
			[9, 6], {require: getNumAllObjectsRequireFunc(250)});

		order = 11000;
		new Game.Achievement("Tabloid addiction",
			"Click on the news ticker <b>50 times</b>.<q>Page 6 : Mad individual clicks on picture of pastry in a futile attempt to escape boredom!<br>Also page 6 : British parliament ate my baby!</q>",
			[27, 7]);

		order = 1000;
		new Game.Achievement("Clickastrophe",
			"Make <b>100,000,000,000,000,000</b> cookies from clicking.",
			[11, 17]);
		new Game.Achievement("Clickataclysm",
			"Make <b>10,000,000,000,000,000,000</b> cookies from clicking.",
			[11, 18]);

		order = 1050;
		new Game.Achievement("Thumbs, phalanges, metacarpals",
			"Have <b>500</b> cursors.<q>& KNUCKLES</q>",
			[0, 15], {groups: "cursor:500"});

		order = 6000;
		new Game.Achievement("Polymath",
			"Own <b>300</b> upgrades and <b>3000</b> buildings.<q>Excellence doesn't happen overnight - it usually takes a good couple days.</q>",
			[29, 7], {require: function() { return Game.Get("ObjectsOwned") >= 3000 && Game.Get("UpgradesOwned") >= 300; }});

		order = 6005;
		new Game.Achievement("The elder scrolls",
			"Own a combined <b>777</b> grandmas and cursors.<q>Let me guess. Someone stole your cookie.</q>",
			[10, 9], {require: function() { return Game.Objects["Cursor"].getAmount() + Game.Objects["Grandma"].getAmount() >= 777; }});

		order = 30050;
		new Game.Achievement("To crumbs, you say?",
			"Ascend with <b>1 decillion</b> cookies baked.<q>Very well then.</q>",
			[29, 6]);

		order = 1200;
		Game.TieredAchievement("Seedy business",
			"Have <b>300</b> farms.",
			"Farm", 7);
		order = 1300;
		Game.TieredAchievement("Freak fracking",
			"Have <b>300</b> mines.",
			"Mine", 7);
		order = 1400;
		Game.TieredAchievement("Modern times",
			"Have <b>300</b> factories.",
			"Factory", 7);
		order = 1425;
		Game.TieredAchievement("The nerve of war",
			"Have <b>300</b> banks.",
			"Bank", 7);
		order = 1450;
		Game.TieredAchievement("Wololo",
			"Have <b>300</b> temples.",
			"Temple", 7);
		order = 1475;
		Game.TieredAchievement("And now for my next trick, I'll need a volunteer from the audience",
			"Have <b>300</b> wizard towers.",
			"Wizard tower", 7);
		order = 1500;
		Game.TieredAchievement("It's not delivery",
			"Have <b>300</b> shipments.",
			"Shipment", 7);
		order = 1600;
		Game.TieredAchievement("Gold, Jerry! Gold!",
			"Have <b>300</b> alchemy labs.",
			"Alchemy lab", 7);
		order = 1700;
		Game.TieredAchievement("Forbidden zone",
			"Have <b>300</b> portals.",
			"Portal", 7);
		order = 1800;
		Game.TieredAchievement(
			"cookie clicker forever and forever a hundred years cookie clicker, all day long forever, forever a hundred times, over and over cookie clicker adventures dot com",
			"Have <b>300</b> time machines.",
			"Time machine", 7);
		order = 1900;
		Game.TieredAchievement("Scientists baffled everywhere",
			"Have <b>300</b> antimatter condensers.",
			"Antimatter condenser", 7);
		order = 2000;
		Game.TieredAchievement("Harmony of the spheres",
			"Have <b>300</b> prisms.",
			"Prism", 7);

		order = 35000;
		new Game.Achievement("Last Chance to See",
			"Burst the near-extinct <b>shiny wrinkler</b>.<q>You monster!</q>",
			[24, 12], {pool: "shadow"});

		order = 10000;
		new Game.Achievement("Early bird",
			"Click a golden cookie <b>less than 1 second after it spawns</b>.",
			[10, 14]);
		new Game.Achievement("Fading luck",
			"Click a golden cookie <b>less than 1 second before it dies</b>.",
			[10, 14]);

		order = 22100;
		new Game.Achievement("Eldeer",
			"Pop a reindeer <b>during an elder frenzy</b>.",
			[12, 9]);

		order = 21100;
		new Game.Achievement("Dude, sweet",
			"Harvest <b>7 coalescing sugar lumps</b>.",
			[24, 14]);
		new Game.Achievement("Sugar rush",
			"Harvest <b>30 coalescing sugar lumps</b>.",
			[26, 14]);
		new Game.Achievement("Year's worth of cavities",
			"Harvest <b>365 coalescing sugar lumps</b>.<q>My lumps my lumps my lumps.</q>",
			[29, 14]);
		new Game.Achievement("Hand-picked",
			"Successfully harvest a coalescing sugar lump before it's ripe.",
			[28, 14]);
		new Game.Achievement("Sugar sugar",
			"Harvest a <b>bifurcated sugar lump</b>.",
			[29, 15]);
		new Game.Achievement("All-natural cane sugar",
			"Harvest a <b>golden sugar lump</b>.",
			[29, 16], {pool: "shadow"});
		new Game.Achievement("Sweetmeats",
			"Harvest a <b>meaty sugar lump</b>.",
			[29, 17]);

		order = 7002;
		new Game.Achievement("Tricentennial",
			"Have at least <b>300 of everything</b>.<q>Can't stop, won't stop. Probably should stop, though.</q>",
			[29, 12], {require: getNumAllObjectsRequireFunc(300)});

		Game.CpsAchievement("Knead for speed",
			"<q>How did we not make that one yet?</q>");
		Game.CpsAchievement("Well the cookies start coming and they don't stop coming",
			"<q>Didn't make sense not to click for fun.</q>");
		Game.CpsAchievement("I don't know if you've noticed but all these icons are very slightly off-center");
		Game.CpsAchievement("The proof of the cookie is in the baking",
			"<q>How can you have any cookies if you don't bake your dough?</q>");
		Game.CpsAchievement("If it's worth doing, it's worth overdoing");

		Game.BankAchievement("The dreams in which I'm baking are the best I've ever had");
		Game.BankAchievement("Set for life");

		order = 1200;
		Game.TieredAchievement("You and the beanstalk",
			"Have <b>350</b> farms.",
			"Farm", 8);
		order = 1300;
		Game.TieredAchievement("Romancing the stone",
			"Have <b>350</b> mines.",
			"Mine", 8);
		order = 1400;
		Game.TieredAchievement("Ex machina",
			"Have <b>350</b> factories.",
			"Factory", 8);
		order = 1425;
		Game.TieredAchievement("And I need it now",
			"Have <b>350</b> banks.",
			"Bank", 8);
		order = 1450;
		Game.TieredAchievement("Pray on the weak",
			"Have <b>350</b> temples.",
			"Temple", 8);
		order = 1475;
		Game.TieredAchievement("It's a kind of magic",
			"Have <b>350</b> wizard towers.",
			"Wizard tower", 8);
		order = 1500;
		Game.TieredAchievement("Make it so",
			"Have <b>350</b> shipments.",
			"Shipment", 8);
		order = 1600;
		Game.TieredAchievement("All that glitters is gold",
			"Have <b>350</b> alchemy labs.",
			"Alchemy lab", 8);
		order = 1700;
		Game.TieredAchievement(
			"H̸̷͓̳̳̯̟͕̟͍͍̣͡ḛ̢̦̰̺̮̝͖͖̘̪͉͘͡ ̠̦͕̤̪̝̥̰̠̫̖̣͙̬͘ͅC̨̦̺̩̲̥͉̭͚̜̻̝̣̼͙̮̯̪o̴̡͇̘͎̞̲͇̦̲͞͡m̸̩̺̝̣̹̱͚̬̥̫̳̼̞̘̯͘ͅẹ͇̺̜́̕͢s̶̙̟̱̥̮̯̰̦͓͇͖͖̝͘͘͞",
			"Have <b>350</b> portals.",
			"Portal", 8);
		order = 1800;
		Game.TieredAchievement("Way back then",
			"Have <b>350</b> time machines.",
			"Time machine", 8);
		order = 1900;
		Game.TieredAchievement("Exotic matter",
			"Have <b>350</b> antimatter condensers.",
			"Antimatter condenser", 8);
		order = 2000;
		Game.TieredAchievement("At the end of the tunnel",
			"Have <b>350</b> prisms.",
			"Prism", 8);

		order = 1070;
		Game.ProductionAchievement("Click (starring Adam Sandler)", "Cursor", 3, 0, 7);
		order = 1120;
		Game.ProductionAchievement("Frantiquities", "Grandma", 3, 0, 6);
		order = 1220;
		Game.ProductionAchievement("Overgrowth", "Farm", 3);
		order = 1320;
		Game.ProductionAchievement("Sedimentalism", "Mine", 3);
		order = 1420;
		Game.ProductionAchievement("Labor of love", "Factory", 3);
		order = 1445;
		Game.ProductionAchievement("Reverse funnel system", "Bank", 3);
		order = 1470;
		Game.ProductionAchievement("Thus spoke you", "Temple", 3);
		order = 1495;
		Game.ProductionAchievement("Manafest destiny", "Wizard tower", 3);
		order = 1520;
		Game.ProductionAchievement("Neither snow nor rain nor heat nor gloom of night", "Shipment", 3);
		order = 1620;
		Game.ProductionAchievement("I've got the Midas touch", "Alchemy lab", 3);
		order = 1720;
		Game.ProductionAchievement("Which eternal lie", "Portal", 3);
		order = 1820;
		Game.ProductionAchievement("D&eacute;j&agrave; vu", "Time machine", 3);
		order = 1920;
		Game.ProductionAchievement("Powers of Ten", "Antimatter condenser", 3);
		order = 2020;
		Game.ProductionAchievement("Now the dark days are gone", "Prism", 3);

		order = 1070;
		new Game.Achievement("Freaky jazz hands",
			"Reach level <b>10</b> cursors.",
			[0, 26], {groups: "cursor|level10"});
		order = 1120;
		new Game.Achievement("Methuselah",
			"Reach level <b>10</b> grandmas.",
			[1, 26], {groups: "grandma|level10"});
		order = 1220;
		new Game.Achievement("Huge tracts of land",
			"Reach level <b>10</b> farms.",
			[2, 26], {groups: "farm|level10"});
		order = 1320;
		new Game.Achievement("D-d-d-d-deeper",
			"Reach level <b>10</b> mines.",
			[3, 26], {groups: "mine|level10"});
		order = 1420;
		new Game.Achievement("Patently genius",
			"Reach level <b>10</b> factories.",
			[4, 26], {groups: "factory|level10"});
		order = 1445;
		new Game.Achievement("A capital idea",
			"Reach level <b>10</b> banks.",
			[15, 26], {groups: "bank|level10"});
		order = 1470;
		new Game.Achievement("It belongs in a bakery",
			"Reach level <b>10</b> temples.",
			[16, 26], {groups: "temple|level10"});
		order = 1495;
		new Game.Achievement("Motormouth",
			"Reach level <b>10</b> wizard towers.",
			[17, 26], {groups: "wizardTower|level10"});
		order = 1520;
		new Game.Achievement("Been there done that",
			"Reach level <b>10</b> shipments.",
			[5, 26], {groups: "shipment|level10"});
		order = 1620;
		new Game.Achievement("Phlogisticated substances",
			"Reach level <b>10</b> alchemy labs.",
			[6, 26], {groups: "alchemyLab|level10"});
		order = 1720;
		new Game.Achievement("Bizarro world",
			"Reach level <b>10</b> portals.",
			[7, 26], {groups: "portal|level10"});
		order = 1820;
		new Game.Achievement("The long now",
			"Reach level <b>10</b> time machines.",
			[8, 26], {groups: "timeMachine|level10"});
		order = 1920;
		new Game.Achievement("Chubby hadrons",
			"Reach level <b>10</b> antimatter condensers.",
			[13, 26], {groups: "antimatterCondenser|level10"});
		order = 2020;
		new Game.Achievement("Palettable",
			"Reach level <b>10</b> prisms.",
			[14, 26], {groups: "prism|level10"});

		order = 61470;
		order = 61495;
		new Game.Achievement("Bibbidi-bobbidi-boo",
			"Cast <b>9</b> spells.",
			[21, 11]);
		new Game.Achievement("I'm the wiz",
			"Cast <b>99</b> spells.",
			[22, 11]);
		new Game.Achievement("A wizard is you",
			"Cast <b>999</b> spells.<q>I'm a what?</q>",
			[29, 11]);

		order = 10000;
		new Game.Achievement("Four-leaf cookie",
			"Have <b>4</b> golden cookies simultaneously.<q>Fairly rare, considering cookies don't even have leaves.</q>",
			[27, 6], {pool: "shadow"});

		order = 2100;
		Game.TieredAchievement("Lucked out",
			"Have <b>1</b> chancemaker.",
			"Chancemaker", 1);
		Game.TieredAchievement("What are the odds",
			"Have <b>50</b> chancemakers.",
			"Chancemaker", 2);
		Game.TieredAchievement("Grandma needs a new pair of shoes",
			"Have <b>100</b> chancemakers.",
			"Chancemaker", 3);
		Game.TieredAchievement("Million to one shot, doc",
			"Have <b>150</b> chancemakers.",
			"Chancemaker", 4);
		Game.TieredAchievement("As luck would have it",
			"Have <b>200</b> chancemakers.",
			"Chancemaker", 5);
		Game.TieredAchievement("Ever in your favor",
			"Have <b>250</b> chancemakers.",
			"Chancemaker", 6);
		Game.TieredAchievement("Be a lady",
			"Have <b>300</b> chancemakers.",
			"Chancemaker", 7);
		Game.TieredAchievement("Dicey business",
			"Have <b>350</b> chancemakers.",
			"Chancemaker", 8);

		order = 2120;
		Game.ProductionAchievement("Fingers crossed", "Chancemaker", 1);
		Game.ProductionAchievement("Just a statistic", "Chancemaker", 2);
		Game.ProductionAchievement("Murphy's wild guess", "Chancemaker", 3);

		new Game.Achievement("Let's leaf it at that",
			"Reach level <b>10</b> chancemakers.",
			[19, 26], {groups: "chancemaker|level10"});

		order = 1000;
		new Game.Achievement("The ultimate clickdown",
			"Make <b>1,000,000,000,000,000,000,000</b> cookies from clicking.<q>(of ultimate destiny.)</q>",
			[11, 19]);

		order = 1100;
		Game.TieredAchievement("Aged well",
			"Have <b>400</b> grandmas.",
			"Grandma", 9);
		Game.TieredAchievement("101st birthday",
			"Have <b>450</b> grandmas.",
			"Grandma", 10);
		Game.TieredAchievement("Defense of the ancients",
			"Have <b>500</b> grandmas.",
			"Grandma", 11);
		order = 1200;
		Game.TieredAchievement("Harvest moon",
			"Have <b>400</b> farms.",
			"Farm", 9);
		order = 1300;
		Game.TieredAchievement("Mine?",
			"Have <b>400</b> mines.",
			"Mine", 9);
		order = 1400;
		Game.TieredAchievement("In full gear",
			"Have <b>400</b> factories.",
			"Factory", 9);
		order = 1425;
		Game.TieredAchievement("Treacle tart economics",
			"Have <b>400</b> banks.",
			"Bank", 9);
		order = 1450;
		Game.TieredAchievement("Holy cookies, grandma!",
			"Have <b>400</b> temples.",
			"Temple", 9);
		order = 1475;
		Game.TieredAchievement("The Prestige",
			"Have <b>400</b> wizard towers.<q>(Unrelated to the Cookie Clicker feature of the same name.)</q>",
			"Wizard tower", 9);
		order = 1500;
		Game.TieredAchievement("That's just peanuts to space",
			"Have <b>400</b> shipments.",
			"Shipment", 9);
		order = 1600;
		Game.TieredAchievement("Worth its weight in lead",
			"Have <b>400</b> alchemy labs.",
			"Alchemy lab", 9);
		order = 1700;
		Game.TieredAchievement("What happens in the vortex stays in the vortex",
			"Have <b>400</b> portals.",
			"Portal", 9);
		order = 1800;
		Game.TieredAchievement("Invited to yesterday's party",
			"Have <b>400</b> time machines.",
			"Time machine", 9);
		order = 1900;
		Game.TieredAchievement("Downsizing",
			"Have <b>400</b> antimatter condensers.",
			"Antimatter condenser", 9);
		order = 2000;
		Game.TieredAchievement("My eyes",
			"Have <b>400</b> prisms.",
			"Prism", 9);
		order = 2100;
		Game.TieredAchievement("Maybe a chance in hell, actually",
			"Have <b>400</b> chancemakers.",
			"Chancemaker", 9);

		order = 1200;
		Game.TieredAchievement("Make like a tree",
			"Have <b>450</b> farms.",
			"Farm", 10);
		order = 1300;
		Game.TieredAchievement("Cave story",
			"Have <b>450</b> mines.",
			"Mine", 10);
		order = 1400;
		Game.TieredAchievement("In-cog-neato",
			"Have <b>450</b> factories.",
			"Factory", 10);
		order = 1425;
		Game.TieredAchievement("Save your breath because that's all you've got left",
			"Have <b>450</b> banks.",
			"Bank", 10);
		order = 1450;
		Game.TieredAchievement("Vengeful and almighty",
			"Have <b>450</b> temples.",
			"Temple", 10);
		order = 1475;
		Game.TieredAchievement("Spell it out for you",
			"Have <b>450</b> wizard towers.",
			"Wizard tower", 10);
		order = 1500;
		Game.TieredAchievement("Space space space space space",
			"Have <b>450</b> shipments.<q>It's too far away...</q>",
			"Shipment", 10);
		order = 1600;
		Game.TieredAchievement("Don't get used to yourself, you're gonna have to change",
			"Have <b>450</b> alchemy labs.",
			"Alchemy lab", 10);
		order = 1700;
		Game.TieredAchievement("Objects in the mirror dimension are closer than they appear",
			"Have <b>450</b> portals.",
			"Portal", 10);
		order = 1800;
		Game.TieredAchievement("Groundhog day",
			"Have <b>450</b> time machines.",
			"Time machine", 10);
		order = 1900;
		Game.TieredAchievement("A matter of perspective",
			"Have <b>450</b> antimatter condensers.",
			"Antimatter condenser", 10);
		order = 2000;
		Game.TieredAchievement("Optical illusion",
			"Have <b>450</b> prisms.",
			"Prism", 10);
		order = 2100;
		Game.TieredAchievement("Jackpot",
			"Have <b>450</b> chancemakers.",
			"Chancemaker", 10);

		order = 36000;
		new Game.Achievement("So much to do so much to see",
			"Manage a cookie legacy for <b>at least a year</b>.<q>Thank you so much for playing Cookie Clicker!</q>",
			[23, 11], {pool: "shadow"});

		Game.CpsAchievement("Running with scissors");
		Game.CpsAchievement("Rarefied air");
		Game.CpsAchievement("Push it to the limit");
		Game.CpsAchievement("Green cookies sleep furiously");

		Game.BankAchievement("Panic! at Nabisco");
		Game.BankAchievement("Bursting at the seams");
		Game.BankAchievement("Just about full");
		Game.BankAchievement("Hungry for more");

		order = 1000;
		new Game.Achievement("All the other kids with the pumped up clicks",
			"Make <b>100,000,000,000,000,000,000,000</b> cookies from clicking.",
			[11, 28]);
		new Game.Achievement("One...more...click...",
			"Make <b>10,000,000,000,000,000,000,000,000</b> cookies from clicking.",
			[11, 30]);

		order = 61515;
		new Game.Achievement("Botany enthusiast",
			"Harvest <b>100</b> mature garden plants.",
			[26, 20]);
		new Game.Achievement("Green, aching thumb",
			"Harvest <b>1000</b> mature garden plants.",
			[27, 20]);
		new Game.Achievement("In the garden of Eden (baby)",
			"Fill every tile of the biggest garden plot with plants.<q>Isn't tending to those precious little plants just so rock and/or roll?</q>",
			[28, 20]);

		new Game.Achievement("Keeper of the conservatory",
			"Unlock every garden seed.",
			[25, 20]);
		new Game.Achievement("Seedless to nay",
			'Convert a complete seed log into sugar lumps by sacrificing your garden to the sugar hornets.<div class="line"></div>Owning this achievement makes seeds <b>5% cheaper</b>, plants mature <b>5% sooner</b>, and plant upgrades drop <b>5% more</b>.',
			[29, 20]);

		order = 30050;
		new Game.Achievement("You get nothing",
			"Ascend with <b>1 undecillion</b> cookies baked.<q>Good day sir!</q>",
			[29, 6]);
		new Game.Achievement("Humble rebeginnings",
			"Ascend with <b>1 duodecillion</b> cookies baked.<q>Started from the bottom, now we're here.</q>",
			[29, 6]);
		new Game.Achievement("The end of the world",
			"Ascend with <b>1 tredecillion</b> cookies baked.<q>(as we know it)</q>",
			[21, 25]);
		new Game.Achievement("Oh, you're back",
			"Ascend with <b>1 quattuordecillion</b> cookies baked.<q>Missed us?</q>",
			[21, 25]);
		new Game.Achievement("Lazarus",
			"Ascend with <b>1 quindecillion</b> cookies baked.<q>Try, try again.</q>",
			[21, 25]);

		Game.CpsAchievement("Leisurely pace");
		Game.CpsAchievement("Hypersonic");

		Game.BankAchievement("Feed me, Orteil");
		Game.BankAchievement("And then what?");

		order = 7002;
		new Game.Achievement("Tricentennial and a half",
			"Have at least <b>350 of everything</b>.<q>(it's free real estate)</q>",
			[21, 26], {require: getNumAllObjectsRequireFunc(350)});
		new Game.Achievement("Quadricentennial",
			"Have at least <b>400 of everything</b>.<q>You've had to do horrible things to get this far.<br>Horrible... horrible things.</q>",
			[22, 26], {require: getNumAllObjectsRequireFunc(400)});
		new Game.Achievement("Quadricentennial and a half",
			"Have at least <b>450 of everything</b>.<q>At this point, you might just be compensating for something.</q>",
			[23, 26], {require: getNumAllObjectsRequireFunc(450)});

		new Game.Achievement("Quincentennial",
			"Have at least <b>500 of everything</b>.<q>Some people would say you're halfway there.<br>We do not care for those people and their reckless sense of unchecked optimism.</q>",
			[29, 25], {require: getNumAllObjectsRequireFunc(500)});

		order = 21100;
		new Game.Achievement("Maillard reaction",
			"Harvest a <b>caramelized sugar lump</b>.",
			[29, 27]);

		order = 30250;
		new Game.Achievement("When the cookies ascend just right",
			"Ascend with exactly <b>1,000,000,000,000 cookies</b>.",
			[25, 7], {pool: "shadow"}); //this achievement is shadow because it is only achievable through blind luck or reading external guides;
										// this may change in the future

		order = 1050;
		new Game.Achievement("With her finger and her thumb",
			"Have <b>600</b> cursors.",
			[0, 16], {groups: "cursor:600"});

		order = 1100;
		Game.TieredAchievement("But wait 'til you get older",
			"Have <b>550</b> grandmas.",
			"Grandma", 12);
		order = 1200;
		Game.TieredAchievement("Sharpest tool in the shed",
			"Have <b>500</b> farms.",
			"Farm", 11);
		order = 1300;
		Game.TieredAchievement("Hey now, you're a rock",
			"Have <b>500</b> mines.",
			"Mine", 11);
		order = 1400;
		Game.TieredAchievement("Break the mold",
			"Have <b>500</b> factories.",
			"Factory", 11);
		order = 1425;
		Game.TieredAchievement("Get the show on, get paid",
			"Have <b>500</b> banks.",
			"Bank", 11);
		order = 1450;
		Game.TieredAchievement("My world's on fire, how about yours",
			"Have <b>500</b> temples.",
			"Temple", 11);
		order = 1475;
		Game.TieredAchievement("The meteor men beg to differ",
			"Have <b>500</b> wizard towers.",
			"Wizard tower", 11);
		order = 1500;
		Game.TieredAchievement("Only shooting stars",
			"Have <b>500</b> shipments.",
			"Shipment", 11);
		order = 1600;
		Game.TieredAchievement("We could all use a little change",
			"Have <b>500</b> alchemy labs.",
			"Alchemy lab", 11); //"all that glitters is gold" was already an achievement
		order = 1700;
		Game.TieredAchievement("Your brain gets smart but your head gets dumb",
			"Have <b>500</b> portals.",
			"Portal", 11);
		order = 1800;
		Game.TieredAchievement("The years start coming",
			"Have <b>500</b> time machines.",
			"Time machine", 11);
		order = 1900;
		Game.TieredAchievement("What a concept",
			"Have <b>500</b> antimatter condensers.",
			"Antimatter condenser", 11);
		order = 2000;
		Game.TieredAchievement("You'll never shine if you don't glow",
			"Have <b>500</b> prisms.",
			"Prism", 11);
		order = 2100;
		Game.TieredAchievement("You'll never know if you don't go",
			"Have <b>500</b> chancemakers.",
			"Chancemaker", 11);

		order = 2200;
		Game.TieredAchievement("Self-contained",
			"Have <b>1</b> fractal engine.",
			"Fractal engine", 1);
		Game.TieredAchievement("Threw you for a loop",
			"Have <b>50</b> fractal engines.",
			"Fractal engine", 2);
		Game.TieredAchievement("The sum of its parts",
			"Have <b>100</b> fractal engines.",
			"Fractal engine", 3);
		Game.TieredAchievement("Bears repeating",
			"Have <b>150</b> fractal engines.<q>Where did these come from?</q>",
			"Fractal engine", 4);
		Game.TieredAchievement("More of the same",
			"Have <b>200</b> fractal engines.",
			"Fractal engine", 5);
		Game.TieredAchievement("Last recurse",
			"Have <b>250</b> fractal engines.",
			"Fractal engine", 6);
		Game.TieredAchievement("Out of one, many",
			"Have <b>300</b> fractal engines.",
			"Fractal engine", 7);
		Game.TieredAchievement("An example of recursion",
			"Have <b>350</b> fractal engines.",
			"Fractal engine", 8);
		Game.TieredAchievement("For more information on this achievement, please refer to its title",
			"Have <b>400</b> fractal engines.",
			"Fractal engine", 9);
		Game.TieredAchievement("I'm so meta, even this achievement",
			"Have <b>450</b> fractal engines.",
			"Fractal engine", 10);
		Game.TieredAchievement("Never get bored",
			"Have <b>500</b> fractal engines.",
			"Fractal engine", 11);

		order = 2220;
		Game.ProductionAchievement("The needs of the many", "Fractal engine", 1);
		Game.ProductionAchievement("Eating its own", "Fractal engine", 2);
		Game.ProductionAchievement("We must go deeper", "Fractal engine", 3);

		new Game.Achievement("Sierpinski rhomboids",
			"Reach level <b>10</b> fractal engines.",
			[20, 26], {groups: "fractalEngine|level10"});

		Game.CpsAchievement("Gotta go fast");
		Game.BankAchievement("I think it's safe to say you've got it made");

		order = 6000;
		new Game.Achievement("Renaissance baker",
			"Own <b>400</b> upgrades and <b>4000</b> buildings.<q>If you have seen further, it is by standing on the shoulders of giants - a mysterious species of towering humanoids until now thought long-extinct.</q>",
			[10, 10], {require: function() { return Game.Get("ObjectsOwned") >= 4000 && Game.Get("UpgradesOwned") >= 400; }});

		order = 1150;
		new Game.Achievement("Veteran",
			"Own at least <b>14</b> grandma types.<q>14's a crowd!</q>",
			[10, 9], {
				require: function() {
					var list = Game.UpgradesByGroup.grandmaSynergy;
					return Game.countUpgradesByGroup(list, 14) >= 14;
				}
			});

		order = 10000;
		new Game.Achievement("Thick-skinned",
			"Have your <b>reinforced membrane</b> protect the <b>shimmering veil</b>.",
			[7, 10]);


		Game.AchievementsByOrder = Game.AchievementsById.slice(0).sort(Game.sortByOrderFunc);
		var $norm = $("#achNorm");
		var $shadow = $("#achShadow");
		var $dungeon = $("#achDungeon");

		for (i = Game.AchievementsByOrder.length - 1; i >= 0; i--) {
			var achieve = Game.AchievementsByOrder[i];
			Game.ArrayPush(Game.AchievementsByPool, achieve.pool, achieve);

			if (Game.CountsAsAchievementOwned(achieve.pool)) {
				Game.AchievementsTotal++;
			}

			var $node = $norm;
			if (achieve.pool === "shadow") {
				$node = $shadow;
				achieve.$crateNodes.addClass("shadow");
			} else if (achieve.pool === "dungeon") {
				$node = $dungeon;
			}
			$node.prepend(achieve.$baseCrate);

			for (j in achieve.groups) {
				Game.ArrayPush(Game.AchievementsByGroup, j, achieve);

				if (!achieve.buildingTie && j in Game.ObjectsByGroup) {
					achieve.buildingTie = Game.ObjectsByGroup[j];
				}
			}
		}

		var reqFunc = function() { return Game.Objects["Cursor"].getAmount() >= this.groups.cursor; };
		for (i = Game.AchievementsByGroup.cursor.length - 1; i >= 0; i--) {
			Game.AchievementsByGroup.cursor[i].require = reqFunc;
		}

		reqFunc = function() { return this.buildingTie.level >= 10; };
		for (i = Game.AchievementsByGroup.level10.length - 1; i >= 0; i--) {
			Game.AchievementsByGroup.level10[i].require = reqFunc;
		}

		//#endregion Achievements


		//#region Buffs / Buff types

		Game.goldenCookieBuildingBuffs = {
			"Cursor": ["High-five", "Slap to the face"],
			"Grandma": ["Congregation", "Senility"],
			"Farm": ["Luxuriant harvest", "Locusts"],
			"Mine": ["Ore vein", "Cave-in"],
			"Factory": ["Oiled-up", "Jammed machinery"],
			"Bank": ["Juicy profits", "Recession"],
			"Temple": ["Fervent adoration", "Crisis of faith"],
			"Wizard tower": ["Manabloom", "Magivores"],
			"Shipment": ["Delicious lifeforms", "Black holes"],
			"Alchemy lab": ["Breakthrough", "Lab disaster"],
			"Portal": ["Righteous cataclysm", "Dimensional calamity"],
			"Time machine": ["Golden ages", "Time jam"],
			"Antimatter condenser": ["Extra cycles", "Predictable tragedy"],
			"Prism": ["Solar flare", "Eclipse"],
			"Chancemaker": ["Winning streak", "Dry spell"],
			"Fractal engine": ["Macrocosm", "Microcosm"]
		};

		var objectOptions = "";
		for (i = 0; i < Game.ObjectsById.length; i++) {
			objectOptions += '<option value="' + i + '">' + Game.ObjectsById[i].name + "</option>";
		}
		var buffObjectSel = '<select class="buffObjectSelect">' + objectOptions + "</select>";

		Game.BuffType = function(name, func, props) {
			this.name = name;
			this.func = func; //this is a function that returns a buff object; it takes a "time" argument in seconds, and 3 more optional arguments
							  // at most, which will be saved and loaded as floats
			this.id = Game.BuffTypes.length;

			$.extend(this, props);

			if (!this.hidden) {
				this.$domNode = $('<div class="buffType" data-bufftype="' + name +
					'"><span class="buffTypeName tooltipped"><a class="buffTypeAdd">Add</a> ' + this.displayName +
					'</span> <span class="buffTypeOptions spacer"></span> ' +
					'<span class="buffTypeBtns"></span>' +
					"</div>").appendTo("#buffsTypesBlock");
				this.domNode = this.$domNode[0];
				this.domNode.objTie = this;

				this.$addBtn = this.$domNode.find(".buffTypeAdd");
				this.$addBtn[0].objTie = this;

				var $node = this.$domNode.find(".buffTypeOptions");
				if (this.addObjectSel) {
					var self = this;

					var $select = $(buffObjectSel).appendTo($node);
					$select.after(" ");
					self.objectSelect = $select[0];
					self.objectSelect.objTie = self;

					var $input = $('<input type="text" class="buffObjectAmountIn" value="1" placeholder="1" maxlength="4">').appendTo($node);
					self.objectAmountIn = $input[0];
					self.objectAmountIn.minIn = 1;
					self.objectAmountIn.objTie = self;
					self.objectAmountIn.checkFunc = function() {
						self.updateFunc();
					};
				}

				if (this.addOptions) {
					this.addOptions($node);
				}
			}

			Game.BuffTypesByName[this.name] = this;
			Game.BuffTypes.push(this);
		};

		Game.BuffType.prototype.getTime = function(setWrath) {
			var time = this.time;
			if (this.fromGoldCookie || this.fromWrathCookie) {
				var wrath = this.fromWrathCookie && (setWrath || !this.fromGoldCookie || byId("buffsSetWrath").checked);
				time = Math.ceil(time * Game.getGoldCookieDurationMod(wrath));
			}
			return time;
		};

		Game.BuffType.prototype.getArgs = function() {
			return [
				this.getTime(),
				this.powFunc ? this.powFunc() : this.pow
			];
		};

		Game.BuffType.prototype.updateFunc = function() { };

		//base buffs
		new Game.BuffType("frenzy", function(time, pow) {
			return {
				name: "Frenzy",
				desc: "Cookie production x" + pow + " for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [10, 14],
				time: time * Game.fps,
				multCpS: pow
			};
		}, {
			displayName: "Frenzy",
			tooltipDesc: "Cookie production x7 for 1 minute 17 seconds!",
			fromGoldCookie: true,
			fromWrathCookie: true,
			time: 77,
			pow: 7
		});
		new Game.BuffType("blood frenzy", function(time, pow) {
			return {
				name: "Elder frenzy",
				desc: "Cookie production x" + pow + " for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [29, 6],
				time: time * Game.fps,
				multCpS: pow
			};
		}, {
			displayName: "Elder frenzy",
			tooltipDesc: "Cookie production x666 for 6 seconds!",
			fromWrathCookie: true,
			time: 6,
			pow: 666
		});
		new Game.BuffType("clot", function(time, pow) {
			return {
				name: "Clot",
				desc: "Cookie production halved for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [15, 5],
				time: time * Game.fps,
				multCpS: pow
			};
		}, {
			displayName: "Clot",
			tooltipDesc: "Cookie production x0.5 for 1 minute 6 seconds!",
			fromWrathCookie: true,
			time: 66,
			pow: 0.5
		});
		new Game.BuffType("dragon harvest", function(time, pow) {
			return {
				name: "Dragon Harvest",
				desc: "Cookie production x" + pow + " for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [10, 25],
				time: time * Game.fps,
				multCpS: pow
			};
		}, {
			displayName: "Dragon Harvest",
			tooltipDesc: "Cookie production x15 for 1 minute!",
			fromGoldCookie: true,
			time: 60,
			pow: 15
		});
		new Game.BuffType("everything must go", function(time, pow) {
			return {
				name: "Everything must go",
				desc: "All buildings are " + pow + "% cheaper for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [17, 6],
				time: time * Game.fps,
				power: pow
			};
		}, {
			displayName: "Everything must go",
			tooltipDesc: "All buildings are 5% cheaper for 8 seconds!",
			fromGoldCookie: true,
			fromWrathCookie: true,
			time: 8,
			pow: 5
		});
		new Game.BuffType("cursed finger", function(time, pow) {
			var timeStr = Game.sayTime(time * Game.fps, -1);
			return {
				name: "Cursed finger",
				desc: "Cookie production halted for " + timeStr + ",<br>but each click is worth " + timeStr + " of CpS.",
				icon: [12, 17],
				time: time * Game.fps,
				power: pow,
				multCpS: 0
			};
		}, {
			displayName: "Cursed finger",
			tooltipDesc: "Cookie production halted for 10 seconds,<br>but each click is worth 10 seconds of CpS.",
			fromWrathCookie: true,
			time: 10,
			powFunc: function() {
				return (Game.cookiesPs * this.getTime(true));
			}
		});
		new Game.BuffType("click frenzy", function(time, pow) {
			return {
				name: "Click frenzy",
				desc: "Clicking power x" + pow + " for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [0, 14],
				time: time * Game.fps,
				multClick: pow
			};
		}, {
			displayName: "Click frenzy",
			tooltipDesc: "Clicking power x777 for 13 seconds!",
			fromGoldCookie: true,
			fromWrathCookie: true,
			time: 13,
			pow: 777
		});
		new Game.BuffType("dragonflight", function(time, pow) {
			return {
				name: "Dragonflight",
				desc: "Clicking power x" + pow + " for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [0, 25],
				time: time * Game.fps,
				add: true,
				multClick: pow,
				aura: 1
			};
		}, {
			displayName: "Dragonflight",
			tooltipDesc: "Clicking power x1111 for 10 seconds!",
			fromGoldCookie: true,
			time: 10,
			pow: 1111
		});
		//irrelevant
		new Game.BuffType("cookie storm", function(time, pow) {
			return {
				name: "Cookie storm",
				desc: "Cookies everywhere!",
				icon: [22, 6],
				time: time * Game.fps,
				add: true,
				power: pow,
				aura: 1
			};
		}, {hidden: true});

		new Game.BuffType("building buff", function(time, pow, building, amount) {
			var obj = Game.ObjectsById[building];
			if (isNaN(amount)) {
				amount = obj.getAmount();
			}
			return {
				name: Game.goldenCookieBuildingBuffs[obj.name][0],
				desc: "Your " + amount + " " + obj.plural + " are boosting your CpS!<br>Cookie production +" + (Math.ceil(pow * 100 - 100)) +
					"% for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [obj.iconColumn, 14],
				time: time * Game.fps,
				multCpS: pow
			};
		}, {
			displayName: "Building buff",
			tooltipDesc: "Your (amount) (building) are boosting your CpS!<br>Cookie production +(xxx)% for 30 seconds!",
			fromGoldCookie: true,
			fromWrathCookie: true,
			time: 30,
			addObjectSel: true,
			addOptions: function($node) {
				var $random = $('<a class="buffRandomObject">Random</a>').appendTo($node);
				$random.before(" ");
				$random[0].objTie = this;
			},
			getArgs: function() {
				return [
					this.getTime(),
					this.objectAmountIn.parsedValue / 10 + 1,
					this.objectSelect.value,
					this.objectAmountIn.parsedValue
				];
			}
		});
		new Game.BuffType("building debuff", function(time, pow, building, amount) {
			var obj = Game.ObjectsById[building];
			if (isNaN(amount)) {
				amount = obj.getAmount();
			}
			return {
				name: Game.goldenCookieBuildingBuffs[obj.name][1],
				desc: "Your " + amount + " " + obj.plural + " are rusting your CpS!<br>Cookie production " + (Math.ceil(pow * 100 - 100)) +
					"% slower for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [obj.iconColumn, 15],
				time: time * Game.fps,
				multCpS: 1 / pow
			};
		}, {
			displayName: "Building debuff",
			tooltipDesc: "Your (amount) (building) are rusting your CpS!<br>Cookie production (xx)% slower for 30 seconds!",
			fromWrathCookie: true,
			time: 30,
			addObjectSel: true,
			addOptions: function($node) {
				var $random = $('<a class="buffRandomObject">Random</a>').appendTo($node);
				$random.before(" ");
				$random[0].objTie = this;
			},
			getArgs: function() {
				return [
					this.getTime(),
					this.objectAmountIn.parsedValue / 10 + 1,
					this.objectSelect.value,
					this.objectAmountIn.parsedValue
				];
			}
		});
		// irrelevant
		new Game.BuffType("sugar blessing", function(time) {
			return {
				name: "Sugar blessing",
				desc: "You find 10% more golden cookies for the next " + Game.sayTime(time * Game.fps, -1) + ".",
				icon: [29, 16],
				time: time * Game.fps
			};
		}, {hidden: true});
		new Game.BuffType("haggler luck", function(time, pow) {
			return {
				name: "Haggler's luck",
				desc: "All upgrades are " + pow + "% cheaper for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [25, 11],
				time: time * Game.fps,
				power: pow
			};
		}, {
			displayName: "Haggler's luck",
			tooltipDesc: "All upgrades are 2% cheaper for 1 minute!",
			time: 60,
			pow: 2,
			killOnGain: "Haggler's misery"
		});
		new Game.BuffType("haggler misery", function(time, pow) {
			return {
				name: "Haggler's misery",
				desc: "All upgrades are " + pow + "% pricier for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [25, 11],
				time: time * Game.fps,
				power: pow,
				max: true
			};
		}, {
			displayName: "Haggler's misery",
			tooltipDesc: "All upgrades are 2% pricier for 1 hour!",
			time: 60 * 60,
			pow: 2,
			killOnGain: "Haggler's luck"
		});
		new Game.BuffType("pixie luck", function(time, pow) {
			return {
				name: "Crafty pixies",
				desc: "All buildings are " + pow + "% cheaper for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [26, 11],
				time: time * Game.fps,
				power: pow,
				max: true
			};
		}, {
			displayName: "Crafty pixies",
			tooltipDesc: "All buildings are 2% cheaper for 1 minute!",
			time: 60,
			pow: 2,
			killOnGain: "Nasty goblins"
		});
		new Game.BuffType("pixie misery", function(time, pow) {
			return {
				name: "Nasty goblins",
				desc: "All buildings are " + pow + "% pricier for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [26, 11],
				time: time * Game.fps,
				power: pow,
				max: true
			};
		}, {
			displayName: "Nasty goblins",
			tooltipDesc: "All buildings are 2% pricier for 1 hour!",
			time: 60 * 60,
			pow: 2,
			killOnGain: "Crafty pixies"
		});
		// irrelevant
		new Game.BuffType("magic adept", function(time, pow) {
			return {
				name: "Magic adept",
				desc: "Spells backfire " + pow + " times less for " + Game.sayTime(time * Game.fps, -1) + ".",
				icon: [29, 11],
				time: time * Game.fps,
				power: pow,
				max: true
			};
		}, {hidden: true});
		new Game.BuffType("magic inept", function(time, pow) {
			return {
				name: "Magic inept",
				desc: "Spells backfire " + pow + " times more for " + Game.sayTime(time * Game.fps, -1) + ".",
				icon: [29, 11],
				time: time * Game.fps,
				power: pow,
				max: true
			};
		}, {hidden: true});
		new Game.BuffType("devastation", function(time, pow) {
			return {
				name: "Devastation",
				desc: function() {
					return "Clicking power +" + Math.floor(this.multClick * 100 - 100) + "% for " + Game.sayTime(this.time, -1) + "!";
				}, // * Game.fps
				icon: [23, 18],
				time: time * Game.fps,
				multClick: pow
			};
		}, {
			displayName: "Devastation",
			tooltipDesc: "Clicking power +(xxx)% for 10 seconds!",
			time: 10,
			addObjectSel: true,
			addOptions: function($node) {
				var self = this;

				var opts = "";
				for (var i = 0; i < 3; i++) {
					opts += '<option value="' + (i + 1) + '">' + Game.pantheon.slotNames[i] + "</option>";
				}

				self.$gemSlotSelect = $("<select>" + opts + "</select>").appendTo($node);
				self.$gemSlotSelect.before(" ").after(" ");

				var $label = $(
					'<label data-title="Buff will be replaced on add otherwise."><input type="checkbox" checked> Stack on add</label>').appendTo(
					$node);
				$label.after(" ");
				self.stackCheck = $label.find("input")[0];

				self.$sellBtn = $('<a class="spacer hidden">Sell and Add</a>').appendTo($node).on("click", function() {
					var obj = Game.ObjectsById[self.objectSelect.value];
					var amount = Math.min(self.objectAmountIn.parsedValue, obj.getAmount());

					if (amount) {
						obj.sacrifice(amount);
						Game.gainBuff(self.name, [self.getTime(), self.powFunc(amount)]);
					}
					Game.scheduleUpdate();
				});
			},
			powFunc: function() {
				var sold = this.objectAmountIn.parsedValue;
				var godLvl = this.$gemSlotSelect.val();
				var pow = 0;
				if (godLvl == 1) { pow = 1 + sold * 0.01; } else if (godLvl == 2) { pow = 1 + sold * 0.005; } else if (godLvl == 3) {
					pow = 1 + sold * 0.0025;
				}
				return pow;
			},
			stackFunc: function(oldBuff, newBuff) {
				if (this.stackCheck.checked) {
					newBuff.multClick = newBuff.multClick - 1 + oldBuff.multClick;
				}
			},
			updateFunc: function() {
				var obj = Game.ObjectsById[this.objectSelect.value];
				var amount = Math.min(this.objectAmountIn.parsedValue, obj.amount);
				this.$sellBtn.toggleClass("hidden", !amount);
			}
		});
		new Game.BuffType("sugar frenzy", function(time, pow) {
			return {
				name: "Sugar frenzy",
				desc: "Cookie production x" + pow + " for " + Game.sayTime(time * Game.fps, -1) + "!",
				icon: [29, 14],
				time: time * Game.fps,
				add: true,
				multCpS: pow,
				aura: 0
			};
		}, {
			displayName: "Sugar frenzy",
			tooltipDesc: "Cookie production x3 for 1 hour!",
			time: 60 * 60,
			pow: 3
		});

		Game.gainBuff = function(type, args) {
			var buffType = Game.BuffTypesByName[type];
			if (!buffType || !buffType.func) {
				throw 'Invalid buff type "' + type + '"';
			}
			if (buffType.hidden) {
				throw 'Buff type "' + type + '" deemed irrelevant';
			}

			args = args || buffType.getArgs();
			var buff = buffType.func.apply(buffType, args);
			var oldBuff = Game.hasBuff(buff.name);
			if (oldBuff) {
				if (buffType.stackFunc) {
					buffType.stackFunc(oldBuff, buff);
				}
				Game.killBuff(oldBuff.name);
			}

			buff.type = type;
			buff.buffType = buffType;
			buff.icon = buff.icon || [0, 0];
			buff.iconCss = Game.getIconCss(buff.icon);
			buff.args1 = args[1];
			buff.args2 = args[2];
			buff.args3 = args[3];

			Game.Buffs[buff.name] = buff;

			buff.$crate = $('<div class="buffCrate crate unlocked"></div>')
				.css(buff.iconCss).attr("data-buff", buff.name).appendTo("#buffsCurrent");
			buff.$crate[0].objTie = buff;

			if (buffType.killOnGain) {
				Game.killBuff(buffType.killOnGain);
			}
		};

		Game.killBuff = function(name) {
			var buff = Game.hasBuff(name);
			if (buff) {
				buff.$crate.remove();
				delete Game.Buffs[name];
			}
		};

		Game.killBuffs = function() {
			for (var name in Game.Buffs) {
				Game.killBuff(name);
			}
		};

		Game.clearBuffSelection = function() {
			$("#buffsCurrent .buffCrate.enabled").removeClass("enabled");
			Game.updateBuffSelection();
		};

		Game.setBuffObjectInputs = function() {
			// $("#buffsBlock .buffObjectSelect").change();
		};

		var tabBuffsEle = byId("tabBuffs");
		tabBuffsEle.onTabFunc = function() {
			Game.clearBuffSelection();
			Game.setBuffObjectInputs();
		};

		tabBuffsEle.updateTabFunc = function() {
			var text = "Buffs";
			var title = "";

			var buffs = 0;
			// eslint-disable-next-line no-unused-vars
			for (var key in Game.Buffs) {
				buffs++;
			}
			if (buffs > 0) {
				text += " (" + buffs + ")";
				title = buffs + " buff" + (buffs === 1 ? "" : "s") + " active";
			}

			this.textContent = text;
			this.dataset.title = title;
		};

		Game.updateBuffSelection = function() {
			var hasSelection = $("#buffsCurrent .buffCrate.enabled").length > 0;
			$("#buffsClearAll").toggleClass("hidden", $("#buffsCurrent .buffCrate").length < 1);
			$("#buffsClearCancel, #buffsClearSelected").toggleClass("hidden", !hasSelection);
		};

		$("#buffsTypesBlock").on("mouseenter", ".buffTypeName", function() {
			var buffType = Game.BuffTypesByName[this.parentNode.dataset.bufftype];
			Game.setTooltip({
				html: '<div class="prompt alignCenter buffTooltip">' +
					'<h3 class="name">' + buffType.displayName + '</h3><div class="line"></div>' + buffType.tooltipDesc + "</div>",
				refEle: this
			});

		}).on("click", ".buffTypeAdd", function() {
			Game.gainBuff(this.objTie.name);
			Game.updateBuffSelection();
			Game.scheduleUpdate();

		}).on("change", ".buffObjectSelect", function() {
			var obj = Game.ObjectsById[this.objTie.objectSelect.value];
			Game.setInput(this.objTie.objectAmountIn, obj.getAmount());

		}).on("click", ".buffRandomObject", function() {
			var n = Math.floor(Math.random() * Game.ObjectsById.length);
			this.objTie.objectSelect.value = n;

			var obj = Game.ObjectsById[n];
			Game.setInput(this.objTie.objectAmountIn, obj.getAmount());
			Game.scheduleUpdate();
		});

		$("#buffsCurrent").on("mouseenter", ".buffCrate", function() {
			var buff = this.objTie;
			var desc = typeof buff.desc === "function" ? buff.desc() : buff.desc;
			Game.setTooltip({
				html: '<div class="prompt alignCenter buffTooltip">' +
					'<h3 class="name">' + buff.name + '</h3><div class="line"></div>' + desc + "</div>",
				refEle: this
			});

		}).on("click", ".buffCrate", function() {
			$(this).toggleClass("enabled");
			Game.updateBuffSelection();
		});

		$("#buffsClearAll").on("click", function() {
			Game.killBuffs();
			Game.updateBuffSelection();
			Game.scheduleUpdate();
		});

		$("#buffsClearCancel").on("click", function() {
			Game.clearBuffSelection();
		});

		$("#buffsClearSelected").on("click", function() {
			$("#buffsCurrent .buffCrate.enabled").each(function() {
				Game.killBuff(this.objTie.name);
			});
			Game.updateBuffSelection();
			Game.scheduleUpdate();
		});

		//#endregion Buffs / Buff types


		//#region Dragon Auras

		Game.dragonLevels = [
			{
				name: "Dragon egg",
				action: "Chip it",
				pic: 0,
				cost: function() { return true; },
				cumuCost: function() { return 1000000; },
				costStr: function() { return Game.BeautifyAbbr(1000000, 0, true) + " cookies"; }
			},
			{
				name: "Dragon egg",
				action: "Chip it",
				pic: 1,
				cost: function() { return true; },
				cumuCost: function() { return 1000000 * 2; },
				costStr: function() { return Game.BeautifyAbbr(1000000 * 2, 0, true) + " cookies"; }
			},
			{
				name: "Dragon egg",
				action: "Chip it",
				pic: 2,
				cost: function() { return true; },
				cumuCost: function() { return 1000000 * 4; },
				costStr: function() { return Game.BeautifyAbbr(1000000 * 4, 0, true) + " cookies"; }
			},
			{
				name: "Shivering dragon egg",
				action: "Hatch it",
				pic: 3,
				cost: function() { return true; },
				cumuCost: function() { return 1000000 * 8; },
				costStr: function() { return Game.BeautifyAbbr(1000000 * 8, 0, true) + " cookies"; }
			},
			{
				name: "Krumblor, cookie hatchling",
				action: "Train Breath of Milk",
				actionTitle: "Aura : kittens are 5% more effective",
				pic: 4,
				cost: function() { return true; },
				cumuCost: function() { return 1000000 * 16; },
				costStr: function() { return Game.BeautifyAbbr(1000000 * 16, 0, true) + " cookies"; }
			},
			{
				name: "Krumblor, cookie hatchling",
				action: "Train Dragon Cursor",
				actionTitle: "Aura : clicking is 5% more effective",
				pic: 4,
				cost: function() { return Game.Objects["Cursor"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Cursor"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Cursor"].sacrifice(100); },
				costStr: function() { return "100 cursors"; }
			},
			{
				name: "Krumblor, cookie hatchling",
				action: "Train Elder Battalion",
				actionTitle: "Aura : grandmas gain +1% CpS for every non-grandma building",
				pic: 4,
				cost: function() { return Game.Objects["Grandma"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Grandma"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Grandma"].sacrifice(100); },
				costStr: function() { return "100 grandmas"; }
			},
			{
				name: "Krumblor, cookie hatchling",
				action: "Train Reaper of Fields",
				actionTitle: "Aura : golden cookies may trigger a Dragon Harvest",
				pic: 4,
				cost: function() { return Game.Objects["Farm"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Farm"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Farm"].sacrifice(100); },
				costStr: function() { return "100 farms"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Earth Shatterer",
				actionTitle: "Aura : buildings sell back for 50% instead of 25%",
				pic: 5,
				cost: function() { return Game.Objects["Mine"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Mine"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Mine"].sacrifice(100); },
				costStr: function() { return "100 mines"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Master of the Armory",
				actionTitle: "Aura : all upgrades are 2% cheaper",
				pic: 5,
				cost: function() { return Game.Objects["Factory"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Factory"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Factory"].sacrifice(100); },
				costStr: function() { return "100 factories"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Fierce Hoarder",
				actionTitle: "Aura : all buildings are 2% cheaper",
				pic: 5,
				cost: function() { return Game.Objects["Bank"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Bank"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Bank"].sacrifice(100); },
				costStr: function() { return "100 banks"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Dragon God",
				actionTitle: "Aura : heavenly chips bonus +5%",
				pic: 5,
				cost: function() { return Game.Objects["Temple"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Temple"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Temple"].sacrifice(100); },
				costStr: function() { return "100 temples"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Arcane Aura",
				actionTitle: "Aura : golden cookies appear 5% more often",
				pic: 5,
				cost: function() { return Game.Objects["Wizard tower"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Wizard tower"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Wizard tower"].sacrifice(100); },
				costStr: function() { return "100 wizard towers"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Dragonflight",
				actionTitle: "Aura : golden cookies may trigger a Dragonflight",
				pic: 5,
				cost: function() { return Game.Objects["Shipment"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Shipment"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Shipment"].sacrifice(100); },
				costStr: function() { return "100 shipments"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Ancestral Metamorphosis",
				actionTitle: "Aura : golden cookies give 10% more cookies",
				pic: 5,
				cost: function() { return Game.Objects["Alchemy lab"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Alchemy lab"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Alchemy lab"].sacrifice(100); },
				costStr: function() { return "100 alchemy labs"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Unholy Dominion",
				actionTitle: "Aura : wrath cookies give 10% more cookies",
				pic: 5,
				cost: function() { return Game.Objects["Portal"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Portal"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Portal"].sacrifice(100); },
				costStr: function() { return "100 portals"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Epoch Manipulator",
				actionTitle: "Aura : golden cookie effects last 5% longer",
				pic: 5,
				cost: function() { return Game.Objects["Time machine"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Time machine"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Time machine"].sacrifice(100); },
				costStr: function() { return "100 time machines"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Mind Over Matter",
				actionTitle: "Aura : +25% random drops",
				pic: 5,
				cost: function() { return Game.Objects["Antimatter condenser"].amount >= 100; },
				buy: function() { Game.Objects["Antimatter condenser"].sacrifice(100); },
				cumuCost: function() { return Game.Objects["Antimatter condenser"].getPriceSum(0, 100); },
				costStr: function() { return "100 antimatter condensers"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Radiant Appetite",
				actionTitle: "Aura : all cookie production multiplied by 2",
				pic: 5,
				cost: function() { return Game.Objects["Prism"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Prism"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Prism"].sacrifice(100); },
				costStr: function() { return "100 prisms"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Dragon's Fortune",
				actionTitle: "Aura : +123% CpS per golden cookie on-screen",
				pic: 5,
				cost: function() { return Game.Objects["Chancemaker"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Chancemaker"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Chancemaker"].sacrifice(100); },
				costStr: function() { return "100 chancemakers"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train Dragon Curve",
				actionTitle: "Aura : sugar lumps grow 5% faster, 50% weirder",
				pic: 5,
				cost: function() { return Game.Objects["Fractal engine"].amount >= 100; },
				cumuCost: function() { return Game.Objects["Fractal engine"].getPriceSum(0, 100); },
				buy: function() { Game.Objects["Fractal engine"].sacrifice(100); },
				costStr: function() { return "100 fractal engines"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Bake dragon cookie",
				actionTitle: "Delicious!",
				pic: 6,
				cost: getNumAllObjectsRequireFunc(50),
				cumuCost: function() {
					var cumu = 0;
					for (var i = Game.ObjectsById.length - 1; i >= 0; i--) { cumu += Game.ObjectsById[i].getPriceSum(0, 50); }
					return cumu;
				},
				buy: function() { for (var i in Game.Objects) { Game.Objects[i].sacrifice(50); } },
				costStr: function() { return "50 of every building"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Train secondary aura",
				actionTitle: "Lets you use two dragon auras simultaneously",
				pic: 7,
				cost: getNumAllObjectsRequireFunc(200),
				cumuCost: function() {
					var cumu = 0;
					for (var i = Game.ObjectsById.length - 1; i >= 0; i--) { cumu += Game.ObjectsById[i].getPriceSum(0, 200); }
					return cumu;
				},
				buy: function() { for (var i in Game.Objects) { Game.Objects[i].sacrifice(200); } },
				costStr: function() { return "200 of every building"; }
			},
			{
				name: "Krumblor, cookie dragon",
				action: "Your dragon is fully trained.",
				pic: 8
			}
		];
		Game.dragonLevelMax = Game.dragonLevels.length - 1;

		Game.dragonAuras = [
			{
				name: "No aura",
				icon: [0, 7],
				desc: "Select an aura from those your dragon knows."
			},
			{
				name: "Breath of Milk",
				icon: [18, 25],
				desc: "Kittens are <b>5%</b> more effective."
			},
			{
				name: "Dragon Cursor",
				icon: [0, 25],
				desc: "Clicking is <b>5%</b> more effective."
			},
			{
				name: "Elder Battalion",
				icon: [1, 25],
				desc: "Grandmas gain <b>+1% CpS</b> for every non-grandma building."
			},
			{
				name: "Reaper of Fields",
				icon: [2, 25],
				desc: "Golden cookies may trigger a <b>Dragon Harvest</b>."
			},
			{
				name: "Earth Shatterer",
				icon: [3, 25],
				desc: "Buildings sell back for <b>50%</b> instead of 25%."
			},
			{
				name: "Master of the Armory",
				icon: [4, 25],
				desc: "All upgrades are <b>2%</b> cheaper."
			},
			{
				name: "Fierce Hoarder",
				icon: [15, 25],
				desc: "All buildings are <b>2%</b> cheaper."
			},
			{
				name: "Dragon God",
				icon: [16, 25],
				desc: "Prestige CpS bonus <b>+5%</b>."
			},
			{
				name: "Arcane Aura",
				icon: [17, 25],
				desc: "Golden cookies appear <b>+5%</b> more often."
			},
			{
				name: "Dragonflight",
				icon: [5, 25],
				desc: "Golden cookies may trigger a <b>Dragonflight</b>."
			},
			{
				name: "Ancestral Metamorphosis",
				icon: [6, 25],
				desc: "Golden cookies give <b>10%</b> more cookies."
			},
			{
				name: "Unholy Dominion",
				icon: [7, 25],
				desc: "Wrath cookies give <b>10%</b> more cookies."
			},
			{
				name: "Epoch Manipulator",
				icon: [8, 25],
				desc: "Golden cookies last <b>5%</b> longer."
			},
			{
				name: "Mind Over Matter",
				icon: [13, 25],
				desc: "Random drops are <b>25% more common</b>."
			},
			{
				name: "Radiant Appetite",
				icon: [14, 25],
				desc: "All cookie production <b>multiplied by 2</b>."
			},
			{
				name: "Dragon's Fortune",
				icon: [19, 25],
				desc: "<b>+123% CpS</b> per golden cookie on-screen, multiplicative."
			},
			{
				name: "Dragon's Curve",
				icon: [20, 25],
				desc: "<b>+5% sugar lump growth</b> and sugar lumps are <b>twice as likely</b> to be unusual."
			}
		];

		Game.dragonAurasByName = {};

		for (i = 0; i < Game.dragonAuras.length; i++) {
			var aura = Game.dragonAuras[i];
			aura.id = i;
			aura.iconCss = Game.getIconCss(aura.icon);
			aura.$crateNode = $('<div class="crate aura"></div>')
				.css(aura.iconCss).attr("data-aura", i).appendTo("#auraAvailable");
			aura.$crateNode[0].auraObj = aura;
			Game.dragonAurasByName[aura.name] = aura;
		}

		Game.dragonAuras[0].$crateNode.addClass("unlocked");

		Game.clearAuraSelection = function() {
			$("#auraBlock .aura.enabled").removeClass("enabled");
			$("#auraAvailableBlock, #switchAuraFree, #switchAuraBuy").addClass("hidden");
			Game.$enabledAuraSlot = null;
		};
		byId("tabFamiliar").onTabFunc = Game.clearAuraSelection;

		addPlusMinusInput("#dragonLevelSpan", "dragonLevelIn", 2, true).maxIn = Game.dragonLevelMax;
		$("#dragonAction").on("click", function(ev) {
			var lvl = Game.dragonLevels[Game.dragonLevel];
			var altMode = Game.checkEventAltMode(ev);
			if (Game.dragonLevel < Game.dragonLevelMax && lvl && (altMode || !lvl.cost || lvl.cost())) {
				if (lvl.buy && !altMode) { lvl.buy(); }
				Game.setInput("#dragonLevelIn", Game.dragonLevel + 1);
				Game.scheduleUpdate();
			}
			return false;
		});

		$("#auraCurrent").on("click", ".aura", function() {
			var $ele = $(this);
			$ele.siblings().removeClass("enabled");
			$ele.toggleClass("enabled");
			var isEnabled = $ele.hasClass("enabled");
			$("#auraAvailableBlock").toggleClass("hidden", !isEnabled).find(".aura.enabled").removeClass("enabled");
			if (isEnabled) {
				$('#auraAvailable .aura[data-aura="' + this.dataset.aura + '"]').addClass("enabled");
			}
			Game.$enabledAuraSlot = isEnabled ? $ele : null;
			$("#switchAuraFree, #switchAuraBuy").addClass("hidden");
			Game.scheduleUpdate();
		});

		$("#auraAvailable").on("click", ".aura", function() {
			var $ele = $(this);
			var otherId = Game.$enabledAuraSlot ? Game.$enabledAuraSlot.siblings().attr("data-aura") : null;
			if (!$ele.hasClass("enabled") && Game.$enabledAuraSlot && (otherId < 1 || this.dataset.aura != otherId)) {
				$ele.siblings().removeClass("enabled");
				$ele.addClass("enabled");
				Game.scheduleUpdate();
			}
		});

		$("#switchAuraCancel").click(Game.clearAuraSelection);

		$("#switchAuraFree").on("click", function() {
			var $switchAura = $("#auraAvailable .aura.enabled");
			var switchId = $switchAura.attr("data-aura");
			var currentId = Game.$enabledAuraSlot ? Game.$enabledAuraSlot.attr("data-aura") : null;
			if (Game.$enabledAuraSlot && $switchAura.length && currentId != switchId &&
				(switchId < 1 || Game.$enabledAuraSlot.siblings().attr("data-aura") != switchId)) {
				Game.setAura(Game.$enabledAuraSlot.attr("data-slot"), switchId);
				Game.clearAuraSelection();
				Game.scheduleUpdate();

			}
		});

		$("#switchAuraBuy").on("click", function() {
			var $switchAura = $("#auraAvailable .aura.enabled");
			var switchId = $switchAura.attr("data-aura");
			var currentId = Game.$enabledAuraSlot ? Game.$enabledAuraSlot.attr("data-aura") : null;
			if (Game.HighestBuilding && Game.$enabledAuraSlot && $switchAura.length &&
				currentId != switchId && (switchId < 1 || Game.$enabledAuraSlot.siblings().attr("data-aura") != switchId)) {
				Game.HighestBuilding.sacrifice(1);
				Game.setAura(Game.$enabledAuraSlot.attr("data-slot"), switchId);
				Game.clearAuraSelection();
				Game.scheduleUpdate();
			}
		});

		$("#auraBlock").on("mouseenter", ".crate.aura", function(ev) {
			if (this.auraObj) {
				Game.setTooltip({
					html: '<div class="auraTooltip"><h4>' + this.auraObj.name + "</h4>" +
						'<div class="line"></div>' + this.auraObj.desc + "</div>",
					refEle: this,
					isCrate: true
				});
			}
			ev.stopPropagation();
		});

		//sets the dragonAura in given slot [0, 1] to aura
		//aura can be either the id of the aura or the name
		Game.setAura = function(slot, aura) {
			var $slotEle = $("#auraSlot" + slot);
			var auraObj = Game.dragonAuras[aura] || Game.dragonAurasByName[aura];
			var slotKey = slot == 1 ? "dragonAura2" : "dragonAura";
			var otherSlotKey = slot == 1 ? "dragonAura" : "dragonAura2";
			if (auraObj && $slotEle.length && (auraObj.id < 1 || Game[otherSlotKey] != auraObj.id)) {
				Game[slotKey] = auraObj.id;
				$slotEle.css(auraObj.iconCss).attr("data-aura", auraObj.id);
				$slotEle[0].auraObj = auraObj;
			}
		};
		Game.setAura(0, Game.dragonAura);
		Game.setAura(1, Game.dragonAura2);
		Game.clearAuraSelection();

		//#endregion Dragon Auras


		//Game.initMinigames();


		//#region event handlers and stuff

		Game.registerInputs(Game, [
			["#heraldsIn", "heralds"],
			["#lumpsIn", "lumps"],
			["#dragonLevelIn", "dragonLevel"],
			["#numGoldenCookiesIn", "numGoldenCookies"],
			["#prestigeIn", "prestige"],
			["#sessionStartTime", "startDate"]
		]);


		Game.setTab = function(tab, toggle) {
			var $tab = $(tab);
			tab = $tab[0];
			if (!tab || !$tab.is(".tabs > .tab")) {
				return;
			}

			var par = tab.parentNode;
			var $par = $(par);
			var isCurrent = $tab.hasClass("tabCurrent");

			var index = $par.find(".tab").removeClass("tabCurrent").index(tab);
			$tab.toggleClass("tabCurrent", typeof toggle === "boolean" ? toggle : !$par.hasClass("toggleTabs") || !isCurrent);
			$("#" + par.dataset.tabblocks).find(".tabBlock").addClass("hidden").eq(index).toggleClass("hidden", !$tab.hasClass("tabCurrent"));

			if (tab.onTabFunc) {
				tab.onTabFunc();
			}
			if (par.onTabFunc) {
				par.onTabFunc();
			}
		};

		$(".tabBlock").addClass("hidden");
		$(".tabs[data-tabblocks]").each(function() {
			var $t = $(this);
			var $tabs = $t.children(".tab");
			var $current = $tabs.filter(".tabCurrent").first();
			var found = $current.length;
			if (!found) {
				$current = $tabs.first();
			}
			Game.setTab($current, Boolean(!$t.hasClass("toggleTabs") || found));
		});


		Game.BakeryNamePrefixes = [
			"Magic",
			"Fantastic",
			"Fancy",
			"Sassy",
			"Snazzy",
			"Pretty",
			"Cute",
			"Pirate",
			"Ninja",
			"Zombie",
			"Robot",
			"Radical",
			"Urban",
			"Cool",
			"Hella",
			"Sweet",
			"Awful",
			"Double",
			"Triple",
			"Turbo",
			"Techno",
			"Disco",
			"Electro",
			"Dancing",
			"Wonder",
			"Mutant",
			"Space",
			"Science",
			"Medieval",
			"Future",
			"Captain",
			"Bearded",
			"Lovely",
			"Tiny",
			"Big",
			"Fire",
			"Water",
			"Frozen",
			"Metal",
			"Plastic",
			"Solid",
			"Liquid",
			"Moldy",
			"Shiny",
			"Happy",
			"Happy Little",
			"Slimy",
			"Tasty",
			"Delicious",
			"Hungry",
			"Greedy",
			"Lethal",
			"Professor",
			"Doctor",
			"Power",
			"Chocolate",
			"Crumbly",
			"Choklit",
			"Righteous",
			"Glorious",
			"Mnemonic",
			"Psychic",
			"Frenetic",
			"Hectic",
			"Crazy",
			"Royal",
			"El",
			"Von"
		];
		Game.BakeryNameSuffixes = [
			"Cookie",
			"Biscuit",
			"Muffin",
			"Scone",
			"Cupcake",
			"Pancake",
			"Chip",
			"Sprocket",
			"Gizmo",
			"Puppet",
			"Mitten",
			"Sock",
			"Teapot",
			"Mystery",
			"Baker",
			"Cook",
			"Grandma",
			"Click",
			"Clicker",
			"Spaceship",
			"Factory",
			"Portal",
			"Machine",
			"Experiment",
			"Monster",
			"Panic",
			"Burglar",
			"Bandit",
			"Booty",
			"Potato",
			"Pizza",
			"Burger",
			"Sausage",
			"Meatball",
			"Spaghetti",
			"Macaroni",
			"Kitten",
			"Puppy",
			"Giraffe",
			"Zebra",
			"Parrot",
			"Dolphin",
			"Duckling",
			"Sloth",
			"Turtle",
			"Goblin",
			"Pixie",
			"Gnome",
			"Computer",
			"Pirate",
			"Ninja",
			"Zombie",
			"Robot"
		];
		Game.RandomBakeryName = function() {
			return (Math.random() > 0.05 ? (Game.choose(Game.BakeryNamePrefixes) + " ") : "Mc") + Game.choose(Game.BakeryNameSuffixes);
		};

		var name = Game.RandomBakeryName();
		Game.bakeryName = name;
		Game.bakeryNameLowerCase = name.toLowerCase();

		$("#bakeryNameIn").val(Game.bakeryName).on("input", function() {
			var name = this.value.replace(/\W+/g, " ").substring(0, 28);
			var prevLower = Game.bakeryNameLowerCase;
			if (name !== Game.bakeryName) {
				Game.bakeryName = name;
				Game.bakeryNameLowerCase = name.toLowerCase();
				if (Game.bakeryNameLowerCase !== prevLower && (Game.bakeryNameLowerCase === "orteil" || Game.bakeryNameLowerCase === "ortiel" ||
					prevLower === "orteil" || prevLower === "ortiel")) {
					Game.scheduleUpdate();
				}
			}
			return false;
		}).blur(function() {
			this.value = Game.bakeryName;
		});

		$("#randomBakeryName").on("click", function() {
			var name = Game.RandomBakeryName();
			byId("bakeryNameIn").value = name;
			var prevLower = Game.bakeryNameLowerCase;
			Game.bakeryName = name;
			Game.bakeryNameLowerCase = name.toLowerCase();
			if (prevLower === "orteil" || prevLower === "ortiel") {
				Game.scheduleUpdate();
			}
			return false;
		});

		$("#recalcButton").on("click", function() {
			Game.scheduleUpdate();
		});

		$("select.recalc").change(function() {
			Game.scheduleUpdate();
			return false;
		});

		$("#importSave").on("click", function() {
			Game.importSave();
		});

		$("#reimportSave").on("click", function() {
			Game.importSave(Game.storedImport);
		});


		byId("abbrCheck").clickFunc = function() {
			localStorage.setItem("CCalc.AbbreviateNums", this.checked ? 1 : "");
			Game.abbrOn = this.checked;

			for (var i = Game.UpgradesById.length - 1; i >= 0; i--) {
				Game.UpgradesById[i].setCurrentDescription();
				this.statsStr = null;
			}
			for (i = Game.AchievementsById.length - 1; i >= 0; i--) {
				Game.AchievementsById[i].setCurrentDescription();
			}
			$(".exp").each(function() { Game.setInput(this); });

			if (typeof Game.updateTooltip === "function") {
				Game.updateTooltip();
			}
		};

		$("#bankSpan").on("click", 'input[name="bank"]', function() {
			localStorage.setItem("CCalc.ShowBank", document.querySelector('[name="bank"]:checked').id);
			Game.updateRecommended();
		});

		$("#quantitySpan").on("click", 'input[name="quantity"]', function() {
			localStorage.setItem("CCalc.BuildQuantity", document.querySelector('[name="quantity"]:checked').id);
			Game.scheduleUpdate();
		});

		ele = byId("clicksPsIn");
		ele.maxIn = Game.maxClicksPs;
		ele.focusFunc = function() {
			var val = this.value;
			if (val.length > this.getAttribute("maxlength") && val.slice(0, 2) === "0.") {
				this.value = val.slice(1);
			}
		};
		ele.checkFunc = function() {
			localStorage.setItem("CCalc.Clicks", this.parsedValue);
			Game.scheduleUpdate();
		};
		Game.setInput("#sessionStartTime", Game.startDate);

		ele = byId("heraldsIn");
		ele.maxIn = 100;
		byId("heraldsInLabel").setTitleFunc = function() {
			var str = "";

			if (Game.heralds === 0) {
				str += 'There are no heralds at the moment. Please consider <b style="color:#bc3aff;">donating to DashNet\'s Patreon</b>!';
			} else {
				str += (Game.heralds === 1 ? '<b style="color:#bc3aff;text-shadow:0px 1px 0px #6d0096;">1 herald</b> is' :
					'<b style="color:#fff;text-shadow:0px 1px 0px #6d0096,0px 0px 6px #bc3aff;">' + Game.heralds + " heralds</b> are") +
					' selflessly inspiring a boost in production for everyone, resulting in<br><b style="color:#cdaa89;text-shadow:0px 1px 0px #7c4532,0px 0px 6px #7c4532;"><div style="width:16px;height:16px;display:inline-block;vertical-align:middle;background:url(img/money.png);"></div> +' +
					Game.heralds + "% cookies per second</b>." +
					'<div class="line"></div>';
				if (Game.ascensionMode == 1) {
					str += "You are in a <b>Born again</b> run, and are not currently benefiting from heralds.";
				} else if (Game.HasUpgrade("Heralds")) {
					str += "You own the <b>Heralds</b> upgrade, and therefore benefit from the production boost.";
				} else {
					str +=
						"To benefit from the herald bonus, you need a special upgrade you do not yet own. You will permanently unlock it later in the game.";
				}
			}
			str +=
				'<div class="line"></div><span style="font-size:90%;opacity:0.6;"><b>Heralds</b> are people who have donated to DashNet\'s highest Patreon tier, and are limited to 100.<br>Each herald gives everyone +1% CpS.<br>Heralds benefit everyone playing the game, regardless of whether you donated.</span>';

			str +=
				'<div style="width:31px;height:39px;background:url(img/heraldFlag.png);position:absolute;top:0px;left:8px;"></div><div style="width:31px;height:39px;background:url(img/heraldFlag.png);position:absolute;top:0px;right:8px;"></div>';

			this.dataset.title =
				'<div style="padding:8px;width:300px;text-align:center;" class="prompt"><h3>Heralds</h3><div class="block">' + str + "</div></div>";
		};

		twinInputs("#prestigeIn", "#prestigeCurrentIn");

		byId("buildTableTabs").onTabFunc =
			function() { $("#sellCheckSpan").toggleClass("hidden", !$("#buildTableTabPrice").hasClass("tabCurrent")); };

		byId("sellCheck").clickFunc = function() { $("#buildPriceTable").toggleClass("hideSell", !this.checked); };

		byId("buildChainMaxSpan").dataset.title = "Checks up to this many buildings ahead for the purchase of certain upgrades " +
			"and their required buildings.\n0 to disable. -1 for unlimited.";
		byId("buildChainMax").minIn = -1;

		addPlusMinusInput("#numWrinklersInSpan", "numWrinklersIn", 2, true).maxIn = Game.maxWrinklers;
		addPlusMinusInput("#numGoldenCookiesInSpan", "numGoldenCookiesIn", 4, true);

		$("#setCookiesBakedSpan").on("click", function() {
			if (Game.minCumulative > byId("cookiesBaked").parsedValue) {
				Game.setInput("#cookiesBaked", Game.minCumulative);
				Game.scheduleUpdate();
			}
			return false;
		});

		$("#setPrestigeSpan").on("click", function() {
			Game.setInput("#prestigeIn", Math.floor(Game.HowMuchPrestige(byId("cookiesReset").parsedValue)));
			Game.scheduleUpdate();
		});

		$("#setCookiesResetSpan").on("click", function() {
			Game.setInput("#cookiesReset", byId("setCookiesResetNum").setValue);
			Game.scheduleUpdate();
		});

		addPlusMinusInput("#seasonCountSpan", "seasonCountIn", true);
		Game.registerInput("#seasonCountIn", Game, "seasonUses");

		$(".lockCheckSpan").html('<input class="lockChecker" type="checkbox"> Toggle locks on click')
			.attr("data-title", "Ctrl-, alt-, and/or shift-click to do the opposite.")
			.find(".lockChecker").on("click", function(ev) {
			Game.lockChecked = this.checked;
			$(".lockChecker").prop("checked", Game.lockChecked);
			ev.stopPropagation();
		});

		$("#upgradeEnableShown").on("click", function() {
			$("#upgradeIcons .upgrade:not(.hidden)").each(function() {
				var upgrade = this.objTie;
				if (upgrade.pool !== "debug" && upgrade.pool !== "toggle") {
					upgrade.setBought(true);
				}
			});
			Game.scheduleUpdate();
		});

		$("#upgradeEnableAll").on("click", function() {
			for (var i = Game.UpgradesById.length - 1; i >= 0; i--) {
				var upgrade = Game.UpgradesById[i];
				if (upgrade.pool !== "debug" && upgrade.pool !== "toggle") {
					upgrade.setBought(true);
				}
			}
			Game.scheduleUpdate();
		});

		$("#upgradeDisableShown").on("click", function() {
			$("#upgradeIcons .upgrade:not(.hidden)").each(function() {
				var upgrade = this.objTie;
				if (upgrade.pool !== "debug" && upgrade.pool !== "toggle") {
					upgrade.setBought(false);
				}
			});
			Game.scheduleUpdate();
		});

		$("#upgradeDisableAll").on("click", function() {
			for (var i = Game.UpgradesById.length - 1; i >= 0; i--) {
				var upgrade = Game.UpgradesById[i];
				if (upgrade.pool !== "debug" && upgrade.pool !== "toggle") {
					upgrade.setBought(false);
				}
			}
			Game.scheduleUpdate();
		});

		$("#sortUpgrades").on("click", function() {
			// Game.sortAndFilterUpgrades();
			// Have to reupdate to make sure it's correct with sorting/filtering on recommended. Probably something or other with predictiveMode
			// that's not completely cleared. I saw ant larvae in the recommended filter despite not even having it, so something's screwy somewhere
			Game.scheduleUpdate();
		});

		$("#setAchFilter").on("click", function() {
			Game.filterAchievements();
		});

		//would love to only set .won if !.require() so game doesn't have to re-award achs
		//but as usual cps achievements make life difficult
		$("#achReset").on("click", function() {
			for (var i = Game.AchievementsById.length - 1; i >= 0; i--) {
				var achievement = Game.AchievementsById[i];
				if (achievement.require) {
					achievement.won = false;
				}
			}
			Game.scheduleUpdate();
		});

		//same as above
		$("#achDisableAll").on("click", function() {
			for (var i = Game.AchievementsById.length - 1; i >= 0; i--) {
				Game.AchievementsById[i].won = false;
			}
			Game.scheduleUpdate();
		});

		$("#achEnableAll").on("click", function() {
			for (var i = Game.AchievementsById.length - 1; i >= 0; i--) {
				var achieve = Game.AchievementsById[i];
				if (achieve.pool !== "dungeon") {
					achieve.won = true;
				}
			}
			Game.scheduleUpdate();
		});

		byId("blackCheckAll").clickFunc = function() {
			$("#blacklistEles .blacklistEle:not(.hidden) input").prop("checked", this.checked);
		};

		$("#blackClear").on("click", function() {
			var eles = $("#blacklistEles .blacklistEle.strike input");
			if (eles.length) {
				eles.prop("checked", false);
				Game.scheduleUpdate();
			}
		});


		$("input:not([type])").attr("type", "text");

		$('input[type="text"]:not(.text)').each(function() {
			if (!this.maxIn && this.hasAttribute("maxlength")) {
				this.maxIn = Math.pow(10, this.getAttribute("maxlength")) - 1;
			}
			if (!this.placeholder) {
				this.placeholder = Math.max(this.minIn, 0) || 0;
			}
			Game.setInput(this, this.value);
		});

		$('input[type="checkbox"]').each(function() {
			this.manualChecked = this.checked;
		});

		var workingIndex = 2;
		$("input, select, textarea, a[href]").each(function() {
			if (this.tabIndex) {
				workingIndex = Math.max(workingIndex, this.tabIndex + 1);
			} else {
				this.tabIndex = workingIndex;
			}
		});

		$("#gCookiesTable tbody").on("click", "td:nth-child(n + 2):not(.noSel)", function() {
			var cell = Game.getGCCellFrenzyIndeces(this).join(",");
			var listIndex = Game.gcSelectedCells.indexOf(cell);
			if (listIndex > -1) {
				Game.gcSelectedCells.splice(listIndex, 1);
			} else {
				Game.gcSelectedCells.push(cell);
			}
			Game.updateGoldenCookiesDetails();
		});

		$("#gCookiesDetails").on("click", ".close", function() {
			if (this.gcIndex) {
				var listIndex = Game.gcSelectedCells.indexOf(this.gcIndex);
				if (listIndex > -1) {
					Game.gcSelectedCells.splice(listIndex, 1);
					Game.updateGoldenCookiesDetails();
				}
			}
		});

		$("#gcClearSelected").on("click", function() {
			Game.gcSelectedCells = [];
			Game.updateGoldenCookiesDetails();
		});

		$("#recommendedList").on("click", ".recPurchase", function(ev) {
			var recObj = this.recommendObj;
			if (!recObj) { return false; }
			var altMode = Game.altMode || Game.checkEventAltMode(ev);

			if (recObj.type === "upgrade chain") {
				if (Game.altMode) {
					recObj.buy();
				} else {
					recObj.building.buy(Math.max(recObj.toAmount - recObj.building.amount, 0));
					recObj.gameObj.buy();
				}
			} else if (recObj.gameObj && recObj.gameObj.buy) {
				recObj.gameObj.buy(altMode ? 1 : recObj.toAmount - recObj.gameObj.amount);
			}

			Game.clearTooltip();
			Game.scheduleUpdate(1, function() {
				if (!Game.HasUpgrade("Century egg") && Game.cookiesPsPlusClicks !== recObj.cpsObj.cookiesPsPlusClicks) {
					console.error("CpS mismatch!", Game.cookiesPsPlusClicks, recObj.cpsObj.cookiesPsPlusClicks, recObj);
				}
			});

		}).on("mouseenter", ".earnedAchsSpan", function(ev) {

			var recObj = this.parentNode.recommendObj;
			if (!recObj || !recObj.earnedAchs || !recObj.earnedAchs.length) { return false; }
			if (!this.tooltipHtml) {
				var str = "";
				for (var i = 0; i < recObj.earnedAchs.length; i++) {
					str += "<div>" + recObj.earnedAchs[i].iconName + "</div>";
				}
				this.tooltipHtml = '<div class="tooltipAchsList">' + str.replace("<br>", "") + "</div>";
			}
			Game.setTooltip({
				html: this.tooltipHtml,
				refEle: this
			}); //, position: 'below'
			ev.stopPropagation();
		});

		$("#nextResearchSpan").on("click", function() {
			if (Game.nextTech) {
				Game.nextTech.setUnlocked(true);
				Game.scheduleUpdate();
			}
		});

		var getTooltipUpdateFunc = function(update) {
			if (this.objTie && this.objTie.getTooltip) {
				this.objTie.getTooltip(this, update);
			}
		};

		var updateTitle = function(update) {
			if (this.setTitleFunc) {
				this.setTitleFunc();
			}
			if (this.dataset.title || this.tooltipHTML) {
				Game.setTooltip({
					html: '<div class="titleTooltip">' + (this.dataset.title || this.tooltipHTML) + "</div>",
					refEle: this,
					isCrate: $(this).hasClass("crate")
				}, update);
			} else {
				Game.clearTooltip();
			}
		};

		$(/*document.forms[0]*/null).on("mouseenter", ".buildingRow .name, .crate, #nextResearchSpan", function() {
			if (this.objTie && this.objTie.getTooltip) {
				this.objTie.getTooltip(this);
				Game.updateTooltip = getTooltipUpdateFunc.bind(this);
			}

		}).on("mouseenter", "[data-title]", function() {
			var fn = updateTitle.bind(this);
			fn();
			Game.updateTooltip = fn;
			Game.tooltipAnchor = this;

		}).on("mouseleave", ".buildingRow .name, .crate, [data-title], .tooltipped", function() {
			Game.clearTooltip();

		}).on("input", 'input[type="text"]:not(.text)', function() {
			var val = Game.parseNumber(this.value, this.minIn, this.maxIn, !$(this).hasClass("deci"));
			if (val !== this.parsedValue && (!this.inputfn || this.inputFn(val))) {
				Game.setInput(this, val);
				if (this.checkFunc) {
					this.checkFunc();
				} else {
					Game.scheduleUpdate();
				}
			}

		}).on("focusout", 'input[type="text"]:not(.text)', function() {
			this.value = this.displayValue || this.parsedValue;

		}).on("focusin", 'input[type="text"]:not(.text)', function() {
			if (this.value !== String(this.parsedValue)) {
				this.value = this.parsedValue;
			}
			if (this.focusFunc) {
				this.focusFunc();
			}

		}).on("click", 'input[type="checkbox"]', function() {
			this.manualChecked = this.checked;
			if (this.clickFunc) {
				this.clickFunc();
			}
			Game.scheduleUpdate();

		}).on("click", ".plusminusCheck", function() {
			Game.scheduleUpdate();

		}).on("click", ".plusminus", function(ev) {
			if (this.plusminusIn.disabled) {
				return;
			}

			var amount = 1;
			if (!$(this).hasClass("limited")) {
				if (ev.ctrlKey ^ byId("plusminus10").checked) {
					amount = 10;
				}
				if (ev.shiftKey ^ byId("plusminus100").checked) {
					amount = 100;
				}
			}
			var prevVal = this.plusminusIn.parsedValue;
			var newVal = Game.setInput(this.plusminusIn, prevVal + amount * this.plusminusMode);
			if (prevVal !== newVal) {
				if (this.plusminusIn.checkFunc) {
					this.plusminusIn.checkFunc();
				} else {
					Game.scheduleUpdate();
				}
			}

		}).on("click", ".crate.upgrade", function(ev) {
			var upgrade = this.objTie;
			if (!upgrade || upgrade.type !== "upgrade") {
				return;
			}
			var lock = Game.lockChecked ^ Game.checkEventAltMode(ev);
			if (upgrade.noBuy || lock) {
				upgrade.unlocked = !upgrade.unlocked;
			} else {
				if (upgrade.toggleInto) {
					Game.clearTooltip();
				}
				var wasBought = upgrade.bought;
				upgrade.setBought();
				if (upgrade.buyFunc) {
					upgrade.buyFunc(wasBought);
				}
			}
			Game.scheduleUpdate();

		}).on("click", ".achievement", function() {
			var achieve = this.objTie;
			if (!achieve || achieve.type !== "achievement") {
				return;
			}
			achieve.setWon();
			Game.scheduleUpdate();

		}).on("click", ".setDesired", function() {
			if (!this.objTie || this.objTie.type !== "building") {
				return;
			}
			var val = this.objTie.amountInDesired.parsedValue;
			var newVal = Game.setInput(this.objTie.amountInDesired, this.objTie.amountInCurrent.parsedValue);
			if (val !== newVal) {
				Game.scheduleUpdate();
			}
		});

		foolsNameCheck.clickFunc = function() {
			Game.setObjectDisplays();
		};

		//#endregion event handlers and stuff


		// debug autosettings
		// byId("tabGarden").click();


		Game.setSeason(Game.defaultSeason);

		Game.update();
		Game.firstRun = false;
		$("form").removeClass("hidden");
		$("#load").addClass("hidden");

	};

})(myWindow, jQuery);


(function(window, $) {
	"use strict";

	var Game = window.Game;
	var byId = window.byId;

	Game.initMinigames = function() {

		var i, j;

		var iconCssReset = {
			backgroundPosition: "",
			backgroundImage: ""
		};

		//#region Pantheon
		var M = Game.pantheon;
		M.parent = Game.Objects["Temple"];
		M.parent.minigame = M;
		M.gods = {
			"asceticism": {
				name: "Holobore, Spirit of Asceticism",
				icon: [21, 18],
				desc1: '<span class="green">+15% base CpS.</span>',
				desc2: '<span class="green">+10% base CpS.</span>',
				desc3: '<span class="green">+5% base CpS.</span>',
				descAfter: '<span class="red">If a golden cookie is clicked, this spirit is unslotted and all worship swaps will be used up.</span>',
				quote: "An immortal life spent focusing on the inner self, away from the distractions of material wealth.",
			},
			"decadence": {
				name: "Vomitrax, Spirit of Decadence",
				icon: [22, 18],
				desc1: '<span class="green">Golden and wrath cookie effect duration +7%,</span> <span class="red">but buildings grant -7% CpS.</span>',
				desc2: '<span class="green">Golden and wrath cookie effect duration +5%,</span> <span class="red">but buildings grant -5% CpS.</span>',
				desc3: '<span class="green">Golden and wrath cookie effect duration +2%,</span> <span class="red">but buildings grant -2% CpS.</span>',
				quote: "This sleazy spirit revels in the lust for quick easy gain and contempt for the value of steady work.",
			},
			"ruin": {
				name: "Godzamok, Spirit of Ruin",
				icon: [23, 18],
				descBefore: '<span class="green">Selling buildings triggers a buff boosted by how many buildings were sold.</span>',
				desc1: '<span class="green">Buff boosts clicks by +1% for every building sold for 10 seconds.</span>',
				desc2: '<span class="green">Buff boosts clicks by +0.5% for every building sold for 10 seconds.</span>',
				desc3: '<span class="green">Buff boosts clicks by +0.25% for every building sold for 10 seconds.</span>',
				quote: "The embodiment of natural disasters. An impenetrable motive drives the devastation caused by this spirit.",
			},
			"ages": {
				name: "Cyclius, Spirit of Ages",
				icon: [24, 18],
				activeDescFunc: function() {
					var now = Date.now();
					var godLvl = Game.hasGod("ages");
					var mult = 1;
					if (godLvl == 1) { mult *= 0.15 * Math.sin((now / 1000 / (60 * 60 * 3)) * Math.PI * 2); } else if (godLvl == 2) {
						mult *= 0.15 * Math.sin((now / 1000 / (60 * 60 * 12)) * Math.PI * 2);
					} else if (godLvl == 3) { mult *= 0.15 * Math.sin((now / 1000 / (60 * 60 * 24)) * Math.PI * 2); }
					return "Current bonus : " + (mult < 0 ? "-" : "+") + Game.Beautify(Math.abs(mult) * 100, 2) + "%.";
				},
				descBefore: 'CpS bonus fluctuating between <span class="green">+15%</span> and <span class="red">-15%</span> over time.',
				desc1: "Effect cycles over 3 hours.",
				desc2: "Effect cycles over 12 hours.",
				desc3: "Effect cycles over 24 hours.",
				quote: "This spirit knows about everything you'll ever do, and enjoys dispensing a harsh judgement.",
			},
			"seasons": {
				name: "Selebrak, Spirit of Festivities",
				icon: [25, 18],
				descBefore: '<span class="green">Some seasonal effects are boosted.</span>',
				desc1: '<span class="green">Large boost.</span> <span class="red">Switching seasons is 100% pricier.</span>',
				desc2: '<span class="green">Medium boost.</span> <span class="red">Switching seasons is 50% pricier.</span>',
				desc3: '<span class="green">Small boost.</span> <span class="red">Switching seasons is 25% pricier.</span>',
				quote: "This is the spirit of merry getaways and regretful Monday mornings.",
			},
			"creation": {
				name: "Dotjeiess, Spirit of Creation",
				icon: [26, 18],
				desc1: '<span class="green">Buildings are 7% cheaper,</span> <span class="red">but heavenly chips have 30% less effect.</span>',
				desc2: '<span class="green">Buildings are 5% cheaper,</span> <span class="red">but heavenly chips have 20% less effect.</span>',
				desc3: '<span class="green">Buildings are 2% cheaper,</span> <span class="red">but heavenly chips have 10% less effect.</span>',
				quote: "All things that be and ever will be were scripted long ago by this spirit's inscrutable tendrils.",
			},
			"labor": {
				name: "Muridal, Spirit of Labor",
				icon: [27, 18],
				desc1: "Clicks are 15% more powerful, but buildings produce 3% less.",
				desc2: "Clicks are 10% more powerful, but buildings produce 2% less.",
				desc3: "Clicks are 5% more powerful, but buildings produce 1% less.",
				quote: "This spirit enjoys a good cheese after a day of hard work.",
			},
			"industry": {
				name: "Jeremy, Spirit of Industry",
				icon: [28, 18],
				desc1: '<span class="green">Buildings produce 10% more cookies,</span> <span class="red">but golden and wrath cookies appear 10% less.</span>',
				desc2: '<span class="green">Buildings produce 6% more cookies,</span> <span class="red">but golden and wrath cookies appear 6% less.</span>',
				desc3: '<span class="green">Buildings produce 3% more cookies,</span> <span class="red">but golden and wrath cookies appear 3% less.</span>',
				quote: "While this spirit has many regrets, helping you rule the world through constant industrialization is not one of them.",
			},
			"mother": {
				name: "Mokalsium, Mother Spirit",
				icon: [29, 18],
				desc1: '<span class="green">Milk is 10% more powerful,</span> <span class="red">but golden and wrath cookies appear 15% less.</span>',
				desc2: '<span class="green">Milk is 5% more powerful,</span> <span class="red">but golden and wrath cookies appear 10% less.</span>',
				desc3: '<span class="green">Milk is 3% more powerful,</span> <span class="red">but golden and wrath cookies appear 5% less.</span>',
				quote: "A caring spirit said to contain itself, inwards infinitely.",
			},
			"scorn": {
				name: "Skruuia, Spirit of Scorn",
				icon: [21, 19],
				descBefore: '<span class="red">All golden cookies are wrath cookies with a greater chance of a negative effect.</span>',
				desc1: '<span class="green">Wrinklers appear 150% faster and digest 15% more cookies.</span>',
				desc2: '<span class="green">Wrinklers appear 100% faster and digest 10% more cookies.</span>',
				desc3: '<span class="green">Wrinklers appear 50% faster and digest 5% more cookies.</span>',
				quote: "This spirit enjoys poking foul beasts and watching them squirm, but has no love for its own family.",
			},
			"order": {
				name: "Rigidel, Spirit of Order",
				icon: [22, 19],
				activeDescFunc: function() {
					if (Game.BuildingsOwned % 10 == 0) {
						return "Buildings owned : " + Game.Beautify(Game.BuildingsOwned) + ".<br>Effect is active.";
					} else { return "Buildings owned : " + Game.Beautify(Game.BuildingsOwned) + ".<br>Effect is inactive."; }
				},
				desc1: '<span class="green">Sugar lumps ripen an hour sooner.</span>',
				desc2: '<span class="green">Sugar lumps ripen 40 minutes sooner.</span>',
				desc3: '<span class="green">Sugar lumps ripen 20 minutes sooner.</span>',
				descAfter: '<span class="red">Effect is only active when your total amount of buildings ends with 0.</span>',
				quote: "You will find that life gets just a little bit sweeter if you can motivate this spirit with tidy numbers and properly-filled tax returns.",
			},
		};

		var n = 0;
		for (var key in M.gods) {
			var godObj = M.gods[key];
			godObj.id = n;
			godObj.key = key;
			godObj.slot = -1;
			godObj.iconCss = Game.getIconCss(godObj.icon);
			godObj.iconCssStr = Game.getIconCssStr(godObj.iconCss);
			M.godsById[n] = godObj;
			n++;
		}

		//programmatic because space between elements *sigh*
		for (i = 0; i < 3; i++) {
			$('<div id="pantheonSlot' + i + '" class="templeGod templeGod' + i + ' templeSlot tooltipped" data-slot="' + i + '" data-god="-1">' +
				'<div id="pantheonSlot' + i + 'Icon" class="usesIcon templeIcon hidden"></div>' +
				'<div class="usesIcon templeGem templeGem' + (i + 1) + '"></div></div>').appendTo("#pantheonSlots");
		}

		for (var name in M.gods) {
			godObj = M.gods[name];
			godObj.$ele = $('<div id="pantheonGod' + godObj.id + '" class="templeGod tooltipped" data-god="' + godObj.id + '"></div>').appendTo(
				"#pantheonAvailable");
			godObj.$iconEle = $('<div id="pantheonGod' + godObj.id + 'Icon" class="usesIcon templeIcon"></div>')
				.css(godObj.iconCss).appendTo(godObj.$ele);
		}

		Game.updatePantheonSelection = function() {
			var $godSlotSel = $("#pantheonSlots .templeGod.selected");
			var $godSel = $("#pantheonAvailable .templeGod.selected");
			var slotId = -1;
			var slottedGod = -1;
			var godId = -1;

			if ($godSlotSel.length === 1) {
				slotId = $godSlotSel.attr("data-slot");
				slottedGod = $godSlotSel.attr("data-god");
			}
			if ($godSel.length === 1) {
				godId = $godSel.attr("data-id");
			}

			$("#pantheonClearSelection").toggleClass("hidden", slotId == -1 && godId == -1);
			$("#pantheonSetGod").toggleClass("hidden", slotId == -1 || godId == -1 || (slottedGod != -1 && slottedGod == godId));
			$("#pantheonClearSlot").toggleClass("hidden", slotId == -1 || slottedGod == -1);
		};

		Game.clearPantheonSelection = function() {
			$("#pantheonBlock .templeGod.selected").removeClass("selected");
			Game.updatePantheonSelection();
		};
		byId("tabMinigames").onTabFunc = Game.clearPantheonSelection;

		Game.slotGodById = function(godId, slotId) {
			var godObj = Game.pantheon.godsById[godId];
			return Game.slotGod(godObj, slotId);
		};

		Game.slotGod = function(godObj, slotId) {
			if (godObj && godObj.key in Game.pantheon.gods && slotId in Game.pantheon.slot) {
				Game.clearGodSlot(slotId);

				Game.pantheon.slot[slotId] = godObj.id;
				godObj.slot = Number(slotId);

				godObj.$ele.addClass("hidden");

				$("#pantheonSlot" + slotId).attr("data-god", godObj.id);
				$("#pantheonSlot" + slotId + "Icon").css(godObj.iconCss).removeClass("hidden");
			}
		};

		Game.forceUnslotGod = function(godKey) {
			var godObj = M.gods[godKey];
			if (godObj && godObj.key in Game.pantheon.gods) {
				godObj.slot = -1;
				godObj.$ele.removeClass("hidden");
				Game.clearGodSlot(godObj.slot);
			}
		};

		Game.clearGodSlot = function(slotId) {
			if (slotId in Game.pantheon.slot) {
				var godObj = Game.pantheon.godsById[Game.pantheon.slot[slotId]];
				if (godObj) {
					godObj.slot = -1;
					godObj.$ele.removeClass("hidden");
				}

				Game.pantheon.slot[slotId] = -1;
				$("#pantheonSlot" + slotId).attr("data-god", -1);
				$("#pantheonSlot" + slotId + "Icon").css(iconCssReset).addClass("hidden");
			}
		};

		$("#pantheonBlock").on("click", ".templeGod", function() {
			var $ele = $(this);
			$ele.siblings().removeClass("selected");
			$ele.toggleClass("selected");
			Game.updatePantheonSelection();
			return false;

		}).on("mouseenter", ".templeGod", function(event) {
			var godObj = Game.pantheon.godsById[this.dataset.god];
			if (godObj) {
				Game.setTooltip({
					html: '<div class="templeGodTooltip">' +
						'<div class="icon templeGodIcon" style="' + godObj.iconCssStr + '"></div>' +
						'<div class="name">' + godObj.name + "</div>" +
						'<div class="line"></div><div class="description"><div class="templeEffectHeader">Effects :</div>' +
						(godObj.slot > -1 && godObj.activeDescFunc ?
							('<div class="templeEffect templeEffectOn templeEffectActive">' + godObj.activeDescFunc() + "</div>") : "") +
						(godObj.descBefore ? ('<div class="templeEffect">' + godObj.descBefore + "</div>") : "") +
						(godObj.desc1 ? ('<div class="templeEffect templeEffect1' + (godObj.slot == 0 ? " templeEffectOn" : "") +
							'"><div class="usesIcon shadowFilter templeGem templeGem1"></div>' + godObj.desc1 + "</div>") : "") +
						(godObj.desc2 ? ('<div class="templeEffect templeEffect2' + (godObj.slot == 1 ? " templeEffectOn" : "") +
							'"><div class="usesIcon shadowFilter templeGem templeGem2"></div>' + godObj.desc2 + "</div>") : "") +
						(godObj.desc3 ? ('<div class="templeEffect templeEffect3' + (godObj.slot == 2 ? " templeEffectOn" : "") +
							'"><div class="usesIcon shadowFilter templeGem templeGem3"></div>' + godObj.desc3 + "</div>") : "") +
						(godObj.descAfter ? ('<div class="templeEffect">' + godObj.descAfter + "</div>") : "") +
						(godObj.quote ? ("<q>" + godObj.quote + "</q>") : "") +
						"</div></div>",
					refEle: this
				});
			}
			event.stopPropagation();
		});

		$("#pantheonClearSelection").click(Game.clearPantheonSelection);

		$("#pantheonClearSlot").on("click", function() {
			Game.clearGodSlot($("#pantheonSlots .templeGod.selected").attr("data-slot"));
			Game.clearPantheonSelection();
			Game.scheduleUpdate();
		});

		$("#pantheonSetGod").on("click", function() {
			var $godSlotSel = $("#pantheonSlots .templeGod.selected");
			var $godSel = $("#pantheonAvailable .templeGod.selected");
			var slotId = -1;
			var slottedGod = -1;
			var godId = -1;

			if ($godSlotSel.length === 1) {
				slotId = $godSlotSel.attr("data-slot");
				slottedGod = $godSlotSel.attr("data-god");
			}
			if ($godSel.length === 1) {
				godId = $godSel.attr("data-god");
			}

			if (slotId != -1 && godId != -1 && slottedGod !== godId) {
				Game.slotGodById(godId, slotId);
				Game.clearPantheonSelection();
				Game.scheduleUpdate();
			} else {
				Game.updatePantheonSelection();
			}
		});

		M.reset = function() {
			for (var i = 0; i < 3; i++) {
				Game.clearGodSlot(i);
			}
		};

		M.load = function(str) {
			if (!str) { return false; }

			var pantheonSlots = [-1, -1, -1];

			var ids = (str.split(" ")[0] || "").split("/");
			for (var j = 0; j < 3; j++) {
				pantheonSlots[j] = ids[j] || -1;
			}

			for (var i = 0; i < 3; i++) {
				Game.slotGodById(pantheonSlots[i], i);
			}
		};

		//#endregion Pantheon


		//#region Garden

		M = Game.garden;
		M.parent = Game.Objects["Farm"];
		M.parent.minigame = M;

		M.toggleFreeze = function(toggle) {
			if (typeof toggle === "undefined") { toggle = !this.freeze; }
			this.freeze = Boolean(toggle);
			$("#gardenFreezeTool").toggleClass("on", this.freeze);
			return this.freeze;
		};

		M.plants = {
			"bakerWheat": {
				name: "Baker's wheat",
				icon: 0,
				cost: 1,
				costM: 30,
				ageTick: 7,
				ageTickR: 2,
				mature: 35,
				children: ["bakerWheat", "thumbcorn", "cronerice", "bakeberry", "clover", "goldenClover", "chocoroot", "tidygrass"],
				effsStr: "<div class=\"green\">&bull; +1% CpS</div>",
				defaultUnlocked: true,
				q: "A plentiful crop whose hardy grain is used to make flour for pastries."
			},
			"thumbcorn": {
				name: "Thumbcorn",
				icon: 1,
				cost: 5,
				costM: 100,
				ageTick: 6,
				ageTickR: 2,
				mature: 20,
				children: ["bakerWheat", "cronerice", "gildmillet", "glovemorel"],
				effsStr: "<div class=\"green\">&bull; +2% cookies per click</div>",
				q: "A strangely-shaped variant of corn. The amount of strands that can sprout from one seed is usually in the single digits."
			},
			"cronerice": {
				name: "Cronerice",
				icon: 2,
				cost: 15,
				costM: 250,
				ageTick: 0.4,
				ageTickR: 0.7,
				mature: 70,
				children: ["thumbcorn", "gildmillet", "elderwort", "wardlichen"],
				effsStr: "<div class=\"green\">&bull; +3% grandma CpS</div>",
				q: "Not only does this wrinkly bulb look nothing like rice, it's not even related to it either; its closest extant relative is the weeping willow."
			},
			"gildmillet": {
				name: "Gildmillet",
				icon: 3,
				cost: 15,
				costM: 1500,
				ageTick: 2,
				ageTickR: 1.5,
				mature: 40,
				children: ["clover", "goldenClover", "shimmerlily"],
				effsStr: "<div class=\"green\">&bull; +1% golden cookie gains</div><div class=\"green\">&bull; +0.1% golden cookie effect duration</div>",
				q: "An ancient staple crop, famed for its golden sheen. Was once used to bake birthday cakes for kings and queens of old."
			},
			"clover": {
				name: "Ordinary clover",
				icon: 4,
				cost: 25,
				costM: 77777,
				ageTick: 1,
				ageTickR: 1.5,
				mature: 35,
				children: ["goldenClover", "greenRot", "shimmerlily"],
				effsStr: "<div class=\"green\">&bull; +1% golden cookie frequency</div>",
				q: "<i>Trifolium repens</i>, a fairly mundane variety of clover with a tendency to produce four leaves. Such instances are considered lucky by some."
			},
			"goldenClover": {
				name: "Golden clover",
				icon: 5,
				cost: 125,
				costM: 777777777777,
				ageTick: 4,
				ageTickR: 12,
				mature: 50,
				children: [],
				effsStr: "<div class=\"green\">&bull; +3% golden cookie frequency</div>",
				q: "A variant of the ordinary clover that traded its chlorophyll for pure organic gold. Tragically short-lived, this herb is an evolutionary dead-end - but at least it looks pretty."
			},
			"shimmerlily": {
				name: "Shimmerlily",
				icon: 6,
				cost: 60,
				costM: 777777,
				ageTick: 5,
				ageTickR: 6,
				mature: 70,
				children: ["elderwort", "whiskerbloom", "chimerose", "cheapcap"],
				effsStr: "<div class=\"green\">&bull; +1% golden cookie gains</div><div class=\"green\">&bull; +1% golden cookie frequency</div><div class=\"green\">&bull; +1% random drops</div>",
				q: "These little flowers are easiest to find at dawn, as the sunlight refracting in dew drops draws attention to their pure-white petals."
			},
			"elderwort": {
				name: "Elderwort",
				icon: 7,
				cost: 180,
				costM: 100000000,
				ageTick: 0.3,
				ageTickR: 0.5,
				mature: 90,
				immortal: 1,
				noContam: true,
				detailsStr: "Immortal",
				children: ["everdaisy", "ichorpuff", "shriekbulb"],
				effsStr: "<div class=\"green\">&bull; +1% wrath cookie gains</div><div class=\"green\">&bull; +1% wrath cookie frequency</div><div class=\"green\">&bull; +1% grandma CpS</div><div class=\"green\">&bull; immortal</div><div class=\"gray\">&bull; surrounding plants (3x3) age 3% faster</div>",
				q: "A very old, long-forgotten subspecies of edelweiss that emits a strange, heady scent. There is some anecdotal evidence that these do not undergo molecular aging."
			},
			"bakeberry": {
				name: "Bakeberry",
				icon: 8,
				cost: 45,
				costM: 100000000,
				ageTick: 1,
				ageTickR: 1,
				mature: 50,
				children: ["queenbeet"],
				harvestBonus: [30 * 60, 0.03],
				effsStr: "<div class=\"green\">&bull; +1% CpS</div><div class=\"green\">&bull; harvest when mature for +30 minutes of CpS (max. 3% of bank)</div>",
				q: "A favorite among cooks, this large berry has a crunchy brown exterior and a creamy red center. Excellent in pies or chicken stews."
			},
			"chocoroot": {
				name: "Chocoroot",
				icon: 9,
				cost: 15,
				costM: 100000,
				ageTick: 4,
				ageTickR: 0,
				mature: 25,
				detailsStr: "Predictable growth",
				children: ["whiteChocoroot", "drowsyfern", "queenbeet"],
				harvestBonus: [3 * 60, 0.03],
				effsStr: "<div class=\"green\">&bull; +1% CpS</div><div class=\"green\">&bull; harvest when mature for +3 minutes of CpS (max. 3% of bank)</div><div class=\"green\">&bull; predictable growth</div>",
				q: "A tangly bramble coated in a sticky, sweet substance. Unknown genetic ancestry. Children often pick these from fields as-is as a snack."
			},
			"whiteChocoroot": {
				name: "White chocoroot",
				icon: 10,
				cost: 15,
				costM: 100000,
				ageTick: 4,
				ageTickR: 0,
				mature: 25,
				detailsStr: "Predictable growth",
				children: ["whiskerbloom", "tidygrass"],
				harvestBonus: [3 * 60, 0.03],
				effsStr: "<div class=\"green\">&bull; +1% golden cookie gains</div><div class=\"green\">&bull; harvest when mature for +3 minutes of CpS (max. 3% of bank)</div><div class=\"green\">&bull; predictable growth</div>",
				q: "A pale, even sweeter variant of the chocoroot. Often impedes travelers with its twisty branches."
			},
			"whiteMildew": {
				name: "White mildew",
				fungus: true,
				icon: 26,
				cost: 20,
				costM: 9999,
				ageTick: 8,
				ageTickR: 12,
				mature: 70,
				detailsStr: "Spreads easily",
				children: ["brownMold", "whiteChocoroot", "wardlichen", "greenRot"],
				effsStr: "<div class=\"green\">&bull; +1% CpS</div><div class=\"gray\">&bull; may spread as brown mold</div>",
				q: "A common rot that infests shady plots of earth. Grows in little creamy capsules. Smells sweet, but sadly wilts quickly."
			},
			"brownMold": {
				name: "Brown mold",
				fungus: true,
				icon: 27,
				cost: 20,
				costM: 9999,
				ageTick: 8,
				ageTickR: 12,
				mature: 70,
				detailsStr: "Spreads easily",
				children: ["whiteMildew", "chocoroot", "keenmoss", "wrinklegill"],
				effsStr: "<div class=\"red\">&bull; -1% CpS</div><div class=\"gray\">&bull; may spread as white mildew</div>",
				q: "A common rot that infests shady plots of earth. Grows in odd reddish clumps. Smells bitter, but thankfully wilts quickly."
			},
			"meddleweed": {
				name: "Meddleweed",
				weed: true,
				icon: 29,
				cost: 1,
				costM: 10,
				ageTick: 10,
				ageTickR: 6,
				mature: 50,
				contam: 0.05,
				detailsStr: "Grows in empty tiles, spreads easily",
				children: ["meddleweed", "brownMold", "crumbspore"],
				effsStr: "<div class=\"red\">&bull; useless</div><div class=\"red\">&bull; may overtake nearby plants</div><div class=\"gray\">&bull; may sometimes drop spores when uprooted</div>",
				q: "The sign of a neglected farmland, this annoying weed spawns from unused dirt and may sometimes spread to other plants, killing them in the process."
			},
			"whiskerbloom": {
				name: "Whiskerbloom",
				icon: 11,
				cost: 20,
				costM: 1000000,
				ageTick: 2,
				ageTickR: 2,
				mature: 60,
				children: ["chimerose", "nursetulip"],
				effsStr: "<div class=\"green\">&bull; +0.2% effects from milk</div>",
				q: "Squeezing the translucent pods makes them excrete a milky liquid, while producing a faint squeak akin to a cat's meow."
			},
			"chimerose": {
				name: "Chimerose",
				icon: 12,
				cost: 15,
				costM: 242424,
				ageTick: 1,
				ageTickR: 1.5,
				mature: 30,
				children: ["chimerose"],
				effsStr: "<div class=\"green\">&bull; +1% reindeer gains</div><div class=\"green\">&bull; +1% reindeer frequency</div>",
				q: "Originating in the greener flanks of polar mountains, this beautiful flower with golden accents is fragrant enough to make any room feel a little bit more festive."
			},
			"nursetulip": {
				name: "Nursetulip",
				icon: 13,
				cost: 40,
				costM: 1000000000,
				ageTick: 0.5,
				ageTickR: 2,
				mature: 60,
				children: [],
				effsStr: "<div class=\"green\">&bull; surrounding plants (3x3) are 20% more efficient</div><div class=\"red\">&bull; -2% CpS</div>",
				q: "This flower grows an intricate root network that distributes nutrients throughout the surrounding soil. The reason for this seemingly altruistic behavior is still unknown."
			},
			"drowsyfern": {
				name: "Drowsyfern",
				icon: 14,
				cost: 90,
				costM: 100000,
				ageTick: 0.05,
				ageTickR: 0.1,
				mature: 30,
				children: [],
				effsStr: "<div class=\"green\">&bull; +3% CpS</div><div class=\"red\">&bull; -5% cookies per click</div><div class=\"red\">&bull; -10% golden cookie frequency</div>",
				q: "Traditionally used to brew a tea that guarantees a good night of sleep."
			},
			"wardlichen": {
				name: "Wardlichen",
				icon: 15,
				cost: 10,
				costM: 10000,
				ageTick: 5,
				ageTickR: 4,
				mature: 65,
				children: ["wardlichen"],
				effsStr: "<div class=\"gray\">&bull; 2% less wrath cookies</div><div class=\"gray\">&bull; wrinklers spawn 15% slower</div>",
				q: "The metallic stench that emanates from this organism has been known to keep insects and slugs away."
			},
			"keenmoss": {
				name: "Keenmoss",
				icon: 16,
				cost: 50,
				costM: 1000000,
				ageTick: 4,
				ageTickR: 5,
				mature: 65,
				children: ["drowsyfern", "wardlichen", "keenmoss"],
				effsStr: "<div class=\"green\">&bull; +3% random drops</div>",
				q: "Fuzzy to the touch and of a vibrant green. In plant symbolism, keenmoss is associated with good luck for finding lost objects."
			},
			"queenbeet": {
				name: "Queenbeet",
				icon: 17,
				cost: 90,
				costM: 1000000000,
				ageTick: 1,
				ageTickR: 0.4,
				mature: 80,
				noContam: true,
				children: ["duketater", "queenbeetLump", "shriekbulb"],
				harvestBonus: [60 * 60, 0.06],
				effsStr: "<div class=\"green\">&bull; +0.3% golden cookie effect duration</div><div class=\"red\">&bull; -2% CpS</div><div class=\"green\">&bull; harvest when mature for +1 hour of CpS (max. 4% of bank)</div>",
				q: "A delicious taproot used to prepare high-grade white sugar. Entire countries once went to war over these."
			},
			"queenbeetLump": {
				name: "Juicy queenbeet",
				icon: 18,
				plantable: false,
				cost: 120,
				costM: 1000000000000,
				ageTick: 0.04,
				ageTickR: 0.08,
				mature: 85,
				noContam: true,
				children: [],
				effsStr: "<div class=\"red\">&bull; -10% CpS</div><div class=\"red\">&bull; surrounding plants (3x3) are 20% less efficient</div><div class=\"green\">&bull; harvest when mature for a sugar lump</div>",
				q: "A delicious taproot used to prepare high-grade white sugar. Entire countries once went to war over these.<br>It looks like this one has grown especially sweeter and juicier from growing in close proximity to other queenbeets."
			},
			"duketater": {
				name: "Duketater",
				icon: 19,
				cost: 480,
				costM: 1000000000000,
				ageTick: 0.3,
				ageTickR: 0.4,
				mature: 95,
				noContam: true,
				children: ["shriekbulb"],
				harvestBonus: [2 * 60 * 60, 0.08],
				effsStr: "<div class=\"green\">&bull; harvest when mature for +2 hours of CpS (max. 8% of bank)</div>",
				q: "A rare, rich-tasting tuber fit for a whole meal, as long as its strict harvesting schedule is respected. Its starch has fascinating baking properties."
			},
			"crumbspore": {
				name: "Crumbspore",
				fungus: true,
				icon: 20,
				cost: 10,
				costM: 999,
				ageTick: 3,
				ageTickR: 3,
				mature: 65,
				contam: 0.03,
				noContam: true,
				detailsStr: "Spreads easily",
				children: ["crumbspore", "glovemorel", "cheapcap", "doughshroom", "wrinklegill", "ichorpuff"],
				effsStr: "<div class=\"green\">&bull; explodes into up to 1 minute of CpS at the end of its lifecycle (max. 1% of bank)</div><div class=\"red\">&bull; may overtake nearby plants</div>",
				q: "An archaic mold that spreads its spores to the surrounding dirt through simple pod explosion."
			},
			"doughshroom": {
				name: "Doughshroom",
				fungus: true,
				icon: 24,
				cost: 100,
				costM: 100000000,
				ageTick: 1,
				ageTickR: 2,
				mature: 85,
				contam: 0.03,
				noContam: true,
				detailsStr: "Spreads easily",
				children: ["crumbspore", "doughshroom", "foolBolete", "shriekbulb"],
				harvestBonus: [5 * 60, 0.03, true, true],
				effsStr: "<div class=\"green\">&bull; explodes into up to 5 minutes of CpS at the end of its lifecycle (max. 3% of bank)</div><div class=\"red\">&bull; may overtake nearby plants</div>",
				q: "Jammed full of warm spores; some forest walkers often describe the smell as similar to passing by a bakery."
			},
			"glovemorel": {
				name: "Glovemorel",
				fungus: true,
				icon: 21,
				cost: 30,
				costM: 10000,
				ageTick: 3,
				ageTickR: 18,
				mature: 80,
				children: [],
				effsStr: "<div class=\"green\">&bull; +4% cookies per click</div><div class=\"green\">&bull; +1% cursor CpS</div><div class=\"red\">&bull; -1% CpS</div>",
				q: "Touching its waxy skin reveals that the interior is hollow and uncomfortably squishy."
			},
			"cheapcap": {
				name: "Cheapcap",
				fungus: true,
				icon: 22,
				cost: 40,
				costM: 100000,
				ageTick: 6,
				ageTickR: 16,
				mature: 40,
				children: [],
				effsStr: "<div class=\"green\">&bull; buildings and upgrades are 0.2% cheaper</div><div class=\"red\">&bull; cannot handle cold climates; 15% chance to die when frozen</div>",
				q: "Small, tough, and good in omelettes. Some historians propose that the heads of dried cheapcaps were once used as currency in some bronze age societies."
			},
			"foolBolete": {
				name: "Fool's bolete",
				fungus: true,
				icon: 23,
				cost: 15,
				costM: 10000,
				ageTick: 5,
				ageTickR: 25,
				mature: 50,
				children: [],
				effsStr: "<div class=\"green\">&bull; +2% golden cookie frequency</div><div class=\"red\">&bull; -5% golden cookie gains</div><div class=\"red\">&bull; -2% golden cookie duration</div><div class=\"red\">&bull; -2% golden cookie effect duration</div>",
				q: "Named for its ability to fool mushroom pickers. The fool's bolete is not actually poisonous, it's just extremely bland."
			},
			"wrinklegill": {
				name: "Wrinklegill",
				fungus: true,
				icon: 25,
				cost: 20,
				costM: 1000000,
				ageTick: 1,
				ageTickR: 3,
				mature: 65,
				children: ["elderwort", "shriekbulb"],
				effsStr: "<div class=\"gray\">&bull; wrinklers spawn 2% faster</div><div class=\"gray\">&bull; wrinklers eat 1% more</div>",
				q: "This mushroom's odor resembles that of a well-done steak, and is said to whet the appetite - making one's stomach start gurgling within seconds."
			},
			"greenRot": {
				name: "Green rot",
				fungus: true,
				icon: 28,
				cost: 60,
				costM: 1000000,
				ageTick: 12,
				ageTickR: 13,
				mature: 65,
				children: ["keenmoss", "foolBolete"],
				effsStr: "<div class=\"green\">&bull; +0.5% golden cookie duration</div><div class=\"green\">&bull; +1% golden cookie frequency</div><div class=\"green\">&bull; +1% random drops</div>",
				q: "This short-lived mold is also known as \"emerald pebbles\", and is considered by some as a pseudo-gem that symbolizes good fortune."
			},
			"shriekbulb": {
				name: "Shriekbulb",
				icon: 30,
				cost: 60,
				costM: 4444444444444,
				ageTick: 3,
				ageTickR: 1,
				mature: 60,
				noContam: true,
				detailsStr: "The unfortunate result of some plant combinations",
				children: ["shriekbulb"],
				effsStr: "<div class=\"red\">&bull; -2% CpS</div><div class=\"red\">&bull; surrounding plants (3x3) are 5% less efficient</div>",
				q: "A nasty vegetable with a dreadful quirk : its flesh resonates with a high-pitched howl whenever it is hit at the right angle by sunlight, moonlight, or even a slight breeze."
			},
			"tidygrass": {
				name: "Tidygrass",
				icon: 31,
				cost: 90,
				costM: 100000000000000,
				ageTick: 0.5,
				ageTickR: 0,
				mature: 40,
				children: ["everdaisy"],
				effsStr: "<div class=\"green\">&bull; surrounding tiles (5x5) develop no weeds or fungus</div>",
				q: "The molecules this grass emits are a natural weedkiller. Its stems grow following a predictable pattern, making it an interesting -if expensive- choice for a lawn grass."
			},
			"everdaisy": {
				name: "Everdaisy",
				icon: 32,
				cost: 180,
				costM: 100000000000000000000,
				ageTick: 0.3,
				ageTickR: 0,
				mature: 75,
				noContam: true,
				immortal: 1,
				detailsStr: "Immortal",
				children: [],
				effsStr: "<div class=\"green\">&bull; surrounding tiles (3x3) develop no weeds or fungus</div><div class=\"green\">&bull; immortal</div>",
				q: "While promoted by some as a superfood owing to its association with longevity and intriguing geometry, this elusive flower is actually mildly toxic."
			},
			"ichorpuff": {
				name: "Ichorpuff",
				fungus: true,
				icon: 33,
				cost: 120,
				costM: 987654321,
				ageTick: 1,
				ageTickR: 1.5,
				mature: 35,
				children: [],
				effsStr: "<div class=\"green\">&bull; surrounding plants (3x3) age half as fast</div><div class=\"red\">&bull; surrounding plants (3x3) are half as efficient</div>",
				q: "This puffball mushroom contains sugary spores, but it never seems to mature to bursting on its own. Surrounding plants under its influence have a very slow metabolism, reducing their effects but lengthening their lifespan."
			}
		};
		M.plantsById = [];
		M.harvestBonusPlants = [];
		n = 0;

		for (i in M.plants) {
			var plant = M.plants[i];
			// plant.unlocked = Boolean(plant.defaultUnlocked);
			plant.id = n;
			plant.key = i;
			plant.matureBase = plant.mature;
			M.plantsById[n] = plant;
			if (typeof plant.plantable === "undefined") { plant.plantable = true; }

			plant.iconCss = [];
			plant.iconCssStr = [];
			for (j = 0; j < 5; j++) {
				plant.iconCss[j] = Game.getIconCss([j, plant.icon]);
				plant.iconCssStr[j] = Game.getIconCssStr(plant.iconCss[j]);
			}


			if (plant.harvestBonus) {
				plant.harvestBonusCell = row.children[1];
				M.harvestBonusPlants.push(plant);
			}

			n++;
		}
		M.numPlants = M.plantsById.length;

		M.computeMatures = function() {
			var mult = 1;
			if (Game.HasAchiev("Seedless to nay")) { mult = 0.95; }
			for (var i = this.numPlants - 1; i >= 0; i--) {
				this.plantsById[i].mature = this.plantsById[i].matureBase * mult;
			}
		};

		M.toggleGardenFillBtn = function() {
			$("#gardenFillAllPlots").toggleClass("hidden", this.getNewSeedAge(this.plantsById[this.seedSelected]) < 0);
		};

		M.selectSeed = function(plant, force) {
			var id = -1;
			$("#gardenSeedBlock .gardenSeed.on").removeClass("on");
			if (plant && (force || this.seedSelected !== plant.id)) {
				id = plant.id;
				plant.$seedBlock.addClass("on");
			}
			this.seedSelected = id;
			$("#gardenDeselectSeed").toggleClass("invisible", id === -1);
			this.toggleGardenFillBtn();
		};

		M.toggleSeed = function(plant, toggle) {
			toggle = typeof toggle === "undefined" ? !plant.unlocked : Boolean(toggle);
			plant.unlocked = Boolean(toggle || plant.defaultUnlocked);
			this.updateSeedBlock(plant);
			return plant.unlocked;
		};

		M.updateSeedBlock = function(plant) {
			if (plant && plant.$seedBlock) {
				plant.$seedBlock.toggleClass("locked", !plant.unlocked);
			}
		};

		M.getCost = function(plant) {
			if (Game.HasUpgrade("Turbo-charged soil")) { return 0; }
			return Math.max(plant.costM, Game.cookiesPs * plant.cost * 60) * (Game.HasAchiev("Seedless to nay") ? 0.95 : 1);
		};

		M.getPlantDesc = function(plant) {
			var children = "";
			if (plant.children.length > 0) {
				children += '<div class="shadowFilter inline-block">';
				for (var i = 0; i < plant.children.length; i++) {
					var it = this.plants[plant.children[i]];
					if (!it) { console.log("No plant named " + plant.children[i]); }
					if (it) {
						children += '<div class="gardenSeedTiny" style="' + it.iconCssStr[0] + '"></div>';
					}
				}
				children += "</div>";
			}

			return ('<div class="description">' +
				(!plant.immortal ? ('<div class="gardenDescMargin gardenDescFont"><b>Average lifespan :</b> ' +
					Game.sayTime(((100 / (plant.ageTick + plant.ageTickR / 2)) * this.stepT) * 30, -1) +
					" <small>(" + Game.Beautify(Math.ceil((100 / ((plant.ageTick + plant.ageTickR / 2))) * (1))) + " ticks)</small></div>") : "") +
				'<div class="gardenDescMargin gardenDescFont"><b>Average maturation :</b> ' +
				Game.sayTime(((100 / ((plant.ageTick + plant.ageTickR / 2))) * (plant.mature / 100) * this.stepT) * 30, -1) +
				" <small>(" + Game.Beautify(Math.ceil((100 / ((plant.ageTick + plant.ageTickR / 2))) * (plant.mature / 100))) +
				" ticks)</small></div>" +
				(plant.weed ? '<div class="gardenDescMargin gardenDescFont"><b>Is a weed</b></div>' : "") +
				(plant.fungus ? '<div class="gardenDescMargin gardenDescFont"><b>Is a fungus</b></div>' : "") +
				(plant.detailsStr ? ('<div class="gardenDescMargin gardenDescFont"><b>Details :</b> ' + plant.detailsStr + "</div>") : "") +
				(children != "" ? ('<div class="gardenDescMargin gardenDescFont"><b>Possible mutations :</b> ' + children + "</div>") : "") +
				'<div class="line"></div>' +
				'<div class="gardenDescMargin"><b>Effects :</b></div>' +
				'<div class="gardenDescFont bold">' + plant.effsStr + "</div>" +
				(plant.q ? ("<q>" + plant.q + "</q>") : "") +
				"</div>");
		};

		M.soils = {
			"dirt": {
				name: "Dirt",
				icon: 0,
				tick: 5,
				effMult: 1,
				weedMult: 1,
				req: 0,
				effsStr: '<div class="gray">&bull; tick every <b>5 minutes</b></div>',
				q: "Simple, regular old dirt that you'd find in nature.",
			},
			"fertilizer": {
				name: "Fertilizer",
				icon: 1,
				tick: 3,
				effMult: 0.75,
				weedMult: 1.2,
				req: 50,
				effsStr: '<div class="gray">&bull; tick every <b>3 minutes</b></div><div class="red">&bull; passive plant effects <b>-25%</b></div><div class="red">&bull; weeds appear <b>20%</b> more</div>',
				q: "Soil with a healthy helping of fresh manure. Plants grow faster but are less efficient.",
			},
			"clay": {
				name: "Clay",
				icon: 2,
				tick: 15,
				effMult: 1.25,
				weedMult: 1,
				req: 100,
				effsStr: '<div class="gray">&bull; tick every <b>15 minutes</b></div><div class="green">&bull; passive plant effects <b>+25%</b></div>',
				q: "Rich soil with very good water retention. Plants grow slower but are more efficient.",
			},
			"pebbles": {
				name: "Pebbles",
				icon: 3,
				tick: 5,
				effMult: 0.25,
				weedMult: 0.1,
				req: 200,
				effsStr: '<div class="gray">&bull; tick every <b>5 minutes</b></div><div class="red">&bull; passive plant effects <b>-75%</b></div><div class="green">&bull; <b>35% chance</b> of collecting seeds automatically when plants expire</div><div class="green">&bull; weeds appear <b>10 times</b> less</div>',
				q: "Dry soil made of small rocks tightly packed together. Not very conductive to plant health, but whatever falls off your crops will be easy to retrieve.<br>Useful if you're one of those farmers who just want to find new seeds without having to tend their garden too much.",
			},
			"woodchips": {
				name: "Wood chips",
				icon: 4,
				tick: 5,
				effMult: 0.25,
				weedMult: 0.1,
				req: 300,
				effsStr: '<div class="gray">&bull; tick every <b>5 minutes</b></div><div class="red">&bull; passive plant effects <b>-75%</b></div><div class="green">&bull; plants spread and mutate <b>3 times more</b></div><div class="green">&bull; weeds appear <b>10 times</b> less</div>',
				q: "Soil made of bits and pieces of bark and sawdust. Helpful for young sprouts to develop, not so much for mature plants.",
			},
		};

		M.soilsById = [];
		n = 0;
		for (i in M.soils) {
			var soil = M.soils[i];
			soil.id = n;
			soil.key = i;
			soil.iconCss = Game.getIconCss([soil.icon, 34]);
			soil.iconCssStr = Game.getIconCssStr(soil.iconCss);
			M.soilsById[n] = soil;
			soil.$soilBlock = $('<div id="gardenSoil-' + n + '" class="gardenSeed gardenSoil gardenSelectable tooltipped" data-soil-id="' + n + '">' +
				'<div id="gardenSoilIcon-' + n + '" class="gardenSeedIcon" style="' + soil.iconCssStr + '">' +
				"</div>").toggleClass("on", n === 0).appendTo("#gardenSoils");
			n++;
		}
		M.soil = 0;

		M.resetLockedSoil = true;

		M.toggleSoil = function(id) {
			var soil = this.soilsById[id];
			if (soil) {
				this.soil = soil.id;
				soil.$soilBlock.addClass("on").siblings(".gardenSoil").removeClass("on");
			}
		};

		M.computeStepT = function() {
			if (Game.HasUpgrade("Turbo-charged soil")) {
				this.stepT = 1;
			} else {
				this.stepT = this.soilsById[this.soil].tick * 60;
			}
		};

		M.plot = [];
		for (var y = 0; y < 6; y++) {
			M.plot[y] = [];
			for (var x = 0; x < 6; x++) {
				M.plot[y][x] = [0, 0];
			}
		}

		M.plotBoost = [];
		for (y = 0; y < 6; y++) {
			M.plotBoost[y] = [];
			for (x = 0; x < 6; x++) {
				//age mult, power mult, weed mult
				M.plotBoost[y][x] = [1, 1, 1];
			}
		}

		// M.plotLimits = [
		// 	[2, 2, 4, 4],
		// 	[2, 2, 5, 4],
		// 	[2, 2, 5, 5],
		// 	[1, 2, 5, 5],
		// 	[1, 1, 5, 5],
		// 	[1, 1, 6, 5],
		// 	[1, 1, 6, 6],
		// 	[0, 1, 6, 6],
		// 	[0, 0, 6, 6],
		// ];
		// M.isTileUnlocked = function (x, y) {
		// 	var level = this.parent.level;
		// 	level = Math.max(1, Math.min(this.plotLimits.length, level)) - 1;
		// 	var limits = this.plotLimits[level];
		// 	return (x >= limits[0] && x < limits[2] && y >= limits[1] && y < limits[3]);
		// };

		M.getNewSeedAge = function(plant) {
			var age = -1;
			if (plant) {
				switch ($('[name="gardenSeedAge"]:checked').val()) {
					case "mature":
						age = plant.mature + 1;
						break;
					case "bloom":
						age = Math.ceil(plant.mature * 0.666);
						break;
					case "sprout":
						age = Math.ceil(plant.mature * 0.333);
						break;
					case "bud":
						age = 0;
				}
			}
			return age;
		};

		M.setPlotTile = function(x, y, id, age) {
			if (typeof id === "undefined") { id = this.seedSelected; }
			var plant = this.plantsById[id];
			if (plant) {
				id = plant.id;
				if (typeof age === "undefined") {
					age = this.getNewSeedAge(plant);
				}
			} else {
				id = -1;
				age = 0;
			}
			age = Math.max(age, 0);
			if (plant && plant.immortal) {
				age = Math.min(plant.mature + 1, age);
			}

			var changed = false;

			if (this.plot[y] && this.plot[y][x]) {
				changed = this.plot[y][x][0] !== id + 1 || this.plot[y][x][1] !== age;

				this.plot[y][x] = [id + 1, age];
			}

			return changed;
		};

		M.tileTooltip = function(x, y) {
			var str = "";
			var boostStr = "<small>" +
				(M.plotBoost[y][x][0] != 1 ? "<br>Aging multiplier : " + Game.Beautify(M.plotBoost[y][x][0] * 100) + "%" : "") +
				(M.plotBoost[y][x][1] != 1 ? "<br>Effect multiplier : " + Game.Beautify(M.plotBoost[y][x][1] * 100) + "%" : "") +
				(M.plotBoost[y][x][2] != 1 ? "<br>Weeds/fungus repellent : " + Game.Beautify(100 - M.plotBoost[y][x][2] * 100) + "%" : "") +
				"</small>";

			var tile = M.plot[y][x];
			if (tile[0] == 0) {
				// var plant = M.plantsById[M.seedSelected];
				str = '<div class="alignCenter" style="padding:8px 4px;min-width:350px;">' +
					'<div class="name">Empty tile</div>' + '<div class="line"></div><div class="description">' +
					"This tile of soil is empty.<br>Pick a seed and plant something!" +
					boostStr +
					"</div>" +
					"</div>";

			} else {
				var plant = M.plantsById[tile[0] - 1];
				var stage = 0;
				if (tile[1] >= plant.mature) { stage = 4; } else if (tile[1] >= plant.mature * 0.666) { stage = 3; } else if (tile[1] >=
					plant.mature * 0.333) { stage = 2; } else { stage = 1; }

				str = '<div class="gardenTileTooltip">' +
					'<div class="icon" style="background:url(img/gardenPlants.png);float:left;margin-left:-8px;margin-top:-8px;' +
					plant.iconCssStr[stage] + '"></div>' +
					'<div class="name">' + plant.name + "</div><div><small>This plant is growing here.</small></div>" +
					'<div class="line"></div>' +
					'<div class="alignCenter">' +
					'<div class="gardenGrowthLine" style="background:linear-gradient(to right, #ffffff 0%, #00ff99 ' + plant.mature + "%, #33cc00 " +
					(plant.mature + 0.1) + '%, #996600 100%)">' +
					'<div class="gardenGrowthIndicator" style="left:' + Math.floor((tile[1] / 100) * 256) + 'px;"></div>' +
					'<div class="gardenGrowthIcon" style="' + plant.iconCssStr[1] + "left:" + (0 - 24) + 'px;"></div>' +
					'<div class="gardenGrowthIcon" style="' + plant.iconCssStr[2] + "left:" + ((((plant.mature * 0.333) / 100) * 256) - 24) +
					'px;"></div>' +
					'<div class="gardenGrowthIcon" style="' + plant.iconCssStr[3] + "left:" + ((((plant.mature * 0.666) / 100) * 256) - 24) +
					'px;"></div>' +
					'<div class="gardenGrowthIcon" style="' + plant.iconCssStr[4] + "left:" + ((((plant.mature) / 100) * 256) - 24) + 'px;"></div>' +
					"</div><br>" +
					"<b>Stage :</b> " + ["bud", "sprout", "bloom", "mature"][stage - 1] + "<br>" +
					"<small>" + (stage == 1 ? "Plant effects : 10%" : stage == 2 ? "Plant effects : 25%" :
						stage == 3 ? "Plant effects : 50%" : "Plant effects : 100%; may reproduce, will drop seed when harvested") + "</small>" +
					"<br><small>";

				if (stage < 4) {
					var mature = (100 / (M.plotBoost[y][x][0] * (plant.ageTick + plant.ageTickR / 2))) * ((plant.mature - tile[1]) / 100);
					str += "Mature in about " + Game.sayTime((mature * M.stepT) * 30, -1) +
						" (" + Game.Beautify(Math.ceil(mature)) + " tick" + (Math.ceil(mature) == 1 ? "" : "s") + ")";
				} else if (plant.immortal) {
					str += "Does not decay";
				} else {
					var decay = (100 / (M.plotBoost[y][x][0] * (plant.ageTick + plant.ageTickR / 2))) * ((100 - tile[1]) / 100);
					str += "Decays in about " + Game.sayTime((decay * M.stepT) * 30, -1) +
						" (" + Game.Beautify(Math.ceil(decay)) + " tick" + (Math.ceil(decay) == 1 ? "" : "s") + ")";
				}
				str += "</small>" +
					boostStr +
					"</div>" +
					// '<div class="line"></div>' +
					// '<div class="alignCenter">Click to ' + (stage == 4 ? "harvest" : "unearth") + ".</div>" +
					'<div class="line"></div>' +
					M.getPlantDesc(plant) +
					"</div>";
			}

			return str;
		};

		M.computeBoostPlot = function() {
			//some plants apply effects to surrounding tiles
			//this function computes those effects by creating a grid in which those effects stack
			for (var y = 0; y < 6; y++) {
				for (var x = 0; x < 6; x++) {
					//age mult, power mult, weed mult
					M.plotBoost[y][x] = [1, 1, 1];
				}
			}

			var effectOn = function(X, Y, s, mult) {
				for (var y = Math.max(0, Y - s); y < Math.min(6, Y + s + 1); y++) {
					for (var x = Math.max(0, X - s); x < Math.min(6, X + s + 1); x++) {
						if (X != x || Y != y) {
							for (var i = 0; i < mult.length; i++) {
								M.plotBoost[y][x][i] *= mult[i];
							}
						}
					}
				}
			};

			for (y = 0; y < 6; y++) {
				for (x = 0; x < 6; x++) {
					var tile = M.plot[y][x];
					if (tile[0] > 0) {
						var plant = M.plantsById[tile[0] - 1];
						var name = plant.key;
						var stage = 0;
						if (tile[1] >= plant.mature) { stage = 4; } else if (tile[1] >= plant.mature * 0.666) { stage = 3; } else if (tile[1] >=
							plant.mature * 0.333) { stage = 2; } else { stage = 1; }

						var soilMult = M.soilsById[M.soil].effMult;
						var mult = soilMult;

						if (stage == 1) { mult *= 0.1; } else if (stage == 2) { mult *= 0.25; } else if (stage == 3) { mult *= 0.5; } else {
							mult *= 1;
						}

						var ageMult = 1;
						var powerMult = 1;
						var weedMult = 1;
						var range = 0;

						if (name == "elderwort") {
							ageMult = 1.03;
							range = 1;
						} else if (name == "queenbeetLump") {
							powerMult = 0.8;
							range = 1;
						} else if (name == "nursetulip") {
							powerMult = 1.2;
							range = 1;
						} else if (name == "shriekbulb") {
							powerMult = 0.95;
							range = 1;
						} else if (name == "tidygrass") {
							weedMult = 0;
							range = 2;
						} else if (name == "everdaisy") {
							weedMult = 0;
							range = 1;
						} else if (name == "ichorpuff") {
							ageMult = 0.5;
							powerMult = 0.5;
							range = 1;
						}

						//by god i hope these are right
						if (ageMult >= 1) { ageMult = (ageMult - 1) * mult + 1; } else if (mult >= 1) {
							ageMult = 1 / ((1 / ageMult) * mult);
						} else { ageMult = 1 - (1 - ageMult) * mult; }

						if (powerMult >= 1) { powerMult = (powerMult - 1) * mult + 1; } else if (mult >= 1) {
							powerMult = 1 / ((1 / powerMult) * mult);
						} else { powerMult = 1 - (1 - powerMult) * mult; }

						if (range > 0) { effectOn(x, y, range, [ageMult, powerMult, weedMult]); }
					}
				}
			}
		};

		M.effsData = {
			cps: {n: "CpS"},
			click: {n: "cookies/click"},
			cursorCps: {n: "cursor CpS"},
			grandmaCps: {n: "grandma CpS"},
			goldenCookieGain: {n: "golden cookie gains"},
			goldenCookieFreq: {n: "golden cookie frequency"},
			goldenCookieDur: {n: "golden cookie duration"},
			goldenCookieEffDur: {n: "golden cookie effect duration"},
			wrathCookieGain: {n: "wrath cookie gains"},
			wrathCookieFreq: {n: "wrath cookie frequency"},
			wrathCookieDur: {n: "wrath cookie duration"},
			wrathCookieEffDur: {n: "wrath cookie effect duration"},
			reindeerGain: {n: "reindeer gains"},
			reindeerFreq: {n: "reindeer cookie frequency"},
			reindeerDur: {n: "reindeer cookie duration"},
			itemDrops: {n: "random drops"},
			milk: {n: "milk effects"},
			wrinklerSpawn: {n: "wrinkler spawn rate"},
			wrinklerEat: {n: "wrinkler appetite"},
			upgradeCost: {
				n: "upgrade costs",
				rev: true
			},
			buildingCost: {
				n: "building costs",
				rev: true
			},
		};

		M.computeEffs = function() {
			var effs = {};
			for (var n in this.effsData) {
				effs[n] = 1;
			}

			if (!this.freeze) {
				var soilMult = this.soilsById[this.soil].effMult;

				for (var y = 0; y < 6; y++) {
					for (var x = 0; x < 6; x++) {
						var tile = this.plot[y][x];
						if (tile[0] > 0) {
							var me = this.plantsById[tile[0] - 1];
							var name = me.key;
							var stage = 0;
							if (tile[1] >= me.mature) { stage = 4; } else if (tile[1] >= me.mature * 0.666) { stage = 3; } else if (tile[1] >=
								me.mature * 0.333) { stage = 2; } else { stage = 1; }

							var mult = soilMult;

							if (stage == 1) { mult *= 0.1; } else if (stage == 2) { mult *= 0.25; } else if (stage == 3) {
								mult *= 0.5;
							} else { mult *= 1; }

							mult *= this.plotBoost[y][x][1];

							if (name == "bakerWheat") { effs.cps += 0.01 * mult; } else if (name == "thumbcorn") {
								effs.click += 0.02 * mult;
							} else if (name == "cronerice") { effs.grandmaCps += 0.03 * mult; } else if (name == "gildmillet") {
								effs.goldenCookieGain += 0.01 * mult;
								effs.goldenCookieEffDur += 0.001 * mult;
							} else if (name == "clover") { effs.goldenCookieFreq += 0.01 * mult; } else if (name ==
								"goldenClover") { effs.goldenCookieFreq += 0.03 * mult; } else if (name == "shimmerlily") {
								effs.goldenCookieGain += 0.01 * mult;
								effs.goldenCookieFreq += 0.01 * mult;
								effs.itemDrops += 0.01 * mult;
							} else if (name == "elderwort") {
								effs.wrathCookieGain += 0.01 * mult;
								effs.wrathCookieFreq += 0.01 * mult;
								effs.grandmaCps += 0.01 * mult;
							} else if (name == "bakeberry") { effs.cps += 0.01 * mult; } else if (name == "chocoroot") {
								effs.cps += 0.01 * mult;
							} else if (name == "whiteChocoroot") { effs.goldenCookieGain += 0.01 * mult; } else if (name ==
								"whiteMildew") { effs.cps += 0.01 * mult; } else if (name == "brownMold") { effs.cps *= 1 - 0.01 * mult; }

							// else if (name == "meddleweed") {}

							else if (name == "whiskerbloom") { effs.milk += 0.002 * mult; } else if (name == "chimerose") {
								effs.reindeerGain += 0.01 * mult;
								effs.reindeerFreq += 0.01 * mult;
							} else if (name == "nursetulip") { effs.cps *= 1 - 0.02 * mult; } else if (name == "drowsyfern") {
								effs.cps += 0.03 * mult;
								effs.click *= 1 - 0.05 * mult;
								effs.goldenCookieFreq *= 1 - 0.1 * mult;
							} else if (name == "wardlichen") {
								effs.wrinklerSpawn *= 1 - 0.15 * mult;
								effs.wrathCookieFreq *= 1 - 0.02 * mult;
							} else if (name == "keenmoss") { effs.itemDrops += 0.03 * mult; } else if (name == "queenbeet") {
								effs.goldenCookieEffDur += 0.003 * mult;
								effs.cps *= 1 - 0.02 * mult;
							} else if (name == "queenbeetLump") { effs.cps *= 1 - 0.1 * mult; } else if (name == "glovemorel") {
								effs.click += 0.04 * mult;
								effs.cursorCps += 0.01 * mult;
								effs.cps *= 1 - 0.01 * mult;
							} else if (name == "cheapcap") {
								effs.upgradeCost *= 1 - 0.002 * mult;
								effs.buildingCost *= 1 - 0.002 * mult;
							} else if (name == "foolBolete") {
								effs.goldenCookieFreq += 0.02 * mult;
								effs.goldenCookieGain *= 1 - 0.05 * mult;
								effs.goldenCookieDur *= 1 - 0.02 * mult;
								effs.goldenCookieEffDur *= 1 - 0.02 * mult;
							} else if (name == "wrinklegill") {
								effs.wrinklerSpawn += 0.02 * mult;
								effs.wrinklerEat += 0.01 * mult;
							} else if (name == "greenRot") {
								effs.goldenCookieDur += 0.005 * mult;
								effs.goldenCookieFreq += 0.01 * mult;
								effs.itemDrops += 0.01 * mult;
							} else if (name == "shriekbulb") { effs.cps *= 1 - 0.02 * mult; }
						}
					}
				}
			}

			this.effs = effs;
		};

		$("#gardenInfoToolIcon").css(Game.getIconCss([3, 35]));
		$("#gardenFreezeToolIcon").css(Game.getIconCss([1, 35]));
		byId("gardenFreezeTool").dataset.title =
			'<div class="alignCenter">Cryogenically preserve your garden.<br>Plants no longer grow, spread or die; they provide no benefits.<br>' +
			'Soil cannot be changed.<div class="line"></div>Using this will effectively pause your garden.</div>';

		byId("gardenInfoTool").setTitleFunc = function() {
			var M = Game.garden;
			var str = "";

			if (M.freeze) {
				str = "Your garden is frozen, providing no effects.";
			} else {
				var effStr = "";
				for (var i in M.effsData) {
					if (M.effs[i] != 1 && M.effsData[i]) {
						var amount = (M.effs[i] - 1) * 100;
						effStr += '<div style="font-size:10px"><b>&bull; ' + M.effsData[i].n + ' :</b> <span class="' +
							((amount * (M.effsData[i].rev ? -1 : 1)) > 0 ? "green" : "red") +
							'">' + (amount > 0 ? "+" : "-") + Game.Beautify(Math.abs(M.effs[i] - 1) * 100, 2) + "%</span></div>";
					}
				}
				if (effStr == "") { effStr = '<div style="font-size:10px;"><b>None.</b></div>'; }
				str += "<div>Combined effects of all your plants :</div>" + effStr;
			}

			// str += '<div class="line"></div>' +
			// 	'<small style="line-height:100%;">&bull; You can cross-breed plants by planting them close to each other; new plants will grow in
			// the empty tiles next to them.' + "<br>&bull; Unlock new seeds by harvesting mature plants.<br>&bull; When you ascend, your garden
			// plants are reset, but you keep all the seeds you've unlocked." + "<br>&bull; Your garden has no effect and does not grow while the
			// game is closed.</small>";

			// this.dataset.title = '<div class="alignCenter">' + str + "</div>";
			this.dataset.title = str;
		};

		M.resetPlot = function() {
			for (var y = 0; y < 6; y++) {
				for (var x = 0; x < 6; x++) {
					this.setPlotTile(x, y, -1, 0);
				}
			}
		};

		M.randomizePlot = function() {
			for (var y = 0; y < 6; y++) {
				for (var x = 0; x < 6; x++) {
					var id = Math.floor(Math.random() * (this.numPlants + 1));
					var age = 0;
					if (id > 0) {
						age = Math.floor(Math.random() * 100);
					}
					this.setPlotTile(x, y, id, age);
				}
			}

			Game.scheduleUpdate();
		};

		M.reset = function() {
			this.toggleSoil(0);
			this.toggleFreeze(false);
			this.resetPlot();
		};

		M.load = function(str) {
			if (!str) { return false; }

			var spl = str.split(" ");
			var spl2 = spl[0].split(":");
			this.toggleSoil(parseInt(spl2[1], 10));
			this.toggleFreeze(parseInt(spl2[3], 10));

			var plot = spl[2] || 0;
			if (plot) {
				plot = plot.split(":");
				n = 0;
				for (var y = 0; y < 6; y++) {
					for (var x = 0; x < 6; x++) {
						this.setPlotTile(x, y, parseInt(plot[n], 10) - 1, parseInt(plot[n + 1], 10));
						n += 2;
					}
				}
			}
		};

		M.updateFunc = function() {
			this.computeMatures();
			this.computeBoostPlot();
			this.computeEffs();

			this.computeStepT();
		};

		M.updateHarvestBonus = function() {
			for (var i = this.harvestBonusPlants.length - 1; i >= 0; i--) {
				var plant = this.harvestBonusPlants[i];

				var cookies = plant.harvestBonus[0] * Game.cookiesPs;
				var bank = cookies / plant.harvestBonus[1];

				var html = Game.formatNumber(cookies) + " cookies " + (plant.harvestBonus[3] ? "max " : "") +
					(plant.harvestBonus[2] ? "on death" : "on harvest") +
					(plant.harvestBonus[3] ? " (average " + Game.formatNumber(cookies * 0.5) + ")" : "") +
					", Bank " + Game.formatNumber(bank);

				plant.harvestBonusCell.innerHTML = html;
			}
		};

		$("#gardenFreezeTool").on("click", function() {
			Game.garden.toggleFreeze();
			Game.scheduleUpdate();
		});

		$("#gardenSeedBlock").on("click", ".gardenSeed", function(ev) {
			var lock = Game.lockChecked ^ Game.checkEventAltMode(ev);
			var plant = Game.garden.plantsById[this.dataset.plantId];
			if (plant) {
				if (lock) {
					Game.garden.toggleSeed(plant);
				} else {
					Game.garden.selectSeed(plant);
				}

				Game.scheduleUpdate();
			}

		}).on("mouseenter", ".gardenSeed", function(ev) {
			var M = Game.garden;
			var plant = M.plantsById[this.dataset.plantId];
			if (plant) {
				Game.setTooltip({
					html: '<div class="gardenSeedTooltip">' +
						'<div class="icon gardenLineIcon" style="margin-left:-24px;margin-top:-4px;' + plant.iconCssStr[0] + '"></div>' +
						'<div class="icon gardenLineIcon" style="margin-left:-24px;margin-top:-28px;' + plant.iconCssStr[4] + '"></div>' +
						'<div class="turnInto"></div>' +
						(plant.plantable ? ('<div class="gardenSeedTooltipCost"><small>Planting cost :</small><br>' +
							'<span class="priceIcon">' + Game.BeautifyAbbr(Math.round(Game.shortenNumber(M.getCost(plant)))) + "</span><br>" +
							"<small>" + Game.sayTime(plant.cost * 60 * 30, -1) + " of CpS,<br>minimum " + Game.BeautifyAbbr(plant.costM) +
							" cookies</small></div>") : "") +
						'<div style="width:300px;"><div class="name">' + plant.name + " seed</div><div><small>" +
						(plant.plantable ? "Click to select this seed for planting." : '<span class="red">This seed cannot be planted.</span>') +
						"<!--<br>Shift+ctrl+click to harvest all mature plants of this type.--></small></div></div>" +
						'<div class="line"></div>' +
						M.getPlantDesc(plant) +
						"</div>",
					refEle: this
				});
			}

			ev.stopPropagation();
		});

		$("#gardenDeselectSeed").on("click", function() {
			Game.garden.selectSeed(null);
		});

		$("#gardenSoilBlock").on("mouseenter", ".gardenSoil", function(ev) {
			var M = Game.garden;

			var soil = M.soilsById[this.dataset.soilId];
			if (soil) {
				var str = '<div class="gardenSoilTooltip">' +
					'<div class="icon gardenLineIcon" style="margin-left:-8px;margin-top:-8px;' + soil.iconCssStr + '"></div>' +
					'<div><div class="name">' + soil.name + "</div><div>" +
					"<small>" +
					((M.soil == soil.id) ? "Your field is currently using this soil." : "Click to use this type of soil for your whole field.") +
					"</small></div></div>" +
					'<div class="line"></div>' +
					'<div class="description">' +
					'<div class="gardenDescMargin"><b>Effects :</b></div>' +
					'<div class="gardenDescFont bold">' + soil.effsStr + "</div>" +
					(soil.q ? ("<q>" + soil.q + "</q>") : "") +
					"</div>";

				Game.setTooltip({
					html: str,
					refEle: this
				});

			}

			ev.stopPropagation();

		}).on("click", ".gardenSoil", function() {
			var soil = Game.garden.soilsById[this.dataset.soilId];
			if (soil && Game.garden.soil !== soil.id) {
				Game.garden.toggleSoil(soil.id);
				Game.scheduleUpdate();
			}
		});

		var gardenPlantMousedown = false;

		$("#gardenBlock").on("click", '[name="gardenSeedAge"]', function() {
			Game.garden.toggleGardenFillBtn();

		}).on("mousedown", ".gardenTile", function(ev) {
			var M = Game.garden;

			var spl = this.id.split("-");
			var x = spl[1];
			var y = spl[2];
			gardenPlantMousedown = false;

			var changed = false;
			var age = M.getNewSeedAge(M.plantsById[M.seedSelected]);
			if (age > -1) {
				changed = M.setPlotTile(x, y, M.seedSelected, age);
				gardenPlantMousedown = true;
			} else if (byId("gardenSeedAgeRemove").checked) {
				changed = M.setPlotTile(x, y, -1, 0);
				gardenPlantMousedown = true;
			}

			if (changed) {
				Game.setTooltip({
					html: M.tileTooltip(x, y),
					refEle: this
				});
				Game.scheduleUpdate(200);
			}

			ev.preventDefault();

		}).on("mouseenter", ".gardenTile", function(ev) {
			var M = Game.garden;

			var spl = this.id.split("-");
			var x = spl[1];
			var y = spl[2];

			var changed = false;

			if (gardenPlantMousedown) {
				var age = M.getNewSeedAge(M.plantsById[M.seedSelected]);
				if (age > -1) {
					changed = M.setPlotTile(x, y, M.seedSelected, age);
				} else if (byId("gardenSeedAgeRemove").checked) {
					changed = M.setPlotTile(x, y, -1, 0);
				}
			}

			if (changed) {
				Game.scheduleUpdate(200);
			}

			Game.setTooltip({
				html: M.tileTooltip(x, y),
				refEle: this
			});

			ev.preventDefault();

		}).on("mouseenter", "#gardenHarvestBonusBlock .gardenHarvestBonusPlant", function(ev) {
			var M = Game.garden;
			var plant = M.plantsById[this.dataset.plantId];
			if (plant) {
				Game.setTooltip({
					html: '<div class="gardenSeedTooltip">' +
						'<div class="icon gardenLineIcon" style="margin-left:-24px;margin-top:-4px;' + plant.iconCssStr[0] + '"></div>' +
						'<div class="icon gardenLineIcon" style="margin-left:-24px;margin-top:-28px;' + plant.iconCssStr[4] + '"></div>' +
						'<div class="turnInto"></div>' +
						'<div style="width:300px;"><div class="name">' + plant.name + "</div><div></div></div>" +
						'<div class="line"></div>' +
						M.getPlantDesc(plant) +
						"</div>",
					refEle: this
				});
			}

			ev.stopPropagation();
		});

		$(window).on("focusout mouseup focusin", function() {
			gardenPlantMousedown = false;
		});

		$("#gardenClearAllPlots").on("click", function() {
			Game.garden.resetPlot();
			Game.scheduleUpdate();
		});

		$("#gardenFillAllPlots").on("click", function() {
			var M = Game.garden;
			var age = M.getNewSeedAge(M.plantsById[M.seedSelected]);
			if (age > -1) {
				for (var y = 0; y < 6; y++) {
					for (var x = 0; x < 6; x++) {
						M.setPlotTile(x, y, Game.seedSelected, age);
					}
				}
			}

			Game.scheduleUpdate();
		});

		Game.clearGardenSelection = function() {
			Game.garden.selectSeed(null);
		};
		byId("tabGarden").onTabFunc = Game.clearGardenSelection;

		M.selectSeed(null);

		//#endregion Garden

	};

})(myWindow, jQuery);

myWindow.Game.init();
