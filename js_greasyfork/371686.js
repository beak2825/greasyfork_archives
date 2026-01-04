// ==UserScript==
// @name         Cucked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  By
// @author       Dad
// @match        http://*/*
// @grant        none
// @run-at       document-end
// @include      http://mygju.gju.edu.jo*
// @include      https://mygju.gju.edu.jo*
// @include      file:///C:/Users/Troll_000/Desktop/My%20Study%20Plan%20Offered%20Courses.html
// @include      file:///C:/Users/Troll_000/Desktop/Courseadd2.html
//   x.setAttribute( "onclick", "javascript: PrimeFaces.ab({source:'j_idt26:std_menu_bar_id:j_idt30'});return false;" );
// @downloadURL https://update.greasyfork.org/scripts/371686/Cucked.user.js
// @updateURL https://update.greasyfork.org/scripts/371686/Cucked.meta.js
// ==/UserScript==


function inject(func) {
    var source = func.toString();
    var script = document.createElement('script');
    script.innerHTML = "(" + source + ")()";
    document.body.appendChild(script);
}

function he() {
    var array = ["GERL302","IE325","GERL302","ENE312"];
    var sections = ["1","1","5","1"];
    var iterator = 0 ;
    if (localStorage.getItem("iter")>0) {
        iterator = localStorage.getItem("iter")%array.length;
    }
    console.log(iterator);
    var secdone = 0;
    if (localStorage.getItem("sec")) {
        secdone = localStorage.getItem("sec")%array.length;
    }
    // iterator = localStorage.getItem("iter");
    var i =0;
    var j =0;
    if (window.location.href == "https://mygju.gju.edu.jo/faces/welcome_page.xhtml" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/welcome_page.xhtml" ||
    	window.location.href == "https://mygju.gju.edu.jo/faces/study_plan_gen/view_std_study_plan.xhtml" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/study_plan_gen/view_std_study_plan.xhtml") {
        var dx = document.getElementById("j_idt27:std_menu_bar_id:j_idt42");
        setTimeout(function() {
            dx.click();
            // this code will run after the duration elaspes
        }, 1000);
    }
    if (window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/student_registration/student_blocked_registration.xhtml" || window.location.href == "https://mygju.gju.edu.jo/faces/student_registration/student_blocked_registration.xhtml") {
        var x = document.getElementById("j_idt27:std_menu_bar_id:j_idt42");
        console.log(iterator);
        localStorage.setItem("sec",0);
        setTimeout(function() {
            x.click();
            // this code will run after the duration elaspes
        }, 1000);
    }
    if (window.location.href == "https://mygju.gju.edu.jo/faces/student_registration/student_current_schedule.xhtml" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/student_registration/student_current_schedule.xhtml") {
        document.getElementById("form:add_button").click();
    }
    if (window.location.href == "https://mygju.gju.edu.jo/faces/student_registration/student_offered_courses.xhtml" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/student_registration/sstudent_offered_courses.xhtml" || window.location.href =="file:///C:/Users/Troll_000/Desktop/My%20Study%20Plan%20Offered%20Courses.html" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/study_plan_gen/view_std_study_plan.xhtml") {
        console.log();
        var tr = document.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td");
            if (td[0]) {
                if ((td[0].textContent == array[iterator] || td[0].textContent.search(array[iterator]) == 77) ) {
                    if (tr[i].getElementsByTagName("a")[0]) {
                        iterator++;
                        localStorage.setItem("iter",iterator);
                        console.log("Clicked at "+td[0].textContent);
                        console.log(iterator);
                        tr[i].getElementsByTagName("a")[0].click();
                        break ;


                    } else {
                        iterator++;
                        console.log("no link");
                        localStorage.setItem("iter",iterator) ;
                        location.reload();
                        break;

                    } }

            }

        }
        iterator++;
                        console.log("no link");
                        localStorage.setItem("iter",iterator) ;
                        location.reload();
    }
    if (window.location.href == "https://mygju.gju.edu.jo/faces/student_registration/offered_course_sections.xhtml" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/student_registration/offered_course_sections.xhtml" || window.location.href == "file:///C:/Users/Troll_000/Desktop/Courseadd2.html") {
        console.log(secdone == 0 );
        if (secdone ==  0) {
            console.log("valid");
            var div = document.getElementById("form:section_tbl") ;
            var trd = div.getElementsByTagName("tr");
            for (i = 0; i < trd.length; i++) {
                var tdx = trd[i].getElementsByTagName("td");
                if (tdx[0]) {
                    if (tdx[0].textContent == sections[iterator-1]) {
                        if(trd[i].getElementsByTagName("a")[0]){
                        console.log("Clicked at "+tdx[tdx.length-1].getElementsByTagName("a")[0].innerHTML);
                        trd[i].getElementsByTagName("a")[0].click();

                        }
                        localStorage.setItem("sec",1);
                        break;
                        
                    }


                }

            }
            setTimeout(function(){localStorage.setItem("sec",0);
            console.log("xd");
            window.location.href = "https://mygju.gju.edu.jo/faces/welcome_page.xhtml" ;},50);


        }
        else {
                        console.log("xd");

            localStorage.setItem("sec",0);
            window.location.href = 'https://mygju.gju.edu.jo/faces/welcome_page.xhtml';

        }
    }

}

(function() {
    'use strict';
    inject(he);

})();