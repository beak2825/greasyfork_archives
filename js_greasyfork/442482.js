// ==UserScript==
// @name         Kanklippy
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1
// @description  Adds Kankappy to your Kanka experience to share some useful tips
// @author       Salvatos
// @match        https://kanka.io/*/campaign/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/442482/Kanklippy.user.js
// @updateURL https://update.greasyfork.org/scripts/442482/Kanklippy.meta.js
// ==/UserScript==

/* User preferences */
// % of messages that are quips
const quipThresh = 10;
// % of tips that aren’t specific to the current page
const specificTipThresh = 40;
// How long the initial message remains on-screen after page load in milliseconds
const initialMessageDuration = 10000;

GM_addStyle(`
#klippy {
	position: fixed;
	bottom: 10px;
	right: 10px;
	z-index: 420;
	cursor: pointer;
}
#klippy .img {
	height: 69px;
	width: 96px;
	background-image: url('https://kanka-user-assets.s3.eu-central-1.amazonaws.com/entities/files/wcYsVFCGApEgUZs9BX9OxDRPsROlJFmGYKIuNBev.png');
	background-position: 0 0;
}
#klippy .img:hover {
	background-position: 96px 0;
}
#klippy-actions {
	position: absolute;
	right: 95px;
	top: 30%;
	display: flex;
}
.klippy-action {
	cursor: pointer;
	background: #F2F2F2;
	color: black;
	font-size: 17px;
	padding: 4px 4px 1px;
	border-radius: 25%;
	margin-right: 5px;
	display: none;
	border: 1px solid #868686;
}
.klippy-action:hover {
	background: #C8C7C7;
}
#klippy:hover + #clippy-balloon {
	display: block !important;
}
#clippy-balloon {
    position: absolute;
    z-index: 1000;
    cursor: pointer;
    background: var(--btn-default-background);
    color: var(--btn-default-text);
    padding: 8px;
    border: 1px solid #868686;
    border-radius: 5px;
	position: fixed;
	bottom: 100px;
	right: 15px;
}

#clippy-content {
    max-width: 200px;
    min-width: 120px;
    font-family: "Microsoft Sans", sans-serif;
    font-size: 12px;
    line-height: 20px;
    hyphens: auto;
}
#clippy-balloon::before {
	content: "";
	width: 0px;
	height: 0px;
	position: absolute;
	border-left: 10px solid transparent;
	border-right: 12px solid #9d9d9d;
	border-top: 10px solid #9d9d9d;
	border-bottom: 10px solid transparent;
	right: 50px;
	bottom: -20px;
}
#clippy-balloon::after {
	content: "";
	width: 0px;
	height: 0px;
	position: absolute;
	border-left: 10px solid transparent;
	border-right: 10px solid var(--btn-default-background);
	border-top: 10px solid var(--btn-default-background);
	border-bottom: 10px solid transparent;
	right: 52px;
	bottom: -20px;
}
#clippy-balloon .emoji {
	font-size: 16px;
}
`);

var tips = new Array();
tips.specific = new Array();
var quips = new Array();

