
// ==UserScript==
// @name		RReasy
// @version		2.08l
// @namespace		www.lesroyaumes.com
// @description		RReasy pour les RR
// @include		http://www.lesroyaumes.com/EcranPrincipalAjax.php*
// @include		http://www.lesroyaumes.com/EcranPrincipal.php*
// @exclude		http://www.lesroyaumes.com/NouveauCourrier.php*
// @priority	100
// @grant       unsafeWindow
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/20388/RReasy.user.js
// @updateURL https://update.greasyfork.org/scripts/20388/RReasy.meta.js
// ==/UserScript==

// --------------------------------------------------------------------
// Ceci est un script utilisateur Scriptish.
//
// Pour installer : 
//
// Sous Firefox NE FONCTIONNE PAS AVEC LES VERSIONS > 37 - Préférer la version 34.
// Pour installer une ancienne version de Firefox : 
// https://forums.mozfr.org/viewtopic.php?t=93615
//  
// installer Scriptish : 
// https://addons.mozilla.org/firefox/downloads/latest/scriptish/addon-231203-latest.xpi?src=ss
//
// Pour Google chrome : installer TamperMonkey :
// https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr
//
// Après installation de Scriptish, ou TamperMonkey, redémarrez votre navigateur et visitez à nouveau ce script.
// Il vous proposera de l'installer, faites-le.
//
// Le manuel : http://nsmf01.casimages.com/f/2016/06/12//1606121048461969821557.pdf
// --------------------------------------------------------------------

/* A implémenter : la modification des métiers des utilisateurs
Les fonctions de soldat qui ne travaillent pas sur les bonnes pages (Réputation notamment)
Les états de guerre dans les préférences
Les envois de courriers multiples
*/

/************* Initialisations des variables globales *************/
if (lVersions == undefined) {
    var lVersions = [
          ["1.0a", "version de développement", "22/11/2012"]
		, ["1.0b", "évolution suite aux changements de l'IG", "18/01/2013"]
		, ["1.0c", "gestion du profile RReasy et des suspects", "21/01/2013"]
		, ["1.0d", "changement interface IG", "23/01/2013"]
		, ["1.1a", "début d'implémentation des fonctions de maire", "27/01/2013"]
		, ["1.1b", "correction du bug Encombrement", "29/01/2013"]
		, ["1.1c", "ajout des fonctions du marché", "03/02/2013"]
		, ["1.1d", "amélioration de la détection des suspects", "03/02/2013"]
		, ["1.1e", "amélioration de la liste des présents", "06/02/2013"]
		, ["1.1f", "corrections de bugs et améliorations", "09/02/2013"]
		, ["1.1g", "corrections d'un bug dans le recensement", "10/02/2013"]
		, ["1.1h", "corrections d'un bug dans les liens BBcode", "17/02/2013"]
		, ["1.1i", "ajout de la fonction Comptabilité du maire, correction d'un bug dans le dossier du soldat", "24/02/2013"]
		, ["1.1j", "correction de bugs pour la récupération des PR et l'affichage du registre", "26/02/2013"]
		, ["1.1k", "corrections dans la collecte d'informations, message de groupe depuis l'affichage du registre", "16/03/2013"]
		, ["1.1l", "corrections dans la collecte d'informations suite à modification IG (activité)", "28/03/2013"]
		, ["1.1m", "module 'Guet externe'", "01/04/2013"]
		, ["1.1n", "correction bug lien externe fiche personnage", "15/04/2013"]
		, ["1.1o", "correction suite à modifcation IG", "23/05/2013"]
		, ["1.1p", "intégration des fonctions liées à l'armée (commandant, intendant, trésorier)", "22/06/2013"]
		, ["1.1q", "correction perte du pseudo", "09/08/2013"]
		, ["1.1r", "correction perte du pseudo", "09/08/2013"]
		, ["1.1s", "correction perte des champs", "30/09/2013"]
		, ["2.0a", "évolution pour le calcul de l'impot", "01/10/2013"]
		, ["2.01", "correction dûe à l'évolution du code RR", "20/10/2014"]
		, ["2.02", "correction dûe à l'évolution du code RR (fin)", "21/10/2014"]
		, ["2.03", "Agencements et adaptations de Cigalou01", "07/02/2015"]
		, ["2.04", "Mod. affichage suspects, rapports", "22/02/2015"]
		, ["2.04", "Complément de métiers", "28/02/2015"]
		, ["2.04", "Modif pour ajout/modification de suspects", "04/03/2015"]
		, ["2.05", "Modif du localStorage pour villes multiples", "07/03/2015"]
		, ["2.05", "Correction du localStorage pour villes multiples", "08/03/2015"]
		, ["2.05", "Correction de l'extraction des Ville/Duché", "10/03/2015"]
		, ["2.06", "Correction des préférences pour villes multiples", "16/03/2015"]
		, ["2.06a", "Ajout des préférences d'alerte pour le Guet en villes multiples", "18/03/2015"]
		, ["2.07", "Corrections du localStorage pour comptes multiples.", "18/02/2016"]
		, ["2.07a", "Remise en conformité du Portrait robot.", "23/02/2016"]
		, ["2.07b", "Ajustements divers.", "08/03/2016"]
		, ["2.08", "Transfert des Prefs en localStorage", "08/06/2016"]
		, ["2.08c", "Modification du stockage des listes de villageois pour gérer les alphabets non latins", "09/06/2016"]
		, ["2.08d", "Correction affichage status - Divers ajustements", "10/06/2016"]
		, ["2.08e", "Divers ajustements", "11/06/2016"]
		, ["2.08f", "correction erreurs de transcription", "11/06/2016"]
		, ["2.08g", "correction bug sur synthèse Marché", "12/06/2016"]
		, ["2.08h", "Complément de guet extérieur : ajout de synthèse, de liste des résidents actifs, correction sur retraite spirituelle", "17/06/2016"]
		, ["2.08i", "Complément de Douane : ajout de la liste des résidents actifs", "21/06/2016"]
		, ["2.08J", "Corrections diverses", "30/07/2016"]
		, ["2.08k", "Corrections diverses, mise en conformité Compta Mairie, Inventaire Mairie, filtrage des noeuds pour alléger les localStorage, Ajout de la douane 'déportée' sur l'onglet 'Groupes et armées' pour les SDD qui sont en armée", "22/09/2016"]
		, ["2.08l", "évolution suite aux changements de l'IG", "29/09/2016"]
    ];
    var version = lVersions[lVersions.length - 1][0];
}
var xFavdb = "RReasy est une extension des RR réalisée par <a href='#' onClick='javascript:popupPerso(\"FichePersonnage.php?login=favdb\")'>FaVdB</a>, modifiée et aménagée par <a href='#' onClick='javascript:popupPerso(\"FichePersonnage.php?login=Cigalou01\")'>Cigalou01</a>";

/* A explorer : 
textePage[4][25]['Texte'] = '<form method="post" action="Action.php?action=310">  <p>L\'argent du village est devant vous et personne ne vous regarde.</p><select name="montant"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option><option value="59">59</option><option value="60">60</option><option value="61">61</option><option value="62">62</option><option value="63">63</option><option value="64">64</option><option value="65">65</option><option value="66">66</option><option value="67">67</option><option value="68">68</option><option value="69">69</option><option value="70">70</option><option value="71">71</option><option value="72">72</option><option value="73">73</option><option value="74">74</option><option value="75">75</option><option value="76">76</option><option value="77">77</option><option value="78">78</option><option value="79">79</option><option value="80">80</option><option value="81">81</option><option value="82">82</option><option value="83">83</option><option value="84">84</option><option value="85">85</option><option value="86">86</option><option value="87">87</option><option value="88">88</option><option value="89">89</option><option value="90">90</option><option value="91">91</option><option value="92">92</option><option value="93">93</option><option value="94">94</option><option value="95">95</option><option value="96">96</option><option value="97">97</option><option value="98">98</option><option value="99">99</option><option value="100">100</option><option value="101">101</option><option value="102">102</option><option value="103">103</option><option value="104">104</option><option value="105">105</option><option value="106">106</option><option value="107">107</option><option value="108">108</option><option value="109">109</option><option value="110">110</option><option value="111">111</option><option value="112">112</option><option value="113">113</option><option value="114">114</option><option value="115">115</option><option value="116">116</option><option value="117">117</option><option value="118">118</option><option value="119">119</option><option value="120">120</option><option value="121">121</option><option value="122">122</option><option value="123">123</option><option value="124">124</option><option value="125">125</option><option value="126">126</option><option value="127">127</option><option value="128">128</option><option value="129">129</option><option value="130">130</option><option value="131">131</option><option value="132">132</option><option value="133">133</option><option value="134">134</option><option value="135">135</option><option value="136">136</option><option value="137">137</option><option value="138">138</option><option value="139">139</option><option value="140">140</option><option value="141">141</option><option value="142">142</option><option value="143">143</option><option value="144">144</option><option value="145">145</option><option value="146">146</option><option value="147">147</option><option value="148">148</option><option value="149">149</option><option value="150">150</option><option value="151">151</option><option value="152">152</option><option value="153">153</option><option value="154">154</option><option value="155">155</option><option value="156">156</option><option value="157">157</option><option value="158">158</option><option value="159">159</option><option value="160">160</option><option value="161">161</option><option value="162">162</option><option value="163">163</option><option value="164">164</option><option value="165">165</option><option value="166">166</option><option value="167">167</option><option value="168">168</option><option value="169">169</option><option value="170">170</option><option value="171">171</option><option value="172">172</option><option value="173">173</option><option value="174">174</option><option value="175">175</option><option value="176">176</option><option value="177">177</option><option value="178">178</option><option value="179">179</option><option value="180">180</option><option value="181">181</option><option value="182">182</option><option value="183">183</option><option value="184">184</option><option value="185">185</option><option value="186">186</option><option value="187">187</option><option value="188">188</option><option value="189">189</option><option value="190">190</option><option value="191">191</option><option value="192">192</option><option value="193">193</option><option value="194">194</option><option value="195">195</option><option value="196">196</option><option value="197">197</option><option value="198">198</option><option value="199">199</option><option value="200">200</option><option value="201">201</option><option value="202">202</option><option value="203">203</option><option value="204">204</option><option value="205">205</option><option value="206">206</option><option value="207">207</option><option value="208">208</option><option value="209">209</option><option value="210">210</option><option value="211">211</option><option value="212">212</option><option value="213">213</option><option value="214">214</option><option value="215">215</option><option value="216">216</option><option value="217">217</option><option value="218">218</option><option value="219">219</option><option value="220">220</option><option value="221">221</option><option value="222">222</option><option value="223">223</option><option value="224">224</option><option value="225">225</option><option value="226">226</option><option value="227">227</option><option value="228">228</option><option value="229">229</option><option value="230">230</option><option value="231">231</option><option value="232">232</option><option value="233">233</option><option value="234">234</option><option value="235">235</option><option value="236">236</option><option value="237">237</option><option value="238">238</option><option value="239">239</option><option value="240">240</option><option value="241">241</option><option value="242">242</option><option value="243">243</option><option value="244">244</option><option value="245">245</option><option value="246">246</option><option value="247">247</option><option value="248">248</option><option value="249">249</option><option value="250">250</option><option value="251">251</option><option value="252">252</option><option value="253">253</option><option value="254">254</option><option value="255">255</option><option value="256">256</option><option value="257">257</option><option value="258">258</option><option value="259">259</option><option value="260">260</option><option value="261">261</option><option value="262">262</option><option value="263">263</option><option value="264">264</option><option value="265">265</option><option value="266">266</option><option value="267">267</option><option value="268">268</option><option value="269">269</option><option value="270">270</option><option value="271">271</option><option value="272">272</option><option value="273">273</option><option value="274">274</option><option value="275">275</option><option value="276">276</option><option value="277">277</option><option value="278">278</option><option value="279">279</option><option value="280">280</option><option value="281">281</option><option value="282">282</option><option value="283">283</option><option value="284">284</option><option value="285">285</option><option value="286">286</option><option value="287">287</option><option value="288">288</option><option value="289">289</option><option value="290">290</option><option value="291">291</option><option value="292">292</option><option value="293">293</option><option value="294">294</option><option value="295">295</option><option value="296">296</option><option value="297">297</option><option value="298">298</option><option value="299">299</option><option value="300">300</option><option value="301">301</option><option value="302">302</option><option value="303">303</option><option value="304">304</option><option value="305">305</option><option value="306">306</option><option value="307">307</option><option value="308">308</option><option value="309">309</option><option value="310">310</option><option value="311">311</option><option value="312">312</option><option value="313">313</option><option value="314">314</option><option value="315">315</option><option value="316">316</option><option value="317">317</option><option value="318">318</option><option value="319">319</option><option value="320">320</option><option value="321">321</option><option value="322">322</option><option value="323">323</option><option value="324">324</option><option value="325">325</option><option value="326">326</option><option value="327">327</option><option value="328">328</option><option value="329">329</option><option value="330">330</option><option value="331">331</option><option value="332">332</option><option value="333">333</option><option value="334">334</option><option value="335">335</option><option value="336">336</option><option value="337">337</option><option value="338">338</option><option value="339">339</option><option value="340">340</option><option value="341">341</option><option value="342">342</option><option value="343">343</option><option value="344">344</option><option value="345">345</option><option value="346">346</option><option value="347">347</option><option value="348">348</option><option value="349">349</option><option value="350">350</option><option value="351">351</option><option value="352">352</option><option value="353">353</option><option value="354">354</option><option value="355">355</option><option value="356">356</option><option value="357">357</option><option value="358">358</option><option value="359">359</option><option value="360">360</option><option value="361">361</option><option value="362">362</option><option value="363">363</option><option value="364">364</option><option value="365">365</option><option value="366">366</option><option value="367">367</option><option value="368">368</option><option value="369">369</option><option value="370">370</option><option value="371">371</option><option value="372">372</option><option value="373">373</option><option value="374">374</option><option value="375">375</option><option value="376">376</option><option value="377">377</option><option value="378">378</option><option value="379">379</option><option value="380">380</option><option value="381">381</option><option value="382">382</option><option value="383">383</option><option value="384">384</option><option value="385">385</option><option value="386">386</option><option value="387">387</option><option value="388">388</option><option value="389">389</option><option value="390">390</option><option value="391">391</option><option value="392">392</option><option value="393">393</option><option value="394">394</option><option value="395">395</option><option value="396">396</option><option value="397">397</option><option value="398">398</option><option value="399">399</option><option value="400">400</option><option value="401">401</option><option value="402">402</option><option value="403">403</option><option value="404">404</option><option value="405">405</option><option value="406">406</option><option value="407">407</option><option value="408">408</option><option value="409">409</option><option value="410">410</option><option value="411">411</option><option value="412">412</option><option value="413">413</option><option value="414">414</option><option value="415">415</option><option value="416">416</option><option value="417">417</option><option value="418">418</option><option value="419">419</option><option value="420">420</option><option value="421">421</option><option value="422">422</option><option value="423">423</option><option value="424">424</option><option value="425">425</option><option value="426">426</option><option value="427">427</option><option value="428">428</option><option value="429">429</option><option value="430">430</option><option value="431">431</option><option value="432">432</option><option value="433">433</option><option value="434">434</option><option value="435">435</option><option value="436">436</option><option value="437">437</option><option value="438">438</option><option value="439">439</option><option value="440">440</option><option value="441">441</option><option value="442">442</option><option value="443">443</option><option value="444">444</option><option value="445">445</option><option value="446">446</option><option value="447">447</option><option value="448">448</option><option value="449">449</option><option value="450">450</option><option value="451">451</option><option value="452">452</option><option value="453">453</option><option value="454">454</option><option value="455">455</option><option value="456">456</option><option value="457">457</option><option value="458">458</option><option value="459">459</option><option value="460">460</option><option value="461">461</option><option value="462">462</option><option value="463">463</option><option value="464">464</option><option value="465">465</option><option value="466">466</option><option value="467">467</option><option value="468">468</option><option value="469">469</option><option value="470">470</option><option value="471">471</option><option value="472">472</option><option value="473">473</option><option value="474">474</option><option value="475">475</option><option value="476">476</option><option value="477">477</option><option value="478">478</option><option value="479">479</option><option value="480">480</option><option value="481">481</option><option value="482">482</option><option value="483">483</option><option value="484">484</option><option value="485">485</option><option value="486">486</option><option value="487">487</option><option value="488">488</option><option value="489">489</option><option value="490">490</option><option value="491">491</option><option value="492">492</option><option value="493">493</option><option value="494">494</option><option value="495">495</option><option value="496">496</option><option value="497">497</option><option value="498">498</option><option value="499">499</option><option value="500">500</option></select> <input type="hidden" name="voleur" value="maire"> <input type="submit" value="Voler"></form>'; */

/* A explorer : 
<form method="POST" target="mail" action="NouveauCourrier.php?multiCastMaire=1" id="FormulaireRepondre25378">\n					<a class="lien_default" href="NouveauCourrier.php?multiCastMaire=1" onclick="popupMail(\'about:blank\'); setTimeout(function submitForm() { document.getElementById(\'FormulaireRepondre25378\').submit();}, 500); return false;">Envoyer un courrier &agrave; tous les villageois</a>\n					<input type="hidden" name="Destinataire" value="" />\n					<input type="hidden" name="Titre" value="" />\n				</form>
*/

vers = navigator.userAgent.substring(navigator.userAgent.indexOf("rv:")+3,navigator.userAgent.indexOf(")")); 
var numVers = parseFloat(vers); //logit("numVers : " + numVers);

var SaveIG = "", SaveIG2 = "";
var JSON2 = JSON;
var RRoperation = "";

var Perso_minS_bk = 0, Perso_minF_bk = 0, Perso_minS_rd = 0, Perso_maxS_rd = 0;
var Perso_minF_rd = 0, Perso_minS_or = 0; Perso_maxS_or = 0; Perso_minF_or = 0;
var Perso_minS_grR = 0, Perso_maxS_grR = 0, Perso_maxS_gr = 0;
var PersoPrefs="", hPersos="00/00/0000", hHier="00/00/0000";
var PersoJour="", PersoGrade="", PersoGarnison="", PersoEscouade="", PersoMission="";
var lastHier="00/00/0000", lastRapport="00/00/0000", PrefsAlerts="0", PersoAlerts="20|15|15|19|10|10|14|5|6|9|5", MarcheSeuil="|ø"; 
var MandatVu="00/00/0000", MandatH = "0", MandatOH = "0", isMandat = false;
var monPopup; var InfosPaysRR = new Array();//var InfosPaysRR = "";
var nPersos = new Array, nFurtifs = new Array, nPresents = new Array, nHier = new Array, aColor = new Array, sColor = new Array;
var nSuspects = new Array;
var nbP = 0, nbPmort = 0, nbPretraite = 0, nbPretranche = 0,
        nbV = 0, nbVmort = 0, nbVretraite = 0, nbVretranche = 0,
        nbH = 0, nbHmort = 0, nbHretraite = 0, nbHretranche = 0,
        nbE = 0, nbEmort = 0, nbEretraite = 0, nbEretranche = 0,
        nbS = 0, nbSmort = 0, nbSretraite = 0, nbSretranche = 0, nbSurv=0;
var nPointeur = 0, aPointeur = 0, pPointeur = 0, npFurtif = 0, nbF=0;
var mVille = "", mDuche = "", mDate = "", lDate = "", MS_V = "|ø";
var cMaire = "", cTribun = "";
var aColor = Array("green","darkgreen","orange","red","black","black");
var sColor = Array("Verte","Verte Renforcée","Orange","Rouge","Noire","Noire");
var fightColor = ["#444444", "#B22222", "#FF0000", "#FFA500", "#A52A2A", "#FFFF00",
				  "#008000", "#808000", "#00FFFF", "#0000FF", "#00008B", "#8A2BE2",
				  "#EE82EE", "#FFFFFF"];
var sfightC = ["Défaut", "Rouge foncé", "Rouge", "Orange", "Marron", "Jaune",
	  		   "Vert", "Olive", "Cyan", "Bleu", "Bleu foncé", "Indigo",
			   "Violet", "Blanc"];
var ExtVille = "", ExtHier = "", ExtJour = "", nPointeurExt=0;
var ADeparts = new Array, AArrivees = new Array, ASuspects = new Array;
var ExtSynthese = "";
var Xident = new Array, Xidx, nPresentsJour = new Array, nPresentsHier = new Array,  nPersosExt = new Array;
var Fraudeur = new Array, nFraudeur;

var libMetier = [
    'boulanger', 'meunier', 'boucher', 'forgeron',
    'charpentier', 'tisserand', 'botaniste', 'sculpteur', 'pressoir', 'whiskey',
    'whisky', 'fromagerie', 'cave à vin', 'ferme à cidre'
];
var libChamp = [
	'blé', 'maïs', 'légumes', 'vaches', 'cochons', 'moutons', 'chèvres', 'oliviers', 'vigne', 'orge'
];
var libGrade = [
    "--", "000000",
    "Prévôt", "FC0216",
    "Maréchal", "2305F9",
    "Aspirant maréchal", "02C0FC",
    "Sénéchal", "F65908",
    "Major", "FA7504",
    "Conseiller militaire", "4686B8",
    "Cartographe", "036234",
    "Adjudant", "78293E",
    "Sergent chef", "2305F9",
    "Sergent", "02C0FC",
    "Sergent intérimaire", "699672",
    "Brigadier chef", "ECC012",
    "Brigadier", "ECC012",
    "Soldat de 1ère classe", "97F905",
    "Soldat", "F0FA04",
    "Volontaire", "A14401"
];
var LeRapport = "";
var tStat  = ['Surv.'     ,'Assign.'   ,'PNG'      ,'Brig.'     ,'Membre'   ,'TOP'      ,'MoV'
];
var tStatc = ['660000'   ,'0000ff'    ,'008888'   ,'660000'    ,'ff0000'   ,'ff3333'   ,'ff3333'
];
var tStath = ['660000'   ,'0000ff'    ,'008888'   ,'660000'    ,'ff0000'   ,'ff3333'   ,'ff3333'
];
var mdlg = null;
var db = "[b]", fb = "[/b]";
var eActif = "État", eVille = "Ville", eComte = "Comté/Duché", eChamp = -1, eMetier = -1;
var nProduits = new Array;
/* Peuplement SELECT des select de Préférences **** Ajout 2016_02_24 */
InfosPaysRR[0] = new Array();
InfosPaysRR[0]['Nom'] = 'Royaume de France';
InfosPaysRR[0]['Comtes'] = new Array();
InfosPaysRR[0]['Comtes'][0] = new Array();
InfosPaysRR[0]['Comtes'][0]['Nom'] = 'Comté d\'Artois';
InfosPaysRR[0]['Comtes'][0]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][4] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][4]['Nom'] = 'Bertincourt';
InfosPaysRR[0]['Comtes'][0]['Villages'][5] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][5]['Nom'] = 'Cambrai';
InfosPaysRR[0]['Comtes'][0]['Villages'][7] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][7]['Nom'] = 'Péronne';
InfosPaysRR[0]['Comtes'][0]['Villages'][8] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][8]['Nom'] = 'Azincourt';
InfosPaysRR[0]['Comtes'][0]['Villages'][19] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][19]['Nom'] = 'Calais';
InfosPaysRR[0]['Comtes'][0]['Villages'][135] = new Array();
InfosPaysRR[0]['Comtes'][0]['Villages'][135]['Nom'] = 'Arras';
InfosPaysRR[0]['Comtes'][1] = new Array();
InfosPaysRR[0]['Comtes'][1]['Nom'] = 'Duché de Champagne (Domaine Royal)';
InfosPaysRR[0]['Comtes'][1]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][0] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][0]['Nom'] = 'Sainte-Menehould';
InfosPaysRR[0]['Comtes'][1]['Villages'][1] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][1]['Nom'] = 'Clermont';
InfosPaysRR[0]['Comtes'][1]['Villages'][2] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][2]['Nom'] = 'Varennes';
InfosPaysRR[0]['Comtes'][1]['Villages'][3] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][3]['Nom'] = 'Argonne';
InfosPaysRR[0]['Comtes'][1]['Villages'][6] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][6]['Nom'] = 'Compiègne';
InfosPaysRR[0]['Comtes'][1]['Villages'][9] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][9]['Nom'] = 'Troyes';
InfosPaysRR[0]['Comtes'][1]['Villages'][10] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][10]['Nom'] = 'Conflans-lès-Sens';
InfosPaysRR[0]['Comtes'][1]['Villages'][15] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][15]['Nom'] = 'Langres';
InfosPaysRR[0]['Comtes'][1]['Villages'][140] = new Array();
InfosPaysRR[0]['Comtes'][1]['Villages'][140]['Nom'] = 'Reims';
InfosPaysRR[0]['Comtes'][3] = new Array();
InfosPaysRR[0]['Comtes'][3]['Nom'] = 'Duché de Normandie (Domaine Royal)';
InfosPaysRR[0]['Comtes'][3]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][11] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][11]['Nom'] = 'Honfleur';
InfosPaysRR[0]['Comtes'][3]['Villages'][12] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][12]['Nom'] = 'Dieppe';
InfosPaysRR[0]['Comtes'][3]['Villages'][14] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][14]['Nom'] = 'Bayeux';
InfosPaysRR[0]['Comtes'][3]['Villages'][16] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][16]['Nom'] = 'Fécamp';
InfosPaysRR[0]['Comtes'][3]['Villages'][23] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][23]['Nom'] = 'Lisieux';
InfosPaysRR[0]['Comtes'][3]['Villages'][26] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][26]['Nom'] = 'Avranches';
InfosPaysRR[0]['Comtes'][3]['Villages'][143] = new Array();
InfosPaysRR[0]['Comtes'][3]['Villages'][143]['Nom'] = 'Rouen';
InfosPaysRR[0]['Comtes'][4] = new Array();
InfosPaysRR[0]['Comtes'][4]['Nom'] = 'Duché de Bretagne';
InfosPaysRR[0]['Comtes'][4]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][30] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][30]['Nom'] = 'Rohan';
InfosPaysRR[0]['Comtes'][4]['Villages'][31] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][31]['Nom'] = 'Saint-Brieuc';
InfosPaysRR[0]['Comtes'][4]['Villages'][32] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][32]['Nom'] = 'Fougères';
InfosPaysRR[0]['Comtes'][4]['Villages'][33] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][33]['Nom'] = 'Vannes';
InfosPaysRR[0]['Comtes'][4]['Villages'][34] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][34]['Nom'] = 'Tréguier';
InfosPaysRR[0]['Comtes'][4]['Villages'][51] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][51]['Nom'] = 'Rieux';
InfosPaysRR[0]['Comtes'][4]['Villages'][77] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][77]['Nom'] = 'Saint Pol de Léon';
InfosPaysRR[0]['Comtes'][4]['Villages'][105] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][105]['Nom'] = 'Brest';
InfosPaysRR[0]['Comtes'][4]['Villages'][153] = new Array();
InfosPaysRR[0]['Comtes'][4]['Villages'][153]['Nom'] = 'Rennes';
InfosPaysRR[0]['Comtes'][5] = new Array();
InfosPaysRR[0]['Comtes'][5]['Nom'] = 'Duché de Bourgogne';
InfosPaysRR[0]['Comtes'][5]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][13] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][13]['Nom'] = 'Tonnerre';
InfosPaysRR[0]['Comtes'][5]['Villages'][18] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][18]['Nom'] = 'Joinville';
InfosPaysRR[0]['Comtes'][5]['Villages'][20] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][20]['Nom'] = 'Cosne';
InfosPaysRR[0]['Comtes'][5]['Villages'][21] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][21]['Nom'] = 'Sémur';
InfosPaysRR[0]['Comtes'][5]['Villages'][24] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][24]['Nom'] = 'Nevers';
InfosPaysRR[0]['Comtes'][5]['Villages'][25] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][25]['Nom'] = 'Autun';
InfosPaysRR[0]['Comtes'][5]['Villages'][27] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][27]['Nom'] = 'Mâcon';
InfosPaysRR[0]['Comtes'][5]['Villages'][28] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][28]['Nom'] = 'Chalon';
InfosPaysRR[0]['Comtes'][5]['Villages'][151] = new Array();
InfosPaysRR[0]['Comtes'][5]['Villages'][151]['Nom'] = 'Dijon';
InfosPaysRR[0]['Comtes'][6] = new Array();
InfosPaysRR[0]['Comtes'][6]['Nom'] = 'Duché du Berry';
InfosPaysRR[0]['Comtes'][6]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][6]['Villages'][35] = new Array();
InfosPaysRR[0]['Comtes'][6]['Villages'][35]['Nom'] = 'Sancerre';
InfosPaysRR[0]['Comtes'][6]['Villages'][36] = new Array();
InfosPaysRR[0]['Comtes'][6]['Villages'][36]['Nom'] = 'Châteauroux';
InfosPaysRR[0]['Comtes'][6]['Villages'][37] = new Array();
InfosPaysRR[0]['Comtes'][6]['Villages'][37]['Nom'] = 'Saint-Aignan';
InfosPaysRR[0]['Comtes'][6]['Villages'][152] = new Array();
InfosPaysRR[0]['Comtes'][6]['Villages'][152]['Nom'] = 'Bourges';
InfosPaysRR[0]['Comtes'][7] = new Array();
InfosPaysRR[0]['Comtes'][7]['Nom'] = 'Duché du Bourbonnais-Auvergne';
InfosPaysRR[0]['Comtes'][7]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][40] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][40]['Nom'] = 'Bourbon';
InfosPaysRR[0]['Comtes'][7]['Villages'][41] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][41]['Nom'] = 'Moulins';
InfosPaysRR[0]['Comtes'][7]['Villages'][42] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][42]['Nom'] = 'Montpensier';
InfosPaysRR[0]['Comtes'][7]['Villages'][44] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][44]['Nom'] = 'Thiers';
InfosPaysRR[0]['Comtes'][7]['Villages'][47] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][47]['Nom'] = 'Montluçon';
InfosPaysRR[0]['Comtes'][7]['Villages'][56] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][56]['Nom'] = 'Montbrisson';
InfosPaysRR[0]['Comtes'][7]['Villages'][57] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][57]['Nom'] = 'Murat';
InfosPaysRR[0]['Comtes'][7]['Villages'][58] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][58]['Nom'] = 'Aurillac';
InfosPaysRR[0]['Comtes'][7]['Villages'][109] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][109]['Nom'] = 'Polignac';
InfosPaysRR[0]['Comtes'][7]['Villages'][162] = new Array();
InfosPaysRR[0]['Comtes'][7]['Villages'][162]['Nom'] = 'Clermont';
InfosPaysRR[0]['Comtes'][8] = new Array();
InfosPaysRR[0]['Comtes'][8]['Nom'] = 'Duché de Touraine';
InfosPaysRR[0]['Comtes'][8]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][8]['Villages'][45] = new Array();
InfosPaysRR[0]['Comtes'][8]['Villages'][45]['Nom'] = 'Loches';
InfosPaysRR[0]['Comtes'][8]['Villages'][46] = new Array();
InfosPaysRR[0]['Comtes'][8]['Villages'][46]['Nom'] = 'Chinon';
InfosPaysRR[0]['Comtes'][8]['Villages'][124] = new Array();
InfosPaysRR[0]['Comtes'][8]['Villages'][124]['Nom'] = 'Vendôme';
InfosPaysRR[0]['Comtes'][8]['Villages'][163] = new Array();
InfosPaysRR[0]['Comtes'][8]['Villages'][163]['Nom'] = 'Tours';
InfosPaysRR[0]['Comtes'][9] = new Array();
InfosPaysRR[0]['Comtes'][9]['Nom'] = 'Duché d\'Anjou';
InfosPaysRR[0]['Comtes'][9]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][9]['Villages'][48] = new Array();
InfosPaysRR[0]['Comtes'][9]['Villages'][48]['Nom'] = 'Saumur';
InfosPaysRR[0]['Comtes'][9]['Villages'][49] = new Array();
InfosPaysRR[0]['Comtes'][9]['Villages'][49]['Nom'] = 'La Flêche';
InfosPaysRR[0]['Comtes'][9]['Villages'][50] = new Array();
InfosPaysRR[0]['Comtes'][9]['Villages'][50]['Nom'] = 'Craon';
InfosPaysRR[0]['Comtes'][9]['Villages'][164] = new Array();
InfosPaysRR[0]['Comtes'][9]['Villages'][164]['Nom'] = 'Angers';
InfosPaysRR[0]['Comtes'][10] = new Array();
InfosPaysRR[0]['Comtes'][10]['Nom'] = 'Comté du Poitou';
InfosPaysRR[0]['Comtes'][10]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][52] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][52]['Nom'] = 'Niort';
InfosPaysRR[0]['Comtes'][10]['Villages'][53] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][53]['Nom'] = 'La Rochelle';
InfosPaysRR[0]['Comtes'][10]['Villages'][54] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][54]['Nom'] = 'Thouars';
InfosPaysRR[0]['Comtes'][10]['Villages'][55] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][55]['Nom'] = 'La Trémouille';
InfosPaysRR[0]['Comtes'][10]['Villages'][99] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][99]['Nom'] = 'Saintes';
InfosPaysRR[0]['Comtes'][10]['Villages'][324] = new Array();
InfosPaysRR[0]['Comtes'][10]['Villages'][324]['Nom'] = 'Poitiers';
InfosPaysRR[0]['Comtes'][11] = new Array();
InfosPaysRR[0]['Comtes'][11]['Nom'] = 'Comté du Limousin et de La Marche';
InfosPaysRR[0]['Comtes'][11]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][59] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][59]['Nom'] = 'Tulle';
InfosPaysRR[0]['Comtes'][11]['Villages'][60] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][60]['Nom'] = 'Ventadour';
InfosPaysRR[0]['Comtes'][11]['Villages'][61] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][61]['Nom'] = 'Bourganeuf';
InfosPaysRR[0]['Comtes'][11]['Villages'][69] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][69]['Nom'] = 'Guéret';
InfosPaysRR[0]['Comtes'][11]['Villages'][100] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][100]['Nom'] = 'Rochechouart';
InfosPaysRR[0]['Comtes'][11]['Villages'][325] = new Array();
InfosPaysRR[0]['Comtes'][11]['Villages'][325]['Nom'] = 'Limoges';
InfosPaysRR[0]['Comtes'][13] = new Array();
InfosPaysRR[0]['Comtes'][13]['Nom'] = 'Duché du Lyonnais-Dauphiné';
InfosPaysRR[0]['Comtes'][13]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][70] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][70]['Nom'] = 'Vienne';
InfosPaysRR[0]['Comtes'][13]['Villages'][71] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][71]['Nom'] = 'Valence';
InfosPaysRR[0]['Comtes'][13]['Villages'][72] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][72]['Nom'] = 'Montélimar';
InfosPaysRR[0]['Comtes'][13]['Villages'][73] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][73]['Nom'] = 'Dié';
InfosPaysRR[0]['Comtes'][13]['Villages'][74] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][74]['Nom'] = 'Embrun';
InfosPaysRR[0]['Comtes'][13]['Villages'][75] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][75]['Nom'] = 'Briançon';
InfosPaysRR[0]['Comtes'][13]['Villages'][166] = new Array();
InfosPaysRR[0]['Comtes'][13]['Villages'][166]['Nom'] = 'Lyon';
InfosPaysRR[0]['Comtes'][15] = new Array();
InfosPaysRR[0]['Comtes'][15]['Nom'] = 'Comté de Flandres';
InfosPaysRR[0]['Comtes'][15]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][15]['Villages'][29] = new Array();
InfosPaysRR[0]['Comtes'][15]['Villages'][29]['Nom'] = 'Dunkerque';
InfosPaysRR[0]['Comtes'][15]['Villages'][38] = new Array();
InfosPaysRR[0]['Comtes'][15]['Villages'][38]['Nom'] = 'Tournai';
InfosPaysRR[0]['Comtes'][15]['Villages'][39] = new Array();
InfosPaysRR[0]['Comtes'][15]['Villages'][39]['Nom'] = 'Gent';
InfosPaysRR[0]['Comtes'][15]['Villages'][82] = new Array();
InfosPaysRR[0]['Comtes'][15]['Villages'][82]['Nom'] = 'Antwerpen';
InfosPaysRR[0]['Comtes'][15]['Villages'][161] = new Array();
InfosPaysRR[0]['Comtes'][15]['Villages'][161]['Nom'] = 'Bruges';
InfosPaysRR[0]['Comtes'][18] = new Array();
InfosPaysRR[0]['Comtes'][18]['Nom'] = 'Comté du Languedoc';
InfosPaysRR[0]['Comtes'][18]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][89] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][89]['Nom'] = 'Nîmes';
InfosPaysRR[0]['Comtes'][18]['Villages'][90] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][90]['Nom'] = 'Lodève';
InfosPaysRR[0]['Comtes'][18]['Villages'][91] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][91]['Nom'] = 'Béziers';
InfosPaysRR[0]['Comtes'][18]['Villages'][92] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][92]['Nom'] = 'Narbonne';
InfosPaysRR[0]['Comtes'][18]['Villages'][93] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][93]['Nom'] = 'Carcassonne';
InfosPaysRR[0]['Comtes'][18]['Villages'][97] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][97]['Nom'] = 'Alais';
InfosPaysRR[0]['Comtes'][18]['Villages'][107] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][107]['Nom'] = 'Mende';
InfosPaysRR[0]['Comtes'][18]['Villages'][108] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][108]['Nom'] = 'Uzès';
InfosPaysRR[0]['Comtes'][18]['Villages'][326] = new Array();
InfosPaysRR[0]['Comtes'][18]['Villages'][326]['Nom'] = 'Montpellier';
InfosPaysRR[0]['Comtes'][20] = new Array();
InfosPaysRR[0]['Comtes'][20]['Nom'] = 'Comté du Périgord';
InfosPaysRR[0]['Comtes'][20]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][20]['Villages'][101] = new Array();
InfosPaysRR[0]['Comtes'][20]['Villages'][101]['Nom'] = 'Angoulême';
InfosPaysRR[0]['Comtes'][20]['Villages'][102] = new Array();
InfosPaysRR[0]['Comtes'][20]['Villages'][102]['Nom'] = 'Sarlat';
InfosPaysRR[0]['Comtes'][20]['Villages'][103] = new Array();
InfosPaysRR[0]['Comtes'][20]['Villages'][103]['Nom'] = 'Bergerac';
InfosPaysRR[0]['Comtes'][20]['Villages'][104] = new Array();
InfosPaysRR[0]['Comtes'][20]['Villages'][104]['Nom'] = 'Castillon';
InfosPaysRR[0]['Comtes'][20]['Villages'][327] = new Array();
InfosPaysRR[0]['Comtes'][20]['Villages'][327]['Nom'] = 'Périgueux';
InfosPaysRR[0]['Comtes'][21] = new Array();
InfosPaysRR[0]['Comtes'][21]['Nom'] = 'Duché d\'Orléans (Domaine Royal)';
InfosPaysRR[0]['Comtes'][21]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][21]['Villages'][111] = new Array();
InfosPaysRR[0]['Comtes'][21]['Villages'][111]['Nom'] = 'Blois';
InfosPaysRR[0]['Comtes'][21]['Villages'][112] = new Array();
InfosPaysRR[0]['Comtes'][21]['Villages'][112]['Nom'] = 'Patay';
InfosPaysRR[0]['Comtes'][21]['Villages'][113] = new Array();
InfosPaysRR[0]['Comtes'][21]['Villages'][113]['Nom'] = 'Montargis';
InfosPaysRR[0]['Comtes'][21]['Villages'][114] = new Array();
InfosPaysRR[0]['Comtes'][21]['Villages'][114]['Nom'] = 'Gien';
InfosPaysRR[0]['Comtes'][21]['Villages'][328] = new Array();
InfosPaysRR[0]['Comtes'][21]['Villages'][328]['Nom'] = 'Orléans';
InfosPaysRR[0]['Comtes'][22] = new Array();
InfosPaysRR[0]['Comtes'][22]['Nom'] = 'Comté du Maine (Domaine Royal)';
InfosPaysRR[0]['Comtes'][22]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][22]['Villages'][125] = new Array();
InfosPaysRR[0]['Comtes'][22]['Villages'][125]['Nom'] = 'Montmirail';
InfosPaysRR[0]['Comtes'][22]['Villages'][126] = new Array();
InfosPaysRR[0]['Comtes'][22]['Villages'][126]['Nom'] = 'Mayenne';
InfosPaysRR[0]['Comtes'][22]['Villages'][133] = new Array();
InfosPaysRR[0]['Comtes'][22]['Villages'][133]['Nom'] = 'Laval';
InfosPaysRR[0]['Comtes'][22]['Villages'][329] = new Array();
InfosPaysRR[0]['Comtes'][22]['Villages'][329]['Nom'] = 'Le Mans';
InfosPaysRR[0]['Comtes'][23] = new Array();
InfosPaysRR[0]['Comtes'][23]['Nom'] = 'Duché d\'Alençon (Domaine Royal)';
InfosPaysRR[0]['Comtes'][23]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][23]['Villages'][129] = new Array();
InfosPaysRR[0]['Comtes'][23]['Villages'][129]['Nom'] = 'Mortagne';
InfosPaysRR[0]['Comtes'][23]['Villages'][130] = new Array();
InfosPaysRR[0]['Comtes'][23]['Villages'][130]['Nom'] = 'Verneuil';
InfosPaysRR[0]['Comtes'][23]['Villages'][131] = new Array();
InfosPaysRR[0]['Comtes'][23]['Villages'][131]['Nom'] = 'Argentan';
InfosPaysRR[0]['Comtes'][23]['Villages'][330] = new Array();
InfosPaysRR[0]['Comtes'][23]['Villages'][330]['Nom'] = 'Alençon';
InfosPaysRR[0]['Comtes'][49] = new Array();
InfosPaysRR[0]['Comtes'][49]['Nom'] = 'Duché de Guyenne';
InfosPaysRR[0]['Comtes'][49]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][257] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][257]['Nom'] = 'La Teste-de-Buch';
InfosPaysRR[0]['Comtes'][49]['Villages'][258] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][258]['Nom'] = 'Bazas';
InfosPaysRR[0]['Comtes'][49]['Villages'][259] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][259]['Nom'] = 'Marmande';
InfosPaysRR[0]['Comtes'][49]['Villages'][260] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][260]['Nom'] = 'Agen';
InfosPaysRR[0]['Comtes'][49]['Villages'][261] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][261]['Nom'] = 'Montauban';
InfosPaysRR[0]['Comtes'][49]['Villages'][262] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][262]['Nom'] = 'Cahors';
InfosPaysRR[0]['Comtes'][49]['Villages'][263] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][263]['Nom'] = 'Blaye';
InfosPaysRR[0]['Comtes'][49]['Villages'][461] = new Array();
InfosPaysRR[0]['Comtes'][49]['Villages'][461]['Nom'] = 'Bordeaux';
InfosPaysRR[0]['Comtes'][65] = new Array();
InfosPaysRR[0]['Comtes'][65]['Nom'] = 'Duché de Gascogne';
InfosPaysRR[0]['Comtes'][65]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][65]['Villages'][364] = new Array();
InfosPaysRR[0]['Comtes'][65]['Villages'][364]['Nom'] = 'Mimizan';
InfosPaysRR[0]['Comtes'][65]['Villages'][365] = new Array();
InfosPaysRR[0]['Comtes'][65]['Villages'][365]['Nom'] = 'Labrit';
InfosPaysRR[0]['Comtes'][65]['Villages'][367] = new Array();
InfosPaysRR[0]['Comtes'][65]['Villages'][367]['Nom'] = 'Dax';
InfosPaysRR[0]['Comtes'][65]['Villages'][368] = new Array();
InfosPaysRR[0]['Comtes'][65]['Villages'][368]['Nom'] = 'Bayonne';
InfosPaysRR[0]['Comtes'][65]['Villages'][471] = new Array();
InfosPaysRR[0]['Comtes'][65]['Villages'][471]['Nom'] = 'Mont-de-Marsan';
InfosPaysRR[0]['Comtes'][66] = new Array();
InfosPaysRR[0]['Comtes'][66]['Nom'] = 'Comté de Béarn';
InfosPaysRR[0]['Comtes'][66]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][66]['Villages'][366] = new Array();
InfosPaysRR[0]['Comtes'][66]['Villages'][366]['Nom'] = 'Orthez';
InfosPaysRR[0]['Comtes'][66]['Villages'][369] = new Array();
InfosPaysRR[0]['Comtes'][66]['Villages'][369]['Nom'] = 'Mauléon';
InfosPaysRR[0]['Comtes'][66]['Villages'][370] = new Array();
InfosPaysRR[0]['Comtes'][66]['Villages'][370]['Nom'] = 'Tarbes';
InfosPaysRR[0]['Comtes'][66]['Villages'][371] = new Array();
InfosPaysRR[0]['Comtes'][66]['Villages'][371]['Nom'] = 'Lourdes';
InfosPaysRR[0]['Comtes'][66]['Villages'][472] = new Array();
InfosPaysRR[0]['Comtes'][66]['Villages'][472]['Nom'] = 'Pau';
InfosPaysRR[0]['Comtes'][67] = new Array();
InfosPaysRR[0]['Comtes'][67]['Nom'] = 'Comté d\'Armagnac et de Comminges';
InfosPaysRR[0]['Comtes'][67]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][372] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][372]['Nom'] = 'Eauze';
InfosPaysRR[0]['Comtes'][67]['Villages'][373] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][373]['Nom'] = 'Lectoure';
InfosPaysRR[0]['Comtes'][67]['Villages'][374] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][374]['Nom'] = 'Muret';
InfosPaysRR[0]['Comtes'][67]['Villages'][375] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][375]['Nom'] = 'Saint-Liziers';
InfosPaysRR[0]['Comtes'][67]['Villages'][376] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][376]['Nom'] = 'Saint Bertrand de Comminges';
InfosPaysRR[0]['Comtes'][67]['Villages'][473] = new Array();
InfosPaysRR[0]['Comtes'][67]['Villages'][473]['Nom'] = 'Auch';
InfosPaysRR[0]['Comtes'][68] = new Array();
InfosPaysRR[0]['Comtes'][68]['Nom'] = 'Comté de Toulouse';
InfosPaysRR[0]['Comtes'][68]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][68]['Villages'][377] = new Array();
InfosPaysRR[0]['Comtes'][68]['Villages'][377]['Nom'] = 'Foix';
InfosPaysRR[0]['Comtes'][68]['Villages'][378] = new Array();
InfosPaysRR[0]['Comtes'][68]['Villages'][378]['Nom'] = 'Castelnaudary';
InfosPaysRR[0]['Comtes'][68]['Villages'][379] = new Array();
InfosPaysRR[0]['Comtes'][68]['Villages'][379]['Nom'] = 'Castres';
InfosPaysRR[0]['Comtes'][68]['Villages'][380] = new Array();
InfosPaysRR[0]['Comtes'][68]['Villages'][380]['Nom'] = 'Albi';
InfosPaysRR[0]['Comtes'][68]['Villages'][474] = new Array();
InfosPaysRR[0]['Comtes'][68]['Villages'][474]['Nom'] = 'Toulouse';
InfosPaysRR[0]['Comtes'][69] = new Array();
InfosPaysRR[0]['Comtes'][69]['Nom'] = 'Comté de Rouergue';
InfosPaysRR[0]['Comtes'][69]['Villages'] = new Array();
InfosPaysRR[0]['Comtes'][69]['Villages'][381] = new Array();
InfosPaysRR[0]['Comtes'][69]['Villages'][381]['Nom'] = 'Villefranche-de-Rouergue';
InfosPaysRR[0]['Comtes'][69]['Villages'][382] = new Array();
InfosPaysRR[0]['Comtes'][69]['Villages'][382]['Nom'] = 'Espalion';
InfosPaysRR[0]['Comtes'][69]['Villages'][383] = new Array();
InfosPaysRR[0]['Comtes'][69]['Villages'][383]['Nom'] = 'Millau';
InfosPaysRR[0]['Comtes'][69]['Villages'][475] = new Array();
InfosPaysRR[0]['Comtes'][69]['Villages'][475]['Nom'] = 'Rodez';
InfosPaysRR[0]['Comtes'][100] = new Array();
InfosPaysRR[0]['Comtes'][100]['Nom'] = 'ville franche';
InfosPaysRR[2] = new Array();
InfosPaysRR[2]['Nom'] = 'Sacrum Romanorum Imperium Nationis Germanicæ';
InfosPaysRR[2]['Comtes'] = new Array();
InfosPaysRR[2]['Comtes'][12] = new Array();
InfosPaysRR[2]['Comtes'][12]['Nom'] = 'Franche-Comté';
InfosPaysRR[2]['Comtes'][12]['Villages'] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][64] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][64]['Nom'] = 'Poligny';
InfosPaysRR[2]['Comtes'][12]['Villages'][65] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][65]['Nom'] = 'Saint Claude';
InfosPaysRR[2]['Comtes'][12]['Villages'][66] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][66]['Nom'] = 'Vesoul';
InfosPaysRR[2]['Comtes'][12]['Villages'][67] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][67]['Nom'] = 'Luxeuil';
InfosPaysRR[2]['Comtes'][12]['Villages'][68] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][68]['Nom'] = 'Pontarlier';
InfosPaysRR[2]['Comtes'][12]['Villages'][165] = new Array();
InfosPaysRR[2]['Comtes'][12]['Villages'][165]['Nom'] = 'Dole';
InfosPaysRR[2]['Comtes'][14] = new Array();
InfosPaysRR[2]['Comtes'][14]['Nom'] = 'Duché de Savoie';
InfosPaysRR[2]['Comtes'][14]['Villages'] = new Array();
InfosPaysRR[2]['Comtes'][14]['Villages'][78] = new Array();
InfosPaysRR[2]['Comtes'][14]['Villages'][78]['Nom'] = 'Bourg';
InfosPaysRR[2]['Comtes'][14]['Villages'][79] = new Array();
InfosPaysRR[2]['Comtes'][14]['Villages'][79]['Nom'] = 'Belley';
InfosPaysRR[2]['Comtes'][14]['Villages'][80] = new Array();
InfosPaysRR[2]['Comtes'][14]['Villages'][80]['Nom'] = 'Annecy';
InfosPaysRR[2]['Comtes'][14]['Villages'][167] = new Array();
InfosPaysRR[2]['Comtes'][14]['Villages'][167]['Nom'] = 'Chambéry';
InfosPaysRR[2]['Comtes'][16] = new Array();
InfosPaysRR[2]['Comtes'][16]['Nom'] = 'Comté de Provence';
InfosPaysRR[2]['Comtes'][16]['Villages'] = new Array();
InfosPaysRR[2]['Comtes'][16]['Villages'][83] = new Array();
InfosPaysRR[2]['Comtes'][16]['Villages'][83]['Nom'] = 'Marseille';
InfosPaysRR[2]['Comtes'][16]['Villages'][85] = new Array();
InfosPaysRR[2]['Comtes'][16]['Villages'][85]['Nom'] = 'Brignoles';
InfosPaysRR[2]['Comtes'][16]['Villages'][96] = new Array();
InfosPaysRR[2]['Comtes'][16]['Villages'][96]['Nom'] = 'Arles';
InfosPaysRR[2]['Comtes'][16]['Villages'][331] = new Array();
InfosPaysRR[2]['Comtes'][16]['Villages'][331]['Nom'] = 'Aix';
InfosPaysRR[2]['Comtes'][29] = new Array();
InfosPaysRR[2]['Comtes'][29]['Nom'] = 'Duché de Lorraine';
InfosPaysRR[2]['Comtes'][29]['Villages'] = new Array();
InfosPaysRR[2]['Comtes'][29]['Villages'][156] = new Array();
InfosPaysRR[2]['Comtes'][29]['Villages'][156]['Nom'] = 'Epinal';
InfosPaysRR[2]['Comtes'][29]['Villages'][158] = new Array();
InfosPaysRR[2]['Comtes'][29]['Villages'][158]['Nom'] = 'Vaudemont';
InfosPaysRR[2]['Comtes'][29]['Villages'][159] = new Array();
InfosPaysRR[2]['Comtes'][29]['Villages'][159]['Nom'] = 'Toul';
InfosPaysRR[2]['Comtes'][29]['Villages'][332] = new Array();
InfosPaysRR[2]['Comtes'][29]['Villages'][332]['Nom'] = 'Nancy';
InfosPaysRR[2]['Comtes'][32] = new Array();
InfosPaysRR[2]['Comtes'][32]['Nom'] = 'Schweizerische Eidgenossenschaft';
InfosPaysRR[2]['Comtes'][32]['Villages'] = new Array();
InfosPaysRR[2]['Comtes'][32]['Villages'][180] = new Array();
InfosPaysRR[2]['Comtes'][32]['Villages'][180]['Nom'] = 'Genève';
InfosPaysRR[2]['Comtes'][32]['Villages'][182] = new Array();
InfosPaysRR[2]['Comtes'][32]['Villages'][182]['Nom'] = 'Grandson';
InfosPaysRR[2]['Comtes'][32]['Villages'][183] = new Array();
InfosPaysRR[2]['Comtes'][32]['Villages'][183]['Nom'] = 'Fribourg';
InfosPaysRR[2]['Comtes'][32]['Villages'][185] = new Array();
InfosPaysRR[2]['Comtes'][32]['Villages'][185]['Nom'] = 'Sion';

/*InfosPaysRR[0] = new Array();
InfosPaysRR[0]['Nom'] = 'Royaume de France';
InfosPaysRR[0]['Comtes'] = new Array();
InfosPaysRR[2] = new Array();
InfosPaysRR[2]['Nom'] = 'Sacrum Romanorum Imperium Nationis Germanicæ';
InfosPaysRR[2]['Comtes'] = new Array();
InfosPaysRR[4] = new Array();
InfosPaysRR[4]['Nom'] = 'Corona de Aragón';
InfosPaysRR[4]['Comtes'] = new Array();
InfosPaysRR[8] = new Array();
InfosPaysRR[8]['Nom'] = 'Reino de Portugal';
InfosPaysRR[8]['Comtes'] = new Array();
InfosPaysRR[0]['Comtes'][0] = new Array();
InfosPaysRR[0]['Comtes'][0]['Nom'] = 'Comté d\'Artois';
InfosPaysRR[0]['Comtes'][1] = new Array();
InfosPaysRR[0]['Comtes'][1]['Nom'] = 'Duché de Champagne (Domaine Royal)';
InfosPaysRR[0]['Comtes'][3] = new Array();
InfosPaysRR[0]['Comtes'][3]['Nom'] = 'Duché de Normandie (Domaine Royal)';
InfosPaysRR[0]['Comtes'][4] = new Array();
InfosPaysRR[0]['Comtes'][4]['Nom'] = 'Duché de Bretagne';
InfosPaysRR[0]['Comtes'][5] = new Array();
InfosPaysRR[0]['Comtes'][5]['Nom'] = 'Duché de Bourgogne';
InfosPaysRR[0]['Comtes'][6] = new Array();
InfosPaysRR[0]['Comtes'][6]['Nom'] = 'Duché du Berry';
InfosPaysRR[0]['Comtes'][7] = new Array();
InfosPaysRR[0]['Comtes'][7]['Nom'] = 'Duché du Bourbonnais-Auvergne';
InfosPaysRR[0]['Comtes'][8] = new Array();
InfosPaysRR[0]['Comtes'][8]['Nom'] = 'Duché de Touraine';
InfosPaysRR[0]['Comtes'][9] = new Array();
InfosPaysRR[0]['Comtes'][9]['Nom'] = 'Duché d\'Anjou';
InfosPaysRR[0]['Comtes'][10] = new Array();
InfosPaysRR[0]['Comtes'][10]['Nom'] = 'Comté du Poitou';
InfosPaysRR[0]['Comtes'][11] = new Array();
InfosPaysRR[0]['Comtes'][11]['Nom'] = 'Comté du Limousin et de La Marche';
InfosPaysRR[0]['Comtes'][13] = new Array();
InfosPaysRR[0]['Comtes'][13]['Nom'] = 'Duché du Lyonnais-Dauphiné';
InfosPaysRR[0]['Comtes'][15] = new Array();
InfosPaysRR[0]['Comtes'][15]['Nom'] = 'Comté de Flandres';
InfosPaysRR[0]['Comtes'][18] = new Array();
InfosPaysRR[0]['Comtes'][18]['Nom'] = 'Comté du Languedoc';
InfosPaysRR[0]['Comtes'][20] = new Array();
InfosPaysRR[0]['Comtes'][20]['Nom'] = 'Comté du Périgord';
InfosPaysRR[0]['Comtes'][21] = new Array();
InfosPaysRR[0]['Comtes'][21]['Nom'] = 'Duché d\'Orléans (Domaine Royal)';
InfosPaysRR[0]['Comtes'][22] = new Array();
InfosPaysRR[0]['Comtes'][22]['Nom'] = 'Comté du Maine (Domaine Royal)';
InfosPaysRR[0]['Comtes'][23] = new Array();
InfosPaysRR[0]['Comtes'][23]['Nom'] = 'Duché d\'Alençon (Domaine Royal)';
InfosPaysRR[0]['Comtes'][49] = new Array();
InfosPaysRR[0]['Comtes'][49]['Nom'] = 'Duché de Guyenne';
InfosPaysRR[0]['Comtes'][65] = new Array();
InfosPaysRR[0]['Comtes'][65]['Nom'] = 'Duché de Gascogne';
InfosPaysRR[0]['Comtes'][66] = new Array();
InfosPaysRR[0]['Comtes'][66]['Nom'] = 'Comté de Béarn';
InfosPaysRR[0]['Comtes'][67] = new Array();
InfosPaysRR[0]['Comtes'][67]['Nom'] = 'Comté d\'Armagnac et de Comminges';
InfosPaysRR[0]['Comtes'][68] = new Array();
InfosPaysRR[0]['Comtes'][68]['Nom'] = 'Comté de Toulouse';
InfosPaysRR[0]['Comtes'][69] = new Array();
InfosPaysRR[0]['Comtes'][69]['Nom'] = 'Comté de Rouergue';
InfosPaysRR[2]['Comtes'][12] = new Array();
InfosPaysRR[2]['Comtes'][12]['Nom'] = 'Franche-Comté';
InfosPaysRR[2]['Comtes'][14] = new Array();
InfosPaysRR[2]['Comtes'][14]['Nom'] = 'Duché de Savoie';
InfosPaysRR[2]['Comtes'][16] = new Array();
InfosPaysRR[2]['Comtes'][16]['Nom'] = 'Comté de Provence';
InfosPaysRR[2]['Comtes'][17] = new Array();
InfosPaysRR[2]['Comtes'][17]['Nom'] = 'Markgrafschaft von Baden';
InfosPaysRR[2]['Comtes'][26] = new Array();
InfosPaysRR[2]['Comtes'][26]['Nom'] = 'Grafschaft von Württemberg';
InfosPaysRR[2]['Comtes'][29] = new Array();
InfosPaysRR[2]['Comtes'][29]['Nom'] = 'Duché de Lorraine';
InfosPaysRR[2]['Comtes'][30] = new Array();
InfosPaysRR[2]['Comtes'][30]['Nom'] = 'Grafschaft von Augsburg';
InfosPaysRR[2]['Comtes'][32] = new Array();
InfosPaysRR[2]['Comtes'][32]['Nom'] = 'Schweizerische Eidgenossenschaft';
InfosPaysRR[2]['Comtes'][33] = new Array();
InfosPaysRR[2]['Comtes'][33]['Nom'] = 'Ducato di Milano';
InfosPaysRR[2]['Comtes'][35] = new Array();
InfosPaysRR[2]['Comtes'][35]['Nom'] = 'Graafschap Holland';
InfosPaysRR[2]['Comtes'][37] = new Array();
InfosPaysRR[2]['Comtes'][37]['Nom'] = 'Herzogtum von Bayern';
InfosPaysRR[2]['Comtes'][44] = new Array();
InfosPaysRR[2]['Comtes'][44]['Nom'] = 'Erzherzogtum von Österreich';
InfosPaysRR[2]['Comtes'][54] = new Array();
InfosPaysRR[2]['Comtes'][54]['Nom'] = 'Ducato di Modena';
InfosPaysRR[2]['Comtes'][58] = new Array();
InfosPaysRR[2]['Comtes'][58]['Nom'] = 'Repubblica di Genova';
InfosPaysRR[2]['Comtes'][59] = new Array();
InfosPaysRR[2]['Comtes'][59]['Nom'] = 'Burggrafschaft von Nürnberg';
InfosPaysRR[2]['Comtes'][60] = new Array();
InfosPaysRR[2]['Comtes'][60]['Nom'] = 'Fürstentum Mainz';
InfosPaysRR[2]['Comtes'][70] = new Array();
InfosPaysRR[2]['Comtes'][70]['Nom'] = 'Repubblica fiorentina';
InfosPaysRR[2]['Comtes'][73] = new Array();
InfosPaysRR[2]['Comtes'][73]['Nom'] = 'Herzogtum Steiermark';
InfosPaysRR[2]['Comtes'][77] = new Array();
InfosPaysRR[2]['Comtes'][77]['Nom'] = 'Repubblica di Siena';
InfosPaysRR[4]['Comtes'][36] = new Array();
InfosPaysRR[4]['Comtes'][36]['Nom'] = 'Principado de Cataluña';
InfosPaysRR[4]['Comtes'][50] = new Array();
InfosPaysRR[4]['Comtes'][50]['Nom'] = 'Reino de Valencia';
InfosPaysRR[8]['Comtes'][41] = new Array();
InfosPaysRR[8]['Comtes'][41]['Nom'] = 'Condado do Porto';
InfosPaysRR[8]['Comtes'][56] = new Array();
InfosPaysRR[8]['Comtes'][56]['Nom'] = 'Condado de Coimbra';
InfosPaysRR[8]['Comtes'][72] = new Array();
InfosPaysRR[8]['Comtes'][72]['Nom'] = 'Condado de Lisboa';*/
/* Peuplement SELECT des select de Préférences **** Ajout 2016_02_24 */


/************* Initialisations des fonctions globales *************/

function logit(msg) {
	var now = new Date();
	console.log(' @ ' + now.toTimeString().substring(0, 8) + '.' + now.getMilliseconds() + ': ' + msg);
}
function getNbJours(mois){
	var lgMois = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	return lgMois[mois]; // 0 < mois <11
}
function time_sleep_until (timestamp) {
  while (new Date() < timestamp * 1000) {}
  return true;
}
function pausecomp(ms) {
	currentTime = new Date().getTime();
   while (currentTime + ms >= new Date().getTime()) {
   }
//   while (new Date() < ms){}
} 
function theHour() {
	var ladate=new Date()
	var h=ladate.getHours();
	if (h<10) {h = "0" + h};
	return (h);
}
function Personnage(nPseudo, nVillage, nComte, nPays, nStatus, nPR, nEcu, nNiveau, nMetier, nChamp1, nChamp2, date) {
    this.Pseudo = nPseudo;
    this.Village = nVillage;
    this.Comte = nComte;
    this.Pays = nPays;
    this.Status = nStatus;
    this.PR = nPR;
    this.Ecu = nEcu;
    this.Niveau = nNiveau;
    this.Metier = Number(nMetier);
    this.Champ1 = Number(nChamp1);
    this.Champ2 = Number(nChamp2);
    this.date = date;
}
function Present(nPseudo, nVillage, nComte, nPays, nStatus, nEcu) {
    this.Pseudo = nPseudo;
    this.Village = nVillage;
    this.Comte = nComte;
    this.Pays = nPays;
    this.Status = nStatus;
    this.Ecu = nEcu;
}
function aFraudeurs (Pseudo, Ecus, Stat, fDate) {
	this.Pseudo = Pseudo;
    this.Ecus = Ecus;
    this.Stat = Stat;
    this.fDate = fDate;
}
function Brigand(Pseudo, Motif, Date, Stat) {
    this.Pseudo = Pseudo;
    this.Motif = Motif;
    this.Date = Date;
    this.Stat = Stat;
}
function pluriel(n, t) {
    if (n > 1)
        return(t + 's');
    else
        return(t);
}
function siOnglet(x, t) {
    var el = document.getElementById("chaineNavigation");
    if (el.innerHTML.indexOf(x) == -1) {
        if (t != "")
            alert(t);
        return(0);
    }
    return(1);
}
function QuelOnglet() {
    var xBarre = document.getElementsByClassName("texteOnglet")[0];
    if (xBarre != null) {
        return (xBarre.innerHTML);
    } else {
        return("");
    }
}
function Apropos() {
    var m = RRpopup.init("RRleGuet", 1), t = "";
    t += "<h1>RReasy : Le Guet du RR...<br> et bien d'autres choses...</h1>";
    t += "<b>RReasy</b> est un script réalisé par <a href='FichePersonnage.php?login=favdb'>Favdb</a>, , modifié et aménagé par <a href='#' onClick='javascript:popupPerso(\"FichePersonnage.php?login=Cigalou01\")'>Cigalou01</a>";
    t += "<p><b>Versions:</b></p>";
    t += '<table cellspacing="2">\n';
    for (var i = 0; i < lVersions.length; i++) {
        t += '<tr style="font-size:10px">\n';
        t += '<td valign="top">' + lVersions[i][0] + '</td>\n';
        t += '<td valign="top">' + lVersions[i][2] + '</td>\n';
        t += '<td valign="top">' + lVersions[i][1] + '</td>\n';
        t += '</tr>\n';
    }
    t += "</table\n";
    RRpopup.setMessage(m, t + "<p>");
    ClipboardCopyTo(t);
    RRpopup.fermeture(m);
}
function getData(Src, d, f) {
    var p1 = Src.indexOf(d);
    if (p1 == -1)
        return("");
    p1 += d.length;
    var p2 = Src.indexOf(f, p1);
    if (p2 == -1)
        return("");
    return(Src.substring(p1, p2));
}
function triPseudo(a, b) {
    var aa = a.Pseudo, bb = b.Pseudo;
    var len = Math.min(aa.length, bb.length);
    for (i = 0; i < len; i++) {
        if (aa.charCodeAt(i) != bb.charCodeAt(i)) {
            return(aa.charCodeAt(i) - bb.charCodeAt(i));
        }
    }
    if (aa.length > len)
        return(1);
    if (bb.length > len)
        return(-1);
    return(0);
}
function AjouterMission() {
    var i = PersoMission;
    if (PersoJour != mDate) {
        PersoMission++;
        GM_setValue("PersoMission_"+mVille, PersoMission);
    }
}
function GetLocalisation(Src) {

}
function SectionArmee(Src) {
    var x = getData(HtmlToString(Src), "Vous appartenez à l'armée ", "<form action=\"Action.php?action=150\"");
    x = str_replace(x, "</p>", "\n");
    x = str_replace(x, "<form", "\n<form");
    var y = x.split("\n"), i = 0, z = 0;
    x = "";
    for (i = 0; i < y.length; i++) {
        z = 0;
        if (y[i].indexOf("Salaire") != -1)
            z = 1;
        if (y[i].indexOf("Quitter") != -1)
            z = 1;
        if (y[i].indexOf("Si vous cliquez") != -1)
            z = 1;
        if (y[i].indexOf("Aucun ordre passé") != -1)
            z = 1;
        if (y[i].indexOf("Offres de vente") != -1)
            z = 1;
        if (y[i].indexOf("Vous pouvez donner") != -1)
            z = 1;
        if (y[i].indexOf("form method=") != -1)
            z = 1;
        if (y[i].indexOf("Encombrement") != -1)
            z = 1;
        if (y[i].indexOf("logistique") != -1)
            z = 1;
        if (y[i].indexOf("<div") != -1)
            z = 1;
        if (z == 0) {
            if (y[i].indexOf("Renvoyer") != -1)
                y[i] = y[i].substring(0, y[i].indexOf(" - <a class=\"boutonAction\""));
            if (y[i].length > 1)
                x += y[i] + "\n";
        }
    }
    x = BBc.fromHTML(x);
    x = str_replace(x, "\n\n", "\n");
    x = "Vous êtes dans l'armée " + x;
    return(x);
}
function VousAppartenez(Src) {
    var resu = "";
    resu += Src + "\n\n";
    var pp1 = 0, pp2 = 0, nx = 0;
    if (Src.indexOf("Vous appartenez ") != -1) {
        if (Src.indexOf("Vous appartenez &agrave; l\\'arm&eacute;e") != -1) {
            resu = SectionArmee(Src);
        } else {
            var xSrc = Src.substring(0, Src.indexOf("</li>"));
            resu = "[b]Vous appartenez à un groupe armé[/b] qui comprend aussi";
            pp1 = xSrc.indexOf("login=", pp2);
            pp2 = xSrc.indexOf("'", pp1);
            nx = 0;
            while ((pp1 != -1) && (pp2 != -1)) {
                resu += (nx > 0 ? ", " : " ");
                resu += Perso.lienBBcode(xSrc.substring(pp1 + 6, pp2));
                pp1 = xSrc.indexOf("login=", pp2);
                pp2 = xSrc.indexOf("'", pp1);
                nx++;
            }
        }
        resu += "\n";
    }
    return(resu);
}
function GetListeEscouade(Src) {
    if (Src.length < 1)
    	GetListeEscouade(Src.substring(Src.indexOf("textePage[4]['Texte']")))
    var x = VousAppartenez(Src);
    if (x.indexOf("armée") != -1)
        return(x);
    if (x.indexOf("[url=") > 0)
        x = x.substring(x.indexOf("[url="), x.length - 1);
    else
        x = "";
    return(x);
}
function GetListeGroupes(Src) {
    var resu = "";
    resu = "[b]Groupes présents :[/b]";
    var nb = 0;
    if (Src.indexOf("Groupes présents ici :</li><ul>") == -1) {
    		if (Src.indexOf("Groupes pr&eacute;sents ici :</li><ul>") == -1) {
		        alert("L'information est impossible à analyser!");
		        return(resu + "L'information est impossible à analyser!");
			}
    }
    var p1 = 0, p2 = 0;
    p1 = Src.indexOf("<tr class=\"ligneGroupe1\">", 0);
    p2 = Src.indexOf("</td></tr>", p1) + "</td></tr>".length;
    var xSrc = Src.substring(p1, p2);
    var pp1 = 0, pp2 = 0;
    while ((p1 != -1) && (p2 != -1)) {
        pp1 = xSrc.indexOf("<td colspan=\"2\">", pp1) + "<td colspan=\"2\">".length;
        pp2 = xSrc.indexOf("<", pp1);
        if (xSrc.substring(pp1, pp2) == "Corps d\\'armes de ")
            resu += "\n" + "Corps d'armes de ";
        else
            resu += "\n" + xSrc.substring(pp1, pp2);
        pp1 = xSrc.indexOf("login=", pp2);
        pp2 = xSrc.indexOf("')\">", pp1);
        nx = 0;
        while ((pp1 != -1) && (pp2 != -1)) {
            if (nx > 0) {
                resu += ", ";
            }
            resu += Perso.lienBBcode(xSrc.substring(pp1 + 6, pp2));
            pp1 = xSrc.indexOf("login=", pp2);
            if (pp1 != -1)
                pp2 = xSrc.indexOf("')\">", pp1);
            nx++;
        }
        p1 = Src.indexOf("<tr class=\"ligneGroupe1\">", p2);
        p2 = Src.indexOf("</td></tr>", p1) + "</td></tr>".length;
        if ((p1 != -1) && (p2 != -1))
            xSrc = Src.substring(p1, p2);
        nb++;
        pp1 = 0;
        pp2 = 0;
    }
    p1 = Src.indexOf("</ul><li>Contr", 0);
    p1 = Src.indexOf("</li><ul><li>", 0) + "</li><ul><li>".length;
    p2 = Src.indexOf("<", p1);
    resu += "\n" + cvCar(Src.substring(p1, p2)) + "\n";
    return(resu);
}
function GetNiveauAlerte() {
    var i = 0, n = ["Vert", "Jaune", "Orange", "Rouge", "Armée", "inconnu"], x = "Niveaud'alerte";
    for (i = 0; i < n.length; i++)
        x += "\n" + (i + 1) + "=" + n[i];
    var z = window.prompt(x, "");
    i = parseInt(z);
    if ((i > 0) && (i < n.length))
        x = n[i - 1] + " [img]http://fa.vdb.free.fr/RR/bouton" + n[i - 1] + ".gif[/img]";
    else
        x = "inconnu";
    return(x);
}
function GetOrdreDuJour() {
    var i = 0,
            x = "Ordre du jour",
            n = ["vous pouvez travailler", "travail invisible", "patrouille/escorte", "défense du pouvoir", "suivre l'armée", "inconnu"];
    for (i = 0; i < n.length; i++)
        x += "\n" + (i + 1) + "=" + n[i];
    var z = window.prompt(x, "");
    i = parseInt(z);
    if ((i > 0) && (i < n.length))
        x = n[i - 1];
    else
        x = "inconnu";
    return(x);
}
function str_replace(SRs, SRt, SRu) {
    if (SRs == undefined)
        return("?");
    var SRRi = SRs.indexOf(SRt);
    var SRRr = '';
    if (SRRi == -1)
        return SRs;
    SRRr += SRs.substring(0, SRRi) + SRu;
    if (SRRi + SRt.length < SRs.length)
        SRRr += str_replace(SRs.substring(SRRi + SRt.length, SRs.length), SRt, SRu);
    return SRRr;
}
function ClipboardCopyTo(s) {
    if (window.clipboardData) {
        window.clipboardData.setData("Text", s);
    }
    else {
        GM_setClipboard(s);
    }
    return(false);
}
function HtmlToString(Src) {
    var spec = new Array("&eacute;", "&Eacute;", "&egrave;", "&ecirc;", "&euml;",
            "&agrave;", "&acirc;", "&icirc;", "&iuml;", "&quot;", "&nbsp;", "&ocirc;", "&ucirc;", "Ã¢", "<br>", "<br />", "\\'");
    var norm = new Array("é", "É", "è", "ê", "ë", "à", "â", "î", "ï", "'", " ", "ô", "û", "â", "\n", "\n", "'");
    for (var i = 0; i < spec.length; i++) {
        Src = str_replace(Src, spec[i], norm[i]);
    }
    return(Src);
}
function cvCar(x) {
    var spec = new Array(
            "Ã©",
            "Ã‰",
            "Ã¨",
            "e_circonflexe",
            "e_trema",
            "Ã",
            "Ãª",
            "à®",
            "Ã¯",
            "Ã»",
            "Ã§",
            "à§",
            "Ã´",
            "à¦",
            "à´",
            "à¼",
            "à¢",
            "àª",
            "Â" //Ã¢
            );
    var norm = new Array(
            "é",
            "É",
            "è",
            "ê",
            "ë",
            "à",
            "â",
            "î",
            "ï",
            "û",
            "ç",
            "ç",
            "ô",
            "ae",
            "ô",
            "ü",
            "â",
            "ê",
            ""
            );
    for (var i = 0; i < spec.length; i++) {
//		logit ("cvCar l. 3572 : x-Spec-Norm : '" + x + "' - '" + spec[i] + "' - '" + norm[i] + "'");
        x = str_replace(x, spec[i], norm[i]);
    }
    return(x);
}
function TexTConvert(text, body) {
    var StrErr = String.fromCharCode(65535);
    var result = "";
    var code = "";
    var len = 0;
    var begin = 0;
    var ptr = 0;
    while ((pos = text.substring(begin).indexOf(StrErr)) != -1) {
        ptr += pos;
        code = bcode(body, ptr);
        if (code <= 191)
            len = 1;
        else if (code <= 223)
            len = 2;
        else if (code <= 239)
            len = 3;
        else if (code <= 247)
            len = 4;
        else if (code <= 251)
            len = 5;
        else if (code <= 253)
            len = 6;
        else
            len = 1;
        if (code == 255)
            result += text.substring(begin, pos + begin) + b2s(body, ptr, 0);
        else
            result += text.substring(begin, pos + begin) + b2s(body, ptr, ptr + len);
        ptr += len;
        if (code == 255)
            begin = text.length;
        else
            begin += pos + 1;
    }
    result += text.substring(begin);
    return(result);
}
function stringToDate(x) {
    var z = x.split(" ");
    if (isNaN(z[0])) {
        z[0] = z[1];
        z[1] = z[2];
        z[2] = z[3];
    }
    var m = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
    var i = 0;
    for (i = 0; i < m.length; i++) {
        if (HtmlToString(m[i]) == z[1])
            break;
    }
    if (i == m.length)
        i = 7;
    return((z[0].length < 2 ? "0" + z[0] : z[0]) + "/" + (i < 9 ? "0" + (i + 1) : (i + 1)) + "/" + z[2]);
}
function difDate(str1, str2) {
    var dt1 = Number(str1.substring(0, 2));
    var mon1 = Number(str1.substring(3, 5));
    var yr1 = Number(str1.substring(6, 10));
    var dt2 = Number(str2.substring(0, 2));
    var mon2 = Number(str2.substring(3, 5));
    var yr2 = Number(str2.substring(6, 10));
    var d1 = new Date(yr1, mon1 - 1, dt1);
    var d2 = new Date(yr2, mon2 - 1, dt2);
    var milli_d1 = d1.getTime();
    var milli_d2 = d2.getTime();
    var diff = milli_d1 - milli_d2;
    var num_days = diff / 86400000;
    return(num_days);
}
function SendXMLHttpRequest(Method, Url, Message, CallBack, Obj) {
    var xhr_object = null;
    var URLParam = "";
    if (window.XMLHttpRequest) {
        xhr_object = new XMLHttpRequest();
        if (xhr_object.overrideMimeType)
            xhr_object.overrideMimeType('text/html; charset=iso-8859-1');
    }
    else if (window.ActiveXObject)
        xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
    else {
        alert("impossible de créer le xhr_object");
        return(false);
    }
    if (Method == "GET")
        URLParam = "?" + Message;
    try {
        xhr_object.open(Method, Url + URLParam, true);
    } catch (e) {
        alert("erreur sur xhr_object.open(" + Method + ", " + Url + URLParam + ", true)");
        return(false);
    }
    xhr_object.onreadystatechange = function () {
        if (xhr_object.readyState == 4) {
            if (CallBack != undefined) {
                if (Obj == undefined)
                    CallBack(TexTConvert(xhr_object.responseText, xhr_object.responseBody));
                else
                    Obj[CallBack](TexTConvert(xhr_object.responseText, xhr_object.responseBody));
            }
        }
    }
    if (Method == "GET") {
        xhr_object.send(null);
    }
    else {
        xhr_object.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=iso-8859-1");
        xhr_object.setRequestHeader("Content-length", Message.length);
        xhr_object.send(Message);
    }
    return(true);
}
function Produit(cat, image, nom, dispo) {
    this.Cat = cat;
    this.Image = image;
    this.Nom = nom;
    this.Dispo = dispo;
}

function Marche_surv(x) {
    Marche.surv(x);
}
// codes pour table en BB code
var BBc = {
    dtr: "[tr]",
    ftr: "[/tr]\n",
    dtd: "[td]",
    ftd: "[/td]",
    db: "[b]",
    fb: "[/b]",
    dftd: "[td][/td]",
    dtdN: function (n) {
        if (n > 1)
            return ('[td colspan="' + n + ']');
        return ('[td]');
    },
    toHTML: function (xt) {
        if (xt != "") {
            xt = str_replace(xt, "[url=", "<a href=");
            xt = str_replace(xt, "[/url]", "</a>");
            xt = str_replace(xt, "[color", "<font color");
            xt = str_replace(xt, "[/color", "</font");
            xt = str_replace(xt, "]", ">");
            xt = str_replace(xt, "[", "<");
            xt = str_replace(xt, "\n", "<br>");
        }
        return(xt);
    },
    fromHTML: function (x) {
        var xt = x;
        if (xt != "") {
            xt = str_replace(xt, " class=\"lien_default lienPerso\"", "");
            if (xt.indexOf("href=\"javascript:popupPerso('") != -1) {
                xt = str_replace(xt, "href=\"javascript:popupPerso('", "http://www.lesroyaumes.com/");
                xt = str_replace(xt, "')\"", "");
            }
            xt = str_replace(xt, ' target="_blank"', "");
            xt = str_replace(xt, "<br>", "\n");
            xt = str_replace(xt, "<br />", "\n");
            xt = str_replace(xt, "<p>", "\n");
            xt = str_replace(xt, "</p>", "\n");
            xt = str_replace(xt, "<a href=\"", "[url=");
            xt = str_replace(xt, "<a href=", "[url=");
            xt = str_replace(xt, "<a ", "[url=");
            xt = str_replace(xt, '"]', "]");
            xt = str_replace(xt, "</a>", "[/url]");
            xt = str_replace(xt, "<font size=\"1\">", "");
            xt = str_replace(xt, "</font>", "");
            xt = str_replace(xt, "<font color", "[color");
            xt = str_replace(xt, "</font >", "[/color]");
            xt = str_replace(xt, ">", "]");
            xt = str_replace(xt, "<", "[");
            xt = str_replace(xt, '"]', "]");
            xt = str_replace(xt, "&nbsp;", " ");
        }
        return(xt);
    }
}

var Bar = {
    initStyle: function () {
        var insertStyle = null;
        var menuStyle = document.createElement("style");
        var s = "";
        s += '<style type="text/css">';
        s += '#progressbar';
        s += '{ position:relative; width:200px; padding:0 0 0 0; ';
        s += 'height:14px; border:1px solid #CCC; -moz-border-radius:2px; border-radius:2px; z-index:1;}';
        s += '#indicator';
        s += '{ position:absolute; left:0; top:0; width:0px; background-color: #158bc8;';
        s += 'height:14px; margin:0 0 0 0; z-index:2;}';
        s += '</style>';
        menuStyle.innerHTML = s;
        document.body.insertBefore(menuStyle, insertStyle);
    },
    debut: function (titre, zoneTexte) {
        var el = document.getElementById(zoneTexte);
        if (el == null) {
            alert("Pour cette fonction vous devez aller au tribunal");
            return;
        }
        SaveIG = el.innerHTML;
        Bar.initStyle();
        el.innerHTML = "<h1>" + titre + "</h1>";
        el.innerHTML += '<div id="progressionGuet"></div>';
        el.innerHTML += '<div id="progressbar"><div id="indicator"></div></div>';
        el.innerHTML += '<div id="texteGuet"></div>';
        el.innerHTML += '<div id="messageGuet"></div>';
    },
    setTexte: function (t) {
        document.getElementById("texteGuet").innerHTML = t;
    },
    setMessage: function (t) {
        document.getElementById("messageGuet").innerHTML = t;
    },
    addMessage: function (t) {
        document.getElementById("messageGuet").innerHTML += t;
    },
    progression: function (t, z) {
        var m = document.getElementById("progressionGuet").innerHTML = t;
        var indicator = document.getElementById("indicator");
        if (z == -1) {
            document.getElementById("progressbar").style.display = 'none';
            indicator.style.display = 'none';
        }
        else {
            document.getElementById("progressbar").style.display = 'block';
            indicator.style.display = 'block';
            indicator.style.width = (z * 2) + "px";
        }
    },
    fermeture: function (m) {
        m.document.getElementById("fermeture").innerHTML += "<input type=\"submit\" onClick=\"javascript:Bar.fin();\" value=\"" + "Fermer" + "\">&nbsp;&nbsp;";
    },
    fin: function () {
        var el = document.getElementById("zoneTexte1");
        el.innerHTML = SaveIG;
    }
}

var RRpopup = {
    init: function (titre, avecIcone) {
        var width = 'width=800', height = 'height=600',
                left = 'left=0', top = 'top=0';
        if (window.innerWidth) {
            left = 'left=' + (window.innerWidth - width) / 2;
            top = 'top=' + (window.innerHeight - height) / 2;
        }
        else {
            left = 'left=' + (document.body.clientWidth - width) / 2;
            top = 'top=' + (document.body.clientHeight - height) / 2;
        }
        // ouvre une fenetre sans barre d'etat, ni d'ascenceur
        mdlg = window.open("", 'popup' + titre, top + ',' + left + ',' + width + ',' + height +
                ',menubar=no,toolbar=no,location=no,scrollbars=yes,resizable=yes,status=no');
        var wmdlg = mdlg.document;
        var xzx = "";
        xzx = "";
        xzx += ("<link href='http://www.lesroyaumes.com/styles/structure_EP.css' rel='stylesheet' type='text/css' />");
        xzx += ("<link href='http://fonts.googleapis.com/css?family=Copse' rel='stylesheet' type='text/css'>");
        xzx += ("<div class='zone_texte'>");
        xzx += ("    <div class='element elementTop'></div>");
        xzx += ("    <div class='element elementRepeat'>");
        if (avecIcone)
            xzx += ("        <div class='texte'>");
        else
            xzx += ("        <div class='texte texteLarge'>");
        xzx += ("                <div align='left'>");
        xzx += ("                    <div id='texteGuet'></div>");
        xzx += ("                    <div id='messageGuet'></div>");
        xzx += ("<style type=\"text/css\">");
        xzx += ("#progressbar");
        xzx += ("{ position:relative; width:300px; padding:0 0 0 0; ");
        xzx += ("    height:12px; border:1px solid #CCC; -moz-border-radius:2px; border-radius:2px; z-index:1;}");
        xzx += ("#indicator");
        xzx += ("{ position:absolute; left:0; top:0; width:0px; background-color: #158bc8;");
        xzx += ("    height:14px; margin:0 0 0 0; z-index:2;}");
        xzx += ("</style>");
        xzx += ("                    <div id='progressionGuet'></div>");
        xzx += ("                        <div id=\"progressbar\"><div id=\"indicator\"></div></div>");
        xzx += ("                    <div id='fermeture'></div>");
        xzx += ("                </div>");
        xzx += ("            </div>");
        xzx += ("        </div>");
        if (avecIcone) {
            xzx += ("        <div class='illustration'>");
            xzx += ("            <div class='illustrationImage'>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoins illustrationImageDecosCoinsTopLeft'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoins illustrationImageDecosCoinsTopRight'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoins illustrationImageDecosCoinsBottomLeft'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoins illustrationImageDecosCoinsBottomRight'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoteHorizontal illustrationImageDecosCoteHorizontal1'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoteHorizontal illustrationImageDecosCoteHorizontal2'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoteVertical illustrationImageDecosCoteVertical1'></div>");
            xzx += ("                <div class='illustrationImageDecos illustrationImageDecosCoteVertical illustrationImageDecosCoteVertical2'></div>");
            xzx += ("                <img src='images/deplacement_gpes_armees.jpg' alt='%PanneauImageAlt%'>");
            xzx += ("            </div>");
            xzx += ("        </div>");
        }
        xzx += ("    </div>");
        xzx += ("    <div class='element elementBottom'></div>");
        xzx += ("</div>");
        xzx += ("</body>");
        mdlg.document.body.innerHTML = xzx;
        return mdlg;
    },
    setTexte: function (m, t) {
        m.document.getElementById("texteGuet").innerHTML = t;
    },
    setMessage: function (m, t) {
        m.document.getElementById("messageGuet").innerHTML = t;
    },
    addMessage: function (m, t) {
        m.document.getElementById("messageGuet").innerHTML += t;
    },
    getMessage: function (m) {
        return(m.document.getElementById("messageGuet").innerHTML);
    },
    progression: function (m, t, z) {
        m.document.getElementById("progressionGuet").innerHTML = t;
        var indicator = m.document.getElementById("indicator");
        if (z == -1) {
            m.document.getElementById("progressbar").style.display = 'none';
            indicator.style.display = 'none';
        }
        else {
            m.document.getElementById("progressbar").style.display = 'block';
            indicator.style.display = 'block';
            indicator.style.width = (z * 3) + "px";
        }
    },
    terminer: function (m) {
        mdlg.close();
        mdlg = null;
    },
    addBouton: function (m, titre, fn) {
        m.document.getElementById("fermeture").innerHTML += '&nbsp;<span id="' + titre + '">&nbsp;</span>';
        var xa = m.document.createElement("input");
        xa.setAttribute('type', 'button');
        xa.setAttribute('id', titre);
        xa.setAttribute('value', titre);
        xa.onclick = function () {
            fn();
            return false;
        }
        m.document.getElementById(titre).appendChild(xa);
    },
    fermeture: function (m) {
        m.document.getElementById("fermeture").innerHTML += "<input type=\"submit\" onClick=\"javascript:window.close();\" value=\"" + "Fermer" + "\">&nbsp;&nbsp;";
    }
}
var Dossier = {
    debut: function () {
        if (QuelOnglet() != "Mon personnage") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=0', Dossier.faire);//Mon Personnage
            return;
        }
        Dossier.faire(document.getElementsByTagName("body")[0].innerHTML);
    },
    faire: function (Src) {
        //RRmenu.enVille();
		if ((hPersos == undefined)||(hPersos == "00/00/0000")) 
			hPersos = mDate;
		if (PersoGrade == "") PersoGrade = "--";
		if (PersoGarnison == "") PersoGarnison = "--";
		if (PersoEscouade == "") PersoEscouade = "--";
        LeRapport = "[table cellspacing=\"0\" border=\"0\"]\n";
        LeRapport += Dossier.fTable("Nom : ", "", "", "", db + Perso.lienBBcode(Perso.getPseudo()) + fb);
        LeRapport += Dossier.fTable("Statut : ", db + "Actif" + fb, "", "", "");
        LeRapport += Dossier.fTable("Date MAJ : ", "", "", "", db + mDate + fb);
        LeRapport += Dossier.fTable("Niveau : ", db + Perso.getNiveau(Src) + fb, "", "", "");
        LeRapport += Dossier.fTable("Réputation : ", db + Perso.getPR(Src) + fb, "", "", "");
        LeRapport += Dossier.fTable("", "", "", "", "Encombrement : ");
        var z = str_replace(Perso.getEncombrement(Src), "Encombrement : ", "");
        LeRapport += Dossier.fTable(" ", "", "actuel : ", db + z.substring(0, z.indexOf('/')) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "maximum : ", db + z.substring(z.indexOf('/') + 1) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "charrette : ", db + Perso.getCharrette(Src) + fb, "");
        LeRapport += Dossier.fTable("", "", "", "", "Caractéristiques : ");
        LeRapport += Dossier.fTable(" ", "", "Force : ", db + Perso.getForce(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "Intell. : ", db + Perso.getIntelligence(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "Char. : ", db + Perso.getCharisme(Src) + fb, "");
        LeRapport += Dossier.fTable("", "", "", "", "Équipement : ");
        LeRapport += Dossier.fTable(" ", "", "Bâton : ", db + Perso.getBaton(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "Hache : ", db + Perso.getHache(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "Pioche : ", db + Perso.getPioche(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "Épée : ", db + Perso.getEpee(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "Bouclier : ", db + Perso.getBouclier(Src) + fb, "");
        LeRapport += Dossier.fTable(" ", "", "PC : ", db + Perso.getPC(Src) + fb, "");
        LeRapport += Dossier.fTable("Garnison : ", "", "", "", db + PersoGarnison + fb);
        LeRapport += Dossier.fTable("Grade : ", "", "", "", db + PersoGrade + fb);
        SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + PersoLogin, Dossier.suite);//Champs, métier
    },
    fTable: function (l1, l2, l3, l4, l5) {
        var span = 0, r = "[tr]", ftd = "[/td]";
        if (l1 != "") {
            r += "[td]" + l1 + ftd;
            span = 0;
        } else
            span++;
        if (l2 != "") {
            if (span != 0) {
                r += "[td colspan=\"" + (span + 1) + "\"]" + l2 + ftd;
                span = 0;
            } else
                r += "[td]" + l2 + ftd;
        } else
            span++;
        if (l3 != "") {
            if (span != 0) {
                r += "[td colspan=\"" + (span + 1) + "\"]" + l3 + ftd;
                span = 0;
            } else
                r += "[td]" + l3 + ftd;
        } else
            span++;
        if (l4 != "") {
            if (span != 0) {
                r += "[td colspan=\"" + (span + 1) + "\"]" + l4 + ftd;
                span = 0;
            } else
                r += "[td]" + l4 + ftd;
        } else
            span++;
        if (l5 != "") {
            if (span != 0) {
                r += "[td colspan=\"" + (span + 1) + "\"]" + l5 + ftd;
                span = 0;
            } else
                r += "[td]" + l5 + ftd;
        } else if (span > 0) {
            r += "[td colspan=\"" + (span + 1) + "\"]" + "[/td]";
            span = 0;
        }
        r += "[/tr]\n";
        return(r);
    },
    suite: function (Src) {
        LeRapport += Dossier.fTable("Champs : ", "", db + Perso.quelChamp(Perso.getChamp1(Src)) + fb,
                "", db + Perso.quelChamp(Perso.getChamp2(Src)) + fb);
        LeRapport += Dossier.fTable("Métier : ", "", "", "", db + Perso.quelMetier(Perso.getMetier(Src)) + fb);
        if (QuelOnglet() != "Université") {
	        SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipal.php', 'l=7', Dossier.fin);//connaissances
            return;
        }
		Dossier.fin(document.getElementsByTagName("body")[0].innerHTML);
	},
    fin: function (Src) {
        LeRapport += Dossier.fTable("Étude : ", "", "", "", db + Perso.getEtude(Src) + fb);
        LeRapport += "[/table]";
        ClipboardCopyTo(HtmlToString(LeRapport));
        alert("Dossier disponible dans le presse-papiers.");
    }
}
var Recensement = {
    debut: function () {
        //RRmenu.enVille();//alert(">>Recensement.debut");
        nbP = 0, nbPmort = 0, nbPretraite = 0, nbPretranche = 0;
        if (RRoperation == "") {
            RRoperation = "Recensement";
            LeRapport += "[b][u]" + mVille + "[/u][/b] le " + mDate + "\n\n";
            if (monPopup != undefined)
                monPopup.close();
            monPopup = RRpopup.init("RReasy", 1);
            RRpopup.setMessage(monPopup, "Recensement");
        }
        if (QuelOnglet() != "La mairie") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipal.php', 'l=3&a=0', Recensement.faire);
            return;
        }
        Recensement.faire(document.getElementsByTagName("body")[0].innerHTML);
    },
    faire: function (Src) {
            //si changement de jour sauvegarde ancienne liste pour détection des mouvements
		if (lastRapport != mDate)//if (mDate != hPersos)
			Fichier.enregistrerHier();
//		logit("Recencement.faire.enregistrerHier() (l.1575) lastHier : '" + lastHier + "' lastRapport: '" + lastRapport + "' PersoLogin : '" + PersoLogin + "' PersoPrefs : " + PersoPrefs + "'");
//logit ("Recencement.faire.Src l. 1576: " + Src);
		nPersos.splice(0, nPersos.length);
        Recensement.getMaire(Src);
        RRpopup.addMessage(monPopup, "<br>Le maire est " + Perso.lienHTML(cMaire));
        Recensement.getTribun(Src);
        RRpopup.addMessage(monPopup, "<br>Le tribun est " + Perso.lienHTML(cTribun));
        Recensement.getPresent(Src);
    },
    getMaire: function (Src) {
        var x = getData(Src, "<p>Le maire est ", "</p>");// logit ("getMaire x : " + x);
		cMaire = getData(x, ">", "<");
        return(cMaire);

    },
    getTribun: function (Src) {
        var x = getData(Src, "<p>Le tribun est ", "</p>"); //logit ("getTribun x : " + x);
        cTribun = getData(x, ">", "<");
        return(cTribun);
    },
    getPresent: function (Src) {
//		logit("Recensement.getpresent l 1596 Src : " + Src);
//        var a = getData(Src, "<br>Liste des villageois<br>", "</table>");
        var a = getData(Src, ")</strong><br><br>", "</table>");
// 		logit("Recensement.a l 1599 : " + a);
        a = str_replace(a, "</tr>", "\n");
        var b = a.split("\n");
        var i, r = "";
        nPresents.splice(0, nPresents.length);
        for (i = 0; i < b.length; i++) {
            if (b[i] != "")
                nPresents.push(new Present(getData(b[i], "login=", "\\"), 0, 0, 0, 0));
        }
        nPointeur = 0;
        errorCnt = 0;
        if (RRoperation == "Recensement") {
			logit("getPresent l. 1611 : Recensement");
            Recensement.getFichePerso();
        } else if (RRoperation == "RapportGuet") {
			logit("getPresent l. 1614 : RapportGuet");
            Recensement.getFichePerso();
        } else if (RRoperation == "Furtifs") {
 			logit("getPresent l. 1617 : Furtifs");
           Furtifs.suite(); //l. 1760
        }
    },
    getFichePerso: function () {
        if (nPointeur < nPresents.length) {
            RRpopup.progression(monPopup, "en cours " + Math.floor(nPointeur + 1) + "/" + nPresents.length + " (" + nPresents[nPointeur].Pseudo + ")",
                    (Math.floor(nPointeur + 1) / nPresents.length) * 100);
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + (nPresents[nPointeur].Pseudo), Recensement.getPersoInfo)
        } else {
            Recensement.fin();
        }
    },
    getPersoInfo: function (Src) {
        MessageErreur = ""; //logit("getPersoInfo (l.1631)-Src : "+Src);
        if (Src.indexOf("Connexion perdue<") != 0) {
            if (Src.indexOf("Informations sur") != -1) {
                Recensement.setPersoInfo(nPresents[nPointeur].Pseudo, Src);
                nPointeur++;
                Recensement.getFichePerso();
            }
            else if ((Src.indexOf("Une erreur") == 0) || (Src.indexOf("<br><br>Ce personnage n") == 0)) {
                nPointeur++;
                Recensement.getFichePerso();
            }
            else {
                errorCnt++;
                if (errorCnt <= 3)
                    setTimeout(Recensement.getFichePerso, 1500);
                else {
                    errorPersoCnt++;
                    if (errorPersoCnt <= 3) {
                        nPointeur++;
                        errorCnt = 0;
                        Recensement.getFichePerso();
                    }
                    else {
                        MessageErreur = "<b>Erreur pendant le recensement.</b>";
                    }
                }
            }
        }
        else {
            MessageErreur = "<b>Erreur connexion perdue.</b>";
        }
    },
    setPersoInfo: function (zPseudo, Src) {
        var zVillage = "", zComte = "", zPays = "", zStatus = "", zNiveau = "", zEcu = 0, zChamp1 = 0, zChamp2 = 0, zMetier = 0, zPR = 0, zDate = 0;//logit("setPersoInfo (l.1665)- zPseudo : "+zPseudo+" - Src : "+Src);
        zVillage = Perso.getVillage(Src);
        zComte = Perso.getComte(Src);
        zPays = Perso.getPays(Src);
        zStatus = Perso.getStatus(Src);
//        logit("setPersoInfo l. 1670 : zStatus = '" + zPseudo + "-" + zStatus +"'");
        if (zStatus == "mort")
            nbPmort++;
        if (zStatus == "retraite")
            nbPretraite++;
        if (zStatus == "retranché")
            nbPretranche++;
        zDate = Perso.getStatusDate(Src);
        zEcu = parseInt(Perso.getEcu(Src));
        zNiveau = Perso.getNiveau(Src);
        zPR = Perso.getPR2(Src);
        zChamp1 = Perso.getChamp2(Src);
        zChamp2 = Perso.getChamp1(Src);
        zMetier = Perso.getMetier(Src);
//        logit ("l.745 : zPseudo-zMetier '" +zPseudo+"-"+zMetier+"'");
//Victorien.,Thiers,Duché du Bourbonnais-Auvergne,,mort,1,0,00,I,0,0,0,18/11/1462
//Cersei...,Thiers,Duché du Bourbonnais-Auvergne,0,actif,41,37,83,V,2,1,0,27/11/1462
//logit("setPersoInfo (l.658) recap : "+zPseudo+","+zVillage+","+zComte+","+zPays+","+zStatus+","+zPR+","+zEcu+","+zNiveau+","+zMetier+","+zChamp1+","+zChamp2+","+zDate);
        nPersos.push(new Personnage(zPseudo, zVillage, zComte, zPays, zStatus, zPR, zEcu, zNiveau, zMetier, zChamp1, zChamp2, zDate));
        nbP++;
    },
    fin: function () {
        nPersos.sort(triPseudo);
        Fichier.enregistrer();
        RRpopup.progression(monPopup, " ", -1);
        if (RRoperation == "Recensement") {
            RRoperation = "";
            RRpopup.addMessage(monPopup, "<p>" + nPersos.length + " présents dans le village.</p>");
            RRpopup.fermeture(monPopup);
        } else if (RRoperation == "RapportGuet") {
            RRpopup.addMessage(monPopup, "<p>" + nPersos.length + " présents dans le village.");
            RapportGuet.listeEtrangers();
        }
    }
}
var RapportGroupes = {
    debut: function () {
        if (RRoperation == "") {
            RRoperation = "RapportGroupes";
            LeRapport = "[b][u]" + mVille + "[/u][/b] le " + lDate + "\n\n";
        }
        if (QuelOnglet() != "Groupes et armées") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipal.php', 'l=8&a=2', RapportGroupes.faire);
            return;
        }
        RapportGroupes.faire(document.getElementsByTagName("body")[0].innerHTML);
    },
    faire: function (Src) {
        var x = HtmlToString(Src);
        if (x.indexOf("Armées présentes ici :") != -1)
            RapportGroupes.faireArmee(x);
        var y = GetListeEscouade(Src.substring(Src.indexOf("textePage[4]['Texte']")));
//        logit("RapportGroupes.faire l.717 : y = '" + y + "'");
        if (y != '') {
			if (y.indexOf("Vous êtes dans l'armée") != -1)
				LeRapport += y;
			else {
				LeRapport += "[b]Vous appartenez à un groupe comprenant[/b] : ";
				LeRapport += y + "\n";
				LeRapport += "\n";
			}
		}
        LeRapport += GetListeGroupes(Src.substring(Src.indexOf("textePage[2]['Texte']")));
        RapportGroupes.fin();
    },
    faireArmee: function (Src) {
        var x = Src.substring(Src.indexOf("Armées présentes ici :"));
        x = x.substring(x.indexOf("<div"), x.indexOf("</ul>"));//logit("faire armée l.722 - x = '" + x + "'");
        var y = "", z = 0, r = "", n = 0;
        while ((z = x.indexOf("<li")) != -1) {
            y = getData(x, "<li>", "</li>");//logit("faireArmée l725 - y : " + y + " - n : " + n);
            if (n == 0)
                n++;
            else {
                r += y + '. ';
                if (n == 2) {
                    n = 0;
                    r += "\n";
                }
                else
                    n++;
            }
            x = x.substring(z + 1);
        }
            r = str_replace(r, "<span class=\"styleErreur\">", "");
            r = str_replace(r, "</span>", "");
            r = str_replace(r, "(Après ce clic, le chef de l'armée devra valider cette fusion).", "\n");
        LeRapport += "[b]Armée(s) présente(s) :[/b]\n" + BBc.fromHTML(r) + "\n";
    },
    fin: function () {
        if (RRoperation == "RapportGroupes") {
            ClipboardCopyTo(HtmlToString(LeRapport));
            alert("Rapport des groupes disponible dans le presse papiers.");
            RRoperation = "";
        }
    }
}
var RapportGuet = {
    debut: function () {
        //RRmenu.enVille();
        logit ("RapportGuet.debut L.886");
		Suspects.lire();
        nbE = 0, nbEmort = 0, nbEretraite = 0, nbEretranche = 0;
        nbV = 0, nbVmort = 0, nbVretraite = 0, nbVretranche = 0;
        nbS = 0, nbSmort = 0, nbSretraite = 0, nbSretranche = 0, nbSurv = 0, nbSprison = 0;
        if (RRoperation == "") {
            RRoperation = "RapportGuet";
            LeRapport = "";
            LeRapportS = "";
            monPopup = RRpopup.init("RReasy", 0);//logit("RapportGuet (l.762) cMaire:"+cMaire+"- mVille : "+mVille+"- mDate : "+mDate);
            RRpopup.setMessage(monPopup, "<b><u>Rapport de Douane</u></b>");
        }
        Today = new Date;
        Heure = Today.getHours();
//        logit ("Today/hPersos/mDate/Heure L.895 = '"+ Today + " / " + hPersos + " / " +  mDate + " / " + Heure + "' lastRapport : '" + lastRapport + "'");
        if ((lastRapport != mDate) && (Heure > 4)) { //hPersos
			logit("Recensement l.897 vers Recensement.debut");
            Recensement.debut();
        }  else {
//			logit("Recensement l.900 vers RapportGuet.listeEtrangers");
            RRpopup.setMessage(monPopup, nPersos.length + " présents dans le village.");
            RapportGuet.listeEtrangers();
        }
    },
    unPseudoHtml: function (i) {
        var tdNom = '- ',
		tdVillage = ', ',
		tdComte = ' (',
		tdPays = ') - <i>',
		tdStatus = '</i> ',
		ftd = '';
        if (i == -1)
            return("");
        var z = tdNom + Perso.lienHTML(nPersos[i].Pseudo) + ftd + tdVillage + nPersos[i].Village + ftd
		if (nPersos[i].Comte != mDuche)
		    z += tdComte + nPersos[i].Comte + ftd + tdPays + nPersos[i].Pays + ftd +tdStatus; //logit("unPseudoHtml l.796 : " + z);
        if (nPersos[i].Status != "actif")
            z += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
        else
            z += "&nbsp;";
        z += "<br>";
        return(z);
    },
    affichageEtrangers: function () {
        var i = 0;
        var z1 = "<br><b>" + nbE + "</>  étrangers du " + mDuche + " en visite</b> : (dont " + nbEmort + " morts et " + nbEretraite + " retraités)\n";
        z1 += RapportGuet.unPseudoHtml(-1);
        for (i = 0; i < nPersos.length; i++) {
            if (nPersos[i].Comte != mDuche) {
                z1 += RapportGuet.unPseudoHtml(i);
            }
        }
        var z2 = "<br><b>" + nbV + "</>  étrangers habitants du " + mDuche + " en visite</b> : (dont " + nbVmort + " morts et " + nbVretraite + " retraités)\n";
        z2 += RapportGuet.unPseudoHtml(-1);
        for (i = 0; i < nPersos.length; i++) {
            if ((nPersos[i].Village != mVille) && (nPersos[i].Comte == mDuche)) {
                z2 += RapportGuet.unPseudoHtml(i);
            }
        }
        return(z2 + z1);
    },
    affichageSuspects: function () {
        var i = 0, s = -1;
        var dtd = "", ftd = " ", dftd = ftd + dtd;
        var z = "<br><b>" + nbS + "</> suspects</b> : (dont " + nbSmort + " morts et " + nbSretraite + " retraités)<br>\n";
        z += "\n";
        for (i = 0; i < nPersos.length; i++) {
            s = RapportGuet.siSuspect(nPersos[i].Pseudo);
            if (s != -1) {
                z += dtd + Perso.lienHTML(nPersos[i].Pseudo) + dftd + " - " + nSuspects[s].Motif + dftd;
                if (nPersos[i].Status != "actif")
                    z += "<font color=#ff0000><b>" + nPersos[i].Status + "</b></font>";
                z += ftd + "<br>\n";
            }
        }
        return(z);
    },
    unPersoBBc: function (x) {
        var z = "";
        if (x == -1) {
        } else {
            z += (Perso.lienBBcode(x.Pseudo) + ", " + x.Village);
            if (x.Comte != mDuche) {
				z =+ " (" + x.Comte + ") ";
				z =+ " - [i]" + x.Pays + "[/i] - ";
			}
            if (x.Status != "actif")
                z += " [color=#ff0000][b]" + x.Status + "[/b][/color]";
            z += "\n";
        }
        return(z);
    },
    listeEtrangers: function () {
        RRpopup.progression(monPopup, " ", -1);
        RRpopup.addMessage(monPopup, "<br>Elaboration de la liste des étrangers... ");
        var i = 0, z = "";
        z = RapportGuet.unPseudoHtml(-1);
        for (i = 0; i < nPersos.length; i++) {
            if ((nPersos[i].Village != mVille) && (nPersos[i].Comte == mDuche)) {
                z += RapportGuet.unPseudoHtml(i);
//logit ("nPersos[i].Status : " + nPersos[i].Status);
                if (nPersos[i].Status == "mort")
                    nbVmort++;
                if (nPersos[i].Status == "retraite")
                    nbVretraite++;
                if (nPersos[i].Status == "retranché")
                    nbVretranche++;
                nbV++;
            }
        }
        if (nbV !=0)
        	LeRapport += "<b>" + nbV + " voisins du " + mDuche + " en visite</b> : (dont " + nbVmort + " morts et " + nbVretraite + " retraités)<br>" + z + "\n<br>";

        z = RapportGuet.unPseudoHtml(-1);
        for (i = 0; i < nPersos.length; i++) {
            if (nPersos[i].Comte != mDuche) {
                z += RapportGuet.unPseudoHtml(i);
                if (nPersos[i].Status == "mort")
                    nbEmort++;
                if (nPersos[i].Status == "retraite")
                    nbEretraite++;
                if (nPersos[i].Status == "retranché")
                    nbEretranche++;
                nbE++;
            }
        }
        if (nbE !=0)
			LeRapport += "<b>" + nbE + " étrangers au " + mDuche + " en visite</b> : (dont " + nbEmort + " morts et " + nbEretraite + " retraités)<br>" + z + "\n<br>";
        RRpopup.addMessage(monPopup, "terminée.<br>");
        RapportGuet.listeSuspects();
    },
    listeArrivee: function () {
        var i = 0, j = 0,  x = 0;
		var r = "<br><b>Liste des arrivées</b><br>",rV = "",rE = "";
        if (nHier.length > 0) {
            for (i = 0; i < nPersos.length; i++) {
                x = 0;
                if (j >= nHier.length)
                    x = 1;
                else if (nPersos[i].Pseudo < nHier[j].Pseudo)
                    x = 1;
                else if (nPersos[i].Pseudo == nHier[j].Pseudo)
                    j++;
                else {
                    while ((j < nHier.length) && (nPersos[i].Pseudo > nHier[j].Pseudo))
                        j++;
                    i--;
                }
                if (x) {
                    if (nPersos[i].PR > 15) {
					}
//logit("Arrivées - nPersos[i].Status l.984: " + nPersos[i].Status );
					if (nPersos[i].Comte == mDuche) { /* Voisins */
		//			logit("rV l.914: " + rV + " - nPersos[i].Pseudo : " + nPersos[i].Pseudo + " - " + "nPersos[i].Comte : " + nPersos[i].Comte + " - ");
						if (rV == "" ) rV = "<b><i>" + mDuche + "</i></b><br>";
		//			logit("rV l.916: " + rV );
						rV += "- " + Perso.lienHTML(nPersos[i].Pseudo) + ", " + nPersos[i].Village;// + " (" + nPersos[i].Comte + ") ";
		//		        "<font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						if (nPersos[i].Status != "actif")
							rV += " <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						rV += "<br>";
					}
					if (nPersos[i].Comte != mDuche) { /* Etrangers */
		//			logit("rE l.924: " + rE);
						if (rE == "" ) rE = "<b><i>Hors " + mDuche + "</i></b><br>";
						rE += "- " + Perso.lienHTML(nPersos[i].Pseudo) + ", " + nPersos[i].Village + " <i>(" + nPersos[i].Comte + ")</i> ";
						if (nPersos[i].Status != "actif")
							rE += " <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						rE += "<br>";
					}
                }
            }
        }
/*		logit("rV l.934: " + rV);
		logit("rE l.935: " + rE);*/
		if ((rV != "") && (rV != "<br>")) r+= rV + "<br>";
		if ((rE != "") && (rE != "<br>")) r+= rE + "<br>";
//        r += rV + "<br>" + rE + "<br>";// + "<br>";
        return(r);
    },
    listeDepart: function () {
        var i = 0, j = 0, x = 0; //logit("1015 listeDepart");
		var r = "<br><b>Liste des départs</b><br>", rV = "", rE = "";
        if (nHier.length > 0) {
            for (i = 0; i < nHier.length; i++) {
                x = 0;
                if (j >= nPersos.length)
                    x = 1;
                else if (nHier[i].Pseudo < nPersos[j].Pseudo)
                    x = 1;
                else if (nHier[i].Pseudo == nPersos[j].Pseudo)
                    j++;
                else {
                    while ((j < nPersos.length) && (nHier[i].Pseudo > nPersos[j].Pseudo))
                        j++;
                    i--;
                }
                if (x) {
					if (nHier[i].Comte == mDuche) { /* Voisins */
//					logit("rV l.951: " + rV);
						if (rV == "" ) rV = "<b><i>" + mDuche + "</i></b><br>";
						rV += "- " + Perso.lienHTML(nHier[i].Pseudo) + ", " + nHier[i].Village;// + " (" + nHier[i].Comte + ") ";
//logit("listeDeparts l.1036 Status : '" + nHier[i].Pseudo + "-" + nHier[i].Status + "'");
						if ((nHier[i].Status == "mort") && (nHier[i].Status != 0)) {
							rV += " - <font color=#ff0000><b>retranchement</b></font >";
						} else {
							if ((nHier[i].Status != "actif") && (nHier[i].Status != 0))
								rV += " - <font color=#ff0000><b>" + nHier[i].Status + "</b></font >";
						}
						rV += "<br>";
					}
					if (nHier[i].Comte != mDuche) { /* Etrangers */
//					logit("rE l.964: " + rE);
						if (rE =="" ) rE = "<b><i>Hors " + mDuche + "</i></b><br>";
						rE += "- " + Perso.lienHTML(nHier[i].Pseudo) + ", " + nHier[i].Village + " <i>(" + nHier[i].Comte + ")</i> ";
//logit("listeDeparts l.1049 Status : '" + nHier[i].Pseudo + "-" + nHier[i].Status + "'");
						if ((nHier[i].Status == "mort") && (nHier[i].Status != 0)) {
							rE += " - <font color=#ff0000><b>retranchement</b></font >";
						} else {
							if ((nHier[i].Status != "actif") && (nHier[i].Status != 0))
								rE += " - <font color=#ff0000><b>" + nHier[i].Status + "</b></font >";
						}
						rE += "<br>";
					}
                }
            }
        }
/*		logit("rV l.987: " + rV);
		logit("rE l.988: " + rE);*/
		if ((rV != "") && (rV != "<br>")) r+= rV + "<br>";
		if ((rE != "") && (rE != "<br>")) r+= rE + "<br>";
//        r += rV + "<br>" + rE + "<br>";// + "<br>";
        return(r);
    },
    listeSuspects: function () {
        var 	tdStatSusp = '',
				tdNom = '',
                tdMotif = '',
                tdStatus = ' ',
                ftd = ' - ';
                //tStat = Array( 'Surv.'    ,'Assign.'   ,'PNG'      ,'Brig.'     ,'Membre'   ,'TOP'      ,'MoV');
                //tStath = Array('660000'   ,'0000ff'    ,'008888'   ,'660000'    ,'ff0000'   ,'ff3333'   ,'ff3333');
        RRpopup.addMessage(monPopup, "<br>Élaboration de la liste des suspects... ");
        var i = 0, z = "", s = -1, zSusp = "", zSurv = "";
        for (i = 0; i < nPersos.length; i++) {
            s = RapportGuet.siSuspect(nPersos[i].Pseudo);
            if (s != -1) {
//                z += tdNom + Perso.lienHTML(nPersos[i].Pseudo) + ftd + tdMotif + nSuspects[s].Motif + tdStatus;
                if (nSuspects[s].Stat == 0) {
                    nbSurv++;
					zSurv += tdNom + Perso.lienHTML(nPersos[i].Pseudo) + ftd + tdMotif + nSuspects[s].Motif + tdStatus;
					if (nPersos[i].Status == "en prison"){
						zSurv += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSprison++;
					}
					if (nPersos[i].Status == "mort"){
						zSurv += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSmort++;
					}
					if (nPersos[i].Status == "retraite"){
						zSurv += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSretraite++;
					}
					if (nPersos[i].Status == "retranché"){
						zSurv += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSretranche++;
					}
					zSurv += " <i>(" + tStat[nSuspects[s].Stat] + ")</i><br>";
                } else {
                    nbS++;
					zSusp += tdNom + Perso.lienHTML(nPersos[i].Pseudo) + ftd + tdMotif + nSuspects[s].Motif + tdStatus;
					if (nPersos[i].Status == "en prison"){
						zSusp += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSprison++;
					}
					if (nPersos[i].Status == "mort"){
						zSusp += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSmort++;
					}
					if (nPersos[i].Status == "retraite"){
						zSusp += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSretraite++;
					}
					if (nPersos[i].Status == "retranché"){
						zSusp += " - <font color=#ff0000><b>" + nPersos[i].Status + "</b></font >";
						nbSretranche++;
					}
					zSusp +=  " <i>(" + tStat[nSuspects[s].Stat] + ")</i><br>";//"<br>";
                }
            }
        }
/* [u][b]Suspects présents : [/b][/u]<br>\n
[u][b]Présents en surveillance : [/b][/u]<br>\n
[u][b]Furtif: [/b][/u]<br>\n
*/
		LeRapportS = "<b>" + nbSurv + pluriel(nbSurv, " présent") + " sous surveillance et " + nbS + pluriel(nbS, " suspect") + pluriel(nbS, " présent") + " :</b> (dont " + nbSmort + pluriel(nbSmort, " mort") + ", " + nbSretraite + pluriel(nbSretraite, " retraité") + " et "  + nbSprison + pluriel(nbSprison, " prisonnier") +  ")<br>";
		if (nbS != 0 )
			LeRapportS += "<u><b><i>Suspects présents : </i></b></u><br>" + zSusp + "<br>";
		if (nbSurv != 0 )
			LeRapportS += "<u><b><i>Présents en surveillance : </i></b></u><br>" + zSurv + "<br>";
        RRpopup.addMessage(monPopup, "terminée.<br>");
        RapportGuet.fin();
    },
    fin: function () {
        /*
         Étrangers hors duché        (étrangers-(morts*0,6)-(retraite*0,3))
         + Étrangers du duché        ((étrangersV-(morts*0,6)-(retraite*0,3))*0,4)
         + Présents                  ((présents)*0,1)-(morts*0,3)-(retraite*0,1)
         + suspects                  (suspects*1,2)
		 
		 Ou bien selon les valeurs saisies en Préférences
		 Selon le flag PrefsAlerts : 0=formules / 1=valeurs
         */
        var v1, v2, r0, r1, r2, r3, rx, nF;
		rx = 0;

		//Recherche des furtifs
		var z = "", zz = "";//logit ("l 1052 RapportGuet.fin rx = " + rx);
        if (nFurtifs.length)
            nFurtifs.splice(0, nFurtifs.length);//logit ("RapportGuet.fin Furtifs.nPersos.length : " + nPersos.length);
        if (nPersos.length < 1)
            Fichier.charger();
        var v = -1, i, nbF = 0;
		var a = getData(document.getElementsByTagName("body")[0].innerHTML, "<br>Liste des villageois<br>", "</table>");
		a = str_replace(a, "</tr>", "\n");// logit("liste villageois l.1098 : '" + a + "'");
		var b = a.split("\n");
		var i, r = "";
		nPresents.splice(0, nPresents.length);
		for (i = 0; i < b.length; i++) {
			if (b[i] != "")
				nPresents.push(new Present(getData(b[i], "login=", "\\"), 0, 0, 0, 0));
		}
		nPointeur = 0;
		errorCnt = 0;
        for (i = 0; i < nPresents.length; i++) {
            v = Furtifs.findArray(nPersos, nPresents[i].Pseudo); // l. 1758
            if (v == 0) {
                nFurtifs.push(new Present(nPresents[i].Pseudo, 0, 0, 0, 0));
            }
        }
        var t = "";
        for (i = 0; i < nFurtifs.length; i++){
        	t += Perso.lienHTML(nFurtifs[i].Pseudo);
			if (i < (nFurtifs.length)-1)
				t +=  ", ";
		}
		nbF = nFurtifs.length;

		if (PrefsAlerts =="0") {
			nF = 0, rx = 0;
			logit("RapportGuet.fin l.1236 : Prefs d'alerte par calcul ");
/*		nbP = nPersos.length - (nbE + nbV);
		logit("nbEmort : " + nbEmort);
		logit("nbEretraite : " + nbEretraite);
		logit("nbE : " + nbE);
		logit("nbVmort : " + nbVmort);
		logit("nbVretraite : " + nbVretraite);
		logit("nbV : " + nbV);
		logit("nbPmort : " + nbPmort);
		logit("nbPretraite : " + nbPretraite);
		logit("nbP : " + nbP);
		logit("nbS : " + nbS);*/
			v1 = nbEmort * 0.6; 
			v2 = nbEretraite * 0.3;
			r0 = nbE - (v1 + v2);
			v1 = nbVmort * 0.6; 
			v2 = nbVretraite * 0.3; 
			r1 = (nbV - (v1 + v2)) * 0.4; 
			v1 = nbPmort * 0.3; 
			v2 = nbPretraite * 0.1; 
			r2 = (nbP * 0.1) - (v1 + v2); 
			r3 = nbS * 1.2; 
			r0 = r0 + r1 + r2 + r3; 
			if (r0 > 40)
				rx = 4;
			else if (r0 > 30)
				rx = 3;
			else if (r0 > 25)
				rx = 2;
			else if (r0 > 20)
				rx = 1;
		} else {
			//logit("RapportGuet.fin l.1703 : Prefs d'alerte par valeurs ");
			x = PersoAlerts.split("|"), rx = 0;
			//logit("RapportGuet.fin l.1706 : nbS = '" + nbS + "' - nbF = '" + nbF + "' - (nbS > x[0]) = " + (nbS > x[0]) + " - x[0] = '" + x[0] + "'");
			//logit (" x[0] = " + x[0] + " - x[1] = " + x[1] + " - x[2] = " + x[2] + " - x[3] = " + x[3] + " - x[4] = " + x[4] + " - x[5] = " + x[5] + " - x[6] = " + x[6] + " - x[7] = " + x[7] + " - x[8] = " + x[8] + " - x[9] = " + x[9])
			if ((nbS > x[0]) || (nbF > x[1]))
				rx = 4;
			else if (((nbS > x[2]) && (nbS < x[3])) || (nbF > x[4]))
				rx = 3;
			else if (((nbS > x[5]) && (nbS < x[6])) || (nbF > x[7]))
				rx = 2;
			else if ((nbS > x[8]) && (nbS < x[9]))
				rx = 1;
		}

		zz = LeRapport;
        z += "<b><u>" + mVille +" - Rapport de Douane du " + lDate + "</u></b><br><br>";
        z += "<br><b><font color="+ aColor[rx] +">Alerte "+ sColor[rx] +"</font ></b><br>";
		z += "<b>" + nbS + pluriel(nbS, " suspect") + " / " + nbSurv + pluriel(nbSurv, " surveillance") + " / " + nbF + pluriel(nbF, " furtif") + "</b><br>";
		z += "<b>" + nbV + pluriel(nbV, " voisin") + " du " +  mDuche+ " / " + nbE + pluriel(nbE, " étranger") + " hors " + mDuche  + " </b></font><br><br>";
        z += "Niveau de risque " + rx + " (de 0 à 4)<br><br>";
        LeRapport = z + LeRapportS;
		if (nbF !=0)
			LeRapport+= "<b><u>Furtifs :</u></b><br><font color=olive>" + t + "</font><br><br>";
        LeRapport += RapportGuet.listeArrivee();
        LeRapport += RapportGuet.listeDepart();
		LeRapport += "<br><u><b>Étrangers Présents</b></u><br>" + zz + "<br><br>";
        LeRapport += Village.analyseFaire();

/*      nPersos.push(new Personnage(zPseudo, zVillage, zComte, zPays, zStatus, zPR, zEcu, zNiveau, zMetier, zChamp1, zChamp2, zDate));nbP++;//Fofinha d'Enragier	VI	255PR*/
		LeRapport+= "<br><br><b><u>Liste des villageois :</u></b><br>";
        for (i = 0; i < nPersos.length; i++){
        	LeRapport += Perso.lienHTML(nPersos[i].Pseudo) + " " + nPersos[i].Niveau + " " + nPersos[i].PR + "PR<br>";
		}

        RRpopup.setMessage(monPopup, LeRapport);
        if (RRoperation == "RapportGuet") {
            ClipboardCopyTo(BBc.fromHTML(LeRapport));
            RRpopup.addMessage(monPopup, "<br><br> <b>Rapport disponible dans le presse-papier.</b><p>");
            RRoperation = "";
            RRpopup.fermeture(monPopup);
        }
    },
    siSuspect: function (x) {
        var i;
        for (i = 0; i < nSuspects.length; i++) {
            if (nSuspects[i].Pseudo == x)
                return(i);
        }
        return(-1);
    }
}
var RapportSoldat = {
    debut: function () {
        if (RRoperation == "") {
            RRoperation = "RapportSoldat";
            LeRapport = "[b][u]" + mVille + "[/u][/b] le " + lDate + "\n\n";
        }
        if (mVille == "Sur les chemins") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=8', RapportSoldat.chemin);
        } else {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=3', RapportSoldat.mv);
        }
    },
    chemin: function (Src) {
        var x = HtmlToString(getData(Src, "elementsTextuelsNavigation[0]['Nom'] = 'Carte';", "elementsTextuelsNavigation[1]"));
        var l = x.split("\n"), i = 0, noeud = "", z = "", t = "";
        for (i = 0; i < l.length; i++) {
            if (l[i].indexOf("['Nom']") != -1) {
                noeud = getData(l[i], "[0][", "]");
                z = "<" + getData(l[i], "= '", "';") + ">";
                z = str_replace(z, "à l'", "au ")
                t = getData(z, "au ", ">");
                t = str_replace(t, "sud", "Nord");
                t = str_replace(t, "nord", "Sud");
                t = str_replace(t, "ouest", "Est");
                t = str_replace(t, "est", "Ouest");
                t = t + " de " + getData(z, "<", ",");
                break;
            }
        }
        LeRapport += "[b]Localisation : [/b]" + t + "\n\n";
        SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=3', RapportSoldat.mv);
    },
    mv: function (Src) {
        var z = "";
        var begin = Src.indexOf("<td><h2>M&eacute;moire et vision</h2>");
        var end = Src.indexOf("</td>", begin);
        var xt = Src.substring(begin, end);//logit("RapportSoldat.mv l. 1143 - xt = '" + xt + "'");
        if (xt != null)
            z = RapportMV.execMouvements(xt) + "\n\n";
        LeRapport += "[b]Mouvements observés :[/b]\n" + z;
        SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=8&a=2', RapportSoldat.groupes);
    },
    groupes: function (Src) {
        RapportGroupes.faire(Src);
        LeRapport += "\n";
        RapportSoldat.fin();
    },
    fin: function () {
        if (RRoperation == "RapportSoldat") {
            ClipboardCopyTo(HtmlToString(LeRapport));
            RRoperation = "";
            alert("Rapport disponible dans le presse-papiers");
        }
    }
}
function RapportMV_debut() {
    RapportMV.debut();
}

var RapportMV = {
    debut: function () {
        var xt = "";
        if (RRoperation == "") {
            RRoperation = "RapportMV";
            LeRapport += "[b][u]" + mVille + "[/u][/b] le " + mDate + "\n\n";
        }
        LeRapport += "[b]Événements :[/b]\n";
        xt = document.getElementsByClassName("texte texteEvenement texteEvenement1")[0];
        if (xt != null) {
            LeRapport += BBc.fromHTML(RapportMV.execEvenements(xt));
        } else
            LeRapport = "néant";
        LeRapport += "\n";
        LeRapport += "[b]Mouvements observés :[/b]\n";
        xt = document.getElementsByClassName("texte texteEvenement texteEvenement2")[0].innerHTML;
        xt1 = document.getElementsByClassName("texte texteEvenement texteEvenement2")[1].innerHTML;
        if (xt != null) {
            LeRapport += RapportMV.execMouvements(xt);
        }
        if (xt1 != null) {
            LeRapport += RapportMV.execMouvements(xt1);
        }
        RapportMV.fin();
    },
    execEvenements: function (Src) {
        var i, z, d, t = "", x = "", dx = "";
        dx = mDate;
        for (i = 0; i < 20; i++) {
            z = Src.getElementsByClassName("evenementLigne")[i];
            if (z == -1)
                break;
            d = z.getElementsByClassName("date_evenement")[0].innerHTML;
            d = d.substring(0, d.indexOf(" "));
            if (d == dx) {
                x = getData(z.innerHTML, "</span>", "<br>");
                if (x != "")
                    t += d + x + "\n";
            }
        }
        return((t != "" ? t : "R.A.S.\n"));
    },
    execMouvements: function (x) {
        var xt = x;
        if (xt.indexOf("</h2>") == -1)
            return("Erreur de traitement");
        xt = xt.substring(xt.indexOf("</h2>") + 5);
        if (xt.indexOf("Rien de sp&eacute;cial") != -1)
            return("Rien de spécial");
        if (xt.indexOf("Rien de spécial") != -1)
            return("Rien de spécial");
        xt = str_replace(xt, "</tr>", "\n");
        xt = str_replace(xt, "<br>", "\n");
        xt = str_replace(xt, "<a class=\"lien_default lienPerso\" href=\"javascript:popupPerso('FichePersonnage.php?login", "[url=http://www.lesroyaumes.com/FichePersonnage.php?login");
        xt = str_replace(xt, "')\">", "]");
        xt = str_replace(xt, "</a>", "[/url]");
        if (xt.indexOf("Il y a trois jours") != -1)
            xt = xt.substring(0, xt.indexOf("Il y a trois jours"));
        if (xt.indexOf("Il y a quelque temps") != -1)
            xt = xt.substring(0, xt.indexOf("Il y a quelque temps"));
        if (xt.indexOf("Hier, en chemin") != -1)
            xt = xt.substring(0, xt.indexOf("Hier, en chemin"));
        if (xt.indexOf("Avant-hier, en chemin") != -1)
            xt = xt.substring(0, xt.indexOf("Avant-hier, en chemin"));
/* Modif 20150717 pour Mémoires */
        if (xt.indexOf("&eacute;") != -1)
            xt = str_replace(xt, "&eacute;", "é");//logit("l.1235  RapportMV.execMouvements - xt : '" + xt + "'");
/* fin modif */
        if (xt.length == 0)
            xt = "Néant";
        else
        var pp1 = 0, pp2 = 0; resu = ""; nx = 0;
        pp1 = xt.indexOf("login=", pp2);
        pp2 = xt.indexOf("]", pp1);
        while ((pp1 != -1) && (pp2 != -1)) {
            if (nx > 0) {
                resu += ",";
            }
            resu += xt.substring(pp1 + 6, pp2);
            pp1 = xt.indexOf("login=", pp2);
            if (pp1 != -1)
                pp2 = xt.indexOf("]", pp1);
            nx++;
        }
		var pMV = resu.split(","), sMV = new Array(), sMVname = new Array();
        for (i = 0; i < pMV.length; i++) {
            s = Perso.siSuspect(pMV[i]);
		if (s != -1) {
		    sMV.push("[color=#" + Perso.couleurSuspect(s) + "]" + pMV[i] + "[/color]");
		    sMVname.push(pMV[i]);
		}
	}
	for (z = 0 ; z < sMV.length ; z++) {
	        xt = str_replace(xt, "]" + sMVname[z] + "[", "]" + sMV[z] + "[");
	}
/* fin modif*/
 	    xt = cvCar(xt);
        return(xt);
    },
    compact: function (xt) {
        var x = 1, e = xt.split('\n'), i = 0, j = 0, z = "";
        for (i = 0; i < e.length; i++) {
            if (e[i].substring(0, 1) == " ")
                e[i] = "-" + e[i];
            if (e[i] == "- ")
                e[i] = "";
        }
        for (i = 0; i < e.length; i++) {
            if (e[i] != "")
                for (j = i + 1; j < e.length; j++) {
                    if (e[i] == e[j]) {
                        e[j] = "";
                    }
                }
        }
        z = "";
        for (i = 0; i < e.length; i++) {
            if (e[i] != "") {
                z += "- " +  e[i] + ".\n";  logit ("l 1302 : z = '" + z + "'");
	    }
        }
        z = str_replace(z, "- - ", "- ");
        return(z);
    },
    fin: function () {
        if (RRoperation == "RapportMV") {
            ClipboardCopyTo(HtmlToString(LeRapport));
            alert("Rapport disponible dans le presse-papiers");
            RRoperation = "";
        }
        if (RRoperation == "RapportSoldat") {
            RapportSoldat.groupes();
        }
    }
}
var FnRR = {
	setPersoJour: function (x) {
        PersoJour = x;//logit("FnRR setPersoJour-PersoJour (l.1278) : "+ x);
    },
    setRecensement: function () {
        hPersos = mDate;//logit("fnRR setRecencement- hPersos (l.1283) : "+ hPersos);
   },
    setProfileAnnuler: function () {
        FnRR.setProfileFin();
    },
    setProfileOK: function () {
//    	logit("fnRR setProfileOK (l.1287)");
    	zzAlertPerso = "";
        if (document.formulaire.garnison.value == "") {
            if (confirm("L'information Garnison est vide.\nConfirmez-vous la suppression des informations?") == true) {
                PersoGarnison = "";
                PersoGrade = "";
                PersoEscouade = "";
                PersoMission = "0";
                Perso_minS_bk = 0; Perso_minF_bk = 0;
				Perso_minS_rd = 0; Perso_maxS_rd = 0; Perso_minF_rd = 0;
				Perso_minS_or = 0; Perso_maxS_or = 0; Perso_minF_or = 0;
				Perso_minS_grR = 0; Perso_maxS_grR = 0; Perso_maxS_gr = 0;
				PrefsAlerts = 1;
            } else {
                return;
			}
        } else {
            PersoGarnison = document.formulaire.garnison.value;
            PersoGrade = document.formulaire.grade.value;
            PersoEscouade = document.formulaire.escouade.value;
            PersoMission = document.formulaire.mission.value;
            zzAlertPerso = document.formulaire.minS_bk.value + "|" + document.formulaire.minF_bk.value + "|"; 
		    zzAlertPerso += document.formulaire.minS_rd.value + "|" + document.formulaire.maxS_rd.value + "|";
		    zzAlertPerso += document.formulaire.minF_rd.value + "|" + document.formulaire.minS_or.value + "|";
			zzAlertPerso += document.formulaire.maxS_or.value + "|" + document.formulaire.minF_or.value + "|";
			zzAlertPerso += document.formulaire.minS_grR.value + "|" + document.formulaire.maxS_grR.value + "|";
			zzAlertPerso += document.formulaire.maxS_gr.value;
			PersoAlerts = zzAlertPerso;
        }
		var element = document.formulaire.bCompute;
			for (var i=0; i < element.length; i++) {
				if (element[i].checked) {
				  PrefsAlerts = element[i].value;
				  break;
			}
		}
        //logit("fnRR setProfileOK- PrefsAlerts (l.1318) : "+ PrefsAlerts);
		RRmenu.setUserPrefs();
        FnRR.setProfileFin();
    },
    setProfileFin: function () {
        var el = document.getElementById("zoneTexte0");
        el.innerHTML = SaveIG;
    },

    testScript: function(SrC) {
        var el = getData(SrC, "var InfosPaysRR", "</script>");
        var InfosPaysRR = "<script>var InfosPaysRR" + el + "</script>";
		return;
        FnRR.setProfile2();
	},

    setProfile: function () {
        FnRR.load();
        if (QuelOnglet() != "La mairie") {
            m= SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=8&a=3', FnRR.testScript);
        }
        FnRR.setProfile2();
	},
	setProfile2: function () {
        var x = PersoAlerts.split("|"); //logit("PersoAlerts[0] (l.1440) : '"+ PersoAlerts[0] +"'");
        var el = document.getElementById("zoneTexte0");
        SaveIG = el.innerHTML;
        var m = '<h1>Profile RReasy</h1>' + '<form name="formulaire">';
		m+= '<b>Vous êtes soldat ou maréchal ?</b><br>';
		m+= '<table width="252" border="0"><tr>';
		m+= '<td>Ville :</td>';
		m+= '<td><input value="' + PersoGarnison + '" id="garnison" name="garnison" /></td>';
		m+= '</tr><tr>';
		m+= '<td>Grade :</td>';
		m+= '<td><select id="grade" name="grade">';
		for (var i = 0; i < libGrade.length; i += 2) {
			m += '<option value="' + libGrade[i] + '"';
			if (libGrade[i] == PersoGrade)
			m += " selected";
			m += '>' + libGrade[i] + '</option>';
		}
		m+= '</select></td>';
		m+= '</tr><tr>';
		m+= '<td>Escouade :</td>';
		m+= '<td><input value="' + PersoEscouade + '" id="escouade" name="escouade" />';
		m+= '<br /></td>';
		m+= '</tr><tr>';
		m+= '<td>Missions :</td>';
		m+= '<td><input style="width: 40px;" value="' + PersoMission + '" id="mission" name="mission" />&nbsp;';
		m+= 'jours</td>';
		m+= '</tr><tr>';
		m+= '<td>Alertes :</td>';
		m+= '<td><input name="bCompute" type="radio" value="0"';logit("PrefsAlerts : " + PrefsAlerts);
		if (PrefsAlerts == '0') m+= ' checked'
		m+= '/>Par calcul* (voir plus bas)<br>';
		m+= '<input name="bCompute" type="radio" value="1"';
		if (PrefsAlerts == '1') m+= ' checked'
		m+='/>Par niveaux choisis</td>';
		m+= '</tr></table>';
		m+= '<hr>';
		m+= '<b>Niveaux d\'alerte : </b><br />';
		m+= '<table width="500" border="0"><tr>';
		m+= '<th width="130" align="right" scope="row"><b>Alerte Noire</b></th>';
		m+= '<td width="70" align="right">+ de</td>';
		m+= '<td width="150" align="center"><input style="width: 40px;" size="4" maxlength="4" value="' + x[0] + '" id="minS_bk" name="minS_bk" />';
		m+= 'suspects/étrangers</td>';
		m+= '<td width="150" align="left">ou + de';
		m+= '<input style="width: 40px;" size="4" maxlength="4" value="' + x[1] + '" id="minF_bk" name="minF_bk" />';
		m+= 'furtifs</td>';
		m+= '</tr><tr>';
		m+= '<th align="right" scope="row"><b><font color="red">Alerte Rouge</font></b></th>';
		m+= '<td align="right">de';
		m+= '<input style="width: 40px;" size="4" maxlength="4" value="' + x[2] + '" id="minS_rd" name="minS_rd" />';
		m+= 'à</td>';
		m+= '<td align="center"><input style="width: 40px;" size="4" maxlength="4" value="' + x[3] + '" id="maxS_rd" name="maxS_rd" />';
		m+= 'suspects/étrangers</td>';
		m+= '<td align="left">et/ou';
		m+= '<input style="width: 40px;" size="4" maxlength="4" value="' + x[4] + '" id="minF_rd" name="minF_rd" />';
		m+= 'furtifs</td>';
		m+= '</tr><tr>';
		m+= '<th align="right" scope="row"><b><font color="orange">Alerte Orange</font></b></th>';
		m+= '<td align="right">de';
		m+= '<input style="width: 40px;" size="4" maxlength="4" value="' + x[5] + '" id="minS_or" name="minS_or" />';
		m+= 'à</td>';
		m+= '<td align="center"><input style="width: 40px;" size="4" maxlength="4" value="' + x[6] + '" id="maxS_or" name="maxF_or" />';
		m+= 'suspects/étrangers</td>';
		m+= '<td align="left">et/ou';
		m+= '<input style="width: 40px;" size="4" maxlength="4" value="' + x[7] + '" id="minF_or" name="minF_or" />';
		m+= 'furtifs</td>';
		m+= '</tr><tr>';
		m+= '<th align="right" scope="row"><b><font color="green">Alerte Verte Renforcée</font></b></th>';
		m+= '<td align="right">de';
		m+= '<input style="width: 40px;" size="4" maxlength="4" value="' + x[8] + '" id="minS_grR" name="minS_grR" />';
		m+= 'à </td>';
		m+= '<td align="center"><input style="width: 40px;" size="4" maxlength="4" value="' + x[9] + '" id="maxS_grR" name="maxS_grR" />';
		m+= 'suspects/étrangers</td>';
		m+= '<td align="left">&nbsp;</td></tr><tr>';
		m+= '<th align="right" scope="row"><b><font color="green">Alerte Verte</font></b></th>';
		m+= '<td align="right">de 0 à</td>';
		m+= '<td align="center"><input style="width: 40px;" size="4" maxlength="4" value="' + x[10] + '" id="maxS_gr" name="maxS_gr" />';
		m+= 'suspects/étrangers</td><td align="left">&nbsp;</td>';
		m+= '</tr></table>';
		m+= '<hr>';
		m+= '<b>*Calculs :</b> <br>';
		m+="<font size=1>";
		m+="   Étrangers hors duché      (étrangers-(morts*0,6)-(retraite*0,3))<br>";
		m+=" + Étrangers du duché        ((étrangersV-(morts*0,6)-(retraite*0,3))*0,4)<br>";
		m+=" + Présents                  ((présents)*0,1)-(morts*0,3)-(retraite*0,1)<br>";
		m+=" + suspects                  (suspects*1,2)<br>";
		m+=" = Niveau d'alerte : > 40 = noire<br>";
		m+="				     > 30 = rouge<br>";
		m+="				     > 25 = orange<br>";
		m+="				     > 20 = jaune<br>";
		m+="				     sinon  verte</font>";		
/*		m+= '<strong>Etat de guerre</strong><br />';
		m+= '<table width="602" border="0"><tr>';
		m+= '<td align="center"><em><strong>Royaume</strong></em></td>';
		m+= '<td align="center"><em><strong>Ennemi</strong></em></td><td align="left"><strong><em>Couleur</em></strong></td>';
		m+= '</tr><tr>';
		m+= '<td align="center"><a id="zoneChoixPays">';
		m+= '<select name="paysChoisi" id="paysChoisi">';
		var sSelect = "";
		var sPays = 0;
		for (var i = 0; i < InfosPaysRR.length; i ++) {
			if (typeof InfosPaysRR[i] == "undefined")
				while (typeof InfosPaysRR[i] == "undefined") {
					i++;
				}
			sSelect += '<option value="'+i+'"';
			if (i == 0)
				sSelect += ' selected';
			sSelect += '>'+InfosPaysRR[i]['Nom']+'</option>';
		}
		m+= sSelect;
		m+= '</select></a></td><td></td><td></td><tr/>';
		m+= '<tr><td align="center"><a id="zoneChoixComte">';
		m+= '<select name="comteChoisi" id="comteChoisi">';
		var sSelect = "";
		for (var i in InfosPaysRR[sPays]['Comtes']) {
			if (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined")
				while (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined") {
					i++;
				}
			sSelect += '<option value="'+i+'"';
			if (i == 0)
				sSelect += ' selected';
			sSelect += '>'+InfosPaysRR[sPays]['Comtes'][i]['Nom']+'</option>';
		}
		m+= sSelect;
		m+= '</select></a></td>';
		m+= '<td align="center"><input name="InFight" type="checkbox" value="" />&nbsp;</td>';
		m+= '<td align="left">';
		m += '<select name="zoneChoixCouleur">';
		m += '<option value="#444444" style="color:black">Défaut</option>';
		m += '<option value="darkred" style="color:darkred";>Rouge foncé</option>';
		m += '<option value="red" style="color:red">Rouge</option>';
		m += '<option value="orange" style="color:orange">Orange</option>';
		m += '<option value="brown" style="color:brown">Marron</option>';
		m += '<option value="yellow" style="color:yellow">Jaune</option>';
		m += '<option value="green" style="color:green">Vert</option>';
		m += '<option value="olive" style="color:olive">Olive</option>';
		m += '<option value="cyan" style="color:cyan">Cyan</option>';
		m += '<option value="blue" style="color:blue">Bleu</option>';
		m += '<option value="darkblue" style="color:darkblue">Bleu foncé</option>';
		m += '<option value="indigo" style="color:indigo">Indigo</option>';
		m += '<option value="violet" style="color:violet">Violet</option>';
		m += '<option value="white" style="color:white">Blanc</option>';
		m += '<option value="black" style="color:black">Noir</option>';
		m += '</select>';
		m+= '</td></tr>';
		m+= '</table>';
		m+= '</form>' + '<br>';*/
// id="paysChoisi" onchange="changeInfosPays();"
        /*window.document.getElementById("paysChoisi").onchange = function () {
            Village.changeInfosPays();
            return false;
        };*/

        el.innerHTML = m;
        RRmenu.addSubfunction(el, FnRR.setProfileOK, "Valider");
        RRmenu.addSubfunction(el, FnRR.setProfileAnnuler, "Annuler");
    },	
	getStorage: function(){
        var el = document.getElementById("zoneTexte0");
        SaveIG = el.innerHTML;
		Fichier.chargerHier();
		Fichier.charger();
		Suspects.lire();
		
		var zSuspects = "", zToday = lastRapport + "ø",  zHier=hHier + "ø";
		for (i=0;i< nSuspects.length;i++){
			zSuspects += nSuspects[i].Pseudo + "|";
			zSuspects += nSuspects[i].Motif + "|";
			zSuspects += nSuspects[i].Date + "|";
			zSuspects += nSuspects[i].Stat + "ø";
		}
		for (i=0;i< nHier.length;i++){
			zHier +=       nHier[i].Pseudo;
			zHier += "|" + nHier[i].Village;
			zHier += "|" + nHier[i].Comte;
			zHier += "|" + nHier[i].Pays;
			zHier += "|" + nHier[i].Status + "ø";
		}
		for (i=0;i< nPersos.length;i++){
			zToday += nPersos[i].Pseudo;
            zToday += "|" + nPersos[i].Village;
            zToday += "|" + nPersos[i].Comte;
            zToday += "|" + nPersos[i].Pays;
            zToday += "|" + nPersos[i].Status;
            zToday += "|" + nPersos[i].PR;
            zToday += "|" + nPersos[i].Ecu;
            zToday += "|" + nPersos[i].Niveau;
            zToday += "|" + nPersos[i].Metier;
            zToday += "|" + nPersos[i].Champ1;
            zToday += "|" + nPersos[i].Champ2;
            zToday += "|" + nPersos[i].date + "ø";
		}
		RRmenu.getUserPrefs();
		var zPersoPrefs = 	hPersos + '|' + hHier + '|' + lastHier + '|' + lastRapport + '#';
		zPersoPrefs += PersoJour + '|' + PersoGrade + '|' + PersoGarnison + '|' + PersoEscouade + '|' + PersoMission + '#';
		zPersoPrefs += PrefsAlerts + '#' + PersoAlerts + '#' + MarcheSeuil + '#' + MandatVu + '#' + MandatOH + '#' + MandatH;
		
		var m = "<form id=Recap name=Recap><table width=500 border=0><tr><th colspan=2>Controle des stockages</th></tr>";
		m += "<tr><th colspan=2><font color=red>ATTENTION : Toute modification est irréversible !</font></th></tr>";
		m += "<tr><td colspan=2>Joueur : <b>" + PersoPrefs + "</b> - Village : <b>" + mVille + "</b> - Comté/Duché : <b>" + mDuche + "</b></td></tr>";
		m += "<tr><th width=146 align=right valign=top><h5>Prefs joueur<br /></h5>";
		m +="<br /><font size=1>DateRapport | Hier | lastHier | lastRapport #<br />";
		m +="Date du jour | Grade | Garnison | Escouade | Mission #<br />";
		m +="PrefsAlerts # PersoAlerts # MarcheSeuil ø<br />";
		m +="Présence mandat # anc. Heure vu # Heure vu <br /> </font></th>";
		m += "<td width=344><textarea name=Prefs id=Prefs cols=53 rows=5>" + zPersoPrefs + "</textarea></td></tr>";
		m += "<tr><th align=right valign=top><h5>Villageois du jour<br />" + hPersos + " (" + nPersos.length + ")<br /></h5>";
		m+= "<font size=1>Nom | Village | Comte | Pays | Status | Réputation | Ecus | Niveau | Metier | Champ1 | Champ2, Date connexion ø</font>";
		m += "</th><td><textarea name=Villageois id=Villageois cols=53 rows=5>" + zToday + "</textarea></td></tr>";
		m += "<tr><th align=right valign=top><h5>Villageois de la veille<br />" + lastHier + " (" + nHier.length + ")<br /></h5>";
		m += "<font size=1>Nom | Village | Comte | Pays | Status ø</font>";
		m += "</th><td><textarea name=VillageoisHier id=VillageoisHier cols=53 rows=5>" + zHier + "</textarea></td></tr>";
		m += "<tr><th align=right valign=top><h5>Suspects du Comté/Duché<br /> (" + nSuspects.length + ")<br /></h5>";
		m += "<font size=1>Nom | Raison | Date d'ajout | Classement ø<br><i>0-Sous surveillance<br>1-A Assigner à résidence<br>2-Persona non grata<br>3-Brigandage<br>4-Membre (Fatum, Hydre...)<br>5-TOP<br>6-Mort ou vif</i></font>";
		m += "</th><td><textarea name=Suspects id=Suspects cols=53 rows=5>" + zSuspects + "</textarea></td></tr>";
		m += "</table></form>";
        el.innerHTML = m;
        RRmenu.addSubfunction(el, FnRR.setFilesOK, "Valider");
        RRmenu.addSubfunction(el, FnRR.setProfileAnnuler, "Annuler");
//        RRmenu.addSubfunction(el, FnRR.setFilesAnnuler, "Annuler");		
		var mStorN = "<br><hr><br><form id=toDel name=toDel><table width=500 border=0><tr><th colspan=2>Suppression des stockages</th></tr>", mStorV = "";
		mStorN += "<tr><th colspan=2><font color=red>ATTENTION : Toute SUPPRESSION est irréversible !</font></th></tr>";
		for(var i=0; i < localStorage.length; i++){
			var propertyName = localStorage.key(i);
			mStorN += "<tr><td width=146 align=right valign=top><b>" + propertyName + "</b><br>Supprimer&nbsp;<input type=checkbox id=delIt name=delIt value=" + propertyName + "></td>";
            mStorN += "<td width=344><textarea name=Prefs id=Prefs cols=53 rows=2>" + localStorage.getItem(propertyName) + "</textarea></td></tr>";
		}
		mStorN += "</table></form>";
        el.innerHTML += mStorN;
        RRmenu.addSubfunction(el, FnRR.setFilesDelete, "Supprimer la sélection");		
        RRmenu.addSubfunction(el, FnRR.setProfileAnnuler, "Annuler");
	},
    setFilesOK: function() {
		alert("Non implémenté.");
	},
    setFilesAnnuler: function() {
        var el = document.getElementById("zoneTexte0");
        el.innerHTML = SaveIG;
	},	
	setFilesDelete: function () {
		var MyDel = new Array(), element = document.toDel.delIt; logit("setFilesDelete.document.toDel.delIt.length : " + document.toDel.delIt.length);
		for (var i=0; i < element.length; i++) {
			if (element[i].checked) {
			  MyDel.push(element[i].value);logit("setFilesDelete.element[i] : " + element[i] + " - element[i].value : " + element[i].value);
			  localStorage.removeItem(element[i].value);
			}
		}
		FnRR.getStorage();
	},
    changeInfosPays: function () {
        var elComte = window.document.getElementById("zoneChoixComte");
        var sPays = window.document.getElementById("paysChoisi").selectedIndex;
        SaveIG = elComte.innerHTML;
		var sSelect = "", m="";
		m+= '<select name="comteChoisi" id="comteChoisi">';
		for (var i in InfosPaysRR[sPays]['Comtes']) {
			if (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined")
				while (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined") {
					i++;
				}
			sSelect += '<option value="'+i+'"';
			if (i == 0)
				sSelect += ' selected';
			sSelect += '>'+InfosPaysRR[sPays]['Comtes'][i]['Nom']+'</option>';
		}
		m+= sSelect;
		m+= '</select>';
        elComte.innerHTML = m;
	},
    load: function () {
		RRmenu.getUserPrefs();
        var x = PersoAlerts.split("|"); //logit("PersoAlerts[0] (l.1440) : '"+ PersoAlerts[0] +"'");
//		logit("FnRR load-PersoAlerts (l.1878) : "+PersoAlerts);
    },
}
var Furtifs = {
    debut: function () {
        RRoperation = "Furtifs"; logit("Furtifs.debut l.1884");
        if (QuelOnglet() != "La mairie") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipal.php', 'l=3&a=0', Furtifs.faire);
            return;
        }
        Furtifs.faire(document.body.innerHTML); //=>l. 2036
    },
    affichage: function () {
        logit("Furtifs.affichage l.1892");
        var i, m = "", c = "", cf = "";
        for (i = 0; i < nFurtifs.length; i++) {
            if (nFurtifs[i].Pseudo != "") {
                m += "<tr>";
                c = Presence.couleurSuspect(nFurtifs[i].Pseudo);
                if (c != "")
                    cf = "</font>";
                m += Presence.tdNom + c + Perso.lienHTML(nFurtifs[i].Pseudo) + cf + Presence.ftd;
                m += Presence.tdVillage + nFurtifs[i].Village + Presence.ftd;
                m += Presence.tdComte + nFurtifs[i].Comte + Presence.ftd;
                m += Presence.tdEcu + (nFurtifs[i].Ecu != undefined ? nFurtifs[i].Ecu : " ") + Presence.ftd;
                m += Presence.tdStatus + (nFurtifs[i].Status != "0" ? nFurtifs[i].Status : " ") + Presence.ftd;
                m += "</tr>";
            }
        }
        return(m);
    },
    longueVue: function () {
		logit("Furtifs.longueVue - l. 1910");
        var m = "";
        m += "Liste des retranchés (" + nFurtifs.length + ")";
        m += "<table border=\"1\" cellspacing=\"0\">";
        m += "<tr>";
        m += Presence.tdNom + "Nom" + Presence.ftd;
        m += Presence.tdVillage + "Ville" + Presence.ftd;
        m += Presence.tdComte + "Comté/Duché" + Presence.ftd;
        m += Presence.tdEcu + "Écus" + Presence.ftd;
        m += Presence.tdStatus + "État" + Presence.ftd;
        m += "</tr>";
        m += Furtifs.affichage();
        m += "</table>"
        monPopup = RRpopup.init("Liste des retranchés", 0);
        RRpopup.setMessage(monPopup, m + "<p>");
        RRpopup.fermeture(monPopup);
    },
    furtifs: function () {
//		logit("Furtifs.furtifs (Fouine)- l. 1930");
        if (nFurtifs.length)
            nFurtifs.splice(0, nFurtifs.length);
        if (nPersos.length < 1)
            Fichier.charger();
        //pseudo recensement de quête
//logit ("Fouine l.1386 nPresents.length : '"+ nPresents.length +"'");
        if (nPresents.length)
            nPresents.splice(0, nPresents.length);
        var src = getData(document.body.innerHTML, "textePage[0][7][6]['Texte'] = '", "textePage[");
        src = HtmlToString(src);
        src = str_replace(src, "<p>", "\n");
        src = str_replace(src, "</p>", "");
        src = str_replace(src, "\\n", "\n");
        src = str_replace(src, '<a class="lien_default lienPerso" ', "\n");
        var t = src.split("\n");
        src = "";
        var i;
        for (i = 0; i < t.length; i++) {
            if (t[i].substring(0, "href".length) == "href") {
                nPresents.push(new Present(getData(t[i], ">", "<"), 0, 0, 0, 0));
            }
        }
        var v = -1;
        for (i = 0; i < nPresents.length; i++) {
            v = Furtifs.findArray(nPersos, nPresents[i].Pseudo);
            if (v == 0) {
                nFurtifs.push(new Present(nPresents[i].Pseudo, 0, 0, 0, 0));
            }
        }
        monPopup = RRpopup.init("RReasy", 1);
        RRpopup.setMessage(monPopup, "Recensement");
        npFurtif = 0;
        LeRapport = "";
        Furtifs.furtifsPerso();
    },
    furtifsPerso: function () {
            logit("Furtifs.furtifsPerso l.1969");
        if (npFurtif < nFurtifs.length) {
            RRpopup.progression(monPopup, "en cours " + Math.floor(npFurtif + 1) + "/" + nFurtifs.length + " (" + nFurtifs[npFurtif].Pseudo + ")",
                    (Math.floor(npFurtif + 1) / nFurtifs.length) * 100);
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + (nFurtifs[npFurtif].Pseudo), Furtifs.furtifsInfo);
        } else {
            Furtifs.furtifsFin();
        }
    },
    furtifsInfo: function (Src) {
            logit("Furtifs.furtifsInfo l.1979");
        MessageErreur = "";
        if (Src.indexOf("Connexion perdue<") != 0) {
            if (Src.indexOf("Informations sur") != -1) {
                nFurtifs[npFurtif].Status = Perso.getStatus(Src);
                nFurtifs[npFurtif].Village = Perso.getVillage(Src);
                nFurtifs[npFurtif].Comte = Perso.getComte(Src);
                nFurtifs[npFurtif].Pays = Perso.getPays(Src);
                nFurtifs[npFurtif].Ecu = Perso.getEcu(Src);
                npFurtif++;
                Furtifs.furtifsPerso();
            }
            else if (Src.indexOf("<br><br>Ce personnage n") == 0) {
                npFurtif++;
                Furtifs.furtifsPerso();
            }
            else {
                errorCnt++;
                if (errorCnt <= 3)
                    setTimeout(Furtifs.furtifsPerso, 1500);
                else {
                    errorPersoCnt++;
                    if (errorPersoCnt <= 3) {
                        nPointeur++;
                        errorCnt = 0;
                        Furtifs.furtifsPerso();
                    }
                    else {
                        MessageErreur = "<b>Erreur pendant le recensement.</b>";
                    }
                }
            }
        }
        else {
            MessageErreur = "<b>Erreur connexion perdue.</b>";
        }
    },
    furtifsFin: function () {
        logit("Furtifs.furtifsFin l.2017");
        var src = "", r = 0;
        for (var i = 0; i < nFurtifs.length; i++) {
            if (nFurtifs[i].Status == "retranché")
                r++
            else
                src += Perso.lienHTML(nFurtifs[i].Pseudo) + " de " + nFurtifs[i].Village + " (" + nFurtifs[i].Comte + ")<br>";
        }
        if (src.length > 0)
            src = "Détection des furtifs : <p>" + src;
        else
            src = "Détection des furtifs : aucun furtif trouvé.";
        src += "<p>(" + nPresents.length + " présents sur le noeud, " + r + " retranchés)";
        RRpopup.setMessage(monPopup, src);
        RRpopup.fermeture(monPopup);
        RRoperation = "";
        RRpopup.progression(monPopup, "", -1);
        ClipboardCopyTo(BBc.fromHTML(src));
    },
    faire: function (Src) {
        logit("Furtifs.faire l.2037");
        Recensement.getPresent(Src); // => l.708
        if (nFurtifs.length)
            nFurtifs.splice(0, nFurtifs.length);
        if (nPersos.length < 1)
            Fichier.charger();
        Furtifs.faireSuite();
    },
    faireSuite: function () {
        logit("Furtifs.faireSuite l.2046");
        logit("nFurtifs.length l.2047 : " + nFurtifs.length);
        logit("nPersos.length l.2048 : " + nPersos.length);
        if (nFurtifs.length)
            nFurtifs.splice(0, nFurtifs.length);
        if (nPersos.length < 1)
            Fichier.charger();
        var v = -1, i;
        //furtifs qui se révèlent
        for (i = 0; i < nPresents.length; i++) {
            v = Furtifs.findArray(nPersos, nPresents[i].Pseudo);
            if (v == 0) {
                nFurtifs.push(new Present(nPresents[i].Pseudo, 0, 0, 0, 0));
            }
        }
        //furtifs qui se cachent
        for (i = 0; i < nPersos.length; i++) {
            v = Furtifs.findArray(nPresents, nPersos[i].Pseudo);
            if (v == 0) {
                nFurtifs.push(new Present(nPersos[i].Pseudo, 0, 0, 0, 0));
            }
        }
        if (nFurtifs.length !=0) {
			var t = nFurtifs.length + " furtif(s) sur " + nPresents.length + " présents (" + nPersos.length + " recensés)\n";
			for (i = 0; i < nFurtifs.length; i++)
				t += nFurtifs[i].Pseudo + ", ";
		}
        return(t);
    },
    findArray: function (e, x) {
        if (x == "")
            return(1);
        for (var i = 0; i < e.length; i++) {
            if (x == e[i].Pseudo)
                return 1;
        }
        return 0;
    },
    suite: function (Src) {
        logit("Furtifs.suite l.2091");
        var v = -1, i;
        //furtifs qui se révèlent
        for (i = 0; i < nPresents.length; i++) {
            v = Furtifs.findArray(nPersos, nPresents[i].Pseudo);
            if (v == 0) {
                nFurtifs.push(new Present(nPresents[i].Pseudo, 0, 0, 0, 0));
            }
        }
        //furtifs qui se cachent
        for (i = 0; i < nPersos.length; i++) {
            v = Furtifs.findArray(nPresents, nPersos[i].Pseudo);
            if (v == 0) {
                nFurtifs.push(new Present(nPersos[i].Pseudo, 0, 0, 0, 0));
            }
        }
        var t = nFurtifs.length + " furtif(s) sur " + nPresents.length + " présents (" + nPersos.length + " recensés)\n";
        for (i = 0; i < nFurtifs.length; i++)
            t += nFurtifs[i].Pseudo + ", ";
		if (nFurtifs.length !=0) {
			ClipboardCopyTo(t);
			alert(t + "\n\n Furtifs disponibles dans le presse-papiers");
		} else {
			alert(t);			
		}
        Furtifs.fin(t); //Furtifs.fin(Src);
},
    fin: function (Src) {
        //logit("Furtifs.fin l.1551");
        RRoperation = "";
    }
}
var Perso = {
    getAction: function () {
        var zone = document.getElementsByTagName("body")[0].innerHTML;

        var x = getData(zone, 'var chaineActiviteJoueur = "', '";'); logit("getAction l.1571 - x : '" + x + "'")
        x = str_replace(x, "<br>", " ");
        x = str_replace(x, "Activité : ", "");
        x = str_replace(x, " votre ", " ma ");
        x = str_replace(x, "<div class=\"styleErreurInterligneSimple\">", "");
        x = str_replace(x, "[div class=\"styleErreurInterligneSimple\]", "");
        x = str_replace(x, "<div class=\"styleErreurInterligneSimple\">Activit&eacute; :", "");
        x = str_replace(x, "</div>", "");
        x = str_replace(x, "<br>", " ");
        return(BBc.fromHTML(x));
    },
    getBaton: function (Src) {
        if (Src.indexOf("Vous utilisez un baton") != -1)
            return("oui");
        return("non");
    },
    getBouclier: function (Src) {
        if ((Src.indexOf("Vous utilisez un bouclier") != -1) || (Src.indexOf("Vous utilisez un Bouclier") != -1))
            return("oui");
        return("non");
    },
    getHache: function (Src) {
        if (Src.indexOf("Vous utilisez une hache") != -1)
            return("oui");
        return("non");
    },
    getPioche: function (Src) {
        if (Src.indexOf("Vous utilisez une pioche") != -1)
            return("oui");
        return("non");
    },
    getChamp1: function (Src) {
        var str_field = Array('du bl', 'du ma', 'potager', ' vaches', ' cochons', ' moutons', ' ch&egrave;vres', '\'olivier', ' vigne', '\'orge');
        var z = HtmlToString(Src);
        var x = getData(cvCar(z), " possède ", ".");
        if (x == "")
            return(0);
        var f = x.indexOf(" et ");
        if (f != -1)
            x = x.substring(0, f);
        for (var i = 0; i < str_field.length; i++) {
            if (x.indexOf(str_field[i]) != -1) {
                return(i + 1);
            }
        }
        return(0);
    },
    getChamp2: function (Src) {
        var str_field = Array('du bl', 'du ma', 'potager', ' vaches', ' cochons', ' moutons', ' ch&egrave;vres', '\'olivier', ' vigne', '\'orge');
        var z = HtmlToString(Src);
        var x = getData(cvCar(z), " possède ", ".");
        if (x == "")
            return(0);
        var f = x.indexOf(" et ");
        if (f != -1) {
            x = x.substring(f + 4);
            for (var i = 0; i < str_field.length; i++) {
                if (x.indexOf(str_field[i]) != -1) {
                    return(i + 1);
                }
            }
        }
        return(0);
    },
    getCharisme: function (Src) {
        var x = Src.substring(Src.indexOf("Charisme</td>") + "Charisme</td>".length + 1);
        x = x.substring(x.indexOf(">") + 1, x.indexOf("</td>"));
        return(x);
    },
    getCharrette: function (Src) {
        if (Src.indexOf("Charrette") != -1)
            return("oui");
        return("non");
    },
    getEncombrement: function (Src) {
        var x = getData(Src, "<p>Encombrement : <span style=\"\">", "<br");
        x = str_replace(x, "</span>", "");
        x = str_replace(x, " / ", "/");
        x = "Encombrement : [b]" + x + "[/b]";
        return(x);
    },
    getEncombrementGroupe: function (Src) {
        var x = Src;
        if (x.indexOf("Encombrement du groupe ") > 0) {
            x = x.substring(x.indexOf("Encombrement du groupe "));
            x = x.substring(0, x.indexOf("<br"));
            x = str_replace(x, "<span style=\"\">", "");
            x = str_replace(x, "</span>", "");
            x = str_replace(x, " / ", "/");
            x = str_replace(x, ": ", ": [b]") + "[/b]";
        } else
            x = "";
        return(x);
    },
    getEpee: function (Src) {
        if (Src.indexOf("Vous utilisez une épée") != -1)
            return("oui");
        if (Src.indexOf("Vous utilisez une &eacute;p&eacute;e") != -1)
            return("oui");
        return("non");
    },
    getEtat: function (Src) {
        var t = "Forme :</span> ";
        var n = Src.indexOf(t);
        var x = Src.substring(n + t.length);
        x = x.substring(0, x.indexOf("<"));
        return(x);
    },
    getSante: function (Src) {
        var t = "Sant&eacute; : </span> ";
        var n = Src.indexOf(t);
        var x = Src.substring(n + t.length);
        x = x.substring(0, x.indexOf("<"));
        return(x);
    },
    getEtude: function (Src) {
		var x = getData(document.body.innerHTML, "textePage[2][4]['Texte'] = '", "';");//logit("getEtudes l. 1891 : " + x );
        return(x);
    },
    getEcu: function (Src) {
        var x = getData(HtmlToString(Src), "Argent :", "<");
        if (x == "")
            x = getData(HtmlToString(Src), "Argent :</span> ", " é");
		x = str_replace(x, " ", "");
        return(x);
    },
    getForce: function (Src) {
        var x = Src.substring(Src.indexOf("Force</td>") + "Force</td>".length + 1);
        x = x.substring(x.indexOf(">") + 1, x.indexOf("</td>"));
        return(x);
    },
    getGrade: function (x) {
        var cf = "";
        var c = "";
        switch (x) {
            case "Sénéchal":
                c = "f65908";
                break;
            case "Major":
                c = "FA7504";
                break;
            case "Conseiller militaire":
                c = "4686B8";
                break;
            case "Cartographe":
                c = "036234";
                break;
            case "Adjudant":
                c = "78293E";
                break;
            case "Sergent chef":
                c = "2305f9";
                break;
            case "Sergent":
                c = "02C0FC";
                break;
            case "Sergent intérimaire":
                c = "699672";
                break;
            case "Brigadier chef":
                c = "ECC012";
                break;
            case "Brigadier":
                c = "ECC012";
                break;
            case "Soldat de 1ère classe":
                c = "97F905";
                break;
            case "Soldat":
                c = "F0FA04";
                break;
            case "Volontaire":
                c = "A14401";
                break;
        }
        if (c != "")
            cf = "[color=#" + c + "]" + x + "[/color]";
        else
            cf = x;
        return("[b]" + cf + "[/b]");
    },
    getIntelligence: function (Src) {
        var x = Src.substring(Src.indexOf("Intelligence</td>") + "Intelligence</td>".length + 1);
        x = x.substring(x.indexOf(">") + 1, x.indexOf("</td>"));
        return(x);
    },
    getMetier: function (Src) {
        for (var i = 0; i < libMetier.length; i++) {
            if (Src.indexOf(libMetier[i]) != -1)
                return(i + 1);
        }
        return(0);
    },
    getNiveau: function (Src) {
        var x = getData(Src, "Niveau :</span> ", "<");
        if (x == "")
            x = getData(Src, "Niveau ", "<");
        if (x == "Vagabond")
            return(x);
        return(x);
    },
    getPC: function (Src) {
        var x = Src.substring(Src.indexOf("Force</td>") + "Force</td>".length + 1);
        x = x.substring(x.indexOf(">") + 1, x.indexOf("</td>"));
        var xn = parseInt(x);
        if (xn < 50)
            xn = 1;
        else if (xn < 100)
            xn = 2;
        else if (xn < 150)
            xn = 3;
        else if (xn < 200)
            xn = 4;
        else if (xn < 256)
            xn = 5;
        if (Src.indexOf("Vous utilisez un baton") > 0)
            xn++;
        else if (Src.indexOf("Vous utilisez une pioche") > 0)
            xn++;
        else if (Src.indexOf("Vous utilisez une hache") > 0)
            xn++;
        else if (Src.indexOf("Vous utilisez une épée") > 0)
            xn += 3;
        else if (Src.indexOf("Vous utilisez un fléau") > 0)
            xn += 3;
        else if (Src.indexOf("Vous utilisez une lance") > 0)
            xn += 3;
        else if (Src.indexOf("Vous utilisez une xiphos") > 0)
            xn += 3;
//logit("getPC l. 1986 - xn : " + xn);
        return(xn);
    },
    getPR: function (Src) {
		var x = Src.substring(Src.indexOf("Points de réputation</td>") + "Points de réputation</td>".length + 1);
        x = x.substring(x.indexOf(">") + 1, x.indexOf("</td>"));
        return(x);
    },
    getPR2: function (Src) {
        var z = "Points de réputation :</span> ";
        var x = getData(HtmlToString(Src), z, "</p>");
        return(x);
    },
    getPseudo: function () {
        var zone = document.getElementsByTagName("title")[0];
        var x = zone.innerHTML;
        x = getData(x, "Bienvenue à toi ", ",");
        return(x);
    },
    getStatus: function (Src) {
        var x = "actif"; //logit("getStatus : " + Src);
		x = (Src.indexOf("est MORT") != -1 ? "mort" : x);
        x = (Src.indexOf("lement en retranchement") != -1 ? "retranché" : x);
        x = (Src.indexOf("lement une retraite spirituelle") != -1 ? "retraite" : x);
        x = (Src.indexOf("lement en prison") != -1 ? "en prison" : x);
        return(x);
    },
    getStatusDate: function (Src) {
        var w = getData(Src, 'connexion le ', "<");
        var z = stringToDate(w);
        var d = z.split('/');
        var x = d[0] + "/" + d[1] + "/" + (Number(d[2]) - 2000 + (1461 - 13));
        return(x);
    },
    getPays: function (Src) {
        return(cvCar(getData(Src, "Pays :</span> ", "<")));
    },
    getVillage: function (Src) {
        return(cvCar(getData(Src, "Village :</span> ", "<")));
    },
    getComte: function (Src) {
        return(cvCar(getData(Src, "; :</span> ", "</p>")));
    },
    quelChamp: function (n) {
        if ((n > 0) && (n < libChamp.length + 1))
            return(libChamp[n - 1]);
        else
            return " -- ";
    },
    quelMetier: function (n) {
        if ((n > 0) && (n < libMetier.length + 1))
            return(libMetier[n - 1]);
        else
            return " -- ";
    },
    quelNiveau: function (n) {
        var x;
        if (n == "NaN")
            x = parseInt(n);
        else
            x = n;
        if (x == 0)
            return(x);
        if (x == 1)
            return("vag.");
        return(x - 1);
    },
    couleurSuspect: function (s) {
		if (nSuspects[s].Stat != -1){
			return (tStath[nSuspects[s].Stat]);
		} else {
				return("660000");
		}
    },
    lienHTML: function (x) {
        var cd = "", cf = "", z = str_replace(x, "\\", "");
        var s = Perso.siSuspect(z);
        if (s != -1) {
            cd = '<font color=#' + Perso.couleurSuspect(s) + '>';
            cf = "</font >";
        }
        return('<a href="http://www.lesroyaumes.com/FichePersonnage.php?login=' + z + '" target="_blank">' + cd + z + cf + '</a>');
    },
    lienBBcode: function (x) {
        var cd = "", cf = "", z = str_replace(x, "\\", "");
		var pv1, pv2;
        var s = Perso.siSuspect(z);
        if (s != -1) {
            cd = "[color=#" + Perso.couleurSuspect(s) + "]";
            cf = "[/color]";
        }
        return('[url=http://www.lesroyaumes.com/FichePersonnage.php?login=' + z + "]" + cd + z + cf + '[/url]');
    },
    siSuspect: function (x) {
        for (var i = 0; i < nSuspects.length; i++) {
            if (nSuspects[i].Pseudo == x)
                return(i);
        }
        return(-1);
    },
    getStat: function () {
        var i = 0;
        nbP = 0, nbPmort = 0, nbPretraite = 0, nbPretranche = 0;
        for (i = 0; i < nPersos.length; i++) {
            if (nPersos[i].Status == "mort")
                nbPmort++;
            if (nPersos[i].Status == "retraite")
                nbPretraite++;
            if (nPersos[i].Status == "retranché")
                nbPretranche++;
        }
    }
}
var Presence = {
    tdNom: '<td width="15%"><font size="1">',
    tdVillage: '<td width="15%"><font size="1">',
    tdComte: '<td width="20%"><font size="1">',
    tdPays: '<td width="20%"><font size="1">',
    tdEcu: '<td width="5%"><font size="1">',
    tdStatus: '<td width="5%"><font size="1">',
    ftd: '</font></td>',
    debut: function () {
        RRmenu.enVille();
        FnRR.load();
        if (Perso.getAction() == "Aucune") {
            alert("Présence impossible à faire!!!\nVous n'avez pas fait votre action du jour.");
            return;
        }
        //lecture de la page personnage
        if (QuelOnglet() != "Mon personnage") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=0', Presence.faire);
            return;
        }
        Presence.faire(document.getElementsByTagName("body")[0].innerHTML);
    },
    faire: function (Src) {
        LeRapport = "[b][u]Présence du " + mDate + "[/u][/b]\n\n";//logit("Presence.faire(l.1920)");
        LeRapport += Perso.getGrade(PersoGrade) + " [b]" + Perso.lienBBcode(PersoPrefs) + "[/b]\n";
        LeRapport += "PC : [b]" + Perso.getPC(Src) + "[/b]\n";
        LeRapport += Perso.getEncombrement(Src) + "\n";
        var x = Perso.getEncombrementGroupe(Src);
        if (x != "")
            LeRapport += x + "\n";
        LeRapport += "État : [b]" + Perso.getEtat(Src) + "[/b]\n";
        LeRapport += "Santé : [b]" + Perso.getSante(Src) + "[/b]\n";
        SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=8&a=4', Presence.fin);
    },
    fin: function (Src) {
        var x = Src.substring(Src.indexOf("textePage[4]['Texte']"));
        Escou = "Affectation : [b]" + (PersoEscouade == undefined ? " " : PersoEscouade) + (GetListeEscouade(x) == "" ? " " : " ( " + GetListeEscouade(x) + " )") + "[/b]\n";
        LeRapport += Escou;
        LeRapport += "Niveau d'alerte : [b]" + GetNiveauAlerte() + "[/b]\n";
        var m = GetOrdreDuJour();
        LeRapport += "Ordre du jour : [b]" + m + "[/b]\n";
        x = Perso.getAction();
        LeRapport += "Activité : [b]" + x + "[/b]\n";
        if ((m == "Patrouille/Escorte") || (m == "Défense du pouvoir") || (m == "Défense de la ville"))
            AjouterMission();
        LeRapport += "Récapitulatif du mois : \n";
        LeRapport += "- solde : " + PersoMission + " jour(s)\n";
        ClipboardCopyTo(HtmlToString(LeRapport));
        FnRR.setPersoJour(mDate);
        alert("Fiche de présence disponible dans le presse-papiers.");
    },
    couleurSuspect: function (p) {
        var cc = ["à surveiller", "assigné à résidence", "non grata", "brigand à signaler","Fatum",  "Hydre",  "top",    "mov"];
        var cv = ["660000",       "0000ff",              "880000",    "660000",            "ff0000", "ff0000", "008888", "ff0000"];
        var c = "";
        for (var i = 0; i < nSuspects.length; i++) {
            if (p == nSuspects[i].Pseudo) {
		if (nSuspects[i].Stat != -1) {
			c = "<font color=#" + tStath[nSuspects[i].Stat] + ">";
			break;
		}
                break;
            }
        }
        return(c);
    },
    affichage: function () {
        var i, m = "", c = "", cf = "";
        for (i = 0; i < nPersos.length; i++) {
            if (nPersos[i].Pseudo != "") {
                m += "<tr>";
                c = Presence.couleurSuspect(nPersos[i].Pseudo);
                if (c != "")
                    cf = "</font>";
                m += Presence.tdNom + c + Perso.lienHTML(nPersos[i].Pseudo) + cf + Presence.ftd;
                m += Presence.tdVillage + nPersos[i].Village + Presence.ftd;
                m += Presence.tdComte + nPersos[i].Comte + Presence.ftd;
                m += Presence.tdPays + nPersos[i].Pays + Presence.ftd;
                m += Presence.tdEcu + (nPersos[i].Ecu != undefined ? nPersos[i].Ecu : " ") + Presence.ftd;
                m += Presence.tdStatus + (nPersos[i].Status != "0" ? nPersos[i].Status : " ") + Presence.ftd;
                m += "</tr>";
            }
        }
        return(m);
    },
    liste: function () {
		Fichier.charger();
        var m = "";
        m += "Liste des présents (" + nPersos.length + " recensés le " + lastRapport + ")";
        m += "<table border=\"1\" cellspacing=\"0\">";
        m += "<tr>";
        m += Presence.tdNom + "<b>Nom</b>" + Presence.ftd;
        m += Presence.tdVillage + "<b>Ville</b>" + Presence.ftd;
        m += Presence.tdComte + "<b>Comté/Duché</b>" + Presence.ftd;
        m += Presence.tdPays + "<b>Pays</b>" + Presence.ftd;
        m += Presence.tdEcu + "<b>Écus</b>" + Presence.ftd;
        m += Presence.tdStatus + "<b>État</b>" + Presence.ftd;
        m += "</tr>";
        m += Presence.affichage();
        m += "</table>"
        monPopup = RRpopup.init("Liste des présents", 0);
        RRpopup.setMessage(monPopup, m + "<p>");
        RRpopup.fermeture(monPopup);
    },
    listeProducteurs: function () {
        alert("liste des producteurs");
    }
}
var Portrait = {
    // faire un portrait robot d'un personnage
    debut: function () {
        var x = window.prompt("Nom du personnage");
        if (x != "") {
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + x, Portrait.faire)
        }
    },
    faire: function (y) {
        if (y.indexOf("<br><br>Ce personnage n") == 0) {
            alert("Personnage inconnu!");
            Portrait.fin();
            return;
        }
        var Src = getData(y, '<div id="ImagePersonnage" style="position:relative;">', "</div></div>");
        var x, s;
        var t = "";
        if (Src.indexOf("hommes") != -1) {
            t += "Homme ";
            s = 1;
        }
        else {
            t += "Femme ";
            s = 2;
        }
        x = getData(Src, "corps/tete", ".png");
        if (x == "01")
            t += "au visage plutôt carré, ";
        else if (x == "02")
            t += "au visage plutôt ovale, ";
        else
            t += "au visage plutôt pointu, ";
        if (Src.indexOf("Cheveux") != -1){
			xx = getData(Src, "id=\"Cheveux\"", ");display");
			x = getData(xx, "corps/cheveu", ".png");
			var c = x.substring(0, 1);
			t += "cheveux ";
			switch (c) {
				case "0":
					t += "blonds";
					break;
				case "1":
					t += "châtains";
					break;
				case "2":
					t += "bruns";
					break;
				case "3":
					t += "noirs";
					break;
				case "4":
					t += "roux";
					break;
			}
			t += ".\n";
		}
        if (Src.indexOf("barbe") != -1){
			t += "Il porte ";
			x = getData(Src, "corps/barbe0", ".png");
			var c = x.substring(0, 1);
			switch (c) {
				case "1":
					t += "une moustache";
					break;
				case "2":
					t += "moustache et bouc";
					break;
				case "3":
					t += "moustache et bouc";
					break;
				default:
					t += "une barbe";
					break;
			}
			t += ".\n";
		}
        t += "Cette personne est vêtue "
        var v = "";
		v = Portrait.getCol(Src);
		if (v != "")
			t += v + ", "; logit ("l. 2510 - t='" + t + "'");
        if (Src.indexOf("Mantel") != -1){
        	if (Src.indexOf("Metal") != -1)
           		t += "d'une armure, ";
            else {
				var r = "", x = getData(Src, "habits/houppelande", ".png");
				if (x != "")
					r = "d'une houppelande " + Portrait.getCouleur(x) + ", ";
				else t += "d'un mantel, ";
				t += r;
			}
		} else {
            v = Portrait.getChemise(Src);
            if (v != "")
                t += v + ", ";
            v = Portrait.getBustier(Src);
            if (v != "")
                t += v + ", ";
            v = Portrait.getJupe(Src);
            if (v != ""){
                t += v + ", ";
		    } else {
				v = Portrait.getBraies(Src);
				if (v != "")
					t += v + ", ";
			}
        }
        if (Src.indexOf("Gilet") != -1)
           		t += "d'un gilet, ";
        if (Src.indexOf("Cape") != -1)
           		t += "d'une pélerine, ";
        if (Src.indexOf("Tablier") != -1)
           		t += "d'un tablier, ";
        if (Src.indexOf("Chapeau") != -1)
           		t += "d'un chapeau, ";
        if (Src.indexOf("Metal") == -1){
			v = "";
			if ((Src.indexOf("bottes") != -1) || (Src.indexOf("Bottes") != -1)){
				v = "bottes";}
			else if (Src.indexOf("poulaines") != -1){
				v = "poulaines";}
			else if (Src.indexOf("chausses") != -1){
				v = "chausses";}
			if (v != "")
				t += " et chaussée de " + v;
			else
				t += "et va nu-pied";
		}
		t += ".\n";

        if ((Src.indexOf("epee") != -1) || (Src.indexOf("bouclier") != -1) || (Src.indexOf("hache") != -1) || (Src.indexOf("pioche") != -1) || (Src.indexOf("baton") != -1) || (Src.indexOf("pelle") != -1)) {
            t += "Elle est aussi armée";
            v = "";
            if (Src.indexOf("epee") != -1)
                v += " d'une épée";
			if (Src.indexOf("pioche") != -1)
                v += " d'une pioche";
            if (Src.indexOf("hache") != -1)
                v += " d'une hache";
            if (Src.indexOf("baton") != -1)
                v += " d'un bâton";
            if (Src.indexOf("pelle") != -1)
                v += " d'une pelle";
            if (Src.indexOf("bouclier") != -1)
                v += " et d'un bouclier";
            if (v != "")
                    t += v + ".\n";
           // t +=  ".\n";
        }
        if (Src.indexOf("roimage") != -1)
            t += " Elle porte aussi un bâton de mâge.\n";
        ClipboardCopyTo(t);
        alert("Portrait terminé :\n\n" + t + "\nPortrait disponible dans le presse-papier.");
    },
    getChemise: function (Src) {
        var r = "", x = getData(Src, "habits/chemise", ".png"), xx = getData(Src, "maille", ".png");
        if (x != ""){
            if (x.indexOf("Soie") != -1)
                r = "d'une chemise en Soie";
            else r = "d'une chemise " + Portrait.getCouleur(x);
        } else if (xx != ""){
				r = "d'une cotte de mailles";
		} else
				r = "de haillons";

        return(r);
    },
    getBraies: function (Src) {
        var r = "", x = getData(Src, "habits/braies", ".png");
        if (x != "")
            r = "de braies " + Portrait.getCouleur(x);
        return(r);
    },
    getBustier: function (Src) {
        var r = "", x = getData(Src, "habits/bustier", ".png");
        if (x != "")
            r = "d'un bustier " + Portrait.getCouleur(x);
        return(r);
    },
    getCape: function (Src) {
        var r = "", x = getData(Src, "habits/pelerine", ".png");
        logit ("getCape l.2614 : x='" + x + "'");
        if (x != "")
            r = "d'une pelerine";
        return(r);
    },
    getJupe: function (Src) {
        var r = "", x = getData(Src, "habits/jupe", ".png");
        if (x != "")
            r = "d'une jupe " + Portrait.getCouleur(x);
        return(r);
    },
    getCol: function (Src) {
        var r = "", x = getData(Src, "habits/col", ".png");
        logit ("getCol l.2614 : x='" + x + "'");
        if (x != "")
            if (x.indexOf("Aventurier") != -1)
                r = "d'un col d'Aventurier";
            else r = "d'un col " + Portrait.getCouleur(x);
        return(r);
    },
    getCouleur: function (x) {
        var r = "???";
        switch (x) {
            case "00":
                r = "noir";
                break;
            case "01":
                r = "beige";
                break;
            case "02":
                r = "bleu";
                break;
            case "03":
                r = "rouge";
                break;
            case "04":
                r = "vert";
                break;
            case "05":
                r = "marron";
                break;
            case "06":
                r = "cyan";
                break;
            case "07":
                r = "jaune";
                break;
            case "08":
                r = "mauve";
                break;
            case "09":
                r = "blanc";
                break;
            case "10":
                r = "gris";
                break;
        }
        return(r);
    },
    fin: function () {

    }
}
function GetUnSuspect() {

}

var Suspects = {
    tdType: '<td width="10%"><font size="1">',
    tdNom: '<td width="20%"><font size="1">',
    tdMotif: '<td width="50%"><font size="1">',
    tdDate: '<td width="10%"><font size="1">',
    tdMaj: '<td width="10%"><font size="1">',
    ftd: '</font></td>',
    addTable: function (el) {
        var xe1 = document.createElement("table");
        xe1.setAttribute('border', '1');
        xe1.setAttribute('cellspacing', '0');
        el.appendChild(xe1);
        return(xe1);
    },
    addTR: function (t, i) {
        var xTR = document.createElement("tr");
        if (i == -1) {
            Suspects.addTD(xTR, "10%", "Stat.");
            Suspects.addTD(xTR, "20%", "Nom");
            Suspects.addTD(xTR, "50%", "Motif");
            Suspects.addTD(xTR, "10%", "Date Ajout");
            Suspects.addTD(xTR, "10%", "Mod.");
        } else {
	    if (nSuspects[i].Date == "à supprimer")
        	xTR.setAttribute('style', 'background-color: #CCCCCC');
            Suspects.addTD(xTR, "10%", "<i><font size=1 color=#"+ tStath[nSuspects[i].Stat] + ">" + tStat[nSuspects[i].Stat] + "</font></i>");
            Suspects.addTD(xTR, "20%", "<b>" +Perso.lienHTML(nSuspects[i].Pseudo)) + "</b>";
            Suspects.addTD(xTR, "50%", nSuspects[i].Motif);
            Suspects.addTD(xTR, "10%", nSuspects[i].Date);
            Suspects.addTDn(xTR, i);
        }
        t.appendChild(xTR);
    },
    addTD: function (xTR, s, x) {
        var xe1 = document.createElement("td");
        xe1.setAttribute('width', s);
        xe1.innerHTML =  x;
        xTR.appendChild(xe1);
    },
    addTDn: function (xTR, i) {
        var xTD = document.createElement("td");
        xTD.setAttribute('width', '10%');
        if (i < 0)
            xTD.innerHTML = "Mod.";
        else {
            var xe2 = document.createElement("a");
            xe2.setAttribute('href', '#');
            xe2.setAttribute("class", 'lien_default');
            xe2.onclick = function () {
                Suspects.modifier(i);
                return false;
            };
            xe2.innerHTML = "Mod.";
            xTD.appendChild(xe2);
        }
        xTR.appendChild(xTD);
    },
    exporter: function () {
        var t = '[table cellspacing="0" border="1"]\n';
        for (var i = 0; i < nSuspects.length; i++) {
            t += "[tr]";
            t += "[td]" + nSuspects[i].Pseudo + "[/td]";
            t += "[td]" + nSuspects[i].Motif + "[/td]";
            t += "[td]" + nSuspects[i].Date + "[/td]";
            t += "[td]" + nSuspects[i].Stat + "[/td]";
            t += "[/tr]\n";
        }
        t += '[/table]';
        ClipboardCopyTo(t);
        alert("Export terminé, message disponible dans le presse-papier.");
    },
    importer: function () {
        if (!siOnglet("Le tribunal", "Vous devez vous rendre au tribunal"))
            return;
        var el = document.getElementById("zoneTexte1");
        SaveIG = el.innerHTML;
        el.innerHTML = 'Veuillez coller ici la liste à importer selon le format :<br><br>' +
 		' <b>Nom</b> <i>[Tab]</i> <b>Motif</b> <i>[Tab]</i> <b>Date</b> <i>[Tab]</i> <b>Statut</b><i>[CR]</i><br><br>' +
		' le statut étant : <br>"<b>0</b>" = <i>Sous surveillance</i>, ' +
		'"<b>1</b>" = <i>A assigner</i>, ' +
        	'"<b>2</b>" = <i>Non grata</i><br>' +
 		'"<b>3</b>" = <i>Brigandage</i>, ' +
 		'"<b>4</b>" = <i>Membre d\'un groupe de brigands connu</i><br>' +
	       	'"<b>5</b>" = <i>Trouble ordre public</i>,' +
		'"<b>6</b>" = <i>Mort ou Vif</i><br><br>' +
                '<form name="formulaire">' +
                '<textarea name="saisie" id="saisie" cols="40" rows="10">' +
                '</textarea><br>' +
                '</form>' +
                '<br>';
        RRmenu.addSubfunction(el, Suspects.importerTerminer, "Valider");
        RRmenu.addSubfunction(el, Suspects.importerAnnuler, "Annuler");
    },
    importerAnnuler: function () {
        Suspects.importerFin();
    },

	//cleanArray removes all duplicated elements
	cleanArray : function (z) {
	var i, j, len = z.length, out = [], obj = [];
	  for (i = 0; i < len; i++) {
		obj[z[i]] = 0;
	  }
	  for (j in obj) {
		out.push(j);
	  }
	  return out;
	},
    importerTerminer: function () {
        var t = document.formulaire.saisie.value;
        var e = t.split("\n");
        for (var i = 0; i < e.length; i++) {
            var f = e[i].split(String.fromCharCode(9));
            if (f[0] != "")
                nSuspects.push(new Brigand(f[0], f[1], f[2], f[3]));
        }
		nSuspects = nSuspects.sort();
		
		// logit("Suspects.importerTerminer - Nettayage doublons");
		// var newNbr = Suspects.cleanArray(nSuspects);
		// if (newNbr.length > 0) {
			// logit("Suspects.importerTerminer - newNbr.length : " + newNbr.length);
			// for (var i = 0; i < e.length; i++) {
				// logit("Suspects.importerTerminer - newNbr.i : " + newNbr[i]); 
			// }
		// } else {
			Suspects.enregistrer();
			alert("La liste prise en compte comporte " + nSuspects.length + " suspects.");
			Suspects.lire();
			Suspects.importerFin();
		// }
		Suspects.lister();
    },
    importerFin: function () {
        var el = document.getElementById("zoneTexte1");
        el.innerHTML = SaveIG;
    },
    Reinit: function(){
        if (localStorage) {
            var x = "";SuspDuche = "RRSuspects_" + mDuche;
            localStorage[SuspDuche] = x;
        } else {
            alert("localStorage indisponible");
        }
    },
    enregistrer: function () {
        if (localStorage) {
            var x = ""; SuspDuche = "RRSuspects_" + mDuche;
		    nSuspects = nSuspects.sort();
            for (var i = 0; i < nSuspects.length; i++) {
                x += nSuspects[i].Pseudo + "|";
                x += nSuspects[i].Motif + "|";
                x += nSuspects[i].Date + "|";
                x += nSuspects[i].Stat + "ø";
            }
            localStorage[SuspDuche] = x;
        } else {
            alert("localStorage indisponible");
        }
    },
    lire: function () {
        if (nSuspects.length != undefined)
            nSuspects.splice(0, nSuspects.length);
        var z = "", i = 0; SuspDuche = "RRSuspects_" + mDuche;
        if (localStorage) {
            try {
                z = localStorage[SuspDuche].split('ø');
            } catch (e) {
                return;
            }
            for (i = 0; i < z.length; i++) {
                if (z[i] == null)
                    break;
                var y = z[i].split("|");
                if (y[0] != "")
                    nSuspects.push(new Brigand(y[0], y[1], y[2], y[3]));
            }
        } else {
            alert("localStorage indisponible");
        }
    },
    lister: function () {
        if (!siOnglet("Le tribunal", "Vous devez vous rendre au tribunal"))
            return;
        var m = "";
		Suspects.lire();
        m += "Liste des suspects (" + nSuspects.length + ") ";
        var el = document.getElementById("zoneTexte1");
        SaveIG = el.innerHTML;
        el.innerHTML = m;
        RRmenu.addSubfunction(el, Suspects.ajouter, "Ajouter");
        var t = Suspects.addTable(el);
        Suspects.addTR(t, -1);
        Suspects.listerListe(t);
        RRmenu.addSubfunction(el, Suspects.listerTerminer, "Terminer");
        RRmenu.addSubfunction(el, Suspects.ajouter, "Ajouter");
    },
    listerListe: function (t) {
        var i, m = "";
        for (i = 0; i < nSuspects.length; i++) {
            Suspects.addTR(t, i);
        }
        return(m);
    },
    listerTerminer: function () {
        var el = document.getElementById("zoneTexte1");
        el.innerHTML = SaveIG;
    },
    verifier: function () {
        if (siOnglet("Le tribunal", "Vous devez vous rendre au tribunal") == 0)
            return;
        Bar.debut("<b>Vérification de la liste des suspects</b>", "zoneTexte1");
        var el = document.getElementById("zoneTexte1");
        el.innerHTML += "<br>";
        nPS = 0;
        errorCnt = 0;
        errorPersoCnt = 0;
        LeRapport = "";
        Suspects.verifierSuspects();
    },
    verifierSuspects: function () {
        if (nPS < nSuspects.length) {
            Bar.progression(Math.floor(nPS + 1) + "/" + nSuspects.length + ">>>" + nSuspects[nPS].Pseudo,
                    (Math.floor(nPS + 1) / nFurtifs.length) * 100);
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + (nSuspects[nPS].Pseudo), Suspects.verifierInfo);
        } else {
            Bar.addMessage("<br>Vérification terminée ");
            Suspects.verifierTerminer();
        }
    },
    verifierInfo: function (Src) {
        if (Src.indexOf("Connexion perdue<") != 0) {
            if (Src.indexOf("Derni&egrave;re connexion") != -1) {
                nPS++;
                Suspects.verifierSuspects();
            }
            else if (Src.indexOf("Ce personnage n'existe pas, ou plus, ou pas encore.") != -1) {
                if (LeRapport == "")
                    Bar.setTexte("Personnages qui n'existent plus:<br>");
                LeRapport = nSuspects[nPS].Pseudo + "\n";
                Bar.addMessage(nSuspects[nPS].Pseudo + "<br>");
                nSuspects[nPS].Date = "<b>à supprimer</b>";
                nPS++;
                Suspects.verifierSuspects();
            }
        }
        else
            MessageErreur = "<b>Erreur pendant le contrôle.</b>";
    },
    num: -1,
    modifier: function (n) {
        Suspects.num = n;
        var el = document.getElementById("zoneTexte1");
		if (nSuspects[n].Date == "undefined") nSuspects[n].Date= mDate;
		if (nSuspects[n].Stat == "undefined") nSuspects[n].Stat= "Surv";
		logit("nSuspects[n].Stat (l.2496) : "+ nSuspects[n].Stat);
        el.innerHTML = '<h1>' + nSuspects[n].Pseudo + "</h1>" +
                '<form name="formulaire">' +
                '<input name="pseudo" id="pseudo" value="' + nSuspects[n].Pseudo + '"><br><br>' +
		'<input value="0" name="Stat" id="Surv." type="radio" ' + (nSuspects[n].Stat ==0 ? 'CHECKED' : '') + '>Sous surveillance &nbsp;' +
		'<input value="1" name="Stat" id="Assign." type="radio" ' + (nSuspects[n].Stat ==1 ? 'CHECKED' : '') + '>A assigner &nbsp; ' +
        	'<input value="2" name="Stat" id="PNG" type="radio" ' + (nSuspects[n].Stat ==2 ? 'CHECKED' : '') + '>Non grata<br>' +
 		'<input value="3" name="Stat" id="Brig." type="radio" ' + (nSuspects[n].Stat ==3 ? 'CHECKED' : '') + '>Brigandage &nbsp; ' +
	       	'<input value="4" name="Stat" id="Membre" type="radio" ' + (nSuspects[n].Stat ==4 ? 'CHECKED' : '') + '>Membre &nbsp;' +
	       	'<input value="5" name="Stat" id="TOP" type="radio" ' + (nSuspects[n].Stat ==5 ? 'CHECKED' : '') + '>Trouble ordre public &nbsp;' +
		'<input value="6" name="Stat" id="MoV" type="radio" ' + (nSuspects[n].Stat ==6 ? 'CHECKED' : '') + '>Mort ou Vif<br><br>' +
                "Motif <br>" +
                '<textarea name="motif" id="motif" cols="40" rows="10">' +
                nSuspects[n].Motif +
                '</textarea><br>' +
                "Date inscription (jj/mm/aaaa)" + "<br>" +
                '<input name="date" id="date" value="' + nSuspects[n].Date + '">' +
                '<input name="n" id="n" value="' + n + '" disabled></form>' +
                '<br>';
        RRmenu.addSubfunction(el, Suspects.modifierOK, "Valider");
        RRmenu.addSubfunction(el, Suspects.importerAnnuler, "Annuler");
        RRmenu.addSubfunction(el, Suspects.modifierSupprimer, "Supprimer");
    },
    supprimer: function (n) {
        alert("supprimer : " + nSuspects[n].Pseudo);
    },
    modifierOK: function () {
        var n = Suspects.num;
        var nom = document.formulaire.pseudo.value;
        if (nom == "") {
            alert("Le nom du suspect doit être renseigné!");
            return;
        }
        var motif = document.formulaire.motif.value;
        if (motif == "") {
            alert("Le motif est obligatoire!");
            return;
        }
        nSuspects[n].Pseudo = nom;
        nSuspects[n].Motif = motif;
        t = document.formulaire.date.value;
        nSuspects[n].Date = t;
		for (i=0; i<document.formulaire.Stat.length; i++) {
			if (document.formulaire.Stat[i].checked) {
			t = document.formulaire.Stat[i].value;
			i = document.formulaire.Stat.length;
			}
		}
        nSuspects[n].Stat = t;
        Suspects.enregistrer();
        Suspects.importerAnnuler();
        Suspects.num = -1;
		Suspects.lister();
    },
    modifierSupprimer: function () {
        if (confirm("Voulez-vous vraiment supprimer " + nSuspects[Suspects.num].Pseudo) == true) {
            nSuspects.splice(Suspects.num, 1);
            Suspects.enregistrer();
        }
        Suspects.importerAnnuler();
        Suspects.num = -1;
    },
    ajouter: function () {
        Suspects.num = -2;
        var el = document.getElementById("zoneTexte1");
        el.innerHTML = '<h1>' + "Ajouter un suspect" + "</h1>" +
                '<form name="formulaire">' +
                'Nom : <input name="pseudo" id="pseudo" value=""><br><br>' +
		'<input value="0" name="Stat" type="radio" CHECKED>Sous surveillance &nbsp;' +
		'<input value="1" name="Stat" type="radio" >A assigner &nbsp; ' +
        	'<input value="2" name="Stat" type="radio" >Non grata<br>' +
 		'<input value="3" name="Stat" type="radio" >Brigandage &nbsp; ' +
 		'<input value="4" name="Stat" type="radio" >Membre... &nbsp; ' +
	       	'<input value="5" name="Stat" type="radio" >Trouble ordre public &nbsp;' +
		'<input value="6" name="Stat" type="radio" >Mort ou Vif<br><br>' +
                 "<br>Motif <br>" +
                '<textarea name="motif" id="motif" cols="40" rows="10">' +
                "" +
                '</textarea><br>' +
                 "Date inscription (jj/mm/aaaa)" + "<br>" +
                '<input name="date" id="date" value="' + mDate + '">' +
               '</form>' +
                '<br>';
        RRmenu.addSubfunction(el, Suspects.ajouterOK, "Ajouter");
        RRmenu.addSubfunction(el, Suspects.importerAnnuler, "Annuler");
    },
    ajouterOK: function () {
        var nom = document.formulaire.pseudo.value;
        if (nom == "") {
            alert("Le nom du suspect doit être renseigné!");
            return;
        }
        var motif = document.formulaire.motif.value;
        if (motif == "") {
            alert("Le motif est obligatoire!");
            return;
        }
        var date = document.formulaire.date.value;
        if (date == "") {
            alert("La date est obligatoire!");
            return;
        }

		Stat = 0 ;
		for (i=0; i<document.formulaire.Stat.length; i++) {
			if (document.formulaire.Stat[i].checked) {
			Stat = document.formulaire.Stat[i].value;
			i = document.formulaire.Stat.length;
			}
		}

        nSuspects.push(new Brigand(nom, motif, date, Stat));
        nSuspects.sort(triPseudo);
        Suspects.enregistrer();
        Suspects.importerAnnuler();
        Suspects.num = -1;
    },
    verifierTerminer: function () {
		ClipboardCopyTo(BBc.fromHTML(document.getElementById("messageGuet").innerHTML));
        Bar.addMessage(nSuspects.length + " suspects contrôlés<br>(la liste est dans le presse-papier)<br>");
        Bar.progression(" ", -1);
        RRmenu.addSubfunction(document.getElementById("zoneTexte1"), Bar.fin, "Fermer");
    },
    controle: function () {
	if (nPersos.length < 1)
            Fichier.charger();
        var i, j, t = "";//logit("Suspects.controle (l.2573) nPersos.length : "+ nPersos.length);
        for (i = 0; i < nPersos.length; i++) {
            for (j = 0; j < nSuspects.length; j++) {
                if (nPersos[i].Pseudo == nSuspects[j].Pseudo) {
                    t += nSuspects[j].Pseudo + " : " + nSuspects[j].Motif + "\n";
                }
            }
        }
        if (t != "")
            alert("Suspects présents:\n" + t);
        else
            alert("Aucun suspect détecté.")
        return(t);
    },
    identifier: function () {
        var t = window.prompt("Collez ici la liste à identifier");
        if ((t == null) || (t == ""))
            return;
        var x = t.indexOf("Aujourd'hui., en chemin, vous avez croisé ");
        if (x != -1)
            t = t.substring("Aujourd'hui., en chemin, vous avez croisé ".length);
        if (t.substring(t.length - 1) == '.')
            t = t.substring(0, t.length - 1);
        var e = t.split(' '), n = -1, r = "";
        for (var i = 0; i < e.length; i++) {
            if ((e[i] == "et") || (e[i] == "de") || (e[i] == " ") || (e[i] == "") ||
                    (e[i] == "un") || (e[i] == "groupe") || (e[i] == "composé"))
                continue;
            if (e[i].indexOf(',') != -1) {
                var f = e[i].split(',');
                for (var j = 0; j < f.length; j++) {
                    if ((f[j] == "et") || (f[j] == "de") || (f[j] == " ") || (f[j] == ""))
                        continue;
                    r += Suspects.identifierUn(f[j]);
                }
            } else {
                r += Suspects.identifierUn(e[i]);
            }
        }
        if (r != "")
            alert("Identification:\n" + r);
    },
    identifierUn: function (x) {
        var n = Perso.siSuspect(x), r = "";
        if (n != -1)
            r += x + " : " + nSuspects[n].Motif + " (" + nSuspects[n].Stat + ")\n";
        else
            r += x + " : R.A.S.\n";
        return(r);
    }
}


var Test = {
    debut: function () {
        alert("test");
    }
}
var Fichier = {
    charger: function () {
        if (nPersos.length != undefined)
            nPersos.splice(0, nPersos.length);
        var z = "", y, i = 0, zzz = "";
        if ((mVille != "Sur les chemins") && (mVille != "\n\t\t\t\t\t\t\t<div>")){//"RRvillageois_\n<div>"
			VilName= "RRvillageois_" + mVille;
			if (localStorage) {
				try {
					z = localStorage[VilName].split('ø');
				} catch (e) {
					hPersos = ""; localStorage[VilName] = "|||||0|0|I|0|0|0|00/00/0000ø";
					return;
				}
	//             logit("Fichier charger.z.length (l.3340) : " + z.length + "'");
				if (z.length > 2){
					lastRapport	= z[0]; //logit("Fichier.charger.lastRapport (l.3342) : " + lastRapport);
					z.splice(0, 1);
					for (i = 0; i < z.length; i++) {
						if ((z[i] != null) && (z[i] != "")) {
							y = z[i].split("|");
							if (y.length > 11)
								nPersos.push(new Personnage(y[0], y[1], y[2], y[3], y[4], y[5], y[6], y[7], y[8], y[9], y[10], y[11]));
						}
					}
				} else {
					lastRapport	= "00/00/0000";
				}
			} else {
				alert("localStorage indisponible");
			}
		}
    },
    enregistrer: function () {
	    /* la première ligne est la date du recensement */
        var x = mDate + "ø", xp = nPersos;
        for (var i = 0; i < xp.length; i++) {
            x += xp[i].Pseudo;
            x += "|" + xp[i].Village;
            x += "|" + xp[i].Comte;
            x += "|" + xp[i].Pays;
            x += "|" + xp[i].Status;
            x += "|" + xp[i].PR;
            x += "|" + xp[i].Ecu;
            x += "|" + xp[i].Niveau;
            x += "|" + xp[i].Metier;
            x += "|" + xp[i].Champ1;
            x += "|" + xp[i].Champ2;
            x += "|" + xp[i].date;
            x += "ø";
        }
         if ((mVille != "Sur les chemins") && (mVille != "\n\t\t\t\t\t\t\t<div>")){//"RRvillageois_\n<div>"
//       if (mVille != "Sur les chemins"){
			VilName= "RRvillageois_" + mVille;
			if (localStorage) {
				try {
					//logit("Fichier enregistrer (l.3381) VilName : '" + VilName + "'");
					localStorage[VilName] = x;
				} catch (e) {
					logit("Fichier.enregistrer (l.3385) ERREUR ENREGISTREMENT ('" + VilName + "') : '" + e + "'");
					return;
				}
				hPersos = mDate;
				lastRapport = mDate;
			} else {
				alert("localStorage indisponible");
			}
 		}
   },
    chargerHier: function () {
        if (nHier.length != undefined)
            nHier.splice(0, nHier.length);
	   	var z = "", y, i = 0 , zzz = "";
         if ((mVille != "Sur les chemins") && (mVille != "\n\t\t\t\t\t\t\t<div>")){//"RRvillageois_\n<div>"
			VilName= "RRvillageoisHier_" + mVille; //logit("Fichier.chargerHier (l.3412) VilName : '" + VilName + "'");
			if (localStorage) {
				try {
					z = localStorage[VilName].split('ø');
				} catch (e) {
					localStorage[VilName] = "||||0ø";
					return;
				}
			/*le premier élément de la liste est la date d'hier */
	 //            logit("Fichier chargerHier.z.length (l.3421) : " + z.length + "'");
				 if (z.length>2){
					lastHier = z[0]; //logit("Fichier chargerHier.z[0] (l.3423) : " + z[0] + "' lastHier : '" + lastHier + "'");
					z.splice(0, 1);
					for (i = 0; i < z.length; i++) {
						if ((z[i] != null) && (z[i] != "")) {
							y = z[i].split("|");
							if (y.length > 4)
								nHier.push(new Present(y[0], y[1], y[2], y[3], y[4]));//logit("Fichier chargerHier-Present (l.2698) : '" + y[0] +"' '"+ y[1] +"' '"+ y[2] +"' '"+ y[3] +"' '"+ y[4] +"'");
						}
					}
				} else {
					lastHier = "00/00/0000";
				}
			} else {
				alert("localStorage indisponible");
			}
		}
    },
    enregistrerHier: function () {
        /*le premier élément de la liste est la date d'hier */
    	/* Récupère la liste de la veille pour sauvegarde */	
	    var z = "", y, i = 0, zzz = "";
         if ((mVille != "Sur les chemins") && (mVille != "\n\t\t\t\t\t\t\t<div>")){//"RRvillageois_\n<div>"
			VilName= "RRvillageois_" + mVille;
			if (localStorage) {
				try {
					z = localStorage[VilName].split('ø');
				} catch (e) {
					logit("Fichier.charger/enregistrerHier (l.3443) ERREUR CHARGEMENT ('" + VilName + "') : '" + e + "'");
					return;
				}
				if ((nHier.length != undefined) && (nHier.length > 0))
					nHier.splice(0, nHier.length);
				var x = z[0] + "ø";
				z.splice(0, 1);
				for (i = 0; i < z.length; i++) {
					if ((z[i] != null) && (z[i] != "")) {
						y = z[i].split("|");
						if (y.length > 11)
							nHier.push(new Present(y[0], y[1], y[2], y[3], y[4], y[6]));//logit("enregistrerHier (l.3454) : nHier.length : '" + nHier.length + "' y[0], y[1], y[2], y[3], y[4], y[6] = " + y[0] + " , " + y[1] + " , " + y[2] + " , " + y[3] + " , " + y[4] + " , " + y[6]);
							x +=       nHier[i].Pseudo;
							x += "|" + nHier[i].Village;
							x += "|" + nHier[i].Comte;
							x += "|" + nHier[i].Pays;
							x += "|" + nHier[i].Status;
							x += "|" + nHier[i].Ecu;
							x += "ø";
					}
				}
				VilName= "RRvillageoisHier_" + mVille;
				if (localStorage) {
					try {
						localStorage[VilName] = x;
					} catch (e) {
						logit("Fichier.enregistrerHier (l.3476) ERREUR ENREGISTREMENT ('" + VilName + "') : '" + e + "'");
						return;
					}
					lastHier = lastRapport;
				} else {
					alert("localStorage indisponible");
				}
			} else {
				lastHier = lastRapport;
			}
		}
	}
/* FIN Récupère la liste de la veille pour sauvegarde */			
}

var Village = {
    analyse: function () {
        var re = "";
        r = "<b>Statistiques :</b><br>";
        r += Village.analyseFaire();
        r += "<br><b>Activité économique :</b><br>";
        var v = 0, vt = 0;
        for (i = 0; i < libChamp.length; i++) {
            v = Village.champs(i);
            if (v > 0) {
                r += libChamp[i] + " : " + v + "<br>";
                vt += v;
            }
        }
        for (i = 0; i < libMetier.length; i++) {
            v = Village.echoppes(i);
            if (v > 0) {
                r += libMetier[i] + " : " + v + "<br>";
                vt += v;
            }
        }
        r += "Total des unités économiques : " + vt + "<br>";
        r += "<br>";
        monPopup = RRpopup.init("Statistiques", 0);
        RRpopup.setMessage(monPopup, r);
        RRpopup.progression(monPopup, " ", -1);
        RRpopup.fermeture(monPopup);
    },
    analyseFaire: function () {
        var r = "", i;
        if (nPersos.length > 0) {
            var nbP = 0, nbPmort = 0, nbPretraite = 0,
                nbH = 0, nbHmort = 0, nbHretraite = 0,
                nbV = 0, nbVmort = 0, nbVretraite = 0,
                nbE = 0, nbEmort = 0, nbEretraite = 0, sPersosExt = "", nbActifs = 0;
            nbP = nPersos.length;
//			logit("Village.analyseFaire.nbP : " + nbP);
            for (i = 0; i < nbP; i++) {
                if (nPersos[i].Status == "mort")
                    nbPmort++;
                if (nPersos[i].Status == "retraite")
                    nbPretraite++;
                if (nPersos[i].Village != mVille) {
                    if (nPersos[i].Comte != mDuche) {
                        nbE++;
                        if (nPersos[i].Status == "mort")
                            nbEmort++;
                        if (nPersos[i].Status == "retraite")
                            nbEretraite++;
                    } else {
                        nbV++;
                        if (nPersos[i].Status == "mort")
                            nbVmort++;
                        if (nPersos[i].Status == "retraite")
                            nbVretraite++;
                    }
                } else {
                    nbH++;
				    if (nPersos[i].Status == "actif") {
						nbActifs++;
						sPersosExt += Perso.lienHTML(nPersos[i].Pseudo) + '<br>'; // logit("Village.analyseFaire.sPersosExt" + sPersosExt);
					}
                    if (nPersos[i].Status == "mort")
                        nbHmort++;
                    if (nPersos[i].Status == "retraite")
                        nbHretraite++;
                }
            }
			logit("Village.analyseFaire.r : " + r);
            r +="<i><b> Synthèse pour " + mVille + " (" + mDuche + ")</b><br>";
			r += Village.unStat("Présent", nbP, nbPmort, nbPretraite);
            r += Village.unStat("Résident", nbH, nbHmort, nbHretraite);
            r += Village.unStat("Étranger", nbE, nbEmort, nbEretraite);
            r += Village.unStat("Voisin", nbV, nbVmort, nbVretraite);
			r += '</i><p>' + "<b>Liste des " + nbActifs + " résidents actifs </b><br>" + sPersosExt + '</p>';
        }
        return(r);
    },
    champs: function (c) {
        var n = 0;
        for (var i = 0; i < nPersos.length; i++) {
            if ((nPersos[i].Status == "actif") && (nPersos[i].Champ1 == c + 1))
                n++;
            if ((nPersos[i].Status == "actif") && (nPersos[i].Champ2 == c + 1))
                n++;
        }
        return(n);
    },
    echoppes: function (c) {
        var n = 0;
        for (var i = 0; i < nPersos.length; i++) {
            if ((nPersos[i].Status == "actif") && (nPersos[i].Metier == c + 1))
                n++;
        }
        return(n);
    },
    unStat: function (t, a, b, c) {
        var r = pluriel(a, t) + " : " + a;
        r += " (" + b + pluriel(b, " mort");
        r += ", " + c + pluriel(c, " retraité");
        r += ")<br>";
        return(r);
    },
    registre: function () {
        if (nPersos.length < 1)
            return;
        monPopup = RRpopup.init("Registre", 0);
        RRpopup.progression(monPopup, " ", -1);
        RRpopup.fermeture(monPopup);
        RRpopup.addBouton(monPopup, "Message(s)", MailRR.liste);
        Village.selectionAffichage();
    },
    selectionAffichage: function () {
        var i, r = "<b>Registre du village</b><br>", b1, b2, b3;
        r += '<table border="1" cellspacing="0">';
        r += Village.unRegistre(-1);
        for (i = 0; i < nPersos.length; i++) {
            b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
            if ((eVille == "Ville") ||
                    ((eVille == mVille) && (nPersos[i].Village == mVille)) ||
                    ((eVille == "Étranger") && (nPersos[i].Village != mVille)))
                b1 = 1;
            if ((eComte == "Comté/Duché") ||
                    ((eComte == mDuche) && (nPersos[i].Comte == mDuche)) ||
                    ((eComte == "Étranger") && (nPersos[i].Comte != mDuche)))
                b2 = 1;
            if (eActif == "Actif") {
                if (nPersos[i].Status == "actif")
                    b3 = 1;
            } else
                b3 = 1;
            if (eChamp != -1) {
                if ((eChamp == nPersos[i].Champ1) || (eChamp == nPersos[i].Champ2))
                    b4 = 1;
            } else
                b4 = 1;
            if (eMetier != -1) {
                if (eMetier == nPersos[i].Metier)
                    b5 = 1;
            } else
                b5 = 1;
            if (b1 && b2 && b3 && b4 && b5) {
                r += Village.unRegistre(i);
            }
        }
        r += "</table>";
        RRpopup.setMessage(monPopup, r);
        var xzone;
        xzone = monPopup.document.getElementById("selEtat");
        RRmenu.addSubfunction3(xzone, Village.selectionEtat, eActif);
        xzone = monPopup.document.getElementById("selVille");
        RRmenu.addSubfunction3(xzone, Village.selectionVille, eVille);
        xzone = monPopup.document.getElementById("selComte");
        RRmenu.addSubfunction3(xzone, Village.selectionComte, eComte);
        xzone = monPopup.document.getElementById("selChamp");
        var xx = '<form id="fChamp"><select id="sChamp">';
        xx += "<option>" + "Champs" + "</option>";
        for (i = 0; i < libChamp.length; i++) {
            if (i == eChamp - 1)
                xx += "<option selected>"
            else
                xx += "<option>"
            xx += libChamp[i] + "</option>";
        }
        xx += "</select></form>";
        xzone.innerHTML = xx;
        monPopup.document.getElementById("selChamp").onchange = function () {
            Village.selectionChamp();
            return false;
        };

        xzone = monPopup.document.getElementById("selMetier");
        xx = '<form id="fMetier"><select id="sMetier">';
        xx += "<option>" + "Métier" + "</option>";
        for (i = 0; i < libMetier.length; i++) {
            if (i == eMetier - 1)
                xx += "<option selected>"
            else
                xx += "<option>"
            xx += libMetier[i] + "</option>";
        }
        xx += "</select></form>";
        xzone.innerHTML = xx;
        monPopup.document.getElementById("sMetier").onchange = function () {
            Village.selectionMetier();
            return false;
        };
//		logit("nPersos.length : " + nPersos.length);
        for (i=0;i<nPersos.length;i++) {
			Village.lienMail(monPopup,nPersos[i].Pseudo);
        }
   },
    selectionVille: function () {
        if (eVille == mVille)
            eVille = "Étranger";
        else if (eVille == "Étranger")
            eVille = "Ville";
        else
            eVille = mVille;
        Village.selectionAffichage();
    },
    selectionComte: function () {
        if (eComte == mDuche)
            eComte = "Étranger";
        else if (eComte == "Étranger")
            eComte = "Comté/Duché";
        else
            eComte = mDuche;
        Village.selectionAffichage();
    },
    selectionEtat: function () {
        eActif = (eActif == "État" ? "Actif" : "État");
        Village.selectionAffichage();
    },
    selectionChamp: function () {
        var r = monPopup.document.getElementById("sChamp").selectedIndex;
        if (r == 0)
            eChamp = -1;
        else
            eChamp = r;
        Village.selectionAffichage();
    },
    selectionMetier: function () {
        var r = monPopup.document.getElementById("sMetier").selectedIndex;
        if (r == 0)
            eMetier = -1;
        else
            eMetier = r;
        Village.selectionAffichage();
    },
    unRegistre: function (i) {
        var r = "";
        var dtd = '<td>', ftd = "</td>";
        r += '<tr style="font-size:10px">';
        if (i == -1) {
            r += dtd + '<b>Nom</b>' + ftd;
            r += dtd + '<b><span id="selVille"></span></b>' + ftd;
            r += dtd + '<b><span id="selComte"></span></b>' + ftd;
            r += dtd + '<b>Lvl</b>' + ftd;
            r += dtd + '<b>Ecus</b>' + ftd;
            r += dtd + '<b><span id="selEtat"></span></b>' + ftd;
            r += dtd + "<b>PR</b>" + ftd;
            r += dtd + '<b><span id="selChamp"></span></b>' + ftd;
            r += dtd + '<span id="selMetier"></span></b>' + ftd;
            r += dtd + '&nbsp;' + ftd;
        } else {
            r += dtd + Perso.lienHTML(nPersos[i].Pseudo) + ftd;
            r += dtd + cvCar(nPersos[i].Village) + ftd;
            r += dtd + cvCar(nPersos[i].Comte) + ftd;
            r += dtd + nPersos[i].Niveau + ftd;
            r += dtd + nPersos[i].Ecu + ftd;
            r += dtd + nPersos[i].Status + ftd;
            r += dtd + nPersos[i].PR + ftd;
            r += dtd + (nPersos[i].Champ1 > 0 ? Perso.quelChamp(nPersos[i].Champ1) : "&nbsp;");
            if (nPersos[i].Champ2 > 0)
                r += " + " + Perso.quelChamp(nPersos[i].Champ2);
            r += ftd;
            r += dtd + (nPersos[i].Metier > 0 ? Perso.quelMetier(nPersos[i].Metier) : "&nbsp;") + ftd;
            r += dtd + '<input type="checkbox" name="mp' + nPersos[i].Pseudo + '" id="mp' + nPersos[i].Pseudo + '" value="1"></input>' + ftd;
/*			r += dtd + '<input type="image" id="mail' + nPersos[i].Pseudo + '" src="http://statics.lesroyaumes.com/images/newRRCaracArgent.png" style="width:12px; height:12px;"/>'
//	    logit("unRegistre (l.2761) recap : "+nPersos[i].Pseudo+","+nPersos[i].Village+","+nPersos[i].Comte+","+nPersos[i].Niveau+","+nPersos[i].Ecu+","+nPersos[i].Status+","+nPersos[i].PR+","+nPersos[i].Champ1+","+nPersos[i].Champ2+","+nPersos[i].Metier);
 //       r += "</input type="image" src=">\n";*/
        }
        return(r);
    },
    lienMail: function (z, x) {
		//var mesC = z.document.innerHTML;logit("mesC : " + mesC);
		var ez=z.document.getElementById('mail'+x);//logit("ez + x + (ez==undefined): " + ez + " - " + x + " - " + (ez==undefined));
		if (ez==undefined) return;
		var xe=ez.createElement("a");
		
/*		monPopup.document.getElementById("sMetier").onchange = function () {
            Village.selectionMetier();
            return false;
        };*/

		xe.onclick = function() {
				MailRR.envoi("'"+x+"'");
				return false;
			};
		xe.innerHTML='<img src=http://statics.lesroyaumes.com/images/newRRCaracArgent.png style="width:12px; height:12px;" >';
		ez.appendChild(xe);
    }
}

var Mairie = {
    achats: function () {
        var zsrc = Mairie.achatsFaire("Ventes", "<br><p>Embauches</p>");
        zsrc += Mairie.achatsFaire("Achats", "<br><p>Achats automatiques</p>");
        zsrc += Mairie.achatsFaire("Achats automatiques", "<br></div>");
		zsrc+= "\nLégende : V = ventes - A = achats - U = achats automatiques\n";
        ClipboardCopyTo(zsrc);
        alert("Rapport des achats/ventes disponible dans le presse-papiers.");
    },
    achatsFaire: function (t1, t2) {
        var x = "<p>" + t1 + "</p>";
        var n = document.body.innerHTML.indexOf(x);
        if (n == -1) {
            alert("Informations inaccessibles!!!");
            return(undefined);
        }
        var src = HtmlToString(getData(document.body.innerHTML, x, t2));
        if (t1 == "Ventes")
            src = str_replace(src, " : Vous avez vendu ", "\t");
        else if (t1 == "Achats")
            src = str_replace(src, " : Vous avez acheté ", "\t");
        else
            src = str_replace(src, " : Vous avez acheté automatiquement ", "\t");
        var l = src.split('\n');
        var i = 0, y, a;
        src = "";
        for (i = 0; i < l.length; i++) {
            y = l[i].split('\t');
            if (y[1] != undefined) {
                a = y[1].indexOf(" ");
                y[1] = y[1].substring(0, a) + "\t" + y[1].substring(a, y[1].indexOf(" écus"));
                src += y[0] + '\t' + y[1] + "\t" + (t1 == "Achats automatiques" ? "U" : t1.substring(0, 1)) + "\n";
            }
        }
        src = str_replace(src, " pour ", "\t");
        //calcul du prix unitaire pour les achats automatiques
        if (t1 == "Achats automatiques") {
            l = src.split('\n');
            src = "";
            for (i = 0; i < l.length - 1; i++) {
                y = l[i].split("\t");
                y[3] = str_replace(y[3], ",", ".");
                var b = parseFloat(y[1]);
                var c = parseFloat(y[3]) / b;
                x = "" + c.toFixed(2);
                x = str_replace(x, ".", ",");
                src += y[0] + '\t' + y[1] + '\t' + y[2] + '\t' + x + '\t' + y[4] + '\t' + "\n";
            }
        }
        return(src);
    },
    inventaire: function () {
        var x = "textePage[4][4]['Texte'] = '";
        var n = document.body.innerHTML.indexOf(x);
        if (n == -1) {
            alert("Informations inaccessibles!!!");
            return;
        }
        var src = HtmlToString(getData(document.body.innerHTML, x, "textePage"));
        src = src.substring(0, src.length - 3);
        src = str_replace(src, "<p>Encombrement : 1912</p>", "")
        src = str_replace(src, '<div class="inventaire_contenu_01">', "\n**");
        src = str_replace(src, '<div class="inventaire_contenu_01_item">', " ");
        src = str_replace(src, '<div class="inventaire_contenu_01_argent">', "");
        src = str_replace(src, '<img src="http://statics.lesroyaumes.com/images/items/itemArgent.png" width="48px" height="24px"></div>', "");
		src = str_replace(src, '<div class="inventaire_contenu_01_descriptif" title="', "(");
        src = str_replace(src, '.">', ') ');
        src = str_replace(src, '. ">', ') ');
        src = str_replace(src, '<div class="inventaire_contenu_01_descriptif">', "");		
        src = str_replace(src, '<div class="inventaire_contenu_01_poids">', " ");
        src = str_replace(src, '<div class="inventaire_utiliser_disabled">', "");		
        src = str_replace(src, '</div>', "|");
        src = str_replace(src, '|<div class="inventaire_contenu_01_nbre">', "");
        var s = src.split('\n');
        var i;
        src = getData(s[2], "**", "|") + "\n";
        for (i = 2; i < s.length; i++) {
            src += getData(s[i], ">", "| ") + "\n";
       }
        src = str_replace(src, "\n\n", "\n");
        src = str_replace(src, '|', '\t');
        src = "[b][u]Stock de la mairie[/u][/b]\n" + src;
        src = src + "\n" + Mairie.ordresAchatVente();
        src = src + Mairie.pointsEtat();
        ClipboardCopyTo(src);
        alert("Rapport d'inventaire disponible dans le presse-papiers.");
    },
    pointsEtat: function () {
        var x = getData(document.body.innerHTML, "textePage[4][14]['Texte'] = '", "';");
        x = HtmlToString(x);
        x = str_replace(x, '<h1>', "[b][u]");
        x = str_replace(x, '</h1>', "[/u][/b]");
        x = str_replace(x, '\ndans le domaine', " dans le domaine");
        x = str_replace(x, '<p>', "");
        x = str_replace(x, '<form', "\n<form");
        var t = x.split("\n");
        x = "";
        for (var i = 0; i < t.length; i++) {
            if (t[i].indexOf("La ville poss") != -1)
                x += t[i] + "\n";
            if (t[i].indexOf("changeables") != -1)
                x += t[i] + "\n";
        }
        return("[b][u]Fonctionnaires et fonctionnement de la commune[/u][/b]\n" + x);
    },
    ordresAchatVente: function () {
        var x = getData(document.body.innerHTML, "textePage[4][5]['Texte'] = '", "';");
        x = HtmlToString(x);
        x = str_replace(x, '<h1>', "[b][u]");
        x = str_replace(x, '</h1>', "[/u][/b]\n");
        x = str_replace(x, '<div align="left">', "");
        x = str_replace(x, '</div>', "");
        var t = x.split("\n");
        x = "";
        for (var i = 0; i < t.length; i++) {
            if (t[i] != "") {
                if (t[i].indexOf('<') != -1)
                    t[i] = t[i].substring(0, t[i].indexOf('<'));
            }
            x += t[i] + "\n";
        }
        return(x);
    },
    fraudeFiscale: function () {
        //récupération liste des fraudeurs (pas du détail)
        //la liste est dans textePage[4][20]['Texte']
        var n = document.body.innerHTML.indexOf("textePage[4][20]['Texte'] = '");// logit("fraude.Fiscale.n : " + n);
        if (n == -1) {
            alert("Informations inaccessibles!!!");
        }
        if (Fraudeur.length > 0) {
            //si changement de jour sauvegarde ancienne liste pour détection des mouvements
            Fraudeur.splice(0, Fraudeur.length);
        }
        var y = document.body.innerHTML.indexOf("textePage[4][24]");
        var src = document.body.innerHTML.substring(n, y);
        src = str_replace(src, "<br />", "\n")
//        var t = src.split("\n")
		var t = src.split(","), tx = "", z = "", zx = "", zv = 0, z1 = "", i = 0, zMoney = "", zPena = "", zPenDate="";
        t.splice(0, 2); 
        var vtx = new Array;
//		var ttt = t.split("\n");logit("fraude.Fiscale.ttt l.4185 : " + ttt + "fraude.Fiscale.ttt.length : " +ttt.length);
//        var vtx = t.split("\n");
		//<a class="lien_default lienPerso" href="javascript:popupPerso(\'FichePersonnage.php?login=Yann58390\')">Yann58390</a> : 13,50 écus (+20,92 écus de pénalité) avant le 21/01/1464
	    logit("fraude.Fiscale.t l.4185 : " + t + "fraude.Fiscale.t.length : " +t.length);
        for (i = 2; i < t.length - 1; i++) {
		       // var p1 = Src.indexOf(d);
				// if (p1 == -1)
					// return("");
				// p1 += d.length;
				// var p2 = Src.indexOf(f, p1);
				// if (p2 == -1)
					// return("");
				//return(Src.substring(p1, p2));
            z = getData(t[i], "login=", "\\')");
			logit ("t[i] : " + t[i]);
			zMoney += getData(t[i], "</a> : ", " écus (+')") + "\n"; logit("fraude.Fiscale.zMoney l.4190 : " + zMoney);
			zPena += getData(t[i], "(+", " écus de')") + "\n"; logit("fraude.Fiscale.zPena l.4191 : " + zPena);
			zPenDate += getData(t[i], "avant le ", "\n") + "\n"; logit("fraude.Fiscale.zPenDate l.4192 : " + zPenDate);
			logit("fraude.Fiscale.zMoney l.4193 : " + zMoney + " - zPena : " + zPena + " - zPenDate : " + zPenDate);
			if ((z != z1) && (z != "")) {
                if (tx != "") {
                    tx += "<br>"; logit("fraude.Fiscale.tx l.4191 : " + tx);
                } else {
				}
                tx += z;
                z1 = z;
				
                Fraudeur.push(new aFraudeurs(z, "", "", "")); logit("fraude.Fiscale.Fraudeur[Fraudeur.length-1]  l.4195: " + Fraudeur[Fraudeur.length-1] + " - z1 : " + z1 );
				//function Fraudeurs(nPseudo, nEcu, nStatus, fDate) }
            }
			 logit("fraude.Fiscale.Fraudeur[Fraudeur.length-1] : " + Fraudeur[Fraudeur.length-1]);
			 logit("fraude.Fiscale.Fraudeur[Fraudeur.length - 1].Nom : " + Fraudeur[Fraudeur.length - 1].Nom + " - Ecus to compute : " +str_replace(getData(t[i], " : ", " "), ",", ".") + " - Fraudeur[Fraudeur.length - 1].Status : " + Fraudeur[Fraudeur.length - 1].Status);
            Fraudeur[Fraudeur.length - 1].Ecu += Number(str_replace(getData(t[i], " : ", " "), ",", "."));
        }
        //vérifier chaque nom
        nFraudeur = 0;
        Bar.debut("<b>Liste des fraudeurs</b>", "zoneTexte0");
        Mairie.fraudeFiscaleSuite();
    },
    fraudeFiscaleSuite: function () {
        if (nFraudeur < Fraudeur.length) {
            Bar.progression(Math.floor(nFraudeur + 1) + "/" + Fraudeur.length + ">>>" + Fraudeur[nFraudeur].Pseudo,
                    (Math.floor(nFraudeur + 1) / nFraudeur.length) * 100);
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + (Fraudeur[nFraudeur].Pseudo), Mairie.fraudeFiscaleUn);
        } else {
            Bar.addMessage("<br>Recherche terminée ");
            Mairie.fraudeFiscaleFin();
        }
    },
    fraudeFiscaleUn: function (Src) {
        if (Src.indexOf("Connexion perdue<") != 0) {
            if (Src.indexOf("Derni&egrave;re connexion") != -1) {
                Fraudeur[nFraudeur].Status = "actif";
                if (Src.indexOf("actuellement en prison") != -1)
                    Fraudeur[nFraudeur].Status = "en prison";
                if (Src.indexOf("lement en retranchement") != -1) {
                    Fraudeur[nFraudeur].Status = "retranché du " + Perso.getStatusDate(Src);
                }
                if (Src.indexOf("est MORT") != -1) {
                    Fraudeur[nFraudeur].Status = "mort le " + Perso.getStatusDate(Src);
                }
                if (Src.indexOf("lement une retraite spirituelle") != -1) {
                    Fraudeur[nFraudeur].Status = "retraite du " + Perso.getStatusDate(Src);
                }
                nFraudeur++;
                Mairie.fraudeFiscaleSuite();
            }
            else if (Src.indexOf("Ce personnage n'existe pas, ou plus, ou pas encore.") != -1) {
                Fraudeur[nFraudeur].Status = "disparu";
                nFraudeur++;
                Mairie.fraudeFiscaleSuite();
            }
        }
        else
            MessageErreur = "<b>Erreur pendant le contrôle.</b>";
    },
    fraudeFiscaleFin: function () {
        var tx = "", i = 0;
        //--> si retranchement mettre dans la liste de retranchés
        //--> si retraite de plus de 3 mois mettre dans la liste de retraites
        tx = "<table>";
        tx += "<tr>";
        tx += "<td width=25%>" + "Nom" + "</td>";
        tx += "<td width=15%>" + "Dû" + "</td>";
        tx += "<td width=40%>" + "Status" + "</td>";
        tx += "<td width=40%>" + "Date" + "</td>";
        tx += "</tr>";
        for (i = 0; i < Fraudeur.length; i++) {
            tx += "<tr>";
            tx += "<td>" + Perso.lienHTML(Fraudeur[i].Pseudo) + "</td>";
            tx += "<td>" + str_replace(Fraudeur[i].Ecu.toFixed(2), ".", ",") + "</td>";
            tx += "<td>" + Fraudeur[i].Status + "</td>";
           tx += "<td>" + Fraudeur[i].fDate + "</td>";
            tx += "</tr>";
        }
        tx += "</table>";
        document.getElementById("zoneTexte0").innerHTML = "<h1>Liste des fraudeurs</h1><p>" + tx + "</p>";
    },
    assietteImpots: function () {
        var f = Mairie.taxeFonciere();
        if (f == undefined) {
            alert("Récupération de la table des taxes foncières immpossible\n" +
                    "La simulation de recette ne sera pas possible.");
        }
        // récupération des taxes
        var tf = f.split("\n");
        var txf = new Array(), trf = new Array();logit("assietteImpots.tf.length = " + tf.length);
        for (i = 0; i < tf.length; i++) {
            if (tf[i] != "") {
                txf = tf[i].split("\t");
                trf.push(txf);
                trf[trf.length - 1].push(0);
            }
        }
        var ztrf = -1;
        // fin de la récup
        var z = 0, njr = window.prompt("Seuil de retraite/retranchement (en jours)?", 15);
        var nc = 0, ne = 0, nh = 0, na = 0, nt = 0, ntr = 0, nr = 0, etrangers = 0, i, nprison = 0;
        var r = 0; logit("assietteImpots.nPersos.length = " + nPersos.length);
        for (i = 0; i < nPersos.length; i++) {
            if (nPersos[i].Village == mVille) {
                z = 0;
                nh++;
                if (nPersos[i].Status == "actif") {
                    z = 1;
                    na++;
                }
                //si en prison
                else if (nPersos[i].Status == "en prison") {
                    z = 1;
                    nprison++;
                }
                //si denière connexion moins de 1 mois
                else if (nPersos[i].Status == "retraite") {
                    if (difDate(mDate, nPersos[i].date) < njr) {
                        z = 1;
                        nt++;
                    } else
                        ntr++;
                }
                else if (nPersos[i].Status == "retranché")
                    nr++;
                if (z == 1) {
                    if (nPersos[i].Champ1 != 0) {
                        nc++;
                        r += Mairie.quelleRecette(Perso.quelChamp(nPersos[i].Champ1), f);
                        ztrf = Mairie.quelleChamp(Perso.quelChamp(nPersos[i].Champ1));
                        if (ztrf != -1) {
                            if (trf[ztrf] != undefined)
                                trf[ztrf][2]++;
                        }
                    }
                    if (nPersos[i].Champ2 != 0) {
                        nc++;
                        r += Mairie.quelleRecette(Perso.quelChamp(nPersos[i].Champ2), f);
                        ztrf = Mairie.quelleChamp(Perso.quelChamp(nPersos[i].Champ2));
                        if (ztrf != -1) {
                            if (trf[ztrf] != undefined)
                                trf[ztrf][2]++;
                        }
                    }
					logit("assietteImpots.nPersos[i].Metier = " + nPersos[i].Pseudo + " - " + nPersos[i].Metier);
                    if (nPersos[i].Metier != 0) {
                        ne++;
                        r += Mairie.quelleRecette(Perso.quelMetier(nPersos[i].Metier), f);
                        ztrf = Mairie.quelleChamp(Perso.quelMetier(nPersos[i].Metier));
                        if (ztrf != -1) {
                            if (trf[ztrf] != undefined)
                                trf[ztrf][2]++;
                        }
                    }
                }
            }
            else
                etrangers++;
        }
        var rx = (r / 100).toFixed(2);
        var rz = str_replace(rx, ".", ",");
        var ri = (rx / (nc + ne)).toFixed(2);
        ri = str_replace(ri, ".", ",");
        var xtrf = "", zxtrf = 0;
        xtrf = "<table border=1 cellspacing=\"0\">";
        xtrf += "<tr>";
        xtrf += "<td>" + "Unité" + "</td>";
        xtrf += "<td>" + "nombre" + "</td>";
        xtrf += "<td>" + "taux" + "</td>";
        xtrf += "<td>" + "produit" + "</td>";
        xtrf += "<tr>";
        for (i = 0; i < trf.length; i++) {
            xtrf += "<tr>";
            xtrf += "<td>" + trf[i][0] + "</td>";logit("assietteImpots.trf[i][0] Métier = " + trf[i][0]);
            xtrf += "<td>" + trf[i][2] + "</td>";logit("assietteImpots.trf[i][0] = " + trf[i][2]);
            xtrf += "<td>" + (Number(trf[i][1]) / 100).toFixed(2) + "</td>";
            xtrf += "<td>" + (Number(trf[i][2]) * (Number(trf[i][1]) / 100)) + "</td>";
            zxtrf += ((Number(trf[i][1]) * (trf[i][2]) / 100));
            xtrf += "<tr>";
        }
        xtrf += "</table><p></p>";
        //xtrf+="Total estimé = "+zxtrf;
        xtrf = str_replace(xtrf, ".", ",");
        //alert(xtrf);
        var vtrf = "Nombre d'étrangers présents ce jour : " + etrangers + "<br>" +
                "Nombre de résidents de " + mVille + " présents: " + nh + "<br>" +
                "- " + na + " actifs" + "<br>" +
                "- " + nprison + " en prison" + "<br>" +
                "- " + nt + " retraités de moins de " + njr + " jours" + "<br>" +
                "- " + ntr + " retraités de plus de " + njr + " jours" + "<br>" +
                "- " + nr + " retranchés" + "<br>" +
                "Soit une assiette d'imposition de " + nc + " parcelles et " + ne + " échoppes." + "<br>" +
                "Total des unités cadastrales de " + (nc + ne) + "." + "<br>" +
                "Recette potentielle : " + rz + " écus par quinzaine." + "<br>" +
                "Soit un impôt de " + ri + " écus en moyenne par unité fiscale."
        //alert(vtrf);
        document.getElementById("zoneTexte0").innerHTML = "<h1>Calcul d'assiette d'imposition</h1><p>" +
                xtrf + "</p><p>" + vtrf + "</p>";
    },
    quelleRecette: function (x, f) {
        if (f == undefined) {
            alert("f undefined");
            return(0);
        }
        var l = [
            "blé", "maïs", "vache", "mouton", "cochon", "légumes",
            "meunier", "boulanger", "boucher", "forgeron", "tisserand", "charpentier", 'sculpteur', 'botaniste'
        ];
/*        var l = [
            'blé', 'maïs', 'légumes', 'vaches', 'cochons', 'moutons', 'chèvres', 'oliviers', 'vigne', 'orge',
            'meunier', 'boulanger', 'boucher', 'forgeron', 'tisserand', 'charpentier', 'sculpteur', 'botaniste',
			'pressoir', 'whiskey', 'whisky', 'fromagerie', 'cave à vin', 'ferme à cidre'

        ];*/
        var i;
        for (i = 0; i < l.length; i++) {
            if (x.indexOf(l[i]) != -1) {
                var t = f.split('\n');
                if (t[i] == undefined)
                    return(0);
                var z = t[i].split("\t");
                return(Number(z[1]));
            }
        }
        return(0);
    },
    quelleChamp: function (x) {
/*        var l = [
            'blé', 'maïs', 'légumes', 'vaches', 'cochons', 'moutons', 'chèvres', 'oliviers', 'vigne', 'orge',
            'meunier', 'boulanger', 'boucher', 'forgeron', 'tisserand', 'charpentier', 'sculpteur', 'botaniste',
			'pressoir', 'whiskey', 'whisky', 'fromagerie', 'cave à vin', 'ferme à cidre'
        ];*/
        var l = [
            "blé", "maïs", "vache", "mouton", "cochon", "légumes",
            "meunier", "boulanger", "boucher", "forgeron", "tisserand", "charpentier", 'sculpteur', 'botaniste'
        ];
        var i;
        for (i = 0; i < l.length; i++) {
            if (x.indexOf(l[i]) != -1) {
                return(i);
            }
        }
        return(-1);
    },
    taxeFonciere: function () {
        var i, t;
        var n = document.body.innerHTML.indexOf("textePage[4][10]['Texte'] = '");
        if (n == -1) {
            alert("Informations inaccessibles!!!");
            return(undefined);
        }
        var y = document.body.innerHTML.indexOf("textePage[4][11]");
        var src = document.body.innerHTML.substring(n, y);
		/* Les différents indices des select : 
		Blé : taxec1 - Maïs : taxec2 - Vaches : taxec3 - Moutons : taxec4 - Cochons : taxec5
		Potager : taxec6 - Vigne : taxec8 - 
		Meunier : taxem1 - Boulanger : taxem2 - Boucher : taxem3 - Forgeron : taxem4
		Tisserand : taxem5 - Charpentier : taxem6 - 
		Cave à vin : taxem16 - 
		Sculpteur : taxem21 - Botaniste : taxem22
		*/
        src = HtmlToString(src);
        src = src.substring(src.indexOf("<tr>"));
        src = src.substring(src.indexOf("<tr>"));
        src = src.substring(src.indexOf("<tr>"));
        src = str_replace(src, '</tr>', "\n");
        for (i = 0; i < 5050; i += 50) {
            src = str_replace(src, '<option value="' + i + '">' + i + '</option>', "");
        }
        src = src.substring(0, src.indexOf("</table>"));
		logit("taxeFonciere.src = " + src);
        src = str_replace(src, "<tr>	<td>Impot</td>	<td>Montant par champ</td>", "");
        src = str_replace(src, ' <tr>  <td>Taxe foncière sur ', "");
        src = str_replace(src, '</td>  <td>    <select name="taxec', "|");
        src = str_replace(src, '</td>  <td>    <select name="taxem', "|");
        src = str_replace(src, '"><option value="', "|");
        src = str_replace(src, '" selected>', "|");
		logit("taxeFonciere.src = " + src);
        src = str_replace(src, 'Culture', "");
        src = str_replace(src, 'Elevage', "");
        src = str_replace(src, ' de ', "");
        src = str_replace(src, ' du ', "");
        src = str_replace(src, '"', "|");
        src = str_replace(src, 'Potager', "légumes");
        src = str_replace(src, 'M', "m");
        src = str_replace(src, 'B', "b");
        src = str_replace(src, 'F', "f");
        src = str_replace(src, 'T', "t");
        src = str_replace(src, 'C', "c");
        src = str_replace(src, 'S', "s");
        src = str_replace(src, 'V', "v");
      var s = src.split('\n');
        src = "";//logit("taxeFonciere.s.length = " + s.length);
        for (i = 0; i < s.length; i++) {
			//logit("taxeFonciere.s["+i+"] = " + s[i]);
            if ((s[i] != "") && (s[i] != " ")) {
                t = s[i].split("|");
                src += t[0] + "\t" + t[2] + "\n";logit("taxeFonciere.src = " + src);
            }
        }
        //la table est sous la forme champ/métier(tabulation)taxe
        return(src);
    },
    tableauDeBord: function () {

    },
    mandats: function () {
        var xx = "";
        xx += Mairie.mandatsFaire("Mandats en cours :");
        //xx+=Mairie.mandatsFaire("Mandats arrivés à terme : ");
        var t = xx.split('\n');
        xx = "";
        for (var i = 1; i < t.length; i++) {
            if (t[i] != "")
                xx += Mairie.mandatsDetail(t[i]);
        }
        ClipboardCopyTo(t[0] + "\n" + xx);
        alert((t.length - 2) + " mandats.\nRapport des mandats disponible dans le presse-papiers.");
    },
    mandatsDetail: function (src) {
        var z = getData(src, "Mandat ", " ");
        var x = "", i;
        if (z != "") {
            x = getData(document.body.innerHTML, "textePage[4][16][" + z + "]['Texte'] = '<h1>", "';");
            x = HtmlToString(x);
            x = str_replace(x, "</h1><p>", "\n");
            x = str_replace(x, '<div align="left">', "");
            x = str_replace(x, '</div>', "");
            x = str_replace(x, "<p>", "");
            x = str_replace(x, '\\n', "\n");
            x = str_replace(x, '</p>', "\n");
            x = str_replace(x, "<br>", "\n");
            x = str_replace(x, "<br />", "\n");
            x = str_replace(x, '<div class="ConteneurItem">', "");
            x = str_replace(x, '<div class="inventaire_contenu_01 nonInteractif">', "");
            x = str_replace(x, '<div class="inventaire_contenu_01_item">', "");
            x = str_replace(x, "\n\n", "\n");
            x = str_replace(x, '<div class="inventaire_contenu_01_nbre">', "\n- ");
            x = str_replace(x, '<div class="inventaire_contenu_01_descriptif">', " : ");
            x = str_replace(x, '<b> </b>\n', "");
            var t = x.split("\n");
            x = "";
            for (i = 0; i < t.length; i++) {
                if (t[i].substring(0, "- <b>#</b>".length) == "- <b>#</b>")
                    continue;
                if (t[i].indexOf("<") != -1)
                    t[i] = t[i].substring(0, t[i].indexOf("<"));
                x += t[i] + "\n";
            }
            if (x == "")
                return("");
        }
        return(src + "\n[quote]" + x + "[/quote]\n\n");
    },
    mandatsFaire: function (tx) {
        var x = document.body.innerHTML;
        x = getData(HtmlToString(x), tx + '</h2>', '<h2>');
        x = str_replace(x, "Mandat ", "\nMandat ")
        x = str_replace(x, '<a class="lien_default lienPerso" href="javascript:popupPerso(\'', "[url=http://www.lesroyaumes.com/");
        x = str_replace(x, '\')">', ']');
        var t = x.split('\n');
        var w = "", i = 0, nw = 0;
        for (i = 0; t.length; i++) {
            if (t[i] == undefined)
                break;
            if (t[i] != "") {
                w += t[i].substring(0, t[i].indexOf("</a>")) + '[/url]\n';
                nw++;
            }
        }
        w = str_replace(w, '</a>', '[/url]');
        var xx = "[b][u]" + tx + "[/u][/b] (" + nw + ')\n' + w;
        return(xx);
    },
    milice: function () {
        var x = document.body.innerHTML;
        x = HtmlToString(getData(x, '<p>Embauches</p>', '<p>Achats</p>'));
        x = str_replace(x, '<a class="lien_default lienPerso" href="javascript:popupPerso(\'', "[url=http://www.lesroyaumes.com/");
        x = str_replace(x, '\')">', ']');
        x = str_replace(x, '</a>', '[/url]');
        var t = x.split('\n');
        var z = mDate;
        var y = z.split('/');
        z = y[2] + "-" + y[1] + "-" + y[0];
        var w = "", nw = 0;
        for (var i = 0; i < t.length; i++) {
            if (t[i].indexOf(z) != -1) {
                w += t[i] + "\n";
                nw++;
            }
        }
        x = "[b][u]" + mVille + "[/u][/b] : " + nw + " milicien(s)\n" + w;
        ClipboardCopyTo(x);
        alert(nw + " miliciens.\nRapport de milice disponible dans le presse papiers.");
    },
    compta: function () {
        var x = getData(document.body.innerHTML, "textePage[4][24]['Texte'] = '", "</table>';");
		logit("compta.x1 = " + x);
        x = HtmlToString(x);
 		//logit("compta.x2 = " + x);
        x = str_replace(x, '<h2>', "[b][u]");
        x = str_replace(x, '</h2>', "[/u][/b]\n");
        x = str_replace(x, '<table>', '\n[table border="0" cellspacing="2"]\n');
        x = str_replace(x, '</table>', '[/table]\n');
        x = str_replace(x, '<th>', "[td][b]");
        x = str_replace(x, '</th>', "[/b][/td]");
        x = str_replace(x, '<td align="right">', '[td]')
        x = str_replace(x, '<tr><td colspan="5">--------------------</td></tr>', "");
        x = str_replace(x, '<tr>', '[tr]');
        x = str_replace(x, '</tr>', '[/tr]\n');
        x = str_replace(x, '<td>', '[td]');
        x = str_replace(x, '</td>', '[/td]');
        x = str_replace(x, '<b>', '[b]');
        x = str_replace(x, '</b>', '[/b]');
        x = str_replace(x, '<i>', '[i]');
        x = str_replace(x, '</i>', '[/i]');
        x = str_replace(x, '<br />', '\n');
        x += '[/table]';
		logit("compta.x3 = " + x);
        ClipboardCopyTo(x);
        alert("Rapport de comptabilité disponible dans le presse-papiers.");
    }
}
var Marche = {
    tdStrong: '<strong>',
    tdIcone: '<td width="8%" ><strong>',
    tdNom: '<td width="45%"><strong>',
    tdDispo: '<td width="10%">',
    ftd: '</strong></td>',
    tr: '<tr>',
    ftr: '</tr>',
    classe_0: ' class="marche_cat_0"',
    synthese: function () {
        RRoperation = "synthèse";
        Marche.syntheseFaire();
    },
    syntheseFaire: function () {
        var src1 = HtmlToString(document.body.innerHTML);
        var src = getData(src1, 'textePage[0] = new Array();', 'textePage[0][1]');
        src = src.substring(src.indexOf("<table>")+"<table>".length,src.indexOf("</table>"));
        src = str_replace(src, "</tr>", "\n");
        var i, j, k;
        var t = src.split('\n'), z;
        src = "";
        if (nProduits.length > 0) {
            nProduits.splice(0, nProduits.length);
        }
        for (i = 0; i < t.length; i++) {
            if ((t[i] != undefined) && (t[i] != "") && (t[i].indexOf("textePage") == -1) && (t[i].indexOf("<tr>") == -1)) {
                t[i] = str_replace(t[i], '<tr class="marche_cat_', '');
                t[i] = str_replace(t[i], '\"><td><img src="http://statics.lesroyaumes.com/images/items/item', '|');
                t[i] = str_replace(t[i], '.png" width="24" height="24"></td><td>', '|');
                t[i] = str_replace(t[i], '.png" width="24" height="24"></td><td title="Une potion portant le doux nom de : A l\'Anis. ">', '|');
                t[i] = str_replace(t[i], '</td><td>', '|');
                t[i] = t[i].substring(0, t[i].indexOf('|<img src="http://statics.lesroyaumes.com/images/indic'));
                if (t[i].indexOf("Durabilité") != -1) {
                    t[i] = t[i].substring(0, t[i].indexOf(".png")) + '|' + t[i].substring(t[i].indexOf("Pelles"), t[i].length);
                }
                z = t[i].split('|');
                if (z.length > 0) {
                    z[2] = Marche.siPoisson(z[2]);
                    z[2] = Marche.siPlante(z[2])
                    k = Marche.findProduit(z[2]);
                    if (k != -1)
                        nProduits[k].Dispo += Number(z[4]);
                    else
                        nProduits.push(new Produit(z[0], z[1], z[2], Number(z[4])));
                }
            }
        }
        if (RRoperation == "synthèse") {
            Marche.miseEnForme();
        }
    },
    findProduit: function (x) {
        if (nProduits.length == 0)
            return(-1);
        for (var i = 0; i < nProduits.length; i++) {
            if (x == nProduits[i].Nom)
                return(i);
        }
        return(-1);
    },
    miseEnForme: function () {
        var i = 0, z;
        var x = '<div><table>';
        x += '<tr>';
        x += '<td width="8%" ><strong>&nbsp;</strong></td>';
        x += '<td width="45%"><strong>Nom</strong></td>';
        x += '<td width="10%" align="center"><strong>Disponibilité</strong></td>';
        x += '<td width="17%"><strong>&nbsp;</strong></td>';
        x += '</tr>\n';
        for (i = 0; i < nProduits.length; i++) {
            if (nProduits[i].Nom != undefined) {
                x += '<tr class="marche_cat_' + nProduits[i].Cat + '">';
                x += '<td width="8%" >' + '<img src="http://www.lesroyaumes.com/images/items/item' + nProduits[i].Image + '.png" width="24" height="24">' + '</td>';
                x += '<td width="45%">' + nProduits[i].Nom + '</td>';
                x += '<td width="10%" align="center">' + nProduits[i].Dispo + '</td>';
                x += '<td width="17%" align="center" id="RRid' + nProduits[i].Image + '">';
                x += '</td>';
                x += '</tr>\n';
            }
        }
        x += "</table></div>";
        var xzone = document.getElementById("zoneTexte0");
        xzone.innerHTML = x;
        var xa;
		//MS_V = MarcheSeuil;//"MarcheSeuil_" + mVille;
		//Miches de pain|50øFruits|8øSacs de maïs|50øBouteilles de lait|5øMorceaux de viande|10øLégumes|8øCouteaux|2øChapeaux|2øChemises pour homme|2øChemises pour femme|2øGilets|1øBraies|2øBas pour homme|2øBas pour femme|2øPaires de chausses|2øPaires de bottes|1øCeintures|2øPoissons|5ø
        for (i = 0; i < nProduits.length; i++) {
            if (nProduits[i].Nom != undefined) {
                z = Marche.siProduitOk(nProduits[i].Nom, nProduits[i].Dispo, MarcheSeuil);
                if (z == 1)
                    x = '<img src="images/newRRCaracFaim.png" ';// pour OK
                else if (z == 0)
                    x = '<img src="images/newRRCaracSante.png" ';// pour KO
                else
                    x = '<img src="images/newRRCaracArgent.png" ';// pour KO
                xa = document.createElement('a');
                xa.onclick = function () {
                    Marche.surv(this.innerHTML);
                }
                xa.innerHTML = x + 'alt="' + nProduits[i].Image + '">';
                document.getElementById('RRid' + nProduits[i].Image).appendChild(xa);
            }
        }
    },
    setSeuil: function (p, v) {
        var z = MarcheSeuil, tu;
//        logit("Marche.setSeuil.MarcheSeuil (l.4726) : "+z);
		if (z =="|ø") z = "";
        if ((z != undefined) && (z != "")) {
            if (z.indexOf(p) != -1) {
                var t = z.split("ø");
                z = "";
                if (t.length > 0)
                    for (var i = 0; i < t.length; i++) {
                        if (t[i].indexOf(p) != -1) {
                            if ((v != "") && (v != "-1"))
                                z += p + '|' + v + 'ø';
                        } else if (t[i] != "")
                            z += t[i] + 'ø';
                    }
            } else
                z += p + "|" + v + "ø";
        } else
            z = p + "|" + v + "ø";
        z = str_replace(z, "øø", "ø");
        MarcheSeuil = z;
		RRmenu.setUserPrefs(); //Chapeaux|2øChemises pour homme|2øChemises pour femme|2øGilets|2øBraies|2øMantels|1øHouppelandes|1øBas pour homme|2øBas pour femme|2øPaires de chausses|2øPaires de bottes|1øCeintures|2øCapes|1øCols|1øJupes|2øRobes|1øTabliers|1øBustiers|1øFoulards|1øToques|1øCoiffes|1ø
    },
    getSeuil: function (p, tp) {
        var x = "0";
        if ((tp != undefined) && (tp != "")) {
            var t = tp.split("ø");
            for (var i = 0; i < t.length; i++) {
                if ((t[i] != "") && (t[i] != "")) {
                    tu = t[i].split('|');
                    if (tu[0] == p) {
                        x = tu[1];
                        break;
                    }
                }
            }
        }
        return(Number(x));
    },
    surv: function (src) {
        var z = getData(src, ' alt="', '"');
        var i, x, v, y;
        for (i = 0; i < nProduits.length; i++) {
            if (nProduits[i].Image == z) {
                y = Marche.getSeuil(nProduits[i].Nom, MarcheSeuil);
                //logit("Marche.surv.MarcheSeuil (l.4108) : "+y);
                v = window.prompt("Valeur de seuil pour " + nProduits[i].Nom, y);
                if ((v != undefined) && (v != "")) {
                    Marche.setSeuil(nProduits[i].Nom, v);
                    Marche.synthese();
                }
            }
        }
    },
    surveillance: function () {
		var x = MarcheSeuil;
//        logit("Marche.surveillance.MarcheSeuil (l.4780) : "+x); //MarcheSeuil="|ø";
        if ((x == undefined) || (x == "|ø")) {
            alert("Aucune surveillance");
            return;
        }
        Marche.syntheseFaire();
        var t = x.split("ø"), tu;
//		logit("Marche.surveillance l.4741 t.length: " + t.length);
        x = "";
        var i, j;
        for (i = 0; i < t.length; i++) {
            if ((t[i] != undefined) && (t[i] != "")) {
                tu = t[i].split("|");
                if (tu[i] == "")
                    continue;
                x += tu[0] + " : ";
                for (j = 0; j < nProduits.length; j++) {
                    if (nProduits[j].Nom == tu[0]) {
                        x += nProduits[j].Dispo + "/" + tu[1];
                        if (Number(nProduits[j].Dispo) < Number(tu[1]))
                            x += " manquant";
                        else
                            x += " -> OK";
                        j = -1;
                        break;
                    }
                }
                if (j > t.length)
                    x += "0" + "/" + tu[1] + " manquant";
                x += "\n";
            }
					logit("Marche.surveillance l.4765 x : " + x);
        }
        alert("Produit sous surveillance:\n\n" + x);
    },
    siProduitOk: function (p, v, tp) {
        //retourne :
        // 1 si nombre(v) du produit(p) est supérieur au seuil de surveillance (tp)
        // 0 si inférieur
        // -1 si non surveillé
        if ((tp == undefined) || (tp == "") || (tp.indexOf(p) == -1))
            return(-1);
        if (Number(v) < Marche.getSeuil(p, tp))
            return(0);
        return(1);
    },
    siPoisson: function (x) {
        var p = ["Carpes", "Truites", "Goujons", "Brochets", "Anguilles", "Ombres"];
        var r = x;
        for (var i = 0; i < p.length; i++) {
            if (p[i] == x) {
                r = "Poissons";
                break;
            }
        }
        return(r);
    },
    siPlante: function (x) {
        if (x == undefined)
            return(x);
        var p = ["Brins", "Fleurs", "Feuilles", "Branches", "écorce", "Baies"];
        var r = x;
        for (var i = 0; i < p.length; i++) {
            if (x.indexOf(p[i]) != -1) {
                r = "Plantes médicinales";
                break;
            }
        }
        return(r);
    },
    alerte: function () {
        alert("alerte si produit manquant");
    }
}

var Exterieur = {
    controler: function () {
        var el = document.getElementById("zoneTexte0");//"zoneTexte2"
        SaveIG = el.innerHTML;
		if ( SaveIG.length < 50) {
			var el = document.getElementById("zoneTexte2");//"zoneTexte2"
			SaveIG = el.innerHTML;
		}
//		logit("Exterieur.controler.el : " + el.innerHTML + " - SaveIG.length : " + SaveIG.length);
		ExtHier = "", ExtJour = "", ExtVille = "";
        // var m = '<h1>Guet pour un village</h1>' + '<form name="formulaire">';
        // m += '<table><tr><td style="width:50%">';
        // m += 'Royaume : ' + '<select name="RoyaumeChoisi" id="comteChoisi">';
		// var sSelect = '<option value="-1"  selected>Royaume</option>';
		
		// for (var i = 0; i < InfosPaysRR.length; i ++) {
			// logit("InfosPaysRR[i]['Nom'] : "  + i + ' - ' + InfosPaysRR[i]['Nom'] );
			// if (typeof InfosPaysRR[i] == "undefined")
				// while (typeof InfosPaysRR[i] == "undefined") {
					// i++;
				// }
			// sSelect += '<option value="'+i+'"';
			// if (i == 0)
				// sSelect += ' selected';
			// sSelect += '>'+InfosPaysRR[i]['Nom']+'</option>';
		// }
		// m+= sSelect;
		// m+= '</select></a></td></tr>';
		// m +='</td><td style="width:50%">';
		// logit(" end of InfosPaysRR[i]['Nom'] : "  + i + ' - ' + InfosPaysRR[i]['Nom'] );
		
		// sPays = 0;
		// m+= '<select name="comteChoisi" id="comteChoisi">';
		// var sSelect = '<option value="-1"  selected>Comté/Duché</option>';
		// for (var i = 0; i < InfosPaysRR.length; i ++) {
		//for (var i in InfosPaysRR[sPays]['Comtes']) {
			// logit("InfosPaysRR[sPays]['Comtes'][i]['Nom'] : " + i + ' - ' + InfosPaysRR[sPays]['Comtes'][i]['Nom'] );
			// if (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined")
				// while (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined") {
					// i++;
				// }
			// sSelect += '<option value="'+InfosPaysRR[sPays]['Comtes'][i]['Nom']+'"';
			// sSelect += '>'+InfosPaysRR[sPays]['Comtes'][i]['Nom']+'</option>';
		// }
		// m+= sSelect;
		// m+= '</select></a></td></tr>';
		// m +='<tr><td style="width:50%">';
		
		
		// sComte = 0;
		// m+= '<select name="VilleChoisi" id="VilleChoisi">';
		// var sSelect = '<option value="-1"  selected>Ville</option>';
		// for (var i = 0; i < InfosPaysRR[sPays][sComte].length; i ++) {
		//for (var i in InfosPaysRR[sPays][sComte]) {
			// logit("InfosPaysRR[sPays][sComte]['Villages'][i]['Nom'] : " + i + ' - ' +InfosPaysRR[sPays][sComte]['Villages'][i]['Nom'] );
			// if (typeof InfosPaysRR[sPays][sComte]['Villages'][i]['Nom'] == "undefined")
				// while (typeof InfosPaysRR[sPays][sComte]['Villages'][i]['Nom'] == "undefined") {
					// i++;
				// }
			// sSelect += '<option value="'+InfosPaysRR[sPays][sComte]['Villages'][i]['Nom']+'"';
			// sSelect += '>'+InfosPaysRR[sPays][sComte]['Villages'][i]['Nom']+'</option>';
		// }
		// m+= sSelect;
		// m+= '</select></a></td></tr>';
		
        // m += 'Ville : ' + '<input name="extVille" id="extVille" value="' + ExtVille + '"></td></tr>';//<td style="width:50%">';
		
        var m = '<h1>Guet pour un village</h1>' + '<form name="formulaire">';
        m += '<table><tr><td style="width:50%">';
        m += 'Ville : ' + '<input name="extVille" id="extVille" value="' + ExtVille + '"></td><td style="width:50%">';

		sPays = 0;
		m+= '<select name="comteChoisi" id="comteChoisi">';
		var sSelect = '<option value="-1"  selected>Comté/Duché</option>';
		for (var i in InfosPaysRR[sPays]['Comtes']) {
			if (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined")
				while (typeof InfosPaysRR[sPays]['Comtes'][i] == "undefined") {
					i++;
				}
			sSelect += '<option value="'+InfosPaysRR[sPays]['Comtes'][i]['Nom']+'"';
			sSelect += '>'+InfosPaysRR[sPays]['Comtes'][i]['Nom']+'</option>';
		}
		m+= sSelect;
		m+= '</select></a></td></tr>';
		
		m += '<tr><td style="width:50%">';//		m += '<tr><td style="width:50%">';
        m += 'Hier:<br>' + '<textarea name="extHier" id="extHier" cols="20" rows="5">' + ExtHier + '</textarea>';
        m += '</td><td style="width:50%">';
        m += 'Aujourd\'hui:' + '<textarea name="extJour" id="extJour" cols="20" rows="5">' + ExtJour + '</textarea>'
        m += '</td></tr></table>';
        m += '</form>' + '<br>';
        m += "<div id='progressionGuet'></div>";
        m += "<div id=\"progressbar\"><div id=\"indicator\"></div></div>";
        el.innerHTML = m;
        RRmenu.addSubfunction(el, Exterieur.controlerOK, "Controler");
        RRmenu.addSubfunction(el, Exterieur.controlerAnnuler, "Annuler");
    },
    controlerAnnuler: function () {
        Exterieur.controlerFin();
    },
    controlerOK: function () {
		LeRapport = "";
        ExtVille = document.formulaire.extVille.value;
        ExtHier = document.formulaire.extHier.value;
        ExtJour = document.formulaire.extJour.value;
		ExtComte = document.formulaire.comteChoisi.value
        if (document.formulaire.extVille.value == "") {
            if (confirm("Le nom de la ville est vide.\nConfirmez-vous l'abandon du contrôle?") == true) {
                Exterieur.controlerFin();
            } else
                return;
        }
        if ((ExtHier == undefined) || (ExtHier == "")) {
            alert("La liste d'hier est vide.");
            return;
        }
        if ((ExtJour == undefined) || (ExtJour == "")) {
            alert("La liste du jour est vide.");
            return;
        }
        if ((ExtComte == undefined) || (ExtComte == "-1")) {
            alert("Le Comté/Duché n'est pas défini.");
            return;
        }
        //faire la comparaison des deux listes
        var lHier = Exterieur.supEspace(ExtHier);
        var lJour = Exterieur.supEspace(ExtJour);

		// Etablissement des listes Hier et Jour
		if (nPresentsJour.length > 0)
	        nPresentsJour.splice(0, nPresentsJour.length);
        for (i = 0; i < lJour.length; i++) {
            if (lJour[i] != "")
                nPresentsJour.push(new Present(lJour[i], 0, 0, 0, 0));
        }
        //liste des départs
        var i;
        if (ADeparts.length > 0)
            ADeparts.splice(0, ADeparts.length);
        for (i = 0; i < lHier.length; i++) {
            if (ExtJour.indexOf(lHier[i]) == -1) {
                ADeparts.push(new Present(lHier[i], "", "", 0, 0));
                Exterieur.ajout(lHier[i]);
            }
        }
        //liste des arrivées
        if (AArrivees.length > 0)
            AArrivees.splice(0, AArrivees.length);
        for (i = 0; i < lJour.length; i++) {
            if (ExtHier.indexOf(lJour[i]) == -1) {
                AArrivees.push(new Present(lJour[i], "", "", 0, 0));
                Exterieur.ajout(lJour[i]);
            }
        }
        //faire la recherche de suspects
		Suspects.lire(); //nSuspects
        if (ASuspects.length > 0)
            ASuspects.splice(0, ASuspects.length);
        for (i = 0; i < lJour.length; i++) {
			//logit("Exterieur.controlerOK.nSuspects.length : " + nSuspects.length + " - lJour[i] : " + lJour[i]);
            if (Perso.siSuspect(lJour[i]) != -1) {
                ASuspects.push(lJour[i]);
                Exterieur.ajout(lJour[i]);
            }
        }
        Xidx = 0; nPointeurExt = 0; errorCnt = 0, errorPersoCnt=0;
		if (nPersosExt.length > 0)
	        nPersosExt.splice(0, nPersosExt.length);
        Exterieur.getFichePerso();
    },
    getFichePerso: function () {
        if (nPointeurExt < nPresentsJour.length) {
            Exterieur.progression("Contrôle des présents en cours " + Math.floor(nPointeurExt + 1) + "/" + nPresentsJour.length + " (" + nPresentsJour[nPointeurExt].Pseudo + ")",
                    (Math.floor(nPointeurExt + 1) / nPresentsJour.length) * 100);
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + (nPresentsJour[nPointeurExt].Pseudo), Exterieur.getPersoInfo)
        } else {
            Exterieur.getPerso();
        }
    },
    getPersoInfo: function (Src) {
        MessageErreur = "";
        if (Src.indexOf("Connexion perdue<") != 0) {
            if (Src.indexOf("Informations sur") != -1) {
                Exterieur.setPersoInfo(nPresentsJour[nPointeurExt].Pseudo, Src);
                nPointeurExt++;
                Exterieur.getFichePerso();
            }
            else if ((Src.indexOf("Une erreur") == 0) || (Src.indexOf("<br><br>Ce personnage n") == 0)) {
                nPointeurExt++;
                Exterieur.getFichePerso();
            }
            else {
                errorCnt++;
                if (errorCnt <= 3)
                    setTimeout(Exterieur.getFichePerso, 1500);
                else {
                    errorPersoCnt++;
                    if (errorPersoCnt <= 3) {
                        nPointeurExt++;
                        errorCnt = 0;
                        Exterieur.getFichePerso();
                    }
                    else {
                        MessageErreur = "<b>Erreur pendant le recensement.</b>";
                    }
                }
            }
        }
        else {
            MessageErreur = "<b>Erreur connexion perdue.</b>";
        }
    },
    setPersoInfo: function (zPseudo, Src) {
        var zVillage = "", zComte = "", zPays = "", zStatus = "", zNiveau = "", zEcu = 0, zChamp1 = 0, zChamp2 = 0, zMetier = 0, zPR = 0, zDate = 0; //logit("setPersoInfo (l.4427)- zPseudo : "+zPseudo+" - Src : "+Src);
        zVillage = Perso.getVillage(Src);
        zComte = Perso.getComte(Src);
        zPays = Perso.getPays(Src);
        zStatus = Perso.getStatus(Src);
        if (zStatus == "mort")
            nbPmort++;
        if (zStatus == "retraite")
            nbPretraite++;
        if (zStatus == "retranché")
            nbPretranche++;
        zDate = Perso.getStatusDate(Src);
//Victorien.,Thiers,Duché du Bourbonnais-Auvergne,,mort,1,0,00,I,0,0,0,18/11/1462
//Cersei...,Thiers,Duché du Bourbonnais-Auvergne,0,actif,41,37,83,V,2,1,0,27/11/1462
//logit("setPersoInfo (l.658) recap : "+zPseudo+","+zVillage+","+zComte+","+zPays+","+zStatus+","+zPR+","+zEcu+","+zNiveau+","+zMetier+","+zChamp1+","+zChamp2+","+zDate);
        nPersosExt.push(new Personnage(zPseudo, zVillage, zComte, zPays, zStatus, zPR, zEcu, zNiveau, zMetier, zChamp1, zChamp2, zDate));
        nbP++;
    },
    listeEtrangers: function () {
        var i = 0, z = "", nbVmort = 0, nbVretraite = 0, nbV = 0, nbEmort = 0, nbEretraite = 0, nbE = 0;
        z = Exterieur.unPseudoHtml(-1);
        for (i = 0; i < nPersosExt.length; i++) {
            if ((nPersosExt[i].Village != ExtVille) && (nPersosExt[i].Comte == ExtComte)) {
                z += Exterieur.unPseudoHtml(i);
                if (nPersosExt[i].Status == "mort")
                    nbVmort++;
                else if (nPersosExt[i].Status == "retraite")
                    nbVretraite++;
                nbV++;
            }
        }
        if (nbV !=0)
        	LeRapport += "<b>" + nbV + " voisins du " + ExtComte + " en visite</b> : (dont " + nbVmort + " morts et " + nbVretraite + " retraités)<br>" + z + "\n";
        z = Exterieur.unPseudoHtml(-1);
        for (i = 0; i < nPersosExt.length; i++) {
            if (nPersosExt[i].Comte != ExtComte) {
                z += Exterieur.unPseudoHtml(i);
                if (nPersosExt[i].Status == "mort")
                    nbEmort++;
                else if (nPersosExt[i].Status == "retraite")
                    nbEretraite++;
                nbE++;
            }
        }
        if (nbE !=0)
			LeRapport += "<br><b>" + nbE + " étrangers au " + ExtComte + " en visite</b> : (dont " + nbEmort + " morts et " + nbEretraite + " retraités)<br>" + z + "\n<br>";
		return (LeRapport);
    },
    unPseudoHtml: function (i) {
        var tdNom = '',
		tdVillage = ' ',
		tdComte = ' - ',
		tdPays = ' - <i>',
		tdStatus = '</i> ',
		ftd = ' ';
        if (i == -1)
            return("");
        var z = tdNom + Perso.lienHTML(nPersosExt[i].Pseudo) + ftd + tdVillage + nPersosExt[i].Village + ftd
		if (nPersosExt[i].Comte != ExtComte)
			z += tdComte + nPersosExt[i].Comte + tdPays + nPersosExt[i].Pays + tdStatus;
        if (nPersosExt[i].Status != "actif")
            z += "- <font color=#ff0000><b>" + nPersosExt[i].Status + "</b></font >";
        else
            z += "&nbsp;";
        z += "<br>";
        return(z);
    },
    ajout: function (x) {
        var i;
        for (i = 0; i < Xident; i++)
            if (Xident[i].Pseudo == x)
                return;
        Xident.push(new Present(x, "", "", 0, 0));
    },
    getPerso: function () {
        if (Xidx < Xident.length) {
            Exterieur.progression("Mouvements en cours " + Math.floor(Xidx + 1) + "/" + Xident.length + " (" + Xident[Xidx].Pseudo + ")",
                    (Math.floor(Xidx + 1) / Xident.length) * 100);
            SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/FichePersonnage.php', 'login=' + (Xident[Xidx].Pseudo), Exterieur.getInfo);
        } else {
            Exterieur.getFin();
        }
    },
    getInfo: function (Src) {
        MessageErreur = "";
        if (Src.indexOf("Connexion perdue<") != 0) {
            if (Src.indexOf("Informations sur") != -1) {
                Xident[Xidx].Status = Perso.getStatus(Src);
                Xident[Xidx].Village = Perso.getVillage(Src);
                Xident[Xidx].Comte = Perso.getComte(Src);
                Xident[Xidx].Pays = Perso.getPays(Src);
                Xident[Xidx].Ecu = parseInt(Perso.getEcu(Src));
                Xidx++;
                Exterieur.getPerso();
            }
            else if (Src.indexOf("<br><br>Ce personnage n") == 0) {
                Xidx++;
                Exterieur.getPerso();
            }
            else {
                errorCnt++;
                if (errorCnt <= 3)
                    setTimeout(Exterieur.getPerso, 1500);
                else {
                    errorPersoCnt++;
                    if (errorPersoCnt <= 3) {
                        Xidx++;
                        errorCnt = 0;
                        Exterieur.getPerso();
                    }
                    else {
                        MessageErreur = "<b>Erreur pendant l'identification.</b>";
                    }
                }
            }
        }
        else {
            MessageErreur = "<b>Erreur connexion perdue.</b>";
        }
    },
    getFin: function () {
        //remettre les infos de Xident dans les différentes listes
        Exterieur.setInfo(AArrivees);
        Exterieur.setInfo(ADeparts);
        //puis on continue
        Exterieur.controlerFaire();
    },
    setInfo: function (x) {
        var i, j;
        for (i = 0; i < x.length; i++) {
            for (j = 0; j < Xident.length; j++) {
                if (x[i].Pseudo == Xident[j].Pseudo) {
                    x[i].Status = Xident[j].Status;
                    x[i].Village = Xident[j].Village;
                    x[i].Comte = Xident[j].Comte;
                    x[i].Pays = Xident[j].Pays;
                    x[i].Ecu = Xident[j].Ecu;
                }
            }
        }
    },
    supEspace: function (s) {
        var r = s.split("\n"), i, x;
        for (i = 0; i < r.length; i++) {
            x = r[i].split(" ");
            r[i] = x[0];
            x = r[i].split("\t");
            r[i] = x[0];
        }
        r.sort();
        return(r);
    },
    controlerFaire: function () {
        var i;
        var el = document.getElementById("zoneTexte0");
        var m = '<h1>Guet pour un village</h1>';
        m += '<p>Ville : <b>' + ExtVille + ' (' + ExtComte + ')</b> le ' + lDate + '</p>';
        m += '<p><b>Arrivées :</b>';
        m += '<br>';
        if (AArrivees.length < 1)
            m += "Néant<br>";
        else
            for (i = 0; i < AArrivees.length; i++) {
				m += Exterieur.addHTML(AArrivees[i]);
			}
        m += '</p>';
        m += '<p><b>Départs :</b>';
        m += '<br>';
        if (ADeparts.length < 1)
            m += "Néant<br>";
        else
            for (i = 0; i < ADeparts.length; i++) {
                m += Exterieur.addHTML(ADeparts[i]);
			}
        m += '</p>';
        var n;
        m += '<p><b>Suspects:</b>';
        m += '<br>';
        if (ASuspects.length < 1)
            m += "Néant<br>";
        else
            for (i = 0; i < ASuspects.length; i++) {
                n = Perso.siSuspect(ASuspects[i]);
                m += Perso.lienHTML(ASuspects[i]) + ' : ' + nSuspects[n].Motif + '<br>';
            }
        m += '<br>';
		m += Exterieur.listeEtrangers();
        m += '</p>';
		m += Exterieur.analyseFaire();
        m += '<div id="boutons">&nbsp;</div>';
        el.innerHTML = m;
        RRmenu.addSubfunction(el, Exterieur.controlerExport, "Exporter");
        RRmenu.addSubfunction(el, Exterieur.controlerFin, "Terminer");
    },
    analyseFaire: function () {
        var r = "", i;
        if (nPersosExt.length > 0) {
            var nbP = 0, nbPmort = 0, nbPretraite = 0,
                nbH = 0, nbHmort = 0, nbHretraite = 0,
                nbV = 0, nbVmort = 0, nbVretraite = 0,
                nbE = 0, nbEmort = 0, nbEretraite = 0, sPersosExt = "<b>Liste des résidents actifs</b><br>";
            nbP = nPersosExt.length; 
            for (i = 0; i < nbP; i++) {
                if (nPersosExt[i].Status == "mort")
                    nbPmort++;
                if (nPersosExt[i].Status == "retraite")
                    nbPretraite++;
                if (nPersosExt[i].Village != ExtVille) {
                    if (nPersosExt[i].Comte != ExtComte) {
                        nbE++;
                        if (nPersosExt[i].Status == "mort")
                            nbEmort++;
                        if (nPersosExt[i].Status == "retraite")
                            nbEretraite++;
                    } else {
                        nbV++;
                        if (nPersosExt[i].Status == "mort")
                            nbVmort++;
                        if (nPersosExt[i].Status == "retraite")
                            nbVretraite++;
                    }
                } else {
					nbH++;
				    if (nPersosExt[i].Status == "actif")
						sPersosExt += Perso.lienHTML(nPersosExt[i].Pseudo) + '<br>';
                    if (nPersosExt[i].Status == "mort")
                        nbHmort++;
                    if (nPersosExt[i].Status == "retraite")
                        nbHretraite++;
                }
            }
            r +="<b> Synthèse pour " + ExtVille + " (" + ExtComte + ")</b><br>";
			r += Village.unStat("Présent", nbP, nbPmort, nbPretraite);
            r += Village.unStat("Résident", nbH, nbHmort, nbHretraite);
            r += Village.unStat("Étranger", nbE, nbEmort, nbEretraite);
            r += Village.unStat("Voisin", nbV, nbVmort, nbVretraite);
			r += '<p>' + sPersosExt + '</p>';
        }
		LeRapport += r;
        return(r);
    },
    addHTML: function (x) {
        var m = "";
        m += Perso.lienHTML(x.Pseudo);
        m += " (" + x.Village + ", " + x.Comte + " - <i>" + x.Pays + "</i>)";
        if (x.Status != "actif")
            m += "- <font color=#ff0000><b>" + x.Status + "</b></font >";
        m += '<br>';
        return(m);
    },
    controlerExport: function () {
        var i;
        var m = '[size=24]Guet pour : [b]' + ExtVille + '[/b][/size]\n';
        m += '\n[b]' + AArrivees.length + ' Arrivées:[/b]\n';
        if (AArrivees.length < 1)
            m += "Néant\n";
        else
            for (i = 0; i < AArrivees.length; i++) {
                m += Exterieur.addBBcode(AArrivees[i]);
            }
        m += '\n[b]' + ADeparts.length + ' Départs:[/b]\n';
        if (ADeparts.length < 1)
            m += "Néant\n";
        else
            for (i = 0; i < ADeparts.length; i++) {
                m += Exterieur.addBBcode(ADeparts[i]);
            }
        var n;
        m += '\n[b]' + ASuspects.length + ' Suspects:[/b]\n';
        if (ASuspects[0] == "R.A.S.")
            m += "Néant\n";
        else
            for (i = 0; i < ASuspects.length; i++) {
                n = Perso.siSuspect(ASuspects[i]);
                m += Perso.lienBBcode(ASuspects[i]) + ' : ' + nSuspects[n].Motif + '\n';
            }
        m += '\n';		
		m += BBc.fromHTML(LeRapport)

 		logit("m : " + m);
       ClipboardCopyTo(m);
        alert("Rapport disponible dans le presse-papiers.");
        return;
    },
    addBBcode: function (x) {
        var m = "";
        m += Perso.lienBBcode(x.Pseudo);
        m += " (" + x.Village + ", " + x.Comte + " - [i]" + x.Pays + "[/i])";
        if (x.Status != "actif")
            m += " [color=#ff0000][b]" + x.Status + "[/b][/color]";
        m += '\n';
        return(m);
    },
    controlerFin: function () {
        var el = document.getElementById("zoneTexte0");
        el.innerHTML = SaveIG;
    },
    addBouton: function (titre, fn) {
        document.getElementById("boutons").innerHTML += '&nbsp;<span id="' + titre + '">&nbsp;</span>';
        var xa = document.createElement("input");
        xa.setAttribute('type', 'button');
        xa.setAttribute('id', titre);
        xa.setAttribute('value', titre);
        xa.onclick = function () {
            fn();
            return false;
        }
        document.getElementById("boutons").appendChild(xa);
    },
    progression: function (t, z) {
        document.getElementById("progressionGuet").innerHTML = t;
        var indicator = document.getElementById("indicator");
        if (z == -1) {
            document.getElementById("progressbar").style.display = 'none';
            indicator.style.display = 'none';
        }
        else {
            document.getElementById("progressbar").style.display = 'block';
            indicator.style.display = 'block';
            indicator.style.width = (z * 3) + "px";
        }
    },
    lister: function () {
	alert("Non actif. En cours...");
    }
}
var mailFenetre, mailDest = "", mailObj = "", mailTexte = "", mailList = new Array, mailIdx = -1;
var MailRR = {
    debut: function (d) {
				
    },
    liste: function () {
        var z;
		 mailDest = "";
        for (i = 0; i < nPersos.length; i++) {
            z = monPopup.document.getElementById("mp" + nPersos[i].Pseudo);
            if (z != null) {
                if (z.checked == true)
                    mailDest += (mailDest.length > 0 ? ";" : "") + nPersos[i].Pseudo;
            }
        }
        logit("MailRR.liste\n" + mailDest);
		MailRR.prepMailOne(mailDest);
    },
    prepMailOne: function (d) {
        mailDest = d;
        if (mailList.length > 0)
            mailList.splice(0, mailList.length);
		mailList = mailDest.split(';');logit ("mailList.length : " + mailList.length);
        mailObj = "";
        mailTexte = "";
        mailIdx = -1;
	    mailFenetre = RRpopup.init("Mailing", 0);
		RRpopup.setMessage(mailFenetre, "<b><u>Mailing</u></b>");
		RRpopup.setMessage(mailFenetre, "adressé à " + " présents dans le village.");
		
		/*var captchaVal = "****";
		//<form method="post" action="http://www.lesroyaumes.com/NouveauCourrier.php" target="djg_courrier"> Destinataire : <input type="text" name="destinataire1" value="" size=8 > Code de s&eacute;curit&eacute; : <input type="text" name="CodeSecurite" value="" size=4 > Sujet : <input type="text" name="titre3" value="" size=15 ><input type="submit" name="post" value="Envoyer" /><br /><textarea align="left" name="texte2" rows="8" cols="150" style="width:900px"></textarea></form>*/
		
		var zzmailTxt =  "<title>Nouveau Mailing</title>";
		zzmailTxt += "<script type=text/javascript language=javascript>function change_code(){ var d=new Date();document.getElementById('ImgSecurite').src='http://www.lesroyaumes.com/codeSecurite.php?'+d.getTime();}</script>";
//		zzmailTxt += "<form method=post action='http://www.lesroyaumes.com/NouveauCourrier.php'>";
		zzmailTxt += "  <div class=pop_up_courrier_zone_texte>";
		zzmailTxt += "    <div class=pop_up_courier_texte_cadre>";
		zzmailTxt += "      <div class=pop_up_courrier_texte_gauche>";
		zzmailTxt += "		<div class=zone_texte_haut_coin_gauche></div>";
		zzmailTxt += "		<div class=pop_up_courrier_texte_repeat_gauche></div>";
		zzmailTxt += "		<div class=zone_texte_bas_coin_gauche></div>";
		zzmailTxt += "    </div>";
		zzmailTxt += "    <div class=pop_up_courrier_texte_centrale>";
		zzmailTxt += "		<div class=pop_up_courrier_texte_centrale_top>";
		zzmailTxt += "		<div class=zone_texte_centrale_coin_haut></div>";
		zzmailTxt += "	  </div>";
		zzmailTxt += "	  <div class=pop_up_courrier_texte_centrale_middle>";
		zzmailTxt += " 	  <table border=0 bordercolor=none cellpadding=0 cellspacing=0>";
		zzmailTxt += "    <tbody>";
		zzmailTxt += "      <tr>";
		zzmailTxt += "		<td width=138>Titre</td>";
		zzmailTxt += "		<td width=342 colspan=2><input name=subject size=50 maxlength=50 id=fond_courrier type=text></td>";
		zzmailTxt += "      </tr>";
		zzmailTxt += "      <tr>";
		zzmailTxt += "		<td colspan=3><textarea name=message rows=15 cols=85 wrap=virtual id=fond_courrier align=left></textarea></td>";
		zzmailTxt += "      </tr>";
		zzmailTxt += "      <tr>";
		zzmailTxt += "		<td colspan=3>Recopiez le code de sécurité ci-dessous afin de pouvoir envoyer ce message.</td>";
		zzmailTxt += "      </tr>";
		zzmailTxt += "      <tr>";
		zzmailTxt += "		<td><img src='http://www.lesroyaumes.com/codeSecurite.php' id=ImgSecurite style=border:1px solid grey; width:128px; height:45px;></td>";
		zzmailTxt += "		<td colspan=2><input name=crypt onFocus=change_code(); maxlength=4 size=4 type=text>";
		zzmailTxt += " 		<input name=Envoyer value=Envoyer type=submit></td>";
		zzmailTxt += "      </tr>";
		zzmailTxt += "      <tr>";
		zzmailTxt += "		<td valign=top>Destinataires</td>";
		zzmailTxt += "		<td colspan=2><textarea name=send_to cols=15 rows=3 readonly id=send_to value='' type=text></textarea></td>";
		zzmailTxt += "      </tr>";
		zzmailTxt += "    </tbody>";
		zzmailTxt += "  </table>";
		zzmailTxt += "</div></div></div></div>";
//		zzmailTxt += "</form>";
		zzmailTxt += "</div>";
		zzmailTxt += "Pour la suite vous devez cliquer sur le lien suivant:<br />";
		zzmailTxt += "<a href='http://www.lesroyaumes.com/NouveauCourrier.php' target='djg_courrier'>Nouveau courrier</a><br>";
		
		/*		var zzmailTxt  = "<title>Nouveau Mailing</title>";
		zzmailTxt += "<script type='text/javascript' language='javascript'>function change_code(){ var d=new Date();document.getElementById('ImgSecurite').src=\"http://www.lesroyaumes.com/codeSecurite.php?\"+d.getTime();}</script>";
		zzmailTxt += "<form method='post' action='http://www.lesroyaumes.com/NouveauCourrier.php'>";
		zzmailTxt += "  <div class='pop_up_courrier_zone_texte'>";
		zzmailTxt += "    <div class='pop_up_courier_texte_cadre'>";
		zzmailTxt += "      <div class='pop_up_courrier_texte_gauche'>";
		zzmailTxt += "        <div class='zone_texte_haut_coin_gauche'></div>";
		zzmailTxt += "        <div class='pop_up_courrier_texte_repeat_gauche'></div>";
		zzmailTxt += "        <div class='zone_texte_bas_coin_gauche'></div>";
		zzmailTxt += "      </div>";
		zzmailTxt += "      <div class='pop_up_courrier_texte_centrale'>";
		zzmailTxt += "        <div class='pop_up_courrier_texte_centrale_top'>";
		zzmailTxt += "          <div class='zone_texte_centrale_coin_haut'></div>";
		zzmailTxt += "        </div>";
		zzmailTxt += "        <div class='pop_up_courrier_texte_centrale_middle'>";
		zzmailTxt += "          <table border='1' bordercolor='none' cellpadding='0' cellspacing='0'>";
		zzmailTxt += "            <tbody>";
		zzmailTxt += "              <tr>";
		zzmailTxt += "                <td class='td_sans'>Titre</td>";
		zzmailTxt += "                <td class='td_sans' colspan='2'><input name='titre3' size='30' id='fond_courrier' type='text'></td>";//style='width:18em' 
		zzmailTxt += "              </tr>";
		zzmailTxt += "              <tr>";
		zzmailTxt += "                <td class='td_sans' colspan='3'><textarea name='texte2' rows='15' cols='85' wrap='virtual' id='fond_courrier' align='left'></textarea></td>";
		zzmailTxt += "              </tr>";
		zzmailTxt += "              <tr>";
		zzmailTxt += "                <td class='td_sans' colspan='3'>Recopiez le code de sécurité ci-dessous afin de pouvoir envoyer ce message.</td>";
		zzmailTxt += "              </tr>";
		zzmailTxt += "              <tr>";
		zzmailTxt += "                <td class='td_sans'><img src='http://www.lesroyaumes.com/codeSecurite.php' id='ImgSecurite' style='border:1px solid grey; width:128px; height:45px;'></td>";
		zzmailTxt += "                  <td class='td_sans' colspan='2'><input name='CodeSecurite' onfocus='change_code();' maxlength='4' size='4' type='text'>";
		zzmailTxt += "                  <input name='Envoyer' value='Envoyer' type='submit'></td>";
		zzmailTxt += "              </tr>";
		zzmailTxt += "              <tr>";
		zzmailTxt += "                <td class='td_sans'>Destinataires</td>";
		zzmailTxt += "                <td class='td_sans' colspan='2'><textarea name='destinataire1' value='' rows='15' cols='15' id='fond_courrier' type='text'></textarea></td>";// style='width:18em'
		zzmailTxt += "              </tr>";
		zzmailTxt += "            </tbody>";
		zzmailTxt += "          </table>";
		zzmailTxt += "        </div>";
		zzmailTxt += "      </div>";
		zzmailTxt += "    </div>";
		zzmailTxt += "  </div>";
		zzmailTxt += "</form>";
		zzmailTxt += "</div>";*/

        RRpopup.setMessage(mailFenetre, zzmailTxt);
		mailFenetre.document.getElementById("Envoyer").onchange = function () {
            MailRR.prepMailTwo();
            return false;
        };	
		RRpopup.fermeture(mailFenetre);		
//        mailFenetre = window.open('NouveauCourrier.php', 'mail', 'top=0px, left=0px, width=600px, height=600px, resizable=no, toolbar=no, scrollbars=no, status=no, menubar=no, titlebar=no, dependent=yes');
        setTimeout(MailRR.faire, 1500);
    },
	prepMailTwo: function () {
		var mailTitle = mailFenetre.document.getElementsByName('subject')[0].value;
		var mailText = mailFenetre.document.getElementsByName('message')[0].value;
		var zmailDest = mailFenetre.document.getElementsByName('send_to')[0].value;
		mailDest = zmailDest.split(',');
		var CodeSecurite = mailFenetre.document.getElementsByName('crypt')[0].value;
		// mailDest : tableau des destinataires
		for (i = 0; i < mailDest.length; i++) {	
			zzMailtxt = "<form method=post action=http://www.lesroyaumes.com/NouveauCourrier.php target=djg_courrier> Destinataire : <input type=text name=destinataire1 value='" + mailDest[i] + "' size=30 >&nbsp;";
			zzMailtxt += "Code de s&eacute;curit&eacute; : <input type=text name=CodeSecurite value='" + CodeSecurite + "' size=4 >&nbsp;";
			zzMailtxt += "Sujet : <input type=text name=titre3 value='" + mailTitle + "' size=14 >&nbsp;<input type=submit name=post value=Envoyer /><br>";
			zzMailtxt += "<textarea align=left name=texte2 rows=8 cols=150 style=width:300px>" + mailText + "</textarea></form>";
		}
        RRpopup.setMessage(mailFenetre, zzmailTxt);
	},
    faire: function () {
		logit("mailFenetre.document.getElementsByName('send_to')[0].value : " + mailFenetre.document.getElementsByName('send_to')[0].value);
        mailFenetre.document.getElementsByName('send_to')[0].value = mailDest;//.split(';');
    }
}

var Armee = {
    commandant: function () {
        alert("En cours de développement");
    },
    intendant: function () {
        SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipal.php', 'l=8', Armee.intendantDebut);
    },
    intendantDebut: function (Src) {
        if (Src.indexOf("la logistique") == -1) {
            alert("Vous n'êtes pas en charge de la logistique d'une armée.");
            return;
        }
        LeRapport = "";
        RRoperation = "Rapport intendant armée";
        var x = HtmlToString(getData(Src, "textePage[4]['Texte'] = '", "textePage[4][1]"));
        x = str_replace(x, "<p>", "\n");
        x = str_replace(x, "</p>", "\n");
        x = str_replace(x, "<br>", "\n");
        var l = x.split("\n"), i, t = "", u = "";
        for (i = 0; i < l.length; i++) {
            if (l[i].indexOf("Encombrement") != -1)
                t += l[i] + "\n";
            if (l[i].indexOf("inventaire_contenu") != -1)
                u += "\n" + l[i];
        }
        t = str_replace(t, "</p>", "\n");
        u = str_replace(u, "<div", "\n<div");
        l = u.split("\n");
        u = "";
        for (i = 0; i < l.length; i++) {
            if (l[i].indexOf("_nbre") != -1)
                u += getData(l[i], ">", "<");
            else if (l[i].indexOf("_descriptif") != -1)
                u += " " + getData(l[i], ">", "<") + "\n";
        }
        LeRapport = t + "\n[b]Inventaire:[/b] " + u;
        ClipboardCopyTo(HtmlToString(LeRapport));
        RRoperation = "";
        alert("Rapport disponible dans le presse-papiers.");
    },
    tresorier: function () {
        alert("En cours de développement");
    }
}

var getMandat = {
	debut: function() {
		// if (QuelOnglet() != "Mon personnage") {
			// SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=0', getMandat.faire); //Mon Personnage
			// return;
		// }
		// getMandat.faire(document.getElementsByTagName("body")[0].innerHTML);
		SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=0', getMandat.faire, false); //Mon Personnage
	},
	faire: function(Src) {
		/*elementsTextuelsNavigation[0][4]['Nom'] = 'Vos charges et vos responsabilit&eacute;s';
		  elementsTextuelsNavigation[0][4][1]['Nom'] = 'Mandat de Duché du Bourbonnais-Auvergne'; */
		logit("getMandat.faire avant : mandat présent - isMandat : " + isMandat);		
		isMandat = (Src.indexOf("[0][4][1]['Nom']") != -1);
		logit("getMandat.faire après : mandat présent - isMandat : " + isMandat);
//		if (Src.indexOf("[0][4][1]['Nom']") != -1) {  // mandat présent			
//			x = "Vous avez un mandat en attente.";		
//			isMandat = true; logit("getMandat.faire après : mandat présent - isMandat : " + isMandat);	
//		} 
        //getMandat.fin();
	},
    fin: function () {
    }
	// faire: function(Src) {
		// /*elementsTextuelsNavigation[0][4]['Nom'] = 'Vos charges et vos responsabilit&eacute;s';
		  // elementsTextuelsNavigation[0][4][1]['Nom'] = 'Mandat de Duché du Bourbonnais-Auvergne'; */
		// var x = ""; var isMandat = false ;
		// logit("getMandat.faire avant : mandat présent - isMandat : " + isMandat);		
		// if (Src.indexOf("[0][4][1]['Nom']") != -1) {  // mandat présent			
			// x = "Vous avez un mandat en attente.";		
			// isMandat = true; logit("getMandat.faire après : mandat présent - isMandat : " + isMandat);	
		// } 
		// return(isMandat);
	// }
}
var RRmenu = {
    initStyle: function () {
        var insertStyle = window.document.getElementById("bandeau_jeux");
        var menuStyle = document.createElement("style");
        var s = "";
        s += "\
			#nav1 {width: 100px;}\n\
			#nav1 ul {padding: 0px; width: 100px; border:1px solid; margin:0px;}\n\
			#nav1 li.smenu {margin-left:Opx;padding-left:0px;background: yellow;}\n\
			#nav1 ul li {margin:Opx;position:relative; list-style: none; border-bottom:1px solid;}\n\
			#nav1 ul ul {margin:Opx;position: absolute; top: 0; left: 100px; display:none}\n\
			#nav1 li a {text-decoration: none;}\n\
			#nav1 ul.n1 li.smenu:hover ul.n2 {margin:Opx;padding:0px;display:block;}\n\
			#nav1 ul.n2 li.smenu:hover ul.n3 {margin:Opx;padding:0px;display:block;}\n";
        menuStyle.innerHTML = s;
        document.body.insertBefore(menuStyle, insertStyle);
    },
    init: function () {
         /************ Détection des mandats ******************/
//  		logit("RRmenu.init.isMandat avant : " + isMandat);
//		var isMandat = false;
//  	logit("RRmenu.init.isMandat avant2 : " + isMandat);	
//		isMandat = 
//		SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=0', getMandat.faire, false); //Mon Personnage
//		getMandat.debut();
//  	logit("RRmenu.init.isMandat après : " + isMandat);	
//		pausecomp(3000);
//  	logit("RRmenu.init.isMandat après2 : " + isMandat);	
//  		logit("RRmenu.init.isMandat avant4 : " + isMandat);	
	 	//elementsTextuelsNavigation[0][4]['Nom'] = 'Vos charges et vos responsabilit&eacute;s';
		//elementsTextuelsNavigation[0][4][1]['Nom'] = 'Mandat de Duché du Bourbonnais-Auvergne';
        /************ Fin Détection des mandats ******************/

		var zz = document.URL; //logit("RRmenu.init(l.5463) zz : " + zz);
        var rzz = zz.indexOf("Ajax.php", 0);
        var pv1, pv2, zvs;
		/* Init loginJoueur = "ulrica" */		
        var zva = parent.window.document.body.innerHTML;//logit("RRmenu.initzva : '" + zva + "'");
		pv1 = zva.indexOf("loginJoueur = \"")+15;
		pv2 = zva.indexOf("\"", pv1);
		PersoLogin = zva.substring(pv1, pv2);
		PersoPrefs = zva.substring(pv1, pv2); 
		//logit("RRmenu.init PersoLogin : '" + PersoLogin + "' PersoPrefs : " + PersoPrefs + "'");
		zva = "";
 		/* Fin Init loginJoueur = "ulrica" */		
       var zv = parent.window.document.getElementsByClassName("horloge")[0], zvs;
        if (zv == undefined) {
		    zv=window.document.body.innerHTML;
			zvs = getData(zv, "horloge", "</div>");
        }
        else
			var zvb = parent.window.document.body.innerHTML;
        zvs = zv.innerHTML;
        if (zvs.indexOf(" chemins") == -1) {
			//Thiers (Duché du Bourbonnais-Auvergne)  
			//Reims, capitale du Duché de Champagne (Domaine Royal) 
			//Bordeaux, capitale du Duché de Guyenne
            pv1 = zvs.indexOf("<div>") + 5, pv2 = zvs.indexOf(", ");
            if (pv2 == -1) {
                pv2 = zvs.indexOf(" (");
                mVille = zvs.substring(pv1, pv2);
                pv1 = zvs.indexOf(" (", pv2) + 2;
                pv2 = zvs.indexOf(")", pv1);
                mDuche = zvs.substring(pv1, pv2);
            } else {
                mVille = zvs.substring(pv1, pv2);
                pv1 = zvs.indexOf(", ", pv2) + 14;
                pv2 = zvs.indexOf("\n", pv1);
                mDuche = zvs.substring(pv1, pv2);
            }
        } else {
            mVille = "Sur les chemins";
            mDuche = zvs.substring(0, zvs.indexOf("<span>"));
        }
        pv1 = zvs.indexOf("<span>", pv2) + 7;
        pv2 = zvs.indexOf("</span>", pv1); 
        lDate = zvs.substring(pv1, pv2); 
        mDate = stringToDate(lDate);

        /**************** Init prefs  ******************/
		this.getUserPrefs();		
 //		logit("RRmenu.init.Fin Init prefs.lastHier : '" + lastHier + "' lastRapport: '" + lastRapport + "' PersoLogin : '" + PersoLogin + "' PersoPrefs : " + PersoPrefs + "' MandatVu : " + MandatVu + " - MandatOH : " + MandatOH + " - MandatH : " + MandatH );
       /************ Fin Init prefs  ******************/

//   		logit("RRmenu.init.isMandat l.5515 : " + isMandat);	

		/**************** Initialisation date veille ******************/
		// var lgMois = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); 31/05/1464
		var zD = 0;
		dHier = Number (mDate.substring(0, 2)) -1;
		if (dHier ===0) {
			zD = 1;
			var dumDate=getNbJours(Number(mDate.substring(3, 5)-2));
			var zMonth = Number(mDate.substring(3, 5)-1);
			var zMonth2 = zMonth.toString();
			if (zMonth2.length === 1)
				zMonth2 = "0" + zMonth2;
			var zDate = dumDate + '/' + zMonth2 + '/' + mDate.substring(6, 10) ;
			dHier = zDate;
		}
		if (zD) 
			hHier = dHier;
		else
			hHier = dHier + mDate.substring(2, mDate.length);
 // 		logit("RRmenu.init.Fin Init prefs.hHier : '" + hHier + "' mDate: '" + mDate + "'");
       /************ Fin Initialisation date veille ******************/
		
//"|undefined|27/06/1463|28/06/1463#|Maréchal|Reims#Ulrica|0#20|15|15|19|10|10 |14|5|6|9|5#Miches de pain|30øFruits|5øSacs de maïs|30øMorceaux de viande|5øSacs de blé|10øSacs de farine|5øBas pour femme|2ø#00/00/0000#0#0"

        /**************** Mise à jour des dates en Prefs ******************/
		hPersos=mDate;
		PersoJour=mDate;

        /************ Fin Mise à jour des dates en Prefs ******************/
//		logit("RRmenu.init.avant chargement.lastHier : " + lastHier + " lastRapport: " + lastRapport );
		// logit("RRmenu.init.isMandat l 5573 avant : " + isMandat); 
		// SendXMLHttpRequest('GET', 'http://www.lesroyaumes.com/EcranPrincipalAjax.php', 'l=2&a=0', getMandat.faire); //Mon Personnage
//		getMandat.debut();			
		// logit("RRmenu.init.isMandat l 5575 après : " + isMandat);
		Fichier.charger();
		Fichier.chargerHier();
		Suspects.lire();
		if (PersoPrefs != "")
			this.setUserPrefs();		
		if (zz.indexOf("Ajax.php", 0) == -1) {
            this.initStyle();
            var b = document.body.innerHTML;//logit ("RRmenu.init.b : " + b);
            var x = '<table><tr><td><div id="bandeauRR"><br></div></td></tr>\n\
<tr><td valign="top" width="12%">\n\
	<div style="background-color: #FFFFDF;font-size:12px;opacity: 0.7" class="nav1"><p align="center"><b>RReasy ' + version + '</b></p><ul id="menuRR" class="nav1" style="padding-left:5px;"></ul><br></div></td>\n\
<td><div id="igRR" width="88%"></div></td></tr></table>';
            document.body.innerHTML = x;
            document.getElementById("igRR").innerHTML = b;
            this.setMenuRR();
        } else {
            this.addfnRR();
        }
    },
	setUserPrefs: function () {
		var zz = hPersos + '|' + hHier + '|' + lastHier + '|' + lastRapport + '#';
		zz += PersoJour + '|' + PersoGrade + '|' + PersoGarnison + '|' + PersoEscouade + '|' + PersoMission + '#';
		zz += PrefsAlerts + '#' + PersoAlerts + '#' + MarcheSeuil + '#' + MandatVu + '#' + MandatOH + '#' + MandatH;
//		logit("setUserPrefs.zz : " + zz);
		if (localStorage) {
			localStorage["Prefs_" + PersoPrefs] = zz;
		} else {
			alert("localStorage indisponible");
		}
	},
	getUserPrefs: function () {
		var yy, zz, zv;
		if (localStorage) {
			zv=localStorage["Prefs_" + PersoPrefs];
		} else {
			alert("localStorage indisponible");
		}
		if ((zv != "") && (zv!=undefined)) {
			var zz = zv.split('#');
			yy = zz[0].split('|');
			hPersos = yy[0];
			hHier = yy[1];
			lastHier = yy[2];
			lastRapport = yy[3];
			yy = zz[1].split('|');
			PersoJour = yy[0];
			PersoGrade = yy[1];
			PersoGarnison = yy[2];
			PersoEscouade = yy[3];
			PersoMission = yy[4];
			PrefsAlerts = zz[2];
			PersoAlerts = zz[3];
			MarcheSeuil = zz[4]; 
			MandatVu = zz[5]; 
			MandatOH = zz[6]; 
			MandatH = zz[7]; 
		} else {
			MarcheSeuil="|ø";
			var zz = hPersos + '|' + hHier + '|' + lastHier + '|' + lastRapport + '#';
			zz += PersoJour + '|' + PersoGrade + '|' + PersoGarnison + '|' + PersoEscouade + '|' + PersoMission + '#';
			zz += PrefsAlerts + '#' + PersoAlerts + '#' + MarcheSeuil + '#' + MandatVu + '#' + MandatOH + '#' + MandatH;
			RRmenu.setUserPrefs();
		}
	},
    setMenuRR: function () {
//		logit("setMenuRR.isMandat : " + isMandat);
        var el = document.getElementById("menuRR");
//		logit("setMenuRR.el : " + el);
        if (el != null) {

            this.addNiveau("menuRR", "n2", "?l=2", "Moi");
            this.addMenuItem("Moi", "?l=2&a=0", "Personnage");
            this.addMenuItem("Moi", "?l=2&a=1", "Inventaire");
            this.addMenuItem("Moi", "?l=2&a=2", "Courrier");
            this.addMenuItem("Moi", "?l=2&a=3", "Événements");			
//			m+="<li><a href='#' onClick='var perso =  prompt(\"Entrez le nom du personnage à rechercher\", \"Nom du personnage\");popupPerso (\"FichePersonnage.php?login=\" + perso);'>Rechercher un ami</a></li>";
//			if (isMandat)
//				this.addMenuItem("Moi", "?l=2&a=0", "<font color=red><b>Mandats en attente</b></font>");				
//				<a class="lien_default" href="#" onclick="javascript:return navigationEnProfondeur(4);">Vos charges et vos responsabilit&eacute;s</a>
//				this.addMenuItem("Moi", "?l=2&a=0", "<font color=red>Mes mandats</font>");				
			this.addNiveau("Moi", "n3", "?l=1&a=1", "Propriété");
			this.addMenuItem("Propriété", "?l=1&a=2", "Champ 1");
            this.addMenuItem("Propriété", "?l=1&a=3", "Champ 2");
            this.addMenuItem("Propriété", "?l=1&a=4", "Atelier");
			this.addFinNiveau2("Moi");
            this.addFinNiveau("Moi");
            this.addNiveau("menuRR", "n2", "?l=8", "Hors la ville");
            this.addMenuItem("Hors la ville", "?l=8&a=0", "Carte");
            this.addMenuItem("Hors la ville", "?l=8&a=1", "Travaux");
            this.addMenuItem("Hors la ville", "?l=8&a=2", "Groupes et armées");
            this.addMenuItem("Hors la ville", "?l=8&a=3", "Informations");
            this.addMenuItem("Hors la ville", "?l=8&a=4", "Mon groupe");
            this.addFinNiveau("Hors la ville");
            if (this.enVille() == "Village") {
                this.addNiveau("menuRR", "n2", "?l=0", "Village");
                this.addNiveau("Village", "n3", "?l=3", "Mairie");
                this.addMenuItem("Mairie", "?l=3&a=0", "Informations");
                this.addMenuItem("Mairie", "?l=3&a=1", "Elections");
                this.addMenuItem("Mairie", "?l=3&a=2", "Offres d'emploi");
                this.addMenuItem("Mairie", "?l=3&a=3", "Marché foncier");
                this.addMenuItem("Mairie", "?l=3&a=4", "Bureau du maire");
                this.addMenuItem2("Mairie", Presence.liste, 'Liste des présents');
                this.addFinNiveau2("Mairie");
                this.addMenuItem("Village", "?l=5", "Taverne");
                this.addMenuItem("Village", "?l=6", "Marché");
                this.addMenuItem("Village", "?l=9", "Ressource");
                this.addMenuItem("Village", "?l=31", "Fouilles");
                this.addMenuItem("Village", "?l=15", "Lice");
                this.addNiveau("Village", "n3", "?l=0", "Église");
                this.addMenuItem("Église", "?l=4&a=0", "Paroisse");
                this.addMenuItem("Église", "?l=4&a=2", "Retraite");
                this.addFinNiveau2("Église");
				this.addFinNiveau("Village");
            } else {
                this.addMenuItem("Hors la ville", "?l=5", "Feux de camp");
            }
            this.addNiveau("menuRR", "n2", "?l=7&a=0", "Sénéchaussée");
            this.addMenuItem("Sénéchaussée", "?l=7&a=0", "Chateau");
            this.addMenuItem("Sénéchaussée", "?l=7&a=1", "Tribunal");
            this.addMenuItem("Sénéchaussée", "?l=7&a=2", "Université");
            this.addFinNiveau("Sénéchaussée");
            this.addNiveau("menuRR", "n2", "?l=0", "Soldat");
            this.addMenuItem2("Soldat", Presence.debut, 'Présence');
            this.addMenuItem2("Soldat", RapportSoldat.debut, 'Rapport');
            this.addMenuItem2("Soldat", Dossier.debut, 'Dossier');
            this.addNiveau("Soldat", "n3", "?l=8", "Armée");
            this.addMenuItem2("Armée", Armee.commandant, 'Commandant');
            this.addMenuItem2("Armée", Armee.intendant, 'Intendant');
            this.addMenuItem2("Armée", Armee.tresorier, 'Trésorier');
            this.addFinNiveau2("Armée");
            this.addFinNiveau2("Soldat");
            this.addMenuItem2("menuRR", Apropos, 'A propos...');
            this.addFinNiveau("RReasy");
        }
    },
    addNiveau: function (niveau1, classe, adresse, nom) {
        var e = window.document.getElementById(niveau1);
        var xli = document.createElement("li");
        xli.setAttribute('style', 'padding-left:5px;');
        if (adresse != null) {
            var xe = document.createElement("a");
            xe.setAttribute('href', adresse);
            xe.innerHTML = nom;//+(classe!=null?' =>':'');
            xli.appendChild(xe);
        } else {
            xli.innerHTML = nom + (classe != null ? ' =>' : '');
        }
        if (classe != null) {
            xli.setAttribute("class", "smenu");
            var xlb = document.createElement("ul");
            xlb.setAttribute('class', classe);
            xlb.setAttribute('style', 'padding-left:5px;');
            xlb.setAttribute('id', nom);
            xli.appendChild(xlb);
        }
        e.appendChild(xli);
    },
    addMenuItem: function (menu, lien, nom) {
        var e = window.document.getElementById(menu);
        var xli = document.createElement("li");
        xli.setAttribute('style', 'margin-left:10px;')
        if (lien != null) {
            var xe = document.createElement("a");
            xe.setAttribute('href', lien);
            xe.innerHTML = nom;
            xli.appendChild(xe);
        } else {
            xli.innerHTML = nom;
        }
        e.appendChild(xli);
    },
    addMenuItem2: function (menu, procedure, nom) {
        var e = window.document.getElementById(menu);
        var xli = document.createElement("li");
        xli.setAttribute('style', 'margin-left:10px;')
        if (procedure != null) {
            var xe = document.createElement("a");
            xe.setAttribute('href', '#');
            xe.onclick =
                    function () {
                        procedure();
                        return false;
                    };
            xe.innerHTML = nom;
            xli.appendChild(xe);
        } else {
            xli.innerHTML = nom;
        }
        e.appendChild(xli);
    },
    addFinNiveau: function (n) {
        var e = document.getElementById(n);
        //e.innerHTML+='<br>';
        return;
    },
    addFinNiveau2: function (n) {
        var e = document.getElementById(n);
        //e.innerHTML+='<br>';
        return;
    },
    enVille: function () {
        // repérage si dans un village ou sur les chemin
        var zv = document.getElementsByClassName("horloge")[0], zvs;
        if (zv == undefined) {
            zv=parent.document.getElementsByClassName("horloge")[0];
            zvs=zv.innerHTML;
        }
        else
            zvs = zv.innerHTML;
        //récupération de la ville, du duché et de la date
        if (zvs.indexOf(" chemins") == -1) { //if (zvs.indexOf(" (") != -1) {
//Thiers (Duché du Bourbonnais-Auvergne)  
//Reims, capitale du Duché de Champagne (Domaine Royal) 
//Bordeaux, capitale du Duché de Guyenne
            var pv1 = zvs.indexOf("<div>") + 5, pv2 = zvs.indexOf(", ");
            if (pv2 == -1) {
                pv2 = zvs.indexOf(" (");
                mVille = zvs.substring(pv1, pv2);
                pv1 = zvs.indexOf(" (", pv2) + 2;
                pv2 = zvs.indexOf(")", pv1);
                mDuche = zvs.substring(pv1, pv2);
            } else {
                mVille = zvs.substring(pv1, pv2);
                pv1 = zvs.indexOf(", ", pv2) + 14;
                pv2 = zvs.indexOf("\n", pv1);
                mDuche = zvs.substring(pv1, pv2);
            }
        } else {
            mVille = "Sur les chemins";
            mDuche = zvs.substring(0, zvs.indexOf("<span>"));
        }
        var elTowns = document.getElementsByClassName("btns btnVillage")[0];
        var mVillage = "";
        if (elTowns != null) {
            mVillage = elTowns.getElementsByClassName("btnsMenu_Texte")[0].innerHTML;
        }
        return(mVillage);
    },
    addfnRR: function () {
        var xBarre;
        if (document.getElementById("chaineNavigation") === null)
            return;
        xBarre = document.getElementById("chaineNavigation").innerHTML;//onglet actif
        if (xBarre != null) {
            if (xBarre == "Groupes et armées")
                this.addFonctionGroupes();
            if (xBarre == "Mes événements")
                this.addFonctionEvenements();
            if (xBarre == "Le tribunal")
                this.addFonctionTribunal();
            if (xBarre == "Prochain duel")
                this.addFonctionDuel();
        }
        xBarre = document.getElementsByClassName("texteOnglet")[0].innerHTML;//premier onglet
        if (xBarre != null) {
            if (xBarre == "Mon personnage")
                this.addFonctionPerso();
            if (xBarre == "La mairie")
                this.addFonctionMairie();
            if (xBarre == "Le marché")
                this.addFonctionMarche();
            //if (xBarre == "Ma paroisse") this.addFonctionEglise();
            if (xBarre == "Mon profil")
                this.addFonctionProfil();
        }
    },
    addFonctionMairie: function () {
        var xzone = null;
        if (document.getElementById("zoneTexte0").innerHTML != null) {
            xzone = document.getElementsByClassName("illustrationImage")[0];
            var xz1 = xzone.getElementsByTagName("img")[0];
            var xe1 = document.createElement("a");
            xe1.setAttribute('href', '#');
            xe1.onclick =
                    function () {
                        Recensement.debut();
                        return false;
                    }
            ;
            xe1.innerHTML = "<img alt=\"%Villageois%\" src=\"images/mairie.jpg\">";
            xz1.parentNode.replaceChild(xe1, xz1);
            //fonctions IG
            xzone = document.getElementById("onglet0Panel").getElementsByClassName("element elementRepeat")[0];
            var x1 = document.createElement("div");
            x1.setAttribute('id', 'LeGuet');
            x1.innerHTML += "&nbsp;&nbsp;&nbsp;La Douane : ";
            this.addSubfunction(x1, RapportGuet.debut, "Rapport");
            this.addSubfunction(x1, Recensement.debut, "Recensement");
            this.addSubfunction(x1, Furtifs.debut, "Furtifs");
            this.addSubfunction(x1, Village.analyse, "Statistiques");
            this.addSubfunction(x1, Village.registre, "Registre");
            xzone.appendChild(x1);
            if (document.body.innerHTML.indexOf('Mon bureau de maire') != -1) {
                var x2 = document.createElement("div");
                x2.setAttribute('id', 'BureauMaire');
                x2.setAttribute('class', 'zone_ss_onglets_texte');
                x2.innerHTML += "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
                this.addSubfunction(x2, Mairie.inventaire, "Inventaire<br>");
                this.addSubfunction(x2, Mairie.assietteImpots, "Assiette impots<br>");
                this.addSubfunction(x2, Mairie.fraudeFiscale, "Fraudeurs<br>");
                this.addSubfunction(x2, Mairie.mandats, "Mandats<br>");
                this.addSubfunction(x2, Mairie.milice, "Milice<br>");
                this.addSubfunction(x2, Mairie.compta, "Comptabilité<br>");
                this.addSubfunction(x2, Mairie.achats, "Transactions<br>");
                var xzone11 = document.getElementsByClassName("illustrationImage")[0];
                xzone11.appendChild(x2);
            }
            var x3 = document.createElement("div");
            x3.setAttribute('id', 'GuetAutre');
			x3.innerHTML += "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><b>Guet autre village : </b><br>";
			this.addSubfunction(x3, Exterieur.controler, "<i>Contrôler</i><br>");
            var xzone11 = document.getElementsByClassName("illustrationImage")[0];
            xzone11.appendChild(x3);
        }
    },
    addFonctionMarche: function () {
        var xzone = document.getElementById("onglet0Panel");
        xzone = xzone.getElementsByClassName("element elementRepeat")[0];
        xzone.innerHTML += "&nbsp;&nbsp;&nbsp;Agent commercial : ";
        this.addSubfunction(xzone, Marche.synthese, "Synthèse");
        this.addSubfunction(xzone, Marche.surveillance, "Surveillance");
    },
    addSubfunction: function (xzone, fn, titre) {
        var xa = document.createElement("a");
        xa.setAttribute('href', '#');
        xa.setAttribute("class", 'lien_default');
        xa.onclick = function () {
            fn();
            return false;
        };
        xa.innerHTML = titre;
        var xspan = document.createElement("span");
        xspan.innerHTML = "&nbsp;&nbsp;&nbsp;";
        xspan.appendChild(xa);
        xzone.appendChild(xspan);
    },
    addSubfunction3: function (xzone, fn, titre) {
        var xa = document.createElement("a");
        xa.setAttribute("class", 'lien_default');
        xa.onclick = function () {
            fn();
            return false;
        };
        xa.innerHTML = titre;
        var xspan = document.createElement("span");
        xspan.appendChild(xa);
        xzone.appendChild(xspan);
    },
    addFonctionGroupes: function () {
        var xtx = document.getElementById("onglet2Panel");
        if (xtx.innerHTML != "") {
            var xzonex = xtx.getElementsByClassName("illustrationImage")[0];
            var xz1x = xzonex.getElementsByTagName("img")[0];
            var xe1x = document.createElement("a");
            xe1x.setAttribute('href', '#');
            xe1x.onclick =
                    function () {
                        RapportGroupes.debut();
                        return false;
                    }
            ;
            xe1x.innerHTML = "<img alt=\"%PanneauImageAlt%\" src=\"images/deplacement_gpes_armees.jpg\">";
			xz1x.parentNode.replaceChild(xe1x, xz1x);
			
            //fonctions IG
			xzone = document.getElementById("onglet2Panel").getElementsByClassName("element elementRepeat")[0];
            var x1 = document.createElement("div");
            x1.setAttribute('id', 'LeGuet');
            x1.innerHTML += "&nbsp;&nbsp;&nbsp;La Douane : ";
            this.addSubfunction(x1, Exterieur.controler, "Rapport extérieur");
            xzone.appendChild(x1);
        }
//        xtx = document.getElementById("zoneTexte3");
//		this.addFonctionDuel();
//        this.addSubFunction2(xtx, Test.debut, "Test");

			},
    addSubFunction2: function (xzone, fn, titre) {
        var xa = document.createElement("a");
        xa.setAttribute('href', '#');
        xa.setAttribute("class", 'lien_default');
        xa.onclick = function () {
            fn();
            return false;
        };
        xa.innerHTML = titre;
        var xspan = document.createElement("span");
        xspan.innerHTML = "&nbsp;&nbsp;";
        xspan.appendChild(xa);
        xzone.parentNode.appendChild(xspan);
    },
    addFonctionEvenements: function () {
        var xty = document.getElementsByClassName("texte texteEvenement texteEvenement2")[0];
        if (xty.innerHTML != "") {
            var xzoney = xty;
            var xz1y = xzoney.getElementsByTagName("h2")[0];
            var xe1y = document.createElement("a");
            xe1y.setAttribute('href', '#');
            xe1y.onclick =
                    function () {
                        RapportMV.debut();
                        return false;
                    }
            ;
            xe1y.innerHTML = "<h2><a href=\"javascript:RapportMV_debut();\">Mémoires et vision</a></h2>";
            xz1y.parentNode.replaceChild(xe1y, xz1y);
        }
    },
    addFonctionTribunal: function () {
        var xtx = document.getElementById("onglet1Panel");
        if (xtx.innerHTML != "") {
            var xzonex = xtx.getElementsByClassName("illustrationImage")[0];
            var xz1x = xzonex.getElementsByTagName("img")[0];
            var xe1x = document.createElement("a");
            xe1x.setAttribute('href', '#');
            xe1x.onclick =
                    function () {
                        Suspects.controle();
                        return false;
                    }
            ;
            xe1x.innerHTML = "<img alt=\"%PanneauImageAlt%\" src=\"images/prefecture_tribunal.jpg\">";
	    xe1x.innerHTML+= "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><font color=#660000>0-Sous surveillance</font><br><font color=#0000ff>1-A Assigner à résidence</font><br><font color=#008888>2-Persona non grata</font><br><font color=#660000>3-Brigandage</font><br><font color=#ff0000>4-Membre de Fatum, Hydre...</font><br><font color=#ff3333>5-TOP<br>6-A prendre Mort ou vif</font>" ;
            xz1x.parentNode.replaceChild(xe1x, xz1x);
        }
        var xzone = document.getElementById("onglet1Panel");
        xzone = xzone.getElementsByClassName("element elementRepeat")[0];
        xzone.innerHTML += "&nbsp;&nbsp;&nbsp;Les suspects : ";
        this.addSubfunction(xzone, Suspects.identifier, "Identifier");
        this.addSubfunction(xzone, Suspects.importer, "Importer");
        this.addSubfunction(xzone, Suspects.lister, "Lister");
        this.addSubfunction(xzone, Suspects.verifier, "Vérifier");
        this.addSubfunction(xzone, Suspects.exporter, "Exporter");
        this.addSubfunction(xzone, Portrait.debut, "Portrait");
        this.addSubfunction(xzone, Suspects.controle, "Controle");
        this.addSubfunction(xzone, Suspects.Reinit, "RAZ");
    },
    addFonctionDuel: function () {
        var xzone = document.getElementById("onglet0Panel");
        xzone = xzone.getElementsByClassName("element elementRepeat")[0];
        xzone.innerHTML += "&nbsp;&nbsp;&nbsp;Guet autre village : ";
        this.addSubfunction(xzone, Exterieur.controler, "Contrôler");
    },
    addFonctionPerso: function () {
        var xz = document.getElementById("onglet0Panel").getElementsByClassName("element elementRepeat")[0];
        xz.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;";
        this.addSubfunction(xz, FnRR.setProfile, "Profil RReasy");
        this.addSubfunction(xz, Dossier.debut, "Dossier personnel");
        this.addSubfunction(xz, Presence.debut, "Fiche de présence");
        this.addSubfunction(xz, RapportSoldat.debut, "Rapport de garde");
        this.addSubfunction(xz, FnRR.getStorage, "<font color=red><i>Données enregistrées</i></font>");
       /* if (document.body.innerHTML.indexOf("textePage[0][7][6]['Texte'] = '") != -1) {
            this.addSubfunction(xz, Furtifs.furtifs, "Fouine");
            this.addSubfunction(xz, Furtifs.longueVue, "Longue-vue");
        } */
    },
    addFonctionProfil: function () {
        //var xz = document.getElementById("onglet0Panel").getElementsByClassName("element elementRepeat")[0];
        //xz.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;";
        //this.addSubfunction(xz, FnRR.setProfile, "Profil RReasy");
    },
    addBouton: function (ezMenux, ezElement, ezTexte, ezProc) {
        var ezMenu1 = ezMenux.getElementsByClassName(ezElement)[0];
        var xe = document.createElement("a");
        xe.setAttribute('href', '#');
        xe.setAttribute('class', 'btns');
        xe.onclick =
                function () {
                    ezProc();
                    return false;
                }
        ;
        xe.innerHTML = ezTexte;
        ezMenu1.appendChild(xe);
    }
}

RRmenu.init();
