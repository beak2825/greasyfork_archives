// ==UserScript==
// @name         DevFactory TestWriter IQB Validator
// @namespace    http://www.devfactory.com/
// @version      20190618.7
// @description  Automated validation for Test Writers
// @author       Vladimir Chernyshkov
// @include      https://testrail.devfactory.com/*/cases/add/*
// @include      https://testrail.devfactory.com/*/cases/edit/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/marked@0.6.2/marked.min.js
// @require      https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@8
// @resource     fancyBoxCSS https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/384590/DevFactory%20TestWriter%20IQB%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/384590/DevFactory%20TestWriter%20IQB%20Validator.meta.js
// ==/UserScript==

var fancyBoxCSS = GM_getResourceText ("fancyBoxCSS");
GM_addStyle(fancyBoxCSS);
GM_addStyle('.fancybox-caption__body { background-color: yellow; color: black; font-weight: bold; padding: 10px; white-space: pre-wrap;} '+
            '#dfTestWriterUpdateRefs {color: red; font-weight:bold} '+
            '#dfTestWriterSidebarSectionAll, #dfTestWriterSidebarSection {padding: 5px; background-color: rgb(217, 240, 255); border-width: 1px; border-style: solid; border-radius: 5px; border-color: rgb(41, 128, 185);} '+
            '#dfTestWriterSidebarSection {background-color: #E6F5DF} '+
            '#dfTestWriterSidebarSectionAll ul, #dfTestWriterSidebarSection ul, .dfTestWriterTemplateHelper ul {margin-top: 5px; list-style-type: disc; padding-left: 20px;} ' +
            '#dfTestWriterSidebarSectionAll li, #dfTestWriterSidebarSection li, .dfTestWriterTemplateHelper li {margin-bottom: 5px;} ' +
            '#dfTestWriterSidebarSectionAll b, #dfTestWriterSidebarSection b, .dfTestWriterTemplateHelper b {font-weight: bold } ' +
            '.dfTestWriterPreviewPreCondition {width: 45%; display: inline-block; float: left; margin:2px; padding: 3px; background-color: rgb(217, 240, 255);border-width: 1px;border-style: solid;border-radius: 5px;border-color: rgb(41, 128, 185);} ' +
            '.dfTestWriterScreenshotBlock:after { content: ""; display: table; clear: left; padding-bottom: 25px; } .dfTestWriterTemplateHelper table { width: 100% } .dfTestWriterTemplateHelper td { padding: 3px; } ' +
            '.dfTestWriterPreviewPreCondition img {max-width: 225px; } .dfTestWriterScreenshotBlock .markdown-img-container { padding-right 10px} .dfTestWriterScreenshotBlock img {max-width: 80px !important; } ' +
            '.swal2-title { border: 0; } .swal2-content ul { list-style: disc;  padding-left: 15px;} .swal2-content ol { list-style: decimal;  padding-left: 15px;} ' +
            '.dfTestWriterScreenshotDefault { width: 1px;    height: 1px;    overflow: hidden;    display: inline-block; } ' +
            '#dfTestWriterSectionJira table td, #dfTestWriterSectionJira table th {border: 1px solid black} ' +
            '#dfTestWriterSectionJira ul {list-style: disc;  padding-left: 15px;} #dfTestWriterSectionJira ol {list-style: decimal;  padding-left: 15px;} ' +
            '.dfTestWriterTemplateHelper { display: block;  font-weight: normal; font-style: italic;  background-color: rgb(255, 250, 231); border-width: 1px; border-style: solid; border-radius: 5px;border-color: rgb(255, 221, 167);} ' +
            ''
           );


