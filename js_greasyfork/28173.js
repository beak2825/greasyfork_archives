// ==UserScript==
// @name        Download GNOME Extensions
// @namespace   http://pokethought.tk
// @description Provides downloads and compatibility info for GNOME Extensions on extensions.gnome.org.
// @version     3.24.0.1
// @icon        https://upload.wikimedia.org/wikipedia/commons/3/39/Gnomelogo-footprint.svg
// @author      moriel5
// @include     https://extensions.gnome.org/extension/*/*/
// @include     https://extensions.gnome.org
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28173/Download%20GNOME%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/28173/Download%20GNOME%20Extensions.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// - User Options -
var hideError = 'yes'; // this hides the "We cannot detect a running copy of GNOME on this system" error message.

var msgdiv = document.getElementById('message_container');
if (hideError == "yes") { msgdiv.style.display = "none"; }
var extdetails = document.getElementsByClassName('extension-details');
var datavals = document.getElementsByClassName('single-page');
var datauuid = datavals[0].getAttribute('data-uuid');
var datasvm = datavals[0].getAttribute('data-svm');
extdetails[0].insertAdjacentHTML('afterend', '<div id="download-buttons" style="display:inline-block;"><strong>Downloads:</strong><br /><ul id="downlist" style="list-style:none;padding:0;margin:0;"></ul></div>');
var downlist = document.getElementById('downlist');
if (datasvm.indexOf("3.24") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.24">3.24</a></li>';}
if (datasvm.indexOf("3.22") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.22">3.22</a></li>';}
if (datasvm.indexOf("3.20") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.20">3.20</a></li>';}
if (datasvm.indexOf("3.18") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.18">3.18</a></li>';}
if (datasvm.indexOf("3.16") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.16">3.16</a></li>';}
if (datasvm.indexOf("3.14") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.14">3.14</a></li>';}
if (datasvm.indexOf("3.12") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.12">3.12</a></li>';}
if (datasvm.indexOf("3.10") !=-1) { downlist.innerHTML += '<li style="height: 34px;margin:0 10px 10px 0;float:left;"><a style="display: inline;font-weight: bold;border-style: solid;border-width: 2px;text-align: center;border-radius: 4px;background-color: #468736;border-color: #346428;padding:7px 10px 5px 10px;color:#eee;text-decoration:none;text-shadow:1px 1px 2px rgba(0,0,0,0.4);font-family:Cantarell;" href="https://extensions.gnome.org/download-extension/' + datauuid + '.shell-extension.zip?shell_version=3.10">3.10</a></li>';};
