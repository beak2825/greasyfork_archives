// ==UserScript==
// @name         Better Coursera
// @namespace    http://mcimino.reaktix.com/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.coursera.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30139/Better%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/30139/Better%20Coursera.meta.js
// ==/UserScript==

window.data = [];
window.data2 = [];
window.ID = {};
window.slug = {};

setTimeout(function (){
    /*a = document.querySelectorAll('.bt3-btn-success');
    for (i=0;i<a.length;i++){
        if (a[i].textContent='View Course'){
            a[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none';
        }
    }*/
    
    a = document.querySelectorAll("[data-js='course-nameundefined']");
    for (i=0;i<a.length;i++){
        b = a[i].href;
        c = b.match("/learn/([^/]*)");
        if (c.length>0){
            a[i].id = "Learn"+c[1];
            d = c[1];
            console.log(i,a[i],d);
            //f = new Function('data',"alert(a["+i+"])");
            //https://www.coursera.org/api/onDemandCourses.v1?q=slug&slug=html
            //data.elements[0].id
            //https://www.coursera.org/api/onDemandSessionMemberships.v1/?q=activeByUserAndCourse&userId=1343075&includes=sessions&courseId=%s
            //sd = new Date(data2.linked['onDemandSessions.v1'][0].startedAt)
            //sd.getMonth() .getDate() .getYear()
            
            //===============================================
            //https://www.coursera.org/api/onDemandCourses.v1?q=slug&slug=html
            //data.elements[0].id
            //https://www.coursera.org/api/onDemandSessionMemberships.v1/?q=activeByUserAndCourse&userId=1343075&includes=sessions&courseId=%s
            //sd = new Date(data2.linked['onDemandSessions.v1'][0].startedAt)
            //sd.getMonth() .getDate() .getYear()
            f = function(data){
                id = data.elements[0].id;
                window.data.push(data);
                //window.ID[id] = data.elements[0].slug;
                //slug = data.elements[0].slug;
                //window.slug[slug] = {};
                //window.slug[slug].name =data.elements[0].name;
                //window.slug[slug].id = id;
                //window.slug[slug].launch = data.elements[0].plannedLaunchDate;
                g = window['Learn'+data.elements[0].slug];
                g.name = g.id;
                g.id = id;
                
                h = "window.data2.push(data2);";
                h += "e = document.createElement('span');"
                h += "if (data2.linked['onDemandSessions.v1'].length>0){";
                h += "sd = new Date(data2.linked['onDemandSessions.v1'][0].startedAt);";
                h += "e.textContent = ' ('+(1+sd.getMonth())+'-'+sd.getDate()+'-'+(sd.getYear()+1900)+')';";
                //h += "a[" + i + "].appendChild(e);}";
                h += "k = window[data2.linked['onDemandSessions.v1'][0].courseId];";
                h += "k.appendChild(e);";
                h += "}";
                j = new Function('data2',h);
                $.getJSON('https://www.coursera.org/api/onDemandSessionMemberships.v1/?q=activeByUserAndCourse&userId=1343075&includes=sessions&courseId='+id,j);
                
            };
            //===============================================
            
            //f = new Function('data',g);
            //console.log(f);
            $.getJSON("https://www.coursera.org/api/onDemandCourses.v1?q=slug&slug="+d, f);
            //e = document.createElement('span');e.textContent = ' ('+data.elements[0].plannedLaunchDate+')';a["+i+"].appendChild(e);"
        }
    }
},2000);