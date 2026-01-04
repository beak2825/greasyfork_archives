// ==UserScript==
// @name         D2L
// @namespace    https://greasyfork.org/users/28298
// @version      202593
// @description  Add class list and more!
// @author       Jerry
// @include      /^https:\/\/.*online.*.edu\/.*$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @noframes
// @license      GNU GPLv3
// @homepage     https://greasyfork.org/en/scripts/456237
// @require      https://greasyfork.org/scripts/456410-gmlibrary/code/GMLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/456237/D2L.user.js
// @updateURL https://update.greasyfork.org/scripts/456237/D2L.meta.js
// ==/UserScript==


setInterval(() => {
   location.reload();
}, 3600000); // keep d2l active

const D2L = 'Fxxk_D2L';

(function() {
    'use strict';

/***************************************************************************************************
                                     ####*Courses*####
****************************************************************************************************/
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://meta.zhupsy.com/static/course.json",
        responseType: "json",
        revalidate: true,
        nocache: true,
        headers: {
        "Cache-Control": "no-cache",
        },
        onload: function(response) {
            var data=response.responseXML;
            for (var i = 0; i < data.length; i++) {
                var c = data[i];
                var course = c.course;
                var courseid = c.courseid;

                if (course==3610 && courseid) { (function(courseid){
                    addbutton("📊 3610 Stats", function () {
                        window.location.href = window.location.origin + '/d2l/le/lessons/' + courseid;
                    }, 0.08*h, 0.08*w+150*-1, 130);
                })(courseid);
                }

                if (course==2999 && courseid) { (function(courseid){
                    addbutton("🧭 2999 Major", function () {
                        window.location.href = window.location.origin + '/d2l/le/lessons/' + courseid;
                    }, 0.08*h, 0.08*w+150*1, 130);
                })(courseid);
                }

                if (course==3310 && courseid) { (function(courseid){
                    addbutton("🧠 3310 Bio", function () {
                        window.location.href = window.location.origin + '/d2l/le/lessons/' + courseid;
                    }, 0.08*h, 0.08*w+150*2, 130);
                })(courseid);
                }

                if (course==3805 && courseid) { (function(courseid){
                    addbutton("🥼 3805 Research", function () {
                        window.location.href = window.location.origin + '/d2l/le/lessons/' + courseid;
                    }, 0.08*h, 0.08*w+150*3, 130);
                })(courseid);
                }

                if (course==3905 && courseid) { (function(courseid){
                    addbutton("🔬 3905 Methods", function () {
                        window.location.href = window.location.origin + '/d2l/le/lessons/' + courseid;
                    }, 0.08*h, 0.08*w+150*4, 130);
                })(courseid);
                }

                if (course==4810 && courseid) { (function(courseid){
                    addbutton("💊 4810 Drug", function () {
                        window.location.href = window.location.origin + '/d2l/le/lessons/' + courseid;
                    }, 0.08*h, 0.08*w+150*5, 130);
                })(courseid);
                }
            }
        }
    });

