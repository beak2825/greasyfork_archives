// ==UserScript==
// @name         RL - Shopping and payment reminder script
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Reminder tooltip for shopping sites
// @author       chaoscreater
// @include      *://*/*
// @exclude      *://*google.com/*
// @exclude      *://*azure.com/*
// @exclude      *://*microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486305/RL%20-%20Shopping%20and%20payment%20reminder%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/486305/RL%20-%20Shopping%20and%20payment%20reminder%20script.meta.js
// ==/UserScript==


/*
 * Run this below to remove the saved storage data
 *
localStorage.removeItem('popupTop_' + window.location.origin);
localStorage.removeItem('popupLeft_' + window.location.origin);

*/


(function()
{
	'use strict';

	var reminderDiv = document.createElement('div');
	var site = location.hostname;
	var contentHTML = '';

  // testing
  var site = window.location.href;


	if (site.includes('cheapies.nz')) {
	  var DisplayPopup = true;
	  //contentHTML += 'Check OzBargain as well! <br><br> FREEBIES: https://www.cheapies.nz/freebies <br><br> Couponese: https://www.couponese.com <br><br> Low quantity: https://www.cheapies.nz/node/32142 <br><br> Referral: https://www.cheapies.nz/wiki/list_of_referral_links <br><br> Clearance: https://www.cheapies.nz/wiki/list_of_clearance_sites <br> <br> Price comparison: https://www.cheapies.nz/wiki/price_comparison_sites';

		contentHTML += '<a href="https://www.temu.com/nz/bgt_orders.html">Temu - My Orders (Price Adjustment)</a> <br><br> Check OzBargain as well! <br><br> <a href="https://www.cheapies.nz/freebies">FREEBIES</a> <br><br> <a href="https://www.couponese.com">Couponese</a> <br><br> <a href="https://www.cheapies.nz/node/32142">Low quantity</a> <br><br> <a href="https://www.cheapies.nz/wiki/list_of_referral_links">Referral</a> <br><br> <a href="https://www.cheapies.nz/wiki/list_of_clearance_sites">Clearance</a> <br> <br> <a href="https://www.cheapies.nz/wiki/price_comparison_sites">Price Comparison</a>';

	  //reminderDiv.style.top = '50%'; // Center vertically
	  //reminderDiv.style.left = '10px'; // Left alignment
	  //reminderDiv.style.transform = 'translateY(-50%)'; // Adjust for exact centering vertically

	}
	else if (site.includes('temu.com') && (!site.toLowerCase().includes('temu.com/nz/bgt_orders.html')) && !site.toLowerCase().includes('temu.com/bgt_orders.html')) {
	  var DisplayPopup = true;
	  contentHTML += '<a href="https://www.temu.com/nz/bgt_orders.html">Temu - My Orders</a> <br><br> Remember to use Price Adjustment!';
	}
	else if (site.includes('aliexpress.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Pick 3 and save: <a href="https://www.aliexpress.com/gcp/300000512/nnmixupdatev3?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&channelLinkTag=nn_newgcp&spm=a2g0o.home.poplayer.125911_206920">https://www.aliexpress.com/gcp/300000512/nnmixupdatev3?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&channelLinkTag=nn_newgcp&spm=a2g0o.home.poplayer.125911_206920</a> <br><br> Referral: <a href="https://www.cheapies.nz/deals/aliexpress.com#refinfo15">https://www.cheapies.nz/deals/aliexpress.com#refinfo15</a>';
	}
	else if (site.includes('online.asb.co.nz/service/payments') || site.includes('anz.co.nz') || site.includes('westpac.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Remember to use Dosh for payment!';
	}
	else if (site.includes('ubereats.com') || site.includes('mcdonalds.co.nz') || site.includes('dominos.co.nz') || site.includes('hellpizza.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Check Cheapies or OzBargain extension for coupons <br><br> Remember to use Dosh for payment! <br><br> Fast food deals: <a href="https://www.cheapies.nz/pages/fastfood">https://www.cheapies.nz/pages/fastfood</a> <br><br> <a href="https://www.cheapies.nz/cat/dining-takeaway">https://www.cheapies.nz/cat/dining-takeaway</a> <br><br> <a href="https://www.cheapies.nz/pages/pizza-coupons">https://www.cheapies.nz/pages/pizza-coupons</a> <br><br> Groceries: <a href="https://www.cheapies.nz/cat/groceries">https://www.cheapies.nz/cat/groceries</a> <br><br> Couponese: <a href="https://www.couponese.com">https://www.couponese.com</a> <br><br> Referral: <a href="https://www.cheapies.nz/deals/ubereats.com#refinfo18">https://www.cheapies.nz/deals/ubereats.com#refinfo18</a>';
	}
	else if (site.includes('starlink.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/starlink.com#refinfo134">https://www.cheapies.nz/deals/starlink.com#refinfo134</a>';
	}
	else if (site.includes('stickermule.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/stickermule.com#refinfo130">https://www.cheapies.nz/deals/stickermule.com#refinfo130</a>';
	}
	else if (site.includes('abra.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/abra.com#refinfo120">https://www.cheapies.nz/deals/abra.com#refinfo120</a>';
	}
	else if (site.includes('afterpay.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/afterpay.com#refinfo140">https://www.cheapies.nz/deals/afterpay.com#refinfo140</a>';
	}
	else if (site.includes('airbnb.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/airbnb.com#refinfo67">https://www.cheapies.nz/deals/airbnb.com#refinfo67</a>';
	}
	else if (site.includes('americanexpress.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/americanexpress.com#refinfo162">https://www.cheapies.nz/deals/americanexpress.com#refinfo162</a> <br><br> <a href="https://www.cheapies.nz/deals/americanexpress.com#refinfo161">https://www.cheapies.nz/deals/americanexpress.com#refinfo161</a> <br><br> <a href="https://www.cheapies.nz/deals/americanexpress.com#refinfo160">https://www.cheapies.nz/deals/americanexpress.com#refinfo160</a> <br><br> <a href="https://www.cheapies.nz/deals/americanexpress.com#refinfo159">https://www.cheapies.nz/deals/americanexpress.com#refinfo159</a> <br><br> <a href="https://www.cheapies.nz/deals/americanexpress.com#refinfo158">https://www.cheapies.nz/deals/americanexpress.com#refinfo158</a>';
	}
	else if (site.includes('amp.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/amp.co.nz#refinfo164">https://www.cheapies.nz/deals/amp.co.nz#refinfo164</a>';
	}
	else if (site.includes('banggood.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/banggood.com#refinfo61">https://www.cheapies.nz/deals/banggood.com#refinfo61</a>';
	}
	else if (site.includes('bargainbox.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/bargainbox.co.nz#refinfo36">https://www.cheapies.nz/deals/bargainbox.co.nz#refinfo36</a>';
	}
	else if (site.includes('ridebeam.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/ridebeam.com#refinfo54">https://www.cheapies.nz/deals/ridebeam.com#refinfo54</a>';
	}
	else if (site.includes('benjerry.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/benjerry.co.nz#refinfo113">https://www.cheapies.nz/deals/benjerry.co.nz#refinfo113</a>';
	}
	else if (site.includes('bigpipe.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/bigpipe.co.nz#refinfo10">https://www.cheapies.nz/deals/bigpipe.co.nz#refinfo10</a>';
	}
	else if (site.includes('binance.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/binance.com#refinfo83">https://www.cheapies.nz/deals/binance.com#refinfo83</a>';
	}
	else if (site.includes('bitstamp.net')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/bitstamp.net#refinfo117">https://www.cheapies.nz/deals/bitstamp.net#refinfo117</a>';
	}
	else if (site.includes('blockfi.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/blockfi.com#refinfo102">https://www.cheapies.nz/deals/blockfi.com#refinfo102</a>';
	}
	else if (site.includes('bose.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/bose.co.nz#refinfo109">https://www.cheapies.nz/deals/bose.co.nz#refinfo109</a>';
	}
	else if (site.includes('brickstore.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/brickstore.nz#refinfo143">https://www.cheapies.nz/deals/brickstore.nz#refinfo143</a>';
	}
	else if (site.includes('bulknutrients.com.au')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/bulknutrients.com.au#refinfo171">https://www.cheapies.nz/deals/bulknutrients.com.au#refinfo171</a>';
	}
	else if (site.includes('cashrewards.com.au')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/cashrewards.com.au#refinfo40">https://www.cheapies.nz/deals/cashrewards.com.au#refinfo40</a>';
	}
	else if (site.includes('chipolo.net')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/chipolo.net#refinfo156">https://www.cheapies.nz/deals/chipolo.net#refinfo156</a>';
	}
	else if (site.includes('co-operativebank.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/co-operativebank.co.nz#refinfo34">https://www.cheapies.nz/deals/co-operativebank.co.nz#refinfo34</a>';
	}
	else if (site.includes('coinbase.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/coinbase.com#refinfo68">https://www.cheapies.nz/deals/coinbase.com#refinfo68</a>';
	}
	else if (site.includes('contact.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/contact.co.nz#refinfo57">https://www.cheapies.nz/deals/contact.co.nz#refinfo57</a>';
	}
	else if (site.includes('coveinsurance.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/coveinsurance.co.nz#refinfo63">https://www.cheapies.nz/deals/coveinsurance.co.nz#refinfo63</a>';
	}
	else if (site.includes('crypto.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/crypto.com#refinfo84">https://www.cheapies.nz/deals/crypto.com#refinfo84</a>';
	}
	else if (site.includes('currencyfair.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/currencyfair.com#refinfo85">https://www.cheapies.nz/deals/currencyfair.com#refinfo85</a>';
	}
	else if (site.includes('dashlane.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/dashlane.com#refinfo17">https://www.cheapies.nz/deals/dashlane.com#refinfo17</a>';
	}
	else if (site.includes('delivereasy.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/delivereasy.co.nz#refinfo88">https://www.cheapies.nz/deals/delivereasy.co.nz#refinfo88</a>';
	}
	else if (site.includes('didiglobal.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/didiglobal.com#refinfo91">https://www.cheapies.nz/deals/didiglobal.com#refinfo91</a>';
	}
	else if (site.includes('doordash.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/doordash.com#refinfo133">https://www.cheapies.nz/deals/doordash.com#refinfo133</a>';
	}
	else if (site.includes('dosh.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/dosh.nz#refinfo136">https://www.cheapies.nz/deals/dosh.nz#refinfo136</a>';
	}
	else if (site.includes('drop.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/drop.com#refinfo38">https://www.cheapies.nz/deals/drop.com#refinfo38</a>';
	}
	else if (site.includes('dropbox.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/dropbox.com#refinfo2">https://www.cheapies.nz/deals/dropbox.com#refinfo2</a>';
	}
	else if (site.includes('easycrypto.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/easycrypto.com#refinfo126">https://www.cheapies.nz/deals/easycrypto.com#refinfo126</a>';
	}
	else if (site.includes('ecosa.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/ecosa.co.nz#refinfo78">https://www.cheapies.nz/deals/ecosa.co.nz#refinfo78</a>';
	}
	else if (site.includes('emma-sleep.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/emma-sleep.co.nz#refinfo97">https://www.cheapies.nz/deals/emma-sleep.co.nz#refinfo97</a>';
	}
	else if (site.includes('energyonline.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/energyonline.co.nz#refinfo79">https://www.cheapies.nz/deals/energyonline.co.nz#refinfo79</a>';
	}
	else if (site.includes('eskimo.travel')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/eskimo.travel#refinfo157">https://www.cheapies.nz/deals/eskimo.travel#refinfo157</a>';
	}
	else if (site.includes('ethiqueworld.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/ethiqueworld.com#refinfo137">https://www.cheapies.nz/deals/ethiqueworld.com#refinfo137</a>';
	}
	else if (site.includes('fanatical.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/fanatical.com#refinfo141">https://www.cheapies.nz/deals/fanatical.com#refinfo141</a>';
	}
	else if (site.includes('feedmyfurbaby.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/feedmyfurbaby.co.nz#refinfo148">https://www.cheapies.nz/deals/feedmyfurbaby.co.nz#refinfo148</a>';
	}
	else if (site.includes('felixmobile.com.au')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/felixmobile.com.au#refinfo163">https://www.cheapies.nz/deals/felixmobile.com.au#refinfo163</a>';
	}
	else if (site.includes('firsttable.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/firsttable.co.nz#refinfo95">https://www.cheapies.nz/deals/firsttable.co.nz#refinfo95</a>';
	}
	else if (site.includes('fishinginnovators.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/fishinginnovators.co.nz#refinfo167">https://www.cheapies.nz/deals/fishinginnovators.co.nz#refinfo167</a>';
	}
	else if (site.includes('flamingoscooters.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/flamingoscooters.com#refinfo51">https://www.cheapies.nz/deals/flamingoscooters.com#refinfo51</a>';
	}
	else if (site.includes('flickelectric.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/flickelectric.co.nz#refinfo33">https://www.cheapies.nz/deals/flickelectric.co.nz#refinfo33</a>';
	}
	else if (site.includes('frankenergy.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/frankenergy.co.nz#refinfo114">https://www.cheapies.nz/deals/frankenergy.co.nz#refinfo114</a>';
	}
	else if (site.includes('gamekings.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/gamekings.co.nz#refinfo123">https://www.cheapies.nz/deals/gamekings.co.nz#refinfo123</a>';
	}
	else if (site.includes('generatewealth.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/generatewealth.co.nz#refinfo144">https://www.cheapies.nz/deals/generatewealth.co.nz#refinfo144</a>';
	}
	else if (site.includes('giftmonkey.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/giftmonkey.co.nz#refinfo115">https://www.cheapies.nz/deals/giftmonkey.co.nz#refinfo115</a>';
	}
	else if (site.includes('goodgeorge.kiwi.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/goodgeorge.kiwi.nz#refinfo110">https://www.cheapies.nz/deals/goodgeorge.kiwi.nz#refinfo110</a>';
	}
	else if (site.includes('hatchinvest.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/hatchinvest.nz#refinfo81">https://www.cheapies.nz/deals/hatchinvest.nz#refinfo81</a>';
	}
	else if (site.includes('hellofresh.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/hellofresh.co.nz#refinfo43">https://www.cheapies.nz/deals/hellofresh.co.nz#refinfo43</a> <br><br> <a href="https://www.cheapies.nz/deals/hellofresh.co.nz#refinfo138">https://www.cheapies.nz/deals/hellofresh.co.nz#refinfo138</a>';
	}
	else if (site.includes('hnry.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/hnry.co.nz#refinfo128">https://www.cheapies.nz/deals/hnry.co.nz#refinfo128</a>';
	}
	else if (site.includes('hopper.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/hopper.com#refinfo150">https://www.cheapies.nz/deals/hopper.com#refinfo150</a>';
	}
	else if (site.includes('humblebundle.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/humblebundle.com#refinfo30">https://www.cheapies.nz/deals/humblebundle.com#refinfo30</a>';
	}
	else if (site.includes('icebreaker.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/icebreaker.com#refinfo155">https://www.cheapies.nz/deals/icebreaker.com#refinfo155</a>';
	}
	else if (site.includes('iherb.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/iherb.com#refinfo28">https://www.cheapies.nz/deals/iherb.com#refinfo28</a>';
	}
	else if (site.includes('junofunds.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/junofunds.co.nz#refinfo153">https://www.cheapies.nz/deals/junofunds.co.nz#refinfo153</a>';
	}
	else if (site.includes('kiddicare.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/kiddicare.co.nz#refinfo94">https://www.cheapies.nz/deals/kiddicare.co.nz#refinfo94</a>';
	}
	else if (site.includes('kiwiwallet.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/kiwiwallet.co.nz#refinfo53">https://www.cheapies.nz/deals/kiwiwallet.co.nz#refinfo53</a>';
	}
	else if (site.includes('lifepharmacystlukes.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/lifepharmacystlukes.co.nz#refinfo75">https://www.cheapies.nz/deals/lifepharmacystlukes.co.nz#refinfo75</a>';
	}
	else if (site.includes('lifedirect.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/lifedirect.co.nz#refinfo154">https://www.cheapies.nz/deals/lifedirect.co.nz#refinfo154</a>';
	}
	else if (site.includes('li.me')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/li.me#refinfo42">https://www.cheapies.nz/deals/li.me#refinfo42</a>';
	}
	else if (site.includes('lonestar.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/lonestar.co.nz#refinfo80">https://www.cheapies.nz/deals/lonestar.co.nz#refinfo80</a>';
	}
	else if (site.includes('getmade.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/getmade.co.nz#refinfo103">https://www.cheapies.nz/deals/getmade.co.nz#refinfo103</a>';
	}
	else if (site.includes('mercury.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/mercury.co.nz#refinfo72">https://www.cheapies.nz/deals/mercury.co.nz#refinfo72</a>';
	}
	else if (site.includes('mevo.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/mevo.co.nz#refinfo65">https://www.cheapies.nz/deals/mevo.co.nz#refinfo65</a>';
	}
	else if (site.includes('mobvoi.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/mobvoi.com#refinfo100">https://www.cheapies.nz/deals/mobvoi.com#refinfo100</a>';
	}
	else if (site.includes('myfoodbag.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/myfoodbag.co.nz#refinfo35">https://www.cheapies.nz/deals/myfoodbag.co.nz#refinfo35</a>';
	}
	else if (site.includes('myprotein.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/myprotein.com#refinfo14">https://www.cheapies.nz/deals/myprotein.com#refinfo14</a>';
	}
	else if (site.includes('myrepublic.net')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/myrepublic.net#refinfo49">https://www.cheapies.nz/deals/myrepublic.net#refinfo49</a>';
	}
	else if (site.includes('rideneuron.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/rideneuron.com#refinfo73">https://www.cheapies.nz/deals/rideneuron.com#refinfo73</a>';
	}
	else if (site.includes('nexo.io')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/nexo.io#refinfo116">https://www.cheapies.nz/deals/nexo.io#refinfo116</a>';
	}
	else if (site.includes('nordvpn.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/nordvpn.com#refinfo131">https://www.cheapies.nz/deals/nordvpn.com#refinfo131</a>';
	}
	else if (site.includes('nownz.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/nownz.co.nz#refinfo166">https://www.cheapies.nz/deals/nownz.co.nz#refinfo166</a>';
	}
	else if (site.includes('nzsale.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/nzsale.co.nz#refinfo16">https://www.cheapies.nz/deals/nzsale.co.nz#refinfo16</a>';
	}
	else if (site.includes('oculus.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/oculus.com#refinfo145">https://www.cheapies.nz/deals/oculus.com#refinfo145</a>';
	}
	else if (site.includes('okcoin.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/okcoin.com#refinfo118">https://www.cheapies.nz/deals/okcoin.com#refinfo118</a>';
	}
	else if (site.includes('ola.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/ola.co.nz#refinfo44">https://www.cheapies.nz/deals/ola.co.nz#refinfo44</a>';
	}
	else if (site.includes('onceit.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/onceit.co.nz#refinfo112">https://www.cheapies.nz/deals/onceit.co.nz#refinfo112</a>';
	}
	else if (site.includes('onzo.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/onzo.co.nz#refinfo37">https://www.cheapies.nz/deals/onzo.co.nz#refinfo37</a>';
	}
	else if (site.includes('opas.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/opas.com#refinfo111">https://www.cheapies.nz/deals/opas.com#refinfo111</a>';
	}
	else if (site.includes('ozonecoffee.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/ozonecoffee.co.nz#refinfo135">https://www.cheapies.nz/deals/ozonecoffee.co.nz#refinfo135</a>';
	}
	else if (site.includes('petdirect.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/petdirect.co.nz#refinfo106">https://www.cheapies.nz/deals/petdirect.co.nz#refinfo106</a>';
	}
	else if (site.includes('powershop.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/powershop.co.nz#refinfo26">https://www.cheapies.nz/deals/powershop.co.nz#refinfo26</a>';
	}
	else if (site.includes('purenature.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/purenature.co.nz#refinfo58">https://www.cheapies.nz/deals/purenature.co.nz#refinfo58</a> <br><br> Clearance: <a href="https://www.purenature.co.nz/collections/clearance">https://www.purenature.co.nz/collections/clearance</a>';
	}
	else if (site.includes('quic.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/quic.nz#refinfo168">https://www.cheapies.nz/deals/quic.nz#refinfo168</a>';
	}
	else if (site.includes('realfooddirect.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/realfooddirect.co.nz#refinfo93">https://www.cheapies.nz/deals/realfooddirect.co.nz#refinfo93</a>';
	}
	else if (site.includes('rebtel.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/rebtel.com#refinfo39">https://www.cheapies.nz/deals/rebtel.com#refinfo39</a>';
	}
	else if (site.includes('reship.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/reship.com#refinfo7">https://www.cheapies.nz/deals/reship.com#refinfo7</a>';
	}
	else if (site.includes('robertsspaceindustries.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/robertsspaceindustries.com#refinfo89">https://www.cheapies.nz/deals/robertsspaceindustries.com#refinfo89</a>';
	}
	else if (site.includes('sharesies.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/sharesies.nz#refinfo52">https://www.cheapies.nz/deals/sharesies.nz#refinfo52</a>';
	}
	else if (site.includes('shopback.com.au')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/shopback.com.au#refinfo107">https://www.cheapies.nz/deals/shopback.com.au#refinfo107</a>';
	}
	else if (site.includes('shoprewards.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/shoprewards.co.nz#refinfo48">https://www.cheapies.nz/deals/shoprewards.co.nz#refinfo48</a>';
	}
	else if (site.includes('skinny.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/skinny.co.nz#refinfo47">https://www.cheapies.nz/deals/skinny.co.nz#refinfo47</a>';
	}
	else if (site.includes('sky.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/sky.co.nz#refinfo104">https://www.cheapies.nz/deals/sky.co.nz#refinfo104</a>';
	}
	else if (site.includes('socialgood.inc')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/socialgood.inc#refinfo98">https://www.cheapies.nz/deals/socialgood.inc#refinfo98</a>';
	}
	else if (site.includes('getsquareone.app')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/getsquareone.app#refinfo142">https://www.cheapies.nz/deals/getsquareone.app#refinfo142</a>';
	}
	else if (site.includes('squirrel.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/squirrel.co.nz#refinfo169">https://www.cheapies.nz/deals/squirrel.co.nz#refinfo169</a>';
	}
	else if (site.includes('stacksocial.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/stacksocial.com#refinfo4">https://www.cheapies.nz/deals/stacksocial.com#refinfo4</a>';
	}
	else if (site.includes('hellostake.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/hellostake.com#refinfo76">https://www.cheapies.nz/deals/hellostake.com#refinfo76</a>';
	}
	else if (site.includes('supie.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/supie.co.nz#refinfo152">https://www.cheapies.nz/deals/supie.co.nz#refinfo152</a>';
	}
	else if (site.includes('surfshark.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/surfshark.com#refinfo99">https://www.cheapies.nz/deals/surfshark.com#refinfo99</a>';
	}
	else if (site.includes('swyftx.com.au')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/swyftx.com.au#refinfo125">https://www.cheapies.nz/deals/swyftx.com.au#refinfo125</a>';
	}
	else if (site.includes('teddy.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/teddy.nz#refinfo149">https://www.cheapies.nz/deals/teddy.nz#refinfo149</a>';
	}
	else if (site.includes('tesla.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/tesla.com#refinfo105">https://www.cheapies.nz/deals/tesla.com#refinfo105</a>';
	}
	else if (site.includes('theiconic.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/theiconic.co.nz#refinfo151">https://www.cheapies.nz/deals/theiconic.co.nz#refinfo151</a>';
	}
	else if (site.includes('thesleepstore.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/thesleepstore.co.nz#refinfo90">https://www.cheapies.nz/deals/thesleepstore.co.nz#refinfo90</a>';
	}
	else if (site.includes('tigerbrokers.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/tigerbrokers.nz#refinfo127">https://www.cheapies.nz/deals/tigerbrokers.nz#refinfo127</a>';
	}
	else if (site.includes('tiktok.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/tiktok.com#refinfo122">https://www.cheapies.nz/deals/tiktok.com#refinfo122</a>';
	}
	else if (site.includes('topcashback.co.uk')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/topcashback.co.uk#refinfo19">https://www.cheapies.nz/deals/topcashback.co.uk#refinfo19</a>';
	}
	else if (site.includes('topcashback.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/topcashback.com#refinfo13">https://www.cheapies.nz/deals/topcashback.com#refinfo13</a>';
	}
	else if (site.includes('vitahealth.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/vitahealth.co.nz#refinfo165">https://www.cheapies.nz/deals/vitahealth.co.nz#refinfo165</a>';
	}
	else if (site.includes('vultr.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/vultr.com#refinfo45">https://www.cheapies.nz/deals/vultr.com#refinfo45</a>';
	}
	else if (site.includes('willandable.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/willandable.co.nz#refinfo92">https://www.cheapies.nz/deals/willandable.co.nz#refinfo92</a>';
	}
	else if (site.includes('windscribe.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/windscribe.com#refinfo101">https://www.cheapies.nz/deals/windscribe.com#refinfo101</a>';
	}
	else if (site.includes('winecentral.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/winecentral.co.nz#refinfo146">https://www.cheapies.nz/deals/winecentral.co.nz#refinfo146</a>';
	}
	else if (site.includes('wirexapp.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/wirexapp.com#refinfo121">https://www.cheapies.nz/deals/wirexapp.com#refinfo121</a>';
	}
	else if (site.includes('transferwise.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/transferwise.com#refinfo46">https://www.cheapies.nz/deals/transferwise.com#refinfo46</a>';
	}
	else if (site.includes('woop.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/woop.co.nz#refinfo82">https://www.cheapies.nz/deals/woop.co.nz#refinfo82</a>';
	}
	else if (site.includes('youneedabudget.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/youneedabudget.com#refinfo56">https://www.cheapies.nz/deals/youneedabudget.com#refinfo56</a>';
	}
	else if (site.includes('yukithreads.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/yukithreads.com#refinfo129">https://www.cheapies.nz/deals/yukithreads.com#refinfo129</a>';
	}
	else if (site.includes('z.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/z.co.nz#refinfo147">https://www.cheapies.nz/deals/z.co.nz#refinfo147</a>';
	}
	else if (site.includes('zennioptical.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/zennioptical.com#refinfo132">https://www.cheapies.nz/deals/zennioptical.com#refinfo132</a>';
	}
	else if (site.includes('zoomy.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/zoomy.co.nz#refinfo23">https://www.cheapies.nz/deals/zoomy.co.nz#refinfo23</a>';
	}
	else if (site.includes('zwift.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Referral: <a href="https://www.cheapies.nz/deals/zwift.com#refinfo170">https://www.cheapies.nz/deals/zwift.com#refinfo170</a>';
	}
	else if (site.includes('ascolour.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.ascolour.co.nz/sale/">https://www.ascolour.co.nz/sale/</a>';
	}
	else if (site.includes('asics.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.asics.com/nz/en-nz/clearance/">https://www.asics.com/nz/en-nz/clearance/</a>';
	}
	else if (site.includes('blitzsurf.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.blitzsurf.co.nz/estore/category/clearance.aspx">https://www.blitzsurf.co.nz/estore/category/clearance.aspx</a>';
	}
	else if (site.includes('cactusoutdoor.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://cactusoutdoor.co.nz/collections/clearance-all">https://cactusoutdoor.co.nz/collections/clearance-all</a>';
	}
	else if (site.includes('eccoshoes.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.eccoshoes.co.nz/shop/clearance/">https://www.eccoshoes.co.nz/shop/clearance/</a>';
	}
	else if (site.includes('furniturezone.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.furniturezone.co.nz/clearance">https://www.furniturezone.co.nz/clearance</a>';
	}
	else if (site.includes('hannahs.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.hannahs.co.nz/sale/clearance?_sl=2/">https://www.hannahs.co.nz/sale/clearance?_sl=2/</a>';
	}
	else if (site.includes('hyperride.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.hyperride.co.nz/products/clearance?pgSort=price/">https://www.hyperride.co.nz/products/clearance?pgSort=price/</a>';
	}
	else if (site.includes('kathmandu.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.kathmandu.co.nz/sale.html">https://www.kathmandu.co.nz/sale.html</a>';
	}
	else if (site.includes('kmart.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.kmart.co.nz/category/men/clearance-mens-clothing/">https://www.kmart.co.nz/category/men/clearance-mens-clothing/</a> <br><br> <a href="https://www.kmart.co.nz/category/kids-and-baby/clearance-baby/?sortBy=price-low-to-high">https://www.kmart.co.nz/category/kids-and-baby/clearance-baby/?sortBy=price-low-to-high</a> <br><br> <a href="https://www.kmart.co.nz/category/tech/technology-clearance/?sortBy=price-low-to-high">https://www.kmart.co.nz/category/tech/technology-clearance/?sortBy=price-low-to-high</a> <br><br> <a href="https://www.kmart.co.nz/category/home-and-living/home-and-living-by-category/?sortBy=price-low-to-high">https://www.kmart.co.nz/category/home-and-living/home-and-living-by-category/?sortBy=price-low-to-high</a>';
	}
	else if (site.includes('macpac.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.macpac.co.nz/clearance/">https://www.macpac.co.nz/clearance/</a>';
	}
	else if (site.includes('newbalance.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.newbalance.co.nz/clearance/">https://www.newbalance.co.nz/clearance/</a>';
	}
	else if (site.includes('outbacktrading.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.outbacktrading.co.nz/collections/clearance">https://www.outbacktrading.co.nz/collections/clearance</a>';
	}
	else if (site.includes('patmenziesshoes.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.patmenziesshoes.co.nz/clearance">https://www.patmenziesshoes.co.nz/clearance</a>';
	}
	else if (site.includes('postie.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.postie.co.nz/sale-clearance/">https://www.postie.co.nz/sale-clearance/</a>';
	}
	else if (site.includes('smartwool.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.smartwool.co.nz/collections/clearance">https://www.smartwool.co.nz/collections/clearance</a>';
	}
	else if (site.includes('stoneycreek.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.stoneycreek.co.nz/clearance">https://www.stoneycreek.co.nz/clearance</a>';
	}
	else if (site.includes('swanndri.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.swanndri.co.nz/outlet.html/">https://www.swanndri.co.nz/outlet.html/</a>';
	}
	else if (site.includes('timberland.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.timberland.co.nz/clearance">https://www.timberland.co.nz/clearance</a>';
	}
	else if (site.includes('caros.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.caros.co.nz/latest-deals/don-t-miss-these/clearance-deals.html">https://www.caros.co.nz/latest-deals/don-t-miss-these/clearance-deals.html</a>';
	}
	else if (site.includes('keacookies.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.keacookies.co.nz/cookies/broken-cookies-seconds/">https://www.keacookies.co.nz/cookies/broken-cookies-seconds/</a>';
	}
	else if (site.includes('munchtime.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://munchtime.co.nz/product-category/clearance-deals//">https://munchtime.co.nz/product-category/clearance-deals//</a>';
	}
	else if (site.includes('chemistwarehouse.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.chemistwarehouse.co.nz/shop-online/3240/clearance">https://www.chemistwarehouse.co.nz/shop-online/3240/clearance</a>';
	}
	else if (site.includes('elitefitness.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.elitefitness.co.nz/clearance/">https://www.elitefitness.co.nz/clearance/</a>';
	}
	else if (site.includes('health2000.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.health2000.co.nz/clearance-sales/">https://www.health2000.co.nz/clearance-sales/</a>';
	}
	else if (site.includes('nzmuscle.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.nzmuscle.co.nz/clearance/">https://www.nzmuscle.co.nz/clearance/</a>';
	}
	else if (site.includes('pharmacydirect.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.pharmacydirect.co.nz/Clearance/">https://www.pharmacydirect.co.nz/Clearance/</a>';
	}
	else if (site.includes('sprintfit.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.sprintfit.co.nz/products/clearance">https://www.sprintfit.co.nz/products/clearance</a>';
	}
	else if (site.includes('adairs.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.adairs.co.nz/sale/nz-clearance/">https://www.adairs.co.nz/sale/nz-clearance/</a>';
	}
	else if (site.includes('applianceoutlet.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://applianceoutlet.co.nz/">https://applianceoutlet.co.nz/</a>';
	}
	else if (site.includes('bedbathntable.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.bedbathntable.co.nz/clearance-online">https://www.bedbathntable.co.nz/clearance-online</a>';
	}
	else if (site.includes('bissell.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.bissell.co.nz/collections/clearance">https://www.bissell.co.nz/collections/clearance</a>';
	}
	else if (site.includes('briscoes.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.briscoes.co.nz/clearance">https://www.briscoes.co.nz/clearance</a>';
	}
	else if (site.includes('cocorepublic.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.cocorepublic.co.nz/clearance.html">https://www.cocorepublic.co.nz/clearance.html</a>';
	}
	else if (site.includes('danskemobler.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://danskemobler.co.nz/Clearance">https://danskemobler.co.nz/Clearance</a>';
	}
	else if (site.includes('earlysettler.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://earlysettler.co.nz/collections/clearance-offers">https://earlysettler.co.nz/collections/clearance-offers</a>';
	}
	else if (site.includes('farmers.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.farmers.co.nz/clearance">https://www.farmers.co.nz/clearance</a>';
	}
	else if (site.includes('freedomfurniture.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.freedomfurniture.co.nz/c/sale-and-clearance">https://www.freedomfurniture.co.nz/c/sale-and-clearance</a>';
	}
	else if (site.includes('harveyfurnishings.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.harveyfurnishings.co.nz/collections/clearance-offers">https://www.harveyfurnishings.co.nz/collections/clearance-offers</a>';
	}
	else if (site.includes('ifurniture.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.ifurniture.co.nz/clearance-sale-deals">https://www.ifurniture.co.nz/clearance-sale-deals</a>';
	}
	else if (site.includes('mightyape.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.cheapies.nz/wiki/https:www.mightyape.co.nz_clearance">https://www.cheapies.nz/wiki/https:www.mightyape.co.nz_clearance</a>';
	}
	else if (site.includes('mocka.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.mocka.co.nz/clearance-items/">https://www.mocka.co.nz/clearance-items/</a>';
	}
	else if (site.includes('nisbets.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.nisbets.co.nz/clearance-and-special-offers/clearance/_/a33-2">https://www.nisbets.co.nz/clearance-and-special-offers/clearance/_/a33-2</a>';
	}
	else if (site.includes('nood.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.nood.co.nz/clearance">https://www.nood.co.nz/clearance</a>';
	}
	else if (site.includes('stevens.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.stevens.co.nz/clearance">https://www.stevens.co.nz/clearance</a>';
	}
	else if (site.includes('takingshape.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://takingshape.com/NZ/clearance/cardis-coats-and-jackets/">https://takingshape.com/NZ/clearance/cardis-coats-and-jackets/</a>';
	}
	else if (site.includes('thedesignstore.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.thedesignstore.co.nz/collections/clearance-sale">https://www.thedesignstore.co.nz/collections/clearance-sale</a>';
	}
	else if (site.includes('thelightingoutlet.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://thelightingoutlet.co.nz/collections/sales-clearance">https://thelightingoutlet.co.nz/collections/sales-clearance</a>';
	}
	else if (site.includes('thewarehouse.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.thewarehouse.co.nz/c/specials/clearance">https://www.thewarehouse.co.nz/c/specials/clearance</a>';
	}
	else if (site.includes('ufl.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.cheapies.nz/wiki/https:www.ufl.co.nz_product-category_clearance">https://www.cheapies.nz/wiki/https:www.ufl.co.nz_product-category_clearance</a>';
	}
	else if (site.includes('musicworks.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.musicworks.co.nz/clearance/">https://www.musicworks.co.nz/clearance/</a>';
	}
	else if (site.includes('rockshop.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.rockshop.co.nz/clearance">https://www.rockshop.co.nz/clearance</a>';
	}
	else if (site.includes('officemax.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.officemax.co.nz/Clearance">https://www.officemax.co.nz/Clearance</a>';
	}
	else if (site.includes('warehousestationery.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.warehousestationery.co.nz/deals/clearance">https://www.warehousestationery.co.nz/deals/clearance</a>';
	}
	else if (site.includes('whitcoulls.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.whitcoulls.co.nz/clearance">https://www.whitcoulls.co.nz/clearance</a>';
	}
	else if (site.includes('funkygifts.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://funkygifts.co.nz/collections/sale">https://funkygifts.co.nz/collections/sale</a>';
	}
	else if (site.includes('greenmachine.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://greenmachine.nz/collections/sale/clearance">https://greenmachine.nz/collections/sale/clearance</a>';
	}
	else if (site.includes('99bikes.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.99bikes.co.nz/collections/clearance">https://www.99bikes.co.nz/collections/clearance</a>';
	}
	else if (site.includes('adventureoutlet.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://adventureoutlet.co.nz/">https://adventureoutlet.co.nz/</a>';
	}
	else if (site.includes('armyandoutdoors.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.armyandoutdoors.co.nz/collections/clearance-stock">https://www.armyandoutdoors.co.nz/collections/clearance-stock</a>';
	}
	else if (site.includes('evocycles.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.evocycles.co.nz/clearance">https://www.evocycles.co.nz/clearance</a>';
	}
	else if (site.includes('nzfarmsource.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://store.nzfarmsource.co.nz/store/clearance">https://store.nzfarmsource.co.nz/store/clearance</a>';
	}
	else if (site.includes('furtherfaster.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.furtherfaster.co.nz/collections/clearance">https://www.furtherfaster.co.nz/collections/clearance</a>';
	}
	else if (site.includes('golfwarehouse.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.golfwarehouse.nz/collections/clearance">https://www.golfwarehouse.nz/collections/clearance</a>';
	}
	else if (site.includes('hunterselement.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.hunterselement.co.nz/collections/hunting-outlet-clearance-sale">https://www.hunterselement.co.nz/collections/hunting-outlet-clearance-sale</a>';
	}
	else if (site.includes('huntingandfishing.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.huntingandfishing.co.nz/clearance">https://www.huntingandfishing.co.nz/clearance</a>';
	}
	else if (site.includes('livingsimply.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.livingsimply.co.nz/estore/category/clearance.aspx">https://www.livingsimply.co.nz/estore/category/clearance.aspx</a>';
	}
	else if (site.includes('mountainwarehouse.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.mountainwarehouse.com/nz/clearance/">https://www.mountainwarehouse.com/nz/clearance/</a>';
	}
	else if (site.includes('nzboardstore.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://nzboardstore.co.nz/clearance/">https://nzboardstore.co.nz/clearance/</a>';
	}
	else if (site.includes('playerssports.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.playerssports.co.nz/outlet">https://www.playerssports.co.nz/outlet</a>';
	}
	else if (site.includes('probikekit.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.probikekit.co.nz/clearance.list">https://www.probikekit.co.nz/clearance.list</a>';
	}
	else if (site.includes('rebelsport.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.rebelsport.co.nz/clearance/">https://www.rebelsport.co.nz/clearance/</a>';
	}
	else if (site.includes('suuntostore.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://suuntostore.co.nz/collections/clearance">https://suuntostore.co.nz/collections/clearance</a>';
	}
	else if (site.includes('torpedo7.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.torpedo7.co.nz/shop/clearance">https://www.torpedo7.co.nz/shop/clearance</a>';
	}
	else if (site.includes('dell.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.dell.com/en-nz/lp/clearance">https://www.dell.com/en-nz/lp/clearance</a>';
	}
	else if (site.includes('dicksmith.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.dicksmith.co.nz/dn/c/clearance/?deals_from=dse">https://www.dicksmith.co.nz/dn/c/clearance/?deals_from=dse</a>';
	}
	else if (site.includes('harveynorman.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.harveynorman.co.nz/clearance/">https://www.harveynorman.co.nz/clearance/</a>';
	}
	else if (site.includes('jbhifi.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.jbhifi.co.nz/features/online-clearance/">https://www.jbhifi.co.nz/features/online-clearance/</a>';
	}
	else if (site.includes('noelleeming.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.noelleeming.co.nz/c/clearance">https://www.noelleeming.co.nz/c/clearance</a>';
	}
	else if (site.includes('pbtech.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.pbtech.co.nz/clearance">https://www.pbtech.co.nz/clearance</a>';
	}
	else if (site.includes('nzsafetyblackwoods.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://nzsafetyblackwoods.co.nz/en/product/clearancelist?categoryId=0&page=0&sortby=&count=50">https://nzsafetyblackwoods.co.nz/en/product/clearancelist?categoryId=0&page=0&sortby=&count=50</a>';
	}
	else if (site.includes('repco.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.repco.co.nz/clearance/c/2538381394">https://www.repco.co.nz/clearance/c/2538381394</a>';
	}
	else if (site.includes('royalwolf.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.royalwolf.co.nz/clearance">https://www.royalwolf.co.nz/clearance</a>';
	}
	else if (site.includes('supercheapauto.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.supercheapauto.co.nz/clearance-going-going-gone">https://www.supercheapauto.co.nz/clearance-going-going-gone</a>';
	}
	else if (site.includes('thetoolshed.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.thetoolshed.co.nz/product/clearance">https://www.thetoolshed.co.nz/product/clearance</a>';
	}
	else if (site.includes('tiledepot.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.tiledepot.co.nz/browse/tiles/50-off-clearance-lines">https://www.tiledepot.co.nz/browse/tiles/50-off-clearance-lines</a>';
	}
	else if (site.includes('tradeworkwear.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.tradeworkwear.co.nz/specials/clearance.html">https://www.tradeworkwear.co.nz/specials/clearance.html</a>';
	}
	else if (site.includes('hatch.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://hatch.co.nz/collections/summer-clothing-sale">https://hatch.co.nz/collections/summer-clothing-sale</a>';
	}
	else if (site.includes('jamiekay.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://jamiekay.co.nz/collections/clearance">https://jamiekay.co.nz/collections/clearance</a>';
	}
	else if (site.includes('thcc.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://thcc.nz/">https://thcc.nz/</a>';
	}
	else if (site.includes('toyco.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Clearance: <a href="https://www.toyco.co.nz/collections/clearance">https://www.toyco.co.nz/collections/clearance</a>';
	}
	else if (site.includes('burgerwisconsin.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/20243">Free Burger, but you now need to make a purchase in the previous 6 months to get the birthday deal</a>';
	}
	else if (site.includes('chatime.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.chatime.co.nz/">Free drink on your birthday for Loyaltea members</a>';
	}
	else if (site.includes('cobb.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.cobb.co.nz/online/promotions.csn">Free Main Meal (Free Main Meal and Dessert for children, Free Two Course Meal for Senior Citizens), when accompanied by three paying adult guests and dining at a participating Cobb & Co location seven days either side of your actual birthday</a>';
	}
	else if (site.includes('coffeeculture.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://coffeeculture.co.nz/hot-right-now/culturecard-2/">Free 8oz hot drink</a>';
	}
	else if (site.includes('columbuscoffee.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.columbuscoffee.co.nz/columbus-rewards">updated: Purchase one coffee and receive a 2nd one free on your birthday for members of Columbus Rewards</a>';
	}
	else if (site.includes('dennys.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/865">Buy One Get One Free Main Meal on your birthday, when dining with a paying guest (Save up to $29.80)</a>';
	}
	else if (site.includes('gengys.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.gengys.co.nz/#!special/c1dw6">Dine for $1 on your birthday when accompanied by three adult guests paying full price</a>';
	}
	else if (site.includes('healthpost.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/4105">Free $10 on your birthday for HealthPost account holders</a>';
	}
	else if (site.includes('jamaicablue.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/21489">Free Slice of Cake for members of the Caribbean Crew</a>';
	}
	else if (site.includes('joes.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.joes.co.nz/">$10 credit for your birthday when added in app</a>';
	}
	else if (site.includes('lonestar.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.lonestar.co.nz/loyal/">$20 credit if you sign up on the app</a>';
	}
	else if (site.includes('madmex.co.nz')) {
		  var DisplayPopup = true;
		  contentHTML += 'Birthday deal: <a href="https://madmex.co.nz/loyalty/">Free burrito on your birthday</a>';
	}
	else if (site.includes('mexicalifresh.co.nz')) {
		  var DisplayPopup = true;
		  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/3409">Free Burrito or other menu item on your birthday for members of the Cabana Club</a>';
	}
	else if (site.includes('mexico.net.nz')) {
		  var DisplayPopup = true;
		  contentHTML += 'Birthday deal: <a href="https://www.mexico.net.nz/lovemexico/">$10 credit for your birthday from if you join their app</a>';
	}
	else if (site.includes('members.muffinbreak.co.nz')) {
		  var DisplayPopup = true;
		  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/5388">Free Muffin for members of the Muffin Break Club</a>';
	}
	else if (site.includes('nandos.co.nz')) {
		  var DisplayPopup = true;
		  contentHTML += 'Birthday deal: <a href="https://www.nandos.co.nz/help">$15 credit if signed up to Peri-perks before birthday month and have made a purchase</a>';
	}
	else if (site.includes('nzvenueco.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/26121">$20 Credit</a>';
	}
	else if (site.includes('starbucks.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.starbucks.co.nz/rewards">Free drink upgrade</a>';
	}
	else if (site.includes('subway.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.subway.co.nz/">Free Cookie and 600ml Coke/750ml Pump on any sub/salad/wrap purchase (SubCard required)</a>';
	}
	else if (site.includes('thecheesecakeshop.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.thecheesecakeshop.co.nz/cake-vouchers">Free $5 Voucher (signup required)</a>';
	}
	else if (site.includes('valentines.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://valentines.co.nz/promotions">Eat Free on your birthday, when accompanied by three full paying guests</a>';
	}
	else if (site.includes('krispykreme.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.krispykreme.co.nz/inner-circle">Four-pack of glazed doughnuts for loyalty members or $10 off an online order</a>';
	}
	else if (site.includes('hiderefer.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://hiderefer.com/?https://help.banggood.com/help-center/what-is-the-vip-birthday-gift/">2 x $10-$30 coupons depending on VIP level</a>';
	}
	else if (site.includes('kathmandu.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.kathmandu.co.nz/summit-club">$20 voucher</a>';
	}
	else if (site.includes('kitchenaid.com.au')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://kitchenaid.com.au/">$50 off $250 Spend</a>';
	}
	else if (site.includes('mightyape.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.mightyape.co.nz/">$10 Voucher</a>';
	}
	else if (site.includes('noelleeming.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/10993">$20 off $100 Spend during the month of your birthday in-store with Noel Leeming account.</a>';
	}
	else if (site.includes('northbeach.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/33500">$20 voucher on your birthday (requires Locals membership, discount applies to ONE item, min spend $50).</a>';
	}
	else if (site.includes('themarket.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://themarket.com/nz/">$5 off coupon via email (no min spend)</a>';
	}
	else if (site.includes('cosmicnz.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cosmicnz.co.nz/loyalty">$10 gift voucher with $25 minimum spend for High Rollers members</a>';
	}
	else if (site.includes('farrofresh.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/20874">Free Coffee</a>';
	}
	else if (site.includes('habitualfix.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://habitualfix.co.nz/terms-and-conditions.html">Free Smoothie for members of Habitual Fix Addicts</a>';
	}
	else if (site.includes('krispykreme.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.krispykreme.co.nz/offer-terms-conditions">Free 4 pack Original Glazed doughnuts</a>';
	}
	else if (site.includes('longroom.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://longroom.co.nz/longpoints/">$50 Birthday Voucher (Must have minimum $200 spend over a two month period.)</a>';
	}
	else if (site.includes('parisianclinic.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.parisianclinic.co.nz/Free-on-Birthday">Free Treatments on your birthday, when accompanied by three paying friends</a>';
	}
	else if (site.includes('aucklandadventurejet.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.aucklandadventurejet.co.nz/ride-free-on-your-birthday">Free Jet Boat Ride on your birthday, when accompanied by a full paying adult</a>';
	}
	else if (site.includes('optihealth.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://optihealth.co.nz/Promotions/YourBirthdayTreatonus/tabid/5923/language/en-US/Default.aspx">Free One Hour Massage Treatment on your birthday</a>';
	}
	else if (site.includes('gloputt.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.gloputt.co.nz/">Play for Free on your birthday (conditions apply)</a>';
	}
	else if (site.includes('support.kellytarltons.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://support.kellytarltons.co.nz/hc/en-us/articles/115000664392-Can-I-visit-for-free-on-my-Birthday-">Free Entry on your birthday or day before/after if closed. Booking may be required.</a>';
	}
	else if (site.includes('thistleinn.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/1006">Free Main Meal on your birthday, when accompanied by three paying adult guests</a>';
	}
	else if (site.includes('mamabrown.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/4728">Buy One Get One Free Main Meal and Drink on your birthday, when dining with a paying guest</a>';
	}
	else if (site.includes('funicular.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.funicular.co.nz/loyalty-cards">Receive a free coffee on your birthday for Funicular Loyalty Cardholders</a>';
	}
	else if (site.includes('electricavenue.eftplus.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://electricavenue.eftplus.co.nz/">Free $25 voucher on your birthday, when accompanied by two paying guests for dinner for members of the Hoff Group VIP Club</a>';
	}
	else if (site.includes('dakotabar.eftplus.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://dakotabar.eftplus.co.nz/">Free $25 voucher on your birthday, when accompanied by two paying guests for dinner for members of the Hoff Group VIP Club</a>';
	}
	else if (site.includes('thegreenmanpub.eftplus.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/1058">Free voucher on your birthday for members of the Greenman VIP Club</a>';
	}
	else if (site.includes('habitualfix.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://habitualfix.co.nz/terms-and-conditions.html">Free Smoothie for members of Habitual Fix Addicts</a>';
	}
	else if (site.includes('theblackolive.net')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.theblackolive.net/free-birthday-meal.html">Free Meal Voucher</a>';
	}
	else if (site.includes('addictionhair.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://addictionhair.co.nz/">Free Style Dry for subscribers of Addiction Hair\'s Monthly Hair and Style newsletter</a>';
	}
	else if (site.includes('nakontong2.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.nakontong2.co.nz/assets/Special">Free ice cream on your birthday with purchased meal</a>';
	}
	else if (site.includes('offroadnz.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.offroadnz.co.nz/off-road-nz/raceline-karting-membership_idl=3_idt=3726_id=21850_.html">Free Race (membership required, $5 per year)</a>';
	}
	else if (site.includes('cinnamonrestaurant.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.cinnamonrestaurant.co.nz/Celebrate.html">Free Main Meal on your birthday, when accompanied by three paying adult guests</a>';
	}
	else if (site.includes('themousetrap.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.themousetrap.nz/specials">Free Main Meal on your birthday</a>';
	}
	else if (site.includes('crowdedhouse.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.crowdedhouse.co.nz/join.php">Free Main Meal on your birthday for members of the Crowded House VIP Club</a>';
	}
	else if (site.includes('indiatoday.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.indiatoday.co.nz/content/5/">Free Main Meal and Naan Bread, when accompanied by three paying adult guests and dining Sunday - Thursday on the week of your birthday</a>';
	}
	else if (site.includes('themayfair.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://themayfair.co.nz/join.php">Free Main Meal on your birthday for members of the Mayfair VIP Club</a>';
	}
	else if (site.includes('bachonbreakwater.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.bachonbreakwater.co.nz/assets/Special">Free Main Meal for members of the Birthday Club (signup required in-person at the restaurant)</a>';
	}
	else if (site.includes('frederics.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.frederics.co.nz/content/loyalty-club">Birthday shout for you and your mates for members of the Frederic\'s Loyalty Club</a>';
	}
	else if (site.includes('stagedoorcafe.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://stagedoorcafe.nz/pages/birthday-celebrants-dine-for-free">Eat Free on your birthday, when accompanied by two paying guests</a>';
	}
	else if (site.includes('indianindulgence.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.indianindulgence.co.nz/">Free Dine In on your birthday (conditions apply)</a>';
	}
	else if (site.includes('indiansummerhill.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://indiansummerhill.co.nz/">Free Dine In on your birthday (conditions apply)</a>';
	}
	else if (site.includes('topkapi.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.topkapi.co.nz/uploads/2/7/5/0/2750207/topkai_vipform_2.pdf">Free Meal on your birthday, when accompanied by two paying guests for members of the Topkapi VIP Club</a>';
	}
	else if (site.includes('cocopelli.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/85">Free $20 voucher on your birthday for members of the Cocopelli\'s Loyalty Club</a>';
	}
	else if (site.includes('monteithsmerrin.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.monteithsmerrin.co.nz/#!about/c6oc">Free Meal on your birthday for members of the Merrin Street Brewery Bar Loyalty Club</a>';
	}
	else if (site.includes('myflame.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.myflame.co.nz/about/birthday-club">Free Main Meal, when dining with a paying guest, or Free Main Meal and Dessert, when accompanied by three paying guests on the week of your birthday for members of the Flame Birthday Club. Free birthday cake also for tables of 8 or more guests.</a>';
	}
	else if (site.includes('freemansdiningroom.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.freemansdiningroom.co.nz/home/">Free Main Meal, when accompanied by three paying guests for members of The Gastro Club</a>';
	}
	else if (site.includes('christchurchcasino.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.christchurchcasino.co.nz/players-club/members-benefits/">Player’s Club members earn 10x Bonus Points while gaming on the day of their birthday. Any one day during your birthday month receive at least $15 to use on dining or gaming, when you swipe your membership card at the kiosk or insert it into any gaming machine card.</a>';
	}
	else if (site.includes('spiceparagon.eftplus.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/6507">Free Main Meal on your birthday, when accompanied by three paying adult guests for members of the Spice Club</a>';
	}
	else if (site.includes('thetwistedhoppub.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.thetwistedhoppub.co.nz/Crafted-Beer/Loyalty-Club">Free Meal and a Beer on your birthday (signup required $10, conditions apply)</a>';
	}
	else if (site.includes('procope.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.procope.co.nz/assets/Uploads/Procope-Loyalty-Joining-Form.pdf">Receive a free coffee on your birthday for Loyalty Club cardholders (signup required $5)</a>';
	}
	else if (site.includes('engineers.eft.plus')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://engineers.eft.plus/">Receive a free main meal ($35) on your birthday (free signup required)</a>';
	}
	else if (site.includes('hachihachi.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.cheapies.nz/node/21249">Free Chicken Meal</a>';
	}
	else if (site.includes('oxfordgroup.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.oxfordgroup.co.nz/the-oxford-club">Free $20 birthday voucher, valid for the month of your birthday (free signup required)</a>';
	}
	else if (site.includes('kaiserbrewgarden.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://www.kaiserbrewgarden.co.nz/kaiser-club/">Free Pizza, valid Mon-Thur the month of your birthday (free signup required)</a>';
	}
	else if (site.includes('jollyoctopustattoo.com')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="https://jollyoctopustattoo.com/">$50 birthday voucher to existing customers</a>';
	}
	else if (site.includes('dilusso.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.dilusso.co.nz/loyalty-card">Free $20 voucher on your birthday for DiLusso Dignitary members</a>';
	}
	else if (site.includes('jesterhouse.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://jesterhouse.co.nz/eat-for-free">Eat Free on your birthday for members of the VIP Birthday Club</a>';
	}
	else if (site.includes('fairweathers.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.fairweathers.co.nz/bar/35-bar-and-events">Buy One Get One Free Main Meal, when dining with a paying guest for subscribers of FairWeather\'s newsletter</a>';
	}
	else if (site.includes('paroa.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Birthday deal: <a href="http://www.paroa.co.nz/bars-in-greymouth/paroa-hotel-loyalty-club">Free Main Meal on your birthday, when accompanied by three paying adult guests for members of the Paroa Hotel Loyalty Club</a>';
	}
	else if (site.includes('bunnings.co.nz') || site.includes('mitre10.co.nz')) {
	  var DisplayPopup = true;
	  contentHTML += 'Mitre 10 price beat by 15% <br><br> <strong>Also check Daiso!</strong>';
	}
  else if (site.includes('trademe.co.nz') && !site.includes('trademe.co.nz/a/property/')) {
    var DisplayPopup = true;
    contentHTML += '<a href="https://www.addresscheck.co.nz/">https://www.addresscheck.co.nz/</a>';
  }
  else if (site.includes('amazon.com')) {
    var DisplayPopup = true;
    contentHTML += 'Check Keepa for price history and cheaper deals! <br><br> Remember to use TopCashBack! <br><br>';
  }


  if ((site.includes('temu.com') && (!site.toLowerCase().includes('temu.com/nz/bgt_orders.html') && !site.toLowerCase().includes('temu.com/bgt_orders.html'))) || site.includes('aliexpress.com') || site.includes('pbtech.co.nz')) {
    contentHTML += '<br><br>';
  }

  if (site.includes('aliexpress.com') || site.includes('temu.com') || site.includes('amazon.com') || site.includes('ebay.com')) {
    contentHTML += '<a href="https://www.topcashback.com.au/temu">https://www.topcashback.com.au/temu</a><br><br>';
  }

  if (site.includes('aliexpress.com') || site.includes('temu.com') || site.includes('amazon.com') || site.includes('ebay.com') || site.includes('pbtech.co.nz')) {
    contentHTML += 'Check Cheapies or OzBargain extension for coupons <br><br> Remember to use Dosh for payment!';
  }







	// Version 2

	function createPopup()
  {
    if (DisplayPopup === true)
    {

      var reminderDiv = document.createElement('div');
      reminderDiv.id = 'yourPopupId';

      var dragHandle = document.createElement('div');
      dragHandle.style.height = '20px';
      dragHandle.style.backgroundColor = '#ccc';
      dragHandle.style.cursor = 'move';
      dragHandle.innerHTML = 'Drag here';
      dragHandle.style.textAlign = 'center';
      reminderDiv.appendChild(dragHandle);

      var toggleButton = document.createElement('button');
      toggleButton.innerHTML = 'Show / Hide';
      toggleButton.style.marginTop = '10px';
      toggleButton.style.marginBottom = '10px';
      reminderDiv.appendChild(toggleButton);

      var contentDiv = document.createElement('div');
      //contentHTML += '<br><br> Long running deals: https://www.cheapies.nz/deals/longrunning <br><br> Forum: https://www.cheapies.nz/forum <br><br>';

      if (!site.toLowerCase().includes('temu.com/nz/bgt_orders.html') && !site.toLowerCase().includes('temu.com/bgt_orders.html')) {
        contentHTML += '<br><br> <a href="https://www.cheapies.nz/deals/longrunning">Long running deals</a> <br><br> <a href="https://www.cheapies.nz/forum">Forum</a> <br><br>';
      }

      contentDiv.innerHTML = contentHTML;
      reminderDiv.appendChild(contentDiv);

      reminderDiv.style.position = 'fixed';
      reminderDiv.style.padding = '10px 10px 0px 10px';
      reminderDiv.style.backgroundColor = 'cyan';
      reminderDiv.style.border = '2px solid black';
      reminderDiv.style.zIndex = '10000';
      reminderDiv.style.width = localStorage.getItem('popupWidth_' + window.location.origin) || '290px';
      reminderDiv.style.maxWidth = '700px';
      reminderDiv.style.maxHeight = '850px';
      reminderDiv.style.wordWrap = 'break-word';
      reminderDiv.style.resize = 'both';
      reminderDiv.style.overflow = 'auto';
      reminderDiv.style.top = localStorage.getItem('popupTop_' + window.location.origin) || '50%';
      reminderDiv.style.left = localStorage.getItem('popupLeft_' + window.location.origin) || '10px';


      // Check if isContentVisible is not found in local storage, default to true
      var isContentVisible = localStorage.getItem('isContentVisible_' + window.location.origin);
      if (isContentVisible === null) {
        isContentVisible = true;
      } else {
        isContentVisible = isContentVisible === 'true';
      }

      if (!isContentVisible) {
        contentDiv.style.display = 'none';
        reminderDiv.style.height = 'auto';
        localStorage.setItem('popupOriginalWidth_' + window.location.origin, reminderDiv.style.width);
        dragHandle.style.width = toggleButton.offsetWidth + 'px';
        reminderDiv.style.width = 'auto';
        dragHandle.style.width = '';
      }

      toggleButton.addEventListener('click', function () {
        isContentVisible = !isContentVisible;
        localStorage.setItem('isContentVisible_' + window.location.origin, isContentVisible);

        if (!isContentVisible) {
          contentDiv.style.display = 'none';
          reminderDiv.style.height = 'auto';
          localStorage.setItem('popupOriginalWidth_' + window.location.origin, reminderDiv.style.width);
          dragHandle.style.width = toggleButton.offsetWidth + 'px';
          reminderDiv.style.width = 'auto';
        } else {
          contentDiv.style.display = 'block';
          reminderDiv.style.height = 'auto';
          reminderDiv.style.width = localStorage.getItem('popupOriginalWidth_' + window.location.origin);
          dragHandle.style.width = '';
        }
      });

      dragHandle.addEventListener('mousedown', function (e) {
        var offsetX = e.clientX - parseInt(window.getComputedStyle(reminderDiv).left);
        var offsetY = e.clientY - parseInt(window.getComputedStyle(reminderDiv).top);

        function mouseMoveHandler(e) {
          reminderDiv.style.top = (e.clientY - offsetY) + 'px';
          reminderDiv.style.left = (e.clientX - offsetX) + 'px';
        }

        function mouseUpHandler() {
          window.removeEventListener('mousemove', mouseMoveHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
          localStorage.setItem('popupTop_' + window.location.origin, reminderDiv.style.top);
          localStorage.setItem('popupLeft_' + window.location.origin, reminderDiv.style.left);
        }

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
      });

      document.body.appendChild(reminderDiv);

      // Calculate maximum allowable top and left positions
      var maxTop = window.innerHeight - reminderDiv.offsetHeight;
      var maxLeft = window.innerWidth - reminderDiv.offsetWidth;

      //var storedTop = parseInt(localStorage.getItem('popupTop_' + window.location.origin)) || 0;
      //var storedLeft = parseInt(localStorage.getItem('popupLeft_' + window.location.origin)) || 0;

      var storedTop = localStorage.getItem('popupTop_' + window.location.origin);
      var storedLeft = localStorage.getItem('popupLeft_' + window.location.origin);

      storedTop = storedTop !== null ? parseInt(storedTop) : 10;
      storedLeft = storedLeft !== null ? parseInt(storedLeft) : 10;


      //reminderDiv.style.top = Math.min(Math.max(storedTop, 0), maxTop) + 'px';
      reminderDiv.style.top = Math.min(Math.max(storedTop, 30), maxTop) + 'px';
      reminderDiv.style.left = Math.min(Math.max(storedLeft, 0), maxLeft) + 'px';



      reminderDiv.addEventListener('mousemove', function () {
        if (isContentVisible) {
        localStorage.setItem('popupWidth_' + window.location.origin, reminderDiv.style.width);
        localStorage.setItem('popupHeight_' + window.location.origin, reminderDiv.style.height);
        }
      });
    }
  }





	function displayPopup() {

    if (DisplayPopup === true)
    {
      var existingPopup = document.getElementById('yourPopupId');

      if (!existingPopup) {

        createPopup();

      } else {

        reminderDiv.style.position = 'fixed'; // or 'fixed'

        var popupTop = localStorage.getItem('popupTop_' + window.location.origin) || '50%';
        var popupLeft = localStorage.getItem('popupLeft_' + window.location.origin) || '10px';
        var popupWidth = localStorage.getItem('popupWidth_' + window.location.origin) || '290px';
        var popupHeight = localStorage.getItem('popupHeight_' + window.location.origin) || 'auto';

        var maxTop = window.innerHeight - existingPopup.offsetHeight;
        var maxLeft = window.innerWidth - existingPopup.offsetWidth;

        //var storedTop = parseInt(localStorage.getItem('popupTop_' + window.location.origin)) || 0;
        //var storedLeft = parseInt(localStorage.getItem('popupLeft_' + window.location.origin)) || 0;

        var storedTop = localStorage.getItem('popupTop_' + window.location.origin);
        var storedLeft = localStorage.getItem('popupLeft_' + window.location.origin);

        storedTop = storedTop !== null ? parseInt(storedTop) : 10;
        storedLeft = storedLeft !== null ? parseInt(storedLeft) : 10;


        existingPopup.style.top = Math.min(Math.max(storedTop, 0), maxTop) + 'px';
        existingPopup.style.left = Math.min(Math.max(storedLeft, 0), maxLeft) + 'px';


        //existingPopup.style.top = popupTop;
        //existingPopup.style.left = popupLeft;
        existingPopup.style.width = popupWidth;
        existingPopup.style.height = popupHeight;
      }
	  }
  }




  // Old but works fine, just without delay before page loads
  /*
  if (DisplayPopup === true)
  {
	  if (!sessionStorage.getItem('popupCreated')) {
		displayPopup();
		sessionStorage.setItem('popupCreated', 'true');
	  }

	  window.addEventListener('beforeunload', function () {
		sessionStorage.removeItem('popupCreated');
	  });
  }
  */

  // New version. Waits 100ms after page is loaded before showing popup
  if (DisplayPopup === true)
  {
    setTimeout(function() {
        // Your logic to check if popup should be displayed
        if (DisplayPopup === true) {
            if (!sessionStorage.getItem('popupCreated')) {
                displayPopup();
                sessionStorage.setItem('popupCreated', 'true');
            }

            window.addEventListener('beforeunload', function() {
                sessionStorage.removeItem('popupCreated');
            });
        }
    }, 100); // Wait for 2 seconds before executing
  }










  // Show price adjustment on Temu

  if (site.toLowerCase().includes('temu.com/nz/bgt_orders.html') || site.toLowerCase().includes('temu.com/bgt_orders.html')) {

    var DisplayPopup = false; // Initially set to false

    setTimeout(function() {
      const orderBlocks = document.querySelectorAll('div._3VQB0npX');

      if (orderBlocks.length === 0) {
        console.log('No order blocks found');
        return;
      }

      orderBlocks.forEach((block) => {
        const spans = block.querySelectorAll('span._2tnFgQdq');
        let orderTime = null;
        let orderID = null;

        spans.forEach((span) => {
          const label = span.querySelector('span._3xXCgl2V')?.textContent.trim();
          const value = span.querySelector('span._VlINftPl span')?.textContent.trim();

          if (label?.includes('Order Time')) orderTime = value;
          if (label?.includes('Order ID')) orderID = value;
        });

        if (orderTime && orderID) {
          console.log('Found order:', { orderTime, orderID });
          if (isWithin30Days(orderTime)) {
            const link = `https://www.temu.com/w/bgas_refund_difference.html?parent_order_sn=${orderID}&biz_source=1-000-5&after_sales_type=1&belongTab=AO&_x_sessn_id=dwjzf47d2c`;
            contentHTML += `<br><br><a href="${link}">${link}</a>`;
            DisplayPopup = true;
          }
        }
      });

      if (DisplayPopup) {
        console.log('Creating popup on Temu orders page!');
        createPopup();
        displayPopup();
      }
    }, 5000);

	}




  function isWithin30Days(dateString) {
      var orderDate = new Date(dateString);
      var currentDate = new Date();

      // Calculate the difference in milliseconds
      var difference = currentDate - orderDate;

      // Calculate the difference in days
      var daysDifference = difference / (1000 * 60 * 60 * 24);

      return daysDifference <= 30;
  }












  // OLD

	/*
	if (DisplayPopup === true)
	{
		function createPopup() {
		  var reminderDiv = document.createElement('div');
		  reminderDiv.id = 'yourPopupId';

		  var dragHandle = document.createElement('div');
		  dragHandle.style.height = '20px';
		  dragHandle.style.backgroundColor = '#ccc';
		  dragHandle.style.cursor = 'move';
		  dragHandle.innerHTML = 'Drag here';
		  dragHandle.style.textAlign = 'center';
		  reminderDiv.appendChild(dragHandle);

		  var toggleButton = document.createElement('button');
		  toggleButton.innerHTML = 'Show / Hide';
		  toggleButton.style.marginTop = '10px';
		  toggleButton.style.marginBottom = '10px';
		  reminderDiv.appendChild(toggleButton);

		  var contentDiv = document.createElement('div');
		  contentHTML += '<br><br> Long running deals: https://www.cheapies.nz/deals/longrunning <br><br>';
		  contentDiv.innerHTML = contentHTML;
		  reminderDiv.appendChild(contentDiv);

		  reminderDiv.style.position = 'fixed';
		  reminderDiv.style.padding = '10px 10px 0px 10px';
		  reminderDiv.style.backgroundColor = 'cyan';
		  reminderDiv.style.border = '2px solid black';
		  reminderDiv.style.zIndex = '10000';
		  reminderDiv.style.width = localStorage.getItem('popupWidth') || '290px';
		  reminderDiv.style.maxWidth = '500px';
		  reminderDiv.style.wordWrap = 'break-word';
		  reminderDiv.style.resize = 'both';
		  reminderDiv.style.overflow = 'auto';
		  reminderDiv.style.top = localStorage.getItem('popupTop') || '50%';
		  reminderDiv.style.left = localStorage.getItem('popupLeft') || '10px';

		  var isContentVisible = true;

		  toggleButton.addEventListener('click', function () {
			// Toggle the value of isContentVisible (from true to false or vice versa)
			isContentVisible = !isContentVisible;

			if (!isContentVisible) {
			  // If isContentVisible is now false, hide the contentDiv
			  contentDiv.style.display = 'none';

			  // Set the height of reminderDiv to 'auto' to shrink the popup
			  reminderDiv.style.height = 'auto';

			  // Save the width before shrinking
			  localStorage.setItem('popupOriginalWidth', reminderDiv.style.width);

			  // Set the width of dragHandle to match Show/Hide button
			  dragHandle.style.width = toggleButton.offsetWidth + 'px';

			  // Shrink the width of reminderDiv
			  reminderDiv.style.width = dragHandle.offsetWidth + 'px';

			} else {
			  // If isContentVisible is now true, show the contentDiv
			  contentDiv.style.display = 'block';

			  // Set the height of reminderDiv to 'auto' to expand the popup
			  reminderDiv.style.height = 'auto';

			  // Restore the width to the saved original width
			  reminderDiv.style.width = localStorage.getItem('popupOriginalWidth');

			  // Restore the width of dragHandle
			  dragHandle.style.width = '';
			}
		  });

		  dragHandle.addEventListener('mousedown', function (e) {
			var offsetX = e.clientX - parseInt(window.getComputedStyle(reminderDiv).left);
			var offsetY = e.clientY - parseInt(window.getComputedStyle(reminderDiv).top);

			function mouseMoveHandler(e) {
			  reminderDiv.style.top = (e.clientY - offsetY) + 'px';
			  reminderDiv.style.left = (e.clientX - offsetX) + 'px';
			}

			function mouseUpHandler() {
			  window.removeEventListener('mousemove', mouseMoveHandler);
			  window.removeEventListener('mouseup', mouseUpHandler);
			  localStorage.setItem('popupTop', reminderDiv.style.top);
			  localStorage.setItem('popupLeft', reminderDiv.style.left);
			}

			window.addEventListener('mousemove', mouseMoveHandler);
			window.addEventListener('mouseup', mouseUpHandler);
		  });

		  document.body.appendChild(reminderDiv);

		  // Add event listeners for manual resizing
		  reminderDiv.addEventListener('mousemove', function () {
			localStorage.setItem('popupWidth', reminderDiv.style.width);
			localStorage.setItem('popupHeight', reminderDiv.style.height);
		  });
		}

		function displayPopup() {
		  var existingPopup = document.getElementById('yourPopupId');
		  if (!existingPopup) {
			createPopup();
		  } else {
			existingPopup.style.top = localStorage.getItem('popupTop') || '50%';
			existingPopup.style.left = localStorage.getItem('popupLeft') || '10px';
			existingPopup.style.width = localStorage.getItem('popupWidth') || '290px';
			existingPopup.style.height = localStorage.getItem('popupHeight') || 'auto';
		  }
		}

		if (!localStorage.getItem('popupCreated')) {
		  createPopup();
		  localStorage.setItem('popupCreated', 'true');
		} else {
		  displayPopup();
		}
	}
	*/




})();