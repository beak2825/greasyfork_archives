// ==UserScript==
// @name           Filtruj tematy by Agysx
// @namespace      https://gist.github.com/Agysx/94eab71cdecd7e2fc2004261a98a8f1c/raw/efc96c13459012b612d5cb301ea0035ecdd9879e/forumTopicsFilter.user.js
// @description    Pozwala filtrować tematy według frazy, tagów itp.
// @include        http://forum.margonem.pl/?task=forum&show=topics&id=*
// @include        https://forum.margonem.pl/?task=forum&show=topics&id=*
// @version        1.0
// @author         Agysx
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/447770/Filtruj%20tematy%20by%20Agysx.user.js
// @updateURL https://update.greasyfork.org/scripts/447770/Filtruj%20tematy%20by%20Agysx.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function initHtml() {
        var $forum = document.querySelector('#forum');
        var opt = document.createElement('div');
        $forum.insertBefore(opt, $forum.querySelector('h2').nextSibling);
        opt.className = 'forumSort';
        return opt;
    }

    function initCss() {
        var $css = document.createElement('style');
        $css.type = 'text/css';
        document.querySelector('head').appendChild($css);
        $css.appendChild(document.createTextNode(`
			.forumSort{
				display: inline-block;
			}
			.forumSort > * {
				margin-left: 4px;
			}
			.phrazeSearcherInfo {
				display: inline-block;
			}
			button.tagButton {
				border: 1px solid #a87227;
				background: #ffee99;
				color: black;
				padding: 2px;
			}
			.active {
				border: 2px solid red !important;
			}
		`));
    }

    function Topic($e) {
        var self = this;
        this.$ = $e;
        this.$topname = $e.querySelector('.topname');
        this.name = this.$topname.querySelector('a[href]').textContent;
        this.lowerCaseName = this.name.toLowerCase();
        this.tags = [];
        var exec = this.name.match(/\[[^\[\]]+\]/g);
        if(exec !== null) {
            exec.forEach(function(tag) {
                self.tags.push(tag.substr(1, tag.length - 2));
            });
        }
        this.isRoll = this.$topname.querySelector('img') !== null;
        var helper = this.$topname.childNodes[this.isRoll ? 2 : 0];
        this.nailed = helper.nodeType === 3 && helper.nodeValue === '\n[przybity]';
        this.closed = helper.nodeType === 3 && helper.nodeValue === '\n[zamknięty]';
        if(helper.nodeType === 3 && helper.nodeValue === '\n[przybity][zamknięty]') {
            this.closed = true;
            this.nailed = true;
        }
        this.hide = function() {
            self.$.style.display = 'none';
        };
        this.show = function() {
            self.$.style.display = '';
        };
    }
    var filters = {
        closed: false
    };
    var topics = [];
    var tags = [];
    var newTopic = function($e) {
        topics.push(new Topic($e));
        topics[topics.length - 1].tags.forEach(function(tag) {
            if(tags.indexOf(tag) > -1) return;
            tags.push(tag);
        });
    };
    document.querySelectorAll("#forum .topics tr:not(:first-child)").forEach(newTopic);

    var filterByPhraze = function(phraze) {
        phraze = phraze.toLowerCase();
        topics.forEach(function(val) {
            toggleShow(val, val.lowerCaseName.indexOf(phraze) > -1);
        });
        changeActive($input);
    };
    var filterByTag = function(e) {
        $input.value = '';
        var tag = this.getAttribute('data-tag');
        topics.forEach(function(val) {
            toggleShow(val, val.tags.indexOf(tag) > -1);
        });
        changeActive(e.target);
    };
    var toggleShow = function(val, bool) {
        if(filters.closed === true && val.closed === false) bool = false;
        if(bool) val.show();
        else val.hide();
    };
    var changeActive = function($target) {
        active = $target;
        $opt.querySelector('.active').classList.remove('active');
        if(typeof $target !== 'undefined') $target.classList.add('active');
    };

    initCss();
    var $opt = initHtml();

    var $showAll = document.createElement('button');
    $showAll.classList.add('tagButton');
    $showAll.classList.add('active');
    $showAll.appendChild(document.createTextNode('Wszystko'));
    $showAll.addEventListener('click', function() {
        $input.value = '';
        topics.forEach(function(val) {
            toggleShow(val, true);
        });
        changeActive(this);
    });
    $opt.appendChild($showAll);

    tags.forEach(function(tag) {
        var $but = document.createElement('button');
        $but.setAttribute('data-tag', tag);
        $but.appendChild(document.createTextNode(tag));
        $but.classList.add('tagButton');
        $but.addEventListener('click', filterByTag);
        $opt.appendChild($but);
    });

    var $inputTxt = document.createElement('div');
    $inputTxt.classList.add('phrazeSearcherInfo');
    $inputTxt.appendChild(document.createTextNode('Szukaj frazy:'));
    $opt.appendChild($inputTxt);

    var $input = document.createElement('input');
    $input.classList.add('phrazeSearcher');
    $opt.appendChild($input);
    $input.addEventListener('input', function(e) {
        filterByPhraze(this.value);
        if(this.value === '') changeActive($showAll);
    });

    var $closed = document.createElement('button');
    $closed.classList.add('tagButton');
    $closed.appendChild(document.createTextNode('Zamknięte'));
    $closed.addEventListener('click', function() {
        $input.value = '';
        topics.forEach(function(val) {
            toggleShow(val, val.closed);
        });
        changeActive(this);
    });
    $opt.appendChild($closed);

    var $onlyNailed = document.createElement('button');
    $onlyNailed.classList.add('tagButton');
    $onlyNailed.appendChild(document.createTextNode('Przybite'));
    $onlyNailed.addEventListener('click', function() {
        $input.value = '';
        topics.forEach(function(val) {
            toggleShow(val, val.nailed);
        });
        changeActive(this);
    });
    $opt.appendChild($onlyNailed);

    var $onlyClosed = document.createElement('input');
    $onlyClosed.type = 'checkbox';
    $onlyClosed.classList.add('filterClosedOnly');
    $onlyClosed.addEventListener('input', function() {
        filters.closed = this.checked;
        if(active === $input) filterByPhraze($input.value);
        else active.click();
    });
    $opt.appendChild($onlyClosed);
    $opt.appendChild(document.createTextNode('Tylko zamknięte'));

    var active = $showAll;
})();