/***************************************************************************************************
                                     ####*Tab*####
****************************************************************************************************/
    /************************************
    ####*Manage Dates*####
    ************************************/
    if (window.location.pathname.includes('date_manager')) {
        var eall = document.getElementById('z_g')
        var especific = document.getElementById('z_h')
        var econtent = document.getElementById('z_k')
        var ediscussions = document.getElementById('z_l')
        var edropbox = document.getElementById('z_m')
        var enews = document.getElementById('z_p')
        var equizzes = document.getElementById('z_q')
        var eapply = document.getElementById('z_cl')

        function uncheck() {
          especific.click();
          if (econtent.checked==true) {econtent.click()};
          if (ediscussions.checked==true) {ediscussions.click()};
          if (edropbox.checked==true) {edropbox.click()};
          if (enews.checked==true) {enews.click()};
          if (equizzes.checked==true) {equizzes.click()};
        }

        addbutton("Edit All", async function () {
          eall.click(); eapply.click();
          var estartdate = findx('//a[@title="Sort Ascending" and text()="Start Date"]'); if (estartdate) {estartdate.click();}
        }, 0.72*h, 0.34*w+0*120, 110);

        addbutton("<b>Edit Content</b>", async function () {
          uncheck(); econtent.click(); eapply.click();
          var estartdate = findx('//a[@title="Sort Ascending" and text()="Start Date"]'); if (estartdate) {estartdate.click();}
        }, 0.72*h, 0.34*w+1*120, 110);

        addbutton("Edit Discussion", async function () {
          uncheck(); ediscussions.click(); eapply.click();
          var estartdate = findx('//a[@title="Sort Ascending" and text()="Start Date"]'); if (estartdate) {estartdate.click();}
        }, 0.72*h, 0.34*w+2*120, 110);

        addbutton("<b>Edit Dropbox</b>", async function () {
          uncheck(); edropbox.click(); eapply.click();
          var estartdate = findx('//a[@title="Sort Ascending" and text()="Start Date"]'); if (estartdate) {estartdate.click();}
          var assignments = document.querySelectorAll('input[value^="D2L.LE.Dropbox.Dropbox-"]');
          var course = location.href.split('ou=')[1];
          var url = location.origin+'/d2l/lms/dropbox/admin/folders_quickedit.d2l?'
          // https://online.eiu.edu/d2l/lms/dropbox/admin/folders_quickedit.d2l?dbl=231312&dbl=231313&ou=232520
          for (var i = 0; i < assignments.length; i++) {
              var id = assignments[i].value.split('-')[1];
              url += 'dbl=' + id + '&'
          }
          url += 'ou=' + course
          GM_openInTab(url,false)
        }, 0.72*h, 0.34*w+3*120, 110);

        addbutton("Edit News", async function () {
          uncheck(); enews.click(); eapply.click();
          var estartdate = findx('//a[@title="Sort Ascending" and text()="Start Date"]'); if (estartdate) {estartdate.click();}
        }, 0.72*h, 0.34*w+4*120, 110);

        addbutton("<b>Edit Quizzes</b>", async function () {
          uncheck(); equizzes.click(); eapply.click();
          var estartdate = findx('//a[@title="Sort Ascending" and text()="Start Date"]'); if (estartdate) {estartdate.click();}
        }, 0.72*h, 0.34*w+5*120, 110);

    }

    /************************************
    ####*Manage Grades*####
    ************************************/
    if (window.location.pathname.includes('gradeslist.d2l')) {
      var course = location.href.split('ou=')[1];
      var links = document.querySelectorAll('a[onclick^="goto"]')
      for (var i = 0; i < links.length; i++) {
        var id = links[i].onclick.toString().split(' ')[3];
        if (links[i].onclick.toString().includes('gotoNewEditCatProps')) {
          links[i].href = location.origin+"/d2l/lms/grades/admin/manage/category_props_newedit.d2l?objectId="+id+"&ou="+course
        } else {
          links[i].href = location.origin+"/d2l/lms/grades/admin/manage/item_props_newedit.d2l?objectId="+id+"&ou="+course
        }
        links[i].target="_blank";
        links[i].removeAttribute('onclick')
      }

      addbutton("Edit All/Selected", async function () {
        var checks = document.querySelectorAll('input[type="checkbox"]');
        // convert from nodelist
        checks = Array.from(checks); checks.reverse(); checks.pop(); checks.reverse();
        var checkmode = false;
        for (var i = 0; i < checks.length; i++) {
          if (checks[i].checked==true) {checkmode=true; break}
        }

        var links = document.links;
        var links2 = [];
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.includes('.d2l?objectId=')) {links2.push(links[i])}
        }
        links = links2;
        for (var i = links.length-1; i >= 0; i--) {
            var link = links[i];
            if (link.href.includes('.d2l?objectId=')) {
              var url = link.href;
              if (checkmode && checks[i].checked==false) {continue;}
              var tab = GM_openInTab(url, true); // openInBackground
              await asleep(500);
            }
          }
      }, 0.31*h, 0.34*w, 130);
    }

    /************************************
    ####*Dropbox*####
    ************************************/
    if (window.location.pathname.includes('folders_manage')) {
      var links = document.links;
      for (var i = 0; i < links.length; i++) {
        if (links[i].href.includes('mark/folder_submissions_')) {
          links[i].target="_blank";
        }
      }

      addbutton("Edit All/Selected", async function () {
        var checks = document.querySelectorAll('input[type="checkbox"]');
        // convert from nodelist
        checks = Array.from(checks); checks.reverse(); checks.pop(); checks.reverse();
        var checkmode = false;
        for (var i = 0; i < checks.length; i++) {
          if (checks[i].checked==true) {checkmode=true; break}
        }

        var links = document.links;
        var links2 = [];
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.includes('mark/folder_submissions_')) {links2.push(links[i])}
        }
        links = links2;
        for (var i = links.length-1; i >= 0; i--) {
            var link = links[i];
            if (link.href.includes('mark/folder_submissions_')) {
              var url = link.href;
              url = url.replace('mark/folder_submissions_users.d2l?','modify/folder_newedit_properties.d2l?');
              url = url.replace('mark/folder_submissions_observed.d2l?','modify/folder_newedit_properties.d2l?');
              if (checkmode && checks[i].checked==false) {continue;}
              var tab = GM_openInTab(url, true); // openInBackground
              await asleep(500);
            }
          }
      }, 0.31*h, 0.34*w, 130);
    }

    /************************************
    ####*Quiz*####
    ************************************/
    // quiz link default behavior & quiz late
    if (window.location.pathname.includes('quizzes_manage')) {
      // change default click from edit --> grade (to be consistent with dropbox behavior)
      var links = document.links;
      for (var i = 0; i < links.length; i++) {
        if (links[i].href.includes('modify/quiz_newedit_properties.d2l?')) {
          links[i].href = links[i].href.replace('modify/quiz_newedit_properties.d2l?','mark/quiz_mark_users.d2l?');
          links[i].target="_blank";
        }
      }

      addbutton("Edit All/Selected", async function () {
        var checks = document.querySelectorAll('input[type="checkbox"]');
        // convert from nodelist
        checks = Array.from(checks); checks.reverse();
        var checkmode = false;
        for (var i = 0; i < checks.length; i++) {
          if (checks[i].checked==true) {checkmode=true; break}
        }

        var links = document.links;
        var links2 = [];
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.includes('modify/quiz_newedit_properties.d2l?') || links[i].href.includes('mark/quiz_mark_users.d2l?')) {links2.push(links[i])}
        }
        links = links2;
        for (var i = links.length-1; i >= 0; i--) {
            var link = links[i];
            if (link.href.includes('modify/quiz_newedit_properties.d2l?') || link.href.includes('mark/quiz_mark_users.d2l?')) {
              var url = link.href;
              url = url.replace('mark/quiz_mark_users.d2l?', 'modify/quiz_newedit_properties.d2l?');
              if (checkmode && checks[i].checked==false) {continue;}
              var tab = GM_openInTab(url, true); // openInBackground
              await asleep(500);
          }
        }
      }, 0.31*h, 0.34*w, 130);

      localStorage.remove(D2L);

      addbutton("Quiz Late", async function () {
        const regex = /Quiz.*\d/;
        localStorage.set(D2L,{});
        var links = document.links;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var quiz_name = link.innerText;
            if (regex.test(quiz_name)) {
            // if (link.href.includes('modify/quiz_newedit_properties.d2l?') || link.href.includes('mark/quiz_mark_users.d2l?')) {
              var url = link.href;
              url = url.replace('modify/quiz_newedit_properties.d2l?','mark/quiz_mark_users.d2l?');
              var tab = GM_openInTab(url, true); // openInBackground
              var key = quiz_name.trim().replace(' ','_').trim();
              while (true) {
                await asleep(100);
                // has the web successfully stored data in local storage?
                var db = localStorage.get(D2L);
                if (Object.keys(db).includes(key)) {
                  break;
                }
              }
              // tab.onclose = () => console.log('tab is closed');
              // tab.close();  // not working
            }
        }; // done all quizzes
        db = localStorage.get(D2L); var output ='';
        for (const [key, value] of Object.entries(db)) {
          output += '=======================\n'
          output += key.replace('_',' ') + '\n';
          output += value;
        }
        console.log(output)
        GM_setClipboard(output,"text");
        alert(output);
        localStorage.remove(D2L);
      }, 0.14*h, 0.34*w, 88);
    };

    // quiz late helper
    if (window.location.pathname.includes('quiz_mark_users')) {
      if (localStorage.has(D2L)) {
        setTimeout(function() {
        var text = document.documentElement.innerText;
        var lines = text.split('\n'); var output ='';
        var haslate = 0;
        for (var l = 0; l < lines.length; l++) {
          if (lines[l].includes('Grade Quiz - ')) {
            var quiz_name = lines[l].split(' - ').slice(-1)[0].trim().replace(' ','_').trim();
          }
          if (lines[l].includes('attempt 1')) {
            // may not have attempt 2, but should always have attempt 1
            var attempt2 = 0; var late2 = false; var penalty2 = 0;
            var name = lines[l-1].trim();               // safari
            if (name == '') {name = lines[l-2].trim();} // firefox
            var list = lines[l+1].trim().split(' ').slice(-3);
            var attempt1 = parseFloat(list[0].split('\t')[1]);
            var late1 = lines[l+1].includes('Submitted late');
            var penalty1;
            if (late1) {
              penalty1 = (attempt1*0.8).toFixed(1);  // 20% off
            } else {
              penalty1 = attempt1;
            }
          }
          if (lines[l].includes('attempt 2')) {
            var list = lines[l+1].trim().split(' ').slice(-3);
            var attempt2 = parseFloat(list[0].split('\t')[1]);
            var late2 = lines[l+1].includes('Submitted late');
            var penalty2;
            if (late2) {
              penalty2 = (attempt2*0.8).toFixed(1);  // 20% off
            } else {
              penalty2 = attempt2;
            }
          }
          if (lines[l].includes('attempt 3')) {
            alert('3 attempts found! Check manually.\nConfirm to continue.');
          }
          if (lines[l].includes('overall grade')) {
            var penalty;
            if (penalty1 >= penalty2) {
              penalty = penalty1;
            } else {
              penalty = penalty2;
            }

            // overall is not needed
            var overall = parseFloat(lines[l+1].trim().split('/')[0].trim());

            if ((late1==true || late2==true) && (penalty < overall)) {
              output += name + ' --> ' + penalty + '\n';
              output += 'attempt1: ' + attempt1 + '; late: ' + late1 + '; 20% off: ' + penalty1 + '\n';
              if (attempt2>0) {output += 'attempt2: ' + attempt2 + '; late: ' + late2 + '; 20% off: ' + penalty2 + '\n';}
              output += '\n';
              haslate = 1;
            }
          }
        }
        localStorage.assign(D2L, {[quiz_name]: output})
        if (haslate==0) {window.close();}
        // window.close();
        haslate = 0;
        }, 500); // Wait for page loading before processing
      }
    };

    /************************************
    ####*Discussion*####
    ************************************/
    if (window.location.pathname.includes('discussions/topics')) {
      var links = document.links;
      for (var i = 0; i < links.length; i++) {
        if (links[i].href.includes('discussions/threads')) {
          links[i].target="_blank";
        }
      }

      localStorage.remove(D2L);

      addbutton("Thumb Up", async function () {
        localStorage.set(D2L,{});
        var links = document.links;
        for (var i = 0; i < links.length; i++) {
          var url = links[i].href;
          if (url.includes('discussions/threads')) {
            GM_openInTab(url, false); // openInBackground
            var key = url;
            while (true) {
              await asleep(500);
              // has the web successfully stored data in local storage?
              var db = localStorage.get(D2L);
              if (Object.keys(db).includes(key)) {
                break;
              }
            }
          }
        }
        localStorage.remove(D2L);
      }, 0.14*h, 0.08*w, 88);

      addbutton("Assess Topic", function () {
        var parts = window.location.href.split('/');
        window.location.href = window.location.origin + '/d2l/lms/discussions/admin/assess_topic_user.d2l?ou=' + parts[5] + '&topicId=' + parts[8];
      }, 0.14*h, 0.08*w+100, 100);

    };

    // discussion helper
    if (window.location.pathname.includes('discussions/threads')) {
      if (localStorage.has(D2L)) {

        async function thumbup() {
          // only trigger when upvote is 0
          // if (! document.getElementsByClassName('d2l-updownvote-up d2l-updownvote-active')[0]) {
          //   findx('//input[@type="radio"]').click();
          // }
          if (document.getElementsByClassName('d2l-updownvote-votes')[0].title=="Up Votes: 0") {
            document.getElementsByClassName('d2l-updownvote-up')[0].click();
          }
          // wait response before close
          await asleep(1000);
          var key = location.href;
          localStorage.assign(D2L, {[key]: 'Done!'})
          window.close();
        }

        // has to wait (also note setTimeout is not the same as asleep!)
        var id = setTimeout(thumbup, 2000);

//         // escape: wait for even longer before moving to next
//         // escape works with keydown, keyup, not keypress (not sure if due to karabiner remapping)
//         // https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
//         window.addEventListener('keyup', function (e) {
//         if (e.keyCode == 27 || e.which == 27) {
//           // alert('More time.');
//           clearTimeout(id);
//           id = setTimeout(thumbup, 1000*30*1);
//         }
//         });

//         // enter or remapped enter: skip now
//         window.addEventListener('keydown', function (e) {
//         if (e.keyCode == 13 || e.which == 13) {
//           // alert('Skip now.');
//           clearTimeout(id);
//           thumbup();
//         }
//         });

        //
        Mousetrap.bind('esc', function() {
          // alert('More time.');
          clearTimeout(id);
          id = setTimeout(thumbup, 1000*30*1);
          return false;
        });

        Mousetrap.bind('enter', function() {
          // alert('Skip now.');
          clearTimeout(id);
          thumbup();
          return false;
        });

      }
    };

    /************************************
    ####*Grading Dropbox*####
    ************************************/
    if (window.location.pathname.includes('d2l/le/activities')) {
      function injectevent() {
        var grade = querySelectorAllShadows('.d2l-input')[0];
        grade.setAttribute('onmouseover',"this.focus();this.select()"); grade.setAttribute('onclick',"this.focus();this.select()");
      }

      function focusgrade() {
        var grade = querySelectorAllShadows('.d2l-input')[0];
        grade.focus();
        grade.select();
      }

      function alllornone() {
        // auto assign grades for discussion and dropbox submission
        // var total = querySelectorAllShadows('.d2l-grade-result-numeric-score-score-text')[0].innerText.split('/ ')[1];
        var total = querySelectorAllShadows('.d2l-input')[0].outerHTML.split('Overall grade out of ')[1].split('"')[0];
        var grade = querySelectorAllShadows('.d2l-input')[0];
        var no_assessable_posts = querySelectorAllShadows('.d2l-consistent-evaluation-no-assessable-posts');
        var no_submissions = querySelectorAllShadows('.d2l-consistent-evaluation-no-submissions');
        if (no_assessable_posts.length > 0 || no_submissions.length > 0) {
          grade.value = '0';
        } else {
          grade.value = total;
        }
      }

      function savegrade() {
        var grade = querySelectorAllShadows('.d2l-input')[0];
        // weird: input then change to trigger D2L submit (XHR PATCH to save grade)
        triggerevent(grade,'input');
        triggerevent(grade,'change');
      }

      function gotonext() {
        var next = querySelectorAllShadows('[aria-label="Next"]')[0];
        next.click();
      }

      function savedraft() {
        var button = querySelectorAllShadows('.d2l-button-container');
        for (var i = 0; i < button.length; i++) {
          if ((button[i].innerText=="Save Draft") || (button[i].innerText=="Retract")) {
            button[i].children[0].click()
            break;
          }
        }
      }

      function activatepreview() {
        // skip if no discussion, no dropbox submission, or is not dropbox submission (i.e., discussion)
        var no_assessable_posts = querySelectorAllShadows('.d2l-consistent-evaluation-no-assessable-posts');
        var no_submissions = querySelectorAllShadows('.d2l-consistent-evaluation-no-submissions');
        var submissions = querySelectorAllShadows('.d2l-consistent-evaluation-submission-list-view')
        if (no_assessable_posts.length > 0 || no_submissions.length > 0 || submissions.length == 0) {
          return false;
        }

        // remind if dropbox submission is late
        // evaluate before open preview; otherwise it would be empty
        if (querySelectorAllShadows('.d2l-consistent-evaluation-submission-list-view')[0].innerHTML.includes('late=')) {
          alert('Attention: late submission!')
        }

        var file=querySelectorAllShadows('.d2l-submission-attachment-list-item-flexbox')[0]
        var waspreviewoff=(file != undefined)
        if (waspreviewoff) {file.children[0].click();}

        return waspreviewoff; // true if just triggered preview
      }

      setTimeout(injectevent, 8000);
      setTimeout(focusgrade, 8000);
      // setTimeout(activatepreview, 8000); // Do not activate, KM macro needs to download files
      // setTimeout(alllornone, 8000); // a temporary grade

      addbutton('Auto (All or None)', async function(){
        var n = parseFloat(querySelectorAllShadows('.d2l-iterator-text')[0].innerText.split(' of ')[1]);
        // setTimeout does not work in a loop, do not know why
        for (var i = 1; i <= n; i++) {
          savedraft();            // retract first if any
          alllornone();
          savegrade();
          await asleep(2000);  // give time for XRH PATCH; otherwise, it will remind "Unsaved Changes".
          savedraft();

          var current = parseFloat(querySelectorAllShadows('.d2l-iterator-text')[0].innerText.split(' of ')[0].split(' ')[1]);
          if (current==n) {break;}

          await asleep(2000);
          gotonext();
          await asleep(2000);
        }
      },0.23*h, 0.8*w);

      // https://stackoverflow.com/a/16221678/2292993
      // https://stackoverflow.com/a/21098528/2292993
      // https://github.com/ccampbell/mousetrap/issues/288
      // setAttribute('class','mousetrap'); not working
      // asleep triggers default function of hotkey, but setTimeout does not
      Mousetrap.prototype.stopCallback = function () {return false;}
      Mousetrap.bind('tab', function() {
          // console.log(e.target);
          if (activatepreview()) {
            setTimeout(savedraft);  // retract first if any
            // setTimeout(alllornone); // a temporary grade
            setTimeout(focusgrade);
          } else {
            setTimeout(savegrade);  // save grade
            setTimeout(savedraft, 2000); // give time to save grade
            setTimeout(gotonext, 2000);   // give time to save draft
            setTimeout(activatepreview, 5000); // give time to load before preview
            setTimeout(savedraft);
            // setTimeout(alllornone);
            setTimeout(focusgrade);
          }
          return false;
      });
    }