/* Define area-specific tips & quips */
// User settings
if (/settings/.test(window.location.href) === true) {
	tips.specific.push(
		'The <strong>Layout</strong> page contains several useful settings to customize your experience on Kanka.',
		'Visit the <strong>Apps</strong> page to link your Discord account to Kanka and receive the relevant group memberships for your subscription level.',
		'Visit the <strong>Boost</strong> page to assign your boosters to your various campaigns and see the perks of <strong>Boosted</strong> and <strong>Superboosted</strong> campaigns.',
		'Boosts last as long as your subscription. You can reassign them to different campaigns anytime.'
	);
}
// Campaign editor
if (/campaigns\/\d*\/edit/.test(window.location.href) === true) {
	tips.specific.push(
		'The campaign’s description in the <strong>Entry</strong> tab appears only in the Overview page. Go to the <strong>Dashboard</strong> tab to edit the description at the top of your dashboards.',
		'The <strong>Sharing</strong> tab controls whether your campaign is private or public, as well as details such as language and game system.',
		'The <strong>Interface</strong> and <strong>Boosted</strong> tabs have useful settings that apply to this campaign as a whole. Your user profile also contains useful options specific to your account.'
	);
}
// Entity editor
if (/\/edit/.test(window.location.href) === true) {
	tips.specific.push(
		'Use Ctrl+Shift+V in the editor to paste without formatting.',
		'If you copy-paste text from another entity, you will need to remake any mentions in order for their tooltips to work.'
	);
}
// Entity main page
if ($("body.entity-story").length > 0) {
	tips.specific.push(
		'Click the cogwheel next to the entity’s name to access all available actions.',
        'If you want several entities to share the same format, attributes, tags, etc., you can set one of them as a template from the cogwheel menu and then select that template when creating new ones.',
		'Posts are sections of an entity that have distinct permissions and can be collapsed and expanded at will. You can create them using the top-right button and reorder them from the cogwheel action menu.',
		'Posts are useful to organize information, but aren’t included in dashboard widgets and map markers.',
		'The entity’s <strong>Overview</strong> shows its entry, posts, pins, profile information and mentions.',
		'The entity’s <strong>Connections</strong> page shows various related entities in a table or graph.',
		'The entity’s <strong>Abilities</strong> page shows all attached character abilities and their uses.',
		'The entity’s <strong>Reminders</strong> page points to all related events and important dates.',
		'The entity’s <strong>Attributes</strong> page lists all attributes, and can be customized using Marketplace attribute templates in Boosted campaigns.',
		'The entity’s <strong>Inventory</strong> can be used to keep track of a character’s equipment, but also things like a store’s inventory.',
		'The entity’s <strong>Assets</strong> is where you can upload and retrieve various files or external links. Subscribers get more storage!',
		'The entity’s <strong>Permissions</strong> page lets you control who is allowed to see it. Private entities will also be hidden from lists, mentions, etc.'
	);
}
// Dashboards
if ($("#campaign-dashboard").length > 0) {
	tips.specific.push(
		'Your campaign can have multiple dashboards to showcase all kinds of information, and various user groups can have different default dashboards and access rights.',
	);
}
// Maps
if (/maps/.test(window.location.href) === true) {
	tips.specific.push(
		'Maps can have multiple layers and marker groups to navigate between levels and filter landmark types.',
        'Want your map to center on a specific marker when you mention that place? Use an advanced mention like <strong>[map:123|My Place|page:explore?focus=456]</strong>.',
        'From the Settings tab of a map, you can make it focus on a marker or specific coordinates when opened.'
	);
}
// Calendars
if (/calendars/.test(window.location.href) === true) {
	tips.specific.push(
		'Click the "..." button on a calendar date to make it the current date, add an event or set its weather.'
	);
	quips.push(
		'Calendars are <em>so</em> 2020. <em>Carpe diem!</em>'
	);
}

/* Define general tips */
tips.general = [
	'Quick links can point to important entities, but also filtered lists, a random entity or a dashboard.',
	'You can <strong>follow</strong> public campaigns from their dashboard, which adds them to your campaign picker in the main menu.',
	'You can export your campaign’s entities as a JSON archive, but there is currently no import/export tool for specific third-party platforms.',
	'Deleted entities can be recovered from a Boosted campaign’s settings for up to 30 days, even if the campaign wasn’t Boosted at the time!',
	'Use the <strong>Campaign > Members</strong> page to invite other users by link or by e-mail, and the <strong>Roles</strong> page to manage user groups and permissions.',
	'You can deactivate entity types you don’t need in the <strong>Campaign > Modules</strong> page, to remove them from the main menu.',
	'<strong>Boosted</strong> campaigns can be customized with CSS styles in the <strong>Campaign > Theming</strong> page and with Marketplace themes in the <strong>Plugins</strong> page.',
	'Every month, subscribers at all tiers get to take part in a <strong>Community Vote</strong> to steer Kanka’s development.',
	'You can set your preferred theme in your profile settings, though individual Boosted campaigns may override a user’s choice.',
	'To exclude partial matches from search, use an equal sign in your query (e.g. "=Max" excludes "Maximum").',
    'If you are an admin in a campaign, the <strong>Campaign > Members</strong> page allows you to select a member and "View Campaign as user" to check what they have access to.'
];


