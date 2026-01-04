// ==UserScript==
// @name        Server Buttons for Alis.io
// @version     1.7
// @description Old alis.io buttons in 2019 edition
// @author      Havoc
// @match       http://alis.io/*
// @match       http://*.alis.io/*
// @run-at      document-end
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/141745
// @downloadURL https://update.greasyfork.org/scripts/368898/Server%20Buttons%20for%20Alisio.user.js
// @updateURL https://update.greasyfork.org/scripts/368898/Server%20Buttons%20for%20Alisio.meta.js
// ==/UserScript==

$('#gamemodeinstancelist').remove();
$('.uk-tab').remove();
$('p.loading.saving').remove();

const havocStyle = $(`
	<style>
		.havoc-region-btn {
			height: 55px;
			margin-top: 60px;
            border: 1px solid #303030;
		}
		.havoc-gm-btn {
			height: 55px;
			margin-top: 5px;
			background: 0 0;
			color: #fff;
			border: 1px solid #1660a0;
            font-size: 12px;
		}
		.havoc-gm-btn:hover {
border: 1px solid #42a7f4;}

.instant{border-color: #3d97ff;color: #89bfff;}
.instant:hover{border-color: #7ab7ff;color: #9ecaff;}

.crazy{border-color: #ff6b60;color: #ff9b93;}
.crazy:hover{border-color: #ff9991;color: #ffb8b2;}

.bots{border-color: #ffe366;color: #ffed99;}
.bots:hover{border-color: #ffeb8c;color: #fff1b2;}

.selffeed{border-color: #6bff68;color: #acffaa;}
.selffeed:hover{border-color: #98ff96;color: #c0ffbf;}
	</style>
`);
$('html > head').append(havocStyle);

unsafeWindow.iterateResponse = (obj, selectedRegion, gamemodes = []) => {
	Object.keys(obj).forEach(item => {
		const temp = gamemodes.concat(item);
		if (obj[item] && typeof obj[item] === 'object') {
			iterateResponse(obj[item], selectedRegion, temp);
			return;
		}
		$('#havoc-gamemodes').append(`<div id = "havoc-${selectedRegion}-${gamemodes[0].toLowerCase()}-${item}" class="uk-button havoc-gm-btn uk-button-large uk-width-small ${gamemodes[0]}" onclick="connector('ws:${obj[item].split(':')[1]}:${obj[item].slice(-4)}'); $('.uk-card > .uk-width-small').click();"> ${selectedRegion} ${gamemodes[0]} ${item} </div>`).fadeIn(600);
		$('#havoc-back-btn').fadeIn(600);
	});
};

unsafeWindow.regionClicked = (region) => {
	$('#havoc-servers-regions').hide();
	$.getJSON('http://alis.io/statsports.json', (d) => {
		iterateResponse(d[region.slice(6)], region.split(/[--]/)[1]);
	});
};

unsafeWindow.back = () => {
	$('#havoc-back-btn').fadeOut(100);
	$('#havoc-gamemodes').fadeOut(600);
	$('#havoc-servers-regions').show();
	$('#havoc-gamemodes').empty();
};

$('#gamemodelistcontent').append(`
<div id="havoc-servers">
    <div id="havoc-gamemodes" style="max-height: 380px; overflow-y: scroll; display: inline-block;">
    </div>
    <div id="havoc-servers-regions" style="">
        <div id="havoc-eu-server" class="uk-button uk-button-default havoc-region-btn uk-button-large uk-width-small" onclick ="regionClicked(this.id)">EU</div>
        <div id="havoc-na-server" class="uk-button uk-button-default havoc-region-btn uk-button-large uk-width-small" onclick ="regionClicked(this.id)">NA</div>
        <div id="havoc-as-server" class="uk-button uk-button-default havoc-region-btn uk-button-large uk-width-small" onclick ="regionClicked(this.id)">AS</div>
    </div>
</div>
`);

$('#gamemodelistcontent').append(`
<button id="havoc-back-btn" class="uk-button uk-button-default uk-button-small uk-grid-margin uk-first-column" onclick="back()" style="
    margin-top: 30px;
    margin-left: 18px;
    border: 1px solid #303030;
    display: none;
">← Back</button>
`);