/***************************************************************************************************
                                     ####*General*####
****************************************************************************************************/
    // hide instructor from submission/grading table
    setTimeout(function() {
      // Find all links that might contain student names
      var links = document.querySelectorAll('a.d2l-link.d2l-link-inline');

      for (var i = 0; i < links.length; i++) {
        var name = links[i].textContent.trim();

        if (name === 'Jian Student Zhu' || name === 'Jian Zhu') {
          // Find the outermost TR (skip nested table TRs)
          var currentElement = links[i];
          var outerRow = null;

          while (currentElement) {
            if (currentElement.tagName === 'TR') {
              outerRow = currentElement;
            }
            currentElement = currentElement.parentElement;
          }

          if (outerRow) {
            outerRow.style.cssText = 'display: none !important; visibility: hidden !important;';
          }
        }
      }
    }, 5000);

    // sorting students
    var page = findx('//select[@title="Results Per Page"]');
    if (page !== null) {
      var last = page.options[page.options.length-1].value;
      if (page.value!=last) {
          page.value = last;
          triggerevent(page,'change');
      }
    }
    // always sort by first name (a-->z)
    // 1. outdated
    // setTimeout(function() {
    //   var sortby = findx('//*[@title="Sort by First Name"]');
    //   if (sortby !== null) {
    //     if ( sortby.getAttributeNames().includes('nosort') || ((!sortby.getAttributeNames().includes('nosort')) && (sortby.getAttribute('data-d2l-table-next-sort-dir')=='asc')) ) {
    //       triggerevent(sortby,'click');
    //     }
    //   }
    // }, 3000);
    //
    // 2. always, not ideal
    // setTimeout(function() {
    //   // Find the "First Name, A to Z" sort button item
    //   var sortby = findx('//d2l-table-col-sort-button-item[@data-fieldname="FirstName" and @value="FirstNameAsc"]');

    //   if (sortby !== null) {
    //     var isSelected = sortby.hasAttribute('selected');
    //     var ariaChecked = sortby.getAttribute('aria-checked');

    //     // Click if not already selected (aria-checked="false" or no selected attribute)
    //     if (!isSelected || ariaChecked === 'false') {
    //       triggerevent(sortby, 'click');
    //     }
    //   }
    // }, 3000);
    //
    // 3. smart
    // Set flag immediately when any sort button is clicked
    (function() {
      document.addEventListener('click', function(e) {
        // Check if clicked on or inside a sort button
        var sortButton = e.target.closest('d2l-table-col-sort-button-item, d2l-table-col-sort-button');
        if (sortButton) {
          // Store timestamp of manual click
          sessionStorage.setItem('lastSortClick', Date.now().toString());
        }
      }, true);
    })();
    // Auto-sort logic
    setTimeout(function() {
      var lastClick = sessionStorage.getItem('lastSortClick');

      if (lastClick) {
        var timeSinceClick = Date.now() - parseInt(lastClick);

        // If click was within last n seconds, it was a manual sort that just refreshed
        if (timeSinceClick < 10000) {
          return; // Don't auto-sort
        }
      }
      // Proceed with auto-sort
      var sortby = findx('//d2l-table-col-sort-button-item[@data-fieldname="FirstName" and @value="FirstNameAsc"]');

      if (sortby !== null) {
        var isSelected = sortby.hasAttribute('selected');
        var ariaChecked = sortby.getAttribute('aria-checked');

        if (!isSelected || ariaChecked === 'false') {
          triggerevent(sortby, 'click');
        }
      }
    }, 3000);

    // var links = document.getElementsByClassName('bti-job-detail-link');
    // var links = document.links;
    // for (var i = 0; i < links.length; i++){
    //     links[i].target="_blank";
    // }
    // document.documentElement.innerHTML

})(); // end of main function

