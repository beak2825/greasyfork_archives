// ==UserScript==
// @name       Mint Sticky Budget Summary
// @namespace  http://mint.com/
// @version    1.0.1
// @description  Keep the budget summary box on-screen in the right column.
// @match      https://wwws.mint.com/planning.event
// @require    https://code.jquery.com/jquery-2.1.1.min.js
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4408/Mint%20Sticky%20Budget%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/4408/Mint%20Sticky%20Budget%20Summary.meta.js
// ==/UserScript==

(function ($) {
  StickySummary = {
    // Declare elements
    sidebar: [],
    summary: [],
    buffer: 30,
    boxtop: 0,

    // Init
    init: function() {
      var self = this;

      $(window).scroll(function() {
        // Ensure the elements are set.
        // They appear to be loaded via ajax from Mint.
        if (self.sidebar.length == 0) {
          self.sidebar = $('#main td.details-budgets');
          self.summary = $("#right_col", self.sidebar);

          if (self.sidebar.length > 0) {
            // Set the top buffer
            var $pos = self.summary.offset();
            self.boxtop = $pos.top;
          }
        }

        // Compare the position with the top of the screen and lock the summary
        // if it scrolls past the top.
        if (self.sidebar.length > 0) {
          var $pos = $(document).scrollTop();

          if ($pos >= (self.boxtop - self.buffer)) {
            self.summary.css({
              'position': 'fixed',
              'top': self.buffer,
              'margin-top': 0
            });
          }
          else {
            self.summary.css({
              'position': 'static',
              'top': '',
              'margin-top': ''
            });
          }
        }
      });
    }
  };

  // Run the script
  $(document).ready(function() {
    StickySummary.init();
  });
})(jQuery);

