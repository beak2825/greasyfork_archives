// ==UserScript==
// @name           Memrise Review Selection
// @description    Review the words you select (for a given level)
// @match          http://*.memrise.com/course/*
// @match          https://*.memrise.com/course/*
// @run-at         document-end
// @version        1.0
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/389864/Memrise%20Review%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/389864/Memrise%20Review%20Selection.meta.js
// ==/UserScript==			

/* jshint esversion:6 */

function main() {
  var ReviewSelection = {};

  //+------------------------------------------------------
  //|
  //| Handles the Level's details page
  //|  https://decks.memrise.com/course/ID_COURSE/SLUG/ID_LEVEL/
  //|
  //+------------------------------------------------------

  ReviewSelection.list = {
    HIDDEN: true,
    reviewBtn: null,

    /**
     * Init elements
     */
    init() {

      // Add CSS
      var styles = `
          .review-show, .review-10 {
            cursor: pointer;
						margin-right: 5px;
          }
          .reviewSelection {
            background-image: none;
            text-shadow: none;
          }
          .reviewSelection.hide {
            display: none;
          }`;

      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);

      // Add the button "review" (to toggle checkboxes)
      var toggleBtn = document.createElement('a');
      toggleBtn.setAttribute('title', "Select the words to review");
      toggleBtn.setAttribute('class', "review-show mini pull-left");
      toggleBtn.innerText = 'Review';

      document.querySelector('.things-header').appendChild(toggleBtn)
              .addEventListener('click', ReviewSelection.list.toggleCheckbox);

      // Add the button "+10 last" (to check the 10 mast checkboxes)
      var checkLastBtn = document.createElement('a');
      checkLastBtn.setAttribute('title', "Select the 10 last words");
      checkLastBtn.setAttribute('class', "review-10 mini pull-left hide");
      checkLastBtn.innerText = '+10 last';

      ReviewSelection.list.checkLastBtn = document.querySelector('.things-header').appendChild(checkLastBtn);
			ReviewSelection.list.checkLastBtn.addEventListener('click', ReviewSelection.list.check10last);

      // Add the button "review the selected words" to the end of the list
      var reviewBtn = document.createElement('button');
      reviewBtn.setAttribute('type', 'button');
      reviewBtn.setAttribute('class', 'btn-primary btn-large btn-block reviewSelection hide');
      reviewBtn.innerText = 'Review the selected words';

      ReviewSelection.list.reviewBtn = document.querySelector('.things-footer').appendChild(reviewBtn);
			ReviewSelection.list.reviewBtn.addEventListener('click', ReviewSelection.list.launchReviewSession);

      // Hide "review the selected words" when clicking on "Ignore"
      document.querySelector('.ignore-show').addEventListener('click', function(){
        ReviewSelection.list.reviewBtn.classList.add('hide');
        ReviewSelection.list.HIDDEN = true;
        ReviewSelection.list.checkLastBtn.classList.add('hide');
      });
    },

    /**
     * Toggle display/hide checkboxes
     */
    toggleCheckbox() {
      ReviewSelection.list.HIDDEN = !ReviewSelection.list.HIDDEN;
      ReviewSelection.list.selectWords(ReviewSelection.list.HIDDEN);
      
      if(ReviewSelection.list.HIDDEN) {
      	ReviewSelection.list.checkLastBtn.classList.add('hide');
      } else {
        ReviewSelection.list.checkLastBtn.classList.remove('hide');
      }
    },
    
    /**
     * Check the last 10 words to review
     */
    check10last() {
      var things = document.querySelectorAll('.thing'),
          c      = 0;
          n      = 0;

      for(let i=things.length-1; i>=0; i--) {
        let thing     = things[i],
            thinguser = thing.querySelector('.thinguser');

        if(thinguser.firstElementChild.classList.contains('ico-seed')) {
        	continue;
        }
        if(!thing.querySelector('input').checked) {
          thing.querySelector('input').checked = true;
          c++;
        }
        if(++n == 10) {
          if(c == 0) {
          	n = 0;
          } else {
          	break;
          }
        }
      }
    },

    /**
     * Show or hide the checkboxes
     */
    selectWords(hide) {
      if(typeof hide != 'boolean') {
        hide = false;
      }

      var things       = document.querySelectorAll('.thing'),
          showDelay    = hide ? 'block' : 'none',
          showCheckbox = hide ? 'none' : 'block';

      for(let i=0; i<things.length; i++) {
        let thing     = things[i],
            thinguser = thing.querySelector('.thinguser');

        if(thinguser.firstElementChild.classList.contains('ico-seed')) {
        	continue;
        }
        thinguser.style.display = showDelay;
        thing.querySelector('.ignore-ui').style.display = showCheckbox;
      }

      if(hide) {
        ReviewSelection.list.reviewBtn.classList.add('hide');
      } else {
        ReviewSelection.list.reviewBtn.classList.remove('hide');
      }
    },

    /**
     * Retrieve the list of checked boxes
     * Save the selection in the localStorage
     * Then start a review session
     */
    launchReviewSession() {

      // Get the selection
      var divs      = document.querySelectorAll('.ignore-ui'),
          selection = {},
          c         = 0,
          n         = 0;

      for(let i=0; i<divs.length; i++) {
        let div = divs[i];
        if(!div.classList.contains('pull-right') || div.style.display !== 'block' || !div.firstElementChild) {
          continue;
        }
        if(div.firstElementChild.checked) {
          let id = div.parentNode.getAttribute('data-learnable-id');
          selection[id] = 1;
          c++;
        }
        n++;
      }
      divs = null;
      if(c == 0) {
        alert('Please select the words to review');
        return;
      }

      // Save the selection to localStorage      
      var url  = window.location.pathname,
          data = {time: Date.now(), list: selection, ntotal: n};

      [,idCourse,idxLevel] = url.match(/\/course\/(\d+)\/[^/]+\/(\d+)/);

      localStorage.setItem('reviewSession_' + idCourse + '_' + idxLevel, JSON.stringify(data));

      // Redirect to review
      url += 'garden/classic_review/?selection';
      window.location.href = url;
    }
  };

  
  //+------------------------------------------------------
  //|
  //| Handles the Review page
  //|  https://decks.memrise.com/course/ID_COURSE/SLUG/ID_LEVEL/garden/classic_review/*?selection
  //|
  //+------------------------------------------------------

  ReviewSelection.session = {
    isLoaded: false,
    key: '',

    /**
     * Init elements
     */
  	init() {

      // Check that we have a selection in memory
      var idCourse   = MEMRISE.garden.session_params.course_id,
          idxLevel   = MEMRISE.garden.session_params.level_index;

      ReviewSelection.session.key = 'reviewSession_' + idCourse + '_' + idxLevel;

      var dataFilter = localStorage.getItem(ReviewSelection.session.key);
      if(!dataFilter) {
        window.location = ReviewSelection.session.get_redirect_url();
      	return;
      }

      // Retrieve our selection
      //localStorage.removeItem(ReviewSelection.session.key);

      try {
        ReviewSelection.session.dataFilter = JSON.parse(dataFilter);
      } catch(e) {
        window.location = ReviewSelection.session.get_redirect_url();
				return;
      }

      // Whenever we receive a JSON response:
      // Filter the data
      $.ajaxSetup({
        converters: {
        	'text json': function(txt) {
            var data = JSON.parse(txt);
            
            if(data.boxes) {
            	ReviewSelection.session.filter(data);
            }
            return data;
          }
        }
      });
    },

    /**
     * Returns the URL of the current level details
     */
    get_redirect_url() {
      return `/course/${MEMRISE.garden.session_params.course_id}/${MEMRISE.garden.session_params.clouse_slug}/${MEMRISE.garden.session_params.level_index}/`;
    },

    /**
     * Filter the retrieved review data
     * To only include the selection
     */
    filter(data) {
      
      // Filter
      var boxes  = [],
          learns = [];

      for(let i=0; i<data.boxes.length; i++) {
        let box          = data.boxes[i],
            learnable_id = box.learnable_id;

        if(ReviewSelection.session.dataFilter.list[learnable_id]) {
          box.template  = 'sentinel';
          box.review_me = true;
          boxes.push(box);
          learns.push(data.learnables[i]);
        }
      }

      // Randomize
      var tmp, rand,
          n = boxes.length;

      while(n > 1) {
        rand = Math.floor(Math.random() * n);
        n--;

        tmp          = boxes[n];
        boxes[n]     = boxes[rand];
        boxes[rand]  = tmp;

        tmp          = learns[n];
        learns[n]    = learns[rand];
        learns[rand] = tmp;
      }

      // Save
      data.boxes             = boxes;
      data.learnables        = learns;
      data.session.num_items = boxes.length;
      data.session.slug      = 'classic_review';
  	}
  };
  
  //+------------------------------------------------------
  //|
  //| Init
  //|
  //+------------------------------------------------------

  if(MEMRISE.garden) {
    if(window.location.search == '?selection') {
      MEMRISE.garden.session_params.session_slug = 'preview'; // retrieve every words of the current level
	  	ReviewSelection.session.init();
    }

  } else if(document.querySelector('.things-header')) {
  	ReviewSelection.list.init();
  }
}

// Inject JS directly in page to prevent limitations of access
var script = document.createElement('script');

script.setAttribute("type", "application/javascript");
script.appendChild(document.createTextNode('('+ main +')();'));
document.body.appendChild(script);