/***************************************************************************************************
                                     ####*Internal*####
****************************************************************************************************/
// internal functions; require does not work in MeddleMonkey
// match violentmonkey supports * anywhere in url
// GM_notification requires macOS to turn on notification for browser
// https://violentmonkey.github.io/api/gm/
// https://www.tampermonkey.net/documentation.php?ext=dhdg
function addbutton(text,func,top,left,width,height) {
    //top, left, [width[, height]] in px
    // e.g., width 100px, height 25px
    // https://stackoverflow.com/a/1535421/2292993
    if (window.top != window.self) {
        return;
    }   //don't run on frames or iframes

    let btn = document.createElement("button");
    btn.innerHTML = text;
    document.body.appendChild(btn);
    btn.addEventListener("click", func);

    btn.style.cssText = "border-radius: 5px; border:1px solid black; background-color:#D3D3D3; color:black";
    btn.style.position = 'absolute';
    btn.style.top = top+'px';
    btn.style.left = left+'px';
    if (width !== undefined) {btn.style.width = width+'px';}
    if (height !== undefined) {btn.style.height = height+'px';}
    console.log("top: " + top + 'px' + " left: " + left + 'px');
}

// must call with await in async function; otherwise not working
function asleep(ms) {
    // setTimeout(()=>{console.log("Sleeping...");},3000);
    console.log("Sleeping " + ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function hget (url) {
    // https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
    // https://wiki.greasespot.net/GM.xmlHttpRequest
    // https://stackoverflow.com/a/65561572/2292993
    return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      // headers: {
      //   "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
      //   "Accept": "text/html"            // If not specified, browser defaults will be used.
      // },
      onload: function(response) {
        var responseXML = null;
        if (!response.responseXML) {
          responseXML = new DOMParser()
            .parseFromString(response.responseText, "text/html");
        } else {
          responseXML = response.responseXML;
        }
        resolve(responseXML);
        // console.log([
        //   response.status,
        //   response.statusText,
        //   response.readyState,
        //   response.responseHeaders,
        //   response.responseText,
        //   response.finalUrl,
        //   responseXML
        // ].join("\n"));
      },
      onerror: function(error) {
        reject(error);
      }
    });
    });
}

