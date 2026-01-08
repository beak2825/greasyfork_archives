// ==UserScript==
// @name         Pano Detective
// @namespace    https://greasyfork.org/users/1179204
// @version      2.5.8
// @description  Find the exact time a Google Street View image was taken (default coverage)
// @author       KaKa
// @include      *://maps.google.com/*
// @include      *://*.google.*/maps/*
// @exclude      https://ogs.google.com
// @exclude      https://accounts.google.com
// @exclude      https://clients5.google.com
// @icon         https://www.svgrepo.com/show/485785/magnifier.svg
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/chinese-lunar@0.1.4/lib/chinese-lunar.min.js
// @require      https://cdn.jsdelivr.net/npm/browser-geo-tz@0.1.0/dist/geotz.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      vs-update-map.netlify.app
// @connect      cdn.jsdelivr.net
// @connect      google.com
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/497741/Pano%20Detective.user.js
// @updateURL https://update.greasyfork.org/scripts/497741/Pano%20Detective.meta.js
// ==/UserScript==
(function() {

    const DEFAULT={
        DATE_FORMAT: 0,
        TIME_FORMAT: 1,
        ACCURACY: 2,
        LENGTH_UNITS: 'METERS',
        MAP_MAKING_API_KEY: 'PASTE_YOUR_KEY_HERE',
        NUMBER_OF_RECENT_MAPS: 3,
        NEARBY_CHECK:0,
        FULL_CHECK:true,
        SPEED_SHOW:true
    };

    let CONFIG=JSON.parse(localStorage.getItem("PANO_DETECTIVE_CONFIG"));
    if(!CONFIG) CONFIG = DEFAULT

    GM_addStyle(`
.mwstmm-modal {
	position: fixed;
	inset: 0;
	z-index: 99999;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.mwstmm-modal .dim {
	position: fixed;
	inset: 0;
	z-index: 0;
	background: rgba(0,0,0,0.75);
}

.mwstmm-modal .text {
	position: relative;
	z-index: 1;
}

.mwstmm-modal .inner {
	box-sizing: border-box;
	position: relative;
	z-index: 1;
	background: #fff;
	padding: 20px;
	margin: 20px;
	width: calc(100% - 40px);
	max-width: 500px;
	overflow: auto;
	color: #000;
	flex: 0 1 auto;
}

#mwstmm-loader {
	color: #fff;
	font-weight: bold;
}
.mwstmm-settings {
	position: absolute;
	top: 1rem;
	left: 1rem;
	z-index: 9;
	display: flex;
	flex-direction: column;
	gap: 5px;
	align-items: flex-start;
}
#note-btn {
 	position: absolute;
    width:40px;
    height:40px;
	top: 0.85rem;
    right: 7.2rem;
 	z-index: 9;
 	display: flex;
    border: none;
    border-radius: 50%;
    background: #00000099;
    background-repeat: no-repeat;
    background-position:50%;
 	flex-direction: column;
 	gap: 5px;
 	align-items: flex-start;
 }
#note-btn:hover{
    cursor: pointer;
    opacity:0.8;
}
#note-btn::after{
    display:none;
    content: attr(data-text);
    position:absolute;
    top:120%;
    left:50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    font-weight:normal;
    font-size: 11px;
    line-height: 1;
    height: auto;
    white-space: nowrap;
    transition: opacity 0.5s ease;
}

#note-btn:hover::after {
    opacity: 1;
    display: block;
}
#settings-btn {
 	position: absolute;
    width:40px;
    height:40px;
	top: 0.85rem;
    right: 7.2rem;
 	z-index: 9;
 	display: flex;
    border: none;
    border-radius: 50%;
    background: #00000099;
    background-repeat: no-repeat;
    background-position:50%;
 	flex-direction: column;
 	gap: 5px;
 	align-items: flex-start;
 }
#settings-btn:hover{
    cursor: pointer;
    opacity:0.8;
}
#settings-btn::after{
    display:none;
    content: attr(data-text);
    position:absolute;
    top:120%;
    left:50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    font-weight:normal;
    font-size: 11px;
    line-height: 1;
    height: auto;
    white-space: nowrap;
    transition: opacity 0.5s ease;
}

#settings-btn:hover::after {
    opacity: 1;
    display: block;
}
#mwstmm-main {
 	position: absolute;
    width:40px;
    height:40px;
	top: 0.85rem;
    right: 4rem;
 	z-index: 9;
 	display: flex;
    border: none;
    border-radius: 50%;
    background: #00000099;
    background-repeat: no-repeat;
    background-position:50%;
 	flex-direction: column;
 	gap: 5px;
 	align-items: flex-start;
 }

#mwstmm-main:hover{
    cursor: pointer;
    opacity:0.8;
}

#mwstmm-main::after{
    display:none;
    content: attr(data-text);
    position:absolute;
    top:120%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    font-weight:normal;
    font-size: 11px;
    line-height: 1;
    height: auto;
    white-space: nowrap;
    transition: opacity 0.5s ease;
}

#mwstmm-main:hover::after {
    opacity: 1;
    display: block;
}

.mwstmm-settings.extra-pad {
	top: 2.5rem;
}

.mwstmm-title {
	font-size: 15px;
	font-weight: bold;
	text-shadow: rgb(204, 48, 46) 2px 0px 0px, rgb(204, 48, 46) 1.75517px 0.958851px 0px, rgb(204, 48, 46) 1.0806px 1.68294px 0px, rgb(204, 48, 46) 0.141474px 1.99499px 0px, rgb(204, 48, 46) -0.832294px 1.81859px 0px, rgb(204, 48, 46) -1.60229px 1.19694px 0px, rgb(204, 48, 46) -1.97998px 0.28224px 0px, rgb(204, 48, 46) -1.87291px -0.701566px 0px, rgb(204, 48, 46) -1.30729px -1.5136px 0px, rgb(204, 48, 46) -0.421592px -1.95506px 0px, rgb(204, 48, 46) 0.567324px -1.91785px 0px, rgb(204, 48, 46) 1.41734px -1.41108px 0px, rgb(204, 48, 46) 1.92034px -0.558831px 0px;
	position: relative;
	z-index: 1;
}

.mwstmm-subtitle {
	font-size: 12px;
	background: rgba(204, 48, 46, 0.4);
	padding: 3px 5px;
	border-radius: 5px;
	position: relative;
	z-index: 0;
	top: -8px;
	text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.mwstmm-subtitle a:hover {
	text-decoration: underline;
}

.mwstmm-settings-option {
	background: var(--ds-color-purple-100);
	padding: 6px 10px;
	border-radius: 5px;
	font-size: 12px;
	cursor: pointer;
	opacity: 0.75;
	transition: opacity 0.2s;
	pointer-events: auto;
}

.mwstmm-settings-option:hover {
	opacity: 1;
}

#mwstmm-map-list h3 {
	margin-bottom: 10px;
}

#mwstmm-map-list .tag-input {
	display: block;
	width: 100%;
	font: inherit;
    border:1px solid #ccc;
}

#mwstmm-map-list .maps {
	max-height: 200px;
	overflow-x: hidden;
	overflow-y: auto;
	font-size: 15px;
}

#mwstmm-map-list .map {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	padding: 8px;
	transition: background 0.2s;
}

#mwstmm-map-list .map:nth-child(2n) {
	background: #f0f0f0;
}

#mwstmm-map-list .map-buttons:not(.is-added) .map-added {
	display: none !important;
}
#mwstmm-map-list .map-buttons.is-added .map-add {
	display: none !important;
}

#mwstmm-map-list .map-add {
	background: green;
	color: #fff;
	padding: 3px 6px;
	border-radius: 5px;
	font-size: 13px;
	font-weight: bold;
	cursor: pointer;
}

#mwstmm-map-list .map-added {
	background: #000;
	color: #fff;
	padding: 3px 6px;
	border-radius: 5px;
	font-size: 13px;
	font-weight: bold;
}

div[class^="result-list_listItemWrapper__"] {
	position: relative;
}

div[class^="result-list_listItemWrapper__"] .mwstmm-settings-option {
	margin-left: auto;
	line-height: 1;
	align-self: center;
}
.swal-small-popup {
    position: absolute;
    width: auto !important;
    height: auto !important;
    top: -250px !important;
    font-weight: bold !important;
    font-size: 8px !important;
    text-align: center !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
}
.swal-info-popup {
    position: absolute;
    width: auto !important;
    height: auto !important;
    top: -250px !important;
    font-weight: bold !important;
    font-size: 8px;
    text-align: center !important;
    display: block !important;
    justify-content: center !important;
    align-items: center !important;
}
.tag-buttons {
    margin-top: 10px;
}
.tag-button {
    margin: 5px 5px 0 0;
    padding: 4px 10px;
    border: 1px solid #ccc;
    background: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.2s;
	font-size: 16px;
	font-weight: bold;
}
.tag-button:hover {
    background: #e0e0e0;
}
.tag-button.active {
    background-color: green;
    color: white;
    border-color: green;
}
.swal2-input {
  font-size: 14px !important;
}
.swal2-select {
  font-size: 14px !important;
}
`);

    let detectButton, downloadButton;
    let previousListener, zoomLevel, w, h;
    let formattedTime, capturePano, type=10;
    let isHidden, cleanStyle;
    let LOCATION;
    let MAP_LIST;
    let previousMapId=JSON.parse(GM_getValue('previousMapId', null));

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let full_months=['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December']
    let dateSvg=`<svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#9AA0a6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Calendar / Calendar_Days"> <path id="Vector" d="M8 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V8M8 4H16M8 4V2M16 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V8M16 4V2M4 8V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V8M4 8H20M16 16H16.002L16.002 16.002L16 16.002V16ZM12 16H12.002L12.002 16.002L12 16.002V16ZM8 16H8.002L8.00195 16.002L8 16.002V16ZM16.002 12V12.002L16 12.002V12H16.002ZM12 12H12.002L12.002 12.002L12 12.002V12ZM8 12H8.002L8.00195 12.002L8 12.002V12Z" stroke="#9AA0a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`
    let date_Svg=`<svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Calendar / Calendar_Days"> <path id="Vector" d="M8 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V8M8 4H16M8 4V2M16 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V8M16 4V2M4 8V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V8M4 8H20M16 16H16.002L16.002 16.002L16 16.002V16ZM12 16H12.002L12.002 16.002L12 16.002V16ZM8 16H8.002L8.00195 16.002L8 16.002V16ZM16.002 12V12.002L16 12.002V12H16.002ZM12 12H12.002L12.002 12.002L12 12.002V12ZM8 12H8.002L8.00195 12.002L8 12.002V12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`
    let iconSvg=`<svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Download"> <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="#9AA0a6" stroke-width="2.16" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`
    let icon_Svg=`<svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Download"> <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="#ffffff" stroke-width="2.16" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`
    let saveSvg=`<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    let noteSvg=`<svg fill="#FFFFFF" width="24px" height="24px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke="#FFFFFF" stroke-width="5"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M226.82813,61.17163l-32-31.99976a3.99854,3.99854,0,0,0-5.65625,0l-96,95.99976A4.00065,4.00065,0,0,0,92,128v32a4.0002,4.0002,0,0,0,4,4h32a4,4,0,0,0,2.82813-1.17139l96-96.00024A3.99913,3.99913,0,0,0,226.82813,61.17163ZM126.34277,156H100V129.65674l68.00012-68,26.343,26.34277Zm73.65686-73.65674L173.65662,56,192,37.65674,218.34277,64ZM220,120v88a12.01343,12.01343,0,0,1-12,12H48a12.01343,12.01343,0,0,1-12-12V48A12.01343,12.01343,0,0,1,48,36h88a4,4,0,0,1,0,8H48a4.00427,4.00427,0,0,0-4,4V208a4.00427,4.00427,0,0,0,4,4H208a4.00427,4.00427,0,0,0,4-4V120a4,4,0,0,1,8,0Z"></path> </g></svg>`
    let settingSvg=`<svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M13.5 0c-.822 0-1.5.678-1.5 1.5v1.965c-1.068.275-2.088.695-3.04 1.25l-1.28-1.28c-.582-.58-1.54-.58-2.123 0l-2.12 2.122c-.583.582-.583 1.54 0 2.123l1.282 1.283c-.56.95-.984 1.97-1.263 3.037H1.5c-.822 0-1.5.678-1.5 1.5v3c0 .822.678 1.5 1.5 1.5h1.965c.275 1.068.695 2.088 1.25 3.04l-1.28 1.28c-.58.582-.58 1.54 0 2.123l2.122 2.12c.582.583 1.54.583 2.123 0l1.283-1.282c.95.56 1.97.984 3.037 1.263V28.5c0 .822.678 1.5 1.5 1.5h3c.822 0 1.5-.678 1.5-1.5v-1.965c1.068-.275 2.088-.695 3.04-1.25l1.28 1.28c.582.58 1.54.58 2.123 0l2.12-2.122c.583-.582.583-1.54 0-2.123l-1.282-1.283c.56-.95.984-1.97 1.263-3.037H28.5c.822 0 1.5-.678 1.5-1.5v-3c0-.822-.678-1.5-1.5-1.5h-1.965c-.275-1.068-.695-2.088-1.25-3.04l1.28-1.28c.58-.582.58-1.54 0-2.123l-2.122-2.12c-.582-.583-1.54-.583-2.123 0l-1.283 1.282c-.95-.56-1.97-.984-3.037-1.263V1.5c0-.822-.678-1.5-1.5-1.5h-3zm0 1h3c.286 0 .5.214.5.5v2.283a.5.5 0 0 0 .39.488c1.243.28 2.428.77 3.503 1.455a.5.5 0 0 0 .62-.07l1.514-1.512c.202-.202.508-.202.71 0l2.12 2.12c.202.202.202.508 0 .71L24.35 8.48a.5.5 0 0 0-.07.622c.68 1.076 1.167 2.262 1.44 3.505a.5.5 0 0 0 .49.393h2.29c.286 0 .5.214.5.5v3c0 .286-.214.5-.5.5h-2.283a.5.5 0 0 0-.488.39c-.28 1.243-.77 2.428-1.455 3.503a.5.5 0 0 0 .07.62l1.512 1.514c.202.202.202.508 0 .71l-2.12 2.12c-.202.202-.508.202-.71 0L21.52 24.35a.5.5 0 0 0-.622-.07c-1.076.68-2.262 1.167-3.505 1.44a.5.5 0 0 0-.393.49v2.29c0 .286-.214.5-.5.5h-3c-.286 0-.5-.214-.5-.5v-2.283a.5.5 0 0 0-.39-.488c-1.243-.28-2.428-.77-3.503-1.455a.5.5 0 0 0-.62.07l-1.514 1.512c-.202.202-.508.202-.71 0l-2.12-2.12c-.202-.202-.202-.508 0-.71L5.65 21.52a.5.5 0 0 0 .07-.622c-.68-1.076-1.167-2.262-1.44-3.505A.5.5 0 0 0 3.79 17H1.5c-.286 0-.5-.214-.5-.5v-3c0-.286.214-.5.5-.5h2.283a.5.5 0 0 0 .488-.39c.28-1.243.77-2.428 1.455-3.503a.5.5 0 0 0-.07-.62L4.144 6.972c-.202-.202-.202-.508 0-.71l2.12-2.12c.202-.202.508-.202.71 0L8.48 5.65a.5.5 0 0 0 .622.07c1.076-.68 2.262-1.167 3.505-1.44A.5.5 0 0 0 13 3.79V1.5c0-.286.214-.5.5-.5zm1.5 9c-2.756 0-5 2.244-5 5s2.244 5 5 5 5-2.244 5-5-2.244-5-5-5zm0 1c2.215 0 4 1.785 4 4s-1.785 4-4 4-4-1.785-4-4 1.785-4 4-4z"></path></g></svg>`
    const iconUrl=svgToUrl(iconSvg)
    const icon_Url=svgToUrl(icon_Svg)
    const svgUrl=svgToUrl(dateSvg)
    const svg_Url=svgToUrl(date_Svg)
    const saveUrl=svgToUrl(saveSvg)
    const noteUrl=svgToUrl(noteSvg)
    const settingUrl=svgToUrl(settingSvg)
    const moon_phase=['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘']
    const mountain = "⛰️";
    const wave = "🌊";

    function svgToUrl(svgText) {
        const svgBlob = new Blob([svgText], {type: 'image/svg+xml'});
        const svgUrl = URL.createObjectURL(svgBlob);
        return svgUrl;
    }
    async function showSettingsPopup(){
        await Swal.fire({
            title: '⚙️ Config Settings',
            html:
            `<div style="display: flex; flex-direction: column; gap: 5px; text-align: left; font-size:14px">
            <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-date">Date Format:</label>
    <select id="swal-date" class="swal2-select" style="width: 50%;">
      <option value="0">Default (locale)</option>
      <option value="1">yyyy-mm-dd</option>
      <option value="2">yyyy/mm/dd</option>
      <option value="3">dd/mm/yyyy</option>
      <option value="4">mm/dd/yyyy</option>
      <option value="5">Month dd, yyyy</option>
      <option value="6">dd Month, yyyy</option>
      <option value="7">Lunar</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-time">Time Format:</label>
    <select id="swal-time" class="swal2-select" style="width: 50%;">
      <option value="1">24-hour (hh:mm:ss)</option>
      <option value="2">12-hour (hh:mm:ss AM/PM)</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-accuracy">Accuracy (seconds):</label>
    <input type="number" id="swal-accuracy" class="swal2-input" min="1" max="60" step="1" style="width: 50%;" placeholder="e.g. 2">
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-units">Length Units:</label>
    <select id="swal-units" class="swal2-select" style="width: 50%;">
      <option value="METERS">Meters</option>
      <option value="Imperial">Imperial</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-api">MapMaking API Key:</label>
    <input id="swal-api" class="swal2-input" placeholder="Enter your API key" style="width: 60%;">
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-recent">Recent Maps to Show:</label>
    <input type="number" id="swal-recent" class="swal2-input" min="1" max="50" step="1" style="width: 50%;" placeholder="e.g. 3">
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-fullcheck">Full Update Types Check:</label>
    <select id="swal-fullcheck" class="swal2-select" style="width: 50%;">
      <option value="true">Enabled</option>
      <option value="false">Disabled</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-nearbycheck">Nearby Update Check:</label>
    <select id="swal-nearbycheck" class="swal2-select" style="width: 50%;">
      <option value="0">Disabled</option>
      <option value="5">≤5km</option>
      <option value="10">≤10km</option>
      <option value="15">≤15km</option>
      <option value="20">≤20km</option>
      <option value="40">≤40km</option>
      <option value="50">≤50km</option>
      <option value="100">≤100km</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <label for="swal-speedshow">Show Driving Speed:</label>
    <select id="swal-speedshow" class="swal2-select" style="width: 50%;">
      <option value="true">Enabled</option>
      <option value="false">Disabled</option>
    </select>
  </div>

</div>`,
            confirmButtonText: '💾 Save Settings',
            denyButtonText: '🗑️ Clear Config',
            showDenyButton: true,
            focusConfirm: false,
            showCloseButton:true,
            allowOutsideClick: true,
            allowEscapeKey: true,
            didOpen: () => {
                document.getElementById('swal-date').value = CONFIG.DATE_FORMAT;
                document.getElementById('swal-time').value = CONFIG.TIME_FORMAT;
                document.getElementById('swal-accuracy').value = CONFIG.ACCURACY;
                document.getElementById('swal-units').value = CONFIG.LENGTH_UNITS;
                document.getElementById('swal-api').value = CONFIG.MAP_MAKING_API_KEY;
                document.getElementById('swal-recent').value = CONFIG.NUMBER_OF_RECENT_MAPS;
                document.getElementById('swal-fullcheck').value = CONFIG.FULL_CHECK?.toString();
                document.getElementById('swal-nearbycheck').value = String(CONFIG.NEARBY_CHECK);
                document.getElementById('swal-speedshow').value = CONFIG.SPEED_SHOW?.toString();
            },
            preConfirm: () => {
                const accuracy = parseInt(document.getElementById('swal-accuracy').value);
                const recentMaps = parseInt(document.getElementById('swal-recent').value);

                if (isNaN(accuracy) || accuracy <= 0 || !Number.isInteger(accuracy)) {
                    Swal.showValidationMessage("Accuracy must be a positive integer.");
                    return false;
                }

                if (isNaN(recentMaps) || recentMaps <= 0 || recentMaps > 10 || !Number.isInteger(recentMaps)) {
                    Swal.showValidationMessage("Recent Maps to Show must be an integer between 1 and 10.");
                    return false;
                }
                return {
                    DATE_FORMAT: parseInt(document.getElementById('swal-date').value),
                    TIME_FORMAT: parseInt(document.getElementById('swal-time').value),
                    ACCURACY: accuracy,
                    LENGTH_UNITS: document.getElementById('swal-units').value,
                    MAP_MAKING_API_KEY: document.getElementById('swal-api').value.trim(),
                    NUMBER_OF_RECENT_MAPS: recentMaps,
                    FULL_CHECK: document.getElementById('swal-fullcheck').value === 'true',
                    NEARBY_CHECK: Number(document.getElementById('swal-nearbycheck').value),
                    SPEED_SHOW: document.getElementById('swal-speedshow').value === 'true'
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                localStorage.setItem("PANO_DETECTIVE_CONFIG", JSON.stringify(result.value));
                CONFIG=result.value
                await Swal.fire({
                    title: ' ✔️ Settings saved successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                    allowOutsideClick:true,
                    backdrop:null,
                    customClass: {
                        popup: "swal-small-popup"
                    }
                });
            } else if (result.isDenied) {
                localStorage.removeItem("PANO_DETECTIVE_CONFIG");
                CONFIG=DEFAULT
                await Swal.fire({
                    title: '🗑️ Configuration cleared.',
                    timer: 1500,
                    showConfirmButton: false,
                    allowOutsideClick:true,
                    backdrop:null,
                    customClass: {
                        popup: "swal-small-popup"
                    }
                });
            }
        });
    }
    function defaultState() {
        return {
            recentMaps: []
        }
    }

    function loadState() {
        const data = GM_getValue('mwstmm_state', null)
        if(!data) return;

        const dataJson = JSON.parse(data);
        if(!data) return;

        Object.assign(MWSTMM_STATE, defaultState(), dataJson);
        saveState();
    }

    function saveState() {
        GM_setValue('mwstmm_state', JSON.stringify(MWSTMM_STATE));
    }

    const MWSTMM_STATE = defaultState();
    loadState();

    async function mmaFetch(url, options = {}) {
        const response = await fetch(new URL(url, 'https://map-making.app'), {
            ...options,
            headers: {
                accept: 'application/json',
                authorization: `API ${CONFIG.MAP_MAKING_API_KEY.trim()}`,
                ...options.headers
            }
        });
        if (!response.ok) {
            let message = 'Unknown error';
            try {
                const res = await response.json();
                if (res.message) {
                    message = res.message;
                }
            } catch {
                //empty
            }
            alert(`An error occurred while trying to connect to Map Making App. ${message}`);
            throw Object.assign(new Error(message), { response });
        }
        return response;
    }
    async function getMaps() {
        const response = await mmaFetch(`/api/maps`);
        const maps = await response.json();
        return maps;
    }
    async function importLocations(mapId, locations) {
        const response = await mmaFetch(`/api/maps/${mapId}/locations`, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                edits: [{
                    action: { type: 4 },
                    create: locations,
                    remove: []
                }]
            })
        });
        await response.json();
    }

    function extractCoord(link){
        const regex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;

        const match = link.match(regex);

        if (match) {
            var lat = match[1];
            var lng = match[2];
            return {lat,lng}
        } else {
            console.error('Invalid link format');
            return null;
        }
    }

    function extractParams(link) {
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+),.*?\/data=!3m\d+!1e\d+!3m\d+!1s([^!]+)!/;
        const urlObj = new URL(link);
        const path = urlObj.pathname;
        const pathRegex = /@([^,]+),([^,]+),(\d+)a,([^y]+)y,([^h]+)h,([^t]+)t/;
        const pathMatch = path.match(pathRegex);
        const match = link.match(regex);

        let lat, lng, panoId, a, y, h, t;

        if (match) {
            panoId = match[3];
        }

        if (pathMatch) {
            lat = parseFloat(pathMatch[1]);
            lng = parseFloat(pathMatch[2]);
            a = parseFloat(pathMatch[3]);
            y = parseFloat(pathMatch[4]);
            h = parseFloat(pathMatch[5]);
            t = parseFloat(pathMatch[6]);
        }

        return { lat, lng, panoId, a, y, h, t };
    }


    function showLoader() {
        if(document.getElementById('mwstmm-loader')) return;

        const element = document.createElement('div');
        element.id = 'mwstmm-loader';
        element.className = 'mwstmm-modal';
        element.innerHTML = `
		<div class="text">LOADING...</div>
		<div class="dim"></div>
	`;
        document.body.appendChild(element);
    }

    function hideLoader() {
        const element = document.getElementById('mwstmm-loader');
        if(element) element.remove();
    }

    async function clickedMapButton() {
        if (CONFIG.MAP_MAKING_API_KEY === 'PASTE_YOUR_KEY_HERE') {
            await Swal.fire({
                icon: 'warning',
                title: 'API Key Required',
                html: `To save locations to <strong>Map Making App</strong>, you must first configure your API key.<br><br>
                Please click the <strong>⚙️</strong> icon and enter your API key in the popup.<br><br>
                You can get your API key by creating one <a href="https://map-making.app/keys" target="_blank" style="color: #007bff; text-decoration: none;"><strong>here</strong></a>.`,
                confirmButtonText: 'Got it!',
            });
            return;
        }
        if(!MAP_LIST) {
            showLoader();

            try {
                MAP_LIST = await getMaps();
            }catch{
                //empty
            }

            hideLoader();
        }

        if(MAP_LIST) {
            showMapList()
        }
    }

    function showMapList() {
        if(document.getElementById('mwstmm-map-list')) return;

        const element = document.createElement('div');
        element.id = 'mwstmm-map-list';
        element.className = 'mwstmm-modal';

        let recentMapsSection = ``;
        if(CONFIG.NUMBER_OF_RECENT_MAPS > 0 && MWSTMM_STATE.recentMaps.length > 0) {
            let recentMapsHTML = '';
            for(const m of MWSTMM_STATE.recentMaps) {
                if(m.archivedAt) continue;
                recentMapsHTML += `<div class="map">
                <a href="https://map-making.app/maps/${m.id}" class="map-link">
				    <span class="map-name">${m.name}</span>
                </a>
				<span class="map-buttons">
					<span class="map-add" data-id="${m.id}">ADD</span>
					<span class="map-added">ADDED</span>
				</span>
			</div>`;
            }

            recentMapsSection = `
			<h3>Recent Maps</h3>

			<div class="maps">
				${recentMapsHTML}
			</div>

			<br>
		`;
        }

        let mapsHTML = '';
        let tagButtonsHTML = '';
        if(LOCATION){
            for (const tag of LOCATION.tagFields) {
                tagButtonsHTML += `<button class="tag-button" data-tag="${tag}">${tag}</button>`;
            }
        }
        for(const m of MAP_LIST) {
            if(m.archivedAt) continue;
            mapsHTML += `<div class="map">
            <a href="https://map-making.app/maps/${m.id}" class="map-link">
			    <span class="map-name">${m.name}</span>
            </a>
			<span class="map-buttons">
				<span class="map-add" data-id="${m.id}">ADD</span>
				<span class="map-added">ADDED</span>
			</span>
		</div>`;
        }

        element.innerHTML = `
	<div class="inner">
		<h3>Tags (comma separated)</h3>

		<input type="text" class="tag-input" id="mwstmm-map-tags" />

        <div class="tag-buttons">
            ${tagButtonsHTML}
        </div>

		<br><br>

		${recentMapsSection}

		<h3>All Maps</h3>

		<div class="maps">
			${mapsHTML}
		</div>
	</div>

	<div class="dim"></div>
	`;

        document.body.appendChild(element);

        element.querySelector('.dim').addEventListener('click', closeMapList);

        document.getElementById('mwstmm-map-tags').addEventListener('keyup', e => e.stopPropagation());
        document.getElementById('mwstmm-map-tags').addEventListener('keydown', e => e.stopPropagation());
        document.getElementById('mwstmm-map-tags').addEventListener('keypress', e => e.stopPropagation());
        document.getElementById('mwstmm-map-tags').focus();

        for(const map of element.querySelectorAll('.maps .map-add')) {
            map.addEventListener('click', addLocationToMap);
        }

        for (const btn of element.querySelectorAll('.tag-button')) {
            btn.addEventListener('click', function () {
                const tag = this.dataset.tag;
                const input = document.getElementById('mwstmm-map-tags');

                let currentTags = input.value.split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

                if (this.classList.contains('active')) {
                    currentTags = currentTags.filter(t => t !== tag);
                    this.classList.remove('active');
                } else {
                    if (!currentTags.includes(tag)) {
                        currentTags.push(tag);
                    }
                    this.classList.add('active');
                }

                input.value = currentTags.join(', ');
            });
        }
    }

    function closeMapList() {
        const element = document.getElementById('mwstmm-map-list');
        if(element) element.remove();
    }

    function addLocationToMap(e) {
        e.target.parentNode.classList.add('is-added');

        const id = parseInt(e.target.dataset.id);
        previousMapId=id
        GM_setValue('previousMapId', JSON.stringify(previousMapId));

        if(CONFIG.NUMBER_OF_RECENT_MAPS > 0) {
            MWSTMM_STATE.recentMaps = MWSTMM_STATE.recentMaps.filter(e => e.id !== id).slice(0, CONFIG.NUMBER_OF_RECENT_MAPS-1);
            for(const map of MAP_LIST) {
                if(map.id === id) {
                    MWSTMM_STATE.recentMaps.unshift(map);
                    break;
                }
            }
        }
        saveState();
        importLocations(id, [{
            id: -1,
            location: {lat: LOCATION.lat, lng: LOCATION.lng},
            panoId: LOCATION.panoId ?? null,
            heading: LOCATION.heading ?? 90,
            pitch: LOCATION.pitch ?? 0,
            zoom: 0,
            tags: document.getElementById('mwstmm-map-tags').value.split(',').map(t => t.trim()).filter(t => t.length > 0),
            flags: LOCATION.panoId ? 1 : 0
        }]);
    }

    function addSettingsButtonsToPage() {
        const container = document.querySelector('.UL7Qtf');
        if(!container || document.getElementById('mwstmm-main')) return;
        const element = document.createElement('div');

        element.id = 'mwstmm-main';

        element.style.backgroundImage=`url(${saveUrl})`
        element.setAttribute('data-text',"Save to MapMaking")

        element.innerHTML = `
        <div class="mwstmm-settings-option" id="mwstmm-opt-save-loc"/>`;

        container.appendChild(element);
        setTimeout(() => {
            if(document.querySelector('.TrU0dc.NUqjXc')){
                element.style.right='0.85rem'
                element.style.top='4rem'
            }}, 100)

        createSettingsButtonSummaryEvents();
    }

    function parseMeta(data) {
        const tags=[]

        const panoId=data[1][0][1][1];
        const lat = data[1][0][5][0][1][0][2];
        const lng = data[1][0][5][0][1][0][3];
        const year = data[1][0][6][7][0];
        const month = data[1][0][6][7][1];
        const worldsize = data[1][0][2][2][0];
        const history =data[1][0][5][0][8];
        const links= data[1][0][5][0][3][0]


        const date = new Date(year, month - 1);
        const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        let heading, region, locality, road, country, altitude;
        try{
            heading=data[1][0][5][0][1][2][0];
        }catch(e){
            heading=0
        }
        try {
            country = data[1][0][5][0][1][4];
            if (['TW', 'HK', 'MO'].includes(country)) {
                country = 'CN';
            }
        } catch (e) {
            country = null;
        }

        try {
            const address = data[1][0][3][2][1][0];
            const parts = address.split(',')
            if(parts.length > 1){
                region = parts[parts.length-1].trim();
                locality=parts[0].trim()
            } else {
                region = address;
            }
        } catch (e) {
            try{
                const address=data[1][0][3][2][0][0]
                const parts = address.split(',')
                if(parts.length > 1){
                    region = parts[parts.length-1].trim();
                    locality=parts[0].trim()
                }
                else region = address;
            }
            catch(e){
                region=null;
            }
        }
        try {
            road = data[1][0][5][0][12][0][0][0][2][0];
        } catch (e) {
            road = null;
        }
        try{
            altitude=data[1][0][5][0][1][1][0]
        }
        catch(e){
            altitude=null;
        }
        const generation = String(data[1][0][4]).includes('Google')?getGeneration(worldsize, country, lat, date):'ari';
        let camera;
        if (generation=='Gen4'){
            if(['IN','PR'].includes(country))camera='smallcam'
            else if (['NA', 'PA' , 'OM', 'QA', 'EC'].includes(country))camera='gen4trekker'
        }
        let isNewRoad= !history ? 'newroad' : false
        const tagFields = [formattedDate, `${year}-${month}`, year, months[month-1], full_months[month-1],
                           country, region, locality, road,
                           generation,camera, altitude?altitude.toFixed(2)+'m':null, isNewRoad].filter(Boolean);
        return {
            lat,
            lng,
            panoId,
            year,
            month,
            country,
            region,
            locality,
            road,
            generation,
            links,
            history,
            heading:Math.round(heading),
            pitch:0,
            zoom:0,
            tags,
            tagFields
        }
    }

    function getGeneration(worldsize, country, lat, date) {
        if (!worldsize) return 'Ari';
        if (worldsize === 1664) return 'Gen1';
        if (worldsize === 8192) return 'Gen4';
        if (worldsize === 6656) {
            const dateStr = date.toISOString().slice(0, 7);
            const gen2Countries = new Set(['AU', 'BR', 'CA', 'CL', 'JP', 'GB', 'IE', 'NZ', 'MX', 'RU', 'US', 'IT', 'DK', 'GR', 'RO',
                                           'PL', 'CZ', 'CH', 'SE', 'FI', 'BE', 'LU', 'NL', 'ZA', 'SG', 'TW', 'HK', 'MO', 'MC', 'NO',
                                           'SM', 'AD', 'IM', 'JE', 'FR', 'DE', 'ES', 'PT', 'SJ']);
            const gen3Dates = {
                'BD': '2021-04', 'EC': '2022-03', 'FI': '2020-09', 'IN': '2021-10', 'LK': '2021-02', 'KH': '2022-10',
                'LB': '2021-05', 'NG': '2021-06', 'ST': '2024-02', 'US': '2019-01', 'VN':'2021-01', 'ES':'2023-01'
            };
            if(dateStr >= '2022-01') return 'BadCam'
            if (dateStr >= gen3Dates[country]) {
                if(country!='US')return 'BadCam'
                if(country === 'US' && lat > 52)return 'BadCam'
            }

            if (gen2Countries.has(country) && dateStr <= '2011-11') {
                return dateStr >= '2010-09' ? 'Gen2/3' : 'Gen2';
            }

            return 'Gen3';
        }
    }

    function haversine(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const toRad = Math.PI / 180;
        const φ1 = lat1 * toRad;
        const φ2 = lat2 * toRad;
        const Δφ = (lat2 - lat1) * toRad;
        const Δλ = (lng2 - lng1) * toRad;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    async function seekDrivingEnd(data,timeRange){
        try{
            const startPano=data[1][0][1][1]
            const startLat=data[1][0][5][0][1][0][2]
            const startLng=data[1][0][5][0][1][0][3]
            const step1=data[1][0][5][0][3][0][1][0][1]
            const metaData = await UE('GetMetadata', step1);
            if(metaData&&metaData.length>1){
                const linkPano=metaData[1][0][5][0][3][0][1][0][1]===startPano?metaData[1][0][5][0][3][0][2]:metaData[1][0][5][0][3][0][1]
                const step2=linkPano[0][1]
                const metaData_ = await UE('GetMetadata', step2);
                if(metaData_){
                    const linkPano=metaData_[1][0][5][0][3][0][1][0][1]===step2?metaData_[1][0][5][0][3][0][2]:metaData_[1][0][5][0][3][0][1]
                    const step3=linkPano[0][1]
                    const lat_=linkPano[2][0][2]
                    const lng_=linkPano[2][0][3]
                    const captureTime = await binarySearch({"lat":lat_,"lng":lng_},timeRange.startDate,timeRange.endDate,step3,1,15);
                    return {time:captureTime,lat:lat_,lng:lng_}
                }
            }
        }
        catch(e){
            console.error('Failed to seek pano'+e)
            return null
        }
    }

    async function getLOCATION(){
        const result=extractParams(window.location.href);
        if(!result) return
        const metaData = await UE('GetMetadata', result.panoId);
        if(metaData) {
            LOCATION = parseMeta(metaData)
            if(result.h)LOCATION.heading=result.h
            if(result.t)LOCATION.pitch=parseInt(result.t)-90
            if(result.y)LOCATION.zoom = Math.log2(180 / result.y)
        }
    }

    function createSettingsButtonSummaryEvents() {
        document.getElementById('mwstmm-main').addEventListener('click', async () => {
            await getLOCATION()
            clickedMapButton();
        });
    }

    function addResultButton(location, item) {
        const btn = document.createElement('div');
        btn.className = `mwstmm-settings-option`;
        btn.textContent = `SAVE`;

        btn.addEventListener('click', () => {
            LOCATION = location;
            clickedMapButton();
        });

        item.appendChild(btn);
    }

    async function UE(t, e, s, d,r) {
        try {
            const url = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
            let payload = createPayload(t, e,s,d,r);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json+protobuf",
                    "x-user-agent": "grpc-web-javascript/0.1"
                },
                body: payload,
                mode: "cors",
                credentials: "omit"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return await response.json();
            }
        } catch (error) {
            console.error(`There was a problem with the UE function: ${error.message}`);
        }
    }

    function createPayload(mode,coorData,s,d,r) {
        var payload;
        if (mode === 'GetMetadata') {
            const length=coorData.length
            const contentInfoElements = document.querySelectorAll('[role="contentinfo"]');
            contentInfoElements.forEach(element => {
                const spans = element.querySelectorAll('span');
                spans.forEach(span => {
                    if (span.textContent.includes('Google')) type=2
                });
            });
            if(String(coorData).substring(0,4)=='CIHM') type=10
            payload = [["apiv3"],["en","US"],[[[type,coorData]]],[[1, 2, 3, 4, 8, 6]]];
        }
        else if (mode === 'SingleImageSearch') {
            payload=[["apiv3"],[[null,null,parseFloat(coorData.lat),parseFloat(coorData.lng)],r],[[null,null,null,null,null,null,null,null,null,null,[s,d]],null,null,null,null,null,null,null,[2],null,[[[type,true,2]]]],[[2,6]]]}
        else {
            throw new Error("Invalid mode!");
        }
        return JSON.stringify(payload);
    }

    async function binarySearch(c, start,end,panoId,accuracy, radius) {
        let capture
        let response
        if(!accuracy)accuracy=CONFIG.ACCURACY
        if(!radius)radius=30
        while( (end - start > accuracy)) {
            let mid=Math.round((start + end)/2) ;
            response = await UE("SingleImageSearch", c, start,end,radius);
            if (response&&response.length>1){
                end=mid
                /*if (response[1][1][1]==panoId){
                    end=mid
                }
                else{
                    start=end
                    end+=(start-mid)}*/
            }
            else {
                start=end
                end+=(start-mid)}
            capture=Math.round((start + end)/2)
        }
        return capture
    }

    async function downloadPanoramaImage(panoId, fileName,w,h) {
        return new Promise(async (resolve, reject) => {
            try {
                const imageUrl= `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${panoId}&output=tile&zoom=${zoomLevel}&nbt=0&fover=2`;
                const tileWidth = 512;
                const tileHeight = 512;
                const zoomTiles=[2,4,8,16,32]
                let tilesPerRow,tilesPerColumn
                if(type==2){
                    tilesPerRow = Math.min(Math.ceil(w / tileWidth),zoomTiles[zoomLevel-1]);
                    tilesPerColumn = Math.min(Math.ceil(h / tileHeight),zoomTiles[zoomLevel-1]/2);}
                else{
                    tilesPerRow=Math.ceil(w / tileWidth)
                    tilesPerColumn = Math.ceil(h/ tileHeight);
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width =tilesPerRow * tileWidth;
                canvas.height = tilesPerColumn * tileHeight;
                if (w === 13312) {
                    const sizeMap = {
                        4: [6656, 3328],
                        3: [3328, 1664],
                        2: [1664, 832],
                        1: [832, 416]
                    };
                    if (sizeMap[zoomLevel]) {
                        [canvas.width, canvas.height] = sizeMap[zoomLevel];
                    }
                }
                const loadTile = (x, y) => {
                    return new Promise(async (resolveTile) => {
                        let tile;
                        let tileUrl = `${imageUrl}&x=${x}&y=${y}`;
                        if(type==10)tileUrl=`https://lh3.ggpht.com/jsapi2/a/b/c/x${x}-y${y}-z${zoomLevel}/${panoId}`
                        try {
                            tile = await loadImage(tileUrl);
                            ctx.drawImage(tile, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                            resolveTile();
                        } catch (error) {
                            console.error(`Error loading tile at ${x},${y}:`, error);
                            resolveTile();
                        }
                    });
                };

                let tilePromises = [];
                for (let y = 0; y < tilesPerColumn; y++) {
                    for (let x = 0; x < tilesPerRow; x++) {
                        tilePromises.push(loadTile(x, y));
                    }
                }

                await Promise.all(tilePromises);

                canvas.toBlob(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click(); document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    resolve();
                }, 'image/jpeg');
            } catch (error) {
                Swal.fire({
                    title: 'Error Downloading ❌',
                    timer: 1500,
                    showConfirmButton: false,
                    allowOutsideClick:true,
                    backdrop:null,
                    customClass: {
                        popup: "swal-small-popup"
                    }})
                reject(error);
            }
        });
    }

    async function getElevation(lat, lng) {
        const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return null
            }

            const data = await response.json();

            const altitude = data.elevation;
            if(altitude) return altitude[0]
            else return null

        } catch (error) {
            console.error('Error fetching elevation data:', error);
            return null
        }
    }

    async function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
            img.src = url;
        });
    }

    function monthToTimestamp(m) {

        const [year, month] = m

        const startDate =Math.round( new Date(year, month-1,0).getTime()/1000);

        const endDate =Math.round(new Date(year, month, 2).getTime()/1000)

        return { startDate, endDate };
    }

    async function getLocal(coord, timestamp) {
        const systemTimezoneOffset = -new Date().getTimezoneOffset() * 60;

        try {
            var offset_hours, offset
            const timezone=await GeoTZ.find(coord[0],coord[1])

            try{
                offset = await GeoTZ.toOffset(timezone);}
            catch(error){
                offset = await GeoTZ.toOffset(timezone[0]);}

            if(offset){
                offset_hours=parseInt(offset/60)
            }
            else if (offset===0) offset_hours=0

            const offsetDiff = systemTimezoneOffset -offset_hours*3600;
            const convertedTimestamp = timestamp -offsetDiff;
            return convertedTimestamp;
        } catch (e) {
            try {
                const [lat, lng] = coord;
                const url = `https://api.wheretheiss.at/v1/coordinates/${lat},${lng}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Request failed: " + response.statusText);
                }
                const data = await response.json();
                const targetTimezoneOffset = data.offset * 3600;
                const offsetDiff = systemTimezoneOffset - targetTimezoneOffset;
                const convertedTimestamp = Math.round(timestamp - offsetDiff);
                return convertedTimestamp;
            }
            catch (e){
                console.error('Failed to get timezone data'+e)
            }
        }
    }

    function getMoonPhaseIcon(dayOfMonth) {
        const cycleDays = 29.53;
        const phaseIndex = Math.floor((dayOfMonth % cycleDays) / (cycleDays / moon_phase.length));
        return moon_phase[phaseIndex];
    }

    function formatTimestamp(timestamp) {
        var date_text,time_text
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        if (CONFIG.DATE_FORMAT===2) date_text=`${year}/${month}/${day}`
        else if (CONFIG.DATE_FORMAT===3) date_text=`${day}/${month}/${year}`
        else if (CONFIG.DATE_FORMAT===4) date_text=`${month}/${day}/${year}`
        else if (CONFIG.DATE_FORMAT===5) date_text=`${months[parseInt(month-1)]} ${parseInt(day)}, ${year}`
        else if (CONFIG.DATE_FORMAT===6) date_text=`${parseInt(day)} ${months[parseInt(month-1)]}, ${year}`
        else if (CONFIG.DATE_FORMAT===7) {
            const lunarDate=chineseLunar.solarToLunar(date)
            date_text = `${year}-${month}-${day} ${chineseLunar.format(lunarDate, 'MD')} ${getMoonPhaseIcon(lunarDate.day)}`;}
        else date_text=`${year}-${month}-${day}` ;

        if(CONFIG.TIME_FORMAT===1) time_text=`${hours}:${minutes}:${seconds}`
        else{
            const period = parseInt(hours) >= 12 ? 'pm' : 'am';

            var _hours = parseInt(hours) % 12 || 12;
            _hours = String(_hours).padStart(2, '0');
            time_text= `${_hours}:${minutes}:${seconds} ${period}`;
        }

        if(!CONFIG.DATE_FORMAT)return date.toLocaleString().replace('T', ' ');
        else return `${date_text} ${time_text}`;

    }

    function formatLatLng(lat, lng) {

        const latDirection = lat >= 0 ? 'N' : 'S';
        const latAbs = Math.abs(lat).toFixed(4);
        const latStr = `${latAbs}°${latDirection}`;


        const lngDirection = lng >= 0 ? 'E' : 'W';
        const lngAbs = Math.abs(lng).toFixed(4);
        const lngStr = `${lngAbs}°${lngDirection}`;

        return `${latStr}, ${lngStr}`;
    }

    function formatDistance(meters) {
        if (CONFIG.LENGTH_UNITS === 'Imperial') {
            const miles = meters * 0.000621371;
            return `${Math.round(miles)} miles`;
        } else {
            return `${Math.round(meters*0.001)} km`;
        }
    }

    function getButtonPosition(symbol, spotlight) {
        if (!symbol || !spotlight) return null;
        const rectSymbol = symbol.getBoundingClientRect();
        const rectSpotlight = spotlight.getBoundingClientRect();
        return rectSpotlight.top ? { top: rectSymbol.top, left: rectSymbol.left } : null;
    }

    function createButton(id) {
        const button = document.createElement("button");
        button.id = id;
        return button;
    }

    function setupButton(button, backgroundUrl, position) {
        Object.assign(button.style, {
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "block",
            width: "24px",
            height: "24px",
            fontSize: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor: "transparent",
            ...(position && { position: "fixed", top: `${position.top + 40}px`, left: `${position.left - 25}px` }),
        });
    }

    function addButtons(symbol, position) {
        if (!detectButton) {
            detectButton = createButton("detect-button");
            addButtonHoverEffect(detectButton, svg_Url, svgUrl);
            detectButton.addEventListener("click",async function() {
                const date_selectors = [
                    'span.lchoPb',
                    'span.mqX5ad',
                    'div.mqX5ad',
                    'div.lchoPb',
                    'div.W0fu2b'
                ];

                const logo_span_selectors = [
                    'span.ilzTS',
                    'span.OVC7id'
                ];

                const logo_div_selectors = [
                    'div.p4x6kc',
                    'div.hz7Obe'
                ];

                const dateSpan = date_selectors
                .map(selector => document.querySelector(selector))
                .find(el => el !== null);

                const logoSpan = logo_span_selectors
                .map(selector => document.querySelector(selector))
                .find(el => el !== null);

                const logoDiv = logo_div_selectors
                .map(selector => document.querySelector(selector))
                .find(el => el !== null);

                if (dateSpan){
                    dateSpan.innerHTML='loading...'
                }

                var altitude
                const result=extractParams(window.location.href)
                var panoId=result.panoId;
                var lat=result.lat
                var lng=result.lng
                if (panoId.length>22) type=3
                try {

                    const metaData = await UE('GetMetadata', panoId);
                    if (!metaData) {
                        console.error('Failed to get metadata');
                        return;
                    }

                    var panoDate
                    try {
                        panoDate = metaData[1][0][6][7];
                        capturePano=metaData[1][0][1][1]
                        altitude=metaData[1][0][5][0][1][1][0]
                    } catch (error) {
                        try{
                            panoDate = metaData[1][0][6][7];
                            capturePano=metaData[1][0][1][1]}
                        catch(error){
                            dateSpan.textContent='unknown'
                            console.error('Failed to parse metadata')
                            return
                        }

                    }
                    /*if (logoSpan){
                        //GM_setClipboard(`${altitude},"${panoId}"`,'text')
                    }*/
                    const timeRange = monthToTimestamp(panoDate);
                    if (!timeRange) {
                        console.error('Failed to convert panoDate to timestamp');
                        return;
                    }

                    try {
                        const [captureTime, drivingEnd] = await Promise.all([
                            binarySearch({"lat": lat, "lng": lng}, timeRange.startDate, timeRange.endDate, panoId),
                            CONFIG.SHOW_SPEED?seekDrivingEnd(metaData, timeRange):null
                        ]);
                        if (!captureTime) {
                            console.error('Failed to get capture time');
                            return;
                        }
                        const localTime=await getLocal([lat,lng],captureTime)

                        if(!localTime){
                            console.error('Failed to get exact time');
                        }
                        formattedTime=formatTimestamp(localTime)
                        if(dateSpan){
                            dateSpan.textContent = formattedTime;
                        }
                        if(logoSpan){
                            if(drivingEnd){
                                const timeConsume=Math.abs(captureTime-drivingEnd.time)
                                var distance = haversine(lat, lng, drivingEnd.lat, drivingEnd.lng)
                                if(CONFIG.LENGTH_UNITS==='Imperial')distance=distance * 0.621371
                                if (timeConsume != 0) {
                                    const timeInHours = timeConsume / 3600;
                                    const avgSpeed=distance / timeInHours;
                                    const unit=CONFIG.LENGTH_UNITS==='Imperial'? 'mph':'km/h'
                                    if(avgSpeed) {
                                        logoSpan.textContent=!avgSpeed?`? ${unit}`:`${Math.round(avgSpeed*100)/100}  ${unit}`
                                        logoDiv.style.backgroundImage=`url(https://cdn.discordapp.com/emojis/776219536936402984.webp?size=100)`
                                    }
                                }
                                else{
                                    logoSpan.textContent='? km/h'}
                            }
                            if(!altitude) altitude=await getElevation(lat,lng)
                            if (altitude != null) {
                                let displayAltitude = altitude;
                                let altUnit = 'm';
                                if (CONFIG.LENGTH_UNITS === 'Imperial') {
                                    displayAltitude = altitude * 3.28084; // convert meters to feet
                                    altUnit = 'ft';
                                }
                                const altIcon = displayAltitude > 50 ? mountain : wave;
                                if(CONFIG.SHOW_SPEED){
                                    logoSpan.textContent += ` ${altIcon} ${Math.round(displayAltitude * 100) / 100}${altUnit}`;}
                                else{
                                    logoSpan.textContent = ` ${altIcon} ${Math.round(displayAltitude * 100) / 100}${altUnit}`;};
                            }
                            else {
                                logoSpan.textContent += ' unknown';
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } catch (error) {
                    console.error(error);
                }
            })
        }
        if (!downloadButton){
            downloadButton = createButton("download-button");
            addButtonHoverEffect(downloadButton, icon_Url, iconUrl);
            downloadButton.addEventListener("click",async function(){
                const { value: zoom, dismiss: inputDismiss } = await Swal.fire({
                    title: 'Image Quality',
                    html:
                    '<select id="zoom-select" class="swal2-input" style="width:180px; height:40px; font-size:16px;white-space:prewrap">' +
                    '<option value="1">1 (100KB~500KB)</option>' +
                    '<option value="2">2 (500KB~1MB)</option>' +
                    '<option value="3">3 (1MB~4MB)</option>' +
                    '<option value="4">4 (4MB~8MB)</option>' +
                    '<option value="5">5 (8MB~15MB)</option>' +
                    '</select>',
                    icon: 'question',
                    showCancelButton: true,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    backdrop:null,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'Cancel',
                    preConfirm: () => {
                        return document.getElementById('zoom-select').value;
                    }
                });
                if (zoom){
                    zoomLevel=parseInt(zoom)
                    var panoId=extractParams(window.location.href).panoId;
                    var panoDate,lat,lng
                    const metaData = await UE('GetMetadata', panoId);
                    if (!metaData) {
                        console.error('Failed to get metadata');
                        return;
                    }
                    try{
                        w=parseInt(metaData[1][0][2][2][1])
                        h=parseInt(metaData[1][0][2][2][0])
                        lat=metaData[1][0][5][0][1][0][2]
                        lng=metaData[1][0][5][0][1][0][3]

                    }
                    catch (error){
                        console.error(error)
                        return
                    }
                    try{
                        panoDate=metaData[1][0][6][7]
                    }
                    catch(e){
                        console.error(e)
                    }
                    if(w&&h){
                        const gpsTag=formatLatLng(lat,lng)
                        var timeTag=''
                        if(panoId===capturePano&&formattedTime) timeTag=formattedTime
                        else{
                            if(panoDate) timeTag=`${panoDate[0]}-${panoDate[1]}`}
                        const fileName = `${gpsTag}(${timeTag}).jpg`;
                        const swal = Swal.fire({
                            title: 'Downloading...',
                            timer: 1500,
                            showConfirmButton: false,
                            allowOutsideClick:true,
                            backdrop:null,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            },
                            customClass: {
                                popup: "swal-small-popup"
                            }
                        });
                        await downloadPanoramaImage(panoId, fileName,w,h);
                        swal.close()
                        Swal.fire({
                            title: 'Download Completed ✔️',
                            timer: 1500,
                            showConfirmButton: false,
                            allowOutsideClick:true,
                            backdrop:null,
                            customClass: {
                                popup: "swal-small-popup"
                            }})
                    }
                }
            })
        }

        if (symbol&&symbol.parentNode&&!symbol.parentNode.contains(detectButton))symbol.parentNode.appendChild(detectButton);

        if (symbol&&symbol.parentNode&&!symbol.parentNode.contains(downloadButton))symbol.parentNode.appendChild(downloadButton);

    }

    function checkPosition() {
        const symbol = document.querySelector("[jsaction='titlecard.settings']");
        const spotlight = document.querySelector("[jsaction='titlecard.spotlight']");
        const position = getButtonPosition(symbol, spotlight);
        if(symbol){
            if(!position){
                detectButton.style=null
                downloadButton.style=null
            }
            else{
                detectButton.style.marginTop = '1px';
                if(position.left&&position.top) downloadButton.style.marginLeft = '26px';
                else downloadButton.style.marginLeft='1px'
            }
        }
        if (!document.getElementById("detect-button") && !document.getElementById("download-button")) {
            addButtons(symbol, position);
        }
        setupButton(detectButton, svgUrl, position);
        setupButton(downloadButton, iconUrl, position);
    }

    function observePositionChanges() {
        const observer = new MutationObserver(() => checkPosition());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function addCustomButton() {
        const symbol = document.querySelector("[jsaction='titlecard.settings']");
        const spotlight = document.querySelector("[jsaction='titlecard.spotlight']");
        const position = getButtonPosition(symbol, spotlight);

        if (!symbol || !spotlight) return;
        addButtons(symbol, position);
        observePositionChanges();
    }

    function drawSegmentedLine(ctx, x1, y1, x2, y2, alpha) {
        ctx.setLineDash([10, 5]);

        const midX1 = x1 + (x2 - x1) * 0.49;
        const midY1 = y1 + (y2 - y1) * 0.49;
        const midX2 = x1 + (x2 - x1) * 0.51;
        const midY2 = y1 + (y2 - y1) * 0.51;

        ctx.lineWidth = 1.5;
        ctx.setLineDash([10, 5]);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(midX1, midY1);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(midX1, midY1);
        ctx.lineTo(midX2, midY2);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.setLineDash([10, 5]);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(midX2, midY2);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
    }

    async function getShortUrl() {
        const url = 'https://www.google.com/maps/rpc/shorturl';
        const result=extractParams(window.location.href)
        if(!result||!result.panoId){
            Swal.fire({
                title: 'Error Generating ❌',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick:true,
                backdrop:null,
                customClass: {
                    popup: "swal-small-popup"
                }})
            return
        }
        const pb = `!1shttps://www.google.com/maps/@${result.lat},${result.lng},${result.a}a,${result.y}y,${result.h}h,${result.t}t/data=*213m5*211e1*213m3*211s${result.panoId}*212e0*216shttps%3A%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D${result.panoId}%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D${result.h}%26pitch%3D${(result.t)-90}%26thumbfov%3D100*217i16384*218i8192?coh=205410&entry=tts!2m1!7e81!6b1`;

        const params = new URLSearchParams({
            authuser: '0',
            hl: 'en',
            gl: 'us',
            pb: pb
        }).toString();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const text = response.responseText;
                            const match = text.match(/"([^"]+)"/);
                            if (match && match[1]) {
                                resolve(match[1]);
                            } else {
                                reject('No URL found.');
                            }
                        } catch (error) {
                            reject('Failed to parse response: ' + error);
                        }
                    } else {
                        reject('Request failed with status: ' + response.status);
                    }
                },
                onerror: function (error) {
                    reject('Request error: ' + error);
                }
            });
        });
    }

    function addButtonHoverEffect(button, hoverImageUrl, defaultImageUrl) {
        button.addEventListener("mouseenter", function(event) {
            button.style.backgroundImage = `url(${hoverImageUrl})`;
        });
        button.addEventListener("mouseleave", function(event) {
            button.style.backgroundImage = `url(${defaultImageUrl})`;
        });
    }

    async function getCountryName(code) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://cdn.jsdelivr.net/gh/umpirsky/country-list/data/en_US/country.json",
                onload: function (res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        resolve(data[code.toUpperCase()] || "Unknown");
                    } catch (e) {
                        resolve("Unknown");
                    }
                },
                onerror: function () {
                    resolve("Unknown");
                }
            });
        });
    }   

    async function getAddressFromOSM(lat, lng) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            return data.address;
        } catch (error) {
            console.error("Error fetching address from OSM:", error);
            return "Unknown";
        }
    }

    const locationQueryCache = new Map();
    const typeQueryCache = new Map();

    function getLocationKey({ lat, lng, year, month }, radius) {
        return `${lat}_${lng}_${radius}_${year}_${month}`;
    }

    function getTypeKey({ country, region, year, month }) {
        return `${country}_${region}_${year}_${month}`;
    }

    async function queryByLocation() {
        const { lat, lng, year, month } = LOCATION;
        let radius = CONFIG.NEARBY_CHECK ? Number(CONFIG.NEARBY_CHECK) * 1000 : 10000;

        const queryKey = getLocationKey(LOCATION, radius);
        if (locationQueryCache.has(queryKey)) {
            return locationQueryCache.get(queryKey);
        }

        const params = new URLSearchParams({ lat, lng, radius, year, month, count:1 }).toString();
        const url = `https://vs-update-map.netlify.app/.netlify/functions/queryByLocation?${params}`;

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                responseType: "json",
                onload: res => {
                    try {
                        const json = typeof res.response === "object" ? res.response : JSON.parse(res.response);
                        if (json.error) {
                            reject(new Error("Query failed: API returned error"));
                        } else {
                            locationQueryCache.set(queryKey, json.data); // 可以是 null
                            resolve(json.data);
                        }
                    } catch (e) {
                        reject(new Error("Failed to parse response JSON"));
                    }
                },
                onerror: err => reject(new Error("Network error or CORS issue"))
            });
        });

        return response;
    }

    async function checkUpdateTypes() {
        const { country, region, year, month, generation } = LOCATION;
        const channel_id=generation==='BadCam'?'1231106542351421495':'905824309963014195'
        const queryKey = `${country}_${region}_${year}_${month}`;

        if (typeQueryCache.has(queryKey)) {
            return typeQueryCache.get(queryKey);
        }

        const params = new URLSearchParams({ country, region, year, month, channel_id }).toString();
        const url = `https://vs-update-map.netlify.app/.netlify/functions/checkUpdateType?${params}`;

        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                responseType: "json",
                onload: res => {
                    try {
                        const data = typeof res.response === 'object'
                        ? res.response
                        : JSON.parse(res.response);
                        typeQueryCache.set(queryKey, data);
                        resolve(data);
                        const json = typeof res.response === 'object' ? res.response : JSON.parse(res.response);
                    } catch (e) {
                        reject(new Error("Failed to parse response JSON"));
                    }
                },
                onerror: err => reject(new Error("Network error or CORS issue"))
            });
        });
        return response;
    }

    async function generateUpdateReportText() {

        let genupdate;
        let countryName;
        if(!LOCATION)return
        try{
            if (LOCATION.generation === 'ari'||!LOCATION.country||!LOCATION.region) {
                try {
                    const address = await getAddressFromOSM(LOCATION.lat, LOCATION.lng);
                    if (address) {
                        LOCATION.country = address.country_code || LOCATION.country;
                        LOCATION.countryName = address.country || LOCATION.countryName;
                        LOCATION.region = LOCATION.region||address.state || address.region || address.province || address.county;
                        LOCATION.locality = LOCATION.locality||address.city || address.city_district || address.town;
                        LOCATION.road = address.road || LOCATION.road;
                        countryName = LOCATION.countryName;
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                }
            }

            if (LOCATION.history && LOCATION.links) {
                try {
                    const dates = LOCATION.history.map(pano => [pano[1][0], pano[0]]).sort((a, b) => b[0] - a[0]);
                    if (dates.length > 0) {
                        const metaData = await UE('GetMetadata', LOCATION.links[dates[0][1]][0][1]);
                        var generation = parseMeta(metaData).generation;
                        //if (generation=='Gen2/3') generation ='Gen2update: / :Gen3'
                        if(generation=='BadCam')generation='ari'
                        genupdate = generation === 'Gen4' ? null : `:${generation.toLowerCase()}update:`;
                    }
                } catch (error) {
                    console.error("Error fetching metadata:", error);
                }
            }


            const [currentLink, typeupdate, nearbyUpdate,fetchedCountryName] = await Promise.all([
                getShortUrl(),
                CONFIG.FULL_CHECK?checkUpdateTypes():null,
                CONFIG.NEARBY_CHECK?queryByLocation():null,
                LOCATION.generation !== 'ari' ? getCountryName(LOCATION.country || 'Unknown') : Promise.resolve(countryName)
            ]);

            let position_word
            if(LOCATION.locality){
                if(LOCATION.road){
                    if(LOCATION.road==LOCATION.locality) position_word='on'
                    else position_word='in'
                }
                else position_word='in'
            }
            else{
                if(LOCATION.road){
                    position_word='on'
                }
                else position_word='in'
            }

            const activeTypes = [
                typeupdate?.newyear && ':newyear:',
                typeupdate?.newcountry && ':newcountry:',
                typeupdate?.newregion && ':newregion:'
            ].filter(Boolean)

            const emojiMap = {
                ':newyear:': 'https://cdn.discordapp.com/emojis/1270086438054002699.webp',
                ':newcountry:': 'https://cdn.discordapp.com/emojis/972878615408676946.webp',
                ':newregion:': 'https://cdn.discordapp.com/emojis/972878598073634816.webp'
            };
            const reportParts = [
                `:flag_${LOCATION.country ? LOCATION.country.toLowerCase() : ''}:`,
                ...activeTypes,
                !LOCATION.history ? ':newroad:' : '',
                genupdate || '',
                (LOCATION.generation=='Gen4' && (['IN','PR'].includes(LOCATION.country)))? ':smallcam:': '',
                `${full_months[LOCATION.month - 1]} ${LOCATION.year}`,
                `${position_word} ${LOCATION.locality || LOCATION.road || ''}${(LOCATION.locality || LOCATION.road) ? ', ' : ''}${LOCATION.region}, ${fetchedCountryName}`,
                currentLink || `https://www.google.com/maps/@?api=1&map_action=pano&pano=${LOCATION.panoId}`
            ].filter(Boolean);

            const reportText = reportParts.join(' ');
            GM_setClipboard(reportText, 'text');

            const emojiHtml = activeTypes.map(type =>
                                              `<img src="${emojiMap[type]}" style="width:30px; height:30px; padding:2px;">`
                                             ).join('');
            const discordLink =nearbyUpdate?`https://discord.com/channels/747030604897452130/${nearbyUpdate.channel_id}/${nearbyUpdate.message_id}`:null
            const mapsLink =nearbyUpdate?`https://www.google.com/maps/@?api=1&map_action=pano&pano=${nearbyUpdate.panoId}`:null

            Swal.fire({
                title: `Copy Succeeded${nearbyUpdate?` (Nearby update report found ${formatDistance(nearbyUpdate.distance)} away) `:' '}✔️`,
                html:nearbyUpdate?`<div style="padding:2px; font-size:14px !important">
                                    ${discordLink ? `✉️ <a href="${discordLink}" target="_blank">Discord Message</a>` : ''}
                                    ${mapsLink ? ` 📍 <a href="${mapsLink}" target="_blank">Location</a>` : ''}</div>`
                :(activeTypes.length>0?`<div>${emojiHtml}</div>`:null),
                timer: nearbyUpdate?10000:5000,
                showConfirmButton: false,
                allowOutsideClick:true,
                backdrop:null,
                customClass: {
                    popup: nearbyUpdate?"swal-info-popup":"swal-small-popup"
                }
            });
        }
        catch(e){
            console.error('Error generating update report text: '+e)
            Swal.fire({
                title: 'Error Generating ❌',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick:true,
                backdrop:null,
                customClass: {
                    popup: "swal-small-popup"
                }})
        }
    }

    function addUploadButtonToPage() {
        const container = document.querySelector('.UL7Qtf');
        if(!container || document.getElementById('mwstmm-main')) return;
        const element = document.createElement('div');

        element.id = 'mwstmm-main';

        element.style.backgroundImage=`url(${saveUrl})`
        element.setAttribute('data-text',"Save to MapMaking")

        element.innerHTML = `
        <div class="mwstmm-settings-option" id="mwstmm-opt-save-loc"/>`;

        container.appendChild(element);
        setTimeout(() => {
            if(document.querySelector('.TrU0dc.NUqjXc')){
                element.style.right='0.85rem'
                element.style.top='4rem'
            }}, 100)

        createSettingsButtonSummaryEvents();
    }

    function addNoteButtonToPage() {
        const container = document.querySelector('.UL7Qtf');
        if(!container || document.getElementById('note-btn')) return;

        const element = document.createElement('div');

        element.id = 'note-btn';

        element.style.backgroundImage=`url(${noteUrl})`
        element.setAttribute('data-text',"Generate update report")

        container.appendChild(element);

        element.addEventListener('click', async () => {
            await getLOCATION()
            await generateUpdateReportText()
        });
        setTimeout(() => {
            if(document.querySelector('.TrU0dc.NUqjXc')){
                element.style.right='4rem'
                element.style.top='4rem'
            }}, 100)
    }

    function adSettingsButtonToPage() {
        const container = document.querySelector('.UL7Qtf');
        if(!container || document.getElementById('settings-btn')) return;

        const element = document.createElement('div');

        element.id = 'settings-btn';

        element.style.backgroundImage=`url(${settingUrl})`
        element.setAttribute('data-text',"Settings")

        container.appendChild(element);

        element.addEventListener('click', async () => {
            await showSettingsPopup()
        });
        setTimeout(() => {
            if(document.querySelector('.TrU0dc.NUqjXc')){
                element.style.right='7.2rem'
                element.style.top='4rem'
            }}, 100)
    }

    function toggleElementHidden() {
        if (!isHidden) {
            cleanStyle = GM_addStyle(`
#omnibox-container,
#settings-btn,
#note-btn,
#image-header,
#watermark,
#mwstmm-main,
.Hk4XGb,
.widget-image-header-close,
.widget-image-header-scrim,
.app-viewcard-strip,
.scene-footer,
.content-container,
#titlecard,
#pane {
    display: none !important;
}
        `);
            isHidden = true;
        } else {
            cleanStyle.remove();
            isHidden = false;
        }
    }

    let pageLoaded = false;

    let onFocus;
    const focus_canvas = document.createElement("canvas");
    focus_canvas.style.zIndex=0
    focus_canvas.style.position = "fixed";
    focus_canvas.style.top = "0";
    focus_canvas.style.left = "0";
    focus_canvas.style.width = "100vw";
    focus_canvas.style.height = "100vh";
    focus_canvas.style.pointerEvents = "none";

    focus_canvas.width = window.innerWidth;
    focus_canvas.height = window.innerHeight;
    const ctx = focus_canvas.getContext("2d");

    drawSegmentedLine(ctx, 0, 0, focus_canvas.width, focus_canvas.height,0.8);
    drawSegmentedLine(ctx, focus_canvas.width, 0, 0, focus_canvas.height,0.8);

    let onKeyDown = async (e) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }
        if ((e.metaKey || e.shiftKey)&&(e.key === 'z' || e.key === 'Z')) {
            if(!previousMapId) return
            e.stopImmediatePropagation();
            await getLOCATION()
            importLocations(previousMapId, [{
                id: -1,
                location: {lat: LOCATION.lat, lng: LOCATION.lng},
                panoId: LOCATION.panoId ?? null,
                heading: LOCATION.heading ?? 90,
                pitch: LOCATION.pitch ?? 0,
                zoom: LOCATION.zoom === 0 ? null : LOCATION.zoom,
                tags: LOCATION.tags,
                flags: LOCATION.panoId ? 1 : 0
            }]);
            Swal.fire({
                title: 'Import Succeeded ✔️',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick:true,
                backdrop:null,
                customClass: {
                    popup: "swal-small-popup"
                }
            });
        }
        if (!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(e.key === 'x' || e.key === 'X')){
            if (!onFocus){
                onFocus=true
                document.body.appendChild(focus_canvas)
            }
            else{
                onFocus=false
                document.body.removeChild(focus_canvas)
            }
        }
        if (!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(e.key === 'h' || e.key === 'H')){
            e.stopImmediatePropagation();
            toggleElementHidden()
        }
        if (!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&(e.key === 'c' || e.key === 'c')) {
            e.stopImmediatePropagation();
            const currentLink=await getShortUrl()
            if(!currentLink) return
            GM_setClipboard(currentLink, 'text');
            Swal.fire({
                title: 'Copy Succeeded ✔️',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick:true,
                backdrop:null,
                customClass: {
                    popup: "swal-small-popup"
                }
            });
        }
        if (!e.ctrlKey&&!e.metaKey&&(e.key === 'v' || e.key === 'V')) {
            e.stopImmediatePropagation();
            await getLOCATION()
            await generateUpdateReportText()

        }
    }

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
            return;
        }

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    let sceneFooterObserver = null;

    function onPageLoad() {
        if (pageLoaded) return;
        pageLoaded = true;

        waitForElement("[role='contentinfo']", (sceneFooter) => {
            document.addEventListener("keydown", onKeyDown, true);

            if (sceneFooterObserver) {
                sceneFooterObserver.disconnect();
            }

            sceneFooterObserver = new MutationObserver(() => {
                const navigationDiv = document.querySelector("[role='navigation']");

                if (navigationDiv) {
                    addCustomButton();
                    addUploadButtonToPage();
                    addNoteButtonToPage();
                    adSettingsButtonToPage();
                } else {
                    document.getElementById('mwstmm-main')?.remove();
                    document.getElementById('note-btn')?.remove();
                    document.getElementById('settings-btn')?.remove();
                }
            });

            sceneFooterObserver.observe(sceneFooter, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        });
    }
    if (!pageLoaded) {
        window.addEventListener('load', onPageLoad);
    }
})();