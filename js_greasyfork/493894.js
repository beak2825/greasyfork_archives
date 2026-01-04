// ==UserScript==
// @name         Pendoria++
// @description  Adds extra functionality & features
// @namespace    https://pendoria.net/
// @version      1.0.1
// @author       Saya
// @contributor  Kidel
// @contributor  Xortrox
// @contributor  Puls3
// @contributor  Calamitas
// @match        https://pendoria.net/*
// @match        https://www.pendoria.net/*
// @include      /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @run-at       document-start
// @icon         https://pendoria.net/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493894/Pendoria%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/493894/Pendoria%2B%2B.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", () => {

	const moduleName = 'Pendoria++';
	const version = '1.0.1';
  console.log(`%c[${moduleName} v${version}]` + '%c Initialized.', "color: #f28424;", "color: white;");

/*====================================================================*/

  let BackgroundImagesArray = [
    'https://pendoria.net/images/pendoria-1920-1080.jpg', /* DEFAULT PEND 1920x1080 */
    'https://pendoria.net/images/pendoria-3840-2160.jpg', /* DEFAULT PEND 3840x2160 */
    'https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/dev/background.jpg', /* ELITE UI 1920x1080 */
    'https://i.imgur.com/n5cRcfO.jpg' /* PENDORIA++ */
  ];
	let CustomBackgroundImageURL = localStorage.getItem("CustomBackground") || BackgroundImagesArray[3];
  BackgroundImagesArray.push(CustomBackgroundImageURL);
  let SelectedBackground = localStorage.getItem("SelectedCustomBackground") || 4;
  let BackgroundImageURL;
  if (SelectedBackground > 1) {
    BackgroundImageURL = BackgroundImagesArray[SelectedBackground];
  } else {
    BackgroundImageURL = BackgroundImagesArray[SelectedBackground - 1];
  }