// https://github.com/zevero/simpleWebstorage
/*
Wonder how this works?
Storage is the Prototype of both localStorage and sessionStorage.
Got it?

localStorage.set('myKey',{a:[1,2,5], b: 'ok'}); //can set a json Object
localStorage.assign('myKey',{a:[6], c:42});     //shallow merge using Object.assign
localStorage.has('myKey');                      // --> true
localStorage.get('myKey');                      // --> {a:[6], b: 'ok', c:42}
localStorage.keys();                            // --> ['myKey']
localStorage.remove('myKey');                   // -

native:
localStorage.clear();
localStorage.length;
*/
Storage.prototype.set = function(key, obj) {
  var t = typeof obj;
  if (t==='undefined' || obj===null ) this.removeItem(key);
  this.setItem(key, (t==='object')?JSON.stringify(obj):obj);
  return obj;
};
Storage.prototype.get = function(key) {
  var obj = this.getItem(key);
  try {
     var j = JSON.parse(obj);
     if (j && typeof j === "object") return j;
   } catch (e) { }
   return obj;
};
Storage.prototype.assign = function(key, obj_merge) {
  var obj = this.get(key);
  if (typeof obj !== "object" || typeof obj_merge !== "object") return null;
  Object.assign(obj, obj_merge);
  return this.set(key,obj);
};