(function() {
    'use strict';

    var listOfKnownImages = [7438358];
    var populateListOfKnownImages = true;
    var sectionId = null;
    var sectionName = null;

    marked.setOptions({
        breaks: true,
        smartyPants: true
    });

    function to_markdown(str) {
        return str
        // Ordered Lists
        .replace(/(^|\n|\r)[ \t]*(\*+)\s+/gm, function(match, newline, stars) {
            return newline+Array(stars.length).join("  ") + '* ';
        })
        // Un-ordered lists
        .replace(/(^|\n|\r)[ \t]*(#+)\s+/gm, function(match, newline, nums) {
            return newline+Array(nums.length).join("  ") + '1. ';
        })
        // Headers 1-6
        .replace(/(^|\n|\r)h([0-6])\.(.*)$/gm, function (match, newline, level, content) {
            return newline+Array(parseInt(level) + 1).join('#') + content;
        })
        // Bold
        .replace(/\*(\S.*)\*/g, '**$1**')
        // Italic
        .replace(/\_(\S.*)\_/g, '*$1*')
        // Monospaced text
        .replace(/\{\{([^}]+)\}\}/g, '`$1`')
        // Citations (buggy)
        //.replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g, '<cite>$1</cite>')
        // Inserts
        .replace(/\+([^+]*)\+/g, '<ins>$1</ins>')
        // Superscript
        .replace(/\^([^^]*)\^/g, '<sup>$1</sup>')
        // Subscript
        .replace(/~([^~]*)~/g, '<sub>$1</sub>')
        // Strikethrough
        .replace(/(\s+)-(\S+.*?\S)-(\s+)/g, '$1~~$2~~$3')
        // Code Block
        .replace(/\{code(:([a-z]+))?([:|]?(title|borderStyle|borderColor|borderWidth|bgColor|titleBGColor)=.+?)*\}([^]*)\{code\}/gm, '```$2$5```')
        // Pre-formatted text
        .replace(/{noformat}/g, '```')
        // Un-named Links
        .replace(/\[([^|]+)\]/g, '<$1>')
        // Images
        .replace(/!(.+)!/g, '![]($1)')
        // Named Links
        .replace(/\[(.+?)\|(.+)\]/g, '[$1]($2)')
        // Single Paragraph Blockquote
        .replace(/^bq\.\s+/gm, '> ')
        // Remove color: unsupported in md
        .replace(/\{color:[^}]+\}([^]*)\{color\}/gm, '$1')
        // panel into table
        .replace(/\{panel:title=([^}]*)\}\n?([^]*?)\n?\{panel\}/gm, '\n| $1 |\n| --- |\n| $2 |')
        // table header
        .replace(/^[ \t]*((?:\|\|.*?)+\|\|)[ \t]*$/gm, function (match, headers) {
            var singleBarred = headers.replace(/\|\|/g,'|');
            return '\n' + singleBarred + '\n' + singleBarred.replace(/\|[^|]+/g, '| --- ');
        })
        // remove leading-space of table headers and rows
        .replace(/^[ \t]*\|/gm, '|');
    };

    function $(str, el) {
      return (el || document).querySelector(str);
    }

    function $$(str, el) {
      return [...(el || document).querySelectorAll(str)];
    }

    function addLabelHelper(labelHelper, text, helper) {
        if (!labelHelper) {
            return labelHelper;
        }

        var titleHelperIcon=document.createElement("a");
        titleHelperIcon.className = "dfTestWriterTemplateHelperIcon";
        titleHelperIcon.title = 'Collapse/Expand helpers';
        titleHelperIcon.innerHTML = '[?]';//<img style="margin-right: 0" src="images/icons/markdownHelp.png" width="16" height="16" alt="">';
        titleHelperIcon.addEventListener('click', function() { showHideHelpers(); }, false);
        labelHelper.appendChild(titleHelperIcon);

        var titleHelperText=document.createElement("span");
        titleHelperText.className = "dfTestWriterTemplateHelper";
        if ((helper != undefined) && (helper != "")) {
          titleHelperText.title = "This is a template for common situations\n\n" + helper;
        }
        titleHelperText.innerHTML = text;
        labelHelper.appendChild(titleHelperText);

        return labelHelper;
    }

    function hideUselessField(el) {
        el.style.display = 'none';
    }

    function addHelpers() {
        hideUselessField(getTextAreaParentBlock($('#custom_steps')));
        hideUselessField(getTextAreaParentBlock($('#custom_tc_test_id')));
        hideUselessField(getTextAreaParentBlock($('#custom_jirastatus')));
        hideUselessField(getTextAreaParentBlock($('#custom_test_data')));
        hideUselessField(getTextAreaParentBlock($('#custom_batch')));
        hideUselessField(getTextAreaParentBlock($('#custom_batch_order')));
        hideUselessField(getTextAreaParentBlock($('#custom_auto_test_new_field')));
        hideUselessField($('#custom_wink_url').parentNode);

        /*
        var titleEl = $('#title');
        var titleTextarea = $('#custom_tc_desc').cloneNode( true);
        //var titleTextarea = $('#custom_steps').cloneNode( true);
        //var titleTextarea=document.createElement("textarea");
        titleTextarea.className = 'custom form-control form-control-full  processed textarea-with-grippie';
        titleTextarea.name = titleEl.name;
        //titleTextarea.rows = 1;
        titleTextarea.innerText = titleEl.value;
        titleTextarea.setAttribute('data-gramm_editor', 'true');
        titleEl.parentNode.appendChild(titleTextarea);
        */

        addLabelHelper(
            $('label[for="title"]'),
            "<ul><li>TC0x - Somebody can/able to DO something (do <u>NOT</u> use \"user is DOING something\" or \"user DID something\")</li>" +
              "<li>TC0x - User successfully ... using ... on ...</li>" +
              "<li>TC0x - Admin cannot  ... with ... in ...</li></ul>",
            "* \"SOMEBODY can [is able] DO ... IN ... USING ...\"\n* \"SOMEBODY unable[not able] TO DO ... IN .. USING ...\"\n\nBAD example: \"Verify that user is changing email\"\nGOOD example: \"TC02 - User succesfully changing email on \"My Profile\" page\""
        );
        addLabelHelper(
            $('label[for="custom_tc_dep"]'),
            "<table><tr><td width=\"49%\" style=\"border-right: 1px solid #F39C12;\" title=\"Example for environments\">Note:<br />If you can not access an environment, check the SE7 ticket information [LINK_HERE] or contact the product team." +
              "</td><td title=\"Example for SSH commands\">Note: CURL command line tool should be installed in the user system. If it is not installed then download it from https://curl.haxx.se/download.html<br \>" +
                "To connect via SSH:<br \>* On Windows: Use [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html), [Cygwin](https://www.cygwin.com/) or [Git Bash](https://gitforwindows.org) application for SSH operations<br \>" +
                "* On Mac/Linux: open \"Terminal\" application for SSH operations</span>" +
              "</td></tr></table>",
            ""
        );
        addLabelHelper(
            $('label[for="custom_preconds"]'),
            "Precondition Test Case:<br />1. [C25555555] TEST_CASE_NAME<br /><br />Reference Test Case:<br />1. Step #5: [C25556666] TEST_CASE_NAME",
            "Pre-conditions should ALWAYS be executed before current test case\n\nReferences are \na) either optional\nb) either required, but you asking to execute them during some step in the middle of the test case"
        );
        addLabelHelper(
            $('label[for="custom_test_steps"]'),
            "<table><tr><td width=\"49%\" style=\"border-right: 1px solid #F39C12;\" title='You should provide a clear description of the action.\nImagine that you are asking your 8-10 years old child to execute this test\n\nBAD example: \"Submit the form\"\nGOOD example: \"Click on the \"Submit\" button to send the form\"'><u>Templates for actions</u>:<br />" +
              "<ul><li>Click on the \"...\" button at the ... corner of the screen</li>" +
              "<li>Enter ... (provided[the same] as in the [precondition]) to the \"..\" field <span title=\"E.g. stands for exempli gratia in Latin, which means for example.\">(E.g.,  ....)</span></li>" +
              "<li>Select the file \"....\" downloaded in the precondition</li>" +
              "<li>.. (see the reference #2)</li>" +
              "<li>.. created in the referenced test case #1</li></ul>" +
              "</td><td title='You should focus on describing behavior during executing steps, not on reaching the goal\nTry to think that you are still not sure and the system is lying to you\n\nBAD example: \"User changed email\"\nGOOD example: \"A confirmation message \"Your email changed successfully\" displayed\"'><u>Templates for expected results</u>:<br />" +
              "<ul><li>Page \"..\" displayed...</li>" +
              "<li>Verify that the message \"...\" displayed and the value of the \"...\" field changed to \"...\"</li></ul>" +
              "</td></tr></table>",
            ""
        );
        addLabelHelper(
            $('label[for="custom_expected"]'),
            "<ul><li>User [was able to] ... succesfully ... using ... on ...</li>" +
              "<li>Admin was not able to ... with ... in ...</li></ul>",
            "That action already happen. Use the past tense: was, were, did, etc.\n\n\was [not] able, \ndid ... successfully\n\nBAD example: \"User changed email\"\nGOOD example: \"User successfully changed email on the \"My Profile\" page\""
        );
        addLabelHelper(
            $('label[for="custom_tc_desc"]'),
            "<ul><li>This test case verifies that the user is able to successfully ... using ... on ....</li>" +
              "<li>This is a rainy day scenario verifies that the user cannot ... with ... in ...</li></ul>",
            "BAD example: \"Verify that user is changing email\"\nGOOD example: \"This test case verifies that the user is able to change the email successfully on the \"My Profile\" page\""
        );

        var linkToUpdateRefs = document.createElement("a");
        linkToUpdateRefs.setAttribute('id', 'dfTestWriterUpdateRefs');
        linkToUpdateRefs.style.display = 'none';
        linkToUpdateRefs.addEventListener('click', function() { updateRefs(); }, false);
        linkToUpdateRefs.innerText = 'FIX REFERENCE';
        $('label[for="refs"]').parentNode.appendChild(linkToUpdateRefs);

        $('textarea#custom_preconds').addEventListener('change', function() { loadPreconditions(); }, false);
        loadPreconditions();

        var sideBarSectionCurrent = document.createElement("div");
        sideBarSectionCurrent.setAttribute('id', 'dfTestWriterSidebarSectionCurrent');
        $('#sidebar').appendChild(sideBarSectionCurrent);

        var sideBarSectionAll = document.createElement("div");
        sideBarSectionAll.setAttribute('id', 'dfTestWriterSidebarSectionAll');
        $('#sidebar').appendChild(sideBarSectionAll);
        loadAllPreConditions();

        $('select#section_id').addEventListener('change', function() { loadSection(); }, false);
        loadSection();

        $('input#refs').addEventListener('change', function() { loadSectionJira(); }, false);
        loadSectionJira()

        if (GM_getValue('testRail_SHOW_HELPERS') == 'hide') {
            doShowHideHelpers('none');
        }

        (window.opera ? document.body : document).addEventListener('keydown', function(event) {
            if (!((event.ctrlKey || event.metaKey) && String.fromCharCode(event.which).toLowerCase() == 's')) {
              return true;
            }
            event.preventDefault();
            event.cancelBubble = true;
            event.stopImmediatePropagation();
            doIQBViolation(event);
            return false;
        }, !window.opera);
        $('#accept').addEventListener('click', doIQBViolation, false);

        var validateButton = document.createElement("a");
        validateButton.className = 'button button-left button-report';
        validateButton.innerText = 'Validate';
        validateButton.addEventListener('click', checkIQBViolation, false);
        $('#accept').parentNode.appendChild(validateButton);

        jQuery().fancybox({
          selector : '.markdown-img-container a:visible'
        });
    }

    function doIQBViolation(event) {
        var iqbForced = $('#accept').getAttribute('iqb-forced');
        if (iqbForced == '1') {
            return true;
        }
        event.preventDefault();
        $('#accept').disabled = true;
        setTimeout(function() { $('#accept').disabled = false; }, 2000);

        $('#accept').setAttribute('iqb-forced', 0);

        var errorMessages = validateOverIQB();

        if (errorMessages.length) {
            Swal.fire({
                title: 'IQB Violation Detected!',
                html: '<ul><li>' + errorMessages.join("</li><li>")+'</li></ul><br><br />Do you really want to save the test case?',
                type: 'error',
                confirmButtonText: 'Edit now',
                cancelButtonText: 'Save as is (fix later)',
                showCancelButton: true,
                allowOutsideClick: false,
                focusConfirm: true,
                onClose: () => {
                    $('#accept').disabled = false;
                }
            }).then((result) => {
                $('#accept').disabled = false;
                if (!result.value) {
                    $('#accept').setAttribute('iqb-forced', 1);
                    $('#accept').click();
                }
            }).catch(error => {
                $('#accept').disabled = false;
            });
        } else {
            $('#accept').disabled = false;
            $('#accept').setAttribute('iqb-forced', 1);
            $('#accept').click();
        }

        return false;
    }

    function checkIQBViolation(event) {
        event.preventDefault();
        var errorMessages = validateOverIQB();

        if (errorMessages.length) {
            Swal.fire({
                title: 'IQB Violation Detected!',
                html: '<ul><li>' + errorMessages.join("</li><li>")+'</li></ul>',
                type: 'error',
                confirmButtonText: 'Continue'
            });
        } else {
            Swal.fire({
                title: 'No errors found',
                html: "But keep in mind that we unable to check everything - do self-review!",
                type: 'info',
                confirmButtonText: 'Continue'
            });
        }
    }

    function validateOverIQB() {
        var errorMessages = [];
        var errorCount = validateIqbMissingScreenshots();

        if (errorCount > 0) {
            errorMessages.push('You missed required screenshots for ' + errorCount + ' field(s)!');
        }

        var titleRegexTC = /^TC(\d)(\d) /
        var titleRegexPreCond = /^(\s*[^a-z]|)pre(.|)condition/i
        var seqNumber = titleRegexTC.exec($('input#title').value);
        var rawSectionName = null;
        $$('#section_id option').forEach(el => {
          if (el.value == sectionId) {
              rawSectionName = el.innerText.trim();
          }
        });
        var isTestCasePreCond = titleRegexPreCond.exec($('input#title').value) || titleRegexPreCond.exec(rawSectionName) || titleRegexPreCond.exec(getSuiteName());

        if (!seqNumber && !isTestCasePreCond) {
            errorMessages.push('Your title for the test cases not starting with TC0x or [Precondition]!');
        }

        // check pre-conditions
        if (seqNumber) {
            var prevNum = parseInt(seqNumber[1])*10 + parseInt(seqNumber[2]) - 1;
            if (prevNum > 0) {
                var prevFound = false;
                var titleTCPrev;

                if (prevNum < 10) {
                    titleTCPrev = 'TC0'+prevNum;
                } else {
                    titleTCPrev = 'TC'+prevNum;
                }

                $$('.dfTestWriterScreenshotBlock').forEach(el => {
                    if (el.innerText.search(']: '+titleTCPrev) != -1) {
                        prevFound = true;
                    }
                });

                if (!prevFound) {
                    errorMessages.push('Your test case title does not refer to the previous pre-condition in the sequence ('+titleTCPrev+')!');
                }
            }
        }

        if (!isTestCasePreCond && ($$('.step-container').length < 5)) {
            errorMessages.push('Your test case contains less than 5 steps!');
        }

        if (sectionName && ($('input#refs').value.search(sectionName) == -1)) {
            errorMessages.push('Your reference field is not matching to section name (' + sectionName +')!');
        } else if (!sectionName && ($('input#refs').value.trim() == '')) {
            errorMessages.push('Your reference field is empty!');
        }

        return errorMessages;
    }

    function isScreenshotMissing(el) {
        return !el.value.match(/index\.php\?\/attachments\/get/g);
    }

    function getTextAreaParentBlock(el) {
       var parentBlock = el.parentNode;
       if(parentBlock.className == 'textarea-resizable') {
          return parentBlock.parentNode;
       }
       return parentBlock;
    }

    function showHideHelpers() {
        var showHelpers = GM_getValue('testRail_SHOW_HELPERS');

        if (!showHelpers || showHelpers == 'show') {
            GM_setValue('testRail_SHOW_HELPERS', 'hide');
            doShowHideHelpers('none');
        } else {
            GM_setValue('testRail_SHOW_HELPERS', 'show');
            doShowHideHelpers('block');
        }
    }

    function doShowHideHelpers(display) {
         $$('.dfTestWriterTemplateHelper').forEach(el => {
             el.style.display = display;
         });
    }

    function addScreenshotBlock(el) {
       var parentNode = getTextAreaParentBlock(el);
       var screenBlock = parentNode.getElementsByClassName('dfTestWriterScreenshotBlock')

       if (screenBlock.length) {
         return screenBlock[0];
       }

       screenBlock = document.createElement("div");
       screenBlock.className = 'dfTestWriterScreenshotBlock';
       parentNode.appendChild(screenBlock);

       return screenBlock;
    }
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
        .trim();
    }

    function updateScreenshots(el) {
      if (el.value == '') {
        deleteScreenshotBlock(el);
        return;
      }
      var screenBlock = addScreenshotBlock(el);
      var imgBlocks = screenBlock.getElementsByClassName('markdown-img-container');
      var currentImg = [];
      for (var j = 0; j < imgBlocks.length; j++) {
        currentImg.push(imgBlocks[j].getAttribute('imageId'));
      }

      var re = /index\.php\?\/attachments\/get\/(\d+)\)/g;
      var m;
      var newImg = [];
      while (m = re.exec(el.value)) {
          newImg.push(m[1]);
      }

      var needCleanup = true;
      if ((newImg.length > 0) && (currentImg.length == newImg.length)) {
          needCleanup = false;
          for (var i = 0; i < newImg.length; i++) {
              if (currentImg[i] != newImg[i]) {
                  needCleanup = true;
              }
          }
      }

      if (needCleanup && imgBlocks.length) {
          while (imgBlocks.length) {
              imgBlocks[0].style.display = "none";
              screenBlock.removeChild(imgBlocks[0]);
          }
      }

      var caption = el.value.replace(/\!\[\]\(index\.php\?\/attachments\/get\/(\d+)\)/g, "");
      if (el.name == 'custom_expected') {
         caption = '[EXPECTED RESULT]: ' + caption;
      } else {
         var stepNum = getTextAreaParentBlock(el).parentNode.parentNode.parentNode.getElementsByClassName('step-no-inner');
         if (stepNum.length) {
           var stepClassName = getTextAreaParentBlock(el).className;
           if (stepClassName.search('-content') != -1) {
               caption = '[STEP '+stepNum[0].innerText+' ACTION]: ' + caption;
           } else if (stepClassName.search('-expected') != -1) {
               caption = '[STEP '+stepNum[0].innerText+' RESULT]: ' + caption;
           } else {
               caption = '[STEP '+stepNum[0].innerText+']: ' + caption;
           }
         }
      }

      // add a stab
      if (!newImg.length) {
          var imgSpan2 = document.createElement("span");
          imgSpan2.className = 'markdown-img-container ';
          imgSpan2.setAttribute('imageId', '7438358');
          var imgLink2 = document.createElement("a");
          imgLink2.className = 'fancy dfTestWriterScreenshotDefault';
          imgLink2.setAttribute('href', "index.php?/attachments/get/7438358");
          imgLink2.setAttribute('data-caption', escapeHtml(caption));
          imgLink2.innerHTML = '<img class="markdown-img" src="index.php?/attachments/get/7438358" alt="">';
          imgSpan2.appendChild(imgLink2);
          imgSpan2.appendChild(document.createElement("br"));
          screenBlock.appendChild(imgSpan2);
      } else if (needCleanup){
          var uploadedNewImage = false;

          while (m = re.exec(el.value)) {
              var imgSpan = document.createElement("span");
              imgSpan.className = 'markdown-img-container';

              if (listOfKnownImages.indexOf(m[1]) == -1) {
                  listOfKnownImages.push(m[1]);
                  // unknown image - wait N seconds while testrail will process it
                  if (!populateListOfKnownImages) {
                      uploadedNewImage = true;
                      imgSpan.style.display = 'none';
                      imgSpan.className += ' markdown-img-container-processing';
                  }
              }
              imgSpan.setAttribute('imageId', m[1]);
              var imgLink = document.createElement("a");
              imgLink.className = 'fancy';
              imgLink.setAttribute('href', "index.php?/attachments/get/"+m[1]);
              imgLink.setAttribute('data-caption', escapeHtml(caption));
              imgLink.innerHTML = '<img class="markdown-img" src="index.php?/attachments/get/'+m[1]+'" alt="">';
              imgSpan.appendChild(imgLink);
              imgSpan.appendChild(document.createElement("br"));
              screenBlock.appendChild(imgSpan);
          }

          // unknown image - wait N seconds while testrail will process it
          if (uploadedNewImage) {
              setTimeout(function() {
                  $$('.markdown-img-container-processing').forEach(el => {
                      el.style.display = 'inline';
                  });
              }, 2000);
          }
      }
    }

    function deleteScreenshotBlock(el) {
       var parentNode = getTextAreaParentBlock(el);
       var screenBlock = parentNode.getElementsByClassName('dfTestWriterScreenshotBlock');

       if (screenBlock.length) {
         parentNode.removeChild(screenBlock[0]);
       }
    }

    function highlighScreenshots(el, isRequired) {
        if (isScreenshotMissing(el)) {
            if (isRequired) {
              el.style.borderWidth = '4px';
              el.style.borderColor = 'red';
            } else {
              el.style.borderWidth = '4px';
              el.style.borderColor = 'gold';
            }
            //deleteScreenshotBlock(el);
             updateScreenshots(el);
        } else {
            el.style.borderWidth = '1px';
            el.style.borderColor = '#d7d7d7';
            updateScreenshots(el);
        }
    }

    function validateIqbMissingScreenshots() {
        var errorCount = 0;

        $$('textarea#custom_expected, .step-text-expected textarea').forEach(el => {
          if (isScreenshotMissing(el)) {
            errorCount++;
          }
        });

        return errorCount;
    }

    function addOnChangeTestRail() {
        var errorCount = 0;

        $$('.step-text-content textarea').forEach(el => {
          if (!el.getAttribute('dfTestWriterOnChange')) {
              el.setAttribute("dfTestWriterOnChange", 1);
              el.addEventListener('blur', function() {highlighScreenshots(el, false); }, false);
              highlighScreenshots(el, false);
          }
        });
        $$('textarea#custom_expected, .step-text-expected textarea').forEach(el => {
          if (!el.getAttribute('dfTestWriterOnChange')) {
              el.setAttribute("dfTestWriterOnChange", 1);
              el.addEventListener('blur', function() {highlighScreenshots(el, true); }, false);
              highlighScreenshots(el, true);
          }
        });

        return errorCount;
    }

    function updateRefs() {
        $('input#refs').value = sectionName;
        //$('input#custom_master_cid').value = 'https://jira.devfactory.com/browse/'+sectionName;
        $('#dfTestWriterUpdateRefs').style.display = 'none';
        loadSectionJira();
    }

    function loadSectionJira() {
        var jiraId = getJiraID($('input#refs').value);

        if (!jiraId) {
            return;
        }
        GM_xmlhttpRequest ({
            method: 'POST',
            url:    'https://testrail.devfactory.com/index.php?/references/ajax_lookup',
            data: 'project_id=' + unsafeWindow.uiscripts.context.project.id + '&reference_id='+encodeURIComponent(jiraId)+'&_token=' + encodeURIComponent(unsafeWindow.Consts.ajaxCsrf) + '&_version=' + unsafeWindow.Consts.ajaxVersion,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "text/plain, */*; q=0.01",
            },
            onload: function (responseDetails2) {
                if ($$('#dfTestWriterSectionJira').length) {
                    $('#dfTestWriterSectionJira').parentNode.removeChild($('#dfTestWriterSectionJira'));
                }
                try
                {
                    JSON.parse(responseDetails2.responseText);
                } catch (err) {
                    var sideBarSection = document.createElement("div");
                    sideBarSection.setAttribute('id', 'dfTestWriterSectionJira');
                    sideBarSection.innerHTML = responseDetails2.responseText;
                    $('#sidebar').appendChild(sideBarSection);
                    var jiraMonospace = sideBarSection.querySelectorAll('.monospace')[0];
                    jiraMonospace.innerHTML = marked(to_markdown(jiraMonospace.innerText));
                }
            }
        });
    }

    function getJiraID(val) {
        var re = /^[\s\[]*([A-Z0-9]+\-\d+)([^\d]+.*|\s*$)/

        if (re.exec(val)) {
           return val.replace(/^[\s\[]*([A-Z0-9]+\-\d+)([^\d]+.*|\s*$)/, "$1");
        }

        return '';
    }

    function getSuiteId() {
        var suiteId = null;
        var re = /.+\/suites\/view\/(\d+)$/
        $$('.content-breadcrumb a').forEach(el => {
          var m;
          if (m = re.exec(el.href)) {
              suiteId = m[1];
          }
        });

        return suiteId;
    }
    function getSuiteName() {
        var suiteName = null;
        var re = /.+\/suites\/view\/(\d+)$/
        $$('.content-breadcrumb a').forEach(el => {
          var m;
          if (m = re.exec(el.href)) {
              suiteName = el.innerText.trim();
          }
        });

        return suiteName;
    }

    function loadSection() {
        var newSectionId = $('select#section_id').value;
        if (newSectionId == sectionId) {
          return;
        }
        sectionId = newSectionId;
        sectionName = null;
        $$('#section_id option').forEach(el => {
          if (el.value == sectionId) {
              sectionName = getJiraID(el.innerText);

              if (sectionName && ($('input#refs').value.search(sectionName) == -1)) {
                  $('#dfTestWriterUpdateRefs').style.display = 'inline';
                  $('#dfTestWriterUpdateRefs').innerText = 'FIX TO: ' + sectionName;
              } else {
                  $('#dfTestWriterUpdateRefs').style.display = 'none';
              }
          }
        });

        if ($$('#dfTestWriterSidebarSection').length) {
            $('#dfTestWriterSidebarSection').parentNode.removeChild($('#dfTestWriterSidebarSection'));
        }

        var sideBarSection = document.createElement("div");
        sideBarSection.setAttribute('id', 'dfTestWriterSidebarSection');
        $('#dfTestWriterSidebarSectionCurrent').appendChild(sideBarSection);

        getTestCaseInSection(sectionId, getSuiteId(), function(responseDetails) {
            var testCases = JSON.parse(responseDetails.responseText);
            if (testCases.length) {
                var innerTestCases = '<a href="/index.php?/suites/view/'+getSuiteId()+'&group_by=cases:section_id&group_id='+sectionId+'" style="font-weight: bold" target="_blank">Test Cases in Sub-Section:</a><br /><br /><ul>';
                var i;
                var currentTestCaseId = -1;
                if ($$('.content-header-id').length) {
                    currentTestCaseId = $$('.content-header-id')[0].innerText.replace(/\D+/g, '');
                }

                for (i =0; i <testCases.length; i++) {
                    if (currentTestCaseId == testCases[i].id) {
                        innerTestCases += '<li><b>[C'+testCases[i].id+']</b> '+testCases[i].title + '</li>';
                    } else {
                        innerTestCases += '<li><a href="/index.php?/cases/edit/'+testCases[i].id+'/1" style="font-weight: bold" target="_blank">[C'+testCases[i].id+']</a> '+testCases[i].title + '</li>';
                    }
                }

                innerTestCases += '</ul>';
                $('#dfTestWriterSidebarSection').innerHTML = innerTestCases;
            }
        });
    }

    function loadAllPreConditions() {
        GM_xmlhttpRequest ({
            method: 'GET',
            username: getUsername(),
            password: getAPIToken(),
            url:    'https://testrail.devfactory.com/index.php?/api/v2/get_suites/' + unsafeWindow.uiscripts.context.project.id,
            headers: {
                "Content-Type": "application/json",
            },
            onload: function(suiteListHtml) {
                var suiteList = JSON.parse(suiteListHtml.responseText);
                var re = /pre.*conditions/i;
                var k;
                var suiteFound = false;
                for (k =0; k < suiteList.length; k++) {
                    if (re.exec(suiteList[k].name)) {
                        suiteFound = true;
                        getTestCaseInSection(null, suiteList[k].id, function(responseDetails) {
                            var testCases = JSON.parse(responseDetails.responseText);
                            if (testCases.length) {
                                var innerTestCases = '<b>Available pre-conditions:</b><br /><br /><ul>';
                                var i;
                                var currentTestCaseId = $$('.content-header-id')[0].innerText.replace(/\D+/g, '');

                                for (i =0; i <testCases.length; i++) {
                                    // skip deleted
                                    if (testCases[i].custom_tc_status != 8) {
                                        var workInProgress = '';
                                        if ((testCases[i].custom_tc_status == 1) || (testCases[i].custom_tc_status == 10) || (testCases[i].custom_tc_status == 11) || (testCases[i].custom_tc_status == 12)) {
                                            workInProgress = ' style="font-style: italic;"';
                                        }
                                        if (currentTestCaseId == testCases[i].id) {
                                            innerTestCases += '<li'+workInProgress+'><b>[C'+testCases[i].id+']</b> '+testCases[i].title + '</li>';
                                        } else {
                                            innerTestCases += '<li'+workInProgress+'><a href="/index.php?/cases/edit/'+testCases[i].id+'/1" target="_blank"><b>[C'+testCases[i].id+']</b></a> '+testCases[i].title + '</li>';
                                        }
                                    }
                                }

                                innerTestCases += '</ul>';
                                $('#dfTestWriterSidebarSectionAll').innerHTML = innerTestCases;
                            }
                        });
                    }
                }

                if (!suiteFound) {
                    $('#dfTestWriterSidebarSectionAll').style.display = 'none';
                }
            }
        });

    }

    function loadPreconditions() {
        var el = $('textarea#custom_preconds');
        deleteScreenshotBlock(el);

        var re = /(\[C(\d+)\]|\/cases\/view\/(\d+)[\)\]\s$])/g;
        var m;
        var cnt = 0;
        while (m = re.exec(el.value)) {
            cnt++;

            var linkId = m[2];
            if (!linkId) {
                linkId = m[3];
            }

            if (cnt == 1) {
                addScreenshotBlock(el);
            }

            getTestCase(linkId, function(responseDetails) {
                var testCase = JSON.parse(responseDetails.responseText);
                var screenBlock = addScreenshotBlock(el);
                var caseDesc = document.createElement("div");

                caseDesc.className = "dfTestWriterPreviewPreCondition";

                var caseDescHTML = 'Loaded description of the pre-conditions:<br /><a href="/index.php?/cases/edit/'+ testCase.id +'" target="_blank" style="font-weight:bold;">[C' + testCase.id + ']</a>: ' + testCase.title + '<br />';
                //caseDescHTML += 'NOTE <i>' + testCase.custom_preconds + '</i><br />';
                caseDesc.innerHTML = caseDescHTML;

                if (testCase.custom_test_steps.length) {
                    var expectedResult = testCase.custom_test_steps[testCase.custom_test_steps.length - 1].expected;
                    caseDesc.innerHTML += '<b>Last Step Result</b>: <i>' + expectedResult.replace(/\!\[\]\(index\.php\?\/attachments\/get\/(\d+)\)/g, "") + '</i><br />';
                    var re = /index\.php\?\/attachments\/get\/(\d+)\)/g;
                    var m2;
                    while (m2 = re.exec(expectedResult)) {
                        var imgSpan = document.createElement("span");
                        imgSpan.className = 'markdown-img-container';
                        imgSpan.setAttribute('imageId', m2[1]);
                        var imgLink = document.createElement("a");
                        imgLink.className = 'fancy';
                        imgLink.setAttribute('href', "index.php?/attachments/get/"+m2[1]);
                        imgLink.setAttribute('data-caption', '[THE LAST STEP FROM THE PRE-CONDITIONS]: ' + escapeHtml(expectedResult.replace(/\!\[\]\(index\.php\?\/attachments\/get\/(\d+)\)/g, "")));
                        imgLink.innerHTML = '<img class="markdown-img" src="index.php?/attachments/get/'+m2[1]+'" alt="">';
                        imgSpan.appendChild(imgLink);
                        imgSpan.appendChild(document.createElement("br"));
                        caseDesc.appendChild(imgSpan);
                    }
                }
                screenBlock.appendChild(caseDesc);

            });
        }

    }
    function getTestCaseInSection(sectionId, suiteId, onLoadFunction) {
        var url = 'https://testrail.devfactory.com/index.php?/api/v2/get_cases/' + unsafeWindow.uiscripts.context.project.id+'&suite_id='+suiteId;
        if (sectionId) {
            url += '&section_id='+sectionId;
        }

        return GM_xmlhttpRequest ({
            method: 'GET',
            username: getUsername(),
            password: getAPIToken(),
            url:    url,
            headers: {
                "Content-Type": "application/json",
            },
            onload: onLoadFunction
        });
    }
    function getTestCase(testCaseId, onLoadFunction) {
        return GM_xmlhttpRequest ({
            method: 'GET',
            username: getUsername(),
            password: getAPIToken(),
            url:    'https://testrail.devfactory.com/index.php?/api/v2/get_case/' + testCaseId,
            headers: {
                "Content-Type": "application/json",
            },
            onload: onLoadFunction
        });
    }

    function getUsername() {
        var username = GM_getValue('testRail_USERNAME');

        if (!username) {
            GM_setValue('testRail_API_TOKEN', '');
        }

        return username;
    }


    function getAPIToken() {
        var savedToken = GM_getValue('testRail_API_TOKEN');

        if (savedToken) {
            return savedToken;
        }

        GM_xmlhttpRequest ({
            method: 'GET',
            url:    'https://testrail.devfactory.com/index.php?/mysettings',
            onload: function (responseDetails) {
                var re = /name="_token" value="([^"]+)"/g;
                var m = re.exec(responseDetails.responseText);
                var re2 = /Consts\.ajaxVersion = '([^']+)'/g;
                var m2 = re2.exec(responseDetails.responseText);
                var re3 = /id="name" maxlength="250"\s+value="([^"]+)"/g;
                var m3 = re3.exec(responseDetails.responseText);

                if (m3[1]) {
                    GM_setValue('testRail_USERNAME', m3[1]);
                }

                if (m[1] && m2[1]) {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today = mm + '/' + dd + '/' + yyyy;
                    GM_xmlhttpRequest ({
                        method: 'POST',
                        url:    'https://testrail.devfactory.com/index.php?/mysettings/ajax_get_api_token',
                        data: 'name=dfTestWriter_'+yyyy + '_' + mm + '_' + dd + '&_token=' + encodeURIComponent(m[1]) + '&_version=' + encodeURIComponent(m2[1]),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "Accept": "text/plain, */*; q=0.01",
                        },
                        onload: function (responseDetails2) {
                            var jsonResponse = JSON.parse(responseDetails2.responseText);
                            GM_xmlhttpRequest ({
                                method: 'POST',
                                url:    'https://testrail.devfactory.com/index.php?/mysettings/ajax_render_api_token',
                                data: 'name=dfTestWriter_'+yyyy + '_' + mm + '_' + dd + '&_token=' + encodeURIComponent(m[1]) + '&_version=' + encodeURIComponent(m2[1]),
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "Accept": "text/plain, */*; q=0.01",
                                },
                                onload: function (responseDetails3) {
                                    GM_setValue('testRail_API_TOKEN', jsonResponse.token);
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    getAPIToken();
    setTimeout(addHelpers, 1000);
    setInterval(addOnChangeTestRail, 1000);
    setTimeout(function() { populateListOfKnownImages = false; }, 7000);
})();