/*====================================================================*/

  /* LOAD LOCAL QUICKMESSAGES */
  let QuickMessages = JSON.parse(localStorage.getItem("LocalQuickMessages")) || ["----------=========={( Closed! Thanks for playing! )}==========----------"];
  /* LOAD LOCAL QUICKMESSAGES */

  /* APPEND CUSTOM LARGE BG */
  $("body").prepend('<img src="' + BackgroundImageURL + '" id="large-custom-bg" ">');
  /* APPEND CUSTOM LARGE BG */

  /* REPLACE SYMBOLS WITH CODE */
  function resetQuickMsgHTML (message) {
    return message
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#95;/g, "_")
      .replace(/&acute;/g, "`");
  }

  function escapeQuickMsgHTML(message) {
    return message
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/_/g, "&#95;")
      .replace(/`/g, "&acute;");
  }
  /* REPLACE SYMBOLS WITH CODE */

  /* ? */
	async function waitForField(target, field) {
		return new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				if (target[field] !== undefined) {
					clearInterval(interval);
					resolve();
				}
			}, 100);
		});
	}
  /* ? */

  /* APPEND CSS TO DOCUMENT */
	function appendCSS(css) {
		let head = document.head || document.getElementsByTagName('head')[0];
		let style = document.createElement('style');

		head.appendChild(style);

		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
	}
  /* APPEND CSS TO DOCUMENT */

  /* SET STYLES FOR DESIRED CONTENT */
	async function changeStyles() {
		await waitForField(document, 'head');

    /* SET BACKGROUND (CSS)*/
		function setBackgroundImage() {
			let css = '' +
				'body{ background: black url("' + BackgroundImageURL + '") no-repeat fixed top !important;  }'
				;
			appendCSS(css);

      let largebgCss = '' +
          '#large-custom-bg { min-height: 100%; min-width: 1920px; width: 100%; height: auto; position: fixed; top: 0; left: 0; background-repeat: no-repeat; }' +
          '@media screen and (max-width: 3840px) { left: 50%; margin-left: 1920px; }'
      ;
      appendCSS(largebgCss);

      console.log(`%c[${moduleName} v${version}]` + '%c Background Customized.', "color: #f28424;", "color: white;");
		}
    /* SET BACKGROUND (CSS)*/

    /* SET CHAT FORM (CSS)*/
		function changeChatForm() {
			let css = '' +
				'#chat-composer input[type=text] { width: 82% !important; }' +
				'#chat-composer input[type=submit] { width: 10% !important; border-right: 1px solid #0e3434 !important; }' +
				'#quick-message-btn { width: 8% !important; height: 30px; line-height: 30px; border-radius: 0; border: 0; background: #1A5E5F; color: black; }' +
				'#quick-message-btn-ico { font-size: 20px; vertical-align: sub; }'
				;
			appendCSS(css);
		}
    /* SET CHAT FORM (CSS)*/

    /* SET QUICK MESSAGES (CSS)*/
    function setQuickMessages() {
      let css = '' +
          '#quick-messages { margin: 1.5%; margin-right: calc(1.5% + 6px); width: auto; height: auto; position: absolute; bottom: 30px; top: 26px; right: 0; left: 0; background: rgba(0, 0, 0, .8); outline: 1px solid #B7B7B7; display: none; grid-template-rows: 25px calc(100% - 50px) 25px; grid-template-columns: 100%; z-index: 1;}' +
          '#quick-messages-header { grid-row: 1 / 2; grid-column: 1 / 2; background: #B7B7B7; display: grid; grid-template-columns: 5% 90% 5%; grid-template-rows: 100%; align-items: center; text-align: center; color: black; border-bottom: 1px solid transparent; }' +
          '#quick-messages-header > span:first-child { grid-row: 1 / 2; grid-column: 2 / 3; }' +
          '#quick-messages-header > span:last-child { grid-row: 1 / 2; grid-column: 3 / 4; font-weight: bold; height: 100%; line-height: 1.75em; }' +
          '#quick-messages-header > span:last-child:hover { background: rgba(128, 128, 128, 0.5); cursor: pointer; }' +
          '#quick-messages-content { overflow-y: auto; }' +
          '#quick-messages-content > ul {margin: 0; padding: 0; }' +
          '#quick-messages-content > ul > li { min-height: 50px; margin: 5px 10px 5px 10px; display: grid; grid-template-rows: 100%; grid-template-columns: 91% 9%; align-items: center; justify-content: center; user-select: none; text-align: center; overflow: hidden; }' +
          '#quick-messages-content > ul > li > span { height: 100%; border: 1px solid #B7B7B7; display: grid; justify-content: center; align-items: center; padding: 5px; }' +
          '#quick-messages-content > ul > li > span:first-child { margin-right: 10px; }' +
          '#quick-messages-content > ul > li > span:hover { cursor: pointer; background: rgba(128, 128, 128, 0.5); }' +
          '#quick-messages-content > ul > li:first-child { grid-row: 1 / 2; grid-column: 1 / 2; }' +
          '#quick-messages-custom { background: #B7B7B7; border-top: 1px solid transparent;  display: grid; align-items: center; text-align: center; color: black; }' +
          '#quick-messages-custom:hover { cursor: pointer; background: gray; }' +
          '#quick-messages-custom-form, #custom-background-form { display: none; grid-template-rows: 100%; grid-template-columns: 90% 10%; background: rgba(0, 0, 0, 0.8); }' +
          '#quick-messages-custom-form > input, #custom-background-form > input { height: 30px; padding: 0 30px 0 10px; background: transparent; border: none; color: white; }' +
          '#quick-messages-custom-form > input:focus, #custom-background-form > input:focus { outline: none; }' +
          '#quick-messages-custom-form > button, #custom-background-form > button { height: 30px; border-radius: 0; }'
          ;
      appendCSS(css);
    }
    /* SET QUICK MESSAGES (CSS)*/

    /* SET SELECTION COLOR */
    function setSelectionColor() {
      let css = '' +
          '::selection { background: #f28424; color: black; text-shadow: none; }'
      ;
      appendCSS(css);
    }
    /* SET SELECTION COLOR */

    /* FIX PROFILE BUTTONS */
    function fixProfileContentButtons() {
      let css = '' +
          '#profile-content { padding-top: 0; }' +
          '#profile-content > ul { display: grid; grid-template-columns: calc(100% /3) calc(100% /3) calc(100% /3); grid-template-rows: 100%; }' +
          '#profile-content > ul > li > a { border-radius: 0;}' +
          '#profile-content > ul > li:nth-child(1) { grid-column: 1 / 2; grid-row: 1 /2; }' +
          '#profile-content > ul > li:nth-child(2) { grid-column: 2 / 3; grid-row: 1 /2; }' +
          '#profile-content > ul > li:nth-child(3) { grid-column: 3 / 4; grid-row: 1 /2; }' +
          '#profile-content > ul > li > a { padding: 0 !important; border: 0 !important; height: 25px; display: grid; justify-content: center; align-items: center; margin-right: 0; }'
      ;
      appendCSS(css);
    }
    /* FIX PROFILE BUTTONS */

    function customBackgroundMenu() {
      let css = '' +
          '#custom-background-form { display: grid; margin: 25px 10px 25px 10px; }' +
          '#custom-background-form > input { border: 1px solid #B7B7B7; }' +
          '#custom-background-form > button { margin-left: 10px; }' +
          '#custom-background-selector { user-select: none; height: 80%; width: auto; display: grid; grid-template-rows: 50% 50%; grid-template-columns: 50% 50%; }' +
          '#custom-background-selector > div { border: 1px solid #B7B7B7; display: grid; grid-template-rows: 10% 90%; grid-template-columns: 100%; }' +
          '#custom-background-selector > div:nth-child(1) { margin: 10px 5px 5px 10px; }' +
          '#custom-background-selector > div:nth-child(2) { margin: 10px 10px 5px 5px; }' +
          '#custom-background-selector > div:nth-child(3) { margin: 5px 5px 10px 10px; }' +
          '#custom-background-selector > div:nth-child(4) { margin: 5px 10px 10px 5px; }' +
          '#custom-background-selector > div:hover { border: 1px solid #f28424; cursor: pointer; }' +
          '#custom-background-selector > div > span { color: black; text-align: center; background: #B7B7B7; font-weight: bold; }' +
          '#custom-background-selector > div:hover > span { background: #f28424; }' +
          '#custom-background-selector > div > img { height: 100%; width: 100%; }'
      ;
      appendCSS(css);
    }

		setBackgroundImage();
		changeChatForm();
    setQuickMessages();
    setSelectionColor();
    fixProfileContentButtons();
    customBackgroundMenu();

    console.log(`%c[${moduleName} v${version}]` + '%c Styles Added/Tweaked.', "color: #f28424;", "color: white;");
	}
  /* SET STYLES FOR DESIRED CONTENT */



  /* SET CUSTOM BACKGROUND */
  $(document).ready(function() {
    /* APPEND CUSTOM BG BUTTON AND ADD ONCLICK EVENT FOR IT */
    $("#gameframe-menu > nav > ul").append('<li style="vertical-align: top; margin-left: 4px;"><a id="setCustomBackground" style="margin-right: 3px;"><span style="font-size: 13px; color: #f5f5f5; vertical-align: top;">Background</span></a></li>');
    $("#setCustomBackground").on('click', function() {
      $("#gameframe-content").empty();
      $("#gameframe-content").css('display', "block");
      $("#gameframe-battle").css('display', "none");

      $("#gameframe-content").append('<form id="custom-background-form"><input maxlength="255" type="text" spellcheck="false" placeholder="Paste your link here..."><button id="custom-background-button" type="button">SET</button></form>');
      $("#custom-background-form > input").attr('value', CustomBackgroundImageURL);
      $("#custom-background-form").on('keypress', function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });

      /* MAKE CUSTOM BG MENU */
      $("#gameframe-content").append('<div id="custom-background-selector"><div><span>Standard Pendoria</span><img src="https://pendoria.net/images/pendoria-1920-1080.jpg"></div><div><span>Elite UI</span><img src="https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/dev/background.jpg"></div><div><span>Pendoria++</span><img src="https://i.imgur.com/n5cRcfO.jpg"></div><div><span>Custom Background</span><img></div></div>');
      $("#custom-background-selector > div:nth-child(4) > img").attr('src', CustomBackgroundImageURL);

      $("#custom-background-selector > div:nth-child(" + SelectedBackground + ")").attr({
        "class" : "selected-custom-background",
        "style" : "border: 1px solid #f28424;"
      });
      $("#custom-background-selector > div:nth-child(" + SelectedBackground + ") > span").attr('style', 'background: #f28424;');

      $("#custom-background-selector > div").each(function(index) {
        $("#custom-background-selector > div:nth-child(" + (index + 1) + ")").on('click', function() {
          if ($(this).attr('class') != "selected-custom-background") {
            $(".selected-custom-background").attr('style', '');
            $(".selected-custom-background > span").attr('style', 'background: #B7B7B7;');
            $(".selected-custom-background").attr('class', '');

            $(this).attr('class', "selected-custom-background");
            $(".selected-custom-background").attr('style', 'border: 1px solid #f28424;');
            $(".selected-custom-background > span").attr('style', 'background: #f28424;');
          }

          if (index > 0) {
              $("#large-custom-bg").attr('src', BackgroundImagesArray[index + 1]);
              $("body").attr('style', 'background: url(' + BackgroundImagesArray[index + 1] + ') !important');
          } else if (index === 0) {
              $("#large-custom-bg").attr('src', BackgroundImagesArray[index + 1]);
              $("body").attr('style', 'background: url(' + BackgroundImagesArray[index] + ') !important');
          }

          localStorage.setItem("SelectedCustomBackground", (index + 1));
        });
      });
      /* MAKE CUSTOM BG MENU */

      /* SET & SAVE BACKGROUND WHEN SELECTING NEW CUSTOM BACKGROUND */
      $("#custom-background-button").on('click', function() {
        let input = $('*[placeholder="Paste your link here..."]').val();
        if (input != "") {
          localStorage.setItem("CustomBackground", input);
          $("body").attr('style', "background: url(" + input + ") !important no-repeat;");

          $(".selected-custom-background").attr('style', '');
          $(".selected-custom-background > span").attr('style', 'background: #B7B7B7;');
          $(".selected-custom-background").attr('class', '');

          $("#custom-background-selector > div:nth-child(4)").attr('class', "selected-custom-background");
          $(".selected-custom-background").attr('style', 'border: 1px solid #f28424;');
          $(".selected-custom-background > span").attr('style', 'background: #f28424;');

          $("#large-custom-bg").attr('src', input);
          $("#custom-background-selector > div:nth-child(4) > img").attr('src', input);
        }
      });
      /* SET & SAVE BACKGROUND WHEN SELECTING NEW CUSTOM BACKGROUND */
    });
    /* APPEND CUSTOM BG BUTTON AND ADD ONCLICK EVENT FOR IT */

    /* ADD EVENTLISTENER FOR SCREEN RESIZE */
      $(window).on('resize', function(){
        checkScreenSize();
      });
    /* ADD EVENTLISTENER FOR SCREEN RESIZE */
  });
  /* SET CUSTOM BACKGROUND */

  /* CHECK FOR UPDATES ROLLS AND APPLY DOUBLE CLICK */
  $("#chat-messages > ul").on('DOMSubtreeModified', function(){
      let length = $("#chat-messages > ul > li").length;

      if (length >= 0) {
        $.setTP(length);
      }
  });

  $.setTP = function(messageNr){
    let message = $("#chat-messages > ul > li:nth-child(" +  messageNr + ") > a > span");
    const hasclass = message.hasClass("activity-log-username");

    if (hasclass != false) {
      message.dblclick(function(event) {
		    $('*[placeholder="Write something awesome..."]').val("/addtp " + event.target.innerHTML + " ");
		    $('*[placeholder="Write something awesome..."]').focus();
		  });

      console.log(`%c[${moduleName} v${version}]` + '%c Quick TP Added.', "color: #f28424;", "color: white;");
    }
  }
  /* CHECK FOR UPDATES ROLLS AND APPLY DOUBLE CLICK */

  /* SET QUICK MESSAGES BUTTON + MENU */
  $(document).ready(function() {
    /* QUICK MESSAGES TOGGLE BUTTONS */
    function ToggleQuickMessageMenu() {
      const element = $("#quick-messages");

      if (element.css("display") != "none") {
        element.css("display", "none");
      } else {
        element.css("display", "grid");
      }

      $('*[placeholder="Write something awesome..."]').focus();
    }

    $("#quick-message-btn").on('click', function() {
      ToggleQuickMessageMenu();
    });

    $("#quick-messages-header > span:last-child").on('click', function() {
      ToggleQuickMessageMenu();
    });
    /* QUICK MESSAGES TOGGLE BUTTONS */

    /* APPEND STORED MESSAGES INSIDE QUICK MESSAGE MENU */
    $.each(QuickMessages, function(index, message) {
      $("#quick-messages-content > ul").append('<li><span>' + message + '</span><span>Remove</span></li>');

        return (message !== null);
      });
    /* APPEND STORED MESSAGES INSIDE QUICK MESSAGE MENU */

      /* ADD ONCLICK FUNCTION TO STORED MESSAGES */
      $("#quick-messages-content > ul > li").each(function(index) {
        const parent = $("#quick-messages-content > ul > li");

        $("#quick-messages-content > ul > li:nth-child(" + (index + 1) + ") > span:first-child").on('click', function(){
          $('*[placeholder="Write something awesome..."]').val(resetQuickMsgHTML(QuickMessages[index]));
		      $('*[placeholder="Write something awesome..."]').focus();
        });
        return (index <= parent.length);
      });
      /* ADD ONCLICK FUNCTION TO STORED MESSAGES */

      /* ADD ONCLICK TO REMOVE BUTTONS */
      $("#quick-messages-content > ul > li > span:last-child").on('click', function() {
        $(this).parent().attr('id', 'quick-msg-remove-this');
        let text = $("#quick-msg-remove-this > span:first-child").text();
        let remove = escapeQuickMsgHTML(text);
        console.log(remove);

        $.each(QuickMessages, function(index, message) {
          if (remove === message) {
            QuickMessages.splice(index, 1);
            localStorage.setItem("LocalQuickMessages", JSON.stringify(QuickMessages));
            $("#quick-msg-remove-this").remove();
          }

          return (remove !== message);
        });
      });
      /* ADD ONCLICK TO REMOVE BUTTONS */

      /* OPEN AND CLOSE BUTTON FOR CUSTOM MESSAGES */
      $("#quick-messages-custom").on('click', function() {
        let state = $("#quick-messages-custom-form").css('display');
        if (state === "none") {
          $("#quick-messages-custom-form").css('display', 'grid');
          $("#quick-messages").css('grid-template-rows', '25px calc(100% - 80px) 25px 30px');
          $("#quick-messages-custom").html('v Add Custom Message v');
        } else {
          $("#quick-messages-custom-form").css('display', 'none');
          $("#quick-messages").css('grid-template-rows', '25px calc(100% - 50px) 25px');
          $("#quick-messages-custom").html('^ Add Custom Message ^');
        }
      });
      /* OPEN AND CLOSE BUTTON FOR CUSTOM MESSAGES */

    /* PREVENT CUSTOM QUICK MESSAGE SUBMIT EVENT */
    $("#quick-messages-custom-form").on('keypress', function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
    /* PREVENT CUSTOM QUICK MESSAGE SUBMIT EVENT */

    /* SAVE CUSTOM MESSAGE */
    $("#quick-messages-button").on('click', function() {
      if ($('*[placeholder="Write your custom message here..."]').val() != "") {
      let newMessage = escapeQuickMsgHTML($('*[placeholder="Write your custom message here..."]').val());
      QuickMessages.push(newMessage);

      $("#quick-messages-content > ul").append('<li><span>' + QuickMessages[QuickMessages.length - 1] + '</span><span>Remove</span></li>');


      $("#quick-messages-content > ul > li:last-child > span:first-child").on('click', function(){
          $('*[placeholder="Write something awesome..."]').val(resetQuickMsgHTML(newMessage));
		      $('*[placeholder="Write something awesome..."]').focus();
      });

      $('*[placeholder="Write your custom message here..."]').val('');

      localStorage.setItem("LocalQuickMessages", JSON.stringify(QuickMessages));

      $("#quick-messages-content > ul > li:last-child > span:last-child").on('click', function() {
        $(this).parent().attr('id', 'quick-msg-remove-this');
        let text = $("#quick-msg-remove-this > span:first-child").text();
        let remove = escapeQuickMsgHTML(text);

        $.each(QuickMessages, function(index, message) {
          if (remove === message) {
            QuickMessages.splice(index, 1);
            localStorage.setItem("LocalQuickMessages", JSON.stringify(QuickMessages));
            $("#quick-msg-remove-this").remove();
          }

          return (remove !== message);
        });
      });
      }
    });
    /* SAVE CUSTOM MESSAGE */

    console.log(`%c[${moduleName} v${version}]` + '%c Quick Messages Added.', "color: #f28424;", "color: white;");
  });
  /* SET QUICK MESSAGES BUTTON + MENU */

  /* APPEND QUICK MESSAGES BUTTON + QUICK MESSAGES MENU */
  $('form#chat-form > input:last').after('<button id="quick-message-btn" type="button"><i id="quick-message-btn-ico" class="fa fa-book"></i></button>');
  $('#chat-content').append('<div id="quick-messages"><div id="quick-messages-header"><span>Quick Messages</span><span>X</span></div><div id="quick-messages-content"><ul></ul></div><div id="quick-messages-custom">^ Add Custom Message ^</div><form id="quick-messages-custom-form"><input maxlength="255" type="text" spellcheck="true" placeholder="Write your custom message here..."><button id="quick-messages-button" type="button">ADD</button></form></div>');
  /* APPEND QUICK MESSAGES BUTTON + QUICK MESSAGES MENU */

	(function run() {
		changeStyles();
	})();

  (function run() {
    checkScreenSize();
  })();

});