Storage.prototype.has = Storage.prototype.hasOwnProperty;
Storage.prototype.remove = Storage.prototype.removeItem;

Storage.prototype.keys = function() {
  return Object.keys(this.valueOf());
};

/**
 * Finds all elements in the entire page matching `selector`, even if they are in shadowRoots.
 * Just like `querySelectorAll`, but automatically expand on all child `shadowRoot` elements.
 * @see https://stackoverflow.com/a/71692555/2228771
 */
function querySelectorAllShadows(selector, el = document.body) {
  // recurse on childShadows
  const childShadows = Array.from(el.querySelectorAll('*')).
    map(el => el.shadowRoot).filter(Boolean);

  // console.log('[querySelectorAllShadows]', selector, el, `(${childShadows.length} shadowRoots)`);

  const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));

  // fuse all results into singular, flat array
  const result = Array.from(el.querySelectorAll(selector));
  return result.concat(childResults).flat();
}

function findx(xpath) {
  // e.g., findx('//select[@title="Results Per Page"]')
  // returns null if not found
  return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
}

function triggerevent(element,event) {
  // e.g., triggerevent (page,'change')
  let changeEvent = new Event(event);
  element.dispatchEvent(changeEvent);
}

/* mousetrap v1.6.5 craig.is/killing/mice */
/*
https://github.com/ccampbell/mousetrap
By default all keyboard events will not fire if you are inside of a textarea, input, or select to prevent undesirable things from happening.
If you want them to fire you can add the class mousetrap to the element. <textarea name="message" class="mousetrap"></textarea>

Supported Keys
For modifier keys you can use shift, ctrl, alt, or meta.
You can substitute option for alt and command for meta.
Other special keys are backspace, tab, enter, return, capslock, esc, escape, space, pageup, pagedown, end, home, left, up, right, down, ins, del, and plus.
Any other key you should be able to reference by name like a, /, $, *, or =.

Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');
  There is a third argument you can use to specify the type of event to listen for. It can be keypress, keydown or keyup.
  It is recommended that you leave this argument out if you are unsure. Mousetrap will look at the keys you are binding and determine whether it should default to keypress or keydown.

Mousetrap.bind(['command+k', 'ctrl+k'], function() {
    console.log('command k or control k');

    // return false to prevent default browser behavior
    // and stop event from bubbling
    return false;
});

Mousetrap.unbind
Mousetrap.trigger
Mousetrap.stopCallback
Mousetrap.reset
Mousetrap.handleKey
Mousetrap.addKeycodes
*/
(function(q,u,c){function v(a,b,g){a.addEventListener?a.addEventListener(b,g,!1):a.attachEvent("on"+b,g)}function z(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return n[a.which]?n[a.which]:r[a.which]?r[a.which]:String.fromCharCode(a.which).toLowerCase()}function F(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function A(a,b){var g,d=[];var e=a;"+"===e?e=["+"]:(e=e.replace(/\+{2}/g,"+plus"),e=e.split("+"));for(g=0;g<e.length;++g){var m=e[g];B[m]&&(m=B[m]);b&&"keypress"!=b&&C[m]&&(m=C[m],d.push("shift"));w(m)&&d.push(m)}e=m;g=b;if(!g){if(!p){p={};for(var c in n)95<c&&112>c||n.hasOwnProperty(c)&&(p[n[c]]=c)}g=p[e]?"keydown":"keypress"}"keypress"==g&&d.length&&(g="keydown");return{key:m,modifiers:d,action:g}}function D(a,b){return null===a||a===u?!1:a===b?!0:D(a.parentNode,b)}function d(a){function b(a){a=
a||{};var b=!1,l;for(l in p)a[l]?b=!0:p[l]=0;b||(x=!1)}function g(a,b,t,f,g,d){var l,E=[],h=t.type;if(!k._callbacks[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(l=0;l<k._callbacks[a].length;++l){var c=k._callbacks[a][l];if((f||!c.seq||p[c.seq]==c.level)&&h==c.action){var e;(e="keypress"==h&&!t.metaKey&&!t.ctrlKey)||(e=c.modifiers,e=b.sort().join(",")===e.sort().join(","));e&&(e=f&&c.seq==f&&c.level==d,(!f&&c.combo==g||e)&&k._callbacks[a].splice(l,1),E.push(c))}}return E}function c(a,b,c,f){k.stopCallback(b,
b.target||b.srcElement,c,f)||!1!==a(b,c)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function e(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=z(a);b&&("keyup"==a.type&&y===b?y=!1:k.handleKey(b,F(a),a))}function m(a,g,t,f){function h(c){return function(){x=c;++p[a];clearTimeout(q);q=setTimeout(b,1E3)}}function l(g){c(t,g,a);"keyup"!==f&&(y=z(g));setTimeout(b,10)}for(var d=p[a]=0;d<g.length;++d){var e=d+1===g.length?l:h(f||
A(g[d+1]).action);n(g[d],e,f,a,d)}}function n(a,b,c,f,d){k._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var e=a.split(" ");1<e.length?m(a,e,b,c):(c=A(a,c),k._callbacks[c.key]=k._callbacks[c.key]||[],g(c.key,c.modifiers,{type:c.action},f,a,d),k._callbacks[c.key][f?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:f,level:d,combo:a}))}var k=this;a=a||u;if(!(k instanceof d))return new d(a);k.target=a;k._callbacks={};k._directMap={};var p={},q,y=!1,r=!1,x=!1;k._handleKey=function(a,
d,e){var f=g(a,d,e),h;d={};var k=0,l=!1;for(h=0;h<f.length;++h)f[h].seq&&(k=Math.max(k,f[h].level));for(h=0;h<f.length;++h)f[h].seq?f[h].level==k&&(l=!0,d[f[h].seq]=1,c(f[h].callback,e,f[h].combo,f[h].seq)):l||c(f[h].callback,e,f[h].combo);f="keypress"==e.type&&r;e.type!=x||w(a)||f||b(d);r=l&&"keydown"==e.type};k._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)n(a[d],b,c)};v(a,"keypress",e);v(a,"keydown",e);v(a,"keyup",e)}if(q){var n={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",
18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},r={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},C={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},B={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p;for(c=1;20>c;++c)n[111+c]="f"+c;for(c=0;9>=c;++c)n[c+96]=c.toString();d.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};d.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};d.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};d.prototype.reset=function(){this._callbacks={};
this._directMap={};return this};d.prototype.stopCallback=function(a,b){if(-1<(" "+b.className+" ").indexOf(" mousetrap ")||D(b,this.target))return!1;if("composedPath"in a&&"function"===typeof a.composedPath){var c=a.composedPath()[0];c!==a.target&&(b=c)}return"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};d.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};d.addKeycodes=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b]);p=null};
d.init=function(){var a=d(u),b;for(b in a)"_"!==b.charAt(0)&&(d[b]=function(b){return function(){return a[b].apply(a,arguments)}}(b))};d.init();q.Mousetrap=d;"undefined"!==typeof module&&module.exports&&(module.exports=d);"function"===typeof define&&define.amd&&define(function(){return d})}})("undefined"!==typeof window?window:null,"undefined"!==typeof window?document:null);