/* Define general quips */
quips.push(
	'What you’re trying to do doesn’t match our vision for Kanka',
	'Did you wash your hands before clicking me?',
	'I used to be an adventurer like you. Then I took a scrollbar in the face.',
	'Don’t ask me, I’ve never seen this page',
	'Kanka is love, Kanka is life'
);

// Insert elements
$("#app")[0].insertAdjacentHTML("beforeend", '<div id="klippy"><div class="img"></div></div>');
$("#klippy")[0].insertAdjacentHTML("beforeend", '<div id="klippy-actions"><div class="klippy-action" title="info">&nbsp;ℹ&nbsp;</div><div class="klippy-action" title="banter">😏</div><div class="klippy-action" title="tip">🦉</div></div>');
$("#app")[0].insertAdjacentHTML("beforeend", `<div id="clippy-balloon"><div id="clippy-content"></div></div>`);


// On load, show a random tip/quip for 10 seconds
klippySays(tips, quips);
// Hide the default message unless the menu has been opened in the meantime
setTimeout(function() { if (!$(".klippy-action:visible")[0]) { $("#clippy-balloon").hide(800); }}, initialMessageDuration);


// Add click events
$("#klippy .img")[0].addEventListener('click', ()=>{
	// Make sure the balloon becomes visible when we open the menu and hidden when we close it, regardless of its current state/timer
	if ($(".klippy-action:visible")[0]) {
		$("#clippy-balloon").hide(400);
	}
	else {
		$("#clippy-balloon").show(400);
	}
	$(".klippy-action").toggle(400);
});
$(".klippy-action")[0].addEventListener('click', ()=>{
	$("#clippy-balloon").hide(100);
	klippySays(tips, quips, "info");
});
$(".klippy-action")[1].addEventListener('click', ()=>{
	$("#clippy-balloon").hide(100);
	klippySays(tips, quips, "quip");
});
$(".klippy-action")[2].addEventListener('click', ()=>{
	$("#clippy-balloon").hide(100);
	klippySays(tips, quips, "tip");
});


function klippySays(tips, quips, sayWhat) {
	// At page load, choose randomly between tips and quips (90/10%)
	if (!sayWhat) {
		var roll = Math.floor(Math.random() * 100);
		sayWhat = (roll < quipThresh + 1) ? "quip" : "tip";
		console.log("Kanklippy rolled " + roll + " for message type.");
	}

	var sayThis;
	switch (sayWhat) {
		case "quip":
			// Choose a random quip for the current page and say it
			sayThis = quips[Math.floor(Math.random() * quips.length)] + ' <span class="emoji">😏</span>';
			break;
		case "tip":
			// Choose between a general tip or one specific to the current area (40/60%)
			roll = Math.floor(Math.random() * 100);
			console.log("Kanklippy rolled " + roll + " for tip specificity.");
			// Also default to general if nothing is set for the current page
			sayThis = (roll < specificTipThresh + 1 || tips.specific.length < 1) ?
				tips.general[Math.floor(Math.random() * tips.general.length)] : tips.specific[Math.floor(Math.random() * tips.specific.length)];
			break;
		case "info":
			// Plugin info
			sayThis = `<p style='font-size: 10px; font-weight: bold; text-align: center;'>Kanklippy v.1.4.2022 by Salvatos</p>
			<p style='font-size: 12px;'>Click <span class="emoji">ℹ</span> for info, <span class="emoji">😏</span> for banter, or <span class="emoji">🦉</span> for a useful tip.</p>`;
			break;
		default:
			sayThis = "Error: couldn’t find anything to say.";
	}
	$("#clippy-content").html(sayThis);
	$("#clippy-balloon").show(400);
}


// Props for making Clippy.JS work in Tampermonkey, though sources needed to be updated https://stackoverflow.com/a/52868815