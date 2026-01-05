// ==UserScript==
// @name        WordPress plugin support search
// @namespace   wordpress.org
// @include     https://wordpress.org/support/plugin/*
// @version     1.1.2
// @description Shows up on "Support" and "Reviews" tabs on WordPress plugin page and adds a form to search the support forum threads on Google; name of the plugin is added automatically.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18505/WordPress%20plugin%20support%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/18505/WordPress%20plugin%20support%20search.meta.js
// ==/UserScript==

//  History:
//  1.0.0   initial release
//  1.1.0   fix for HTML changes on WordPress.org site
//  1.1.1   fix when URL ends up with a slash
//  1.1.2   fix for HTML changes on WordPress.org site
//          fixed finding plugin's name (on subsequent forum pages)
//          plugin's name in query is surrounded with quotes

// URL e.g. https://wordpress.org/support/plugin/wp-super-cache/page/2
var pluginName = window.location.href.split('/')[5].split('-').join(' ');
var pluginNameWordCounter = pluginName.split(' ').length;

// clean up search input on window focus (i.e. remove `site:wordpress.org` and plugin name)
window.onfocus = function(e) {
    var query = document.getElementById('q').value;
    query = query.split(' ');
    query.splice(0, pluginNameWordCounter + 1);
    query = query.join(' ');
    document.getElementById('q').value = query;
}

var topics = document.getElementById('bbp-forum-0');
var searchForm = document.createElement('form');
var searchHintText = document.createTextNode('search support threads:');
    searchForm.setAttribute('method', 'get');
    searchForm.setAttribute('action', 'https://www.google.com/search');

var fieldset = document.createElement('fieldset');
    fieldset.setAttribute('style', 'width: 100%; margin-bottom: 35px; font-size: 14px; border: none;');

    fieldset.appendChild(searchHintText);

var searchText = document.createElement('input');
    searchText.setAttribute('type', 'text');
    searchText.setAttribute('id', 'q');
    searchText.setAttribute('name', 'q');
    searchText.setAttribute('style', 'font: 16px Verdana, Arial, Helvetica, sans-serif; padding: 5px 10px; width: 250px; margin: 0 20px;');

var target = document.createElement('input');
    target.setAttribute('type', 'checkbox');
    target.setAttribute('checked', 'checked');
    target.setAttribute('id', 'new_tab');
    target.setAttribute('style', 'margin-left: 15px;');

var targetLabel = document.createElement('label');
    targetLabel.setAttribute('for', 'new_tab');
    targetLabel.setAttribute('style', 'margin-left: 5px; cursor: pointer; vertical-align: 2px; font-size: 14px;');
    targetLabel.innerHTML = 'new tab';

var submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'search');
    submitButton.setAttribute('style', 'margin-top: 3px;');
var submitButtonText = document.createTextNode('search');

    submitButton.appendChild(submitButtonText);

topics.parentNode.insertBefore(searchForm, topics);
    searchForm.appendChild(fieldset);
        fieldset.appendChild(searchText);
        fieldset.appendChild(submitButton);
        fieldset.appendChild(target);
        fieldset.appendChild(targetLabel);

searchText.focus();

// register listener on `submit`
searchForm.addEventListener('submit', function(event) {
    var searchTerm = document.getElementById('q').value;
    if (searchTerm == '') {
        alert('You need to enter a query!');
        searchText.focus();
        event.preventDefault();
    }
    else {
        // add `target="_blank"` if necessary
        if (document.getElementById('new_tab').checked) {
            searchForm.setAttribute('target', '_blank');
        }
        document.getElementById('q').value = 'site:wordpress.org "' + pluginName + '" ' + searchTerm;
    }
}, false);