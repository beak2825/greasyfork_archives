// ==UserScript==
// @name         Leaps ++
// @namespace    http://tampermonkey.net/
// @version      RC1.0
// @description  Leaps addons for better experience
// @author       Fishyboat21
// @match        http://leaps.kalbis.ac.id/LMS/lectures/course-list*
// @icon         https://www.google.com/s2/favicons?domain=ac.id
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435860/Leaps%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/435860/Leaps%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Pop Up
    var mdl = document.createElement("DIV");
    mdl.id = "me-modal";
    document.body.appendChild(mdl);
    //Main Variable Declare
    var btn = document.createElement("DIV");
    btn.id = "me-holderer";
    btn.style.display = "none";
    document.body.appendChild(btn);
    var table = document.getElementsByTagName('thead');
    var body = document.getElementsByTagName('tbody');
    var mytd = document.getElementsByClassName("mytabledata");
    var mytd2 = document.getElementsByClassName("mytabledata2");
    var pos = 0;
    var course = [];
    table[0].children[0].innerHTML += "<th width='100px'>Tugas</th>";//Redisign Table
    table[0].children[0].innerHTML += "<th width='100px'>Quick Access</th>";//Redisign Table

    var links = document.getElementsByTagName('a');
//Get Course
    for (var i = 0 ; i < links.length; i++)
    {
        var temp = links[i].getAttribute('href');
        var temp2 = temp.replace("http://","");
        var temp3 = temp2.split("/");
        var cid;
        if(temp3[4] != null && temp3[2] == "lectures" && temp3[5] == "home"){
            cid = temp3[4];
            console.log(temp);
            course.push(cid);
            body[0].children[pos].innerHTML += '<td class="mytabledata"></td>';
            body[0].children[pos].innerHTML += '<td class="mytabledata2"><button type="button" class="btn btn-warning" data-toggle="modal" onclick="window.location.href ='+"'"+'http://leaps.kalbis.ac.id/LMS/lectures/detail/'+cid+'/attendance'+"'"+';">Attandance</button></td>';
            pos += 1;

        }

    }
    
//Get Assignment
    function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}


    for(var j =0; j < course.length; j++){
        var request = makeHttpObject();
            request.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200)
                    // Get Assignment List
                    document.getElementById('me-holderer').innerHTML = request.responseText;

                var assign = [];
                var assid = [];
                for (var i = 0 ; i <  links.length; i++)
                {
                    // Create Button
                    var temp = links[i].getAttribute('href');
                    var temp2 = temp.replace("http://","");
                    var temp3 = temp2.split("/");

                    if(temp3[6] != null && temp3[5] == "assignments" ){
                        assign.push(temp);
                        assid.push(temp3[7]);
                    }

                }

                for (var q = 0; q < assign.length; q++ ){
                    var index = q+1;
                    if(q == assign.length-1){
                        mytd[j].innerHTML += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#josephmodal-'+assid[q]+'">Tugas ( Lastest )</button>'
                        document.getElementById('me-modal').innerHTML += `<div class="modal fade" id="josephmodal-`+assid[q]+`" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Tugas Terbaru</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <iframe src="`+assign[q]+`" height="500" width="100%" title="Iframe Example"></iframe>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="window.location.href =`+"'"+assign[q]+"'"+`;">Go to Assignment Page</button>
      </div>
    </div>
  </div>
</div>`;
                        //mytd[j].innerHTML += '<p onclick="window.location.href ='+"'"+assign[q]+"'"+';"><b>Tugas ( Lastest )</b></p>';
                    } else {
                        mytd[j].innerHTML += '<button type="button" class="btn btn-secondary" onclick="window.location.href ='+"'"+assign[q]+"'"+';">Tugas '+index+' </button>';
                    }
                    mytd[j].innerHTML += '<p></p>';

                }
                //Clear Temporary Div
                document.getElementById('me-holderer').innerHTML = "";
            };
            request.open("GET", "http://leaps.kalbis.ac.id/LMS/lectures/detail/"+course[j]+"/assignments", false);
            request.send(null);
    }







})();