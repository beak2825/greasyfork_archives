// ==UserScript==
// @name           Wikipedia Reading List
// @description    Create a Reading List in the left area. Long click on a Link to add to the List (or remove from).
// @match          https://*.wikipedia.org/*
// @run-at         document-end
// @version        1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/373409/Wikipedia%20Reading%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/373409/Wikipedia%20Reading%20List.meta.js
// ==/UserScript==

if(typeof unsafeWindow == "undefined") {
	unsafeWindow = window;
}
const DB = "readList";

var readList = {
  db: [],
  index: {},
  leftArea: null,

  //+------------------------------------------------------
  //|
  //| INITIALIZATION
  //|
  //+------------------------------------------------------

  init: function() {
    this.initCSS();
    this.initDatabase();
    this.initEvents();
    this.initLeftArea();
  },

  // Add our CSS  to the page
  initCSS: function() {
    var css = document.createElement('style');

    css.textContent = `
    a {
      transition: background .3s;
    }
    .readlist {
      background: rgba(255,215,0,0.6);
    }
    .addToReadList {
      animation: addToReadList .3s;
    }
		#p-readlist ul {
      position: relative;
      left: -1em;
			padding-left: 1em !important;
			width: 100%;
			overflow: hidden;
		}
		#p-readlist a {
			white-space: nowrap;
		}
    #p-readlist .delete {
			display: none;
			width: 1em;
			margin-left: -1.2em;
    }
		#p-readlist a:hover .delete {
			display: inherit;
		}`;
    document.head.appendChild(css);
  },

  /**
   * Initialize database
   */
  initDatabase: function() {
    var data = localStorage.getItem(DB);

    if(!data) {
      return;
    }
    this.db = JSON.parse(data);
    this.db.forEach(function([href, title]) {
			this.index[href] = 1;
    }.bind(this));

    // Init classes of links in this page
    var aList = document.querySelectorAll('a');

    for(let i=0; i<aList.length; i++) {
      let href = aList[i].getAttribute('href');

    	if(href && typeof this.index[href.trim()] != "undefined") {
      	aList[i].classList.add("readlist");
      }
    }
  },

  /**
   * Add eventlisteners to handle long click on a link
   */
  initEvents: function() {
    var timerClickDuration,
        clicLong = false;

    var onMousedown = function(e, isNav){
      if (!e.target.matches('a')) {
        return;
      }
      if(readList.isRightClick(e)) {
      	return;
      }

      timerClickDuration = setTimeout(function(){
        clicLong = true;
        readList.handleClick(e.target, isNav || false);
      }, 200);
    };
    var onClick = function(e, isNav){
      timerClickDuration && clearTimeout(timerClickDuration);
      if(!clicLong) {
        return;
      }
      e.preventDefault();
      clicLong = false;
    };

    document.getElementById('bodyContent').addEventListener('mousedown', onMousedown);
    document.getElementById('bodyContent').addEventListener('click', onClick);
    document.getElementById('left-navigation').addEventListener('mousedown', function(e){
      onMousedown(e, true);
    });
    document.getElementById('left-navigation').addEventListener('click', function(e){
    	onClick(e, true);
    });

    // Listen changes to readList from another tab
    window.addEventListener('storage', function (e) {
      switch(e.key) {

        case DB + '_add':
          var [href, title] = JSON.parse(e.newValue);
          readList.add(href, title, true);
        	break;

        case DB + '_remove':
        	readList.remove(e.newValue, true);
          break;
      }
    });
  },

  /**
   * Checks if the click event has been triggered
   * with the right button of the mouse
   * @param ClickEvent e
   * @return boolean
   */
  isRightClick: function(e) {

    // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    if ("which" in e) {
      return e.which == 3; 
    }

    // IE, Opera
    if ("button" in e) {
      return e.button == 2;
    }
    return false;
  },

  /**
   * Display the reading list in the left area 
   */
  initLeftArea: function() {

    // Add readList block to left area
		var div = document.createElement('div');
    div.innerHTML = `
		<div class="portal" role="navigation" id="p-readlist" aria-labelledby="p-readlist-label">
			<h3 id="p-readlist-label">Reading List</h3>
			<div class="body"><ul></ul>
		</div>`;

    document.getElementById('mw-panel').appendChild(div);
    this.leftArea = document.getElementById('p-readlist').querySelector('ul');

    // Display current readList
    for(let i=0; i<this.db.length; i++) {
    	var [href, title] = this.db[i];
			this.addToLeftArea(href, title);
    }

    // Listen click on "delete"
    this.leftArea.addEventListener('click', function(e) {
      if (!e.target.matches('.delete')) {
        return;
      }
      e.preventDefault();

      // Confirm before delete
      if (!confirm(`Delete "${e.target.nextElementSibling.innerText}" ?`)) {
      	return;
      }
      readList.remove(e.target.parentNode.getAttribute('href'));
    });
  },

  /**
   * Display link in left area
   * @param string href
   * @param string title
   */
  addToLeftArea: function(href, title) {
    var li = document.createElement('li');
    li.innerHTML = `<a href="${href}" title="${title}">
											<span class="delete" title="Delete">&times;</span>
											<span>${title}</span>
										</a>`;
    this.leftArea.appendChild(li);
  },

  //+------------------------------------------------------
  //|
  //| ADD OR REMOVE FROM READLIST
  //|
  //+------------------------------------------------------

  /**
   * Called after a long click on link
   * @param DOMElement a
   * @param boolean isNav
   */
  handleClick: function(a, isNav) {
   var href = a.getAttribute('href').trim();

    if(typeof this.index[href] == "undefined") {
      var title = (isNav ? document.getElementById('firstHeading') : a).innerText.trim();

  		this.add(href, title, false);
    } else {
      this.remove(href, false);
    }
  },

  /**
   * Add link to reading list
   * @param string href
   * @param string title
   * @param boolean isSync
   */
  add: function(href, title, isSync) {
    if(/^javascript:/.test(href)) {
    	return;
    }

    // Add class to every link with this href
    var aList = document.querySelectorAll("a[href='" + href + "']");

		for(let i=0; i<aList.length; i++) {
    	aList[i].classList.add('readlist');
    }

    // Update database
		this.index[href] = 1;
    this.db.push([href, title]);

    if(!isSync) {
      localStorage.setItem(DB + '_add', JSON.stringify([href, title])); // used to sync all tabs
    	this.saveDb();
    }

    // Update list in left area
    this.addToLeftArea(href, title);
  },

  /**
   * Remove link from read link
   * @param string href
   * @param boolean isSync
   */
  remove: function(href, isSync) {

    // Remove class to every link with this href
    var aList = document.querySelectorAll("a[href='" + href + "']");

		for(let i=0; i<aList.length; i++) {
    	aList[i].classList.remove('readlist');
    }

    // Update database
    delete this.index[href];
    var i = this.db.findIndex(([_href, _title]) => _href === href);
    this.db.splice(i, 1);

    if(!isSync) {
      localStorage.setItem(DB + '_remove', href); //  used to sync all tabs
    	this.saveDb();
    }

    // Update list in left area
    var a = this.leftArea.querySelector("a[href='" + href + "']");
    a && this.leftArea.removeChild(a.parentNode);
  },

  /**
   * Save db to localStorage
   */
  saveDb: function() {
    setTimeout(function(){
    	localStorage.setItem(DB, JSON.stringify(this.db));
    }.bind(this),0);
  }
};

window.addEventListener('load', function(){
	readList.init();
}, false);
