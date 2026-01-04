// ==UserScript==
// @name     Togethertube Fix
// @include  https://togethertube.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @description fart
// @version 0.0.1.20181009064254
// @namespace https://greasyfork.org/users/218256
// @downloadURL https://update.greasyfork.org/scripts/373037/Togethertube%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/373037/Togethertube%20Fix.meta.js
// ==/UserScript==

GM_addStyle ( `
    body {
    	background-color: #111111 !important;
    	color: #f3f3f3 !important;
    }

    .container-non-responsive {
    	width: 92% !important;
        max-width: 1700px !important;
    }

    .navbar-default {
    background-color: #000 !important;
    border-color: #222 !important;
	}

	.slider .leftTrack {
		background-color: #15243a !important;
	}

	.slider .statusTrack {
		background-color: #060606 !important;
	}

	.slider .track {
		background-color: #060606 !important;
	}

	ol.videoList>li.videoListEntry .header {
    padding: 4px 5px;
    background-color: #000000 !important;
    border: 1px solid #111 !important;
    border-radius: 4px 4px 0 0;
    border-bottom-width: 0;
    position: relative;
	}

	ol.videoList>li.videoListEntry .content {
    border: 1px solid #000 !important;
    border-radius: 0 0 4px 4px;
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    display: table;
    table-layout: fixed;
    background-color: #111 !important
	}

	.panel-default {
    border-color: #000 !important;
	}

	.panel {
    margin-bottom: 20px;
    background-color: #000 !important;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
	}

	.panel-footer {
    padding: 10px 15px;
    background-color: #000000 !important;
    border-top: 1px solid #000 !important;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
	}

	ol.user-list>li:nth-child(even) {
    background-color: #000000 !important;
	}

	textarea {
		background-color: #000 !important;
		color: #fafafa !important;
	}

	ol.videoList>li.videoListEntry .content>.list-container {
    min-height: 20px;
    padding: 19px;
    margin-bottom: 20px;
    background-color: #000000 !important;
    border: 1px solid #252525 !important;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    padding: 5px;
    }

    .nav-tabs>li.active>a, .nav-tabs>li.active>a:hover, .nav-tabs>li.active>a:focus {
    color: #fafafa !important;
    background-color: #000 !important;
    border: 1px solid #292929 !important;
    border-bottom-color: transparent;
    cursor: default;
	}

	.nav-tabs {
    border-bottom: 1px solid #292929 !important;
	}

	#player #positionSlider {
    border-radius: 4px 4px 0 0;
    border-color: #292929 !important;
    margin-bottom: 0;
    margin-top: 4px;
	}

	ol.user-list>li:first-child {
    border-top: 1px solid #000 !important;
	}

	ol.user-list>li {
    display: table;
    width: 100%;
    height: 25px;
    padding: 5px;
    border-bottom: 1px solid #000 !important;
	}

	.btn-default {
    color: #949494 !important;
    background-color: #191919 !important;
    border-color: #0c0c0c !important;
	}

	.slider {
    border: 1px solid #292929 !important;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    margin-bottom: 4px;
	}

	.btn-success {
    color: #fff;
    background-color: #15243a !important;
    border-color: #4d62b3 !important;
    }

    .form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.428571429;
    color: #555;
    background-color: #131313 !important;
    background-image: none;
    border: 1px solid #1d1d1d !important;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
	}



` );