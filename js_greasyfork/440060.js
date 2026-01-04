// ==UserScript==
// @name         Anti Anti-debugger
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Stops most (not all) anti-debugging implementations by JavaScript obfuscators and stops the console logs from being automatically cleared.
// @author       hacker09
// @include      *
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440060/Anti%20Anti-debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/440060/Anti%20Anti-debugger.meta.js
// ==/UserScript==

(function() {
  var interval = setInterval(function() { //Creates a new interval function
    unsafeWindow.console.clear = () => {}; //Stops the console logs from being cleared
  }, 0); //Finishes the set interval function

  window.onload = function() //When the page finishes loading
  { //Starts the onload function
    clearInterval(interval); //Breaks the timer that stops the console log from being cleared every 0 secs
  }; //Finishes the onload function

  if (location.href.match(/vidstream.pro|mcloud.to/) === null) //Check the iframe url
  { //Starts the if condition
    var _constructor = unsafeWindow.Function.prototype.constructor;
    unsafeWindow.Function.prototype.constructor = function() { //Hook Function.prototype.constructor
      var fnContent = arguments[0];
      if (fnContent) {
        if (fnContent.includes('debugger')) { //An anti-debugger is attempting to stop debugging
          var caller = Function.prototype.constructor.caller; // Non-standard hack to get the function caller
          var callerContent = caller.toString();
          if (typeof callerContent === 'string' && callerContent.includes('debugger')) { //Eliminate all debugger statements from the caller, if any
            callerContent = callerContent.replace(/\bdebugger\b/gi, ''); //Remove all debugger expressions
            eval('caller = ' + callerContent); //Replace the function
          }
          return (function() {});
        }
      }
      return _constructor.apply(this, arguments); //Execute the normal function constructor if nothing unusual is going on
    };
  } //Finishes the if condition
})();